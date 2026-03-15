#!/usr/bin/env python3
"""
AgentPuter Blog Pipeline — Gemini 3.1 Pro + Google Search Grounding

支持两种认证方式:
  1. Google AI Studio API key (推荐): 设置 GEMINI_API_KEY 或 GOOGLE_API_KEY → 使用 gemini-3.1-pro-preview
  2. Vertex AI: 设置 GOOGLE_APPLICATION_CREDENTIALS → 使用 gemini-2.0-flash (或 BLOG_MODEL 指定)

用法:
  GEMINI_API_KEY=xxx python3 generate_blog.py --topic-id 19
  python3 generate_blog.py --range 19-28
  python3 generate_blog.py --all
  python3 generate_blog.py --topic-id 19 --step outline
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime, timedelta

from google import genai
from google.genai import types

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
TOPICS_FILE = SCRIPT_DIR / "topics.json"
OUTPUT_DIR = SCRIPT_DIR / "output"
BLOG_DIR = PROJECT_ROOT / "src" / "content" / "blog"
ZH_BLOG_DIR = PROJECT_ROOT / "src" / "content" / "zh-blog"

GCP_PROJECT = "pdfconverter-415414"
GCP_LOCATION = "us-central1"

# 认证模式检测
API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
USE_AI_STUDIO = bool(API_KEY)

# 模型选择：API key 用 3.1 Pro，Vertex 用 2.5 Pro；可覆盖
MODEL_ID = os.environ.get("BLOG_MODEL") or (
    "gemini-3.1-pro-preview" if USE_AI_STUDIO else "gemini-2.5-pro"
)

STYLE_SAMPLES_DIR = SCRIPT_DIR / "style_samples"

SYSTEM_PROMPT = """You are a senior technology journalist writing for AgentPuter's blog. Your writing style:

1. NO AI SLANG: Never use "delve", "landscape", "tapestry", "paradigm shift", "game-changer", "revolutionize", "cutting-edge", "harness the power", "at the end of the day", "it's worth noting". 
2. LEAD WITH SPECIFICS: Start with concrete data, a real scenario, or a surprising fact — never with "In today's rapidly evolving..."
3. SHOW, DON'T TELL: Use actual numbers, real user quotes, specific config examples, real GitHub issues. Never make vague claims without evidence.
4. CONVERSATIONAL BUT PRECISE: Write like you're explaining to a smart colleague over coffee. Not academic, not hype-marketing.
5. STRUCTURE: Use clear H2/H3 headers. Mix paragraphs with code blocks, tables, and bullet lists. Keep paragraphs under 4 sentences.
6. ATTRIBUTION: When citing data, link to the source. When quoting users, attribute them.
7. HONEST TRADE-OFFS: Always mention downsides, limitations, and "when NOT to use this".
8. OPINIONATED: Take clear positions backed by evidence. Don't sit on the fence with "it depends on your use case" unless you specify exactly which use cases.

Target audience: Technical professionals (developers, DevOps, product managers) who are evaluating or already using AI agent systems. They appreciate depth but hate fluff."""

OUTLINE_PROMPT_TEMPLATE = """Based on the following topic, generate a detailed article outline.

**Topic:** {title_hint}
**Angle:** {angle}
**Type:** {article_type}

Use Google Search to find the latest real data, community discussions, GitHub issues, benchmark results, and user experiences related to this topic. Ground every section in verifiable facts.

Output format — a structured outline with:
1. Working title (compelling, specific, includes a number or strong hook)
2. Subtitle/description (1-2 sentences for the meta description, under 160 chars)
3. 6-10 H2 sections, each with:
   - Section title
   - 2-3 bullet points of what to cover
   - Specific data points or sources to cite
4. Estimated reading time
5. Suggested tags (5-8)

Search for these topics to ground your outline:
{search_queries}

IMPORTANT: Only include facts you can verify through search. Flag anything uncertain with [NEEDS VERIFICATION]."""

WRITE_PROMPT_TEMPLATE = """Write the full article based on this outline. Follow the style guide in your system prompt precisely.

**Outline:**
{outline}

**Key requirements:**
1. Write in English. Target 2,500-4,000 words.
2. Start with the AgentPuter blog header: `# {{title}}\n\nAgentPuter · {{month}} {{year}} · ~{{reading_time}} · #tags`
3. Include a Sources blockquote at the top with all referenced URLs.
4. Use real data from your searches — specific numbers, dates, versions, prices, benchmark scores.
5. Include 2-4 code blocks where relevant (config examples, CLI commands, code snippets).
6. Include 1-3 comparison tables where they add clarity.
7. End with a reader engagement prompt and a "Next up:" teaser.
8. NO filler paragraphs. Every paragraph must contain information the reader can act on.

Use Google Search to verify any facts you're uncertain about. Do NOT make up statistics or quotes."""

TRANSLATE_PROMPT_TEMPLATE = """Translate this English blog article into Chinese (简体中文).

**Rules:**
1. Keep all code blocks, URLs, and technical terms (model names, tool names, CLI commands) in English.
2. Translate naturally — not word-by-word. Adapt idioms and examples for Chinese readers.
3. Keep the same markdown structure (headers, lists, tables, code blocks).
4. Product names stay English: OpenClaw, TinyClaw, AgentPuter, lossless-claw, etc.
5. Technical terms with established Chinese translations should use the Chinese version with English in parentheses on first use: 上下文窗口 (context window).
6. Keep the Sources blockquote URLs unchanged.
7. The tone should be professional but accessible — like a Chinese tech blog, not a textbook.

**Article to translate:**
{article}"""

REVIEW_PROMPT_TEMPLATE = """Review this article for factual accuracy and writing quality. Use Google Search to verify every claim, statistic, and benchmark number.

**Article:**
{article}

**Check for:**
1. FACTUAL ERRORS: Wrong numbers, outdated info, incorrect attribution, non-existent tools/features
2. UNVERIFIED CLAIMS: Statistics without sources, benchmark scores that can't be confirmed
3. AI VOICE: Phrases that sound AI-generated (see style guide in system prompt)
4. LOGICAL GAPS: Arguments that don't follow, missing context, unexplained jargon
5. MISSING TRADE-OFFS: One-sided coverage without honest limitations

Output a structured review:
- ERRORS: [list of factual errors with corrections]
- WARNINGS: [unverified claims that need sources]
- AI_VOICE: [specific phrases to rewrite]
- SUGGESTIONS: [improvements for clarity or depth]
- VERDICT: PASS / NEEDS_REVISION / MAJOR_ISSUES"""


def load_topics():
    with open(TOPICS_FILE, "r") as f:
        return json.load(f)


def get_client():
    if USE_AI_STUDIO:
        return genai.Client(api_key=API_KEY)
    creds_path = PROJECT_ROOT / "credentials" / "pdfconverter-415414-6ccc7d166727.json"
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(creds_path)
    return genai.Client(
        vertexai=True,
        project=GCP_PROJECT,
        location=GCP_LOCATION,
    )


def load_style_samples():
    """加载已发布文章作为 few-shot 写作风格参考"""
    samples = []
    sample_slugs = [
        "17-lossless-claw.md",
        "18-cost-guide.md",
        "15-openclaw-security.md",
    ]
    for slug in sample_slugs:
        path = BLOG_DIR / slug
        if path.exists():
            content = path.read_text()
            front_end = content.find("---", 3)
            if front_end > 0:
                body = content[front_end + 3:].strip()
                if len(body) > 500:
                    samples.append(body[:3000])
    return samples


MAX_TOKENS_MAP = {
    "gemini-3.1-pro-preview": 65536,
    "gemini-3-flash-preview": 65536,
    "gemini-2.5-pro": 65535,
    "gemini-2.0-flash": 8192,
}


def generate_with_grounding(client, prompt, system=SYSTEM_PROMPT, temperature=1.0):
    """调用 Gemini + Google Search Grounding（带重试）"""
    google_search_tool = types.Tool(google_search=types.GoogleSearch())
    max_tokens = MAX_TOKENS_MAP.get(MODEL_ID, 8192)

    last_err = None
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                    tools=[google_search_tool],
                    temperature=temperature,
                    max_output_tokens=max_tokens,
                ),
            )
            return response.text
        except Exception as e:
            last_err = e
            if attempt < 2:
                wait = (attempt + 1) * 10
                print(f"    [Retry {attempt + 1}/3] {type(e).__name__}, 等待 {wait}s...")
                time.sleep(wait)
            else:
                raise last_err


def step_outline(client, topic, style_samples):
    """Step 1: 联网检索 + 生成大纲"""
    search_queries_str = "\n".join(f"- {q}" for q in topic["search_queries"])

    style_context = ""
    if style_samples:
        style_context = "\n\nHere are excerpts from our published articles for tone/style reference:\n"
        for i, s in enumerate(style_samples):
            style_context += f"\n--- Sample {i+1} (first 3000 chars) ---\n{s}\n"

    prompt = OUTLINE_PROMPT_TEMPLATE.format(
        title_hint=topic["title_hint"],
        angle=topic["angle"],
        article_type=topic["type"],
        search_queries=search_queries_str,
    ) + style_context

    print(f"  [Outline] 联网检索 + 生成大纲...")
    outline = generate_with_grounding(client, prompt)
    return outline


def step_write(client, topic, outline):
    """Step 2: 基于大纲写全文"""
    prompt = WRITE_PROMPT_TEMPLATE.format(outline=outline)

    print(f"  [Write] 生成全文 (EN)...")
    article = generate_with_grounding(client, prompt, temperature=0.8)
    return article


def step_translate(client, article):
    """Step 3: 翻译成中文"""
    prompt = TRANSLATE_PROMPT_TEMPLATE.format(article=article)

    print(f"  [Translate] 翻译中文版...")
    zh_article = generate_with_grounding(client, prompt, temperature=0.5)
    return zh_article


def step_review(client, article):
    """Step 4: 事实核查"""
    prompt = REVIEW_PROMPT_TEMPLATE.format(article=article)

    print(f"  [Review] 联网事实核查...")
    review = generate_with_grounding(client, prompt)
    return review


def make_frontmatter(topic, lang="en"):
    """生成 YAML frontmatter"""
    base_date = datetime(2026, 3, 10)
    offset = topic["id"] - 19
    date = base_date + timedelta(days=offset)
    date_str = date.strftime("%Y-%m-%d")

    fm = {
        "title": topic["title_hint"],
        "description": topic["angle"][:155] + "..." if len(topic["angle"]) > 155 else topic["angle"],
        "date": date_str,
        "author": "AgentPuter Lab",
        "readingTime": "18 min",
        "tags": topic["keywords"],
        "featured": True if topic["id"] <= 24 else False,
    }

    lines = ["---"]
    lines.append(f'title: "{fm["title"]}"')
    lines.append(f'description: "{fm["description"]}"')
    lines.append(f'date: "{fm["date"]}"')
    lines.append(f'author: "{fm["author"]}"')
    lines.append(f'readingTime: "{fm["readingTime"]}"')
    tags_str = json.dumps(fm["tags"], ensure_ascii=False)
    lines.append(f"tags: {tags_str}")
    lines.append(f'featured: {"true" if fm["featured"] else "false"}')
    lines.append("---")
    return "\n".join(lines)


def process_topic(client, topic, steps=("outline", "write", "translate", "review")):
    """处理单个主题的完整管道"""
    topic_id = topic["id"]
    slug = topic["slug"]
    output_dir = OUTPUT_DIR / str(topic_id)
    output_dir.mkdir(parents=True, exist_ok=True)

    style_samples = load_style_samples()

    outline = None
    article_en = None
    article_zh = None
    review_result = None

    # Step 1: Outline
    if "outline" in steps:
        outline_path = output_dir / "outline.md"
        if outline_path.exists():
            print(f"  [Outline] 已存在，跳过 (删除 {outline_path} 可重新生成)")
            outline = outline_path.read_text()
        else:
            outline = step_outline(client, topic, style_samples)
            outline_path.write_text(outline)
            print(f"  [Outline] 已保存 → {outline_path}")

    # Step 2: Write
    if "write" in steps:
        en_path = output_dir / f"{slug}-en.md"
        if en_path.exists():
            print(f"  [Write] 已存在，跳过")
            article_en = en_path.read_text()
        else:
            if outline is None:
                outline_path = output_dir / "outline.md"
                if outline_path.exists():
                    outline = outline_path.read_text()
                else:
                    print(f"  [Write] 需要先生成大纲！跳过")
                    return
            article_en = step_write(client, topic, outline)
            en_path.write_text(article_en)
            print(f"  [Write] 已保存 → {en_path}")

    # Step 3: Translate
    if "translate" in steps:
        zh_path = output_dir / f"{slug}-zh.md"
        if zh_path.exists():
            print(f"  [Translate] 已存在，跳过")
            article_zh = zh_path.read_text()
        else:
            if article_en is None:
                en_path = output_dir / f"{slug}-en.md"
                if en_path.exists():
                    article_en = en_path.read_text()
                else:
                    print(f"  [Translate] 需要先生成英文版！跳过")
                    return
            article_zh = step_translate(client, article_en)
            zh_path.write_text(article_zh)
            print(f"  [Translate] 已保存 → {zh_path}")

    # Step 4: Review
    if "review" in steps:
        review_path = output_dir / "review.md"
        if review_path.exists():
            print(f"  [Review] 已存在，跳过")
            review_result = review_path.read_text()
        else:
            if article_en is None:
                en_path = output_dir / f"{slug}-en.md"
                if en_path.exists():
                    article_en = en_path.read_text()
                else:
                    print(f"  [Review] 需要先生成英文版！跳过")
                    return
            review_result = step_review(client, article_en)
            review_path.write_text(review_result)
            print(f"  [Review] 已保存 → {review_path}")

    return {
        "outline": outline,
        "article_en": article_en,
        "article_zh": article_zh,
        "review": review_result,
    }


def deploy_topic(topic):
    """将生成的文章部署到 blog 目录"""
    topic_id = topic["id"]
    slug = topic["slug"]
    output_dir = OUTPUT_DIR / str(topic_id)

    en_path = output_dir / f"{slug}-en.md"
    zh_path = output_dir / f"{slug}-zh.md"
    review_path = output_dir / "review.md"

    if not en_path.exists():
        print(f"  [Deploy] 英文版不存在，跳过")
        return False

    if review_path.exists():
        review = review_path.read_text()
        if "MAJOR_ISSUES" in review:
            print(f"  [Deploy] 审核发现重大问题，跳过部署。请检查 {review_path}")
            return False

    frontmatter_en = make_frontmatter(topic, "en")
    article_en = en_path.read_text()
    blog_path = BLOG_DIR / f"{topic_id}-{slug}.md"
    blog_path.write_text(frontmatter_en + "\n\n" + article_en)
    print(f"  [Deploy] EN → {blog_path}")

    if zh_path.exists():
        frontmatter_zh = make_frontmatter(topic, "zh")
        article_zh = zh_path.read_text()
        zh_blog_path = ZH_BLOG_DIR / f"{topic_id}-{slug}.md"
        zh_blog_path.write_text(frontmatter_zh + "\n\n" + article_zh)
        print(f"  [Deploy] ZH → {zh_blog_path}")

    return True


def main():
    parser = argparse.ArgumentParser(description="AgentPuter Blog Pipeline")
    parser.add_argument("--topic-id", type=int, help="生成指定 topic ID")
    parser.add_argument("--range", type=str, help="批量生成范围 (e.g. 19-28)")
    parser.add_argument("--all", action="store_true", help="生成全部 20 篇")
    parser.add_argument("--step", type=str, default="all",
                        choices=["outline", "write", "translate", "review", "all"],
                        help="只执行指定步骤")
    parser.add_argument("--deploy", action="store_true", help="将生成的文章部署到 blog 目录")
    parser.add_argument("--dry-run", action="store_true", help="只打印计划，不执行")
    args = parser.parse_args()

    topics = load_topics()
    topic_map = {t["id"]: t for t in topics}

    target_ids = []
    if args.topic_id:
        target_ids = [args.topic_id]
    elif args.range:
        start, end = args.range.split("-")
        target_ids = list(range(int(start), int(end) + 1))
    elif args.all:
        target_ids = [t["id"] for t in topics]
    else:
        parser.print_help()
        return

    steps = ("outline", "write", "translate", "review") if args.step == "all" else (args.step,)

    print(f"\n{'='*60}")
    print(f"AgentPuter Blog Pipeline")
    print(f"Auth: {'Google AI Studio (API key)' if USE_AI_STUDIO else 'Vertex AI'}")
    print(f"Model: {MODEL_ID}")
    print(f"Topics: {target_ids}")
    print(f"Steps: {steps}")
    print(f"Deploy: {args.deploy}")
    print(f"{'='*60}\n")

    if args.dry_run:
        for tid in target_ids:
            if tid in topic_map:
                t = topic_map[tid]
                print(f"  [{tid}] {t['title_hint']} ({t['type']})")
        print(f"\nDry run — 共 {len(target_ids)} 篇，未执行。")
        return

    client = get_client()

    for tid in target_ids:
        if tid not in topic_map:
            print(f"\n[!] Topic ID {tid} 不存在，跳过")
            continue

        topic = topic_map[tid]
        print(f"\n{'─'*60}")
        print(f"[{tid}] {topic['title_hint']}")
        print(f"{'─'*60}")

        try:
            process_topic(client, topic, steps)

            if args.deploy:
                deploy_topic(topic)

        except Exception as e:
            print(f"  [ERROR] {e}")
            import traceback
            traceback.print_exc()

        if tid != target_ids[-1]:
            print(f"  等待 3 秒避免 rate limit...")
            time.sleep(3)

    print(f"\n{'='*60}")
    print(f"完成！输出目录: {OUTPUT_DIR}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
