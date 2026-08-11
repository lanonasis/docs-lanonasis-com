#!/usr/bin/env node

/**
 * build-search-index.mjs
 *
 * Generates a build-time search index for the docs site (audit F26).
 *
 * Why build-time:
 *   - The previous implementation (api/search.js) walked the filesystem on
 *     every request and only saw files present in the runtime server's
 *     filesystem. A static index generated during the build is deterministic,
 *     deployable as a static asset, and requires no runtime traversal.
 *
 * Why these dependencies:
 *   - remark + strip-markdown are already in package.json dependencies; we add
 *     zero new packages. Meilisearch (also present) is a client for a hosted
 *     server and cannot index standalone, so it is not used here.
 *
 * Output:
 *   static/search-index.json — an array of:
 *     { title, description, url, section, content }
 *   where content is the markdown body with code fences removed and plain-text
 *   extracted, truncated to a bounded length.
 *
 * Usage:
 *   node scripts/build-search-index.mjs          # write static/search-index.json
 *   node scripts/build-search-index.mjs --check  # verify the committed index is current
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import strip from 'strip-markdown';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = join(__dirname, '..', 'docs');
const OUT_FILE = join(__dirname, '..', 'static', 'search-index.json');
const CHECK_MODE = process.argv.includes('--check');

// Sections that are internal tooling / audit artifacts and should not surface
// in site search results.
const EXCLUDED_PREFIXES = ['audit/'];

// Bound the size of each document's indexed content. Full-text search does not
// need the whole body; the first ~4k chars capture the meaningful surface.
const MAX_CONTENT_CHARS = 4000;

function walk(dir) {
  const out = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full));
    } else if (extname(full) === '.md' || extname(full) === '.mdx') {
      out.push(full);
    }
  }
  return out;
}

function parseFrontmatter(content) {
  // Minimal frontmatter parser: works for the YAML block between leading ---
  // markers. Values are unquoted or double-quoted strings.
  const fm = {};
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { fm, body: content };
  const block = match[1];
  for (const line of block.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fm[kv[1]] = value;
  }
  return { fm, body: content.slice(match[0].length) };
}

function stripMarkdownToText(md) {
  try {
    const file = unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(strip)
      .processSync(md);
    return String(file).trim();
  } catch {
    // Fallback: crude but functional — remove code fences and common syntax.
    return md
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[*_>~-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

function slugToUrl(relPath) {
  let url = relPath.replace(/\.mdx?$/, '').replace(/\/index$/, '');
  if (!url.startsWith('/')) url = '/' + url;
  return url;
}

function buildIndex() {
  const files = walk(DOCS_ROOT);
  const entries = [];

  for (const file of files) {
    const rel = relative(DOCS_ROOT, file).split('/').slice(0, -1).join('/');
    if (EXCLUDED_PREFIXES.some((p) => rel.startsWith(p))) continue;

    const raw = readFileSync(file, 'utf8');
    const { fm, body } = parseFrontmatter(raw);

    // Skip hidden/redirect stubs that have no real content.
    if (fm.draft === 'true' || fm.unlisted === 'true') continue;

    const title = fm.title || body.match(/^#\s+(.+)$/m)?.[1]?.trim() || basenameNoExt(file);
    const description = fm.description || '';
    const content = stripMarkdownToText(body).slice(0, MAX_CONTENT_CHARS);
    const url = slugToUrl(relative(DOCS_ROOT, file));

    entries.push({
      title,
      description,
      url,
      section: rel || 'general',
      content,
    });
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return entries;
}

function basenameNoExt(file) {
  const base = file.split('/').pop() || file;
  return base.replace(/\.mdx?$/, '');
}

// ── Main ──

const index = buildIndex();
const json = JSON.stringify(index, null, 2) + '\n';

if (CHECK_MODE) {
  if (!existsSync(OUT_FILE)) {
    console.error(`❌ Search index missing: ${OUT_FILE} — run node scripts/build-search-index.mjs`);
    process.exit(1);
  }
  const current = readFileSync(OUT_FILE, 'utf8');
  if (current !== json) {
    console.error(`❌ Search index is out of sync (${index.length} entries).`);
    console.error('   Run: node scripts/build-search-index.mjs');
    process.exit(1);
  }
  console.log(`✅ Search index is current (${index.length} entries).`);
} else {
  writeFileSync(OUT_FILE, json);
  console.log(`✅ Wrote static/search-index.json (${index.length} entries).`);
}
