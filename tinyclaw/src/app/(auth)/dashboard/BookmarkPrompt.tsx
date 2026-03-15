"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tc_bookmark_dismissed";

export default function BookmarkPrompt() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // 已永久关闭则不再显示
    if (localStorage.getItem(STORAGE_KEY)) return;
    // 延迟 2.5 秒再弹出，让用户先看到 dashboard 内容
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = (permanent: boolean) => {
    setHiding(true);
    if (permanent) localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.userAgent);

  const shortcut = isMac ? "⌘ + D" : "Ctrl + D";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${hiding ? "120%" : "0"})`,
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s",
        opacity: hiding ? 0 : 1,
        zIndex: 9999,
        width: "calc(100% - 48px)",
        maxWidth: 440,
      }}
    >
      <div
        style={{
          background: "rgba(18,18,20,0.96)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: "18px 20px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        {/* 图标 */}
        <div style={{ fontSize: 28, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>🔖</div>

        {/* 内容 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Bookmark your dashboard
          </p>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.5,
            }}
          >
            Come back anytime to open WebChat, manage your bot, or update your
            subscription. Press{" "}
            <kbd
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 4,
                padding: "1px 5px",
                fontSize: 11,
                fontFamily: "inherit",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {shortcut}
            </kbd>{" "}
            to save this page.
          </p>

          {/* 行动按钮 */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => dismiss(true)}
              style={{
                flex: 1,
                padding: "9px 0",
                background: "#fff",
                color: "#000",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Got it ✓
            </button>
            <button
              onClick={() => dismiss(false)}
              style={{
                padding: "9px 14px",
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.5)",
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 9,
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Later
            </button>
          </div>
        </div>

        {/* 关闭 × */}
        <button
          onClick={() => dismiss(false)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.3)",
            fontSize: 18,
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            flexShrink: 0,
            marginTop: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
