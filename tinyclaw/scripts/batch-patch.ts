
import { Client } from 'ssh2';

async function sshExec(host: string, password: string, cmd: string): Promise<string> {
  return new Promise((resolve) => {
    const conn = new Client();
    let out = '';
    conn.on('ready', () => {
      conn.exec(cmd, (err, stream) => {
        if (err) { conn.end(); resolve(''); return; }
        stream.on('close', () => { conn.end(); resolve(out.trim()); })
              .on('data', (d: Buffer) => out += d)
              .stderr.on('data', (d: Buffer) => out += d);
      });
    }).on('error', () => resolve('')).connect({ host, port: 22, username: 'root', password });
  });
}

const vps = [
  { host: '178.156.252.255', pass: 'FJrStLB@qephSyjd' },
  { host: '5.161.200.75', pass: 'tqdibatJavFu' }
];

async function run() {
  for (const v of vps) {
    console.log('Patching VPS:', v.host);
    const patchCmd = `node -e "
      const fs = require('fs');
      const path = require('path');
      const base = '/opt/tinyclaw/users';
      if (!fs.existsSync(base)) { console.log('Base not found'); process.exit(0); }
      const dirs = fs.readdirSync(base);
      dirs.forEach(dir => {
        const cfgPath = path.join(base, dir, '.openclaw', 'openclaw.json');
        if (fs.existsSync(cfgPath)) {
          try {
            const content = fs.readFileSync(cfgPath, 'utf8');
            const c = JSON.parse(content);
            if(!c.gateway) c.gateway={};
            if(!c.gateway.controlUi) c.gateway.controlUi={};
            c.gateway.controlUi.allowInsecureAuth=true;
            c.gateway.controlUi.dangerouslyDisableDeviceAuth=true;
            c.gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true;
            if(c.commands) {
              delete c.commands.ownerDisplay;
              delete c.commands.ownerShortcutVersion;
            }
            fs.writeFileSync(cfgPath, JSON.stringify(c, null, 2));
            process.stdout.write('Patched: ' + cfgPath + '\\\\n');
          } catch(e) { process.stderr.write('Error: ' + e.message + '\\\\n'); }
        }
      });
    "`;
    const patchRes = await sshExec(v.host, v.pass, patchCmd);
    console.log(patchRes);
    
    console.log('Restarting containers on VPS:', v.host);
    const restartCmd = "docker ps -a --format '{{.Names}}' | grep tc-user | xargs -r docker restart";
    const restartRes = await sshExec(v.host, v.pass, restartCmd);
    console.log(restartRes);
  }
}

run().catch(console.error);
