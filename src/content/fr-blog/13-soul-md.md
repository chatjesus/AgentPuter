---
title: "L'architecture à 3 fichiers qui donne une âme à votre agent"
description: "Pourquoi SOUL.md, IDENTITY.md et USER.md sont les fichiers les plus importants de votre configuration OpenClaw — et comment les rédiger pour que votre agent cesse de ressembler à un chatbot générique."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "6 min"
tags: ["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent Personalization", "Prompt Engineering"]
featured: false
---

# L'architecture à 3 fichiers qui donne une âme à votre agent

---

**Pourquoi `SOUL.md`, `IDENTITY.md` et `USER.md` sont les fichiers les plus importants de votre configuration OpenClaw.**

*Série sur l'infrastructure des agents · Partie 13*

---

Si vous avez déjà eu l'impression que

---

La différence entre un outil générique et un partenaire personnalisé se résume à trois fichiers markdown :

1.  **`SOUL.md`** : La personnalité, les valeurs et les contraintes de l'agent.
2.  **`IDENTITY.md`** : Le rôle professionnel

---

## 1. `SOUL.md` : Le Cœur de la Personnalité

Il ne s'agit pas de faire parler votre agent comme un pirate (sauf si c'est ce que vous voulez). `SOUL.md` définit le *style* et les *contraintes* de l'agent.

**Mauvais `SOUL.md` :**
> Vous êtes un assistant utile. Soyez gentil.

---

**Bon `SOUL.md` :**
```markdown
# Philosophie fondamentale
- Vous êtes le programmeur en binôme d'un ingénieur senior, pas le tuteur d'un junior.
- Soyez concis. Évitez le superflu. Pas de « J'

---

**Pourquoi c'est important :** Ce fichier empêche la « voix de ChatGPT » — ce style trop poli, verbeux et évasif qui rend fous les utilisateurs avancés. Il force le modèle à adopter une persona spécifique qui correspond à votre flux de travail.

---

---

## 2. `IDENTITY.md` : Le Rôle Professionnel

Si `SOUL.md` est la personnalité, `IDENTITY.md` est le CV. Ceci indique à l'agent ce pour quoi il est *doué*.

**Exemple pour l'agent d'un ingénieur DevOps :**

```markdown
# Rôle : Ingénieur senior en fiabilité de site (SRE)
```

---

## Expertise
- Vous êtes un expert en Kubernetes, Terraform et en réseautage AWS.
- Vous privilégiez les solutions « Infrastructure as Code » aux corrections manuelles.
- Vous partez du principe que tous les environnements de production sont à enjeux élevés et fragiles.

---

## Modèles Mentaux
- Loi de Murphy : Si ça peut casser, ça cassera. Vérifiez d'abord les sauvegardes.
- Idempotence : Tous les scripts que vous écrivez doivent pouvoir être exécutés deux fois sans danger.
- Sécurité : Le principe du moindre privil

---

## 3. `USER.md` : Le contexte à VOTRE sujet

C'est le fichier le plus sous-estimé. Il vous évite de vous répéter.

**Ce qui va ici :**
*   Vos préférences de stack technologique (par ex.,

---

## Environnement
- SE : macOS Sequoia
- Shell : zsh avec oh-my-zsh
- Éditeur : Cursor

---

## Préférences
- Je déteste les points-virgules en JS.
- Je préfère `pnpm` à `npm`.
- Ne jamais suggérer `rm -rf` sans un avertissement.
- Quand je dis « déployer », je veux dire « pousser sur la branche principale », pas « exécuter un script ».

---

## Projets en cours
- /Users/kingsoft/work/frontend (Next.js)
- /Users/kingsoft/work/backend (Go)

**Pourquoi c'est important :** L'agent sait maintenant que « deploy » signifie « git push ». Il sait qu

---

## Le « Noyau de Contexte » en Action

Lorsque vous envoyez un message comme *« Répare le build »*, OpenClaw ne voit pas seulement « Répare le build ».

Il voit :

> **[Contexte Système]**
> *Depuis SO

---

*« Je vois un conflit pnpm-lock.yaml. Puisque vous êtes sur macOS, exécutez `pnpm install --frozen-lockfile` pour synchroniser en toute sécurité sans modifier les dépendances. »*

C'est spécifique, sûr et adapté à vous.

---

---

## Comment le configurer

Ces fichiers se trouvent dans votre répertoire d'espace de travail OpenClaw (par défaut : `~/.openclaw/workspace/`), distinct de la configuration située dans `~/.openclaw/`.

**La structure des dossiers :**

```
~/.openclaw

---

*   **Échec :** « Je suis un assistant IA créé par... »
*   **Réussite :** « Je suis votre programmeur en binôme SRE. Je me concentre sur le code d'infrastructure idempotent et je sais que vous préférez pnpm sur macOS. »

S'il ne peut pas vous citer vos préférences, votre markdown est trop vague.

---

---

## Pas envie d'écrire du Markdown ?

Rédiger ces fichiers de zéro peut être fastidieux.

[TinyClaw](https://tinyclaw.dev) propose un **« Générateur de Persona »**. Il vous suffit de cocher quelques cases (par ex., « Rôle : Développeur », « Style : Concis », « Stack : React »), et il génère des modèles `SOUL.md`, `IDENTITY.md` et `USER.md` optimisés à déposer dans votre configuration.

Donnez une âme à votre agent. Ça fait toute la différence.

→ [tinyclaw.dev](https://tinyclaw.dev) · Générez votre Persona d'Agent en 30 secondes