"use client";

import { useState, useEffect } from "react";
import type { Translations } from "@/lib/i18n";
import { SUPPORTED_LOCALES, type LocaleCode } from "@/lib/i18n";
import en from "@/locales/en.json";

const LOCALE_STORAGE_KEY = "tinyclaw-locale";

/**
 * 获取保存的语言偏好，优先 localStorage，其次浏览器语言
 */
function detectLocale(): LocaleCode {
  // 1. localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) {
      return saved as LocaleCode;
    }
  }

  // 2. 浏览器语言
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.toLowerCase();
    // 精确匹配 zh-tw
    if (browserLang === "zh-tw" || browserLang === "zh-hant") return "zh-tw";
    // 前缀匹配
    const prefix = browserLang.split("-")[0];
    const match = SUPPORTED_LOCALES.find((l) => l.code === prefix);
    if (match) return match.code;
  }

  return "en";
}

/**
 * 保存语言偏好到 localStorage + cookie（cookie 供 SSR 读取）
 */
export function saveLocalePreference(locale: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    // 同步写入 cookie，供服务端组件读取
    document.cookie = `${LOCALE_STORAGE_KEY}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }
}

/**
 * 客户端 hook：加载当前语言的翻译
 * 用于 auth 页面（/setup, /creating, /dashboard 等）
 */
export function useLocale() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [t, setT] = useState<Translations>(en as Translations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detected = detectLocale();
    setLocale(detected);
    // 同步 cookie 供 SSR 读取
    document.cookie = `${LOCALE_STORAGE_KEY}=${detected};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

    if (detected === "en") {
      setT(en as Translations);
      setLoading(false);
      return;
    }

    // 动态加载对应语言
    import(`@/locales/${detected}.json`)
      .then((mod) => {
        setT((mod.default || mod) as Translations);
      })
      .catch(() => {
        // 回退英文
        setT(en as Translations);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { locale, t, loading };
}
