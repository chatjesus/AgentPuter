# Blog 大纲：三种方式部署你的 OpenClaw —— 从装机到一键上线

> 适用于英文版标题：**"3 Ways to Deploy OpenClaw: Mac Mini, VPS, or Under 60 Seconds"**

---

## 文章定位

- **类型**：实操教程 + 科普 + 产品导流
- **目标读者**：对 OpenClaw 感兴趣但还没装的人（从小白到开发者全覆盖）
- **核心叙事**：三条路径，难度递减，各有适用场景。最后自然引出 TinyClaw 作为"零门槛"选项
- **语气**：像一个朋友在帮你装机，不是官方文档。参考 DigitalOcean 教程格式：前置 Prerequisites，每步有 expected output，配 Troubleshooting
- **预计字数**：EN 3,500-4,500 词 / CN 同等

---

## ⚠️ 对照 GitHub 仓库（v2026.2.17，207K Stars）核查清单

以下为对照 https://github.com/openclaw/openclaw README 后发现的 **9 处需修正/补充**：

### 修正项

| # | 原大纲内容 | 正确信息（来自 GitHub） | 影响位置 |
|---|-----------|----------------------|---------|
| 1 | **179K Stars** | **207K Stars**（截至 2026.2.18），38K Forks，683 Contributors | 开头 Hook |
| 2 | **Claude Opus 4.5** | 官方推荐 **Opus 4.6**（README: "I strongly recommend Anthropic Pro/Max + Opus 4.6"） | 步骤 4、TinyClaw、FAQ |
| 3 | 只提 npm | 官方也支持 **pnpm**（`pnpm add -g openclaw@latest`）和 **bun** | 安装步骤 |
| 4 | 缺少 OAuth 认证方式 | 除 API Key 外，还支持 **Anthropic OAuth（Claude Pro/Max 订阅）** 和 **OpenAI OAuth（ChatGPT/Codex 订阅）** | 步骤 4、FAQ |
| 5 | Telegram 唯一入门渠道 | 实际支持 **12+ 渠道**：WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (BlueBubbles), MS Teams, WebChat, Matrix, Zalo 等 | Section I |
| 6 | 缺 `openclaw doctor` | 官方强烈推荐的排障命令，安装后和升级后都应跑 | 路径 A/B 安装后 |
| 7 | 缺聊天命令 | `/status`, `/new`, `/reset`, `/compact`, `/think <level>`, `/verbose on\|off`, `/usage` — 装好后用户第一时间需要的操作 | Section V |
| 8 | 缺 Voice/Canvas 功能 | OpenClaw 支持 **Voice Wake + Talk Mode**（ElevenLabs）和 **Live Canvas**（A2UI），这是跟纯文本 chatbot 的重要区别 | Section I |
| 9 | 缺 WSL2 路径 | 官方支持 **Windows via WSL2**（"strongly recommended"），不只是 Mac 和 Linux | 路径 B 或新增路径 |

### 补充建议

| # | 补充内容 | 来源 | 位置 |
|---|---------|------|------|
| A | **配置文件路径**：`~/.openclaw/openclaw.json`（主配置）、`~/.openclaw/workspace/`（工作区含 SOUL.md/AGENTS.md/TOOLS.md/skills/） | GitHub README | Section V |
| B | **DM 安全默认**：默认 pairing 模式——未知发送者收到配对码，需 `openclaw pairing approve` 才能通过。公开模式需显式 opt-in | GitHub Security section | 路径 A/B 安全说明 |
| C | **沙箱模式**：非主会话（群组/频道）可配置 Docker 沙箱隔离（`sandbox.mode: "non-main"`） | GitHub README | 路径 B 高级配置 |
| D | **远程访问**：官方推荐 **Tailscale Serve/Funnel** 安全暴露 Gateway，而非直接暴露端口 | GitHub Tailscale section | 路径 B 安全 |
| E | **ClawHub 自动搜索**：开启后 agent 可自动搜索并拉取新 Skills | GitHub Skills section | Section V |
| F | **版本通道**：stable / beta / dev 三个更新通道，`openclaw update --channel stable\|beta\|dev` | GitHub README | FAQ 或路径 A/B |

---

## 更新后的大纲结构

### 开头（Hook）

- **207K Stars**，38K Forks，683 贡献者，12,295 commits —— GitHub 上增长最快的 AI 项目之一
- Mac Mini 断货，MacStories 主编 Viticci 烧了 1.8 亿 tokens 说它"改变了我使用 AI 的方式"
- 你也想试试。问题是：怎么装？
- 网上教程要么太极客（Docker Compose + systemd），要么跳步骤。这篇从零开始讲三条路，你根据自己的情况选

---

### I. 先搞清楚 OpenClaw 是什么（30 秒版本）

- 不是 ChatGPT 那种"打开网页问它问题"的东西
- 是一个 **24/7 跑在后台的 AI 员工**，通过你已有的消息 app 跟你对话
- 支持 **12+ 渠道**：WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage（via BlueBubbles）、Microsoft Teams、WebChat、Matrix、Zalo 等
- 它能读你的邮件、管你的日历、操作你的文件、控制你的智能家居、帮你做研究、**用语音跟你对话**（Voice Wake + Talk Mode via ElevenLabs）、**生成可视化画布**（Live Canvas）
- 关键区别：**它有记忆**（SOUL.md + MEMORY.md），用得越久越了解你
- 需要什么：
  - 一台能跑 **Node.js 22+** 的机器（macOS / Linux / Windows WSL2）
  - 一个 AI 模型的 **API Key 或 OAuth 订阅**（Anthropic Claude Pro/Max 或 OpenAI ChatGPT/Codex 订阅均可）
  - 官方强烈推荐：**Anthropic Pro/Max + Opus 4.6**（长上下文能力强、prompt 注入抵抗力更好）

---

### II. 路径 A：Mac Mini 装机指南（适合想完全掌控的人）

**适合谁**：有一台闲置 Mac / 想买台 Mac Mini 专门跑 / 在意数据 100% 留本地

#### 2.1 硬件选择
- Mac Mini M4 基础款（$599）就够了：16GB 内存、256GB 存储
- 功耗 5-10W 待机，一年电费约 $10-20
- 为什么是 Mac Mini：静音、低功耗、原生 iMessage 支持（via BlueBubbles）、macOS 稳定性、还能跑 macOS 菜单栏 Companion App（Voice Wake + 调试工具）

#### 2.2 Prerequisites（前置条件）

```
✅ macOS 13+ (Ventura 及以上)
✅ Node.js 22.12.0+（推荐用 nvm 或 brew 安装）
✅ 一个 Anthropic API Key 或 Claude Pro/Max 订阅（推荐）
   或 OpenAI API Key / ChatGPT 订阅
   或 Google Gemini API Key
✅ 一个 Telegram 账号（用于首次连接，最简单）
```

#### 2.3 安装步骤（写成清晰的 step-by-step，每步配 expected output）

```
步骤 1：安装 Node.js 22+
  $ brew install node@22
  验证：$ node --version  → 应显示 v22.x.x

步骤 2：全局安装 OpenClaw
  $ npm install -g openclaw@latest
  （也可用 pnpm：pnpm add -g openclaw@latest）

步骤 3：运行引导向导
  $ openclaw onboard --install-daemon
  向导会依次引导你：
  → 选模型（推荐 Anthropic Opus 4.6）
  → 填 API Key 或用 OAuth 登录 Claude Pro/Max 订阅
  → 选消息渠道（Telegram 推荐入门）
  → 创建 Telegram Bot（@BotFather → /newbot → 拿到 token）
  → 填入 Bot Token
  → 自动安装 launchd 后台守护进程

步骤 4：验证安装
  $ openclaw doctor
  → 应显示所有检查项为绿色 ✓

步骤 5：打开 Telegram，给你的 bot 发消息
  → bot 会返回一个配对码（pairing code）
  $ openclaw pairing approve telegram <CODE>
  → 配对完成，bot 开始响应你的消息
```

#### 2.4 安装后该做的三件事
- 设定你的 SOUL.md（路径：`~/.openclaw/workspace/SOUL.md`）—— 告诉它你是谁、你的偏好、工作风格
- 跑 `openclaw doctor` 确认一切正常
- 试跑一个真实任务（"帮我整理今天的邮件"）

#### 2.5 真实成本
- 硬件：$599 一次性
- API：$15-50/月（中度使用）到 $100-300/月（重度使用）；如用 Claude Pro/Max 订阅则 $20-100/月固定
- 电费：~$15/年
- 时间：首次安装 15-30 分钟（比之前估计更短，wizard 已很成熟），后续偶尔调优

---

### III. 路径 B：云端部署（VPS 自管 或 AgentPuter 托管）

**适合谁**：没有 Mac / 用 Linux 或 Windows / 想从任何设备远程访问 / 需要真正的 24/7

> 云端部署有两种思路：**自己管服务器**（完全掌控，但要懂运维）或 **用 AgentPuter 托管**（专为 AI Agent 设计的云 Pod，零运维）。下面分别讲。

---

#### 3.1 方式一：自管 VPS（完全掌控）

**适合谁**：会 SSH、想完全控制环境、公司合规要求自建、预算敏感

##### 选服务器
- 推荐：DigitalOcean / Vultr / Hetzner
- 最低配置：2 vCPU、4GB RAM（⚠️ 2GB 不够，Docker 会 OOM）、20GB SSD
- 月费：$5-24/月
- 操作系统：Ubuntu 22.04 LTS
- **Windows 用户**：官方强烈推荐通过 WSL2 安装（README 明确标注 "strongly recommended"），无需 VPS

##### 部署方式 A：直接安装（简单，推荐入门）
```
ssh root@your-server-ip
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
```
（后续步骤同 Mac Mini，wizard 会引导。Linux 下守护进程用 systemd user service）

##### 部署方式 B：Docker Compose（生产级）
```
git clone https://github.com/openclaw/openclaw.git
cd openclaw && ./docker-setup.sh
```
- 优势：进程隔离、一键重启、日志管理、支持沙箱模式（`sandbox.mode: "non-main"` 让群组会话跑在独立 Docker 容器里）
- 劣势：需要 Docker Engine 24+，对新手不友好
- 访问 Dashboard：http://localhost:18789（仅本地）

##### 自管 VPS 的痛点（自然过渡到 AgentPuter）
- 你得自己装 Node.js、配 systemd、管 Tailscale、处理 SSL
- OAuth token 会过期，你不在的时候 Agent 可能断线
- 服务器重启后 OpenClaw 不一定自动恢复
- 想同时跑多个 Agent？你得自己隔离进程和资源
- **一句话：自管 VPS 给你最大自由，但你也得当自己的 DevOps**

---

#### 3.2 方式二：AgentPuter —— 专为 AI Agent 设计的云 Pod

**适合谁**：想要云部署的便利 + 不想当 DevOps / 需要多 Agent 并行 / 在意 24/7 稳定性

##### AgentPuter 是什么

- 网址：[agentputer.com](https://www.agentputer.com/)
- **AI Agent 的专属云运行时** —— 不是通用 VPS，是专门为 OpenClaw / ClawBot / MoltBot 设计的永不关机的云 Pod
- 解决自管 VPS 的四大痛点：

| 自管 VPS 的问题 | AgentPuter 怎么解决 |
|---------------|-------------------|
| 服务器重启 = Agent 掉线 | Pod 24/7 在线，自动恢复，uptime 有 SLA 保障 |
| OAuth token 过期 = 手动重新登录 | 服务端托管 token，自动刷新，零人工干预 |
| 跑 Agent 吃本地 CPU/内存 | 云端隔离资源，本地机器不受影响 |
| 只能在同一网络访问 | 任何设备、任何地点控制你的 Agent |

##### 3 步部署（对照官网流程）

```
步骤 1：创建你的 Pod
  $ agentputer create openclaw
  → 一键分配云环境，选配置和资源

步骤 2：连接你的服务
  $ agentputer connect
  → 授权 Google、Notion、Slack 等。凭证安全存储在 Pod 内

步骤 3：部署 OpenClaw
  $ agentputer deploy openclaw
  → 你的 Agent 开始 24/7 工作。WhatsApp、Telegram、Discord 全渠道在线
```

##### AgentPuter 的独特价值
- **多 Agent 并行**：一个 Pod 里同时跑 ClawBot（私人助手）+ MoltBot（日程管理）+ 自定义 Agent，互不干扰
- **Auth 永不过期**：OAuth token 由服务端维护，自动 refresh，你的 WhatsApp/Telegram 连接不会半夜断掉
- **随时随地访问**：手机、平板、另一台电脑——你的 AI 跟着你走，而不是绑在某台服务器上
- **当前状态**：Early Access（申请 Invite Code，24 小时内发放）

##### AgentPuter vs. 自管 VPS 对比

| | 自管 VPS | AgentPuter |
|--|---------|------------|
| 部署时间 | 15-30 分钟 | 2 分钟 |
| 运维 | 自己管（systemd、Tailscale、备份、SSL） | 零运维，Pod 自动维护 |
| 多 Agent | 需自己隔离 | 原生支持并行 |
| Auth 管理 | 手动处理 token 过期 | 自动刷新 |
| 月费 | VPS $5-24 + API 费 | Pod 订阅 + API 费（定价见官网） |
| 控制权 | 100% root 权限 | 受限于 Pod 环境 |
| 适合 | 运维能力强 / 合规要求自建 | 想省心 / 多 Agent 用户 |

---

#### 3.3 两种云方案共同的注意事项

##### 远程访问安全（重要！）
- **⚠️ 绝对不要** 把 18789 端口直接暴露到公网（参考 CVE-2026-25253）
- 自管 VPS 推荐：**Tailscale Serve/Funnel**
  - `serve` 模式：仅 Tailscale 网络内可访问（最安全）
  - `funnel` 模式：公网 HTTPS，但需要设置密码认证
  - 配置：`gateway.tailscale.mode: "serve"` 或 `"funnel"`
- 备选：SSH 隧道（`ssh -L 18789:localhost:18789 user@server`）
- AgentPuter 用户：远程访问由 Pod 平台托管，无需自行配置

##### 备份
- 自管 VPS：关键路径 `~/.openclaw/` 整个目录
  - `openclaw.json`：主配置
  - `workspace/`：SOUL.md、AGENTS.md、TOOLS.md、skills/
  - `credentials/`：消息渠道凭证（WhatsApp session 等）
  - 建议每日自动备份到外部存储
- AgentPuter：Pod 内数据由平台管理（具体备份策略见官方文档）

---

### IV. 路径 C：TinyClaw —— 60 秒，不碰终端（适合所有人）

**适合谁**：不想学命令行 / 不想管服务器 / 只想"用"不想"装" / 想立刻试

#### 4.1 为什么需要这条路

- 路径 A 需要 $599 + 会用终端 + 知道什么是 Node.js
- 路径 B 自管 VPS 需要 SSH + Docker + Tailscale；AgentPuter 省了运维但仍需要 CLI 和 Invite Code
- 大多数人看到 `npm install -g` 或 `agentputer create` 就关掉了标签页
- **OpenClaw 207K Stars 证明需求是真实的。TinyClaw 解决的是从"想用"到"用上"的最后一公里——纯 GUI，零终端**

#### 4.2 TinyClaw 是什么

- 网址：[tinyclaw.dev](https://tinyclaw.dev)
- 由 [AgentPuter](https://www.agentputer.com/) 团队推出的消费级产品——如果说 AgentPuter 是"开发者的 AI Agent 云"，TinyClaw 就是"所有人的 AI Agent 入口"
- 三步上线：
  1. 选模型（Claude Opus 4.6 / GPT-5.2 / Gemini 3）
  2. 选消息渠道（Telegram，Discord/WhatsApp 即将支持）
  3. Google 账号登录 → 部署完成
- 服务器、SSH、Node.js、OpenClaw 环境全部预配置好，等着分配给你
- **从点击到跟你的 AI 助手说第一句话：< 60 秒**

#### 4.3 四种方案终极对比表

| | Mac Mini | 自管 VPS | AgentPuter | TinyClaw |
|--|---------|---------|------------|----------|
| 部署时间 | 15-30 分钟 | 15-30 分钟 | ~2 分钟 | < 1 分钟 |
| 技术要求 | 会用终端 | SSH + 运维 | CLI 基础 | 无（纯 GUI） |
| 硬件成本 | $599 一次性 | $0 | $0 | $0 |
| 月费 | API 费用 | VPS + API | Pod + API | 托管 + API |
| 数据位置 | 100% 本地 | 你的 VPS | AgentPuter 云 | TinyClaw 云 |
| 24/7 稳定性 | 取决于你的 Mac | 取决于你的运维 | SLA 保障 | SLA 保障 |
| 多 Agent | 手动配置 | 手动隔离 | 原生并行 | 单 Agent |
| Auth 管理 | 手动 | 手动 | 自动刷新 | 自动 |
| iMessage | ✅（BlueBubbles） | ❌ | ❌ | ❌ |
| Voice Wake | ✅（macOS app） | ❌ | ❌ | ❌ |
| Windows | ❌ | ✅（WSL2） | ✅（CLI） | ✅（浏览器） |
| 适合谁 | 极客 / 隐私 | 运维强 / 合规 | 开发者 / 多 Agent | 所有人 |

#### 4.4 TinyClaw 支持的功能（直接从官网拆）
- 邮件读取/摘要/回复草稿
- 日历管理/会议提醒/日程安排
- 文档总结/合同草拟/发票生成
- 费用追踪/报税辅助/价格比较
- 竞品研究/社交媒体草稿/OKR 追踪
- 新闻监控/旅行预订
- 通过自然语言随时添加新用例

---

### V. 装好之后：让你的 OpenClaw 从玩具变成员工（7 步）

不管用哪条路径，装完只是开始：

1. **写你的 SOUL.md**（路径：`~/.openclaw/workspace/SOUL.md`）—— 告诉它你的名字、职业、偏好、沟通风格、时区。这不是 prompt，是身份
2. **跑 `openclaw doctor`** —— 确认所有组件健康
3. **学会聊天命令** —— 在 Telegram 里直接发：
   - `/status` — 查看当前模型、token 用量
   - `/new` 或 `/reset` — 重置会话
   - `/compact` — 压缩上下文（省 token）
   - `/think high` — 开启深度思考模式（Opus 4.6 支持）
   - `/usage full` — 每次回复后显示 token 消耗
4. **连接你的工具** —— Gmail Pub/Sub、Google Calendar、Notion、Todoist、Slack……通过 MCP 工具和 Skills
5. **设置记忆种子** —— 告诉它初始上下文："我每周一有团队会议"、"我的老板叫 Sarah"、"我偏好 Markdown 格式"
6. **跑一个真实工作流** —— 别从"讲个笑话"开始。试试"帮我整理今天的邮件并按优先级排序"
7. **安装社区 Skills** —— 开启 ClawHub 后 Agent 可自动搜索并拉取新 Skills；也可去 SkillsMP（skillsmp.com）手动浏览

---

### VI. 常见问题 FAQ

- **API Key 费用大概多少？** 轻度 $15/月，中度 $30-50/月，重度 $100-300/月。也可以用 Claude Pro（$20/月）或 Max（$100/月）订阅，通过 OAuth 直接登录，不需要单独管理 API Key
- **哪个模型最好？** 官方强烈推荐 **Opus 4.6**（长上下文 + prompt 注入抵抗力强）。GPT-5.2 和 Gemini 3 也支持。选你已有订阅的那个最省事
- **安全吗？** 默认开启 DM 配对模式——陌生人给你的 bot 发消息会收到配对码，你不批准它就不响应。本地部署数据不离开你的机器。⚠️ 远程访问用 Tailscale，不要直接暴露 Gateway 端口
- **能用中文吗？** 能。模型本身支持中文。社区有中文文档站 clawd.org.cn，支持 DeepSeek、Moonshot Kimi、通义千问等国产模型
- **支持 Windows 吗？** 支持，通过 WSL2（官方强烈推荐）。或者直接用 TinyClaw 云端部署，浏览器即可
- **跟 ChatGPT Plus 比有什么区别？** ChatGPT 是你去找它聊天；OpenClaw 是它主动帮你干活。ChatGPT 没有跨会话记忆；OpenClaw 有。ChatGPT 不能操作你的文件和邮件；OpenClaw 能。ChatGPT 不支持语音唤醒和 Canvas；OpenClaw 支持
- **出了问题怎么办？** 跑 `openclaw doctor`，它会自动诊断并给出修复建议。社区 Discord 有 5,000+ 成员在线帮忙
- **怎么升级？** `openclaw update --channel stable`（稳定版），也有 beta 和 dev 通道可选

---

### 结语

- 四条路，一个目的：拥有你自己的 24/7 AI 助手
- **Mac Mini**：极客之选——完全掌控、Voice Wake、iMessage，享受装机的过程
- **自管 VPS**：开发者之选——最大灵活性、root 权限、适合合规要求
- **AgentPuter**：省心之选——[agentputer.com](https://www.agentputer.com/)，专为 AI Agent 设计的云 Pod，多 Agent 并行、Auth 永不过期、零运维
- **TinyClaw**：所有人之选——[tinyclaw.dev](https://tinyclaw.dev)，60 秒，不碰终端
- 四者不是互斥的：你可以先用 TinyClaw 体验，觉得好了再迁移到 AgentPuter 跑多 Agent，最终在 Mac Mini 上搭一套完全自主的本地方案
- 回扣系列：这是我们 Agent 基础设施系列的第九篇。之前我们拆了 OpenClaw 的架构、生态、安全和商业模式。今天终于到了"自己动手"的部分

---

## 写作注意事项

1. **语气**：像朋友教你装机，不是官方文档。可以有"我第一次装的时候踩了这个坑"这种口吻
2. **参考 DigitalOcean 教程格式**：
   - 每个路径开头列 Prerequisites（前置条件清单，用 ✅ 勾选格式）
   - 每步配完整命令 + Expected Output（"你应该看到…"）
   - 每个路径末尾加 Troubleshooting tip（"如果卡在这一步，跑 `openclaw doctor`"）
   - 用 Warning/Note callout 块标注安全和成本陷阱
3. **截图/代码块**：每个关键步骤配代码块，TinyClaw 部分配网站 UI 描述（选模型 → 选渠道 → 登录 → 完成的四帧流程）
4. **产品植入策略**：
   - 路径 B 自管 VPS 的痛点自然过渡到 AgentPuter——"你遇到过 token 半夜过期的情况吗？"
   - AgentPuter 和 TinyClaw 的关系要讲清楚：AgentPuter 是底层云 Pod 平台（开发者向），TinyClaw 是消费级一键入口。不同人群，不矛盾
   - 对比表是最自然的转化工具——四列并排，读者自己选
5. **SEO 关键词**：OpenClaw setup, OpenClaw install, deploy OpenClaw, OpenClaw Mac Mini, OpenClaw tutorial, AgentPuter, AI agent cloud, TinyClaw, one-click OpenClaw, OpenClaw VPS, OpenClaw Docker, OpenClaw WSL2
6. **CTA**：文末加一句"如果你部署成功了，在评论/社区告诉我们你的 Agent 叫什么名字、你让它做的第一件事是什么"
7. **数据更新**：发布前务必从 GitHub 确认最新 Stars 数和版本号（当前 207K Stars, v2026.2.17）
