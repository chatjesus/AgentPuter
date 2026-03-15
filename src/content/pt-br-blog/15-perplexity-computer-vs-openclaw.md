---
title: "Perplexity Acaba de Construir o que os Usuários do OpenClaw Já Executavam por Conta Própria"
description: "Em 25 de fevereiro, a Perplexity lançou o Computer — uma IA na nuvem que orquestra 19 modelos, executa subagentes em paralelo e realiza tarefas de forma autônoma por US$ 200/mês. Veja o que os usuários do OpenClaw já têm, o que não têm, e o que isso significa para a corrida das plataformas de agentes."
date: "2026-02-28"
author: "AgentPuter Lab"
readingTime: "14 min"
tags: ["OpenClaw", "Perplexity", "Agente de IA", "Multiagente", "Plataforma de Agentes"]
featured: true
---

Em 25 de fevereiro, o Perplexity lançou o "Computer" — um sistema de IA em nuvem que orquestra 19 modelos, executa subagentes em paralelo, mantém um sistema de arquivos e navegador persistentes e executa tarefas de forma autônoma por longos períodos. Disponível para assinantes do Perplexity Max por US$ 200/mês, o que inclui 10.000 créditos.
O resumo do Ars Technica sobre o produto: *"Então, existe o OpenClaw, que você poderia perceber como o predecessor imediato deste conceito."*

Este artigo aborda o que o Perplexity Computer realmente é, onde ele converge com o OpenClaw, onde eles divergem, e
5. [No que o Perplexity é melhor](#does-better)
6. [Para quem cada um realmente é](#who-for)
7. [O que isso significa para a corrida das plataformas de agentes](#platform-race)

---

## 1. O que o Perplexity Computer realmente é {#what-it-is}
A proposta: descreva um resultado em linguagem simples e o Computador descobre como chegar lá. "Planeje e execute uma campanha de marketing digital para o meu restaurante." "Crie para mim um app para Android que me ajude a acompanhar minhas leituras." Você não está escrevendo prompts ou
Por trás dessa interface, o Computador divide a solicitação em subtarefas estruturadas, delega cada uma ao mais adequado de seus 19 modelos disponíveis para aquela etapa específica e as executa — algumas em paralelo, outras em série — até que o trabalho seja concluído.

**A pilha de modelos:**

| Modelo | Função |
| --- | --- |
| Claude Opus 4.6 | Motor principal de raciocínio e orquestração |
| ChatGPT 5.2 | Recuperação de contexto longo, pesquisa ampla na web |
| Gemini | Pesquisa aprofund
| Veo 3.1 | Geração de vídeo |
| Grok | Tarefas leves e sensíveis à velocidade |

19 modelos no total — a tabela acima mostra os principais modelos nomeados. Opus é a camada de orquestração; ele decide qual modelo lida com qual subtarefa. Você não configura nada disso. Isso acontece de forma invisível.
**O ambiente:** Cada tarefa é executada em um ambiente de computação em nuvem isolado com acesso a um sistema de arquivos real, um navegador real e integrações de ferramentas pré-construídas. Nada é executado na sua máquina local. As integrações são selecionadas pela Perplexity — sem plugins de terceiros, sem servidores MCP personalizados.
**Preços:** US$ 200/mês pelo Perplexity Max, que inclui 10.000 créditos. O computador consome créditos enquanto é executado — o uso não é ilimitado. Você pode definir limites de gastos por subagente, o que lhe dá
**Uma ressalva sobre a linguagem de marketing:** A Perplexity diz que o Computer é "capaz de funcionar por horas ou até meses". O produto foi lançado em 25 de fevereiro. Ninguém ainda verificou a alegação de vários meses em um fluxo de trabalho real. Considere isso uma aspiração até que haja relatos de usuários para respaldá-la.

---

## 2. A Ideia Central é a Mesma {#same-idea}

[Blog da AgentPuter #01](https://agentputer.com/blog/agent-needs-its-own-computer/) (4 de fevereiro de 2026):
> *"Os Agentes de IA são notavelmente capazes — mas eles não têm um lar, nenhum espaço de trabalho persistente, nenhum computador próprio."*

O Perplexity Computer é uma implementação comercial exatamente dessa tese.
Este não é um caso do Perplexity lendo aquela postagem e construindo um produto. O Perplexity iniciou experimentos internos em janeiro — antes da publicação do Blog #01. São várias equipes chegando à mesma conclusão de forma independente. O que, por si só, é um sinal: o problema é real e óbvio o suficiente para que diferentes organizações o estejam resolvendo sem coordenação.

O paralelo estrutural é difícil de ignorar:

| Conceito | Perplexity Computer | OpenClaw |
| --- | --- | --- |
| Espaço de trabalho persistente | Sistema de arquivos na nuvem por tarefa | `~/.openclaw/data/` |
| Roteamento multimodelo | 19 modelos, orquestrados pelo Opus | `model.fallbacks` + `modelByChannel` |
| Coordenação de subagentes | Decomposição de tarefas → delegação a agentes | `sessions_spawn` fan-out |
| Autonomia de longa duração | Declarado: de horas a meses | Cron + `runTimeoutSeconds` |
| Navegador real | Integrado | `browser_snapshot`, `browser_navigate` |
| Arquivos de contexto do agente | Gerenciados pela plataforma, não visíveis ao usuário | `SOUL.md`, `USER.md`, `HEARTBEAT.md` |
| Controles de gastos | Limites de crédito por subagente | `runTimeoutSeconds` (proxy baseado em tempo) |

As decisões de design correspondem quase que diretamente. Armazenamento persistente, acesso a navegador, roteamento multimodelo, paralelismo de subagentes, autonomia de longa duração — essas não são funcionalidades que o Perplexity inventou. São funcionalidades que a comunidade OpenClaw tem usado, de forma configurável, desde o ano passado.
O criador do OpenClaw, Peter Steinberger, entrou para a OpenAI em fevereiro. Altman descreveu os agentes pessoais como algo que "rapidamente se tornará central para nossas ofertas de produtos" e disse que o futuro "será extremamente multiagente". A Anthropic lançou o Claude Cowork em janeiro. Toda a indústria está agora produtizando o padrão de infraestrutura que a comunidade de código aberto do OpenClaw construiu primeiro.

---

## 3. Onde Divergem {#diverge}

As ideias são idênticas. A filosofia de execução é oposta.
A Ars Technica resumiu bem: *"Se o OpenClaw fosse a web aberta das ferramentas de agentes de IA, então o Computer seria a App Store da Apple."*

Essa analogia é precisa e vale a pena refletir sobre ela. A web aberta permite que você crie qualquer coisa e acesse qualquer coisa — ao custo de segurança, confiabilidade e da exigência de sofisticação técnica. A App Store limita o que você pode criar e acessar — e, em troca, oferece uma experiência curada, mais segura e mais consistente.

Nenhuma das duas está errada. Elas atendem a usuários diferentes com prioridades diferentes.
| Dimensão | Perplexity Computer | OpenClaw |
| --- | --- | --- |
| Onde é executado | Apenas na nuvem | Máquina local, VPS auto-hospedado ou TinyClaw |
| Modelo de integração | Integrações de plataforma selecionadas | Open Skills + ecossistema MCP |
| Configuração | Gerenciado pela plataforma, invisível para o usuário | `openclaw.json`, controle total do usuário |
| Modelo de segurança | A plataforma é responsável | O usuário é responsável |
| Limite de personalização | Baixo — use o que o Perplexity oferece | Alto — configure qualquer coisa |
| Transparência | Caixa-preta | Transcrição completa via `sessions_history` |
| Localização dos dados | Nuvem da Perplexity | Sua máquina ou seu servidor |
| Controles de gastos | Limites de crédito por subagente | `runTimeoutSeconds` (proxy de tempo) |

A troca segue consistentemente em uma direção: a Perplexity abre mão do controle em troca de simplicidade e segurança; o OpenClaw abre mão da simplicidade em troca de controle e extensibilidade.

---

## 4. O que a Perplexity não pode fazer {#cant-do}
Estes não são casos isolados — são capacidades que os usuários do OpenClaw consideram essenciais.

**SOUL.md — identidade persistente do agente**

No OpenClaw, o `SOUL.md` é um arquivo que molda como o agente pensa e se comporta
O Perplexity Computer não tem equivalente. Toda tarefa começa a partir dos padrões da plataforma. Você não pode escrever um conjunto de instruções persistente, não pode definir como o agente deve lidar com ambiguidades, nem dar a ele uma personalidade que persista. O agente com o qual você trabalha hoje não
O OpenClaw executa workflows agendados de forma autônoma. "Todo dia útil às 7:50, puxe a atividade de ontem do GitHub, resuma os PRs que precisam de revisão e envie um resumo para o Telegram." Ninguém aperta um botão. O agente é disparado no horário agendado, realiza o trabalho e entrega o resultado — esteja você acordado ou não.

Não há equivalente no Perplexity Computer. Os workflows de longa duração que o Perplexity suporta ainda exigem que um humano os inicie.

**Recebimento por webhook**
O OpenClaw expõe um endpoint `/hooks/agent`. Um Webhook do GitHub é disparado quando um PR é aberto; o agente lê o diff, executa uma revisão e posta o feedback no Slack — tudo sem envolvimento humano. O evento externo aciona o fluxo de trabalho.
Se o seu fluxo de trabalho acessa arquivos na sua máquina — lendo código de um repositório local, processando documentos no seu sistema de arquivos, interagindo com aplicativos locais — o Perplexity Computer não consegue acessá-los. Tudo é executado no ambiente de nuvem da Per
O ecossistema do OpenClaw inclui milhares de Skills no ClawHub e em agentskills.io, além de suporte para servidores MCP personalizados. Você pode instalar uma Skill que se conecta às suas ferramentas internas, escrever uma Skill personalizada que codifica o fluxo de trabalho da sua organização, ou conectar um servidor
`sessions_history` no OpenClaw fornece a você uma transcrição completa e inspecionável de tudo o que o agente fez: cada chamada de ferramenta, cada resposta do modelo, cada ponto de decisão. Quando algo dá errado, você pode ler exatamente o que aconteceu.

O Perplexity Computer
## 5. O que o Perplexity faz melhor {#does-better}

É importante ser honesto sobre o que os $200/mês compram. Várias destas são vantagens genuínas, não apenas marketing.

**Configuração zero**

Nenhum servidor para
No OpenClaw, mesmo com o TinyClaw cuidando da infraestrutura, ainda existe uma etapa de configuração significativa: conectar canais, escrever o SOUL.md, configurar a pilha de modelos, decidir os agendamentos Cron. Para um usuário não técnico, essa lacuna é significativa.

**19-roteamento de modelos no qual você nunca pensa**
O Opus decide qual dos 19 modelos lida com cada subtarefa. Você não especifica "use o Gemini para pesquisa, use o Nano Banana para imagens, use o Grok para tarefas leves". Esse roteamento ocorre automaticamente com base no que o sistema da Perplexity determinou que funciona melhor.
No OpenClaw, construir um roteamento multi-modelo equivalente exige configuração intencional: definir `subagents.model`, usar `modelByChannel`, escrever `model.fallbacks`, potencialmente escrever uma lógica de roteamento personalizada em `AGENTS.md`. É factível — mas dá trabalho.

**Limites de gastos por subagente**
Esta é a única área em que o Perplexity tem algo que o OpenClaw explicitamente não tem. Limites de gastos baseados em crédito permitem que você diga: "esta subtarefa de pesquisa não deve gastar mais do que X". Isso é um controle de custos direto em dólares no nível
Navegador, execução de código, geração de imagem, geração de vídeo — tudo isso funciona de imediato, sem depuração, sem gerenciamento de credenciais. No OpenClaw, cada capacidade requer ou a instalação de uma Skill, uma configuração de servidor MCP, ou uma chave de API. O resultado é mais poderoso uma vez configurado; o custo de configuração é real.

**Sem superfície de ataque de plugins não verificados**
O incidente ClawHavoc é a ilustração mais clara do risco. Em fevereiro de 2026, 341 skills maliciosas foram descobertas no ClawHub em um ataque coordenado à cadeia de suprimentos. A carga útil principal era o Atomic Stealer (AMOS) — um ladrão de credenciais para macOS que visava carteiras de criptomoedas, chaves de API e senhas de navegador. Cerca de 300.000 usuários ativos do OpenClaw foram potencialmente expostos. O modelo de upload aberto do ClawHub — exigindo apenas uma conta com 7 dias de existência e uma conta do GitHub — tornou trivialmente fácil para os invasores publicarem em escala.
O modelo fechado do Perplexity Computer elimina completamente esta superfície de ataque. Você não pode instalar uma skill maliciosa porque não é possível instalar nenhuma.

**Responsabilidade comercial**

$200/mês garantem um contrato de suporte, um SLA e uma organização que é responsável
## 6. Para Quem Cada Um Realmente É {#who-for}

Eles não estão competindo pelo mesmo usuário. Isso é importante porque enquadrá-los como concorrentes leva à conclusão errada sobre qual deles usar.

**Perplexity Computer:**
O usuário que mais se beneficia do Perplexity Computer tem workflows na nuvem, não precisa mexer em arquivos locais ou ser acionado por eventos externos, sente-se confortável com uma plataforma gerenciando todas as decisões de roteamento e infraestrutura, e valoriza o "simplesmente funciona" em vez de "eu entendo exatamente o que está fazendo".
Um consultor de marketing automatizando a pesquisa de concorrentes. Um escritor usando IA para auxiliar na pesquisa e nos rascunhos. O proprietário de uma pequena empresa que deseja automatizar fluxos de trabalho de comunicação com o cliente que funcionam inteiramente em serviços de nuvem. Para esses usuários, a camada de configuração do OpenClaw é um atrito — não um valor. O Perplexity Computer remove esse atrito por US$ 200/mês.

**OpenClaw:**
O usuário que mais se beneficia do OpenClaw tem requisitos de infraestrutura específicos: acesso a arquivos locais, fluxos de trabalho autônomos acionados por Cron, manipulação de eventos orientada por Webhook, Skills personalizadas para ferramentas proprietárias, ou requisitos de residência de dados que tornam "executado na nuvem da Perplexity" um impeditivo.
Um engenheiro que quer um bot de revisão de PR. Um desenvolvedor que precisa de agentes que trabalhem com código em um repositório local. Uma equipe de operações que precisa de fluxos de trabalho de monitoramento autônomos executando na infraestrutura interna. Um pesquisador
O teste mais claro: se o seu fluxo de trabalho precisa começar sem intervenção humana (Cron ou Webhook), ou precisa acessar arquivos que não estão na nuvem da Perplexity, você é um usuário do OpenClaw. Se os seus fluxos de trabalho são iniciados por você e residem inteiramente em serviços de nuvem, vale a pena avaliar o Perplexity Computer.

Ambos os grupos existem. Ambos crescerão. O mercado de infraestrutura de agentes é grande o suficiente para ambas as abordagens, e as duas provavelmente continuarão a divergir em vez de convergir.

---
## 7. O que isso significa para a Corrida das Plataformas de Agentes {#platform-race}

**A tese da infraestrutura está consolidada.**

No início de 2025, "agentes precisam de seu próprio ambiente de computação persistente" era uma afirmação que você precisava defender. Em fevereiro de 2026, é um produto pelo qual a Perplexity está cobrando US$ 200/mês, a OpenAI está incorporando em seu roadmap, e a Anthropic está lançando como Claude Cowork. O debate sobre se isso é uma categoria de produto real acabou. É uma categoria de produto real.
A competição agora é sobre quem possui a camada de infraestrutura — e não sobre se a camada de infraestrutura existe.

**O pipeline de código aberto para comercialização está seguindo o cronograma.**
A OpenAI contratou o criador do OpenClaw. A Perplexity criou um produto com base no conceito. A Anthropic criou o Claude Cowork. O padrão corresponde ao que aconteceu com Linux → Red Hat → AWS, com Android → Samsung, com Git → GitHub. O código aberto define a categoria e prova o conceito; os players comerciais o transformam em produto para adoção em massa.
A pergunta que vale a pena ser feita para o ecossistema OpenClaw: a versão aberta e configurável mantém seu valor distinto à medida que as versões fechadas e refinadas melhoram? A resposta, historicamente, é sim — mas a proposta de valor precisa permanecer clara. "Controle total, qualquer infraestrutura, ecossistema extensível" é uma posição coerente. "Uma versão um pouco mais barata do Perplexity Computer com mais configuração" não é.

**US$ 200/mês com limites de crédito estabelece o que o mercado pode suportar.**
Esse é o preço atual para a versão mais refinada, de configuração zero e orquestrada por 19 modelos desta capacidade. Ela vem com 10.000 créditos incluídos — o uso não é ilimitado.
O TinyClaw implanta a mesma arquitetura multiagente subjacente em menos de um minuto, a um custo significativamente menor, com acesso a agendamento Cron, Webhooks, arquivos locais e a todo o ecossistema de Skills do OpenClaw. A proposta de
O mercado é real. A corrida pela infraestrutura começou. O OpenClaw foi o protótipo de código aberto que provou o conceito. O Perplexity Computer é uma das primeiras grandes apostas comerciais nele. Vem mais por aí.

---

## Referência Rápida

| | Perplexity Computer | OpenClaw + TinyClaw |
| --- | --- | --- |
| Preço | $200/mês (10 mil créditos incluídos) | Código aberto + preços do TinyClaw |
| Tempo de configuração | Segundos | Minutos a horas |
| Número de modelos | 19 (roteados automaticamente pelo Opus) | Configurável (qualquer provedor) |
| Limites de gastos | Baseado em créditos, por subagente | Baseado em tempo (`runTimeoutSeconds`) |
|---|---|---|
| Personalização | Baixa | Alta |
| Acesso a arquivos locais | Não | Sim |
| Cron / tarefas agendadas | Não | Sim |
| Recebimento por webhook | Não | Sim |
| Habilidades personalizadas / plugins | Não | Sim (ClawHub, agentskills.io) |
| Identidade de agente persistente | Não | Sim (`SOUL.md`) |
| Localização dos dados | Nuvem da Perplexity | Sua escolha |
| Trilha de auditoria completa | Não | Sim (`sessions_history`) |

---

## Recursos
- [Anúncio do Perplexity Computer](https://www.perplexity.ai/hub/blog/introducing-perplexity-computer)
- [Ars Technica: Perplexity anuncia o "Computer"](https://arstechnica.com/ai/2026/02/perplexity-announces-computer-an-ai-agent-that-assigns-work-to-other-ai-agents/)
- [agentputer.com](https://agentputer.com/) — hospedagem em nuvem 24/7 para o OpenClaw
- [tinyclaw.dev](https://tinyclaw.dev/) — implantação com um clique
- [docs.openclaw.ai](https://docs.openclaw.ai/) — documentação do OpenClaw
- [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) — repositório OpenClaw

---

*Fontes: blog da Perplexity · Ars Technica · TechCrunch · The Verge · gHacks · The Tech Outlook · Fev 2026*