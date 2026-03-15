"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const SESSION_KEY = "tc_demo_session";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

interface DemoChatProps {
  inline?: boolean;
  onDeploy?: () => void;
}

type DemoStatus = "idle" | "starting" | "ready" | "error";

const DEPLOY_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "https://tinyclaw.dev/sign-up"
    : "/sign-up";

// ── 内联 widget：展示 "Launch Demo" 入口 ──────────────────────
export default function DemoChat({ inline = false, onDeploy }: DemoChatProps) {
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [demoUrl, setDemoUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDeploy = useCallback(() => {
    if (onDeploy) onDeploy();
    else window.open(DEPLOY_URL, "_blank");
  }, [onDeploy]);

  const clearPoll = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  // 清理 on unmount
  useEffect(() => () => clearPoll(), []);

  const launchDemo = useCallback(async () => {
    setStatus("starting");
    setError(null);
    const sessionId = getOrCreateSessionId();

    try {
      const res = await fetch("/api/demo/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json() as {
        url: string; token: string; status?: string; isNew?: boolean; error?: string;
      };

      if (data.error) throw new Error(data.error);

      setDemoUrl(data.url);
      setToken(data.token);

      if (data.status === "ready") {
        setStatus("ready");
        openDemo(data.url, data.token);
      } else {
        // 轮询等待容器就绪
        pollRef.current = setInterval(async () => {
          try {
            const sr = await fetch(`/api/demo/session?sessionId=${sessionId}`);
            const sd = await sr.json() as { status: string; url: string; token: string; error?: string };
            if (sd.status === "ready") {
              clearPoll();
              setStatus("ready");
              openDemo(sd.url, sd.token);
            } else if (sd.status === "error") {
              clearPoll();
              setStatus("error");
              setError(sd.error ?? "Container failed to start");
            }
          } catch { /* 继续轮询 */ }
        }, 2500);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to start demo");
    }
  }, []);

  function openDemo(url: string, tok: string) {
    // 在新标签页打开 OpenClaw WebChat，带上 token 自动认证
    const fullUrl = `${url}/?token=${tok}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
    // 回到 idle 让用户可以再次打开
    setTimeout(() => setStatus("idle"), 2000);
  }

  // ── 内联 Widget ───────────────────────────────────────────
  if (inline) {
    return (
      <div className="demo-widget">
        <div className="demo-widget-header">
          <div className="demo-widget-status">
            <span className="demo-dot" style={{
              background: status === "ready" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"
            }} />
            <span>OpenClaw Demo</span>
          </div>
          <span className="demo-msg-counter">Live · Isolated · Gemini 3</span>
        </div>

        <div className="demo-widget-body" style={{ minHeight: 220, justifyContent: "center", alignItems: "center" }}>
          {status === "idle" && (
            <div style={{ textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🦞</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 16px", lineHeight: 1.5 }}>
                Experience a <strong style={{ color: "#fff" }}>real OpenClaw instance</strong> running just for you — isolated in its own cloud container.
              </p>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 20, lineHeight: 1.5 }}>
                Powered by Gemini 3 · WebChat · No sign-up required
              </div>
              <button className="demo-deploy-btn" onClick={launchDemo}
                style={{ fontSize: 14, padding: "12px 24px" }}>
                ✦ Launch My Free Demo →
              </button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>
                Opens in a new tab · Instance lasts 2 hours
              </p>
            </div>
          )}

          {status === "starting" && (
            <div style={{ textAlign: "center", padding: "24px 16px" }}>
              <div className="demo-typing" style={{ margin: "0 auto 16px", width: 40 }}>
                <span /><span /><span />
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 8px" }}>
                Starting your isolated OpenClaw instance...
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                Setting up container · Configuring Gemini 3 · ~20s
              </p>
            </div>
          )}

          {status === "ready" && (
            <div style={{ textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>
                Your OpenClaw instance is ready! Opening in new tab...
              </p>
              {demoUrl && token && (
                <button className="demo-deploy-btn" onClick={() => openDemo(demoUrl, token)}
                  style={{ fontSize: 14, padding: "10px 20px" }}>
                  Open Demo Again →
                </button>
              )}
            </div>
          )}

          {status === "error" && (
            <div style={{ textAlign: "center", padding: "24px 16px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
              <p style={{ fontSize: 12, color: "rgba(255,100,100,0.8)", margin: "0 0 16px" }}>
                {error ?? "Could not start demo"}
              </p>
              <button className="demo-deploy-btn" onClick={launchDemo}
                style={{ fontSize: 13, padding: "10px 20px" }}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Deploy CTA */}
        <div className="demo-widget-done">
          <button className="demo-deploy-btn" onClick={handleDeploy}>
            🚀 Deploy Your Own Private OpenClaw — 7 Days Free →
          </button>
        </div>

        <div className="demo-widget-footer">
          Powered by OpenClaw ·{" "}
          <a href="/try" className="demo-link">Full-screen demo →</a>
        </div>
      </div>
    );
  }

  // ── 全屏模式（/try 页面）──────────────────────────────────
  return (
    <div className="demo-fullscreen" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="demo-topbar">
        <a href="/" className="demo-topbar-brand">TinyClaw.dev</a>
        <div className="demo-topbar-center">
          <span className="demo-dot" />
          <span style={{ fontSize: 13 }}>OpenClaw Demo · Gemini 3 · Isolated</span>
        </div>
        <button className="demo-topbar-deploy" onClick={handleDeploy}>Deploy Yours →</button>
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "0 24px",
      }}>
        {status === "idle" && (
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🦞</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.03em" }}>
              Experience OpenClaw Live
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 32, fontSize: 15 }}>
              We&apos;ll spin up a <strong style={{ color: "#fff" }}>real, isolated OpenClaw instance</strong> just for you —
              running on its own cloud container with Gemini 3 AI.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              {["✦ Real OpenClaw WebChat", "◉ Isolated container", "✧ Gemini 3 Flash"].map((f) => (
                <span key={f} style={{
                  fontSize: 12, padding: "6px 14px", borderRadius: 100,
                  border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)",
                }}>
                  {f}
                </span>
              ))}
            </div>
            <button
              onClick={launchDemo}
              style={{
                width: "100%", maxWidth: 400, padding: "16px 0", borderRadius: 14,
                background: "#fff", color: "#000", fontSize: 16, fontWeight: 700,
                border: "none", cursor: "pointer",
              }}
            >
              ✦ Launch My Free OpenClaw Demo
            </button>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 12 }}>
              No sign-up · Opens in new tab · Instance lasts 2 hours
            </p>
          </div>
        )}

        {status === "starting" && (
          <div style={{ textAlign: "center" }}>
            <div className="demo-typing" style={{ margin: "0 auto 24px", transform: "scale(1.5)", width: 48 }}>
              <span /><span /><span />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>
              Starting your OpenClaw instance...
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
              Spinning up isolated container · Configuring Gemini 3 · About 20 seconds
            </p>
          </div>
        )}

        {(status === "ready" || status === "error") && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {status === "ready" ? "✅" : "⚠️"}
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>
              {status === "ready" ? "Your instance is ready! Opening in new tab..." : error}
            </p>
            {status === "ready" && demoUrl && token && (
              <button onClick={() => openDemo(demoUrl, token)}
                style={{
                  padding: "14px 28px", borderRadius: 12,
                  background: "#fff", color: "#000", fontWeight: 700, border: "none", cursor: "pointer",
                }}
              >Open Demo →</button>
            )}
            {status === "error" && (
              <button onClick={launchDemo}
                style={{
                  padding: "14px 28px", borderRadius: 12,
                  background: "#fff", color: "#000", fontWeight: 700, border: "none", cursor: "pointer",
                }}
              >Try Again</button>
            )}
          </div>
        )}
      </div>

      {/* 底部 Deploy CTA */}
      <div style={{
        padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.07)",
        textAlign: "center",
      }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 12 }}>
          Want privacy + your own model choice + custom skills?
        </p>
        <button onClick={handleDeploy}
          style={{
            padding: "12px 28px", borderRadius: 12,
            background: "#fff", color: "#000", fontWeight: 700,
            border: "none", cursor: "pointer", fontSize: 14,
          }}
        >
          🚀 Deploy Your Own Private OpenClaw — 7 Days Free →
        </button>
      </div>
    </div>
  );
}
