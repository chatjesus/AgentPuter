"use client";

import { useState } from "react";
import type { Translations } from "@/lib/i18n";

interface TelegramSetupProps {
  currentStatus: string | null; // null | "false" | "token_set" | "true"
  t: Translations;
}

export default function TelegramSetup({ currentStatus, t }: TelegramSetupProps) {
  const isPaired = currentStatus === "true";
  const isTokenSet = currentStatus === "token_set";

  // 已配对完成
  if (isPaired) {
    return (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
        <p style={{ color: "#22c55e", fontWeight: 600, fontSize: 15 }}>
          {t.dashboard.telegram_connected_msg}
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 6 }}>
          {t.dashboard.telegram_ready}
        </p>
      </div>
    );
  }

  // Token 已设置 → 显示配对码输入
  if (isTokenSet) {
    return <PairingCodeStep t={t} />;
  }

  // 未配置 → 先输入 Bot Token
  return <BotTokenStep t={t} />;
}

// ===== 步骤 1: 输入 Bot Token =====
function BotTokenStep({ t }: { t: Translations }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/telegram/setup-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        // 刷新页面，进入配对步骤
        window.location.reload();
      } else {
        setError(data.error || t.dashboard.telegram_failed);
      }
    } catch {
      setError(t.setup.network_error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* BotFather 步骤引导 */}
      <div
        style={{
          background: "rgba(59,130,246,0.07)",
          border: "1px solid rgba(59,130,246,0.18)",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 16,
        }}
      >
        <p style={{ color: "rgba(147,197,253,0.95)", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          {t.dashboard.telegram_how_to_title}
        </p>
        <ol style={{ color: "rgba(147,197,253,0.8)", fontSize: 13, lineHeight: 1.9, paddingLeft: 18, margin: 0 }}>
          <li>
            {t.dashboard.telegram_guide_step1}{" "}
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#60a5fa", textDecoration: "underline" }}
            >
              →
            </a>
          </li>
          <li>
            {t.dashboard.telegram_guide_step2}{" "}
            <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4 }}>/newbot</code>
          </li>
          <li>{t.dashboard.telegram_guide_step3}</li>
          <li>{t.dashboard.telegram_guide_step4}</li>
          <li>{t.dashboard.telegram_guide_step5}</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyz"
          disabled={loading}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "12px 14px",
            fontFamily: "monospace",
            fontSize: 13,
            color: "#fff",
            outline: "none",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8, textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !token.trim()}
          style={{
            width: "100%",
            padding: "12px 0",
            background: loading || !token.trim() ? "rgba(255,255,255,0.06)" : "#3b82f6",
            color: loading || !token.trim() ? "rgba(255,255,255,0.3)" : "#fff",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
            border: "none",
            cursor: loading || !token.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <Spinner />
              {t.dashboard.telegram_configuring}
            </>
          ) : (
            t.dashboard.telegram_configure
          )}
        </button>
      </form>
    </div>
  );
}

// ===== 步骤 2: 输入配对码 =====
function PairingCodeStep({ t }: { t: Translations }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/telegram/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError(data.error || t.dashboard.telegram_pair_failed);
      }
    } catch {
      setError(t.setup.network_error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
        <p style={{ color: "#22c55e", fontWeight: 600 }}>{t.dashboard.telegram_paired}</p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 6 }}>
          {t.dashboard.telegram_refreshing}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 16,
        }}
      >
        <p style={{ color: "rgba(134,239,172,0.95)", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          {t.dashboard.telegram_token_saved}
        </p>
        <ol style={{ color: "rgba(134,239,172,0.8)", fontSize: 13, lineHeight: 1.9, paddingLeft: 18, margin: 0 }}>
          <li>{t.dashboard.telegram_pair_guide_step1}</li>
          <li>{t.dashboard.telegram_pair_guide_step2}</li>
          <li>{t.dashboard.telegram_pair_guide_step3}</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t.dashboard.telegram_pair_placeholder}
          maxLength={10}
          disabled={loading}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "12px 14px",
            fontFamily: "monospace",
            fontSize: 18,
            color: "#fff",
            textAlign: "center",
            letterSpacing: "0.2em",
            outline: "none",
            marginBottom: 12,
            boxSizing: "border-box",
            textTransform: "uppercase",
          }}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8, textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !code.trim()}
          style={{
            width: "100%",
            padding: "12px 0",
            background: loading || !code.trim() ? "rgba(255,255,255,0.06)" : "#3b82f6",
            color: loading || !code.trim() ? "rgba(255,255,255,0.3)" : "#fff",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
            border: "none",
            cursor: loading || !code.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <Spinner />
              {t.dashboard.telegram_pairing}
            </>
          ) : (
            t.dashboard.telegram_connect
          )}
        </button>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        style={{ opacity: 0.25 }}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        style={{ opacity: 0.75 }}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </svg>
  );
}
