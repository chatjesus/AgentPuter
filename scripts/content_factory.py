#!/usr/bin/env python3
"""
Content Factory — 批量生成 SEO 优化博客文章
用 Vertex AI Gemini 2.5 Pro，从 topic_matrix.json 读取主题，输出到 src/content/blog/

用法:
  python scripts/content_factory.py                    # 生成所有待处理主题
  python scripts/content_factory.py --batch 5          # 每批 5 篇
  python scripts/content_factory.py --category howto   # 只生成 howto 类别
  python scripts/content_factory.py --dry-run          # 预览不实际生成
"""
import os, json, time, sys, argparse, re
from datetime import datetime

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/mac/Desktop/AgentPuter/credentials/pdfconverter-415414-6ccc7d166727.json"

from google import genai
from google.genai import types

REGIONS = ["us-central1", "global", "europe-west4", "us-east4", "us-west1", "us-east1"]
MODEL = "gemini-2.5-pro"
PROJECT = "pdfconverter-415414"
BASE_DIR = "/Users/mac/Desktop/AgentPuter/src/content/blog"
MATRIX_PATH = "/Users/mac/Desktop/AgentPuter/scripts/topic_matrix.json"
TOOLS_DOMAIN = "https://tinyclaw.dev/tools"
BLOG_DOMAIN = "https://agentputer.com/blog"

TOOL_SLUGS = [
    "json-formatter", "base64-encoder", "qr-code-generator", "word-counter",
    "color-picker", "markdown-preview", "uuid-generator", "image-compressor",
    "pdf-to-image", "image-to-pdf", "ai-rewriter", "ai-summarizer",
    "ai-translator", "ai-email-writer", "ai-code-explainer", "ai-regex-generator",
    "ai-sql-generator", "ai-resume-optimizer", "telegram-bot-checker",
    "ai-agent-cost-calculator", "cron-expression-generator", "api-health-checker",
]

BRANDS_LIST = "OpenClaw,OpenAI,AgentPuter,TinyClaw,GitHub,Anthropic,Claude,Meta,Google,Gemini,Microsoft,Copilot,Docker,Hetzner,Telegram,WhatsApp,Discord,Slack"


def get_client(region):
    return genai.Client(vertexai=True, project=PROJECT, location=region)


def load_matrix():
    with open(MATRIX_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_existing_slugs():
    if not os.path.isdir(BASE_DIR):
        os.makedirs(BASE_DIR, exist_ok=True)
        return set()
    return {f.replace(".md", "") for f in os.listdir(BASE_DIR) if f.endswith(".md")}


def pick_internal_links(slug, category):
    """选择 2-3 个相关的工具页面链接"""
    links = []
    kw = slug.lower()
    for ts in TOOL_SLUGS:
        overlap = set(ts.split("-")) & set(kw.split("-"))
        if len(overlap) > 0:
            links.append(f"{TOOLS_DOMAIN}/{ts}")
        if len(links) >= 3:
            break
    if len(links) < 2:
        if "ai" in kw or "agent" in kw:
            links.append(f"{TOOLS_DOMAIN}/ai-agent-cost-calculator")
        if "telegram" in kw:
            links.append(f"{TOOLS_DOMAIN}/telegram-bot-checker")
        if "code" in kw or "dev" in kw:
            links.append(f"{TOOLS_DOMAIN}/ai-code-explainer")
        if "email" in kw:
            links.append(f"{TOOLS_DOMAIN}/ai-email-writer")
    return links[:3]


def build_prompt(topic, category_label, internal_links):
    links_str = "\n".join([f"- {l}" for l in internal_links])
    today = datetime.now().strftime("%Y-%m-%d")
    return f"""Write a high-quality, SEO-optimized blog article in English.

Topic: {topic['keyword']}
Suggested title: {topic['title_hint']}
Category: {category_label}
Date: {today}

REQUIREMENTS:
1. Start with YAML frontmatter (title, description, date, author: "AgentPuter Lab", readingTime, tags array, featured: false)
2. Length: 1500-2500 words minimum. Be comprehensive and detailed.
3. Include a compelling introduction that hooks the reader.
4. Use proper Markdown: ## for H2, ### for H3, **bold**, `code`, tables where appropriate.
5. Include practical examples, code snippets, or step-by-step instructions where relevant.
6. Naturally mention OpenClaw and TinyClaw where appropriate (this is an AI agent platform).
7. End with a clear conclusion and a call-to-action pointing to TinyClaw (https://tinyclaw.dev).
8. Include an FAQ section at the end with 3-5 questions (good for Google featured snippets).
9. Naturally link to these tools within the article:
{links_str}
10. Never translate these brand names: {BRANDS_LIST}
11. Write in an engaging, informative tone — like a knowledgeable friend explaining technology.
12. Include a table of contents after the introduction.
13. Output raw Markdown ONLY. No code fences around the entire output.
14. Do NOT start with ```markdown or end with ```.

IMPORTANT: The article must be genuinely useful and informative. Do not be generic — include specific details, numbers, comparisons, and actionable advice."""


REVIEW_MODEL = "gemini-3-flash-preview"


def call_vertex(model, prompt, max_tokens=8192, temp=0.7):
    """统一 Vertex AI 调用，带区域轮换和重试"""
    for attempt in range(8):
        region = REGIONS[attempt % len(REGIONS)]
        try:
            client = get_client(region)
            resp = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=temp,
                    max_output_tokens=max_tokens,
                    top_p=0.95,
                ),
            )
            text = resp.text
            if not text or len(text) < 50:
                time.sleep(5)
                continue
            return text
        except Exception as e:
            print(f"x", end="", flush=True)
            time.sleep(min(8 * (attempt + 1), 60))
    return None


def review_article(text, topic):
    """用 Flash 模型评审文章质量，返回 (pass, feedback)"""
    prompt = f"""You are a strict content quality reviewer for a tech blog.
Review this article and score it on these criteria (1-10 each):

1. ACCURACY: Are claims factual? No hallucinated features or wrong numbers?
2. DEPTH: Does it go beyond surface-level? Specific examples, code, data?
3. ORIGINALITY: Does it avoid generic AI-generated filler paragraphs?
4. SEO: Proper headings, FAQ section, internal links present?
5. READABILITY: Good flow, no repetition, engaging tone?

Target keyword: {topic['keyword']}

ARTICLE:
{text[:6000]}

Respond in this EXACT format:
ACCURACY: [1-10]
DEPTH: [1-10]
ORIGINALITY: [1-10]
SEO: [1-10]
READABILITY: [1-10]
TOTAL: [sum/50]
PASS: [YES/NO]
FEEDBACK: [1-2 sentences if NO, explaining what to fix]"""

    result = call_vertex(REVIEW_MODEL, prompt, max_tokens=500, temp=0.2)
    if not result:
        return True, "Review unavailable, auto-pass"

    passed = "PASS: YES" in result.upper()
    total_match = re.search(r"TOTAL:\s*(\d+)", result)
    total = int(total_match.group(1)) if total_match else 0

    if total >= 35:
        passed = True

    feedback_match = re.search(r"FEEDBACK:\s*(.+)", result, re.DOTALL)
    feedback = feedback_match.group(1).strip() if feedback_match else ""

    return passed, f"Score: {total}/50 | {feedback}"


def generate_article(topic, category_label, internal_links):
    prompt = build_prompt(topic, category_label, internal_links)

    for round_num in range(3):
        if round_num > 0:
            print(f"\n    [Rewrite #{round_num}]", end="", flush=True)

        text = call_vertex(MODEL, prompt, max_tokens=8192, temp=0.7)
        if not text or len(text) < 500:
            print(f"  (too short)", end="", flush=True)
            continue

        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines)

        if not text.startswith("---"):
            print(f"  (no frontmatter)", end="", flush=True)
            continue

        print(f" [reviewing]", end="", flush=True)
        passed, feedback = review_article(text, topic)
        print(f" {feedback[:60]}", end="", flush=True)

        if passed:
            return text

        prompt = f"""{prompt}

IMPORTANT REVISION NOTE: A reviewer rejected the previous version with this feedback:
"{feedback}"
Please write an improved version addressing this feedback. Be more specific, add real examples, avoid generic filler."""

    return text if text and len(text) > 500 else None


def main():
    parser = argparse.ArgumentParser(description="Content Factory — 批量生成博客")
    parser.add_argument("--batch", type=int, default=0, help="每批生成数量 (0=全部)")
    parser.add_argument("--category", type=str, default="", help="只生成指定类别")
    parser.add_argument("--interval", type=int, default=30, help="文章间隔秒数")
    parser.add_argument("--dry-run", action="store_true", help="预览不实际生成")
    args = parser.parse_args()

    matrix = load_matrix()
    existing = get_existing_slugs()

    pending = []
    for cat_key, cat_data in matrix["categories"].items():
        if args.category and cat_key != args.category:
            continue
        for topic in cat_data["topics"]:
            if topic["slug"] not in existing:
                pending.append((cat_key, cat_data["label"], topic))

    print(f"模型: {MODEL}")
    print(f"已有文章: {len(existing)}")
    print(f"待生成: {len(pending)}")
    if args.batch > 0:
        pending = pending[:args.batch]
        print(f"本批处理: {len(pending)}")
    print()

    if args.dry_run:
        for cat_key, cat_label, topic in pending:
            links = pick_internal_links(topic["slug"], cat_key)
            print(f"  [{cat_key}] {topic['slug']}")
            print(f"    title: {topic['title_hint']}")
            print(f"    links: {links}")
        print(f"\n预览完成，共 {len(pending)} 篇")
        return

    ok = 0
    fail = 0

    for i, (cat_key, cat_label, topic) in enumerate(pending):
        slug = topic["slug"]
        out_path = os.path.join(BASE_DIR, f"{slug}.md")
        links = pick_internal_links(slug, cat_key)

        print(f"[{i+1}/{len(pending)}] {slug}")
        print(f"  类别: {cat_label}")
        print(f"  链接: {links}")

        text = generate_article(topic, cat_label, links)
        if text is None:
            print(f"  ❌ FAILED")
            fail += 1
            continue

        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)

        word_count = len(text.split())
        print(f"  ✅ {len(text)} chars, ~{word_count} words → {out_path}")
        ok += 1

        if i < len(pending) - 1:
            print(f"  (waiting {args.interval}s…)")
            time.sleep(args.interval)

    print(f"\n{'='*50}")
    print(f"完成: ✅ {ok} 篇  ❌ {fail} 篇")
    print(f"博客目录文章总数: {len(get_existing_slugs())}")


if __name__ == "__main__":
    main()
