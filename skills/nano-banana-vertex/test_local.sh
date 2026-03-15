#!/bin/bash
# 本地测试脚本 — 在 Mac 上直接跑，不影响任何线上服务
# 使用前提：本机已有 Vertex AI SA JSON 文件（从 vps/create/route.ts 的环境变量解码即可）
#
# 使用方式：
#   1. 解码 SA JSON（如果你只有 base64 版本）：
#      echo "$GOOGLE_VERTEX_SA_JSON_B64" | base64 -d > /tmp/gcp-sa.json
#
#   2. 运行测试：
#      bash test_local.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── 配置区（修改这里）──────────────────────────────────────────
SA_JSON_PATH="${GOOGLE_APPLICATION_CREDENTIALS:-/tmp/gcp-sa.json}"
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-tinyclaw-prod}"
LOCATION="${GOOGLE_CLOUD_LOCATION:-global}"
OUTPUT_FILE="/tmp/test-vertex-image-$(date +%Y%m%d-%H%M%S).png"
TEST_PROMPT="A cute cartoon lobster holding a laptop, flat design, vibrant colors"
# ────────────────────────────────────────────────────────────────

echo "=== Nano Banana Vertex — 本地测试 ==="
echo "SA JSON : $SA_JSON_PATH"
echo "Project : $PROJECT_ID"
echo "Location: $LOCATION"
echo "Output  : $OUTPUT_FILE"
echo "Prompt  : $TEST_PROMPT"
echo ""

# 检查 SA JSON 是否存在
if [ ! -f "$SA_JSON_PATH" ]; then
    echo "❌ SA JSON 文件不存在: $SA_JSON_PATH"
    echo ""
    echo "解码方法（需要 .env.local 里的 GOOGLE_VERTEX_SA_JSON_B64）："
    echo "  source tinyclaw/.env.local"
    echo "  echo \"\$GOOGLE_VERTEX_SA_JSON_B64\" | base64 -d > /tmp/gcp-sa.json"
    exit 1
fi

# 检查 uv 是否安装
if ! command -v uv &> /dev/null; then
    echo "❌ uv 未安装，请先运行："
    echo "  brew install uv"
    exit 1
fi

echo "✓ 依赖检查通过，开始生成图片..."
echo ""

GOOGLE_APPLICATION_CREDENTIALS="$SA_JSON_PATH" \
GOOGLE_CLOUD_PROJECT="$PROJECT_ID" \
GOOGLE_CLOUD_LOCATION="$LOCATION" \
uv run "$SCRIPT_DIR/scripts/generate_image_vertex.py" \
    --prompt "$TEST_PROMPT" \
    --filename "$OUTPUT_FILE" \
    --resolution 1K

echo ""
echo "=== 测试完成 ==="
echo "图片位置: $OUTPUT_FILE"

# macOS 自动预览
if [ -f "$OUTPUT_FILE" ]; then
    echo "用 Preview 打开..."
    open "$OUTPUT_FILE"
fi
