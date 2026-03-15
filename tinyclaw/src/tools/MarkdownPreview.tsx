"use client";
import { useState, useMemo } from "react";

function md2html(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
  return `<p>${html}</p>`;
}

export default function MarkdownPreview() {
  const [input, setInput] = useState("# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n> A blockquote\n\n`inline code`\n\n[TinyClaw](https://tinyclaw.dev)");
  const html = useMemo(() => md2html(input), [input]);

  return (
    <div className="tool-split">
      <div className="tool-split-left">
        <label className="tool-label">Markdown</label>
        <textarea className="tool-textarea tool-mono" value={input} onChange={(e) => setInput(e.target.value)} rows={14} />
      </div>
      <div className="tool-split-right">
        <label className="tool-label">Preview</label>
        <div className="tool-md-preview" dangerouslySetInnerHTML={{ __html: html }} />
        <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(html)} style={{ marginTop: 8 }}>Copy HTML</button>
      </div>
    </div>
  );
}
