---
title: "AI 腦子大亂鬥：Gemini 3.1 Pro 剛上線，OpenClaw 該換模型了嗎？"
description: "Gemini 3.1 Pro 在專為 AI Agent 設計的 MCP Atlas 基準上拿了 69.2% 全場最高，但 OpenClaw 官方文檔推薦的預設模型還是 Claude Opus 4.6。5 個 benchmark、5 個選手，我們把該看的數據全理了一遍。"
date: "2026-02-19"
author: "AgentPuter Lab"
readingTime: "14 分鐘"
tags: ["OpenClaw", "Gemini 3.1 Pro", "Claude Opus 4.6", "Claude Sonnet 4.6", "MCP Atlas", "AI 模型", "Benchmark 對比"]
featured: true
---

**兩天前 Anthropic 發布 Claude Sonnet 4.6，昨天 Google 發布 Gemini 3.1 Pro。對 OpenClaw 用戶真正重要的那項基準測試，結果讓人意外——而官方文檔推薦的預設模型還沒變。**

*
這不是抽象的描述。這正是 OpenClaw 每次執行 Skill 時在做的事。

**Gemini 3.1 Pro 在 MCP Atlas 上拿了 69.2%，Claude Opus 4.6 拿了 59.5%。**

但 OpenCl
|---------|--------|-------------------|
| **MCP Atlas** | 跨伺服器工具發現、選擇、多步編排（36 個真實 MCP 伺服器） | ★★★★★ 這就是 OpenClaw Skills 做的事 |
| **APEX-Agents
| ARC-AGI-2 | 抽象新穎邏輯推理 | ★★★ 複雜規劃任務 |
| GPQA Diamond / MMLU | 研究生級知識題 | ★★ OpenClaw 不考研究所 |

記住這張表，再看下面每個選手。
- **BrowseComp: 85.9%**——全場最高（所有模型均在工具輔助下測試：搜尋 + Python + 瀏覽器，非裸模型）
- **ARC-AGI-2: 77.1%**——是上代
- **定價：** $2 輸入/$12 輸出（per M tokens，≤200K context）；超 200K 切換至 $4/$18——與上代 Gemini 3 Pro 定價相同，推理性能翻倍以上

**如何在 OpenCl
- **τ2-bench Telecom: 99.3%**——與 Gemini 3.1 Pro（同樣 99.3%）並列全場最高
- **GDPval-AA Elo: 1606**——全場第二，僅次
- **Agent Teams（alpha）：** 多個專業子 Agent 並行協作（前端/後端/測試同時工作），在 Claude Code v2.1.32+ 和 Cowork 平台可用
- **Adaptive Thinking（4檔）：** 自動根據任務難度調節推理深度
这不是小众指标。GDPval-AA 衡量的是高价值专业任务的综合表现——错误会有真实后果的那种工作。Claude Sonnet 4.6 在这项上超过了 Claude Opus 4.6（1606）、GPT-5.2（14
和 Opus 4.6 一樣，Sonnet 4.6 也擁有 1M tokens 上下文（beta）、Context Compaction API 和 Adaptive Thinking。

**如何在 OpenClaw 中使用：**

```bash
openclaw models set anthropic/claude-sonnet
如果你的 OpenClaw 工作流以程式碼為核心——自動 Debug、重構、CI/CD 管理——Codex 5.3 值得測試。對於通用 Agent 編排，它不是正確的工具。

**如何在 OpenClaw 中使用：**

```bash
open
對於成本敏感的工作流——尤其是中文語境任務——Kimi K2.5 以遠低於 Claude 的價格提供有競爭力的 Agent 表現。它是當前中文 OpenClaw 部署中增長最快的模型。

---

## 關鍵數據一眼看穿
| **τ2-bench Retail**（工具穩定性） | 90.8% | **91.9%** | 91.7% | — | 🏆 Opus |
| **BrowseComp**（搜尋推理） | **85.9%** | 84.0% | 74.7% | — | 🏆 Gemini |
| SWE-Bench Pro（程式碼修復） | 54.2% | — | — | **56.8%** | 🏆 Codex |

Gemini 3.1 Pro 贏了 5 項核心 Agent 指標中的 3 項。Claude Sonnet 4.6 拿下專家任務 ELO 第一。Claude Opus 4.6 工具穩定性最強。GPT-5.3-Codex 獨佔程式碼賽道。

沒有一個模型在所有維度都贏——關鍵是看哪些基準最接近你真實的工作流。

---

## 不同場景選哪個？

| OpenClaw 使用場景 | 推薦模型 | 核心理由 |
|----------------|---------|---------|
| 郵件處理 + 日曆管理（gog、mail 類 Skills） | **Sonnet 4.6** | GDPval-AA 1633 全場第一，處理專業事務最穩，成本是 Opus 的 60% |
| 複雜跨
| 每日輕量任務、高頻對話 | **Sonnet 4.6** | 性價比最優，100 步任務約 $0.90 vs Opus 的 $3.60 |
| 中文語境 + 成本敏感 | **Kimi
| Gemini 3.1 Pro | ~$0.60 | $2/$12 per M tokens（≤200K）；超 200K 為 $4/$18 |
| Opus 4.6 | ~$3.60 | 超 200
**原因二：整個生態是基於 Claude 的行為特徵調優的**

ClawHub 上大量 Skills 的提示詞寫法、工具調用格式、錯誤恢復模式，都是開發者對著 Claude 反覆測試調整出來的。切換模型不只是改一行設定——
**實話實說：** Gemini 3.1 Pro 是當前最值得測試的新選手——尤其是跨系統自動化和瀏覽器類工作流程。但"benchmark 上應該更好"和"在你的具體 OpenClaw 環境裡確實更好"是兩個不同的命
openclaw models set anthropic/claude-sonnet-4-6

# 切換到 GPT-5.3-Codex（需要 OAuth 登入）
openclaw onboard --auth-choice openai-codex
openclaw models set openai-codex/gpt-5.3-codex

# Kimi K2.5（中文語境 / 成本敏感）
openclaw models set moonshot/kimi-k2.5

# 本地模型（Ollama，完全免費）
openclaw models set ollama/qwen3.5
```

也可以寫進設定檔（`~/.openclaw/openclaw.json`）：
> **重要提醒：** OpenClaw 目前不支援在單一配置裡對不同任務自動分配不同模型（沒有內建的跨任務模型路由）。進階玩法是執行多個 OpenClaw 實例、分別配置不同模型，透過 Agent2Agent 協
模型大戰每 11 天打一輪。TinyClaw 替你跟進。

→ [tinyclaw.dev](https://tinyclaw.dev) · 免費開始 · 60 秒建好你的 Agent

---

## 更大的格局

Gemini 3
*資料來源：Gemini 3.1 Pro 官方 benchmark 表（Google DeepMind，2026年2月19日）。MCP Atlas 方法論：Scale AI Research，arxiv 2602.00933，scale.com/research/mcpat