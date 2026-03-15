#!/usr/bin/env python3
"""
update_lang_pages.py
Inject ScenarioCards into all lang/features.astro pages
and EngineCards into all lang/tools.astro pages.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
PAGES = ROOT / "src" / "pages"
LANGS = ["zh", "de", "es", "fr", "ja", "ko", "pt-br", "ru"]

def update_features_page(lang: str):
    path = PAGES / lang / "features.astro"
    if not path.exists():
        print(f"  SKIP {lang}/features.astro (not found)")
        return

    content = path.read_text(encoding="utf-8")

    # Skip if already updated
    if "ScenarioCards" in content:
        print(f"  SKIP {lang}/features.astro (already has ScenarioCards)")
        return

    # Find the last import line in frontmatter
    import_line = f"import ScenarioCards from '../../components/{lang}/features/ScenarioCards.astro';"

    # Add import after FeaturesCTA import
    content = re.sub(
        r"(import FeaturesCTA from '../../components/{}/features/FeaturesCTA.astro';)".format(lang),
        r"\1\n" + import_line,
        content
    )

    # Inject component after FeaturesHero
    content = content.replace(
        "<FeaturesHero />",
        "<FeaturesHero />\n    <ScenarioCards />"
    )

    path.write_text(content, encoding="utf-8")
    print(f"  Updated {lang}/features.astro")


def update_tools_page(lang: str):
    path = PAGES / lang / "tools.astro"
    if not path.exists():
        print(f"  SKIP {lang}/tools.astro (not found)")
        return

    content = path.read_text(encoding="utf-8")

    # Skip if already updated
    if "EngineCards" in content:
        print(f"  SKIP {lang}/tools.astro (already has EngineCards)")
        return

    # Add import after MatrixRain import
    engine_import = f"import EngineCards from '../../components/{lang}/tools/EngineCards.astro';"

    content = re.sub(
        r"(import MatrixRain from '../../components/MatrixRain.astro';)",
        r"\1\n" + engine_import,
        content
    )

    # Inject EngineCards before the comparison section or after the hero section
    # Look for the scrolling ticker section or the comparison section
    if "<!-- Traditional vs" in content:
        content = content.replace(
            "<!-- Traditional vs",
            "<EngineCards />\n\n    <!-- Traditional vs"
        )
    elif "<!-- Use Case" in content:
        content = content.replace(
            "<!-- Use Case",
            "<EngineCards />\n\n    <!-- Use Case"
        )
    else:
        # Fallback: add after the scrolling ticker section
        content = content.replace(
            "<!-- Scrolling Use Case Ticker -->",
            "<!-- Engine Cards -->\n    <EngineCards />\n\n    <!-- Scrolling Use Case Ticker -->"
        )

    path.write_text(content, encoding="utf-8")
    print(f"  Updated {lang}/tools.astro")


if __name__ == "__main__":
    for lang in LANGS:
        print(f"Processing {lang}...")
        update_features_page(lang)
        update_tools_page(lang)
    print("\nDone!")
