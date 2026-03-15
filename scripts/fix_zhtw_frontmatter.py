"""
修复 zh-tw-blog 文件中损坏的 frontmatter
"""
import re, os

BASE = "/Users/mac/Desktop/AgentPuter/src/content"

# 每个文件的正确 frontmatter 数据
FILES_TO_FIX = {
    "13-soul-md.md": {
        "title": "給你的 Agent 注入靈魂：SOUL.md、IDENTITY.md 和 USER.md 架構指南",
        "description": "為什麼這三個檔案是你 OpenClaw 設定中最重要的一環——以及怎麼寫才能讓你的 Agent 不再像個通用聊天機器人。",
        "date": "2026-02-20",
        "author": "AgentPuter Lab",
        "readingTime": "6 分鐘",
        "tags": '["OpenClaw", "SOUL.md", "IDENTITY.md", "USER.md", "Agent 個性化", "提示詞工程"]',
        "featured": "false",
    },
    "agent-needs-its-own-computer.md": {
        "title": "軟體變革前夜，你的 Agent 需要一台 AgentPuter",
        "description": "AI Agent 能力越來越強——但它沒有家、沒有持久化工作區、沒有屬於它的電腦。AgentPuter 改變這一切。",
        "date": "2026-02-04",
        "author": "AgentPuter Lab",
        "readingTime": "15 分鐘",
        "tags": '["AI Agent", "AgentPuter", "軟體變革", "OpenClaw", "Claude"]',
        "featured": "false",
    },
    "deep-dive-clawdbot-breakout-agent.md": {
        "title": "深度拆解 Clawdbot：2026 年第一個現象級 AI Agent 產品",
        "description": "18 萬 GitHub Stars、三次改名、1600 萬美元假幣騙局、Mac mini 賣斷貨——一個開源「數位生命」如何在幾週內重寫了整個 AI Agent 賽道的敘事。",
        "date": "2026-02-14",
        "author": "AgentPuter Lab",
        "readingTime": "20 分鐘",
        "tags": '["OpenClaw", "AI Agent", "Agent Computer", "AgentPuter", "Clawdbot", "Mac mini"]',
        "featured": "false",
    },
    "dissecting-openclaw-architecture.md": {
        "title": "解剖 OpenClaw：174K Stars 背後的設計哲學與致命缺陷",
        "description": "Brain-Body-Soul 架構、1,100 個暴露連接埠，以及 AI Agent 基礎設施真正需要什麼。",
        "date": "2026-02-05",
        "author": "AgentPuter Lab",
        "readingTime": "15 分鐘",
        "tags": '["OpenClaw", "AI Agent", "架構", "安全", "Brain-Body-Soul", "AgentPuter"]',
        "featured": "false",
    },
    "14-openclaw-tips.md": {
        "title": "OpenClaw 進階手冊：30 個沒人告訴你的使用技巧",
        "description": "maxSpawnDepth 預設值是 1，不是無限。SOUL.md 對子 Agent 不可見。cleanup 預設保留所有檔案。30 條來自真實生產環境的配置技巧，縮短「能跑」和「配置正確」之間的距離。",
        "date": "2026-02-21",
        "author": "AgentPuter Lab",
        "readingTime": "18 min",
        "tags": '["OpenClaw", "配置優化", "Sub-Agent", "Skill", "成本控制", "安全", "實戰技巧"]',
        "featured": "true",
    },
    "15-perplexity-computer-vs-openclaw.md": {
        "title": "Perplexity 打造的功能，正是 OpenClaw 使用者早已自行運行的架構",
        "description": "2 月 25 日，Perplexity 推出了 Computer——一個雲端 AI，能調度 19 種模型、平行運行子代理人並自主執行任務，月費 200 美元。本文說明 OpenClaw 使用者已擁有什麼、還差什麼，以及這對代理人平台競賽意味著什麼。",
        "date": "2026-02-28",
        "author": "AgentPuter Lab",
        "readingTime": "14 min",
        "tags": '["OpenClaw", "Perplexity", "AI Agent", "Multi-Agent", "Agent Platform"]',
        "featured": "true",
    },
}


def extract_body_after_fm(content: str) -> str:
    """提取 frontmatter 之后的正文内容"""
    # 找第一个 ---
    start = content.find('---')
    if start == -1:
        return content
    
    # 找到 frontmatter 结束（第二个 ---）
    # 但要确保不是 HR 分隔线（通常 frontmatter 中的字段不会单独一行只有 ---）
    # 找到 title: 之后的第一个 --- 作为 frontmatter 结束
    title_pos = content.find('title:', start)
    if title_pos == -1:
        return content
    
    # 从 title 行开始找下一个单独的 ---
    search_from = title_pos
    while True:
        next_sep = content.find('\n---', search_from)
        if next_sep == -1:
            # 没有找到结束符，把整个剩余内容当作 body
            # 跳过 frontmatter 行
            lines = content[start+3:].strip().split('\n')
            body_lines = []
            in_fm = True
            for line in lines:
                if in_fm:
                    if re.match(r'^[a-zA-Z_]+:', line):
                        continue
                    elif line.strip() == '':
                        continue
                    else:
                        in_fm = False
                        body_lines.append(line)
                else:
                    body_lines.append(line)
            return '\n'.join(body_lines).strip()
        
        # 检查这个 --- 后面是不是紧跟换行（真正的分隔符）
        after = content[next_sep+4:next_sep+10]
        # 如果下一行是空行或者是 # 开头（标题），则是真正的 frontmatter 结束
        if after.strip() == '' or after.lstrip().startswith('#') or after.lstrip().startswith('\n'):
            return content[next_sep+4:].strip()
        search_from = next_sep + 4


def build_frontmatter(data: dict) -> str:
    lines = ["---"]
    lines.append(f'title: "{data["title"]}"')
    lines.append(f'description: "{data["description"]}"')
    lines.append(f'date: "{data["date"]}"')
    lines.append(f'author: "{data["author"]}"')
    lines.append(f'readingTime: "{data["readingTime"]}"')
    lines.append(f'tags: {data["tags"]}')
    lines.append(f'featured: {data["featured"]}')
    lines.append("---")
    return '\n'.join(lines)


def fix_file(fname, data):
    path = os.path.join(BASE, "zh-tw-blog", fname)
    if not os.path.exists(path):
        print(f"  ✗ Not found: {path}")
        return
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    body = extract_body_after_fm(content)
    fm = build_frontmatter(data)
    new_content = fm + "\n\n" + body + "\n"
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"  ✓ Fixed: zh-tw-blog/{fname}")


if __name__ == "__main__":
    print("修复 zh-tw-blog frontmatter...")
    for fname, data in FILES_TO_FIX.items():
        fix_file(fname, data)
    
    print("\n验证：")
    for fname in FILES_TO_FIX:
        path = os.path.join(BASE, "zh-tw-blog", fname)
        with open(path) as f:
            content = f.read()
        # 简单检查
        fm_end = content.find('\n---\n', 3)
        if fm_end > 0:
            fm = content[3:fm_end]
            ok = all(k in fm for k in ['title:', 'description:', 'date:', 'author:', 'tags:', 'featured:'])
            print(f"  {'✓' if ok else '✗'} {fname}: {'OK' if ok else 'STILL BROKEN'}")
        else:
            print(f"  ✗ {fname}: No frontmatter end found")
