import { auth } from "@clerk/nextjs/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appId, appSecret, verifyToken, encryptKey } = await request.json();

  if (!appId || !appSecret || !verifyToken) {
    return NextResponse.json(
      { error: "App ID, App Secret, and Verification Token are required." },
      { status: 400 }
    );
  }

  // 验证用户 VPS 已就绪
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.status !== "ready") {
    return NextResponse.json({ error: "VPS not ready" }, { status: 400 });
  }

  // 向飞书获取 app_access_token 来验证 App ID + App Secret 是否有效
  try {
    const tokenRes = await fetch(
      "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
      }
    );
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) {
      return NextResponse.json(
        {
          error: `Invalid credentials: ${tokenData.msg || "Feishu API error"}`,
        },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to verify credentials with Feishu API." },
      { status: 500 }
    );
  }

  // 保存凭证到 DB
  await db
    .update(users)
    .set({
      feishuAppId: appId,
      feishuAppSecret: appSecret,
      feishuVerifyToken: verifyToken,
      feishuEncryptKey: encryptKey || null,
      feishuConnected: "configured",
    })
    .where(eq(users.clerkId, userId));

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .update(users)
    .set({
      feishuAppId: null,
      feishuAppSecret: null,
      feishuVerifyToken: null,
      feishuEncryptKey: null,
      feishuConnected: "false",
    })
    .where(eq(users.clerkId, userId));

  return NextResponse.json({ success: true });
}
