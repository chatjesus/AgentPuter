/**
 * Cloudflare Pages Function: POST /api/create-checkout-session
 * 创建 Stripe Checkout Session 并返回跳转 URL
 * 
 * 需要在 Cloudflare Pages 环境变量中设置：
 *   STRIPE_SECRET_KEY  — Stripe 密钥（sk_live_xxx 或 sk_test_xxx）
 *   STRIPE_PRICE_ID    — Stripe Price ID（price_xxx，在 Stripe Dashboard 预先创建）
 */
export async function onRequestPost(context) {
  const { env, request } = context;

  const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
  const STRIPE_PRICE_ID = env.STRIPE_PRICE_ID;

  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    return new Response(
      JSON.stringify({ error: 'Stripe configuration missing' }),
      { status: 500, headers: corsHeaders('application/json') }
    );
  }

  // 可选：从请求体中拿 email（用于 Stripe Checkout 预填）
  let customerEmail = '';
  try {
    const body = await request.json().catch(() => ({}));
    customerEmail = body.email || '';
  } catch (_) {}

  const params = new URLSearchParams({
    'payment_method_types[]': 'card',
    'line_items[0][price]': STRIPE_PRICE_ID,
    'line_items[0][quantity]': '1',
    mode: 'subscription',
    success_url: 'https://www.agentputer.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://www.agentputer.com/pricing?canceled=1',
    // 允许用户输入优惠码
    allow_promotion_codes: 'true',
    // 账单地址收集
    billing_address_collection: 'auto',
  });

  if (customerEmail) {
    params.set('customer_email', customerEmail);
  }

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();

  if (!stripeRes.ok) {
    return new Response(
      JSON.stringify({ error: session.error?.message || 'Stripe error' }),
      { status: 400, headers: corsHeaders('application/json') }
    );
  }

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: corsHeaders('application/json'),
  });
}

// OPTIONS 预检
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function corsHeaders(contentType) {
  const h = {
    'Access-Control-Allow-Origin': 'https://www.agentputer.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (contentType) h['Content-Type'] = contentType;
  return h;
}
