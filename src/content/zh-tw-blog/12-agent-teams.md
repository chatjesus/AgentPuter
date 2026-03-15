---
title: "一個 Agent 變成一支團隊：OpenClaw Sub-Agents 實戰指南"
description: "2月，Anthropic 研究員花 $20,000 讓 16 個 Claude Agent 並行寫了一個 C 編譯器。OpenClaw 的 Sub-Agent 系統讓你用同樣的架構跑晨報——成本只要 $0.03。"
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "10 分鐘"
tags: ["OpenClaw", "Sub-Agents", "Agent 團隊", "並行 Agent", "sessions_spawn", "Claude Code"]
featured: false
---

# 一個 Agent 變成一支團隊：OpenClaw Sub-Agents 實戰指南
**2月，Anthropic 的一位研究員花了 $20,000 讓 16 個 Claude Agent 並行寫了一個 C 編譯器。OpenClaw 的 Sub-Agent 系統讓你能用同樣的架構跑你的晨報——成本只要 $
我們大多數人這週沒有 $20,000 可以拿來燒 API。但是，Carlini 使用的架構模式——**將一個巨大的目標拆解為並行任務，分發給獨立的 Agent 執行**——正是 OpenClaw **Sub-Agent** 系統
| **OpenClaw Sub-Agents** | OpenClaw 內建的 `sessions_spawn` 工具。主 Agent 將任務分派給後台工蜂 Agent，工蜂完成後回報結果。 | **OpenClaw**（通用 Agent 平台） |

**這
│       └── 子 Agent B（Depth 1，獨立會話）
    │               └── 工作... 工作... → 彙報結果
    │
    └── 收到所有結果 → 合成最終報告
```

### 關鍵行為

1.  **完全非阻塞
工具是 `sessions_spawn`。注意參數名是 `task`，不是 `instruction`。

```javascript
sessions_spawn({
  task: "搜尋 HackerNews 上最新的 AI 頭條並返回 Top 5",
  model: "gpt-4o-mini",         //
**為什麼有效：** 如果順序執行，主 Agent 的上下文視窗會被三個定價頁面的原始 HTML 填滿。透過並行化，每個工作者處理原始資料，只傳回結構化的摘要。

**推薦工作者模型：** `gpt-4
├── "寫封郵件"     → 寫作專家 Agent
  └── "研究這個主題" → 網路搜尋專家 Agent
```

**專家提示：** 因為子 Agent 不載入 `SOUL.md`，你應該把路由邏輯寫在 **`AGENTS.md`** 裡。

```markdown
## AGENTS.md 路由規則
*   **Agent A：** 查舊金山的 AccuWeather 預報
*   **Agent B：** 讀今天的 Google Calendar 會議
*   **Agent C：** 摘要 Gmail 未讀郵件（標出緊急項）
*   **Agent D：**
*   **模型：** `openai/gpt-4o-mini` 或 `google/gemini-2.5-flash`

你可以在設定檔案裡設定預設值，以防意外：

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "openai/gpt-4o-mini",
        "maxSpawnDepth": 1,
        "maxChildrenPerAgent": 5
主 Agent（CEO）
  └── 調度者 Agent（經理）— 擁有 sessions_spawn 權限
        ├── 工人 A（實習生）— 無法再 spawn
        ├── 工人 B（實習生）
        └── 工人 C（實習生
| **上下文** | 每個 Agent 獨立 | 每個 Agent 獨立 |

如果你在寫編譯器，用 Claude Code。如果你在建構個人助理或業務工作流程，用 OpenClaw。

---

## 實際限制

1.  **單向
*   **成本護欄：** 內建儀表板，精確顯示你的「實習生」們花了多少錢。
*   **智慧預設值：** 開箱即用的優化子 Agent 配置。
*   **一鍵部署：** 60