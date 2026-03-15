#!/bin/bash
# ============================================================
# Multi-Agent Traffic Factory — 一键启动所有产线
# 用 tmux 管理 4 条并行 Agent 产线
# ============================================================
# 用法:
#   ./scripts/start_factory.sh          # 启动所有产线
#   ./scripts/start_factory.sh stop     # 停止所有产线
#   ./scripts/start_factory.sh status   # 查看状态
#   tmux attach -t factory              # 进入监控面板
# ============================================================

SESSION="factory"
DIR="/Users/mac/Desktop/AgentPuter"
TC_DIR="$DIR/tinyclaw"

case "${1:-start}" in
  stop)
    echo "⏹  停止所有产线..."
    tmux kill-session -t "$SESSION" 2>/dev/null && echo "✅ 已停止" || echo "没有运行中的产线"
    exit 0
    ;;
  status)
    if tmux has-session -t "$SESSION" 2>/dev/null; then
      echo "🟢 Factory 运行中"
      tmux list-windows -t "$SESSION" -F "  #{window_index}: #{window_name}"
      echo ""
      echo "📊 产出统计:"
      echo "  EN blog: $(ls $DIR/src/content/blog/*.md 2>/dev/null | wc -l | tr -d ' ') 篇"
      echo "  Tools:   $(ls $TC_DIR/src/tools/*.tsx 2>/dev/null | wc -l | tr -d ' ') 个"
      for d in zh ja ko fr de es pt-br ru zh-tw; do
        echo "  $d: $(ls $DIR/src/content/$d-blog/*.md 2>/dev/null | wc -l | tr -d ' ') 篇"
      done
    else
      echo "🔴 Factory 未运行"
    fi
    exit 0
    ;;
  content)
    echo "🚀 仅启动内容产线 (不含工具站)..."
    CONTENT_ONLY=1
    ;;
esac

# 如果已经在运行，先停止
tmux kill-session -t "$SESSION" 2>/dev/null

echo "🚀 启动 Multi-Agent Traffic Factory..."
echo "   模型: Gemini 2.5 Pro (内容) + Gemini 3 Flash (评审/翻译)"
echo ""

# ============================================================
# 产线 A: 内容生成 (3 个并行 Agent)
# ============================================================

# A1: How-to 教程 (25 篇)
tmux new-session -d -s "$SESSION" -n "A1-howto" -c "$DIR"
tmux send-keys -t "$SESSION:A1-howto" \
  "echo '📝 A1: How-to 教程 (25 篇)' && python3 scripts/content_factory.py --category howto --batch 25 --interval 20" Enter

# A2: 对比 + 用例 (35 篇，串行两类)
tmux new-window -t "$SESSION" -n "A2-compare" -c "$DIR"
tmux send-keys -t "$SESSION:A2-compare" \
  "echo '📝 A2: 对比/用例文章' && sleep 30 && python3 scripts/content_factory.py --category comparison --batch 15 --interval 20 && python3 scripts/content_factory.py --category usecase --batch 20 --interval 20" Enter

# A3: 技术 + 工具指南 + 趋势 (45 篇，串行三类)
tmux new-window -t "$SESSION" -n "A3-tech" -c "$DIR"
tmux send-keys -t "$SESSION:A3-tech" \
  "echo '📝 A3: 技术/指南/趋势' && sleep 60 && python3 scripts/content_factory.py --category technical --batch 15 --interval 20 && python3 scripts/content_factory.py --category tools_guide --batch 15 --interval 20 && python3 scripts/content_factory.py --category trends --batch 15 --interval 20" Enter

# ============================================================
# 产线 B: 翻译 (1 个 Agent, watch 模式)
# ============================================================

tmux new-window -t "$SESSION" -n "B-translate" -c "$DIR"
tmux send-keys -t "$SESSION:B-translate" \
  "echo '🌍 B: 翻译 9 语言 (watch)' && sleep 300 && python3 scripts/translate_factory.py --watch --interval 180" Enter

# ============================================================
# 产线 C: 工具站自测 + 部署 (1 个 Agent)
# ============================================================

tmux new-window -t "$SESSION" -n "C-test" -c "$DIR"
tmux send-keys -t "$SESSION:C-test" \
  "echo '🔧 C: 工具站自测 Agent' && python3 scripts/tools_test_agent.py --deploy 2>&1 | tee reports/tools_test_latest.log" Enter

# ============================================================
# 监控面板
# ============================================================

tmux new-window -t "$SESSION" -n "monitor" -c "$DIR"
tmux send-keys -t "$SESSION:monitor" \
  "watch -n 30 'echo \"══════════════════════════════════════\" && echo \"  Multi-Agent Traffic Factory Monitor\" && echo \"══════════════════════════════════════\" && echo \"\" && echo \"📝 Content Pipeline\" && echo \"  EN blog: \$(ls src/content/blog/*.md 2>/dev/null | wc -l) articles\" && echo \"\" && echo \"🌍 Translation Pipeline\" && for d in zh ja ko fr de es pt-br ru zh-tw; do cnt=\$(ls src/content/\$d-blog/*.md 2>/dev/null | wc -l); printf \"  %-6s %s articles\n\" \$d: \$cnt; done && echo \"\" && echo \"🔧 Tools: \$(ls tinyclaw/src/tools/*.tsx 2>/dev/null | wc -l) components\" && echo \"\" && echo \"📄 Latest articles:\" && ls -t src/content/blog/*.md 2>/dev/null | head -5 | while read f; do echo \"  \$(basename \$f)\"; done'" Enter

echo "✅ Factory 已启动！5 条产线 + 1 个监控面板"
echo ""
echo "📊 管理命令:"
echo "   tmux attach -t factory             进入面板"
echo "   Ctrl+B → 0-5                       切换窗口"
echo "   ./scripts/start_factory.sh status   查看统计"
echo "   ./scripts/start_factory.sh stop     停止所有"
echo ""
echo "🖥  产线架构:"
echo "   ┌─ A1-howto    📝 How-to 教程 (25篇)"
echo "   ├─ A2-compare  📝 对比/用例 (35篇)"
echo "   ├─ A3-tech     📝 技术/指南/趋势 (45篇)"
echo "   ├─ B-translate 🌍 9语言自动翻译 (watch)"
echo "   ├─ C-test      🔧 工具站自测→部署 (22个工具)"
echo "   └─ monitor     📊 实时统计面板"
echo ""
echo "📐 质量保障:"
echo "   内容: 生成 → Flash 评审 (≥35/50) → 不通过重写 → 最多3轮"
echo "   工具: Build → 页面加载 → AI API → 报告 → 自动部署"
echo ""
echo "📊 单独运行自测:"
echo "   python3 scripts/tools_test_agent.py              # 完整测试"
echo "   python3 scripts/tools_test_agent.py --ai-only    # 只测 AI 工具"
echo "   python3 scripts/tools_test_agent.py --tool json-formatter  # 测单个"
echo "   python3 scripts/tools_test_agent.py --deploy     # 通过后自动部署"
