import { auth, clerkClient } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * 获取已认证用户，不存在则自动创建。
 * 处理 Clerk webhook 未触发/延迟的场景。
 */
export async function getOrCreateUser() {
  const { userId } = await auth();

  if (!userId) {
    return { user: null, userId: null };
  }

  let user: any;
  try {
    user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });
  } catch (dbErr: any) {
    console.error("[getOrCreateUser] DB query failed:", userId, dbErr);
    throw dbErr;
  }

  if (!user) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || null;

      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: email,
          status: "pending",
          source: "tinyclaw",
        })
        .returning();

      user = newUser;
    } catch (err: any) {
      console.error("[getOrCreateUser] auto-create failed:", userId, err);
      return { user: null, userId };
    }
  }

  return { user, userId };
}
