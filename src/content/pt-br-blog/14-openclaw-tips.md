---
title: "Guia para Usuários Avançados do OpenClaw: 30 Dicas que Ninguém te Conta"
description: "O padrão de maxSpawnDepth é 1, não infinito. O SOUL.md é invisível para subagentes. O cleanup mantém os arquivos para sempre, a menos que você o altere. 30 dicas testadas em produção para preencher a lacuna entre 'funciona' e 'bem configurado'."
date: "2026-02-21"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "Configuration", "Sub-Agents", "Skills", "Cost Control", "Security", "Tips"]
featured: true
---

---

# Guia de Usuário Avançado do OpenClaw: 30 Dicas que Ninguém te Conta

*Comunidade OpenClaw · Fevereiro de 2026*

A maioria das pessoas instala o OpenClaw, coloca um agente para rodar e

---

Estas 30 dicas vêm do uso em produção e de uma leitura cuidadosa da documentação oficial. Algumas são óbvias em retrospecto. A maioria não é nada óbvia.

---

---

## Índice

1. [Fundamentos de Configuração (Dicas 01–08)](#chapter-1)
2. [Seleção e Uso de Habilidades (Dicas 09–14)](#chapter-2)
3. [Arquitetura de Subagentes (Dicas 15–20)](#chapter-3)
4. [Controle de Custos (Dicas 21–25)](#chapter-4)
5. [Depuração e Segurança (Dicas 26–30)](#chapter-5)
6. [Pule Tudo Isso: TinyClaw](#tinyclaw)

---

---

## Fundamentos da Configuração {#chapter-1}

---

### 01. AGENTS.md vs SOUL.md: onde os subagentes realmente procuram

O OpenClaw carrega arquivos em uma hierarquia de três níveis:

```
~/.openclaw/

---

Isso confunde muita gente. Eles escrevem a lógica de roteamento no `SOUL.md`, implantam uma arquitetura fan-out e depois passam uma hora se perguntando por que os subagentes não estão roteando corretamente. Eles não estão roteando corretamente porque não conseguem ver as

---

## Roteamento
- Perguntas sobre finanças → finance-agent
- Revisão de código → code-reviewer
- Pesquisa → research-storm
```

Regra simples: se um subagente precisa saber algo, essa informação não pode residir no `SOUL.md`.

---

### 02. As strings de modelo precisam do prefixo do provedor

```json
{ "model": "claude-opus-4-6" }     ← vai quebrar
{ "model": "anthropic/claude-opus-4-6" }  ← correto
```

O formato é `provedor/nome-do-modelo`. Sem ele, o roteador de modelos pode falhar silenciosamente quando dois provedores têm nomes semelhantes — e eles têm.

---

Strings comuns de fevereiro de 2026:

---

| Modelo | Bom para |
|---|---|
| `anthropic/claude-opus-4-6` | Qualquer coisa que exija raciocínio real |
| `anthropic/claude-sonnet-4-6` | A maioria das coisas — qualidade próxima ao Opus, muito mais barato |
| `anthropic/claude-haiku-4-5` | Tarefas de execução onde a velocidade importa mais que a profundidade |
| `google/gemini-3.1-pro-preview` | Documentos longos, entradas multimodais |
| `openai/gpt-4o-mini` | Resumo, classificação, conversão de

---

Para definir o padrão global para subagentes:

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "anthropic/claude-haiku-4-5"
      }
    }
  }
}
```

---

### 03. Mantenha as chaves de API fora do config.json

Todo mês alguém envia uma configuração do OpenClaw para um repositório público do GitHub com as chaves inseridas diretamente. O GitGuardian a encontra em questão de minutos.

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
CONTEXT7_API_KEY=...

# .gitignore
.env
.env.local
.env.*
```

---

O OpenClaw lê o `.env` automaticamente. Não há motivo para colocar chaves em nenhum outro lugar.

---

### 04. O padrão de maxSpawnDepth é 1

Se você já viu `SpawnDepthExceeded` e não sabia por quê, é por isso.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2
      }
    }
  }
}
```

---

O padrão é 1 — um nível de subagentes. O máximo é 5, mas na prática 2 abrange quase todas as arquiteturas reais. Nós folha de profundidade 2 não podem gerar outros; tentar ir mais fundo lança erros de tempo de

---

### 05. O padrão de runTimeoutSeconds é 0

Zero significa que não há tempo limite. Um subagente travado executa para sempre.

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "runTimeoutSeconds": 120
      }
    }
  }
}
```

---

120 segundos funciona para a maioria das tarefas. Agentes com uso intensivo de dados às vezes precisam de 300. O ponto-chave a entender é: atingir o timeout para a execução, mas não exclui a sessão. Você precisa do `cleanup` para isso (Dica 06), e precisa distinguir o timeout de uma falha real ao depurar (Dica 27).

---

### 06. O padrão

---

{
  "agentes": {
    "padroes": {
      "subagentes": {
        "cleanup": "delete"
      }
    }
  }
}
```

"delete" é um nome impróprio — ele renome

---

Este é o MCP de maior impacto que você pode adicionar aos seus fluxos de trabalho de desenvolvimento. Os agentes consultam a documentação oficial em tempo real em vez de adivinhar com base em dados de treinamento que estão meses ou anos desatualizados.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx

---

Pergunte *"how do Server Actions work in the latest Next.js?"* e você obterá a documentação atualizada, não algo da versão beta de 2023.

---

### 08. O TOOLS.md é seu limite de permissão

Sem o `TOOLS.md`, os agentes podem chamar qualquer coisa disponível.

```markdown
# TOOLS.md

deny: ["gateway", "cron", "billing", "admin_delete"]
```

---

`negar` prevalece sobre `permitir`. Em configurações multiagente, isso importa mais do que parece — se uma habilidade for comprometida, um `TOOLS.md` permissivo permite que o raio de alcance se espalhe por todo o seu grafo de agentes.

---

---

## Seleção e Uso de Skills {#chapter-2}

---

### 09. A pontuação de segurança não é decoração

Tanto o ClawHub quanto o agentskills.io mostram uma pontuação de segurança para cada skill. Leia-a.

- **A/B (80+):** Adequado para produção
- **C (70–79):** Verifique quais escopos OAuth ele solicita antes de instalar
- **D (≤69):** Teste em uma sandbox. Sério.

---

Em fevereiro de 2026, o incidente ClawHavoc removeu 341 skills do ClawHub. Elas continham payloads de injeção de prompt — algumas tão sutis que a inspeção manual não as teria detectado. A pontuação de segurança é uma análise automatizada que detecta o que você não consegue ver à primeira vista.

---

### 10. autoaperfeiçoamento: a única skill que realmente fica mais inteligente com o tempo

---

O `self-improvement` registra erros, correções e lacunas de conhecimento de cada sessão em `.learnings/ERRORS.md`. Antes que a próxima sessão comece, o agente lê esse arquivo — assim, ele já entra sabendo o que deu errado da última vez.

Sem configuração adicional

---

A ordem de carregamento é `TOOLS.md` → `AGENTS.md` → `SKILL.md`. Se uma skill definir uma ferramenta com o mesmo nome de algo em seu `AGENTS.md`, a versão da skill prevalece.

Às vezes, é isso

---

O `SKILL.md` mínimo viável tem três seções:

```markdown
# my-skill/SKILL.md

---

## O que eu faço
Analisar dados de vendas CSV e gerar resumos semanais.

---

## Quando me usar
Após o fechamento de um período de vendas, quando você tiver uma exportação do CRM.
Não para dados em tempo real ou conjuntos de dados não relacionados a vendas.

---

## Como eu trabalho
1. Ler o CSV do caminho especificado na tarefa
2. Calcular totais, melhores desempenhos, delta período a período
3. Formatar como uma tabela Markdown
4. Salvar em output/sales_summary_[data].md
```

É isso. Os agentes conseguem seguir instruções em inglês simples. Você não precisa aprender uma sintaxe especial.

---

### 13. ClawHub vs agentskills.io: ferramentas diferentes para trabalhos diferentes

---

| | clawhub.ai | agentskills.io |
|-|-----------|----------------|
| Tamanho do catálogo | 3.286 habilidades | 19.309 habilidades |
| Curadoria | Auditado para segurança, com curadoria | Envios da comunidade, cauda longa |
| Melhor para | Uso em produção | Encontrar habilidades de nicho que o ClawHub não possui |

Eles não são concorrentes. Use o ClawHub por padrão; mude para o agentskills.io quando precisar de algo específico que o ClawHub não oferece.

---

### 14. proactive-agent + Cron: o que "autônomo" realmente significa

---

`proactive-agent` suporta WAL (recuperação de falhas, persistência de contexto entre reinicializações), agendamento Cron autônomo e restauração de contexto após interrupção.

Um exemplo concreto do que isso possibilita:

```
Agendamento:

---

Sem botão para apertar. Sem intervenção humana. Ele simplesmente roda. Este é o ponto em que os agentes deixam de parecer ferramentas e começam a parecer infraestrutura.

---

---

## Arquitetura de Subagentes {#chapter-3}

---

### 15. Fan-out: a mudança mais impactante que a maioria das equipes ainda não fez

Sequencial:
```
Principal → buscar dados (12s) → resumir notícias (

---

Distribuição em leque:
```python
sessions_spawn(task="buscar dados de mercado",  label="market-data",    model="anthropic/claude-haiku-4-5")
sessions_spawn(task="resumir notícias",         label="news

---

`sessions_spawn` retorna um `runId` imediatamente e não bloqueia. O agente principal continua. Essa única mudança — reestruturar o trabalho sequencial em fan-out — reduz a latência em 30–40% para fluxos de trabalho no estilo de resumo matinal.

---

# Sobrescrita para a única tarefa que realmente precisa
sessions_spawn(
    task="projetar o modelo de dados para faturamento multi-tenant",
    label="billing-schema",
    model="anthropic/claude-opus-4-6"
)
```

Na prática: o Haiku lida com mais de 80% das tarefas de execução sem perda significativa de qualidade. A diferença de custo é real — uma redução de 50–60% nos gastos com API para arquiteturas fan-out típicas.

---

### 17. Lógica de roteamento em AG

---

Vale a pena repetir, pois isso sempre causa falhas silenciosas:

```markdown
# ❌ Em SOUL.md — os subagentes não conseguem ver isto
Quando o usuário perguntar sobre finanças, delegue para o finance-agent.

# ✅ Em AGENTS.

---

# ✅
sessions_spawn(
    task="analisar os números do 4º trimestre",
    label="analise-vendas-q4-2026"
)
```

Sem um rótulo, o `/subagents list` retorna uma muralha

---

O mecanismo `announce` é de mão única: o subagente reporta de volta ao concluir. Ele не pode pausar para fazer uma pergunta de esclarecimento no meio da execução.

Isso significa que o prompt da sua tarefa precisa conter tudo o que o agente precisa:

```python
# ❌ Muito vago — produzirá lixo ou nada
sessions_spawn(task="analisar os dados", label="análise")
```

---

# ✅ Autocontido
sessions_spawn(
    task="""
    Analisar /data/sales_jan_2026.csv.
    Saída: 1) Receita mensal total, 2) Top 5 produtos por unidades,
    3) Variação M/M vs /data/sales_dec_2025.csv.
    Formato: Tabela Markdown. Salvar em /output/jan_2026_report.md.
    Se algum dos arquivos estiver ausente, escreva em /output/errors.log e pare.
    """,
    label="jan-2026-analysis"
)

---

Pense nisso como se estivesse escrevendo instruções para alguém que vai entrar em uma sala, fechar a porta e não poderá sair para lhe perguntar nada.

---

### 20. Fique atento aos seus limites de concorrência

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 3
      }
    }
  }
}
```

`maxChildrenPerAgent` limita quantos subagentes um agente pai pode gerar (padrão: 5). `maxConcurrent` é o limite máximo global de agentes paralelos (padrão: 8).

---

Atingir qualquer um dos limites não trava nada — os agentes entram na fila — mas a latência aumenta. Se você estiver em um plano de API pessoal com limites de taxa mais baixos, reduzir o `maxConcurrent` para 3 ou 4 evita os erros 429. Em um plano empresarial, você pode aumentá-lo.

---

---

## Controle de Custos {#chapter-4}

---

### 21. Instale save-money para roteamento automático de modelos

```bash
openclaw install save-money
```

A skill monitora a complexidade da tarefa e roteia para o modelo mais barato que consegue lidar com ela: Haiku para classificação e formatação, Sonnet para geração padrão, Opus para qualquer coisa que exija raciocínio de fato. O limiar é configurável.

---

Usuários relatam consistentemente uma redução de mais de 50% nos custos mensais. O roteamento não é perfeito, mas não precisa ser — mesmo roteando 60% das tarefas para o Haiku em vez do Opus, a economia se acumula rapidamente.

---

###

---

Mais relevante para agentes de pesquisa que rodam por várias horas, edição iterativa de documentos e longas sessões de depuração. Se seus agentes regularmente se aproximam dos limites de contexto, ative esta opção.

---

### 23. openclaw usage: execute e realmente

---

O que observar: um subagente usando 5x mais tokens que os demais (o prompt é muito longo), uma ferramenta chamada 20 vezes em uma única sessão (o agente está em loop), Opus em tarefas que o Sonnet poderia resolver (roteamento mal configurado). A correção desses padrões se paga.

---

### 24. Fixar o gpt-4o-mini para sumarização e classificação

---

{
  "tarefas": {
    "resumir":     { "modelo": "openai/gpt-4o-mini" },
    "classificar": { "modelo": "openai/gpt-4o-mini" },
    "traduzir":    { "modelo": "openai/gpt-4o-mini" },
    "formatar":    { "modelo": "openai/gpt-4o-mini" }
  }
}
```

Para esses tipos de tarefa, a precisão não difere significativamente entre o GPT-4o-mini e o Opus. O custo, sim — cerca de 80% menos. Direcione o modelo barato para o trabalho barato; guarde o modelo caro para os casos em que ele realmente importa.

---

---

### 25. Dados sensíveis passam por um modelo local

```json
{
  "mcpServers": {
    "local-llm": {
      "model": "ollama/qwen2.5",
      "baseUrl": "http://localhost:11434"
    }
  }
}
```

---

Registros financeiros, dados de funcionários, documentos internos — qualquer coisa que não deva sair da sua rede vai para o Ollama. O Qwen2.5 roda bem em hardware local (várias opções de tamanho de 0.5B a 72B), suporta um contexto de 128K e lida com chamada de função. É mais lento que as APIs de nuvem, mas para cargas de trabalho sensíveis, essa é a troca que se faz.

---

---

## Depuração e Segurança {#chapter-5}

---

### 26. Logs detalhados antes de mais nada

```bash
openclaw debug --verbose
/subagents log <runId>
```

O log detalhado mostra cada chamada de ferramenta, cada decisão de roteamento e o contexto completo em cada etapa. Nove em cada dez vezes, o problema fica óbvio no momento em que você vê o log — o agente tentou chamar uma ferramenta que não existe, ficou preso em um loop de repetição ou estava trabalhando com um prompt que não incluía a informação de que precisava.

---

Não depure por hipótese quando você pode simplesmente ler o que aconteceu.

---

### 27. Timeout e falha são diferentes — trate-os de forma diferente

```bash
/subagents list
```

Verifique a coluna `status` antes de fazer qualquer coisa:

- `timeout` — o agente ultrapassou o tempo de `runTimeoutSeconds`. Aumente o limite e execute novamente. Executar com a mesma configuração reproduzirá o timeout.
- `error` — falha real. Abra o log e encontre a mensagem de erro.

---

Eles precisam de correções diferentes. Tratar um timeout como uma falha te envia na direção errada.

---

### 28. Escanear as skills instaladas com o clawdefender

```bash
clawdefender scan --all
```

Após o ClawHavoc, isso é algo que você deve executar em qualquer instalação existente, não apenas nas novas. Ele detecta injeção de prompt, injeção de comando, coleta de credenciais e scope creep em solicitações OAuth — as quatro coisas que tornaram 341 skills perigosas sem parecerem perigosas.

---

Se uma skill falhar, desinstale-a e encontre uma alternativa com uma pontuação de segurança mais alta. Não há uma maneira segura de "confiar parcialmente" em uma skill que está tentando exfiltrar credenciais.

---

### 29. Escopo OAuth: solicite exatamente o que você precisa

Cada escopo que você concede é um escopo que pode ser usado indevidamente se uma skill for comprometida:

---

| Não solicite | Solicite em vez disso |
|--------------|----------------|
| `calendar:*` | `calendar:read` |
| `email:*` | `email:send` |
| `files:readwrite` | `files:read` |
| `contacts:*` | `contacts:read` |

Uma skill de leitura de calendário não precisa de acesso de escrita. Uma skill de redação de e-mails não precisa apagar mensagens. Solicitações de escopo que excedem o que a descrição da skill promete são um sinal de alerta que vale a pena investigar antes de autorizar.

---

### 30. O TinyClaw já vem com tudo isso pré-configurado

---

A configuração neste guia — configurações de timeout, políticas de cleanup, roteamento de modelos, padrões de segurança — já vem incorporada ao TinyClaw. Se você preferir pular a configuração e obter uma instância pronta para produção rodando em menos de um minuto:

```
tinyclaw.dev → escolha um modelo → escolha um canal → implantar
```

As 30 dicas acima ainda se aplicam depois que estiver em execução. Elas te dão um ponto de partida melhor.

---

---

## Pule Tudo Isso: TinyClaw {#tinyclaw}

A configuração manual do OpenClaw, se você souber os passos, leva cerca de uma hora:

| Etapa | Tempo |
|------|------|
| Provisionar um servidor | 15 min |
| Configurar chaves SSH | 10 min |
| Instalar o Node.js | 5 min |
| Instalar e configurar o OpenClaw | 17 min |
| Conectar a um provedor de IA | 10 min |
| **Total** | **~60 min** |

Se você não tiver conhecimento técnico, multiplique por 10 — você precisa aprender cada etapa antes de realizá-la.

---

O TinyClaw pula tudo isso. Os servidores já estão provisionados, o ambiente já está configurado. Você escolhe três coisas:

**Modelo:** Claude Opus 4.6, GPT-5.2 ou Gemini 3.1 Pro

**Canal:** Telegram, Discord

---

- Ler e resumir e-mails, redigir rascunhos de respostas
- Lembretes de reuniões e detecção de conflitos de agenda
- Acompanhar despesas a partir de recibos
- Pesquisar concorrentes, qualificar leads
- Resumos de standups, acompanhamento de OKRs
- Redigir rascunhos de contratos, descrições de vagas, posts para redes sociais
- Comparação de preços, busca por cupons

E qualquer outra coisa que você possa descrever em uma frase. As vagas no servidor são limitadas — verifique a disponibilidade em [tinyclaw.dev](https://tinyclaw.dev).

---

---

## Referência Rápida

| Capítulo | Dicas | Ler Quando |
|---------|------|-----------|
| Configuração | 01–08 | Antes de mexer na configuração |
| Habilidades | 09–14 | Antes de instalar qualquer coisa |
| Subagentes | 15–20 | Antes de criar fluxos de trabalho com múltiplos agentes |
| Custo | 21–25 | Após sua primeira carga de trabalho real |
| Depuração e Segurança | 26–30 | Quando as coisas quebrarem |

---

---

## Recursos

- [docs.openclaw.ai](https://docs.openclaw.ai) — documentação oficial
- [clawhub.ai](https://clawhub.ai) — habilidades com curadoria, auditadas para segurança
- [agentskills.io](https://agentskills.io) — catálogo mais amplo, cauda longa
- [tinyclaw.dev](https://tinyclaw.dev) — implantação com um clique
- [agentputer.com](https://agentputer.com) — hospedagem em nuvem 24/7

---

---

*Fontes: documentação da OpenClaw (docs.openclaw.ai) · dados de segurança da ClawHub (Fev 2026) · documentação do modelo da Anthropic (docs.anthropic.com) · documentação da context7 (context7.com)*