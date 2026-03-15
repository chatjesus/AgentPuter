---
title: "AI 두뇌 대결: Gemini 3.1 Pro 출시. 최고의 OpenClaw 에이전트를 실행하는 모델은?"
description: "Gemini 3.1 Pro는 OpenClaw의 기능을 정확히 테스트하기 위해 만들어진 벤치마크인 MCP Atlas에서 69.2%의 점수를 기록했습니다. Claude Opus 4.6이 여전히 공식 권장 모델입니다. 5개의 벤치마크, 5개의 모델을 분석하고 실제 워크플로우에 가장 적합한 구성이 무엇인지 알아봅니다."
date: "2026-02-19"
author: "AgentPuter Lab"
readingTime: "14 min"
tags: ["OpenClaw", "Gemini 3.1 Pro", "Claude Opus 4.6", "Claude Sonnet 4.6", "MCP Atlas", "AI Models", "Benchmark"]
featured: true
---

# AI 두뇌 대결: Gemini 3.1 Pro 출시. 최고의 OpenClaw 에이전트를 실행하는 모델은?

---

**이틀 전, Anthropic은 Claude Sonnet 4.6을 출시했습니다. 어제, Google은 Gemini 3.1 Pro를 출시했습니다. OpenClaw 사용자에게 실질적으로 중요한 벤치마크에서 예상치 못한 승자가 나타났고, 이는 진정한 논쟁을 불러일으키고 있습니다.**

*에이전트 인프라 시리즈 · 파트 11 | 연구 날짜: 2026년 2월 19일*

---

이틀 전 — 2월 17일 — Anthropic은 Claude Sonnet 4.6을 출시했습니다.

어제 — 2월 19일 — Google은 Gemini 3.1 Pro를 출시했습니다.

Google이 출시와 함께 공개한 벤치마크 표는 널리 퍼지고 있습니다. 특히 한 행이 스크롤하던 OpenClaw 사용자들의 눈길을 사로잡았습니다: **MCP Atlas**.

---

MCP Atlas는 Scale AI의 연구팀이 구축한 벤치마크입니다 (arxiv 2602.00933). 이 벤치마크는 36개의 실제 MCP 서버, 220개의 도구, 1,000개의 작업을 사용하며, 이는 AI 모델이 사용할 도구를 미리 알려주지 않은 상태에서 여러 서버에

---

이 두 가지는 동시에 사실입니다. 그 이유와, 이것이 오늘 여러분의 에이전트 설정에 어떤 의미를 갖는지 설명해 드리겠습니다.

---

---

## 첫째: 대부분의 벤치마크는 질문 자체가 잘못되었습니다

모델을 비교하기 전에, 무엇을 측정할지 정해야 합니다. 표준 AI 벤치마크들 — Humanity's Last Exam, GPQA Diamond, MMLU — 은 학문적 주제에 대한 지식 회상 및 추론 능력을 테스트합니다. 범용 챗봇에게는 이것들이 중요합니다. 이메일, 캘린더, GitHub 리포지토리, 브라우저를 관리하는 OpenClaw 에이전트에게는 이것들은 거의 관련이 없습니다.

실제로 에이전트 성능을 예측하는 벤치마크:

---

| 벤치마크 | 테스트 항목 | OpenClaw 관련성 |
|-----------|--------------|-------------------|
| **MCP Atlas** | 서버 간 도구 발견, 선택 및 다단계 오케스트레이션 (36개의 실제 MCP 서버, 220개의 도구) | ★★★★★ OpenClaw 스킬이 바로 이 작업을 수행합니다 |
| **APEX-Agents** | 장기적이고 다단계적인 전문 작업 | ★★★★★ 실제 에이전트 워크플로우 |
| **τ2-bench** | 소매 및 통신 시뮬레이션에서의 도구 사용 안정성 | ★★★★★ 프로덕션 안정성 |
| **GDPval-AA Elo** | 고부가가치 지식 작업 전반에 걸친 전문가 작업 ELO | ★★★★ 종합적인 전문 성능 |
| **BrowseComp** | 다단계 추론을 사용한 에이전트 웹 검색 | ★★★★ 브라우저 및 검색 스킬 |
| Terminal-Bench 2.0 | 터미널 명령어 실행 정확도 | ★★★★ 시스템 관리 스킬 |
| SWE-Bench Verified | 단일 시도 코드 버그 수정 | ★★★ 코딩 스킬 (유용하지만 주 기능은 아님) |
| ARC-AGI-2 | 새로운 추상 논리 패턴 | ★★★ 복잡한 계획 작업

---

그 필터를 적용하면, 경쟁자들은 실제로 이렇게 비교됩니다.

---

---

## 경쟁자들

### Gemini 3.1 Pro — 새로운 도전자

어제(2월 19일) 출시된 Gemini 3.1 Pro는 Google의 업그레이드된 핵심 추론 계층, 즉 Gemini Deep Think을 구동하는 인텔리전스이며, 현재 Gemini API, Vertex AI, Google AI Studio를 통해 개발자들에게 배포되고 있습니다.

**선도하는 분야:**

---

- **MCP Atlas: 69.2%** — 테스트된 모든 모델 중 최고, Claude Opus 4.6(59.5%)보다 거의 10점 앞섬
- **APEX-Agents: 33.5%** — 테스트된 모든 모델 중 최고
- **SWE-Bench Verified: 80.6%** — 코딩 신뢰도에서 Claude Opus 4.6(80.8%)와 사실상 동점
- **BrowseComp: 85.9%** — 테스트된 모든 모델 중 최고 (모든 모델은 도구 지원 브라우징(검색 + Python + 브라우징)으로 벤치마크됨)
- **ARC-AGI-2: 77.1%** — Gemini 3 Pro의 31.1%보다 두 배 이상 높으며, Opus 4.6(68.8%)보다 훨씬 앞섬
- **1백만 토큰 컨텍스트 창** — Claude의 컨텍스트 규모와 일치; Context Compaction API 없음

**부족한 점:**

---

- **GDPval-AA Elo: 1317** — 인간 평가자가 평가한 전문가 수준의 전문 작업에서 Claude Sonnet 4.6 (1633) 및 Opus 4.6 (1606)보다 300 Elo 점 이상 뒤처짐
- **SWE-Bench Pro: 54.2%** — GPT-5.3-Codex (56.8%)에 뒤처짐
- **Humanity's Last Exam (with tools): 51.4%** — Opus 4.6 (53.1%)에 뒤처짐
- **가격:** 입력 토큰 100만 개당 2달러, 출력 토큰 100만 개당 12달러 (표준, 200K 이하 컨텍스트); 200K 초과 시 4달러/18달러 — Gemini 3 Pro와 동일한 요금으로, 현재 추론 성능은 2배 이상

**OpenClaw에서 사용하는 방법:**

```bash
export GEMINI_API_KEY="your-google-ai-studio-key"
openclaw models set google/gemini-3.1

---

2월 5일에 출시된 Claude Opus 4.6은 OpenClaw의 공식 문서에서 권장하는 모델이며, 대부분의 ClawHub 개발자들이 몇 주 동안 스킬을 디버깅하는 데 사용해 온 모델입니다.

**강점:**

- **SWE-Bench Verified: 80.8%** — 모든 모델 중 가장 높음
- **Humanity's Last Exam (with tools): 53.1%** — 모든 모델 중 가장 높음
- **τ2-bench Telecom: 99.3%** — Gemini 3.1 Pro와 함께 최고점 동률 (동일하게 99.3%)
- **GDPval-AA Elo: 1606** — Claude Sonnet 4.6에 이어 전체 2위

**부족한 점:**

---

- **MCP Atlas: 59.5%** — OpenClaw의 아키텍처와 가장 유사한 벤치마크에서 Gemini 3.1 Pro보다 거의 10% 포인트 뒤처짐
- **비용:** 입력 토큰 100만 개당 $5, 출력 토큰 100만 개당 $25 (표준, 최대 200K 컨텍스트). 작업이 200K 토큰을 초과하면 가격이 $10/$37.50으로 전환됩니다 — 초과분만이 아닌, 요청의 모든 토큰에 적용됩니다

**주요 신규 기능 (2월 5일 출시):**

---

- **1백만 토큰 컨텍스트 창(베타):** 이 규모에 도달한 최초의 Opus급 모델. 액세스하려면 Anthropic 등급 요구 사항을 충족해야 합니다
- **컨텍스트 압축 API(베타):** 세션이 컨텍스트 한도에 가까워지면 이전 대화 세그먼트를 자동으로 요약하여, 수동 개입 없이 장기 실행 에이전트 작업을 가능하게 합니다 — 현재 Gemini 3.1 Pro에는 없는 기능입니다
- **에이전트 팀(알파):** 여러 전문 하위 에이전트가 병렬로 실행되며(프론트엔드/백엔드/테스트 동시 실행), Claude Code v2.1.32+ 및 Cowork 플랫폼에서 사용 가능합니다
- **적응형 사고(4단계):** 추론 깊이 — 낮음/중간/높음/최대 — 를 자동으로 조정하여 더 간단한 작업에 대한 토큰 소비를 제어합니다
- **128K 출력 토큰:** 이전 세대보다 두 배 증가

---

**OpenClaw에서 사용하는 방법:**

```bash
openclaw models set anthropic/claude-opus-4-6
```

---

### Claude Sonnet 4.6 — 숨겨진 강자

2월 17일에 출시된 Sonnet 4.6에는 대부분의 사람들이 진정으로 놀라워하는 벤치마크 결과가 포함되어 있습니다

---

또한 τ2-bench Retail에서 Gemini 3.1 Pro를 능가하며(91.7% 대 90.8%), MRCR v2 긴 컨텍스트 검색에서는 동점(84.9%)을 기록했습니다. 내부 테스트에서 Claude Code 사용자는 일대일 비교의 59%에서 Opus 4.5보다 Sonnet 4.6을

---

### GPT-5.3-Codex — 코딩 전문가

GPT-5.3-Codex는 범용 에이전트 논의와는 별개의 범주에 속합니다. 전문가 모델입니다:

- **SWE-Bench Pro: 56.8%** — 모든 모델 중 가장 높으며, Gemini 3.1 Pro(54.2%)를 능가합니다.
- **Terminal-Bench 2.0: 77.3%** — OpenAI의 Codex 하네스에서 가장 높음(자체 보고); 표준 Terminus-2 하네스에서는 Gemini 3.1 Pro가 68.5%로 선두를 차지합니다.
- **APEX-Agents: 23.0%** — 테스트된 모든 모델 중 가장 낮습니다.

---

openclaw onboard --auth-choice openai-codex
openclaw models set openai-codex/gpt-5.3-codex
```

---

### Kimi K2.5 — 비용 파괴자

공식 벤치마크 표에는 없지만 알아둘 가치가 있습니다. Moonshot AI의 Kimi K2.5는 현재 OpenRouter 에이전트 리더보드의 도구 선택 작업에서 1위를 차지하고 있으며, 이번 주에 사용량이 급증했습니다. OpenClaw의 공식 문서에는 네이티브 지원이 포함되어 있습니다:

```bash
openclaw models set moonshot/kimi-k2.5

---

비용에 민감한 워크플로우, 특히 중국어 컨텍스트를 다루는 경우, Kimi K2.5는 Claude의 API 비용보다 훨씬 저렴한 비용으로 경쟁력 있는 에이전트 성능을 제공합니다. 현재 중국어 OpenClaw 배포 환경에서 가장 빠르게 성장하는 모델입니다.

---

---

## 5가지 벤치마크 병렬 비교

| 벤치마크 | Gemini 3.1 Pro | Opus 4.6 | Sonnet 4.6 | GPT-5.3-Codex | 승자 |
|-----------|---------------|---------|-----------|--------------|--------|
| **MCP Atlas** (도구 오케스트레이션) | **69.2%** | 59.5% | 61.3% | — | 🏆 Gemini |
| **APEX-Agents** (장기 계획) | **33.5%** | 29.8% | — | 23.0% | 🏆 Gemini |
| **GDPval-AA Elo** (전문가 작업) | 1317 | 1606 | **1633** | — | 🏆 Sonnet |
| **τ2-bench Retail** (도구 신뢰성) | 90.8% | **91.9%** | 91.7% | — | 🏆 Opus |
| **BrowseComp** (에이전트 검색) | **85.9%** | 84.0% | 74.7% | — | 🏆 Gemini |
| SWE-Bench Pro (코딩) | 54.2% | — | — | **56.8%** | 🏆 Codex |

---

Gemini 3.1 Pro는 5개의 핵심 에이전트 벤치마크 중 3개에서 승리합니다. Claude Sonnet 4.6은 전문가 작업 ELO에서 1위를 차지합니다. Claude Opus 4.6은 도구 신뢰성에서 선두를 달립니다. GPT-5.3-Codex는 코딩 분야를 장악합니다. 어떤 단일 모델도 모든 것을 이기지는 못합니다 — 그리고 올바른 해답은 어떤 벤치마크가 귀하의 실제 OpenClaw 워크플로우와 일치하는지에 달려 있습니다.

---

---

## 어떤 워크플로우에 어떤 모델을 사용해야 할까요?

---

| OpenClaw 사용 사례 | 추천 모델 | 핵심 이유 |
|------------------|------------------|------------|
| 이메일 분류 + 캘린더 관리 (gog, mail Skills) | **Sonnet 4.6** | GDPval-AA 1633 (전 세계 1위), 전문적인 작업에 강함, Opus보다 40% 저

---

**한눈에 보는 비용 (100단계 복잡한 워크플로우):**

| 모델 | 예상 비용 | 비고 |
|-------|---------------|-------|
| Gemini 2.5 Flash | **$0** (무료 등급) | Google AI Studio를 통해 하루 1,500회 요청 |
| Kimi K2.5 | ~$0.03 | Moonshot API |
| Sonnet 4.6 | ~$0.90 | 백만 토큰당 $3/$15 |
| Gemini 3.1 Pro | ~$0.60 | 백만 토큰당 $2/$12 (20만 이하); 20만 초과 시 $4/$18 |
| Opus 4.6 | ~$3.60 | 20만 토큰 초과 시 장문 컨텍스트 요금 적용 |

---

---

## 커뮤니티는 왜 여전히 Claude를 사용하는가?

핵심 질문은 다음과 같습니다: OpenClaw 아키텍처에 가장 관련성이 높은 벤치마크인 MCP Atlas에서 Gemini 3.1 Pro가 앞서고 있는데, 왜 커뮤니티는 전환하지 않았을까요?

**이유 1: 표준화된 벤치마크 대 프로덕션 스킬 품질**

---

MCP Atlas는 36개의 잘 구조화되고 스키마를 준수하는 MCP 서버를 대상으로 모델을 테스트합니다. OpenClaw의 3,286개 커뮤니티 Skill은 매우 다양합니다 — 일부 SKILL.md 파일은 모호한 도구 설명, 불완전한 오류 처리, 비표준 서식을 가지고 있습니다. Claude는 더 높은 허용 오차와 더 나은 복구 능력으로 잘못된 형식의 도구 호출을 처리합니다. Gemini의 더 높은 벤치마크 점수는 깨끗하고 잘 구성된 입력을 가정합니다. 프로덕션 환경에서는 잘못된 입력으로부터 복구하는 모델의 능력이 잘 구성된 입력에 대한 점수보다 더 중요한 경우가 많습니다.

**이유 2: 생태계는 Claude의 동작을 중심으로 구축되었습니다**

---

수천 개의 ClawHub Skill은 Claude의 특정 도구 호출 규칙, 응답 패턴, 오류 복구 시퀀스에 맞춰 개발되고 디버깅되었습니다. 모델을 전환하는 것은 단순히 설정값을 변경하는 것이 아니라, 전체 Skill 스택이 작동하는 방식을 재조정하는 것입니다. 이는 벤치마크 수치로는 파악할 수 없는 실제 마이그레이션 비용입니다.

**이유 3: Context Compaction API는 의미 있는 실질적인 해자입니다**

---

이제 두 모델 모두 1M 토큰 컨텍스트 창을 가집니다. 하지만 Claude Opus 4.6(및 Sonnet 4.6)에는 Context Compaction API가 포함되어 있습니다. 이 API는 세션이 한계에 가까워지면 오래된 대화를 자동으로 요약하여 수동 재시작 없이 에이전트를 무기한으로 실행할 수 있게 해줍니다. 수백 개의 도구 호출에 걸쳐 몇 시간 동안 실행되는 OpenClaw 세션의 경우, 이는 현재 Gemini 3.1 Pro에는 없는 기능입니다.

---

**결론적으로:** Gemini 3.1 Pro는 현재 테스트하기에 가장 매력적인 모델입니다 — 특히 교차 시스템 자동화 및 브라우저 워크플로우에 있어서는 더욱 그렇습니다. 하지만 "이 벤치마크에서 더 높은 점수를 받는다"와 "귀하의 특정 OpenClaw 설정에서 더 나은 성능을 보일 것이다"는 서로 다른 주장입니다. 결정하기 전에 실제 워크플로우에서 테스트해 보세요.

---

---

## OpenClaw에서 모델을 전환하는 방법

OpenClaw는 모든 LLM 참조에 `provider/model` 표기법을 사용합니다. 전환은 단일 명령어로 이루어집니다:

```bash
# 현재 모델 보기
openclaw models list

# Gemini 3.1 Pro로 전환 (먼저 Google AI Studio에서 GEMINI_API_KEY를 설정하세요)
export GEMINI_API_KEY="your-key"
openclaw models set google/gemini-3.1-pro-preview

# Claude Opus 4.6으로 다시 전환 (공식 권장 기본값)
openclaw models set anthropic/claude-opus-4-6

# Sonnet 4.6으로 전환 (더 나은 비용 효율성)
openclaw models set anthropic/claude-sonnet-4-6

# GPT-5.3-Codex로 전환 (OAuth 로그인 필요)
openclaw onboard --auth-choice openai-codex
openclaw models set openai-codex/gpt-5.3-codex
```

---

# Kimi K2.5 (비용 민감 / 중국어)
openclaw models set moonshot/kimi-k2.5

# Ollama를 통한 완전 로컬 모델 (무료, 비공개)
openclaw models set ollama/qwen3.5
```

또는 설정 파일(`~/.openclaw/openclaw.json`)에서 설정하세요:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "google/gemini-3.1-pro-preview"
      }
    }
  }
}
```

---

> **한 가지 중요한 참고사항:** OpenClaw는 현재 단일 설정에서 작업별 자동 모델 라우팅을 지원하지 않습니다. 즉, "브라우저 작업에는 Gemini를, 추론 작업에는 Claude를 사용"하도록 자동으로 지정하는 내장된 방법이 없습니다. 파워 유저들은 서로 다른 모델 구성으로 여러 OpenClaw 인스턴스를 실행하고 Agent

---

## 이 모든 것이 번거롭다면: TinyClaw

현재 상황을 요약하면 이렇습니다: 여섯 개의 경쟁 모델, 열 개의 관련 벤치마크, 시나리오마다 다른 승자, 관리해야 할 API 키, 추적해야 할 컨텍스트 가격 임계값, 그리고 11일마다 출시되는 주요 신규 모델이 있습니다.

대부분의 OpenClaw 사용자들은 이 모든 것을 계속해서 관리하고 싶어 하지 않습니다. 그들은 제대로 작동하는 에이전트를 원합니다.

[TinyClaw](https://tinyclaw.dev)가 여러분을 대신해 모델 결정을 처리해 줍니다:

---

1. **60초 만에 배포** — Node.js 설정 없이 1분 안에 OpenClaw 실행
2. **스마트 모델 추천** — 실제 사용 패턴을 기반으로 워크플로우에 가장 적합한 모델 추천
3. **원클릭 모델 전환** — 어제 출시된 Gemini 3.1 Pro, TinyClaw에서 이미 지원

---

## 더 큰 그림

Gemini 3.1 Pro: 2월 19일.
Claude Sonnet 4.6: 2월 17일.
Claude Opus 4.6: 2월 5일.
최근 세 가지 주요 릴리스 간의 간격: **11일**.

이러한 속도는 여러분의 Open

---

교차 시스템 자동화 및 브라우저 워크플로우용: Gemini 3.1 Pro를 테스트하세요.
예산이 제한된 전문가급 작업용: Sonnet 4.6.
컨텍스트 유지가 중요한 장기 세션용: 컨텍스트 압축(Context Compaction) 기능이 있는 Opus 4.6.
순수 코드 작업용: GPT-5.3-Codex.

그 외 모든 분들: [TinyClaw](https://tinyclaw.dev).

---

---

*벤치마크 데이터: Gemini 3.1 Pro 공식 벤치마크 표 (Google DeepMind, 2026년 2월 19일). MCP Atlas 방법론: Scale AI Research, arxiv 2602.00933, scale.com/research/mcpatlas. 가격: Anthropic 공식 문서 (platform.