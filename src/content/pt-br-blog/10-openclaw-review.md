---
title: "Testamos 5 Maneiras de Rodar um Agente OpenClaw. Veja o que Realmente Funciona."
description: "207 mil estrelas no GitHub significa que todo mundo quer experimentar. Mas as opções de implantação se multiplicaram mais rápido que a documentação. Passamos duas semanas rodando todas as principais opções — da auto-hospedagem à nuvem com um clique — para que você saiba o que esperar antes de se comprometer."
date: "2026-02-18"
author: "AgentPuter Lab"
readingTime: "16 min"
tags: ["OpenClaw", "Review", "AI Agent", "Deployment", "AgentPuter", "TinyClaw"]
featured: true
---

*Parte 10 da Série sobre Infraestrutura de Agentes*

---

O OpenClaw tem 207.000 estrelas no GitHub. Esse número continua subindo cerca de 2.000 por dia.

Isso significa que muitas pessoas estão de olho. E toda semana, um novo serviço de "implante o OpenClaw com um clique" aparece. Existe o EasyClaw — na verdade, cinco produtos diferentes usando esse nome. Existe o InstaClaw. Existe o OpenClaw Cloud, a versão hospedada oficial. Existem dois repositórios no GitHub completamente diferentes, ambos chamados TinyClaw. E há o original: a auto-hospedagem em seu próprio hardware, para o qual o projeto foi pensado desde o início.

O problema não é que existam opções demais. É que a maioria das análises não diz como é a experiência real depois que você passa da página inicial.

Então, nós testamos todos eles. Duas semanas, cinco configurações, tarefas reais. Isto foi o que descobrimos.

---

---

## O Que Testamos (e Como)

Cinco configurações:

1. **Mac Mini M4 auto-hospedado** — a configuração canônica
2. **VPS auto-hospedado** — servidor em nuvem Linux, somente SSH
3. **TinyClaw** — runtime em nuvem da AgentPuter, implantação com um clique
4. **OpenClaw Cloud** — a versão hospedada oficial, $9,99/mês
5. **EasyClaw.ai** — hospedagem gerenciada de três níveis ($5–$49/mês)

Para cada configuração, nós medimos:
- **Tempo até a primeira mensagem** (do zero até conversar com seu agente)
- **Confiabilidade** ao longo de 7 dias (tempo de atividade, mensagens perdidas, comportamento de reinicialização)
- **Completude de recursos** (o que realmente funciona vs. o que exige configuração extra)
- **Desempenho em tarefas reais** (triagem de e-mails, gerenciamento de agenda, pesquisa na web)
- **Custo mensal** com uso moderado (~2 horas de uso ativo diário)

O modelo utilizado foi o Claude Opus 4.6 em todos os testes, exceto quando um modelo diferente era a única opção. Todos os testes usaram o Telegram como o canal principal, pois é o mais estável em todas as plataformas.

---

---

## Opção 1: Mac Mini M4 auto-hospedado

**Tempo até a primeira mensagem:** 22 minutos  
**Uptime de 7 dias:** 100%  
**Custo mensal:** ~$35 (API) + $0 de hardware amortizado

Esta é a referência, e ela define um padrão elevado.

A instalação é um único comando — `openclaw onboard --install-daemon` — e o assistente guia você por cada etapa. O gargalo não é o software; é o gerenciamento de chaves de API e a configuração do bot do Telegram, que leva cerca de 10 minutos por si só se você nunca fez isso antes.

Uma vez em execução, a configuração do Mac Mini supera todas as opções de nuvem em alguns pontos específicos. A integração com o iMessage via BlueBubbles funciona, e nada mais se compara. O Voice Wake permite que você fale com seu agente em modo viva-voz através do aplicativo nativo do macOS — indisponível em qualquer implantação na nuvem. O acesso ao sistema de arquivos local significa que seu agente pode trabalhar com arquivos que nunca saem da sua máquina.

O arquivo SOUL.md é onde isso começa a parecer diferente de todo o resto. Não é um prompt de sistema. É um arquivo de identidade persistente que seu agente lê na inicialização todos os dias. Após uma semana adicionando informações a ele, o agente sabia minha agenda, meu estilo de comunicação, minhas preferências para respostas de e-mail, quais eventos do calendário eu considero opcionais. Essa acumulação de contexto não existe no nível da sessão — ela se acumula.

---

Um incômodo: a autenticação do iMessage via BlueBubbles é complicada e precisou de um novo login a cada 2–3 semanas nos testes. O comando `openclaw doctor` detecta isso antes que você perca um dia de mensagens, mas você precisa de fato executá-lo.

Se você tem um Mac Mini ou está disposto a comprar um, esta é a resposta. Nada mais chega perto do limite de funcionalidades.

---

---

## Opção 2: VPS Auto-hospedado (Linux)

**Tempo até a primeira mensagem:** 28 minutos  
**Uptime de 7 dias:** 100%  
**Custo mensal:** ~$35 (API) + $6 (VPS)

Para usuários de Linux e desenvolvedores que desejam acesso root, isso é equivalente à configuração do Mac Mini, menos o Voice Wake e o iMessage. A instalação é idêntica; a diferença é que você está mantendo um servidor em vez de um desktop.

A vantagem é o acesso remoto por padrão. Seu agente fica acessível, esteja seu laptop aberto ou não. O Tailscale Serve ou Funnel (a abordagem oficialmente recomendada) torna isso seguro sem expor a porta do Gateway diretamente.

A desvantagem é a sobrecarga de DevOps. Quando seu agente para de responder às 2 da manhã, você precisa acessar um servidor via SSH para verificar os logs. Se você se sente confortável com isso, esta é uma opção sólida. Se não for o caso, pule para as opções hospedadas.

Um ponto que vale a pena destacar: o sandboxing do Docker — que o OpenClaw recomenda para isolar o acesso ao shell do agente — adiciona uma latência perceptível em configurações de VPS. As respostas do chat são boas. Tarefas envolvendo operações de arquivo ou navegação na web levaram de 15 a 30 segundos a mais do que o equivalente no Mac Mini durante os testes. Se você não se preocupa com o isolamento de segurança do próprio agente, executar sem o Docker é mais rápido.

Mesmo limite do Mac Mini, mais flexibilidade, mais manutenção. Ideal para desenvolvedores que já gerenciam servidores e não estão procurando por mais uma coisa nova para aprender.

---

---

## Opção 3: TinyClaw

**Tempo até a primeira mensagem:** 48 segundos  
**Uptime de 7 dias:** ~99,9%  
**Custo mensal:** US$ 49,99/mês (modelo incluído)

O TinyClaw ([tinyclaw.dev](https://tinyclaw.dev)) é o runtime em nuvem da AgentPuter para o OpenClaw. Cada usuário recebe um contêiner isolado em vez de uma fatia de computação compartilhada. Na prática, isso significa que o tempo de resposta do seu agente não despenca quando centenas de outros usuários enviam mensagens ao mesmo tempo.

O onboarding foi o mais rápido de tudo que testamos — login com o Google, selecionar o Telegram, colar um token de bot, e a primeira mensagem chegou em 48 segundos. Ao longo de sete dias, houve uma janela de manutenção de cerca de 4 minutos que foi comunicada com antecedência.

Os tempos de resposta ficaram em média entre 6 e 8 segundos para consultas padrão, e se mantiveram nesse patamar. Essa é a vantagem prática de contêineres isolados sobre a computação compartilhada: não é mais rápido em condições ideais, mas consistente quando as condições não são ideais. A conexão de internet do seu Mac Mini em casa é uma variável; a de um contêiner na nuvem não é.

A instalação de Skills foi sólida. Das 12 Skills que testamos do ClawHub, 11 foram instaladas sem problemas. A única falha — uma integração com o Spotify que requer configuração de redirecionamento OAuth — precisaria de configuração manual em qualquer plataforma.

---

Sem ativação por voz, sem iMessage, sem sistema de arquivos local. Essas são limitações estruturais de implantação na nuvem, não específicas do TinyClaw. Se você precisar de algum deles, a auto-hospedagem é o único caminho.

A história por trás do AgentPuter é importante se você está pensando em expandir para além de um agente. A mesma infraestrutura suporta múltiplas instâncias do OpenClaw em uma única conta — agentes diferentes para contextos diferentes, ou acesso compartilhado entre membros da equipe. Isso não está no plano básico, mas está disponível se suas necessidades aumentarem.

---

---

## Opção 4: OpenClaw Cloud

**Tempo até a primeira mensagem:** 2 minutos e 10 segundos  
**Uptime de 7 dias:** ~98,4%  
**Custo mensal:** $0 (plano gratuito, 14 dias de computação/mês) ou $9,99/mês no plano Pro

O OpenClaw Cloud (open.claw.cloud) é a versão hospedada oficialmente recomendada. O principal diferencial é o plano gratuito: 14 dias de tempo de computação por mês, com tecnologia do Kimi K2.5. Observe que, quando testamos, o plano Pro de $9,99/mês ainda estava marcado como "Em Breve" — então, parte desta seção é baseada no plano gratuito, que era o que estava realmente disponível.

O plano gratuito é mais do que uma demonstração. Você obtém Skills pré-instaladas, integração com o Telegram, memória persistente, automação de navegador e sua própria máquina virtual dedicada. Quando seus 14 dias de computação gratuitos acabam, a VM é desligada, mas seus dados permanecem intactos. Ligue-a novamente quando tiver mais tempo livre ou quando o plano Pro for lançado.

O modelo Kimi K2.5 merece um comentário. Para a maioria das tarefas práticas — resumir e-mails, redigir respostas, gerenciar calendários — ele se saiu bem nos testes. A diferença em relação ao Claude Opus 4.6 apareceu em raciocínios complexos de múltiplos passos: "pesquise três concorrentes, compare seus preços e elabore uma recomendação" resultou em algo notavelmente mais coerente com o Claude. Dito isso, para quem executa fluxos de trabalho leves, a relação custo-benefício do Kimi K2.5 é difícil de contestar.

---

O processo de integração demora um pouco mais do que com o TinyClaw, pois a configuração é feita através de um painel web em vez de um assistente. Conectar o Telegram levou cerca de 2 minutos. O gerenciamento de habilidades é totalmente exposto, o que é bom se você sabe o que quer e confuso se não sabe.

O caminho mais barato para uma experiência OpenClaw real. A melhor opção se você quiser experimentar antes de assumir qualquer compromisso.

---

---

## Opção 5: EasyClaw.ai

**Tempo até a primeira mensagem:** 4 minutos  
**Uptime de 7 dias:** 99,1%  
**Custo mensal:** $19–$49 dependendo do plano

O recurso distintivo do EasyClaw.ai é o acesso ao desktop baseado em navegador — uma visão completa do ambiente de contêiner do seu agente em uma aba do navegador. Você pode fazer login em contas que exigem autenticação pelo navegador, instalar ferramentas, modificar arquivos de configuração. Coisas que as plataformas gerenciadas normalmente não permitem que você mexa.

Nós usamos isso para configurar uma integração com o Gmail que exige autenticação através de um fluxo de navegador — algo simples no EasyClaw, impossível em plataformas sem esse recurso.

Os planos de preços são de $5 (desenvolvedor, traga seu próprio VPS), $19 (gerenciado) e $49 (totalmente gerenciado com suporte de nível superior). Por $49/mês, você está perto do ponto em que um VPS autogerenciado faz mais sentido financeiramente, a menos que você realmente queira a manutenção sem intervenção.

Uma observação sobre o nome: "EasyClaw" está sendo usado por pelo menos cinco produtos diferentes de diferentes desenvolvedores — easyclaw.ai, easyclaw.app, easyclaw.pro e mais alguns. O que nós testamos é o easyclaw.ai. Pelo menos um dos outros serviços com nome parecido levantou questões de segurança na comunidade no início de fevereiro de 2026. Verifique se você está na URL correta antes de inserir credenciais em qualquer lugar.

---

---

## O Cenário das Variantes de Código Aberto

Além dos serviços hospedados, vale a pena conhecer os derivados de código aberto, embora sejam voltados para um público mais restrito.

**TinyClaw (versão jlia0)** é uma reimplementação do conceito do OpenClaw em aproximadamente 400 linhas de shell script — construído com Claude Code e tmux em vez de Node.js e um framework completo. Ele executa múltiplos agentes isolados em paralelo no Discord, WhatsApp e Telegram, coordenando-se através de filas de mensagens baseadas em arquivos que evitam condições de corrida. Cerca de 2.000 estrelas no GitHub em fevereiro de 2026, com a base de código pequena o suficiente para ser lida em uma tarde. Se você quer entender o que realmente está acontecendo por baixo dos panos, ou precisa incorporar um agente em um ambiente com restrições, essa é a forma mais direta de começar.

**TinyClaw (versão warengonzaga)** é um projeto totalmente diferente — uma reescrita em TypeScript que se posiciona explicitamente como "um produto completamente independente e uma alternativa ao OpenClaw". Ele enfatiza uma arquitetura de plugins, memória autoaperfeiçoável e roteamento inteligente de consultas para reduzir os custos de LLM. Menos focado na execução de tarefas, mais focado em ser um "companheiro pessoal de IA". Vale a pena acompanhar, mas ainda está no início.

Nenhum deles compete diretamente com os serviços hospedados. São ferramentas para desenvolvedores que querem entender e modificar o mecanismo subjacente.

---

---

## Tabela Comparativa

| | Mac Mini | VPS | TinyClaw | OpenClaw Cloud | EasyClaw.ai |
|---|---|---|---|---|---|
| **Tempo de configuração** | 22 min | 28 min | 48 seg | 2 min | 4 min |
| **Custo mensal** | $35 API | $41 | $49,99 | $0–$10 | $19–$49 |
| **Uptime em 7 dias** | 100% | 100% | ~99,9% | ~98,4% | ~99,1% |
| **Consistência da resposta** | Variável (dependente do ISP) | Alta | Alta | Alta | Alta |
| **iMessage** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Ativação por voz** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Soberania dos dados** | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| **Compatibilidade de skills** | 100% | 100% | ~92% | 100% | ~90% |
| **Ideal para** | Usuários avançados | Desenvolvedores | Usuários que priorizam a nuvem | Orçamento / nível gratuito | Desenvolvimento + gerenciado |

---

---

## O Que Faríamos na Prática

Se você nunca executou um agente antes: comece com o OpenClaw Cloud. O plano gratuito te dá 14 dias para descobrir se isso é algo que você realmente quer, sem gastar nada ou mexer em um terminal.

Assim que você souber que quer que ele funcione de forma confiável: o TinyClaw é o upgrade mais limpo. Contêineres isolados, desempenho consistente, integração mais rápida. Se, no futuro, você quiser múltiplos agentes ou acesso para equipes, a infraestrutura já está preparada para isso.

Se o ponto for a soberania de dados, ou se você precisa de Voice Wake, ou se o iMessage for importante: hospede você mesmo. O Mac Mini é a escolha de hardware óbvia — US$ 599, silencioso, 3–4W em modo ocioso, roda o macOS nativamente. Nenhuma opção em nuvem pode te dar o que o local-first faz.

Se você é um desenvolvedor que quer entender o mecanismo: leia o código do jlia0 TinyClaw antes de fazer qualquer outra coisa. 400 linhas de shell te dirão mais sobre o que está acontecendo do que qualquer documentação.

---

---

## A Avaliação Honesta

"Funcionando" e "útil" não são a mesma coisa. Toda opção que testamos estava funcionando dentro da primeira hora. Ser útil demorou mais — exigiu que o SOUL.md acumulasse contexto, exigiu conectar as ferramentas que você realmente usa e exigiu dar ao agente tarefas que importam em vez de prompts de demonstração. As opções hospedadas facilitam o começo. As opções auto-hospedadas dão a você mais com o que trabalhar depois que você passa do início.

O ecossistema de Skills é a maior questão em aberto. A empresa de segurança Koi Security auditou o ClawHub no início de fevereiro de 2026 e encontrou 341 Skills maliciosas de um total de 2.857 analisadas — cerca de 12% do catálogo, a maioria delas de uma única conta de invasor que publicou 314 Skills envenenadas em uma semana antes de ser descoberta. O OpenClaw desde então adicionou processos de revisão, mas o catálogo é grande demais para ser auditado manualmente. Trate as Skills da comunidade da mesma forma que você trataria as extensões de navegador: úteis, muitas vezes excelentes, e vale a pena dar uma olhada rápida no código-fonte antes de instalar qualquer coisa que peça acesso ao sistema.

207 mil estrelas no GitHub significa que algo deu certo. Saber se isso é o certo para você é a pergunta que leva uma semana para ser respondida, não uma landing page.

---

---

*Parte 10 da Série sobre Infraestrutura de Agentes. As publicações anteriores abordaram [arquitetura](/blog/dissecting-openclaw-architecture/), [ecossistema de habilidades](/blog/agent-skills-ecosystem/), [fluxos de trabalho empresariais](/blog/vibe-working-when-agents-work/), [uma análise aprofundada do ClawdBot](/blog/deep-dive-clawdbot-breakout-agent/), [modelos de negócio](/blog/who-makes-money-from-openclaw/), [o que significa quando seu criador se junta à OpenAI](/blog/openclaw-creator-joins-openai/) e [guias de implantação](/blog/09-deploy-openclaw/).*

*Referências:*
- [Repositório do OpenClaw no GitHub](https://github.com/openclaw/openclaw) (207 mil estrelas, v2026.2.17)
- [TinyClaw — Implantação do OpenClaw com Um Clique](https://tinyclaw.dev)
- [OpenClaw Cloud](https://open.claw.cloud)
- [EasyClaw.ai](https://www.easyclaw.ai)
- [TinyClaw (jlia0)](https://github.com/jlia0/tinyclaw)
- CVE-2026-25253 — Vulnerabilidade no Gateway do OpenClaw (referenciada em nossa análise de segurança)