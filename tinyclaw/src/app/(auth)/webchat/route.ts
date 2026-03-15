import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "https://app.tinyclaw.dev"));
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.status !== "ready" || !user.vpsIp) {
    return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL || "https://app.tinyclaw.dev"));
  }

  const validSubStatus = ["active", "trialing"];
  if (!validSubStatus.includes(user.subscriptionStatus || "")) {
    return NextResponse.redirect(new URL("/subscribe", process.env.NEXT_PUBLIC_APP_URL || "https://app.tinyclaw.dev"));
  }

  const vpsAddr = user.vpsIp;
  const hasCustomPort = vpsAddr.includes(":");
  const vpsHost = hasCustomPort ? vpsAddr.split(":")[0] : vpsAddr;
  const vpsPort = hasCustomPort ? vpsAddr.split(":")[1] : "18789";
  const token = user.gatewayToken;

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL || "https://app.tinyclaw.dev"));
  }

  const gatewayUrl = `http://${vpsHost}:${vpsPort}/chat?token=${token}&session=main`;
  return NextResponse.redirect(gatewayUrl);
}
