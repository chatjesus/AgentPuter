# OpenClaw Prompt：给王慧文发邮件

> 直接复制下面的 prompt 发给你 VPS 上的 OpenClaw Agent（通过 Telegram/WebChat）

---

## Prompt

```
帮我发一封邮件。

收件人：wanghuiwen@lollapalooza.hk
邮件标题：这封邮件由部署在 VPS 上的 OpenClaw Agent 自动发出 — 我们在做 OpenClaw 云端部署平台

邮件正文（请保持 Markdown 格式，如果邮件客户端支持富文本则渲染为 HTML 发送）：

---

慧文你好，

看到你在即刻上找 OpenClaw 相关创业团队——这封邮件，就是从我们部署在 Hetzner VPS 上 7×24 运行的 OpenClaw Agent 发出的。

没错，你正在体验的，就是我们的产品本身。

【我们在做什么】

AgentPuter — OpenClaw 的云端一键部署平台。

用户注册 → 等待 2 分钟 → 拿到 IP + OpenClaw 链接 → 完成。

解决 OpenClaw 用户最大的痛点：设备无法 24/7 在线。
MacBook 合盖 = Agent 断线。我们让 Agent 住进云端，永不下线。

【为什么做这个】

OpenClaw 153K Stars 证明需求已爆发，但普通用户面临四个现实困境：
1. 设备无法长期在线 — 合盖、关机 = Agent 断线
2. 授权频繁失效 — OAuth Token 过期，每次重启重新授权
3. 本地资源被占用 — Agent 吃 CPU/内存，影响日常工作
4. 无法远程访问 — 出门在外 = 失联

AgentPuter 就是给每个 OpenClaw 用户提供一台永不关机的专属电脑。

【现在什么阶段】

• Landing Page 已上线（Astro + TailwindCSS，中英双语）
• 用户系统完成（Clerk 认证）
• VPS 自动创建（Hetzner API + Packer 预装镜像）
• OpenClaw 云端部署流程已跑通（就是发这封邮件的这台）
• 行业分析文章完成（5500 字，中英双语）
• 正在做：授权持久化、多 Agent 协作、Skills 市场

【更大的故事】

短期：OpenClaw 的 "Heroku"（一键云端部署）
中期：Agent 的持久化工作区（隐私代理 + 上下文管理 + 操作回滚）
长期：AgentPuter = 每个人都有一台 Agent 专属电脑

我们的核心判断："给软件加 AI 是守城，给 Agent 造电脑是攻城。"

【关于我们】

[补充你的姓名、团队背景、联系方式]

---

很希望有机会详聊。如果你回复这封邮件，我的 OpenClaw Agent 会立刻通知我 :)

此邮件由 AgentPuter 云端 OpenClaw Agent 发出
VPS: Hetzner Cloud · Region: [你的VPS区域] · Uptime: 24/7
了解更多: [你的Landing Page链接]

---

发送完成后告诉我发送结果。
```

---

## 备注

### 发送前检查清单

- [ ] 把 `[补充你的姓名、团队背景、联系方式]` 替换为你的真实信息
- [ ] 把 `[你的VPS区域]` 替换为实际区域（如 `eu-central / Falkenstein` / `Nuremberg` 等）
- [ ] 把 `[你的Landing Page链接]` 替换为实际 URL
- [ ] 确认 OpenClaw 的 Email Skill 已配置好（SMTP 或 API）
- [ ] 确认发件邮箱地址看起来专业（不要 noreply 或乱码前缀）

### 如果 OpenClaw 没有 Email Skill

你可能需要先给 OpenClaw 创建一个 Email Skill。简单方案：

```markdown
# Email Skill

你可以使用系统邮件命令发送邮件。

## 使用方法

使用 `msmtp` 或 `sendmail` 或调用邮件 API 发送邮件。

## 配置

SMTP 服务器已配置在系统中，直接使用即可。
```

或者如果你用的是 Gmail API / Resend / SendGrid 等，对应调整 Skill 内容。

### 效果加分项

如果你能在邮件签名里加上 VPS 的实时信息（比如 uptime），会更有冲击力：

```
此邮件由 AgentPuter 云端 OpenClaw Agent 发出
VPS: Hetzner Cloud · Falkenstein, DE · Uptime: 72h 15m
Agent Status: Online · Last task: sending this email
```

让 OpenClaw 在发送前跑一下 `uptime` 命令，把结果嵌入签名。
