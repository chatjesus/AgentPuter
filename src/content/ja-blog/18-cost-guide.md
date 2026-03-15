---
title: "OpenClawを月額30ドル以下で運用する方法（完全コストガイド）"
description: "あるユーザーは2週間で254ドルを費やしました。Federico Viticciは1ヶ月で3,600ドルに達しました。夜間のハートビートで朝起きたら141ドルの請求に驚いた人もいます。OpenClawがトークンを消費する6つの要因、バージョン3.7と3.8での変更点、そして実際のユーザーが重要な機能を一切犠牲にすることなく、請求額を数百ドルから30ドル未満に削減した方法を解説します。"
date: "2026-03-09"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "コスト最適化", "モデルルーティング", "Ollama", "予算", "Heartbeat", "lossless-claw"]
featured: true
---

# 月額30ドル未満でOpenClawを運用する方法（完全コストガイド）

AgentPuter · 2026年3月 · 約20分 · #OpenClaw #コスト最適化 #モデルルーティング #Ollama #予算

> **ソース：**
> - [OpenClawでの無駄遣いをやめる方法](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) — r/PromptEngineering
> - [現時点で最も手頃な価格のLLM (2026年2月)](https://github.com/openclaw/openclaw/discussions/12267) — GitHubディスカッション #12267
> - [MemOSプラグインがOpenClawのトークンコストを70%削減する方法](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) — Medium, 2026年3月4日
> - [ibl.ai OpenClaw Router](https://github.com/iblai/iblai-openclaw-router) — GitHub
> - [OpenClaw LLMコスト削減：SaladCloudガイド](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — SaladCloudブログ、2026年2月9日
> - [なぜOpenClawはこれほどトークンを消費するのか？6つの理由を分析](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) — Apiyiブログ、2026年2月
> - [月額6ドルで19のOpenClawエージェントを運用する方法](https://www.youtube.com/watch?v=-MtzLiQ9w1c) — YouTube、2026年3月1日
> - [OpenClaw 2026.3.7 リリースノート](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [OpenClaw 2026.
「なぜ私のエージェントはこんなに費用がかかるのですか？」

あるユーザーは2週間で254ドルを費やしました。別のユーザーは1ヶ月で800ドルに達しました。テックブロガーのFederico Viticci氏は、集中的なマルチチャンネル
これは限界まで使いこなすパワーユーザーの話ではありません。ごく普通のセットアップで、ごく普通の使い方をしているのです。

OpenClawは無料です。しかし、それが呼び出すモデルは無料ではありません。そして、OpenClawは24時間365日稼働するように設計されているため
この記事は、OpenClawに本来同梱されているべきだったガイドです。どこで費用が発生しているのか、最新リリース（3.7および3.8）での改善点、そして実際のユーザーが重要な機能を諦めることなく、月額数百ドルから30ドル未満にまで請求額を削減
OpenClawはAPIコールを行うたびに、あなたの`SOUL.md`、`AGENTS.md`、その他のブートストラップファイルをプロンプトに読み込みます。これらは一度だけ読み込まれるのではなく、**リクエストごと**に送信されます。もしあなたのSOUL.md
r/LocalLLaMAのあるユーザーは、毎回読み込まれるにもかかわらずほとんど参照されていなかった3ヶ月前のプロジェクト背景情報を削除することで、[ブートストラップを85KBから27KBに削減しました](https://www.reddit.com/r/LocalLLaMA/
セッション履歴は、やり取りを重ねるごとに増えていきます。数時間活発に使用した後には、数万トークンもの履歴を抱えることになります。そのすべてが、新しいリクエストのたびに付随して送信されるのです。これがヘビーユーザーにとって最大のコスト要因であり、[lossless-claw](/blog/lossless
OpenClawのハートビートは、デフォルトで30分ごとに実行されます。各チェックは、すべてのシステムコンテキストを含む完全なAPIコールです。Opusでは、これはかなりの費用になります。1日あたり48回のハートビートが、それぞれ完全なシステムプロンプトを伴って実行されるのです。

あるユーザーは、ハートビートだけで1日に50ドルを費やしたと報告しています。別のユーザーは[一晩で570万トークンを消費](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/)しましたが、そのほとんどは、実行中であることを忘れていたハートビートとスケジュールされたタスクによるものでした。
### 4. サブエージェントの生成

メインエージェントがサブエージェントにタスクを委任すると、それぞれが独自のコンテキスト、メモリ、モデル呼び出しを持って起動します。マルチエージェント設定（執筆用、調査用、コーディング用など）
ブラウザのスクレイピング、ファイルの読み込み、検索結果など、ツールの出力はトランスクリプトに保存され、後続のメッセージと共に再送信されます。一度のウェブスクレイピングだけで、数千トークンが履歴に投入され、セッションが終了するまで
## まだ始めていない方へ：無料で始める方法

最適化の話に入る前に、まだOpenClawをセットアップしていない方へのお知らせです。

試すのにお金を1ドルも費やす必要はありません。**Gemini 2.5 Flash-Lite**には、豊富な
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // 無料利用枠
    }
  }
}
```

チャンネルを1つ（TelegramまたはWebChatのみ）接続し、SOUL.mdを短く保つだけで、ゼロコストで動作するパーソナルエージェントが完成します。そこからスケールアップが可能です。

---

## 3.7と3.8での変更点（コスト関連機能）

直近の2つのリリースには、コストに直接影響を与えるいくつかの機能が含まれています。重要な点は以下の通りです：

### 3.7（3月8日）より
**コンテキストエンジン・プラグインAPI + lossless-claw** [lossless-clawプラグイン](/blog/lossless-claw)は、会話がどれだけ長くなっても、アクティブなコンテキストを30〜100Kトークンの範囲に維持します。これがないと
**MiniMax-M2.5-highspeedを主要モデルに。** もはや応急処置的な実装ではなく、モデルカタログ、オンボーディング、ルーティングに正式に組み込まれました。これは、定型的なエージェント作業の80%を処理できる、高速
**`openclaw backup create` と `openclaw backup verify`。** これは直接的なコスト削減機能ではありませんが、もし設定を失って再構築しなければならなくなった場合、エージェントとのコンテキストを再確立するために時間とトークンを無駄にすることになります。

**B
**トークモードの無音タイムアウト。** `talk.silenceTimeoutMs` を使用すると、音声入力が自動送信されるタイミングを制御できます。これにより、文章の途中で送信してしまい、APIのラウンドトリップコールを無駄にするような早すぎる送信を防ぎます。

**GPT-5.4コンテキストウィンドウの修正。** `openai-codex/gpt-5.4`の1,050,000トークンのコンテキストウィンドウと128Kの最大出力トークンが正しく適用されるようになりました。Codexのサブスクリプションをご利用の場合、これによりコンテキストオーバーフローによる圧縮が少なくなります。

---

## 戦略1：請求書を確認する（5分、コストゼロ）
請求額を削減したユーザーは皆、口を揃えてこう言います。解決策は特定のテクニックではなく、お金がどこに使われているかを把握することでした。
今すぐAPIプロバイダーのダッシュボードにログインしてください。1日あたりの支出を確認し、急増している箇所を見つけましょう。[r/openclawのあるユーザーが30日間にわたってOpenClawエージェントが費やした全費用を追跡したところ](
OpenClaw内で`/status`を使用すると、現在のセッションのモデルとトークン数が表示されます。`/usage full`を使用すると、レスポンスごとのコスト内訳を取得できます。計測できないものは最適化できません。

---

## 戦略2：ハートビートの修正（1つの設定変更で月額$30〜$50を節約）

ハートビートは、予期せぬコストが発生する最も一般的な原因です。デフォルト設定では、30分ごとにプライマリモデルを使用して完全なAPIコールが行われます。これは1日あたり48回のコールに相当し、それぞれが完全なシステムプロンプトを伴います。

**頻度を減らす：**

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        intervalMinutes: 120
      }
    }
  }
}
```

これにより、1日あたりの呼び出し回数が48回から12回に減少し、応答性への影響
システムプロンプト内のすべてのトークンは、APIコールごとに課金されます。これは、ほとんどの人が見落としがちな、積み重なるコストです。

コミュニティからの実例です：

| 指標 | 変更前 | 変更後 |
|---|---|---|
|
SOUL.mdを開き、一行ずつ読み込みます。「エージェントは、毎回この情報を本当に必要としているか？」と自問してください。3ヶ月前のプロジェクト固有のコンテキストは、スキルに移しましょう。過去のメモは、参照ファイルに移しましょう。あなたのシステムプロンプトは、
これは、記事のソースデータが繰り返し強調している、最も簡単に得られるメリットです。

Anthropicは、Claudeモデル向けに自動プロンプトキャッシュをサポートしています。OpenClawはすべての呼び出しで同じシステムプロンプト（SOUL.md + AGENTS.md）を送信するため、キャッシュに最適な候補となります。最初の呼び出しでは正規料金が発生しますが、キャッシュの有効期間内における後続の呼び出しでは、システムプロンプトのトークンを90%割引で利用できます。
[30日間にわたるコストを追跡した](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/)あるユーザーは、次のように報告
Anthropicモデルの場合、最近のOpenClawバージョンではプロンプトキャッシュがデフォルトで有効化されています。他のプロバイダーについては、お使いのモデルがそれをサポートしているか確認してください。GoogleのGeminiモデルも[コンテキストキャッシュ](https://ai.google.dev/gemini
「受信トレイに新着があるか」を尋ねるハートビートチェックに、Opusは不要です。「これは緊急か？」といったメッセージの分類に、Sonnetは不要です。これらはHaikuレベルのタスクです。

以下は、コミュニティから寄せられた実際のコスト比較です。

| 構成 | 月額コスト | 備考 |
|-------|-------------|-------|
| すべてOpusを使用 | $347 | デフォルトの単一モデル構成 |
| ルーティングあり (Haiku/Sonnet/Opus)
| ルーティング | $35 | 同じユーザー、同じタスク |

**実行方法 — オプションA: 手動設定**

デフォルトモデルを安価なものに設定し、明示的に必要な場合にのみOpusを使用します:

```json5
{
  agents:
複雑なタスクが完了したら、元に戻します：

```
/model claude-haiku-4-5
```

**実行方法 — オプションB：自動ルーティングプロキシ**

現在、各リクエストを分類し、自動的にルーティングするオープンソース
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) — 15次元のローカルスコアリング、コミュニティの報告によると、常にOpusを使用する場合と比較して約90%の節約。

どちらもOpenClawとAPIエンドポイントの間に位置します。インストールし、設定をローカルプロキシに向けるだけで、ルーティングが自動的に行われます。

**実行方法 — オプションC：モデルのフォールバックシステムを使用する**

OpenClawはネイティブにフォールバックチェーンをサポートしています：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: [
```
"anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

これは複雑さによるルーティングではありません。レート制限やサービス停止に対するセーフティネットです。しかし、チャンネルごとまたはエージェントごとのモデル割り当てと組み合わせることで、さまざまなワークロードを異なる価格帯にルーティングできます。

---

## 戦略6：1つのエージェント、多くのスキル（誰も語らない最大の節約術）
これは[r/PromptEngineeringコストガイド](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/)からの直接の引用です：

> 「あるユーザーは、マルチエージェント
すべてのエージェントインスタンスには、独自のシステムプロンプト、メモリ、コンテキストウィンドウといったオーバーヘッドがあります。5つのエージェントを実行するということは、呼び出しごとに5倍のブートストラップコストを支払うことを意味します。

OpenClawスキルは、新しいインスタンスを生成
├── coding/SKILL.md
└── calendar/SKILL.md
```

エージェントは、ユーザーの要求に応じて適切なスキルを選択します。ハンドオフなし。コンテキストの損失なし。ブートストラップトークンの重複なし。

**マルチエージェントを使用する場合：** 真に並列実行が必要な場合 — つまり、複数のタスクを逐次的にではなく、同時に実行する場合です。それ以外のすべてのケースでは、スキルの方が低コストで優れています。

---

## 戦略7：定型的な作業にはローカルモデルを実行する（限界費用ゼロ）
自分のハードウェアでモデルを実行すれば、初期設定後の推論はすべて無料になります。

**OpenClawで動作する構成：**

| モデル | ハードウェア | 速度 | 用途 |
|-------|----------|-------|----------|
| Qwen 3 32B | RTX 4090 | 40+ tok/s | 一般的なエージェントの作業 |
| Qwen 3 14B | RTX 3060 / Mac mini M2 | 25+ tok/s | ハートビート、分類 |
| Llama 3.3 70B | 2x RTX 4090 | 20+ tok/s | コード、複雑な推論 |

**Ollamaでのセットアップ：**

```bash
# Ollamaをインストール
```
curl -fsSL https://ollama.com/install.sh | sh

# モデルをプルする
ollama pull qwen3:32b

# OpenClawの設定
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434"
      }
    }
  }
}
```

OpenClaw 3.7以降は、メモリ検索のためにOllamaの埋め込みをネイティブでサポートしているため、長期記憶もローカルに保持されます。
**ハイブリッドアプローチ**（コストを意識する多くのユーザーが採用する方法）：日常的なタスクにはローカルモデルをデフォルトで使用し、エージェントが深い推論を必要とする場合にのみクラウドAPI（SonnetまたはOpus）を使用します。あるYouTubeクリエイターは
**生のコンテキストではなく、ベクトルメモリを使用。**OpenClawのメモリ検索は、すべてをプロンプトに読み込むのではなく、埋め込み検索によって関連するメモリを取得します。Ollamaの埋め込み（3.7以降）を使用すると、これはより賢く、しかも無料になります：

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
**lossless-clawのインストール。**[以前の投稿](/blog/lossless-claw)で説明したように、lossless-clawプラグインは段階的な要約を通じて、アクティブなコンテキストを30K～100Kトークンに維持します。緊急の圧縮を強制する上限に達することはなく、作業のやり直しを強いるような情報を失うこともありません。

---

## 2026年モデル価格ガイド

モデルの価格は急速に変化します。2026年3月時点の状況は以下の通りです。

|
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | $0.07 | $0.40 | 予算重視の抽出、単純なクエリ | Z.AI |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | 軽量タスク、1Mコンテキストウィンドウ | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| **MiniMax M2.5 Standard** | $0.15 | $1.20 | 一般的なエージェント作業、197Kコンテキスト | [MiniMax](https://www.minimax.io/news/minimax-m25) |
| **Claude Haiku 4.5** | $1.00 | $5.00 | ハートビート、分類、フォーマット | Anthropic |
| **Claude Sonnet 4.6** | $3.00 | $15.00 | 構造化タスク、コードレビュー | Anthropic |
| **Claude Opus 4.6** | $5.00 | $25.00 | 複雑な推論、アーキテクチャ | [Anthropic](https://www.anthropic.com/claude/opus) |
| **Ollama (ローカル)** | $0 | $0 | ハートビート、エンベディング、定型タスク | セルフホスト |
計算は単純です。エージェントの呼び出しの80%が定型的なものであれば、それらをOpus（$5/$25）の代わりにHaiku（$1/$5）にルーティングすることで、これらの呼び出しにかかる費用を80%削減できます。
// メインの対話にはSonnetを使用 — 実務に十分な性能
      model: "anthropic/claude-sonnet-4-6",

      // サブエージェントはデフォルトでHaikuを使用
      subagents: {
        model: "anthropic/claude-haiku-4-5",
        runTimeoutSeconds: 120
      },

      // ハートビート：ローカルモデル、長めの間隔
      heartbeat: {
        intervalMinutes: 120,
        // または、ローカルモデルがない場合はHaikuにルーティング
      }
    }
  },

  // 埋め込み用のローカルOllama（自由なメモリ検索）
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // コンテキストの肥大化を防ぐためのlossless-claw
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // LLMコンテキストモードを使用したBrave検索（フォローアップトークンを削減）
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

**月額費用の内訳（推定、30日間）：**
| コンポーネント | トークン/日 | モデル | コスト/月 |
|-----------|-----------|-------|------------|
| メインの対話（約2時間アクティブ） | 約8万（入力5万 + 出力3万） | Sonnet | 約
*計算: 主なインタラクション = 5万トークン入力 × 3ドル/100万トークン × 30日 = 4.50ドル、プラス 3万トークン出力 × 15ドル/100万トークン ×
**1. 請求額を確認してください。** APIプロバイダーのダッシュボードにログインし、日ごとの支出を確認して、急増している箇所を見つけます。

**2. ハートビートの間隔を延長してください。** 設定に `heartbeat.intervalMinutes:
**4. サブエージェントのモデルを設定。** 設定に `agents.defaults.subagents.model` を追加します。サブエージェントに高価なプライマリーモデルを継承させないでください。

**5. lossless-clawをインストール。** `openclaw plugins install lossless-claw` を実行します。これにより、気づかないうちにトークン消費量を倍増させる「コンテキストの肥大化 → 圧縮 → 再作業」のサイクルを防ぎます。

---

## 今後の予定

OpenClawエコシステムでは、多方面からコスト問題への取り組みが収
- **MemOS Cloud Plugin**：専用システムにメモリをオフロードすることで、LOCOMO長文会話ベンチマークで[72%のトークン削減](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs
- 3.7で公開された**Context Engine API**により、コミュニティはコンテキスト効率化のための全く新しいアプローチを構築できるようになりました。

トレンドは明確です。エージェントランタイムは、あらゆるレイヤーでコストを意識するようになっています。コンテキスト管理
*低予算でOpenClawを運用していますか？ぜひコメント欄で、月々のコストと構成を教えてください。現在、コミュニティのコストベンチマークを作成するためにデータを収集中です。目標は、エージェントの能力の各ティアにおいて、実現可能な最低コスト
*ソース：[r/PromptEngineering コストガイド](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [GitHub ディスカッション #12267](https://github.com/openclaw/openclaw/discussions/12267) · [MemOS プラグイン分析](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [ibl.ai ルーター](https://github.com/iblai/iblai-openclaw-router) · [SaladCloud コストガイド](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [Apiyi トークン分析](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*