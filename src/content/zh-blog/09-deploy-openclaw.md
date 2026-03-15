---
title: "四种方式部署 OpenClaw：Mac Mini、VPS、云 Pod，或 60 秒搞定"
description: "OpenClaw 本周突破 207,000 GitHub Stars。这篇从裸机到一键云端，把大多数教程跳过的坑全填上。"
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "部署", "AI Agent", "Mac Mini", "AgentPuter", "TinyClaw", "教程"]
featured: false
---

*Agent 基础设施系列 · 第九篇*

---

OpenClaw 是目前 GitHub 上增长最快的开源 AI 项目：207K Stars、38K Forks、683 位贡献者、超过 12,000 次提交。MacStories 主编 Federico Viticci 用他的实例 "Navi" 烧了 1.8 亿 tokens，说这是"改变了我使用 AI 方式的东西"。多个城市的 Apple Store Mac Mini 因此卖断货——部分原因是人们想要一台专门的常开设备来跑它。

你也想试试。问题是：怎么装？

网上的教程要么默认你知道 systemd 是什么，要么跳了三步让你对着报错发呆。这篇覆盖四条路径——从自己搭本地服务器到 60 秒一键上线——你根据自己的技术水平和需求选一条走。

**四条路径一览：**

| 路径 | 时间 | 技术门槛 | 适合谁 |
|------|------|---------|-------|
| A. Mac Mini | 15–30 分钟 | 会用终端 | 隐私优先，完全掌控 |
| B1. 自管 VPS | 15–30 分钟 | SSH + Linux 运维 | 开发者，合规要求 |
| B2. AgentPuter | ~2 分钟 | 基础 CLI | 多 Agent，零运维 |
| C. TinyClaw | < 1 分钟 | 无 | 所有人 |

---

## 先搞清楚：OpenClaw 到底是什么（30 秒版）

OpenClaw 不是你在浏览器里打开的聊天机器人。它是一个**7×24 小时跑在后台的 AI 助手**，通过你已有的消息 App 跟你对话——WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage（通过 BlueBubbles）、Microsoft Teams、WebChat、Matrix 等。12 个渠道，还在增加。

它跟 ChatGPT 的核心区别：

- **持久记忆。** OpenClaw 有一个 `SOUL.md` 文件，定义它对*你*来说是谁——你的名字、偏好、工作风格、时区。跨会话记忆，越用越了解你。
- **真实操作。** 它能读邮件、管日历、操作文件、控制智能家居、做调研、替你写回复——自主执行。
- **语音和画布。** Voice Wake + Talk Mode（ElevenLabs 驱动）让你免提对话。Live Canvas（A2UI）给它一个可视化工作台。
- **本地优先。** 你的数据留在你的机器上。不拿你的对话训练模型。除非你自己选择，否则不经过第三方云。

**运行 OpenClaw 需要什么：**
- 一台能跑 **Node.js 22+** 的机器（macOS / Linux / Windows WSL2）
- AI 模型订阅：**Anthropic API Key 或 Claude Pro/Max OAuth 登录**（项目作者强烈推荐），或 OpenAI / Google Gemini
- 官方推荐组合：**Anthropic Pro/Max + Opus 4.6**——长上下文最强，prompt 注入抵抗力最高

---

## 路径 A：Mac Mini——你的本地 AI 服务器

**适合谁：** 有一台（或想买一台）Mac Mini。想 100% 本地掌控数据。想用 iMessage 集成和语音唤醒。

### 硬件

Mac Mini M4 基础款（$599）绰绰有余：16GB 统一内存、256GB 存储。待机功耗 5–10W，一年电费约 15 美元。静音、常开、通过 BlueBubbles 原生支持 iMessage——这是任何云部署都做不到的。

买翻新的话，M2 16GB 也完全没问题。避免 8GB 版本——OpenClaw 加上模型的上下文窗口，重度使用会频繁 swap，伤 SSD 寿命。

### 前置条件

开始前确认：

- [x] macOS 13（Ventura）或更新
- [x] 安装了 Homebrew（`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`）
- [x] Node.js 22+（`brew install node@22`，用 `node --version` 验证）
- [x] Anthropic API Key，或 Claude Pro（$20/月）/ Max（$100/月）订阅用于 OAuth 登录
- [x] 一个 Telegram 账号（最简单的入门渠道）

### 分步安装

**步骤 1：全局安装 OpenClaw**

```bash
npm install -g openclaw@latest
```

也可以用 pnpm（`pnpm add -g openclaw@latest`）或 bun，三种都是官方支持的。

你应该看到类似这样的输出：

```
added 1 package in 12s
```

验证安装：

```bash
openclaw --version
```

预期输出：`2026.2.17`（或最新版本号）。

**步骤 2：运行引导向导**

```bash
openclaw onboard --install-daemon
```

向导会交互式引导你完成所有配置：

1. **选模型。** 选 Anthropic Claude（推荐）。如果有 Claude Pro/Max 订阅，选 OAuth 登录——不需要手动管理 API Key。
2. **输入 API Key 或通过 OAuth 认证。**
3. **选消息渠道。** Telegram 是最简单的起步选项。向导会让你去 Telegram 找 @BotFather，用 `/newbot` 创建一个新 bot，把 token 粘贴回来。
4. **安装后台守护进程。** macOS 上会创建 `launchd` 服务，让 OpenClaw 在重启和关闭终端后继续运行。

全程大约 5 分钟。

**步骤 3：验证安装**

```bash
openclaw doctor
```

这是官方诊断工具。它检查 Node.js 版本、Gateway 连接、渠道配置、模型访问和守护进程状态。每一项应该都显示绿色 ✓。如果有黄色或红色，doctor 会告诉你怎么修。

**步骤 4：配对你的第一个设备**

打开 Telegram，给你的新 bot 发任意消息。Bot 会回复一个**配对码**——这是 OpenClaw 的默认安全机制。未知发送者会收到配对码；在你批准之前，他们无法与你的助手交互。

```bash
openclaw pairing approve telegram <CODE>
```

搞定了。你的 bot 已经上线。发一句 "你能做什么？" 看看它的回应。

> **排障提示：** 如果 bot 没响应，先跑 `openclaw doctor`。常见问题：守护进程没启动（重新跑 `openclaw onboard --install-daemon`），或 Telegram token 有拼写错误（检查 `~/.openclaw/openclaw.json`）。

### 安装后要做的三件事

1. **写你的 SOUL.md。** 用任何文本编辑器打开 `~/.openclaw/workspace/SOUL.md`。告诉它你的名字、职业、沟通偏好、时区。这不是 prompt——是一个跨所有对话持久存在的身份文件。

2. **连接你的工具。** Gmail（通过 Pub/Sub）、Google Calendar、Notion、Todoist、Slack——OpenClaw 通过 MCP 工具和 Skills 连接。向导可能已经引导你设置了一些。

3. **跑一个真实任务。** 别从"讲个笑话"开始。试试："帮我整理未读邮件，按优先级排序" 或 "明天我有什么日程，有没有冲突？"

### 真实成本

| 项目 | 费用 |
|------|------|
| 硬件 | $599 一次性（Mac Mini M4 基础款） |
| API（中度使用） | $15–50/月（或 Claude Pro 订阅 $20/月） |
| API（重度使用） | $100–300/月（Viticci 级别） |
| 电费 | ~$15/年 |
| 安装时间 | 15–30 分钟 |

---

## 路径 B：云端部署——自管 VPS 或 AgentPuter 托管

**适合谁：** 没有 Mac。用 Linux 或 Windows。想从任何设备访问助手。需要真正的 7×24 小时在线，不是"我笔记本开着"。

云端部署有两种思路：**自己管服务器**（完全掌控，完全负责）或**用 AgentPuter 托管**（专为 AI Agent 设计的云运行时，零运维）。下面分别讲。

---

### B1：自管 VPS

**适合谁：** 会 SSH。想要 root 权限。公司要求自建基础设施。在意成本控制。

#### 选服务器

| 服务商 | 最低配置 | 月费 |
|--------|---------|------|
| Hetzner | 2 vCPU, 4GB RAM, 20GB SSD | ~$5/月 |
| DigitalOcean | 2 vCPU, 4GB RAM, 25GB SSD | ~$12/月 |
| Vultr | 2 vCPU, 4GB RAM, 25GB SSD | ~$12/月 |

> **注意：** 不要低于 4GB 内存。用 Docker 的话，2GB 会 OOM 杀进程。亲身经历。

系统：Ubuntu 22.04 LTS。

**Windows 用户：** 你不一定需要 VPS。OpenClaw 官方支持 Windows WSL2（README 标注 "strongly recommended"）。装好 WSL2，然后按下面 Linux 的步骤来。

#### 方式 A：直接安装（推荐入门）

```bash
ssh root@your-server-ip

# 安装 Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 OpenClaw
npm install -g openclaw@latest

# 运行引导向导
openclaw onboard --install-daemon
```

Linux 下守护进程用 `systemd` user service 而不是 `launchd`。其他步骤跟 Mac Mini 完全一样——向导会处理。

验证：

```bash
openclaw doctor
```

#### 方式 B：Docker Compose（生产级）

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

优势：
- 进程隔离——OpenClaw 跑在独立容器里
- 一条命令重启：`docker compose restart`
- 内置日志管理
- 沙箱模式：设置 `sandbox.mode: "non-main"` 让群组/频道会话跑在隔离的 Docker 容器里

劣势：
- 需要 Docker Engine 24+
- 多了一层抽象，调试更复杂

Gateway Dashboard 在 `http://localhost:18789`——但只能本地访问，这就引出了最重要的部分。

#### 远程访问：这不是可选项

> **CVE-2026-25253 证明了直接暴露 Gateway 端口到互联网会导致 token 窃取和远程代码执行。别这么做。**

**推荐：Tailscale Serve/Funnel**

Tailscale 给你一个私有网络覆盖层。OpenClaw 有一等支持：

```json
{
  "gateway": {
    "tailscale": {
      "mode": "serve"
    }
  }
}
```

- `"serve"`——仅 Tailscale 网络内可访问（最安全）
- `"funnel"`——公网 HTTPS，但需要密码认证（`gateway.auth.mode: "password"`）

**备选：SSH 隧道**

```bash
ssh -L 18789:localhost:18789 user@your-server-ip
```

然后在本地浏览器访问 `http://localhost:18789`。

#### 备份

OpenClaw 的全部状态都在 `~/.openclaw/`：

| 路径 | 内容 |
|------|------|
| `openclaw.json` | 主配置文件 |
| `workspace/` | SOUL.md、AGENTS.md、TOOLS.md、skills/ |
| `credentials/` | 渠道凭证（WhatsApp session、Telegram token 等） |

每天备份。一个简单的 cron 就够：

```bash
tar czf ~/openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/
```

#### 自管 VPS 的痛点

我在自管 VPS 上跑了三个月 OpenClaw，以下是实话：

- 你得自己装 Node.js、配 systemd、搞 Tailscale、处理 TLS。
- OAuth token 会过期。如果你在另一个时区睡觉，WhatsApp 连接凌晨 3 点断了，你的 Agent 安静到你醒来手动重新认证。
- 服务器重启后（内核更新、服务商维护），OpenClaw 不一定能干净恢复。你慢慢学会写恢复脚本。
- 想同时跑多个 Agent？你得自己隔离进程和资源。

**一句话：自管 VPS 给你最大自由，但你也得当自己的运维团队。**

如果看完上面这段你已经觉得累了，还有另一条路。

---

### B2：AgentPuter——专为 AI Agent 设计的云 Pod

**适合谁：** 想要云部署的便利但不想当运维。需要多 Agent 并行。在意 7×24 小时稳定性和 SLA 保障。

#### AgentPuter 是什么

[AgentPuter](https://www.agentputer.com/) 不是通用 VPS。它是**专门为 AI Agent 设计的云运行时**——OpenClaw、ClawBot、MoltBot 和自定义 Agent 都能跑。可以理解为"AI 助手的 Heroku"：你不管服务器、容器、守护进程。你得到的是一个永不关机的 Pod。

它解决自管 VPS 的四大痛点：

| 自管 VPS 的问题 | AgentPuter 怎么解决 |
|---------------|-------------------|
| 服务器重启 = Agent 掉线 | Pod 7×24 在线，自动恢复，有 uptime SLA |
| OAuth token 过期 = 手动重新登录 | 服务端托管 token，自动刷新，零人工 |
| Agent 吃本地 CPU/内存 | 云端隔离资源，本地机器不受影响 |
| 只能在同一网络访问 | 任何设备、任何地点控制你的 Agent |

#### 三步部署

```bash
# 步骤 1：创建你的 Pod
agentputer create openclaw
# → 一键分配云环境，选配置和资源

# 步骤 2：连接你的服务
agentputer connect
# → 授权 Google、Notion、Slack 等。凭证安全存储在 Pod 内

# 步骤 3：部署 OpenClaw
agentputer deploy openclaw
# → 你的 Agent 开始 7×24 工作。WhatsApp、Telegram、Discord 全渠道在线
```

全程约 2 分钟。

#### AgentPuter 的独特价值

- **多 Agent 并行。** 一个 Pod 里同时跑 ClawBot（私人助手）+ MoltBot（日程管理）+ 自定义研究 Agent，各自独立资源。
- **Auth 永不过期。** OAuth token 由服务端维护，自动 refresh。你的 WhatsApp 连接不会因为 token 过期半夜断掉。
- **随时随地访问。** 手机、平板、另一台电脑——你的 AI 跟着你走，而不是绑在某台服务器上。
- **当前状态：** Early Access。在 [agentputer.com](https://www.agentputer.com/) 申请 Invite Code，24 小时内发放。

#### AgentPuter vs. 自管 VPS

| | 自管 VPS | AgentPuter |
|--|---------|------------|
| 部署时间 | 15–30 分钟 | ~2 分钟 |
| 运维 | 自己管 systemd、Tailscale、备份、TLS | 零运维，Pod 自动维护 |
| 多 Agent | 需自己隔离 | 原生并行支持 |
| Auth 管理 | 手动处理 token 过期 | 自动刷新 |
| 月费 | VPS $5–24 + API 费 | Pod 订阅 + API 费 |
| 控制权 | 100% root 权限 | 受限于 Pod 环境 |
| 适合 | 运维强 / 合规要求 | 想省心 / 多 Agent 用户 |

---

## 路径 C：TinyClaw—— 60 秒，零终端

**适合谁：** 不想学命令行。不想管服务器。只想*用*AI 助手，不想*装*。想现在就试。

### 为什么需要这条路

路径 A 需要 $599 和知道 Node.js 是什么。路径 B 自管 VPS 需要 SSH、Docker、Tailscale。AgentPuter 虽然简单很多，但仍然需要 CLI 和 Invite Code。

大多数人看到 `npm install -g` 就关掉了标签页。

OpenClaw 的 207,000 Stars 证明需求是真实的。瓶颈不是产品——是部署门槛。TinyClaw 消灭了这个门槛。

### TinyClaw 是什么

[TinyClaw](https://tinyclaw.dev) 是 [AgentPuter](https://www.agentputer.com/) 团队推出的消费级产品。如果说 AgentPuter 是"开发者的 AI Agent 云"，TinyClaw 就是"所有人的 AI Agent 入口"。

**三步上线：**

1. **选模型**——Claude Opus 4.6 / GPT-5.2 / Gemini 3
2. **选渠道**——Telegram（Discord 和 WhatsApp 即将支持）
3. **Google 账号登录** → 部署完成

没有服务器。没有 SSH。没有 Node.js。没有终端。基础设施预配置好，等着分配给你。

**从点击到跟你的 AI 助手说第一句话：不到 60 秒。**

### TinyClaw 能做什么

部署完成后，你的 TinyClaw 托管的 OpenClaw 可以：

- 读取、摘要、草拟邮件回复
- 管理日历、设置提醒、解决日程冲突
- 总结文档、起草合同、生成发票
- 追踪开支、比价、辅助报税
- 竞品调研、草拟社交媒体帖子、追踪 OKR
- 监控新闻、预订旅行
- 通过自然语言随时添加新能力——告诉它你需要什么就行

### 终极对比表

| | Mac Mini | 自管 VPS | AgentPuter | TinyClaw |
|--|---------|---------|------------|----------|
| 部署时间 | 15–30 分钟 | 15–30 分钟 | ~2 分钟 | < 1 分钟 |
| 技术要求 | 会用终端 | SSH + 运维 | 基础 CLI | 无（纯 GUI） |
| 硬件成本 | $599 一次性 | $0 | $0 | $0 |
| 月费 | API 费用 | VPS + API | Pod + API | 托管 + API |
| 数据位置 | 100% 本地 | 你的 VPS | AgentPuter 云 | TinyClaw 云 |
| 7×24 稳定性 | 取决于你的 Mac | 取决于你的运维 | SLA 保障 | SLA 保障 |
| 多 Agent | 手动配置 | 手动隔离 | 原生并行 | 单 Agent |
| Auth 管理 | 手动 | 手动 | 自动刷新 | 自动 |
| iMessage | ✅（BlueBubbles） | ❌ | ❌ | ❌ |
| 语音唤醒 | ✅（macOS app） | ❌ | ❌ | ❌ |
| Windows | ❌ | ✅（WSL2） | ✅（CLI） | ✅（浏览器） |
| 适合谁 | 极客 / 隐私 | 运维强 / 合规 | 开发者 / 多 Agent | 所有人 |

---

## 装好之后：7 步让 OpenClaw 从玩具变成员工

不管你走哪条路，安装只是开始。以下是让它真正有用的方法：

### 1. 写你的 SOUL.md

路径：`~/.openclaw/workspace/SOUL.md`

这不是系统 prompt，是身份文件。告诉它：
- 你的名字、职位、做什么工作
- 你的沟通风格（正式？随意？喜欢条列式？）
- 你的时区和工作时间
- 你的偏好（"我喜欢 Markdown 格式"、"不要在上午 10 点前排会议"）

越具体，以后重复说明的次数越少。

### 2. 跑 `openclaw doctor`

安装后跑一次，每次升级后跑一次，觉得哪里不对劲就跑一次。它检查所有东西——Node 版本、Gateway 健康、渠道连通、模型访问、守护进程状态——并告诉你怎么修。

### 3. 学会聊天命令

这些在任何已连接的渠道里都能用——Telegram、WhatsApp、Slack、Discord：

| 命令 | 功能 |
|------|------|
| `/status` | 查看当前模型、token 用量、会话信息 |
| `/new` 或 `/reset` | 重置对话会话 |
| `/compact` | 压缩上下文（省 token） |
| `/think high` | 开启深度思考模式（Opus 4.6） |
| `/verbose on` | 更详细的回复 |
| `/usage full` | 每次回复后显示 token 消耗 |

这些是你的日常操控。单是 `/compact` 就能在长对话中省 30–40% 的 token 费用。

### 4. 连接你的工具

OpenClaw 通过 MCP（Model Context Protocol）工具和 Skills 接入外部服务：

- **Gmail**——通过 Pub/Sub 实现实时邮件通知
- **Google Calendar**——读取、创建、修改日程
- **Notion / Todoist / Linear**——任务管理
- **Slack**——既是消息渠道也是工具
- **浏览器**——OpenClaw 可以控制一个专用 Chrome 实例

### 5. 种下记忆种子

给它一些初始上下文，它会永远记住：

> "我每周一上午 10 点有团队会议。我的老板叫 Sarah。我偏好 Markdown 格式的回复。我正在做 Q1 Project Atlas 的发布。"

这些事实会持久化在记忆里，影响未来的每次交互。

### 6. 跑一个真实工作流

别用无聊问题测试，给它真正的工作：

- "帮我整理未读邮件，按优先级排序"
- "这周我有什么日程？标记出冲突"
- "调研 [产品] 的前 5 个竞品，给我一个对比表"
- "帮我草拟回复 [某人] 的邮件——专业语气，接受会议但建议改到周四"

### 7. 安装社区 Skills

在配置里开启 **ClawHub**，你的 Agent 就能自动搜索和安装新 Skills。也可以去 [SkillsMP](https://skillsmp.com) 手动浏览——市场上有数千个社区贡献的 Skills，从 Jira 集成到机票价格追踪应有尽有。

---

## 常见问题 FAQ

**API 费用大概多少？**
轻度使用约 $15/月，中度 $30–50/月，重度（Viticci 级别）$100–300/月。也可以用 Claude Pro 订阅（$20/月）或 Max（$100/月），通过 OAuth 登录，不用单独管理 API Key。

**哪个模型最好？**
项目作者强烈推荐 **Claude Opus 4.6**——长上下文最强，prompt 注入抵抗力最高。GPT-5.2 和 Gemini 3 也支持。选你已有订阅的那个最省事。

**安全吗？**
默认开启 **DM 配对模式**——任何未知发送者都会收到配对码，你不批准就无法跟你的助手交互（`openclaw pairing approve`）。本地部署数据不离开你的机器。远程访问用 Tailscale——绝对不要把 Gateway 端口（18789）直接暴露到公网。

**支持中文吗？**
支持。底层模型原生支持中文。社区有中文文档站 clawd.org.cn，也支持 DeepSeek、Moonshot Kimi、通义千问等国产模型。

**支持 Windows 吗？**
支持，通过 WSL2（Windows Subsystem for Linux）——官方支持且强烈推荐。或者用 TinyClaw 云端部署，浏览器直接用，零本地配置。

**跟 ChatGPT Plus 比有什么区别？**
ChatGPT 是你去找它聊天；OpenClaw 是它来找你——通过 WhatsApp、Telegram、Slack，你在哪它在哪。ChatGPT 没有跨会话持久记忆；OpenClaw 有。ChatGPT 不能操作你的文件和邮件；OpenClaw 能。ChatGPT 不支持语音唤醒和 Live Canvas；OpenClaw 支持。

**出了问题怎么办？**
跑 `openclaw doctor`，它自动诊断并给出修复建议。社区 Discord 有 5,000+ 活跃成员可以帮忙。

**怎么升级？**
```bash
openclaw update --channel stable
```
也有 `beta` 和 `dev` 通道可选。

---

## 结语

四条路，一个目的：拥有你自己的 7×24 AI 助手。

- **Mac Mini**——极客之选，完全掌控、语音唤醒、iMessage。
- **自管 VPS**——开发者之选，root 权限、最大灵活性。
- **[AgentPuter](https://www.agentputer.com/)**——省心之选，专为 AI Agent 设计的云 Pod，多 Agent 并行、Auth 永不过期、零运维。
- **[TinyClaw](https://tinyclaw.dev)**——所有人之选，60 秒，不碰终端。

四者不是互斥的。你可以先用 TinyClaw 在 60 秒内体验 OpenClaw，觉得好了迁移到 AgentPuter 跑多 Agent，最终在 Mac Mini 上搭一套完全自主的本地方案。

这是 Agent 基础设施系列的第九篇。我们拆过[为什么 Agent 需要自己的电脑](/blog/agent-needs-its-own-computer/)、OpenClaw 的[架构](/blog/dissecting-openclaw-architecture/)、[技能生态](/blog/agent-skills-ecosystem/)、[企业工作流](/blog/vibe-working-when-agents-work/)、[ClawdBot 深度解析](/blog/deep-dive-clawdbot-breakout-agent/)、[商业模式](/blog/who-makes-money-from-openclaw/)和[创始人加入 OpenAI 的影响](/blog/openclaw-creator-joins-openai/)。今天终于到了"自己动手"的部分。

如果你部署成功了，来评论区或社区告诉我们：**你的 Agent 叫什么名字？你让它做的第一件事是什么？**

---

*参考资料：*
- [OpenClaw GitHub 仓库](https://github.com/openclaw/openclaw)（207K Stars, v2026.2.17）
- [AgentPuter —— AI Agent 的 7×24 云运行时](https://www.agentputer.com/)
- [TinyClaw —— 一键部署 OpenClaw](https://tinyclaw.dev)
- [OpenClaw 官方文档](https://docs.openclaw.ai)
- CVE-2026-25253 —— OpenClaw Gateway Token 窃取漏洞（详见我们的安全分析文章）
