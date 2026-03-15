---
title: "OpenClaw 刚刚修复了其最大的问题。为您揭示 lossless-claw 的真正作用。"
description: "OpenClaw 的默认压缩机制仅触发一次，它会总结所有内容，然后丢弃原始内容。您的智能体运行时间越长，
readingTime: "18 分钟"
tags: ["OpenClaw", "lossless-claw", "上下文引擎", "记忆", "插件", "长期运行代理", "LCM"]
featured: true
---

# OpenClaw 刚刚解决了其最大的问题。本文将为你揭示 lossless-claw 的真正作用。

AgentPuter · 2026年3月 · ~18 分钟 · #OpenClaw #lossless-claw #上下文引擎 #长期运行代理 #插件

> **来源：**
> - [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) — GitHub 仓库
> - [功能：可插拔上下文系统，用于 OpenClaw 的 LCM](https://github.com/openclaw/openclaw/discussions/22251) — 讨论 #22251, @jalehman, 2026年2月20日
> - [OpenClaw 2026.3.7 发布说明](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) — 推特, 2026年3月8日
> - [LCM：无损上下文管理](https://papers.voltropy.com/LCM) — Ehrlich & Blackman

---
想象一下：你的一个 OpenClaw 代理已经为一个研究项目运行了三个小时。它一直在浏览、做笔记、交叉引用来源，逐步构建起对某个复杂事物的认知。然后，它达到了上下文限制。

压缩启动。
它发来的下一条消息，读起来就像它刚失忆醒来一样。它两小时前找到的那个具体文件路径——不见了。你们一起决定采用哪种方法的决策——被总结成一个模糊的单句。那条曾引导你得出有用结论的完整
这不是一个 bug。这是设计如此——而且在 2026 年 3 月 8 日之前，这是任何智能体唯一的选择。

OpenClaw 2026.3.7 改变了这一点。

---

## 上下文压缩的问题（
不是这样的。原因如下。

当 OpenClaw 的默认压缩机制触发时，它会执行**一次性总结**：最旧的消息会被折叠成一个单独的摘要块，该摘要块会被写回到对话记录中，而原始消息则被丢弃。模型
[@jalehman](https://github.com/jalehman)——构建 lossless-claw 的开发者——在 [讨论 #22251](https://github.com/openclaw/openclaw/discussions/22251) 中精确地描述了这种情况
最后那句话很重要。这不是 OpenClaw 特有的缺陷。ChatGPT 会这样。Claude 也会这样。每个智能体框架都会这样。整个领域一直都在一个假设下运作，即有损压缩是唯一的选择。

**实际后果是显著的：**

对于在一小时内结束的单次会话对话，压缩充其量只是个小麻烦。智能体保留了大部分重要内容，你可以继续进行下去。
对于长期运行的智能体——即人们实际部署用于 24/7 全天候运行、处理跨越数天或数周的项目、在数十个任务中协调子智能体的那些智能体——压缩是一个结构性天花板。你的智能体运行时间越长，
经验丰富的 OpenClaw 用户开发出各种变通方法是有原因的：在关键时刻手动运行 `/compact`，调整 SOUL.md 的结构以强制关键事实在压缩后得以保留，将项目拆分成带有交接笔记的独立会话。这些都是为了应对一个根本性的架构限制而采用的应对机制。

---

## 2026.3.7 版本究竟改变了什么（真正的大新闻）
你在 Twitter 上会看到的标题是“lossless-claw——一个能让你的智能体拥有完美记忆的 OpenClaw 插件。” 这没错，但这并非真正的新闻。

真正的新闻是，在 lossless-claw 能够存在之前，OpenClaw 核心所
在 2026.3.7 版本之前，OpenClaw 的上下文管理是**硬编码在核心中**的。如果不分叉整个代码库，就无法将其替换、扩展或尝试其他替代方案。压缩逻辑——何时触发、如何总结、保留什么内容——
@jalehman 提交的 PR —— [#22201](https://github.com/openclaw/openclaw/pull/22201) —— 不仅仅是添加了对 lossless-claw 的支持。它**将上下文管理提取成了一个可插拔的接口**。摘自 3.7 版本的发布说明：

> *“添加了带有完整生命周期钩子（bootstrap、ingest、assemble
这在实践中意味着：OpenClaw 现在有了一个用于上下文管理的明确接口。任何实现该接口的插件都可以完全替换内置引擎。默认行为得以保留 —— 如果您不进行任何配置，`LegacyContextEngine` 仍是后备选项 —— 但现在可能性的大门已经敞开。

接口如下：

```typescript
// OpenClaw 2026.3.7 — 上下文引擎插件接口
interface ContextEngine {
bootstrap(ctx):           Promise<void>           // 初始化数据库、索引
  ingest(msg):              Promise<void>           // 在每条消息到达时进行归档
  assemble(opts):           Promise<AgentMessage[]> // 在每一轮构建模型上下文
  compact(ctx):             Promise<void>           // 处理压缩触发器
  afterTurn(ctx):           Promise<void>           // 回合后处理
  prepareSubagentSpawn():   ...                     // 将上下文传递给生成的子代理
  onSubagentEnded():        ...                     // 子代理完成后进行协调
}
```

这是一个完整的生命周期。每个涉及上下文的时刻——摄取、组装、压缩、子代理交接——现在都成了一个插件可以拦截和替换的钩子。

要使用替代的上下文引擎，配置只需一行：

```json
{
  "plugins": {
    "slots": {
"contextEngine": "lossless-claw"
    }
  }
}
```

如果不添加此行，一切照旧，与之前的版本在行为上没有任何差异。迁移路径是完全可选的。

---

## lossless-claw 的工作原理
lossless-claw 是此接口的第一个实现。它基于 Ehrlich 和 Blackman 的 [LCM (Lossless Context Management) 论文](https://papers.voltropy.com/LCM) 构建——这两位研究人员后来直接为该插件背书。论文的合著者之一 [@belisarius222](https://github.com/belisarius222) 在 GitHub 的讨论中写道：

> *“Josh 对它做了如此多的改进，我认为它真的应该被称为 LCM 2.0。”*

其核心前提是对整个问题的重构。
标准压缩是等待溢出发生后才做出反应。等到它触发时，你已经失去了妥善保留上下文的能力——你是在对数小时累积起来的一堆消息进行紧急分类处理。其结果必然是有损的。
lossless-claw 不会等待。它在后台**持续且异步地**工作，在每次交流后、任何溢出危机发生前，就做出增量摘要决策。它创建的摘要不是扁平的文本。它们是图中的结构化节点，并链接回其
进入 lossless-claw 会话的每一条消息都会被立即持久化到一个 **SQLite 数据库**中。不是摘要——而是完整存储。这是事实的唯一来源。它永远不会被删除。

随着对话的增长，lossless-claw 会为较早的消息组创建**摘要节点**。这些摘要与原始消息连接，形成一个 **DAG（有向无环图）**：

原始消息（在 SQLite 中完整存储，永不删除）
      ↓
  一级摘要（覆盖 8-16 条消息）
      ↓
2级摘要（涵盖多个1级摘要）
      ↓
  3级摘要（捕获主要项目阶段）
```

摘要在树状结构中越往上层，就越抽象——底层摘要详细且按时间顺序，顶层摘要宽泛且按主题。
+
[摘要节点，按从旧到新的顺序填充剩余的 token 预算]
           +
[代理通过 lcm_expand 明确请求的任何细节]
```

模型会看到完整的近期消息，而较早的内容则以摘要层级结构的形式呈现。以下是模型上下文中摘要节点的实际样貌：

```xml
<summary id="sum_abc123" kind="condensed" depth="1"
         descendant_count="8"
         earliest_at="2026-02-17T07:37:00"
         latest_at="2026-02-17T15:43:00">
<parents>
    <summary_ref id="sum_def456" />
  </parents>
  <content>
    在此会话期间，代理调查了 API 层的三种定价策略。
    结论是，基于用量的方式因 [reasons] 而更可取。
    写入的关键文件：/workspace/pricing-analysis.md。
    商定的下一步：使用财务团队的数据
### 三种检索工具

当摘要不足以满足需求时——当智能体需要确切的文件路径、决策的精确措辞，或来自特定研究会话的实际数据时——它有三种工具可以回溯历史：

| 工具 | 功能 |
|------|-------------|
| `lcm_grep` | 对所有存储的消息进行全文搜索 |
| `lcm_describe` | 获取特定历史时期的摘要 |
| `lcm_expand` | 将摘要扩展回其源消息 |
`lcm_expand` 是关键的一个。它不会将整个扩展内容加载到主上下文中——这会违背其初衷——而是使用一个**子代理**来读取扩展后的内容，并仅返回所要求的特定细节。源材料在被访问时不会撑爆
这就是 @jalehman 在他的提案中提到的书本类比的意思：*“这就像能够翻回到书中的任何一页。”* 当你放下书时，它并不会被销毁。它就在书架上。你可以查阅任何内容。

---

## 它真的
> *“想象一下再也不需要运行 /compact 或 /new 了。[...] 对其结果印象深刻至极：一段感觉上永不丢失信息的对话（因为在某种程度上它确实如此），始终在 3-10 万 token 的范围内运行，且无需任何维护。”*
为了更量化地说明：社区开发者 [@chrysb](https://x.com/chrysb/status/2030526852146549140) 在发布当天于 Twitter 上报告了早期的基准测试结果。使用 **OOLONG 基准测试**——一个专门设计用于评估长上下文保留和任务连续性的测试套件——并以 Opus 4.6 作为两者的模型：

| 系统 | OOLONG 分数 | 备注 |
|--------|-------------|-------|
| lossless-claw + OpenClaw | **74.8** | 差距随上下文长度的增加而扩大 |
| Claude Code (默认) | 70.3 | 标准滑动窗口 |
| OpenClaw 默认 | ~68 (估计) | 一次性压缩 |

这些是社区报告的数字，而非官方基准测试，并且随着更多人进行测试，这些数字还会变化。但这个方向性的发现在结构上是成立的：**上下文越长，lossless-claw 的优势就越会复合增长**，因为它正是有损压缩造成最大损害的场景。
LCM 论文的合著者 @belisarius222 指出，@jalehman 在原论文实现的基础上做出了一项具体改进：**为摘要任务设置输入长度上限**。在原始的 LCM 中，总结过长的内容本身就可能导致上下文溢出、引发不可预测的行为并引入边缘情况。而这种限制长度的方法使每个摘要步骤都变得可预测，这也使得系统在调用 `lcm_expand` 子代理时更加可靠。

---
## 安装和配置 lossless-claw

**先决条件：OpenClaw 2026.3.7 或更高版本。** 上下文引擎插件槽在早期版本中不存在。
> **请注意：** 最初发布的 2026.3.7 版本有一个已知的 P1 注册表 bug ([问题 #40096](https://github.com/openclaw/openclaw/issues/40096))，该 bug
openclaw --version
# 应显示：openclaw 2026.3.7 或更高版本（带有注册表修复）

# 安装插件
openclaw plugins install lossless-claw

# 重启网关
openclaw restart
```

在大多数情况下，`openclaw plugins install` 会自动配置 contextEngine 插槽。要验证它是否已激活：

```bash
openclaw config show | grep contextEngine
# 预期输出：contextEngine: "lossless-claw"
```

如果需要手动设置，请将以下内容添加到您的配置中：

```json5
{
  plugins: {
    slots: {
contextEngine: "lossless-claw"
    }
  }
}
```

### 谁应该启用它

lossless-claw 并非适用于所有 OpenClaw 设置。它会增加开销——包括存储（SQLite 数据库会随着你的对话历史而增长）和令牌使用（摘要过程本身会消耗令牌）。

**在以下情况下启用 lossless-claw：**
- 你的代理 24/7 运行并处理持续进行的项目
- 你正在进行需要保持连续性的多会话研究
- 你正在运行子代理系统，其中上下文交接至关重要
- 你曾因压缩丢失重要信息而不得不重新开始

**在以下情况下，请坚持使用默认引擎：**
- 你主要使用 OpenClaw 执行在一小时内完成的单会话任务
- 你
lossless-claw 使用 LLM 生成摘要。这会消耗 tokens。对于大多数长期运行的工作流，避免会话重置所节省的成本远超摘要生成的开销 —— 但如果你对成本敏感，有一种巧妙的配置方法：

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-opus-4-6",
    }
  },
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  }
}
```
lossless-claw 文档建议为后台摘要工作使用一个快速、廉价的模型——例如 `anthropic/claude-haiku-4-5` 或 `MiniMax-M2.5-highspeed`——同时保持你的主要推理模型不变。请查看 [lossless
@jalehman 的实现也旨在通过自适应的摘要节奏，将活动上下文保持在 **30-100k 令牌范围内** —— 这样即使对话历史无限增长，令牌使用量也能保持可预测。

---

## 这在 lossless-claw 之外解锁了什么

lossless-claw 插件本身就很有价值。但更大的转变是上下文引擎 API 为社区未来带来的可能性。
在 3.7 版本之前，所有在 OpenClaw 中改进上下文管理的尝试都遇到了同样的障碍：它是硬编码的。你可以编写技能来尝试在外部管理状态。你可以构造你的 SOUL.md 来保存关键事实。你可以在战略性时刻手动运行 `/compact`。这些方法都无法触及核心机制。

现在，这个接口是开放的。

社区中已经在讨论的一些方向：
**作为存储后端的向量搜索。** SQLite 全文搜索适用于关键词查询。向量嵌入后端将支持语义搜索——即使不包含完全相同的词语，也能找到概念上相关的历史内容。@belisarius222 最初的 Volt 实现就采用了这种方法。
**RAG集成的上下文引擎。** 一种不仅利用对话历史，还利用外部知识库的引擎——您的Notion工作区、您的代码库、您的文档库——并根据当前任务的需求在每一轮中动态组装。

**跨智能体的共享内存池。**
**将 Obsidian / Notion 作为内存后端。** 不再使用本地 SQLite 数据库，而是将所有内容持久化到一个结构化的外部工作区，你可以在其中自行浏览和编辑。这样，你的智能体内存就可以从外部进行审计和搜索。

这些并非凭空推测。它们
从基础设施的角度来看，成熟的平台就是这样演进的。OpenClaw 发布了浏览器自动化功能，然后开放了浏览器工具的定制化。它发布了技能，然后建立了 ClawHub 来分发它们。它发布了上下文管理功能，然后开放了上下文引擎。
上下文管理是代理系统中最根本的层。它决定了代理知道什么、如何进行长期推理，以及在长时间运行的任务中实际能完成什么。将其开放并非一个小功能，而是一个关于由谁来控制代理记忆的架构性决策。

---

## 3.7 版本还有哪些其他变化

lossless-claw 获得了最多的关注，但 3.7 版本中还有另外两个功能值得注意：
**Telegram 中的分主题代理路由。** 论坛群组现在可以将不同主题路由到不同的代理。一个 Telegram 群组，多个专业化代理 — 每个代理处理一个不同的主题帖，并拥有独立的会话。这是数月来多代理团队配置一直要求的功能。

**iOS App Store Connect 准备工作。** 应用包标识符、Fastlane 自动化、屏幕截图元数据 — 所有提交到 App Store 所需的基础架构现已加入代码库中。移动版 OpenClaw 即将到来。

---
## 重点

OpenClaw 从第一天起就有一个隐形的天花板：你的智能体运行时间越长，它忘记的东西就越多。每个严肃的使用场景最终都会碰到它。几个月来，社区一直在通过 SOUL.md 技巧、手动控制压缩时机和谨慎的会话管理来绕过这个问题。

3.7 版本不仅仅是治标。它将这个问题开放给了整个社区。
lossless-claw 是首个解决方案——一个基于 DAG (有向无环图) 的摘要系统，它存储所有内容，进行增量式摘要，并允许智能体按需检索确切的历史细节。早期的社区基准测试数据显示，在所有测试的上下文长度上，它的性能都优于 Claude Code 的默认引擎，并且随着对话变长，差距也越来越大。

如果你的智能体曾经忘记过本不该忘记的事情，那么这个版本就是为你准备的。

```bash
openclaw update
```
openclaw plugins install lossless-claw
```

这就是整个迁移过程。

---

*你的智能体在多久后会遇到上下文压缩？压缩时会丢失什么信息？请在评论区告诉我们——我们正在追踪不同类型的工作流如何经历上下文退化，并且我们希望
*来源：[Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) · [OpenClaw 讨论 #22251](https://github.com/openclaw/openclaw/discussions/22251) · [OpenClaw 2026.3.7 发布说明](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) · [LCM 论文，Ehrlich & Blackman](https://papers.voltropy.com/LCM)*