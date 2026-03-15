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
          if (err) { conn.end(); resolve("ERR"); return; }
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
  const NEW_PORT = 19085;

  // 1. Stop + remove container
  console.log("Stopping sophon...");
  await sshExec(H, P, "docker stop tc-user39fGbuk 2>/dev/null; docker rm tc-user39fGbuk 2>/dev/null; true");

  // 2. Kill ALL stale openclaw-gateway processes for this user
  await sshExec(H, P, "fuser -k 19082/tcp 2>/dev/null; fuser -k 19083/tcp 2>/dev/null; fuser -k 19085/tcp 2>/dev/null; true");
  await sshExec(H, P, 'pkill -f "openclaw gateway --port 1908" 2>/dev/null; true');

  // 3. Wait for ports to release
  await new Promise(r => setTimeout(r, 5000));
  const portCheck = await sshExec(H, P, `ss -tlnp | grep :${NEW_PORT} || echo PORT_FREE`);
  console.log("Port check:", portCheck);

  // 4. Write fix script to server
  const fixScript = [
    'const fs = require("fs");',
    'const p = "/opt/tinyclaw/users/user39fGbuk/.openclaw/openclaw.json";',
    'const c = JSON.parse(fs.readFileSync(p, "utf8"));',
    `c.gateway.port = ${NEW_PORT};`,
    `c.gateway.controlUi.allowedOrigins = ["http://178.156.252.255:${NEW_PORT}"];`,
    'fs.writeFileSync(p, JSON.stringify(c, null, 2));',
    'console.log("config updated to port " + c.gateway.port);',
  ].join("\n");

  await sshExec(H, P, `cat > /tmp/fix-sophon.js << 'EOF'\n${fixScript}\nEOF`);
  console.log(await sshExec(H, P, "node /tmp/fix-sophon.js"));

  // 5. Start container with --init flag
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
    `openclaw gateway --port ${NEW_PORT} --bind lan`,
  ].join(" ");
  const cid = await sshExec(H, P, dockerCmd);
  console.log("Container started:", cid.slice(0, 20));

  // 6. Update DB
  await sql`UPDATE users SET vps_ip = ${"178.156.252.255:" + NEW_PORT} WHERE clerk_id LIKE 'user_39fGbuk%' AND source = 'tinyclaw'`;
  console.log("DB updated to port", NEW_PORT);

  // 7. Stability checks
  for (let i = 0; i < 3; i++) {
    await new Promise(r => setTimeout(r, 10000));
    const st = await sshExec(H, P, 'docker ps -a --filter name=tc-user39fGbuk --format "{{.Status}}"');
    const mem = await sshExec(H, P, 'docker stats tc-user39fGbuk --no-stream --format "{{.MemUsage}}"');
    console.log(`Check ${i + 1}/3: ${st} | Mem: ${mem}`);
    if (st.includes("Restarting")) {
      console.log("STILL CRASHING! Logs:");
      console.log(await sshExec(H, P, "docker logs tc-user39fGbuk --tail 10 2>&1"));
      break;
    }
  }

  const http = await sshExec(H, P, `curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:${NEW_PORT}/`);
  console.log("HTTP:", http);

  await sshExec(H, P, "rm -f /tmp/fix-sophon.js");
  await sql.end();
}

run().catch(console.error);
