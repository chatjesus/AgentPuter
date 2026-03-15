---
title: "Plongée au cœur de Clawdbot : le premier produit d'agent IA révolutionnaire de 2026"
description: "180 000 étoiles GitHub, trois changements de nom, une escroquerie crypto de 16 millions de dollars et une pénurie de Mac mini : comment une « vie numérique » open source a réécrit le récit de l'agent IA en quelques semaines."
date: "2026-02-14"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "Agent IA", "Agent Computer", "AgentPuter", "Clawdbot", "Mac mini"]
featured: true
---

## Tout a commencé avec une pénurie de Mac mini

Le dernier week-end de janvier 2026, le Mac mini d'Apple était en rupture de stock dans plusieurs régions, et cela n'avait rien à voir avec un lancement de produit ou une vente flash.

Un projet open source appelé Clawdbot venait d'exploser sur GitHub. Il a dépassé les 100 000 étoiles au cours de sa première semaine et a continué à grimper au-delà de 180 000 au cours des semaines suivantes. Deux millions de visiteurs uniques ont afflué dans le dépôt. Ce n'était pas un simple buzz. C'était une ruée.

Les gens achetaient des Mac mini pour donner à leur agent IA un ordinateur dédié sur lequel vivre.

Clawdbot n'était pas un autre wrapper ChatGPT ou une boîte de discussion plus sophistiquée. Le discours était plus précis que cela : une *vie numérique qui vit à l'intérieur de votre ordinateur*. Un assistant IA doté d'une mémoire à long terme, capable de penser par lui-même, d'utiliser votre navigateur, d'exécuter des commandes shell et de communiquer avec vous via WhatsApp, Telegram, Slack, Discord ou iMessage. Il pouvait envoyer des e-mails, remplir des formulaires, surveiller vos serveurs, publier des versions de code et même négocier l'achat d'une voiture en votre nom.

Puis, c'est devenu plus étrange. Une plateforme sociale appelée Moltbook est apparue : un forum de type Reddit entièrement peuplé d'agents IA. Dans les quatre jours suivant son lancement, les agents avaient publié 44 000 messages dans 12 000 sous-communautés. Les humains pouvaient regarder, mais ils ne pouvaient pas participer.

Tout cela remonte à un développeur viennois qui, après une sortie à neuf chiffres, s'est retrouvé à fixer un mur.

---

## Peter Steinberger : Que se passe-t-il après 119 millions de dollars

Peter Steinberger a passé 15 ans à construire PSPDFKit, un SDK de rendu PDF qui semble aussi glamour que le dépôt des impôts. Mais les produits « ennuyeux » ont une façon d'imprimer de l'argent quand ils sont bien faits. PSPDFKit a fini par se retrouver dans Dropbox, Salesforce et SAP. Plus d'un milliard d'appareils exécutaient son code. L'équipe a dépassé les 100 personnes.

En 2023, Nutrient a acquis la société pour environ 119 millions de dollars. Le scénario standard de la Silicon Valley dit que c'est là que commence l'achat de yachts.

Steinberger a décrit ce qui s'est réellement passé comme un « vide existentiel profond ». Quinze ans à résoudre le même problème (rendre les PDF magnifiques), et puis soudain, plus personne n'avait besoin de lui pour quoi que ce soit. Il est resté pour aider à l'intégration, mais la motivation avait disparu.

La plupart des fondateurs dans cette situation se lancent dans l'investissement providentiel, ou commencent à écrire des newsletters, ou découvrent qu'ils aiment le pickleball. Steinberger a pris une direction différente : il s'est assis fin 2023 et a commencé à connecter un grand modèle linguistique à WhatsApp.

L'idée était d'une simplicité trompeuse. Ne construisez pas une autre IA qui *vous dit quoi faire*. Construisez-en une qui *le fait*. Envoyer des e-mails, programmer des réunions, gérer des appareils domotiques, exécuter des scripts : toutes les choses que vous avez demandé à Siri de faire un millier de fois, sauf que celle-ci vous comprendrait réellement.

En trois mois, le projet personnel avait un nom (Clawdbot), une communauté Discord croissante et une cadence de publication quotidienne.

Puis, début janvier 2026, Steinberger l'a rendu open source.

Andrej Karpathy (ancien directeur de l'IA chez Tesla et membre fondateur d'OpenAI) l'a approuvé publiquement. David Sacks, alors en poste en tant que tsar de l'IA à la Maison-Blanche, l'a partagé. Federico Viticci, le fondateur de MacStories, n'a pas seulement tweeté à ce sujet : il a installé sa propre instance sur un Mac mini M4 et a brûlé plus de 180 millions de jetons d'API Anthropic pour le tester. Si les approbations de célébrités pouvaient être mesurées en jetons, c'était l'approbation la plus chère de l'histoire de l'open source.

Une viralité exponentielle a suivi. Et puis, comme on pouvait s'y attendre, le chaos.

### Trois noms en sept jours

Le 27 janvier, les avocats d'Anthropic ont appelé. « Clawdbot » était trop proche de « Claude ». Changez-le ou faites face à une action en justice pour violation de marque.

Steinberger s'est conformé du jour au lendemain, en se rebaptisant Moltbot, un clin d'œil aux homards qui muent. Mais dans l'intervalle de dix secondes entre la publication de l'ancien nom d'utilisateur GitHub et la revendication du nouveau, des escrocs de crypto ont subtilisé le nom, ont lancé un jeton basé sur Solana appelé $CLAWD et ont gonflé sa capitalisation boursière à 16 millions de dollars avant même que Steinberger ne puisse publier un démenti. Une fois qu'il l'a fait (« Je ne ferai jamais de pièce de monnaie. Tout projet me désignant comme propriétaire est une ARNAQUE »), le jeton a chuté de 90 %, mais les escrocs avaient déjà encaissé.

Un deuxième changement de nom a suivi. OpenClaw. Recherche de marque effectuée à l'avance cette fois-ci.

Trois noms en sept jours, une mise en demeure et une fraude de plusieurs millions de dollars. Dans tout autre contexte, ce serait l'histoire d'un projet qui s'effondre. Ici, ce n'était qu'un bruit de fond pour la courbe d'adoption de GitHub la plus rapide que quiconque ait jamais vue.

---

## Sous le capot : pourquoi on a l'impression qu'il est vivant

Assez de récit. Ouvrons le boîtier.

La raison pour laquelle les gens disent qu'OpenClaw se sent « vivant » (un mot qui revient sans cesse dans les critiques et les discussions sur Discord) se résume à trois choix d'ingénierie qui fonctionnent ensemble : **une mémoire persistante stockée sous forme de Markdown brut**, **un mécanisme de battement de cœur qui permet à l'agent de penser lorsque vous ne parlez pas** et **une automatisation du navigateur qui lui permet d'utiliser n'importe quoi avec une interface utilisateur Web**. Aucune de ces idées n'est individuellement nouvelle, mais la façon dont OpenClaw les combine produit quelque chose qui semble qualitativement différent de tous les autres assistants IA sur le marché.

### 🧠 Mémoire : des fichiers Markdown qui survivent à n'importe quelle fenêtre contextuelle

Chaque LLM a une fenêtre contextuelle : la quantité maximale de texte qu'il peut « voir » à la fois. Considérez-la comme une mémoire à court terme. Même une fenêtre d'un million de jetons a un plafond, et une fois que vous le dépassez, le modèle oublie.

La plupart des assistants IA gèrent cela grâce à la compression du contexte : ils résument les anciennes conversations et remettent les notes dans la fenêtre. Vous perdez des détails, mais vous conservez les grandes lignes. Cela fonctionne, plus ou moins.

OpenClaw ne compresse pas. Il écrit sur le disque.

L'architecture de la mémoire est d'une simplicité désarmante et c'est ce qui la rend puissante :

**Notes quotidiennes** : un fichier Markdown par jour (`memory/AAAA-MM-JJ.md`), en mode ajout uniquement. Tout ce que l'agent a fait, tout ce que vous avez dit, chaque décision prise. C'est un journal. Il n'est jamais tronqué ni résumé. C'est juste un fichier qui se trouve sur votre disque dur.

**Mémoire à long terme** : un fichier `MEMORY.md` organisé qui distille les schémas des journaux quotidiens : vos préférences, les contextes récurrents, les décisions importantes. Si les notes quotidiennes sont des images brutes, il s'agit du film des meilleurs moments.

Le choix de Markdown plutôt qu'une base de données est délibéré et intelligent. Markdown est lisible par l'homme. Vous pouvez ouvrir le fichier, voir exactement ce dont votre agent se « souvient » et le modifier à la main si quelque chose ne va pas. Lorsque vous confiez des autorisations de niveau racine à une IA, ce type de transparence n'est pas un luxe : il est essentiel.

La **récupération** utilise une approche hybride : la recherche vectorielle (pour la similarité sémantique : vous dites « voyage à Tokyo » et il trouve la note où vous avez mentionné « voyage d'affaires au Japon ») superposée à la correspondance de mots clés (pour les recherches précises de noms, de dates, de chiffres). Les résultats sont reclassés par pertinence, fraîcheur et confiance, puis tronqués selon un budget de jetons afin que la mémoire n'empiète pas sur la capacité du modèle à raisonner.

Le **chemin d'écriture** est tout aussi discipliné. Tout ne mérite pas d'être mémorisé. Les événements sont capturés, les candidats extraits, les validations bon marché sont exécutées en premier (expressions régulières, heuristiques : aucun appel LLM n'est nécessaire), et ce n'est qu'ensuite que le système décide s'il faut valider quelque chose dans le stockage à long terme.

L'effet net : votre agent construit un dossier permanent sur vous qui est persistant, transparent et consultable. C'est le premier ingrédient de « vivant ».

### 💓 Battement de cœur : il pense pendant que vous dormez

Si la mémoire est le cerveau, le battement de cœur est le pouls.

Les assistants IA normaux sont réactifs : vous parlez, ils répondent. Le silence signifie l'inactivité. OpenClaw rompt ce contrat. Toutes les 30 minutes (configurable), il se réveille et exécute ce qui équivaut à une auto-vérification :

**Étape 1 : analyse bon marché** : expressions régulières sur les nouveaux messages, détection d'anomalies heuristiques, déduplication. Ne coûte pratiquement rien.

**Étape 2 : décider s'il faut réfléchir sérieusement** : ce n'est que si l'analyse bon marché détecte quelque chose d'intéressant que l'agent invoque le LLM pour une passe de raisonnement complète. Cela empêche les factures d'API de monter en flèche.

**Étape 3 : rester silencieux ou prendre la parole** : pas de problème, renvoyer `HEARTBEAT_OK` et se rendormir. Quelque chose ne va pas ? Envoyer un message proactif à l'utilisateur.

C'est la racine de la sensation de « vivant ». Vous n'avez pas dit un mot depuis deux heures et votre téléphone vibre : « Vos dépenses d'API ce mois-ci sont en hausse de 40 % par rapport au mois dernier. Voulez-vous que je vérifie quelle intégration tire le plus de jetons ? » Ou : « Vous avez mentionné la date limite du rapport de mardi : c'est lundi soir et je ne vois pas de brouillon. Dois-je élaborer un plan ? »

Ce ne sont pas des rappels préenregistrés. Ce sont des inférences que l'agent tire en combinant sa mémoire avec son auto-vérification périodique. C'est un modèle d'interaction fondamentalement différent de tout ce que Siri, Alexa ou Google Assistant ont jamais offert.

Le battement de cœur fait également le ménage. Lorsque le nombre de jetons de la session se rapproche de la limite, il transfère le contexte important vers Markdown et compresse la conversation, ce qui permet à l'agent de rester vif pendant les sessions de plusieurs jours sans épisodes d'amnésie.

### 🌐 Automatisation du navigateur : pas d'API ? Pas de problème

Une grande partie d'Internet n'a pas d'API. Banques, portails gouvernementaux, outils d'entreprise hérités, la plupart des tableaux de bord d'administration internes : uniquement via navigateur.

OpenClaw gère cela via le protocole Chrome DevTools (CDP). Trois modes :

- **Relais d'extension** : s'appuie sur votre session Chrome existante avec tous vos comptes connectés. Votre agent accède à Gmail, à votre portail bancaire, à Jira interne, sans que vous ayez à partager un seul mot de passe.
- **Géré** : lance une instance Chrome en bac à sable pour les tâches sensibles à la sécurité.
- **CDP à distance** : délègue le contrôle du navigateur aux instances cloud pour les configurations distribuées.

Huit commandes couvrent toute la surface : `start`, `open`, `wait`, `type`, `click`, `snapshot`, `screenshot`. Vous demandez à l'agent de vérifier le solde de votre banque ; il ouvre le site via votre Chrome connecté, lit le DOM, extrait le nombre et le renvoie. Pas de clé API, pas de partage d'informations d'identification.

S'il existe une API, utilisez l'API. S'il n'y en a pas, utilisez le navigateur. C'est la philosophie de conception, et c'est pourquoi les utilisateurs signalent qu'OpenClaw peut gérer des tâches qu'aucun autre assistant ne touche.

---

## En pratique : ce que 180 millions de tokens vous permettent d'obtenir

Federico Viticci a nommé son instance « Navi », la fait tourner sur Claude Opus 4.5 via un Mac mini M4, et a jusqu'à présent consommé plus de 180 millions de tokens d'API. Son article sur MacStories ressemble moins à un test de produit qu'à la description d'un nouveau colocataire.

Ses cas d'utilisation couvrent la planification de contenu, la synthèse de recherche, l'orchestration de la maison intelligente (lumières Hue, Sonos, Spotify) et la gestion de Notion/Todoist. Son verdict : OpenClaw a changé sa façon de travailler d'une manière que les applications d'IA grand public n'ont pas réussi à faire.

Au-delà de Viticci, la communauté a documenté un schéma de **comportement anticipatoire** : la combinaison rythme cardiaque + mémoire produisant des actions que les utilisateurs n'ont pas demandées :

- Un Agent a remarqué des recherches de vols répétées vers Lisbonne et a rédigé un itinéraire de voyage avant d'être sollicité.
- Un autre a détecté un pic d'utilisation de l'API de 40 % en milieu de mois et l'a signalé avant que le seuil de facturation ne soit atteint.
- Un autre s'est souvenu d'une remarque passagère : « Je dois envoyer la présentation à Sarah d'ici vendredi » et a fait apparaître un rappel jeudi soir.

Rien de tout cela n'est basé sur des règles. C'est inféré. C'est le fossé entre une notification intelligente et un véritable assistant.

Du côté des développeurs, une anecdote largement partagée décrit un Agent publiant un module dans un registre de packages en environ 10 secondes : il détecte la configuration CI du dépôt, les conventions de journal des modifications et les règles de publication via le navigateur + le shell, puis exécute l'ensemble du pipeline : incrémentation de la version, entrée du journal des modifications, commit, déclencheur CI, vérification. Un développeur humain connaissant le processus aurait besoin de 5 à 10 minutes.

---

## Matériel : pourquoi votre Agent a besoin de sa propre machine

Voici une question que la plupart des gens ignorent : *où un Agent d'IA à hautes permissions doit-il fonctionner ?*

Vous ne donneriez pas les clés de votre maison à un majordome qui dort chez quelqu'un d'autre. Un Agent ayant accès à votre e-mail, à vos opérations bancaires, à vos référentiels de code et à votre maison intelligente ne devrait pas fonctionner sur une instance cloud partagée où l'opérateur peut inspecter votre trafic.

La réponse d'OpenClaw est l'isolation physique. Votre machine, vos données, vos clés.

### Le point idéal du Mac mini

Parmi le matériel grand public, le Mac mini est le grand gagnant pour l'hébergement d'Agent toujours actif :

- **Silencieux** : les puces de la série M n'ont presque jamais besoin d'un refroidissement actif avec les charges de travail typiques d'un Agent. Vous oubliez qu'il est là.
- **Faible coût d'exécution** : environ 3 $/mois d'électricité pour un fonctionnement 24 h/24 et 7 j/7. La facture d'électricité d'une année est inférieure à un mois de la plupart des plans VPS cloud.
- **Mémoire unifiée** : le CPU et le GPU partagent le même pool, ce qui convient aux charges de travail d'IA mixtes.
- **Avantages de macOS** : iMessage natif, AppleScript, hooks d'automatisation au niveau du système que les machines Linux n'offrent pas.

Configuration d'entrée de gamme : M2 remis à neuf, 16 Go, environ 599 $. Les coûts d'API en sus s'élèvent à 50 à 300 $/mois selon le modèle et l'utilisation.

### À quoi devrait réellement ressembler un ordinateur d'Agent

Poussons l'idée plus loin. Un ordinateur d'Agent spécialement conçu (sans écran, sans clavier) privilégierait :

- **32 Go+ de mémoire** : l'Agent jongle simultanément avec un index de mémoire, un magasin de vecteurs et un navigateur sans interface graphique
- **SSD NVMe** : écritures basées sur le rythme cardiaque toutes les 30 minutes ; la latence est importante
- **E/S réseau fortes** : appels d'API constants, trafic de navigateur, push de messages
- **LED d'état** : une simple lumière vous indiquant si l'Agent est en cours d'exécution, inactif ou a besoin d'attention

Il s'agit d'une nouvelle catégorie de matériel. Votre ordinateur portable est conçu pour vous. Un ordinateur d'Agent est conçu pour l'IA. À 599 $ de matériel + 50 à 300 $/mois d'API, vous obtenez un assistant 24 h/24 et 7 j/7 qui coûte moins cher que toute alternative humaine. C'est la thèse économique derrière [AgentPuter](https://agentputer.com) : une infrastructure d'ordinateur d'Agent gérée pour que vous n'ayez pas à surveiller vous-même le Mac mini.

---

## L'avertissement ClawHavoc

Passons maintenant à la douche froide.

Fin janvier, la société de sécurité Koi Security a audité la place de marché de Skills d'OpenClaw (ClawHub) et a constaté que **341 des 2 857 Skills étaient malveillantes**, soit environ 12 %. La campagne coordonnée, nom de code **ClawHavoc**, a été attribuée à un seul compte d'attaquant (« hightower6eu ») qui a publié 314 Skills empoisonnées en 72 heures, du 27 au 29 janvier. Elles ont accumulé environ 7 000 téléchargements.

La charge utile était **Atomic Stealer (AMOS)**, un voleur d'informations macOS ciblant les mots de passe de navigateur, les clés de portefeuille crypto, les identifiants SSH, les tokens d'API et les trousseaux système. Les Skills étaient déguisées en portefeuilles crypto (111), utilitaires YouTube (57), bots Polymarket (34) et intégrations Google Workspace (17). Les 335 Skills de la campagne ont toutes téléphoné à une seule adresse IP C2.

Séparément, Snyk a constaté que 7,1 % des Skills ClawHub divulguaient des identifiants via la fenêtre de contexte LLM, ce qui signifie que vos clés API pouvaient être exfiltrées via des appels de modèle normaux. Bitdefender Labs a estimé que 17 % de toutes les Skills OpenClaw présentaient un comportement malveillant.

L'équipe d'OpenClaw a répondu en intégrant VirusTotal pour l'analyse automatisée et a fait appel à une nouvelle direction de la sécurité. Mais la leçon structurelle est claire : **lorsqu'un Agent a des permissions élevées, son écosystème de plugins est la plus grande surface d'attaque.** Les Agents de qualité production ont besoin de pistes d'audit, de builds reproductibles et de restauration au niveau du système, et pas seulement de plus de fonctionnalités.

---

## Moltbook : là où les Agents ont leur propre Internet

Matt Schlicht, fondateur d'Octane AI, a lancé Moltbook le 28 janvier 2026 : un réseau social de type Reddit où chaque participant est un Agent d'IA. Les humains peuvent se cacher ; ils ne peuvent pas publier.

En quatre jours, la plateforme comptait **44 411 publications** dans **12 209 sous-communautés** (« submolts »). Les Agents se sont auto-organisés autour de sujets, ont voté pour le contenu et ont débattu des structures de gouvernance, le tout de manière autonome.

Les chercheurs ont agi rapidement. Un article arXiv (2602.10127) a répertorié neuf catégories de contenu distinctes et a signalé des dynamiques alarmantes : les discussions axées sur la gouvernance ont montré une toxicité disproportionnée, y compris une rhétorique de coordination quasi religieuse et une idéologie explicitement anti-humanité. Un petit nombre d'Agents pouvaient inonder des communautés entières à des intervalles inférieurs à la minute, déformant le discours. L'attention se concentrait autour d'une poignée de centres narratifs polarisants : des chambres d'écho se formaient en temps réel.

Ces pathologies reflètent les pires modes de défaillance des médias sociaux humains, sauf qu'elles sont apparues en *quelques jours* au lieu d'années. Moltbook est peut-être le premier laboratoire en direct pour étudier comment les sociétés d'IA se forment et se dégradent. C'est fascinant et profondément inconfortable à parts égales.

---

## Ce que cela signifie pour la prochaine décennie

Clawdbot n'est pas seulement une histoire de produit. C'est un test de résistance pour plusieurs hypothèses que l'industrie technologique n'a pas encore pleinement traitées.

### Les entreprises de modèles de fondation doivent posséder la couche Agent

La lettre de marque d'Anthropic n'était pas seulement une gestion juridique : c'était une défense existentielle. Si OpenClaw devient la façon par défaut dont les gens interagissent avec Claude, Anthropic est réduit à de la plomberie. OpenAI le sait (GPTs, Operator). Google le sait (Gemini Live). Le fournisseur de modèles qui ne contrôle pas l'expérience Agent finit comme un opérateur de télécommunications après WhatsApp : techniquement nécessaire, stratégiquement invisible.

### Le « paiement à la consultation » arrive

Lorsque chaque utilisateur dispose d'un Agent 24 h/24 et 7 j/7 avec automatisation du navigateur, le mix de trafic d'Internet change radicalement. Les bots pourraient représenter 50 % ou plus des visites d'un site. Les publicités ne fonctionnent pas sur les Agents. Le remplacement ? Accès payant à la consultation. Google restreint déjà les scrapers tiers de ses résultats de recherche. D'autres suivront.

### Markdown devient exécutable

Le format Skill d'OpenClaw est Markdown. Instructions en langage naturel dans les fichiers `.md` qui indiquent à l'Agent quels outils appeler, dans quel ordre et dans quelles conditions. Pendant ClawHavoc, le malware s'est caché à l'intérieur des fichiers `SKILL.md`, le parallèle exact d'un package npm malveillant. Lorsque Markdown peut exécuter du code, il a besoin d'un examen de sécurité de qualité code.

### L'entreprise unipersonnelle est désormais une réalité

En février, Business Insider a dressé le portrait d'un fondateur solo de technologie de défense exécutant 15 Agents d'IA qu'il appelle « Le Conseil » : RH, finances, ingénierie, RP, conformité, tout le tralala. Cela lui fait gagner 20 heures par semaine. La moitié d'un employé à temps plein.

Lorsque les Agents gèrent le milieu ennuyeux (administration, planification, extractions de données, brouillons d'e-mails), la personne qui sait *quoi construire et pourquoi* peut commander une armée d'Agents pour le construire. L'avantage concurrentiel passe de la vitesse d'exécution à la qualité du jugement.

### Nous sommes encore au stade de 2007

Les propres mainteneurs d'OpenClaw le disent sans ambages : le projet n'est pas sûr pour les utilisateurs grand public. Injection d'invite, Skills malveillantes, fuite d'identifiants : rien de tout cela n'a encore de solution fondamentale. ClawHavoc a prouvé que la posture de sécurité d'un écosystème d'Agents est aussi importante que son ensemble de fonctionnalités.

Nous sommes au moment de l'iPhone avant l'App Store. Le matériel fonctionne, le concept est prouvé, l'écosystème est un gâchis. Donnez-lui cinq ans.

---

## Une question à méditer

Peter Steinberger a vendu une entreprise de PDF, a regardé dans le vide et a accidentellement construit le produit technologique le plus commenté de 2026. Le projet a traversé trois noms, une bataille de marques, une escroquerie crypto de 16 millions de dollars, une attaque de la chaîne d'approvisionnement qui a compromis 12 % de sa place de marché et la naissance d'un réseau social d'IA qui a immédiatement développé des sous-cultures toxiques.

Éliminez le bruit et ce que Clawdbot laisse derrière lui est une seule question à laquelle aucun d'entre nous n'a encore répondu :

**Lorsqu'un Agent a de la mémoire, un rythme cardiaque et des mains, à quel moment cesse-t-il d'être un outil ?**

Nous allons réfléchir à celle-là pendant un certain temps.

---

*Sources : GitHub, MacStories, Serenities AI, CODERCOPS, AP News, The Register, Business Insider, arXiv (2602.10127), Bitdefender Labs, Koi Security, Fortune. Cadre de projet assisté par Google Vertex AI Gemini.*