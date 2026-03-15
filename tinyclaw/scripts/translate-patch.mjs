#!/usr/bin/env node
/**
 * 增量补丁翻译脚本 — 只翻译各语言文件中缺失的 key
 * 用法: node scripts/translate-patch.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAuth } from "google-auth-library";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../src/locales");
const CREDENTIALS_PATH = path.join(
  __dirname,
  "../../credentials/chatpdf-pro-9d3ad-firebase-adminsdk-pzi27-47cf27d8c3.json"
);

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

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
const PROJECT_ID = credentials.project_id;
const REGION = "us-central1";
const MODEL = "gemini-2.0-flash-001";

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

/** 找出 enObj 中有但 targetObj 中没有的 key（递归，返回 dot-path） */
function findMissingKeys(enObj, targetObj, prefix = "") {
  const missing = {};
  for (const key of Object.keys(enObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in targetObj)) {
      missing[key] = enObj[key];
    } else if (
      typeof enObj[key] === "object" &&
      enObj[key] !== null &&
      !Array.isArray(enObj[key])
    ) {
      const subMissing = findMissingKeys(enObj[key], targetObj[key], fullKey);
      if (Object.keys(subMissing).length > 0) {
        missing[key] = subMissing;
      }
    }
  }
  return missing;
}

/** 深度合并（target 中不存在的 key 从 source 补充） */
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      key in target &&
      typeof target[key] === "object"
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else if (!(key in target)) {
      result[key] = source[key];
    }
  }
  return result;
}

async function translatePatch(missingObj, locale, accessToken) {
  const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:generateContent`;

  const prompt = `You are a professional translator specializing in SaaS/tech product localization.

CONTEXT: TinyClaw is a one-click deployment platform for OpenClaw (an AI assistant framework). Users can deploy their own 24/7 AI assistant connected to Telegram/Discord/WhatsApp in under 1 minute.

TASK: Translate the following English JSON into ${locale.name}.

RULES:
1. Keep ALL JSON keys exactly the same (English). Only translate the VALUES.
2. Keep product names unchanged: "TinyClaw", "OpenClaw", "Telegram", "Discord", "WhatsApp", "Claude", "GPT", "Gemini"
3. Keep technical terms: "AI", "bot", "API", "QR code", "Dashboard"
4. Keep the placeholder {count} as-is
5. Keep price strings as-is: "$1.99", "$9.99/mo", "$49.99"
6. Adapt the tone naturally for ${locale.nativeName} speakers
7. Return ONLY valid JSON, no markdown fences, no explanation

SOURCE JSON:
${JSON.stringify(missingObj, null, 2)}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  };

  const MAX_RETRIES = 3;
  let res;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
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
      break;
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
  if (!text) throw new Error(`Empty response for ${locale.code}`);

  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(cleaned);
}

async function main() {
  console.log("🔧 TinyClaw 增量补丁翻译脚本");
  console.log(`🤖 模型: ${MODEL}\n`);

  const enJson = JSON.parse(
    fs.readFileSync(path.join(LOCALES_DIR, "en.json"), "utf-8")
  );

  console.log("🔑 获取 GCP access token...");
  const accessToken = await getAccessToken();
  console.log("✅ Token 获取成功\n");

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const locale of TARGET_LOCALES) {
    const outFile = path.join(LOCALES_DIR, `${locale.code}.json`);

    if (!fs.existsSync(outFile)) {
      console.log(`⏭️  ${locale.code} — 文件不存在，跳过（请先运行 translate.mjs）`);
      skipCount++;
      continue;
    }

    const existing = JSON.parse(fs.readFileSync(outFile, "utf-8"));
    const missing = findMissingKeys(enJson, existing);

    if (Object.keys(missing).length === 0) {
      console.log(`✅ ${locale.code} (${locale.nativeName}) — 无缺失 key`);
      skipCount++;
      continue;
    }

    const missingCount = JSON.stringify(missing).split(":").length - 1;
    process.stdout.write(
      `🔄 ${locale.code} (${locale.nativeName}) — 补丁翻译 ${missingCount} 个 key...`
    );

    try {
      const translated = await translatePatch(missing, locale, accessToken);
      const merged = deepMerge(existing, translated);
      fs.writeFileSync(outFile, JSON.stringify(merged, null, 2) + "\n");
      console.log(` ✅ 已合并保存`);
      successCount++;
    } catch (err) {
      console.log(` ❌ 失败: ${err.message}`);
      failCount++;
    }

    if (locale !== TARGET_LOCALES[TARGET_LOCALES.length - 1]) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\n🏁 完成！更新 ${successCount}，跳过 ${skipCount}，失败 ${failCount}`);
}

main().catch((err) => {
  console.error("❌ 脚本执行失败:", err);
  process.exit(1);
});
