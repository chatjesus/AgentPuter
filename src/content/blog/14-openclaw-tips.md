---
title: "OpenClaw Power User Guide: 30 Tips Nobody Tells You"
description: "maxSpawnDepth defaults to 1, not infinite. SOUL.md is invisible to sub-agents. cleanup keeps files forever unless you change it. 30 production-tested tips to close the gap between 'works' and 'well-configured'."
date: "2026-02-21"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "Configuration", "Sub-Agents", "Skills", "Cost Control", "Security", "Tips"]
featured: true
---

# OpenClaw Power User Guide: 30 Tips Nobody Tells You

*OpenClaw Community · February 2026*

Most people install OpenClaw, get one agent running, and figure they're done. They're not wrong — it works. But "works" and "well-configured" are different things, and the gap between them shows up in your API bill, your debugging sessions, and whether your sub-agents do what you actually told them.

These 30 tips come from production use and a careful read of the official docs. Some are obvious in hindsight. Most aren't obvious at all.

---

## Table of Contents

1. [Configuration Fundamentals (Tips 01–08)](#chapter-1)
2. [Skill Selection and Usage (Tips 09–14)](#chapter-2)
3. [Sub-Agent Architecture (Tips 15–20)](#chapter-3)
4. [Cost Control (Tips 21–25)](#chapter-4)
5. [Debugging and Security (Tips 26–30)](#chapter-5)
6. [Skip All of This: TinyClaw](#tinyclaw)

---

## Configuration Fundamentals {#chapter-1}

---

### 01. AGENTS.md vs SOUL.md: where sub-agents actually look

OpenClaw loads files in a three-level hierarchy:

```
~/.openclaw/SOUL.md   ← global
./SOUL.md             ← project
AGENTS.md + TOOLS.md  ← session (what sub-agents see)
```

Sub-agents load only `AGENTS.md` and `TOOLS.md`. Everything else — `SOUL.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`, `BOOTSTRAP.md` — is invisible to them.

This trips up a lot of people. They write routing logic in `SOUL.md`, deploy a fan-out architecture, and then spend an hour wondering why sub-agents aren't routing correctly. They're not routing correctly because they can't see the instructions.

Anything a sub-agent needs — routing rules, persona constraints, tool allowlists — goes in `AGENTS.md`:

```markdown
# AGENTS.md

## Routing
- Finance questions → finance-agent
- Code review → code-reviewer
- Research → research-storm
```

Simple rule: if a sub-agent needs to know it, it can't live in `SOUL.md`.

---

### 02. Model strings need the provider prefix

```json
{ "model": "claude-opus-4-6" }     ← will break
{ "model": "anthropic/claude-opus-4-6" }  ← correct
```

The format is `provider/model-name`. Without it, the model router can fail silently when two providers have similar names — and they do.

Common strings as of February 2026:

| Model | Good for |
|-------|---------|
| `anthropic/claude-opus-4-6` | Anything requiring real reasoning |
| `anthropic/claude-sonnet-4-6` | Most things — near-Opus quality, much cheaper |
| `anthropic/claude-haiku-4-5` | Execution tasks where speed matters more than depth |
| `google/gemini-3.1-pro-preview` | Long documents, multimodal inputs |
| `openai/gpt-4o-mini` | Summarization, classification, format conversion |
| `ollama/qwen2.5` | Anything that can't leave your network |

To set the global default for sub-agents:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }
    }
  }
}
```

---

### 03. Keep API keys out of config.json

Every month someone pushes an OpenClaw config to a public GitHub repo with keys inline. GitGuardian finds it within minutes.

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
CONTEXT7_API_KEY=...

# .gitignore
.env
.env.local
.env.*
```

OpenClaw reads `.env` automatically. There's no reason to put keys anywhere else.

---

### 04. maxSpawnDepth defaults to 1

If you've seen `SpawnDepthExceeded` and didn't know why, this is why.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2
      }
    }
  }
}
```

Default is 1 — one level of sub-agents. Maximum is 5, but in practice 2 covers almost every real architecture. Depth-2 leaf nodes can't spawn further; trying to go deeper throws runtime errors that are annoying to trace.

What depth 2 actually looks like:

```
Main Agent
├── Research Agent   (can't spawn further)
├── Analysis Agent   (can't spawn further)
└── Writer Agent     (can't spawn further)
```

Unless you have a specific reason to need three-level nesting, leave it at 2.

---

### 05. runTimeoutSeconds defaults to 0

Zero means no timeout. A stuck sub-agent runs forever.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "runTimeoutSeconds": 120
      }
    }
  }
}
```

120 seconds works for most tasks. Data-heavy agents sometimes need 300. The key thing to understand: hitting the timeout stops execution but doesn't delete the session. You need `cleanup` for that (Tip 06), and you need to distinguish timeout from actual failure when debugging (Tip 27).

---

### 06. cleanup defaults to "keep" — change it

Every completed session leaves files. With the default `keep`, they accumulate indefinitely.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "cleanup": "delete"
      }
    }
  }
}
```

"delete" is a misnomer — it renames the transcript to `*.deleted.*` rather than removing it. Your history is preserved; your working directory stays clean. Sessions that aren't cleaned up sit around until the 60-minute auto-archive, which is a long time if you're running agents frequently.

---

### 07. Connect context7 to stop agents from hallucinating APIs

This is the single highest-impact MCP you can add for development workflows. Agents query real-time official documentation instead of guessing from training data that's months or years old.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

API key is optional — get one free at `context7.com/dashboard` if you hit rate limits. Once connected, add `use context7` to any prompt where you need current docs.

Ask *"how do Server Actions work in the latest Next.js?"* and you get actual current documentation, not something from 2023 beta.

---

### 08. TOOLS.md is your permission boundary

Without `TOOLS.md`, agents can call anything available.

```markdown
# TOOLS.md

deny: ["gateway", "cron", "billing", "admin_delete"]
```

`deny` overrides `allow`. In multi-agent setups this matters more than it seems — if one skill gets compromised, a permissive `TOOLS.md` lets the blast radius spread across your whole agent graph.

---

## Skill Selection and Usage {#chapter-2}

---

### 09. The safety score is not decoration

Both ClawHub and agentskills.io show a safety score for every skill. Read it.

- **A/B (80+):** Fine for production
- **C (70–79):** Check what OAuth scopes it requests before installing
- **D (≤69):** Test in a sandbox. Seriously.

In February 2026, the ClawHavoc incident pulled 341 skills from ClawHub. They contained prompt injection payloads — some subtle enough that manual inspection would have missed them. The safety score is automated analysis catching what you can't see at a glance.

---

### 10. self-improvement: the one skill that actually gets smarter over time

`self-improvement` logs errors, corrections, and knowledge gaps from every session to `.learnings/ERRORS.md`. Before the next session starts, the agent reads that file back — so it enters already knowing what went wrong last time.

No extra setup. No second skill required. Install it, run the same recurring task for two weeks, and compare. The compounding is real.

---

### 11. Skill load order: later wins

Load order is `TOOLS.md` → `AGENTS.md` → `SKILL.md`. If a skill defines a tool with the same name as something in your `AGENTS.md`, the skill's version takes over.

This is sometimes what you want (skills can intentionally extend your base config), sometimes not (a careless skill silently clobbers something important). If you have custom tool definitions, check a skill's tool list before installing.

---

### 12. Writing a custom skill is simpler than you think

The minimum viable `SKILL.md` has three sections:

```markdown
# my-skill/SKILL.md

## What I do
Analyze CSV sales data and generate weekly summaries.

## When to use me
After a sales period closes, when you have a CRM export.
Not for real-time data or non-sales datasets.

## How I work
1. Read the CSV from the path in the task prompt
2. Calculate totals, top performers, period-over-period delta
3. Format as a Markdown table
4. Save to output/sales_summary_[date].md
```

That's it. Agents can follow plain English instructions. You don't need to learn a special syntax.

---

### 13. ClawHub vs agentskills.io: different tools for different jobs

| | clawhub.ai | agentskills.io |
|-|-----------|----------------|
| Catalog size | 3,286 skills | 19,309 skills |
| Curation | Safety-audited, curated | Community submissions, long tail |
| Best for | Production use | Finding niche skills ClawHub doesn't have |

They're not competitors. Use ClawHub by default; switch to agentskills.io when you need something specific that ClawHub doesn't carry.

---

### 14. proactive-agent + Cron: what "autonomous" actually means

`proactive-agent` supports WAL (crash recovery, context persistence across restarts), autonomous Cron scheduling, and context restoration after interruption.

A concrete example of what this enables:

```
Schedule: daily at 08:00
Task: Summarize yesterday's GitHub Issues and PRs.
      Pull today's calendar. Flag any scheduling conflicts.
      Post digest to Slack #morning-brief.
```

No button to press. No human in the loop. It just runs. This is the point where agents stop feeling like tools and start feeling like infrastructure.

---

## Sub-Agent Architecture {#chapter-3}

---

### 15. Fan-out: the most impactful change most teams haven't made

Sequential:
```
Main → fetch data (12s) → summarize news (11s) → check calendar (7s) → analyze tasks (5s)
Total: 35 seconds
```

Fan-out:
```python
sessions_spawn(task="fetch market data",  label="market-data",    model="anthropic/claude-haiku-4-5")
sessions_spawn(task="summarize news",     label="news-summary",   model="anthropic/claude-haiku-4-5")
sessions_spawn(task="check calendar",     label="cal-check",      model="anthropic/claude-haiku-4-5")
sessions_spawn(task="analyze yesterday",  label="task-analysis",  model="anthropic/claude-haiku-4-5")
# main agent keeps moving, all four run in parallel
Total: ~20 seconds
```

`sessions_spawn` returns a `runId` immediately and doesn't block. The main agent continues. This one change — restructuring sequential work into fan-out — shaves 30–40% off latency for morning-brief style workflows.

---

### 16. Use Haiku for sub-agents by default, Opus for the exceptions

Set Haiku globally, override when you actually need reasoning:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }
    }
  }
}
```

```python
# Override for the one task that actually needs it
sessions_spawn(
    task="design the data model for multi-tenant billing",
    label="billing-schema",
    model="anthropic/claude-opus-4-6"
)
```

In practice: Haiku handles 80%+ of execution tasks without meaningful quality loss. The cost difference is real — 50–60% reduction in API spend for typical fan-out architectures.

---

### 17. Routing logic in AGENTS.md, not SOUL.md

Worth repeating since it causes silent failures every time:

```markdown
# ❌ In SOUL.md — sub-agents cannot see this
When the user asks about finances, delegate to finance-agent.

# ✅ In AGENTS.md — sub-agents can see this
When the user asks about finances, delegate to finance-agent.
```

If your routing breaks and you don't know why, check this first.

---

### 18. Always label your sub-agents

```python
# ❌
sessions_spawn(task="analyze Q4 numbers")

# ✅
sessions_spawn(
    task="analyze Q4 numbers",
    label="q4-sales-analysis-2026"
)
```

Without a label, `/subagents list` gives you a wall of anonymous sessions. When one fails at 3am and you're trying to figure out which one, the label is what makes the difference between a five-second diagnosis and a twenty-minute archaeology project.

---

### 19. Sub-agents can't ask questions — write prompts accordingly

The `announce` mechanism goes one way: sub-agent reports back on completion. It can't pause to ask a clarifying question mid-run.

This means your task prompt has to contain everything the agent needs:

```python
# ❌ Too vague — will produce garbage or nothing
sessions_spawn(task="analyze the data", label="analysis")

# ✅ Self-contained
sessions_spawn(
    task="""
    Analyze /data/sales_jan_2026.csv.
    Output: 1) Total monthly revenue, 2) Top 5 products by units,
    3) MoM change vs /data/sales_dec_2025.csv.
    Format: Markdown table. Save to /output/jan_2026_report.md.
    If either file is missing, write to /output/errors.log and stop.
    """,
    label="jan-2026-analysis"
)
```

Think of it as writing instructions for someone who's going into a room, closing the door, and can't come back out to ask you anything.

---

### 20. Watch your concurrency limits

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 3
      }
    }
  }
}
```

`maxChildrenPerAgent` caps how many sub-agents one parent can spawn (default: 5). `maxConcurrent` is the global ceiling on parallel agents (default: 8).

Hitting either limit doesn't crash anything — agents queue — but latency goes up. If you're on a personal API plan with lower rate limits, dropping `maxConcurrent` to 3 or 4 avoids 429s. On an enterprise plan, you can push it higher.

---

## Cost Control {#chapter-4}

---

### 21. Install save-money for automatic model routing

```bash
openclaw install save-money
```

The skill watches task complexity and routes to the cheapest model that can handle it: Haiku for classification and formatting, Sonnet for standard generation, Opus for anything requiring actual reasoning. Threshold is configurable.

Users consistently report 50%+ monthly cost reduction. The routing isn't perfect, but it doesn't need to be — even routing 60% of tasks to Haiku instead of Opus adds up fast.

---

### 22. Context Compaction for sessions that run long

Claude Opus and Sonnet 4.6 both support Context Compaction. When conversation history gets long, compaction summarizes intelligently instead of truncating. You keep coherence; you don't hit the wall.

Most relevant for research agents that run over multiple hours, iterative document editing, and long debugging sessions. If your agents regularly approach context limits, turn this on.

---

### 23. openclaw usage: run it, actually look at it

```bash
openclaw usage
```

Breaks down token consumption by session, model, and tool. Most people run this once, glance at the total, and close it. The value is in the per-agent breakdown.

What to look for: one sub-agent using 5× more tokens than the rest (prompt is too long), a tool called 20 times in a single session (agent is looping), Opus on tasks that Sonnet could handle (misconfigured routing). These patterns pay for themselves to fix.

---

### 24. Pin gpt-4o-mini for summarization and classification

```json
{
  "tasks": {
    "summarize": { "model": "openai/gpt-4o-mini" },
    "classify":  { "model": "openai/gpt-4o-mini" },
    "translate": { "model": "openai/gpt-4o-mini" },
    "format":    { "model": "openai/gpt-4o-mini" }
  }
}
```

For these task types, accuracy doesn't meaningfully differ between GPT-4o-mini and Opus. Cost does — about 80% less. Point the cheap model at cheap work; save the expensive model for the cases where it actually matters.

---

### 25. Sensitive data goes through a local model

```json
{
  "mcpServers": {
    "local-llm": {
      "model": "ollama/qwen2.5",
      "baseUrl": "http://localhost:11434"
    }
  }
}
```

Financial records, employee data, internal documents — anything that shouldn't leave your network goes to Ollama. Qwen2.5 runs well on local hardware (multiple size options from 0.5B to 72B), supports 128K context, and handles function calling. It's slower than cloud APIs, but for sensitive workloads that's the tradeoff you make.

---

## Debugging and Security {#chapter-5}

---

### 26. Verbose logs before anything else

```bash
openclaw debug --verbose
/subagents log <runId>
```

The verbose log shows every tool call, every routing decision, and the full context at each step. Nine times out of ten, the issue is obvious the moment you see the log — the agent tried to call a tool that doesn't exist, got stuck in a retry loop, or was working from a prompt that didn't include the information it needed.

Don't debug by hypothesis when you can just read what happened.

---

### 27. Timeout and failure look different — treat them differently

```bash
/subagents list
```

Check the `status` column before doing anything:

- `timeout` — the agent ran past `runTimeoutSeconds`. Increase the limit, rerun. Running again with the same config reproduces the timeout.
- `error` — actual failure. Open the log, find the error message.

They need different fixes. Treating a timeout as a failure sends you in the wrong direction.

---

### 28. Scan installed skills with clawdefender

```bash
clawdefender scan --all
```

After ClawHavoc, this is something you should run on any existing installation, not just new ones. It catches prompt injection, command injection, credential harvesting, and scope creep in OAuth requests — the four things that made 341 skills dangerous without looking dangerous.

If a skill fails, uninstall it and find an alternative with a higher safety score. There's no safe way to "partially trust" a skill that's trying to exfiltrate credentials.

---

### 29. OAuth scope: ask for exactly what you need

Every scope you grant is a scope that can be abused if a skill is compromised:

| Don't request | Request instead |
|--------------|----------------|
| `calendar:*` | `calendar:read` |
| `email:*` | `email:send` |
| `files:readwrite` | `files:read` |
| `contacts:*` | `contacts:read` |

A calendar-reading skill doesn't need write access. An email-drafting skill doesn't need to delete messages. Scope requests that exceed what the skill description promises are a red flag worth investigating before authorizing.

---

### 30. TinyClaw has all of this pre-configured

The configuration in this guide — timeout settings, cleanup policies, model routing, security defaults — is already baked into TinyClaw. If you'd rather skip the setup and get a production-ready instance running in under a minute:

```
tinyclaw.dev → pick a model → pick a channel → deploy
```

The 30 tips above still apply once you're running. They give you a better starting point.

---

## Skip All of This: TinyClaw {#tinyclaw}

Manual OpenClaw setup, if you know the steps, takes about an hour:

| Step | Time |
|------|------|
| Provision a server | 15 min |
| Configure SSH keys | 10 min |
| Install Node.js | 5 min |
| Install and configure OpenClaw | 17 min |
| Connect to an AI provider | 10 min |
| **Total** | **~60 min** |

If you're non-technical, multiply by 10 — you have to learn each step before doing it.

TinyClaw skips this entirely. Servers are pre-provisioned, the environment is already configured. You pick three things:

**Model:** Claude Opus 4.6, GPT-5.2, or Gemini 3.1 Pro

**Channel:** Telegram, Discord, or WhatsApp

**Account:** Sign in with Google.

That's the whole process. Under a minute.

What you can do immediately after:

- Read and summarize email, draft replies
- Meeting reminders and schedule conflict detection
- Track expenses from receipts
- Research competitors, screen leads
- Standup summaries, OKR tracking
- Draft contracts, job descriptions, social posts
- Price comparison, coupon lookup

And anything else you can describe in a sentence. Server slots are limited — check availability at [tinyclaw.dev](https://tinyclaw.dev).

---

## Quick Reference

| Chapter | Tips | Read When |
|---------|------|-----------|
| Configuration | 01–08 | Before touching config |
| Skills | 09–14 | Before installing anything |
| Sub-Agents | 15–20 | Before building multi-agent workflows |
| Cost | 21–25 | After your first real workload |
| Debug & Security | 26–30 | When things break |

---

## Resources

- [docs.openclaw.ai](https://docs.openclaw.ai) — official documentation
- [clawhub.ai](https://clawhub.ai) — curated skills, safety-audited
- [agentskills.io](https://agentskills.io) — wider catalog, longer tail
- [tinyclaw.dev](https://tinyclaw.dev) — one-click deploy
- [agentputer.com](https://agentputer.com) — 24/7 cloud hosting

---

*Sources: OpenClaw docs (docs.openclaw.ai) · ClawHub safety data (Feb 2026) · Anthropic model docs (docs.anthropic.com) · context7 docs (context7.com)*

