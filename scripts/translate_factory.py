#!/usr/bin/env python3
"""
Translation Factory — 自动监控新英文 blog 并翻译到 9 种语言
用 Vertex AI Gemini 2.0 Flash (省 credit), 6 区域轮换 + 指数退避

用法:
  python scripts/translate_factory.py                  # 翻译所有缺失的
  python scripts/translate_factory.py --watch          # 持续监控模式
  python scripts/translate_factory.py --slug my-post   # 只翻译指定文章
  python scripts/translate_factory.py --lang ja,ko     # 只翻译指定语言
"""
import os, json, time, re, sys, argparse
from pathlib import Path

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/mac/Desktop/AgentPuter/credentials/pdfconverter-415414-6ccc7d166727.json"

from google import genai
from google.genai import types

REGIONS = ["us-central1", "global", "europe-west4", "us-east4", "us-west1", "us-east1"]
MODEL = "gemini-3-flash-preview"
PROJECT = "pdfconverter-415414"
BASE_DIR = Path("/Users/mac/Desktop/AgentPuter/src/content")

LANGUAGES = {
    "zh": {"name": "Simplified Chinese (简体中文)", "dir": "zh-blog"},
    "zh-tw": {"name": "Traditional Chinese (繁體中文)", "dir": "zh-tw-blog"},
    "ja": {"name": "Japanese (日本語)", "dir": "ja-blog"},
    "ko": {"name": "Korean (한국어)", "dir": "ko-blog"},
    "fr": {"name": "French (Français)", "dir": "fr-blog"},
    "de": {"name": "German (Deutsch)", "dir": "de-blog"},
    "es": {"name": "Spanish (Español)", "dir": "es-blog"},
    "pt-br": {"name": "Brazilian Portuguese (Português Brasileiro)", "dir": "pt-br-blog"},
    "ru": {"name": "Russian (Русский)", "dir": "ru-blog"},
}

BRANDS = "OpenClaw,OpenAI,AgentPuter,TinyClaw,GitHub,Anthropic,Claude,Meta,Google,Gemini,Microsoft,Copilot,Docker,Hetzner,Telegram,WhatsApp,Discord,Slack,Linux,Mac Mini,VPS,MCP"

MAX_PART_SIZE = 2000


def get_client(region):
    return genai.Client(vertexai=True, project=PROJECT, location=region)


def ensure_dirs():
    for lang_info in LANGUAGES.values():
        d = BASE_DIR / lang_info["dir"]
        d.mkdir(parents=True, exist_ok=True)


def get_english_posts():
    blog_dir = BASE_DIR / "blog"
    return sorted([f.stem for f in blog_dir.glob("*.md")])


def get_missing_translations(slug, target_langs=None):
    missing = []
    for lang_code, lang_info in LANGUAGES.items():
        if target_langs and lang_code not in target_langs:
            continue
        out = BASE_DIR / lang_info["dir"] / f"{slug}.md"
        if not out.exists() or out.stat().st_size < 500:
            missing.append((lang_code, lang_info))
    return missing


def split_article(text):
    fm_match = re.match(r"(---\n.*?\n---)", text, re.DOTALL)
    fm = fm_match.group(1) if fm_match else ""
    body = text[len(fm):].strip()

    sections = re.split(r"(?=\n## )", body)
    sections = [s.strip() for s in sections if s.strip()]

    parts = []
    for i, sec in enumerate(sections):
        full = f"{fm}\n\n{sec}" if i == 0 else sec
        if len(full) <= MAX_PART_SIZE:
            parts.append(full)
        else:
            paragraphs = full.split("\n\n")
            chunk = ""
            for p in paragraphs:
                if chunk and len(chunk) + len(p) + 2 > MAX_PART_SIZE:
                    parts.append(chunk.strip())
                    chunk = p
                else:
                    chunk = f"{chunk}\n\n{p}".strip() if chunk else p
            if chunk.strip():
                parts.append(chunk.strip())

    return parts


def translate_part(text, lang_name, part_num, total, is_first):
    fm_note = "\nYAML FRONTMATTER: Translate title and description only. Keep date, author, readingTime, tags, featured UNCHANGED." if is_first else ""
    prompt = f"""Translate to {lang_name}. Part {part_num}/{total}.
Rules: Raw Markdown only. No code fences. Preserve ALL formatting (##, **, ---, `, numbered lists, tables, links).
Never translate brand names: {BRANDS}.
URLs must remain unchanged.
Complete translation, no truncation.{fm_note}

TEXT:
{text}"""

    for attempt in range(10):
        region = REGIONS[attempt % len(REGIONS)]
        try:
            client = get_client(region)
            resp = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    max_output_tokens=4096,
                    top_p=0.95,
                ),
            )
            result = resp.text
            if not result or len(result) < 30:
                time.sleep(3)
                continue
            if result.startswith("```"):
                lines = result.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                result = "\n".join(lines)
            return result
        except Exception as e:
            wait = min(5 * (attempt + 1), 30)
            print(f"x", end="", flush=True)
            time.sleep(wait)
    return None


def translate_file(slug, lang_code, lang_info):
    src_path = BASE_DIR / "blog" / f"{slug}.md"
    out_path = BASE_DIR / lang_info["dir"] / f"{slug}.md"

    source = src_path.read_text(encoding="utf-8")
    parts = split_article(source)
    print(f"    {len(parts)} parts {[len(p) for p in parts]}")

    translated = []
    for i, part in enumerate(parts):
        pn = i + 1
        print(f"      P{pn}({len(part)}c)", end="", flush=True)
        result = translate_part(part, lang_info["name"], pn, len(parts), i == 0)
        if result is None:
            print(" FAIL")
            return False
        print("✓", end=" ", flush=True)
        translated.append(result)
        if i < len(parts) - 1:
            time.sleep(2)

    full = "\n\n".join(translated)
    out_path.write_text(full, encoding="utf-8")
    print(f"\n      → {out_path.name} ({len(full)}c)")
    return True


def run_once(target_slugs=None, target_langs=None):
    ensure_dirs()
    posts = get_english_posts()
    if target_slugs:
        posts = [s for s in posts if s in target_slugs]

    total_ok = 0
    total_fail = 0
    total_skip = 0

    for slug in posts:
        missing = get_missing_translations(slug, target_langs)
        if not missing:
            total_skip += 1
            continue

        print(f"\n{'='*50}")
        print(f"📄 {slug} — {len(missing)} language(s) to translate")

        for lang_code, lang_info in missing:
            print(f"  [{lang_code}] {lang_info['name']}…")
            ok = translate_file(slug, lang_code, lang_info)
            if ok:
                total_ok += 1
            else:
                total_fail += 1
            time.sleep(3)

    print(f"\n{'='*50}")
    print(f"完成: ✅ {total_ok}  ❌ {total_fail}  ⏭️ {total_skip} (已存在)")
    return total_ok, total_fail


def watch_mode(target_langs=None, interval=300):
    print(f"👀 Watch mode — checking every {interval}s for new posts…")
    print(f"   Press Ctrl+C to stop.\n")
    while True:
        try:
            ok, fail = run_once(target_langs=target_langs)
            if ok == 0 and fail == 0:
                print(f"  没有新文章需要翻译，{interval}s 后再检查…")
            time.sleep(interval)
        except KeyboardInterrupt:
            print("\n停止监控。")
            break


def main():
    parser = argparse.ArgumentParser(description="Translation Factory — 自动博客翻译")
    parser.add_argument("--watch", action="store_true", help="持续监控模式")
    parser.add_argument("--slug", type=str, default="", help="只翻译指定 slug")
    parser.add_argument("--lang", type=str, default="", help="只翻译指定语言 (逗号分隔)")
    parser.add_argument("--interval", type=int, default=300, help="Watch 模式检查间隔 (秒)")
    args = parser.parse_args()

    target_slugs = [args.slug] if args.slug else None
    target_langs = args.lang.split(",") if args.lang else None

    print(f"模型: {MODEL}")
    print(f"目标语言: {target_langs or list(LANGUAGES.keys())}")
    print()

    if args.watch:
        watch_mode(target_langs=target_langs, interval=args.interval)
    else:
        run_once(target_slugs=target_slugs, target_langs=target_langs)


if __name__ == "__main__":
    main()
