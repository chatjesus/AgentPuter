---
title: "OpenClaw 进阶手册：30 个没人告诉你的使用技巧"
description: "maxSpawnDepth 默认值是 1，不是无限。SOUL.md 对子 Agent 不可见。cleanup 默认保留所有文件。30 条来自真实生产环境的配置技巧，缩短「能跑」和「配置正确」之间的距离。"
date: "2026-02-21"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "配置优化", "Sub-Agent", "Skill", "成本控制", "安全", "实战技巧"]
featured: true
---

# OpenClaw 进阶手册：30 个没人告诉你的使用技巧

**OpenClaw 社区 · 2026 年 2 月**

> 大多数人装好 OpenClaw，跑起第一个 Agent，就自称会用了。
> 这篇文章写给另一类人——想搞清楚「为什么这样设计」、「默认值到底是多少」、「怎么把同一个工具用出十倍价值」的人。

这 30 条技巧来自真实生产环境、官方文档深度审查，以及一些代价不小的踩坑记录。没有废话，每条都有今天就能执行的具体动作。

---

## 目录

1. [第一章：基础配置（Tips 01–08）](#chapter-1)
2. [第二章：Skill 选择与使用（Tips 09–14）](#chapter-2)
3. [第三章：Sub-Agent 架构实战（Tips 15–20）](#chapter-3)
4. [第四章：成本控制（Tips 21–25）](#chapter-4)
5. [第五章：调试与安全（Tips 26–30）](#chapter-5)
6. [附录：用 TinyClaw 60 秒部署](#tinyclaw)

---

## 第一章：基础配置 {#chapter-1}

> 这是大多数人用错好几个月的配置层。先把这里改对，后面省一半麻烦。

---

### Tip 01｜AGENTS.md vs SOUL.md：搞清楚边界

OpenClaw 有三级文件加载层次：

```
全局：  ~/.openclaw/SOUL.md
项目：  ./SOUL.md
会话：  AGENTS.md + TOOLS.md
```

**核心规则：子 Agent 只加载 `AGENTS.md` 和 `TOOLS.md`。**

`SOUL.md`、`IDENTITY.md`、`USER.md`、`HEARTBEAT.md`、`BOOTSTRAP.md` 对子 Agent 完全不可见。

这是一个高频踩坑点：工程师把路由规则写进 `SOUL.md`，然后奇怪为什么子 Agent 不按套路出牌——原因就在这里。

**解决方案：** 任何子 Agent 需要知道的内容——路由规则、角色设定、工具限制——必须写进 `AGENTS.md`。

```markdown
# AGENTS.md（子 Agent 可见）

## 路由规则
- 财务相关问题 → 转交 finance-agent
- 代码审查请求 → 转交 code-reviewer
- 研究任务 → 转交 research-storm
```

---

### Tip 02｜指定模型必须带 provider 前缀

错误写法：
```json
{ "model": "claude-opus-4-6" }
```

正确写法：
```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-opus-4-6"
      }
    }
  }
}
```

格式始终是 `provider/model-name`。不带 provider 前缀，当两个供应商有相似模型名时，OpenClaw 的模型路由器可能静默失败。

**常用模型字符串：**

| 模型 | 适用场景 |
|------|---------|
| `anthropic/claude-opus-4-6` | 复杂推理、架构设计 |
| `anthropic/claude-sonnet-4-6` | 日常主力，成本/质量最优 |
| `anthropic/claude-haiku-4-5` | 执行类任务，速度优先 |
| `google/gemini-3.1-pro-preview` | 长文档处理、多模态 |
| `openai/gpt-4o-mini` | 摘要、分类、格式转换 |
| `ollama/qwen2.5` | 不能出本地网络的敏感数据 |

---

### Tip 03｜用 .env 管理 API Key，不要放进 config.json

每个月都有人把含 API Key 的 OpenClaw 配置推到 GitHub。不要成为那个人。

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
CONTEXT7_API_KEY=...
```

```bash
# .gitignore（不容商量）
.env
.env.local
.env.*
```

OpenClaw 自动读取 `.env` 文件。没有任何理由把 Key 硬编码在任何地方。

---

### Tip 04｜maxSpawnDepth 默认值是 1，不是无限

如果你见过 `SpawnDepthExceeded` 报错，就是因为这个。

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

- **默认值：** 1（只允许一层子 Agent）
- **最大值：** 5
- **推荐值：** 2，适用于绝大多数架构

Depth 2 的叶子节点无法继续 spawn。强行设更深会在运行时报错，调试起来很痛苦。除非有非常明确的理由，不要超过 2 层。

**Depth 2 架构示意：**

```
主 Agent（depth 0）
├── 研究子 Agent（depth 1）
│   └── [可以 spawn，但 depth 2 限制阻止了]
├── 分析子 Agent（depth 1）
└── 撰写子 Agent（depth 1）
```

---

### Tip 05｜runTimeoutSeconds 默认值是 0（无超时）

0 意味着永不超时。一个卡死的子 Agent 会一直跑下去消耗 token，直到你发现为止。

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

生产环境推荐 120 秒作为大多数任务的上限。数据密集型 Agent 可能需要 300 秒。

**重要：** 超时只停止执行，**不会删除 session**。你仍然需要 `cleanup` 来管理 session 文件（见 Tip 06）。

---

### Tip 06｜设置 cleanup: "delete" 防止 Session 堆积

默认值是 `keep`。每个完成的 session 都会留下文件，时间久了会堆积。

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

设为 `"delete"` 后，已完成的 session 会被归档（transcript 文件改名为 `*.deleted.*`，不是真删除），保持工作目录整洁。不设置的话，session 会一直堆积，直到 60 分钟自动归档触发。

---

### Tip 07｜接入 context7，停止让 Agent 编造 API

这一个 MCP 集成对涉及库和框架的任务质量提升最为显著。接入后，Agent 在回答问题时会查询实时的官方文档，而不是依赖可能已经一两年过时的训练数据。

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    }
  }
}
```

配置完成后，你可以问：「最新版 Next.js 的 Server Actions 怎么用？」——得到的是当前准确的答案，不是 2023 年 Beta 版的文档。

---

### Tip 08｜用 TOOLS.md 限制 Agent 能碰什么

`TOOLS.md` 是你的权限边界。没有它，Agent 可以调用任何可用工具。

```markdown
# TOOLS.md

## 工具限制

deny: ["gateway", "cron", "billing", "admin_delete"]
```

`deny` 的优先级高于 `allow`。在多 Agent 设置中，明确封锁高风险工具尤为重要——一个被攻击的 Skill 可能通过工具调用在整个 Agent 图中传播损害。

---

## 第二章：Skill 选择与使用 {#chapter-2}

---

### Tip 09｜安装 Skill 之前，先看安全评分

ClawHub 和 agentskills.io 都提供每个 Skill 的安全评分。这不是装饰。

**评分等级：**
- **A/B 级（80+）：** 可以用于生产环境
- **C 级（70–79）：** 安装前检查 OAuth 授权范围
- **D 级（≤69）：** 先在沙盒环境测试。不要直接用于生产。

2026 年 2 月的 ClawHavoc 事件，ClawHub 一次下架了 341 个含有恶意 prompt 注入载荷的 Skill。安全评分是你的第一道防线。

---

### Tip 10｜self-improvement：真正会进化的 Skill

`self-improvement` 自动将每个 session 中的报错、纠错和知识盲区记录到 `.learnings/ERRORS.md`。下一个 session 开始前，Agent 会读回这份记录——带着上次的失败教训进入新任务。

不需要额外配置，不需要搭配其他 Skill。装好，在同一个重复任务上跑两周，对比出错率。复利效应是真实的。

---

### Tip 11｜理解 Skill 加载顺序（后者覆盖前者）

加载顺序：`TOOLS.md` → `AGENTS.md` → `SKILL.md`

如果一个 Skill 定义的工具与你 `AGENTS.md` 里的同名，**Skill 里的版本生效**。这既是特性（Skill 可以扩展你的基础配置），也是陷阱（写得差的 Skill 可能静默覆盖某个关键配置）。

如果你有自定义工具配置，安装 Skill 之前务必检查它的工具定义。

---

### Tip 12｜一个最小可行的自定义 Skill 只需三个区块

如果你一直因为觉得「写 Skill 很麻烦」而拖着没写，其实并不麻烦。最小结构：

```markdown
# my-skill/SKILL.md

## What I do
我分析 CSV 格式的销售数据，生成结构化的周报摘要。

## When to use me
在销售周期结束后，有 CRM 导出的 CSV 文件时调用我。
不适用于实时数据或非销售数据集。

## How I work
1. 从 task prompt 中提供的路径读取 CSV
2. 计算总计、TOP 表现者和环比变化
3. 将结果格式化为 Markdown 表格
4. 将输出保存到 output/sales_summary_[date].md
```

自然语言就够了。Agent 完全能理解这样写的指令。

---

### Tip 13｜知道该用哪个 Skill 市场

| 平台 | 优势 | 最适合 |
|------|------|--------|
| **clawhub.ai** | 人工审核，安全评审，3,286 个 Skill | 生产环境使用，质量优先 |
| **agentskills.io** | 19,309 个 Skill，长尾覆盖广 | 特定小众场景，研究用途 |

需要可靠工作的 Skill 用 ClawHub。需要 ClawHub 没有的特定功能用 agentskills.io。两者互补，不是竞争关系。

---

### Tip 14｜proactive-agent + Cron：真正的无人值守工作流

这条技巧会改变你对 Agent 的认知方式。`proactive-agent` 支持：

- **WAL（预写日志）：** 崩溃恢复，跨重启的上下文持久化
- **自主 Cron：** 定时执行，不需要人触发
- **上下文恢复：** 中断后从上次停止的地方继续

一个真实世界的例子：

```
定时：每天 08:00
任务：汇总昨天的 GitHub Issues 和 PR，
      拉取今天的日程，标记日程冲突，
      将摘要推送到 Slack #morning-brief 频道
```

配置完成后，不需要任何人工介入。这才是「自主」真正的含义。

---

## 第三章：Sub-Agent 架构实战 {#chapter-3}

> 掌握子 Agent，是从 OpenClaw 用户到 OpenClaw 工程师的分水岭。

---

### Tip 15｜Fan-Out 架构将延迟降低约 40%

串行执行：

```
主 Agent → 任务 A（12s）→ 任务 B（11s）→ 任务 C（7s）→ 任务 D（5s）
总计：35 秒
```

Fan-Out 并行：

```python
sessions_spawn(task="抓取市场数据",   label="market-data",    model="anthropic/claude-haiku-4-5")
sessions_spawn(task="汇总新闻",       label="news-summary",   model="anthropic/claude-haiku-4-5")
sessions_spawn(task="检查日程冲突",   label="calendar-check", model="anthropic/claude-haiku-4-5")
sessions_spawn(task="分析昨日任务",   label="task-analysis",  model="anthropic/claude-haiku-4-5")
# 四个子 Agent 同时启动，主 Agent 不阻塞，继续执行后续逻辑
总计：约 20 秒（受最慢的子 Agent 决定）
```

`sessions_spawn` 立即返回 `runId`，主 Agent 不等待。这是大多数团队能做的最具影响力的结构性改变。

---

### Tip 16｜「聪明老板 + 便宜实习生」：模型层次策略

设置子 Agent 的全局默认模型，必要时按任务覆盖：

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

真正需要更强能力的任务，在调用时覆盖：

```python
sessions_spawn(
    task="为多租户 SaaS 设计数据库 Schema",
    label="schema-design",
    model="anthropic/claude-opus-4-6"  # 仅此任务使用 Opus
)
```

真实结果：API 成本降低 50–60%，质量损失基本可忽略。Haiku 能完成 80% 以上的执行类任务。

---

### Tip 17｜路由逻辑写 AGENTS.md，不写 SOUL.md

这个错误值得重复，因为它太常见、失败又太静默：

```markdown
# ❌ 错误 —— 写在 SOUL.md（子 Agent 看不到）
当用户询问财务问题时，转交给 finance-agent。

# ✅ 正确 —— 写在 AGENTS.md（子 Agent 可见）
当用户询问财务问题时，转交给 finance-agent。
```

如果你的路由不工作，这是首先要检查的地方。

---

### Tip 18｜Spawn 子 Agent 时 label 参数必填

```python
# ❌ 不带 label
sessions_spawn(task="分析 Q4 销售数据")
# 这个崩了之后：是哪个 session？不知道。

# ✅ 带 label
sessions_spawn(
    task="分析 Q4 销售数据",
    label="q4-sales-analysis-2026"
)
# 崩了之后：/subagents log q4-sales-analysis-2026
```

label 是 `/subagents list`、`/subagents log`、`/subagents info` 的关键索引。没有它，在多 Agent 工作流里调试一个失败的子 Agent，就像在 `ps aux` 里找一个没有名字的进程。

---

### Tip 19｜子 Agent 是「发射后不管」，不是实时对话

`announce` 机制是单向的：子 Agent 在完成时汇报，**无法在执行中途向父 Agent 提问**。

这对 task prompt 有直接影响：**prompt 必须完整、自洽。**

```python
# ❌ 会静默失败 —— 太模糊
sessions_spawn(task="分析一下数据", label="analysis")

# ✅ 正确 —— Agent 需要的一切都在 prompt 里
sessions_spawn(
    task="""
    分析 /data/sales_2026_jan.csv。
    计算：1）月总收入；2）销量 TOP 5 产品；
    3）与 /data/sales_2025_dec.csv 的环比变化。
    输出：Markdown 表格。保存到 /output/jan_2026_report.md。
    如果文件不存在，向 /output/errors.log 写一行错误信息。
    """,
    label="jan-2026-sales-analysis"
)
```

把 task prompt 写成「留给一个无法向你提问的人的详细便条」。

---

### Tip 20｜调整并发限制，避免触发 API 限速

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

- `maxChildrenPerAgent`：单个父 Agent 最多能 spawn 多少子 Agent（默认 5，范围 1–20）
- `maxConcurrent`：全局并发子 Agent 上限（默认 8）

如果你的 API Plan 有每分钟 token/请求数限制，`maxConcurrent` 就是调节旋钮。触碰上限不会崩溃工作流——会排队——但会增加总延迟。

高级 API Plan 可以把 `maxConcurrent` 调高；个人 Plan 建议保持在 3–4。

---

## 第四章：成本控制 {#chapter-4}

> 跑 Agent 需要花钱，但可以花得很聪明。

---

### Tip 21｜安装 save-money Skill，自动切换模型

`save-money` Skill 监控任务复杂度，路由到最便宜的有能力的模型：

- 分类、摘要、格式转换 → **Haiku**
- 标准代码生成、分析 → **Sonnet**
- 复杂推理、架构设计、多步规划 → **Opus**

```bash
openclaw install save-money
```

用户反馈月 API 成本降低 50% 以上，质量无明显损失。Skill 的路由逻辑基于 token 数、任务类型检测和可配置的复杂度阈值。

---

### Tip 22｜用 Context Compaction 应对超长会话

Claude Opus 和 Sonnet 4.6 支持 Context Compaction API。当对话历史接近 token 上限时，系统会智能压缩，而不是截断。

最重要的场景：
- 多小时的研究会话
- 长调试过程
- 迭代式文档编辑工作流

不用 Compaction，触碰上限就会丢失上下文。用了，会话可以连贯地继续。

---

### Tip 23｜每次 Session 后跑 openclaw usage

```bash
openclaw usage
```

输出按 session、模型、工具分类显示 token 消耗。每次非平凡的 session 结束后扫一眼。

常见发现：
- 某个子 Agent 消耗了其他 Agent 5 倍的 token → prompt 太长
- 一个工具每个 session 被调用 20 次 → Agent 在循环
- Opus 被用于 Sonnet 能处理的任务 → 模型路由配置有问题

这是找到预算真正流向哪里的最快方式。

---

### Tip 24｜摘要和分类任务强制用 gpt-4o-mini

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

这类任务，GPT-4o-mini 的准确率足够用，成本比 Opus 低 80%。原则：用能完成任务的最便宜的模型，把贵的模型留给真正需要它们的场景。

---

### Tip 25｜通过本地模型处理敏感数据

财务记录、内部文件、用户隐私数据——这些不应该发送给外部 API。

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

配置本地 Ollama 后，将敏感工作负载路由到 `ollama/qwen2.5`。速度比云端慢，但数据完全不离开本地网络。对于受监管的行业，这往往是合规要求，不只是偏好。

---

## 第五章：调试与安全 {#chapter-5}

---

### Tip 26｜先开详细日志，再问问题

出问题时，第一条命令：

```bash
openclaw debug --verbose
```

然后查特定子 Agent：

```bash
/subagents log <runId>
```

详细日志显示每一次工具调用、每一个决策点，以及每一步的完整上下文。90% 的 Agent 行为异常，看日志之后立刻就明白了。

---

### Tip 27｜超时 ≠ 失败，重跑前先确认状态

子 Agent 意外停止时，先检查状态，再决定怎么处理：

```bash
/subagents list
```

看 `status` 列：
- `timeout` → Agent 触碰了 `runTimeoutSeconds`。调大限制后重跑。
- `error` → 真实失败。查 `/subagents log <runId>` 找具体报错。

用同样的配置重跑一个超时的 Agent，会得到同样的结果。先修超时设置。

---

### Tip 28｜用 clawdefender 扫描已安装的 Skill

ClawHavoc 事件之后，这是必做的安全卫生项：

```bash
clawdefender scan --all
```

检测内容：
- Prompt 注入向量
- 命令注入模式
- 凭证窃取尝试
- 异常 OAuth scope 请求

如果某个 Skill 扫描失败，立即卸载，找评分更高的替代品。不要试图「修复」一个恶意 Skill。

---

### Tip 29｜只申请真正用到的权限

每次 OAuth 授权都是一个潜在攻击面。最小权限原则同样适用于 Agent：

| 错误做法 | 正确做法 |
|---------|---------|
| `calendar:*` | `calendar:read` |
| `email:*` | `email:send` |
| `files:readwrite` | `files:read` |
| `contacts:*` | `contacts:read` |

读取日程的 Skill 不需要写入权限。发送邮件的 Skill 不需要删除邮件。授权任何新 Skill 前，检查它的 scope 请求。

---

### Tip 30｜TinyClaw 已经内置了以上所有配置

本文中的所有内容——配置优化、安全加固、成本控制策略——在 TinyClaw 里都已经预配置好了。

如果你更愿意在一分钟内部署一个生产级 OpenClaw 实例，而不是花一下午手动配置：

```
tinyclaw.dev → 选择模型 → 选择频道 → 部署
```

以上 30 条技巧在你跑起来之后仍然适用。它们只是让你有一个更好的起点去优化。

---

## 附录：用 TinyClaw 60 秒部署 {#tinyclaw}

传统 OpenClaw 配置，如果你知道每一步该怎么做，大约需要一个小时：

| 步骤 | 时间 |
|------|------|
| 购买和配置服务器 | 15 分钟 |
| 配置 SSH 密钥 | 10 分钟 |
| 安装 Node.js | 5 分钟 |
| 安装 OpenClaw | 7 分钟 |
| 配置 AI 供应商 | 10 分钟 |
| 连接 Telegram | 4 分钟 |
| **总计** | **约 60 分钟** |

非技术用户每步都要先学再做，实际时间乘以十。

TinyClaw 预配置了所有环节。你只需要做三个选择：

**第一步 — 选择默认模型：**
`Claude Opus 4.6` / `GPT-5.2` / `Gemini 3.1 Pro`

**第二步 — 选择消息频道：**
`Telegram` / `Discord` / `WhatsApp`（三选一）

**第三步 — 用 Google 账号登录 → 部署。**

服务器已预配置，SSH 已处理，OpenClaw 运行环境已就绪，只等分配给你。

**部署完成后，你立刻可以做的事：**

- 读取和摘要邮件、起草回复
- 会议前提醒、跨时区日程同步
- 开支追踪和收据解析
- 竞品研究和线索筛选
- 每日站会摘要、OKR 追踪
- 起草合同、社交帖文、招聘描述
- 价格对比和优惠券查询

以及你用自然语言说出来的任何其他场景。本文 30 条技巧在你跑起来后立即可用——TinyClaw 只是去掉了配置摩擦。

> **注意：** 云服务器数量有限。查看当前可用情况：[tinyclaw.dev](https://tinyclaw.dev)

---

## 速查卡

| 章节 | 技巧范围 | 什么时候读 |
|------|---------|-----------|
| 基础配置 | 01–08 | 动手写任何配置之前 |
| Skill 使用 | 09–14 | 安装任何 Skill 之前 |
| Sub-Agent | 15–20 | 构建多 Agent 工作流之前 |
| 成本控制 | 21–25 | 第一个真实工作负载跑起来之后 |
| 调试与安全 | 26–30 | 出问题时 |

---

## 推荐资源

- **官方文档：** [docs.openclaw.ai](https://docs.openclaw.ai)
- **Skill 市场（质量优先）：** [clawhub.ai](https://clawhub.ai)
- **Skill 市场（数量优先）：** [agentskills.io](https://agentskills.io)
- **一键部署：** [tinyclaw.dev](https://tinyclaw.dev)
- **24/7 云托管：** [agentputer.com](https://agentputer.com)

---

*数据来源：OpenClaw 官方文档（docs.openclaw.ai）· ClawHub 安全数据（2026 年 2 月）· 社区生产环境反馈*

