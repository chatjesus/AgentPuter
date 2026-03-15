import LandingPageContent from "@/components/LandingPageContent";
import en from "@/locales/en.json";
import type { Translations } from "@/lib/i18n";

export default function LandingPage() {
  const t = en as Translations;

  return (
    <>
      {/* JSON-LD: WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.meta.title,
            description: t.meta.description,
            url: "https://tinyclaw.dev",
            inLanguage: "en-US",
            isPartOf: {
              "@type": "WebSite",
              name: "TinyClaw",
              url: "https://tinyclaw.dev",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://tinyclaw.dev/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          }),
        }}
      />
      {/* JSON-LD: SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "TinyClaw",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            url: "https://tinyclaw.dev",
            inLanguage: "en-US",
            description: t.meta.description,
            offers: {
              "@type": "Offer",
              price: "29.99",
              priceCurrency: "USD",
              priceValidUntil: "2026-12-31",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: "en-US",
            mainEntity: t.faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
      {/* JSON-LD: HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Deploy OpenClaw with TinyClaw in Under 1 Minute",
            description:
              "Deploy your own 24/7 AI assistant powered by OpenClaw with just a few clicks. No SSH, no Docker, no DevOps required.",
            totalTime: "PT1M",
            tool: [
              { "@type": "HowToTool", name: "Google Account" },
              { "@type": "HowToTool", name: "Telegram Account" },
            ],
            step: [
              { "@type": "HowToStep", position: 1, name: "Choose your AI model", text: "Select from Claude 4.6, GPT-5.2, or Gemini 3 as your default AI model." },
              { "@type": "HowToStep", position: 2, name: "Connect your messaging channel", text: "Choose Telegram as your messaging channel (Discord and WhatsApp coming soon)." },
              { "@type": "HowToStep", position: 3, name: "Sign in and deploy", text: "Sign in with your Google account. TinyClaw automatically provisions a dedicated cloud server, installs OpenClaw, and connects everything." },
              { "@type": "HowToStep", position: 4, name: "Start chatting with your AI", text: "Your 24/7 AI assistant is live on Telegram in under 60 seconds. Start giving it tasks via natural language." },
            ],
          }),
        }}
      />
      <LandingPageContent t={t} locale="en" />
    </>
  );
}
