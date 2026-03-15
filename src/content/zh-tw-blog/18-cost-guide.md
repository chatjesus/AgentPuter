---

# 如何以每月低於 30 美元的成本運行 OpenClaw（完整
> - [目前最實惠的 LLM (2026 年 2 月)](https://github.com/openclaw/openclaw/discussions/12267) — GitHub 討論區 #12267
> - [MemOS 外掛程式如何將 OpenClaw Token 成本降低 70%](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) — Medium，2026 年 3 月 4 日
> - [ibl.ai OpenClaw Router](https://github.com/iblai/iblai-openclaw-router) — GitHub
> - [降低您的 OpenClaw LLM 成本：SaladCloud 指南](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — SaladCloud 部落格，2026 年 2 月 9
> - [OpenClaw 2026.3.7 發行說明](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [OpenClaw 2026.3.
*「為什麼我的代理程式費用這麼高？」*

有位使用者在兩週內花了 $254 美元。另一位則在一個月內達到 $800 美元。科技部落客 Federico Viticci 因為執行密集的跨頻道自動化，累積了
他們並非挑戰極限的重度使用者。這只是一般的配置與正常的使用情況。

OpenClaw 本身是免費的，但它所呼叫的模型並不是。而且由於 OpenClaw 的設計是為了 24/7 全天候運作——簽到
這篇文章是 OpenClaw 本應隨附的指南。我們將帶您一探究竟，錢都花到哪去了、最新版本 (3.7 和 3.8) 有哪些幫助您省錢的更新，以及真實使用者如何在不犧牲任何重要功能的情況下
OpenClaw 每一次呼叫 API 時，都會將您的 `SOUL.md`、`AGENTS.md` 以及其他引導檔案載入到提示中。這些檔案並非只載入一次——而是會隨著**每一次請求**一併送出。如果您的
r/LocalLLaMA 上的一位使用者，透過移除那些每次載入、卻幾乎從未被參考的三個月前專案背景資料，[將他們的 bootstrap 從 85KB 縮減至 27KB](https://www.reddit.com/r
您的對話記錄會隨著每次互動而增長。在活躍使用數小時後，您的對話記錄中就會累積數萬個 token。所有這些記錄都會伴隨著每個新請求一起傳送。對於重度使用者而言，這是成本增加的主要原因 — 這也是 [lossless-
OpenClaw 的心跳預設每 30 分鐘運行一次。每次檢查都是一次完整的 API 呼叫，其中包含您所有的系統脈絡。在 Opus 上，這是一筆可觀的開銷——每天 48 次心跳，每次都帶著您
### 4. 子代理的生成

當您的主代理將任務委派給子代理時，每個子代理都會以其自身的上下文、記憶體及模型呼叫來啟動。運行多代理設定（一個用於寫作，一個用於研究，一個用於編寫程式碼）
網頁抓取、檔案讀取、搜尋結果——這些工具的輸出會被儲存在對話紀錄中，並隨著後續的訊息再次傳送。單次網頁抓取就可能將數千個 token 塞進您的歷史紀錄，並在該次對話的
## 若您尚未開始：免費入門之道

在我們談論最佳化之前，先給尚未設定 OpenClaw 的使用者一些提醒。

您不需要花一毛錢就能試用。**Gemini 2.5 Flash-Lite** 有一個[免費方案](https://ai.google.dev/gemini-api/docs/pricing)，提供慷慨的每日配額——足以運行一個基本的代理程式，供輕度的個人使用。接下來的選擇是 MiniMax M2.5 Standard，每百萬 token 的價格為 0.15/1.20 美元——每次典型的代理程式互動成本不到一分錢。

最低配置：
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // 免費方案
    }
  }
}
```

連接一個頻道 (僅限 Telegram 或 WebChat)，保持 SOUL.md 簡短，您就能零成本擁有一個可運作的個人代理人。再以此為基礎進行擴展。

---

## 3.7 和 3.8 版的變更內容 (與成本相關的功能)

最近的兩個版本包含了數個直接影響成本的功能。重點如下：

### 來自 3.7 版 (3月8日)
**情境引擎外掛程式 API + lossless-claw。**[lossless-claw 外掛程式](/blog/lossless-claw)能讓您的作用中情境無論對話進行多長時間，都維持在 30K 到 100K token 的範圍內
**將 MiniMax-M2.5-highspeed 列為一級模型。**不再是臨時的解決方案——它已正式整合至模型目錄、初始設定與路由中。這是一個快速、低成本的模型，可處理 80% 的例行代理工作。
**`openclaw backup create` 與 `openclaw backup verify`。**這並非直接的成本功能，但若您曾遺失設定而必須重建——那便是浪費時間與 token 來和您的代理人重新建立脈絡。

**Brave 網頁搜尋 LL
**對話模式靜音逾時。** `talk.silenceTimeoutMs` 讓您控制語音輸入自動送出的時機。可避免因只說了半句話就過早送出，而浪費一次 API 的往返呼叫。

**GPT-5.4 情境視窗修正。** `openai-codex/gpt-5.4` 的 1,050,000-token 情境視窗與 128K 最大輸出 token 現已正確套用。如果您訂閱了 Codex，這意味著因情境溢出而需壓縮的次數將會減少。

---

## 策略一：檢查您的帳單（5 分鐘，零成本）
每個成功減少帳單開銷的使用者都說了同樣的話：訣竅並非什麼特定的技巧——而是看清楚錢都花到哪裡去了。
立刻登入您的 API 供應商儀表板。查看每日支出，找出費用高峰。一位在 [r/openclaw 追蹤了 30 天內每一塊錢花費](https://www.reddit.com/r/LocalLLM/comments/1
在 OpenClaw 中，使用 `/status` 來查看目前工作階段的模型和 token 數量。使用 `/usage full` 來取得每次回應的成本明細。無法衡量的東西，就無法優化。

---

## 策略 2：修正心跳機制（一個設定
defaults: {
      heartbeat: {
        intervalMinutes: 120
      }
    }
  }
}
```

這會將您每天的呼叫次數從 48 次減少到 12 次——心跳成本降低了 75%，而對回應速度的影響微乎其微。

**將心跳路由至便宜的模型。** 如果您正在使用路由代理（請參閱策略 5），心跳會被自動分類為「輕量級」並傳送至 Haiku。如果透過 Ollama 使用本機模型，心跳成本為 $0。

---

## 策略 3：修剪您的 SOUL.md（刪除文字，節省 70%）
您系統提示詞中的每個 token，在每次呼叫時都會被計費。這就是大多數人會忽略的乘數成本。

一個來自社群的真實範例：

| 指標 | 之前 | 之後 |
|---|---|---|
| SOUL.
打開你的 SOUL.md。逐行閱讀。問問自己：「代理程式在每一次呼叫時，真的需要這個嗎？」三個月前的專案特定脈絡？把它移到一個技能中。歷史筆記？把它們移到一個參考檔案中。你的系統提示
這是文章來源資料一再強調、最唾手可得的成果。

Anthropic 支援 Claude 模型的自動提示詞快取功能。因為 OpenClaw 在每次呼叫時都會傳送相同的系統提示詞（SOUL.md + AGENTS.md），所以它成了
一位[追蹤了 30 天成本](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/)的使用者回報：*「啟用提示詞快
對於 Anthropic 模型，近期的 OpenClaw 版本已預設啟用提示詞快取。至於其他供應商，請檢查您的模型是否支援此功能——Google 的 Gemini 模型也提供[情境快取](https://ai.google.dev/gemini-api/docs/pricing)，並享有大幅折扣。

---

## 策略 5：依任務分派模型（節省 70–90%）

這是效益最高的結構性變更。概念是：並非每個請求都需要動用您最昂貴的模型。
一個問「我收件匣有新東西嗎？」的心跳檢查並不需要 Opus。一個訊息分類（「這則訊息緊急嗎？」）並不需要 Sonnet。這些都是 Haiku 等級的任務。

以下是來自社群的真實成本比較：

| 配置 |
| 路由 | $35 | 相同使用者，相同任務 |

**操作方法 — 方案 A：手動設定**

將您的預設模型設定為較經濟實惠的選項，並只在您明確需要時才使用 Opus：

```json5
完成複雜任務後，請切換回來：

```
/model claude-haiku-4-5
```

**作法 — 選項 B：自動路由代理**

現已有數個開源路由器，能將每個請求分類並自動路由：

- [
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) — 15 維度本地評分，社群回報與始終使用 Opus 相比，可節省約 90% 的成本。

這兩者都位於 OpenClaw 和 API 端點之間。安裝後，將您的設定指向本地代理伺服器，路由便會自動進行。

**作
"anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

這並非按複雜度進行路由——它是一個針對
這段內容直接取自 [r/PromptEngineering 成本指南](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/):

> 「有位使用者原本每週在多代理人設定上花費數百美元，後來改用單一代理人搭配十幾種技能，每月開銷降至 90 美元。品質反而提升了，因為上下文不再因
每個代理程式實例都有額外開銷：它自己的系統提示、它自己的記憶體、它自己的上下文視窗。執行五個代理程式，意味著每次呼叫都要支付五倍的啟動成本。

OpenClaw 技能是 Markdown 檔案，能賦予您的代理程式新能力，而無需派生新的實例。相同的大腦、相同的記憶體、相同的上下文。一個寫作技能、一個研究技能、一個編碼技能 — 全都在一個代理程式會話中執行。

```
~/.openclaw/workspace/skills/
├── research/SKILL.md
├── writing/SKILL.md
```
├── coding/SKILL.md
└── calendar/SKILL.md
```

代理程式會根據您的要求選擇正確的技能。無需交接。不會遺失上下文。沒有重複的引導權杖。

**何時使用多代理程式：** 當您真正需要平行執行時——也就是多個任務同時運行，而非循序執行。對於其他所有情況，技能都更便宜、更有效。

---

## 策略 7：執行本地模型處理日常工作（零邊際成本）
在您自己的硬體上執行模型，意味著在初始設定完成後，每次推論都是免費的。

**適用於 OpenClaw 的配置：**

| 模型 | 硬體 | 速度 | 適用於 |
|-------|----------|-------|----------|
| Q
curl -fsSL https://ollama.com/install.sh | sh

# 拉取你的模型
ollama pull qwen3:32b

# OpenClaw 設定
{
  "models": {
    "providers": {
      "ollama": {
**混合式作法**（大多數注重成本的使用者會這麼做）：預設使用本機模型處理常規任務，僅在代理程式需要深度推理時，才使用雲端 API（Sonnet 或 Opus）。有一位 YouTube 創作者便記錄了，他如何使用
**使用向量記憶體取代原始上下文。** OpenClaw 的記憶體搜尋會透過嵌入搜尋提取相關記憶，而非將所有內容載入提示中。使用 Ollama 嵌入 (3.7+ 版)，這樣做不僅更聰明，而且免費：

```json5
{
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  }
}
```
**安裝 lossless-claw。**如我們在[上一篇文章](/blog/lossless-claw)中所述，lossless-claw 外掛程式透過增量摘要，將活躍的上下文維持在 30K–100K token 之間。您永遠不會達到上限而被迫進行緊急壓縮，也永遠不會遺失資訊而被迫重做工作。

---

## 2026 年模型價格指南

模型定價變化迅速。以下是截至 2026 年 3 月的情況：

| 模型 | 輸入（每 1 百萬 token） | 輸出（每 1 百萬 token） | 最適用於 | 來源 |
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | $0.07 | $0.40 | 預算級提取、簡單查詢 | Z.AI |
| **Gemini 2.5
| **Claude Haiku 4.5** | $1.00 | $5.00 | 心跳、分類、格式化 | Anthropic |
| **Claude Sonnet 4.6** | $3.00 | $15.00 | 結構化任務、程式碼審查 | Anthropic |
| **Claude Opus 4.6** | $5.00 | $25.00 | 複雜推理、架構設計 | [Anthropic](https://www.anthropic.com/claude/opus) |
| **Ollama (本機)** | $0 | $0 | 心跳、嵌入、例行任務 | 自行託管 |
道理很簡單：如果你代理人 80% 的呼叫都是例行公事，而你將它們路由到 Haiku（$1/$5）而非 Opus（$5/$25），那麼你在這些呼叫上的帳單就減少了 80%。再加上提示詞
// Sonnet 用於您的主要互動 — 足夠強大以應對實際工作
      model: "anthropic/claude-sonnet-4-6",

      // 子代理預設使用 Haiku
      subagents: {
        model: "anthropic/claude-haiku-4-5",
        runTimeoutSeconds: 120
      },

      // 心跳：本地模型，較長的間隔
      heartbeat: {
        intervalMinutes: 120,
        // 或在沒有本地模型時路由至 Haiku
      }
    }
  },

  // 本地的 Ollama 用於嵌入 (免費的記憶體搜尋)
  memory: {
provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // 使用 lossless-claw 以防止上下文爆增
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // Brave 搜尋，使用 LLM 上下文模式（較少的後續 token）
  tools: {
    web: {
      search: {
        brave: {
          mode: "llm-context"
        }
      }
    }
  }
}
```

**每月成本明細（預估，30 天）：**
| 元件 | 每日代幣 | 模型 | 每月成本 |
|-----------|-----------|-------|------------|
| 主要互動（約 2 小時活躍） | 約 8 萬（5 萬輸入 + 3 萬輸出） | Sonnet | 約 $18 |
| 子代理呼叫 | 約 3 萬 | Haiku | 約 $1.50 |
| 心跳（每日 12 次） | 約 3 萬 | 本地/Haiku | $0–$1 |
| 記憶嵌入 | — | 本地 (Ollama) | $0 |
| 網路搜尋後續處理 | 約 2 萬 | Sonnet | 約 $2 |
| 提示詞快取節省 | — | — | –$4 |
| **總計** | | | **約 $19–22** |
*計算：主要互動 = 50K 輸入 × $3/M × 30 = $4.50，加上 30K 輸出 × $15/M × 30 = $13.50 = 每月 $18。提示詞快取將重複的系統提示詞輸入減少了約 4
**1. 檢查您的帳單。** 登入您的 API 供應商儀表板。查看每日支出。找出費用高峰。

**2. 延長您的心跳間隔。** 在您的設定檔中加入 `heartbeat.intervalMinutes: 120`。立即節省開銷。

**3. 檢查您的 SOUL.md 大小。**

```bash
wc -c ~/.openclaw/workspace/SOUL.md
```

如果超過 30KB，請修剪它。將專案特定內容移至技能中。
**4. 設定子代理模型。**將 `agents.defaults.subagents.model` 新增至您的設定檔中。別讓子代理繼承您昂貴的主要模型。

**5. 安裝 lossless-claw。**`openclaw plugins install lossless-claw`。這
- **MemOS Cloud Plugin** 報告，在 LOCOMO 長對話基準測試中，透過將記憶體卸載至專用系統，達成了 [72% 的權杖縮減](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef)
- **QMD**（由 Shopify 共同創辦人 Tobi Lütke 開發）透過本地語意搜尋，提供了 60–97% 的權杖節省
- **自動路由代理伺服器**，例如 ibl.ai Router 和 ClawRouter，正在讓手動模型選擇變得過時
- 3.7 版中開放的 **Context Engine API** 意味著社群可以建構出全新的方法來提升上下文效率

趨勢很明顯：代理執行環境在每個層級上都越來越具備成本感知。上下文管理、記憶體搜尋、模型路由和工具
*想用有限的預算執行 OpenClaw 嗎？請在留言區分享您的每月成本與配置。我們正在為社群成本標竿收集資料——目標是找出各個代理能力層級的最低可能成本。*

*下一篇：[OpenClaw vs Nan
*資料來源：[r/PromptEngineering 成本指南](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [GitHub 討論 #12267](https://github.com/openclaw/openclaw/discussions/12267) · [MemOS 外掛分析](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [ibl.ai 路由器](https://github.com/iblai/iblai-openclaw-router) · [SaladCloud 成本指南](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [Apiyi token 分析](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*