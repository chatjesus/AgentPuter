import { Client } from "ssh2";

const VPS_HOST = "178.156.252.255";
const VPS_PASS = "FJrStLB@qephSyjd";

const USER_ID = "user3A1au7g";
const CONTAINER = `tc-${USER_ID}`;
const PORT = 19062;
const TOKEN = "3ac5a64c7efe393d3ddc2914840d8543de83b8a31783513c";

const config = {
  meta: { lastTouchedVersion: "2026.2.17", lastTouchedAt: new Date().toISOString() },
  wizard: { lastRunAt: new Date().toISOString(), lastRunVersion: "2026.2.2-3", lastRunCommand: "onboard", lastRunMode: "local" },
  agents: { defaults: { workspace: "/root/.openclaw/workspace", compaction: { mode: "safeguard" }, maxConcurrent: 4, subagents: { maxConcurrent: 8 } } },
  messages: { ackReactionScope: "group-mentions" },
  commands: { native: "auto", nativeSkills: "auto", restart: true },
  channels: { telegram: { dmPolicy: "allowlist", groupPolicy: "allowlist" } },
  gateway: {
    port: PORT,
    mode: "local",
    bind: "lan",
    controlUi: {
      allowInsecureAuth: true,
      dangerouslyDisableDeviceAuth: true,
      dangerouslyAllowHostHeaderOriginFallback: true,
      allowedOrigins: [`http://${VPS_HOST}:${PORT}`],
    },
    auth: { mode: "token", token: TOKEN },
    tailscale: { mode: "off", resetOnExit: false },
  },
  plugins: { entries: { telegram: { enabled: true } } },
};

function sshExec(conn: Client, cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream.on("data", (d: Buffer) => (out += d));
      stream.stderr.on("data", (d: Buffer) => (out += d));
      stream.on("close", () => resolve(out));
    });
  });
}

async function main() {
  const conn = new Client();
  await new Promise<void>((resolve) => {
    conn.on("ready", resolve);
    conn.connect({ host: VPS_HOST, port: 22, username: "root", password: VPS_PASS });
  });

  const USER_DIR = `/opt/tinyclaw/users/${USER_ID}`;
  const TC_DIR = `/opt/tc/${USER_ID}`;

  console.log("=== Creating directories ===");
  let r = await sshExec(conn, `mkdir -p ${USER_DIR}/.openclaw/{agents,canvas,cron,logs,memory,skills,workspace} && mkdir -p ${TC_DIR}`);
  console.log(r || "OK");

  console.log("=== Copying shared files ===");
  r = await sshExec(conn, `cp /opt/tc/user3A4B77r/gcp-sa.json ${TC_DIR}/gcp-sa.json && cp /opt/tc/user3A4B77r/openai.key ${TC_DIR}/openai.key`);
  console.log(r || "OK");

  console.log("=== Writing openclaw.json ===");
  const jsonStr = JSON.stringify(config, null, 2);
  r = await sshExec(conn, `cat > ${USER_DIR}/.openclaw/openclaw.json << 'OCEOF'\n${jsonStr}\nOCEOF`);
  console.log(r || "OK");

  console.log("=== Verify config ===");
  r = await sshExec(conn, `cat ${USER_DIR}/.openclaw/openclaw.json | head -5`);
  console.log(r);

  console.log("=== Stop old container ===");
  r = await sshExec(conn, `docker stop ${CONTAINER} 2>/dev/null; docker rm ${CONTAINER} 2>/dev/null; true`);
  console.log(r || "OK");

  console.log("=== Creating container ===");
  const dockerCmd = [
    "docker run -d --init",
    `--name ${CONTAINER}`,
    "--network host",
    "--restart unless-stopped",
    `-v ${TC_DIR}/gcp-sa.json:/opt/tc/gcp-sa.json:ro`,
    `-v ${TC_DIR}/openai.key:/opt/tc/openai.key:ro`,
    `-v ${USER_DIR}/.openclaw:/root/.openclaw`,
    `-e GOOGLE_CLOUD_PROJECT=tinyclaw-prod`,
    `-e GOOGLE_CLOUD_LOCATION=global`,
    `-e NODE_OPTIONS="--max-old-space-size=1536"`,
    `-e HOME=/root`,
    `-e GOOGLE_APPLICATION_CREDENTIALS=/opt/tc/gcp-sa.json`,
    `openclaw-tc:latest`,
    `openclaw gateway --port ${PORT} --bind lan`,
  ].join(" ");
  r = await sshExec(conn, dockerCmd);
  console.log(r);

  console.log("=== Waiting 8s for startup ===");
  await new Promise((res) => setTimeout(res, 8000));

  console.log("=== Container status ===");
  r = await sshExec(conn, `docker ps -a --filter name=${CONTAINER} --format "{{.Names}} {{.Status}}"`);
  console.log(r);

  console.log("=== Recent logs ===");
  r = await sshExec(conn, `docker logs --tail 30 ${CONTAINER} 2>&1`);
  console.log(r);

  console.log("=== Port check ===");
  r = await sshExec(conn, `ss -tlnp | grep ${PORT} || echo "PORT NOT LISTENING"`);
  console.log(r);

  conn.end();
}

main().catch(console.error);
