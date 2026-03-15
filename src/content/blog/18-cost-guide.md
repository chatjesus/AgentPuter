---
title: "How to Run OpenClaw for Under $30/Month (The Complete Cost Guide)"
description: "One user spent $254 in two weeks. Federico Viticci hit $3,600 in a month. Someone woke up to a $141 surprise from overnight heartbeats. Six places OpenClaw burns tokens, what 3.7 and 3.8 changed, and how real users cut their bills from hundreds to under $30 — without giving up anything that matters."
date: "2026-03-09"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "Cost Optimization", "Model Routing", "Ollama", "Budget", "Heartbeat", "lossless-claw"]
featured: true
---

# How to Run OpenClaw for Under $30/Month (The Complete Cost Guide)

AgentPuter · March 2026 · ~20 min · #OpenClaw #CostOptimization #ModelRouting #Ollama #Budget

> **Sources:**
> - [How to stop burning money on OpenClaw](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) — r/PromptEngineering
> - [Best affordable LLM right now (Feb 2026)](https://github.com/openclaw/openclaw/discussions/12267) — GitHub Discussion #12267
> - [How the MemOS Plugin Cuts OpenClaw Token Costs by 70%](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) — Medium, Mar 4, 2026
> - [ibl.ai OpenClaw Router](https://github.com/iblai/iblai-openclaw-router) — GitHub
> - [Reduce Your OpenClaw LLM Costs: SaladCloud Guide](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — SaladCloud Blog, Feb 9, 2026
> - [Why is OpenClaw so token-intensive? 6 reasons analyzed](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) — Apiyi Blog, Feb 2026
> - [How I Run 19 OpenClaw Agents for $6/Month](https://www.youtube.com/watch?v=-MtzLiQ9w1c) — YouTube, Mar 1, 2026
> - [OpenClaw 2026.3.7 Release Notes](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [OpenClaw 2026.3.8 Release Notes](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8) — GitHub

---

Last week we covered how [lossless-claw fixes OpenClaw's memory ceiling](/blog/lossless-claw) — keeping your agent's context intact across week-long sessions. But there's a second question the community asks even more often than "why does my agent forget?":

*"Why does my agent cost so much?"*

One user spent $254 in two weeks. Another hit $800 in a month. Tech blogger Federico Viticci racked up a [$3,600 monthly bill](https://medium.com/@reza.ra/openclaw-the-ai-agent-that-burns-through-your-api-budget-and-how-to-fix-it-050fc57552c9) running intensive multi-channel automation. Someone woke up to a $141 surprise because their heartbeat was running Opus overnight.

These aren't power users pushing the limits. These are normal setups with normal usage.

OpenClaw is free. The models it calls are not. And because OpenClaw is designed to run 24/7 — checking in, browsing, thinking, heartbeating — the costs compound in ways that most people don't expect until the invoice arrives.

This post is the guide that should have shipped with OpenClaw. We'll walk through exactly where the money goes, what the latest releases (3.7 and 3.8) changed to help, and how real users have cut their bills from hundreds to under $30 a month — without giving up anything that matters.

---

## Where the Money Actually Goes

Before you can cut costs, you need to understand the six places OpenClaw burns tokens. Most users only think about the first one.

### 1. System Context (Every Single Call)

Every time OpenClaw makes an API call, it loads your `SOUL.md`, `AGENTS.md`, and other bootstrap files into the prompt. These aren't loaded once — they're sent with **every request**. If your SOUL.md is 85KB (21,400 tokens), that's 21,400 tokens billed before the model even reads your message.

One user on r/LocalLLaMA [cut their bootstrap from 85KB to 27KB](https://www.reddit.com/r/LocalLLaMA/comments/1r3ro5h/) — a 69.8% reduction — by removing three-month-old project background that was loaded every time but almost never referenced.

### 2. Conversation History (It Only Grows)

Your session history grows with every exchange. After a few hours of active use, you're carrying tens of thousands of tokens in history. All of it tags along with every new request. This is the single biggest cost driver for heavy users — and the reason [lossless-claw](/blog/lossless-claw) matters (more on that below).

### 3. Heartbeat (The Silent Killer)

OpenClaw's heartbeat runs every 30 minutes by default. Each check is a full API call with all your system context included. On Opus, that's a meaningful expense — 48 heartbeats per day, each carrying your full system prompt.

One user reported spending $50 in a single day on heartbeats alone. Another had [5.7 million tokens consumed overnight](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — most of it from heartbeats and scheduled tasks they'd forgotten were running.

### 4. Sub-Agent Spawning

When your main agent delegates to sub-agents, each one spins up with its own context, its own memory, its own model calls. Users running multi-agent setups (one for writing, one for research, one for coding) are paying context overhead for every agent — and losing context on every handoff.

### 5. Tool Outputs

Browser scrapes, file reads, search results — tool outputs get stored in the transcript and resent with subsequent messages. A single web scrape can dump thousands of tokens into your history that persist for the rest of the session.

### 6. Model Choice

Without routing, every single request — including a heartbeat that just checks "anything new?" — goes to your primary model. If that's Opus at $5/$25 per million tokens, you're paying premium rates for work that Haiku could handle at $1/$5.

---

## If You Haven't Started Yet: The Free Way In

Before we get to optimization, a note for anyone who hasn't set up OpenClaw yet.

You don't need to spend a dollar to try it. **Gemini 2.5 Flash-Lite** has a [free tier](https://ai.google.dev/gemini-api/docs/pricing) with generous daily quotas — enough to run a basic agent for light personal use. MiniMax M2.5 Standard at $0.15/$1.20 per million tokens is the next step up — less than a penny per typical agent interaction.

The minimal setup:

```json5
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // free tier
    }
  }
}
```

Connect one channel (just Telegram or WebChat), keep SOUL.md short, and you have a working personal agent at zero cost. Scale up from there.

---

## What 3.7 and 3.8 Changed (Cost-Relevant Features)

The last two releases included several features that directly affect costs. Here's what matters:

### From 3.7 (March 8)

**Context Engine Plugin API + lossless-claw.** The [lossless-claw plugin](/blog/lossless-claw) keeps your active context in the 30–100K token range no matter how long the conversation runs. Without it, sessions either overflow (forcing compaction, which loses information) or you manually reset (losing everything). Either way, you end up redoing work — which means more tokens. lossless-claw's author reports zero-maintenance context management across week-long sessions.

**MiniMax-M2.5-highspeed as first-class model.** No longer a hack — it's properly wired in the model catalog, onboarding, and routing. This is a fast, cheap model that handles 80% of routine agent work.

**Ollama embeddings for memory search.** Your long-term memory can now stay fully local. No API calls for memory retrieval.

**Docker multi-stage slim builds.** Smaller container images = cheaper hosting if you're running on a cloud VPS.

### From 3.8 (March 9 — today)

**`openclaw backup create` and `openclaw backup verify`.** Not directly a cost feature, but if you've ever lost a configuration and had to rebuild — that's wasted time and tokens re-establishing context with your agent.

**Brave web search LLM-context mode.** `tools.web.search.brave.mode: "llm-context"` returns extracted grounding snippets instead of raw page content. Structured search results mean fewer follow-up tokens to parse and re-query.

**Talk mode silence timeout.** `talk.silenceTimeoutMs` lets you control when voice input auto-sends. Prevents premature sends that waste a round-trip API call on half a sentence.

**GPT-5.4 context window fix.** The 1,050,000-token context window and 128K max output tokens for `openai-codex/gpt-5.4` are now correctly applied. If you're on a Codex subscription, this means fewer context-overflow compactions.

---

## Strategy 1: Check Your Bill (5 Minutes, Zero Cost)

Every user who cut their bill says the same thing: the fix was not a specific technique — it was seeing where the money went.

Log into your API provider dashboard right now. Look at per-day spending. Find the spikes. A user on [r/openclaw tracked every dollar for 30 days](https://www.reddit.com/r/LocalLLM/comments/1rl30k1/i_tracked_every_dollar_my_openclaw_agents_spent/) across four agents and found that 70% of their 18,000 monthly API calls were "dead simple" — FAQ answers, formatting, one-line summaries — that absolutely didn't need their primary model.

Inside OpenClaw, use `/status` to see the current session's model and token count. Use `/usage full` to get per-response cost breakdowns. You can't optimize what you can't measure.

---

## Strategy 2: Fix Your Heartbeat (One Config Change, Saves $30–50/Month)

The heartbeat is the most common source of unexpected costs. Default: every 30 minutes, full API call, primary model. That's 48 calls per day, each carrying your full system prompt.

**Reduce the frequency:**

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        intervalMinutes: 120
      }
    }
  }
}
```

That takes you from 48 to 12 calls per day — a 75% reduction in heartbeat costs with minimal impact on responsiveness.

**Route heartbeats to a cheap model.** If you're using a routing proxy (see Strategy 5), heartbeats get auto-classified as "light" and sent to Haiku. If using a local model via Ollama, heartbeats cost $0.

---

## Strategy 3: Trim Your SOUL.md (Delete Text, Save 70%)

Every token in your system prompt gets billed on every call. This is the multiplicative cost most people miss.

A real example from the community:

| Metric | Before | After |
|--------|--------|-------|
| SOUL.md size | 85 KB (21,400 tokens) | 27 KB (6,472 tokens) |
| Reduction | — | 69.8% |
| Monthly impact (24/7 agent) | ~$45 just for bootstrap overhead | ~$14 |

Open your SOUL.md. Read every line. Ask: "Does the agent actually need this on every single call?" Project-specific context from three months ago? Move it to a skill. Historical notes? Move them to a reference file. Your system prompt should be lean and timeless.

Also: use `/new` when switching between unrelated tasks. Don't carry a 50,000-token conversation about project A into project B.

---

## Strategy 4: Enable Prompt Caching (One Line, Saves 40% on Input)

This is the easiest win that the article's source data repeatedly highlights.

Anthropic supports automatic prompt caching for Claude models. Because OpenClaw sends the same system prompt (SOUL.md + AGENTS.md) on every call, it's a perfect caching candidate. The first call pays full price; subsequent calls within the cache window get the system prompt tokens at a 90% discount.

A user [tracking costs over 30 days](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/) reported: *"Enabling prompt caching cut the input token cost for support by around 40%. Probably the easiest win."*

For Anthropic models, prompt caching is enabled by default in recent OpenClaw versions. For other providers, check if your model supports it — Google's Gemini models also offer [context caching](https://ai.google.dev/gemini-api/docs/pricing) at significant discounts.

---

## Strategy 5: Route Models by Task (Saves 70–90%)

This is the highest-impact structural change. The idea: not every request deserves your most expensive model.

A heartbeat check that asks "anything new in my inbox?" doesn't need Opus. A message classification ("is this urgent?") doesn't need Sonnet. These are Haiku-level tasks.

Here's a real cost comparison from the community:

| Setup | Monthly Cost | Notes |
|-------|-------------|-------|
| Everything on Opus | $347 | Default single-model config |
| Routed (Haiku/Sonnet/Opus) | $68 | Same workload, same quality |
| Everything on Opus | $150 | Lighter workload |
| Routed | $35 | Same user, same tasks |

**How to do it — Option A: Manual config**

Set your default model to something cheap and use Opus only where you explicitly need it:

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-haiku-4-5",  // default for everything
      subagents: {
        model: "anthropic/claude-haiku-4-5", // sub-agents too
      }
    }
  }
}
```

Then switch to a stronger model when you need reasoning:

```
/model claude-opus-4-6
```

When you're done with the complex task, switch back:

```
/model claude-haiku-4-5
```

**How to do it — Option B: Auto-routing proxy**

Several open-source routers now exist that classify each request and route automatically:

- [**ibl.ai OpenClaw Router**](https://github.com/iblai/iblai-openclaw-router) — zero-dependency Node.js proxy, scores requests across 14 dimensions in <1ms, routes to Light (Haiku) / Medium (Sonnet) / Heavy (Opus). Runs locally, no data sent to third parties.
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) — 15-dimension local scoring, community reports ~90% savings vs always-Opus.

Both sit between OpenClaw and the API endpoint. Install, point your config at the local proxy, and routing happens automatically.

**How to do it — Option C: Use the model fallback system**

OpenClaw natively supports fallback chains:

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: [
          "anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

This isn't routing by complexity — it's a safety net for rate limits and outages. But combined with per-channel or per-agent model assignment, you can route different workloads to different price tiers.

---

## Strategy 6: One Agent, Many Skills (The Biggest Savings Nobody Talks About)

This comes directly from the [r/PromptEngineering cost guide](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/):

> *"One user went from spending hundreds per week on a multi-agent setup to $90 per month with a single agent and a dozen skills. The quality went up because context stopped getting lost between handoffs."*

Every agent instance has overhead: its own system prompt, its own memory, its own context window. Running five agents means paying five times the bootstrap cost on every call.

OpenClaw Skills are markdown files that give your agent new capabilities without spawning a new instance. Same brain, same memory, same context. A skill for writing, a skill for research, a skill for coding — all running in one agent session.

```
~/.openclaw/workspace/skills/
├── research/SKILL.md
├── writing/SKILL.md
├── coding/SKILL.md
└── calendar/SKILL.md
```

The agent picks the right skill based on what you ask it to do. No handoff. No context loss. No duplicated bootstrap tokens.

**When to use multi-agent:** When you genuinely need parallel execution — multiple tasks running simultaneously, not sequentially. For everything else, skills are cheaper and better.

---

## Strategy 7: Run Local Models for Routine Work (Zero Marginal Cost)

Running a model on your own hardware means every inference is free after the initial setup.

**What works for OpenClaw:**

| Model | Hardware | Speed | Good For |
|-------|----------|-------|----------|
| Qwen 3 32B | RTX 4090 | 40+ tok/s | General agent work |
| Qwen 3 14B | RTX 3060 / Mac Mini M2 | 25+ tok/s | Heartbeats, classification |
| Llama 3.3 70B | 2x RTX 4090 | 20+ tok/s | Code, complex reasoning |

**Setup with Ollama:**

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull your model
ollama pull qwen3:32b

# OpenClaw config
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434"
      }
    }
  }
}
```

OpenClaw 3.7+ supports Ollama embeddings natively for memory search, so your long-term memory also stays local.

**The hybrid approach** (what most cost-conscious users do): local model as default for routine tasks, cloud API (Sonnet or Opus) only when the agent needs deep reasoning. One YouTube creator documented running [19 agents for $6/month](https://www.youtube.com/watch?v=-MtzLiQ9w1c) using MiniMax M2.5 for general work and only routing to frontier models for complex tasks.

**Use vector memory instead of raw context.** OpenClaw's memory search pulls relevant memories via embedding search rather than loading everything into the prompt. With Ollama embeddings (3.7+), this is both smarter and free:

```json5
{
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  }
}
```

**Install lossless-claw.** As covered in [our previous post](/blog/lossless-claw), the lossless-claw plugin keeps active context between 30K–100K tokens through incremental summarization. You never hit the ceiling that forces emergency compaction, and you never lose information that forces you to redo work.

---

## 2026 Model Price Guide

Model pricing changes fast. Here's where things stand as of March 2026:

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Best For | Source |
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | $0.07 | $0.40 | Budget extraction, simple queries | Z.AI |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | Light tasks, 1M context window | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| **MiniMax M2.5 Standard** | $0.15 | $1.20 | General agent work, 197K context | [MiniMax](https://www.minimax.io/news/minimax-m25) |
| **Claude Haiku 4.5** | $1.00 | $5.00 | Heartbeats, classification, formatting | Anthropic |
| **Claude Sonnet 4.6** | $3.00 | $15.00 | Structured tasks, code review | Anthropic |
| **Claude Opus 4.6** | $5.00 | $25.00 | Complex reasoning, architecture | [Anthropic](https://www.anthropic.com/claude/opus) |
| **Ollama (local)** | $0 | $0 | Heartbeats, embeddings, routine tasks | Self-hosted |

The math is simple: if 80% of your agent's calls are routine and you route them to Haiku ($1/$5) instead of Opus ($5/$25), you've cut your bill by 80% on those calls. Add prompt caching, a trimmed SOUL.md, and local models for heartbeats and embeddings, and a $200/month agent drops to under $30.

---

## Putting It All Together: The $30/Month Config

Here's a real-world configuration for a productive 24/7 OpenClaw agent that keeps costs under $30/month:

```json5
{
  agents: {
    defaults: {
      // Sonnet for your main interaction — strong enough for real work
      model: "anthropic/claude-sonnet-4-6",

      // Sub-agents use Haiku by default
      subagents: {
        model: "anthropic/claude-haiku-4-5",
        runTimeoutSeconds: 120
      },

      // Heartbeat: local model, longer interval
      heartbeat: {
        intervalMinutes: 120,
        // Or route to Haiku if no local model
      }
    }
  },

  // Local Ollama for embeddings (free memory search)
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // lossless-claw to prevent context blowup
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // Brave search with LLM-context mode (fewer follow-up tokens)
  tools: {
    web: {
      search: {
        brave: {
          mode: "llm-context"
        }
      }
    }
  }
}
```

**Monthly cost breakdown (estimated, 30 days):**

| Component | Tokens/day | Model | Cost/month |
|-----------|-----------|-------|------------|
| Main interaction (~2 hr active) | ~80K (50K in + 30K out) | Sonnet | ~$18 |
| Sub-agent calls | ~30K | Haiku | ~$1.50 |
| Heartbeat (12/day) | ~30K | Local/Haiku | $0–$1 |
| Memory embeddings | — | Local (Ollama) | $0 |
| Web search follow-ups | ~20K | Sonnet | ~$2 |
| Prompt caching savings | — | — | –$4 |
| **Total** | | | **~$19–22** |

*Calculation: Main interaction = 50K input × $3/M × 30 = $4.50, plus 30K output × $15/M × 30 = $13.50 = $18/month. Prompt caching reduces repeated system prompt input by ~40%.*

That's a fully functional, always-on agent with web browsing, memory, and multi-step reasoning — for less than a Netflix subscription.

---

## The 5-Minute Checklist

If you don't do anything else, do these five things today:

**1. Check your bill.** Log into your API provider dashboard. Look at per-day spending. Find the spikes.

**2. Extend your heartbeat interval.** Add `heartbeat.intervalMinutes: 120` to your config. Instant savings.

**3. Check your SOUL.md size.**

```bash
wc -c ~/.openclaw/workspace/SOUL.md
```

If it's over 30KB, trim it. Move project-specific context to skills.

**4. Set a sub-agent model.** Add `agents.defaults.subagents.model` to your config. Don't let sub-agents inherit your expensive primary model.

**5. Install lossless-claw.** `openclaw plugins install lossless-claw`. Prevents the context blowup → compaction → redo-work cycle that silently doubles your token spend.

---

## What's Coming

The OpenClaw ecosystem is converging on the cost problem from multiple directions:

- **MemOS Cloud Plugin** reported [72% token reduction](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) on the LOCOMO long-conversation benchmark by offloading memory to a dedicated system
- **QMD** (by Shopify co-founder Tobi Lütke) provides 60–97% token savings through local semantic search
- **Auto-routing proxies** like ibl.ai Router and ClawRouter are making manual model selection obsolete
- The **Context Engine API** opened in 3.7 means the community can build entirely new approaches to context efficiency

The trend is clear: the agent runtime is becoming cost-aware at every layer. Context management, memory search, model routing, and tool output handling are all being optimized simultaneously. The $200/month OpenClaw bill is becoming a solved problem for anyone willing to spend 30 minutes on configuration.

---

*Running OpenClaw on a budget? Share your monthly cost and configuration in the comments. We're collecting data for a community cost benchmark — the goal is to find the lowest possible cost for each tier of agent capability.*

*Next up: [OpenClaw vs Nanobot](/blog/openclaw-vs-nanobot) — when a 4,000-line minimal agent from the University of Hong Kong might actually be the right choice.*

---

*Sources: [r/PromptEngineering cost guide](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [GitHub Discussion #12267](https://github.com/openclaw/openclaw/discussions/12267) · [MemOS Plugin analysis](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [ibl.ai Router](https://github.com/iblai/iblai-openclaw-router) · [SaladCloud cost guide](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [Apiyi token analysis](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*
