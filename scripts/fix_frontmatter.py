"""
修复 15-openclaw-security.md 多语言版本的 frontmatter 问题
"""
import re, os

BASE = "/Users/mac/Desktop/AgentPuter/src/content"

CORRECT_FM = {
    "ko-blog": {
        "title": "2026년 OpenClaw 보안: 공급망 공격, 91%의 인젝션 성공률, 그리고 이를 실제로 막는 5계층 방어",
        "description": "2026년 2월 초, 공개적으로 접근 가능한 135,000개의 OpenClaw 인스턴스가 발견되었습니다. 이 중 12,812개는 RCE를 통해 직접 악용이 가능했습니다. 기본 설정에서의 프롬프트 인젝션 성공률은 91%에 달했습니다. 이 글에서는 사건의 전말과 원인, 그리고 이를 막는 5계층 방어 아키텍처를 다룹니다.",
        "tags": '["OpenClaw", "보안", "프롬프트 인젝션", "ClawHavoc", "CVE-2026-25253", "ClawJacked", "에이전트 보안", "공급망"]',
    },
    "fr-blog": {
        "title": "Sécurité d'OpenClaw en 2026 : Attaques de la chaîne d'approvisionnement, taux d'injection de 91 %, et les cinq couches qui les arrêtent",
        "description": "135 000 instances OpenClaw étaient accessibles publiquement début février 2026. 12 812 étaient directement exploitables via RCE. Taux de réussite de l'injection de prompt en configuration par défaut : 91 %. Voici ce qui s'est passé, pourquoi cela a fonctionné et l'architecture de défense à cinq couches qui l'arrête.",
        "tags": '["OpenClaw", "Sécurité", "Injection de prompt", "ClawHavoc", "CVE-2026-25253", "ClawJacked", "Sécurité des agents", "Chaîne d\'approvisionnement"]',
    },
    "de-blog": {
        "title": "OpenClaw-Sicherheit im Jahr 2026: Supply-Chain-Angriffe, 91 % Injektionsraten und die fünf Schichten, die sie tatsächlich aufhalten",
        "description": "Anfang Februar 2026 waren 135.000 OpenClaw-Instanzen öffentlich erreichbar. 12.812 davon waren direkt über RCE ausnutzbar. Die Prompt-Injection-Erfolgsrate in der Standardkonfiguration beträgt 91 %. Hier ist, was passiert ist, warum es funktioniert hat und die Fünf-Schichten-Verteidigungsarchitektur, die es stoppt.",
        "tags": '["OpenClaw", "Sicherheit", "Prompt-Injection", "ClawHavoc", "CVE-2026-25253", "ClawJacked", "Agenten-Sicherheit", "Lieferkette"]',
    },
    "es-blog": {
        "title": "Seguridad de OpenClaw en 2026: Ataques a la cadena de suministro, tasas de inyección del 91% y las cinco capas que realmente los detienen",
        "description": "135.000 instancias de OpenClaw eran accesibles públicamente a principios de febrero de 2026. 12.812 eran directamente explotables mediante RCE. Tasa de éxito de inyección de prompt en la configuración por defecto: 91%. Aquí está lo que sucedió, por qué funcionó y la arquitectura de defensa de cinco capas que lo detiene.",
        "tags": '["OpenClaw", "Seguridad", "Inyección de Prompt", "ClawHavoc", "CVE-2026-25253", "ClawJacked", "Seguridad de Agentes", "Cadena de Suministro"]',
    },
    "pt-br-blog": {
        "title": "Segurança do OpenClaw em 2026: Ataques à Cadeia de Suprimentos, Taxas de Injeção de 91% e as Cinco Camadas Que Realmente os Impedem",
        "description": "135.000 instâncias do OpenClaw estavam publicamente acessíveis no início de fevereiro de 2026. 12.812 eram diretamente exploráveis via RCE. Taxa de sucesso de injeção de prompt na configuração padrão: 91%. Veja o que aconteceu, por que funcionou e a arquitetura de defesa de cinco camadas que impede isso.",
        "tags": '["OpenClaw", "Segurança", "Injeção de Prompt", "ClawHavoc", "CVE-2026-25253", "ClawJacked", "Segurança de Agentes", "Cadeia de Suprimentos"]',
    },
    "zh-tw-blog": {
        "title": "OpenClaw 2026 安全性：供應鏈攻擊、高達 91% 的注入成功率，以及有效阻止攻擊的五層防禦架構",
        "description": "2026 年 2 月初，有 135,000 個 OpenClaw 實例可被公開存取。其中 12,812 個可透過 RCE 直接利用。預設配置下的提示注入成功率高達 91%。本文將揭示事件的來龍去脈、攻擊得逞的原因，以及能夠阻止此類攻擊的五層防禦架構。",
        "tags": '["OpenClaw", "安全", "提示詞注入", "ClawHavoc", "CVE-2026-25253", "ClawJacked", "智能體安全", "供應鏈"]',
    },
}

COMMON = {
    "date": '"2026-03-01"',
    "author": '"AgentPuter Lab"',
    "readingTime": '"20 min"',
    "featured": "true",
}

FNAME = "15-openclaw-security.md"


def build_fm(lang):
    d = CORRECT_FM[lang]
    lines = ["---"]
    lines.append(f'title: "{d["title"]}"')
    lines.append(f'description: "{d["description"]}"')
    lines.append(f'date: {COMMON["date"]}')
    lines.append(f'author: {COMMON["author"]}')
    lines.append(f'readingTime: {COMMON["readingTime"]}')
    lines.append(f'tags: {d["tags"]}')
    lines.append(f'featured: {COMMON["featured"]}')
    lines.append("---")
    return "\n".join(lines)


def extract_body(content: str) -> str:
    """从内容中提取正文（去掉可能损坏的 frontmatter）"""
    # 移除前导垃圾（如 "Part 1/65\n\n"）
    content = re.sub(r'^Part \d+/\d+.*?\n+', '', content, flags=re.DOTALL)
    
    # 找到第一个 --- 的位置
    first_dash = content.find('---')
    if first_dash == -1:
        return content  # 没有 frontmatter，直接返回
    
    # 找到第二个 ---（frontmatter 结束）
    second_dash = content.find('---', first_dash + 3)
    if second_dash == -1:
        # 没有结束符，从 --- 之后提取所有内容
        # 但要跳过 frontmatter 行
        lines = content[first_dash+3:].strip().split('\n')
        # 跳过看起来像 YAML 的行（title:, description:, date:, etc.）
        body_lines = []
        in_fm = True
        for line in lines:
            if in_fm and re.match(r'^[a-z_]+:', line, re.IGNORECASE):
                continue
            else:
                in_fm = False
                body_lines.append(line)
        return '\n'.join(body_lines).strip()
    
    # 提取 frontmatter 结束后的正文
    body = content[second_dash + 3:].strip()
    
    # 检查是否有多个 --- 分隔符（损坏情况），跳过第一段垃圾
    # 比如 de-blog 的情况：--- 后面直接是 #\n
    if body.startswith('#\n') or body.startswith('\n#\n'):
        # 跳过第一个孤立的 # 行，找真正的内容
        body = re.sub(r'^#\n', '', body.lstrip('\n'))
    
    return body


def fix_file(lang):
    path = os.path.join(BASE, lang, FNAME)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    body = extract_body(content)
    new_fm = build_fm(lang)
    new_content = new_fm + "\n\n" + body
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"✓ Fixed {lang}/{FNAME}")


# 特殊修复：pt-br（只改 featured 字段名）
def fix_ptbr():
    path = os.path.join(BASE, "pt-br-blog", FNAME)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替换 destacado 为 featured
    content = content.replace('\ndestacado: true\n', '\nfeatured: true\n')
    # 也替换可能的 tags 翻译
    content = re.sub(r'\ntags: \[.*?\]\n', 
                     f'\ntags: {CORRECT_FM["pt-br-blog"]["tags"]}\n', 
                     content, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("✓ Fixed pt-br-blog/15-openclaw-security.md (destacado→featured)")


# 特殊修复：es-blog（改 etiquetas 和 dest 字段）
def fix_es():
    path = os.path.join(BASE, "es-blog", FNAME)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 重建整个 frontmatter
    body = extract_body(content)
    new_fm = build_fm("es-blog")
    new_content = new_fm + "\n\n" + body
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("✓ Fixed es-blog/15-openclaw-security.md")


if __name__ == "__main__":
    # 需要全量重建 frontmatter 的
    for lang in ["ko-blog", "fr-blog", "de-blog", "zh-tw-blog"]:
        fix_file(lang)
    
    fix_es()
    fix_ptbr()
    
    print("\n验证修复结果：")
    for lang in CORRECT_FM.keys():
        path = os.path.join(BASE, lang, FNAME)
        with open(path, 'r', encoding='utf-8') as f:
            head = f.read(500)
        has_date = 'date:' in head
        has_author = 'author:' in head
        has_featured = 'featured: true' in head
        has_tags = 'tags:' in head
        ok = has_date and has_author and has_featured and has_tags
        print(f"  {'✓' if ok else '✗'} {lang}: date={has_date} author={has_author} featured={has_featured} tags={has_tags}")
