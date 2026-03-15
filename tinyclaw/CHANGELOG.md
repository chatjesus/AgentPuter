# TinyClaw Changelog

All notable changes to TinyClaw will be documented here.
Format: `[version] YYYY-MM-DD — summary`

---

## [v0.8.1] 2026-02-23 — 默认模型切换 Sonnet + 新用户部署稳定性修复

### Product
- **默认 AI 模型切换为 Claude Sonnet 4.6** — 降低运营成本，性能与 Opus 持平；全站文案统一为"Claude 4.6"（不显示具体系列名）
- **Docker 镜像 openclaw 升级至 2026.2.22-2** — 与主机版本对齐，消除版本差异

### 后端
- **`api/vps/create/route.ts`** — 多项部署稳定性修复：
  - **端口分配脚本修复** — 替换缺失的 `allocate-port.sh`，改为内联 bash 扫描 19000–19100 未占用端口
  - **OPENCLAW_HOME 路径修复** — `onboard` 命令由 `OPENCLAW_HOME=${userDir}/.openclaw` 改为 `OPENCLAW_HOME=${userDir}`，消除双层 `.openclaw` 嵌套导致 config 找不到的问题
  - **openclaw.json 版本兼容 patch** — 主机版 openclaw 写入的 `commands.ownerDisplay` / `commands.ownerShortcutVersion` 字段在容器内旧版本中为非法字段；部署时（新建和重新部署两条路径）自动剔除，防止 gateway 崩溃循环
  - **清理死代码** — 移除未使用的 `platformMounts` 变量
- **`api/vps/switch-model/route.ts`** — `claude` 的 `ocModel` 由 `anthropic/claude-opus-4-5` 更新为 `anthropic/claude-sonnet-4-6`

### Bug 修复
- **新用户 WebChat `ERR_CONNECTION_RESET`** — 根因：容器因 `ownerDisplay` 配置无效字段陷入崩溃循环，端口始终不监听；修复同上
- **部署 500 `Invalid port: bash: /op`** — 缺失的 `allocate-port.sh` 脚本导致端口分配失败；修复：改用内联命令
- **部署 500 `onboard failed: aw/workspace Sessions OK`** — `OPENCLAW_HOME` 双层嵌套导致 `configCheck` 找不到 `openclaw.json`；修复：路径修正

### 基础设施
- VPS2（5.161.200.75）Docker 镜像 `openclaw-tc:latest` 手动升级至 `2026.2.22-2`

### Git
- Branch: `dev` → `main`

---

## [v0.8.0] 2026-02-22 — 全模型图片生成（Vertex AI Gemini Image）

### Product
- **所有模型用户均支持 AI 生图** — 无论选择 Claude、GPT 还是 Gemini，均可通过 `nano-banana` skill 在 WebChat / Telegram / Discord / WhatsApp 内直接生成图片
- **图片后端自动切换** — 优先使用 Vertex AI Gemini 3 Pro Image（平台级 SA JSON，无需用户提供任何凭证），不可用时自动 fallback 到 OpenAI DALL-E 3
- **WebChat 内联显示** — 生成的图片自动上传至公开 HTTPS URL（优先 GCS，fallback catbox.moe），AI 以 Markdown 图片语法 `![](url)` 回复，WebChat 直接渲染 `<img>`，无需点击链接

### 后端
- **`skills/nano-banana-vertex/scripts/generate_image_unified.py`** *(新)* — 统一图片生成脚本，取代旧 `generate_image_vertex.py`
  - `_setup_vertex_credentials()` — 自动检测 `GOOGLE_APPLICATION_CREDENTIALS` 或 `/root/.openclaw/.gcp-sa.json`（无需容器重建）；从 SA JSON 内自动解析 `project_id`
  - `generate_vertex()` — Vertex AI Gemini 3 Pro Image 后端（支持文生图 + 图编辑 + 多图合成最多 14 张）
  - `generate_openai()` — OpenAI DALL-E 3 后端（纯标准库 `urllib.request`，无需 `openai` 包）
  - `_get_openai_key()` — 优先读环境变量，fallback 读 `/root/.openclaw/.openai-key` 文件
  - `upload_to_public_url()` — 图片缩放至 max 560px（防溢出聊天气泡）后上传公开 URL
  - PIL 为可选依赖：无 PIL 时 DALL-E 3 直接写原始字节，仍能正常生图
- **`api/vps/create/route.ts`** — 新建容器行为变更：
  - SA JSON 写入从"仅 Gemini 用户"扩展为**所有用户**（Claude/GPT 容器同样写入 `.gcp-sa.json`）
  - `vertexEnvFlags` 条件从 `config.isVertexAI` 改为 `saB64 ? ...`（有 SA 则全量注入）
  - 新增 `OPENAI_API_KEY` 注入（所有容器，供 DALL-E 3 fallback 使用）
- **`skills/nano-banana-vertex/SKILL.md`** — 更新技能定义：`name: nano-banana`，命令改为 `python3 {baseDir}/scripts/generate_image_unified.py`，新增"关键回复规则"要求 AI 必须用 `![Generated Image](url)` 格式回复

### 基础设施（现有容器热部署）
- 9 个存量用户容器全量更新：写入平台 Vertex AI SA JSON + 安装 `google-genai` / `pillow` / `python3` + 部署统一脚本
- 新 API key 通过文件 `/root/.openclaw/.openai-key` 注入，无需重建容器

### Bug 修复
- **图片在 WebChat 不渲染** — WebChat `img-src CSP` 限制为 `https:`，本地 `MEDIA: /path` 无法显示；修复：脚本输出 `IMAGE_URL: https://...`，SKILL.md 强制要求 AI 用 Markdown 图片语法回复
- **图片溢出聊天气泡** — Vertex AI 生成图分辨率高达 1024px+；修复：上传前等比缩放至 max 560px

### 清理
- 移除 `ExitIntentPopup.tsx`、`tools/openclaw-extension/background.js` 中的 debug fetch 仪器代码

---

## [v0.7.0] 2026-02-21 — WhatsApp 渠道正式上线（QR 扫码连接）

### Product
- **WhatsApp 渠道正式开放** — 用户无需提供 token，在 Dashboard 一键激活，生成 QR 图片后用手机扫码即可完成连接
- **Dashboard WhatsApp 引导** — 三步流程：激活 → 扫码生成 QR → 点击"I've Scanned"重启 agent 加载 session，连接后自动响应消息

### 前端
- **`LandingPageContent.tsx`** — WhatsApp 渠道 `disabled: false`，首页即可选择
- **`setup/page.tsx`** — WhatsApp 选中时展示提示文案"No token needed! After payment, scan a QR code in your Dashboard"
- **`dashboard/WhatsAppSetup.tsx`** *(新)* — 激活按钮、QR Canvas 渲染（正确处理 Unicode 半块字符 `▀▄█`，加 quiet zone）、扫码后重启按钮、成功态展示
- **`dashboard/page.tsx`** — WhatsApp 卡片对所有已有 VPS 的用户可见（不限于初始选 WhatsApp 的用户）

### 后端
- **`api/whatsapp/enable/route.ts`** *(新)* — 已部署后激活 WhatsApp：写入 `openclaw.json` channels 配置 + 重启容器 + 更新 DB `whatsappConnected: "configured"`
- **`api/whatsapp/qr/route.ts`** *(新)* — 后台启动 `openclaw channels login`（`docker exec -d`，进程持续运行等待扫码）→ 轮询日志文件提取 QR → 返回 ASCII QR 字符串
- **`api/whatsapp/apply/route.ts`** *(新)* — 用户扫码后调用：终止后台 login 进程 → `docker restart` 让 gateway 以保存的凭证重新接入 WhatsApp → 更新 DB `whatsappConnected: "linked"`
- **`lib/db.ts`** — `users` 表新增 `whatsappConnected` 字段（`varchar(50) default 'false'`）
- **`api/webhooks/stripe/route.ts`** — 订阅取消时同步重置 `whatsappConnected: "false"`

### Bug 修复
- **"Unsupported channel: whatsapp"** — `docker exec` 内错误覆盖 `HOME` 为宿主机路径，CLI 找不到 gateway socket，修复：移除冗余环境变量覆盖
- **QR 无法扫描** — OpenClaw 输出使用 Unicode 半块字符编码（`▀`=上暗/下亮，`▄`=上亮/下暗），原代码全部渲染为实心黑块导致 QR 矩阵错误，修复：正确解码 U+2580/U+2584 并在 canvas 中分别渲染上下半格
- **"Couldn't link device"** — `timeout 25` 在 WhatsApp 认证回调到达前就终止了 Baileys 进程，修复：改用 `docker exec -d` 后台运行 + 轮询日志文件，进程持续运行直到扫码成功

---

## [v0.6.0] 2026-02-21 — Discord 渠道正式上线 + 部署漏斗修复

### Product
- **Discord 渠道正式开放** — 用户可在 Setup 页选择 Discord，填入 Bot Token 后随部署自动注入 OpenClaw 配置，无需部署后再单独配置
- **Dashboard Discord 引导** — 配置完成后展示两步操作引导（邀请 Bot 进服务器 + 运行配对命令），用户不再迷茫

### 前端
- **`LandingPageContent.tsx`** — Discord 渠道 `disabled: false`，首页即可选择
- **`setup/page.tsx`** — 新增 `DiscordModal` 弹窗（含 Bot Token 填写引导）；Discord 渠道解除禁用；`localStorage` 存取 `tc_discord_token`；新增 `connect_discord` analytics 事件
- **`creating/page.tsx`** — 部署请求新增 `discordToken` 和 `stripeSessionId` 字段
- **`dashboard/DiscordSetup.tsx`** *(新)* — Token 配置表单 + 配置成功后的 Step 1/Step 2 引导卡片
- **`dashboard/page.tsx`** — 新增 Discord 配置卡片；引入 `BookmarkPrompt`
- **`dashboard/BookmarkPrompt.tsx`** *(新)* — 部署成功后延迟 2.5s 弹出收藏引导，"Got it" 永久关闭（`localStorage`），"Later" 本次关闭

### 后端
- **`api/discord/setup-token/route.ts`** *(新)* — 部署后配置 Discord Token 的 API；共享 VPS 模式：停容器→写配置→起容器→健康检查；独立 VPS 模式：`openclaw config set` + `systemctl restart`
- **`api/vps/create/route.ts`** — 部署时同步注入 Discord token 到 `openclaw.json`；BOOTSTRAP.md 根据 `channel` 动态生成渠道引导文案；token 注入前转义单引号防 shell 注入
- **`api/webhooks/stripe/route.ts`** — 订阅取消时同步重置 `discordConnected: "false"`（之前只重置 telegramPaired）
- **`lib/db.ts`** — `users` 表新增 `discordConnected` 字段（`varchar(50) default 'false'`）
- **`lib/analytics.ts`** — `FunnelEvent` 类型新增 `connect_discord`

### Bug 修复
- **Stripe 付款后跳回 `/subscribe` 的竞态问题** — Webhook 延迟时 `subscriptionStatus` 仍为 null，gate check 误判 402。修复：`vps/create` 接收 `stripeSessionId`，gate 被阻断时直接调 Stripe API 验证 session，支付确认则同步更新 DB 并继续部署，无需等 webhook
- **Discord token shell 注入安全** — token 注入 `node -e` 命令前统一 `.replace(/'/g, "\\'")`，同步修复 Telegram token 同类问题
- **`discord/setup-token` JSON parse 无错误处理** — `request.json()` 包 try/catch，格式错误返回友好 400

### 数据库
- 手动执行 `ALTER TABLE users ADD COLUMN IF NOT EXISTS discord_connected VARCHAR(50) DEFAULT 'false'`

### Git
- Commit: `4ea2656`
- Branch: `main`
- 部署: `vercel --prod` → `https://tinyclaw.dev`

---

## [v0.5.1] 2026-02-19 — UX 修复与多语言一致性

### 前端
- **`setup/page.tsx`** — 老用户进入 `/setup` 先显示 loading，状态检查完直接跳 `/dashboard`，不闪 setup 表单
- **`(public)/page.tsx`** — 首页改用 `useLocale()` 动态语言检测，不再硬编码英文；与 `/setup`、`/dashboard` 语言体验一致

### 后端
- **`api/vps/status/route.ts`** — 返回值新增 `subscriptionStatus` 字段，供 setup 页门控检查使用

### Git
- Branch: `main`

---

## [v0.5.0] 2026-02-19 — Telegram 后置 + 转化漏斗优化

### Product
- **Telegram 完全后置** — 付款前不再强制配置 Telegram，彻底解除漏斗最大阻塞点
- **三级可选接入** — Setup 页可选提前配、部署完成后可选配、Dashboard 随时配，均不强制

### 前端
- **`setup/page.tsx`** — 移除 `handleDeploy` 中的 Telegram 阻塞判断，点击"部署"直接进 Stripe
  - 渠道选择区标题加 `Optional — can set up after payment` 标签
  - 保留"Set up Telegram token"可选入口（小字，不影响主流程）
  - `handleTelegramConnected` 不再自动跳 Stripe，仅保存 token
- **`creating/page.tsx`** — 部署成功后新增 Telegram 可选配置步骤
  - 有 token → 直接跳 `/dashboard`
  - 无 token → 显示 Telegram 配置页（含 BotFather 步骤引导 + Skip 按钮）
- **`ExitIntentPopup.tsx`** — 按钮箭头从 emoji `➡️` 改为普通 `→`，右侧绝对定位贴边

### 后端
- **`api/stripe/checkout/route.ts`** — 新增 Stripe Customer 跨环境容错
  - 数据库中存有 live customer ID 时用 test key 会报 `resource_missing`
  - 自动捕获异常并重新创建 test customer，本地开发不再因此报错
- **`dashboard/TelegramSetup.tsx`** — Step 1 / Step 2 均加入完整操作引导
  - Step 1：BotFather 5 步图文指引 + `@BotFather` 可点链接
  - Step 2：明确提示"发任意消息给你的 bot，它会回复配对码"

### 本地开发
- `.env.local` Stripe 切换为 Test Mode（`sk_test_` + test price + Stripe CLI webhook）
- Stripe CLI webhook 转发：`stripe listen --forward-to localhost:3099/api/webhooks/stripe`

### Git
- Branch: `main`

---

## [v0.4.0] 2026-02-19 — Pricing v2 + Exit Intent + Onboarding

### Product
- **降价** $49.99/mo → **$29.99/mo**，全站所有页面、9种语言同步更新
- **7天免费试用** — Stripe Checkout 加入 `trial_period_days: 7`，绑卡后免费体验
- **新 Stripe Price ID** `price_1T2PMuLYWESu302OsZc7eYDN`（TinyClaw Pro $29.99）
- **Skills 导航入口** — 顶部导航栏加入 [skillsranking.com](https://skillsranking.com) 链接

### 前端
- **ExitIntentPopup** — 首页挽留弹窗
  - 鼠标移出浏览器顶部触发（`mouseleave + clientY <= 0`）
  - 页面停留 3s 后激活，每次会话只触发一次（`sessionStorage`）
  - 24小时倒计时（跨页面持久化，存 `localStorage`）
  - 箭头 ➡️ 弹跳动效
  - 移动端自动禁用
- **隐藏 Demo Chat Widget** — 首页恢复为直接展示部署流程（模型选 → 频道选 → 登录）
- **Hydration 修复** — `<body suppressHydrationWarning>` 解决 Grammarly 等浏览器扩展注入属性导致的 SSR mismatch

### 后端
- **BOOTSTRAP.md 注入** — 用户容器创建时自动写入引导文件，OpenClaw 首次对话主动完成新用户 onboarding（介绍功能 → 推荐 Skills → 引导连接 Telegram → 设置身份）
- **OpenClaw Demo 编排器** — 新增 `/api/demo/session` API，对接 VPS orchestrator（65.108.251.173:4000），为匿名访客启动隔离 OpenClaw 进程

### 新文件
| 文件 | 说明 |
|------|------|
| `src/components/ExitIntentPopup.tsx` | 挽留弹窗组件 |
| `src/components/DemoChat.tsx` | OpenClaw Demo 入口组件 |
| `src/app/api/demo/session/route.ts` | Demo session 代理接口 |
| `src/app/api/demo/chat/route.ts` | Demo chat 接口（旧版，已被 session 方案替代） |
| `src/app/try/page.tsx` | `/try` 全屏 Demo 页 |

### Git
- Commit: `d199b34`
- Branch: `main`

---

## [v0.3.0] 2026-02 — Vertex AI Gemini + 多模型支持

### 后端
- **Vertex AI 支持** — 接入 Google Vertex AI，使用 Service Account JSON 认证
- **Gemini 模型** — `google-vertex/gemini-3-flash-preview` 作为 Gemini 选项默认模型
- **模型切换 API** — `/api/vps/switch-model` 支持用户在 Dashboard 切换 Claude / GPT / Gemini
- **Docker 共享 VPS 模式** — `SHARED_VPS_HOST` 环境变量启用单机 Docker 隔离方案（替代独立 Hetzner VPS）

### 修复
- Vertex AI 不能使用 `--auth-choice vertex-ai`，改为 SA JSON 写入 + 环境变量注入
- Docker 容器 Gemini 模型设置通过 `docker exec openclaw models set` 完成

### Git
- Commits: `2dd35a3`, `9374033`

---

## [v0.2.0] 2026-01 — Dashboard + 多渠道 + Telegram 配对

### Product
- Dashboard 页面：VPS 状态、模型显示、Telegram 配对入口
- ModelSwitcher 组件
- Telegram bot token 配对流程
- 部署失败时显示 Contact Support 入口

### 后端
- `/api/vps/status` — 查询用户 VPS 部署状态
- `/api/vps/switch-model` — 切换 AI 模型
- `/api/telegram/pair` — Telegram 配对
- VPS cleanup cron（取消订阅后回收资源）

### Git
- Commits: `1917dc4`, `3bbfcae`, `e3cfefd`

---

## [v0.1.0] 2025-12 — MVP 上线

### Product
- 首页 Landing Page（多语言：EN/ZH/ZH-TW/JA/KO/DE/ES/RU/AR）
- 用户注册（Clerk）→ 选模型/渠道 → Stripe 支付 → 自动部署 OpenClaw VPS
- 支持 Claude / GPT-4o / Gemini 三种模型
- 支持 Telegram / Discord / WhatsApp 三种渠道（后两者标记 Coming Soon）
- Stripe Webhook：订阅创建 / 更新 / 取消 / 支付失败
- Hetzner Cloud API 自动开机 + SSH 初始化 OpenClaw
- GA4 + Google Ads 转化追踪

### 基础设施
- Next.js 15 App Router
- Clerk Auth
- Stripe Subscriptions
- Neon PostgreSQL + Drizzle ORM
- Hetzner Cloud VPS（独立模式）/ 共享 Docker VPS（共享模式）
- Vercel 部署

---

> 维护规则：每次 git commit 后更新此文件，记录版本号、日期、改动要点。
> 版本号格式：`v主版本.功能版本.补丁` — 功能迭代加中间号，bugfix 加末位号。
