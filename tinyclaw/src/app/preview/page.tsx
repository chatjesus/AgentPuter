"use client";

/**
 * 本地开发预览页 — 无需 Clerk 登录
 * 同时展示 Dashboard + Creating 页面的 UI
 * 生产环境不可用（layout.tsx 中做门控）
 */

import { useState } from "react";

const MODELS = [
  { key: "claude", name: "Claude 4.6", icon: "🟣" },
  { key: "gpt", name: "GPT-5.2", icon: "🟢" },
  { key: "gemini", name: "Gemini 3", icon: "🔵" },
];

// ============ ModelSwitcher 预览 ============
function ModelSwitcherPreview({ currentModel }: { currentModel: string }) {
  const [selected, setSelected] = useState(currentModel);
  const [switching, setSwitching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [success, setSuccess] = useState("");

  const currentModelInfo = MODELS.find((m) => m.key === selected) || MODELS[0];

  const handleSwitch = async (newModel: string) => {
    if (newModel === selected || switching) return;
    setShowDropdown(false);
    setSwitching(true);

    // 模拟切换延迟
    await new Promise((r) => setTimeout(r, 2000));

    setSelected(newModel);
    setSwitching(false);
    setSuccess(`Switched to ${MODELS.find((m) => m.key === newModel)?.name}`);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          {currentModelInfo.icon} {currentModelInfo.name}
        </span>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={switching}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.12)",
            color: switching ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 6,
            cursor: switching ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {switching ? "Switching..." : "Switch"}
        </button>
      </div>

      {showDropdown && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setShowDropdown(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 6,
              zIndex: 50,
              minWidth: 220,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {MODELS.map((m) => (
              <button
                key={m.key}
                onClick={() => handleSwitch(m.key)}
                disabled={m.key === selected}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 12px",
                  background: m.key === selected ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: m.key === selected ? "rgba(255,255,255,0.3)" : "#fff",
                  fontSize: 13,
                  fontWeight: m.key === selected ? 600 : 400,
                  cursor: m.key === selected ? "default" : "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 16 }}>{m.icon}</span>
                <span>{m.name}</span>
                {m.key === selected && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                    current
                  </span>
                )}
              </button>
            ))}
            <div
              style={{
                padding: "8px 12px 4px",
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                marginTop: 4,
              }}
            >
              Switching takes ~30s. Your agent will restart.
            </div>
          </div>
        </>
      )}

      {switching && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          <div
            style={{
              width: 12,
              height: 12,
              border: "2px solid rgba(255,255,255,0.1)",
              borderTopColor: "#a78bfa",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Restarting your agent with the new model...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {success && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#4ade80", padding: "6px 10px", background: "rgba(74,222,128,0.08)", borderRadius: 8 }}>
          ✓ {success}
        </div>
      )}
    </div>
  );
}

// ============ Dashboard 预览 ============
function DashboardPreview() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>🦞 TinyClaw</span>
        <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          Sign Out
        </button>
      </header>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
          Your AI Agent is Ready!
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
          Running Claude 4.6 · 24/7 online
        </p>
        <div style={{ display: "inline-block" }}>
          <ModelSwitcherPreview currentModel="claude" />
        </div>
      </div>

      {/* WebChat */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>OpenClaw WebChat</span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>Chat with your AI directly in the browser</p>
        <div style={{ display: "block", width: "100%", padding: "12px 0", background: "#fff", color: "#000", fontSize: 15, fontWeight: 600, borderRadius: 10, textAlign: "center" }}>
          Open WebChat →
        </div>
      </div>

      {/* Telegram */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Telegram Bot</span>
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "rgba(34,197,94,0.15)", color: "#22c55e", fontWeight: 600 }}>Connected</span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Telegram Connected! Your AI is ready to chat on Telegram.</p>
      </div>

      {/* Subscription */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>💳 Pro Subscription</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Status: active · Renews 3/15/2026</div>
        </div>
        <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: 12, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
          Manage Subscription
        </button>
      </div>

      <footer style={{ textAlign: "center", marginTop: 32, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
        Powered by AgentPuter
      </footer>
    </div>
  );
}

// ============ Creating 预览 ============
function CreatingPreview() {
  const [progress, setProgress] = useState(60);
  const [status, setStatus] = useState<"creating" | "error">("creating");

  const model = "claude";
  const channel = "telegram";

  const supportEmail = "oscarzamora199907@gmail.com";
  const modelNames: Record<string, string> = { claude: "Claude 4.6", gpt: "GPT-5.2", gemini: "Gemini 3" };
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";

  const emailSubject = encodeURIComponent(
    `TinyClaw Deploy Issue — ${status === "error" ? "FAILED" : "Stuck"} [${modelNames[model] || model}]`
  );
  const emailBody = encodeURIComponent(
    `Hi TinyClaw Support,\n\n` +
    `My deployment is ${status === "error" ? "failing" : "taking too long"}. Details below.\n\n` +
    `━━━ Diagnostic Info (auto-generated) ━━━\n` +
    `Status: ${status}\n` +
    `Model: ${modelNames[model] || model} (${model})\n` +
    `Channel: ${channel}\n` +
    `Progress: ${progress}%\n` +
    `Attempts: 1\n` +
    `Time: ${new Date().toISOString()}\n` +
    `URL: ${typeof window !== "undefined" ? window.location.href : ""}\n` +
    `Browser: ${userAgent}\n` +
    `API Error: [500] Docker instance setup failed — Gateway failed to start\n` +
    `\n━━━ Error Log ━━━\n` +
    `CREATE [500] Docker instance setup failed\n` +
    `STATUS error after 125s\n` +
    `\n━━━ What happened? ━━━\n` +
    `[Please describe what you experienced]\n\n` +
    `━━━ Screenshot ━━━\n` +
    `📎 Please attach a screenshot (Cmd+Shift+4 on Mac / Win+Shift+S on Windows)\n`
  );
  const handleContactSupport = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(supportEmail)}&su=${emailSubject}&body=${emailBody}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <div style={{ textAlign: "center", maxWidth: 480 }}>
      {status === "error" ? (
        <>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#f87171" }}>Something went wrong</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Setup failed. Please try again or contact support.</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => { setStatus("creating"); setProgress(10); }}
              style={{ padding: "12px 32px", background: "#fff", color: "#000", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              Retry
            </button>
            <button
              onClick={handleContactSupport}
              style={{ display: "inline-block", fontSize: 13, color: "rgba(255,255,255,0.35)", background: "none", padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "inherit" }}
            >
              ✉️ Contact Support
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🦞</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Setting Up Your AI Agent...</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            Model: <strong style={{ color: "#fff" }}>Claude 4.6</strong>
          </p>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, #7c3aed, #a78bfa)", borderRadius: 3, transition: "width 0.5s ease", width: `${progress}%` }} />
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Setting up your dedicated AI cloud...</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>This takes about 2 minutes</p>

          <button
            onClick={handleContactSupport}
            style={{
              display: "inline-block",
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              background: "none",
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              marginTop: 20,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Taking too long? Contact Support
          </button>
        </>
      )}

      {/* 切换状态按钮（仅预览用） */}
      <div style={{ marginTop: 40, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 8 }}>⚙️ Preview controls</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            onClick={() => { setStatus("creating"); setProgress(60); }}
            style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: status === "creating" ? "rgba(255,255,255,0.1)" : "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}
          >
            Loading 状态
          </button>
          <button
            onClick={() => setStatus("error")}
            style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: status === "error" ? "rgba(255,255,255,0.1)" : "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}
          >
            Error 状态
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ 主页 ============
export default function PreviewPage() {
  const [tab, setTab] = useState<"dashboard" | "creating">("dashboard");

  return (
    <main style={{ minHeight: "100vh", background: "#000", fontFamily: "'Inter', -apple-system, sans-serif", color: "#fff" }}>
      {/* Tab 切换 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", padding: "6px 12px" }}>PREVIEW:</div>
        <button
          onClick={() => setTab("dashboard")}
          style={{
            fontSize: 12,
            padding: "6px 16px",
            borderRadius: 6,
            border: "none",
            background: tab === "dashboard" ? "rgba(255,255,255,0.1)" : "none",
            color: tab === "dashboard" ? "#fff" : "rgba(255,255,255,0.4)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: tab === "dashboard" ? 600 : 400,
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setTab("creating")}
          style={{
            fontSize: 12,
            padding: "6px 16px",
            borderRadius: 6,
            border: "none",
            background: tab === "creating" ? "rgba(255,255,255,0.1)" : "none",
            color: tab === "creating" ? "#fff" : "rgba(255,255,255,0.4)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: tab === "creating" ? 600 : 400,
          }}
        >
          Creating
        </button>
      </div>

      <div style={{ padding: 24, display: "flex", justifyContent: "center", alignItems: tab === "creating" ? "center" : "flex-start", minHeight: "calc(100vh - 50px)" }}>
        {tab === "dashboard" ? <DashboardPreview /> : <CreatingPreview />}
      </div>
    </main>
  );
}
