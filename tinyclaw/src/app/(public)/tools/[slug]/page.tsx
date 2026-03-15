import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, getToolBySlug } from "@/lib/tools-registry";
import ToolRunner from "./ToolRunner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: `https://tinyclaw.dev/tools/${slug}` },
    openGraph: {
      title: `${tool.name} — Free Online Tool | TinyClaw`,
      description: tool.description,
      url: `https://tinyclaw.dev/tools/${slug}`,
      siteName: "TinyClaw",
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = TOOLS.filter((t) => t.slug !== slug && t.category === tool.category).slice(0, 4);

  return (
    <main className="tools-main">
      <div className="tool-header">
        <span className="tool-header-icon">{tool.icon}</span>
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
        {tool.isAI && <span className="tool-badge-ai" style={{ marginTop: 8 }}>Powered by AI</span>}
      </div>

      <div className="tool-body">
        <ToolRunner slug={slug} isAI={!!tool.isAI} />
      </div>

      {related.length > 0 && (
        <section className="tools-related">
          <h2>Related Tools</h2>
          <div className="tools-grid tools-grid-sm">
            {related.map((r) => (
              <a key={r.slug} href={`/tools/${r.slug}`} className="tool-card tool-card-sm">
                <span className="tool-card-icon">{r.icon}</span>
                <h3>{r.name}</h3>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.name,
            description: tool.description,
            url: `https://tinyclaw.dev/tools/${slug}`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            author: { "@type": "Organization", name: "TinyClaw", url: "https://tinyclaw.dev" },
          }),
        }}
      />
    </main>
  );
}
