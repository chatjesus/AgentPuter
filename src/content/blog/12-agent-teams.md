---
title: "From One Agent to a Team: How OpenClaw Sub-Agents Work"
description: "An Anthropic researcher spent $20,000 letting 16 parallel Claude agents write a C compiler. OpenClaw's Sub-Agent system lets you run the same architecture for your morning briefing — for about $0.03. Here's how."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "10 min"
tags: ["OpenClaw", "Sub-Agents", "Agent Teams", "Parallel Agents", "sessions_spawn", "Claude Code"]
featured: false
---

# From One Agent to a Team: How OpenClaw Sub-Agents Work — And What Anthropic's $20K Compiler Experiment Tells Us About the Future

**In February, an Anthropic researcher spent $20,000 to let 16 parallel Claude agents write a C compiler. OpenClaw's Sub-Agent system lets you run the same architecture for your morning briefing — for about $0.03.**

*Agent Infrastructure Series · Part 12*

---

This month, Anthropic researcher Nicholas Carlini published an experiment that feels less like software engineering and more like biological evolution.

He tasked 16 instances of Claude Opus 4.6 to work in parallel for two weeks. They generated nearly 2,000 coding sessions, consumed 2 billion input tokens, and cost just under $20,000 in API fees.

The result? A 100,000-line Rust-based C compiler, written from scratch, capable of compiling the Linux 6.9 kernel for x86, ARM, and RISC-V architectures. It even runs Doom.

This wasn't a demo of a shiny new "Make App" button. It was a raw research prototype built with the most basic coordination primitives: a Docker container per agent, a shared git repo, and file locks — no central orchestrator, no message broker.

Most of us don't have $20,000 to spend on API calls this week. But the architectural pattern Carlini used — decomposing a massive objective into parallel tasks for independent agents — is exactly what OpenClaw's **Sub-Agent** system is built for.

You can use the same logic to cut your morning briefing runtime from 40 seconds to 20 seconds. And you can do it for pennies.

---

## First: Let's Clear Up the Confusion

There are three "multi-agent" concepts floating around the community right now. They sound similar, but they are completely different tools.

| Concept | What it is | Where you use it |
|---------|------------|------------------|
| **Claude Code Agent Teams** | An experimental feature in Anthropic's `claude` CLI tool. It allows teammates to message each other directly via a "Mailbox" system. | **Claude Code** (coding tool, Alpha stage) |
| **$20K Compiler Experiment** | Nicholas Carlini's research prototype. It used bare git repos and file locks for coordination — no central orchestrator, no chat interface. | **Research Paper** (not a product) |
| **OpenClaw Sub-Agents** | OpenClaw's built-in `sessions_spawn` tool. A main agent dispatches tasks to background worker agents, which report back when done. | **OpenClaw** (general-purpose agent) |

**This article is about OpenClaw Sub-Agents.** It's the only one of the three that is production-ready for general automation tasks today.

---

## How OpenClaw Sub-Agents Work

Instead of one agent doing everything sequentially, a "Main Agent" spawns "Sub-Agents" to do work in the background.

```
Main Agent (Depth 0)
    │
    ├── sessions_spawn(task="Research competitor A")
    │       └── Sub-Agent A (Depth 1, isolated session)
    │               └── work... work... → announce back results
    │
    ├── sessions_spawn(task="Research competitor B")
    │       └── Sub-Agent B (Depth 1, isolated session)
    │               └── work... work... → announce back results
    │
    └── Receives results → Synthesizes final report
```

### Key Behaviors

1.  **Non-Blocking:** The `sessions_spawn` command returns a `runId` immediately. The Main Agent can keep working or spawn more agents without waiting.
2.  **Context Isolation:** Each Sub-Agent runs in its own fresh session. They do not inherit the Main Agent's chat history. This keeps their context windows clean and focused.
3.  **Selective Memory:** Sub-Agents inject `AGENTS.md` and `TOOLS.md`, but **not** `SOUL.md`, `IDENTITY.md`, or `USER.md`. They are ephemeral workers, not personalized assistants.
4.  **Concurrency:** By default, a single agent can spawn up to 5 active children. The system caps global concurrency at 8 to prevent API rate limits.

### The Command

The tool is `sessions_spawn`. Note the parameter name is `task`, not `instruction`.

```javascript
sessions_spawn({
  task: "Search for the latest HackerNews AI headlines and return top 5",
  model: "gpt-4o-mini",         // Use a cheaper model for the worker
  runTimeoutSeconds: 120,       // Safety cutoff
  label: "news-fetcher",        // For your logs
  cleanup: "delete"             // Auto-delete session when done
})
```

---

## Four Real-World Architectures

### Pattern 1: Coordinator + Workers (Most Common)

This is the standard pattern for research or batch processing.

```
Main Agent (Coordinator)
  ├── Worker A: Research Notion's pricing model
  ├── Worker B: Research Linear's pricing model
  └── Worker C: Research Monday.com's pricing model
Main Agent combines inputs into a pricing comparison table.
```

**Why it works:** If you did this sequentially, the Main Agent's context window would fill up with raw HTML from three different pricing pages. By parallelizing, each Worker processes the raw data and returns only the structured summary.

**Recommended Worker Model:** `gpt-4o-mini` or `gemini-2.5-flash` (low cost).

### Pattern 2: The Pipeline

```
Sub-Agent 1: Scrape raw data (web-search skill)
      ↓
Sub-Agent 2: Clean and structure data (reasoning skill)
      ↓
Sub-Agent 3: Generate insights (analysis skill)
      ↓
Main Agent: Format for delivery
```

**Why it works:** It isolates the "messy" parts of the process. The agent doing the high-value analysis never sees the raw HTML junk from step 1.

### Pattern 3: Specialist Routing

Instead of one generalist agent, the Main Agent acts as a router.

```
Main Agent (Router)
  ├── "Schedule a meeting"   → Google Calendar specialist Agent
  ├── "Draft an email"       → Writing specialist Agent
  └── "Research this topic"  → Web search specialist Agent
```

**Pro Tip:** Since Sub-Agents don't load `SOUL.md`, you should put your routing logic in `AGENTS.md`.

```markdown
## AGENTS.md Routing Rules

When routing tasks to sub-agents:
- Calendar requests: spawn with google-calendar and google-workspace skills
- Research requests: spawn with web-search skill, use gpt-4o-mini model
- Writing requests: spawn with writing context explicitly injected in task description
```

### Pattern 4: Fan-Out / Fan-In (The Morning Briefing)

This is the "Hello World" of parallel agents.

**Sequential (Old Way):** Check weather (5s) → Check calendar (5s) → Check email (10s) → Check news (10s) → Summarize (5s). Total: **~35 seconds.**

**Parallel (New Way):**
7:00 AM → Main Agent spawns 4 workers instantly:
*   **Agent A:** AccuWeather forecast for San Francisco
*   **Agent B:** Google Calendar meetings for today
*   **Agent C:** Gmail unread summary (flag urgent items)
*   **Agent D:** HackerNews + TechCrunch top 5 headlines

Total time is determined by the slowest agent (~15s) + synthesis (5s) = **~20 seconds.**

---

## Critical Cost Strategy: "Smart Boss, Cheap Interns"

The biggest risk with Sub-Agents is cost multiplication. If you spawn 5 agents and they all use Claude Opus 4.6, you just multiplied your API bill by 5.

The solution is explicit model assignment.

**The Boss (Main Agent):** Needs high reasoning capability to decompose tasks and synthesize results.
*   **Model:** `anthropic/claude-opus-4-6` or `claude-sonnet-4-6`

**The Interns (Workers):** Usually performing clear, bounded tasks (summarize this, find that).
*   **Model:** `openai/gpt-4o-mini` or `google/gemini-2.5-flash`

You can set this default in your config to avoid accidents:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "openai/gpt-4o-mini",
        "maxSpawnDepth": 1,
        "maxChildrenPerAgent": 5
      }
    }
  }
}
```

---

## Advanced: The Orchestrator Pattern (Depth 2)

By default, OpenClaw sets `maxSpawnDepth: 1`, meaning a Sub-Agent cannot spawn its own Sub-Agents.

For complex projects, you can enable Depth 2:

```json
{ "agents": { "defaults": { "subagents": { "maxSpawnDepth": 2 } } } }
```

This enables a three-layer hierarchy:

```
Main Agent (CEO)
  └── Orchestrator Agent (Manager) — Has sessions_spawn permission
        ├── Worker A (Intern) — Cannot spawn
        ├── Worker B (Intern)
        └── Worker C (Intern)
```

This mirrors the structure of the $20K compiler experiment: a high-level goal is set, an autonomous entity manages the breakdown, and individual workers execute the pieces.

---

## OpenClaw vs. Claude Code Agent Teams

Both exist. Which one should you actually use?

| Feature | OpenClaw Sub-Agents | Claude Code Agent Teams |
| :--- | :--- | :--- |
| **Target Audience** | General automation (email, research, ops) | Coding & software engineering |
| **Communication** | Hub-and-spoke (Workers report to Main) | Mesh (Teammates message each other) |
| **Maturity** | Production-ready feature | Alpha / Experimental |
| **Setup** | Built-in, no configuration needed | Requires editing `settings.json` |
| **Context** | Independent per agent | Independent per agent |

If you are building a compiler, use Claude Code. If you are building a personal assistant or a business workflow, use OpenClaw.

---

## Practical Limitations

1.  **One-Way Communication:** Sub-Agents can only "announce back" to their parent. They cannot query the parent for clarification mid-task.
2.  **No `SOUL.md`:** Remember, Sub-Agents are blank slates. If you want them to have a personality or specific behavioral rules, you must include those instructions in the `task` prompt or `AGENTS.md`.
3.  **Concurrency Limits:** Don't try to spawn 50 agents at once. You'll hit API rate limits instantly. The default cap is 8 concurrent sessions.

---

## If You Don't Want to Manage This: TinyClaw

Managing parallel agent architectures, configuring `maxSpawnDepth`, and monitoring token costs across multiple models is complex.

[TinyClaw](https://tinyclaw.dev) simplifies this:

*   **Cost Guardrails:** Built-in dashboard shows exactly how much your "interns" are spending.
*   **Smart Defaults:** Comes with optimized sub-agent configurations out of the box.
*   **One-Click Deploy:** Get a fully configured OpenClaw instance running in 60 seconds.

Running a team of agents doesn't have to cost $20,000. Start with a morning briefing.

→ [tinyclaw.dev](https://tinyclaw.dev) · Free to start · Your agent team running in 60 seconds

---

*Data sources: Anthropic Engineering Blog ("Building a C compiler with a team of parallel Claudes", Feb 2026); OpenClaw Documentation (docs.openclaw.ai/tools/subagents).*

*Need 24/7 uptime for your agent teams? Check out [AgentPuter](https://www.agentputer.com/) for managed cloud hosting.*
