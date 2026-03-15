import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db, creditUsage } from "@/lib/db";
import { eq, and, sum } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(process.env.DESKTOP_JWT_SECRET!);

// LLM 请求多路复用器
// POST /api/proxy/llm/openai  → 转发到 OpenAI
// POST /api/proxy/llm/anthropic → 转发到 Anthropic
// POST /api/proxy/llm/google → 转发到 Google

const PROVIDER_URLS: Record<string, string> = {
  openai: "https://api.openai.com",
  anthropic: "https://api.anthropic.com",
  google: "https://generativelanguage.googleapis.com",
};

const PROVIDER_KEYS: Record<string, string | undefined> = {
  openai: process.env.OPENAI_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  google: process.env.GOOGLE_API_KEY,
};

// 每 credit 消耗的 token 数（近似，按 GPT-4o-mini 的价格作基准）
const MODEL_CREDIT_RATE: Record<string, number> = {
  "gemini-1.5-flash": 2000,   // 0.5x — 2000 tokens/credit
  "gpt-4o-mini": 1000,        // 1x  — 1000 tokens/credit
  "gpt-4o": 666,              // 1.5x
  "claude-sonnet-4-5": 500,   // 2x
  "gemini-1.5-pro": 666,      // 1.5x
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const baseUrl = PROVIDER_URLS[provider];
  const apiKey = PROVIDER_KEYS[provider];

  if (!baseUrl || !apiKey) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  // 校验 device token
  const token = extractBearerToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userId: string;
  let plan: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.sub as string;
    plan = (payload.plan as string) ?? "free";
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // 检查 credit 余额
  const dailyLimit = plan === "plus" ? 1000 : 200;
  const dailyUsed = await getDailyUsage(userId);
  if (dailyUsed >= dailyLimit) {
    return NextResponse.json(
      { error: "Daily credit limit reached", code: "CREDIT_LIMIT_REACHED" },
      { status: 429 }
    );
  }

  // 获取请求体（转发给 LLM）
  const body = await req.text();
  const pathAfterProvider = req.nextUrl.pathname.replace(`/api/proxy/llm/${provider}`, "");

  const upstream = await fetch(`${baseUrl}${pathAfterProvider || "/v1/chat/completions"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      // Anthropic 需要额外 header
      ...(provider === "anthropic" ? { "anthropic-version": "2023-06-01", "x-api-key": apiKey } : {}),
    },
    body,
  });

  // 异步记录用量（不阻塞响应）
  upstream.clone().json().then((data) => {
    const tokens = data?.usage?.total_tokens ?? 200;
    const model = JSON.parse(body)?.model ?? "gpt-4o-mini";
    const rate = MODEL_CREDIT_RATE[model] ?? 1000;
    const credits = Math.ceil(tokens / rate);
    recordUsage(userId, model, credits).catch(console.error);
  }).catch(() => {});

  const upstreamBody = upstream.body;
  return new NextResponse(upstreamBody, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
}

async function getDailyUsage(userId: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const result = await db
    .select({ total: sum(creditUsage.credits) })
    .from(creditUsage)
    .where(and(eq(creditUsage.userId, userId), eq(creditUsage.usageDate, today)));
  return Number(result[0]?.total ?? 0);
}

async function recordUsage(userId: string, model: string, credits: number): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  await db.insert(creditUsage).values({ userId, model, credits, usageDate: today });
}

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
