import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth-utils";

export async function GET() {
  const { user, userId } = await getOrCreateUser();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ status: "pending" });
  }

  // 如果 status 是 creating 但已超过 10 分钟 → 标记为 error 允许重试
  if (user.status === "creating" && user.createdAt) {
    const creatingDuration = Date.now() - new Date(user.createdAt).getTime();
    const TEN_MINUTES = 10 * 60 * 1000;

    if (creatingDuration > TEN_MINUTES && !user.vpsIp) {
      // 没有 IP 意味着 Hetzner 创建可能失败了
      console.log("[STATUS] Creating timeout without IP for", userId);
      await db
        .update(users)
        .set({ status: "error" })
        .where(eq(users.clerkId, userId));
      return NextResponse.json({ status: "error" });
    }
  }

  return NextResponse.json({
    status: user.status,
    ip: user.vpsIp,
    openclawUrl: user.vpsIp ? `http://${user.vpsIp}:18789` : null,
    telegramPaired: user.telegramPaired === "true",
    subscriptionStatus: user.subscriptionStatus || null,
    hasSubscription:
      user.subscriptionStatus === "active" ||
      user.subscriptionStatus === "trialing",
  });
}
