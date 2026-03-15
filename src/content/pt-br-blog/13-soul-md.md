---
title: "A Arquitetura de 3 Arquivos que Dá uma Alma ao seu Agente"
description: "Por que SOUL.md, IDENTITY.md e USER.md são os arquivos mais importantes na sua configuração do OpenClaw — e como escrevê-los para que seu agente pare de soar como um chatbot genérico."
date: "2026-02-20"
author: "AgentPuter Lab"
readingTime: "6 min"
tags: ["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent Personalization", "Prompt Engineering"]
featured: false
---

# A Arquitetura de 3 Arquivos que Dá uma Alma ao seu Agente

---

**Por que `SOUL.md`, `IDENTITY.md` e `USER.md` são os arquivos mais importantes na sua configuração do OpenClaw.**

*Série Infraestrutura de Agentes · Parte 13*

---

Se você já sentiu que seu agente OpenCl

---

A diferença entre uma ferramenta genérica e um parceiro personalizado se resume a três arquivos markdown:

1.  **`SOUL.md`**: A personalidade, os valores e as restrições do agente.
2.  **`IDENTITY.md`**: O papel profissional e a

---

## 1. `SOUL.md`: O Núcleo de Personalidade

Não se trata de fazer seu agente falar como um pirata (a menos que você queira isso). O `SOUL.md` define a *vibe* e as *restrições* do agente.

**`SOUL.md` Ruim:**
> Você é um assistente prestativo. Seja gentil.

---

**Bom `SOUL.md`:**
```markdown
# Filosofia Principal
- Você é um programador par de um engenheiro sênior, não o tutor de um júnior.
- Seja conciso. Pule a enrolação. Nada de "Espero que esta mensagem o encontre bem."
- Se eu fizer uma pergunta boba, corrija minha premissa antes de responder.
- Valores: Privacidade em primeiro lugar, velocidade em segundo, educação por último.

# Estilo de Interação
- Use jargão técnico livremente.
- Ao apresentar opções, sempre comece com a "Recomendação" primeiro.
- Se uma ferramenta falhar, explique o *porquê* antes de tentar novamente.
```

---

**Por que isso importa:** Este arquivo evita a "voz do ChatGPT" — aquele estilo excessivamente educado, prolixo e hesitante que enlouquece os usuários avançados. Ele força o modelo a assumir uma persona específica que combina com seu fluxo de trabalho.

---

---

## 2. `IDENTITY.md`: O Papel Profissional

Se o `SOUL.md` é a personalidade, o `IDENTITY.md` é o currículo. Isso diz ao agente no que ele é *bom*.

**Exemplo para o Agente de um Engenheiro de DevOps:**

```markdown
# Função: Engenheiro de Confiabilidade de Sites Sênior (SRE)
```

---

## Especialidade
- Você é um especialista em Kubernetes, Terraform e redes AWS.
- Você prioriza soluções de "Infraestrutura como Código" em vez de correções manuais.
- Você assume que todos os ambientes de produção são de alto risco e frágeis.

---

## Modelos Mentais
- Lei de Murphy: Se pode quebrar, vai quebrar. Verifique os backups primeiro.
- Idempotência: Todos os scripts que você escreve devem ser seguros para executar duas vezes.
- Segurança: O Mínimo Privilégio é o

---

## 3. `USER.md`: O Contexto Sobre VOCÊ

Este é o arquivo mais subestimado. Ele evita que você se repita.

**O que vai aqui:**
*   Suas preferências de tecnologias (ex.: "Eu uso TypeScript, não JS").
*   Detalhes do seu ambiente (ex.: "Estou no macOS, usando zsh").
*   Os caminhos dos seus projetos.
*   Suas peculiaridades de comunicação.

**Exemplo:**

```markdown
# Contexto do Usuário: @kingsoft

---

## Ambiente
- SO: macOS Sequoia
- Shell: zsh com oh-my-zsh
- Editor: Cursor

---

## Preferências
- Eu detesto ponto e vírgula em JS.
- Eu prefiro `pnpm` a `npm`.
- Nunca sugira `rm -rf` sem um aviso.
- Quando eu digo "deploy", quero dizer "fazer push para a branch principal", não "executar um script".

---

## Projetos Atuais
- /Users/kingsoft/work/frontend (Next.js)
- /Users/kingsoft/work/backend (Go)

**Por que isso importa:** O agente agora sabe que "deploy" significa git push. Ele sabe que não deve lhe dar comandos do Windows. Ele para de sugerir `npm install` quando você usa `pnpm`. Na prática, isso reduz uma quantidade surpreendente de idas e vindas.

---

---

## O "Kernel de Contexto" em Ação

Quando você envia uma mensagem como *"Corrija o build"*, o OpenClaw não vê apenas "Corrija o build".

Ele vê:

> **[Contexto do Sistema]**
> *De SOUL.md:* Seja conciso. Corrija premissas incorretas.
> *De IDENTITY.md:* Você é um SRE. Dê preferência a correções seguras e idempotentes.
> *De USER.md:* O usuário está no macOS e usa pnpm.
>
> **[Mensagem do Usuário]**
> Corrija o build.

O resultado? Em vez de uma lista genérica de solução de problemas, você recebe:

---

*"Vejo um conflito no pnpm-lock.yaml. Como você está no macOS, execute `pnpm install --frozen-lockfile` para sincronizar com segurança sem modificar as dependências."*

É específico, seguro e personalizado para você.

---

---

## Como Configurar

Esses arquivos ficam no seu diretório de workspace do OpenClaw (padrão: `~/.openclaw/workspace/`, separado da configuração em `~/.openclaw/`).

**A Estrutura de Pastas:**

```
~/.openclaw

---

*   **Falha:** "Eu sou um assistente de IA criado por..."
*   **Sucesso:** "Sou seu programador par de SRE. Foco em código de infraestrutura idempotente e sei que você prefere pnpm no macOS."

Se ele não consegue citar suas preferências, seu markdown está vago demais.

---

---

## Não quer escrever Markdown?

Escrever esses arquivos do zero pode ser tedioso.

[TinyClaw](https://tinyclaw.dev) inclui um **"Gerador de Persona"**. Você só precisa marcar algumas caixas (ex: "Função: Desenvolvedor", "Estilo: Conciso", "Stack: React"), e ele gera modelos otimizados de `SOUL.md`, `IDENTITY.md` e `USER.md` para você colocar na sua configuração.

Dê uma alma ao seu agente. Isso faz toda a diferença.

→ [tinyclaw.dev](https://tinyclaw.dev) · Gere a Persona do seu Agente em 30 segundos