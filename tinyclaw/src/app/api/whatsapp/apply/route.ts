import { auth } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Client } from "ssh2";

// 扫码完成后调用：终止后台 login 进程 → 重启容器 → gateway 加载已保存的 WhatsApp session
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.status !== "ready" || !user.vpsIp) {
    return NextResponse.json({ error: "VPS not ready" }, { status: 400 });
  }

  // 开发模式
  if (!user.vpsPassword || user.vpsPassword === "DevPassword123!") {
    await db.update(users).set({ whatsappConnected: "linked" }).where(eq(users.clerkId, userId));
    return NextResponse.json({ success: true, message: "[DEV] WhatsApp applied" });
  }

  const isSharedMode = user.hetznerServerId?.startsWith("shared-");

  try {
    if (isSharedMode) {
      const shortId = user.hetznerServerId!.replace("shared-", "");
      const containerName = `tc-${shortId}`;
      const sharedHost = process.env.SHARED_VPS_HOST!;
      const sharedPassword = process.env.SHARED_VPS_PASSWORD!;

      // 终止后台 login 进程（避免与 gateway 抢占 WhatsApp 连接）
      await executeSSHCommand(
        sharedHost, sharedPassword,
        `docker exec ${containerName} sh -c 'pkill -f "openclaw channels login" 2>/dev/null; echo done' || true`
      );

      // 重启容器让 gateway 以保存的 session 凭证重新连接 WhatsApp
      await executeSSHCommand(sharedHost, sharedPassword, `docker restart ${containerName} 2>&1 || true`);

      // 等待 gateway 健康（最多 2 分钟）
      const vpsPort = user.vpsIp.includes(":") ? user.vpsIp.split(":")[1] : "19000";
      let healthOk = false;
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 10000));
        const code = await executeSSHCommand(
          sharedHost, sharedPassword,
          `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${vpsPort} || echo '000'`
        );
        if (code.trim() === "200") { healthOk = true; break; }
      }

      if (!healthOk) {
        return NextResponse.json({ success: false, error: "Gateway failed to restart. Please try again." });
      }

      await db.update(users).set({ whatsappConnected: "linked" }).where(eq(users.clerkId, userId));
      return NextResponse.json({ success: true });

    } else {
      // 独立 VPS 模式
      const vpsHost = user.vpsIp.includes(":") ? user.vpsIp.split(":")[0] : user.vpsIp;

      await executeSSHCommand(vpsHost, user.vpsPassword, `pkill -f "openclaw channels login" 2>/dev/null; true`);
      await executeSSHCommand(vpsHost, user.vpsPassword, `systemctl restart openclaw 2>&1`);
      await new Promise(r => setTimeout(r, 10000));

      const status = await executeSSHCommand(vpsHost, user.vpsPassword, `systemctl is-active openclaw`);
      if (status.trim() !== "active") {
        return NextResponse.json({ success: false, error: "Service failed to restart." });
      }

      await db.update(users).set({ whatsappConnected: "linked" }).where(eq(users.clerkId, userId));
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("[WhatsApp apply] Error:", error);
    return NextResponse.json({ error: "Failed to apply WhatsApp session." }, { status: 500 });
  }
}

function executeSSHCommand(host: string, password: string, command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let output = "";
    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) { conn.end(); reject(err); return; }
          stream
            .on("close", () => { conn.end(); resolve(output.trim()); })
            .on("data", (d: Buffer) => { output += d.toString(); })
            .stderr.on("data", (d: Buffer) => { output += d.toString(); });
        });
      })
      .on("error", reject)
      .connect({ host, port: 22, username: "root", password, readyTimeout: 10000 });
  });
}
