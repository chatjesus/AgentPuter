# AgentPuter

> **Your AI Never Sleeps** | 你的 AI，从不休息

---

## 什么是 AgentPuter？

**一键部署 [OpenClaw](https://github.com/openclaw/openclaw) 到云端 VPS**

```
注册 → 等待 2 分钟 → 拿到 IP + OpenClaw 链接 → 完成
```

## 用户拿到的

```
🎉 Your AI Agent is Ready!

IP: 168.119.xxx.xxx
OpenClaw: http://168.119.xxx.xxx:18789
```

就这么简单！

## MVP (5 天开发)

| 组件 | 实现 |
|------|------|
| Landing Page | 静态页 + CTA |
| 用户系统 | Clerk |
| VPS 创建 | Hetzner API |
| 等待页 | 轮询状态 |
| 结果页 | 显示 IP + 链接 |

**不做**: 状态监控、健康检查、重启按钮、复杂 Dashboard、计费

## 技术栈

| 项 | 选择 |
|----|------|
| Agent | OpenClaw (162k ⭐) |
| VPS | Hetzner (~€4/月) |
| 前端 | Next.js 14 |
| 认证 | Clerk |
| 数据库 | PostgreSQL (1 张表) |

## OpenClaw 能力 (我们不重复实现)

- ✅ AI 对话 (Claude/GPT)
- ✅ WebChat (内置)
- ✅ Telegram/WhatsApp/Slack/Discord
- ✅ Skills 系统
- ✅ Browser/Canvas

## 文档

| 文档 | 描述 |
|------|------|
| [`docs/MVP_1.0_PRD.md`](docs/MVP_1.0_PRD.md) | 产品需求文档 |
| [`docs/MVP_1.0_DEV.md`](docs/MVP_1.0_DEV.md) | 开发文档 |
| [`.cursor/rules/agentputer.mdc`](.cursor/rules/agentputer.mdc) | 项目规则 |

## 快速开始

```bash
# 1. 初始化项目
pnpm create next-app agentputer --typescript --tailwind --app

# 2. 安装依赖
pnpm add @clerk/nextjs drizzle-orm postgres

# 3. 配置环境变量 (.env.local)
# 4. 开发
pnpm dev
```

---

**Your AI Never Sleeps** 🦞
