"use client";
import { useState, useRef, useEffect } from "react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://tinyclaw.dev");
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrLib, setQrLib] = useState<any>(null);

  useEffect(() => {
    import("qrcode").then((m) => setQrLib(m.default || m)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!qrLib || !canvasRef.current || !text.trim()) return;
    qrLib.toCanvas(canvasRef.current, text, { width: size, margin: 2, color: { dark: "#000", light: "#fff" } });
  }, [qrLib, text, size]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "qrcode.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="tool-stack" style={{ alignItems: "center" }}>
      <textarea className="tool-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter URL, text, or data…" rows={3} />
      <div className="tool-controls-row">
        <label className="tool-label">Size:</label>
        <select className="tool-select" value={size} onChange={(e) => setSize(+e.target.value)}>
          <option value={128}>128px</option>
          <option value={256}>256px</option>
          <option value={512}>512px</option>
        </select>
        <button className="tool-run-btn" onClick={download}>Download PNG</button>
      </div>
      <div className="tool-qr-canvas">
        <canvas ref={canvasRef} />
        {!qrLib && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Loading QR library…</p>}
      </div>
    </div>
  );
}
