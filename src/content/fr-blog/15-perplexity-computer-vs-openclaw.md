---
title: "Perplexity vient de construire ce que les utilisateurs d'OpenClaw exécutaient déjà eux-mêmes"
description: "Le 25 février, Perplexity a lancé Computer — une IA cloud qui orchestre 19 modèles, exécute des sous-agents en parallèle et des tâches de manière autonome pour 200 $/mois. Voici ce que les utilisateurs d'OpenClaw possèdent déjà, ce qu'ils n'ont pas, et ce que cela signifie pour la course aux plateformes d'agents."
date: "2026-02-28"
author: "AgentPuter Lab"
readingTime: "14 min"
tags: ["OpenClaw", "Perplexity", "Agent IA", "Multi-Agent", "Plateforme d'Agents"]
featured: true
---

Le 25 février, Perplexity a lancé « Computer » — un système d'IA cloud qui orchestre 19 modèles
Le résumé du produit par Ars Technica : *« Ensuite, il y a OpenClaw, que l'on pourrait percevoir comme le prédécesseur immédiat de ce concept. »*

Cet article aborde ce qu'est réellement Perplexity Computer, ses points de convergence avec Open
5. [Ce que Perplexity fait de mieux](#does-better)
6. [À qui s'adresse réellement chacun](#who-for)
7. [Ce que cela signifie pour la course aux plateformes d'agents](#platform-race)

---

## 1. Ce qu
Le concept : décrivez un résultat en langage clair, et l'Ordinateur trouvera comment l'atteindre. « Planifier et exécuter une campagne de marketing numérique pour mon restaurant. » « Crée-moi une application Android qui m'aide à suivre mes lectures. » Vous ne réd
Derrière cette interface, l'ordinateur décompose la requête en sous-tâches structurées, délègue chacune au modèle le plus approprié pour cette étape spécifique parmi les 19 disponibles, et les exécute — certaines en parallèle, d'autres en série —
| Veo 3.1 | Génération de vidéo |
| Grok | Tâches légères et sensibles à la vitesse |

19 modèles au total — le tableau ci-dessus présente les principaux modèles nommés. Opus est la couche d'orchestration ; il décide quel modèle
**L'environnement :** Chaque tâche s'exécute dans un environnement de calcul cloud isolé avec un accès à un véritable système de fichiers, un véritable navigateur et des intégrations d'outils préconfigurées. Rien ne s'exécute sur votre machine locale. Les intégrations sont sélectionnées par Perplexity — pas de plugins tiers, pas de serveurs MCP personnalisés.
**Tarifs :** 200 $/mois pour Perplexity Max, ce qui inclut 10 000 crédits. L'ordinateur consomme des crédits en cours d'utilisation — l'usage n'est pas illimité. Vous pouvez définir des
**Une mise en garde sur le langage marketing :** Perplexity affirme que Computer est « capable de fonctionner pendant des heures, voire des mois ». Le produit a été lancé le 25 février. Personne n'a encore vérifié cette affirmation de fonctionnement sur plusieurs mois dans le cadre d'un
> *"Les agents IA sont remarquablement capables — mais ils n'ont ni foyer, ni espace de travail persistant, ni ordinateur qui leur soit propre."*

Perplexity Computer est une implémentation commerciale de cette thèse, précisément.
Il ne s'agit pas d'un cas où Perplexity aurait lu cet article avant de créer un produit. Perplexity a commencé des expérimentations internes en janvier — avant la publication du Blog #01. Il s'agit de plusieurs équipes qui arrivent indépendamment à la même conclusion. Ce qui,
| Espace de travail persistant | Système de fichiers cloud par tâche | `~/.openclaw/data/` |
| Routage multi-modèle | 19 modèles, orchestrés par Opus | `model.fallbacks` + `modelByChannel` |
| Coordination des sous-agents | Décomposition des tâches → délégation aux agents | `sessions_spawn` fan-out |
| Autonomie de longue durée | Annoncée : de quelques heures à plusieurs mois | Cron + `runTimeoutSeconds` |
| Navigateur réel | Intégré | `browser_snapshot`, `browser_navigate` |
| Fichiers de contexte de l'agent | Gérés par la plateforme, non visibles par l'utilisateur | `SOUL.md`, `USER.md`, `HEARTBEAT.md` |
| Contrôles des dépenses | Plafonds de crédits par sous-agent | `runTimeoutSeconds` (proxy basé sur le temps) |

Les décisions de conception correspondent presque parfaitement. Le stockage persistant, l'accès au navigateur, le routage multi-modèle, le parallélisme des sous-agents, l'autonomie à long terme — ce ne sont pas des fonctionnalités que Perplexity a inventées. Ce sont des fonctionnalités que la communauté OpenClaw utilise, sous forme configurable, depuis l'année dernière.
Le créateur d'OpenClaw, Peter Steinberger, a rejoint OpenAI en février. Altman a décrit les agents personnels comme quelque chose qui « deviendra rapidement un élément central de nos offres de produits », et a déclaré que l'avenir « sera extrêmement multi-agent ». Anthropic a lancé Claude Cowork en janvier. Toute l'industrie productise maintenant le modèle d'infrastructure que la communauté open-source d'OpenClaw a construit en premier.

---

## 3. Leurs points de divergence {#diverge}

Les idées sont identiques. La philosophie d'exécution est opposée.
Ars Technica l'a bien formulé : *« Si OpenClaw était le web ouvert des outils d'agents IA, alors Computer serait l'App Store d'Apple. »*

Cette analogie est juste et mérite qu'on s'y attarde. Le web ouvert vous
| Dimension | Perplexity Computer | OpenClaw |
| --- | --- | --- |
| Où il s'exécute | Cloud uniquement | Machine locale, VPS auto-hébergé, ou TinyClaw |
| Modèle d'intégration | Intégrations de plateforme sélectionnées | Open Skills + écosystème MCP |
| Configuration | Gérée par la plateforme, invisible pour l'utilisateur | `openclaw.json`, contrôle total de l'utilisateur |
| Modèle de sécurité | La plateforme est responsable | L'utilisateur est responsable |
| Plafond de personnalisation | Bas — utilisez ce que Perplexity fournit | Élevé — tout est configurable |
| Transparence | Boîte noire | Transcription complète via `sessions_history` |
| Emplacement des données | Cloud de Perplexity | Votre machine ou votre serveur |
| Contrôle des dépenses | Plafonds de crédits par sous-agent | `runTimeoutSeconds` (proxy temporel) |

Le compromis va systématiquement dans une seule direction : Perplexity renonce au contrôle en échange de la simplicité et de la sécurité ; OpenClaw renonce à la simplicité en échange du contrôle et de l'extensibilité.

---

## 4. Ce que Perplexity ne peut pas faire {#cant-do}
Ce ne sont pas des cas limites — ce sont des fonctionnalités que les utilisateurs d'OpenClaw considèrent comme essentielles.

**SOUL.md — l'identité persistante de l'agent**

Sur OpenClaw, `SOUL.md` est un fichier qui façonne
Perplexity Computer n'a pas d'équivalent. Chaque tâche commence à partir des paramètres par défaut de la plateforme. Vous ne pouvez pas écrire un jeu d'instructions persistant, vous ne pouvez pas définir comment l'agent doit gérer l'ambiguïté, vous ne pouvez pas lui donner un caractère persistant. L'agent avec lequel vous travaillez aujourd'hui n'a aucune mémoire des préférences que vous avez établies.

**Planification Cron personnalisée**

Perplexity Computer est réactif. Vous décrivez une tâche ; il l'exécute. C'est toujours vous qui le démarrez.
OpenClaw exécute des flux de travail planifiés de manière autonome. « Chaque jour de la semaine à 7h50, récupérer l'activité GitHub de la veille, résumer les PR qui nécessitent une révision et envoyer une synthèse sur Telegram. » Personne n'app
OpenClaw expose un point de terminaison `/hooks/agent`. Un Webhook GitHub se déclenche lorsqu'une PR est ouverte ; l'agent lit le diff, effectue une revue et publie les commentaires sur Slack — le tout sans intervention humaine. L'événement externe pilote le flux
Si votre flux de travail accède à des fichiers sur votre machine — la lecture de code depuis un dépôt local, le traitement de documents dans votre système de fichiers, l'interaction avec des applications locales — Perplexity Computer ne peut pas y accéder. Tout s'exécute dans l'environnement cloud de Perplexity. Votre machine locale est invisible pour lui.

**Compétences tierces et serveurs MCP**
L'écosystème d'OpenClaw comprend des milliers de Compétences sur ClawHub et agentskills.io, ainsi que la prise en charge de serveurs MCP personnalisés. Vous pouvez installer une Compétence qui se connecte à vos outils internes, écrire une Comp
`sessions_history` dans OpenClaw vous fournit une transcription complète et consultable de tout ce que l'agent a fait : chaque appel d'outil, chaque réponse du modèle, chaque point de décision. En cas de problème, vous pouvez lire exactement ce qui s'est passé.

Perplexity Computer vous montre les résultats. Le raisonnement — quel modèle a été utilisé pour quelle étape, ce que chaque sous-agent a décidé et pourquoi — reste interne à la plateforme. Vous pouvez voir ce que vous avez obtenu ; vous ne pouvez pas voir comment vous l'avez obtenu.

---
## 5. Ce que Perplexity fait de mieux {#does-better}

Il est important d'être honnête sur ce que ces 200 $/mois vous apportent. Plusieurs de ces points sont de véritables avantages, et pas seulement du marketing.

**Aucune configuration
Sur OpenClaw, même avec TinyClaw gérant l'infrastructure, il reste une étape de configuration significative : connecter les canaux, rédiger SOUL.md, configurer la pile de modèles, définir les planifications Cron. Pour un utilisateur non technique, ce fossé
Opus décide lequel des 19 modèles gère chaque sous-tâche. Vous ne spécifiez pas « utilisez Gemini pour la recherche, Nano Banana pour les images et Grok pour les tâches légères ». Ce routage s'effectue automatiquement en fonction de ce que le système de Per
Sur OpenClaw, la création d'un routage multi-modèle équivalent nécessite une configuration intentionnelle : définir `subagents.model`, utiliser `modelByChannel`, écrire `model.fallbacks`, et potentiellement écrire une logique de routage personnalisée dans `AGENTS.md`. C'est faisable — mais cela demande du travail.

**Plafonds de dépenses par sous-agent**
C'est le domaine où Perplexity offre quelque chose qu'OpenClaw n'a explicitement pas. Les plafonds de dépenses basés sur des crédits vous permettent de dire « cette sous-tâche de recherche ne doit pas dépenser plus de X ». Il s'agit d'un contrôle des coûts direct, au dollar près, au niveau de la tâche.

Le contrôle des coûts d'OpenClaw fonctionne via des limites de temps (`runTimeoutSeconds`) — un indicateur indirect des dépenses, pas une limite de dépense directe. Il n'existe aucun champ qui dise « s'arrêter après avoir dépensé 0,50 $ ». Perplexity Computer dispose de ce champ.

**Intégrations pré-construites qui fonctionnent**
Navigateur, exécution de code, génération d'images, génération de vidéos — tout cela fonctionne d'emblée, sans débogage, sans gestion des identifiants. Sur OpenClaw, chaque capacité nécessite soit l'installation d'une Skill, soit une configuration de serveur MCP, soit une clé API. Le résultat est plus puissant une fois configuré ; le coût de configuration est réel.

**Aucune surface d'attaque provenant de
L'incident ClawHavoc est l'illustration la plus claire du risque. En février 2026, 341 compétences malveillantes ont été découvertes sur ClawHub dans le cadre d'une attaque coordonnée de la chaîne d'approvisionnement. La charge utile principale était Atomic Stealer (AMOS) — un voleur d'identifiants pour macOS ciblant les portefeuilles de cryptomonnaies, les clés API et les mots de passe de navigateur. Environ 300 000 utilisateurs actifs d'OpenClaw ont été potentiellement exposés. Le modèle de téléversement ouvert de ClawHub — ne requérant qu'un compte âgé de 7 jours et un compte GitHub — a rendu trivialement facile pour les attaquants de publier à grande échelle.
Le modèle fermé de Perplexity Computer élimine entièrement cette surface d'attaque. Vous ne pouvez pas installer de compétence malveillante, car vous ne pouvez installer aucune compétence.

**Responsabilité commerciale**

Pour 200 $/mois, vous obtenez un contrat de support, un SLA et
## 6. À qui chacun s'adresse-t-il réellement {#who-for}

Ils ne se font pas concurrence pour le même utilisateur. C'est important, car les considérer comme des concurrents mène à la mauvaise conclusion quant à savoir lequel utiliser.

**Perplexity Computer
L'utilisateur qui bénéficie le plus de Perplexity Computer a des flux de travail basés sur le cloud, n'a pas besoin de toucher aux fichiers locaux ni de se déclencher sur des événements externes, est à l'aise avec une plateforme qui gère toutes les décisions de routage et
Un consultant en marketing qui automatise la recherche concurrentielle. Un écrivain qui utilise l'IA pour l'aider dans ses recherches et ses ébauches. Un propriétaire de petite entreprise qui souhaite automatiser des flux de communication client entièrement hébergés sur des services cloud. Pour ces utilisateurs, la couche de configuration d'OpenClaw représente une contrainte, et non une valeur ajoutée. Perplexity Computer élimine cette contrainte pour 200 $ par mois.

**OpenClaw :**
L'utilisateur qui bénéficie le plus d'OpenClaw a des besoins spécifiques en matière d'infrastructure : l'accès aux fichiers locaux, des flux de travail autonomes déclenchés par Cron, la gestion d'événements pilotée par des Webhooks, des Skills personnalisées
Un ingénieur qui veut un bot de revue de PR. Un développeur qui a besoin d'agents qui travaillent avec du code dans un dépôt local. Une équipe des opérations qui a besoin de workflows de surveillance autonomes s'exécutant sur une infrastructure interne. Un chercheur qui
Le test le plus clair : si votre flux de travail doit démarrer sans intervention humaine (Cron ou Webhook), ou doit accéder à des fichiers ne se trouvant pas dans le cloud de Perplexity, vous êtes un utilisateur d'OpenClaw. Si vos flux de travail sont initiés par vous
## 7. Ce que cela signifie pour la course aux plateformes d'agents {#platform-race}

**La thèse de l'infrastructure est validée.**

Début 2025, l'idée que « les agents ont besoin de leur propre environnement de calcul persistant » était une affirmation qu'il fallait défendre. En février 2026, c'est un produit que Perplexity facture 200 $/mois, qu'OpenAI intègre dans sa feuille de route, et qu'Anthropic propose sous le nom de Claude Cowork. Le débat pour savoir s'il s'agit d'une véritable catégorie de produits est terminé. C'est une véritable catégorie de produits.
La compétition porte désormais sur qui possède la couche d'infrastructure — et non sur son existence.

**Le pipeline de l'open-source au commercial se déroule comme prévu.**
OpenAI a embauché le créateur d'OpenClaw. Perplexity a développé un produit basé sur le concept. Anthropic a créé Claude Cowork. Le schéma correspond à ce qui s'est passé avec Linux → Red Hat → AWS, avec Android → Samsung, avec Git → GitHub. L'open-source définit la catégorie et prouve le concept ; les acteurs commerciaux le transforment en produit pour une adoption généralisée.
La question qui mérite d'être posée pour l'écosystème OpenClaw est la suivante : la version ouverte et configurable conserve-t-elle sa valeur distinctive à mesure que les versions fermées et peaufinées s'améliorent ? Historiquement, la réponse est oui — mais la proposition de valeur doit rester claire. « Contrôle total, n'importe quelle infrastructure, écosystème extensible » est une position cohérente. « Une version légèrement moins chère de Perplexity Computer avec plus de configuration » ne l'est pas.

**200 $/mois avec des limites de crédit établit ce que le marché peut supporter.**
C'est le prix actuel pour la version la plus aboutie, sans configuration et orchestrée par 19 modèles de cette capacité. Elle inclut 10 000 crédits — et non un usage illimité.
TinyClaw déploie la même architecture multi-agent sous-jacente en moins d'une minute, à un coût nettement inférieur, avec un accès à la planification Cron, aux Webhooks, à l'accès aux fichiers locaux et à l'écosystème complet des compétences Open
Le marché est réel. La course à l'infrastructure a commencé. OpenClaw était le prototype open-source qui a prouvé le concept. Perplexity Computer est l'un des premiers paris commerciaux majeurs sur ce concept. D'autres suivront.

---

## Référence rapide

| | Perplexity Computer | OpenClaw + TinyClaw |
| --- | --- | --- |
| Prix | 200 $/mois (10k crédits inclus) | Open-source + tarification TinyClaw |
| Temps d'installation | Secondes | De quelques minutes à quelques heures |
| Nombre de modèles | 19 (routage automatique par Opus) | Configurable (n'importe quel fournisseur) |
| Plafonds de dépenses | Basé sur les crédits, par sous-agent | Basé sur le temps (`runTimeoutSeconds`) |
| Personnalisation | Faible | Élevée |
| Accès aux fichiers locaux | Non | Oui |
| Cron / tâches planifiées | Non | Oui |
| Réception de webhooks | Non | Oui |
| Compétences personnalisées / plugins | Non | Oui (ClawHub, agentskills.io) |
| Identité d'agent persistante | Non | Oui (`SOUL.md`) |
| Emplacement des données | Cloud de Perplexity | Votre choix |
| Piste d'audit complète | Non | Oui (`sessions_history`) |

---

## Ressources
- [Annonce de Perplexity Computer](https://www.perplexity.ai/hub/blog/introducing-perplexity-computer)
- [Ars Technica : Perplexity annonce « Computer »](https://arstechnica.com/ai/2026/02/perplexity-announces-computer-an-ai-agent-that-assigns-work-to-other-ai-agents/)
- [agentputer.com](https://agentputer.com/) — hébergement cloud 24/7 pour OpenClaw
- [tinyclaw.dev](https://tinyclaw.dev/) — déploiement en un clic
- [docs.openclaw.ai](https://docs.openclaw.ai/) — documentation d'OpenClaw
- [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) — dépôt OpenClaw

---

*Sources : Perplexity blog · Ars Technica · TechCrunch · The Verge · gHacks · The Tech Outlook · Fév 2026*