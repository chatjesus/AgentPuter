"use client";
import { useState, useRef } from "react";

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [generating, setGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList) => {
    setFiles((prev) => [...prev, ...Array.from(newFiles).filter((f) => f.type.startsWith("image/"))]);
  };

  const generate = async () => {
    if (files.length === 0) return;
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF();
      for (let i = 0; i < files.length; i++) {
        const img = new Image();
        img.src = URL.createObjectURL(files[i]);
        await new Promise((r) => (img.onload = r));
        const w = pdf.internal.pageSize.getWidth() - 20;
        const h = (img.naturalHeight / img.naturalWidth) * w;
        if (i > 0) pdf.addPage();
        pdf.addImage(img.src, "JPEG", 10, 10, w, Math.min(h, pdf.internal.pageSize.getHeight() - 20));
        URL.revokeObjectURL(img.src);
      }
      pdf.save("images-combined.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="tool-stack" style={{ alignItems: "center" }}>
      <div className="tool-dropzone" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
        <p>{files.length > 0 ? `${files.length} image(s) selected` : "Drop images here or click to select"}</p>
      </div>
      {files.length > 0 && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {files.map((f, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={URL.createObjectURL(f)} alt={f.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)" }} />
                <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: -4, right: -4, background: "#f87171", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: 11, cursor: "pointer", color: "#fff", lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
          <button className="tool-run-btn" onClick={generate} disabled={generating}>{generating ? "Generating PDF…" : "Create PDF"}</button>
        </>
      )}
    </div>
  );
}
