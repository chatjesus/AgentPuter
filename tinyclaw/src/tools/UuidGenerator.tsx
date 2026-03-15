"use client";
import { useState, useCallback } from "react";

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, uuidv4));
  const [uppercase, setUppercase] = useState(false);

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, uuidv4));
  }, [count]);

  const display = uuids.map((u) => (uppercase ? u.toUpperCase() : u));

  return (
    <div className="tool-stack">
      <div className="tool-controls-row">
        <label className="tool-label">Count:</label>
        <input type="number" className="tool-input-sm" min={1} max={100} value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, +e.target.value)))} />
        <label className="tool-checkbox"><input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /> Uppercase</label>
        <button className="tool-run-btn" onClick={generate}>Generate</button>
      </div>
      <div className="tool-output">
        <div className="tool-output-header"><span>{uuids.length} UUIDs</span><button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(display.join("\n"))}>Copy All</button></div>
        <pre className="tool-output-pre tool-mono">{display.join("\n")}</pre>
      </div>
    </div>
  );
}
