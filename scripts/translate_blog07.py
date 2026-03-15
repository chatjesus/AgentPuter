#!/usr/bin/env python3
"""
用 Vertex AI Gemini 2.5 Pro 翻译 Blog #7 到 7 种语言
按每个 section 独立翻译（7段），避免连接重置
"""
import os, time, re

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/mac/Desktop/AgentPuter/credentials/pdfconverter-415414-6ccc7d166727.json"

from google import genai
from google.genai import types

REGIONS = ["global", "us-central1"]
MODEL = "gemini-2.5-pro"
SOURCE = "/Users/mac/Desktop/AgentPuter/src/content/blog/openclaw-creator-joins-openai.md"
BASE_DIR = "/Users/mac/Desktop/AgentPuter/src/content"
SLUG = "openclaw-creator-joins-openai"

LANGUAGES = {
    "zh": {"name": "Chinese Simplified (简体中文)", "dir": "zh-blog"},
    "ja": {"name": "Japanese (日本語)", "dir": "ja-blog"},
    "ko": {"name": "Korean (한국어)", "dir": "ko-blog"},
    "fr": {"name": "French (Français)", "dir": "fr-blog"},
    "de": {"name": "German (Deutsch)", "dir": "de-blog"},
    "es": {"name": "Spanish (Español)", "dir": "es-blog"},
    "pt-br": {"name": "Brazilian Portuguese (Português Brasileiro)", "dir": "pt-br-blog"},
}

BRAND_NAMES = "OpenClaw, OpenAI, AgentPuter, GitHub, Anthropic, Claude, Meta, Google, Gemini, Microsoft, Copilot, Kubernetes, Linux, Red Hat, Moltbook, ClawHub, Frontier, Android, Chrome, Chromium, GKE, EKS, AKS, SOC 2, SAML, SSO, CVE-2026-25253, CVSS, Fortune 500, CISO, HP, Intuit, Oracle, State Farm, Thermo Fisher, Uber, IBM, SecurityScorecard, Peter Steinberger, Sam Altman, Mark Zuckerberg, Satya Nadella, Guido van Rossum, Brendan Eich"

def get_client(region):
    return genai.Client(
        vertexai=True,
        project="pdfconverter-415414",
        location=region,
    )

def safe_write(path, content):
    if isinstance(content, bytes):
        content = content.decode('utf-8')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def split_by_sections(text):
    """按 ## 标题拆分，frontmatter 作为第一段"""
    # 提取 frontmatter
    fm_end = text.find('---', text.find('---') + 3)
    frontmatter = text[:fm_end + 3]
    body = text[fm_end + 3:]
    
    # 按 ## 拆分
    sections = re.split(r'(?=\n## )', body)
    sections = [s.strip() for s in sections if s.strip()]
    
    # frontmatter 和第一个 section 合并
    parts = [frontmatter + "\n\n" + sections[0]]
    parts.extend(sections[1:])
    
    return parts

def make_prompt(text_part, lang_name, part_num, total_parts, is_first):
    fm_note = ""
    if is_first:
        fm_note = """
YAML FRONTMATTER: Translate title and description. Keep date, author ("AgentPuter Lab"), readingTime, tags array format, and featured UNCHANGED. Only translate generic tag values, keep brand names in English."""

    return f"""Translate to {lang_name}. Part {part_num}/{total_parts}.

RULES:
- Raw Markdown only. No code fences. No explanations.
- Keep ALL formatting: ##, **, ---, `code`, numbered lists.
- NEVER translate: {BRAND_NAMES}
- Complete translation, no truncation.{fm_note}

TEXT:
{text_part}"""

def translate_part(prompt, region_idx=0):
    """翻译一段，轮换 region 重试"""
    for attempt in range(4):
        region = REGIONS[attempt % len(REGIONS)]
        try:
            c = get_client(region)
            response = c.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    max_output_tokens=4096,
                    top_p=0.95,
                ),
            )
            text = response.text
            if not text or len(text) < 50:
                print(f"短", end="", flush=True)
                time.sleep(5)
                continue
            if text.startswith("```"):
                lines = text.split('\n')
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = '\n'.join(lines)
            return text
        except Exception as e:
            err = str(e)[:60]
            print(f" [{region}:{err}]", end="", flush=True)
            if attempt < 3:
                time.sleep(10 * (attempt + 1))
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
            time.sleep(3)
    
    full = "\n\n---\n\n".join(translated)
    out_path = os.path.join(BASE_DIR, lang_info["dir"], f"{SLUG}.md")
    safe_write(out_path, full)
    print(f"    => {out_path}")
    return True

def main():
    print(f"模型: {MODEL} | 区域: {', '.join(REGIONS)}")
    
    with open(SOURCE, 'r', encoding='utf-8') as f:
        source = f.read()
    
    parts = split_by_sections(source)
    print(f"源文章分成 {len(parts)} 段: {[len(p) for p in parts]}\n")
    
    results = {}
    for idx, (code, info) in enumerate(LANGUAGES.items()):
        # 跳过已存在的
        out = os.path.join(BASE_DIR, info["dir"], f"{SLUG}.md")
        if os.path.exists(out) and os.path.getsize(out) > 1000:
            print(f"[{idx+1}/7] {code} 已存在, 跳过")
            results[code] = True
            continue
        
        print(f"[{idx+1}/7] {info['name']}...")
        ok = translate_language(parts, code, info)
        results[code] = ok
        if idx < len(LANGUAGES) - 1:
            time.sleep(8)
    
    print(f"\n{'='*40}")
    for c, ok in results.items():
        s = "✅" if ok else "❌"
        print(f"  {s} {c}")
    
    failed = [c for c, ok in results.items() if not ok]
    if failed:
        print(f"\n失败: {', '.join(failed)}")
    else:
        print("\n全部成功!")

if __name__ == "__main__":
    main()
