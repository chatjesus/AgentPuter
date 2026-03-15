#!/usr/bin/env node
/**
 * AgentPuter 多语言批量翻译脚本
 * 使用 Google Vertex AI Gemini 2.5 Pro 批量翻译网站内容
 *
 * 用法:
 *   GOOGLE_APPLICATION_CREDENTIALS=./credentials/xxx.json node scripts/translate.mjs
 *   GOOGLE_APPLICATION_CREDENTIALS=./credentials/xxx.json node scripts/translate.mjs --lang=ja,ko
 *   GOOGLE_APPLICATION_CREDENTIALS=./credentials/xxx.json node scripts/translate.mjs --force
 */

import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ═══════════════════ 配置 ═══════════════════

const PROJECT_ID = 'chatpdf-pro-9d3ad';
const LOCATION = 'us-central1';
const MODEL_ID = 'gemini-2.5-pro';

// 目标语言（不含已有的 en 和 zh）
const ALL_LANGUAGES = {
  ja:      { name: 'Japanese',              nativeName: '日本語',     htmlLang: 'ja',    ogLocale: 'ja_JP', dir: 'ja',    dateLocale: 'ja-JP',   blogCollection: 'ja-blog',    homeName: 'ホーム',    featuresName: '機能',     docsName: 'ドキュメント' },
  ko:      { name: 'Korean',                nativeName: '한국어',     htmlLang: 'ko',    ogLocale: 'ko_KR', dir: 'ko',    dateLocale: 'ko-KR',   blogCollection: 'ko-blog',    homeName: '홈',       featuresName: '기능',     docsName: '문서' },
  es:      { name: 'Spanish',               nativeName: 'Español',   htmlLang: 'es',    ogLocale: 'es_ES', dir: 'es',    dateLocale: 'es-ES',   blogCollection: 'es-blog',    homeName: 'Inicio',   featuresName: 'Funciones', docsName: 'Documentación' },
  'pt-br': { name: 'Brazilian Portuguese',  nativeName: 'Português', htmlLang: 'pt-BR', ogLocale: 'pt_BR', dir: 'pt-br', dateLocale: 'pt-BR',   blogCollection: 'pt-br-blog', homeName: 'Início',   featuresName: 'Recursos',  docsName: 'Documentação' },
  de:      { name: 'German',                nativeName: 'Deutsch',   htmlLang: 'de',    ogLocale: 'de_DE', dir: 'de',    dateLocale: 'de-DE',   blogCollection: 'de-blog',    homeName: 'Startseite', featuresName: 'Funktionen', docsName: 'Dokumentation' },
  fr:      { name: 'French',                nativeName: 'Français',  htmlLang: 'fr',    ogLocale: 'fr_FR', dir: 'fr',    dateLocale: 'fr-FR',   blogCollection: 'fr-blog',    homeName: 'Accueil',  featuresName: 'Fonctionnalités', docsName: 'Documentation' },
};

// 需要翻译的组件文件列表（相对于 src/components/）
const COMPONENT_FILES = [
  'Header.astro',
  'Footer.astro',
  'Hero.astro',
  'PainPoints.astro',
  'Solution.astro',
  'HowItWorks.astro',
  'CTA.astro',
  'features/FeaturesHero.astro',
  'features/BeforeAfter.astro',
  'features/CommunityVoices.astro',
  'features/CoreRoles.astro',
  'features/UseCases.astro',
  'features/ComparisonTable.astro',
  'features/Architecture.astro',
  'features/SecurityTrust.astro',
  'features/FeaturesCTA.astro',
  'docs/DocsSidebar.astro',
  'docs/DocsContent.astro',
  'docs/DocsChannels.astro',
  'docs/AddChannelDashboard.astro',
];

// 需要翻译的页面路由文件（使用 zh 版作模板）
const PAGE_ROUTES = [
  { zhSrc: 'src/pages/zh/index.astro',              relDest: 'index.astro' },
  { zhSrc: 'src/pages/zh/features.astro',            relDest: 'features.astro' },
  { zhSrc: 'src/pages/zh/docs/index.astro',           relDest: 'docs/index.astro' },
  { zhSrc: 'src/pages/zh/docs/add-channel.astro',     relDest: 'docs/add-channel.astro' },
  { zhSrc: 'src/pages/zh/blog/index.astro',            relDest: 'blog/index.astro' },
  { zhSrc: 'src/pages/zh/blog/[...slug].astro',        relDest: 'blog/[...slug].astro' },
];

// 博客文章
const BLOG_POSTS = [
  'agent-needs-its-own-computer.md',
  'agent-skills-ecosystem.md',
  'dissecting-openclaw-architecture.md',
];

// ═══════════════════ 产品上下文 Prompt ═══════════════════

function getSystemPrompt(langName) {
  return `You are a professional localization translator for AgentPuter, a cloud infrastructure platform for AI Agents.

PRODUCT CONTEXT:
AgentPuter provides 24/7 cloud runtime for AI Agents — "a real computer for your AI agent."
It supports OpenClaw, ClawBot, and MoltBot frameworks.
Key features: Privacy Proxy, Context Manager, Unified Interface, Persistent Workspace, Accountability Log.
Target audience: developers, tech-savvy users, AI enthusiasts.
Tone: technical yet accessible, slightly playful (terminal/hacker aesthetic).

NEVER TRANSLATE (keep in English):
- Brand/product names: AgentPuter, OpenClaw, ClawBot, MoltBot, ClawHub, Pod, Dashboard, BotFather, Skills
- Technical terms commonly kept in English in ${langName}: SSH, API, Token, OAuth, VPS, LLM, DM Pairing, PII, AES-256, JSON-LD, CLI, SDK, npm, deploy, webhook
- All code: variable names, function names, CSS classes, HTML attributes/tags, Astro syntax, file paths, URLs, email addresses
- ASCII art box-drawing characters (─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬)

TRANSLATE to ${langName}:
- All human-visible text: headings, paragraphs, labels, descriptions, button text, placeholder text, alt text, aria-labels
- Code comments (// and /* */)
- String values in frontmatter JS objects that contain human-readable text (titles, descriptions, names in schema.org data)
- Meta content: title, description, keywords/tags arrays

CRITICAL FORMATTING RULES:
- Return ONLY the raw translated file content
- Do NOT wrap output in markdown code blocks (\`\`\`)
- Preserve exact file structure, indentation, line breaks
- Preserve all Astro/JSX syntax, HTML tags, CSS classes UNCHANGED
- For terminal-style UI: keep command syntax ($ cat, ls -la, etc.), translate description text
- For ASCII art diagrams: preserve visual structure, translate labels only if they fit without breaking alignment
- Keep all import statements unchanged
- Keep all JavaScript logic unchanged — only translate string literal values

QUALITY:
- Use natural, native-sounding ${langName} — not machine-translation-style
- Maintain the technical/developer tone
- Be concise; if the original is terse, keep it terse`;
}

// ═══════════════════ Gemini API ═══════════════════

let vertexAI;
let model;

function initGemini() {
  vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
  model = vertexAI.getGenerativeModel({
    model: MODEL_ID,
    generationConfig: {
      temperature: 0.3,      // 低温度 = 更准确的翻译
      topP: 0.8,
      maxOutputTokens: 65535,
    },
  });
}

async function translateContent(content, langName, fileType = 'astro component') {
  const systemPrompt = getSystemPrompt(langName);
  const userPrompt = `Translate the following ${fileType} file from its current language to ${langName}.\n\nFile content:\n${content}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      });
      let text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini');
      // 清理：去掉可能的 markdown 代码块包裹
      text = text.replace(/^```(?:astro|html|markdown|md|jsx|tsx)?\s*\n/, '').replace(/\n```\s*$/, '');
      return text;
    } catch (err) {
      console.error(`  ⚠ 翻译失败 (尝试 ${attempt}/3): ${err.message}`);
      if (attempt < 3) {
        const wait = attempt * 5000;
        console.log(`  ⏳ 等待 ${wait / 1000}s 后重试...`);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
}

// ═══════════════════ 文件操作 ═══════════════════

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readFile(relPath) {
  return fs.readFile(path.join(ROOT, relPath), 'utf-8');
}

async function writeFileContent(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  await ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, content, 'utf-8');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════ 翻译任务 ═══════════════════

/**
 * 1. 翻译组件文件
 * 从英文源文件翻译到目标语言
 */
async function translateComponents(langKey, langConfig, force) {
  console.log(`\n📦 翻译组件文件 → ${langConfig.nativeName} (${langKey})`);
  let count = 0;
  for (const file of COMPONENT_FILES) {
    const destPath = `src/components/${langConfig.dir}/${file}`;
    if (!force && await fileExists(path.join(ROOT, destPath))) {
      console.log(`  ⏭ 跳过 (已存在): ${destPath}`);
      continue;
    }
    const srcContent = await readFile(`src/components/${file}`);
    console.log(`  🔄 翻译: ${file} → ${langConfig.dir}/${file}`);
    const translated = await translateContent(srcContent, langConfig.name, 'Astro component');
    await writeFileContent(destPath, translated);
    count++;
    console.log(`  ✅ 完成: ${destPath}`);
    await sleep(1500); // 避免 API 限速
  }
  return count;
}

/**
 * 2. 翻译页面路由文件
 * 以 zh 版本为模板，替换语言标识后翻译中文内容
 */
async function translatePageRoutes(langKey, langConfig, force) {
  console.log(`\n📄 翻译页面路由 → ${langConfig.nativeName} (${langKey})`);
  let count = 0;
  for (const route of PAGE_ROUTES) {
    const destPath = `src/pages/${langConfig.dir}/${route.relDest}`;
    if (!force && await fileExists(path.join(ROOT, destPath))) {
      console.log(`  ⏭ 跳过 (已存在): ${destPath}`);
      continue;
    }
    let zhContent;
    try {
      zhContent = await readFile(route.zhSrc);
    } catch {
      console.log(`  ⚠ zh 模板不存在，跳过: ${route.zhSrc}`);
      continue;
    }
    // 替换路径中的 zh → 目标语言
    let prepared = zhContent
      .replace(/components\/zh\//g, `components/${langConfig.dir}/`)
      .replace(/\/zh\//g, `/${langConfig.dir}/`)
      .replace(/\/zh'/g, `/${langConfig.dir}'`)
      .replace(/\/zh"/g, `/${langConfig.dir}"`)
      .replace(/\/zh\`/g, `/${langConfig.dir}\``)
      .replace(/'zh-blog'/g, `'${langConfig.blogCollection}'`)
      .replace(/"zh-blog"/g, `"${langConfig.blogCollection}"`)
      .replace(/ZhBlogPost/g, `${capitalize(langKey.replace('-', ''))}BlogPost`)
      .replace(/inLanguage:\s*'zh-CN'/g, `inLanguage: '${langConfig.htmlLang}'`)
      .replace(/inLanguage:\s*"zh-CN"/g, `inLanguage: "${langConfig.htmlLang}"`)
      .replace(/toLocaleDateString\('zh-CN'/g, `toLocaleDateString('${langConfig.dateLocale}'`);
    console.log(`  🔄 翻译: ${route.zhSrc} → ${destPath}`);
    const translated = await translateContent(prepared, langConfig.name, 'Astro page route');
    await writeFileContent(destPath, translated);
    count++;
    console.log(`  ✅ 完成: ${destPath}`);
    await sleep(1500);
  }
  return count;
}

/**
 * 3. 生成博客布局文件
 * 以 ZhBlogPost.astro 为模板
 */
async function translateBlogLayout(langKey, langConfig, force) {
  const layoutName = `${capitalize(langKey.replace('-', ''))}BlogPost.astro`;
  const destPath = `src/layouts/${layoutName}`;
  if (!force && await fileExists(path.join(ROOT, destPath))) {
    console.log(`  ⏭ 跳过博客布局 (已存在): ${destPath}`);
    return 0;
  }
  console.log(`\n📝 翻译博客布局 → ${layoutName}`);
  let zhLayout;
  try {
    zhLayout = await readFile('src/layouts/ZhBlogPost.astro');
  } catch {
    console.log(`  ⚠ ZhBlogPost.astro 不存在，跳过`);
    return 0;
  }
  // 替换路径和语言标识
  let prepared = zhLayout
    .replace(/components\/zh\//g, `components/${langConfig.dir}/`)
    .replace(/\/zh\//g, `/${langConfig.dir}/`)
    .replace(/'zh-CN'/g, `'${langConfig.htmlLang}'`)
    .replace(/"zh-CN"/g, `"${langConfig.htmlLang}"`)
    .replace(/toLocaleDateString\('zh-CN'/g, `toLocaleDateString('${langConfig.dateLocale}'`);
  const translated = await translateContent(prepared, langConfig.name, 'Astro blog layout');
  await writeFileContent(destPath, translated);
  console.log(`  ✅ 完成: ${destPath}`);
  await sleep(1500);
  return 1;
}

/**
 * 4. 翻译博客 Markdown 文件
 */
async function translateBlogPosts(langKey, langConfig, force) {
  console.log(`\n📰 翻译博客文章 → ${langConfig.nativeName} (${langKey})`);
  const collectionDir = `src/content/${langConfig.blogCollection}`;
  let count = 0;
  for (const post of BLOG_POSTS) {
    const destPath = `${collectionDir}/${post}`;
    if (!force && await fileExists(path.join(ROOT, destPath))) {
      console.log(`  ⏭ 跳过 (已存在): ${destPath}`);
      continue;
    }
    const enContent = await readFile(`src/content/blog/${post}`);
    console.log(`  🔄 翻译: ${post}`);
    const translated = await translateContent(enContent, langConfig.name, 'Markdown blog post');
    await writeFileContent(destPath, translated);
    count++;
    console.log(`  ✅ 完成: ${destPath}`);
    await sleep(2000); // 博客文章较长，间隔稍大
  }
  return count;
}

/**
 * 5. 更新 content/config.ts 添加新语言的 blog collection
 */
async function updateContentConfig(languages) {
  console.log(`\n⚙️ 更新 content/config.ts`);
  let config = await readFile('src/content/config.ts');
  let modified = false;
  for (const [langKey, langConfig] of Object.entries(languages)) {
    const collName = langConfig.blogCollection;
    const varName = collName.replace(/-/g, '_').replace(/^(\w)/, (m) => m);
    // 检查是否已存在
    if (config.includes(`'${collName}'`)) {
      console.log(`  ⏭ ${collName} 已存在于 config.ts`);
      continue;
    }
    // 在 zhBlog 定义后追加
    const collectionDef = `\nconst ${varName.replace(/-/g, '')} = defineCollection({\n  type: 'content',\n  schema: blogSchema,\n});\n`;
    // 在 export 之前插入 collection 定义
    config = config.replace(
      /\nexport const collections = \{/,
      `${collectionDef}\nexport const collections = {`
    );
    // 在 collections 对象中添加
    config = config.replace(
      "'zh-blog': zhBlog",
      `'zh-blog': zhBlog, '${collName}': ${varName.replace(/-/g, '')}`
    );
    modified = true;
    console.log(`  ✅ 添加 collection: ${collName}`);
  }
  if (modified) {
    await writeFileContent('src/content/config.ts', config);
  }
}

// ═══════════════════ 工具函数 ═══════════════════

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const langArg = args.find(a => a.startsWith('--lang='));
  const skipBlog = args.includes('--skip-blog');
  let targetLangs = Object.keys(ALL_LANGUAGES);
  if (langArg) {
    targetLangs = langArg.replace('--lang=', '').split(',').filter(l => ALL_LANGUAGES[l]);
  }
  return { force, targetLangs, skipBlog };
}

// ═══════════════════ 主流程 ═══════════════════

async function main() {
  const { force, targetLangs, skipBlog } = parseArgs();

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   AgentPuter 多语言批量翻译脚本                  ║');
  console.log('║   Engine: Gemini 2.5 Pro (Vertex AI)            ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`\n🎯 目标语言: ${targetLangs.map(l => `${l} (${ALL_LANGUAGES[l].nativeName})`).join(', ')}`);
  console.log(`🔄 强制覆盖: ${force ? '是' : '否'}`);
  console.log(`📰 翻译博客: ${skipBlog ? '跳过' : '是'}`);

  // 计算总文件数
  const filesPerLang = COMPONENT_FILES.length + PAGE_ROUTES.length + (skipBlog ? 0 : BLOG_POSTS.length + 1);
  const totalFiles = filesPerLang * targetLangs.length;
  console.log(`📊 预估文件数: ${totalFiles} (每种语言 ${filesPerLang} 个)\n`);

  // 初始化 Gemini
  console.log('🔑 初始化 Vertex AI Gemini...');
  initGemini();
  console.log('✅ Gemini 就绪\n');

  const startTime = Date.now();
  let totalTranslated = 0;

  for (const langKey of targetLangs) {
    const langConfig = ALL_LANGUAGES[langKey];
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`🌐 开始翻译: ${langConfig.name} (${langConfig.nativeName})`);
    console.log(`${'═'.repeat(50)}`);

    const langStart = Date.now();

    // 1. 组件
    totalTranslated += await translateComponents(langKey, langConfig, force);

    // 2. 页面路由
    totalTranslated += await translatePageRoutes(langKey, langConfig, force);

    // 3. 博客布局
    if (!skipBlog) {
      totalTranslated += await translateBlogLayout(langKey, langConfig, force);
    }

    // 4. 博客文章
    if (!skipBlog) {
      totalTranslated += await translateBlogPosts(langKey, langConfig, force);
    }

    const langElapsed = ((Date.now() - langStart) / 1000).toFixed(1);
    console.log(`\n✅ ${langConfig.nativeName} 完成！耗时 ${langElapsed}s`);
  }

  // 5. 更新 content config
  if (!skipBlog) {
    const selectedLangs = {};
    for (const k of targetLangs) selectedLangs[k] = ALL_LANGUAGES[k];
    await updateContentConfig(selectedLangs);
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`🎉 全部翻译完成！`);
  console.log(`   翻译文件数: ${totalTranslated}`);
  console.log(`   总耗时: ${totalElapsed}s`);
  console.log(`${'═'.repeat(50)}`);
}

main().catch(err => {
  console.error('\n❌ 脚本执行失败:', err.message);
  process.exit(1);
});
