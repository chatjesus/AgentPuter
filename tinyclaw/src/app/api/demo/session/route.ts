import { NextRequest, NextResponse } from "next/server";

const ORCHESTRATOR_URL    = process.env.DEMO_ORCHESTRATOR_URL    || "http://65.108.251.173:4000";
const ORCHESTRATOR_SECRET = process.env.DEMO_ORCHESTRATOR_SECRET || "tc-demo-2026-secret";

const headers = {
  "Content-Type": "application/json",
  "x-tc-secret": ORCHESTRATOR_SECRET,
};

// POST /api/demo/session → 创建/获取 demo session
export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json() as { sessionId: string };
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const res = await fetch(`${ORCHESTRATOR_URL}/session/create`, {
      method: "POST",
      headers,
      body: JSON.stringify({ sessionId }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[Demo Session] Error:", err);
    return NextResponse.json({ error: "Failed to create demo session" }, { status: 500 });
  }
}

// GET /api/demo/session?sessionId=xxx → 查询状态
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/session/${sessionId}/status`, { headers });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[Demo Session Status] Error:", err);
    return NextResponse.json({ error: "Failed to get session status" }, { status: 500 });
  }
}
