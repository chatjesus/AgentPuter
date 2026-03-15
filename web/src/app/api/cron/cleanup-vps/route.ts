import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq, and, lt, isNotNull, or } from "drizzle-orm";

/**
 * Cron job: 清理过期 VPS
 * 
 * 调用方式:
 *   GET /api/cron/cleanup-vps?secret=YOUR_CRON_SECRET
 * 
 * 建议用 Vercel Cron 或外部 cron 服务每天调用一次
 * 
 * 清理规则:
 * 1. subscriptionStatus = "canceled" 且有 hetznerServerId → 删除 VPS
 * 2. subscriptionStatus = "past_due" 且超过 3 天 → 删除 VPS
 * 3. status = "error" 且有 hetznerServerId 且超过 7 天 → 删除 VPS（创建失败的残留）
 */
export async function GET(req: NextRequest) {
  // 简单的 secret 鉴权
  const secret = req.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET || "cleanup-secret-change-me";

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const HETZNER_TOKEN = process.env.HETZNER_API_TOKEN;
  if (!HETZNER_TOKEN || HETZNER_TOKEN === "YOUR_HETZNER_TOKEN") {
    return NextResponse.json({ message: "Dev mode, skipping cleanup" });
  }

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let deleted = 0;
  let errors = 0;

  // 1. 已取消但 VPS 还在的用户（webhook 可能处理失败了）
  const canceledUsers = await db.query.users.findMany({
    where: and(
      eq(users.subscriptionStatus, "canceled"),
      isNotNull(users.hetznerServerId)
    ),
  });

  for (const user of canceledUsers) {
    if (await deleteHetznerServer(user.hetznerServerId!, HETZNER_TOKEN)) {
      await db
        .update(users)
        .set({
          status: "pending",
          vpsIp: null,
          vpsPassword: null,
          hetznerServerId: null,
          gatewayToken: null,
          telegramPaired: "false",
        })
        .where(eq(users.id, user.id));
      deleted++;
      console.log(`[CLEANUP] Deleted VPS for canceled user ${user.clerkId}`);
    } else {
      errors++;
    }
  }

  // 2. 付款失败超过 3 天的用户
  const pastDueUsers = await db.query.users.findMany({
    where: and(
      eq(users.subscriptionStatus, "past_due"),
      isNotNull(users.hetznerServerId),
      lt(users.subscriptionCurrentPeriodEnd, threeDaysAgo)
    ),
  });

  for (const user of pastDueUsers) {
    if (await deleteHetznerServer(user.hetznerServerId!, HETZNER_TOKEN)) {
      await db
        .update(users)
        .set({
          status: "pending",
          vpsIp: null,
          vpsPassword: null,
          hetznerServerId: null,
          gatewayToken: null,
          telegramPaired: "false",
        })
        .where(eq(users.id, user.id));
      deleted++;
      console.log(`[CLEANUP] Deleted VPS for past_due user ${user.clerkId}`);
    } else {
      errors++;
    }
  }

  // 3. 创建失败超过 7 天的残留 VPS
  const errorUsers = await db.query.users.findMany({
    where: and(
      eq(users.status, "error"),
      isNotNull(users.hetznerServerId),
      lt(users.createdAt, sevenDaysAgo)
    ),
  });

  for (const user of errorUsers) {
    if (await deleteHetznerServer(user.hetznerServerId!, HETZNER_TOKEN)) {
      await db
        .update(users)
        .set({
          hetznerServerId: null,
          vpsIp: null,
          vpsPassword: null,
        })
        .where(eq(users.id, user.id));
      deleted++;
      console.log(`[CLEANUP] Deleted stale error VPS for ${user.clerkId}`);
    } else {
      errors++;
    }
  }

  const result = {
    message: "Cleanup complete",
    deleted,
    errors,
    checked: {
      canceled: canceledUsers.length,
      pastDue: pastDueUsers.length,
      staleErrors: errorUsers.length,
    },
    timestamp: now.toISOString(),
  };

  console.log("[CLEANUP]", JSON.stringify(result));
  return NextResponse.json(result);
}

async function deleteHetznerServer(
  serverId: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.hetzner.cloud/v1/servers/${serverId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok || res.status === 404) {
      // 404 = 已经被删了，也算成功
      return true;
    }

    const error = await res.text();
    console.error(`[CLEANUP] Failed to delete server ${serverId}:`, error);
    return false;
  } catch (error) {
    console.error(`[CLEANUP] Error deleting server ${serverId}:`, error);
    return false;
  }
}
