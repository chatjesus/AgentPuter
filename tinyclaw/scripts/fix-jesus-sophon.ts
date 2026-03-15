import { Client } from "ssh2";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL!;

function sshExec(host: string, pass: string, cmd: string): Promise<string> {
  return new Promise((resolve) => {
    const conn = new Client();
    let out = "";
    conn
      .on("ready", () => {
        conn.exec(cmd, (err, stream) => {
          if (err) { conn.end(); resolve("ERR:" + err.message); return; }
          stream.on("close", () => { conn.end(); resolve(out.trim()); })
                .on("data", (d: Buffer) => (out += d))
                .stderr.on("data", (d: Buffer) => (out += d));
        });
      })
      .on("error", () => resolve("CONN_ERR"))
      .connect({ host, port: 22, username: "root", password: pass, readyTimeout: 10000 });
  });
}

async function run() {
  const H = "178.156.252.255", P = "FJrStLB@qephSyjd";
  const sql = postgres(DATABASE_URL);

  // ========== FIX JESUS ==========
  console.log("=== JESUS: removing unsupported config key ===");
  await sshExec(H, P, "docker stop tc-user3A0tTEx 2>/dev/null; true");

  const jesusScript = `
const fs = require("fs");
const p = "/opt/tinyclaw/users/user3A0tTEx/.openclaw/openclaw.json";
const c = JSON.parse(fs.readFileSync(p, "utf8"));
delete c.channels.telegram.botToken;
c.plugins.entries.telegram.enabled = false;
// This image is openclaw:latest which does NOT support this key
delete c.gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback;
fs.writeFileSync(p, JSON.stringify(c, null, 2));
console.log("OK: removed bad TG token + unsupported key");
`;
  await sshExec(H, P, `cat > /tmp/fix.js << 'SCRIPT'\n${jesusScript}\nSCRIPT`);
  console.log(await sshExec(H, P, "node /tmp/fix.js"));
  await sshExec(H, P, "docker start tc-user3A0tTEx");
  console.log("Jesus container restarted");

  // ========== FIX SOPHON ==========
  console.log("\n=== SOPHON: switching to fresh port 19083 ===");
  await sshExec(H, P, "docker stop tc-user39fGbuk 2>/dev/null; docker rm tc-user39fGbuk 2>/dev/null; true");
  await sshExec(H, P, "fuser -k 19082/tcp 2>/dev/null; true");
  await new Promise(r => setTimeout(r, 3000));

  const sophonScript = `
const fs = require("fs");
const p = "/opt/tinyclaw/users/user39fGbuk/.openclaw/openclaw.json";
const c = JSON.parse(fs.readFileSync(p, "utf8"));
c.gateway.port = 19083;
c.gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback = true;
c.gateway.controlUi.allowedOrigins = ["http://178.156.252.255:19083"];
fs.writeFileSync(p, JSON.stringify(c, null, 2));
console.log("OK: port changed to 19083");
`;
  await sshExec(H, P, `cat > /tmp/fix.js << 'SCRIPT'\n${sophonScript}\nSCRIPT`);
  console.log(await sshExec(H, P, "node /tmp/fix.js"));

  // Verify port 19083 is free
  const portCheck = await sshExec(H, P, "ss -tlnp | grep :19083 || echo 'PORT 19083 FREE'");
  console.log(portCheck);

  const dockerCmd = [
    "docker run -d --init",
    "--name tc-user39fGbuk",
    "--restart always",
    "--network host",
    "--memory 2g --cpus 1.0",
    "-e NODE_OPTIONS=--max-old-space-size=1536",
    "-e HOME=/root",
    "-e GOOGLE_APPLICATION_CREDENTIALS=/opt/tc/gcp-sa.json",
    "-e GOOGLE_CLOUD_PROJECT=tinyclaw-prod",
    "-e GOOGLE_CLOUD_LOCATION=global",
    "-v /opt/tc/user39fGbuk/gcp-sa.json:/opt/tc/gcp-sa.json:ro",
    "-v /opt/tinyclaw/users/user39fGbuk/.openclaw:/root/.openclaw",
    "openclaw-tc:latest",
    "openclaw gateway --port 19083 --bind lan",
  ].join(" ");
  console.log(await sshExec(H, P, dockerCmd));
  console.log("Sophon container started on port 19083");

  // Update DB
  await sql`UPDATE users SET vps_ip = '178.156.252.255:19083' WHERE clerk_id LIKE 'user_39fGbuk%' AND source = 'tinyclaw'`;
  console.log("DB updated: sophon -> port 19083");

  // ========== VERIFY ==========
  console.log("\n=== Waiting 12s for startup... ===");
  await new Promise(r => setTimeout(r, 12000));

  const status = await sshExec(H, P, [
    'docker ps -a --filter name=tc-user3A0tTEx --format "{{.Names}}|{{.Status}}"',
    'docker ps -a --filter name=tc-user39fGbuk --format "{{.Names}}|{{.Status}}"',
  ].join("; "));
  console.log("Container status:", status);

  const jesusHttp = await sshExec(H, P, 'curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:19050/');
  const sophonHttp = await sshExec(H, P, 'curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:19083/');
  console.log("HTTP: Jesus:", jesusHttp, "| Sophon:", sophonHttp);

  const mem = await sshExec(H, P, 'docker stats tc-user3A0tTEx tc-user39fGbuk --no-stream --format "{{.Name}}: {{.MemUsage}} | CPU {{.CPUPerc}}"');
  console.log("Resources:\n" + mem);

  await sshExec(H, P, "rm -f /tmp/fix.js");
  await sql.end();
}

run().catch(console.error);
