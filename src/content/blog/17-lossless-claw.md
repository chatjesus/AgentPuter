---
title: "OpenClaw Just Fixed Its Biggest Problem. Here's What lossless-claw Actually Does."
description: "OpenClaw's default compaction fires once, summarizes everything, discards the originals. The longer your agent runs, the more it forgets. Version 2026.3.7 opened the context engine to plugins. lossless-claw is the first one — a DAG-based system that stores every message in full and lets agents retrieve exact historical detail on demand."
date: "2026-03-08"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "lossless-claw", "Context Engine", "Memory", "Plugin", "Long-Running Agents", "LCM"]
featured: true
---

# OpenClaw Just Fixed Its Biggest Problem. Here's What lossless-claw Actually Does.

AgentPuter · March 2026 · ~18 min · #OpenClaw #lossless-claw #ContextEngine #LongRunningAgents #Plugin

> **Sources:**
> - [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) — GitHub repo
> - [Feature: pluggable context systems, LCM for OpenClaw](https://github.com/openclaw/openclaw/discussions/22251) — Discussion #22251, @jalehman, Feb 20, 2026
> - [OpenClaw 2026.3.7 Release Notes](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) — Twitter, Mar 8, 2026
> - [LCM: Lossless Context Management](https://papers.voltropy.com/LCM) — Ehrlich & Blackman

---

Picture this: you've had an OpenClaw agent running a research project for three hours. It's been browsing, taking notes, cross-referencing sources, building up a picture of something complex. Then it hits its context limit.

Compaction fires.

The next message it sends you reads like it just woke up with amnesia. The specific file path it found two hours ago — gone. The decision you made together about which approach to take — summarized into a single vague sentence. The whole thread of reasoning that led you somewhere useful — collapsed into a paragraph that loses the detail that made it matter.

You've been here. Every OpenClaw user has been here.

This isn't a bug. It's by design — and until March 8, 2026, it was the only option any agent had.

OpenClaw 2026.3.7 changed that.

---

## The Problem With Context Compaction (It's Not What You Think)

The standard framing is that compaction is a memory management problem. Token limits are finite. When a conversation grows too long, something has to give. The agent summarizes the oldest parts and continues.

That framing makes it sound like a reasonable engineering trade-off.

It isn't. Here's why.

When OpenClaw's default compaction fires, it does a **one-shot summarization**: the oldest messages get collapsed into a single summary block, that block gets written back into the transcript, and the originals are discarded. The summary is what the model works with going forward. There's no retrieving what was compacted. It's gone.

[@jalehman](https://github.com/jalehman) — the developer who built lossless-claw — described the situation precisely in [Discussion #22251](https://github.com/openclaw/openclaw/discussions/22251):

> *"OpenClaw's compaction does a one-shot summarization when the context window fills up. It works as a safety net, but it's lossy — it doesn't preserve temporal structure, and there's no way to recover detail after compaction fires. This isn't unique to OpenClaw. This is what all agents do."*

That last sentence matters. This isn't an OpenClaw-specific flaw. ChatGPT does this. Claude does this. Every agent framework does this. The entire field has been operating on the assumption that lossy compression is the only option.

**The practical consequences are significant:**

For single-session conversations that wrap up in under an hour, compaction is a minor annoyance at worst. The agent keeps most of what matters and you carry on.

For long-running agents — the ones people are actually deploying to run 24/7, to handle projects that span days or weeks, to coordinate between sub-agents across dozens of tasks — compaction is a structural ceiling. Your agent gets dumber the longer it runs. The most valuable thing about a persistent agent is that it accumulates context and builds on it. Compaction systematically destroys that value.

There's a reason experienced OpenClaw users have developed workarounds: manually running `/compact` at strategic moments, structuring SOUL.md to force key facts to survive compaction, breaking projects into isolated sessions with handoff notes. These are coping mechanisms for a fundamental architectural limitation.

---

## What 2026.3.7 Actually Changed (The Real News)

The headline you'll see on Twitter is "lossless-claw — an OpenClaw plugin that gives your agent perfect memory." That's true, but it's not the actual news.

The actual news is what had to happen in the OpenClaw core before lossless-claw could exist.

Before version 2026.3.7, OpenClaw's context management was **hardcoded into core**. There was no way to swap it out, extend it, or experiment with alternatives without forking the entire codebase. The compaction logic — when it fires, how it summarizes, what it preserves — was baked in. Anyone who wanted to try a different approach had to maintain their own fork of OpenClaw in parallel. That's not a viable path for a plugin.

The PR that @jalehman submitted — [#22201](https://github.com/openclaw/openclaw/pull/22201) — didn't just add lossless-claw support. It **extracted context management into a pluggable interface**. From the 3.7 release notes:

> *"add ContextEngine plugin slot with full lifecycle hooks (bootstrap, ingest, assemble, compact, afterTurn, prepareSubagentSpawn, onSubagentEnded), slot-based registry with config-driven resolution, LegacyContextEngine wrapper preserving existing compaction behavior..."*

What that means in practice: OpenClaw now has a defined interface for context management. Any plugin that implements that interface can replace the built-in engine entirely. The default behavior is preserved — `LegacyContextEngine` is still the fallback if you configure nothing — but the door is now open.

Here's the interface:

```typescript
// OpenClaw 2026.3.7 — Context Engine Plugin Interface
interface ContextEngine {
  bootstrap(ctx):           Promise<void>           // initialize DB, indexes
  ingest(msg):              Promise<void>           // archive every message as it arrives
  assemble(opts):           Promise<AgentMessage[]> // build model context each turn
  compact(ctx):             Promise<void>           // handle compaction trigger
  afterTurn(ctx):           Promise<void>           // post-turn processing
  prepareSubagentSpawn():   ...                     // pass context to spawned sub-agents
  onSubagentEnded():        ...                     // reconcile after sub-agent completes
}
```

This is a complete lifecycle. Every moment that involves context — ingestion, assembly, compaction, sub-agent handoff — is now a hook that a plugin can intercept and replace.

To use an alternative context engine, the configuration is a single line:

```json
{
  "plugins": {
    "slots": {
      "contextEngine": "lossless-claw"
    }
  }
}
```

If you don't add this line, nothing changes. Zero behavior difference from previous versions. The migration path is completely opt-in.

---

## How lossless-claw Works

lossless-claw is the first implementation of this interface. It's built on the [LCM (Lossless Context Management) paper](https://papers.voltropy.com/LCM) by Ehrlich and Blackman — researchers who later endorsed the plugin directly. One of the paper's co-authors, [@belisarius222](https://github.com/belisarius222), wrote in the GitHub discussion:

> *"Josh has made so many improvements on it that I think it should really be called LCM 2.0."*

The core premise is a reframe of the entire problem.

Standard compaction waits for overflow to happen, then reacts. By the time it fires, you've already lost the ability to preserve context properly — you're doing emergency triage on a pile of messages that have built up over hours. The result is inevitably lossy.

lossless-claw doesn't wait. It works **continuously and asynchronously in the background**, making incremental summarization decisions after each exchange, before any overflow crisis occurs. The summaries it creates are not flat text. They're structured nodes in a graph, linked back to the original messages they came from.

### The Architecture: A DAG of Memory

Every message that enters an lossless-claw session gets persisted immediately to a **SQLite database**. Not summarized — stored in full. This is the source of truth. It never gets deleted.

As the conversation grows, lossless-claw creates **summary nodes** over groups of older messages. Those summaries are connected to the original messages in a **DAG (directed acyclic graph)**:

```
Raw messages (stored in full in SQLite, never deleted)
      ↓
  Level-1 summaries (cover 8-16 messages)
      ↓
  Level-2 summaries (cover multiple Level-1 summaries)
      ↓
  Level-3 summaries (capture major project phases)
```

The summaries get progressively more abstract as they go up the tree — detailed and chronological near the bottom, broad and thematic near the top. Each summary carries metadata: the IDs of its source nodes, timestamps, depth, descendant count.

When it's time to assemble context for a new turn, the engine works like this:

```
[Protected fresh tail: most recent N raw messages]
           +
[Summary nodes filling the remaining token budget, oldest to newest]
           +
[Any details the agent explicitly requests via lcm_expand]
```

The model sees recent messages in full, and older material as a hierarchy of summaries. Here's what a summary node actually looks like in the model's context:

```xml
<summary id="sum_abc123" kind="condensed" depth="1"
         descendant_count="8"
         earliest_at="2026-02-17T07:37:00"
         latest_at="2026-02-17T15:43:00">
  <parents>
    <summary_ref id="sum_def456" />
  </parents>
  <content>
    During this session the agent investigated three pricing strategies
    for the API tier. Concluded that usage-based was preferable due to
    [reasons]. Key file written: /workspace/pricing-analysis.md.
    Next step agreed: validate with finance team data.
  </content>
</summary>
```

The agent knows this is a summary. It knows when it covers, how many messages it represents, and where to look if it needs more.

### The Three Retrieval Tools

When a summary isn't enough — when the agent needs the exact file path, the precise wording of a decision, the actual data from a specific research session — it has three tools to reach back into history:

| Tool | What it does |
|------|-------------|
| `lcm_grep` | Full-text search across all stored messages |
| `lcm_describe` | Get a summary of a specific historical period |
| `lcm_expand` | Expand a summary back into its source messages |

`lcm_expand` is the key one. Instead of loading the entire expansion into the main context — which would defeat the purpose — it uses a **sub-agent** to read the expanded content and return only the specific detail that was asked for. The source material is accessed without blowing up the active context window.

This is what @jalehman means by the book analogy in his proposal: *"it's like being able to flip back to any page in the book."* The book isn't destroyed when you put it down. It's on the shelf. You can look up anything.

---

## Does It Actually Work? The Numbers

@jalehman spent nine days building lossless-claw before merging the PR, running it on his own agents for the final week. His assessment in [Discussion #22251](https://github.com/openclaw/openclaw/discussions/22251):

> *"Imagine never needing to run /compact or /new again. [...] have been incredibly impressed with the results: a conversation that feels like it never loses information (because in a way it doesn't), always operates within the 30-100k token range, requires zero maintenance."*

For a more quantitative picture: community developer [@chrysb reported early benchmark results](https://x.com/chrysb/status/2030526852146549140) on Twitter the day of the release. Using the **OOLONG benchmark** — a test suite specifically designed to evaluate long-context retention and task continuity — with Opus 4.6 as the model for both:

| System | OOLONG Score | Notes |
|--------|-------------|-------|
| lossless-claw + OpenClaw | **74.8** | Gap widens with context length |
| Claude Code (default) | 70.3 | Standard sliding window |
| OpenClaw default | ~68 (estimated) | One-shot compaction |

These are community-reported numbers, not official benchmarks, and they'll evolve as more people run tests. But the directional finding holds up structurally: **the longer the context gets, the more lossless-claw's advantage compounds**, because it's the exact scenario where lossy compaction does the most damage.

The LCM paper's co-author @belisarius222 noted one specific improvement @jalehman made over the original paper implementation: **capped input length for summarization**. In the original LCM, summarizing very long content could itself overflow context, cause unpredictable behavior, and introduce edge cases. The capped approach keeps each summarization step predictable, which also makes the system more reliable for the `lcm_expand` sub-agent calls.

---

## Installing and Configuring lossless-claw

**Prerequisite: OpenClaw 2026.3.7 or later.** The Context Engine plugin slot doesn't exist in earlier versions.

> **Heads up:** The initial 2026.3.7 release has a known P1 registry bug ([Issue #40096](https://github.com/openclaw/openclaw/issues/40096)) where the context-engine module is split across bundle chunks, causing lossless-claw to fail with "Context engine 'lossless-claw' is not registered." The fix landed in PR #40115. Verify your installed version includes this patch before proceeding — run `openclaw --version` and check the OpenClaw changelog for 3.7.x.

```bash
# Verify your version first
openclaw --version
# Should show: openclaw 2026.3.7 or higher (with the registry fix)

# Install the plugin
openclaw plugins install lossless-claw

# Restart the gateway
openclaw restart
```

In most cases, `openclaw plugins install` will auto-configure the contextEngine slot. To verify it's active:

```bash
openclaw config show | grep contextEngine
# Expected: contextEngine: "lossless-claw"
```

If you need to set it manually, add this to your config:

```json5
{
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  }
}
```

### Who Should Enable It

lossless-claw is not the right choice for every OpenClaw setup. It adds overhead — both in storage (SQLite database that grows with your conversation history) and in token usage (the summarization process itself consumes tokens).

**Enable lossless-claw if:**
- Your agent runs 24/7 and handles ongoing projects
- You're doing multi-session research where continuity matters
- You're running sub-agent systems where context handoff is critical
- You've ever lost important information to compaction and had to start over

**Stick with the default engine if:**
- You're using OpenClaw primarily for single-session tasks that complete in under an hour
- You're running high-frequency short tasks (cron jobs, daily summaries, one-shot queries)
- You're highly cost-sensitive and haven't hit compaction problems yet

### Managing the Token Cost

lossless-claw uses an LLM to generate summaries. That costs tokens. For most long-running workflows, the savings from avoiding session resets far outweigh the summarization overhead — but if you're cost-conscious, there's a smart way to configure this:

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-opus-4-6",
    }
  },
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  }
}
```

The lossless-claw documentation recommends using a fast, cheap model for the background summarization work — something like `anthropic/claude-haiku-4-5` or `MiniMax-M2.5-highspeed` — while keeping your primary reasoning model unchanged. Check the [lossless-claw README](https://github.com/Martian-Engineering/lossless-claw) for the exact config key to point summarization at a different model. The summarization task is straightforward enough that a smaller model handles it well, and the cost difference is significant.

@jalehman's implementation also aims to keep active context in the **30-100k token range** through the adaptive summarization cadence — so token usage stays predictable even as conversation history grows indefinitely.

---

## What This Unlocks Beyond lossless-claw

The lossless-claw plugin itself is valuable. But the bigger shift is what the Context Engine API makes possible for the community going forward.

Before 3.7, every attempt to improve context management in OpenClaw hit the same wall: it was hardcoded. You could write skills that tried to manage state externally. You could structure your SOUL.md to preserve key facts. You could run manual `/compact` at strategic moments. None of those approaches could touch the core mechanism.

Now the interface is open.

A few directions already being discussed in the community:

**Vector search as a storage backend.** SQLite full-text search is good for keyword queries. A vector embedding backend would support semantic search — finding conceptually relevant historical content even when the exact words aren't there. @belisarius222's original Volt implementation used this approach.

**RAG-integrated context engines.** An engine that draws not just on the conversation history but on an external knowledge base — your Notion workspace, your codebase, your document library — assembled dynamically each turn based on what the current task needs.

**Shared memory pools across agents.** A context engine that multiple agents can read and write to simultaneously, enabling true multi-agent knowledge sharing without having to route everything through a central coordinator.

**Obsidian / Notion as the memory backend.** Rather than a local SQLite database, persist everything into a structured external workspace where you can browse and edit it yourself. Your agent's memory becomes auditable and searchable from outside the agent.

These aren't speculative. They're natural extensions of the same interface that lossless-claw already implements.

From an infrastructure standpoint, this is how mature platforms evolve. OpenClaw shipped browser automation, then opened the browser tool to customization. It shipped skills, then built ClawHub to distribute them. It shipped context management, then opened the context engine. The pattern is consistent: build it first, then make it extensible.

Context management is the most fundamental layer in an agent system. It determines what the agent knows, how it reasons over time, and what it can actually accomplish across long-running tasks. Opening it up is not a minor feature. It's an architectural decision about who controls the agent's memory.

---

## What Else Changed in 3.7

lossless-claw got the most attention, but two other features in the 3.7 release are worth noting:

**Per-topic agent routing in Telegram.** Forum groups can now route different topics to different agents. One Telegram group, multiple specialized agents — each handling a different topic thread with isolated sessions. This has been a requested feature for multi-agent team setups for months.

**iOS App Store Connect prep.** Bundle identifiers, Fastlane automation, screenshot metadata — all the infrastructure for an App Store submission is now in the codebase. OpenClaw on mobile is coming.

---

## The Upshot

OpenClaw has had a silent ceiling since day one: the longer your agent runs, the more it forgets. Every serious use case eventually hits it. The community has been working around it for months with SOUL.md tricks, manual compaction timing, and careful session management.

3.7 doesn't just fix the symptom. It opens the problem to the community.

lossless-claw is the first answer — a DAG-based summarization system that stores everything, summarizes incrementally, and lets agents retrieve exact historical detail on demand. Early community benchmark numbers show it outperforming Claude Code's default engine at every context length tested, with the gap widening as conversations get longer.

If you've ever had an agent forget something it shouldn't have, this release is for you.

```bash
openclaw update
openclaw plugins install lossless-claw
```

That's the whole migration.

---

*How long before your agents hit compaction? And what do you lose when they do? Drop it in the comments — we're tracking how different workflow types experience context degradation, and we want the data.*

*Next up: [OpenClaw vs Nanobot](/blog/openclaw-vs-nanobot) — a 4,000-line minimal agent from researchers at the University of Hong Kong. When does "less is more" actually apply to agent infrastructure?*

---

*Sources: [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) · [OpenClaw Discussion #22251](https://github.com/openclaw/openclaw/discussions/22251) · [OpenClaw 2026.3.7 Release Notes](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) · [LCM Paper, Ehrlich & Blackman](https://papers.voltropy.com/LCM)*
