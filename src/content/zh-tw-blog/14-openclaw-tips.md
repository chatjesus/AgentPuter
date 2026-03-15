---
title: "OpenClaw 進階手冊：30 個沒人告訴你的使用技巧"
description: "maxSpawnDepth 預設值是 1，不是無限。SOUL.md 對子 Agent 不可見。cleanup 預設保留所有檔案。30 條來自真實生產環境的配置技巧，縮短「能跑」和「配置正確」之間的距離。"
date: "2026-02-21"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "配置優化", "Sub-Agent", "Skill", "成本控制", "安全", "實戰技巧"]
featured: true
---

## 目錄

1. [第一章：基礎設定（Tips
會話：  AGENTS.md + TOOLS.md
```

**核心規則：子 Agent 只載入 `AGENTS.md` 和 `TOOLS.md`。**

`SOUL.md`、`IDENTITY.md`、`USER.md`、`
{ "model": "claude-opus-4-6" }
```

正確寫法：
```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-opus-4-6"
      }
    }
  }
}
```

格式始終是 `provider/model-name`。不帶 provider 前綴，當兩個供應商有相似模型名時，OpenClaw 的模型路由器可能靜默失敗。

**常用模型字串：**

| 模型 | 適用場景 |
|------|---------|
| `anthropic/claude-opus-4-6` | 複雜推理、架構設計 |
| `anthropic
| `openai/gpt-4o-mini` | 摘要、分類、格式轉換 |
| `ollama/qwen2.5` | 不能出本地網路的敏感資料 |

---

### Tip 03｜用 .env 管理 API Key，不要放
"defaults": {
      "subagents": {
        "maxSpawnDepth": 2
      }
    }
  }
}
```

- **預設值：** 1（只允許一層子 Agent）
- **最大值：** 5
"defaults": {
      "subagents": {
        "runTimeoutSeconds": 120
      }
    }
  }
}
```

生產環境推薦 120 秒作為大多數任務的上限。數據密集型 Agent 可能需要 300 秒。

**重要：** 超時只停止執行，**不會刪除 session**。你仍然需要 `cleanup` 來管理 session 文件（見 Tip 06）。

---

### Tip 06｜設定 cleanup: "delete" 防止 Session 堆積

預設值是 `keep`。每個完成的 session 都會留下文件，時間久了會堆積。

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "cleanup":
設為 `"delete"` 後，已完成的 session 會被歸檔（transcript 檔案改名為 `*.deleted.*`，不是真刪除），保持工作目錄整潔。不設定的話，session 會一直堆積，直到 60 分鐘自動歸檔觸發。

---

### Tip 07｜接入 context7，停止讓 Agent 編造 API

這一個 MCP 整合對涉及函式庫和框架的任務品質提升最為顯著。接入後，Agent 在回答問題時會查詢即時的官方文件，而不是依賴可能已經一兩年過時的訓練資料。

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp
配置完成後，你可以問：「最新版 Next.js 的 Server Actions 怎麼用？」——得到的是當前準確的答案，不是 2023 年 Beta 版的文件。

---

### Tip 08｜用 TOOLS.md 限制 Agent 能碰什麼

`
- **A/B 級（80+）：** 可以用於生產環境
- **C 級（70–79）：** 安裝前檢查 OAuth 授權範圍
- **D 級（≤69）：** 先在沙盒環境測試。不要直接用於
如果一個 Skill 定義的工具與你 `AGENTS.md` 裡的同名，**Skill 裡的版本生效**。這既是特性（Skill 可以擴展你的基礎配置），也是陷阱（寫得差的 Skill 可能靜默覆蓋某個關鍵配置）。
自然語言就夠了。Agent 完全能理解這樣寫的指令。

---

### Tip 13｜知道該用哪個 Skill 市場

| 平臺 | 優勢 | 最適合 |
|------|------|--------|
| **clawhub.ai** | 人工審
定時：每天 08:00
任務：彙總昨天的 GitHub Issues 和 PR，
      拉取今天的日程，標記日程衝突，
      將摘要推送到 Slack #morning-brief 頻道
```

配置完成後，不需要任何人工介入。這才是「自主」真正的含義。

---

## 第三章：Sub-Agent 架構實戰 {#chapter-3}

> 掌握子 Agent，是從 OpenClaw 用戶到 OpenClaw
sessions_spawn(task="彙總新聞",       label="news-summary",   model="anthropic/claude-haiku-4-5")
sessions_spawn(task="檢查日程衝突",   label="calendar-check", model="anthropic/claude-haiku
"agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }
    }
  }
}
```

真正需要更強能力的任務，在呼
# ✅ 正確 —— 寫在 AGENTS.md（子 Agent 可見）
當使用者詢問財務問題時，轉交給 finance-agent。
```

如果你的路由不工作，這是首先要檢查的地方。

---

### Tip 18｜Spawn 子 Agent
### Tip 19｜子 Agent 是「發射後不管」，不是即時對話

`announce` 機制是單向的：子 Agent 在完成時回報，**無法在執行中途向父 Agent 提問**。

這對 task prompt 有
label="jan-2026-sales-analysis"
)
```

把 task prompt 寫成「留給一個無法向你提問的人的詳細便條」。

---

### Tip 20｜調整並行限制，避免觸發 API 限速
高級 API Plan 可以把 `maxConcurrent` 調高；個人 Plan 建議保持在 3–4。

---

## 第四章：成本控制 {#chapter-4}

> 跑 Agent 需要花錢，但可以花得很聰明。

---

### Tip
Claude Opus 和 Sonnet 4.6 支援 Context Compaction API。當對話歷史接近 token 上限時，系統會智慧壓縮，而不是截斷。

最重要的場景：
- 多小時的研究會話
- 長時間的除錯過程
- 迭代式文件
"tasks": {
    "summarize": { "model": "openai/gpt-4o-mini" },
    "classify":  { "model": "openai/gpt-4o-mini" },
    "translate": { "model": "openai/
}
}
```

設定本機 Ollama 後，將敏感工作負載路由到 `ollama/qwen2.5`。速度比雲端慢，但資料完全不離開本機網路。對於受監管的產業，這往往是合規要求，不
- `error` → 真實失敗。查 `/subagents log <runId>` 找具體報錯。

用同樣的配置重跑一個超時的 Agent，會得到同樣的結果。先修超時設定。

---

### Tip 28｜
| `files:readwrite` | `files:read` |
| `contacts:*` | `contacts:read` |

讀取日程的 Skill 不需要寫入權限。傳送郵件的 Skill 不需要刪除郵件。授權任何新 Skill 前，檢查
| 配置 SSH 金鑰 | 10 分鐘 |
| 安裝 Node.js | 5 分鐘 |
| 安裝 OpenClaw | 7 分鐘 |
| 配置 AI 供應商 | 10 分鐘 |
| 連接 Telegram | 4 分鐘
- 起草合約、社交貼文、招聘描述
- 價格對比和優惠券查詢

以及你用自然語言說出來的任何其他場景。本文 30 條技巧在你跑起來後立即可用——TinyClaw 只是去掉了設定摩擦
- **Skill 市場（品質優先）：** [clawhub.ai](https://clawhub.ai)
- **Skill 市場（數量優先）：** [agentskills.io](https://agentskills.io)
- **一鍵部署：** [tinyclaw.dev](
