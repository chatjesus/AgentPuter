# AgentPuter Blog Pipeline

使用 Gemini + Google Search Grounding 自动生成、翻译、审核 blog 文章。

## 认证方式

### 方式 1：Google AI Studio API Key（推荐，使用 gemini-3.1-pro-preview）

1. 在 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取 API key
2. 设置环境变量：

```bash
export GEMINI_API_KEY="your-api-key"
# 或
export GOOGLE_API_KEY="your-api-key"
```

3. 运行：

```bash
GEMINI_API_KEY=xxx python3 generate_blog.py --topic-id 19 --step outline
```

### 方式 2：Vertex AI（使用 gemini-2.5-pro）

需要 `GOOGLE_APPLICATION_CREDENTIALS` 指向 GCP 服务账号 JSON。默认使用 [gemini-2.5-pro](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro)（GA，支持 Google Search Grounding，65K output tokens）。

## 用法

```bash
# 生成单篇（大纲 → 全文 → 翻译 → 审核）
python3 generate_blog.py --topic-id 19

# 只生成大纲
python3 generate_blog.py --topic-id 19 --step outline

# 批量生成 19-28
python3 generate_blog.py --range 19-28

# 全部 20 篇
python3 generate_blog.py --all

# 生成并部署到 src/content/blog
python3 generate_blog.py --topic-id 19 --deploy

# 覆盖模型（仅 API key 模式）
BLOG_MODEL=gemini-3-flash-preview python3 generate_blog.py --topic-id 19
```

## 输出

- `output/{topic_id}/outline.md` — 大纲
- `output/{topic_id}/{slug}-en.md` — 英文全文
- `output/{topic_id}/{slug}-zh.md` — 中文翻译
- `output/{topic_id}/review.md` — 事实核查报告

## 主题列表

见 `topics.json`，共 20 篇（ID 19–38）。
