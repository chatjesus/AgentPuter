# AgentPuter MVP

> 一键部署 OpenClaw 到云端 VPS

## 功能

- **一键创建** - 用户注册后自动创建 VPS 并部署 OpenClaw
- **Dashboard** - 显示 VPS 信息、SSH 登录凭证
- **Telegram 配对** - 在 Web 界面直接输入配对码连接 Telegram

## 技术栈

- **前端**: Next.js 16 + Tailwind CSS
- **认证**: Clerk
- **数据库**: PostgreSQL + Drizzle ORM
- **VPS**: Hetzner Cloud
- **镜像**: Packer + OpenClaw

## 快速开始

### 1. 安装依赖

```bash
cd web
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env.local` 并填写：

```bash
cp .env.example .env.local
```

需要配置：
- **Clerk**: https://dashboard.clerk.com
- **PostgreSQL**: 本地或云端数据库
- **Hetzner**: https://console.hetzner.cloud

### 3. 初始化数据库

```bash
pnpm drizzle-kit push
```

### 4. 构建 Packer 镜像 (首次)

```bash
cd infra/packer
export HETZNER_API_TOKEN=your_token
./build.sh
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 部署

### Vercel

```bash
vercel deploy --prod
```

环境变量需要在 Vercel Dashboard 中配置。

## 用户流程

```
Landing Page (/)
    ↓
注册/登录 (/sign-up, /sign-in)
    ↓
等待页 (/creating) - VPS 创建中 (~2分钟)
    ↓
Dashboard (/dashboard)
    ├─ VPS 信息 (IP, SSH 密码)
    ├─ OpenClaw WebChat 链接
    └─ Telegram 配对输入框
```

## API 接口

| 路径 | 方法 | 说明 |
|------|------|------|
| `/api/vps/create` | POST | 创建 VPS |
| `/api/vps/status` | GET | 查询 VPS 状态 |
| `/api/telegram/pair` | POST | Telegram 配对 |
| `/api/webhooks/clerk` | POST | Clerk Webhook |

## 数据库 Schema

```typescript
users {
  id: uuid
  clerkId: string
  email: string
  vpsIp: string
  vpsPassword: string  // SSH 密码
  hetznerServerId: string
  status: 'pending' | 'creating' | 'ready' | 'error'
  telegramPaired: 'true' | 'false'
  createdAt: timestamp
}
```

## 成本估算

- Hetzner CX22 (2vCPU, 4GB): ~€4/月
- Clerk: 免费层 10,000 MAU
- Vercel: 免费层足够 MVP

## 目录结构

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing Page
│   │   ├── creating/page.tsx     # 等待页
│   │   ├── dashboard/page.tsx    # Dashboard
│   │   └── api/
│   │       ├── vps/              # VPS API
│   │       └── telegram/         # Telegram API
│   └── lib/
│       └── db.ts                 # 数据库
└── infra/
    └── packer/                   # Packer 镜像
```
