---
title: "Four Ways to Deploy OpenClaw: Mac Mini, VPS, Cloud Pod, or Under 60 Seconds"
description: "OpenClaw crossed 207,000 GitHub stars this week. Here's how to actually set it up — from bare metal to one-click cloud — without the gaps most tutorials leave in."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "Deployment", "AI Agent", "Mac Mini", "AgentPuter", "TinyClaw", "Tutorial"]
featured: false
---

*Part 9 of the Agent Infrastructure Series*

---

OpenClaw is the fastest-growing open-source AI project on GitHub right now: 207K stars, 38K forks, 683 contributors, over 12,000 commits. MacStories editor Federico Viticci burned through 180 million tokens with his instance "Navi" and called it "the thing that changed how I use AI." Mac Mini units sold out at Apple Stores in multiple cities — in part because people wanted a dedicated, always-on machine to run it.

You want to try it. The question is: how do you actually set it up?

The existing tutorials fall into two camps: either they assume you already know what `systemd` is, or they skip three steps and leave you staring at an error. This guide covers four paths — from building your own local server to deploying in under 60 seconds — so you can pick the one that matches your skill level and priorities.

**The four paths:**

| Path | Time | Skill Level | Best For |
|------|------|-------------|----------|
| A. Mac Mini | 15–30 min | Terminal basics | Privacy-first, full control |
| B1. Self-managed VPS | 15–30 min | SSH + Linux ops | Developers, compliance |
| B2. AgentPuter | ~2 min | Basic CLI | Multi-agent, zero DevOps |
| C. TinyClaw | < 1 min | None | Everyone |

---

## First: What Is OpenClaw? (30-Second Version)

OpenClaw is not another chatbot you visit in a browser. It's a **personal AI assistant that runs 24/7 in the background** and talks to you through the messaging apps you already use — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (via BlueBubbles), Microsoft Teams, WebChat, Matrix, and more. Twelve channels and counting.

What makes it different from ChatGPT:

- **Persistent memory.** OpenClaw has a `SOUL.md` file that defines who it is to *you* — your name, your preferences, your work style, your timezone. It remembers across sessions.
- **Real-world actions.** It reads your email, manages your calendar, operates on your files, controls smart home devices, does research, and drafts replies — autonomously.
- **Voice and canvas.** Voice Wake and Talk Mode (powered by ElevenLabs) let you speak to it hands-free. Live Canvas (A2UI) gives it a visual workspace.
- **Local-first.** Your data stays on your machine. No training on your conversations. No third-party cloud unless you choose one.

**What you need to run it:**
- A machine running **Node.js 22+** (macOS, Linux, or Windows via WSL2)
- An AI model subscription: **Anthropic API key or Claude Pro/Max OAuth** (strongly recommended by the project's creator), or OpenAI / Google Gemini
- The official recommendation: **Anthropic Pro/Max + Opus 4.6** — best long-context performance and strongest prompt-injection resistance among supported models

---

## Path A: Mac Mini — The Local Server

**Who this is for:** You have (or want) a Mac Mini. You want 100% local control. You care about data sovereignty. You want iMessage integration and Voice Wake.

### Hardware

A Mac Mini M4 base model ($599) is more than enough: 16GB unified memory, 256GB storage. It draws 5–10W at idle — roughly $15/year in electricity. It's silent, always-on, and natively supports iMessage through BlueBubbles, which no cloud deployment can match.

If you're buying refurbished, an M2 with 16GB works fine too. Avoid 8GB models — OpenClaw plus the model's context window will hit swap under heavy use, and swap on SSD shortens drive life.

### Prerequisites

Before you start, confirm you have:

- [x] macOS 13 (Ventura) or newer
- [x] Homebrew installed (`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)
- [x] Node.js 22+ (`brew install node@22`, then verify with `node --version`)
- [x] An Anthropic API key, or a Claude Pro ($20/mo) / Max ($100/mo) subscription for OAuth login
- [x] A Telegram account (easiest channel to start with)

### Step-by-Step Installation

**Step 1: Install OpenClaw globally**

```bash
npm install -g openclaw@latest
```

You can also use pnpm (`pnpm add -g openclaw@latest`) or bun. All three are officially supported.

You should see output ending with something like:

```
added 1 package in 12s
```

Verify the installation:

```bash
openclaw --version
```

Expected output: `2026.2.17` (or the latest release number).

**Step 2: Run the onboarding wizard**

```bash
openclaw onboard --install-daemon
```

The wizard walks you through everything interactively:

1. **Choose your model.** Select Anthropic Claude (recommended). If you have a Claude Pro/Max subscription, choose OAuth login — no API key management needed.
2. **Enter your API key or authenticate via OAuth.**
3. **Choose a messaging channel.** Telegram is the simplest to start with. The wizard will tell you to message @BotFather on Telegram, create a new bot with `/newbot`, and paste the token back.
4. **Install the background daemon.** On macOS, this creates a `launchd` service so OpenClaw survives reboots and runs even when the terminal is closed.

The whole process takes about 5 minutes.

**Step 3: Verify the installation**

```bash
openclaw doctor
```

This is the official diagnostic tool. It checks your Node.js version, Gateway connectivity, channel configuration, model access, and daemon status. Every check should show a green checkmark. If something is yellow or red, the doctor will tell you exactly what to fix.

**Step 4: Pair your first device**

Open Telegram and send any message to your new bot. The bot will reply with a **pairing code** — this is OpenClaw's default security mechanism. Unknown senders get a code; they can't interact with your assistant until you approve them.

```bash
openclaw pairing approve telegram <CODE>
```

That's it. Your bot is now live. Send it "What can you do?" and watch it respond.

> **Troubleshooting:** If the bot doesn't respond, run `openclaw doctor` first. Common issues: the daemon didn't start (run `openclaw onboard --install-daemon` again), or the Telegram token has a typo (check `~/.openclaw/openclaw.json`).

### After Installation

Three things to do immediately:

1. **Write your SOUL.md.** Open `~/.openclaw/workspace/SOUL.md` in any text editor. Tell it your name, what you do, your communication preferences, your timezone. This isn't a prompt — it's an identity file that persists across every conversation.

2. **Connect your tools.** Gmail (via Pub/Sub), Google Calendar, Notion, Todoist, Slack — OpenClaw connects through MCP tools and Skills. The wizard may have already prompted you for some of these.

3. **Run a real task.** Don't start with "tell me a joke." Try: "Summarize my unread emails and sort them by priority" or "What's on my calendar tomorrow and do I have any conflicts?"

### Real Costs

| Item | Cost |
|------|------|
| Hardware | $599 one-time (Mac Mini M4 base) |
| API (moderate use) | $15–50/month (or $20/mo with Claude Pro subscription) |
| API (heavy use) | $100–300/month (Viticci-level) |
| Electricity | ~$15/year |
| Setup time | 15–30 minutes |

---

## Path B: Cloud Deployment — Self-Managed or AgentPuter

**Who this is for:** You don't have a Mac. You use Linux or Windows. You want to access your assistant from anywhere. You need real 24/7 uptime, not "my laptop is open."

There are two approaches to cloud deployment: **manage your own server** (full control, full responsibility) or **use AgentPuter** (a cloud runtime built specifically for AI agents, zero DevOps). We'll cover both.

---

### B1: Self-Managed VPS

**Who this is for:** You know SSH. You want root access. Your company requires self-hosted infrastructure. You're optimizing for cost.

#### Choose a Server

| Provider | Minimum Spec | Monthly Cost |
|----------|-------------|--------------|
| Hetzner | 2 vCPU, 4GB RAM, 20GB SSD | ~$5/mo |
| DigitalOcean | 2 vCPU, 4GB RAM, 25GB SSD | ~$12/mo |
| Vultr | 2 vCPU, 4GB RAM, 25GB SSD | ~$12/mo |

> **Warning:** Don't go below 4GB RAM. With Docker, 2GB will OOM-kill the process. Trust me on this one.

OS: Ubuntu 22.04 LTS.

**Windows users:** You don't need a VPS. OpenClaw officially supports Windows via WSL2, and the README marks it as "strongly recommended." Install WSL2, then follow the same Linux instructions below.

#### Option A: Direct Install (Recommended for Beginners)

```bash
ssh root@your-server-ip

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install OpenClaw
npm install -g openclaw@latest

# Run the wizard
openclaw onboard --install-daemon
```

On Linux, the daemon installs as a `systemd` user service instead of `launchd`. Everything else is identical to the Mac Mini path — the wizard handles it.

Verify:

```bash
openclaw doctor
```

#### Option B: Docker Compose (Production-Grade)

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

Advantages:
- Process isolation — OpenClaw runs in its own container
- One-command restart: `docker compose restart`
- Built-in log management
- Sandbox mode: set `sandbox.mode: "non-main"` to run group/channel sessions in isolated Docker containers

Disadvantages:
- Requires Docker Engine 24+
- Another layer of abstraction to debug

The Gateway dashboard is available at `http://localhost:18789` — but only locally, which brings us to the most important part.

#### Remote Access: Do This Right

> **This is not optional.** CVE-2026-25253 demonstrated that exposing the Gateway port directly to the internet enables token exfiltration leading to remote code execution. Don't do it.

**Recommended: Tailscale Serve/Funnel**

Tailscale gives you a private network overlay. OpenClaw has first-class support:

```json
{
  "gateway": {
    "tailscale": {
      "mode": "serve"
    }
  }
}
```

- `"serve"` — accessible only within your Tailscale network (most secure)
- `"funnel"` — public HTTPS, but requires password authentication (`gateway.auth.mode: "password"`)

**Alternative: SSH tunnel**

```bash
ssh -L 18789:localhost:18789 user@your-server-ip
```

Then access the dashboard at `http://localhost:18789` on your local machine.

#### Backup

Your entire OpenClaw state lives in `~/.openclaw/`:

| Path | Contents |
|------|----------|
| `openclaw.json` | Main configuration |
| `workspace/` | SOUL.md, AGENTS.md, TOOLS.md, skills/ |
| `credentials/` | Channel credentials (WhatsApp session, Telegram token, etc.) |

Back this up daily. A simple cron job works:

```bash
tar czf ~/openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/
```

#### The Pain Points of Self-Managing

I've been running OpenClaw on a self-managed VPS for three months. Here's what I've learned:

- You have to install Node.js, configure systemd, set up Tailscale, and handle TLS yourself.
- OAuth tokens expire. If you're sleeping in a different timezone, your WhatsApp connection dies at 3 AM and your agent goes silent until you wake up and re-authenticate.
- After a server reboot (kernel update, provider maintenance), OpenClaw doesn't always come back cleanly. You learn to write recovery scripts.
- Running multiple agents requires manual process isolation and resource allocation.

**In one sentence: a self-managed VPS gives you maximum freedom, but you're also your own DevOps team.**

If that last paragraph made you tired, there's another way.

---

### B2: AgentPuter — A Cloud Runtime Built for AI Agents

**Who this is for:** You want cloud deployment without the DevOps. You need multi-agent support. You care about 24/7 reliability with SLA guarantees.

#### What Is AgentPuter?

[AgentPuter](https://www.agentputer.com/) is not a generic VPS. It's a **dedicated cloud runtime designed specifically for AI agents** — OpenClaw, ClawBot, MoltBot, and custom agents. Think of it as "Heroku for AI assistants": you don't manage the server, the container, or the daemon. You get a Pod that never shuts down.

It solves the four pain points of self-managed VPS:

| Self-Managed VPS Problem | How AgentPuter Solves It |
|--------------------------|-------------------------|
| Server reboots = agent offline | Pod runs 24/7 with auto-recovery and uptime SLA |
| OAuth tokens expire = manual re-login | Server-side token management with automatic refresh |
| Agents consume local CPU/memory | Cloud-isolated resources; your local machine is unaffected |
| Access only from same network | Control your agents from any device, anywhere |

#### Three-Step Deployment

```bash
# Step 1: Create your Pod
agentputer create openclaw
# → Allocates a cloud environment, choose your config

# Step 2: Connect your services
agentputer connect
# → Authorize Google, Notion, Slack, etc. Credentials stored securely in-pod

# Step 3: Deploy OpenClaw
agentputer deploy openclaw
# → Your agent starts working 24/7. WhatsApp, Telegram, Discord — all channels live
```

Total time: about 2 minutes.

#### Why AgentPuter Stands Out

- **Multi-agent parallel execution.** Run ClawBot (personal assistant) + MoltBot (calendar/scheduling) + a custom research agent in the same Pod, each with isolated resources.
- **Auth that never expires.** OAuth tokens are maintained server-side with automatic refresh. Your WhatsApp connection won't die at 3 AM because a token expired.
- **Access from anywhere.** Phone, tablet, another computer — your AI follows you, not the other way around.
- **Current status:** Early Access. Request an invite code at [agentputer.com](https://www.agentputer.com/) — codes are sent within 24 hours.

#### AgentPuter vs. Self-Managed VPS

| | Self-Managed VPS | AgentPuter |
|--|-----------------|------------|
| Deploy time | 15–30 minutes | ~2 minutes |
| Operations | You manage systemd, Tailscale, backup, TLS | Zero ops — Pod is auto-maintained |
| Multi-agent | Manual isolation | Native parallel support |
| Auth management | Handle token expiry manually | Automatic refresh |
| Monthly cost | VPS $5–24 + API fees | Pod subscription + API fees |
| Control | 100% root access | Limited to Pod environment |
| Best for | Strong ops skills / compliance | Want simplicity / multi-agent users |

---

## Path C: TinyClaw — 60 Seconds, Zero Terminal

**Who this is for:** You don't want to learn command-line tools. You don't want to manage servers. You just want to *use* an AI assistant, not *install* one. You want to try it right now.

### Why This Path Exists

Path A requires $599 and knowing what Node.js is. Path B (self-managed) requires SSH, Docker, and Tailscale. Even AgentPuter, while much simpler, still involves a CLI and an invite code.

Most people see `npm install -g` and close the tab.

OpenClaw's 207,000 stars prove the demand is real. The bottleneck isn't the product — it's the deployment barrier. TinyClaw eliminates it.

### What Is TinyClaw?

[TinyClaw](https://tinyclaw.dev) is the consumer-grade product built by the [AgentPuter](https://www.agentputer.com/) team. If AgentPuter is "the developer's AI agent cloud," TinyClaw is "everyone's AI agent entry point."

**Three steps to go live:**

1. **Choose your model** — Claude Opus 4.6, GPT-5.2, or Gemini 3
2. **Choose your channel** — Telegram (Discord and WhatsApp coming soon)
3. **Sign in with Google** → deployment complete

No server. No SSH. No Node.js. No terminal. The infrastructure is pre-configured and waiting to be assigned to you.

**From click to first conversation with your AI assistant: under 60 seconds.**

### What You Can Do With It

Once deployed, your TinyClaw-hosted OpenClaw can:

- Read, summarize, and draft replies to your emails
- Manage your calendar, set reminders, resolve scheduling conflicts
- Summarize documents, draft contracts, generate invoices
- Track expenses, compare prices, assist with tax preparation
- Conduct competitive research, draft social media posts, track OKRs
- Monitor news feeds, book travel
- Learn new capabilities through natural language — just tell it what you need

### The Ultimate Comparison

| | Mac Mini | Self-Managed VPS | AgentPuter | TinyClaw |
|--|---------|-----------------|------------|----------|
| Deploy time | 15–30 min | 15–30 min | ~2 min | < 1 min |
| Technical skill | Terminal | SSH + ops | Basic CLI | None (GUI only) |
| Hardware cost | $599 | $0 | $0 | $0 |
| Monthly cost | API only | VPS + API | Pod + API | Hosting + API |
| Data location | 100% local | Your VPS | AgentPuter cloud | TinyClaw cloud |
| 24/7 reliability | Depends on your Mac | Depends on your ops | SLA-backed | SLA-backed |
| Multi-agent | Manual config | Manual isolation | Native parallel | Single agent |
| Auth management | Manual | Manual | Auto-refresh | Automatic |
| iMessage | Yes (BlueBubbles) | No | No | No |
| Voice Wake | Yes (macOS app) | No | No | No |
| Windows | No | Yes (WSL2) | Yes (CLI) | Yes (browser) |
| Best for | Privacy / power users | DevOps / compliance | Developers / multi-agent | Everyone |

---

## After Setup: 7 Steps to Turn Your OpenClaw from Toy to Employee

Regardless of which path you chose, installation is just the beginning. Here's how to make it actually useful:

### 1. Write Your SOUL.md

Location: `~/.openclaw/workspace/SOUL.md`

This is not a system prompt. It's an identity file. Tell it:
- Your name, job title, and what you do
- Your communication style (formal? casual? bullet points?)
- Your timezone and working hours
- Your preferences ("I prefer Markdown," "Never schedule meetings before 10 AM")

The more specific you are, the less you'll need to repeat yourself.

### 2. Run `openclaw doctor`

Do this after setup, after every upgrade, and whenever something feels off. It checks everything — Node version, Gateway health, channel connectivity, model access, daemon status — and tells you exactly what to fix.

### 3. Learn the Chat Commands

These work in any connected channel — Telegram, WhatsApp, Slack, Discord:

| Command | What It Does |
|---------|-------------|
| `/status` | Shows current model, token usage, session info |
| `/new` or `/reset` | Resets the conversation session |
| `/compact` | Compresses context to save tokens |
| `/think high` | Enables deep thinking mode (Opus 4.6) |
| `/verbose on` | More detailed responses |
| `/usage full` | Shows token consumption after each reply |

These are your daily controls. `/compact` alone can save you 30–40% on token costs in long conversations.

### 4. Connect Your Tools

OpenClaw uses MCP (Model Context Protocol) tools and Skills to integrate with external services:

- **Gmail** — via Pub/Sub for real-time email notifications
- **Google Calendar** — read, create, and modify events
- **Notion / Todoist / Linear** — task management
- **Slack** — both as a channel and as a tool
- **Browser** — OpenClaw can control a dedicated Chrome instance

### 5. Plant Memory Seeds

Give it initial context that it will remember forever:

> "I have a team meeting every Monday at 10 AM. My manager's name is Sarah. I prefer responses in Markdown. I'm working on the Q1 launch for Project Atlas."

These facts persist in memory and inform every future interaction.

### 6. Run a Real Workflow

Don't test with trivia. Give it work:

- "Summarize my unread emails and sort them by priority"
- "What's on my calendar this week? Flag any conflicts"
- "Research the top 5 competitors for [product] and give me a comparison table"
- "Draft a reply to the email from [person] — professional tone, accept the meeting but suggest Thursday instead"

### 7. Install Community Skills

Enable **ClawHub** in your config and your agent can automatically search for and install new Skills as needed. You can also browse manually at [SkillsMP](https://skillsmp.com) — the marketplace has thousands of community-contributed Skills for everything from Jira integration to flight price tracking.

---

## FAQ

**How much does the API cost?**
Light use: ~$15/month. Moderate: $30–50/month. Heavy (Viticci-level): $100–300/month. Alternatively, a Claude Pro subscription ($20/month) or Max ($100/month) lets you authenticate via OAuth without managing API keys separately.

**Which model is best?**
The project creator strongly recommends **Claude Opus 4.6** — it has the best long-context performance and the strongest resistance to prompt injection. GPT-5.2 and Gemini 3 are also supported. Pick whichever you already have a subscription for.

**Is it secure?**
By default, OpenClaw uses **DM pairing** — any unknown sender receives a pairing code and cannot interact with your assistant until you approve them with `openclaw pairing approve`. Local deployments keep all data on your machine. For remote access, use Tailscale — never expose the Gateway port (18789) directly to the internet.

**Does it support Chinese?**
Yes. The underlying models support Chinese natively. There's a community documentation site at clawd.org.cn, and it works with domestic models like DeepSeek, Moonshot Kimi, and Qwen.

**Does it work on Windows?**
Yes, via WSL2 (Windows Subsystem for Linux) — officially supported and strongly recommended. Or use TinyClaw for a browser-based experience with zero local setup.

**How is this different from ChatGPT Plus?**
ChatGPT waits for you to visit it. OpenClaw reaches out to you — through WhatsApp, Telegram, Slack, wherever you are. ChatGPT has no persistent memory across sessions; OpenClaw does. ChatGPT can't operate on your files or email; OpenClaw can. ChatGPT doesn't support Voice Wake or Live Canvas; OpenClaw does.

**Something went wrong. Now what?**
Run `openclaw doctor`. It auto-diagnoses and gives targeted fix instructions. The community Discord has 5,000+ active members who can help with edge cases.

**How do I update?**
```bash
openclaw update --channel stable
```
There are also `beta` and `dev` channels if you want cutting-edge features.

---

## Closing Thoughts

Four paths, one destination: your own 24/7 AI assistant.

- **Mac Mini** if you're a power user who wants full control, Voice Wake, and iMessage.
- **Self-managed VPS** if you're a developer who wants root access and maximum flexibility.
- **[AgentPuter](https://www.agentputer.com/)** if you want cloud reliability, multi-agent support, and zero DevOps.
- **[TinyClaw](https://tinyclaw.dev)** if you just want it to work — 60 seconds, no terminal.

These paths aren't mutually exclusive. You can start with TinyClaw to experience OpenClaw in under a minute, graduate to AgentPuter when you want to run multiple agents, and eventually build a fully sovereign setup on a Mac Mini when you're ready for complete control.

This is Part 9 of our Agent Infrastructure series. We've covered [why your agent needs its own computer](/blog/agent-needs-its-own-computer/), OpenClaw's [architecture](/blog/dissecting-openclaw-architecture/), [skills ecosystem](/blog/agent-skills-ecosystem/), [enterprise workflows](/blog/vibe-working-when-agents-work/), [the ClawdBot deep dive](/blog/deep-dive-clawdbot-breakout-agent/), [business models](/blog/who-makes-money-from-openclaw/), and [what it means when its creator joins OpenAI](/blog/openclaw-creator-joins-openai/). Today was the "do it yourself" chapter.

If you've deployed successfully, come tell us in the comments or on Discord: **what did you name your agent, and what was the first real task you gave it?**

---

*References:*
- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw) (207K stars, v2026.2.17)
- [AgentPuter — Your AI Agent's 24/7 Cloud Runtime](https://www.agentputer.com/)
- [TinyClaw — One-Click OpenClaw Deployment](https://tinyclaw.dev)
- [OpenClaw Official Documentation](https://docs.openclaw.ai)
- CVE-2026-25253 — OpenClaw Gateway Token Exfiltration (referenced in our security analysis)
