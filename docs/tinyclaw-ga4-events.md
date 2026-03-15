# TinyClaw 数据追踪完整文档

> **GA4 Measurement ID:** `G-VTTKDJ5SY3`  
> **Google Ads (TinyClaw 账户):** `AW-16955498656`  
> **Google Ads (Campaign 主账户):** `AW-845688835`  
> **Purchase 转化标签:** `AW-845688835/4qn1CNuV3PgbEIPgoJMD`  
> **域名:** tinyclaw.dev  
> **更新时间:** 2026-02-14

---

## 1. 用户转化漏斗概览

```
Landing Page → Sign Up (Clerk) → Setup(选模型 + 配 TG + 显示价格) → Stripe Checkout → Creating(部署中) → Dashboard
     ↓             ↓                ↓         ↓          ↓                  ↓                ↓              ↓
  page_view     sign_up      select_model  connect_tg  click_deploy     begin_checkout    purchase    deploy_complete
                                                        ↓                                 + Ads conversion
                                                  直接跳转 Stripe                        + localStorage 去重
                                                 （已去掉 /subscribe 中间页）
```

---

## 2. 事件详细说明

### 2.1 `sign_up`

| 字段 | 值 |
|---|---|
| **触发时机** | 用户登录/注册后首次进入 `/setup` 页面 |
| **触发位置** | `src/app/(auth)/setup/page.tsx` — `useEffect` |
| **事件分类** | `funnel` |
| **参数** | `method: "clerk"` |
| **说明** | 用户通过 Clerk 完成注册或登录后会被重定向到 `/setup`，此时触发。包括新注册和已有用户登录。 |

---

### 2.2 `select_model`

| 字段 | 值 |
|---|---|
| **触发时机** | 用户在 Setup 页面点击选择 AI 模型 |
| **触发位置** | `src/app/(auth)/setup/page.tsx` — 模型按钮 `onClick` |
| **事件分类** | `funnel` |
| **参数** | `model: "claude" \| "gpt" \| "gemini"`, `model_name: "Claude Opus 4.5" \| "GPT-5.2" \| "Gemini 3"` |
| **说明** | 每次切换模型都会触发一次，可用于分析模型偏好。 |

---

### 2.3 `click_deploy`

| 字段 | 值 |
|---|---|
| **触发时机** | 用户在 Setup 页面点击 "⚡ Deploy OpenClaw" 按钮 |
| **触发位置** | `src/app/(auth)/setup/page.tsx` — `handleDeploy()` |
| **事件分类** | `funnel` |
| **参数** | `model: "claude" \| "gpt" \| "gemini"`, `channel: "telegram"` |
| **说明** | 点击后如果 Telegram 未配对，会弹出配对 Modal；如果已配对，则直接调用 Stripe Checkout API 并跳转到 Stripe 外部支付页面。 |

---

### 2.4 `connect_telegram`

| 字段 | 值 |
|---|---|
| **触发时机** | 用户在 Telegram Modal 中输入 Bot Token 并成功保存 |
| **触发位置** | `src/app/(auth)/setup/page.tsx` — `handleTelegramConnected()` |
| **事件分类** | `funnel` |
| **参数** | `model: "claude" \| "gpt" \| "gemini"` |
| **说明** | Token 保存到 `localStorage` 后触发，随后自动调用 Stripe Checkout API 跳转付款。此事件表示用户完成了技术门槛最高的一步。 |

---

### 2.5 `begin_checkout`

| 字段 | 值 |
|---|---|
| **触发时机** | 在 `/setup` 页面，Telegram 已配对后，系统调用 `/api/stripe/checkout` 前触发 |
| **触发位置** | `src/app/(auth)/setup/page.tsx` — `goToStripeCheckout()` |
| **事件分类** | `funnel` |
| **参数** | `value: 49`, `currency: "USD"`, `model`, `channel` |
| **说明** | 此事件 = 即将离开我们站点，跳转到 Stripe 外部支付页面。有两个触发路径：(1) 用户已配对 TG，点击 Deploy 直接触发；(2) 用户在 TG Modal 中配对成功后自动触发。 |

---

### 2.6 `purchase` + Google Ads `conversion` ⭐

| 字段 | 值 |
|---|---|
| **触发时机** | 用户从 Stripe 支付成功后返回 `/creating` 页面 |
| **触发位置** | `src/app/(auth)/creating/page.tsx` — `useEffect` |
| **事件分类** | `funnel` |
| **GA4 参数** | `value: 49.99`, `currency: "USD"`, `model` |
| **Ads conversion** | `send_to: "AW-845688835/4qn1CNuV3PgbEIPgoJMD"`, `value: 49.99`, `currency: "USD"`, `transaction_id: sessionId` |
| **去重机制** | 使用 Stripe `session_id` 作为 `localStorage` 去重 key（`purchase_tracked_{sessionId}`），刷新页面不会重复触发 |

**实际代码逻辑：**

```typescript
// 从 URL 获取 Stripe session_id
const sessionId = searchParams.get("session_id");

// localStorage 去重
const dedupeKey = sessionId ? `purchase_tracked_${sessionId}` : null;
const alreadyTracked = dedupeKey ? localStorage.getItem(dedupeKey) : false;

if (!alreadyTracked) {
  // 1. GA4 purchase 事件
  trackEvent("purchase", { value: 49.99, currency: "USD", model });

  // 2. Google Ads 转化追踪（Campaign 主账户）
  gtag("event", "conversion", {
    send_to: "AW-845688835/4qn1CNuV3PgbEIPgoJMD",
    value: 49.99,
    currency: "USD",
    transaction_id: sessionId || undefined,
  });

  // 3. 标记已追踪
  if (dedupeKey) localStorage.setItem(dedupeKey, Date.now().toString());
}
```

---

### 2.7 `deploy_complete`

| 字段 | 值 |
|---|---|
| **触发时机** | VPS 部署完成，状态变为 `ready` |
| **触发位置** | `src/app/(auth)/creating/page.tsx` — VPS 创建回调 & 轮询 |
| **事件分类** | `funnel` |
| **参数** | `model: "claude" \| "gpt" \| "gemini"` |
| **说明** | 两个触发点：(1) `/api/vps/create` 直接返回 `ready`；(2) 轮询 `/api/vps/status` 返回 `ready`。触发后自动跳转到 `/dashboard`。 |

---

## 3. 技术实现

### 3.1 全局 gtag 初始化

**文件:** `src/app/layout.tsx`

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VTTKDJ5SY3" />
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-VTTKDJ5SY3');      // GA4
  gtag('config', 'AW-16955498656');     // Google Ads (TinyClaw 账户)
  gtag('config', 'AW-845688835');       // Google Ads (Campaign 主账户) ← 2026-02-14 新增
</script>
```

**三个 config 的作用：**

| ID | 用途 |
|---|---|
| `G-VTTKDJ5SY3` | GA4 数据收集（页面浏览、自定义事件、漏斗分析） |
| `AW-16955498656` | Google Ads TinyClaw 账户（Conversion Linker、再营销受众） |
| `AW-845688835` | Google Ads Campaign 主账户（接收 `conversion` 事件，Campaign 出价优化） |

### 3.2 Analytics 工具库

**文件:** `src/lib/analytics.ts`

```typescript
trackEvent(event, params)   // 发送 GA4 自定义事件
trackPageView(path, title)  // 发送页面浏览（SPA 路由切换时）
```

### 3.3 页面浏览追踪

| 页面 | 路径 | 追踪方式 | 状态 |
|---|---|---|---|
| 落地页 | `/` | GA4 自动 `page_view` | ✅ |
| 注册页 | `/sign-up` | GA4 自动 `page_view` | ✅ |
| Setup | `/setup` | 手动 `trackPageView` | ✅ |
| Creating | `/creating` | 手动 `trackPageView` | ✅ |
| Dashboard | `/dashboard` | GA4 自动 `page_view` (SSR) | ✅ |
| ~~Subscribe~~ | ~~/subscribe~~ | — | ❌ 已废弃 → 重定向 `/setup` |

### 3.4 用户流程图

```
┌──────────┐    ┌─────────┐    ┌──────────────────────────┐    ┌─────────────────┐    ┌───────────────────────┐    ┌───────────┐
│ Landing  │───▶│ Sign Up │───▶│ Setup                    │───▶│ Stripe Checkout │───▶│ Creating              │───▶│ Dashboard │
│ /        │    │ /sign-up│    │ /setup                    │    │ (外部页面)       │    │ /creating             │    │ /dashboard│
│          │    │ (Clerk) │    │                            │    │                 │    │                       │    │           │
│ GA4:     │    │ GA4:    │    │ GA4 事件:                  │    │ 我们无法追踪    │    │ GA4:                  │    │           │
│ page_view│    │ sign_up │    │  · select_model            │    │ 用户在此完成    │    │  · purchase            │    │           │
│          │    │         │    │  · connect_telegram        │    │ 信用卡支付      │    │ Google Ads:            │    │           │
│          │    │         │    │  · click_deploy            │    │                 │    │  · conversion          │    │           │
│          │    │         │    │  · begin_checkout          │    │                 │    │    (AW-845688835)      │    │           │
│          │    │         │    │                            │    │                 │    │  · deploy_complete     │    │           │
│          │    │         │    │ 显示: $49.99/mo            │    │ cancel → /setup │    │ 去重: localStorage     │    │           │
└──────────┘    └─────────┘    └──────────────────────────┘    └─────────────────┘    └───────────────────────┘    └───────────┘
```

---

## 4. Google Ads 转化追踪配置

### 4.1 转化追踪架构（双重保险）

```
用户付款成功 → /creating 页面加载
                    │
                    ├─── GA4 trackEvent("purchase")  ──→  GA4 数据  ──→  GA4 Import 到 Google Ads（延迟 ~6h）
                    │
                    └─── gtag("event", "conversion")  ──→  直接发到 Google Ads（延迟 < 1h）
                         send_to: AW-845688835/4qn1CNuV3PgbEIPgoJMD
                         transaction_id: Stripe session_id（自动去重）
```

两条路径都到达 Google Ads，Google Ads 会用 `transaction_id` 自动去重，不会重复计数。

### 4.2 已配置的 Campaign

| Campaign 名称 | 市场 | 状态 |
|---|---|---|
| `US_EN_Signup_Search_TinyClaw_202602` | 美国搜索广告 | ✅ 已创建 |
| `Global_Multilang_Signup_Search_TinyClaw_202602` | 全球多语言搜索广告 | ✅ 已创建 |

两个 Campaign 的出价目标均为 **PURCHASE/WEBSITE (Maximize Conversions)**，指向转化操作 `TinyClaw - Stripe Purchase`。

### 4.3 转化目标层级

| 转化操作 | 来源 | 类型 | 价值 | 优先级 |
|---|---|---|---|---|
| **TinyClaw - Stripe Purchase** | 直接标签 `AW-845688835/4qn1CNuV3PgbEIPgoJMD` | 主要操作 | $49.99 | ⭐⭐⭐ |
| **purchase** (GA4 Import) | GA4 `G-VTTKDJ5SY3` | 次要 / 备份 | $49.99 | ⭐⭐ |
| **begin_checkout** (GA4 Import) | GA4 `G-VTTKDJ5SY3` | 次要操作 | $10 (预估) | ⭐ |
| **sign_up** (GA4 Import) | GA4 `G-VTTKDJ5SY3` | 次要操作 | $2 (预估) | ⭐ |

### 4.4 去重机制

| 层级 | 机制 | 说明 |
|---|---|---|
| **前端 localStorage** | `purchase_tracked_{session_id}` | 防止用户刷新 `/creating` 页面重复触发 GA4 + Ads 事件 |
| **Google Ads 端** | `transaction_id` (Stripe session_id) | 直接标签和 GA4 Import 都带同一个 `transaction_id`，Ads 自动去重 |
| **无 session_id 降级** | 仍然触发事件，但不写 localStorage | 确保不丢数据，代价是可能刷新重复（极少数情况） |

---

## 5. GA4 报表配置建议

### 5.1 漏斗分析

GA4 → **探索 (Explore)** → **漏斗探索 (Funnel Exploration)**：

| 步骤 | 事件 | 关注点 |
|---|---|---|
| Step 1 | `sign_up` | 注册转化率 |
| Step 2 | `click_deploy` | 选完模型后点部署的比例 |
| Step 3 | `connect_telegram` | TG 配对完成率（技术门槛最高） |
| Step 4 | `begin_checkout` | 准备付款的比例（跳 Stripe 前） |
| Step 5 | `purchase` | 实际付款转化率 |
| Step 6 | `deploy_complete` | 部署成功率 |

**关键流失点分析：**

| 流失位置 | 可能原因 | 优化方向 |
|---|---|---|
| Step 1→2 | 价格、产品不理解、页面复杂 | 简化 Setup 页、突出价值主张 |
| Step 2→3 | TG Bot Token 获取门槛高 | 简化引导、增加视频教程 |
| Step 3→4 | 不应发生（自动跳转） | 检查技术 bug |
| Step 4→5 | 价格犹豫、信用卡问题、信任不足 | 加入退款保障、社会证明 |
| Step 5→6 | VPS 创建失败等技术问题 | 监控服务器资源、自动重试 |

### 5.2 自定义维度

GA4 → **管理** → **自定义定义** 中注册：

| 参数名 | 范围 | 说明 |
|---|---|---|
| `model` | Event | AI 模型 (claude / gpt / gemini) |
| `model_name` | Event | 模型显示名 |
| `channel` | Event | 消息渠道 (telegram) |
| `method` | Event | 注册方式 (clerk) |

---

## 6. Campaign 设计指南

### 6.1 搜索广告 (Search) — 推荐起步

| 配置项 | 建议值 |
|---|---|
| **出价策略** | Maximize Conversions → 15+ 转化后切 tCPA $40 |
| **每日预算** | $20-30/天 |
| **投放地区** | 美国优先，全球英语市场 |
| **设备** | 桌面端优先 |

**关键词组：**

```
· deploy ai assistant        · openclaw deploy
· ai assistant telegram       · openclaw hosting
· 24/7 ai bot                · chatgpt alternative always on
· personal ai agent           · run ai 24/7
```

### 6.2 Performance Max — 有数据后升级

30+ purchase 转化后开启，$50-100/天，Maximize Conversion Value。

### 6.3 再营销 — 挽回流失用户

GA4 受众：`begin_checkout` 触发但 `purchase` 未触发，过去 30 天。tCPA $20。

### 6.4 ROI 计算

```
产品价格:          $49.99/月
预估 LTV:          $49.99 × 4 月 = ~$200
CPA 上限:          $60
建议起步 tCPA:     $30-40

每月 $900 预算 → ~25 新付费用户 → 首月 $1,250 收入 → 含 LTV $5,000 (ROAS 5.5x)
```

### 6.5 优化节奏

| 阶段 | 时间 | 操作 |
|---|---|---|
| 冷启动 | 1-2 周 | Search Campaign，不设 tCPA，让系统学习 |
| 数据积累 | 3-4 周 | 15+ purchase 后切 tCPA $40 |
| 扩量 | 第 2 月 | 开 Performance Max |
| 再营销 | 第 2 月起 | Checkout Abandoners 受众 |
| 持续优化 | 每周 | 检查搜索词报告，排除无效词 |

---

## 7. 验证方法

### 7.1 Chrome DevTools

1. 打开 tinyclaw.dev → F12 → Network
2. 走完付费流程
3. `/creating` 页面应看到发往 `googleads.g.doubleclick.net` 的请求
4. 参数含 `aw_remarketing_only=0` 和 conversion label

### 7.2 Google Ads 后台

1. 等 24-48 小时
2. Google Ads → 转化 → `TinyClaw - Stripe Purchase`
3. 状态应变为"正在记录转化"

### 7.3 Google Tag Assistant

1. 访问 https://tagassistant.google.com/
2. 输入 tinyclaw.dev
3. 走付费流程
4. 检查 `AW-845688835` 的 conversion 事件

---

## 8. 已知限制

1. **Stripe 页面不可追踪** — 无法得知用户在 Stripe 页面上的具体行为（输卡号后放弃等）
2. **Clerk 注册页面有限追踪** — `/sign-up` 是 Clerk 组件，无法内部埋点
3. **无 session_id 时去重失效** — 如果 Stripe 回调 URL 没带 `session_id` 参数，刷新会重复触发（概率很低）
4. **数据延迟** — GA4 实时报告 ~30 分钟；Ads 直接标签 < 1 小时；GA4→Ads Import ~6 小时

---

## 9. 相关文件索引

| 文件 | 说明 | 关键内容 |
|---|---|---|
| `src/app/layout.tsx` | 全局 gtag 初始化 | GA4 + 2 个 Google Ads config |
| `src/lib/analytics.ts` | 事件追踪工具库 | `trackEvent` / `trackPageView` |
| `src/app/(auth)/setup/page.tsx` | Setup 页面 | sign_up, select_model, click_deploy, connect_telegram, begin_checkout |
| `src/app/(auth)/creating/page.tsx` | Creating 页面 | purchase (GA4) + conversion (Ads) + localStorage 去重 + deploy_complete |
| `src/app/(auth)/subscribe/page.tsx` | 已废弃 | 仅重定向至 `/setup` |
| `src/lib/stripe.ts` | Stripe 配置 | `cancelUrl` → `/setup` |
| `src/app/globals.css` | 样式 | `.setup-pricing` 价格文案 |

---

## 10. 变更日志

| 日期 | 变更内容 |
|---|---|
| 2026-02-04 | 初始 GA4 埋点：7 个漏斗事件（sign_up → deploy_complete） |
| 2026-02-04 | 去掉 `/subscribe` 中间页，Deploy 按钮直接跳 Stripe；全站 "Gemini 3 Flash" → "Gemini 3" |
| 2026-02-04 | 新增 Google Ads Campaign 设计指南（搜索广告 / PMax / 再营销）、ROI 计算 |
| 2026-02-14 | **新增 Google Ads 直接转化标签** — `layout.tsx` 加 `AW-845688835` config；`creating/page.tsx` 加 `conversion` 事件 (`AW-845688835/4qn1CNuV3PgbEIPgoJMD`) + Stripe `session_id` 去重；解决 `purchase` 事件重复触发问题 |
