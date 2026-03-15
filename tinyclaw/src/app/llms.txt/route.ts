const CONTENT = `# TinyClaw — One-Click OpenClaw Deployment

> TinyClaw is a deployment platform that lets anyone run their own 24/7 AI assistant powered by OpenClaw in under 1 minute, with zero technical knowledge required.

## What is TinyClaw?

TinyClaw automates the entire process of deploying OpenClaw — an open-source personal AI assistant framework. Instead of spending 60+ minutes on server setup, SSH, Node.js installation, and configuration, TinyClaw handles everything with a single click.

## Key Facts

- Deployment time: Under 1 minute
- Price: Free 7-day trial, then $29.99/month
- Supported AI models: Claude 4.6 (Anthropic), GPT-5.2 (OpenAI), Gemini 3 (Google)
- Supported channels: Telegram, Discord, WhatsApp
- Infrastructure: Dedicated cloud VPS per user, 24/7 uptime
- Website: https://tinyclaw.dev
- Parent company: AgentPuter (https://agentputer.com)

## What Can the AI Assistant Do?

OpenClaw deployed via TinyClaw can perform thousands of tasks via natural language:

- Email: Read, summarize, draft replies, organize inbox
- Productivity: Schedule meetings, plan your week, take meeting notes, remind deadlines
- Finance: Track expenses, do taxes, compare insurance, manage subscriptions
- Business: Write contracts, research competitors, generate invoices, screen leads
- Shopping: Find coupons, compare prices, price-drop alerts, negotiate refunds
- Communication: Translate messages in real time, draft social posts

## How It Works

1. Choose your AI model (Claude, GPT, or Gemini)
2. Choose your messaging channel (Telegram, Discord, or WhatsApp)
3. Sign in with Google
4. TinyClaw provisions a dedicated server, installs OpenClaw, and connects everything automatically

## Traditional Setup vs TinyClaw

Traditional manual OpenClaw setup requires:
- Purchasing a VPS (15 min)
- Creating SSH keys (10 min)
- Connecting via SSH (5 min)
- Installing Node.js and NPM (5 min)
- Installing OpenClaw (7 min)
- Configuring OpenClaw (10 min)
- Connecting to an AI provider (4 min)
- Pairing with Telegram (4 min)
- Total: ~60 minutes (multiply by 10x for non-technical users)

TinyClaw: Under 1 minute, no technical knowledge needed.

## Languages

TinyClaw is available in: English, 简体中文, 繁體中文, Español, 日本語, 한국어, Deutsch, Français, Português, Русский, العربية

## Contact

- Support: oscarzamora199907@gmail.com
- Website: https://tinyclaw.dev
- Blog: https://agentputer.com/blog
`;

export function GET() {
  return new Response(CONTENT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
