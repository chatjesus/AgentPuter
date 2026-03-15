#!/usr/bin/env python3
"""
generate_scenario_i18n.py
Pre-baked translations for all 9 languages × 5 scenario detail pages.
No API key needed — translations are embedded.
"""
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Language metadata ────────────────────────────────────────────────────────
LANGS = {
    "de":    { "name": "German",              "layout_depth": "../../../" },
    "es":    { "name": "Spanish",             "layout_depth": "../../../" },
    "fr":    { "name": "French",              "layout_depth": "../../../" },
    "ja":    { "name": "Japanese",            "layout_depth": "../../../" },
    "ko":    { "name": "Korean",              "layout_depth": "../../../" },
    "pt-br": { "name": "Brazilian Portuguese","layout_depth": "../../../" },
    "ru":    { "name": "Russian",             "layout_depth": "../../../" },
    "zh":    { "name": "Chinese Simplified",  "layout_depth": "../../../" },
    "zh-tw": { "name": "Chinese Traditional", "layout_depth": "../../../" },
}

# ─── Common UI strings ────────────────────────────────────────────────────────
UI = {
    "de": {
        "back": "← zurück zu Funktionen",
        "get_started": "[LOSLEGEN]",
        "all_scenarios": "[ALLE SZENARIEN]",
        "other_heading": "// ANDERE SZENARIEN",
        "caps_heading": "// WAS DIESES SZENARIO UNTERSTÜTZT",
        "deploy_heading": "// IHREN AGENT EINSETZEN",
        "session_heading": "// AGENT-SITZUNGSPROTOKOLL",
        "plan_comment": "// Ausführungsreihenfolge planen",
    },
    "es": {
        "back": "← volver a funciones",
        "get_started": "[COMENZAR]",
        "all_scenarios": "[TODOS LOS ESCENARIOS]",
        "other_heading": "// OTROS ESCENARIOS",
        "caps_heading": "// QUÉ ADMITE ESTE ESCENARIO",
        "deploy_heading": "// DESPLEGAR TU AGENTE",
        "session_heading": "// REGISTRO DE SESIÓN DEL AGENTE",
        "plan_comment": "// Planificando secuencia de ejecución",
    },
    "fr": {
        "back": "← retour aux fonctionnalités",
        "get_started": "[COMMENCER]",
        "all_scenarios": "[TOUS LES SCÉNARIOS]",
        "other_heading": "// AUTRES SCÉNARIOS",
        "caps_heading": "// CE QUE CE SCÉNARIO PREND EN CHARGE",
        "deploy_heading": "// DÉPLOYER VOTRE AGENT",
        "session_heading": "// JOURNAL DE SESSION DE L'AGENT",
        "plan_comment": "// Planification de la séquence d'exécution",
    },
    "ja": {
        "back": "← 機能ページに戻る",
        "get_started": "[今すぐ始める]",
        "all_scenarios": "[すべてのシナリオ]",
        "other_heading": "// 他のシナリオ",
        "caps_heading": "// このシナリオでサポートされる機能",
        "deploy_heading": "// エージェントをデプロイ",
        "session_heading": "// エージェントセッションログ",
        "plan_comment": "// 実行シーケンスの計画",
    },
    "ko": {
        "back": "← 기능 페이지로 돌아가기",
        "get_started": "[시작하기]",
        "all_scenarios": "[모든 시나리오]",
        "other_heading": "// 다른 시나리오",
        "caps_heading": "// 이 시나리오에서 지원하는 기능",
        "deploy_heading": "// 에이전트 배포",
        "session_heading": "// 에이전트 세션 로그",
        "plan_comment": "// 실행 순서 계획 중",
    },
    "pt-br": {
        "back": "← voltar para funcionalidades",
        "get_started": "[COMEÇAR]",
        "all_scenarios": "[TODOS OS CENÁRIOS]",
        "other_heading": "// OUTROS CENÁRIOS",
        "caps_heading": "// O QUE ESTE CENÁRIO SUPORTA",
        "deploy_heading": "// IMPLANTAR SEU AGENTE",
        "session_heading": "// LOG DE SESSÃO DO AGENTE",
        "plan_comment": "// Planejando sequência de execução",
    },
    "ru": {
        "back": "← назад к функциям",
        "get_started": "[НАЧАТЬ]",
        "all_scenarios": "[ВСЕ СЦЕНАРИИ]",
        "other_heading": "// ДРУГИЕ СЦЕНАРИИ",
        "caps_heading": "// ЧТО ПОДДЕРЖИВАЕТ ЭТОТ СЦЕНАРИЙ",
        "deploy_heading": "// РАЗВЕРНУТЬ АГЕНТА",
        "session_heading": "// ЖУРНАЛ СЕССИИ АГЕНТА",
        "plan_comment": "// Планирование последовательности выполнения",
    },
    "zh": {
        "back": "← 返回功能页",
        "get_started": "[立即开始]",
        "all_scenarios": "[全部场景]",
        "other_heading": "// 其他场景",
        "caps_heading": "// 此场景支持的能力",
        "deploy_heading": "// 部署你的 Agent",
        "session_heading": "// Agent 会话日志",
        "plan_comment": "// 规划执行顺序",
    },
    "zh-tw": {
        "back": "← 返回功能頁",
        "get_started": "[立即開始]",
        "all_scenarios": "[全部場景]",
        "other_heading": "// 其他情境",
        "caps_heading": "// 此情境支援的功能",
        "deploy_heading": "// 部署你的 Agent",
        "session_heading": "// Agent 工作階段日誌",
        "plan_comment": "// 規劃執行順序",
    },
}

# ─── Scenario translations ────────────────────────────────────────────────────
SCENARIOS = {
    "financial-report": {
        "tag": "FINANCE",
        "engine_badge": "ap-docs",
        "lib_badge": "LibreOffice",
        "accent": "#38BDF8",
        "en": {
            "meta_title": "Quarterly Financial Report Automation — AgentPuter",
            "meta_desc": "Upload raw data, get a 28-page professional PDF in 2 minutes.",
            "h1_line1": "Quarterly Financial Report",
            "h1_line2": "Automation",
            "subtitle": "Upload data → AI generates charts → Export professional PDF",
            "steps": ["① Upload CSV / spreadsheet", "② Agent structures + charts", "③ 28-page PDF exported"],
            "user_msg": '"Generate a Q1 financial report from our sales data. Include charts, a summary table, and export as PDF."',
            "plan_steps": [
                "Parse Q1-sales.csv (147 rows, 6 columns)",
                "Calculate totals, MoM growth, category breakdown",
                "Generate bar + line charts via ap-docs chart",
                "Apply enterprise report template",
                "Export as PDF with auto-generated TOC",
            ],
            "caps": [
                ("📊", "Multi-chart generation", "Bar, line, pie, combo charts auto-inserted from CSV/Excel data."),
                ("📋", "Enterprise templates", "Apply branded .dotx templates with logo, headers, standard footers."),
                ("📑", "Auto TOC + page numbers", "Table of contents generated from headings. Page numbers, section breaks."),
                ("🔢", "Formula & macro execution", "Run LibreOffice Basic macros to compute totals, apply conditional formatting."),
                ("📄", "Multi-format export", "Output as PDF, DOCX, XLSX, or ODS. Preserve fonts and layout."),
                ("⚡", "Batch report generation", "Run the same template across 50 regions/departments in parallel."),
            ],
            "cta_title": "Ready to automate your reports?",
            "cta_desc": "AgentPuter handles the full workflow — from raw data to boardroom-ready PDF. No manual formatting ever again.",
        },
        "de": {
            "meta_title": "Quartals-Finanzbericht-Automatisierung — AgentPuter",
            "h1_line1": "Quartals-Finanzbericht-",
            "h1_line2": "Automatisierung",
            "subtitle": "Daten hochladen → KI generiert Diagramme → Professionelles PDF exportieren",
            "steps": ["① CSV / Tabelle hochladen", "② Agent strukturiert + Charts", "③ 28-seitiges PDF exportiert"],
            "user_msg": '"Erstelle einen Q1-Finanzbericht aus unseren Verkaufsdaten. Mit Diagrammen, einer Zusammenfassungstabelle, als PDF exportiert."',
            "plan_steps": [
                "Q1-sales.csv parsen (147 Zeilen, 6 Spalten)",
                "Summen, MoM-Wachstum, Kategorieaufschlüsselung berechnen",
                "Balken- und Liniendiagramme via ap-docs chart generieren",
                "Enterprise-Berichtsvorlage anwenden",
                "Als PDF mit automatisch generiertem Inhaltsverzeichnis exportieren",
            ],
            "caps": [
                ("📊", "Multi-Diagramm-Generierung", "Balken-, Linien-, Torten- und Kombi-Diagramme automatisch aus CSV/Excel-Daten eingefügt."),
                ("📋", "Enterprise-Vorlagen", "Markenspezifische .dotx-Vorlagen mit Logo, Kopfzeilen und Standardfußzeilen anwenden."),
                ("📑", "Automatisches Inhaltsverz. + Seitenzahlen", "Inhaltsverzeichnis aus Überschriften generiert. Seitenzahlen, Abschnittsumbrüche."),
                ("🔢", "Formel- & Makroausführung", "LibreOffice Basic-Makros zum Berechnen von Summen und bedingter Formatierung."),
                ("📄", "Multi-Format-Export", "Ausgabe als PDF, DOCX, XLSX oder ODS. Schriften und Layout beibehalten."),
                ("⚡", "Batch-Berichtsgenerierung", "Dieselbe Vorlage für 50 Regionen/Abteilungen parallel ausführen."),
            ],
            "cta_title": "Bereit, Ihre Berichte zu automatisieren?",
            "cta_desc": "AgentPuter übernimmt den gesamten Workflow — von Rohdaten bis zum boardroomfähigen PDF. Kein manuelles Formatieren mehr.",
        },
        "es": {
            "meta_title": "Automatización de Informes Financieros Trimestrales — AgentPuter",
            "h1_line1": "Automatización de Informes",
            "h1_line2": "Financieros Trimestrales",
            "subtitle": "Sube datos → La IA genera gráficos → Exporta PDF profesional",
            "steps": ["① Subir CSV / hoja de cálculo", "② El agente estructura + gráficos", "③ PDF de 28 páginas exportado"],
            "user_msg": '"Genera un informe financiero del T1 con nuestros datos de ventas. Incluye gráficos, tabla resumen y expórtalo en PDF."',
            "plan_steps": [
                "Analizar Q1-sales.csv (147 filas, 6 columnas)",
                "Calcular totales, crecimiento MoM, desglose por categoría",
                "Generar gráficos de barras y líneas con ap-docs chart",
                "Aplicar plantilla de informe empresarial",
                "Exportar como PDF con índice autogenerado",
            ],
            "caps": [
                ("📊", "Generación de múltiples gráficos", "Gráficos de barras, líneas, circulares y combinados insertados automáticamente desde CSV/Excel."),
                ("📋", "Plantillas empresariales", "Aplica plantillas .dotx personalizadas con logo, encabezados y pies de página estándar."),
                ("📑", "Índice automático + numeración", "Índice generado desde los encabezados. Números de página y saltos de sección."),
                ("🔢", "Ejecución de fórmulas y macros", "Ejecuta macros de LibreOffice Basic para calcular totales y formato condicional."),
                ("📄", "Exportación en múltiples formatos", "Salida en PDF, DOCX, XLSX u ODS. Preserva fuentes y diseño."),
                ("⚡", "Generación de informes en lote", "Ejecuta la misma plantilla en 50 regiones/departamentos en paralelo."),
            ],
            "cta_title": "¿Listo para automatizar tus informes?",
            "cta_desc": "AgentPuter gestiona el flujo completo: de datos brutos a un PDF listo para la sala de juntas. Sin formateo manual.",
        },
        "fr": {
            "meta_title": "Automatisation des Rapports Financiers Trimestriels — AgentPuter",
            "h1_line1": "Automatisation des Rapports",
            "h1_line2": "Financiers Trimestriels",
            "subtitle": "Importer des données → L'IA génère des graphiques → Exporter en PDF professionnel",
            "steps": ["① Importer CSV / tableur", "② L'agent structure + graphiques", "③ PDF de 28 pages exporté"],
            "user_msg": '"Génère un rapport financier T1 à partir de nos données de ventes. Inclus des graphiques, un tableau récapitulatif, exporte en PDF."',
            "plan_steps": [
                "Analyser Q1-sales.csv (147 lignes, 6 colonnes)",
                "Calculer les totaux, croissance MoM, ventilation par catégorie",
                "Générer graphiques barres et lignes via ap-docs chart",
                "Appliquer le modèle de rapport entreprise",
                "Exporter en PDF avec table des matières auto-générée",
            ],
            "caps": [
                ("📊", "Génération multi-graphiques", "Graphiques barres, lignes, circulaires et combinés insérés automatiquement depuis CSV/Excel."),
                ("📋", "Modèles d'entreprise", "Appliquer des modèles .dotx personnalisés avec logo, en-têtes et pieds de page standard."),
                ("📑", "Table des matières auto + numéros", "Table des matières générée depuis les titres. Numéros de page, sauts de section."),
                ("🔢", "Exécution formules et macros", "Macros LibreOffice Basic pour calculer les totaux et la mise en forme conditionnelle."),
                ("📄", "Export multi-format", "Sortie en PDF, DOCX, XLSX ou ODS. Police et mise en page préservées."),
                ("⚡", "Génération de rapports en lot", "Exécuter le même modèle pour 50 régions/départements en parallèle."),
            ],
            "cta_title": "Prêt à automatiser vos rapports ?",
            "cta_desc": "AgentPuter gère le flux complet — des données brutes au PDF prêt pour le conseil d'administration. Fini le formatage manuel.",
        },
        "ja": {
            "meta_title": "四半期財務レポート自動化 — AgentPuter",
            "h1_line1": "四半期財務レポート",
            "h1_line2": "自動化",
            "subtitle": "データをアップロード → AIがグラフを生成 → プロ品質のPDFをエクスポート",
            "steps": ["① CSV / スプレッドシートをアップロード", "② エージェントが構造化＋グラフ作成", "③ 28ページのPDFをエクスポート"],
            "user_msg": '"売上データからQ1財務レポートを作成してください。グラフ、サマリーテーブルを含め、PDFで出力してください。"',
            "plan_steps": [
                "Q1-sales.csvを解析（147行、6列）",
                "合計、前月比成長率、カテゴリ内訳を計算",
                "ap-docs chartで棒グラフと折れ線グラフを生成",
                "エンタープライズレポートテンプレートを適用",
                "自動生成目次付きPDFとしてエクスポート",
            ],
            "caps": [
                ("📊", "複数グラフの自動生成", "棒・折れ線・円・複合グラフをCSV/Excelデータから自動挿入。"),
                ("📋", "エンタープライズテンプレート", "ロゴ、ヘッダー、標準フッター付きのブランド.dotxテンプレートを適用。"),
                ("📑", "自動目次+ページ番号", "見出しから目次を自動生成。ページ番号、セクション区切り。"),
                ("🔢", "数式&マクロ実行", "LibreOffice Basicマクロで合計計算や条件付き書式を適用。"),
                ("📄", "マルチフォーマット出力", "PDF、DOCX、XLSX、ODSで出力。フォントとレイアウトを維持。"),
                ("⚡", "バッチレポート生成", "同じテンプレートで50地域/部門を並列処理。"),
            ],
            "cta_title": "レポートを自動化する準備はできていますか？",
            "cta_desc": "AgentPuterが全ワークフローを担当 — 生データから役員会向けPDFまで。手動フォーマットは不要です。",
        },
        "ko": {
            "meta_title": "분기 재무 보고서 자동화 — AgentPuter",
            "h1_line1": "분기 재무 보고서",
            "h1_line2": "자동화",
            "subtitle": "데이터 업로드 → AI가 차트 생성 → 전문 PDF 내보내기",
            "steps": ["① CSV / 스프레드시트 업로드", "② 에이전트가 구조화 + 차트 작성", "③ 28페이지 PDF 내보내기"],
            "user_msg": '"영업 데이터로 Q1 재무 보고서를 만들어주세요. 차트, 요약 표 포함해서 PDF로 내보내주세요."',
            "plan_steps": [
                "Q1-sales.csv 파싱 (147행, 6열)",
                "합계, 전월 대비 성장률, 카테고리 분류 계산",
                "ap-docs chart로 막대 + 꺾은선 차트 생성",
                "기업용 보고서 템플릿 적용",
                "자동 생성 목차 포함 PDF로 내보내기",
            ],
            "caps": [
                ("📊", "다중 차트 생성", "CSV/Excel 데이터에서 막대, 꺾은선, 원형, 복합 차트 자동 삽입."),
                ("📋", "기업용 템플릿", "로고, 헤더, 표준 푸터가 포함된 브랜드 .dotx 템플릿 적용."),
                ("📑", "자동 목차 + 페이지 번호", "제목에서 목차 자동 생성. 페이지 번호, 섹션 구분."),
                ("🔢", "수식 & 매크로 실행", "LibreOffice Basic 매크로로 합계 계산 및 조건부 서식 적용."),
                ("📄", "멀티 포맷 내보내기", "PDF, DOCX, XLSX 또는 ODS로 출력. 글꼴과 레이아웃 유지."),
                ("⚡", "배치 보고서 생성", "동일 템플릿으로 50개 지역/부서 병렬 처리."),
            ],
            "cta_title": "보고서 자동화를 시작할 준비가 됐나요?",
            "cta_desc": "AgentPuter가 전체 워크플로우를 처리합니다 — 원시 데이터에서 이사회용 PDF까지. 더 이상 수동 포맷팅은 없습니다.",
        },
        "pt-br": {
            "meta_title": "Automação de Relatório Financeiro Trimestral — AgentPuter",
            "h1_line1": "Automação de Relatório",
            "h1_line2": "Financeiro Trimestral",
            "subtitle": "Envie dados → IA gera gráficos → Exporte PDF profissional",
            "steps": ["① Enviar CSV / planilha", "② Agente estrutura + gráficos", "③ PDF de 28 páginas exportado"],
            "user_msg": '"Gere um relatório financeiro do T1 com nossos dados de vendas. Inclua gráficos, tabela resumo e exporte em PDF."',
            "plan_steps": [
                "Analisar Q1-sales.csv (147 linhas, 6 colunas)",
                "Calcular totais, crescimento MoM, detalhamento por categoria",
                "Gerar gráficos de barras e linhas via ap-docs chart",
                "Aplicar template de relatório empresarial",
                "Exportar como PDF com sumário autogenerado",
            ],
            "caps": [
                ("📊", "Geração de múltiplos gráficos", "Gráficos de barra, linha, pizza e combinados inseridos automaticamente de CSV/Excel."),
                ("📋", "Templates empresariais", "Aplique templates .dotx personalizados com logo, cabeçalhos e rodapés padrão."),
                ("📑", "Sumário automático + paginação", "Sumário gerado a partir dos títulos. Números de página, quebras de seção."),
                ("🔢", "Execução de fórmulas e macros", "Execute macros do LibreOffice Basic para calcular totais e formatação condicional."),
                ("📄", "Exportação em múltiplos formatos", "Saída em PDF, DOCX, XLSX ou ODS. Preserva fontes e layout."),
                ("⚡", "Geração de relatórios em lote", "Execute o mesmo template para 50 regiões/departamentos em paralelo."),
            ],
            "cta_title": "Pronto para automatizar seus relatórios?",
            "cta_desc": "AgentPuter gerencia todo o fluxo — de dados brutos a um PDF pronto para a diretoria. Sem formatação manual.",
        },
        "ru": {
            "meta_title": "Автоматизация квартального финансового отчёта — AgentPuter",
            "h1_line1": "Автоматизация квартального",
            "h1_line2": "финансового отчёта",
            "subtitle": "Загрузите данные → ИИ генерирует графики → Экспорт в профессиональный PDF",
            "steps": ["① Загрузить CSV / таблицу", "② Агент структурирует + графики", "③ PDF на 28 страниц готов"],
            "user_msg": '"Создай финансовый отчёт за Q1 по нашим данным продаж. Включи графики, сводную таблицу, экспортируй в PDF."',
            "plan_steps": [
                "Разобрать Q1-sales.csv (147 строк, 6 столбцов)",
                "Рассчитать итоги, рост MoM, разбивку по категориям",
                "Сгенерировать столбчатые и линейные графики через ap-docs chart",
                "Применить корпоративный шаблон отчёта",
                "Экспортировать в PDF с автоматически созданным оглавлением",
            ],
            "caps": [
                ("📊", "Генерация нескольких графиков", "Столбчатые, линейные, круговые и комбинированные графики из CSV/Excel автоматически."),
                ("📋", "Корпоративные шаблоны", "Применяйте фирменные .dotx-шаблоны с логотипом, заголовками и стандартными нижними колонтитулами."),
                ("📑", "Автооглавление + номера страниц", "Оглавление из заголовков. Номера страниц, разрывы разделов."),
                ("🔢", "Выполнение формул и макросов", "Макросы LibreOffice Basic для расчёта итогов и условного форматирования."),
                ("📄", "Экспорт в нескольких форматах", "Вывод в PDF, DOCX, XLSX или ODS с сохранением шрифтов и макета."),
                ("⚡", "Пакетная генерация отчётов", "Один шаблон для 50 регионов/отделов параллельно."),
            ],
            "cta_title": "Готовы автоматизировать свои отчёты?",
            "cta_desc": "AgentPuter управляет полным процессом — от сырых данных до PDF для совета директоров. Никакого ручного форматирования.",
        },
        "zh": {
            "meta_title": "季度财务报告自动化 — AgentPuter",
            "h1_line1": "季度财务报告",
            "h1_line2": "自动化",
            "subtitle": "上传数据 → AI 生成图表 → 导出专业 PDF",
            "steps": ["① 上传 CSV / 电子表格", "② Agent 结构化 + 生成图表", "③ 28 页 PDF 已导出"],
            "user_msg": '"从我们的销售数据生成 Q1 财务报告。包含图表、汇总表，并导出为 PDF。"',
            "plan_steps": [
                "解析 Q1-sales.csv（147 行，6 列）",
                "计算合计、环比增长、分类明细",
                "通过 ap-docs chart 生成柱状图和折线图",
                "应用企业报告模板",
                "导出为带自动生成目录的 PDF",
            ],
            "caps": [
                ("📊", "多图表自动生成", "从 CSV/Excel 数据自动插入柱状图、折线图、饼图和组合图。"),
                ("📋", "企业模板支持", "应用带品牌 Logo、页眉和标准页脚的 .dotx 模板。"),
                ("📑", "自动目录 + 页码", "从标题自动生成目录，包含页码和章节分隔符。"),
                ("🔢", "公式 & 宏执行", "运行 LibreOffice Basic 宏计算合计并应用条件格式。"),
                ("📄", "多格式导出", "输出为 PDF、DOCX、XLSX 或 ODS，保留字体和排版。"),
                ("⚡", "批量报告生成", "同一模板并行处理 50 个区域/部门。"),
            ],
            "cta_title": "准备好自动化你的报告了吗？",
            "cta_desc": "AgentPuter 处理完整工作流 — 从原始数据到董事会级别的 PDF。从此告别手动排版。",
        },
        "zh-tw": {
            "meta_title": "季度財務報告自動化 — AgentPuter",
            "h1_line1": "季度財務報告",
            "h1_line2": "自動化",
            "subtitle": "上傳資料 → AI 生成圖表 → 匯出專業 PDF",
            "steps": ["① 上傳 CSV / 電子試算表", "② Agent 結構化 + 生成圖表", "③ 28 頁 PDF 已匯出"],
            "user_msg": '"從我們的銷售資料生成 Q1 財務報告。包含圖表、彙總表，並匯出為 PDF。"',
            "plan_steps": [
                "解析 Q1-sales.csv（147 行，6 欄）",
                "計算合計、環比增長、分類明細",
                "透過 ap-docs chart 生成長條圖和折線圖",
                "套用企業報告範本",
                "匯出為含自動生成目錄的 PDF",
            ],
            "caps": [
                ("📊", "多圖表自動生成", "從 CSV/Excel 資料自動插入長條圖、折線圖、圓餅圖和組合圖。"),
                ("📋", "企業範本支援", "套用含品牌 Logo、頁首和標準頁尾的 .dotx 範本。"),
                ("📑", "自動目錄 + 頁碼", "從標題自動生成目錄，包含頁碼和章節分隔符。"),
                ("🔢", "公式 & 巨集執行", "執行 LibreOffice Basic 巨集計算合計並套用條件格式。"),
                ("📄", "多格式匯出", "輸出為 PDF、DOCX、XLSX 或 ODS，保留字型和版面配置。"),
                ("⚡", "批次報告生成", "同一範本並行處理 50 個地區/部門。"),
            ],
            "cta_title": "準備好自動化你的報告了嗎？",
            "cta_desc": "AgentPuter 處理完整工作流程 — 從原始資料到董事會級別的 PDF。從此告別手動排版。",
        },
    },

    "design-poster": {
        "tag": "DESIGN",
        "engine_badge": "ap-design",
        "lib_badge": "Inkscape",
        "accent": "#A78BFA",
        "en": {
            "meta_title": "Marketing Poster Batch Generation — AgentPuter",
            "meta_desc": "Describe your campaign, get pixel-perfect SVG/PNG posters in seconds.",
            "h1_line1": "Marketing Poster",
            "h1_line2": "Batch Generation",
            "subtitle": "One sentence → AI creates design → Export hi-res PNG/SVG",
            "steps": ["① Describe theme & copy", "② Agent builds SVG layout", "③ Batch export PNG/SVG"],
            "user_msg": '"Create summer sale posters in 3 sizes: 1080×1920, 1200×628, 1080×1080. Brand color is #FF6B35, headline font bold white, include promo code SUMMER25."',
            "plan_steps": [
                "Create base SVG canvas with brand palette",
                "Compose text layers: headline, subtext, promo code",
                "Apply gradient background + decorative elements",
                "Export 3 size variants at 2x resolution",
            ],
            "caps": [
                ("🖼️", "Any canvas size", "Instagram, Facebook, Twitter/X, LinkedIn, print sizes — all from a single base design."),
                ("✏️", "Full text control", "Font family, weight, size, color, line-height, letter-spacing — all scriptable."),
                ("🎨", "Vector path operations", "Draw shapes, apply gradients, clip paths, filters — full SVG node manipulation."),
                ("📦", "Batch variant export", "Generate 50 language variants, color themes, or A/B test versions in one command."),
                ("📐", "Pixel-perfect alignment", "Coordinate-based positioning — no guessing, no drag-and-drop alignment issues."),
                ("🔁", "Template reuse", "Define a brand template once, swap content variables for every campaign."),
            ],
            "cta_title": "Ready to batch your design workflow?",
            "cta_desc": "Describe it once, generate 50 variants instantly. No Figma plugins, no manual resizing.",
        },
        "de": {
            "meta_title": "Marketing-Poster-Batch-Generierung — AgentPuter",
            "h1_line1": "Marketing-Poster",
            "h1_line2": "Batch-Generierung",
            "subtitle": "Ein Satz → KI erstellt Design → Hi-Res PNG/SVG exportieren",
            "steps": ["① Thema & Text beschreiben", "② Agent erstellt SVG-Layout", "③ Batch-Export PNG/SVG"],
            "user_msg": '"Erstelle Sommerschluss-Poster in 3 Größen: 1080×1920, 1200×628, 1080×1080. Markenfarbe #FF6B35, Überschrift fett weiß, Promo-Code SUMMER25."',
            "plan_steps": ["Basis-SVG-Canvas mit Markenpalette erstellen", "Textebenen gestalten: Überschrift, Untertext, Promo-Code", "Verlaufshintergrund + Dekorationselemente anwenden", "3 Größenvarianten in 2x-Auflösung exportieren"],
            "caps": [("🖼️", "Beliebige Canvas-Größe", "Instagram, Facebook, Twitter/X, LinkedIn, Druckgrößen — alles aus einem Basisdesign."), ("✏️", "Volle Textkontrolle", "Schriftfamilie, -stärke, -größe, Farbe, Zeilenhöhe — alles skriptbar."), ("🎨", "Vektorpfad-Operationen", "Formen zeichnen, Verläufe anwenden, Clip-Pfade, Filter — volle SVG-Knotenmanipulation."), ("📦", "Batch-Variantenexport", "50 Sprachvarianten, Farbthemen oder A/B-Testversionen mit einem Befehl generieren."), ("📐", "Pixelgenaue Ausrichtung", "Koordinatenbasierte Positionierung — kein Rätselraten, kein Drag-and-Drop."), ("🔁", "Vorlagen-Wiederverwendung", "Eine Markenvorlage definieren, Inhaltsvariablen für jede Kampagne tauschen.")],
            "cta_title": "Bereit, Ihren Design-Workflow zu automatisieren?",
            "cta_desc": "Einmal beschreiben, sofort 50 Varianten generieren. Keine Figma-Plugins, kein manuelles Skalieren.",
        },
        "es": {
            "meta_title": "Generación de Pósters de Marketing en Lote — AgentPuter",
            "h1_line1": "Generación de Pósters",
            "h1_line2": "de Marketing en Lote",
            "subtitle": "Una frase → La IA crea el diseño → Exporta PNG/SVG en alta resolución",
            "steps": ["① Describe el tema y el texto", "② El agente construye el SVG", "③ Exportación en lote PNG/SVG"],
            "user_msg": '"Crea pósters de rebajas de verano en 3 tamaños: 1080×1920, 1200×628, 1080×1080. Color de marca #FF6B35, título en negrita blanca, incluye SUMMER25."',
            "plan_steps": ["Crear canvas SVG base con paleta de marca", "Componer capas de texto: título, subtexto, código promo", "Aplicar fondo con degradado + elementos decorativos", "Exportar 3 variantes de tamaño a 2x resolución"],
            "caps": [("🖼️", "Cualquier tamaño de canvas", "Instagram, Facebook, Twitter/X, LinkedIn, tamaños de impresión — todo desde un diseño base."), ("✏️", "Control total del texto", "Familia, peso, tamaño, color, interlineado — todo programable."), ("🎨", "Operaciones de vectores", "Dibujar formas, aplicar degradados, rutas de recorte, filtros — manipulación completa de nodos SVG."), ("📦", "Exportación de variantes en lote", "Genera 50 variantes de idioma, temas de color o versiones A/B con un solo comando."), ("📐", "Alineación perfecta al píxel", "Posicionamiento por coordenadas — sin suposiciones, sin arrastrar y soltar."), ("🔁", "Reutilización de plantillas", "Define una plantilla de marca una vez, intercambia variables para cada campaña.")],
            "cta_title": "¿Listo para automatizar tu flujo de diseño?",
            "cta_desc": "Descríbelo una vez, genera 50 variantes al instante. Sin plugins de Figma, sin redimensionado manual.",
        },
        "fr": {
            "meta_title": "Génération de Posters Marketing en Lot — AgentPuter",
            "h1_line1": "Génération de Posters",
            "h1_line2": "Marketing en Lot",
            "subtitle": "Une phrase → L'IA crée le design → Exporter PNG/SVG haute résolution",
            "steps": ["① Décrire le thème et le texte", "② L'agent crée le layout SVG", "③ Export en lot PNG/SVG"],
            "user_msg": '"Crée des posters de soldes d\'été en 3 tailles : 1080×1920, 1200×628, 1080×1080. Couleur de marque #FF6B35, titre en gras blanc, inclure SUMMER25."',
            "plan_steps": ["Créer un canvas SVG de base avec la palette de marque", "Composer les calques texte : titre, sous-titre, code promo", "Appliquer l'arrière-plan dégradé + éléments décoratifs", "Exporter 3 variantes de taille en résolution 2x"],
            "caps": [("🖼️", "Toute taille de canvas", "Instagram, Facebook, Twitter/X, LinkedIn, impression — tout depuis un design de base."), ("✏️", "Contrôle total du texte", "Famille, graisse, taille, couleur, interligne — tout scriptable."), ("🎨", "Opérations sur les chemins vectoriels", "Dessiner des formes, dégradés, masques, filtres — manipulation complète des nœuds SVG."), ("📦", "Export de variantes en lot", "50 variantes de langue, thèmes de couleur ou versions A/B en une commande."), ("📐", "Alignement au pixel près", "Positionnement par coordonnées — pas de devinettes, pas de glisser-déposer."), ("🔁", "Réutilisation des modèles", "Définir un modèle de marque une fois, changer les variables pour chaque campagne.")],
            "cta_title": "Prêt à automatiser votre flux de design ?",
            "cta_desc": "Décrivez-le une fois, générez 50 variantes instantanément. Pas de plugins Figma, pas de redimensionnement manuel.",
        },
        "ja": {
            "meta_title": "マーケティングポスターのバッチ生成 — AgentPuter",
            "h1_line1": "マーケティングポスター",
            "h1_line2": "バッチ生成",
            "subtitle": "一文で → AIがデザインを作成 → 高解像度PNG/SVGをエクスポート",
            "steps": ["① テーマとコピーを説明", "② エージェントがSVGレイアウトを構築", "③ バッチでPNG/SVGをエクスポート"],
            "user_msg": '"夏のセールポスターを3サイズで作成してください：1080×1920、1200×628、1080×1080。ブランドカラー#FF6B35、見出しは太字白、SUMMER25のプロモコードを含めてください。"',
            "plan_steps": ["ブランドパレットでベースSVGキャンバスを作成", "テキストレイヤーを構成：見出し、サブテキスト、プロモコード", "グラデーション背景＋装飾要素を適用", "2x解像度で3サイズのバリアントをエクスポート"],
            "caps": [("🖼️", "任意のキャンバスサイズ", "Instagram、Facebook、Twitter/X、LinkedIn、印刷サイズ — すべて1つのベースデザインから。"), ("✏️", "完全なテキスト制御", "フォントファミリー、ウェイト、サイズ、色、行間 — すべてスクリプト可能。"), ("🎨", "ベクターパス操作", "図形描画、グラデーション、クリップパス、フィルター — 完全なSVGノード操作。"), ("📦", "バッチバリアントエクスポート", "1つのコマンドで50言語バリアント、カラーテーマ、A/Bテストを生成。"), ("📐", "ピクセルパーフェクトな整列", "座標ベースの配置 — 推測不要、ドラッグ＆ドロップ不要。"), ("🔁", "テンプレート再利用", "ブランドテンプレートを1回定義し、キャンペーンごとに変数を入れ替え。")],
            "cta_title": "デザインワークフローを自動化する準備はできていますか？",
            "cta_desc": "1回説明するだけで50バリアントを即座に生成。Figmaプラグイン不要、手動リサイズ不要。",
        },
        "ko": {
            "meta_title": "마케팅 포스터 일괄 생성 — AgentPuter",
            "h1_line1": "마케팅 포스터",
            "h1_line2": "일괄 생성",
            "subtitle": "한 문장 → AI가 디자인 생성 → 고해상도 PNG/SVG 내보내기",
            "steps": ["① 테마 & 카피 설명", "② 에이전트가 SVG 레이아웃 구성", "③ PNG/SVG 일괄 내보내기"],
            "user_msg": '"여름 세일 포스터를 3가지 크기로 만들어주세요: 1080×1920, 1200×628, 1080×1080. 브랜드 색상 #FF6B35, 헤드라인은 흰색 굵은체, 프로모 코드 SUMMER25 포함."',
            "plan_steps": ["브랜드 팔레트로 기본 SVG 캔버스 생성", "텍스트 레이어 구성: 헤드라인, 서브텍스트, 프로모 코드", "그라디언트 배경 + 장식 요소 적용", "2x 해상도로 3가지 크기 변형 내보내기"],
            "caps": [("🖼️", "모든 캔버스 크기", "Instagram, Facebook, Twitter/X, LinkedIn, 인쇄 크기 — 하나의 기본 디자인에서 모두."), ("✏️", "완전한 텍스트 제어", "폰트 패밀리, 두께, 크기, 색상, 행간 — 모두 스크립트 가능."), ("🎨", "벡터 패스 조작", "도형 그리기, 그라디언트, 클립 패스, 필터 — 완전한 SVG 노드 조작."), ("📦", "일괄 변형 내보내기", "한 명령으로 50가지 언어 변형, 색상 테마, A/B 테스트 버전 생성."), ("📐", "픽셀 완벽 정렬", "좌표 기반 위치 지정 — 추측 없음, 드래그 앤 드롭 없음."), ("🔁", "템플릿 재사용", "브랜드 템플릿을 한 번 정의하고 캠페인마다 콘텐츠 변수 교체.")],
            "cta_title": "디자인 워크플로우를 자동화할 준비가 됐나요?",
            "cta_desc": "한 번 설명하면 즉시 50가지 변형을 생성합니다. Figma 플러그인 없이, 수동 크기 조정 없이.",
        },
        "pt-br": {
            "meta_title": "Geração em Lote de Pôsteres de Marketing — AgentPuter",
            "h1_line1": "Geração em Lote de",
            "h1_line2": "Pôsteres de Marketing",
            "subtitle": "Uma frase → IA cria o design → Exportar PNG/SVG em alta resolução",
            "steps": ["① Descreva o tema e o texto", "② Agente constrói o layout SVG", "③ Export em lote PNG/SVG"],
            "user_msg": '"Crie pôsteres de liquidação de verão em 3 tamanhos: 1080×1920, 1200×628, 1080×1080. Cor da marca #FF6B35, título em negrito branco, inclua SUMMER25."',
            "plan_steps": ["Criar canvas SVG base com paleta da marca", "Compor camadas de texto: título, subtítulo, código promo", "Aplicar fundo com gradiente + elementos decorativos", "Exportar 3 variantes de tamanho em 2x resolução"],
            "caps": [("🖼️", "Qualquer tamanho de canvas", "Instagram, Facebook, Twitter/X, LinkedIn, tamanhos de impressão — tudo de um design base."), ("✏️", "Controle total do texto", "Família, peso, tamanho, cor, altura de linha — tudo scriptável."), ("🎨", "Operações de caminho vetorial", "Desenhar formas, gradientes, caminhos de recorte, filtros — manipulação completa de nós SVG."), ("📦", "Export de variantes em lote", "50 variantes de idioma, temas de cor ou versões A/B com um comando."), ("📐", "Alinhamento perfeito ao pixel", "Posicionamento por coordenadas — sem adivinhação, sem arrastar e soltar."), ("🔁", "Reutilização de templates", "Defina um template de marca uma vez, troque variáveis para cada campanha.")],
            "cta_title": "Pronto para automatizar seu fluxo de design?",
            "cta_desc": "Descreva uma vez, gere 50 variantes instantaneamente. Sem plugins do Figma, sem redimensionamento manual.",
        },
        "ru": {
            "meta_title": "Пакетная генерация маркетинговых постеров — AgentPuter",
            "h1_line1": "Пакетная генерация",
            "h1_line2": "маркетинговых постеров",
            "subtitle": "Одна фраза → ИИ создаёт дизайн → Экспорт PNG/SVG высокого разрешения",
            "steps": ["① Описать тему и текст", "② Агент создаёт SVG-макет", "③ Пакетный экспорт PNG/SVG"],
            "user_msg": '"Создай постеры для летней распродажи в 3 размерах: 1080×1920, 1200×628, 1080×1080. Цвет бренда #FF6B35, заголовок жирный белый, промокод SUMMER25."',
            "plan_steps": ["Создать базовый SVG-холст с фирменной палитрой", "Составить текстовые слои: заголовок, подтекст, промокод", "Применить градиентный фон + декоративные элементы", "Экспортировать 3 размерных варианта в 2x разрешении"],
            "caps": [("🖼️", "Любой размер холста", "Instagram, Facebook, Twitter/X, LinkedIn, печать — всё из одного базового дизайна."), ("✏️", "Полный контроль текста", "Шрифт, начертание, размер, цвет, межстрочный интервал — всё скриптуемо."), ("🎨", "Операции с векторными путями", "Рисование фигур, градиенты, обтравочные маски, фильтры — полное управление узлами SVG."), ("📦", "Пакетный экспорт вариантов", "50 языковых вариантов, цветовых тем или A/B-версий одной командой."), ("📐", "Попиксельная точность", "Позиционирование по координатам — никаких догадок, никакого drag-and-drop."), ("🔁", "Повторное использование шаблонов", "Определить шаблон бренда один раз, менять переменные для каждой кампании.")],
            "cta_title": "Готовы автоматизировать дизайн-процесс?",
            "cta_desc": "Опишите один раз — получите 50 вариантов мгновенно. Без плагинов Figma, без ручного масштабирования.",
        },
        "zh": {
            "meta_title": "营销海报批量生成 — AgentPuter",
            "h1_line1": "营销海报",
            "h1_line2": "批量生成",
            "subtitle": "一句话 → AI 生成设计 → 导出高清 PNG/SVG",
            "steps": ["① 描述主题与文案", "② Agent 构建 SVG 布局", "③ 批量导出 PNG/SVG"],
            "user_msg": '"创建夏季促销海报，3 种尺寸：1080×1920、1200×628、1080×1080。品牌色 #FF6B35，标题粗体白色，包含促销码 SUMMER25。"',
            "plan_steps": ["创建品牌调色板的基础 SVG 画布", "排列文本层：标题、副文案、促销码", "应用渐变背景 + 装饰元素", "以 2x 分辨率导出 3 种尺寸变体"],
            "caps": [("🖼️", "任意画布尺寸", "Instagram、Facebook、Twitter/X、LinkedIn、印刷尺寸 — 全部来自同一基础设计。"), ("✏️", "完整文字控制", "字体族、字重、字号、颜色、行高 — 全部可脚本化。"), ("🎨", "矢量路径操作", "绘制形状、应用渐变、裁剪路径、滤镜 — 完整 SVG 节点操控。"), ("📦", "批量变体导出", "一条命令生成 50 种语言变体、配色方案或 A/B 测试版本。"), ("📐", "像素级精准对齐", "基于坐标定位 — 无需猜测，无需拖拽。"), ("🔁", "模板复用", "定义一次品牌模板，每次活动只需替换内容变量。")],
            "cta_title": "准备好自动化设计工作流了吗？",
            "cta_desc": "描述一次，立即生成 50 个变体。无需 Figma 插件，无需手动调整尺寸。",
        },
        "zh-tw": {
            "meta_title": "行銷海報批次生成 — AgentPuter",
            "h1_line1": "行銷海報",
            "h1_line2": "批次生成",
            "subtitle": "一句話 → AI 生成設計 → 匯出高清 PNG/SVG",
            "steps": ["① 描述主題與文案", "② Agent 構建 SVG 版面", "③ 批次匯出 PNG/SVG"],
            "user_msg": '"建立夏季促銷海報，3 種尺寸：1080×1920、1200×628、1080×1080。品牌色 #FF6B35，標題粗體白色，包含促銷碼 SUMMER25。"',
            "plan_steps": ["建立品牌調色板的基礎 SVG 畫布", "排列文字層：標題、副文案、促銷碼", "套用漸層背景 + 裝飾元素", "以 2x 解析度匯出 3 種尺寸變體"],
            "caps": [("🖼️", "任意畫布尺寸", "Instagram、Facebook、Twitter/X、LinkedIn、印刷尺寸 — 全部來自同一基礎設計。"), ("✏️", "完整文字控制", "字體族、字重、字型大小、顏色、行高 — 全部可腳本化。"), ("🎨", "向量路徑操作", "繪製形狀、套用漸層、裁切路徑、濾鏡 — 完整 SVG 節點操控。"), ("📦", "批次變體匯出", "一條命令生成 50 種語言變體、配色方案或 A/B 測試版本。"), ("📐", "像素級精準對齊", "座標定位 — 無需猜測，無需拖放。"), ("🔁", "範本複用", "定義一次品牌範本，每次活動只需替換內容變數。")],
            "cta_title": "準備好自動化設計工作流了嗎？",
            "cta_desc": "描述一次，立即生成 50 個變體。無需 Figma 外掛，無需手動調整尺寸。",
        },
    },

    "system-diagram": {
        "tag": "ENGINEERING",
        "engine_badge": "ap-diagrams",
        "lib_badge": "Draw.io CLI",
        "accent": "#FBBF24",
        "en": {
            "meta_title": "System Architecture Auto-Drawing — AgentPuter",
            "meta_desc": "Describe your microservices, get production-ready SVG diagrams via Draw.io CLI.",
            "h1_line1": "System Architecture",
            "h1_line2": "Auto-Drawing",
            "subtitle": "Describe architecture → AI layouts → Export SVG/PNG",
            "steps": ["① Describe in natural language", "② Agent builds draw.io graph", "③ Export SVG/PNG/PDF"],
            "user_msg": '"Draw a microservice architecture: API Gateway → Auth Service, User Service, Order Service. Order Service connects to Payment and Notification. All services share Redis cache."',
            "plan_steps": ["Create microservice diagram template", "Add 6 service nodes with icons", "Wire connections with directional arrows", "Add Redis cache as shared infrastructure layer", "Apply dark theme, export SVG + PNG"],
            "caps": [
                ("☁️", "Cloud icon libraries", "AWS, GCP, Azure, and Kubernetes icon sets built-in. No manual icon imports."),
                ("🔗", "Smart auto-routing", "Connection lines auto-route around nodes. No manual drag-to-connect."),
                ("📊", "Multiple diagram types", "Microservice, ER, network topology, sequence, UML, C4 model — all supported."),
                ("🎨", "Dark & light themes", "Professional diagram themes. Consistent visual style."),
                ("📄", "From code / schema", "Generate ER diagrams from SQL schema files automatically."),
                ("✏️", "Editable SVG output", "Standard SVG output — open and edit in any vector tool."),
            ],
            "cta_title": "Stop drawing diagrams manually.",
            "cta_desc": "Describe your system. AgentPuter builds the diagram — precise, professional, exportable.",
        },
        "de": {"meta_title": "Systemarchitektur-Auto-Zeichnung — AgentPuter", "h1_line1": "Systemarchitektur", "h1_line2": "Auto-Zeichnung", "subtitle": "Architektur beschreiben → KI layoutet → SVG/PNG exportieren", "steps": ["① In natürlicher Sprache beschreiben", "② Agent erstellt draw.io-Graphen", "③ SVG/PNG/PDF exportieren"], "user_msg": '"Zeichne eine Microservice-Architektur: API-Gateway → Auth-, User-, Order-Service. Order verbindet sich mit Payment und Notification. Alle teilen Redis-Cache."', "plan_steps": ["Microservice-Diagrammvorlage erstellen", "6 Service-Knoten mit Icons hinzufügen", "Verbindungen mit Richtungspfeilen verdrahten", "Redis-Cache als gemeinsame Infrastrukturebene hinzufügen", "Dunkles Theme anwenden, SVG + PNG exportieren"], "caps": [("☁️", "Cloud-Icon-Bibliotheken", "AWS, GCP, Azure und Kubernetes-Icon-Sets eingebaut."), ("🔗", "Intelligentes Auto-Routing", "Verbindungslinien routen automatisch um Knoten herum."), ("📊", "Mehrere Diagrammtypen", "Microservice, ER, Netzwerktopologie, Sequenz, UML, C4-Modell."), ("🎨", "Dunkle & helle Themes", "Professionelle Diagrammthemen. Einheitlicher visueller Stil."), ("📄", "Aus Code / Schema", "ER-Diagramme aus SQL-Schema-Dateien generieren."), ("✏️", "Bearbeitbare SVG-Ausgabe", "Standard-SVG — in jedem Vektortool öffnen und bearbeiten.")], "cta_title": "Hören Sie auf, Diagramme manuell zu zeichnen.", "cta_desc": "Beschreiben Sie Ihr System. AgentPuter erstellt das Diagramm — präzise, professionell, exportierbar."},
        "es": {"meta_title": "Dibujo Automático de Arquitectura de Sistema — AgentPuter", "h1_line1": "Dibujo Automático de", "h1_line2": "Arquitectura de Sistema", "subtitle": "Describe la arquitectura → IA diseña el layout → Exporta SVG/PNG", "steps": ["① Describe en lenguaje natural", "② El agente construye el grafo draw.io", "③ Exportar SVG/PNG/PDF"], "user_msg": '"Dibuja una arquitectura de microservicios: API Gateway → Auth, User, Order. Order conecta con Payment y Notification. Todos comparten caché Redis."', "plan_steps": ["Crear plantilla de diagrama de microservicios", "Añadir 6 nodos de servicio con iconos", "Conectar con flechas direccionales", "Añadir caché Redis como capa de infraestructura compartida", "Aplicar tema oscuro, exportar SVG + PNG"], "caps": [("☁️", "Bibliotecas de iconos cloud", "Conjuntos de iconos AWS, GCP, Azure y Kubernetes integrados."), ("🔗", "Enrutamiento automático inteligente", "Las líneas de conexión se enrutan automáticamente alrededor de los nodos."), ("📊", "Múltiples tipos de diagrama", "Microservicio, ER, topología de red, secuencia, UML, modelo C4."), ("🎨", "Temas oscuros y claros", "Temas de diagrama profesionales con estilo visual consistente."), ("📄", "Desde código / esquema", "Genera diagramas ER desde archivos de esquema SQL."), ("✏️", "Salida SVG editable", "SVG estándar — abre y edita en cualquier herramienta vectorial.")], "cta_title": "Deja de dibujar diagramas manualmente.", "cta_desc": "Describe tu sistema. AgentPuter construye el diagrama — preciso, profesional, exportable."},
        "fr": {"meta_title": "Dessin Automatique d'Architecture Système — AgentPuter", "h1_line1": "Dessin Automatique", "h1_line2": "d'Architecture Système", "subtitle": "Décrire l'architecture → L'IA crée le layout → Exporter SVG/PNG", "steps": ["① Décrire en langage naturel", "② L'agent construit le graphe draw.io", "③ Exporter SVG/PNG/PDF"], "user_msg": '"Dessine une architecture microservices : API Gateway → Auth, User, Order. Order se connecte à Payment et Notification. Tous partagent un cache Redis."', "plan_steps": ["Créer le modèle de diagramme microservices", "Ajouter 6 nœuds de service avec des icônes", "Câbler les connexions avec des flèches directionnelles", "Ajouter le cache Redis comme couche d'infrastructure partagée", "Appliquer le thème sombre, exporter SVG + PNG"], "caps": [("☁️", "Bibliothèques d'icônes cloud", "Jeux d'icônes AWS, GCP, Azure et Kubernetes intégrés."), ("🔗", "Routage automatique intelligent", "Les lignes de connexion se routent automatiquement autour des nœuds."), ("📊", "Plusieurs types de diagrammes", "Microservice, ER, topologie réseau, séquence, UML, modèle C4."), ("🎨", "Thèmes sombre et clair", "Thèmes professionnels avec un style visuel cohérent."), ("📄", "Depuis le code / schéma", "Générer des diagrammes ER depuis des fichiers de schéma SQL."), ("✏️", "Sortie SVG modifiable", "SVG standard — ouvrir et modifier dans n'importe quel outil vectoriel.")], "cta_title": "Arrêtez de dessiner des diagrammes manuellement.", "cta_desc": "Décrivez votre système. AgentPuter construit le diagramme — précis, professionnel, exportable."},
        "ja": {"meta_title": "システムアーキテクチャ自動作図 — AgentPuter", "h1_line1": "システムアーキテクチャ", "h1_line2": "自動作図", "subtitle": "アーキテクチャを説明 → AIがレイアウト → SVG/PNG をエクスポート", "steps": ["① 自然言語で説明", "② エージェントがdraw.ioグラフを構築", "③ SVG/PNG/PDFをエクスポート"], "user_msg": '"マイクロサービスアーキテクチャを描いてください：APIゲートウェイ→認証・ユーザー・注文サービス。注文は決済と通知に接続。全サービスがRedisキャッシュを共有。"', "plan_steps": ["マイクロサービスダイアグラムテンプレートを作成", "アイコン付き6サービスノードを追加", "方向矢印で接続を配線", "共有インフラ層としてRedisキャッシュを追加", "ダークテーマを適用、SVG+PNGをエクスポート"], "caps": [("☁️", "クラウドアイコンライブラリ", "AWS、GCP、Azure、Kubernetesアイコンセット内蔵。"), ("🔗", "スマート自動ルーティング", "接続線がノード周囲を自動ルーティング。"), ("📊", "複数のダイアグラムタイプ", "マイクロサービス、ER、ネットワークトポロジー、シーケンス、UML、C4モデル。"), ("🎨", "ダーク＆ライトテーマ", "プロフェッショナルなダイアグラムテーマ。"), ("📄", "コード/スキーマから生成", "SQLスキーマファイルからERダイアグラムを自動生成。"), ("✏️", "編集可能なSVG出力", "標準SVG — 任意のベクターツールで開いて編集可能。")], "cta_title": "ダイアグラムを手描きするのをやめましょう。", "cta_desc": "システムを説明してください。AgentPuterが正確でプロフェッショナルなダイアグラムを構築します。"},
        "ko": {"meta_title": "시스템 아키텍처 자동 작도 — AgentPuter", "h1_line1": "시스템 아키텍처", "h1_line2": "자동 작도", "subtitle": "아키텍처 설명 → AI가 레이아웃 → SVG/PNG 내보내기", "steps": ["① 자연어로 설명", "② 에이전트가 draw.io 그래프 구성", "③ SVG/PNG/PDF 내보내기"], "user_msg": '"마이크로서비스 아키텍처를 그려주세요: API 게이트웨이 → 인증, 사용자, 주문 서비스. 주문은 결제와 알림에 연결. 모든 서비스가 Redis 캐시 공유."', "plan_steps": ["마이크로서비스 다이어그램 템플릿 생성", "아이콘이 있는 6개 서비스 노드 추가", "방향 화살표로 연결 구성", "공유 인프라 레이어로 Redis 캐시 추가", "다크 테마 적용, SVG + PNG 내보내기"], "caps": [("☁️", "클라우드 아이콘 라이브러리", "AWS, GCP, Azure, Kubernetes 아이콘 세트 내장."), ("🔗", "스마트 자동 라우팅", "연결선이 노드 주변을 자동으로 라우팅."), ("📊", "다양한 다이어그램 유형", "마이크로서비스, ER, 네트워크 토폴로지, 시퀀스, UML, C4 모델."), ("🎨", "다크 & 라이트 테마", "전문적인 다이어그램 테마."), ("📄", "코드 / 스키마에서 생성", "SQL 스키마 파일에서 ER 다이어그램 자동 생성."), ("✏️", "편집 가능한 SVG 출력", "표준 SVG — 모든 벡터 툴에서 열기 및 편집 가능.")], "cta_title": "다이어그램을 직접 그리는 것을 멈추세요.", "cta_desc": "시스템을 설명하세요. AgentPuter가 정밀하고 전문적인 다이어그램을 구성합니다."},
        "pt-br": {"meta_title": "Desenho Automático de Arquitetura de Sistema — AgentPuter", "h1_line1": "Desenho Automático de", "h1_line2": "Arquitetura de Sistema", "subtitle": "Descreva a arquitetura → IA faz o layout → Exportar SVG/PNG", "steps": ["① Descreva em linguagem natural", "② Agente constrói o grafo draw.io", "③ Exportar SVG/PNG/PDF"], "user_msg": '"Desenhe uma arquitetura de microserviços: API Gateway → Auth, User, Order. Order conecta a Payment e Notification. Todos compartilham cache Redis."', "plan_steps": ["Criar template de diagrama de microserviços", "Adicionar 6 nós de serviço com ícones", "Conectar com setas direcionais", "Adicionar cache Redis como camada de infraestrutura compartilhada", "Aplicar tema escuro, exportar SVG + PNG"], "caps": [("☁️", "Bibliotecas de ícones cloud", "Conjuntos de ícones AWS, GCP, Azure e Kubernetes integrados."), ("🔗", "Roteamento automático inteligente", "Linhas de conexão se roteiam automaticamente em torno dos nós."), ("📊", "Múltiplos tipos de diagrama", "Microserviço, ER, topologia de rede, sequência, UML, modelo C4."), ("🎨", "Temas escuro e claro", "Temas profissionais com estilo visual consistente."), ("📄", "De código / esquema", "Gerar diagramas ER de arquivos de esquema SQL."), ("✏️", "Saída SVG editável", "SVG padrão — abrir e editar em qualquer ferramenta vetorial.")], "cta_title": "Pare de desenhar diagramas manualmente.", "cta_desc": "Descreva seu sistema. AgentPuter constrói o diagrama — preciso, profissional, exportável."},
        "ru": {"meta_title": "Автоматическое рисование архитектуры системы — AgentPuter", "h1_line1": "Автоматическое рисование", "h1_line2": "архитектуры системы", "subtitle": "Описать архитектуру → ИИ строит макет → Экспорт SVG/PNG", "steps": ["① Описать на естественном языке", "② Агент строит граф draw.io", "③ Экспортировать SVG/PNG/PDF"], "user_msg": '"Нарисуй микросервисную архитектуру: API-шлюз → Auth, User, Order. Order соединяется с Payment и Notification. Все сервисы используют Redis-кэш."', "plan_steps": ["Создать шаблон диаграммы микросервисов", "Добавить 6 сервисных узлов с иконками", "Провести соединения направленными стрелками", "Добавить Redis-кэш как общий инфраструктурный слой", "Применить тёмную тему, экспортировать SVG + PNG"], "caps": [("☁️", "Библиотеки облачных иконок", "Встроенные наборы иконок AWS, GCP, Azure и Kubernetes."), ("🔗", "Умная авторасстановка", "Линии связи автоматически обходят узлы."), ("📊", "Несколько типов диаграмм", "Микросервис, ER, топология сети, последовательность, UML, модель C4."), ("🎨", "Тёмная и светлая темы", "Профессиональные темы диаграмм."), ("📄", "Из кода / схемы", "Генерация ER-диаграмм из файлов SQL-схемы."), ("✏️", "Редактируемый SVG-вывод", "Стандартный SVG — открыть и редактировать в любом векторном редакторе.")], "cta_title": "Перестаньте рисовать диаграммы вручную.", "cta_desc": "Опишите систему. AgentPuter построит диаграмму — точную, профессиональную, готовую к экспорту."},
        "zh": {"meta_title": "系统架构图自动绘制 — AgentPuter", "h1_line1": "系统架构图", "h1_line2": "自动绘制", "subtitle": "描述架构 → AI 布局 → 导出 SVG/PNG", "steps": ["① 用自然语言描述", "② Agent 构建 draw.io 图形", "③ 导出 SVG/PNG/PDF"], "user_msg": '"绘制微服务架构：API 网关 → 认证、用户、订单服务。订单服务连接支付和通知服务。所有服务共享 Redis 缓存。"', "plan_steps": ["创建微服务图模板", "添加 6 个带图标的服务节点", "用方向箭头连接各节点", "添加 Redis 缓存作为共享基础设施层", "应用暗色主题，导出 SVG + PNG"], "caps": [("☁️", "云图标库", "内置 AWS、GCP、Azure 和 Kubernetes 图标集，无需手动导入。"), ("🔗", "智能自动路由", "连接线自动绕过节点，无需手动拖拽连接。"), ("📊", "多种图表类型", "微服务、ER、网络拓扑、时序、UML、C4 模型全支持。"), ("🎨", "深色 & 浅色主题", "专业图表主题，视觉风格统一。"), ("📄", "从代码/Schema 生成", "直接从 SQL Schema 文件自动生成 ER 图。"), ("✏️", "可编辑的 SVG 输出", "标准 SVG 文件，可在任何矢量工具中打开编辑。")], "cta_title": "停止手动画架构图。", "cta_desc": "描述你的系统，AgentPuter 生成精准、专业、可导出的架构图。"},
        "zh-tw": {"meta_title": "系統架構圖自動繪製 — AgentPuter", "h1_line1": "系統架構圖", "h1_line2": "自動繪製", "subtitle": "描述架構 → AI 版面配置 → 匯出 SVG/PNG", "steps": ["① 以自然語言描述", "② Agent 構建 draw.io 圖形", "③ 匯出 SVG/PNG/PDF"], "user_msg": '"繪製微服務架構：API 閘道 → 認證、使用者、訂單服務。訂單服務連接支付和通知服務。所有服務共享 Redis 快取。"', "plan_steps": ["建立微服務圖範本", "新增 6 個含圖示的服務節點", "使用方向箭頭連接各節點", "新增 Redis 快取作為共享基礎架構層", "套用深色主題，匯出 SVG + PNG"], "caps": [("☁️", "雲端圖示庫", "內建 AWS、GCP、Azure 和 Kubernetes 圖示集。"), ("🔗", "智慧自動路由", "連接線自動繞過節點。"), ("📊", "多種圖表類型", "微服務、ER、網路拓撲、時序、UML、C4 模型全支援。"), ("🎨", "深色 & 淺色主題", "專業圖表主題。"), ("📄", "從程式碼/Schema 生成", "直接從 SQL Schema 檔案自動生成 ER 圖。"), ("✏️", "可編輯的 SVG 輸出", "標準 SVG，可在任何向量工具中開啟編輯。")], "cta_title": "停止手動繪製架構圖。", "cta_desc": "描述你的系統，AgentPuter 生成精確、專業、可匯出的架構圖。"},
    },

    "audio-production": {
        "tag": "AUDIO",
        "engine_badge": "ap-audio",
        "lib_badge": "sox + ffmpeg",
        "accent": "#4ADE80",
        "en": {
            "meta_title": "Podcast & Audio Post-Production — AgentPuter",
            "meta_desc": "Upload raw recordings, get broadcast-quality MP3 in seconds.",
            "h1_line1": "Podcast & Audio",
            "h1_line2": "Post-Production",
            "subtitle": "Upload recording → AI denoise & edit → Export broadcast MP3",
            "steps": ["① Upload raw WAV/MP3", "② Agent denoises & normalizes", "③ Broadcast-ready MP3"],
            "user_msg": '"Clean up episode 12. Remove background noise, normalize to -14 LUFS, trim silence longer than 2 seconds, export 128kbps MP3."',
            "plan_steps": ["Detect noise profile from silence sections", "Apply noise reduction (sox noisered)", "EBU R128 loudness normalization to -14 LUFS", "Trim silence segments > 2s", "Convert to 128kbps MP3 via ffmpeg"],
            "caps": [
                ("🔇", "Adaptive denoising", "Auto-samples noise profile from silent sections. Works for HVAC hum, room tone, recording hiss."),
                ("📊", "EBU R128 loudness", "Industry-standard loudness normalization for podcast platforms (Spotify -14 LUFS, Apple -16 LUFS)."),
                ("✂️", "Silence detection & trim", "Configurable threshold. Remove dead air without touching speech."),
                ("🔄", "Format conversion", "WAV, FLAC, OGG, AAC, MP3 — any codec, any bitrate."),
                ("🎚️", "Multi-track mixing", "Mix intro/outro music with voice track. Independent volume levels."),
                ("📋", "Audio analysis report", "Get duration, peak levels, loudness, and clipping stats."),
            ],
            "cta_title": "Professional audio. Zero manual editing.",
            "cta_desc": "Upload the raw recording. Get broadcast-ready audio. No DAW, no plugins, no audio engineer.",
        },
        "de": {"meta_title": "Podcast & Audio-Nachbearbeitung — AgentPuter", "h1_line1": "Podcast & Audio-", "h1_line2": "Nachbearbeitung", "subtitle": "Aufnahme hochladen → KI entrauscht & bearbeitet → Broadcast-MP3 exportieren", "steps": ["① Rohe WAV/MP3 hochladen", "② Agent entrauscht & normalisiert", "③ Broadcast-fertiges MP3"], "user_msg": '"Bereinige Episode 12. Hintergrundgeräusche entfernen, auf -14 LUFS normalisieren, Stille über 2 Sekunden kürzen, als 128 kbps MP3 exportieren."', "plan_steps": ["Rauschprofil aus Stille-Abschnitten erkennen", "Rauschreduzierung anwenden (sox noisered)", "EBU R128 Lautstärkenormalisierung auf -14 LUFS", "Stille-Segmente > 2s kürzen", "Als 128 kbps MP3 via ffmpeg konvertieren"], "caps": [("🔇", "Adaptives Entrauschen", "Rauschprofil aus Stille-Abschnitten. Für HVAC-Brummen, Raumklang, Hintergrundrauschen."), ("📊", "EBU R128 Lautstärke", "Branchenstandard für Podcast-Plattformen (Spotify -14 LUFS, Apple -16 LUFS)."), ("✂️", "Stille-Erkennung & Kürzen", "Konfigurierbarer Schwellenwert. Totluft entfernen ohne Sprache zu berühren."), ("🔄", "Format-Konvertierung", "WAV, FLAC, OGG, AAC, MP3 — jeder Codec, jede Bitrate."), ("🎚️", "Multi-Track-Mixing", "Intro/Outro-Musik mit Stimmaufnahme mischen."), ("📋", "Audio-Analyse-Bericht", "Dauer, Pegelwerte, Lautstärke und Clipping-Statistiken.")], "cta_title": "Professionelles Audio. Kein manuelles Editing.", "cta_desc": "Rohaufnahme hochladen. Broadcast-fertiges Audio erhalten. Kein DAW, keine Plugins."},
        "es": {"meta_title": "Postproducción de Podcast y Audio — AgentPuter", "h1_line1": "Postproducción de", "h1_line2": "Podcast y Audio", "subtitle": "Subir grabación → IA limpia y edita → Exportar MP3 para difusión", "steps": ["① Subir WAV/MP3 bruto", "② El agente limpia y normaliza", "③ MP3 listo para difusión"], "user_msg": '"Limpia el episodio 12. Eliminar ruido de fondo, normalizar a -14 LUFS, recortar silencios mayores a 2 segundos, exportar MP3 128 kbps."', "plan_steps": ["Detectar perfil de ruido de secciones en silencio", "Aplicar reducción de ruido (sox noisered)", "Normalización de volumen EBU R128 a -14 LUFS", "Recortar segmentos de silencio > 2s", "Convertir a MP3 128 kbps con ffmpeg"], "caps": [("🔇", "Reducción de ruido adaptativa", "Perfil de ruido desde secciones en silencio. Para zumbido HVAC, ruido de sala, silbido."), ("📊", "Volumen EBU R128", "Estándar de la industria para plataformas de podcasts (Spotify -14 LUFS, Apple -16 LUFS)."), ("✂️", "Detección y recorte de silencios", "Umbral configurable. Eliminar aire muerto sin tocar el habla."), ("🔄", "Conversión de formato", "WAV, FLAC, OGG, AAC, MP3 — cualquier códec, cualquier bitrate."), ("🎚️", "Mezcla multipista", "Mezclar música de intro/outro con pista de voz."), ("📋", "Informe de análisis de audio", "Duración, niveles de pico, volumen y estadísticas de clipping.")], "cta_title": "Audio profesional. Cero edición manual.", "cta_desc": "Sube la grabación bruta. Obtén audio listo para difusión. Sin DAW, sin plugins."},
        "fr": {"meta_title": "Post-Production Podcast et Audio — AgentPuter", "h1_line1": "Post-Production", "h1_line2": "Podcast et Audio", "subtitle": "Importer l'enregistrement → L'IA débruite et édite → Exporter MP3 broadcast", "steps": ["① Importer WAV/MP3 brut", "② L'agent débruite et normalise", "③ MP3 prêt pour la diffusion"], "user_msg": '"Nettoie l\'épisode 12. Supprimer le bruit de fond, normaliser à -14 LUFS, couper les silences de plus de 2 secondes, exporter MP3 128 kbps."', "plan_steps": ["Détecter le profil de bruit des sections silencieuses", "Appliquer la réduction de bruit (sox noisered)", "Normalisation de volume EBU R128 à -14 LUFS", "Couper les segments de silence > 2s", "Convertir en MP3 128 kbps via ffmpeg"], "caps": [("🔇", "Débruitage adaptatif", "Profil de bruit depuis les sections silencieuses. Pour ronflements CVC, son de pièce, souffle."), ("📊", "Volume EBU R128", "Standard pour les plateformes de podcasts (Spotify -14 LUFS, Apple -16 LUFS)."), ("✂️", "Détection et suppression des silences", "Seuil configurable. Supprimer les temps morts sans toucher la parole."), ("🔄", "Conversion de format", "WAV, FLAC, OGG, AAC, MP3 — tout codec, tout débit."), ("🎚️", "Mixage multipiste", "Mixer la musique intro/outro avec la piste vocale."), ("📋", "Rapport d'analyse audio", "Durée, niveaux de crête, volume et statistiques de saturation.")], "cta_title": "Audio professionnel. Zéro montage manuel.", "cta_desc": "Importez l'enregistrement brut. Obtenez un audio prêt pour la diffusion. Sans DAW, sans plugins."},
        "ja": {"meta_title": "ポッドキャスト&音声ポストプロダクション — AgentPuter", "h1_line1": "ポッドキャスト&音声", "h1_line2": "ポストプロダクション", "subtitle": "録音をアップロード → AIがノイズ除去&編集 → ブロードキャスト用MP3をエクスポート", "steps": ["① 生WAV/MP3をアップロード", "② エージェントがノイズ除去&正規化", "③ ブロードキャスト品質MP3完成"], "user_msg": '"エピソード12を整えてください。背景ノイズ除去、-14 LUFSに正規化、2秒以上の無音をカット、128kbps MP3でエクスポート。"', "plan_steps": ["無音区間からノイズプロファイルを検出", "ノイズリダクションを適用（sox noisered）", "EBU R128ラウドネス正規化（-14 LUFS）", "2秒以上の無音セグメントをカット", "ffmpegで128kbps MP3に変換"], "caps": [("🔇", "適応型ノイズ除去", "無音区間からノイズプロファイルを自動サンプリング。空調ノイズ、ルームトーン対応。"), ("📊", "EBU R128ラウドネス", "ポッドキャストプラットフォームの業界標準（Spotify -14 LUFS、Apple -16 LUFS）。"), ("✂️", "無音検出&カット", "設定可能な閾値。スピーチを傷つけずにデッドエアを除去。"), ("🔄", "フォーマット変換", "WAV、FLAC、OGG、AAC、MP3 — あらゆるコーデック、ビットレート。"), ("🎚️", "マルチトラックミキシング", "イントロ/アウトロ音楽とボイストラックをミックス。"), ("📋", "音声解析レポート", "尺、ピークレベル、ラウドネス、クリッピング統計。")], "cta_title": "プロ品質の音声。手動編集ゼロ。", "cta_desc": "生録音をアップロードしてください。ブロードキャスト品質の音声が完成します。DAWもプラグインも不要。"},
        "ko": {"meta_title": "팟캐스트 & 오디오 후반 작업 — AgentPuter", "h1_line1": "팟캐스트 & 오디오", "h1_line2": "후반 작업", "subtitle": "녹음 업로드 → AI 노이즈 제거 & 편집 → 방송용 MP3 내보내기", "steps": ["① 원본 WAV/MP3 업로드", "② 에이전트가 노이즈 제거 & 정규화", "③ 방송 품질 MP3 완성"], "user_msg": '"에피소드 12를 정리해주세요. 배경 소음 제거, -14 LUFS로 정규화, 2초 이상 무음 구간 제거, 128kbps MP3로 내보내기."', "plan_steps": ["무음 구간에서 노이즈 프로파일 감지", "노이즈 감소 적용 (sox noisered)", "EBU R128 라우드니스 정규화 (-14 LUFS)", "2초 이상 무음 구간 제거", "ffmpeg로 128kbps MP3 변환"], "caps": [("🔇", "적응형 노이즈 제거", "무음 구간에서 자동으로 노이즈 프로파일 샘플링. 냉난방 소음, 룸 톤 처리."), ("📊", "EBU R128 라우드니스", "팟캐스트 플랫폼 업계 표준 (Spotify -14 LUFS, Apple -16 LUFS)."), ("✂️", "무음 감지 & 제거", "조절 가능한 임계값. 음성 손상 없이 데드 에어 제거."), ("🔄", "포맷 변환", "WAV, FLAC, OGG, AAC, MP3 — 모든 코덱, 모든 비트레이트."), ("🎚️", "멀티 트랙 믹싱", "인트로/아웃트로 음악과 보이스 트랙 믹싱."), ("📋", "오디오 분석 보고서", "길이, 피크 레벨, 라우드니스, 클리핑 통계.")], "cta_title": "전문 오디오. 수동 편집 제로.", "cta_desc": "원본 녹음을 업로드하세요. 방송 품질 오디오가 완성됩니다. DAW도 플러그인도 필요 없습니다."},
        "pt-br": {"meta_title": "Pós-Produção de Podcast e Áudio — AgentPuter", "h1_line1": "Pós-Produção de", "h1_line2": "Podcast e Áudio", "subtitle": "Enviar gravação → IA remove ruído e edita → Exportar MP3 para broadcast", "steps": ["① Enviar WAV/MP3 bruto", "② Agente remove ruído e normaliza", "③ MP3 pronto para broadcast"], "user_msg": '"Limpe o episódio 12. Remover ruído de fundo, normalizar para -14 LUFS, cortar silêncios maiores de 2 segundos, exportar MP3 128 kbps."', "plan_steps": ["Detectar perfil de ruído de seções em silêncio", "Aplicar redução de ruído (sox noisered)", "Normalização de volume EBU R128 a -14 LUFS", "Cortar segmentos de silêncio > 2s", "Converter para MP3 128 kbps via ffmpeg"], "caps": [("🔇", "Remoção de ruído adaptativa", "Perfil de ruído de seções em silêncio. Para zumbido de HVAC, tom de sala, chiado."), ("📊", "Volume EBU R128", "Padrão da indústria para plataformas de podcast (Spotify -14 LUFS, Apple -16 LUFS)."), ("✂️", "Detecção e corte de silêncio", "Limiar configurável. Remover ar morto sem tocar na fala."), ("🔄", "Conversão de formato", "WAV, FLAC, OGG, AAC, MP3 — qualquer codec, qualquer bitrate."), ("🎚️", "Mixagem multipista", "Misturar música de intro/outro com faixa de voz."), ("📋", "Relatório de análise de áudio", "Duração, níveis de pico, volume e estatísticas de clipping.")], "cta_title": "Áudio profissional. Zero edição manual.", "cta_desc": "Envie a gravação bruta. Obtenha áudio pronto para broadcast. Sem DAW, sem plugins."},
        "ru": {"meta_title": "Постпродакшн подкастов и аудио — AgentPuter", "h1_line1": "Постпродакшн подкастов", "h1_line2": "и аудио", "subtitle": "Загрузить запись → ИИ удаляет шум и редактирует → Экспорт MP3 вещательного качества", "steps": ["① Загрузить сырой WAV/MP3", "② Агент удаляет шум и нормализует", "③ Готовый к эфиру MP3"], "user_msg": '"Обработай эпизод 12. Убрать фоновый шум, нормализовать до -14 LUFS, обрезать тишину длиннее 2 секунд, экспортировать MP3 128 кбит/с."', "plan_steps": ["Определить профиль шума по тихим участкам", "Применить шумоподавление (sox noisered)", "Нормализация громкости EBU R128 до -14 LUFS", "Обрезать участки тишины > 2с", "Конвертировать в MP3 128 кбит/с через ffmpeg"], "caps": [("🔇", "Адаптивное шумоподавление", "Профиль шума из тихих участков. Для гула кондиционера, шума комнаты, шипения."), ("📊", "Громкость EBU R128", "Отраслевой стандарт для подкаст-платформ (Spotify -14 LUFS, Apple -16 LUFS)."), ("✂️", "Обнаружение и обрезка тишины", "Настраиваемый порог. Убрать паузы без затрагивания речи."), ("🔄", "Конвертация форматов", "WAV, FLAC, OGG, AAC, MP3 — любой кодек, любой битрейт."), ("🎚️", "Сведение нескольких дорожек", "Смешать музыку вступления/заключения с дорожкой голоса."), ("📋", "Отчёт анализа аудио", "Длительность, уровни пиков, громкость и статистика клиппинга.")], "cta_title": "Профессиональное аудио. Ноль ручного монтажа.", "cta_desc": "Загрузите сырую запись. Получите аудио вещательного качества. Без DAW, без плагинов."},
        "zh": {"meta_title": "播客与音频后期处理 — AgentPuter", "h1_line1": "播客与音频", "h1_line2": "后期处理", "subtitle": "上传录音 → AI 降噪剪辑 → 导出广播级 MP3", "steps": ["① 上传原始 WAV/MP3", "② Agent 降噪 & 响度标准化", "③ 广播级 MP3 完成"], "user_msg": '"处理播客第 12 集。去除背景噪音，标准化至 -14 LUFS，修剪 2 秒以上的静音段，导出 128kbps MP3。"', "plan_steps": ["从静音段采样噪声特征", "应用降噪（sox noisered）", "EBU R128 响度标准化至 -14 LUFS", "修剪 2 秒以上的静音段", "通过 ffmpeg 转换为 128kbps MP3"], "caps": [("🔇", "自适应降噪", "从静音段自动采样噪声轮廓，适用于空调噪声、室内本底噪声等。"), ("📊", "EBU R128 响度标准", "播客平台行业标准（Spotify -14 LUFS、Apple -16 LUFS）。"), ("✂️", "静音检测与修剪", "可配置阈值，精准去除死寂片段而不影响语音。"), ("🔄", "格式转换", "WAV、FLAC、OGG、AAC、MP3 — 任意编解码器、任意码率。"), ("🎚️", "多轨道混音", "将片头/片尾音乐与人声轨道混合，独立调节音量。"), ("📋", "音频分析报告", "获取时长、峰值电平、响度和削波统计。")], "cta_title": "专业音频，零手动编辑。", "cta_desc": "上传原始录音，获得广播级音频。无需 DAW、无需插件、无需音频工程师。"},
        "zh-tw": {"meta_title": "Podcast 與音訊後期處理 — AgentPuter", "h1_line1": "Podcast 與音訊", "h1_line2": "後期處理", "subtitle": "上傳錄音 → AI 降噪剪輯 → 匯出廣播級 MP3", "steps": ["① 上傳原始 WAV/MP3", "② Agent 降噪 & 響度標準化", "③ 廣播級 MP3 完成"], "user_msg": '"處理 Podcast 第 12 集。去除背景雜音，標準化至 -14 LUFS，修剪 2 秒以上的靜音段，匯出 128kbps MP3。"', "plan_steps": ["從靜音段取樣雜訊特徵", "套用降噪（sox noisered）", "EBU R128 響度標準化至 -14 LUFS", "修剪 2 秒以上的靜音段", "透過 ffmpeg 轉換為 128kbps MP3"], "caps": [("🔇", "自適應降噪", "從靜音段自動取樣雜訊輪廓，適用於冷氣雜訊、室內底噪等。"), ("📊", "EBU R128 響度標準", "Podcast 平台行業標準（Spotify -14 LUFS、Apple -16 LUFS）。"), ("✂️", "靜音偵測與修剪", "可設定閾值，精準去除死寂片段而不影響語音。"), ("🔄", "格式轉換", "WAV、FLAC、OGG、AAC、MP3 — 任意編解碼器、任意位元率。"), ("🎚️", "多軌道混音", "將片頭/片尾音樂與人聲軌道混合。"), ("📋", "音訊分析報告", "取得時長、峰值電平、響度和削波統計。")], "cta_title": "專業音訊，零手動編輯。", "cta_desc": "上傳原始錄音，獲得廣播級音訊。無需 DAW、無需外掛程式。"},
    },

    "tech-docs": {
        "tag": "DOCS",
        "engine_badge": "ap-docs",
        "lib_badge": "LibreOffice Writer",
        "accent": "#38BDF8",
        "en": {
            "meta_title": "Technical Documentation Generator — AgentPuter",
            "meta_desc": "Paste API specs, get enterprise-formatted Word/PDF documentation.",
            "h1_line1": "Technical Documentation",
            "h1_line2": "Generator",
            "subtitle": "API specs → AI formats → Export Word/PDF",
            "steps": ["① Paste API spec / outline", "② Agent formats & structures", "③ Export DOCX + PDF"],
            "user_msg": '"Generate API reference docs from our OpenAPI spec. Enterprise format, Python and JS examples, changelog section, export DOCX and PDF."',
            "plan_steps": ["Parse openapi.yaml — extract endpoints & schemas", "Apply enterprise .dotx template", "Generate endpoint sections with params + responses", "Insert Python + JS code examples", "Auto-generate TOC + index + changelog"],
            "caps": [
                ("📋", "OpenAPI / Swagger import", "Parse YAML or JSON spec files. Auto-generate endpoint sections."),
                ("💻", "Multi-language code examples", "Generate curl, Python, JavaScript, Go, Java examples for every endpoint."),
                ("📑", "Auto TOC + index", "Table of contents and full-text index from headings. Click-navigable in PDF."),
                ("🏢", "Enterprise template support", "Apply branded .dotx templates with company logo, headers, footers."),
                ("📄", "Multi-format output", "Export as DOCX, PDF, ODT, or HTML. Preserve code blocks and tables."),
                ("🔄", "Auto-update from spec changes", "Re-run with updated spec — docs update incrementally."),
            ],
            "cta_title": "Your API spec. Enterprise docs in under a minute.",
            "cta_desc": "No more copy-paste from Notion to Word. AgentPuter generates perfectly formatted documentation from your spec.",
        },
        "de": {"meta_title": "Technische Dokumentationsgenerierung — AgentPuter", "h1_line1": "Technische Dokumentations-", "h1_line2": "generierung", "subtitle": "API-Specs → KI formatiert → Word/PDF exportieren", "steps": ["① API-Spec / Gliederung einfügen", "② Agent formatiert & strukturiert", "③ DOCX + PDF exportieren"], "user_msg": '"API-Referenzdokumentation aus unserem OpenAPI-Spec generieren. Unternehmensformat, Python- und JS-Beispiele, Changelog-Abschnitt, DOCX und PDF exportieren."', "plan_steps": ["openapi.yaml parsen — Endpunkte & Schemas extrahieren", "Enterprise .dotx-Vorlage anwenden", "Endpunkt-Abschnitte mit Parametern + Antworten generieren", "Python + JS-Code-Beispiele einfügen", "Inhaltsverzeichnis + Index + Changelog autogenerieren"], "caps": [("📋", "OpenAPI / Swagger Import", "YAML- oder JSON-Spec-Dateien parsen. Endpunkt-Abschnitte autogenerieren."), ("💻", "Mehrsprachige Code-Beispiele", "curl, Python, JavaScript, Go, Java-Beispiele für jeden Endpunkt."), ("📑", "Auto-Inhaltsverz. + Index", "Inhaltsverzeichnis und Volltext-Index aus Überschriften. Klickbar im PDF."), ("🏢", "Enterprise-Vorlagenunterstützung", "Firmenspezifische .dotx-Vorlagen mit Logo, Kopf- und Fußzeilen."), ("📄", "Multi-Format-Ausgabe", "Export als DOCX, PDF, ODT oder HTML."), ("🔄", "Auto-Update bei Spec-Änderungen", "Mit aktualisiertem Spec neu ausführen — Docs werden inkrementell aktualisiert.")], "cta_title": "Ihr API-Spec. Unternehmensdoku in unter einer Minute.", "cta_desc": "Kein Copy-Paste mehr von Notion nach Word. AgentPuter generiert perfekt formatierte Dokumentation direkt aus Ihrem Spec."},
        "es": {"meta_title": "Generador de Documentación Técnica — AgentPuter", "h1_line1": "Generador de", "h1_line2": "Documentación Técnica", "subtitle": "Especificación API → IA formatea → Exportar Word/PDF", "steps": ["① Pegar spec API / esquema", "② El agente formatea y estructura", "③ Exportar DOCX + PDF"], "user_msg": '"Genera documentación de referencia de API desde nuestro spec OpenAPI. Formato empresarial, ejemplos en Python y JS, sección de changelog, exportar DOCX y PDF."', "plan_steps": ["Analizar openapi.yaml — extraer endpoints y esquemas", "Aplicar plantilla empresarial .dotx", "Generar secciones de endpoints con params + respuestas", "Insertar ejemplos en Python + JS", "Autogenerar TOC + índice + changelog"], "caps": [("📋", "Importación OpenAPI / Swagger", "Analizar archivos spec YAML o JSON. Secciones de endpoints autogeneradas."), ("💻", "Ejemplos de código multilenguaje", "Ejemplos de curl, Python, JavaScript, Go, Java para cada endpoint."), ("📑", "TOC automático + índice", "Índice de contenidos e índice de texto completo desde títulos."), ("🏢", "Soporte de plantillas empresariales", "Plantillas .dotx con logo, encabezados y pies de página."), ("📄", "Salida en múltiples formatos", "Exportar como DOCX, PDF, ODT o HTML."), ("🔄", "Actualización automática", "Volver a ejecutar con spec actualizado — docs se actualizan incrementalmente.")], "cta_title": "Tu spec de API. Docs empresariales en menos de un minuto.", "cta_desc": "Sin más copiar y pegar de Notion a Word. AgentPuter genera documentación perfectamente formateada desde tu spec."},
        "fr": {"meta_title": "Générateur de Documentation Technique — AgentPuter", "h1_line1": "Générateur de", "h1_line2": "Documentation Technique", "subtitle": "Spéc API → L'IA formate → Exporter Word/PDF", "steps": ["① Coller la spéc API / plan", "② L'agent formate et structure", "③ Exporter DOCX + PDF"], "user_msg": '"Génère de la documentation de référence API depuis notre spec OpenAPI. Format entreprise, exemples Python et JS, section changelog, exporter DOCX et PDF."', "plan_steps": ["Analyser openapi.yaml — extraire endpoints & schemas", "Appliquer le modèle entreprise .dotx", "Générer les sections d'endpoints avec params + réponses", "Insérer des exemples en Python + JS", "Autogénérer TOC + index + changelog"], "caps": [("📋", "Import OpenAPI / Swagger", "Analyser les fichiers spec YAML ou JSON. Sections d'endpoints autogénérées."), ("💻", "Exemples de code multilangage", "Exemples curl, Python, JavaScript, Go, Java pour chaque endpoint."), ("📑", "TOC auto + index", "Table des matières et index texte intégral depuis les titres."), ("🏢", "Support de modèles d'entreprise", "Modèles .dotx avec logo, en-têtes et pieds de page."), ("📄", "Sortie multi-format", "Exporter en DOCX, PDF, ODT ou HTML."), ("🔄", "Mise à jour automatique", "Relancer avec la spec mise à jour — docs mis à jour de façon incrémentale.")], "cta_title": "Votre spec API. Documentation d'entreprise en moins d'une minute.", "cta_desc": "Fini le copier-coller de Notion vers Word. AgentPuter génère une documentation parfaitement formatée depuis votre spec."},
        "ja": {"meta_title": "技術ドキュメント自動生成 — AgentPuter", "h1_line1": "技術ドキュメント", "h1_line2": "自動生成", "subtitle": "API仕様 → AIが整形 → Word/PDFをエクスポート", "steps": ["① API仕様/アウトラインを貼り付け", "② エージェントが整形&構造化", "③ DOCX + PDFをエクスポート"], "user_msg": '"OpenAPI仕様からAPIリファレンスを生成してください。エンタープライズ形式、PythonとJSのサンプル、changelogセクション、DOCXとPDFで出力。"', "plan_steps": ["openapi.yamlを解析 — エンドポイント&スキーマを抽出", "エンタープライズ .dotx テンプレートを適用", "パラメータ+レスポンス付きエンドポイントセクションを生成", "Python + JS コードサンプルを挿入", "目次+索引+changelogを自動生成"], "caps": [("📋", "OpenAPI / Swaggerインポート", "YAMLまたはJSON仕様ファイルを解析。エンドポイントセクションを自動生成。"), ("💻", "多言語コードサンプル", "全エンドポイントにcurl、Python、JavaScript、Go、Javaサンプルを自動生成。"), ("📑", "自動目次+索引", "見出しから目次とフルテキスト索引を生成。PDFでクリックナビゲーション可能。"), ("🏢", "エンタープライズテンプレート", "ロゴ、ヘッダー、フッター付きの .dotx テンプレートを適用。"), ("📄", "マルチフォーマット出力", "DOCX、PDF、ODT、HTMLとしてエクスポート。"), ("🔄", "仕様変更の自動更新", "更新された仕様で再実行 — ドキュメントが差分更新される。")], "cta_title": "API仕様から1分以内にエンタープライズドキュメント。", "cta_desc": "NotionからWordへのコピペは不要。AgentPuterが仕様から完璧に整形されたドキュメントを生成します。"},
        "ko": {"meta_title": "기술 문서 자동 생성기 — AgentPuter", "h1_line1": "기술 문서", "h1_line2": "자동 생성기", "subtitle": "API 스펙 → AI가 포맷 → Word/PDF 내보내기", "steps": ["① API 스펙 / 개요 붙여넣기", "② 에이전트가 포맷 & 구조화", "③ DOCX + PDF 내보내기"], "user_msg": '"OpenAPI 스펙으로 API 레퍼런스 문서를 생성해주세요. 기업용 형식, Python과 JS 예제, changelog 섹션, DOCX와 PDF로 내보내기."', "plan_steps": ["openapi.yaml 파싱 — 엔드포인트 & 스키마 추출", "기업용 .dotx 템플릿 적용", "파라미터 + 응답이 포함된 엔드포인트 섹션 생성", "Python + JS 코드 예제 삽입", "TOC + 인덱스 + changelog 자동 생성"], "caps": [("📋", "OpenAPI / Swagger 가져오기", "YAML 또는 JSON 스펙 파일 파싱. 엔드포인트 섹션 자동 생성."), ("💻", "다국어 코드 예제", "모든 엔드포인트에 curl, Python, JavaScript, Go, Java 예제 자동 생성."), ("📑", "자동 TOC + 인덱스", "제목에서 목차와 전체 텍스트 인덱스 생성. PDF에서 클릭 탐색 가능."), ("🏢", "기업용 템플릿 지원", "로고, 헤더, 푸터가 포함된 .dotx 템플릿 적용."), ("📄", "다중 형식 출력", "DOCX, PDF, ODT, HTML로 내보내기."), ("🔄", "스펙 변경 자동 업데이트", "업데이트된 스펙으로 재실행 — 문서가 점진적으로 업데이트됨.")], "cta_title": "API 스펙으로 1분 안에 기업용 문서를.", "cta_desc": "더 이상 Notion에서 Word로 복붙하지 마세요. AgentPuter가 스펙에서 완벽하게 포맷된 문서를 생성합니다."},
        "pt-br": {"meta_title": "Gerador de Documentação Técnica — AgentPuter", "h1_line1": "Gerador de", "h1_line2": "Documentação Técnica", "subtitle": "Spec da API → IA formata → Exportar Word/PDF", "steps": ["① Colar spec API / esboço", "② Agente formata e estrutura", "③ Exportar DOCX + PDF"], "user_msg": '"Gere documentação de referência da API a partir do nosso spec OpenAPI. Formato empresarial, exemplos Python e JS, seção changelog, exportar DOCX e PDF."', "plan_steps": ["Analisar openapi.yaml — extrair endpoints e schemas", "Aplicar template empresarial .dotx", "Gerar seções de endpoints com params + respostas", "Inserir exemplos em Python + JS", "Autogerar TOC + índice + changelog"], "caps": [("📋", "Importação OpenAPI / Swagger", "Analisar arquivos spec YAML ou JSON. Seções de endpoints autogeneradas."), ("💻", "Exemplos de código multilíngue", "Exemplos curl, Python, JavaScript, Go, Java para cada endpoint."), ("📑", "TOC automático + índice", "Sumário e índice de texto completo dos títulos."), ("🏢", "Suporte a templates empresariais", "Templates .dotx com logo, cabeçalhos e rodapés."), ("📄", "Saída em múltiplos formatos", "Exportar como DOCX, PDF, ODT ou HTML."), ("🔄", "Atualização automática", "Executar novamente com spec atualizado — docs são atualizados incrementalmente.")], "cta_title": "Seu spec de API. Documentação empresarial em menos de um minuto.", "cta_desc": "Sem mais copiar e colar do Notion para o Word. AgentPuter gera documentação perfeitamente formatada a partir do seu spec."},
        "ru": {"meta_title": "Генератор технической документации — AgentPuter", "h1_line1": "Генератор технической", "h1_line2": "документации", "subtitle": "Спецификация API → ИИ форматирует → Экспорт Word/PDF", "steps": ["① Вставить спецификацию API / план", "② Агент форматирует и структурирует", "③ Экспортировать DOCX + PDF"], "user_msg": '"Сгенерируй справочную документацию по API из нашей спецификации OpenAPI. Корпоративный формат, примеры на Python и JS, раздел changelog, экспортировать DOCX и PDF."', "plan_steps": ["Разобрать openapi.yaml — извлечь эндпоинты и схемы", "Применить корпоративный шаблон .dotx", "Сгенерировать разделы эндпоинтов с параметрами + ответами", "Вставить примеры на Python + JS", "Автогенерировать оглавление + индекс + changelog"], "caps": [("📋", "Импорт OpenAPI / Swagger", "Разбор YAML или JSON спецификаций. Разделы эндпоинтов автогенерируются."), ("💻", "Многоязычные примеры кода", "Примеры curl, Python, JavaScript, Go, Java для каждого эндпоинта."), ("📑", "Автооглавление + индекс", "Оглавление и полнотекстовый индекс из заголовков."), ("🏢", "Поддержка корпоративных шаблонов", "Фирменные .dotx-шаблоны с логотипом, заголовками и нижними колонтитулами."), ("📄", "Многоформатный вывод", "Экспорт в DOCX, PDF, ODT или HTML."), ("🔄", "Автообновление при изменениях", "Перезапуск с обновлённой спецификацией — документы обновляются инкрементально.")], "cta_title": "Ваша спецификация API. Корпоративная документация за минуту.", "cta_desc": "Больше никакого копирования из Notion в Word. AgentPuter генерирует идеально отформатированную документацию прямо из вашей спецификации."},
        "zh": {"meta_title": "技术文档一键生成 — AgentPuter", "h1_line1": "技术文档", "h1_line2": "一键生成", "subtitle": "API 规格 → AI 排版 → 导出 Word/PDF", "steps": ["① 粘贴 API 规格 / 大纲", "② Agent 排版 & 结构化", "③ 导出 DOCX + PDF"], "user_msg": '"从我们的 OpenAPI 规格生成 API 参考文档。企业格式，包含 Python 和 JS 示例，变更日志章节，导出 DOCX 和 PDF。"', "plan_steps": ["解析 openapi.yaml — 提取接口和 Schema", "应用企业 .dotx 模板", "生成带参数和响应的接口章节", "插入 Python + JS 代码示例", "自动生成目录 + 索引 + changelog"], "caps": [("📋", "OpenAPI / Swagger 导入", "解析 YAML 或 JSON 规格文件，自动生成接口章节。"), ("💻", "多语言代码示例", "为每个接口自动生成 curl、Python、JavaScript、Go、Java 示例。"), ("📑", "自动目录 + 索引", "从标题生成目录和全文索引，PDF 中可点击导航。"), ("🏢", "企业模板支持", "应用带公司 Logo、页眉和页脚的 .dotx 模板。"), ("📄", "多格式输出", "导出为 DOCX、PDF、ODT 或 HTML，保留代码块和表格。"), ("🔄", "规格变更自动更新", "用更新后的规格文件重新运行，文档增量更新。")], "cta_title": "你的 API 规格，一分钟内生成企业级文档。", "cta_desc": "不再从 Notion 复制粘贴到 Word。AgentPuter 直接从规格文件生成格式完美的技术文档。"},
        "zh-tw": {"meta_title": "技術文件一鍵生成 — AgentPuter", "h1_line1": "技術文件", "h1_line2": "一鍵生成", "subtitle": "API 規格 → AI 排版 → 匯出 Word/PDF", "steps": ["① 貼上 API 規格 / 大綱", "② Agent 排版 & 結構化", "③ 匯出 DOCX + PDF"], "user_msg": '"從我們的 OpenAPI 規格生成 API 參考文件。企業格式，包含 Python 和 JS 範例，變更日誌章節，匯出 DOCX 和 PDF。"', "plan_steps": ["解析 openapi.yaml — 提取端點和 Schema", "套用企業 .dotx 範本", "生成含參數和回應的端點章節", "插入 Python + JS 程式碼範例", "自動生成目錄 + 索引 + changelog"], "caps": [("📋", "OpenAPI / Swagger 匯入", "解析 YAML 或 JSON 規格檔案，自動生成端點章節。"), ("💻", "多語言程式碼範例", "為每個端點自動生成 curl、Python、JavaScript、Go、Java 範例。"), ("📑", "自動目錄 + 索引", "從標題生成目錄和全文索引，PDF 中可點擊導覽。"), ("🏢", "企業範本支援", "套用含公司 Logo、頁首和頁尾的 .dotx 範本。"), ("📄", "多格式輸出", "匯出為 DOCX、PDF、ODT 或 HTML。"), ("🔄", "規格變更自動更新", "以更新後的規格檔案重新執行，文件增量更新。")], "cta_title": "你的 API 規格，一分鐘內生成企業級文件。", "cta_desc": "不再從 Notion 複製貼上到 Word。AgentPuter 直接從規格檔案生成格式完美的技術文件。"},
    },
}

# Other scenario nav data per lang
SCENARIO_SLUGS = list(SCENARIOS.keys())

SCENARIO_NAV = {
    "financial-report": {"icon": "📊", "tag": "FINANCE"},
    "design-poster":    {"icon": "🎨", "tag": "DESIGN"},
    "system-diagram":   {"icon": "📐", "tag": "ENGINEERING"},
    "audio-production": {"icon": "🎵", "tag": "AUDIO"},
    "tech-docs":        {"icon": "📝", "tag": "DOCS"},
}

# Titles per lang (reuse from scenario h1)
def get_scenario_title(slug, lang):
    d = SCENARIOS[slug].get(lang, SCENARIOS[slug]["en"])
    return d["h1_line1"].rstrip("-").strip() + " " + d["h1_line2"].strip()


# ─── Page generator ───────────────────────────────────────────────────────────

def gen_page(slug: str, lang_code: str) -> str:
    sc = SCENARIOS[slug]
    ui = UI[lang_code]
    t = sc.get(lang_code, sc["en"])  # fall back to English if missing
    en = sc["en"]

    accent = sc["accent"]
    tag = sc["tag"]
    engine_badge = sc["engine_badge"]
    lib_badge = sc["lib_badge"]

    # Other scenarios list
    other = [(s, SCENARIO_NAV[s]["icon"], SCENARIO_NAV[s]["tag"]) for s in SCENARIO_SLUGS if s != slug]

    def other_rows():
        rows = []
        for other_slug, icon, other_tag in other:
            title = get_scenario_title(other_slug, lang_code)
            rows.append(f'''            <a href="/{lang_code}/features/{other_slug}" class="group flex items-center gap-4 bg-[#111111] hover:bg-[#161622] border border-[#1E1E2E] hover:border-[{accent}]/20 rounded-xl px-5 py-4 transition-all">
              <span class="text-2xl">{icon}</span>
              <div class="flex-1 min-w-0">
                <span class="text-xs font-mono text-[#4A4A6A] block mb-0.5">{other_tag}</span>
                <span class="text-sm text-[#94A3B8] group-hover:text-white transition-colors truncate block">{title}</span>
              </div>
              <span class="text-[#2A2A3A] group-hover:text-[{accent}] transition-colors">→</span>
            </a>''')
        return "\n".join(rows)

    def cap_cards():
        caps = t.get("caps", en["caps"])
        cards = []
        for icon, title, desc in caps:
            cards.append(f'''            <div class="flex gap-4 bg-[#0D0D1A] border border-[#1E1E2E] rounded-xl p-5">
              <span class="text-2xl shrink-0 mt-0.5">{icon}</span>
              <div>
                <h3 class="text-white text-sm font-semibold mb-1">{title}</h3>
                <p class="text-[#6B7280] text-xs leading-relaxed">{desc}</p>
              </div>
            </div>''')
        return "\n".join(cards)

    def plan_steps_html():
        steps = t.get("plan_steps", en["plan_steps"])
        items = []
        for step in steps:
            items.append(f'                <li class="flex gap-2"><span class="text-[{accent}]">→</span> {step}</li>')
        return "\n".join(items)

    def step_pills():
        steps = t.get("steps", en["steps"])
        pills = []
        for step in steps:
            pills.append(f'              <span class="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[{accent}]/20 rounded-full text-xs text-[#94A3B8] font-mono">{step}</span>')
        return "\n".join(pills)

    # CLI block stays in English (technical content)
    cli_block = get_cli_block(slug, accent)

    meta_title = t.get("meta_title", en["meta_title"])
    meta_desc = t.get("meta_desc", en.get("meta_desc", ""))
    h1_1 = t.get("h1_line1", en["h1_line1"])
    h1_2 = t.get("h1_line2", en["h1_line2"])
    subtitle = t.get("subtitle", en["subtitle"])
    user_msg = t.get("user_msg", en["user_msg"])
    plan_comment = ui["plan_comment"]
    caps_heading = ui["caps_heading"]
    other_heading = ui["other_heading"]
    deploy_heading = ui["deploy_heading"]
    session_heading = ui["session_heading"]
    cta_title = t.get("cta_title", en["cta_title"])
    cta_desc = t.get("cta_desc", en["cta_desc"])
    back = ui["back"]
    get_started = ui["get_started"]
    all_scenarios = ui["all_scenarios"]

    has_lang_header = (BASE_DIR / "src" / "components" / lang_code / "Header.astro").exists()
    header_import = f"import Header from '../../../components/{lang_code}/Header.astro';" if has_lang_header else "import Header from '../../../components/Header.astro';"
    footer_import = f"import Footer from '../../../components/{lang_code}/Footer.astro';" if (BASE_DIR / "src" / "components" / lang_code / "Footer.astro").exists() else "import Footer from '../../../components/Footer.astro';"

    return f"""---
import Layout from '../../../layouts/Layout.astro';
{header_import}
{footer_import}
---

<Layout
  title="{meta_title}"
  description="{meta_desc}"
>
  <Header activePage="features" />
  <main class="relative z-10">

    <!-- Hero -->
    <section class="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#0D0D14]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,{accent.replace('#','rgba(')+'4D'},transparent_60%)]" style="background: radial-gradient(ellipse at top left, {accent}0D, transparent 60%)"></div>
      <div class="relative max-w-5xl mx-auto px-6 lg:px-20">
        <a href="/{lang_code}/features" class="inline-flex items-center gap-2 text-xs font-mono text-[#4B5563] hover:text-[{accent}] transition-colors mb-8">
          {back}
        </a>
        <div class="flex flex-wrap gap-3 mb-5">
          <span class="text-xs font-bold font-mono px-2.5 py-1 rounded text-[{accent}] bg-[{accent}]/10">{tag}</span>
          <span class="text-xs font-mono text-[#4A4A6A] px-2.5 py-1 rounded border border-[#1E1E2E]">{engine_badge}</span>
          <span class="text-xs font-mono text-[#4A4A6A] px-2.5 py-1 rounded border border-[#1E1E2E]">{lib_badge}</span>
        </div>
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
          {h1_1}<br/>{h1_2}
        </h1>
        <p class="text-[#9CA3AF] text-lg mb-10 max-w-2xl">{subtitle}</p>
        <div class="flex flex-wrap gap-3">
{step_pills()}
        </div>
      </div>
    </section>

    <!-- Session Log -->
    <section class="py-12 lg:py-20">
      <div class="max-w-5xl mx-auto px-6 lg:px-20">
        <p class="font-mono text-xs font-semibold tracking-[0.2em] mb-8" style="color:{accent}">{session_heading}</p>
        <div class="flex flex-col gap-4">

          <div class="flex items-start gap-4">
            <div class="shrink-0 w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-xs font-mono text-[#94A3B8]">U</div>
            <div class="bg-[#111827] border border-[#1E293B] rounded-2xl rounded-tl-sm px-5 py-4 max-w-xl">
              <p class="text-[#E2E8F0] text-sm">{user_msg}</p>
            </div>
          </div>

          <div class="flex items-start gap-4 flex-row-reverse">
            <div class="shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono" style="background:#0C1020;border-color:{accent}4D;color:{accent}">AP</div>
            <div class="rounded-2xl rounded-tr-sm px-5 py-4 max-w-xl border" style="background:#0D1020;border-color:{accent}26">
              <p class="text-[#94A3B8] text-xs font-mono mb-3">{plan_comment}</p>
              <ul class="text-[#CBD5E1] text-sm space-y-1.5">
{plan_steps_html()}
              </ul>
            </div>
          </div>

          {cli_block}

        </div>
      </div>
    </section>

    <!-- Capabilities -->
    <section class="py-12 lg:py-16 bg-[#080810]">
      <div class="max-w-5xl mx-auto px-6 lg:px-20">
        <p class="font-mono text-xs font-semibold tracking-[0.2em] mb-8" style="color:{accent}">{caps_heading}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
{cap_cards()}
        </div>
      </div>
    </section>

    <!-- Other Scenarios -->
    <section class="py-12 lg:py-16">
      <div class="max-w-5xl mx-auto px-6 lg:px-20">
        <p class="font-mono text-xs text-[#4B5563] font-semibold tracking-[0.2em] mb-6">{other_heading}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
{other_rows()}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-12 lg:py-20">
      <div class="max-w-5xl mx-auto px-6 lg:px-20">
        <div class="rounded-2xl p-8 md:p-12 text-center border" style="background:#0D1020;border-color:{accent}33">
          <p class="font-mono text-xs tracking-[0.2em] mb-4" style="color:{accent}">{deploy_heading}</p>
          <h2 class="text-white text-2xl md:text-3xl font-bold mb-4">{cta_title}</h2>
          <p class="text-[#6B7280] text-sm mb-8 max-w-md mx-auto">{cta_desc}</p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://app.agentputer.com/sign-up" class="btn-primary text-sm py-3 px-8 font-mono">{get_started}</a>
            <a href="/{lang_code}/features" class="btn-secondary text-sm py-3 px-8 font-mono">{all_scenarios}</a>
          </div>
        </div>
      </div>
    </section>

  </main>
  <Footer />
</Layout>
"""


def get_cli_block(slug: str, accent: str) -> str:
    """Return the CLI terminal block (stays in English for all languages)."""
    BLOCKS = {
        "financial-report": f"""
          <div class="bg-[#080810] border border-[#1E1E2E] rounded-2xl p-6 font-mono text-xs">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-3 h-3 rounded-full bg-[#FF5F57]"></span><span class="w-3 h-3 rounded-full bg-[#FEBC2E]"></span><span class="w-3 h-3 rounded-full bg-[#28C840]"></span>
              <span class="text-[#4B5563] ml-2">agentputer — ap-docs executor</span>
            </div>
            <div class="space-y-1.5">
              <p><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-docs new --type report --template enterprise-q1</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Created: Q1-Financial-Report.docx (template applied)</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-docs chart --data q1-sales.csv --type bar --title "Monthly Revenue"</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Chart inserted: 1920×800px, 3 data series</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-docs table --data q1-summary.csv --style financial</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Summary table: 6 columns × 14 rows, auto-formatted</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-docs export --pdf --toc --pages-auto</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Exported: Q1-Financial-Report.pdf — 28 pages</p>
            </div>
            <div class="mt-5 pt-4 border-t border-[#1E1E2E] flex items-center justify-between">
              <span class="text-[#4B5563]">elapsed: 1m 47s</span>
              <div class="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style="background:#0A1A0F;border-color:{accent}33">
                <span style="color:{accent}">📄</span><span style="color:{accent}">Q1-Financial-Report.pdf</span><span class="text-[#4B5563] ml-2">28 pages · 2.4 MB</span>
              </div>
            </div>
          </div>""",
        "design-poster": f"""
          <div class="bg-[#080810] border border-[#1E1E2E] rounded-2xl p-6 font-mono text-xs">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-3 h-3 rounded-full bg-[#FF5F57]"></span><span class="w-3 h-3 rounded-full bg-[#FEBC2E]"></span><span class="w-3 h-3 rounded-full bg-[#28C840]"></span>
              <span class="text-[#4B5563] ml-2">agentputer — ap-design executor</span>
            </div>
            <div class="space-y-1.5">
              <p><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-design canvas --size 1080x1920 --bg "#FF6B35"</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Canvas created: 1080×1920px, brand orange base</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-design text --content "SUMMER SALE" --weight bold --color white --size 96</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Text layer: headline positioned at y=340, centered</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-design badge --text "SUMMER25" --style pill --color white --bg "#1A1A1A"</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Promo badge element inserted</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-design batch --variants 3 --sizes "1080x1920,1200x628,1080x1080" --export png 2x</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Exported: 3 PNG files, 3 SVG masters</p>
            </div>
            <div class="mt-5 pt-4 border-t border-[#1E1E2E] flex items-center justify-between">
              <span class="text-[#4B5563]">elapsed: 23s · 6 files</span>
              <div class="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style="background:#100D18;border-color:{accent}33">
                <span style="color:{accent}">🎨</span><span style="color:{accent}">summer-sale-poster × 3</span><span class="text-[#4B5563] ml-2">PNG + SVG</span>
              </div>
            </div>
          </div>""",
        "system-diagram": f"""
          <div class="bg-[#080810] border border-[#1E1E2E] rounded-2xl p-6 font-mono text-xs">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-3 h-3 rounded-full bg-[#FF5F57]"></span><span class="w-3 h-3 rounded-full bg-[#FEBC2E]"></span><span class="w-3 h-3 rounded-full bg-[#28C840]"></span>
              <span class="text-[#4B5563] ml-2">agentputer — ap-diagrams executor</span>
            </div>
            <div class="space-y-1.5">
              <p><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-diagrams new --type microservice --theme dark</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Diagram initialized with microservice template</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-diagrams add node --labels "Auth,User,Order" --row 2 --spacing 200</span></p>
              <p class="text-[#4ADE80] pl-4">✓ 3 service nodes auto-positioned in row 2</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-diagrams connect "API Gateway" --to "Auth,User,Order" --style arrow</span></p>
              <p class="text-[#4ADE80] pl-4">✓ 3 connections wired with directional arrows</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-diagrams export --svg --png --fit-page</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Exported: microservice-arch.svg + microservice-arch.png</p>
            </div>
            <div class="mt-5 pt-4 border-t border-[#1E1E2E] flex items-center justify-between">
              <span class="text-[#4B5563]">elapsed: 31s</span>
              <div class="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style="background:#120F05;border-color:{accent}33">
                <span style="color:{accent}">📐</span><span style="color:{accent}">microservice-arch.svg</span><span class="text-[#4B5563] ml-2">Vector editable</span>
              </div>
            </div>
          </div>""",
        "audio-production": f"""
          <div class="bg-[#080810] border border-[#1E1E2E] rounded-2xl p-6 font-mono text-xs">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-3 h-3 rounded-full bg-[#FF5F57]"></span><span class="w-3 h-3 rounded-full bg-[#FEBC2E]"></span><span class="w-3 h-3 rounded-full bg-[#28C840]"></span>
              <span class="text-[#4B5563] ml-2">agentputer — ap-audio executor</span>
            </div>
            <div class="space-y-1.5">
              <p><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-audio analyze --input ep12-raw.wav</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Duration: 47m 23s · Peak: -2.1 dBFS · Noise floor: -45 dB</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-audio denoise --input ep12-raw.wav --profile auto</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Noise profile sampled · Applied: -18dB noise reduction</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-audio loudnorm --target -14 --tp -1.5 --lra 11</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Integrated loudness: -23.4 LUFS → -14.0 LUFS (EBU R128)</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-audio trim --remove-silence --threshold 0.02 --min-duration 2.0</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Removed 4m 12s of silence · Final: 43m 11s</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-audio convert --mp3 128k --output podcast-ep12-final.mp3</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Exported: podcast-ep12-final.mp3 · 128kbps</p>
            </div>
            <div class="mt-5 pt-4 border-t border-[#1E1E2E] flex items-center justify-between">
              <span class="text-[#4B5563]">elapsed: 2m 18s</span>
              <div class="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style="background:#07100A;border-color:{accent}33">
                <span style="color:{accent}">🎵</span><span style="color:{accent}">podcast-ep12-final.mp3</span><span class="text-[#4B5563] ml-2">128kbps · 43m 11s</span>
              </div>
            </div>
          </div>""",
        "tech-docs": f"""
          <div class="bg-[#080810] border border-[#1E1E2E] rounded-2xl p-6 font-mono text-xs">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-3 h-3 rounded-full bg-[#FF5F57]"></span><span class="w-3 h-3 rounded-full bg-[#FEBC2E]"></span><span class="w-3 h-3 rounded-full bg-[#28C840]"></span>
              <span class="text-[#4B5563] ml-2">agentputer — ap-docs executor</span>
            </div>
            <div class="space-y-1.5">
              <p><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-docs new --type api-reference --template enterprise-docs</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Document created from enterprise template</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-docs parse-openapi --input openapi.yaml --sections endpoints,schemas</span></p>
              <p class="text-[#4ADE80] pl-4">✓ Parsed: 42 endpoints, 18 request/response schemas</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-docs generate-sections --code-examples python,javascript</span></p>
              <p class="text-[#4ADE80] pl-4">✓ 42 endpoint sections with dual-language code blocks</p>
              <p class="mt-3"><span class="text-[#2A2A3A]">$ </span><span class="text-[#94A3B8]">ap-docs export --word --pdf --toc --index</span></p>
              <p class="text-[#4ADE80] pl-4">✓ api-reference-v2.docx (84 pages) · api-reference-v2.pdf</p>
            </div>
            <div class="mt-5 pt-4 border-t border-[#1E1E2E] flex items-center justify-between">
              <span class="text-[#4B5563]">elapsed: 54s</span>
              <div class="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style="background:#0A1520;border-color:{accent}33">
                <span style="color:{accent}">📝</span><span style="color:{accent}">api-reference-v2.docx</span><span class="text-[#4B5563] ml-2">84 pages · enterprise</span>
              </div>
            </div>
          </div>""",
    }
    return BLOCKS.get(slug, "")


# ─── Main ──────────────────────────────────────────────────────────────────────

def main():
    total = 0
    for lang_code in LANGS:
        out_dir = BASE_DIR / "src" / "pages" / lang_code / "features"
        out_dir.mkdir(parents=True, exist_ok=True)
        for slug in SCENARIO_SLUGS:
            out_path = out_dir / f"{slug}.astro"
            content = gen_page(slug, lang_code)
            out_path.write_text(content, encoding="utf-8")
            print(f"  [OK] {lang_code}/features/{slug}.astro")
            total += 1
    print(f"\nGenerated {total} files.")


if __name__ == "__main__":
    main()
