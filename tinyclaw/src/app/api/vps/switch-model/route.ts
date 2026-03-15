import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Client } from "ssh2";
import { getOrCreateUser } from "@/lib/auth-utils";

export const maxDuration = 300;

const MODEL_MAP: Record<string, { provider: string; envKey: string; displayName: string; ocModel: string }> = {
  claude: { provider: "anthropic", envKey: "ANTHROPIC_API_KEY", displayName: "Claude 4.6", ocModel: "anthropic/claude-sonnet-4-6" },
  gpt:    { provider: "openai",    envKey: "OPENAI_API_KEY",    displayName: "GPT-5.2",          ocModel: "openai/gpt-4o" },
  gemini: { provider: "google-vertex", envKey: "GOOGLE_VERTEX_SA_JSON_B64", displayName: "Gemini 3", ocModel: "google-vertex/gemini-3-flash-preview" },
};

export async function POST(req: Request) {
  try {
    const { user: existing, userId } = await getOrCreateUser();
    if (!userId || !existing) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (existing.status !== "ready") return NextResponse.json({ error: "Agent not ready" }, { status: 400 });

    let newModel = "claude";
    try {
      const body = await req.json();
      if (body.model && MODEL_MAP[body.model]) newModel = body.model;
    } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

    if (newModel === existing.selectedModel) {
      return NextResponse.json({ status: "ok", message: "Already using this model" });
    }

    const cfg = MODEL_MAP[newModel] || MODEL_MAP.claude;
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b8d1d9bd-5ec5-48b2-9988-495a5b2ca1b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'switch-model/route.ts:31',message:'[H1] model switch config resolved',data:{newModel,displayName:cfg.displayName,ocModel:cfg.ocModel},timestamp:Date.now(),hypothesisId:'H1',runId:'run1'})}).catch(()=>{});
    // #endregion
    const HOST = process.env.SHARED_VPS_HOST;
    const PASS = process.env.SHARED_VPS_PASSWORD;
    const isShared = existing.hetznerServerId?.startsWith("shared-");

    if (!isShared || !HOST || !PASS) {
      return NextResponse.json({ error: "VPS configuration not found" }, { status: 400 });
    }

    const shortId = existing.hetznerServerId!.replace("shared-", "");
    const cn = `tc-${shortId}`;
    const dir = `/opt/tinyclaw/users/${shortId}`;
    const addr = existing.vpsIp || "";
    const port = addr.includes(":") ? addr.split(":")[1] : "19013";

    console.log(`[SWITCH] ${existing.email}: ${existing.selectedModel} → ${newModel} (${cn})`);

    // ====================================================================
    // 安全策略：先停容器 → 改配置 → 启动容器（绝不先 rm）
    // Gemini 需要额外 env vars，所以 Gemini 需要 rm + run
    // 但 rm 只在配置准备好之后执行，且失败时有 fallback
    // ====================================================================

    // Step 1: 停止容器（但不删除，保留回退能力）
    await run(HOST, PASS, `docker stop ${cn} 2>/dev/null; true`, 20000);

    // Step 2: 更新 auth-profiles.json（host 文件系统，容器已停）
    const profileKey = `${cfg.provider}:default`;
    if (cfg.provider === "google-vertex") {
      // Gemini: 写入 SA JSON
      const saB64 = process.env.GOOGLE_VERTEX_SA_JSON_B64 || "";
      await run(HOST, PASS, `echo '${saB64}' | base64 -d > ${dir}/.gcp-sa.json && chmod 600 ${dir}/.gcp-sa.json`);
      // 清空 auth-profiles（Vertex 不用 API key，用 SA JSON）
      await run(HOST, PASS, `node -e "
const fs=require('fs');
const p='${dir}/.openclaw/agents/main/agent/auth-profiles.json';
const d={version:1,profiles:{},lastGood:{},usageStats:{}};
try{fs.mkdirSync(require('path').dirname(p),{recursive:true})}catch{}
fs.writeFileSync(p,JSON.stringify(d,null,2));
"`);
    } else {
      // Claude / GPT: 写入 API key
      const apiKey = process.env[cfg.envKey] || "";
      await run(HOST, PASS, `node -e "
const fs=require('fs');
const p='${dir}/.openclaw/agents/main/agent/auth-profiles.json';
let d={version:1,profiles:{},lastGood:{},usageStats:{}};
try{d=JSON.parse(fs.readFileSync(p))}catch{}
d.profiles['${profileKey}']={type:'token',provider:'${cfg.provider}',token:'${apiKey}'};
d.lastGood={'${cfg.provider}':'${profileKey}'};
try{fs.mkdirSync(require('path').dirname(p),{recursive:true})}catch{}
fs.writeFileSync(p,JSON.stringify(d,null,2));
"`);
    }

    // Step 3: 更新 openclaw.json（auth + model）
    await run(HOST, PASS, `node -e "
const fs=require('fs');
const p='${dir}/.openclaw/openclaw.json';
const c=JSON.parse(fs.readFileSync(p));
c.auth={profiles:{'${profileKey}':{provider:'${cfg.provider}',mode:'token'}}};
fs.writeFileSync(p,JSON.stringify(c,null,2));
"`);

    // Step 4: 启动容器
    const isGemini = cfg.provider === "google-vertex";
    if (isGemini) {
      // Gemini 需要新 env vars → 必须 rm + run
      await run(HOST, PASS, `docker rm ${cn} 2>/dev/null; true`, 10000);
      const dockerCmd = `docker run -d \
  --name ${cn} --restart always --network host --memory 2g --cpus 1.0 \
  -e NODE_OPTIONS='--max-old-space-size=1536' -e HOME=/root \
  -e GOOGLE_APPLICATION_CREDENTIALS=/root/.openclaw/.gcp-sa.json \
  -e GOOGLE_CLOUD_PROJECT=${process.env.GOOGLE_VERTEX_PROJECT_ID || "tinyclaw-prod"} \
  -e GOOGLE_CLOUD_LOCATION=${process.env.GOOGLE_VERTEX_LOCATION || "global"} \
  -v ${dir}/.gcp-sa.json:/root/.openclaw/.gcp-sa.json:ro \
  -v ${dir}/.openclaw:/root/.openclaw \
  openclaw:latest openclaw gateway --port ${port} --bind lan`;
      const runOut = await run(HOST, PASS, dockerCmd, 30000);
      console.log("[SWITCH] docker run:", runOut.slice(0, 80));
    } else {
      // Claude / GPT → 直接 start（容器还在，只是 stopped）
      const startOut = await run(HOST, PASS, `docker start ${cn} 2>&1`, 20000);
      console.log("[SWITCH] docker start:", startOut.slice(0, 80));

      // 如果容器不存在（被之前的失败删掉了），重建
      if (startOut.includes("No such container") || startOut.includes("not found")) {
        console.log("[SWITCH] Container missing, recreating...");
        const dockerCmd = `docker run -d \
  --name ${cn} --restart always --network host --memory 2g --cpus 1.0 \
  -e NODE_OPTIONS='--max-old-space-size=1536' -e HOME=/root \
  -v ${dir}/.openclaw:/root/.openclaw \
  openclaw:latest openclaw gateway --port ${port} --bind lan`;
        await run(HOST, PASS, dockerCmd, 30000);
      }
    }

    // Step 5: Health check（12×5s = 60s，足够 OpenClaw 启动）
    let healthy = false;
    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const code = await run(HOST, PASS, `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${port} || echo '000'`, 8000);
      console.log(`[SWITCH] health ${i + 1}/12: ${code.trim()}`);
      if (code.trim() === "200") { healthy = true; break; }
    }

    if (!healthy) {
      const logs = await run(HOST, PASS, `docker logs ${cn} 2>&1 | tail -15`, 10000);
      console.error("[SWITCH] FAILED — gateway not up:", logs);
      return NextResponse.json({ error: "Model switch timed out — please refresh and retry" }, { status: 500 });
    }

    // Step 6: 在容器内设置默认模型
    const setOut = await run(HOST, PASS, `docker exec ${cn} openclaw models set ${cfg.ocModel} 2>&1 || true`, 15000);
    console.log("[SWITCH] models set:", setOut.slice(0, 80));
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/b8d1d9bd-5ec5-48b2-9988-495a5b2ca1b3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'switch-model/route.ts:144',message:'[H1] models set command executed',data:{ocModel:cfg.ocModel,setOut:setOut.slice(0,120)},timestamp:Date.now(),hypothesisId:'H1',runId:'run1'})}).catch(()=>{});
    // #endregion

    // Step 7: 读取最新 gateway token 并同步到 DB
    const token = await run(HOST, PASS,
      `node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('${dir}/.openclaw/openclaw.json')).gateway.auth.token||'')"`, 10000
    );

    await db.update(users).set({
      selectedModel: newModel,
      ...(token && token.length > 10 ? { gatewayToken: token.trim() } : {}),
    }).where(eq(users.clerkId, userId));

    console.log(`[SWITCH] OK: → ${newModel}, token synced`);
    return NextResponse.json({ status: "ok", model: newModel, displayName: cfg.displayName });

  } catch (err: any) {
    console.error("[SWITCH ERROR]", err?.message || err);
    return NextResponse.json({ error: "Model switch failed: " + (err?.message || "unknown"), }, { status: 500 });
  }
}

function run(host: string, pass: string, cmd: string, timeout = 60000): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let out = "";
    let done = false;
    const t = setTimeout(() => { if (!done) { done = true; conn.end(); reject(new Error(`SSH timeout: ${cmd.slice(0, 60)}`)); } }, timeout);
    conn.on("ready", () => {
      conn.exec(cmd, (err, s) => {
        if (err) { clearTimeout(t); conn.end(); reject(err); return; }
        s.on("close", () => { clearTimeout(t); if (!done) { done = true; conn.end(); resolve(out.trim()); } })
         .on("data", (d: Buffer) => { out += d.toString(); })
         .stderr.on("data", (d: Buffer) => { out += d.toString(); });
      });
    }).on("error", e => { clearTimeout(t); if (!done) { done = true; reject(e); } })
      .connect({ host, port: 22, username: "root", password: pass, readyTimeout: 10000 });
  });
}
