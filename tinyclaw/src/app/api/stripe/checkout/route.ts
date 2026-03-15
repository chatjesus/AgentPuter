import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import type Stripe from "stripe";

// 我们的 locale code → Stripe 支持的 locale
const STRIPE_LOCALE_MAP: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  en: "en",
  zh: "zh",
  "zh-tw": "zh-TW",
  es: "es",
  ja: "ja",
  ko: "ko",
  de: "de",
  fr: "fr",
  pt: "pt-BR",
  ru: "ru",
  ar: "auto", // Stripe Checkout 暂不支持 ar，使用 auto 自动检测
};

export async function POST(req: Request) {
  try {
    let selectedModel = "claude";
    let selectedChannel = "telegram";
    try {
      const body = await req.json();
      if (body.model) selectedModel = body.model;
      if (body.channel) selectedChannel = body.channel;
    } catch {}

    const { user, userId } = await getOrCreateUser();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user record. Please try again." },
        { status: 500 }
      );
    }

    // 已有活跃订阅 → 跳转 dashboard
    if (
      user.subscriptionStatus === "active" ||
      user.subscriptionStatus === "trialing"
    ) {
      return NextResponse.json({ url: "/dashboard" });
    }

    // 复用已有的 Stripe Customer（test/live 环境可能不同，找不到时自动新建）
    let customerId = user.stripeCustomerId;

    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch (e: any) {
        // customer 在当前环境不存在（如 live customer 用 test key），重新建一个
        if (e?.code === "resource_missing") {
          customerId = null;
        } else {
          throw e;
        }
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          clerkId: userId,
          userId: user.id,
          source: "tinyclaw",
        },
      });
      customerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.clerkId, userId));
    }

    // 读取用户语言偏好
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("tinyclaw-locale")?.value || "en";
    const stripeLocale = STRIPE_LOCALE_MAP[localeCookie] || "auto";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      locale: stripeLocale,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_CONFIG.proPriceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: STRIPE_CONFIG.trialDays,
        metadata: {
          clerkId: userId,
          userId: user.id,
          source: "tinyclaw",
        },
      },
      success_url: `${STRIPE_CONFIG.successUrl}&model=${selectedModel}&channel=${selectedChannel}`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        clerkId: userId,
        userId: user.id,
        source: "tinyclaw",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[STRIPE CHECKOUT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
