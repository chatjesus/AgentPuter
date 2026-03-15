# TinyClaw Google Ads 转化追踪接入指南

> **任务：** 在 TinyClaw 项目中添加 Google Ads 转化追踪  
> **目的：** 让 Google Ads Campaign 能追踪到 Stripe 付费成功事件  
> **创建时间：** 2026-02-14  
> **状态：** ✅ 已完成并部署（2026-02-14）  
> **完整追踪文档：** [tinyclaw-ga4-events.md](./tinyclaw-ga4-events.md)

---

## 背景

| 信息 | 值 |
|------|-----|
| GA4 Measurement ID | `G-VTTKDJ5SY3` |
| Google Ads (TinyClaw 账户) | `AW-16955498656` |
| Google Ads (Campaign 主账户) | `AW-845688835` |
| Purchase 转化标签 | `AW-845688835/4qn1CNuV3PgbEIPgoJMD` |
| 转化操作名称 | `TinyClaw - Stripe Purchase` |
| 转化价值 | $49.99 |
| Campaign 出价目标 | PURCHASE/WEBSITE (Maximize Conversions) |

**两个 Campaign 已配置完成（Google Ads API 端）：**

- `US_EN_Signup_Search_TinyClaw_202602` — 美国搜索广告
- `Global_Multilang_Signup_Search_TinyClaw_202602` — 全球多语言搜索广告

**~~需要在 TinyClaw 代码中完成 2 处改动，代码部署后 Campaign 即可正常追踪转化。~~**

> ✅ **2 处改动均已完成并部署到 tinyclaw.dev（2026-02-14）**

---

## 改动 1：`src/app/layout.tsx`

### 操作

在 gtag 初始化代码中，找到以下两行：

```javascript
gtag('config', 'G-VTTKDJ5SY3');
gtag('config', 'AW-16955498656');
```

在它们下面新增一行：

```javascript
gtag('config', 'AW-845688835');
```

### 最终效果

```javascript
gtag('config', 'G-VTTKDJ5SY3');     // GA4
gtag('config', 'AW-16955498656');    // Google Ads (TinyClaw)
gtag('config', 'AW-845688835');      // Google Ads (Campaign 主账户) ← 新增
```

### 注意

- 不要删除或修改现有的两行 config
- 只是新增第三行
- 位置在现有两行之后即可

---

## 改动 2：`src/app/(auth)/creating/page.tsx`

### 操作

找到触发 GA4 `purchase` 事件的 `useEffect`（里面调用了 `trackEvent('purchase', ...)` 的地方）。

做两件事：

### A. 添加 Google Ads 转化追踪调用

在 `trackEvent('purchase', ...)` 调用的紧后面，添加：

```typescript
// Google Ads 转化追踪（Campaign 主账户）
if (typeof window !== 'undefined' && (window as any).gtag) {
  (window as any).gtag('event', 'conversion', {
    send_to: 'AW-845688835/4qn1CNuV3PgbEIPgoJMD',
    value: 49.99,
    currency: 'USD',
    transaction_id: sessionId || undefined,
  });
}
```

其中 `sessionId` 是 Stripe Checkout 的 session_id（从 URL 参数 `session_id` 或 `CHECKOUT_SESSION_ID` 获取）。

如果当前代码已经有读取这个参数的逻辑，直接复用；如果没有，从 searchParams 中读取：

```typescript
const sessionId = searchParams.get('session_id');
```

### B. 添加 localStorage 去重

用 Stripe session_id 做去重 key，确保刷新页面不会重复触发 purchase 和 conversion 事件：

```typescript
const dedupeKey = `purchase_tracked_${sessionId}`;
if (sessionId && !localStorage.getItem(dedupeKey)) {
  // GA4 事件
  trackEvent('purchase', { value: 49.99, currency: 'USD', model });

  // Google Ads 转化追踪
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: 'AW-845688835/4qn1CNuV3PgbEIPgoJMD',
      value: 49.99,
      currency: 'USD',
      transaction_id: sessionId,
    });
  }

  // 标记已追踪，防止刷新重复触发
  localStorage.setItem(dedupeKey, Date.now().toString());
}
```

如果现有的 purchase 事件触发已经有某种去重逻辑，那只需要在同一个 if 块内加上 gtag conversion 调用即可，不需要重复加去重。

---

## 重要提醒

1. **不要删除或修改**任何现有的 GA4 `trackEvent` 调用
2. **不要修改**现有的 `gtag config` 行，只是新增一行
3. `send_to` 的值必须精确是 `AW-845688835/4qn1CNuV3PgbEIPgoJMD`，不要改动
4. `transaction_id` 用 Stripe session_id，用于 Google Ads 转化去重
5. `value` 固定 `49.99`，`currency` 固定 `USD`

---

## 验证方法

部署后，按以下步骤验证转化追踪是否正常：

### 方法 1：Chrome DevTools

1. 打开 tinyclaw.dev，按 F12 打开 DevTools
2. 切到 Network 标签，搜索 `google`
3. 完成一次付费流程
4. 在 `/creating` 页面应能看到发往 `googleads.g.doubleclick.net` 的请求
5. 请求参数中应包含 `aw_remarketing_only=0` 和 conversion label

### 方法 2：Google Ads 后台

1. 等待 24-48 小时（转化数据有延迟）
2. Google Ads → 工具与设置 → 转化 → 找到 `TinyClaw - Stripe Purchase`
3. 状态应从"无近期转化"变为"正在记录转化"

### 方法 3：Google Tag Assistant

1. 访问 https://tagassistant.google.com/
2. 输入 tinyclaw.dev
3. 走一遍付费流程
4. 检查 `AW-845688835` 的 conversion 事件是否被正确触发

---

## GA4 Import（自动生效，无需额外操作）

GA4 已关联 Google Ads 账户 `869-732-7276`，关联生效后（≤24 小时）：

- GA4 中的 `purchase`、`begin_checkout`、`sign_up` 事件会自动出现在 Google Ads 转化列表中
- 届时可在 Google Ads 后台导入 GA4 的 `purchase` 事件作为额外转化来源
- GA4 Import 和上面的直接标签追踪可以并存，Google Ads 会自动用 `transaction_id` 去重

这意味着部署上面的代码后，你会有**双重保险**：
1. **直接标签**（实时，延迟 < 1 小时）
2. **GA4 Import**（延迟 ~6 小时，但更可靠不丢数据）
