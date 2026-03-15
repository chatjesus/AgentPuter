# 文章大纲：11 · AI 模型大战：Gemini 3.1 Pro 刚上线，你给 OpenClaw 选哪个脑子？

**系列定位：** Agent 基础设施系列 · 第十一篇  
**写作时机：** 极佳——Gemini 3.1 Pro 2月19日刚发布，Claude Sonnet 4.6 2月17日刚发布，话题热度顶峰  
**目标读者：** OpenClaw 用户（现有 & 潜在），关注 LLM 进展的开发者  
**核心钩子：** "Gemini 3.1 Pro 在专门针对 AI Agent 的 MCP Atlas 基准测试里拿了第一，但 OpenClaw 官方文档的推荐默认模型还是 Claude Opus 4.6。谁对？"  
**收尾导流：** 技术用户 → OpenClaw 配置指南；非技术用户 → TinyClaw 一键部署

---

## 〇、事实核查备注（写作前必读，勿删）

> 以下来自联网深度核查（2026年2月19日）。大纲首版存在错误，本版已全部修正。

| 核查项 | 首版错误 | 修正结果 | 来源 |
|--------|---------|---------|------|
| Claude Opus 4.6 上下文窗口 | 声称"10M tokens + DRA" | **1M tokens**（beta，超200K进入长上下文定价）；无"DRA"架构 | Anthropic 官方文档 + smartscope |
| Claude Opus 4.6 定价 | $15/$75 per M tokens | **$5/$25**（≤200K标准），**$10/$37.50**（>200K长上下文beta） | Anthropic 官方定价页 |
| Claude Sonnet 4.6 上下文窗口 | 未提及 | **1M tokens**（beta），**同样支持**Context Compaction API | claude5.ai + itbrief |
| 混合路由 YAML 配置 | 自创了一段 YAML（无文档支持） | OpenClaw 用 `provider/model` 单模型切换，**无跨任务路由字段**；多模型需手动运行多个 Agent 实例 | OpenClaw 官方文档 |
| Gemini 接入 OpenClaw | 未说明方法 | **原生支持** `google` provider：`GEMINI_API_KEY` + `google/gemini-3.1-pro-preview`；另有 Vertex AI、Antigravity、Gemini CLI 三种 OAuth 接入方式 | OpenClaw 官方文档 |
| MCP Atlas 出处 | 笼统描述 | **Scale AI 发布**的开源基准，36个真实MCP服务器 + 220个工具 + 1000个任务，考察跨服务器3-6步工具链调度能力 | arxiv.org/2602.00933 + scale.com |

---

## 一、标题方案（A/B）

**英文：**
- A（推荐）：`The AI Brain Showdown: Gemini 3.1 Pro Just Dropped. Which Model Runs the Best OpenClaw Agent?`  
- B：`Gemini 3.1 Pro vs Claude Opus 4.6 vs Sonnet 4.6: Which AI Model Wins Inside OpenClaw?`

**中文：**
- A（推荐）：`AI 脑子大乱斗：Gemini 3.1 Pro 刚上线，OpenClaw 该换模型了吗？`
- B：`Claude vs Gemini vs GPT——2026年2月实测，哪个模型跑 OpenClaw 最好用？`

---

## 二、文章结构大纲

---

### §0 引子（~200字）

**节奏：** 新闻 + 悬念 + 数据钩子

两天前（2月17日），Anthropic 发布 Claude Sonnet 4.6。  
昨天（2月19日），Google 发布 Gemini 3.1 Pro。  
一张 benchmark 截图在 X 上广泛流传，#OpenClaw 话题下炸开了锅。

> **图片嵌入：** 用户提供的官方 Gemini 3.1 Pro benchmark 对比表截图

截图里有一行数据特别刺眼——**MCP Atlas**，这是 Scale AI 发布的专项 Agent 基准测试，用 36 个真实 MCP 服务器、220 个工具，模拟跨服务器多步工具链调度场景。

**Gemini 3.1 Pro 拿了 69.2%，全场最高。**

OpenClaw 的整个调度层，底层就是 MCP 协议。

OpenClaw 官方文档里的推荐默认配置，还是：

```json
{ "model": { "primary": "anthropic/claude-opus-4-6" } }
```

这两件事怎么同时都是对的？

---

### §1 先搞清楚：哪些 Benchmark 对 OpenClaw 真的重要？（~300字）

**核心论点：** 90% 的模型对比文章选错了 benchmark，别被误导。

| 基准测试 | 测什么 | OpenClaw 相关性 |
|---------|--------|----------------|
| Humanity's Last Exam | 学术知识题库 | ⭐⭐ 低——OpenClaw 不考研 |
| GPQA Diamond | 研究生级科学题 | ⭐⭐ 低 |
| MMLU / MMMLU | 多学科通识题 | ⭐⭐ 低 |
| SWE-Bench Verified | 单次代码 Bug 修复 | ⭐⭐⭐ 中——对 Coding Skills 有参考 |
| **MCP Atlas** | **36个真实MCP服务器 × 1000个跨服务器任务** | **⭐⭐⭐⭐⭐ 极高** |
| **APEX-Agents** | **长周期、多步专业 Agent 任务** | **⭐⭐⭐⭐⭐ 极高** |
| **τ2-bench** | **真实工具调用稳定性（Retail/Telecom）** | **⭐⭐⭐⭐⭐ 极高** |
| BrowseComp | 网页搜索 + 多跳推理 | ⭐⭐⭐⭐ 高——对 Browser/Search Skills 有用 |
| Terminal-Bench 2.0 | 终端命令执行稳定性 | ⭐⭐⭐⭐ 高——系统操作类 Skills |
| **GDPval-AA Elo** | **高价值专业任务 ELO 综合** | **⭐⭐⭐⭐ 高——接近真实商业场景** |
| ARC-AGI-2 | 抽象推理/逻辑新题型 | ⭐⭐⭐ 中——创意、复杂规划类任务有参考 |

**结论前置：** 只关心 OpenClaw 日常使用，你最应该看的是 MCP Atlas + APEX-Agents + τ2-bench。

> **附注（MCP Atlas 方法论）：** 该基准由 Scale AI 研究团队发布（arxiv 2602.00933），开源可复现。任务要求模型在不事先告知工具名称的情况下，自主发现并跨服务器编排 3-6 次工具调用完成目标——这与 OpenClaw Skills 链式调度高度吻合。

---

### §2 四位选手亮相（~600字）

---

#### 2.1 Gemini 3.1 Pro（新人挑战者）

- **发布：** 2026年2月19日（昨天）
- **定位：** Google "核心推理基础层"升级版，Deep Think 背后的底层智力
- **关键数据：**
  - MCP Atlas: **69.2%**（全场最高，超过 Opus 4.6 近 10 个百分点）
  - APEX-Agents: **33.5%**（全场最高）
  - BrowseComp: **85.9%**（全场最高）
  - ARC-AGI-2: **77.1%**（是上代 Gemini 3 Pro 31.1% 的 2.5 倍）
- **弱点：**
  - GDPval-AA Elo: 1317（显著低于 Claude Sonnet 4.6 的 1633 和 Opus 4.6 的 1606）
  - SWE-Bench Pro: 54.2%（被 GPT-5.3-Codex 56.8% 超越）
  - Humanity's Last Exam（含工具）: 51.4%（低于 Opus 4.6 的 53.1%）
- **上下文窗口：** 1M tokens（与 Claude 持平）
- **价格：** 正式定价待公布（当前 AI Studio 预览版可免费试用）
- **如何在 OpenClaw 使用：**
  ```bash
  # 设置 Google API Key
  export GEMINI_API_KEY="your-key"
  # 切换模型
  openclaw models set google/gemini-3.1-pro-preview
  ```

---

#### 2.2 Claude Opus 4.6（卫冕王者）

- **发布：** 2026年2月5日
- **定位：** OpenClaw 社区公认最佳，官方文档默认推荐模型
- **关键数据：**
  - SWE-Bench Verified: **80.8%**（全场最高）
  - Humanity's Last Exam（含工具）: **53.1%**（全场最高）
  - τ2-bench Telecom: **99.3%**（并列最高）
  - GDPval-AA Elo: 1606（全场第二，仅次于 Sonnet 4.6）
- **弱点：**
  - MCP Atlas: 59.5%（输给 Gemini 3.1 Pro 近 10 个百分点）
  - 贵：标准定价 **$5/$25** per M tokens；超 200K 上下文切换至 **$10/$37.50**
- **上下文窗口：** 1M tokens（beta，超 200K 触发长上下文定价）
- **新特性（重要）：**
  - **Agent Teams（Alpha）：** 多个专业子 Agent 并行协作（前端/后端/测试同时运行），OpenClaw 最新版支持
  - **Context Compaction API（Beta）：** 自动压缩历史上下文，理论上支持"无限对话"，解决长任务上下文爆炸问题
  - **Adaptive Thinking（4档）：** 自动调节推理深度（low/medium/high/max），可配置控制 token 消耗
  - **128K 输出 tokens：** 较上代翻倍
- **如何在 OpenClaw 使用：**
  ```bash
  openclaw models set anthropic/claude-opus-4-6
  ```

---

#### 2.3 Claude Sonnet 4.6（隐藏黑马）

- **发布：** 2026年2月17日（前天），GitHub Copilot 同日上线
- **定位：** 性价比最优，专家任务综合 ELO 竟然超过 Opus 4.6
- **关键数据（令人意外）：**
  - **GDPval-AA Elo: 1633（全场最高，超过 Opus 4.6 的 1606）**
  - τ2-bench Retail: 91.7%（超过 Gemini 3.1 Pro 的 90.8%）
  - MRCR v2（1M 上下文长文检索）: 84.9%（并列 Gemini 3.1 Pro）
  - 社区测试：Claude Code 用户在 Sonnet 4.6 vs Sonnet 4.5 中 70% 选择 4.6；vs Opus 4.5 中 59% 选择 4.6
- **弱点：** ARC-AGI-2 落后（58.3% vs Gemini 3.1 Pro 77.1%）；MCP Atlas 61.3%
- **价格：** **$3/$15** per M tokens（与 4.5 相同，未涨价）；超 200K 为 $6/$30
- **上下文：** 1M tokens（beta），同样有 Context Compaction + Adaptive Thinking
- **如何在 OpenClaw 使用：**
  ```bash
  openclaw models set anthropic/claude-sonnet-4-6
  ```

---

#### 2.4 GPT-5.3-Codex（代码专项）

- **定位：** 代码修复专项模型，非通用 Agent 首选
- **关键数据：**
  - SWE-Bench Pro: **56.8%**（全场最高，超过 Gemini 3.1 Pro 的 54.2%）
  - Terminal-Bench 2.0: **77.3%**（全场最高）
- **弱点：** APEX-Agents 23.0%（全场垫底）；MCP Atlas 无数据；GDPval-AA 无数据
- **适合场景：** 纯代码 Debug / 重构类 Skills，不适合通用 Agent 调度
- **如何在 OpenClaw 使用：**（需 OAuth 登录）
  ```bash
  openclaw onboard --auth-choice openai-codex
  openclaw models set openai-codex/gpt-5.3-codex
  ```

---

#### 2.5 黑马补充：Kimi K2.5（性价比搅局者）

- **来自：** Moonshot AI（中国），OpenRouter 上本周用量激增
- **在 OpenClaw 中：** 官方文档原生支持 `moonshot/kimi-k2.5`
- **优势：** Agent Leaderboard 工具选择排名 #1（OpenRouter 数据），价格远低于 Claude
- **适合场景：** 预算有限、中文语境、高频任务
- **如何在 OpenClaw 使用：**
  ```bash
  # 需配置 Moonshot API Key
  openclaw models set moonshot/kimi-k2.5
  ```

---

### §3 关键数据一眼看穿（可视化表格，~200字）

**Agent 专项基准对比（只看最重要的 5 个）：**

| 基准测试 | Gemini 3.1 Pro | Opus 4.6 | Sonnet 4.6 | GPT-5.3-Codex | 胜者 |
|---------|---------------|---------|-----------|--------------|------|
| **MCP Atlas**（多步工具链） | **69.2%** | 59.5% | 61.3% | — | 🏆 Gemini |
| **APEX-Agents**（长周期任务） | **33.5%** | 29.8% | — | 23.0% | 🏆 Gemini |
| **GDPval-AA Elo**（专家任务） | 1317 | 1606 | **1633** | — | 🏆 Sonnet |
| **τ2-bench Retail**（工具稳定性） | 90.8% | 91.9% | **91.7%** | — | 🏆 Opus |
| **BrowseComp**（搜索推理） | **85.9%** | 84.0% | 74.7% | — | 🏆 Gemini |
| SWE-Bench Pro（代码修复） | 54.2% | — | — | **56.8%** | 🏆 Codex |

**代码块：** Gemini 3.1 Pro 赢了 3/6 项核心 Agent 指标，但 GDPval-AA 落后 Claude 超过 300 Elo。

---

### §4 实战场景：不同用法选哪个？（~400字）

| OpenClaw 使用场景 | 推荐模型 | 核心理由 |
|----------------|---------|---------|
| 邮件/日历/会议管理（gog、mail 类 Skills） | **Sonnet 4.6** | GDPval-AA 1633 全场最高，处理专业事务任务最强，成本仅 Opus 的 60% |
| 复杂跨系统工作流（10步+，跨多个 Skills） | **Gemini 3.1 Pro** | MCP Atlas 69.2%，专为跨服务器多步工具链设计 |
| 超长任务 / 项目记忆管理（SOUL.md、para-second-brain） | **Opus 4.6** | Context Compaction API + 1M tokens，长任务不断线 |
| 浏览器自动化 / 情报搜集（Agent Browser、Search Skills） | **Gemini 3.1 Pro** | BrowseComp 85.9% 全场最高 |
| 代码 Debug / 开发 Sprint | **GPT-5.3-Codex 或 Opus 4.6** | Codex SWE-Bench Pro 最高；Opus 推理最可靠 |
| 每日轻量任务、高频对话 | **Sonnet 4.6** | 性价比最优，100步任务约 $0.90 vs Opus 的 $3.60 |
| 中文语境 + 成本敏感 | **Kimi K2.5** | 原生中文支持，Agent 工具选择排名 #1，价格远低于 Claude |
| 本地部署 / 零预算 | **Gemini 2.5 Flash（免费）/ Ollama** | AI Studio 免费配额 1500次/天，完全本地可选 Qwen 3.5 |

**价格速查（100步标准 Agent 任务，约60万tokens）：**

| 模型 | 100步估算成本 | 说明 |
|------|-------------|------|
| Gemini 2.5 Flash | **$0**（免费配额内） | 免费 1500次/天 |
| Kimi K2.5 | ~$0.03 | 极低价格 |
| Sonnet 4.6 | ~$0.90 | 最佳性价比云端模型 |
| Gemini 3.1 Pro | ~$0.60（预估） | 正式定价待公布 |
| Opus 4.6 | ~$3.60 | 超 200K 上下文按 $10/$37.50 计 |

---

### §5 社区真相：Gemini 赢了 benchmark，但社区为什么还在用 Claude？（~400字）

**核心矛盾：** OpenClaw 官方文档推荐 `anthropic/claude-opus-4-6`；MCP Atlas 上 Gemini 3.1 Pro 领先 10 个百分点。这不矛盾吗？

**三个原因：**

**① Benchmark 标准化 ≠ 生产级 Skills 的混乱**  
MCP Atlas 用的是 36 个设计良好的标准化 MCP 服务器。OpenClaw 的 3286 个社区 Skills 质量参差不齐——有些 SKILL.md 格式不规范、工具描述模糊、错误处理缺失。Claude 对格式不严格的工具调用有更高容忍度和更强的错误恢复能力，Gemini 更依赖 schema 严格性。

**② OpenClaw 生态是基于 Claude 行为特征调优的**  
大量 Skills 的提示词写法、调用格式、错误恢复模式，都是 ClawHub 开发者对着 Claude 反复测试出来的。换模型不是换个参数——是重新适配一整套行为预期。这是真实的迁移成本。

**③ Context Compaction API 是真实护城河**  
Gemini 3.1 Pro 的 1M 上下文窗口与 Opus 4.6 相同，但 Opus 独有 Context Compaction API——当对话接近上下文极限时自动压缩历史，让长任务不中断继续运行。对于跑几个小时的 OpenClaw 任务，这个功能是 Gemini 目前没有的能力。

**结论：** Gemini 3.1 Pro 是目前最值得测试的新选手——尤其是中等长度（50-200步）、跨系统工作流场景。但"完全替代 Claude"，时机未到。

**建议策略：** 先用 Gemini 3.1 Pro 的免费配额跑一个你最常用的工作流，对比结果。换不换，数据说话。

---

### §6 怎么在 OpenClaw 切换模型？（~250字，技术向）

**核心概念：** OpenClaw 用 `provider/model` 格式统一引用所有 LLM，一行命令切换。

```bash
# 查看当前使用的模型
openclaw models list

# 切换到 Gemini 3.1 Pro（需先设置 GEMINI_API_KEY）
export GEMINI_API_KEY="your-google-ai-studio-key"
openclaw models set google/gemini-3.1-pro-preview

# 切换回 Claude Opus 4.6
openclaw models set anthropic/claude-opus-4-6

# 切换到 Sonnet 4.6（节省成本）
openclaw models set anthropic/claude-sonnet-4-6

# 切换到 GPT-5.3-Codex（OAuth登录）
openclaw onboard --auth-choice openai-codex
openclaw models set openai-codex/gpt-5.3-codex

# 本地模型（Ollama，完全免费）
openclaw models set ollama/qwen3.5
```

**也可以写进配置文件（`~/.openclaw/openclaw.json`）：**

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

> **注意：** OpenClaw 目前不支持在同一配置文件里对不同任务自动路由到不同模型（无内置跨任务模型分发）。高级玩法是：运行多个 OpenClaw 实例，分别配置不同模型，通过 Agent2Agent 协议协同工作。

---

### §7 TinyClaw：如果你不想操心这些（~250字）

**导流逻辑：** 以上内容对 90% 的普通用户来说太复杂了。

> 你现在面对的问题是：6 个选手，10 项基准，还要管 API Key 轮换、Context Compaction 开关、模型版本更新……  
> **TinyClaw 把这个问题直接消灭了。**

TinyClaw 具体做了什么：

1. **一键部署**：60 秒建好你的 OpenClaw 环境，零配置
2. **模型自动推荐**：根据你的使用习惯（邮件/代码/通用助手）推荐最优模型
3. **一键切换模型**：今天 Gemini 3.1 Pro 上线，TinyClaw 已经支持接入，直接在面板里切
4. **成本可控**：内置用量仪表盘，设置月度预算上限

**今天** Gemini 3.1 Pro 上线了。**你不需要看 benchmark，TinyClaw 会替你更新推荐。**

→ [tinyclaw.dev](https://tinyclaw.dev) · 免费开始 · 60 秒建好你的 Agent

---

### §8 结尾：这场竞争才刚开始（~100字）

Gemini 3.1 Pro：2月19日上线。  
Claude Sonnet 4.6：2月17日上线。  
Claude Opus 4.6：2月5日上线。  
距离上一个大模型发布：**11 天。**

这个节奏意味着：你的 OpenClaw 最优配置，每个月都在变。

要么持续跟进，要么让 TinyClaw 替你跟进。

---

## 三、SEO 关键词

**英文核心词：**  
`best model for OpenClaw 2026`, `Gemini 3.1 Pro OpenClaw setup`, `Claude Opus 4.6 vs Gemini agent benchmark`, `MCP Atlas benchmark explained`, `OpenClaw model comparison February 2026`, `which LLM for AI agents`, `openclaw claude sonnet 4.6`, `MCP Atlas Scale AI`

**中文核心词：**  
`OpenClaw 用什么模型 2026`, `Gemini 3.1 Pro 和 Claude 对比`, `AI Agent 最佳模型`, `MCP Atlas 基准测试`, `OpenClaw 模型配置`, `TinyClaw 模型选择`, `Kimi K2.5 OpenClaw`

**长尾关键词：**  
`openclaw gemini 3.1 pro how to setup`, `claude opus 4.6 context window price`, `openclaw models switch command`, `MCP Atlas google gemini score`, `best cheap model openclaw 2026`

---

## 四、数据源 & 引用（核查后版本）

| 内容 | 来源 | 可信度 |
|------|------|--------|
| 核心 benchmark 对比表 | 用户上传（Gemini 官方发布图片）| ✅ 一手 |
| Gemini 3.1 Pro 发布详情 | [blog.google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro) + [Mashable](https://mashable.com/article/google-releases-gemini-3-1-pro-benchmarks) | ✅ 一手/二手 |
| Claude Opus 4.6 定价/功能 | [Anthropic 官方定价](https://platform.claude.com/docs/en/about-claude/pricing) + [smartscope](https://smartscope.blog/en/blog/claude-opus-4-6-complete-guide/) | ✅ 一手/核查过 |
| Claude Sonnet 4.6 发布 | [GitHub Changelog 2月17日](https://github.blog/changelog/2026-02-17-claude-sonnet-4-6-is-now-generally-available-in-github-copilot) + [resultsense](https://www.resultsense.com/news/2026-02-18-anthropic-launches-claude-sonnet-4-6) | ✅ 核查过 |
| MCP Atlas 基准方法论 | [arxiv 2602.00933](https://arxiv.org/html/2602.00933v1) + [scale.com](https://scale.com/research/mcpatlas) | ✅ 学术一手源 |
| OpenClaw 模型配置命令 | [docs.openclaw.ai/providers](https://docs.openclaw.ai/providers) + [docs.openclaw.ai/concepts/model-providers](https://docs.openclaw.ai/concepts/model-providers) | ✅ 官方文档 |
| 定价表（所有模型） | [getclawkit.com/compare/pricing](https://getclawkit.com/compare/pricing) | ⚠️ 第三方，需核实最新定价 |
| 社区模型推荐 | [openclaw.bz/models](https://openclaw.bz/models/best-large-language-models-for-openclaw) | ⚠️ 第三方社区站 |
| Kimi K2.5 趋势 | OpenRouter 周榜（getclawkit 引用）| ⚠️ 间接来源 |

**图表建议：**
1. 嵌入用户上传的官方 benchmark 截图（§0 引子，标注出 MCP Atlas 那一行）
2. §3 的 Agent 专项 5 项对比表（建议做成渐变色格子图）
3. §4 价格速查表（建议做成简洁卡片式）

---

## 五、写作注意事项

- **Gemini 3.1 Pro API 定价尚未官方公布**，§4 成本估算须加"预估，以官方公布为准"
- **Claude Opus 4.6 无 10M 上下文**，大纲首版错误已修正，写作时切勿重现
- **混合路由 YAML 不可照搬**——OpenClaw 不原生支持，§6 已改为实际 CLI 命令
- **Context Compaction API 和 Agent Teams 是 Opus 4.6 关键新特性**，可在 §5"社区真相"中重点突出
- **Kimi K2.5 中文受众价值高**——中文版文章可专门加一段，突出中文语境 + 低价的组合优势
- **TinyClaw 模型支持 Gemini 待核实**：现有资料显示 TinyClaw 原生支持 Anthropic + OpenAI；Gemini 是否已接入待官网确认，写作时用"已支持 / 近期将支持"的措辞并加注

---

## 六、内容延伸建议

| 配套内容 | 形式 | 说明 |
|---------|------|------|
| 每日一技番外 | skills-day-model-test | 用 `gog` skill 分别跑 Claude / Gemini / Kimi，截图对比邮件处理结果 |
| X/Twitter 互动 | 投票帖 | "Gemini 3.1 Pro MCP Atlas 拿了第一，你换了吗？A. 已换 B. 还在用 Claude C. 在测试中 D. 用本地模型" |
| 中文平台 | 知乎/即刻/微博 | 附 benchmark 截图，重点强调 Kimi K2.5 的中文 + 低价优势 |
| 后续文章（第12篇）| 深度 | `MCP Atlas 详解：Scale AI 的这套测试，才是评估 AI Agent 的正确方式` |
