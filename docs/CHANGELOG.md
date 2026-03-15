# AgentPuter 开发日志 (CHANGELOG)

> 所有重要变更按时间倒序记录。每个版本对应一个 Git commit，支持回滚。

---

## [v0.8.0] - 2026-02-09 — Stripe 计费系统 (规划中)

**状态**: 📋 规划完成，待开发

### 背景

- 竞品 SimpleClaw 定价 $49/月含 $15 AI Credits，通过 Stripe 收费（收费主体 Fold Ventures）
- AgentPuter 当前使用邀请码门控，无收费能力
- 需要将邀请码门控替换为 Stripe 订阅付费，实现自助付费 → 自动部署闭环

### 规划内容

**定价方案 (单档制)**

| 套餐 | 月费 | 包含内容 |
|------|------|---------|
| Pro | $29/mo | 1 VPS + $20 AI Credits/月 + 全渠道 (Telegram/Discord/Web) + 7天免费试用 |

> Stripe Product: `prod_TwkTZzqdgmu4pC` / Price: `price_1SyqyeFdHJyOdgUpfiLBl6Yk`

**技术方案**

| Phase | 内容 | 预估工时 |
|-------|------|---------|
| Phase 1 | Stripe SDK 安装 + 产品/价格创建 + 环境变量 | 2h |
| Phase 2 | DB Schema 升级 (stripe_customer_id / subscription_id / status / credits) | 1h |
| Phase 3 | `/api/stripe/checkout` + `/api/stripe/portal` API | 3h |
| Phase 4 | `/api/webhooks/stripe` 订阅生命周期处理 | 3h |
| Phase 5 | `/pricing` 页面替换 `/invite` + 用户流程改造 | 4h |
| Phase 6 | Dashboard 订阅管理卡片 + Customer Portal 入口 | 2h |
| Phase 7 | VPS 生命周期 (取消→关机, 过期→删除, 续费→恢复) | 3h |

**用户旅程变更**
```
旧: 注册 → 邀请码 → VPS创建 → Dashboard
新: 注册 → Stripe付费($29/mo) → VPS自动创建 → Dashboard(含订阅管理)
    （单档制，无需选套餐。邀请码保留为免费体验通道）
```

**订阅状态机**
```
none → active → past_due → canceled → expired
```

### 修改文件 (规划)

| 文件 | 变更 |
|------|------|
| `web/package.json` | +stripe 依赖 |
| `web/src/lib/db.ts` | +6 个 Stripe 字段 |
| `web/src/app/api/stripe/checkout/route.ts` | 新建 |
| `web/src/app/api/stripe/portal/route.ts` | 新建 |
| `web/src/app/api/webhooks/stripe/route.ts` | 新建 |
| `web/src/app/pricing/page.tsx` | 新建 |
| `web/src/app/page.tsx` | 路由逻辑更新 |
| `web/src/app/dashboard/page.tsx` | +订阅管理卡片 |
| `web/src/middleware.ts` | +stripe webhook 公开路由 |
| `docs/MVP_1.0_PRD.md` | +Phase 2 计费章节 |
| `docs/MVP_1.0_DEV.md` | +Stripe 技术文档 |
| `docs/MVP_SPEC.md` | +定价 + Stripe Schema |
| `docs/AgentPuterLandingPage.pen` | +Pricing/Checkout 交互设计 |

---

## [v0.7.0] - 2026-02-08 — Features 页面

**Git commit**: `499d56e` Feat(features): add /features page with full design implementation

### 变更内容

**新增 `/features` 页面 — 完整还原 Pencil 设计稿 `FtPg1`**

| Section | 组件 | 说明 |
|---------|------|------|
| Features Hero | `FeaturesHero.astro` | 标题 + 副标题 + 5 个 role preview 标签 |
| Before vs After | `BeforeAfter.astro` | 双栏对比：Without vs With AgentPuter |
| Community Voices | `CommunityVoices.astro` | 6 条真实用户引言卡片，**可点击跳转原帖** (HN/Threads/GitHub) |
| 5 Core Roles | `CoreRoles.astro` | 5 个角色详情 + 终端模拟，交替布局 |
| Use Cases | `UseCases.astro` | 4 个使用场景卡片 (Office/Research/Dev/Creative) |
| Comparison Table | `ComparisonTable.astro` | 终端风格对比矩阵 (5 维度 × 5 产品) |
| Architecture | `Architecture.astro` | 4 层架构图 (User Entry → Orchestration → Execution → Persistence) |
| Security & Trust | `SecurityTrust.astro` | 5 个安全信任标签 |
| Features CTA | `FeaturesCTA.astro` | 底部行动号召，链接到 `app.agentputer.com/sign-up` |

**Header 更新**
- 新增 `activePage` prop，支持当前页面高亮
- `/features` 导航链接从 `#features` 改为 `/features`
- 中文版 Header 同步更新
- Footer Features 链接同步更新

**Community Voices 引言来源（可点击跳转原帖）**
- HN · anupsingh123 — $200 burned in 2h
- Threads · @uddeshya_agrawal — 780+ exposed instances
- GitHub Issue · Claude Code #13919 — context loss
- HN · xinbenlv — local machine trust
- HN · Pomerium (YC) — MCP auth gap
- HN · bilbo-b-baggins — proxy credentials

### 修改文件
| 文件 | 变更 |
|------|------|
| `src/pages/features.astro` | 新建 - 页面路由 |
| `src/components/features/*.astro` (9 files) | 新建 - 所有 section 组件 |
| `src/components/Header.astro` | +activePage prop + /features 链接更新 |
| `src/components/zh/Header.astro` | /features 链接更新 |
| `src/components/Footer.astro` | Features 链接 → /features |

### 回滚指南
```bash
git reset --hard f29eba1   # 回到 features 页面开发前
```

---

## [v0.6.0] - 2026-02-08 — Landing Page 性能优化

**Git commits**: `f05a0b1` Perf(landing): LCP + 字体 + 动画性能优化 / `51a8f4a` Fix(web): 根页面智能跳转

### 变更内容

**LCP 优化**
- 字体加载: `media="print"` hack → `<link rel="preload">` 直接预加载 JetBrains Mono Bold woff2
- 字体 CSS: 改为阻塞加载 (配合 preconnect 延迟极低)，确保 LCP 时字体可用
- Hero "Never Sleeps" 打字动画 bug 修复: `typeTitle()` 函数开头立即清空两行文字，防止全文闪现

**Below-fold 渲染优化**
- 首页: PainPoints / Solution / HowItWorks / CTA 添加 `content-visibility: auto`
- 博客: 图片转 WebP + `loading="lazy"` + `width/height` + `decoding="async"`
- 博客: `.prose-terminal` 内 h2/h3 后续内容添加 `content-visibility: auto`

**移动端优化**
- Header: 移动端用 `bg-dark-primary` 替代 `backdrop-blur-lg`，减少 GPU 负载

**Dashboard 根页面**
- `app.agentputer.com/` 从 Next.js 默认模板改为智能跳转:
  - 已登录 + VPS ready → /dashboard
  - 已登录 + 未验证 → /invite
  - 已登录 + creating → /creating
  - 未登录 → /sign-in

**优化效果 (Cloudflare Web Analytics)**
| 指标 | 优化前 | 优化后 | 变化 |
|------|--------|--------|------|
| LCP P50 | 873ms | 601ms | ↓ 272ms |
| LCP P75 | 2,076ms | 1,504ms | ↓ 572ms |
| LCP Good 占比 | 82% | 88% | ↑ 6% |
| INP P75 | — | 37ms (Good) | — |
| CLS P75 | — | 0.04 (Good) | — |

### 修改文件
| 文件 | 变更 |
|------|------|
| `src/layouts/Layout.astro` | 字体预加载策略 |
| `src/components/Hero.astro` | 打字动画 bug 修复 |
| `src/components/zh/Hero.astro` | 同步修复 |
| `src/components/Header.astro` | 移动端 backdrop-blur 优化 |
| `src/components/zh/Header.astro` | 同步优化 |
| `src/pages/index.astro` | content-visibility |
| `src/pages/zh/index.astro` | content-visibility |
| `src/layouts/BlogPost.astro` | 图片响应式 + content-visibility |
| `src/content/blog/agent-needs-its-own-computer.md` | PNG → WebP + lazy |
| `web/src/app/page.tsx` | 智能跳转替代默认模板 |

---

## [v0.5.0] - 2026-02-08 — 邀请码门控系统

### 变更内容

**邀请码系统 (防刷机制)**
- 新增 `invite_codes` 数据库表：code / maxUses / usedCount / expiresAt / note
- 用户 `status` 流程变更: `pending → invited → creating → ready`
- 注册后跳转 `/invite` 页面输入邀请码，验证通过才能创建 VPS
- API 门控: `/api/vps/create` 拒绝无邀请码用户 (403)
- 页面门控: `/creating` 检测未验证用户踢回 `/invite`
- Dashboard 门控: 未验证用户重定向到 `/invite`
- 已有老用户自动标记 `LEGACY-USER` 不受影响

**邀请码管理**
- `scripts/generate-invite-codes.ts` 脚本生成邀请码
- 格式: `XXXX-XXXX-XXXX`（去掉易混淆字符 0/O/1/I）
- 支持: 单次/多次/无限使用、过期时间、备注标注
- 首批生成 10 个一次性邀请码

**UI**
- `/invite` 页面: 暗色主题，邀请码输入框，验证加载态，错误提示
- 未有邀请码用户引导到 waitlist

### 修改文件
| 文件 | 变更 |
|------|------|
| `web/src/lib/db.ts` | +inviteCodes 表 +users.inviteCode 字段 |
| `web/src/app/api/invite/validate/route.ts` | 新建 - 邀请码验证 API |
| `web/src/app/invite/page.tsx` | 新建 - 邀请码输入页面 |
| `web/src/app/creating/page.tsx` | +门控检查 |
| `web/src/app/api/vps/create/route.ts` | +邀请码门控 (403) |
| `web/src/app/dashboard/page.tsx` | +未验证用户重定向 |
| `web/.env.local` | AFTER_SIGN_UP_URL → /invite |
| `web/scripts/generate-invite-codes.ts` | 新建 - 邀请码生成脚本 |

### 用户流程
```
注册 (Clerk) → /invite (输入邀请码) → /creating (VPS创建) → /dashboard
    ↑                    ↑
    无成本               有邀请码才往下走，否则卡在这
```

---

## [v0.4.0] - 2026-02-08 — 全链路修复 + 线上部署

### 变更内容

**OpenClaw VPS 初始化修复**
- 根因: Packer 镜像只安装了 OpenClaw 二进制，未执行 `openclaw onboard` 初始化
- VPS 创建后自动执行 `openclaw onboard --non-interactive --accept-risk` 初始化
- 自动注入平台 Anthropic API Key (`ANTHROPIC_API_KEY` 环境变量，服务端安全存储)
- `waitForSSH()`: 等待 VPS SSH 就绪（最长 120 秒轮询）

**Telegram 配置修复**
- ~~`openclaw channels add --channel telegram`~~ → `openclaw config set channels.telegram.botToken`（旧命令不存在）
- 配置前检测 `~/.openclaw/openclaw.json`，未初始化则自动补跑 onboard
- 拆分 stop/pkill 为独立 SSH 命令，避免 pkill 断开 SSH 连接
- 禁用 onboard 创建的用户级 `openclaw-gateway.service`，避免端口冲突

**systemd Service 修复**
- `ExecStart` 从 `/usr/bin/openclaw gateway` 改为 `/usr/bin/node /usr/lib/node_modules/openclaw/dist/index.js gateway`
- 原因: `openclaw` wrapper 会 fork 子进程，父进程退出后 systemd 误判服务停止
- `Restart=always` + `KillMode=process` 确保稳定运行

**线上部署**
- Landing Page (Astro) → Cloudflare Pages (`agentputer.com`) — 更新 CTA 链接
- Dashboard (Next.js) → Vercel (`app.agentputer.com`) — 首次部署
- Vercel 环境变量配置: Clerk / Neon / Hetzner / Anthropic
- Cloudflare DNS: `app` A 记录 → `76.76.21.21`

**安全**
- `ANTHROPIC_API_KEY` 仅存在于 Vercel 服务端环境变量和 VPS `auth-profiles.json`
- 前端代码零引用，不使用 `NEXT_PUBLIC_` 前缀，浏览器不可见
- 当前使用 Claude OAuth Token（受订阅配额限制，不会超额扣费）

### 修改文件
| 文件 | 变更 |
|------|------|
| `web/src/app/api/vps/create/route.ts` | +waitForSSH +onboard +auth注入 +node直接启动 |
| `web/src/app/api/telegram/setup-token/route.ts` | config set 替代 channels add + 初始化检测 |
| `web/.env.local` | +ANTHROPIC_API_KEY |
| `src/components/*.astro` (6 files) | CTA 链接 → `https://app.agentputer.com/sign-up` |

### 部署架构
```
agentputer.com      → Cloudflare Pages (Astro 静态站)
app.agentputer.com  → Vercel (Next.js + Node.js Runtime)
VPS (Hetzner cpx11) → OpenClaw Gateway + Telegram Bot
Neon PostgreSQL     → 用户数据
Clerk               → 认证
```

---

## [v0.3.0] - 2026-02-07 — Landing Page 接入一键部署入口

**Git commit**: `fca6435` docs: PRD v1.3, DEV v1.3, landing page design, blog assets

### 变更内容

**Landing Page (Astro) — 功能集成，设计不变**
- `[START]` 按钮: `#cta` → `https://app.agentputer.com/sign-up`
- `./launch_pod` 按钮: `#cta` → `https://app.agentputer.com/sign-up`
- CTA 区域: 从纯邮箱收集改为「一键部署按钮 + 邮箱 waitlist 降级」
  - 主按钮: `./launch_pod --now` → 跳转注册页
  - 副按钮: 邮箱表单保留为次要选项
- 标题更新: "Ready to Set Your AI Agent Free?" → "Deploy Your AI Agent in 2 Minutes"
- 中文版同步更新（Header / Hero / CTA）

**文档更新**
- `MVP_1.0_PRD.md` → v1.3: 添加 Telegram 集成、Claude Auth、技术架构图、已知问题
- `MVP_1.0_DEV.md` → v1.3: 完整项目结构、4 个 API 路由、SSH 执行、开发/生产模式对照
- `AgentPuterLandingPage.pen` 设计稿文案同步

**Git 仓库初始化**
- 根目录 `git init`（之前只有 `web/` 有独立 git）
- 合并为统一仓库，3 个版本提交支持回滚
- `.gitignore` 更新：排除 `.env.local`、`.wrangler/`、`.cursor/`、`web/.next/`

### 回滚指南
```bash
git checkout df724fc   # 回到纯 Landing Page
git checkout 92ca623   # 回到 Landing + 后端（无文档更新）
git checkout main      # 当前最新
```

---

## [v0.2.0] - 2026-02-04 — Next.js Dashboard + 一键部署后端

**Git commit**: `92ca623` feat(web): Next.js Dashboard + one-click VPS deployment

### 变更内容

**核心功能**
- Next.js 16 App Router + Clerk 认证
- Hetzner Cloud API 自动创建 VPS (cpx11, 2vCPU/2GB)
- Cloud-init 设置 root 密码
- Dashboard 页面: OpenClaw WebChat 链接 / VPS 信息 / SSH 密码
- Telegram Bot Token 配置 (SSH → `openclaw channels add`)
- Telegram 配对码 (SSH → `openclaw pairing approve`)
- PostgreSQL (Neon) + Drizzle ORM

**API 路由**
| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/vps/create` | POST | 创建 VPS |
| `/api/vps/status` | GET | 轮询状态 |
| `/api/telegram/setup-token` | POST | 配置 Telegram Bot Token |
| `/api/telegram/pair` | POST | Telegram 配对 |
| `/api/webhooks/clerk` | POST | Clerk 用户注册回调 |

**页面**
| 页面 | 路径 | 功能 |
|------|------|------|
| Landing | `/` | 简易入口页 |
| 注册/登录 | `/sign-up`, `/sign-in` | Clerk |
| 等待页 | `/creating` | 轮询 VPS 创建进度 |
| Dashboard | `/dashboard` | 部署结果 + Telegram 配置 |

**技术栈**
- Next.js 16 / React 19 / Tailwind CSS 4
- Clerk / Drizzle ORM / PostgreSQL (Neon)
- ssh2 (Node.js SSH 库)
- Hetzner Cloud API

---

## [v0.1.0] - 2026-02-03 — Astro Landing Page 上线

**Git commit**: `df724fc` feat(landing): Astro Landing Page baseline - agentputer.com

### 变更内容

**Landing Page**
- Astro 4.x 静态站点 + Tailwind CSS
- 黑客终端风格设计（荧光绿、网格背景、CRT 扫描线）
- 英文版 + 中文版 (`/zh/`)
- 打字机动画（标题 + 终端命令）
- MatrixRain 背景粒子效果
- 邮箱 waitlist 表单 (localStorage + Cloudflare Workers API)
- 博客系统 (Astro Content Collections)
- 部署到 agentputer.com (Cloudflare Pages)

**组件列表**
- Header / Hero / PainPoints / Solution / HowItWorks / CTA / Footer / MatrixRain

**部署**
- 平台: Cloudflare Pages
- 域名: agentputer.com / www.agentputer.com

---

## 已知问题 & 经验教训

### Anthropic Auth
- OpenClaw `Shell env: off` → 不读取环境变量中的 API Key
- 正确方式: `openclaw onboard --auth-choice token --token-provider anthropic --token <key>`
- 也可直接写: `/root/.openclaw/agents/main/agent/auth-profiles.json`
- 注意: VPS root 用户可读取明文 key，后续需 Proxy 架构

### OpenClaw 初始化 (v0.4.0 新增)
- Packer 镜像只安装二进制，必须在 VPS 创建后执行 `openclaw onboard`
- `openclaw` CLI wrapper 会 fork 子进程 → systemd 需用 node 直接调用
- `onboard --install-daemon` 创建的用户级 service 会与系统级 service 冲突

### OpenClaw CLI 命令 (v0.4.0 新增)
- `openclaw channels add` 不存在 → 正确: `openclaw config set channels.telegram.botToken`
- `openclaw models auth paste-token` 是交互式的，SSH pipe 无法使用

### SSH 密码特殊字符
- Cloud-init 生成的密码含 `$` 和 `!`，shell 中需注意转义

### 项目结构与部署
- 根目录 = Astro Landing (agentputer.com → Cloudflare Pages)
- `web/` = Next.js Dashboard (app.agentputer.com → Vercel)
- 两个独立应用，统一 Git 管理

---

## 技术债务

| 项 | 优先级 | 描述 | 状态 |
|----|--------|------|------|
| SSH 函数重复 | 中 | setup-token/pair/create 各有 executeSSHCommand | 未处理 |
| ~~Auth 自动化~~ | ~~高~~ | ~~Anthropic Token 手动配置~~ | v0.4.0 已解决 |
| 错误恢复 | 中 | VPS 创建失败后无自动重试 | 未处理 |
| ~~app.agentputer.com~~ | ~~高~~ | ~~Next.js 部署并绑定域名~~ | v0.4.0 已解决 |
| API Key 安全 | 高 | 用户 VPS 可读取平台 API Key，需 Proxy 架构 | 未处理 |
| API Key 成本 | 中 | OAuth Token 受订阅限制，多用户需切开发者 Key | 未处理 |
| Packer 镜像更新 | 中 | 预置 onboard 减少 VPS 创建时间 | 未处理 |
| ~~LCP 性能~~ | ~~中~~ | ~~字体闪烁 + below-fold 延迟渲染~~ | v0.6.0 已解决 |
| ~~Features 页面~~ | ~~高~~ | ~~产品特性详情页~~ | v0.7.0 已完成 |
| Pricing 页面 | 高 | 定价页面待开发 | 未处理 |
| Docs 页面 | 中 | 文档页面待开发 | 未处理 |
| 中文版 Features | 低 | `/zh/features` 中文版 Features 页面 | 未处理 |
| 自托管字体 | 低 | Google Fonts → 本地托管，消除外部依赖 | 未处理 |
