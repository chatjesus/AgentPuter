---
title: "OpenClaw hat gerade sein größtes Problem gelöst. Das ist, was lossless-claw wirklich macht."
description: "Die Standard-Komprimierung von OpenClaw wird einmal ausgelöst, fasst alles zusammen und verwirft die Originale. Je länger Ihr Agent läuft, desto mehr vergisst er. Version 2026.3.7 hat die Kontext-Engine für Plugins geöffnet. lossless-claw ist das erste davon – ein DAG-basiertes System, das jede Nachricht vollständig speichert und es Agenten ermöglicht, exakte historische Details bei Bedarf abzurufen."
date: "2026
Lesezeit: "18 Min."
tags: ["OpenClaw", "lossless-claw", "Context Engine", "Memory", "Plugin", "Long-Running Agents", "LCM"]
featured: true
---

# OpenClaw hat gerade sein größtes Problem behoben. Das macht lossless-claw wirklich.

AgentPuter · März 2026 · ~18 Min. · #OpenClaw #lossless-claw #ContextEngine #LongRunningAgents #Plugin

> **Quellen:**
> - [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) — GitHub-Repo
> - [Funktion: Austauschbare Kontextsystme, LCM für OpenClaw](https://github.com/openclaw/openclaw/discussions/22251) — Diskussion #22251, @jalehman, 20. Feb. 2026
> - [OpenClaw 2026.3.7 Veröffentlichungshinweise](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) — Twitter, 8. Mrz. 2026
> - [LCM: Verlustfreies Kontextmanagement](https://papers.voltropy.com/LCM) — Ehrlich & Blackman

---
Stellen Sie sich Folgendes vor: Sie haben einen OpenClaw-Agenten drei Stunden lang an einem Forschungsprojekt arbeiten lassen. Er hat Webseiten durchsucht, Notizen gemacht, Quellen abgeglichen und sich ein Bild von etwas Komplexem gemacht. Dann erreicht er sein Kontextlimit.
Die nächste Nachricht, die es dir schickt, liest sich, als wäre es gerade mit Amnesie aufgewacht. Der spezifische Dateipfad, den es vor zwei Stunden gefunden hat – verschwunden. Eure gemeinsame Entscheidung, welchen Ansatz ihr verfolgen wollt – zusammenge
Das ist kein Bug. Das ist beabsichtigt – und bis zum 8. März 2026 war es die einzige Option, die jeder Agent hatte.

OpenClaw 2026.3.7 änderte das.

---

## Das Problem mit
Das ist nicht der Fall. Und zwar aus folgendem Grund:

Wenn die Standard-Verdichtung von OpenClaw ausgelöst wird, führt es eine **einmalige Zusammenfassung** durch: Die ältesten Nachrichten werden in einem einzigen Zusammenfassungsblock zusammengefasst, dieser Block wird
[@jalehman](https://github.com/jalehman) – der Entwickler, der lossless-claw entwickelt hat – beschrieb die Situation präzise in [Diskussion #22251](https://github.com/openclaw/openclaw/discussions/22
Dieser letzte Satz ist wichtig. Dies ist kein OpenClaw-spezifischer Fehler. ChatGPT macht das. Claude macht das. Jedes Agenten-Framework macht das. Das gesamte Feld ist von der Annahme ausgegangen, dass verlustbehaftete Komprimierung die einzige Option ist.

**Die praktischen Konsequenzen sind erheblich:**

Bei Konversationen in einer einzigen Sitzung, die in weniger als einer Stunde abgeschlossen sind, ist die Kompaktierung bestenfalls ein kleines Ärgernis. Der Agent behält das meiste, was wichtig ist, und man macht weiter.
Für langlebige Agenten – diejenigen, die tatsächlich eingesetzt werden, um 24/7 zu laufen, Projekte zu bewältigen, die sich über Tage oder Wochen erstrecken, und um zwischen Sub-Agenten bei Dutzenden von Aufgaben zu koordinieren – ist die Komprimierung
Es hat einen Grund, warum erfahrene OpenClaw-Benutzer Workarounds entwickelt haben: `/compact` in strategischen Momenten manuell auszuführen, SOUL.md so zu strukturieren, dass wichtige Fakten die Komprimierung überleben, und Projekte in isolierte Sitzungen
Die Schlagzeile, die du auf Twitter sehen wirst, lautet: „lossless-claw – ein OpenClaw-Plugin, das deinem Agenten ein perfektes Gedächtnis verleiht.“ Das stimmt, aber das ist nicht die eigentliche Neuigkeit.

Die eigentliche Neuigkeit
Vor Version 2026.3.7 war das Kontextmanagement von OpenClaw **fest in den Kern einprogrammiert**. Es gab keine Möglichkeit, es auszutauschen, zu erweitern oder mit Alternativen zu experimentieren, ohne die gesamte Codebasis zu forken. Die Komprimierungslogik – wann sie ausgelöst wird, wie sie zusammenfasst, was sie beibehält – war fest integriert. Jeder, der einen anderen Ansatz ausprobieren wollte, musste parallel seinen eigenen Fork von OpenClaw pflegen. Das ist kein gangbarer Weg für ein Plugin.
Der PR, den @jalehman eingereicht hat – [#22201](https://github.com/openclaw/openclaw/pull/22201) – hat nicht nur Unterstützung für lossless-claw hinzugefügt. Er **hat die Kontextverwaltung in ein ste
Was das in der Praxis bedeutet: OpenClaw verfügt jetzt über eine definierte Schnittstelle für die Kontextverwaltung. Jedes Plugin, das diese Schnittstelle implementiert, kann die integrierte Engine vollständig ersetzen. Das Standardverhalten bleibt erhalten – `LegacyContextEngine` ist weiterhin der Fallback, wenn Sie nichts konfigurieren – aber die Tür steht jetzt offen.

Hier ist die Schnittstelle:

```typescript
// OpenClaw 2026.3.7 – Plugin-Schnittstelle für die Context Engine
interface ContextEngine {
bootstrap(ctx):           Promise<void>           // DB, Indizes initialisieren
  ingest(msg):              Promise<void>           // jede ankommende Nachricht archivieren
  assemble(opts):           Promise<AgentMessage[]> // Modellkontext für jede Runde zusammenstellen
  compact(ctx):             Promise<void>           // Kompaktierungs-Auslöser behandeln
  afterTurn(ctx):           Promise<void>           // Verarbeitung nach der Runde
  prepareSubagentSpawn():   ...                     // Kontext an erzeugte Sub-Agenten übergeben
  onSubagentEnded():        ...                     // Abgleich nach Abschluss des Sub-Agenten
}
```

Das ist ein vollständiger Lebenszyklus. Jeder Moment,
"contextEngine": "lossless-claw"
    }
  }
}
```

Wenn Sie diese Zeile nicht hinzufügen, ändert sich nichts. Keinerlei Verhaltensunterschied zu früheren Versionen. Der Migrationspfad ist vollständig optional.

---

## Wie lossless-claw funktioniert
lossless-claw ist die erste Implementierung dieser Schnittstelle. Es basiert auf dem [LCM (Lossless Context Management) Paper](https://papers.voltropy.com/LCM) von Ehrlich und Blackman – Forschern, die das Plugin später direkt unterstützten. Einer der Co-Autoren des Papers, [@belisarius222](https://github.com/bel
Die Standard-Verdichtung wartet auf einen Überlauf und reagiert dann. Wenn sie ausgelöst wird, hat man bereits die Fähigkeit verloren, den Kontext richtig zu bewahren – man führt eine Notfall-Triage an einem Stapel von Nachrichten durch, die sich über Stunden angesammelt haben. Das Ergebnis ist zwangsläufig verlustbehaftet.
lossless-claw wartet nicht. Es arbeitet **kontinuierlich und asynchron im Hintergrund** und trifft nach jedem Austausch inkrementelle Zusammenfassungsentscheidungen, bevor eine Überlaufkrise auftritt. Die Zusammenfassungen, die es erstellt, sind kein flacher Text.
Jede Nachricht, die in eine lossless-claw-Sitzung eingeht, wird sofort in einer **SQLite-Datenbank** gespeichert. Nicht zusammengefasst – sondern vollständig gespeichert. Dies ist die Quelle der Wahrheit. Sie wird niemals gelöscht.

Wenn die Konversation wächst, erstellt
Level-2-Zusammenfassungen (decken mehrere Level-1-Zusammenfassungen ab)
      ↓
  Level-3-Zusammenfassungen (erfassen wichtige Projektphasen)
```

Die Zusammenfassungen werden zunehmend abstrakter, je weiter sie im Baum
+
[Zusammenfassungs-Knoten, die das verbleibende Token-Budget füllen, vom ältesten zum neuesten]
           +
[Alle Details, die der Agent explizit über lcm_expand anfordert]
```

Das Modell sieht die letzten Nachrichten vollständig und älteres Material als eine Hierarchie von Zusammenfassungen. So sieht ein Zusammenfassungs-Knoten tatsächlich im Kontext des Modells aus:

```xml
<summary id="sum_abc123" kind="condensed" depth="1"
         descendant_count="8"
         earliest_at="2026-02-17T07:37:00"
         latest_at="2026-02-17T15:43:00">
<zusammenfassung>
  <eltern>
    <summary_ref id="sum_def456" />
  </eltern>
  <inhalt>
    Während dieser Sitzung untersuchte der Agent drei Preisstrategien
    für die API
### Die drei Abrufwerkzeuge

Wenn eine Zusammenfassung nicht ausreicht – wenn der Agent den genauen Dateipfad, den präzisen Wortlaut einer Entscheidung oder die tatsächlichen Daten aus einer bestimmten Forschungssitzung benötigt – hat er drei Werkzeuge, um in die Vergangenheit zurückzug
`lcm_expand` ist der entscheidende Befehl. Anstatt die gesamte Erweiterung in den Hauptkontext zu laden – was den Zweck verfehlen würde – verwendet er einen **Sub-Agenten**, um den erweiterten Inhalt zu lesen und nur das spezifische Detail zurückzugeben, nach dem gefragt wurde. Auf das Quellmaterial wird zugegriffen, ohne das aktive Kontextfenster zu sprengen.
Das meint @jalehman mit der Buch-Analogie in seinem Vorschlag: *„es ist, als könnte man zu jeder beliebigen Seite im Buch zurückblättern.“* Das Buch wird nicht zerstört, wenn man es weglegt. Es steht im Regal. Man kann alles nachschlagen
> *"Stell dir vor, du müsstest nie wieder /compact oder /new ausführen. [...] war von den Ergebnissen unglaublich beeindruckt: eine Konversation, die sich anfühlt, als würde sie nie Informationen verlieren (weil sie das in gewisser Weise auch nicht tut), immer im
Für ein quantitativeres Bild: Der Community-Entwickler [@chrysb berichtete am Tag der Veröffentlichung auf Twitter über frühe Benchmark-Ergebnisse](https://x.com/chrysb/status/20305268521465
| Claude Code (Standard) | 70.3 | Standard-Sliding-Window |
| OpenClaw Standard | ~68 (geschätzt) | One-Shot-Verdichtung |

Dies sind von der Community gemeldete Zahlen, keine offiziellen Benchmarks, und sie werden sich weiterentwickeln, je mehr Leute Tests durchführen. Aber die richtungweisende Erkenntnis bleibt strukturell bestehen: **je länger der Kontext wird, desto stärker potenziert sich der Vorteil von lossless-claw**, denn es ist genau das Szenario, in dem eine verlustbehaftete Verdichtung den größten Schaden anrichtet.
Der Co-Autor des LCM-Papiers @belisarius222 hob eine spezifische Verbesserung hervor, die @jalehman gegenüber der ursprünglichen Implementierung des Papiers vorgenommen hatte: **begrenzte Eingabelänge für die Zusammenfassung**. Im ursprünglichen LCM konnte das
## Installation und Konfiguration von lossless-claw

**Voraussetzung: OpenClaw 2026.3.7 oder neuer.** Der Plugin-Slot für die Context Engine existiert in früheren Versionen nicht.
> **Achtung:** Das ursprüngliche Release 2026.3.7 hat einen bekannten P1-Registry-Bug ([Problem #40096](https://github.com/openclaw/openclaw/issues/40096)), bei dem
openclaw --version
# Sollte anzeigen: openclaw 2026.3.7 oder höher (mit dem Registry-Fix)

# Plugin installieren
openclaw plugins install lossless-claw

# Gateway neu starten
openclaw restart
```

In den meisten Fällen konfiguriert
contextEngine: "lossless-claw"
    }
  }
}
```

### Wer sollte es aktivieren

lossless-claw ist nicht die richtige Wahl für jedes OpenClaw-Setup. Es fügt Overhead hinzu – sowohl beim Speicherplatz (eine SQLite-Datenbank, die mit Ihrem Gesprächsverlauf wächst) als auch beim Token-Verbrauch (der Zusammenfassungsprozess selbst verbraucht Tokens).

**Aktivieren Sie lossless-claw, wenn:**
- Ihr Agent rund um die Uhr (24/7) läuft und laufende Projekte bearbeitet
- Sie sitzungsübergreifende Recherchen durchführen, bei denen Kontinuität wichtig ist
- Sie Sub-Agenten-Systeme betreiben, bei denen die Kontextübergabe entscheidend ist
- Sie schon einmal wichtige Informationen durch Komprimierung verloren haben und von vorne anfangen mussten

**Bleiben Sie bei der Standard-Engine, wenn:**
- Sie OpenClaw hauptsächlich für Aufgaben in einer einzigen Sitzung verwenden, die in weniger als einer Stunde abgeschlossen sind
- Sie hochfrequente, kurze Aufgaben ausführen (Cron-Jobs, tägliche Zusammenfassungen, einmalige Abfragen)
- Sie sehr kostensensibel sind und noch nicht auf Komprimierungsprobleme gestoßen sind

### Verwaltung der Token-Kosten
lossless-claw verwendet ein LLM, um Zusammenfassungen zu erstellen. Das kostet Tokens. Bei den meisten langlaufenden Workflows überwiegen die Einsparungen durch die Vermeidung von Sitzungs-Resets den Summarisierungs-Overhead bei weitem — aber wenn Sie kostenbewusst sind, gibt es eine intelligente Methode, dies zu konfigurieren:

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-opus-4-6",
    }
  },
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  }
}
```
Die lossless-claw-Dokumentation empfiehlt, für die Zusammenfassungsarbeit im Hintergrund ein schnelles, günstiges Modell zu verwenden – so etwas wie `anthropic/claude-haiku-4-5` oder `MiniMax-M2.5-highspeed` –, während Ihr primäres Reasoning-Modell unverändert bleibt. Sehen Sie in der [lossless-claw README](https://github.com/Martian-Engineering/lossless-claw) nach dem genauen Konfigurationsschlüssel, um die Zusammenfassung an ein anderes Modell zu leiten. Die Zusammenfassungsaufgabe ist einfach genug, sodass ein kleineres Modell sie gut bewältigt, und der Kostenunterschied ist erheblich.
@jalehmans Implementierung zielt auch darauf ab, den aktiven Kontext durch die adaptive Zusammenfassungs-Kadenz im **30-100k Token-Bereich** zu halten – sodass die Token-Nutzung vorhersagbar bleibt, selbst wenn der
Vor 3.7 stieß jeder Versuch, das Kontextmanagement in OpenClaw zu verbessern, auf dieselbe Hürde: Es war fest einprogrammiert. Man konnte Skills schreiben, die versuchten, den Zustand extern zu verwalten. Man konnte seine SOUL.md strukturieren, um wichtige Fakten zu bewahren. Man konnte an strategischen Momenten manuell `/compact` ausführen. Keiner dieser Ansätze konnte an den Kernmechanismus heranreichen.

Jetzt ist die Schnittstelle offen.

Einige Richtungen, die bereits in der Community diskutiert werden:
**Vektorsuche als Speicher-Backend.** Die SQLite-Volltextsuche eignet sich gut für Stichwortabfragen. Ein Vektor-Embedding-Backend würde eine semantische Suche unterstützen – das Finden von konzeptionell relevanten historischen Inhalten, auch wenn die exakten Wörter nicht vorhanden sind. Die ursprüngliche Volt-Implementierung von @belisarius222 verwendete diesen Ansatz.
**RAG-integrierte Kontext-Engines.** Eine Engine, die nicht nur auf den Gesprächsverlauf zurückgreift, sondern auch auf eine externe Wissensdatenbank – Ihren Notion-Workspace, Ihre Codebasis, Ihre Dokumentenbibliothek –, die bei jedem Durchgang dynamisch zusammengestellt
**Obsidian / Notion als Speicher-Backend.** Anstatt eine lokale SQLite-Datenbank zu verwenden, wird alles in einem strukturierten externen Arbeitsbereich persistent gespeichert, den Sie selbst durchsuchen und bearbeiten können. Der Speicher Ihres Agenten wird von außerhalb des Agenten überprüfbar und durchsuchbar.

Dies sind keine Spekulationen. Sie sind natürliche Erweiterungen derselben Schnittstelle, die lossless-claw bereits implementiert.
Aus Sicht der Infrastruktur entwickeln sich reife Plattformen so. OpenClaw veröffentlichte eine Browser-Automatisierung und öffnete dann das Browser-Tool für Anpassungen. Es veröffentlichte Skills und baute dann ClawHub, um sie zu verteilen. Es veröffentlichte ein Kontextmanagement und öff
Kontextmanagement ist die fundamentalste Ebene in einem Agentensystem. Sie bestimmt, was der Agent weiß, wie er über die Zeit hinweg schlussfolgert und was er bei langlaufenden Aufgaben tatsächlich erreichen kann. Dies zu öffnen ist kein unbedeutendes Feature. Es ist eine
**Themenbezogenes Agenten-Routing in Telegram.** Forum-Gruppen können jetzt verschiedene Themen an unterschiedliche Agenten weiterleiten. Eine Telegram-Gruppe, mehrere spezialisierte Agenten – jeder bearbeitet einen anderen Themen-Thread mit isolierten Sitzungen. Dies war seit Monaten eine gewünschte Funktion für Multi-Agenten-Team-Setups.

**Vorbereitung für iOS App Store Connect.** Bundle-Identifier, Fastlane-Automatisierung, Screenshot-Metadaten – die gesamte Infrastruktur für eine Einreichung im App Store befindet sich jetzt in der Codebasis. OpenClaw für Mobilgeräte kommt.

---
## Das Fazit

OpenClaw hatte von Anfang an eine stille Obergrenze: Je länger Ihr Agent läuft, desto mehr vergisst er. Jeder ernsthafte Anwendungsfall stößt irgendwann darauf. Die Community hat dies seit Monaten mit SOUL.md-Tricks, manuellem
lossless-claw ist die erste Antwort – ein DAG-basiertes Zusammenfassungssystem, das alles speichert, inkrementell zusammenfasst und es Agenten ermöglicht, exakte historische Details bei Bedarf abzurufen. Frühe Benchmark-Zahlen der Community zeigen, dass es die Standard-Engine von Claude Code bei jeder getesteten Kontextlänge übertrifft, wobei der Abstand mit zunehmender Gesprächslänge größer wird.

Wenn bei Ihnen jemals ein Agent etwas vergessen hat, das er nicht hätte vergessen sollen, ist dieses Release genau das Richtige für Sie.

openclaw update
openclaw plugins install lossless-claw
```

Das ist die ganze Migration.

---

*Wie lange dauert es, bis bei Ihren Agenten die Kompaktierung einsetzt? Und was verlieren Sie dabei? Schreiben Sie es in die Kommentare – wir verfolgen, wie sich die
*Quellen: [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) · [OpenClaw Diskussion #22251](https://github.com/openclaw/openclaw/discussions/22251) · [OpenClaw 2026.3.7 Veröffentlichungshinweise](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) · [LCM Paper, Ehrlich & Blackman](https://papers.voltropy.com/LCM)*