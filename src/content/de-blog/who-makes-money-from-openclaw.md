---
title: "Wer verdient eigentlich an OpenClaw?"
description: "100.000 GitHub-Sterne, 2 Mio. wöchentliche Besucher, 0 $ Umsatz. Der Goldrausch um KI-Agenten hat ein Geschäftsmodellproblem – und die Antwort darauf wird entscheiden, wer das Rennen um die Plattform gewinnt."
date: "2026-02-15"
author: "AgentPuter Lab"
readingTime: "15 min"
tags: ["OpenClaw", "Geschäftsmodell", "KI-Agent", "Agentenplattform", "AgentPuter", "Infrastruktur"]
featured: true
---

In den letzten fünf Beiträgen haben wir OpenClaw aus jedem Blickwinkel analysiert – die Architektur, die Sicherheitslücken, das Skills-Ökosystem, die Benchmarks zur Büroautomatisierung, das kulturelle Phänomen. Eine Frage tauchte in jedem Gespräch immer wieder auf: Wer verdient hier eigentlich Geld?

Nicht die philosophische Version dieser Frage. Sondern die wörtliche. Folgen wir dem Geld.

---

## I. Das wertvollste kostenlose Produkt in der KI

Das Wachstum von OpenClaw ist beispiellos. Das Projekt erreichte 100.000 GitHub-Sterne schneller als jedes andere Open-Source-Repo in der Geschichte – schneller als Kubernetes, schneller als VS Code – und kletterte in weniger als zwei Monaten auf über 190.000. Seine Website verzeichnet über 2 Millionen einzelne Besucher pro Woche.

Dennoch hat OpenClaw null Dollar Umsatz. Sein Schöpfer, Peter Steinberger, lehnte milliardenschwere Übernahmeangebote von Meta und OpenAI ab. Zuckerberg meldete sich persönlich per WhatsApp. Sam Altman trat von Seiten OpenAIs an; Satya Nadella koordinierte von Microsofts Seite. Die Deals hätten Steinberger zu einem der reichsten unabhängigen Entwickler der Welt gemacht. Er lehnte sie alle ab.

Während VCs und Big Tech sabbern, verliert Steinberger persönlich zwischen 10.000 und 20.000 $ pro Monat für Infrastrukturkosten, Support-Mitarbeiter und Anwaltskosten. In der Zwischenzeit geben seine Nutzer ein Vermögen aus. Ein Power-User, der eine kleine Flotte von Clawdbots betreibt, kann leicht 30 bis 800 $ pro Monat für API-Aufrufe verbrauchen. Dieses Geld fließt direkt an Anthropic, OpenAI und Google. Nichts davon geht an OpenClaw.

**Wertschöpfung versus Werterfassung – die Kluft war noch nie so groß.** Hunderttausende Entwickler nutzen OpenClaw täglich. Die Modellanbieter kassieren die Schecks. OpenClaw kassiert nichts.

---

## II. Wohin das Geld wirklich fließt (Die Wertschöpfungskette)

Verfolgen wir den Weg eines einzelnen Dollars durch das OpenClaw-Ökosystem.

Angenommen, ein Nutzer möchte seine Marketingberichte automatisieren. Er lädt die Open-Source-Software OpenClaw herunter, was ihn 0 $ kostet. Er durchsucht ClawHub nach einem „Google Analytics Reporting“-Skill und findet einen der 3.286 kostenlos verfügbaren Skills. Er installiert ihn für 0 $. Er stellt den Agenten auf einer Cloud-VM oder bei einem Managed-Hosting-Anbieter bereit, was ihn zwischen 0 $ (in einem kostenlosen Tarif) und vielleicht 17 $ pro Monat für eine Basiskonfiguration kostet.

Dann beginnt der Agent zu arbeiten. Er macht Hunderte von API-Aufrufen an Claude 3.5 Sonnet oder GPT-4o, um zu schlussfolgern, zu planen und seinen Bericht zu erstellen. Hier fallen die Kosten an. Die Kreditkarte des Nutzers wird am Ende des Monats mit 30 $, 100 $ oder sogar 800 $ belastet. Die gesamte wirtschaftliche Leistung der Arbeit des Agenten fließt an den LLM-Anbieter.

Hier ist, wohin das Geld fließt:

| Empfänger | Was sie bereitstellen | Was der Nutzer zahlt |
|-----------|-------------------|--------------------|
| **Anthropic / OpenAI** | LLM-API-Token | **30 $ - 800 $/Monat** |
| **Hosting-Anbieter** | VM / verwaltete Laufzeitumgebung | 0 $ - 17 $/Monat |
| **OpenClaw** | Das gesamte Agenten-Framework | 0 $ |
| **ClawHub-Skill-Entwickler** | Der Skill, der es nützlich macht | 0 $ |

Das ist alles. Die Plattform, die das Ganze erst möglich macht, steht bei 0 $.

Dies unterscheidet sich grundlegend von jeder erfolgreichen Plattform davor. Apple baute ein Hardware- und Software-Ökosystem auf und errichtete dann eine 30%ige Mautstelle (den App Store) für den gesamten Handel. Google verschenkte Android, monetarisierte es aber durch Suche und Werbung, die Standard-Gateways zum Internet. WordPress.org ist kostenlos, aber sein Unternehmenssponsor, Automattic, baute ein milliardenschweres Geschäft mit Hosting (WordPress.com) und VIP-Unternehmensdienstleistungen auf.

**OpenClaw hat derzeit keine Mautstelle.** Es hat eine Superautobahn für den Wert geschaffen, der von den Nutzern zu den LLM-Anbietern fließt, aber keine eigenen Ausfahrten gebaut. Jeder in der Kette wird bezahlt, außer der Plattform, die alles erst möglich macht.

---

## III. Steinbergers Wette: Das Linux-Playbook

Warum einen milliardenschweren Ausstieg für ein Projekt ablehnen, das Geld verbrennt? Steinbergers Antwort ist konsequent: Er möchte nicht wieder CEO sein, und er glaubt, dass KI-Agenten zu wichtig sind, um von einem einzigen Unternehmen besessen zu werden.

Sein strategisches Vorbild ist klar: Linus Torvalds und der Linux-Kernel. Torvalds hat Linux nie direkt monetarisiert. Er stellte es unter die GPLv2-Lizenz und vertraute seine Zukunft einer gemeinnützigen Organisation, der Linux Foundation, an. Er behielt die technische Kontrolle, gab aber die finanzielle Kontrolle ab und ermöglichte so das Gedeihen eines ganzen Ökosystems. Dieser „kostenlose“ Kernel untermauert heute die gesamte Cloud, das Android-Ökosystem und schuf die kommerziellen Möglichkeiten, die zur 34-Milliarden-Dollar-Übernahme von Red Hat durch IBM führten.

OpenClaw wird derzeit wie eine gemeinnützige Organisation finanziert, nicht wie ein Unternehmen. Die Sponsorings reichen von der 5 $/Monat „Krill“-Stufe bis zur 500 $/Monat „Poseidon“-Stufe. Die Cline Foundation stellte einen Zuschuss von 1 Million Dollar zur Finanzierung der Entwicklung durch Dritte bereit, ohne dafür Anteile zu nehmen. OpenAI stellt dem Kernteam Token-Subventionen für die Forschung zur Verfügung. Dieser Flickenteppich aus Finanzierungen deckt die grundlegende Wartung und die Serverkosten, aber es ist ein Wohltätigkeitsmodell, kein Geschäftsmodell. Es kann kein globales Vertriebsteam, kein 24/7-Sicherheitsoperationszentrum oder eine F&E-Abteilung finanzieren, um mit den Agenten-Laboren von Google und Meta zu konkurrieren.

Diese Strategie birgt ein immenses Risiko, das der Linux-Kernel mit seinen Tausenden von Unternehmensbeiträgen nie hatte. **Der Bus-Faktor für das OpenClaw-Projekt ist eins.** Das gesamte Unternehmen, von der strategischen Ausrichtung bis zu den wichtigsten Commits, ruht auf Steinbergers Schultern. Dies ist kein nachhaltiges Modell für eine Infrastruktur, die die Grundlage eines neuen Computing-Paradigmas sein will.

---

## IV. Drei Geschäftsmodelle, die funktionieren könnten

Das Sponsoring-Modell ist nicht skalierbar. Irgendwann muss OpenClaw – oder jemand, der darauf aufbaut – Wert erfassen. Drei Modelle haben historische Vorbilder.

### A. Das Red Hat-Modell – Enterprise-Support & Sicherheit

Das bewährteste Playbook zur Kommerzialisierung kritischer Open-Source-Infrastruktur ist das Enterprise-Modell. Die Kernsoftware bleibt kostenlos und Open Source, aber Unternehmen zahlen für Zuverlässigkeit, Sicherheit und Support. Red Hat verkaufte nicht Linux; es verkaufte Red Hat Enterprise Linux, eine gehärtete, zertifizierte und unterstützte Version mit garantierten SLAs.

Für OpenClaw würde dies ein kostenpflichtiges „OpenClaw Enterprise“-Angebot bedeuten. Während ein Startup es tolerieren kann, dass ein selbst gehosteter Agent gelegentlich ausfällt, kann ein Fortune-500-Unternehmen dies nicht. Unternehmen werden einen Aufpreis für Funktionen wie SOC 2-Konformität, SAML/SSO-Integration, detaillierte Audit-Protokolle für die Compliance, garantierte Verfügbarkeits-SLAs und dedizierten 24/7-Support von erfahrenen Ingenieuren zahlen.

Dieser Markt entsteht bereits. Eine Handvoll kleiner Unternehmen bietet verwaltetes OpenClaw-Hosting für nur 17 $/Monat an, aber keines operiert auf dem von großen Unternehmen geforderten Skalierungs- oder Sicherheitsniveau. **Die zentrale Erkenntnis hier ist, dass der Agent selbst kostenlos ist, aber Zuverlässigkeit auf Enterprise-Niveau ein Produkt ist, das Geld kostet.** Die 34 Milliarden Dollar, die IBM für Red Hat bezahlte, sind der ultimative Beweis für die Macht dieses Modells.

### B. Das App Store-Modell – ClawHub-Marktplatz

ClawHub ist das offizielle Skill-Repository von OpenClaw, eine Parallele zum iOS App Store oder dem Chrome Web Store. Es hat ein explosives Wachstum erlebt, mit 3.286 Skills und über 1,5 Millionen Downloads insgesamt. Derzeit ist jeder Skill kostenlos. Das offensichtliche Geschäftsmodell besteht darin, einen Marktplatz zu schaffen, der es Entwicklern ermöglicht, leistungsstarke, proprietäre Skills zu verkaufen und einen Anteil an der Transaktion zu erhalten.

Apple hat bewiesen, dass man, wenn man den Vertriebskanal und eine Vertrauensschicht aufbaut, eine Beteiligung von bis zu 30 % verlangen kann. OpenClaw hat jedoch ein kritisches Problem: Es hat die Verbreitung, aber es hat das Vertrauen verloren. Der „ClawHavoc“-Vorfall im Januar 2026 deckte die Gefahr eines ungeprüften Repositorys auf. Ein Angreifer mit dem Handle „hightower6eu“ veröffentlichte 314 vergiftete Skills, die die Atomic Stealer-Malware enthielten, was zu über 7.000 Downloads führte, bevor sie entdeckt wurden.

Die Prüfung von 2.857 ClawHub-Skills durch Koi Security ergab, dass 341 – eine erstaunliche Zahl von 11,9 % – aktiv bösartig waren oder schwere Schwachstellen enthielten. Eine separate Snyk-Prüfung scannte 3.984 Skills und fand weitere 283 (7,1 %), die durch unsicheres Logging Benutzeranmeldeinformationen oder API-Schlüssel preisgaben. **Man kann keine Gebühren für die Verbreitung auf einer Plattform verlangen, auf der jede neunte App aktiv feindselig ist.**

Der Weg nach vorne erfordert den Wiederaufbau von Vertrauen. Dies bedeutet wahrscheinlich ein zweistufiges System: eine kostenlose „Nutzung-auf-eigene-Gefahr“-Community-Stufe und eine kostenpflichtige, „ClawHub Verified“-Stufe, bei der Skills strengen Sicherheitsprüfungen unterzogen werden. Entwickler würden dafür bezahlen, dass ihre Skills geprüft und im Premium-Store gelistet werden, und OpenClaw könnte einen Prozentsatz des Umsatzes einbehalten. Dies spiegelt das Modell von npm wider, das kostenlos ist, während das Mutterunternehmen jährlich über 100 Millionen Dollar mit Enterprise-Produkten wie npm Enterprise und Artifactory erwirtschaftet, die Sicherheit und Paketverwaltung bieten.

### C. Agent-as-a-Service – Moltbook & darüber hinaus

Das dritte Modell liegt weiter in der Zukunft. Anstatt Support oder Skills zu verkaufen, wird die Plattform zum Vermittler für eine Agent-zu-Agent-Wirtschaft. Agenten rufen nicht nur menschenorientierte APIs auf – sie entdecken von anderen Agenten angebotene Dienste, verhandeln Bedingungen und führen Transaktionen durch. Die Plattform erhält einen Anteil an jeder Maschine-zu-Maschine-Transaktion.

Der Start von Moltbook – einem sozialen Netzwerk, das ausschließlich für KI-Agenten entwickelt wurde – gab einen Einblick in dieses Potenzial. Es erreichte 30.000 Agenten am Starttag, überschritt 150.000 am dritten Tag und übertraf 1,5 Millionen registrierte Agenten innerhalb der ersten Woche. Agenten posteten, kommentierten, stimmten ab und bildeten autonom Gemeinschaften.

Die Realität war das, was Andrej Karpathy als „brennenden Müllcontainer“ bezeichnete – obwohl er anerkannte, dass das schiere Ausmaß „beispiellos“ war. Die Verhandlungsprotokolle der Agenten waren brüchig, sie gerieten in Schleifen und die wirtschaftliche Aktivität war vernachlässigbar. Die Vision einer sich selbst organisierenden Agentenwirtschaft ist mächtig, aber die zugrunde liegende Technologie für robuste Agent-zu-Agent-Verhandlungen und Werteaustausch steckt noch in den Kinderschuhen. Dies ist ein Spiel auf 2 bis 3 Jahre, keine Einnahmequelle für 2026.

| Modell | Umsatzart | Markteinführungszeit | Verteidigungsfähigkeit | Hauptrisiko |
| ------------------------- | ------------------------- | -------------- | -------------------------------------- | ------------------------------------------ |
| **A. Enterprise-Support** | Wiederkehrendes Abonnement | 6-12 Monate | Hoch (Hohe Kundenbindung, hohe Wechselkosten) | Langsamer Verkaufszyklus, erfordert Enterprise-DNA |
| **B. ClawHub-Marktplatz** | Transaktions-% / Listing-Gebühr | 12-18 Monate | Mittel (Netzwerkeffekte) | Wiederaufbau des Vertrauens nach ClawHavoc |
| **C. Agent-as-a-Service** | Transaktions-% (Mikrozahlungen) | 2-4 Jahre | Sehr hoch (Bindung auf Protokollebene) | Kerntechnologie ist nicht ausgereift („brennender Müllcontainer“) |

---

## V. Das Infrastruktur-Spiel – Wo das echte Geld liegt

Es gibt ein Muster in der Open-Source-Ökonomie, das sich jedes Jahrzehnt wiederholt. Die Kerninnovation – der Kernel, der Container, das CMS – bleibt kostenlos. Das Geld fließt zu demjenigen, der es zuverlässig, skalierbar und sicher genug für Unternehmen macht.

Schauen Sie sich Linux an. Der Kernel ist die quintessentielle Erfolgsgeschichte freier Software. Aber der Unternehmenswert wurde von Red Hat erfasst, das vor seiner Übernahme durch IBM ein 34-Milliarden-Dollar-Geschäft mit Support, Zertifizierung und Tools aufbaute. Die Cloud-Giganten – AWS, Azure und GCP – bauten ihre Imperien auf, indem sie Linux als verwalteten, elastischen Dienst anboten und so Hunderte von Milliarden an Wert erfassten. Das Muster wiederholte sich bei Containern: Docker demokratisierte sie, aber Kubernetes orchestrierte sie im großen Stil, was zu einem milliardenschweren Ökosystem von Managed Services (GKE, EKS, AKS) und Observability-Plattformen wie Datadog und Sicherheitstools von HashiCorp führte. WordPress betreibt 43 % des Webs kostenlos, doch Automattic erreichte 2021 eine Bewertung von 7,5 Milliarden Dollar und Hosting-Unternehmen wie WP Engine bauten beträchtliche Geschäfte auf, indem sie die verwaltete Infrastruktur darum herum bereitstellten.

KI-Agenten sind die Nächsten. OpenClaw ist der Kernel, aber Unternehmen werden ihn nicht roh betreiben. Sie benötigen einen ganzen Stack an Infrastruktur:

*   **Laufzeitumgebung (Runtime):** Agenten benötigen eine sichere, sandboxed Umgebung, um von nicht-deterministischen LLMs generierten Code auszuführen. Dies bedeutet robuste Ressourcenisolierung, ephemere Sitzungen und garantierte 24/7-Verfügbarkeit. Denken Sie an Firecracker, aber für agentische Arbeitsabläufe.
*   **Sicherheit:** Das ist der Elefant im Raum. Es umfasst eine Vertrauenskette für Skills, robustes Credential-Management für den API-Zugriff und unveränderliche Audit-Trails für jede Aktion, die ein Agent durchführt. Ohne dies wird kein CISO das absegnen.
*   **Orchestrierung:** Aufgaben in der realen Welt erfordern nicht einen Agenten, sondern ein Team von ihnen. Orchestrierung ist die Kontrollebene, die die Koordination mehrerer Agenten verwaltet, komplexe Arbeitsabläufe verkettet und die Fehlerbehebung und Wiederholungsversuche handhabt.
*   **Integration:** Ein Agent, der nicht auf die Aufzeichnungssysteme eines Unternehmens zugreifen kann, ist ein Spielzeug. Der wahre Wert wird durch vorgefertigte, gewartete Konnektoren zu Salesforce, SAP, Microsoft 365 und Google Workspace erschlossen.

Der Markt für diese Infrastruktur entsteht bereits. Der Markt für KI-Agenten in Unternehmen wird 2024 auf 5 Milliarden Dollar geschätzt und soll sich bis 2026 mehr als verdoppeln. Microsofts Copilot wird laut CB Insights auf einen jährlichen Umsatz von ca. 800 Millionen Dollar geschätzt. Und die Bull-Case-Prognosen sind atemberaubend: FutureSearch modelliert, dass die agentenbezogenen Einnahmen von OpenAI von etwa 0,5 Milliarden Dollar im Jahr 2025 auf 62,6 Milliarden Dollar bis 2027 wachsen – obwohl ihre zentrale Schätzung deutlich niedriger liegt, was die enorme Unsicherheit in diesem Markt widerspiegelt.

**LLM-APIs werden schnell zur Massenware – ein Wettlauf nach unten bei den Preisen. Die verteidigungsfähige Marge liegt nicht im Modell. Sie liegt in der Infrastruktur, die das Modell sicher, zuverlässig und integriert macht.** Das ist der Burggraben.

---

## VI. Wie dies zu AgentPuter passt

Hier positioniert sich AgentPuter. Wir bauen keinen besseren Agenten – das ist die Aufgabe von OpenClaw. Wir bauen die Infrastrukturschicht zwischen dem Agenten und dem Unternehmen.

Der Stack, den wir in den Beiträgen #3 und #4 beschrieben haben, passt direkt zu den oben genannten Lücken:

*   **Skills** sind unsere Lösung für die Marktplatz- und Domänenexpertise-Schicht. Aber entscheidend ist, dass sie innerhalb von AgentPuter versioniert, signiert und Sicherheits-Scans unterzogen werden, was eine vertrauenswürdige Software-Lieferkette für Agentenfähigkeiten schafft.
*   Das **Agent Gateway** ist der Kern unseres Infrastruktur-Spiels. Es fungiert als zentrale Orchestrierungs-Engine und Sicherheits-Mautstelle, verwaltet Berechtigungen, setzt Zugriffsrichtlinien durch und erstellt den Audit-Trail für jede Agentenaktion. Es ist die `systemd`- oder Kubernetes-Kontrollebene für eine Flotte von Agenten.
*   **MCP (Master Control Program) Tools** sind unser standardisierter Ansatz für das Integrationsproblem. Indem wir eine stabile, gut definierte Schnittstelle für die Verbindung mit Systemen wie Salesforce oder Google Workspace bereitstellen, abstrahieren wir die Komplexität und den Wartungsaufwand vom Agenten selbst.

Die Wette ist einfach: OpenClaw ist die beste verfügbare Open-Source-Agenten-Engine. Was ihm fehlt, ist die Unternehmenstauglichkeit – sandboxed Ausführung, herstellerneutrale Orchestrierung über Claude, GPT und Llama hinweg und persistente Skills, die sich im Laufe der Zeit verstärken, anstatt bei jeder Sitzung zurückgesetzt zu werden.

**OpenClaw ist der Motor. Wir bauen das Fahrgestell, das Sicherheitssystem und die Straße.**

---

## VII. Abschluss – Spitzhacken und Schaufeln

Der Goldrausch um Agenten ist real. OpenClaw und die Folgen von ClawHavoc haben sowohl die Nachfrage als auch die Risiken bewiesen. Tausende von Entwicklern bauen Agenten. Sehr wenige bauen die Infrastruktur, um sie zuverlässig zu betreiben.

Dort liegt die dauerhafte Marge. Drei Vorhersagen für die nächsten 12-18 Monate:

1.  **OpenClaw wird kostenlos und Open Source bleiben, und ein „Red Hat für Agenten“ wird entstehen.** Die Stärke des Kernprojekts ist seine Community. Ein kommerzielles Unternehmen wird bald Support, Härtung und Haftungsfreistellung auf Enterprise-Niveau für groß angelegte OpenClaw-Implementierungen anbieten und zum bevorzugten Partner für die Fortune 500 werden.
2.  **ClawHub wird nach dem nächsten großen Sicherheitsvorfall kostenpflichtige Stufen einführen.** Das aktuelle „Jeder-darf-alles“-Modell für Skills ist unhaltbar. Nach einer hochkarätigen Sicherheitsverletzung, die von einem bösartigen öffentlichen Skill ausgeht, ist zu erwarten, dass der Marktplatz kostenpflichtige Stufen für verifizierte Publisher, automatisierte Sicherheits-Scans und Unternehmenskonten mit privaten Repositories einführen wird.
3.  **Die gewinnende Agentenplattform wird nicht die mit dem besten Modell sein – es wird die mit der besten Infrastruktur sein.** Der marginale Unterschied in der Intelligenz zwischen GPT-5 und Claude 4 wird für ein Unternehmen weniger wichtig sein als Zuverlässigkeit, Sicherheit, Prüfbarkeit und nahtlose Integration in seinen bestehenden Tech-Stack.

Der Agent, der die Quartalsberichte Ihres Unternehmens automatisiert, wird nicht gewinnen, weil er 5 % „intelligenter“ ist. Er wird gewinnen, weil er jedes Mal läuft, seine Aktionen für die SOX-Compliance prüfbar sind und er die richtigen Anmeldeinformationen hat, um auf Ihr ERP zuzugreifen.

**Der Agent, der Ihren Quartalsbericht erstellt, ist nicht schlauer als ChatGPT. Er hat nur bessere Anweisungen, eine zuverlässige Laufzeitumgebung und die richtigen Werkzeuge angeschlossen.**

*In diesen sechs Beiträgen haben wir den Bogen des AgentPuter-Projekts nachgezeichnet: von der Kernproduktvision über die Brain-Body-Soul-Architektur bis hin zum Ökosystem von Skills und Gateways und schließlich zu den Geschäftsmodellen, die es nachhaltig machen. In unserem nächsten Beitrag machen wir uns die Hände schmutzig und führen eine vollständige End-to-End-Implementierung durch: den Bau eines Finanzanalyse-Agenten von Grund auf mit dem AgentPuter-Stack.*