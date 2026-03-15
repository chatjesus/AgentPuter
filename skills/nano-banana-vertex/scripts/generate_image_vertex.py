#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "google-genai>=1.0.0",
#   "google-cloud-aiplatform>=1.60.0",
#   "google-cloud-storage>=2.0.0",
#   "pillow>=10.0.0",
# ]
# ///
"""
Generate images using Gemini 3 Pro Image via Vertex AI (SA JSON auth).
After generation, the image is automatically uploaded to GCS for WebChat inline display.

Usage:
  python3 generate_image_vertex.py --prompt "your image description" --filename "output.png" [--resolution 1K|2K|4K]

Multi-image editing (up to 14 images):
  python3 generate_image_vertex.py --prompt "combine these" --filename "output.png" -i img1.png -i img2.png

Auth: reads GOOGLE_APPLICATION_CREDENTIALS (SA JSON) + GOOGLE_CLOUD_PROJECT + GOOGLE_CLOUD_LOCATION
      from environment. No GEMINI_API_KEY needed.
"""

import argparse
import os
import sys
from pathlib import Path

# GCS 公开 bucket，用于 WebChat 图片直链显示
GCS_MEDIA_BUCKET = os.environ.get("GCS_MEDIA_BUCKET", "tinyclaw-media")


def upload_image_to_public_url(local_path: Path, project: str) -> str | None:
    """上传图片到公开 URL，优先 GCS，fallback 到匿名图床。失败时返回 None。"""
    # 为 WebChat 显示创建缩略版（max 560px），适配聊天气泡宽度
    upload_path = _resize_for_webchat(local_path, max_width=560)
    # 优先尝试 GCS（如果 bucket 存在且 SA 有权限）
    gcs_url = _try_upload_gcs(upload_path, project)
    if gcs_url:
        return gcs_url
    # Fallback：catbox.moe 匿名图床（无需账号，永久存储）
    return _try_upload_catbox(upload_path)


def _resize_for_webchat(local_path: Path, max_width: int = 800) -> Path:
    """将图片缩放到最大宽度以适配 WebChat 显示，返回缩略图路径。"""
    try:
        from PIL import Image as PILImage

        img = PILImage.open(local_path)
        w, h = img.size
        if w <= max_width:
            return local_path  # 已经足够小，直接用原图
        # 等比缩放
        new_h = int(h * max_width / w)
        resized = img.resize((max_width, new_h), PILImage.LANCZOS)
        thumb_path = local_path.parent / f"thumb_{local_path.name}"
        resized.save(str(thumb_path), "PNG", optimize=True)
        print(f"Resized to {max_width}x{new_h} for web display")
        return thumb_path
    except Exception as e:
        print(f"Resize skipped: {e}", file=sys.stderr)
        return local_path


def _try_upload_gcs(local_path: Path, project: str) -> str | None:
    """上传到 GCS tinyclaw-media bucket。"""
    try:
        from google.cloud import storage
        import time

        client = storage.Client(project=project)
        bucket = client.bucket(GCS_MEDIA_BUCKET)
        blob_name = f"generated/{int(time.time())}-{local_path.name}"
        blob = bucket.blob(blob_name)
        blob.upload_from_filename(str(local_path), content_type="image/png")
        public_url = f"https://storage.googleapis.com/{GCS_MEDIA_BUCKET}/{blob_name}"
        print(f"Uploaded to GCS: {public_url}")
        return public_url
    except Exception as e:
        print(f"GCS unavailable ({type(e).__name__}), trying fallback...", file=sys.stderr)
        return None


def _try_upload_catbox(local_path: Path) -> str | None:
    """上传到 catbox.moe 匿名图床（fallback）。"""
    try:
        import urllib.request
        import urllib.parse

        with open(local_path, "rb") as f:
            image_data = f.read()

        # 构造 multipart/form-data
        boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
        filename = local_path.name
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="reqtype"\r\n\r\nfileupload\r\n'
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="fileToUpload"; filename="{filename}"\r\n'
            f"Content-Type: image/png\r\n\r\n"
        ).encode() + image_data + f"\r\n--{boundary}--\r\n".encode()

        req = urllib.request.Request(
            "https://catbox.moe/user/api.php",
            data=body,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
            method="POST",
        )
        req.add_header("User-Agent", "OpenClaw-ImageSkill/1.0")
        with urllib.request.urlopen(req, timeout=15) as resp:
            url = resp.read().decode().strip()
        if url.startswith("https://"):
            print(f"Uploaded to catbox: {url}")
            return url
        return None
    except Exception as e:
        print(f"Catbox upload failed: {e}", file=sys.stderr)
        return None


def get_vertex_config() -> tuple[str, str]:
    """从环境变量读取 Vertex AI 配置，缺少则报错退出。"""
    project = os.environ.get("GOOGLE_CLOUD_PROJECT") or os.environ.get("GCLOUD_PROJECT")
    location = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")
    creds = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

    if not project:
        print("Error: GOOGLE_CLOUD_PROJECT environment variable is required.", file=sys.stderr)
        sys.exit(1)
    if not creds:
        print("Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is required.", file=sys.stderr)
        print("       Point it to the GCP service account JSON file.", file=sys.stderr)
        sys.exit(1)
    if not Path(creds).exists():
        print(f"Error: SA JSON file not found: {creds}", file=sys.stderr)
        sys.exit(1)

    return project, location


def main():
    parser = argparse.ArgumentParser(
        description="Generate images via Gemini 3 Pro Image on Vertex AI"
    )
    parser.add_argument("--prompt", "-p", required=True, help="Image description/prompt")
    parser.add_argument("--filename", "-f", required=True, help="Output filename (e.g., output.png)")
    parser.add_argument(
        "--input-image", "-i",
        action="append",
        dest="input_images",
        metavar="IMAGE",
        help="Input image path(s) for editing. Can be specified multiple times (up to 14).",
    )
    parser.add_argument(
        "--resolution", "-r",
        choices=["1K", "2K", "4K"],
        default="1K",
        help="Output resolution: 1K (default), 2K, or 4K",
    )
    args = parser.parse_args()

    project, location = get_vertex_config()

    # google-genai >= 1.0 支持 vertexai=True 模式，直接使用 ADC（SA JSON）认证
    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    client = genai.Client(
        vertexai=True,
        project=project,
        location=location,
    )

    output_path = Path(args.filename)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 加载输入图片（最多 14 张）
    input_images = []
    output_resolution = args.resolution
    if args.input_images:
        if len(args.input_images) > 14:
            print(f"Error: Too many input images ({len(args.input_images)}). Maximum is 14.", file=sys.stderr)
            sys.exit(1)

        max_input_dim = 0
        for img_path in args.input_images:
            try:
                img = PILImage.open(img_path)
                input_images.append(img)
                print(f"Loaded input image: {img_path}")
                width, height = img.size
                max_input_dim = max(max_input_dim, width, height)
            except Exception as e:
                print(f"Error loading input image '{img_path}': {e}", file=sys.stderr)
                sys.exit(1)

        # 根据输入图片最大边长自动推断输出分辨率
        if args.resolution == "1K" and max_input_dim > 0:
            if max_input_dim >= 3000:
                output_resolution = "4K"
            elif max_input_dim >= 1500:
                output_resolution = "2K"
            else:
                output_resolution = "1K"
            print(f"Auto-detected resolution: {output_resolution} (max input dim {max_input_dim}px)")

    if input_images:
        contents = [*input_images, args.prompt]
        print(f"Processing {len(input_images)} image(s) at {output_resolution}...")
    else:
        contents = args.prompt
        print(f"Generating image at {output_resolution} via Vertex AI (project={project}, location={location})...")

    try:
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(image_size=output_resolution),
            ),
        )

        image_saved = False
        for part in response.parts:
            if part.text is not None:
                print(f"Model response: {part.text}")
            elif part.inline_data is not None:
                from io import BytesIO

                image_data = part.inline_data.data
                if isinstance(image_data, str):
                    import base64
                    image_data = base64.b64decode(image_data)

                image = PILImage.open(BytesIO(image_data))

                if image.mode == "RGBA":
                    rgb = PILImage.new("RGB", image.size, (255, 255, 255))
                    rgb.paste(image, mask=image.split()[3])
                    rgb.save(str(output_path), "PNG")
                elif image.mode == "RGB":
                    image.save(str(output_path), "PNG")
                else:
                    image.convert("RGB").save(str(output_path), "PNG")
                image_saved = True

        if image_saved:
            full_path = output_path.resolve()
            print(f"\nImage saved: {full_path}")

            # 上传到公开 URL，生成可在 WebChat 直接渲染的 https:// URL
            public_url = upload_image_to_public_url(full_path, project)
            if public_url:
                # WebChat 前端识别 https:// 会渲染成 <img>
                print(f"IMAGE_URL: {public_url}")

            # OpenClaw 解析 MEDIA: 标记并在 Telegram/Discord/WhatsApp 渠道自动附图
            print(f"MEDIA: {full_path}")
        else:
            print("Error: No image was generated in the response.", file=sys.stderr)
            sys.exit(1)

    except Exception as e:
        print(f"Error generating image: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
