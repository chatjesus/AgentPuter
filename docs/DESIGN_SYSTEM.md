# AgentPuter / TinyClaw Design System

> 从 `AgentPuterLandingPage.pen` 提取的统一设计规范。
> 所有新页面、工具站、博客、落地页必须遵循此规范。

---

## 1. 双品牌体系

| 属性 | AgentPuter (主站/博客) | TinyClaw (产品/工具站) |
|------|----------------------|----------------------|
| 风格 | Hacker Terminal 终端黑客风 | Modern Minimal 现代简约 |
| 主字体 | JetBrains Mono | Inter |
| 主色 | `#00FF41` (终端绿) | `#4ade80` / `#22C55E` (柔绿) |
| 背景 | `#0D0D0D` (纯黑) | `#09090B` (近黑) |
| 卡片背景 | `#1A1A1A` | `#0F0F11` / `#18181B` |
| 装饰 | 终端窗口、`>_` 提示符、等宽代码块 | 圆角卡片、渐变、极简分隔线 |

---

## 2. 色彩系统

### 2.1 背景色 (Backgrounds)

| Token | HEX | 用途 |
|-------|-----|------|
| `--bg-primary` | `#09090B` | 页面主背景 (TinyClaw) |
| `--bg-primary-ap` | `#0D0D0D` | 页面主背景 (AgentPuter) |
| `--bg-secondary` | `#0F0F11` | 卡片/容器背景 |
| `--bg-tertiary` | `#18181B` | 次级卡片/分隔线 |
| `--bg-elevated` | `#1A1A1A` | 弹出层/高亮区域 |
| `--bg-surface` | `#252525` | 输入框/代码块背景 |
| `--bg-dark` | `#111114` | 深色面板 |

### 2.2 文字色 (Text)

| Token | HEX | 用途 |
|-------|-----|------|
| `--text-primary` | `#FFFFFF` | 标题、强调文字 |
| `--text-secondary` | `#E5E7EB` / `#E4E4E7` | 正文 |
| `--text-muted` | `#A1A1AA` / `#9CA3AF` | 副标题、描述 |
| `--text-dim` | `#71717A` / `#6B7280` | 辅助说明、placeholder |
| `--text-dark` | `#52525B` | 最弱文字、footer |
| `--text-disabled` | `#475569` | 不可用状态 |

### 2.3 品牌色 (Brand / Accent)

| Token | HEX | 用途 |
|-------|-----|------|
| `--accent-green` | `#00FF41` | AgentPuter 主色 (终端绿) |
| `--accent-green-soft` | `#22C55E` / `#4ade80` | TinyClaw 主色 (柔绿) |
| `--accent-purple` | `#7C3AED` | 标签、NEW badge |
| `--accent-blue` | `#0088CC` | Demo CTA 按钮 |
| `--accent-orange` | `#F97316` | 警告、标注 |

### 2.4 语义色 (Semantic)

| Token | HEX | 用途 |
|-------|-----|------|
| `--color-success` | `#22C55E` | 成功状态 |
| `--color-error` | `#EF4444` | 错误/危险 |
| `--color-warning` | `#F59E0B` | 警告 |
| `--color-info` | `#0088CC` | 信息 |

### 2.5 第三方品牌色

| 品牌 | HEX | 用途 |
|------|-----|------|
| Telegram | `#0088CC` | 渠道图标 |
| Discord | `#5865F2` | 渠道图标 |
| WhatsApp | `#25D366` | 渠道图标 |
| OpenAI | `#10A37F` | 模型图标 |
| Google | `#4285F4` | 模型图标 |

### 2.6 描边与透明色

| Token | HEX | 用途 |
|-------|-----|------|
| `--stroke-accent` | `#00FF4130` | 终端绿描边 (低透明) |
| `--stroke-accent-mid` | `#00FF4150` | 终端绿描边 (中透明) |
| `--stroke-subtle` | `#27272A` | 卡片分隔线 |

---

## 3. 字体系统

### 3.1 字体族

```css
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

| 场景 | 字体 |
|------|------|
| AgentPuter 全站 | `--font-mono` |
| TinyClaw 全站 | `--font-sans` |
| 代码块/终端 | `--font-mono` |
| 工具站输入输出 | `--font-mono` |

### 3.2 字体大小

| Token | Size | Weight | 用途 |
|-------|------|--------|------|
| `--text-display` | 96px | 800 | AgentPuter Hero |
| `--text-h0` | 48px | 800 | 大标题 |
| `--text-h1` | 40px | 800 | Hero 标题 (TinyClaw) |
| `--text-h2` | 36px | 800 | 工具站 Hero |
| `--text-h3` | 30px | 800 | Section 标题 |
| `--text-h4` | 24px | 700 | 子标题 |
| `--text-h5` | 20px | 700 | 卡片标题 |
| `--text-body-lg` | 18px | 400 | 大号正文 |
| `--text-body` | 15px | 400 | 标准正文 |
| `--text-body-sm` | 14px | 400 | 小号正文 |
| `--text-caption` | 13px | 500/600 | Logo、标签 |
| `--text-small` | 12px | 400/600 | 辅助文字、badge |
| `--text-tiny` | 11px | 400 | 最小文字 |
| `--text-micro` | 10px | 400 | 极小标注 |

### 3.3 字重

| Weight | 用途 |
|--------|------|
| 900 (Black) | AgentPuter Hero 特殊场景 |
| 800 (ExtraBold) | 标题、Hero |
| 700 (Bold) | 子标题、强调 |
| 600 (SemiBold) | 按钮、logo、标签 |
| 500 (Medium) | 导航、副标签 |
| 400 (Regular) | 正文、描述 |

---

## 4. 间距系统

### 4.1 间距比例 (4px 基准)

| Token | Value | 用途 |
|-------|-------|------|
| `--space-1` | 4px | 图标内间距 |
| `--space-2` | 8px | badge 内间距 |
| `--space-3` | 12px | 卡片内元素间距 |
| `--space-4` | 16px | 组件间距 |
| `--space-5` | 20px | 容器 padding |
| `--space-6` | 24px | section 内元素间距 |
| `--space-8` | 32px | section 内大间距 |
| `--space-10` | 40px | section padding |
| `--space-12` | 48px | section 间隔 |
| `--space-16` | 64px | 大 section padding |
| `--space-20` | 80px | section 外间距 |
| `--space-30` | 120px | 页面边距 (AgentPuter) |

### 4.2 页面容器

| 场景 | 最大宽度 | 水平 padding |
|------|---------|-------------|
| AgentPuter Landing | 1440px | 120px |
| TinyClaw Landing | 620px (内容区) | 20px |
| 工具站 | 960px | 20px |
| 博客文章 | 4xl (~896px) | 24px / 32px |

---

## 5. 圆角系统

| Token | Value | 用途 |
|-------|-------|------|
| `--radius-none` | 0px | 无圆角 |
| `--radius-xs` | 4px | 小 badge |
| `--radius-sm` | 6px | inline tag |
| `--radius-md` | 8px | 按钮、输入框 |
| `--radius-lg` | 12px | 卡片 |
| `--radius-xl` | 14px | CTA 按钮 |
| `--radius-2xl` | 16px | 弹窗 |
| `--radius-3xl` | 20px | badge |
| `--radius-4xl` | 24px | 大容器 |
| `--radius-full` | 100px | 胶囊 / pill |

---

## 6. 组件规范

### 6.1 按钮

**Primary CTA (TinyClaw)**
```css
background: #4ade80;     /* 或 #22C55E */
color: #000000;
padding: 12px 28px;      /* 或 10px 20px (小) */
border-radius: 10px;
font-size: 15px;
font-weight: 700;
```

**Primary CTA (AgentPuter)**
```css
background: #00FF41;
color: #0D0D0D;
padding: 13px 28px;
border-radius: 8px;
font-family: 'JetBrains Mono';
font-size: 14px;
font-weight: bold;
```

**Demo/Blue CTA**
```css
background: linear-gradient(135deg, #0088CC, #0099DD);
color: #FFFFFF;
padding: 16px 32px;
border-radius: 14px;
font-size: 16px;
font-weight: 700;
box-shadow: 0 4px 24px #0088CC44;
```

**Secondary / Ghost**
```css
background: rgba(255,255,255, 0.08);
color: #FFFFFF;
border: 1px solid rgba(255,255,255, 0.1);
padding: 6px 16px;
border-radius: 8px;
```

### 6.2 卡片

**标准卡片**
```css
background: rgba(255,255,255, 0.03);  /* 或 #0F0F11 */
border: 1px solid rgba(255,255,255, 0.07);
border-radius: 14px;
padding: 20px;
transition: all 0.2s ease;
```

**Hover 态**
```css
background: rgba(255,255,255, 0.06);
border-color: rgba(255,255,255, 0.14);
transform: translateY(-2px);
```

### 6.3 输入框

```css
background: rgba(255,255,255, 0.04);
border: 1px solid rgba(255,255,255, 0.1);
border-radius: 10px;
color: #FFFFFF;
padding: 14px;
font-size: 14px;
/* Focus */
border-color: rgba(255,255,255, 0.25);
```

### 6.4 Badge / Tag

```css
/* AI badge */
color: #4ade80;
background: rgba(74, 222, 128, 0.12);
padding: 2px 8px;
border-radius: 20px;
font-size: 9px;
font-weight: 700;

/* Purple badge */
color: #7C3AED;
background: #7C3AED22;
padding: 6px 16px;
border-radius: 100px;
font-size: 12px;
font-weight: 600;
```

### 6.5 分隔线

```css
background: #18181B;     /* 或 rgba(255,255,255, 0.06) */
height: 1px;
width: 100%;
```

---

## 7. 导航栏

### TinyClaw 顶栏
```css
/* 粘性顶栏 */
position: sticky;
top: 0;
background: rgba(0, 0, 0, 0.8);
backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(255,255,255, 0.06);
padding: 14px 24px;
z-index: 50;
```

### AgentPuter 顶栏
```css
position: fixed;
top: 0;
background: #0D0D0D / rgba(13,13,13, 0.95);
backdrop-filter: blur(12px);
border-bottom: 1px solid rgba(0,255,65, 0.12);
height: 80px;
padding: 0 80px;
font-family: 'JetBrains Mono';
```

---

## 8. 阴影与特效

| 效果 | CSS |
|------|-----|
| CTA 发光 | `box-shadow: 0 4px 24px #0088CC44` |
| 终端边框发光 | `border: 1px solid #00FF4130` |
| 强调边框 | `border: 2px solid #00FF4150` |
| 卡片悬浮 | `transform: translateY(-2px)` |
| 背景渐变 (CTA区) | `background: linear-gradient(180deg, rgba(74,222,128,0.06) 0%, transparent)` |

---

## 9. 响应式断点

| 断点 | 宽度 | 说明 |
|------|------|------|
| Mobile | < 640px | 单列布局，隐藏导航链接 |
| Tablet | 640px - 1024px | 两列网格 |
| Desktop | > 1024px | 完整布局 |

### 关键适配规则
- Hero 标题: Desktop 40px → Mobile 28px
- 工具网格: `repeat(auto-fill, minmax(260px, 1fr))` → Mobile 单列
- 页面容器: Desktop 960px → Mobile 100% + 20px padding
- 导航 CTA: Mobile 只保留品牌 + CTA 按钮

---

## 10. 动效规范

| 场景 | Duration | Easing |
|------|----------|--------|
| 按钮 hover | 200ms | ease |
| 卡片 hover | 200ms | ease |
| 颜色过渡 | 200ms | ease |
| 导航展开 | 300ms | ease-out |

---

## 11. 使用约定

### 新页面 checklist
- [ ] 背景色使用 `--bg-primary` (`#09090B`)
- [ ] 文字最多使用 3 级灰度 (primary / muted / dim)
- [ ] CTA 按钮使用品牌绿 + 黑字
- [ ] 卡片使用半透明背景 + 半透明边框
- [ ] 所有交互元素有 hover 态
- [ ] 移动端适配 (单列 + 缩小字号)
- [ ] 底部包含 CTA banner → TinyClaw 注册

### 禁止事项
- ❌ 不要使用纯白背景
- ❌ 不要使用超过 14px 的圆角按钮 (AgentPuter 风格用 8px)
- ❌ 不要在非代码场景使用 JetBrains Mono (TinyClaw 品牌下)
- ❌ 不要混合使用两个品牌的主色 (#00FF41 和 #4ade80 不混用)
- ❌ 不要使用彩色背景区块 (保持深色主题一致性)
