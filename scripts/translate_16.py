"""
翻译 16-real-workflows.md → ja/ko/fr/de/es/pt-br/zh/zh-tw
"""
import os, time, threading
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
    "Microsoft,ClawPod,Perplexity,TinyClaw,ClawBot,Mission Control,Reddit"
)
MAX = 500
TIMEOUT = 45

TASKS = [
    ("16-real-workflows", "ja", "Japanese (日本語)", "ja-blog"),
    ("16-real-workflows", "ko", "Korean (한국어)", "ko-blog"),
    ("16-real-workflows", "fr", "French (Français)", "fr-blog"),
    ("16-real-workflows", "de", "German (Deutsch)", "de-blog"),
    ("16-real-workflows", "es", "Spanish (Español)", "es-blog"),
    ("16-real-workflows", "pt-br", "Brazilian Portuguese (Português do Brasil)", "pt-br-blog"),
    ("16-real-workflows", "zh", "Simplified Chinese (简体中文)", "zh-blog"),
    ("16-real-workflows", "zh-tw", "Traditional Chinese (繁體中文, Taiwan standard, zh-TW)", "zh-tw-blog"),
]


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
            model=MODEL, contents=prompt,
            config=types.GenerateContentConfig(temperature=0.2, max_output_tokens=1536, top_p=0.9),
        )
        holder["text"] = resp.text
    except Exception as e:
        holder["error"] = str(e)[:80]


def translate_part(text, lang_name, n, total, is_first):
    fm_note = (
        "\nYAML FRONTMATTER: Translate title and description only. "
        "Keep date, author, readingTime, tags, featured UNCHANGED."
        if is_first else ""
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
        print(f"e", end="", flush=True)
        time.sleep(min(4 * (attempt + 1), 25))
    return None


def translate_file(src_path, lang_name, dst_path):
    with open(src_path, encoding="utf-8") as f:
        content = f.read()
    parts = split_article(content)
    total = len(parts)
    print(f"  {total} parts ", end="", flush=True)
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
    print(f"\n  ✓ {dst_path}")
    return True


if __name__ == "__main__":
    src = os.path.join(BASE_DIR, "blog", "16-real-workflows.md")
    print(f"Source: {src}")
    print(f"File size: {os.path.getsize(src):,} bytes\n")

    for slug, lang_code, lang_name, folder in TASKS:
        dst = os.path.join(BASE_DIR, folder, f"{slug}.md")
        if os.path.exists(dst):
            print(f"[SKIP] {folder}/{slug}.md")
            continue
        print(f"\n[{lang_code.upper()}] {lang_name} ...", flush=True)
        translate_file(src, lang_name, dst)

    print("\n✅ Done!")
