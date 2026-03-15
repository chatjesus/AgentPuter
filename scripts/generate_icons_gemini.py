#!/usr/bin/env python3
"""
用 Gemini 3 Pro Image (Vertex AI) 生成 TinyClaw 图标变体
Model: gemini-3-pro-image-preview
"""

import os
import base64
import json
from pathlib import Path

# ─── 路径配置 ─────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
ROOT_DIR     = SCRIPT_DIR.parent
CRED_FILE    = ROOT_DIR / "credentials" / "pdfconverter-415414-6ccc7d166727.json"
OUTPUT_DIR   = ROOT_DIR / "tinyclaw" / "public" / "icons" / "brand" / "ai_gen"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROJECT_ID = "pdfconverter-415414"
LOCATION   = "us-central1"

# 按优先级尝试
MODELS_TO_TRY = [
    {"id": "gemini-3-pro-image-preview",            "api": "genai"},
    {"id": "gemini-2.0-flash-preview-image-generation", "api": "genai"},
    {"id": "gemini-2.0-flash-exp",                  "api": "genai"},
    {"id": "imagen-3.0-generate-002",               "api": "imagen"},
    {"id": "imagen-3.0-generate-001",               "api": "imagen"},
]

# ─── 共用基础风格（不含配色，配色在各场景单独定义）────────────
BASE_STYLE = (
    "Anime chibi illustration style. "
    "Clean bold outlines, flat 2D cell shading, no gradients. "
    "512x512 square app icon, rounded corners. "
    "Character centered, filling most of the frame. "
    "No text, no background scenery, no speech bubbles. "
    "Style like a mobile game icon or LINE sticker. "
    "Cute crawfish / crayfish character mascot with big expressive eyes, "
    "two prominent claws, antennae on head."
)

# ─── crayfish_v3 精修：线框 + 龙虾红 ─────────────────────────
# 场景 A：品牌绿（TinyClaw 官方配色）
SCENE_A = (
    "COLOR SCHEME - Brand Green: "
    "Background is very dark near-black #09090B. "
    "Crawfish shell is muted sage green #7A9E7E. "
    "Shadow areas are darker forest green #4A6B4E. "
    "Eyes are bright white with a small green #4ade80 shine dot. "
    "Claws are slightly lighter green #8FB890. "
    "Overall low-saturation, cool-toned, tech-product aesthetic. "
)

# 场景 B：经典红（小龙虾本色，高辨识度）
SCENE_B = (
    "COLOR SCHEME - Classic Red: "
    "Background is very dark near-black #09090B. "
    "Crawfish shell is deep brick red #C0392B. "
    "Shadow areas darker burgundy #8B1A1A. "
    "Highlight areas warm coral #E74C3C. "
    "Eyes are bright yellow-white. "
    "Claws are slightly darker red #A93226. "
    "Bold and recognizable, warm against dark background. "
)

# 场景 C：赛博霓虹（科技感，亮线条）
SCENE_C = (
    "COLOR SCHEME - Cyber Neon: "
    "Background is very dark near-black #09090B. "
    "Crawfish drawn with glowing bright green neon outlines #4ade80. "
    "Body fill is very dark, almost transparent, just slightly lighter than bg. "
    "Eyes are glowing bright green dots. "
    "Claws have bright green edge glow. "
    "Overall: dark silhouette with luminous neon green edges. Cyberpunk feel. "
)

# 场景 D：暖橙奶油（可爱活泼，游戏角色感）
SCENE_D = (
    "COLOR SCHEME - Warm Orange Cream: "
    "Background is warm dark brown-black #120D0A. "
    "Crawfish shell is warm amber orange #E8874A. "
    "Shadow areas are deep burnt orange #B85C28. "
    "Highlight areas are light peach cream #F4C99A. "
    "Eyes are large, warm white with orange-brown pupils. "
    "Claws are slightly darker orange. "
    "Warm, friendly, game mascot feel. "
)

# 场景 E：幽灵单色（极简，纯白轮廓）
SCENE_E = (
    "COLOR SCHEME - Ghost Monochrome: "
    "Background is very dark near-black #09090B. "
    "Crawfish is drawn in pure off-white #E4E4E7 outline only, no fill. "
    "All details are white outlines on black. "
    "Eyes are two small filled white circles. "
    "Minimalist ghost/spirit aesthetic. Ultra clean. "
    "Like a stamp or watermark icon. "
)

# ─── Prompt 列表 ─────────────────────────────────────────────
# 个人助理感 + 红色降调 + tiny轻量

# 共用基底
ASSISTANT_BASE = (
    "Anime chibi illustration, clean thin outlines, minimal flat shading. "
    "Very dark near-black background #09090B. "
    "512x512 square icon with rounded corners. "
    "Character small and delicate, lots of breathing space around it. "
    "No text, no speech bubbles. "
    "Lightweight airy composition — character takes up about 60% of frame. "
)

# 降调红色方案：粉砖红，低饱和
MUTED_RED = (
    "COLOR: Muted dusty rose-red #B87070, very desaturated. "
    "Outline strokes in slightly darker #8A4A4A. "
    "Highlight areas very light blush #E8C0B0. "
    "No bright or saturated red. Warm but quiet tone. "
)

PROMPTS = [
    {
        "name": "assistant_v1_tiny_butler",
        "prompt": (
            ASSISTANT_BASE + MUTED_RED +
            "Subject: A tiny cute chibi crawfish wearing a miniature bow tie. "
            "Front view, sitting upright, one small claw raised as if greeting or ready to help. "
            "Very small and polite-looking. Butler / assistant vibe. "
            "Bow tie is a small accent, same muted red tone. "
            "Expression: calm, friendly, attentive. "
        ),
    },
    {
        "name": "assistant_v2_headset",
        "prompt": (
            ASSISTANT_BASE + MUTED_RED +
            "Subject: A tiny chibi crawfish face with a miniature headset/earpiece on one antenna. "
            "Front view face close-up. Large gentle eyes, soft smile. "
            "Headset is a thin line detail on the antenna — AI assistant / call center helper feel. "
            "Very minimal, cute and professional at the same time. "
            "Character feels like an AI virtual assistant mascot. "
        ),
    },
    {
        "name": "assistant_v3_floating_claw",
        "prompt": (
            ASSISTANT_BASE + MUTED_RED +
            "Subject: A single delicate crawfish claw / pincer, small and elegant, "
            "centered in frame with lots of empty dark space around it. "
            "The claw is slightly open, like offering to help or shake hands. "
            "Very thin wireframe-style outline only, no fill. "
            "Feels lightweight and refined, not heavy. "
            "Minimalist, like a Japanese app icon. "
        ),
    },
    {
        "name": "assistant_v4_chibi_wave",
        "prompt": (
            ASSISTANT_BASE + MUTED_RED +
            "Subject: A very tiny chibi crawfish body, full figure, "
            "waving one claw in a friendly hello gesture. "
            "Small and cute — like a mascot sticker. "
            "Character is small relative to the frame, centered with lots of dark space. "
            "Relaxed happy expression. Feels approachable and light. "
            "Think LINE sticker or Duolingo owl energy — helpful and non-threatening. "
        ),
    },
    {
        "name": "assistant_v5_spark_icon",
        "prompt": (
            ASSISTANT_BASE + MUTED_RED +
            "Subject: A minimal chibi crawfish head + two tiny claws, "
            "with a small sparkle or star symbol near one claw tip "
            "to suggest 'AI magic' or 'smart assistant'. "
            "Ultra simplified, almost like an emoji or app favicon. "
            "Just head, two small claws, one sparkle. Negative space dominant. "
            "Delicate, tiny, lightweight. "
        ),
    },
]


def init_client():
    from google import genai
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(
        str(CRED_FILE),
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    client = genai.Client(
        vertexai=True,
        project=PROJECT_ID,
        location=LOCATION,
        credentials=creds,
    )
    print(f"✓ Vertex AI client initialized — project: {PROJECT_ID}\n")
    return client


def probe_model(client) -> dict | None:
    """找到第一个可用的图像生成模型，返回 {"id": ..., "api": ...}"""
    from google.genai import types

    for entry in MODELS_TO_TRY:
        mid, api = entry["id"], entry["api"]
        print(f"  Probing [{api}] {mid} ...")
        try:
            if api == "imagen":
                resp = client.models.generate_images(
                    model=mid,
                    prompt="A single green circle on black background.",
                    config={"number_of_images": 1},
                )
                if resp.generated_images:
                    print(f"  ✓  Available: {mid}\n")
                    return entry
            else:
                resp = client.models.generate_content(
                    model=mid,
                    contents="Draw a single green dot on black background.",
                    config=types.GenerateContentConfig(
                        response_modalities=["IMAGE"],
                    ),
                )
                print(f"  ✓  Available: {mid}\n")
                return entry
        except Exception as e:
            err = str(e)
            code = "404" if "404" in err or "NOT_FOUND" in err else "ERR"
            print(f"  ✗  [{code}] {mid}: {err[:100]}")

    return None


def save_image_response(response, out_path: Path) -> bool:
    """从 generate_content response 中提取并保存图片，返回是否成功"""
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            img_data  = part.inline_data.data
            mime_type = part.inline_data.mime_type
            ext       = mime_type.split("/")[-1]
            final_path = out_path.with_suffix(f".{ext}")
            raw = img_data if isinstance(img_data, bytes) else base64.b64decode(img_data)
            with open(final_path, "wb") as f:
                f.write(raw)
            print(f"  ✓  Saved → {final_path}")
            return True
    return False


def generate_with_genai(client, model: str, name: str, prompt: str):
    """适用于 Gemini 系列（generate_content）"""
    from google.genai import types
    print(f"  → [{model}] {name} ...")
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
        ),
    )
    if not save_image_response(response, OUTPUT_DIR / name):
        print(f"  ⚠  No image in response for {name}")
        for part in response.candidates[0].content.parts:
            if hasattr(part, "text") and part.text:
                print(f"     Text: {part.text[:200]}")


def generate_with_imagen(client, model: str, name: str, prompt: str):
    """适用于 Imagen 系列（generate_images）"""
    print(f"  → [{model}] {name} ...")
    response = client.models.generate_images(
        model=model,
        prompt=prompt,
        config={"number_of_images": 1},
    )
    if response.generated_images:
        img = response.generated_images[0]
        raw = img.image.image_bytes
        out_path = OUTPUT_DIR / f"{name}.png"
        with open(out_path, "wb") as f:
            f.write(raw)
        print(f"  ✓  Saved → {out_path}")
    else:
        print(f"  ⚠  No images returned for {name}")


def generate_icon(client, model: str, name: str, prompt: str):
    try:
        if model.startswith("imagen"):
            generate_with_imagen(client, model, name, prompt)
        else:
            generate_with_genai(client, model, name, prompt)
    except Exception as e:
        print(f"  ✗  Error [{name}]: {e}")


def main():
    print("\n🎨  TinyClaw × Vertex AI Image Generator\n")
    print(f"   Project : {PROJECT_ID}")
    print(f"   Output  : {OUTPUT_DIR}\n")

    client = init_client()

    entry = probe_model(client)
    if not entry:
        print("\n✗  No available image model found.")
        print("   → Go to: https://console.cloud.google.com/vertex-ai/model-garden")
        print("   → Enable Imagen 3 or Gemini image generation for this project\n")
        return

    model, api = entry["id"], entry["api"]
    print(f"Using model: {model}  (api={api})\n{'─'*50}")
    for item in PROMPTS:
        generate_icon(client, model, item["name"], item["prompt"])

    print(f"\n✅  Done! Check {OUTPUT_DIR}\n")


if __name__ == "__main__":
    main()
