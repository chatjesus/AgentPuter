# AgentPuter 场景子页面MVP规划
_Exported on 2026/2/8 at GMT+8 12:21:25 from Cursor (2.4.28)_

---

**User**

1. @Use Pencil mcp tools.Current file /Users/mac/Desktop/AgentPuter/docs/AgentPuterLandingPage.pen.Selected node ids: T8oAY 漏了线上https://www.agentputer.com/ blog等相关入口
2. 你看看我们之前的landingpage@Use Pencil mcp tools.Current file /Users/mac/Desktop/AgentPuter/docs/AgentPuterLandingPage.pen.Selected node ids: T8oAY ，根据我们之前讨论AgentPuter的设计，深度思考以及规划一下，后续每个场景的子页面都给我画个MVP产品设计出来（例如，feature功能）。每个页面都用一个frame展示

---

**Cursor**

🐵 好的，让我先了解当前的设计状态，然后再规划子页面。

让我尝试用正确的工具名称来访问 Pencil MCP。

🐵 抱歉，Pencil MCP 工具目前似乎没有连接上。让我确认一下工具的可用性。

🐵 我发现 **Pencil MCP 工具当前未连接**（调用时返回 "Tool not found"）。不过，我已经深入阅读了你所有的产品文档和线上网站内容，可以先做一个完整的设计规划。

---

## 当前问题分析

### 1. Landing Page 导航缺失

对比线上 https://www.agentputer.com/，你的 .pen 设计稿中缺少以下导航入口：

| 缺失项 | 线上路径 | 说明 |
|--------|---------|------|
| Features | `/features` | 功能详情页 |
| Pricing | `/pricing` | 定价页面 |
| Blog | `/blog` | 博客/文章 |
| Docs | `/docs` | 文档中心 |
| 中文切换 | 语言 toggle | 中/英切换 |
| Get Started | CTA 按钮 | 注册入口 |

---

### 2. 子页面 MVP 设计规划

基于你的 PRD、MVP_SPEC 和线上内容，以下是需要设计的子页面：

| # | 页面 | Frame 名称 | 核心内容 |
|---|------|-----------|---------|
| 1 | Features | `Features Page` | 4大痛点 → 4大解决方案 → 技术架构图 |
| 2 | Pricing | `Pricing Page` | Starter $9 / Pro $29 对比卡片 |
| 3 | Blog | `Blog Page` | 文章列表 + 封面 + 标签 |
| 4 | Docs | `Docs Page` | 左侧导航 + 右侧文档内容 |
| 5 | Dashboard | `Dashboard Page` | Pod 列表 + 创建入口 |
| 6 | Pod Detail | `Pod Detail Page` | Pod 信息 + Telegram 绑定 + VPS 信息 |

---

**请你先重新连接 Pencil MCP 工具**（检查 MCP 服务器设置），连接成功后我立即开始在 .pen 文件中创建所有子页面的 Frame 设计。

需要我先用文档的方式输出每个页面的详细线框图规格吗？还是等 Pencil MCP 连接后直接开始画？

---

**User**

先文档输出，后连接MCP开始画

---

**Cursor**

🐵 好的，我来输出一份完整的子页面设计规格文档。

🐵 设计规格文档已输出到 `/Users/mac/Desktop/AgentPuter/docs/SubPages_Design_Spec.md`。

## 总结

文档包含 **8 个 Frame** 的完整设计规格：

| 页面 | 核心内容 | 优先级 |
|------|---------|--------|
| **Nav Bar 修复** | 补齐 Features/Pricing/Blog/Docs/中文/START | P0 |
| **Features** | 4大核心能力 + 架构图 + OpenClaw集成 + 安全隐私 | P0 |
| **Pricing** | Starter $9 / Pro $29 / Enterprise 三栏对比 + FAQ | P0 |
| **Dashboard** | 统计概览 + Pod列表 + 活动日志 | P0 |
| **Pod Detail** | WebChat + Telegram + VPS信息 + AI模型 + 日志 + 危险操作 | P0 |
| **Blog** | 置顶文章 + 3列文章网格 + 标签过滤 | P1 |
| **Docs** | 左侧导航树 + 右侧文档内容 + 代码块 | P1 |
| **Telegram Setup** | 3步向导 (创建Bot → 输入Token → 配对码) | P1 |

### 设计风格统一

- **暗色终端美学** — 与线上 agentputer.com 完全一致
- **ASCII 装饰符** — `>_` `$` `//` `[*]` 等终端元素
- **Design Tokens** — 完整的色彩、字体、组件规范
- **绘制顺序** — Nav → Features → Pricing → Dashboard → Pod Detail → Blog → Docs → Telegram → Footer

等 Pencil MCP 连接后，我直接按这份规格开画。你也可以先 review 这份文档，有需要调整的随时告诉我。

