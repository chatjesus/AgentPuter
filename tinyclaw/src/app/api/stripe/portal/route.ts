import { auth } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { cookies } from "next/headers";

// 我们的 locale code → Stripe Billing Portal 支持的 locale
const STRIPE_LOCALE_MAP: Record<string, string> = {
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
  ar: "ar",
};

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 404 }
      );
    }

    // 读取用户语言偏好
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("tinyclaw-locale")?.value || "en";
    const stripeLocale = STRIPE_LOCALE_MAP[localeCookie] || "en";

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: STRIPE_CONFIG.portalReturnUrl,
      locale: stripeLocale as any,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE PORTAL ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
