---
title: "Die 3-Dateien-Architektur, die deinem Agenten eine Seele gibt"
description: "Warum SOUL.md, IDENTITY.md und USER.md die wichtigsten Dateien in deinem OpenClaw-Setup sind — und wie du sie schreibst, damit dein Agent nicht mehr wie ein generischer Chatbot klingt."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "6 min"
tags: ["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent Personalization", "Prompt Engineering"]
featured: false
---

# Die 3-Dateien-Architektur, die deinem Agenten eine Seele gibt

---

**Warum `SOUL.md`, `IDENTITY.md` und `USER.md` die wichtigsten Dateien in Ihrem OpenClaw-Setup sind.**

*Serie zur Agenten-Infrastruktur · Teil 13*

---

Wenn Sie jemals das Gefühl hatten, dass Ihr Open

---

Der Unterschied zwischen einem generischen Werkzeug und einem personalisierten Partner liegt in drei Markdown-Dateien:

1.  **`SOUL.md`**: Die Persönlichkeit, Werte und Einschränkungen des Agenten.
2.  **`IDENTITY.md`**: Die professionelle Rolle

---

## 1. `SOUL.md`: Der Persönlichkeitskern

Hier geht es nicht darum, deinen Agenten wie einen Piraten sprechen zu lassen (es sei denn, du willst das). `SOUL.md` definiert den *Vibe* und die *Einschränkungen* des Agenten.

**Schlechte `SOUL.md`:**
> Du bist ein hilfreicher Assistent. Sei nett.

---

**Gute `SOUL.md`:**
```markdown
# Kernphilosophie
- Du bist der Pair-Programmierer eines Senior-Entwicklers, nicht der Tutor eines Juniors.
- Fasse dich kurz. Lass das Füllmaterial weg. Kein "Ich hoffe

---

**Warum das wichtig ist:** Diese Datei verhindert die „ChatGPT-Stimme“ – jenen übermäßig höflichen, wortreichen und absichernden Stil, der Power-User in den Wahnsinn treibt. Sie zwingt das Modell in eine spezifische Persona, die zu Ihrem Workflow

---

## 2. `IDENTITY.md`: Die professionelle Rolle

Wenn `SOUL.md` die Persönlichkeit ist, ist `IDENTITY.md` der Lebenslauf. Dies sagt dem Agenten, worin er *gut ist*.

**Beispiel für den Agenten eines DevOps-Ingenieurs:**

```markdown
# Rolle: Senior Site Reliability Engineer (SRE)

---

## Expertise
- Du bist ein Experte für Kubernetes, Terraform und AWS-Netzwerke.
- Du bevorzugst standardmäßig „Infrastructure as Code“-Lösungen gegenüber manuellen Korrekturen.
- Du gehst davon aus, dass alle Produktionsumgebungen hochriskant und fragil sind.

---

## Mentale Modelle
- Murphy's Law: Was schiefgehen kann, wird auch schiefgehen. Zuerst die Backups prüfen.
- Idempotenz: Alle von dir geschriebenen Skripte müssen sicher zweimal ausgeführt werden können.
- Sicherheit: Das Prinzip der geringsten Rechte (Least Privilege) ist der Standard.
```

**Warum das wichtig ist:** Ohne dies greift das Modell standardmäßig auf „allgemeines Wissen“ zurück.

---

## 3. `USER.md`: Dein Kontext

Dies ist die meistunterschätzte Datei. Sie verhindert, dass du dich wiederholst.

**Was hier reingehört:**
*   Deine Tech-Stack-Präferenzen (z. B. „

---

## Umgebung
- OS: macOS Sequoia
- Shell: zsh mit oh-my-zsh
- Editor: Cursor

---

## Vorlieben
- Ich hasse Semikolons in JS.
- Ich bevorzuge `pnpm` gegenüber `npm`.
- Schlage niemals `rm -rf` ohne eine Warnung vor.
- Wenn ich „deploy“ sage, meine ich „in den main-Branch pushen“ und nicht „ein Skript ausführen“.

---

## Aktuelle Projekte
- /Users/kingsoft/work/frontend (Next.js)
- /Users/kingsoft/work/backend (Go)
```

**Warum das wichtig ist:** Der Agent weiß jetzt, dass „deploy“ git push bedeutet. Er weiß, Ihnen keine

---

## Der „Context Kernel“ in Aktion

Wenn Sie eine Nachricht wie „Behebe den Build“ senden, sieht OpenClaw nicht nur „Behebe den Build“.

Es sieht:

> **[Systemkontext]**
> *Aus SOUL.md:* Sei prä

---

*"Ich sehe einen pnpm-lock.yaml-Konflikt. Da du auf macOS bist, führe `pnpm install --frozen-lockfile` aus, um eine sichere Synchronisierung durchzuführen, ohne die Abhängigkeiten zu ändern."*

Das ist spezifisch, sicher und auf

---

## Wie man es einrichtet

Diese Dateien befinden sich in deinem OpenClaw Workspace-Verzeichnis (Standard: `~/.openclaw/workspace/`, getrennt von der Konfiguration unter `~/.openclaw/`).

**Die Ordnerstruktur:**

```
~/.openclaw

---

*   **Fehlschlag:** „Ich bin ein KI-Assistent, erstellt von ...“
*   **Erfolg:** „Ich bin dein SRE-Pair-Programmierer. Ich konzentriere mich auf idempotenten Infrastruktur-Code und ich weiß, dass du pnpm auf

---

## Keine Lust, Markdown zu schreiben?

Diese Dateien von Grund auf zu schreiben, kann mühsam sein.

[TinyClaw](https://tinyclaw.dev) enthält einen **"Persona-Generator"**. Sie haken nur ein paar Kästchen ab (z. B.