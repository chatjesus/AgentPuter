import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

// ---- 完全公开的页面：绝不经过 Clerk，国内直接访问 ----
const isFullyPublic = createRouteMatcher([
  "/",
  "/privacy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  "/preview",
  "/try",
  "/api/demo(.*)",
  // Desktop 客户端 API（使用自定义 JWT，不走 Clerk）
  "/api/desktop/auth",
  "/api/desktop/me",
  "/api/desktop/credits(.*)",
  "/api/proxy(.*)",
  // 公开 AI 工具页
  "/tools(.*)",
  "/api/ai(.*)",
  // 多语言落地页
  "/zh",
  "/zh-tw",
  "/es",
  "/ja",
  "/ko",
  "/de",
  "/fr",
  "/pt",
  "/ru",
  "/ar",
]);

// ---- Clerk 体系内但不需要 protect 的路由 ----
const isClerkPublic = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/subscribe",
  "/setup",
  // Admin 页面和 API 用自己的 token 鉴权
  "/admin(.*)",
  "/api/admin(.*)",
  // Desktop OAuth callback 需要 Clerk session（但不 protect）
  "/api/desktop/auth/callback",
  "/api/desktop/auth/start",
]);

// 封装 clerkMiddleware — 只在需要时才调用
const clerkMw = clerkMiddleware(async (auth, req) => {
  // sign-in / sign-up / webhooks / subscribe 不需要 protect
  if (isClerkPublic(req)) return;
  // 其余路由（/creating, /dashboard, /api/stripe/*, /api/vps/*）需要登录
  await auth.protect();
});

const LOCALE_CODES = ["zh-tw", "zh", "es", "ja", "ko", "de", "fr", "pt", "ru", "ar"];

function detectLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  return LOCALE_CODES.includes(seg) ? seg : "en";
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const locale = detectLocale(req.nextUrl.pathname);

  if (isFullyPublic(req)) {
    const res = NextResponse.next();
    res.headers.set("x-locale", locale);
    return res;
  }

  // Clerk 路由也传递 locale header
  const clerkRes = clerkMw(req, event);
  if (clerkRes instanceof NextResponse) {
    clerkRes.headers.set("x-locale", locale);
    return clerkRes;
  }
  return clerkRes;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};
