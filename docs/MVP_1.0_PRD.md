# AgentPuter MVP 1.0 产品需求文档

> **版本**: 1.3  
> **更新日期**: 2026-02-04  
> **开发周期**: 5 天  
> **状态**: MVP 核心功能已完成

---

## 1. 产品定位

**一句话**: 一键部署 OpenClaw AI Agent 到云端 VPS，通过 Telegram 随时对话

**用户拿到的**:
```
🎉 Your AI Agent is Ready!

IP: 5.161.xxx.xxx
OpenClaw WebChat: http://5.161.xxx.xxx:18789
SSH: ssh root@5.161.xxx.xxx
Telegram: @YourBotName — 已配对，随时聊天
```

---

## 2. 用户旅程

```
Landing Page → 点击 "Deploy Now"
      ↓
注册 (Clerk - 邮箱/Google)
      ↓
等待页 (~2min) - 实时进度条
      ↓
Dashboard 结果页:
  ├── OpenClaw WebChat 链接 (一键打开)
  ├── VPS 信息 (IP / SSH / Root 密码)
  ├── Telegram Bot Token 配置 (Step 1)
  └── Telegram Pairing Code 配对 (Step 2)
      ↓
用户通过 Telegram 或 WebChat 与 AI 24/7 对话
```

---

## 3. 页面设计

### 3.1 Landing Page `/`

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              One Click. AI Always On.                       │
│                                                             │
│    Deploy OpenClaw to your own cloud VPS in 2 minutes.     │
│    Connect Telegram. Chat with your AI from anywhere.      │
│                                                             │
│                   [ Deploy Now — Free → ]                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ✓ 2-minute setup    ✓ €4/month    ✓ Your own VPS        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 等待页 `/creating`

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                Creating Your AI Agent...                    │
│                                                             │
│                ████████████░░░░░░░░  60%                   │
│                                                             │
│                Estimated: ~1 minute left                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Dashboard `/dashboard`

```
┌─────────────────────────────────────────────────────────────┐
│  AgentPuter                                   [Sign Out]    │
│                                                             │
│              🎉 Your AI Agent is Ready!                     │
│              Your personal OpenClaw is running 24/7         │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────────┐│
│  │ ● OpenClaw WebChat   │  │ ● Telegram Connection        ││
│  │                      │  │                              ││
│  │ Chat with your AI    │  │ Step 1: Paste Bot Token      ││
│  │ directly in browser  │  │ [_________________] [Save]   ││
│  │                      │  │                              ││
│  │ [ Open WebChat → ]   │  │ Step 2: Enter Pairing Code   ││
│  │                      │  │ [____CODE____] [Connect]     ││
│  └──────────────────────┘  └──────────────────────────────┘│
│                                                             │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 🖥️ VPS Access (Advanced)                                ││
│  │                                                          ││
│  │  IP Address:    5.161.xxx.xxx          [Copy]           ││
│  │  SSH Command:   ssh root@5.161.xxx.xxx [Copy]           ││
│  │  Root Password: ●●●●●●●●●●            [Copy]           ││
│  └──────────────────────────────────────────────────────────┘│
│                                                             │
│  📚 Quick Tips                                              │
│  • WebChat — 浏览器直接对话                                  │
│  • Telegram — 发消息给 Bot 获取配对码                        │
│  • SSH — 高级配置完全控制                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 功能需求

### 4.1 已完成 (P0) ✅

| 功能 | 说明 | 状态 |
|------|------|------|
| Landing Page | 静态页面 + CTA → 注册 | ✅ 完成 |
| 用户注册/登录 | Clerk (邮箱 + Google) | ✅ 完成 |
| VPS 自动创建 | Hetzner API + cloud-init | ✅ 完成 |
| 等待页 | 轮询 VPS 状态，自动跳转 | ✅ 完成 |
| Dashboard | IP / SSH / 密码 / OpenClaw 链接 | ✅ 完成 |
| Telegram Token 配置 | Dashboard 输入 Bot Token → SSH 注入 VPS | ✅ 完成 |
| Telegram 配对 | Dashboard 输入 Pairing Code → SSH 执行 | ✅ 完成 |
| Packer 镜像 | 预装 OpenClaw + Node.js | ✅ 完成 |
| VPS 密码管理 | cloud-init 设置 + Dashboard 展示 | ✅ 完成 |

### 4.2 手动配置 (需用户 SSH)

| 功能 | 说明 |
|------|------|
| Anthropic Auth | Claude CLI OAuth Token (setup-token) 或 API Key |
| 模型切换 | `openclaw models set` 命令 |
| Agent 自定义 | `openclaw agents` 命令 |

### 4.3 Phase 2: 计费系统 (P0) 🔥

> **竞品参考**: SimpleClaw 定价 $49/月（含 $15 AI credits）  
> **目标**: 用 Stripe 替换邀请码门控，实现自助付费 → 自动部署闭环

| 功能 | 说明 | 优先级 |
|------|------|--------|
| Stripe Checkout | 创建订阅支付链接，重定向到 Stripe 付费页 | P0 |
| Stripe Webhook | 处理订阅生命周期事件（付费成功/续费/取消/过期） | P0 |
| Pricing 页面 | 替换 `/invite`，展示套餐 + 付费入口 | P0 |
| DB Schema 升级 | 新增 stripe_customer_id / subscription_id / subscription_status 等字段 | P0 |
| 流程改造 | 登录 → 选套餐 → 付费 → 自动创建 VPS → Dashboard | P0 |
| Dashboard 订阅管理 | 显示订阅状态 / 到期时间 / Stripe Customer Portal | P1 |
| VPS 生命周期 | 订阅取消→关机不删除，续费→恢复，30天过期→删除 | P1 |

#### 定价方案

| 套餐 | 月费 | 包含内容 |
|------|------|---------|
| **Pro** | $29/月 | 1 VPS (cpx11) + $20 AI credits/月 + 全渠道 (Telegram/Discord/Web) + 7天免费试用 |

> MVP 阶段只做一档，降低用户决策复杂度。邀请码入口保留，作为免费体验通道与付费并行。
>
> **Stripe 产品 ID (Test)**:
> - Product: `prod_TwkTZzqdgmu4pC`
> - Price: `price_1SyqyeFdHJyOdgUpfiLBl6Yk`

#### Pricing 页面设计理念 (v7 — 最短路径)

| 原则 | 做法 | 理由 |
|------|------|------|
| **单卡制** | 砍掉 Starter $9 和 Team $59，只留 Pro $29 | 没有选择 = 没有犹豫 = 最高转化率 |
| **7天免费试用** | CTA 是 "Start Free Trial" 而非 "Pay Now" | 比低价档更有吸引力，漏斗最宽 |
| **信任条紧贴 CTA** | Stripe + SSL + Cancel anytime + No CC | 消除支付顾虑的 4 大信号 |
| **FAQ 只留 3 条** | What's included / Free trial / How fast | 只回答阻碍付款的核心问题 |
| **页面高度砍 70%** | 删掉 Mac Mini 对比/价值分析/策略说明 | 这些内容适合博客，不适合定价页 |

> 参考: SimpleClaw 也是单档 $49/mo，无低价档，照样卖得动

#### 付费用户旅程 (最短路径: 3 步)

```
Landing Page → 点击 "Deploy Now"
      ↓
注册 (Clerk - 邮箱/Google)
      ↓
Pricing 页 — 选择套餐
      ↓
Stripe Checkout — 输入信用卡付费
      ↓
Stripe Webhook → checkout.session.completed
      ↓
自动触发 VPS 创建 → 等待页 (~2min)
      ↓
Dashboard:
  ├── OpenClaw WebChat 链接
  ├── VPS 信息 (IP / SSH / Root 密码)
  ├── Telegram 配置
  └── 订阅管理 (套餐/到期时间/Customer Portal)
      ↓
每月自动续费 (Stripe invoice.paid → 刷新 AI credits)
```

#### 订阅状态机

```
none → active → past_due → canceled → expired
  │       │         │          │          │
  │       │         │          │          └─ 超过30天 → 删除 VPS
  │       │         │          └─ 计费周期结束 → 关机 VPS（不删除）
  │       │         └─ 支付失败 → 72h 宽限期，发邮件提醒
  │       └─ 正常运行
  └─ 首次付费或重新订阅
```

#### Stripe 事件处理

| Stripe 事件 | 系统动作 |
|-------------|---------|
| `checkout.session.completed` | 写入 subscription 信息 → 触发 VPS 创建 |
| `invoice.paid` | 刷新 AI credits → 更新 currentPeriodEnd |
| `customer.subscription.updated` | 同步状态（升级/降级/过期） |
| `customer.subscription.deleted` | 标记 canceled → 周期结束后关机 VPS |
| `invoice.payment_failed` | 标记 past_due → 发提醒邮件 |

### 4.4 后续迭代 (P2)

| 功能 | 优先级 |
|------|--------|
| Claude Auth 自动化 | 高 — Dashboard 配置 Anthropic Token |
| 状态监控面板 | 中 — Agent 状态、日志可视化 |
| 一键重启 | 中 — VPS / OpenClaw 服务重启 |
| 自定义域名 | 低 |
| 多 Agent 管理 | 低 |

---

## 5. 技术架构

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  用户浏览器  │────→│  Next.js App │────→│  Hetzner Cloud  │
│  (Dashboard) │     │  (Vercel)    │     │  (VPS)          │
└─────────────┘     └──────────────┘     └─────────────────┘
                         │                      │
                    ┌────┴────┐           ┌─────┴──────┐
                    │  Clerk  │           │  OpenClaw   │
                    │  Auth   │           │  (systemd)  │
                    ├─────────┤           ├────────────┤
                    │  Neon   │           │  Telegram   │
                    │  (PG)   │           │  Bot API    │
                    ├─────────┤           ├────────────┤
                    │ Stripe  │           │  Anthropic  │
                    │ Billing │           │  (Claude)   │
                    └─────────┘           └────────────┘
```

| 项 | 选择 |
|----|------|
| 前端 | Next.js 16 (App Router) |
| 认证 | Clerk |
| 计费 | Stripe (Checkout + Webhooks + Customer Portal) |
| 数据库 | PostgreSQL (Neon) + Drizzle ORM |
| VPS | Hetzner Cloud |
| AI Agent | OpenClaw |
| LLM | Anthropic Claude (OAuth Token) |
| 消息通道 | Telegram Bot API |
| SSH | ssh2 (Node.js) |

---

## 6. 数据库 Schema

```sql
users 表:
  id              UUID PRIMARY KEY
  clerk_id        VARCHAR(255) UNIQUE NOT NULL
  email           VARCHAR(255)
  invite_code     VARCHAR(50)         -- 使用的邀请码（保留兼容）
  vps_ip          VARCHAR(50)
  vps_password    VARCHAR(255)
  hetzner_server_id VARCHAR(255)
  telegram_bot_token VARCHAR(255)
  telegram_paired    VARCHAR(50)      -- null | "token_set" | "true"
  status          VARCHAR(50)         -- pending | creating | ready | error

  -- Phase 2: 计费相关字段
  stripe_customer_id     VARCHAR(255)    -- Stripe Customer ID
  stripe_subscription_id VARCHAR(255)    -- Stripe Subscription ID
  subscription_status    VARCHAR(50)     -- none | active | past_due | canceled | expired
  plan                   VARCHAR(50)     -- pro (MVP 单档)
  credits_balance        INTEGER DEFAULT 0  -- AI credits 余额 (cents)
  current_period_end     TIMESTAMP       -- 当前计费周期结束时间

  created_at      TIMESTAMP
```

---

## 7. 开发日志

| 日期 | 完成内容 | Git Commit |
|------|---------|------------|
| Day 1 | Astro Landing Page 上线 (agentputer.com) | `df724fc` |
| Day 2 | 项目初始化 + Clerk 集成 + Hetzner VPS 创建 | `92ca623` |
| Day 3 | Dashboard + VPS 信息 + Telegram 配置 | `92ca623` |
| Day 4 | Anthropic Auth 调试 (Claude OAuth Token) + 端到端测试 | — |
| Day 5 | Landing Page 接入一键部署入口 + 文档更新 + Git 初始化 | `fca6435` |

> 详细变更记录见 `docs/CHANGELOG.md`

---

## 8. 已知问题 & 经验

### 8.1 Anthropic Auth

- OpenClaw 有 `Shell env: off` 设置，**不读取环境变量**中的 API Key
- 正确方式: 使用 `claude setup-token` 获取 OAuth Token → 写入 `auth-profiles.json`
- Token 路径: `/root/.openclaw/agents/main/agent/auth-profiles.json`

### 8.2 SSH 密码特殊字符

- cloud-init 生成的密码含 `$` 和 `!`，在 shell 中需要注意转义
- 建议: 密码生成时避免这些字符，或使用 SSH key 认证

### 8.3 OpenClaw 服务管理

- 进程残留会导致端口 18789 占用
- 重启前先 `pkill -9 -f openclaw`，再 `systemctl restart openclaw.service`

---

## 9. 成功标准

| 指标 | 目标 | 当前状态 |
|------|------|---------|
| 注册到拿到 IP | < 3 分钟 | ✅ ~2 分钟 |
| VPS 创建成功率 | > 99% | ✅ 正常 |
| OpenClaw 可访问 | VPS 启动后即可用 | ✅ |
| Telegram 配对 | Dashboard 操作完成 | ✅ Token+Code 流程 |
| AI 对话 | 通过 Telegram/WebChat 正常回复 | ⏳ 需用户配置 Auth |
