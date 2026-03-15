---
title: "四種方式部署 OpenClaw：Mac mini、VPS、雲 Pod，或 60 秒搞定"
description: "OpenClaw 突破 207,000 GitHub Stars。從裸機到一鍵雲部署，完整評測四種方案的真實成本與維運難度。"
date: "2026-01-15"
author: "AgentPuter Lab"
readingTime: "12 min"
tags: ["OpenClaw", "部署", "TinyClaw", "VPS", "Mac mini"]
featured: false
---

## 先搞清楚：OpenClaw 到底是什麼（30 秒版
- **語音和畫布。** Voice Wake + Talk Mode（ElevenLabs 驅動）讓你免持對話。Live Canvas（A2UI）給它一個可視化工作臺。
- **本地優先。** 你的資料留在你的機器上。不拿你的
Mac mini M4 基礎款（$599）綽綽有餘：16GB 統一記憶體、256GB 儲存。待機功耗 5–10W，一年電費約 15 美元。靜音、常開、
- [x] 一個 Telegram 帳號（最簡單的入門管道）

### 分步安裝

**步驟 1：全域安裝 OpenClaw**

```bash
npm install -g openclaw@latest
```

也可以用 pnpm（`pnpm add -g
3. **選訊息管道。** Telegram 是最簡單的起步選項。嚮導會讓你去找 Telegram 的 @BotFather，用 `/newbot` 創建一個新的 bot，然後將 token 貼回來。
4. **安裝背景守護程序。** macOS 上會創建
搞定了。你的 bot 已經上線。發一句「你能做什麼？」看看它的回應。

> **疑難排解提示：** 如果 bot 沒有回應，先執行 `openclaw doctor`。常見問題：守護程序沒有啟動（重新執行 `openclaw onboard
3. **跑一個真實任務。** 別從「講個笑話」開始。試試：「幫我整理未讀郵件，按優先級排序」或「明天我有什麼日程，有沒有衝突？」

### 真實成本

| 項目 | 費用 |
|------
**適合誰：** 會 SSH。想要 root 權限。公司要求自建基礎設施。在意成本控制。

#### 選伺服器

| 服務商 | 最低配置 | 月費 |
|--------|---------|------|
| Hetzner | 2 v
ssh root@your-server-ip

# 安裝 Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安裝 OpenClaw
- 一條命令重啟：`docker compose restart`
- 內建日誌管理
- 沙箱模式：設定 `sandbox.mode: "non-main"` 讓群組/頻道會話跑在隔離的 Docker 容器裡

劣勢：
-
- `"funnel"`——公網 HTTPS，但需要密碼認證（`gateway.auth.mode: "password"`）

**備選：SSH 隧道**

```bash
ssh -L 18789:localhost:18789 user@
#### 自管 VPS 的痛點

我在自管 VPS 上跑了三個月 OpenClaw，以下是實話：

- 你得自己裝 Node.js、配 systemd、搞 Tailscale、處理 TLS。
- OAuth token 會過期。如果你在另一個時區睡
[AgentPuter](https://www.agentputer.com/) 不是通用 VPS。它是**專門為 AI Agent 設計的雲端執行時**——OpenClaw、ClawBot、MoltBot 和自訂 Agent 都能跑。可以理解為「AI 助手的 Heroku
agentputer create openclaw
# → 一鍵分配雲環境，選配置和資源

# 步驟 2：連接你的服務
agentputer connect
# → 授權 Google、Notion、Slack 等。憑證安全儲存在 Pod 內

# 步驟 3：
- **當前狀態：** Early Access。在 [agentputer.com](https://www.agentputer.com/) 申請 Invite Code，24 小時內發放。

#### AgentPuter vs. 自管 VPS

| | 自管 VPS | AgentPuter |
|--|---------|------------|
| 部署時間 | 15–30 分鐘 | ~2 分鐘 |
| 維運
**適合誰：** 不想學命令行。不想管伺服器。只想*用*AI 助手，不想*裝*。想現在就試。

### 為什麼需要這條路

路徑 A 需要 $599 和知道 Node.js 是什麼。
1. **選模型**——Claude Opus 4.6 / GPT-5.2 / Gemini 3
2. **選管道**——Telegram（Discord 和 WhatsApp 即將支援）
3. **Google 帳號登入** → 部署完成

沒有伺服器。沒有
| 部署時間 | 15–30 分鐘 | 15–30 分鐘 | ~2 分鐘 | < 1 分鐘 |
| 技術要求 | 會用終端 | SSH + 維運 | 基礎 CLI | 無（純 GUI） |
| 適合誰 | 極客 / 隱私 | 維運強 / 合規 | 開發者 / 多 Agent | 所有人 |

---

## 裝好之後：7 步讓 OpenClaw 從玩具變成員工

不管你走哪條路，安裝只是開始。以下
| 命令 | 功能 |
|------|------|
| `/status` | 查看當前模型、token 用量、會話資訊 |
| `/new` 或 `/reset` | 重置對話會話 |
| `/compact` | 壓縮上下文（省 token） |
- **瀏覽器**——OpenClaw 可以控制一個專用 Chrome 實例

### 5. 種下記憶種子

給它一些初始上下文，它會永遠記住：

> 「我每週一上午 10 點有團隊會議。我的老闆
**API 費用大概多少？**
輕度使用約 $15/月，中度 $30–50/月，重度（Viticci 級別）$100–300/月。也可以用 Claude Pro 訂閱（
支援，透過 WSL2（Windows Subsystem for Linux）——官方支援且強烈推薦。或者用 TinyClaw 雲端部署，瀏覽器直接用，零本機設定。

**跟 ChatGPT Plus 比有什麼區別？**
ChatGPT 是你去找它聊天；Open
- **Mac mini**——極客之選，完全掌控、語音喚醒、iMessage。
- **自管 VPS**——開發者之選，root 權限、最大靈活性。
- **[AgentPuter](https://www.agentputer.com/)
這是 Agent 基礎設施系列的第九篇。我們拆解過[為什麼 Agent 需要自己的電腦](/blog/agent-needs-its-own-computer/)、OpenClaw 的[架構](/blog/dissecting-openclaw-architecture/)、[技能生態](/blog/
- [OpenClaw GitHub 倉庫](https://github.com/openclaw/openclaw)（207K Stars, v2026.2.17）
- [AgentPuter —— AI Agent 的 7×24 雲運行時](https://www.agentputer.com/)
- [TinyClaw —— 一鍵部署 OpenClaw](https://tinyclaw.dev)
- [OpenClaw 官方文檔](https://docs.openclaw.ai)
- CVE-2026-25253 —— OpenClaw Gateway Token 竊取漏洞（詳見我們的安全分析文章）