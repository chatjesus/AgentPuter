---
title: "Perplexity hat gerade das gebaut, was OpenClaw-Nutzer bereits selbst betreiben"
description: "Am 25. Februar startete Perplexity Computer – eine Cloud-KI, die 19 Modelle orchestriert und autonome Aufgaben für 200 $/Monat ausführt. Was OpenClaw-Nutzer bereits haben, was fehlt, und was das für den Plattformwettbewerb bedeutet."
date: "2026-02-28"
author: "AgentPuter Lab"
readingTime: "14 min"
tags: ["OpenClaw", "Perplexity", "KI-Agent", "Multi-Agent", "Agenten-Plattform"]
featured: true
---


Am 25. Februar startete Perplexity "Computer" – ein Cloud-KI-System, das 1
Ars Technicas Zusammenfassung des Produkts: *"Dann gibt es da OpenClaw, das man als den unmittelbaren Vorgänger dieses Konzepts wahrnehmen könnte."*

Dieser Beitrag behandelt, was Perplexity Computer tatsächlich ist, wo es mit OpenClaw übereinstimmt, wo
5. [Was Perplexity besser kann](#does-better)
6. [Für wen jeder tatsächlich ist](#who-for)
7. [Was das für den Wettlauf der Agenten-Plattformen bedeutet](#platform-race)

---

## 1. Was Perplexity Computer tatsächlich ist {#what-it-is}
Der Pitch: Man beschreibt ein Ergebnis in einfacher Sprache und der Computer findet heraus, wie er es erreicht. „Plane und führe eine digitale Marketingkampagne für mein Restaurant durch.“ „Erstelle mir eine Android-App, die mir hilft, meinen Lesefortschritt zu verfolgen.“
Hinter dieser Schnittstelle zerlegt der Computer die Anfrage in strukturierte Teilaufgaben, delegiert jede an das für den spezifischen Schritt am besten geeignete seiner 19 verfügbaren Modelle und führt sie – einige parallel, andere seriell – aus, bis die Arbeit erledigt ist.
| Veo 3.1 | Videogenerierung |
| Grok | Leichtgewichtige, geschwindigkeitskritische Aufgaben |

Insgesamt 19 Modelle – die obige Tabelle zeigt die wichtigsten benannten. Opus ist die Orchestrierungsebene; es entscheidet, welches Modell welche
**Die Umgebung:** Jede Aufgabe läuft in einer isolierten Cloud-Computing-Umgebung mit Zugriff auf ein echtes Dateisystem, einen echten Browser und vorinstallierte Tool-Integrationen. Nichts davon läuft auf Ihrem lokalen Rechner. Die Integrationen werden von Perplexity kuratiert
**Preise:** 200 $/Monat für Perplexity Max, was 10.000 Credits beinhaltet. Der Computer verbraucht Credits im Betrieb – die Nutzung ist nicht unbegrenzt. Sie können pro Sub-Agent Ausgabenlimits festlegen, was Ihnen eine tats
**Ein Vorbehalt zur Marketingsprache:** Laut Perplexity ist Computer „in der Lage, stunden- oder sogar monatelang zu laufen.“ Das Produkt kam am 25. Februar auf den Markt. Bisher hat niemand die mehrmonatige Behauptung in einem realen Arbeitsabl
> *"KI-Agenten sind bemerkenswert fähig – aber sie haben kein Zuhause, keinen persistenten Arbeitsbereich, keinen eigenen Computer."*

Perplexity Computer ist eine kommerzielle Implementierung genau dieser These.
Dies ist kein Fall, in dem Perplexity diesen Beitrag gelesen und ein Produkt entwickelt hat. Perplexity begann im Januar mit internen Experimenten – bevor Blog #01 veröffentlicht wurde. Hier kommen mehrere Teams unabhängig voneinander zu demselben Schluss. Was an sich schon ein Signal ist: Das Problem ist real und offensichtlich
| Persistenter Arbeitsbereich | Cloud-Dateisystem pro Aufgabe | `~/.openclaw/data/` |
| Multi-Modell-Routing | 19 Modelle, Opus-orchestriert | `model.fallbacks` + `modelByChannel` |
| Sub-Agenten-Koordination | Aufgabenzerlegung → Agentendelegation | `sessions_spawn` Fan-Out |
| Langlaufende Autonomie | Angegeben: Stunden bis Monate | Cron + `runTimeoutSeconds` |
| Echter Browser | Eingebaut | `browser_snapshot`, `browser_navigate` |
| Agenten-Kontextdateien | Plattformverwaltet, für Benutzer nicht sichtbar | `SOUL.md`, `USER.md`, `HEARTBEAT.md` |
| Ausgabenkontrollen | Kreditlimits pro Sub-Agent | `runTimeoutSeconds` (zeitbasierter Proxy) |

Die Designentscheidungen entsprechen sich fast eins zu eins. Persistenter Speicher, Browser-Zugriff, Multi-Modell-Routing, Sub-Agenten-Parallelität, langlebige Autonomie – das sind keine Funktionen, die Perplexity erfunden hat. Es sind Funktionen, die die OpenClaw-Community seit letztem Jahr in konfigurierbarer Form nutzt.
Der Schöpfer von OpenClaw, Peter Steinberger, ist im Februar zu OpenAI gewechselt. Altman beschrieb persönliche Agenten als etwas, das „schnell zum Kern unserer Produktangebote werden wird“, und sagte, die Zukunft „wird extrem von Multi-Agenten
Ars Technica hat es gut ausgedrückt: *„Wenn OpenClaw das offene Web der KI-Agenten-Tools wäre, dann ist Computer der App Store von Apple.“*

Diese Analogie ist zutreffend und es lohnt sich, sie auf sich wirken
| Dimension | Perplexity Computer | OpenClaw |
| --- | --- | --- |
| Ausführungsort | Nur in der Cloud | Lokaler Rechner, selbst gehosteter VPS oder TinyClaw |
| Integrationsmodell | Kuratierte Plattform-Integrationen | Open Skills + MCP-Ökosystem |
| Konfiguration | Plattformverwaltet, für den Benutzer unsichtbar | `openclaw.json`, volle Benutzerkontrolle |
| Sicherheitsmodell | Die Plattform ist verantwortlich | Der Benutzer ist verantwortlich |
| Anpassungsgrenze | Niedrig – nutzen, was Perplexity bereitstellt | Hoch – alles konfigurierbar |
| Transparenz | Blackbox | Vollständiges Transkript über `sessions_history` |
| Datenspeicherort | Perplexity-Cloud | Ihr Computer oder Ihr Server |
| Ausgabenkontrolle | Kreditlimits pro Sub-Agent | `runTimeoutSeconds` (Zeit-Proxy) |

Der Kompromiss verläuft konsistent in eine Richtung: Perplexity gibt die Kontrolle im Austausch für Einfachheit und Sicherheit auf; OpenClaw gibt die Einfachheit im Austausch für Kontrolle und Erweiterbarkeit auf.

---

## 4. Was Perplexity nicht kann {#cant-do}
Das sind keine Randfälle – es sind Fähigkeiten, die OpenClaw-Benutzer als selbstverständlich ansehen.

**SOUL.md – persistente Agenten-Identität**

Bei OpenClaw ist `SOUL.md` eine Datei, die sitzungsübergre
Perplexity Computer hat keine Entsprechung. Jede Aufgabe beginnt mit den Standardeinstellungen der Plattform. Man kann keinen persistenten Anweisungssatz schreiben, man kann nicht definieren, wie der Agent mit Mehrdeutigkeiten umgehen soll, man kann ihm keinen Charakter geben, der bestehen bleibt. Der Agent, mit dem Sie heute arbeiten, hat keine Erinnerung an irgendwelche Präferenzen, die Sie festgelegt haben.

**Benutzerdefinierte Cron-Zeitplanung**

Perplexity Computer ist reaktiv. Sie beschreiben eine Aufgabe; er führt sie aus. Sie sind immer derjenige, der sie startet.
OpenClaw führt geplante Workflows autonom aus. „Jeden Wochentag um 7:50 Uhr die gestrigen GitHub-Aktivitäten abrufen, die zu überprüfenden PRs zusammenfassen und eine Zusammenfassung an Telegram senden.“ Niemand drückt
OpenClaw stellt einen `/hooks/agent`-Endpunkt bereit. Ein GitHub-Webhook wird ausgelöst, wenn ein PR geöffnet wird; der Agent liest den Diff, führt eine Überprüfung durch und postet Feedback auf Slack – all das ohne menschliches Zutun. Das externe Ereignis steuert den
Wenn Ihr Workflow auf Dateien auf Ihrem Rechner zugreift – beispielsweise zum Lesen von Code aus einem lokalen Repo, zum Verarbeiten von Dokumenten in Ihrem Dateisystem oder zur Interaktion mit lokalen Anwendungen – kann Perplexity Computer nicht darauf zugreifen. Alles läuft in der Cloud-Umgebung
Das Ökosystem von OpenClaw umfasst Tausende von Skills auf ClawHub und agentskills.io sowie Unterstützung für benutzerdefinierte MCP-Server. Sie können einen Skill installieren, der sich mit Ihren internen Tools verbindet, einen benutzerdefinierten Skill schreiben, der den Arbeitsablauf Ihrer
`sessions_history` in OpenClaw gibt Ihnen ein vollständiges, einsehbares Transkript von allem, was der Agent getan hat: jeden Tool-Aufruf, jede Modellantwort, jeden Entscheidungspunkt. Wenn etwas schiefgeht, können Sie genau nachlesen, was passiert ist
## 5. Was Perplexity besser macht {#does-better}

Es ist wichtig, ehrlich zu sein, was man für die 200 $/Monat bekommt. Einige davon sind echte Vorteile, nicht nur Marketing.

**Keine Einrichtung**

Kein Server zum Bereit
Bei OpenClaw gibt es, selbst wenn TinyClaw die Infrastruktur verwaltet, immer noch einen wesentlichen Einrichtungsschritt: das Verbinden von Kanälen, das Schreiben der SOUL.md, die Konfiguration des Modell-Stacks und das Festlegen von Cron-Zeitpl
Opus entscheidet, welches von 19 Modellen jede Teilaufgabe übernimmt. Sie legen nicht fest: „Nutze Gemini für die Recherche, Nano Banana für Bilder und Grok für einfache Aufgaben.“ Dieses Routing erfolgt automatisch, basierend darauf, was das System von Perplexity als die
Bei OpenClaw erfordert der Aufbau eines äquivalenten Multi-Modell-Routings eine bewusste Konfiguration: das Setzen von `subagents.model`, die Verwendung von `modelByChannel`, das Schreiben von `model.fallbacks` und potenziell das Schreiben einer benutzerdefinierten Routing-Logik in `AGENTS.md`. Es ist machbar – aber es bedeutet Arbeit.

**Ausgabenlimits pro Sub-Agent**
Das ist der einzige Bereich, in dem Perplexity etwas bietet, was OpenClaw explizit nicht hat. Kreditbasierte Ausgabenlimits ermöglichen es festzulegen: „Diese Forschungs-Teilaufgabe darf nicht mehr als X kosten.“ Das ist eine direkte Kostenkontrolle auf Dollar
Browser, Code-Ausführung, Bilderzeugung, Videoerzeugung — diese funktionieren von Haus aus, ohne Debugging, ohne Verwaltung von Anmeldeinformationen. Bei OpenClaw erfordert jede Fähigkeit entweder eine Skill-Installation, eine MCP-Serverkonfiguration oder einen API-Schlüssel
Der ClawHavoc-Vorfall ist das deutlichste Beispiel für das Risiko. Im Februar 2026 wurden auf ClawHub 341 bösartige Skills bei einem koordinierten Lieferkettenangriff entdeckt. Die primäre Nutzlast war Atomic Stealer (AMOS)
Das geschlossene Modell von Perplexity Computer beseitigt diese Angriffsfläche vollständig. Man kann keinen bösartigen Skill installieren, weil man überhaupt keine Skills installieren kann.

**Geschäftliche Verantwortlichkeit**

Für 200 $ pro Monat erhalten Sie einen Supportvertrag, ein
## 6. Für wen sie jeweils wirklich gedacht sind {#who-for}

Diese konkurrieren nicht um dieselben Nutzer. Das ist wichtig, weil die Darstellung als Konkurrenten zu der falschen Schlussfolgerung führt, welches man verwenden sollte.

**Perplexity Computer:**
Der Nutzer, der am meisten von Perplexity Computer profitiert, hat cloudbasierte Workflows, muss nicht auf lokale Dateien zugreifen oder auf externe Ereignisse reagieren, fühlt sich damit wohl, dass eine Plattform alle Routing- und Infrastrukturentscheidungen verwaltet, und legt mehr Wert auf
Ein Marketingberater, der die Wettbewerbsrecherche automatisiert. Ein Autor, der KI zur Unterstützung bei Recherchen und Entwürfen einsetzt. Ein Kleinunternehmer, der Kundenkommunikations-Workflows automatisieren möchte, die vollständig in Cloud-Diensten ablaufen. Für diese Benutzer ist die OpenClaw-Konfigurationsebene Reibung – kein Mehrwert. Perplexity Computer beseitigt diese Reibung für 200 $/Monat.

**OpenClaw:**
Der Nutzer, der am meisten von OpenClaw profitiert, hat spezifische Infrastrukturanforderungen: lokaler Dateizugriff, Cron-gesteuerte autonome Workflows, Webhook-gesteuerte Ereignisbehandlung, benutzerdefinierte Skills für proprietäre Tools oder Datenresidenzanforderungen, die „läuft in der Cloud von Perplexity“ zu einem Ausschlusskriterium machen.
Ein Ingenieur, der einen PR-Review-Bot möchte. Ein Entwickler, der Agenten benötigt, die mit Code in einem lokalen Repo arbeiten. Ein Operations-Team, das autonome Monitoring-Workflows benötigt, die gegen die interne Infrastruktur laufen. Ein Forscher, der langlebige
Der eindeutigste Test: Wenn Ihr Workflow ohne menschliche Eingabe (Cron oder Webhook) gestartet werden muss oder auf Dateien zugreifen muss, die nicht in der Cloud von Perplexity liegen, sind Sie ein OpenClaw-Benutzer. Wenn Ihre Workflows von Ihnen initiiert werden und vollständig in Cloud-Diensten ablaufen, ist Perplexity Computer eine Überlegung wert.

Beide Gruppen existieren. Beide werden wachsen. Der Markt für Agenten-Infrastruktur ist groß genug für beide Ansätze, und die beiden werden wahrscheinlich eher divergieren
## 7. Was dies für das Rennen der Agenten-Plattformen bedeutet {#platform-race}

**Die Infrastruktur-These ist entschieden.**

Anfang 2025 war „Agenten benötigen ihre eigene persistente Rechenumgebung“ eine Behauptung, für die
Der Wettbewerb dreht sich jetzt darum, wem die Infrastrukturschicht gehört – nicht darum, ob die Infrastrukturschicht existiert.

**Die Open-Source-zu-kommerziell-Pipeline läuft nach Plan.**
OpenAI stellte den Schöpfer von OpenClaw ein. Perplexity entwickelte ein Produkt auf Basis des Konzepts. Anthropic entwickelte Claude Cowork. Das Muster entspricht dem, was bei Linux → Red Hat → AWS, bei Android → Samsung und bei Git → GitHub geschah. Open Source definiert
Die Frage, die es sich für das OpenClaw-Ökosystem zu stellen lohnt: Behält die offene, konfigurierbare Version ihren besonderen Wert, während sich die geschlossenen, ausgefeilten Versionen verbessern? Historisch gesehen lautet die Antwort ja – aber das
Das ist der aktuelle Preis für die ausgefeilteste, einrichtungsfreie und von 19 Modellen orchestrierte Version dieser Fähigkeit. Inbegriffen sind 10.000 Credits – keine unbegrenzte Nutzung.
TinyClaw stellt dieselbe zugrundeliegende Multi-Agenten-Architektur in weniger als einer Minute bereit, zu erheblich geringeren Kosten und mit Zugriff auf Cron-Scheduling, Webhooks, lokalen Dateizugriff sowie das gesamte OpenClaw Skills-Ökosystem. Das Wert
Der Markt ist real. Das Rennen um die Infrastruktur hat begonnen. OpenClaw war der Open-Source-Prototyp, der das Konzept bewiesen hat. Perplexity Computer ist eine der ersten großen kommerziellen Wetten darauf. Erwarten Sie mehr.

---

## Kurzübersicht

| | Perplexity Computer | OpenClaw + TinyClaw |
| --- | --- | --- |
| Preis | 200 $/Monat (10.000 Credits inklusive) | Open-Source + TinyClaw-Preise |
| Einrichtungszeit | Sekunden | Minuten bis Stunden |
| Modellanzahl | 19 (automatisch von Opus geroutet) | Konfigurierbar (jeder Anbieter) |
| Ausgabenlimits | Guthabenbasiert, pro Sub-Agent | Zeitbasiert (`runTimeoutSeconds`) |
| Anpassung | Gering | Hoch |
| Lokaler Dateizugriff | Nein | Ja |
| Cron / geplante Aufgaben | Nein | Ja |
| Webhook-Aufnahme | Nein | Ja |
| Benutzerdefinierte Skills / Plugins | Nein | Ja (ClawHub, agentskills.io) |
| Persistente Agenten-Identität | Nein | Ja (`SOUL.md`) |
| Datenspeicherort | Perplexity's Cloud | Ihre Wahl |
| Vollständiger Audit-Trail | Nein | Ja (`sessions_history`) |

---

## Ressourcen
- [Perplexity Computer Ankündigung](https://www.perplexity.ai/hub/blog/introducing-perplexity-computer)
- [Ars Technica: Perplexity kündigt „Computer“ an](https://arstechnica.com/ai/2026/02/perplexity-announces-computer-an-ai-agent-that-assigns-work-to-other-ai-agents/)
- [agentputer.com](https://agentputer.com/) – 24/7 Cloud-Hosting für OpenClaw
- [tinyclaw.dev](https://tinyclaw.dev/) – Ein-Klick-Bereitstellung
- [docs.openclaw.ai](https://docs.openclaw.ai/) – OpenClaw-Dokumentation
- [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) — OpenClaw-Repository

---

*Quellen: Perplexity-Blog · Ars Technica · TechCrunch · The Verge · gHacks · The Tech Outlook · Feb. 2026*