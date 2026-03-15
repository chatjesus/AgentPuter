---
title: "Como Rodar o OpenClaw por Menos de $30/Mês (O Guia Completo de Custos)"
description: "Um usuário gastou $254 em duas semanas. Federico Viticci atingiu $3.600
tags: ["OpenClaw", "Otimização de Custos", "Roteamento de Modelos", "Ollama", "Orçamento", "Heartbeat", "lossless-claw"]
featured: true
---

# Como Executar o OpenClaw por Menos de $30/Mês (O Guia Completo de Custos)

AgentPuter · Março de 2026 · ~20 min · #OpenClaw #OtimizacaoDeCustos #RoteamentoDeModelos #Ollama #Orçamento

> **Fontes:**
> - [Como parar de queimar dinheiro com o OpenClaw](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) — r/PromptEngineering
> - [O melhor LLM acessível do momento (Fev 2026)](https://github.com/openclaw/openclaw/discussions/12267) — Discussão no GitHub nº 12267
> - [Como o Plugin MemOS Reduz os Custos de Token do OpenClaw em 70%](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) — Medium, 4 de mar de 2026
> - [ibl.ai OpenClaw Router](https://github.com/iblai/iblai-openclaw-router) — GitHub
> - [Reduza Seus Custos com LLMs OpenClaw: Guia da SaladCloud](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) — Blog da SaladCloud, 9 de fev. de
> - [Notas da Versão do OpenClaw 2026.3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) — GitHub
> - [Notas da Versão do OpenClaw 2026.3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8) — GitHub

---

Na semana passada, abordamos como o [lossless-claw corrige o teto de memória do OpenClaw](/blog/lossless-claw) — mantendo o contexto do seu agente intacto ao longo de sessões de uma semana. Mas há uma segunda pergunta que a comunidade faz com ainda mais frequência do que "por que meu agente esquece?":
*“Por que meu agente custa tanto?”*

Um usuário gastou $254 em duas semanas. Outro atingiu $800 em um mês. O blogueiro de tecnologia Federico Viticci acumulou uma [conta mensal de $3.600](https
Não se trata de usuários avançados forçando os limites. São configurações normais com uso normal.

O OpenClaw é gratuito. Os modelos que ele utiliza não são. E como o OpenClaw foi projetado para rodar 24/7 — fazendo verificações, navegando, pensando, enviando sinais de atividade —
Este post é o guia que deveria ter vindo com o OpenClaw. Vamos detalhar exatamente para onde o dinheiro vai, o que as últimas versões (3.7 e 3.8) mudaram para ajudar, e como usuários reais reduziram suas contas de centenas para menos de US$
Toda vez que o OpenClaw faz uma chamada de API, ele carrega seus arquivos `SOUL.md`, `AGENTS.md` e outros arquivos de bootstrap no prompt. Eles não são carregados uma única vez — são enviados a **cada requisição**. Se o seu
Um usuário no r/LocalLLaMA [reduziu seu bootstrap de 85KB para 27KB](https://www.reddit.com/r/LocalLLaMA/comments/1r3ro5h/) — uma redução de 69,8% — ao remover o contexto de um projeto de três meses que era carregado toda vez, mas quase nunca referenciado.

### 2. Histórico da Conversa (Só Aumenta)
Seu histórico de sessão cresce a cada interação. Após algumas horas de uso ativo, você está carregando dezenas de milhares de tokens no histórico. Tudo isso acompanha cada nova solicitação. Este é o maior fator de custo para usuários intensivos — e a razão pela qual o [lossless-
O pulso do OpenClaw roda a cada 30 minutos por padrão. Cada verificação é uma chamada de API completa com todo o seu contexto de sistema incluído. No Opus, isso representa uma despesa significativa — 48 pulsos por dia, cada um carregando seu
### 4. Criação de Subagentes

Quando seu agente principal delega para subagentes, cada um é iniciado com seu próprio contexto, sua própria memória e suas próprias chamadas de modelo. Usuários que executam configurações multiagente (um para escrita, um para pesquisa, um para programação) estão pagando uma sobrecarga de contexto para cada agente — e perdendo contexto em cada transferência.

### 5. Saídas de Ferramentas
Raspagens do navegador, leituras de arquivos, resultados de busca — as saídas das ferramentas são armazenadas na transcrição e reenviadas com as mensagens subsequentes. Uma única raspagem da web pode despejar milhares de tokens no seu histórico, que persistem pelo resto da sessão.

###
## Se Você Ainda Não Começou: A Porta de Entrada Gratuita

Antes de chegarmos à otimização, uma observação para quem ainda não configurou o OpenClaw.

Você não precisa gastar um dólar para experimentar. O **Gemini 2.5
{
  agents: {
    defaults: {
      model: "google/gemini-2.5-flash-lite"  // camada gratuita
    }
  }
}
```

Conecte um canal (apenas Telegram ou WebChat), mantenha o SOUL.md curto e você terá um agente pessoal funcional a custo zero. Escale a partir daí.

---

## O que mudou nas versões 3.7 e 3.8 (Recursos Relevantes ao Custo)

Os dois últimos lançamentos incluíram vários recursos que afetam diretamente os custos. Aqui está o que importa:

### Da versão 3.7 (8 de março)
**API de Plugin do Mecanismo de Contexto + lossless-claw.** O [plugin lossless-claw](/blog/lossless-claw) mantém seu contexto ativo na faixa de 30 a 100 mil tokens, independentemente da duração da conversa. Sem ele, as sessões ou
**MiniMax-M2.5-highspeed como modelo de primeira classe.** Não é mais uma gambiarra — está devidamente integrado ao catálogo de modelos, onboarding e roteamento. Este é um modelo rápido e barato que lida com 80% do trabalho de rotina do agente.
**`openclaw backup create` e `openclaw backup verify`.** Não é diretamente um recurso de economia de custos, mas se você já perdeu uma configuração e teve que reconstruí-la — isso é tempo e tokens desperdiçados para restabelecer o contexto com seu agente.

**
**Tempo limite de silêncio do modo de conversa.** `talk.silenceTimeoutMs` permite que você controle quando a entrada de voz é enviada automaticamente. Evita envios prematuros que desperdiçam uma chamada de API de ida e volta com meia frase.

**Correção da janela de contexto do GPT-5.4.** A janela de contexto de 1.050.000 tokens e os 128K tokens máximos de saída para `openai-codex/gpt-5.4` agora são aplicados corretamente. Se você tem uma assinatura do Codex, isso significa menos compactações por estouro de contexto.

---

## Estratégia 1: Verifique Sua Fatura (5 Minutos, Custo Zero)
Todo usuário que reduziu sua conta diz a mesma coisa: a solução não foi uma técnica específica — foi ver para onde o dinheiro ia.
Acesse o painel do seu provedor de API agora mesmo. Veja os gastos diários. Encontre os picos. Um usuário no [r/openclaw monitorou cada dólar por 30 dias](https://www.reddit.com/r/LocalLLM/comments/
Dentro do OpenClaw, use `/status` para ver o modelo e a contagem de tokens da sessão atual. Use `/usage full` para obter detalhamentos de custo por resposta. Você não pode otimizar o que não pode medir.

---

## Estratégia 2
    defaults: {
      heartbeat: {
        intervalMinutes: 120
      }
    }
  }
}
```

Isso reduz o número de chamadas de 48 para 12 por dia — uma redução de 75
Cada token no seu prompt de sistema é cobrado em cada chamada. Este é o custo multiplicativo que a maioria das pessoas não percebe.

Um exemplo real da comunidade:

| Métrica | Antes | Depois |
|---|---|---|
| Tamanho do SOUL.md | 85 KB (21.400 tokens) | 27 KB (6.472 tokens) |
| Redução | — | 69,8% |
| Impacto mensal (agente 24/7) | ~$45 apenas pela sobrecarga de inicialização | ~$14 |
Abra seu SOUL.md. Leia cada linha. Pergunte: "O agente realmente precisa disso a cada chamada?" Contexto específico de um projeto de três meses atrás? Mova-o para uma habilidade. Anotações históricas? Mova-as para um arquivo de referência. Seu prompt de sistema deve ser enxuto e atemporal.

Além disso: use `/new` ao alternar entre tarefas não relacionadas. Não carregue uma conversa de 50.000 tokens sobre o projeto A para o projeto B.

---

## Estratégia 4: Ativar o Cache de Prompt (Uma Linha, Economiza 40% na Entrada)
Este é o ganho mais fácil que os dados-fonte do artigo destacam repetidamente.

A Anthropic oferece suporte a cache automático de prompts para os modelos Claude. Como o OpenClaw envia o mesmo prompt de sistema (SOUL.md + AGENTS.md) em cada chamada, ele é um candidato perfeito para cache. A primeira chamada paga o preço cheio; chamadas subsequentes dentro da janela de cache recebem os tokens do prompt de sistema com um desconto de 90%.
Um usuário [monitorando os custos ao longo de 30 dias](https://www.reddit.com/r/openclaw/comments/1rl2z70/i_tracked_every_dollar_my_openclaw_agents_spent/) relatou: *"Ativar o cache de prompts reduziu o custo dos tokens de entrada para suporte em cerca de 40%. Provavelmente o ganho mais fácil."*
Para os modelos da Anthropic, o cache de prompt é ativado por padrão nas versões recentes do OpenClaw. Para outros provedores, verifique se o seu modelo suporta isso — os modelos Gemini do Google também oferecem [cache de contexto](https://ai.google.dev/gemini-api/docs/pricing) com descontos significativos.

---

## Estratégia 5: Rotear Modelos por Tarefa (Economia de 70–90%)

Esta é a mudança estrutural de maior impacto. A ideia: nem toda requisição merece o seu modelo mais caro.
Uma verificação de rotina que pergunta "algo novo na minha caixa de entrada?" não precisa do Opus. Uma classificação de mensagem ("isto é urgente?") não precisa do Sonnet. Essas são tarefas de nível Haiku.

Aqui está uma comparação de custos reais da comunidade:

| Configuração
| Roteado | $35 | Mesmo usuário, mesmas tarefas |

**Como fazer — Opção A: Configuração manual**

Defina seu modelo padrão para um mais barato e use o Opus apenas onde você explicitamente precisar dele:

```json5
{
  agents: {
Quando terminar a tarefa complexa, mude de volta:

```
/model claude-haiku-4-5
```

**Como fazer — Opção B: Proxy de roteamento automático**

Existem agora vários roteadores de código aberto que classificam cada solicitação e roteiam
- [**ClawRouter**](https://github.com/BlockRunAI/ClawRouter) — pontuação local de 15 dimensões, a comunidade relata uma economia de ~90% em comparação com o uso exclusivo do Opus.

Ambos ficam entre o
"anthropic/claude-haiku-4-5",
          "minimax/MiniMax-M2.5-highspeed"
        ]
      }
    }
  }
}
```

Isso não é um roteamento por complexidade — é uma rede de segurança para limites de taxa e interrupções. Mas, combinado com a atribuição de modelo por canal ou por agente, você pode rotear diferentes cargas de trabalho para diferentes faixas de preço.

---

## Estratégia 6: Um Agente, Muitas Habilidades (A Maior Economia da Qual Ninguém Fala)
Isto vem diretamente do [guia de custos do r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/):

> *"Um usuário passou de gastar
Cada instância de agente tem uma sobrecarga: seu próprio prompt de sistema, sua própria memória, sua própria janela de contexto. Executar cinco agentes significa pagar cinco vezes o custo de inicialização a cada chamada.

As Skills do OpenClaw são arquivos markdown que dão ao seu agente novas capacidades sem criar uma nova instância. Mesmo cérebro, mesma memória, mesmo contexto. Uma skill para escrita, uma skill para pesquisa, uma skill para programação — todas executando em uma única sessão de agente.

```
~/.openclaw/workspace/skills/
├── research/SKILL.md
├── writing/SKILL.md
```
├── coding/SKILL.md
└── calendar/SKILL.md
```

O agente escolhe a skill certa com base no que você pede para ele fazer. Sem transferência. Sem perda de contexto. Sem tokens de bootstrap duplicados.

**Quando usar multiagente:** Quando você genuinamente precisa de execução paralela — múltiplas tarefas rodando simultaneamente, não sequencialmente. Para todo o resto, as skills são mais baratas e melhores.

---

## Estratégia 7: Execute Modelos Locais para Tarefas Rotineiras (Custo Marginal Zero)
Rodar um modelo no seu próprio hardware significa que cada inferência é gratuita após a configuração inicial.

**O que funciona para o OpenClaw:**

| Modelo | Hardware | Velocidade | Bom Para |
|-------|----------|-------|----------|
| Qwen 3 3
curl -fsSL https://ollama.com/install.sh | sh

# Baixe seu modelo
ollama pull qwen3:32b

# Configuração do OpenClaw
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434"
      }
    }
  }
}
```

O OpenClaw 3.7+ suporta embeddings do Ollama nativamente para busca na memória, assim sua memória de longo prazo também permanece local.
**A abordagem híbrida** (o que a maioria dos usuários preocupados com os custos faz): modelo local como padrão para tarefas rotineiras, API na nuvem (Sonnet ou Opus) apenas quando o agente precisa de raciocínio profundo. Um criador do YouTube documentou a execução de [19 agentes por US$ 6/mês](https://www.youtube.com/watch?v=-MtzLiQ9w1c) usando o MiniMax M2.5 para trabalho geral e encaminhando para modelos de fronteira apenas para tarefas complexas.
**Use memória vetorial em vez de contexto bruto.** A busca na memória do OpenClaw recupera memórias relevantes através da busca por embeddings, em vez de carregar tudo no prompt. Com os embeddings do Ollama (3.7+), isso é mais inteligente e gratuito:

```json5
{
  memory: {
    provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  }
}
```
**Instale o lossless-claw.** Conforme abordado em [nossa postagem anterior](/blog/lossless-claw), o plugin lossless-claw mantém o contexto ativo entre 30K–100K tokens através de sumarização incremental. Você nunca atinge o limite que força uma compactação de emergência e nunca perde informações que o forcem a refazer o trabalho.

---

## Guia de Preços de Modelos para 2026

Os preços dos modelos mudam rapidamente. Esta é a situação em março de 2026:

| Modelo | Entrada (por 1M de tokens) | Saída (por 1M de tokens) | Ideal para | Fonte |
|-------|----------------------|------------------------|----------|--------|
| **GLM-4.7-FlashX** | $0.07 | $0.40 | Extração econômica, consultas simples | Z.AI |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | Tarefas leves, janela de contexto de 1M | [Google](https://ai.google.dev/gemini-api/docs/pricing) |
| **MiniMax M2.5 Standard** | $0.15 | $1.20 | Trabalho geral de agente, contexto de 197K | [MiniMax](https://www.minimax.io/news/minimax-m25) |
| **Claude Haiku 4.5** | $1,00 | $5,00 | Heartbeats, classificação, formatação | Anthropic |
| **Claude Sonnet 4.6** | $3,00 | $15,00 | Tarefas estruturadas, revisão de código | Anthropic |
| **Claude Opus 4.6** | $5,00 | $25,00 | Raciocínio complexo, arquitetura | [Anthropic](https://www.anthropic.com/claude/opus) |
| **Ollama (local)** | $0 | $0 | Heartbeats, embeddings, tarefas de rotina | Auto-hospedado |
A matemática é simples: se 80% das chamadas do seu agente são rotineiras e você as roteia para o Haiku ($1/$5) em vez do Opus ($5/$25), você reduziu sua conta em 80% nessas chamadas.
// Sonnet para sua interação principal — forte o suficiente para trabalho real
      model: "anthropic/claude-sonnet-4-6",

      // Subagentes usam o Haiku por padrão
      subagents: {
        model: "anthropic/claude-haiku-4-
provider: "lancedb",
    embeddings: {
      provider: "ollama",
      model: "nomic-embed-text"
    }
  },

  // lossless-claw para evitar o estouro de contexto
  plugins: {
    slots: {
      contextEngine: "lossless-claw"
    }
  },

  // Pesquisa Brave com o modo LLM-context (menos tokens de continuação)
  tools: {
    web: {
      search: {
        brave: {
          mode: "llm-context"
        }
      }
    }
  }
}
```

**Detalhamento de custo mensal (estimado, 30 dias):**
| Componente | Tokens/dia | Modelo | Custo/mês |
|------------------------------------------|-----------------------------------------|---------------|-------------|
| Interação principal (~2h de atividade) | ~80K (50K de entrada + 30K de saída)
*Cálculo: Interação principal = 50K de entrada × $3/M × 30 = $4,50, mais 30K de saída × $15/M × 30 = $13,50 = $18/mês. O cache de prompts reduz a entrada repetida de prompts de sistema em ~40%.*

Esse é um agente totalmente funcional e sempre ativo com navegação na web, memória e raciocínio de múltiplos passos — por menos que uma assinatura da Netflix.

---

## O Checklist de 5 Minutos

Se você não fizer mais nada, faça estas cinco coisas hoje:
**1. Verifique sua fatura.** Faça login no painel do seu provedor de API. Observe os gastos diários. Encontre os picos.

**2. Aumente o intervalo do seu heartbeat.** Adicione `heartbeat.intervalMinutes: 120` à sua configuração. Economia instantânea.

**3. Verifique o tamanho do seu SOUL.md.**

```bash
wc -c ~/.openclaw/workspace
**4. Defina um modelo de subagente.** Adicione `agents.defaults.subagents.model` à sua configuração. Não deixe que os subagentes herdem seu modelo principal caro.

**5. Instale o lossless-claw.** `openclaw plugins install lossless-claw`. Evita o ciclo de explosão de contexto → compactação → refazer o trabalho que silenciosamente dobra seu gasto de tokens.

---

## O que está por vir

O ecossistema OpenClaw está convergindo para o problema de custo de múltiplas direções:
- O **MemOS Cloud Plugin** relatou uma [redução de 72% nos tokens](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) no benchmark de conversas longas LOCOMO ao descarregar a memória para um sistema dedicado
- O **QMD** (pelo cofundador da Shopify, Tobi Lütke) proporciona uma economia de 60 a 97% nos tokens através de busca semântica local
- **Proxies de roteamento automático** como o ibl.ai Router e o ClawRouter estão tornando a seleção manual de modelos obsoleta
- A **API do Mecanismo de Contexto**, disponibilizada na versão 3.7, significa que a comunidade pode construir abordagens totalmente novas para a eficiência de contexto.

A tendência é clara: o runtime do agente está se tornando ciente dos custos em todas as camadas. Gerenciamento de contexto, busca na memória, roteamento de modelos e manipulação da saída das ferramentas estão todos sendo otimizados simultaneamente. A conta de US$ 200/mês do OpenClaw está se tornando um problema resolvido para quem estiver disposto a dedicar 30 minutos à configuração.

---
*Rodando o OpenClaw com um orçamento apertado? Compartilhe seu custo mensal e sua configuração nos comentários. Estamos coletando dados para um benchmark de custo da comunidade — o objetivo é encontrar o menor custo possível para cada nível de capacidade do agente.*

*A seguir: [OpenCl
*Fontes: [guia de custos do r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/comments/1rktirf/how_to_stop_burning_money_on_openclaw/) · [Discussão do GitHub #12267](https://github.com/openclaw/openclaw/discussions/12267) · [análise do Plugin MemOS](https://medium.com/@tentenco/how-the-memos-plugin-cuts-openclaw-token-costs-by-72-9a6948fe7aef) · [ibl.ai Router](https://github.com/iblai/iblai-openclaw-router) · [guia de custos da SaladCloud](https://blog.salad.com/reduce-your-openclaw-llm-costs-saladcloud-guide/) · [análise de tokens da Apiyi](https://help.apiyi.com/en/openclaw-token-cost-optimization-guide-en.html) · [OpenClaw 3.7](https://github.com/openclaw/openclaw/releases/tag/v2026.3.7) · [OpenClaw 3.8](https://github.com/openclaw/openclaw/releases/tag/v2026.3.8)*