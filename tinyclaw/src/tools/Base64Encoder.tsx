"use client";
import { useState } from "react";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const run = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setOutput("Error: Invalid input for " + mode);
    }
  };

  return (
    <div className="tool-stack">
      <div className="tool-toggle-row">
        <button className={`tool-toggle ${mode === "encode" ? "active" : ""}`} onClick={() => setMode("encode")}>Encode</button>
        <button className={`tool-toggle ${mode === "decode" ? "active" : ""}`} onClick={() => setMode("decode")}>Decode</button>
      </div>
      <textarea className="tool-textarea tool-mono" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "Text to encode…" : "Base64 to decode…"} rows={6} />
      <button className="tool-run-btn" onClick={run}>{mode === "encode" ? "Encode →" : "← Decode"}</button>
      {output && (
        <div className="tool-output">
          <div className="tool-output-header"><span>Result</span><button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(output)}>Copy</button></div>
          <pre className="tool-output-pre tool-mono">{output}</pre>
        </div>
      )}
    </div>
  );
}
