---
title: "Flux de travail OpenClaw réels : ce que plus de 85 utilisateurs construisent réellement (2026)"
description: "Ni tutoriels, ni démos. Quatre modèles structurels extraits de 148 réponses de la communauté, deux fils de discussion Reddit, plus de 85 cas d'usage catégorisés et de notes de déploiement en entreprise. L'agent de briefing matinal, le Mission Control à 10 agents, l'optimisation des coûts de 90 $ à 45 $/mois, et plus encore."
date: "2026-03-02"
author: "AgentPuter Lab"
readingTime: "25 min"
tags: ["OpenClaw", "Flux de travail", "Monde réel", "Multi-agents", "Communauté", "Cas d'utilisation", "Productivité"]
featured: true
---

# Flux de travail OpenClaw réels : Ce que plus de 85
La semaine dernière, nous avons abordé ce qui peut mal tourner quand OpenClaw est mal configuré — des attaques de la chaîne d'approvisionnement, un taux de réussite de 91 % pour les injections de prompt, et l'incident ClawHavoc qui a touché
Ce qui suit est une extraction directe de trois mois de contributions de la communauté : 148 réponses à un seul tweet, deux fils de discussion actifs sur Reddit, une base de données organisée de plus de 85 cas d'utilisation catégorisés, et des notes de déploiement en production
Le but n'est pas l'inspiration. C'est la reconnaissance de motifs. Il y a quatre motifs structurels qui reviennent constamment dans chaque cas d'utilisation. Une fois que vous les aurez identifiés, vous cesserez de vous demander « que devrais-je construire avec OpenClaw
> - [r/LocalLLaMA : 3 semaines avec OpenClaw au quotidien](https://www.reddit.com/r/LocalLLaMA/comments/1r3ro5h/) — Reddit
> - [r/openclaw : Mon OpenClaw est utile !](https://www.reddit.com/r/open
> - [Cas d'utilisation d'OpenClaw — Ses utilisations réelles](https://www.serif.ai/openclaw) — Serif.ai, 9 fév. 2026
> - [Cas d'utilisation d'OpenClaw 2026 : 25+ exemples réels](https://www.tldl.io/blog/openclaw-use-cases-2026) — TLDL, 23 fév. 2026
> - [Utilisation d'OpenClaw en production](https://team400.ai/blog/2026-02-openclaw-production-enterprise) — Team 400, 10 fév. 2026

---

【插图 01-grahammann-article.png】
*grahammann.net — « Tous les cas d'usage d'OpenClaw que j'ai pu trouver (plus de 85) », 13 fév. 2026. Basé sur 148 réponses au tweet de Lenny et la galerie Clawverse.*

---

## Table des matières

1. [Les quatre grands schémas](#four-patterns)
2. [Flux de travail 01 : L'agent de briefing matinal](#workflow-01)
3. [Flux de travail 02 : Pipeline de contenu multi-agent](#workflow-02)
4. [Flux de travail 03 : Équipe d'étude de marché à 4 agents](#workflow-03)
5. [Flux de travail 04 : Livraison client via Telegram](#workflow-04)
6. [Flux de travail 05 : De 90 $ → 45 $/mois](#workflow-05)
7. [Flux de travail 06 : Le lundi matin de l'agence de design](#workflow-06)
8. [Flux de travail 07 : Le Mission Control à 10 agents](#workflow-07)
9. [La pile d'infrastructure universelle](#infra-stack)
10. [Ce que les données d'adoption montrent réellement](#adoption-data)
11. [Le point sur la réalité en entreprise](#enterprise)
12. [Par où commencer](#where-to-start)
13. [Annexe : Plus de 85 cas d'utilisation par catégorie](#appendix)

---

## Les quatre grands schémas {#four-patterns}
Graham Mann a passé en revue les 148 réponses au tweet de Lenny Rachitsky demandant ce que les gens construisent réellement avec OpenClaw. Il a également parcouru la galerie de la communauté Clawverse et l'article de Brandon Wang. Après avoir organisé plus de 85 cas
**Agents toujours actifs.** La plupart des gens qui prennent OpenClaw au sérieux le font tourner 24h/24 et 7j/7 sur un Mac mini, un VPS bon marché ou un Raspberry Pi. L'agent n'est pas quelque chose que l'on ouvre
**La messagerie comme interface.** Telegram apparaît dans plus de 15 cas d'utilisation. WhatsApp dans plus de 7. iMessage et Discord, chacun dans de multiples configurations. Le choix récurrent est une application de messagerie que vous utilisez déjà, et non un nouveau tableau de
**Travail de nuit.** Le schéma le plus récurrent : assigner une tâche avant d'aller se coucher et découvrir les résultats au réveil. Cela peut sembler un fantasme au premier abord, mais c'est ce que des dizaines de personnes décrivent comme leur mode de fonctionnement
**Équipes multi-agents.** Plusieurs utilisateurs avancés exécutent 4 à 10 agents spécialisés qui se coordonnent via des bases de données partagées, et non via un unique agent monolithique. Chaque agent a un rôle défini, des outils définis et un contexte limité
## Flux de travail 01 : L'Agent de briefing matinal {#workflow-01}

**Source :** Multiples — [@chrysb](https://x.com/chrysb) via grahammann.net, [@mbogoroch18](https://x.com/mbogoroch18), cas d'utilisation n°2 de Serif.ai

C'est le point de départ le plus courant au sein de la communauté, et probablement le bon.
La configuration : une tâche cron s'exécute chaque matin et envoie un résumé structuré sur votre Telegram, WhatsApp ou iMessage. Le contenu du résumé dépend de ce que vous avez configuré. La version minimale inclut les événements du calendrier de la journée et quelques points importants d
Un utilisateur (@chrysb) l'appelle un agent « Chef de Cabinet ». Chaque matin, il fournit des briefings contenant la préparation des transactions, les actualités technologiques et le contexte des réunions. Ce même agent s'auto-évalue chaque soir et s'ajuste en fonction
"taches": [
      {
        "horaire": "0 7 * * 1-5",
        "message": "Génère mon briefing matinal : les événements du calendrier d'aujourd'hui, les 3 principaux e-mails non lus, toute tâche due aujourd'hui. Formate pour Telegram. Ne dépasse pas 400 mots.",
        "canal": "telegram"
      }
    ]
  }
}
```
Ce qui en fait plus qu'une simple tâche cron, c'est SOUL.md. Les utilisateurs qui enregistrent des instructions permanentes dans SOUL.md reçoivent un briefing adapté à leur rôle et à leurs préférences — non pas un résumé générique, mais un qui sait déjà
**Pourquoi ça marche :** Vous cessez d'être un hub qui traite les informations de cinq applications chaque matin. L'agent s'occupe de l'agrégation. Vous prenez les décisions.

Serif.ai décrit cela comme le fait de « commencer chaque journée avec un avantage ».
> — [@eouaooo](https://x.com/eouaooo), via grahammann.net

---

## Flux de travail 02 : Pipeline de Contenu Multi-Agent {#workflow-02}

**Source :** [Fil de discussion r/LocalLLa
| Rôle | Description |
|---|---|
| Rédacteur | Premières ébauches, basées sur les résultats de la recherche |
| Éditeur | Applique une grille de qualité de 100 points pour rejeter ou accepter les ébauches |
| Chercheur | Trouve les sources, vérifie les faits, transmet au Rédacteur |
| Codeur | Gère toutes les tâches d'automatisation, la génération de scripts |
| Gestionnaire de pipeline | Orchestre la séquence, gère la file d'attente |
Production sur la période de trois semaines : environ 30 ébauches générées. Taux de rejet : ~40 %. Ce chiffre de 40 % est important — il signifie que l'agent Éditeur fait réellement quelque chose. Un portail de qualité qui ne rejette
C'est dans la répartition des coûts que cela devient instructif. Claude Haiku a géré environ 80 % des tâches automatisées — les décisions de routage, les appels de classification courts, les passes de formatage. Haiku est environ 10 à 20
"params": { "context1m": false }
      },
      {
        "id": "researcher",
        "model": "claude-sonnet-4.6"
      },
      {
        "id": "writer",
        "model": "claude-sonnet-4.6"
      },
**Bug 1 : Les tâches cron ignorent les changements de contexte.** Le gestionnaire de pipeline lançait une nouvelle exécution sans vérifier si les sorties de l'exécution précédente avaient été mises à jour. Correctif : ajout d'une vérification préalable utilisant `DECISIONS.md` — un fichier qui consigne les décisions prises et l'état dans lequel se trouve le pipeline. La tâche cron lit DECISIONS.md avant d'entreprendre toute action.

## État du pipeline

**Dernière exécution :** 2026-02-14 06:45 UTC
**État de la file d'attente :** 3 brouillons en attente de révision par l'Éditeur
**Ne pas lancer de nouveau cycle de Researcher tant que la file d'attente n'est pas vide**
**Raison :** L'Éditeur est soumis à une limitation de débit sur Anthropic ; pause de 30 min
**Bogue 2 : Fuite du raisonnement interne dans les messages utilisateur.** Lorsque le pipeline renvoyait les résumés via l'agent principal, des traces de raisonnement provenant des sous-agents apparaissaient dans la sortie. Correctif : `deliver:false` sur tous les
"deliver": false
      }
    ]
  }
}
```

Le pipeline complet s'exécute désormais la nuit, trois fois par semaine. La revue du matin prend environ quinze minutes : parcourir la file d'attente dans Notion, approuver ou rej
Quatre agents, tournant sur un seul MacBook Pro, chacun avec une spécialisation différente :

| Agent | Nom | Tâche |
|---|---|---|
| Recherche | Tib | Effectue une rotation entre les ensembles d'idées B2B / B2C / AI2AI toutes
Ce qui rend cette configuration intéressante d'un point de vue structurel : chaque agent possède son propre SOUL.md et son propre journal de rotation de la mémoire. Le journal de rotation de la mémoire est un fichier qui garde une trace de ce que l'agent a déjà examiné, afin qu'
Les fichiers SOUL.md confèrent à chaque agent une personnalité et des limites de rôle distinctes. Le SOUL.md de Tib précise qu'il doit faire émerger des angles nouveaux — non seulement rapporter ce qui existe, mais aussi identifier des opportunités adjacentes. Le SOUL.md de Gus spécifie qu'il est un coordinateur, et non un chercheur : il synthétise les contributions des trois autres et signale les conflits lorsque deux agents tirent des conclusions contradictoires.

```
# SOUL.md de Tib (extrait)
Vous êtes Tib, un chercheur de marché B2B/B2C/AI2AI.
```
Alternez entre les catégories d'idées toutes les 15 minutes.
Votre travail consiste à faire émerger des angles *nouveaux*, et non à résumer l'existant.
Ne répétez aucun élément consigné dans MEMORY_ROTATION.md au cours des
Formatez un résumé Telegram de 200 mots : d'abord les éléments [SIGNAL], puis [NOISE], ensuite [ALERT] si un agent a signalé un problème de sécurité.
Mettez en évidence explicitement les conflits entre les agents.
```

Le format
**Remarque sur le coût :** Cette configuration utilise MiniMax 2.5 comme modèle de base pour les quatre agents. Tib à lui seul effectue ~96 cycles de requêtes par 24 heures à des intervalles de 15 minutes.

---

## Flux de
Celui-ci décrit un pipeline complet de livraison client pour une agence de développement web, entièrement contrôlé via Telegram :

Le client envoie une demande de modification
    ↓
Message vocal du client → [transcrit en texte]
    ↓
OpenClaw reçoit la demande dans Telegram
    ↓
Un sous-agent de codage démarre → interprète la demande → ouvre la base de code
    ↓
Les modifications sont effectuées sur une branche de test
    ↓
Un lien de prévisualisation est généré et renvoyé via Telegram
    ↓
Le client approuve ou demande des révisions
    ↓
Approuvé → déploiement en production
Les e-mails de support passent par le même système : les e-mails entrants sont automatiquement convertis en un rapport de modification formaté, qui devient une tâche dans la file d'attente.

La configuration de l'opérateur : le sous-agent de codage a un accès
Une deuxième personne qui a construit quelque chose de similaire : @jlehman_ a décrit la construction d'un produit entier — Pagedrop — de l'idée au déploiement en un week-end via des messages Telegram. « Architecture construite, domaine acheté, infrastructure mise en place, page d'accueil, OAuth GitHub, paiements. Le tout par messages texte lors d'activités normales du week-end. »

```json
{
  "channels": {
    "list": [
      {
        "id": "client-acme",
        "type": "telegram",
        "params": {
          "project": "acme-website",
"baseDeCode": "/repos/acme",
          "brancheDeDéploiement": "main",
          "urlDePréproduction": "https://staging.acme.example.com"
        }
      }
    ]
  },
  "agents": {
**Ce qui fait vraiment gagner du temps ici :** ce n'est pas l'automatisation du codage en soi, mais l'élimination de la boucle de mise à jour de statut. L'ensemble du cycle — demande, compilation, aperçu, approbation, déploiement — se
État initial : ~90 $ par mois. Principalement des appels à Sonnet pour tout, y compris pour des tâches ne nécessitant pas Sonnet.

**Intervention 1 : Réduction du contexte d'amorçage.**

Le contexte d'amorçage de l'
Après audit : réduit à 27 Ko / 6 472 tokens. **C'est une réduction de 69,8 % des tokens facturés à chaque démarrage de session.** Sur un agent qui est démarré plusieurs fois par jour via de multiples tâches cron, cela s'accumule rapidement.

```bash
# Vérifier ce qui est réellement chargé au démarrage
openclaw doctor --verbose

# Lister tous les fichiers de mémoire par taille
ls -lh ~/.openclaw/memory/

# Examiner ce qui est chargé
cat ~/.openclaw/memory/USER.md
cat ~/.openclaw/SOUL.md
```
Tout élément dans USER.md ou SOUL.md décrivant un projet terminé il y a trois mois vous coûte des jetons. Archivez-le dans un fichier séparé qui ne se charge pas au démarrage.

**Intervention 2 : Haiku pour les tâches routinières.**
    "modelByChannel": {
      "telegram": "claude-haiku-4.5",
      "cron-router": "claude-haiku-4.5",
      "analysis": "claude-sonnet-4.6"
    }
  }
}
```

Haiku, à sa vitesse de classification, traite environ 80 % du volume d'appels. Sonnet ne se déclenche que lorsqu'un raisonnement réel est nécessaire.

**Intervention 3 : API Batch OpenAI pour les embeddings.**
Les opérations sur la mémoire utilisaient des appels d'intégration synchrones. Passage à l'API Batch, qui coûte 50 % moins cher et s'exécute en heures creuses. Compromis sur la latence : les résultats par lot sont retournés sous 24
La leçon à retenir : la plupart des factures OpenClaw inattendues proviennent de deux sources. Un contexte d'amorçage surchargé qui charge des jetons dont vous n'avez pas besoin. Et l'utilisation d'un modèle à haute capacité pour des tâches qui
*Oh My OpenClaw — « 5 workflows de productivité OpenClaw qui remplacent réellement le basculement entre les onglets », 24 février 2026. Cinq combinaisons de workflows documentées avec des gains de temps avant/après mesurés.*

**Source
**Avant :** Cinq applications, cinq connexions. Temps total avant de commencer à travailler : 30 minutes.

**Après :** Ouvrir Telegram, taper « briefing du lundi ». L'agent récupère les tâches ClickUp, les événements du calendrier, les e-mails non lus, les mentions Slack et le résumé du suivi du temps. Lu en 2 minutes. Au travail à 9h15.

**Résultat mesuré :** La revue du lundi matin passe de 30 minutes à 8 minutes.

La création de tâches à partir des e-mails est passée de 4 étapes à un seul message :
> *"L'e-mail concernant la révision du logo Acme est arrivé vendredi. Crée une tâche ClickUp pour ça, à échéance mercredi, assignée à Tomoko."*

La même équipe a également documenté le flux de travail pour les rapports clients : chaque vendredi, auparavant 90 minutes de saisie manuelle de données pour trois rapports clients. Après avoir ajouté une chaîne ClickUp + suivi du temps + Google Sheets : 30 minutes au total pour les trois.

clawhub install clickup
clawhub install cal-com
clawhub install meeting-notes
clawhub install mission-control
**Principe clé :** commencez avec deux compétences, pas cinq. Installez ClickUp et cal-com. Familiarisez-vous avec leur utilisation conjointe pendant une semaine. Ensuite, ajoutez l'e-mail. Les meilleurs flux de travail émergent des schémas d'utilisation réels, et non de la conception d'un système parfait à l'avance.

---

## Flux de travail 07 : Le Mission Control à 10 agents {#workflow-07}

**Source :** [@pbteja1998](https://x.com/pbteja1998) via [grahammann.net](https://grahammann.net/blog/every-openclaw-use-case) (crédit : [@nQaze](https://x.com/nQaze))
Dix agents. Une base de données Convex partagée. Cycles de pulsation de 15 minutes. Stand-ups quotidiens. Notifications par @mention entre les agents.

| Agent | Rôle |
|---|---|
| Chef d'équipe | Orchestrateur ; assigne les tâches, résout les conflits |
| Analyste produit | Surveille les métriques du produit et le paysage concurrentiel |
| Chargé de la recherche client | Gère la file d'attente des retours clients |
| Analyste SEO | Suivi des mots-clés, analyse des lacunes de contenu |
| Rédacteur de contenu | Rédige le contenu assigné par le Chef d'équipe |
| Responsable des réseaux sociaux | Planifie et publie sur les différentes plateformes |
| Designer | Génère les ressources, se coordonne avec Figma |
| Marketing par e-mail | Gère les séquences et la performance des campagnes |
| Développeur | Tâches
**Leçons pratiques tirées de cette conception :**

**1. Une base de données partagée est préférable à des fichiers en mémoire partagée.** Lorsque les agents ont besoin de se coordonner, une base de données structurée (Convex, Supabase, SQLite avec un schéma) est plus fiable que la transmission de messages par le biais de fichiers en mémoire
**2. Les pulsations révèlent les défaillances silencieuses.** Un agent qui cesse d'envoyer des mises à jour de pulsation est soit bloqué, soit mort. Sans pulsations, vous ne le sauriez pas jusqu'à ce que quelque chose en aval tombe en panne.
**4. Un point de contact humain.** Le rôle de l'opérateur : examiner le stand-up matinal sur Slack, vérifier le journal des mentions sur Telegram, traiter les remontées du Squad Lead. Ne pas gérer dix agents directement — gérer un seul résumé.

---

## La Stack d
Discord (5+ mentions, configurations multi-agents)
  iMessage (3+ mentions, personnel/famille)

Calcul (Toujours actif)
  Mac mini — le choix le plus courant pour un serveur domestique
  Mac Studio — charges de travail lourdes, inférence locale
  Raspberry Pi — tâches légères, à faible consommation
  VPS Railway/Render — exécuteur de tâches cron le moins cher
  AWS/GCP — quand vous avez besoin de mise à l'échelle ou de conformité

Mémoire / État
  GitHub — config, SOUL.md, DECISIONS.md
  Notion — files d'attente de tâches, contexte de format long
  Obsidian — connaissances personnelles, notes
SQLite — coordination structurée des agents
Supabase — base de données partagée multi-agents

Plomberie spécialisée (par cas d'usage)
  Twilio — appels téléphoniques réels (voix ElevenLabs)
  SeatsAero — recherche de vols primes
  Kalshi — exécution sur les marchés de prédiction
  moomoo — API de trading
  Home Assistant — contrôle domotique
  Garmin Connect — données de fitness
Le modèle « GitHub-pour-la-config » mérite une mention particulière. Plusieurs utilisateurs avancés versionnent l'intégralité de leur configuration OpenClaw dans un dépôt Git privé.

```bash
cd ~/.openclaw
git init
git add .
git commit -m "configuration initiale d'openclaw — fév 2026"

# Après toute modification de la configuration
git add -A && git commit -m "resserrage du contexte de démarrage : suppression des anciens fichiers de projet"
```
Cela vous permet une restauration en cas de problème après une mise à jour, un historique des modifications en cas de changement de comportement inattendu, et un déploiement facile sur une nouvelle machine.

---

## Ce que les données d'adoption montrent réellement {#adoption-data}

【插图
| Recherche et données | 28% | 4,3/5 |
| Gestion des e-mails | 20% | 4,0/5 |
| Assistance au codage | 15% | 4,8/5 |

**Le codage a le score de satisfaction le plus élevé, mais l'adoption la plus faible.** Les développeurs qui mettent en place des flux de travail de codage en sont très satisfaits, mais la plupart des personnes qui configurent OpenClaw ne commencent pas par là.
**L'automatisation de contenu est la plus répandue.** C'est par là que la plupart des gens commencent, car la valeur est immédiatement visible. Vous exécutez une tâche cron, vous recevez un résumé sur Telegram, vous le voyez fonctionner en 20 minutes.
*Team 400 — « Exécution de OpenClaw en production », 10 février 2026. Leçons de déploiement en entreprise d'un fournisseur de services gérés.*

Team 400, une société de services gérés utilisant OpenClaw pour
**Le fossé entre la démo et la production est réel.** Le guide de démarrage couvre la configuration. Il ne couvre pas : qui examine le code des compétences avant l'installation, ce qui se passe en cas de panne du fournisseur de LLM, comment les informations d'identification sont
**Vous avez besoin d'un environnement de pré-production.** Chaque mise à jour d'OpenClaw devrait d'abord passer par la pré-production. Ils ont dû annuler des mises à jour d'OpenClaw trois fois en un an — chaque fois en moins de 15 minutes, car la procédure de restauration était documentée et testée à l'avance.

**Le suivi des coûts est non négociable à grande échelle.** « Nous avons vu des organisations passer de quelques centaines de dollars par mois à plusieurs milliers en l'espace d'une semaine, généralement parce que quelqu'un a installé une compétence qui effectue plusieurs appels LLM par requête utilisateur. »
**La charge opérationnelle :** en régime de croisière, l'exploitation d'OpenClaw en production représente 4 à 8 heures par semaine pour une personne.

Pour un usage personnel et les petites équipes, la majeure partie de cette charge de travail ne s'applique pas
*Serif.ai — « Cas d'utilisation d'OpenClaw : ce pour quoi les gens l'utilisent réellement », 9 fév. 2026. 25 cas d'utilisation documentés dans les domaines de la messagerie, de l'
**Semaine 1 : Ajoutez un fichier de mémoire.** Commencez à utiliser `triple-memory-skill` ou des fichiers de mémoire manuels pour stocker les informations que vous répétez à votre agent. C'est ce qui donne l'impression que votre agent vous connaît, plutôt que de repartir de zéro à chaque session.

**Semaines 2 à 4 : Enchaînez deux outils.** Si vous avez un outil de gestion de projet (ClickUp, Notion, Linear), installez sa compétence et combinez-la avec votre calendrier. Une seule commande qui vous montre ce qui est à faire aujourd'hui et ce qui est planifié.
**Mois 2 : Première configuration multi-agent.** Ajoutez un sous-agent avec un rôle spécifique. Un agent de recherche qui travaille la nuit. Gardez-le bien cadré.

**Mois 3 et suivants : Travail de nuit.** À ce stade, vous aurez suffisamment
> *« J'ai un agent qui connaît mes projets, se souvient de nos conversations et effectue des tâches utiles pendant que je dors. C'est suffisant pour continuer à construire. »*

Partez de là. Construisez à partir de là.

---

## Référence rapide : Sources de la communauté

| Source | Type | Utilité |
|---|---|---|
| [grahammann.net/blog/every-openclaw-use-case](https://grahammann.net/blog/every-openclaw-use-case) | Liste organisée | Parcourir les catégories, trouver votre cas d'utilisation |
| [r/openclaw](https://www.reddit.com/r/openclaw/) | Communauté | Configurations réelles, dépannage, retours d'expérience des pairs |
| [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/) | Communauté technique | Configurations pour utilisateurs avancés, optimisation des coûts |
| [ohmyopenclaw.ai](https://ohmyopenclaw.ai/) | Répertoire de compétences | Trouver et évaluer des compétences, guides de flux de travail |
| [serif.ai/openclaw](https://www.serif.ai/openclaw) | Répertoire de cas d'utilisation | Flux de travail spécifiques à l'industrie |
| [tldl.io/blog/openclaw-use-cases-2026](https://www.tldl.io/blog/openclaw-use-cases-2026) | Données d'enquête | Statistiques d'adoption, satisfaction par catégorie |
| [team400.ai/blog](https://team400.ai/blog/2026-02-openclaw-production-enterprise) | Guide d'entreprise | Déploiement en production, sécurité, opérations |
| [github.com/hesamsheikh/awesome-openclaw-usecases](https://github.com/hesamsheikh/awesome-openclaw-usecases) | GitHub | Liste brute organisée par la communauté |

---
## Annexe : 85+ cas d'utilisation par catégorie {#appendix}

*Condensé de [grahammann.net](https://grahammann.net/blog/every-openclaw-use-case). Attribution complète dans l'article source.*

**Affaires et ventes (12)**
Capture de prospects et prospection PCI · flux de travail d'enchères automatisés · recherche de prospects avant les appels de vente · prise de rendez-vous auprès de grands comptes · équipes de prospection commerciale 24/7 · gestion d'une entreprise de kinésithérapie · opérations d
Création d'un produit via Telegram en un week-end (Pagedrop) · création d'application autonome en une nuit à partir des données de tendance de Reddit · orchestrateur d'applications iOS/web avec automatisation d'App Store Connect · projets matériels via SSH sur Raspberry Pi · pipeline de modules ERP personnalisés · développement de fonctionnalités en une nuit · codage
**Réseaux Sociaux & Contenu (11)**
Gestion multiplateforme pour 4 comptes X · Agent COO supervisant une équipe de 4 agents avec des briefings quotidiens sur l'actualité de l'IA · trois agents proposant des articles pour la publication Every · publication automatisée sur Reddit/TikTok/Discord/X · analyse du
**Équipes multi-agents (10)**
Mission Control à 10 agents (base de données Convex, signaux de vie toutes les 15 minutes) · équipe d'agents qui gère d'autres agents (open source) · 8 agents spécialisés exécutant plus de 50 tâches cron · équipe de
**Recherche et Analyse (7)**
Rapports de recherche nocturnes Linear → Obsidian · préparation de réunion via WhatsApp · indexation de contenu et rappel contextuel · recherche web nocturne pour des idées de projet · analyse des données de flux d'options (6 mois, SQLite + couche vectorielle) · modèle de prédiction des scores de la NCAA via Kaggle et SSH vers une station de deep learning · analyse nocturne des dépôts pour l'alignement des objectifs

**Vie Personnelle (7)**
Coordinateur du dîner du jeudi avec sondages de groupe · réservations pour le dîner via la discussion de groupe iMessage · gestion du serveur Minecraft des enfants par commande vocale · emploi du temps des enfants avec un agent effectuant des appels vocaux aux entraîneurs · planification des repas familiaux + coaching relationnel mensuel · planification de mariage depuis un avion via Discord · annonces familiales matinales via Alexa + iMessage

**Briefings quotidiens (6)**
Chef de cabinet IA avec auto-réflexion nocturne · briefing commercial quotidien avec des points de discussion pour les clients · calendrier visuel hebdomadaire avec des suggestions d'équilibrage de la charge · tri de la boîte de réception + 14 invitations à des réunions inutiles refusées automatiquement · PowerPoint généré automatiquement pour les réunions à venir avec des images · briefing de marché hebdomadaire dans Notion avec un lien Telegram

**Finance et Trading (5)**
Alertes sur les prix des actions et des cryptos · bots de crypto et d'options sur Nvidia Jetson · exécution automatique sur le marché de prédiction Kalshi · suivi des dépenses par e-mail (14 Go indexés) · suivi des dépenses et de la valeur nette

**
Créateur d'itinéraires de vol + Airbnb avec une tâche cron quotidienne pour les prix · outil de recherche de vols prime en première classe via Telegram (API SeatsAero) · automatisation de l'ajout d'événements au calendrier avec des entrées familiales détaillées

**Notes et gestion des connaissances (4)**
Voix → transcription Whisper → journal structuré → auto-commit sur GitHub · interaction avec Obsidian entièrement par la voix · des années d'images sauvegardées indexées par humeur et par sujet · classement des documents familiaux : photo/PDF → ROC → Google Drive trié

**Domotique (3)**
Contrôle total de Home Assistant via Telegram (garage, projecteur, lumières, Vestaboard) · Tableau de bord contextuel pour TV Samsung avec des affichages selon l'heure de la journée · Application de statut pour Dynamic Island pour voir ce que fait l'agent (open-source)

**Créatif et amusant (5)**
Arène de combat de mèmes 1c1 (+100 combats en une nuit, a déclenché une alerte de seuil d'API) · Matchmaking par IA via une évaluation de la compatibilité d'agent à agent · Monde virtuel où les agents se promènent et font des échanges · Assistant avec une personnalité de chien pour la construction et le codage · Apprenant en théorie musicale avec son propre compte Suno

**E-mail et Communication (4)**
Réponse automatique sur WhatsApp sur le ton que vous avez configuré · gestion de campagnes d'e-mails auprès de 2 400 utilisateurs via Supabase + Resend · réservation de restaurant via de véritables appels téléphoniques (ElevenLabs + Twilio) · envoi d'articles d'actualité sur Billie Eilish à un cousin tous les jours à 3h45 du matin