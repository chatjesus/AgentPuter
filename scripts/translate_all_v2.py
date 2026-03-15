"""
翻译脚本 v2（续）：
1. 15-openclaw-security → ja/ko/fr/de/es/pt-br/zh-blog/zh-tw-blog
2. 续翻 zh-tw-blog（11 以后缺失的）
"""
import os, time, re, threading
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
    "Microsoft,ClawPod,Perplexity,TinyClaw,ClawBot"
)
MAX = 500
TIMEOUT = 45

# ─────────────────────────────────────────────
# Task 1: 15-openclaw-security 多语言翻译
# ─────────────────────────────────────────────
SECURITY_TASKS = [
    ("15-openclaw-security", "ja", "Japanese (日本語)", "ja-blog"),
    ("15-openclaw-security", "ko", "Korean (한국어)", "ko-blog"),
    ("15-openclaw-security", "fr", "French (Français)", "fr-blog"),
    ("15-openclaw-security", "de", "German (Deutsch)", "de-blog"),
    ("15-openclaw-security", "es", "Spanish (Español)", "es-blog"),
    ("15-openclaw-security", "pt-br", "Brazilian Portuguese (Português do Brasil)", "pt-br-blog"),
    ("15-openclaw-security", "zh", "Simplified Chinese (简体中文)", "zh-blog"),
]

# ─────────────────────────────────────────────
# Task 2: zh-blog → zh-tw-blog（缺失的繁中）
# ─────────────────────────────────────────────
ZH_TW_REMAINING = [
    "11-model-showdown.md",
    "12-agent-teams.md",
    "13-soul-md.md",
    "14-openclaw-tips.md",
    "agent-needs-its-own-computer.md",
    "agent-skills-ecosystem.md",
    "deep-dive-clawdbot-breakout-agent.md",
    "dissecting-openclaw-architecture.md",
    "openclaw-creator-joins-openai.md",
    "vibe-working-when-agents-work.md",
    "who-makes-money-from-openclaw.md",
]

# ─────────────────────────────────────────────
# Task 3: zh-tw-blog 的 15 文章（两篇）
# ─────────────────────────────────────────────
ZH_TW_15 = [
    "15-perplexity-computer-vs-openclaw.md",
    "15-openclaw-security.md",
]


def split_article(text: str):
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


def call_api(region, prompt, result_holder):
    try:
        c = genai.Client(vertexai=True, project="pdfconverter-415414", location=region)
        resp = c.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2, max_output_tokens=1536, top_p=0.9
            ),
        )
        result_holder["text"] = resp.text
    except Exception as e:
        result_holder["error"] = str(e)[:80]


def translate_part(text, lang_name, n, total, is_first):
    fm_note = (
        "\nYAML FRONTMATTER: Translate title and description only. "
        "Keep date, author, readingTime, tags, featured UNCHANGED."
        if is_first
        else ""
    )
    prompt = (
        f"Translate to {lang_name}. Part {n}/{total}. "
        f"Raw Markdown only. No code fences. Keep brands: {BRANDS}.{fm_note}\n\nTEXT:\n{text}"
    )
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
        err = holder.get("error", "empty")
        print(f"e({err[:20]})", end="", flush=True)
        time.sleep(min(4 * (attempt + 1), 25))
    return None


def translate_file(src_path, lang_name, dst_path):
    with open(src_path, encoding="utf-8") as f:
        content = f.read()
    parts = split_article(content)
    total = len(parts)
    print(f"  {total} parts", end=" ", flush=True)
    translated = []
    for i, part in enumerate(parts):
        r = translate_part(part, lang_name, i + 1, total, i == 0)
        if r is None:
            print(f"\n  ✗ FAILED at part {i+1}/{total}")
            return False
        translated.append(r)
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    with open(dst_path, "w", encoding="utf-8") as f:
        f.write("\n".join(translated))
    print(f"\n  ✓ Written: {dst_path}")
    return True


def s2tw_part(text, n, total, is_first):
    fm_note = (
        "\nYAML FRONTMATTER: Convert title and description to Traditional Chinese. "
        "Keep date, author, readingTime, tags, featured UNCHANGED."
        if is_first
        else ""
    )
    prompt = (
        f"Convert Simplified Chinese to Traditional Chinese (Taiwan standard, zh-TW). "
        f"Part {n}/{total}. Raw Markdown only. No code fences. Keep brands: {BRANDS}.{fm_note}\n\nTEXT:\n{text}"
    )
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
        err = holder.get("error", "empty")
        print(f"e({err[:20]})", end="", flush=True)
        time.sleep(min(4 * (attempt + 1), 25))
    return None


def convert_to_zhtw(src_path, dst_path):
    with open(src_path, encoding="utf-8") as f:
        content = f.read()
    parts = split_article(content)
    total = len(parts)
    print(f"  {total} parts", end=" ", flush=True)
    translated = []
    for i, part in enumerate(parts):
        r = s2tw_part(part, i + 1, total, i == 0)
        if r is None:
            print(f"\n  ✗ FAILED at part {i+1}/{total}")
            return False
        translated.append(r)
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    with open(dst_path, "w", encoding="utf-8") as f:
        f.write("\n".join(translated))
    print(f"\n  ✓ Written: {dst_path}")
    return True


if __name__ == "__main__":
    # ── Task 1: 15-openclaw-security 多语言 ──────────────
    print("=" * 60)
    print("Task 1: 15-openclaw-security → ja/ko/fr/de/es/pt-br/zh")
    print("=" * 60)
    src_security = os.path.join(BASE_DIR, "blog", "15-openclaw-security.md")
    for slug, lang_code, lang_name, folder in SECURITY_TASKS:
        dst = os.path.join(BASE_DIR, folder, f"{slug}.md")
        if os.path.exists(dst):
            print(f"[SKIP] {folder}/{slug}.md already exists")
            continue
        print(f"\n[{lang_code.upper()}] {lang_name} ...", flush=True)
        translate_file(src_security, lang_name, dst)

    # ── Task 2: zh-tw-blog 补全 ───────────────────────────
    print("\n" + "=" * 60)
    print("Task 2: zh-blog → zh-tw-blog（补全剩余）")
    print("=" * 60)
    zh_src_dir = os.path.join(BASE_DIR, "zh-blog")
    zh_tw_dir = os.path.join(BASE_DIR, "zh-tw-blog")

    for fname in ZH_TW_REMAINING:
        src = os.path.join(zh_src_dir, fname)
        dst = os.path.join(zh_tw_dir, fname)
        if not os.path.exists(src):
            print(f"[SKIP] Source not found: {src}")
            continue
        if os.path.exists(dst):
            print(f"[SKIP] {fname} already done")
            continue
        print(f"\n[ZH-TW] {fname} ...", flush=True)
        convert_to_zhtw(src, dst)

    # ── Task 3: zh-tw 15 篇（从英文翻）────────────────────
    print("\n" + "=" * 60)
    print("Task 3: zh-tw-blog 的 Blog#15 文章（繁中）")
    print("=" * 60)
    for fname in ZH_TW_15:
        dst = os.path.join(zh_tw_dir, fname)
        if os.path.exists(dst):
            print(f"[SKIP] {fname} already done")
            continue
        zh_src = os.path.join(zh_src_dir, fname)
        en_src = os.path.join(BASE_DIR, "blog", fname)
        if os.path.exists(zh_src):
            print(f"\n[ZH-TW] {fname} from zh-blog ...", flush=True)
            convert_to_zhtw(zh_src, dst)
        elif os.path.exists(en_src):
            print(f"\n[ZH-TW] {fname} from English ...", flush=True)
            translate_file(en_src, "Traditional Chinese (繁體中文, Taiwan standard, zh-TW)", dst)
        else:
            print(f"[SKIP] No source for {fname}")

    print("\n✅ All done!")
