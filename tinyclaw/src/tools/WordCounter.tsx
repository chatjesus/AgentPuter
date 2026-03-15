"use client";
import { useState, useMemo } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const t = text.trim();
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = t ? t.split(/\s+/).length : 0;
    const sentences = t ? (t.match(/[.!?]+/g) || []).length || (t.length > 0 ? 1 : 0) : 0;
    const paragraphs = t ? t.split(/\n\s*\n/).filter(Boolean).length : 0;
    const readingMin = Math.ceil(words / 200);
    return { chars, charsNoSpace, words, sentences, paragraphs, readingMin };
  }, [text]);

  return (
    <div className="tool-stack">
      <textarea className="tool-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type text…" rows={10} />
      <div className="tool-stats-grid">
        <div className="tool-stat"><span className="tool-stat-num">{stats.words}</span><span className="tool-stat-label">Words</span></div>
        <div className="tool-stat"><span className="tool-stat-num">{stats.chars}</span><span className="tool-stat-label">Characters</span></div>
        <div className="tool-stat"><span className="tool-stat-num">{stats.charsNoSpace}</span><span className="tool-stat-label">No Spaces</span></div>
        <div className="tool-stat"><span className="tool-stat-num">{stats.sentences}</span><span className="tool-stat-label">Sentences</span></div>
        <div className="tool-stat"><span className="tool-stat-num">{stats.paragraphs}</span><span className="tool-stat-label">Paragraphs</span></div>
        <div className="tool-stat"><span className="tool-stat-num">{stats.readingMin}m</span><span className="tool-stat-label">Reading Time</span></div>
      </div>
    </div>
  );
}
