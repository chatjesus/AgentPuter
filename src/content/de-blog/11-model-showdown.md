---
title: "Der KI-Gehirn-Showdown: Gemini 3.1 Pro ist da. Welches Modell betreibt den besten OpenClaw Agenten?"
description: "Gemini 3.1 Pro erreichte 69,2 % auf MCP Atlas – dem Benchmark, der speziell dafür entwickelt wurde, die Fähigkeiten von OpenClaw zu testen. Claude Opus 4.6 ist weiterhin die offizielle Empfehlung. Wir analysieren fünf Benchmarks, fünf Modelle und welche Konfiguration für Ihren tatsächlichen Arbeitsablauf am besten geeignet ist."
date: "2026-02-19"
author: "AgentPuter Lab"
readingTime: "14 min"
tags: ["OpenClaw", "Gemini 3.1 Pro", "Claude Opus 4.6", "Claude Sonnet 4.6", "MCP Atlas", "AI Models", "Benchmark"]
featured: true
---

# Der KI-Gehirn-Showdown: Gemini 3.1 Pro ist da. Welches Modell betreibt den besten OpenClaw Agenten?

---

**Vor zwei Tagen hat Anthropic Claude Sonnet 4.6 veröffentlicht. Gestern hat Google Gemini 3.1 Pro veröffentlicht. Der Benchmark, der für OpenClaw-Nutzer wirklich zählt, zeigt einen überraschenden Gewinner – und er löst eine echte Debatte aus.**

*Agent-Infrastruktur-Reihe · Teil 11 | Recherchedatum: 19. Februar 2026*

---

Vor zwei Tagen – am 17. Februar – hat Anthropic Claude Sonnet 4.6 veröffentlicht.

Gestern – am 19. Februar – hat Google Gemini 3.1 Pro veröffentlicht.

Die Benchmark-Tabelle, die Google zusammen mit der Veröffentlichung publiziert hat, hat weite Kreise gezogen. Eine Zeile im Besonderen ließ OpenClaw-Nutzer mitten im Scrollen innehalten: **MCP Atlas**.

---

MCP Atlas ist ein Benchmark, der vom Forschungsteam von Scale AI entwickelt wurde (arxiv 2602.00933). Er verwendet 36 echte MCP-Server, 220 Tools und 1.000 Aufgaben, die speziell dafür entwickelt wurden, zu bewerten, wie gut ein KI-Modell mehrstufige Tool-Aufrufe

---

Beides trifft gleichzeitig zu. Hier ist der Grund dafür – und was das für die heutige Konfiguration Ihres Agenten bedeutet.

---

---

## Zuerst: Die meisten Benchmarks stellen die falsche Frage

Bevor wir Modelle vergleichen, müssen wir festlegen, was gemessen werden soll. Die Standard-KI-Benchmarks – Humanity's Last Exam, GPQA Diamond, MMLU – testen den Wissensabruf und das logische Denken zu akademischen Themen. Für einen Allzweck-Chatbot sind diese wichtig. Für einen OpenClaw-Agenten, der Ihre E-Mails, Ihren Kalender, Ihre GitHub-Repos und Ihren Browser verwaltet, sind sie fast irrelevant.

Die Benchmarks, die tatsächlich die Leistung von Agenten vorhersagen:

---

| Benchmark | Was es testet | OpenClaw-Relevanz |
|-----------|--------------|-------------------|
| **MCP Atlas** | Serverübergreifende Werkzeugerkennung, -auswahl und mehrstufige Orchestrierung (36 echte MCP-Server, 220 Werkzeuge) | ★★★★★ Das ist buchstäblich, was OpenClaw Skills tun |
| **APEX-Agents** | Langfristige, mehrstufige professionelle Aufgaben | ★★★★★ Reale Agenten-Workflows |
| **τ2-bench** | Stabilität der Werkzeugnutzung in Einzelhandels- und Telekommunikationssimulationen | ★★★★★ Produktionszuverlässigkeit |
| **GDPval-AA Elo** | ELO für Expertenaufgaben bei hochwertiger Wissensarbeit | ★★★★ Zusammengesetzte professionelle Leistung |
| **BrowseComp** | Agentenbasierte Websuche mit mehrstufigem logischem Denken | ★★★★ Browser- und Such-Skills |
| Terminal-Bench 2.0 | Genauigkeit bei der Ausführung von Terminal-Befehlen | ★★★★ Systemadministrations-Skills |
| SWE-Bench Verified | Fehlerbehebung im Code in einem einzigen Versuch | ★★★ Programmier-Skills (nützlich, aber nicht primär) |
| ARC-AGI-2 | Neuartige abstrakte Logikmuster | ★★★ Komplexe Planungsaufgaben |
| GPQA Diamond / MMLU | Wissensabruf auf Hochschulniveau | ★★ OpenClaw legt keine Prüfungen ab |

---

Mit diesem Filter sieht der tatsächliche Vergleich der Konkurrenten so aus.

---

---

## Die Konkurrenten

### Gemini 3.1 Pro – Der neue Herausforderer

Gestern (19. Februar) veröffentlicht, ist Gemini 3.1 Pro Googles verbesserte Kern-Reasoning-Ebene – die Intelligenz, die Gemini Deep Think antreibt und jetzt für Entwickler über die Gemini API, Vertex AI und Google AI Studio eingeführt wird.

**Wo es führend ist:**

---

- **MCP Atlas: 69,2 %** — höchster Wert aller getesteten Modelle, fast 10 Punkte vor Claude Opus 4.6 (59,5 %)
- **APEX-Agents: 33,5 %** — höchster Wert aller getesteten Modelle
- **SWE-Bench Verified: 80,6 %** — praktisch gleichauf mit Claude Opus 4.6 (80,8 %) bei der Zuverlässigkeit beim Codieren
- **BrowseComp: 85,9 %** — höchster Wert aller getesteten Modelle (alle Modelle wurden mit werkzeuggestütztem Browsing bewertet: Suche + Python + Browsen)
- **ARC-AGI-2: 77,1 %** — mehr als doppelt so hoch wie die 31,1 % von Gemini 3 Pro, deutlich vor Opus 4.6 (68,8 %)
- **1M-Token-Kontextfenster** — entspricht der Kontextgröße von Claude; keine Context Compaction API

**Wo es Schwächen zeigt:**

---

- **GDPval-AA Elo: 1317** — 300+ Elo-Punkte hinter Claude Sonnet 4.6 (1633) und Opus 4.6 (1606) bei professionellen Expertenaufgaben, bewertet von menschlichen Gutachtern
- **SWE-Bench Pro: 54,2 %** —

---

Veröffentlicht am 5. Februar, ist Claude Opus 4.6 das, was die offizielle Dokumentation von OpenClaw empfiehlt und gegen das die meisten ClawHub-Entwickler seit Wochen ihre Skills debuggen.

**Wo es führend ist:**

- **SWE-Bench Verified: 80.8%** — höchster Wert aller Modelle
-

---

- **MCP Atlas: 59,5 %** – fast 10 Prozentpunkte hinter Gemini 3.1 Pro auf dem Benchmark, der am besten mit der Architektur von OpenClaw übereinstimmt
- **Kosten:** 5 $ pro Million Eingabe-Token, 25 $ pro Million Ausgabe-Token (Standard, bis zu 200K Kontext). Wenn Aufgaben 200K Token überschreiten, ändert sich die Preisgestaltung auf 10 $/37,50 $ – dies gilt für alle Token in der Anfrage, nicht nur für die überschüssigen

**Wichtige neue Funktionen (Veröffentlichung vom 5. Februar):**

---

- **1M-Token-Kontextfenster (Beta):** Das erste Modell der Opus-Klasse, das diese Größenordnung erreicht. Der Zugriff erfordert die Erfüllung der Anthropic-Tier-Anforderungen.
- **Context Compaction API (Beta):** Fasst ältere Konversationssegmente automatisch zusammen, wenn sich Sitzungen den Kontextgrenzen nähern, und ermöglicht so langlaufende Agentenaufgaben ohne manuelle Unterbrechung – eine Fähigkeit, die Gemini 3.1 Pro derzeit nicht besitzt.
- **Agent Teams (Alpha):** Mehrere spezialisierte Sub-Agenten, die parallel laufen (Frontend/Backend/Testing gleichzeitig), verfügbar in Claude Code v2.1.32+ und der Cowork-Plattform.
- **Adaptive Thinking (4 Stufen):** Passt die Tiefe des logischen Denkens automatisch an – niedrig/mittel/hoch/max – um den Token-Verbrauch bei einfacheren Aufgaben zu steuern.
- **128K Ausgabe-Tokens:** Eine Verdopplung im Vergleich zur vorherigen Generation.

---

**Wie man es in OpenClaw verwendet:**

```bash
openclaw models set anthropic/claude-opus-4-6
```

---

### Claude Sonnet 4.6 — Der heimliche Star

Veröffentlicht am 17. Februar, enthält Sonnet 4.6 das Benchmark-Ergebnis, das die meisten Leute wirklich überraschend finden:

**GDPval-AA Elo: 1633 — die höchste Punktzahl aller Modelle im Vergleich.**

Dies ist keine Nischenmessung. GDPval-AA bewertet die Leistung bei hochwertigen professionellen Aufgaben – der Art von Wissensarbeit, bei der Fehler echte Konsequenzen haben. Claude Sonnet 4.6 übertrifft bei dieser Messung Claude Opus 4.6 (1606), GPT-5.2 (1462) und Gemini 3.1 Pro (1317).

---

Es übertrifft auch Gemini 3.1 Pro bei τ2-bench Retail (91,7 % vs. 90,8 %) und ist bei MRCR v2 Long-Context-Retrieval (84,9 %) gleichauf. In internen Tests bevorzugten die Nutzer von Claude Code Sonnet 4.6 gegenüber Opus 4.5 in 5

---

### GPT-5.3-Codex – Der Coding-Spezialist

GPT-5.3-Codex fällt in eine eigene Kategorie, getrennt von der Diskussion über Allzweck-Agenten. Es ist ein Spezialist:

- **SWE-Bench Pro: 56,8 %** – höchster Wert aller Modelle, übertrifft Gemini 3.1 Pro (54,2 %)
- **Terminal-Bench 2.0: 77,3 %** – höchster Wert auf dem Codex-Harness von OpenAI (selbstberichtet); auf dem Standard-Terminus-2-Harness führt Gemini 3.1 Pro mit 68,5 %
- **APEX-Agents: 23,0 %** – niedrigster Wert aller getesteten Modelle

Für OpenClaw-Workflows,

---

openclaw onboard --auth-choice openai-codex
openclaw models set openai-codex/gpt-5.3-codex
```

---

### Kimi K2.5 – Der Kostendisruptor

Nicht in der offiziellen Benchmark-Tabelle, aber wissenswert: Kimi K2.5 von Moonshot AI rangiert derzeit auf Platz 1 bei Tool-Auswahl-Aufgaben in der OpenRouter-Agenten-Bestenliste, und die Nutzung ist diese Woche stark angestiegen. Die offizielle Dokumentation von OpenClaw beinhaltet native Unterstützung:

```bash
openclaw models set moonshot/kimi-k2.5

---

Für kostensensible Workflows — insbesondere solche mit chinesischsprachigem Kontext — bietet Kimi K2.5 eine wettbewerbsfähige Agentenleistung zu einem Bruchteil der API-Kosten von Claude. Es ist zurzeit das am schnellsten wachsende Modell unter den chinesischsprachigen OpenClaw-Implementierungen.

---

---

## Fünf Benchmarks im direkten Vergleich

| Benchmark | Gemini 3.1 Pro | Opus 4.6 | Sonnet 4.6 | GPT-5.3-Codex | Gewinner |
|-----------|---------------|---------|-----------|--------------|--------|
| **MCP Atlas** (Tool-Orchestrierung) | **69.2%** | 59.5% | 61.3% | — | 🏆 Gemini |
| **APEX-Agents** (Langhorizont) | **33.5%** | 29.8% | — | 23.0% | 🏆 Gemini |
| **GDPval-AA Elo** (Expertenaufgaben) | 1317 | 1606 | **1633** | — | 🏆 Sonnet |
| **τ2-bench Retail** (Tool-Zuverlässigkeit) | 90.8% | **91.9%** | 91.7% | — | 🏆 Opus |
| **BrowseComp** (agentenbasierte Suche) | **85.9%** | 84.0% | 74.7% | — | 🏆 Gemini |
| SWE-Bench Pro (Codierung) | 54.2% | — | — | **56.8%** | 🏆 Codex |

---

Gemini 3.1 Pro gewinnt 3 von 5 Kern-Agenten-Benchmarks. Claude Sonnet 4.6 führt das Expertenaufgaben-ELO an. Claude Opus 4.6 ist führend bei der Tool-Zuverlässigkeit. GPT-5.3-Codex dominiert das Coding. Kein einzelnes Modell gewinnt alles — und die richtige Antwort hängt davon ab, welche Benchmarks Ihrem tatsächlichen OpenClaw-Workflow entsprechen.

---

---

## Welches Modell für welchen Workflow?

---

| OpenClaw-Anwendungsfall | Empfohlenes Modell | Hauptgrund |
|------------------|------------------|------------|
| E-Mail-Triage + Kalenderverwaltung (gog, mail Skills) | **Sonnet 4.6** | GDPval-AA 1633 (weltweit #1), stark bei professionellen Aufgaben, 40 % günstiger als Opus |
| Komplexe systemübergreifende Automatisierung (Ketten mit 10+ Schritten) | **Gemini 3.1 Pro** | MCP Atlas 69,2 %, entwickelt für serverübergreifende, mehrstufige Orchestrierung |
| Langlaufende Projekte + persistenter Speicher (SOUL.md, Para-Second-Brain) | **Opus 4.6** | Context Compaction API + 1M-Fenster = Sitzungen, die stundenlange Tool-Aufrufe überstehen |
| Browser-Automatisierung + Informationsbeschaffung | **Gemini 3.1 Pro** | BrowseComp 85,9 %, höchste Bewertung bei agentengestützter Suche |
| Code-Debugging / Entwicklungs-Sprints | **GPT-5.3-Codex oder Opus 4.6** | Codex für reine Reparaturgenauigkeit (Selbstauskunft); Gemini und Opus im Wesentlichen gleichauf bei SWE-Bench Verified (80,6 % vs. 80,8 %) |
| Tägliche, einfache Aufgaben, hochfrequenter Chat | **Sonnet 4.6** | Bestes Preis-Leistungs-Verhältnis – ~$0,90 pro 100 komplexe Schritte |
| Budgetbeschränkte, chinesischsprachige Arbeitsabläufe | **Kimi K2.5** | #1 bei der Tool-Auswahl auf der OpenRouter-Bestenliste, Bruchteil der Kosten von Claude |
| Null Budget / Datenschutz an erster Stelle | **Gemini 2.5 Flash (kostenlos) oder Ollama** | 1.500 kostenlose Anfragen/Tag; vollständig lokale Alternativen über Ollama |

---

**Kosten auf einen Blick (100-schrittiger komplexer Arbeitsablauf):**

| Modell | Geschätzte Kosten | Anmerkungen |
|-------|---------------|-------|
| Gemini 2.5 Flash | **$0** (kostenlose Stufe) | 1.500 Anfr./Tag über Google AI Studio |
| Kimi K2.5 | ~$0,03 | Moonshot API |
| Sonnet 4.6 | ~$0,90 | $3/$15 pro Mio. Token |
| Gemini 3.1 Pro | ~$0,60 | $2/$12 pro Mio. Token (≤200K); $4/$18 über 200K |
| Opus 4.6 | ~$3,60 | Löst den Tarif für langen Kontext über 200K Token aus |

---

---

## Warum nutzt die Community immer noch Claude?

Die eigentliche Frage: Wenn Gemini 3.1 Pro bei MCP Atlas – dem für die Architektur von OpenClaw relevantesten Benchmark – führend ist, warum ist die Community nicht umgestiegen?

**Grund 1: Standardisierte Benchmarks vs. Produktionsqualität der Skills**

---

MCP Atlas testet Modelle an 36 gut strukturierten, schema-konformen MCP-Servern. Die 3.286 Community-Skills von OpenClaw variieren enorm – einige SKILL.md-Dateien haben vage Werkzeugbeschreibungen, eine unvollständige Fehlerbehandlung und nicht standardmäßige Formatierungen. Claude behandelt fehlerhafte Werkzeugaufrufe mit höherer Toleranz und besserer Wiederherstellung. Geminis höhere Benchmark-Ergebnisse setzen saubere, wohlgeformte Eingaben voraus. Im produktiven Einsatz ist die Fähigkeit eines Modells, sich von fehlerhaften Eingaben zu erholen, oft wichtiger als sein Ergebnis bei wohlgeformten.

**Grund 2: Das Ökosystem wurde um das Verhalten von Claude herum aufgebaut**

---

Tausende von ClawHub-Skills wurden gegen die spezifischen Tool-Aufruf-Konventionen, Antwortmuster und Fehlerbehebungssequenzen von Claude entwickelt und debugged. Ein Modellwechsel ist nicht nur das Ändern eines Konfigurationswerts – es bedeutet eine Neukalibrierung des Verhaltens Ihres gesamten Skills-Stacks. Das sind echte Migrationskosten, die Benchmark-Zahlen nicht erfassen.

**Grund 3: Die Context Compaction API ist ein bedeutender praktischer Schutzgraben**

---

Beide Modelle haben jetzt Kontextfenster von 1 Million Token. Aber Claude Opus 4.6 (und Sonnet 4.6) beinhalten eine Context Compaction API – die ältere Konversationen automatisch zusammenfasst, wenn sich Sitzungen dem Limit nähern, was unbegrenzt lange Agenten-Durchläufe ohne manuelle Neustarts ermöglicht. Für OpenClaw-Sitzungen, die über Stunden und Hunderte von Tool-Aufrufen laufen, ist dies eine Fähigkeit, die Gemini 3.1 Pro derzeit nicht besitzt.

---

**Fazit:** Gemini 3.1 Pro ist derzeit das überzeugendste Modell für Tests – insbesondere für systemübergreifende Automatisierung und Browser-Workflows. Aber „es schneidet in diesem Benchmark besser ab“ und „es wird in Ihrem spezifischen OpenClaw-Setup besser funktionieren“ sind unterschiedliche Behauptungen. Testen Sie es mit Ihren tatsächlichen

---

## Wie man Modelle in OpenClaw wechselt

OpenClaw verwendet die `provider/model`-Notation für alle LLM-Referenzen. Das Wechseln erfolgt mit einem einzigen Befehl:

```bash
# Aktuelles Modell anzeigen
openclaw models list

# Wechsel zu Gemini 3.1 Pro (zuerst GEMINI_API_KEY aus dem Google AI Studio festlegen)
export GEMINI_API_KEY="your-key"
openclaw models set google/gemini-3.1-pro-preview

# Zurückwechseln zu Claude Opus 4.6 (offiziell empfohlener Standard)
openclaw models set anthropic/claude-opus-4-6

# Wechsel zu Sonnet 4.6 (bessere Kosteneffizienz)
openclaw models set anthropic/claude-sonnet-4-6

# Wechsel zu GPT-5.3-Codex (OAuth-Login erforderlich)
openclaw onboard --auth-choice openai-codex
openclaw models set openai-codex/gpt-5.3-codex
```

---

# Kimi K2.5 (kostensensitiv / chinesischsprachig)
openclaw models set moonshot/kimi-k2.5

# Vollständig lokales Modell über Ollama (kostenlos, privat)
openclaw models set ollama/qwen3.5
```

Oder legen Sie es in Ihrer Konfigurationsdatei (`~/.openclaw/openclaw.json`) fest:

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

> **Ein wichtiger Hinweis:** OpenClaw unterstützt derzeit kein automatisches, aufgabenspezifisches Modell-Routing in einer einzigen Konfiguration – es gibt keine integrierte Möglichkeit, automatisch festzulegen: „Verwende Gemini für Browser-Aufgaben, Claude für Denkaufgaben“. Power-User erreichen dies, indem sie mehrere OpenClaw-Instanzen mit unterschiedlichen Modellkon

---

## Wenn Sie sich mit all dem nicht befassen möchten: TinyClaw

Hier ist eine faire Beschreibung der Situation: sechs konkurrierende Modelle, zehn relevante Benchmarks, unterschiedliche Gewinner in unterschiedlichen Szenarien, zu verwaltende API-Schlüssel, zu verfolgende Schwellenwerte für die Kontext-Preise und alle elf Tage eine wichtige neue Modellveröffentlichung.

Die meisten OpenClaw-Benutzer möchten sich nicht ständig darum kümmern. Sie wollen einen Agenten, der funktioniert.

[TinyClaw](https://tinyclaw.dev) übernimmt die Modell-Entscheidung für Sie:

---

1. **Bereitstellung in 60 Sekunden** — OpenClaw läuft in unter einer Minute, ohne Node.js-Einrichtung
2. **Smarte Modell-Empfehlung** — empfiehlt das beste Modell für Ihren Workflow, basierend auf tatsächlichen Nutzungsmustern
3. **Modellwechsel mit einem Klick** — Gemini 3.1 Pro wurde gestern veröffentlicht; TinyClaw unterstützt es bereits
4. **Kostenkontrolle** — integriertes Nutzungs-Dashboard mit monatlichen Budgetobergrenzen

Die Modell-Landschaft ändert sich alle elf Tage. TinyClaw behält den Überblick, damit Sie es nicht müssen.

→ [tinyclaw.dev](https://tinyclaw.dev) · Kostenlos starten · Ihr Agent läuft in 60 Sekunden

---

---

## Das Gesamtbild

Gemini 3.1 Pro: 19. Februar.
Claude Sonnet 4.6: 17. Februar.
Claude Opus 4.6: 5. Februar.
Tage zwischen den letzten drei großen Veröffentlichungen: **elf**.

Dieses Tempo bedeutet, dass Ihre OpenClaw-Konfiguration eine kürzere Haltbarkeit hat als früher. Das Modell, das heute optimal ist, hat eine reale Chance, im nächsten Monat suboptimal zu sein.

Die praktische Antwort besteht nicht darin, jede Benchmark-Tabelle neu zu bewerten, sobald sie veröffentlicht wird. Es geht darum zu verstehen, welche drei oder vier Benchmarks die Leistung in Ihrem spezifischen Arbeitsablauf tatsächlich vorhersagen – und zu wissen, welche Hebel man betätigen muss, wenn eine bessere Option auftaucht.

---

Für systemübergreifende Automatisierung und Browser-Workflows: Testen Sie Gemini 3.1 Pro.
Für professionelle Expertenaufgaben mit kleinem Budget: Sonnet 4.6.
Für langlaufende Sitzungen, bei denen die Beibehaltung des Kontexts entscheidend ist: Opus 4.6 mit Context Compaction.
Für reine Code-Arbeit: GPT-5.3-Codex.

Für alle anderen: [TinyClaw](https://tinyclaw.dev).

---

---

*Benchmark-Daten: offizielle Benchmark-Tabelle von Gemini 3.1 Pro (Google DeepMind, 19. Februar 2026). MCP Atlas-Methodik: Scale AI Research, arxiv 2602.00933, scale.com/research/mcpatlas. Preise: offizielle Dokumentation von Anthropic (platform.claude.com/docs/en/about-claude/pricing). OpenClaw-Modellkonfiguration: docs.openclaw.ai/providers und docs.openclaw.ai/concepts/model-providers. Preise für Gemini 3.1 Pro: $2/$12 pro 1 Mio. Token (Standard, ≤200K); $4/$18 über 200K.*

*Neu bei OpenClaw? → [TinyClaw](https://tinyclaw.dev) stellt es in 60 Sekunden bereit. OpenClaw im großen Stil betreiben? → [AgentPuter](https://www.agentputer.com/) für 24/7 verwaltetes Cloud-Hosting.*