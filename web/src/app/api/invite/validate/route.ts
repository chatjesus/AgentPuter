import { auth } from "@clerk/nextjs/server";
import { db, users, inviteCodes } from "@/lib/db";
import { eq, and, gt, or, isNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { error: "Invitation code is required" },
      { status: 400 }
    );
  }

  const trimmedCode = code.trim().toUpperCase();

  // 先检查用户状态 —— 已经有邀请码/VPS 的用户直接放行，不再卡 usedCount
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (user?.status === "ready") {
    return NextResponse.json({ success: true, status: "ready" });
  }

  if (user?.inviteCode) {
    // 已经验证过邀请码了，直接放行（不管 usedCount）
    return NextResponse.json({ success: true, status: "already_invited" });
  }

  // 查找邀请码
  const invite = await db.query.inviteCodes.findFirst({
    where: eq(inviteCodes.code, trimmedCode),
  });

  if (!invite) {
    return NextResponse.json(
      { error: "Invalid invitation code" },
      { status: 400 }
    );
  }

  // 检查是否过期
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    return NextResponse.json(
      { error: "This invitation code has expired" },
      { status: 400 }
    );
  }

  // 检查使用次数（maxUses = -1 表示无限）
  if (invite.maxUses !== -1 && (invite.usedCount ?? 0) >= (invite.maxUses ?? 1)) {
    return NextResponse.json(
      { error: "This invitation code has reached its usage limit" },
      { status: 400 }
    );
  }

  // 更新邀请码使用次数
  await db
    .update(inviteCodes)
    .set({ usedCount: sql`${inviteCodes.usedCount} + 1` })
    .where(eq(inviteCodes.code, trimmedCode));

  // 更新用户状态
  if (user) {
    await db
      .update(users)
      .set({ inviteCode: trimmedCode, status: "invited" })
      .where(eq(users.clerkId, userId));
  } else {
    // 如果 webhook 没来得及创建用户记录，这里补建
    await db.insert(users).values({
      clerkId: userId,
      inviteCode: trimmedCode,
      status: "invited",
    });
  }

  return NextResponse.json({ success: true, status: "activated" });
}
