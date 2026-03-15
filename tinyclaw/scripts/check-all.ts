
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
  const dbUsers = await sql`SELECT * FROM users WHERE source = 'tinyclaw' ORDER BY created_at DESC`;
  
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" as any });
  const subs = await stripe.subscriptions.list({ limit: 100, status: "all", expand: ["data.customer"] });
  
  const vps1 = await sshExec("178.156.252.255", "FJrStLB@qephSyjd", "docker ps -a --format '{{.Names}}|{{.Status}}' | grep tc-user");
  const vps2 = await sshExec("5.161.200.75", "tqdibatJavFu", "docker ps -a --format '{{.Names}}|{{.Status}}' | grep tc-user");

  console.log("--- DB USERS (TinyClaw) ---");
  console.table(dbUsers.map(u => ({ id: u.id, email: u.email, status: u.status, vps: u.vps_ip, created: u.created_at })));

  console.log("\n--- STRIPE SUBS ---");
  const subByEmail: any = {};
  subs.data.forEach((s: any) => {
    const email = (s.customer as any).email;
    if (email) subByEmail[email] = s.status;
  });
  console.log(subByEmail);

  console.log("\n--- VPS CONTAINERS ---");
  console.log("VPS1:\n", vps1);
  console.log("VPS2:\n", vps2);
  
  await sql.end();
}

run().catch(console.error);
