"use client";

import { useState, useEffect } from "react";
import type { Translations } from "@/lib/i18n";

interface FeishuSetupProps {
  currentStatus: string | null; // null | "false" | "configured" | "true"
  t: Translations;
}

const FEISHU_BLUE = "#3370FF";

export default function FeishuSetup({ currentStatus, t }: FeishuSetupProps) {
  const isConnected = currentStatus === "configured" || currentStatus === "true";

  if (isConnected) {
    return <FeishuConnectedState t={t} />;
  }

  return <FeishuSetupForm t={t} />;
}

// ===== 已配置状态 =====
function FeishuConnectedState({ t }: { t: Translations }) {
  const [disconnecting, setDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setDisconnecting(true);
    await fetch("/api/feishu/setup", { method: "DELETE" });
    window.location.reload();
  };

  return (
    <div>
      <div style={{ textAlign: "center", padding: "12px 0 16px" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
        <p style={{ color: "#22c55e", fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
          {t.dashboard.feishu_configured_title}
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          {t.dashboard.feishu_configured_desc}
        </p>
      </div>
      <button
        onClick={handleDisconnect}
        disabled={disconnecting}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.35)",
          borderRadius: 8,
          padding: "6px 14px",
          fontSize: 12,
          cursor: disconnecting ? "not-allowed" : "pointer",
          display: "block",
          margin: "0 auto",
        }}
      >
        {disconnecting ? "..." : "Disconnect"}
      </button>
    </div>
  );
}

// ===== 配置表单 =====
function FeishuSetupForm({ t }: { t: Translations }) {
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [encryptKey, setEncryptKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webhookBase, setWebhookBase] = useState("https://tinyclaw.dev/api/feishu/webhook");

  useEffect(() => {
    setWebhookBase(`${window.location.origin}/api/feishu/webhook`);
  }, []);

  // Webhook URL（加 appId 参数方便加密事件路由）
  const webhookUrl = appId ? `${webhookBase}?appId=${appId}` : webhookBase;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim() || !appSecret.trim() || !verifyToken.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/feishu/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: appId.trim(),
          appSecret: appSecret.trim(),
          verifyToken: verifyToken.trim(),
          encryptKey: encryptKey.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        setError(data.error || t.dashboard.feishu_save_failed);
      }
    } catch {
      setError(t.dashboard.feishu_save_failed);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 13,
    fontFamily: "monospace",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginBottom: 5,
    fontWeight: 500,
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
        {t.dashboard.feishu_desc}
      </p>

      {/* 配置指引折叠面板 */}
      <button
        type="button"
        onClick={() => setShowGuide(!showGuide)}
        style={{
          background: "none",
          border: "none",
          color: FEISHU_BLUE,
          fontSize: 13,
          cursor: "pointer",
          padding: 0,
          marginBottom: showGuide ? 10 : 16,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "inherit",
        }}
      >
        {showGuide ? "▾" : "▸"} {t.dashboard.feishu_how_to}
      </button>

      {showGuide && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 16,
          }}
        >
          {[
            t.dashboard.feishu_step_create_app,
            t.dashboard.feishu_step_add_bot,
            t.dashboard.feishu_step_enable_events,
            t.dashboard.feishu_step_set_webhook,
            t.dashboard.feishu_step_get_tokens,
          ].map((step) => (
            <p
              key={step}
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                margin: "4px 0",
                lineHeight: 1.6,
              }}
            >
              {step}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* App ID */}
        <div>
          <label style={labelStyle}>{t.dashboard.feishu_app_id_label}</label>
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder={t.dashboard.feishu_app_id_placeholder}
            style={inputStyle}
            autoComplete="off"
          />
        </div>

        {/* App Secret */}
        <div>
          <label style={labelStyle}>{t.dashboard.feishu_app_secret_label}</label>
          <input
            type="password"
            value={appSecret}
            onChange={(e) => setAppSecret(e.target.value)}
            placeholder={t.dashboard.feishu_app_secret_placeholder}
            style={inputStyle}
          />
        </div>

        {/* Verification Token */}
        <div>
          <label style={labelStyle}>{t.dashboard.feishu_verify_token_label}</label>
          <input
            type="text"
            value={verifyToken}
            onChange={(e) => setVerifyToken(e.target.value)}
            placeholder={t.dashboard.feishu_verify_token_placeholder}
            style={inputStyle}
            autoComplete="off"
          />
        </div>

        {/* Encrypt Key（可选）*/}
        <div>
          <label style={labelStyle}>{t.dashboard.feishu_encrypt_key_label}</label>
          <input
            type="password"
            value={encryptKey}
            onChange={(e) => setEncryptKey(e.target.value)}
            placeholder={t.dashboard.feishu_encrypt_key_placeholder}
            style={inputStyle}
          />
        </div>

        {/* Webhook URL 展示 */}
        <div>
          <label style={labelStyle}>{t.dashboard.feishu_webhook_url_label}</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              readOnly
              value={webhookUrl}
              style={{
                ...inputStyle,
                color: "rgba(255,255,255,0.55)",
                cursor: "text",
                flex: 1,
              }}
            />
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: copied ? "#22c55e" : "rgba(255,255,255,0.6)",
                fontSize: 12,
                padding: "0 14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !appId || !appSecret || !verifyToken}
          style={{
            background: loading || !appId || !appSecret || !verifyToken
              ? "rgba(51,112,255,0.4)"
              : FEISHU_BLUE,
            border: "none",
            borderRadius: 10,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            padding: "11px 0",
            cursor: loading || !appId || !appSecret || !verifyToken ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {loading ? t.dashboard.feishu_saving : t.dashboard.feishu_save_btn}
        </button>
      </form>
    </div>
  );
}
