import { NextRequest, NextResponse } from "next/server";

const ORCHESTRATOR_URL    = process.env.DEMO_ORCHESTRATOR_URL    || "http://65.108.251.173:4000";
const ORCHESTRATOR_SECRET = process.env.DEMO_ORCHESTRATOR_SECRET || "tc-demo-2026-secret";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      messages: { role: string; content: string }[];
      sessionId: string;
    };

    const upstream = await fetch(`${ORCHESTRATOR_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tc-secret": ORCHESTRATOR_SECRET,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    if (upstream.status === 429) {
      return NextResponse.json(data, { status: 429 });
    }
    if (!upstream.ok) {
      console.error("[Demo Chat] Orchestrator error:", data);
      // 降级：返回友好错误消息
      return NextResponse.json({
        content: "I'm having a brief moment — please try again in a second! 🙏",
        suggestions: [],
        showDeploy: false,
        messagesUsed: 0,
        messagesLeft: 6,
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[Demo Chat] Unexpected error:", err);
    return NextResponse.json({
      content: "Connection issue — please try again shortly.",
      suggestions: [],
      showDeploy: false,
      messagesUsed: 0,
      messagesLeft: 6,
    });
  }
}
