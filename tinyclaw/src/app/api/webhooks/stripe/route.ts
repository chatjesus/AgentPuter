import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

// Stripe webhook 需要原始 body 来验证签名
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
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const clerkId = session.metadata?.clerkId;
  const subscriptionId = session.subscription as string;

  if (!clerkId) {
    console.error("[STRIPE WEBHOOK] No clerkId in session metadata");
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as Stripe.Subscription;

  const stripeCustomerId = typeof session.customer === "string"
    ? session.customer
    : (session.customer as any)?.id ?? null;

  // 重新订阅时重置 VPS 状态，确保走完整的 create 流程（而非复用已失效的旧数据）
  await db
    .update(users)
    .set({
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: stripeCustomerId ?? undefined,
      subscriptionStatus: subscription.status,
      subscriptionCurrentPeriodEnd: new Date(
        (subscription as any).current_period_end * 1000
      ),
      status: "subscribed",
      vpsIp: null,
      hetznerServerId: null,
      gatewayToken: null,
    })
    .where(eq(users.clerkId, clerkId));

  console.log(
    `[STRIPE WEBHOOK] User ${clerkId} subscribed: ${subscription.status}, customer: ${stripeCustomerId}`
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

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
        (subscription as any).current_period_end * 1000
      ),
    })
    .where(eq(users.stripeCustomerId, customerId));

  console.log(
    `[STRIPE WEBHOOK] Subscription updated for ${customerId}: ${subscription.status}`
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, customerId),
  });

  if (!user) {
    console.error(`[STRIPE WEBHOOK] No user for customer: ${customerId}`);
    return;
  }

  if (user.hetznerServerId) {
    if (user.hetznerServerId.startsWith("shared-")) {
      await deleteSharedContainer(user.hetznerServerId, user.clerkId, user.vpsIp);
    } else {
      await deleteHetznerServer(user.hetznerServerId, user.clerkId);
    }
  }

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
      discordConnected: "false",
      whatsappConnected: "false",
    })
    .where(eq(users.stripeCustomerId, customerId));

  console.log(
    `[STRIPE WEBHOOK] Subscription ended for ${customerId} (${user.clerkId})`
  );
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  await db
    .update(users)
    .set({ subscriptionStatus: "past_due" })
    .where(eq(users.stripeCustomerId, customerId));

  console.log(
    `[STRIPE WEBHOOK] Payment failed for customer: ${customerId} — marked past_due`
  );
}

function getVPSPassword(host: string): string {
  if (process.env.SHARED_VPS_HOST_2 && host === process.env.SHARED_VPS_HOST_2) {
    return process.env.SHARED_VPS_PASSWORD_2 || "";
  }
  return process.env.SHARED_VPS_PASSWORD || "";
}

async function deleteSharedContainer(sharedId: string, clerkId: string, vpsIp: string | null) {
  const shortId = sharedId.replace("shared-", "");
  const containerName = `tc-${shortId}`;
  const userDir = `/opt/tinyclaw/users/${shortId}`;

  const host = vpsIp?.split(":")[0] || process.env.SHARED_VPS_HOST;
  const pass = host ? getVPSPassword(host) : "";
  if (!host || !pass) {
    console.log(`[SHARED] No VPS credentials for ${host}, skip cleanup for ${clerkId}`);
    return;
  }

  try {
    const { Client } = await import("ssh2");
    await new Promise<void>((resolve, reject) => {
      const conn = new Client();
      conn.on("ready", () => {
        const verifyAndDelete = [
          `RUNNING=$(docker inspect --format '{{.State.Running}}' ${containerName} 2>/dev/null || echo 'missing')`,
          `if [ "$RUNNING" = "missing" ]; then echo "CONTAINER_NOT_FOUND"; rm -rf ${userDir} 2>/dev/null; exit 0; fi`,
          `docker stop ${containerName} 2>/dev/null; docker rm ${containerName} 2>/dev/null; rm -rf ${userDir}; echo "DELETED"`,
        ].join("; ");
        conn.exec(verifyAndDelete, (err, stream) => {
          if (err) { conn.end(); reject(err); return; }
          let output = "";
          stream.on("data", (d: Buffer) => { output += d.toString(); });
          stream.on("close", () => {
            conn.end();
            console.log(`[SHARED] Cleanup result for ${containerName} on ${host}: ${output.trim()}`);
            resolve();
          });
          stream.stderr.on("data", () => {});
        });
      }).on("error", reject).connect({ host, port: 22, username: "root", password: pass, readyTimeout: 10000 });
    });
  } catch (error) {
    console.error(`[SHARED] Failed to cleanup container ${containerName} on ${host}:`, error);
  }
}

async function deleteHetznerServer(serverId: string, clerkId: string) {
  const HETZNER_TOKEN = process.env.HETZNER_API_TOKEN;
  if (!HETZNER_TOKEN || HETZNER_TOKEN === "") {
    console.log(
      `[DEV] Simulating VPS deletion for ${clerkId}, server: ${serverId}`
    );
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
      console.error(
        `[HETZNER] Failed to delete server ${serverId}:`,
        error
      );
    }
  } catch (error) {
    console.error(`[HETZNER] Error deleting server ${serverId}:`, error);
  }
}
