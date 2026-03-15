---
title: "OpenClaw Power-User-Anleitung: 30 Tipps, die Ihnen niemand verrät"
description: "maxSpawnDepth ist standardmäßig 1, nicht unendlich. SOUL.md ist für Sub-Agenten unsichtbar. cleanup bewahrt Dateien für immer auf, es sei denn, Sie ändern es. 30 praxiserprobte Tipps, um die Lücke zwischen 'funktioniert' und 'gut konfiguriert' zu schließen."
date: "2026-02-21"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "Configuration", "Sub-Agents", "Skills", "Cost Control", "Security", "Tips"]
featured: true
---

---

# OpenClaw Leitfaden für Power-User: 30 Tipps, die Ihnen niemand verrät

*OpenClaw-Community · Februar 2026*

Die meisten Leute installieren OpenClaw, starten einen Agenten und denken, damit sei alles erledigt.

---

Diese 30 Tipps stammen aus dem produktiven Einsatz und einer sorgfältigen Lektüre der offiziellen Dokumentation. Einige sind im Nachhinein offensichtlich. Die meisten sind überhaupt nicht offensichtlich.

---

---

## Inhaltsverzeichnis

1. [Konfigurationsgrundlagen (Tipps 01–08)](#chapter-1)
2. [Skill-Auswahl und -Nutzung (Tipps 09–14)](#chapter-2)
3. [Sub-Agenten-Architektur (Tipps 15–20)](#chapter-3)
4. [Kostenkontrolle (Tipps 21–25)](#chapter-4)
5. [Debugging und Sicherheit (Tipps 26–30)](#chapter-5)
6. [All dies überspringen: TinyClaw](#tinyclaw)

---

---

## Konfigurationsgrundlagen {#chapter-1}

---

### 01. AGENTS.md vs SOUL.md: Wo Sub-Agenten tatsächlich nachsehen

OpenClaw lädt Dateien in einer dreistufigen Hierarchie:

```
~/.openclaw/SOUL.md   ← global
./SOUL.md             ← Projekt
AGENTS.md + TOOLS.md  ← Sitzung (was Sub-Agenten sehen)
```

Sub-

---

Hierüber stolpern viele Leute. Sie schreiben Routing-Logik in `SOUL.md`, stellen eine Fan-Out-Architektur bereit und wundern sich dann eine Stunde lang, warum Sub-Agenten nicht korrekt routen. Sie routen nicht korrekt, weil sie die Anweisungen

---

## Routing
- Finanzfragen → finance-agent
- Code-Review → code-reviewer
- Recherche → research-storm
```

Einfache Regel: Wenn ein Sub-Agent etwas wissen muss, darf es nicht in `SOUL.md` stehen.

---

### 02

---

Gängige Zeichenketten, Stand: Februar 2026:

---

| Modell | Gut für |
|-------|---------|
| `anthropic/claude-opus-4-6` | Alles, was echtes logisches Denken erfordert |
| `anthropic/claude-sonnet-4-6` | Die meisten Dinge – fast Opus-Qualität, viel günstiger |
| `anthropic/claude-haiku-4-5` | Ausführungsaufgaben, bei denen Geschwindigkeit wichtiger ist als Tiefe |
| `google/gemini-3.1-pro-preview` | Lange Dokumente, multimodale Eingaben |
| `openai/gpt-4o-mini` | Zusammenfassung, Klassifizierung, Formatkonvertierung |
| `ollama/qwen2.5` | Alles, was Ihr Netzwerk nicht verlassen darf |

---

Um die globale Standardeinstellung für Sub-Agenten festzulegen:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }

---

OpenClaw liest `.env` automatisch. Es gibt keinen Grund, Schlüssel an einem anderen Ort zu speichern.

---

### 04. `maxSpawnDepth` ist standardmäßig 1

Wenn Sie `SpawnDepthExceeded` gesehen haben und nicht wussten, warum, ist dies

---

Standard ist 1 — eine Ebene von Unter-Agenten. Das Maximum ist 5, aber in der Praxis decken 2 fast jede reale Architektur ab. Blattknoten der Tiefe 2 können keine weiteren erzeugen; der Versuch, tiefer zu gehen, verursacht Laufzeitfehler, deren

---

### 05. Standardwert für runTimeoutSeconds ist 0

Null bedeutet kein Timeout. Ein blockierter Sub-Agent läuft ewig.

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

120 Sekunden reichen für die meisten Aufgaben. Datenintensive Agenten benötigen manchmal 300. Wichtig zu verstehen ist: Das Erreichen des Timeouts stoppt die Ausführung, löscht aber nicht die Sitzung. Dafür benötigen Sie `cleanup` (Tipp 06), und Sie

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

„delete“ ist eine Fehlbezeichnung – es benennt das Transkript in `*.deleted.*` um, anstatt es zu entfernen. Dein Verlauf bleibt erhalten; dein Arbeitsverzeichnis bleibt sauber. Sitzungen, die nicht aufgeräumt werden, bleiben bis zur 60-minütigen automatischen Archivierung liegen, was eine lange Zeit ist, wenn du häufig Agenten ausführst.

---

### 07. Verbinde context7, um zu verhindern, dass Agenten APIs halluzinieren

---

Dies ist der wirkungsvollste MCP, den Sie für Entwicklungs-Workflows hinzufügen können. Agenten fragen offizielle Dokumentation in Echtzeit ab, anstatt auf Basis von Trainingsdaten zu raten, die Monate oder Jahre alt sind.

```json
{
  "m

---

Fragen Sie *„how do Server Actions work in the latest Next.js?“* und Sie erhalten eine aktuelle Dokumentation und nicht etwas aus der Beta-Version von 2023.

---

### 08. TOOLS.md ist Ihre Berechtigungsgrenze

Ohne

---

`deny` überschreibt `allow`. In Multi-Agenten-Setups ist dies wichtiger, als es scheint – wenn eine Fähigkeit kompromittiert wird, ermöglicht eine freizügige `TOOLS.md` die Ausbreitung des Explosionsradius über Ihren gesamten Agent

---

## Skill-Auswahl und -Nutzung {#chapter-2}

---

### 09. Die Sicherheitsbewertung ist keine Dekoration

Sowohl ClawHub als auch agentskills.io zeigen für jeden Skill eine Sicherheitsbewertung an. Lesen Sie sie.

- **A

---

Im Februar 2026 wurden durch den ClawHavoc-Vorfall 341 Skills aus ClawHub entfernt. Sie enthielten Prompt-Injection-Payloads – einige davon so subtil, dass eine manuelle Überprüfung sie übersehen hätte. Die Sicherheitsbewertung ist eine automatisierte Analyse, die das erkennt, was man nicht auf den ersten Blick sieht.

---

### 10. Selbstverbesserung: die

---

`self-improvement` protokolliert Fehler, Korrekturen und Wissenslücken aus jeder Sitzung in `.learnings/ERRORS.md`. Bevor die nächste Sitzung beginnt, liest der Agent diese Datei wieder ein – so weiß er bereits zu Beginn, was beim letzten Mal schiefgelaufen ist.

Keine zusätzliche Einrichtung. Keine zweite Fähigkeit erforderlich. Installieren, dieselbe wiederkehrende Aufgabe zwei Wochen lang ausführen und vergleichen. Der Zinseszinseffekt ist real.

---

### 11. Ladereihenfolge der Fähigkeiten: Später gewinnt

---

Die Ladereihenfolge ist `TOOLS.md` → `AGENTS.md` → `SKILL.md`. Wenn ein Skill ein Tool mit demselben Namen wie ein Eintrag in Ihrer `AGENTS.md` definiert, hat die Version des Skills Vorrang.

Manchmal ist das

---

Die minimal funktionsfähige `SKILL.md` hat drei Abschnitte:

```markdown
# my-skill/SKILL.md
```

---

## Was ich tue
CSV-Verkaufsdaten analysieren und wöchentliche Zusammenfassungen erstellen.

---

## Wann Sie mich einsetzen sollten
Nach Abschluss einer Verkaufsperiode, wenn Sie einen CRM-Export haben.
Nicht für Echtzeitdaten oder Nicht-Vertriebsdatensätze.

---

## Wie ich arbeite
1. Die CSV-Datei von dem in der Aufgabenstellung angegebenen Pfad lesen
2. Gesamtsummen, Top-Performer und das Delta gegenüber der Vorperiode berechnen
3. Als Markdown-Tabelle formatieren
4. Unter output/sales_

---

| | clawhub.ai | agentskills.io |
|-|-----------------|------------------------------------------------|
| Kataloggröße | 3.286 Skills | 19.309 Skills |
| Kuratierung | Sicherheitsgeprüft, kuratiert | Einreichungen

---

`proactive-agent` unterstützt WAL (Absturzwiederherstellung, Kontextpersistenz über Neustarts hinweg), autonome Cron-Planung und Kontextwiederherstellung nach einer Unterbrechung.

Ein konkretes Beispiel, was dies ermöglicht:

```
Zeitplan:

---

Kein Knopf zum Drücken. Kein Mensch im Prozess. Es läuft einfach. Das ist der Punkt, an dem sich Agenten nicht mehr wie Werkzeuge, sondern wie Infrastruktur anfühlen.

---

---

## Sub-Agenten-Architektur {#chapter-3}

---

### 15. Fan-out: die wirkungsvollste Änderung, die die meisten Teams noch nicht vorgenommen haben

Sequenziell:
```
Haupt → Daten abrufen (12s) → Nachrichten zusammenfassen (11s) → Kalender prüfen (7s) → Aufgaben analysieren (5s)
Gesamt: 35 Sekunden
```

---

Fan-Out:
```python
sessions_spawn(task="fetch market data",  label="market-data",    model="anthropic/claude-haiku-4-5")
sessions_spawn(task="summarize news",     label="news-summary",   model="anthropic/claude-haiku-4-5")
sessions_spawn(task="check calendar",     label="cal-check",      model="anthropic/claude-haiku-4-5")
sessions_spawn(task="analyze yesterday",  label="task-analysis",  model="anthropic/claude-haiku-4-5")
# Haupt-Agent arbeitet weiter, alle vier laufen parallel
Gesamt: ~20 Sekunden
```

---

`sessions_spawn` gibt sofort eine `runId` zurück und blockiert nicht. Der Hauptagent läuft weiter. Diese eine Änderung – die Umstrukturierung sequenzieller Arbeit in einen Fan-Out – verringert die Latenz für Workflows im Stil eines Morgen-Briefings um

---

# Überschreibung für die eine Aufgabe, die es tatsächlich benötigt
sessions_spawn(
    task="design the data model for multi-tenant billing",
    label="billing-schema",
    model="anthropic/claude-opus-4-6"
)
```

In der Praxis: Haiku bewältigt über 80 % der Ausführungsaufgaben ohne nennenswerten Qualitätsverlust. Der Kostenunterschied ist real – eine Reduzierung der API-Ausgaben um 50–60 % bei typischen Fan-Out-Architekturen.

---

### 17. Routing-Logik in AGENTS.md, nicht in SOUL.md

---

Es lohnt sich, dies zu wiederholen, da es jedes Mal zu stillen Fehlern führt:

```markdown
# ❌ In SOUL.md – Sub-Agenten können dies nicht sehen
Wenn der Benutzer nach Finanzen fragt, an den Finanz-Agenten delegieren.

---

# ✅
sessions_spawn(
    task="analyze Q4 numbers",
    label="q4-sales-analysis-2026"
)
```

Ohne ein Label liefert Ihnen `/subagents list` eine Wand anonymer Sitzungen. Wenn eine um 3 Uhr morgens fehlschlägt und Sie versuchen herauszufinden, welche es ist, macht das Label den Unterschied zwischen einer Fünf-Sekunden-Diagnose und einem zwanzigminütigen Archäologieprojekt aus.

---

### 19. Sub-Agenten können keine Fragen stellen – formulieren Sie Prompts entsprechend

---

Der `announce`-Mechanismus funktioniert nur in eine Richtung: Der Sub-Agent meldet sich nach Abschluss zurück. Er kann nicht mitten in der Ausführung pausieren, um eine klärende Frage zu stellen.

Das bedeutet, dass dein Task-Prompt alles enthalten muss, was der Agent benötigt:

```python
# ❌ Zu vage – wird Müll oder gar nichts produzieren
sessions_spawn(task="analyze the data", label="analysis")
```

---

# ✅ Eigenständig
sessions_spawn(
    task="""
    Analysiere /data/sales_jan_2026.csv.
    Ausgabe: 1) Monatlicher Gesamtumsatz, 2) Top-5-Produkte nach Einheiten,
    3) MoM-Veränderung im Vergleich zu /data/sales_dec_2025.csv.
    Format: Markdown-Tabelle. Speichere in /output/jan_2026_report.md.
    Wenn eine der Dateien fehlt, schreibe in /output/errors.log und stoppe.
    """,
    label="jan-2026-analysis"
)

---

Stellen Sie es sich so vor, als würden Sie Anweisungen für jemanden schreiben, der in einen Raum geht, die Tür schließt und nicht wieder herauskommen kann, um Sie etwas zu fragen.

---

### 20. Achten Sie auf Ihre Gleichzeitigkeitsgrenzen

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

`maxChildrenPerAgent` begrenzt, wie viele Unter-Agenten ein übergeordneter Agent erzeugen kann (Standard: 5). `maxConcurrent` ist die globale Obergrenze für parallele Agenten (Standard: 8).

---

Das Erreichen eines der beiden Limits führt zu keinem Absturz – die Agenten werden in die Warteschlange gestellt – aber die Latenzzeit erhöht sich. Wenn Sie einen persönlichen API-Plan mit niedrigeren Ratenbegrenzungen haben, vermeiden Sie 429

---

## Kostenkontrolle {#chapter-4}

---

### 21. save-money für automatisches Modell-Routing installieren

```bash
openclaw install save-money
```

Der Skill überwacht die Aufgabenkomplexität und leitet zum günstigsten Modell weiter, das sie bewältigen kann: Haiku für Klassifizierung und Formatierung, Sonnet für Standard-Generierung, Opus für alles, was tatsächliches logisches Denken erfordert. Der Schwellenwert ist konfigurierbar.

---

Benutzer berichten durchweg von einer monatlichen Kostenreduzierung von 50 % und mehr. Das Routing ist nicht perfekt, aber das muss es auch nicht sein – selbst wenn 60 % der Aufgaben an Haiku statt an Opus weitergeleitet werden, summiert sich

---

Am relevantesten für Forschungsagenten, die über mehrere Stunden laufen, iterative Dokumentenbearbeitung und lange Debugging-Sitzungen. Wenn Ihre Agenten regelmäßig an Kontextgrenzen stoßen, schalten Sie dies ein.

---

### 23. openclaw usage: ausführen und es sich wirklich ansehen

```bash
openclaw usage
```

Schlüsselt den Token-Verbrauch nach Sitzung, Modell und Werkzeug auf. Die meisten Leute

---

Worauf Sie achten sollten: ein Sub-Agent, der 5-mal mehr Token als die anderen verbraucht (der Prompt ist zu lang), ein Werkzeug, das 20-mal in einer einzigen Sitzung aufgerufen wird (der Agent befindet sich in einer Schleife), Opus für Aufgaben, die Sonnet bewältigen könnte (falsch konfiguriertes Routing). Es zahlt sich aus, diese Muster zu beheben.

---

### 24. gpt-4o-mini für Zusammenfassungen und Klassifizierungen festlegen

---

{
  "tasks": {
    "summarize": { "model": "openai/gpt-4o-mini" },
    "classify":  { "model": "openai/gpt-4o-mini" },
    "translate": { "model":

---

### 25. Sensible Daten laufen über ein lokales Modell

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

Finanzunterlagen, Mitarbeiterdaten, interne Dokumente – alles, was Ihr Netzwerk nicht verlassen sollte, geht an Ollama. Qwen2.5 läuft gut auf lokaler Hardware (mehrere Größenoptionen von 0,5B bis 72B), unterstützt 128K Kontext und beherrscht Function Calling. Es ist langsamer als Cloud-APIs, aber bei sensiblen Workloads ist das der Kompromiss, den man eingeht.

---

---

## Fehlerbehebung und Sicherheit {#chapter-5}

---

### 26. Zuerst die ausführlichen Protokolle

```bash
openclaw debug --verbose
/subagents log <runId>
```

Das ausführliche Protokoll zeigt jeden Tool-Aufruf,

---

Debuggen Sie nicht nach Hypothesen, wenn Sie einfach nachlesen können, was passiert ist.

---

### 27. Timeout und Fehler sind nicht dasselbe – behandeln Sie sie unterschiedlich

/subagents list

Überprüfen Sie die `status`-Spalte, bevor Sie etwas unter

---

Sie erfordern unterschiedliche Korrekturen. Einen Timeout als Fehler zu behandeln, führt in die falsche Richtung.

---

### 28. Installierte Skills mit clawdefender scannen

```bash
clawdefender scan --all
```

Nach ClawHavoc sollten Sie dies bei

---

Wenn eine Fähigkeit fehlschlägt, deinstalliere sie und suche nach einer Alternative mit einer höheren Sicherheitsbewertung. Es gibt keinen sicheren Weg, einer Fähigkeit, die versucht, Anmeldeinformationen zu exfiltrieren, „teilweise zu vertrauen“.

---

### 29. OAuth-Bereich: Fordere genau das an, was du brauchst

Jeder Bereich, den du gewährst, ist ein Bereich, der missbraucht werden kann, wenn eine Fähigkeit kompromittiert wird:

---

| Nicht anfordern | Stattdessen anfordern |
|-----------------|-----------------------|
| `calendar:*` | `calendar:read` |
| `email:*` | `email:send` |
| `files:readwrite` | `files:read` |
| `contacts:*` | `contacts:read` |

Eine Fähigkeit zum Lesen von Kalendern benötigt keinen Schreibzugriff. Eine Fähigkeit zum Erstellen von E-Mail-Entwürfen muss keine Nachrichten löschen können. Berechtigungsanfragen, die über das hinausgehen, was die Beschreibung der Fähigkeit verspricht, sind ein Warnsignal, das vor der Autorisierung untersucht werden sollte.

---

### 30. Bei TinyClaw ist all dies vorkonfiguriert

---

Die Konfiguration in diesem Leitfaden – Timeout-Einstellungen, Bereinigungsrichtlinien, Modell-Routing, Sicherheitsstandards – ist bereits in TinyClaw integriert. Wenn Sie die Einrichtung lieber überspringen und in weniger als einer Minute eine produktionsbereite Instanz starten möchten:

```
tinyclaw.dev → ein Modell auswählen → einen Kanal auswählen → bereitstellen
```

Die 30 oben genannten Tipps gelten weiterhin, sobald alles läuft. Sie geben Ihnen einen besseren Ausgangspunkt.

---

---

## Überspringen Sie all das: TinyClaw {#tinyclaw}

Die manuelle Einrichtung von OpenClaw dauert ungefähr eine Stunde, wenn man die Schritte kennt:

| Schritt | Zeit |
|------|------|
| Einen Server bereitstellen | 15 Min. |

---

TinyClaw überspringt dies vollständig. Server sind vorab bereitgestellt, die Umgebung ist bereits konfiguriert. Sie wählen drei Dinge aus:

**Modell:** Claude Opus 4.6, GPT-5.2 oder Gemini 3.1 Pro

**Kanal:**

---

- E-Mails lesen und zusammenfassen, Antworten entwerfen
- Besprechungserinnerungen und Erkennung von Terminkonflikten
- Ausgaben anhand von Belegen verfolgen
- Wettbewerber recherchieren, Leads sichten
- Standup-Zusammenfassungen, OKR-Verfolgung
- Verträge, Stellenbeschreibungen und Social-Media-Beiträge entwerfen
- Preisvergleich, Gutscheinsuche

Und alles andere, was Sie in einem Satz beschreiben können. Server-Plätze sind begrenzt – prüfen Sie die Verfügbarkeit auf [tinyclaw.dev](https://tinyclaw.dev).

---

---

## Schnellreferenz

| Kapitel | Tipps | Wann lesen |
|---------|------|-----------|
| Konfiguration | 01–08 | Vor dem Bearbeiten der Konfiguration |
| Fähigkeiten | 09–14 | Bevor Sie etwas installieren |
| Sub-Agenten | 15–20 | Vor dem Erstellen von Multi-Agenten-Workflows |
| Kosten | 21–25 | Nach Ihrem ersten echten Workload |
| Debuggen & Sicherheit | 26–30 | Wenn Probleme auftreten |

---

---

## Ressourcen

- [docs.openclaw.ai](https://docs.openclaw.ai) — offizielle Dokumentation
- [clawhub.ai](https://clawhub.ai) — kuratierte, sicherheitsgeprüfte Skills
- [agentskills.io](https://agentskills.io) — breiterer Katalog, Long-Tail
- [tinyclaw.dev](https://tinyclaw.dev) — One-Click-Bereitstellung
- [agentputer.com](https://agentputer.com) — 24/7 Cloud-Hosting

---

---

*Quellen: OpenClaw-Doku (docs.openclaw.ai) · ClawHub-Sicherheitsdaten (Feb. 2026) · Anthropic-Modell-Doku (docs.anthropic.com) · context7-Doku (context7.com)*