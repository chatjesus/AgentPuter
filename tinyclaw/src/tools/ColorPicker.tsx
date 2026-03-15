"use client";
import { useState, useMemo } from "react";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPicker() {
  const [color, setColor] = useState("#4ade80");

  const info = useMemo(() => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { hex: color, rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, r: rgb.r, g: rgb.g, b: rgb.b };
  }, [color]);

  const copyVal = (v: string) => navigator.clipboard.writeText(v);

  return (
    <div className="tool-stack">
      <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 80, height: 80, border: "none", cursor: "pointer", borderRadius: 12 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <input className="tool-input-sm tool-mono" value={color} onChange={(e) => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && setColor(e.target.value)} style={{ width: 120 }} />
        </div>
      </div>
      <div className="tool-stats-grid" style={{ marginTop: 16 }}>
        <div className="tool-stat clickable" onClick={() => copyVal(info.hex)}><span className="tool-stat-num tool-mono">{info.hex}</span><span className="tool-stat-label">HEX (click to copy)</span></div>
        <div className="tool-stat clickable" onClick={() => copyVal(info.rgb)}><span className="tool-stat-num tool-mono" style={{ fontSize: 14 }}>{info.rgb}</span><span className="tool-stat-label">RGB</span></div>
        <div className="tool-stat clickable" onClick={() => copyVal(info.hsl)}><span className="tool-stat-num tool-mono" style={{ fontSize: 14 }}>{info.hsl}</span><span className="tool-stat-label">HSL</span></div>
      </div>
    </div>
  );
}
