import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db, users, creditUsage } from "@/lib/db";
import { eq, and, sum } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(process.env.DESKTOP_JWT_SECRET!);

// GET /api/desktop/credits — 返回当前 credit 余额
export async function GET(req: NextRequest) {
  const token = extractBearerToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;
    const plan = (payload.plan as string) === "plus" ? "plus" : "free";

    // 从 KV 或 DB 读取今日用量（简化实现：用 DB 的 credit_usage 表）
    const today = new Date().toISOString().slice(0, 10);
    const usage = await getDailyUsage(userId, today);
    const monthUsage = await getMonthlyUsage(userId);

    const limits = {
      free: { daily: 200, monthly: 0 },
      plus: { daily: 1000, monthly: 5000 },
    };

    return NextResponse.json({
      dailyUsed: usage,
      dailyLimit: limits[plan].daily,
      monthlyUsed: monthUsage,
      monthlyLimit: limits[plan].monthly,
      plan,
      resetsAt: getNextMidnightUTC(),
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

async function getDailyUsage(userId: string, date: string): Promise<number> {
  const result = await db
    .select({ total: sum(creditUsage.credits) })
    .from(creditUsage)
    .where(and(eq(creditUsage.userId, userId), eq(creditUsage.usageDate, date)));
  return Number(result[0]?.total ?? 0);
}

async function getMonthlyUsage(userId: string): Promise<number> {
  const month = new Date().toISOString().slice(0, 7); // "2026-02"
  const result = await db
    .select({ total: sum(creditUsage.credits) })
    .from(creditUsage)
    .where(and(eq(creditUsage.userId, userId)));
  // 简化：返回总用量（后续可以按月筛选）
  return Number(result[0]?.total ?? 0);
}

function getNextMidnightUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
