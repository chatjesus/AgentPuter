const path = require('path');
const OUT_DIR = 'C:\\Users\\PRO\\Desktop\\CUDA\\agentputer-source\\deploy-mirror';
const filePath = '/blog/09-deploy-openclaw/index.html';
const destPath = path.join(OUT_DIR, filePath.replace(/\//g, path.sep));
console.log('Result:', destPath);
console.log('Expected:', path.join(OUT_DIR, 'blog', '09-deploy-openclaw', 'index.html'));
