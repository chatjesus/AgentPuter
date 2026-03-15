# TinyClaw Google Ads 买量指导文档

> **最后更新**: 2026-03-05
> **当前定价**: 7 天免费试用 → $29.99/月
> **目标产品**: [tinyclaw.dev](https://tinyclaw.dev)

---

## 1. 产品定位

TinyClaw 是一个 **一键部署 AI 助手** 的平台。用户无需技术背景，60 秒内即可拥有自己的 24/7 在线 AI 代理（基于 Claude / GPT / Gemini），并自动连接 Telegram、Discord、WhatsApp 等消息渠道。

**核心卖点 (USP)**:
- **零技术门槛**: No servers, no SSH, no Docker — 纯点击式部署
- **7 天免费试用**: 用户零风险体验完整功能
- **多模型可选**: Claude 4.6 / GPT-5.2 / Gemini 3
- **全渠道覆盖**: Telegram + Discord + WhatsApp + 飞书 + Web Chat
- **$29.99/月**: 包含专用云服务器 + 24/7 运行 + 所有功能

---

## 2. 定价策略（重要变更）

| 之前 | 现在 |
|------|------|
| $49.99/月，无试用 | **7 天免费试用 → $29.99/月** |
| 双层定价 (Starter $9.99 / Pro $49.99) | **单一方案，简化决策** |

**广告文案必须强调 "Free Trial" 而非价格**。心理学上，"免费" 的转化率远高于任何折扣价格。

---

## 3. 目标受众画像

### Primary Audience（主力人群）
- **技术爱好者 / 独立开发者**: 想要自己的 AI agent 但不想管服务器
- **小型企业主**: 想在 Telegram/WhatsApp 上部署 AI 客服
- **内容创作者**: 想要 24/7 可用的 AI 助手处理日常事务
- **年龄**: 25-45
- **地域**: 全球英语市场 (US/UK/CA/AU)，东南亚，拉美

### Secondary Audience（次要人群）
- **远程团队管理者**: 需要 AI 协助团队沟通
- **AI 工具极客**: 已经在用 ChatGPT/Claude，想要更定制化的方案

---

## 4. 关键词策略

### High Intent（高意向，重点投放）
```
deploy ai agent
ai assistant hosting
openclaw hosting
personal ai agent
ai agent telegram bot
deploy chatbot on vps
24/7 ai assistant
self-hosted ai agent
```

### Medium Intent（中意向，扩量）
```
ai chatbot for telegram
ai assistant whatsapp
claude telegram bot
gpt discord bot
deploy ai bot
ai agent platform
chatbot deployment service
```

### Competitor Keywords（竞品词）
```
chatgpt alternative self-hosted
claude api hosting
ai agent as a service
botpress alternative
```

### Negative Keywords（否定关键词，必须排除）
```
free ai chatbot（纯白嫖用户）
chatgpt login
openai api key（找 API key 的，不是我们的客户）
ai jobs / ai career（求职者）
```

---

## 5. 广告文案模板

### Search Ads（搜索广告）

**Headline 组合 (max 30 chars each)**:
```
H1: Deploy Your AI Agent in 60s
H2: 7-Day Free Trial — No CC*
H3: Claude, GPT & Gemini in One
H4: 24/7 AI on Telegram & Discord
H5: No Servers. No SSH. Just AI.
H6: Your Own AI Assistant — Free
```
> *注意: Stripe Checkout 会收集信用卡。如果 checkout 不要求 CC 可用此文案，否则改为 "7-Day Free Trial — Try Now"

**Description 组合 (max 90 chars each)**:
```
D1: One-click deploy your private AI agent. Choose Claude, GPT or Gemini. Free 7-day trial, then just $29.99/mo.
D2: No Docker, no SSH, no DevOps. Deploy your AI assistant to Telegram, Discord & WhatsApp in under 60 seconds.
D3: Your own 24/7 AI agent on a dedicated cloud server. All models included. Cancel anytime. Start free today.
D4: Stop paying per API call. Get unlimited AI agent access for $29.99/mo. Includes dedicated VPS & all channels.
```

### Responsive Search Ad 组合建议:
- **CTA 优先级**: "Start Free Trial" > "Try Free for 7 Days" > "Deploy Now"
- **价值先行**: 强调 "free" 和 "60 seconds"，避免一上来就说价格
- **信任信号**: "Cancel anytime", "No lock-in", "Dedicated server"

---

### Display / YouTube Ads（展示/视频广告）

**Short headline (25 chars)**:
```
Your AI Agent, Free 7 Days
AI Agent in 60 Seconds
Free AI Agent Trial
```

**Long headline (90 chars)**:
```
Deploy your own 24/7 AI agent in 60 seconds — Claude, GPT or Gemini. Free 7-day trial, no risk.
```

---

## 6. Landing Page 策略

### 当前落地页: `https://tinyclaw.dev`

**Conversion Path**:
1. 用户点击广告 → 到达 tinyclaw.dev
2. 看到 hero + feature + pricing
3. 点击 "Deploy Now" → 自动跳转 /sign-up → /setup
4. 选模型 + 渠道 → 点击部署 → Stripe Checkout（7天试用）
5. 支付信息填写 → 自动部署 → /dashboard

**UTM 参数建议**:
```
?utm_source=google&utm_medium=cpc&utm_campaign={campaign_name}&utm_content={ad_group}
```

**转化追踪已配置**:
- Google Ads 转化: `AW-845688835/4qn1CNuV3PgbEIPgoJMD` (在 /creating 页触发)
- GA4 事件: `purchase` (value: $29.99)

---

## 7. 出价策略建议

### Phase 1: 冷启动（前 2 周）
- **策略**: Maximize Conversions（最大化转化）
- **日预算**: $30-50/day
- **原因**: 让 Google 快速收集转化数据

### Phase 2: 优化期（第 3-4 周）
- **策略**: Target CPA
- **目标 CPA**: $15-25（一个 trial signup）
- **原因**: trial → paid 转化率预估 20-30%，$29.99 × 3 个月 LTV ≈ $90，CPA $25 回报比 3.6x

### Phase 3: 规模化（第 5 周+）
- **策略**: Target ROAS 或 Manual CPC
- **根据实际 trial→paid 转化率调整**

---

## 8. A/B 测试建议

### 文案测试
| 测试项 | A 组 | B 组 |
|--------|------|------|
| CTA | "Start Free Trial" | "Deploy Your AI Agent" |
| Price anchor | 不提价格 | "$29.99/mo after trial" |
| Social proof | 无 | "Join 300+ users" |
| Urgency | 无 | "Limited servers available" |

### 落地页测试
- **当前页** vs **专门的 Trial Landing Page**（更聚焦 free trial，减少信息量）
- **视频 demo** vs **静态页面**

---

## 9. 多语言投放

TinyClaw 支持 11 种语言。建议优先投放：

| 优先级 | 语言 | Landing Page | 备注 |
|--------|------|-------------|------|
| 🥇 | English | tinyclaw.dev | 主力市场 |
| 🥈 | Spanish | tinyclaw.dev/es | 拉美市场 CPC 低 |
| 🥈 | Portuguese | tinyclaw.dev/pt | 巴西市场潜力大 |
| 🥉 | Chinese | tinyclaw.dev/zh | 华人开发者 |
| 🥉 | Japanese | tinyclaw.dev/ja | 高付费意愿 |

---

## 10. 关键指标 (KPIs)

| 指标 | 目标值 | 说明 |
|------|--------|------|
| CTR (搜索) | > 5% | 低于 3% 需优化文案 |
| CPC | < $2.00 | AI 类关键词竞争激烈，可能 $1-3 |
| Trial Signup CPA | < $25 | 从广告点击到完成 Stripe trial |
| Trial → Paid Rate | > 25% | 7天后留存付费 |
| ROAS (3 个月) | > 3x | $29.99 × 3 = $89.97 LTV vs CPA |
| 月活订阅数 | +50/月 | 规模化目标 |

---

## 11. 注意事项

1. **不要用 "Free" 误导**: Google Ads 政策对 "Free" 有严格要求。确保落地页明确显示 "7-day free trial, then $29.99/mo"
2. **Stripe Checkout 需要信用卡**: 广告文案不要暗示 "no credit card required"
3. **竞品词谨慎**: 避免直接使用 "ChatGPT" 等商标作为关键词
4. **移动端优先**: 落地页已适配移动端，但 Telegram 用户大量在移动端，确保广告在移动端表现良好
5. **再营销**: 对访问过 /setup 但未完成支付的用户做再营销（已有 GA4 埋点可用）

---

## 12. Quick Reference — 广告素材清单

- ✅ 搜索广告文案（6 个 headline + 4 个 description）
- ✅ 展示广告文案
- ⬜ 展示广告图片素材（1200×628, 300×250）— 需设计
- ⬜ YouTube 视频广告（15s/30s demo）— 需制作
- ✅ 落地页（tinyclaw.dev + 10 个语言版本）
- ✅ 转化追踪（GA4 + Google Ads Conversion）
- ✅ UTM 参数方案
