#!/usr/bin/env node
/**
 * demote-body-h1.mjs
 *
 * WCAG 1.3.1 heading hierarchy fix: pages with a frontmatter `title:` render
 * that title as the document's single h1 (Docusaurus). A body `# ` heading then
 * creates a duplicate h1. This script demotes real body H1 headings (outside
 * fenced code blocks) to `## ` so each page keeps exactly one h1.
 *
 * Files WITHOUT a frontmatter title are left untouched — their body H1 is the
 * page's only h1.
 *
 * Usage: node scripts/demote-body-h1.mjs [--check]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const CHECK = process.argv.includes('--check');
const DOCS_ROOT = new URL('../docs/', import.meta.url).pathname;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (extname(full) === '.md' || extname(full) === '.mdx') out.push(full);
  }
  return out;
}

function hasFrontmatterTitle(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return false;
  return /(^|\n)title\s*:/.test(m[1]);
}

/**
 * Demote body h1 lines that are outside fenced code blocks.
 * Returns new content + count of demotions.
 */
function demoteH1(content) {
  const lines = content.split('\n');
  let inFence = false;
  let changed = 0;
  const out = lines.map((line) => {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      // Only a lone fence marker toggles; inline ```text on same line also opens.
      inFence = !inFence;
      return line;
    }
    if (inFence) return line;
    if (/^#\s+/.test(line)) {
      changed += 1;
      return line.replace(/^#\s+/, '## ');
    }
    return line;
  });
  return { content: out.join('\n'), changed };
}

const files = walk(DOCS_ROOT);
let totalChanged = 0;
const changedFiles = [];

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  if (!hasFrontmatterTitle(raw)) continue;
  const { content, changed } = demoteH1(raw);
  if (changed > 0) {
    totalChanged += changed;
    changedFiles.push(file);
    if (!CHECK) writeFileSync(file, content);
  }
}

if (CHECK) {
  if (totalChanged > 0) {
    console.error(`❌ ${totalChanged} body H1 headings would be demoted across ${changedFiles.length} files.`);
    process.exit(1);
  }
  console.log('✅ No body H1 headings outside fences (frontmatter-title pages only).');
} else {
  console.log(`Demoted ${totalChanged} body H1 headings across ${changedFiles.length} files.`);
}
