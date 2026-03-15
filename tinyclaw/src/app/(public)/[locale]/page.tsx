import { notFound } from "next/navigation";
import { NON_EN_LOCALES, OG_LOCALE_MAP, SUPPORTED_LOCALES, isValidLocale, loadTranslations } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n";
import type { Metadata } from "next";
import LandingPageContent from "@/components/LandingPageContent";

// 静态生成所有语言页面
export function generateStaticParams() {
  return NON_EN_LOCALES.map((l) => ({ locale: l.code }));
}

// 各语言本地化 keywords
const LOCALE_KEYWORDS: Record<string, string[]> = {
  zh: ["OpenClaw", "AI助手", "一键部署", "Telegram机器人", "Claude", "GPT", "AI自动化", "个人AI", "TinyClaw", "人工智能"],
  "zh-tw": ["OpenClaw", "AI助手", "一鍵部署", "Telegram機器人", "Claude", "GPT", "AI自動化", "個人AI", "TinyClaw", "人工智慧"],
  es: ["OpenClaw", "asistente IA", "desplegar IA", "bot Telegram", "Claude", "GPT", "automatización IA", "IA personal", "TinyClaw", "inteligencia artificial"],
  ja: ["OpenClaw", "AIアシスタント", "ワンクリックデプロイ", "Telegramボット", "Claude", "GPT", "AI自動化", "パーソナルAI", "TinyClaw", "人工知能"],
  ko: ["OpenClaw", "AI 비서", "원클릭 배포", "텔레그램 봇", "Claude", "GPT", "AI 자동화", "개인 AI", "TinyClaw", "인공지능"],
  de: ["OpenClaw", "KI-Assistent", "KI bereitstellen", "Telegram-Bot", "Claude", "GPT", "KI-Automatisierung", "persönliche KI", "TinyClaw", "künstliche Intelligenz"],
  fr: ["OpenClaw", "assistant IA", "déployer IA", "bot Telegram", "Claude", "GPT", "automatisation IA", "IA personnelle", "TinyClaw", "intelligence artificielle"],
  pt: ["OpenClaw", "assistente IA", "implantar IA", "bot Telegram", "Claude", "GPT", "automação IA", "IA pessoal", "TinyClaw", "inteligência artificial"],
  ru: ["OpenClaw", "ИИ-ассистент", "развертывание ИИ", "Telegram-бот", "Claude", "GPT", "автоматизация ИИ", "персональный ИИ", "TinyClaw", "искусственный интеллект"],
  ar: ["OpenClaw", "مساعد ذكاء اصطناعي", "نشر الذكاء الاصطناعي", "بوت تلغرام", "Claude", "GPT", "أتمتة الذكاء الاصطناعي", "ذكاء اصطناعي شخصي", "TinyClaw"],
};

// 完整的 hreflang 映射（所有语言互指）
function buildFullLanguageAlternates() {
  const langs: Record<string, string> = { "x-default": "/" };
  for (const l of SUPPORTED_LOCALES) {
    const key = l.code === "zh-tw" ? "zh-TW" : l.code;
    langs[key] = l.code === "en" ? "/" : `/${l.code}`;
  }
  return langs;
}

// 动态 metadata — 完整 SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale) || locale === "en") return {};

  const t = (await loadTranslations(locale)) as Translations;
  const ogLocale = OG_LOCALE_MAP[locale] || "en_US";

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: LOCALE_KEYWORDS[locale] || [],
    authors: [{ name: "AgentPuter", url: "https://agentputer.com" }],
    creator: "AgentPuter",
    publisher: "AgentPuter",
    alternates: {
      canonical: `/${locale}`,
      languages: buildFullLanguageAlternates(),
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.og_description,
      url: `https://tinyclaw.dev/${locale}`,
      siteName: "TinyClaw",
      type: "website",
      locale: ogLocale,
      images: [{ url: "https://tinyclaw.dev/og-image.png", width: 1200, height: 630, alt: t.meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.og_description,
      images: ["https://tinyclaw.dev/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// 构建本地化 JSON-LD 结构化数据
function buildStructuredData(t: Translations, locale: string) {
  const ogLocale = OG_LOCALE_MAP[locale] || "en_US";
  const pageUrl = `https://tinyclaw.dev/${locale}`;

  // FAQPage — GEO 核心：本地化问答让 AI 引擎直接抓取各语言答案
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: ogLocale.replace("_", "-"),
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  // SoftwareApplication — 本地化产品描述
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TinyClaw",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: pageUrl,
    inLanguage: ogLocale.replace("_", "-"),
    description: t.meta.description,
    offers: {
      "@type": "Offer",
      price: "29.99",
      priceCurrency: "USD",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
    },
  };

  // WebPage — 标识这个特定语言版本的页面
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.meta.title,
    description: t.meta.description,
    url: pageUrl,
    inLanguage: ogLocale.replace("_", "-"),
    isPartOf: {
      "@type": "WebSite",
      name: "TinyClaw",
      url: "https://tinyclaw.dev",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${t.hero.title_line1} ${t.hero.title_line2}`.replace(/<br\s*\/?>/g, " ").trim(),
    description: t.hero.subtitle,
    inLanguage: ogLocale.replace("_", "-"),
    totalTime: "PT1M",
    tool: [
      { "@type": "HowToTool", name: "Google Account" },
      { "@type": "HowToTool", name: "Telegram Account" },
    ],
    step: [
      { "@type": "HowToStep", position: 1, name: t.models.heading, text: "Claude 4.6, GPT-5.2, Gemini 3" },
      { "@type": "HowToStep", position: 2, name: t.channels.heading, text: "Telegram, Discord, WhatsApp" },
      { "@type": "HowToStep", position: 3, name: t.cta.button, text: t.cta.note },
      { "@type": "HowToStep", position: 4, name: t.comparison.tinyclaw_time, text: t.comparison.tinyclaw_desc },
    ],
  };

  return { faqSchema, softwareSchema, webPageSchema, howToSchema };
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale) || locale === "en") {
    notFound();
  }

  const t = (await loadTranslations(locale)) as Translations;
  const localeInfo = SUPPORTED_LOCALES.find((l) => l.code === locale);
  const { faqSchema, softwareSchema, webPageSchema, howToSchema } = buildStructuredData(t, locale);

  return (
    <div lang={locale} dir={localeInfo?.dir || "ltr"}>
      {/* 本地化 JSON-LD 结构化数据 — SEO/GEO 核心 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <LandingPageContent t={t} locale={locale} />
    </div>
  );
}
