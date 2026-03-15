import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

const JWT_SECRET = new TextEncoder().encode(process.env.DESKTOP_JWT_SECRET!);

// GET /api/desktop/me
// 校验 device token，返回用户信息
export async function GET(req: NextRequest) {
  const token = extractBearerToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 从 Clerk 获取 email / name / avatar
    const clerkUser = await (await clerkClient()).users.getUser(user.clerkId);

    return NextResponse.json({
      id: user.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      plan: payload.plan ?? "free",
      avatarUrl: clerkUser.imageUrl,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
