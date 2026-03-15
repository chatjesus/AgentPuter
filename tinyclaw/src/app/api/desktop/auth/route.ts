import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.DESKTOP_JWT_SECRET!);

// GET /api/desktop/auth?provider=google|github&device_id=xxx&callback=tinyclaw://callback
// 将浏览器重定向到 Clerk/OAuth，并在完成后拿到 userId，颁发 device token
export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider") ?? "google";
  const deviceId = req.nextUrl.searchParams.get("device_id") ?? "";
  const callbackUri = req.nextUrl.searchParams.get("callback") ?? "tinyclaw://callback";

  // 构建 Clerk OAuth URL（通过 Clerk 的 OAuth 端点）
  // 完成后跳转到 /api/desktop/auth/callback
  const statePayload = Buffer.from(JSON.stringify({ deviceId, callbackUri })).toString("base64url");
  const clerkUrl = new URL(`${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? process.env.CLERK_FRONTEND_API : "https://tinyclaw.dev"}/v1/oauth/${provider}`);
  clerkUrl.searchParams.set("redirect_url", `${process.env.NEXT_PUBLIC_APP_URL}/api/desktop/auth/callback?state=${statePayload}`);

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/desktop/auth/start?provider=${provider}&state=${statePayload}`
  );
}
