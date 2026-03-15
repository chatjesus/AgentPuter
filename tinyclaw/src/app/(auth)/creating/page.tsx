"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { useLocale } from "@/hooks/useLocale";

function CreatingContent() {
  const [status, setStatus] = useState("pending");
  const [progress, setProgress] = useState(10);
  const [gateChecked, setGateChecked] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);
  const [apiError, setApiError] = useState("");
  const [startTime] = useState(Date.now());
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  // 优先用 URL 参数，其次读 localStorage（登录回调后 URL 参数可能丢失）
  const model = searchParams.get("model") || (typeof window !== "undefined" ? localStorage.getItem("tc_model") : null) || "claude";
  const channel = searchParams.get("channel") || (typeof window !== "undefined" ? localStorage.getItem("tc_channel") : null) || "telegram";
  // 不再自动读取 localStorage 的旧 telegram token——统一走部署后可选步骤
  const telegramToken = null;
  // Discord token 在 setup 阶段可选填写，部署时一并注入
  const discordToken = typeof window !== "undefined" ? localStorage.getItem("tc_discord_token") : null;

  // 从 URL 获取 Stripe session_id（用于转化去重）
  const sessionId = searchParams.get("session_id");

  // 门控检查
  useEffect(() => {
    // GA4 + Google Ads 转化追踪（用 session_id 去重，防止刷新重复触发）
    trackPageView("/creating", "Creating");

    const dedupeKey = sessionId ? `purchase_tracked_${sessionId}` : null;
    const alreadyTracked = dedupeKey ? localStorage.getItem(dedupeKey) : false;

    if (!alreadyTracked) {
      // GA4 purchase 事件
      trackEvent("purchase", { value: 29.99, currency: "USD", model });

      // Google Ads 转化追踪（Campaign 主账户）
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-845688835/4qn1CNuV3PgbEIPgoJMD",
          value: 29.99,
          currency: "USD",
          transaction_id: sessionId || undefined,
        });
      }

      // 标记已追踪
      if (dedupeKey) {
        localStorage.setItem(dedupeKey, Date.now().toString());
      }
    }

    async function checkStatus() {
      try {
        const res = await fetch("/api/vps/status");
        const data = await res.json();
        if (data.status === "ready") {
          router.replace("/dashboard");
          return;
        }
        setGateChecked(true);
      } catch {
        setGateChecked(true);
      }
    }
    checkStatus();
  }, [router]);

  // 触发创建 + 轮询
  useEffect(() => {
    if (!gateChecked) return;

    fetch("/api/vps/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, channel, telegramToken: telegramToken || undefined, discordToken: discordToken || undefined, stripeSessionId: sessionId || undefined }),
    })
      .then(async (res) => {
        const data = await res.json();
        // 需要订阅 → 跳转到付费页
        if (res.status === 402 || data.redirect === "/subscribe") {
          router.replace("/subscribe");
          return;
        }
        if (data.status === "ready") {
          setProgress(100);
          setStatus("ready");
          trackEvent("deploy_complete", { model });
          setTimeout(() => router.push("/dashboard"), 500);
        }
        if (data.status === "error") {
          setStatus("error");
          const errMsg = `[${res.status}] ${data.error || ""} ${data.message || ""}`.trim();
          setApiError(errMsg);
          setErrorLogs((prev) => [...prev, `CREATE ${errMsg}`]);
        }
      })
      .catch((err) => {
        setErrorLogs((prev) => [...prev, `CREATE_FETCH ${err?.message || "Network error"}`]);
      });

    // 轮询只用于进度条更新，不触发 redirect
    // redirect 只从 create API 响应处触发（API 会等 gateway 健康检查通过才返回）
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/vps/status");
        const data = await res.json();
        if (data.status === "creating") {
          setStatus("creating");
          setProgress((prev) => Math.min(prev + 5, 85));
        } else if (data.status === "error") {
          setStatus("error");
          clearInterval(interval);
          setErrorLogs((prev) => [...prev, `STATUS error after ${Math.round((Date.now() - startTime) / 1000)}s`]);
        }
        // status=ready 时不 redirect——等 create API 响应来触发（避免过早跳转）
      } catch (err: any) {
        setErrorLogs((prev) => [...prev, `STATUS_FETCH ${err?.message || "Network error"}`]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router, gateChecked, attempt, model, channel]);

  const handleRetry = useCallback(() => {
    setStatus("pending");
    setProgress(10);
    setAttempt((prev) => prev + 1);
  }, []);

  const modelNames: Record<string, string> = {
    claude: "Claude 4.6",
    gpt: "GPT-5.2",
    gemini: "Gemini 3",
  };

  const supportEmail = "oscarzamora199907@gmail.com";
  const elapsedSec = Math.round((Date.now() - startTime) / 1000);
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
    `Attempts: ${attempt + 1}\n` +
    `Elapsed: ${elapsedSec}s\n` +
    `Time: ${new Date().toISOString()}\n` +
    `URL: ${typeof window !== "undefined" ? window.location.href : ""}\n` +
    `Browser: ${userAgent}\n` +
    (apiError ? `API Error: ${apiError}\n` : "") +
    (errorLogs.length > 0 ? `\n━━━ Error Log ━━━\n${errorLogs.join("\n")}\n` : "") +
    `\n━━━ What happened? ━━━\n` +
    `[Please describe what you experienced]\n\n` +
    `━━━ Screenshot ━━━\n` +
    `📎 Please attach a screenshot (Cmd+Shift+4 on Mac / Win+Shift+S on Windows)\n`
  );
  const handleContactSupport = useCallback(() => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(supportEmail)}&su=${emailSubject}&body=${emailBody}`;
    window.open(gmailUrl, "_blank");
  }, [supportEmail, emailSubject, emailBody]);

  if (!gateChecked) {
    return (
      <main style={styles.container}>
        <div style={styles.loading}>{t.creating.checking}</div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.content}>
        {status === "error" ? (
          <>
            <h1 style={{ ...styles.title, color: "#f87171" }}>{t.creating.error_title}</h1>
            <p style={styles.subtitle}>{t.creating.error_desc}</p>
            {apiError && (
              <pre style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", padding: "8px 12px", borderRadius: 6, marginBottom: 16, maxWidth: 400, overflow: "auto", textAlign: "left", wordBreak: "break-all" }}>{apiError}</pre>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <button onClick={handleRetry} style={styles.retryBtn}>
                {t.creating.retry}
              </button>
              <button
                onClick={handleContactSupport}
                style={styles.contactLink}
              >
                ✉️ {t.creating.contact_support_short || "Contact Support"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🦞</div>
            <h1 style={styles.title}>{t.creating.setting_up}</h1>
            <p style={{ ...styles.subtitle, marginBottom: 8 }}>
              {t.creating.model_label} <strong style={{ color: "#fff" }}>{modelNames[model] || model}</strong>
            </p>
            {/* 进度条 */}
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                }}
              />
            </div>
            <p style={styles.statusText}>
              {status === "pending" && t.creating.preparing}
              {status === "creating" && t.creating.creating_cloud}
              {status === "ready" && t.creating.almost_done}
            </p>
            <p style={styles.hint}>{t.creating.time_hint}</p>
            {/* Contact Support — 超过 30 秒显示 */}
            {progress > 30 && (
              <button
                onClick={handleContactSupport}
                style={{
                  ...styles.contactLink,
                  marginTop: 20,
                  opacity: Math.min(1, (progress - 30) / 20),
                  transition: "opacity 0.5s ease",
                }}
              >
                {t.creating.contact_support}
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function CreatingPage() {
  return (
    <Suspense
      fallback={
        <main style={styles.container}>
          <div style={styles.loading}>Loading…</div>
        </main>
      }
    >
      <CreatingContent />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#fff",
  },
  content: { textAlign: "center", maxWidth: 480 },
  loading: { color: "rgba(255,255,255,0.4)", fontFamily: "monospace" },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 24 },
  progressBar: {
    width: "100%",
    height: 6,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
    borderRadius: 3,
    transition: "width 0.5s ease",
  },
  statusText: { fontSize: 14, color: "rgba(255,255,255,0.5)" },
  hint: { fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 12 },
  retryBtn: {
    padding: "12px 32px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  contactLink: {
    display: "inline-block",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    transition: "all 0.2s",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
