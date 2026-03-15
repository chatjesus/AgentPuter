---
title: "D'un agent à une équipe : comment fonctionnent les sous-agents OpenClaw"
description: "Un chercheur d'Anthropic a dépensé 20 000 $ en laissant 16 agents Claude parallèles écrire un compilateur C. Le système de sous-agents d'OpenClaw vous permet d'exécuter la même architecture pour votre briefing matinal — pour environ 0,03 $. Voici comment."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "10 min"
tags: ["OpenClaw", "Sub-Agents", "Agent Teams", "Parallel Agents", "sessions_spawn", "Claude Code"]
featured: false
---

---

# D'un agent à une équipe : Comment fonctionnent les sous-agents OpenClaw — Et ce que l'expérience de compilateur à 20 000 $ d'Anthropic nous apprend sur l'avenir

**En février, un chercheur d'Anthropic a dépensé 20 000 $ pour faire écrire un compilateur C par 16 agents Claude en parallèle. Le système de sous-agents d'OpenClaw vous permet d'exécuter la même architecture pour votre briefing matinal — pour environ 0,03 $.**

*Série sur l'infrastructure des agents · Partie 12*

---

---

Ce mois-ci, Nicholas Carlini, chercheur chez Anthropic, a publié une expérience qui s'apparente moins à de l'ingénierie logicielle qu'à de l'évolution biologique.

Il a chargé 16 instances de Claude Opus 4.6 de travailler

---

Le résultat ? Un compilateur C de 100 000 lignes basé sur Rust, écrit à partir de zéro, capable de compiler le noyau Linux 6.9 pour les architectures x86, ARM et RISC-V. Il fait même tourner Doom.

Ce n'était pas la démo d'un nouveau bouton « Make App » flambant neuf. C'était un prototype de recherche brut, construit avec les primitives de coordination les plus basiques : un conteneur Docker par agent, un dépôt git partagé et des verrous de fichiers — aucun orchestrateur

---

La plupart d'entre nous n'avons pas 20 000 $ à dépenser en appels d'API cette semaine. Mais le modèle architectural utilisé par Carlini — décomposer un objectif massif en tâches parallèles pour des agents indépendants — est exactement ce pour quoi le système de

---

## Pour commencer : Dissipons la confusion

Il y a actuellement trois concepts « multi-agents » qui circulent au sein de la communauté. Ils semblent similaires, mais ce sont des outils complètement différents.

---

| Concept | Description | Contexte d'utilisation |
|---------|-------------|------------------------|
| **Équipes d'agents Claude Code** | Une fonctionnalité expérimentale dans l'outil CLI `claude` d'Anthropic. Elle permet aux coéquipiers de s'envoyer des messages directement via un système de "

---

**Cet article traite des sous-agents OpenClaw.** C'est le seul des trois qui est aujourd'hui prêt pour la production pour des tâches d'automatisation générales.

---

---

## Comment fonctionnent les sous-agents OpenClaw

Au lieu qu'un seul agent fasse tout de manière séquentielle, un « agent principal » génère des « sous-agents » pour travailler en arrière-plan.

---

Agent Principal (Profondeur 0)
    │
    ├── sessions_spawn(tâche="Rechercher le concurrent A")
    │       └── Sous-Agent A (Profondeur 1, session isolée)
    │               └── travail... travail... → annonce les résultats
    │
    ├── sessions_spawn(tâche="Rechercher le concurrent B")
    │       └── Sous-Agent B (Profondeur 1, session isolée)
    │               └── travail... travail... → annonce les résultats
    │
    └── Reçoit les résultats → Synthétise le rapport final

### Comportements Clés

---

1.  **Non bloquant :** La commande `sessions_spawn` renvoie immédiatement un `runId`. L'Agent Principal peut continuer à travailler ou générer d'autres agents sans attendre.
2.  **Isolation du contexte :** Chaque Sous-Agent s'exécute dans

---

### La commande

L'outil est `sessions_spawn`. Notez que le nom du paramètre est `task`, et non `instruction`.

```javascript
sessions_spawn({
  task: "Search for the latest HackerNews AI headlines and return top 5",
  model: "gpt-4o-mini",         // Use a cheaper model for the worker
  runTimeoutSeconds: 120,       // Safety cutoff
  label: "news-fetcher",        // For your logs
  cleanup: "delete"             // Auto-delete session when done
})
```

---

---

## Quatre architectures concrètes

### Modèle 1 : Coordinateur + Agents (Le plus courant)

Il s'agit du modèle standard pour la recherche ou le traitement par lots.

```
Agent principal (Coordinateur)
  ├── Agent A : Rechercher le modèle de tarification

---

**Pourquoi ça fonctionne :** Si vous le faisiez séquentiellement, la fenêtre de contexte de l'Agent Principal se remplirait de HTML brut provenant de trois pages de tarification différentes. En parallélisant, chaque Worker traite les données brutes et ne renvoie que le résumé structuré.

**Modèle de Worker recommandé :** `gpt-4o-mini` ou `gemini-2.5-flash` (faible coût).

### Modèle 2 : Le Pipeline

---

Sous-agent 1 : Extraire les données brutes (compétence de recherche web)
      ↓
Sous-agent 2 : Nettoyer et structurer les données (compétence de raisonnement)
      ↓
Sous-agent 3 : Générer des aperçus

---

Agent Principal (Routeur)
  ├── "Planifier une réunion"   → Agent spécialiste Google Calendar
  ├── "Rédiger un e-mail"       → Agent spécialiste en rédaction
  └── "Faire une recherche sur ce sujet"  → Agent spécialiste en recherche web

**Conseil de pro :** Puisque les Sous-Agents ne chargent pas `SOUL.md`, vous devriez placer votre logique de routage dans `AGENTS.md`.

---

## Règles de routage de AGENTS.md

Lors du routage des tâches vers les sous-agents :
- Demandes de calendrier : lancer avec les compétences google-calendar et google-workspace
- Demandes de recherche : lancer avec la compétence web-search, utiliser le modèle gpt-4o-mini
- Demandes

---

**Séquentiel (Ancienne méthode) :** Vérifier la météo (5s) → Vérifier le calendrier (5s) → Vérifier les e-mails (10s) → Vérifier les actualités (10s) → Résumer (5s). Total : **~35 secondes.**

**Parallèle (Nouvelle méthode) :**
7h00 → L'Agent Principal génère instantanément 4 agents travailleurs :
*   **Agent A :** Prévisions AccuWeather pour San Francisco
*   **Agent B :** Réunions Google Calendar pour aujourd'hui
*   **Agent C :** Résumé des e-mails non lus de Gmail (signaler les éléments urgents)
*   **Agent D :** Top 5 des titres de HackerNews + TechCrunch

---

Le temps total est déterminé par l'agent le plus lent (~15 s) + la synthèse (5 s) = **~20 secondes.**

---

---

## Stratégie critique des coûts : « Patron intelligent, stagiaires bon marché »

Le plus grand risque avec les sous-agents est la multiplication des coûts. Si vous lancez 5 agents et qu'ils utilisent tous Claude Opus 4.6, vous venez de multiplier votre facture d'

---

**Les Stagiaires (Travailleurs) :** Effectuant généralement des tâches claires et délimitées (résume ceci, trouve cela).
*   **Modèle :** `openai/gpt-4o-mini` ou `google/gemini-2.5-flash`

Vous pouvez définir cette valeur par défaut dans votre configuration pour éviter les accidents :

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "openai/gpt-4o-mini",
        "maxSpawnDepth": 1,
        "maxChildrenPerAgent": 5
      }
    }
  }
}
```

---

---

## Avancé : Le Modèle Orchestrateur (Profondeur 2)

Par défaut, OpenClaw définit `maxSpawnDepth: 1`, ce qui signifie qu'un Sous-Agent ne peut pas créer ses propres Sous-Agents.

Pour les projets complexes, vous pouvez activer la Profondeur 2 :

```json
{ "agents": { "defaults": { "subagents": { "maxSpawnDepth": 2 } } } }
```

Cela permet une hiérarchie à trois niveaux :

---

Agent Principal (PDG)
  └── Agent Orchestrateur (Manager) — Possède la permission sessions_spawn
        ├── Travailleur A (Stagiaire) — Ne peut pas en créer
        ├── Travailleur B (Stagiaire)
        └── Travailleur C (Stagiaire)

Cela reflète la structure de l'expérience du compilateur à 20 000 $ : un objectif de haut niveau est défini, une entité autonome gère la décomposition, et des travailleurs individuels exécutent les morceaux.

---

---

## OpenClaw face aux équipes d'agents de Claude Code

Les deux existent. Lequel devriez-vous réellement utiliser ?

---

| Fonctionnalité | Sous-agents OpenClaw | Équipes d'agents Claude Code |
| :--- | :--- | :--- |
| **Public Cible** | Automatisation générale (e-mails, recherche, opérations) | Codage et génie logiciel |
| **Communication** | Hub-and-spoke (les Workers rapportent au Main) | Mesh (les coéquipiers s'envoient des messages entre eux) |
| **Maturité** | Fonctionnalité prête pour la production | Alpha / Expérimental |
| **Configuration** | Intégré, aucune configuration requise | Nécessite de modifier `settings.json` |
| **Contexte** | Indépendant par agent | Indépendant par agent |

---

Si vous construisez un compilateur, utilisez Claude Code. Si vous construisez un assistant personnel ou un flux de travail d'entreprise, utilisez OpenClaw.

---

---

## Limitations pratiques

---

1.  **Communication unidirectionnelle :** Les sous-agents ne peuvent que « faire un rapport » à leur parent. Ils ne peuvent pas interroger le parent pour obtenir des éclaircissements en cours de tâche.
2.  **Pas de `SOUL.md` :**

---

## Si vous ne souhaitez pas gérer cela : TinyClaw

Gérer les architectures d'agents parallèles, configurer `maxSpawnDepth` et surveiller les coûts en jetons sur plusieurs modèles est une tâche complexe.

[TinyClaw](https://tinyclaw.dev) simplifie cela

---

Gérer une équipe d'agents ne doit pas forcément coûter 20 000 $. Commencez par un briefing matinal.

→ [tinyclaw.dev](https://tinyclaw.dev) · Démarrage gratuit · Votre équipe d'agents opérationnelle en 60 secondes