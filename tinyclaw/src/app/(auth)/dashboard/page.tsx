import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { SignOutButton } from "@clerk/nextjs";
import ManageSubscription from "./ManageSubscription";
// import ModelSwitcher from "./ModelSwitcher";
import VPSField from "./VPSField";
import TelegramSetup from "./TelegramSetup";
import DiscordSetup from "./DiscordSetup";
import WhatsAppSetup from "./WhatsAppSetup";
import FeishuSetup from "./FeishuSetup";
import BookmarkPrompt from "./BookmarkPrompt";
import { getServerLocale, loadTranslations } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 加载用户语言偏好的翻译
  const locale = await getServerLocale();
  const t = (await loadTranslations(locale)) as Translations;

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user || user.status !== "ready") {
    redirect("/creating");
  }

  const validSubStatus = ["active", "trialing"];
  if (!validSubStatus.includes(user.subscriptionStatus || "")) {
    redirect("/subscribe");
  }

  const gatewayToken = user.gatewayToken || "";
  const isMockVps = user.vpsIp === "168.119.123.456";
  // 支持 "IP:PORT" 格式（共享 VPS 模式）和纯 IP 格式（独立 VPS）
  const vpsAddr = user.vpsIp || "";
  const hasCustomPort = vpsAddr.includes(":");
  const isSharedVps = user.hetznerServerId?.startsWith("shared-") || hasCustomPort;
  const vpsHost = hasCustomPort ? vpsAddr.split(":")[0] : vpsAddr;
  const vpsPort = hasCustomPort ? vpsAddr.split(":")[1] : "18789";
  const openclawUrl = gatewayToken
    ? `http://${vpsHost}:${vpsPort}/chat?token=${gatewayToken}&session=main`
    : `http://${vpsHost}:${vpsPort}`;

  const modelNames: Record<string, string> = {
    claude: "Claude 4.6",
    gpt: "GPT-5.2",
    gemini: "Gemini 3",
  };
  const modelName = modelNames[user.selectedModel || "claude"] || user.selectedModel;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        padding: "24px",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            🦞 TinyClaw
          </span>
          <SignOutButton redirectUrl="https://tinyclaw.dev">
            <button
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t.dashboard.sign_out}
            </button>
          </SignOutButton>
        </header>

        {/* 成功横幅 */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            {t.dashboard.agent_ready}
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            {t.dashboard.running_model
              .replace("{model}", modelName || "")
            }
          </p>
          {/* 模型切换 — 暂时隐藏，待功能稳定后重新启用 */}
          {/* <div style={{ display: "inline-block" }}>
            <ModelSwitcher currentModel={user.selectedModel || "claude"} t={t} />
          </div> */}
        </div>

        {/* WebChat 卡片 */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {t.dashboard.webchat_title}
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              marginBottom: 16,
            }}
          >
            {t.dashboard.webchat_desc}
          </p>
          {isMockVps ? (
            <>
              <div
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 0",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 10,
                  textAlign: "center",
                  border: "1px dashed rgba(255,255,255,0.1)",
                }}
              >
                🚧 {t.dashboard.vps_demo}
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {t.dashboard.webchat_pending}
              </p>
            </>
          ) : (
            <>
              <a
                href="/webchat"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 0",
                  background: "#fff",
                  color: "#000",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 10,
                  textAlign: "center",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                {t.dashboard.open_webchat}
              </a>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                💡 Bookmark <strong style={{ color: "rgba(255,255,255,0.5)" }}>app.tinyclaw.dev/webchat</strong> for quick access
              </p>
            </>
          )}
        </div>

        {/* Telegram 配对 */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: user.telegramPaired === "true" ? "#22c55e" : "#60a5fa",
                boxShadow: user.telegramPaired === "true" ? "0 0 8px #22c55e" : "0 0 8px #60a5fa",
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {t.dashboard.telegram_title}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 6,
                background:
                  user.telegramPaired === "true"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(59,130,246,0.15)",
                color:
                  user.telegramPaired === "true"
                    ? "#22c55e"
                    : "#60a5fa",
                fontWeight: 600,
              }}
            >
              {user.telegramPaired === "true" ? t.dashboard.telegram_connected : t.dashboard.telegram_pair_now}
            </span>
          </div>
          <TelegramSetup currentStatus={user.telegramPaired} t={t} />
        </div>

        {/* Discord 配置卡片 */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: (user.discordConnected === "true" || user.discordConnected === "token_set") ? "#22c55e" : "#5865f2",
                boxShadow: (user.discordConnected === "true" || user.discordConnected === "token_set") ? "0 0 8px #22c55e" : "0 0 8px #5865f2",
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Discord</span>
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 6,
                background: (user.discordConnected === "true" || user.discordConnected === "token_set")
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(88,101,242,0.15)",
                color: (user.discordConnected === "true" || user.discordConnected === "token_set")
                  ? "#22c55e"
                  : "#818cf8",
                fontWeight: 600,
              }}
            >
              {(user.discordConnected === "true" || user.discordConnected === "token_set") ? t.dashboard.telegram_connected : t.dashboard.discord_setup_now}
            </span>
          </div>
          <DiscordSetup currentStatus={user.discordConnected} t={t} />
        </div>

        {/* WhatsApp 配置卡片 — 所有有 VPS 的已订阅用户均可见，方便随时接入 WhatsApp */}
        {!!user.vpsIp && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: user.whatsappConnected === "linked" ? "#22c55e" : "#25D366",
                  boxShadow: user.whatsappConnected === "linked" ? "0 0 8px #22c55e" : "0 0 8px #25D366",
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 600 }}>WhatsApp</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: user.whatsappConnected === "linked"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(37,211,102,0.12)",
                  color: user.whatsappConnected === "linked" ? "#22c55e" : "#25D366",
                  fontWeight: 600,
                }}
              >
                {user.whatsappConnected === "linked" ? t.dashboard.whatsapp_linked : t.dashboard.whatsapp_scan_to_connect}
              </span>
            </div>
            <WhatsAppSetup currentStatus={user.whatsappConnected} openclawUrl={openclawUrl} t={t} />
          </div>
        )}

        {/* 飞书配置卡片 */}
        {!!user.vpsIp && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    user.feishuConnected === "configured" || user.feishuConnected === "true"
                      ? "#22c55e"
                      : "#3370FF",
                  boxShadow:
                    user.feishuConnected === "configured" || user.feishuConnected === "true"
                      ? "0 0 8px #22c55e"
                      : "0 0 8px #3370FF",
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {t.dashboard.feishu_title}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background:
                    user.feishuConnected === "configured" || user.feishuConnected === "true"
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(51,112,255,0.15)",
                  color:
                    user.feishuConnected === "configured" || user.feishuConnected === "true"
                      ? "#22c55e"
                      : "#3370FF",
                  fontWeight: 600,
                }}
              >
                {user.feishuConnected === "configured" || user.feishuConnected === "true"
                  ? t.dashboard.feishu_connected
                  : t.dashboard.feishu_connect_now}
              </span>
            </div>
            <FeishuSetup currentStatus={user.feishuConnected} t={t} />
          </div>
        )}

        {/* VPS 信息 — 仅独立 VPS 模式显示，共享模式隐藏技术细节 */}
        {!isSharedVps && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              🖥️ {t.dashboard.vps_title}
            </h3>
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              <VPSField label={t.dashboard.vps_ip} value={vpsHost} />
              <VPSField label={t.dashboard.vps_port} value={vpsPort} />
              <VPSField label={t.dashboard.vps_ssh} value={`ssh root@${vpsHost}`} />
              <VPSField label={t.dashboard.vps_password} value={user.vpsPassword || "••••••••"} blur />
            </div>
          </div>
        )}

        {/* 订阅管理 */}
        {user.stripeSubscriptionId && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                💳 {t.dashboard.subscription_title}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                {t.dashboard.subscription_status.replace("{status}", user.subscriptionStatus || "active")}
                {user.subscriptionCurrentPeriodEnd && (
                  <> · {t.dashboard.subscription_renews.replace("{date}", new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString())}</>
                )}
              </div>
            </div>
            <ManageSubscription t={t} />
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            marginTop: 32,
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          {t.dashboard.powered_by}{" "}
          <a
            href="https://agentputer.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
          >
            AgentPuter
          </a>
        </footer>
      </div>

      {/* 收藏引导弹窗 — 延迟 2.5 秒弹出，仅显示一次 */}
      <BookmarkPrompt />
    </main>
  );
}
