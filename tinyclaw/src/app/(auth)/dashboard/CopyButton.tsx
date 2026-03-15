"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: "none",
        border: "none",
        color: copied ? "#a78bfa" : "rgba(255,255,255,0.3)",
        fontSize: 11,
        cursor: "pointer",
        fontFamily: "inherit",
        padding: "2px 6px",
        transition: "color 0.2s",
        flexShrink: 0,
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
