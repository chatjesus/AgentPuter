---
title: "Perplexity 打造的功能，正是 OpenClaw 使用者早已自行運行的架構"
description: "2 月 25 日，Perplexity 推出了 Computer——一個雲端 AI，能調度 19 種模型、平行運行子代理人並自主執行任務，月費 200 美元。本文說明 OpenClaw 使用者已擁有什麼、還差什麼，以及這對代理人平台競賽意味著什麼。"
date: "2026-02-28"
author: "AgentPuter Lab"
readingTime: "14 min"
tags: ["OpenClaw", "Perplexity", "AI Agent", "Multi-Agent", "Agent Platform"]
featured: true
---

## 1. Perplexity Computer 究竟是什麼 {#what-it-is}
核心概念：用淺顯易懂的語言描述成果，電腦就會找出達成的方法。「為我的餐廳規劃並執行一場數位行銷活動。」、「幫我建立一個能追蹤閱讀進度的 Android 應用程式。」您不是在寫提示詞或挑選工具——您
在該介面背後，電腦會將請求拆解成結構化的子任務，再從其 19 個可用模型中，為每個步驟指派最適合的模型來執行——有些任務會並行處理，有些則循序進行——直到全部完成為止。
| Veo 3.1 | 影片生成 |
| Grok | 輕量級、速度敏感的任務 |

總共有 19 個模型 — 上表顯示了主要的具名模型。Opus 是編排層；它會決定哪個模型處理哪個子任務
**環境：**每個任務都在一個隔離的雲端運算環境中執行，可存取真實的檔案系統、真實的瀏覽器，以及預先建置的工具整合。任何東西都不會在您的本機電腦上執行。整合項目由 Perplexity 精心策劃——沒有第三方外掛程式，也沒有自訂的 MCP 伺服器。
**價格：**Perplexity Max 每月 200 美元，包含 10,000 點數。電腦運作時會消耗點數——使用量並非無限制。您可以為每個子代理程式設定支出上限，讓您能以實際的美元金額
**關於行銷術語的一點注意事項：**Perplexity 聲稱 Computer「能夠運行數小時甚至數月」。該產品於 2 月 25 日推出。目前還沒有人在實際工作流程中驗證過這個長達數月的說法。在有使用者報告佐
> *「AI 代理人能力非凡——但它們沒有家、沒有持續性的工作空間，也沒有屬於自己的電腦。」*

Perplexity Computer 正是該論點的一項商業化實作。
這並非 Perplexity 讀了那篇文章後才打造產品的案例。Perplexity 早在一月就開始了內部實驗——在部落格 #01 發布之前。這是多個團隊各自獨立得出相同的結論。這本身就是一個訊號：問題真實而明顯，以致
| 持續性工作空間 | 每個任務的雲端檔案系統 | `~/.openclaw/data/` |
| 多模型路由 | 19 種模型，由 Opus 協調 | `model.fallbacks` + `modelByChannel` |
| 子
| 代理人情境檔案 | 平台管理，使用者不可見 | `SOUL.md`、`USER.md`、`HEARTBEAT.md` |
| 支出控制 | 每個子代理人的點數上限 | `runTimeoutSeconds`（以時間為基礎的替代方案） |

這些設計決策幾乎完全對應。持久性儲存、瀏覽器存取、多模型路由、子代理人平行處理、長時間自主運行——這些都不是 Perplexity 發明的功能。它們是 OpenClaw 社群自去年以來就一直在使用的功能，而且是以可配置的形式。
OpenClaw 的創辦人 Peter Steinberger 在二月加入了 OpenAI。Altman 將個人代理人形容為「將迅速成為我們產品供應的核心」，並表示未來「將會是極度的多代理人」。Anthropic 在一月推出了 Claude Cowork。整個產業現在正將 Open
Ars Technica 說得好：*「如果 OpenClaw 是 AI 代理人工具的開放網路，那麼 Computer 就是 Apple 的 App Store。」*

這個比喻既準確又值得深思。開放網路讓你打造並存取任何事物——代價是犧
| 維度 | Perplexity Computer | OpenClaw |
| --- | --- | --- |
| 執行位置 | 僅限雲端 | 本機、自行託管的 VPS 或 TinyClaw |
| 整合模型 | 經策劃的平台整合 | Open Skills + MCP 生態系 |
| 設定 | 由平台管理，使用者不可見 | `openclaw.json`，使用者完全控制 |
| 安全模型 | 由平台負責 | 由使用者負責 |
| 客製化上限 | 低 — 使用 Perplexity 提供的功能 | 高 — 可設定任何項目 |
| 透明度 | 黑盒子 | 透過 `sessions_history` 取得完整逐字稿 |
| 資料位置 | Perplexity 的雲端 | 您的機器或您的伺服器 |
| 開銷控制 | 每個子代理的額度上限 | `runTimeoutSeconds` (時間代理) |

這種權衡取捨始終朝著一個方向：Perplexity 放棄控制權，以換取簡潔性與安全性；OpenClaw 則放棄簡潔性，以換取控制權與擴充性。

---

## 4. Perplexity 做不到的事 {#cant-do}
這並非邊緣案例——而是 OpenClaw 使用者視為基本配備的功能。

**SOUL.md — 持續性的代理人身分**

在 OpenClaw 上，`SOUL.md` 是一個檔案，用來塑造代理人在每個會話中的思考
Perplexity Computer 沒有對應的功能。每個任務都從平台的預設值開始。你無法編寫持續性的指令集，無法定義代理程式應如何處理模糊性，也無法賦予它一個持續存在的角色。你今天使用的代理程式，不會記得你先前建立的任何偏好
OpenClaw 會自主執行排程的工作流程。「每個工作日的上午 7:50，擷取昨天的 GitHub 活動紀錄，摘要需要審核的 PR，然後將彙報推播到 Telegram。」沒有人需要按下按鈕。代理程式會準時啟動、執行
OpenClaw 揭露一個 `/hooks/agent` 端點。當 PR 開啟時，一個 GitHub Webhook 會被觸發；代理程式會讀取 diff、執行審查，並將回饋發布到 Slack——全程無需人為介入。外部事件驅動了整個工作流程。

Perplexity Computer 沒有傳入的 Webhook 介面。它無法監聽來自外部系統的事件。

**本機檔案存取**
如果您的工作流程會接觸到您機器上的檔案——從本機儲存庫讀取程式碼、處理您檔案系統中的文件、與本機應用程式互動——Perplexity Computer 將無法存取它們。所有操作都在 Perplexity 的雲端環境中執行。您的本機電腦對它而言是不可見的。

**第三方技能與 MCP 伺服器**
OpenClaw 的生態系包含 ClawHub 和 agentskills.io 上數千種的技能 (Skills)，並支援自訂的 MCP 伺服器。您可以安裝一個連接到您內部工具的技能、編寫一個將您組織工作流程編碼的自訂技能
OpenClaw 中的 `sessions_history` 提供了代理程式所有行為的完整、可供檢視的紀錄：每一次的工具呼叫、每一次的模型回應、每一個決策點。當出現問題時，你可以確切地了解發生了什麼事。

Perplexity Computer 會向你
## 5. Perplexity 做得更好的地方 {#does-better}

誠實看待這每月 200 美元買到的是什麼，這點很重要。其中有幾項是真正的優勢，而不僅僅是行銷話術。

**零設定**
在 OpenClaw 上，即便由 TinyClaw 處理基礎架構，使用者仍需進行相當的設定步驟：連接頻道、撰寫 SOUL.md、設定模型堆疊、決定 Cron 排程。對非技術使用者而言，這道門檻相當高。
Opus 會決定每個子任務要由 19 個模型中的哪一個來處理。您不需要指定「用 Gemini 進行研究、用 Nano Banana 處理圖像、用 Grok 處理輕量級任務」。這項路由會根據 Perplexity 系統判斷出的最佳
在 OpenClaw 上，要建立等效的多模型路由，需要進行刻意設定：設定 `subagents.model`、使用 `modelByChannel`、編寫 `model.fallbacks`，甚至可能需要在 `AGENTS.md` 中編寫自訂的路由邏輯。這辦得到——但需要花費一番功夫。

**每個子代理程式的開銷上限**
這是 Perplexity 具備而 OpenClaw 明確沒有的一個領域。基於點數的支出上限，讓你可以設定「這個研究子任務的花費不應超過 X」。這就是在任務層級上，以金額為單位的直接成本控制。

OpenClaw 的成本控制
瀏覽器、程式碼執行、圖像生成、影片生成——這些功能開箱即用，無需除錯，也無需憑證管理。在 OpenClaw 上，每項功能都需要安裝技能、設定 MCP 伺服器，或是提供 API 金鑰。設定完成後，
ClawHavoc 事件是此風險最明確的例證。2026 年 2 月，在一場協同的供應鏈攻擊中，有 341 個惡意技能在 ClawHub 上被發現。主要的惡意負載是 Atomic Stealer (AMOS)
Perplexity Computer 的封閉模型完全消除了這個攻擊面。你無法安裝惡意技能，因為你根本無法安裝任何技能。

**商業問責**

每月支付 200 美元，即可獲得支援合約、SLA，以及一個在產品故障造成您
## 6. 各自的實際適用對象 {#who-for}

它們並不是在爭奪同一群使用者。這點很重要，因為將它們視為競爭對手，會導致在選擇使用哪一個時得出錯誤的結論。

**Perplexity Computer：**
最能從 Perplexity Computer 獲益的使用者，其工作流程以雲端為基礎，不需要存取本機檔案或由外部事件觸發，樂於讓平台管理所有路由與基礎架構決策，並且重視「能用就好」勝過「我完全
一位自動化競爭對手研究的行銷顧問。一位使用 AI 協助研究與草稿撰寫的作家。一位想將完全存在於雲端服務中的客戶溝通工作流程自動化的小型企業主。對這些使用者而言，OpenClaw 的設定層是阻力，而非價值。Perplexity Computer 以每月 200 美元的價格消除了這種阻力。

**OpenClaw：**
最能從 OpenClaw 受益的使用者，具有特定的基礎架構需求：本地檔案存取、由 Cron 觸發的自主工作流程、由 Webhook 驅動的事件處理、用於專有工具的自訂 Skills，或因資料落地需求，而無法
想要一個 PR 審查機器人的工程師。需要在本機 repo 中處理程式碼的代理人的開發者。需要在內部基礎設施上運行自動化監控工作流程的維運團隊。需要能長時間運行、並在 SOUL.md 檔案中跨工作階段累積知識的
最明確的判斷標準是：如果你的工作流程需要在沒有人為輸入的情況下啟動（例如 Cron 或 Webhook），或者需要處理不在 Perplexity 雲端中的檔案，那你就是 OpenClaw 的使用者。如果你的工作流程是由你啟動，並且完全存於雲端服務中，那麼 Perplexity Computer 就值得評估。

這兩類群體都存在，而且都會成長。代理人基礎設施市場大到足以容納這兩種方法，而兩者很可能會繼續分歧，而非融合。

---
## 7. 這對代理人平台競賽意味著什麼 {#platform-race}

**基礎架構的論點已成定局。**

在 2025 年初，「代理人需要自己專屬的持續性運算環境」還是一個需要
現在的競爭是關於誰擁有基礎設施層——而不是基礎設施層是否存在。

**開源轉商業化的管道正如期運行。**
OpenAI 聘請了 OpenClaw 的創作者。Perplexity 基於這個概念打造了一款產品。Anthropic 打造了 Claude Cowork。這種模式與 Linux → Red Hat → AWS、Android → Samsung，以及 Git → GitHub 的發展模式相符。開源
對於 OpenClaw 生態系，一個值得問的問題是：隨著封閉、精緻的版本不斷改進，開放、可配置的版本是否還能保有其獨特的價值？歷史上的答案是肯定的——但其價值主張必須保持清晰。「完全控制、任何基礎架構、可擴展的生態系」是一個明確的定位。而「一個設定更麻煩、稍微便宜一點的 Perplexity Computer 版本」則不是。

**每月 200 美元加上額度限制，確立了市場願意承受的價格。**
此為該功能最精緻、免設定、由 19 個模型協作的版本的目前價格。其中內含 10,000 點點數 — 並非無限使用。
TinyClaw 能在不到一分鐘內，以顯著更低的成本，部署相同的底層多代理人架構，並可存取 Cron 排程、Webhooks、本地檔案存取，以及完整的 OpenClaw Skills 生態系。其價值主張並非「
市場是真實存在的。基礎設施的競賽已經開始。OpenClaw 是證明此概念的開源原型。Perplexity Computer 是首批基於此概念的主要商業化產品之一。預計將有更多出現。

---

## 快速參考

| | Perplexity Computer | OpenClaw + TinyClaw |
| --- | --- | --- |
| 價格 | 每月 200 美元（包含 1 萬點數） | 開源 + TinyClaw 定價 |
| 設定時間 | 數秒 | 數分鐘到數小時 |
| 模型數量 | 19 個（由 Opus 自動路由） | 可設定（任何供應商） |
| 支出上限 | 基於點數，每個子代理 | 基於時間 (`runTimeoutSeconds`) |
| 客製化 | 低 | 高 |
| 本地檔案存取 | 否 | 是 |
| Cron / 排程任務 | 否 | 是 |
| Webhook 接收 | 否 | 是 |
| 自訂技能 / 插件 | 否 | 是 (ClawHub, agentskills.io) |
| 持久性代理身份 | 否 | 是 (`SOUL.md`) |
| 資料位置 | Perplexity 的雲端 | 由您選擇 |
| 完整稽核紀錄 | 否 | 是 (`sessions_history`) |

---

## 資源
- [Perplexity Computer 發表](https://www.perplexity.ai/hub/blog/introducing-perplexity-computer)
- [Ars Technica：Perplexity 發表「Computer」](https://arstechnica.com/ai/2026/02/perplexity-announces-computer-an-ai-agent-that-assigns-work-to-other-ai-agents/)
- [agentputer.com](https://agentputer.com/) — 為 OpenClaw 提供的 24/7 雲端託管服務
- [tinyclaw.dev](https://tinyclaw.dev/) — 一鍵部署
- [docs.openclaw.ai](https://docs.openclaw.ai/) — OpenClaw 文件
- [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) — OpenClaw 儲存庫

---

*來源：Perplexity 部落格 · Ars Technica · TechCrunch · The Verge · gHacks · The Tech Outlook · 2026 年 2 月*
