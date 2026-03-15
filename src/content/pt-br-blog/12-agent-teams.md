---
title: "De Um Agente a uma Equipe: Como os Subagentes OpenClaw Funcionam"
description: "Um pesquisador da Anthropic gastou US$ 20.000 para que 16 agentes Claude paralelos escrevessem um compilador C. O sistema de Subagentes do OpenClaw permite que você use a mesma arquitetura para seu briefing matinal — por cerca de US$ 0,03. Veja como."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "10 min"
tags: ["OpenClaw", "Sub-Agents", "Agent Teams", "Parallel Agents", "sessions_spawn", "Claude Code"]
featured: false
---

# De Um Agente a uma Equipe: Como os Subagentes do OpenClaw Funcionam — E o que o Experimento de Compilador de $20 mil da Anthropic nos Diz Sobre o Futuro

**Em fevereiro, um pesquisador da Anthropic gastou $20

---

Este mês, o pesquisador da Anthropic, Nicholas Carlini, publicou um experimento que parece menos com engenharia de software e mais com evolução biológica.

Ele encarregou 16 instâncias do Claude Opus 4.6 de trabalhar em paralelo por duas semanas. Elas ger

---

O resultado? Um compilador C de 100.000 linhas baseado em Rust, escrito do zero, capaz de compilar o kernel Linux 6.9 para as arquiteturas x86, ARM e RISC-V. Ele até roda Doom.

Isso não

---

A maioria de nós não tem $20.000 para gastar em chamadas de API esta semana. Mas o padrão de arquitetura que Carlini usou — decompor um objetivo massivo em tarefas paralelas para agentes independentes — é exatamente para o que o sistema de **Sub-

---

## Primeiro: Vamos Esclarecer a Confusão

Existem três conceitos "multi-agent" circulando pela comunidade no momento. Eles soam parecidos, mas são ferramentas completamente diferentes.

---

| Conceito | O que é | Onde você o utiliza |
|---|---|---|
| **Equipes de Agentes Claude Code** | Um recurso experimental na ferramenta de CLI `claude` da Anthropic. Ele permite que membros da equipe enviem mensagens uns aos outros diretamente através de um sistema de "Caixa de Entrada" (Mailbox). | **Claude Code** (ferramenta de codificação, estágio Alfa) |
| **Experimento do Compilador de $20K** | Protótipo de pesquisa de Nicholas Carlini. Ele usava repositórios git simples e bloqueios de arquivo para coordenação — sem orquestrador central, sem interface de chat. | **Artigo de Pesquisa** (não é um produto) |
| **Subagentes OpenClaw** | A ferramenta integrada `sessions_spawn` do OpenClaw. Um agente principal despacha tarefas para agentes de trabalho em segundo plano, que reportam de volta quando terminam. | **OpenClaw** (agente de propósito geral) |

---

**Este artigo é sobre os Subagentes OpenClaw.** É o único dos três que está pronto para produção para tarefas gerais de automação hoje.

---

---

## Como os Subagentes do OpenClaw Funcionam

Em vez de um único agente fazer tudo sequencialmente, um "Agente Principal" cria "Subagentes" para realizar trabalho em segundo plano.

---

Agente Principal (Profundidade 0)
    │
    ├── sessions_spawn(tarefa="Pesquisar concorrente A")
    │       └── Subagente A (Profundidade 1, sessão isolada)
    │               └── trabalhando... trabalhando... → anuncia os resultados de volta
    │
    ├── sessions_spawn(tarefa="Pesquisar concorrente B")
    │       └── Subagente B (Profundidade 1, sessão isolada)
    │               └── trabalhando... trabalhando... → anuncia os resultados de volta
    │
    └── Rece

---

1.  **Não Bloqueante:** O comando `sessions_spawn` retorna um `runId` imediatamente. O Agente Principal pode continuar trabalhando ou gerar mais agentes sem precisar esperar.
2.  **Isolamento de Contexto:** Cada Subagente é executado em sua própria sessão nova. Eles não herdam o histórico de chat do Agente Principal. Isso mantém suas janelas de contexto limpas e focadas.
3.  **Memória Seletiva:** Os Subagentes injetam `AGENTS.md` e `TOOLS.md`, mas **não** `SOUL.md`, `IDENTITY.md` ou `USER.md`. Eles são trabalhadores efêmeros, não assistentes personalizados.
4.  **Concorrência:** Por padrão, um único agente pode gerar até 5 filhos ativos. O sistema limita a concorrência global a 8 para evitar limites de taxa da API.

---

### O Comando

A ferramenta é `sessions_spawn`. Observe que o nome do parâmetro é `task`, e não `instruction`.

```javascript
sessions_spawn({
  task: "Search for the latest HackerNews AI headlines and return top 5",
  model: "gpt-4o-mini",         // Use um modelo mais barato para o worker
  runTimeoutSeconds: 120,       // Limite de segurança
  label: "news-fetcher",        // Para seus logs
  cleanup: "delete"             // Excluir sessão automaticamente ao concluir
})
```

---

---

## Quatro Arquiteturas do Mundo Real

### Padrão 1: Coordenador + Workers (Mais Comum)

Este é o padrão para pesquisa ou processamento em lote.

```
Agente Principal (Coordenador)
  ├── Worker A: Pesquisar o modelo de preços do Notion
  ├── Worker B: Pesquisar o modelo de preços do Linear
  └── Worker C: Pesquisar o modelo de preços do Monday.com
O Agente Principal combina as entradas em uma tabela comparativa de preços.
```

---

**Por que funciona:** Se você fizesse isso sequencialmente, a janela de contexto do Agente Principal ficaria cheia de HTML bruto de três páginas de preços diferentes. Ao paralelizar, cada Worker processa os dados brutos e retorna apenas o resumo estruturado.

**Modelo de Worker Recomendado:** `gpt-4o-mini` ou `gemini-2.5-flash` (baixo custo).

### Padrão 2: O Pipeline

---

Subagente 1: Coleta dados brutos (habilidade de pesquisa na web)
      ↓
Subagente 2: Limpa e estrutura os dados (habilidade de raciocínio)
      ↓
Subagente 3: Gera insights (habilidade de análise)
      ↓
Agente Principal: Formata para entrega

**Por que funciona:** Isso isola as partes "bagunçadas" do processo. O agente que faz a análise de alto valor nunca vê o lixo de HTML bruto da etapa 1.

### Padrão 3: Roteamento de Especialista

Em vez de um agente generalista, o Agente Principal atua como um roteador.

---

Agente Principal (Roteador)
  ├── "Agendar uma reunião"   → Agente especialista em Google Calendar
  ├── "Redigir um e-mail"       → Agente especialista em escrita
  └── "Pesquisar este tópico"  → Agente especialista em pesquisa na web

**Dica Pro:** Como os Subagentes não carregam o `SOUL.md`, você deve colocar sua lógica de roteamento no `AGENTS.md`.

---

## Regras de Roteamento do AGENTS.md

Ao rotear tarefas para subagentes:
- Solicitações de calendário: inicie com as habilidades google-calendar e google-workspace
- Solicitações de pesquisa: inicie com a habilidade web-search, use o modelo gpt-4o-mini
- Solicitações de escrita: inicie com o contexto de escrita explicitamente injetado na descrição da tarefa
```

### Padrão 4: Fan-Out / Fan-In (O Briefing Matinal)

Este é o "Olá, Mundo" dos agentes paralelos.

---

**Sequencial (Modo Antigo):** Verificar o tempo (5s) → Verificar a agenda (5s) → Verificar e-mail (10s) → Verificar notícias (10s) → Resumir (5s). Total: **~35 segundos.**

**Paralelo (Modo Novo):**
7:00 AM → Agente Principal gera 4 workers instantaneamente:
*   **Agente A:** Previsão do AccuWeather para São Francisco
*   **Agente B:** Reuniões de hoje no Google Calendar
*   **Agente C:** Resumo dos não lidos do Gmail (sinalizar itens urgentes)
*   **Agente D:** 5 principais manchetes do HackerNews + TechCrunch

---

O tempo total é determinado pelo agente mais lento (~15s) + síntese (5s) = **~20 segundos.**

---

---

## Estratégia Crítica de Custo: "Chefe Inteligente, Estagiários Baratos"

O maior risco com Sub-Agentes é a multiplicação de custos. Se você gerar 5 agentes e todos eles usarem o Claude Opus 4.6, você acabou de multiplicar sua conta de API por 5.

A solução é a atribuição explícita de modelos.

**O Chefe (Agente Principal):** Precisa de alta capacidade de raciocínio para decompor tarefas e sintetizar resultados.
*   **Modelo:** `anthropic/claude-opus-4-6` ou `claude-sonnet-4-6`

---

**Os Estagiários (Trabalhadores):** Geralmente executando tarefas claras e delimitadas (resuma isso, encontre aquilo).
*   **Modelo:** `openai/gpt-4o-mini` ou `google/gemini-2.5-flash`

Você pode definir este padrão na sua configuração para evitar acidentes:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "openai/gpt-4o-mini",
        "maxSpawnDepth": 1,
        "maxChildrenPerAgent": 5
      }
    }
  }
}
```

---

---

## Avançado: O Padrão Orquestrador (Profundidade 2)

Por padrão, o OpenClaw define `maxSpawnDepth: 1`, o que significa que um Subagente não pode gerar seus próprios Subagentes.

Para projetos complexos, você pode habilitar a Profundidade 2:

```json
{ "agents": { "defaults": { "subagents": { "maxSpawnDepth": 2 } } } }
```

Isso habilita uma hierarquia de três camadas:

---

Agente Principal (CEO)
  └── Agente Orquestrador (Gerente) — Possui permissão sessions_spawn
        ├── Trabalhador A (Estagiário) — Não pode gerar
        ├── Trabalhador B (Estagiário)
        └── Trabalhador C

---

## OpenClaw vs. Equipes de Agentes Claude Code

Ambos existem. Qual deles você deveria realmente usar?

---

| Recurso | Subagentes OpenClaw | Equipes de Agentes Claude Code |
| :--- | :--- | :--- |
| **Público-alvo** | Automação geral (e-mail, pesquisa, operações) | Codificação e engenharia de software |
| **Comunicação** | Hub-and-spoke (Trabalhadores se reportam ao Principal) | Malha (Membros da equipe trocam mensagens entre si) |
| **Maturidade** | Recurso pronto para produção | Alfa / Experimental |
| **Configuração** | Integrado, nenhuma configuração necessária | Requer a edição de `settings.json` |
| **Contexto** | Independente por agente | Independente por agente |

---

Se você estiver construindo um compilador, use Claude Code. Se você estiver construindo um assistente pessoal ou um fluxo de trabalho empresarial, use OpenClaw.

---

---

## Limitações Práticas

---

1.  **Comunicação Unidirecional:** Sub-Agentes só podem se reportar ao seu agente pai. Eles não podem consultar o agente pai para obter esclarecimentos no meio da tarefa.
2.  **Sem `SOUL.md`:** Lembre-se, Sub-Agentes são tábulas rasas. Se você quiser que eles tenham uma personalidade ou regras de comportamento específicas, você deve incluir essas instruções no prompt da `task` ou no `AGENTS.md`.
3.  **Limites de Concorrência:** Não tente gerar 50 agentes de uma vez. Você atingirá os limites de taxa da API instantaneamente. O limite padrão é de 8 sessões simultâneas.

---

---

## Se Você Não Quer Gerenciar Isso: TinyClaw

Gerenciar arquiteturas de agentes paralelos, configurar o `maxSpawnDepth` e monitorar os custos de token em vários modelos é complexo.

[TinyClaw](https://tinyclaw.dev) simplifica isso

---

Gerenciar uma equipe de agentes não precisa custar $20.000. Comece com um briefing matinal.

→ [tinyclaw.dev](https://tinyclaw.dev) · Gratuito para começar · Sua equipe de agentes rodando em 60 segundos

---

*Fontes de dados: Blog de Engenharia da Anthropic ("Building a C compiler with a team of parallel Claudes", Fev 2026); Documentação do OpenClaw (docs.openclaw.ai/tools/subagents).*

*Precisa de uptime 24/7 para suas equipes de agentes? Confira o [AgentPuter](https://www.agentputer.com/) para hospedagem gerenciada em nuvem.*