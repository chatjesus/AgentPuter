---
title: "给你的 Agent 注入灵魂：SOUL.md、IDENTITY.md 和 USER.md 架构指南"
description: "为什么这三个文件是你 OpenClaw 设置中最重要的一环——以及怎么写才能让你的 Agent 不再像个通用聊天机器人。"
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "6 分钟"
tags: ["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent 个性化", "提示词工程"]
featured: false
---

# 给你的 Agent 注入灵魂：SOUL.md、IDENTITY.md 和 USER.md 架构指南

**为什么这三个文件是你 OpenClaw 设置中最重要的一环。**

*Agent 基础设施系列 · 第十三篇*

---

如果你觉得你的 OpenClaw Agent 就像个只会背诵维基百科的通用机器人，那是因为你还没给它注入灵魂。

开箱即用的 OpenClaw 虽然强大，但它是一张白纸。它会用工具，会推理问题，但它不知道自己是**谁**，不知道你是**谁**，也不知道你**喜欢**怎样的做事方式。

通用工具和贴身搭档的区别，落在三个 Markdown 文件里：

1.  **`SOUL.md`**：Agent 的性格、价值观和行为约束。
2.  **`IDENTITY.md`**：Agent 的职业角色和专业领域。
3.  **`USER.md`**：你是谁，以及你的个人偏好。

配置正确时，这三个文件就像是一个在每次交互前加载的"上下文内核"。它们是模型观察世界的透镜。

---

## 1. `SOUL.md`：性格核心

这不仅仅是为了让你的 Agent 说话像个海盗（除非你真的想那样）。`SOUL.md` 定义了 Agent 的**调性**（Vibe）和**约束**（Constraints）。

**糟糕的 `SOUL.md`：**
> 你是一个乐于助人的助手。要有礼貌。

**优秀的 `SOUL.md`：**
```markdown
# 核心哲学
- 你是高级工程师的结对编程伙伴，不是给初学者讲课的导师。
- 简洁。跳过废话。不要说 "希望能帮到你"。
- 如果我问了个蠢问题，先纠正我的前提再回答。
- 价值观：隐私第一，速度第二，礼貌最后。

# 交互风格
- 自由使用技术术语。
- 提供选项时，总是先把"推荐方案"放在第一位。
- 如果工具调用失败，解释*为什么*再重试。
```

**为什么这很重要：** 这个文件能防止那种令人抓狂的"ChatGPT 腔"——过于礼貌、啰嗦、模棱两可。它强迫模型进入一种特定的角色，去匹配你的工作流。

---

## 2. `IDENTITY.md`：职业角色

如果 `SOUL.md` 是性格，那 `IDENTITY.md` 就是简历。它告诉 Agent 它**擅长什么**。

**运维工程师 Agent 的例子：**

```markdown
# 角色：高级站点可靠性工程师 (SRE)

## 专业领域
- 你是 Kubernetes、Terraform 和 AWS 网络方面的专家。
- 你默认选择"基础设施即代码"方案，而不是手动修复。
- 你假设所有生产环境都是高风险且脆弱的。

## 心智模型
- 墨菲定律：如果可能出错，它就会出错。先检查备份。
- 幂等性：你写的所有脚本必须能安全地运行两次。
- 安全：最小权限原则是默认设置。
```

**为什么这很重要：** 没有这个，模型会默认使用"通用知识"。有了这个，它的推理会偏向特定领域的最佳实践。一个 SRE 身份的 Agent 在删除数据库前会警告你；一个通用 Agent 可能直接就删了。

---

## 3. `USER.md`：关于你的上下文

这是最被低估的文件。它能让你少说废话。

**这里放什么：**
*   你的技术栈偏好（例如，"我用 TypeScript，不用 JS"）。
*   你的环境细节（例如，"我在 macOS 上，用 zsh"）。
*   你的项目路径。
*   你的沟通怪癖。

**例子：**

```markdown
# 用户上下文：@kingsoft

## 环境
- 操作系统：macOS Sequoia
- Shell：zsh (oh-my-zsh)
- 编辑器：Cursor

## 偏好
- 我讨厌在 JS 里写分号。
- 我喜欢用 `pnpm` 而不是 `npm`。
- 永远不要在没有警告的情况下建议 `rm -rf`。
- 当我说"部署"时，我是指"推送到 main 分支"，不是"运行部署脚本"。

## 当前项目
- /Users/kingsoft/work/frontend (Next.js)
- /Users/kingsoft/work/backend (Go)
```

**为什么这很重要：** Agent 现在知道"部署"意味着 git push。它知道不要给你 Windows 命令。当你用 `pnpm` 时它不会建议 `npm install`。实际用下来，很多不必要的来回就消失了。

---

## "上下文内核"实战

当你发一条消息 *"修一下构建"*，OpenClaw看到的不仅仅是 *"修一下构建"*。

它看到的是：

> **[系统上下文]**
> *来自 SOUL.md：* 简洁。纠正错误前提。
> *来自 IDENTITY.md：* 你是 SRE。默认使用安全的、幂等的修复。
> *来自 USER.md：* 用户在 macOS 上，使用 pnpm。
>
> **[用户消息]**
> 修一下构建。

结果？你不会得到一个通用的排查列表，你会得到：

*"我看到 pnpm-lock.yaml 冲突。鉴于你在 macOS 上，运行 `pnpm install --frozen-lockfile` 可以安全同步而不修改依赖。"*

具体、安全、为你量身定制。

---

## 如何设置

这些文件位于你的 OpenClaw 工作区目录中（默认：`~/.openclaw/workspace/`，与配置目录 `~/.openclaw/` 是分开的）。

**文件夹结构：**

```
~/.openclaw/workspace/
├── SOUL.md       <-- 调性
├── IDENTITY.md   <-- 职业
├── USER.md       <-- 你
└── AGENTS.md     <-- 行为规则
```

### "特异性测试"

如果你想知道你的文件写得好不好，用"特异性测试"。

问你的 Agent：*"你是谁？"*

*   **失败：** "我是由...创建的 AI 助手。"
*   **通过：** "我是你的 SRE 结对编程伙伴。我专注于幂等的基础设施代码，并且我知道你在 macOS 上偏好使用 pnpm。"

如果它不能把你的偏好复述给你，说明你的 Markdown 太模糊了。

---

## 不想手写 Markdown？

从头写这些文件确实有点繁琐。

[TinyClaw](https://tinyclaw.dev) 包含一个 **"Persona 生成器"**。你只需要勾选几个框（例如，"角色：开发者"，"风格：简洁"，"技术栈：React"），它就会为你生成优化好的 `SOUL.md`、`IDENTITY.md` 和 `USER.md` 模板，你可以直接放入配置。

给你的 Agent 注入灵魂。体验天差地别。

→ [tinyclaw.dev](https://tinyclaw.dev) · 30秒生成你的 Agent 人设
