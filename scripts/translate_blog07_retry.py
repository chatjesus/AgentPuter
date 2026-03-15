#!/usr/bin/env python3
"""重试 de/es 翻译 — 增加重试次数和区域"""
import os, time, re

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/mac/Desktop/AgentPuter/credentials/pdfconverter-415414-6ccc7d166727.json"

from google import genai
from google.genai import types

REGIONS = ["us-central1", "global", "europe-west4", "us-east4"]
MODEL = "gemini-2.5-pro"
SOURCE = "/Users/mac/Desktop/AgentPuter/src/content/blog/openclaw-creator-joins-openai.md"
BASE_DIR = "/Users/mac/Desktop/AgentPuter/src/content"
SLUG = "openclaw-creator-joins-openai"

LANGUAGES = {
    "de": {"name": "German (Deutsch)", "dir": "de-blog"},
    "es": {"name": "Spanish (Español)", "dir": "es-blog"},
}

BRAND_NAMES = "OpenClaw, OpenAI, AgentPuter, GitHub, Anthropic, Claude, Meta, Google, Gemini, Microsoft, Copilot, Kubernetes, Linux, Red Hat, Moltbook, ClawHub, Frontier, Android, Chrome, Chromium, GKE, EKS, AKS, SOC 2, SAML, SSO, CVE-2026-25253, CVSS, Fortune 500, CISO, HP, Intuit, Oracle, State Farm, Thermo Fisher, Uber, IBM, SecurityScorecard, Peter Steinberger, Sam Altman, Mark Zuckerberg, Satya Nadella, Guido van Rossum, Brendan Eich"

def get_client(region):
    return genai.Client(vertexai=True, project="pdfconverter-415414", location=region)

def safe_write(path, content):
    if isinstance(content, bytes):
        content = content.decode('utf-8')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def split_by_sections(text):
    fm_end = text.find('---', text.find('---') + 3)
    frontmatter = text[:fm_end + 3]
    body = text[fm_end + 3:]
    sections = re.split(r'(?=\n## )', body)
    sections = [s.strip() for s in sections if s.strip()]
    parts = [frontmatter + "\n\n" + sections[0]]
    parts.extend(sections[1:])
    return parts

def make_prompt(text_part, lang_name, part_num, total_parts, is_first):
    fm_note = ""
    if is_first:
        fm_note = "\nYAML FRONTMATTER: Translate title and description. Keep date, author, readingTime, tags format, featured UNCHANGED."
    return f"""Translate to {lang_name}. Part {part_num}/{total_parts}.
RULES: Raw Markdown only. No code fences. Keep ALL formatting. NEVER translate: {BRAND_NAMES}. Complete, no truncation.{fm_note}

TEXT:
{text_part}"""

def translate_part(prompt):
    for attempt in range(8):
        region = REGIONS[attempt % len(REGIONS)]
        try:
            c = get_client(region)
            response = c.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.3, max_output_tokens=4096, top_p=0.95),
            )
            text = response.text
            if not text or len(text) < 50:
                time.sleep(5)
                continue
            if text.startswith("```"):
                lines = text.split('\n')
                if lines[0].startswith("```"): lines = lines[1:]
                if lines and lines[-1].strip() == "```": lines = lines[:-1]
                text = '\n'.join(lines)
            return text
        except Exception as e:
            err = str(e)[:50]
            print(f" [{region}:ERR]", end="", flush=True)
            wait = min(8 * (attempt + 1), 40)
            time.sleep(wait)
    return None

def translate_language(parts, lang_code, lang_info):
    translated = []
    for i, part in enumerate(parts):
        pn = i + 1
        print(f"    P{pn}/{len(parts)} ({len(part)}c)", end="", flush=True)
        prompt = make_prompt(part, lang_info["name"], pn, len(parts), i == 0)
        result = translate_part(prompt)
        if result is None:
            print(" FAIL")
            return False
        print(f" ✓({len(result)}c)")
        translated.append(result)
        if i < len(parts) - 1:
            time.sleep(5)
    full = "\n\n---\n\n".join(translated)
    out_path = os.path.join(BASE_DIR, lang_info["dir"], f"{SLUG}.md")
    safe_write(out_path, full)
    print(f"    => {out_path}")
    return True

def main():
    print(f"重试 de/es | 模型: {MODEL} | 区域: {', '.join(REGIONS)}")
    with open(SOURCE, 'r', encoding='utf-8') as f:
        source = f.read()
    parts = split_by_sections(source)
    print(f"段数: {len(parts)} | 段大小: {[len(p) for p in parts]}\n")
    
    for code, info in LANGUAGES.items():
        out = os.path.join(BASE_DIR, info["dir"], f"{SLUG}.md")
        if os.path.exists(out) and os.path.getsize(out) > 3000:
            print(f"{code} 已存在且 >3KB, 跳过")
            continue
        print(f"翻译 {info['name']}...")
        ok = translate_language(parts, code, info)
        print(f"  {'✅' if ok else '❌'} {code}")
        time.sleep(10)

if __name__ == "__main__":
    main()
