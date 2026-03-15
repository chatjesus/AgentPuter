---
title: "Comment utiliser OpenClaw pour moins de 30 $/mois (Le guide complet des coûts)"
description: "Un utilisateur a dépensé 254 $ en deux semaines. Federico Viticci a atteint 3 600 $ en un mois. Une personne s'est réveillée avec une surprise de 141 $ due aux signaux de présence nocturnes. Les six endroits où OpenClaw brûle des jetons, ce que les versions 3.7 et 3.8 ont changé, et comment de vrais utilisateurs ont réduit leurs factures de centaines de dollars à moins de 30 $ — sans renoncer à l'essentiel."
date: "2026-03-09"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "Optimisation des Coûts", "Routage de Modèles", "Ollama", "Budget", "Pulsation", "lossless-claw"]
featured: true
---

# Comment Exécuter OpenClaw pour Moins de 30 $/Mois (Le Guide Complet des Coûts)

AgentPuter · Mars 2026 · ~20 min · #OpenClaw #OptimisationDesCoûts #RoutageDeModèles #Ollama #Budget

> **Sources :**
> - [Comment arrêter de gaspiller de l'argent avec OpenClaw](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) — r/PromptEngineering
> - [Le meilleur LLM abordable du moment (Fév 2026)](https://github.com/openclaw/openclaw/discussions/12267) — Discussion GitHub #12267
> - [Comment le plugin MemOS réduit les coûts en jetons d'OpenClaw de 70 %](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) — Medium, 4 Mars 2026
> - [ibl.ai OpenClaw Router](https://github.com/iblai/iblai-openclaw-router) — GitHub
> - [Réduisez les coûts de vos LLM OpenClaw : Guide SaladCloud](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — Blog de SaladCloud, 9 fév. 2026
> - [Pourquoi OpenClaw est-il si gourmand en tokens ? 6 raisons analysées](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) — Blog d'Apiyi, fév. 2026
> - [Comment je fais tourner 19 agents OpenClaw pour 6 $ par mois](https://www.youtube.com/watch?v=-MtzLiQ9w1c) — YouTube, 1er mars 2026
> - [Notes de version d'OpenClaw 2026.3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [Notes de version d'OpenCl
*« Pourquoi mon agent coûte-t-il si cher ? »*

Un utilisateur a dépensé 254 $ en deux semaines. Un autre a atteint 800 $ en un mois. Le blogueur tech Federico Viticci a accumulé une [facture mensuelle
Ce ne sont pas des utilisateurs avancés qui repoussent les limites. Ce sont des configurations normales avec une utilisation normale.

OpenClaw est gratuit. Les modèles qu'il sollicite ne le sont pas. Et comme OpenClaw est conçu pour fonctionner 24h/24 et
Cet article est le guide qui aurait dû être fourni avec OpenClaw. Nous allons détailler exactement où va l'argent, ce que les dernières versions (3.7 et 3.8) ont changé pour vous aider, et comment de vrais utilisateurs ont réduit leurs factures de plusieurs
Chaque fois qu'OpenClaw effectue un appel API, il charge vos fichiers `SOUL.md`, `AGENTS.md` et autres fichiers d'amorçage dans le prompt. Ceux-ci ne sont pas chargés une seule fois — ils sont envoyés avec **
Un utilisateur sur r/LocalLLaMA [a réduit son bootstrap de 85 Ko à 27 Ko](https://www.reddit.com/r/LocalLLaMA/comments/1r3ro5h/) — une réduction de 69,8 % — en supprim
Votre historique de session s'allonge à chaque échange. Après quelques heures d'utilisation active, vous transportez des dizaines de milliers de jetons dans l'historique. Tout cet historique accompagne chaque nouvelle requête. C'est le principal facteur de coût pour les utilisateurs intensifs —
Le battement de cœur d'OpenClaw s'exécute toutes les 30 minutes par défaut. Chaque vérification est un appel API complet incluant tout votre contexte système. Sur Opus, cela représente une dépense significative — 48 battements de cœur par jour, chacun
### 4. Génération de sous-agents

Lorsque votre agent principal délègue à des sous-agents, chacun se lance avec son propre contexte, sa propre mémoire et ses propres appels de modèle. Les utilisateurs exécutant des configurations multi-agents (un pour l'écriture, un pour la recherche, un pour le codage) paient un surcoût de contexte pour chaque agent — et perdent du contexte à chaque passage de relais.

### 5. Sorties d'outils
Extractions de navigateur, lectures de fichiers, résultats de recherche — les sorties d'outils sont stockées dans la transcription et renvoyées avec les messages suivants. Une seule extraction web peut déverser des milliers de jetons dans votre historique, qui persistent pour le reste de la session
## Si vous n'avez pas encore commencé : La méthode gratuite pour débuter

Avant de passer à l'optimisation, une remarque pour ceux qui n'ont pas encore configuré OpenClaw.

Vous n'avez pas besoin de dépenser un seul dollar pour l'essayer. **Gemini 2.5 Flash-Lite** propose un [niveau gratuit](https://ai.google.dev/gemini-api/docs/pricing) avec des quotas quotidiens généreux — suffisants pour faire fonctionner un agent de base pour un usage personnel léger. MiniMax M2.5 Standard à 0,15 $/1,20 $ par million de jetons est l'étape suivante — moins d'un centime par interaction d'agent typique.

La configuration minimale :
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // niveau gratuit
    }
  }
}
```

Connectez un canal (juste Telegram ou WebChat), gard
**API du plugin de moteur de contexte + lossless-claw.** Le [plugin lossless-claw](/blog/lossless-claw) maintient votre contexte actif dans une plage de 30 000 à 100 000 tokens, quelle que soit la durée de la conversation
**MiniMax-M2.5-highspeed en tant que modèle de première classe.** Ce n'est plus un bricolage — il est correctement intégré au catalogue de modèles, à l'intégration et au routage. C'est un modèle rapide et peu coûteux qui prend en charge
**`openclaw backup create` et `openclaw backup verify`.** Ce n'est pas directement une fonctionnalité liée aux coûts, mais si vous avez déjà perdu une configuration et dû la reconstruire — c'est du temps et des jetons gaspillés pour rétablir le contexte avec votre agent.

**Mode contexte-LLM de la recherche web Brave.** `tools.web.search.brave.mode: "llm-context"` renvoie des extraits d'ancrage extraits au lieu du contenu brut de la page. Des résultats de recherche structurés se traduisent par moins de jetons de suivi à analyser et à ré-interroger.
**Temporisation du silence en mode vocal.** `talk.silenceTimeoutMs` vous permet de contrôler le moment où l'entrée vocale est envoyée automatiquement. Évite les envois prématurés qui gaspillent un appel API aller-retour pour une demi-phrase.

**Correct
Tous les utilisateurs qui ont réduit leur facture disent la même chose : la solution n'était pas une technique spécifique — mais de voir où allait l'argent.
Connectez-vous dès maintenant à votre tableau de bord de fournisseur d'API. Consultez les dépenses journalières. Repérez les pics. Un utilisateur sur [r/openclaw a suivi chaque dollar dépensé pendant 30 jours](https://www.reddit.com/r/LocalLLM/
Dans OpenClaw, utilisez `/status` pour voir le modèle et le nombre de jetons de la session actuelle. Utilisez `/usage full` pour obtenir une ventilation des coûts par réponse. On ne peut pas optimiser ce qu'on ne peut pas mesurer.

---

## Stratégie 2 : Corrigez votre Heartbeat (Un seul changement de configuration, économise 30–50 $/mois)

Le heartbeat est la source la plus courante de coûts inattendus. Par défaut : toutes les 30 minutes, un appel API complet, modèle principal. Cela représente 48 appels par jour, chacun transportant votre prompt système complet.

**Réduisez la fréquence :**

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        intervalMinutes: 120
      }
    }
  }
}
```

Cela fait passer le nombre d'appels de 48 à 12 par jour, soit une réduction de 7
Chaque jeton de votre invite système est facturé à chaque appel. C'est le coût multiplicatif qui échappe à la plupart des gens.

Un exemple réel de la communauté :

| Métrique | Avant | Après |
|---|---|---|
| Taille de SOUL.md
Ouvrez votre SOUL.md. Lisez chaque ligne. Demandez-vous : « L'agent a-t-il vraiment besoin de cela à chaque appel ? » Du contexte spécifique à un projet datant d'il y a trois mois ? Déplacez-le vers une compétence. Des notes historiques ? Déplacez-les vers un fichier de référence. Votre invite système doit être épurée et intemporelle.

De plus : utilisez `/new` lorsque vous passez d'une tâche à l'autre sans rapport. Ne transportez pas une conversation de 50 000 jetons sur le projet A dans le projet B.

---

## Stratégie 4 : Activer la mise en cache de l'invite (une ligne, 40 % d'économie sur l'entrée)
C'est le gain le plus facile que les données sources de l'article soulignent à plusieurs reprises.

Anthropic prend en charge la mise en cache automatique des invites pour les modèles Claude. Comme OpenClaw envoie la même invite système (SOUL.md + AGENTS.md) à chaque appel, c'est un candidat parfait pour la mise en cache. Le premier appel paie le plein tarif ; les appels suivants dans la fenêtre de cache obtiennent les jetons de l'invite système avec une réduction de 90 %.
Un utilisateur [qui a suivi ses dépenses sur 30 jours](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/) a rapporté : *«
Pour les modèles Anthropic, la mise en cache des prompts est activée par défaut dans les versions récentes d'OpenClaw. Pour les autres fournisseurs, vérifiez si votre modèle le prend en charge — les modèles Gemini de Google proposent également la [mise en cache du contexte](https://ai.google
Une vérification de routine qui demande « du nouveau dans ma boîte de réception ? » n'a pas besoin d'Opus. Une classification de message (« est-ce urgent ? ») n'a pas besoin de Sonnet. Ce sont des tâches de niveau Haiku.

Voici un comparatif
| Routé | 35 $ | Même utilisateur, mêmes tâches |

**Comment faire — Option A : Configuration manuelle**

Définissez votre modèle par défaut sur un modèle peu coûteux et n'utilisez Opus que lorsque vous en avez explicitement besoin :

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-haiku-4-5",  // par défaut pour tout
      subagents: {
        model: "anthropic/claude-haiku-4-5", // sous-agents également
      }
    }
  }
}
```

Ensuite, basculez vers un modèle plus puissant lorsque vous avez besoin de raisonnement :

```
/model claude-opus-4-6
```
Lorsque vous avez terminé la tâche complexe, rebasculez sur :

```
/model claude-haiku-4-5
```

**Comment faire — Option B : Proxy de routage automatique**

Il existe désormais plusieurs routeurs open-source qui classent chaque requête et la routent automatiquement :

- [**ibl.ai OpenClaw Router**](https://github.com/iblai/iblai-openclaw-router) — proxy Node.js sans dépendance, évalue les requêtes selon 14 dimensions en <1 ms, route vers Léger (Haiku) / Moyen (Sonnet) / Lourd (Opus). S'exécute localement, aucune donnée n'est envoyée à des tiers.
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) — notation locale à 15 dimensions, la communauté signale ~90 % d'économies par rapport à l'utilisation systématique d'Opus.

Tous deux se placent entre
          "anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

Ce n'est pas un routage par complexité — c'est un filet de sécurité pour les limites de taux et les pannes. Mais combiné avec l'assignation de modèle par canal ou par agent, vous pouvez router différentes charges de travail vers différents niveaux de prix.

---

## Stratégie 6 : Un Agent, Plusieurs Compétences (Les plus grosses économies dont personne ne parle)
Ceci provient directement du [guide des coûts de r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) :

> *« Un utilisateur est passé de dépenses de
Chaque instance d'agent a une surcharge : son propre prompt système, sa propre mémoire, sa propre fenêtre de contexte. Exécuter cinq agents signifie payer cinq fois le coût d'initialisation à chaque appel.

Les Compétences OpenClaw sont des fichiers markdown qui donnent à
├── coding/SKILL.md
└── calendar/SKILL.md
```

L'agent choisit la bonne compétence en fonction de ce que vous lui demandez de faire. Pas de transfert. Pas de perte de contexte. Pas de jetons d'amorçage dupliqués.

**Quand utiliser le multi-agent :** Lorsque vous avez réellement besoin d'une exécution parallèle — plusieurs tâches s'exécutant simultanément, et non séquentiellement. Pour tout le reste, les compétences sont moins chères et meilleures.

---

## Stratégie 7 : Exécuter des modèles locaux pour les tâches routinières (Coût marginal nul)
Faire tourner un modèle sur votre propre matériel signifie que chaque inférence est gratuite après la configuration initiale.

**Ce qui fonctionne pour OpenClaw :**

| Modèle | Matériel | Vitesse | Idéal pour |
|--------|----------|---------|------------|
| Qwen 3 32B | RTX 4090 | 40+ tok/s | Travail d'agent général |
| Qwen 3 14B | RTX 3060 / Mac mini M2 | 25+ tok/s | Pulsations, classification |
| Llama 3.3 70B | 2x RTX 4090 | 20+ tok/s | Code, raisonnement complexe |

**Configuration avec Ollama :**

```bash
# Installer Ollama
```
curl -fsSL https://ollama.com/install.sh | sh

# Téléchargez votre modèle
ollama pull qwen3:32b

# Configuration d'OpenClaw
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434"
      }
    }
  }
}

OpenClaw 3.7+ prend en charge les embeddings Ollama nativement pour la recherche en mémoire, de sorte que votre mémoire à long terme reste également locale.
**L'approche hybride** (ce que font la plupart des utilisateurs soucieux des coûts) : un modèle local par défaut pour les tâches de routine, et une API cloud (Sonnet ou Opus) uniquement lorsque l'agent a besoin d'un raisonnement approfondi. Un
**Utilisez la mémoire vectorielle au lieu du contexte brut.** La recherche en mémoire d'OpenClaw extrait les souvenirs pertinents via une recherche par embeddings plutôt que de tout charger dans le prompt. Avec les embeddings Ollama (3.7+), c'est à la fois plus intelligent et gratuit :

```json5
{
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  }
}
```
**Installez lossless-claw.** Comme abordé dans [notre article précédent](/blog/lossless-claw), le plugin lossless-claw maintient un contexte actif entre 30 000 et 100 000 tokens grâce à des résumés incrémentiels. Vous n'atteignez jamais le plafond qui force une compaction d'urgence, et vous ne perdez jamais d'informations qui vous obligent à refaire votre travail.

---

## Guide des prix des modèles 2026

Les prix des modèles changent rapidement. Voici où en sont les choses en mars 2026 :

| Modèle | Entrée (par 1M de tokens) | Sortie (par 1M de tokens) | Idéal pour | Source |
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | 0,07 $ | 0,40 $ | Extraction économique, requêtes simples | Z.AI |
| **Gemini 2
| **Claude Haiku 4.5** | 1,00 $ | 5,00 $ | Signaux de vie, classification, formatage | Anthropic |
| **Claude Sonnet 4.6** | 3,00 $ | 15,
Le calcul est simple : si 80 % des appels de votre agent sont routiniers et que vous les dirigez vers Haiku (1 $/5 $) au lieu d'Opus (5 $/25 $), vous avez réduit votre facture de 80 % sur ces appels. Ajoutez la mise en cache des prompts, un SOUL.md allégé et des modèles locaux pour
// Sonnet pour votre interaction principale — assez puissant pour du vrai travail
      model: "anthropic/claude-sonnet-4-6",

      // Les sous-agents utilisent Haiku par défaut
      subagents: {
        model: "anthropic/claude-haiku-4-5",
        runTimeoutSeconds: 120
      },

      // Pulsation : modèle local, intervalle plus long
      heartbeat: {
        intervalMinutes: 120,
        // Ou rediriger vers Haiku si aucun modèle local n'est disponible
      }
    }
  },

  // Ollama local pour les embeddings (recherche en mémoire gratuite)
  memory: {
provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // lossless-claw pour éviter le gonflement du contexte
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // Recherche Brave avec le mode llm-context (moins de jetons de suivi)
  tools: {
    web: {
      search: {
        brave: {
          mode: "llm-context"
        }
      }
    }
  }
}
```

**Répartition des coûts mensuels (estimation, 30 jours) :**
| Composant | Jetons/jour | Modèle | Coût/mois |
|-----------|-----------|-------|------------|
| Interaction principale (~2 h actives) | ~80K (50K en entrée + 30K en sortie) | Sonnet | ~18 $ |
| Appels de sous-agents | ~30K | Haiku | ~1,50 $ |
| Pulsation (12/jour) | ~30K | Local/Haiku | 0–1 $ |
| Plongements de mémoire | — | Local (Ollama) | 0 $ |
| Suivis de recherche web | ~20K | Sonnet | ~2 $ |
| Économies grâce à la mise en cache des invites | — | — | –4 $ |
| **Total** | | | **~19–22 $** |
*Calcul : Interaction principale = 50K en entrée × 3 $/M × 30 = 4,50 $, plus 30K en sortie × 15 $/M × 30 = 13,50 $ = 18 $/mois. La mise en cache des prompts réduit les entrées répétées du prompt système d'environ 40 %.*

C'est un agent entièrement fonctionnel, toujours actif, doté de la navigation web, d'une mémoire et d'un raisonnement en plusieurs étapes — pour moins cher qu'un abonnement Netflix.

---

## La checklist en 5 minutes

Si vous ne faites rien d'autre, faites ces cinq choses aujourd'hui :
**1. Vérifiez votre facture.** Connectez-vous au tableau de bord de votre fournisseur d'API. Examinez les dépenses journalières. Repérez les pics.

**2. Augmentez l'intervalle de votre pulsation.** Ajoutez `heartbeat.intervalMinutes: 12
**4. Définissez un modèle de sous-agent.** Ajoutez `agents.defaults.subagents.model` à votre configuration. Ne laissez pas les sous-agents hériter de votre modèle principal coûteux.

**5. Installez lossless-claw.** `openclaw plugins install lossless-claw`. Empêche le cycle explosion du contexte → compaction → ré-exécution du travail qui double discrètement votre dépense en jetons.

---

## À venir

L'écosystème OpenClaw s'attaque au problème du coût sous plusieurs angles :
- Le **MemOS Cloud Plugin** a rapporté [une réduction de 72 % des jetons](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) sur le benchmark de conversation longue LOCOMO en déchargeant la mémoire sur un système dédié
- **QMD** (par le cofondateur de Shopify, Tobi Lütke) offre des économies de jetons de 60 à 97 % grâce à la recherche sémantique locale
- Les **proxys de routage automatique** comme ibl.ai Router et ClawRouter rendent la sélection manuelle de modèles obsolète
- L'ouverture de l'**API du Moteur de Contexte** dans la version 3.7 signifie que la communauté peut développer des approches entièrement nouvelles en matière d'efficacité du contexte.

La tendance est claire : l'environnement d'exécution de l'agent devient conscient
*Vous utilisez OpenClaw avec un budget limité ? Partagez votre coût mensuel et votre configuration dans les commentaires. Nous collectons des données pour un benchmark communautaire des coûts — l'objectif est de trouver le coût le plus bas possible pour chaque niveau de capacité d'agent.*

*À suivre : [OpenClaw vs Nanobot](/blog/openclaw-vs-nanobot) — quand un agent minimal de 4 000 lignes de l'Université de Hong Kong pourrait en fait être le bon choix.*

---
*Sources : [Guide des coûts de r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [Discussion GitHub #12267](https://github.com/openclaw/openclaw/discussions/12267) · [Analyse du plugin MemOS](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [Routeur ibl.ai](https://github.com/iblai/iblai-openclaw-router) · [Guide des coûts de SaladCloud](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [Analyse des jetons Apiyi](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*