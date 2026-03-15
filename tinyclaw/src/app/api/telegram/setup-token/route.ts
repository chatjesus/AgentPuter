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

  const { token } = await request.json();

  // 验证 Token 格式
  if (!token || typeof token !== "string" || !token.match(/^\d+:[A-Za-z0-9_-]+$/)) {
    return NextResponse.json(
      { error: "Invalid token format. Please enter a valid Telegram Bot Token." },
      { status: 400 }
    );
  }

  // 获取用户信息
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.status !== "ready" || !user.vpsIp) {
    return NextResponse.json({ error: "VPS not ready" }, { status: 400 });
  }

  // 开发模式模拟
  if (!user.vpsPassword || user.vpsPassword === "DevPassword123!") {
    console.log("[DEV] Simulating Telegram token setup");
    await db
      .update(users)
      .set({ telegramPaired: "token_set" })
      .where(eq(users.clerkId, userId));
    return NextResponse.json({
      success: true,
      message: "[DEV] Token configured successfully",
    });
  }

  // 判断是否为 Docker 共享模式
  const isSharedMode = user.hetznerServerId?.startsWith("shared-");

  try {
    if (isSharedMode) {
      // ===== Docker 共享模式 =====
      const shortId = user.hetznerServerId!.replace("shared-", "");
      const containerName = `tc-${shortId}`;
      const sharedHost = process.env.SHARED_VPS_HOST!;
      const sharedPassword = process.env.SHARED_VPS_PASSWORD!;

      console.log("[DOCKER] Setting Telegram token for container:", containerName);
      const userDir = `/opt/tinyclaw/users/${shortId}`;

      // 1. 先停掉容器（避免 hot reload 竞态覆盖配置）
      await executeSSHCommand(
        sharedHost,
        sharedPassword,
        `docker stop ${containerName} 2>&1 || true`
      );
      // 等容器彻底停掉
      await new Promise(r => setTimeout(r, 3000));

      // 2. 容器停止后再写入 JSON 配置
      await executeSSHCommand(
        sharedHost,
        sharedPassword,
        `node -e "
const fs=require('fs');
const p='${userDir}/.openclaw/openclaw.json';
const c=JSON.parse(fs.readFileSync(p));
if(!c.channels) c.channels={};
c.channels.telegram={botToken:'${token}'};
if(!c.plugins) c.plugins={};
if(!c.plugins.entries) c.plugins.entries={};
c.plugins.entries.telegram={enabled:true};
fs.writeFileSync(p,JSON.stringify(c,null,2));
console.log('Telegram configured + enabled');
"`
      );

      // 3. 验证写入成功
      const verifyResult = await executeSSHCommand(
        sharedHost,
        sharedPassword,
        `node -e "const c=JSON.parse(require('fs').readFileSync('${userDir}/.openclaw/openclaw.json'));console.log('channels:',!!c.channels?.telegram?.botToken,'enabled:',c.plugins?.entries?.telegram?.enabled);"`
      );
      console.log("[DOCKER] Config verify:", verifyResult);

      // 4. 启动容器（不是 restart，是 start，因为前面已经 stop）
      await executeSSHCommand(
        sharedHost,
        sharedPassword,
        `docker start ${containerName} 2>&1`
      );

      // 3. 等待容器重启完成
      console.log("[DOCKER] Container restarting, waiting for gateway...");
      let healthOk = false;
      const vpsPort = user.vpsIp.includes(":") ? user.vpsIp.split(":")[1] : "19000";
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 10000));
        const check = await executeSSHCommand(
          sharedHost,
          sharedPassword,
          `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${vpsPort} || echo '000'`
        );
        if (check.trim() === "200") {
          healthOk = true;
          break;
        }
      }

      if (!healthOk) {
        const logs = await executeSSHCommand(sharedHost, sharedPassword, `docker logs ${containerName} 2>&1 | tail -15`);
        console.error("[DOCKER] Gateway failed to restart. Logs:", logs);
        return NextResponse.json({ success: false, error: "Gateway failed to restart after config change." });
      }

      console.log("[DOCKER] Telegram token configured, container healthy");
      await db
        .update(users)
        .set({ telegramPaired: "token_set" })
        .where(eq(users.clerkId, userId));

      return NextResponse.json({
        success: true,
        message: "Telegram Bot configured! Now send a message to your bot to get a pairing code.",
      });

    } else {
      // ===== 独立 VPS 模式（原有逻辑）=====
      const vpsHost = user.vpsIp.includes(":") ? user.vpsIp.split(":")[0] : user.vpsIp;

      // 1. 检查 OpenClaw 是否已初始化
      const configCheck = await executeSSHCommand(
        vpsHost,
        user.vpsPassword,
        `test -f /root/.openclaw/openclaw.json && echo "OK" || echo "MISSING"`
      );

      if (configCheck.trim() === "MISSING") {
        console.log("[SSH] OpenClaw not initialized, running onboard...");
        await executeSSHCommand(vpsHost, user.vpsPassword, `systemctl stop openclaw 2>/dev/null; true`);
        await executeSSHCommand(
          vpsHost,
          user.vpsPassword,
          `openclaw onboard --non-interactive --accept-risk --flow quickstart --auth-choice skip --gateway-port 18789 --gateway-bind lan --install-daemon --skip-channels --skip-skills --skip-health --skip-ui 2>&1`
        );
      }

      // 2. 写入 Telegram Bot Token
      await executeSSHCommand(
        vpsHost,
        user.vpsPassword,
        `openclaw config set channels.telegram.botToken '${token}' 2>&1`
      );

      // 3. 重启服务
      await executeSSHCommand(vpsHost, user.vpsPassword, `systemctl stop openclaw 2>/dev/null; true`);
      await executeSSHCommand(vpsHost, user.vpsPassword, `pkill -9 -f "node.*openclaw" 2>/dev/null; true`);
      await new Promise(r => setTimeout(r, 3000));
      await executeSSHCommand(vpsHost, user.vpsPassword, `systemctl start openclaw`);
      await new Promise(r => setTimeout(r, 6000));

      // 4. 检查服务状态
      const statusResult = await executeSSHCommand(vpsHost, user.vpsPassword, `systemctl is-active openclaw`);
      console.log("[SSH] Service status:", statusResult);

      if (statusResult.trim() === "active") {
        await db
          .update(users)
          .set({ telegramPaired: "token_set" })
          .where(eq(users.clerkId, userId));
        return NextResponse.json({
          success: true,
          message: "Telegram Bot configured! Now send a message to your bot to get a pairing code.",
        });
      } else {
        return NextResponse.json({ success: false, error: "Service failed to start. Check server logs." });
      }
    }
  } catch (error) {
    console.error("[Telegram setup] Execution failed:", error);
    return NextResponse.json(
      { error: "Failed to configure Telegram. Please try again." },
      { status: 500 }
    );
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
