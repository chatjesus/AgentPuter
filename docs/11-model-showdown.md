# AI 脑子大乱斗：Gemini 3.1 Pro 刚上线，OpenClaw 该换模型了吗？

**两天前 Anthropic 发布 Claude Sonnet 4.6，昨天 Google 发布 Gemini 3.1 Pro。对 OpenClaw 用户真正重要的那项基准测试，结果让人意外——而官方文档推荐的默认模型还没变。**

*Agent 基础设施系列 · 第十一篇 | 研究日期：2026年2月19日*

---

两天前——2月17日——Anthropic 发布了 Claude Sonnet 4.6。

昨天——2月19日——Google 发布了 Gemini 3.1 Pro。

Google 随发布一起公布了一张 benchmark 对比表，在 X 上广泛流传。OpenClaw 用户在其中一行数据前停住了脚：**MCP Atlas**。

MCP Atlas 是 Scale AI 研究团队发布的开源基准（arxiv 2602.00933）。它用 36 个真实的 MCP 服务器、220 个工具、1000 个任务，专门测试 AI 模型在不被告知工具名称的情况下，自主发现工具、跨服务器编排 3-6 次工具调用完成复杂目标的能力。

这不是抽象的描述。这正是 OpenClaw 每次运行 Skill 时在做的事。

**Gemini 3.1 Pro 在 MCP Atlas 上拿了 69.2%，Claude Opus 4.6 拿了 59.5%。**

但 OpenClaw 官方文档里的推荐默认配置，还是：

```json
{ "model": { "primary": "anthropic/claude-opus-4-6" } }
```

这两件事同时成立。下面讲清楚为什么，以及你今天应该怎么配置。

---

## 先搞清楚：哪些 Benchmark 对 OpenClaw 真的重要？

先把坐标系对好，再看数字。

标准 AI benchmark 竞技场——Humanity's Last Exam、GPQA Diamond、MMLU——测的是知识记忆和学术推理，对通用聊天机器人有参考价值。但对一个管邮件、控日历、监控 GitHub、控制浏览器的 OpenClaw Agent 来说，这些几乎没有预测价值。

真正能预测 Agent 表现的基准：

| 基准测试 | 测什么 | 对 OpenClaw 的相关性 |
|---------|--------|-------------------|
| **MCP Atlas** | 跨服务器工具发现、选择、多步编排（36 个真实 MCP 服务器） | ★★★★★ 这就是 OpenClaw Skills 做的事 |
| **APEX-Agents** | 长周期、多步专业 Agent 任务 | ★★★★★ 真实工作流场景 |
| **τ2-bench** | 工具调用稳定性（零售/电信场景） | ★★★★★ 生产可靠性 |
| **GDPval-AA Elo** | 高价值专业任务 ELO 综合 | ★★★★ 接近真实商业场景 |
| **BrowseComp** | 网页搜索 + 多跳推理 | ★★★★ Browser/Search 类 Skills |
| Terminal-Bench 2.0 | 终端命令执行稳定性 | ★★★★ 系统操作类 Skills |
| SWE-Bench Verified | 单次代码 Bug 修复 | ★★★ Coding Skills 有参考 |
| ARC-AGI-2 | 抽象新颖逻辑推理 | ★★★ 复杂规划任务 |
| GPQA Diamond / MMLU | 研究生级知识题 | ★★ OpenClaw 不考研 |

记住这张表，再看下面每个选手。

---

## 四位主要选手

### Gemini 3.1 Pro——新人挑战者

昨天（2月19日）发布，Gemini 3.1 Pro 是 Google 的核心推理基础层升级版——Gemini Deep Think 背后的底层智力，今天开始向开发者通过 Gemini API、Vertex AI 和 Google AI Studio 开放。

**领先的地方：**

- **MCP Atlas: 69.2%**——全场最高，领先 Claude Opus 4.6（59.5%）近 10 个百分点
- **APEX-Agents: 33.5%**——全场最高
- **SWE-Bench Verified: 80.6%**——与 Claude Opus 4.6（80.8%）几乎并列，代码修复能力常被低估
- **BrowseComp: 85.9%**——全场最高（所有模型均在工具辅助下测试：搜索 + Python + 浏览器，非裸模型）
- **ARC-AGI-2: 77.1%**——是上代 Gemini 3 Pro（31.1%）的 2.5 倍，大幅领先 Opus 4.6（68.8%）
- **1M tokens 上下文窗口**——与 Claude 持平；但无 Context Compaction API

**落后的地方：**

- **GDPval-AA Elo: 1317**——显著落后 Claude Sonnet 4.6（1633）和 Opus 4.6（1606）。在以人工评估为基础的专家任务排名上，Gemini 3.1 Pro 与 Claude 系列差距超过 300 Elo
- **SWE-Bench Pro: 54.2%**——被 GPT-5.3-Codex（56.8%）超越
- **Humanity's Last Exam（含工具）: 51.4%**——低于 Opus 4.6（53.1%）
- **定价：** $2 输入/$12 输出（per M tokens，≤200K context）；超 200K 切换至 $4/$18——与上代 Gemini 3 Pro 定价相同，推理性能翻倍以上

**如何在 OpenClaw 中使用：**

```bash
export GEMINI_API_KEY="你的 Google AI Studio Key"
openclaw models set google/gemini-3.1-pro-preview
```

---

### Claude Opus 4.6——卫冕王者

2月5日发布，Claude Opus 4.6 是 OpenClaw 官方文档的推荐默认模型，也是 ClawHub 社区开发者已经对着调试 Skills 好几周的模型。

**领先的地方：**

- **SWE-Bench Verified: 80.8%**——全场最高
- **Humanity's Last Exam（含工具）: 53.1%**——全场最高
- **τ2-bench Telecom: 99.3%**——与 Gemini 3.1 Pro（同样 99.3%）并列全场最高
- **GDPval-AA Elo: 1606**——全场第二，仅次于 Sonnet 4.6

**落后的地方：**

- **MCP Atlas: 59.5%**——在与 OpenClaw 架构最相关的基准上，比 Gemini 3.1 Pro 低近 10 个百分点
- **成本：** 标准定价 $5 输入/$25 输出（per M tokens，≤200K 上下文）。超过 200K tokens 后，整个请求切换至 $10/$37.50——是所有 token，不只是超出部分

**2月5日发布的关键新特性：**

- **1M tokens 上下文窗口（beta）：** Opus 级别的首次突破。访问需满足 Anthropic 的 tier 要求
- **Context Compaction API（beta）：** 当会话接近上下文上限时，自动压缩历史记录，让长任务不中断继续运行。Gemini 3.1 Pro 目前没有这个能力
- **Agent Teams（alpha）：** 多个专业子 Agent 并行协作（前端/后端/测试同时工作），在 Claude Code v2.1.32+ 和 Cowork 平台可用
- **Adaptive Thinking（4档）：** 自动根据任务难度调节推理深度（low/medium/high/max），可配置控制 token 消耗
- **128K 输出 tokens：** 较上代翻倍

**如何在 OpenClaw 中使用：**

```bash
openclaw models set anthropic/claude-opus-4-6
```

---

### Claude Sonnet 4.6——隐藏的黑马

2月17日发布。Sonnet 4.6 里有一条 benchmark 数据让很多人感到意外：

**GDPval-AA Elo: 1633——全场所有模型中最高。**

这不是小众指标。GDPval-AA 衡量的是高价值专业任务的综合表现——错误会有真实后果的那种工作。Claude Sonnet 4.6 在这项上超过了 Claude Opus 4.6（1606）、GPT-5.2（1462）和 Gemini 3.1 Pro（1317）。

它还在 τ2-bench Retail 上超过 Gemini 3.1 Pro（91.7% vs 90.8%），在 MRCR v2 长上下文检索上与 Gemini 3.1 Pro 并列（84.9%）。在内部测试中，Claude Code 用户在 Sonnet 4.6 vs Opus 4.5 的直接对比中，有 59% 更倾向选择 Sonnet 4.6。

**定价与 Sonnet 4.5 一致，未涨价：** $3 输入/$15 输出（per M tokens，≤200K），长上下文为 $6/$30。这是 Opus 4.6 标准价格的 60%——如果频繁触发长上下文定价，差距更大。

和 Opus 4.6 一样，Sonnet 4.6 也拥有 1M tokens 上下文（beta）、Context Compaction API 和 Adaptive Thinking。

**如何在 OpenClaw 中使用：**

```bash
openclaw models set anthropic/claude-sonnet-4-6
```

---

### GPT-5.3-Codex——代码专项选手

GPT-5.3-Codex 属于单独的品类，不应该放在通用 Agent 讨论里：

- **SWE-Bench Pro: 56.8%**——全场最高，超过 Gemini 3.1 Pro（54.2%）
- **Terminal-Bench 2.0: 77.3%**——OpenAI 自有 Codex harness 自报数据；标准 Terminus-2 harness 下 Gemini 3.1 Pro（68.5%）实际领先 Codex（64.7%）
- **APEX-Agents: 23.0%**——全场垫底

如果你的 OpenClaw 工作流以代码为核心——自动 Debug、重构、CI/CD 管理——Codex 5.3 值得测试。对于通用 Agent 编排，它不是正确的工具。

**如何在 OpenClaw 中使用：**

```bash
openclaw onboard --auth-choice openai-codex
openclaw models set openai-codex/gpt-5.3-codex
```

---

### Kimi K2.5——搅局的性价比选手

没有出现在官方 benchmark 表里，但值得关注：来自月之暗面（Moonshot AI）的 Kimi K2.5，目前在 OpenRouter Agent 工具选择排行榜上排名第一，本周用量激增。OpenClaw 官方文档原生支持：

```bash
openclaw models set moonshot/kimi-k2.5
```

对于成本敏感的工作流——尤其是中文语境任务——Kimi K2.5 以远低于 Claude 的价格提供有竞争力的 Agent 表现。它是当前中文 OpenClaw 部署中增长最快的模型。

---

## 关键数据一眼看穿

| 基准测试 | Gemini 3.1 Pro | Opus 4.6 | Sonnet 4.6 | GPT-5.3-Codex | 胜者 |
|---------|---------------|---------|-----------|--------------|------|
| **MCP Atlas**（工具编排） | **69.2%** | 59.5% | 61.3% | — | 🏆 Gemini |
| **APEX-Agents**（长周期任务） | **33.5%** | 29.8% | — | 23.0% | 🏆 Gemini |
| **GDPval-AA Elo**（专家任务） | 1317 | 1606 | **1633** | — | 🏆 Sonnet |
| **τ2-bench Retail**（工具稳定性） | 90.8% | **91.9%** | 91.7% | — | 🏆 Opus |
| **BrowseComp**（搜索推理） | **85.9%** | 84.0% | 74.7% | — | 🏆 Gemini |
| SWE-Bench Pro（代码修复） | 54.2% | — | — | **56.8%** | 🏆 Codex |

Gemini 3.1 Pro 赢了 5 项核心 Agent 指标中的 3 项。Claude Sonnet 4.6 拿下专家任务 ELO 第一。Claude Opus 4.6 工具稳定性最强。GPT-5.3-Codex 独占代码赛道。

没有一个模型在所有维度都赢——关键是看哪些基准最接近你真实的工作流。

---

## 不同场景选哪个？

| OpenClaw 使用场景 | 推荐模型 | 核心理由 |
|----------------|---------|---------|
| 邮件处理 + 日历管理（gog、mail 类 Skills） | **Sonnet 4.6** | GDPval-AA 1633 全场第一，处理专业事务最稳，成本是 Opus 的 60% |
| 复杂跨系统工作流（10 步+链式任务） | **Gemini 3.1 Pro** | MCP Atlas 69.2%，专为跨服务器多步工具编排设计 |
| 长期记忆 + 项目管理（SOUL.md、para-second-brain） | **Opus 4.6** | Context Compaction API + 1M tokens，长任务不中断 |
| 浏览器自动化 + 情报收集 | **Gemini 3.1 Pro** | BrowseComp 85.9% 全场最高 |
| 代码 Debug / 开发 Sprint | **GPT-5.3-Codex 或 Opus 4.6** | Codex 自报分数最高；但 Gemini 3.1 Pro（SWE-Bench Verified 80.6%）与 Opus（80.8%）几乎持平 |
| 每日轻量任务、高频对话 | **Sonnet 4.6** | 性价比最优，100 步任务约 $0.90 vs Opus 的 $3.60 |
| 中文语境 + 成本敏感 | **Kimi K2.5** | 原生中文支持，工具选择排名 #1，价格远低于 Claude |
| 零预算 / 本地隐私优先 | **Gemini 2.5 Flash（免费）或 Ollama** | AI Studio 每天免费 1500 次；完全本地可选 Qwen 3.5 |

**价格速查（100 步复杂工作流，约 60 万 tokens）：**

| 模型 | 预估成本 | 说明 |
|------|---------|------|
| Gemini 2.5 Flash | **$0**（免费额度内） | AI Studio 每天 1500 次免费 |
| Kimi K2.5 | ~$0.03 | Moonshot API |
| Sonnet 4.6 | ~$0.90 | $3/$15 per M tokens |
| Gemini 3.1 Pro | ~$0.60 | $2/$12 per M tokens（≤200K）；超 200K 为 $4/$18 |
| Opus 4.6 | ~$3.60 | 超 200K 触发长上下文定价 |

---

## 社区真相：Gemini 赢了 benchmark，为什么用户还在用 Claude？

这是个值得正面回答的问题：如果 Gemini 3.1 Pro 在最相关的 Agent benchmark 上领先，OpenClaw 社区为什么没有切换？

**原因一：标准化基准 ≠ 生产级 Skills 的混乱现实**

MCP Atlas 使用 36 个设计良好、schema 规范的 MCP 服务器。但 OpenClaw 的 3286 个社区 Skills 质量参差不齐——有些 SKILL.md 工具描述模糊、错误处理缺失、格式不规范。Claude 对格式不严格的工具调用有更高容忍度和更强的错误恢复能力；Gemini 更依赖输入的严格性。在生产环境里，处理写得烂的 Skills 的能力，有时比处理好 Skills 的 benchmark 分数更重要。

**原因二：整个生态是基于 Claude 的行为特征调优的**

ClawHub 上大量 Skills 的提示词写法、工具调用格式、错误恢复模式，都是开发者对着 Claude 反复测试调整出来的。切换模型不只是改一行配置——是重新适配整套 Skills 的行为预期。这是 benchmark 数字体现不出来的真实迁移成本。

**原因三：Context Compaction API 是 Gemini 目前没有的护城河**

两家模型现在都有 1M tokens 上下文窗口。但 Claude Opus 4.6（和 Sonnet 4.6）独有 Context Compaction API——当会话接近上下文极限时自动压缩历史，让任务可以无限期持续运行。对于跑几个小时、经过数百次工具调用的 OpenClaw 会话，这是 Gemini 3.1 Pro 当前没有的实用能力。

**实话实说：** Gemini 3.1 Pro 是当前最值得测试的新选手——尤其是跨系统自动化和浏览器类工作流。但"benchmark 上应该更好"和"在你的具体 OpenClaw 环境里确实更好"是两个不同的命题。测试之前，不下结论。

---

## 怎么在 OpenClaw 里切换模型？

OpenClaw 用 `provider/model` 格式统一引用所有 LLM，切换是一行命令：

```bash
# 查看当前使用的模型
openclaw models list

# 切换到 Gemini 3.1 Pro（先设置 GEMINI_API_KEY）
export GEMINI_API_KEY="你的 Key"
openclaw models set google/gemini-3.1-pro-preview

# 切换回 Claude Opus 4.6（官方推荐默认）
openclaw models set anthropic/claude-opus-4-6

# 切换到 Sonnet 4.6（更好的性价比）
openclaw models set anthropic/claude-sonnet-4-6

# 切换到 GPT-5.3-Codex（需要 OAuth 登录）
openclaw onboard --auth-choice openai-codex
openclaw models set openai-codex/gpt-5.3-codex

# Kimi K2.5（中文语境 / 成本敏感）
openclaw models set moonshot/kimi-k2.5

# 本地模型（Ollama，完全免费）
openclaw models set ollama/qwen3.5
```

也可以写进配置文件（`~/.openclaw/openclaw.json`）：

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "google/gemini-3.1-pro-preview"
      }
    }
  }
}
```

> **重要提醒：** OpenClaw 目前不支持在单个配置里对不同任务自动分配不同模型（没有内置的跨任务模型路由）。高级玩法是运行多个 OpenClaw 实例、分别配置不同模型，通过 Agent2Agent 协议协同。对大多数用户来说：选一个模型，在你的真实工作流上跑跑看。

---

## 不想管这些？用 TinyClaw

以上内容的真实描述是：6 个选手、10 项关键基准、不同场景不同答案、API Key 要管理、上下文定价阈值要追踪、每 11 天就有新模型发布……

大多数 OpenClaw 用户不想持续管理这些。他们只想要一个能用的 Agent。

[TinyClaw](https://tinyclaw.dev) 把这个问题直接消灭了：

1. **60 秒一键部署**——OpenClaw 在 1 分钟内跑起来，零 Node.js 配置
2. **智能模型推荐**——根据你的实际使用习惯推荐最优模型
3. **一键切换模型**——昨天 Gemini 3.1 Pro 上线，TinyClaw 已经支持接入
4. **成本可控**——内置用量仪表盘，设置月度预算上限

模型大战每 11 天打一轮。TinyClaw 替你跟进。

→ [tinyclaw.dev](https://tinyclaw.dev) · 免费开始 · 60 秒建好你的 Agent

---

## 更大的格局

Gemini 3.1 Pro：2月19日上线。
Claude Sonnet 4.6：2月17日上线。
Claude Opus 4.6：2月5日上线。
三次大模型发布之间的间隔：**11 天。**

这个节奏意味着你的 OpenClaw 最优配置有了保质期。今天最优的模型，下个月很可能不再是。

实际的应对方式不是追着每张新 benchmark 表跑。而是搞清楚哪三四项基准真正能预测你的具体工作流表现——然后知道该在什么时候切换。

跨系统自动化和浏览器任务：测 Gemini 3.1 Pro。
专业事务处理 + 控制成本：Sonnet 4.6。
长任务 + 上下文持久化：Opus 4.6 + Context Compaction。
纯代码工作：GPT-5.3-Codex。

搞不定这些：[TinyClaw](https://tinyclaw.dev)。

---

*数据来源：Gemini 3.1 Pro 官方 benchmark 表（Google DeepMind，2026年2月19日）。MCP Atlas 方法论：Scale AI Research，arxiv 2602.00933，scale.com/research/mcpatlas。定价数据：Anthropic 官方文档（platform.claude.com/docs/en/about-claude/pricing）。OpenClaw 模型配置：docs.openclaw.ai/providers。Gemini 3.1 Pro 定价：$2/$12 per M tokens（标准，≤200K）；超 200K 为 $4/$18。*

*刚接触 OpenClaw？→ [TinyClaw](https://tinyclaw.dev) 60 秒一键部署。OpenClaw 已在规模运行？→ [AgentPuter](https://www.agentputer.com/) 云端 24/7 托管。*
