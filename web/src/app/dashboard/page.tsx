import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { SignOutButton } from "@clerk/nextjs";
import TelegramSetup from "./TelegramSetup";
import CopyButton from "./CopyButton";
import ManageSubscription from "./ManageSubscription";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  // 没有访问权限的用户先去订阅
  const hasAccess =
    user?.inviteCode ||
    user?.subscriptionStatus === "active" ||
    user?.subscriptionStatus === "trialing";

  if (!user || (user.status === "pending" && !hasAccess)) {
    redirect("/subscribe");
  }

  // 订阅已取消 → 重新订阅
  if (user.subscriptionStatus === "canceled" && !user.inviteCode) {
    redirect("/subscribe");
  }

  // 正在创建中或其他非 ready 状态
  if (user.status !== "ready") {
    redirect("/creating");
  }

  const gatewayToken = user.gatewayToken || "";
  const openclawUrl = gatewayToken
    ? `http://${user.vpsIp}:18789/chat?token=${gatewayToken}&session=main`
    : `http://${user.vpsIp}:18789`;
  const isPaired = user.telegramPaired === "true";

  return (
    <main className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-teal-400 font-mono">
            AgentPuter
          </h1>
          <SignOutButton redirectUrl="https://agentputer.com">
            <button className="text-gray-500 hover:text-white text-sm transition">
              Sign Out
            </button>
          </SignOutButton>
        </header>

        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white">
            Your AI Agent is Ready!
          </h2>
          <p className="text-gray-400 mt-2">
            Your personal OpenClaw instance is running 24/7
          </p>
        </div>

        {/* TODO: Getting Started Video - add back when demo.mp4 is ready */}

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* OpenClaw Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <h3 className="font-semibold text-white">OpenClaw WebChat</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Chat with your AI directly in the browser
            </p>
            <a
              href={openclawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 px-6 rounded-lg text-center transition"
            >
              Open WebChat →
            </a>
            <p className="text-gray-600 text-xs mt-3 font-mono break-all">
              http://{user.vpsIp}:18789
            </p>
          </div>

          {/* Telegram Setup Card */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  isPaired
                    ? "bg-green-500"
                    : user.telegramPaired === "token_set"
                    ? "bg-blue-500 animate-pulse"
                    : "bg-yellow-500 animate-pulse"
                }`}
              />
              <h3 className="font-semibold text-white">Telegram Connection</h3>
            </div>
            <TelegramSetup currentStatus={user.telegramPaired} />
          </div>
        </div>

        {/* VPS Info Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🖥️</span> VPS Access (Advanced)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-xs block mb-1">
                IP Address
              </label>
              <div className="bg-gray-800 rounded-lg p-3 font-mono text-teal-400 flex justify-between items-center">
                <span>{user.vpsIp}</span>
                <CopyButton text={user.vpsIp || ""} />
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-xs block mb-1">
                SSH Command
              </label>
              <div className="bg-gray-800 rounded-lg p-3 font-mono text-teal-400 flex justify-between items-center">
                <span className="truncate">ssh root@{user.vpsIp}</span>
                <CopyButton text={`ssh root@${user.vpsIp}`} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-500 text-xs block mb-1">
                Root Password
              </label>
              <div className="bg-gray-800 rounded-lg p-3 font-mono text-yellow-400 flex justify-between items-center">
                <span className="blur-sm hover:blur-none transition-all">
                  {user.vpsPassword || "••••••••••••"}
                </span>
                <CopyButton text={user.vpsPassword || ""} />
              </div>
              <p className="text-gray-600 text-xs mt-1">
                Hover to reveal. Keep this secure!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h3 className="font-semibold text-white mb-4">📚 Quick Tips</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-teal-400">•</span>
              <span>
                <strong className="text-white">WebChat</strong> - Start chatting
                instantly in your browser
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">•</span>
              <span>
                <strong className="text-white">Telegram</strong> - Send a message
                to your bot to get a pairing code
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">•</span>
              <span>
                <strong className="text-white">SSH Access</strong> - Full control
                for advanced configuration
              </span>
            </li>
          </ul>
        </div>

        {/* Subscription Management */}
        {user.stripeSubscriptionId && (
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-xl">💳</span> Subscription
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  AgentPuter Pro — $29.99/mo
                  {user.subscriptionCurrentPeriodEnd && (
                    <span className="text-gray-600 ml-2">
                      · Renews {new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
              <ManageSubscription />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-600 text-sm">
          Your AI Never Sleeps 🦞
        </footer>
      </div>
    </main>
  );
}

