#!/usr/bin/env python3
"""
Universal image generation for OpenClaw (TinyClaw).

Backend auto-detection order:
  1. Vertex AI Gemini Image  → if GOOGLE_APPLICATION_CREDENTIALS is set (Gemini users)
  2. OpenAI DALL-E 3         → if OPENAI_API_KEY is set (Claude / GPT users)

Output:
  IMAGE_URL: https://...   (public HTTPS URL for WebChat inline rendering)
  MEDIA: /path/to/file     (local file for Telegram / Discord / WhatsApp attachment)

Usage:
  python3 generate_image_unified.py --prompt "描述" --filename "output.png" [--resolution 1K|2K|4K]
"""

import argparse
import os
import sys
from pathlib import Path

# WebChat 上传图片的最大宽度（px），避免图片撑出聊天气泡
WEBCHAT_MAX_WIDTH = 560
GCS_MEDIA_BUCKET = os.environ.get("GCS_MEDIA_BUCKET", "tinyclaw-media")


# ── 工具函数 ──────────────────────────────────────────────────────────────────

def resize_for_webchat(local_path: Path, max_width: int = WEBCHAT_MAX_WIDTH) -> Path:
    """等比缩放到 max_width，返回缩略图路径（若已够小则返回原路径）。"""
    try:
        from PIL import Image as PILImage
        img = PILImage.open(local_path)
        w, h = img.size
        if w <= max_width:
            return local_path
        new_h = int(h * max_width / w)
        resized = img.resize((max_width, new_h), PILImage.LANCZOS)
        thumb = local_path.parent / f"thumb_{local_path.name}"
        resized.save(str(thumb), "PNG", optimize=True)
        print(f"Resized to {max_width}x{new_h} for WebChat display")
        return thumb
    except Exception as e:
        print(f"Resize skipped: {e}", file=sys.stderr)
        return local_path


def upload_to_public_url(local_path: Path, project: str = "") -> str | None:
    """上传缩略图到公开 URL（GCS 优先，fallback catbox.moe）。"""
    thumb = resize_for_webchat(local_path)

    # 1. GCS
    try:
        from google.cloud import storage
        import time
        client = storage.Client(project=project) if project else storage.Client()
        bucket = client.bucket(GCS_MEDIA_BUCKET)
        blob_name = f"generated/{int(time.time())}-{thumb.name}"
        blob = bucket.blob(blob_name)
        blob.upload_from_filename(str(thumb), content_type="image/png")
        url = f"https://storage.googleapis.com/{GCS_MEDIA_BUCKET}/{blob_name}"
        print(f"Uploaded to GCS: {url}")
        return url
    except Exception as e:
        print(f"GCS unavailable ({type(e).__name__}), trying fallback...", file=sys.stderr)

    # 2. catbox.moe（无需账号，永久 HTTPS）
    try:
        import urllib.request
        with open(thumb, "rb") as f:
            data = f.read()
        boundary = "----TinyclawBoundary7MA4YWxk"
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="reqtype"\r\n\r\nfileupload\r\n'
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="fileToUpload"; filename="{thumb.name}"\r\n'
            f"Content-Type: image/png\r\n\r\n"
        ).encode() + data + f"\r\n--{boundary}--\r\n".encode()
        req = urllib.request.Request(
            "https://catbox.moe/user/api.php", data=body,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}",
                     "User-Agent": "OpenClaw-ImageSkill/1.0"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            url = resp.read().decode().strip()
        if url.startswith("https://"):
            print(f"Uploaded to catbox: {url}")
            return url
    except Exception as e:
        print(f"Catbox upload failed: {e}", file=sys.stderr)

    return None


def save_image_bytes(data: bytes, output_path: Path) -> None:
    """把 bytes 保存为 PNG。优先用 PIL 转 RGB，无 PIL 则直接写文件。"""
    try:
        from PIL import Image as PILImage
        from io import BytesIO
        img = PILImage.open(BytesIO(data))
        if img.mode == "RGBA":
            bg = PILImage.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            bg.save(str(output_path), "PNG")
        else:
            img.convert("RGB").save(str(output_path), "PNG")
    except ImportError:
        # PIL 未安装时直接写原始字节（DALL-E 3 返回标准 PNG，可直接保存）
        output_path.write_bytes(data)


# ── 后端 1：Vertex AI Gemini Image ───────────────────────────────────────────

def _setup_vertex_credentials() -> tuple[str, str]:
    """
    自动发现并配置 Vertex AI 凭证。
    检查顺序：
      1. GOOGLE_APPLICATION_CREDENTIALS 环境变量（新容器已指向 /opt/tc/）
      2. /opt/tc/gcp-sa.json（安全目录，工作区外，AI 无法读取）
      3. /root/.openclaw/.gcp-sa.json（旧路径，兼容存量容器）
    返回 (project, location) 元组，失败时返回 ("", "")。
    """
    sa_candidates = [
        os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", ""),
        "/opt/tc/gcp-sa.json",
        "/root/.openclaw/.gcp-sa.json",  # 兼容旧容器，待迁移后移除
    ]
    for sa_path in sa_candidates:
        if sa_path and Path(sa_path).exists():
            # 确保环境变量已设置（google-genai SDK 会读取它）
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = sa_path
            break
    else:
        return "", ""  # 没有可用的 SA JSON

    # 解析项目 ID：优先环境变量，其次从 SA JSON 文件读取
    project = os.environ.get("GOOGLE_CLOUD_PROJECT") or os.environ.get("GCLOUD_PROJECT", "")
    if not project:
        try:
            import json
            sa_data = json.loads(Path(os.environ["GOOGLE_APPLICATION_CREDENTIALS"]).read_text())
            project = sa_data.get("project_id", "")
        except Exception:
            pass
    location = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")
    return project, location


def generate_vertex(prompt: str, output_path: Path, resolution: str,
                    input_images: list) -> bool:
    """使用 Vertex AI（SA JSON 认证）生成图片，成功返回 True。"""
    project, location = _setup_vertex_credentials()
    if not project:
        return False

    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    print(f"Generating image via Vertex AI (project={project}, location={location})...")
    client = genai.Client(vertexai=True, project=project, location=location)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 加载输入图片
    pil_inputs = []
    if input_images:
        for p in input_images[:14]:
            pil_inputs.append(PILImage.open(p))

    contents = [*pil_inputs, prompt] if pil_inputs else prompt
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
            image_config=types.ImageConfig(image_size=resolution),
        ),
    )
    for part in response.parts:
        if part.text:
            print(f"Model response: {part.text[:120]}")
        elif part.inline_data:
            import base64
            raw = part.inline_data.data
            if isinstance(raw, str):
                raw = base64.b64decode(raw)
            save_image_bytes(raw, output_path)
            return True
    return False


# ── 后端 2：OpenAI DALL-E 3 ──────────────────────────────────────────────────

def _get_openai_key() -> str:
    """从文件或环境变量中读取 OPENAI_API_KEY（优先安全路径）。"""
    # 优先检查安全目录（工作区外，AI 无法访问）
    for key_file in [Path("/opt/tc/openai.key"), Path("/root/.openclaw/.openai-key")]:
        if key_file.exists():
            return key_file.read_text().strip()
    # fallback：环境变量（旧容器兼容）
    return os.environ.get("OPENAI_API_KEY", "")


def generate_openai(prompt: str, output_path: Path, resolution: str) -> bool:
    """使用 OpenAI DALL-E 3 生成图片，成功返回 True。"""
    api_key = _get_openai_key()
    if not api_key:
        return False

    # 分辨率映射（DALL-E 3 支持 1024x1024 / 1792x1024 / 1024x1792）
    size_map = {"1K": "1024x1024", "2K": "1792x1024", "4K": "1792x1024"}
    size = size_map.get(resolution, "1024x1024")

    print(f"Generating image via OpenAI DALL-E 3 (size={size})...")
    import urllib.request, urllib.error, json, base64

    payload = json.dumps({
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": size,
        "response_format": "b64_json",
    }).encode()

    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read())
        b64 = result["data"][0]["b64_json"]
        raw = base64.b64decode(b64)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        save_image_bytes(raw, output_path)
        # 打印 revised_prompt（DALL-E 3 会重写 prompt）
        revised = result["data"][0].get("revised_prompt", "")
        if revised:
            print(f"DALL-E revised prompt: {revised[:100]}")
        return True
    except urllib.error.HTTPError as e:
        print(f"OpenAI API error {e.code}: {e.read().decode()[:200]}", file=sys.stderr)
        return False


# ── 主函数 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate images (Vertex AI or DALL-E 3)")
    parser.add_argument("--prompt", "-p", required=True)
    parser.add_argument("--filename", "-f", required=True)
    parser.add_argument("--input-image", "-i", action="append", dest="input_images",
                        metavar="IMAGE", default=[])
    parser.add_argument("--resolution", "-r", choices=["1K", "2K", "4K"], default="1K")
    args = parser.parse_args()

    output_path = Path(args.filename)
    project = os.environ.get("GOOGLE_CLOUD_PROJECT", "")

    # 后端优先级：Vertex AI（所有用户）→ OpenAI DALL-E 3（fallback）
    success = False
    # 检查 GOOGLE_APPLICATION_CREDENTIALS 或标准 SA JSON 文件路径
    vertex_available = (
        bool(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")) or
        Path("/root/.openclaw/.gcp-sa.json").exists()
    )
    if vertex_available:
        try:
            success = generate_vertex(args.prompt, output_path, args.resolution, args.input_images)
        except Exception as e:
            print(f"Vertex AI failed: {e}", file=sys.stderr)

    if not success:
        try:
            success = generate_openai(args.prompt, output_path, args.resolution)
        except Exception as e:
            print(f"OpenAI DALL-E 3 failed: {e}", file=sys.stderr)

    if not success:
        print("Error: No image backend available. Need GOOGLE_APPLICATION_CREDENTIALS or OPENAI_API_KEY.",
              file=sys.stderr)
        sys.exit(1)

    full_path = output_path.resolve()
    print(f"\nImage saved: {full_path}")

    # 上传缩略图供 WebChat 内联显示
    public_url = upload_to_public_url(full_path, project)
    if public_url:
        print(f"IMAGE_URL: {public_url}")

    # Telegram/Discord/WhatsApp 渠道附图
    print(f"MEDIA: {full_path}")


if __name__ == "__main__":
    main()
