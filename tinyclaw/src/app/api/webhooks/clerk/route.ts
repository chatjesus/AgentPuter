import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Clerk webhook：用户创建时自动写入数据库
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "user.created") {
      const clerkId = data.id;
      const email =
        data.email_addresses?.[0]?.email_address || null;

      // 检查是否已存在
      const existing = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
      });

      if (!existing) {
        await db.insert(users).values({
          clerkId,
          email,
          status: "pending",
          source: "tinyclaw",
        });
        console.log("[WEBHOOK] Created user:", clerkId, email);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
