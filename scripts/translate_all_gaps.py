#!/usr/bin/env python3
"""
Vertex AI 批量补齐所有缺失翻译。
自动扫描 blog/*.md，对每个文章检查 8 种语言，只翻译缺失的。
"""
import os
import time
import threading

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
    "/Users/mac/Desktop/AgentPuter/credentials/pdfconverter-415414-6ccc7d166727.json"
)
from google import genai
from google.genai import types

REGIONS = ["us-central1", "global", "europe-west4", "us-east4", "us-west1", "us-east1"]
MODEL = "gemini-2.5-pro"
BASE_DIR = "/Users/mac/Desktop/AgentPuter/src/content"
BRANDS = (
    "OpenClaw,AgentPuter,ClawHub,GitHub,OpenAI,Anthropic,Claude,Claude Code,"
    "SOUL.md,IDENTITY.md,USER.md,sessions_spawn,MCP,Mac mini,Gemini,Google,"
    "Microsoft,ClawPod,Perplexity,TinyClaw,ClawBot,lossless-claw,LCM,Ollama"
)
MAX = 500
TIMEOUT = 45

LANGS = [
    ("ja", "Japanese (日本語)", "ja-blog"),
    ("ko", "Korean (한국어)", "ko-blog"),
    ("fr", "French (Français)", "fr-blog"),
    ("de", "German (Deutsch)", "de-blog"),
    ("es", "Spanish (Español)", "es-blog"),
    ("pt-br", "Brazilian Portuguese (Português do Brasil)", "pt-br-blog"),
    ("zh", "Simplified Chinese (简体中文)", "zh-blog"),
    ("zh-tw", "Traditional Chinese (繁體中文, Taiwan standard, zh-TW)", "zh-tw-blog"),
]


def get_blog_slugs():
    blog_dir = os.path.join(BASE_DIR, "blog")
    return [f.replace(".md", "") for f in os.listdir(blog_dir) if f.endswith(".md")]


def find_gaps():
    slugs = get_blog_slugs()
    tasks = []
    for slug in slugs:
        src_en = os.path.join(BASE_DIR, "blog", f"{slug}.md")
        src_zh = os.path.join(BASE_DIR, "zh-blog", f"{slug}.md")
        if not os.path.exists(src_en):
            continue
        for lang_code, lang_name, folder in LANGS:
            dst = os.path.join(BASE_DIR, folder, f"{slug}.md")
            if os.path.exists(dst):
                continue
            if folder == "zh-tw-blog" and os.path.exists(src_zh):
                tasks.append((slug, lang_code, lang_name, folder, src_zh, "zh→zh-tw"))
            else:
                tasks.append((slug, lang_code, lang_name, folder, src_en, "en→" + lang_code))
    return tasks


def split_article(text):
    parts, buf = [], ""
    for line in text.split("\n"):
        if len(buf) + len(line) + 1 > MAX and buf.strip():
            parts.append(buf)
            buf = line + "\n"
        else:
            buf += line + "\n"
    if buf.strip():
        parts.append(buf)
    return parts


def call_api(region, prompt, holder):
    try:
        c = genai.Client(vertexai=True, project="pdfconverter-415414", location=region)
        resp = c.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.2, max_output_tokens=1536, top_p=0.9),
        )
        holder["text"] = resp.text
    except Exception as e:
        holder["error"] = str(e)[:80]


def translate_part(text, lang_name, n, total, is_first, is_zh_to_tw=False):
    if is_zh_to_tw:
        fm_note = "\nYAML FRONTMATTER: Convert title and description to Traditional Chinese. Keep date, author, readingTime, tags, featured UNCHANGED." if is_first else ""
        instr = f"Convert Simplified Chinese to Traditional Chinese (zh-TW). Part {n}/{total}."
    else:
        fm_note = (
            "\nYAML FRONTMATTER: Translate title and description only. "
            "Keep date, author, readingTime, tags, featured UNCHANGED."
            if is_first
            else ""
        )
        instr = f"Translate to {lang_name}. Part {n}/{total}."
    prompt = f"{instr} Raw Markdown only. No code fences. Keep brands: {BRANDS}.{fm_note}\n\nTEXT:\n{text}"
    for attempt in range(20):
        region = REGIONS[attempt % len(REGIONS)]
        holder = {}
        t = threading.Thread(target=call_api, args=(region, prompt, holder))
        t.start()
        t.join(timeout=TIMEOUT)
        if t.is_alive():
            print("T", end="", flush=True)
            time.sleep(3)
            continue
        txt = holder.get("text", "")
        if txt and len(txt) > 10:
            txt = txt.strip()
            if txt.startswith("```"):
                lines = txt.split("\n")
                txt = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
            print("✓", end="", flush=True)
            return txt
        print("e", end="", flush=True)
        time.sleep(min(4 * (attempt + 1), 25))
    return None


def translate_task(slug, lang_name, dst_path, src_path, is_zh_to_tw):
    with open(src_path, encoding="utf-8") as f:
        content = f.read()
    parts = split_article(content)
    total = len(parts)
    print(f"  {total}p ", end="", flush=True)
    translated = []
    for i, part in enumerate(parts):
        r = translate_part(part, lang_name, i + 1, total, i == 0, is_zh_to_tw)
        if r is None:
            print(f"\n  ✗ FAILED at {i+1}/{total}")
            return False
        translated.append(r)
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    with open(dst_path, "w", encoding="utf-8") as f:
        f.write("\n".join(translated))
    print(f"\n  ✓ {os.path.basename(dst_path)}")
    return True


if __name__ == "__main__":
    tasks = find_gaps()
    if not tasks:
        print("✅ 无缺失翻译，全部已覆盖。")
        exit(0)
    print(f"发现 {len(tasks)} 个缺失翻译，开始补齐...\n")
    for slug, lang_code, lang_name, folder, src_path, mode in tasks:
        dst = os.path.join(BASE_DIR, folder, f"{slug}.md")
        print(f"\n{'='*60}")
        print(f"{slug}.md → {folder} ({mode})")
        print(f"{'='*60}")
        print(f"[{lang_code.upper()}] {lang_name} ...", flush=True)
        translate_task(slug, lang_name, dst, src_path, mode.startswith("zh→"))
    print("\n✅ 全部补齐完成！")
