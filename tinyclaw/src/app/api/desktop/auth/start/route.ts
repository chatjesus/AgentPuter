import { NextRequest, NextResponse } from "next/server";

// GET /api/desktop/auth/start?provider=google|github&state=xxx
// 渲染一个简单的页面引导用户进行 Clerk 登录，完成后颁发 desktop token
export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider") ?? "google";
  const state = req.nextUrl.searchParams.get("state") ?? "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TinyClaw Desktop — Sign In</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'IBM Plex Mono', 'Courier New', monospace;
      background: #0a0a0a;
      color: #fafafa;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 48px 40px;
      max-width: 400px;
    }
    .comment { color: #10b981; font-size: 12px; }
    .logo { font-size: 26px; font-weight: 700; }
    p { color: #6b7280; font-size: 13px; text-align: center; }
    .btn {
      width: 100%;
      height: 48px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
    }
    .btn-primary { background: #10b981; color: #0a0a0a; }
    .btn-outline { background: transparent; border: 1px solid #2a2a2a; color: #fafafa; }
  </style>
</head>
<body>
  <div class="card">
    <span class="comment">// desktop_auth</span>
    <div class="logo">&gt; tinyclaw.dev</div>
    <p>Sign in to activate your 200 free credits/day and connect your local agent.</p>
    <a href="/sign-in?redirect_url=${encodeURIComponent(`/api/desktop/auth/callback?state=${state}`)}" style="width:100%;text-decoration:none;">
      <button class="btn btn-primary">Sign in with ${provider === "google" ? "Google" : "GitHub"}</button>
    </a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" }
  });
}
