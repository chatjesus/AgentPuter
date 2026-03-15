import Stripe from 'stripe';

// 懒加载 Stripe 实例，避免没有 STRIPE_SECRET_KEY 时 build 失败
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
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

// Helper to safely read env vars (trim trailing newlines from Vercel CLI)
const env = (key: string, fallback = '') => (process.env[key] || fallback).trim();

// Stripe product/price IDs (from Stripe Dashboard)
export const STRIPE_CONFIG = {
  // AgentPuter Pro - $29.99/month
  proPriceId: env('STRIPE_PRO_PRICE_ID', 'price_1SyujeLYWESu302OtpJt0gBq'),
  
  // Webhook secret for verifying Stripe events
  webhookSecret: env('STRIPE_WEBHOOK_SECRET'),
  
  // Success/Cancel URLs
  successUrl: `${env('NEXT_PUBLIC_APP_URL', 'https://app.agentputer.com')}/creating?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${env('NEXT_PUBLIC_APP_URL', 'https://app.agentputer.com')}/subscribe`,
  
  // Customer portal return URL
  portalReturnUrl: `${env('NEXT_PUBLIC_APP_URL', 'https://app.agentputer.com')}/dashboard`,
} as const;
