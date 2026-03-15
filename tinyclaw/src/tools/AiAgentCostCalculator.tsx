"use client";
import { useState, useMemo } from "react";

export default function AiAgentCostCalculator() {
  const [msgs, setMsgs] = useState(1000);
  const [model, setModel] = useState<"claude" | "gpt" | "gemini">("claude");

  const costs = useMemo(() => {
    const tokPerMsg = 500;
    const totalTok = msgs * tokPerMsg;
    const apiCosts: Record<string, number> = { claude: 15, gpt: 10, gemini: 3.5 };
    const apiCost = (totalTok / 1_000_000) * apiCosts[model];
    const vps = 20;
    const dev = 40;
    const maintenance = 10;
    const diy = apiCost + vps + dev + maintenance;
    const tinyclaw = 29.99;
    return {
      apiCost: apiCost.toFixed(2),
      vps: vps.toFixed(2),
      dev: dev.toFixed(2),
      maintenance: maintenance.toFixed(2),
      diyTotal: diy.toFixed(2),
      tinyclaw: tinyclaw.toFixed(2),
      savings: Math.max(0, diy - tinyclaw).toFixed(2),
      savingsPercent: diy > 0 ? Math.round(Math.max(0, (1 - tinyclaw / diy)) * 100) : 0,
    };
  }, [msgs, model]);

  return (
    <div className="tool-stack">
      <div className="tool-controls-row" style={{ flexWrap: "wrap", gap: 12 }}>
        <div>
          <label className="tool-label">Monthly Messages</label>
          <input type="number" className="tool-input-sm" min={100} max={100000} value={msgs} onChange={(e) => setMsgs(+e.target.value)} />
        </div>
        <div>
          <label className="tool-label">AI Model</label>
          <select className="tool-select" value={model} onChange={(e) => setModel(e.target.value as any)}>
            <option value="claude">Claude Sonnet</option>
            <option value="gpt">GPT-4o</option>
            <option value="gemini">Gemini Flash</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div className="tool-output" style={{ borderColor: "rgba(248,113,113,0.3)" }}>
          <h3 style={{ fontSize: 14, marginBottom: 8, color: "#f87171" }}>DIY (Self-Hosted)</h3>
          <div style={{ fontSize: 13, lineHeight: 2, color: "rgba(255,255,255,0.6)" }}>
            API Costs: <strong>${costs.apiCost}</strong><br />
            VPS: <strong>${costs.vps}</strong><br />
            Dev Time: <strong>${costs.dev}</strong><br />
            Maintenance: <strong>${costs.maintenance}</strong>
          </div>
          <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800 }}>${costs.diyTotal}<span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>/mo</span></div>
        </div>
        <div className="tool-output" style={{ borderColor: "rgba(74,222,128,0.3)" }}>
          <h3 style={{ fontSize: 14, marginBottom: 8, color: "#4ade80" }}>TinyClaw (Managed)</h3>
          <div style={{ fontSize: 13, lineHeight: 2, color: "rgba(255,255,255,0.6)" }}>
            All-inclusive<br />
            No DevOps<br />
            24/7 uptime<br />
            All models included
          </div>
          <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800 }}>${costs.tinyclaw}<span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>/mo</span></div>
        </div>
      </div>

      {+costs.savings > 0 && (
        <div style={{ textAlign: "center", marginTop: 12, padding: 12, background: "rgba(74,222,128,0.08)", borderRadius: 12 }}>
          <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 16 }}>Save ${costs.savings}/mo ({costs.savingsPercent}%)</span>
          <br />
          <a href="/sign-up" style={{ color: "#4ade80", fontSize: 13 }}>Start with TinyClaw →</a>
        </div>
      )}
    </div>
  );
}
