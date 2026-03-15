import { Client } from "ssh2";

const VPS_HOST = "178.156.252.255";
const VPS_PASS = "FJrStLB@qephSyjd";
const USER_ID = "user3AahXKq";
const PORT = 19001;
const CONFIG_PATH = `/opt/tinyclaw/users/${USER_ID}/.openclaw/openclaw.json`;

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

  console.log("=== Reading config ===");
  const raw = await sshExec(conn, `cat ${CONFIG_PATH}`);
  console.log(raw.substring(0, 200));

  const config = JSON.parse(raw);
  if (!config.gateway) config.gateway = {};
  config.gateway.mode = "local";
  config.gateway.port = PORT;
  config.gateway.bind = "lan";
  if (!config.gateway.controlUi) config.gateway.controlUi = {};
  config.gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback = true;
  config.gateway.controlUi.allowInsecureAuth = true;
  config.gateway.controlUi.dangerouslyDisableDeviceAuth = true;
  if (!config.gateway.auth) {
    const crypto = await import("crypto");
    config.gateway.auth = { mode: "token", token: crypto.randomBytes(24).toString("hex") };
  }

  const newJson = JSON.stringify(config, null, 2);
  console.log("=== Writing config ===");
  console.log("gateway:", JSON.stringify(config.gateway));

  // Write via heredoc
  let r = await sshExec(conn, `cat > ${CONFIG_PATH} << 'OCEOF'\n${newJson}\nOCEOF`);
  console.log(r || "OK");

  console.log("=== Restart container ===");
  r = await sshExec(conn, `docker restart tc-${USER_ID}`);
  console.log(r);

  console.log("Waiting 10s...");
  await new Promise((res) => setTimeout(res, 10000));

  console.log("=== Status ===");
  r = await sshExec(conn, `docker ps -a --filter name=tc-${USER_ID} --format "{{.Names}} {{.Status}}"`);
  console.log(r);

  console.log("=== Logs ===");
  r = await sshExec(conn, `docker logs --tail 25 tc-${USER_ID} 2>&1`);
  console.log(r);

  conn.end();
}

main().catch(console.error);
