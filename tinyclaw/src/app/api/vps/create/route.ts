import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse, after } from "next/server";
import { Client } from "ssh2";
import { getOrCreateUser } from "@/lib/auth-utils";
import { stripe } from "@/lib/stripe";
import crypto from "crypto";

// Vercel 函数最大执行时长
export const maxDuration = 300;

// Vertex AI 认证方式：不通过 --auth-choice，而是通过环境变量 + SA JSON
// GOOGLE_APPLICATION_CREDENTIALS + GOOGLE_CLOUD_PROJECT + GOOGLE_CLOUD_LOCATION
// 然后设默认模型为 google-vertex/gemini-3-flash-preview
const MODEL_CONFIG: Record<string, {
  provider: string;
  envKey: string;
  authChoice: string;
  isVertexAI?: boolean;
  defaultModel?: string;
}> = {
  claude: { provider: "anthropic", envKey: "ANTHROPIC_API_KEY", authChoice: "anthropic-api-key", defaultModel: "anthropic/claude-sonnet-4-6" },
  gpt: { provider: "openai", envKey: "OPENAI_API_KEY", authChoice: "openai-api-key" },
  gemini: {
    provider: "google-vertex",
    envKey: "GOOGLE_VERTEX_SA_JSON_B64",
    authChoice: "skip",
    isVertexAI: true,
    defaultModel: "google-vertex/gemini-3-flash-preview",
  },
};

function generateShortId(userId: string): string {
  return "u" + crypto.createHash("sha256").update(userId).digest("hex").slice(0, 11);
}

function buildOpenClawConfig(opts: {
  port: number;
  vpsHost: string;
  gatewayToken: string;
  telegramToken?: string;
  discordToken?: string;
  enableWhatsapp?: boolean;
  defaultModel?: string;
}): Record<string, unknown> {
  const config: Record<string, unknown> = {
    meta: { lastTouchedVersion: "2026.3.8", lastTouchedAt: new Date().toISOString() },
    wizard: { lastRunAt: new Date().toISOString(), lastRunVersion: "2026.3.8", lastRunCommand: "onboard", lastRunMode: "local" },
    agents: { defaults: { workspace: "/root/.openclaw/workspace", compaction: { mode: "safeguard" }, maxConcurrent: 4, subagents: { maxConcurrent: 8 } } },
    messages: { ackReactionScope: "group-mentions" },
    commands: { native: "auto", nativeSkills: "auto", restart: true },
    channels: {} as Record<string, unknown>,
    gateway: {
      port: opts.port, mode: "local", bind: "lan",
      controlUi: {
        allowInsecureAuth: true, dangerouslyDisableDeviceAuth: true,
        allowedOrigins: [`http://${opts.vpsHost}:${opts.port}`],
      },
      auth: { mode: "token", token: opts.gatewayToken },
      tailscale: { mode: "off", resetOnExit: false },
    },
    plugins: { entries: {} as Record<string, unknown> },
  };

  const channels = config.channels as Record<string, unknown>;
  const plugins = (config.plugins as Record<string, unknown>).entries as Record<string, unknown>;

  if (opts.telegramToken) {
    channels.telegram = { botToken: opts.telegramToken };
    plugins.telegram = { enabled: true };
  }
  if (opts.discordToken) {
    channels.discord = { token: opts.discordToken };
    plugins.discord = { enabled: true };
  }
  if (opts.enableWhatsapp) {
    channels.whatsapp = { dmPolicy: "pairing" };
  }
  if (opts.defaultModel) {
    const agents = config.agents as Record<string, unknown>;
    const defaults = agents.defaults as Record<string, unknown>;
    defaults.model = { primary: opts.defaultModel };
  }

  return config;
}

function getVPSPassword(host: string): string {
  if (process.env.SHARED_VPS_HOST_2 && host === process.env.SHARED_VPS_HOST_2) {
    return process.env.SHARED_VPS_PASSWORD_2 || "";
  }
  return process.env.SHARED_VPS_PASSWORD || "";
}

// 多 VPS 负载均衡：检查两台 VPS 的可用内存，返回有空余的那台
async function selectBestVPS(): Promise<{ host: string; password: string }> {
  const vps2Host = (process.env.SHARED_VPS_HOST_2 || "").trim();
  const vps2Pass = (process.env.SHARED_VPS_PASSWORD_2 || "").trim();
  // VPS2 已配置则新用户直接走 VPS2，VPS1 只服务存量用户
  if (vps2Host && vps2Pass) {
    console.log(`[VPS-SELECT] Routing new user to VPS2 (${vps2Host})`);
    return { host: vps2Host, password: vps2Pass };
  }
  const vps1 = { host: (process.env.SHARED_VPS_HOST || "").trim(), password: (process.env.SHARED_VPS_PASSWORD || "").trim() };
  console.log(`[VPS-SELECT] VPS2 not configured, falling back to VPS1`);
  return vps1;
}

export async function POST(req: Request) {
  try {
  const { user: existing, userId } = await getOrCreateUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 读取模型选择 + 渠道 Token
  let model = "claude";
  let channel = "telegram";
  let telegramToken = "";
  let discordToken = "";
  let stripeSessionId = "";
  try {
    const body = await req.json();
    if (body.model && MODEL_CONFIG[body.model]) model = body.model;
    if (body.channel) channel = body.channel;
    if (body.telegramToken && typeof body.telegramToken === "string") telegramToken = body.telegramToken.trim();
    if (body.discordToken && typeof body.discordToken === "string") discordToken = body.discordToken.trim();
    if (body.stripeSessionId && typeof body.stripeSessionId === "string") stripeSessionId = body.stripeSessionId.trim();
  } catch {}

  // WhatsApp 不需要用户提供 token，选择该渠道时直接在配置中开启
  const enableWhatsapp = channel === "whatsapp";

  // ===== 订阅门控 =====
  if (
    existing &&
    existing.status !== "ready" &&
    existing.status !== "creating" &&
    existing.status !== "subscribed" &&
    existing.subscriptionStatus !== "active" &&
    existing.subscriptionStatus !== "trialing"
  ) {
    // webhook 可能还未处理完 — 用 Stripe session 直接验证支付状态
    if (stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
          expand: ["subscription"],
        });
        if (session.payment_status === "paid" || session.status === "complete") {
          // 支付已完成，webhook 还未处理 — 手动同步 DB 并继续部署
          const sub = session.subscription as any;
          await db.update(users).set({
            subscriptionStatus: sub?.status ?? "trialing",
            status: "subscribed",
            ...(sub?.id ? { stripeSubscriptionId: sub.id } : {}),
            ...(sub?.current_period_end ? { subscriptionCurrentPeriodEnd: new Date(sub.current_period_end * 1000) } : {}),
          }).where(eq(users.clerkId, userId));
          // 更新 existing 让后续逻辑继续
          (existing as any).status = "subscribed";
          (existing as any).subscriptionStatus = sub?.status ?? "trialing";
          // 不返回 402，继续走部署流程
        } else {
          return NextResponse.json(
            { error: "Subscription required", redirect: "/subscribe" },
            { status: 402 }
          );
        }
      } catch (stripeErr: any) {
        console.error("[GATE] Stripe session verify failed:", stripeErr?.message);
        return NextResponse.json(
          { error: "Subscription required", redirect: "/subscribe" },
          { status: 402 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Subscription required", redirect: "/subscribe" },
        { status: 402 }
      );
    }
  }

  if (existing?.status === "ready") {
    // 从 vpsIp 推断该用户在哪台 VPS（支持多 VPS）
    const storedHostChk = existing.vpsIp?.split(":")?.[0] || process.env.SHARED_VPS_HOST;
    const SHARED_HOST_CHK = storedHostChk;
    const SHARED_PASS_CHK = getVPSPassword(SHARED_HOST_CHK || "");
    if (SHARED_HOST_CHK && SHARED_PASS_CHK && existing.vpsIp && existing.hetznerServerId?.startsWith("shared-")) {
      const shortIdChk = existing.hetznerServerId!.replace("shared-", "");
      const containerChk = `tc-${shortIdChk}`;
      const userDirChk = `/opt/tinyclaw/users/${shortIdChk}`;
      try {
        // 单个 SSH 命令完成所有检查：容器状态 + 读端口/token + 端口监听
        const checkOutput = await executeSSHCommand(
          SHARED_HOST_CHK, SHARED_PASS_CHK,
          `CN=$(docker ps --filter name=${containerChk} --format '{{.Names}}' 2>/dev/null || echo ''); if [ "$CN" = "${containerChk}" ]; then CFG=$(node -e "try{const c=JSON.parse(require('fs').readFileSync('${userDirChk}/.openclaw/openclaw.json'));process.stdout.write(c.gateway.port+'|'+(c.gateway.auth.token||''))}catch{process.stdout.write('|')}" 2>/dev/null || echo '|'); PORT=$(echo "$CFG" | cut -d'|' -f1); TOKEN=$(echo "$CFG" | cut -d'|' -f2); LISTEN=$(ss -tlnp | grep -q ":$PORT " 2>/dev/null && echo Y || echo N); echo "RUNNING|$PORT|$TOKEN|$LISTEN"; else echo "STOPPED|||"; fi`
        );
        console.log("[DOCKER] ready-check result:", checkOutput.slice(0, 120));
        const parts = checkOutput.trim().split("|");
        const [containerStatus, actualPort, actualToken, listening] = parts;

        if (containerStatus === "RUNNING") {
          if (listening === "Y" && actualPort) {
            const correctIp = `${SHARED_HOST_CHK}:${actualPort}`;
            if (correctIp !== existing.vpsIp || (actualToken && actualToken !== existing.gatewayToken)) {
              await db.update(users).set({ vpsIp: correctIp, gatewayToken: actualToken }).where(eq(users.clerkId, userId));
              console.log("[DOCKER] Synced DB ip to", correctIp);
            }
            return NextResponse.json({ status: "ready", ip: correctIp });
          }
          console.log("[DOCKER] Container running but port not yet listening, returning ready");
          return NextResponse.json({ status: "ready", ip: existing.vpsIp });
        }
        console.log("[DOCKER] DB=ready but container not running, rebuilding");
        await db.update(users).set({ status: "creating" }).where(eq(users.clerkId, userId));
      } catch (chkErr: any) {
        console.error("[DOCKER] Health check on ready failed:", chkErr?.message);
        await db.update(users).set({ status: "creating" }).where(eq(users.clerkId, userId));
      }
    } else {
      return NextResponse.json({ status: "ready", ip: existing.vpsIp });
    }
  }

  // 恢复模式
  if (
    (existing?.status === "creating" || existing?.status === "error") &&
    existing.hetznerServerId &&
    existing.vpsPassword
  ) {
    // ===== 共享 VPS 恢复：检查 Docker 容器是否已运行 =====
    if (existing.hetznerServerId.startsWith("shared-") && existing.vpsIp) {
      // 从 vpsIp 推断该用户在哪台 VPS（支持多 VPS）
      const storedHostRec = existing.vpsIp?.split(":")?.[0] || process.env.SHARED_VPS_HOST;
      const SHARED_HOST = storedHostRec;
      const SHARED_PASS = getVPSPassword(SHARED_HOST || "");
      if (SHARED_HOST && SHARED_PASS) {
        try {
          const vpsAddr = existing.vpsIp;
          const port = vpsAddr.includes(":") ? vpsAddr.split(":")[1] : "19013";
          // 检查 gateway 是否响应
          const check = await executeSSHCommand(
            SHARED_HOST,
            SHARED_PASS,
            `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${port} || echo '000'`
          );
          if (check.trim() === "200") {
            // 容器已健康，直接标记 ready
            await db
              .update(users)
              .set({ status: "ready", selectedModel: model })
              .where(eq(users.clerkId, userId));
            console.log("[RECOVERY] Shared VPS container already healthy, set ready:", existing.vpsIp);
            return NextResponse.json({ status: "ready", ip: existing.vpsIp });
          }
          // 容器未响应 → 走正常的共享 VPS 创建流程（会重新创建容器）
          console.log("[RECOVERY] Shared VPS container not healthy, will recreate");
        } catch (e: any) {
          console.error("[RECOVERY] Shared VPS check failed:", e?.message);
          // 出错也走正常创建流程
        }
      }
    } else {
      // ===== 独立 Hetzner VPS 恢复 =====
      await db
        .update(users)
        .set({ status: "creating", selectedModel: model, createdAt: new Date() })
        .where(eq(users.clerkId, userId));

      after(async () => {
        await continueInit(userId, existing.hetznerServerId!, existing.vpsPassword!, model);
      });
      return NextResponse.json({ status: "creating" });
    }
  }

  // 更新用户状态为 creating
  if (!existing) {
    await db.insert(users).values({
      clerkId: userId,
      status: "creating",
      selectedModel: model,
      source: "tinyclaw",
    });
  } else {
    await db
      .update(users)
      .set({ status: "creating", selectedModel: model, source: "tinyclaw", createdAt: new Date() })
      .where(eq(users.clerkId, userId));
  }

  // === 部署模式选择（多 VPS 负载均衡）===
  let SHARED_VPS_HOST = process.env.SHARED_VPS_HOST;
  let SHARED_VPS_PASSWORD = process.env.SHARED_VPS_PASSWORD;
  // 如果配置了 VPS2，动态选择内存充足的那台
  if (SHARED_VPS_HOST && SHARED_VPS_PASSWORD && process.env.SHARED_VPS_HOST_2) {
    const selected = await selectBestVPS();
    SHARED_VPS_HOST = selected.host;
    SHARED_VPS_PASSWORD = selected.password;
  }
  const HETZNER_TOKEN = process.env.HETZNER_API_TOKEN;
  const vpsPassword = generatePassword();

  // ====== 模式 1: 共享 VPS + Docker 隔离（每用户一个容器）======
  // 使用 SSHSession 复用单个 SSH 连接（解决 sshd MaxStartups 连接限制导致 docker run 执行不到的 bug）
  let earlyDbWriteDone = false;
  if (SHARED_VPS_HOST && SHARED_VPS_PASSWORD) {
    const ssh = new SSHSession(SHARED_VPS_HOST, SHARED_VPS_PASSWORD);
    try {
      console.log("[DOCKER] Creating OpenClaw container on shared host:", SHARED_VPS_HOST);
      const _t0 = Date.now();

      const shortId = generateShortId(userId);
      const userDir = `/opt/tinyclaw/users/${shortId}`;
      const containerName = `tc-${shortId}`;


      // 检查现有容器 + 端口（单命令）
      const existCheck = await ssh.exec(
        `CN=$(docker ps --filter name=${containerName} --format '{{.Names}}' 2>/dev/null || echo ''); if [ "$CN" = "${containerName}" ]; then CFG=$(node -e "try{const c=JSON.parse(require('fs').readFileSync('${userDir}/.openclaw/openclaw.json'));process.stdout.write(c.gateway.port+'|'+(c.gateway.auth.token||''))}catch{process.stdout.write('|')}" 2>/dev/null || echo '|'); PORT=$(echo "$CFG" | cut -d'|' -f1); TOKEN=$(echo "$CFG" | cut -d'|' -f2); LISTEN=$(ss -tlnp | grep -q ":$PORT " 2>/dev/null && echo Y || echo N); echo "RUNNING|$PORT|$TOKEN|$LISTEN"; else echo "STOPPED|||"; fi`
      );
      const parts = existCheck.trim().split("|");
      if (parts[0] === "RUNNING" && parts[3] === "Y" && parts[1]) {
        const vpsAddr = `${SHARED_VPS_HOST}:${parts[1]}`;
        await db.update(users).set({
          status: "ready", vpsIp: vpsAddr, hetznerServerId: `shared-${shortId}`,
          selectedModel: model, gatewayToken: parts[2] || null,
        }).where(eq(users.clerkId, userId));
        console.log("[DOCKER] Reused healthy container:", vpsAddr, "elapsed:", Date.now() - _t0, "ms");
        ssh.close();
        return NextResponse.json({ status: "ready", ip: vpsAddr });
      }
      if (parts[0] === "RUNNING") {
        console.log("[DOCKER] Container running but port not listening, will rebuild");
      }

      // 原子端口分配：用 flock 防止并发分配到同一端口
      const portStr = await ssh.exec(
        `flock -w 10 /tmp/tc-port.lock sh -c '
USED=$(ss -tlnp 2>/dev/null | grep -oP ":\\K(190[0-9]{2})" | sort -u; cat /tmp/tc-ports-reserved 2>/dev/null)
for p in $(seq 19000 19100); do
  echo "$USED" | grep -qx "$p" || { echo "$p" >> /tmp/tc-ports-reserved; echo $p; break; }
done'`
      );
      const port = parseInt(portStr.trim(), 10);
      if (isNaN(port) || port < 19000 || port > 19100) throw new Error(`Invalid port: ${portStr}`);
      console.log("[DOCKER] Allocated port:", port, "container:", containerName);

      const modelConfig = MODEL_CONFIG[model] || MODEL_CONFIG.claude;
      const platformKeyDir = `/opt/tc/${shortId}`;
      const saB64 = process.env.GOOGLE_VERTEX_SA_JSON_B64;
      const openaiKey = process.env.OPENAI_API_KEY;

      // 平台密钥写入 + 创建目录结构（单命令）
      const keysCmd = [
        `mkdir -p ${userDir}/.openclaw/{agents/main/agent,canvas,cron,logs,memory,skills,workspace,identity,devices}`,
        `mkdir -p ${platformKeyDir}`,
        saB64 ? `echo '${saB64}' | base64 -d > ${platformKeyDir}/gcp-sa.json && chmod 600 ${platformKeyDir}/gcp-sa.json && echo 'GCP_OK'` : "echo 'GCP_SKIP'",
        openaiKey ? `echo '${openaiKey}' > ${platformKeyDir}/openai.key && chmod 600 ${platformKeyDir}/openai.key && echo 'OPENAI_OK'` : "echo 'OPENAI_SKIP'",
      ].join(" && ");
      const keysResult = await ssh.exec(keysCmd);
      console.log("[DOCKER] Keys setup:", keysResult.slice(-80));

      const gatewayToken = crypto.randomBytes(24).toString("hex");
      const ocConfig = buildOpenClawConfig({
        port, vpsHost: SHARED_VPS_HOST, gatewayToken,
        telegramToken: telegramToken || undefined,
        discordToken: discordToken || undefined,
        enableWhatsapp,
        defaultModel: modelConfig.defaultModel,
      });
      const ocConfigJson = JSON.stringify(ocConfig, null, 2);
      await ssh.exec(`cat > ${userDir}/.openclaw/openclaw.json << 'OCEOF'\n${ocConfigJson}\nOCEOF`);
      console.log("[DOCKER] Config written directly (no onboard), port:", port);

      // v2026.3.8+ 需要 identity/device.json（网关自身 Ed25519 身份）
      const identityScript = `
const crypto = require('crypto');
const fs = require('fs');
const kp = crypto.generateKeyPairSync('ed25519', {
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
const pubDer = crypto.createPublicKey(kp.publicKey).export({ type: 'spki', format: 'der' });
const devId = crypto.createHash('sha256').update(pubDer).digest('hex');
fs.writeFileSync('${userDir}/.openclaw/identity/device.json', JSON.stringify({
  version: 1, deviceId: devId,
  publicKeyPem: kp.publicKey, privateKeyPem: kp.privateKey,
  createdAtMs: Date.now()
}, null, 2));
fs.writeFileSync('${userDir}/.openclaw/devices/paired.json', '{}');
fs.writeFileSync('${userDir}/.openclaw/devices/pending.json', '{}');
console.log('identity:' + devId);
`;
      const identityResult = await ssh.exec(`cat > /tmp/tc-identity.js << 'IDEOF'\n${identityScript}\nIDEOF\nnode /tmp/tc-identity.js`);
      console.log("[DOCKER] Device identity created:", identityResult.trim());

      // auth-profiles: 写入所有平台 key，用户可自由切换模型
      {
        const anthropicKey = (process.env.ANTHROPIC_API_KEY || "").trim();
        const openaiKey2 = (process.env.OPENAI_API_KEY || "").trim();
        const profiles: Record<string, unknown> = {};
        const lastGood: Record<string, string> = {};
        const usageStats: Record<string, unknown> = {};
        if (anthropicKey && !anthropicKey.startsWith("mock-")) {
          profiles["anthropic:default"] = { type: "token", provider: "anthropic", token: anthropicKey };
          lastGood["anthropic"] = "anthropic:default";
          usageStats["anthropic:default"] = { lastUsed: Date.now(), errorCount: 0 };
        }
        if (openaiKey2 && !openaiKey2.startsWith("mock-")) {
          profiles["openai:default"] = { type: "token", provider: "openai", token: openaiKey2 };
          lastGood["openai"] = "openai:default";
          usageStats["openai:default"] = { lastUsed: Date.now(), errorCount: 0 };
        }
        if (Object.keys(profiles).length > 0) {
          const authProfilesJson = JSON.stringify({ version: 1, profiles, lastGood, usageStats });
          await ssh.exec(
            `echo '${authProfilesJson.replace(/'/g, "'\\''")}' > ${userDir}/.openclaw/agents/main/agent/auth-profiles.json && chmod 600 ${userDir}/.openclaw/agents/main/agent/auth-profiles.json`
          );
          console.log("[DOCKER] auth-profiles.json written with", Object.keys(profiles).join("+"));
        }
      }

      const channelOnboardingStep =
        channel === "discord" ? "4. The user has connected a Discord Bot — remind them to DM the bot or @mention it in their server to start chatting there"
        : channel === "telegram" ? "4. Ask if they want to connect Telegram so they can chat anywhere (if not already done)"
        : "4. Ask which channel they'd like to connect (Telegram, Discord, etc.) so they can chat anywhere";
      const bootstrapMd = [
        "# BOOTSTRAP.md — TinyClaw New User Onboarding", "",
        "You are a personal AI assistant deployed via TinyClaw.dev on a private cloud server.",
        "This is the user's first session. Your job right now is to warmly onboard them.", "",
        "## Your Persona",
        "- Name yourself something friendly (e.g. 'Claw' or let the user choose)",
        "- You are their private 24/7 AI assistant running on their own server",
        `- You can use any model they selected, install Skills from ClawHub, and connect channels like ${channel === "discord" ? "Discord" : "Telegram"}`, "",
        "## Onboarding Flow (follow this order)",
        "1. Greet the user warmly, tell them their private OpenClaw is live",
        "2. Ask what they'd mainly like help with (work/productivity, learning, personal tasks, coding, etc.)",
        "3. Based on their answer, suggest 2-3 relevant Skills from clawhub.ai they can install",
        channelOnboardingStep,
        "5. Ask what they'd like you to be called, and what to call them — save both to USER.md and SOUL.md",
        "6. Once done, delete this BOOTSTRAP.md file", "",
        "## Key Differences (remind them naturally during conversation)",
        "- This is THEIR private server — their data never leaves their VPS",
        "- They can install any Skill from ClawHub with one click",
        "- They can switch AI models anytime (Claude, GPT-4o, Gemini) from the Config panel", "",
        "Be warm, concise, and helpful. Don't be robotic. Start now — don't wait for them to ask.",
      ].join("\\n");

      // BOOTSTRAP.md + skills 注入
      await ssh.exec(
        `printf '%s' '${bootstrapMd.replace(/'/g, "'\\''")}' > ${userDir}/.openclaw/workspace/BOOTSTRAP.md && cp -r /opt/tinyclaw/platform-skills/. ${userDir}/.openclaw/workspace/skills/ 2>/dev/null; echo 'SETUP_OK'`
      );
      console.log("[DOCKER] Setup done, token length:", gatewayToken.length);

      // docker stop/rm + docker run（合并为 1 个命令）
      // .trim() 防止 Vercel 环境变量末尾有隐藏换行符导致 docker run 命令被截断
      const gcpProject = (process.env.GOOGLE_VERTEX_PROJECT_ID || "tinyclaw-prod").trim();
      const gcpLocation = (process.env.GOOGLE_VERTEX_LOCATION || "global").trim();

      // docker stop/rm 和 docker run 分开执行（防止长命令截断）
      await ssh.exec(`docker stop ${containerName} 2>/dev/null; docker rm ${containerName} 2>/dev/null; true`);

      const dockerRunCmd = [
        `docker run -d`,
        `--name ${containerName}`,
        `--restart always`,
        `--network host`,
        `--memory 2g`,
        `--cpus 1.0`,
        `-e NODE_OPTIONS=--max-old-space-size=1536`,
        `-e HOME=/root`,
        ...(saB64 ? [
          `-e GOOGLE_APPLICATION_CREDENTIALS=/opt/tc/gcp-sa.json`,
          `-e GOOGLE_CLOUD_PROJECT=${gcpProject}`,
          `-e GOOGLE_CLOUD_LOCATION=${gcpLocation}`,
          `-v ${platformKeyDir}/gcp-sa.json:/opt/tc/gcp-sa.json:ro`,
          ...(openaiKey ? [`-v ${platformKeyDir}/openai.key:/opt/tc/openai.key:ro`] : []),
        ] : []),
        `-v ${userDir}/.openclaw:/root/.openclaw`,
        `openclaw-tc:latest`,
        `openclaw gateway --port ${port} --bind lan`,
      ].join(" ");

      console.log("[DOCKER] docker run cmd (len):", dockerRunCmd.length);
      const dockerRunOutput = await ssh.exec(dockerRunCmd);
      console.log("[DOCKER] Container started:", dockerRunOutput.trim().slice(0, 64));

      // DB 写入 status=ready（docker run -d 是异步的，container 有 --restart always）
      const vpsIpWithPort = `${SHARED_VPS_HOST}:${port}`;
      const cleanToken = gatewayToken && gatewayToken.length > 10 ? gatewayToken.trim() : null;
      await db.update(users).set({
        status: "ready", vpsIp: vpsIpWithPort, hetznerServerId: `shared-${shortId}`,
        selectedModel: model, gatewayToken: cleanToken, vpsPassword: SHARED_VPS_PASSWORD,
        ...(telegramToken ? { telegramPaired: "token_set" } : {}),
        ...(discordToken ? { discordConnected: "token_set" } : {}),
      }).where(eq(users.clerkId, userId));
      earlyDbWriteDone = true;
      console.log("[DOCKER] DB written status=ready:", vpsIpWithPort);

      ssh.exec(`sed -i '/^${port}$/d' /tmp/tc-ports-reserved 2>/dev/null; true`).catch(() => {});

      // 等待 gateway（最多 12 次 × 5s = 60s，通过同一个 SSH 连接）
      // 注意：前端 /creating 页面不再从轮询 redirect，只等这里返回后 redirect
      // 所以必须在这里真正等到 gateway 就绪
      let healthOk = false;
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const check = await ssh.exec(`ss -tlnp | grep -q ':${port} ' && echo 'LISTENING' || echo 'WAITING'`);
        console.log(`[DOCKER] Port check ${i + 1}:`, check.trim());
        if (check.trim() === "LISTENING") { healthOk = true; break; }
      }

      if (!healthOk) {
        const logs = await ssh.exec(`docker logs ${containerName} 2>&1 | tail -20`);
        console.error("[DOCKER] Gateway not started. Logs:", logs);
        console.warn("[DOCKER] Continuing — container has --restart always");
      }

      if (modelConfig.defaultModel) {
        await ssh.exec(`docker exec ${containerName} openclaw models set ${modelConfig.defaultModel} 2>&1 || true`);
      }

      if (cleanToken) {
        await ssh.exec(
          `curl -s -X POST http://127.0.0.1:${port}/api/v1/sessions/main/messages -H 'Content-Type: application/json' -H 'Authorization: Bearer ${cleanToken}' -d '{"content":"Hi! I just set up my account. Can you help me get started?","role":"user"}' 2>&1 | head -c 300 || true`
        ).catch(() => {});
      }

      if (enableWhatsapp) {
        await db.update(users).set({ whatsappConnected: "configured" }).where(eq(users.clerkId, userId));
      }

      ssh.close();
      console.log("[DOCKER] Instance ready:", vpsIpWithPort, "elapsed:", Date.now() - _t0, "ms");
      return NextResponse.json({ status: "ready", ip: vpsIpWithPort });

    } catch (error: any) {
      ssh.close();
      console.error("[DOCKER] Failed:", error);
      if (!earlyDbWriteDone) {
        await db.update(users).set({ status: "error" }).where(eq(users.clerkId, userId));
      } else {
        console.log("[DOCKER] Keeping status=ready despite error:", error?.message);
      }
      return NextResponse.json(
        { error: "Docker instance setup failed", message: error?.message, status: earlyDbWriteDone ? "ready" : "error" },
        { status: earlyDbWriteDone ? 200 : 500 }
      );
    }
  }

  // ====== 模式 2: 独立 Hetzner VPS（原有逻辑）======
  if (!HETZNER_TOKEN || HETZNER_TOKEN === "" || HETZNER_TOKEN === "YOUR_HETZNER_TOKEN") {
    // 开发模式：模拟创建
    console.log("[DEV] Simulating VPS creation for:", userId, "model:", model);
    await db
      .update(users)
      .set({
        status: "ready",
        vpsIp: "168.119.123.456",
        vpsPassword: "DevPassword123!",
        hetznerServerId: "dev-" + Date.now(),
        selectedModel: model,
      })
      .where(eq(users.clerkId, userId));
    return NextResponse.json({ status: "ready", ip: "168.119.123.456" });
  }

  try {
    const cloudInit = `#cloud-config
chpasswd:
  list: |
    root:${vpsPassword}
  expire: False
`;

    const response = await fetch("https://api.hetzner.cloud/v1/servers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HETZNER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `tc-${userId.slice(0, 8).replace(/[^a-zA-Z0-9]/g, "")}`,
        server_type: "cpx11",
        image: 355546818,
        location: "ash",
        user_data: cloudInit,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[HETZNER] API error:", error);
      await db
        .update(users)
        .set({ status: "error" })
        .where(eq(users.clerkId, userId));
      return NextResponse.json(
        { error: "Failed to create VPS", details: error, status: "error" },
        { status: 500 }
      );
    }

    const { server } = await response.json();
    const vpsIp = server.public_net.ipv4.ip;
    const serverId = server.id.toString();

    console.log("[PROD] Hetzner server created:", serverId, "IP:", vpsIp, "model:", model);

    await db
      .update(users)
      .set({
        status: "creating",
        vpsIp,
        vpsPassword,
        hetznerServerId: serverId,
        selectedModel: model,
      })
      .where(eq(users.clerkId, userId));

    after(async () => {
      await initializeVPS(userId, vpsIp, vpsPassword, model);
    });

    return NextResponse.json({ status: "creating" });
  } catch (error) {
    console.error("[PROD] VPS creation failed:", error);
    await db
      .update(users)
      .set({ status: "error" })
      .where(eq(users.clerkId, userId));
    return NextResponse.json(
      { error: "VPS creation failed", status: "error" },
      { status: 500 }
    );
  }
  } catch (outerErr: any) {
    console.error("[VPS CREATE ERROR]", outerErr);
    return NextResponse.json(
      { error: "Internal server error", message: outerErr?.message },
      { status: 500 }
    );
  }
}

function generatePassword(length = 16): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Vertex AI: onboard 用 skip，认证全靠环境变量
// 其他模型: 直接传 API key
function getAuthArgs(model: string): string {
  const config = MODEL_CONFIG[model] || MODEL_CONFIG.claude;
  if (config.isVertexAI) return `--auth-choice skip`;

  const apiKey = process.env[config.envKey];
  if (apiKey && !apiKey.startsWith("mock-")) {
    return `--auth-choice ${config.authChoice} --${config.authChoice} '${apiKey}'`;
  }
  return `--auth-choice skip`;
}


async function initializeVPS(
  clerkId: string,
  vpsIp: string,
  vpsPassword: string,
  model: string
) {
  try {
    await waitForSSH(vpsIp, vpsPassword, 180);

    console.log("[PROD] Initializing OpenClaw on", vpsIp, "with model:", model);

    const hetznerConfig = MODEL_CONFIG[model] || MODEL_CONFIG.claude;

    // Vertex AI: 写入 SA JSON + 设环境变量
    if (hetznerConfig.isVertexAI) {
      const saB64 = process.env.GOOGLE_VERTEX_SA_JSON_B64;
      if (saB64) {
        await executeSSHCommand(vpsIp, vpsPassword,
          `echo '${saB64}' | base64 -d > /root/.gcp-sa.json && chmod 600 /root/.gcp-sa.json`
        );
        const projectId = process.env.GOOGLE_VERTEX_PROJECT_ID || "tinyclaw-prod";
        const location = process.env.GOOGLE_VERTEX_LOCATION || "global";
        await executeSSHCommand(vpsIp, vpsPassword,
          `cat >> /root/.bashrc << 'ENVEOF'
export GOOGLE_APPLICATION_CREDENTIALS=/root/.gcp-sa.json
export GOOGLE_CLOUD_PROJECT=${projectId}
export GOOGLE_CLOUD_LOCATION=${location}
ENVEOF`
        );
        console.log("[PROD] Vertex AI SA + env configured on", vpsIp);
      }
    }

    const authArgs = getAuthArgs(model);

    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `openclaw onboard --non-interactive --accept-risk --flow quickstart ${authArgs} --gateway-port 18789 --gateway-bind lan --install-daemon --skip-channels --skip-skills --skip-health --skip-ui 2>&1`
    );

    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `openclaw config set gateway.controlUi.allowInsecureAuth true 2>&1`
    );

    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `openclaw config set gateway.controlUi.dangerouslyDisableDeviceAuth true 2>&1`
    );

    // Vertex AI: 设置默认模型
    if (hetznerConfig.defaultModel) {
      await executeSSHCommand(vpsIp, vpsPassword,
        `openclaw models set ${hetznerConfig.defaultModel} 2>&1 || true`
      );
      console.log("[PROD] Default model set:", hetznerConfig.defaultModel);
    }

    const gatewayToken = await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `openclaw config get gateway.auth.token 2>/dev/null || echo ""`
    );
    if (gatewayToken && gatewayToken.length > 10) {
      await db
        .update(users)
        .set({ gatewayToken: gatewayToken.trim() })
        .where(eq(users.clerkId, clerkId));
    }

    // ===== 安全加固 =====
    // 1. 配置 UFW 防火墙 — 只开 SSH + OpenClaw Gateway
    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `apt-get install -y ufw > /dev/null 2>&1 && ufw default deny incoming && ufw default allow outgoing && ufw allow 22/tcp && ufw allow 18789/tcp && echo "y" | ufw enable 2>&1`
    );

    // 2. 清理 bash history 中的 API key
    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `history -c && > ~/.bash_history && echo 'HISTIGNORE="*token*:*key*:*secret*:*password*"' >> ~/.bashrc`
    );

    // 3. 锁定 SA JSON 文件权限（仅 root 可读）
    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `chmod 600 /root/.gcp-sa.json 2>/dev/null; chmod 600 ~/.openclaw/config* 2>/dev/null || true`
    );

    console.log("[SECURITY] VPS hardened:", vpsIp);

    // systemd service（Vertex AI 需要额外环境变量）
    const vertexEnvLines = hetznerConfig.isVertexAI ? `
Environment=GOOGLE_APPLICATION_CREDENTIALS=/root/.gcp-sa.json
Environment=GOOGLE_CLOUD_PROJECT=${process.env.GOOGLE_VERTEX_PROJECT_ID || "tinyclaw-prod"}
Environment=GOOGLE_CLOUD_LOCATION=${process.env.GOOGLE_VERTEX_LOCATION || "global"}` : "";

    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `cat > /etc/systemd/system/openclaw.service << SVCEOF
[Unit]
Description=OpenClaw AI Agent Gateway
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/node /usr/lib/node_modules/openclaw/dist/index.js gateway --port 18789
Restart=always
RestartSec=5
KillMode=process
Environment=HOME=/root
Environment=OPENCLAW_GATEWAY_PORT=18789${vertexEnvLines}

[Install]
WantedBy=multi-user.target
SVCEOF`
    );

    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `systemctl --user disable openclaw-gateway 2>/dev/null; systemctl --user stop openclaw-gateway 2>/dev/null; systemctl daemon-reload && systemctl enable openclaw 2>/dev/null; systemctl start openclaw 2>/dev/null; true`
    );

    console.log("[PROD] OpenClaw initialized on", vpsIp);

    await db
      .update(users)
      .set({ status: "ready" })
      .where(eq(users.clerkId, clerkId));

    console.log("[PROD] VPS ready for", clerkId);
  } catch (error) {
    console.error("[PROD] VPS init failed:", error);
    await db
      .update(users)
      .set({ status: "error" })
      .where(eq(users.clerkId, clerkId));
  }
}

async function continueInit(
  clerkId: string,
  hetznerServerId: string,
  vpsPassword: string,
  model: string
) {
  try {
    const HETZNER_TOKEN = process.env.HETZNER_API_TOKEN;
    if (!HETZNER_TOKEN) return;

    const res = await fetch(
      `https://api.hetzner.cloud/v1/servers/${hetznerServerId}`,
      { headers: { Authorization: `Bearer ${HETZNER_TOKEN}` } }
    );

    if (!res.ok) return;

    const { server } = await res.json();
    if (server.status !== "running") return;

    const vpsIp = server.public_net.ipv4.ip;
    await db
      .update(users)
      .set({ vpsIp })
      .where(eq(users.clerkId, clerkId));

    await initializeVPS(clerkId, vpsIp, vpsPassword, model);
  } catch (error) {
    console.error("[RECOVERY] Failed:", error);
  }
}

function executeSSHCommand(
  host: string,
  password: string,
  command: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let output = "";
    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) { conn.end(); reject(err); return; }
          stream
            .on("close", () => { conn.end(); resolve(output.trim()); })
            .on("data", (data: Buffer) => { output += data.toString(); })
            .stderr.on("data", (data: Buffer) => { output += data.toString(); });
        });
      })
      .on("error", reject)
      .connect({ host, port: 22, username: "root", password, readyTimeout: 10000 });
  });
}

class SSHSession {
  private conn: Client;
  private ready: Promise<void>;
  constructor(host: string, password: string) {
    this.conn = new Client();
    this.ready = new Promise((resolve, reject) => {
      this.conn
        .on("ready", () => resolve())
        .on("error", reject)
        .connect({ host, port: 22, username: "root", password, readyTimeout: 15000 });
    });
  }
  async exec(command: string): Promise<string> {
    await this.ready;
    return new Promise((resolve, reject) => {
      let output = "";
      this.conn.exec(command, (err, stream) => {
        if (err) { reject(err); return; }
        stream
          .on("close", () => resolve(output.trim()))
          .on("data", (d: Buffer) => { output += d.toString(); })
          .stderr.on("data", (d: Buffer) => { output += d.toString(); });
      });
    });
  }
  close() { try { this.conn.end(); } catch {} }
}

async function waitForSSH(
  host: string,
  password: string,
  timeoutSeconds: number
): Promise<void> {
  const start = Date.now();
  const deadline = start + timeoutSeconds * 1000;
  while (Date.now() < deadline) {
    try {
      await executeSSHCommand(host, password, "echo ready");
      console.log(`[SSH] ${host} ready after ${Math.round((Date.now() - start) / 1000)}s`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  throw new Error(`SSH timeout: ${host} not reachable after ${timeoutSeconds}s`);
}
