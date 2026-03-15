import { auth } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Client } from "ssh2";

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

  // 开发模式：返回 mock ASCII QR
  if (!user.vpsPassword || user.vpsPassword === "DevPassword123!") {
    return NextResponse.json({
      ascii: generateMockAsciiQr(),
      note: "[DEV] Mock QR — real QR requires VPS",
    });
  }

  const isSharedMode = user.hetznerServerId?.startsWith("shared-");
  const vpsAddr = user.vpsIp;
  const hasCustomPort = vpsAddr.includes(":");
  const vpsHost = hasCustomPort ? vpsAddr.split(":")[0] : vpsAddr;

  const sshHost: string = isSharedMode ? process.env.SHARED_VPS_HOST! : vpsHost;
  const sshPassword: string = isSharedMode ? process.env.SHARED_VPS_PASSWORD! : user.vpsPassword;

  try {
    let output = "";

    if (isSharedMode) {
      const shortId = user.hetznerServerId!.replace("shared-", "");

      // 步骤1：杀掉旧 login 进程 + 清空旧日志，让新 QR 立即生成
      await executeSSHCommandWithTimeout(
        sshHost, sshPassword,
        `docker exec tc-${shortId} sh -c 'pkill -f "openclaw channels login" 2>/dev/null; rm -f /tmp/wa-login.log; echo ready' || true`,
        8000
      );

      // 步骤2：后台启动 login（-d 使进程脱离 exec session，保持运行等待扫码）
      await executeSSHCommandWithTimeout(
        sshHost, sshPassword,
        `docker exec -d tc-${shortId} sh -c 'openclaw channels login --channel whatsapp > /tmp/wa-login.log 2>&1'`,
        8000
      );

      // 步骤3：轮询日志，等 QR 出现（最多 20s = 4次 × 5s）
      for (let attempt = 0; attempt < 4; attempt++) {
        await new Promise(r => setTimeout(r, 5000));
        const logContent = await executeSSHCommandWithTimeout(
          sshHost, sshPassword,
          `docker exec tc-${shortId} sh -c 'cat /tmp/wa-login.log 2>/dev/null'`,
          5000
        );
        output = logContent;
        if (extractAsciiQr(logContent) !== null) break;
      }
    } else {
      // 专用 VPS：同样后台运行，轮询日志文件
      await executeSSHCommandWithTimeout(
        sshHost, sshPassword,
        `pkill -f "openclaw channels login" 2>/dev/null; rm -f /tmp/wa-login.log; echo ready`,
        8000
      );
      await executeSSHCommandWithTimeout(
        sshHost, sshPassword,
        `nohup sh -c 'openclaw channels login --channel whatsapp > /tmp/wa-login.log 2>&1' &`,
        5000
      );
      for (let attempt = 0; attempt < 4; attempt++) {
        await new Promise(r => setTimeout(r, 5000));
        const logContent = await executeSSHCommandWithTimeout(
          sshHost, sshPassword,
          `cat /tmp/wa-login.log 2>/dev/null`,
          5000
        );
        output = logContent;
        if (extractAsciiQr(logContent) !== null) break;
      }
    }

    if (!output || output.trim().length === 0) {
      return NextResponse.json({ error: "No output from WhatsApp login command." }, { status: 500 });
    }

    const asciiQr = extractAsciiQr(output);

    if (!asciiQr) {
      return NextResponse.json({
        error: "Could not extract QR code from output.",
        rawOutput: output.slice(0, 500),
      }, { status: 500 });
    }

    return NextResponse.json({ ascii: asciiQr });
  } catch (error: any) {
    console.error("[WhatsApp QR] Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to get QR code." }, { status: 500 });
  }
}

// 从命令输出中提取 ASCII QR 块
function extractAsciiQr(output: string): string | null {
  const lines = output.split("\n");

  // QR 行特征：包含大量 unicode 方块字符或连续的 █ 字符
  const qrLinePattern = /[█▀▄▌▐ ]{10,}/;
  // 或者简单的 #/空格 模式（某些渲染器用 # 表示黑模块）
  const simpleQrPattern = /^[#▄▀█ ]{10,}$/;

  const qrLines: string[] = [];
  let inQrBlock = false;

  for (const line of lines) {
    const isQrLine = qrLinePattern.test(line) || simpleQrPattern.test(line);

    if (isQrLine) {
      inQrBlock = true;
      qrLines.push(line);
    } else if (inQrBlock && line.trim() === "") {
      // 空行可能是 QR 内部的空白行，继续
      qrLines.push(line);
    } else if (inQrBlock) {
      // 非 QR 行出现，结束 QR 块提取
      break;
    }
  }

  if (qrLines.length < 10) return null;

  // 移除末尾多余的空行
  while (qrLines.length > 0 && qrLines[qrLines.length - 1].trim() === "") {
    qrLines.pop();
  }

  return qrLines.join("\n");
}

// 带超时的 SSH 命令执行
function executeSSHCommandWithTimeout(
  host: string,
  password: string,
  command: string,
  timeoutMs: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let output = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        conn.end();
        resolve(output); // 超时时返回已捕获的输出
      }
    }, timeoutMs);

    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            clearTimeout(timer);
            conn.end();
            if (!settled) { settled = true; reject(err); }
            return;
          }
          stream
            .on("close", () => {
              clearTimeout(timer);
              conn.end();
              if (!settled) { settled = true; resolve(output.trim()); }
            })
            .on("data", (d: Buffer) => { output += d.toString(); })
            .stderr.on("data", (d: Buffer) => { output += d.toString(); });
        });
      })
      .on("error", (err) => {
        clearTimeout(timer);
        if (!settled) { settled = true; reject(err); }
      })
      .connect({ host, port: 22, username: "root", password, readyTimeout: 10000 });
  });
}

// Dev 模式用的 mock QR
function generateMockAsciiQr(): string {
  return [
    "██████████████  ██  ██████████████",
    "██          ██  ████  ██          ██",
    "██  ██████  ██  ██  ██  ██████  ██",
    "██  ██████  ██    ████  ██████  ██",
    "██  ██████  ██  ██████  ██████  ██",
    "██          ██  ██      ██          ██",
    "██████████████  ██  ██  ██████████████",
    "                ████                ",
    "██  ████████  ██    ██████  ██  ██",
    "  ██  ██  ████  ████  ██████  ████",
    "████████████████  ████  ██  ██████",
    "██  ████  ████████  ████████  ████",
    "██  ██  ██████  ████████████  ████",
    "                ████  ████  ██  ██",
    "██████████████  ██  ████  ████  ██",
    "██          ██  ██████  ██  ██████",
    "██  ██████  ██  ██  ████████  ████",
    "██  ██████  ██  ████  ██  ████  ██",
    "██  ██████  ██  ████████  ██  ████",
    "██          ██  ██  ██████████  ██",
    "██████████████  ██████  ██  ██████",
  ].join("\n");
}
