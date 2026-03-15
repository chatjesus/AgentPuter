#!/usr/bin/env python3
"""
工具站代码生成产线 (Gemini 3.1 Pro)
====================================
用 Vertex AI Gemini 3.1 Pro 自动生成新工具组件代码。
消耗 pdfconverter-415414 项目的 $504K credit。

流程：
  1. 读取待生成工具列表
  2. Gemini 3.1 Pro 生成 React 组件代码
  3. 自动写入文件 + 更新注册表 + 更新 ToolRunner
  4. npm run build 验证编译
  5. 通过 → 记录成功；失败 → 读取错误让 Gemini 修复，最多 3 轮

用法：
  python3 scripts/tools_code_factory.py                    # 生成所有待生成工具
  python3 scripts/tools_code_factory.py --tool hash-generator  # 只生成指定工具
  python3 scripts/tools_code_factory.py --dry-run          # 只输出 prompt，不写文件
  python3 scripts/tools_code_factory.py --list             # 列出待生成工具
"""

import os
import sys
import json
import time
import re
import subprocess
import argparse
from pathlib import Path
from datetime import datetime

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
    "/Users/mac/Desktop/AgentPuter/credentials/pdfconverter-415414-6ccc7d166727.json"
)

from google import genai
from google.genai import types

PROJECT = "pdfconverter-415414"
CODE_MODEL = "gemini-2.0-flash-001"
FALLBACK_MODEL = "gemini-2.0-flash-001"
REVIEW_MODEL = "gemini-2.5-pro"

BASE_DIR = Path(__file__).resolve().parent.parent
TC_DIR = BASE_DIR / "tinyclaw"
TOOLS_DIR = TC_DIR / "src" / "tools"
REGISTRY_FILE = TC_DIR / "src" / "lib" / "tools-registry.ts"
RUNNER_FILE = TC_DIR / "src" / "app" / "(public)" / "tools" / "[slug]" / "ToolRunner.tsx"
REPORT_DIR = BASE_DIR / "reports"

# ─── 参考模板（给 Gemini 看的现有代码风格）──────────────────

EXAMPLE_COMPONENT = '''"use client";
import { useState } from "react";
export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode"|"decode">("encode");
  const run = () => { /* encode/decode logic */ };
  return (
    <div className="tool-stack">
      <div className="tool-toggle-row">
        <button className={`tool-toggle ${mode==="encode"?"active":""}`} onClick={()=>setMode("encode")}>Encode</button>
        <button className={`tool-toggle ${mode==="decode"?"active":""}`} onClick={()=>setMode("decode")}>Decode</button>
      </div>
      <textarea className="tool-textarea tool-mono" value={input} onChange={(e)=>setInput(e.target.value)} rows={6}/>
      <button className="tool-run-btn" onClick={run}>{mode==="encode"?"Encode →":"← Decode"}</button>
      {output && (<div className="tool-output">
        <div className="tool-output-header"><span>Result</span><button className="tool-copy-btn" onClick={()=>navigator.clipboard.writeText(output)}>Copy</button></div>
        <pre className="tool-output-pre tool-mono">{output}</pre>
      </div>)}
    </div>
  );
}'''

# ─── 待生成的新工具列表 ────────────────────────────────────

NEW_TOOLS = [
    # ══════════════════════════════════════════════════════
    # 已生成的 (会自动跳过)
    # ══════════════════════════════════════════════════════
    {"slug": "hash-generator", "name": "Hash Generator (MD5/SHA)", "description": "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.", "category": "developer", "icon": "#️⃣", "keywords": ["hash generator", "md5", "sha256"], "component_name": "HashGenerator", "spec": "Use Web Crypto API. Input textarea. Output all hash types. Copy per hash."},
    {"slug": "url-encoder", "name": "URL Encoder & Decoder", "description": "Encode or decode URLs and query strings.", "category": "developer", "icon": "🔗", "keywords": ["url encoder", "url decoder"], "component_name": "UrlEncoder", "spec": "Toggle encode/decode. Use encodeURIComponent/decodeURIComponent."},

    # ══════════════════════════════════════════════════════
    # BATCH A: PDF 工具套件 (对标 iLovePDF + Smallpdf)
    # 使用 pdf-lib (import { PDFDocument } from 'pdf-lib')
    # ══════════════════════════════════════════════════════
    {"slug": "merge-pdf", "name": "Merge PDF", "description": "Combine multiple PDF files into one document. Drag and drop to reorder pages.", "category": "pdf", "icon": "📎", "keywords": ["merge pdf", "combine pdf", "join pdf files", "pdf merger"], "component_name": "MergePdf", "spec": "Upload multiple PDF files via file input (accept .pdf). Use pdf-lib (import { PDFDocument } from 'pdf-lib'). Copy pages from each source into a new PDFDocument. Show file list with drag reorder. Download merged PDF. Show total page count.", "libs": ["pdf-lib"]},
    {"slug": "split-pdf", "name": "Split PDF", "description": "Split a PDF into individual pages or custom page ranges. Download each part separately.", "category": "pdf", "icon": "✂️", "keywords": ["split pdf", "separate pdf pages", "extract pdf pages", "pdf splitter"], "component_name": "SplitPdf", "spec": "Upload one PDF. Use pdf-lib to read it. Show page count. Options: split every page, or by range (e.g. 1-3, 4-6). Generate separate PDFs. Download each or download all as individual files.", "libs": ["pdf-lib"]},
    {"slug": "rotate-pdf", "name": "Rotate PDF Pages", "description": "Rotate PDF pages by 90, 180, or 270 degrees. Select individual pages or rotate all.", "category": "pdf", "icon": "🔄", "keywords": ["rotate pdf", "turn pdf pages", "pdf rotation"], "component_name": "RotatePdf", "spec": "Upload PDF. Use pdf-lib to load. Show page thumbnails (render via canvas with pdfjs-dist getDocument). Click page to select. Rotate selected 90/180/270. Save and download. Use both pdf-lib and pdfjs-dist.", "libs": ["pdf-lib"]},
    {"slug": "compress-pdf", "name": "Compress PDF", "description": "Reduce PDF file size while maintaining quality. Works entirely in your browser.", "category": "pdf", "icon": "📦", "keywords": ["compress pdf", "reduce pdf size", "pdf compressor", "shrink pdf"], "component_name": "CompressPdf", "spec": "Upload PDF. Use pdf-lib to load and re-save (which strips some metadata). Show original vs new file size. Download compressed PDF. Show compression percentage.", "libs": ["pdf-lib"]},
    {"slug": "pdf-page-numbers", "name": "Add Page Numbers to PDF", "description": "Add page numbers to any PDF. Choose position, format, and starting number.", "category": "pdf", "icon": "🔢", "keywords": ["add page numbers pdf", "pdf page numbering", "number pdf pages"], "component_name": "PdfPageNumbers", "spec": "Upload PDF. Use pdf-lib to load. Options: position (bottom-center, bottom-right, top-right), format (Page X, X/N, X), font size, start number. Draw text on each page using page.drawText. Download.", "libs": ["pdf-lib"]},
    {"slug": "watermark-pdf", "name": "Add Watermark to PDF", "description": "Add text or image watermark to PDF pages. Customize opacity, position, and rotation.", "category": "pdf", "icon": "💧", "keywords": ["watermark pdf", "add watermark to pdf", "pdf watermark"], "component_name": "WatermarkPdf", "spec": "Upload PDF. Use pdf-lib. Input watermark text. Options: font size, opacity (0.1-1), rotation angle, color. Draw rotated semi-transparent text diagonally across each page. Download.", "libs": ["pdf-lib"]},
    {"slug": "pdf-to-text", "name": "PDF to Text Extractor", "description": "Extract all text content from PDF files. Copy or download as .txt file.", "category": "pdf", "icon": "📃", "keywords": ["pdf to text", "extract text from pdf", "pdf text extractor", "pdf ocr"], "component_name": "PdfToText", "spec": "Upload PDF. Use pdfjs-dist getDocument and getTextContent on each page. Concatenate all text items. Display in textarea. Copy and download as .txt buttons.", "libs": ["pdfjs-dist"]},
    {"slug": "protect-pdf", "name": "Protect PDF with Password", "description": "Add password protection to your PDF files. Set user and owner passwords.", "category": "pdf", "icon": "🔒", "keywords": ["protect pdf", "password protect pdf", "encrypt pdf", "lock pdf"], "component_name": "ProtectPdf", "spec": "Upload PDF. Use pdf-lib to load. Input password fields (user password, owner password). Use pdf.encrypt({ userPassword, ownerPassword }) method from pdf-lib. Download protected PDF.", "libs": ["pdf-lib"]},
    {"slug": "unlock-pdf", "name": "Unlock PDF", "description": "Remove password protection from PDF files. Enter the password to unlock.", "category": "pdf", "icon": "🔓", "keywords": ["unlock pdf", "remove pdf password", "decrypt pdf", "unprotect pdf"], "component_name": "UnlockPdf", "spec": "Upload encrypted PDF. Show password input. Use pdf-lib PDFDocument.load(bytes, { password }) to decrypt. Re-save without encryption. Download unlocked PDF.", "libs": ["pdf-lib"]},
    {"slug": "delete-pdf-pages", "name": "Delete PDF Pages", "description": "Remove specific pages from a PDF file. Preview pages before deleting.", "category": "pdf", "icon": "🗑️", "keywords": ["delete pdf pages", "remove pages from pdf", "pdf page remover"], "component_name": "DeletePdfPages", "spec": "Upload PDF. Use pdf-lib to load, show page count. Input: comma-separated page numbers to delete. Remove those pages using removePage(). Download result.", "libs": ["pdf-lib"]},
    {"slug": "organize-pdf", "name": "Organize PDF Pages", "description": "Reorder, rotate, and delete PDF pages with a visual drag-and-drop interface.", "category": "pdf", "icon": "📋", "keywords": ["organize pdf", "reorder pdf pages", "rearrange pdf", "sort pdf pages"], "component_name": "OrganizePdf", "spec": "Upload PDF. Show numbered page list. Allow drag-and-drop reorder (use simple index swap buttons: move up/down). Delete individual pages. Save reordered PDF using pdf-lib copyPages. Download.", "libs": ["pdf-lib"]},
    {"slug": "flatten-pdf", "name": "Flatten PDF", "description": "Flatten PDF form fields and annotations into static content.", "category": "pdf", "icon": "📋", "keywords": ["flatten pdf", "flatten pdf forms", "pdf flattener"], "component_name": "FlattenPdf", "spec": "Upload PDF. Use pdf-lib to load. Get form with pdf.getForm(), then call form.flatten(). Save and download flattened PDF. Show before/after field count.", "libs": ["pdf-lib"]},
    {"slug": "html-to-pdf", "name": "HTML to PDF Converter", "description": "Convert HTML code to a PDF document. Supports CSS styling.", "category": "pdf", "icon": "🌐", "keywords": ["html to pdf", "convert html to pdf", "webpage to pdf"], "component_name": "HtmlToPdf", "spec": "Textarea for HTML input with default example. Render HTML in a hidden iframe. Use window.print() approach or canvas capture to generate PDF via jspdf. Preview and download.", "libs": ["jspdf"]},

    # ══════════════════════════════════════════════════════
    # BATCH B: 图片工具 (对标 iLoveIMG)
    # ══════════════════════════════════════════════════════
    {"slug": "image-resizer", "name": "Image Resizer", "description": "Resize images to exact dimensions or by percentage. Maintain aspect ratio.", "category": "image", "icon": "📐", "keywords": ["image resizer", "resize image online", "resize photo", "image dimensions"], "component_name": "ImageResizer", "spec": "Upload image via file input. Show original dimensions. Inputs: width, height, lock aspect ratio toggle. Percentage mode. Use canvas to resize. Preview result. Download resized image."},
    {"slug": "image-cropper", "name": "Image Cropper", "description": "Crop images online. Choose custom area or use preset aspect ratios.", "category": "image", "icon": "✂️", "keywords": ["image cropper", "crop image online", "photo cropper", "crop photo"], "component_name": "ImageCropper", "spec": "Upload image. Draw on canvas. Let user input crop dimensions (x, y, width, height) or use presets (1:1, 4:3, 16:9). Use canvas drawImage with source rect to crop. Preview and download."},
    {"slug": "image-converter", "name": "Image Format Converter", "description": "Convert images between PNG, JPEG, WebP, and BMP formats.", "category": "image", "icon": "🔄", "keywords": ["image converter", "png to jpg", "jpg to png", "webp converter", "image format"], "component_name": "ImageConverter", "spec": "Upload image. Select output format (png, jpeg, webp, bmp). Quality slider for jpeg/webp. Use canvas.toDataURL(mimeType, quality). Show file size comparison. Download."},
    {"slug": "image-watermark", "name": "Add Watermark to Image", "description": "Add text or image watermark to photos. Customize position, size, and opacity.", "category": "image", "icon": "💧", "keywords": ["image watermark", "add watermark", "watermark photo", "photo watermark"], "component_name": "ImageWatermark", "spec": "Upload image. Input watermark text. Options: font size, opacity, position (center/corner), color, rotation. Draw on canvas with globalAlpha. Preview and download."},
    {"slug": "image-rotate", "name": "Rotate & Flip Image", "description": "Rotate images by any angle. Flip horizontally or vertically.", "category": "image", "icon": "🔄", "keywords": ["rotate image", "flip image", "image rotation", "mirror image"], "component_name": "ImageRotate", "spec": "Upload image. Buttons: rotate 90 CW, 90 CCW, 180, flip horizontal, flip vertical. Use canvas transform/scale/rotate. Preview each change. Download."},
    {"slug": "image-to-base64", "name": "Image to Base64 Converter", "description": "Convert images to Base64 encoded strings. Generate data URIs for embedding in HTML/CSS.", "category": "image", "icon": "🔐", "keywords": ["image to base64", "base64 image", "data uri generator", "image encoder"], "component_name": "ImageToBase64", "spec": "Upload image. Read as dataURL using FileReader. Display base64 string in textarea. Show as img tag, CSS background, and data URI. Copy buttons for each format."},
    {"slug": "gif-to-frames", "name": "GIF Frame Extractor", "description": "Extract individual frames from animated GIF files. Download frames as PNG images.", "category": "image", "icon": "🎞️", "keywords": ["gif to frames", "extract gif frames", "gif splitter", "gif frame extractor"], "component_name": "GifToFrames", "spec": "Upload GIF. Use canvas to draw each frame. Parse GIF manually or use ImageBitmap. Show frame grid. Download individual frames or all as PNG. Show frame count and dimensions."},

    # ══════════════════════════════════════════════════════
    # BATCH C: 开发者工具 (之前规划的)
    # ══════════════════════════════════════════════════════
    {"slug": "jwt-decoder", "name": "JWT Decoder & Inspector", "description": "Decode and inspect JWT tokens. View header, payload, and signature.", "category": "developer", "icon": "🔓", "keywords": ["jwt decoder", "jwt inspector", "json web token"], "component_name": "JwtDecoder", "spec": "Input: paste JWT. Split by dots. Base64url decode header and payload. Show as formatted JSON. Show exp/iat as human dates. Highlight if expired."},
    {"slug": "timestamp-converter", "name": "Unix Timestamp Converter", "description": "Convert between Unix timestamps and human-readable dates.", "category": "developer", "icon": "🕐", "keywords": ["unix timestamp", "epoch converter", "timestamp to date"], "component_name": "TimestampConverter", "spec": "Two-way: timestamp to date, date to timestamp. Show current timestamp live. Support seconds and milliseconds."},
    {"slug": "diff-checker", "name": "Text Diff Checker", "description": "Compare two texts and highlight differences line by line.", "category": "developer", "icon": "🔀", "keywords": ["diff checker", "text compare", "diff tool"], "component_name": "DiffChecker", "spec": "Two textareas. Line-by-line diff (no external lib). Highlight added (green) and removed (red). Stats: lines added/removed."},
    {"slug": "regex-tester", "name": "Regex Tester", "description": "Test regular expressions with real-time matching and replacement.", "category": "developer", "icon": "🔍", "keywords": ["regex tester", "test regex", "regular expression"], "component_name": "RegexTester", "spec": "Input: regex pattern + flags. Test string textarea. Highlight matches. Show groups. Match count."},
    {"slug": "text-case-converter", "name": "Text Case Converter", "description": "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case.", "category": "developer", "icon": "Aa", "keywords": ["text case converter", "uppercase", "camelcase"], "component_name": "TextCaseConverter", "spec": "Input textarea. Buttons for each case type. Real-time output. Copy button."},
    {"slug": "chmod-calculator", "name": "Chmod Calculator", "description": "Calculate Unix file permissions between symbolic and octal notation.", "category": "developer", "icon": "🔐", "keywords": ["chmod calculator", "file permissions", "unix permissions"], "component_name": "ChmodCalculator", "spec": "Checkbox grid: rwx for owner/group/others. Show octal and symbolic. Bidirectional."},

    # ══════════════════════════════════════════════════════
    # BATCH D: 生成器 + 转换器
    # ══════════════════════════════════════════════════════
    {"slug": "password-generator", "name": "Password Generator", "description": "Generate strong, random passwords with customizable character types.", "category": "generator", "icon": "🔑", "keywords": ["password generator", "random password", "secure password"], "component_name": "PasswordGenerator", "spec": "Length slider 8-128. Toggles: upper, lower, numbers, symbols. Strength meter. Generate multiple. Copy."},
    {"slug": "lorem-ipsum-generator", "name": "Lorem Ipsum Generator", "description": "Generate placeholder text in paragraphs, sentences, or words.", "category": "generator", "icon": "📜", "keywords": ["lorem ipsum", "placeholder text", "dummy text"], "component_name": "LoremIpsumGenerator", "spec": "Number of paragraphs/sentences/words selector. Built-in word bank. Copy and character count."},
    {"slug": "css-gradient-generator", "name": "CSS Gradient Generator", "description": "Create CSS gradients visually with live preview.", "category": "generator", "icon": "🌈", "keywords": ["css gradient", "gradient maker", "gradient generator"], "component_name": "CssGradientGenerator", "spec": "Two color inputs. Angle slider. Type: linear/radial. Live preview div. CSS code output. Copy."},
    {"slug": "meta-tag-generator", "name": "Meta Tag Generator", "description": "Generate HTML meta tags for SEO and social media.", "category": "generator", "icon": "🏷️", "keywords": ["meta tags", "seo meta", "og tags"], "component_name": "MetaTagGenerator", "spec": "Inputs: title, description, keywords, OG image. Google SERP preview. HTML output. Copy."},
    {"slug": "color-palette-generator", "name": "Color Palette Generator", "description": "Generate harmonious color palettes from a base color.", "category": "generator", "icon": "🎨", "keywords": ["color palette", "color scheme", "palette generator"], "component_name": "ColorPaletteGenerator", "spec": "Color picker. Scheme: complementary, analogous, triadic. 5-color swatches with HEX. Copy as CSS vars."},
    {"slug": "json-to-csv", "name": "JSON to CSV Converter", "description": "Convert JSON arrays to CSV. Download as .csv file.", "category": "converter", "icon": "📊", "keywords": ["json to csv", "convert json csv"], "component_name": "JsonToCsv", "spec": "Input JSON array. Output CSV. Flatten nested objects. Download .csv. Preview table."},
    {"slug": "html-to-markdown", "name": "HTML to Markdown Converter", "description": "Convert HTML to clean Markdown.", "category": "converter", "icon": "📝", "keywords": ["html to markdown", "html to md"], "component_name": "HtmlToMarkdown", "spec": "Input HTML. Output Markdown. Handle h1-h6, p, a, img, ul/ol/li, code, strong/em. Regex-based, no libs."},
    {"slug": "svg-to-png", "name": "SVG to PNG Converter", "description": "Convert SVG to PNG at custom resolutions in your browser.", "category": "converter", "icon": "🖼️", "keywords": ["svg to png", "svg converter"], "component_name": "SvgToPng", "spec": "Paste SVG or upload .svg. Preview. Scale 1x/2x/4x. Canvas conversion. Download PNG."},

    # ══════════════════════════════════════════════════════
    # BATCH E: 其他高流量工具
    # ══════════════════════════════════════════════════════
    {"slug": "ip-address-lookup", "name": "IP Address Lookup", "description": "Look up your public IP address and geo information.", "category": "vertical", "icon": "🌐", "keywords": ["my ip address", "ip lookup", "what is my ip"], "component_name": "IpAddressLookup", "spec": "Fetch from https://api.ipify.org?format=json. Display IP. Also show location via ipapi.co/{ip}/json."},
    {"slug": "aspect-ratio-calculator", "name": "Aspect Ratio Calculator", "description": "Calculate aspect ratios and resize dimensions proportionally.", "category": "generator", "icon": "📐", "keywords": ["aspect ratio", "resize calculator"], "component_name": "AspectRatioCalculator", "spec": "Width/Height inputs. Lock ratio. Auto-calc. Presets: 16:9, 4:3, 1:1. Social media presets."},
    {"slug": "htaccess-generator", "name": ".htaccess Generator", "description": "Generate .htaccess rules for redirects, HTTPS, caching.", "category": "developer", "icon": "⚙️", "keywords": ["htaccess generator", "htaccess redirect"], "component_name": "HtaccessGenerator", "spec": "Checkboxes: force HTTPS, www redirect, gzip, cache, security headers. Output htaccess. Copy."},
    {"slug": "crontab-validator", "name": "Crontab Validator", "description": "Validate crontab entries and see next run times.", "category": "developer", "icon": "📅", "keywords": ["crontab validator", "cron schedule"], "component_name": "CrontabValidator", "spec": "Input cron expression. Parse fields. Human-readable description. Next 10 run times."},
]


def get_client(region):
    return genai.Client(vertexai=True, project=PROJECT, location=region)


def call_gemini(prompt, max_tokens=8192, temp=0.3):
    """调用 Gemini 2.0 Flash（快速、稳定、不 thinking）"""
    regions = ["us-central1", "europe-west1", "us-east4", "asia-northeast1", "us-central1", "europe-west1"]
    for attempt, region in enumerate(regions):
        try:
            print(".", end="", flush=True)
            client = get_client(region)
            resp = client.models.generate_content(
                model=CODE_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=temp,
                    max_output_tokens=max_tokens,
                ),
            )
            text = resp.text
            if text and len(text) > 100:
                print(f" [ok@{region}]", end="", flush=True)
                return text
            print("(short)", end="", flush=True)
            time.sleep(5)
        except Exception as e:
            print(f"x[{type(e).__name__}:{str(e)[:80]}]", end="", flush=True)
            time.sleep(min(15 * (attempt + 1), 60))
    return None


def build_generation_prompt(tool):
    """构建组件生成 prompt（<200 chars，避免超时）"""
    libs = tool.get("libs", [])
    lib_hint = " Use pdf-lib." if "pdf-lib" in libs else (" Use jspdf." if "jspdf" in libs else "")
    spec = tool["spec"][:120]
    return f'Write React component {tool["component_name"]}. {spec}.{lib_hint} "use client", export default. Only tsx code.'


def build_fix_prompt(tool, code, error_output):
    """构建修复 prompt"""
    err_lines = [l for l in error_output.split("\n") if "error" in l.lower() or "Error" in l]
    err_short = "\n".join(err_lines[:10]) or error_output[-500:]
    return f"""Fix this React build error and output ONLY the complete fixed .tsx code:

Error: {err_short}

Code:
{code}"""


def extract_code(text):
    """从 Gemini 输出中提取代码"""
    if text.startswith('"use client"') or text.startswith("'use client'"):
        return text

    code_match = re.search(r'```(?:tsx?|typescript|javascript)?\n(.*?)```', text, re.DOTALL)
    if code_match:
        return code_match.group(1).strip()

    if '"use client"' in text or "'use client'" in text:
        start = text.index('"use client"') if '"use client"' in text else text.index("'use client'")
        return text[start:].strip()

    return text.strip()


def write_component(tool, code):
    """写入组件文件"""
    filepath = TOOLS_DIR / f"{tool['component_name']}.tsx"
    filepath.write_text(code, encoding="utf-8")
    return filepath


def update_registry(tool):
    """更新 tools-registry.ts"""
    content = REGISTRY_FILE.read_text(encoding="utf-8")

    if f'slug: "{tool["slug"]}"' in content:
        print(f"    (registry already has {tool['slug']})")
        return

    entry = (
        f'  {{ slug: "{tool["slug"]}", name: "{tool["name"]}", '
        f'description: "{tool["description"]}", '
        f'category: "{tool["category"]}", icon: "{tool["icon"]}", '
        f'keywords: {json.dumps(tool["keywords"])} }},'
    )

    content = content.replace(
        "];\n\nexport function getToolBySlug",
        f"  {entry.strip()}\n];\n\nexport function getToolBySlug",
    )
    REGISTRY_FILE.write_text(content, encoding="utf-8")


def update_runner(tool):
    """更新 ToolRunner.tsx 的 lazy import"""
    content = RUNNER_FILE.read_text(encoding="utf-8")

    if f'"{tool["slug"]}"' in content:
        print(f"    (runner already has {tool['slug']})")
        return

    import_line = f'  "{tool["slug"]}": lazy(() => import("@/tools/{tool["component_name"]}")),'
    content = content.replace(
        "};\n\nconst AI_SLUGS",
        f"  {import_line.strip()}\n}};\n\nconst AI_SLUGS",
    )
    RUNNER_FILE.write_text(content, encoding="utf-8")


def try_build():
    """执行 npm run build，返回 (success, error_output)"""
    result = subprocess.run(
        ["npm", "run", "build"],
        cwd=TC_DIR,
        capture_output=True,
        text=True,
        timeout=300,
    )
    return result.returncode == 0, result.stdout + "\n" + result.stderr


def generate_tool(tool, dry_run=False):
    """生成单个工具：代码生成 → 写文件 → 构建验证 → 修复循环"""
    print(f"\n{'─' * 50}")
    print(f"🔧 {tool['name']} ({tool['slug']})")
    print(f"{'─' * 50}")

    # 检查是否已存在
    filepath = TOOLS_DIR / f"{tool['component_name']}.tsx"
    if filepath.exists():
        print(f"  ⏭️  组件已存在，跳过")
        return {"slug": tool["slug"], "status": "skipped", "reason": "already exists"}

    # 生成代码
    print(f"  [1/3] Gemini 3.1 Pro 生成代码...", end="", flush=True)
    prompt = build_generation_prompt(tool)

    if dry_run:
        print(f"\n  [DRY RUN] Prompt length: {len(prompt)} chars")
        return {"slug": tool["slug"], "status": "dry_run"}

    raw = call_gemini(prompt)
    if not raw:
        print(f" ❌ 生成失败")
        return {"slug": tool["slug"], "status": "failed", "reason": "generation failed"}

    code = extract_code(raw)
    print(f" ✓ ({len(code)} chars)")

    # 写文件 + 更新注册
    print(f"  [2/3] 写入文件 + 更新注册...", end="", flush=True)
    write_component(tool, code)
    update_registry(tool)
    update_runner(tool)
    print(f" ✓")

    # 构建验证 + 修复循环
    for fix_round in range(4):
        label = "构建验证" if fix_round == 0 else f"修复 #{fix_round} 后构建"
        print(f"  [3/3] {label}...", end="", flush=True)
        success, output = try_build()

        if success:
            print(f" ✓ 构建通过!")
            return {"slug": tool["slug"], "status": "success", "fix_rounds": fix_round}

        if fix_round >= 3:
            print(f" ❌ 3 轮修复仍失败，放弃")
            filepath.unlink(missing_ok=True)
            return {"slug": tool["slug"], "status": "failed", "reason": "build failed after 3 fixes"}

        print(f" ✗ 构建失败，让 Gemini 修复...")
        fix_prompt = build_fix_prompt(tool, code, output)
        raw = call_gemini(fix_prompt)
        if not raw:
            print(f"    ❌ 修复生成失败")
            filepath.unlink(missing_ok=True)
            return {"slug": tool["slug"], "status": "failed", "reason": "fix generation failed"}

        code = extract_code(raw)
        write_component(tool, code)

    return {"slug": tool["slug"], "status": "failed", "reason": "unknown"}


def main():
    parser = argparse.ArgumentParser(description="工具站代码生成产线 (Gemini 3.1 Pro)")
    parser.add_argument("--tool", type=str, help="只生成指定工具 slug")
    parser.add_argument("--dry-run", action="store_true", help="只输出 prompt 不写文件")
    parser.add_argument("--list", action="store_true", help="列出所有待生成工具")
    parser.add_argument("--batch", type=int, default=0, help="限制批量生成数量")
    args = parser.parse_args()

    if args.list:
        print(f"\n📋 待生成工具 ({len(NEW_TOOLS)} 个):\n")
        for i, t in enumerate(NEW_TOOLS, 1):
            exists = "✓" if (TOOLS_DIR / f"{t['component_name']}.tsx").exists() else " "
            print(f"  [{exists}] {i:2d}. {t['slug']:30s} {t['name']}")
        return

    print(f"\n{'═' * 55}")
    print(f"  🏭 工具站代码生成产线")
    print(f"  📍 模型: {CODE_MODEL}")
    print(f"  💰 项目: {PROJECT}")
    print(f"  📅 {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'═' * 55}")

    tools = NEW_TOOLS
    if args.tool:
        tools = [t for t in NEW_TOOLS if t["slug"] == args.tool]
        if not tools:
            print(f"❌ 未找到工具: {args.tool}")
            sys.exit(1)

    if args.batch > 0:
        tools = tools[:args.batch]

    results = []
    for i, tool in enumerate(tools):
        result = generate_tool(tool, dry_run=args.dry_run)
        results.append(result)
        if i < len(tools) - 1 and result.get("status") != "skipped":
            wait = 15 if result.get("status") == "success" else 30
            print(f"\n  ⏳ 冷却 {wait}s...", flush=True)
            time.sleep(wait)

    # 汇总
    print(f"\n\n{'═' * 55}")
    print(f"  📊 生成报告")
    print(f"{'═' * 55}")

    success = [r for r in results if r["status"] == "success"]
    failed = [r for r in results if r["status"] == "failed"]
    skipped = [r for r in results if r["status"] == "skipped"]

    print(f"\n  ✅ 成功: {len(success)}")
    for r in success:
        rounds = r.get("fix_rounds", 0)
        fix_note = f" (修复 {rounds} 轮)" if rounds > 0 else ""
        print(f"     • {r['slug']}{fix_note}")

    if failed:
        print(f"\n  ❌ 失败: {len(failed)}")
        for r in failed:
            print(f"     • {r['slug']}: {r.get('reason', 'unknown')}")

    if skipped:
        print(f"\n  ⏭️  跳过: {len(skipped)}")
        for r in skipped:
            print(f"     • {r['slug']}")

    # 保存报告
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = REPORT_DIR / f"code_factory_{ts}.json"
    report_path.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\n  📄 报告: {report_path}")


if __name__ == "__main__":
    main()
