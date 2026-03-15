---
title: "Nous avons testé 5 façons d'exécuter un agent OpenClaw. Voici ce qui fonctionne vraiment."
description: "207 000 étoiles sur GitHub signifient que tout le monde veut l'essayer. Mais les options de déploiement se sont multipliées plus vite que la documentation. Nous avons passé deux semaines à tester chaque option majeure — de l'auto-hébergement au cloud en un clic — pour que vous sachiez à quoi vous attendre avant de vous engager."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "16 min"
tags: ["OpenClaw", "Review", "AI Agent", "Deployment", "AgentPuter", "TinyClaw"]
featured: true
---

*Partie 10 de la série sur l'infrastructure des agents*

---

OpenClaw a 207 000 étoiles sur GitHub. Ce nombre continue d'augmenter d'environ 2 000 par jour.

Cela signifie que beaucoup de gens sont attentifs. Et chaque semaine, un nouveau service pour « déployer OpenClaw en un clic » apparaît. Il y a EasyClaw — en fait, cinq produits différents portent ce nom. Il y a InstaClaw. Il y a OpenClaw Cloud, la version hébergée officielle. Il existe deux dépôts GitHub complètement différents qui s'appellent tous les deux TinyClaw. Et il y a l'original : l'auto-hébergement sur votre propre matériel, ce pour quoi le projet a été conçu à l'origine.

Le problème n'est pas qu'il y ait trop d'options. C'est que la plupart des critiques ne vous disent pas quelle est la véritable expérience une fois que vous avez dépassé la page d'accueil.

Alors, nous les avons toutes testées. Deux semaines, cinq configurations, des tâches réelles. Voici ce que nous avons découvert.

---

---

## Ce que nous avons testé (et comment)

Cinq configurations :

1. **Mac Mini M4 auto-hébergé** — la configuration de référence
2. **VPS auto-hébergé** — serveur cloud Linux, SSH uniquement
3. **TinyClaw** — l'environnement d'exécution cloud de AgentPuter, déploiement en un clic
4. **OpenClaw Cloud** — la version hébergée officielle, 9,99 $/mois
5. **EasyClaw.ai** — hébergement géré à trois niveaux (5–49 $/mois)

Pour chaque configuration, nous avons mesuré :
- **Temps jusqu'au premier message** (du début jusqu'à la conversation avec votre agent)
- **Fiabilité** sur 7 jours (disponibilité, messages perdus, comportement au redémarrage)
- **Complétude des fonctionnalités** (ce qui fonctionne réellement par rapport à ce qui nécessite une configuration supplémentaire)
- **Performance sur des tâches réelles** (tri des e-mails, gestion de calendrier, recherche web)
- **Coût mensuel** pour une utilisation modérée (~2 heures d'utilisation active par jour)

Le modèle utilisé était Claude Opus 4.6 pour tous les tests, sauf lorsqu'un modèle différent était la seule option. Tous les tests ont utilisé Telegram comme canal principal car c'est le plus stable sur toutes les plateformes.

---

---

## Option 1 : Mac mini M4 auto-hébergé

**Délai avant le premier message :** 22 minutes  
**Disponibilité sur 7 jours :** 100 %  
**Coût mensuel :** ~$35 (API) + 0 $ de matériel amorti

C'est la référence, et elle place la barre très haut.

L'installation se fait avec une seule commande — `openclaw onboard --install-daemon` — et l'assistant vous guide à chaque étape. Le goulot d'étranglement n'est pas le logiciel ; c'est la gestion des clés API et la configuration du bot Telegram, ce qui prend environ 10 minutes si vous ne l'avez jamais fait auparavant.

Une fois opérationnelle, la configuration Mac mini surpasse toutes les options cloud sur quelques points spécifiques. L'intégration d'iMessage via BlueBubbles fonctionne, et rien d'autre ne peut l'égaler. Voice Wake vous permet de parler à votre agent en mode mains libres via l'application macOS native — une fonctionnalité indisponible sur tout déploiement cloud. L'accès au système de fichiers local signifie que votre agent peut travailler avec des fichiers qui ne quittent jamais votre machine.

C'est avec le fichier SOUL.md que l'expérience commence à se différencier de tout le reste. Ce n'est pas une invite système. C'est un fichier d'identité persistant que votre agent lit chaque jour au démarrage. Après une semaine à l'enrichir, l'agent connaissait mon emploi du temps, mon style de communication, mes préférences pour les réponses aux e-mails et les événements de calendrier que je considère comme facultatifs. Cette accumulation de contexte n'existe pas au niveau de la session — elle se cumule.

---

Un inconvénient : l'authentification iMessage via BlueBubbles est fastidieuse et a nécessité une reconnexion toutes les 2 à 3 semaines lors des tests. La commande `openclaw doctor` détecte ce problème avant que vous ne perdiez une journée de messages, mais encore faut-il l'exécuter.

Si vous avez un Mac Mini ou êtes prêt à en acheter un, c'est la solution. Rien d'autre n'arrive à la cheville en termes de fonctionnalités.

---

---

## Option 2 : VPS auto-hébergé (Linux)

**Délai avant le premier message :** 28 minutes  
**Disponibilité sur 7 jours :** 100 %  
**Coût mensuel :** ~$35 (API) + $6 (VPS)

Pour les utilisateurs de Linux et les développeurs qui veulent un accès root, c'est l'équivalent de la configuration Mac Mini, sans Voice Wake et iMessage. L'installation est identique ; la différence est que vous maintenez un serveur plutôt qu'un ordinateur de bureau.

L'avantage est l'accès à distance par conception. Votre agent est joignable que votre ordinateur portable soit ouvert ou non. Tailscale Serve ou Funnel (l'approche officiellement recommandée) sécurise cela sans exposer directement le port de la passerelle.

L'inconvénient est la charge de travail DevOps. Lorsque votre agent cesse de répondre à 2 heures du matin, vous vous connectez en SSH à un serveur pour vérifier les journaux. Si cela ne vous dérange pas, c'est une option solide. Sinon, passez aux options hébergées.

Un point à souligner : le sandboxing Docker — que OpenClaw recommande pour isoler l'accès au shell de l'agent — ajoute une latence notable sur les configurations VPS. Les réponses du chat sont correctes. Les tâches impliquant des opérations sur les fichiers ou la navigation web prenaient 15 à 30 secondes de plus que l'équivalent sur Mac Mini lors des tests. Si l'isolation de sécurité par rapport à l'agent lui-même ne vous préoccupe pas, l'exécution sans Docker est plus rapide.

Même plafond que le Mac Mini, plus de flexibilité, plus de maintenance. Idéal pour les développeurs qui gèrent déjà des serveurs et ne cherchent pas à apprendre quelque chose de nouveau.

---

---

## Option 3 : TinyClaw

**Délai avant le premier message :** 48 secondes  
**Disponibilité sur 7 jours :** ~99,9 %  
**Coût mensuel :** 49,99 $/mois (modèle inclus)

TinyClaw ([tinyclaw.dev](https://tinyclaw.dev)) est l'environnement d'exécution cloud d'AgentPuter pour OpenClaw. Chaque utilisateur obtient un conteneur isolé plutôt qu'une tranche de calcul partagé. En pratique, cela signifie que le temps de réponse de votre agent ne s'effondre pas lorsqu'une centaine d'autres utilisateurs envoient des messages en même temps.

La prise en main a été la plus rapide de toutes celles que nous avons testées — connexion Google, sélection de Telegram, collage d'un jeton de bot, et le premier message est arrivé en 48 secondes. Sur sept jours, il y a eu une fenêtre de maintenance d'environ 4 minutes qui a été communiquée à l'avance.

Les temps de réponse étaient en moyenne de 6 à 8 secondes pour les requêtes standard, et sont restés stables. C'est l'avantage pratique des conteneurs isolés par rapport au calcul partagé : pas plus rapides dans des conditions idéales, mais constants lorsque les conditions ne le sont pas. La connexion Internet de votre Mac Mini à domicile est une variable ; celle d'un conteneur cloud ne l'est pas.

L'installation des Skills était solide. Sur les 12 Skills que nous avons testées depuis ClawHub, 11 se sont installées sans problème. Le seul échec — une intégration Spotify qui nécessite une configuration de redirection OAuth — aurait nécessité une configuration manuelle sur n'importe quelle plateforme.

---

Pas de réveil vocal, pas d'iMessage, pas de système de fichiers local. Il s'agit de limitations structurelles du déploiement cloud, non spécifiques à TinyClaw. Si vous avez besoin de l'une de ces fonctionnalités, l'auto-hébergement est la seule solution.

Le contexte d'AgentPuter est important si vous envisagez d'aller au-delà d'un seul agent. La même infrastructure prend en charge plusieurs instances OpenClaw sous un seul compte — différents agents pour différents contextes, ou un accès partagé entre les membres de l'équipe. Ce n'est pas inclus dans l'offre de base, mais l'option est disponible si vos besoins évoluent.

---

---

## Option 4 : OpenClaw Cloud

**Délai avant le premier message :** 2 minutes 10 secondes  
**Disponibilité sur 7 jours :** ~98,4 %  
**Coût mensuel :** 0 $ (formule gratuite, 14 jours de calcul/mois) ou 9,99 $/mois pour la formule Pro

OpenClaw Cloud (open.claw.cloud) est la version hébergée officiellement recommandée. Le principal différenciateur est la formule gratuite : 14 jours de temps de calcul par mois, propulsée par Kimi K2.5. Notez que lors de nos tests, la formule Pro à 9,99 $/mois était encore indiquée comme « Bientôt disponible » — une partie de cette section est donc basée sur la formule gratuite, qui était la seule réellement disponible.

La formule gratuite est plus qu'une simple démo. Vous disposez de Compétences (Skills) préinstallées, de l'intégration Telegram, d'une mémoire persistante, de l'automatisation du navigateur et de votre propre machine virtuelle dédiée. Lorsque vos 14 jours de calcul gratuits sont épuisés, la VM s'éteint mais vos données restent intactes. Rallumez-la lorsque vous avez plus de temps libre, ou lorsque la formule Pro sera lancée.

Le modèle Kimi K2.5 mérite un commentaire. Pour la plupart des tâches pratiques — résumer des e-mails, rédiger des brouillons de réponses, gérer l'agenda — il s'est bien comporté lors des tests. L'écart avec Claude Opus 4.6 est apparu dans les raisonnements complexes en plusieurs étapes : la demande « rechercher trois concurrents, comparer leurs tarifs et rédiger une recommandation » a donné un résultat nettement plus cohérent avec Claude. Cela dit, pour quiconque exécute des flux de travail légers, le rapport qualité-prix de Kimi K2.5 est difficile à contester.

---

La prise en main est légèrement plus longue qu'avec TinyClaw car la configuration se fait via un tableau de bord web plutôt qu'un assistant. La connexion de Telegram a pris environ 2 minutes. La gestion des compétences est entièrement exposée, ce qui est bien si vous savez ce que vous voulez et déroutant dans le cas contraire.

Le moyen le moins cher d'obtenir une véritable expérience OpenClaw. Le meilleur choix si vous voulez essayer avant de vous engager.

---

---

## Option 5 : EasyClaw.ai

**Délai avant le premier message :** 4 minutes  
**Disponibilité sur 7 jours :** 99,1 %  
**Coût mensuel :** 19–49 $ selon le niveau

La particularité de EasyClaw.ai est l'accès au bureau via un navigateur — une vue complète de l'environnement conteneurisé de votre agent dans un onglet de navigateur. Vous pouvez vous connecter à des comptes qui nécessitent une authentification par navigateur, installer des outils, modifier des fichiers de configuration. Des choses que les plateformes gérées ne vous permettent normalement pas de toucher.

Nous avons utilisé cela pour configurer une intégration Gmail qui nécessite une authentification via un flux de navigateur — une opération simple sur EasyClaw, mais impossible sur les plateformes qui n'en disposent pas.

Les niveaux de tarification sont de 5 $ (développeur, apportez votre propre VPS), 19 $ (géré) et 49 $ (entièrement géré avec un support de niveau supérieur). À 49 $/mois, vous approchez du point où un VPS autogéré devient plus rentable financièrement, à moins que vous ne souhaitiez vraiment une maintenance sans intervention de votre part.

Une remarque sur le nom : le nom « EasyClaw » est utilisé par au moins cinq produits différents de développeurs différents — easyclaw.ai, easyclaw.app, easyclaw.pro, et quelques autres. Celui que nous avons testé est easyclaw.ai. Au moins un des autres services homonymes a soulevé des questions de sécurité au sein de la communauté début février 2026. Vérifiez que vous êtes sur la bonne URL avant de saisir vos identifiants où que ce soit.

---

---

## Le paysage des variantes open-source

Au-delà des services hébergés, il est utile de connaître les dérivés open-source, bien qu'ils s'adressent à un public plus restreint.

**TinyClaw (version jlia0)** est une réimplémentation du concept OpenClaw en environ 400 lignes de script shell — développé avec Claude Code et tmux plutôt qu'avec Node.js et un framework complet. Il exécute plusieurs agents isolés en parallèle sur Discord, WhatsApp et Telegram, en se coordonnant via des files d'attente de messages basées sur des fichiers qui empêchent les conditions de concurrence. Environ 2 000 étoiles GitHub en février 2026, avec une base de code suffisamment petite pour être lue en un après-midi. Si vous voulez comprendre ce qui se passe réellement sous le capot, ou si vous avez besoin d'intégrer un agent dans un environnement restreint, c'est le moyen le plus direct d'y parvenir.

**TinyClaw (version warengonzaga)** est un projet entièrement différent — une réécriture en TypeScript qui se positionne explicitement comme « un produit complètement indépendant et une alternative à OpenClaw ». Il met l'accent sur une architecture de plugins, une mémoire auto-améliorante et un routage intelligent des requêtes pour réduire les coûts des LLM. Moins axé sur l'exécution de tâches, davantage axé sur le concept de « compagnon IA personnel ». À surveiller, mais le projet n'en est qu'à ses débuts.

Aucun des deux ne concurrence directement les services hébergés. Ce sont des outils pour les développeurs qui veulent comprendre et modifier le mécanisme sous-jacent.

---

---

## Tableau Comparatif

| | Mac Mini | VPS | TinyClaw | OpenClaw Cloud | EasyClaw.ai |
|---|---|---|---|---|---|
| **Temps de configuration** | 22 min | 28 min | 48 s | 2 min | 4 min |
| **Coût mensuel** | 35 $ API | 41 $ | 49,99 $ | 0–10 $ | 19–49 $ |
| **Disponibilité sur 7 jours** | 100 % | 100 % | ~99,9 % | ~98,4 % | ~99,1 % |
| **Cohérence des réponses** | Variable (dépendant du FAI) | Élevée | Élevée | Élevée | Élevée |
| **iMessage** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Réveil vocal** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Souveraineté des données** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **Compatibilité des compétences** | 100 % | 100 % | ~92 % | 100 % | ~90 % |
| **Idéal pour** | Utilisateurs avancés | Développeurs | Utilisateurs privilégiant le cloud | Budget / offre gratuite | Dév. + géré |

---

---

## Ce que nous ferions concrètement

Si vous n'avez jamais exécuté d'agent auparavant : commencez avec OpenClaw Cloud. L'offre gratuite vous donne 14 jours pour savoir si cela vous convient vraiment, sans rien dépenser ni toucher à un terminal.

Une fois que vous savez que vous voulez qu'il fonctionne de manière fiable : TinyClaw est la mise à niveau la plus propre. Conteneurs isolés, performances constantes, intégration la plus rapide. Si à terme vous voulez plusieurs agents ou un accès en équipe, l'infrastructure est déjà conçue pour cela.

Si la souveraineté des données est importante, ou si vous avez besoin de Voice Wake, ou si iMessage compte : optez pour l'auto-hébergement. Le Mac mini est le choix matériel évident — 599 $, silencieux, 3–4 W au repos, exécute macOS nativement. Aucune option cloud ne peut vous offrir ce que le local-first apporte.

Si vous êtes un développeur qui veut comprendre le mécanisme : lisez le code de jlia0 TinyClaw avant de faire quoi que ce soit d'autre. 400 lignes de shell vous en diront plus sur ce qui se passe que n'importe quelle documentation.

---

---

## L'évaluation honnête

« Fonctionnel » et « utile » ne sont pas la même chose. Chaque option que nous avons testée était fonctionnelle dès la première heure. Être utile a pris plus de temps — il a fallu que SOUL.md accumule du contexte, connecter les outils que vous utilisez réellement, et confier à l'agent des tâches importantes plutôt que des invites de démonstration. Les options hébergées facilitent le démarrage. Les options auto-hébergées vous offrent plus de possibilités une fois le démarrage passé.

L'écosystème des Skills est la plus grande question en suspens. L'entreprise de sécurité Koi Security a audité ClawHub début février 2026 et a trouvé 341 Skills malveillantes sur 2 857 analysées — soit environ 12 % du catalogue, la plupart provenant d'un seul compte d'attaquant qui a publié 314 Skills piégées en une semaine avant d'être découvert. OpenClaw a depuis ajouté des processus de révision, mais le catalogue est trop vaste pour être audité manuellement. Considérez les Skills de la communauté de la même manière que vous traiteriez les extensions de navigateur : utiles, souvent excellentes, et méritant un rapide coup d'œil au code source avant d'installer quoi que ce soit qui demande un accès au système.

207K étoiles sur GitHub signifient que quelque chose a été bien fait. Savoir si cette chose spécifique est faite pour vous est la question à laquelle il faut une semaine pour répondre, et non une page d'accueil.

---

---

*Partie 10 de la série sur l'infrastructure des agents. Les articles précédents couvraient [l'architecture](/blog/dissecting-openclaw-architecture/), [l'écosystème de compétences](/blog/agent-skills-ecosystem/), [les flux de travail d'entreprise](/blog/vibe-working-when-agents-work/), [l'analyse approfondie de ClawdBot](/blog/deep-dive-clawdbot-breakout-agent/), [les modèles économiques](/blog/who-makes-money-from-openclaw/), [ce que signifie le fait que son créateur rejoigne OpenAI](/blog/openclaw-creator-joins-openai/), et [les guides de déploiement](/blog/09-deploy-openclaw/).*

*Références :*
- [Dépôt GitHub OpenClaw](https://github.com/openclaw/openclaw) (207K étoiles, v2026.2.17)
- [TinyClaw — Déploiement d'OpenClaw en un clic](https://tinyclaw.dev)
- [OpenClaw Cloud](https://open.claw.cloud)
- [EasyClaw.ai](https://www.easyclaw.ai)
- [TinyClaw (jlia0)](https://github.com/jlia0/tinyclaw)
- CVE-2026-25253 — Vulnérabilité de la passerelle OpenClaw (référencée dans notre analyse de sécurité)