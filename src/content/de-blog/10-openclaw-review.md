---
title: "Wir haben 5 Wege getestet, einen OpenClaw-Agenten auszuführen. Hier ist, was wirklich funktioniert."
description: "207.000 GitHub-Sterne bedeuten, dass jeder es ausprobieren will. Aber die Bereitstellungsoptionen haben sich schneller vervielfacht als die Dokumentation. Wir haben zwei Wochen damit verbracht, jede wichtige Option – von selbst gehostet bis zur Ein-Klick-Cloud – auszuführen, damit Sie wissen, worauf Sie sich einlassen, bevor Sie sich festlegen."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "16 min"
tags: ["OpenClaw", "Review", "AI Agent", "Deployment", "AgentPuter", "TinyClaw"]
featured: true
---

*Teil 10 der Serie zur Agenten-Infrastruktur*

---

OpenClaw hat 207.000 GitHub-Sterne. Diese Zahl steigt täglich um etwa 2.000.

---

Das bedeutet, viele Leute schauen zu. Und jede Woche taucht ein neuer „Deploy OpenClaw in one click“-Dienst auf. Es gibt EasyClaw – genauer gesagt fünf verschiedene Produkte mit diesem Namen. Es gibt InstaClaw. Es gibt OpenClaw Cloud, die offizielle gehostete Version. Es gibt zwei komplett unterschiedliche GitHub-Repositories, die beide TinyClaw hei

---

Bitte geben Sie den zu übersetzenden Text an. Der Abschnitt nach `---` ist leer.

---

## Was wir getestet haben (und wie)

Fünf Konfigurationen:

1. **Self-hosted Mac Mini M4** – das Standard-Setup
2. **Self-hosted VPS** – Linux-Cloud-Server, nur SSH
3. **TinyClaw** – Cloud-Laufzeitumgebung von AgentPuter, Ein-Klick-Bereitstellung
4. **OpenClaw Cloud** –

---

Für jedes Setup haben wir gemessen:
- **Zeit bis zur ersten Nachricht** (von null bis zur Konversation mit dem Agenten)
- **Zuverlässigkeit** über 7 Tage (Verfügbarkeit, verlorene Nachrichten, Neustartverhalten)
- **Funktionsumfang** (was tatsächlich funktioniert vs. was zusätzliche Konfiguration erfordert)
- **Le

---

## Option 1: Selbst gehosteter Mac Mini M4

**Zeit bis zur ersten Nachricht:** 22 Minuten
**7-Tage-Verfügbarkeit:** 100 %
**Monatliche Kosten:** ~$35 (API) + $0 amortisierte Hardware

Dies ist die Basislinie und sie legt die Messlatte hoch.

Die Installation besteht aus einem einzigen Befehl – `openclaw onboard --install-daemon` – und der Assistent führt Sie durch jeden Schritt. Der Engpass ist nicht die Software, sondern die Verwaltung der API-Schlüssel und die Einrichtung des Telegram-Bots, was für sich allein schon etwa 10 Minuten dauert, wenn man es noch nie zuvor gemacht hat.

---

Sobald es läuft, übertrifft das Mac mini-Setup jede Cloud-Option in einigen spezifischen Dingen. Die iMessage-Integration über BlueBubbles funktioniert, und nichts anderes kann da mithalten. Mit Voice Wake können Sie über die native macOS-App freihändig mit Ihrem Agenten sprechen – eine Funktion, die bei keiner Cloud-Bereitstellung verfügbar ist. Der Zugriff auf das lokale Dateisystem bedeutet, dass Ihr Agent mit Dateien arbeiten kann, die Ihren Rechner niemals verlassen.

---

Die SOUL.md-Datei ist der Punkt, an dem sich dies von allem anderen zu unterscheiden beginnt. Es ist kein System-Prompt. Es ist eine persistente Identitätsdatei, die dein Agent jeden Tag beim Start liest. Nachdem ich sie eine Woche lang ergänzt hatte, kannte der Agent meinen Zeitplan, meinen Kommunikationsstil, meine Vorlieben für E-Mail-Antwort

---

Wenn Sie einen Mac mini haben oder bereit sind, einen zu kaufen, ist dies die Antwort. Nichts anderes kommt an den maximalen Funktionsumfang heran.

---

---

## Option 2: Selbstgehosteter VPS (Linux)

**Zeit bis zur ersten Nachricht:** 28 Minuten
**7-Tage-Verfügbarkeit:** 100 %
**Monatliche Kosten:** ~$35 (API) + $6 (VPS)

Für Linux-Benutzer und Entwickler, die Root-Zugriff möchten, ist

---

Der Nachteil ist der DevOps-Aufwand. Wenn Ihr Agent um 2 Uhr nachts nicht mehr reagiert, müssen Sie sich per SSH auf einem Server anmelden, um die Logs zu überprüfen. Wenn Sie sich damit wohlfühlen, ist dies eine solide Option. Andernfalls springen Sie zu den gehosteten Optionen.

Hervorzuheben ist: Das Docker-Sandboxing – das

---

Gleiche Leistungsgrenze wie der Mac mini, mehr Flexibilität, mehr Wartungsaufwand. Am besten für Entwickler, die bereits Server verwalten und nicht noch etwas Neues lernen möchten.

---

---

## Option 3: TinyClaw

**Zeit bis zur ersten Nachricht:** 48 Sekunden
**7-Tage-Verfügbarkeit:** ~99,9 %
**Monatliche Kosten:** $49,99/Monat (inklusive Modell)

TinyClaw ([tinyclaw.dev](https://tinyclaw.dev)) ist die Cloud

---

Die Antwortzeiten betrugen im Durchschnitt 6–8 Sekunden für Standardanfragen und blieben auf diesem Niveau. Das ist der praktische Vorteil von isolierten Containern gegenüber Shared Compute: nicht schneller unter idealen Bedingungen, aber konsistent, wenn die Bedingungen nicht ideal sind. Die Internetverbindung Ihres heimischen Mac mini ist eine Variable; die eines Cloud-Containers nicht.

Die Installation von Skills verlief reibungslos. Von den 12 Skills, die wir aus dem ClawHub getestet haben, ließen sich 11 ohne Probleme installieren. Der einzige Fehlschlag – eine Spotify-Integration, die eine OAuth-Redirect-Konfiguration erfordert – hätte auf jeder Plattform eine manuelle Einrichtung erfordert.

---

Kein Voice Wake, kein iMessage, kein lokales Dateisystem. Dies sind strukturelle Einschränkungen der Cloud-Bereitstellung, nicht spezifisch für TinyClaw. Wenn Sie etwas davon benötigen, ist Self-Hosting der einzige Weg.

Die Hintergrundgeschichte von AgentPuter ist wichtig, wenn Sie darüber nachdenken, über einen einzelnen Agenten hinauszuwachsen. Dieselbe Infrastruktur unterstützt mehrere OpenClaw-Instanzen unter einem Konto – verschiedene Agenten für verschiedene Kontexte oder gemeinsamer Zugriff für Teammitglieder. Das ist nicht im Basis-Plan enthalten, aber es ist verfügbar, wenn Ihr Bedarf wächst.

---

---

## Option 4: OpenClaw Cloud

**Zeit bis zur ersten Nachricht:** 2 Minuten 10 Sekunden  
**7-Tage-Verfügbarkeit:** ~98,4 %  
**Monatliche Kosten:** 0 $ (kostenloser Tarif, 14 Rechenzeit-Tage/Monat) oder 9,99 $/Monat Pro

OpenClaw Cloud (open.claw.cloud) ist die offiziell empfohlene gehostete Version. Das Hauptunterscheidungsmerkmal ist der kostenlose Tarif: 14 Tage Rechenzeit pro Monat, angetrieben von Kimi K2.5. Beachten Sie, dass zum Zeitpunkt unseres Tests der Pro-Tarif für 9,99 $/Monat noch als „Coming Soon“ (in Kürze verfügbar) gekennzeichnet war – daher basiert ein Teil dieses Abschnitts auf dem kostenlosen Tarif, der tatsächlich verfügbar war.

---

Der kostenlose Plan ist mehr als eine Demo. Du erhältst vorinstallierte Skills, eine Telegram-Integration, persistenten Speicher, Browser-Automatisierung und deine eigene dedizierte virtuelle Maschine. Wenn deine 14 kostenlosen Rechenzeit-Tage abgelaufen sind, schaltet sich die VM aus, aber deine Daten bleiben erhalten. Schalte sie wieder ein, wenn du mehr

---

Das Kimi K2.5-Modell ist eine Bemerkung wert. Für die meisten praktischen Aufgaben – das Zusammenfassen von E-Mails, das Entwerfen von Antworten, die Kalenderverwaltung – hat es sich im Test gut geschlagen. Der Unterschied zu Claude Opus 4.6 wurde bei komplexen, mehrstufigen Denkprozessen deutlich: „

---

Das Onboarding dauert etwas länger als bei TinyClaw, da die Konfiguration über ein Web-Dashboard anstatt über einen Assistenten erfolgt. Die Anbindung von Telegram dauerte etwa 2 Minuten. Die Skill-Verwaltung ist vollständig offengelegt, was gut ist, wenn man weiß, was man will, und verwirrend, wenn nicht.

Der günstigste Weg zu einem echten OpenClaw-Erlebnis. Die beste Wahl, wenn Sie es ausprobieren möchten, bevor Sie sich festlegen.

---

---

## Option 5: EasyClaw.ai

**Zeit bis zur ersten Nachricht:** 4 Minuten  
**7-Tage-Verfügbarkeit:** 99,1 %  
**Monatliche Kosten:** $19–$49 je nach Tarif

Das Alleinstellungsmerkmal von EasyClaw.ai ist der browserbasierte Desktop-Zugriff – eine vollständige Ansicht der Container-Umgebung Ihres Agenten in einem Browser-Tab. Sie können sich bei Konten anmelden, die eine Browser-Authentifizierung erfordern, Tools installieren und Konfigurationsdateien ändern. Dinge, auf die Sie bei verwalteten Plattformen normalerweise keinen Zugriff haben.

Wir haben dies genutzt, um eine Gmail-Integration einzurichten, die eine Authentifizierung über einen Browser-Flow erfordert – unkompl

---

Die Preisstufen betragen 5 $ (Entwickler, eigener VPS), 19 $ (verwaltet) und 49 $ (vollständig verwaltet mit Premium-Support). Bei 49 $ pro Monat erreicht man fast den Punkt, an dem ein selbstverwalteter VPS finanziell sinnvoller ist, es sei denn, man wünscht sich wirklich die sorgenfreie Wart

---

## Die Open-Source-Variantenlandschaft

Über gehostete Dienste hinaus sind die Open-Source-Derivate erwähnenswert, obwohl sie sich an eine engere Zielgruppe richten.

---

**TinyClaw (jlia0-Version)** ist eine Neuimplementierung des OpenClaw-Konzepts in ungefähr 400 Zeilen Shell-Skript – erstellt mit Claude Code und tmux anstelle von Node.js und einem vollständigen Framework. Es führt mehrere isolierte Agenten parallel über Discord, WhatsApp und Telegram aus und koordiniert sie über dateibasierte Nachrichtenwarteschlangen, die Race Conditions verhindern. Stand Februar 2026 hat es etwa 2.000 GitHub-Sterne, wobei die Codebasis klein genug ist, um sie an einem Nachmittag zu lesen. Wenn Sie verstehen möchten, was tatsächlich unter der Haube passiert, oder einen Agenten in eine eingeschränkte Umgebung einbetten müssen, ist dies der direkteste Weg.

---

**TinyClaw (warengonzaga-Version)** ist ein völlig anderes Projekt – ein TypeScript-Rewrite, das sich ausdrücklich als „ein vollständig unabhängiges Produkt und eine Alternative zu OpenClaw“ positioniert. Es legt den Schwerpunkt auf eine Plugin-Architektur, einen sich selbst verbessernden Speicher und intelligentes Query-Routing, um die LLM-Kosten zu senken. Weniger auf die Ausführung von Aufgaben ausgerichtet, mehr auf einen „persönlichen KI-Begleiter“. Beobachtenswert, aber noch früh.

Keines von beiden konkurriert direkt mit gehosteten Diensten. Sie sind Werkzeuge für Entwickler, die den zugrunde liegenden Mechanismus verstehen und verändern wollen.

---

---

## Vergleichstabelle

| | Mac Mini | VPS | TinyClaw | OpenClaw Cloud | EasyClaw.ai |
|---|---|---|---|---|---|
| **Einrichtungszeit** | 22 Min. | 28 Min. | 48 Sek. | 2 Min. | 4 Min. |
| **Monatliche Kosten** | $35 API | $41 | $49.99 | $0–$10 | $19–$49 |
| **7-Tage-Verfügbarkeit** | 100% | 100% | ~99.9% | ~98.4% | ~99.1% |
| **Antwortkonsistenz** | Variabel (ISP-abhängig) | Hoch | Hoch | Hoch | Hoch |
| **iMessage** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Sprachaktivierung** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Datensouveränität** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **Skills-Kompatibilität** | 100% | 100% | ~92% | 100% | ~90% |
| **Am besten für** | Power-User | Entwickler | Cloud-First-Nutzer | Budget / kostenlose Stufe | Entwickler + verwaltet |

---

---

## Was wir tatsächlich tun würden

Wenn Sie noch nie einen Agenten ausgeführt haben: Starten Sie mit OpenClaw Cloud. Der kostenlose Tarif gibt Ihnen 14 Tage Zeit, um herauszufinden, ob dies etwas für Sie ist, ohne Geld auszugeben oder ein Terminal bedienen zu müssen.

Sobald Sie wissen, dass Sie es zuverlässig betreiben möchten: TinyClaw ist das sauberste Upgrade. Isolierte Container, konsistente

---

Wenn es um Datensouveränität geht, Sie Voice Wake benötigen oder iMessage wichtig ist: Hosten Sie selbst. Der Mac mini ist die naheliegende Hardware-Wahl — 599 $, leise, 3–4 W im Leerlauf, führt macOS nativ aus. Keine Cloud-Option kann Ihnen das bieten, was Local-First leistet.

Wenn Sie als

---

## Die ehrliche Einschätzung

„Funktionierend“ und „nützlich“ sind nicht dasselbe. Jede von uns getestete Option funktionierte innerhalb der ersten Stunde. Nützlich zu werden, dauerte länger – dafür musste SOUL.md Kontext ansammeln, die tatsächlich genutzten Tools mussten verbunden werden und dem Agenten mussten Aufgaben gegeben werden, die von

---

Das Skills-Ökosystem ist die größte offene Frage. Die Sicherheitsfirma Koi Security auditierte ClawHub Anfang Februar 2026 und fand 341 bösartige Skills unter 2.857 analysierten – etwa 12 % des Katalogs. Die meisten davon stammten von einem einzigen Angreifer-Konto, das 314 vergiftete Skills in einer Woche veröffentlichte, bevor es entdeckt wurde. OpenClaw hat seitdem Überprüfungsprozesse hinzugefügt, aber der Katalog ist zu groß, um ihn manuell zu überprüfen. Behandeln Sie Community-Skills wie Browser-Erweiterungen: nützlich, oft ausgezeichnet, und es lohnt sich, einen kurzen Blick auf den Quellcode zu werfen, bevor Sie etwas installieren, das Systemzugriff anfordert.

---

207.000 GitHub-Sterne bedeuten, dass etwas richtig gemacht wurde. Ob diese spezielle Sache das Richtige für Sie ist, ist die Frage, die eine Woche zur Beantwortung benötigt, nicht eine Landingpage.

---

*Teil 10 der Serie zur Agenten-Infrastruktur. Frühere Beiträge behandelten die [Architektur](/blog/dis

---

*Referenzen:*
- [OpenClaw GitHub-Repository](https://github.com/openclaw/openclaw) (207K Sterne, v2026.2.17)
- [TinyClaw – Ein-Klick-Bereitstellung von OpenClaw](https://tinyclaw.dev)
- [OpenClaw Cloud](https://open.claw.cloud)
- [EasyClaw.ai](https://www.easyclaw.ai)
- [TinyClaw (jlia0)](https://github.com/jlia0/tinyclaw)
- CVE-2026-25253 – Schwachstelle im OpenClaw-Gateway (referenziert in unserer Sicherheitsanalyse)