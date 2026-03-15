"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { useLocale } from "@/hooks/useLocale";
import type { Translations } from "@/lib/i18n";

/* ─── Discord Token Modal ─── */
function DiscordModal({
  open,
  onClose,
  onConnected,
}: {
  open: boolean;
  onClose: () => void;
  onConnected: (token: string) => void;
}) {
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSave = async () => {
    const trimmed = token.trim();
    if (trimmed.length < 50) {
      setError("Invalid token — Discord Bot Tokens are at least 50 characters.");
      return;
    }
    setSaving(true);
    setError("");
    localStorage.setItem("tc_discord_token", trimmed);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    onConnected(trimmed);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <img
              src="https://scbwi-storage-prod.s3.amazonaws.com/images/discord-mark-blue_rA6tXJo.png"
              alt="Discord"
              style={{ width: 28, height: 28 }}
            />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Connect Discord</h2>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "rgba(255,255,255,0.7)" }}>
            How to get your Bot Token
          </h3>

          <ol className="tg-steps">
            <li>
              Go to{" "}
              <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer">
                discord.com/developers
              </a>
              , click <strong>New Application</strong>.
            </li>
            <li>Go to <strong>Bot</strong> tab → click <strong>Add Bot</strong>.</li>
            <li>Under <strong>Token</strong>, click <strong>Reset Token</strong> and copy it.</li>
            <li>Enable <strong>Message Content Intent</strong> under Privileged Gateway Intents.</li>
            <li>Paste the token below.</li>
          </ol>

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "rgba(255,255,255,0.6)" }}>
            Bot Token
          </label>
          <input
            className="tg-input"
            type="text"
            placeholder="Paste your Discord bot token from discord.com/developers"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          {error && <p style={{ color: "#ff6b6b", fontSize: 12, margin: "6px 0 0" }}>{error}</p>}

          <button className="tg-save-btn" onClick={handleSave} disabled={saving || !token.trim()}>
            {saving ? "Connecting..." : "Save & Connect"}
          </button>
        </div>

        {/* 右侧示意 */}
        <div className="modal-phone">
          <div className="phone-frame" style={{ background: "#313338" }}>
            <div className="phone-header" style={{ background: "#2b2d31", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px" }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: "#5865f2" }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>discord.com/developers</span>
              </div>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>Bot tab → Token</div>
              {[
                { label: "APPLICATION ID", val: "1234567890" },
                { label: "TOKEN", val: "MTI3ND••••••" },
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontSize: 12, background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "6px 10px", fontFamily: "monospace", color: "#fff" }}>
                    {row.val}
                  </div>
                </div>
              ))}
              <div style={{ background: "#5865f2", borderRadius: 6, padding: "7px 12px", fontSize: 12, fontWeight: 600, textAlign: "center", cursor: "pointer" }}>
                Reset Token
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Telegram 配对 Modal ─── */
function TelegramModal({
  open,
  onClose,
  onConnected,
  t,
}: {
  open: boolean;
  onClose: () => void;
  onConnected: (token: string) => void;
  t: Translations;
}) {
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSave = async () => {
    const trimmed = token.trim();
    // 基本格式校验: 数字:字母数字
    if (!/^\d+:[A-Za-z0-9_-]{30,}$/.test(trimmed)) {
      setError(t.setup.invalid_token);
      return;
    }
    setSaving(true);
    setError("");
    // 存到 localStorage（后续 /creating 发给后端）
    localStorage.setItem("tc_telegram_token", trimmed);
    await new Promise((r) => setTimeout(r, 600)); // 小动画
    setSaving(false);
    onConnected(trimmed);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* 左侧指引 */}
        <div className="modal-content">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/960px-Telegram_logo.svg.png"
              alt="Telegram"
              style={{ width: 28, height: 28 }}
            />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{t.setup.connect_telegram}</h2>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "rgba(255,255,255,0.7)" }}>
            {t.setup.how_to_get_token}
          </h3>

          <ol className="tg-steps">
            <li>
              {t.setup.step1_open}{" "}
              <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer">
                @BotFather
              </a>
              .
            </li>
            <li>
              {t.setup.step2_type} <code>/newbot</code>.
            </li>
            <li>{t.setup.step3_follow}</li>
            <li>{t.setup.step4_copy}</li>
            <li>{t.setup.step5_paste}</li>
          </ol>

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "rgba(255,255,255,0.6)" }}>
            {t.setup.enter_token}
          </label>
          <input
            className="tg-input"
            type="text"
            placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          {error && <p style={{ color: "#ff6b6b", fontSize: 12, margin: "6px 0 0" }}>{error}</p>}

          <button className="tg-save-btn" onClick={handleSave} disabled={saving || !token.trim()}>
            {saving ? t.setup.connecting : t.setup.save_connect}
          </button>
        </div>

        {/* 右侧手机示意图 */}
        <div className="modal-phone">
          <div className="phone-frame">
            <div className="phone-header">
              <div className="phone-search">
                <span style={{ opacity: 0.4, fontSize: 12 }}>🔍</span>
                <span style={{ fontSize: 13 }}>BotFath</span>
                <span style={{ opacity: 0.3, fontSize: 12 }}>×</span>
              </div>
            </div>
            <div className="phone-label">{t.setup.global_search}</div>
            {[
              { name: "BotFather", badge: "✓", sub: "", highlight: true },
              { name: "Download IT", sub: "@download_it_bot", highlight: false },
              { name: "AirTrack: Flights...", sub: "", highlight: false },
              { name: "SMS Bot", sub: "", highlight: false },
              { name: "Alerts Bot", sub: "@Smart_Alarm_SM", highlight: false },
            ].map((item, i) => (
              <div
                key={i}
                className={`phone-row ${item.highlight ? "phone-row-hl" : ""}`}
              >
                <div
                  className="phone-avatar"
                  style={{ background: item.highlight ? "#54a9eb" : `hsl(${i * 60}, 50%, 40%)` }}
                >
                  {item.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: item.highlight ? 600 : 400 }}>
                    {item.name}{" "}
                    {item.badge && <span style={{ color: "#54a9eb", fontSize: 11 }}>{item.badge}</span>}
                  </div>
                  {item.sub && (
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{item.sub}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Setup 主页面 ─── */
export default function SetupPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { t, locale, loading: localeLoading } = useLocale();

  const [selectedModel, setSelectedModel] = useState("claude");
  const [selectedChannel, setSelectedChannel] = useState("telegram");
  const [selectedPlan] = useState<"pro">("pro");
  const [showTgModal, setShowTgModal] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [slotsLeft, setSlotsLeft] = useState(11);
  const [checking, setChecking] = useState(true); // 门控检查中，先显示 loading

  // 已有活跃订阅或已部署 → 直接跳 dashboard，不显示 setup
  useEffect(() => {
    async function checkExistingUser() {
      try {
        const res = await fetch("/api/vps/status");
        const data = await res.json();
        if (data.status === "ready" || data.status === "creating") {
          router.replace("/dashboard");
          return;
        }
        if (data.subscriptionStatus === "active" || data.subscriptionStatus === "trialing") {
          router.replace("/creating");
          return;
        }
      } catch { /* 忽略，继续显示 setup */ }
      setChecking(false); // 确认是新用户，才显示 setup
    }
    checkExistingUser();
  }, [router]);

  // 从 localStorage 恢复选择
  useEffect(() => {
    const m = localStorage.getItem("tc_model");
    const c = localStorage.getItem("tc_channel");
    const t = localStorage.getItem("tc_telegram_token");
    const d = localStorage.getItem("tc_discord_token");
    if (m) setSelectedModel(m);
    if (c) setSelectedChannel(c);
    if (t) setTelegramConnected(true);
    if (d) setDiscordConnected(true);
    setSlotsLeft([7, 9, 11, 13][Math.floor(Math.random() * 4)]);

    // GA4: 用户进入 setup 页 = 注册/登录成功
    trackPageView("/setup", "Setup");
    trackEvent("sign_up", { method: "clerk" });

    // Google Ads: Free Trial Start 转化（注册成功 = 试用开始）
    const trialDedupeKey = "trial_start_tracked";
    if (!localStorage.getItem(trialDedupeKey)) {
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-845688835/QHJeCPDXoP0bEIPgoJMD",
        });
      }
      localStorage.setItem(trialDedupeKey, Date.now().toString());
    }
  }, []);

  const models = [
    { id: "claude", name: "Claude 4.6", icon: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg" },
    { id: "gpt", name: "GPT-5.2", icon: "https://img.icons8.com/androidL/512/FFFFFF/chatgpt.png" },
    { id: "gemini", name: "Gemini 3", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Google_Gemini_icon_2025.svg/960px-Google_Gemini_icon_2025.svg.png" },
  ];

  const channels = [
    { id: "telegram", name: "Telegram", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/960px-Telegram_logo.svg.png", disabled: false },
    { id: "discord", name: "Discord", icon: "https://scbwi-storage-prod.s3.amazonaws.com/images/discord-mark-blue_rA6tXJo.png", disabled: false },
    { id: "whatsapp", name: "WhatsApp", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/960px-WhatsApp.svg.png", disabled: false },
  ];

  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState("");

  // 直接调用 Stripe checkout，跳过 /subscribe 中间页
  const goToStripeCheckout = async () => {
    setDeploying(true);
    setDeployError("");

    // GA4: 开始结算
    trackEvent("begin_checkout", {
      value: 29.99,
      currency: "USD",
      model: selectedModel,
      channel: selectedChannel,
    });

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel, channel: selectedChannel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeployError(data.error || t.setup.checkout_failed);
        setDeploying(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setDeployError(t.setup.network_error);
      setDeploying(false);
    }
  };

  const handleDeploy = () => {
    localStorage.setItem("tc_model", selectedModel);
    localStorage.setItem("tc_channel", selectedChannel);
    trackEvent("click_deploy", { model: selectedModel, channel: selectedChannel });
    // 直接进 Stripe，不再阻塞于 Telegram 配置
    goToStripeCheckout();
  };

  const handleTelegramConnected = (token: string) => {
    setTelegramConnected(true);
    setShowTgModal(false);
    trackEvent("connect_telegram", { model: selectedModel });
  };

  const handleDiscordConnected = (token: string) => {
    setDiscordConnected(true);
    setShowDiscordModal(false);
    trackEvent("connect_discord", { model: selectedModel });
  };

  if (!isLoaded || localeLoading || checking) {
    return (
      <div className="page-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{t.setup.loading}</div>
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper">
        {/* 顶栏 */}
        <div className="topbar">
          <span className="topbar-brand">TinyClaw.dev</span>
          <a
            href="https://mail.google.com/mail/?view=cm&to=oscarzamora199907@gmail.com&su=TinyClaw+Support+Request&body=Hi+TinyClaw+Team,"
            className="topbar-link"
            target="_blank"
            rel="noopener noreferrer"
          >{t.nav.contact}</a>
        </div>

        {/* Hero */}
        <section className="hero">
          <h1>{t.hero.title_line1}<br />{t.hero.title_line2}</h1>
          <p className="hero-sub">
            {t.hero.subtitle}
          </p>
        </section>

        {/* 设置卡片 */}
        <div className="setup-card">
          {/* 模型选择 */}
          <h3 className="setup-label">{t.setup.model_heading}</h3>
          <div className="setup-pills">
            {models.map((m) => (
              <button
                key={m.id}
                className={`setup-pill ${selectedModel === m.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedModel(m.id);
                  trackEvent("select_model", { model: m.id, model_name: m.name });
                }}
              >
                <img src={m.icon} alt={m.name} className="setup-pill-icon" />
                {m.name}
                {selectedModel === m.id && <span className="pill-check">✓</span>}
              </button>
            ))}
          </div>

          {/* 渠道选择 — 可选，部署后亦可配置 */}
          <h3 className="setup-label" style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}>
            {t.setup.channel_heading}
            <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)", padding: "2px 7px", borderRadius: 20 }}>
              {t.setup.channel_optional}
            </span>
          </h3>
          <div className="setup-pills">
            {channels.map((c) => (
              <button
                key={c.id}
                className={`setup-pill ${selectedChannel === c.id ? "active" : ""} ${c.disabled ? "pill-disabled" : ""}`}
                onClick={() => !c.disabled && setSelectedChannel(c.id)}
              >
                <img src={c.icon} alt={c.name} className="setup-pill-icon" />
                {c.name}
                {c.disabled && <span className="pill-soon">{t.setup.coming_soon}</span>}
                {selectedChannel === c.id && !c.disabled && (
                  (c.id === "telegram" ? telegramConnected : c.id === "discord" ? discordConnected : false) ? (
                    <span className="pill-connected">{t.setup.connected}</span>
                  ) : (
                    <span className="pill-check">✓</span>
                  )
                )}
              </button>
            ))}
          </div>
          {/* Telegram 可选提前配置入口 */}
          {selectedChannel === "telegram" && !telegramConnected && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "8px 0 0", textAlign: "center" }}>
              {t.setup.connect_telegram_now}{" "}
              <button
                onClick={() => setShowTgModal(true)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", textDecoration: "underline", cursor: "pointer", fontSize: 12, padding: 0 }}
              >
                {t.setup.setup_telegram_token}
              </button>
              {" "}{t.setup.skip_after_payment}
            </p>
          )}

          {/* Discord 可选提前配置入口 */}
          {selectedChannel === "discord" && !discordConnected && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "8px 0 0", textAlign: "center" }}>
              {t.setup.connect_discord_now}{" "}
              <button
                onClick={() => setShowDiscordModal(true)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", textDecoration: "underline", cursor: "pointer", fontSize: 12, padding: 0 }}
              >
                {t.setup.setup_discord_token}
              </button>
              {" "}{t.setup.skip_after_payment}
            </p>
          )}

          {selectedChannel === "whatsapp" && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "8px 0 0", textAlign: "center" }}>
              {t.setup.whatsapp_no_token}{" "}
              <span style={{ color: "rgba(255,255,255,0.55)" }}>
                {t.setup.whatsapp_qr_hint}
              </span>
            </p>
          )}

          {/* 用户信息 */}
          <div className="setup-user">
            <div className="setup-user-avatar">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: "50%" }} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || "U"}
                </div>
              )}
            </div>
            <div className="setup-user-info">
              <div className="setup-user-name">
                {user?.fullName || user?.firstName || "User"}
                <button
                  className="signout-btn"
                  onClick={() => signOut({ redirectUrl: "/" })}
                  title="Sign out"
                >
                  ↗
                </button>
              </div>
              <div className="setup-user-email">
                {user?.emailAddresses?.[0]?.emailAddress || ""}
              </div>
            </div>
          </div>

          {/* Deploy 按钮 */}
          <button
            className="deploy-btn"
            onClick={handleDeploy}
            disabled={deploying}
            style={{ opacity: deploying ? 0.6 : 1, cursor: deploying ? "not-allowed" : "pointer" }}
          >
            <span style={{ fontSize: 16 }}>⚡</span>
            {deploying ? t.setup.redirecting_checkout : t.setup.deploy_btn}
          </button>

          {deployError && (
            <p style={{ color: "#f87171", fontSize: 12, textAlign: "center", margin: "8px 0 0", fontFamily: "monospace" }}>
              {deployError}
            </p>
          )}

          {/* 价格信息 */}
          <p className="setup-pricing">
            <strong>{t.setup.trial_pricing_line}</strong>{" "}
            <span className="slots-text">
              {t.setup.slots.replace("{count}", String(slotsLeft))}
            </span>
          </p>
        </div>
      </div>

      {/* Telegram 配对 Modal */}
      <TelegramModal
        open={showTgModal}
        onClose={() => setShowTgModal(false)}
        onConnected={handleTelegramConnected}
        t={t}
      />

      {/* Discord Token Modal */}
      <DiscordModal
        open={showDiscordModal}
        onClose={() => setShowDiscordModal(false)}
        onConnected={handleDiscordConnected}
      />
    </>
  );
}
