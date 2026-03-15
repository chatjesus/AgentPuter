# AgentPuter.com SEO 审计报告

> 审计日期：2026-02-20
> 审计范围：agentputer.com / www.agentputer.com 全站

---

## 一、致命问题（P0 — 必须立即修复）

### 1. Google 完全没有收录

- `site:agentputer.com` 搜索结果为 **零**
- 直接搜索 "agentputer.com" 也无任何结果
- 意味着目前所有自然搜索流量为零

**行动：**
- 立即注册 [Google Search Console](https://search.google.com/search-console)
- 使用 Cloudflare DNS TXT 记录验证域名所有权（最快方式）
- 手动提交 `https://www.agentputer.com/sitemap-index.xml`
- 同时注册 [Bing Webmaster Tools](https://www.bing.com/webmasters)
- 预计耗时：**10 分钟**

### 2. www 与非 www 域名未做 301 规范化

- `agentputer.com` 和 `www.agentputer.com` 均可访问，返回相同内容
- 搜索引擎视为两个独立站点，权重被分散
- sitemap 中所有 URL 使用 `www.agentputer.com`，但用户可能访问的是裸域

**行动：**
- 选定 `www.agentputer.com` 为主域名（与 sitemap 一致）
- 在 Cloudflare → Rules → Redirect Rules 添加规则：
  - 匹配：`agentputer.com/*`
  - 重定向到：`https://www.agentputer.com/$1`（301 永久重定向）
- 预计耗时：**5 分钟**

### 3. Sitemap 路径问题

| 问题 | 现状 |
|------|------|
| `/sitemap.xml` | 返回 **404**（很多爬虫默认请求此路径） |
| `/sitemap-index.xml` | 存在，可正常访问 |
| `robots.txt` 中的引用 | 指向 `https://www.agentputer.com/sitemap-index.xml` |

**行动：**
- 添加 `/sitemap.xml` → `/sitemap-index.xml` 的 301 重定向
- 确保 `www.agentputer.com/robots.txt` 和 `agentputer.com/robots.txt` 内容一致
- 预计耗时：**5 分钟**

---

## 二、高优先级问题（P1）

### 4. Sitemap lastmod 时间戳全部相同

所有 100+ 个 URL 的 `lastmod` 均为 `2026-02-19T13:13:34.138Z`：

```
https://www.agentputer.com/           → 2026-02-19T13:13:34.138Z
https://www.agentputer.com/blog/      → 2026-02-19T13:13:34.138Z
https://www.agentputer.com/zh/blog/   → 2026-02-19T13:13:34.138Z
...（全部相同）
```

Google 官方声明：**如果 lastmod 不准确，会被直接忽略**，降低爬取效率。

**行动：**
- 修改构建系统，为每个页面生成真实的最后修改时间
- 博客文章使用 frontmatter 中的日期，静态页面使用 git commit 时间
- 预计耗时：取决于框架（Next.js 通常 1-2 小时）

### 5. 首页 H1 标签 SEO 不友好

| 元素 | 当前值 | 问题 |
|------|--------|------|
| `<title>` | AgentPuter - Your AI Agent's 24/7 Cloud Runtime | 还可以 |
| `<h1>` | Your AI Never Sleeps | 缺乏核心关键词 |

搜索引擎重度依赖 H1 理解页面主题。"Your AI Never Sleeps" 是品牌口号，不是关键词。

**建议修改：**
- H1 → `Your AI Agent's 24/7 Cloud Runtime` 或 `Keep AI Agents Running 24/7 in the Cloud`
- 将 "Your AI Never Sleeps" 改为 H1 下方的 tagline / 副标题
- 预计耗时：**代码改动 10 分钟**

### 6. 缺少 JSON-LD 结构化数据

需要添加的 Schema 类型：

| 页面 | Schema 类型 | 作用 |
|------|------------|------|
| 首页 | `Organization` + `WebSite` + `SoftwareApplication` | 品牌知识图谱 |
| 博客文章 | `Article` + `BreadcrumbList` | 富文本摘要（Rich Snippets） |
| Features 页 | `FAQPage` | FAQ 富文本结果 |
| Pricing 页 | `Product` + `Offer` | 价格展示 |

示例（首页 Organization）：

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AgentPuter",
  "url": "https://www.agentputer.com",
  "description": "24/7 cloud runtime for AI agents. Keep OpenClaw, ClawBot, and MoltBot running around the clock.",
  "sameAs": ["https://github.com/agentputer", "https://x.com/agentputer"]
}
```

**预计耗时：1-2 小时**

---

## 三、中等优先级（P2）

### 7. 多语言 hreflang 实现

站点有 **8 个语言版本**，共 100+ 页面：

| 语言 | 路径前缀 | 页面数 |
|------|---------|-------|
| English（默认） | `/` | ~15 |
| 中文 | `/zh/` | ~15 |
| 日本語 | `/ja/` | ~15 |
| 한국어 | `/ko/` | ~15 |
| Deutsch | `/de/` | ~15 |
| Español | `/es/` | ~15 |
| Français | `/fr/` | ~15 |
| Português | `/pt-br/` | ~15 |

**需要验证：**
- 每个页面是否有完整的 `<link rel="alternate" hreflang="xx" href="...">` 标签
- 所有语言版本是否互相指向（包括 `x-default`）
- 翻译质量是否足够（纯机器翻译的低质量页面会拉低整站评分）

**行动：**
- 使用 [hreflang tag checker](https://technicalseo.com/tools/hreflang/) 验证
- 如果某些语言翻译质量不够，添加 `noindex` 或暂时从 sitemap 移除
- 预计耗时：**30 分钟检查 + 按需修复**

### 8. Cloudflare 性能与 SEO 设置清单

在 Cloudflare Dashboard (`/28c7a2284bad6930b719d160a5e692fa/agentputer.com`) 中检查：

| 设置项 | 位置 | 建议状态 | 作用 |
|--------|------|---------|------|
| SSL 模式 | SSL/TLS → Overview | Full (Strict) | 安全连接 |
| Always Use HTTPS | SSL/TLS → Edge Certificates | ✅ 开启 | 强制 HTTPS |
| HTTP/2 | Speed → Optimization | ✅ 开启 | 并行加载 |
| HTTP/3 (QUIC) | Network | ✅ 开启 | 更快连接 |
| Early Hints | Speed → Optimization | ✅ 开启 | 103 预加载 |
| Brotli 压缩 | Speed → Optimization | ✅ 开启 | 减小体积 |
| Auto Minify | Speed → Optimization | ✅ JS/CSS/HTML 全开 | 减小体积 |
| Browser Cache TTL | Caching → Configuration | 1 month | 减少重复请求 |
| Crawler Hints | Caching → Configuration | ✅ 开启 | IndexNow 协议 |
| Always Online | Caching → Configuration | ✅ 开启 | 宕机时可爬取 |

**预计耗时：15 分钟逐项检查**

---

## 四、长期优化建议（P3）

### 9. 缺少关键 SEO 着陆页

当前页面结构：

```
/                    → 首页
/blog/               → 博客列表
/blog/[slug]         → 10 篇博客文章
/features/           → 功能介绍
/pricing/            → 价格
/docs/               → 文档
/tools/              → 工具
```

**建议增加：**

| 新页面 | 目标关键词 | 说明 |
|--------|-----------|------|
| `/use-cases` | AI agent use cases, agent automation | 按场景展开（开发、研究、企业） |
| `/vs/computer-use` | AgentPuter vs Computer Use | 与 Anthropic Computer Use 对比 |
| `/vs/mcp` | AgentPuter vs MCP | 与 MCP/Plugin 方案对比 |
| `/openclaw` | OpenClaw hosting, deploy OpenClaw | Hub 页面（博客大量围绕 OpenClaw） |
| `/what-is-agent-computer` | agent computer, AI agent runtime | 科普型长尾词着陆页 |

### 10. 博客内容优化

当前博客做得不错（10 篇高质量文章），可进一步优化：

- **内部链接**：文章之间互相引用，形成主题集群（topic cluster）
- **相关文章**：每篇文章底部推荐 2-3 篇相关文章
- **目录 (TOC)**：长文添加锚点目录，增加 Google 的 sitelinks 展示概率
- **发布频率**：保持每周 1-2 篇，持续 3 个月后 Google 会加快爬取频率

### 11. 外链与品牌建设

- 在 GitHub 仓库 README 中添加指向 `www.agentputer.com` 的链接
- 在 Product Hunt、Hacker News 等平台发布（高质量外链）
- 博客文章同步到 Medium / dev.to（带 canonical 指回原站）

---

## 五、做得好的地方

### GEO（AI 搜索引擎优化）

`robots.txt` 已正确允许主流 AI 爬虫：

```
User-agent: GPTBot        → Allow
User-agent: ChatGPT-User  → Allow
User-agent: Google-Extended → Allow
User-agent: PerplexityBot  → Allow
User-agent: ClaudeBot      → Allow
```

这意味着 AgentPuter 的内容可以被 ChatGPT、Perplexity、Claude 等 AI 搜索引擎引用和推荐。这一点领先大多数同类站点。

### 博客内容质量

- 10 篇深度文章，平均 12-20 分钟阅读时长
- 围绕 OpenClaw 生态的主题集群初步成型
- 标题含高搜索意图关键词（deploy, review, money, creator）

### 多语言布局

- 8 个语言版本的架构已搭建
- 使用路径前缀方案（`/zh/`, `/ja/`），SEO 友好

---

## 执行清单

| # | 事项 | 优先级 | 耗时 | 状态 |
|---|------|--------|------|------|
| 1 | 注册 Google Search Console，提交 sitemap | P0 | 10 min | ⬜ |
| 2 | Cloudflare 添加 www 301 重定向规则 | P0 | 5 min | ⬜ |
| 3 | 添加 /sitemap.xml → /sitemap-index.xml 重定向 | P0 | 5 min | ⬜ |
| 4 | 注册 Bing Webmaster Tools | P0 | 10 min | ⬜ |
| 5 | 修复 sitemap lastmod 为真实时间 | P1 | 1-2 h | ⬜ |
| 6 | 优化首页 H1 关键词 | P1 | 10 min | ⬜ |
| 7 | 添加 JSON-LD 结构化数据 | P1 | 1-2 h | ⬜ |
| 8 | 检查 hreflang 实现 | P2 | 30 min | ⬜ |
| 9 | Cloudflare 性能设置调优 | P2 | 15 min | ⬜ |
| 10 | 新建对比/着陆页 | P3 | 按需 | ⬜ |
| 11 | 添加外链（GitHub、PH 等） | P3 | 按需 | ⬜ |
