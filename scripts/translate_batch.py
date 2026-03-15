#!/usr/bin/env python3
"""
批量翻译多篇 blog 到多语言
用 Vertex AI gemini-2.5-pro，细粒度分段 (<1400c/段) + 6 区域轮换
"""
import os, time, re, sys

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/mac/Desktop/AgentPuter/credentials/pdfconverter-415414-6ccc7d166727.json"

from google import genai
from google.genai import types

REGIONS = ["us-central1", "global", "europe-west4", "us-east4", "us-west1", "us-east1"]
MODEL = "gemini-3-flash-preview"
BASE_DIR = "/Users/mac/Desktop/AgentPuter/src/content"

LANGUAGES = {
    "ja": {"name": "Japanese (日本語)", "dir": "ja-blog"},
    "ko": {"name": "Korean (한국어)", "dir": "ko-blog"},
    "fr": {"name": "French (Français)", "dir": "fr-blog"},
    "de": {"name": "German (Deutsch)", "dir": "de-blog"},
    "es": {"name": "Spanish (Español)", "dir": "es-blog"},
    "pt-br": {"name": "Brazilian Portuguese (Português Brasileiro)", "dir": "pt-br-blog"},
}

SLUGS = [
    "10-openclaw-review",
    "09-deploy-openclaw",
]

BRANDS = "OpenClaw,OpenAI,AgentPuter,GitHub,Anthropic,Claude,Meta,Google,Gemini,Microsoft,Copilot,Kubernetes,Linux,Red Hat,Moltbook,ClawHub,Frontier,Android,Chrome,Chromium,GKE,EKS,AKS,SOC 2,SAML,SSO,CVE-2026-25253,CVSS,Fortune 500,CISO,HP,Intuit,Oracle,State Farm,Thermo Fisher,Uber,IBM,SecurityScorecard,Peter Steinberger,Sam Altman,Mark Zuckerberg,Satya Nadella,Guido van Rossum,Brendan Eich,Mac mini,VPS,Docker,Hetzner,Railway,Fly.io,Render,ClawPod"

MAX_PART_SIZE = 1400  # 每段最大字符数

def get_client(region):
    return genai.Client(vertexai=True, project="pdfconverter-415414", location=region)

def safe_write(path, content):
    if isinstance(content, bytes):
        content = content.decode("utf-8")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def split_article(text, max_size=MAX_PART_SIZE):
    """按 ## 分 section，再按段落拆到 max_size 以内"""
    fm_end = text.find("---", text.find("---") + 3)
    fm = text[:fm_end + 3]
    body = text[fm_end + 3:]

    # 按 ## 标题分 section
    secs = re.split(r"(?=\n## )", body)
    secs = [s.strip() for s in secs if s.strip()]

    parts = []
    for i, sec in enumerate(secs):
        full = (fm + "\n\n" + sec) if i == 0 else sec
        if len(full) <= max_size:
            parts.append(full)
        else:
            # 按段落拆分
            paras = full.split("\n\n")
            chunk = ""
            for para in paras:
                if chunk and len(chunk) + len(para) + 2 > max_size:
                    parts.append(chunk.strip())
                    chunk = para
                else:
                    chunk = (chunk + "\n\n" + para).strip() if chunk else para
            if chunk.strip():
                parts.append(chunk.strip())

    return parts

def translate_part(text, lang_name, part_num, total, is_first):
    fm_note = "\nYAML FRONTMATTER: Translate title and description only. Keep date, author, readingTime, tags array, featured UNCHANGED." if is_first else ""
    prompt = f"""Translate to {lang_name}. Part {part_num}/{total}.
Rules: Raw Markdown only. No code fences. Preserve ALL formatting (##, **, ---, `, numbered lists, tables).
Never translate brand names: {BRANDS}.
Complete translation, no truncation.{fm_note}

TEXT:
{text}"""

    for attempt in range(12):
        region = REGIONS[attempt % len(REGIONS)]
        try:
            c = get_client(region)
            resp = c.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.3, max_output_tokens=4096, top_p=0.95),
            )
            t = resp.text
            if not t or len(t) < 30:
                time.sleep(5)
                continue
            if t.startswith("```"):
                lines = t.split("\n")
                if lines[0].startswith("```"): lines = lines[1:]
                if lines and lines[-1].strip() == "```": lines = lines[:-1]
                t = "\n".join(lines)
            return t
        except Exception:
            print(f"x", end="", flush=True)
            time.sleep(min(8 * (attempt + 1), 40))
    return None

def translate_file(slug, lang_code, lang_info):
    src_path = os.path.join(BASE_DIR, "blog", f"{slug}.md")
    out_path = os.path.join(BASE_DIR, lang_info["dir"], f"{slug}.md")

    # 跳过已完成
    if os.path.exists(out_path) and os.path.getsize(out_path) > 2000:
        print(f"  已存在，跳过")
        return True

    with open(src_path, "r", encoding="utf-8") as f:
        source = f.read()

    parts = split_article(source)
    print(f"  {len(parts)}段 {[len(p) for p in parts]}")

    translated = []
    for i, part in enumerate(parts):
        pn = i + 1
        print(f"    P{pn}({len(part)})", end="", flush=True)
        result = translate_part(part, lang_info["name"], pn, len(parts), i == 0)
        if result is None:
            print(" FAIL")
            return False
        print(f"✓", end=" ", flush=True)
        translated.append(result)
        if i < len(parts) - 1:
            time.sleep(3)

    full = "\n\n---\n\n".join(translated)
    safe_write(out_path, full)
    print(f"\n    => {out_path} ({len(full)}c)")
    return True

def main():
    print(f"模型: {MODEL} | 区域: {', '.join(REGIONS)}")
    print(f"翻译文章: {SLUGS}")
    print(f"目标语言: {list(LANGUAGES.keys())}\n")

    total_ok = 0
    total_fail = 0

    for slug in SLUGS:
        src = os.path.join(BASE_DIR, "blog", f"{slug}.md")
        if not os.path.exists(src):
            print(f"[SKIP] {slug} 源文件不存在")
            continue

        src_size = os.path.getsize(src)
        print(f"\n{'='*50}")
        print(f"文章: {slug} ({src_size} bytes)")

        for lang_code, lang_info in LANGUAGES.items():
            print(f"\n  [{lang_code}] {lang_info['name']}...")
            ok = translate_file(slug, lang_code, lang_info)
            if ok:
                total_ok += 1
            else:
                total_fail += 1
            time.sleep(5)

    print(f"\n{'='*50}")
    print(f"完成: ✅{total_ok}  ❌{total_fail}")

if __name__ == "__main__":
    main()
