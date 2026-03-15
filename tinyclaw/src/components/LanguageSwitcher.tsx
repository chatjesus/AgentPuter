"use client";

import { useState, useRef, useEffect } from "react";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { saveLocalePreference } from "@/hooks/useLocale";

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SUPPORTED_LOCALES.find((l) => l.code === currentLocale);

  const getHref = (code: string) => {
    if (code === "en") return "/";
    return `/${code}`;
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8,
          padding: "6px 12px",
          color: "rgba(255,255,255,0.7)",
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "rgba(255,255,255,0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.color = "rgba(255,255,255,0.7)";
        }}
      >
        <span style={{ fontSize: 15 }}>🌐</span>
        <span>{current?.nativeName || "English"}</span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "6px 0",
            minWidth: 160,
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <a
              key={locale.code}
              href={getHref(locale.code)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 16px",
                color: locale.code === currentLocale ? "#a78bfa" : "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: 13,
                transition: "background 0.15s",
                fontWeight: locale.code === currentLocale ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              onClick={() => {
                saveLocalePreference(locale.code);
                setOpen(false);
              }}
            >
              <span>{locale.nativeName}</span>
              <span style={{ opacity: 0.4, fontSize: 11 }}>{locale.code.toUpperCase()}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
