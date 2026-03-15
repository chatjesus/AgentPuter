"use client";
import { useState, useMemo } from "react";

const PRESETS: Record<string, string> = {
  "Every minute": "* * * * *",
  "Every hour": "0 * * * *",
  "Every day at midnight": "0 0 * * *",
  "Every Monday 9am": "0 9 * * 1",
  "Every 1st of month": "0 0 1 * *",
  "Every 15 minutes": "*/15 * * * *",
  "Weekdays 8am": "0 8 * * 1-5",
};

function describeCron(expr: string): string {
  const [min, hr, dom, mon, dow] = expr.split(" ");
  const parts: string[] = [];
  if (min === "*" && hr === "*") parts.push("Every minute");
  else if (min === "0" && hr === "*") parts.push("Every hour at minute 0");
  else if (min === "0" && hr === "0") parts.push("At midnight");
  else if (min.startsWith("*/")) parts.push(`Every ${min.slice(2)} minutes`);
  else parts.push(`At ${hr.padStart(2, "0")}:${min.padStart(2, "0")}`);
  if (dom !== "*") parts.push(`on day ${dom}`);
  if (mon !== "*") parts.push(`in month ${mon}`);
  if (dow === "1-5") parts.push("weekdays");
  else if (dow !== "*") parts.push(`day-of-week ${dow}`);
  return parts.join(", ");
}

export default function CronGenerator() {
  const [expr, setExpr] = useState("0 * * * *");
  const desc = useMemo(() => describeCron(expr), [expr]);

  return (
    <div className="tool-stack">
      <div className="tool-controls-row" style={{ flexWrap: "wrap" }}>
        {Object.entries(PRESETS).map(([label, val]) => (
          <button key={val} className={`tool-toggle ${expr === val ? "active" : ""}`} onClick={() => setExpr(val)}>{label}</button>
        ))}
      </div>
      <input className="tool-textarea tool-mono" value={expr} onChange={(e) => setExpr(e.target.value)} style={{ textAlign: "center", fontSize: 22, fontWeight: 700, padding: 16 }} />
      <div className="tool-output"><pre className="tool-output-pre">{desc}</pre></div>
      <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(expr)}>Copy Expression</button>
    </div>
  );
}
