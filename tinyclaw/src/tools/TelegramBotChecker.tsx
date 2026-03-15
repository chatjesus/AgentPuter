"use client";
import { useState } from "react";

export default function TelegramBotChecker() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`https://api.telegram.org/bot${token.trim()}/getMe`);
      const data = await res.json();
      if (data.ok) setResult(data.result);
      else setError(data.description || "Invalid token");
    } catch {
      setError("Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-stack">
      <input className="tool-textarea tool-mono" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste your bot token (e.g. 123456789:ABCdefGhIjKlMnOpQrStUvWxYz)" style={{ padding: 12, fontSize: 14 }} />
      <button className="tool-run-btn" onClick={check} disabled={loading || !token.trim()}>{loading ? "Checking…" : "Verify Token"}</button>
      {error && <div className="tool-error">{error}</div>}
      {result && (
        <div className="tool-output">
          <div className="tool-stats-grid">
            <div className="tool-stat"><span className="tool-stat-num">{result.first_name}</span><span className="tool-stat-label">Name</span></div>
            <div className="tool-stat"><span className="tool-stat-num">@{result.username}</span><span className="tool-stat-label">Username</span></div>
            <div className="tool-stat"><span className="tool-stat-num">{result.id}</span><span className="tool-stat-label">Bot ID</span></div>
            <div className="tool-stat"><span className="tool-stat-num">{result.can_join_groups ? "Yes" : "No"}</span><span className="tool-stat-label">Can Join Groups</span></div>
            <div className="tool-stat"><span className="tool-stat-num">{result.supports_inline_queries ? "Yes" : "No"}</span><span className="tool-stat-label">Inline Queries</span></div>
            <div className="tool-stat"><span className="tool-stat-num">{result.can_read_all_group_messages ? "Yes" : "No"}</span><span className="tool-stat-label">Read Group Msgs</span></div>
          </div>
          <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>✅ Token is valid! <a href="/sign-up" style={{ color: "#4ade80" }}>Deploy this bot with TinyClaw →</a></p>
        </div>
      )}
    </div>
  );
}
