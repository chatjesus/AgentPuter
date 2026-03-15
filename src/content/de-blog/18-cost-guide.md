Teil 1/55. Nur rohes Markdown. Keine Code-Fences. Behalte die Marken: OpenClaw,AgentPuter,ClawHub,GitHub,OpenAI,Anthropic,Claude,Claude Code,SOUL.md,IDENTITY.md,USER.md,sessions_spawn,MCP,Mac mini,Gemini,Google,Microsoft,ClawPod,Perplexity,TinyClaw,ClawBot,lossless-claw,LCM,Ollama.
YAML-FRONTMATTER: Übersetze nur Titel und Beschreibung. Behalte Datum, Autor, Lesezeit, Tags, Featured UNVERÄNDERT.

TEXT:
---
title: "Wie man OpenClaw für unter 30 $/Monat betreibt (Der komplette Kostenleitfaden)"
description: "Ein Nutzer gab 254 $ in zwei Wochen aus. Federico Viticci erreichte 3.600 $ in einem Monat. Jemand wachte mit einer 141-Dollar-Überraschung durch nächtliche Heartbeats auf. Sechs Stellen, an denen OpenClaw Tokens verbrennt, was sich mit 3.7 und 3.8 geändert hat, und wie echte Nutzer
Schlagwörter: ["OpenClaw", "Kostenoptimierung", "Modell-Routing", "Ollama", "Budget", "Heartbeat", "lossless-claw"]
hervorgehoben: true
---

# Wie man OpenClaw für unter 30 $/Monat betreibt (Der vollständige Kostenleitfaden)

AgentPuter · März 2026 · ~20 Min. · #OpenClaw #Kostenoptimierung #ModellRouting #Ollama #Budget

> **Quellen:**
> - [Wie man aufhört, Geld mit OpenClaw zu verbrennen](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) — r/PromptEngineering
> - [Bestes günstiges LLM zurzeit (Feb. 2026)](https://github.com/openclaw/openclaw/discussions/12267) — GitHub-Diskussion Nr. 12267
> - [Wie das MemOS
> - [Ihre OpenClaw-LLM-Kosten senken: Ein SaladCloud-Leitfaden](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) – SaladCloud-Blog, 9. Feb. 2026
> - [Warum ist OpenClaw so token-intensiv? 6 Gründe analysiert](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) – Apiyi-Blog, Feb. 2026
> - [Wie ich 19 OpenClaw-Agenten für 6 $ pro Monat betreibe](https://www.youtube.com/watch?v=-MtzLiQ9w1c) – YouTube, 1. März 2026
> - [OpenClaw 2026.3.7 Versionshinweise](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) – GitHub
> - [OpenClaw 2026.3
*"Warum kostet mein Agent so viel?"*

Ein Nutzer gab in zwei Wochen 254 $ aus. Ein anderer kam in einem Monat auf 800 $. Der Tech-Blogger Federico Viticci verursachte mit dem Betrieb einer intensiven Multi-Channel-Automatisierung eine [mon
Das sind keine Power-User, die an ihre Grenzen gehen. Das sind normale Setups mit normaler Nutzung.

OpenClaw ist kostenlos. Die Modelle, die es aufruft, sind es nicht. Und da OpenClaw dafür ausgelegt ist, 24/7 zu laufen –
Dieser Beitrag ist die Anleitung, die eigentlich mit OpenClaw hätte mitgeliefert werden sollen. Wir erklären genau, wohin das Geld fließt, was die neuesten Versionen (3.7 und 3.8) zur Verbesserung beitragen und wie echte Benutzer ihre Rechnungen von Hunderten auf
Jedes Mal, wenn OpenClaw einen API-Aufruf macht, lädt es Ihre `SOUL.md`, `AGENTS.md` und andere Bootstrap-Dateien in den Prompt. Diese werden nicht nur einmal geladen — sie werden mit **jeder Anfrage** gesendet. Wenn Ihre
Ein Nutzer auf r/LocalLLaMA [hat seinen Bootstrap von 85 KB auf 27 KB reduziert](https://www.reddit.com/r/LocalLLaMA/comments/1r3ro5h/) – eine Reduzierung um 69,8
Dein Sitzungsverlauf wächst mit jedem Austausch. Nach einigen Stunden aktiver Nutzung trägst du Zehntausende von Tokens im Verlauf mit. All das wird bei jeder neuen Anfrage mitgeschickt. Das ist der größte einzelne Kostentreiber für Vielnutzer – und der Grund, warum [loss
Der Heartbeat von OpenClaw läuft standardmäßig alle 30 Minuten. Jeder Check ist ein vollständiger API-Aufruf, der Ihren gesamten Systemkontext enthält. Bei Opus ist das ein erheblicher Kostenfaktor – 48 Heartbeats pro Tag, von denen jeder Ihren vollständigen
### 4. Erzeugung von Sub-Agenten

Wenn Ihr Hauptagent an Sub-Agenten delegiert, startet jeder von ihnen mit seinem eigenen Kontext, seinem eigenen Speicher und seinen eigenen Modellaufrufen. Nutzer, die Multi-Agenten-Setups verwenden (einen zum Schreiben, einen zur Recherche, einen zum Programmieren), zahlen für jeden Agenten einen Kontext-Overhead – und verlieren bei jeder Übergabe Kontext.

### 5. Tool-Ausgaben
Browser-Scrapes, Dateizugriffe, Suchergebnisse – Werkzeugausgaben werden im Transkript gespeichert und mit nachfolgenden Nachrichten erneut gesendet. Ein einzelner Web-Scrape kann Tausende von Tokens in Ihren Verlauf laden, die für den Rest der Sitzung
## Falls Sie noch nicht angefangen haben: Der kostenlose Einstieg

Bevor wir zur Optimierung kommen, ein Hinweis für alle, die OpenClaw noch nicht eingerichtet haben.

Sie müssen keinen Cent ausgeben, um es auszuprobieren. **Gemini 2.5 Flash-Lite
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // kostenloser Tarif
    }
  }
}
```

Verbinden Sie einen Kanal (nur Telegram oder WebChat), halten Sie SOUL.md kurz, und Sie haben einen funktionierenden persönlichen Agenten zum Nulltarif. Skalieren Sie von dort aus.

---

## Was sich mit 3.7 und 3.8 geändert hat (kostenrelevante Funktionen)

Die letzten beiden Versionen enthielten mehrere Funktionen, die sich direkt auf die Kosten auswirken. Hier ist, was wichtig ist:

### Aus 3.7 (8. März)
**Context Engine Plugin API + lossless-claw.** Das [lossless-claw-Plugin](/blog/lossless-claw) hält Ihren aktiven Kontext im Bereich von 30–100K Tokens, egal wie lange die Konversation läuft. Ohne dieses laufen Sitzungen entweder über (was
**MiniMax-M2.5-highspeed als erstklassiges Modell.** Keine Behelfslösung mehr – es ist ordnungsgemäß in den Modellkatalog, das Onboarding und das Routing eingebunden. Dies ist ein schnelles, günstiges Modell, das 80 % der
**`openclaw backup create` und `openclaw backup verify`.** Keine direkte Kostenfunktion, aber wenn Sie jemals eine Konfiguration verloren und sie neu aufbauen mussten – das ist verschwendete Zeit und Tokens, um den Kontext mit Ihrem Agenten wiederherzustellen.

**B
**Stille-Timeout im Sprachmodus.** `talk.silenceTimeoutMs` ermöglicht es Ihnen zu steuern, wann die Spracheingabe automatisch gesendet wird. Verhindert vorzeitiges Absenden, das einen API-Roundtrip-Aufruf für einen halben Satz verschwendet
Jeder Nutzer, der seine Rechnung gesenkt hat, sagt dasselbe: Die Lösung war keine spezifische Technik — sondern zu sehen, wohin das Geld floss.
Melde dich jetzt sofort in deinem API-Anbieter-Dashboard ein. Sieh dir die täglichen Ausgaben an. Finde die Spitzen. Ein Nutzer hat [auf r/openclaw 30 Tage lang jeden Dollar verfolgt](https://www.reddit.com/r/Local
Verwende in OpenClaw `/status`, um das Modell und die Token-Anzahl der aktuellen Sitzung zu sehen. Verwende `/usage full`, um eine Kostenaufschlüsselung pro Antwort zu erhalten. Man kann nicht optimieren, was man nicht messen kann.

---

## Strategie 2: Korrigiere deinen Heartbeat (Eine Konfigurationsänderung, spart 30–50 $/Monat)

Der Heartbeat ist die häufigste Quelle für unerwartete Kosten. Standard: alle 30 Minuten, vollständiger API-Aufruf, primäres Modell. Das sind 48 Aufrufe pro Tag, von denen jeder deinen vollständigen System-Prompt überträgt.

**Reduziere die Frequenz:**

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

Das reduziert die Anzahl der Aufrufe von 48 auf 12 pro Tag – eine Reduzierung der Heartbeat-Kosten um 75 % bei minimalen Auswirkungen auf die Reaktionsfähigkeit.

**Leiten Sie Heartbeats an ein günstiges Modell um.** Wenn Sie einen Routing-Proxy verwenden (siehe Strategie 5), werden Heartbeats automatisch als „leicht“ klassifiziert und an Haiku gesendet. Bei Verwendung eines lokalen Modells über Ollama kosten Heartbeats 0 $.

---

## Strategie 3: Kürzen Sie Ihre SOUL.md (Text löschen, 70 % sparen)
Jeder Token in Ihrem System-Prompt wird bei jedem Aufruf in Rechnung gestellt. Das sind die multiplikativen Kosten, die die meisten Leute übersehen.

Ein echtes Beispiel aus der Community:

| Metrik | Vorher | Nachher |
|--------|--------|-------
Öffne deine SOUL.md. Lies jede Zeile. Frage dich: „Benötigt der Agent dies wirklich bei jedem einzelnen Aufruf?“ Projektspezifischer Kontext von vor drei Monaten? Verschiebe ihn in einen Skill. Historische Notizen? Verschiebe sie in
Dies ist der einfachste Gewinn, den die Quelldaten des Artikels wiederholt hervorheben.

Anthropic unterstützt automatisches Prompt-Caching für Claude-Modelle. Da OpenClaw bei jedem Aufruf denselben System-Prompt (SOUL.md + AGENTS.md)
Ein Nutzer, [der die Kosten über 30 Tage nachverfolgte](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/), berichtete: *"
Bei Anthropic-Modellen ist Prompt-Caching in neueren OpenClaw-Versionen standardmäßig aktiviert. Bei anderen Anbietern prüfen Sie, ob Ihr Modell dies unterstützt – die Gemini-Modelle von Google bieten ebenfalls [Kontext-Caching](https://ai.google.dev/
Ein Heartbeat-Check, der fragt „Gibt es etwas Neues in meinem Posteingang?“, benötigt kein Opus. Eine Nachrichtenklassifizierung („Ist das dringend?“) benötigt kein Sonnet. Das sind Aufgaben auf Haiku-Niveau.

Hier ist ein realer Kostenvergleich aus der Community:

| Setup | Monat
| Geroutet | $35 | Gleicher Benutzer, gleiche Aufgaben |

**So geht's – Option A: Manuelle Konfiguration**

Stellen Sie Ihr Standardmodell auf etwas Günstiges ein und verwenden Sie Opus nur dort, wo Sie es explizit benötigen:

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-haiku-4-5",  // Standard für alles
      subagents: {
        model: "anthropic/claude-haiku-4-5", // auch für Sub-Agenten
      }
    }
  }
}
```

Wechseln Sie dann zu einem stärkeren Modell, wenn Sie logisches Denken benötigen:

```
/model claude-opus-4-6
```
Wenn du mit der komplexen Aufgabe fertig bist, wechsle zurück:

```
/model claude-haiku-4-5
```

**Wie es geht – Option B: Auto-Routing-Proxy**

Es gibt mittlerweile mehrere Open-Source-Router, die jede Anfrage klass
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) – 15-dimensionale lokale Bewertung, die Community berichtet von ~90 % Einsparungen im Vergleich zur ständigen Nutzung von Opus.

Beide befinden sich zwischen OpenClaw und dem API-Endpunkt. Installieren, Ihre Konfiguration auf den lokalen Proxy ausrichten, und das Routing erfolgt automatisch.

**Anleitung – Option C: Das Modell-Fallback-System verwenden**

OpenClaw unterstützt nativ Fallback-Ketten:

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: [
"anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

Dies ist kein Routing nach Komplexität – es ist ein Sicherheitsnetz für Ratenbegrenzungen und Ausfälle. Aber in Kombination mit einer modellspezifischen Zuweisung pro Kanal oder pro Agent können Sie verschiedene Workloads an unterschiedliche Preisstufen weiterleiten.

---

## Strategie 6: Ein Agent, viele Fähigkeiten (Die größten Einsparungen, über die niemand spricht)
Dies stammt direkt aus dem [r/PromptEngineering-Kostenleitfaden](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/):

> *"Ein Benutzer wechsel
Jede Agenteninstanz hat einen Overhead: ihren eigenen System-Prompt, ihren eigenen Speicher, ihr eigenes Kontextfenster. Der Betrieb von fünf Agenten bedeutet, bei jedem Aufruf die fünffachen Bootstrap-Kosten zu zahlen.

OpenClaw Skills sind Markdown-Dateien, die Ihrem Agenten neue Fähigkeiten verleihen, ohne eine neue Instanz zu erzeugen. Gleiches Gehirn, gleicher Speicher, gleicher Kontext. Eine Fähigkeit zum Schreiben, eine Fähigkeit zur Recherche, eine Fähigkeit zum Programmieren – alle laufen in einer einzigen Agentensitzung.

```
~/.openclaw/workspace/skills/
├── research/SKILL.md
├── writing/SKILL.md
```
├── coding/SKILL.md
└── calendar/SKILL.md
```

Der Agent wählt die richtige Fähigkeit basierend auf Ihrer Anfrage. Keine Übergabe. Kein Kontextverlust. Keine duplizierten Bootstrap-Token.

**Wann man Multi-Agenten verwendet:** Wenn Sie wirklich parallele Ausführung benötigen – mehrere Aufgaben, die gleichzeitig und nicht nacheinander ausgeführt werden. Für alles andere sind Fähigkeiten günstiger und besser.

---

## Strategie 7: Lokale Modelle für Routinearbeiten ausführen (keine Grenzkosten)
Der Betrieb eines Modells auf eigener Hardware bedeutet, dass nach der Ersteinrichtung jede Inferenz kostenlos ist.

**Was für OpenClaw funktioniert:**

| Modell | Hardware | Geschwindigkeit | Geeignet für |
|-------|----------|-------|----------|
| Qwen 3 32B | RTX 4090 | 40+ tok/s | Allgemeine Agentenarbeit |
| Qwen 3 14B | RTX 30
curl -fsSL https://ollama.com/install.sh | sh

# Lade dein Modell herunter
ollama pull qwen3:32b

# OpenClaw-Konfiguration
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

OpenClaw 3.7+ unterstützt Ollama-Embeddings nativ für die Speichersuche, sodass dein Langzeitgedächtnis ebenfalls lokal bleibt.
**Der hybride Ansatz** (was die meisten kostenbewussten Nutzer tun): lokales Modell als Standard für Routineaufgaben, Cloud-API (Sonnet oder Opus) nur, wenn der Agent tiefgreifendes Denken benötigt. Ein YouTube-Creator dokumentierte, wie er [1
**Vektorspeicher anstelle von rohem Kontext verwenden.** Die Speichersuche von OpenClaw ruft relevante Erinnerungen über eine Embedding-Suche ab, anstatt alles in den Prompt zu laden. Mit Ollama-Embeddings (3.7+) ist dies sowohl intelligenter als auch kostenlos:

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
**Installieren Sie lossless-claw.** Wie in [unserem vorherigen Beitrag](/blog/lossless-claw) beschrieben, hält das lossless-claw-Plugin den aktiven Kontext durch inkrementelle Zusammenfassung zwischen 30K–100K Tokens. Sie stoßen nie an die
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | $0.07 | $0.40 | Kostengünstige Extraktion, einfache Abfragen | Z.AI |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | Leichte Aufgaben, 1M Kontextfenster | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| **MiniMax M2.5 Standard** | $0.15 | $1.20 | Allgemeine Agentenarbeit, 197K Kontext | [MiniMax](https://www.minimax.io/news/minimax-m25) |
| **Claude Haiku 4.5** | 1,00 $ | 5,00 $ | Heartbeats, Klassifizierung, Formatierung | Anthropic |
| **Claude Sonnet 4.6** | 3,00 $ | 15,00 $ | Strukturierte Aufgaben, Code-Review | Anthropic |
| **Claude Opus 4.6** | 5,00 $ | 25,00 $ | Komplexes Schlussfolgern, Architektur | [Anthropic](https://www.anthropic.com/claude/opus) |
| **Ollama (lokal)** | 0 $ | 0 $ | Heartbeats, Embeddings, Routineaufgaben | Selbst gehostet |
Die Rechnung ist einfach: Wenn 80 % der Aufrufe Ihres Agenten Routine sind und Sie diese an Haiku (1 $/5 $) anstatt an Opus (5 $/25 $) weiterleiten, haben Sie Ihre Rechnung für diese Aufrufe um 80 % gesenkt. Fügen Sie Prompt-Caching, eine gekürzte SOUL.md und lokale Modelle für Heartbeats und Embeddings hinzu, und ein Agent, der 200 $/Monat kostet, fällt auf unter 30 $.

---

## Alles zusammengefügt: Die 30-$/Monat-Konfiguration

Hier ist eine praxisnahe Konfiguration für einen produktiven 24/7 OpenClaw-Agent
// Sonnet für Ihre Hauptinteraktion — leistungsstark genug für echte Arbeit
      model: "anthropic/claude-sonnet-4-6",

      // Sub-Agenten verwenden standardmäßig Haiku
      subagents: {
        model: "anthropic/claude-haiku-4-5",
        runTimeoutSeconds: 120
      },

      // Heartbeat: lokales Modell, längeres Intervall
      heartbeat: {
        intervalMinutes: 120,
        // Oder an Haiku weiterleiten, wenn kein lokales Modell vorhanden ist
      }
    }
  },

  // Lokales Ollama für Einbettungen (freie Suche im Speicher)
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // lossless-claw, um ein Aufblähen des Kontexts zu verhindern
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // Brave-Suche mit LLM-Kontext-Modus (weniger nachfolgende Tokens)
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

**Monatliche Kostenaufstellung (geschätzt, 30 Tage):**
| Komponente | Tokens/Tag | Modell | Kosten/Monat |
|-----------|-----------|-------|------------|
| Hauptinteraktion (~2 Std. aktiv) | ~80K (50K ein + 30K aus) | Sonnet | ~$18 |
| Sub-Agenten-Aufrufe | ~30K | Haiku | ~$1,50 |
| Heartbeat (12/Tag) | ~30K | Lokal/Haiku | $0–$1 |
| Speicher-Embeddings | — | Lokal (Ollama) | $0 |
| Websuche-Nachverfolgungen | ~20K | Sonnet | ~$2 |
| Einsparungen durch Prompt-Caching | — | — | –$4 |
| **Gesamt** | | | **~$19–22** |
*Berechnung: Hauptinteraktion = 50K Eingabe × $3/M × 30 = $4,50, plus 30K Ausgabe × $15/M × 30 = $13,50 = $18/Monat. Prompt-Caching reduziert die wiederholte Eingabe des System-Prompts um ~40 %.*

Das ist ein voll funktionsfähiger, ständig aktiver Agent mit Web-Browsing, Gedächtnis und mehrstufiger Argumentation – für weniger als ein Netflix-Abonnement.

---

## Die 5-Minuten-Checkliste

Wenn Sie sonst nichts tun, erledigen Sie heute diese fünf Dinge:
**1. Überprüfen Sie Ihre Rechnung.** Loggen Sie sich in Ihrem API-Anbieter-Dashboard ein. Sehen Sie sich die täglichen Ausgaben an. Finden Sie die Spitzen.

**2. Verlängern Sie Ihr Heartbeat-Intervall.** Fügen Sie `heartbeat
**4. Legen Sie ein Sub-Agenten-Modell fest.** Fügen Sie `agents.defaults.subagents.model` zu Ihrer Konfiguration hinzu. Lassen Sie nicht zu, dass Sub-Agenten Ihr teures primäres Modell erben.

**5. Install
- **MemOS Cloud Plugin** berichtete über eine [72%ige Token-Reduzierung](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) im LOCOMO-Benchmark für lange Konversationen durch die Auslagerung des Speichers auf ein dediziertes System
- **QMD** (von Shopify-Mitbegründer Tobi Lütke) bietet 60–97 % Token-Einsparungen durch lokale semantische Suche
- **Auto-Routing-Proxys** wie ibl.ai Router und ClawRouter machen die manuelle Modellauswahl überflüssig
- Die in 3.7 veröffentlichte **Context Engine API** bedeutet, dass die Community völlig neue Ansätze zur Kontexteffizienz entwickeln kann

Der Trend ist klar: Die Agenten-Runtime wird auf jeder Ebene kostenbewusst. Kontextmanagement, Speichersuche, Modell-Routing und die Verarbeitung von Tool-Ausgaben werden alle gleichzeitig optimiert. Die monatliche 200-Dollar-Rechnung für OpenClaw wird zu einem gelösten Problem für jeden, der bereit ist, 30 Minuten für die Konfiguration aufzuwenden.

---
*Betreiben Sie OpenClaw mit einem kleinen Budget? Teilen Sie Ihre monatlichen Kosten und Ihre Konfiguration in den Kommentaren. Wir sammeln Daten für einen Community-Kosten-Benchmark – das Ziel ist es, die geringstmöglichen Kosten für jede Stufe der Agenten-
*Quellen: [r/PromptEngineering Kostenleitfaden](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [GitHub-Diskussion #12267](https://github.com/openclaw/openclaw/discussions/12267) · [MemOS-Plugin-Analyse](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [ibl.ai Router](https://github.com/iblai/iblai-openclaw-router) · [SaladCloud Kostenleitfaden](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [Apiyi Token-Analyse](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*