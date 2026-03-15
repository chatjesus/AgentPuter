"use client";
import { useState } from "react";

export default function ApiHealthChecker() {
  const [url, setUrl] = useState("https://");
  const [result, setResult] = useState<{ status: number; time: number; ok: boolean; headers: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!url.startsWith("http")) return;
    setLoading(true);
    setError("");
    setResult(null);
    const start = performance.now();
    try {
      const res = await fetch(url, { method: "HEAD", mode: "no-cors", cache: "no-store" });
      const time = Math.round(performance.now() - start);
      const headers = [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join("\n") || "(opaque response — CORS restricted)";
      setResult({ status: res.status || 0, time, ok: res.ok || res.type === "opaque", headers });
    } catch {
      const time = Math.round(performance.now() - start);
      setError(`Failed to reach endpoint (${time}ms). Check URL or CORS settings.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-stack">
      <div style={{ display: "flex", gap: 8 }}>
        <input className="tool-textarea tool-mono" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/health" style={{ flex: 1, padding: 12, fontSize: 14 }} />
        <button className="tool-run-btn" onClick={check} disabled={loading}>{loading ? "…" : "Check"}</button>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {result && (
        <div className="tool-output">
          <div className="tool-stats-grid">
            <div className="tool-stat"><span className="tool-stat-num" style={{ color: result.ok ? "#4ade80" : "#f87171" }}>{result.ok ? "UP ✓" : "DOWN ✗"}</span><span className="tool-stat-label">Status</span></div>
            <div className="tool-stat"><span className="tool-stat-num">{result.status || "—"}</span><span className="tool-stat-label">HTTP Code</span></div>
            <div className="tool-stat"><span className="tool-stat-num">{result.time}ms</span><span className="tool-stat-label">Response Time</span></div>
          </div>
          {result.headers && <pre className="tool-output-pre tool-mono" style={{ marginTop: 8, fontSize: 11 }}>{result.headers}</pre>}
        </div>
      )}
    </div>
  );
}
