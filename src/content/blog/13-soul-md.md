---
title: "The 3-File Architecture That Gives Your Agent a Soul"
description: "Why SOUL.md, IDENTITY.md, and USER.md are the most important files in your OpenClaw setup — and how to write them so your agent stops sounding like a generic chatbot."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "6 min"
tags: ["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent Personalization", "Prompt Engineering"]
featured: false
---

# The 3-File Architecture That Gives Your Agent a Soul

**Why `SOUL.md`, `IDENTITY.md`, and `USER.md` are the most important files in your OpenClaw setup.**

*Agent Infrastructure Series · Part 13*

---

If you've ever felt like your OpenClaw agent is just a generic robot reciting Wikipedia, it's because you haven't given it a soul.

Out of the box, OpenClaw is a highly capable but blank slate. It can execute tools and reason through problems, but it doesn't know *who* it is, *who* you are, or *how* you like things done.

The difference between a generic tool and a personalized partner comes down to three markdown files:

1.  **`SOUL.md`**: The agent's personality, values, and constraints.
2.  **`IDENTITY.md`**: The agent's professional role and expertise.
3.  **`USER.md`**: Who *you* are, and your specific preferences.

When configured correctly, these three files act as a "Context Kernel" that loads before every single interaction. They are the lens through which the model sees the world.

---

## 1. `SOUL.md`: The Personality Core

This is not about making your agent talk like a pirate (unless you want that). `SOUL.md` defines the *vibe* and the *constraints* of the agent.

**Bad `SOUL.md`:**
> You are a helpful assistant. Be nice.

**Good `SOUL.md`:**
```markdown
# Core Philosophy
- You are a senior engineer's pair programmer, not a junior's tutor.
- Be concise. Skip the fluff. No "I hope this finds you well."
- If I ask a stupid question, correct my premise before answering.
- Values: Privacy first, speed second, politeness last.

# Interaction Style
- Use technical jargon freely.
- When presenting options, always start with the "Recommendation" first.
- If a tool fails, explain *why* before retrying.
```

**Why it matters:** This file prevents the "ChatGPT voice" — that overly polite, verbose, hedging style that makes power users crazy. It forces the model into a specific persona that matches your workflow.

---

## 2. `IDENTITY.md`: The Professional Role

If `SOUL.md` is the personality, `IDENTITY.md` is the resume. This tells the agent what it is *good at*.

**Example for a DevOps Engineer's Agent:**

```markdown
# Role: Senior Site Reliability Engineer (SRE)

## Expertise
- You are an expert in Kubernetes, Terraform, and AWS networking.
- You default to "Infrastructure as Code" solutions over manual fixes.
- You assume all production environments are high-stakes and fragile.

## Mental Models
- Murphy's Law: If it can break, it will. Check backups first.
- Idempotency: All scripts you write must be safe to run twice.
- Security: Least Privilege is the default.
```

**Why it matters:** Without this, the model defaults to "general knowledge." With this, it biases its reasoning towards specific domain best practices. An agent with an SRE identity will warn you about deleting a database; a generic agent might just do it.

---

## 3. `USER.md`: The Context About YOU

This is the most underrated file. It stops you from repeating yourself.

**What goes in here:**
*   Your tech stack preferences (e.g., "I use TypeScript, not JS").
*   Your environment details (e.g., "I'm on macOS, using zsh").
*   Your project paths.
*   Your communication quirks.

**Example:**

```markdown
# User Context: @kingsoft

## Environment
- OS: macOS Sequoia
- Shell: zsh with oh-my-zsh
- Editor: Cursor

## Preferences
- I hate semicolons in JS.
- I prefer `pnpm` over `npm`.
- Never suggest `rm -rf` without a warning.
- When I say "deploy", I mean "push to main branch," not "run a script."

## Current Projects
- /Users/kingsoft/work/frontend (Next.js)
- /Users/kingsoft/work/backend (Go)
```

**Why it matters:** The agent now knows "deploy" means git push. It knows not to give you Windows commands. It stops suggesting `npm install` when you use `pnpm`. In practice, it cuts a surprising amount of back-and-forth.

---

## The "Context Kernel" in Action

When you send a message like *"Fix the build,"* OpenClaw doesn't just see "Fix the build."

It sees:

> **[System Context]**
> *From SOUL.md:* Be concise. Correct bad premises.
> *From IDENTITY.md:* You are an SRE. Default to safe, idempotent fixes.
> *From USER.md:* The user is on macOS and uses pnpm.
>
> **[User Message]**
> Fix the build.

The result? Instead of a generic troubleshooting list, you get:

*"I see a pnpm-lock.yaml conflict. Since you're on macOS, run `pnpm install --frozen-lockfile` to sync safely without modifying dependencies."*

It's specific, safe, and tailored to you.

---

## How to Set It Up

These files live in your OpenClaw workspace directory (default: `~/.openclaw/workspace/`, separate from the config at `~/.openclaw/`).

**The Folder Structure:**

```
~/.openclaw/workspace/
├── SOUL.md       <-- The Vibe
├── IDENTITY.md   <-- The Job
├── USER.md       <-- You
└── AGENTS.md     <-- The Rules
```

### The "Specificity Test"

If you want to know if your files are good, apply the Specificity Test.

Ask your agent: *"Who are you?"*

*   **Fail:** "I am an AI assistant created by..."
*   **Pass:** "I'm your SRE pair programmer. I focus on idempotent infrastructure code and I know you prefer pnpm on macOS."

If it can't cite your preferences back to you, your markdown is too vague.

---

## Don't Want to Write Markdown?

Writing these files from scratch can be tedious.

[TinyClaw](https://tinyclaw.dev) includes a **"Persona Generator"**. You just tick a few boxes (e.g., "Role: Developer", "Style: Concise", "Stack: React"), and it generates optimized `SOUL.md`, `IDENTITY.md`, and `USER.md` templates for you to drop into your config.

Give your agent a soul. It makes all the difference.

→ [tinyclaw.dev](https://tinyclaw.dev) · Generate your Agent Persona in 30 seconds
