---
title: "Vibe Working : Quand « Dites-le simplement à l'Agent » fonctionne réellement"
description: "L'IA d'entreprise fait gagner aux analystes 1,5 heure par jour, mais le meilleur Agent échoue encore à 53 % des tâches bureautiques multi-applications. L'écart entre les gains de temps sur une seule application et l'automatisation de bout en bout est là où réside la véritable opportunité."
date: "2026-02-12"
author: "AgentPuter Lab"
readingTime: "12 min"
tags: ["Vibe Working", "Compétences bureautiques", "AgentPuter", "Productivité", "Agent IA"]
featured: true
---

Dans nos trois articles précédents, nous avons suivi un fil conducteur unique : d'OpenClaw en tant que produit → à son architecture Cerveau-Corps-Âme → à la pile de capacités Compétences + Passerelle + MCP sous-jacente.

Nous n'avons cessé de dire que "les compétences transformeront le travail quotidien". Il est temps de montrer à quoi cela ressemble réellement.

---

## I. Microsoft l'a appelé "Vibe Working"

Le 29 septembre 2025, Microsoft a lancé deux fonctionnalités dans Microsoft 365 Copilot et leur a donné un nom : **Vibe Working**.

Le **Mode Agent** a atterri dans Excel et Word. Vous tapez une invite — *"Créez-moi un calculateur d'amortissement de prêt avec des ventilations des paiements mensuels"* — et l'Agent ne se contente pas de cracher une formule. Il crée des feuilles, écrit des formules, génère des graphiques, valide les résultats, repère les erreurs, les corrige et itère jusqu'à ce que le résultat soit correct. Multi-étapes. Auto-correcteur.

L'**Agent Office** a atterri dans la barre latérale de chat Copilot. Vous dites *"Faites une présentation prête pour le conseil d'administration à partir de ces données trimestrielles"* et il produit un PowerPoint soigné. Pas un modèle avec du texte de remplacement — une présentation réelle avec vos chiffres, formatée, prête à être présentée.

Le nom remonte à Andrej Karpathy. Le 2 février 2025, le membre fondateur d'OpenAI a tweeté : *"Il existe un nouveau type de codage que j'appelle 'vibe coding', où vous vous abandonnez complètement aux vibrations, embrassez les exponentielles et oubliez même que le code existe."* Sept mois plus tard, Microsoft a pris cette idée du code et l'a appliquée aux feuilles de calcul, aux documents et aux diapositives : **vous fournissez l'intention, l'Agent fournit l'artefact.**

Plus besoin de se battre avec la syntaxe VLOOKUP. Plus besoin de formater manuellement 47 diapositives. Plus besoin de copier des chiffres entre trois feuilles de calcul et un document Word.

Du moins, c'est la promesse. Le propre **SpreadsheetBench** de Microsoft montre que le Mode Agent dans Excel atteint une **précision de 57,2 %** sur les tâches complexes. Mieux que manuel pour certains utilisateurs — mais loin d'être fiable.

---

## II. La promesse vs la réalité

Voici ce que dit réellement la recherche.

Les benchmarks pour l'automatisation bureautique — comme **SpreadsheetBench** — ont testé les meilleurs modèles sur des flux de travail réalistes : filtrage d'ensembles de données, références croisées de tableaux et production d'analyses sommaires. Des tâches qu'un employé de bureau compétent effectue quotidiennement sans y penser à deux fois.

**Même les meilleurs systèmes échouent près de la moitié du temps.** La conclusion des chercheurs est brutale : les performances sont encore "bien en deçà des normes de précision humaine requises par les flux de travail bureautiques du monde réel".

Les modes de défaillance sont instructifs :

- **Redondance des opérations** — l'Agent répète la même action trois fois de suite, gaspillant des tokens et corrompant parfois sa propre sortie.
- **Références hallucinées** — il modifie avec confiance la cellule B14 dans une feuille de calcul qui n'a que 10 lignes.
- **Échecs de commutation d'application** — le déplacement de données d'Excel vers Word vers Email brise le contexte plus souvent qu'autrement.
- **Dérive à long terme** — sur les tâches avec plus de 10 étapes, l'Agent oublie progressivement ce qu'il essayait d'accomplir.

Mais voici ce que la plupart des gens manquent à propos de ces échecs. L'équipe rouge IA de Microsoft a publié une taxonomie des modes de défaillance dans les systèmes agentiques, et la découverte la plus effrayante n'est pas l'hallucination — c'est **l'érosion de la surveillance humaine**.

Lorsque l'Agent génère une feuille de calcul qui *semble* correcte, les utilisateurs cessent de vérifier les formules. Lorsqu'il rédige un e-mail qui *sonne* bien, les utilisateurs cliquent sur Envoyer sans lire. Le vrai risque n'est pas que l'Agent se trompe. C'est que l'humain cesse de le remarquer.

C'est la tension centrale dans Vibe Working : plus l'Agent devient capable, plus il est dangereux de lui faire confiance sans garde-fous.

---

## III. Quatre scénarios : avant et après

Avant de plonger dans notre propre travail, un peu de contexte sur ce qui a déjà été mesuré dans la nature.

Une **étude de terrain du NBER** (conditionnellement acceptée à *American Economic Review: Insights*) a suivi **7 137 travailleurs du savoir** dans 66 entreprises pendant six mois. Les travailleurs utilisant des outils d'IA intégrés ont passé **25 à 31 % moins de temps sur les e-mails** — soit environ deux à trois heures de moins par semaine.

- Les analystes financiers de **Morgan Stanley** ont économisé **1,5 heure par jour** sur la recherche et la préparation de rapports.
- **Repsol** a mené un projet pilote Copilot et a constaté que les employés économisaient **121 minutes par semaine** en moyenne, avec une amélioration de la qualité de la production de 16,2 %.
- **World Wide Technology** a déployé Copilot auprès de 941 utilisateurs et a mesuré **446 heures économisées par semaine** — principalement sur les résumés de réunions, les brouillons d'e-mails et la génération de rapports.

Ces chiffres sont réels. Mais la découverte enfouie de l'étude du NBER est tout aussi importante : malgré les heures économisées sur les e-mails, **il n'y a pas eu de changement significatif dans la quantité ou la composition des tâches globales des travailleurs**. Les travailleurs pouvaient accélérer les choses qu'ils contrôlaient individuellement — mais ils ne pouvaient pas modifier les flux de travail qui nécessitaient une coordination avec les autres. L'IA a accéléré les cellules ; elle n'a pas recâblé l'organisme.

C'est l'idée clé. Les outils actuels permettent de gagner du temps sur les tâches *individuelles* au sein *d'une* application. La partie difficile — la partie où la précision chute à ~50 % — est lorsque l'Agent doit enchaîner des tâches sur plusieurs applications et fournir un artefact complet.

C'est là qu'intervient l'orchestration basée sur les compétences. Voici ce que nous avons construit et testé.

### Scénario 1 : Rapport des ventes trimestrielles

**Avant :** Vous ouvrez trois exports CSV du CRM. Vous les collez dans Excel. Vous passez 40 minutes à construire des tableaux croisés dynamiques, à écrire des formules SOMME.SI, à formater des couleurs conditionnelles et à créer des graphiques. Ensuite, vous copiez les graphiques dans un document Word, écrivez des commentaires autour d'eux et l'envoyez par e-mail à votre responsable. Total : ~2 heures.

**Après :** Vous dites à l'Agent : *"Extrayez les données de ventes du T4, ventilez-les par région et gamme de produits, signalez tout ce qui a chuté de plus de 15 % d'un trimestre à l'autre et donnez-moi un rapport avec des graphiques."*

Ce qui se passe en coulisses :
- Une **Compétence de rapport des ventes** s'active — elle connaît la structure standard du rapport, les métriques qui comptent et comment signaler les anomalies.
- La compétence orchestre les **outils MCP** : l'un se connecte à la base de données CRM, un autre écrit dans Excel, un autre génère le document Word.
- La **Passerelle** gère la session — si la requête CRM prend 30 secondes, elle n'expire pas ; si l'écriture Excel échoue, elle réessaie.
- Vous obtenez un classeur Excel formaté et un résumé Word. Total : ~3 minutes de votre temps.

L'Agent n'a pas improvisé. Il a suivi une recette — une recette qui encode la façon dont votre entreprise structure ses rapports trimestriels.

### Scénario 2 : Notes de réunion

**Avant :** Vous assistez à une réunion de 45 minutes. Vous griffonnez des notes. Ensuite, vous passez 20 minutes à les taper, à les organiser par sujet, à identifier les actions à entreprendre et à les envoyer aux participants. La moitié du temps, vous manquez quelque chose et devez vérifier l'enregistrement.

**Après :** Vous dites : *"Transcrivez la synchronisation produit d'hier, organisez-la par sujet, extrayez les actions à entreprendre avec les responsables et les échéances, et envoyez le résumé à tous les participants."*

En coulisses :
- Une **Compétence de notes de réunion** s'active — elle connaît la différence entre une décision, une action à entreprendre et une discussion de fond.
- Les **outils MCP** gèrent la transcription (API Whisper), la recherche dans le calendrier (qui a participé) et l'envoi d'e-mails.
- La compétence applique le format préféré de votre équipe — pas un modèle générique, mais la structure réelle que votre équipe utilise.

Le résultat est un document qui ressemble à ce qu'un humain a écrit, car la compétence a été entraînée sur la façon dont votre équipe rédige les notes de réunion.

### Scénario 3 : Examen des risques contractuels

**Avant :** Le service juridique vous envoie un contrat de fournisseur de 30 pages. Vous le lisez. Vous mettez en évidence les clauses qui semblent inhabituelles. Vous faites une référence croisée avec les conditions générales standard de votre entreprise. Vous rédigez un résumé des risques. Cela prend la majeure partie d'un après-midi.

**Après :** Vous dites : *"Examinez ce contrat de fournisseur par rapport à nos conditions générales standard. Signalez les écarts, évaluez chacun par niveau de risque et donnez-moi un résumé que je peux envoyer au service juridique."*

En coulisses :
- Une **Compétence d'examen des contrats** s'active — elle connaît les conditions générales standard de votre entreprise, les schémas de risque courants et la façon dont votre service juridique préfère les évaluations des risques.
- Les **outils MCP** gèrent l'analyse PDF, l'extraction de texte et la comparaison structurée.
- La Passerelle applique les contrôles d'accès — les données du contrat restent dans l'environnement d'exécution sécurisé, ne quittent jamais le bac à sable.

Vous obtenez un rapport de risque structuré en 4 minutes. Le service juridique effectue toujours l'examen final — l'Agent ne remplace pas les avocats, il remplace les 3 heures de lecture et de mise en évidence qui précèdent le jugement juridique réel.

### Scénario 4 : Tri des e-mails

**Avant :** Lundi matin. 127 e-mails non lus. Vous passez 45 minutes à scanner les lignes d'objet, à ouvrir les messages, à catégoriser mentalement (urgent / pour info / nécessite une réponse / spam) et à rédiger des réponses. Au moment où vous avez terminé, trois nouveaux e-mails urgents sont arrivés.

**Après :** Vous dites : *"Triez ma boîte de réception. Signalez tout ce qui est urgent de la part des subordonnés directs ou des clients. Rédigez des réponses pour tout ce qui nécessite juste un accusé de réception. Résumez le reste en trois points."*

En coulisses :
- Une **Compétence de tri des e-mails** s'active — elle sait qui sont vos subordonnés directs, quels clients sont prioritaires et ce que signifie "urgent" dans votre contexte.
- Les **outils MCP** se connectent à votre fournisseur de messagerie, extraient les messages et rédigent des réponses.
- La Passerelle garantit qu'aucun contenu d'e-mail n'est stocké au-delà de la session — une fois la tâche terminée, les données disparaissent.

Vous examinez 127 e-mails en 6 minutes. Vous modifiez deux réponses rédigées, approuvez le reste et passez à autre chose.

---

## IV. Ce qui fait que cela fonctionne (et ce qui ne fonctionne pas)

Les quatre scénarios partagent un schéma. Rendons-le explicite.

**Ce qui fait que cela fonctionne :**

1.  **Une compétence qui encode la connaissance du domaine.** Pas une invite générique — un ensemble d'instructions structuré qui connaît le format de rapport de votre entreprise, le style de notes de réunion de votre équipe, l'échelle d'évaluation des risques de votre service juridique. C'est pourquoi une approche basée sur les compétences surpasse l'invite brute.
2.  **Des outils MCP qui gèrent la mécanique.** L'Agent n'a pas besoin de "comprendre" comment se connecter à votre CRM ou analyser un PDF. MCP fournit des intégrations pré-construites et testées. La compétence dit simplement "utilisez cet outil" et MCP gère le protocole.
3.  **Une Passerelle qui maintient tout en marche.** L'état de la session ne disparaît pas en milieu de tâche. Si une étape échoue, la Passerelle réessaie ou annule. Les autorisations sont appliquées — la compétence d'examen des contrats ne peut pas accéder à votre e-mail, et la compétence d'e-mail ne peut pas accéder au contrat.

**Ce qui ne fonctionne pas (encore) :**

1.  **Flux de travail inter-applications avec de nombreuses étapes.** Le taux de réussite diminue considérablement lorsque les tâches couvrent plus de 4 applications. La fragmentation du contexte est le plus grand problème non résolu.
2.  **Intention ambiguë.** "Améliorez ce rapport" ne suffit pas. L'Agent a besoin d'une intention spécifique — "signalez les baisses de plus de 15 %" est exploitable, "faites en sorte que ce soit joli" ne l'est pas. Vibe Working exige que les utilisateurs soient clairs sur ce à quoi ressemble "terminé".
3.  **Configuration initiale.** Une compétence doit apprendre les conventions de votre entreprise avant de pouvoir les reproduire. Le premier rapport trimestriel demande des efforts de configuration. Le 20e prend 3 minutes.

---

## V. Pourquoi les solutions actuelles sont insuffisantes

Les fonctionnalités Vibe Working de Microsoft sont des démos impressionnantes. Mais il existe des limitations structurelles dans l'approche actuelle.

**Copilot est verrouillé dans l'écosystème de Microsoft.** Le Mode Agent fonctionne dans Excel et Word. Que faire si vos données sont dans Google Sheets, votre CRM est Salesforce et vos enregistrements de réunion sont dans Otter.ai ? Vous avez besoin de quelque chose qui orchestre entre les fournisseurs, pas au sein d'un seul.

**Pas de mémoire persistante entre les sessions.** Copilot ne se souvient pas que le rapport du mois dernier utilisait un style de graphique spécifique, ou que votre service juridique préfère une échelle de risque à 3 niveaux. Chaque session commence à zéro. Les compétences résolvent ce problème — la connaissance est dans le fichier de compétence, pas dans la session.

**Pas d'isolation de sécurité.** Lorsque Copilot traite votre contrat de fournisseur, où vont ces données ? Via l'API d'OpenAI ? Celle d'Anthropic ? Microsoft utilise les deux — et voici un détail enfoui dans leur propre documentation : **Les modèles Anthropic au sein des expériences Microsoft 365 Copilot sont explicitement hors du champ d'application de la limite de données de l'UE**. Si vous êtes une entreprise européenne exécutant le Mode Agent, certaines de vos données peuvent être traitées en dehors des centres de données de l'UE (en particulier sur AWS US). Pour les documents sensibles, vous avez besoin d'un environnement d'exécution avec des limites de données claires — une Passerelle avec un bac à sable, pas une fenêtre de chat avec des API cloud.

**Les chiffres de précision sont brutaux.** 57,2 % sur SpreadsheetBench pour les tâches Excel uniquement — et c'est le *propre* Mode Agent de Microsoft sur son *propre* benchmark. Les travaux universitaires sur le raisonnement des feuilles de calcul (comme SheetBrain, SheetAgent) montrent que même les systèmes neuro-symboliques spécialement conçus ont besoin de modules de validation explicites pour éviter de corrompre les données. L'intelligence brute du modèle, aussi impressionnante soit-elle, n'est pas prête pour la production pour l'automatisation bureautique sans infrastructure.

---

## VI. L'approche que nous adoptons

La pile Vibe Working d'AgentPuter a trois couches — les mêmes trois que nous avons décrites dans notre article précédent :

Les **Compétences** définissent le manuel pour chaque scénario. Une Compétence de rapport des ventes est différente d'une Compétence de notes de réunion est différente d'une Compétence d'examen des contrats. Chacune encode des connaissances spécifiques du domaine, des séquences d'étapes, des exigences d'outils et des formats de sortie.

L'**Agent Gateway** orchestre l'exécution. Il charge la bonne compétence, achemine les appels d'outils MCP, gère l'état de la session, applique les autorisations et gère les échecs. La Passerelle est la raison pour laquelle le système ne s'effondre pas à l'étape 7 d'un flux de travail en 12 étapes.

Les **outils MCP** gèrent les connexions réelles — requêtes de base de données, E/S de fichiers, API de messagerie, recherches de calendrier, analyse PDF. Standardisés, testés, conteneurisés.

Qu'est-ce qui rend cela différent de Copilot ? Trois choses :

1.  **Neutre vis-à-vis des fournisseurs.** Notre Passerelle orchestre entre Google Workspace, Microsoft 365, Salesforce, Slack, Notion — partout où vos données résident réellement. Pas verrouillé dans un seul écosystème.
2.  **Connaissance persistante.** Les compétences se souviennent de vos conventions entre les sessions. Le 20e rapport trimestriel est aussi rapide que le 2e, car la compétence connaît déjà votre format, vos métriques, votre public.
3.  **Environnement d'exécution axé sur la sécurité.** Chaque compétence s'exécute dans un environnement en bac à sable. Les données du contrat ne touchent pas le contexte de la compétence de messagerie. Les données de session sont éphémères à moins d'être explicitement rendues persistantes. Journaux d'audit pour chaque étape.

---

## Réflexions finales

"Vibe Working" est un bon nom pour ce qui s'en vient. L'idée que vous décrivez ce que vous voulez et qu'un Agent livre l'artefact fini — c'est l'état final vers lequel tout le monde se dirige.

Mais la vérité honnête est : nous n'y sommes pas encore. L'écart entre la démo et le pilote quotidien est réel. Des taux de réussite d'environ 50 % sur les flux de travail bureautiques vous indiquent que l'intelligence brute du modèle ne suffit pas.

Ce qui comble le fossé n'est pas un meilleur modèle. C'est l'infrastructure autour du modèle :

- Les **compétences** qui contraignent l'Agent à des flux de travail éprouvés au lieu de le laisser improviser
- Une **Passerelle** qui maintient les tâches en plusieurs étapes sur la bonne voie, avec des tentatives, des annulations et un contrôle d'accès
- Les **outils MCP** qui fournissent des intégrations testées et fiables au lieu de demander à l'Agent de comprendre les API par lui-même

Au cours des quatre derniers articles, nous sommes passés de la dissection d'un projet open source viral à la construction d'une image complète de ce que l'infrastructure Agent exige réellement.

Voici la partie qui devrait déranger tous ceux qui construisent dans cet espace : les analystes de Morgan Stanley économisent 1,5 heure par jour avec l'IA, mais le meilleur Agent à usage général échoue encore à la moitié de toutes les tâches bureautiques multi-applications. **Le retour sur investissement est déjà réel — à l'intérieur des applications individuelles, avec la supervision humaine. Au moment où vous supprimez l'humain ou franchissez les limites des applications, les choses se cassent.**

La conclusion est simple : **l'Agent qui fait votre rapport trimestriel n'est pas plus intelligent que ChatGPT. Il a juste de meilleures instructions, un environnement d'exécution fiable et les bons outils branchés.** Les 7 137 travailleurs de cette étude du NBER n'avaient pas besoin d'un modèle plus intelligent. Ils avaient besoin d'une meilleure infrastructure autour du modèle qu'ils avaient déjà.

C'est Vibe Working. Pas des vibrations. Infrastructure.

---

*Ceci est le quatrième article de notre série sur l'infrastructure Agent. Nous sommes passés d'OpenClaw → à l'architecture → à la pile de capacités Compétences + Passerelle + MCP → et maintenant à ce à quoi cela ressemble dans la pratique. Ensuite, nous nous tournerons vers le modèle commercial : comment monétiser réellement une plateforme Agent ? Si vous avez un flux de travail bureautique que vous avez essayé — et échoué — d'automatiser avec l'IA, nous aimerions en entendre parler.*