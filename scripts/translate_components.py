#!/usr/bin/env python3
"""
translate_components.py
Translate ScenarioCards and EngineCards into all supported languages
using Gemini 3 Flash (gemini-3-flash-preview) via Google AI Studio API.

Usage:
  python scripts/translate_components.py --api-key YOUR_GEMINI_API_KEY
  python scripts/translate_components.py  # reads GEMINI_API_KEY env var

Languages: de, es, fr, ja, ko, pt-br, ru, zh
"""

import os
import sys
import json
import time
import argparse
import textwrap
from pathlib import Path

# ──────────────────────────────────────────────
# Source content (English)
# ──────────────────────────────────────────────

SCENARIOS_EN = [
    {
        "slug": "financial-report",
        "icon": "📊",
        "tag": "FINANCE",
        "num": "01",
        "title": "Quarterly Financial Report Automation",
        "subtitle": "Upload data → AI generates charts → Export professional PDF",
        "desc": "Forget manual spreadsheets. AgentPuter reads your data, uses LibreOffice to generate a complete financial report with charts, table of contents, and standard formatting — 28 pages in 2 minutes.",
        "output": "Q1-Financial-Report.pdf · 28 pages",
        "engine": "ap-docs",
    },
    {
        "slug": "design-poster",
        "icon": "🎨",
        "tag": "DESIGN",
        "num": "02",
        "title": "Marketing Poster Batch Generation",
        "subtitle": "One sentence → AI creates design → Export hi-res PNG/SVG",
        "desc": "Describe your theme, brand colors, and copy. AgentPuter calls Inkscape to generate pixel-perfect vector posters with support for batch variant output.",
        "output": "summer-sale-poster.svg · 1920×1080",
        "engine": "ap-design",
    },
    {
        "slug": "system-diagram",
        "icon": "📐",
        "tag": "ENGINEERING",
        "num": "03",
        "title": "System Architecture Auto-Drawing",
        "subtitle": "Describe architecture → AI layouts → Export SVG/PNG",
        "desc": "Describe your microservices, data flows, and network topology in natural language. AgentPuter uses Draw.io CLI to produce precise, professional architecture diagrams.",
        "output": "microservice-arch.svg · Vector editable",
        "engine": "ap-diagrams",
    },
    {
        "slug": "audio-production",
        "icon": "🎵",
        "tag": "AUDIO",
        "num": "04",
        "title": "Podcast & Audio Post-Production",
        "subtitle": "Upload recording → AI denoise & edit → Export broadcast MP3",
        "desc": "Meeting recordings, podcast episodes, course audio — AgentPuter auto-denoises, normalizes volume, and trims silence. One command, professional post-production output.",
        "output": "podcast-ep12-final.mp3 · 128kbps",
        "engine": "ap-audio",
    },
    {
        "slug": "tech-docs",
        "icon": "📝",
        "tag": "DOCS",
        "num": "05",
        "title": "Technical Documentation Generator",
        "subtitle": "API specs → AI formats → Export Word/PDF",
        "desc": "Paste your API definitions, feature specs, or interface descriptions. AgentPuter generates professionally formatted technical documentation with table of contents, compatible with enterprise templates.",
        "output": "api-reference-v2.docx · Enterprise format",
        "engine": "ap-docs",
    },
]

ENGINES_EN = [
    {
        "id": "ap-docs",
        "icon": "📄",
        "name": "ap-docs",
        "underlying": "LibreOffice",
        "badge": "158 ✓",
        "tagline": "Writer · Calc · Impress · Draw — Headless mode",
        "desc": "Full headless control of the LibreOffice suite. Generate Word/Excel/PPT/PDF with macros, templates, and charts. Thousands of validated command sequences.",
        "caps": ["Writer Docs", "Calc Spreadsheets", "Impress Presentations", "Draw Graphics", "PDF Export", "Template Apply"],
        "scenarios": ["Quarterly Reports", "Tech Docs", "Contract Drafting"],
        "see_use_cases": "See use cases →",
    },
    {
        "id": "ap-design",
        "icon": "🎨",
        "name": "ap-design",
        "underlying": "Inkscape",
        "badge": "203 ✓",
        "tagline": "SVG Vector · Poster · Icon · Logo · Pixel Export",
        "desc": "Precise CLI control over SVG nodes, paths, filters, and text layout via Inkscape. Export PNG/SVG/PDF at any resolution, pixel-perfect.",
        "caps": ["SVG Vector Art", "Poster Design", "Icon Generation", "Path Operations", "Filter Effects", "Batch Export"],
        "scenarios": ["Marketing Posters", "Brand Assets", "UI Icons"],
        "see_use_cases": "See use cases →",
    },
    {
        "id": "ap-diagrams",
        "icon": "📐",
        "name": "ap-diagrams",
        "underlying": "Draw.io (diagrams.net)",
        "badge": "138 ✓",
        "tagline": "Flowcharts · Architecture · ER · Sequence · UML",
        "desc": "Programmatically create professional technical diagrams via the draw.io CLI. Built-in AWS/GCP/Azure icon libraries. Supports C4 Model, UML, and more.",
        "caps": ["Microservice Architecture", "Network Topology", "ER Database Diagrams", "Business Flows", "Sequence Diagrams", "UML Class Diagrams"],
        "scenarios": ["System Architecture", "DB Design", "Business Process"],
        "see_use_cases": "See use cases →",
    },
    {
        "id": "ap-audio",
        "icon": "🎵",
        "name": "ap-audio",
        "underlying": "sox + ffmpeg",
        "badge": "141 ✓",
        "tagline": "Denoise · Edit · Convert · Loudness Normalize",
        "desc": "sox handles audio effects and analysis; ffmpeg manages codec and container conversion. Batch processing supported, covering podcasts, courses, and music production.",
        "caps": ["Smart Denoising", "Silence Detection & Trim", "EBU R128 Loudness Norm", "Format Conversion", "Multi-track Mix", "Audio Analysis"],
        "scenarios": ["Podcast Post-Prod", "Course Recording", "Meeting Audio"],
        "see_use_cases": "See use cases →",
    },
]

SECTION_LABELS_EN = {
    "scenario_section_tag": "// SCENARIO SOLUTIONS",
    "scenario_section_title": "Real Problems. Real Output.",
    "scenario_section_desc": "Every feature is a complete workflow — from your request to a downloadable file. No hallucinations, no summaries. Real files from real software.",
    "engine_section_tag": "// BUILT-IN ENGINES",
    "engine_section_title": "4 Software Engines. 640+ Validated Commands.",
    "engine_section_desc": "Every AgentPuter capability is powered by a real software engine — controlled via CLI, not GUI screenshots. Stable APIs, real file output, fully local processing.",
    "engine_stat_1": "validated command sequences",
    "engine_stat_2": "engines covering core scenarios",
    "engine_stat_3": "local processing",
    "why_cli_tag": "// WHY CLI, NOT GUI?",
    "why_cli_1_title": "Stable API",
    "why_cli_1_desc": "CLI interfaces don't break with UI updates. One integration works long-term. Screenshot-based approaches fail after every software release.",
    "why_cli_2_title": "Precise Control",
    "why_cli_2_desc": "Directly manipulate files, coordinates, and parameters. No visual alignment needed — pixel-perfect output every time.",
    "why_cli_3_title": "Batchable",
    "why_cli_3_desc": "The same command runs 100+ tasks concurrently. GUI automation can only click one thing at a time.",
}

# ──────────────────────────────────────────────
# Language configs
# ──────────────────────────────────────────────

LANGUAGES = {
    "zh": "Simplified Chinese (zh-CN)",
    "de": "German (de)",
    "es": "Spanish (es)",
    "fr": "French (fr)",
    "ja": "Japanese (ja)",
    "ko": "Korean (ko)",
    "pt-br": "Brazilian Portuguese (pt-BR)",
    "ru": "Russian (ru)",
}

# ──────────────────────────────────────────────
# Gemini 3 Flash API call
# ──────────────────────────────────────────────

def call_gemini(api_key: str, prompt: str, retries: int = 3) -> str:
    """Call Gemini 3 Flash via Google AI Studio REST API."""
    import urllib.request
    import urllib.error

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 8192,
        }
    }).encode("utf-8")

    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"  [attempt {attempt+1}/{retries}] Error: {e}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
    raise RuntimeError("Gemini API call failed after all retries")


def translate_json(api_key: str, content: dict | list, lang_name: str) -> dict | list:
    """Translate all string values in a JSON structure to target language."""
    
    # Identify fields that should NOT be translated (technical terms)
    no_translate = {"slug", "icon", "engine", "id", "name", "underlying", "badge",
                    "num", "tag", "color", "colorBg", "colorBorder"}
    
    # For list of dicts, translate each
    if isinstance(content, list):
        return [translate_json(api_key, item, lang_name) for item in content]
    
    if isinstance(content, dict):
        result = {}
        for k, v in content.items():
            if k in no_translate or not isinstance(v, (str, list)):
                result[k] = v
            elif isinstance(v, list):
                result[k] = [translate_json(api_key, item, lang_name) if isinstance(item, dict)
                             else (translate_text(api_key, item, lang_name) if isinstance(item, str) else item)
                             for item in v]
            elif isinstance(v, str):
                result[k] = translate_text(api_key, v, lang_name)
        return result
    
    return content


def translate_text(api_key: str, text: str, lang_name: str) -> str:
    """Translate a single string. Returns original if it's a technical value."""
    # Skip CLI commands, file names, version strings
    if text.startswith("$") or text.startswith("ap-") or ("." in text and "/" in text):
        return text
    
    prompt = textwrap.dedent(f"""
        Translate the following UI text to {lang_name}.
        Rules:
        - Keep product names (AgentPuter, LibreOffice, Inkscape, Draw.io, sox, ffmpeg) unchanged
        - Keep CLI commands (ap-docs, ap-design, ap-diagrams, ap-audio) unchanged
        - Keep file names and extensions unchanged
        - Keep the → arrow character
        - Keep // comment style markers unchanged
        - Output ONLY the translated text, nothing else
        
        Text to translate:
        {text}
    """).strip()
    
    result = call_gemini(api_key, prompt).strip()
    # Clean up any markdown wrapping
    if result.startswith('"') and result.endswith('"'):
        result = result[1:-1]
    return result


def translate_labels(api_key: str, labels: dict, lang_name: str) -> dict:
    """Translate section labels dict."""
    result = {}
    for k, v in labels.items():
        if isinstance(v, str):
            result[k] = translate_text(api_key, v, lang_name)
        else:
            result[k] = v
    return result


# ──────────────────────────────────────────────
# Component generators
# ──────────────────────────────────────────────

TAG_CLASSES = {
    "FINANCE":     ("text-[#38BDF8] bg-[#38BDF8]/10",),
    "DESIGN":      ("text-[#A78BFA] bg-[#A78BFA]/10",),
    "ENGINEERING": ("text-[#FBBF24] bg-[#FBBF24]/10",),
    "AUDIO":       ("text-[#4ADE80] bg-[#4ADE80]/10",),
    "DOCS":        ("text-[#38BDF8] bg-[#38BDF8]/10",),
}

ENGINE_COLORS = {
    "ap-docs":     ("#38BDF8", "rgba(56,189,248,0.08)",  "rgba(56,189,248,0.2)"),
    "ap-design":   ("#A78BFA", "rgba(167,139,250,0.08)", "rgba(167,139,250,0.2)"),
    "ap-diagrams": ("#FBBF24", "rgba(251,191,36,0.08)",  "rgba(251,191,36,0.2)"),
    "ap-audio":    ("#4ADE80", "rgba(74,222,128,0.08)",  "rgba(74,222,128,0.2)"),
}

ENGINE_CMDS = {
    "ap-docs":     ["ap-docs new --type report", "ap-docs chart --data file.csv", "ap-docs export --pdf --toc", "ap-docs macro run --name monthly"],
    "ap-design":   ["ap-design canvas --size 1080x1920", "ap-design text --weight bold --color white", "ap-design export --png 2x", "ap-design batch --variants 10"],
    "ap-diagrams": ["ap-diagrams new --type microservice", "ap-diagrams add node --label 'API Gateway'", "ap-diagrams export --svg --theme dark", "ap-diagrams from-schema --input db.sql"],
    "ap-audio":    ["ap-audio denoise --input raw.wav", "ap-audio loudnorm --target -14 LUFS", "ap-audio convert --mp3 128k", "ap-audio trim --remove-silence"],
}


def gen_scenario_cards(scenarios: list, labels: dict) -> str:
    cards = ""
    for s in scenarios:
        tag_class = TAG_CLASSES.get(s["tag"], ("text-accent bg-accent/10",))[0]
        cards += f"""
        <a
          href={{`/features/{s['slug']}`}}
          class="group flex items-start gap-6 md:gap-8 bg-[#111111] hover:bg-[#161622] border border-[#1E1E2E] hover:border-accent/20 rounded-2xl p-6 md:p-8 transition-all duration-200"
        >
          <div class="shrink-0 flex flex-col items-center gap-2 w-12">
            <span class="text-[#2A2A3A] font-mono text-xs">{s['num']}</span>
            <span class="text-3xl">{s['icon']}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <span class="text-xs font-bold font-mono px-2 py-0.5 rounded {tag_class}">
                {s['tag']}
              </span>
              <span class="text-xs text-[#4A4A6A] font-mono">{s['engine']}</span>
            </div>
            <h3 class="text-white text-lg font-bold mb-1 group-hover:text-accent transition-colors">
              {s['title']}
            </h3>
            <p class="text-[#6B7280] text-sm mb-2">{s['subtitle']}</p>
            <p class="text-[#4B5563] text-sm leading-relaxed hidden md:block">{s['desc']}</p>
          </div>
          <div class="shrink-0 flex flex-col items-end justify-between gap-4 min-w-0">
            <div class="bg-[#0D0D1A] px-3 py-1.5 rounded-lg font-mono text-xs text-[#6B7280] whitespace-nowrap hidden lg:block">
              📄 {s['output']}
            </div>
            <span class="text-[#2A2A3A] group-hover:text-accent transition-colors text-xl">→</span>
          </div>
        </a>"""

    return f"""---
// ScenarioCards — auto-translated by translate_components.py
---

<section class="py-16 lg:py-24">
  <div class="max-w-7xl mx-auto px-6 lg:px-20">
    <div class="mb-12">
      <div class="font-mono text-accent text-xs font-semibold tracking-[0.2em] mb-4">
        {labels['scenario_section_tag']}
      </div>
      <h2 class="text-white text-3xl md:text-4xl font-bold mb-4">
        {labels['scenario_section_title']}
      </h2>
      <p class="text-[#9CA3AF] text-base max-w-2xl">
        {labels['scenario_section_desc']}
      </p>
    </div>
    <div class="flex flex-col gap-4">
      {cards}
    </div>
  </div>
</section>
"""


def gen_engine_cards(engines: list, labels: dict) -> str:
    cards = ""
    for e in engines:
        color, color_bg, color_border = ENGINE_COLORS[e["id"]]
        cmds = ENGINE_CMDS[e["id"]]
        caps_html = "\n              ".join(
            f'<span class="text-xs px-2.5 py-1 rounded font-mono" style="background: {color_bg}; color: {color};">{c}</span>'
            for c in e["caps"]
        )
        scenarios_html = "\n              ".join(
            f'<span class="text-xs text-[#4B5563] border border-[#1E1E2E] px-2 py-0.5 rounded font-mono">{s}</span>'
            for s in e["scenarios"]
        )
        cmds_html = "\n            ".join(
            f'<p class="text-xs"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">{cmd}</span></p>'
            for cmd in cmds
        )
        cards += f"""
        <div
          class="bg-[#0D0D1A] rounded-2xl p-6 md:p-7 border transition-all duration-200 hover:-translate-y-0.5"
          style="border-color: {color_border};"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{e['icon']}</span>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold font-mono text-base" style="color: {color};">{e['name']}</span>
                  <span class="text-xs font-bold font-mono px-2 py-0.5 rounded" style="color: {color}; background: {color_bg};">{e['badge']}</span>
                </div>
                <p class="text-[#4A4A6A] text-xs mt-0.5">{e['underlying']}</p>
              </div>
            </div>
          </div>
          <p class="text-xs font-mono mb-3" style="color: {color}; opacity: 0.7;">{e['tagline']}</p>
          <p class="text-[#6B7280] text-xs leading-relaxed mb-5">{e['desc']}</p>
          <div class="flex flex-wrap gap-2 mb-5">
            {caps_html}
          </div>
          <div class="bg-black/40 rounded-xl p-4 space-y-1.5 mb-5 font-mono">
            {cmds_html}
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap gap-2">
              {scenarios_html}
            </div>
            <a href="/features" class="text-xs font-mono transition-colors" style="color: {color};">{e['see_use_cases']}</a>
          </div>
        </div>"""

    return f"""---
// EngineCards — auto-translated by translate_components.py
---

<section class="py-16 lg:py-24 bg-[#080810]">
  <div class="max-w-7xl mx-auto px-6 lg:px-20">
    <div class="mb-12">
      <div class="font-mono text-accent text-xs font-semibold tracking-[0.2em] mb-4">
        {labels['engine_section_tag']}
      </div>
      <h2 class="text-white text-3xl md:text-4xl font-bold mb-4">
        {labels['engine_section_title']}
      </h2>
      <p class="text-[#9CA3AF] text-base max-w-2xl mb-6">
        {labels['engine_section_desc']}
      </p>
      <div class="flex gap-6 text-xs text-[#4B5563] font-mono">
        <span><span class="text-accent">640+</span> {labels['engine_stat_1']}</span>
        <span><span class="text-accent">4</span> {labels['engine_stat_2']}</span>
        <span><span class="text-accent">100%</span> {labels['engine_stat_3']}</span>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cards}
    </div>
    <div class="mt-12 pt-8 border-t border-[#1E1E2E]">
      <p class="font-mono text-xs text-accent font-bold tracking-widest mb-3">{labels['why_cli_tag']}</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#4B5563] leading-relaxed">
        <div>
          <p class="text-[#94A3B8] font-semibold mb-1">{labels['why_cli_1_title']}</p>
          {labels['why_cli_1_desc']}
        </div>
        <div>
          <p class="text-[#94A3B8] font-semibold mb-1">{labels['why_cli_2_title']}</p>
          {labels['why_cli_2_desc']}
        </div>
        <div>
          <p class="text-[#94A3B8] font-semibold mb-1">{labels['why_cli_3_title']}</p>
          {labels['why_cli_3_desc']}
        </div>
      </div>
      <p class="text-[#2A2A3A] text-xs font-mono mt-4">
        // Based on CLI-Anything by HKUDS Lab (MIT License) · Extended &amp; internalized by AgentPuter
      </p>
    </div>
  </div>
</section>
"""


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Translate AgentPuter components via Gemini 3 Flash")
    parser.add_argument("--api-key", default=os.environ.get("GEMINI_API_KEY", ""), help="Gemini API key")
    parser.add_argument("--lang", default="all", help="Language code to translate (or 'all')")
    parser.add_argument("--dry-run", action="store_true", help="Print output without writing files")
    args = parser.parse_args()

    if not args.api_key:
        print("ERROR: Gemini API key required. Set GEMINI_API_KEY env var or use --api-key")
        sys.exit(1)

    root = Path(__file__).parent.parent  # agentputer-source/
    components_dir = root / "src" / "components"

    langs_to_process = list(LANGUAGES.items()) if args.lang == "all" else [
        (args.lang, LANGUAGES[args.lang]) for _ in [None] if args.lang in LANGUAGES
    ]

    for lang_code, lang_name in langs_to_process:
        print(f"\n{'='*50}")
        print(f"Translating → {lang_name} ({lang_code})")
        print('='*50)

        # Translate scenarios
        print("  Translating scenario cards...")
        scenarios_t = []
        for s in SCENARIOS_EN:
            st = dict(s)
            for field in ["title", "subtitle", "desc", "output"]:
                print(f"    - {field}: {s[field][:40]}...")
                st[field] = translate_text(args.api_key, s[field], lang_name)
            scenarios_t.append(st)
            time.sleep(0.3)

        # Translate engines
        print("  Translating engine cards...")
        engines_t = []
        for e in ENGINES_EN:
            et = dict(e)
            for field in ["tagline", "desc"]:
                print(f"    - {e['id']}.{field}")
                et[field] = translate_text(args.api_key, e[field], lang_name)
            et["caps"] = [translate_text(args.api_key, c, lang_name) for c in e["caps"]]
            et["scenarios"] = [translate_text(args.api_key, s, lang_name) for s in e["scenarios"]]
            et["see_use_cases"] = translate_text(args.api_key, e["see_use_cases"], lang_name)
            engines_t.append(et)
            time.sleep(0.3)

        # Translate section labels
        print("  Translating section labels...")
        labels_t = {}
        for k, v in SECTION_LABELS_EN.items():
            labels_t[k] = translate_text(args.api_key, v, lang_name)
            time.sleep(0.2)

        # Generate component files
        scenario_component = gen_scenario_cards(scenarios_t, labels_t)
        engine_component = gen_engine_cards(engines_t, labels_t)

        if args.dry_run:
            print(f"\n--- ScenarioCards ({lang_code}) preview ---")
            print(scenario_component[:500])
        else:
            # Write ScenarioCards
            sc_dir = components_dir / lang_code / "features"
            sc_dir.mkdir(parents=True, exist_ok=True)
            sc_path = sc_dir / "ScenarioCards.astro"
            sc_path.write_text(scenario_component, encoding="utf-8")
            print(f"  ✓ Written: {sc_path}")

            # Write EngineCards
            ec_dir = components_dir / lang_code / "tools"
            ec_dir.mkdir(parents=True, exist_ok=True)
            ec_path = ec_dir / "EngineCards.astro"
            ec_path.write_text(engine_component, encoding="utf-8")
            print(f"  ✓ Written: {ec_path}")

    print("\n✅ Translation complete!")


if __name__ == "__main__":
    main()
