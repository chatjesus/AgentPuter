---
title: "OpenClaw vient de résoudre son plus gros problème. Voici ce que fait réellement lossless-claw."
description: "Le compactage par défaut d'OpenClaw s'exécute une seule fois, résume tout et supprime les originaux. Plus votre agent fonctionne longtemps, plus il oublie. La version 2026.3.7 a ouvert le moteur de contexte aux plugins. lossless-claw est le premier d'entre eux — un système basé sur un DAG qui stocke chaque message dans son intégralité et permet aux agents de retrouver des détails historiques exacts sur demande."
date: "2026-03-08"
author: "AgentPuter Lab"
tempsDeLecture: "18 min"
tags: ["OpenClaw", "lossless-claw", "Moteur de Contexte", "Mémoire", "Plugin", "Agents à Longue Exécution", "LCM"]
enVedette: true
---

# OpenClaw V
> - [Fonctionnalité : systèmes de contexte enfichables, LCM pour OpenClaw](https://github.com/openclaw/openclaw/discussions/22251) — Discussion n°22251, @jalehman, 20 fév. 2026
> - [Notes de version d'OpenClaw 2026.3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) — Twitter, 8 mars 2026
> - [LCM : Gestion de Contexte Sans Perte](https://papers.voltropy.com/LCM) — Ehrlich & Blackman

---
Imaginez la scène : vous avez un agent OpenClaw qui mène un projet de recherche depuis trois heures. Il a navigué, pris des notes, recoupé les sources, se construisant une image globale de quelque chose de complexe. Et là, il atteint sa limite de contexte.
Le message suivant qu'il vous envoie se lit comme s'il venait de se réveiller amnésique. Le chemin de fichier spécifique qu'il a trouvé il y a deux heures — disparu. La décision que vous avez prise ensemble sur l'approche à adopter — résumée en une seule phrase vague. Tout le fil du raisonnement qui vous a mené à quelque chose d'utile — réduit à un paragraphe qui perd le détail qui faisait toute la différence.

Vous êtes déjà passé par là. Tous les utilisateurs d'OpenClaw sont déjà passés par là.
Ce n'est pas un bug. C'est intentionnel — et jusqu'au 8 mars 2026, c'était la seule option dont disposait un agent.

OpenClaw 2026.3.7 a changé cela.

---

## Le problème
Ce n'est pas le cas. Voici pourquoi.

Lorsque la compaction par défaut d'OpenClaw se déclenche, elle effectue une **synthèse en une seule fois** : les messages les plus anciens sont condensés en un unique bloc de synthèse, ce bloc est réécrit dans la
[@jalehman](https://github.com/jalehman) — le développeur qui a créé lossless-claw — a décrit précisément la situation dans la [Discussion #22251](https://github.com/openclaw/openclaw/discussions/22251
Cette dernière phrase est importante. Ce n'est pas un défaut spécifique à OpenClaw. ChatGPT le fait. Claude le fait. Tous les frameworks d'agent le font. L'ensemble du domaine a opéré en partant du principe que la compression avec perte est la seule option.

**
Pour les agents fonctionnant sur de longues périodes — ceux que les gens déploient réellement pour fonctionner 24h/24 et 7j/7, pour gérer des projets qui s'étalent sur des jours ou des semaines, pour coordonner des sous-agents sur
Il y a une raison pour laquelle les utilisateurs expérimentés d'OpenClaw ont développé des solutions de contournement : exécuter manuellement `/compact` à des moments stratégiques, structurer SOUL.md pour forcer les faits clés à survivre à la compaction, diviser les projets en sessions
Le titre que vous verrez sur Twitter est « lossless-claw — un plugin OpenClaw qui donne à votre agent une mémoire parfaite. » C'est vrai, mais ce n'est pas la véritable nouvelle.

La véritable nouvelle, c'est ce qui a dû se produire au cœur d'OpenClaw avant que lossless-claw puisse exister.
Avant la version 2026.3.7, la gestion de contexte d'OpenClaw était **codée en dur dans le noyau**. Il n'y avait aucun moyen de la remplacer, de l'étendre ou d'expérimenter des alternatives sans forker
La PR que @jalehman a soumise — [#22201](https://github.com/openclaw/openclaw/pull/22201) — ne s'est pas contentée d'ajouter le support de lossless-claw. Elle **a extrait la
Concrètement, cela signifie qu'OpenClaw dispose désormais d'une interface définie pour la gestion du contexte. Tout plugin qui implémente cette interface peut remplacer entièrement le moteur intégré. Le comportement par défaut est conservé — `LegacyContextEngine` reste la solution de repli si vous ne configurez rien — mais la porte est désormais ouverte.

Voici l'interface :

```typescript
// OpenClaw 2026.3.7 — Interface de plugin pour le moteur de contexte
interface ContextEngine {
```
bootstrap(ctx):           Promise<void>           // initialiser la BDD, les index
  ingest(msg):              Promise<void>           // archiver chaque message à son arrivée
  assemble(opts):           Promise<AgentMessage[]> // construire le contexte du modèle à chaque tour
  compact(ctx):             Promise<void>           // gérer le déclencheur de compactage
  afterTurn(ctx):           Promise<void>           // traitement post-tour
prepareSubagentSpawn():   ...                     // transmettre le contexte aux sous-agents générés
  onSubagentEnded():        ...                     // réconcilier après la fin d'un sous-agent
}
```

Ceci est un cycle de vie complet. Chaque moment qui implique le contexte — ingestion, assemblage, compactage, transfert au sous-agent — est désormais un point d'ancrage qu'un plugin peut intercepter et remplacer.

Pour utiliser un moteur de contexte alternatif, la configuration se résume à une seule ligne :

```json
{
  "plugins": {
    "slots": {
"contextEngine": "lossless-claw"
    }
  }
}
```

Si vous n'ajoutez pas cette ligne, rien ne change. Aucune différence de comportement par rapport aux versions précédentes. Le chemin de migration est entièrement facultatif.

---

## Fonctionnement de lossless-claw
lossless-claw est la première implémentation de cette interface. Il est basé sur l'article [LCM (Lossless Context Management)](https://papers.voltropy.com/LCM) d'Ehrlich et Blackman — des chercheurs qui ont par la suite directement soutenu le plugin. L'un des co-auteurs de l'article, [@belisarius222](https://github.com/belisarius222), a écrit dans la discussion GitHub :

> *"Josh y a apporté tellement d'améliorations que je pense qu'
Le compactage standard attend qu'un débordement se produise, puis réagit. Au moment où il se déclenche, vous avez déjà perdu la capacité de préserver le contexte correctement — vous effectuez un triage d'urgence sur une pile de messages qui se sont accumulés pendant des heures. Le résultat est inévitablement avec perte.
lossless-claw n'attend pas. Il fonctionne **en continu et de manière asynchrone en arrière-plan**, prenant des décisions de résumé incrémentielles après chaque échange, avant qu'une crise de débordement ne se produise. Les résumés qu'il crée ne
Chaque message qui entre dans une session lossless-claw est immédiatement enregistré dans une **base de données SQLite**. Non résumé — stocké en intégralité. C'est la source de vérité. Il n'est jamais supprimé.

À mesure que la conversation s'allonge, lossless-claw
Résumés de niveau 2 (regroupent plusieurs résumés de niveau 1)
      ↓
  Résumés de niveau 3 (capturent les phases majeures du projet)
```

Les résumés deviennent progressivement plus abstraits à mesure qu'ils montent dans l'arborescence — détaillés et chronologiques vers le bas, généraux et thématiques vers le haut. Chaque résumé contient des métadonnées : les ID de ses nœuds sources, les horodatages, la profondeur, le nombre de descendants.

Lorsqu'il est temps de rassembler le contexte pour un nouveau tour, le moteur fonctionne comme suit :

```
[Queue récente protégée : les N messages bruts les plus récents]
```
+
[Nœuds de résumé remplissant le budget de jetons restant, du plus ancien au plus récent]
           +
[Tous les détails que l'agent demande explicitement via lcm_expand]

Le modèle voit les messages récents en intégralité, et les éléments plus anciens sous
<résumé>
  <parents>
    <summary_ref id="sum_def456" />
  </parents>
  <contenu>
    Au cours de cette session, l'agent a examiné trois stratégies de tarification
    pour le
### Les trois outils de récupération

Quand un résumé ne suffit pas — lorsque l'agent a besoin du chemin de fichier exact, de la formulation précise d'une décision, des données réelles d'une session de recherche spécifique — il dispose de trois outils pour remonter dans l'historique :

| Outil | Ce qu'il fait |
|------|-------------|
| `lcm_grep` | Recherche en texte intégral dans tous les messages stockés |
| `lcm_describe` | Obtenir un résumé d'une période historique spécifique |
| `lcm_expand` | Développer un résumé pour retrouver ses messages sources |
`lcm_expand` est l'élément clé. Au lieu de charger l'expansion entière dans le contexte principal — ce qui irait à l'encontre de l'objectif — il utilise un **sous-agent** pour lire le contenu étendu et ne retourner que le détail spécifique qui a été demandé. Le matériel source est consulté sans saturer la fenêtre de contexte active.
Voici ce que @jalehman veut dire par l'analogie du livre dans sa proposition : *« c'est comme pouvoir revenir à n'importe quelle page du livre. »* Le livre n'est pas détruit quand on le pose. Il est sur l'étagère
> *"Imaginez ne plus jamais avoir à lancer /compact ou /new. [...] J'ai été incroyablement impressionné par les résultats : une conversation qui donne l'impression de ne jamais perdre d'informations (car d'une certaine manière, elle n'en perd pas), qui fonctionne toujours
Pour une vision plus quantitative : [le développeur de la communauté @chrysb a rapporté les premiers résultats de benchmark](https://x.com/chrysb/status/2030526852146549140) sur Twitter le
| Claude Code (par défaut) | 70.3 | Fenêtre glissante standard |
| OpenClaw par défaut | ~68 (estimé) | Compactage en une seule fois |

Il s'agit de chiffres rapportés par la communauté, et non de benchmarks officiels, et ils évolueront à mesure que davantage de personnes effectueront des tests. Mais la tendance observée se confirme structurellement : **plus le contexte s'allonge, plus l'avantage de lossless-claw s'amplifie**, car c'est le scénario exact où le compactage avec perte cause le plus de dégâts.
Le co-auteur de l'article sur LCM, @belisarius222, a noté une amélioration spécifique que @jalehman a apportée par rapport à l'implémentation originale de l'article : **la longueur d'entrée plafonnée pour la synthèse**. Dans le LCM original, la synthèse d'un contenu très long pouvait elle-même dépasser le contexte, provoquer un comportement imprévisible et introduire des cas limites. L'approche plafonnée rend chaque étape de synthèse prévisible, ce qui rend également le système plus fiable pour les appels du sous-agent `lcm_expand`.

---
## Installation et configuration de lossless-claw

**Prérequis : OpenClaw 2026.3.7 ou une version ultérieure.** L'emplacement du plugin Context Engine n'existe pas dans les versions antérieures.
> **Attention :** La version initiale 2026.3.7 contient un bug de registre connu de priorité P1 ([Problème #40096](https://github.com/openclaw/openclaw/issues/40096)) où le module du moteur de contexte est réparti sur plusieurs fragments du paquet (bundle), provoquant l'échec de lossless-claw avec l'erreur « Context engine 'lossless-claw' is not registered. ». Le correctif a été intégré dans la PR #40115. Vérifiez que votre version installée inclut ce correctif avant de continuer — exécutez `openclaw --version` et consultez le journal des modifications (changelog) d'OpenClaw pour la version 3.7.x.

```bash
# Vérifiez d'abord votre version
```
openclaw --version
# Devrait afficher : openclaw 2026.3.7 ou une version ultérieure (avec le correctif du registre)

# Installer le plugin
openclaw plugins install lossless-claw

# Redémarrer la passerelle
openclaw restart
```
contextEngine: "lossless-claw"
    }
  }
}
```

### Qui Devrait L'Activer

lossless-claw n'est pas le bon choix pour chaque configuration OpenClaw. Il ajoute une surcharge — à la fois en stockage (base de données SQLite qui grossit avec l'historique de vos conversations) et en utilisation de tokens (le processus de résumé lui-même consomme des tokens).

**Activez lossless-claw si :**
- Votre agent fonctionne 24h/24 et 7j/7 et gère des projets en cours
- Vous effectuez des recherches multi-sessions où la continuité est importante
- Vous exécutez des systèmes de sous-agents où la transmission du contexte est essentielle
- Vous avez déjà perdu des informations importantes à cause de la compaction et avez dû tout recommencer

**Conservez le moteur par défaut si :**
- Vous utilisez OpenClaw principalement pour
lossless-claw utilise un LLM pour générer des résumés. Cela coûte des tokens. Pour la plupart des flux de travail de longue durée, les économies réalisées en évitant les réinitialisations de session compensent largement le surcoût lié à la génération de résumés — mais si vous êtes soucieux des coûts, il existe une manière intelligente de configurer cela :

```json5
{
  agents: {
    defaults: {
      model: "anthropic/claude-opus-4-6",
    }
  },
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  }
}
```
La documentation de lossless-claw recommande d'utiliser un modèle rapide et peu coûteux pour le travail de résumé en arrière-plan — quelque chose comme `anthropic/claude-haiku-4-5` ou `MiniMax-M2.5-highspeed` — tout
L'implémentation de @jalehman vise également à maintenir le contexte actif dans la plage de **30 000 à 100 000 tokens** grâce à la cadence de résumé adaptative — de sorte que l'utilisation des tokens reste prévisible même lorsque l
Avant la version 3.7, chaque tentative d'améliorer la gestion du contexte dans OpenClaw se heurtait au même mur : elle était codée en dur. Vous pouviez écrire des compétences qui tentaient de gérer l'état de manière externe. Vous pouviez structurer votre SOUL.md pour préserver les faits clés. Vous pouviez exécuter manuellement la commande `/compact` à des moments stratégiques. Aucune de ces approches ne pouvait toucher au mécanisme de base.

Désormais, l'interface est ouverte.

Quelques pistes déjà en discussion au sein de la communauté :
**Recherche vectorielle comme backend de stockage.** La recherche plein texte de SQLite est adaptée aux requêtes par mots-clés. Un backend de plongements vectoriels permettrait la recherche sémantique — trouver du contenu historique conceptuellement pertinent même en l'absence des mots exacts. L'implémentation originale de Volt par @belisarius222 utilisait cette approche.
**Moteurs de contexte avec RAG intégré.** Un moteur qui puise non seulement dans l'historique de la conversation, mais aussi dans une base de connaissances externe — votre espace de travail Notion, votre base de code, votre bibliothèque de documents — assemblée dynamiquement à chaque tour en fonction des besoins de la tâche en cours.

**Pools de mémoire partagés entre les agents.** Un moteur de contexte dans lequel plusieurs agents peuvent lire et écrire simultanément, permettant un véritable partage de connaissances multi-agent sans avoir à tout acheminer via un coordinateur central.
**Obsidian / Notion comme backend de mémoire.** Plutôt qu'une base de données SQLite locale, faites persister l'intégralité des données dans un espace de travail externe structuré où vous pouvez les parcourir et les modifier vous-même. La mémoire de votre agent devient auditable et
D'un point de vue de l'infrastructure, c'est ainsi que les plateformes matures évoluent. OpenClaw a fourni l'automatisation du navigateur, puis a ouvert l'outil de navigation à la personnalisation. Il a fourni des compétences, puis a créé ClawHub pour les distribuer. Il a fourni la gestion du contexte, puis a ouvert le moteur de contexte. Le schéma est constant : le construire d'abord, puis le rendre extensible.
La gestion du contexte est la couche la plus fondamentale d'un système d'agent. Elle détermine ce que l'agent sait, comment il raisonne au fil du temps et ce qu'il peut réellement accomplir sur des tâches de longue durée. L'ouvrir n'est pas une fonctionnalité mine
**Routage des agents par sujet dans Telegram.** Les groupes de discussion peuvent désormais router différents sujets vers différents agents. Un seul groupe Telegram, plusieurs agents spécialisés — chacun gérant un fil de discussion différent avec des sessions isolées. Il s'agissait d'une fonctionnalité demandée depuis des mois pour les configurations d'équipes multi-agents.

**Préparation pour l'App Store Connect iOS.** Identifiants de bundle, automatisation Fastlane, métadonnées des captures d'écran — toute l'infrastructure pour une soumission à l'App Store est désormais dans la base de code. OpenClaw sur mobile arrive.

---
## La Conclusion

OpenClaw a une limite implicite depuis le premier jour : plus votre agent fonctionne longtemps, plus il oublie. Chaque cas d'utilisation sérieux finit par s'y heurter. La communauté contourne ce problème depuis des mois avec des astuces pour SOUL.md
lossless-claw est la première réponse — un système de résumé basé sur un DAG qui stocke tout, résume de manière incrémentielle et permet aux agents de récupérer des détails exacts de l'historique sur demande. Les premiers chiffres des benchmarks communautaires montrent qu'il sur
openclaw plugins install lossless-claw
```

Voilà toute la migration.

---

*Au bout de combien de temps vos agents atteignent-ils la compaction ? Et que perdez-vous lorsque cela se produit ? Dites-le-nous dans les commentaires — nous suivons la
*Sources : [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) · [Discussion OpenClaw #22251](https://github.com/openclaw/openclaw/discussions/22251) · [Notes de version d'OpenClaw 202