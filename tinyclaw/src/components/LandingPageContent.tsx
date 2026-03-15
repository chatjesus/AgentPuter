import Image from "next/image";
import type { Translations } from "@/lib/i18n";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import InteractiveSection from "./InteractiveSection";

interface LandingPageContentProps {
  t: Translations;
  locale: string;
}

export default function LandingPageContent({ t, locale }: LandingPageContentProps) {
  const durations = ["45s", "50s", "42s", "48s", "38s"];
  const reverses = [false, true, false, true, false];

  const localeInfo = SUPPORTED_LOCALES.find((l) => l.code === locale);
  const dir = localeInfo?.dir || "ltr";

  return (
    <div className="page-wrapper" dir={dir}>
      {/* 顶栏 — 服务端渲染 */}
      <div className="topbar">
        <span className="topbar-brand">{t.nav.brand}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a
            href="https://agentputer.com/blog"
            className="topbar-link"
            target="_blank"
            rel="noopener noreferrer"
          >{t.nav.blog}</a>
          <a
            href="https://skillsranking.com"
            className="topbar-link"
            target="_blank"
            rel="noopener noreferrer"
          >Skills ↗</a>
          <LanguageSwitcher currentLocale={locale} />
          <a
            href="https://mail.google.com/mail/?view=cm&to=oscarzamora199907@gmail.com&su=TinyClaw+Support+Request&body=Hi+TinyClaw+Team,"
            className="topbar-link"
            target="_blank"
            rel="noopener noreferrer"
          >{t.nav.contact}</a>
        </div>
      </div>

      {/* Hero — LCP 元素，服务端直接输出 HTML */}
      <section className="hero">
        <h1>{t.hero.title_line1}<br />{t.hero.title_line2}</h1>
        <p className="hero-sub">{t.hero.subtitle}</p>
      </section>

      {/* 交互区域 — Client Component（model/channel 选择 + CTA + 挽留弹窗） */}
      <InteractiveSection t={t} />

      {/* Comparison — 服务端渲染 */}
      <section className="comparison-section">
        <div className="comparison-label">{t.comparison.label}</div>
        <h2 className="comparison-title">{t.comparison.title_line1}<br />{t.comparison.title_line2}</h2>
        <div className="comparison-grid">
          <div className="comp-card">
            <div className="comp-card-title">{t.comparison.traditional}</div>
            <ul className="comp-list">
              {t.comparison.steps.map((s, i) => (
                <li key={i}>
                  <span>{s.label}</span>
                  <span className="comp-time">{s.time}</span>
                </li>
              ))}
            </ul>
            <div className="comp-total">
              <span className="comp-total-label">{t.comparison.total}</span>
              <span className="comp-total-value">{t.comparison.total_time}</span>
            </div>
            <p className="comp-note">
              {t.comparison.non_technical_note}
            </p>
          </div>
          <div className="comp-card highlight">
            <div className="comp-card-title">{t.comparison.tinyclaw}</div>
            <div className="tinyclaw-time">{t.comparison.tinyclaw_time}</div>
            <p className="tinyclaw-desc">
              {t.comparison.tinyclaw_desc}
            </p>
            <p className="tinyclaw-subdesc">
              {t.comparison.tinyclaw_subdesc}
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Marquee — 服务端渲染（纯 CSS 动画） */}
      <section className="usecases-section">
        <div className="usecases-heading">
          <h2>{t.usecases.heading}</h2>
        </div>
        <h2 className="usecases-subheading">{t.usecases.subheading}</h2>
        {t.usecases.rows.map((items, ri) => (
          <div className="marquee-wrap marquee-row" key={ri}>
            <div
              className={`marquee-track ${reverses[ri] ? "rev" : ""}`}
              style={{ "--dur": durations[ri] } as React.CSSProperties}
            >
              {[...items, ...items].map((item, i) => (
                <span className="marquee-pill" key={i}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="ps-note">{t.usecases.ps}</p>

      {/* Footer — 服务端渲染 */}
      <footer className="tc-footer">
        <h4>
          {t.footer.built_by} <a href="https://agentputer.com" target="_blank" rel="noopener noreferrer">AgentPuter</a>
          {" · "}
          <a
            href="https://mail.google.com/mail/?view=cm&to=oscarzamora199907@gmail.com&su=TinyClaw+Support+Request&body=Hi+TinyClaw+Team,"
            target="_blank"
            rel="noopener noreferrer"
          >{t.nav.contact}</a>
        </h4>
        <div style={{ marginTop: 12, display: "flex", gap: 16, justifyContent: "center" }}>
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, textDecoration: "none" }}>{t.footer.privacy}</a>
          <a href="/terms" style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, textDecoration: "none" }}>{t.footer.terms}</a>
        </div>
      </footer>
    </div>
  );
}
