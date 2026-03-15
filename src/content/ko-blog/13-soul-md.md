---
title: "에이전트에게 영혼을 불어넣는 3-파일 아키텍처"
description: "OpenClaw 설정에서 SOUL.md, IDENTITY.md, USER.md 파일이 가장 중요한 이유와, 에이전트가 평범한 챗봇처럼 들리지 않도록 이 파일들을 작성하는 방법을 알아봅니다."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "6 min"
tags: ["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent Personalization", "Prompt Engineering"]
featured: false
---

# 에이전트에게 영혼을 불어넣는 3-파일 아키텍처

---

**OpenClaw 설정에서 `SOUL.md`, `IDENTITY.md`, `USER.md`가 가장 중요한 파일인 이유**

*에이전트 인프라 시리즈 · 파트 13*

---

만약 여러분의 OpenClaw 에이전

---

일반적인 도구와 개인화된 파트너의 차이는 다음 세 개의 마크다운 파일에서 비롯됩니다:

1.  **`SOUL.md`**: 에이전트의 성격, 가치관 및 제약 조건.
2.  **`IDENTITY.

---

## 1. `SOUL.md`: 성격의 핵심

이것은 에이전트를 해적처럼 말하게 만드는 것이 아닙니다 (물론 원하신다면 가능합니다). `SOUL.md`는 에이전트의 *분위기*와 *제약 조건*을 정의합니다.

**나쁜 `SOUL.md`:**
> 당신은 도움이 되는 어시스턴트입니다. 친절하게 행동하세요.

---

` is better than `-할 것`. Let's try that.

**Re-evaluation of Tone:**

*   `- You are a senior engineer's pair programmer, not a junior's tutor.` -> `- 당신은 주니어의 튜터가 아닌, 시니어 엔지

---

**왜 중요한가:** 이 파일은 파워 유저들을 답답하게 만드는, 지나치게 공손하고 장황하며 애매모호한 스타일인 소위 "ChatGPT 말투"를 방지합니다. 이를 통해 모델이 당신의 워크플로에 맞는 특정 페르소

---

## 2. `IDENTITY.md`: 전문적인 역할

`SOUL.md`가 성격이라면, `IDENTITY.md`는 이력서입니다. 이것은 에이전트가 무엇을 *잘하는지* 알려줍니다.

**DevOps 엔지니어 에이전트를 위한 예시:**

```markdown
# 역할: 수석 사이트 신뢰성 엔지니어 (SRE)

---

## 전문성
- Kubernetes, Terraform, AWS 네트워킹 전문가입니다.
- 수동 수정보다는 "Infrastructure as Code" 솔루션을 기본으로 사용합니다.
- 모든 프로덕션 환경은 리스크가 높고 취약하다고 가정합니다.

---

## 멘탈 모델
- 머피의 법칙: 고장 날 수 있는 것은 결국 고장 납니다. 백업부터 먼저 확인하세요.
- 멱등성: 작성하는 모든 스크립트는 두 번 실행해도 안전해야 합니다.
- 보안

---

## 3. `USER.md`: 당신에 대한 컨텍스트

이 파일은 가장 과소평가된 파일입니다. 반복적인 설명을 할 필요가 없게 만들어 줍니다.

**작성 내용:**
*   선호하는 기술 스택 (예: "JS가 아닌 TypeScript를 사용합니다").
*   사용자 환경 정보 (예: "macOS에서 zsh를 사용 중입니다").
*   프로젝트 경로.
*   커뮤니케이션 특징.

**예시:**

```markdown
# User Context: @kingsoft
```

---

## 환경
- OS: macOS Sequoia
- 셸: zsh (oh-my-zsh 사용)
- 에디터: Cursor

---

## 선호 사항
- 저는 JS의 세미콜론을 싫어합니다.
- `npm`보다 `pnpm`을 선호합니다.
- 경고 없이 `rm -rf`를 제안하지 마세요.
- 제가 "deploy"라고 말할 때,

---

## 현재 프로젝트
- /Users/kingsoft/work/frontend (Next.js)
- /Users/kingsoft/work/backend (Go)

**이것이 중요한 이유:** 이제 에이전트는 'deploy'가 'git push'를 의미한다는 것을 압니다. 사용자

---

## "컨텍스트 커널"의 실제 작동 모습

당신이 *"빌드를 수정해줘"*와 같은 메시지를 보내면, OpenClaw는 단순히 "빌드를 수정해줘"라는 문장만 보는 것이 아닙니다.

실제로는 다음 내용을 봅니다

---

*"pnpm-lock.yaml 충돌이 감지되었습니다. macOS를 사용하고 계시므로, `pnpm install --frozen-lockfile`을 실행하여 의존성을 수정하지 않고 안전하게 동기화하세요."*

이는 구체적이고 안전하며, 사용자에게

---

## 설정 방법

이 파일들은 사용자의 OpenClaw 작업 공간 디렉토리(기본값: `~/.openclaw/workspace/`)에 위치하며, `~/.openclaw/`의 설정과는 분리되어 있습니다.

**폴더 구조:**

~/.

---

*   **실패:** "저는 ...가 만든 AI 어시스턴트입니다..."
*   **통과:** "저는 당신의 SRE 페어 프로그래머입니다. 저는 멱등성 인프라 코드에 집중하며, 당신이 macOS에서 pnpm을 선호한다는 것을 알고 있습니다."

만약 당신의 선호도를 다시 언급하지 못한다면, 당신의 마크다운이 너무 모호한 것입니다.

---

---

## Markdown 작성이 귀찮으신가요?

이 파일들을 처음부터 작성하는 것은 번거로운 일일 수 있습니다.

[TinyClaw](https://tinyclaw.dev)에는 **"페르소나 생성기"**가 포함되어 있습니다. 몇 가지 항목