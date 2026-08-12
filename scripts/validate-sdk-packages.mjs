#!/usr/bin/env node
/**
 * validate-sdk-packages.mjs — deterministic SDK package validator (P4).
 *
 * Scans every `pip install` / `npm install` / `npm i` / `go get` line in the
 * docs and verifies the target package resolves to a real published package OR
 * is deliberately unshipped (in the documented allowlist
 * docs/.validator-allowlists/sdk-packages.json) OR is explicitly marked
 * "Coming Soon" / "Planned" on the line.
 *
 * Resolution (standalone-safe, deterministic — no live registry calls):
 *   - docs/.validator-allowlists/sdk-packages.json records each known lanonasis
 *     package with status "published" (real, verified) or "planned" (deliberately
 *     unshipped — this file is the documented escape hatch for unshipped
 *     packages per the audit). A package in this allowlist passes.
 *   - A package NOT in the allowlist passes ONLY if the line carries a
 *     "Coming Soon"/"Planned"/"not published" marker (third-party or future
 *     packages).
 *   - http(s)/git+ URLs are skipped — host reachability is validate:external-urls.
 *
 * USAGE:
 *   node scripts/validate-sdk-packages.mjs                 # scan docs/ (default)
 *   node scripts/validate-sdk-packages.mjs --dir <path>    # scan a fixture dir
 *
 * EXIT: 0 if every install line resolves; 1 otherwise.
 *
 * ESCAPE HATCH (audit §6.5): do NOT delete this validator. Add deliberately
 * unshipped packages to docs/.validator-allowlists/sdk-packages.json, not to
 * this script. As a last resort the docs CI gates it behind
 * `ignore-docs-validator`.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const DEFAULT_DIR = join(REPO_ROOT, 'docs');
const ALLOWLIST = join(REPO_ROOT, 'docs/.validator-allowlists/sdk-packages.json');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}
const TARGET = resolve(arg('--dir') || DEFAULT_DIR);

if (!existsSync(ALLOWLIST)) {
  console.error(`❌ validate:sdk-packages — allowlist not found: ${ALLOWLIST}`);
  process.exit(1);
}
const allowlist = JSON.parse(readFileSync(ALLOWLIST, 'utf8'));
const packages = allowlist.packages || {};

// Well-known third-party packages intentionally referenced but not lanonasis-owned.
const THIRD_PARTY_OK = new Set([
  'typescript', 'ts-node', '@types/node', 'react', 'react-dom',
  'express', 'axios', 'openai',
]);

const COMING_SOON = /(coming\s*soon|planned|not yet (published|shipped|released)|roadmap|upcoming)/i;

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (entry === '.validator-allowlists') continue;
      walk(p, acc);
    } else if (p.endsWith('.md') || p.endsWith('.mdx')) {
      acc.push(p);
    }
  }
  return acc;
}

/** Strip code fences and backticks; pull the install command and its target. */
function extractTargets(line) {
  const targets = [];
  // Remove surrounding backticks and trailing punctuation.
  const clean = line.replace(/`+/g, '').replace(/[;,)\]]$/g, '').trim();
  // pip install [-flags] <pkg>
  let m = clean.match(/^pip(?:3)?\s+install(?:[^-]*-[A-Za-z])?\s+([A-Za-z0-9][A-Za-z0-9._\-\[\]=~<>!]*)/);
  if (m && /pip install/.test(clean)) {
    const spec = m[1].split(/[=<>~!\[\]]/)[0].replace(/[.,]$/, '');
    if (spec) targets.push({ pkg: spec, kind: 'pip' });
    return targets;
  }
  // go get <module>
  m = clean.match(/^go\s+get\s+([^\s]+)/);
  if (m) {
    targets.push({ pkg: m[1], kind: 'go' });
    return targets;
  }
  // npm install | npm i [-flags] <pkg>  (handle @scope/name)
  m = clean.match(/^npm\s+(?:install|i)(?:\s+(?:-g|--global|--save|--save-dev|-D|-S|-g\s*))?\s+(@?[A-Za-z0-9][A-Za-z0-9._@/-]*)/);
  if (m && /npm\s+(install|i)/.test(clean)) {
    const raw = m[1];
    // Strip version suffix @x.y.z but keep @scope/pkg
    let name = raw;
    if (!raw.startsWith('@')) name = raw.split('@')[0];
    if (raw.startsWith('@')) {
      // @scope/pkg[@version]
      const parts = raw.split('@');
      if (parts.length >= 3) name = parts[0] + '@' + parts[1];
      else name = raw;
    }
    name = name.replace(/[.,]$/, '');
    if (name) targets.push({ pkg: name, kind: 'npm' });
    return targets;
  }
  return targets;
}

let failures = 0;
let checked = 0;
const files = walk(TARGET);
for (const file of files) {
  const rel = file.replace(REPO_ROOT + '/', '');
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let roadmapSection = false;
  for (let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln];
    if (/^#{1,6}\s+.*(roadmap|upcoming|planned)/i.test(line)) roadmapSection = true;
    if (line.includes('://') || line.startsWith('git+') || line.trim().startsWith('```')) continue;
    const targets = extractTargets(line);
    if (targets.length === 0) continue;
    const ctx = lines.slice(Math.max(0, ln - 1), Math.min(lines.length, ln + 2)).join(' ');
    const comingSoon = COMING_SOON.test(line) || COMING_SOON.test(ctx);
    for (const { pkg } of targets) {
      if (pkg === 'install' || pkg === 'get' || pkg === 'i' || pkg === 'upgrade') continue;
      checked++;
      if (THIRD_PARTY_OK.has(pkg)) continue;
      const rec = packages[pkg];
      if (rec) continue; // published OR deliberately-unshipped allowlist entry
      if (comingSoon || roadmapSection) continue;
      failures++;
      console.log(`  ✗ ${rel}:${ln + 1} — unknown/unshipped package "${pkg}" (add to sdk-packages.json allowlist or mark Coming Soon). Line: ${line.trim().slice(0, 80)}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n🔴 validate:sdk-packages FAILED — ${failures} install line(s) unresolvable (${checked} checked).`);
  console.error('   Add published/planned packages to docs/.validator-allowlists/sdk-packages.json.');
  process.exit(1);
} else {
  console.log(`✅ validate:sdk-packages PASSED — scanned ${files.length} file(s), ${checked} install line(s) resolve.`);
}
