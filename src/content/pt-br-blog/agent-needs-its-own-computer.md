---
title: "Na Véspera de uma Revolução de Software, Seu Agente Precisa do Próprio Computador"
description: "Agentes de IA são incrivelmente capazes — mas não têm um lar, um espaço de trabalho persistente, um computador próprio. O AgentPuter muda isso."
date: "2026-02-04"
author: "AgentPuter Lab"
readingTime: "15 min"
tags: ["Agente de IA", "AgentPuter", "Revolução de Software", "OpenClaw", "Claude"]
featured: true
---

## 1. Introdução: O Software Está Sendo Redefinido

Nos últimos quarenta anos, o paradigma de interação central do software nunca mudou de verdade: **Humanos operam software; software executa instruções.**

Seja na interface gráfica do Macintosh de 1984 ou no mais recente produto SaaS de 2024, a lógica subjacente é a mesma — humanos clicam em botões, preenchem formulários e arrastam arquivos; o software executa fielmente essas ações. O software é a ferramenta. Os humanos são os operadores.

Mas em 2024–2025, as coisas começaram a mudar.

O Computer Use do Claude da Anthropic permite que a IA opere um computador como um humano faria. O Operator da OpenAI permite que a IA navegue na web e complete tarefas de forma autônoma. Inúmeras startups estão construindo Agentes de IA, tentando fazer com que a IA realize trabalho real em nome dos humanos.

Um novo paradigma está emergindo: **Agentes operam software; humanos dão as instruções.**

Isso parece ótimo. Mas quando realmente tentamos fazer os agentes trabalharem para nós, um problema fundamental surge:

**Onde o Agente "vive" e "trabalha"?**

Ele não tem um computador próprio, nem área de trabalho, nem sistema de arquivos. Toda vez que uma conversa termina, ele "desaparece". Na próxima vez, ele começa do zero.

Este artigo explora a resposta para essa pergunta: **Seu Agente precisa de um computador próprio — um AgentPuter.**

---

## 2. Sinais Recentes: A Revolução Já Começou

Antes de discutirmos soluções, vamos ver o que já está acontecendo. Três eventos recentes ilustram claramente o cenário dessa transformação.

### 2.1 O "Crash do Claude": Quando a IA Devora o Software

Ainda esta semana (fevereiro de 2026), as ações da **Thomson Reuters** despencaram 22% no que Wall Street está chamando de "Crash do Claude".

O gatilho? O lançamento discreto pela Anthropic de um módulo jurídico para o Claude. O mercado percebeu que a aquisição de US$ 650 milhões da CoCounsel pela Thomson Reuters — essencialmente um wrapper de IA em torno de seu banco de dados — era indefensável contra um modelo de fundação que podia ler e analisar jurisprudência diretamente.

Isso segue o colapso da **Robin AI**, que já foi uma queridinha da tecnologia jurídica. Após levantar uma Série B de US$ 26 milhões, ela não conseguiu garantir financiamento subsequente e foi listada para venda por dificuldades financeiras no final de 2025. A lição? Os usuários não pagarão por "recursos de IA" salpicados sobre fluxos de trabalho legados quando podem ir direto à fonte.

### 2.2 Claude Invade o Excel

Em outubro de 2025, a Anthropic lançou o **Claude para Excel**, declarando guerra ao Microsoft Copilot.

Este não era um simples "assistente de IA". Profissionais de finanças podiam conversar diretamente com o Claude na barra lateral do Excel — analisando, modificando e até construindo planilhas inteiras do zero. Faça uma pergunta em linguagem natural e o Claude retorna respostas com referências no nível da célula. Fórmula quebrada? O Claude a depura. Quer testar um cenário financeiro? Descreva-o, e o Claude constrói o modelo.

Mais criticamente, a Anthropic conectou simultaneamente 7 provedores de dados de mercado em tempo real — Aiera, Chronograph, Egnyte e outros. Isso significa que o Claude não apenas opera o Excel; ele pode acessar diretamente dados financeiros ao vivo.

**Sinal chave:** A IA não se contenta mais em ser uma "ajudante". Ela quer entrar no fluxo de trabalho principal do usuário e se tornar o principal motor.

### 2.3 A Ascensão do OpenClaw: Assistentes Pessoais Locais se Tornam Virais

Em total contraste com as dificuldades das empresas de software tradicionais, um projeto de código aberto tem crescido explosivamente.

**OpenClaw** (anteriormente Clawdbot/Moltbot), uma plataforma de assistente de IA privado executada localmente, acumulou **174 mil estrelas no GitHub e mais de 28 mil Forks** no início de 2026 — ganhando mais de 145 mil estrelas com 2 milhões de visitantes apenas na primeira semana. A CNBC o descreveu como "gerando burburinho e medo globalmente".

O que é o OpenClaw? Simplificando, ele permite que você execute um assistente de IA privado em seu próprio hardware — Mac mini, servidor Linux, Raspberry Pi ou até mesmo um VPS. Você envia mensagens via Telegram, WhatsApp, Discord ou iMessage, e ele executa **tarefas reais** — não apenas conversando, mas de fato realizando coisas.

O que ele pode fazer?
- **Gerenciar finanças:** Categorizar transações automaticamente usando `hledger`.
- **Acompanhar tarefas:** Sincronizar issues do Linear com tarefas pessoais.
- **Operações de servidor:** Gerenciar configurações do NixOS via SSH.
- **Mídia:** Solicitar filmes automaticamente no Jellyseerr.

Os usuários criam **Skills** personalizadas — simples arquivos Markdown — que ensinam o agente a usar novas ferramentas.

**Sinal chave:** Os usuários não precisam de "software melhor". Eles precisam de **um agente que faça o trabalho por eles**. O OpenClaw provou isso — e é de código aberto, rodando no próprio hardware do usuário.

---

## 3. Uma Breve História: Três Eras do Software

Para entender o que o AgentPuter significa, precisamos revisitar a evolução do software.

### 3.1 A Era do Software Local (1980s–2000s)

Software instalado localmente. Dados armazenados localmente.

Você comprava um CD, instalava o Microsoft Office no seu PC. Os documentos viviam no seu disco rígido — mude para outro computador e você não podia acessá-los. O software era um "produto". Você pagava uma vez, você o possuía.

Representantes: Microsoft Office, Adobe Photoshop, AutoCAD.

**Característica definidora:** Poderoso, mas isolado. Seus dados estavam presos dentro de uma única máquina.

### 3.2 A Era do SaaS na Nuvem (2000s–2020s)

O software rodava na nuvem. O navegador era o portal.

Nenhuma instalação necessária — apenas abra um navegador. Os dados viviam em servidores; mude de computador e tudo ainda estava lá. O software se tornou um "serviço". Você pagava mensalmente; ele estava sempre disponível.

Representantes: Google Docs, Figma, Notion, Slack.

**Característica definidora:** Conveniente, mas dependente da rede. Seus dados viviam nos servidores de outra pessoa.

### 3.3 A Era Nativa da IA (2020s–?)

Software projetado para IA. O Agente é o usuário principal.

Esta é a era em que estamos entrando. O software não é mais apenas uma ferramenta esperando pela operação humana — é uma capacidade que os agentes podem invocar diretamente. Os humanos passam de "operadores" para "comandantes".

O produto definidor desta era é... ?

Essa é exatamente a pergunta que o AgentPuter visa responder.

---

## 4. O Dilema do Agente: Capaz, mas Sem-Teto

Os Agentes de IA de hoje são incrivelmente capazes.

### 4.1 O que os Agentes Podem Fazer?

- **Entender instruções em linguagem natural:** Diga o que fazer em linguagem simples, e ele entende.
- **Decompor tarefas complexas:** Dada uma grande tarefa, ele a divide em etapas menores e as executa uma a uma.
- **Usar ferramentas para realizar o trabalho:** Pesquisar na web, ler/escrever arquivos, chamar APIs, operar software.
- **Tomar decisões autônomas e se autocorrigir:** Quando encontra um problema, ele encontra uma maneira de contorná-lo sem precisar de ajuda constante.

Em termos de capacidade bruta, um agente já pode funcionar como um funcionário júnior. Mas aqui está o problema —

### 4.2 O que Falta aos Agentes?

**Sem "corpo".** Os agentes só podem interagir com o software através de APIs ou screenshots. Eles não têm mouse, nem teclado, nem tela própria. Para operar um software, ou o software oferece uma API (a maioria não oferece), ou o agente tem que tirar um screenshot, analisá-lo, decidir onde clicar, executar o clique, tirar outro screenshot... Uma única ação leva segundos. E é frágil — a menor mudança na UI pode causar um clique errado.

**Sem "lar".** Toda conversa começa do zero. Os arquivos que ele organizou para você da última vez? Sumiram. O relatório de pesquisa que ele estava na metade? Perdido. Os agentes não têm ambiente persistente — nem "área de trabalho", nem "pastas".

**Sem "bancada de trabalho".** O software existente é projetado para humanos — UIs bonitas, interações complexas, feedback visual rico. Mas os agentes não precisam de nada disso. Eles precisam de interfaces limpas, estado estável e comportamento previsível. O que é "amigável ao usuário" para um humano e o que é "amigável ao usuário" para um agente são duas coisas muito diferentes.

### 4.3 O Status Quo Inconveniente

As soluções convencionais atuais têm limitações óbvias:

**Computer Use (screenshot + clique):** Deixar o agente ver a tela e clicar no mouse, como um humano. Parece universal, mas é extremamente ineficiente — capturar um screenshot, analisá-lo, decidir onde clicar, executar o clique, capturar outro screenshot para ver o resultado... Uma ação simples leva vários segundos. E é propenso a erros — qualquer pequena mudança na UI pode causar erros.

**MCP / Function Calling:** Dar ao agente uma API para chamar. Eficiente, mas com cobertura limitada — só funciona se o fornecedor do software fornecer uma interface. A maioria não fornece, ou a interface é muito restrita.

**Modelo de plugin:** O agente existe como um "plugin" dentro do software. Mas então o agente é um "convidado" e o software é o "anfitrião". O que o agente pode fazer está totalmente à mercê do software.

O problema comum em todas essas abordagens: **O agente está sempre vivendo sob o teto de outra pessoa.** Ele não tem território próprio, nem soberania.

---

## 5. AgentPuter: Um Computador Dedicado para o Seu Agente

Se o Agente precisa de um lar, vamos construir um para ele.

### 5.1 O que é o AgentPuter?

AgentPuter é um ambiente de computação projetado para agentes.

Neste ambiente, **o Agente é um cidadão de primeira classe.** Software, arquivos e interfaces são todos projetados para o agente. Os humanos são observadores e comandantes — você diz ao agente o que fazer, observa-o trabalhar e intervém quando necessário.

Não se trata de simular operações humanas (como o Computer Use). Trata-se de **suportar nativamente as operações do agente.** O agente não precisa "olhar para uma tela" porque não há tela. Ele não precisa "clicar em um mouse" porque chama as interfaces diretamente.

### 5.2 Filosofia Central

| Software Tradicional | AgentPuter |
|----------------------|------------|
| UI projetada para humanos | API projetada para agentes + UI para observação humana |
| Humanos clicam para operar | Agentes chamam interfaces diretamente |
| Arquivos armazenados localmente ou na nuvem | Arquivos no espaço de trabalho dedicado do agente |
| Conversas únicas | Espaço de trabalho persistente do agente |

**Em uma frase:** O software tradicional é uma ferramenta para humanos. O AgentPuter é um computador para agentes.

### 5.3 Propostas de Valor Centrais

O AgentPuter é mais do que uma lista de recursos. Ele desempenha cinco papéis-chave na cadeia de valor:

**1. Proxy de Privacidade (O Firewall)**
Este é o valor mais importante do AgentPuter para os usuários. Você não colaria suas credenciais bancárias no ChatGPT, mas pode confiar em um AgentPuter rodando localmente. Ele atua como um middleware entre o usuário e os LLMs — higienizando dados, gerenciando autorizações e garantindo que a **propriedade dos dados** permaneça nas mãos do usuário.

**2. Gerenciador de Contexto (A Memória)**
LLMs são amnésicos; o AgentPuter tem uma memória longa. Ele converte seus fluxos de trabalho de longa duração, preferências pessoais e histórico de arquivos em memória estruturada de longo prazo. Ao interagir com um LLM, ele extrai apenas o contexto relevante para a tarefa atual — economizando custos caros de token enquanto melhora a precisão.

**3. Interface Unificada (O Adaptador)**
Cada capacidade no AgentPuter — do processamento de documentos ao e-mail — é encapsulada como uma Tool padronizada que os agentes podem invocar nativamente. Ele abstrai a complexidade das APIs subjacentes, permitindo que os agentes chamem capacidades tão naturalmente quanto um humano usa um mouse.

**4. Espaço de Trabalho Persistente (A Mesa)**
O agente tem sua própria "área de trabalho". Arquivos inacabados, materiais de pesquisa coletados, produtos de trabalho intermediários — tudo é salvo. A próxima sessão continua de onde a última parou.

**5. Caixa-Preta de Responsabilidade (O Registro)**
Os humanos podem ver o que o agente está fazendo a qualquer momento. O AgentPuter registra cada cadeia de decisão e operação. Quando o agente realiza uma ação sensível (por exemplo, excluir um arquivo, enviar dinheiro), o sistema pausa automaticamente e solicita confirmação humana (Human-in-the-loop).

### 5.4 Lições do OpenClaw

A explosão do OpenClaw valida a tese do AgentPuter. Mas também revela lacunas — exatamente onde o AgentPuter pode fazer melhor:

| O que o OpenClaw Alcançou | Onde o AgentPuter Vai Além |
|---------------------------|--------------------------------|
| Roda localmente, preservando a privacidade | Também local-first, mas mais fácil de implantar (não requer conhecimento técnico) |
| Skills personalizadas via arquivos Markdown | Marketplace de Skills mais rico com orquestração visual |
| Acionado via aplicativos de mensagens | Múltiplas entradas: mensagens, voz, app de desktop, atalhos |
| Amigável para desenvolvedores | **Acessível a usuários não técnicos** |
| Agente único | Colaboração multi-agente |

O OpenClaw provou que a demanda existe. A missão do AgentPuter é **tornar essa capacidade acessível a todos.**

---

## 6. Casos de Uso

O AgentPuter não é uma abstração. Veja como ele funciona na prática.

### 6.1 Trabalho de Escritório

**Tradicional:** Você abre o Word para escrever um documento, o Excel para fazer uma planilha, o Outlook para enviar e-mail. Cada aplicativo requer sua operação manual.

**Abordagem do Claude Excel:** Você usa um assistente de IA dentro do Excel para analisar dados. Mas todo o resto? Ainda manual.

**Abordagem do AgentPuter:** Você diz ao agente: "Compile os dados de vendas da semana passada em um relatório e envie para o meu gerente." O agente puxa os dados, executa a análise, escreve o relatório, formata-o e envia o e-mail. Você apenas revisa o resultado final.

A diferença: O Claude Excel é "IA entrando no software". O AgentPuter é "software projetado em torno do agente". O primeiro é uma melhoria; o último é uma mudança de paradigma.

### 6.2 Pesquisa

**Tradicional:** Abrir dezenas de abas no navegador, copiar e colar em um aplicativo de anotações, organizar e sintetizar manualmente.

**Abordagem do AgentPuter:** Você diz "Pesquise as tendências do mercado de veículos elétricos para 2025." O agente pesquisa autonomamente, lê artigos, extrai pontos-chave e produz um relatório. Ele tem seu próprio "caderno de pesquisa" — tanto o processo quanto os resultados são salvos, prontos para acompanhamento.

### 6.3 Desenvolvimento

**Tradicional:** Você escreve código, executa testes, corrige bugs, faz o deploy. Cada passo requer sua atenção.

**Abordagem do AgentPuter:** O agente tem seu próprio ambiente de desenvolvimento e repositório de código. Você descreve os requisitos; ele escreve o código, executa testes e corrige bugs. Ele pergunta quando fica preso, mas lida com a maior parte do trabalho de forma independente.

### 6.4 Trabalho Criativo

**Tradicional:** Arrastar e soltar no Figma, ajustar camadas no Photoshop, pixel por pixel.

**Abordagem do AgentPuter:** O agente tem sua própria "tela" e "biblioteca de ativos". Você descreve o resultado desejado; ele gera um primeiro rascunho, itera e salva versões. Você atua como o diretor criativo; o agente atua como o designer.

---

## 7. AgentPuter vs. Abordagens Existentes

| Dimensão | Computer Use | MCP / Plugins | Claude Excel | OpenClaw | AgentPuter |
|-----------|-------------|---------------|-------------|----------|-----------|
| Interação | Screenshot + clique | Chamadas de API | Chat na barra lateral | Gatilho por mensagem | Interface nativa de agente |
| Eficiência | Baixa | Média | Média-alta | Alta | Alta |
| Persistência | Nenhuma | Limitada | Limitada | Sim (local) | Espaço de trabalho completo |
| Visibilidade humana | Visível mas difícil de entender | Não visível | Visível | Parcialmente visível | Visível e compreensível |
| Cobertura | Teoricamente universal | Dependente do fornecedor | Apenas Excel | Extensível via Skills | Construído para agentes |
| Implantação | Nuvem | Nuvem | Nuvem | No dispositivo | Local-first |
| Barreira de usuário | Baixa | Média | Baixa | Alta (técnica) | Baixa |

**Resumo:**

- **Computer Use** é a alternativa universal, mas ineficiente
- **MCP / Plugins** dependem da abertura dos fornecedores, com cobertura limitada
- **Claude Excel** é um avanço poderoso em um único ponto, mas apenas para o Excel
- **OpenClaw** tem a direção certa, mas a barreira de entrada é muito alta
- **AgentPuter** combina a filosofia do OpenClaw com o objetivo de acessibilidade

---

## 8. Arquitetura Técnica

### 8.1 Arquitetura Geral: O Hub da Cadeia de Valor

A arquitetura do AgentPuter não é apenas um design em camadas — é um **middleware conectando a intenção humana difusa à saída digital determinística.** Ele abstrai detalhes complexos de API e ambiente para baixo, e apresenta interfaces de interação simples e naturais para cima.

<img src="/blog/agentputer-architecture.webp" alt="Arquitetura do AgentPuter" width="4096" height="2816" loading="lazy" decoding="async" />

**Camada de Entrada do Usuário:** Suporta múltiplas maneiras de acionar seu agente — aplicativos de mensagens (Telegram, WhatsApp, iMessage), assistentes de voz, aplicativos de desktop, atalhos do sistema e chamadas diretas de API.

**Camada de Orquestração:** O "cérebro" do AgentPuter. Após receber a intenção do usuário, ele planeja a tarefa, a decompõe em etapas executáveis, despacha módulos de capacidade e gerencia o estado geral.

**Camada de Execução:** Módulos de capacidade concretos, incluindo processamento de documentos, planilhas, e-mail, acesso à web, execução de código, gerenciamento de calendário, operações de arquivo e APIs de terceiros. Também suporta um **Mercado de Skills**.

**Camada de Persistência:** A "memória" do agente — sistema de arquivos, banco de dados de estado e banco de dados vetorial. Tudo criptografado e local-first.

### 8.2 Sistema de Persistência de Autenticação

A chave para resolver o problema de "reautorizar toda vez que você reinicia".

<img src="/blog/auth-persistence-system.webp" alt="Sistema de Persistência de Autenticação" width="1557" height="1542" loading="lazy" decoding="async" />

- **Armazenamento seguro:** Todas as credenciais armazenadas de forma criptografada, nunca em texto plano
- **Renovação automática:** Suporta o mecanismo de Refresh Token do OAuth 2.0; tokens são renovados automaticamente antes de expirarem
- **Verificações de saúde:** Verifica periodicamente o status da autenticação, notifica o usuário sobre problemas proativamente
- **Privilégio mínimo:** Solicita apenas as permissões necessárias para a tarefa

### 8.3 Motor de Compreensão de Estrutura de Documentos

Permite que os agentes realmente "entendam" documentos — não apenas os tratem como texto bruto.

<img src="/blog/document-understanding-engine.webp" alt="Motor de Compreensão de Estrutura de Documentos" width="1560" height="1350" loading="lazy" decoding="async" />

- **Análise estrutural:** Reconhece hierarquia de títulos, limites de parágrafos, estruturas de lista
- **Compreensão de tabelas:** Identifica cabeçalhos, linhas de dados e células mescladas
- **Consciência de estilo:** Entende estilos semânticos como "Título 1", "Corpo" e "Citação"
- **Edição incremental:** Modifica documentos preservando a formatação e estrutura originais

### 8.4 Sistema de Reversão de Operações

Garante que as operações do agente sejam reversíveis — os usuários sempre podem "desfazer".

<img src="/blog/operation-rollback-system.webp" alt="Sistema de Reversão de Operações" width="1560" height="1350" loading="lazy" decoding="async" />

- **Registro de operações:** Grava informações detalhadas para cada ação
- **Snapshots de estado:** Salva snapshots completos do estado em pontos-chave
- **Reversão seletiva:** Pode reverter para qualquer estado histórico
- **Proteção de ações irreversíveis:** Ações como enviar e-mails ou chamadas de API exigem confirmação

### 8.5 Estrutura de Colaboração Multi-Agente

Suporta múltiplos agentes colaborando no mesmo espaço de trabalho em tarefas complexas.

<img src="/blog/multi-agent-collaboration.webp" alt="Estrutura de Colaboração Multi-Agente" width="2400" height="1860" loading="lazy" decoding="async" />

- **Especialização de papéis:** Diferentes agentes lidam com diferentes tipos de tarefas
- **Contexto compartilhado:** Resultados intermediários passados através de um espaço de trabalho compartilhado
- **Comunicação baseada em mensagens:** Agentes coordenam via filas de mensagens
- **Resolução de conflitos:** Mecanismos de bloqueio e fusão quando múltiplos agentes modificam o mesmo recurso

### 8.6 Implantação: Local-First + Nuvem Opcional

<img src="/blog/deployment-architecture.webp" alt="Arquitetura de Implantação" width="2457" height="1815" loading="lazy" decoding="async" />

**Local-first:** Por padrão, o AgentPuter roda localmente no dispositivo do usuário. Os dados nunca saem do controle do usuário.

**Nuvem opcional:** Os usuários podem habilitar um Cloud Pod para operação 24/7, sincronização entre dispositivos e descarregamento de computação pesada.

---

## 9. Olhando para o Futuro: A Forma Futura do Software

**Todos terão sua própria equipe de agentes.** Não um agente — muitos. Alguns se destacam na escrita, outros na análise de dados, outros ainda no design. Eles colaboram dentro do seu AgentPuter, lidando com todos os tipos de tarefas.

**O software se torna a "habilidade" do agente.** O Office não é mais um aplicativo que você usa — é uma capacidade que seu agente possui. "Meu agente sabe Excel" — tão natural quanto "meu funcionário sabe Excel".

**Os humanos passam de operadores a comandantes.** Você não precisa mais saber como escrever um VLOOKUP no Excel. Você só precisa saber qual resultado deseja.

> Os usuários não precisam de "software de escritório melhor". Eles precisam de **um agente que possa concluir seu trabalho** — e esse agente precisa de um computador próprio.
>
> Nossa missão: **Dar a todos o seu próprio AgentPuter, para que os Agentes de IA possam realmente trabalhar 24/7 em seu nome.**

---

## 10. Conclusão: De Operador a Comandante

Na véspera da revolução do software, a maior oportunidade é redefinir a interação humano-computador.

Na era do PC, os humanos eram Operadores. Nós éramos a CPU. Quando nos cansávamos, o trabalho parava.
Na era da IA, os humanos devem ser Comandantes. Os agentes são a força de trabalho digital. **O AgentPuter é a fábrica 24/7.**

AgentPuter não é apenas o nome de um produto. É um novo modelo mental:

`Humano (CEO) → AgentPuter (Fábrica Digital) → Produto do Trabalho (Entrega)`

O colapso das ações de tecnologia jurídica. A invasão do Claude no Excel. A explosão do OpenClaw. Esses três eventos nos dizem: a revolução começou. Seu agente merece um computador próprio.

---

## Referências e Leitura Adicional

- [Anthropic rolls out Claude AI for finance, integrates with Excel](https://venturebeat.com/technology/anthropic-rolls-out-claude-ai-for-finance-integrates-with-excel-to-rival) (VentureBeat, Out 2025)
- [Is the Collapse of Robin.AI a Sign of a Legal Tech AI Bubble?](https://www.geeklawblog.com/2025/11/is-the-collapse-of-robin-ai-a-one-off-or-a-sign-of-a-legal-tech-ai-bubble.html) (GeekLawBlog, Nov 2025)
- [From Clawdbot to OpenClaw: Meet the AI agent generating buzz and fear globally](https://cnbc.com/2026/02/02/openclaw-open-source-ai-agent-rise-controversy-clawdbot-moltbot-moltbook.html) (CNBC, Fev 2026)
- [Thomson Reuters shares fall 30%+ amid AI product questions](https://www.businessinsider.com/thomson-reuters-legal-tech-ai-chatgpt-test-2025-11) (Business Insider, Nov 2025)