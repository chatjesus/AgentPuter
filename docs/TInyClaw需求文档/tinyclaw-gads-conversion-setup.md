# TinyClaw Google Ads 转化追踪接入指南

> **收件人：** TinyClaw 前端工程师  
> **任务：** 在 TinyClaw 项目中添加 Google Ads 转化追踪代码  
> **目的：** 让 Google Ads 广告系统能感知 Stripe 付费成功事件，从而优化广告投放  
> **优先级：** 高（广告正在跑，缺少转化信号，当前 Google 无法优化出价）  
> **最后更新：** 2026-02-14

---

## 背景说明

我们目前在 Google Ads 上跑了两个搜索广告 Campaign：

| Campaign | 目标市场 | 预算 |
|---------|---------|------|
| `US_EN_Signup_Search_TinyClaw_202602` | 美国英文 | $20/天 |
| `Global_Multilang_Signup_Search_TinyClaw_202602` | 全球多语言 | $20/天 |

两个 Campaign 的出价策略是 **Maximize Conversions（最大化转化）**，优化目标是 `TinyClaw - Stripe Purchase`。

**问题**：Google Ads 后台目前转化数据为 0，是因为网站还没有部署转化追踪代码。Google 无法感知哪些用户完成了付费，无法对算法进行优化，相当于广告在"盲投"。

**解决方案**：在 TinyClaw 网站代码里加 2 处改动（约 15 行代码），即可完成接入。

---

## 关键 ID（请勿修改）

| 信息 | 值 |
|------|-----|
| GA4 Measurement ID | `G-VTTKDJ5SY3` |
| Google Ads (TinyClaw 子账户) | `AW-16955498656` |
| Google Ads (Campaign 主账户) | `AW-845688835` |
| Purchase 转化标签（send_to） | `AW-845688835/4qn1CNuV3PgbEIPgoJMD` |
| 转化操作名称 | `TinyClaw - Stripe Purchase` |
| 转化价值 | `49.99` USD |

---

## 需要改动的文件

### 改动 1：`src/app/layout.tsx`（新增 1 行）

找到 `<script>` 标签里的 gtag 初始化部分，目前应该是这样：

```javascript
gtag('config', 'G-VTTKDJ5SY3');     // GA4
gtag('config', 'AW-16955498656');    // Google Ads (TinyClaw 子账户)
```

在最后面**新增一行**：

```javascript
gtag('config', 'G-VTTKDJ5SY3');     // GA4（不动）
gtag('config', 'AW-16955498656');    // Google Ads（不动）
gtag('config', 'AW-845688835');      // ← 新增这一行，Campaign 主账户
```

> ⚠️ 只新增第三行，不要删除或修改现有的任何一行。

---

### 改动 2：`src/app/(auth)/creating/page.tsx`（核心改动）

这个页面是 Stripe 付费成功后的跳转落地页。用户完成付费后 Stripe 会把用户重定向到这里，URL 参数里会带有 `session_id`。

需要在这个页面的 `useEffect` 里，找到现有的 GA4 `purchase` 事件触发逻辑，在同一个地方加入 Google Ads 转化触发代码。

**完整改动示例（在现有 purchase 逻辑的基础上修改）：**

```typescript
useEffect(() => {
  // 从 URL 获取 Stripe session_id（用于去重）
  const sessionId = searchParams.get('session_id');
  const dedupeKey = `purchase_tracked_${sessionId}`;

  // 防止刷新页面重复触发
  if (sessionId && !localStorage.getItem(dedupeKey)) {

    // 1. GA4 purchase 事件（现有逻辑，保持不动）
    trackEvent('purchase', { value: 49.99, currency: 'USD', model });

    // 2. Google Ads 转化追踪（新增）
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-845688835/4qn1CNuV3PgbEIPgoJMD', // 不要修改
        value: 49.99,
        currency: 'USD',
        transaction_id: sessionId, // 用 Stripe session_id 防重复计费
      });
    }

    // 3. 标记已追踪
    localStorage.setItem(dedupeKey, Date.now().toString());
  }
}, []);
```

**如果现有代码已有去重逻辑**，不需要重新加 `localStorage`，只需在现有的 if 块内加入 `gtag('event', 'conversion', ...)` 那一段即可。

---

## 注意事项

1. `send_to` 的值必须精确为 `AW-845688835/4qn1CNuV3PgbEIPgoJMD`，不要改动任何字符。
2. `transaction_id` 用 Stripe 的 `session_id`，这是 Google Ads 防止同一笔订单被重复计算的关键。
3. `value` 固定 `49.99`，`currency` 固定 `'USD'`。
4. 不要删除或修改任何现有的 GA4 `trackEvent` 调用。
5. 这段代码需要在客户端执行（`'use client'` 页面），不能在 Server Component 里跑。

---

## 部署后验证方法

### 方法 1：Chrome DevTools（最快，推荐）

1. 打开 `https://tinyclaw.dev`，按 `F12` 打开 DevTools。
2. 切到 **Network** 标签，在搜索框输入 `conversion`。
3. 完成一次真实（或测试）付费流程，到达 `/creating` 页面。
4. 应能看到一条发往 `googleads.g.doubleclick.net` 的请求，状态码 200。
5. 点开请求，确认参数里有 `label=4qn1CNuV3PgbEIPgoJMD`。

### 方法 2：Google Tag Assistant

1. 访问 [https://tagassistant.google.com/](https://tagassistant.google.com/)。
2. 输入 `https://tinyclaw.dev` 并连接。
3. 完成付费流程，检查 `AW-845688835` 标签下是否出现 `conversion` 事件。

### 方法 3：Google Ads 后台（需等待 24-48 小时）

1. Google Ads → 目标 → 转化 → 摘要。
2. 找到 `TinyClaw - Stripe Purchase`。
3. 状态从"无近期转化"变为"正在记录转化"即为成功。

---

## 数据流架构（供参考）

```
用户付费成功
    ↓
Stripe Checkout → 重定向到 /creating?session_id=xxx
    ↓
creating/page.tsx useEffect 触发
    ├── trackEvent('purchase', ...) → GA4 (G-VTTKDJ5SY3)
    │       ↓
    │   GA4 → 自动同步到 Google Ads (延迟 ~6h，作为备份)
    │
    └── gtag('event', 'conversion', ...) → Google Ads 直接追踪
            send_to: AW-845688835/4qn1CNuV3PgbEIPgoJMD
            (实时，延迟 < 1h，作为主要信号)
```

两路数据都用 `transaction_id = session_id` 做去重，不会重复计算。

---

## 有问题联系

如果对接过程中有任何疑问，请参考：
- Google Ads 转化追踪文档：https://support.google.com/google-ads/answer/6095883
- gtag.js 开发者文档：https://developers.google.com/tag-platform/gtagjs/reference
