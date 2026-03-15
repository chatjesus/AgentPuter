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

  // 验证 Token 格式 (Telegram Bot Token 格式: 123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)
  if (!token || typeof token !== "string" || !token.match(/^\d+:[A-Za-z0-9_-]+$/)) {
    return NextResponse.json(
      { error: "Invalid token format. Please enter a valid Telegram Bot Token." },
      { status: 400 }
    );
  }

  // 获取用户的 VPS 信息
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

  // 通过 SSH 配置 Telegram Token
  try {
    // 1. 检查 OpenClaw 是否已初始化，未初始化则先 onboard
    const configCheck = await executeSSHCommand(
      user.vpsIp,
      user.vpsPassword,
      `test -f /root/.openclaw/openclaw.json && echo "OK" || echo "MISSING"`
    );

    if (configCheck.trim() === "MISSING") {
      console.log("[SSH] OpenClaw not initialized, running onboard...");
      // 停掉可能存在的残留进程
      await executeSSHCommand(user.vpsIp, user.vpsPassword, `systemctl stop openclaw 2>/dev/null; true`);

      // 非交互式初始化 OpenClaw
      const onboardResult = await executeSSHCommand(
        user.vpsIp,
        user.vpsPassword,
        `openclaw onboard --non-interactive --accept-risk --flow quickstart --auth-choice skip --gateway-port 18789 --gateway-bind lan --install-daemon --skip-channels --skip-skills --skip-health --skip-ui 2>&1`
      );
      console.log("[SSH] Onboard result:", onboardResult);
    }

    // 2. 使用 openclaw config set 写入 Telegram Bot Token
    const setResult = await executeSSHCommand(
      user.vpsIp,
      user.vpsPassword,
      `openclaw config set channels.telegram.botToken '${token}' 2>&1`
    );
    console.log("[SSH] Set telegram token:", setResult);

    // 3. 确保 systemd service 配置正确（用 node 直接调用，避免 openclaw wrapper fork 导致 systemd 误判）
    await executeSSHCommand(
      user.vpsIp,
      user.vpsPassword,
      `cat > /etc/systemd/system/openclaw.service << 'EOF'
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
Environment=OPENCLAW_GATEWAY_PORT=18789

[Install]
WantedBy=multi-user.target
EOF`
    );
    // 禁用 onboard 创建的用户级 service 避免端口冲突
    await executeSSHCommand(
      user.vpsIp,
      user.vpsPassword,
      `systemctl --user disable openclaw-gateway 2>/dev/null; systemctl --user stop openclaw-gateway 2>/dev/null; systemctl daemon-reload && systemctl enable openclaw 2>/dev/null; true`
    );

    // 4. 停掉所有残留进程，重新启动
    await executeSSHCommand(user.vpsIp, user.vpsPassword, `systemctl stop openclaw 2>/dev/null; true`);
    await executeSSHCommand(user.vpsIp, user.vpsPassword, `pkill -9 -f "node.*openclaw" 2>/dev/null; true`);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await executeSSHCommand(user.vpsIp, user.vpsPassword, `systemctl start openclaw`);

    // 等待 gateway 启动
    await new Promise((resolve) => setTimeout(resolve, 6000));

    // 5. 检查服务状态
    const statusResult = await executeSSHCommand(
      user.vpsIp,
      user.vpsPassword,
      `systemctl is-active openclaw`
    );
    console.log("[SSH] Service status:", statusResult);

    if (statusResult.trim() === "active") {
      // 额外确认 Telegram 插件是否启动
      const logs = await executeSSHCommand(
        user.vpsIp,
        user.vpsPassword,
        `journalctl -u openclaw --since '10 sec ago' --no-pager 2>&1`
      );
      console.log("[SSH] Recent logs:", logs);

      // 更新数据库状态
      await db
        .update(users)
        .set({ telegramPaired: "token_set" })
        .where(eq(users.clerkId, userId));

      return NextResponse.json({
        success: true,
        message: "Telegram Bot configured! Now send a message to your bot to get a pairing code.",
      });
    } else {
      const logs = await executeSSHCommand(
        user.vpsIp,
        user.vpsPassword,
        `journalctl -u openclaw -n 15 --no-pager`
      );
      console.error("[SSH] Service logs:", logs);
      return NextResponse.json({
        success: false,
        error: "Service failed to start. Check server logs.",
      });
    }
  } catch (error) {
    console.error("[SSH] Execution failed:", error);
    return NextResponse.json(
      { error: "Failed to connect to VPS. Please try again." },
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
          if (err) {
            conn.end();
            reject(err);
            return;
          }

          stream
            .on("close", () => {
              conn.end();
              resolve(output.trim());
            })
            .on("data", (data: Buffer) => {
              output += data.toString();
            })
            .stderr.on("data", (data: Buffer) => {
              output += data.toString();
            });
        });
      })
      .on("error", (err) => {
        reject(err);
      })
      .connect({
        host,
        port: 22,
        username: "root",
        password,
        readyTimeout: 10000,
      });
  });
}
