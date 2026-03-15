"use client";

import { useState } from "react";
import type { Translations } from "@/lib/i18n";

interface ModelSwitcherProps {
  currentModel: string;
  t: Translations;
}

const MODELS = [
  { key: "claude", name: "Claude 4.6", icon: "🟣" },
  { key: "gpt", name: "GPT-5.2", icon: "🟢" },
  { key: "gemini", name: "Gemini 3", icon: "🔵" },
];

export default function ModelSwitcher({ currentModel, t }: ModelSwitcherProps) {
  const [selected, setSelected] = useState(currentModel);
  const [switching, setSwitching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentModelInfo = MODELS.find((m) => m.key === selected) || MODELS[0];

  const handleSwitch = async (newModel: string) => {
    if (newModel === selected || switching) return;

    setShowDropdown(false);
    setError("");
    setSuccess("");
    setSwitching(true);

    // 客户端 120s 超时保护，防止 fetch 永久挂起
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      const res = await fetch("/api/vps/switch-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: newModel }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.dashboard.model_switch_failed);
        return;
      }

      setSelected(newModel);
      setSuccess(
        t.dashboard.model_switch_success.replace(
          "{model}",
          MODELS.find((m) => m.key === newModel)?.name || newModel
        )
      );

      // 2 秒后自动清除成功提示并刷新页面
      setTimeout(() => {
        setSuccess("");
        window.location.reload();
      }, 2000);
    } catch (e: unknown) {
      clearTimeout(timeout);
      const isAbort = e instanceof Error && e.name === "AbortError";
      setError(isAbort ? "Switch timed out — please try again" : t.dashboard.model_switch_failed);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* 当前模型 + 切换按钮 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {currentModelInfo.icon} {currentModelInfo.name}
        </span>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={switching}
          style={{
            background: switching ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: switching ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 6,
            cursor: switching ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {switching ? t.dashboard.model_switching : t.dashboard.model_switch_btn}
        </button>
      </div>

      {/* 下拉选择 */}
      {showDropdown && (
        <>
          {/* 遮罩层（点击关闭） */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
            }}
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
                  background:
                    m.key === selected
                      ? "rgba(255,255,255,0.06)"
                      : "transparent",
                  border: "none",
                  borderRadius: 8,
                  color:
                    m.key === selected
                      ? "rgba(255,255,255,0.3)"
                      : "#fff",
                  fontSize: 13,
                  fontWeight: m.key === selected ? 600 : 400,
                  cursor: m.key === selected ? "default" : "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (m.key !== selected) {
                    (e.target as HTMLElement).style.background =
                      "rgba(255,255,255,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (m.key !== selected) {
                    (e.target as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: 16 }}>{m.icon}</span>
                <span>{m.name}</span>
                {m.key === selected && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    {t.dashboard.model_current}
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
              {t.dashboard.model_switch_note}
            </div>
          </div>
        </>
      )}

      {/* 切换中动画 */}
      {switching && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
          }}
        >
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
          {t.dashboard.model_switching_desc}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#f87171",
            padding: "6px 10px",
            background: "rgba(248,113,113,0.08)",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#4ade80",
            padding: "6px 10px",
            background: "rgba(74,222,128,0.08)",
            borderRadius: 8,
          }}
        >
          ✓ {success}
        </div>
      )}
    </div>
  );
}
