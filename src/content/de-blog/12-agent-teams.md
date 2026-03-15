---
title: "Von einem Agenten zu einem Team: Wie OpenClaw Sub-Agenten funktionieren"
description: "Ein Forscher von Anthropic gab 20.000 $ aus, um 16 parallele Claude-Agenten einen C-Compiler schreiben zu lassen. Das Sub-Agent-System von OpenClaw ermöglicht es Ihnen, dieselbe Architektur für Ihr morgendliches Briefing auszuführen – für etwa 0,03 $. Und so funktioniert's."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "10 min"
tags: ["OpenClaw", "Sub-Agents", "Agent Teams", "Parallel Agents", "sessions_spawn", "Claude Code"]
featured: false
---

---

# Vom einzelnen Agenten zum Team: Wie OpenClaw Sub-Agenten funktionieren — und was uns das 20.000-Dollar-Compiler-Experiment von Anthropic über die Zukunft verrät

**Im Februar gab ein Forscher von Anthropic 20.0

---

Diesen Monat veröffentlichte der Anthropic-Forscher Nicholas Carlini ein Experiment, das sich weniger wie Softwareentwicklung und mehr wie biologische Evolution anfühlt.

Er beauftragte 16 Instanzen von Claude Opus 4.6, zwei Wochen lang parallel zu arbeiten. Sie generierten fast 2.000 Coding-Sitzungen, verbrauchten 2 Milliarden Input-Token und kosteten knapp 20.000 $ an API-Gebühren.

---

Das Ergebnis? Ein 100.000-zeiliger, Rust-basierter C-Compiler, von Grund auf neu geschrieben, der den Linux 6.9-Kernel für die Architekturen x86, ARM und RISC-V kompilieren kann

---

Die meisten von uns haben keine 20.000 $, die sie diese Woche für API-Aufrufe ausgeben können. Aber das Architekturmuster, das Carlini verwendet hat – die Zerlegung eines riesigen Ziels in parallele Aufgaben für unabhängige Agenten – ist genau das, w

---

## Zuerst: Räumen wir mit der Verwirrung auf

Derzeit kursieren drei „Multi-Agenten“-Konzepte in der Community. Sie klingen ähnlich, aber es handelt sich um völlig unterschiedliche Tools.

---

| Konzept | Was es ist | Wo es verwendet wird |
|---------|------------|------------------|
| **Claude Code Agent Teams** | Eine experimentelle Funktion im `claude` CLI-Tool von Anthropic. Sie ermöglicht es Teammitgliedern, sich über ein "Mailbox"-System direkt Nachrichten zu senden. | **Claude Code** (Programmierwerkzeug, Alpha-Phase) |
| **$20K Compiler Experiment** | Der Forschungsprototyp von Nicholas Carlini. Er verwendete reine Git-Repos und Dateisperren zur Koordination – kein zentraler Orchestrator, keine Chat-Schnittstelle. | **Forschungsarbeit** (kein Produkt) |
| **Open

---

**In diesem Artikel geht es um OpenClaw Sub-Agenten.** Er ist der einzige von den dreien, der heute für allgemeine Automatisierungsaufgaben produktionsreif ist.

---

---

## Wie OpenClaw-Sub-Agenten funktionieren

Anstatt dass ein Agent alles sequenziell erledigt, startet ein „Hauptagent“ „Sub-Agenten“, um Aufgaben im Hintergrund auszuführen.

---

Haupt-Agent (Tiefe 0)
    │
    ├── sessions_spawn(aufgabe="Konkurrent A recherchieren")
    │       └── Sub-Agent A (Tiefe 1, isolierte Sitzung)
    │               └── arbeitet... arbeitet... → meldet Ergebnisse zurück
    │
    ├── sessions_spawn(aufgabe="Konkurrent B recherchieren")
    │       └── Sub-Agent B (Tiefe 1, isolierte Sitzung)
    │               └── arbeitet... arbeitet... → meldet Ergebnisse zurück
    │
    └── Empfängt Ergebnisse → Synthetisiert den Abschlussbericht

### Schlüsselverhalten

---

1.  **Nicht-Blockierend:** Der `sessions_spawn`-Befehl gibt sofort eine `runId` zurück. Der Haupt-Agent kann weiterarbeiten oder weitere Agenten starten, ohne zu warten.
2.  **Kontext-Isolierung:** Jeder Sub-Agent läuft

---

### Der Befehl

Das Tool ist `sessions_spawn`. Beachten Sie, dass der Parametername `task` lautet, nicht `instruction`.

```javascript
sessions_spawn({
  task: "Search for the latest HackerNews AI headlines and return top 5",
  model: "gpt-4o-mini",         // Ein günstigeres Modell für den Worker verwenden
  runTimeoutSeconds: 120,       // Sicherheitsabschaltung
  label: "news-fetcher",        // Für Ihre Protokolle
  cleanup: "delete"             // Sitzung nach Abschluss automatisch löschen
})
```

---

---

## Vier praxisnahe Architekturen

### Muster 1: Koordinator + Worker (Am häufigsten)

Dies ist das Standardmuster für Recherche oder Stapelverarbeitung.

```
Haupt-Agent (Koordinator)
  ├── Worker A: Recherchiere das Preismodell von Notion
  ├── Worker B: Recherchiere das Preismodell von Linear
  └── Worker C: Recherchiere das Preismodell von Monday.com
Haupt-Agent fasst die Eingaben in einer Preisvergleichstabelle zusammen.
```

---

**Warum es funktioniert:** Bei sequenzieller Ausführung würde sich das Kontextfenster des Hauptagenten mit rohem HTML von drei verschiedenen Preisseiten füllen. Durch die Parallelisierung verarbeitet jeder Worker die Rohdaten und gibt nur die strukturierte Zusammenfassung zurück.

**Empfohlenes Worker-Modell:** `gpt-4o-mini` oder `gemini-2.5-flash` (kostengünstig).

### Muster 2: Die Pipeline

---

Sub-Agent 1: Rohdaten scrapen (Fähigkeit: Websuche)
      ↓
Sub-Agent 2: Daten bereinigen und strukturieren (Fähigkeit: schlussfolgern)
      ↓
Sub-Agent 3: Erkenntnisse generieren (Fäh

---

Hauptagent (Router)
  ├── "Einen Termin vereinbaren"   → Spezialagent für Google Calendar
  ├── "Eine E-Mail entwerfen"      → Schreib-Spezialagent
  └── "Dieses Thema recherchieren" → Websuche-Spezial

---

## AGENTS.md Routing-Regeln

Beim Routen von Aufgaben an Sub-Agenten:
- Kalenderanfragen: mit den Skills google-calendar und google-workspace starten
- Rechercheanfragen: mit dem Skill web-search starten, das Modell gpt-4o-mini

---

**Sequenziell (Alter Weg):** Wetter prüfen (5s) → Kalender prüfen (5s) → E-Mails prüfen (10s) → Nachrichten prüfen (10s) → Zusammenfassen (5s). Gesamt: **~35 Sekunden.**

**Parallel (

---

Die Gesamtzeit wird durch den langsamsten Agenten (~15s) + die Synthese (5s) bestimmt = **~20 Sekunden.**

---

---

## Kritische Kostenstrategie: „Schlauer Chef, billige Praktikanten“

Das größte Risiko bei Sub-Agenten ist die Kostenmultiplikation. Wenn Sie 5 Agenten spawnen und alle Claude Opus 4.6 verwenden, haben Sie Ihre API-Re

---

**Die Praktikanten (Worker):** Führen in der Regel klare, begrenzte Aufgaben aus (fasse dies zusammen, finde das).
*   **Modell:** `openai/gpt-4o-mini` oder `google/gemini-2.5-flash`

---

## Erweitert: Das Orchestrator-Muster (Tiefe 2)

Standardmäßig setzt OpenClaw `maxSpawnDepth: 1`, was bedeutet, dass ein Sub-Agent keine eigenen Sub-Agenten erzeugen kann.

Für komplexe Projekte können Sie Tiefe 2 aktivieren:

```json
{ "agents": { "defaults": { "subagents": { "maxSpawnDepth": 2 } } } }
```

Dies ermöglicht eine dreistufige Hierarchie:

---

Haupt-Agent (CEO)
  └── Orchestrator-Agent (Manager) — Hat die Berechtigung sessions_spawn
        ├── Arbeiter A (Praktikant) — Kann nicht spawnen
        ├── Arbeiter B (Praktikant)
        └── Arbeiter C (Praktikant)

Dies spiegelt die Struktur des 20.000-Dollar-Compiler-Experiments wider: Ein übergeordnetes Ziel wird festgelegt, eine autonome Entität verwaltet die Aufteilung, und einzelne Arbeiter führen die Teile aus.

---

---

## OpenClaw vs. Claude Code Agenten-Teams

Beide existieren. Welches sollte man tatsächlich verwenden?

---

| Merkmal | OpenClaw Sub-Agenten | Claude Code Agenten-Teams |
| :--- | :--- | :--- |
| **Zielgruppe** | Allgemeine Automatisierung (E-Mail, Recherche, Betrieb) | Codierung & Softwareentwicklung |
| **Kommunikation** | Hub-and-Spoke (Worker berichten an Main) | Mesh (Teammitglieder senden sich gegenseitig Nachrichten) |
| **Reifegrad** | Produktionsreifes Feature | Alpha / Experimentell |
| **Einrichtung** | Integriert, keine Konfiguration erforderlich | Erfordert die Bearbeitung von `settings.json` |
| **Kontext** | Unabhängig pro Agent | Unabhängig pro Agent |

---

Wenn Sie einen Compiler erstellen, verwenden Sie Claude Code. Wenn Sie einen persönlichen Assistenten oder einen Geschäfts-Workflow erstellen, verwenden Sie OpenClaw.

---

---

## Praktische Einschränkungen

---

1.  **Einwegkommunikation:** Sub-Agenten können nur an ihren übergeordneten Agenten zurückmelden. Sie können während der Aufgabe keine Rückfragen zur Klärung an den übergeordneten Agenten stellen.
2.  **Keine `SOUL.md`:** Denken Sie daran, Sub-Agenten sind unbeschriebene Blätter. Wenn Sie möchten, dass sie eine Persönlichkeit oder bestimmte Verhaltensregeln haben, müssen Sie diese Anweisungen in den `task`-Prompt oder die `AGENTS.md` aufnehmen.
3.  **Limits für Gleichzeitigkeit:** Versuchen Sie nicht, 50 Agenten auf einmal zu starten. Sie werden sofort an die Ratenbegrenzungen der API stoßen. Die Standardobergrenze liegt bei 8 gleichzeitigen Sitzungen.

---

---

## Wenn Sie das nicht verwalten möchten: TinyClaw

Die Verwaltung paralleler Agenten-Architekturen, die Konfiguration von `maxSpawnDepth` und die Überwachung der Token-Kosten über mehrere Modelle hinweg ist komplex.

[TinyClaw](https://tinyclaw.dev

---

Ein Team von Agenten zu betreiben, muss keine 20.000 $ kosten. Starten Sie mit einem morgendlichen Briefing.

→ [tinyclaw.dev](https://tinyclaw.dev) · Kostenlos starten · Ihr Agenten-Team läuft in