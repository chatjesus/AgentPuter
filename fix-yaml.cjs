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
  let changed = false;

  // Find frontmatter block (between --- markers)
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  const frontmatter = fmMatch[1];
  const lines = frontmatter.split('\n');
  const fixedLines = [];
  let needsFix = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check for unclosed quoted string (starts with " but no closing ")
    // e.g. `description: "some text without closing quote`
    // or `date: "2026`
    const match = line.match(/^(\w+): "([^"]*?)$/);
    if (match) {
      // Count quotes - odd number means unclosed
      const quoteCount = (line.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        // Close the quote
        fixedLines.push(line + '"');
        needsFix = true;
        console.log(`  Fixed unclosed quote in ${path.basename(f)}:${i+1}: ${line.substring(0, 80)}`);
        continue;
      }
    }
    fixedLines.push(line);
  }

  if (needsFix) {
    const newFrontmatter = fixedLines.join('\n');
    content = content.replace(frontmatter, newFrontmatter);
    fs.writeFileSync(f, content);
    console.log('Fixed:', f);
    fixed++;
  }
}

console.log('\nTotal fixed:', fixed);
