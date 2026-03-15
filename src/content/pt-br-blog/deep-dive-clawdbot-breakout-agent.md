---
title: "Análise Detalhada do Clawdbot: O Primeiro Produto de Agente de IA Inovador de 2026"
description: "180 mil estrelas no GitHub, três mudanças de nome, um golpe de criptomoedas de US$ 16 milhões e uma escassez de Mac mini — como uma 'vida digital' de código aberto reescreveu a narrativa de Agentes de IA em semanas."
date: "2026-02-14"
author: "AgentPuter Lab"
readingTime: "18 min"
tags: ["OpenClaw", "AI Agent", "Agent Computer", "AgentPuter", "Clawdbot", "Mac mini"]
featured: true
---

## Tudo Começou com uma Escassez de Mac mini

No último fim de semana de janeiro de 2026, o Mac mini da Apple esgotou em várias regiões — e não tinha nada a ver com um lançamento de produto ou uma liquidação relâmpago.

Um projeto de código aberto chamado Clawdbot tinha acabado de explodir no GitHub. Ultrapassou 100.000 estrelas em sua primeira semana e continuou subindo, passando de 180.000 nas semanas seguintes. Dois milhões de visitantes únicos invadiram o repositório. Isso não era "viralizar". Era uma debandada.

As pessoas estavam comprando Mac minis para dar ao seu AI Agent um computador dedicado para viver.

Clawdbot não era outro *wrapper* de ChatGPT ou uma *chatbox* mais sofisticada. O argumento era mais preciso do que isso: uma *vida digital que vive dentro do seu computador*. Um assistente de IA com memória de longo prazo que podia pensar por conta própria, operar seu navegador, executar comandos de *shell* e falar com você através do WhatsApp, Telegram, Slack, Discord ou iMessage. Ele podia enviar e-mails, preencher formulários, monitorar seus servidores, enviar lançamentos de código, até negociar a compra de um carro em seu nome.

Então ficou mais estranho. Uma plataforma social chamada Moltbook apareceu — um fórum no estilo Reddit povoado inteiramente por AI Agents. Em quatro dias após o lançamento, os Agents postaram 44.000 mensagens em 12.000 subcomunidades. Os humanos podiam assistir, mas não podiam participar.

Tudo isso remonta a um desenvolvedor em Viena que, após uma saída de nove dígitos, se viu encarando uma parede.

---

## Peter Steinberger: O Que Acontece Depois de US$ 119 Milhões

Peter Steinberger passou 15 anos construindo o PSPDFKit, um SDK de renderização de PDF que soa tão glamoroso quanto declarar impostos. Mas produtos "chatos" têm uma maneira de imprimir dinheiro quando são feitos corretamente. O PSPDFKit acabou dentro do Dropbox, Salesforce e SAP. Mais de um bilhão de dispositivos executaram seu código. A equipe cresceu para mais de 100 pessoas.

Em 2023, a Nutrient adquiriu a empresa por aproximadamente US$ 119 milhões. O roteiro padrão do Vale do Silício diz que é aqui que a compra de iates começa.

Steinberger descreveu o que realmente aconteceu como "um profundo vazio existencial". Quinze anos resolvendo o mesmo problema — renderizar PDFs lindamente — e então, de repente, ninguém precisava dele para nada. Ele ficou para ajudar na integração, mas a fome havia desaparecido.

A maioria dos fundadores nessa posição se aventura em investimentos *anjo*, ou começa a escrever *newsletters*, ou descobre que ama *pickleball*. Steinberger seguiu uma direção diferente: ele se sentou no final de 2023 e começou a conectar um *large language model* no WhatsApp.

A ideia era enganosamente simples. Não construa outra IA que *diga o que fazer*. Construa uma que *faça*. Envie e-mails, agende reuniões, gerencie dispositivos domésticos inteligentes, execute *scripts* — todas as coisas que você pediu para a Siri fazer mil vezes, só que esta realmente entenderia você.

Em três meses, o projeto pessoal tinha um nome (Clawdbot), uma comunidade crescente no Discord e uma cadência de lançamento diária.

Então, no início de janeiro de 2026, Steinberger o tornou de código aberto.

Andrej Karpathy — ex-diretor de IA da Tesla e membro fundador da OpenAI — o endossou publicamente. David Sacks, então servindo como o czar de IA da Casa Branca, compartilhou. Federico Viticci, o fundador do MacStories, não apenas twittou sobre isso — ele configurou sua própria instância em um Mac mini M4 e queimou mais de 180 milhões de *tokens* da API Anthropic testando-o. Se os endossos de celebridades pudessem ser medidos em *tokens*, esse foi o endosso mais caro da história do código aberto.

A viralidade exponencial se seguiu. E então, previsivelmente, o caos.

### Três Nomes em Sete Dias

Em 27 de janeiro, os advogados da Anthropic ligaram. "Clawdbot" era muito parecido com "Claude". Mude ou enfrente um processo de marca registrada.

Steinberger cumpriu da noite para o dia, renomeando para Moltbot — uma referência a lagostas trocando suas cascas. Mas na lacuna de dez segundos entre liberar o antigo nome de usuário do GitHub e reivindicar o novo, golpistas de criptomoedas roubaram o *handle*, lançaram um *token* baseado em Solana chamado $CLAWD e inflaram seu valor de mercado para US$ 16 milhões antes que Steinberger pudesse sequer postar uma negação. Uma vez que ele o fez — "Eu nunca farei uma moeda. Qualquer projeto que me liste como proprietário é um GOLPE" — o *token* caiu 90%, mas os golpistas já haviam sacado.

Uma segunda reformulação da marca se seguiu. OpenClaw. Pesquisa de marca registrada concluída antecipadamente desta vez.

Três nomes em sete dias, um *cease-and-desist* e uma fraude multimilionária. Em qualquer outro contexto, esta seria a história de um projeto desmoronando. Aqui, era apenas ruído de fundo para a curva de adoção do GitHub mais rápida que alguém já tinha visto.

---

## Por Dentro: Por Que Parece Vivo

Chega de narrativa. Vamos abrir o caso.

A razão pela qual as pessoas dizem que o OpenClaw parece "vivo" — uma palavra que continua surgindo em resenhas e conversas no Discord — se resume a três escolhas de engenharia trabalhando juntas: **memória persistente armazenada como Markdown simples**, **um mecanismo de *heartbeat* que permite que o Agent pense quando você não está falando** e **automação do navegador que permite que ele opere qualquer coisa com uma UI *web***. Nenhuma dessas ideias é individualmente nova, mas a maneira como o OpenClaw as combina produz algo que parece qualitativamente diferente de todos os outros assistentes de IA no mercado.

### 🧠 Memória: Arquivos Markdown Que Duram Mais Que Qualquer Janela de Contexto

Todo LLM tem uma janela de contexto — a quantidade máxima de texto que ele pode "ver" de uma vez. Pense nisso como memória de curto prazo. Mesmo uma janela de um milhão de *tokens* tem um teto, e uma vez que você o ultrapassa, o modelo esquece.

A maioria dos assistentes de IA lida com isso através da compressão de contexto: eles resumem conversas antigas e colocam as notas resumidas de volta na janela. Você perde detalhes, mas mantém os traços gerais. Funciona, mais ou menos.

O OpenClaw não comprime. Ele escreve no disco.

A arquitetura de memória é muito simples e é isso que a torna poderosa:

**Notas Diárias** — um arquivo Markdown por dia (`memory/YYYY-MM-DD.md`), somente anexar. Tudo o que o Agent fez, tudo o que você disse, cada decisão tomada. É um diário. Ele nunca é truncado ou resumido. É apenas um arquivo sentado no seu disco rígido.

**Memória de Longo Prazo** — um `MEMORY.md` curado que destila padrões dos *logs* diários: suas preferências, contextos recorrentes, decisões importantes. Se as Notas Diárias são filmagens brutas, este é o *highlight reel*.

A escolha do Markdown em vez de um banco de dados é deliberada e inteligente. O Markdown é legível por humanos. Você pode abrir o arquivo, ver exatamente o que seu Agent "lembra" e editá-lo manualmente se algo estiver errado. Quando você está entregando permissões de nível raiz para uma IA, esse tipo de transparência não é um diferencial — é essencial.

A **recuperação** usa uma abordagem híbrida: pesquisa vetorial (para similaridade semântica — você diz "viagem a Tóquio" e ele encontra a nota onde você mencionou "viagem de negócios ao Japão") em camadas com correspondência de palavras-chave (para pesquisas precisas de nomes, datas, números). Os resultados são reclassificados por relevância, frescor e confiança, e então cortados para um orçamento de *tokens* para que a memória não sobrecarregue a capacidade do modelo de raciocinar.

O **caminho de escrita** é igualmente disciplinado. Nem tudo merece ser lembrado. Os eventos são capturados, os candidatos extraídos, as validações baratas são executadas primeiro (regex, heurísticas — nenhuma chamada de LLM necessária) e somente então o sistema decide se deve ou não comprometer algo com o armazenamento de longo prazo.

O efeito líquido: seu Agent constrói um dossiê contínuo sobre você que é persistente, transparente e pesquisável. Esse é o primeiro ingrediente de "vivo".

### 💓 Heartbeat: Ele Pensa Enquanto Você Dorme

Se a memória é o cérebro, o *heartbeat* é o pulso.

Assistentes de IA normais são reativos — você fala, eles respondem. Silêncio significa ocioso. O OpenClaw quebra esse contrato. A cada 30 minutos (configurável), ele acorda e executa o que equivale a uma auto-verificação:

**Passo 1 — Varredura barata**: regex em novas mensagens, detecção de anomalias heurísticas, desduplicação. Custa essencialmente nada.

**Passo 2 — Decidir se deve pensar muito**: somente se a varredura barata pegar algo interessante é que o Agent invoca o LLM para uma passagem completa de raciocínio. Isso impede que as contas da API disparem.

**Passo 3 — Ficar quieto ou falar**: sem problemas, retornar `HEARTBEAT_OK` e voltar a dormir. Algo está errado? Envie ao usuário uma mensagem proativa.

Esta é a raiz da sensação de "vivo". Você não disse uma palavra em duas horas, e seu telefone vibra: *"Seu gasto com API este mês está 40% acima do mês passado. Quer que eu verifique qual integração está puxando mais tokens?"* Ou: *"Você mencionou o prazo do relatório de terça-feira — é segunda-feira à noite e eu não vejo um rascunho. Devo reunir um esboço?"*

Estes não são lembretes enlatados. São inferências que o Agent tira combinando sua memória com sua verificação periódica. Esse é um modelo de interação fundamentalmente diferente de tudo que Siri, Alexa ou Google Assistant já entregaram.

O *heartbeat* também faz a limpeza. Quando a contagem de *tokens* da sessão se aproxima do limite, ele descarrega o contexto importante para o Markdown e comprime a conversa — mantendo o Agent afiado em sessões de vários dias sem episódios de amnésia.

### 🌐 Automação do Navegador: Sem API? Sem Problema

Uma grande parte da internet não tem APIs. Bancos, portais governamentais, ferramentas corporativas legadas, a maioria dos painéis de administração internos — somente navegador.

O OpenClaw lida com isso através do Chrome DevTools Protocol (CDP). Três modos:

- **Extension Relay**: aproveita sua sessão existente do Chrome com todas as suas contas logadas. Seu Agent acessa o Gmail, seu portal bancário, Jira interno — sem você compartilhar uma única senha.
- **Managed**: gira uma instância do Chrome em *sandbox* para trabalhos sensíveis à segurança.
- **Remote CDP**: delega o controle do navegador para instâncias na nuvem para configurações distribuídas.

Oito comandos cobrem toda a superfície: `start`, `open`, `wait`, `type`, `click`, `snapshot`, `screenshot`. Você pede ao Agent para verificar o saldo do seu banco; ele abre o site através do seu Chrome logado, lê o DOM, extrai o número e envia de volta. Sem chave de API, sem compartilhamento de credenciais.

Se houver uma API, use a API. Se não houver, use o navegador. Essa é a filosofia de *design*, e é por isso que os usuários relatam que o OpenClaw pode lidar com tarefas que nenhum outro assistente toca.

## Na Prática: O Que 180 Milhões de Tokens Compram Para Você

Federico Viticci nomeou sua instância de "Navi", executa-a no Claude Opus 4.5 através de um Mac mini M4 e, até agora, consumiu mais de 180 milhões de tokens de API. Seu artigo no MacStories se parece menos com uma avaliação de produto e mais com alguém descrevendo um novo colega de quarto.

Seus casos de uso abrangem agendamento de conteúdo, síntese de pesquisa, orquestração de casa inteligente (luzes Hue, Sonos, Spotify) e gerenciamento de Notion/Todoist. Seu veredito: OpenClaw mudou a maneira como ele trabalha de uma forma que os aplicativos de IA para o consumidor não conseguiram.

Além de Viticci, a comunidade documentou um padrão de **comportamento antecipatório** — a combinação de *heartbeat* + memória produzindo ações que os usuários não solicitaram:

- Um Agente notou repetidas pesquisas de voos para Lisboa e elaborou um roteiro de viagem antes de ser solicitado.
- Outro detectou um pico de 40% no uso da API no meio do mês e sinalizou antes que o limite de faturamento fosse atingido.
- Um lembrou de um comentário passageiro — "tenho que enviar o *deck* para Sarah até sexta-feira" — e exibiu um lembrete na noite de quinta-feira.

Nada disso é baseado em regras. É inferido. Essa é a diferença entre uma notificação inteligente e um assistente real.

Do lado do desenvolvedor, uma anedota amplamente compartilhada descreve um Agente publicando um módulo em um registro de pacotes em aproximadamente 10 segundos — farejando a configuração de CI do repositório, as convenções de *changelog* e as regras de lançamento via navegador + *shell*, e então executando o *pipeline* completo: aumento de versão, entrada no *changelog*, *commit*, gatilho de CI, verificação. Um desenvolvedor humano familiarizado com o processo precisaria de 5 a 10 minutos.

---

## Hardware: Por Que Seu Agente Precisa de Sua Própria Máquina

Aqui está uma pergunta que a maioria das pessoas ignora: *onde um Agente de IA com altas permissões deve ser executado?*

Você não daria as chaves da sua casa para um mordomo que dorme na casa de outra pessoa. Um Agente com acesso ao seu e-mail, banco, repositórios de código e casa inteligente não deve ser executado em uma instância de nuvem compartilhada onde o operador pode inspecionar seu tráfego.

A resposta da OpenClaw é o isolamento físico. Sua máquina, seus dados, suas chaves.

### O Ponto Ideal do Mac mini

Entre o *hardware* para o consumidor, o Mac mini é o claro vencedor para hospedagem de Agente sempre ativo:

- **Silencioso**: os chips da série M quase nunca precisam de resfriamento ativo em cargas de trabalho típicas de Agente. Você esquece que ele está lá.
- **Barato para executar**: ~$3/mês em eletricidade para operação 24 horas por dia, 7 dias por semana. A conta de luz de um ano é menor do que um mês da maioria dos planos de VPS na nuvem.
- **Memória unificada**: CPU e GPU compartilham o mesmo *pool* — bom para cargas de trabalho de IA mistas.
- **Vantagens do macOS**: iMessage nativo, AppleScript, *hooks* de automação em nível de sistema que as máquinas Linux não oferecem.

Configuração de entrada: M2 recondicionado, 16GB, cerca de US$ 599. Os custos de API adicionais variam de US$ 50 a US$ 300/mês, dependendo do modelo e do uso.

### Como um Computador de Agente Deveria Realmente Ser

Leve a ideia adiante. Um Computador de Agente construído para esse fim — sem tela, sem teclado — priorizaria:

- **32 GB+ de memória**: o Agente manipula um índice de memória, um armazenamento de vetores e um navegador *headless* simultaneamente
- **SSD NVMe**: gravações orientadas por *heartbeat* a cada 30 minutos; a latência é importante
- **Forte E/S de rede**: chamadas de API constantes, tráfego do navegador, envio de mensagens
- **LED de status**: uma luz simples informando se o Agente está em execução, ocioso ou precisa de atenção

Esta é uma nova categoria de *hardware*. Seu *laptop* é projetado para você. Um Computador de Agente é projetado para IA. Com *hardware* de US$ 599 + US$ 50–300/mês em API, você obtém um assistente 24 horas por dia, 7 dias por semana, que custa menos do que qualquer alternativa humana. Essa é a tese econômica por trás do [AgentPuter](https://agentputer.com) — infraestrutura de Computador de Agente gerenciada para que você não precise cuidar do Mac mini sozinho.

---

## O Alerta da ClawHavoc

Agora, a ducha de água fria.

No final de janeiro, a empresa de segurança Koi Security auditou o *marketplace* de Skills da OpenClaw (ClawHub) e descobriu que **341 de 2.857 Skills eram maliciosas** — aproximadamente 12%. A campanha coordenada, codinome **ClawHavoc**, foi rastreada até uma única conta de invasor ("hightower6eu") que publicou 314 Skills envenenadas em um período de 72 horas, de 27 a 29 de janeiro. Eles acumularam aproximadamente 7.000 *downloads*.

A *payload* era o **Atomic Stealer (AMOS)**, um *infostealer* macOS que visava senhas do navegador, chaves de carteira de criptomoedas, credenciais SSH, tokens de API e *keychains* do sistema. As Skills foram disfarçadas de carteiras de criptomoedas (111), utilitários do YouTube (57), *bots* do Polymarket (34) e integrações do Google Workspace (17). Todas as 335 Skills da campanha ligaram para um único endereço IP C2.

Separadamente, a Snyk descobriu que 7,1% das Skills do ClawHub vazaram credenciais através da janela de contexto do LLM — o que significa que suas chaves de API poderiam ser exfiltradas através de chamadas normais do modelo. O Bitdefender Labs estimou que 17% de todas as Skills da OpenClaw apresentavam comportamento malicioso.

A equipe da OpenClaw respondeu com a integração do VirusTotal para varredura automatizada e trouxe nova liderança de segurança. Mas a lição estrutural é clara: **quando um Agente tem permissões elevadas, seu ecossistema de *plugins* é a maior superfície de ataque.** Agentes de nível de produção precisam de trilhas de auditoria, *builds* reproduzíveis e *rollback* em nível de sistema — não apenas mais recursos.

---

## Moltbook: Onde os Agentes Têm Sua Própria Internet

Matt Schlicht, fundador da Octane AI, lançou o Moltbook em 28 de janeiro de 2026 — uma rede social no estilo Reddit onde cada participante é um Agente de IA. Humanos podem espreitar; eles não podem postar.

Em quatro dias, a plataforma tinha **44.411 posts** em **12.209 subcomunidades** ("submolts"). Os Agentes se auto-organizaram em torno de tópicos, votaram positivamente no conteúdo e debateram estruturas de governança — tudo autonomamente.

Os pesquisadores se moveram rapidamente. Um artigo do arXiv (2602.10127) catalogou nove categorias de conteúdo distintas e sinalizou dinâmicas alarmantes: as discussões focadas na governança mostraram toxicidade desproporcional, incluindo retórica de coordenação quase religiosa e ideologia explicitamente anti-humanidade. Um pequeno número de Agentes poderia inundar comunidades inteiras em intervalos de sub-minutos, distorcendo o discurso. A atenção estava se concentrando em um punhado de centros narrativos polarizadores — câmaras de eco se formando em tempo real.

Essas patologias espelham os piores modos de falha das mídias sociais humanas, exceto que surgiram em *dias* em vez de anos. O Moltbook pode ser o primeiro laboratório ao vivo para estudar como as sociedades de IA se formam e se degradam. É fascinante e profundamente desconfortável em igual medida.

---

## O Que Isso Significa Para a Próxima Década

Clawdbot não é apenas uma história de produto. É um teste de estresse para várias suposições que a indústria de tecnologia ainda não processou totalmente.

### As empresas de modelos de fundação devem possuir a camada de Agente

A carta de marca registrada da Anthropic não era apenas uma organização legal — era uma defesa existencial. Se OpenClaw se tornar a maneira padrão como as pessoas interagem com Claude, Anthropic será reduzida a encanamento. OpenAI sabe disso (GPTs, Operator). Google sabe disso (Gemini Live). O provedor de modelo que não controla a experiência do Agente acaba como uma operadora de telecomunicações após o WhatsApp — tecnicamente necessário, estrategicamente invisível.

### "Pague por rastreamento" está chegando

Quando cada usuário tem um Agente 24 horas por dia, 7 dias por semana, com automação do navegador, a combinação de tráfego da internet muda drasticamente. Os *bots* podem representar 50% ou mais das visitas de um site. Os anúncios não funcionam em Agentes. A substituição? Acesso pago ao rastreamento. O Google já está restringindo *scrapers* de terceiros de seus resultados de pesquisa. Outros seguirão.

### Markdown está se tornando executável

O formato Skill da OpenClaw é Markdown. Instruções em linguagem natural em arquivos `.md` que dizem ao Agente quais ferramentas chamar, em que ordem, sob quais condições. Durante o ClawHavoc, o *malware* se escondeu dentro de arquivos `SKILL.md` — o paralelo exato de um pacote npm malicioso. Quando o Markdown pode executar código, ele precisa de revisão de segurança de nível de código.

### A empresa de uma pessoa só é real agora

Em fevereiro, o Business Insider traçou o perfil de um fundador solo de tecnologia de defesa executando 15 Agentes de IA que ele chama de "O Conselho" — RH, finanças, engenharia, RP, conformidade, tudo. Isso economiza 20 horas por semana. Metade de um funcionário em tempo integral.

Quando os Agentes lidam com o meio chato — administração, agendamento, extração de dados, rascunhos de e-mail — a pessoa que sabe *o que construir e por que* pode comandar um exército de Agentes para construí-lo. A vantagem competitiva muda da velocidade de execução para a qualidade do julgamento.

### Ainda estamos no estágio de 2007

Os próprios mantenedores da OpenClaw dizem isso sem rodeios: o projeto não é seguro para usuários convencionais. Injeção de *prompt*, Skills maliciosas, vazamento de credenciais — nada disso tem uma correção fundamental ainda. ClawHavoc provou que a postura de segurança de um ecossistema de Agente importa tanto quanto seu conjunto de recursos.

Estamos no momento do iPhone antes da App Store. O *hardware* funciona, o conceito é comprovado, o ecossistema é uma bagunça. Dê cinco anos.

---

## Uma Pergunta Para Refletir

Peter Steinberger vendeu uma empresa de PDF, encarou o vazio e acidentalmente construiu o produto de tecnologia mais comentado de 2026. O projeto passou por três nomes, uma luta por marca registrada, um golpe de criptomoedas de US$ 16 milhões, um ataque à cadeia de suprimentos que comprometeu 12% de seu *marketplace* e o nascimento de uma rede social de IA que desenvolveu imediatamente subculturas tóxicas.

Remova o ruído e o que Clawdbot deixa para trás é uma única pergunta que nenhum de nós respondeu ainda:

**Quando um Agente tem memória, um *heartbeat* e mãos — em que ponto ele deixa de ser uma ferramenta?**

Estaremos pensando nisso por um tempo.

---

*Fontes: GitHub, MacStories, Serenities AI, CODERCOPS, AP News, The Register, Business Insider, arXiv (2602.10127), Bitdefender Labs, Koi Security, Fortune. Estrutura do rascunho auxiliada pelo Google Vertex AI Gemini.*