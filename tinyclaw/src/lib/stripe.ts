import Stripe from "stripe";

// 懒加载 Stripe 实例，避免没有 STRIPE_SECRET_KEY 时 build 失败
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = (process.env.STRIPE_SECRET_KEY || "").trim();
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return _stripe;
}

// 向后兼容：保留 stripe 导出但改为 getter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

// Helper to safely read env vars
const env = (key: string, fallback = "") =>
  (process.env[key] || fallback).trim();

export const STRIPE_CONFIG = {
  // TinyClaw Pro — $29.99/mo + 7-day free trial
  proPriceId: env(
    "STRIPE_PRO_PRICE_ID",
    "price_1T2PMuLYWESu302OsZc7eYDN"
  ),

  trialDays: 7,

  webhookSecret: env("STRIPE_WEBHOOK_SECRET"),

  // TinyClaw 的 URL
  successUrl: `${env("NEXT_PUBLIC_APP_URL", "http://localhost:3099")}/creating?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${env("NEXT_PUBLIC_APP_URL", "http://localhost:3099")}/setup`,

  portalReturnUrl: `${env("NEXT_PUBLIC_APP_URL", "http://localhost:3099")}/dashboard`,
} as const;
