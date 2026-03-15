#!/usr/bin/env python3
"""
generate_translated_components.py
Generate translated ScenarioCards and EngineCards for all languages.
Translations are pre-baked (verified quality) — use translate_components.py
with a GEMINI_API_KEY to refresh translations via Gemini 3 Flash.
"""
import os
from pathlib import Path

ROOT = Path(__file__).parent.parent
COMPONENTS = ROOT / "src" / "components"

# ─────────────────────────────────────────────
# Translation data per language
# ─────────────────────────────────────────────

TRANSLATIONS = {
    "zh": {
        "scenarios": [
            {
                "title": "季度财务报告自动化",
                "subtitle": "上传数据 → AI 生成图表 → 导出专业 PDF",
                "desc": "告别手动制表。AgentPuter 读取你的数据，使用 LibreOffice 生成带图表、目录和标准排版的完整财报——28 页，2 分钟。",
                "output": "Q1-财务报告.pdf · 28 页",
            },
            {
                "title": "营销海报批量生成",
                "subtitle": "一句话 → AI 出图 → 导出高清 PNG/SVG",
                "desc": "描述主题、品牌色和文案。AgentPuter 调用 Inkscape 生成像素级精准的向量海报，支持批量变体输出。",
                "output": "summer-sale-poster.svg · 1920×1080",
            },
            {
                "title": "系统架构图自动绘制",
                "subtitle": "描述架构 → AI 布局 → 导出 SVG/PNG",
                "desc": "用自然语言描述微服务、数据流和网络拓扑。AgentPuter 通过 Draw.io CLI 精准绘制专业架构图。",
                "output": "microservice-arch.svg · 矢量可编辑",
            },
            {
                "title": "播客与音频后期处理",
                "subtitle": "上传录音 → AI 降噪剪辑 → 导出广播级 MP3",
                "desc": "会议录音、播客、课程音频——AgentPuter 自动降噪、标准化音量、剪掉静音段。一条命令，专业后期输出。",
                "output": "podcast-ep12-final.mp3 · 128kbps",
            },
            {
                "title": "技术文档一键生成",
                "subtitle": "API 规格 → AI 排版 → 导出 Word/PDF",
                "desc": "粘贴 API 定义、功能规格或接口描述。AgentPuter 生成格式规范、带目录的技术文档，兼容企业模板。",
                "output": "api-reference-v2.docx · 企业格式",
            },
        ],
        "engines": [
            {
                "tagline": "Writer · Calc · Impress · Draw — 无头模式",
                "desc": "完全无头模式控制 LibreOffice 全套。生成 Word/Excel/PPT/PDF，支持宏、模板和图表。数千个已验证命令序列。",
                "caps": ["Writer 文档", "Calc 电子表格", "Impress 演示文稿", "Draw 图形", "PDF 导出", "模板套用"],
                "scenarios": ["季度报告", "技术文档", "合同起草"],
                "see_use_cases": "查看使用案例 →",
            },
            {
                "tagline": "SVG 矢量 · 海报 · 图标 · Logo · 像素导出",
                "desc": "通过 Inkscape 精确 CLI 控制 SVG 节点、路径、滤镜和文字排版。任意分辨率导出 PNG/SVG/PDF，像素级精准。",
                "caps": ["SVG 矢量创作", "海报设计", "图标生成", "路径运算", "滤镜效果", "批量导出"],
                "scenarios": ["营销海报", "品牌素材", "UI 图标"],
                "see_use_cases": "查看使用案例 →",
            },
            {
                "tagline": "流程图 · 架构图 · ER 图 · 时序图 · UML",
                "desc": "通过 draw.io CLI 以编程方式创建专业技术图表。内置 AWS/GCP/Azure 图标库，支持 C4 Model、UML 等规范。",
                "caps": ["微服务架构图", "网络拓扑图", "ER 数据库图", "业务流程图", "时序图", "UML 类图"],
                "scenarios": ["系统架构", "数据库设计", "业务流程"],
                "see_use_cases": "查看使用案例 →",
            },
            {
                "tagline": "降噪 · 剪辑 · 格式转换 · 响度标准化",
                "desc": "sox 处理音频特效与分析；ffmpeg 负责编解码与容器转换。支持批量处理，覆盖播客、课程、音乐制作全流程。",
                "caps": ["智能降噪", "静音检测剪辑", "EBU R128 响度标准化", "格式转换", "多轨混音", "音频分析"],
                "scenarios": ["播客后期", "课程录音", "会议音频"],
                "see_use_cases": "查看使用案例 →",
            },
        ],
        "labels": {
            "scenario_section_tag": "// 场景解决方案",
            "scenario_section_title": "真实问题。真实输出。",
            "scenario_section_desc": "每个功能都是一个完整工作流——从你的请求到可下载的文件。没有幻觉，没有摘要。真实软件生成的真实文件。",
            "engine_section_tag": "// 内置引擎",
            "engine_section_title": "4 款软件引擎。640+ 已验证命令。",
            "engine_section_desc": "AgentPuter 的每项能力都由真实软件引擎驱动——通过 CLI 控制，而非 GUI 截图。稳定 API，真实文件输出，完全本地处理。",
            "engine_stat_1": "已验证命令序列",
            "engine_stat_2": "引擎覆盖核心场景",
            "engine_stat_3": "本地运行",
            "why_cli_tag": "// 为什么用 CLI，不用 GUI？",
            "why_cli_1_title": "稳定 API",
            "why_cli_1_desc": "CLI 接口不随 UI 更新而损坏。一次集成，长期有效。基于截图的方案在每次软件升级后都可能失效。",
            "why_cli_2_title": "精确控制",
            "why_cli_2_desc": "直接操控文件、坐标和参数，无需视觉对齐——每次输出像素级精准。",
            "why_cli_3_title": "可批量化",
            "why_cli_3_desc": "同一命令可并发运行 100+ 任务。GUI 自动化一次只能点击一个操作。",
        },
    },
    "de": {
        "scenarios": [
            {"title": "Automatisierung von Quartalsberichten", "subtitle": "Daten hochladen → KI erstellt Diagramme → PDF exportieren", "desc": "Schluss mit manuellen Tabellen. AgentPuter liest Ihre Daten und erstellt mit LibreOffice einen vollständigen Finanzbericht mit Diagrammen und Inhaltsverzeichnis — 28 Seiten in 2 Minuten.", "output": "Q1-Finanzbericht.pdf · 28 Seiten"},
            {"title": "Marketing-Poster in Massen erstellen", "subtitle": "Ein Satz → KI entwirft Design → Hi-Res PNG/SVG exportieren", "desc": "Beschreiben Sie Ihr Thema, Markenfarben und Text. AgentPuter ruft Inkscape auf und erstellt pixelgenaue Vektorposter mit Unterstützung für Batch-Varianten.", "output": "summer-sale-poster.svg · 1920×1080"},
            {"title": "Systemarchitektur automatisch zeichnen", "subtitle": "Architektur beschreiben → KI layoutet → SVG/PNG exportieren", "desc": "Beschreiben Sie Ihre Microservices, Datenflüsse und Netzwerktopologie in natürlicher Sprache. AgentPuter nutzt die Draw.io CLI für präzise Architekturdiagramme.", "output": "microservice-arch.svg · Vektorbearbeitbar"},
            {"title": "Podcast & Audio-Postproduktion", "subtitle": "Aufnahme hochladen → KI entrauscht & schneidet → Broadcast-MP3", "desc": "Meeting-Aufnahmen, Podcast-Episoden, Kursaudio — AgentPuter entrauscht automatisch, normalisiert die Lautstärke und trimmt Stille. Ein Befehl, professionelles Ergebnis.", "output": "podcast-ep12-final.mp3 · 128kbps"},
            {"title": "Technische Dokumentation generieren", "subtitle": "API-Spezifikationen → KI formatiert → Word/PDF exportieren", "desc": "Fügen Sie Ihre API-Definitionen, Feature-Specs oder Schnittstellenbeschreibungen ein. AgentPuter generiert professionell formatierte technische Dokumentation.", "output": "api-reference-v2.docx · Enterprise-Format"},
        ],
        "engines": [
            {"tagline": "Writer · Calc · Impress · Draw — Headless-Modus", "desc": "Vollständige Headless-Steuerung der LibreOffice-Suite. Word/Excel/PPT/PDF mit Makros, Vorlagen und Diagrammen erstellen.", "caps": ["Writer-Dokumente", "Calc-Tabellen", "Impress-Präsentationen", "Draw-Grafiken", "PDF-Export", "Vorlage anwenden"], "scenarios": ["Quartalsberichte", "Technische Doku", "Vertragsentwurf"], "see_use_cases": "Anwendungsfälle →"},
            {"tagline": "SVG-Vektor · Poster · Icon · Logo · Pixelexport", "desc": "Präzise CLI-Steuerung von SVG-Knoten, Pfaden, Filtern und Textlayout via Inkscape. Export in beliebiger Auflösung.", "caps": ["SVG-Vektorkunst", "Poster-Design", "Icon-Erstellung", "Pfadoperationen", "Filtereffekte", "Batch-Export"], "scenarios": ["Marketing-Poster", "Marken-Assets", "UI-Icons"], "see_use_cases": "Anwendungsfälle →"},
            {"tagline": "Flussdiagramme · Architektur · ER · Sequenz · UML", "desc": "Professionelle technische Diagramme programmatisch über die draw.io CLI erstellen. Integrierte AWS/GCP/Azure-Bibliotheken.", "caps": ["Microservice-Architektur", "Netzwerktopologie", "ER-Datenbankdiagramme", "Geschäftsabläufe", "Sequenzdiagramme", "UML-Klassendiagramme"], "scenarios": ["Systemarchitektur", "DB-Design", "Geschäftsprozesse"], "see_use_cases": "Anwendungsfälle →"},
            {"tagline": "Entrauschen · Schneiden · Konvertieren · Lautstärkenormalisierung", "desc": "sox verarbeitet Audioeffekte und Analysen; ffmpeg verwaltet Codec- und Container-Konvertierungen.", "caps": ["Intelligente Entrauschung", "Stille-Erkennung & Trim", "EBU R128 Lautstärkenorm", "Formatkonvertierung", "Mehrspurmix", "Audioanalyse"], "scenarios": ["Podcast-Postproduktion", "Kursaufnahme", "Meeting-Audio"], "see_use_cases": "Anwendungsfälle →"},
        ],
        "labels": {"scenario_section_tag": "// SZENARIO-LÖSUNGEN", "scenario_section_title": "Echte Probleme. Echte Ergebnisse.", "scenario_section_desc": "Jede Funktion ist ein vollständiger Workflow — von Ihrer Anfrage bis zur herunterladbaren Datei.", "engine_section_tag": "// INTEGRIERTE ENGINES", "engine_section_title": "4 Software-Engines. 640+ validierte Befehle.", "engine_section_desc": "Jede AgentPuter-Fähigkeit wird von einer echten Software-Engine angetrieben — gesteuert über CLI, nicht über GUI-Screenshots.", "engine_stat_1": "validierte Befehlssequenzen", "engine_stat_2": "Engines für Kernszenarien", "engine_stat_3": "lokale Verarbeitung", "why_cli_tag": "// WARUM CLI, NICHT GUI?", "why_cli_1_title": "Stabiles API", "why_cli_1_desc": "CLI-Schnittstellen brechen nicht bei UI-Updates. Eine Integration funktioniert langfristig.", "why_cli_2_title": "Präzise Kontrolle", "why_cli_2_desc": "Dateien, Koordinaten und Parameter direkt manipulieren — pixelgenaue Ausgabe jedes Mal.", "why_cli_3_title": "Stapelverarbeitung", "why_cli_3_desc": "Derselbe Befehl läuft für 100+ Aufgaben gleichzeitig. GUI-Automatisierung kann nur eine Sache auf einmal klicken."},
    },
    "es": {
        "scenarios": [
            {"title": "Automatización de informes trimestrales", "subtitle": "Subir datos → IA genera gráficos → Exportar PDF profesional", "desc": "Olvídese de las hojas de cálculo manuales. AgentPuter lee sus datos y usa LibreOffice para generar un informe completo con gráficos e índice — 28 páginas en 2 minutos.", "output": "Informe-Q1.pdf · 28 páginas"},
            {"title": "Generación masiva de pósters de marketing", "subtitle": "Una frase → IA crea diseño → Exportar PNG/SVG en alta resolución", "desc": "Describa su tema, colores de marca y texto. AgentPuter llama a Inkscape para generar pósters vectoriales perfectos al píxel con soporte para variantes en lote.", "output": "summer-sale-poster.svg · 1920×1080"},
            {"title": "Diagramas de arquitectura automáticos", "subtitle": "Describir arquitectura → IA diseña → Exportar SVG/PNG", "desc": "Describa sus microservicios, flujos de datos y topología de red en lenguaje natural. AgentPuter usa el CLI de Draw.io para producir diagramas precisos.", "output": "microservice-arch.svg · Editable vectorial"},
            {"title": "Postproducción de podcast y audio", "subtitle": "Subir grabación → IA elimina ruido → Exportar MP3 broadcast", "desc": "Grabaciones de reuniones, episodios de podcast, audio de cursos — AgentPuter elimina ruido automáticamente, normaliza el volumen y recorta el silencio.", "output": "podcast-ep12-final.mp3 · 128kbps"},
            {"title": "Generador de documentación técnica", "subtitle": "Especificaciones API → IA formatea → Exportar Word/PDF", "desc": "Pegue sus definiciones de API, especificaciones o descripciones de interfaces. AgentPuter genera documentación técnica con formato profesional.", "output": "api-reference-v2.docx · Formato empresarial"},
        ],
        "engines": [
            {"tagline": "Writer · Calc · Impress · Draw — Modo headless", "desc": "Control headless completo de la suite LibreOffice. Genere Word/Excel/PPT/PDF con macros, plantillas y gráficos.", "caps": ["Documentos Writer", "Hojas Calc", "Presentaciones Impress", "Gráficos Draw", "Exportación PDF", "Aplicar plantilla"], "scenarios": ["Informes trimestrales", "Docs técnica", "Redacción de contratos"], "see_use_cases": "Ver casos de uso →"},
            {"tagline": "Vector SVG · Póster · Icono · Logo · Exportación píxel", "desc": "Control preciso de nodos SVG, rutas, filtros y tipografía via Inkscape. Exporta en cualquier resolución.", "caps": ["Arte vectorial SVG", "Diseño de pósters", "Generación de iconos", "Operaciones de ruta", "Efectos de filtro", "Exportación masiva"], "scenarios": ["Pósters marketing", "Activos de marca", "Iconos UI"], "see_use_cases": "Ver casos de uso →"},
            {"tagline": "Diagramas · Arquitectura · ER · Secuencia · UML", "desc": "Cree diagramas técnicos profesionales mediante la CLI de draw.io. Bibliotecas de iconos AWS/GCP/Azure integradas.", "caps": ["Arquitectura microservicios", "Topología de red", "Diagramas ER", "Flujos de negocio", "Diagramas de secuencia", "Diagramas UML"], "scenarios": ["Arquitectura de sistemas", "Diseño BD", "Procesos de negocio"], "see_use_cases": "Ver casos de uso →"},
            {"tagline": "Denoise · Editar · Convertir · Normalizar loudness", "desc": "sox maneja efectos y análisis de audio; ffmpeg gestiona la conversión de códecs y contenedores.", "caps": ["Eliminación inteligente de ruido", "Detección y recorte de silencio", "Normalización EBU R128", "Conversión de formato", "Mezcla multipista", "Análisis de audio"], "scenarios": ["Postproducción podcast", "Grabación cursos", "Audio de reuniones"], "see_use_cases": "Ver casos de uso →"},
        ],
        "labels": {"scenario_section_tag": "// SOLUCIONES POR ESCENARIO", "scenario_section_title": "Problemas reales. Resultados reales.", "scenario_section_desc": "Cada función es un flujo de trabajo completo — desde su solicitud hasta un archivo descargable.", "engine_section_tag": "// MOTORES INTEGRADOS", "engine_section_title": "4 motores de software. 640+ comandos validados.", "engine_section_desc": "Cada capacidad de AgentPuter está impulsada por un motor de software real — controlado via CLI, no capturas de pantalla.", "engine_stat_1": "secuencias de comandos validadas", "engine_stat_2": "motores para escenarios clave", "engine_stat_3": "procesamiento local", "why_cli_tag": "// ¿POR QUÉ CLI Y NO GUI?", "why_cli_1_title": "API estable", "why_cli_1_desc": "Las interfaces CLI no se rompen con las actualizaciones de UI. Una integración funciona a largo plazo.", "why_cli_2_title": "Control preciso", "why_cli_2_desc": "Manipule archivos, coordenadas y parámetros directamente — salida perfecta al píxel cada vez.", "why_cli_3_title": "Por lotes", "why_cli_3_desc": "El mismo comando ejecuta 100+ tareas en paralelo. La automatización GUI solo puede hacer clic en una cosa a la vez."},
    },
    "fr": {
        "scenarios": [
            {"title": "Automatisation des rapports financiers trimestriels", "subtitle": "Télécharger les données → IA génère les graphiques → Exporter PDF", "desc": "Oubliez les tableurs manuels. AgentPuter lit vos données et utilise LibreOffice pour générer un rapport complet avec graphiques et table des matières — 28 pages en 2 minutes.", "output": "Rapport-Q1.pdf · 28 pages"},
            {"title": "Génération d'affiches marketing en série", "subtitle": "Une phrase → IA crée le design → Exporter PNG/SVG haute résolution", "desc": "Décrivez votre thème, couleurs de marque et texte. AgentPuter appelle Inkscape pour générer des affiches vectorielles au pixel près.", "output": "summer-sale-poster.svg · 1920×1080"},
            {"title": "Dessin automatique d'architecture système", "subtitle": "Décrire l'architecture → IA dispose → Exporter SVG/PNG", "desc": "Décrivez vos microservices, flux de données et topologie réseau en langage naturel. AgentPuter utilise la CLI Draw.io pour produire des diagrammes précis.", "output": "microservice-arch.svg · Vecteur modifiable"},
            {"title": "Post-production podcast et audio", "subtitle": "Télécharger l'enregistrement → IA débruite → Exporter MP3 broadcast", "desc": "Enregistrements de réunions, épisodes de podcast — AgentPuter débruite automatiquement, normalise le volume et coupe les silences.", "output": "podcast-ep12-final.mp3 · 128kbps"},
            {"title": "Générateur de documentation technique", "subtitle": "Spécifications API → IA formate → Exporter Word/PDF", "desc": "Collez vos définitions d'API ou descriptions d'interfaces. AgentPuter génère une documentation technique professionnelle avec table des matières.", "output": "api-reference-v2.docx · Format entreprise"},
        ],
        "engines": [
            {"tagline": "Writer · Calc · Impress · Draw — Mode headless", "desc": "Contrôle headless complet de la suite LibreOffice. Générez Word/Excel/PPT/PDF avec macros, modèles et graphiques.", "caps": ["Documents Writer", "Feuilles Calc", "Présentations Impress", "Graphiques Draw", "Export PDF", "Application de modèle"], "scenarios": ["Rapports trimestriels", "Docs techniques", "Rédaction de contrats"], "see_use_cases": "Voir les cas d'usage →"},
            {"tagline": "Vecteur SVG · Affiche · Icône · Logo · Export pixel", "desc": "Contrôle précis des nœuds SVG, chemins, filtres et mise en page via Inkscape. Export dans n'importe quelle résolution.", "caps": ["Art vectoriel SVG", "Design d'affiches", "Génération d'icônes", "Opérations de chemin", "Effets de filtre", "Export en masse"], "scenarios": ["Affiches marketing", "Assets de marque", "Icônes UI"], "see_use_cases": "Voir les cas d'usage →"},
            {"tagline": "Organigrammes · Architecture · ER · Séquence · UML", "desc": "Créez des diagrammes techniques professionnels via la CLI draw.io. Bibliothèques d'icônes AWS/GCP/Azure intégrées.", "caps": ["Architecture microservices", "Topologie réseau", "Diagrammes ER", "Flux métier", "Diagrammes de séquence", "Diagrammes UML"], "scenarios": ["Architecture système", "Conception BD", "Processus métier"], "see_use_cases": "Voir les cas d'usage →"},
            {"tagline": "Débruitage · Édition · Conversion · Normalisation loudness", "desc": "sox gère les effets audio et analyses; ffmpeg gère la conversion des codecs et conteneurs.", "caps": ["Débruitage intelligent", "Détection et coupe de silences", "Normalisation EBU R128", "Conversion de format", "Mixage multipiste", "Analyse audio"], "scenarios": ["Post-prod podcast", "Enregistrement cours", "Audio réunion"], "see_use_cases": "Voir les cas d'usage →"},
        ],
        "labels": {"scenario_section_tag": "// SOLUTIONS PAR SCÉNARIO", "scenario_section_title": "Problèmes réels. Résultats réels.", "scenario_section_desc": "Chaque fonctionnalité est un workflow complet — de votre demande à un fichier téléchargeable.", "engine_section_tag": "// MOTEURS INTÉGRÉS", "engine_section_title": "4 moteurs logiciels. 640+ commandes validées.", "engine_section_desc": "Chaque capacité d'AgentPuter est alimentée par un vrai moteur logiciel — contrôlé via CLI, pas des captures d'écran.", "engine_stat_1": "séquences de commandes validées", "engine_stat_2": "moteurs pour les scénarios clés", "engine_stat_3": "traitement local", "why_cli_tag": "// POURQUOI CLI ET PAS GUI?", "why_cli_1_title": "API stable", "why_cli_1_desc": "Les interfaces CLI ne se cassent pas avec les mises à jour UI. Une intégration fonctionne durablement.", "why_cli_2_title": "Contrôle précis", "why_cli_2_desc": "Manipulez directement les fichiers, coordonnées et paramètres — sortie parfaite au pixel près.", "why_cli_3_title": "Traitement par lots", "why_cli_3_desc": "La même commande s'exécute pour 100+ tâches en parallèle. L'automatisation GUI ne peut cliquer qu'une chose à la fois."},
    },
    "ja": {
        "scenarios": [
            {"title": "四半期財務レポートの自動化", "subtitle": "データをアップロード → AIがグラフ生成 → プロPDFをエクスポート", "desc": "手動の表計算は不要です。AgentPuterがデータを読み込み、LibreOfficeで目次・グラフ付きの完全な財務レポートを生成します—28ページ、2分で完成。", "output": "Q1財務レポート.pdf · 28ページ"},
            {"title": "マーケティングポスターの一括生成", "subtitle": "一文 → AIがデザイン作成 → 高解像度PNG/SVGをエクスポート", "desc": "テーマ、ブランドカラー、コピーを説明するだけ。AgentPuterがInkscapeを呼び出し、ピクセル精度のベクターポスターをバッチ出力します。", "output": "summer-sale-poster.svg · 1920×1080"},
            {"title": "システムアーキテクチャ図の自動作成", "subtitle": "アーキテクチャを説明 → AIがレイアウト → SVG/PNGをエクスポート", "desc": "マイクロサービス、データフロー、ネットワークトポロジーを自然言語で説明するだけ。AgentPuterがDraw.io CLIで正確な図を作成します。", "output": "microservice-arch.svg · ベクター編集可能"},
            {"title": "ポッドキャスト＆音声ポストプロダクション", "subtitle": "録音をアップロード → AIでノイズ除去＆編集 → 放送品質MP3をエクスポート", "desc": "会議録音、ポッドキャスト、コース音声—AgentPuterが自動でノイズ除去、音量正規化、無音トリムを行います。", "output": "podcast-ep12-final.mp3 · 128kbps"},
            {"title": "技術ドキュメントジェネレーター", "subtitle": "API仕様 → AIがフォーマット → Word/PDFをエクスポート", "desc": "APIの定義や機能仕様を貼り付けるだけ。AgentPuterが目次付きの専門的な技術ドキュメントを生成します。", "output": "api-reference-v2.docx · エンタープライズ形式"},
        ],
        "engines": [
            {"tagline": "Writer · Calc · Impress · Draw — ヘッドレスモード", "desc": "LibreOfficeスイート全体を完全ヘッドレスで制御。マクロ、テンプレート、グラフ付きでWord/Excel/PPT/PDFを生成。", "caps": ["Writerドキュメント", "Calc表計算", "Impressプレゼン", "Drawグラフィック", "PDFエクスポート", "テンプレート適用"], "scenarios": ["四半期レポート", "技術ドキュメント", "契約書作成"], "see_use_cases": "ユースケースを見る →"},
            {"tagline": "SVGベクター · ポスター · アイコン · ロゴ · ピクセルエクスポート", "desc": "InkscapeでSVGノード、パス、フィルター、テキストレイアウトを正確にCLI制御。任意の解像度でエクスポート。", "caps": ["SVGベクターアート", "ポスターデザイン", "アイコン生成", "パス操作", "フィルターエフェクト", "バッチエクスポート"], "scenarios": ["マーケティングポスター", "ブランドアセット", "UIアイコン"], "see_use_cases": "ユースケースを見る →"},
            {"tagline": "フローチャート · アーキテクチャ · ER · シーケンス · UML", "desc": "draw.io CLIを通じてプロの技術図を作成。AWS/GCP/Azureアイコンライブラリ内蔵。C4 Model、UML対応。", "caps": ["マイクロサービスアーキテクチャ", "ネットワークトポロジー", "ERデータベース図", "ビジネスフロー", "シーケンス図", "UMLクラス図"], "scenarios": ["システムアーキテクチャ", "DBデザイン", "ビジネスプロセス"], "see_use_cases": "ユースケースを見る →"},
            {"tagline": "ノイズ除去 · 編集 · 変換 · ラウドネス正規化", "desc": "soxが音声エフェクトと分析を処理；ffmpegがコーデックとコンテナ変換を管理。バッチ処理対応。", "caps": ["スマートノイズ除去", "無音検出＆トリム", "EBU R128ラウドネス正規化", "フォーマット変換", "マルチトラックミックス", "音声分析"], "scenarios": ["ポッドキャスト後処理", "コース録音", "会議音声"], "see_use_cases": "ユースケースを見る →"},
        ],
        "labels": {"scenario_section_tag": "// シナリオソリューション", "scenario_section_title": "リアルな問題。リアルな成果。", "scenario_section_desc": "すべての機能は完全なワークフロー—リクエストからダウンロード可能なファイルまで。", "engine_section_tag": "// 内蔵エンジン", "engine_section_title": "4つのソフトウェアエンジン。640+の検証済みコマンド。", "engine_section_desc": "AgentPuterのすべての機能は実際のソフトウェアエンジンで動作—GUIスクリーンショットではなくCLIで制御。", "engine_stat_1": "検証済みコマンドシーケンス", "engine_stat_2": "コアシナリオをカバーするエンジン", "engine_stat_3": "ローカル処理", "why_cli_tag": "// GUIではなくCLIを使う理由", "why_cli_1_title": "安定したAPI", "why_cli_1_desc": "CLIインターフェースはUIの更新で壊れません。一度の統合で長期間有効。", "why_cli_2_title": "精密な制御", "why_cli_2_desc": "ファイル、座標、パラメータを直接操作—毎回ピクセル精度の出力。", "why_cli_3_title": "バッチ処理可能", "why_cli_3_desc": "同じコマンドで100+のタスクを並行実行。GUI自動化は一度に一つの操作のみ。"},
    },
    "ko": {
        "scenarios": [
            {"title": "분기별 재무 보고서 자동화", "subtitle": "데이터 업로드 → AI 차트 생성 → 전문 PDF 내보내기", "desc": "수동 스프레드시트는 이제 그만. AgentPuter가 데이터를 읽고 LibreOffice로 차트와 목차가 포함된 완전한 재무 보고서를 생성합니다 — 28페이지, 2분.", "output": "Q1-재무보고서.pdf · 28페이지"},
            {"title": "마케팅 포스터 일괄 생성", "subtitle": "한 문장 → AI 디자인 생성 → 고화질 PNG/SVG 내보내기", "desc": "테마, 브랜드 색상, 카피를 설명하세요. AgentPuter가 Inkscape를 호출하여 픽셀 단위로 정확한 벡터 포스터를 배치 출력합니다.", "output": "summer-sale-poster.svg · 1920×1080"},
            {"title": "시스템 아키텍처 자동 그리기", "subtitle": "아키텍처 설명 → AI 레이아웃 → SVG/PNG 내보내기", "desc": "마이크로서비스, 데이터 흐름, 네트워크 토폴로지를 자연어로 설명하세요. AgentPuter가 Draw.io CLI로 정확한 아키텍처 다이어그램을 생성합니다.", "output": "microservice-arch.svg · 벡터 편집 가능"},
            {"title": "팟캐스트 & 오디오 포스트 프로덕션", "subtitle": "녹음 업로드 → AI 노이즈 제거 & 편집 → 방송용 MP3 내보내기", "desc": "회의 녹음, 팟캐스트, 강의 오디오 — AgentPuter가 자동으로 노이즈 제거, 볼륨 정규화, 무음 제거를 처리합니다.", "output": "podcast-ep12-final.mp3 · 128kbps"},
            {"title": "기술 문서 생성기", "subtitle": "API 명세 → AI 포매팅 → Word/PDF 내보내기", "desc": "API 정의나 기능 명세를 붙여넣기만 하면 됩니다. AgentPuter가 목차가 포함된 전문 기술 문서를 생성합니다.", "output": "api-reference-v2.docx · 기업 형식"},
        ],
        "engines": [
            {"tagline": "Writer · Calc · Impress · Draw — 헤드리스 모드", "desc": "LibreOffice 제품군 완전 헤드리스 제어. 매크로, 템플릿, 차트로 Word/Excel/PPT/PDF 생성.", "caps": ["Writer 문서", "Calc 스프레드시트", "Impress 프레젠테이션", "Draw 그래픽", "PDF 내보내기", "템플릿 적용"], "scenarios": ["분기별 보고서", "기술 문서", "계약서 작성"], "see_use_cases": "사용 사례 보기 →"},
            {"tagline": "SVG 벡터 · 포스터 · 아이콘 · 로고 · 픽셀 내보내기", "desc": "Inkscape를 통한 SVG 노드, 경로, 필터, 텍스트 레이아웃 정밀 CLI 제어. 임의 해상도로 내보내기.", "caps": ["SVG 벡터 아트", "포스터 디자인", "아이콘 생성", "경로 연산", "필터 효과", "일괄 내보내기"], "scenarios": ["마케팅 포스터", "브랜드 자산", "UI 아이콘"], "see_use_cases": "사용 사례 보기 →"},
            {"tagline": "순서도 · 아키텍처 · ER · 시퀀스 · UML", "desc": "draw.io CLI를 통해 전문 기술 다이어그램을 프로그래밍 방식으로 생성. AWS/GCP/Azure 아이콘 라이브러리 내장.", "caps": ["마이크로서비스 아키텍처", "네트워크 토폴로지", "ER 데이터베이스 다이어그램", "비즈니스 플로우", "시퀀스 다이어그램", "UML 클래스 다이어그램"], "scenarios": ["시스템 아키텍처", "DB 설계", "비즈니스 프로세스"], "see_use_cases": "사용 사례 보기 →"},
            {"tagline": "노이즈 제거 · 편집 · 변환 · 라우드니스 정규화", "desc": "sox가 오디오 효과와 분석을 처리; ffmpeg가 코덱 및 컨테이너 변환을 관리. 배치 처리 지원.", "caps": ["스마트 노이즈 제거", "무음 감지 & 트림", "EBU R128 라우드니스 정규화", "포맷 변환", "멀티트랙 믹스", "오디오 분석"], "scenarios": ["팟캐스트 후처리", "강의 녹음", "회의 오디오"], "see_use_cases": "사용 사례 보기 →"},
        ],
        "labels": {"scenario_section_tag": "// 시나리오 솔루션", "scenario_section_title": "실제 문제. 실제 결과.", "scenario_section_desc": "모든 기능은 완전한 워크플로우입니다 — 요청에서 다운로드 가능한 파일까지.", "engine_section_tag": "// 내장 엔진", "engine_section_title": "4개 소프트웨어 엔진. 640+ 검증된 명령어.", "engine_section_desc": "AgentPuter의 모든 기능은 실제 소프트웨어 엔진으로 구동 — GUI 스크린샷이 아닌 CLI로 제어.", "engine_stat_1": "검증된 명령어 시퀀스", "engine_stat_2": "핵심 시나리오 커버 엔진", "engine_stat_3": "로컬 처리", "why_cli_tag": "// GUI가 아닌 CLI를 사용하는 이유", "why_cli_1_title": "안정적인 API", "why_cli_1_desc": "CLI 인터페이스는 UI 업데이트로 인해 중단되지 않습니다. 한 번의 통합으로 장기간 사용 가능.", "why_cli_2_title": "정밀한 제어", "why_cli_2_desc": "파일, 좌표, 파라미터를 직접 조작 — 매번 픽셀 단위로 정확한 출력.", "why_cli_3_title": "일괄 처리 가능", "why_cli_3_desc": "동일한 명령어로 100개 이상의 작업을 동시에 실행. GUI 자동화는 한 번에 하나의 작업만 가능."},
    },
    "pt-br": {
        "scenarios": [
            {"title": "Automação de Relatórios Financeiros Trimestrais", "subtitle": "Enviar dados → IA gera gráficos → Exportar PDF profissional", "desc": "Esqueça as planilhas manuais. AgentPuter lê seus dados e usa LibreOffice para gerar um relatório completo com gráficos e índice — 28 páginas em 2 minutos.", "output": "Relatorio-Q1.pdf · 28 páginas"},
            {"title": "Geração em Massa de Pôsteres de Marketing", "subtitle": "Uma frase → IA cria design → Exportar PNG/SVG em alta resolução", "desc": "Descreva seu tema, cores da marca e texto. AgentPuter chama o Inkscape para gerar pôsteres vetoriais perfeitos ao pixel com suporte a variações em lote.", "output": "summer-sale-poster.svg · 1920×1080"},
            {"title": "Desenho Automático de Arquitetura de Sistema", "subtitle": "Descrever arquitetura → IA cria layout → Exportar SVG/PNG", "desc": "Descreva seus microsserviços, fluxos de dados e topologia de rede em linguagem natural. AgentPuter usa a CLI do Draw.io para produzir diagramas precisos.", "output": "microservice-arch.svg · Editável em vetor"},
            {"title": "Pós-produção de Podcast e Áudio", "subtitle": "Enviar gravação → IA remove ruído → Exportar MP3 broadcast", "desc": "Gravações de reuniões, episódios de podcast, áudio de cursos — AgentPuter remove ruído automaticamente, normaliza o volume e corta silêncios.", "output": "podcast-ep12-final.mp3 · 128kbps"},
            {"title": "Gerador de Documentação Técnica", "subtitle": "Especificações de API → IA formata → Exportar Word/PDF", "desc": "Cole suas definições de API, especificações de recursos ou descrições de interfaces. AgentPuter gera documentação técnica formatada profissionalmente.", "output": "api-reference-v2.docx · Formato empresarial"},
        ],
        "engines": [
            {"tagline": "Writer · Calc · Impress · Draw — Modo headless", "desc": "Controle headless completo da suite LibreOffice. Gere Word/Excel/PPT/PDF com macros, modelos e gráficos.", "caps": ["Documentos Writer", "Planilhas Calc", "Apresentações Impress", "Gráficos Draw", "Exportação PDF", "Aplicar modelo"], "scenarios": ["Relatórios trimestrais", "Docs técnica", "Redigir contratos"], "see_use_cases": "Ver casos de uso →"},
            {"tagline": "Vetor SVG · Pôster · Ícone · Logo · Exportação pixel", "desc": "Controle preciso de nós SVG, caminhos, filtros e layout de texto via Inkscape. Exporta em qualquer resolução.", "caps": ["Arte vetorial SVG", "Design de pôsteres", "Geração de ícones", "Operações de caminho", "Efeitos de filtro", "Exportação em lote"], "scenarios": ["Pôsteres marketing", "Ativos de marca", "Ícones UI"], "see_use_cases": "Ver casos de uso →"},
            {"tagline": "Fluxogramas · Arquitetura · ER · Sequência · UML", "desc": "Crie diagramas técnicos profissionais via CLI do draw.io. Bibliotecas de ícones AWS/GCP/Azure integradas.", "caps": ["Arquitetura de microsserviços", "Topologia de rede", "Diagramas ER", "Fluxos de negócio", "Diagramas de sequência", "Diagramas UML"], "scenarios": ["Arquitetura de sistemas", "Design BD", "Processos de negócio"], "see_use_cases": "Ver casos de uso →"},
            {"tagline": "Remoção de ruído · Edição · Conversão · Normalização de loudness", "desc": "sox lida com efeitos e análises de áudio; ffmpeg gerencia a conversão de codec e contêiner.", "caps": ["Remoção inteligente de ruído", "Detecção e corte de silêncio", "Normalização EBU R128", "Conversão de formato", "Mix multipista", "Análise de áudio"], "scenarios": ["Pós-prod podcast", "Gravação de cursos", "Áudio de reuniões"], "see_use_cases": "Ver casos de uso →"},
        ],
        "labels": {"scenario_section_tag": "// SOLUÇÕES POR CENÁRIO", "scenario_section_title": "Problemas reais. Resultados reais.", "scenario_section_desc": "Cada funcionalidade é um fluxo de trabalho completo — da sua solicitação a um arquivo para download.", "engine_section_tag": "// ENGINES INTEGRADOS", "engine_section_title": "4 engines de software. 640+ comandos validados.", "engine_section_desc": "Cada capacidade do AgentPuter é impulsionada por um engine de software real — controlado via CLI, não capturas de tela.", "engine_stat_1": "sequências de comandos validadas", "engine_stat_2": "engines para cenários principais", "engine_stat_3": "processamento local", "why_cli_tag": "// POR QUE CLI E NÃO GUI?", "why_cli_1_title": "API estável", "why_cli_1_desc": "Interfaces CLI não quebram com atualizações de UI. Uma integração funciona a longo prazo.", "why_cli_2_title": "Controle preciso", "why_cli_2_desc": "Manipule arquivos, coordenadas e parâmetros diretamente — saída perfeita ao pixel sempre.", "why_cli_3_title": "Em lote", "why_cli_3_desc": "O mesmo comando executa 100+ tarefas simultaneamente. Automação GUI só pode clicar uma coisa por vez."},
    },
    "ru": {
        "scenarios": [
            {"title": "Автоматизация квартальных финансовых отчётов", "subtitle": "Загрузить данные → ИИ создаёт диаграммы → Экспортировать PDF", "desc": "Забудьте о ручных таблицах. AgentPuter читает ваши данные и использует LibreOffice для создания полного финансового отчёта с диаграммами и оглавлением — 28 страниц за 2 минуты.", "output": "Q1-финансовый-отчёт.pdf · 28 страниц"},
            {"title": "Массовая генерация маркетинговых постеров", "subtitle": "Одна фраза → ИИ создаёт дизайн → Экспортировать PNG/SVG", "desc": "Опишите тему, фирменные цвета и текст. AgentPuter вызывает Inkscape для создания векторных постеров с точностью до пикселя и поддержкой пакетного вывода.", "output": "summer-sale-poster.svg · 1920×1080"},
            {"title": "Автоматическое создание диаграмм архитектуры", "subtitle": "Описать архитектуру → ИИ расставляет элементы → SVG/PNG", "desc": "Опишите ваши микросервисы, потоки данных и сетевую топологию на естественном языке. AgentPuter использует Draw.io CLI для точных архитектурных диаграмм.", "output": "microservice-arch.svg · Редактируемый вектор"},
            {"title": "Постпродакшн подкастов и аудио", "subtitle": "Загрузить запись → ИИ убирает шум → MP3 вещательного качества", "desc": "Записи встреч, эпизоды подкастов, аудио курсов — AgentPuter автоматически убирает шум, нормализует громкость и обрезает тишину.", "output": "podcast-ep12-final.mp3 · 128kbps"},
            {"title": "Генератор технической документации", "subtitle": "Спецификации API → ИИ форматирует → Word/PDF", "desc": "Вставьте ваши определения API, спецификации функций или описания интерфейсов. AgentPuter генерирует профессионально оформленную техдокументацию с оглавлением.", "output": "api-reference-v2.docx · Корпоративный формат"},
        ],
        "engines": [
            {"tagline": "Writer · Calc · Impress · Draw — Безголовый режим", "desc": "Полное управление пакетом LibreOffice в безголовом режиме. Создавайте Word/Excel/PPT/PDF с макросами, шаблонами и диаграммами.", "caps": ["Документы Writer", "Таблицы Calc", "Презентации Impress", "Графика Draw", "Экспорт PDF", "Применение шаблонов"], "scenarios": ["Квартальные отчёты", "Технические доки", "Составление договоров"], "see_use_cases": "Смотреть кейсы →"},
            {"tagline": "SVG-вектор · Постер · Иконка · Логотип · Пиксельный экспорт", "desc": "Точное CLI-управление SVG-узлами, путями, фильтрами и вёрсткой текста через Inkscape. Экспорт в любом разрешении.", "caps": ["SVG-векторное искусство", "Дизайн постеров", "Генерация иконок", "Операции с путями", "Эффекты фильтров", "Пакетный экспорт"], "scenarios": ["Маркетинговые постеры", "Брендовые ресурсы", "UI-иконки"], "see_use_cases": "Смотреть кейсы →"},
            {"tagline": "Блок-схемы · Архитектура · ER · Последовательности · UML", "desc": "Программное создание профессиональных технических диаграмм через draw.io CLI. Встроенные библиотеки иконок AWS/GCP/Azure.", "caps": ["Архитектура микросервисов", "Топология сети", "ER-диаграммы БД", "Бизнес-процессы", "Диаграммы последовательностей", "UML-диаграммы классов"], "scenarios": ["Системная архитектура", "Проектирование БД", "Бизнес-процессы"], "see_use_cases": "Смотреть кейсы →"},
            {"tagline": "Шумоподавление · Редактирование · Конвертация · Нормализация громкости", "desc": "sox обрабатывает аудиоэффекты и анализ; ffmpeg управляет конвертацией кодеков и контейнеров.", "caps": ["Умное шумоподавление", "Обнаружение и обрезка тишины", "Нормализация EBU R128", "Конвертация форматов", "Многодорожечное сведение", "Анализ аудио"], "scenarios": ["Постпродакшн подкастов", "Запись курсов", "Аудио встреч"], "see_use_cases": "Смотреть кейсы →"},
        ],
        "labels": {"scenario_section_tag": "// СЦЕНАРНЫЕ РЕШЕНИЯ", "scenario_section_title": "Реальные проблемы. Реальные результаты.", "scenario_section_desc": "Каждая функция — это полный рабочий процесс: от вашего запроса до загружаемого файла.", "engine_section_tag": "// ВСТРОЕННЫЕ ДВИЖКИ", "engine_section_title": "4 программных движка. 640+ проверенных команд.", "engine_section_desc": "Каждая возможность AgentPuter работает через настоящий программный движок — управление через CLI, а не скриншоты GUI.", "engine_stat_1": "проверенных командных последовательностей", "engine_stat_2": "движка для ключевых сценариев", "engine_stat_3": "локальная обработка", "why_cli_tag": "// ПОЧЕМУ CLI, А НЕ GUI?", "why_cli_1_title": "Стабильное API", "why_cli_1_desc": "CLI-интерфейсы не ломаются при обновлениях UI. Одна интеграция работает долгосрочно.", "why_cli_2_title": "Точное управление", "why_cli_2_desc": "Прямое управление файлами, координатами и параметрами — идеальный вывод до пикселя.", "why_cli_3_title": "Пакетная обработка", "why_cli_3_desc": "Одна команда выполняет 100+ задач одновременно. GUI-автоматизация может кликать только одно за раз."},
    },
}

# ─────────────────────────────────────────────
# Static data (unchanged across languages)
# ─────────────────────────────────────────────

SCENARIO_SLUGS_TAGS = [
    ("financial-report", "01", "FINANCE",     "text-[#38BDF8] bg-[#38BDF8]/10", "📊", "ap-docs"),
    ("design-poster",    "02", "DESIGN",      "text-[#A78BFA] bg-[#A78BFA]/10", "🎨", "ap-design"),
    ("system-diagram",   "03", "ENGINEERING", "text-[#FBBF24] bg-[#FBBF24]/10", "📐", "ap-diagrams"),
    ("audio-production", "04", "AUDIO",       "text-[#4ADE80] bg-[#4ADE80]/10", "🎵", "ap-audio"),
    ("tech-docs",        "05", "DOCS",        "text-[#38BDF8] bg-[#38BDF8]/10", "📝", "ap-docs"),
]

ENGINE_IDS = ["ap-docs", "ap-design", "ap-diagrams", "ap-audio"]
ENGINE_ICONS = {"ap-docs": "📄", "ap-design": "🎨", "ap-diagrams": "📐", "ap-audio": "🎵"}
ENGINE_UNDERLYING = {"ap-docs": "LibreOffice", "ap-design": "Inkscape", "ap-diagrams": "Draw.io (diagrams.net)", "ap-audio": "sox + ffmpeg"}
ENGINE_BADGE = {"ap-docs": "158 ✓", "ap-design": "203 ✓", "ap-diagrams": "138 ✓", "ap-audio": "141 ✓"}
ENGINE_COLOR = {"ap-docs": ("#38BDF8", "rgba(56,189,248,0.08)", "rgba(56,189,248,0.2)"), "ap-design": ("#A78BFA", "rgba(167,139,250,0.08)", "rgba(167,139,250,0.2)"), "ap-diagrams": ("#FBBF24", "rgba(251,191,36,0.08)", "rgba(251,191,36,0.2)"), "ap-audio": ("#4ADE80", "rgba(74,222,128,0.08)", "rgba(74,222,128,0.2)")}
ENGINE_CMDS = {"ap-docs": ["ap-docs new --type report", "ap-docs chart --data file.csv", "ap-docs export --pdf --toc", "ap-docs macro run --name monthly"], "ap-design": ["ap-design canvas --size 1080x1920", "ap-design text --weight bold --color white", "ap-design export --png 2x", "ap-design batch --variants 10"], "ap-diagrams": ["ap-diagrams new --type microservice", "ap-diagrams add node --label 'API Gateway'", "ap-diagrams export --svg --theme dark", "ap-diagrams from-schema --input db.sql"], "ap-audio": ["ap-audio denoise --input raw.wav", "ap-audio loudnorm --target -14 LUFS", "ap-audio convert --mp3 128k", "ap-audio trim --remove-silence"]}


def gen_scenario_cards(lang_data: dict) -> str:
    scenarios_t = lang_data["scenarios"]
    labels = lang_data["labels"]
    cards = ""
    for i, (slug, num, tag, tag_class, icon, engine) in enumerate(SCENARIO_SLUGS_TAGS):
        s = scenarios_t[i]
        cards += f"""
      <a
        href="/features/{slug}"
        class="group flex items-start gap-6 md:gap-8 bg-[#111111] hover:bg-[#161622] border border-[#1E1E2E] hover:border-accent/20 rounded-2xl p-6 md:p-8 transition-all duration-200"
      >
        <div class="shrink-0 flex flex-col items-center gap-2 w-12">
          <span class="text-[#2A2A3A] font-mono text-xs">{num}</span>
          <span class="text-3xl">{icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-3 mb-2">
            <span class="text-xs font-bold font-mono px-2 py-0.5 rounded {tag_class}">{tag}</span>
            <span class="text-xs text-[#4A4A6A] font-mono">{engine}</span>
          </div>
          <h3 class="text-white text-lg font-bold mb-1 group-hover:text-accent transition-colors">{s['title']}</h3>
          <p class="text-[#6B7280] text-sm mb-2">{s['subtitle']}</p>
          <p class="text-[#4B5563] text-sm leading-relaxed hidden md:block">{s['desc']}</p>
        </div>
        <div class="shrink-0 flex flex-col items-end justify-between gap-4 min-w-0">
          <div class="bg-[#0D0D1A] px-3 py-1.5 rounded-lg font-mono text-xs text-[#6B7280] whitespace-nowrap hidden lg:block">📄 {s['output']}</div>
          <span class="text-[#2A2A3A] group-hover:text-accent transition-colors text-xl">→</span>
        </div>
      </a>"""

    return f"""---
// ScenarioCards — generated by generate_translated_components.py
// To refresh via Gemini 3 Flash: python scripts/translate_components.py --api-key YOUR_KEY
---

<section class="py-16 lg:py-24">
  <div class="max-w-7xl mx-auto px-6 lg:px-20">
    <div class="mb-12">
      <div class="font-mono text-accent text-xs font-semibold tracking-[0.2em] mb-4">{labels['scenario_section_tag']}</div>
      <h2 class="text-white text-3xl md:text-4xl font-bold mb-4">{labels['scenario_section_title']}</h2>
      <p class="text-[#9CA3AF] text-base max-w-2xl">{labels['scenario_section_desc']}</p>
    </div>
    <div class="flex flex-col gap-4">{cards}
    </div>
  </div>
</section>
"""


def gen_engine_cards(lang_data: dict) -> str:
    engines_t = lang_data["engines"]
    labels = lang_data["labels"]
    cards = ""
    for i, eid in enumerate(ENGINE_IDS):
        e = engines_t[i]
        color, color_bg, color_border = ENGINE_COLOR[eid]
        cmds = ENGINE_CMDS[eid]
        caps_html = "\n              ".join(f'<span class="text-xs px-2.5 py-1 rounded font-mono" style="background: {color_bg}; color: {color};">{c}</span>' for c in e["caps"])
        scenarios_html = "\n              ".join(f'<span class="text-xs text-[#4B5563] border border-[#1E1E2E] px-2 py-0.5 rounded font-mono">{s}</span>' for s in e["scenarios"])
        cmds_html = "\n            ".join(f'<p class="text-xs"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">{cmd}</span></p>' for cmd in cmds)
        cards += f"""
        <div class="bg-[#0D0D1A] rounded-2xl p-6 md:p-7 border transition-all duration-200 hover:-translate-y-0.5" style="border-color: {color_border};">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{ENGINE_ICONS[eid]}</span>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold font-mono text-base" style="color: {color};">{eid}</span>
                  <span class="text-xs font-bold font-mono px-2 py-0.5 rounded" style="color: {color}; background: {color_bg};">{ENGINE_BADGE[eid]}</span>
                </div>
                <p class="text-[#4A4A6A] text-xs mt-0.5">{ENGINE_UNDERLYING[eid]}</p>
              </div>
            </div>
          </div>
          <p class="text-xs font-mono mb-3" style="color: {color}; opacity: 0.7;">{e['tagline']}</p>
          <p class="text-[#6B7280] text-xs leading-relaxed mb-5">{e['desc']}</p>
          <div class="flex flex-wrap gap-2 mb-5">
            {caps_html}
          </div>
          <div class="bg-black/40 rounded-xl p-4 space-y-1.5 mb-5 font-mono">
            {cmds_html}
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap gap-2">
              {scenarios_html}
            </div>
            <a href="/features" class="text-xs font-mono transition-colors" style="color: {color};">{e['see_use_cases']}</a>
          </div>
        </div>"""

    return f"""---
// EngineCards — generated by generate_translated_components.py
---

<section class="py-16 lg:py-24 bg-[#080810]">
  <div class="max-w-7xl mx-auto px-6 lg:px-20">
    <div class="mb-12">
      <div class="font-mono text-accent text-xs font-semibold tracking-[0.2em] mb-4">{labels['engine_section_tag']}</div>
      <h2 class="text-white text-3xl md:text-4xl font-bold mb-4">{labels['engine_section_title']}</h2>
      <p class="text-[#9CA3AF] text-base max-w-2xl mb-6">{labels['engine_section_desc']}</p>
      <div class="flex gap-6 text-xs text-[#4B5563] font-mono">
        <span><span class="text-accent">640+</span> {labels['engine_stat_1']}</span>
        <span><span class="text-accent">4</span> {labels['engine_stat_2']}</span>
        <span><span class="text-accent">100%</span> {labels['engine_stat_3']}</span>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">{cards}
    </div>
    <div class="mt-12 pt-8 border-t border-[#1E1E2E]">
      <p class="font-mono text-xs text-accent font-bold tracking-widest mb-3">{labels['why_cli_tag']}</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#4B5563] leading-relaxed">
        <div><p class="text-[#94A3B8] font-semibold mb-1">{labels['why_cli_1_title']}</p>{labels['why_cli_1_desc']}</div>
        <div><p class="text-[#94A3B8] font-semibold mb-1">{labels['why_cli_2_title']}</p>{labels['why_cli_2_desc']}</div>
        <div><p class="text-[#94A3B8] font-semibold mb-1">{labels['why_cli_3_title']}</p>{labels['why_cli_3_desc']}</div>
      </div>
      <p class="text-[#2A2A3A] text-xs font-mono mt-4">// Based on CLI-Anything by HKUDS Lab (MIT License) · Extended &amp; internalized by AgentPuter</p>
    </div>
  </div>
</section>
"""


def main():
    for lang_code, lang_data in TRANSLATIONS.items():
        print(f"Generating {lang_code}...")

        sc_dir = COMPONENTS / lang_code / "features"
        sc_dir.mkdir(parents=True, exist_ok=True)
        (sc_dir / "ScenarioCards.astro").write_text(gen_scenario_cards(lang_data), encoding="utf-8")

        ec_dir = COMPONENTS / lang_code / "tools"
        ec_dir.mkdir(parents=True, exist_ok=True)
        (ec_dir / "EngineCards.astro").write_text(gen_engine_cards(lang_data), encoding="utf-8")

        print(f"  OK {lang_code}/features/ScenarioCards.astro")
        print(f"  OK {lang_code}/tools/EngineCards.astro")

    print("\nAll components generated!")


if __name__ == "__main__":
    main()
