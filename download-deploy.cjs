const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://6fb9ccdd.agentputer.pages.dev';
const OUT_DIR = path.join(__dirname, 'deploy-mirror');

// Complete file list from the deployment API
const files = [
  "/404.html",
  "/_astro/LanguageSwitcher.astro_astro_type_script_index_0_lang.BiPt5_v-.js",
  "/_astro/MatrixRain.astro_astro_type_script_index_0_lang.BUR_6jgc.js",
  "/_astro/_slug_.CUcOCpHJ.css",
  "/_astro/_slug_.CxhqtQFk.css",
  "/_astro/_slug_.DM3EUOA_.css",
  "/_astro/hoisted.59JzbWNo.js",
  "/_astro/hoisted.BCrxlVsq.js",
  "/_astro/hoisted.Bl-zZglg.js",
  "/_astro/hoisted.Br2_lRcK.js",
  "/_astro/hoisted.CReWVP5t.js",
  "/_astro/hoisted.ConqcoQo.js",
  "/_astro/hoisted.DDW4TjDC.js",
  "/_astro/hoisted.DDgUfvSn.js",
  "/_astro/hoisted.DMCClwIQ.js",
  "/_astro/hoisted.DZCh4MZd.js",
  "/_astro/hoisted.Dc5-n-N_.js",
  "/_astro/hoisted.DoLuJNs3.js",
  "/_astro/hoisted.DqigeG4Y.js",
  "/_astro/hoisted.Md9QC2yI.js",
  "/_astro/hoisted.NLH3K561.js",
  "/_astro/hoisted.TVTqSKbE.js",
  "/_astro/hoisted.eVEf7vT7.js",
  "/blog/09-deploy-openclaw/index.html",
  "/blog/10-openclaw-review/index.html",
  "/blog/10-skills-market/index.html",
  "/blog/11-model-showdown/index.html",
  "/blog/12-agent-teams/index.html",
  "/blog/13-soul-md/index.html",
  "/blog/14-openclaw-tips/index.html",
  "/blog/15-openclaw-security/index.html",
  "/blog/15-perplexity-computer-vs-openclaw/index.html",
  "/blog/16-real-workflows/index.html",
  "/blog/17-lossless-claw/index.html",
  "/blog/18-cost-guide/index.html",
  "/blog/agent-capability-stack.png",
  "/blog/agent-needs-its-own-computer/index.html",
  "/blog/agent-skills-ecosystem/index.html",
  "/blog/agentputer-architecture.png",
  "/blog/agentputer-architecture.webp",
  "/blog/auth-persistence-system.png",
  "/blog/auth-persistence-system.webp",
  "/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/blog/deployment-architecture.png",
  "/blog/deployment-architecture.webp",
  "/blog/dissecting-openclaw-architecture/index.html",
  "/blog/document-understanding-engine.png",
  "/blog/document-understanding-engine.webp",
  "/blog/index.html",
  "/blog/multi-agent-collaboration.png",
  "/blog/multi-agent-collaboration.webp",
  "/blog/openclaw-brain-body-soul.jpg",
  "/blog/openclaw-creator-joins-openai/index.html",
  "/blog/openclaw-gateway-architecture.jpg",
  "/blog/operation-rollback-system.png",
  "/blog/operation-rollback-system.webp",
  "/blog/skills-vs-mcp.png",
  "/blog/vibe-working-when-agents-work/index.html",
  "/blog/who-makes-money-from-openclaw/index.html",
  "/cancel/index.html",
  "/de/blog/09-deploy-openclaw/index.html",
  "/de/blog/10-openclaw-review/index.html",
  "/de/blog/10-skills-market/index.html",
  "/de/blog/11-model-showdown/index.html",
  "/de/blog/12-agent-teams/index.html",
  "/de/blog/13-soul-md/index.html",
  "/de/blog/14-openclaw-tips/index.html",
  "/de/blog/15-openclaw-security/index.html",
  "/de/blog/15-perplexity-computer-vs-openclaw/index.html",
  "/de/blog/16-real-workflows/index.html",
  "/de/blog/17-lossless-claw/index.html",
  "/de/blog/18-cost-guide/index.html",
  "/de/blog/agent-needs-its-own-computer/index.html",
  "/de/blog/agent-skills-ecosystem/index.html",
  "/de/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/de/blog/dissecting-openclaw-architecture/index.html",
  "/de/blog/index.html",
  "/de/blog/openclaw-creator-joins-openai/index.html",
  "/de/blog/vibe-working-when-agents-work/index.html",
  "/de/blog/who-makes-money-from-openclaw/index.html",
  "/de/docs/add-channel/index.html",
  "/de/docs/index.html",
  "/de/features/index.html",
  "/de/index.html",
  "/de/pricing/index.html",
  "/de/tools/index.html",
  "/demo/index.html",
  "/docs/add-channel/index.html",
  "/docs/index.html",
  "/es/blog/09-deploy-openclaw/index.html",
  "/es/blog/10-openclaw-review/index.html",
  "/es/blog/10-skills-market/index.html",
  "/es/blog/11-model-showdown/index.html",
  "/es/blog/12-agent-teams/index.html",
  "/es/blog/13-soul-md/index.html",
  "/es/blog/14-openclaw-tips/index.html",
  "/es/blog/15-openclaw-security/index.html",
  "/es/blog/15-perplexity-computer-vs-openclaw/index.html",
  "/es/blog/16-real-workflows/index.html",
  "/es/blog/17-lossless-claw/index.html",
  "/es/blog/18-cost-guide/index.html",
  "/es/blog/agent-needs-its-own-computer/index.html",
  "/es/blog/agent-skills-ecosystem/index.html",
  "/es/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/es/blog/dissecting-openclaw-architecture/index.html",
  "/es/blog/index.html",
  "/es/blog/openclaw-creator-joins-openai/index.html",
  "/es/blog/vibe-working-when-agents-work/index.html",
  "/es/blog/who-makes-money-from-openclaw/index.html",
  "/es/docs/add-channel/index.html",
  "/es/docs/index.html",
  "/es/features/index.html",
  "/es/index.html",
  "/es/pricing/index.html",
  "/es/tools/index.html",
  "/favicon.svg",
  "/features/index.html",
  "/fr/blog/09-deploy-openclaw/index.html",
  "/fr/blog/10-openclaw-review/index.html",
  "/fr/blog/10-skills-market/index.html",
  "/fr/blog/11-model-showdown/index.html",
  "/fr/blog/12-agent-teams/index.html",
  "/fr/blog/13-soul-md/index.html",
  "/fr/blog/14-openclaw-tips/index.html",
  "/fr/blog/15-openclaw-security/index.html",
  "/fr/blog/15-perplexity-computer-vs-openclaw/index.html",
  "/fr/blog/16-real-workflows/index.html",
  "/fr/blog/17-lossless-claw/index.html",
  "/fr/blog/18-cost-guide/index.html",
  "/fr/blog/agent-needs-its-own-computer/index.html",
  "/fr/blog/agent-skills-ecosystem/index.html",
  "/fr/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/fr/blog/dissecting-openclaw-architecture/index.html",
  "/fr/blog/index.html",
  "/fr/blog/openclaw-creator-joins-openai/index.html",
  "/fr/blog/vibe-working-when-agents-work/index.html",
  "/fr/blog/who-makes-money-from-openclaw/index.html",
  "/fr/docs/add-channel/index.html",
  "/fr/docs/index.html",
  "/fr/features/index.html",
  "/fr/index.html",
  "/fr/pricing/index.html",
  "/fr/tools/index.html",
  "/index.html",
  "/ja/blog/09-deploy-openclaw/index.html",
  "/ja/blog/10-openclaw-review/index.html",
  "/ja/blog/10-skills-market/index.html",
  "/ja/blog/11-model-showdown/index.html",
  "/ja/blog/12-agent-teams/index.html",
  "/ja/blog/13-soul-md/index.html",
  "/ja/blog/14-openclaw-tips/index.html",
  "/ja/blog/15-openclaw-security/index.html",
  "/ja/blog/15-perplexity-computer-vs-openclaw/index.html",
  "/ja/blog/16-real-workflows/index.html",
  "/ja/blog/17-lossless-claw/index.html",
  "/ja/blog/18-cost-guide/index.html",
  "/ja/blog/agent-needs-its-own-computer/index.html",
  "/ja/blog/agent-skills-ecosystem/index.html",
  "/ja/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/ja/blog/dissecting-openclaw-architecture/index.html",
  "/ja/blog/index.html",
  "/ja/blog/openclaw-creator-joins-openai/index.html",
  "/ja/blog/vibe-working-when-agents-work/index.html",
  "/ja/blog/who-makes-money-from-openclaw/index.html",
  "/ja/docs/add-channel/index.html",
  "/ja/docs/index.html",
  "/ja/features/index.html",
  "/ja/index.html",
  "/ja/pricing/index.html",
  "/ja/tools/index.html",
  "/ko/blog/09-deploy-openclaw/index.html",
  "/ko/blog/10-openclaw-review/index.html",
  "/ko/blog/10-skills-market/index.html",
  "/ko/blog/11-model-showdown/index.html",
  "/ko/blog/12-agent-teams/index.html",
  "/ko/blog/13-soul-md/index.html",
  "/ko/blog/14-openclaw-tips/index.html",
  "/ko/blog/15-openclaw-security/index.html",
  "/ko/blog/15-perplexity-computer-vs-openclaw/index.html",
  "/ko/blog/16-real-workflows/index.html",
  "/ko/blog/17-lossless-claw/index.html",
  "/ko/blog/18-cost-guide/index.html",
  "/ko/blog/agent-needs-its-own-computer/index.html",
  "/ko/blog/agent-skills-ecosystem/index.html",
  "/ko/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/ko/blog/dissecting-openclaw-architecture/index.html",
  "/ko/blog/index.html",
  "/ko/blog/openclaw-creator-joins-openai/index.html",
  "/ko/blog/vibe-working-when-agents-work/index.html",
  "/ko/blog/who-makes-money-from-openclaw/index.html",
  "/ko/docs/add-channel/index.html",
  "/ko/docs/index.html",
  "/ko/features/index.html",
  "/ko/index.html",
  "/ko/pricing/index.html",
  "/ko/tools/index.html",
  "/og-default.png",
  "/pricing/index.html",
  "/privacy/index.html",
  "/pt-br/blog/09-deploy-openclaw/index.html",
  "/pt-br/blog/10-openclaw-review/index.html",
  "/pt-br/blog/10-skills-market/index.html",
  "/pt-br/blog/11-model-showdown/index.html",
  "/pt-br/blog/12-agent-teams/index.html",
  "/pt-br/blog/13-soul-md/index.html",
  "/pt-br/blog/14-openclaw-tips/index.html",
  "/pt-br/blog/15-openclaw-security/index.html",
  "/pt-br/blog/15-perplexity-computer-vs-openclaw/index.html",
  "/pt-br/blog/16-real-workflows/index.html",
  "/pt-br/blog/agent-needs-its-own-computer/index.html",
  "/pt-br/blog/agent-skills-ecosystem/index.html",
  "/pt-br/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/pt-br/blog/dissecting-openclaw-architecture/index.html",
  "/pt-br/blog/index.html",
  "/pt-br/blog/openclaw-creator-joins-openai/index.html",
  "/pt-br/blog/vibe-working-when-agents-work/index.html",
  "/pt-br/blog/who-makes-money-from-openclaw/index.html",
  "/pt-br/docs/add-channel/index.html",
  "/pt-br/docs/index.html",
  "/pt-br/features/index.html",
  "/pt-br/index.html",
  "/pt-br/pricing/index.html",
  "/pt-br/tools/index.html",
  "/robots.txt",
  "/ru/blog/index.html",
  "/site.webmanifest",
  "/sitemap-0.xml",
  "/sitemap-index.xml",
  "/success/index.html",
  "/terms/index.html",
  "/tools/index.html",
  "/zh-tw/blog/09-deploy-openclaw/index.html",
  "/zh-tw/blog/10-openclaw-review/index.html",
  "/zh-tw/blog/10-skills-market/index.html",
  "/zh-tw/blog/11-model-showdown/index.html",
  "/zh-tw/blog/12-agent-teams/index.html",
  "/zh-tw/blog/13-soul-md/index.html",
  "/zh-tw/blog/14-openclaw-tips/index.html",
  "/zh-tw/blog/15-openclaw-security/index.html",
  "/zh-tw/blog/15-perplexity-computer-vs-openclaw/index.html",
  "/zh-tw/blog/16-real-workflows/index.html",
  "/zh-tw/blog/agent-needs-its-own-computer/index.html",
  "/zh-tw/blog/agent-skills-ecosystem/index.html",
  "/zh-tw/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/zh-tw/blog/dissecting-openclaw-architecture/index.html",
  "/zh-tw/blog/index.html",
  "/zh-tw/blog/openclaw-creator-joins-openai/index.html",
  "/zh-tw/blog/vibe-working-when-agents-work/index.html",
  "/zh-tw/blog/who-makes-money-from-openclaw/index.html",
  "/zh-tw/index.html",
  "/zh/blog/09-deploy-openclaw/index.html",
  "/zh/blog/10-openclaw-review/index.html",
  "/zh/blog/10-skills-market/index.html",
  "/zh/blog/11-model-showdown/index.html",
  "/zh/blog/12-agent-teams/index.html",
  "/zh/blog/13-soul-md/index.html",
  "/zh/blog/14-openclaw-tips/index.html",
  "/zh/blog/15-openclaw-security/index.html",
  "/zh/blog/16-real-workflows/index.html",
  "/zh/blog/agent-needs-its-own-computer/index.html",
  "/zh/blog/agent-skills-ecosystem/index.html",
  "/zh/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/zh/blog/dissecting-openclaw-architecture/index.html",
  "/zh/blog/index.html",
  "/zh/blog/openclaw-creator-joins-openai/index.html",
  "/zh/blog/vibe-working-when-agents-work/index.html",
  "/zh/blog/who-makes-money-from-openclaw/index.html",
  "/zh/docs/add-channel/index.html",
  "/zh/docs/index.html",
  "/zh/features/index.html",
  "/zh/index.html",
  "/zh/pricing/index.html",
  "/zh/tools/index.html",
  // Additional files from public/ that may not be in the files list
  "/_headers",
  "/_redirects",
  "/llms.txt",
  "/llms-full.txt",
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    
    const get = url.startsWith('https') ? https : http;
    get.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 308) {
        // Follow redirect
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        resolve({ skipped: true, status: response.statusCode });
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve({ ok: true }); });
      file.on('error', reject);
    }).on('error', (err) => {
      file.close();
      try { fs.unlinkSync(destPath); } catch(e) {}
      reject(err);
    });
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  
  let ok = 0, skipped = 0, failed = 0;
  
  // Process in batches of 10 concurrent downloads
  for (let i = 0; i < files.length; i += 10) {
    const batch = files.slice(i, i + 10);
    const promises = batch.map(async (filePath) => {
      const url = BASE_URL + filePath;
      const destPath = path.join(OUT_DIR, filePath.replace(/\//g, path.sep));
      
      try {
        const result = await downloadFile(url, destPath);
        if (result.skipped) {
          process.stdout.write(`SKIP(${result.status}): ${filePath}\n`);
          skipped++;
        } else {
          process.stdout.write(`OK: ${filePath}\n`);
          ok++;
        }
      } catch (err) {
        process.stdout.write(`ERR: ${filePath}: ${err.message}\n`);
        failed++;
      }
    });
    await Promise.all(promises);
  }
  
  console.log(`\nDone! OK: ${ok}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(console.error);
