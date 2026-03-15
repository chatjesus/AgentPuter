import { auth } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Client } from "ssh2";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await request.json();
  if (!code || typeof code !== "string" || code.length < 4) {
    return NextResponse.json({ error: "Invalid pairing code" }, { status: 400 });
  }

  // 获取用户信息
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.status !== "ready" || !user.vpsIp) {
    return NextResponse.json({ error: "VPS not ready" }, { status: 400 });
  }

  // 开发模式
  if (!user.vpsPassword || user.vpsPassword === "DevPassword123!") {
    console.log("[DEV] Simulating Telegram pairing for code:", code);
    await db
      .update(users)
      .set({ telegramPaired: "true" })
      .where(eq(users.clerkId, userId));
    return NextResponse.json({
      success: true,
      message: `[DEV] Telegram paired with code: ${code}`,
    });
  }

  // 判断是否为 Docker 共享模式
  const isSharedMode = user.hetznerServerId?.startsWith("shared-");

  try {
    let result: string;

    if (isSharedMode) {
      // ===== Docker 共享模式 =====
      const shortId = user.hetznerServerId!.replace("shared-", "");
      const containerName = `tc-${shortId}`;
      const sharedHost = process.env.SHARED_VPS_HOST!;
      const sharedPassword = process.env.SHARED_VPS_PASSWORD!;

      console.log("[DOCKER] Pairing Telegram for container:", containerName, "code:", code);

      result = await executeSSHCommand(
        sharedHost,
        sharedPassword,
        `docker exec ${containerName} openclaw pairing approve telegram ${code} 2>&1`
      );
    } else {
      // ===== 独立 VPS 模式 =====
      const vpsHost = user.vpsIp.includes(":") ? user.vpsIp.split(":")[0] : user.vpsIp;

      result = await executeSSHCommand(
        vpsHost,
        user.vpsPassword,
        `openclaw pairing approve telegram ${code}`
      );
    }

    console.log("[Telegram pair] Result:", result);

    if (result.includes("Approved") || result.includes("approved") || result.includes("success")) {
      await db
        .update(users)
        .set({ telegramPaired: "true" })
        .where(eq(users.clerkId, userId));
      return NextResponse.json({ success: true, message: result });
    } else if (result.includes("No pending pairing") || result.includes("not found")) {
      return NextResponse.json({
        success: false,
        error: "Pairing code expired or invalid. Please get a new code from Telegram.",
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result || "Unknown error",
      });
    }
  } catch (error) {
    console.error("[Telegram pair] Execution failed:", error);
    return NextResponse.json(
      { error: "Failed to connect. Please try again." },
      { status: 500 }
    );
  }
}

function executeSSHCommand(
  host: string,
  password: string,
  command: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let output = "";
    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) { conn.end(); reject(err); return; }
          stream
            .on("close", () => { conn.end(); resolve(output.trim()); })
            .on("data", (data: Buffer) => { output += data.toString(); })
            .stderr.on("data", (data: Buffer) => { output += data.toString(); });
        });
      })
      .on("error", reject)
      .connect({ host, port: 22, username: "root", password, readyTimeout: 10000 });
  });
}
