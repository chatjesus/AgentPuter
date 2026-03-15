"use client";
import { useState, useRef } from "react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [result, setResult] = useState<{ url: string; origSize: number; newSize: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const compress = async (f: File) => {
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.src = url;
    await new Promise((r) => (img.onload = r));

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", quality));
    URL.revokeObjectURL(url);
    setResult({ url: URL.createObjectURL(blob), origSize: f.size, newSize: blob.size });
  };

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    compress(f);
  };

  const fmt = (n: number) => n < 1024 ? n + " B" : (n / 1024).toFixed(1) + " KB";

  return (
    <div className="tool-stack" style={{ alignItems: "center" }}>
      <div
        className="tool-dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <p>{file ? file.name : "Drop image here or click to select"}</p>
      </div>
      <div className="tool-controls-row">
        <label className="tool-label">Quality: {Math.round(quality * 100)}%</label>
        <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => { setQuality(+e.target.value); if (file) compress(file); }} />
      </div>
      {result && (
        <div className="tool-output" style={{ textAlign: "center" }}>
          <p>Original: <strong>{fmt(result.origSize)}</strong> → Compressed: <strong>{fmt(result.newSize)}</strong> ({Math.round((1 - result.newSize / result.origSize) * 100)}% smaller)</p>
          <a href={result.url} download={`compressed-${file?.name || "image"}.jpg`} className="tool-run-btn" style={{ display: "inline-block", marginTop: 8, textDecoration: "none" }}>Download Compressed Image</a>
        </div>
      )}
    </div>
  );
}
