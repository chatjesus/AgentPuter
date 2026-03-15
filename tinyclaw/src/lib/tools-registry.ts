export interface ToolDef {
  slug: string;
  name: string;
  description: string;
  category: "ai" | "converter" | "developer" | "generator" | "vertical" | "pdf" | "image";
  icon: string;
  keywords: string[];
  isAI?: boolean;
}

export const TOOLS: ToolDef[] = [
  // --- Converter / Utility (pure frontend) ---
  { slug: "json-formatter", name: "JSON Formatter & Validator", description: "Format, validate, and beautify JSON data instantly. Supports minify, sort keys, and syntax highlighting.", category: "developer", icon: "{ }", keywords: ["json formatter", "json validator", "json beautifier", "json prettifier"] },
  { slug: "base64-encoder", name: "Base64 Encoder & Decoder", description: "Encode text to Base64 or decode Base64 back to text. Supports file and image encoding.", category: "developer", icon: "🔐", keywords: ["base64 encoder", "base64 decoder", "base64 converter"] },
  { slug: "qr-code-generator", name: "QR Code Generator", description: "Generate QR codes for URLs, text, WiFi, or contact info. Download as PNG or SVG.", category: "generator", icon: "📱", keywords: ["qr code generator", "qr code maker", "create qr code"] },
  { slug: "word-counter", name: "Word & Character Counter", description: "Count words, characters, sentences, and paragraphs. Estimate reading time.", category: "developer", icon: "📝", keywords: ["word counter", "character counter", "text counter"] },
  { slug: "color-picker", name: "Color Picker & Converter", description: "Pick colors and convert between HEX, RGB, HSL, and CMYK. Extract palette from images.", category: "developer", icon: "🎨", keywords: ["color picker", "hex to rgb", "color converter"] },
  { slug: "markdown-preview", name: "Markdown Preview & Editor", description: "Write Markdown and preview it in real time. Export as HTML or copy formatted text.", category: "developer", icon: "📄", keywords: ["markdown editor", "markdown preview", "markdown to html"] },
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate UUID v4 strings in bulk. Copy to clipboard or download as a list.", category: "developer", icon: "🆔", keywords: ["uuid generator", "guid generator", "random uuid"] },
  { slug: "image-compressor", name: "Image Compressor", description: "Compress JPEG, PNG, and WebP images in your browser. No upload needed — 100% private.", category: "converter", icon: "🖼️", keywords: ["image compressor", "compress image online", "reduce image size"] },
  { slug: "pdf-to-image", name: "PDF to Image Converter", description: "Convert PDF pages to high-quality PNG or JPEG images. Works entirely in your browser.", category: "converter", icon: "📑", keywords: ["pdf to image", "pdf to png", "pdf to jpg", "pdf converter"] },
  { slug: "image-to-pdf", name: "Image to PDF Converter", description: "Combine multiple images into a single PDF file. Drag and drop, reorder, and download.", category: "converter", icon: "📷", keywords: ["image to pdf", "jpg to pdf", "png to pdf"] },

  // --- AI-Powered Tools ---
  { slug: "ai-rewriter", name: "AI Text Rewriter", description: "Rewrite and paraphrase text with AI. Choose formal, casual, or concise tone.", category: "ai", icon: "✏️", keywords: ["ai rewriter", "paraphrase tool", "text rewriter", "ai paraphraser"], isAI: true },
  { slug: "ai-summarizer", name: "AI Text Summarizer", description: "Summarize long articles, documents, or emails into key points with AI.", category: "ai", icon: "📋", keywords: ["ai summarizer", "text summarizer", "summarize article", "tldr generator"], isAI: true },
  { slug: "ai-translator", name: "AI Translator", description: "Translate text between 100+ languages with natural-sounding AI translation.", category: "ai", icon: "🌍", keywords: ["ai translator", "translate text", "language translator"], isAI: true },
  { slug: "ai-email-writer", name: "AI Email Writer", description: "Generate professional emails from a brief description. Reply, follow-up, or cold outreach.", category: "ai", icon: "✉️", keywords: ["ai email writer", "email generator", "professional email writer"], isAI: true },
  { slug: "ai-code-explainer", name: "AI Code Explainer", description: "Paste code and get a plain-English explanation. Supports all major languages.", category: "ai", icon: "💻", keywords: ["ai code explainer", "explain code", "code to english"], isAI: true },
  { slug: "ai-regex-generator", name: "AI Regex Generator", description: "Describe a pattern in plain English and get the regex. Includes test cases.", category: "ai", icon: "🔍", keywords: ["regex generator", "ai regex", "regular expression generator"], isAI: true },
  { slug: "ai-sql-generator", name: "AI SQL Generator", description: "Describe your query in English and get production-ready SQL. Supports MySQL, PostgreSQL, SQLite.", category: "ai", icon: "🗃️", keywords: ["ai sql generator", "text to sql", "natural language to sql"], isAI: true },
  { slug: "ai-resume-optimizer", name: "AI Resume Optimizer", description: "Paste your resume and get AI-powered suggestions to improve it for ATS and recruiters.", category: "ai", icon: "📄", keywords: ["ai resume optimizer", "resume checker", "improve resume"], isAI: true },

  // --- Vertical Tools ---
  { slug: "telegram-bot-checker", name: "Telegram Bot Token Checker", description: "Verify your Telegram bot token and see bot details (name, username, can_join_groups).", category: "vertical", icon: "🤖", keywords: ["telegram bot checker", "telegram token validator", "check telegram bot"] },
  { slug: "ai-agent-cost-calculator", name: "AI Agent Cost Calculator", description: "Compare the real cost of building your own AI agent vs using TinyClaw.", category: "vertical", icon: "💰", keywords: ["ai agent cost", "ai assistant cost", "chatbot pricing calculator"], isAI: true },
  { slug: "cron-expression-generator", name: "Cron Expression Generator", description: "Build cron expressions visually. See human-readable descriptions and next run times.", category: "developer", icon: "⏰", keywords: ["cron generator", "cron expression", "crontab guru"] },
  { slug: "api-health-checker", name: "API Health Checker", description: "Check if an API endpoint is responding. See status code, response time, and headers.", category: "developer", icon: "🏥", keywords: ["api health check", "api status checker", "is api down"] },
  { slug: "hash-generator", name: "Hash Generator (MD5/SHA)", description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files. Compare hashes for integrity checks.", category: "developer", icon: "#️⃣", keywords: ["hash generator", "md5 generator", "sha256 hash", "checksum calculator"] },
  { slug: "url-encoder", name: "URL Encoder & Decoder", description: "Encode or decode URLs and query strings. Handle special characters safely.", category: "developer", icon: "🔗", keywords: ["url encoder", "url decoder", "percent encoding", "urlencode"] },
  { slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDF files into one document. Drag and drop to reorder pages.", category: "pdf", icon: "📎", keywords: ["merge pdf", "combine pdf", "join pdf files", "pdf merger"] },
  { slug: "split-pdf", name: "Split PDF", description: "Split a PDF into individual pages or custom page ranges. Download each part separately.", category: "pdf", icon: "✂️", keywords: ["split pdf", "separate pdf pages", "extract pdf pages", "pdf splitter"] },
  { slug: "rotate-pdf", name: "Rotate PDF Pages", description: "Rotate PDF pages by 90, 180, or 270 degrees. Select individual pages or rotate all.", category: "pdf", icon: "🔄", keywords: ["rotate pdf", "turn pdf pages", "pdf rotation"] },
  { slug: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size while maintaining quality. Works entirely in your browser.", category: "pdf", icon: "📦", keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "shrink pdf"] },
  { slug: "pdf-page-numbers", name: "Add Page Numbers to PDF", description: "Add page numbers to any PDF. Choose position, format, and starting number.", category: "pdf", icon: "🔢", keywords: ["add page numbers pdf", "pdf page numbering", "number pdf pages"] },
  { slug: "watermark-pdf", name: "Add Watermark to PDF", description: "Add text or image watermark to PDF pages. Customize opacity, position, and rotation.", category: "pdf", icon: "💧", keywords: ["watermark pdf", "add watermark to pdf", "pdf watermark"] },
  { slug: "pdf-to-text", name: "PDF to Text Extractor", description: "Extract all text content from PDF files. Copy or download as .txt file.", category: "pdf", icon: "📃", keywords: ["pdf to text", "extract text from pdf", "pdf text extractor", "pdf ocr"] },
  { slug: "protect-pdf", name: "Protect PDF with Password", description: "Add password protection to your PDF files. Set user and owner passwords.", category: "pdf", icon: "🔒", keywords: ["protect pdf", "password protect pdf", "encrypt pdf", "lock pdf"] },
];

export function getToolBySlug(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolDef["category"]): ToolDef[] {
  return TOOLS.filter((t) => t.category === category);
}
