#!/usr/bin/env node
/**
 * validate-claims.mjs — deterministic docs claims validator (P4).
 *
 * Consumes the NORA allowlist at docs/.validator-allowlists/claims.json
 * (decision card t_9274c201, policy doc CLAIMS-DECISION.md) and fails on
 * unsupported claims in the docs prose.
 *
 * RULES (from CLAIMS-DECISION.md / claims.json):
 *   - A claim term is ALLOWED on a page only when an `allowed` entry exists
 *     whose `term` matches (case-insensitive substring), whose `where` regex
 *     matches the page path, AND whose evidence is NOT "PENDING".
 *   - A `PENDING` evidence marker means "not currently allowed — documents the
 *     reopen condition". Treat as deny.
 *   - Any scanned term with no matching non-PENDING allowed entry is a FAIL.
 *   - Terms in `denied[]` always fail when asserted (handled naturally: they
 *     have no non-PENDING allowed entry unless explicitly allowed).
 *   - Fenced code blocks (``` … ```) are skipped so dashboard-mock ASCII and
 *     sample payloads do not false-positive.
 *
 * USAGE:
 *   node scripts/validate-claims.mjs                    # scan docs/ (default)
 *   node scripts/validate-claims.mjs --dir <path>       # scan a specific dir (fixtures)
 *   node scripts/validate-claims.mjs --allowlist <path> # alternate allowlist JSON
 *
 * EXIT: 0 if no unsupported claims found; 1 otherwise.
 *
 * ESCAPE HATCH (audit §6.5 rollback): do NOT delete this validator. Until the
 * flagged content is remediated, the docs CI gates it behind the
 * `ignore-docs-validator` PR label (see .github/workflows/docs-ci.yml) so
 * failures are reported as annotations, not build blockers.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, resolve } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const DEFAULT_ALLOWLIST = join(REPO_ROOT, 'docs/.validator-allowlists/claims.json');
const DEFAULT_DIR = join(REPO_ROOT, 'docs');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}
const TARGET = arg('--dir') || DEFAULT_DIR;
const ALLOWLIST = arg('--allowlist') || DEFAULT_ALLOWLIST;

if (!existsSync(ALLOWLIST)) {
  console.error(`❌ validate:claims — allowlist not found: ${ALLOWLIST}`);
  console.error('   Consume NORA t_9274c201 allowlist at docs/.validator-allowlists/claims.json');
  process.exit(1);
}
const allowlist = JSON.parse(readFileSync(ALLOWLIST, 'utf8'));
const allowed = allowlist.allowed || [];
const denied = allowlist.denied || [];

// Effective scan term list = union of allowed terms + denied terms.
const scanTerms = new Set();
for (const e of allowed) scanTerms.add(e.term.toLowerCase());
for (const t of denied) scanTerms.add(t.toLowerCase());
const terms = [...scanTerms].sort((a, b) => b.length - a.length); // longest first

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (entry === '.validator-allowlists') continue; // never scan allowlists
      walk(p, acc);
    } else if (p.endsWith('.md') || p.endsWith('.mdx')) {
      acc.push(p);
    }
  }
  return acc;
}

function isAllowed(term, relPath) {
  for (const e of allowed) {
    if (e.term.toLowerCase() !== term) continue;
    if (String(e.evidence || '').toUpperCase() === 'PENDING') continue; // deny
    const where = e.where || '';
    if (where === 'global') return true;
    try {
      if (new RegExp(where).test(relPath)) return true;
    } catch {
      /* ignore malformed regex */
    }
  }
  return false;
}

let failures = 0;
const files = walk(TARGET);
for (const file of files) {
  const relPath = relative(REPO_ROOT, file);
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  // Mask fenced code blocks (``` … ```) so mocks/payloads don't false-positive.
  const masked = lines.map((l, i) => ({ line: l, num: i + 1, masked: false }));
  let inFence = false;
  const prose = lines.map((l) => {
    const t = l.trim();
    if (t.startsWith('```')) { inFence = !inFence; return ''; }
    return inFence ? '' : l;
  });

  for (const term of terms) {
    for (let i = 0; i < prose.length; i++) {
      const low = prose[i].toLowerCase();
      if (low.includes(term)) {
        if (isAllowed(term, relPath)) continue;
        failures++;
        console.log(`  ✗ ${relPath}:${i + 1} — term "${term}" not allowed here`);
      }
    }
  }
}

if (failures > 0) {
  console.error(`\n🔴 validate:claims FAILED — ${failures} unsupported claim occurrence(s).`);
  console.error('   Fix the content, or open an allowlist PR at docs/.validator-allowlists/claims.json.');
  console.error('   Escape hatch: gate behind `ignore-docs-validator` label (see docs-ci.yml).');
  process.exit(1);
} else {
  console.log(`✅ validate:claims PASSED — scanned ${files.length} file(s) against ${allowlist.allowed?.length ?? 0} allowed rules + ${denied.length} denied terms.`);
}
