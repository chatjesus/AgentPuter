---
title: "OpenClaw 파워 유저 가이드: 아무도 알려주지 않는 30가지 팁"
description: "maxSpawnDepth의 기본값은 무한이 아닌 1입니다. SOUL.md는 하위 에이전트에게 보이지 않습니다. cleanup은 변경하지 않는 한 파일을 영원히 보관합니다. '작동하는' 수준과 '잘 구성된' 수준의 차이를 메워줄, 프로덕션에서 검증된 30가지 팁."
date: "2026-02-21"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "Configuration", "Sub-Agents", "Skills", "Cost Control", "Security", "Tips"]
featured: true
---

---

# OpenClaw 파워 유저 가이드: 아무도 알려주지 않는 30가지 팁

*OpenClaw 커뮤니티 · 2026년 2월*

대부분의 사람들은 OpenClaw를 설치하고, 에이전

---

이 30가지 팁은 프로덕션 사용 경험과 공식 문서를 꼼꼼히 읽은 내용을 바탕으로 합니다. 지나고 보면 당연한 내용도 있지만, 대부분은 전혀 그렇지 않습니다.

---

---

## 목차

1. [기본 구성 (팁 01–08)](#chapter-1)
2. [스킬 선택 및 사용 (팁 09–14)](#chapter-2)
3. [하위 에이전트 아키텍처 (팁 15–20)](#chapter-3)
4. [비용 관리 (팁 21–25)](#chapter-4)
5. [디버깅 및 보안 (팁 26–30)](#chapter-5)
6. [이 모든 내용 건너뛰기: TinyClaw](#tinyclaw)

---

---

## 구성 기본 사항 {#chapter-1}

---

### 01. AGENTS.md vs SOUL.md: 하위 에이전트가 실제로 참조하는 곳

OpenClaw는 3단계 계층 구조로 파일을 로드합니다:

```
~/.openclaw/SOUL.md   ← 전역
./SOUL.md             ← 프로젝트
AGENTS.md + TOOLS.md  ← 세션 (하위 에이전트가 보는 내용)
```

하위 에이전트는 `AGENTS.md`와 `TOOLS.md`만 로드합니다. 그 외 모든 것 — `SOUL.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`, `BOOTSTRAP.md` — 은 그들에게 보이지 않습니다.

---

이 부분에서 많은 사람들이 실수를 합니다. 그들은 `SOUL.md`에 라우팅 로직을 작성하고, 팬아웃 아키텍처를 배포한 다음, 하위 에이전트가 왜 올바르게 라우팅되지 않는지 한 시간 동안

---

## 라우팅
- 재무 관련 질문 → finance-agent
- 코드 리뷰 → code-reviewer
- 리서치 → research-storm
```

간단한 규칙: 하위 에이전트가 알아야 하는 정보는 `SOUL.md`에 있으면 안 됩니다.

---

### 02. 모델 문자열에는 제공자 접두사가 필요합니다

```json
{ "model": "claude-opus-4-6" }     ← 오류 발생
{ "model": "anthropic/claude-opus-4-6" }  ← 올바름
```

형식은 `provider/model-name`입니다. 이 접두사가 없으면, 두 제공자가 비슷한 이름을 가질 경우(실제로도 그렇습니다) 모델 라우터가 소리 없이 실패할 수 있습니다.

---

2026년 2월 기준 공통 문자열:

---

| 모델 | 적합한 용도 |
|-------|---------|
| `anthropic/claude-opus-4-6` | 실질적인 추론이 필요한 모든 작업 |
| `anthropic/claude-sonnet-4-6` | 대부분의 작업 — Opus에 가까운 품질, 훨씬 저렴함 |
| `anthropic/claude-haiku-4-5` | 깊이보다 속도가 더 중요한 실행 작업 |
| `google/gemini-3.1-pro-preview` | 긴 문서, 멀티모달 입력 |
| `openai/gpt-4o-mini` | 요약, 분류, 형식 변환 |
| `ollama/q

---

하위 에이전트의 전역 기본값을 설정하려면:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }
    }
  }
}
```

---

### 03. config.json에 API 키를 포함하지 마세요

매달 누군가 키를 인라인으로 포함한 OpenClaw 설정을 공개 GitHub 리포지토리에 푸시합니다. GitGuardian이 몇 분 안에 그것을 찾아냅니다.

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
CONTEXT7_API_KEY=...

# .gitignore
.env
.env.local
.env.*
```

---

OpenClaw는 `.env`를 자동으로 읽습니다. 키를 다른 곳에 둘 이유가 없습니다.

---

### 04. maxSpawnDepth의 기본값은 1입니다

`SpawnDepthExceeded` 오류를 보았지만 그 이유를 몰랐다면, 바로 이것 때문입니다.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2
      }
    }
  }
}
```

---

기본값은 1로, 한 단계의 하위 에이전트를 의미합니다. 최대값은 5이지만, 실제로는 2로 설정하면 거의 모든 실제 아키텍처를 처리할 수 있습니다. 깊이 2의 리프 노드는 더 이상 생성할 수

---

### 05. runTimeoutSeconds의 기본값은 0입니다

0은 타임아웃이 없음을 의미합니다. 멈춘 하위 에이전트는 영원히 실행됩니다.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "runTimeoutSeconds": 120
      }
    }
  }
}
```

---

대부분의 작업에는 120초면 충분합니다. 데이터가 많은 에이전트는 때때로 300초가 필요합니다. 이해해야 할 핵심은 시간 초과가 발생하면 실행은 중지되지만 세션은 삭제되지 않는다는 것입니다. 세

---

{
  "agents": {
    "defaults": {
      "subagents": {
        "cleanup": "delete"
      }
    }
  }
}
```

"delete"는 잘못된 이름입니다. 파일을 삭제하는 대신 트랜스크립트의 이름을 `*.deleted.*`로 바꿉니다. 기록은 보존되며 작업 디렉토리는 깨끗하게 유지됩니다. 정리되지 않은 세션은 60분 자동 보관 기능이 실행될 때까지 그대로 남아있으며, 에이전트를 자주 실행하는 경우 이는 꽤 긴 시간입니다.

---

### 07. 에이전트가 API를 환각(hallucination)하는 것을 막기 위해 context7 연결하기

---

이것은 개발 워크플로우에 추가할 수 있는 가장 영향력이 큰 MCP입니다. 에이전트는 몇 달 또는 몇 년 지난 훈련 데이터로 추측하는 대신 실시간 공식 문서를 쿼리합니다.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

API 키는 선택 사항입니다 — 사용량 제한에 도달하면 `context7.com/dashboard`에서 무료로 받으세요. 연결

---

"최신 Next.js에서 서버 액션은 어떻게 작동하나요?"라고 물어보면, 2023년 베타 버전의 내용이 아닌 실제 최신 문서를 얻을 수 있습니다.

---

### 08. TOOLS.md는 권한 경계입니다

`TOOLS.md`가 없으면 에이전트는 사용 가능한 모든 것을 호출할 수 있습니다.

```markdown
# TOOLS.md

deny: ["gateway", "cron", "billing", "admin_delete"]
```

---

`deny`는 `allow`보다 우선합니다. 다중 에이전트 설정에서는 이것이 생각보다 더 중요합니다 — 만약 하나의 스킬이 침해당하면, 허용적인 `TOOLS.md`는 폭발 반경이 전체 에이전트 그래프에 걸쳐 확

---

## 스킬 선택 및 사용 {#chapter-2}

---

### 09. 안전 점수는 장식용이 아닙니다

ClawHub와 agentskills.io 모두 모든 스킬에 대한 안전 점수를 표시합니다. 꼭 확인하세요.

- **A/B (8

---

2026년 2월, ClawHavoc 사건으로 ClawHub에서 341개의 스킬이 제거되었습니다. 이 스킬들에는 프롬프트 주입 페이로드가 포함되어 있었으며, 일부는 너무 교묘해서 수동 검사로는 발견하지 못했을

---

`self-improvement`는 모든 세션의 오류, 수정 사항, 지식 격차를 `.learnings/ERRORS.md`에 기록합니다. 다음 세션이 시작되기 전에 에이전트는 그 파일을 다시 읽어, 지난번에 무엇이 잘못되었는지 이미 알고 있는 상태로

---

로드 순서는 `TOOLS.md` → `AGENTS.md` → `SKILL.md`입니다. 만약 스킬이 `AGENTS.md`에 있는 것과 동일한 이름의 도구를 정의하면, 스킬의 버전이 우선 적용됩니다.

때로는

---

최소한의 실행 가능한 `SKILL.md`에는 세 개의 섹션이 있습니다:

```markdown
# my-skill/SKILL.md

---

## 제가 하는 일
CSV 판매 데이터를 분석하고 주간 요약을 생성합니다.

---

## 사용 시점
영업 기간이 종료된 후, CRM export가 있을 때.
실시간 데이터 또는 비영업 데이터셋용이 아닙니다.

---

## 작업 방식
1. 작업 프롬프트에 있는 경로에서 CSV 읽기
2. 총계, 상위 실적자, 기간별 델타 계산하기
3. Markdown 테이블로 서식 지정하기
4. output/sales_summary_[date].md에 저장하기
```

이게 전부입니다. 에이전트는 평이한 영어 지시를 따를 수 있습니다. 특별한 구문을 배울 필요가 없습니다.

---

### 13. ClawHub vs agentskills.io: 용도에 따라 다른 도구

---

| | clawhub.ai | agentskills.io |
|-|-----------|----------------|
| 카탈로그 크기 | 3,286개 스킬 | 19,309개 스킬 |
| 큐레이션 | 안전 감사 완료, 큐레이션됨 | 커뮤니티 제출, 롱테일 |
| 최적 사용처 | 프로덕션용 | ClawHub에 없는 특정 스킬 찾기 |

이 둘은 경쟁 관계가 아닙니다. 기본적으로 ClawHub을 사용하고, ClawHub에 없는 특정 기능이 필요할 때 agentskills.io로 전환하세요.

---

### 14. proactive-agent + Cron: "자율성"의 실제 의미

---

`proactive-agent`는 WAL(충돌 복구, 재시작 시 컨텍스트 유지), 자율적인 Cron 스케줄링, 그리고 중단 후 컨텍스트 복원을 지원합니다.

이를 통해 가능한 작업의 구체적인 예시는 다음과 같습니다:

```

---

누를 버튼도, 인간의 개입도 없습니다. 그냥 알아서 실행됩니다. 바로 이 지점에서 에이전트는 더 이상 도구가 아닌 인프라처럼 느껴지기 시작합니다.

---

---

## 서브 에이전트 아키텍처 {#chapter-3}

---

### 15. 팬아웃: 대부분의 팀이 아직 도입하지 않은 가장 영향력 있는 변화

순차적:
```
메인 → 데이터 가져오기 (12초)

---

팬아웃:
```python
sessions_spawn(task="fetch market data",  label="market-data",    model="anthropic/claude-haiku-4-5")
sessions_spawn(task="summarize news",     label="news-summary",   model="anthropic/claude-haiku-4-5")
sessions_spawn(task="check calendar",     label="cal-check",      model="anthropic/claude-haiku-4-5")
sessions_spawn(task="analyze yesterday",  label="task-analysis",  model="anthropic/claude-haiku-4-5")
# 메인 에이전트는 계속 진행하며, 네 가지 작업 모두 병렬로 실행됩니다
총: 약 20초
```

---

`sessions_spawn`은 즉시 `runId`를 반환하며 블로킹하지 않습니다. 메인 에이전트는 계속해서 작업을 수행합니다. 순차적인 작업을 팬아웃(fan-out) 방식으로 재구성하는 이 한 가지 변경만으로도 '모닝 브

---

# 실제로 필요한 단일 작업을 위한 오버라이드
sessions_spawn(
    task="다중 테넌트 청구를 위한 데이터 모델 설계",
    label="billing-schema",
    model="anthropic/claude-opus-4-6"
)
```

실제로 Haiku는 의미 있는 품질 저하 없이 80% 이상의 실행 작업을 처리합니다. 비용 차이는 상당합니다. 일반적인 팬아웃 아키텍처의 경우 API 지출이 50–60% 절감됩니다.

---

### 17. 라우팅 로직은 SOUL.md가 아닌 AGENTS.md에

---

매번 조용한 실패(silent failure)를 유발하므로 다시 한번 강조합니다:

```markdown
# ❌ SOUL.md에서 — 하위 에이전트는 이것을 볼 수 없습니다
사용자가 재무에 대해 질문하면, finance-agent에게 위임하세요.

---

# ✅
sessions_spawn(
    task="analyze Q4 numbers",
    label="q4-sales-analysis-2026"
)
```

레이블이 없으면 `/subagents list`는 익명 세션의 장벽을 보여줍니다. 새벽

---

`announce` 메커니즘은 단방향입니다. 하위 에이전트는 작업 완료 시에만 보고합니다. 실행 도중에 멈춰서 명확한 설명을 요청할 수 없습니다.

이는 작업 프롬프트에 에이전트에게 필요한 모든 정보가 포함되어야

---

# ✅ 자체 포함
sessions_spawn(
    task="""
    /data/sales_jan_2026.csv를 분석하세요.
    출력: 1) 월 총수익, 2) 판매량 기준 상위 5개 제품,
    3) /data/sales_dec_2025.csv 대비 전월 대비(MoM) 변동.
    형식: 마크다운 테이블. /output/jan_2026_report.md에 저장하세요.
    두 파일 중 하나라도 없으면 /output/errors.log에 기록하고 중지하세요.
    """,
    label="jan-2026-analysis"
)
```

---

방에 들어가 문을 닫고 나면 다시는 나와서 질문할 수 없는 사람에게 지시사항을 작성해주는 것과 같다고 생각하세요.

---

### 20. 동시성 제한을 주의하세요

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 3
      }
    }
  }
}
```

`maxChildrenPerAgent`는 하나의 부모가 생성할 수 있는 하위 에이전트의 수를 제한합니다 (기본값: 5). `maxConcurrent`는 병렬 에이전트에 대한 전역 상한선입니다 (기본값: 8).

---

어느 한도에 도달해도 아무것도 중단되지는 않습니다 — 에이전트가 대기열에 추가됩니다 — 하지만 지연 시간은 늘어납니다. 더 낮은 속도 제한이 있는 개인 API 요금제를 사용 중인 경우, `maxConcurrent`를

---

## 비용 관리 {#chapter-4}

---

### 21. 자동 모델 라우팅을 위한 save-money 설치

```bash
openclaw install save-money
```

이 스킬은 작업의 복잡도를 감시하여 이를 처리할 수 있는 가장 저렴

---

사용자들은 월간 비용이 50% 이상 절감된다고 꾸준히 보고하고 있습니다. 라우팅이 완벽하지는 않지만, 그럴 필요는 없습니다. Opus 대신 Haiku로 작업의 60%만 라우팅해도 절감액은 빠르게 쌓

---

수 시간 동안 실행되는 리서치 에이전트, 반복적인 문서 편집, 긴 디버깅 세션에 가장 적합합니다. 에이전트가 정기적으로 컨텍스트 제한에 도달하는 경우 이 기능을 켜세요.

---

### 23. openclaw usage: 실행하고, 제대로 살펴보세요

```bash
openclaw usage
```

세션, 모델, 도구별 토큰 소비 내역을 보여줍니다. 대부분의 사람들은 이것을 한 번 실행하고, 총합만 훑어본 후 닫아버립니다. 진정한 가치는 에이전트별 분석에 있습니다.

---

확인해야 할 사항: 한 하위 에이전트가 나머지보다 5배 더 많은 토큰을 사용하는 경우(프롬프트가 너무 김), 단일 세션에서 도구가 20번 호출되는 경우(에이전트가 루프에 빠짐), Sonnet

---

{
  "tasks": {
    "summarize": { "model": "openai/gpt-4o-mini" },
    "classify":  { "model": "openai/gpt-4o-mini" },
    "translate": { "model": "

---

### 25. 민감한 데이터는 로컬 모델을 거칩니다

```json
{
  "mcpServers": {
    "local-llm": {
      "model": "ollama/qwen2.5",
      "baseUrl": "http://localhost:11434"
    }
  }
}
```

---

재무 기록, 직원 데이터, 내부 문서 등 네트워크 외부로 유출되어서는 안 되는 모든 것은 Ollama로 보냅니다. Qwen2.5는 로컬 하드웨어(0.5B부터 72B까지 다양한 크기 옵션)에서 잘 실행되고

---

## 디버깅 및 보안 {#chapter-5}

---

### 26. 무엇보다 먼저 상세 로그 확인하기

```bash
openclaw debug --verbose
/subagents log <runId>
```

상세 로그는 모든 도구 호출, 모든 라우팅 결정, 그리고 각 단계의 전체 컨텍스트를 보여줍니다. 십중팔구, 로그를 보는 순간 문제는 명확해집니다. 에이전트가 존재하지 않는 도구를 호출하려고 했거나, 재시도 루프에 갇혔거나, 필요한 정보가 포함되지 않은 프롬프트로 작업하고 있었던 경우입니다.

---

무슨 일이 일어났는지 직접 확인할 수 있을 때는 추측으로 디버깅하지 마세요.

---

### 27. 시간 초과와 실패는 다릅니다 — 다르게 처리하세요

```bash
/subagents list
```

무언가를 하기 전에 `status` 열을 확인하세요:

- `timeout` — 에이전트가 `runTimeoutSeconds`를 초과하여 실행되었습니다. 제한을 늘리고 다시 실행하세요. 동일한 설정으로 다시 실행하면 시간 초과가 재현됩니다.
- `error` — 실제 실패입니다. 로그를 열어 오류 메시지를 찾으세요.

---

그것들은 각각 다른 해결책이 필요합니다. 시간 초과를 실패로 처리하는 것은 잘못된 방향으로 이끌 수 있습니다.

---

### 28. clawdefender로 설치된 스킬 스캔하기

```bash
clawdefender scan --all
```

ClawHavoc 사태 이후, 이것은 새로운 시스템뿐만 아니라 기존에 설치된 모든 시스템에서 실행해야 하는 작업입니다. 이것은 겉보기에는 위험해 보이지 않으면서도 341개의 스킬을 위험하게 만들

---

스킬이 안전 요건을 충족하지 못하면, 해당 스킬을 제거하고 더 높은 안전 점수를 가진 대안을 찾으세요. 자격 증명을 유출하려는 스킬을 '부분적으로 신뢰'할 수 있는 안전한 방법은 없습니다.

---

| 요청하지 말 것 | 대신 요청할 것 |
|--------------|----------------|
| `calendar:*` | `calendar:read` |
| `email:*` | `email:send` |
| `files:readwrite` | `files:read` |
| `contacts:*` | `contacts:read` |

캘린더 읽기 스킬은 쓰기 권한이 필요하지 않습니다. 이메일 작성 스킬은 메시지를 삭제할 필요가 없습니다. 스킬 설명에서 약속한 내용을 초과하는 범위 요청은 승인 전에 조사해봐야 할 위험 신호입니다.

---

### 30. TinyClaw에는 이 모든 것이 사전 구성되어 있습니다

---

이 가이드의 구성(타임아웃 설정, 정리 정책, 모델 라우팅, 기본 보안 설정)은 이미 TinyClaw에 내장되어 있습니다. 설정을 건너뛰고 1분 이내에 프로덕션 준비가 완료된 인스턴스를 실행하고 싶

---

## 이 모든 것을 건너뛰세요: TinyClaw {#tinyclaw}

수동 OpenClaw 설정은 절차를 알고 있다면 약 1시간이 걸립니다:

| 단계 | 시간 |
|------|------|
| 서버 프로비저닝 | 15분 |
| SSH 키 구성 | 10분 |
| Node.js 설치 | 5분 |
| OpenClaw 설치 및 구성 | 17분 |
| AI 제공업체에 연결 | 10분 |
| **총계** | **~60분** |

비전문가라면 10을 곱하세요. 각 단계를 실행하기 전에 먼저 배워야 하기 때문입니다.

---

TinyClaw는 이 모든 과정을 생략합니다. 서버는 미리 준비되어 있고, 환경도 이미 구성되어 있습니다. 세 가지만 선택하면 됩니다:

**모델:** Claude Opus 4.6, GPT-5.2, 또는 Gemini 3.1 Pro

**채널:**

---

- 이메일 읽고 요약, 답장 초안 작성
- 회의 알림 및 일정 충돌 감지
- 영수증을 통한 비용 추적
- 경쟁사 조사, 잠재 고객 선별
- 스탠드업 요약, OKR 추적
- 계약서, 직무 기술서, 소셜 게시물 초안 작성
- 가격 비교, 쿠폰 검색

그리고 문장으로 설명할 수 있는 모든 것. 서버 슬롯이 제한되어 있습니다 — [tinyclaw.dev](https://tinyclaw.dev)에서 이용 가능 여부를 확인하세요.

---

---

## 빠른 참조

| 챕터 | 팁 | 읽는 시점 |
|---------|------|-----------|
| 구성 | 01–08 | 구성을 변경하기 전에 |
| 스킬 | 09–14 | 무엇이든 설치하기 전에 |
| 하위 에이전트 | 15–20 | 다중 에이전트 워크플로우를 구축하기 전에 |
| 비용 | 21–25 | 첫 실제 워크로드를 실행한 후 |
| 디버그 및 보안 | 26–30 | 문제가 발생했을 때 |

---

---

## 리소스

- [docs.openclaw.ai](https://docs.openclaw.ai) — 공식 문서
- [clawhub.ai](https://clawhub.ai) — 큐레이션되고 안전 감사를 받은 스킬
- [agentskills.io](https://agentskills.io) — 더 넓은 카탈로그, 롱테일
- [tinyclaw.dev](https://tinyclaw.dev) — 원클릭 배포
- [agentputer.com](https://agentputer.com) — 연중무휴 24시간 클라우드 호스팅

---

---

*출처: OpenClaw 문서 (docs.openclaw.ai) · ClawHub 안전 데이터 (2026년 2월) · Anthropic 모델 문서 (docs.anthropic.com) · context7 문서 (context7.com)*