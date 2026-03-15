"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Translations } from "@/lib/i18n";
import ExitIntentPopup from "./ExitIntentPopup";

interface InteractiveSectionProps {
  t: Translations;
}

const models = [
  { id: "claude", name: "Claude 4.6", icon: "/icons/claude.svg" },
  { id: "gpt", name: "GPT-5.2", icon: "/icons/chatgpt.png" },
  { id: "gemini", name: "Gemini 3", icon: "/icons/gemini.png" },
];

const channels = [
  { id: "telegram", name: "Telegram", icon: "/icons/telegram.png", disabled: false },
  { id: "discord", name: "Discord", icon: "/icons/discord.png", disabled: false },
  { id: "whatsapp", name: "WhatsApp", icon: "/icons/whatsapp.png", disabled: false },
];

export default function InteractiveSection({ t }: InteractiveSectionProps) {
  const [selectedModel, setSelectedModel] = useState("claude");
  const [selectedChannel, setSelectedChannel] = useState("telegram");
  const [slotsLeft, setSlotsLeft] = useState(11);

  useEffect(() => {
    setSlotsLeft([7, 9, 11, 13][Math.floor(Math.random() * 4)]);
  }, []);

  return (
    <>
      {/* 模型选择 */}
      <h2 className="section-heading">{t.models.heading}</h2>
      <div className="cards-row">
        {models.map((m) => (
          <button
            key={m.id}
            className={`card ${selectedModel === m.id ? "selected" : ""}`}
            onClick={() => setSelectedModel(m.id)}
          >
            <div className="card-icon">
              <Image src={m.icon} alt={m.name} width={48} height={48} priority unoptimized />
            </div>
            <div className="card-name">{m.name}</div>
          </button>
        ))}
      </div>

      {/* 渠道选择 */}
      <h2 className="section-heading">{t.channels.heading}</h2>
      <div className="cards-row">
        {channels.map((c) => (
          <button
            key={c.id}
            className={`card ${selectedChannel === c.id ? "selected" : ""} ${c.disabled ? "disabled" : ""}`}
            onClick={() => !c.disabled && setSelectedChannel(c.id)}
          >
            {c.disabled && <span className="card-badge">{t.channels.coming_soon}</span>}
            <div className="card-icon">
              <Image src={c.icon} alt={c.name} width={48} height={48} priority unoptimized />
            </div>
            <div className="card-name">{c.name}</div>
          </button>
        ))}
      </div>

      {/* CTA — 改为 <a> 标签以降低 INP，浏览器可做 native link 预处理 */}
      <div className="cta-area">
        <a
          href="/sign-up"
          className="google-btn"
          onClick={() => {
            localStorage.setItem("tc_model", selectedModel);
            localStorage.setItem("tc_channel", selectedChannel);
          }}
        >
          <Image
            src="/icons/google-g.png"
            alt="Google"
            width={18}
            height={18}
            priority
            unoptimized
          />
          {t.cta.button}
        </a>
        <p className="cta-note">
          {t.cta.note}<br />
          <strong>{t.cta.slots.replace("{count}", String(slotsLeft))}</strong>
        </p>
      </div>

      {/* 挽留弹窗 */}
      <ExitIntentPopup
        onDeploy={() => {
          localStorage.setItem("tc_model", selectedModel);
          localStorage.setItem("tc_channel", selectedChannel);
          window.location.href = "/sign-up";
        }}
      />
    </>
  );
}
