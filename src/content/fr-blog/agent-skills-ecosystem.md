---
title: "Skills pour Agents : L'App Store du monde de l'IA prend forme"
description: "Plus de 170 000 Skills open-source, la couche Gateway manquante, et pourquoi la plateforme d'Agents suit la stratégie de Windows."
date: "2026-02-09"
author: "AgentPuter Lab"
readingTime: "15 min"
tags: ["OpenClaw", "Agent IA", "Skills", "MCP", "Agent Gateway", "AgentPuter"]
featured: true
---

Dans nos deux premiers articles, nous avons exploré en profondeur OpenClaw — ce que c'est, comment fonctionne son architecture Cerveau-Corps-Âme, et les leçons de sécurité tirées des 1 100 ports Gateway exposés.

Mais il y a une chose que nous n'avons cessé de mentionner sans l'expliquer complètement : les **Skills**.

OpenClaw est livré avec plus de 100 Skills intégrés. Anthropic a transformé les Skills en un standard ouvert. SkillsMP héberge déjà plus de 170 000 Skills open-source.

Ces chiffres soulèvent une question plus large :

**Que sont exactement les Skills ? Quel est leur rapport avec le MCP ? Et est-ce vraiment le « moment App Store » du monde de l'IA ?**

Tirons cela au clair.

---

## I. Le problème fondamental que les Skills résolvent

Lorsque vous demandez à ChatGPT de faire quelque chose, comment aborde-t-il la tâche ?

Il improvise en se basant sur ses données d'entraînement. Si vous avez de la chance, le résultat est correct. Sinon, il est faux avec assurance — car il ne connaît pas votre contexte spécifique, les conventions de votre secteur ou vos flux de travail.

**Les Skills existent pour corriger cela.**

Un Skill est un manuel d'instructions qui dit à l'Agent : lorsque tu rencontres ce type de tâche, suis ces étapes, utilise ces outils, et fais attention à ces cas particuliers.

Au lieu d'improviser, l'Agent suit une recette.

---

## II. À quoi ressemble réellement un Skill ?

Cela pourrait vous surprendre : un Skill n'est qu'un dossier contenant un fichier Markdown.

Le fichier s'appelle `SKILL.md`. Il commence par quelques lignes de métadonnées YAML — nom, description, licence, auteur. Ensuite, le corps est rédigé en Markdown simple — des instructions étape par étape, des exemples d'entrées/sorties, et comment gérer les pièges courants.

Si nécessaire, le dossier peut également contenir des scripts (par exemple, un fichier Python), des documents de référence et des fichiers de modèles.

C'est tout. Pas de SDK à installer. Pas de serveur à lancer. Pas de protocole JSON-RPC à implémenter.

**Dossier = skill. Markdown = interface.**

C'est précisément pourquoi l'écosystème se développe si rapidement — la barrière à l'entrée pour créer un Skill est ridiculement basse. Si vous savez écrire en Markdown, vous pouvez écrire un Skill.

---

## III. Qui utilise les Skills ?

À l'origine, Anthropic a publié les Skills comme un standard ouvert sur agentskills.io. Mais ce n'est pas un format exclusif à Anthropic — la liste de compatibilité s'est largement étendue :

- **Claude Code** — l'agent de codage propre à Anthropic ; les Skills sont le mécanisme d'extension principal
- **OpenAI Codex CLI / ChatGPT** — OpenAI a adopté le même standard ; les Skills fonctionnent désormais à la fois dans les écosystèmes d'Anthropic et d'OpenAI
- **Cursor** — l'un des outils de codage IA les plus en vogue ; découverte et chargement natifs des Skills
- **GitHub Copilot** — l'écosystème de Microsoft ; déjà compatible
- **Windsurf** — l'environnement de développement IA de Cognition
- **OpenClaw** — le projet que nous avons décortiqué ; plus de 100 Skills intégrés

Écrivez un Skill une seule fois, et il fonctionne sur toutes ces plateformes. Le fait qu'Anthropic et OpenAI soutiennent le même format ouvert est presque sans précédent — ces deux entreprises sont rarement d'accord. Cela seul montre à quel point la pression à la convergence est forte. Il y a un an, chaque plateforme avait son propre format de plugin. Maintenant, il y a un standard partagé.

---

## IV. Skills vs MCP : Arrêtez de les confondre

Cette question revient constamment. Mettons les choses au clair.

