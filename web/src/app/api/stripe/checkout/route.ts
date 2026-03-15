import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/auth-utils";

export async function POST() {
  try {
    const { user, userId } = await getOrCreateUser();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: "Failed to create user record. Please try again." }, { status: 500 });
    }

    // 如果已经有活跃订阅，直接跳转 dashboard
    if (
      user.subscriptionStatus === "active" ||
      user.subscriptionStatus === "trialing"
    ) {
      return NextResponse.json({ url: "/dashboard" });
    }

    // 如果已有 Stripe Customer ID，复用
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      // 创建 Stripe Customer
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          clerkId: userId,
          userId: user.id,
        },
      });
      customerId = customer.id;

      // 保存 customer ID 到数据库
      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.clerkId, userId));
    }

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_CONFIG.proPriceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          clerkId: userId,
          userId: user.id,
        },
      },
      success_url: STRIPE_CONFIG.successUrl,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        clerkId: userId,
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE CHECKOUT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
