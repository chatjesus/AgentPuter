import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | TinyClaw Free Tools",
    default: "Free Online Tools — AI Tools, Converters & Developer Utils | TinyClaw",
  },
  description: "Free online tools powered by AI. PDF converters, JSON formatter, QR code generator, AI text rewriter, code explainer, and more. No signup required.",
  keywords: ["free online tools", "ai tools", "pdf converter", "json formatter", "developer tools", "ai text rewriter"],
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tools-page">
      {/* 顶栏 */}
      <nav className="tools-topbar">
        <a href="/" className="tools-topbar-brand">TinyClaw.dev</a>
        <div className="tools-topbar-links">
          <a href="/tools" className="tools-topbar-link">All Tools</a>
          <a href="https://agentputer.com/blog" className="tools-topbar-link" target="_blank" rel="noopener noreferrer">Blog</a>
          <a href="/sign-up" className="tools-topbar-cta">Deploy AI Agent →</a>
        </div>
      </nav>

      {children}

      {/* CTA Banner */}
      <section className="tools-cta-banner">
        <h2>Need a 24/7 AI Agent?</h2>
        <p>Deploy your own OpenClaw AI assistant in under 1 minute. No coding required.</p>
        <a href="/sign-up" className="tools-cta-btn">Deploy Now — Free Trial</a>
      </section>

      {/* Footer */}
      <footer className="tools-footer">
        <div className="tools-footer-inner">
          <span>© 2026 TinyClaw by <a href="https://agentputer.com" target="_blank" rel="noopener noreferrer">AgentPuter</a></span>
          <div className="tools-footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
