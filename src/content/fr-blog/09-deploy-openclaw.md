---
title: "Quatre façons de déployer OpenClaw : Mac Mini, VPS, Pod Cloud, ou en moins de 60 secondes"
description: "OpenClaw a dépassé les 207 000 étoiles GitHub cette semaine. Voici comment le configurer réellement — du bare metal au cloud en un clic — sans les lacunes que la plupart des tutoriels laissent."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "20 min"
tags: ["OpenClaw", "Deployment", "AI Agent", "Mac Mini", "AgentPuter", "TinyClaw", "Tutorial"]
featured: true
---

*Partie 9 de la série sur l'infrastructure des agents*

---

OpenClaw est le projet d'IA open-source à la croissance la plus rapide sur GitHub en ce moment : 207 000 étoiles, 38 000 forks, 683 contributeurs, plus de 12 000 commits. Le rédacteur de MacStories, Federico Viticci, a consommé 180 millions de tokens avec son instance « Navi » et l'a qualifié de « la chose qui a changé ma façon d'utiliser l'IA. » Les Mac Mini ont été en rupture de stock dans les Apple Stores de plusieurs villes — en partie parce que les gens voulaient une machine dédiée et toujours allumée pour l'exécuter.

Vous voulez l'essayer. La question est : comment le configurez-vous réellement ?

Les tutoriels existants se divisent en deux catégories : soit ils supposent que vous savez déjà ce qu'est `systemd`, soit ils sautent trois étapes et vous laissent face à une erreur. Ce guide couvre quatre approches — de la construction de votre propre serveur local au déploiement en moins de 60 secondes — afin que vous puissiez choisir celle qui correspond à votre niveau de compétence et à vos priorités.

**Les quatre approches :**

---

| Parcours | Temps | Niveau de compétence | Idéal pour |
|---|---|---|---|
| A. Mac Mini | 15–30 min | Bases du terminal | Confidentialité en priorité, contrôle total |
| B1. VPS autogéré | 15–30 min | SSH + ops Linux | Développeurs, conformité |
| B2. AgentPuter | ~2 min | CLI de base | Multi-agent, zéro DevOps |
| C. TinyClaw | < 1 min | Aucun | Tout le monde |

---

---

## D'abord : Qu'est-ce qu'OpenClaw ? (Version 30 secondes)

OpenClaw n'est pas un autre chatbot que vous consultez dans un navigateur. C'est un **assistant IA personnel qui fonctionne 24h/24 et 7j/7 en arrière-plan** et qui vous parle via les applications de messagerie que vous utilisez déjà — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (via BlueBubbles), Microsoft Teams, WebChat, Matrix, et d'autres. Douze canaux, et la liste s'allonge.

Ce qui le différencie de ChatGPT :

- **Mémoire persistante.** OpenClaw dispose d'un fichier `SOUL.md` qui définit qui il est pour *vous* — votre nom, vos préférences, votre style de travail, votre fuseau horaire. Il se souvient d'une session à l'autre.
- **Actions dans le monde réel.** Il lit vos e-mails, gère votre calendrier, intervient sur vos fichiers, contrôle les appareils domestiques connectés, effectue des recherches et rédige des brouillons de réponses — de manière autonome.
- **Voix et canevas.** Les modes Voice Wake et Talk (propulsés par ElevenLabs) vous permettent de lui parler en mode mains libres. Live Canvas (A2UI) lui fournit un espace de travail visuel.
- **Priorité au local.** Vos données restent sur votre machine. Pas d'entraînement sur vos conversations. Pas de cloud tiers, sauf si vous en choisissez un.

---

**Ce qu'il vous faut pour l'exécuter :**
- Une machine exécutant **Node.js 22+** (macOS, Linux, ou Windows via WSL2)
- Un abonnement à un modèle d'IA : **clé API Anthropic ou OAuth Claude Pro/Max** (fortement recommandé par le créateur du projet), ou OpenAI / Google Gemini
- La recommandation officielle : **Anthropic Pro/Max + Opus 4.6** — meilleures performances sur les contextes longs et la plus forte résistance à l'injection de prompt parmi les modèles pris en charge

---

---

## Voie A : Mac Mini — Le serveur local

**Pour qui :** Vous possédez (ou souhaitez posséder) un Mac Mini. Vous voulez un contrôle 100 % local. La souveraineté des données est importante pour vous. Vous souhaitez une intégration avec iMessage et la fonction Voice Wake.

### Matériel

Un Mac Mini M4 modèle de base (599 $) est plus que suffisant : 16 Go de mémoire unifiée, 256 Go de stockage. Il consomme 5 à 10 W au repos — soit environ 15 $ par an en électricité. Il est silencieux, toujours allumé, et prend en charge nativement iMessage via BlueBubbles, ce qu'aucun déploiement cloud ne peut égaler.

Si vous achetez un modèle reconditionné, un M2 avec 16 Go fonctionne aussi très bien. Évitez les modèles avec 8 Go — OpenClaw ainsi que la fenêtre de contexte du modèle utiliseront le swap en cas de forte sollicitation, et l'utilisation du swap sur un SSD réduit la durée de vie du disque.

### Prérequis

Avant de commencer, assurez-vous d'avoir :

- [x] macOS 13 (Ventura) ou une version plus récente
- [x] Homebrew installé (`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)
- [x] Node.js 22+ (`brew install node@22`, puis vérifiez avec `node --version`)
- [x] Une clé API Anthropic, ou un abonnement Claude Pro (20 $/mois) / Max (100 $/mois) pour la connexion OAuth
- [x] Un compte Telegram (le canal le plus simple pour commencer)

### Installation étape par étape

**Étape 1 : Installer OpenClaw globalement**

```bash
npm install -g openclaw@latest
```

Vous pouvez aussi utiliser pnpm (`pnpm add -g openclaw@latest`) ou bun. Les trois sont officiellement pris en charge.

Vous devriez voir une sortie se terminant par quelque chose comme :

---

1 paquet ajouté en 12s
```

Vérifiez l'installation :

```bash
openclaw --version
```

Sortie attendue : `2026.2.17` (ou le numéro de la dernière version).

**Étape 2 : Exécuter l'assistant d'intégration**

```bash
openclaw onboard --install-daemon
```

L'assistant vous guide à travers toutes les étapes de manière interactive :

1. **Choisissez votre modèle.** Sélectionnez Anthropic Claude (recommandé). Si vous avez un abonnement Claude Pro/Max, choisissez la connexion OAuth — aucune gestion de clé API n'est nécessaire.
2. **Saisissez votre clé API ou authentifiez-vous via OAuth.**
3. **Choisissez un canal de messagerie.** Telegram est le plus simple pour commencer. L'assistant vous indiquera d'envoyer un message à @BotFather sur Telegram, de créer un nouveau bot avec `/newbot`, et de coller le jeton en retour.
4. **Installez le démon d'arrière-plan.** Sur macOS, cela crée un service `launchd` pour que OpenClaw survive aux redémarrages et s'exécute même lorsque le terminal est fermé.

L'ensemble du processus prend environ 5 minutes.

**Étape 3 : Vérifier l'installation**

```bash
openclaw doctor
```

C'est l'outil de diagnostic officiel. Il vérifie la version de votre Node.js, la connectivité de la passerelle (Gateway), la configuration du canal, l'accès au modèle et l'état du démon. Chaque vérification devrait afficher une coche verte. Si quelque chose est jaune ou rouge, l'outil de diagnostic vous indiquera exactement ce qu'il faut corriger.

**Étape 4 : Associer votre premier appareil**

---

Ouvrez Telegram et envoyez n'importe quel message à votre nouveau bot. Le bot répondra avec un **code de jumelage** — c'est le mécanisme de sécurité par défaut d'OpenClaw. Les expéditeurs inconnus reçoivent un code ; ils ne peuvent pas interagir avec votre assistant tant que vous ne les avez pas approuvés.

```bash
openclaw pairing approve telegram <CODE>
```

C'est tout. Votre bot est maintenant actif. Envoyez-lui « Que sais-tu faire ? » et regardez-le répondre.

> **Dépannage :** Si le bot ne répond pas, exécutez d'abord `openclaw doctor`. Problèmes courants : le démon n'a pas démarré (exécutez à nouveau `openclaw onboard --install-daemon`), ou le jeton Telegram contient une faute de frappe (vérifiez `~/.openclaw/openclaw.json`).

### Après l'installation

Trois choses à faire immédiatement :

1. **Rédigez votre SOUL.md.** Ouvrez `~/.openclaw/workspace/SOUL.md` dans n'importe quel éditeur de texte. Indiquez-lui votre nom, ce que vous faites, vos préférences de communication, votre fuseau horaire. Ce n'est pas une invite — c'est un fichier d'identité qui persiste à travers chaque conversation.

2. **Connectez vos outils.** Gmail (via Pub/Sub), Google Calendar, Notion, Todoist, Slack — OpenClaw se connecte via les outils MCP et les Compétences. L'assistant de configuration vous a peut-être déjà demandé certains d'entre eux.

3. **Exécutez une vraie tâche.** Ne commencez pas par « raconte-moi une blague ». Essayez : « Résume mes e-mails non lus et classe-les par priorité » ou « Qu'y a-t-il à mon agenda demain et ai-je des conflits ? »

### Coûts réels

---

| Article | Coût |
|---|---|
| Matériel | 599 $ en une seule fois (Mac Mini M4 de base) |
| API (utilisation modérée) | 15–50 $/mois (ou 20 $/mois avec un abonnement Claude Pro) |
| API (utilisation intensive) | 100–300 $/mois (niveau Viticci) |
| Électricité | ~15 $/an |
| Temps d'installation | 15–30 minutes |

---

---

## Parcours B : Déploiement Cloud — Autogéré ou AgentPuter

**Pour qui :** Vous n'avez pas de Mac. Vous utilisez Linux ou Windows. Vous voulez accéder à votre assistant de n'importe où. Vous avez besoin d'une disponibilité réelle 24h/24 et 7j/7, pas d'un mode « mon ordinateur portable est allumé ».

Il existe deux approches pour le déploiement cloud : **gérer votre propre serveur** (contrôle total, responsabilité totale) ou **utiliser AgentPuter** (un environnement d'exécution cloud conçu spécifiquement pour les agents IA, sans DevOps). Nous aborderons les deux.

---

### B1 : VPS Autogéré

**Pour qui :** Vous connaissez SSH. Vous voulez un accès root. Votre entreprise exige une infrastructure auto-hébergée. Vous optimisez les coûts.

#### Choisir un serveur

| Fournisseur | Configuration minimale | Coût mensuel |
|-------------|------------------------|--------------|
| Hetzner | 2 vCPU, 4 Go de RAM, 20 Go SSD | ~5 $/mois |
| DigitalOcean | 2 vCPU, 4 Go de RAM, 25 Go SSD | ~12 $/mois |
| Vultr | 2 vCPU, 4 Go de RAM, 25 Go SSD | ~12 $/mois |

> **Avertissement :** Ne descendez pas en dessous de 4 Go de RAM. Avec Docker, 2 Go entraîneront un OOM-kill du processus. Faites-moi confiance sur ce point.

OS : Ubuntu 22.04 LTS.

**Utilisateurs de Windows :** Vous n'avez pas besoin d'un VPS. OpenClaw supporte officiellement Windows via WSL2, et le README le marque comme « fortement recommandé ». Installez WSL2, puis suivez les mêmes instructions pour Linux ci-dessous.

#### Option A : Installation directe (Recommandée pour les débutants)

```bash
ssh root@votre-ip-serveur
```

---

# Installer Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer OpenClaw
npm install -g openclaw@latest

# Lancer l'assistant
openclaw onboard --install-daemon
```

Sur Linux, le démon s'installe en tant que service utilisateur `systemd` au lieu de `launchd`. Tout le reste est identique au chemin du Mac Mini — l'assistant s'en charge.

Vérifier :

```bash
openclaw doctor
```

#### Option B : Docker Compose (Niveau Production)

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

Avantages :
- Isolation des processus — OpenClaw s'exécute dans son propre conteneur
- Redémarrage en une seule commande : `docker compose restart`
- Gestion des journaux intégrée
- Mode bac à sable (sandbox) : définissez `sandbox.mode: "non-main"` pour exécuter les sessions de groupe/canal dans des conteneurs Docker isolés

Inconvénients :
- Nécessite Docker Engine 24+
- Une couche d'abstraction supplémentaire à déboguer

Le tableau de bord de la passerelle (Gateway) est disponible à l'adresse `http://localhost:18789` — mais uniquement localement, ce qui nous amène à la partie la plus importante.

#### Accès à distance : Faites-le correctement

> **Ceci n'est pas optionnel.** La CVE-2026-25253 a démontré que l'exposition directe du port de la passerelle (Gateway) à internet permet l'exfiltration de jetons menant à l'exécution de code à distance. Ne le faites pas.

**Recommandé : Tailscale Serve/Funnel**

Tailscale vous offre une surcouche de réseau privé. OpenClaw dispose d'un support de premier ordre :

---

{
  "gateway": {
    "tailscale": {
      "mode": "serve"
    }
  }
}
```

- `"serve"` — accessible uniquement au sein de votre réseau Tailscale (le plus sécurisé)
- `"funnel"` — HTTPS public, mais nécessite une authentification par mot de passe (`gateway.auth.mode: "password"`)

**Alternative : tunnel SSH**

```bash
ssh -L 18789:localhost:18789 utilisateur@ip-de-votre-serveur
```

Ensuite, accédez au tableau de bord à l'adresse `http://localhost:18789` sur votre machine locale.

#### Sauvegarde

L'intégralité de l'état d'OpenClaw se trouve dans `~/.openclaw/` :

| Chemin | Contenu |
|------|----------|
| `openclaw.json` | Configuration principale |
| `workspace/` | SOUL.md, AGENTS.md, TOOLS.md, skills/ |
| `credentials/` | Identifiants des canaux (session WhatsApp, jeton Telegram, etc.) |

Sauvegardez ce répertoire quotidiennement. Une simple tâche cron fait l'affaire :

```bash
tar czf ~/openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/
```

#### Les inconvénients de l'autogestion

J'utilise OpenClaw sur un VPS autogéré depuis trois mois. Voici ce que j'ai appris :

---

- Vous devez installer Node.js, configurer systemd, mettre en place Tailscale et gérer le TLS vous-même.
- Les jetons OAuth expirent. Si vous dormez dans un fuseau horaire différent, votre connexion WhatsApp se coupe à 3 heures du matin et votre agent devient silencieux jusqu'à ce que vous vous réveilliez et vous ré-authentifiiez.
- Après un redémarrage du serveur (mise à jour du noyau, maintenance du fournisseur), OpenClaw ne redémarre pas toujours correctement. Vous apprenez à écrire des scripts de récupération.
- L'exécution de plusieurs agents nécessite une isolation manuelle des processus et une allocation des ressources.

**En une phrase : un VPS auto-géré vous offre une liberté maximale, mais vous êtes aussi votre propre équipe DevOps.**

Si ce dernier paragraphe vous a fatigué, il existe une autre solution.

---

### B2 : AgentPuter — Un environnement d'exécution cloud conçu pour les agents IA

**À qui cela s'adresse :** Vous voulez un déploiement cloud sans le DevOps. Vous avez besoin d'un support multi-agent. Vous attachez de l'importance à une fiabilité 24/7 avec des garanties de SLA.

#### Qu'est-ce que AgentPuter ?

[AgentPuter](https://www.agentputer.com/) n'est pas un VPS générique. C'est un **environnement d'exécution cloud dédié, conçu spécifiquement pour les agents IA** — OpenClaw, ClawBot, MoltBot, et les agents personnalisés. Considérez-le comme un « Heroku pour les assistants IA » : vous ne gérez ni le serveur, ni le conteneur, ni le démon. Vous obtenez un Pod qui ne s'arrête jamais.

Il résout les quatre points de friction des VPS auto-gérés :

---

| Problèmes avec un VPS autogéré | Solution d'AgentPuter |
|--------------------------|-------------------------|
| Redémarrages du serveur = agent hors ligne | Le Pod fonctionne 24h/24 et 7j/7 avec récupération automatique et SLA de disponibilité |
| Expiration des jetons OAuth = reconnexion manuelle | Gestion des jetons côté serveur avec actualisation automatique |
| Les agents consomment le CPU/la mémoire locale | Ressources isolées dans le cloud ; votre machine locale n'est pas affectée |
| Accès uniquement depuis le même réseau | Contrôlez vos agents depuis n'importe quel appareil, n'importe où |

#### Déploiement en trois étapes

```bash
# Étape 1 : Créez votre Pod
agentputer create openclaw
# → Alloue un environnement cloud, choisissez votre configuration

# Étape 2 : Connectez vos services
agentputer connect
# → Autorisez Google, Notion, Slack, etc. Identifiants stockés de manière sécurisée dans le pod

# Étape 3 : Déployez OpenClaw
agentputer deploy openclaw
# → Votre agent commence à travailler 24h/24 et 7j/7. WhatsApp, Telegram, Discord — tous les canaux sont actifs
```

Temps total : environ 2 minutes.

#### Pourquoi AgentPuter se démarque

---

- **Exécution parallèle multi-agent.** Exécutez ClawBot (assistant personnel) + MoltBot (calendrier/planification) + un agent de recherche personnalisé dans le même Pod, chacun avec des ressources isolées.
- **Authentification qui n'expire jamais.** Les jetons OAuth sont maintenus côté serveur avec un rafraîchissement automatique. Votre connexion WhatsApp ne s'interrompra pas à 3 heures du matin parce qu'un jeton a expiré.
- **Accès depuis n'importe où.** Téléphone, tablette, un autre ordinateur — votre IA vous suit, et non l'inverse.
- **Statut actuel :** Accès anticipé. Demandez un code d'invitation sur [agentputer.com](https://www.agentputer.com/) — les codes sont envoyés sous 24 heures.

#### AgentPuter vs. VPS autogéré

| | VPS autogéré | AgentPuter |
|--|-----------------|------------|
| Temps de déploiement | 15–30 minutes | ~2 minutes |
| Opérations | Vous gérez systemd, Tailscale, la sauvegarde, TLS | Zéro opération — le Pod est maintenu automatiquement |
| Multi-agent | Isolation manuelle | Support natif du parallélisme |
| Gestion de l'authentification | Gestion manuelle de l'expiration des jetons | Rafraîchissement automatique |
| Coût mensuel | VPS 5–24 $ + frais d'API | Abonnement Pod + frais d'API |
| Contrôle | Accès root à 100 % | Limité à l'environnement du Pod |
| Idéal pour | Compétences solides en opérations / conformité | Recherche de simplicité / utilisateurs multi-agent |

---

---

## Parcours C : TinyClaw — 60 secondes, Zéro terminal

**À qui s'adresse ce parcours :** Vous ne voulez pas apprendre les outils en ligne de commande. Vous ne voulez pas gérer de serveurs. Vous voulez simplement *utiliser* un assistant IA, pas en *installer* un. Vous voulez l'essayer tout de suite.

### Pourquoi ce parcours existe

Le parcours A nécessite 599 $ et de savoir ce qu'est Node.js. Le parcours B (autogéré) nécessite SSH, Docker et Tailscale. Même AgentPuter, bien que beaucoup plus simple, implique toujours une CLI et un code d'invitation.

La plupart des gens voient `npm install -g` et ferment l'onglet.

Les 207 000 étoiles d'OpenClaw prouvent que la demande est réelle. Le goulot d'étranglement n'est pas le produit — c'est la barrière du déploiement. TinyClaw l'élimine.

### Qu'est-ce que TinyClaw ?

[TinyClaw](https://tinyclaw.dev) est le produit grand public développé par l'équipe d'[AgentPuter](https://www.agentputer.com/). Si AgentPuter est « le cloud d'agents IA pour les développeurs », TinyClaw est « le point d'entrée des agents IA pour tout le monde ».

**Trois étapes pour être opérationnel :**

1. **Choisissez votre modèle** — Claude Opus 4.6, GPT-5.2 ou Gemini 3
2. **Choisissez votre canal** — Telegram (Discord et WhatsApp bientôt disponibles)
3. **Connectez-vous avec Google** → déploiement terminé

Pas de serveur. Pas de SSH. Pas de Node.js. Pas de terminal. L'infrastructure est préconfigurée et n'attend que de vous être attribuée.

**Du clic à la première conversation avec votre assistant IA : moins de 60 secondes.**

### Ce que vous pouvez en faire

Une fois déployé, votre OpenClaw hébergé sur TinyClaw peut :

---

- Lire, résumer et rédiger des réponses à vos e-mails
- Gérer votre calendrier, définir des rappels, résoudre les conflits d'horaire
- Résumer des documents, rédiger des contrats, générer des factures
- Suivre les dépenses, comparer les prix, aider à la préparation des déclarations de revenus
- Mener des recherches concurrentielles, rédiger des publications pour les réseaux sociaux, suivre les OKR
- Surveiller les flux d'actualités, réserver des voyages
- Apprendre de nouvelles capacités par le langage naturel — dites-lui simplement ce dont vous avez besoin

### La Comparaison Ultime

| | Mac Mini | VPS autogéré | AgentPuter | TinyClaw |
|--|---------|-----------------|------------|----------|
| Temps de déploiement | 15–30 min | 15–30 min | ~2 min | < 1 min |
| Compétence technique | Terminal | SSH + ops | CLI de base | Aucune (GUI uniquement) |
| Coût du matériel | 599 $ | 0 $ | 0 $ | 0 $ |
| Coût mensuel | API uniquement | VPS + API | Pod + API | Hébergement + API |
| Emplacement des données | 100 % local | Votre VPS | Cloud AgentPuter | Cloud TinyClaw |
| Fiabilité 24/7 | Dépend de votre Mac | Dépend de vos ops | Garanti par SLA | Garanti par SLA |
| Multi-agent | Configuration manuelle | Isolation manuelle | Parallèle natif | Agent unique |
| Gestion de l'authentification | Manuelle | Manuelle | Actualisation auto. | Automatique |
| iMessage | Oui (BlueBubbles) | Non | Non | Non |
| Réveil vocal | Oui (app macOS) | Non | Non | Non |
| Windows | Non | Oui (WSL2) | Oui (CLI) | Oui (navigateur) |
| Idéal pour | Confidentialité / utilisateurs avancés | DevOps / conformité | Développeurs / multi-agent | Tout le monde |

---

---

## Après la configuration : 7 étapes pour transformer votre OpenClaw de jouet en employé

Quelle que soit la voie que vous avez choisie, l'installation n'est que le début. Voici comment le rendre réellement utile :

### 1. Rédigez votre SOUL.md

Emplacement : `~/.openclaw/workspace/SOUL.md`

Ce n'est pas une invite système. C'est un fichier d'identité. Indiquez-lui :
- Votre nom, votre poste et ce que vous faites
- Votre style de communication (formel ? décontracté ? des listes à puces ?)
- Votre fuseau horaire et vos heures de travail
- Vos préférences (« Je préfère le Markdown », « Ne jamais planifier de réunions avant 10h »)

Plus vous êtes précis, moins vous aurez besoin de vous répéter.

### 2. Exécutez `openclaw doctor`

Faites-le après la configuration, après chaque mise à niveau, et chaque fois que quelque chose semble anormal. Il vérifie tout — version de Node, santé de la passerelle, connectivité des canaux, accès au modèle, statut du démon — et vous indique exactement ce qu'il faut corriger.

### 3. Apprenez les commandes de chat

Celles-ci fonctionnent dans n'importe quel canal connecté — Telegram, WhatsApp, Slack, Discord :

| Commande | Ce qu'elle fait |
|---------|-------------|
| `/status` | Affiche le modèle actuel, l'utilisation des jetons, les informations de session |
| `/new` ou `/reset` | Réinitialise la session de conversation |
| `/compact` | Compresse le contexte pour économiser des jetons |
| `/think high` | Active le mode de réflexion approfondie (Opus 4.6) |
| `/verbose on` | Réponses plus détaillées |
| `/usage full` | Affiche la consommation de jetons après chaque réponse |

---

Ce sont vos contrôles quotidiens. La commande `/compact` seule peut vous faire économiser de 30 à 40 % sur les coûts des jetons dans les longues conversations.

### 4. Connectez vos outils

OpenClaw utilise les outils MCP (Model Context Protocol) et les Skills pour s'intégrer aux services externes :

- **Gmail** — via Pub/Sub pour des notifications d'e-mails en temps réel
- **Google Calendar** — lire, créer et modifier des événements
- **Notion / Todoist / Linear** — gestion de tâches
- **Slack** — à la fois comme canal et comme outil
- **Navigateur** — OpenClaw peut contrôler une instance Chrome dédiée

### 5. Implantez des graines de mémoire

Donnez-lui un contexte initial dont il se souviendra pour toujours :

> « J'ai une réunion d'équipe tous les lundis à 10h. Le nom de ma responsable est Sarah. Je préfère les réponses en Markdown. Je travaille sur le lancement du T1 pour le Projet Atlas. »

Ces faits persistent en mémoire et éclairent chaque interaction future.

### 6. Exécutez un flux de travail réel

Ne le testez pas avec des futilités. Donnez-lui du travail :

- « Résume mes e-mails non lus et trie-les par priorité »
- « Qu'y a-t-il sur mon calendrier cette semaine ? Signale les conflits »
- « Recherche les 5 principaux concurrents pour [produit] et donne-moi un tableau comparatif »
- « Rédige une réponse à l'e-mail de [personne] — ton professionnel, accepte la réunion mais suggère plutôt jeudi »

### 7. Installez les Skills de la communauté

---

Activez **ClawHub** dans votre configuration et votre agent pourra automatiquement rechercher et installer de nouvelles Compétences au besoin. Vous pouvez également parcourir manuellement sur [SkillsMP](https://skillsmp.com) — la place de marché propose des milliers de Compétences contribuées par la communauté pour tout, de l'intégration Jira au suivi du prix des vols.

---

---

## FAQ

**Combien coûte l'API ?**
Utilisation légère : ~15 $/mois. Modérée : 30–50 $/mois. Intensive (niveau Viticci) : 100–300 $/mois. Alternativement, un abonnement Claude Pro (20 $/mois) ou Max (100 $/mois) vous permet de vous authentifier via OAuth sans avoir à gérer les clés d'API séparément.

**Quel est le meilleur modèle ?**
Le créateur du projet recommande vivement **Claude Opus 4.6** — il offre les meilleures performances sur les contextes longs et la plus forte résistance à l'injection de prompt. GPT-5.2 et Gemini 3 sont également pris en charge. Choisissez celui pour lequel vous avez déjà un abonnement.

**Est-ce sécurisé ?**
Par défaut, OpenClaw utilise l'**appairage par MP** — tout expéditeur inconnu reçoit un code d'appairage et ne peut pas interagir avec votre assistant tant que vous ne l'avez pas approuvé avec `openclaw pairing approve`. Les déploiements locaux conservent toutes les données sur votre machine. Pour l'accès à distance, utilisez Tailscale — n'exposez jamais le port de la passerelle (18789) directement à Internet.

**Prend-il en charge le chinois ?**
Oui. Les modèles sous-jacents prennent en charge le chinois nativement. Il existe un site de documentation communautaire sur clawd.org.cn, et il fonctionne avec des modèles nationaux comme DeepSeek, Moonshot Kimi et Qwen.

**Fonctionne-t-il sur Windows ?**
Oui, via WSL2 (Windows Subsystem for Linux) — officiellement pris en charge et vivement recommandé. Ou utilisez TinyClaw pour une expérience basée sur le navigateur sans aucune configuration locale.

---

**En quoi est-ce différent de ChatGPT Plus ?**
ChatGPT attend que vous veniez à lui. OpenClaw vient à vous — via WhatsApp, Telegram, Slack, où que vous soyez. ChatGPT n'a pas de mémoire persistante entre les sessions ; OpenClaw, si. ChatGPT ne peut pas agir sur vos fichiers ou vos e-mails ; OpenClaw, si. ChatGPT ne prend pas en charge Voice Wake ou Live Canvas ; OpenClaw, si.

**Un problème est survenu. Que faire ?**
Exécutez `openclaw doctor`. Il effectue un auto-diagnostic et fournit des instructions de réparation ciblées. Le Discord de la communauté compte plus de 5 000 membres actifs qui peuvent aider avec les cas particuliers.

**Comment mettre à jour ?**
```bash
openclaw update --channel stable
```
Il existe aussi les canaux `beta` et `dev` si vous voulez des fonctionnalités de pointe.

---

---

## Conclusion

Quatre chemins, une destination : votre propre assistant IA 24/7.

- **Mac Mini** si vous êtes un utilisateur expérimenté qui veut un contrôle total, le réveil vocal et iMessage.
- **VPS autogéré** si vous êtes un développeur qui veut un accès root et une flexibilité maximale.
- **[AgentPuter](https://www.agentputer.com/)** si vous voulez la fiabilité du cloud, le support multi-agent et zéro DevOps.
- **[TinyClaw](https://tinyclaw.dev)** si vous voulez simplement que ça fonctionne — 60 secondes, sans terminal.

Ces chemins ne s'excluent pas mutuellement. Vous pouvez commencer avec TinyClaw pour faire l'expérience d'OpenClaw en moins d'une minute, passer à AgentPuter quand vous voulez exécuter plusieurs agents, et finalement construire une configuration entièrement souveraine sur un Mac Mini quand vous serez prêt pour un contrôle total.

Ceci est la partie 9 de notre série sur l'infrastructure des agents. Nous avons abordé [pourquoi votre agent a besoin de son propre ordinateur](/blog/agent-needs-its-own-computer/), l'[architecture](/blog/dissecting-openclaw-architecture/) d'OpenClaw, l'[écosystème de compétences](/blog/agent-skills-ecosystem/), les [flux de travail d'entreprise](/blog/vibe-working-when-agents-work/), l'[analyse approfondie de ClawdBot](/blog/deep-dive-clawdbot-breakout-agent/), les [modèles économiques](/blog/who-makes-money-from-openclaw/), et [ce que cela signifie lorsque son créateur rejoint OpenAI](/blog/openclaw-creator-joins-openai/). Aujourd'hui, c'était le chapitre « faites-le vous-même ».

---

Si votre déploiement a réussi, dites-le-nous dans les commentaires ou sur Discord : **quel nom avez-vous donné à votre agent, et quelle a été la première tâche réelle que vous lui avez confiée ?**

---

*Références :*
- [Dépôt GitHub OpenClaw](https://github.com/openclaw/openclaw) (207K étoiles, v2026.2.17)
- [AgentPuter — L'environnement d'exécution cloud 24/7 de votre agent IA](https://www.agentputer.com/)
- [TinyClaw — Déploiement d'OpenClaw en un clic](https://tinyclaw.dev)
- [Documentation officielle d'OpenClaw](https://docs.openclaw.ai)
- CVE-2026-25253 — Exfiltration de jeton de la passerelle OpenClaw (référencé dans notre analyse de sécurité)