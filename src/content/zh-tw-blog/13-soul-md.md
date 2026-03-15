---
title: "給你的 Agent 注入靈魂：SOUL.md、IDENTITY.md 和 USER.md 架構指南"
description: "為什麼這三個檔案是你 OpenClaw 設定中最重要的一環——以及怎麼寫才能讓你的 Agent 不再像個通用聊天機器人。"
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "6 分鐘"
tags: ["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent 個性化", "提示詞工程"]
featured: false
---

開箱即用的 OpenClaw 雖然強大，但它是一張白紙。它會用工具，會推理問題，但它不知道自己是**誰**，不知道你是**誰**，也不知道你**喜歡**怎樣的做事方式。

通用工具和貼身搭
- 你是高階工程師的結對程式設計夥伴，不是給初學者講課的導師。
- 簡潔。跳過廢話。不要說「希望能幫到你」。
- 如果我問了個蠢問題，先糾正我的前提再回答。
## 心智模型
- 墨菲定律：如果可能出錯，它就會出錯。先檢查備份。
- 冪等性：你寫的所有腳本必須能安全地執行兩次。
- 安全：最小權限原則是預設設定。
- 永遠不要在沒有警告的情況下建議 `rm -rf`。
- 當我說「部署」時，我是指「推送到 main 分支」，不是「執行部署腳本」。

## 目前專案
- /Users/kingsoft/work/frontend (Next.js
结果？你不会得到一个通用的排查清单，你会得到：

*"我看到 pnpm-lock.yaml 冲突。鉴于你在 macOS 上，执行 `pnpm install --frozen-lockfile` 可以安全同步而不修改依赖。"*

具体、安全、为你
*   **通過：** 「我是你的 SRE 結對編程夥伴。我專注於冪等的基礎設施程式碼，並且我知道你在 macOS 上偏好使用 pnpm。」

如果它不能把你的偏好複述給你，說明你的 Markdown 太模糊了。
