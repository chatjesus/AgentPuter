import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import Stripe from "stripe";
import { Client } from "ssh2";

// 简单的 admin token 验证
function isAuthorized(req: Request) {
  const token = req.headers.get("x-admin-token");
  return token === process.env.ADMIN_SECRET;
}

function sshExec(
  host: string,
  password: string,
  cmd: string,
  timeout = 15000
): Promise<string> {
  return new Promise((resolve) => {
    const conn = new Client();
    let out = "";
    const t = setTimeout(() => {
      conn.end();
      resolve("[TIMEOUT]");
    }, timeout);
    conn
      .on("ready", () => {
        conn.exec(cmd, (err, stream) => {
          if (err) {
            clearTimeout(t);
            conn.end();
            resolve("[ERROR]");
            return;
          }
          stream
            .on("close", () => {
              clearTimeout(t);
              conn.end();
              resolve(out.trim());
            })
            .on("data", (d: Buffer) => (out += d))
            .stderr.on("data", (d: Buffer) => (out += d));
        });
      })
      .on("error", () => {
        clearTimeout(t);
        resolve("[CONNECT_ERROR]");
      })
      .connect({
        host,
        port: 22,
        username: "root",
        password,
        readyTimeout: 10000,
      });
  });
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. 从 DB 拉所有用户
    const dbUsers = await db.select().from(users);

    // 2. 从 Stripe 拉所有活跃订阅
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-01-28.clover",
    });

    const allSubs: Stripe.Subscription[] = [];
    let hasMore = true;
    let startingAfter: string | undefined;
    while (hasMore) {
      const res = await stripe.subscriptions.list({
        limit: 100,
        status: "all",
        expand: ["data.customer"],
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });
      allSubs.push(...res.data);
      hasMore = res.has_more;
      if (res.data.length) startingAfter = res.data[res.data.length - 1].id;
      else break;
    }

    // 3. 查两台 VPS 容器状态
    const vpsConfigs = [
      {
        name: "VPS1",
        host: process.env.SHARED_VPS_HOST!,
        pass: process.env.SHARED_VPS_PASSWORD!,
      },
      ...(process.env.SHARED_VPS_HOST_2
        ? [
            {
              name: "VPS2",
              host: process.env.SHARED_VPS_HOST_2!,
              pass: process.env.SHARED_VPS_PASSWORD_2!,
            },
          ]
        : []),
    ];

    const containerMap: Record<
      string,
      { status: string; vps: string; uptime: string }
    > = {};
    for (const vps of vpsConfigs) {
      const out = await sshExec(
        vps.host,
        vps.pass,
        `docker ps -a --format '{{.Names}}|{{.Status}}|{{.RunningFor}}' | grep tc-user`
      );
      if (out && out !== "[TIMEOUT]" && out !== "[ERROR]") {
        out.split("\n").forEach((line) => {
          const [name, status, uptime] = line.split("|");
          if (name) {
            // tc-userXXXXXX => userXXXXXX
            const userId = name.replace("tc-", "");
            containerMap[userId] = {
              status: status?.startsWith("Up") ? "running" : "stopped",
              vps: vps.name,
              uptime: uptime || "",
            };
          }
        });
      }
    }

    // 4. 合并数据
    const now = Math.floor(Date.now() / 1000);
    const subByCustomer: Record<string, Stripe.Subscription[]> = {};
    allSubs.forEach((s) => {
      const custId =
        typeof s.customer === "string" ? s.customer : s.customer?.id || "";
      if (!subByCustomer[custId]) subByCustomer[custId] = [];
      subByCustomer[custId].push(s);
    });

    // 构建 email -> stripe sub 映射
    const subByEmail: Record<string, Stripe.Subscription> = {};
    allSubs.forEach((s) => {
      const cust = s.customer as Stripe.Customer | null;
      const email = cust?.email || "";
      if (!email) return;
      // 优先保留活跃/试用中的
      if (
        !subByEmail[email] ||
        s.status === "active" ||
        s.status === "trialing"
      ) {
        subByEmail[email] = s;
      }
    });

    const result = dbUsers.map((u) => {
      const sub = u.email ? subByEmail[u.email] : undefined;
      const hetzId = u.hetznerServerId || "";
      // hetznerServerId 格式: shared-VPS1-userXXX 或 shared-VPS2-userXXX
      const containerKey = hetzId.replace(/^shared-VPS\d+-/, "");
      const container = containerMap[containerKey] || null;

      let stripeStatus = sub?.status || "no_subscription";
      let cancelAtPeriodEnd = sub?.cancel_at_period_end || false;
      let trialEnd = sub?.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null;
      // 新版 Stripe API 移除了 current_period_end，用 cancel_at 或 billing_cycle_anchor 代替
      const periodEndTs = sub?.cancel_at || sub?.billing_cycle_anchor || null;
      let periodEnd = periodEndTs
        ? new Date(periodEndTs * 1000).toISOString()
        : null;
      let trialDaysLeft =
        sub?.trial_end && sub.trial_end > now
          ? Math.ceil((sub.trial_end - now) / 86400)
          : null;

      // 计算 label
      let statusLabel = "";
      if (stripeStatus === "canceled") statusLabel = "canceled";
      else if (cancelAtPeriodEnd) statusLabel = "canceling";
      else if (stripeStatus === "trialing") statusLabel = "trialing";
      else if (stripeStatus === "active") statusLabel = "active";
      else statusLabel = stripeStatus;

      return {
        id: u.id,
        email: u.email,
        status: u.status,
        selectedModel: u.selectedModel,
        vpsIp: u.vpsIp,
        hetznerServerId: hetzId,
        createdAt: u.createdAt,
        // stripe
        stripeStatus,
        statusLabel,
        cancelAtPeriodEnd,
        trialEnd,
        periodEnd,
        trialDaysLeft,
        stripeSubId: sub?.id || null,
        // container
        container,
      };
    });

    // 统计
    const stats = {
      total: result.length,
      active: result.filter((u) => u.statusLabel === "active").length,
      trialing: result.filter((u) => u.statusLabel === "trialing").length,
      canceling: result.filter((u) => u.statusLabel === "canceling").length,
      canceled: result.filter((u) => u.statusLabel === "canceled").length,
      noSub: result.filter((u) => u.statusLabel === "no_subscription").length,
      containersRunning: result.filter(
        (u) => u.container?.status === "running"
      ).length,
      containersStopped: result.filter(
        (u) => u.container?.status === "stopped"
      ).length,
    };

    return NextResponse.json({ users: result, stats });
  } catch (e) {
    console.error("[admin/users]", e);
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
