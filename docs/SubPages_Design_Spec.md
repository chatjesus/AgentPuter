# AgentPuter 子页面 MVP 设计规格文档

> **版本**: 1.0  
> **日期**: 2026-02-08  
> **设计风格**: 暗色终端/黑客美学 (与 agentputer.com 一致)  
> **状态**: 设计稿规格，待 Pencil MCP 绘制

---

## 0. 设计系统 (Design Tokens)

### 0.1 色彩

| Token | 值 | 用途 |
|-------|-----|------|
| `bg-primary` | `#0A0A0A` | 页面背景 |
| `bg-card` | `#111111` | 卡片/区块背景 |
| `bg-card-hover` | `#1A1A1A` | 卡片悬停 |
| `border-subtle` | `#222222` | 默认边框 |
| `border-accent` | `#333333` | 高亮边框 |
| `text-primary` | `#FFFFFF` | 主标题文字 |
| `text-secondary` | `#999999` | 正文/描述 |
| `text-muted` | `#666666` | 辅助/注释文字 |
| `accent-green` | `#00FF88` | 终端绿 (状态指示/高亮) |
| `accent-cyan` | `#00D4FF` | 链接/交互元素 |
| `accent-yellow` | `#FFD700` | 警告/标签 |
| `accent-red` | `#FF4444` | 错误/删除 |
| `accent-purple` | `#A855F7` | Pro 标签 |

### 0.2 字体

| 元素 | 字体 | 大小 |
|------|------|------|
| Hero 标题 | Inter/系统无衬线 | 48-64px, Bold |
| Section 标题 | Inter | 32-40px, Bold |
| 卡片标题 | Inter | 20-24px, SemiBold |
| 正文 | Inter | 16px, Regular |
| 终端文字 | JetBrains Mono / monospace | 14px |
| 代码/命令 | JetBrains Mono | 13px |
| 标签 | Inter | 12px, Medium |

### 0.3 通用组件

| 组件 | 规格 |
|------|------|
| 导航栏 | 高度 64px, 背景 `bg-primary` + `backdrop-blur`, 固定顶部 |
| 按钮 (主) | `accent-green` 背景, 黑色文字, 圆角 8px, 高度 44px |
| 按钮 (次) | 透明背景, 白色边框, 白色文字, 圆角 8px |
| 卡片 | `bg-card` 背景, `border-subtle` 边框, 圆角 12px, padding 24px |
| 页面最大宽度 | 1200px, 居中 |
| Section 间距 | 80-120px |
| ASCII 装饰 | `>_`, `$`, `//`, `[*]`, `[!]`, `[x]`, `[~]`, `[@]` |

### 0.4 导航栏 (全局)

```
┌──────────────────────────────────────────────────────────────────────┐
│  >_ AgentPuter     Features  Pricing  Blog  Docs  中文   [START]   │
└──────────────────────────────────────────────────────────────────────┘
```

**与线上对齐的导航项：**
- Logo: `>_ AgentPuter` (左对齐)
- 导航链接: `Features` `/features` | `Pricing` `/pricing` | `Blog` `/blog` | `Docs` `/docs`
- 右侧: `中文` (语言切换) | `[START]` (绿色 CTA 按钮)

**移动端:** 汉堡菜单 → 全屏侧栏导航

---

## 1. Features 功能页 (`/features`)

### 1.1 页面结构

```
Frame: "Features Page" (1440 x 4800)
背景: #0A0A0A
```

### 1.2 Section A — Hero

```
┌──────────────────────────────────────────────────────────────────────┐
│  [导航栏]                                                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    FEATURES: UNLOCKED                                │
│                                                                      │
│              Everything Your Agent Needs                             │
│                  to Run 24/7                                         │
│                                                                      │
│     AgentPuter is purpose-built infrastructure for AI Agents.        │
│     Not a chatbot. Not a wrapper. A real cloud computer.             │
│                                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- 顶部标签: `FEATURES: UNLOCKED` (accent-green, monospace, 小字)
- 主标题: `Everything Your Agent Needs to Run 24/7` (48px, 白色, 加粗)
- 副标题: 灰色描述文字
- 无 CTA 按钮 (功能页不需要)

### 1.3 Section B — 核心功能 4 宫格

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  CORE CAPABILITIES                                                   │
│                                                                      │
│  ┌─────────────────────────┐  ┌─────────────────────────────────┐   │
│  │ >_                      │  │ [~]                              │   │
│  │                         │  │                                  │   │
│  │ 24/7 Always Online      │  │ Auth Never Expires               │   │
│  │                         │  │                                  │   │
│  │ Your Agent runs in a    │  │ Server-managed OAuth tokens      │   │
│  │ dedicated cloud pod     │  │ with auto-refresh. Connect       │   │
│  │ that never shuts down.  │  │ Google, Notion, Slack — once.    │   │
│  │ Works while you sleep,  │  │ Never re-login again.            │   │
│  │ travel, or take a       │  │                                  │   │
│  │ break.                  │  │ Supported:                       │   │
│  │                         │  │ • Google OAuth                   │   │
│  │ ● Uptime: 99.9% SLA    │  │ • Slack Bot Token                │   │
│  │ ● Auto-restart on fail  │  │ • Notion Integration             │   │
│  │ ● Health monitoring     │  │ • Telegram Bot API               │   │
│  │                         │  │ • Custom API Keys                │   │
│  └─────────────────────────┘  └─────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────┐  ┌─────────────────────────────────┐   │
│  │ >>                      │  │ [*]                              │   │
│  │                         │  │                                  │   │
│  │ Multi-Agent Parallel    │  │ Access Anywhere                  │   │
│  │                         │  │                                  │   │
│  │ Run multiple AI agents  │  │ Control your agents from any     │   │
│  │ simultaneously. Each    │  │ device — phone, tablet, or       │   │
│  │ gets its own isolated   │  │ another computer.                │   │
│  │ environment.            │  │                                  │   │
│  │                         │  │ Channels:                        │   │
│  │ • ClawBot + MoltBot     │  │ • Telegram                       │   │
│  │ • Resource isolation    │  │ • WhatsApp                       │   │
│  │ • Independent scaling   │  │ • Discord                        │   │
│  │                         │  │ • Web Dashboard                  │   │
│  └─────────────────────────┘  └─────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- 每个卡片: `bg-card`, 圆角 12px, 上方有 ASCII 装饰符
- 2x2 网格布局, 间距 24px
- 每个卡片内有: 图标装饰 + 标题 + 描述 + 要点列表

### 1.4 Section C — 架构图 (技术亮点)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ARCHITECTURE                                                        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  agentputer@cloud:~                                            │  │
│  │                                                                │  │
│  │  $ agentputer architecture                                     │  │
│  │                                                                │  │
│  │  ┌─────────────┐     ┌──────────────┐     ┌───────────────┐   │  │
│  │  │  Your Device │────→│  AgentPuter  │────→│  Cloud Pod    │   │  │
│  │  │  (Any)       │     │  Platform    │     │  (Your VPS)   │   │  │
│  │  └─────────────┘     └──────────────┘     └───────────────┘   │  │
│  │                            │                      │            │  │
│  │                       ┌────┴────┐           ┌─────┴──────┐    │  │
│  │                       │  Clerk  │           │  OpenClaw   │    │  │
│  │                       │  Auth   │           │  Runtime    │    │  │
│  │                       ├─────────┤           ├────────────┤    │  │
│  │                       │  Neon   │           │  Telegram   │    │  │
│  │                       │  (PG)   │           │  Bot API    │    │  │
│  │                       └─────────┘           ├────────────┤    │  │
│  │                                              │  Claude AI  │    │  │
│  │                                              └────────────┘    │  │
│  │                                                                │  │
│  │  $ █                                                           │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- 终端窗口样式 (模拟 CLI 输出)
- 背景 `#0D1117`, 圆角 12px
- 顶部有终端标题栏 (三个小圆点)
- 架构图用 ASCII art 风格展示

### 1.5 Section D — OpenClaw 集成

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  WORKS WITH OPENCLAW                                                 │
│                                                                      │
│  ┌──────────────────────────────────────────┐                       │
│  │  $ openclaw status                       │                       │
│  │                                          │                       │
│  │  Agent: main                             │                       │
│  │  Status: ● Running                       │                       │
│  │  Model: claude-opus-4-5                  │                       │
│  │  Uptime: 14d 7h 23m                     │                       │
│  │  Messages today: 47                      │                       │
│  │  Channels: telegram, webchat             │                       │
│  │                                          │                       │
│  │  Skills loaded:                          │                       │
│  │  ├── calendar-manager                    │                       │
│  │  ├── email-assistant                     │                       │
│  │  ├── finance-tracker                     │                       │
│  │  └── task-manager                        │                       │
│  └──────────────────────────────────────────┘                       │
│                                                                      │
│  OpenClaw — 153K ⭐ on GitHub                                       │
│  The most popular open-source AI Agent platform.                     │
│  AgentPuter gives it a 24/7 home.                                   │
│                                                                      │
│  [Deploy OpenClaw →]                                                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.6 Section E — 安全与隐私

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  SECURITY & PRIVACY                                                  │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ 🔐       │  │ 🛡️       │  │ 📡       │  │ 🗑️       │           │
│  │ Encrypted │  │ Isolated  │  │ SSH      │  │ One-Click │           │
│  │ Storage   │  │ Runtime   │  │ Access   │  │ Delete    │           │
│  │           │  │           │  │          │  │           │           │
│  │ AES-256   │  │ Each Pod  │  │ Full SSH │  │ Destroy   │           │
│  │ at rest   │  │ in its    │  │ root     │  │ all data  │           │
│  │ and in    │  │ own VPS   │  │ access   │  │ instantly │           │
│  │ transit   │  │           │  │ to your  │  │           │           │
│  │           │  │           │  │ Pod      │  │           │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- 4 列水平卡片
- 每个带图标 + 标题 + 描述

### 1.7 Section F — CTA

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  > ./deploy_agent.sh                                                 │
│                                                                      │
│        Ready to Give Your Agent a Home?                              │
│                                                                      │
│   Deploy in 2 minutes. Your AI runs 24/7. Starting at $9/month.     │
│                                                                      │
│                     [GET STARTED]                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Pricing 定价页 (`/pricing`)

### 2.1 页面结构

```
Frame: "Pricing Page" (1440 x 3200)
背景: #0A0A0A
```

### 2.2 Section A — Hero

```
┌──────────────────────────────────────────────────────────────────────┐
│  [导航栏]                                                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    PRICING: TRANSPARENT                               │
│                                                                      │
│              Simple, Predictable Pricing                             │
│                                                                      │
│        No hidden fees. No surprise bills. Cancel anytime.            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.3 Section B — 定价卡片 (3 列)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │               │  │  ★ POPULAR       │  │                  │       │
│  │  STARTER      │  │                  │  │  ENTERPRISE      │       │
│  │               │  │  PRO             │  │                  │       │
│  │  $9           │  │                  │  │  Custom          │       │
│  │  /month       │  │  $29             │  │                  │       │
│  │               │  │  /month          │  │  Contact us      │       │
│  │  Perfect for  │  │                  │  │                  │       │
│  │  getting      │  │  For power users │  │  For teams &     │       │
│  │  started      │  │  & professionals │  │  organizations   │       │
│  │               │  │                  │  │                  │       │
│  │ ─────────── │  │ ─────────────── │  │ ─────────────── │       │
│  │               │  │                  │  │                  │       │
│  │ ✓ 1 Pod      │  │ ✓ 3 Pods        │  │ ✓ Unlimited Pods │       │
│  │ ✓ 1 vCPU     │  │ ✓ 2 vCPU each   │  │ ✓ Custom specs   │       │
│  │ ✓ 2GB RAM    │  │ ✓ 4GB RAM each  │  │ ✓ Dedicated infra│       │
│  │ ✓ 20GB SSD   │  │ ✓ 40GB SSD each │  │ ✓ Priority       │       │
│  │ ✓ 100K       │  │ ✓ 500K          │  │   support        │       │
│  │   tokens/mo  │  │   tokens/mo     │  │ ✓ SSO / SAML     │       │
│  │ ✓ Telegram   │  │ ✓ All channels  │  │ ✓ SLA guarantee  │       │
│  │ ✓ WebChat    │  │ ✓ Custom domain │  │ ✓ Custom billing │       │
│  │ ✓ SSH access │  │ ✓ API access    │  │                  │       │
│  │ ✓ Community  │  │ ✓ Priority      │  │                  │       │
│  │   support    │  │   support       │  │                  │       │
│  │               │  │                  │  │                  │       │
│  │ [Get Started] │  │ [Get Started]   │  │ [Contact Sales]  │       │
│  │               │  │                  │  │                  │       │
│  └──────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 3 张卡片, 中间 Pro 卡片更高, 带 `★ POPULAR` 标签 (accent-purple 背景)
- Starter: 默认灰色边框卡片
- Pro: accent-green 发光边框, 推荐标记
- Enterprise: 虚线边框, "Contact us"
- 价格数字特大 (64px), `/month` 小字
- Feature 列表用 `✓` 打勾
- 底部 CTA 按钮: Starter/Pro → 绿色实心按钮, Enterprise → 白色描边按钮

### 2.4 Section C — 功能对比表

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  COMPARE PLANS                                                       │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   │ Starter │   Pro   │ Enterprise          │    │
│  ├───────────────────┼─────────┼─────────┼─────────────────────┤    │
│  │ Pods              │ 1       │ 3       │ Unlimited           │    │
│  │ vCPU / Pod        │ 1       │ 2       │ Custom              │    │
│  │ RAM / Pod         │ 2 GB    │ 4 GB    │ Custom              │    │
│  │ Storage / Pod     │ 20 GB   │ 40 GB   │ Custom              │    │
│  │ AI Tokens / month │ 100K    │ 500K    │ Custom              │    │
│  │ Telegram          │ ✓       │ ✓       │ ✓                   │    │
│  │ WhatsApp          │ —       │ ✓       │ ✓                   │    │
│  │ Discord           │ —       │ ✓       │ ✓                   │    │
│  │ Custom Domain     │ —       │ ✓       │ ✓                   │    │
│  │ API Access        │ —       │ ✓       │ ✓                   │    │
│  │ SSH Access        │ ✓       │ ✓       │ ✓                   │    │
│  │ Priority Support  │ —       │ ✓       │ ✓                   │    │
│  │ SSO / SAML        │ —       │ —       │ ✓                   │    │
│  │ SLA               │ —       │ 99.5%   │ 99.9%               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- 表格样式: 暗色行交替, 边框 `border-subtle`
- `✓` 用 accent-green, `—` 用 text-muted

### 2.5 Section D — FAQ

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  // FREQUENTLY ASKED                                                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ [+] What happens when I exceed my token quota?                 │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ [+] Can I upgrade or downgrade my plan anytime?                │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ [+] What AI models are supported?                              │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ [+] Do I get root access to my Pod?                            │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ [+] Is there a free trial?                                     │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │ [+] How is my data secured?                                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**FAQ 内容:**

| 问题 | 答案 |
|------|------|
| 超额 token 怎么算？ | 超出配额后按 $0.01/1K tokens 按量计费，账单下月初结算 |
| 可以随时升降级吗？ | 可以。升级立即生效，降级在当前计费周期结束后生效 |
| 支持哪些 AI 模型？ | Claude (Opus/Sonnet), GPT-4, 及更多。通过 AI Router 自动路由 |
| 有 root 权限吗？ | 是的。每个 Pod 都是你自己的 VPS，完整 SSH root 访问 |
| 有免费试用吗？ | 有。新用户 7 天免费试用 Starter 计划 |
| 数据安全？ | AES-256 加密存储，TLS 传输，Pod 完全隔离，可一键销毁 |

### 2.6 Section E — CTA

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  $ agentputer subscribe --plan starter                               │
│                                                                      │
│       Start Your 7-Day Free Trial                                    │
│                                                                      │
│   No credit card required. Deploy in 2 minutes.                      │
│                                                                      │
│              [START FREE TRIAL]                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Blog 博客页 (`/blog`)

### 3.1 页面结构

```
Frame: "Blog Page" (1440 x 3600)
背景: #0A0A0A
```

### 3.2 Section A — Hero

```
┌──────────────────────────────────────────────────────────────────────┐
│  [导航栏]                                                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    // BLOG                                            │
│                                                                      │
│              Thoughts on AI Agents,                                  │
│              Infrastructure & the Future                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  [All]  [Product]  [Engineering]  [Vision]  [Tutorial]       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- 标签过滤器: 水平排列, 选中态底部绿色下划线

### 3.3 Section B — 置顶文章 (Featured)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  FEATURED                                                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  ┌─────────────────────┐  ┌─────────────────────────────────┐ │  │
│  │  │                     │  │                                 │ │  │
│  │  │  [封面图区域]        │  │  [Vision]          Feb 8, 2026 │ │  │
│  │  │                     │  │                                 │ │  │
│  │  │  深色渐变 +          │  │  Your Agent Needs Its Own      │ │  │
│  │  │  终端风格封面        │  │  Computer                      │ │  │
│  │  │                     │  │                                 │ │  │
│  │  │                     │  │  AI Agents are remarkably       │ │  │
│  │  │                     │  │  capable. But they're homeless. │ │  │
│  │  │                     │  │  Here's why we're building a    │ │  │
│  │  │                     │  │  dedicated cloud computer for   │ │  │
│  │  │                     │  │  AI Agents.                     │ │  │
│  │  │                     │  │                                 │ │  │
│  │  │                     │  │  [Read More →]                  │ │  │
│  │  │                     │  │                                 │ │  │
│  │  └─────────────────────┘  └─────────────────────────────────┘ │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- 大卡片, 左图右文
- 封面图: 暗色渐变 + 终端风格
- 标签 `[Vision]` 用 accent-purple pill
- 日期灰色小字

### 3.4 Section C — 文章网格

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ALL POSTS                                                           │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │   │
│  │ │ [封面缩略图]  │ │  │ │ [封面缩略图]  │ │  │ │ [封面缩略图]  │ │   │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └──────────────┘ │   │
│  │                  │  │                  │  │                  │   │
│  │ [Engineering]    │  │ [Tutorial]       │  │ [Product]        │   │
│  │ Feb 7, 2026      │  │ Feb 5, 2026      │  │ Feb 3, 2026      │   │
│  │                  │  │                  │  │                  │   │
│  │ OpenClaw         │  │ Deploy Your      │  │ AgentPuter       │   │
│  │ Architecture:    │  │ First AI Agent   │  │ MVP 1.0:         │   │
│  │ How It Works     │  │ in 2 Minutes     │  │ What We Built    │   │
│  │                  │  │                  │  │                  │   │
│  │ Deep dive into   │  │ Step-by-step     │  │ A look at our    │   │
│  │ the OpenClaw...  │  │ guide to...      │  │ first release... │   │
│  │                  │  │                  │  │                  │   │
│  │ [Read →]         │  │ [Read →]         │  │ [Read →]         │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │   │
│  │ │ [封面缩略图]  │ │  │ │ [封面缩略图]  │ │  │ │ [封面缩略图]  │ │   │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └──────────────┘ │   │
│  │                  │  │                  │  │                  │   │
│  │ [Vision]         │  │ [Product]        │  │ [Tutorial]       │   │
│  │ Feb 1, 2026      │  │ Jan 28, 2026     │  │ Jan 25, 2026     │   │
│  │                  │  │                  │  │                  │   │
│  │ The 3 Signals    │  │ Why We Chose     │  │ Connecting       │   │
│  │ That Software    │  │ Hetzner Over     │  │ Telegram to      │   │
│  │ Is Changing      │  │ AWS              │  │ Your Agent       │   │
│  │                  │  │                  │  │                  │   │
│  │ Claude in Excel, │  │ Cost, simplicity │  │ A complete       │   │
│  │ TR crash...      │  │ and why...       │  │ guide to...      │   │
│  │                  │  │                  │  │                  │   │
│  │ [Read →]         │  │ [Read →]         │  │ [Read →]         │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│                     [Load More Posts ↓]                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**文章列表 (MVP 阶段):**

| # | 标题 | 标签 | 来源 |
|---|------|------|------|
| 1 | Your Agent Needs Its Own Computer | Vision | AgentPuter文章正文.md |
| 2 | OpenClaw Architecture: How It Works | Engineering | openclaw-architecture-en.md |
| 3 | Deploy Your First AI Agent in 2 Minutes | Tutorial | 新写 |
| 4 | AgentPuter MVP 1.0: What We Built | Product | MVP_1.0_PRD.md 改写 |
| 5 | The 3 Signals That Software Is Changing | Vision | 文章节选 |
| 6 | Why We Chose Hetzner Over AWS | Product | 新写 |
| 7 | Connecting Telegram to Your Agent | Tutorial | 新写 |

- 3 列网格
- 每卡片: 缩略图 + 标签 + 日期 + 标题 + 摘要 + Read 链接
- 底部 "Load More" 按钮

---

## 4. Docs 文档页 (`/docs`)

### 4.1 页面结构

```
Frame: "Docs Page" (1440 x 3200)
背景: #0A0A0A
```

### 4.2 整体布局

```
┌──────────────────────────────────────────────────────────────────────┐
│  [导航栏]                                                            │
├──────────────┬───────────────────────────────────────────────────────┤
│              │                                                       │
│  // DOCS     │  Getting Started                                      │
│              │  ═════════════════════════════════════                │
│  ┌─────────┐ │                                                       │
│  │ Getting  │ │  Welcome to AgentPuter — the 24/7 cloud runtime      │
│  │ Started  │ │  for your AI Agent.                                  │
│  │ ├ Intro  │ │                                                       │
│  │ ├ Quick  │ │  ## Quick Start                                      │
│  │ │ Start  │ │                                                       │
│  │ └ First  │ │  Get your first AI Agent running in 3 steps:         │
│  │   Agent  │ │                                                       │
│  │          │ │  ┌──────────────────────────────────────────────┐    │
│  │ Deploy   │ │  │  $ agentputer create my-first-agent          │    │
│  │ ├ Create │ │  │  ✓ Pod created successfully                  │    │
│  │ │ Pod    │ │  │                                              │    │
│  │ ├ Config │ │  │  $ agentputer connect telegram               │    │
│  │ └ VPS    │ │  │  ✓ Telegram bot connected                   │    │
│  │   Access │ │  │                                              │    │
│  │          │ │  │  $ agentputer deploy openclaw                │    │
│  │ Connect  │ │  │  ✓ OpenClaw running 24/7                    │    │
│  │ ├ Tele-  │ │  └──────────────────────────────────────────────┘    │
│  │ │ gram   │ │                                                       │
│  │ ├ Whats- │ │  ## Prerequisites                                    │
│  │ │ App    │ │                                                       │
│  │ └ Disc-  │ │  - An AgentPuter account ([Sign up →])               │
│  │   ord    │ │  - A Telegram account (for bot setup)                │
│  │          │ │                                                       │
│  │ Agent    │ │  ## Architecture Overview                            │
│  │ ├ Open-  │ │                                                       │
│  │ │ Claw   │ │  AgentPuter creates a dedicated cloud VPS for your   │
│  │ ├ Skills │ │  AI Agent. The platform handles:                     │
│  │ └ Models │ │                                                       │
│  │          │ │  • Provisioning (Hetzner Cloud)                      │
│  │ API      │ │  • Agent installation (OpenClaw)                     │
│  │ ├ REST   │ │  • Channel connections (Telegram, etc.)              │
│  │ ├ Web-   │ │  • Health monitoring & auto-restart                  │
│  │ │ Socket │ │                                                       │
│  │ └ Auth   │ │  ┌──────────────────────────────────────────────┐    │
│  │          │ │  │  [Next: Create Your First Pod →]              │    │
│  │ Billing  │ │  └──────────────────────────────────────────────┘    │
│  │ ├ Plans  │ │                                                       │
│  │ └ Usage  │ │                                                       │
│  │          │ │                                                       │
│  └─────────┘ │                                                       │
│              │                                                       │
├──────────────┴───────────────────────────────────────────────────────┤
│  [Footer]                                                            │
└──────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 左侧边栏: 宽 260px, 固定定位, `bg-card` 背景
- 右侧内容区: 最大宽度 800px
- 侧边栏导航项: 展开/折叠, 当前页高亮 (accent-green 左边框)
- 代码块: 终端风格, 可复制按钮
- 底部导航: "上一页 / 下一页" 链接

**文档导航树:**

```
Getting Started
├── Introduction
├── Quick Start
└── Your First Agent

Deploy
├── Create a Pod
├── Pod Configuration
└── VPS Access (SSH)

Connect Channels
├── Telegram
├── WhatsApp
└── Discord

Agent Management
├── OpenClaw Setup
├── Skills (Custom)
└── AI Models

API Reference
├── REST API
├── WebSocket
└── Authentication

Billing
├── Plans & Pricing
└── Usage & Quotas
```

---

## 5. Dashboard 控制台 (`/dashboard`)

### 5.1 页面结构

```
Frame: "Dashboard Page" (1440 x 2400)
背景: #0A0A0A
```

### 5.2 布局

```
┌──────────────────────────────────────────────────────────────────────┐
│  >_ AgentPuter                              [User ▼]  [Sign Out]    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  // DASHBOARD                                                        │
│                                                                      │
│  Welcome back, Fan.                                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Usage This Month                                              │  │
│  │                                                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │ Pods     │  │ Tokens   │  │ Uptime   │  │ Messages     │  │  │
│  │  │          │  │          │  │          │  │              │  │  │
│  │  │   1/1    │  │  45K     │  │  99.8%   │  │  1,247       │  │  │
│  │  │          │  │  /100K   │  │          │  │  this month  │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  MY PODS                                             [+ Create Pod]  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ● My First Agent                                    Running  │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │  IP: 5.161.xxx.xxx                            [Copy]   │   │  │
│  │  │  Uptime: 14d 7h 23m                                    │   │  │
│  │  │  Model: claude-opus-4-5                                │   │  │
│  │  │  Telegram: @my_agent_bot ✓ Connected                   │   │  │
│  │  │  WebChat: http://5.161.xxx.xxx:18789          [Open →] │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  [Manage →]              [Restart]              [Delete]       │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │            + Create New Pod                                    │  │
│  │                                                                │  │
│  │     Deploy a new AI Agent to the cloud in 2 minutes.          │  │
│  │                                                                │  │
│  │           [Create My Agent →]                                 │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  RECENT ACTIVITY                                                     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  02:34:25  ✓ ClawBot processed 47 messages                    │  │
│  │  02:34:22  ✓ Calendar synced                                  │  │
│  │  02:34:18  ✓ WhatsApp connected                               │  │
│  │  02:34:15  ✓ Gateway started                                  │  │
│  │  02:30:00  ⟳ Auto health check passed                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 顶部导航: Dashboard 版本 (非 marketing), 右侧用户菜单
- 统计概览: 4 个指标卡 (Pods / Tokens / Uptime / Messages)
- Pod 卡片: 大尺寸, 显示完整信息 + 操作按钮
- "Create New Pod" 空状态卡片: 虚线边框, 居中 CTA
- Recent Activity: 终端日志风格, 时间戳 + 状态

---

## 6. Pod 详情页 (`/dashboard/pods/:id`)

### 6.1 页面结构

```
Frame: "Pod Detail Page" (1440 x 3600)
背景: #0A0A0A
```

### 6.2 布局

```
┌──────────────────────────────────────────────────────────────────────┐
│  >_ AgentPuter  / Dashboard / My First Agent        [User ▼]        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ← Back to Dashboard                                                │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  ● My First Agent                              [Rename] [⋮]  │  │
│  │  Status: Running                                              │  │
│  │  Created: Feb 1, 2026 · Uptime: 14d 7h 23m                  │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────┐  ┌─────────────────────────────────┐  │
│  │                          │  │                                 │  │
│  │  // OPENCLAW WEBCHAT     │  │  // TELEGRAM                    │  │
│  │                          │  │                                 │  │
│  │  Chat with your AI       │  │  ┌ Status: ✓ Connected        │  │
│  │  directly in browser     │  │  │ Bot: @my_agent_bot          │  │
│  │                          │  │  │ Last ping: 2m ago           │  │
│  │  URL:                    │  │  └─────────────────────────     │  │
│  │  http://5.161.x.x:18789 │  │                                 │  │
│  │                          │  │  [Open in Telegram →]           │  │
│  │  [Open WebChat →]        │  │  [Reconnect] [Disconnect]      │  │
│  │                          │  │                                 │  │
│  └──────────────────────────┘  └─────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  // VPS ACCESS                                                │  │
│  │                                                                │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  IP Address      5.161.xxx.xxx                  [Copy]  │  │  │
│  │  ├─────────────────────────────────────────────────────────┤  │  │
│  │  │  SSH Command      ssh root@5.161.xxx.xxx        [Copy]  │  │  │
│  │  ├─────────────────────────────────────────────────────────┤  │  │
│  │  │  Root Password    ●●●●●●●●●● [Show]             [Copy]  │  │  │
│  │  ├─────────────────────────────────────────────────────────┤  │  │
│  │  │  Region           Ashburn, VA (ash)                     │  │  │
│  │  ├─────────────────────────────────────────────────────────┤  │  │
│  │  │  Specs            2 vCPU / 2 GB RAM / 40 GB SSD        │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  // AI MODEL                                                  │  │
│  │                                                                │  │
│  │  Current Model: claude-opus-4-5                               │  │
│  │  Auth Status: ✓ Token configured                              │  │
│  │  Tokens used: 45,000 / 100,000 this month                    │  │
│  │                                                                │  │
│  │  ████████████████████░░░░░░░░░░ 45%                           │  │
│  │                                                                │  │
│  │  [Change Model] [Update Auth Token]                           │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  // LOGS                                                      │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │  agentputer@pod-alpha:~$ openclaw logs --tail          │   │  │
│  │  │                                                        │   │  │
│  │  │  [02:34:25] [clawbot] Processed 47 messages            │   │  │
│  │  │  [02:34:22] [moltbot] Calendar synced ✓                │   │  │
│  │  │  [02:34:18] [gateway] WhatsApp connected               │   │  │
│  │  │  [02:34:15] [gateway] Telegram connected               │   │  │
│  │  │  [02:30:00] [system] Health check: OK                  │   │  │
│  │  │  [02:15:00] [clawbot] Executed: finance-tracker skill  │   │  │
│  │  │  [02:14:55] [gateway] New message from @user           │   │  │
│  │  │  █                                                     │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  [Download Full Logs]  [Clear Logs]                           │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  // DANGER ZONE                                               │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────┐  ┌─────────────────────┐  │  │
│  │  │  Restart Pod                   │  │  Delete Pod         │  │  │
│  │  │  Restart OpenClaw service      │  │  Permanently        │  │  │
│  │  │  and all connections.          │  │  destroy this Pod   │  │  │
│  │  │                                │  │  and all its data.  │  │  │
│  │  │  [Restart]                     │  │  [Delete Pod]       │  │  │
│  │  └────────────────────────────────┘  └─────────────────────┘  │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 面包屑导航: `AgentPuter / Dashboard / Pod Name`
- 顶部状态栏: Pod 名称 + 状态指示灯 (绿色=Running)
- 2 列布局: WebChat 卡片 + Telegram 卡片
- VPS 信息表格: 密码默认隐藏 (●●●), hover/click 显示
- AI Model: 进度条显示 token 用量
- Logs: 终端窗口风格, 实时日志
- Danger Zone: 红色边框区域, Restart + Delete 操作

---

## 7. Telegram 绑定页 (`/dashboard/pods/:id/telegram`)

### 7.1 页面结构

```
Frame: "Telegram Setup Page" (1440 x 2000)
背景: #0A0A0A
```

### 7.2 布局

```
┌──────────────────────────────────────────────────────────────────────┐
│  [导航栏]                                                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ← Back to Pod                                                      │
│                                                                      │
│  // CONNECT TELEGRAM                                                 │
│                                                                      │
│  Connect your Telegram bot to chat with your AI Agent anytime.       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  Step 1: Create Your Telegram Bot                             │  │
│  │  ─────────────────────────────────────                        │  │
│  │                                                                │  │
│  │  ① Open Telegram and search for @BotFather                    │  │
│  │  ② Send /newbot command                                       │  │
│  │  ③ Follow the instructions to name your bot                   │  │
│  │  ④ Copy the Bot Token                                         │  │
│  │     (looks like: 123456:ABC-DEF1234ghIkl-zyx57W2v...)         │  │
│  │                                                                │  │
│  │  [Open @BotFather in Telegram →]                              │  │
│  │                                                                │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  Step 2: Enter Your Bot Token                                 │  │
│  │  ─────────────────────────────────────                        │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │  Paste your Bot Token here...                          │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  [Connect Telegram →]                                         │  │
│  │                                                                │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  Step 3: Enter Pairing Code                                   │  │
│  │  ─────────────────────────────────────                        │  │
│  │  (此步骤在 Step 2 完成后显示)                                   │  │
│  │                                                                │  │
│  │  ① Open Telegram and send any message to your bot             │  │
│  │  ② You'll receive a pairing code                              │  │
│  │  ③ Enter the code below                                       │  │
│  │                                                                │  │
│  │  ┌──────────────────┐                                         │  │
│  │  │  Enter code...   │                                         │  │
│  │  └──────────────────┘                                         │  │
│  │                                                                │  │
│  │  [Verify & Connect →]                                         │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  ✅ SUCCESS STATE (Step 3 完成后显示):                          │  │
│  │                                                                │  │
│  │  🎉 Telegram Connected!                                       │  │
│  │                                                                │  │
│  │  Your bot @my_agent_bot is now linked to your AI Agent.       │  │
│  │  Send any message to start chatting!                           │  │
│  │                                                                │  │
│  │  [Open @my_agent_bot in Telegram →]                           │  │
│  │  [Back to Dashboard →]                                        │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 3 步向导: 步骤指示器 (1→2→3), 完成的步骤绿色打勾
- Token 输入框: 大输入框, monospace 字体
- Pairing Code 输入: 数字/字母代码, 居中大字
- 成功状态: 绿色高亮卡片, 带 Bot 链接

---

## 8. Footer (全局)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  >_ AgentPuter                                                       │
│  // Your AI Never Sleeps                                             │
│                                                                      │
│  /product          /company          /contact          /legal        │
│  ─ Features        ─ About           ─ hi@agentputer   ─ Privacy    │
│  ─ Pricing         ─ Blog              .com             ─ Terms     │
│  ─ Docs                              ─ Twitter          ─ Security  │
│                                       ─ Discord                     │
│                                                                      │
│  /* © 2026 AgentPuter. All rights reserved. */                      │
│                                                                      │
│  [GitHub ↗]                                                         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 9. Frame 总览 (Pencil 绘制计划)

| # | Frame 名称 | 尺寸 (W×H) | 优先级 |
|---|-----------|-----------|--------|
| 0 | Nav Bar (修复) | 1440×64 | P0 |
| 1 | Features Page | 1440×4800 | P0 |
| 2 | Pricing Page | 1440×3200 | P0 |
| 3 | Blog Page | 1440×3600 | P1 |
| 4 | Docs Page | 1440×3200 | P1 |
| 5 | Dashboard Page | 1440×2400 | P0 |
| 6 | Pod Detail Page | 1440×3600 | P0 |
| 7 | Telegram Setup Page | 1440×2000 | P1 |
| 8 | Footer (全局) | 1440×400 | P1 |

**绘制顺序:** 0 → 1 → 2 → 5 → 6 → 3 → 4 → 7 → 8

---

## 10. 响应式断点

| 断点 | 宽度 | 布局调整 |
|------|------|---------|
| Desktop | ≥1024px | 完整布局 |
| Tablet | 768-1023px | 2列→1列, 侧边栏折叠 |
| Mobile | <768px | 单列, 汉堡菜单, 卡片全宽 |

> MVP 阶段仅设计 Desktop (1440px), 后续迭代增加响应式。

---

*文档完成。Pencil MCP 连接后即可开始绘制。*
