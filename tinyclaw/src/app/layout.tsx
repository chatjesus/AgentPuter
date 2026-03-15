import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TinyClaw — Deploy OpenClaw in 1 Minute | One-Click AI Agent Hosting",
  description:
    "Deploy your own OpenClaw AI assistant in under 60 seconds. No SSH, no Docker, no DevOps. One-click cloud setup with Telegram, WhatsApp & Discord. Choose Claude, GPT or Gemini. Free 7-day trial, then $29.99/month.",
  metadataBase: new URL("https://tinyclaw.dev"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      zh: "/zh",
      "zh-TW": "/zh-tw",
      es: "/es",
      ja: "/ja",
      ko: "/ko",
      de: "/de",
      fr: "/fr",
      pt: "/pt",
      ru: "/ru",
      ar: "/ar",
      "x-default": "/",
    },
  },
  keywords: [
    "OpenClaw",
    "AI assistant",
    "deploy AI",
    "deploy OpenClaw",
    "one-click deploy",
    "AI agent hosting",
    "Telegram bot",
    "Claude",
    "GPT",
    "Gemini",
    "AI automation",
    "personal AI",
    "TinyClaw",
    "AI助手",
    "一键部署",
    "AIアシスタント",
    "AI 비서",
    "KI-Assistent",
    "assistant IA",
    "مساعد ذكاء اصطناعي",
  ],
  authors: [{ name: "AgentPuter", url: "https://agentputer.com" }],
  creator: "AgentPuter",
  publisher: "AgentPuter",
  openGraph: {
    title: "TinyClaw — Deploy OpenClaw in 1 Minute",
    description:
      "One-click deploy your own 24/7 AI assistant. No servers, no SSH, no headaches. Choose Claude, GPT or Gemini and connect via Telegram.",
    url: "https://tinyclaw.dev",
    siteName: "TinyClaw",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://tinyclaw.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "TinyClaw — Deploy OpenClaw in 1 Minute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyClaw — Deploy OpenClaw in 1 Minute",
    description:
      "One-click deploy your own 24/7 AI assistant. No servers, no SSH, no headaches.",
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
  other: {
    "theme-color": "#0a0a0f",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") ?? "en";
  // zh-tw → zh-TW (BCP 47)
  const htmlLang = locale === "zh-tw" ? "zh-TW" : locale;

  return (
    <html lang={htmlLang}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* 预取 sign-up 页，降低 CTA 点击后的导航延迟 */}
        <link rel="prefetch" href="/sign-up" as="document" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TinyClaw",
              url: "https://tinyclaw.dev",
              logo: "https://tinyclaw.dev/favicon.svg",
              description:
                "One-click deploy your own 24/7 AI assistant powered by OpenClaw.",
              parentOrganization: {
                "@type": "Organization",
                name: "AgentPuter",
                url: "https://agentputer.com",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "oscarzamora199907@gmail.com",
                contactType: "customer support",
              },
            }),
          }}
        />

        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TinyClaw",
              url: "https://tinyclaw.dev",
              description:
                "One-click deployment platform for OpenClaw AI assistants.",
              inLanguage: [
                "en",
                "zh-CN",
                "zh-TW",
                "es",
                "ja",
                "ko",
                "de",
                "fr",
                "pt-BR",
                "ru",
                "ar",
              ],
            }),
          }}
        />

        {/* JSON-LD: BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://tinyclaw.dev",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>

      {/* Google Analytics 4 + Google Ads — afterInteractive 不阻塞渲染 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-VTTKDJ5SY3"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-VTTKDJ5SY3');
          gtag('config', 'AW-16955498656');
          gtag('config', 'AW-845688835');
        `}
      </Script>
    </html>
  );
}
