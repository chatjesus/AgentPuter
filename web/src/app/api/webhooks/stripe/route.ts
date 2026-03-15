import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

// Stripe 需要原始 body 来验证签名
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`[STRIPE WEBHOOK] Unhandled event: ${event.type}`);
    }
  } catch (error) {
    console.error(`[STRIPE WEBHOOK] Error handling ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

/**
 * Checkout 完成 → 更新用户为 subscribed 状态, 触发 VPS 创建
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const clerkId = session.metadata?.clerkId;
  const subscriptionId = session.subscription as string;

  if (!clerkId) {
    console.error("[STRIPE WEBHOOK] No clerkId in session metadata");
    return;
  }

  // 获取订阅详情
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await db
    .update(users)
    .set({
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: subscription.status, // 'active' or 'trialing'
      subscriptionCurrentPeriodEnd: new Date(
        subscription.current_period_end * 1000
      ),
      status: "subscribed", // 标记为已订阅，可以创建 VPS
    })
    .where(eq(users.clerkId, clerkId));

  console.log(
    `[STRIPE WEBHOOK] User ${clerkId} subscribed: ${subscription.status}`
  );
}

/**
 * 订阅更新 → 同步状态
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // 通过 Stripe Customer ID 查找用户
  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, customerId),
  });

  if (!user) {
    console.error(
      `[STRIPE WEBHOOK] No user found for customer: ${customerId}`
    );
    return;
  }

  await db
    .update(users)
    .set({
      subscriptionStatus: subscription.status,
      subscriptionCurrentPeriodEnd: new Date(
        subscription.current_period_end * 1000
      ),
    })
    .where(eq(users.stripeCustomerId, customerId));

  console.log(
    `[STRIPE WEBHOOK] Subscription updated for ${customerId}: ${subscription.status}`
  );
}

/**
 * 订阅到期/取消 → 删除 Hetzner VPS + 清理用户状态
 * customer.subscription.deleted 在订阅真正结束时触发（用户点取消后，到计费周期结束）
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, customerId),
  });

  if (!user) {
    console.error(`[STRIPE WEBHOOK] No user for customer: ${customerId}`);
    return;
  }

  // 删除 Hetzner VPS
  if (user.hetznerServerId) {
    await deleteHetznerServer(user.hetznerServerId, user.clerkId);
  }

  // 清理：保留账号但重置 VPS 相关字段
  await db
    .update(users)
    .set({
      subscriptionStatus: "canceled",
      status: "pending",
      vpsIp: null,
      vpsPassword: null,
      hetznerServerId: null,
      gatewayToken: null,
      telegramPaired: "false",
    })
    .where(eq(users.stripeCustomerId, customerId));

  console.log(
    `[STRIPE WEBHOOK] Subscription ended for ${customerId} (${user.clerkId}) — VPS ${user.hetznerServerId || "none"} deleted`
  );
}

/**
 * 付款失败 → 标记 past_due（Stripe 会自动重试 3 次，最终触发 subscription.deleted）
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  await db
    .update(users)
    .set({
      subscriptionStatus: "past_due",
    })
    .where(eq(users.stripeCustomerId, customerId));

  console.log(
    `[STRIPE WEBHOOK] Payment failed for customer: ${customerId} — marked past_due, VPS still active during grace period`
  );
}

/**
 * 调用 Hetzner API 删除服务器
 */
async function deleteHetznerServer(serverId: string, clerkId: string) {
  const HETZNER_TOKEN = process.env.HETZNER_API_TOKEN;
  if (!HETZNER_TOKEN || HETZNER_TOKEN === "YOUR_HETZNER_TOKEN") {
    console.log(`[DEV] Simulating VPS deletion for ${clerkId}, server: ${serverId}`);
    return;
  }

  try {
    const res = await fetch(
      `https://api.hetzner.cloud/v1/servers/${serverId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${HETZNER_TOKEN}` },
      }
    );

    if (res.ok) {
      console.log(`[HETZNER] Server ${serverId} deleted for user ${clerkId}`);
    } else {
      const error = await res.text();
      console.error(`[HETZNER] Failed to delete server ${serverId}:`, error);
    }
  } catch (error) {
    console.error(`[HETZNER] Error deleting server ${serverId}:`, error);
  }
}
