---
name: nano-banana
description: Generate or edit images. Uses Vertex AI Gemini Image (Gemini users) or OpenAI DALL-E 3 (Claude / GPT users) — auto-detected.
homepage: https://platform.openai.com/docs/api-reference/images
metadata:
  {
    "openclaw":
      {
        "emoji": "🍌",
        "requires": { "bins": ["python3"] },
        "primaryEnv": "",
        "install": [],
      },
  }
---

# Nano Banana — Universal Image Generation

TinyClaw 通用图片生成 skill。**无论用户选择哪个模型都支持**：

| 用户模型 | 图片后端 |
|---------|---------|
| Gemini  | Vertex AI Gemini 3 Pro Image |
| Claude  | OpenAI DALL-E 3 |
| GPT     | OpenAI DALL-E 3 |

后端自动检测，无需用户干预。

## 生成图片

```bash
python3 {baseDir}/scripts/generate_image_unified.py --prompt "your image description" --filename "output.png" --resolution 1K
```

## 编辑图片（单张）

```bash
python3 {baseDir}/scripts/generate_image_unified.py --prompt "edit instructions" --filename "output.png" -i "/path/to/input.png" --resolution 2K
```

## 多图合成（最多 14 张，仅 Vertex AI 后端支持）

```bash
python3 {baseDir}/scripts/generate_image_unified.py --prompt "combine into one scene" --filename "output.png" -i img1.png -i img2.png -i img3.png
```

## 分辨率

- `1K`（默认）、`2K`、`4K`
- DALL-E 3 的 2K/4K 会映射到 `1792x1024`

## ⚠️ 关键回复规则（必须遵守）

脚本输出中会有 `IMAGE_URL: https://...` 这一行。

**你必须在最终回复里用 markdown 图片语法嵌入图片**：

```
![Generated Image](https://the-url-from-IMAGE_URL-here.png)
```

完整回复示例：

```
Here is your generated image:

![Generated Image](https://files.catbox.moe/xxxxxx.png)
```

❌ 错误（纯文字 URL，WebChat 不会渲染）：
```
IMAGE_URL: https://files.catbox.moe/xxxxxx.png
```

✅ 正确（markdown 图片语法，WebChat 渲染成 `<img>`）：
```
![Generated Image](https://files.catbox.moe/xxxxxx.png)
```

## 注意事项

- 文件名建议带时间戳，例如 `2026-02-04-sunset.png`
- `MEDIA:` 标记 → OpenClaw 在 Telegram/Discord/WhatsApp 渠道自动附图
- `IMAGE_URL:` 标记 → 用于 WebChat 内联图片渲染（**必须转成 markdown 图片语法**）
- 不要回读图片文件内容，只报告路径和 IMAGE_URL 即可
