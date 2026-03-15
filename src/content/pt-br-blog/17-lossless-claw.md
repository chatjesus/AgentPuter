---
title: "O OpenClaw Acaba de Corrigir Seu Maior Problema. Veja o Que o lossless-claw Realmente Faz."
description: "A compactação padrão do OpenClaw é disparada uma vez, resume tudo e descarta os originais. Quanto mais tempo seu agente roda, mais ele esquece. A versão 2026.3.7 abriu o mecanismo de contexto para plugins. O lossless-claw é o primeiro deles — um sistema baseado em DAG que armazena cada mensagem na íntegra e permite que os agentes recuperem detalhes históricos exatos sob demanda."
tempoDeLeitura: "18 min"
tags: ["OpenClaw", "lossless-claw", "Mecanismo de Contexto", "Memória", "Plugin", "Agentes de Longa Duração", "LCM"]
destaque: true
---

# O OpenClaw Acaba de Resolver Seu Maior Problema. Veja o Que o lossless-claw Realmente Faz.

AgentPuter · Março de 2026 · ~18 min · #OpenClaw #lossless-claw #MecanismoDeContexto #AgentesDeLongaDuração #Plugin

> **Fontes:**
> - [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) — Repositório no GitHub
> - [Recurso: sistemas de contexto plugáveis, LCM para OpenClaw](https://github.com/openclaw/openclaw/discussions/22251) — Discussão nº 22251, @jalehman, 20
Imagine o seguinte: você tem um agente OpenClaw rodando um projeto de pesquisa há três horas. Ele passou esse tempo navegando, fazendo anotações, cruzando fontes, montando um panorama de algo complexo. Então, ele atinge seu limite de contexto.

A compactação
A próxima mensagem que ele te envia soa como se tivesse acabado de acordar com amnésia. O caminho de arquivo específico que ele encontrou duas horas atrás — sumiu. A decisão que vocês tomaram juntos sobre qual abordagem seguir — resumida em uma única frase vaga. Toda a linha de
Isso não é um bug. É proposital — e até 8 de março de 2026, era a única opção que qualquer agente tinha.

O OpenClaw 2026.3.7 mudou isso.

---

## O Problema com
Não é. Eis o porquê.

Quando a compactação padrão do OpenClaw é acionada, ela faz uma **sumarização de uma só vez**: as mensagens mais antigas são condensadas em um único bloco de resumo, esse bloco é reescrito na transcrição e as originais são descartadas. É com o resumo que o modelo trabalha a partir de então. Não há como recuperar o que foi compactado. Desapareceu.
[@jalehman](https://github.com/jalehman) — o desenvolvedor que criou o lossless-claw — descreveu a situação com precisão na [Discussão #22251](https://github.com/openclaw/openclaw/discussions/22251):

> *"A compactação do OpenClaw faz uma sumarização única quando a janela de contexto se enche. Funciona como uma rede de segurança, mas tem perdas — ela não preserva a estrutura temporal e não há como recuperar detalhes depois que a compactação é acionada. Isso
Essa última frase é importante. Isso não é uma falha específica do OpenClaw. O ChatGPT faz isso. O Claude faz isso. Todo framework de agente faz isso. Todo o campo vem operando partindo do pressuposto de que a compressão com perdas é a única opção.

**
Para agentes de longa duração — aqueles que as pessoas estão de fato implantando para rodar 24/7, para lidar com projetos que duram dias ou semanas, para coordenar entre subagentes em dezenas de tarefas — a compactação é um teto estrutural. Seu
Não é à toa que usuários experientes do OpenClaw desenvolveram soluções alternativas: executar manualmente o `/compact` em momentos estratégicos, estruturar o SOUL.md para forçar fatos-chave a sobreviverem à compactação e dividir projetos em sessões isoladas com notas de transferência. Esses são mecanismos de enfrentamento para uma limitação arquitetônica fundamental.

---

## O que a 2026.3.7 Realmente Mudou (A Verdadeira Novidade)
A manchete que você verá no Twitter é "lossless-claw — um plugin do OpenClaw que dá ao seu agente memória perfeita." Isso é verdade, mas essa não é a verdadeira notícia.

A verdadeira notícia é o que precisou acontecer no núcleo do OpenClaw antes que o lossless-claw pudesse existir.
Antes da versão 2026.3.7, o gerenciamento de contexto do OpenClaw era **codificado diretamente no núcleo**. Não havia como trocá-lo, estendê-lo ou experimentar alternativas sem fazer um fork de toda a base de código. A lógica de compactação — quando é acionada, como resume, o que preserva — estava embutida. Qualquer um que quisesse tentar uma abordagem diferente tinha que manter seu próprio fork do OpenClaw em paralelo. Esse não é um caminho viável para um plugin.
O PR que @jalehman enviou — [#22201](https://github.com/openclaw/openclaw/pull/22201) — não apenas adicionou suporte ao lossless-claw. Ele **extraiu o gerenciamento de contexto para uma
O que isso significa na prática: o OpenClaw agora tem uma interface definida para gerenciamento de contexto. Qualquer plugin que implemente essa interface pode substituir o motor integrado por completo. O comportamento padrão é preservado — o `LegacyContextEngine` ainda é o fallback se você não configurar nada — mas a porta agora está aberta.

Aqui está a interface:

```typescript
// OpenClaw 2026.3.7 — Interface de Plugin do Motor de Contexto
interface ContextEngine {
bootstrap(ctx):           Promise<void>           // inicializa o DB, índices
  ingest(msg):              Promise<void>           // arquiva cada mensagem assim que chega
  assemble(opts):           Promise<AgentMessage[]> // monta o contexto do modelo a cada turno
  compact(ctx):             Promise<void>           // processa o gatilho de compactação
  afterTurn(ctx):           Promise<void>           // processamento pós-turno
prepareSubagentSpawn():   ...                     // passa o contexto para os subagentes gerados
  onSubagentEnded():        ...                     // reconcilia após a conclusão do subagente
}
```

Este é um ciclo de vida completo. Cada momento que envolve o contexto — ingestão, montagem, compactação, transferência para o subagente — agora é um hook que um plugin pode interceptar e substituir.

Para usar um mecanismo de contexto alternativo, a configuração é de uma única linha:

```json
{
  "plugins": {
    "slots": {
"contextEngine": "lossless-claw"
    }
  }
}
```

Se você não adicionar esta linha, nada muda. Nenhuma diferença de comportamento em relação às versões anteriores. O caminho de migração é totalmente opcional.

---

## Como o lossless-claw Funciona
lossless-claw é a primeira implementação desta interface. Ele é construído com base no [artigo LCM (Lossless Context Management)](https://papers.voltropy.com/LCM) de Ehrlich e Blackman — pesquisadores que mais tarde endossaram o plugin diretamente. Um dos coautores do artigo, [@belisarius222](https://github.com/belisarius222), escreveu na discussão do GitHub:

> *"O Josh fez tantas melhorias nele que eu acho que ele deveria realmente ser chamado de LCM 2.0."*

A premissa central é uma reformulação de todo o problema.
A compactação padrão espera o estouro acontecer e então reage. No momento em que ela dispara, você já perdeu a capacidade de preservar o contexto adequadamente — você está fazendo uma triagem de emergência em uma pilha de mensagens que se acumularam ao longo de horas. O resultado é inevitavelmente com perdas.
O lossless-claw não espera. Ele funciona **de forma contínua e assíncrona em segundo plano**, tomando decisões de sumarização incremental após cada troca de mensagens, antes que qualquer crise de estouro de memória ocorra. Os resumos que ele cria não são texto plano. São nós estruturados em um grafo, vinculados às mensagens originais de onde vieram.

### A Arquitetura: Um DAG de Memória
Toda mensagem que entra em uma sessão do lossless-claw é salva imediatamente em um **banco de dados SQLite**. Não resumida — armazenada na íntegra. Esta é a fonte da verdade. Ela nunca é deletada.

Conforme a conversa cresce, o lossless-claw cria **nós de resumo** sobre grupos de mensagens mais antigas. Esses resumos são conectados às mensagens originais em um **DAG (grafo acíclico direcionado)**:

```
Mensagens brutas (armazenadas na íntegra no SQLite, nunca deletadas)
      ↓
  Resumos de Nível 1 (cobrem de 8 a 16 mensagens)
      ↓
```
Resumos de Nível 2 (cobrem múltiplos resumos de Nível 1)
      ↓
  Resumos de Nível 3 (capturam as principais fases do projeto)
```

Os resumos se tornam progressivamente mais abstratos à medida que sobem na árvore — detalhados e cronológicos perto da base, amplos e temáticos perto do topo. Cada resumo carrega metadados: os IDs de seus nós de origem, timestamps, profundidade, contagem de descendentes.

Quando é hora de montar o contexto para um novo turno, o motor funciona assim:

```
[Cauda recente protegida: as N mensagens brutas mais recentes]
+
[Nós de resumo preenchendo o orçamento de tokens restante, do mais antigo para o mais novo]
           +
[Quaisquer detalhes que o agente solicita explicitamente via lcm_expand]
```

O modelo vê as mensagens recentes na íntegra, e o material mais antigo como uma hierarquia de resumos. Veja como um nó de resumo realmente se parece no contexto do modelo:

```xml
<summary id="sum_abc123" kind="condensed" depth="1"
         descendant_count="8"
         earliest_at="2026-02-17T07:37:00"
         latest_at="2026-02-17T15:43:00">
<summary>
  <parents>
    <summary_ref id="sum_def456" />
  </parents>
  <content>
    Durante esta sessão, o agente investigou três estratégias de precificação
    para o nível da API.
### As Três Ferramentas de Recuperação

Quando um resumo não é suficiente — quando o agente precisa do caminho exato do arquivo, da formulação precisa de uma decisão, dos dados reais de uma sessão de pesquisa específica — ele tem três ferramentas para acessar o histórico:

| Ferramenta | O que faz |
|------|-------------|
| `lcm_grep` | Busca de texto completo em todas as mensagens armazenadas |
| `lcm_describe` | Obtém um resumo de um período específico do histórico |
| `lcm_expand` | Expande um resumo de volta às suas mensagens de origem |
`lcm_expand` é o principal. Em vez de carregar a expansão inteira no contexto principal — o que anularia o propósito — ele usa um **subagente** para ler o conteúdo expandido e retornar apenas o detalhe específico que foi solicitado. O material de origem é acessado sem estourar a janela de contexto ativa.
É isso que @jalehman quer dizer com a analogia do livro em sua proposta: *\"é como poder voltar para qualquer página do livro.\"* O livro não é destruído quando você o põe de lado. Ele está na estante. Você pode consultar qualquer coisa.

---

## Funciona mesmo? Os Números

@jalehman passou nove dias desenvolvendo o lossless-claw antes de fazer o merge do PR, executando-o
> *"Imagine nunca mais precisar rodar /compact ou /new novamente. [...] fiquei incrivelmente impressionado com os resultados: uma conversa que parece que nunca perde informação (porque, de certa forma, não perde mesmo), sempre opera na faixa de 30-100k tokens e requer manutenção zero."*
Para um panorama mais quantitativo: o desenvolvedor da comunidade [@chrysb relatou resultados preliminares de benchmark](https://x.com/chrysb/status/2030526852146549140) no Twitter no
| Claude Code (padrão) | 70.3 | Janela deslizante padrão |
| OpenClaw padrão | ~68 (estimado) | Compactação em uma única etapa |

Estes são números relatados pela comunidade, não benchmarks oficiais, e eles evoluirão à medida que mais pessoas realizarem testes. Mas a descoberta direcional se sustenta estruturalmente: **quanto maior o contexto, mais a vantagem do lossless-claw se acumula**, porque é o cenário exato onde a compactação com perdas causa mais danos.
O coautor do artigo do LCM, @belisarius222, notou uma melhoria específica que @jalehman fez na implementação original do artigo: **comprimento de entrada limitado para sumarização**. No LCM original, sumarizar conteúdo muito longo poderia, por si só, estourar o contexto, causar comportamento imprevisível e introduzir casos de borda. A abordagem com limite mantém cada etapa de sumarização previsível, o que também torna o sistema mais confiável para as chamadas do subagente `lcm_expand`.

---
## Instalando e Configurando o lossless-claw

**Pré-requisito: OpenClaw 2026.3.7 ou posterior.** O slot de plugin do Mecanismo de Contexto não existe em versões anteriores.
> **Atenção:** A versão inicial 2026.3.7 tem um bug de registro P1 conhecido ([Issue #40096](https://github.com/openclaw/openclaw/issues/40096)) no qual o módulo context
openclaw --version
# Deve mostrar: openclaw 2026.3.7 ou superior (com a correção do registro)

# Instale o plugin
openclaw plugins install lossless-claw

# Reinicie o gateway
openclaw restart
```

Na maioria dos casos, `openclaw plugins install` configurará automaticamente o slot contextEngine. Para verificar se está ativo:

```bash
openclaw config show | grep contextEngine
# Esperado: contextEngine: "lossless-claw"
```

Se você precisar configurá-lo manualmente, adicione isto à sua configuração:

```json5
{
  plugins: {
    slots: {
contextEngine: "lossless-claw"
    }
  }
}
```

### Quem Deve Habilitar

O lossless-claw não é a escolha certa para toda configuração do OpenClaw. Ele adiciona uma sobrecarga — tanto em armazenamento (banco de dados SQLite que cresce com seu histórico de conversas) quanto no uso de tokens (o próprio processo de sumarização consome tokens).

**Habilite o lossless-claw se:**
- Seu agente roda 24/7 e lida com projetos em andamento
- Você está fazendo pesquisa em múltiplas sessões onde a continuidade é importante
- Você está executando sistemas de subagentes onde a passagem de contexto é crucial
- Você já perdeu informações importantes devido à compactação e teve que recomeçar

**Permaneça com o motor padrão se:**
- Você usa o OpenClaw principalmente para tarefas de sessão única que são concluídas em menos de uma hora
- Você executa tarefas curtas de alta frequência (tarefas cron, resumos diários, consultas únicas)
- Você é altamente sensível a custos e ainda não encontrou problemas de compactação

### Gerenciando o Custo de Tokens
O lossless-claw usa um LLM para gerar resumos. Isso custa tokens. Para a maioria dos fluxos de trabalho de longa duração, a economia ao evitar reinicializações de sessão supera em muito a sobrecarga da sumarização — mas se você se preocupa com os custos, há uma maneira inteligente de configurar isso:

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
A documentação do lossless-claw recomenda o uso de um modelo rápido e barato para o trabalho de sumarização em segundo plano — algo como `anthropic/claude-haiku-4-5` ou `MiniMax-M2.5-highspeed` — enquanto mantém seu modelo de rac
A implementação de @jalehman também visa manter o contexto ativo na faixa de **30-100 mil tokens** através da cadência de sumarização adaptativa — de modo que o uso de tokens permaneça previsível mesmo que o histórico da conversa cresça indefinidamente.

---
Antes da 3.7, toda tentativa de melhorar o gerenciamento de contexto no OpenClaw esbarrava no mesmo obstáculo: era hardcoded. Você podia escrever skills que tentavam gerenciar o estado externamente. Você podia estruturar seu SOUL.md para preservar fatos-
**Busca vetorial como backend de armazenamento.** A busca de texto completo do SQLite é boa para consultas por palavras-chave. Um backend de embeddings vetoriais daria suporte à busca semântica — encontrando conteúdo histórico conceitualmente relevante mesmo quando as palavras exatas não estão presentes. A implementação original do Volt por @belisarius222 usava essa abordagem.
**Mecanismos de contexto integrados com RAG.** Um mecanismo que se baseia não apenas no histórico da conversa, mas em uma base de conhecimento externa — seu espaço de trabalho do Notion, sua base de código, sua biblioteca de documentos — montada dinamicamente a cada turno com base no que a tarefa atual necessita.

**Pools de memória compartilhados entre agentes.** Um mecanismo de contexto no qual múltiplos agentes podem ler e escrever simultaneamente, permitindo o verdadeiro compartilhamento de conhecimento multiagente sem a necessidade de rotear tudo por um coordenador central.
**Obsidian / Notion como o backend de memória.** Em vez de um banco de dados SQLite local, persista tudo em um espaço de trabalho externo e estruturado onde você mesmo pode navegar e editar. A memória do seu agente torna-se auditável e pesquisável de fora do agente.

Estas não são especulativas. Elas são extensões naturais da mesma interface que o lossless-claw já implementa.
Do ponto de vista da infraestrutura, é assim que plataformas maduras evoluem. O OpenClaw lançou a automação de navegador, depois abriu a ferramenta de navegador para personalização. Lançou habilidades, depois construiu o ClawHub para distribuí-las. Lançou o
O gerenciamento de contexto é a camada mais fundamental em um sistema de agente. Ele determina o que o agente sabe, como ele raciocina ao longo do tempo e o que ele pode realmente realizar em tarefas de longa duração. Abri-lo não é um recurso menor. É uma decisão de arquitetura sobre quem controla a memória do agente.

---

## O Que Mais Mudou na 3.7

lossless-claw recebeu a maior parte da atenção, mas dois outros recursos na versão 3.7 são dignos de nota:
**Roteamento de agentes por tópico no Telegram.** Grupos de fórum agora podem rotear diferentes tópicos para diferentes agentes. Um grupo do Telegram, múltiplos agentes especializados — cada um lidando com um tópico de discussão diferente com sessões isoladas. Este era um recurso solicitado há meses para configurações de equipes com múltiplos agentes.

**Preparação para a App Store Connect do iOS.** Identificadores de pacote, automação do Fastlane, metadados de capturas de tela — toda a infraestrutura para um envio à App Store está agora na base de código. O OpenClaw para dispositivos móveis está chegando.

---
## A Conclusão

O OpenClaw tem um limite silencioso desde o primeiro dia: quanto mais tempo seu agente roda, mais ele esquece. Todo caso de uso sério eventualmente esbarra nele. A comunidade vem contornando isso há meses com truques no SOUL.md
lossless-claw é a primeira resposta — um sistema de sumarização baseado em DAG que armazena tudo, sumariza incrementalmente e permite que os agentes recuperem detalhes históricos exatos sob demanda. Os primeiros números de benchmark da comunidade mostram que ele supera o motor padrão do Claude Code em todos os comprimentos de contexto testados, com a diferença aumentando à medida que as conversas se tornam mais longas.

Se você já teve um agente que esqueceu algo que não deveria, este lançamento é para você.

```bash
openclaw update
```
openclaw plugins install lossless-claw
```

Essa é toda a migração.

---

*Quanto tempo leva para seus agentes atingirem a compactação? E o que você perde quando isso acontece? Deixe nos comentários — estamos monitorando como diferentes tipos de fluxo de trabalho experienciam a
*Fontes: [Martian-Engineering/lossless-claw](https://github.com/Martian-Engineering/lossless-claw) · [Discussão do OpenClaw nº 22251](https://github.com/openclaw/openclaw/discussions/22251) · [Notas de Lançamento do OpenClaw 2026.3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [Chrys Bader @chrysb](https://x.com/chrysb/status/2030526852146549140) · [Artigo sobre LCM, por Ehrlich & Blackman](https://papers.voltropy.com/LCM)*