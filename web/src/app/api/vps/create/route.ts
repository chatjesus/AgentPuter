import { auth } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse, after } from "next/server";
import { Client } from "ssh2";

// Vercel 函数最大执行时长（秒），Pro 计划最高 300s
export const maxDuration = 300;

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 检查是否已有 VPS
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (existing?.status === "ready") {
    return NextResponse.json({
      status: "ready",
      ip: existing.vpsIp,
    });
  }

  // 已在创建中或之前失败但有 Hetzner 服务器 → 尝试恢复而非重建
  if (
    (existing?.status === "creating" || existing?.status === "error") &&
    existing.hetznerServerId &&
    existing.vpsPassword
  ) {
    await db
      .update(users)
      .set({ status: "creating" })
      .where(eq(users.clerkId, userId));

    after(async () => {
      await continueInit(userId, existing.hetznerServerId!, existing.vpsPassword!);
    });
    return NextResponse.json({ status: "creating" });
  }

  // 门控：需要邀请码或活跃订阅才允许创建 VPS
  const hasInvite = !!existing?.inviteCode;
  const hasSubscription =
    existing?.subscriptionStatus === "active" ||
    existing?.subscriptionStatus === "trialing" ||
    existing?.status === "subscribed";

  if (!hasInvite && !hasSubscription) {
    return NextResponse.json(
      { error: "Subscription or invitation code required", status: "no_access" },
      { status: 403 }
    );
  }

  // ===== Phase 1: 同步创建 Hetzner 服务器（~2s） =====
  const HETZNER_TOKEN = process.env.HETZNER_API_TOKEN;
  const vpsPassword = generatePassword();

  if (!HETZNER_TOKEN || HETZNER_TOKEN === "YOUR_HETZNER_TOKEN") {
    // 开发模式：模拟创建
    console.log("[DEV] Simulating VPS creation for:", userId);
    await db
      .update(users)
      .set({
        status: "ready",
        vpsIp: "168.119.123.456",
        vpsPassword: "DevPassword123!",
        hetznerServerId: "dev-" + Date.now(),
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
        name: `ap-${userId.slice(0, 8).replace(/[^a-zA-Z0-9]/g, "")}`,
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
        { error: "Failed to create VPS", status: "error" },
        { status: 500 }
      );
    }

    const { server } = await response.json();
    const vpsIp = server.public_net.ipv4.ip;
    const serverId = server.id.toString();

    console.log("[PROD] Hetzner server created:", serverId, "IP:", vpsIp);

    // 立刻写入 DB（Phase 1 完成 = 不丢数据）
    await db
      .update(users)
      .set({
        status: "creating",
        vpsIp: vpsIp,
        vpsPassword: vpsPassword,
        hetznerServerId: serverId,
      })
      .where(eq(users.clerkId, userId));

    // ===== Phase 2: 后台初始化（after 在 response 返回后继续执行） =====
    after(async () => {
      await initializeVPS(userId, vpsIp, vpsPassword);
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
}

// 生成随机密码
function generatePassword(length = 16): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Phase 2: 等 SSH + 初始化 OpenClaw
async function initializeVPS(
  clerkId: string,
  vpsIp: string,
  vpsPassword: string
) {
  try {
    // 等待 SSH 就绪
    await waitForSSH(vpsIp, vpsPassword, 180);

    // 初始化 OpenClaw
    console.log("[PROD] Initializing OpenClaw on", vpsIp);
    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
    const authArgs = ANTHROPIC_KEY
      ? `--auth-choice token --token-provider anthropic --token '${ANTHROPIC_KEY}'`
      : `--auth-choice skip`;

    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `openclaw onboard --non-interactive --accept-risk --flow quickstart ${authArgs} --gateway-port 18789 --gateway-bind lan --install-daemon --skip-channels --skip-skills --skip-health --skip-ui 2>&1`
    );

    // 允许 HTTP 访问 Control UI（用户通过 IP 直连无 HTTPS）
    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `openclaw config set gateway.controlUi.allowInsecureAuth true 2>&1`
    );

    // 禁用设备认证（HTTP 下无法进行设备密钥交换）
    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `openclaw config set gateway.controlUi.dangerouslyDisableDeviceAuth true 2>&1`
    );

    // 读取 gateway auth token 并存入数据库
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
      console.log("[PROD] Gateway token saved for", clerkId);
    }

    // 修复 Control UI 样式问题 (New messages overlay & Chat compose alignment)
    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `cat > /tmp/ui_patch.css << 'EOF'
<style>
/* Fix 'New messages' overlay */
.chat-new-messages {
  position: absolute !important;
  inset: auto !important;
  top: auto !important;
  bottom: 100px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: auto !important;
  height: auto !important;
  background-color: #2563eb !important;
  color: white !important;
  padding: 8px 16px !important;
  border-radius: 9999px !important;
  z-index: 50 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  font-size: 14px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  opacity: 0.9 !important;
}
.chat-new-messages:hover { opacity: 1 !important; }

/* Fix Chat Compose Bar Alignment */
.chat-compose__row {
  display: flex !important;
  align-items: flex-end !important;
  gap: 10px !important;
}
.chat-compose__field {
  margin: 0 !important;
}
.chat-compose__field textarea {
  margin: 0 !important;
  min-height: 42px !important;
  padding: 10px 12px !important;
}
/* Target buttons next to the field */
.chat-compose__row > button, 
.chat-compose__row > .button {
  height: 42px !important;
  margin: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
EOF

python3 -c "
import sys
try:
    with open('/tmp/ui_patch.css', 'r') as f:
        css = f.read()
    path = '/usr/lib/node_modules/openclaw/dist/control-ui/index.html'
    with open(path, 'r') as f:
        html = f.read()
    if '<style>' not in html:
        html = html.replace('</head>', css + '</head>')
        with open(path, 'w') as f:
            f.write(html)
except Exception as e:
    print(e)
"
`
    );

    // 写入 systemd service
    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `cat > /etc/systemd/system/openclaw.service << 'SVCEOF'
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
SVCEOF`
    );

    // 启用服务
    await executeSSHCommand(
      vpsIp,
      vpsPassword,
      `systemctl --user disable openclaw-gateway 2>/dev/null; systemctl --user stop openclaw-gateway 2>/dev/null; systemctl daemon-reload && systemctl enable openclaw 2>/dev/null; systemctl start openclaw 2>/dev/null; true`
    );

    console.log("[PROD] OpenClaw initialized on", vpsIp);

    // 标记完成
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

// 恢复：对已有 Hetzner 服务器但 status 还在 creating 的用户继续初始化
async function continueInit(
  clerkId: string,
  hetznerServerId: string,
  vpsPassword: string
) {
  try {
    // 从 Hetzner 获取最新 IP
    const HETZNER_TOKEN = process.env.HETZNER_API_TOKEN;
    if (!HETZNER_TOKEN) return;

    const res = await fetch(
      `https://api.hetzner.cloud/v1/servers/${hetznerServerId}`,
      { headers: { Authorization: `Bearer ${HETZNER_TOKEN}` } }
    );

    if (!res.ok) return;

    const { server } = await res.json();
    if (server.status !== "running") {
      console.log("[RECOVERY] Server not running yet:", server.status);
      return;
    }

    const vpsIp = server.public_net.ipv4.ip;
    console.log("[RECOVERY] Continuing init for", clerkId, "IP:", vpsIp);

    // 更新 IP（可能之前没存）
    await db
      .update(users)
      .set({ vpsIp: vpsIp })
      .where(eq(users.clerkId, clerkId));

    await initializeVPS(clerkId, vpsIp, vpsPassword);
  } catch (error) {
    console.error("[RECOVERY] Failed:", error);
  }
}

// SSH 远程执行命令
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

// 等待 SSH 可用
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
      console.log(
        `[SSH] ${host} ready after ${Math.round((Date.now() - start) / 1000)}s`
      );
      return;
    } catch {
      // SSH 未就绪，等待后重试
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  throw new Error(`SSH timeout: ${host} not reachable after ${timeoutSeconds}s`);
}
