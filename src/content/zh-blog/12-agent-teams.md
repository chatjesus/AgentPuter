---
title: "一个 Agent 变成一支团队：OpenClaw Sub-Agents 实战指南"
description: "2月，Anthropic 研究员花 $20,000 让 16 个 Claude Agent 并行写了一个 C 编译器。OpenClaw 的 Sub-Agent 系统让你用同样的架构跑晨报——成本只要 $0.03。"
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "10 分钟"
tags: ["OpenClaw", "Sub-Agents", "Agent 团队", "并行 Agent", "sessions_spawn", "Claude Code"]
featured: false
---

# 一个 Agent 变成一支团队：OpenClaw Sub-Agents 实战指南

**2月，Anthropic 的一位研究员花了 $20,000 让 16 个 Claude Agent 并行写了一个 C 编译器。OpenClaw 的 Sub-Agent 系统让你能用同样的架构跑你的晨报——成本只要 $0.03。**

*Agent 基础设施系列 · 第十二篇*

---

这个月，Anthropic 研究员 Nicholas Carlini 发表了一项实验，比起软件工程，它更像是某种生物进化实验。

他让 16 个 Claude Opus 4.6 实例并行工作了两周。它们产生了近 2,000 个编程会话，消耗了 20 亿个输入 token，花了不到 $20,000 的 API 费用。

结果呢？一个 10 万行的 Rust C 编译器，从零写成，能编译 x86、ARM 和 RISC-V 架构的 Linux 6.9 内核。它甚至能运行 Doom。

这不是某个光鲜亮丽的"一键生成 App"按钮的演示。这是用最基础的协调原语——每个 Agent 独立的 Docker 容器、共享 Git 仓库、文件锁——搭建出来的粗糙研究原型。

我们大多数人这周没有 $20,000 可以拿来烧 API。但是，Carlini 使用的架构模式——**将一个巨大的目标拆解为并行任务，分发给独立的 Agent 执行**——正是 OpenClaw **Sub-Agent** 系统的核心逻辑。

你可以用同样的逻辑，把你的晨报生成时间从 40 秒缩短到 20 秒。而且成本只要几分钱。

---

## 先搞清楚：别把这三个概念混了

现在社区里有三个听起来很像的"多 Agent"概念，但它们完全是不同的东西。

| 概念 | 是什么 | 在哪用 |
|------|--------|--------|
| **Claude Code Agent Teams** | Anthropic 的 `claude` CLI 里的实验性功能。队友之间可以通过"Mailbox"直接互发消息。 | **Claude Code**（编程工具，Alpha 阶段） |
| **$20K 编译器实验** | Nicholas Carlini 的研究原型。用 Git 和文件锁协调，没有中央调度器，没有聊天界面。 | **研究论文**（不是产品） |
| **OpenClaw Sub-Agents** | OpenClaw 内置的 `sessions_spawn` 工具。主 Agent 将任务分发给后台工蜂 Agent，工蜂完成后汇报结果。 | **OpenClaw**（通用 Agent 平台） |

**这篇文章讲的是 OpenClaw Sub-Agents。** 它是这三者中唯一一个今天就能用于通用自动化任务的生产级功能。

---

## OpenClaw Sub-Agents 是怎么工作的？

不再是一个 Agent 顺序做完所有事——由一个"主 Agent"生成"子 Agent"在后台并行工作。

```
主 Agent（Main, Depth 0）
    │
    ├── sessions_spawn(task="调研竞品 A")
    │       └── 子 Agent A（Depth 1，独立会话）
    │               └── 工作... 工作... → 汇报结果
    │
    ├── sessions_spawn(task="调研竞品 B")
    │       └── 子 Agent B（Depth 1，独立会话）
    │               └── 工作... 工作... → 汇报结果
    │
    └── 收到所有结果 → 合成最终报告
```

### 关键行为

1.  **完全非阻塞：** `sessions_spawn` 命令立即返回一个 `runId`。主 Agent 不需要等待，可以继续工作或生成更多子 Agent。
2.  **上下文隔离：** 每个子 Agent 都在全新的会话中运行。它们**不继承**主 Agent 的聊天记录。这保持了它们上下文窗口的干净和专注。
3.  **选择性记忆：** 子 Agent 会加载 `AGENTS.md` 和 `TOOLS.md`，但**不会**加载 `SOUL.md`、`IDENTITY.md` 或 `USER.md`。它们是临时的工蜂，不是你的个性化助手。
4.  **并发控制：** 默认情况下，单个 Agent 最多可以生成 5 个活跃子 Agent。全局并发限制为 8，以防 API 速率限制。

### 命令格式

工具是 `sessions_spawn`。注意参数名是 `task`，不是 `instruction`。

```javascript
sessions_spawn({
  task: "搜索 HackerNews 上最新的 AI 头条并返回 Top 5",
  model: "gpt-4o-mini",         // 给工蜂用便宜的模型
  runTimeoutSeconds: 120,       // 安全熔断
  label: "news-fetcher",        // 用于日志追踪
  cleanup: "delete"             // 完成后自动删除会话
})
```

---

## 四种实战架构模式

### 模式一：协调者 + 工人（最常用）

这是调研或批量处理的标准模式。

```
主 Agent（协调者）
  ├── 工人 A：调研 Notion 的定价模式
  ├── 工人 B：调研 Linear 的定价模式
  └── 工人 C：调研 Monday.com 的定价模式
主 Agent 将输入合并为一张定价对比表。
```

**为什么有效：** 如果顺序执行，主 Agent 的上下文窗口会被三个定价页面的原始 HTML 填满。通过并行化，每个工人处理原始数据，只返回结构化的摘要。

**推荐工人模型：** `gpt-4o-mini` 或 `gemini-2.5-flash`（低成本）。

### 模式二：流水线（The Pipeline）

```
子 Agent 1：抓取原始数据（web-search skill）
      ↓
子 Agent 2：清洗和结构化数据（reasoning skill）
      ↓
子 Agent 3：生成洞察（analysis skill）
      ↓
主 Agent：格式化输出
```

**为什么有效：** 它隔离了过程中的"脏活"。负责高价值分析的 Agent 永远不会看到步骤 1 里那些乱七八糟的 HTML 代码。

### 模式三：专家路由（Specialist Routing）

主 Agent 不再是通才，而是充当路由器。

```
主 Agent（路由器）
  ├── "安排个会议"   → Google Calendar 专家 Agent
  ├── "写封邮件"     → 写作专家 Agent
  └── "研究这个话题" → 网络搜索专家 Agent
```

**专家提示：** 因为子 Agent 不加载 `SOUL.md`，你应该把路由逻辑写在 **`AGENTS.md`** 里。

```markdown
## AGENTS.md 路由规则

当路由任务给子 Agent 时：
- 日历请求：使用 google-calendar 和 google-workspace skills 生成
- 研究请求：使用 web-search skill 生成，模型使用 gpt-4o-mini
- 写作请求：生成时显式注入写作风格上下文
```

### 模式四：Fan-Out / Fan-In（晨报场景）

这是并行 Agent 的"Hello World"。

**顺序执行（旧方法）：** 查天气 (5s) → 查日历 (5s) → 查邮件 (10s) → 查新闻 (10s) → 总结 (5s)。总计：**~35 秒。**

**并行执行（新方法）：**
7:00 AM → 主 Agent 瞬间生成 4 个工人：
*   **Agent A：** 查旧金山的 AccuWeather 预报
*   **Agent B：** 读今天的 Google Calendar 会议
*   **Agent C：** 摘要 Gmail 未读邮件（标出紧急项）
*   **Agent D：** 获取 HackerNews + TechCrunch 头条

总时间取决于最慢的那个 Agent (~15s) + 合成时间 (5s) = **~20 秒。**

---

## 关键成本策略："聪明的老板，便宜的实习生"

Sub-Agent 最大的风险是成本倍增。如果你生成 5 个 Agent，它们都用 Claude Opus 4.6，你的 API 账单直接乘 5。

解决方案是显式的模型分配。

**老板（主 Agent）：** 需要高推理能力来拆解任务和合成结果。
*   **模型：** `anthropic/claude-opus-4-6` 或 `claude-sonnet-4-6`

**实习生（工人）：** 通常执行清晰、有边界的任务（总结这个，找那个）。
*   **模型：** `openai/gpt-4o-mini` 或 `google/gemini-2.5-flash`

你可以在配置文件里设置默认值，以防意外：

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

## 进阶：调度者模式（Depth 2）

默认情况下，OpenClaw 设置 `maxSpawnDepth: 1`，意味着子 Agent 不能再生成它自己的子 Agent。

对于复杂项目，你可以开启 Depth 2：

```json
{ "agents": { "defaults": { "subagents": { "maxSpawnDepth": 2 } } } }
```

这启用了一个三层层级结构：

```
主 Agent（CEO）
  └── 调度者 Agent（经理）— 拥有 sessions_spawn 权限
        ├── 工人 A（实习生）— 无法再 spawn
        ├── 工人 B（实习生）
        └── 工人 C（实习生）
```

这反映了 $20K 编译器实验的结构：设定一个高层目标，一个自主实体管理拆解，个体工人执行具体片段。

---

## OpenClaw vs. Claude Code Agent Teams

两者都存在，该用哪个？

| 特性 | OpenClaw Sub-Agents | Claude Code Agent Teams |
| :--- | :--- | :--- |
| **目标受众** | 通用自动化（邮件、研究、运维） | 编程与软件工程 |
| **通信模式** | 轮辐式（工人向主 Agent 汇报） | 网状（队友之间互发消息） |
| **成熟度** | 生产级功能 | Alpha / 实验性 |
| **设置** | 内置，无需配置 | 需要编辑 `settings.json` |
| **上下文** | 每个 Agent 独立 | 每个 Agent 独立 |

如果你在写编译器，用 Claude Code。如果你在构建个人助手或业务工作流，用 OpenClaw。

---

## 实际限制

1.  **单向通信：** 子 Agent 只能向父 Agent "汇报"（announce back）。它们不能在任务中途向父 Agent 提问澄清。
2.  **没有 `SOUL.md`：** 记住，子 Agent 是白板。如果你希望它们有个性或遵守特定行为规则，必须将这些指令包含在 `task` 提示词或 `AGENTS.md` 中。
3.  **并发限制：** 不要试图一次生成 50 个 Agent。你会瞬间撞上 API 速率限制。默认上限是 8 个并发会话。

---

## 不想管这些？用 TinyClaw

管理并行 Agent 架构、配置 `maxSpawnDepth`、监控多个模型的 token 成本……这些都很复杂。

[TinyClaw](https://tinyclaw.dev) 简化了这一切：

*   **成本护栏：** 内置仪表盘，精确显示你的"实习生"们花了多少钱。
*   **智能默认值：** 开箱即用的优化子 Agent 配置。
*   **一键部署：** 60 秒内运行一个配置好的 OpenClaw 实例。

运行一个 Agent 团队不需要花 $20,000。从一个晨报开始吧。

→ [tinyclaw.dev](https://tinyclaw.dev) · 免费开始 · 60 秒建好你的 Agent 团队

---

*数据来源：Anthropic Engineering Blog ("Building a C compiler with a team of parallel Claudes", Feb 2026); OpenClaw Documentation (docs.openclaw.ai/tools/subagents).*

*需要 Agent 团队 24/7 在线？查看 [AgentPuter](https://www.agentputer.com/) 托管云服务。*
