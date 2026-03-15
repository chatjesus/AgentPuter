
import Stripe from "stripe";
import { Client } from "ssh2";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL!;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;

async function sshExec(host: string, password: string, cmd: string): Promise<string> {
  return new Promise((resolve) => {
    const conn = new Client();
    let out = "";
    conn.on("ready", () => {
      conn.exec(cmd, (err, stream) => {
        if (err) { conn.end(); resolve(""); return; }
        stream.on("close", () => { conn.end(); resolve(out.trim()); })
              .on("data", (d: Buffer) => out += d)
              .stderr.on("data", (d: Buffer) => out += d);
      });
    }).on("error", () => resolve("")).connect({ host, port: 22, username: "root", password });
  });
}

async function run() {
  const sql = postgres(DATABASE_URL);
  const dbUsers = await sql`SELECT * FROM users WHERE source = 'tinyclaw'`;
  
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" as any });
  const subs: Stripe.Subscription[] = [];
  let hasMore = true;
  let lastId: string | undefined;
  while (hasMore) {
    const res = await stripe.subscriptions.list({ limit: 100, status: "all", expand: ["data.customer"], starting_after: lastId });
    subs.push(...res.data);
    hasMore = res.has_more;
    if (res.data.length > 0) lastId = res.data[res.data.length - 1].id;
    else break;
  }
  
  const vps1Out = await sshExec("178.156.252.255", "FJrStLB@qephSyjd", "docker ps -a --format '{{.Names}}|{{.Status}}' | grep tc-user");
  const vps2Out = await sshExec("5.161.200.75", "tqdibatJavFu", "docker ps -a --format '{{.Names}}|{{.Status}}' | grep tc-user");

  const runningContainers = new Set();
  [vps1Out, vps2Out].forEach(out => {
    out.split("\n").forEach(line => {
      const [name, status] = line.split("|");
      if (name && status && status.startsWith("Up")) {
        runningContainers.add(name.replace("tc-", ""));
      }
    });
  });

  const subByEmail: Record<string, string> = {};
  subs.forEach((s: any) => {
    const email = s.customer?.email;
    if (email) {
      if (!subByEmail[email] || s.status === 'active' || s.status === 'trialing') {
        subByEmail[email] = s.status;
      }
    }
  });

  const zombies = dbUsers.filter(u => {
    const email = u.email;
    const stripeStatus = subByEmail[email] || "no_subscription";
    const shortId = u.clerk_id.slice(0, 12).replace(/[^a-zA-Z0-9]/g, "");
    const isRunning = runningContainers.has(shortId);
    
    return isRunning && stripeStatus !== "active" && stripeStatus !== "trialing";
  }).map(u => {
    const stripeStatus = subByEmail[u.email] || "no_subscription";
    return {
      email: u.email,
      clerkId: u.clerk_id,
      stripeStatus,
      dbStatus: u.status,
      vpsIp: u.vps_ip
    };
  });

  console.log("\n--- ZOMBIES (LIVE DATA): CANCELED BUT STILL RUNNING ---");
  if (zombies.length === 0) {
    console.log("No zombies found.");
  } else {
    console.table(zombies);
  }

  await sql.end();
}

run().catch(console.error);
