#!/usr/bin/env node

/**
 * quote-descriptions.mjs
 *
 * Quotes YAML frontmatter `description:` values that contain characters which
 * would break plain-scalar parsing (colons, quotes, hashes). Docusaurus parses
 * frontmatter with gray-matter/js-yaml; an unquoted `description: A: B` is
 * parsed as a nested mapping and fails the build.
 *
 * Usage: node scripts/quote-descriptions.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

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

function needsQuote(value) {
  // Plain YAML scalars break on `: `, ` #`, leading/trailing space, or
  // special indicators. Also quote anything with a double-quote or backslash.
  return (
    value.includes(': ') ||
    value.includes(' #') ||
    value.includes('"') ||
    value.includes("'") ||
    value.includes('\\') ||
    value.startsWith(' ') ||
    value.endsWith(' ') ||
    /^[!&*|>%@`]/.test(value)
  );
}

function quoteValue(value) {
  // Use double-quoted YAML style and escape inner double-quotes + backslashes.
  return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

let changed = 0;
for (const file of walk(DOCS_ROOT)) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let inFrontmatter = false;
  let fmChanged = false;
  const out = lines.map((line) => {
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter;
      return line;
    }
    if (inFrontmatter) {
      const m = line.match(/^(description:)\s*(.*)$/);
      if (m && m[2] && needsQuote(m[2].trim())) {
        fmChanged = true;
        return `${m[1]} ${quoteValue(m[2].trim())}`;
      }
    }
    return line;
  });
  if (fmChanged) {
    writeFileSync(file, out.join('\n'));
    changed += 1;
  }
}
console.log(`Quoted descriptions in ${changed} files.`);
