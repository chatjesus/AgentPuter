import { auth, clerkClient } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * Get authenticated user from DB, auto-creating if missing.
 * This handles the case where Clerk webhook (user.created) failed or was delayed.
 * Returns null if not authenticated.
 */
export async function getOrCreateUser() {
  const { userId } = await auth();

  if (!userId) {
    return { user: null, userId: null };
  }

  // Try to find existing user
  let user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    // User authenticated with Clerk but not in our DB
    // This happens when Clerk webhook didn't fire (e.g. webhook not configured for production)
    // Auto-create the user record
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
        })
        .returning();

      user = newUser;
    } catch (err) {
      console.error("[getOrCreateUser] auto-create failed:", userId, err);
      return { user: null, userId };
    }
  }

  return { user, userId };
}
