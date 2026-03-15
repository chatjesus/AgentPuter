
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
          if (err) { conn.end(); resolve(""); return; }
          stream.on("close", () => { conn.end(); resolve(out.trim()); })
                .on("data", (d: Buffer) => (out += d))
                .stderr.on("data", (d: Buffer) => (out += d));
        });
      })
      .on("error", () => resolve(""))
      .connect({ host, port: 22, username: "root", password: pass });
  });
}

async function run() {
  const H = "178.156.252.255";
  const P = "FJrStLB@qephSyjd";
  const sql = postgres(DATABASE_URL);

  // Find 3 free ports
  const freePortsRaw = await sshExec(H, P, `for p in $(seq 19080 19100); do ss -tlnp 2>/dev/null | grep -q ":$p " || echo $p; done`);
  const freePorts = freePortsRaw.split("\n").filter(Boolean);
  console.log("Free ports:", freePorts.slice(0, 5));

  const fixes = [
    { name: "tc-user39tQ67G", user: "user39tQ67G", clerkPrefix: "user_39tQ67G", port: freePorts[0] },
    { name: "tc-user3A5j1eR", user: "user3A5j1eR", clerkPrefix: "user_3A5j1eR", port: freePorts[1] },
    { name: "tc-user39fGbuk", user: "user39fGbuk", clerkPrefix: "user_39fGbuk", port: freePorts[2] },
  ];

  for (const f of fixes) {
    console.log(`\nFixing ${f.name} -> port ${f.port}`);

    // Update openclaw.json port
    const updateCmd = `node -e "const fs=require('fs');const p='/opt/tinyclaw/users/${f.user}/.openclaw/openclaw.json';const c=JSON.parse(fs.readFileSync(p));c.gateway.port=${f.port};fs.writeFileSync(p,JSON.stringify(c,null,2));console.log('port updated to ${f.port}')"`;
    const updateRes = await sshExec(H, P, updateCmd);
    console.log("Config:", updateRes);

    // Stop + rm old container
    await sshExec(H, P, `docker stop ${f.name} 2>/dev/null; docker rm ${f.name} 2>/dev/null; true`);
    console.log("Old container removed");

    // Recreate with new port
    const userDir = `/opt/tinyclaw/users/${f.user}`;
    const platformKeyDir = `/opt/tc/${f.user}`;
    const dockerCmd = [
      `docker run -d`,
      `--name ${f.name}`,
      `--restart always`,
      `--network host`,
      `--memory 2g --cpus 1.0`,
      `-e NODE_OPTIONS=--max-old-space-size=1536`,
      `-e HOME=/root`,
      `-e GOOGLE_APPLICATION_CREDENTIALS=/opt/tc/gcp-sa.json`,
      `-e GOOGLE_CLOUD_PROJECT=tinyclaw-prod`,
      `-e GOOGLE_CLOUD_LOCATION=global`,
      `-v ${platformKeyDir}/gcp-sa.json:/opt/tc/gcp-sa.json:ro`,
      `-v ${userDir}/.openclaw:/root/.openclaw`,
      `openclaw-tc:latest`,
      `openclaw gateway --port ${f.port} --bind lan`,
    ].join(" ");

    const startRes = await sshExec(H, P, dockerCmd);
    console.log("Container started:", startRes.slice(0, 24));

    // Update DB
    const vpsAddr = `${H}:${f.port}`;
    await sql`UPDATE users SET vps_ip = ${vpsAddr} WHERE clerk_id LIKE ${f.clerkPrefix + "%"} AND source = 'tinyclaw'`;
    console.log("DB updated:", vpsAddr);
  }

  // Verify all containers
  const final = await sshExec(H, P, `docker ps -a --filter name=tc-user --format "{{.Names}}|{{.Status}}"`);
  console.log("\n--- FINAL CONTAINER STATUS ---");
  console.log(final);

  await sql.end();
}

run().catch(console.error);
