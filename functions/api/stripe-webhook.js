/**
 * Cloudflare Pages Function: POST /api/stripe-webhook
 * 处理 Stripe Webhook 事件，使用 Web Crypto API 验签
 *
 * 需要在 Cloudflare Pages 环境变量中设置：
 *   STRIPE_WEBHOOK_SECRET — Stripe Webhook 签名密钥（whsec_xxx）
 *   SUBSCRIBERS           — KV Namespace binding（已有）
 */
export async function onRequestPost(context) {
  const { env, request } = context;

  const WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  const isValid = await verifyStripeSignature(rawBody, signature, WEBHOOK_SECRET);
  if (!isValid) {
    return new Response('Invalid signature', { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (_) {
    return new Response('Invalid JSON', { status: 400 });
  }

  // 处理关键事件
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await handleCheckoutCompleted(session, env);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionCanceled(subscription, env);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.log(`[webhook] Payment failed for customer: ${invoice.customer}`);
      break;
    }

    default:
      // 忽略其他事件
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * 使用 Web Crypto API 验证 Stripe Webhook 签名
 * 文档: https://stripe.com/docs/webhooks/signatures
 */
async function verifyStripeSignature(payload, header, secret) {
  if (!header) return false;

  // header 格式: t=timestamp,v1=signature
  const parts = Object.fromEntries(
    header.split(',').map((p) => p.split('=', 2))
  );

  const timestamp = parts['t'];
  const receivedSig = parts['v1'];

  if (!timestamp || !receivedSig) return false;

  // 防重放：时间戳在 5 分钟内有效
  const tolerance = 300; // 秒
  const timeDiff = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (Math.abs(timeDiff) > tolerance) return false;

  const signedPayload = `${timestamp}.${payload}`;

  // 导入密钥
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // 计算 HMAC
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(signedPayload)
  );

  // 转十六进制
  const expectedSig = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // 常量时间比较（防时序攻击）
  return timingSafeEqual(expectedSig, receivedSig);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * checkout.session.completed — 订阅成功
 * 将客户 email + Stripe Customer ID 写入 KV
 */
async function handleCheckoutCompleted(session, env) {
  const email = session.customer_email || session.customer_details?.email;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  console.log(`[webhook] New subscription: ${email} (${customerId})`);

  if (email && env.SUBSCRIBERS) {
    const record = {
      email,
      customerId,
      subscriptionId,
      plan: 'pro',
      status: 'active',
      subscribedAt: new Date().toISOString(),
    };
    // 以 email 为 key 存储，TTL 不限
    await env.SUBSCRIBERS.put(`sub:${email}`, JSON.stringify(record));
    // 也以 customerId 为 key 存一份，方便查找
    if (customerId) {
      await env.SUBSCRIBERS.put(`cid:${customerId}`, JSON.stringify(record));
    }
  }
}

/**
 * customer.subscription.deleted — 订阅取消/到期
 */
async function handleSubscriptionCanceled(subscription, env) {
  const customerId = subscription.customer;
  console.log(`[webhook] Subscription canceled for customer: ${customerId}`);

  if (env.SUBSCRIBERS && customerId) {
    const raw = await env.SUBSCRIBERS.get(`cid:${customerId}`);
    if (raw) {
      const record = JSON.parse(raw);
      record.status = 'canceled';
      record.canceledAt = new Date().toISOString();
      await env.SUBSCRIBERS.put(`cid:${customerId}`, JSON.stringify(record));
      if (record.email) {
        await env.SUBSCRIBERS.put(`sub:${record.email}`, JSON.stringify(record));
      }
    }
  }
}
