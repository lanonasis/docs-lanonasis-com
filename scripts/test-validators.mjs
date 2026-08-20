#!/usr/bin/env node
/**
 * test-validators.mjs — fixture harness proving each P4 validator works.
 *
 * For each validator it runs the validator against:
 *   - its POSITIVE fixture dir (must exit 0 / PASS)
 *   - its NEGATIVE fixture dir (must exit non-zero / FAIL)
 * and reports PASS/FAIL per fixture. Exits non-zero if any expectation is
 * violated so it can gate CI (`bun run test:validators`).
 *
 * Usage: node scripts/test-validators.mjs
 */

import { execFileSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FIX = join(__dirname, '__tests__/fixtures');

// each: { name, script, positive: [--dir, ...args], negative: [--dir, ...args] }
const CASES = [
  {
    name: 'validate:claims',
    script: 'validate-claims.mjs',
    positive: ['--dir', join(FIX, 'claims/positive/docs'), '--allowlist', join(ROOT, 'docs/.validator-allowlists/claims.json')],
    negative: ['--dir', join(FIX, 'claims/negative/docs'), '--allowlist', join(ROOT, 'docs/.validator-allowlists/claims.json')],
  },
  {
    name: 'validate:mcp-tools',
    script: 'validate-mcp-tools.mjs',
    positive: ['--doc', join(FIX, 'mcp-tools/positive/docs/mcp/tools.md')],
    negative: ['--doc', join(FIX, 'mcp-tools/negative/docs/mcp/tools.md')],
  },
  {
    name: 'validate:sdk-packages',
    script: 'validate-sdk-packages.mjs',
    positive: ['--dir', join(FIX, 'sdk-packages/positive/docs')],
    negative: ['--dir', join(FIX, 'sdk-packages/negative/docs')],
  },
  {
    name: 'validate:route-reachability',
    script: 'validate-route-reachability.mjs',
    positive: ['--docs', join(FIX, 'route-reachability/positive/docs'), '--build', join(FIX, 'route-reachability/positive/build'), '--sidebar', join(FIX, 'route-reachability/positive/sidebars.ts')],
    negative: ['--docs', join(FIX, 'route-reachability/negative/docs'), '--build', join(FIX, 'route-reachability/negative/build'), '--sidebar', join(FIX, 'route-reachability/negative/sidebars.ts')],
  },
];

// external-urls needs network; run it but treat connection results as the
// expectation (positive fixture must pass; negative must fail). Only run if
// network is available.
const EXT = {
  name: 'validate:external-urls',
  script: 'validate-external-urls.mjs',
  positive: ['--dir', join(FIX, 'external-urls/positive/docs'), '--fixture-map', join(FIX, 'external-urls/fixture-map.json')],
  negative: ['--dir', join(FIX, 'external-urls/negative/docs'), '--fixture-map', join(FIX, 'external-urls/fixture-map.json')],
};
if (!process.env.CI) {
  CASES.push(EXT);
}

let failures = 0;
for (const c of CASES) {
  for (const polarity of ['positive', 'negative']) {
    const expectedPass = polarity === 'positive';
    const args = ['scripts/' + c.script, ...c[polarity]];
    let exit = 99;
    let out = '';
    try {
      out = execFileSync('node', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      exit = 0;
    } catch (e) {
      exit = e.status ?? 1;
      out = (e.stdout || '') + (e.stderr || '');
    }
    const actualPass = exit === 0;
    const ok = actualPass === expectedPass;
    const mark = ok ? '✅' : '❌';
    console.log(`${mark} ${c.name} ${polarity} → ${actualPass ? 'PASS' : 'FAIL'} (expected ${expectedPass ? 'PASS' : 'FAIL'})`);
    if (!ok) {
      failures++;
      console.log(out.split('\n').slice(0, 15).map((l) => '    ' + l).join('\n'));
    }
  }
}

if (failures > 0) {
  console.error(`\n🔴 test:validators FAILED — ${failures} fixture expectation(s) violated.`);
  process.exit(1);
} else {
  console.log(`\n✅ test:validators PASSED — ${CASES.length * 2} fixture expectations met.`);
}
