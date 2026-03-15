---
title: "Vibe Working: Quando o \"Apenas Diga ao Agente\" Realmente Funciona"
description: "A IA empresarial economiza 1,5 horas por dia para os analistas — no entanto, o melhor Agente ainda falha em 53% das tarefas de escritório multi-aplicativos. A lacuna entre a economia de tempo em um único aplicativo e a automação de ponta a ponta é onde reside a verdadeira oportunidade."
date: "2026-02-12"
author: "AgentPuter Lab"
readingTime: "12 min"
tags: ["Vibe Working", "Habilidades de Escritório", "AgentPuter", "Produtividade", "Agente de IA"]
featured: true
---

Em nossos três posts anteriores, traçamos um único fio condutor: do OpenClaw como produto → à sua arquitetura Cérebro-Corpo-Alma → à pilha de capacidades Habilidades + Gateway + MCP subjacente.

Continuamos dizendo que "Habilidades transformarão o trabalho diário". É hora de mostrar como isso realmente se parece.

---

## I. A Microsoft Chamou Isso de "Vibe Working"

Em 29 de setembro de 2025, a Microsoft lançou dois recursos no Microsoft 365 Copilot e deu a eles um nome: **Vibe Working**.

O **Modo Agente** chegou ao Excel e ao Word. Você digita um prompt — *"Crie uma calculadora de amortização de empréstimo com detalhamento dos pagamentos mensais"* — e o Agente não apenas cospe uma fórmula. Ele cria planilhas, escreve fórmulas, gera gráficos, valida resultados, identifica erros, corrige-os e itera até que a saída seja verificada. Multi-etapas. Auto-corretivo.

O **Agente de Escritório** chegou à barra lateral de bate-papo do Copilot. Você diz *"Faça uma apresentação pronta para o conselho a partir destes dados trimestrais"* e ele produz um PowerPoint refinado. Não um modelo com texto de espaço reservado — um deck real com seus números, formatado, pronto para apresentar.

O nome remonta a Andrej Karpathy. Em 2 de fevereiro de 2025, o membro fundador da OpenAI tuitou: *"Existe um novo tipo de codificação que chamo de 'vibe coding', onde você se entrega totalmente às vibes, abraça os exponenciais e esquece que o código sequer existe."* Sete meses depois, a Microsoft pegou essa ideia do código e aplicou a planilhas, documentos e slides: **você fornece a intenção, o Agente entrega o artefato.**

Chega de lutar com a sintaxe VLOOKUP. Chega de formatar manualmente 47 slides. Chega de copiar números entre três planilhas e um documento do Word.

Pelo menos, essa é a promessa. O próprio **SpreadsheetBench** da Microsoft mostra o Modo Agente no Excel atingindo **57,2% de precisão** em tarefas complexas. Melhor do que manual para alguns usuários — mas longe de ser confiável.

---

## II. A Promessa vs a Realidade

Aqui está o que a pesquisa realmente diz.

Benchmarks para automação de escritório — como o **SpreadsheetBench** — testaram os principais modelos em fluxos de trabalho realistas: filtragem de conjuntos de dados, referências cruzadas de tabelas e produção de análises resumidas. Tarefas que um funcionário de escritório competente lida diariamente sem pensar duas vezes.

**Mesmo os melhores sistemas falham em quase metade das vezes.** A conclusão dos pesquisadores é direta: o desempenho ainda está "muito abaixo dos padrões de precisão humana exigidos pelos fluxos de trabalho de escritório do mundo real".

Os modos de falha são instrutivos:

- **Redundância de operação** — o Agente repete a mesma ação três vezes seguidas, desperdiçando tokens e, às vezes, corrompendo sua própria saída.
- **Referências alucinadas** — ele edita com confiança a célula B14 em uma planilha que tem apenas 10 linhas.
- **Falhas de troca de aplicativos** — mover dados do Excel para o Word para o Email quebra o contexto com mais frequência do que não.
- **Desvio de longo horizonte** — em tarefas com mais de 10 etapas, o Agente gradualmente esquece o que estava tentando realizar.

Mas aqui está o que a maioria das pessoas perde sobre essas falhas. A própria AI Red Team da Microsoft publicou uma taxonomia de modos de falha em sistemas agentic, e a descoberta mais assustadora não é a alucinação — é **a erosão da supervisão humana**.

Quando o Agente gera uma planilha que *parece* certa, os usuários param de verificar as fórmulas. Quando ele redige um e-mail que *soa* certo, os usuários clicam em enviar sem ler. O risco real não é que o Agente erre. É que o humano para de perceber.

Esta é a tensão central no Vibe Working: quanto mais capaz o Agente se torna, mais perigoso é confiar nele sem proteções.

---

## III. Quatro Cenários: Antes e Depois

Antes de mergulhar em nosso próprio trabalho, algum contexto sobre o que já foi medido no mundo real.

Um **estudo de campo do NBER** (condicionalmente aceito no *American Economic Review: Insights*) rastreou **7.137 trabalhadores do conhecimento** em 66 empresas ao longo de seis meses. Os trabalhadores que usam ferramentas de IA integradas gastaram **25–31% menos tempo com e-mail** — aproximadamente duas a três horas a menos por semana.

- Os analistas financeiros do **Morgan Stanley** economizaram **1,5 horas por dia** na pesquisa e preparação de relatórios.
- A **Repsol** executou um piloto do Copilot e descobriu que os funcionários economizaram **121 minutos por semana** em média, com a qualidade da produção melhorando 16,2%.
- A **World Wide Technology** implantou o Copilot para 941 usuários e mediu **446 horas economizadas por semana** — principalmente em resumos de reuniões, rascunhos de e-mail e geração de relatórios.

Esses números são reais. Mas a descoberta enterrada do estudo do NBER é igualmente importante: apesar de economizar horas em e-mail, **não houve mudança significativa na quantidade ou composição das tarefas gerais dos trabalhadores**. Os trabalhadores podiam acelerar as coisas que controlavam individualmente — mas não podiam mudar os fluxos de trabalho que exigiam coordenação com outros. A IA acelerou as células; não religou o organismo.

Essa é a principal percepção. As ferramentas atuais economizam tempo em tarefas *individuais* dentro de *um* aplicativo. A parte difícil — a parte onde a precisão cai para ~50% — é quando o Agente precisa encadear tarefas em vários aplicativos e entregar um artefato completo.

É aí que entra a orquestração baseada em Habilidades. Aqui está o que temos construído e testado.

### Cenário 1: Relatório Trimestral de Vendas

**Antes:** Você abre três exportações CSV do CRM. Você os cola no Excel. Você gasta 40 minutos construindo tabelas dinâmicas, escrevendo fórmulas SUMIFS, formatando cores condicionais e criando gráficos. Em seguida, você copia os gráficos para um documento do Word, escreve comentários sobre eles e envia por e-mail para seu gerente. Total: ~2 horas.

**Depois:** Você diz ao Agente: *"Extraia os dados de vendas do 4º trimestre, divida-os por região e linha de produto, sinalize qualquer coisa que tenha caído mais de 15% trimestre a trimestre e me dê um relatório com gráficos."*

O que acontece nos bastidores:
- Uma **Habilidade de Relatório de Vendas** é ativada — ela conhece a estrutura padrão do relatório, quais métricas importam e como sinalizar anomalias.
- A Habilidade orquestra **ferramentas MCP**: uma se conecta ao banco de dados CRM, outra grava no Excel, outra gera o documento do Word.
- O **Gateway** gerencia a sessão — se a consulta CRM levar 30 segundos, ela não expira; se a gravação do Excel falhar, ela tenta novamente.
- Você recebe de volta uma planilha do Excel formatada e um resumo do Word. Total: ~3 minutos do seu tempo.

O Agente não improvisou. Ele seguiu uma receita — uma que codifica como sua empresa estrutura seus relatórios trimestrais.

### Cenário 2: Notas de Reunião

**Antes:** Você participa de uma reunião de 45 minutos. Você rabisca anotações. Depois, você gasta 20 minutos digitando-as, organizando por tópico, identificando itens de ação e enviando-as aos participantes. Metade das vezes você perde alguma coisa e tem que verificar a gravação.

**Depois:** Você diz: *"Transcreva a sincronização do produto de ontem, organize por tópico, extraia itens de ação com proprietários e prazos e envie o resumo para todos os que compareceram."*

Nos bastidores:
- Uma **Habilidade de Notas de Reunião** é ativada — ela sabe a diferença entre uma decisão, um item de ação e uma discussão de fundo.
- **Ferramentas MCP** lidam com a transcrição (API Whisper), pesquisa de calendário (quem compareceu) e envio de e-mail.
- A Habilidade aplica o formato preferido da sua equipe — não um modelo genérico, mas a estrutura real que sua equipe usa.

A saída é um documento que parece que um humano escreveu, porque a Habilidade foi treinada em como sua equipe escreve notas de reunião.

### Cenário 3: Revisão de Risco de Contrato

**Antes:** O departamento jurídico envia a você um contrato de fornecedor de 30 páginas. Você lê. Você destaca as cláusulas que parecem incomuns. Você faz referência cruzada com os termos padrão da sua empresa. Você escreve um resumo de risco. Isso leva a maior parte de uma tarde.

**Depois:** Você diz: *"Revise este contrato de fornecedor em relação aos nossos termos padrão. Sinalize desvios, classifique cada um por nível de risco e me dê um resumo que eu possa enviar ao departamento jurídico."*

Nos bastidores:
- Uma **Habilidade de Revisão de Contrato** é ativada — ela conhece os termos padrão da sua empresa, padrões de risco comuns e como sua equipe jurídica prefere as classificações de risco.
- **Ferramentas MCP** lidam com análise de PDF, extração de texto e comparação estruturada.
- O Gateway impõe controles de acesso — os dados do contrato permanecem dentro do tempo de execução seguro, nunca saem da sandbox.

Você recebe um relatório de risco estruturado em 4 minutos. O departamento jurídico ainda faz a revisão final — o Agente não substitui os advogados, ele substitui as 3 horas de leitura e destaque que precedem o julgamento jurídico real.

### Cenário 4: Triagem de E-mail

**Antes:** Segunda-feira de manhã. 127 e-mails não lidos. Você gasta 45 minutos examinando as linhas de assunto, abrindo mensagens, categorizando mentalmente (urgente / FYI / precisa de resposta / spam) e redigindo respostas. Quando você termina, três novos e-mails urgentes chegaram.

**Depois:** Você diz: *"Faça a triagem da minha caixa de entrada. Sinalize qualquer coisa urgente de subordinados diretos ou clientes. Redija respostas para qualquer coisa que precise apenas de reconhecimento. Resuma o resto em três tópicos."*

Nos bastidores:
- Uma **Habilidade de Triagem de E-mail** é ativada — ela sabe quem são seus subordinados diretos, quais clientes são prioritários e o que "urgente" significa em seu contexto.
- **Ferramentas MCP** se conectam ao seu provedor de e-mail, extraem mensagens e redigem respostas.
- O Gateway garante que nenhum conteúdo de e-mail seja armazenado além da sessão — quando a tarefa é concluída, os dados desaparecem.

Você revisa 127 e-mails em 6 minutos. Você edita duas respostas redigidas, aprova o resto e segue em frente.

---

## IV. O Que Faz Isso Funcionar (e O Que Não Funciona)

Todos os quatro cenários compartilham um padrão. Vamos torná-lo explícito.

**O que faz funcionar:**

1.  **Uma Habilidade que codifica o conhecimento do domínio.** Não um prompt genérico — um conjunto de instruções estruturado que conhece o formato de relatório da sua empresa, o estilo de nota de reunião da sua equipe, a escala de classificação de risco da sua equipe jurídica. É por isso que uma abordagem baseada em Habilidades supera o prompting bruto.
2.  **Ferramentas MCP que lidam com a mecânica.** O Agente não precisa "descobrir" como se conectar ao seu CRM ou analisar um PDF. O MCP fornece integrações pré-construídas e testadas. A Habilidade apenas diz "use esta ferramenta" e o MCP lida com o protocolo.
3.  **Um Gateway que mantém tudo funcionando.** O estado da sessão não desaparece no meio da tarefa. Se uma etapa falhar, o Gateway tenta novamente ou reverte. As permissões são aplicadas — a Habilidade de revisão de contrato não pode acessar seu e-mail, e a Habilidade de e-mail não pode acessar o contrato.

**O que não funciona (ainda):**

1.  **Fluxos de trabalho entre aplicativos com muitas etapas.** A taxa de aprovação cai significativamente quando as tarefas abrangem mais de 4 aplicativos. A fragmentação de contexto é o maior problema não resolvido.
2.  **Intenção ambígua.** "Melhore este relatório" não é suficiente. O Agente precisa de intenção específica — "sinalize quedas acima de 15%" é acionável, "faça com que pareça bom" não é. O Vibe Working exige que os usuários sejam claros sobre como é a aparência de "concluído".
3.  **Configuração inicial.** Uma Habilidade precisa aprender as convenções da sua empresa antes de poder replicá-las. O primeiro relatório trimestral leva esforço para configurar. O 20º leva 3 minutos.

---

## V. Por Que as Soluções Atuais Ficam Aquém

Os recursos de Vibe Working da Microsoft são demonstrações impressionantes. Mas existem limitações estruturais na abordagem atual.

**O Copilot está bloqueado no ecossistema da Microsoft.** O Modo Agente funciona no Excel e no Word. E se seus dados estiverem no Google Sheets, seu CRM for Salesforce e suas gravações de reunião estiverem no Otter.ai? Você precisa de algo que orquestre entre fornecedores, não dentro de um.

**Sem memória persistente entre as sessões.** O Copilot não se lembra de que o relatório do mês passado usou um estilo de gráfico específico, ou que sua equipe jurídica prefere uma escala de risco de 3 níveis. Cada sessão começa do zero. As Habilidades resolvem isso — o conhecimento está no arquivo de Habilidade, não na sessão.

**Sem isolamento de segurança.** Quando o Copilot processa seu contrato de fornecedor, para onde esses dados vão? Através da API da OpenAI? Da Anthropic? A Microsoft usa ambos — e aqui está um detalhe enterrado em sua própria documentação: **os modelos da Anthropic nas experiências do Microsoft 365 Copilot estão explicitamente fora do escopo do Limite de Dados da UE**. Se você é uma empresa europeia executando o Modo Agente, alguns de seus dados podem ser processados fora dos datacenters da UE (especificamente na AWS US). Para documentos confidenciais, você precisa de um tempo de execução com limites de dados claros — um Gateway com sandboxing, não uma janela de bate-papo com APIs de nuvem.

**Os números de precisão são brutais.** 57,2% no SpreadsheetBench para tarefas apenas do Excel — e esse é o *próprio* Modo Agente da Microsoft em seu *próprio* benchmark. O trabalho acadêmico sobre raciocínio de planilha (como SheetBrain, SheetAgent) mostra que mesmo os sistemas neuro-simbólicos construídos para esse fim precisam de módulos de validação explícitos para evitar a corrupção de dados. A inteligência bruta do modelo, não importa quão impressionante, não está pronta para produção para automação de escritório sem infraestrutura.

---

## VI. A Abordagem Que Estamos Adotando

A pilha Vibe Working da AgentPuter tem três camadas — as mesmas três que descrevemos em nosso post anterior:

**Habilidades** definem o playbook para cada cenário. Uma Habilidade de Relatório de Vendas é diferente de uma Habilidade de Notas de Reunião é diferente de uma Habilidade de Revisão de Contrato. Cada uma codifica conhecimento de domínio específico, sequências de etapas, requisitos de ferramenta e formatos de saída.

**O Agent Gateway** orquestra a execução. Ele carrega a Habilidade certa, roteia chamadas de ferramenta MCP, gerencia o estado da sessão, impõe permissões e lida com falhas. O Gateway é a razão pela qual o sistema não desmorona na etapa 7 de um fluxo de trabalho de 12 etapas.

**Ferramentas MCP** lidam com as conexões reais — consultas de banco de dados, E/S de arquivo, APIs de e-mail, pesquisas de calendário, análise de PDF. Padronizado, testado, containerizado.

O que torna isso diferente do Copilot? Três coisas:

1.  **Neutro em relação ao fornecedor.** Nosso Gateway orquestra entre Google Workspace, Microsoft 365, Salesforce, Slack, Notion — onde quer que seus dados realmente residam. Não está bloqueado em um ecossistema.
2.  **Conhecimento persistente.** As Habilidades lembram suas convenções entre as sessões. O 20º relatório trimestral é tão rápido quanto o 2º, porque a Habilidade já conhece seu formato, suas métricas, seu público.
3.  **Tempo de execução com segurança em primeiro lugar.** Cada Habilidade é executada em um ambiente sandboxed. Os dados do contrato não tocam no contexto da Habilidade de e-mail. Os dados da sessão são efêmeros, a menos que sejam explicitamente persistidos. Logs de auditoria para cada etapa.

---

## Considerações Finais

"Vibe Working" é um bom nome para o que está por vir. A ideia de que você descreve o que quer e um Agente entrega o artefato finalizado — esse é o estado final para o qual todos estão construindo.

Mas a verdade honesta é: ainda não chegamos lá. A lacuna entre a demonstração e o driver diário é real. Taxas de aprovação de ~50% em fluxos de trabalho de escritório dizem que a inteligência bruta do modelo não é suficiente.

O que fecha a lacuna não é um modelo melhor. É a infraestrutura em torno do modelo:

- **Habilidades** que restringem o Agente a fluxos de trabalho comprovados em vez de deixá-lo improvisar
- **Um Gateway** que mantém as tarefas de várias etapas no caminho certo, com repetições, rollbacks e controle de acesso
- **Ferramentas MCP** que fornecem integrações testadas e confiáveis em vez de pedir ao Agente para descobrir APIs por conta própria

Ao longo dos últimos quatro posts, passamos de dissecar um projeto viral de código aberto a construir uma imagem completa do que a infraestrutura do Agente realmente exige.

Aqui está a parte que deveria incomodar todos que constroem neste espaço: os analistas do Morgan Stanley economizam 1,5 horas por dia com IA, mas o melhor Agente de propósito geral ainda falha em metade de todas as tarefas de escritório multi-aplicativos. **O ROI já é real — dentro de aplicativos únicos, com supervisão humana. No momento em que você remove o humano ou cruza os limites do aplicativo, as coisas quebram.**

A conclusão é simples: **o Agente que faz seu relatório trimestral não é mais inteligente que o ChatGPT. Ele apenas tem instruções melhores, um tempo de execução confiável e as ferramentas certas conectadas.** Os 7.137 trabalhadores naquele estudo do NBER não precisavam de um modelo mais inteligente. Eles precisavam de uma infraestrutura melhor em torno do modelo que já tinham.

Isso é Vibe Working. Não vibes. Infraestrutura.

---

*Este é o quarto post em nossa série sobre infraestrutura de Agente. Passamos do OpenClaw → arquitetura → a pilha de capacidades Habilidades + Gateway + MCP → e agora como é na prática. Em seguida, vamos nos voltar para o modelo de negócios: como você realmente monetiza uma plataforma de Agente? Se você tem um fluxo de trabalho de escritório que tentou — e falhou — automatizar com IA, adoraríamos ouvir sobre ele.*