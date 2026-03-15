# AgentPuter MVP 规格文档

> **一键创建云端 OpenClaw，通过 Telegram 对话**

---

## 1. MVP 目标

### 核心价值
用户无需技术背景，一键点击即可拥有自己的云端 AI 助手，并通过 Telegram 进行对话。

### 成功指标
- 用户从注册到首次 Telegram 对话 < 5 分钟
- VPS 创建成功率 > 99%
- Telegram 绑定成功率 > 95%

---

## 2. 用户旅程

### Happy Path

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户旅程                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [1] 访问 Landing Page                                          │
│       │                                                          │
│       ▼                                                          │
│  [2] 点击 "Get Started" → 注册/登录                             │
│       │                                                          │
│       ▼                                                          │
│  [3] 进入 Dashboard → 点击 "Create My Agent"                    │
│       │                                                          │
│       ▼                                                          │
│  [4] 等待创建 (显示进度条，约 2 分钟)                            │
│       │  ├─ Provisioning VPS...                                  │
│       │  ├─ Installing OpenClaw...                               │
│       │  └─ Configuring AI Model...                              │
│       ▼                                                          │
│  [5] 创建成功 → Pod 状态变为 "Running"                          │
│       │                                                          │
│       ▼                                                          │
│  [6] 点击 "Connect Telegram"                                    │
│       │                                                          │
│       ▼                                                          │
│  [7] 引导页面：                                                  │
│       │  Step 1: 打开 Telegram，搜索 @BotFather                 │
│       │  Step 2: 发送 /newbot，创建你的 Bot                     │
│       │  Step 3: 复制 Bot Token                                  │
│       │  Step 4: 粘贴到输入框                                    │
│       ▼                                                          │
│  [8] 点击 "Connect" → 验证 + 配置写入 VPS                       │
│       │                                                          │
│       ▼                                                          │
│  [9] 绑定成功 → 显示 Bot 链接                                   │
│       │                                                          │
│       ▼                                                          │
│  [10] 点击链接 → 在 Telegram 中与 AI 对话                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 功能规格

### 3.1 Landing Page

**页面内容：**
- Hero: "Your AI Never Sleeps" + 产品介绍
- Pain Points: 本地 AI Agent 的 8 大痛点
- Solution: AgentPuter 如何解决
- How It Works: 三步开启
- Pricing: Pro $29/mo (含 $20 AI Credits + 7天免费试用)
- CTA: "Get Started" 按钮

**技术实现：**
- 框架: Next.js 14 (App Router)
- 样式: Tailwind CSS
- 动画: Framer Motion (谨慎使用)

### 3.2 用户系统

**功能：**
- 邮箱注册 + 密码登录
- OAuth: Google / GitHub
- 忘记密码 / 重置密码
- 用户 Profile 页

**技术实现：**
- 认证: Clerk
- Session: JWT

### 3.3 Dashboard (简单控制台)

**页面：**

1. **Pod 列表页** (`/dashboard`)
   - 显示用户所有 Pod
   - 每个 Pod 卡片显示：名称、状态、IP、创建时间
   - "Create New Pod" 按钮

2. **Pod 详情页** (`/dashboard/pods/:id`)
   - Pod 基本信息
   - 状态指示器 (Provisioning / Running / Stopped / Error)
   - Telegram 绑定状态
   - "Connect Telegram" 按钮
   - "Delete Pod" 按钮

3. **Telegram 绑定页** (`/dashboard/pods/:id/telegram`)
   - 步骤引导
   - Token 输入框
   - "Connect" 按钮
   - 绑定状态显示

**UI 组件：**
```
┌────────────────────────────────────────┐
│  Dashboard                    [User ▼] │
├────────────────────────────────────────┤
│                                        │
│  My Pods                               │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 🟢 My First Agent                 │ │
│  │    Status: Running                │ │
│  │    IP: 168.119.xxx.xxx           │ │
│  │    Telegram: Connected ✓          │ │
│  │                      [Details →]  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │           + Create New Pod        │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

### 3.4 一键创建 VPS (Control Plane)

**流程：**

```
用户点击 "Create My Agent"
         │
         ▼
┌─────────────────────────────────────────┐
│ 1. 创建 Pod 记录 (status: pending)       │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 2. 调用 Hetzner API 创建 VPS             │
│    - 区域: fsn1 (德国，最便宜)           │
│    - 规格: cx11 (1vCPU/2GB/20GB)        │
│    - 镜像: agentputer-openclaw-v1        │
│    - SSH Key: 注入我们的管理密钥         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 3. 等待 VPS 启动 (轮询状态)              │
│    - 更新 Pod 记录 (status: provisioning)│
│    - 获取 IP 地址                        │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 4. VPS 内部初始化 (cloud-init)           │
│    - 启动 OpenClaw Gateway              │
│    - 启动 agentputer-agent              │
│    - 注册到 Control Plane               │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 5. 健康检查通过                          │
│    - 更新 Pod 记录 (status: running)     │
│    - 返回成功                            │
└─────────────────────────────────────────┘
```

**预置镜像内容：**
```
/root/
├── openclaw/
│   ├── node_modules/
│   ├── openclaw.json.template
│   └── openclaw (binary)
├── agentputer-agent/
│   ├── agent.js
│   └── config.json
└── scripts/
    ├── init.sh
    └── healthcheck.sh
```

**agentputer-agent 功能：**
- 接收 Control Plane 指令 (WebSocket)
- 更新 OpenClaw 配置
- 上报健康状态
- 上报用量数据

### 3.5 Telegram 绑定引导

**引导步骤：**

```
┌────────────────────────────────────────────────────────────┐
│                   Connect Telegram                          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: Create Your Telegram Bot                          │
│  ─────────────────────────────────────────                 │
│  1. Open Telegram and search for @BotFather                │
│  2. Send /newbot command                                   │
│  3. Follow the instructions to create your bot             │
│  4. Copy the Bot Token (looks like: 123456:ABC-DEF...)     │
│                                                             │
│  [Open @BotFather →]                                       │
│                                                             │
│  Step 2: Enter Your Bot Token                              │
│  ─────────────────────────────────────────                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  [Connect Telegram]                                        │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**绑定流程：**
1. 用户输入 Bot Token
2. 前端发送到 Control Plane API
3. Control Plane 验证 Token 有效性 (调用 Telegram getMe API)
4. Control Plane 通过 agentputer-agent 写入 VPS 的 OpenClaw 配置
5. OpenClaw 重启并连接 Telegram
6. 返回绑定成功 + Bot 链接

### 3.6 AI 模型路由

**架构：**
```
User VPS (OpenClaw)
      │
      │ HTTP Request
      ▼
┌─────────────────────────────────────┐
│        AI Model Router              │
│  (https://ai.agentputer.com/v1)     │
├─────────────────────────────────────┤
│  • 验证用户身份 (Pod ID + Secret)   │
│  • 检查配额                         │
│  • 转发请求到 Claude/GPT API        │
│  • 记录 Token 用量                  │
│  • 返回响应                         │
└─────────────────────────────────────┘
      │
      ├─────────────────┬─────────────────┐
      ▼                 ▼                 ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Anthropic │     │  OpenAI  │     │  Backup  │
│  Claude   │     │   GPT    │     │  Model   │
└──────────┘     └──────────┘     └──────────┘
```

**配额管理 (通过 Stripe 订阅计费)：**
- Pro ($29/mo): $20 AI Credits/月 + 1 VPS + 全渠道 (Telegram/Discord/Web) + 7天免费试用
- AI Credits 每月随订阅自动刷新
- 超额: 暂不支持，用完即止，下月刷新
- MVP 阶段只做一档，后续根据用户数据再拆分

---

## 4. 数据库 Schema

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  invite_code VARCHAR(50),                           -- 邀请码（免费通道，保留兼容）
  plan VARCHAR(50) DEFAULT 'pro',                     -- pro (MVP 单档)

  -- Stripe 计费 (Phase 2)
  stripe_customer_id VARCHAR(255),                   -- Stripe Customer ID
  stripe_subscription_id VARCHAR(255),               -- Stripe Subscription ID
  subscription_status VARCHAR(50) DEFAULT 'none',    -- none | active | past_due | canceled | expired
  credits_balance INTEGER DEFAULT 0,                 -- AI Credits 余额 (cents)
  current_period_end TIMESTAMP,                      -- 当前计费周期结束

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pod 表
CREATE TABLE pods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',  -- pending, provisioning, running, stopped, error
  
  -- VPS 信息
  cloud_provider VARCHAR(50) DEFAULT 'hetzner',
  cloud_instance_id VARCHAR(255),
  region VARCHAR(50),
  ip_address VARCHAR(50),
  
  -- Agent 通信
  agent_secret VARCHAR(255),  -- 用于 agentputer-agent 认证
  
  -- 元数据
  config JSONB,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Telegram 绑定表
CREATE TABLE telegram_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id UUID REFERENCES pods(id) ON DELETE CASCADE,
  
  bot_token_encrypted BYTEA NOT NULL,  -- 加密存储
  bot_username VARCHAR(255),
  bot_id VARCHAR(255),
  
  status VARCHAR(50) DEFAULT 'pending',  -- pending, connected, disconnected, error
  
  connected_at TIMESTAMP,
  last_ping_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 用量记录表
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pod_id UUID REFERENCES pods(id),
  
  model VARCHAR(100),           -- claude-3-opus, gpt-4, etc.
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  cost DECIMAL(10, 6),          -- 美元
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 月度用量汇总表
CREATE TABLE monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  year_month VARCHAR(7),        -- 2024-01
  
  total_tokens BIGINT DEFAULT 0,
  total_cost DECIMAL(10, 2) DEFAULT 0,
  
  UNIQUE(user_id, year_month)
);

-- 索引
CREATE INDEX idx_pods_user_id ON pods(user_id);
CREATE INDEX idx_pods_status ON pods(status);
CREATE INDEX idx_telegram_pod_id ON telegram_bindings(pod_id);
CREATE INDEX idx_usage_user_created ON usage_logs(user_id, created_at DESC);
```

---

## 5. API 规格

### 5.1 认证

由 Clerk 处理，前端使用 Clerk React SDK。

### 5.2 Pod 管理

**创建 Pod**
```
POST /api/pods
Authorization: Bearer <clerk_token>

Request Body:
{
  "name": "My First Agent"
}

Response (201):
{
  "id": "pod_xxx",
  "name": "My First Agent",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**获取 Pod 列表**
```
GET /api/pods
Authorization: Bearer <clerk_token>

Response (200):
{
  "pods": [
    {
      "id": "pod_xxx",
      "name": "My First Agent",
      "status": "running",
      "ipAddress": "168.119.xxx.xxx",
      "telegramConnected": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**获取 Pod 详情**
```
GET /api/pods/:id
Authorization: Bearer <clerk_token>

Response (200):
{
  "id": "pod_xxx",
  "name": "My First Agent",
  "status": "running",
  "cloudProvider": "hetzner",
  "region": "fsn1",
  "ipAddress": "168.119.xxx.xxx",
  "telegram": {
    "connected": true,
    "botUsername": "my_agent_bot"
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**删除 Pod**
```
DELETE /api/pods/:id
Authorization: Bearer <clerk_token>

Response (204): No Content
```

### 5.3 Telegram 绑定

**绑定 Telegram**
```
POST /api/pods/:id/telegram
Authorization: Bearer <clerk_token>

Request Body:
{
  "botToken": "123456:ABC-DEF1234..."
}

Response (200):
{
  "status": "connected",
  "botUsername": "my_agent_bot",
  "botUrl": "https://t.me/my_agent_bot"
}

Error Response (400):
{
  "error": "INVALID_TOKEN",
  "message": "The provided bot token is invalid"
}
```

**获取 Telegram 状态**
```
GET /api/pods/:id/telegram
Authorization: Bearer <clerk_token>

Response (200):
{
  "connected": true,
  "botUsername": "my_agent_bot",
  "botUrl": "https://t.me/my_agent_bot",
  "lastPingAt": "2024-01-01T12:00:00Z"
}
```

### 5.4 用量查询

**获取当月用量**
```
GET /api/usage/current
Authorization: Bearer <clerk_token>

Response (200):
{
  "yearMonth": "2024-01",
  "totalTokens": 45000,
  "totalCost": 0.45,
  "quota": 100000,
  "quotaUsedPercent": 45
}
```

---

## 6. 技术实现

### 6.1 项目结构

```
agentputer/
├── apps/
│   └── web/                      # Next.js 应用
│       ├── app/
│       │   ├── (marketing)/      # Landing Page
│       │   │   └── page.tsx
│       │   ├── (auth)/           # 认证页面
│       │   │   ├── sign-in/
│       │   │   └── sign-up/
│       │   ├── (dashboard)/      # 控制台
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx      # Pod 列表
│       │   │   └── pods/
│       │   │       └── [id]/
│       │   │           ├── page.tsx
│       │   │           └── telegram/
│       │   └── api/              # API Routes
│       │       ├── pods/
│       │       ├── telegram/
│       │       └── usage/
│       ├── components/
│       │   ├── ui/
│       │   ├── dashboard/
│       │   └── marketing/
│       └── lib/
│           ├── db/
│           ├── cloud/            # 云厂商 API
│           └── telegram/
│
├── services/
│   └── ai-router/                # AI 模型路由服务
│       ├── src/
│       │   ├── routes/
│       │   ├── providers/
│       │   └── billing/
│       └── Dockerfile
│
├── packages/
│   └── agentputer-agent/         # VPS 内运行的 Agent
│       ├── src/
│       │   ├── websocket.ts
│       │   ├── openclaw.ts
│       │   └── healthcheck.ts
│       └── package.json
│
└── infra/
    └── packer/
        └── openclaw-image/       # VPS 镜像构建
            ├── setup.sh
            └── openclaw.json.template
```

### 6.2 环境变量

```bash
# .env.example

# App
NEXT_PUBLIC_APP_URL=https://agentputer.com

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=postgresql://...

# Hetzner
HETZNER_API_TOKEN=

# AI Router
AI_ROUTER_URL=https://ai.agentputer.com
AI_ROUTER_SECRET=

# Anthropic / OpenAI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Stripe 计费
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_1SyqyeFdHJyOdgUpfiLBl6Yk

# Encryption
ENCRYPTION_KEY=
```

---

## 7. 开发计划

### Week 1: 基础框架
- [ ] 项目初始化 (Next.js + Hono + Drizzle)
- [ ] 数据库 Schema 实现
- [ ] Clerk 集成
- [ ] Landing Page 基础版

### Week 2: Control Plane
- [ ] Hetzner API 集成
- [ ] VPS 创建流程
- [ ] Packer 镜像构建
- [ ] agentputer-agent 开发

### Week 3: Dashboard
- [ ] Pod 列表页
- [ ] Pod 详情页
- [ ] 创建 Pod 流程 + 进度展示

### Week 4: Telegram 绑定
- [ ] Telegram 绑定 UI
- [ ] Token 验证 API
- [ ] 配置写入 VPS
- [ ] 连接测试

### Week 5: AI Model Router
- [ ] 路由服务部署
- [ ] Token 计量
- [ ] 配额检查
- [ ] 用量页面

### Week 6: 测试 + 上线
- [ ] E2E 测试
- [ ] 安全审计
- [ ] 部署到生产
- [ ] 监控告警

---

## 8. 风险与对策

| 风险 | 影响 | 对策 |
|------|------|------|
| Hetzner API 限流 | 创建失败 | 队列 + 重试 + 备用厂商 |
| VPS 创建超时 | 用户体验差 | 预创建池 + 即时分配 |
| Telegram Token 泄露 | 安全问题 | 加密存储 + 定期轮换提醒 |
| AI API 成本超支 | 亏损 | 配额限制 + 预警 + 降级 |
| OpenClaw 版本更新 | 兼容性问题 | 锁定版本 + 定期升级镜像 |

---

## 9. 监控指标

### 业务指标
- 日新增用户数
- 日新增 Pod 数
- Telegram 绑定成功率
- 日活 Pod 数
- 月度 Token 消耗

### 技术指标
- VPS 创建成功率
- VPS 创建耗时 (P50/P95/P99)
- API 响应时间
- 错误率
- AI Router 可用性
