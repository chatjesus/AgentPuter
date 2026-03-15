import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, type ToolDef } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "Free Online Tools — AI Tools, Converters & Developer Utils",
  description: "30+ free online tools powered by AI. PDF converters, image compressor, JSON formatter, QR code generator, AI text rewriter, code explainer, SQL generator, and more. No signup required.",
  alternates: { canonical: "https://tinyclaw.dev/tools" },
};

const CATEGORY_LABELS: Record<ToolDef["category"], { label: string; desc: string }> = {
  ai: { label: "AI-Powered Tools", desc: "Intelligent tools powered by Gemini AI" },
  converter: { label: "File Converters", desc: "Convert files instantly in your browser" },
  developer: { label: "Developer Tools", desc: "Utilities for developers and engineers" },
  generator: { label: "Generators", desc: "Generate codes, IDs, and assets" },
  vertical: { label: "Specialized Tools", desc: "Industry-specific utilities" },
  pdf: { label: "PDF Tools", desc: "Edit, merge, split, and convert PDFs" },
  image: { label: "Image Tools", desc: "Compress, convert, and optimize images" },
};

const CATEGORY_ORDER: ToolDef["category"][] = ["ai", "converter", "pdf", "image", "developer", "generator", "vertical"];

export default function ToolsIndexPage() {
  return (
    <main className="tools-main">
      <div className="tools-hero">
        <h1>Free Online Tools</h1>
        <p>AI-powered tools, file converters, and developer utilities. No signup required — 100% free.</p>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const tools = TOOLS.filter((t) => t.category === cat);
        if (tools.length === 0) return null;
        const info = CATEGORY_LABELS[cat];
        return (
          <section key={cat} className="tools-section">
            <h2>{info.label}</h2>
            <p className="tools-section-desc">{info.desc}</p>
            <div className="tools-grid">
              {tools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card">
                  <span className="tool-card-icon">{tool.icon}</span>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                  {tool.isAI && <span className="tool-badge-ai">AI</span>}
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* JSON-LD ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "TinyClaw Free Online Tools",
            numberOfItems: TOOLS.length,
            itemListElement: TOOLS.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name,
              url: `https://tinyclaw.dev/tools/${t.slug}`,
            })),
          }),
        }}
      />
    </main>
  );
}
