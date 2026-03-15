import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth-utils";

export async function GET() {
  try {
    const { user, userId } = await getOrCreateUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ status: "new" });
    }

    // 超时检测
    if (user.status === "creating" && user.createdAt) {
      const elapsed = Date.now() - new Date(user.createdAt).getTime();
      if (elapsed > 10 * 60 * 1000 && !user.vpsIp) {
        await db
          .update(users)
          .set({ status: "error" })
          .where(eq(users.clerkId, userId));
        return NextResponse.json({ status: "error" });
      }
    }

    return NextResponse.json({
      status: user.status,
      subscriptionStatus: user.subscriptionStatus,
      ip: user.vpsIp,
      model: user.selectedModel || "claude",
      openclawUrl: user.vpsIp ? `http://${user.vpsIp}:18789` : null,
    });
  } catch (error: any) {
    console.error("[VPS STATUS ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
