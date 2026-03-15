"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Translations } from "@/lib/i18n";

interface WhatsAppSetupProps {
  currentStatus: string | null;
  openclawUrl: string;
  t: Translations;
}

// 把 ASCII QR 渲染为 Canvas 图片（像素级，手机可扫）
// OpenClaw 输出使用 Unicode 半块字符编码：每行文本 = 2 行 QR 模块
//   █ (U+2588) = 上暗 + 下暗
//   ▀ (U+2580) = 上暗 + 下亮
//   ▄ (U+2584) = 上亮 + 下暗
//   ` ` (空格)  = 上亮 + 下亮
function renderAsciiQrToCanvas(asciiQr: string, canvas: HTMLCanvasElement) {
  // 过滤空行和只含空白的行，保留真实 QR 内容行
  const lines = asciiQr.split("\n").filter((l) => l.replace(/\r/, "").length > 0);
  if (lines.length === 0) return;

  const maxCols = Math.max(...lines.map((l) => [...l].length));
  const moduleSize = 8;    // 每个 QR 模块 = 8×8px，足够手机相机识别
  const quietZone = 4;     // QR 规范要求 4 模块宽的空白边框

  // 每行文本代表 2 行 QR 模块（半块字符编码）
  const totalModuleRows = lines.length * 2;
  const totalModuleCols = maxCols;

  canvas.width  = (totalModuleCols + quietZone * 2) * moduleSize;
  canvas.height = (totalModuleRows + quietZone * 2) * moduleSize;

  const ctx = canvas.getContext("2d")!;
  // 整块填白（包含 quiet zone）
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const ox = quietZone * moduleSize;
  const oy = quietZone * moduleSize;

  lines.forEach((line, lineIdx) => {
    const chars = [...line];
    chars.forEach((char, col) => {
      const x    = ox + col * moduleSize;
      const yTop = oy + lineIdx * 2 * moduleSize;
      const yBot = yTop + moduleSize;

      // 半块字符解码：哪半是暗的
      const topDark =
        char === "\u2588" || // █ 全块
        char === "\u2580";   // ▀ 上半块
      const botDark =
        char === "\u2588" || // █ 全块
        char === "\u2584";   // ▄ 下半块

      // 其他非空字符（如 # 等 fallback ASCII 格式）全部视为暗
      const isFallback = !topDark && !botDark && char !== " " && char !== "\r";

      ctx.fillStyle = "#000000";
      if (topDark || isFallback) ctx.fillRect(x, yTop, moduleSize, moduleSize);
      if (botDark || isFallback) ctx.fillRect(x, yBot, moduleSize, moduleSize);
    });
  });
}

export default function WhatsAppSetup({ currentStatus, openclawUrl, t }: WhatsAppSetupProps) {
  const [activating, setActivating] = useState(false);
  const [activateError, setActivateError] = useState("");
  const [activated, setActivated] = useState(
    currentStatus === "configured" || currentStatus === "linked"
  );

  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const expireTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 扫码后重启 gateway 的状态
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applied, setApplied] = useState(currentStatus === "linked");

  const fetchAndRenderQr = useCallback(async () => {
    setQrLoading(true);
    setQrError("");
    setQrVisible(false);
    setQrExpired(false);
    if (expireTimerRef.current) clearTimeout(expireTimerRef.current);

    try {
      const res = await fetch("/api/whatsapp/qr", { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.error) {
        setQrError(data.error || "Failed to get QR code.");
        setQrLoading(false);
        return;
      }

      if (!data.ascii) {
        setQrError("No QR code returned.");
        setQrLoading(false);
        return;
      }

      // 等 canvas 挂载后渲染
      setTimeout(() => {
        if (canvasRef.current) {
          renderAsciiQrToCanvas(data.ascii, canvasRef.current);
          setQrVisible(true);
        }
        setQrLoading(false);
      }, 100);

      // 后台进程持续运行，QR 约 60s 过期
      expireTimerRef.current = setTimeout(() => {
        setQrExpired(true);
      }, 55000);
    } catch {
      setQrError(t.setup.network_error);
      setQrLoading(false);
    }
  }, [t]);

  useEffect(() => {
    return () => {
      if (expireTimerRef.current) clearTimeout(expireTimerRef.current);
    };
  }, []);

  const handleApply = async () => {
    setApplying(true);
    setApplyError("");
    try {
      const res = await fetch("/api/whatsapp/apply", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setApplyError(data.error || t.dashboard.whatsapp_apply_failed);
      } else {
        setApplied(true);
      }
    } catch {
      setApplyError(t.setup.network_error);
    } finally {
      setApplying(false);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    setActivateError("");
    try {
      const res = await fetch("/api/whatsapp/enable", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setActivateError(data.error || t.dashboard.whatsapp_activate_failed);
      } else {
        setActivated(true);
      }
    } catch {
      setActivateError(t.setup.network_error);
    } finally {
      setActivating(false);
    }
  };

  // 未激活：显示激活按钮
  if (!activated) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 10px 0", lineHeight: 1.5 }}>
          {t.dashboard.whatsapp_no_token_desc}
        </p>
        <button
          onClick={handleActivate}
          disabled={activating}
          style={{
            padding: "10px 20px",
            background: activating ? "rgba(37,211,102,0.3)" : "#25D366",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 9,
            border: "none",
            cursor: activating ? "not-allowed" : "pointer",
            width: "fit-content",
          }}
        >
          {activating ? t.dashboard.whatsapp_activating : t.dashboard.whatsapp_activate_btn}
        </button>
        {activateError && (
          <p style={{ color: "#f87171", fontSize: 12, margin: "4px 0 0 0" }}>{activateError}</p>
        )}
      </div>
    );
  }

  // 已激活：QR 扫码 + 三步引导
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          background: "rgba(37,211,102,0.08)",
          border: "1px solid rgba(37,211,102,0.25)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 12,
          color: "#4ade80",
        }}
      >
        {t.dashboard.whatsapp_activated}
      </div>

      {/* QR 码区域 */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(37,211,102,0.2)",
          borderRadius: 12,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, margin: 0 }}>
          {t.dashboard.whatsapp_scan_instructions}
        </p>

        {/* Canvas QR 图片 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 12,
            display: qrVisible ? "block" : "none",
            position: "relative",
          }}
        >
          <canvas ref={canvasRef} style={{ display: "block", maxWidth: "100%", imageRendering: "pixelated" }} />
          {qrExpired && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{t.dashboard.whatsapp_qr_expired}</span>
            </div>
          )}
        </div>

        {/* 占位/loading */}
        {!qrVisible && !qrLoading && !qrError && (
          <div
            style={{
              width: 200,
              height: 200,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>{t.dashboard.whatsapp_qr_placeholder}</span>
          </div>
        )}
        {qrLoading && (
          <div
            style={{
              width: 200,
              height: 200,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#25D366", fontSize: 12 }}>{t.dashboard.whatsapp_qr_generating}</span>
          </div>
        )}
        {qrError && (
          <p style={{ color: "#f87171", fontSize: 12, margin: 0, textAlign: "center" }}>{qrError}</p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={fetchAndRenderQr}
            disabled={qrLoading}
            style={{
              padding: "8px 16px",
              background: qrLoading ? "rgba(37,211,102,0.3)" : "#25D366",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 8,
              border: "none",
              cursor: qrLoading ? "not-allowed" : "pointer",
            }}
          >
            {qrVisible ? t.dashboard.whatsapp_refresh_qr : t.dashboard.whatsapp_generate_qr}
          </button>
          <a
            href={openclawUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            {t.dashboard.whatsapp_open_webchat}
          </a>
        </div>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, margin: 0, textAlign: "center" }}>
          {t.dashboard.whatsapp_qr_expires_hint}
        </p>
      </div>

      {/* Step 2：扫码后点击重启 gateway */}
      {!applied ? (
        <div
          style={{
            background: "rgba(37,211,102,0.07)",
            border: "1px solid rgba(37,211,102,0.2)",
            borderRadius: 10,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p style={{ color: "rgba(180,255,200,0.95)", fontSize: 13, fontWeight: 600, margin: 0 }}>
            {t.dashboard.whatsapp_step2_title}
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            {t.dashboard.whatsapp_step2_desc}
          </p>
          <button
            onClick={handleApply}
            disabled={applying}
            style={{
              padding: "9px 18px",
              background: applying ? "rgba(37,211,102,0.3)" : "#25D366",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              border: "none",
              cursor: applying ? "not-allowed" : "pointer",
              width: "fit-content",
            }}
          >
            {applying ? t.dashboard.whatsapp_applying : t.dashboard.whatsapp_apply_btn}
          </button>
          {applyError && (
            <p style={{ color: "#f87171", fontSize: 12, margin: 0 }}>{applyError}</p>
          )}
        </div>
      ) : (
        /* 已连接成功 */
        <div
          style={{
            background: "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.35)",
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <p style={{ color: "#4ade80", fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>
            {t.dashboard.whatsapp_live_title}
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            {t.dashboard.whatsapp_live_desc}
          </p>
        </div>
      )}
    </div>
  );
}
