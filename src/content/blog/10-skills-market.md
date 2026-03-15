---
title: "The AI Skills Marketplace Nobody Is Talking About (We Ran the Numbers)"
description: "Everyone assumes ClawHub is the biggest OpenClaw skills platform. We pulled the SimilarWeb data. The actual leader has 17× more traffic — and its largest user base is in China."
date: "2026-02-19"
author: "AgentPuter Lab"
readingTime: "12 min"
tags: ["OpenClaw", "Skills", "AI Agent", "ClawHub", "SkillsMP", "Market Analysis"]
featured: true
---

*Part 10 of the Agent Infrastructure Series | Data: SimilarWeb API, February 18, 2026*

---

When OpenClaw exploded past 207,000 GitHub stars, a parallel ecosystem quietly exploded alongside it: AI agent skills marketplaces. These are the platforms where developers publish and discover the instruction packages — SKILL.md files — that tell OpenClaw how to manage your email, control your calendar, monitor GitHub repos, or even evolve its own behavior.

You've probably heard of ClawHub. It's the official registry, baked into the OpenClaw CLI. Type `clawhub install skill-name` and it pulls from there. The project README links to it. Most tutorials reference it.

So it must be the biggest, right?

We ran the numbers. It isn't close.

---

## The Traffic Reality

We queried the SimilarWeb API across seven skills-related domains and compared monthly visits for November 2025 through January 2026. Here's what we found:

```
Monthly Visits — January 2026

skillsmp.com    ████████████████████████████████████  958,542  ← #1
agentskills.io  █████████████████████████             558,091  ← #2 (launched Dec 2025)
clawhub.ai      ███                                    56,350  ← #3 (first appeared Jan 2026)
playbooks.com   ██                                     42,591  ← #4 declining
agent-skills.md █                                      20,124  ← long tail
agentskills.to  ▏                                         509  ← new entrant
```

**ClawHub, the official OpenClaw registry, gets 56,350 visits per month.** SkillsMP, a platform most people in Western OpenClaw communities have never heard of, gets **958,542** — nearly a million. That's **17× ClawHub's traffic** — and 18× its own traffic from three months earlier.

And the growth curves make it even more striking:

| Domain | Nov 2025 | Dec 2025 | Jan 2026 | Trend |
|--------|----------|----------|----------|-------|
| skillsmp.com | 53,169 | 223,859 | 958,542 | 🚀 18× growth in 3 months |
| agentskills.io | 0 | 110,737 | 558,091 | 🚀 0 to 558K in 2 months |
| playbooks.com | 70,052 | 58,457 | 42,591 | 📉 -39% and falling |
| clawhub.ai | 0 | 0 | 56,350 | 📈 just appeared |

The entire category barely existed in October. By January 2026, the combined traffic of skills discovery platforms crossed 1.6 million monthly visits. This is a market that didn't exist six months ago.

---

## Who's Actually Winning and Why

### #1: SkillsMP — The Platform Nobody in the West Knows

SkillsMP isn't a household name in the English-language OpenClaw community. It doesn't get mentioned in the Discord. The official docs don't link to it. But it's pulling nearly a million monthly visitors.

The data tells you why: **35.2% of SkillsMP's traffic comes from China**, making it the largest single country by far. Add Taiwan (9.7%), Singapore (4.8%), Hong Kong (3.9%), and Vietnam (3.7%), and the Asia-Pacific region accounts for well over 50% of total visits. This is, at its core, an Asian internet audience driving a Western open-source project's tooling ecosystem.

The traffic structure is also unusually healthy:

| Source | Visits | Share |
|--------|--------|-------|
| Direct | 501,685 | 52.4% |
| **Organic Search** | **239,722** | **25.0%** |
| **Social** | **163,807** | **17.1%** |
| Referrals | 40,928 | 4.3% |
| Paid Ads | 9,723 | 1.0% |

SEO driving 25% of traffic and social driving 17% is a mature content strategy, not luck. Someone built this intentionally. The bounce rate (39%) and average session duration (4.5 minutes, 4.9 pages) confirm users are genuinely exploring — not bouncing off a landing page.

**The interpretation:** SkillsMP is probably run by a Chinese team or an operation with strong Chinese content distribution. It aggregates over 239,000 skills across multiple AI tool ecosystems — Claude Code, Cursor Rules, OpenAI Codex, OpenClaw, and others — rather than OpenClaw exclusively. It's broad rather than deep.

---

### #2: agentskills.io — Brand Power Without SEO

AgentSkills.io launched effectively in December 2025 and hit 558,000 monthly visits by January. That's extraordinary velocity.

The reason is Anthropic. The site is the official home for the "Agent Skills" open format that Anthropic defined — the SKILL.md standard adopted by Claude Code, Cursor, OpenAI Codex, and OpenClaw alike. With Anthropic's reach, you get instant brand recognition and direct traffic.

And the numbers bear this out: **70.2% of agentskills.io's traffic is direct** — people typing the URL or clicking a bookmark. That's a signal of brand strength.

But look at what's missing:

| Source | Visits | Share |
|--------|--------|-------|
| Direct | 392,011 | 70.2% |
| Social | 64,987 | 11.6% |
| Referrals | 51,038 | 9.1% |
| **Organic Search** | **35,626** | **6.4%** |

Only 6.4% from search. For a site with half a million monthly visitors, that's a massive structural weakness. The moment the buzz fades, the direct traffic will normalize — and there's almost no SEO infrastructure to catch the fall.

The engagement metrics confirm it: 1.8-minute average sessions, 62.4% bounce rate, 2.2 pages per visit. Users come, skim a skills listing or documentation page, and leave. There's no reason to stay.

**The interpretation:** agentskills.io is riding the Anthropic wave. It's fast-growing but fragile. Without serious investment in content depth and SEO, it will plateau.

---

### #3: ClawHub — Small but Dense

ClawHub (clawhub.ai) didn't even appear in SimilarWeb's dataset until January 2026. At 56,350 monthly visits it ranks third — ahead of the declining playbooks.com (42,591) — but modest compared to the leaders.

But look at what those visitors *do*:

| Metric | clawhub.ai | agentskills.io | skillsmp.com |
|--------|------------|----------------|--------------|
| Avg. session duration | **274 seconds** | 108 seconds | 270 seconds |
| Bounce rate | **41.3%** | 62.4% | 39.0% |
| Pages per visit | **8.0** | 2.2 | 4.9 |

Eight pages per visit. Nearly five minutes per session. Users on ClawHub are *working* — scrolling through skills, reading SKILL.md files, checking version histories, comparing options. These are the developers actually building things with OpenClaw.

The geography is telling too: **58.1% of ClawHub's traffic is from the United States**, compared to 35% China-first for SkillsMP. ClawHub is where English-speaking developers live. It's the serious, heavy-use audience.

**The interpretation:** ClawHub has the highest-quality users in the ecosystem. But with no social presence (social traffic: 759 visits), no SEO strategy, and no paid acquisition, it's invisible outside the existing OpenClaw community. It's a fantastic utility that nobody outside the core knows exists.

---

## The White Space Nobody Has Claimed

Here's the competitive picture in one paragraph: SkillsMP has the traffic but no OpenClaw depth. AgentSkills.io has the brand but no content durability. ClawHub has the right users but zero reach. And the entire measurable market — using the earliest data point, SkillsMP's November 2025 traffic as a proxy — grew roughly 30× to 1.6 million monthly visits, and is still accelerating.

The white space is a content-first, OpenClaw-dedicated platform that builds durable SEO, serves both English and Chinese audiences, and creates the reasons to come back — weekly charts, daily tutorials, monthly reports.

Three specific gaps the data reveals:

**Gap 1: OpenClaw-specific SEO is almost unclaimed.** SkillsMP's 25% search traffic comes from broad AI skills queries. AgentSkills.io gets only 6.4% from search. For targeted terms like "openclaw email skill tutorial," "best openclaw skills 2026," or "openclaw gog google workspace setup" — the landscape is essentially empty. A focused content operation could own these terms.

**Gap 2: Chinese-language OpenClaw content doesn't exist.** SkillsMP dominates Chinese traffic with generic AI tools content. But specific OpenClaw tutorials in Chinese — how to deploy on a Chinese VPS, which skills work with domestic models like DeepSeek or Kimi, how to configure for WeChat/DingTalk workflows — there's almost nothing. China represents 20–35% of the user base across every platform measured.

**Gap 3: Engagement content creates return visits; nobody is doing it.** ClawHub gets 8 pages/visit because users are browsing a live registry. But there's no weekly chart, no "skill of the week," no editorial layer. Users who would return for curated content have no reason to.

---

## What the Data Means for OpenClaw Users

For developers and users who just want to find good skills: **don't rely solely on ClawHub's browse interface**. The official registry has the goods — 3,286 skills with real download data and security scores — but the discovery experience is minimal. Until dedicated content platforms mature, the best resource is the [OpenClaw Top 100 curated list](https://agentskillshub.dev/openclaw/top-100/), which applies security weighting alongside popularity signals.

For the security-conscious: the February 2026 ClawHavoc incident — Koi Security's initial audit flagged 341 malicious skills out of 2,857 on ClawHub; the subsequent full investigation uncovered 1,184 across 12 publisher accounts — is a reminder that download counts alone don't indicate safety. The security scoring system (A through D grades) is the right filter. Skills rated A (only two exist: nano-pdf and video-frames) or B (the majority of the Top 100) have been reviewed. Skills rated D should be tested in a sandbox environment first.

The fastest-moving skills categories as of January 2026:

| Category | Signal |
|----------|--------|
| AI self-improvement | self-improvement (#1, 17K installs) — agents that get smarter over time |
| Proactive automation | proactive-agent (#2), capability-evolver (#10, 36K installs) |
| Google Workspace | gog (#3, 16K installs) — unified Gmail/Calendar/Drive control |
| Browser automation | Agent Browser (#6, 12K installs), fast-browser-use (#39) |
| Long-term memory | elite-longterm-memory (#29), para-second-brain (#90) |

The dominant theme is agents that improve themselves and operate more autonomously over time. The early adopter use case — "ask it things in chat" — is being replaced by persistent, proactive systems that learn and act without being prompted.

---

## The Bigger Picture

The skills marketplace for AI agents is where the npm ecosystem was in 2011 or the App Store was in 2009 — messy, fast-growing, with no clear dominant player yet. The category went from nearly zero to 1.6 million monthly visits in under six months. OpenClaw's 207,000 GitHub stars represent a population of potential users who largely haven't discovered the skills ecosystem yet.

The platform that wins will be the one that helps those 207,000 people answer the question: "Now that I have OpenClaw running, which skills should I install first — and why?"

The answer isn't just a list. It's a weekly chart, a daily tutorial, a monthly digest of what changed. It's content with enough depth that users stay for 8 minutes instead of 1.8.

That platform doesn't exist yet. The window is open.

---

*Data methodology: All traffic figures queried directly via SimilarWeb API on February 18, 2026. Monthly visit counts, traffic source breakdowns, and engagement metrics (bounce rate, session duration, pages/visit) are SimilarWeb estimates based on their panel data. Geographic breakdowns represent the percentage of total traffic from each country. All figures are for desktop traffic; mobile figures were not available through the API tier used.*

*New to OpenClaw? → [TinyClaw](https://tinyclaw.dev) deploys it in 60 seconds, or use [AgentPuter](https://www.agentputer.com/) for 24/7 managed cloud hosting.*
