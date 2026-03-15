---
title: "Perplexity 刚刚打造的功能，OpenClaw 用户早已在自行运行"
description: "2月25日，Perplexity 推出了 Computer——一款云端 AI，它能协同调度 19 种模型，并行运行子代理，并以每月 200 美元的价格自主执行任务。本文将分析 OpenClaw 用户已有的功能、尚不具备的功能，以及这对智能体平台竞赛意味着什么。"
date: "2026-02-28"
author: "AgentPuter Lab"
readingTime: "14 min"
tags: ["OpenClaw", "Perplexity", "AI Agent", "Multi-Agent", "Agent Platform"]
featured: true
---

2月25日，Perplexity 推出了 "Computer"——一个云端 AI 系统，它能协同调度 19 个模型，并行运行子代理，维护一个持久化的文件系统和浏览器，并能长时间自主执行任务。Perplexity Max 订阅用户可使用，价格为每月200美元，包含 10,000 积分。
Ars Technica 对该产品的总结：“然后是 OpenClaw，你可以将其视为这一概念的直接前身。”

本文将探讨 Perplexity Computer 究竟是什么，它与 OpenClaw 的共通之处和不同之处，以及每月 200 美元到底能买到什么。

---

## 目录

1. [Perplexity Computer 究竟是什么](#what-it-is)
2. [核心理念相同](#same-idea)
3. [不同之处](#diverge)
4. [Perplexity 做不到什么](#cant-do)
5. [Perplexity 在哪些方面做得更好](#does-better)
6. [各自的真正目标用户是谁](#who-for)
7. [这对智能体平台竞赛意味着什么](#platform-race)

---

## 1. Perplexity Computer 究竟是什么 {#what-it-is}
设想是：用简单的语言描述一个结果，计算机则会找出如何实现。“为我的餐厅策划并执行一个数字营销活动。”“给我开发一个能帮我追踪阅读进度的安卓应用。”你不是在编写提示或挑选工具——你只是在描述你最终想要得到的结果。
在该界面背后，计算机会将请求分解为结构化的子任务，将每个子任务分配给其 19 个可用模型中最适合该特定步骤的模型，并运行它们——有些并行，有些串行——直到工作完成。

**模型堆栈：**

| 模型
| Veo 3.1 | 视频生成 |
| Grok | 轻量级、速度敏感的任务 |

总共有 19 个模型 — 上表显示了主要的已命名模型。Opus 是编排层；它决定由哪个模型处理哪个子任务。您
**环境：**每个任务都在一个隔离的云端计算环境中运行，可以访问真实的文件系统、真实的浏览器以及预构建的工具集成。您的本地计算机上不会运行任何东西。这些集成由 Perplexity 精心挑选——没有第三方插件，也没有自定义 MCP 服务器。
**定价：** Perplexity Max 每月200美元，包含10,000个积分。计算机在运行时会消耗积分——使用量并非无限。您可以为每个子代理设置支出上限，从而在美元层面对单个任务的允许花费进行实际控制。
**关于营销语言的一点提醒：** Perplexity 表示其计算机“能够运行数小时甚至数月”。该产品于2月25日发布。尚无人通过实际工作流程验证其可运行数月的说法。在有用户报告证实之前，姑且将其视为一种期望。
> *“AI 智能体能力非凡 —— 但它们没有家，没有持久的工作空间，没有属于自己的电脑。”*

Perplexity Computer 正是这一理念的商业化实现。
这并非 Perplexity 读了那篇文章后才去开发产品。Perplexity 在一月份就开始了内部实验——在博客 #01 发表之前。这是多个团队不约而同地得出了相同的结论。这本身就是一个信号：问题是如此真实和明显，以至于不同的组织
| 持久化工作区 | 每个任务的云文件系统 | `~/.openclaw/data/` |
| 多模型路由 | 19个模型，由Opus编排 | `model.fallbacks` + `modelByChannel` |
| 子代理协调 | 任务分解 → 代理委派 | `sessions_spawn` 扇出 |
| 长期自主运行 | 声称：数小时至数月 | Cron + `runTimeoutSeconds` |
| 真实浏览器 | 内置 | `browser_snapshot`, `browser_navigate` |
| 代理上下文文件 | 平台管理，用户不可见 | `SOUL.md`, `USER.md`, `HEARTBEAT.md` |
| 支出控制 | 每个子代理的信用额度上限 | `runTimeoutSeconds` (基于时间的代理) |

这些设计决策几乎一一对应。持久化存储、浏览器访问、多模型路由、子代理并行、长期运行的自主性——这些都不是 Perplexity 首创的功能。它们是 OpenClaw 社区自去年以来就一直在使用的功能，并且是以可配置的形式。
OpenClaw 的创建者 Peter Steinberger 于二月加入了 OpenAI。Altman 将个人代理描述为“将迅速成为我们产品核心”的东西，并表示未来“将是极其多代理的”。Anthropic 在一月推出了 Claude Cowork。整个行业现在正在将 OpenClaw 开源社区最先构建的基础设施模式产品化。

---

## 3. 分歧之处 {#diverge}

想法是相同的。执行理念是相反的。
Ars Technica 说得好：“如果说 OpenClaw 是 AI 代理工具领域的开放网络，那么 Computer 就是苹果的应用商店。”

这个类比很贴切，值得我们细细品味。开放网络让你能构建任何东西、访问任何内容——代价是牺牲了安全性、可靠性，并且需要高深的技术知识。应用商店限制了你能构建和访问
| 维度 | Perplexity Computer | OpenClaw |
| --- | --- | --- |
| 运行位置 | 仅限云端 | 本地设备、自托管 VPS 或 TinyClaw |
| 集成模型 | 精选的平台集成 | 开放技能 + MCP 生态系统 |
| 配置 | 平台管理，对用户不可见 | `openclaw.json`，用户完全控制 |
| 安全模型 | 平台负责 | 用户负责 |
| 自定义上限 | 低 — 使用 Perplexity 提供的内容 | 高 — 可配置任何内容 |
| 透明度 | 黑盒 | 通过 `sessions_history` 获取完整记录 |
| 数据位置 | Perplexity 的云端 | 你的本地机器或服务器 |
| 支出控制 | 每个子代理的信用额度上限 | `runTimeoutSeconds`（时间代理） |

这种权衡始终沿着一个方向进行：Perplexity 放弃控制权以换取简洁性和安全性；OpenClaw 放弃简洁性以换取控制权和可扩展性。

---

## 4. Perplexity 做不到什么 {#cant-do}
这些并非边缘情况——而是 OpenClaw 用户视为基本要求的能力。

**SOUL.md — 持久化智能体身份**

在 OpenClaw 上，`SOUL.md` 是一个文件，它塑造了智能体在每个会话中的思考和行为
Perplexity Computer 没有对等物。每个任务都从平台的默认设置开始。你无法编写一个持久化的指令集，无法定义智能体应如何处理模糊性，也无法赋予它一个持久的角色。你今天使用的智能体不会记得你建立的任何偏好。
). "人工" (réngōng) is a good word for "human" in this context (human-initiated). "启动" (qǐdòng) for "initiate".
    -   Full sentence: Perplexity 支持的长时间运行的工作流仍然需要人工来启动。 (
OpenClaw 公开了一个 `/hooks/agent` 端点。当一个 PR 打开时，一个 GitHub Webhook 会被触发；代理会读取 diff，运行审查，并将反馈发布到 Slack——整个过程无需人工干预。外部事件驱动了工作流。

Perplexity Computer 没有入站 Webhook 接口。它无法监听来自外部系统的事件。

**本地文件访问**
如果你的工作流需要接触你机器上的文件——例如从本地仓库读取代码、处理你文件系统中的文档、或与本地应用程序交互——Perplexity Computer 是无法访问它们的。所有东西都在 Perplexity 的云环境中运行。你的本地机器对它来说是不可见的。

**第三方技能和 MCP 服务器**
OpenClaw 的生态系统包含 ClawHub 和 agentskills.io 上的数千个 Skills，并支持自定义 MCP 服务器。您可以安装一个连接到您内部工具的 Skill，编写一个将您组织工作流程编码进去的自定义 Skill，或者连接一个 MCP 服务器，让智能体能够
OpenClaw 中的 `sessions_history` 为你提供了智能体所做一切的完整、可检查的记录：每一次工具调用、每一次模型响应、每一个决策点。当出现问题时，你可以准确地查看发生了什么。

Perplexity Computer 会向你显示输出。其推理过程——哪一步使用了哪个模型，每个子智能体决定了什么以及为什么——都保留在平台内部。你可以看到你得到了什么；但你看不到你是如何得到它的。

---
## 5. Perplexity 的优势所在 {#does-better}

坦诚地说明每月200美元的订阅费能买到什么，这一点很重要。其中有几点是真正的优势，而不仅仅是市场营销。

**零设置**

无需配置服务器。无需配置
在 OpenClaw 上，即使有 TinyClaw 负责处理基础设施，仍然有一个重要的设置步骤：连接通道、编写 SOUL.md、配置模型堆栈、决定 Cron 定时任务。对于非技术用户来说，这个差距是显著的。

**19-你
Opus 决定每个子任务由19个模型中的哪一个来处理。你不需要指定“使用 Gemini 进行研究，使用 Nano Banana 处理图像，使用 Grok 处理轻量级任务”。该路由会根据 Perplexity 系统确定的最佳方式自动进行。
在 OpenClaw 上，构建等效的多模型路由需要进行刻意的配置：设置 `subagents.model`、使用 `modelByChannel`、编写 `model.fallbacks`，还可能需要在 `AGENTS.md` 中编写自定义路由逻辑。这是可以做到的——
这是 Perplexity 具备而 OpenClaw 明确没有的一个方面。基于信用点的支出上限让你能够规定“此研究子任务的开销不应超过 X”。这是一种在任务级别上直接以美元为单位的成本控制。

OpenClaw 的成本控制是通过时间
浏览器、代码执行、图像生成、视频生成——这些功能开箱即用，无需调试，也无需凭据管理。在 OpenClaw 上，每个功能都需要安装技能（Skill）、配置 MCP 服务器或提供 API 密钥。配置完成后，结果会更强大；但设置成本是实实在在的。

**没有来自未验证插件的攻击面**
ClawHavoc 事件是这一风险最清晰的例证。2026年2月，在一次协同的供应链攻击中，ClawHub 上发现了 341 个恶意技能。其主要攻击载荷是 Atomic Stealer (AMOS)——一款专门窃取加密
Perplexity Computer 的封闭模型完全消除了这个攻击面。你无法安装恶意技能，因为你根本无法安装任何技能。

**商业责任**

每月 200 美元可以购买一份支持合同、一份 SLA，以及一个在产品出现故障并对你造成
## 6. 各自的实际目标用户 {#who-for}

它们的目标用户并不相同。这一点很重要，因为将它们视为竞争对手，会导致在选择使用哪一个时得出错误的结论。

**Perplexity Computer：**
最能从 Perplexity Computer 受益的用户，其工作流基于云端，不需要处理本地文件或被外部事件触发，乐于让平台管理所有路由和基础设施决策，并且相比于“我完全理解其工作原理”，更看重“开箱即用”的
一位自动化竞争对手研究的营销顾问。一位使用 AI 辅助研究和起草文稿的作家。一位希望将完全存在于云服务中的客户沟通工作流自动化的小企业主。对于这些用户来说，OpenClaw 配置层是阻力——而不是价值。Perplexity
从 OpenClaw 中获益最多的用户具有特定的基础设施要求：本地文件访问、由 Cron 触发的自主工作流、由 Webhook 驱动的事件处理、针对专有工具的自定义技能，或数据驻留要求，这些要求使得“在 Perplexity 的云端
一位想要 PR 审查机器人的工程师。一位需要能在本地仓库中处理代码的智能体的开发者。一个需要在内部基础设施上运行自主监控工作流的运维团队。一位需要能在一个 SOUL.md 文件中跨会话积累知识的长期运行智能体的研究人员。对于这些用户来说，Perplexity Computer 的精选模型并不是他们所需功能的简化版——它是一个根本上不同的产品。
最清晰的测试标准是：如果你的工作流需要无需人工输入即可启动（通过 Cron 或 Webhook），或者需要处理不在 Perplexity 云端的文件，那么你就是 OpenClaw 的用户。如果你的工作流由你本人发起，并且完全在云服务中运行，那么 Perplexity Computer 就值得评估。

这两类用户群体都存在，并且都会不断增长。代理基础设施市场足够大，可以容纳这两种方法，而且两者很可能会继续分化，而不是融合。

---
## 7. 这对智能体平台竞赛意味着什么 {#platform-race}

**基础设施的论点已成定局。**

在2025年初，“智能体需要自己的持久化计算环境”还是一个需要你为之辩护的主张。到了2026年2月，它已经成为 Perplexity 每月收费200美元的产品，是 OpenAI 正在纳入其路线图的功能，也是 Anthropic 以 Claude Cowork 形式推出的服务。关于这是否是一个真正的产品类别的争论已经结束。它就是一个真正的产品类别。
现在的竞争在于谁拥有基础设施层——而不在于这一层是否存在。

**开源到商业化的流水线正在按计划运行。**
OpenAI 聘请了 OpenClaw 的创造者。Perplexity 基于这个概念构建了一款产品。Anthropic 推出了 Claude Cowork。这种模式与 Linux → Red Hat → AWS、Android → Samsung、Git → GitHub 的发展历程如出一辙。开源定义了类别并验证了概念；商业公司将其产品化以供主流采用。
对于 OpenClaw 生态系统，一个值得提出的问题是：随着封闭、精美的版本不断改进，开放、可配置的版本是否还能保持其独特的价值？从历史上看，答案是肯定的——但其价值主张必须保持清晰。“完全控制，任何基础设施，可扩展的生态系统”是一个连贯的立场。而“一个设置更麻烦、比 Perplexity Computer 稍便宜的版本”则不是。

**每月200美元并带有信用额度限制，确立了市场的承受能力。**
这就是该功能最精良、零配置、由19个模型协同编排的版本的当前价格。其中包含 10,000 点数——并非无限使用。
TinyClaw 能在不到一分钟的时间内部署相同的底层多智能体架构，成本显著降低，并且支持 Cron 定时任务、Webhooks、本地文件访问以及完整的 OpenClaw Skills 生态系统。其价值主张并非“更便宜的 Perplexity Computer”。它是一款不同的
市场已经形成。基础设施竞赛已经开始。OpenClaw 是证明了这一概念的开源原型。Perplexity Computer 是首批基于此概念的重大商业押注之一。未来可期。

---

## 快速参考

| | Perplexity Computer | OpenClaw + TinyCl
| 支出上限 | 基于额度，按子智能体 | 基于时间 (`runTimeoutSeconds`) |
| 定制化 | 低 | 高 |
| 本地文件访问 | 否 | 是 |
| Cron / 计划任务 | 否 | 是 |
| Webhook
- [Perplexity Computer 发布](https://www.perplexity.ai/hub/blog/introducing-perplexity-computer)
- [Ars Technica：Perplexity 发布 “Computer”](https://arstechnica.com/ai/2026/02/perplexity-announces-computer-an-ai-agent-that-assigns-work-to-other-ai-agents/)
- [agentputer.com](https://
- [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) — OpenClaw 仓库

---

*来源：Perplexity 博客 · Ars Technica · TechCrunch · The Verge · gHacks · The Tech Outlook · 2026年2月*