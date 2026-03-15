# Hacker News 养号指南 — AgentPuter

## 目标

Karma 从 1 → 30+，然后安全发帖。预计 5-7 天。

---

## 一、HN Karma 机制

- 你的评论被 upvote → +1 karma
- 你的评论被 downvote → -1 karma（需要 500+ karma 才能 downvote 别人）
- 你的帖子被 upvote → +1 karma
- **没有关注、粉丝概念，纯内容驱动**

### Karma 门槛

| Karma | 解锁能力 |
|-------|---------|
| 1 | 可以评论、可以 upvote |
| 2-3 | 帖子不会被静默过滤 |
| 5+ | 帖子有机会上首页 |
| 30+ | 社区信任度高，发帖稳定 |
| 500+ | 可以 downvote 别人 |
| 1000+ | 可以使用 flag 功能 |

---

## 二、每日任务清单（建议坚持 5-7 天）

### 早上（5 分钟）
1. 打开 https://news.ycombinator.com/newest
2. 找 1-2 个 AI/Agent/Security/开源相关帖子
3. 留一条有价值的评论

### 晚上（5 分钟）
1. 打开 https://news.ycombinator.com/
2. 看前 30 条，找自己能说上话的
3. 再留 1 条评论

**每天 2-3 条评论就够了，不要刷量。**

---

## 三、高 Karma 评论模板

### 模板 1：补充信息型
```
Interesting — this is similar to how OpenClaw handles [X]. Their approach is [Y], 
which works well for [scenario] but breaks down when [limitation].
```

### 模板 2：经验分享型
```
We ran into this exact problem when building [X]. What worked for us was [solution]. 
The key tradeoff was [A] vs [B].
```

### 模板 3：提问型（也能拿 upvote）
```
Curious about the auth model here — how do you handle token refresh when the agent 
runs 24/7 but the OAuth provider has a 1-hour expiry?
```

### 模板 4：纠正/补充数据型
```
Small correction: the Shodan scan actually found 1,100+ instances, not 900. 
Source: [link]. The auth bypass is even worse than described because [detail].
```

---

## 四、去哪里找帖子评论

### 关键词搜索（用 HN 搜索引擎）
- https://hn.algolia.com/?q=AI+agent
- https://hn.algolia.com/?q=OpenClaw
- https://hn.algolia.com/?q=Claude+MCP
- https://hn.algolia.com/?q=self-hosted+AI
- https://hn.algolia.com/?q=LLM+security

### 高活跃板块
- **Show HN** — 别人发产品，你去评论技术架构
- **Ask HN** — 有人提问，你去回答
- **热门 AI 帖** — 首页经常有 Agent/LLM 相关话题

---

## 五、绝对禁止事项

| 行为 | 后果 |
|------|------|
| 在评论里推广 AgentPuter | 账号被 flag，帖子被删 |
| 发自己网站链接（养号期间） | 被标记为 spam |
| 复制粘贴模板回复 | 被 downvote |
| 和人吵架、人身攻击 | 被 ban |
| 用多个账号互相 upvote | 永久封禁 |
| 评论"Great post!" 之类的水帖 | 被 downvote |

---

## 六、什么时候可以发帖

### 前置条件（全部满足）
- [ ] Karma ≥ 10（安全线是 20-30）
- [ ] 账号年龄 ≥ 3 天
- [ ] 至少有 5 条有 upvote 的评论
- [ ] about 和 email 已填写

### 发帖时间
- **最佳：美西时间周二到周四，上午 8-10 点**（北京时间凌晨 12-2 点）
- 避开周末和假期

### 发帖后立刻做
1. 发完帖子后 **1 分钟内** 贴第一条评论（提供上下文）
2. **持续回复** 前 2 小时内的所有评论
3. **不要求别人 upvote**，这在 HN 是大忌

---

## 七、Day-by-Day 执行计划

### Day 1-2：熟悉社区
- 浏览首页，了解什么帖子热门
- 留 2-3 条评论，主要在 AI/开源话题下
- 不要发任何链接

### Day 3-4：建立存在感
- 在 Show HN 帖子下评论别人的产品架构
- 在 Ask HN 里回答技术问题
- 目标：每天 1-2 个 upvote

### Day 5-6：积累信任
- 尝试在更热门的帖子下留深度评论
- 如果 karma > 10，可以考虑发帖了
- 如果 karma < 5，继续评论

### Day 7：发帖
- 发第一篇文章（建议发第二篇 OpenClaw 分析，技术含量高更容易获得 upvote）
- 立刻跟上第一条评论
- 持续回复社区反馈 2-3 小时

---

## 八、快速评论灵感（直接用）

以下是一些你可以直接在相关帖子下留的评论方向：

### 看到 OpenClaw/Moltbot 相关帖子时
```
The Brain-Body-Soul split is elegant, but running the Body on localhost creates 
a fundamental tension -- you want 24/7 uptime but your Mac Mini goes to sleep. 
The 1,100 exposed ports incident showed that users will inevitably try to solve 
this with reverse proxies, which bypasses the auth model entirely.
```

### 看到 AI Security 相关帖子时
```
The hardest part about agent security isn't the code -- it's the permission model. 
You need the agent to have system-level access to be useful, but that same access 
is exactly what makes it dangerous. "Sandbox everything" sounds right until you 
realize a sandboxed agent can't send emails or manage files.
```

### 看到 Self-hosted AI 相关帖子时
```
Local-first is great for privacy, but the operational burden is real. Most users 
who self-host end up with exposed ports, unencrypted secrets, and no monitoring. 
The sweet spot is probably local-first for sensitive data + cloud runtime for the 
agent itself.
```

### 看到 LLM/Agent 工具相关帖子时
```
The real bottleneck for agent adoption isn't model quality -- it's the lack of 
reliable execution environments. Models are commodities now. What's scarce is 
infrastructure that handles auth persistence, multi-agent coordination, and 
24/7 uptime without requiring users to become sysadmins.
```

---

*记住：HN 的核心是「有价值的技术讨论」。先做贡献者，再做发布者。*
