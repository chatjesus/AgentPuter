const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.agentputer.com';
const OUT_DIR = path.join(__dirname, 'deploy-mirror');

// All files that should be in the deployment
const allFiles = [
  "/404.html",
  "/index.html",
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
  "/blog/agent-needs-its-own-computer/index.html",
  "/blog/agent-skills-ecosystem/index.html",
  "/blog/deep-dive-clawdbot-breakout-agent/index.html",
  "/blog/dissecting-openclaw-architecture/index.html",
  "/blog/openclaw-creator-joins-openai/index.html",
  "/blog/vibe-working-when-agents-work/index.html",
  "/blog/who-makes-money-from-openclaw/index.html",
  "/de/index.html",
  "/de/features/index.html",
  "/de/pricing/index.html",
  "/de/tools/index.html",
  "/de/blog/index.html",
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
  "/de/blog/openclaw-creator-joins-openai/index.html",
  "/de/blog/vibe-working-when-agents-work/index.html",
  "/de/blog/who-makes-money-from-openclaw/index.html",
  "/de/docs/index.html",
  "/de/docs/add-channel/index.html",
  "/es/index.html",
  "/es/features/index.html",
  "/es/pricing/index.html",
  "/es/tools/index.html",
  "/es/blog/index.html",
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
  "/es/blog/openclaw-creator-joins-openai/index.html",
  "/es/blog/vibe-working-when-agents-work/index.html",
  "/es/blog/who-makes-money-from-openclaw/index.html",
  "/es/docs/index.html",
  "/es/docs/add-channel/index.html",
  "/fr/index.html",
  "/fr/features/index.html",
  "/fr/pricing/index.html",
  "/fr/tools/index.html",
  "/fr/blog/index.html",
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
  "/fr/blog/openclaw-creator-joins-openai/index.html",
  "/fr/blog/vibe-working-when-agents-work/index.html",
  "/fr/blog/who-makes-money-from-openclaw/index.html",
  "/fr/docs/index.html",
  "/fr/docs/add-channel/index.html",
  "/ja/index.html",
  "/ja/features/index.html",
  "/ja/pricing/index.html",
  "/ja/tools/index.html",
  "/ja/blog/index.html",
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
  "/ja/blog/openclaw-creator-joins-openai/index.html",
  "/ja/blog/vibe-working-when-agents-work/index.html",
  "/ja/blog/who-makes-money-from-openclaw/index.html",
  "/ja/docs/index.html",
  "/ja/docs/add-channel/index.html",
  "/ko/index.html",
  "/ko/features/index.html",
  "/ko/pricing/index.html",
  "/ko/tools/index.html",
  "/ko/blog/index.html",
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
  "/ko/blog/openclaw-creator-joins-openai/index.html",
  "/ko/blog/vibe-working-when-agents-work/index.html",
  "/ko/blog/who-makes-money-from-openclaw/index.html",
  "/ko/docs/index.html",
  "/ko/docs/add-channel/index.html",
  "/pt-br/index.html",
  "/pt-br/features/index.html",
  "/pt-br/pricing/index.html",
  "/pt-br/tools/index.html",
  "/pt-br/blog/index.html",
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
  "/pt-br/blog/openclaw-creator-joins-openai/index.html",
  "/pt-br/blog/vibe-working-when-agents-work/index.html",
  "/pt-br/blog/who-makes-money-from-openclaw/index.html",
  "/pt-br/docs/index.html",
  "/pt-br/docs/add-channel/index.html",
  "/ru/blog/index.html",
  "/zh/index.html",
  "/zh/features/index.html",
  "/zh/pricing/index.html",
  "/zh/tools/index.html",
  "/zh/blog/index.html",
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
  "/zh/blog/openclaw-creator-joins-openai/index.html",
  "/zh/blog/vibe-working-when-agents-work/index.html",
  "/zh/blog/who-makes-money-from-openclaw/index.html",
  "/zh/docs/index.html",
  "/zh/docs/add-channel/index.html",
  "/zh-tw/index.html",
  "/zh-tw/blog/index.html",
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
  "/zh-tw/blog/openclaw-creator-joins-openai/index.html",
  "/zh-tw/blog/vibe-working-when-agents-work/index.html",
  "/zh-tw/blog/who-makes-money-from-openclaw/index.html",
];

// Only download files that don't already exist
const missingFiles = allFiles.filter(f => {
  const destPath = path.join(OUT_DIR, f.replace(/\//g, path.sep));
  return !fs.existsSync(destPath);
});

console.log(`Need to download ${missingFiles.length} files`);

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        // Resolve relative redirects
        let loc = response.headers.location;
        if (loc.startsWith('/')) {
          const urlObj = new URL(url);
          loc = urlObj.origin + loc;
        }
        downloadFile(loc, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(destPath); } catch(e) {}
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
  let ok = 0, skipped = 0, failed = 0;
  
  for (let i = 0; i < missingFiles.length; i += 5) {
    const batch = missingFiles.slice(i, i + 5);
    await Promise.all(batch.map(async (filePath) => {
      const url = BASE_URL + filePath;
      const destPath = path.join(OUT_DIR, filePath.replace(/\//g, path.sep));
      try {
        const result = await downloadFile(url, destPath);
        if (result && result.skipped) {
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
    }));
  }
  
  console.log(`\nDone! OK: ${ok}, Skipped: ${skipped}, Failed: ${failed}`);
  console.log(`Total files in deploy-mirror: ${require('child_process').execSync('dir /s /b "' + OUT_DIR + '" | find /c "."').toString().trim()}`);
}

main().catch(console.error);
