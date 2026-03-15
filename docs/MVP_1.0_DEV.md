# AgentPuter MVP 1.0 开发文档

> **版本**: 1.3  
> **更新日期**: 2026-02-04  
> **开发周期**: 5 天  
> **状态**: 核心功能已上线

---

## 1. 项目结构

```
agentputer/web/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Landing Page
│   │   ├── layout.tsx                        # 根布局 (Clerk Provider)
│   │   ├── globals.css                       # 全局样式
│   │   ├── creating/
│   │   │   └── page.tsx                      # VPS 创建等待页
│   │   ├── dashboard/
│   │   │   ├── page.tsx                      # Dashboard 主页
│   │   │   ├── CopyButton.tsx                # 复制按钮组件
│   │   │   ├── TelegramSetup.tsx             # Telegram 配置组件 (Token + Code)
│   │   │   └── TelegramPairing.tsx           # Telegram 配对逻辑
│   │   ├── sign-in/[[...sign-in]]/page.tsx   # Clerk 登录页
│   │   ├── sign-up/[[...sign-up]]/page.tsx   # Clerk 注册页
│   │   └── api/
│   │       ├── vps/
│   │       │   ├── create/route.ts           # POST: 创建 VPS
│   │       │   └── status/route.ts           # GET: 查询 VPS 状态
│   │       ├── telegram/
│   │       │   ├── setup-token/route.ts      # POST: 配置 Telegram Bot Token
│   │       │   └── pair/route.ts             # POST: Telegram 配对码验证
│   │       └── webhooks/
│   │           └── clerk/route.ts            # POST: Clerk 用户创建 Webhook
│   ├── lib/
│   │   └── db.ts                             # Drizzle ORM + Schema
│   └── middleware.ts                          # Clerk 中间件
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts
└── .env.local

agentputer/docs/
├── MVP_1.0_PRD.md                             # 产品需求文档
├── MVP_1.0_DEV.md                             # 本文档
└── AgentPuterLandingPage.pen                  # Landing Page 设计稿

agentputer/infra/
└── packer/
    └── openclaw.pkr.hcl                       # Packer 镜像构建
```

---

## 2. 数据库 Schema (1 张表)

```typescript
// src/lib/db.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }),
  vpsIp: varchar('vps_ip', { length: 50 }),
  vpsPassword: varchar('vps_password', { length: 255 }),
  hetznerServerId: varchar('hetzner_server_id', { length: 255 }),
  status: varchar('status', { length: 50 }).default('pending'),
  // pending → creating → ready → error
  telegramPaired: varchar('telegram_paired', { length: 50 }).default('false'),
  // null/false → token_set → true
  createdAt: timestamp('created_at').defaultNow(),
});

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema: { users } });
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `clerk_id` | VARCHAR | Clerk 用户 ID (唯一) |
| `email` | VARCHAR | 用户邮箱 |
| `vps_ip` | VARCHAR | Hetzner VPS 公网 IP |
| `vps_password` | VARCHAR | root SSH 密码 (随机生成) |
| `hetzner_server_id` | VARCHAR | Hetzner 服务器 ID |
| `status` | VARCHAR | `pending` → `creating` → `ready` → `error` |
| `telegram_paired` | VARCHAR | `null/false` → `token_set` → `true` |
| `created_at` | TIMESTAMP | 创建时间 |

---

## 3. API 路由 (4 个)

### 3.1 POST `/api/vps/create` — 创建 VPS

**功能**: 触发 Hetzner VPS 创建

**流程**:
1. Clerk 认证检查
2. 检查用户是否已有 VPS (幂等)
3. 生成 16 位随机密码
4. 调用 Hetzner API 创建服务器 (cpx11, 2vCPU/2GB)
5. 使用 cloud-init 设置 root 密码
6. 更新数据库状态

**关键参数**:
```json
{
  "server_type": "cpx11",
  "image": 355546818,   // agentputer-openclaw-v1 快照 ID
  "location": "ash",     // Ashburn, VA, US
  "user_data": "#cloud-config\nchpasswd..."
}
```

### 3.2 GET `/api/vps/status` — 查询状态

**功能**: 前端轮询 VPS 创建进度

**返回**:
```json
{
  "status": "ready",
  "ip": "5.161.xxx.xxx",
  "openclawUrl": "http://5.161.xxx.xxx:18789"
}
```

### 3.3 POST `/api/telegram/setup-token` — 配置 Telegram Bot Token

**功能**: 通过 SSH 在 VPS 上配置 Telegram Bot

**流程**:
1. 验证 Token 格式 (`/^\d+:[A-Za-z0-9_-]+$/`)
2. SSH 连接到 VPS
3. 写入 systemd service 文件
4. 执行 `openclaw channels add --channel telegram --token "..."` 
5. 重启 OpenClaw 服务
6. 验证服务状态
7. 更新 `telegram_paired = "token_set"`

### 3.4 POST `/api/telegram/pair` — Telegram 配对

**功能**: 用用户从 Telegram 获取的配对码完成配对

**流程**:
1. 验证 code 格式 (≥4 字符)
2. SSH 连接到 VPS
3. 执行 `openclaw pairing approve telegram <CODE>`
4. 检查结果是否包含 "approved"
5. 更新 `telegram_paired = "true"`

### 3.5 POST `/api/webhooks/clerk` — Clerk Webhook

**功能**: 用户注册时自动创建数据库记录

---

## 4. 前端组件

### 4.1 Landing Page (`page.tsx`)

简洁的产品介绍页:
- Hero: "Your AI Never Sleeps" + CTA
- 终端预览效果
- 功能要点: 2-minute setup / €4/month / Your own VPS

### 4.2 等待页 (`creating/page.tsx`)

- `useEffect` 触发 `POST /api/vps/create`
- 每 3 秒轮询 `GET /api/vps/status`
- 状态 `ready` 时自动跳转 `/dashboard`

### 4.3 Dashboard (`dashboard/page.tsx`)

Server Component，渲染:
- OpenClaw WebChat 卡片 (外链)
- Telegram 配置卡片 (Client Component)
- VPS 信息卡片 (IP / SSH / 密码 blur hover)
- Quick Tips

### 4.4 TelegramSetup (`TelegramSetup.tsx`)

Client Component，三阶段状态机:
```
currentStatus === null/false → TokenSetupStep (输入 Bot Token)
currentStatus === "token_set" → PairingCodeStep (输入配对码)
currentStatus === "true"      → ✅ Connected 成功状态
```

### 4.5 CopyButton (`CopyButton.tsx`)

一键复制到剪贴板，带成功反馈动效。

---

## 5. SSH 远程执行

所有 VPS 管理操作通过 `ssh2` 库实现:

```typescript
import { Client } from "ssh2";

function executeSSHCommand(
  host: string,
  password: string,
  command: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let output = "";

    conn.on("ready", () => {
      conn.exec(command, (err, stream) => {
        if (err) { conn.end(); reject(err); return; }
        stream
          .on("close", () => { conn.end(); resolve(output.trim()); })
          .on("data", (data: Buffer) => { output += data.toString(); })
          .stderr.on("data", (data: Buffer) => { output += data.toString(); });
      });
    })
    .on("error", reject)
    .connect({ host, port: 22, username: "root", password, readyTimeout: 10000 });
  });
}
```

**注意**: 此函数在 `setup-token/route.ts` 和 `pair/route.ts` 中各有一份，后续应提取到 `lib/ssh.ts` 共享。

---

## 6. 环境变量

```bash
# .env.local

# Clerk 认证
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx

# Clerk 路由
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/creating
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/creating

# 数据库 (Neon PostgreSQL)
DATABASE_URL=postgresql://...

# Hetzner Cloud
HETZNER_API_TOKEN=xxx
```

---

## 7. VPS 镜像 (Packer)

```hcl
# infra/packer/openclaw.pkr.hcl

source "hcloud" "openclaw" {
  token         = var.hcloud_token
  image         = "ubuntu-22.04"
  location      = "ash"
  server_type   = "cpx11"
  ssh_username  = "root"
  snapshot_name = "agentputer-openclaw-v1"
}

build {
  sources = ["source.hcloud.openclaw"]
  provisioner "shell" {
    inline = [
      "apt-get update",
      "curl -fsSL https://deb.nodesource.com/setup_22.x | bash -",
      "apt-get install -y nodejs",
      "npm install -g openclaw@latest",
      "openclaw onboard --install-daemon",
    ]
  }
}
```

**镜像内容**: Ubuntu 22.04 + Node.js 22 + OpenClaw (systemd daemon)

---

## 8. 部署

```bash
# 1. 构建 Packer 镜像 (一次性)
cd infra/packer
packer build -var "hcloud_token=$HETZNER_API_TOKEN" openclaw.pkr.hcl

# 2. 推送数据库 Schema
cd web
npx drizzle-kit push

# 3. 部署 Next.js 到 Vercel
vercel deploy --prod
```

---

## 9. VPS 上的 OpenClaw 配置

### 9.1 服务文件

```ini
# /etc/systemd/system/openclaw.service
[Unit]
Description=OpenClaw AI Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root
ExecStart=/usr/bin/openclaw gateway --port 18789
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### 9.2 Anthropic Auth 配置

OpenClaw **不读取环境变量** (`Shell env: off`)，需通过 `auth-profiles.json`:

```json
// /root/.openclaw/agents/main/agent/auth-profiles.json
{
  "version": 1,
  "profiles": {
    "anthropic:manual": {
      "type": "token",
      "provider": "anthropic",
      "token": "sk-ant-oat01-..."
    }
  }
}
```

**获取 Token 方式**:
```bash
# 方式 1: Claude CLI OAuth (推荐 - MAX 账户)
npm install -g @anthropic-ai/claude-code
claude setup-token
# 浏览器授权后获得 sk-ant-oat01-... token
openclaw models auth setup-token

# 方式 2: Anthropic API Key (付费 API 账户)
# 直接写入 auth-profiles.json
```

### 9.3 常用运维命令

```bash
# 查看服务状态
systemctl status openclaw.service

# 查看日志
openclaw logs --follow

# 查看模型状态
openclaw models status

# 强制重启 (清理残留进程)
pkill -9 -f openclaw
systemctl restart openclaw.service

# 检查端口占用
lsof -i :18789
```

---

## 10. 开发 vs 生产模式

| 项 | 开发模式 | 生产模式 |
|----|---------|---------|
| VPS 创建 | 模拟 5s 延迟 + 假 IP | 调用 Hetzner API |
| Telegram 配置 | 直接更新 DB 状态 | SSH 执行 `openclaw channels add` |
| Telegram 配对 | 直接标记成功 | SSH 执行 `openclaw pairing approve` |
| 判断条件 | `HETZNER_API_TOKEN` 不存在或为占位符 | `HETZNER_API_TOKEN` 有效 |
| VPS 密码 | `DevPassword123!` | 16 位随机密码 |

---

## 11. 技术栈总结

| 项 | 选择 | 版本 |
|----|------|------|
| 前端框架 | Next.js (App Router) | 16 |
| UI | Tailwind CSS | 4 |
| 认证 | Clerk | latest |
| 计费 | Stripe (Checkout + Webhooks + Portal) | latest |
| 数据库 | PostgreSQL (Neon) | - |
| ORM | Drizzle | latest |
| VPS 供应商 | Hetzner Cloud | - |
| AI Agent | OpenClaw | latest |
| LLM | Anthropic Claude | opus-4-5 |
| SSH | ssh2 (Node.js) | latest |
| 部署 | Vercel | - |

---

## 12. Phase 2: Stripe 计费系统 (规划中)

> **竞品参考**: SimpleClaw $49/月含 $15 AI Credits，通过 Stripe + Klarna 收费  
> **目标**: 替换邀请码门控为 Stripe 订阅付费  
> **定价**: AgentPuter Pro $29/mo — 单档制，含 $20 AI Credits + 全渠道 + 7天免费试用  
> **Stripe Product**: `prod_TwkTZzqdgmu4pC` / Price: `price_1SyqyeFdHJyOdgUpfiLBl6Yk`

### 12.1 新增依赖

```bash
pnpm add stripe
```

### 12.2 新增环境变量

```bash
# .env.local 新增
STRIPE_SECRET_KEY=sk_test_51SyqS9FdHJyOdgUp...  # Stripe 沙盒
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SyqS9FdHJy...
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_1SyqyeFdHJyOdgUpfiLBl6Yk  # AgentPuter Pro $29/mo
```

### 12.3 数据库 Schema 升级

`users` 表新增字段:

```typescript
// src/lib/db.ts 新增
stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
subscriptionStatus: varchar('subscription_status', { length: 50 }).default('none'),
// none → active → past_due → canceled → expired
plan: varchar('plan', { length: 50 }).default('pro'),  // MVP 单档
creditsBalance: integer('credits_balance').default(0),
currentPeriodEnd: timestamp('current_period_end'),
```

### 12.4 新增 API 路由 (3 个)

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/stripe/checkout` | POST | 创建 Stripe Checkout Session → 返回付费 URL |
| `/api/stripe/portal` | POST | 创建 Stripe Customer Portal Session → 管理订阅 |
| `/api/webhooks/stripe` | POST | 处理 Stripe Webhook 事件 |

### 12.5 路由逻辑更新

```
登录 → 检查 subscription_status
  ├── "active" + VPS ready → /dashboard
  ├── "active" + 无 VPS → /creating (触发创建)
  ├── "past_due" → /dashboard (显示续费提醒)
  ├── "canceled" → /pricing (显示重新订阅)
  └── "none" → /pricing (首次付费)
邀请码用户兼容: inviteCode 存在 → 跳过付费
```

### 12.6 VPS 生命周期管理

| 订阅状态 | VPS 操作 | Hetzner API |
|---------|---------|-------------|
| active | 正常运行 | — |
| past_due | 保持运行 + 72h 宽限 | — |
| canceled | 计费周期结束后关机 | `POST /servers/{id}/actions/shutdown` |
| expired (30天+) | 删除 VPS | `DELETE /servers/{id}` |
| 重新订阅 | 恢复/重建 | `POST /servers/{id}/actions/poweron` |

---

## 13. 已知技术债务

| 项 | 描述 | 优先级 |
|----|------|--------|
| SSH 函数重复 | `setup-token` 和 `pair` 各有一份 executeSSHCommand | 中 |
| 密码字符 | 生成的密码含特殊字符，SSH 使用时需转义 | 中 |
| Auth 自动化 | Anthropic Token 目前需手动 SSH 配置 | 高 |
| 错误恢复 | VPS 创建失败后无重试机制 | 中 |
| SFTP | 文件操作应迁移到 SFTP 而非 SSH exec cat | 低 |
