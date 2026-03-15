# 基于 Claude Code 做产品的机会点
## PPT 大纲 · 2026.03.07

---

## Slide 1 · 封面

**AI x Office：下一个护城河在哪里**

从 Claude Code 架构看产品机会点

> 日期：2026.03.07
> 基于今天与 AI 的深度 know-how 研讨

---

## Slide 2 · 今天的问题框架

我们思考的三个核心问题：

1. 我们现在在做什么？这种形态叫什么层？
2. Claude Code 的架构设计告诉了我们什么？
3. 真正的增量机会在哪一层？

---

## Slide 3 · 我们今天做的事：一个真实产品的调试记录

**背景**：我们在 WPS 里构建了一个 AI 插件，让 Claude 直接写 JS 代码操作 Excel 表格

今天遇到并解决的真实问题：

| 问题 | 根因 | 结论 |
|------|------|------|
| "HI" 要 76 秒才回复 | Direct API warmup 失败后 isReady() 仍返回 true，白等 30s 超时才 fallback CLI | 可达性检测 + 连接超时降至 5s |
| Thinking 长时间空白 | CLI `--output-format stream-json` 根本不发 `thinking_delta`，内容一次性返回 | CLI 不支持 Thinking 流式是架构限制，非 bug |
| JS 代码报错 | 把 VBA/Office.js 语法杂糅进了 WPS JSAPI（27+ 处不兼容） | WPS JSA 与 VBA 是完全不同的 API 体系 |
| 分析数据全是假值 | skill 文档路径描述歧义导致 AI 生成 `data.data.summary` 而非 `data.summary` | skill 文档的准确性直接影响代码质量 |
| DCF 预测表单为空 | 步骤执行代码 token 被 extended thinking 消耗，输出被截短 | 复杂代码生成场景不适合开 thinking |

**核心 know-how**：系统 prompt 设计 + API 路由策略 + WPS API 兼容性，是 AI x Office 插件的三大隐性工程门槛

---

## Slide 4 · Claude Code 架构全景（四层模型）

```
┌─────────────────────────────────┐
│  Surface 层（界面接入）          │  Terminal / VS Code / Desktop / Web / iOS
├─────────────────────────────────┤
│  Extension 层（能力扩展）        │  MCP / Skills / Subagents / Hooks / Agent Teams
├─────────────────────────────────┤
│  Agentic Loop（智能内核）        │  感知上下文 → 规划 → 执行工具 → 验证结果 → 循环
├─────────────────────────────────┤
│  Context & Safety（安全基座）    │  权限分级 / Context Window 压缩 / Checkpoint 回滚
└─────────────────────────────────┘
```

**核心设计哲学**（Claude Code 官方文档原文）：
- **Surface 无关**：Session 不绑定某个入口，CLAUDE.md/Settings/MCP 全局共享
- **Unix 哲学**：可组合、可 Pipe、可脚本化，是一个工具而不是封闭产品
- **Agent SDK 开放**：允许第三方用 Claude Code 的 tools + 能力构建自己的 Agent

---

## Slide 5 · 现有产品形态定位：我们在哪里？

| 产品 | 所在层 | 形态 |
|------|--------|------|
| Claude Code Desktop | Surface 层 | 独立桌面应用，多 surface 共享引擎 |
| Claude Code VS Code | Surface 层 | 嵌入 IDE 的侧边栏 Panel |
| **我们的 WPS 插件** | **Surface 层** | **同 VS Code 插件路线，嵌入宿主应用** |
| **TinyClaw（规划中）** | **Surface 层** | **Docked 贴靠 + Embedded 嵌入双模式** |
| Cowork 底座（WPS内部） | Extension 层 | 跨组件 Orchestration 编排引擎 |

**结论：我们目前在 Surface 层，这是竞争最激烈的地方**

---

## Slide 6 · Surface 层为什么是红海

- **Anthropic 自建**：Desktop / Web / VS Code / JetBrains / iOS / Slack / Chrome
- **微软 Copilot**：深度集成 Office 全套，原生体验
- **各大厂商**：都在做 AI 侧边栏、AI 对话框、AI 助手
- **WPS Cowork**：官方投入 64 人天构建内部 Agentic 底座

**Surface 层解决的是"在哪里用"，不是"用得更好"**

> 壁垒极低，先发优势短暂，先做出来是必要条件，不是竞争壁垒

---

## Slide 7 · Extension 层：真正有壁垒的地方

```
Surface（界面）    ← 我们现在的位置，红海
     ↓
Extension 层       ← 机会所在，蓝海
  ├── MCP Server   ← 谁控制数据通道，谁有话语权
  ├── Skills       ← 谁打包了领域专家知识，谁有黏性
  ├── Subagents    ← 谁能编排复杂任务，谁有效率优势
  └── Hooks        ← 谁满足企业审计需求，谁赢得 B 端
     ↓
Agentic Loop       ← Claude 提供，不需要自建
```

---

## Slide 8 · 机会 #1 — WPS MCP Server（最大增量）

**判断依据**：

MCP 是 Claude Code 的开放协议，任何工具都可以接入。当前绝大多数 MCP Server 是开发者向的（数据库、Git、浏览器），**Office 场景几乎空白**。

**WPS 的独特优势**：

- WPS JS API 可直接读写 Sheet 结构、公式树、图表、样式
- 这是原生权限，不需要截图/OCR，直接访问结构化数据
- 微软 Copilot 无法进入，Anthropic 没有这个数据通道

**具体形态**：

```
wps://context → 当前 Sheet 结构、公式、选区数据
wps://chart   → 图表数据与配置
wps://range   → 指定单元格读写操作
wps://history → 操作历史与版本快照
```

**战略价值**：Claude Code 任意 Surface 接入后，天然理解 Office 文档上下文。把 WPS 变成 Claude Code 的"感知器官"，而不只是一个执行目标。

**竞争壁垒**：WPS 原生 JS API 权限，第三方不可复制。

---

## Slide 9 · 机会 #2 — 垂直领域 Skills 包（最短产品化路径）

**判断依据**：

Claude Code 的 Skills 是"按需注入的领域专家"。内置的都是通用开发类（/debug, /batch），**金融/商业分析场景是蓝海**。

**具体 Skill 方向**：

| Skill 名称 | 能力描述 | 目标用户 |
|-----------|---------|---------|
| DCF 分析 Skill | 财务建模规范 + 公式库 + 行业数据引用规则 | 投资分析师 |
| 投资备忘录 Skill | 结构化输出模板 + 数据核验规则 | 基金研究员 |
| 数据清洗 Skill | 表格标准化 + 异常识别逻辑 | 数据分析师 |
| 报表生成 Skill | 自动布局 + 图表推荐规则 | 财务/运营 |

**今天的实战验证**：
- DCF 分析场景跑通了 7 步完整流程，共生成 91 个 `.Formula` 公式
- Skills 文档的准确性直接决定代码质量（`data.data.summary` bug 教训）
- Skill 设计要"防御性"：预留安全网正则，自动修正 AI 的常见错误模式

**战略价值**：Skills 可以打包成 Plugin 分发，形成技能市场，是产品化最短路径。

---

## Slide 10 · 机会 #3 — 企业级 Hooks 合规层（B 端门票）

**判断依据**：

Hooks 是 Claude Code 的事件拦截机制，目前主要用于安全校验，**企业合规场景尚未被开发**。

**具体能力**：

- `PreToolUse`：AI 写表格前自动快照备份，防止误操作
- `PostToolUse`：检查生成的公式是否符合财务合规规范
- `Stop`：生成完整的 AI 操作审计日志，满足企业监管要求

**战略价值**：B 端采购决策的关键差异化因子。合规与审计是企业用 AI 工具的"必答题"。

---

## Slide 11 · 三者关系：不是竞争，是互补

```
TinyClaw（面向用户）            Cowork（面向 WPS 内部）
   Surface 层产品                Extension 层基建
        ↓                               ↓
   WPSConnector                   WPSClientModule
   （嵌入模式）                    （MCP Server + A2A）
        ↓            对接点              ↓
        └──────── OpenClaw Gateway ────────┘
                  （协议桥接层）
```

**一句话**：TinyClaw 是面向用户的产品入口，Cowork 是 WPS 内部的编排基建，两者通过 WPSConnector 自然衔接。TinyClaw 的 WPSConnector 未来可以同时实现 OpenClaw Gateway 和 MCP 双接口。

---

## Slide 12 · 今天的实战 Know-How 总结

### 工程层面

1. **Claude CLI vs Direct API 的权衡**
   - CLI：支持 tool use，prompt cache 优化，但不支持 thinking 流式，冷启动 15-30s
   - Direct API：thinking 实时流式，简单对话 2-3s，但大 prompt（30K+）反而更慢
   - **结论**：轻量对话走 Direct API，复杂步骤执行走 CLI（各有所长）

2. **WPS JSAPI vs VBA 的坑**
   - `ws.Cells(row, col)` 在 VBA 可以，WPS 需要 `ws.Cells.Item(row, col)`
   - `SeriesCollection(1)` 需要改为 `SeriesCollection.Item(1)`
   - 防御策略：在 proxy 层加代码清洗正则，作为最后一道安全网

3. **Skill 文档设计原则**
   - 变量名要与路径描述区分（避免 `data.data.X` 这类歧义）
   - 提供完整的 JSON 响应结构示例，而非只列字段名
   - 加红色警告块，明确指出禁止写法

### 产品层面

4. **Prompt Tier 分类的设计原则**
   - 在 Office 插件场景，**默认就该是 standard tier**，不是 light
   - 用户发给插件的几乎每条指令都需要操作表格，"翻译成英文"也不例外
   - 只有纯问候/纯提问才是 light

---

## Slide 13 · 机会时间表

```
近期（0-3个月）  → Skills 打磨
                   可复用、可测试、风险低
                   先做 DCF 分析 + 数据清洗两个 Skill 包

中期（3-6个月）  → WPS MCP Server 建设
                   构建护城河，锁定 WPS 原生数据通道
                   对接 Claude Code Desktop/Web

长期（6个月+）   → Hooks + Agent Teams
                   企业级合规与多代理协作
                   TinyClaw 的最终差异化战场
```

---

## Slide 14 · 核心结论

1. **Surface 层是起点，不是终点** — 插件产品先做出来，同时往下沉规划 Extension 层
2. **MCP 是最大的增量机会** — WPS 原生数据通道，独占壁垒，当前 Office 场景几乎空白
3. **Skills 是最短的产品化路径** — 打包金融领域专家知识，快速形成用户黏性
4. **Hooks 是 B 端的门票** — 合规与审计是企业采购的必答题
5. **今天踩的坑就是明天的壁垒** — WPS API 兼容、CLI/Direct API 路由、Skill 文档工程，这些复杂性本身就是护城河

> **TinyClaw 的终态**：Result as a Service，直接把结果写进用户正在用的任何应用里
> 不是"帮你用工具"，不是"给你答案"，是**直接把结果写进去**

---

## Slide 15 · 下一步行动

- [ ] 定义 WPS MCP Server 的核心接口规范（`wps://context` 优先）
- [ ] 梳理现有 WPS JS API 能力清单（可对外暴露哪些工具）
- [ ] 打磨 DCF 分析 Skill，形成可复用 Skill 包模板
- [ ] 设计 Hooks 合规方案的技术可行性评估
- [ ] 更新 TinyClaw 产品路线图，加入 MCP 优先级

---

> **Know-How 来源**
> - Claude Code 官方文档 code.claude.com/docs（完整通读）
> - Cowork Agentic 技术底座立项说明（WPS 内部）
> - WPS JS API 开发文档（客户端二次开发）
> - 今天的 WPS 插件调试实战记录（cursor_co_worker.md）
