import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export default async function Home() {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-up");
    }

    // 已登录 → 根据状态跳转
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      redirect("/subscribe");
    }

    // 按优先级判断状态
    if (user.status === "ready") {
      redirect("/dashboard");
    }

    if (user.status === "creating") {
      redirect("/creating");
    }

    // 有邀请码或已订阅 → 去部署页
    if (user.inviteCode || user.status === "invited" || user.status === "subscribed") {
      redirect("/creating");
    }

    redirect("/subscribe");
  } catch (e) {
    // Next.js redirect 会抛出特殊错误，需要重新抛出
    if (e && typeof e === "object" && "digest" in e) throw e;
    // 其他错误 → 安全降级到订阅页
    console.error("[HOME] Unexpected error:", e);
    redirect("/subscribe");
  }
}
