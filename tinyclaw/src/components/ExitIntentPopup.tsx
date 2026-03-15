"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const STORAGE_KEY = "tc_exit_popup_shown";
const COUNTDOWN_KEY = "tc_exit_popup_deadline";
const COUNTDOWN_HOURS = 24;

function getDeadline(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(COUNTDOWN_KEY);
  if (stored) return parseInt(stored, 10);
  const deadline = Date.now() + COUNTDOWN_HOURS * 60 * 60 * 1000;
  localStorage.setItem(COUNTDOWN_KEY, String(deadline));
  return deadline;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return { h: "00", m: "00", s: "00" };
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

interface ExitIntentPopupProps {
  onDeploy?: () => void;
}

export default function ExitIntentPopup({ onDeploy }: ExitIntentPopupProps) {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState({ h: "23", m: "59", s: "59" });
  const [arrowOffset, setArrowOffset] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const arrowRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shownRef = useRef(false);

  // 倒计时 tick
  useEffect(() => {
    if (!visible) return;
    const deadline = getDeadline();

    const tick = () => {
      const remaining = deadline - Date.now();
      setCountdown(formatCountdown(remaining));
      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [visible]);

  // 箭头左右弹跳动效
  useEffect(() => {
    if (!visible) return;
    let dir = 1;
    arrowRef.current = setInterval(() => {
      setArrowOffset(prev => {
        const next = prev + dir * 2;
        if (next >= 8) dir = -1;
        if (next <= 0) dir = 1;
        return next;
      });
    }, 40);
    return () => { if (arrowRef.current) clearInterval(arrowRef.current); };
  }, [visible]);

  const handleDeploy = useCallback(() => {
    setVisible(false);
    if (onDeploy) {
      onDeploy();
    } else {
      window.location.href = "/sign-up";
    }
  }, [onDeploy]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    // 移动端无 mouseleave，直接跳过
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    // 每次会话只触发一次
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let activated = false;

    // 延迟 3s 后才激活，避免用户刚进来就弹
    const activateTimer = setTimeout(() => {
      activated = true;
    }, 3000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (!activated) return;
      if (shownRef.current) return;
      if (e.clientY <= 0 && e.relatedTarget === null) {
        shownRef.current = true;
        sessionStorage.setItem(STORAGE_KEY, "1");
        setVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(activateTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        onClick={handleDismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* 弹窗主体 */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        background: "#0e0e10",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 20,
        padding: "40px 36px",
        maxWidth: 460,
        width: "calc(100vw - 48px)",
        textAlign: "center",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* 关闭按钮 */}
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none",
            color: "rgba(255,255,255,0.3)", fontSize: 20,
            cursor: "pointer", lineHeight: 1, padding: 4,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* 内容 */}
        <div style={{ fontSize: 44, marginBottom: 12 }}>🦞</div>

        <h2 style={{
          fontSize: 22, fontWeight: 800,
          margin: "0 0 8px",
          letterSpacing: "-0.03em",
          color: "#fff",
        }}>
          Wait — before you go!
        </h2>

        <p style={{
          fontSize: 15, color: "rgba(255,255,255,0.55)",
          lineHeight: 1.6, margin: "0 0 16px",
        }}>
          Deploy your own <strong style={{ color: "#fff" }}>private AI agent</strong> in under 1 minute.
          <br />
          No servers, no SSH, no technical setup required.
        </p>

        {/* 24h 倒计时 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 4, margin: "0 0 20px",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginRight: 6, letterSpacing: "0.05em" }}>
            OFFER EXPIRES IN
          </span>
          {[countdown.h, countdown.m, countdown.s].map((val, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                display: "inline-block", minWidth: 36,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, padding: "4px 6px",
                fontSize: 18, fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                color: "#fff", textAlign: "center",
                letterSpacing: "0.02em",
              }}>
                {val}
              </span>
              {i < 2 && (
                <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>:</span>
              )}
            </span>
          ))}
        </div>

        {/* 特性列表 */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 6,
          margin: "0 0 24px",
          textAlign: "left",
        }}>
          {[
            "✦ Dedicated private VPS — your data stays yours",
            "◉ All models: Claude, GPT-5.2, Gemini",
            "✧ One-click Skills from ClawHub",
            "✦ 24/7 uptime, no babysitting required",
          ].map((f) => (
            <div key={f} style={{
              fontSize: 13, color: "rgba(255,255,255,0.6)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {f}
            </div>
          ))}
        </div>

        {/* 主 CTA — 箭头弹跳动效 */}
        <button
          onClick={handleDeploy}
          style={{
            width: "100%", padding: "15px 0",
            borderRadius: 12,
            background: "#fff", color: "#000",
            fontSize: 15, fontWeight: 700,
            border: "none", cursor: "pointer",
            marginBottom: 12,
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.92")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Deploy Now
          <span style={{
            position: "absolute",
            right: 20,
            display: "inline-block",
            transform: `translateX(${arrowOffset}px)`,
            transition: "transform 0.04s linear",
            fontSize: 17,
          }}>
            →
          </span>
        </button>

        {/* 次要文案 */}
        <p style={{
          fontSize: 12, color: "rgba(255,255,255,0.25)",
          margin: 0,
        }}>
          7-day free trial · $29.99/mo after · Cancel anytime
        </p>

        {/* 放弃链接 */}
        <button
          onClick={handleDismiss}
          style={{
            marginTop: 14,
            background: "none", border: "none",
            color: "rgba(255,255,255,0.25)",
            fontSize: 12, cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          No thanks, I&apos;ll pass
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
