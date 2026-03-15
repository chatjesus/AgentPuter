#!/bin/bash
# 将本地 skills/ 目录同步到 VPS 构建上下文，并重建 openclaw-tc 镜像
# 用法：bash scripts/sync-skills-and-rebuild.sh
set -e

SKILLS_SRC="$(dirname "$0")/../../skills"
VPS_HOST="${SHARED_VPS_HOST:-178.156.252.255}"
VPS_PASS="${SHARED_VPS_PASSWORD}"
VPS_BUILD_DIR="/root/tc-build"

if [ -z "$VPS_PASS" ]; then
  # 从 .env.local 读取
  ENV_FILE="$(dirname "$0")/../.env.local"
  VPS_PASS=$(grep '^SHARED_VPS_PASSWORD=' "$ENV_FILE" 2>/dev/null | cut -d= -f2-)
fi

if [ -z "$VPS_PASS" ]; then
  echo "Error: SHARED_VPS_PASSWORD not set and not found in .env.local"
  exit 1
fi

echo "==> Syncing Dockerfile.tc to VPS..."
sshpass -p "$VPS_PASS" scp -o StrictHostKeyChecking=no \
  "$(dirname "$0")/../Dockerfile.tc" \
  "root@$VPS_HOST:$VPS_BUILD_DIR/Dockerfile.tc"

echo "==> Syncing skill files to VPS..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "root@$VPS_HOST" \
  "rm -rf $VPS_BUILD_DIR/skills && mkdir -p $VPS_BUILD_DIR/skills"

for SKILL_DIR in "$SKILLS_SRC"/*/; do
  SKILL_NAME=$(basename "$SKILL_DIR")
  echo "    Uploading skill: $SKILL_NAME"
  sshpass -p "$VPS_PASS" scp -o StrictHostKeyChecking=no -r \
    "$SKILL_DIR" \
    "root@$VPS_HOST:$VPS_BUILD_DIR/skills/$SKILL_NAME"
done

echo "==> Building openclaw-tc:latest on VPS..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "root@$VPS_HOST" \
  "docker build -f $VPS_BUILD_DIR/Dockerfile.tc -t openclaw-tc:latest $VPS_BUILD_DIR/ 2>&1"

echo "==> Syncing platform-skills directory on VPS host..."
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "root@$VPS_HOST" \
  "rm -rf /opt/tinyclaw/platform-skills && mkdir -p /opt/tinyclaw/platform-skills && docker run --rm -v /opt/tinyclaw/platform-skills:/target openclaw-tc:latest sh -c 'cp -r /opt/tc/skills/. /target/'"

echo ""
echo "Done! openclaw-tc:latest rebuilt with latest skills."
echo "VPS platform-skills directory updated — new user containers will get the skills."
