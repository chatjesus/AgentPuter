# TinyClaw.dev SEO 审计报告

> 审计日期：2026-02-20
> 审计范围：tinyclaw.dev 全站

---

## 站点概况

| 项目 | 状态 |
|------|------|
| 域名 | tinyclaw.dev |
| 产品定位 | 一键部署 OpenClaw 的托管服务（<1 分钟） |
| 页面数量 | 14 个（含 11 个语言版本） |
| 博客 | 无（链接到 agentputer.com/blog） |
| Google 收录 | **零** |
| 竞品 | clawctl.com、openclawdirectory.dev |
| 外部提及 | GitHub (jlia0/tinyclaw)、scriptbyai.com、mike.gold |

---

## 一、致命问题（P0）

### 1. Google 完全没有收录

- `site:tinyclaw.dev` 搜索结果为零
- 搜索 "tinyclaw.dev" 只能找到第三方提及，找不到官网本身
- 竞品 clawctl.com 已经有多篇被收录的博客文章排在相关搜索结果中

**行动：**
- 立即注册 Google Search Console，验证域名并提交 sitemap
- 注册 Bing Webmaster Tools
- 预计耗时：**10 分钟**

### 2. 首页对爬虫几乎不可见（严重的 SSR/渲染问题）

这是 tinyclaw.dev 最大的技术 SEO 问题：

| 页面 | 爬虫抓到的内容 |
|------|---------------|
| `tinyclaw.dev`（英文首页） | **仅一行标题**："TinyClaw — Deploy OpenClaw under 1 Minute" |
| `tinyclaw.dev/zh`（中文） | 完整页面内容 ✅ |
| `tinyclaw.dev/setup` | **超时，无内容** |
| `tinyclaw.dev/privacy` | **超时，无内容** |

**问题分析：**
- 英文首页很可能是纯客户端 JS 渲染（CSR），没有做服务端渲染（SSR）
- Google 虽然能执行 JS，但 CSR 页面的收录速度慢 5-10 倍，且不稳定
- 中文页面能渲染出来可能是因为走了不同的渲染路径
- `/setup` 和 `/privacy` 页面直接超时，爬虫完全无法抓取

**行动（关键）：**
- 确保所有页面使用 SSR（服务端渲染）或 SSG（静态生成）
- 如果使用 Next.js，检查是否所有路由都使用了 `getServerSideProps` 或 `getStaticProps`
- 修复 `/setup` 和 `/privacy` 的超时问题
- 用 [Google Rich Results Test](https://search.google.com/test/rich-results) 测试各页面的渲染结果
- **这是最高优先级**，不修复这个问题，其他 SEO 优化全部无效
- 预计耗时：**视代码架构而定，可能 2-8 小时**

### 3. 部分页面响应超时

以下页面在抓取时超时（>30 秒无响应）：

- `https://tinyclaw.dev/setup`
- `https://tinyclaw.dev/privacy`
- `https://www.tinyclaw.dev`（www 版本）

**行动：**
- 检查这些页面的服务端性能，是否有阻塞渲染的 API 调用
- 确保 Cloudflare 缓存规则覆盖这些静态页面
- 目标：所有页面 TTFB < 500ms
- 预计耗时：**1-2 小时排查**

---

## 二、高优先级问题（P1）

### 4. Sitemap lastmod 全部相同

与 agentputer.com 存在完全相同的问题：

```xml
https://tinyclaw.dev       → 2026-02-19T17:50:45.875Z
https://tinyclaw.dev/zh    → 2026-02-19T17:50:45.875Z
https://tinyclaw.dev/setup → 2026-02-19T17:50:45.875Z
...（全部相同）
```

**行动：** 同 AgentPuter 审计报告建议，使用真实的页面修改时间。

### 5. 没有博客/内容页面

当前 sitemap 只有 14 个 URL：
- 1 个首页
- 10 个语言版本
- 1 个 setup 页面
- 1 个 privacy 页面
- 1 个 terms 页面

博客链接直接指向 `agentputer.com/blog`，等于把所有内容 SEO 价值送给了 AgentPuter 域名。

**分析：**
- 竞品 clawctl.com 已有多篇博客被 Google 收录（"How to Setup OpenClaw"、"How to Deploy OpenClaw Securely"）
- 这些内容直接截获了 tinyclaw.dev 的目标用户搜索流量

**行动（选择一种策略）：**

| 策略 | 说明 | 优劣 |
|------|------|------|
| A. 在 tinyclaw.dev 建独立博客 | 发布 OpenClaw 部署教程、对比文章 | SEO 最优，但需维护两个博客 |
| B. 在 agentputer.com 博客中添加 TinyClaw 着陆页 | 如 `/blog/tinyclaw-vs-manual-deploy` | 利用现有域名权重，但流量归 agentputer |
| C. 子域名方案 | `blog.tinyclaw.dev` 指向专属内容 | 折中方案 |

**建议采用策略 A**，至少发布以下 3 篇核心文章：
1. "How to Deploy OpenClaw in Under 1 Minute with TinyClaw"
2. "TinyClaw vs Manual OpenClaw Setup: Complete Comparison"
3. "TinyClaw vs Clawctl: Which OpenClaw Deployment Tool to Choose"

### 6. 首页标题和 meta description 优化

| 元素 | 当前 | 建议 |
|------|------|------|
| `<title>` | TinyClaw — Deploy OpenClaw under 1 Minute | TinyClaw — Deploy OpenClaw in 1 Minute \| One-Click AI Agent Hosting |
| `<h1>` | 部署 OpenClaw 不到 1 分钟 | 需确认英文版 H1（抓不到） |
| `<meta description>` | 未知（页面未渲染） | "Deploy your own OpenClaw instance in under 60 seconds. No SSH, no Docker, no DevOps. One-click cloud setup with Telegram, WhatsApp & Discord." |

---

## 三、中等优先级（P2）

### 7. 多语言配置

站点有 **11 个语言版本**：

| 语言 | 路径 | Sitemap Priority |
|------|------|-----------------|
| English | `/` | 1.0 |
| 简体中文 | `/zh` | 0.9 |
| 繁体中文 | `/zh-tw` | 0.9 |
| Español | `/es` | 0.9 |
| 日本語 | `/ja` | 0.9 |
| 한국어 | `/ko` | 0.9 |
| Deutsch | `/de` | 0.9 |
| Français | `/fr` | 0.9 |
| Português | `/pt` | 0.9 |
| Русский | `/ru` | 0.9 |
| العربية | `/ar` | 0.9 |

**需要验证：**
- 每个语言版本是否有 `hreflang` 标签互相指向
- 是否有 `x-default` 指向英文版
- 翻译质量是否足够（中文版内容看起来质量不错）
- 阿拉伯语版是否正确处理了 RTL（从右到左）布局

### 8. robots.txt 优化

当前 robots.txt 结构合理：

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /creating
Disallow: /dashboard
Disallow: /sign-in
Disallow: /sign-up
Disallow: /subscribe
```

**建议补充（参考 agentputer.com 的做法）：**

```
# AI 搜索引擎爬虫（GEO 优化）
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

这样可以确保 AI 搜索引擎（ChatGPT、Perplexity、Claude）能引用 TinyClaw 的内容。

### 9. 缺少结构化数据

建议添加：

| Schema 类型 | 作用 |
|------------|------|
| `SoftwareApplication` | 让 Google 理解这是一个软件产品 |
| `HowTo` | 部署步骤可获得富文本展示 |
| `FAQPage` | "传统方法 vs TinyClaw" 对比部分 |
| `Organization` | 品牌知识图谱 |

---

## 四、竞品对比

### 搜索可见性对比

| 竞品 | Google 收录 | 博客内容 | 搜索排名 |
|------|-----------|---------|---------|
| **tinyclaw.dev** | ❌ 零收录 | ❌ 无博客 | 不可见 |
| clawctl.com | ✅ 有收录 | ✅ 多篇教程 | "deploy openclaw" 排名靠前 |
| openclawdirectory.dev | ✅ 有收录 | ✅ 有博客 | "openclaw deploy vps" 有排名 |

**关键发现：**
- 搜索 "deploy openclaw" 时，clawctl.com 和 openclawdirectory.dev 的教程文章排在前列
- tinyclaw.dev 完全不可见，即使产品实际上更简单易用
- 这是一个纯粹的 SEO 执行差距，不是产品差距

---

## 五、做得好的地方

1. **产品定位清晰** — "Deploy OpenClaw under 1 Minute" 一句话说清价值
2. **对比表做得好** — "传统方法 60 分钟 vs TinyClaw <1 分钟" 非常有说服力
3. **用例展示丰富** — 列出了大量具体使用场景，有助于长尾关键词覆盖
4. **多语言覆盖广** — 11 个语言版本，覆盖主要市场
5. **robots.txt 结构合理** — 正确屏蔽了私有路由
6. **外部已有品牌提及** — GitHub、scriptbyai.com、mike.gold 等已有自然讨论

---

## 执行清单

| # | 事项 | 优先级 | 耗时 | 状态 |
|---|------|--------|------|------|
| 1 | **修复首页 SSR 渲染问题**（最关键） | P0 | 2-8 h | ⬜ |
| 2 | 注册 Google Search Console，提交 sitemap | P0 | 10 min | ⬜ |
| 3 | 修复 /setup 和 /privacy 超时 | P0 | 1-2 h | ⬜ |
| 4 | 注册 Bing Webmaster Tools | P0 | 10 min | ⬜ |
| 5 | 修复 sitemap lastmod 时间戳 | P1 | 1 h | ⬜ |
| 6 | 建立博客，发布 3 篇核心文章 | P1 | 1-2 天 | ⬜ |
| 7 | 优化 title / meta description | P1 | 30 min | ⬜ |
| 8 | robots.txt 添加 AI 爬虫规则 | P2 | 5 min | ⬜ |
| 9 | 检查 hreflang 实现 | P2 | 30 min | ⬜ |
| 10 | 添加 JSON-LD 结构化数据 | P2 | 1-2 h | ⬜ |

---

## 与 AgentPuter.com 的共性问题

两个站点共享以下问题，建议一起修复：

| 共性问题 | agentputer.com | tinyclaw.dev |
|---------|---------------|-------------|
| Google 零收录 | ✅ 同样 | ✅ 同样 |
| 未注册 Search Console | ✅ 同样 | ✅ 同样 |
| Sitemap lastmod 全相同 | ✅ 同样 | ✅ 同样 |
| 缺少结构化数据 | ✅ 同样 | ✅ 同样 |
| 多语言 hreflang 待验证 | ✅ 同样 | ✅ 同样 |

**tinyclaw.dev 额外的严重问题：首页 SSR 渲染失败**，这是 agentputer.com 没有的问题，必须最先解决。
