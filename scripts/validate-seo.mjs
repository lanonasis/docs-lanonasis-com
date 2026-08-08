#!/usr/bin/env node

/**
 * validate-seo.mjs
 *
 * Enforces per-page SEO metadata and heading structure for the docs site
 * (audit P3 §6.4):
 *
 *   1. Every docs page must have a non-empty `description` frontmatter field
 *      (Docusaurus renders it into <meta name="description"> + og:description).
 *   2. No docs page may contain a body H1 heading (frontmatter `title:` is the
 *      single h1; a body `# ` creates a duplicate — WCAG 1.3.1 heading order).
 *   3. Frontmatter descriptions must not contain newlines (Docusaurus
 *      frontmatter strings cannot span lines without a block scalar).
 *
 * Usage:
 *   node scripts/validate-seo.mjs          # exit 1 on any violation
 *   node scripts/validate-seo.mjs --fix    # not implemented; edits are manual
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const DOCS_ROOT = new URL('../docs/', import.meta.url).pathname;

// Internal tooling / audit artifacts that are not user-facing pages.
const EXCLUDED_PREFIXES = ['audit/'];

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

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return fm;
}

function hasBodyH1(content) {
  let inFence = false;
  for (const line of content.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^#\s+/.test(line)) return true;
  }
  return false;
}

const problems = [];

for (const file of walk(DOCS_ROOT)) {
  const rel = relative(DOCS_ROOT, file);
  if (EXCLUDED_PREFIXES.some((p) => rel.startsWith(p))) continue;

  const content = readFileSync(file, 'utf8');
  const fm = parseFrontmatter(content);

  if (!fm || !fm.title) {
    problems.push(`${rel}: missing frontmatter title`);
    continue;
  }

  const desc = fm.description;
  if (!desc || desc.trim().length === 0) {
    problems.push(`${rel}: missing description`);
  } else if (desc.includes('\n')) {
    problems.push(`${rel}: description must be a single line (no newlines)`);
  } else if (desc.length > 200) {
    problems.push(`${rel}: description too long (${desc.length} chars > 200)`);
  }

  if (hasBodyH1(content)) {
    problems.push(`${rel}: contains body H1 (frontmatter title is the page h1)`);
  }
}

if (problems.length > 0) {
  console.error(`🔴 SEO validation FAILED (${problems.length} problems):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log('✅ SEO metadata validated — every page has a description and a single h1.');
