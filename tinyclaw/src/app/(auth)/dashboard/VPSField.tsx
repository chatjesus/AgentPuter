"use client";

import CopyButton from "./CopyButton";

export default function VPSField({
  label,
  value,
  blur,
}: {
  label: string;
  value: string;
  blur?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.35)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 8,
          padding: "10px 12px",
          fontFamily: "monospace",
          fontSize: 13,
          color: "rgba(255,255,255,0.7)",
          ...(blur ? { filter: "blur(4px)", transition: "filter 0.2s" } : {}),
        }}
        onMouseEnter={(e) => blur && (e.currentTarget.style.filter = "none")}
        onMouseLeave={(e) => blur && (e.currentTarget.style.filter = "blur(4px)")}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}
