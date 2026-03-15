"use client";
import { useState, useRef } from "react";

export default function PdfToImage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (file: File) => {
    setLoading(true);
    setImages([]);
    setFileName(file.name);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const urls: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const vp = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas } as any).promise;
        urls.push(canvas.toDataURL("image/png"));
      }
      setImages(urls);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-stack" style={{ alignItems: "center" }}>
      <div className="tool-dropzone" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) convert(f); }}>
        <input ref={inputRef} type="file" accept=".pdf" hidden onChange={(e) => e.target.files?.[0] && convert(e.target.files[0])} />
        <p>{loading ? "Converting…" : fileName || "Drop PDF here or click to select"}</p>
      </div>
      {images.length > 0 && (
        <div className="tool-output" style={{ width: "100%" }}>
          <p style={{ marginBottom: 8 }}>{images.length} page(s) converted</p>
          {images.map((url, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <img src={url} alt={`Page ${i + 1}`} style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} />
              <a href={url} download={`${fileName.replace(".pdf", "")}-page-${i + 1}.png`} className="tool-copy-btn" style={{ display: "inline-block", marginTop: 4 }}>Download Page {i + 1}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
