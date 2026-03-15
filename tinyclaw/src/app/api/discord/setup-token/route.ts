import { auth } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Client } from "ssh2";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let token: string | undefined;
  try {
    const body = await request.json();
    token = body?.token;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Discord Bot Token 基本格式校验（长度 > 50）
  if (!token || typeof token !== "string" || token.trim().length < 50) {
    return NextResponse.json(
      { error: "Invalid token format. Please enter a valid Discord Bot Token." },
      { status: 400 }
    );
  }

  const cleanToken = token.trim().replace(/'/g, "\\'");

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.status !== "ready" || !user.vpsIp) {
    return NextResponse.json({ error: "VPS not ready" }, { status: 400 });
  }

  // 开发模式模拟
  if (!user.vpsPassword || user.vpsPassword === "DevPassword123!") {
    await db
      .update(users)
      .set({ discordConnected: "token_set" })
      .where(eq(users.clerkId, userId));
    return NextResponse.json({ success: true, message: "[DEV] Discord token configured" });
  }

  const isSharedMode = user.hetznerServerId?.startsWith("shared-");

  try {
    if (isSharedMode) {
      const shortId = user.hetznerServerId!.replace("shared-", "");
      const containerName = `tc-${shortId}`;
      const userDir = `/opt/tinyclaw/users/${shortId}`;
      const sharedHost = process.env.SHARED_VPS_HOST!;
      const sharedPassword = process.env.SHARED_VPS_PASSWORD!;

      // 停容器 → 写配置 → 启容器（避免竞态）
      await executeSSHCommand(sharedHost, sharedPassword, `docker stop ${containerName} 2>&1 || true`);
      await new Promise(r => setTimeout(r, 3000));

      await executeSSHCommand(
        sharedHost,
        sharedPassword,
        `node -e "
const fs=require('fs');
const p='${userDir}/.openclaw/openclaw.json';
const c=JSON.parse(fs.readFileSync(p));
if(!c.channels) c.channels={};
c.channels.discord={token:'${cleanToken}'};
if(!c.plugins) c.plugins={};
if(!c.plugins.entries) c.plugins.entries={};
c.plugins.entries.discord={enabled:true};
fs.writeFileSync(p,JSON.stringify(c,null,2));
console.log('Discord configured');
"`
      );

      await executeSSHCommand(sharedHost, sharedPassword, `docker start ${containerName} 2>&1`);

      // 等待 gateway 健康
      const vpsPort = user.vpsIp.includes(":") ? user.vpsIp.split(":")[1] : "19000";
      let healthOk = false;
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 10000));
        const code = await executeSSHCommand(
          sharedHost, sharedPassword,
          `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${vpsPort} || echo '000'`
        );
        if (code.trim() === "200") { healthOk = true; break; }
      }

      if (!healthOk) {
        const logs = await executeSSHCommand(sharedHost, sharedPassword, `docker logs ${containerName} 2>&1 | tail -15`);
        console.error("[DISCORD] Gateway failed to restart:", logs);
        return NextResponse.json({ success: false, error: "Gateway failed to restart after config change." });
      }

      await db.update(users).set({ discordConnected: "token_set" }).where(eq(users.clerkId, userId));
      return NextResponse.json({
        success: true,
        message: "Discord Bot configured! Now invite the bot to your server and start chatting.",
      });

    } else {
      // 独立 VPS 模式
      const vpsHost = user.vpsIp.includes(":") ? user.vpsIp.split(":")[0] : user.vpsIp;

      await executeSSHCommand(
        vpsHost, user.vpsPassword,
        `openclaw config set channels.discord.token '${cleanToken}' 2>&1`
      );

      await executeSSHCommand(vpsHost, user.vpsPassword, `systemctl restart openclaw 2>&1`);
      await new Promise(r => setTimeout(r, 8000));

      const statusResult = await executeSSHCommand(vpsHost, user.vpsPassword, `systemctl is-active openclaw`);
      if (statusResult.trim() === "active") {
        await db.update(users).set({ discordConnected: "token_set" }).where(eq(users.clerkId, userId));
        return NextResponse.json({
          success: true,
          message: "Discord Bot configured! Now invite the bot to your server.",
        });
      } else {
        return NextResponse.json({ success: false, error: "Service failed to restart." });
      }
    }
  } catch (error) {
    console.error("[Discord setup] Failed:", error);
    return NextResponse.json({ error: "Failed to configure Discord. Please try again." }, { status: 500 });
  }
}

function executeSSHCommand(host: string, password: string, command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let output = "";
    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) { conn.end(); reject(err); return; }
          stream
            .on("close", () => { conn.end(); resolve(output.trim()); })
            .on("data", (d: Buffer) => { output += d.toString(); })
            .stderr.on("data", (d: Buffer) => { output += d.toString(); });
        });
      })
      .on("error", reject)
      .connect({ host, port: 22, username: "root", password, readyTimeout: 10000 });
  });
}
