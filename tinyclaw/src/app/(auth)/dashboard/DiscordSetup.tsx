"use client";

import { useState } from "react";
import type { Translations } from "@/lib/i18n";

interface DiscordSetupProps {
  currentStatus: string | null;
  t: Translations;
}

export default function DiscordSetup({ currentStatus, t }: DiscordSetupProps) {
  const isConnected = currentStatus === "true" || currentStatus === "token_set";

  if (isConnected) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <p style={{ color: "#22c55e", fontWeight: 600, fontSize: 14, margin: 0 }}>
            {t.dashboard.discord_token_configured}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Step 1 */}
          <div style={{ background: "rgba(88,101,242,0.08)", border: "1px solid rgba(88,101,242,0.2)", borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ color: "rgba(180,187,255,0.95)", fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>
              {t.dashboard.discord_step1_title}
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: "0 0 8px 0", lineHeight: 1.5 }}>
              Go to{" "}
              <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" style={{ color: "#818cf8" }}>
                Discord Developer Portal
              </a>{" "}
              → Your App → OAuth2 → URL Generator → check{" "}
              <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 4px", borderRadius: 3 }}>bot</code>{" "}
              scope → copy the link and open it in a browser to invite the bot.
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>
              {t.dashboard.discord_step1_note}
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ background: "rgba(88,101,242,0.08)", border: "1px solid rgba(88,101,242,0.2)", borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ color: "rgba(180,187,255,0.95)", fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>
              {t.dashboard.discord_step2_title}
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: "0 0 8px 0", lineHeight: 1.5 }}>
              {t.dashboard.discord_step2_desc}
            </p>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 7, padding: "8px 12px", fontFamily: "monospace", fontSize: 12, color: "#a5b4fc" }}>
              openclaw pairing approve discord &lt;code&gt;
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: "8px 0 0 0" }}>
              {t.dashboard.discord_step2_cmd_note}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <DiscordTokenStep t={t} />;
}

function DiscordTokenStep({ t }: { t: Translations }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/discord/setup-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(data.error || t.dashboard.discord_failed);
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
        <p style={{ color: "#22c55e", fontWeight: 600 }}>{t.dashboard.discord_configured}</p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 6 }}>{t.dashboard.discord_reloading}</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          background: "rgba(88,101,242,0.08)",
          border: "1px solid rgba(88,101,242,0.25)",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 16,
        }}
      >
        <p style={{ color: "rgba(180,187,255,0.95)", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          {t.dashboard.discord_how_to}
        </p>
        <ol style={{ color: "rgba(180,187,255,0.8)", fontSize: 13, lineHeight: 1.9, paddingLeft: 18, margin: 0 }}>
          <li>
            Go to{" "}
            <a
              href="https://discord.com/developers/applications"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#818cf8", textDecoration: "underline" }}
            >
              discord.com/developers
            </a>{" "}
            → <strong>{t.dashboard.discord_step_new_app}</strong>
          </li>
          <li>Click <strong>{t.dashboard.discord_step_add_bot}</strong> tab → <strong>{t.dashboard.discord_step_add_bot2}</strong></li>
          <li>Click <strong>{t.dashboard.discord_step_reset_token}</strong> and copy the token</li>
          <li>Enable <strong>{t.dashboard.discord_step_intent}</strong> under Privileged Gateway Intents</li>
          <li>
            Go to <strong>{t.dashboard.discord_step_url_gen}</strong>, select{" "}
            <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4 }}>bot</code>{" "}
            scope, then invite the bot to your server
          </li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your Discord bot token from discord.com/developers"
          disabled={loading}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "12px 14px",
            fontFamily: "monospace",
            fontSize: 12,
            color: "#fff",
            outline: "none",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8, textAlign: "center" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !token.trim()}
          style={{
            width: "100%",
            padding: "12px 0",
            background: loading || !token.trim() ? "rgba(255,255,255,0.06)" : "#5865f2",
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
              {t.dashboard.discord_configuring}
            </>
          ) : (
            t.dashboard.discord_connect_btn
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
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        style={{ opacity: 0.75 }}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </svg>
  );
}
