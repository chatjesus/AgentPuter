"use client";

import { useState, useCallback, lazy, Suspense } from "react";

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  "json-formatter": lazy(() => import("@/tools/JsonFormatter")),
  "base64-encoder": lazy(() => import("@/tools/Base64Encoder")),
  "word-counter": lazy(() => import("@/tools/WordCounter")),
  "uuid-generator": lazy(() => import("@/tools/UuidGenerator")),
  "qr-code-generator": lazy(() => import("@/tools/QrCodeGenerator")),
  "color-picker": lazy(() => import("@/tools/ColorPicker")),
  "markdown-preview": lazy(() => import("@/tools/MarkdownPreview")),
  "image-compressor": lazy(() => import("@/tools/ImageCompressor")),
  "image-to-pdf": lazy(() => import("@/tools/ImageToPdf")),
  "pdf-to-image": lazy(() => import("@/tools/PdfToImage")),
  "cron-expression-generator": lazy(() => import("@/tools/CronGenerator")),
  "telegram-bot-checker": lazy(() => import("@/tools/TelegramBotChecker")),
  "api-health-checker": lazy(() => import("@/tools/ApiHealthChecker")),
  "ai-agent-cost-calculator": lazy(() => import("@/tools/AiAgentCostCalculator")),
  "hash-generator": lazy(() => import("@/tools/HashGenerator")),
  "url-encoder": lazy(() => import("@/tools/UrlEncoder")),
  // PDF tools — coming soon (lazy-loaded when implemented)
  // "merge-pdf": lazy(() => import("@/tools/MergePdf")),
  // "split-pdf": lazy(() => import("@/tools/SplitPdf")),
  // "rotate-pdf": lazy(() => import("@/tools/RotatePdf")),
  // "compress-pdf": lazy(() => import("@/tools/CompressPdf")),
  // "pdf-page-numbers": lazy(() => import("@/tools/PdfPageNumbers")),
  // "watermark-pdf": lazy(() => import("@/tools/WatermarkPdf")),
  // "pdf-to-text": lazy(() => import("@/tools/PdfToText")),
  // "protect-pdf": lazy(() => import("@/tools/ProtectPdf")),
};

const AI_SLUGS = [
  "ai-rewriter", "ai-summarizer", "ai-translator", "ai-email-writer",
  "ai-code-explainer", "ai-regex-generator", "ai-sql-generator", "ai-resume-optimizer",
];

function GenericAITool({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: slug, input: input.trim() }),
      });
      const data = await res.json();
      setOutput(data.result || data.error || "No output");
    } catch {
      setOutput("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, slug]);

  const placeholders: Record<string, string> = {
    "ai-rewriter": "Paste text to rewrite…",
    "ai-summarizer": "Paste long text to summarize…",
    "ai-translator": "Type or paste text to translate…",
    "ai-email-writer": "Describe the email you need (e.g. 'Follow-up after job interview, friendly tone')…",
    "ai-code-explainer": "Paste code to explain…",
    "ai-regex-generator": "Describe the pattern (e.g. 'match email addresses')…",
    "ai-sql-generator": "Describe your query (e.g. 'get all users who signed up this month')…",
    "ai-resume-optimizer": "Paste your resume text…",
  };

  return (
    <div className="tool-ai-wrapper">
      <textarea
        className="tool-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholders[slug] || "Enter text…"}
        rows={8}
      />
      <button className="tool-run-btn" onClick={run} disabled={loading || !input.trim()}>
        {loading ? "Processing…" : "Run ⚡"}
      </button>
      {output && (
        <div className="tool-output">
          <div className="tool-output-header">
            <span>Result</span>
            <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
          </div>
          <pre className="tool-output-pre">{output}</pre>
        </div>
      )}
    </div>
  );
}

export default function ToolRunner({ slug, isAI }: { slug: string; isAI: boolean }) {
  if (AI_SLUGS.includes(slug)) {
    return <GenericAITool slug={slug} />;
  }

  const Component = toolComponents[slug];
  if (!Component) {
    return <div className="tool-placeholder">This tool is coming soon.</div>;
  }

  return (
    <Suspense fallback={<div className="tool-loading">Loading tool…</div>}>
      <Component />
    </Suspense>
  );
}
