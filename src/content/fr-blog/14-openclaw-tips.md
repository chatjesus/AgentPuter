---
title: "Guide de l'utilisateur avancé d'OpenClaw : 30 astuces que personne ne vous dit"
description: "maxSpawnDepth est à 1 par défaut, pas à l'infini. SOUL.md est invisible pour les sous-agents. cleanup conserve les fichiers indéfiniment à moins que vous ne le modifiiez. 30 astuces testées en production pour combler l'écart entre 'ça fonctionne' et 'bien configuré'."
date: "2026-02-21"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "Configuration", "Sub-Agents", "Skills", "Cost Control", "Security", "Tips"]
featured: true
---

---

# Guide de l'utilisateur avancé d'OpenClaw : 30 astuces que personne ne vous dit

*Communauté OpenClaw · Février 2026*

La plupart des gens installent OpenClaw, lancent un agent, et pensent que c

---

Ces 30 astuces sont issues de l'utilisation en production et d'une lecture attentive de la documentation officielle. Certaines sont évidentes avec le recul. La plupart ne le sont pas du tout.

---

---

## Table des matières

1. [Principes de base de la configuration (Conseils 01–08)](#chapter-1)
2. [Sélection et utilisation des compétences (Conseils 09–14)](#chapter-2)
3. [Architecture des sous-agents (Conseils 15–20)](#chapter-3)
4. [Maîtrise des coûts (Conseils 21–25)](#chapter-4)
5. [Débogage et sécurité (Conseils 26–30)](#chapter-5)
6. [Ignorez tout ceci : TinyClaw](#tinyclaw)

---

---

## Fondamentaux de la configuration {#chapter-1}

---

### 01. AGENTS.md vs SOUL.md : ce que les sous-agents consultent réellement

OpenClaw charge les fichiers selon une hiérarchie à trois niveaux :

```
~/.open

---

Cela déroute beaucoup de gens. Ils écrivent la logique de routage dans `SOUL.md`, déploient une architecture fan-out, puis passent une heure à se demander pourquoi les sous-agents n'effectuent pas le routage correctement. Ils ne le font pas correctement parce qu

---

## Routage
- Questions financières → finance-agent
- Revue de code → code-reviewer
- Recherche → research-storm
```

Règle simple : si un sous-agent a besoin de le savoir, cela ne peut pas se trouver dans `SOUL.md`.

---

Chaînes courantes en date de février 2026 :

---

| Modèle | Idéal pour |
|-------|---------|
| `anthropic/claude-opus-4-6` | Tout ce qui nécessite un véritable raisonnement |
| `anthropic/claude-sonnet-4-6` | La plupart des choses — qualité proche d'Opus, beaucoup moins cher |
| `anthropic/claude-haiku-4-5` | Tâches d'exécution où la vitesse prime sur la profondeur |
| `google/gemini-3.1-pro-preview` | Documents longs, entrées multimodales |
| `openai/gpt-4o-mini` | Résumé, classification, conversion de format |
| `ollama/qwen2.5` | Tout ce qui ne peut pas quitter votre réseau |

---

Pour définir la valeur par défaut globale pour les sous-agents :

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }

---

OpenClaw lit `.env` automatiquement. Il n'y a aucune raison de mettre les clés ailleurs.

---

### 04. maxSpawnDepth par défaut à 1

Si vous avez vu `SpawnDepthExceeded` et que vous ne saviez pas pourquoi, en voici la raison.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2
      }
    }
  }
}
```

---

La valeur par défaut est 1 — un niveau de sous-agents. Le maximum est 5, mais en pratique, 2 couvre presque toutes les architectures réelles. Les nœuds feuilles de profondeur 2 ne peuvent pas en générer d'autres ; tenter d'aller plus en profondeur

---

### 05. La valeur par défaut de runTimeoutSeconds est 0

Zéro signifie aucun délai d'attente. Un sous-agent bloqué s'exécute indéfiniment.

```json
{
  "agents": {
    "defaults": {

---

120 secondes suffisent pour la plupart des tâches. Les agents gourmands en données ont parfois besoin de 300. L'essentiel à comprendre : l'expiration du délai arrête l'exécution mais ne supprime pas la session. Vous avez besoin de `cleanup`

---

{
  "agents": {
    "defaults": {
      "subagents": {
        "cleanup": "delete"
      }
    }
  }
}
```

Le terme « delete » est trompeur — il renomme la transcription en `*.deleted.*` plutôt que de la supprimer. Votre historique est conservé ; votre répertoire de travail reste propre. Les sessions qui ne sont pas nettoyées restent en attente jusqu'à l'auto-archivage de 60 minutes, ce qui est long si vous exécutez des agents fréquemment.

---

### 07. Connecter context7 pour empêcher les agents d'halluciner des API

---

Il s'agit du MCP ayant le plus grand impact que vous pouvez ajouter pour les flux de travail de développement. Les agents interrogent la documentation officielle en temps réel au lieu de deviner à partir de données d'entraînement datant de plusieurs mois ou années.

```json
{

---

Demandez *"comment fonctionnent les Server Actions dans la dernière version de Next.js ?"* et vous obtiendrez la documentation actuelle, et non une version bêta de 2023.

---

### 08. TOOLS.md est votre limite de permissions

Sans `TOOLS

---

`refuser` l'emporte sur `autoriser`. Dans les configurations multi-agents, cela a plus d'importance qu'il n'y paraît — si une compétence est compromise, un fichier `TOOLS.md` permissif permet à l'onde de choc de se propager à travers tout votre graphe d'agents.

---

---

## Sélection et Utilisation des Compétences {#chapter-2}

---

### 09. Le score de sécurité n'est pas une décoration

ClawHub et agentskills.io affichent tous deux un score de sécurité pour chaque compétence. Lisez-le.

- **A/B (80+) :** Convient à la production
- **C (70–79) :** Vérifiez les portées OAuth qu'elle demande avant de l'installer
- **D (≤69) :** Testez dans un bac à sable. Sérieusement.

---

En février 2026, l'incident ClawHavoc a retiré 341 compétences de ClawHub. Elles contenaient des charges utiles d'injection de prompt — dont certaines étaient si subtiles qu'une inspection manuelle ne les aurait pas détectées. Le score

---

`self-improvement` consigne les erreurs, les corrections et les lacunes de connaissances de chaque session dans `.learnings/ERRORS.md`. Avant que la session suivante ne commence, l'agent relit ce fichier — il commence donc en sachant déjà ce qui a mal tourné la dernière fois.

Aucune configuration supplémentaire. Aucune deuxième compétence requise. Installez-le, exécutez la même tâche récurrente pendant deux semaines, et comparez. L'effet cumulé est réel.

---

### 11. Ordre de chargement des compétences : le dernier l'emporte

---

L'ordre de chargement est le suivant : `TOOLS.md` → `AGENTS.md` → `SKILL.md`. Si un skill définit un outil avec le même nom qu'un élément de votre `AGENTS.md`, la version du skill prend le dessus.

---

Le `SKILL.md` minimal viable comporte trois sections :

```markdown
# my-skill/SKILL.md
```

---

## Ce que je fais
Analyser les données de ventes CSV et générer des résumés hebdomadaires.

---

## Quand m'utiliser
Après la clôture d'une période de vente, lorsque vous disposez d'un export CRM.
Ne pas utiliser pour les données en temps réel ou les ensembles de données non commerciaux.

---

## Comment je travaille
1. Lire le fichier CSV à partir du chemin indiqué dans l'invite de la tâche
2. Calculer les totaux, les meilleures performances et le delta d'une période à l'autre
3. Mettre en forme en tableau Markdown
4. Enregistrer dans output/sales_summary_[date].md

C'est tout. Les agents peuvent suivre des instructions en langage courant. Vous n'avez pas besoin d'apprendre une syntaxe spéciale.

---

### 13. ClawHub vs agentskills.io : des outils différents pour des tâches différentes

---

| | clawhub.ai | agentskills.io |
|-|-----------|----------------|
| Taille du catalogue | 3 286 compétences | 19 309 compétences |
| Curation | Auditées pour la sécurité, sélectionnées | Soumissions de la

---

`proactive-agent` prend en charge le WAL (récupération après plantage, persistance du contexte entre les redémarrages), la planification Cron autonome et la restauration du contexte après une interruption.

Un exemple concret de ce que cela permet :

```
Plan

---

Aucun bouton à presser. Aucune intervention humaine. Ça s'exécute tout seul. C'est à ce moment que les agents cessent d'être perçus comme des outils et commencent à s'apparenter à une infrastructure.

---

---

## Architecture de sous-agents {#chapter-3}

---

### 15. Distribution en éventail (Fan-out) : le changement le plus impactant que la plupart des équipes n'ont pas encore fait

Séquentiel :
```
Principal → récupérer les

---

Distribution en éventail :
```python
sessions_spawn(task="récupérer les données du marché",  label="market-data",    model="anthropic/claude-haiku-4-5")
sessions_spawn(task="résumer les actualités",             label="

---

`sessions_spawn` renvoie immédiatement un `runId` et n'est pas bloquant. L'agent principal continue. Cette seule modification — restructurer le travail séquentiel en fan-out — réduit la latence de 30 à 40 % pour les flux de

---

# Surcharge pour la seule tâche qui en a vraiment besoin
sessions_spawn(
    task="concevoir le modèle de données pour la facturation multi-locataire",
    label="billing-schema",
    model="anthropic/claude-opus-4-6"
)
```

En pratique : Haiku gère plus de 80 % des tâches d'exécution sans perte de qualité significative. La différence de coût est réelle — une réduction de 50 à 60 % des dépenses d'API pour les architectures typiques en éventail (fan-out).

---

### 17. Logique de routage dans AGENTS.md, et non dans SOUL.md

---

À répéter, car cela provoque des échecs silencieux à chaque fois :

```markdown
# ❌ Dans SOUL.md — les sous-agents ne peuvent pas voir ceci
Lorsque l'utilisateur pose des questions sur les finances, déléguer à finance-agent.

# ✅

---

# ✅
sessions_spawn(
    task="analyser les chiffres du T4",
    label="q4-sales-analysis-2026"
)
```

Sans étiquette, `/subagents list` vous renvoie un mur de sessions anonymes.

---

Le mécanisme `announce` est unidirectionnel : le sous-agent rend compte une fois sa tâche terminée. Il ne peut pas s'interrompre pour poser une question de clarification en cours d'exécution.

Cela signifie que votre invite de tâche doit contenir tout ce dont l'agent a besoin :

```python
# ❌ Trop vague — produira des résultats inutilisables ou rien du tout
sessions_spawn(task="analyser les données", label="analyse")
```

---

# ✅ Autonome
sessions_spawn(
    task="""
    Analyser /data/sales_jan_2026.csv.
    Sortie : 1) Revenu mensuel total, 2) Top 5 des produits par unités,
    3) Variation mensuelle par rapport à /data/sales_dec_2025.csv.
    Format : Tableau Markdown. Enregistrer dans /output/jan_2026_report.md.
    Si l'un ou l'autre des fichiers est manquant, écrire dans /output/errors.log et s'arrêter.
    """,
    label="jan-2026-analysis"
)
```

---

Imaginez que vous écrivez des instructions pour quelqu'un qui entre dans une pièce, ferme la porte et ne peut plus en sortir pour vous poser des questions.

---

### 20. Surveillez vos limites de concurrence

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 3
      }
    }
  }
}
```

`maxChildrenPerAgent` limite le nombre de sous-agents qu'un parent peut générer (par défaut : 5). `maxConcurrent` est le plafond global du nombre d'agents parallèles (par défaut : 8).

---

L'atteinte de l'une ou l'autre de ces limites ne provoque aucun plantage — les agents sont mis en file d'attente — mais la latence augmente. Si vous utilisez un forfait API personnel avec des limites de débit plus basses, réduire `maxConcurrent` à 3 ou 4 évite les erreurs 429. Avec un forfait d'entreprise, vous pouvez l'augmenter.

---

---

## Contrôle des coûts {#chapter-4}

---

### 21. Installer save-money pour le routage automatique des modèles

```bash
openclaw install save-money
```

La compétence surveille la complexité de la tâche et la dirige vers le modèle le moins cher capable de la traiter : Haiku pour la classification et le formatage, Sonnet pour la génération standard, Opus pour tout ce qui nécessite un raisonnement réel. Le seuil est configurable.

---

Les utilisateurs signalent systématiquement une réduction des coûts mensuels de 50 % ou plus. Le routage n'est pas parfait, mais il n'a pas besoin de l'être — même en orientant 60 % des tâches vers Haiku au lieu d'Op

---

Particulièrement pertinent pour les agents de recherche qui s'exécutent pendant plusieurs heures, l'édition itérative de documents et les longues sessions de débogage. Si vos agents approchent régulièrement des limites de contexte, activez cette option.

---

### 23. utilisation d

---

Éléments à surveiller : un sous-agent utilisant 5 fois plus de jetons que les autres (l'invite est trop longue), un outil appelé 20 fois dans une seule session (l'agent est en boucle), Opus sur des tâches que Sonnet pourrait gérer (routage mal configuré). La correction de ces schémas est rapidement amortie.

---

### 24. Épingler gpt-4o-mini pour la synthèse et la classification

---

{
  "tasks": {
    "summarize": { "model": "openai/gpt-4o-mini" },
    "classify":  { "model": "openai/gpt-4o-mini" },
    "translate": { "

---

### 25. Les données sensibles passent par un modèle local

```json
{
  "mcpServers": {
    "local-llm": {
      "model": "ollama/qwen2.5",
      "baseUrl": "http://localhost:11434"
    }
  }
}
```

---

Dossiers financiers, données des employés, documents internes — tout ce qui ne doit pas quitter votre réseau est envoyé à Ollama. Qwen2.5 fonctionne bien sur du matériel local (plusieurs options de taille de 0,5B à 72B), prend en charge un contexte de 128K et gère l'appel de fonctions. Il est plus lent que les API cloud, mais pour les charges de travail sensibles, c'est le compromis à faire.

---

---

## Débogage et Sécurité {#chapter-5}

---

### 26. Les logs verbeux avant toute chose

```bash
openclaw debug --verbose
/subagents log <runId>
```

Le log verbeux affiche chaque appel d'outil, chaque décision de routage et le contexte complet à chaque étape. Neuf fois sur dix, le problème est évident dès que vous consultez le log — l'agent a essayé d'appeler un outil qui n'existe pas, s'est retrouvé coincé dans une boucle de réessai, ou travaillait à partir d'un prompt qui n'incluait pas les informations dont il avait besoin.

---

Ne déboguez pas par hypothèse quand vous pouvez simplement lire ce qui s'est passé.

---

### 27. Les timeouts et les échecs sont différents — traitez-les différemment

```bash
/subagents list
```

Vérifiez la colonne `

---

Ils nécessitent des correctifs différents. Traiter un timeout comme un échec vous envoie dans la mauvaise direction.

---

### 28. Analyser les skills installées avec clawdefender

```bash
clawdefender scan --all
```

Après ClawHavoc, c'

---

Si une compétence échoue, désinstallez-la et trouvez une alternative avec un score de sécurité plus élevé. Il n'y a pas de moyen sûr de « faire partiellement confiance » à une compétence qui essaie d'exfiltrer des informations d'identification.

---

###

---

| Ne pas demander | Demander plutôt |
|---------------|-----------------|
| `calendar:*` | `calendar:read` |
| `email:*` | `email:send` |
| `files:readwrite` | `files:read` |
| `contacts:*`

---

La configuration de ce guide — paramètres de délai d'attente, politiques de nettoyage, routage des modèles, paramètres de sécurité par défaut — est déjà intégrée à TinyClaw. Si vous préférez sauter la configuration et lancer une instance prête pour la production en moins d'une minute :

```
tinyclaw.dev → choisissez un modèle → choisissez un

---

## Passez Tout Ceci : TinyClaw {#tinyclaw}

La configuration manuelle d'OpenClaw, si vous connaissez les étapes, prend environ une heure :

| Étape | Temps |
|------|------|
| Provisionner un serveur | 15 min |
| Configurer les clés SSH | 10 min |
| Installer Node.js | 5 min |
| Installer et configurer OpenClaw | 17 min |
| Se connecter à un fournisseur d'IA | 10 min |
| **Total** | **~60 min** |

Si vous n'avez pas de profil technique, multipliez par 10 — vous devez apprendre chaque étape avant de la réaliser.

---

TinyClaw ignore complètement cette étape. Les serveurs sont pré-provisionnés, l'environnement est déjà configuré. Vous choisissez trois choses :

**Modèle :** Claude Opus 4.6, GPT-5.2, ou Gemini 3.1 Pro

**Canal :

---

- Lire et résumer les e-mails, rédiger des brouillons de réponses
- Rappels de réunion et détection de conflits d'horaire
- Suivre les dépenses à partir des reçus
- Rechercher des concurrents, filtrer des prospects
- Résumés de stand-up, suivi des OKR
- Rédiger des contrats, des descriptions de poste, des publications pour les réseaux sociaux
- Comparaison de prix, recherche de coupons

Et tout ce que vous pouvez décrire en une phrase. Les places sur le serveur sont limitées — vérifiez la disponibilité sur [tinyclaw.dev](https://tinyclaw.dev).

---

---

## Référence rapide

| Chapitre | Conseils | À lire quand |
|---------|------|-----------|
| Configuration | 01–08 | Avant de toucher à la configuration |
| Compétences | 09–14 | Avant d'installer quoi que ce soit |
| Sous-agents | 15–20 | Avant de créer des flux de travail multi-agents |
| Coût | 21–25 | Après votre première charge de travail réelle |
| Débogage et sécurité | 26–30 | En cas de problème |

---

---

## Ressources

- [docs.openclaw.ai](https://docs.openclaw.ai) — documentation officielle
- [clawhub.ai](https://clawhub.ai) — compétences sélectionnées, auditées pour la sécurité
- [agentskills.io](https://agentskills.io) — catalogue plus large, longue traîne
- [tinyclaw.dev](https://tinyclaw.dev) — déploiement en un clic
- [agentputer.com](https://agentputer.com) — hébergement cloud 24/7

---

---

*Sources : Documentation OpenClaw (docs.openclaw.ai) · Données de sécurité de ClawHub (février 2026) · Documentation des modèles Anthropic (docs.anthropic.com) · Documentation de context7 (context7.com)*