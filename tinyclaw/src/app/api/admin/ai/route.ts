import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { geminiStream } from "@/lib/vertexai";

function isAuthorized(req: Request) {
  const token = req.headers.get("x-admin-token");
  return token === process.env.ADMIN_SECRET;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question } = await req.json();
  if (!question?.trim()) {
    return NextResponse.json({ error: "No question provided" }, { status: 400 });
  }

  // 从 DB 拉取最新平台数据
  const allUsers = await db.query.users.findMany();

  const now = new Date();
  const active = allUsers.filter(u => u.subscriptionStatus === "active");
  const trialing = allUsers.filter(u => u.subscriptionStatus === "trialing");
  const canceled = allUsers.filter(u => u.subscriptionStatus === "canceled");
  const pastDue = allUsers.filter(u => u.subscriptionStatus === "past_due");
  const noSub = allUsers.filter(u => !u.subscriptionStatus || u.subscriptionStatus === null);

  // 按时间统计注册趋势（最近 30 天）
  const last30 = allUsers.filter(u => {
    if (!u.createdAt) return false;
    const d = new Date(u.createdAt);
    return (now.getTime() - d.getTime()) < 30 * 24 * 60 * 60 * 1000;
  });
  const last7 = allUsers.filter(u => {
    if (!u.createdAt) return false;
    const d = new Date(u.createdAt);
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  });

  // VPS 分布
  const vps1Users = allUsers.filter(u => u.vpsIp?.includes("178.156.252.255"));
  const vps2Users = allUsers.filter(u => u.vpsIp?.includes("5.161.200.75"));
  const independentVps = allUsers.filter(u => u.vpsIp && !u.vpsIp.includes("178.156.252.255") && !u.vpsIp.includes("5.161.200.75"));

  // 模型偏好
  const modelCount: Record<string, number> = {};
  allUsers.forEach(u => {
    const m = u.selectedModel || "unknown";
    modelCount[m] = (modelCount[m] || 0) + 1;
  });

  // 渠道来源
  const sourceCount: Record<string, number> = {};
  allUsers.forEach(u => {
    const s = (u as any).source || "unknown";
    sourceCount[s] = (sourceCount[s] || 0) + 1;
  });

  // 即将到期的试用（3天内）
  const expiringTrials = trialing.filter(u => {
    const end = (u as any).subscriptionCurrentPeriodEnd;
    if (!end) return false;
    const daysLeft = (new Date(end).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysLeft <= 3 && daysLeft > 0;
  });

  const platformData = {
    snapshotTime: now.toISOString(),
    summary: {
      totalUsers: allUsers.length,
      activeSubscribers: active.length,
      trialing: trialing.length,
      canceled: canceled.length,
      pastDue: pastDue.length,
      noSubscription: noSub.length,
      registrationsLast7Days: last7.length,
      registrationsLast30Days: last30.length,
      expiringTrialsWithin3Days: expiringTrials.length,
    },
    infrastructure: {
      sharedVps1Users: vps1Users.length,
      sharedVps2Users: vps2Users.length,
      independentVpsUsers: independentVps.length,
    },
    modelPreferences: modelCount,
    expiringTrials: expiringTrials.map(u => ({
      email: u.email,
      periodEnd: (u as any).subscriptionCurrentPeriodEnd,
    })),
    recentSignups: last7.map(u => ({
      email: u.email,
      subscriptionStatus: u.subscriptionStatus,
      joinedAt: u.createdAt,
    })),
  };

  const systemPrompt = `你是 TinyClaw SaaS 平台的数据分析师助手。TinyClaw 是一个为用户提供独立 OpenClaw AI Agent 服务器（VPS）的平台，用户通过 Stripe 订阅付费，每月 $29.99。

你的职责：
1. 分析平台运营数据，提供清晰、可操作的业务洞察
2. 用简体中文回答，语言简洁专业
3. 发现风险点（如即将到期的试用、异常用户等）
4. 提出具体的优化建议

当前平台快照数据：
\`\`\`json
${JSON.stringify(platformData, null, 2)}
\`\`\`

请根据上述数据和用户问题，提供深度分析。如果有数据异常或需要关注的风险，请明确指出。`;

  // 流式输出
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const model = process.env.GEMINI_MODEL || "gemini-2.0-flash-001";
        await geminiStream(
          systemPrompt,
          question,
          (chunk) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          },
          model
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
