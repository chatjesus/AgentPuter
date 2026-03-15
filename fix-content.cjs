const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  const files = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) files.push(...walkDir(full));
      else if (f.endsWith('.md')) files.push(full);
    }
  } catch(e) {}
  return files;
}

const mdFiles = walkDir('src/content');
let fixed = 0;

for (const f of mdFiles) {
  let content = fs.readFileSync(f, 'utf8');
  
  // Fix files that have translation prompt header before the actual --- frontmatter
  // Pattern: file starts with translation instructions, then "TEXT:\n---"
  if (!content.startsWith('---')) {
    // Find where the actual frontmatter starts
    const fmIdx = content.indexOf('\n---\n');
    if (fmIdx !== -1) {
      content = content.slice(fmIdx + 1); // Start from "---\n..."
      console.log('Removed prompt header from:', path.basename(f));
    }
  }
  
  // Fix unclosed quotes in frontmatter description/title fields
  const fmEnd = content.indexOf('\n---', 4); // skip first ---
  if (fmEnd !== -1) {
    const fmSection = content.slice(0, fmEnd + 4);
    const bodySection = content.slice(fmEnd + 4);
    
    const fmLines = fmSection.split('\n');
    let changed = false;
    for (let i = 0; i < fmLines.length; i++) {
      const line = fmLines[i];
      if (line.match(/^(title|description|date): "/) ) {
        const quoteCount = (line.match(/"/g) || []).length;
        if (quoteCount % 2 !== 0) {
          fmLines[i] = line + '"';
          console.log(`  Closed quote in ${path.basename(f)}:${i+1}`);
          changed = true;
        }
      }
    }
    
    if (changed) {
      content = fmLines.join('\n') + bodySection;
    }
  }
  
  // Also fix non-standard YAML keys (German translation keys like "Schlagwörter" → "tags", "hervorgehoben" → "featured")
  // Map non-English frontmatter keys to English
  const keyMap = {
    'Schlagwörter': 'tags',
    'hervorgehoben': 'featured',
    'Lesedauer': 'readingTime',
    'Datum': 'date',
    'タグ': 'tags',
    '注目': 'featured',
    '읽는 시간': 'readingTime',
    '태그': 'tags',
    '추천': 'featured',
  };
  
  // Only fix within frontmatter
  const fmEndIdx = content.indexOf('\n---', 4);
  if (fmEndIdx !== -1) {
    let fm = content.slice(0, fmEndIdx + 4);
    let changed = false;
    for (const [foreign, english] of Object.entries(keyMap)) {
      if (fm.includes('\n' + foreign + ':')) {
        fm = fm.replace(new RegExp('\n' + foreign + ':', 'g'), '\n' + english + ':');
        console.log(`  Replaced key "${foreign}" → "${english}" in ${path.basename(f)}`);
        changed = true;
      }
    }
    if (changed) {
      content = fm + content.slice(fmEndIdx + 4);
    }
  }
  
  const original = fs.readFileSync(f, 'utf8');
  if (content !== original) {
    fs.writeFileSync(f, content);
    console.log('Saved:', f);
    fixed++;
  }
}

console.log('\nTotal fixed:', fixed);
