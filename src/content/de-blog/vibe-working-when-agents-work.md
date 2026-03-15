---
title: "Vibe Working: Wenn „Sag es einfach dem Agenten“ tatsächlich funktioniert"
description: "Enterprise KI spart Analysten 1,5 Stunden pro Tag – dennoch scheitert der beste Agent immer noch bei 53 % der Multi-App-Office-Aufgaben. Die Lücke zwischen den Zeiteinsparungen bei Einzel-App-Anwendungen und der End-to-End-Automatisierung ist der Ort, an dem die eigentliche Chance liegt."
date: "2026-02-12"
author: "AgentPuter Lab"
readingTime: "12 Min."
tags: ["Vibe Working", "Office-Fähigkeiten", "AgentPuter", "Produktivität", "KI-Agent"]
featured: true
---

In unseren vorherigen drei Beiträgen haben wir einen einzigen Faden verfolgt: von OpenClaw als Produkt → zu seiner Brain-Body-Soul-Architektur → zum darunterliegenden Skills + Gateway + MCP-Funktionsstapel.

Wir haben immer wieder gesagt: "Skills werden die tägliche Arbeit verändern." Es ist an der Zeit zu zeigen, wie das tatsächlich aussieht.

---

## I. Microsoft nannte es "Vibe Working"

Am 29. September 2025 veröffentlichte Microsoft zwei Funktionen in Microsoft 365 Copilot und gab ihnen einen Namen: **Vibe Working**.

Der **Agent Mode** landete in Excel und Word. Sie geben eine Eingabeaufforderung ein – *"Erstelle mir einen Kreditamortisationsrechner mit monatlichen Zahlungsaufschlüsselungen"* – und der Agent spuckt nicht nur eine Formel aus. Er erstellt Blätter, schreibt Formeln, generiert Diagramme, validiert Ergebnisse, erkennt Fehler, behebt sie und iteriert, bis die Ausgabe stimmt. Mehrstufig. Selbstkorrigierend.

Der **Office Agent** landete in der Copilot-Chat-Seitenleiste. Sie sagen *"Erstelle eine präsentationsreife Präsentation aus diesen Quartalsdaten"* und er erstellt eine ausgefeilte PowerPoint-Präsentation. Keine Vorlage mit Platzhaltertext – ein echtes Deck mit Ihren Zahlen, formatiert, bereit zur Präsentation.

Der Name geht auf Andrej Karpathy zurück. Am 2. Februar 2025 twitterte das Gründungsmitglied von OpenAI: *"Es gibt eine neue Art des Programmierens, die ich 'Vibe Coding' nenne, bei der man sich voll und ganz den Vibes hingibt, Exponentielles annimmt und vergisst, dass der Code überhaupt existiert."* Sieben Monate später übertrug Microsoft diese Idee vom Code auf Tabellenkalkulationen, Dokumente und Folien: **Sie liefern die Absicht, der Agent liefert das Artefakt.**

Kein Kampf mehr mit der VLOOKUP-Syntax. Kein manuelles Formatieren von 47 Folien mehr. Kein Kopieren von Zahlen mehr zwischen drei Tabellenkalkulationen und einem Word-Dokument.

Zumindest ist das das Versprechen. Microsofts eigener **SpreadsheetBench** zeigt, dass der Agent Mode in Excel eine **Genauigkeit von 57,2 %** bei komplexen Aufgaben erreicht. Für einige Benutzer besser als manuell – aber noch lange nicht zuverlässig.

---

## II. Das Versprechen vs. die Realität

Hier ist, was die Forschung tatsächlich sagt.

Benchmarks für die Büroautomatisierung – wie **SpreadsheetBench** – testeten Top-Modelle anhand realistischer Arbeitsabläufe: Filtern von Datensätzen, Querverweisen auf Tabellen und Erstellen von zusammenfassenden Analysen. Aufgaben, die ein kompetenter Büroangestellter täglich erledigt, ohne zweimal darüber nachzudenken.

**Selbst die besten Systeme scheitern fast die Hälfte der Zeit.** Die Schlussfolgerung der Forscher ist unverblümt: Die Leistung liegt immer noch "weit unter den menschlichen Genauigkeitsstandards, die für reale Büroabläufe erforderlich sind".

Die Fehlermodi sind aufschlussreich:

- **Operation redundancy** – der Agent wiederholt dieselbe Aktion dreimal hintereinander, verschwendet Token und beschädigt manchmal seine eigene Ausgabe.
- **Hallucinated references** – er bearbeitet selbstbewusst Zelle B14 in einer Tabellenkalkulation, die nur 10 Zeilen hat.
- **App-switching failures** – das Verschieben von Daten von Excel zu Word zu E-Mail unterbricht den Kontext häufiger als nicht.
- **Long-horizon drift** – bei Aufgaben mit mehr als 10 Schritten vergisst der Agent allmählich, was er erreichen wollte.

Aber hier ist, was die meisten Leute an diesen Fehlern übersehen. Microsofts eigenes AI Red Team veröffentlichte eine Taxonomie der Fehlermodi in agentischen Systemen, und die beängstigendste Erkenntnis ist nicht die Halluzination – es ist **die Erosion der menschlichen Aufsicht**.

Wenn der Agent eine Tabellenkalkulation generiert, die *richtig* aussieht, überprüfen die Benutzer die Formeln nicht mehr. Wenn er einen E-Mail-Entwurf erstellt, der *richtig* klingt, klicken die Benutzer auf Senden, ohne ihn zu lesen. Das eigentliche Risiko besteht nicht darin, dass der Agent sich irrt. Es ist, dass der Mensch es nicht mehr bemerkt.

Dies ist die zentrale Spannung im Vibe Working: Je leistungsfähiger der Agent wird, desto gefährlicher ist es, ihm ohne Leitplanken zu vertrauen.

---

## III. Vier Szenarien: Vorher und Nachher

Bevor wir uns unserer eigenen Arbeit widmen, einige Hintergrundinformationen darüber, was bereits in der Praxis gemessen wurde.

Eine **NBER-Feldstudie** (bedingt akzeptiert bei *American Economic Review: Insights*) verfolgte **7.137 Wissensarbeiter** in 66 Unternehmen über sechs Monate. Mitarbeiter, die integrierte KI-Tools verwendeten, verbrachten **25–31 % weniger Zeit mit E-Mails** – etwa zwei bis drei Stunden weniger pro Woche.

- Die Finanzanalysten von **Morgan Stanley** sparten **1,5 Stunden pro Tag** bei der Recherche und Berichtsvorbereitung.
- **Repsol** führte einen Copilot-Pilotversuch durch und stellte fest, dass die Mitarbeiter durchschnittlich **121 Minuten pro Woche** sparten, wobei sich die Ausgabequalität um 16,2 % verbesserte.
- **World Wide Technology** setzte Copilot für 941 Benutzer ein und maß **446 Stunden Einsparung pro Woche** – hauptsächlich bei Besprechungszusammenfassungen, E-Mail-Entwürfen und Berichtserstellung.

Diese Zahlen sind real. Aber die vergrabene Erkenntnis der NBER-Studie ist genauso wichtig: Obwohl Stunden bei E-Mails gespart wurden, **gab es keine signifikante Veränderung in der Menge oder Zusammensetzung der Gesamtaufgaben der Mitarbeiter**. Die Mitarbeiter konnten Dinge beschleunigen, die sie individuell kontrollierten – aber sie konnten keine Arbeitsabläufe ändern, die eine Koordination mit anderen erforderten. KI beschleunigte die Zellen; sie verdrahtete den Organismus nicht neu.

Das ist die wichtigste Erkenntnis. Aktuelle Tools sparen Zeit bei *einzelnen* Aufgaben innerhalb *einer* Anwendung. Der schwierige Teil – der Teil, bei dem die Genauigkeit auf ~50 % sinkt – ist, wenn der Agent Aufgaben über mehrere Apps hinweg verketten und ein vollständiges Artefakt liefern muss.

Hier kommt die Skills-basierte Orchestrierung ins Spiel. Hier ist, was wir bauen und testen.

### Szenario 1: Quartalsumsatzbericht

**Vorher:** Sie öffnen drei CSV-Exporte aus dem CRM. Sie fügen sie in Excel ein. Sie verbringen 40 Minuten mit dem Erstellen von Pivot-Tabellen, dem Schreiben von SUMIFS-Formeln, dem Formatieren von bedingten Farben und dem Erstellen von Diagrammen. Dann kopieren Sie die Diagramme in ein Word-Dokument, schreiben Kommentare dazu und senden es per E-Mail an Ihren Manager. Gesamt: ~2 Stunden.

**Nachher:** Sie sagen dem Agenten: *"Ziehe die Umsatzdaten für das vierte Quartal ab, schlüssele sie nach Region und Produktlinie auf, kennzeichne alles, was im Vergleich zum Vorquartal um mehr als 15 % gesunken ist, und gib mir einen Bericht mit Diagrammen."*

Was im Hintergrund passiert:
- Ein **Sales Reporting Skill** wird aktiviert – er kennt die Standardberichtsstruktur, welche Metriken wichtig sind und wie Anomalien gekennzeichnet werden.
- Der Skill orchestriert **MCP-Tools**: eines verbindet sich mit der CRM-Datenbank, ein anderes schreibt in Excel, ein anderes generiert das Word-Dokument.
- Das **Gateway** verwaltet die Sitzung – wenn die CRM-Abfrage 30 Sekunden dauert, wird keine Zeitüberschreitung ausgelöst; wenn das Schreiben in Excel fehlschlägt, wird es wiederholt.
- Sie erhalten eine formatierte Excel-Arbeitsmappe und eine Word-Zusammenfassung zurück. Gesamt: ~3 Minuten Ihrer Zeit.

Der Agent hat nicht improvisiert. Er folgte einem Rezept – einem, das kodiert, wie Ihr Unternehmen seine Quartalsberichte strukturiert.

### Szenario 2: Besprechungsnotizen

**Vorher:** Sie sitzen in einer 45-minütigen Besprechung. Sie kritzeln Notizen. Danach verbringen Sie 20 Minuten damit, sie abzutippen, nach Themen zu ordnen, Aktionspunkte zu identifizieren und sie an die Teilnehmer zu senden. Die Hälfte der Zeit verpassen Sie etwas und müssen die Aufnahme überprüfen.

**Nachher:** Sie sagen: *"Transkribiere die Produktsynchronisierung von gestern, ordne sie nach Themen, extrahiere Aktionspunkte mit Verantwortlichen und Fristen und sende die Zusammenfassung an alle Teilnehmer."*

Im Hintergrund:
- Ein **Meeting Notes Skill** wird aktiviert – er kennt den Unterschied zwischen einer Entscheidung, einem Aktionspunkt und einer Hintergrunddiskussion.
- **MCP-Tools** übernehmen die Transkription (Whisper API), die Kalendersuche (wer teilgenommen hat) und den E-Mail-Versand.
- Der Skill wendet das bevorzugte Format Ihres Teams an – nicht eine generische Vorlage, sondern die tatsächliche Struktur, die Ihr Team verwendet.

Das Ergebnis ist ein Dokument, das aussieht, als hätte es ein Mensch geschrieben, da der Skill darauf trainiert wurde, wie Ihr Team Besprechungsnotizen schreibt.

### Szenario 3: Überprüfung des Vertragsrisikos

**Vorher:** Die Rechtsabteilung schickt Ihnen einen 30-seitigen Lieferantenvertrag. Sie lesen ihn. Sie markieren Klauseln, die ungewöhnlich aussehen. Sie gleichen sie mit den Standardbedingungen Ihres Unternehmens ab. Sie schreiben eine Risikozusammenfassung. Dies dauert fast einen Nachmittag.

**Nachher:** Sie sagen: *"Überprüfe diesen Lieferantenvertrag anhand unserer Standardbedingungen. Kennzeichne Abweichungen, bewerte jede nach Risikostufe und gib mir eine Zusammenfassung, die ich an die Rechtsabteilung senden kann."*

Im Hintergrund:
- Ein **Contract Review Skill** wird aktiviert – er kennt die Standardbedingungen Ihres Unternehmens, gängige Risikomuster und wie Ihr Rechtsteam Risikobewertungen bevorzugt.
- **MCP-Tools** übernehmen das Parsen von PDF-Dateien, die Textextraktion und den strukturierten Vergleich.
- Das Gateway erzwingt Zugriffskontrollen – die Vertragsdaten bleiben innerhalb der sicheren Laufzeit und verlassen niemals die Sandbox.

Sie erhalten einen strukturierten Risikobericht in 4 Minuten. Die Rechtsabteilung führt weiterhin die endgültige Überprüfung durch – der Agent ersetzt keine Anwälte, sondern die 3 Stunden Lesen und Markieren, die dem eigentlichen Rechtsurteil vorausgehen.

### Szenario 4: E-Mail-Triage

**Vorher:** Montagmorgen. 127 ungelesene E-Mails. Sie verbringen 45 Minuten mit dem Scannen von Betreffzeilen, dem Öffnen von Nachrichten, dem mentalen Kategorisieren (dringend / FYI / Antwort erforderlich / Spam) und dem Entwerfen von Antworten. Wenn Sie fertig sind, sind drei neue dringende E-Mails eingegangen.

**Nachher:** Sie sagen: *"Triage meinen Posteingang. Kennzeichne alles Dringende von direkten Mitarbeitern oder Kunden. Entwirf Antworten für alles, was nur eine Bestätigung benötigt. Fasse den Rest in drei Stichpunkten zusammen."*

Im Hintergrund:
- Ein **Email Triage Skill** wird aktiviert – er weiß, wer Ihre direkten Mitarbeiter sind, welche Kunden Priorität haben und was "dringend" in Ihrem Kontext bedeutet.
- **MCP-Tools** verbinden sich mit Ihrem E-Mail-Anbieter, ziehen Nachrichten ab und entwerfen Antworten.
- Das Gateway stellt sicher, dass keine E-Mail-Inhalte über die Sitzung hinaus gespeichert werden – wenn die Aufgabe erledigt ist, sind die Daten verschwunden.

Sie überprüfen 127 E-Mails in 6 Minuten. Sie bearbeiten zwei entworfene Antworten, genehmigen den Rest und fahren fort.

---

## IV. Was das zum Funktionieren bringt (und was nicht)

Alle vier Szenarien haben ein Muster gemeinsam. Lassen Sie uns es explizit machen.

**Was es zum Funktionieren bringt:**

1.  **Ein Skill, der Domänenwissen kodiert.** Keine generische Eingabeaufforderung – ein strukturierter Befehlssatz, der das Berichtsformat Ihres Unternehmens, den Besprechungsnotizenstil Ihres Teams und die Risikobewertungsskala Ihres Rechtsteams kennt. Aus diesem Grund übertrifft ein Skill-basierter Ansatz das reine Prompting.
2.  **MCP-Tools, die die Mechanik übernehmen.** Der Agent muss nicht "herausfinden", wie er sich mit Ihrem CRM verbindet oder eine PDF-Datei parst. MCP bietet vorgefertigte, getestete Integrationen. Der Skill sagt nur "verwende dieses Tool", und MCP übernimmt das Protokoll.
3.  **Ein Gateway, das alles am Laufen hält.** Der Sitzungsstatus verschwindet nicht mitten in der Aufgabe. Wenn ein Schritt fehlschlägt, wiederholt das Gateway den Vorgang oder setzt ihn zurück. Berechtigungen werden erzwungen – der Contract Review Skill kann nicht auf Ihre E-Mails zugreifen, und der E-Mail-Skill kann nicht auf den Vertrag zugreifen.

**Was (noch) nicht funktioniert:**

1.  **App-übergreifende Workflows mit vielen Schritten.** Die Erfolgsquote sinkt erheblich, wenn Aufgaben 4+ Anwendungen umfassen. Die Kontextfragmentierung ist das größte ungelöste Problem.
2.  **Mehrdeutige Absicht.** "Mache diesen Bericht besser" reicht nicht aus. Der Agent benötigt eine spezifische Absicht – "Kennzeichne Rückgänge über 15 %" ist umsetzbar, "lass es gut aussehen" ist es nicht. Vibe Working erfordert, dass Benutzer klar angeben, wie "fertig" aussieht.
3.  **Ersteinrichtung.** Ein Skill muss die Konventionen Ihres Unternehmens lernen, bevor er sie replizieren kann. Der erste Quartalsbericht erfordert Aufwand für die Konfiguration. Der 20. dauert 3 Minuten.

---

## V. Warum aktuelle Lösungen scheitern

Die Vibe Working-Funktionen von Microsoft sind beeindruckende Demos. Aber es gibt strukturelle Einschränkungen im aktuellen Ansatz.

**Copilot ist an das Microsoft-Ökosystem gebunden.** Der Agent Mode funktioniert in Excel und Word. Was ist, wenn sich Ihre Daten in Google Sheets befinden, Ihr CRM Salesforce ist und Ihre Besprechungsaufzeichnungen in Otter.ai gespeichert sind? Sie benötigen etwas, das Anbieter übergreifend orchestriert, nicht innerhalb eines Anbieters.

**Kein persistenter Speicher über Sitzungen hinweg.** Copilot erinnert sich nicht, dass der Bericht vom letzten Monat einen bestimmten Diagrammstil verwendet hat oder dass Ihr Rechtsteam eine dreistufige Risikoskala bevorzugt. Jede Sitzung beginnt von vorne. Skills lösen dies – das Wissen befindet sich in der Skill-Datei, nicht in der Sitzung.

**Keine Sicherheitsisolation.** Wenn Copilot Ihren Lieferantenvertrag verarbeitet, wohin gehen diese Daten? Über die OpenAI API? Die von Anthropic? Microsoft verwendet beides – und hier ist ein Detail, das in ihrer eigenen Dokumentation versteckt ist: **Anthropic-Modelle innerhalb von Microsoft 365 Copilot-Erlebnissen fallen ausdrücklich nicht in den Geltungsbereich der EU-Datengrenze**. Wenn Sie ein europäisches Unternehmen sind, das den Agent Mode ausführt, werden einige Ihrer Daten möglicherweise außerhalb von EU-Rechenzentren verarbeitet (insbesondere auf AWS US). Für sensible Dokumente benötigen Sie eine Laufzeit mit klaren Datengrenzen – ein Gateway mit Sandboxing, kein Chatfenster mit Cloud-APIs.

**Die Genauigkeitszahlen sind brutal.** 57,2 % bei SpreadsheetBench für reine Excel-Aufgaben – und das ist Microsofts *eigener* Agent Mode auf ihrem *eigenen* Benchmark. Akademische Arbeiten zum Tabellenkalkulations-Reasoning (wie SheetBrain, SheetAgent) zeigen, dass selbst speziell entwickelte neuro-symbolische Systeme explizite Validierungsmodule benötigen, um die Beschädigung von Daten zu vermeiden. Rohe Modellintelligenz, egal wie beeindruckend, ist ohne Infrastruktur nicht produktionsreif für die Büroautomatisierung.

---

## VI. Der Ansatz, den wir verfolgen

Der Vibe Working-Stack von AgentPuter hat drei Schichten – dieselben drei, die wir in unserem vorherigen Beitrag beschrieben haben:

**Skills** definieren das Playbook für jedes Szenario. Ein Sales Reporting Skill unterscheidet sich von einem Meeting Notes Skill, der sich von einem Contract Review Skill unterscheidet. Jeder kodiert spezifisches Domänenwissen, Schrittsequenzen, Toolanforderungen und Ausgabeformate.

Das **Agent Gateway** orchestriert die Ausführung. Es lädt den richtigen Skill, leitet MCP-Tool-Aufrufe weiter, verwaltet den Sitzungsstatus, erzwingt Berechtigungen und behandelt Fehler. Das Gateway ist der Grund, warum das System nicht bei Schritt 7 eines 12-stufigen Workflows zusammenbricht.

**MCP-Tools** übernehmen die eigentlichen Verbindungen – Datenbankabfragen, Datei-E/A, E-Mail-APIs, Kalendersuchen, PDF-Parsing. Standardisiert, getestet, containerisiert.

Was unterscheidet dies von Copilot? Drei Dinge:

1.  **Anbieterneutral.** Unser Gateway orchestriert Google Workspace, Microsoft 365, Salesforce, Slack, Notion – wo auch immer Ihre Daten tatsächlich gespeichert sind. Nicht an ein Ökosystem gebunden.
2.  **Persistentes Wissen.** Skills merken sich Ihre Konventionen über Sitzungen hinweg. Der 20. Quartalsbericht ist genauso schnell wie der 2., da der Skill Ihr Format, Ihre Metriken und Ihr Publikum bereits kennt.
3.  **Security-First-Laufzeit.** Jeder Skill wird in einer Sandbox-Umgebung ausgeführt. Vertragsdaten berühren nicht den Kontext des E-Mail-Skills. Sitzungsdaten sind kurzlebig, sofern sie nicht explizit persistent gespeichert werden. Audit-Protokolle für jeden Schritt.

---

## Abschließende Gedanken

"Vibe Working" ist ein guter Name für das, was kommt. Die Idee, dass Sie beschreiben, was Sie wollen, und ein Agent das fertige Artefakt liefert – das ist der Endzustand, auf den alle hinarbeiten.

Aber die ehrliche Wahrheit ist: Wir sind noch nicht so weit. Die Lücke zwischen der Demo und dem Daily Driver ist real. ~50 % Erfolgsquoten bei Büro-Workflows sagen Ihnen, dass rohe Modellintelligenz nicht ausreicht.

Was die Lücke schließt, ist nicht ein besseres Modell. Es ist die Infrastruktur um das Modell herum:

- **Skills**, die den Agenten auf bewährte Workflows beschränken, anstatt ihn improvisieren zu lassen
- **Ein Gateway**, das mehrstufige Aufgaben auf Kurs hält, mit Wiederholungsversuchen, Rollbacks und Zugriffskontrolle
- **MCP-Tools**, die getestete, zuverlässige Integrationen bereitstellen, anstatt den Agenten zu bitten, APIs selbst herauszufinden

In den letzten vier Beiträgen sind wir von der Analyse eines viralen Open-Source-Projekts zum Aufbau eines vollständigen Bildes dessen übergegangen, was die Agent-Infrastruktur tatsächlich erfordert.

Hier ist der Teil, der jeden, der in diesem Bereich arbeitet, beunruhigen sollte: Die Analysten von Morgan Stanley sparen mit KI 1,5 Stunden pro Tag, aber der beste Allzweck-Agent scheitert immer noch bei der Hälfte aller Multi-App-Office-Aufgaben. **Der ROI ist bereits real – innerhalb einzelner Apps, mit menschlicher Aufsicht. In dem Moment, in dem Sie den Menschen entfernen oder App-Grenzen überschreiten, gehen die Dinge kaputt.**

Die Pointe ist einfach: **Der Agent, der Ihren Quartalsbericht erstellt, ist nicht intelligenter als ChatGPT. Er hat nur bessere Anweisungen, eine zuverlässige Laufzeit und die richtigen Tools angeschlossen.** Die 7.137 Mitarbeiter in dieser NBER-Studie brauchten kein intelligenteres Modell. Sie brauchten eine bessere Infrastruktur um das Modell, das sie bereits hatten.

Das ist Vibe Working. Nicht Vibes. Infrastruktur.

---

*Dies ist der vierte Beitrag in unserer Serie über die Agent-Infrastruktur. Wir sind von OpenClaw → Architektur → dem Skills + Gateway + MCP-Funktionsstapel → und jetzt, wie es in der Praxis aussieht, übergegangen. Als Nächstes werden wir uns dem Geschäftsmodell zuwenden: Wie monetarisieren Sie eigentlich eine Agent-Plattform? Wenn Sie einen Büro-Workflow haben, den Sie mit KI zu automatisieren versucht haben – und gescheitert sind –, würden wir uns freuen, davon zu hören.*