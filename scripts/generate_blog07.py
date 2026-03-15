#!/usr/bin/env python3
"""
使用 Vertex AI Gemini 2.5 Pro (global) 分段生成 Blog #7
"""
import os, time

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/mac/Desktop/AgentPuter/credentials/pdfconverter-415414-6ccc7d166727.json"

from google import genai
from google.genai import types

client = genai.Client(
    vertexai=True,
    project="pdfconverter-415414",
    location="global",
)

MODEL = "gemini-2.5-pro"
OUTPUT = "/Users/mac/Desktop/AgentPuter/src/content/blog/openclaw-creator-joins-openai.md"

STYLE_RULES = """WRITING RULES:
- Analytical, not breathless. Breaking news but we lead with ANALYSIS not hype.
- Short paragraphs (2-4 sentences max). Dense with facts.
- Use exact quotes from Sam Altman's tweet and Steinberger's blog post when available.
- Use **bold** for key insights. Use --- between major sections.
- NO bullet-point lists in body (flowing prose). Lists only in "Three Things to Watch" closing.
- Cross-reference previous AgentPuter blog posts naturally.
- DO NOT use AI phrases: "it's worth noting", "rapidly evolving landscape", "paradigm shift", "game-changer", "leveraging", "synergy".
- Write like a human analyst with a strong opinion, not a press release.
- BRAND NAMES never modify: OpenClaw, OpenAI, AgentPuter, GitHub, Anthropic, Claude, Meta, Google, Gemini, Microsoft"""

# 分 3 段生成
PARTS = [
    {
        "name": "Part 1: Frontmatter + Sections I-II",
        "prompt": f"""You are a senior technology analyst at AgentPuter Lab. Write Part 1 of a blog post in raw Markdown.

{STYLE_RULES}

OUTPUT THIS EXACTLY — start with YAML frontmatter, then Section I and Section II:

---
title: "OpenClaw's Creator Just Joined OpenAI. Here's What It Means for Every Agent Builder."
description: "Peter Steinberger chose a job over a billion-dollar exit. OpenClaw becomes a foundation. The Agent platform war enters a new phase — and the infrastructure race is on."
date: "2026-02-16"
author: "AgentPuter Lab"
readingTime: "12 min"
tags: ["OpenClaw", "OpenAI", "Peter Steinberger", "AI Agent", "Agent Platform", "Open Source", "AgentPuter"]
featured: true
---

Then write these two sections (~800 words total):

## I. What Just Happened
FACTS TO USE:
- Sam Altman tweeted on Feb 15, 2026: "Peter Steinberger is joining OpenAI to drive the next generation of personal agents. He is a genius with a lot of amazing ideas about the future of very smart agents interacting with each other to do very useful things for people. We expect this will quickly become core to our product offerings. OpenClaw will live in a foundation as an open source project that OpenAI will continue to support. The future is going to be extremely multi-agent and it's important to us to support open source as part of that."
- Steinberger's blog post: "What I want is to change the world, not build a large company, and teaming up with OpenAI is the fastest way to bring this to everyone."
- OpenClaw → foundation structure. Previously had offers from Meta (Zuckerberg via WhatsApp), OpenAI, and Microsoft (Satya Nadella).
- Sources: The Verge, TechCrunch, Reuters

## II. Why He Chose a Job Over a Billion-Dollar Exit
FACTS TO USE:
- OpenClaw had $0 revenue, ~195,000 GitHub stars, Steinberger personally losing €10-20K/month
- "Linux playbook" — give kernel away, let ecosystem flourish. But Linux had Torvalds + thousands of corporate contributors; OpenClaw had bus factor of one.
- Chrome/Chromium analogy Steinberger mentioned for the foundation model
- Compare to: Guido van Rossum (Python → Google → Microsoft), Brendan Eich (Netscape → Mozilla)
- KEY INSIGHT: Steinberger didn't sell OpenClaw. He placed it in a trust, then went to work for the biggest potential beneficiary.
- Reference our previous post: "As we explored in our analysis of OpenClaw's business model, the project generated zero revenue..."

Write Part 1 now. Raw Markdown only, no code fences."""
    },
    {
        "name": "Part 2: Sections III-IV",
        "prompt": f"""You are a senior technology analyst at AgentPuter Lab. Write Part 2 of a blog post (Sections III and IV only). Raw Markdown, no frontmatter, no code fences.

{STYLE_RULES}

Write these two sections (~1100 words total):

## III. The Community Reaction — Excitement and Anxiety
FACTS TO USE:
- Reddit r/openclaw: Top threads about "will it stay open source?" — Chrome/Chromium fear. One commenter: "if I have a choice between the crappy ad-infested version and the open-source community version, I know which one I'll pick."
- Reddit r/AI_Agents: Security-focused users relieved — hope OpenAI brings enterprise-grade security
- Twitter/X: Developers split — "great for agent adoption" vs "embrace-extend-extinguish" concerns
- Hacker News: Inevitable MySQL → Oracle, Redis → licensing change, HashiCorp → IBM comparisons
- China's industry ministry had flagged OpenClaw security risks; foundation governance adds legitimacy
- The REAL fear: OpenAI ships first-party "OpenClaw Pro" 10x better, open-source version withers (Android vs Google Apps playbook)
- Counter-argument: OpenAI also launched "Frontier" enterprise agent platform. OpenClaw feeds that funnel.

## IV. What This Means for the Agent Platform Race
FACTS TO USE:
- OpenAI's play: Steinberger brings most popular agent framework + community credibility + agent-to-agent coordination (Moltbook social network where AI agents interact)
- Anthropic's response: Claude already powers most OpenClaw usage. Will they build competing agent framework? (Claude Code, Claude Desktop exist)
- Google: Gemini + Android = biggest potential agent surface area, but no viral agent framework yet
- Meta: Lost the deal. Open-source Llama is the model, but no agent orchestration layer
- Microsoft: Copilot/GitHub Copilot enterprise play. Steinberger at OpenAI strengthens via partnership.
- "Frontier" launch: OpenAI announced enterprise agent platform same day — Intuit, Uber, State Farm, Thermo Fisher as launch customers. NOT coincidence.
- KEY PATTERN: model layer commoditizing → orchestration layer is where value accrues → OpenAI just acquired the orchestration king

Write Part 2 now. Start directly with ## III. heading."""
    },
    {
        "name": "Part 3: Sections V-VII",
        "prompt": f"""You are a senior technology analyst at AgentPuter Lab. Write Part 3 of a blog post (Sections V, VI, and VII). Raw Markdown, no frontmatter, no code fences.

{STYLE_RULES}

Write these three sections (~1100 words total):

## V. The Infrastructure Gap Remains
FACTS TO USE:
- OpenClaw under foundation solves governance. Does NOT solve:
  - Security: CVE-2026-25253 (RCE vulnerability), 21,000+ publicly exposed instances with unprotected admin dashboards containing API keys, 400+ malicious skills on ClawHub distributed password-stealing malware
  - Enterprise readiness: No SOC 2, no SAML/SSO, no audit trails
  - Runtime isolation: Agents running with root privileges on personal machines unchanged
  - Vendor neutrality: If OpenClaw becomes OpenAI-funded project, will it optimize for GPT over Claude? Over Gemini?
- A foundation governs the code. An infrastructure layer makes it safe.
- Reference previous post: "As we argued in our first post — the agent needs its own computer."

## VI. What This Means for AgentPuter
NOTE: This section must feel EARNED after 5 sections of pure analysis. NOT a sales pitch.
POINTS TO MAKE:
- Our position is clearer, not threatened:
  - OpenClaw = the engine (foundation-governed, likely to accelerate)
  - AgentPuter = the chassis, safety system, and road (enterprise infrastructure)
- Steinberger move validates the two-layer model:
  - Layer 1: Open-source agent framework (OpenClaw, now with OpenAI backing)
  - Layer 2: Enterprise infrastructure (runtime, security, orchestration) — this is us
- Analogy: Linux Foundation governs the kernel. Red Hat (now IBM, $34B acquisition) built enterprise layer. Kubernetes is open-source. GKE/EKS/AKS are the businesses built on top.
- OpenClaw getting stronger makes our infrastructure more valuable, not less.

## VII. Three Things to Watch
USE NUMBERED LIST here (the only section with a list):
1. Foundation governance structure — who sits on the board? If all OpenAI employees, not really independent. Watch for appointments in next 30 days.
2. OpenAI Frontier pricing and feature overlap — if Frontier ships managed OpenClaw offering, that's Chrome/ChromeOS playbook. Independent infrastructure providers need to differentiate on vendor neutrality.
3. Anthropic's counter-move — Claude powers majority of OpenClaw agent sessions. Anthropic won't sit idle. Expect agent framework announcement within 60 days.

End with a strong closing line: "The agent war just went from cold to hot. The creator picked a side. The code stays open. The infrastructure race is on."

Write Part 3 now. Start directly with ## V. heading."""
    },
]


def safe_write(path, content):
    if isinstance(content, bytes):
        content = content.decode('utf-8')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def generate_part(part_info):
    """生成单个部分，最多重试 3 次"""
    name = part_info["name"]
    prompt = part_info["prompt"]

    for attempt in range(3):
        try:
            print(f"  [{name}] 尝试 {attempt+1}/3 ...")
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=8192,
                    top_p=0.95,
                ),
            )
            text = response.text
            if not text or len(text) < 200:
                print(f"  [{name}] 输出过短 ({len(text) if text else 0}), 重试...")
                time.sleep(10)
                continue

            # 清理代码围栏
            if text.startswith("```"):
                lines = text.split('\n')
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = '\n'.join(lines)

            print(f"  [{name}] 成功! {len(text)} chars")
            return text

        except Exception as e:
            print(f"  [{name}] 错误: {e}")
            if attempt < 2:
                wait = 15 * (attempt + 1)
                print(f"  [{name}] 等待 {wait}s...")
                time.sleep(wait)

    return None


def main():
    print(f"[INFO] 模型: {MODEL} @ global")
    print(f"[INFO] 分 3 段生成 Blog #7\n")

    all_parts = []
    for i, part in enumerate(PARTS):
        print(f"\n--- 生成 {part['name']} ---")
        result = generate_part(part)
        if result is None:
            print(f"[FAIL] {part['name']} 生成失败，终止")
            return
        all_parts.append(result)

        if i < len(PARTS) - 1:
            print("[INFO] 冷却 8s...")
            time.sleep(8)

    # 合并
    full_text = all_parts[0] + "\n\n---\n\n" + all_parts[1] + "\n\n---\n\n" + all_parts[2]

    safe_write(OUTPUT, full_text)
    print(f"\n{'='*50}")
    print(f"[SUCCESS] Blog #7 已写入: {OUTPUT}")
    print(f"[INFO] 总字符数: {len(full_text)}")
    print(f"[INFO] 总单词数: ~{len(full_text.split())}")
    print(f"[INFO] 总行数: {len(full_text.splitlines())}")


if __name__ == "__main__":
    main()
