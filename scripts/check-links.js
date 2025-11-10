/* Minimal link checker for docs markdown files */
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const broken = [];

function listMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(p);
    if (entry.isFile() && (p.endsWith('.md') || p.endsWith('.mdx'))) return [p];
    return [];
  });
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const linkRegex = /\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const target = match[1];
    if (/^https?:\/\//i.test(target)) continue; // external
    if (target.startsWith('#')) continue; // in-page
    if (target.startsWith('/')) continue; // route link
    const normalized = target.split('#')[0];
    if (!normalized) continue;
    const targetPath = path.resolve(path.dirname(filePath), normalized);
    if (!fs.existsSync(targetPath)) {
      broken.push({ file: filePath, link: target });
    }
  }
}

for (const file of listMarkdownFiles(DOCS_DIR)) {
  checkFile(file);
}

if (broken.length > 0) {
  console.error('Broken links found:');
  for (const b of broken) {
    console.error(`- ${path.relative(DOCS_DIR, b.file)} -> ${b.link}`);
  }
  process.exit(1);
} else {
  console.log('No broken relative links detected.');
}


