# 开发 Agent Prompt 指南

> 给开发 Agent 的文档清单、投喂顺序、Prompt 模板

---

## 一、文档清单

| 文档 | 路径 | 作用 | 什么时候给 |
|------|------|------|-----------|
| **PRD 需求文档** | `TinyClaw_Skills_Store_需求文档_v1.md` | 完整的产品需求、技术架构、API 规格、数据模型 | **每次对话都给** (作为上下文) |
| **设计稿** | `AgentPuterLandingPage.pen` | V10 的 3 个页面设计稿 (Landing / Skills Store / Skill Detail) | **需要还原 UI 时给** |
| **跳出率分析** | `cursor_.landingpage优化_跳出率问题解决.md` | 历史讨论、GA4 数据、已有基础设施细节 | 仅在需要背景信息时参考，**不需要主动给** |

### 核心原则

```
PRD 是"圣经"——开发 Agent 的所有工作都以 PRD 为准。
设计稿是"参考"——UI 还原时对照。
历史讨论是"归档"——有疑问时查阅。
```

---

## 二、不要一次给全部，按 Phase 喂

一次给太多内容，Agent 会迷失。**按 Phase 拆分，每个 Phase 一个独立对话**。

---

## 三、Prompt 模板

### Phase 0: 紧急止血 (Day 1-3)

```
你是一个全栈开发工程师。我们的产品是 TinyClaw (tinyclaw.dev)，一个基于 OpenClaw 的 AI Agent 一键部署平台。

## 背景
当前 TinyClaw 首页跳出率 78.5%，因为用户打开页面直接看到"模型选择 + Google 登录"，完全不知道产品是什么就被要求注册。

## 当前技术栈
- Next.js 14+ (App Router) + Tailwind CSS v4
- 部署在 Vercel (tinyclaw.dev)
- 认证: Clerk (Google SSO)
- 支付: Stripe ($49.99/mo)
- Analytics: GA4 (G-VTTKDJ5SY3) + Google Ads (AW-845688835)

## 你的任务 (Phase 0 — 最小改动，不重写)

在现有 TinyClaw 首页的 /setup 流程之前，加一个 Hero 屏，让用户先了解产品再决定是否注册：

1. 新增一个 Hero Section 作为首页第一屏：
   - Headline: "deploy an AI that never logs off."
   - Subtitle: "your personal AI assistant — runs 24/7 on your own server. telegram, slack, whatsapp, email & 10+ channels."
   - 主 CTA: "Try Free — 10 Messages" (先放着，Phase 1 才实现 chat trial)
   - 次 CTA: "Deploy Your Own — $49.99/mo →" 链接到现有 /setup
   - Trust strip: "198k+ ⭐ on GitHub · self-hosted · MIT license · 10+ channels"
   
2. 确认 GA4 所有事件正常运行 (view_landing, sign_up, purchase 等)

3. 深色主题 (#09090B 背景, #FAFAFA 文字, #22C55E 高亮)，与现有设计一致

不要改动现有的 /setup 流程、Clerk 登录、Stripe 支付等。只加一个 Hero 屏。

请先阅读现有代码结构，然后告诉我你的实现计划。
```

---

### Phase 1: Chat Trial MVP (Week 1-2)

```
你是一个全栈开发工程师。请阅读附件的 PRD 文档 (TinyClaw_Skills_Store_需求文档_v1.md) 中的以下章节：
- 第 5 章: Page 1: Landing Page
- 第 8 章: 技术架构 (8.3 数据库 Schema, 8.4 API 规格)
- 第 9 章: Analytics

## 背景
TinyClaw (tinyclaw.dev) 当前跳出率 78.5%。我们的核心解决方案是在 Landing Page 嵌入一个免费 Chat Trial，让用户无需注册即可与 AI 对话，5 秒内体验产品价值。

## 你的任务 (Phase 1 — Chat Trial MVP)

### 1. Demo VPS 后端
- 在一台 Hetzner VPS (1C/512M) 上部署 OpenClaw 共享实例
- 创建 3 个 API 端点:
  - POST /api/trial/start — 开始 session (浏览器指纹识别)
  - POST /api/trial/message — 发送消息 (SSE 流式返回 AI 回复)
  - GET /api/trial/status — 查询剩余消息数
- 限制: 每用户 10 条/天, 并发上限 50 人
- 防滥用: IP rate limit 100/h + 浏览器指纹 + AI API 月度 $10 hard cap
- 异常降级: VPS 宕机时展示静态 Chat 预览

### 2. Landing Page 重写 (/)
参考 PRD 第 5.1-5.4 节的页面结构:
- Header: [> tinyclaw.dev] + nav + [deploy →]
- Hero: headline + subtitle + 输入框 + skill tags
- Chat Trial Widget: 内嵌对话框 + 消息计数器 + 预置示例对话
- Upsell: 第 8 条消息软提示, 第 10 条锁定输入框 + 展示 upsell 卡片
- Featured Skills: 4 张静态卡片 (telegram-bot, chat-with-pdf, email-manager, github-monitor)
- Trust strip + 简化 Pricing + Footer

### 3. GA4 埋点 (P0 事件)
- chat_trial_start (source)
- chat_trial_message (message_number)  
- chat_trial_limit
- upsell_shown (source)
- upsell_click
- skill_card_click (slug, position)

### 性能要求
- FCP < 1.5s
- Chat 首次回复 < 5s
- Lighthouse > 90

### 设计规范
- 深色主题: #09090B 背景, #FAFAFA 文字, #22C55E 高亮
- 字体: JetBrains Mono (标题) + IBM Plex Mono (正文) + Inter (UI)
- 移动端响应式

请先阅读现有代码结构，然后给我一个实现计划和任务拆解。
```

---

### Phase 2: Skills Store (Week 2-4)

```
你是一个全栈开发工程师。请阅读附件 PRD 的以下章节：
- 第 6 章: Skills Store (/skills)
- 第 7 章: Skill Detail (/skills/:slug)
- 第 8 章: 技术架构 (8.3 Schema, 8.4 API, 8.6 性能, 8.7 缓存)
- 第 10 章: SEO 策略
- 附录 D: 技能明细数据

## 背景
TinyClaw 已完成 Chat Trial (Phase 1)。现在需要构建 Skills Store——一个 App Store 式的 AI 技能商店，136+ 技能按分类展示，每个技能有独立的 SEO 详情页。

## 你的任务 (Phase 2 — Skills Store)

### 1. 数据库
- 按 PRD 8.3 节创建 skills, reviews, bundles, skill_installs 4 张表
- 编写 seed 脚本，从 PRD 附录 D 的数据 + GitHub repo (https://github.com/claude-office-skills/skills) 生成 136+ 条 skill 记录
- 为每个 skill 生成 3-5 条预置评论 (造数据原则见 PRD 7.3 节)

### 2. Skills Store 页面 (/skills)
参考 PRD 6.1-6.4 节:
- Hero: "Skill Store" + 描述
- Category Tabs: 20 个分类, URL query ?category= 联动
- Quick Install Bundles: 3 个预置包 (Starter/Business/DevOps)
- Skill 卡片网格: 3 列, App Store 风格, 每页 24 张
- 搜索: 客户端 fuzzy match (MVP)
- 排序: Most Popular | Highest Rated | Newest

### 3. Skill Detail 页面 (/skills/:slug)
参考 PRD 7.1-7.3 节:
- 自包含原则: 用户可能从 Google 直达, 页面必须能独立说服+转化
- Hero + Install CTA + Preview (Chat + Terminal) + What's Included + Requirements + Reviews + Related Skills
- Install 按钮暂时链接到 /setup (Phase 3 才实现真正安装逻辑)

### 4. SEO
- 136 个 skill 页面全部 SSG 预生成 (Next.js generateStaticParams)
- 每个页面: 独立 <title>, <meta description>, Schema.org SoftwareApplication
- sitemap.xml 自动生成
- Open Graph + Twitter Card meta tags

### 5. 性能
- Skills Store 首屏 < 2s
- Skill Detail < 1.5s  
- ISR revalidate: 24 hours
- Lighthouse > 90

请先规划数据库 schema 和 seed 脚本策略，然后给我实现计划。
```

---

### Phase 3: Install 流程 (Week 4-5)

```
你是一个全栈开发工程师。请阅读附件 PRD 的以下章节：
- 第 8.5 节: 安装流程状态机
- 第 8.4 节: API 规格 (Install 相关端点)

## 背景
TinyClaw 已完成 Landing Page (Chat Trial) + Skills Store (136+ 页面)。现在需要实现"一键安装"功能——用户在 Skill 卡片或详情页点击 Install，skill 自动部署到用户的 OpenClaw 实例。

## 你的任务 (Phase 3 — Install 流程)

### 安装状态机
1. 未登录 → Clerk 登录弹窗 → 登录成功后继续
2. 已登录 + 无 OpenClaw 实例 → 引导到 /setup 部署 → 部署完成后自动安装
3. 已登录 + 有 OpenClaw 实例 → 调用 OpenClaw API 安装 → 显示结果

### API 端点
- POST /api/skills/:slug/install (需 Clerk JWT)
- POST /api/bundles/:slug/install (需 Clerk JWT)

### UI 反馈
- 安装中: 按钮变为 "installing..." + spinner
- 成功: ✅ "installed! open in Telegram →"
- 失败: ❌ 错误信息 + CLI fallback "try: claw install xxx"
- 已安装: 按钮变为 "installed ✓" (灰色, 不可点击)

### GA4 事件
- skill_install_click (slug, source)
- skill_install_complete (slug, duration_ms)
- bundle_install_click (bundle_slug)

请先阅读现有的 Clerk 认证和 OpenClaw API 集成代码，然后给我实现计划。
```

---

### 让 Agent 还原设计稿 UI 的 Prompt

```
请根据设计稿 @AgentPuterLandingPage.pen 中的 V10 Landing Page (Node ID: iZxAF) 还原 UI。

使用 Pencil MCP 工具读取设计稿节点，获取：
- 布局结构 (layout, padding, gap, alignment)
- 颜色 (fill, text color, border)
- 字体 (fontFamily, fontSize, fontWeight)
- 间距和尺寸

然后转换为 Next.js + Tailwind CSS v4 代码。

注意：
1. 深色主题, 背景 #09090B
2. 所有颜色从设计稿节点读取，不要猜测
3. 移动端响应式 (桌面 3 列, 平板 2 列, 手机 1 列)
4. 字体: JetBrains Mono + IBM Plex Mono + Inter
```

---

## 四、投喂策略总结

```
Phase 0 (Day 1-3):
  给: Phase 0 Prompt (自包含, 不需要 PRD)
  目标: 加个 Hero 屏, 止血

Phase 1 (Week 1-2):
  给: Phase 1 Prompt + PRD 第 5/8/9 章
  目标: Chat Trial 上线, 跳出率 < 50%

Phase 2 (Week 2-4):
  给: Phase 2 Prompt + PRD 第 6/7/8/10 章 + 附录 D
  目标: 136 个 SEO 页面上线

Phase 3 (Week 4-5):
  给: Phase 3 Prompt + PRD 第 8.4/8.5 节
  目标: 一键安装闭环

每个 Phase 结束后:
  1. 检查验收标准 (PRD 第 13 章)
  2. 跑一次 Lighthouse
  3. 确认 GA4 事件正常
  4. 截图对比设计稿
```

---

## 五、通用指令 (每次对话都可以加在开头)

```
## 通用规范
- 代码风格: ESLint + Prettier, 2 空格缩进
- 提交: 每个功能点一个 commit, 英文 commit message
- 分支: feature/phase-{N}-{feature-name}
- 不要修改现有的认证 (Clerk)、支付 (Stripe)、Analytics (GA4) 集成
- 所有新页面必须响应式 (移动端优先)
- 深色主题: #09090B 背景, #FAFAFA 文字, #22C55E 高亮
- 字体: JetBrains Mono (标题/品牌) + IBM Plex Mono (正文) + Inter (UI)
- 性能: Lighthouse > 90, FCP < 2s
- 环境变量不要硬编码, 使用 .env.local
```
