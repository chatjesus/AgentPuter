import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from "crypto";

// 飞书消息事件类型
interface FeishuEvent {
  schema?: string;
  header?: {
    event_id: string;
    event_type: string;
    app_id: string;
    tenant_key: string;
    create_time: string;
  };
  event?: {
    sender?: {
      sender_id?: { open_id?: string; union_id?: string; user_id?: string };
      sender_type?: string;
    };
    message?: {
      message_id: string;
      root_id?: string;
      parent_id?: string;
      message_type: string;
      content: string; // JSON 字符串
      chat_id?: string;
      chat_type?: string;
    };
  };
  // URL 验证 challenge
  type?: string;
  challenge?: string;
  token?: string;
  // 加密事件
  encrypt?: string;
}

// 解密飞书加密事件（Encrypt Key 开启时）
function decryptFeishuEvent(encryptStr: string, encryptKey: string): string {
  const keyBuffer = crypto
    .createHash("sha256")
    .update(encryptKey)
    .digest();
  const encryptBuffer = Buffer.from(encryptStr, "base64");
  const iv = encryptBuffer.subarray(0, 16);
  const cipherText = encryptBuffer.subarray(16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
  const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
  return decrypted.toString("utf8");
}

// 获取飞书 app_access_token（带 5 分钟缓存避免频繁请求）
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

async function getFeishuAccessToken(appId: string, appSecret: string): Promise<string> {
  const cached = tokenCache.get(appId);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }
  const res = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    }
  );
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Feishu token error: ${data.msg}`);
  tokenCache.set(appId, {
    token: data.app_access_token,
    expiresAt: Date.now() + data.expire * 1000,
  });
  return data.app_access_token;
}

// 回复飞书消息
async function replyFeishuMessage(
  accessToken: string,
  messageId: string,
  replyText: string
): Promise<void> {
  await fetch(
    `https://open.feishu.cn/open-apis/im/v1/messages/${messageId}/reply`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg_type: "text",
        content: JSON.stringify({ text: replyText }),
      }),
    }
  );
}

// 发消息给 OpenClaw 并等待 AI 回复
async function askOpenClaw(
  vpsIp: string,
  gatewayToken: string,
  sessionId: string,
  userMessage: string
): Promise<string> {
  const [host, port] = vpsIp.includes(":") ? vpsIp.split(":") : [vpsIp, "18789"];
  const baseUrl = `http://${host}:${port}`;

  // Step 1: 发送用户消息
  await fetch(`${baseUrl}/api/v1/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${gatewayToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: userMessage, role: "user" }),
  });

  // Step 2: 轮询等待 AI 回复（最多 90 秒，每 3 秒检查一次）
  const startTime = Date.now();
  let lastAssistantContent = "";

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 3000));

    try {
      const pollRes = await fetch(
        `${baseUrl}/api/v1/sessions/${sessionId}/messages?limit=20`,
        {
          headers: { Authorization: `Bearer ${gatewayToken}` },
        }
      );

      if (!pollRes.ok) continue;

      const messages = await pollRes.json();
      if (!Array.isArray(messages)) continue;

      // 找到发送之后最新的 assistant 消息
      const sentAt = startTime;
      const assistantMsgs = messages.filter(
        (m: { role: string; createdAt?: number; timestamp?: number; content?: string }) =>
          m.role === "assistant" &&
          (m.createdAt || m.timestamp || 0) > sentAt / 1000 - 5
      );

      if (assistantMsgs.length > 0) {
        const latest = assistantMsgs[assistantMsgs.length - 1];
        const content = latest.content || latest.text || "";
        if (content && content !== lastAssistantContent) {
          // 检查是否还在流式输出（内容在增长），等稳定后返回
          lastAssistantContent = content;
          await new Promise((r) => setTimeout(r, 2000));
          // 再读一次确认稳定
          const confirmRes = await fetch(
            `${baseUrl}/api/v1/sessions/${sessionId}/messages?limit=20`,
            { headers: { Authorization: `Bearer ${gatewayToken}` } }
          );
          if (confirmRes.ok) {
            const confirmMsgs = await confirmRes.json();
            if (Array.isArray(confirmMsgs)) {
              const confirmLatest = confirmMsgs
                .filter((m: { role: string }) => m.role === "assistant")
                .pop();
              return confirmLatest?.content || confirmLatest?.text || content;
            }
          }
          return content;
        }
      }
    } catch {
      // 继续轮询
    }
  }

  return "（AI 正在处理中，请稍后在 WebChat 查看回复）";
}

export async function POST(request: Request) {
  let body: FeishuEvent;

  try {
    const rawText = await request.text();

    // 解析 JSON
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // ===== 处理加密事件 =====
    if (body.encrypt) {
      // 需要根据 App ID 找到对应用户的 encrypt key 来解密
      // 但此时还不知道是哪个用户……先用 URL 参数 appId 处理
      // 实际部署时建议每个用户使用唯一 webhook URL：/api/feishu/webhook?appId=xxx
      const url = new URL(request.url);
      const appIdParam = url.searchParams.get("appId");
      if (!appIdParam) {
        return NextResponse.json({ error: "appId param required for encrypted events" }, { status: 400 });
      }
      const user = await db.query.users.findFirst({
        where: eq(users.feishuAppId, appIdParam),
      });
      if (!user?.feishuEncryptKey) {
        return NextResponse.json({ error: "Encrypt key not configured" }, { status: 400 });
      }
      const decrypted = decryptFeishuEvent(body.encrypt, user.feishuEncryptKey);
      body = JSON.parse(decrypted);
    }

    // ===== URL 验证 challenge（飞书后台验证 Webhook URL 时触发）=====
    if (body.type === "url_verification") {
      // 验证 token（可选但推荐）
      if (body.token) {
        const user = await db.query.users.findFirst({
          where: eq(users.feishuVerifyToken, body.token),
        });
        if (!user) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
      }
      return NextResponse.json({ challenge: body.challenge });
    }

    // ===== 消息事件 =====
    const appId = body.header?.app_id;
    const eventType = body.header?.event_type;

    if (eventType !== "im.message.receive_v1" || !appId) {
      // 非消息事件，忽略并返回成功
      return NextResponse.json({ code: 0 });
    }

    // 根据 App ID 找到用户
    const user = await db.query.users.findFirst({
      where: eq(users.feishuAppId, appId),
    });

    if (!user || !user.vpsIp || !user.gatewayToken) {
      return NextResponse.json({ code: 0 }); // 找不到用户，静默忽略
    }

    const message = body.event?.message;
    const sender = body.event?.sender;

    if (!message) {
      return NextResponse.json({ code: 0 });
    }

    // 只处理文本消息
    if (message.message_type !== "text") {
      return NextResponse.json({ code: 0 });
    }

    // 解析消息内容
    let userText = "";
    try {
      const contentObj = JSON.parse(message.content);
      userText = contentObj.text || "";
    } catch {
      return NextResponse.json({ code: 0 });
    }

    if (!userText.trim()) {
      return NextResponse.json({ code: 0 });
    }

    // 立即返回 200，异步处理消息转发
    const messageId = message.message_id;
    const openId = sender?.sender_id?.open_id || "unknown";
    const sessionId = `feishu-${openId}`;
    const vpsIp = user.vpsIp;
    const gatewayToken = user.gatewayToken;
    const feishuAppId = user.feishuAppId!;
    const feishuAppSecret = user.feishuAppSecret!;

    // 异步处理（不阻塞响应）
    Promise.resolve().then(async () => {
      try {
        // 获取飞书访问令牌
        const accessToken = await getFeishuAccessToken(feishuAppId, feishuAppSecret);

        // 转发到 OpenClaw 并等待回复
        const aiReply = await askOpenClaw(vpsIp, gatewayToken, sessionId, userText);

        // 回复飞书用户
        await replyFeishuMessage(accessToken, messageId, aiReply);
      } catch (err) {
        console.error("[Feishu Webhook] Error processing message:", err);
      }
    });

    return NextResponse.json({ code: 0 });
  } catch (err) {
    console.error("[Feishu Webhook] Unhandled error:", err);
    return NextResponse.json({ code: 0 }); // 始终返回 200 避免飞书重发
  }
}
