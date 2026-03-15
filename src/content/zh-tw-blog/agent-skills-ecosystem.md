---
title: "Agent Skills：AI 世界的 App Store 正在成形"
description: "17 萬個開源 Skills、被忽略的 Gateway 層、以及為什麼 Agent 平台正在重走 Windows 的崛起之路。"
date: "2026-02-09"
author: "AgentPuter Lab"
readingTime: "15 分钟"
tags: ["OpenClaw", "AI Agent", "Skills", "MCP", "Agent Gateway", "AgentPuter"]
featured: false
---

前兩篇我們一直在聊 OpenClaw——它是什麼、怎麼跑起來的、以及 1,100 個暴露連接埠背後的安全教訓。

但有一個東西我們反覆提到卻一直沒展開講：**Skills**。

OpenClaw 內建 100 多個 Skills。Anthropic 把 Skills 做成了開放標準。SkillsMP 上已經有超過 17 萬個開源 Skills。

這些數字背後有一個很大的問題：
**Skills 到底是什麼？它和 MCP 什麼關係？為什麼有人說它是 AI 的 "App Store 時刻"？**

今天把這件事講清楚。

---

## 先回答一個最基本的問題

你讓 ChatGPT 幫你做一件事，它會怎麼做？
如果需要，資料夾裡還可以放腳本（比如一個 Python 檔案）、參考文件、範本等輔助材料。

就這樣。沒有複雜的 SDK，沒有要跑起來的 Server，沒有 JSON-RPC 協定。

**資料夾即技能，Markdown 即
- **GitHub Copilot**：微軟系，也已經相容
- **Windsurf**：Cognition 出的 AI 開發環境
- **OpenClaw**：我們前兩篇聊的那位，100+ 內建 Skills

一個 Skill 寫一次，這些
MCP 現在有多火？月度 SDK 下載量 **9700 萬次**，活躍 Server 超過 **10,000 個**。去年 12 月被捐贈給 Linux 基金會，正式成為行業標準。

**Agent Skills** 是
開發體驗差多少？有個工程師在部落格裡記錄了這樣一件事：他先用 MCP 標準流程搭了一個完整的 Server——JSON-RPC 協定、伺服器端基礎設施、錯誤處理，該有的都有。然後他用一個 Markdown Skill 檔案重新實現了
Agent 剛啟動的時候，只看每個 Skill 的名字和一句話描述——大概 100 個 tokens。

使用者提了一個需求，Agent 判斷哪幾個 Skill 可能相關，才去載入它們的完整內容——每個不到 5000 個 tokens。
SkillsMP（Agent Skills Marketplace）上目前已經有 **超過 17 萬個** 開源 Skills。

覆蓋的領域很廣：

- **DevOps**：容器管理、CI/CD 流水線、基礎設施自動化（11,000+
你去 SkillsMP 上找 Skill，體驗跟早期的應用商店差不多：一堆列表，有些寫得很好，有些就是個標題加兩行字，你得自己翻、自己試。

**缺什麼？** 缺一個好的推薦系統，缺場景化的引
**Docker MCP Catalog**

Docker 推出了 200 多個預審計的 MCP 工具，跑在容器化的安全環境裡。這解決了一個關鍵的信任問題：你怎麼知道一個社群貢獻的 MCP Server 不會偷你資料？Docker 的答案是沙
![Agent 能力棧：Skills + Gateway + MCP](/blog/agent-capability-stack.png)

這不是我們自己發明的概念。TrueFoundry、Gartner 2025 報告、以及多篇學術論文（MCP-SandboxScan 做 WASM 沙箱、
1. **Office**（Excel、Word、PowerPoint）——驅動企業採購。公司必須買 Windows，因為 Office 只在 Windows 上跑得最好。
2. **遊戲**（DirectX、踩地雷、紙牌）——驅動消費者購買。個人用戶
- 你說"把昨天會議的錄音整理成紀要"，Agent 直接給你一份結構化的文檔
- 你說"這份合約幫我看看有沒有風險條款"，Agent 直接標註出來

不是"我幫你想想怎麼做"，而是"做好了
每一個大的計算平台都走過同樣的路：一個"能跑就行"的 OS 內核，加上讓人願意留下來的殺手級應用。Windows 有內核 + Office + DirectX。iOS 有內核 + App Store + 幾個爆款應用。Agent 平台也會有 Gateway