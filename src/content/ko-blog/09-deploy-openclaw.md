---
title: "OpenClaw 배포의 네 가지 방법: Mac Mini, VPS, 클라우드 Pod, 또는 60초 만에 배포하기"
description: "OpenClaw가 이번 주 GitHub 스타 207,000개를 돌파했습니다. 대부분의 튜토리얼에서 빠진 부분 없이, 베어메탈부터 원클릭 클라우드까지 실제로 OpenClaw를 설정하는 방법을 알려드립니다."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "Deployment", "AI Agent", "Mac Mini", "AgentPuter", "TinyClaw", "Tutorial"]
featured: true
---

*에이전트 인프라 시리즈 9부*

---

OpenClaw는 현재 GitHub에서 가장 빠르게 성장하는 오픈소스 AI 프로젝트입니다: 스타 20.7만 개, 포크 3.8만 개, 기여자 683명, 커밋 12,000개 이상. MacStories의 편집장 Federico Viticci는 자신의 인스턴스 "Navi"로 1억 8천만 개의 토큰을 사용했으며 이를 "AI 사용 방식을 바꾼 존재"라고 불렀습니다. 여러 도시의 Apple Store에서 Mac Mini가 품절되었습니다 — 부분적으로는 사람들이 이를 실행하기 위한 전용 상시 가동 머신을 원했기 때문입니다.

여러분도 사용해보고 싶을 겁니다. 문제는 실제로 어떻게 설정하느냐입니다.

기존 튜토리얼은 두 부류로 나뉩니다: `systemd`가 무엇인지 이미 알고 있다고 가정하거나, 아니면 세 단계를 건너뛰어 사용자가 오류 화면만 쳐다보게 만듭니다. 이 가이드는 네 가지 경로를 다룹니다 — 직접 로컬 서버를 구축하는 것부터 60초 이내에 배포하는 것까지 — 여러분의 기술 수준과 우선순위에 맞는 방법을 선택할 수 있도록 말이죠.

**네 가지 경로:**

---

| 경로 | 시간 | 기술 수준 | 최적 대상 |
|------|------|-------------|----------|
| A. Mac Mini | 15–30분 | 터미널 기초 | 개인정보 보호 우선, 완전한 제어 |
| B1. 자체 관리형 VPS | 15–30분 | SSH + Linux 운영 | 개발자, 규정 준수 |
| B2. AgentPuter | ~2분 | 기본 CLI | 다중 에이전트, 제로 DevOps |
| C. TinyClaw | < 1분 | 없음 | 모든 사용자 |

---

---

## 먼저: OpenClaw란 무엇인가? (30초 버전)

OpenClaw는 브라우저에서 방문하는 또 다른 챗봇이 아닙니다. **백그라운드에서 24시간 연중무휴 실행되며** 여러분이 이미 사용하고 있는 메시징 앱 — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (BlueBubbles 경유), Microsoft Teams, WebChat, Matrix 등 — 을 통해 대화하는 **개인 AI 비서**입니다. 12개 채널을 지원하며 계속 추가 중입니다.

ChatGPT와 다른 점은 다음과 같습니다:

- **영구적인 기억력.** OpenClaw에는 *당신*에게 어떤 존재인지를 정의하는 `SOUL.md` 파일이 있습니다 — 당신의 이름, 선호도, 업무 스타일, 시간대 등. 세션이 바뀌어도 기억합니다.
- **현실 세계에서의 행동.** 이메일을 읽고, 캘린더를 관리하고, 파일을 조작하고, 스마트 홈 기기를 제어하고, 리서치를 수행하고, 답장 초안을 작성하는 등의 작업을 자율적으로 수행합니다.
- **음성과 캔버스.** Voice Wake 및 Talk Mode(ElevenLabs 기술 기반)를 통해 핸즈프리로 대화할 수 있습니다. Live Canvas (A2UI)는 시각적인 작업 공간을 제공합니다.
- **로컬 우선.** 당신의 데이터는 당신의 기기에만 저장됩니다. 당신의 대화 내용은 학습에 사용되지 않습니다. 당신이 선택하지 않는 한 제3자 클라우드는 사용되지 않습니다.

---

**실행에 필요한 것:**
- **Node.js 22+**가 실행되는 머신 (macOS, Linux, 또는 WSL2를 통한 Windows)
- AI 모델 구독: **Anthropic API 키 또는 Claude Pro/Max OAuth** (프로젝트 제작자가 강력히 권장), 또는 OpenAI / Google Gemini
- 공식 권장 사항: **Anthropic Pro/Max + Opus 4.6** — 지원되는 모델 중 최고의 긴 컨텍스트 성능 및 가장 강력한 프롬프트 인젝션 저항성

---

---

## 경로 A: Mac Mini — 로컬 서버

**이 경로가 적합한 사용자:** Mac Mini를 가지고 있거나 구매하려는 분. 100% 로컬 제어를 원하시는 분. 데이터 주권(data sovereignty)을 중요하게 생각하시는 분. iMessage 연동과 음성 호출(Voice Wake) 기능을 원하시는 분.

### 하드웨어

Mac Mini M4 기본 모델($599)이면 충분합니다: 16GB 통합 메모리, 256GB 저장 공간. 유휴 상태에서 5–10W의 전력을 소비하며, 이는 연간 전기 요금으로 약 $15에 해당합니다. 조용하고, 항상 켜져 있으며, BlueBubbles를 통해 iMessage를 네이티브로 지원합니다. 이는 어떤 클라우드 배포 환경에서도 불가능한 장점입니다.

리퍼비시 제품을 구매하신다면, 16GB 메모리를 탑재한 M2 모델도 괜찮습니다. 8GB 모델은 피하세요. 사용량이 많을 경우 OpenClaw와 모델의 컨텍스트 창(context window) 크기로 인해 스왑(swap)이 발생할 수 있으며, SSD에서의 스왑은 드라이브 수명을 단축시킵니다.

### 사전 준비 사항

시작하기 전에 다음 사항을 확인하세요:

- [x] macOS 13 (Ventura) 또는 그 이상
- [x] Homebrew 설치 (`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)
- [x] Node.js 22 이상 (`brew install node@22` 실행 후 `node --version`으로 확인)
- [x] Anthropic API 키 또는 OAuth 로그인을 위한 Claude Pro(월 $20) / Max(월 $100) 구독
- [x] Telegram 계정 (가장 쉽게 시작할 수 있는 채널입니다)

### 단계별 설치 방법

**1단계: OpenClaw 전역 설치**

```bash
npm install -g openclaw@latest
```

pnpm (`pnpm add -g openclaw@latest`) 또는 bun을 사용할 수도 있습니다. 세 가지 모두 공식적으로 지원됩니다.

다음과 비슷한 내용으로 끝나는 출력 결과를 확인해야 합니다:

---

12초 만에 1개의 패키지가 추가되었습니다
```

설치를 확인하세요:

```bash
openclaw --version
```

예상 출력: `2026.2.17` (또는 최신 릴리스 번호).

**2단계: 온보딩 마법사 실행**

```bash
openclaw onboard --install-daemon
```

마법사가 대화형으로 모든 과정을 안내합니다:

1. **모델을 선택하세요.** Anthropic Claude를 선택하세요 (권장). Claude Pro/Max 구독이 있는 경우, OAuth 로그인을 선택하세요 — API 키 관리가 필요 없습니다.
2. **API 키를 입력하거나 OAuth를 통해 인증하세요.**
3. **메시징 채널을 선택하세요.** Telegram이 시작하기에 가장 간단합니다. 마법사가 Telegram에서 @BotFather에게 메시지를 보내고, `/newbot`으로 새 봇을 생성한 다음, 토큰을 다시 붙여넣으라고 안내할 것입니다.
4. **백그라운드 데몬을 설치하세요.** macOS에서는 이 명령어가 `launchd` 서비스를 생성하여 OpenClaw가 재부팅 후에도 유지되고 터미널이 닫혀도 실행되도록 합니다.

전체 과정은 약 5분 정도 소요됩니다.

**3단계: 설치 확인**

```bash
openclaw doctor
```

이것은 공식 진단 도구입니다. 이 도구는 Node.js 버전, 게이트웨이 연결성, 채널 구성, 모델 접근성 및 데몬 상태를 확인합니다. 모든 확인 항목에 녹색 체크 표시가 나타나야 합니다. 만약 노란색이나 빨간색 항목이 있다면, doctor가 무엇을 수정해야 할지 정확히 알려줄 것입니다.

**4단계: 첫 번째 장치 페어링하기**

---

Telegram을 열고 새 봇에게 아무 메시지나 보내세요. 봇이 **페어링 코드**로 답장할 것입니다 — 이것은 OpenClaw의 기본 보안 메커니즘입니다. 알 수 없는 발신자는 코드를 받게 되며, 사용자가 승인하기 전까지는 어시스턴트와 상호작용할 수 없습니다.

```bash
openclaw pairing approve telegram <CODE>
```

이제 됐습니다. 이제 봇이 활성화되었습니다. "무엇을 할 수 있니?"라고 보내고 어떻게 반응하는지 보세요.

> **문제 해결:** 봇이 응답하지 않으면, 먼저 `openclaw doctor`를 실행하세요. 일반적인 문제: 데몬이 시작되지 않았거나(다시 `openclaw onboard --install-daemon` 실행), Telegram 토큰에 오타가 있는 경우입니다(`~/.openclaw/openclaw.json` 확인).

### 설치 후

즉시 해야 할 세 가지:

1. **SOUL.md 작성하기.** 아무 텍스트 편집기에서나 `~/.openclaw/workspace/SOUL.md` 파일을 여세요. 이름, 하는 일, 선호하는 소통 방식, 시간대를 알려주세요. 이것은 프롬프트가 아니라 모든 대화에 걸쳐 유지되는 정체성 파일입니다.

2. **도구 연결하기.** Gmail (Pub/Sub 경유), Google Calendar, Notion, Todoist, Slack — OpenClaw는 MCP 도구와 스킬을 통해 연결됩니다. 마법사가 이미 이 중 일부에 대해 입력을 요청했을 수 있습니다.

3. **실제 작업 실행하기.** "농담해 줘" 같은 것으로 시작하지 마세요. "읽지 않은 이메일을 요약하고 우선순위별로 정렬해 줘"나 "내일 내 캘린더에 무슨 일정이 있고, 겹치는 일정은 없어?" 같은 것을 시도해 보세요.

### 실제 비용

---

| 항목 | 비용 |
|------|------|
| 하드웨어 | $599 일회성 (Mac Mini M4 기본 모델) |
| API (보통 사용량) | 월 $15–50 (또는 Claude Pro 구독 시 월 $20) |
| API (많은 사용량) | 월 $100–300 (Viticci 수준) |
| 전기 요금 | 연간 약 $15 |
| 설정 시간 | 15–30분 |

---

---

## 경로 B: 클라우드 배포 — 자체 관리 또는 AgentPuter

**이 경로가 적합한 사용자:** Mac이 없고 Linux나 Windows를 사용하시는 분. 어디서든 어시스턴트에 접속하고 싶으신 분. "노트북이 켜져 있을 때"가 아닌, 진정한 24/7 가동 시간이 필요하신 분.

클라우드 배포에는 두 가지 접근 방식이 있습니다: **자체 서버를 관리**하거나(모든 제어 권한, 모든 책임) **AgentPuter를 사용**하는(AI 에이전트를 위해 특별히 제작된 클라우드 런타임, DevOps 불필요) 것입니다. 두 가지 방법 모두 다루겠습니다.

---

### B1: 자체 관리 VPS

**이 방법이 적합한 사용자:** SSH를 알고 계신 분. 루트 접근 권한을 원하시는 분. 회사에서 자체 호스팅 인프라를 요구하는 경우. 비용 최적화를 원하시는 분.

#### 서버 선택

| 제공업체 | 최소 사양 | 월 비용 |
|----------|-------------|--------------|
| Hetzner | 2 vCPU, 4GB RAM, 20GB SSD | 월 ~$5 |
| DigitalOcean | 2 vCPU, 4GB RAM, 25GB SSD | 월 ~$12 |
| Vultr | 2 vCPU, 4GB RAM, 25GB SSD | 월 ~$12 |

> **경고:** RAM 4GB 미만으로 사용하지 마세요. Docker 환경에서 2GB는 OOM-kill(메모리 부족으로 인한 프로세스 강제 종료)을 유발합니다. 이 점은 저를 믿으셔도 좋습니다.

운영체제: Ubuntu 22.04 LTS.

**Windows 사용자:** VPS가 필요하지 않습니다. OpenClaw는 WSL2를 통해 Windows를 공식적으로 지원하며, README 파일에서는 이를 "강력히 권장"하고 있습니다. WSL2를 설치한 후, 아래의 Linux 지침을 동일하게 따르세요.

#### 옵션 A: 직접 설치 (초보자에게 권장)

```bash
ssh root@your-server-ip
```

---

# Node.js 22 설치
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

# OpenClaw 설치
```bash
npm install -g openclaw@latest
```

# 마법사 실행
```bash
openclaw onboard --install-daemon
```

Linux에서는 데몬이 `launchd` 대신 `systemd` 사용자 서비스로 설치됩니다. 그 외 모든 것은 Mac Mini 경로와 동일하며, 마법사가 이를 처리합니다.

확인:

```bash
openclaw doctor
```

#### 옵션 B: Docker Compose (프로덕션 등급)

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

장점:
- 프로세스 격리 — OpenClaw는 자체 컨테이너에서 실행됩니다
- 단일 명령어로 재시작: `docker compose restart`
- 내장된 로그 관리
- 샌드박스 모드: `sandbox.mode: "non-main"`으로 설정하여 그룹/채널 세션을 격리된 Docker 컨테이너에서 실행

단점:
- Docker Engine 24+ 필요
- 디버깅해야 할 또 다른 추상화 계층

게이트웨이 대시보드는 `http://localhost:18789`에서 사용할 수 있지만, 로컬에서만 가능합니다. 이제 가장 중요한 부분으로 넘어가겠습니다.

#### 원격 액세스: 올바르게 설정하기

> **이것은 선택 사항이 아닙니다.** CVE-2026-25253은 게이트웨이 포트를 인터넷에 직접 노출하면 토큰 탈취가 가능해져 원격 코드 실행으로 이어진다는 것을 보여주었습니다. 절대 그렇게 하지 마십시오.

**권장: Tailscale Serve/Funnel**

Tailscale은 비공개 네트워크 오버레이를 제공합니다. OpenClaw는 이를 최고 수준으로 지원합니다:

---

{
  "gateway": {
    "tailscale": {
      "mode": "serve"
    }
  }
}
```

- `"serve"` — Tailscale 네트워크 내에서만 접근 가능 (가장 안전함)
- `"funnel"` — 공개 HTTPS이지만, 비밀번호 인증이 필요합니다 (`gateway.auth.mode: "password"`)

**대안: SSH 터널**

```bash
ssh -L 18789:localhost:18789 user@your-server-ip
```

그런 다음 로컬 머신에서 `http://localhost:18789`로 대시보드에 접속하세요.

#### 백업

전체 OpenClaw 상태는 `~/.openclaw/`에 저장됩니다:

| 경로 | 내용 |
|------|----------|
| `openclaw.json` | 주 설정 |
| `workspace/` | SOUL.md, AGENTS.md, TOOLS.md, skills/ |
| `credentials/` | 채널 자격 증명 (WhatsApp 세션, Telegram 토큰 등) |

이것을 매일 백업하세요. 간단한 cron 작업으로 충분합니다:

```bash
tar czf ~/openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/
```

#### 자체 관리의 어려움

저는 3개월 동안 자체 관리 VPS에서 OpenClaw를 운영해왔습니다. 제가 배운 점은 다음과 같습니다:

---

- `Node.js`를 설치하고, `systemd`를 구성하고, `Tailscale`을 설정하고, TLS를 직접 처리해야 합니다.
- OAuth 토큰은 만료됩니다. 다른 시간대에서 자고 있다면, 새벽 3시에 WhatsApp 연결이 끊어지고, 일어나서 재인증할 때까지 에이전트는 조용해집니다.
- 서버 재부팅(커널 업데이트, 제공업체 유지보수) 후, `OpenClaw`가 항상 깔끔하게 복구되지는 않습니다. 복구 스크립트를 작성하는 법을 배우게 됩니다.
- 여러 에이전트를 실행하려면 수동으로 프로세스를 격리하고 리소스를 할당해야 합니다.

**한 문장으로 요약하면, 자체 관리형 VPS는 최대의 자유를 제공하지만, 동시에 여러분 자신이 DevOps 팀이 되어야 합니다.**

마지막 문단을 읽고 피곤해졌다면, 다른 방법이 있습니다.

---

### B2: AgentPuter — AI 에이전트를 위해 만들어진 클라우드 런타임

**대상:** DevOps 없이 클라우드 배포를 원하시는 분. 다중 에이전트 지원이 필요하신 분. SLA 보장이 포함된 연중무휴 24시간 안정성을 중요하게 생각하시는 분.

#### AgentPuter란 무엇인가요?

[AgentPuter](https://www.agentputer.com/)는 일반적인 VPS가 아닙니다. 이것은 `OpenClaw`, `ClawBot`, `MoltBot` 및 맞춤형 에이전트와 같은 **AI 에이전트를 위해 특별히 설계된 전용 클라우드 런타임**입니다. "AI 비서를 위한 Heroku"라고 생각하시면 됩니다. 서버, 컨테이너, 데몬을 관리할 필요가 없습니다. 절대 종료되지 않는 ClawPod를 얻게 됩니다.

이는 자체 관리형 VPS의 네 가지 문제점을 해결합니다.

---

| 자체 관리 VPS 문제 | AgentPuter의 해결 방법 |
|--------------------------|-------------------------|
| 서버 재부팅 = 에이전트 오프라인 | Pod는 자동 복구 및 가동 시간 SLA와 함께 24/7 실행 |
| OAuth 토큰 만료 = 수동 재로그인 | 자동 갱신 기능이 있는 서버 측 토큰 관리 |
| 에이전트가 로컬 CPU/메모리 소모 | 클라우드 격리 리소스; 로컬 머신에 영향 없음 |
| 동일한 네트워크에서만 접근 가능 | 어디서든 모든 기기에서 에이전트 제어 |

#### 3단계 배포

```bash
# 1단계: Pod 생성
agentputer create openclaw
# → 클라우드 환경 할당, 구성 선택

# 2단계: 서비스 연결
agentputer connect
# → Google, Notion, Slack 등 인증. 자격 증명은 Pod 내에 안전하게 저장

# 3단계: OpenClaw 배포
agentputer deploy openclaw
# → 에이전트가 24/7 작동 시작. WhatsApp, Telegram, Discord — 모든 채널 활성화
```

총 소요 시간: 약 2분.

#### AgentPuter가 뛰어난 이유

---

- **다중 에이전트 병렬 실행.** ClawBot (개인 비서) + MoltBot (캘린더/일정 관리) + 사용자 지정 리서치 에이전트를 동일한 Pod에서 각각 격리된 리소스로 실행합니다.
- **만료되지 않는 인증.** OAuth 토큰은 자동 갱신 기능으로 서버 측에서 유지 관리됩니다. 토큰이 만료되어 새벽 3시에 WhatsApp 연결이 끊기는 일이 없습니다.
- **어디서든 액세스.** 휴대폰, 태블릿, 다른 컴퓨터 등 사용자가 AI를 따라가는 것이 아니라 AI가 사용자를 따라다닙니다.
- **현재 상태:** 얼리 액세스. [agentputer.com](https://www.agentputer.com/)에서 초대 코드를 요청하세요 — 코드는 24시간 이내에 발송됩니다.

#### AgentPuter vs. 자체 관리 VPS

| | 자체 관리 VPS | AgentPuter |
|--|-----------------|------------|
| 배포 시간 | 15–30분 | 약 2분 |
| 운영 | systemd, Tailscale, 백업, TLS를 직접 관리 | 운영 불필요 — Pod 자동 유지 관리 |
| 다중 에이전트 | 수동 격리 | 네이티브 병렬 지원 |
| 인증 관리 | 토큰 만료 수동 처리 | 자동 갱신 |
| 월 비용 | VPS $5–24 + API 수수료 | Pod 구독료 + API 수수료 |
| 제어 권한 | 100% 루트 접근 권한 | Pod 환경으로 제한 |
| 적합 대상 | 숙련된 운영 기술 / 규정 준수 필요 | 단순함을 원하거나 다중 에이전트 사용자 |

---

---

## 경로 C: TinyClaw — 60초 만에, 터미널 없이

**이런 분들께 추천합니다:** 명령줄 도구를 배우고 싶지 않은 분. 서버를 관리하고 싶지 않은 분. AI 어시스턴트를 *설치*하는 것이 아니라 그저 *사용*하고 싶은 분. 지금 바로 사용해보고 싶은 분.

### 이 경로가 존재하는 이유

경로 A는 599달러가 필요하고 Node.js가 무엇인지 알아야 합니다. 경로 B(자체 관리)는 SSH, Docker, Tailscale이 필요합니다. 훨씬 더 간단한 AgentPuter조차도 CLI와 초대 코드가 필요합니다.

대부분의 사람들은 `npm install -g`를 보고 탭을 닫아버립니다.

OpenClaw가 받은 207,000개의 스타는 수요가 진짜임을 증명합니다. 병목 현상은 제품이 아니라 배포 장벽입니다. TinyClaw는 이 장벽을 제거합니다.

### TinyClaw란 무엇인가?

[TinyClaw](https://tinyclaw.dev)는 [AgentPuter](https://www.agentputer.com/) 팀이 만든 소비자용 제품입니다. AgentPuter가 "개발자의 AI 에이전트 클라우드"라면, TinyClaw는 "모두를 위한 AI 에이전트 입문 지점"입니다.

**시작하기 위한 3단계:**

1.  **모델 선택** — Claude Opus 4.6, GPT-5.2, 또는 Gemini 3
2.  **채널 선택** — Telegram (Discord와 WhatsApp은 곧 제공 예정)
3.  **Google로 로그인** → 배포 완료

서버 불필요. SSH 불필요. Node.js 불필요. 터미널 불필요. 인프라는 미리 구성되어 있으며 사용자에게 할당되기를 기다리고 있습니다.

**클릭부터 AI 어시스턴트와의 첫 대화까지: 60초 미만.**

### 활용 방법

배포가 완료되면, TinyClaw에서 호스팅되는 OpenClaw로 다음을 할 수 있습니다:

---

- 이메일 읽기, 요약, 답장 초안 작성
- 캘린더 관리, 알림 설정, 일정 충돌 해결
- 문서 요약, 계약서 초안 작성, 인보이스 생성
- 비용 추적, 가격 비교, 세금 준비 지원
- 경쟁사 조사, 소셜 미디어 게시물 초안 작성, OKR 추적
- 뉴스 피드 모니터링, 여행 예약
- 자연어를 통해 새로운 기능 학습 — 필요한 것을 말하기만 하면 됩니다

### 궁극의 비교

| | Mac Mini | Self-Managed VPS | AgentPuter | TinyClaw |
|--|---------|-----------------|------------|----------|
| 배포 시간 | 15–30분 | 15–30분 | 약 2분 | 1분 미만 |
| 기술 수준 | 터미널 | SSH + 운영 | 기본 CLI | 없음 (GUI 전용) |
| 하드웨어 비용 | $599 | $0 | $0 | $0 |
| 월간 비용 | API만 | VPS + API | Pod + API | 호스팅 + API |
| 데이터 위치 | 100% 로컬 | 사용자의 VPS | AgentPuter 클라우드 | TinyClaw 클라우드 |
| 24/7 안정성 | 사용자의 Mac에 따라 다름 | 사용자의 운영에 따라 다름 | SLA 보장 | SLA 보장 |
| 다중 에이전트 | 수동 구성 | 수동 격리 | 네이티브 병렬 | 단일 에이전트 |
| 인증 관리 | 수동 | 수동 | 자동 새로고침 | 자동 |
| iMessage | 예 (BlueBubbles) | 아니요 | 아니요 | 아니요 |
| 음성 호출 | 예 (macOS 앱) | 아니요 | 아니요 | 아니요 |
| Windows | 아니요 | 예 (WSL2) | 예 (CLI) | 예 (브라우저) |
| 추천 대상 | 개인정보 보호 / 파워 유저 | DevOps / 규정 준수 | 개발자 / 다중 에이전트 | 모든 사용자 |

---

---

## 설정 후: OpenClaw를 장난감에서 직원으로 바꾸는 7단계

어떤 경로를 선택했든, 설치는 시작에 불과합니다. 실제로 유용하게 사용하는 방법은 다음과 같습니다:

### 1. SOUL.md 작성하기

위치: `~/.openclaw/workspace/SOUL.md`

이것은 시스템 프롬프트가 아닙니다. 이것은 정체성 파일입니다. 다음 내용을 알려주세요:
- 당신의 이름, 직책, 그리고 하는 일
- 당신의 소통 스타일 (격식체? 비격식체? 글머리 기호?)
- 당신의 시간대와 근무 시간
- 당신의 선호사항 ("Markdown을 선호합니다", "오전 10시 이전에는 회의를 잡지 마세요")

구체적으로 작성할수록 반복적으로 말할 필요가 줄어듭니다.

### 2. `openclaw doctor` 실행하기

설정 후, 매 업그레이드 후, 그리고 무언가 이상하게 느껴질 때마다 이 명령을 실행하세요. 이 명령은 Node 버전, 게이트웨이 상태, 채널 연결성, 모델 접근성, 데몬 상태 등 모든 것을 확인하고 무엇을 수정해야 할지 정확히 알려줍니다.

### 3. 채팅 명령어 배우기

이 명령어들은 연결된 모든 채널(Telegram, WhatsApp, Slack, Discord)에서 작동합니다:

| 명령어 | 기능 |
|---------|-------------|
| `/status` | 현재 모델, 토큰 사용량, 세션 정보 표시 |
| `/new` 또는 `/reset` | 대화 세션 초기화 |
| `/compact` | 토큰 절약을 위해 컨텍스트 압축 |
| `/think high` | 깊은 사고 모드 활성화 (Opus 4.6) |
| `/verbose on` | 더 자세한 응답 제공 |
| `/usage full` | 각 응답 후 토큰 소비량 표시 |

---

이것들은 매일 사용하는 제어 기능입니다. `/compact`만으로도 긴 대화에서 토큰 비용을 30–40% 절약할 수 있습니다.

### 4. 도구 연결하기

OpenClaw는 MCP (모델 컨텍스트 프로토콜) 도구와 스킬을 사용하여 외부 서비스와 연동합니다:

- **Gmail** — Pub/Sub를 통한 실시간 이메일 알림
- **Google Calendar** — 이벤트 읽기, 생성 및 수정
- **Notion / Todoist / Linear** — 작업 관리
- **Slack** — 채널과 도구로 모두 사용
- **Browser** — OpenClaw가 전용 Chrome 인스턴스를 제어할 수 있음

### 5. 메모리 씨앗 심기

영원히 기억할 초기 컨텍스트를 제공하세요:

> "저는 매주 월요일 오전 10시에 팀 회의가 있습니다. 제 매니저의 이름은 Sarah입니다. 저는 Markdown 형식의 응답을 선호합니다. 저는 Project Atlas의 1분기 출시 작업을 하고 있습니다."

이러한 사실들은 메모리에 지속적으로 저장되어 모든 향후 상호작용에 정보를 제공합니다.

### 6. 실제 워크플로우 실행하기

사소한 질문으로 테스트하지 마세요. 실제 업무를 맡겨보세요:

- "읽지 않은 이메일을 요약하고 우선순위에 따라 정렬해 줘"
- "이번 주 내 캘린더에 무슨 일정이 있어? 겹치는 일정이 있으면 알려줘"
- "[제품]의 상위 5개 경쟁사를 조사하고 비교표를 만들어 줘"
- "[사람]에게서 온 이메일에 대한 답장 초안을 작성해 줘 — 전문적인 톤으로, 회의는 수락하되 대신 목요일을 제안하는 내용으로"

### 7. 커뮤니티 스킬 설치하기

---

config에서 **ClawHub**를 활성화하면 에이전트가 필요에 따라 새로운 스킬을 자동으로 검색하고 설치할 수 있습니다. 또한 [SkillsMP](https://skillsmp.com)에서 수동으로 찾아볼 수도 있습니다 — 이 마켓플레이스에는 Jira 통합부터 항공권 가격 추적에 이르기까지 모든 것을 위한 수천 개의 커뮤니티 기여 스킬이 있습니다.

---

---

## 자주 묻는 질문

**API 비용은 얼마인가요?**
가벼운 사용: 월 약 $15. 보통 사용: 월 $30–50. 많은 사용(Viticci 수준): 월 $100–300. 또는 Claude Pro 구독(월 $20)이나 Max(월 $100)를 사용하면 OAuth를 통해 인증할 수 있어 API 키를 별도로 관리할 필요가 없습니다.

**어떤 모델이 가장 좋은가요?**
프로젝트 제작자는 **Claude Opus 4.6**을 강력히 추천합니다 — 긴 컨텍스트 성능이 가장 뛰어나고 프롬프트 인젝션에 대한 저항력이 가장 강합니다. GPT-5.2와 Gemini 3도 지원됩니다. 이미 구독 중인 모델을 선택하세요.

**보안은 안전한가요?**
기본적으로 OpenClaw는 **DM 페어링**을 사용합니다 — 알 수 없는 발신자는 페어링 코드를 받게 되며, 사용자가 `openclaw pairing approve`로 승인하기 전까지는 어시스턴트와 상호작용할 수 없습니다. 로컬 배포 시 모든 데이터는 사용자 기기에 보관됩니다. 원격 액세스의 경우 Tailscale을 사용하세요 — 게이트웨이 포트(18789)를 인터넷에 직접 노출하지 마세요.

**중국어를 지원하나요?**
네. 기반 모델들이 기본적으로 중국어를 지원합니다. clawd.org.cn에 커뮤니티 문서 사이트가 있으며, DeepSeek, Moonshot Kimi, Qwen과 같은 중국 내 모델과도 작동합니다.

**Windows에서 작동하나요?**
네, WSL2(Windows Subsystem for Linux)를 통해 작동하며, 이는 공식적으로 지원되고 강력히 권장되는 방법입니다. 또는 TinyClaw를 사용하여 로컬 설정 없이 브라우저 기반으로 사용할 수도 있습니다.

---

**ChatGPT Plus와 어떻게 다른가요?**
ChatGPT는 사용자가 방문하기를 기다립니다. OpenClaw는 WhatsApp, Telegram, Slack 등 사용자가 어디에 있든 먼저 다가갑니다. ChatGPT는 세션 간에 지속적인 메모리가 없지만, OpenClaw는 있습니다. ChatGPT는 사용자의 파일이나 이메일에 대해 작업할 수 없지만, OpenClaw는 할 수 있습니다. ChatGPT는 Voice Wake나 Live Canvas를 지원하지 않지만, OpenClaw는 지원합니다.

**문제가 발생했습니다. 이제 어떻게 해야 하나요?**
`openclaw doctor`를 실행하세요. 자동으로 문제를 진단하고 맞춤형 해결 방법을 제공합니다. 커뮤니티 Discord에는 5,000명 이상의 활성 회원이 있어 특수한 경우에 도움을 받을 수 있습니다.

**어떻게 업데이트하나요?**
```bash
openclaw update --channel stable
```
최신 기능을 원하신다면 `beta`와 `dev` 채널도 있습니다.

---

---

## 맺음말

네 가지 경로, 하나의 목적지: 당신만의 24/7 AI 어시스턴트.

- **Mac Mini**: 완전한 제어, 음성 깨우기(Voice Wake), iMessage를 원하는 파워 유저에게 적합합니다.
- **자체 관리형 VPS**: 루트 접근 권한과 최대의 유연성을 원하는 개발자에게 적합합니다.
- **[AgentPuter](https://www.agentputer.com/)**: 클라우드 안정성, 다중 에이전트 지원, DevOps 작업이 전혀 필요 없는 환경을 원할 때 적합합니다.
- **[TinyClaw](https://tinyclaw.dev)**: 그냥 작동하기만 하면 될 때 — 60초, 터미널 필요 없음.

이 경로들은 상호 배타적이지 않습니다. TinyClaw로 시작하여 1분 안에 OpenClaw를 경험하고, 여러 에이전트를 실행하고 싶을 때 AgentPuter로 전환하며, 완전한 제어를 원할 준비가 되면 최종적으로 Mac Mini에서 완전히 독립적인 설정을 구축할 수 있습니다.

이것은 저희 에이전트 인프라 시리즈의 9부입니다. 저희는 [에이전트에게 왜 자체 컴퓨터가 필요한지](/blog/agent-needs-its-own-computer/), OpenClaw의 [아키텍처](/blog/dissecting-openclaw-architecture/), [기술 생태계](/blog/agent-skills-ecosystem/), [엔터프라이즈 워크플로우](/blog/vibe-working-when-agents-work/), [ClawdBot 심층 분석](/blog/deep-dive-clawdbot-breakout-agent/), [비즈니스 모델](/blog/who-makes-money-from-openclaw/), 그리고 [창시자가 OpenAI에 합류한 것이 무엇을 의미하는지](/blog/openclaw-creator-joins-openai/)에 대해 다루었습니다. 오늘은 "직접 해보기" 장이었습니다.

---

성공적으로 배포하셨다면, 댓글이나 Discord에서 저희에게 알려주세요: **에이전트의 이름을 무엇으로 지으셨고, 처음으로 부여한 실제 작업은 무엇이었나요?**

---

*참고 자료:*
- [OpenClaw GitHub 리포지토리](https://github.com/openclaw/openclaw) (스타 20.7만 개, v2026.2.17)
- [AgentPuter — 여러분의 AI 에이전트를 위한 24/7 클라우드 런타임](https://www.agentputer.com/)
- [TinyClaw — 원클릭 OpenClaw 배포](https://tinyclaw.dev)
- [OpenClaw 공식 문서](https://docs.openclaw.ai)
- CVE-2026-25253 — OpenClaw 게이트웨이 토큰 유출 (저희 보안 분석에서 참조됨)