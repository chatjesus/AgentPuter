---
title: "OpenClaw를 월 $30 미만으로 실행하는 방법 (완벽한 비용 가이드)"
description: "한 사용자는 2주 만에 254달러를, 페데리코 비티치는 한 달 만에 3,
tags: ["OpenClaw", "비용 최적화", "모델 라우팅", "Ollama", "예산", "하트비트", "lossless-claw"]
featured: true
---

# 월 30달러 미만으로 OpenClaw를 실행하는 방법 (완벽 비용 가이드)

AgentPuter · 2026년 3월 · ~20분 · #OpenClaw #비용최적화 #모델라우팅 #Ollama #예산

> **출처:**
> - [OpenClaw에 돈 낭비 그만하는 법](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) — r/PromptEngineering
> - [현재 최고의 가성비 LLM (2026년 2월)](https://github.com/openclaw/openclaw/discussions/12267) — GitHub 토론 #12267
> - [MemOS 플러그인으로 OpenClaw 토큰 비용을 70% 절감하는 방법](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) — Medium, 2026년 3월 4일
> - [ibl.ai OpenClaw Router](https://github.com/iblai/iblai-openclaw-router) — GitHub
> - [OpenClaw LLM 비용 절감하기: SaladCloud 가이드](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — SaladCloud 블로그, 2026년 2월 9일
> - [OpenClaw는 왜 그렇게 토큰 집약적인가? 6가지 이유 분석](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) — Apiyi 블로그, 2026년 2월
> - [월 6달러로 19개의 OpenClaw 에이전트를 실행하는 방법](https://www.youtube.com/watch?v=-MtzLiQ9w1c) — YouTube, 2026년 3월 1일
> - [OpenClaw 2026.3.7 릴리스 노트](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [OpenClaw 202
*"내 에이전트는 왜 이렇게 비용이 많이 드나요?"*

한 사용자는 2주 만에 254달러를 썼고, 다른 사용자는 한 달 만에 800달러를 기록했습니다. 테크 블로거 페데
이들은 시스템의 한계를 시험하는 고급 사용자가 아닙니다. 일반적인 설정에서 평범하게 사용하는 경우입니다.

OpenClaw는 무료이지만, OpenClaw가 호출하는 모델은 유료입니다. 그리고 OpenClaw는 체크인, 브라우징, 사고,
이 글은 OpenClaw와 함께 제공되었어야 할 가이드입니다. 비용이 정확히 어디에 쓰이는지, 최신 릴리스(3.7 및 3.8)에서 어떤 부분이 개선되었는지, 그리고 실제 사용자들이 중요한 기능을 포기하지 않으면서 월 청
OpenClaw는 API를 호출할 때마다 `SOUL.md`, `AGENTS.md` 및 기타 부트스트랩 파일들을 프롬프트에 로드합니다. 이 파일들은 한 번만 로드되는 것이 아니라 **모든 요청**과 함께 전송됩니다. 만약
r/LocalLLaMA의 한 사용자는 매번 로드되었지만 거의 참조되지 않았던 3개월 된 프로젝트 배경 정보를 제거함으로써 [부트스트랩을 85KB에서 27KB로 줄였습니다](https://www.reddit.com/r/LocalLLa
대화를 주고받을 때마다 세션 기록은 늘어납니다. 몇 시간 동안 활발하게 사용하면, 기록에 수만 개의 토큰을 담게 됩니다. 이 모든 기록이 새로운 요청마다 함께 전송됩니다. 이것이 바로 헤비 유저에게 가장 큰 비용 발생 요인이며 — [lossless-claw](/blog/lossless-claw)가 중요한 이유입니다 (자세한 내용은 아래에서 설명합니다).

### 3. 하트비트 (소리 없는 암살자)
OpenClaw의 하트비트는 기본적으로 30분마다 실행됩니다. 각 확인마다 모든 시스템 컨텍스트를 포함하여 전체 API를 호출합니다. Opus의 경우, 이는 상당한 비용입니다 — 하루 48번의 하트비트가 각각 전체 시스템 프롬
### 4. 하위 에이전트 생성

메인 에이전트가 하위 에이전트에게 작업을 위임하면, 각 하위 에이전트는 자체적인 컨텍스트, 메모리, 모델 호출을 가지고 시작됩니다. 다중 에이전트 설정
브라우저 스크랩, 파일 읽기, 검색 결과와 같은 도구 출력은 대화 기록에 저장되어 후속 메시지와 함께 다시 전송됩니다. 단 한 번의 웹 스크랩만으로도 세션이 끝날 때까지 유지되는 수천 개의 토큰이 기록에 쏟아져 들어올 수 있습니다.

### 6. 모델 선택

라우팅이 없으면 "새로운 거 없어?"라고 확인하는 하트비트(heartbeat)를 포함한 모든 단일 요청이 기본 모델로 전송됩니다. 만약 그 모델이 백만 토큰당 5달러/25달러인 Opus라면, 1달러/5달러인 Haiku가 처리할 수 있는 작업에 대해 프리미엄 요금을 지불하는 셈입니다.
## 아직 시작하지 않으셨다면: 무료로 시작하는 방법

최적화에 대해 알아보기 전에, 아직 OpenClaw를 설정하지 않으신 분들을 위한 안내입니다.

사용해보는 데 한 푼도 들지 않습니다. **Gemini 2.5 Flash-Lite**는 넉넉한 일일 할당량을 제공하는 [무료 등급](https://ai.google.dev/gemini-api/docs/pricing)이 있어, 가벼운 개인 용도로 기본 에이전트를 실행하기에 충분합니다. 그 다음 단계는 백만 토큰당 $0.15/$1.20인 MiniMax M2.5 Standard로, 일반적인 에
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // 무료 등급
    }
  }
}
```

하나의 채널(Telegram이나 WebChat만
**컨텍스트 엔진 플러그인 API + lossless-claw.** [lossless-claw 플러그인](/blog/lossless-claw)은 대화가 아무리 길어져도 활성 컨텍스트를 30~100K 토큰 범위로 유지합니다. 이 플러그인이 없으면 세션이 오버플로되어 정보가 손실되는 압축이 강제되거나, 모든 것을 잃게 되는 수동 재설정을 해야 합니다. 어느 쪽이든 결국 작업을 반복하게 되며, 이는 더 많은 토큰 사용을 의미합니다. lossless-claw의 저자는 일주일 동안
**MiniMax-M2.5-highspeed를 정식 모델로 지원.** 이제 임시방편이 아닌, 모델 카탈로그, 온보딩, 라우팅에 정식으로 통합되었습니다. 이 모델은 빠르고 저렴하며, 일상적인 에이전
**`openclaw backup create`**와 **`openclaw backup verify`**. 직접적인 비용 관련 기능은 아니지만, 만약 설정을 잃어버려 다시 구축해야 했던 경험이 있다면, 이는 에이전트와의 컨텍스트를 다시 설정하는 데 시간과 토큰을 낭비하는 것입니다.

**Brave 웹 검색 LLM-컨텍스트 모드.** `tools.web.search
**대화 모드 무음 시간 초과.** `talk.silenceTimeoutMs`를 통해 음성 입력이 자동으로 전송되는 시점을 제어할 수 있습니다. 문장이 채 완성되기도 전에 입력이 전송되어 왕복 API 호출을 낭비하는 것을 방지합니다.

**GPT-5.4 컨텍스트 창 수정.** `openai-codex/gpt-5.4`에 대한 1
요금을 줄인 모든 사용자는 똑같은 말을 합니다. 해결책은 특정 기술이 아니라, 돈이 어디에 쓰이는지를 파악하는 것이었다고요.
지금 바로 API 제공업체 대시보드에 로그인하세요. 일일 지출액을 살펴보세요. 지출이 급증한 부분을 찾아보세요. [r/openclaw의 한 사용자](https://www.reddit.com/r/LocalLLM/comments/1rl30k1/i_tracked_every_dollar_my_openclaw_agents_spent/)는 4개의 에이전트에 걸쳐 30일 동안 지출된 모든 비용을 추적한 결과, 월 18,000건의 API 호출 중 70%가 FAQ 답변, 서식 지정, 한 줄 요약과 같이 주 모델을 전혀 사용할 필요가 없는 "아주 간단한" 작업이었다는 사실을 발견했습니다.
OpenClaw 내에서 `/status`를 사용하여 현재 세션의 모델과 토큰 수를 확인하세요. `/usage full`을 사용하여 응답별 비용 내역을 확인하세요. 측정할 수 없는 것은 최적화할 수 없습니다.

---

## 전략 2: 하트비트 수정하기 (설정 변경 한 번으로 월 $30–50 절약)

하트비트는 예상치 못한 비용의 가장 흔한 원인입니다. 기본 설정은 30분마다 주 모델을 사용하여 전체 API를 호출하는 것입니다. 이는 하루에 48번의 호출이며, 각 호출은 전체 시스템 프롬프트를 포함합니다.

**빈도 줄이기:**

```json5
{
  agents: {
```
    defaults: {
      heartbeat: {
        intervalMinutes: 120
      }
    }
  }
}
```

이렇게 하면 응답성에 미치는 영향은 최소화하면서 하루 호출 횟수를 48회에서 1
시스템 프롬프트의 모든 토큰은 매 호출마다 비용이 청구됩니다. 이것이 바로 대부분의 사람들이 놓치는 곱셈적 비용입니다.

커뮤니티의 실제 사례입니다:

| 측정 항목 | 변경 전 | 변경 후 |
|---|---|---|
| SOUL.md 크기 | 85KB (21,400 토큰) | 27KB (6,472 토큰) |
| 감소율 | — | 69.8% |
| 월간 영향 (24/7 에이전트) | 부트스트랩 오버헤드만으로 약 $45 | 약 $14 |
SOUL.md 파일을 여세요. 모든 줄을 읽어보세요. 그리고 "에이전트가 매 호출마다 이 정보가 정말로 필요한가?"라고 자문해 보세요. 3개월 전의 프로젝트 관련 문맥 정보인가요? 스킬로 옮기세요. 과거 기록인가요? 참조 파일로 옮기세요. 시스템 프롬프트는 간결하고 시대를 초월해야 합니다.

또한, 관련 없는 작업으로 전환할 때는 `/new`를 사용하세요. 프로젝트 A에 대한 50,000 토큰 분량의 대화를 프로젝트 B로 가져가지 마세요.

---

## 전략 4: 프롬프트 캐싱 활성화 (한 줄로 입력 비용 40% 절약)
이것은 기사의 소스 데이터가 반복적으로 강조하는 가장 쉽게 얻을 수 있는 이점입니다.

Anthropic은 Claude 모델에 대한 자동 프롬프트 캐싱을 지원합니다. OpenClaw는 모든 호출 시 동일한 시스템 프롬프트(SOUL.md + AGENTS.md)를 보내기 때문에 완벽한 캐싱 대상입니다. 첫 번째 호출은 전체 비용을 지불하지만, 캐시 기간 내의 후속 호출은 시스템 프롬프트 토큰을 90% 할인된 가격으로 이용할 수 있습니다.
[30일 동안 비용을 추적한](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/) 한 사용자는 다음과 같이 보고했습니다: *"프
Anthropic 모델의 경우, 최신 OpenClaw 버전에서는 프롬프트 캐싱이 기본적으로 활성화되어 있습니다. 다른 제공업체의 경우, 사용하는 모델이 이를 지원하는지 확인하세요 — Google의 Gemini 모델도 상당한 할인된 가격으로 [컨텍스트 캐싱
"받은 편지함에 새로운 것이 있나요?"라고 묻는 주기적인 확인 작업에는 Opus가 필요하지 않습니다. "이 메시지는 긴급한가요?"와 같은 메시지 분류 작업에는 Sonnet이 필요하지 않습니다. 이러한 작업들은 Haiku 수준으로도 충분합니다.

커뮤니티에서 제공한 실제 비용 비교는 다음과 같습니다:

| 구성 | 월간 비용 | 비고 |
|-------|-------------|-------|
| 모든 작업을 Opus로 처리 | $347 | 기본 단일 모델 구성 |
| 라우팅 (Haiku/Sonnet/Opus) | $68 | 동일한 워크로드, 동일한 품질 |
| 모든 작업을 Opus로 처리 | $150 | 더 가벼운 워크로드 |
| 라우팅됨 | $35 | 동일한 사용자, 동일한 작업 |

**방법 — 옵션 A: 수동 설정**

기본 모델을 저렴한 것으로 설정하고 Opus는 명시적으로 필요한 곳에서만 사용하세요:

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-haiku-4-5",  // 모든 것에 대한 기본값
      subagents: {
        model: "anthropic/claude-haiku-4-5", // 하위 에이전트도 마찬가지
      }
    }
  }
}
```

그런 다음 추론이 필요할 때 더 강력한 모델로 전환하세요:

```
/model claude-opus-4-6
```
복잡한 작업을 마치면 다시 전환하세요:

```
/model claude-haiku-4-5
```

**실행 방법 — 옵션 B: 자동 라우팅 프록시**

이제 각 요청을 분류하고 자동으로 라우팅하는 여러 오픈소스 라
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) — 15차원 로컬 스코어링, 커뮤니티 보고에 따르면 항상 Opus를 사용하는 것에 비해 약 90% 비용 절감.

둘 다 Open
"anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

이것은 복잡성에 따른 라우팅이 아니라, 사용량 제한과 서비스 중단에 대비한 안전망입니다. 하지만 채널별 또는 에이전트별 모델 할당과 결합하면, 다양한 워크로드를 서로 다른 가격대로 라우팅할 수 있습니다.

---

## 전략 6: 하나의 에이전트, 다양한 기술 (아무도 말하지 않는 가장 큰 비용 절약 방법)
이는 [r/PromptEngineering 비용 가이드](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/)에서 직접 가져온 내용입니다:

> *"한 사용자는 다중 에이전트 설정에 매주 수백 달러를 지출하던 것에서, 단일 에이전트와 12개의 스킬로 월 90달러를 지출하게 되었습니다. 핸드오프 과정에서 컨텍스트가 손실되는 일이 없어졌기 때문에 품질은 향상되었습니다."*
모든 에이전트 인스턴스에는 자체 시스템 프롬프트, 자체 메모리, 자체 컨텍스트 창과 같은 오버헤드가 있습니다. 5개의 에이전트를 실행하면 호출할 때마다 5배의 부트스트랩 비용이 발생합니다.

Open
├── coding/SKILL.md
└── calendar/SKILL.md
```

에이전트는 사용자의 요청에 따라 적절한 스킬을 선택합니다. 핸드오프 없음. 컨텍스트 손실 없음. 중복된 부트스트랩 토큰 없음.

**멀티 에이전트를 사용해야 할 때:** 순차적이 아닌, 여러 작업을 동시에 실행하는 병렬 실행이 정말로 필요할 때입니다. 그 외 모든 경우에는 스킬을 사용하는 것이 더 저렴하고 좋습니다.

---

## 전략 7: 일상적인 작업을 위해 로컬 모델 실행 (한계 비용 제로)
자체 하드웨어에서 모델을 실행하면, 초기 설정만 마치면 모든 추론이 무료입니다.

**OpenClaw에 적합한 구성:**

| 모델 | 하드웨어 | 속도 | 용도 |
|-------|----------|-------|----------|
| Qwen 3 32B | RTX 4090 | 40+ tok/s | 일반적인 에이전트 작업 |
| Qwen 3 14B | RTX 3
curl -fsSL https://ollama.com/install.sh | sh

# 모델 가져오기
ollama pull qwen3:32b

# OpenClaw 설정
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

OpenClaw 3.7+는 메모리 검색을 위해 Ollama 임베딩을 기본적으로 지원하므로, 사용자의 장기 기억 또한 로컬에 유지됩니다.
**하이브리드 접근 방식** (비용 효율을 중시하는 대부분의 사용자가 사용하는 방식): 일상적인 작업에는 로컬 모델을 기본으로 사용하고, 에이전트가 깊은 추론을 필요로 할 때만 클라우드 API(Sonnet 또는 Opus
**원시 컨텍스트 대신 벡터 메모리를 사용하세요.** OpenClaw의 메모리 검색은 모든 것을 프롬프트에 로드하는 대신 임베딩 검색을 통해 관련 메모리를 가져옵니다. Ollama 임베딩(3.7+ 버전)을 사용하면 이 방식은 더 스마트하며 무료입니다:

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
**lossless-claw 설치.** [이전 게시물](/blog/lossless-claw)에서 다룬 바와 같이, lossless-claw 플러그인은 점진적 요약을 통해 활성 컨텍스트를 30K–100K 토큰 사이로 유지합니다. 긴급 압축을 강제하는 상한선에 도달하는 일이 없으며, 작업을 다시 해야 하는 정보 손실도 발생하지 않습니다.

---

## 2026년 모델 가격 가이드

모델 가격은 빠르게 변합니다. 2026년 3월 기준 현황은 다음과 같습니다:

| 모델 | 입력 (100만 토큰당) | 출력 (100만 토큰당) | 최적 용도 | 제공처 |
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | $0.07 | $0.40 | 저비용 추출, 간단한 쿼리 | Z.AI |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | 가벼운 작업, 1M 컨텍스트 창 | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| **MiniMax M2.5 Standard** | $0.15 | $1.20 | 일반적인 에이전트 작업, 197K 컨텍스트 | [MiniMax](https://www.minimax.io/news/minimax-m25) |
| **Claude Haiku 4.5** | $1.00 | $5.00 | 하트비트, 분류, 서식 지정 | Anthropic |
| **Claude Sonnet 4.6** | $3.00 | $15.00 | 구조화된 작업, 코드 검토 | Anthropic |
| **Claude Opus 4.6** | $5.00 | $25.00 | 복잡한 추론, 아키텍처 | [Anthropic](https://www.anthropic.com/claude/opus) |
| **Ollama (로컬)** | $0 | $0 | 하트비트, 임베딩, 일상적인 작업 | 자체 호스팅 |
계산은 간단합니다. 에이전트 호출의 80%가 일상적인 작업이고, 이를 Opus($5/$25) 대신 Haiku($1/$5)로 라우팅하면 해당 호출에 대한 비용을 80% 절감할 수 있습니다. 여기에 프롬프트 캐싱, 축소된 SOUL.md, 그리고 하트비트 및 임베딩을 위한 로컬 모델을 추가하면 월 $200의 에이전트 비용이 $30 미만으로 떨어집니다.

---

## 종합: 월 $30 구성

다음은 비용을 월 $30 미만으로 유지하면서 24/7 생산적으로 작동하는 OpenClaw 에이전트를 위한 실제 구성 예시입니다:

```json5
{
  agents: {
    defaults: {
// 주 상호작용을 위한 Sonnet — 실제 작업에 충분히 강력합니다
      model: "anthropic/claude-sonnet-4-6",

      // 하위 에이전트는 기본적으로 Haiku를 사용합니다
      subagents: {
        model: "anthropic/claude-haiku-4-5",
        runTimeoutSeconds: 120
      },

      // 하트비트: 로컬 모델, 더 긴 간격
      heartbeat: {
        intervalMinutes: 120,
        // 또는 로컬 모델이 없는 경우 Haiku로 라우팅
      }
    }
  },

  // 임베딩을 위한 로컬 Ollama (무료 메모리 검색)
  memory: {
provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // 컨텍스트 폭발을 방지하기 위한 lossless-claw
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // LLM-context 모드를 사용하는 Brave 검색 (더 적은 후속 토큰)
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

**월간 비용 내역 (예상, 30일 기준):**
| 구성 요소 | 토큰/일 | 모델 | 비용/월 |
|-----------|-----------|-------|------------|
| 주요 상호작용 (~2시간 활성) | ~80K (입력 50K + 출력 30K) | Sonnet | ~$18 |
| 하위 에이전트 호출 | ~30K | Haiku | ~$1.50 |
| 하트비트 (12회/일) | ~30K | 로컬/Haiku | $0–$1 |
| 메모리 임베딩 | — | 로컬 (Ollama) | $0 |
| 웹 검색 후속 작업 | ~20K | Sonnet | ~$2 |
| 프롬프트 캐싱 절감액 | — | — | –$4 |
| **총계** | | | **~$19–22** |
*계산: 주요 상호작용 = 50K 입력 × $3/M × 30 = $4.50, 여기에 30K 출력 × $15/M × 30 = $13.50을 더해 월 $1
**1. 청구서를 확인하세요.** API 제공업체 대시보드에 로그인하세요. 일일 지출을 살펴보고 급증한 부분을 찾으세요.

**2. 하트비트 간격을 늘리세요.** 설정에 `heartbeat.intervalMinutes: 120`을 추가하세요. 즉시 비용을 절약할 수 있습니다.

**3. SOUL.md 파일 크기를 확인하세요.**

```bash
wc -c ~/.openclaw/workspace/SOUL.md
```

30KB가 넘는다면, 줄이세요. 프로젝트별 컨텍스트는 스킬로 옮기세요.
**4. 하위 에이전트 모델을 설정하세요.** 설정에 `agents.defaults.subagents.model`을 추가하세요. 하위 에이전트가 비싼 기본 모델을 상속받지 않도록 하세요.

**5. lossless-claw를 설치하세요
- **MemOS 클라우드 플러그인**은 메모리를 전용 시스템으로 오프로딩하여 LOCOMO 장문 대화 벤치마크에서 [72%의 토큰 감소](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef)를 보고했습니다.
- **QMD**(Shopify 공동 창립자 Tobi Lütke 개발)는 로컬 시맨틱 검색을 통해 60–97%의 토큰을 절약합니다.
- ibl.ai Router 및 ClawRouter와 같은 **자동 라우팅 프록시**는 수동 모델 선택을 구식으로 만들고 있습니다.
- 3.7 버전에서 공개된 **컨텍스트 엔진 API**는 커뮤니티가 컨텍스트 효율성에 대한 완전히 새로운 접근 방식을 구축할 수 있음을 의미합니다.

추세는 명확합니다. 에이전트 런타임은 모든 계층에서 비용을 인식하게 되고 있습니다. 컨텍스트 관리, 메모리 검색, 모델 라우팅, 도구 출력 처리 모두 동시에 최적화되고 있습니다. 월 200달러의 OpenClaw 청구서는 30분만 설정에 투자할 의향이 있는 사람이라면 누구에게나 해결된 문제가 되어가고 있습니다.

---
*적은 예산으로 OpenClaw를 운영하고 계신가요? 댓글로 월별 비용과 구성을 공유해 주세요. 저희는 커뮤니티 비용 벤치마크를 위한 데이터를 수집하고 있습니다 — 목표는 각 에이전트 기능 등급별로 가능한
*출처: [r/PromptEngineering 비용 가이드](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [GitHub 토론 #12267](https://github.com/openclaw/openclaw/discussions/12267) · [MemOS 플러그인 분석](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [ibl.ai 라우터](https://github.com/iblai/iblai-openclaw-router) · [SaladCloud 비용 가이드](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [Apiyi 토큰 분석](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*