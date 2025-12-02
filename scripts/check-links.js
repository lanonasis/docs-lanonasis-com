/* Minimal link checker for docs markdown files */
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const broken = [];
const VALID_EXTENSIONS = ['.md', '.mdx'];

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
  const content = fs
    .readFileSync(filePath, 'utf8')
    // Strip fenced code blocks so sample links don't trigger false positives
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '');
  const linkRegex = /\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const target = match[1];
    if (/^https?:\/\//i.test(target)) continue; // external
    if (/^mailto:/i.test(target)) continue;
    if (/^tel:/i.test(target)) continue;
    if (target.startsWith('#')) continue; // in-page
    if (target.startsWith('/')) continue; // route link
    const normalized = target.split('#')[0].split('?')[0];
    if (!normalized) continue;
    const basePath = path.resolve(path.dirname(filePath), normalized);

    const candidatePaths = [
      basePath,
      ...VALID_EXTENSIONS.map((ext) => basePath + ext),
      ...VALID_EXTENSIONS.map((ext) =>
        path.join(basePath, `index${ext}`)
      ),
    ];

    const exists = candidatePaths.some((p) => fs.existsSync(p));
    if (!exists) broken.push({ file: filePath, link: target });
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

