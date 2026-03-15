#!/usr/bin/env python3
"""
i18n_full_update.py �?Full i18n pipeline for AgentPuter features/tools redesign

Tasks:
  1. Fix all lang features.astro (remove UseCases/ComparisonTable/Architecture/SecurityTrust)
  2. Translate and create 5 scenario detail pages for each of 9 languages
     using Gemini 3 Flash (gemini-3-flash-preview)

Usage:
  python scripts/i18n_full_update.py --key YOUR_GEMINI_API_KEY
  (or set GEMINI_API_KEY env variable)
"""

import os, sys, re, time, argparse
from pathlib import Path

# ─── Config ────────────────────────────────────────────────────────────────────

LANGUAGES = {
    "de":    "German",
    "es":    "Spanish",
    "fr":    "French",
    "ja":    "Japanese",
    "ko":    "Korean",
    "pt-br": "Brazilian Portuguese",
    "ru":    "Russian",
    "zh":    "Chinese Simplified",
    "zh-tw": "Chinese Traditional (Taiwan)",
}

SCENARIO_SLUGS = [
    "financial-report",
    "design-poster",
    "system-diagram",
    "audio-production",
    "tech-docs",
]

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Task 1: Fix lang features pages ───────────────────────────────────────────

REMOVE_IMPORTS = [
    "UseCases",
    "ComparisonTable",
    "Architecture",
    "SecurityTrust",
]

def fix_lang_features_page(lang: str):
    """Remove the 4 bloated sections from a lang features.astro."""
    path = BASE_DIR / "src" / "pages" / lang / "features.astro"
    if not path.exists():
        print(f"  [SKIP] {path} not found")
        return False

    content = path.read_text(encoding="utf-8", errors="replace")
    original = content

    for comp in REMOVE_IMPORTS:
        # Remove import line
        content = re.sub(
            rf"import {comp} from '[^']+';?\n",
            "",
            content,
        )
        # Remove JSX usage  <UseCases /> or <UseCases/>
        content = re.sub(
            rf"\s*<{comp}\s*/>\n?",
            "\n",
            content,
        )

    if content != original:
        path.write_text(content, encoding="utf-8")
        print(f"  [OK]   Fixed {lang}/features.astro")
        return True
    else:
        print(f"  [--]   {lang}/features.astro already clean")
        return False


def fix_all_features_pages():
    print("\n=== Task 1: Fix lang features pages ===")
    for lang in LANGUAGES:
        fix_lang_features_page(lang)


# ─── Task 2: Translate scenario detail pages ───────────────────────────────────

TRANSLATION_SYSTEM_PROMPT = """You are an expert web developer and translator.
You translate Astro web pages from English to the target language.

PRESERVE EXACTLY (do NOT translate these):
- The entire Astro frontmatter block (everything between --- and ---)
- All import statements
- All CSS class names and Tailwind classes
- All CLI commands (lines starting with $ in terminal blocks)
- All file names (*.pdf, *.svg, *.mp3, *.docx, *.wav)
- Technical names: AgentPuter, LibreOffice, Inkscape, Draw.io, sox, ffmpeg,
  ap-docs, ap-design, ap-diagrams, ap-audio
- All Astro/JSX syntax: {}, map(), set:html, etc.
- Color codes (#38BDF8, #A78BFA, etc.)
- All href="..." URL values (but modify path prefixes as instructed below)
- Comment strings that are code labels: // AGENT SESSION LOG, 
  // WHAT THIS SCENARIO SUPPORTS, // OTHER SCENARIOS, // DEPLOY YOUR AGENT,
  // Planning execution sequence, // BUILT-IN ENGINES, etc.
- Timing/stats strings like "elapsed: 1m 47s", "28 pages · 2.4 MB", etc.

TRANSLATE:
- All heading text (h1, h2, h3, h4)
- All paragraph/description text
- Button labels like [GET STARTED], [ALL SCENARIOS]
- The "�?back to features" link text
- User message text inside dialogs
- Agent plan step descriptions (the readable text, not code)
- Capability card titles and descriptions
- CTA section titles and descriptions
- Tag labels like FINANCE, DESIGN, ENGINEERING, AUDIO, DOCS (keep in English)
- Step pills text like "�?Upload CSV / spreadsheet"

LINK RULES (critical):
- href="/features/SLUG" �?href="/LANG_CODE/features/SLUG"
- href="/features" �?href="/LANG_CODE/features"
- href="/tools" �?href="/LANG_CODE/tools"
- href="/pricing" �?href="/LANG_CODE/pricing"
- All https:// links �?unchanged

OUTPUT: Return ONLY the translated Astro code. No markdown fences, no explanation.
"""

def translate_page_with_gemini(client, content: str, lang_code: str, lang_name: str) -> str:
    """Send a page to Gemini 3 Flash (Vertex AI) for translation."""
    from google import genai as google_genai

    prompt = (
        TRANSLATION_SYSTEM_PROMPT
        + f"\n\nTranslate the following Astro page from English to {lang_name}.\n"
        + f"Replace LANG_CODE with: {lang_code}\n\n"
        + content
    )

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt,
                config=google_genai.types.GenerateContentConfig(
                    temperature=0.2,
                    max_output_tokens=8192,
                    system_instruction="You are an expert Astro/web developer and translator.",
                ),
            )
            result = response.text.strip()
            # Strip markdown fences if model added them
            result = re.sub(r'^```[\w]*\n?', '', result)
            result = re.sub(r'\n?```$', '', result.rstrip())
            return result.strip()
        except Exception as e:
            print(f"    [ERR] Attempt {attempt+1}: {e}")
            time.sleep(5 * (attempt + 1))

    raise RuntimeError("Failed to translate after 3 attempts")


def create_lang_scenario_pages(client):
    print("\n=== Task 2: Translate scenario detail pages ===")

    langs_to_process = list(LANGUAGES.items())
    total = len(SCENARIO_SLUGS) * len(langs_to_process)
    done = 0

    for lang_code, lang_name in langs_to_process:
        out_dir = BASE_DIR / "src" / "pages" / lang_code / "features"
        out_dir.mkdir(parents=True, exist_ok=True)

        for slug in SCENARIO_SLUGS:
            done += 1
            src_path = BASE_DIR / "src" / "pages" / "features" / f"{slug}.astro"
            out_path = out_dir / f"{slug}.astro"

            if not src_path.exists():
                print(f"  [SKIP] Source {slug}.astro not found")
                continue

            # Skip already translated files (resume support)
            if out_path.exists() and out_path.stat().st_size > 500:
                print(f"  [{done:02d}/{total}] {slug} -> {lang_code}  [skip]")
                continue

            print(f"  [{done:02d}/{total}] {slug} -> {lang_code} ({lang_name})", end=" ... ")
            sys.stdout.flush()

            content = src_path.read_text(encoding="utf-8")

            try:
                translated = translate_page_with_gemini(client, content, lang_code, lang_name)
                out_path.write_text(translated, encoding="utf-8")
                print("OK")
            except Exception as e:
                print(f"FAILED: {e}")

            # Rate limiting: be nice to the API
            time.sleep(1.5)
        print(f"  [{lang_code}] done")


# ─── Main ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="AgentPuter i18n full update pipeline"
    )
    parser.add_argument(
        "--key", "-k",
        help="Gemini API key (or set GEMINI_API_KEY env var)",
    )
    parser.add_argument(
        "--skip-fix", action="store_true",
        help="Skip Task 1 (fixing features pages)",
    )
    parser.add_argument(
        "--skip-translate", action="store_true",
        help="Skip Task 2 (translating scenario pages)",
    )
    parser.add_argument(
        "--langs", nargs="+",
        help="Only process specific langs (e.g. --langs zh de)",
        choices=list(LANGUAGES.keys()),
    )
    parser.add_argument(
        "--slugs", nargs="+",
        help="Only process specific slugs (e.g. --slugs financial-report)",
        choices=SCENARIO_SLUGS,
    )
    args = parser.parse_args()

    print("AgentPuter i18n Full Update Pipeline")
    print(f"Base dir: {BASE_DIR}")

    # Apply lang/slug filters
    if args.langs:
        for k in list(LANGUAGES.keys()):
            if k not in args.langs:
                del LANGUAGES[k]
    if args.slugs:
        SCENARIO_SLUGS[:] = [s for s in SCENARIO_SLUGS if s in args.slugs]

    # Task 1: Fix features pages
    if not args.skip_fix:
        fix_all_features_pages()

    # Task 2: Translate scenario pages
    if not args.skip_translate:
        api_key = args.key or os.environ.get("GEMINI_API_KEY")
        if not api_key:
            api_key = input("\nEnter your Gemini API key: ").strip()
        if not api_key:
            print("ERROR: Gemini API key required for translation. Use --key or GEMINI_API_KEY env.")
            sys.exit(1)

        try:
            from google import genai as google_genai
            from google.oauth2 import service_account
        except ImportError:
            print("ERROR: google-genai not installed. Run: pip install google-genai")
            sys.exit(1)

        # api_key is treated as path to service account JSON for Vertex AI
        creds_path = api_key  # --key accepts JSON path or raw API key
        if creds_path.endswith(".json") and Path(creds_path).exists():
            print(f"Auth: Vertex AI service account -> {creds_path}")
            creds = service_account.Credentials.from_service_account_file(
                creds_path,
                scopes=["https://www.googleapis.com/auth/cloud-platform"],
            )
            import json
            with open(creds_path) as f:
                sa_data = json.load(f)
            project_id = sa_data.get("project_id", "")
            client = google_genai.Client(
                vertexai=True,
                project=project_id,
                location="global",
                credentials=creds,
            )
        else:
            # Fallback: treat as raw Gemini API key
            print(f"Auth: Gemini API key")
            client = google_genai.Client(api_key=creds_path)

        print(f"Model: gemini-3-flash-preview")

        create_lang_scenario_pages(client)

    print("\nDone.")


if __name__ == "__main__":
    main()
