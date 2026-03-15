import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, '../src/pages');
const APP_URL = 'https://app.agentputer.com';

// ── PRICING TRANSLATIONS ─────────────────────────────────────────────────────
const pricingLangs = {
  ja: {
    layoutTitle: '料金プラン - AgentPuter | 常時稼働AIエージェント',
    layoutDesc: 'AgentPuter Pro：月額$29.99。24時間365日稼働するあなた専用のAIエージェント。Claude 4.5内蔵、15以上のメッセージチャンネル、500以上のスキル、コーディング不要。',
    schemaDesc: '24時間365日稼働するあなた専用のAIエージェント。Claude 4.5内蔵。2分でセットアップ完了。',
    tags: "['AgentPuter', '料金', 'AIエージェント', 'AI自動化', 'ノーコード']",
    pricingLabel: '料金：透明',
    h1: 'シンプルで明瞭な料金体系',
    heroSub: '隠れた費用なし。予期しない請求なし。いつでもキャンセル可能。',
    heroBadge: 'Proプランが提供開始',
    heroEnd: '2分でスタート。',
    stratH3: '💡 すべて含まれています — サインアップしてすぐ開始',
    proAllIn: 'Pro（オールインワン）',
    proAllInDesc: 'AIモデル、クラウドホスティング、メッセージチャンネル — すべてバンドル。APIキー不要。設定不要。すぐに動作。',
    or: 'または',
    starterLabel: 'Starter（近日公開）',
    starterDesc: 'すでにAI APIキーをお持ちですか？低価格でプラットフォームをご利用ください — 月額$9。',
    starterBadge: 'STARTER — 近日公開',
    perMonth: '/月',
    starterFor: 'すでにAI APIキーをお持ちのユーザー向け',
    f1:'✓ 常時稼働 — 24/7停止なし', f2:'✓ 15以上のメッセージチャンネル', f3:'✓ 500以上の組み込みスキル',
    f4:'✓ ビジュアルダッシュボード', f5:'✓ 専用クラウド環境', f6:'✓ コーディング不要',
    fNo:'✗ AIモデルは含まれない', fNoSub:'ご自身のAPIキーを使用',
    waitlist: 'ウェイトリストに登録',
    nowLive: '★ 提供中',
    proFor: '眠らない専用AIエージェント。すべて含まれます。',
    pf1:'✓ 常時稼働 — 24/7、停止なし', pf2:'✓ Telegram、WhatsApp、Slackなどに接続',
    pf3:'✓ 500以上の組み込みスキル（調査、翻訳、要約…）', pf4:'✓ ビジュアルダッシュボード — コーディング不要',
    pf5:'✓ 専用クラウドコンピュータ、完全マネージド', pf6:'✓ 2分でセットアップ完了',
    pf7:'✓ Claude 4.5 AI内蔵', pf8:'約$20/月相当、バンドル無料', pf9:'APIキー不要',
    cta: '今すぐ始める — $29.99/月', ctaSub: 'いつでもキャンセル · コーディング不要',
    teamBadge:'TEAM — 近日公開', teamFor:'チームで複数のAIエージェントを運用',
    tf1:'✓ 3つのAIエージェントが24/7稼働', tf2:'✓ エージェントごとに高パフォーマンス',
    tf3:'✓ 全メッセージチャンネル対応', tf4:'✓ 500以上の組み込みスキル',
    tf5:'✓ 優先サポート', tf6:'✓ マルチエージェントワークフロー',
    tf7:'✓ AIモデル含む', tf8:'3倍のAI使用量', tf9:'Claude 4.5 + Opusモデル',
    whyLabel:'// なぜ AGENTPUTER か',
    diy:'vs 自分で構築する場合', diyBad:'何時間もの設定 + 技術知識が必要',
    diyGood:'AgentPuter Pro $29.99/月 = 2分でセットアップ。コーディング不要。サーバー管理不要。すぐに動作。',
    chatgpt:'vs ChatGPT / Claude サブスクリプション', chatgptBad:'$20/月 = 質問して、回答を得るだけ。',
    chatgptGood:'AgentPuter Pro $29.99/月 = 24/7自律稼働するAI、アプリに接続し、自ら行動。',
    alwaysLabel:'// 「常時稼働」が重要な理由', alwaysH2:'あなたが眠っている間もAIは動き続ける。',
    alwaysP:'ChatGPTはブラウザを閉じると停止します。AgentPuterは違います。24時間、監視・応答・行動を続けます。',
    s1:'2分でセットアップ', s1p:'クリック、接続、完了。ダウンロード不要、コーディング不要、待ち時間なし。',
    s2:'15以上のチャンネル', s2p:'Telegram、WhatsApp、Slack、Discord、Emailなど — すべて接続。',
    s3:'Claude 4.5内蔵', s3p:'最高水準のAIが含まれています。別途サブスクリプション不要。',
    faqH2:'よくある質問',
    q1:'技術的なスキルは必要ですか？', a1:'不要です。AgentPuterはコードを書かない方向けに設計されています。登録して、AIモデルを選び、メッセージアプリを接続すれば完了です。すべて管理されます。',
    q2:'どのAIモデルが含まれますか？', a2:'ProプランにはAnthropicのClaude 4.5が含まれます — 現在最も優れたAIモデルの一つです。約$20/月相当のAI使用量がサブスクリプションにバンドルされています。APIキー不要。',
    q3:'いつでもキャンセルできますか？', a3:'はい — ダッシュボードからいつでもキャンセルできます。現在の請求期間が終了するまでAIエージェントは稼働し続けます。キャンセル料なし、縛りなし。',
    q4:'ChatGPTとの違いは何ですか？', a4:'ChatGPTはチャットボット — 質問して答えを得るだけです。AgentPuterは24/7自律稼働するAIエージェントを提供し、あなたのアプリに接続し、席を離れていても行動します。',
    q5:'AIエージェントは実際に何ができますか？', a5:'500以上の組み込みスキル：調査、翻訳、要約、メール下書き、データ分析、スケジュール管理、市場監視など。自然言語で新しいタスクを教えることもできます — コード不要。',
    ctaCmd:'> 開始する準備はできていますか', ctaH2:'今すぐ始めましょう',
    ctaP:'月額$29.99。2分でセットアップ。AIエージェントは眠りません。',
    btnStart:'[今すぐ始める]', btnAsk:'[質問する]',
    ctaNote:'// いつでもキャンセル · コーディング不要 · 隠れた費用なし',
  },
  ko: {
    layoutTitle: '요금제 - AgentPuter | 항상 작동하는 AI 에이전트',
    layoutDesc: 'AgentPuter Pro: 월 $29.99. 24/7 작동하는 나만의 AI 에이전트. Claude 4.5 포함, 15개 이상 메시지 채널, 500개 이상 스킬, 코딩 불필요.',
    schemaDesc: '24시간 365일 작동하는 나만의 AI 에이전트. Claude 4.5 포함. 2분 만에 설정 완료.',
    tags: "['AgentPuter', '요금제', 'AI 에이전트', 'AI 자동화', '노코드']",
    pricingLabel: '요금제: 투명',
    h1: '단순하고 명확한 요금제',
    heroSub: '숨겨진 요금 없음. 예상치 못한 청구 없음. 언제든지 취소 가능.',
    heroBadge: 'Pro 플랜 출시',
    heroEnd: '2분 만에 시작하세요.',
    stratH3: '💡 모든 것이 포함되어 있습니다 — 가입 즉시 시작',
    proAllIn: 'Pro (올인원)',
    proAllInDesc: 'AI 모델, 클라우드 호스팅, 메시지 채널 — 모두 포함. API 키 불필요. 설정 불필요. 바로 작동.',
    or: '또는',
    starterLabel: 'Starter (출시 예정)',
    starterDesc: '이미 AI API 키가 있으신가요? 더 저렴한 가격으로 플랫폼 이용 — 월 $9.',
    starterBadge: 'STARTER — 출시 예정',
    perMonth: '/월',
    starterFor: 'AI API 키가 있는 사용자를 위한 플랜',
    f1:'✓ 항상 작동 — 24/7 중단 없음', f2:'✓ 15개 이상 메시지 채널', f3:'✓ 500개 이상 기본 스킬',
    f4:'✓ 비주얼 대시보드', f5:'✓ 전용 클라우드 환경', f6:'✓ 코딩 불필요',
    fNo:'✗ AI 모델 미포함', fNoSub:'본인 API 키 사용',
    waitlist: '대기자 명단 등록',
    nowLive: '★ 출시 완료',
    proFor: '절대 잠들지 않는 나만의 AI 에이전트. 모든 것이 포함.',
    pf1:'✓ 항상 작동 — 24/7, 중단 없음', pf2:'✓ Telegram, WhatsApp, Slack 등 연결',
    pf3:'✓ 500개 이상 기본 스킬 (조사, 번역, 요약...)', pf4:'✓ 비주얼 대시보드 — 코딩 불필요',
    pf5:'✓ 전용 클라우드 컴퓨터, 완전 관리형', pf6:'✓ 2분 만에 설정 완료',
    pf7:'✓ Claude 4.5 AI 포함', pf8:'약 $20/월 가치, 무료 번들', pf9:'API 키 불필요',
    cta: '지금 시작 — $29.99/월', ctaSub: '언제든지 취소 · 코딩 불필요',
    teamBadge:'TEAM — 출시 예정', teamFor:'팀을 위한 다중 AI 에이전트 운영',
    tf1:'✓ 3개 AI 에이전트 24/7 작동', tf2:'✓ 에이전트당 더 높은 성능',
    tf3:'✓ 모든 메시지 채널', tf4:'✓ 500개 이상 기본 스킬',
    tf5:'✓ 우선 지원', tf6:'✓ 멀티 에이전트 워크플로우',
    tf7:'✓ AI 모델 포함', tf8:'3배 AI 사용량', tf9:'Claude 4.5 + Opus 모델',
    whyLabel:'// 왜 AGENTPUTER인가',
    diy:'vs 직접 구축', diyBad:'수 시간의 설정 + 기술 지식 필요',
    diyGood:'AgentPuter Pro $29.99/월 = 2분 만에 설정. 코딩 불필요. 서버 관리 불필요. 바로 작동.',
    chatgpt:'vs ChatGPT / Claude 구독', chatgptBad:'$20/월 = 질문하면 답변. 그게 전부.',
    chatgptGood:'AgentPuter Pro $29.99/월 = 24/7 스스로 작동하는 AI, 앱에 연결하고 행동 실행.',
    alwaysLabel:'// 항상 켜짐이 중요한 이유', alwaysH2:'당신이 자는 동안에도 AI는 계속 일합니다.',
    alwaysP:'ChatGPT는 브라우저를 닫으면 중단됩니다. AgentPuter는 그렇지 않습니다. 24시간 모니터링, 응답, 행동을 수행합니다.',
    s1:'2분 설정', s1p:'클릭, 연결, 완료. 다운로드 불필요, 코딩 불필요, 대기 불필요.',
    s2:'15개 이상 채널', s2p:'Telegram, WhatsApp, Slack, Discord, Email — 모두 연결.',
    s3:'Claude 4.5 내장', s3p:'최고 수준 AI 포함. 별도 구독 불필요.',
    faqH2:'자주 묻는 질문',
    q1:'기술적인 지식이 필요한가요?', a1:'필요 없습니다. AgentPuter는 코딩을 하지 않는 분들을 위해 설계되었습니다. 가입하고, AI 모델을 선택하고, 메시지 앱을 연결하면 완료입니다.',
    q2:'어떤 AI 모델이 포함되나요?', a2:'Pro 플랜에는 Anthropic의 Claude 4.5가 포함됩니다. 약 $20/월 가치의 AI 사용량이 구독에 번들로 포함됩니다. API 키 불필요.',
    q3:'언제든지 취소할 수 있나요?', a3:'네 — 대시보드에서 언제든지 취소할 수 있습니다. AI 에이전트는 현재 결제 기간이 끝날 때까지 활성 상태를 유지합니다. 취소 수수료 없음, 약정 없음.',
    q4:'ChatGPT와 어떻게 다른가요?', a4:'ChatGPT는 챗봇입니다 — 질문하면 답변합니다. AgentPuter는 24/7 자율적으로 실행되는 AI 에이전트를 제공하며, 앱에 연결하고 컴퓨터 앞에 없어도 행동합니다.',
    q5:'AI 에이전트가 실제로 무엇을 할 수 있나요?', a5:'500개 이상의 기본 스킬: 조사, 번역, 요약, 이메일 초안 작성, 데이터 분석, 일정 관리, 시장 모니터링 등. 자연어로 새로운 작업을 가르칠 수도 있습니다.',
    ctaCmd:'> 시작할 준비가 되셨나요', ctaH2:'지금 시작하세요',
    ctaP:'월 $29.99. 2분 만에 설정. AI 에이전트는 잠들지 않습니다.',
    btnStart:'[지금 시작]', btnAsk:'[질문하기]',
    ctaNote:'// 언제든지 취소 · 코딩 불필요 · 숨겨진 요금 없음',
  },
  es: {
    layoutTitle: 'Precios - AgentPuter | Tu Agente de IA Siempre Activo',
    layoutDesc: 'AgentPuter Pro: $29.99/mes. Tu agente de IA personal activo 24/7. Claude 4.5 incluido, más de 15 canales de mensajería, 500+ habilidades. Sin programación.',
    schemaDesc: 'Tu propio agente de IA que trabaja 24/7. Claude 4.5 incluido. Configuración en 2 minutos.',
    tags: "['AgentPuter', 'Precios', 'Agente IA', 'Automatización IA', 'Sin código']",
    pricingLabel: 'PRECIOS: TRANSPARENTE',
    h1: 'Precios Simples y Predecibles',
    heroSub: 'Sin cargos ocultos. Sin facturas sorpresa. Cancela cuando quieras.',
    heroBadge: 'Plan Pro disponible',
    heroEnd: 'empieza en 2 minutos.',
    stratH3: '💡 Todo incluido — regístrate y empieza',
    proAllIn: 'Pro (Todo en uno)',
    proAllInDesc: 'Modelo IA, alojamiento en la nube, canales de mensajería — todo incluido. Sin claves API. Sin configuración. Funciona de inmediato.',
    or: 'O',
    starterLabel: 'Starter (próximamente)',
    starterDesc: '¿Ya tienes tu propia clave de API de IA? Usa nuestra plataforma a menor precio — $9/mes.',
    starterBadge: 'STARTER — PRÓXIMAMENTE',
    perMonth: '/mes',
    starterFor: 'Para usuarios que ya tienen una clave de API de IA',
    f1:'✓ Siempre activo — funciona 24/7', f2:'✓ Más de 15 canales de mensajería', f3:'✓ Más de 500 habilidades integradas',
    f4:'✓ Panel visual', f5:'✓ Entorno cloud dedicado', f6:'✓ Sin programación',
    fNo:'✗ Modelo IA NO incluido', fNoSub:'Usas tu propia clave API',
    waitlist: 'Unirse a la lista de espera',
    nowLive: '★ DISPONIBLE AHORA',
    proFor: 'Tu agente de IA que nunca duerme. Todo incluido.',
    pf1:'✓ Siempre activo — funciona 24/7, nunca para', pf2:'✓ Conecta con Telegram, WhatsApp, Slack y más',
    pf3:'✓ Más de 500 habilidades integradas (investigar, traducir, resumir...)', pf4:'✓ Panel visual — sin programación',
    pf5:'✓ Computadora cloud dedicada, totalmente gestionada', pf6:'✓ Configuración en 2 minutos',
    pf7:'✓ Claude 4.5 IA incluido', pf8:'Valor ~$20/mes, incluido gratis', pf9:'Sin clave API necesaria',
    cta: 'Empezar — $29.99/mes', ctaSub: 'Cancela cuando quieras · Sin programación',
    teamBadge:'TEAM — PRÓXIMAMENTE', teamFor:'Ejecuta múltiples agentes de IA para tu equipo',
    tf1:'✓ 3 agentes de IA funcionando 24/7', tf2:'✓ Mayor rendimiento por agente',
    tf3:'✓ Todos los canales de mensajería', tf4:'✓ Más de 500 habilidades integradas',
    tf5:'✓ Soporte prioritario', tf6:'✓ Flujos de trabajo multiagente',
    tf7:'✓ Modelo IA INCLUIDO', tf8:'3x cuota de uso de IA', tf9:'Modelos Claude 4.5 + Opus',
    whyLabel:'// POR QUÉ AGENTPUTER',
    diy:'vs Hacerlo tú mismo', diyBad:'Horas de configuración + conocimientos técnicos necesarios',
    diyGood:'AgentPuter Pro $29.99/mes = 2 minutos para configurar. Sin programación. Sin gestión de servidores. Funciona de inmediato.',
    chatgpt:'vs Suscripción a ChatGPT / Claude', chatgptBad:'$20/mes = Preguntas, responde. Eso es todo.',
    chatgptGood:'AgentPuter Pro $29.99/mes = IA que trabaja sola 24/7, conecta con tus apps y toma acción.',
    alwaysLabel:'// POR QUÉ IMPORTA "SIEMPRE ACTIVO"', alwaysH2:'Tu IA sigue trabajando mientras duermes.',
    alwaysP:'ChatGPT se detiene cuando cierras el navegador. AgentPuter no. Monitorea, responde y actúa las 24 horas.',
    s1:'Configuración en 2 minutos', s1p:'Haz clic, conecta, listo. Sin descargas, sin código, sin esperas.',
    s2:'Más de 15 canales', s2p:'Telegram, WhatsApp, Slack, Discord, Email — todos conectados.',
    s3:'Claude 4.5 integrado', s3p:'IA de primer nivel incluida. Sin suscripción separada.',
    faqH2:'Preguntas Frecuentes',
    q1:'¿Necesito conocimientos técnicos?', a1:'No. AgentPuter está diseñado para personas que no programan. Regístrate, elige tu modelo de IA, conecta tu app de mensajería — listo. Todo está gestionado para ti.',
    q2:'¿Qué modelo de IA está incluido?', a2:'El plan Pro incluye Claude 4.5 de Anthropic — uno de los modelos de IA más capaces disponibles. Aproximadamente $20/mes de uso de IA está incluido en tu suscripción. Sin clave API necesaria.',
    q3:'¿Puedo cancelar en cualquier momento?', a3:'Sí — cancela cuando quieras desde tu panel. Tu agente de IA permanece activo hasta el final del período de facturación actual. Sin cargos por cancelación, sin compromisos.',
    q4:'¿En qué se diferencia de ChatGPT?', a4:'ChatGPT es un chatbot — preguntas y responde. AgentPuter te da un agente de IA que funciona 24/7 por sí solo, conecta con tus apps y actúa incluso cuando no estás en tu computadora.',
    q5:'¿Qué puede hacer realmente el agente de IA?', a5:'Más de 500 habilidades integradas: investigación, traducción, resumen, borradores de email, análisis de datos, programación, monitoreo de mercado y más. También puedes enseñarle nuevas tareas en lenguaje natural — sin código.',
    ctaCmd:'> listo_para_empezar', ctaH2:'¿Listo para empezar?',
    ctaP:'$29.99/mes. Configuración en 2 minutos. Tu agente de IA nunca duerme.',
    btnStart:'[EMPEZAR AHORA]', btnAsk:'[HACER UNA PREGUNTA]',
    ctaNote:'// Cancela cuando quieras · Sin programación · Sin cargos ocultos',
  },
  'pt-br': {
    layoutTitle: 'Preços - AgentPuter | Seu Agente de IA Sempre Ativo',
    layoutDesc: 'AgentPuter Pro: $29.99/mês. Seu agente de IA pessoal ativo 24/7. Claude 4.5 incluso, mais de 15 canais de mensagens, 500+ habilidades. Sem programação.',
    schemaDesc: 'Seu próprio agente de IA que trabalha 24/7. Claude 4.5 incluído. Configuração em 2 minutos.',
    tags: "['AgentPuter', 'Preços', 'Agente IA', 'Automação IA', 'Sem código']",
    pricingLabel: 'PREÇOS: TRANSPARENTE',
    h1: 'Preços Simples e Previsíveis',
    heroSub: 'Sem taxas ocultas. Sem cobranças surpresa. Cancele quando quiser.',
    heroBadge: 'Plano Pro disponível',
    heroEnd: 'comece em 2 minutos.',
    stratH3: '💡 Tudo incluído — cadastre-se e comece',
    proAllIn: 'Pro (Tudo em um)',
    proAllInDesc: 'Modelo IA, hospedagem em nuvem, canais de mensagens — tudo incluído. Sem chaves de API. Sem configuração. Funciona de imediato.',
    or: 'OU',
    starterLabel: 'Starter (em breve)',
    starterDesc: 'Já tem sua própria chave de API de IA? Use nossa plataforma por um preço menor — $9/mês.',
    starterBadge: 'STARTER — EM BREVE',
    perMonth: '/mês',
    starterFor: 'Para usuários que já têm uma chave de API de IA',
    f1:'✓ Sempre ativo — funciona 24/7', f2:'✓ Mais de 15 canais de mensagens', f3:'✓ Mais de 500 habilidades integradas',
    f4:'✓ Painel visual', f5:'✓ Ambiente cloud dedicado', f6:'✓ Sem programação',
    fNo:'✗ Modelo IA NÃO incluído', fNoSub:'Use sua própria chave API',
    waitlist: 'Entrar na lista de espera',
    nowLive: '★ DISPONÍVEL AGORA',
    proFor: 'Seu agente de IA que nunca dorme. Tudo incluído.',
    pf1:'✓ Sempre ativo — funciona 24/7, nunca para', pf2:'✓ Conecta com Telegram, WhatsApp, Slack e mais',
    pf3:'✓ Mais de 500 habilidades integradas (pesquisa, tradução, resumo...)', pf4:'✓ Painel visual — sem programação',
    pf5:'✓ Computador cloud dedicado, totalmente gerenciado', pf6:'✓ Configuração em 2 minutos',
    pf7:'✓ Claude 4.5 IA incluído', pf8:'Valor ~$20/mês, incluído gratuitamente', pf9:'Sem chave API necessária',
    cta: 'Começar — $29.99/mês', ctaSub: 'Cancele quando quiser · Sem programação',
    teamBadge:'TEAM — EM BREVE', teamFor:'Execute múltiplos agentes de IA para sua equipe',
    tf1:'✓ 3 agentes de IA funcionando 24/7', tf2:'✓ Maior desempenho por agente',
    tf3:'✓ Todos os canais de mensagens', tf4:'✓ Mais de 500 habilidades integradas',
    tf5:'✓ Suporte prioritário', tf6:'✓ Fluxos de trabalho multiagente',
    tf7:'✓ Modelo IA INCLUÍDO', tf8:'3x cota de uso de IA', tf9:'Modelos Claude 4.5 + Opus',
    whyLabel:'// POR QUE AGENTPUTER',
    diy:'vs Fazer você mesmo', diyBad:'Horas de configuração + conhecimentos técnicos necessários',
    diyGood:'AgentPuter Pro $29.99/mês = 2 minutos para configurar. Sem programação. Sem gerenciamento de servidores. Funciona.',
    chatgpt:'vs Assinatura ChatGPT / Claude', chatgptBad:'$20/mês = Você pergunta, ele responde. Só isso.',
    chatgptGood:'AgentPuter Pro $29.99/mês = IA que trabalha sozinha 24/7, conecta com seus apps e age.',
    alwaysLabel:'// POR QUE ESTAR SEMPRE ATIVO IMPORTA', alwaysH2:'Sua IA continua trabalhando enquanto você dorme.',
    alwaysP:'O ChatGPT para quando você fecha o navegador. O AgentPuter não. Ele monitora, responde e age 24 horas por dia.',
    s1:'Configuração em 2 minutos', s1p:'Clique, conecte, pronto. Sem downloads, sem código, sem espera.',
    s2:'Mais de 15 canais', s2p:'Telegram, WhatsApp, Slack, Discord, Email — todos conectados.',
    s3:'Claude 4.5 integrado', s3p:'IA de primeira linha incluída. Sem assinatura separada.',
    faqH2:'Perguntas Frequentes',
    q1:'Preciso de habilidades técnicas?', a1:'Não. O AgentPuter foi projetado para pessoas que não programam. Cadastre-se, escolha seu modelo de IA, conecte seu app de mensagens — pronto. Tudo é gerenciado para você.',
    q2:'Qual modelo de IA está incluído?', a2:'O plano Pro inclui o Claude 4.5 da Anthropic — um dos modelos de IA mais capazes disponíveis. Aproximadamente $20/mês de uso de IA está incluído na sua assinatura. Sem chave API necessária.',
    q3:'Posso cancelar a qualquer momento?', a3:'Sim — cancele quando quiser pelo seu painel. Seu agente de IA fica ativo até o final do período de cobrança atual. Sem taxas de cancelamento, sem compromisso.',
    q4:'Como isso é diferente do ChatGPT?', a4:'O ChatGPT é um chatbot — você pergunta, ele responde. O AgentPuter te dá um agente de IA que funciona 24/7 por conta própria, conecta com seus apps e age mesmo quando você não está no computador.',
    q5:'O que o agente de IA realmente pode fazer?', a5:'Mais de 500 habilidades integradas: pesquisa, tradução, resumo, rascunhos de email, análise de dados, agendamento, monitoramento de mercado e mais. Você também pode ensiná-lo novas tarefas em linguagem natural — sem código.',
    ctaCmd:'> pronto_para_comecar', ctaH2:'Pronto para começar?',
    ctaP:'$29.99/mês. Configuração em 2 minutos. Seu agente de IA nunca dorme.',
    btnStart:'[COMEÇAR AGORA]', btnAsk:'[FAZER UMA PERGUNTA]',
    ctaNote:'// Cancele quando quiser · Sem programação · Sem taxas ocultas',
  },
  de: {
    layoutTitle: 'Preise - AgentPuter | Ihr Immer-Aktiver KI-Agent',
    layoutDesc: 'AgentPuter Pro: 29,99$/Monat. Ihr eigener KI-Agent, der 24/7 arbeitet. Claude 4.5 inklusive, 15+ Messaging-Kanäle, 500+ Skills. Kein Coding.',
    schemaDesc: 'Ihr eigener KI-Agent, der 24/7 arbeitet. Claude 4.5 inklusive. Einrichtung in 2 Minuten.',
    tags: "['AgentPuter', 'Preise', 'KI-Agent', 'KI-Automatisierung', 'No-Code']",
    pricingLabel: 'PREISE: TRANSPARENT',
    h1: 'Einfache, Vorhersehbare Preise',
    heroSub: 'Keine versteckten Gebühren. Keine überraschenden Rechnungen. Jederzeit kündbar.',
    heroBadge: 'Pro-Plan jetzt verfügbar',
    heroEnd: 'in 2 Minuten starten.',
    stratH3: '💡 Alles inklusive — einfach anmelden und loslegen',
    proAllIn: 'Pro (Alles-in-einem)',
    proAllInDesc: 'KI-Modell, Cloud-Hosting, Messaging-Kanäle — alles gebündelt. Keine API-Schlüssel. Keine Konfiguration. Funktioniert sofort.',
    or: 'ODER',
    starterLabel: 'Starter (demnächst)',
    starterDesc: 'Haben Sie bereits einen eigenen KI-API-Schlüssel? Nutzen Sie unsere Plattform zum günstigeren Preis — 9$/Mo.',
    starterBadge: 'STARTER — DEMNÄCHST',
    perMonth: '/Monat',
    starterFor: 'Für Nutzer, die bereits einen KI-API-Schlüssel haben',
    f1:'✓ Immer aktiv — läuft 24/7', f2:'✓ 15+ Messaging-Kanäle', f3:'✓ 500+ integrierte Skills',
    f4:'✓ Visuelles Dashboard', f5:'✓ Dedizierte Cloud-Umgebung', f6:'✓ Kein Coding erforderlich',
    fNo:'✗ KI-Modell NICHT enthalten', fNoSub:'Sie nutzen Ihren eigenen API-Schlüssel',
    waitlist: 'Warteliste beitreten',
    nowLive: '★ JETZT VERFÜGBAR',
    proFor: 'Ihr eigener KI-Agent, der nie schläft. Alles inklusive.',
    pf1:'✓ Immer aktiv — 24/7, stoppt nie', pf2:'✓ Verbindet sich mit Telegram, WhatsApp, Slack & mehr',
    pf3:'✓ 500+ integrierte Skills (Recherche, Übersetzen, Zusammenfassen...)', pf4:'✓ Visuelles Dashboard — kein Coding nötig',
    pf5:'✓ Dedizierter Cloud-Computer, vollständig verwaltet', pf6:'✓ Einrichtung in 2 Minuten',
    pf7:'✓ Claude 4.5 KI inklusive', pf8:'~20$/Monat Wert, kostenlos gebündelt', pf9:'Kein API-Schlüssel erforderlich',
    cta: 'Jetzt starten — 29,99$/Monat', ctaSub: 'Jederzeit kündbar · Kein Coding nötig',
    teamBadge:'TEAM — DEMNÄCHST', teamFor:'Mehrere KI-Agenten für Ihr Team betreiben',
    tf1:'✓ 3 KI-Agenten laufen 24/7', tf2:'✓ Höhere Leistung pro Agent',
    tf3:'✓ Alle Messaging-Kanäle', tf4:'✓ 500+ integrierte Skills',
    tf5:'✓ Prioritäts-Support', tf6:'✓ Multi-Agent-Workflows',
    tf7:'✓ KI-Modell INKLUSIVE', tf8:'3x KI-Nutzungskontingent', tf9:'Claude 4.5 + Opus Modelle',
    whyLabel:'// WARUM AGENTPUTER',
    diy:'vs. Selbst aufbauen', diyBad:'Stunden der Einrichtung + technisches Wissen erforderlich',
    diyGood:"AgentPuter Pro 29,99$/Monat = 2 Minuten Einrichtung. Kein Coding. Kein Server-Management. Funktioniert einfach.",
    chatgpt:"vs. ChatGPT / Claude Abonnement", chatgptBad:"20$/Monat = Sie tippen, es antwortet. Das war's.",
    chatgptGood:'AgentPuter Pro 29,99$/Monat = KI, die 24/7 eigenständig arbeitet, sich mit Ihren Apps verbindet und handelt.',
    alwaysLabel:'// WARUM "IMMER AKTIV" WICHTIG IST', alwaysH2:'Ihre KI arbeitet weiter, während Sie schlafen.',
    alwaysP:'ChatGPT stoppt, wenn Sie den Browser schließen. AgentPuter nicht. Es überwacht, reagiert und handelt rund um die Uhr.',
    s1:'2-Minuten-Einrichtung', s1p:'Klicken, verbinden, fertig. Keine Downloads, kein Coding, kein Warten.',
    s2:'15+ Kanäle', s2p:'Telegram, WhatsApp, Slack, Discord, E-Mail — alles verbunden.',
    s3:'Claude 4.5 integriert', s3p:'Top-KI inklusive. Kein separates Abonnement nötig.',
    faqH2:'Häufig gestellte Fragen',
    q1:'Benötige ich technische Kenntnisse?', a1:'Nein. AgentPuter ist für Menschen konzipiert, die nicht programmieren. Anmelden, KI-Modell wählen, Messaging-App verbinden — fertig. Alles wird für Sie verwaltet.',
    q2:'Welches KI-Modell ist enthalten?', a2:'Der Pro-Plan enthält Claude 4.5 von Anthropic — eines der leistungsfähigsten verfügbaren KI-Modelle. Etwa 20$/Monat KI-Nutzung ist in Ihrem Abonnement gebündelt. Kein API-Schlüssel erforderlich.',
    q3:'Kann ich jederzeit kündigen?', a3:'Ja — jederzeit über Ihr Dashboard kündigen. Ihr KI-Agent bleibt bis zum Ende des aktuellen Abrechnungszeitraums aktiv. Keine Stornogebühren, keine Bindung.',
    q4:'Wie unterscheidet sich das von ChatGPT?', a4:'ChatGPT ist ein Chatbot — Sie fragen, es antwortet. AgentPuter gibt Ihnen einen KI-Agenten, der 24/7 eigenständig läuft, sich mit Ihren Apps verbindet und auch handelt, wenn Sie nicht am Computer sind.',
    q5:'Was kann der KI-Agent wirklich tun?', a5:'500+ integrierte Skills: Recherche, Übersetzung, Zusammenfassung, E-Mail-Entwürfe, Datenanalyse, Terminplanung, Marktüberwachung und mehr. Sie können ihm auch neue Aufgaben in natürlicher Sprache beibringen — kein Code nötig.',
    ctaCmd:'> bereit_zu_starten', ctaH2:'Bereit loszulegen?',
    ctaP:'29,99$/Monat. Einrichtung in 2 Minuten. Ihr KI-Agent schläft nie.',
    btnStart:'[JETZT STARTEN]', btnAsk:'[FRAGE STELLEN]',
    ctaNote:'// Jederzeit kündbar · Kein Coding nötig · Keine versteckten Gebühren',
  },
  fr: {
    layoutTitle: 'Tarifs - AgentPuter | Votre Agent IA Toujours Actif',
    layoutDesc: "AgentPuter Pro : 29,99$/mois. Votre agent IA personnel actif 24h/24. Claude 4.5 inclus, plus de 15 canaux de messagerie, 500+ compétences. Sans programmation.",
    schemaDesc: "Votre propre agent IA qui travaille 24h/24. Claude 4.5 inclus. Configuration en 2 minutes.",
    tags: "['AgentPuter', 'Tarifs', 'Agent IA', 'Automatisation IA', 'Sans code']",
    pricingLabel: 'TARIFS : TRANSPARENTS',
    h1: 'Des Tarifs Simples et Prévisibles',
    heroSub: 'Pas de frais cachés. Pas de factures surprises. Annulez à tout moment.',
    heroBadge: 'Plan Pro disponible',
    heroEnd: 'démarrez en 2 minutes.',
    stratH3: "💡 Tout est inclus — inscrivez-vous et commencez",
    proAllIn: 'Pro (Tout-en-un)',
    proAllInDesc: 'Modèle IA, hébergement cloud, canaux de messagerie — tout inclus. Pas de clés API. Pas de configuration. Fonctionne immédiatement.',
    or: 'OU',
    starterLabel: 'Starter (bientôt)',
    starterDesc: "Vous avez déjà votre propre clé API IA ? Utilisez notre plateforme à un prix réduit — 9$/mois.",
    starterBadge: 'STARTER — BIENTÔT',
    perMonth: '/mois',
    starterFor: 'Pour les utilisateurs qui ont déjà une clé API IA',
    f1:'✓ Toujours actif — fonctionne 24h/24', f2:'✓ Plus de 15 canaux de messagerie', f3:'✓ Plus de 500 compétences intégrées',
    f4:'✓ Tableau de bord visuel', f5:'✓ Environnement cloud dédié', f6:'✓ Sans programmation',
    fNo:"✗ Modèle IA NON inclus", fNoSub:'Vous utilisez votre propre clé API',
    waitlist: "Rejoindre la liste d'attente",
    nowLive: '★ DISPONIBLE MAINTENANT',
    proFor: "Votre agent IA qui ne dort jamais. Tout inclus.",
    pf1:"✓ Toujours actif — 24h/24, ne s'arrête jamais", pf2:'✓ Connecté à Telegram, WhatsApp, Slack et plus',
    pf3:'✓ 500+ compétences intégrées (recherche, traduction, résumé...)', pf4:'✓ Tableau de bord visuel — sans programmation',
    pf5:'✓ Ordinateur cloud dédié, entièrement géré', pf6:'✓ Configuration en 2 minutes',
    pf7:'✓ Claude 4.5 IA inclus', pf8:'Valeur ~20$/mois, inclus gratuitement', pf9:'Aucune clé API requise',
    cta: 'Commencer — 29,99$/mois', ctaSub: 'Annulez quand vous voulez · Sans programmation',
    teamBadge:'TEAM — BIENTÔT', teamFor:"Gérez plusieurs agents IA pour votre équipe",
    tf1:'✓ 3 agents IA fonctionnant 24h/24', tf2:'✓ Meilleures performances par agent',
    tf3:'✓ Tous les canaux de messagerie', tf4:'✓ 500+ compétences intégrées',
    tf5:'✓ Support prioritaire', tf6:'✓ Workflows multi-agents',
    tf7:'✓ Modèle IA INCLUS', tf8:"3x quota d'utilisation IA", tf9:'Modèles Claude 4.5 + Opus',
    whyLabel:'// POURQUOI AGENTPUTER',
    diy:'vs Le faire soi-même', diyBad:'Des heures de configuration + connaissances techniques requises',
    diyGood:'AgentPuter Pro 29,99$/mois = 2 minutes de configuration. Sans code. Sans gestion de serveur. Ça marche.',
    chatgpt:"vs Abonnement ChatGPT / Claude", chatgptBad:"20$/mois = Vous tapez, il répond. C'est tout.",
    chatgptGood:"AgentPuter Pro 29,99$/mois = Une IA qui travaille seule 24h/24, connectée à vos apps et qui agit.",
    alwaysLabel:'// POURQUOI "TOUJOURS ACTIF" EST IMPORTANT', alwaysH2:'Votre IA continue de travailler pendant que vous dormez.',
    alwaysP:"ChatGPT s'arrête quand vous fermez le navigateur. AgentPuter non. Il surveille, répond et agit 24 heures sur 24.",
    s1:'Configuration en 2 minutes', s1p:"Cliquez, connectez, c'est fait. Sans téléchargement, sans code, sans attente.",
    s2:'15+ canaux', s2p:'Telegram, WhatsApp, Slack, Discord, Email — tout connecté.',
    s3:'Claude 4.5 intégré', s3p:"IA haut de gamme incluse. Pas d'abonnement séparé.",
    faqH2:'Questions Fréquentes',
    q1:'Ai-je besoin de compétences techniques ?', a1:"Non. AgentPuter est conçu pour les personnes qui ne programment pas. Inscrivez-vous, choisissez votre modèle IA, connectez votre app de messagerie — c'est fait. Tout est géré pour vous.",
    q2:'Quel modèle IA est inclus ?', a2:"Le plan Pro inclut Claude 4.5 d'Anthropic — l'un des modèles IA les plus performants disponibles. Environ 20$/mois d'utilisation IA est inclus dans votre abonnement. Aucune clé API requise.",
    q3:'Puis-je annuler à tout moment ?', a3:"Oui — annulez quand vous voulez depuis votre tableau de bord. Votre agent IA reste actif jusqu'à la fin de la période de facturation en cours. Pas de frais d'annulation, pas d'engagement.",
    q4:'En quoi est-ce différent de ChatGPT ?', a4:"ChatGPT est un chatbot — vous posez une question, il répond. AgentPuter vous donne un agent IA qui fonctionne 24h/24 de manière autonome, se connecte à vos apps et agit même quand vous n'êtes pas devant votre ordinateur.",
    q5:"Que peut vraiment faire l'agent IA ?", a5:'500+ compétences intégrées : recherche, traduction, résumé, rédaction de mails, analyse de données, planification, surveillance du marché et plus. Vous pouvez aussi lui apprendre de nouvelles tâches en langage naturel — sans code.',
    ctaCmd:'> prêt_à_démarrer', ctaH2:'Prêt à commencer ?',
    ctaP:'29,99$/mois. Configuration en 2 minutes. Votre agent IA ne dort jamais.',
    btnStart:'[COMMENCER MAINTENANT]', btnAsk:'[POSER UNE QUESTION]',
    ctaNote:'// Annulez quand vous voulez · Sans programmation · Sans frais cachés',
  },
};

function buildPricing(t, lang) {
  return `---
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/${lang}/Header.astro';
import Footer from '../../components/${lang}/Footer.astro';
import MatrixRain from '../../components/MatrixRain.astro';

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'AgentPuter Pro',
  description: '${t.schemaDesc}',
  brand: { '@type': 'Brand', name: 'AgentPuter' },
  offers: {
    '@type': 'Offer',
    price: '29.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2027-12-31',
    url: 'https://app.agentputer.com/subscribe',
  },
};
const APP_URL = 'https://app.agentputer.com';
---
<Layout title="${t.layoutTitle}" description="${t.layoutDesc}" tags={${t.tags}}>
  <fragment slot="head"><script type="application/ld+json" set:html={JSON.stringify(pricingSchema)} /></fragment>
  <MatrixRain />
  <Header activePage="pricing" />
  <main class="relative z-10">
    <section class="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-dark-primary via-dark-primary to-dark-secondary"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,65,0.06),transparent_50%)]"></div>
      <div class="relative max-w-7xl mx-auto px-6 lg:px-20 text-center">
        <div class="font-mono text-accent text-xs font-semibold tracking-[0.2em] mb-6">${t.pricingLabel}</div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">${t.h1}</h1>
        <p class="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          ${t.heroSub}<br /><span class="text-accent font-semibold">${t.heroBadge}</span> — ${t.heroEnd}
        </p>
      </div>
    </section>
    <section class="pb-8">
      <div class="max-w-4xl mx-auto px-6 lg:px-20">
        <div class="bg-accent/5 border border-accent/15 rounded-xl p-6 md:p-8">
          <h3 class="text-white font-bold text-lg mb-4">${t.stratH3}</h3>
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            <div><span class="text-accent font-semibold text-sm">${t.proAllIn}</span><p class="text-text-muted text-sm mt-1 leading-relaxed">${t.proAllInDesc}</p></div>
            <span class="text-text-dark font-bold text-sm hidden md:block">${t.or}</span>
            <div><span class="text-terminal-blue font-semibold text-sm">${t.starterLabel}</span><p class="text-text-muted text-sm mt-1 leading-relaxed">${t.starterDesc}</p></div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-16">
      <div class="max-w-7xl mx-auto px-6 lg:px-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end max-w-5xl mx-auto">
          <div class="bg-dark-secondary rounded-2xl border border-dark-tertiary p-8 relative opacity-80">
            <div class="font-mono text-text-muted text-xs font-semibold tracking-[0.15em] mb-6">${t.starterBadge}</div>
            <div class="flex items-end gap-1 mb-2"><span class="text-5xl font-bold text-white">$9</span><span class="text-text-dark text-base mb-1">${t.perMonth}</span></div>
            <p class="text-text-muted text-sm mb-6">${t.starterFor}</p>
            <div class="border-t border-dark-tertiary mb-6"></div>
            <ul class="space-y-3 text-sm mb-8">
              <li class="text-text-muted">${t.f1}</li><li class="text-text-muted">${t.f2}</li><li class="text-text-muted">${t.f3}</li>
              <li class="text-text-muted">${t.f4}</li><li class="text-text-muted">${t.f5}</li><li class="text-text-muted">${t.f6}</li>
              <li class="pt-3 border-t border-dark-tertiary text-text-dark">${t.fNo}</li>
              <li class="text-text-dark pl-4">${t.fNoSub}</li>
            </ul>
            <button disabled class="w-full py-3.5 rounded-lg border border-dark-tertiary text-text-muted font-semibold text-sm cursor-not-allowed">${t.waitlist}</button>
          </div>
          <div class="bg-dark-secondary rounded-2xl border-2 border-accent p-8 relative shadow-lg shadow-accent/10 md:-mt-4">
            <div class="flex items-center gap-3 mb-6"><span class="text-terminal-magenta font-mono text-xs font-bold">${t.nowLive}</span><span class="font-mono text-text-muted text-xs font-semibold tracking-[0.15em]">PRO</span></div>
            <div class="flex items-end gap-1 mb-2"><span class="text-6xl font-bold text-white">$29.99</span><span class="text-text-dark text-base mb-2">${t.perMonth}</span></div>
            <p class="text-text-muted text-sm mb-6">${t.proFor}</p>
            <div class="border-t border-dark-tertiary mb-6"></div>
            <ul class="space-y-3 text-sm mb-8">
              <li class="text-text-muted">${t.pf1}</li><li class="text-text-muted">${t.pf2}</li><li class="text-text-muted">${t.pf3}</li>
              <li class="text-text-muted">${t.pf4}</li><li class="text-text-muted">${t.pf5}</li><li class="text-text-muted">${t.pf6}</li>
              <li class="pt-3 border-t border-dark-tertiary text-accent">${t.pf7}</li>
              <li class="text-accent/70 pl-4">${t.pf8}</li><li class="text-accent/70 pl-4">${t.pf9}</li>
            </ul>
            <a href={\`\${APP_URL}/sign-up\`} class="block w-full py-3.5 rounded-lg bg-accent text-dark-primary font-bold text-sm text-center hover:bg-accent-dark transition-colors">${t.cta}</a>
            <p class="text-text-dark text-xs text-center mt-3 font-mono">${t.ctaSub}</p>
          </div>
          <div class="bg-dark-secondary rounded-2xl border border-dark-tertiary p-8 relative opacity-80">
            <div class="font-mono text-text-muted text-xs font-semibold tracking-[0.15em] mb-6">${t.teamBadge}</div>
            <div class="flex items-end gap-1 mb-2"><span class="text-4xl font-bold text-white">$59</span><span class="text-text-dark text-base mb-1">${t.perMonth}</span></div>
            <p class="text-text-muted text-sm mb-6">${t.teamFor}</p>
            <div class="border-t border-dark-tertiary mb-6"></div>
            <ul class="space-y-3 text-sm mb-8">
              <li class="text-text-muted">${t.tf1}</li><li class="text-text-muted">${t.tf2}</li><li class="text-text-muted">${t.tf3}</li>
              <li class="text-text-muted">${t.tf4}</li><li class="text-text-muted">${t.tf5}</li><li class="text-text-muted">${t.tf6}</li>
              <li class="pt-3 border-t border-dark-tertiary text-text-muted">${t.tf7}</li>
              <li class="text-text-dark pl-4">${t.tf8}</li><li class="text-text-dark pl-4">${t.tf9}</li>
            </ul>
            <button disabled class="w-full py-3.5 rounded-lg border border-dark-tertiary text-text-muted font-semibold text-sm cursor-not-allowed">${t.waitlist}</button>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-16">
      <div class="max-w-5xl mx-auto px-6 lg:px-20">
        <div class="font-mono text-accent text-xs font-semibold tracking-[0.3em] mb-8">${t.whyLabel}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-dark-secondary rounded-xl border border-dark-tertiary p-6">
            <span class="text-text-muted text-xs font-semibold">${t.diy}</span>
            <p class="text-error font-bold mt-2">${t.diyBad}</p>
            <p class="text-success text-sm mt-2 leading-relaxed">${t.diyGood}</p>
          </div>
          <div class="bg-dark-secondary rounded-xl border border-dark-tertiary p-6">
            <span class="text-text-muted text-xs font-semibold">${t.chatgpt}</span>
            <p class="text-error font-bold mt-2">${t.chatgptBad}</p>
            <p class="text-success text-sm mt-2 leading-relaxed">${t.chatgptGood}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-20">
      <div class="max-w-5xl mx-auto px-6 lg:px-20">
        <div class="font-mono text-accent text-xs font-semibold tracking-[0.3em] mb-4">${t.alwaysLabel}</div>
        <h2 class="text-white text-2xl font-bold mb-3">${t.alwaysH2}</h2>
        <p class="text-text-muted text-sm mb-8 leading-relaxed">${t.alwaysP}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-dark-secondary rounded-xl border border-accent/20 p-5"><span class="text-2xl mb-2 block">⚡</span><span class="text-accent font-bold text-lg">${t.s1}</span><p class="text-text-muted text-sm mt-1">${t.s1p}</p></div>
          <div class="bg-dark-secondary rounded-xl border border-terminal-blue/20 p-5"><span class="text-2xl mb-2 block">🔌</span><span class="text-terminal-blue font-bold text-lg">${t.s2}</span><p class="text-text-muted text-sm mt-1">${t.s2p}</p></div>
          <div class="bg-dark-secondary rounded-xl border border-terminal-magenta/20 p-5"><span class="text-2xl mb-2 block">🧠</span><span class="text-terminal-magenta font-bold text-lg">${t.s3}</span><p class="text-text-muted text-sm mt-1">${t.s3p}</p></div>
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-16 bg-dark-secondary/50">
      <div class="max-w-3xl mx-auto px-6 lg:px-20">
        <h2 class="text-2xl font-bold text-white mb-8 text-center">${t.faqH2}</h2>
        <div class="space-y-4" id="faq-list">
          <div class="faq-item border border-dark-tertiary rounded-lg overflow-hidden"><button class="faq-toggle w-full text-left px-6 py-4 flex items-center justify-between text-white font-medium hover:bg-dark-tertiary/50 transition-colors"><span>${t.q1}</span><span class="faq-icon text-accent font-mono text-sm">+</span></button><div class="faq-content hidden px-6 pb-4 text-text-muted text-sm leading-relaxed">${t.a1}</div></div>
          <div class="faq-item border border-dark-tertiary rounded-lg overflow-hidden"><button class="faq-toggle w-full text-left px-6 py-4 flex items-center justify-between text-white font-medium hover:bg-dark-tertiary/50 transition-colors"><span>${t.q2}</span><span class="faq-icon text-accent font-mono text-sm">+</span></button><div class="faq-content hidden px-6 pb-4 text-text-muted text-sm leading-relaxed">${t.a2}</div></div>
          <div class="faq-item border border-dark-tertiary rounded-lg overflow-hidden"><button class="faq-toggle w-full text-left px-6 py-4 flex items-center justify-between text-white font-medium hover:bg-dark-tertiary/50 transition-colors"><span>${t.q3}</span><span class="faq-icon text-accent font-mono text-sm">+</span></button><div class="faq-content hidden px-6 pb-4 text-text-muted text-sm leading-relaxed">${t.a3}</div></div>
          <div class="faq-item border border-dark-tertiary rounded-lg overflow-hidden"><button class="faq-toggle w-full text-left px-6 py-4 flex items-center justify-between text-white font-medium hover:bg-dark-tertiary/50 transition-colors"><span>${t.q4}</span><span class="faq-icon text-accent font-mono text-sm">+</span></button><div class="faq-content hidden px-6 pb-4 text-text-muted text-sm leading-relaxed">${t.a4}</div></div>
          <div class="faq-item border border-dark-tertiary rounded-lg overflow-hidden"><button class="faq-toggle w-full text-left px-6 py-4 flex items-center justify-between text-white font-medium hover:bg-dark-tertiary/50 transition-colors"><span>${t.q5}</span><span class="faq-icon text-accent font-mono text-sm">+</span></button><div class="faq-content hidden px-6 pb-4 text-text-muted text-sm leading-relaxed">${t.a5}</div></div>
        </div>
      </div>
    </section>
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-6 lg:px-20">
        <div class="relative overflow-hidden rounded-2xl bg-dark-secondary border-2 border-accent/50 p-8 md:p-16 glow-accent neon-box">
          <div class="absolute inset-0 opacity-5"><div class="absolute inset-0" style="background-image: linear-gradient(rgba(0,255,65,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.1) 1px, transparent 1px); background-size: 20px 20px;"></div></div>
          <div class="relative text-center">
            <div class="font-mono text-accent text-sm mb-4">${t.ctaCmd}</div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-accent text-glow-strong mb-4 font-mono">${t.ctaH2}</h2>
            <p class="text-text-secondary text-lg mb-10 max-w-xl mx-auto font-mono">${t.ctaP}</p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={\`\${APP_URL}/sign-up\`} class="btn-primary text-sm py-4 px-10 font-mono">${t.btnStart}</a>
              <a href="mailto:oscarzamora199907@gmail.com" class="btn-secondary text-sm py-4 px-10 font-mono">${t.btnAsk}</a>
            </div>
            <p class="text-text-muted text-xs font-mono mt-6">${t.ctaNote}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</Layout>
<script is:inline>
  document.querySelectorAll('.faq-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item'); var content = item.querySelector('.faq-content'); var icon = item.querySelector('.faq-icon');
      document.querySelectorAll('.faq-item').forEach(function(other) { if (other !== item) { other.querySelector('.faq-content').classList.add('hidden'); other.querySelector('.faq-icon').textContent = '+'; } });
      content.classList.toggle('hidden'); icon.textContent = content.classList.contains('hidden') ? '+' : '\u2212';
    });
  });
</script>`;
}

// ── TOOLS PAGE TRANSLATIONS ──────────────────────────────────────────────────
const toolsLangs = {
  zh: { layoutTitle:'工具与用例 - AgentPuter | 您的 AI 助手能做什么？', layoutDesc:'探索 500+ 种您的全天候 AI 助手可以完成的任务。研究、自动化、沟通、分析——无需编程。查看真实用例。', tags:"['AgentPuter', 'AI 工具', 'AI 用例', 'AI 自动化', '无代码 AI', 'AI 助手']", skillsLabel:'500+ 内置技能', h1:'您的 AI 助手能做什么？', heroPrimary:'一个助手，无数用例。', heroSub:'用自然语言告诉它你需要什么——它会搞定剩下的。', heroNote:'您的 AI 助手全天候运行，连接您常用的应用，即使在您睡觉时也能处理任务。无需编程，无需配置，只需描述您的需求。', compLabel:'// 旧方式 vs 新方式', compH2:'停止手动处理一切', withoutLabel:'没有 AGENTPUTER', withLabel:'使用 AGENTPUTER', w1:'每天早上手动查看新闻网站', w2:'在应用之间复制粘贴以翻译消息', w3:'花数小时阅读和总结报告', w4:'离开时错过重要更新', w5:'AI 只在您坐在电脑前时才工作', wg1:'AI 监控新闻并发送每日简报', wg2:'在所有渠道自动翻译消息', wg3:'发送 PDF，几秒内获得摘要', wg4:'AI 全天候工作——即使在周末', wg5:'您的助手运行在自己的云端——始终在线', usecasesLabel:'// 用例', usecasesH2:'一个助手，数百种用例', usecasesNote:'通过自然语言教 AI 助手新任务，无需编程。', usecasesBottom:'// 您可以通过自然语言添加任意数量的用例', howLabel:'// 工作原理', howH2:'3 步。2 分钟。完成。', step1:'注册', step1p:'创建账户。浏览无需信用卡。', step2:'连接您的应用', step2p:'连接 Telegram、WhatsApp、Slack 或 15+ 渠道中的任意一个。', step3:'告诉它要做什么', step3p:'用自然语言描述任务。您的 AI 助手处理剩下的——全天候。', channelLabel:'// 在您工作的地方工作', channelH2:'连接 15+ 渠道', channelNote:'您的 AI 助手在您已使用的地方与您见面——无需学习新应用。', ctaH2:'您的 AI 助手等待着您', ctaP:'$29.99/月。2 分钟完成设置。全天候运行。<br />无需编程。无需 API Key。一切已包含。', btnStart:'[立即开始 — $29.99/月]', btnPricing:'[查看价格]', ctaNote:'// 随时取消 · 无需编程 · 无隐藏费用',
    cats: [
      { category:'研究与分析', items:['全天候监控行业新闻','追踪竞争对手动态','总结长篇报告与 PDF','实时翻译文档','汇编每日市场简报','研究公司与趋势'] },
      { category:'沟通', items:['自动起草邮件回复','管理 Telegram/Slack 消息','实时翻译对话','回答客户问题','安排跟进事项','总结长篇对话记录'] },
      { category:'效率提升', items:['整理日历与任务','自动记录会议纪要','设置智能提醒','从笔记创建演示文稿','跨项目追踪截止日期','按计划生成报告'] },
      { category:'财务与商业', items:['追踪支出与收据','监控股票价格与提醒','生成发票','比较报价与提案','计算 ROI 方案','汇总财务报告'] },
      { category:'内容与写作', items:['起草博客文章','撰写社交媒体内容','创建新闻通讯','编辑与校对文档','生成产品描述','撰写合同与 NDA'] },
      { category:'数据与自动化', items:['抓取与整理网页数据','监控网站变化','自动分类收到的信息','生成每日/每周摘要','交叉参考多个来源','构建自定义工作流'] },
    ],
    ticker: ['阅读并总结邮件','自动起草回复','翻译消息','监控股票价格','追踪竞争对手新闻','总结报告','安排会议','生成发票','研究竞争对手','撰写社交帖子','创建演示文稿','在线寻找最优价格'],
  },
  ja: { layoutTitle:'ツールと活用事例 - AgentPuter | AIエージェントで何ができる？', layoutDesc:'常時稼働AIエージェントができる500以上のことを発見。調査、自動化、コミュニケーション、分析 — コーディング不要。実際の活用事例をご覧ください。', tags:"['AgentPuter', 'AIツール', 'AI活用事例', 'AI自動化', 'ノーコードAI', 'AIエージェント']", skillsLabel:'500以上の組み込みスキル', h1:'AIエージェントで何ができる？', heroPrimary:'1つのエージェント、無数の活用事例。', heroSub:'自然な言葉で必要なことを伝えるだけ — 残りはエージェントが対処します。', heroNote:'AIエージェントは24時間稼働し、お気に入りのアプリに接続し、眠っている間もタスクを処理します。コーディング不要。設定不要。やりたいことを説明するだけ。', compLabel:'// 従来の方法 vs 新しい方法', compH2:'手作業をやめましょう', withoutLabel:'AGENTPUTER なし', withLabel:'AGENTPUTER あり', w1:'毎朝手動でニュースサイトを確認', w2:'メッセージを翻訳するためにアプリ間でコピー＆ペースト', w3:'レポートの閲覧と要約に何時間も費やす', w4:'離席中に重要な更新を見逃す', w5:'AIはパソコンの前にいるときだけ動作する', wg1:'AIがニュースを監視し、毎日ブリーフィングを送信', wg2:'すべてのチャンネルでメッセージを自動翻訳', wg3:'PDFを送信すれば数秒で要約を取得', wg4:'AIは24時間稼働 — 週末も', wg5:'エージェントは専用クラウドで稼働 — 常時オン', usecasesLabel:'// 活用事例', usecasesH2:'1つのエージェント、何百もの活用事例', usecasesNote:'自然言語でAIエージェントに新しいタスクを教えます。コード不要。', usecasesBottom:'// 自然言語で好きなだけ活用事例を追加できます', howLabel:'// 使い方', howH2:'3ステップ。2分。完了。', step1:'サインアップ', step1p:'アカウントを作成。閲覧にクレジットカード不要。', step2:'アプリを接続', step2p:'Telegram、WhatsApp、Slackまたは15以上のチャンネルのいずれかをリンク。', step3:'やることを指示', step3p:'平易な言葉でタスクを説明。AIエージェントが残りを処理します — 24時間。', channelLabel:'// あなたが働く場所で機能', channelH2:'15以上のチャンネルに接続', channelNote:'AIエージェントはあなたがすでに使っている場所で対応します — 新しいアプリを覚える必要なし。', ctaH2:'AIエージェントがあなたを待っています', ctaP:'$29.99/月。2分でセットアップ。24時間稼働。<br />コーディング不要。APIキー不要。すべて含まれています。', btnStart:'[今すぐ始める — $29.99/月]', btnPricing:'[料金を見る]', ctaNote:'// いつでもキャンセル · コーディング不要 · 隠れた費用なし',
    cats: [
      { category:'調査・分析', items:['24時間業界ニュースを監視','競合他社の動向を追跡','長いレポートやPDFを要約','文書をリアルタイムで翻訳','毎日の市場ブリーフィングを作成','企業やトレンドを調査'] },
      { category:'コミュニケーション', items:['メール返信を自動で下書き','Telegram/Slackメッセージを管理','会話をリアルタイムで翻訳','顧客の質問に回答','フォローアップをスケジュール','長いチャットスレッドを要約'] },
      { category:'生産性', items:['カレンダーとタスクを整理','会議メモを自動で記録','スマートリマインダーを設定','メモからプレゼンテーションを作成','プロジェクト全体の締め切りを追跡','定期的にレポートを生成'] },
      { category:'財務・ビジネス', items:['経費と領収書を追跡','株価と通知を監視','請求書を生成','見積もりと提案を比較','ROIシナリオを計算','財務報告を要約'] },
      { category:'コンテンツ・ライティング', items:['ブログ記事を下書き','ソーシャルメディアコンテンツを作成','ニュースレターを作成','文書を編集・校正','商品説明を生成','契約書やNDAを作成'] },
      { category:'データ・自動化', items:['ウェブデータをスクレイピング・整理','ウェブサイトの変化を監視','受信情報を自動分類','毎日/毎週のダイジェストを生成','複数のソースをクロスリファレンス','カスタムワークフローを構築'] },
    ],
    ticker: ['メールを読んで要約','返信を自動で下書き','メッセージを翻訳','株価を監視','競合他社のニュースを追跡','レポートを要約','会議をスケジュール','請求書を生成','競合他社を調査','ソーシャル投稿を作成','プレゼンテーションを作成','最安値をオンラインで探す'],
  },
  ko: { layoutTitle:'도구 및 활용 사례 - AgentPuter | AI 에이전트로 무엇을 할 수 있나요?', layoutDesc:'항상 작동하는 AI 에이전트가 할 수 있는 500가지 이상을 발견하세요. 연구, 자동화, 소통, 분석 — 코딩 불필요. 실제 활용 사례를 확인하세요.', tags:"['AgentPuter', 'AI 도구', 'AI 활용 사례', 'AI 자동화', '노코드 AI', 'AI 에이전트']", skillsLabel:'500개 이상의 기본 스킬', h1:'AI 에이전트로 무엇을 할 수 있나요?', heroPrimary:'하나의 에이전트, 수천 가지 활용 사례.', heroSub:'자연어로 필요한 것을 말하면 — 나머지는 에이전트가 처리합니다.', heroNote:'AI 에이전트는 24/7 작동하며, 즐겨 사용하는 앱에 연결하고, 잠자는 동안에도 작업을 처리합니다. 코딩 불필요. 설정 불필요. 원하는 것을 설명하기만 하면 됩니다.', compLabel:'// 기존 방식 vs 새로운 방식', compH2:'모든 것을 수동으로 처리하는 것을 그만하세요', withoutLabel:'AGENTPUTER 없이', withLabel:'AGENTPUTER 사용 시', w1:'매일 아침 수동으로 뉴스 사이트 확인', w2:'메시지 번역을 위해 앱 간 복사-붙여넣기', w3:'보고서 읽기와 요약에 몇 시간 소비', w4:'자리를 비울 때 중요한 업데이트 놓침', w5:'AI는 컴퓨터 앞에 있을 때만 작동', wg1:'AI가 뉴스를 모니터링하고 매일 브리핑 전송', wg2:'모든 채널에서 메시지 자동 번역', wg3:'PDF 전송하면 몇 초 만에 요약 수신', wg4:'AI는 24/7 작동 — 주말에도', wg5:'에이전트가 자체 클라우드에서 실행 — 항상 켜짐', usecasesLabel:'// 활용 사례', usecasesH2:'하나의 에이전트, 수백 가지 활용 사례', usecasesNote:'자연어로 AI 에이전트에게 새로운 작업을 가르치세요. 코드 불필요.', usecasesBottom:'// 자연어를 통해 원하는 만큼 활용 사례를 추가할 수 있습니다', howLabel:'// 작동 방식', howH2:'3단계. 2분. 완료.', step1:'가입', step1p:'계정을 만드세요. 둘러보는 데 신용카드 불필요.', step2:'앱 연결', step2p:'Telegram, WhatsApp, Slack 또는 15개 이상의 채널 중 하나를 연결하세요.', step3:'할 일 말하기', step3p:'평이한 언어로 작업을 설명하세요. AI 에이전트가 나머지를 처리합니다 — 24/7.', channelLabel:'// 당신이 일하는 곳에서 작동', channelH2:'15개 이상 채널에 연결', channelNote:'AI 에이전트가 이미 사용 중인 곳에서 만납니다 — 새로운 앱을 배울 필요 없음.', ctaH2:'AI 에이전트가 기다리고 있습니다', ctaP:'월 $29.99. 2분 만에 설정. 24/7 작동.<br />코딩 불필요. API 키 불필요. 모든 것이 포함되어 있습니다.', btnStart:'[지금 시작 — $29.99/월]', btnPricing:'[요금 보기]', ctaNote:'// 언제든지 취소 · 코딩 불필요 · 숨겨진 요금 없음',
    cats: [
      { category:'연구 및 분석', items:['24/7 업계 뉴스 모니터링','경쟁사 업데이트 추적','긴 보고서 및 PDF 요약','실시간 문서 번역','매일 시장 브리핑 작성','기업 및 트렌드 조사'] },
      { category:'소통', items:['이메일 답장 자동 초안','Telegram/Slack 메시지 관리','실시간 대화 번역','고객 질문 답변','후속 조치 일정 잡기','긴 채팅 스레드 요약'] },
      { category:'생산성', items:['캘린더 및 작업 정리','회의 메모 자동 기록','스마트 알림 설정','메모에서 프레젠테이션 만들기','프로젝트 전반의 마감일 추적','일정에 맞게 보고서 생성'] },
      { category:'재무 및 비즈니스', items:['지출 및 영수증 추적','주가 및 알림 모니터링','인보이스 생성','견적 및 제안서 비교','ROI 시나리오 계산','재무 보고서 요약'] },
      { category:'콘텐츠 및 작성', items:['블로그 게시물 초안 작성','소셜 미디어 콘텐츠 작성','뉴스레터 만들기','문서 편집 및 교정','제품 설명 생성','계약서 및 NDA 작성'] },
      { category:'데이터 및 자동화', items:['웹 데이터 스크래핑 및 정리','웹사이트 변경 사항 모니터링','수신 정보 자동 분류','일간/주간 다이제스트 생성','여러 소스 교차 참조','맞춤형 워크플로우 구축'] },
    ],
    ticker: ['이메일 읽기 및 요약','자동으로 답장 초안 작성','메시지 번역','주가 모니터링','경쟁사 뉴스 추적','보고서 요약','회의 일정 잡기','인보이스 생성','경쟁사 조사','소셜 게시물 작성','프레젠테이션 만들기','온라인 최저가 찾기'],
  },
  es: { layoutTitle:'Herramientas y Casos de Uso - AgentPuter | ¿Qué puede hacer tu agente IA?', layoutDesc:'Descubre 500+ cosas que tu agente IA siempre activo puede hacer. Investigar, automatizar, comunicar, analizar — sin programación. Ve casos de uso reales.', tags:"['AgentPuter', 'Herramientas IA', 'Casos de uso IA', 'Automatización IA', 'IA sin código', 'Agente IA']", skillsLabel:'500+ HABILIDADES INTEGRADAS', h1:'¿Qué puede hacer tu agente IA?', heroPrimary:'Un agente. Miles de casos de uso.', heroSub:'Dile lo que necesitas en lenguaje natural — él se encarga del resto.', heroNote:'Tu agente IA funciona 24/7, se conecta a tus apps favoritas y maneja tareas incluso mientras duermes. Sin programación. Sin configuración. Solo describe lo que quieres.', compLabel:'// LA FORMA ANTIGUA VS LA NUEVA', compH2:'Deja de hacer todo manualmente', withoutLabel:'SIN AGENTPUTER', withLabel:'CON AGENTPUTER', w1:'Revisar sitios de noticias manualmente cada mañana', w2:'Copiar y pegar entre apps para traducir mensajes', w3:'Pasar horas leyendo y resumiendo informes', w4:'Perderse actualizaciones importantes cuando no estás', w5:'La IA solo funciona cuando estás frente a tu computadora', wg1:'La IA monitorea noticias y te envía un resumen diario', wg2:'Mensajes auto-traducidos en todos tus canales', wg3:'Envía un PDF, recibe un resumen en segundos', wg4:'La IA trabaja 24/7 — incluso los fines de semana', wg5:'Tu agente funciona en su propio cloud — siempre activo', usecasesLabel:'// CASOS DE USO', usecasesH2:'Un agente, cientos de casos de uso', usecasesNote:'Enseña nuevas tareas a tu agente IA en lenguaje natural. Sin código.', usecasesBottom:'// Puedes agregar tantos casos de uso como quieras mediante lenguaje natural', howLabel:'// CÓMO FUNCIONA', howH2:'3 pasos. 2 minutos. Listo.', step1:'Regístrate', step1p:'Crea tu cuenta. No necesitas tarjeta de crédito para explorar.', step2:'Conecta tus apps', step2p:'Vincula Telegram, WhatsApp, Slack o cualquiera de los 15+ canales.', step3:'Dile qué hacer', step3p:'Describe tareas en lenguaje simple. Tu agente IA se encarga del resto — 24/7.', channelLabel:'// FUNCIONA DONDE TÚ TRABAJAS', channelH2:'Se conecta a 15+ canales', channelNote:'Tu agente IA te encuentra donde ya estás — sin nuevas apps que aprender.', ctaH2:'Tu agente IA te espera', ctaP:'$29.99/mes. Configuración en 2 minutos. Funciona 24/7.<br />Sin programación. Sin claves API. Todo incluido.', btnStart:'[EMPEZAR — $29.99/mes]', btnPricing:'[VER PRECIOS]', ctaNote:'// Cancela cuando quieras · Sin programación · Sin cargos ocultos',
    cats: [
      { category:'Investigación y análisis', items:['Monitorear noticias del sector 24/7','Rastrear actualizaciones de competidores','Resumir informes largos y PDFs','Traducir documentos en tiempo real','Compilar informes diarios del mercado','Investigar empresas y tendencias'] },
      { category:'Comunicación', items:['Redactar respuestas de email automáticamente','Gestionar mensajes de Telegram/Slack','Traducir conversaciones en tiempo real','Responder preguntas de clientes','Programar seguimientos','Resumir hilos de chat largos'] },
      { category:'Productividad', items:['Organizar tu calendario y tareas','Tomar notas de reuniones automáticamente','Establecer recordatorios inteligentes','Crear presentaciones desde notas','Rastrear plazos en proyectos','Generar informes según programa'] },
      { category:'Finanzas y negocios', items:['Rastrear gastos y recibos','Monitorear precios de acciones y alertas','Generar facturas','Comparar cotizaciones y propuestas','Calcular escenarios de ROI','Resumir informes financieros'] },
      { category:'Contenido y escritura', items:['Redactar posts de blog y artículos','Escribir contenido para redes sociales','Crear newsletters','Editar y corregir documentos','Generar descripciones de productos','Escribir contratos y NDAs'] },
      { category:'Datos y automatización', items:['Extraer y organizar datos web','Monitorear cambios en sitios web','Categorizar automáticamente información entrante','Generar resúmenes diarios/semanales','Cruzar referencias de múltiples fuentes','Construir flujos de trabajo personalizados'] },
    ],
    ticker: ['Leer y resumir email','Redactar respuestas automáticamente','Traducir mensajes','Monitorear precios de acciones','Rastrear noticias de competidores','Resumir informes','Programar reuniones','Generar facturas','Investigar competidores','Escribir publicaciones sociales','Crear presentaciones','Encontrar mejores precios online'],
  },
  'pt-br': { layoutTitle:'Ferramentas e Casos de Uso - AgentPuter | O que seu agente IA pode fazer?', layoutDesc:'Descubra 500+ coisas que seu agente IA sempre ativo pode fazer. Pesquisar, automatizar, comunicar, analisar — sem programação. Veja casos de uso reais.', tags:"['AgentPuter', 'Ferramentas IA', 'Casos de uso IA', 'Automação IA', 'IA sem código', 'Agente IA']", skillsLabel:'500+ HABILIDADES INTEGRADAS', h1:'O que seu agente IA pode fazer?', heroPrimary:'Um agente. Milhares de casos de uso.', heroSub:'Diga o que você precisa em linguagem simples — ele cuida do resto.', heroNote:'Seu agente IA funciona 24/7, conecta-se aos seus apps favoritos e lida com tarefas mesmo enquanto você dorme. Sem programação. Sem configuração. Apenas descreva o que você quer.', compLabel:'// A FORMA ANTIGA VS A NOVA', compH2:'Pare de fazer tudo manualmente', withoutLabel:'SEM AGENTPUTER', withLabel:'COM AGENTPUTER', w1:'Verificar sites de notícias manualmente toda manhã', w2:'Copiar e colar entre apps para traduzir mensagens', w3:'Gastar horas lendo e resumindo relatórios', w4:'Perder atualizações importantes quando você está ausente', w5:'A IA só funciona quando você está no computador', wg1:'A IA monitora notícias e envia um briefing diário', wg2:'Mensagens auto-traduzidas em todos os seus canais', wg3:'Envie um PDF, receba um resumo em segundos', wg4:'A IA trabalha 24/7 — mesmo nos fins de semana', wg5:'Seu agente roda no próprio cloud — sempre ligado', usecasesLabel:'// CASOS DE USO', usecasesH2:'Um agente, centenas de casos de uso', usecasesNote:'Ensine novas tarefas ao seu agente IA em linguagem natural. Sem código.', usecasesBottom:'// Você pode adicionar quantos casos de uso quiser por meio de linguagem natural', howLabel:'// COMO FUNCIONA', howH2:'3 passos. 2 minutos. Pronto.', step1:'Cadastre-se', step1p:'Crie sua conta. Não precisa de cartão de crédito para explorar.', step2:'Conecte seus apps', step2p:'Vincule Telegram, WhatsApp, Slack ou qualquer um dos 15+ canais.', step3:'Diga o que fazer', step3p:'Descreva tarefas em linguagem simples. Seu agente IA cuida do resto — 24/7.', channelLabel:'// FUNCIONA ONDE VOCÊ TRABALHA', channelH2:'Conecta a 15+ canais', channelNote:'Seu agente IA vai até onde você já está — sem novos apps para aprender.', ctaH2:'Seu agente IA está esperando', ctaP:'$29.99/mês. Configuração em 2 minutos. Funciona 24/7.<br />Sem programação. Sem chaves API. Tudo incluído.', btnStart:'[COMEÇAR — $29.99/mês]', btnPricing:'[VER PREÇOS]', ctaNote:'// Cancele quando quiser · Sem programação · Sem taxas ocultas',
    cats: [
      { category:'Pesquisa e análise', items:['Monitorar notícias do setor 24/7','Rastrear atualizações de concorrentes','Resumir relatórios longos e PDFs','Traduzir documentos em tempo real','Compilar briefings diários do mercado','Pesquisar empresas e tendências'] },
      { category:'Comunicação', items:['Redigir respostas de email automaticamente','Gerenciar mensagens do Telegram/Slack','Traduzir conversas em tempo real','Responder perguntas de clientes','Agendar follow-ups','Resumir longos threads de chat'] },
      { category:'Produtividade', items:['Organizar sua agenda e tarefas','Fazer anotações de reuniões automaticamente','Definir lembretes inteligentes','Criar apresentações a partir de notas','Rastrear prazos em projetos','Gerar relatórios conforme programado'] },
      { category:'Finanças e negócios', items:['Rastrear despesas e recibos','Monitorar preços de ações e alertas','Gerar faturas','Comparar cotações e propostas','Calcular cenários de ROI','Resumir relatórios financeiros'] },
      { category:'Conteúdo e escrita', items:['Redigir posts de blog e artigos','Escrever conteúdo para redes sociais','Criar newsletters','Editar e revisar documentos','Gerar descrições de produtos','Escrever contratos e NDAs'] },
      { category:'Dados e automação', items:['Extrair e organizar dados da web','Monitorar mudanças em sites','Categorizar automaticamente informações recebidas','Gerar resumos diários/semanais','Cruzar referências de múltiplas fontes','Construir fluxos de trabalho personalizados'] },
    ],
    ticker: ['Ler e resumir email','Redigir respostas automaticamente','Traduzir mensagens','Monitorar preços de ações','Rastrear notícias de concorrentes','Resumir relatórios','Agendar reuniões','Gerar faturas','Pesquisar concorrentes','Escrever posts sociais','Criar apresentações','Encontrar melhores preços online'],
  },
  de: { layoutTitle:'Tools und Anwendungsfälle - AgentPuter | Was kann Ihr KI-Agent tun?', layoutDesc:'Entdecken Sie 500+ Dinge, die Ihr immer-aktiver KI-Agent tun kann. Recherchieren, automatisieren, kommunizieren, analysieren — ohne Coding. Sehen Sie echte Anwendungsfälle.', tags:"['AgentPuter', 'KI-Tools', 'KI-Anwendungsfälle', 'KI-Automatisierung', 'No-Code-KI', 'KI-Agent']", skillsLabel:'500+ INTEGRIERTE SKILLS', h1:'Was kann Ihr KI-Agent tun?', heroPrimary:'Ein Agent. Tausende von Anwendungsfällen.', heroSub:'Sagen Sie ihm auf natürliche Weise, was Sie brauchen — er erledigt den Rest.', heroNote:'Ihr KI-Agent läuft 24/7, verbindet sich mit Ihren Lieblings-Apps und erledigt Aufgaben, selbst während Sie schlafen. Kein Coding. Keine Konfiguration. Beschreiben Sie einfach, was Sie möchten.', compLabel:'// DER ALTE WEG VS DER NEUE WEG', compH2:'Hören Sie auf, alles manuell zu erledigen', withoutLabel:'OHNE AGENTPUTER', withLabel:'MIT AGENTPUTER', w1:'Jeden Morgen manuell Nachrichtenwebseiten überprüfen', w2:'Zwischen Apps kopieren und einfügen, um Nachrichten zu übersetzen', w3:'Stunden damit verbringen, Berichte zu lesen und zusammenzufassen', w4:'Wichtige Updates verpassen, wenn Sie nicht da sind', w5:'KI funktioniert nur, wenn Sie vor dem Computer sitzen', wg1:'KI überwacht Nachrichten und sendet Ihnen ein tägliches Briefing', wg2:'Nachrichten über alle Kanäle automatisch übersetzt', wg3:'Senden Sie ein PDF, erhalten Sie in Sekunden eine Zusammenfassung', wg4:'KI arbeitet 24/7 — auch am Wochenende', wg5:'Ihr Agent läuft auf seiner eigenen Cloud — immer aktiv', usecasesLabel:'// ANWENDUNGSFÄLLE', usecasesH2:'Ein Agent, Hunderte von Anwendungsfällen', usecasesNote:'Bringen Sie Ihrem KI-Agenten neue Aufgaben in natürlicher Sprache bei. Kein Code nötig.', usecasesBottom:'// Sie können beliebig viele Anwendungsfälle durch natürliche Sprache hinzufügen', howLabel:'// WIE ES FUNKTIONIERT', howH2:'3 Schritte. 2 Minuten. Fertig.', step1:'Registrieren', step1p:'Erstellen Sie Ihr Konto. Keine Kreditkarte zum Stöbern erforderlich.', step2:'Apps verbinden', step2p:'Verknüpfen Sie Telegram, WhatsApp, Slack oder einen der 15+ Kanäle.', step3:'Sagen Sie ihm, was zu tun ist', step3p:'Beschreiben Sie Aufgaben in einfacher Sprache. Ihr KI-Agent erledigt den Rest — 24/7.', channelLabel:'// FUNKTIONIERT, WO SIE ARBEITEN', channelH2:'Verbindet sich mit 15+ Kanälen', channelNote:'Ihr KI-Agent findet Sie dort, wo Sie bereits sind — keine neuen Apps zu lernen.', ctaH2:'Ihr KI-Agent wartet auf Sie', ctaP:'29,99$/Monat. Einrichtung in 2 Minuten. Läuft 24/7.<br />Kein Coding. Keine API-Schlüssel. Alles inklusive.', btnStart:'[JETZT STARTEN — 29,99$/Monat]', btnPricing:'[PREISE ANSEHEN]', ctaNote:'// Jederzeit kündbar · Kein Coding nötig · Keine versteckten Gebühren',
    cats: [
      { category:'Recherche & Analyse', items:['Branchennachrichten 24/7 überwachen','Konkurrenten-Updates verfolgen','Lange Berichte & PDFs zusammenfassen','Dokumente in Echtzeit übersetzen','Tägliche Marktbriefings zusammenstellen','Unternehmen & Trends recherchieren'] },
      { category:'Kommunikation', items:['E-Mail-Antworten automatisch entwerfen','Telegram/Slack-Nachrichten verwalten','Gespräche in Echtzeit übersetzen','Kundenfragen beantworten','Follow-ups planen','Lange Chat-Threads zusammenfassen'] },
      { category:'Produktivität', items:['Kalender & Aufgaben organisieren','Besprechungsnotizen automatisch aufzeichnen','Intelligente Erinnerungen setzen','Präsentationen aus Notizen erstellen','Fristen über Projekte hinweg verfolgen','Berichte nach Zeitplan generieren'] },
      { category:'Finanzen & Geschäft', items:['Ausgaben & Quittungen verfolgen','Aktienkurse & Benachrichtigungen überwachen','Rechnungen generieren','Angebote & Vorschläge vergleichen','ROI-Szenarien berechnen','Finanzberichte zusammenfassen'] },
      { category:'Inhalte & Schreiben', items:['Blog-Beiträge & Artikel verfassen','Social-Media-Inhalte schreiben','Newsletter erstellen','Dokumente bearbeiten & Korrektur lesen','Produktbeschreibungen generieren','Verträge & NDAs verfassen'] },
      { category:'Daten & Automatisierung', items:['Web-Daten scrapen & organisieren','Webseiten auf Änderungen überwachen','Eingehende Infos automatisch kategorisieren','Täglich/wöchentliche Digests generieren','Mehrere Quellen querverweisen','Benutzerdefinierte Workflows erstellen'] },
    ],
    ticker: ['E-Mails lesen & zusammenfassen','Antworten automatisch entwerfen','Nachrichten übersetzen','Aktienkurse überwachen','Konkurrenznachrichten verfolgen','Berichte zusammenfassen','Meetings planen','Rechnungen generieren','Konkurrenten recherchieren','Social-Posts schreiben','Präsentationen erstellen','Beste Preise online finden'],
  },
  fr: { layoutTitle:"Outils et Cas d'Usage - AgentPuter | Que peut faire votre agent IA ?", layoutDesc:"Découvrez 500+ choses que votre agent IA toujours actif peut faire. Rechercher, automatiser, communiquer, analyser — sans programmation. Voir les cas d'usage réels.", tags:"['AgentPuter', 'Outils IA', \"Cas d'usage IA\", 'Automatisation IA', 'IA sans code', 'Agent IA']", skillsLabel:'500+ COMPÉTENCES INTÉGRÉES', h1:"Que peut faire votre agent IA ?", heroPrimary:"Un agent. Des milliers de cas d'usage.", heroSub:"Dites-lui ce dont vous avez besoin en langage naturel — il s'occupe du reste.", heroNote:"Votre agent IA fonctionne 24h/24, se connecte à vos apps préférées et gère les tâches même pendant que vous dormez. Sans programmation. Sans configuration. Décrivez simplement ce que vous voulez.", compLabel:"// L'ANCIENNE FAÇON VS LA NOUVELLE", compH2:"Arrêtez de tout faire manuellement", withoutLabel:'SANS AGENTPUTER', withLabel:'AVEC AGENTPUTER', w1:"Vérifier manuellement les sites d'actualités chaque matin", w2:'Copier-coller entre les apps pour traduire les messages', w3:'Passer des heures à lire et résumer des rapports', w4:"Manquer des mises à jour importantes quand vous n'êtes pas là", w5:"L'IA fonctionne uniquement quand vous êtes devant votre ordinateur", wg1:"L'IA surveille les actualités et vous envoie un briefing quotidien", wg2:'Messages auto-traduits sur tous vos canaux', wg3:'Envoyez un PDF, recevez un résumé en quelques secondes', wg4:"L'IA travaille 24h/24 — même le week-end", wg5:"Votre agent fonctionne sur son propre cloud — toujours actif", usecasesLabel:"// CAS D'USAGE", usecasesH2:"Un agent, des centaines de cas d'usage", usecasesNote:"Apprenez à votre agent IA de nouvelles tâches en langage naturel. Sans code.", usecasesBottom:"// Vous pouvez ajouter autant de cas d'usage que vous voulez en langage naturel", howLabel:'// COMMENT ÇA MARCHE', howH2:'3 étapes. 2 minutes. Terminé.', step1:'Inscrivez-vous', step1p:"Créez votre compte. Pas de carte de crédit pour explorer.", step2:'Connectez vos apps', step2p:'Liez Telegram, WhatsApp, Slack ou un des 15+ canaux.', step3:'Dites-lui quoi faire', step3p:"Décrivez les tâches en langage simple. Votre agent IA s'en occupe — 24h/24.", channelLabel:'// FONCTIONNE LÀ OÙ VOUS TRAVAILLEZ', channelH2:'Se connecte à 15+ canaux', channelNote:"Votre agent IA vous rejoint là où vous êtes déjà — pas de nouvelles apps à apprendre.", ctaH2:"Votre agent IA vous attend", ctaP:"29,99$/mois. Configuration en 2 minutes. Fonctionne 24h/24.<br />Sans programmation. Sans clés API. Tout inclus.", btnStart:'[COMMENCER — 29,99$/mois]', btnPricing:'[VOIR LES TARIFS]', ctaNote:"// Annulez quand vous voulez · Sans programmation · Sans frais cachés",
    cats: [
      { category:'Recherche & Analyse', items:['Surveiller les actualités du secteur 24h/24','Suivre les mises à jour des concurrents','Résumer de longs rapports & PDFs','Traduire des documents en temps réel','Compiler des briefings quotidiens du marché','Rechercher des entreprises & tendances'] },
      { category:'Communication', items:['Rédiger des réponses email automatiquement','Gérer les messages Telegram/Slack','Traduire les conversations en temps réel','Répondre aux questions des clients','Planifier les suivis','Résumer les longs fils de discussion'] },
      { category:'Productivité', items:['Organiser votre agenda & tâches','Prendre des notes de réunion automatiquement','Définir des rappels intelligents','Créer des présentations à partir de notes','Suivre les délais sur les projets','Générer des rapports selon un calendrier'] },
      { category:'Finance & Business', items:['Suivre les dépenses & reçus','Surveiller les cours des actions & alertes','Générer des factures','Comparer les devis & propositions','Calculer des scénarios de ROI','Résumer les rapports financiers'] },
      { category:'Contenu & Rédaction', items:["Rédiger des articles de blog","Écrire du contenu pour les réseaux sociaux","Créer des newsletters","Éditer & relire des documents","Générer des descriptions de produits","Rédiger des contrats & NDAs"] },
      { category:'Données & Automatisation', items:['Extraire & organiser des données web','Surveiller les changements sur les sites web','Catégoriser automatiquement les infos entrantes','Générer des résumés quotidiens/hebdomadaires','Croiser des références de sources multiples','Créer des flux de travail personnalisés'] },
    ],
    ticker: ["Lire & résumer les emails","Rédiger des réponses automatiquement","Traduire les messages","Surveiller les cours des actions","Suivre les actualités des concurrents","Résumer les rapports","Planifier des réunions","Générer des factures","Rechercher des concurrents","Écrire des posts sociaux","Créer des présentations","Trouver les meilleurs prix en ligne"],
  },
};

function buildTools(t, lang) {
  const catsCode = t.cats.map(c =>
    `  {\n    category: '${c.category}',\n    icon: '',\n    color: 'accent',\n    items: ${JSON.stringify(c.items)},\n  }`
  ).join(',\n');

  const tickerItems = t.ticker.map(item =>
    `          <span class="inline-block px-4 py-2 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">${item}</span>`
  ).join('\n');

  return `---
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/${lang}/Header.astro';
import Footer from '../../components/${lang}/Footer.astro';
import MatrixRain from '../../components/MatrixRain.astro';

const APP_URL = 'https://app.agentputer.com';

const useCases = [
${catsCode}
];
---
<Layout title="${t.layoutTitle}" description="${t.layoutDesc}" tags={${t.tags}}>
  <MatrixRain />
  <Header activePage="tools" />
  <main class="relative z-10">
    <section class="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-dark-primary via-dark-primary to-dark-secondary"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,65,0.06),transparent_50%)]"></div>
      <div class="relative max-w-7xl mx-auto px-6 lg:px-20 text-center">
        <div class="font-mono text-accent text-xs font-semibold tracking-[0.2em] mb-6">${t.skillsLabel}</div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">${t.h1}</h1>
        <p class="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-4">${t.heroPrimary}<br />${t.heroSub}</p>
        <p class="text-text-muted text-sm max-w-xl mx-auto">${t.heroNote}</p>
      </div>
    </section>
    <section class="py-8 overflow-hidden">
      <div class="relative">
        <div class="flex animate-scroll-left gap-4 whitespace-nowrap">
${tickerItems}
${tickerItems}
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-20">
      <div class="max-w-5xl mx-auto px-6 lg:px-20">
        <div class="font-mono text-accent text-xs font-semibold tracking-[0.3em] mb-4 text-center">${t.compLabel}</div>
        <h2 class="text-white text-2xl md:text-3xl font-bold mb-12 text-center">${t.compH2}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-dark-secondary rounded-2xl border border-dark-tertiary p-8">
            <div class="text-error font-mono text-xs font-bold mb-4">${t.withoutLabel}</div>
            <ul class="space-y-4 text-sm">
              <li class="flex items-start gap-3 text-text-muted"><span class="text-error mt-0.5">✗</span><span>${t.w1}</span></li>
              <li class="flex items-start gap-3 text-text-muted"><span class="text-error mt-0.5">✗</span><span>${t.w2}</span></li>
              <li class="flex items-start gap-3 text-text-muted"><span class="text-error mt-0.5">✗</span><span>${t.w3}</span></li>
              <li class="flex items-start gap-3 text-text-muted"><span class="text-error mt-0.5">✗</span><span>${t.w4}</span></li>
              <li class="flex items-start gap-3 text-text-muted"><span class="text-error mt-0.5">✗</span><span>${t.w5}</span></li>
            </ul>
          </div>
          <div class="bg-dark-secondary rounded-2xl border-2 border-accent/50 p-8">
            <div class="text-accent font-mono text-xs font-bold mb-4">${t.withLabel}</div>
            <ul class="space-y-4 text-sm">
              <li class="flex items-start gap-3 text-text-muted"><span class="text-accent mt-0.5">✓</span><span>${t.wg1}</span></li>
              <li class="flex items-start gap-3 text-text-muted"><span class="text-accent mt-0.5">✓</span><span>${t.wg2}</span></li>
              <li class="flex items-start gap-3 text-text-muted"><span class="text-accent mt-0.5">✓</span><span>${t.wg3}</span></li>
              <li class="flex items-start gap-3 text-text-muted"><span class="text-accent mt-0.5">✓</span><span>${t.wg4}</span></li>
              <li class="flex items-start gap-3 text-text-muted"><span class="text-accent mt-0.5">✓</span><span>${t.wg5}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-20">
        <div class="font-mono text-accent text-xs font-semibold tracking-[0.3em] mb-4 text-center">${t.usecasesLabel}</div>
        <h2 class="text-white text-2xl md:text-3xl font-bold mb-4 text-center">${t.usecasesH2}</h2>
        <p class="text-text-muted text-center text-sm mb-12 max-w-lg mx-auto">${t.usecasesNote}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((category) => (
            <div class="bg-dark-secondary rounded-2xl border border-dark-tertiary p-6 hover:border-accent/30 transition-colors">
              <div class="flex items-center gap-3 mb-4">
                <h3 class="text-white font-bold">{category.category}</h3>
              </div>
              <ul class="space-y-2.5">
                {category.items.map((item) => (
                  <li class="text-text-muted text-sm flex items-start gap-2">
                    <span class="text-accent mt-0.5 text-xs">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p class="text-text-dark text-xs font-mono text-center mt-8">${t.usecasesBottom}</p>
      </div>
    </section>
    <section class="py-12 lg:py-20 bg-dark-secondary/50">
      <div class="max-w-4xl mx-auto px-6 lg:px-20">
        <div class="font-mono text-accent text-xs font-semibold tracking-[0.3em] mb-4 text-center">${t.howLabel}</div>
        <h2 class="text-white text-2xl md:text-3xl font-bold mb-12 text-center">${t.howH2}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-4"><span class="text-accent font-mono font-bold text-xl">1</span></div>
            <h3 class="text-white font-bold mb-2">${t.step1}</h3><p class="text-text-muted text-sm">${t.step1p}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-terminal-cyan/10 border border-terminal-cyan/30 flex items-center justify-center mx-auto mb-4"><span class="text-terminal-cyan font-mono font-bold text-xl">2</span></div>
            <h3 class="text-white font-bold mb-2">${t.step2}</h3><p class="text-text-muted text-sm">${t.step2p}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-terminal-magenta/10 border border-terminal-magenta/30 flex items-center justify-center mx-auto mb-4"><span class="text-terminal-magenta font-mono font-bold text-xl">3</span></div>
            <h3 class="text-white font-bold mb-2">${t.step3}</h3><p class="text-text-muted text-sm">${t.step3p}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 lg:py-20">
      <div class="max-w-5xl mx-auto px-6 lg:px-20 text-center">
        <div class="font-mono text-accent text-xs font-semibold tracking-[0.3em] mb-4">${t.channelLabel}</div>
        <h2 class="text-white text-2xl md:text-3xl font-bold mb-4">${t.channelH2}</h2>
        <p class="text-text-muted text-sm mb-10 max-w-lg mx-auto">${t.channelNote}</p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <span class="px-5 py-2.5 bg-dark-secondary border border-accent/30 rounded-full text-accent text-sm font-medium">Telegram</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-accent/30 rounded-full text-accent text-sm font-medium">WhatsApp</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-accent/30 rounded-full text-accent text-sm font-medium">Slack</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-accent/30 rounded-full text-accent text-sm font-medium">Discord</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">Email</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">Web Chat</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">SMS</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">Line</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">WeChat</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">Twitter/X</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">Instagram</span>
          <span class="px-5 py-2.5 bg-dark-secondary border border-dark-tertiary rounded-full text-text-muted text-sm">+4 more</span>
        </div>
      </div>
    </section>
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-6 lg:px-20">
        <div class="relative overflow-hidden rounded-2xl bg-dark-secondary border-2 border-accent/50 p-8 md:p-16 glow-accent neon-box">
          <div class="absolute inset-0 opacity-5"><div class="absolute inset-0" style="background-image: linear-gradient(rgba(0,255,65,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.1) 1px, transparent 1px); background-size: 20px 20px;"></div></div>
          <div class="relative text-center">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-accent text-glow-strong mb-4 font-mono">${t.ctaH2}</h2>
            <p class="text-text-secondary text-lg mb-10 max-w-xl mx-auto" set:html="${t.ctaP}"></p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={\`\${APP_URL}/sign-up\`} class="btn-primary text-sm py-4 px-10 font-mono">${t.btnStart}</a>
              <a href="/${lang}/pricing" class="btn-secondary text-sm py-4 px-10 font-mono">${t.btnPricing}</a>
            </div>
            <p class="text-text-muted text-xs font-mono mt-6">${t.ctaNote}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</Layout>
<style>
  @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .animate-scroll-left { animation: scroll-left 30s linear infinite; }
</style>`;
}

// ── WRITE ALL FILES ───────────────────────────────────────────────────────────
let count = 0;

for (const [lang, t] of Object.entries(pricingLangs)) {
  const filePath = path.join(BASE, lang, 'pricing.astro');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buildPricing(t, lang), 'utf8');
  console.log(`✓ pricing/${lang}`);
  count++;
}

for (const [lang, t] of Object.entries(toolsLangs)) {
  const filePath = path.join(BASE, lang, 'tools.astro');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buildTools(t, lang), 'utf8');
  console.log(`✓ tools/${lang}`);
  count++;
}

console.log(`\nDone! Generated ${count} files.`);
