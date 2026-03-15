---
title: "Vier Wege, OpenClaw bereitzustellen: Mac Mini, VPS, Cloud Pod oder in unter 60 Sekunden"
description: "OpenClaw hat diese Woche 207.000 GitHub-Sterne überschritten. Hier erfahren Sie, wie Sie es tatsächlich einrichten – von Bare-Metal bis zur Ein-Klick-Cloud – ohne die Lücken, die die meisten Tutorials hinterlassen."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "Deployment", "AI Agent", "Mac Mini", "AgentPuter", "TinyClaw", "Tutorial"]
featured: true
---

*Teil 9 der Serie über Agenten-Infrastruktur*

---

OpenClaw ist derzeit das am schnellsten wachsende Open-Source-KI-Projekt auf GitHub: 207K Sterne, 38K Forks, 683 Mitwirkende, über 12.000 Commits. MacStories-Redakteur Federico Viticci hat mit seiner Instanz „Navi“ 180 Millionen Token verbraucht und es als „das Ding, das die Art und Weise, wie ich KI nutze, verändert hat“ bezeichnet. Mac Mini-Geräte waren in Apple Stores in mehreren Städten ausverkauft – zum Teil, weil die Leute einen dedizierten, ständig eingeschalteten Rechner wollten, um es laufen zu lassen.

Sie wollen es ausprobieren. Die Frage ist: Wie richtet man es tatsächlich ein?

Die bestehenden Anleitungen lassen sich in zwei Lager einteilen: Entweder setzen sie voraus, dass Sie bereits wissen, was `systemd` ist, oder sie überspringen drei Schritte und lassen Sie auf eine Fehlermeldung starren. Diese Anleitung behandelt vier Wege – vom Aufbau eines eigenen lokalen Servers bis zur Bereitstellung in unter 60 Sekunden –, sodass Sie denjenigen auswählen können, der Ihrem Kenntnisstand und Ihren Prioritäten entspricht.

**Die vier Wege:**

---

| Pfad | Zeit | Kenntnisstand | Am besten für |
|------|------|-------------|----------|
| A. Mac Mini | 15–30 Min. | Terminal-Grundlagen | Datenschutz an erster Stelle, volle Kontrolle |
| B1. Selbstverwalteter VPS | 15–30 Min. | SSH + Linux-Ops | Entwickler, Compliance |
| B2. AgentPuter | ~2 Min. | CLI-Grundlagen | Multi-Agenten, kein DevOps |
| C. TinyClaw | < 1 Min. | Keine | Alle |

---

---

## Zuerst: Was ist OpenClaw? (30-Sekunden-Version)

OpenClaw ist nicht einfach ein weiterer Chatbot, den Sie in einem Browser besuchen. Es ist ein **persönlicher KI-Assistent, der rund um die Uhr (24/7) im Hintergrund läuft** und mit Ihnen über die Messaging-Apps spricht, die Sie bereits verwenden — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (über BlueBubbles), Microsoft Teams, WebChat, Matrix und weitere. Zwölf Kanäle, Tendenz steigend.

Was es von ChatGPT unterscheidet:

- **Dauerhaftes Gedächtnis.** OpenClaw hat eine `SOUL.md`-Datei, die definiert, wer es für *Sie* ist — Ihr Name, Ihre Vorlieben, Ihr Arbeitsstil, Ihre Zeitzone. Es erinnert sich sitzungsübergreifend.
- **Aktionen in der realen Welt.** Es liest Ihre E-Mails, verwaltet Ihren Kalender, arbeitet mit Ihren Dateien, steuert Smart-Home-Geräte, recherchiert und entwirft Antworten — autonom.
- **Stimme und Canvas.** Voice Wake und Talk Mode (unterstützt von ElevenLabs) ermöglichen es Ihnen, freihändig mit ihm zu sprechen. Live Canvas (A2UI) gibt ihm einen visuellen Arbeitsbereich.
- **Local-First.** Ihre Daten bleiben auf Ihrem Gerät. Kein Training mit Ihren Konversationen. Keine Cloud von Drittanbietern, es sei denn, Sie entscheiden sich für eine.

---

**Voraussetzungen:**
- Ein Rechner mit **Node.js 22+** (macOS, Linux oder Windows über WSL2)
- Ein KI-Modell-Abonnement: **Anthropic API-Schlüssel oder Claude Pro/Max OAuth** (vom Ersteller des Projekts dringend empfohlen), oder OpenAI / Google Gemini
- Die offizielle Empfehlung: **Anthropic Pro/Max + Opus 4.6** — beste Long-Context-Performance und stärkste Resistenz gegen Prompt-Injection unter den unterstützten Modellen

---

---

## Pfad A: Mac Mini – Der lokale Server

**Für wen dies ist:** Sie haben (oder möchten) einen Mac Mini. Sie wollen 100 % lokale Kontrolle. Ihnen ist Datensouveränität wichtig. Sie möchten iMessage-Integration und Sprachaktivierung (Voice Wake).

### Hardware

Ein Mac Mini M4 Basismodell (599 $) ist mehr als ausreichend: 16 GB gemeinsamer Arbeitsspeicher, 256 GB Speicher. Er verbraucht 5–10 W im Leerlauf – ungefähr 15 $ pro Jahr an Stromkosten. Er ist leise, immer eingeschaltet und unterstützt nativ iMessage über BlueBubbles, was keine Cloud-Bereitstellung erreichen kann.

Wenn Sie ein generalüberholtes Gerät kaufen, funktioniert ein M2 mit 16 GB ebenfalls gut. Vermeiden Sie 8-GB-Modelle – OpenClaw plus das Kontextfenster des Modells werden bei starker Auslastung auf den Swap-Speicher zugreifen, und die Nutzung von Swap auf einer SSD verkürzt die Lebensdauer des Laufwerks.

### Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes haben:

- [x] macOS 13 (Ventura) oder neuer
- [x] Homebrew installiert (`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)
- [x] Node.js 22+ (`brew install node@22`, dann mit `node --version` überprüfen)
- [x] Ein Anthropic API-Schlüssel oder ein Claude Pro (20 $/Monat) / Max (100 $/Monat) Abonnement für die OAuth-Anmeldung
- [x] Ein Telegram-Konto (der einfachste Kanal für den Anfang)

### Schritt-für-Schritt-Installation

**Schritt 1: OpenClaw global installieren**

```bash
npm install -g openclaw@latest
```

Sie können auch pnpm (`pnpm add -g openclaw@latest`) oder bun verwenden. Alle drei werden offiziell unterstützt.

Sie sollten eine Ausgabe sehen, die mit etwas Ähnlichem wie dem Folgenden endet:

---

1 Paket in 12s hinzugefügt
```

Überprüfen Sie die Installation:

```bash
openclaw --version
```

Erwartete Ausgabe: `2026.2.17` (oder die neueste Versionsnummer).

**Schritt 2: Führen Sie den Onboarding-Assistenten aus**

```bash
openclaw onboard --install-daemon
```

Der Assistent führt Sie interaktiv durch alle Schritte:

1. **Wählen Sie Ihr Modell.** Wählen Sie Anthropic Claude (empfohlen). Wenn Sie ein Claude Pro/Max-Abonnement haben, wählen Sie die OAuth-Anmeldung – keine API-Schlüsselverwaltung erforderlich.
2. **Geben Sie Ihren API-Schlüssel ein oder authentifizieren Sie sich über OAuth.**
3. **Wählen Sie einen Messaging-Kanal.** Telegram ist am einfachsten für den Anfang. Der Assistent wird Sie anweisen, @BotFather auf Telegram eine Nachricht zu senden, mit `/newbot` einen neuen Bot zu erstellen und den Token wieder einzufügen.
4. **Installieren Sie den Hintergrund-Daemon.** Unter macOS erstellt dies einen `launchd`-Dienst, sodass OpenClaw Neustarts übersteht und auch bei geschlossenem Terminal läuft.

Der gesamte Vorgang dauert etwa 5 Minuten.

**Schritt 3: Überprüfen Sie die Installation**

```bash
openclaw doctor
```

Dies ist das offizielle Diagnosewerkzeug. Es überprüft Ihre Node.js-Version, die Gateway-Konnektivität, die Kanalkonfiguration, den Modellzugriff und den Daemon-Status. Jede Überprüfung sollte ein grünes Häkchen anzeigen. Wenn etwas gelb oder rot ist, wird Ihnen der Doctor genau sagen, was zu beheben ist.

**Schritt 4: Koppeln Sie Ihr erstes Gerät**

---

Öffnen Sie Telegram und senden Sie eine beliebige Nachricht an Ihren neuen Bot. Der Bot wird mit einem **Kopplungscode** antworten – dies ist der standardmäßige Sicherheitsmechanismus von OpenClaw. Unbekannte Absender erhalten einen Code; sie können nicht mit Ihrem Assistenten interagieren, bis Sie sie freigeben.

```bash
openclaw pairing approve telegram <CODE>
```

Das war's schon. Ihr Bot ist jetzt aktiv. Senden Sie ihm „Was kannst du tun?“ und sehen Sie zu, wie er antwortet.

> **Fehlerbehebung:** Wenn der Bot nicht antwortet, führen Sie zuerst `openclaw doctor` aus. Häufige Probleme: Der Daemon wurde nicht gestartet (führen Sie `openclaw onboard --install-daemon` erneut aus), oder das Telegram-Token hat einen Tippfehler (überprüfen Sie `~/.openclaw/openclaw.json`).

### Nach der Installation

Drei Dinge, die Sie sofort tun sollten:

1. **Schreiben Sie Ihre SOUL.md.** Öffnen Sie `~/.openclaw/workspace/SOUL.md` in einem beliebigen Texteditor. Teilen Sie ihm Ihren Namen, Ihre Tätigkeit, Ihre Kommunikationspräferenzen und Ihre Zeitzone mit. Dies ist keine Eingabeaufforderung – es ist eine Identitätsdatei, die bei jeder Konversation bestehen bleibt.

2. **Verbinden Sie Ihre Tools.** Gmail (über Pub/Sub), Google Calendar, Notion, Todoist, Slack – OpenClaw verbindet sich über MCP-Tools und Skills. Der Assistent hat Sie möglicherweise bereits nach einigen davon gefragt.

3. **Führen Sie eine echte Aufgabe aus.** Beginnen Sie nicht mit „Erzähl mir einen Witz.“ Versuchen Sie: „Fasse meine ungelesenen E-Mails zusammen und sortiere sie nach Priorität“ oder „Was steht morgen in meinem Kalender und habe ich Terminkonflikte?“

### Tatsächliche Kosten

---

| Posten | Kosten |
|---|---|
| Hardware | $599 einmalig (Mac Mini M4 Basismodell) |
| API (mäßige Nutzung) | $15–50/Monat (oder $20/Monat mit Claude Pro-Abonnement) |
| API (starke Nutzung) | $100–300/Monat (Viticci-Niveau) |
| Strom | ~$15/Jahr |
| Einrichtungszeit | 15–30 Minuten |

---

---

## Pfad B: Cloud-Bereitstellung – Selbstverwaltet oder AgentPuter

**Für wen ist das geeignet:** Sie haben keinen Mac. Sie verwenden Linux oder Windows. Sie möchten von überall auf Ihren Assistenten zugreifen. Sie benötigen eine echte 24/7-Verfügbarkeit, nicht nur „mein Laptop ist an“.

Es gibt zwei Ansätze für die Cloud-Bereitstellung: **einen eigenen Server verwalten** (volle Kontrolle, volle Verantwortung) oder **AgentPuter verwenden** (eine Cloud-Laufzeitumgebung, die speziell für KI-Agenten entwickelt wurde, null DevOps). Wir werden beide behandeln.

---

### B1: Selbstverwalteter VPS

**Für wen ist das geeignet:** Sie kennen sich mit SSH aus. Sie möchten Root-Zugriff. Ihr Unternehmen erfordert eine selbst gehostete Infrastruktur. Sie optimieren auf Kosten.

#### Wählen Sie einen Server

| Anbieter | Mindestspezifikation | Monatliche Kosten |
|----------|-------------|--------------|
| Hetzner | 2 vCPU, 4GB RAM, 20GB SSD | ~$5/Monat |
| DigitalOcean | 2 vCPU, 4GB RAM, 25GB SSD | ~$12/Monat |
| Vultr | 2 vCPU, 4GB RAM, 25GB SSD | ~$12/Monat |

> **Warnung:** Gehen Sie nicht unter 4 GB RAM. Mit Docker wird der Prozess bei 2 GB durch einen OOM-Kill beendet. Vertrauen Sie mir bei diesem Punkt.

OS: Ubuntu 22.04 LTS.

**Windows-Benutzer:** Sie benötigen keinen VPS. OpenClaw unterstützt Windows offiziell über WSL2, und die README-Datei kennzeichnet dies als „dringend empfohlen“. Installieren Sie WSL2 und folgen Sie dann den gleichen Linux-Anweisungen unten.

#### Option A: Direkte Installation (Empfohlen für Anfänger)

```bash
ssh root@your-server-ip
```

---

# Node.js 22 installieren
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# OpenClaw installieren
npm install -g openclaw@latest

# Den Assistenten ausführen
openclaw onboard --install-daemon
```

Unter Linux wird der Daemon als `systemd`-Benutzerdienst anstelle von `launchd` installiert. Alles andere ist identisch mit dem Pfad für den Mac mini – der Assistent kümmert sich darum.

Überprüfen:

```bash
openclaw doctor
```

#### Option B: Docker Compose (Produktionsreif)

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

Vorteile:
- Prozessisolierung – OpenClaw läuft in seinem eigenen Container
- Neustart mit einem Befehl: `docker compose restart`
- Integrierte Protokollverwaltung
- Sandbox-Modus: Setzen Sie `sandbox.mode: "non-main"`, um Gruppen-/Kanalsitzungen in isolierten Docker-Containern auszuführen

Nachteile:
- Erfordert Docker Engine 24+
- Eine weitere Abstraktionsebene zum Debuggen

Das Gateway-Dashboard ist unter `http://localhost:18789` verfügbar – aber nur lokal, was uns zum wichtigsten Teil bringt.

#### Fernzugriff: Machen Sie es richtig

> **Dies ist nicht optional.** CVE-2026-25253 hat gezeigt, dass das direkte Freigeben des Gateway-Ports für das Internet die Exfiltration von Tokens ermöglicht, was zur Remotecodeausführung führt. Tun Sie das nicht.

**Empfohlen: Tailscale Serve/Funnel**

Tailscale bietet Ihnen ein privates Netzwerk-Overlay. OpenClaw hat erstklassige Unterstützung:

---

{
  "gateway": {
    "tailscale": {
      "mode": "serve"
    }
  }
}
```

- `"serve"` — nur innerhalb Ihres Tailscale-Netzwerks erreichbar (am sichersten)
- `"funnel"` — öffentliches HTTPS, erfordert aber eine Passwortauthentifizierung (`gateway.auth.mode: "password"`)

**Alternative: SSH-Tunnel**

```bash
ssh -L 18789:localhost:18789 user@your-server-ip
```

Greifen Sie dann auf das Dashboard unter `http://localhost:18789` auf Ihrem lokalen Rechner zu.

#### Backup

Ihr gesamter OpenClaw-Zustand befindet sich in `~/.openclaw/`:

| Pfad | Inhalt |
|------|----------|
| `openclaw.json` | Hauptkonfiguration |
| `workspace/` | SOUL.md, AGENTS.md, TOOLS.md, skills/ |
| `credentials/` | Kanal-Anmeldeinformationen (WhatsApp-Sitzung, Telegram-Token, etc.) |

Sichern Sie dies täglich. Ein einfacher Cron-Job funktioniert:

```bash
tar czf ~/openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/
```

#### Die Schmerzpunkte der Selbstverwaltung

Ich betreibe OpenClaw seit drei Monaten auf einem selbstverwalteten VPS. Hier ist, was ich gelernt habe:

---

- Sie müssen Node.js installieren, systemd konfigurieren, Tailscale einrichten und TLS selbst verwalten.
- OAuth-Token laufen ab. Wenn Sie in einer anderen Zeitzone schlafen, bricht Ihre WhatsApp-Verbindung um 3 Uhr morgens ab und Ihr Agent verstummt, bis Sie aufwachen und sich erneut authentifizieren.
- Nach einem Server-Neustart (Kernel-Update, Wartung durch den Anbieter) startet OpenClaw nicht immer sauber neu. Sie lernen, Wiederherstellungsskripte zu schreiben.
- Das Ausführen mehrerer Agenten erfordert manuelle Prozessisolierung und Ressourcenzuweisung.

**In einem Satz: Ein selbstverwalteter VPS gibt Ihnen maximale Freiheit, aber Sie sind auch Ihr eigenes DevOps-Team.**

Wenn der letzte Absatz Sie müde gemacht hat, gibt es einen anderen Weg.

---

### B2: AgentPuter – Eine Cloud-Laufzeitumgebung für KI-Agenten

**Für wen dies ist:** Sie möchten eine Cloud-Bereitstellung ohne DevOps. Sie benötigen Unterstützung für mehrere Agenten. Ihnen ist eine 24/7-Zuverlässigkeit mit SLA-Garantien wichtig.

#### Was ist AgentPuter?

[AgentPuter](https://www.agentputer.com/) ist kein generischer VPS. Es ist eine **dedizierte Cloud-Laufzeitumgebung, die speziell für KI-Agenten entwickelt wurde** – OpenClaw, ClawBot, MoltBot und benutzerdefinierte Agenten. Stellen Sie es sich als „Heroku für KI-Assistenten“ vor: Sie verwalten weder den Server, noch den Container oder den Daemon. Sie erhalten einen Pod, der niemals herunterfährt.

Es löst die vier Schmerzpunkte eines selbstverwalteten VPS:

---

| Problem bei selbstverwalteten VPS | Wie AgentPuter es löst |
|--------------------------|-------------------------|
| Server-Neustarts = Agent offline | Pod läuft rund um die Uhr mit automatischer Wiederherstellung und Uptime-SLA |
| OAuth-Token laufen ab = manuelle Neuanmeldung | Serverseitige Token-Verwaltung mit automatischer Aktualisierung |
| Agenten verbrauchen lokale CPU/Speicher | In der Cloud isolierte Ressourcen; Ihr lokaler Rechner bleibt unberührt |
| Zugriff nur aus demselben Netzwerk | Steuern Sie Ihre Agenten von jedem Gerät und von überall aus |

#### Bereitstellung in drei Schritten

```bash
# Schritt 1: Erstellen Sie Ihren Pod
agentputer create openclaw
# → Weist eine Cloud-Umgebung zu, wählen Sie Ihre Konfiguration

# Schritt 2: Verbinden Sie Ihre Dienste
agentputer connect
# → Autorisieren Sie Google, Notion, Slack, etc. Anmeldedaten werden sicher im Pod gespeichert

# Schritt 3: Stellen Sie OpenClaw bereit
agentputer deploy openclaw
# → Ihr Agent beginnt, rund um die Uhr zu arbeiten. WhatsApp, Telegram, Discord – alle Kanäle sind live
```

Gesamtdauer: ca. 2 Minuten.

#### Warum sich AgentPuter abhebt

---

- **Parallele Multi-Agenten-Ausführung.** Führen Sie ClawBot (persönlicher Assistent) + MoltBot (Kalender/Terminplanung) + einen benutzerdefinierten Recherche-Agenten im selben Pod aus, jeder mit isolierten Ressourcen.
- **Nie ablaufende Authentifizierung.** OAuth-Tokens werden serverseitig mit automatischer Aktualisierung verwaltet. Ihre WhatsApp-Verbindung wird nicht um 3 Uhr morgens unterbrochen, weil ein Token abgelaufen ist.
- **Zugriff von überall.** Smartphone, Tablet, ein anderer Computer — Ihre KI folgt Ihnen, nicht umgekehrt.
- **Aktueller Status:** Early Access. Fordern Sie einen Einladungscode auf [agentputer.com](https://www.agentputer.com/) an — Codes werden innerhalb von 24 Stunden versendet.

#### AgentPuter vs. selbstverwalteter VPS

| | Selbstverwalteter VPS | AgentPuter |
|--|-----------------|------------|
| Bereitstellungszeit | 15–30 Minuten | ~2 Minuten |
| Betrieb | Sie verwalten systemd, Tailscale, Backup, TLS | Kein Betrieb — Pod wird automatisch gewartet |
| Multi-Agenten | Manuelle Isolierung | Native parallele Unterstützung |
| Auth-Verwaltung | Ablauf von Tokens manuell handhaben | Automatische Aktualisierung |
| Monatliche Kosten | VPS $5–24 + API-Gebühren | Pod-Abonnement + API-Gebühren |
| Kontrolle | 100 % Root-Zugriff | Beschränkt auf die Pod-Umgebung |
| Am besten für | Starke Ops-Kenntnisse / Compliance | Einfachheit / Multi-Agenten-Nutzer |

---

---

## Pfad C: TinyClaw – 60 Sekunden, kein Terminal

**Für wen dies ist:** Sie möchten keine Kommandozeilen-Tools lernen. Sie möchten keine Server verwalten. Sie möchten einen KI-Assistenten einfach nur *nutzen*, nicht *installieren*. Sie möchten es sofort ausprobieren.

### Warum dieser Pfad existiert

Pfad A erfordert 599 $ und das Wissen, was Node.js ist. Pfad B (selbstverwaltet) erfordert SSH, Docker und Tailscale. Selbst AgentPuter, obwohl viel einfacher, erfordert immer noch eine CLI und einen Einladungscode.

Die meisten Leute sehen `npm install -g` und schließen den Tab.

Die 207.000 Sterne von OpenClaw beweisen, dass die Nachfrage real ist. Der Engpass ist nicht das Produkt – es ist die Bereitstellungshürde. TinyClaw beseitigt sie.

### Was ist TinyClaw?

[TinyClaw](https://tinyclaw.dev) ist das für Endverbraucher entwickelte Produkt, das vom [AgentPuter](https://www.agentputer.com/)-Team erstellt wurde. Wenn AgentPuter „die KI-Agenten-Cloud für Entwickler“ ist, dann ist TinyClaw „der Einstiegspunkt für jedermanns KI-Agenten“.

**Drei Schritte zum Start:**

1. **Wählen Sie Ihr Modell** – Claude Opus 4.6, GPT-5.2 oder Gemini 3
2. **Wählen Sie Ihren Kanal** – Telegram (Discord und WhatsApp bald verfügbar)
3. **Mit Google anmelden** → Bereitstellung abgeschlossen

Kein Server. Kein SSH. Kein Node.js. Kein Terminal. Die Infrastruktur ist vorkonfiguriert und wartet darauf, Ihnen zugewiesen zu werden.

**Vom Klick bis zum ersten Gespräch mit Ihrem KI-Assistenten: unter 60 Sekunden.**

### Was Sie damit tun können

Einmal bereitgestellt, kann Ihr von TinyClaw gehostetes OpenClaw:

---

- Lesen, zusammenfassen und Entwürfe für Antworten auf Ihre E-Mails erstellen
- Ihren Kalender verwalten, Erinnerungen einstellen, Terminkonflikte lösen
- Dokumente zusammenfassen, Verträge entwerfen, Rechnungen erstellen
- Ausgaben verfolgen, Preise vergleichen, bei der Steuervorbereitung helfen
- Wettbewerbsrecherchen durchführen, Social-Media-Beiträge entwerfen, OKRs verfolgen
- Nachrichten-Feeds überwachen, Reisen buchen
- Neue Fähigkeiten durch natürliche Sprache erlernen – sagen Sie ihm einfach, was Sie brauchen

### Der ultimative Vergleich

| | Mac Mini | Selbstverwalteter VPS | AgentPuter | TinyClaw |
|--|---------|-----------------|------------|----------|
| Bereitstellungszeit | 15–30 Min. | 15–30 Min. | ~2 Min. | < 1 Min. |
| Technische Kenntnisse | Terminal | SSH + Ops | Grundlegende CLI | Keine (nur GUI) |
| Hardwarekosten | 599 $ | 0 $ | 0 $ | 0 $ |
| Monatliche Kosten | Nur API | VPS + API | Pod + API | Hosting + API |
| Datenspeicherort | 100 % lokal | Ihr VPS | AgentPuter-Cloud | TinyClaw-Cloud |
| 24/7-Zuverlässigkeit | Hängt von Ihrem Mac ab | Hängt von Ihren Ops ab | SLA-gestützt | SLA-gestützt |
| Multi-Agenten | Manuelle Konfig. | Manuelle Isolierung | Nativ parallel | Einzelner Agent |
| Auth-Verwaltung | Manuell | Manuell | Auto-Aktualisierung | Automatisch |
| iMessage | Ja (BlueBubbles) | Nein | Nein | Nein |
| Sprachaktivierung | Ja (macOS-App) | Nein | Nein | Nein |
| Windows | Nein | Ja (WSL2) | Ja (CLI) | Ja (Browser) |
| Am besten für | Datenschutz / Power-User | DevOps / Compliance | Entwickler / Multi-Agenten | Jeden |

---

---

## Nach der Einrichtung: 7 Schritte, um Ihren OpenClaw vom Spielzeug zum Mitarbeiter zu machen

Unabhängig davon, welchen Weg Sie gewählt haben, ist die Installation nur der Anfang. So machen Sie es wirklich nützlich:

### 1. Schreiben Sie Ihre SOUL.md

Speicherort: `~/.openclaw/workspace/SOUL.md`

Dies ist kein System-Prompt. Es ist eine Identitätsdatei. Teilen Sie ihm mit:
- Ihren Namen, Ihre Berufsbezeichnung und was Sie tun
- Ihren Kommunikationsstil (formell? locker? Stichpunkte?)
- Ihre Zeitzone und Arbeitszeiten
- Ihre Vorlieben („Ich bevorzuge Markdown“, „Planen Sie niemals Meetings vor 10 Uhr“)

Je spezifischer Sie sind, desto seltener müssen Sie sich wiederholen.

### 2. Führen Sie `openclaw doctor` aus

Führen Sie dies nach der Einrichtung, nach jedem Upgrade und immer dann aus, wenn sich etwas nicht richtig anfühlt. Es überprüft alles — Node-Version, Gateway-Zustand, Kanal-Konnektivität, Modellzugriff, Daemon-Status — und sagt Ihnen genau, was zu beheben ist.

### 3. Lernen Sie die Chat-Befehle

Diese funktionieren in jedem verbundenen Kanal — Telegram, WhatsApp, Slack, Discord:

| Befehl | Was er bewirkt |
|---------|-------------|
| `/status` | Zeigt aktuelles Modell, Token-Nutzung, Sitzungsinformationen |
| `/new` oder `/reset` | Setzt die Konversationssitzung zurück |
| `/compact` | Komprimiert den Kontext, um Tokens zu sparen |
| `/think high` | Aktiviert den Modus für tiefes Nachdenken (Opus 4.6) |
| `/verbose on` | Detailliertere Antworten |
| `/usage full` | Zeigt den Token-Verbrauch nach jeder Antwort an |

---

Dies sind Ihre täglichen Steuerelemente. Allein `/compact` kann Ihnen bei langen Unterhaltungen 30–40 % der Token-Kosten einsparen.

### 4. Verbinden Sie Ihre Tools

OpenClaw verwendet MCP (Model Context Protocol) Tools und Skills, um sich mit externen Diensten zu integrieren:

- **Gmail** — über Pub/Sub für Echtzeit-E-Mail-Benachrichtigungen
- **Google Calendar** — Termine lesen, erstellen und ändern
- **Notion / Todoist / Linear** — Aufgabenverwaltung
- **Slack** — sowohl als Kanal als auch als Tool
- **Browser** — OpenClaw kann eine dedizierte Chrome-Instanz steuern

### 5. Pflanzen Sie Gedächtnis-Samen

Geben Sie ihm anfänglichen Kontext, an den es sich für immer erinnern wird:

> „Ich habe jeden Montag um 10 Uhr ein Team-Meeting. Der Name meiner Managerin ist Sarah. Ich bevorzuge Antworten in Markdown. Ich arbeite am Q1-Launch für Projekt Atlas.“

Diese Fakten bleiben im Gedächtnis und beeinflussen jede zukünftige Interaktion.

### 6. Führen Sie einen echten Workflow aus

Testen Sie nicht mit Trivialitäten. Geben Sie ihm Arbeit:

- „Fassen Sie meine ungelesenen E-Mails zusammen und sortieren Sie sie nach Priorität“
- „Was steht diese Woche in meinem Kalender? Markieren Sie alle Konflikte“
- „Recherchieren Sie die Top-5-Wettbewerber für [Produkt] und erstellen Sie mir eine Vergleichstabelle“
- „Entwerfen Sie eine Antwort auf die E-Mail von [Person] – professioneller Ton, akzeptieren Sie das Meeting, aber schlagen Sie stattdessen den Donnerstag vor“

### 7. Installieren Sie Community-Skills

---

Aktivieren Sie **ClawHub** in Ihrer Konfiguration und Ihr Agent kann bei Bedarf automatisch nach neuen Skills suchen und diese installieren. Sie können auch manuell auf [SkillsMP](https://skillsmp.com) stöbern — der Marktplatz bietet Tausende von der Community beigesteuerte Skills für alles, von der Jira-Integration bis zur Flugpreisverfolgung.

---

---

## FAQ

**Wie viel kostet die API?**
Geringe Nutzung: ~$15/Monat. Mäßige Nutzung: $30–50/Monat. Starke Nutzung (Viticci-Niveau): $100–300/Monat. Alternativ ermöglicht ein Claude Pro-Abonnement ($20/Monat) oder Max ($100/Monat) die Authentifizierung über OAuth, ohne API-Schlüssel separat verwalten zu müssen.

**Welches Modell ist am besten?**
Der Ersteller des Projekts empfiehlt dringend **Claude Opus 4.6** – es hat die beste Leistung bei langem Kontext und die stärkste Widerstandsfähigkeit gegen Prompt-Injection. GPT-5.2 und Gemini 3 werden ebenfalls unterstützt. Wählen Sie das Modell, für das Sie bereits ein Abonnement haben.

**Ist es sicher?**
Standardmäßig verwendet OpenClaw **DM-Pairing** – jeder unbekannte Absender erhält einen Kopplungscode und kann nicht mit Ihrem Assistenten interagieren, bis Sie ihn mit `openclaw pairing approve` genehmigen. Lokale Bereitstellungen speichern alle Daten auf Ihrem Rechner. Für den Fernzugriff verwenden Sie Tailscale – setzen Sie den Gateway-Port (18789) niemals direkt dem Internet aus.

**Unterstützt es Chinesisch?**
Ja. Die zugrundeliegenden Modelle unterstützen Chinesisch nativ. Es gibt eine Community-Dokumentationsseite unter clawd.org.cn, und es funktioniert mit einheimischen Modellen wie DeepSeek, Moonshot Kimi und Qwen.

**Funktioniert es unter Windows?**
Ja, über WSL2 (Windows-Subsystem für Linux) – offiziell unterstützt und dringend empfohlen. Oder verwenden Sie TinyClaw für eine browserbasierte Erfahrung ohne lokale Einrichtung.

---

**Worin unterscheidet sich das von ChatGPT Plus?**
ChatGPT wartet darauf, dass Sie es besuchen. OpenClaw kontaktiert Sie – über WhatsApp, Telegram, Slack, wo auch immer Sie sind. ChatGPT hat kein sitzungsübergreifendes persistentes Gedächtnis; OpenClaw schon. ChatGPT kann nicht mit Ihren Dateien oder E-Mails arbeiten; OpenClaw schon. ChatGPT unterstützt kein Voice Wake oder Live Canvas; OpenClaw schon.

**Etwas ist schiefgelaufen. Was nun?**
Führen Sie `openclaw doctor` aus. Es führt eine automatische Diagnose durch und gibt gezielte Anweisungen zur Fehlerbehebung. Der Community-Discord hat über 5.000 aktive Mitglieder, die bei Randfällen helfen können.

**Wie kann ich aktualisieren?**
```bash
openclaw update --channel stable
```
Es gibt auch `beta`- und `dev`-Channels, wenn Sie topaktuelle Funktionen wünschen.

---

---

## Abschließende Gedanken

Vier Wege, ein Ziel: Ihr eigener 24/7 KI-Assistent.

- **Mac Mini**, wenn Sie ein Power-User sind, der volle Kontrolle, Voice Wake und iMessage wünscht.
- **Selbstverwalteter VPS**, wenn Sie ein Entwickler sind, der Root-Zugriff und maximale Flexibilität wünscht.
- **[AgentPuter](https://www.agentputer.com/)**, wenn Sie Cloud-Zuverlässigkeit, Multi-Agenten-Unterstützung und null DevOps wünschen.
- **[TinyClaw](https://tinyclaw.dev)**, wenn Sie einfach nur wollen, dass es funktioniert – 60 Sekunden, kein Terminal.

Diese Wege schließen sich nicht gegenseitig aus. Sie können mit TinyClaw beginnen, um OpenClaw in weniger als einer Minute zu erleben, zu AgentPuter wechseln, wenn Sie mehrere Agenten ausführen möchten, und schließlich ein vollständig souveränes Setup auf einem Mac Mini aufbauen, wenn Sie bereit für die vollständige Kontrolle sind.

Dies ist Teil 9 unserer Serie zur Agenten-Infrastruktur. Wir haben behandelt, [warum Ihr Agent seinen eigenen Computer benötigt](/blog/agent-needs-its-own-computer/), die [Architektur](/blog/dissecting-openclaw-architecture/) von OpenClaw, das [Ökosystem der Fähigkeiten](/blog/agent-skills-ecosystem/), [Unternehmens-Workflows](/blog/vibe-working-when-agents-work/), den [Deep Dive zu ClawdBot](/blog/deep-dive-clawdbot-breakout-agent/), [Geschäftsmodelle](/blog/who-makes-money-from-openclaw/) und [was es bedeutet, wenn sein Schöpfer zu OpenAI wechselt](/blog/openclaw-creator-joins-openai/). Heute war das „Do-it-yourself“-Kapitel.

---

Wenn du erfolgreich bereitgestellt hast, erzähl es uns in den Kommentaren oder auf Discord: **wie hast du deinen Agenten genannt und was war die erste echte Aufgabe, die du ihm gegeben hast?**

---

*Referenzen:*
- [OpenClaw GitHub-Repository](https://github.com/openclaw/openclaw) (207K Sterne, v2026.2.17)
- [AgentPuter – Die 24/7-Cloud-Laufzeitumgebung deines KI-Agenten](https://www.agentputer.com/)
- [TinyClaw – Ein-Klick-OpenClaw-Bereitstellung](https://tinyclaw.dev)
- [OpenClaw Offizielle Dokumentation](https://docs.openclaw.ai)
- CVE-2026-25253 – OpenClaw Gateway-Token-Exfiltration (referenziert in unserer Sicherheitsanalyse)