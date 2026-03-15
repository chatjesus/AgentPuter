# TinyClaw 产品需求文档 (PRD)

> **版本**: v3.0  
> **日期**: 2026-02-16  
> **Owner**: TinyClaw Team  
> **设计稿**: `AgentPuterLandingPage.pen`（Frame Node: `iZxAF`, `L3rOV`, `HsIBK`）  
> **线上地址**: https://tinyclaw.dev （当前版本）  
> **仓库**: TinyClaw (Vercel) · AgentPuter (Cloudflare Pages)

---

## 0. Executive Summary

TinyClaw 当前面临严重的获客与转化问题：**78.5% 跳出率、0.4% 整体 CVR、$49.99/mo 的定价让用户在看不到价值的情况下直接离开**。

本 PRD 定义一套完整的产品改造方案，核心策略是：

1. **Chat Trial 前置**：在 Landing Page 嵌入免费 AI 对话，让用户 5 秒内体验价值（解决跳出率）
2. **Skills Store**：构建 App Store 式的技能商店，136+ 一键可装技能（解决价值展示 + SEO 获客）
3. **数据驱动迭代**：GA4 全链路埋点 + A/B 测试（解决持续优化）

**预期成果**：跳出率 78% → <40%，CVR 0.4% → 3%+，新增 136 个 SEO 长尾落地页。

---

## 1. 问题诊断

### 1.1 数据现状

| 指标 | 数值 | 严重程度 | 数据来源 |
|------|------|---------|---------|
| TinyClaw 英语版跳出率 | **78.5%** | P0 | GA4 `G-VTTKDJ5SY3` |
| TinyClaw 非英语版跳出率 | **99-100%** | P0 | GA4 |
| 平均互动时长 | **26-43s** | P0 | GA4 |
| 整体 CVR（访客→付费） | **0.4%** (767→3) | P0 | GA4 + Clerk |
| 注册→付费流失率 | **80%** (15→3) | P1 | Clerk |
| 新用户率 | **99%** | P2 | GA4 |

### 1.2 根因分析

```
为什么用户跳出？
├── 首页直接展示 "模型选择 + 渠道选择 + Sign in with Google"
│   └── 用户不知道产品能干什么就被要求注册
├── $49.99/mo 无试用
│   └── 信任缺口：看不到效果就要掏钱
├── 非英语广告流量质量极差
│   └── 100% 跳出 = 100% 烧钱
└── 没有"下一步动作"给犹豫的用户
    └── 要么注册，要么离开，没有中间选项
```

### 1.3 解决策略

| 问题 | 策略 | 对应方案 |
|------|------|---------|
| 用户不知道产品能干什么 | **先体验后注册** | Chat Trial 内嵌首屏 |
| $49.99 门槛太高 | **免费试用降门槛** | 10 条消息免费，无需注册 |
| 不了解 AI 能力范围 | **Skills 可视化** | Skills Store + 卡片展示 |
| 非英语广告浪费 | **止血** | 立即停掉 |
| 没有低门槛"下一步" | **渐进式转化** | Trial → Skills → Deploy |
| 没有 SEO 获客 | **长尾关键词矩阵** | 136 个 skill 详情页 |

---

## 2. 设计演进（共 10 版迭代的核心教训）

> 完整设计演进记录在 `AgentPuterLandingPage.pen` 中，此处只提炼关键教训。

| 版本 | 核心尝试 | 失败原因 | 教训 |
|------|---------|---------|------|
| V1-V3 | 传统 SaaS 落地页 | CTA 藏太深，用户看不到产品 | 工具型产品必须"先体验后注册" |
| V2 优化 | Telegram Demo Bot | 用户跳出网站去 Telegram | 试用体验必须留在站内 |
| V3 | `/try` 独立 Chat 页 | 需要 3 步才能开始试用 | 步骤越少越好 |
| V4 | Chat 嵌入首屏 | Chat 空白，用户不知道问什么 | 需要预置对话展示能力 |
| V5 | Input-First + Skills | Skills 只是文字标签 | Skills 需要可视化输出预览 |
| V6 | 场景叙事 + 信任堆砌 | 好营销页但差转化机器 | 首屏 = 交互入口，fold 下 = 说服层 |
| V7 | Skills-First (Pollo.ai) | Skill 卡片还是文字描述 | 要展示结果，不展示功能描述 |
| V8 | Skills as Apps (输出预览) | Skill 内容没对准真实痛点 | 需要对照真实用户案例 |
| V9 | Skills Store 单页 | 一个页面承载太多 | 拆分：Chat Trial + Skills Store |
| **V10** | **两页策略 + 详情页** | **✅ 最终方案** | Chat Trial 和 Skills Store 各自专注 |

**6 条核心设计原则**：

| # | 原则 | 反面教材 |
|---|------|---------|
| 1 | **先体验后注册** | V1 要求先留邮箱等邀请码 |
| 2 | **零步骤开始** | V3 需要 3 步才能试用 |
| 3 | **展示结果不展示功能** | V5/V7 只有文字描述 |
| 4 | **Skills 即产品** | V6 把 Skills 当辅助说明 |
| 5 | **留在站内** | V2 把用户送去 Telegram |
| 6 | **首屏交互，fold 下说服** | V6 把交互推到最下面 |

---

## 3. 产品定位 & 用户画像

### 3.1 一句话定位
```
TinyClaw = OpenClaw 的 App Store
部署 AI → 安装 Skills → 技能即时生效
```

### 3.2 用户画像

| 画像 | 典型特征 | 痛点 | 决策关键 | 来源渠道 |
|------|---------|------|---------|---------|
| **Alex (Indie Hacker)** | 独立开发者，1 人公司，需要 AI 自动化日常 | 手动处理邮件/客服/社媒太耗时间 | 能否 5 分钟跑起来？自托管？ | Google 搜索 "self-hosted AI assistant" |
| **Sarah (小团队 Lead)** | 3-5 人团队，需要多渠道客户沟通 | Telegram + WhatsApp + Email 消息四处分散 | 支持多少渠道？团队能否共用？ | Google Ads |
| **Marco (技术型用户)** | 开发者，注重隐私和控制权 | 不信任 SaaS，想自建但没时间 | 开源？数据归属？能否定制？ | GitHub / Hacker News |

### 3.3 用户状态机

```
[匿名访客] ─── 打开首页 ──→ [Chat Trial 用户]
                                 │
                           发送 10 条消息
                                 │
                                 ▼
                          [Upsell 触达用户]
                           /            \
                    点击 Deploy      浏览 Skills
                         │                │
                         ▼                ▼
                   [注册用户]      [Skills Store 访客]
                         │                │
                    完成付费          点击 Install
                         │                │
                         ▼                ▼
                   [付费用户] ←──── 引导部署
                         │
                    安装 Skills
                         │
                         ▼
                   [活跃用户] ──→ [可能流失] ──→ 再营销
```

---

## 4. 页面架构

### 4.1 信息架构

```
tinyclaw.dev/
├── /                        Landing Page (Chat Trial + Skills 入口)
├── /skills                  Skills Store (App Store 式列表)
│   ├── /skills/telegram-bot Skill Detail (136+ 独立页面)
│   ├── /skills/chat-with-pdf
│   └── ...
├── /setup                   部署流程 (现有，模型/渠道/Google登录)
├── /pricing                 定价页 (可选，MVP 可先内嵌)
└── /docs                    文档 (可选，后期)
```

### 4.2 用户流量入口矩阵

| 入口 | 落地页 | 用户意图 | 转化路径 |
|------|--------|---------|---------|
| Google Ads | `/` | "AI assistant" 泛需求 | Chat Trial → Deploy |
| SEO 长尾 | `/skills/:slug` | "AI telegram bot" 精准需求 | Skill Detail → Install → Deploy |
| GitHub | `/skills` | 开源用户浏览能力 | Skills Store → Install → Deploy |
| 口碑/社交 | `/` | 好奇尝试 | Chat Trial → Skills → Deploy |
| 再营销 | `/skills` | 曾经试用过的流失用户 | Skills Store → Deploy |

**关键洞察**：`/skills/:slug` 是最重要的 SEO 入口。从 Google 直接进入 skill 详情页的用户从未见过 Landing Page，因此**每个详情页必须自包含**（能独立说服 + 独立转化）。

### 4.3 设计稿对应关系

| 页面 | 设计稿 Frame | Node ID | 宽度 |
|------|-------------|---------|------|
| Landing Page | `V10 — Landing Page (Chat + Skills Entry)` | `iZxAF` | 1440px |
| Skills Store | `V10 — Skills Tools Page (/skills) SEO` | `L3rOV` | 1440px |
| Skill Detail | `V10 — Skill Detail Page (/skills/telegram-bot)` | `HsIBK` | 900px |

---

## 5. Page 1: Landing Page (`/`)

> **核心任务**：解决 78.5% 跳出率，5 秒内让用户开始互动

### 5.1 页面结构

```
┌──────────────────────────────────────────────────────┐
│ Header                                                │
│ [> tinyclaw.dev]  chat | skills 136+⚡ | pricing      │
│                                          [deploy →]   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  "deploy an AI that never logs off."                  │
│  type anything below — 10 free messages, no sign-up   │
│                                                       │
│  ┌────────────────────────────────────────┐           │
│  │ $ try it — ask your AI anything... [→] │  ← 输入框 │
│  └────────────────────────────────────────┘           │
│  telegram | github | email | slack | 136+ more →      │
│                                                       │
│  ┌────────────────────────────────────────┐           │
│  │ 💬 Chat Trial Widget                   │           │
│  │ (预置示例对话 + 实时 AI 回复)           │           │
│  │                                        │           │
│  │ 8/10 messages · Powered by OpenClaw    │           │
│  └────────────────────────────────────────┘           │
│                                                       │
├─── fold ─────────────────────────────────────────────┤
│                                                       │
│  Featured Skills (4 张 App Store 风格卡片)             │
│  [browse all 136+ skills →]                           │
│                                                       │
│  198k+ ⭐ · self-hosted · MIT · 10+ channels          │
│                                                       │
│  Free: 10 messages | Pro: $49.99/mo ($15 AI credits)  │
│                                                       │
│  Footer                                               │
└──────────────────────────────────────────────────────┘
```

### 5.2 Chat Trial 规格

| 参数 | 值 | 说明 |
|------|-----|------|
| 免费消息数 | **10 条/天** | 足够感受价值，不够日常使用 |
| 是否需要注册 | **否** | 零门槛，浏览器指纹识别身份 |
| 响应时间 SLA | **< 5 秒** | 超时显示 "thinking..." 动画 |
| 并发用户上限 | **50 人** | 超限显示排队提示 |
| 每日重置 | **是** | 次日 UTC 0:00 重置消息配额 |
| Session 持久化 | **24 小时** | localStorage 存 session_id |
| 预置对话 | **1 轮示例** | 展示跨 skill 编排能力 |

**Upsell 触发**：
- 第 8 条消息：底部提示 "2 messages left · deploy your own for unlimited"
- 第 10 条消息：替换输入框为 upsell 卡片
- 次日回访：恢复 10 条配额 + 提示 "welcome back! deploy for unlimited"

### 5.3 关键交互流

```
1. 用户打开 / → 看到 Hero + 输入框
2. 输入框 focus 或点击 skill tag → 触发 chat_trial_start 事件
3. 用户发送消息 → POST /api/trial/message → 返回 AI 回复
4. 消息计数递减 → 第 8 条显示软提示
5. 第 10 条 → 输入框锁定 → 展示 upsell 卡片
6. 点击 "Deploy Your Own" → 跳转 /setup（现有流程不变）
7. 点击 "136+ more" → 跳转 /skills
8. 点击具体 skill tag → 跳转 /skills/:slug
```

### 5.4 异常处理

| 场景 | 处理方式 |
|------|---------|
| Demo VPS 宕机 | 展示静态 Chat 预览 + "AI is busy, try again in a minute" |
| 并发超限 | "Our demo is popular! ~2 min wait" + 展示 Skills Store 入口 |
| AI 响应超时 (>10s) | "thinking..." 动画 + 15s 后 fallback 通用回复 |
| 浏览器不支持指纹 | 降级为 IP + User-Agent hash |
| 用户清除 localStorage | 重新分配 session，消息计数从 0 开始 |
| 恶意刷消息 | IP 维度 rate limit: 100 次/小时 |

---

## 6. Page 2: Skills Store (`/skills`)

> **核心任务**：SEO 获客 + 展示 136+ 技能全貌 + 一键安装体验

### 6.1 页面结构

```
Header:  [tinyclaw / skills]  [⭐ GitHub · 136+ skills]  [search...]  [deploy]
Hero:    "Skill Store" — 136+ ready-to-install AI skills
Tabs:    all | messaging | data | devops | legal | pdf | hr | finance | ...
Bundles: Starter Pack | Business Pack | DevOps Pack
Grid:    3 列 App Store 风格卡片 (分页，每页 24 张)
CTA:     [deploy & install all 136+ skills →]
Footer:  SEO 关键词 + tinyclaw.dev/skills 说明
```

### 6.2 Skill 卡片规格

```
┌─────────────────────────┐
│ [#22C55E 色条] 📱 名称   │ ← 分类对应色调
├─────────────────────────┤
│ 1-2 行描述               │
│                          │
│ ⭐ 4.8 (126) · 4.2k     │
│              [install →] │
└─────────────────────────┘
宽度: ~400px (3 列适应 1440px 容器)
高度: ~180px
```

### 6.3 Quick Install Bundles

| Bundle | 技能 | 安装量 | 色彩 |
|--------|------|--------|------|
| **Starter Pack** | telegram-bot · morning-briefing · email-manager · github-monitor · cron-tasks · web-scraper | 12k+ | 绿色高亮 |
| **Business Pack** | whatsapp · crm · lead-research · invoice · email-marketing · customer-success · slack · intercom | 8k+ | 默认 |
| **DevOps Pack** | github-monitor · cicd-notifier · uptime-monitor · devops-automation · security-monitoring · changelog · browser-automation | 6k+ | 默认 |

### 6.4 搜索 & 筛选

- **搜索**：技能名 + 描述全文搜索（实现: 客户端 fuzzy match for MVP，后期迁移 pg_trgm 或 Algolia）
- **分类筛选**：URL query `?category=messaging`，支持浏览器前进后退
- **排序**：Most Popular (默认) | Highest Rated | Newest
- **分页**：每页 24 张卡片，infinite scroll 或 "Load More" 按钮

### 6.5 完整技能清单（20 个分类，136+ 技能）

> 数据源: [claude-office-skills/skills](https://github.com/claude-office-skills/skills)

| # | 分类 | 技能数 | 精选技能（前 3） |
|---|------|--------|----------------|
| 1 | 💬 Messaging | 6 | telegram-bot, whatsapp-automation, slack-workflows |
| 2 | ⚖️ Legal | 4 | contract-review, nda-generator, contract-template |
| 3 | 💼 HR | 5 | resume-tailor, cover-letter, job-description |
| 4 | 📄 PDF | 7 | chat-with-pdf, pdf-converter, pdf-ocr |
| 5 | 💰 Finance | 11 | invoice-generator, stock-analysis, dcf-valuation |
| 6 | 📈 Marketing | 10 | google-ads-manager, seo-optimizer, facebook-ads |
| 7 | 📋 Project Mgmt | 8 | jira-automation, notion-automation, asana |
| 8 | ⚡ Productivity | 5 | meeting-notes, weekly-report, file-organizer |
| 9 | 🔗 Workflow | 7 | n8n-workflow, mcp-hub, browser-automation |
| 10 | 🛒 E-commerce | 3 | shopify-automation, woocommerce, amazon-seller |
| 11 | 📊 Data | 5 | etl-pipeline, sheets-automation, gmail-workflows |
| 12 | 🔬 Research | 5 | deep-research, web-search, competitive-analysis |
| 13 | 📂 Documents | 15 | docx/xlsx/pptx, smart-ocr, template-engine |
| 14 | 🎨 Creative | 8 | image-generation, diagram-creator, chart-designer |
| 15 | 🏠 Smart Home | 4 | home-assistant, spotify, weather, apple-shortcuts |
| 16 | 🔧 DevOps | 2 | devops-automation, security-monitoring |
| 17 | 🤖 AI Agents | 2 | ai-agent-builder, obsidian-automation |
| 18 | 🎧 Support | 2 | zendesk-automation, intercom-automation |
| 19 | 🎬 Media | 3 | youtube, podcast, transcription |
| 20 | 🤝 CRM | 4 | crm-automation, pipedrive, lead-routing, customer-success |

> 完整技能明细（含描述、评分、安装量）见附录 D。

---

## 7. Page 3: Skill Detail (`/skills/:slug`)

> **核心任务**：SEO 落地页 + 独立说服 + 独立转化（用户可能从搜索引擎直接进入）

### 7.1 自包含原则

因为用户可能从 Google 搜索直接进入 `/skills/telegram-bot` 而从未见过 Landing Page，所以**每个 Skill Detail 页面必须自包含**：

- 能独立解释"这是什么"
- 能独立展示"效果如何"（Chat Preview + Terminal Preview）
- 能独立转化（Install CTA + Deploy 引导）
- 有返回 Skills Store 的路径

### 7.2 页面结构

```
Header:  [← back to skills]  [⭐ GitHub]  [install to my OpenClaw →]

Hero:    📱 Telegram Personal Bot [v1.2.0] [messaging]
         by tinyclaw community · MIT · updated 3 days ago
         (描述) Deploy a personal Telegram bot powered by AI...
         ⭐ 4.8 (126) · 4,217 installs · view source on GitHub →

Install: [install to my OpenClaw →]  or: claw install telegram-bot

Preview: 💬 Chat Example    |    ⚡ Terminal Output
         (对话模拟)          |    (安装过程模拟)

What's Included: 4 张功能卡片 (Smart Replies / Reminders / Lookups / Privacy)

Requirements: OpenClaw v0.8+ · Telegram Bot Token · Node.js 18+

Reviews: 4.8 ⭐ 分布柱状图 + 3 条用户评论

Related: 3 张同分类推荐卡片

Footer:  tinyclaw.dev/skills/telegram-bot
```

### 7.3 评论系统

**Phase 1 (MVP)**：预置 3-5 条造数据评论，只读展示
**Phase 2**：真实评论系统

| 属性 | 规格 |
|------|------|
| 评分范围 | 1-5 星 |
| 评论长度 | 10-500 字符 |
| 需要登录 | 是（Clerk） |
| 每用户每 skill | 最多 1 条评论 |
| 审核机制 | 发布后可见，后台人工审核 + 自动垃圾过滤 |
| 排序 | Most Helpful (默认) / Newest |
| Helpful 投票 | 登录用户可投票，每人每评论 1 票 |

**造数据原则**：
- 评分区间 3.8 - 4.9（不要全是 5.0）
- 评论数与安装量成比例（安装量 4k → 评论 100-150 条）
- 差评占比 5-10%，内容提建设性建议（如 "would love calendar integration"）
- 用户名格式：`username_xx` 或 `first_last`，不要太假

---

## 8. 技术架构

### 8.1 系统架构

```
                    ┌──────────────┐
                    │  Cloudflare  │
                    │    CDN/DNS   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Vercel   │ │ CF Pages │ │ Demo VPS │
        │ Next.js  │ │ AgentPuter│ │ OpenClaw │
        │ (主站)   │ │ (Landing) │ │ (Trial)  │
        └────┬─────┘ └──────────┘ └────┬─────┘
             │                          │
        ┌────┴─────┐              ┌─────┴────┐
        │ Neon     │              │ AI API   │
        │ Postgres │              │ (Claude/ │
        │ (Skills, │              │  OpenAI) │
        │ Reviews) │              └──────────┘
        └──────────┘
             │
        ┌────┴─────┐
        │ Clerk    │
        │ (Auth)   │
        └──────────┘
```

### 8.2 技术栈

| 层 | 技术 | 状态 | 决策理由 |
|----|------|------|---------|
| Framework | Next.js 14+ (App Router) | 现有 | SSR/SSG + SEO |
| Styling | Tailwind CSS v4 | 现有 | 已有设计体系 |
| Hosting | Vercel (TinyClaw) | 现有 | Edge Runtime + ISR |
| Hosting | Cloudflare Pages (AgentPuter) | 现有 | 已配置 |
| Auth | Clerk | 现有 | Google SSO 已接入 |
| Database | PostgreSQL (Neon) | 现有 | Serverless Postgres |
| KV | Cloudflare KV | 现有 | 邮箱收集已配 |
| Payment | Stripe | 现有 | $49.99/mo SKU |
| Analytics | GA4 + Google Ads | 现有 | 已埋点 |
| Chat Trial | OpenClaw on Hetzner VPS | **新增** | 共享隔离实例 |
| Search | 客户端 fuzzy match (MVP) | **新增** | 后期迁移 Algolia |

### 8.3 数据库 Schema

```sql
-- ==========================================
-- Skills 表（核心）
-- ==========================================
CREATE TABLE skills (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(100) UNIQUE NOT NULL,     -- URL slug
  name            VARCHAR(200) NOT NULL,
  description     TEXT NOT NULL,
  long_description TEXT,                             -- 详情页用
  category        VARCHAR(50) NOT NULL,
  icon            VARCHAR(10) NOT NULL,              -- emoji
  accent_color    VARCHAR(7),                        -- 卡片色条 hex
  version         VARCHAR(20) DEFAULT '1.0.0',
  author          VARCHAR(100) DEFAULT 'tinyclaw community',
  license         VARCHAR(50) DEFAULT 'MIT',
  github_url      VARCHAR(500),
  
  -- 统计
  install_count   INTEGER DEFAULT 0,
  rating_avg      DECIMAL(2,1) DEFAULT 0.0,
  rating_count    INTEGER DEFAULT 0,
  
  -- SEO
  meta_title       VARCHAR(200),
  meta_description VARCHAR(500),
  keywords         TEXT[],
  
  -- 详情页内容 (JSONB)
  features         JSONB,              -- [{icon, title, description}]
  requirements     TEXT[],
  preview_chat     JSONB,              -- [{role: "user"|"bot", content}]
  preview_terminal TEXT[],             -- ["$ claw install ...", "✓ done"]
  
  -- 排序 & 管理
  sort_order       INTEGER DEFAULT 0,  -- 手动排序权重
  is_featured      BOOLEAN DEFAULT FALSE,
  is_published     BOOLEAN DEFAULT TRUE,
  
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_slug ON skills(slug);
CREATE INDEX idx_skills_featured ON skills(is_featured) WHERE is_featured = true;

-- ==========================================
-- Reviews 表
-- ==========================================
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id      UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  user_id       VARCHAR(200),           -- Clerk user ID (nullable for seeded)
  username      VARCHAR(100) NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content       TEXT NOT NULL CHECK (char_length(content) >= 10),
  helpful_count INTEGER DEFAULT 0,
  is_seeded     BOOLEAN DEFAULT FALSE,
  is_approved   BOOLEAN DEFAULT TRUE,   -- 后期审核用
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(skill_id, user_id)             -- 每用户每 skill 一条评论
);

CREATE INDEX idx_reviews_skill ON reviews(skill_id);

-- ==========================================
-- Bundles 表
-- ==========================================
CREATE TABLE bundles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(100) UNIQUE NOT NULL,
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  icon          VARCHAR(10),
  skill_slugs   VARCHAR(100)[] NOT NULL, -- 引用 skill slugs
  install_count INTEGER DEFAULT 0,
  is_featured   BOOLEAN DEFAULT FALSE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Chat Trial Sessions 表
-- ==========================================
CREATE TABLE trial_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint   VARCHAR(200) NOT NULL,
  ip_address    INET,
  user_agent    TEXT,
  messages_used INTEGER DEFAULT 0,
  max_messages  INTEGER DEFAULT 10,
  last_message_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  
  UNIQUE(fingerprint)
);

CREATE INDEX idx_trial_fingerprint ON trial_sessions(fingerprint);

-- ==========================================
-- Skill Installs 表（追踪安装记录）
-- ==========================================
CREATE TABLE skill_installs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id    UUID NOT NULL REFERENCES skills(id),
  user_id     VARCHAR(200) NOT NULL,     -- Clerk user ID
  source      VARCHAR(50),               -- 'card' | 'detail' | 'bundle' | 'cli'
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(skill_id, user_id)
);
```

### 8.4 API 规格

#### Chat Trial

```
POST /api/trial/start
  Request:  { fingerprint: string }
  Response: { session_id: string, messages_remaining: number }
  Error:    429 (rate limit) | 503 (VPS 超载)

POST /api/trial/message
  Request:  { session_id: string, message: string }
  Response: { reply: string, messages_remaining: number }
  Error:    402 (配额用完，返回 upsell 信息) | 503 (AI 超时)
  Notes:    使用 SSE (Server-Sent Events) 流式返回 AI 回复

GET /api/trial/status
  Request:  { session_id: string }
  Response: { messages_used: number, messages_remaining: number, expires_at: string }
```

#### Skills Store

```
GET /api/skills?category=messaging&search=telegram&sort=popular&page=1&limit=24
  Response: { skills: Skill[], total: number, page: number, pages: number }

GET /api/skills/:slug
  Response: { skill: SkillDetail, related: Skill[] }
  Error:    404

GET /api/skills/:slug/reviews?sort=helpful&page=1&limit=10
  Response: { reviews: Review[], total: number, rating_distribution: {1:n,2:n,...} }

POST /api/skills/:slug/install   (需认证 - Clerk JWT)
  Response: { success: boolean, install_command: string }
  Error:    401 (未登录) | 409 (已安装)

POST /api/skills/:slug/reviews   (需认证 - Clerk JWT)
  Request:  { rating: number, content: string }
  Response: { review: Review }
  Error:    401 | 409 (已评论) | 422 (验证失败)

POST /api/skills/:slug/reviews/:id/helpful  (需认证)
  Response: { helpful_count: number }

GET /api/bundles
  Response: { bundles: Bundle[] }

POST /api/bundles/:slug/install  (需认证)
  Response: { success: boolean, installed_skills: string[] }

GET /api/categories
  Response: { categories: { slug: string, name: string, icon: string, count: number }[] }
```

### 8.5 安装流程状态机

```
[点击 Install]
    │
    ├─ 未登录? ──→ Clerk 登录弹窗 ──→ 登录成功 ──→ 继续
    │
    ├─ 已登录 + 无 OpenClaw ──→ 引导 /setup 部署
    │                              └─→ 部署完成 ──→ 自动安装 skill
    │
    └─ 已登录 + 有 OpenClaw ──→ 调用 OpenClaw API
                                    │
                                    ├─→ 成功: 展示 ✅ + "installed! open in Telegram →"
                                    │
                                    └─→ 失败: 展示 ❌ + 错误信息 + "try CLI: claw install xxx"
```

### 8.6 性能要求

| 指标 | 目标 | 降级方案 |
|------|------|---------|
| Landing Page FCP | < 1.5s | 静态 Shell + 异步加载 Chat |
| Skills Store 首屏 | < 2s | SSG 预生成 + ISR 24h |
| Skill Detail 页 | < 1.5s | SSG 预生成所有 136 页 |
| Chat Trial 首次回复 | < 5s | "thinking..." 动画 |
| Search 响应 | < 200ms | 客户端 fuzzy match |
| Lighthouse 分数 | > 90 | SEO + Performance + A11y |

### 8.7 缓存策略

| 数据 | 缓存方式 | TTL | 失效策略 |
|------|---------|-----|---------|
| Skills 列表 | ISR (Next.js) | 24 hours | 手动 revalidate |
| Skill 详情 | SSG at build | build time | revalidate on deploy |
| Reviews | CSR + SWR | 5 min | 提交评论后 mutate |
| Categories | SSG | build time | 随 skills 变更 |
| Trial Session | Server-side | 24 hours | 过期自动清理 |

---

## 9. Analytics & 数据追踪

### 9.1 已有基础设施

| 服务 | ID | 用途 |
|------|-----|------|
| GA4 (TinyClaw) | `G-VTTKDJ5SY3` | 用户行为追踪 |
| GA4 (AgentPuter) | `G-9M2T6GQJ0L` | AgentPuter 站数据 |
| Google Ads 主账户 | `AW-845688835` | Campaign + 转化 |
| Google Ads 原始 | `AW-16955498656` | 旧广告追踪 |
| Ads 转化标签 | `AW-845688835/4qn1CNuV3PgbEIPgoJMD` | Purchase 转化信号 |

### 9.2 已有漏斗事件
```
view_landing → sign_up → select_model → click_deploy → begin_checkout → purchase → deploy_complete
```

### 9.3 新增事件（全量）

| 事件 | 触发点 | 参数 | 优先级 |
|------|--------|------|--------|
| `chat_trial_start` | 首次发消息 | source, fingerprint | P0 |
| `chat_trial_message` | 每条消息 | message_number (1-10) | P0 |
| `chat_trial_limit` | 用完 10 条 | — | P0 |
| `upsell_shown` | 展示 upsell | source (chat/skill) | P0 |
| `upsell_click` | 点击 upsell | — | P0 |
| `skill_view` | 查看详情 | slug, category, source | P0 |
| `skill_install_click` | 点击 install | slug, source | P0 |
| `skill_install_complete` | 安装成功 | slug, duration_ms | P1 |
| `bundle_install_click` | 点击 bundle | bundle_slug | P1 |
| `skill_search` | 搜索 | search_term, results_count | P1 |
| `category_filter` | 切换分类 | category | P2 |
| `review_submit` | 提交评论 | slug, rating | P2 |
| `skill_card_click` | 点击 skill 卡片 | slug, position | P2 |

### 9.4 核心漏斗 & 目标

```
① Visit → Chat Trial Start      目标: 40%+    (当前: ~0%)
② Chat Start → 5+ Messages      目标: 60%+    (新指标)
③ Chat → Hit Limit               目标: 50%+    (新指标)
④ Upsell Shown → Deploy Click    目标: 20%+    (新指标)
⑤ Deploy Click → Sign Up         目标: 60%+    (当前: ~2%)
⑥ Sign Up → Purchase             目标: 50%+    (当前: 20%)
⑦ Purchase → Deploy Complete     目标: 70%+    (当前: 未知)
```

**整体目标**：访客 → 付费 CVR 从 **0.4% → 3%+**

### 9.5 Google Ads 待办

- [ ] **P0**: 立即停掉非英语 Campaign（省预算）
- [ ] **P1**: 新增 `chat_trial_limit` 作为 Ads 转化信号（微转化）
- [ ] **P1**: 创建再营销受众：`chat_trial_limit = true` AND `purchase != true`
- [ ] **P2**: Skills Store 页面 install 事件作为 Ads 信号

---

## 10. SEO 策略

### 10.1 URL + Meta 规范

| 页面 | URL | Title 模板 | Description 模板 |
|------|-----|-----------|----------------|
| Landing | `/` | `TinyClaw — Deploy an AI That Never Logs Off` | `136+ AI skills, self-hosted, always on. Try free.` |
| Skills Store | `/skills` | `AI Skill Store — 136+ One-Click Install Skills \| TinyClaw` | `Browse 136+ ready-to-install AI skills...` |
| Skill Detail | `/skills/:slug` | `{name} — {category} AI Tool \| TinyClaw Skills` | `{description}. Self-hosted, open source. One-click install.` |

### 10.2 每个 Skill Detail 的结构化数据

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Telegram Personal Bot",
  "applicationCategory": "AI Tool",
  "operatingSystem": "Linux",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "126"
  }
}
```

### 10.3 目标关键词

| 关键词 | 页面 | 意图 | 月搜索量(估) |
|--------|------|------|-------------|
| self-hosted AI assistant | `/` | 购买 | 2.4k |
| n8n alternative | `/skills` | 比较 | 3.1k |
| AI telegram bot | `/skills/telegram-bot` | 使用 | 1.2k |
| PDF OCR tool | `/skills/pdf-ocr` | 使用 | 2.2k |
| AI web scraper | `/skills/web-scraper` | 使用 | 1.8k |
| AI invoice generator | `/skills/invoice-generator` | 使用 | 900 |
| open source contract review | `/skills/contract-review` | 使用 | 800 |

### 10.4 Sitemap 策略

- 自动生成 `sitemap.xml`，包含所有 `/skills/:slug` 页面
- `priority`: `/` = 1.0, `/skills` = 0.9, `/skills/:slug` = 0.8
- `changefreq`: skills 页 = weekly, listing = daily
- 提交 Google Search Console

---

## 11. 风险 & 应对

| 风险 | 概率 | 影响 | 应对 |
|------|------|------|------|
| **Chat Trial 被滥用** (刷消息、爬虫) | 高 | 成本飙升 | 指纹 + IP rate limit + AI API 月度 $10 hard cap |
| **Demo VPS 宕机** | 中 | 首页核心功能失效 | 静态 Chat 预览降级 + Uptime 监控告警 |
| **Chat Trial 体验差** (AI 回复质量低) | 中 | 转化率不升反降 | 精调 system prompt + 预置高质量首轮对话 |
| **136 个 SEO 页面内容雷同** | 中 | Google 低质量判定 | 每个 skill 独特描述 + 预览 + 评论差异化 |
| **Install 流程断裂** (OpenClaw API 故障) | 中 | 安装失败体验差 | 显示 CLI fallback 命令 + 错误日志上报 |
| **造数据被识破** | 低 | 信任受损 | 数据合理化 (评分区间 3.8-4.9，差评占 5-10%) |
| **Clerk 登录流程阻断** | 低 | 注册转化断裂 | 社交登录 (Google) 一键 + fallback email |

---

## 12. 开发计划

### Phase 0: 紧急止血 (Day 1-3)

> **目标**: 不写代码，立即减少浪费
> **验收**: 非英语广告已停，广告预算仅投英语版

| 任务 | 负责 | 产出 |
|------|------|------|
| 停掉非英语 Google Ads Campaign | 运营 | 广告后台截图确认 |
| Landing Page 加一屏 Hero 文案（在 /setup 前） | 开发 | 部署上线 |
| 确认 GA4 事件全部跑通 | 开发 | GA4 实时报表截图 |

### Phase 1: Chat Trial MVP (Week 1-2)

> **目标**: 从根本上解决跳出率
> **验收**: 跳出率 < 50%，Chat Trial 开始率 > 30%
> **Go/No-Go**: 如果 Week 2 跳出率没有显著改善 → 回退，重新评估 Chat Trial 方案

| 任务 | 估时 | 依赖 | 产出 |
|------|------|------|------|
| Demo VPS 搭建 + OpenClaw 配置 | 1d | 无 | VPS 在线 + Bot 可对话 |
| Chat Trial 后端 API (3 个端点) | 2d | VPS | API 可用 |
| Landing Page 重写 (Hero + Chat Widget) | 3d | API | 页面可交互 |
| Upsell 组件 (第 8 条提示 + 第 10 条锁定) | 1d | Chat Widget | upsell 触发正常 |
| Featured Skills 卡片 (静态数据) | 1d | 无 | 4 张卡片可见 |
| GA4 新事件埋点 (6 个 P0 事件) | 0.5d | 页面完成 | 事件触发可见 |
| 性能优化 + Lighthouse 验收 | 0.5d | 全部完成 | 分数 > 90 |

### Phase 2: Skills Store (Week 2-4)

> **目标**: 136 个 SEO 落地页上线
> **验收**: 所有 skill 页面可访问，搜索/筛选可用，Google 开始索引

| 任务 | 估时 | 依赖 | 产出 |
|------|------|------|------|
| 数据库 Schema 创建 | 0.5d | 无 | 表已建 |
| Seed 脚本 (136+ skills + 评论 + bundles) | 2d | Schema | 数据已入库 |
| Skills Store `/skills` 页面 | 3d | Seed | 页面上线 |
| Category Tabs + 搜索 + 排序 | 1d | Store 页面 | 筛选可用 |
| Quick Install Bundles 区域 | 1d | Store 页面 | 3 个 bundle 可见 |
| Skill Detail `/skills/:slug` 页面 | 3d | Seed | 详情页上线 |
| Reviews 区域 (只读，预置数据) | 1d | Detail 页面 | 评论可见 |
| Related Skills 推荐 | 0.5d | Detail 页面 | 推荐可见 |
| Sitemap + Schema.org + OG tags | 1d | 全部页面 | SEO 就绪 |

### Phase 3: Install 流程 + Auth (Week 4-5)

> **目标**: 完成从"浏览"到"安装"的闭环
> **验收**: 登录用户可一键安装 skill

| 任务 | 估时 | 依赖 |
|------|------|------|
| Install 按钮逻辑 (Auth gate + API 调用) | 2d | Phase 2 |
| Clerk 登录弹窗集成 (skill detail 页内) | 1d | Clerk |
| Install 成功/失败 UI 反馈 | 1d | Install API |
| Bundle 安装逻辑 | 1d | Install |
| CLI 安装文档 + `claw install` 命令 | 1d | OpenClaw |

### Phase 4: 数据驱动优化 (Week 5-7)

> **目标**: 基于真实数据持续迭代
> **验收**: 转化漏斗每步数据可见，A/B 测试框架可用

| 任务 | 估时 | 依赖 |
|------|------|------|
| GA4 全量事件埋点 (P1 + P2 事件) | 1d | Phase 2 |
| Google Ads 转化信号更新 | 0.5d | GA4 |
| 再营销 Campaign 配置 | 0.5d | Ads |
| A/B 测试框架 (Vercel Edge Config + GA4) | 2d | 全部 |
| 评论提交系统 (需登录) | 2d | Clerk |
| 评论审核 + Helpful 投票 | 1d | 评论系统 |
| 性能监控 + 告警 | 1d | 全部 |

### Phase 5: 增长飞轮 (Week 7+)

| 任务 | 优先级 |
|------|--------|
| GitHub repo → Skills 数据自动同步 | P1 |
| 移动端响应式优化 | P1 |
| i18n 国际化 (中文优先) | P2 |
| 用户自定义 Skill 发布 (社区贡献) | P2 |
| 个性化 Skill 推荐算法 | P3 |

---

## 13. KPIs & 验收标准

### 13.1 跳出率优化（核心战役）

| 指标 | 当前 | Phase 0 | Phase 1 | Phase 2+ | 长期 |
|------|------|---------|---------|----------|------|
| 英语版跳出率 | 78.5% | ~65% | **<50%** | <40% | <30% |
| 平均互动时长 | 26s | ~35s | **>60s** | >90s | >120s |
| 整体 CVR | 0.4% | ~1% | **>2%** | >3% | >5% |

### 13.2 Chat Trial 指标

| 指标 | 目标 | 说明 |
|------|------|------|
| Trial 开始率 | > 40% | 访客 → 发送第 1 条消息 |
| 5+ 消息率 | > 60% | 开始 → 发送 5 条以上 |
| 用完率 | > 50% | 开始 → 用完 10 条 |
| Upsell 点击率 | > 20% | 看到 upsell → 点击 Deploy |

### 13.3 Skills Store 指标

| 指标 | 目标 | 说明 |
|------|------|------|
| Store 访问率 | > 25% | 从 Landing Page 进入 |
| Skill 详情查看率 | > 60% | Store → 查看 ≥1 个详情 |
| Install 点击率 | > 30% | 详情 → 点击 Install |
| SEO 索引页面数 | 136+ | Google 索引覆盖率 |

### 13.4 商业指标

| 指标 | 目标 | 说明 |
|------|------|------|
| 月付费用户增长 | +25/月 | Phase 2 稳定后 |
| CAC (获客成本) | < $30 | Google Ads + 自然流量混合 |
| LTV | > $200 | 平均留存 4+ 个月 |
| LTV/CAC | > 6 | 健康增长门槛 |
| D7 留存 | > 30% | 部署后 7 天活跃 |
| D30 留存 | > 20% | 部署后 30 天活跃 |

---

## 14. 注意事项 & 开发规范

### 14.1 前端规范
- **移动端优先**：所有页面响应式，卡片移动端 1 列，桌面端 3 列
- **深色主题**：延续现有 `#09090B` 背景 + `#FAFAFA` 文字 + `#22C55E` 高亮
- **字体**：JetBrains Mono (标题/品牌) + IBM Plex Mono (正文) + Inter (UI)
- **动画**：Chat 消息打字效果、Skill 卡片 hover 放大、Install 成功 confetti（轻量）

### 14.2 数据规范
- **造数据合理性**：评分 3.8-4.9，差评 5-10%，安装量与评论数成正比
- **评论真实感**：多样化用户名、不同时间段、有建设性差评
- **数据一致性**：skill 数量、分类计数、总安装量保持一致

### 14.3 安全 & 防滥用
- Chat Trial: 浏览器指纹 + IP rate limit (100/h) + AI API hard cap ($10/月)
- Install API: Clerk JWT 认证
- Reviews: 需登录 + 每用户每 skill 1 条 + 后台审核
- CSRF: Next.js 内建保护
- XSS: Chat 输入内容转义

### 14.4 关键不做的事
- **不做**：非英语多语言版本（Phase 5 之前）
- **不做**：自建支付系统（继续用 Stripe）
- **不做**：移动 App（Web-only）
- **不做**：实时多人协作
- **不做**：复杂的推荐算法（Phase 2 用简单"同分类 + 高评分"）

---

## 附录 A: 设计资产

### 最终方案 (V10) — 开发目标

| Frame | Node ID | 页面 | 截图参考 |
|-------|---------|------|---------|
| V10 — Landing Page (Chat + Skills Entry) | `iZxAF` | `/` | 在 .pen 文件中查看 |
| V10 — Skills Tools Page (/skills) SEO | `L3rOV` | `/skills` | 在 .pen 文件中查看 |
| V10 — Skill Detail Page (/skills/telegram-bot) | `HsIBK` | `/skills/:slug` | 在 .pen 文件中查看 |

### 历史版本（仅供理解设计决策）

| 版本 | Node ID | 核心思路 |
|------|---------|---------|
| V1 Current | `SCmain` | 原版 tinyclaw.dev |
| V2 Optimized | `OE4qr` | + Demo Bot 按钮 |
| V3 Try Free | `lfgFS` | 独立 Chat 页 |
| V4 Inline Chat | `db0dq` | Chat 嵌入首页 |
| V5 Input-First | `XOiMp` | Pollo.ai 输入优先 |
| V6 Scene-Based | `KgIdp` | 场景叙事 + 信任 |
| V7 Skills-First | `xCeal` | Skills 即产品 |
| V8 Output Preview | `Qrg6X` | 输出预览卡片 |
| V9 Skills Store | `7tHes` | 完整技能商店 |

## 附录 B: 竞品参考

| 竞品 | 我们学什么 | URL |
|------|-----------|-----|
| **Pollo.ai** | 零步骤体验 + 输出预览 + 首屏即产品 | https://pollo.ai |
| **n8n Templates** | 分类 tabs + 搜索 + 每个 workflow 独立 SEO 页面 | https://n8n.io/workflows/ |
| **claude-office-skills** | 136+ skills 数据源 + 分类体系 | https://github.com/claude-office-skills/skills |
| **App Store** | 卡片设计 + 评分评论 + 安装量 + 截图预览 | — |
| **Vercel Templates** | 一键 deploy 体验 + 模板市场 | https://vercel.com/templates |

## 附录 C: 已有基础设施

| 组件 | 状态 | 配置信息 |
|------|------|---------|
| TinyClaw 主站 | ✅ 运行中 | tinyclaw.dev (Vercel) |
| AgentPuter 站 | ✅ 运行中 | agentputer.pages.dev / agentputer.com (CF Pages) |
| Cloudflare KV | ✅ 已配置 | namespace `d4684c9f...`（邮箱收集） |
| GA4 (TinyClaw) | ✅ 已埋点 | `G-VTTKDJ5SY3` |
| GA4 (AgentPuter) | ✅ 已埋点 | `G-9M2T6GQJ0L` |
| Google Ads 转化 | ✅ 已配置 | `AW-845688835` + purchase 转化标签 |
| Clerk Auth | ✅ 已集成 | Google SSO |
| Stripe | ✅ 已集成 | $49.99/mo SKU |
| 邀请码系统 | ✅ 已有 | 8 个已发放 |

## 附录 D: 技能明细数据

> 以下为 Seed 脚本参考数据（前 4 个分类完整展开，其余见仓库）

### 1. Communication & Messaging

| slug | name | description | rating | installs |
|------|------|-------------|--------|----------|
| telegram-bot | Telegram Personal Bot | Personal AI assistant in Telegram. Smart replies, reminders, lookups — 24/7. | 4.8 | 4,217 |
| whatsapp-automation | WhatsApp Automation | Business messaging, auto-replies, and customer support on WhatsApp. | 4.6 | 3,842 |
| discord-bot | Discord Bot | Community management, moderation, and AI-powered help in Discord. | 4.5 | 2,913 |
| slack-workflows | Slack Workflows | Automate Slack channels with AI. Standup summaries, alert routing, Q&A. | 4.7 | 3,521 |
| microsoft-teams | Microsoft Teams | Meeting summaries, message routing, and task creation in Teams. | 4.3 | 2,104 |
| twilio-sms | Twilio SMS & Voice | SMS automation, voice call handling, and two-way messaging. | 4.2 | 1,387 |

### 2. Legal & Contracts

| slug | name | description | rating | installs |
|------|------|-------------|--------|----------|
| contract-review | Contract Review | Analyze contracts for risks, check completeness, get recommendations. | 4.7 | 3,102 |
| nda-generator | NDA Generator | Create professional NDAs for different scenarios and jurisdictions. | 4.4 | 2,015 |
| contract-template | Contract Templates | Smart contract templates with auto-fill and clause suggestions. | 4.3 | 1,543 |
| docusign-automation | DocuSign Automation | E-signature workflows, document routing, and status tracking. | 4.2 | 1,208 |

### 3. HR & Careers

| slug | name | description | rating | installs |
|------|------|-------------|--------|----------|
| resume-tailor | Resume Tailor | Optimize your resume for specific job applications with AI analysis. | 4.6 | 2,834 |
| cover-letter | Cover Letter Writer | Write compelling, personalized cover letters in seconds. | 4.5 | 2,312 |
| job-description | Job Description Creator | Create inclusive, compelling job postings optimized for applications. | 4.3 | 1,821 |
| applicant-screening | Applicant Screening | Screen candidates against job requirements with AI scoring. | 4.2 | 1,502 |
| offer-letter | Offer Letter Generator | Generate professional, compliant offer letters with templates. | 4.1 | 1,104 |

### 4. PDF Power Tools

| slug | name | description | rating | installs |
|------|------|-------------|--------|----------|
| chat-with-pdf | Chat with PDF | Ask questions, get summaries, and extract data from any PDF. | 4.8 | 5,127 |
| pdf-converter | PDF Converter | Convert PDF to/from Word, Excel, PowerPoint, and images. | 4.6 | 4,308 |
| pdf-ocr | PDF OCR | Extract text from scanned PDFs and images with high accuracy. | 4.5 | 3,721 |
| pdf-merge-split | PDF Merge & Split | Combine multiple PDFs or split into individual pages. | 4.4 | 3,205 |
| pdf-form-filler | PDF Form Filler | Fill out PDF forms programmatically with data from any source. | 4.3 | 2,814 |
| pdf-compress | PDF Compress | Reduce PDF file size while maintaining quality. | 4.2 | 2,503 |
| pdf-watermark | PDF Watermark | Add watermarks, page numbers, headers, and footers to PDFs. | 4.1 | 2,109 |

> 其余 16 个分类的完整 seed 数据由 seed 脚本从 GitHub repo 自动生成。
