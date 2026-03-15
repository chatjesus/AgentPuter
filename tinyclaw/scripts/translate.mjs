#!/usr/bin/env node
/**
 * 批量翻译脚本 — 使用 Google Vertex AI Gemini 2.5 Pro
 * 
 * 用法: node scripts/translate.mjs
 * 
 * 读取 src/locales/en.json，翻译为 9 种目标语言
 * GCP 凭证从 GOOGLE_APPLICATION_CREDENTIALS 环境变量读取
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAuth } from "google-auth-library";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../src/locales");
const CREDENTIALS_PATH = path.join(__dirname, "../../credentials/chatpdf-pro-9d3ad-firebase-adminsdk-pzi27-47cf27d8c3.json");

// 目标语言
const TARGET_LOCALES = [
  { code: "zh", name: "Chinese Simplified (简体中文)", nativeName: "简体中文" },
  { code: "zh-tw", name: "Chinese Traditional (繁體中文)", nativeName: "繁體中文" },
  { code: "es", name: "Spanish (Español)", nativeName: "Español" },
  { code: "ja", name: "Japanese (日本語)", nativeName: "日本語" },
  { code: "ko", name: "Korean (한국어)", nativeName: "한국어" },
  { code: "de", name: "German (Deutsch)", nativeName: "Deutsch" },
  { code: "fr", name: "French (Français)", nativeName: "Français" },
  { code: "pt", name: "Portuguese-BR (Português)", nativeName: "Português" },
  { code: "ru", name: "Russian (Русский)", nativeName: "Русский" },
  { code: "ar", name: "Arabic (العربية)", nativeName: "العربية" },
];

// GCP 配置
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
const PROJECT_ID = credentials.project_id;
const REGION = "us-central1";
const MODEL = "gemini-2.0-flash-001"; // Vertex AI 稳定版本

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

async function translateWithGemini(enJson, locale, accessToken) {
  // 使用 Vertex AI endpoint（比 generativelanguage.googleapis.com 更稳定）
  const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:generateContent`;

  const prompt = `You are a professional translator specializing in SaaS/tech product localization.

CONTEXT: TinyClaw is a one-click deployment platform for OpenClaw (an AI assistant framework). Users can deploy their own 24/7 AI assistant connected to Telegram in under 1 minute. The target audience is both technical and non-technical users who want an AI assistant.

TASK: Translate the following English JSON into ${locale.name}. 

RULES:
1. Keep ALL JSON keys exactly the same (English). Only translate the VALUES.
2. Keep product names unchanged: "TinyClaw", "OpenClaw", "Claude Opus 4.5", "GPT-5.2", "Gemini 3 Flash", "Telegram", "Discord", "WhatsApp", "Node.js", "NPM", "SSH", "AgentPuter"
3. Keep technical terms that are universally understood: "AI", "bot", "API"
4. Keep the placeholder {count} as-is
5. Keep HTML-like markers (<1 min, ❤️) as-is
6. Adapt the tone naturally for ${locale.nativeName} speakers — not word-for-word translation but natural, persuasive marketing copy
7. For time units (min), use the conventional format in ${locale.nativeName}
8. The "$29.99/month" price should keep USD but can localize the format
9. Return ONLY valid JSON, no markdown fences, no explanation

SOURCE JSON:
${JSON.stringify(enJson, null, 2)}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  };

  // 带超时和重试的 fetch
  const MAX_RETRIES = 3;
  let res;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000); // 120s 超时
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      break; // 成功则跳出
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      process.stdout.write(` (重试 ${attempt}/${MAX_RETRIES})...`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Vertex AI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(`Empty response for ${locale.code}: ${JSON.stringify(data)}`);
  }

  // 清理可能的 markdown 包裹
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(cleaned);
}

async function main() {
  console.log("🌍 TinyClaw 多语言翻译脚本");
  console.log(`📁 项目: ${credentials.project_id}`);
  console.log(`🤖 模型: ${MODEL}`);
  console.log(`📂 输出目录: ${LOCALES_DIR}\n`);

  // 读取英文源文件
  const enJson = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, "en.json"), "utf-8"));
  console.log(`✅ 读取 en.json (${Object.keys(enJson).length} 个顶级 key)\n`);

  // 获取 access token
  console.log("🔑 获取 GCP access token...");
  const accessToken = await getAccessToken();
  console.log("✅ Token 获取成功\n");

  // 逐语言翻译
  let successCount = 0;
  let failCount = 0;

  for (const locale of TARGET_LOCALES) {
    const outFile = path.join(LOCALES_DIR, `${locale.code}.json`);

    // 跳过已存在的翻译（除非传了 --force）
    if (fs.existsSync(outFile) && !process.argv.includes("--force")) {
      console.log(`⏭️  ${locale.code} (${locale.nativeName}) — 已存在，跳过 (用 --force 强制重新翻译)`);
      continue;
    }

    process.stdout.write(`🔄 翻译 ${locale.code} (${locale.nativeName})...`);

    try {
      const translated = await translateWithGemini(enJson, locale, accessToken);
      fs.writeFileSync(outFile, JSON.stringify(translated, null, 2) + "\n");
      console.log(` ✅ 已保存 ${locale.code}.json`);
      successCount++;
    } catch (err) {
      console.log(` ❌ 失败: ${err.message}`);
      if (err.cause) console.log(`   原因: ${err.cause.message || err.cause}`);
      failCount++;
    }

    // 限流：每次请求间隔 5 秒
    if (locale !== TARGET_LOCALES[TARGET_LOCALES.length - 1]) {
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  console.log(`\n🏁 完成！成功 ${successCount}，失败 ${failCount}`);
  console.log(`📂 翻译文件位于: ${LOCALES_DIR}/`);
}

main().catch((err) => {
  console.error("❌ 脚本执行失败:", err);
  process.exit(1);
});
