Part 1/55.
---
title: "如何以每月不到30美元的成本运行 OpenClaw（完整成本指南）"
description: "一位用户在两周内花费了254美元。Federico Viticci 在一个月内花费高达3600美元。有人一觉醒来，发现因夜间心跳连接产生了141美元的意外账单。本文将揭示 OpenClaw 消耗 token 的六个环节，3.7 和 3.8 版本带来了哪些变化，以及真实用户如何在不牺牲任何重要功能的情况下，将账单从数百美元削减至30美元以下。"
date: "2026-03-09"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "成本优化", "模型路由", "Ollama", "预算", "心跳", "lossless-claw"]
featured: true
---

# 如何以每月低于30美元的成本运行 OpenClaw (完整成本指南)

AgentPuter · 2026年3月 · 约20分钟 · #OpenClaw #成本优化 #模型路由 #Ollama #预算

> **来源：**
> - [如何停止在 OpenClaw 上烧钱](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) — r/PromptEngineering
> - [当下最实惠的 LLM (2026 年 2 月)](https://github.com/openclaw/openclaw/discussions/12267) — GitHub 讨论 #12267
> - [MemOS 插件如何将 OpenClaw 的 Token 成本降低 70%](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) — Medium, 2026 年 3 月 4 日
> - [ibl.ai OpenClaw 路由器](https://github.com/iblai/iblai-openclaw-router) — GitHub
> - [降低您的 OpenClaw LLM 成本：SaladCloud 指南](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — SaladCloud 博客，2026年2月9日
> - [为什么 OpenClaw 如此消耗 token？6个原因分析](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) — Apiyi 博客，2026年2月
> - [我如何以每月6美元的成本运行19个 OpenClaw 代理](https://www.youtube.com/watch?v=-MtzLiQ9w1c) — YouTube，2026年3月1日
> - [OpenClaw 2026.3.7 发布说明](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [OpenClaw 2026.3.
*“为什么我的智能体成本这么高？”*

一位用户在两周内花费了 254 美元。另一位在一个月内达到了 800 美元。科技博主 Federico Viticci 在运行密集的​​多渠道自动化时，创下了 [每月 3600 美元](https://medium.com/@reza.ra/openclaw-the-ai-agent-that-burns-through-your-api-budget-and-how-to-fix-it-050fc57552c9) 的账单。有人一觉醒来，惊讶地发现账单多了 141 美元，因为他们的心跳程序整夜都在运行 Opus。
这些不是在挑战极限的高级用户。这些只是普通的配置和正常的使用。

OpenClaw 是免费的，但它调用的模型却不是。而且，由于 OpenClaw 被设计为 24/7 全天候运行——执行检查、浏览、思考、发送
这篇文章就是 OpenClaw 本应附带的指南。我们将详细讲解资金的具体去向，最新版本（3.7 和 3.8）为此提供了哪些帮助，以及真实用户是如何在不牺牲任何重要功能的前提下，将每月账单从数百美元降至
OpenClaw 每次进行 API 调用时，都会将你的 `SOUL.md`、`AGENTS.md` 和其他引导文件加载到提示中。这些文件不是只加载一次——它们会随**每次请求**一起发送。如果你的 SOUL.md 文件为 8
r/LocalLLaMA 上的一位用户通过移除每次加载但几乎从不引用的、已有三个月历史的项目背景信息，[将他们的引导程序从 85KB 削减到了 27KB](https://www.reddit.com/r/LocalLLaMA/comments/1r3ro5h/)——减少了 69.8%。

### 2. 对话历史（只增不减）
你的会话历史随着每一次交流而增长。经过几个小时的活跃使用，你的历史记录中会携带数万个 token。所有这些历史记录都会附加在每个新请求上。对于重度用户来说，这是最大的成本驱动因素——也是 [lossless-claw](/blog/lossless-claw) 之所以重要的原因（下文会详细介绍）。

### 3. 心跳（无声的杀手）
OpenClaw 的心跳默认每 30 分钟运行一次。每次检查都是一次完整的 API 调用，其中包含了你所有的系统上下文。在 Opus 上，这是一笔不小的开销——每天 48 次心跳，每次都携带完整的系统提示。

一位用户报告说，仅心跳一项，一天就花掉了 50 美元。另一位用户则[一夜之间消耗了 570 万个 token](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/)——其中大部分来自于心跳和他们忘记了还在运行的定时任务。
### 4. 子代理派生

当你的主代理向子代理委派任务时，每个子代理都会启动，并拥有其自身的上下文、内存和模型调用。运行多代理设置（一个用于写作，一个用于研究，一个用于编码）的用户，需要为每个代理
浏览器抓取、文件读取、搜索结果——这些工具的输出会被存储在对话记录中，并随后续消息重新发送。单次网页抓取就可能向你的历史记录中塞入数千个 token，并在会话的剩余时间里一直存在。

### 6. 模型选择

如果没有路由功能，每一个请求——包括那些只是检查“有新内容吗？”的心跳请求——都会发送给你的主模型。如果主模型是每百万 token 5/25 美元的 Opus，那么你就在为那些本可由 1/5 美元的 Haiku 处理的工作支付高昂的费用。
## 如果你还没开始：免费入门方式

在我们讨论优化之前，给那些尚未设置 OpenClaw 的人一些提示。

你不需要花一分钱就可以尝试它。**Gemini 2.5 Flash-Lite** 有一个[免费套餐](https://ai.google.dev/gemini-api/docs/pricing)，提供了慷慨
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // 免费套餐
    }
  }
}
```

连接一个渠道（仅限 Telegram 或 WebChat），保持 SOUL.md 简短，你就能以零成本拥有一个可用的个人代理。并以此为基础进行扩展。

---

## 3.7 和 3.8 版本带来了哪些变化（与成本相关的功能）

最近的两个版本包含了一些直接影响成本的功能。以下是重点内容：

### 来自 3.7 版本（3月8日）
**上下文引擎插件 API + lossless-claw。** [lossless-claw 插件](/blog/lossless-claw) 无论对话持续多久，都能将您的活跃上下文保持在 30–100K token 的范围内。如果没有它，会话要么会溢出（强制进行压缩，从而导致信息丢失），要么您需要手动重置（丢失所有内容）。无论哪种方式，您最终都得重复工作——这意味着消耗更多 token。lossless-claw 的作者报告称，在长达一周的会话中实现了零维护的上下文管理。
**MiniMax-M2.5-highspeed 作为一级模型。** 不再是临时方案 —— 它已正式集成到模型目录、新用户引导和路由中。这是一个速度快、成本低廉的模型，可以处理 80% 的常规代理工作。

**Ollama
**`openclaw backup create` 和 `openclaw backup verify`。** 这不直接是一个与成本相关的功能，但如果你曾丢失配置并不得不重建——那将浪费时间和 token 来与你的智能体重新建立上下文。

**Brave 网页搜索 LLM 上下文模式。** `tools.web.search.brave.mode: "llm-context"` 返回提取的基础信息片段，而不是原始页面内容。结构化的搜索结果意味着需要更少的后续 token 来进行解析和重新查询。
**对话模式静音超时。** `talk.silenceTimeoutMs` 可让您控制语音输入的自动发送时机。这可以防止因半句话就过早发送而浪费一次 API 往返调用。

**GPT-5.4 上下文窗口修复。** `openai-codex/gpt-5.4` 的 1,050,000-token 上下文窗口和 128K 最大输出 token 现已正确应用。如果您订阅了 Codex，这意味着上下文溢出压缩的次数会减少。

---

## 策略 1：检查您的账单（5 分钟，零成本）
每位成功省钱的用户都表示：诀窍并非某种特定的技巧，而在于看清了钱的去向。
立即登录你的 API 提供商仪表板。查看每日支出，找到费用峰值。[r/openclaw 的一位用户在 30 天内追踪了其四个代理的每一美元开销](https://www.reddit.com/r/LocalLLM/comments/1rl
在 OpenClaw 内部，使用 `/status` 查看当前会话的模型和令牌计数。使用 `/usage full` 获取每次响应的成本明细。无法衡量的东西就无法优化。

---

## 策略 2：修复你的心跳（一项配置更改，每月节省 30-50 美元）

心跳是意外
defaults: {
      heartbeat: {
        intervalMinutes: 120
      }
    }
  }
}
```

这将使你每天的调用次数从 48 次减少到 12 次——心跳成本降低了 75%，而对响应性的影响微乎其微。

**将心跳路由到便宜的模型。**如果你正在使用路由代理（见策略 5），心跳会被自动分类为“轻量”并发送给 Haiku。如果通过 Ollama 使用本地模型，心跳成本为 0 美元。

---

## 策略 3：精简你的 SOUL.md（删除文本，节省 70%）
系统提示中的每个 token 在每次调用时都会计费。这是大多数人会忽略的乘数成本。

一个来自社区的真实案例：

| 指标 | 之前 | 之后 |
|--------|--------|-------|
| SOUL.md 大小 | 85 KB (21,400 个 token) | 27 KB (6,472 个 token) |
| 降幅 | — | 69.8% |
| 每月影响（24/7 运行的智能体） | 仅引导开销就约 45 美元 | 约 14 美元 |
打开你的 SOUL.md。阅读每一行。问问自己：“智能体在每次调用时真的需要这个吗？”三个月前的项目特定上下文？将它移到一个技能中。历史笔记？将它们移到一个参考文件中。你的系统提示应该精简且永不过时。

另外：在切换不相关的任务时使用 `/new`。不要把关于项目 A 的 50,000-token
这是文章的源数据反复强调的最容易实现的优化。

Anthropic 支持针对 Claude 模型的自动提示词缓存。因为 OpenClaw 在每次调用时都发送相同的系统提示（SOUL.md + AGENTS.md），所以它非常适合进行缓存。第一次调用支付全价；在缓存窗口期内的后续调用，其系统提示的 token 可享受 90% 的折扣。
一位[在 30 天内跟踪成本](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/)的用户报告称：“启用提示词缓存将支持方面的
对于 Anthropic 模型，近期的 OpenClaw 版本已默认启用提示词缓存。对于其他提供商，请检查您的模型是否支持此功能 —— Google 的 Gemini 模型也提供[上下文缓存](https://ai.google.dev/gemini-api/docs/pricing)，并提供大幅折扣。

---

## 策略 5：按任务路由模型 (节省 70–90%)

这是影响最大的结构性变更。其理念是：并非每个请求都值得使用您最昂贵的模型。
像“我收件箱里有新消息吗？”这样的心跳检查，并不需要 Opus。像“这是否紧急？”这样的消息分类，也不需要 Sonnet。这些都是 Haiku 级别的任务。

这是来自社区的一个真实成本比较：

| 配置 | 每月成本
| 路由 | 35美元 | 同一用户，相同任务 |

**如何操作 — 选项A：手动配置**

将你的默认模型设置为一个便宜的模型，并仅在明确需要时使用 Opus：

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-haiku-4-5",  // 所有操作的默认模型
      subagents: {
        model: "anthropic/claude-haiku-4-5", // 子代理也一样
      }
    }
  }
}
```

然后在需要推理时切换到更强的模型：

```
/model claude-opus-4-6
```
完成复杂任务后，切换回来：

```
/model claude-haiku-4-5
```

**如何操作 — 选项 B：自动路由代理**

现在有几个开源路由器可以对每个请求进行分类并自动路由：

- [**ibl.ai OpenClaw Router**](https://github.com/iblai/iblai-openclaw-router) — 零依赖的 Node.js 代理，在 <1ms 内根据 14 个维度对请求进行评分，并路由到轻量级 (Haiku) / 中量级 (Sonnet) / 重量级 (Opus)。在本地运行，不向第三方发送数据。
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) — 15维本地评分，社区报告称与始终使用Opus相比可节省约90%的成本。

两者都位于 OpenClaw 和 API 端点之间。安装后，将你的配置指向本地代理，路由就会自动进行。

**操作方法 — 选项C：使用模型回退系统**

OpenClaw 原生支持回退链：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: [
"anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

这不是按复杂性进行路由——它是针对速率限制和服务中断的安全网。但结合按渠道或按智能体分配模型，你可以将不同的工作负载路由到不同的价格层级。

---

## 策略 6：一个智能体，多种技能（一个没人提及的最大省钱秘诀）
这直接来自 [r/PromptEngineering 成本指南](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/)：

> *“一位用户从每周在多智能体设置上花费数百美元，转变为每月用单个智能体和十几个技能花费 90 美元。质量反而提升了，因为上下文不再在传递过程中丢失。”*
每个代理实例都有其开销：自己的系统提示词、自己的记忆、自己的上下文窗口。运行五个代理意味着每次调用都要支付五倍的启动成本。

OpenClaw 技能是一些 Markdown 文件，它们能赋予你的代理新功能，而无需生成新的实例。相同的大
├── coding/SKILL.md
└── calendar/SKILL.md
```

智能体根据你的要求选择合适的技能。无需交接。无上下文丢失。无重复的引导令牌。

**何时使用多智能体：** 当你确实需要并行执行时——即多个任务同时运行，而非顺序执行。对于其他所有情况，技能都更便宜、更好。

---

## 策略 7：为日常工作运行本地模型（零边际成本）
在您自己的硬件上运行模型意味着，在完成初始设置后，每次推理都是免费的。

**适用于 OpenClaw 的配置：**

| 模型 | 硬件 | 速度 | 擅长 |
|-------|----------|-------|----------|
| Qwen 3 32B | RTX 4090 | 40+ tok/s | 通用智能体工作 |
| Qwen 3 14B | RTX 3060 / Mac Mini M2 | 25+ tok/s | 心跳、分类 |
| Llama 3.3 70B | 2x RTX 4090 | 20+ tok/s | 代码、复杂推理 |

**使用 Ollama 进行设置：**

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 拉取你的模型
ollama pull qwen3:32b

# OpenClaw 配置
{
  "models": {
    "providers": {
      "ollama": {
**混合方法**（大多数注重成本用户的做法）：默认使用本地模型处理常规任务，仅当代理需要深度推理时才使用云 API（Sonnet 或 Opus）。一位 YouTube 创作者记录道，他使用 MiniMax M2.5 进行一般性工作，仅将复杂
**使用向量记忆库代替原始上下文。** OpenClaw 的记忆库搜索通过嵌入搜索来提取相关记忆，而不是将所有内容都加载到提示中。使用 Ollama 嵌入 (3.7+)，这种方式更智能且免费：

```json5
{
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  }
}
```
**安装 lossless-claw。** 正如我们在[之前的文章](/blog/lossless-claw)中所述，lossless-claw 插件通过增量摘要将活动上下文保持在 30K–100K 令牌之间。你永远不会达到强制紧急压缩的上限，也永远不会丢失迫使你重做工作的信息。

---

## 2026 年模型价格指南

模型定价变化很快。截至 2026 年 3 月，情况如下：

| 模型 | 输入（每百万令牌） | 输出（每百万令牌） | 最适用于 | 来源 |
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | $0.07 | $0.40 | 预算级提取，简单查询 | Z.AI |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | 轻量级任务，1M 上下文窗口 | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| **MiniMax M2.5 Standard** | $0.15 | $1.20 | 通用智能体工作，197K 上下文 | [MiniMax](https://www.minimax.io/news/minimax-m25) |
| **Claude Haiku 4.5** | $1.00 | $5.00 | 心跳、分类、格式化 | Anthropic |
| **Claude Sonnet 4.6** | $3.00 | $15.00 | 结构化任务、代码审查 | Anthropic |
| **Claude Opus 4.6** | $5.00 | $25.00 | 复杂推理、架构 | [Anthropic](https://www.anthropic.com/claude/opus) |
| **Ollama (本地)** | $0 | $0 | 心跳、嵌入、常规任务 | 自托管 |
计算很简单：如果你智能体 80% 的调用是常规性的，并且你将它们路由到 Haiku（$1/$5）而不是 Opus（$5/$25），那么你在这些调用上的账单就减少了 80%。再加上提示词缓存、一个精简的
// Sonnet 用于您的主交互 — 足够强大以胜任实际工作
      model: "anthropic/claude-sonnet-4-6",

      // 子代理默认使用 Haiku
      subagents: {
        model: "anthropic/claude-haiku-4-5",
        runTimeoutSeconds: 120
      },

      // 心跳：本地模型，更长的间隔
      heartbeat: {
        intervalMinutes: 120,
        // 如果没有本地模型，则路由到 Haiku
      }
    }
  },

  // 本地 Ollama 用于嵌入（免费的记忆搜索）
  memory: {
provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // lossless-claw 用于防止上下文爆炸
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // Brave 搜索，使用 LLM
| 组件 | 每日令牌数 | 模型 | 每月成本 |
|-----------|-----------|-------|------------|
| 主要交互（约 2 小时活跃） | 约 80K（50K 输入 + 30K 输出） | Sonnet | 约 18 美元 |
| 子代理调用 | 约 30K | Haiku | 约 1.50 美元 |
| 心跳（12次/天） | 约 30K | 本地/Haiku | 0–1 美元 |
| 记忆嵌入 | — | 本地 (Ollama) | 0 美元 |
| 网络搜索后续 | 约 20K | Sonnet | 约 2 美元 |
| 提示词缓存节省 | — | — | –4 美元 |
| **总计** | | | **约 19–22 美元** |
*计算：主要交互 = 50K 输入 × $3/M × 30 = $4.50，加上 30K 输出 × $15/M × 30 = $13.50 = $18/月。提示词缓存将
**1. 检查你的账单。** 登录到你的 API 提供商仪表板。查看每日支出。找出支出高峰。

**2. 延长你的心跳间隔。** 将 `heartbeat.intervalMinutes: 120` 添加到你的配置中。即刻节省开支。

**3. 检查你的 SOUL.md 文件大小。**

```bash
wc -c ~/.openclaw/workspace/SOUL.md
```

如果它超过 30KB，请精简它。将特定于项目的内容移至技能中。
**4. 设置子代理模型。** 将 `agents.defaults.subagents.model` 添加到你的配置中。不要让子代理继承你昂贵的主模型。

**5. 安装 lossless-claw。** `openclaw plugins install lossless-claw`。防止上下文膨胀 → 压缩 → 重复工作的循环，这个循环会悄悄地使你的 token 支出翻倍。

---

## 即将推出

OpenClaw 生态系统正在从多个方向解决成本问题：
- **MemOS Cloud Plugin** 报告称，在 LOCOMO 长对话基准测试中，通过将内存卸载到专用系统，实现了 [72% 的 token 减少](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef)。
- **QMD**（由 Shopify 联合创始人 Tobi Lütke 开发）通过本地语义搜索节省了 60-97% 的 token。
- **自动路由代理**（例如 ibl.ai Router 和 ClawRouter）正在让手动模型选择变得过时。
- 3.7 版本中开放的 **Context Engine API** 意味着社区可以构建全新的方法来提高上下文效率。

趋势很明显：代理运行时正在每一层都实现成本感知。上下文管理、记忆搜索、模型路由和工具输出处理都在同时进行优化。对于任何愿意花 30 分钟进行配置的人来说，每月 200 美元的 OpenClaw 账单问题正在得到解决。

---
*正在低预算运行 OpenClaw 吗？请在评论区分享您的月度成本和配置。我们正在为社区成本基准收集数据——目标是为每个级别的智能体能力找到最低的可能成本。*

*接下来：[OpenClaw vs Nanobot](/blog/openclaw-vs-nanobot)——在何种情况下，一个来自香港大学的 4000 行代码的极简智能体或许才是正确的选择。*

---
*来源：[r/PromptEngineering 成本指南](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [GitHub 讨论 #12267](https://github.com/openclaw/openclaw/discussions/12267) · [MemOS 插件分析](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [ibl.ai 路由器](https://github.com/iblai/iblai-openclaw-router) · [SaladCloud 成本指南](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [Apiyi 令牌分析](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*