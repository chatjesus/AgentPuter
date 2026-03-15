import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { SignJWT } from "jose";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(process.env.DESKTOP_JWT_SECRET!);
const TOKEN_TTL_DAYS = 90;

// GET /api/desktop/auth/callback?state=xxx
// 用户完成 Clerk 登录后，Clerk 重定向到这里
// 我们颁发 device token 并重定向到 tinyclaw:// 深链接
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const state = req.nextUrl.searchParams.get("state") ?? "";

  if (!userId) {
    return NextResponse.redirect(
      new URL(`/sign-in?redirect_url=${encodeURIComponent(req.url)}`, req.url)
    );
  }

  let callbackUri = "tinyclaw://callback";
  try {
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
    callbackUri = decoded.callbackUri ?? callbackUri;
  } catch {}

  // 查找或创建用户记录（复用现有表）
  let user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
  if (!user) {
    const [created] = await db.insert(users).values({
      clerkId: userId,
      source: "desktop",
    }).returning();
    user = created;
  }

  // 颁发 90 天有效期 JWT device token
  const token = await new SignJWT({
    sub: user.id,
    clerkId: userId,
    plan: isPlusUser(user) ? "plus" : "free",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_DAYS}d`)
    .sign(JWT_SECRET);

  // 重定向到 tinyclaw://callback?token=xxx
  const deepLink = new URL(callbackUri);
  deepLink.searchParams.set("token", token);

  return NextResponse.redirect(deepLink.toString());
}

function isPlusUser(user: { subscriptionStatus?: string | null }): boolean {
  return user.subscriptionStatus === "active";
}
