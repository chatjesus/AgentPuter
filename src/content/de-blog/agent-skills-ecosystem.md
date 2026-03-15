---
title: "Agent Skills: Der App Store der KI-Welt nimmt Gestalt an"
description: "Über 170.000 Open-Source-Skills, die fehlende Gateway-Schicht und warum die Agenten-Plattform dem Playbook von Windows folgt."
date: "2026-02-09"
author: "AgentPuter Lab"
readingTime: "15 min"
tags: ["OpenClaw", "AI Agent", "Skills", "MCP", "Agent Gateway", "AgentPuter"]
featured: true
---

In unseren ersten beiden Beiträgen haben wir uns eingehend mit OpenClaw beschäftigt – was es ist, wie seine Brain-Body-Soul-Architektur funktioniert und welche Sicherheitslehren wir aus 1.100 exponierten Gateway-Ports gezogen haben.

Aber es gibt eine Sache, die wir immer wieder erwähnt, aber nie vollständig erklärt haben: **Skills**.

OpenClaw wird mit über 100 integrierten Skills ausgeliefert. Anthropic hat Skills zu einem offenen Standard gemacht. SkillsMP hostet bereits über 170.000 Open-Source-Skills.

Diese Zahlen werfen eine größere Frage auf:

**Was genau sind Skills? Wie hängen sie mit MCP zusammen? Und ist das wirklich der „App-Store-Moment“ der KI-Welt?**

Bringen wir mal Ordnung in die Sache.

---

## I. Das grundlegende Problem, das Skills lösen

Wenn Sie ChatGPT bitten, etwas zu tun, wie geht es an die Aufgabe heran?

Es improvisiert auf Basis seiner Trainingsdaten. Wenn Sie Glück haben, ist das Ergebnis anständig. Wenn nicht, ist es selbstbewusst falsch – weil es Ihren spezifischen Kontext, Ihre Branchenkonventionen oder Ihre Workflows nicht kennt.

**Skills existieren, um das zu beheben.**

Ein Skill ist eine Bedienungsanleitung, die dem Agenten sagt: Wenn du auf diese Art von Aufgabe stößt, befolge diese Schritte, verwende diese Tools und achte auf diese Edge Cases.

Statt zu improvisieren, folgt der Agent einem Rezept.

---

## II. Wie sieht ein Skill eigentlich aus?

Das mag Sie überraschen: Ein Skill ist nur ein Ordner mit einer Markdown-Datei darin.

Die Datei heißt `SKILL.md`. Sie beginnt mit ein paar Zeilen YAML-Metadaten – Name, Beschreibung, Lizenz, Autor. Der Hauptteil ist dann in einfachem Markdown geschrieben – Schritt-für-Schritt-Anleitungen, Input/Output-Beispiele, wie man mit häufigen Fallstricken umgeht.

Bei Bedarf kann der Ordner auch Skripte (z. B. eine Python-Datei), Referenzdokumente und Vorlagendateien enthalten.

Das ist alles. Kein SDK, das man installieren muss. Kein Server, den man hochfahren muss. Kein JSON-RPC-Protokoll, das man implementieren muss.

**Ordner = Skill. Markdown = Interface.**

Genau aus diesem Grund wächst das Ökosystem so schnell – die Hürde, einen Skill zu erstellen, ist absurd niedrig. Wenn Sie Markdown schreiben können, können Sie auch einen Skill schreiben.

---

## III. Wer nutzt Skills?

Anthropic hat Skills ursprünglich als offenen Standard auf agentskills.io veröffentlicht. Aber es ist kein exklusives Format von Anthropic – die Kompatibilitätsliste ist inzwischen lang:

- **Claude Code** – Anthropics eigener Coding-Agent; Skills sind der zentrale Erweiterungsmechanismus
- **OpenAI Codex CLI / ChatGPT** – OpenAI hat denselben Standard übernommen; Skills funktionieren jetzt sowohl im Anthropic- als auch im OpenAI-Ökosystem
- **Cursor** – eines der angesagtesten KI-Coding-Tools; native Skills-Erkennung und -Ladung
- **GitHub Copilot** – Microsofts Ökosystem; bereits kompatibel
- **Windsurf** – Cognitions KI-Entwicklungsumgebung
- **OpenClaw** – das Projekt, das wir analysiert haben; über 100 integrierte Skills

Einen Skill einmal schreiben, und er funktioniert auf allen. Dass Anthropic und OpenAI denselben offenen Standard unterstützen, ist fast beispiellos – diese beiden Unternehmen sind sich in sehr wenigen Dingen einig. Das allein zeigt, wie stark der Konvergenzdruck ist. Vor einem Jahr hatte jede Plattform ihr eigenes Plugin-Format. Jetzt gibt es einen gemeinsamen Standard.

---

## IV. Skills vs. MCP: Schluss mit der Verwirrung

Diese Frage taucht ständig auf. Räumen wir damit auf.

