"use client";
import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = (indent: number) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const sortKeys = () => {
    try {
      const sorted = JSON.parse(input, (_, v) =>
        v && typeof v === "object" && !Array.isArray(v)
          ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
          : v
      );
      setOutput(JSON.stringify(sorted, null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="tool-split">
      <div className="tool-split-left">
        <label className="tool-label">Input JSON</label>
        <textarea className="tool-textarea tool-mono" value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"key": "value"}' rows={14} />
        <div className="tool-btn-row">
          <button className="tool-run-btn" onClick={() => format(2)}>Format (2 spaces)</button>
          <button className="tool-run-btn tool-btn-secondary" onClick={() => format(4)}>4 spaces</button>
          <button className="tool-run-btn tool-btn-secondary" onClick={minify}>Minify</button>
          <button className="tool-run-btn tool-btn-secondary" onClick={sortKeys}>Sort Keys</button>
        </div>
      </div>
      <div className="tool-split-right">
        <label className="tool-label">Output</label>
        {error && <div className="tool-error">{error}</div>}
        <pre className="tool-output-pre tool-mono">{output || "Formatted JSON will appear here…"}</pre>
        {output && <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>}
      </div>
    </div>
  );
}
