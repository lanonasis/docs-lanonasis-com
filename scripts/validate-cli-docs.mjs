/**
 * validate-cli-docs.mjs
 *
 * Docs contract test v2: validates CLI reference doc against actual CLI command registry.
 *
 * EXTENDED for P4 (t_72fc6d3c):
 *   - Standalone-safe: reads the live CLI source registry when the monorepo is
 *     mounted (LANONASIS_CLI_SRC env or default REPO_ROOT/apps/lanonasis-maas/cli/src),
 *     and falls back to the committed snapshot docs/.validator-allowlists/cli-commands.json
 *     when running in the standalone docs repo.
 *   - Version contract: verifies the `@lanonasis/cli` version embedded in
 *     docs/cli/reference.md (AUTO:CLI_VERSION marker) matches the package version
 *     recorded in the CLI package.json (monorepo) or the committed snapshot — not
 *     just the changelog. This closes the gap where the reference doc could drift
 *     from the shipped CLI package.
 *
 * Fails CI when:
 *   - A documented command name doesn't exist in the CLI (unless in ALLOW_LIST)
 *   - A required command is missing from the docs
 *   - The AUTO:CLI_VERSION in docs/cli/reference.md disagrees with the CLI package version
 *
 * Usage: node scripts/validate-cli-docs.mjs
 * From: apps/docs-lanonasis/ (standalone docs repo)
 *
 * ESCAPE HATCH (audit §6.5): do NOT delete this validator. If a command is
 * documented but not in the registry, add it to ALLOW_LIST below with a comment,
 * not by removing the check. As a last resort the docs CI gates it behind
 * `ignore-docs-validator`.
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SNAPSHOT = join(REPO_ROOT, 'docs/.validator-allowlists/cli-commands.json');
const CLI_SRC = process.env.LANONASIS_CLI_SRC || join(REPO_ROOT, 'apps/lanonasis-maas/cli/src');
const COMMANDS_DIR = join(CLI_SRC, 'commands');
const CLI_REFERENCE = join(REPO_ROOT, 'docs/cli/reference.md');

// Commands that MUST appear in docs (as primary doc name)
const REQUIRED_COMMANDS = ['init', 'auth', 'repl', 'topic', 'config',
  'org', 'api-keys', 'prescan', 'completion', 'status',
  'whoami', 'health', 'mcp', 'mcp-server'];

// Commands documented in the reference but registered differently or
// in a secondary entry point (guide is in index-simple.ts, not index.ts)
const ALLOW_LIST = new Set(['guide']);

const monorepoMounted = existsSync(join(CLI_SRC, 'index.ts')) || existsSync(COMMANDS_DIR);

/**
 * Extract CLI command names from the full source tree (index.ts + all command files).
 */
function buildCLICommandRegistry() {
  const commands = new Set();

  // Scan index.ts
  const indexPath = join(CLI_SRC, 'index.ts');
  if (existsSync(indexPath)) {
    scanFile(indexPath, commands);
  }

  // Scan all .ts files in commands/ dir (catches mcp.ts, prescan.ts, api-keys.ts, etc.)
  if (existsSync(COMMANDS_DIR)) {
    const files = readdirSync(COMMANDS_DIR);
    for (const file of files) {
      if (file.endsWith('.ts')) {
        scanFile(join(COMMANDS_DIR, file), commands);
      }
    }
  }

  return commands;
}

function scanFile(filePath, commands) {
  const content = readFileSync(filePath, 'utf8');
  let match;

  // .command('name')
  const commandRef = /\.command\(['"]([a-z][\w-]*)['"]\)/g;
  while ((match = commandRef.exec(content)) !== null) {
    if (!match[1].startsWith('$')) {
      commands.add(match[1]);
    }
  }

  // .name('name') at command level
  const nameRef = /\.name\(['"]([a-z][\w-]*)['"]\)/g;
  while ((match = nameRef.exec(content)) !== null) {
    commands.add(match[1]);
  }

  // new Command('name')
  const newCmdRef = /new\s+Command\(['"]([a-z][\w-]*)['"]\)/g;
  while ((match = newCmdRef.exec(content)) !== null) {
    commands.add(match[1]);
  }
}

/**
 * Extract command references from the CLI reference doc.
 */
function extractDocCommandRefs(docContent) {
  const refs = new Set();
  const inlineRef = /`(?:onasis|lanonasis|memory|maas)\s+([a-z][\w-]*)(?:\s+[^`]*)?`/g;
  let match;
  while ((match = inlineRef.exec(docContent)) !== null) {
    refs.add(match[1]);
  }
  const bashBlockRef = /(?:^|\n)(?:onasis|lanonasis|memory|maas)\s+([a-z][\w-]*)/gm;
  while ((match = bashBlockRef.exec(docContent)) !== null) {
    refs.add(match[1]);
  }
  return refs;
}

/** Resolve the CLI package version: monorepo package.json if mounted, else snapshot. */
function resolveCliVersion() {
  const candidates = [
    join(dirname(CLI_SRC), 'package.json'),
    join(REPO_ROOT, 'apps/lanonasis-maas/cli/package.json'),
  ];
  for (const pkgPath of candidates) {
    if (!existsSync(pkgPath)) continue;
    try {
      return JSON.parse(readFileSync(pkgPath, 'utf8')).version;
    } catch {
      /* fall through */
    }
  }
  if (existsSync(SNAPSHOT)) {
    return JSON.parse(readFileSync(SNAPSHOT, 'utf8')).version || null;
  }
  return null;
}

// ── Main ──

if (!existsSync(CLI_REFERENCE)) {
  console.error(`❌ CLI reference doc not found: ${CLI_REFERENCE}`);
  process.exit(1);
}

let exitCode = 0;
const errors = [];
const docContent = readFileSync(CLI_REFERENCE, 'utf8');
const docRefs = extractDocCommandRefs(docContent);

// Registry: live source if monorepo mounted, else committed snapshot.
let cliCommands;
if (monorepoMounted) {
  cliCommands = buildCLICommandRegistry();
  console.log(`   (monorepo mounted — live CLI source registry)`);
} else if (existsSync(SNAPSHOT)) {
  cliCommands = new Set(JSON.parse(readFileSync(SNAPSHOT, 'utf8')).commands || []);
  console.log(`   (standalone — using committed snapshot cli-commands.json)`);
} else {
  console.error('❌ validate:cli-docs — no CLI source registry found (set LANONASIS_CLI_SRC or commit cli-commands.json).');
  process.exit(1);
}

// Check 1: Required commands must be documented
for (const cmd of REQUIRED_COMMANDS) {
  if (!docRefs.has(cmd)) {
    errors.push(`❌ MISSING: "${cmd}" — command exists in CLI (${cliCommands.has(cmd) ? '✓' : '?'}) but is not documented in docs/cli/reference.md`);
    exitCode = 1;
  }
}

// Check 2: Documented commands should exist in CLI (or be in ALLOW_LIST)
for (const docCmd of docRefs) {
  if (['memory', 'mem', 'create', 'list', 'get', 'update', 'delete', 'search',
       'save-session', 'list-sessions', 'load-session', 'delete-session',
       'stats', 'intelligence', 'behavior', 'ls'].includes(docCmd)) {
    continue;
  }
  if (docCmd.startsWith('--') || docCmd.startsWith('-')) continue;
  if (!cliCommands.has(docCmd) && !ALLOW_LIST.has(docCmd)) {
    errors.push(`❌ STALE: "${docCmd}" — documented but not found in CLI source (may need removal or ALLOW_LIST entry)`);
    exitCode = 1;
  }
}

// Check 3 (P4): AUTO:CLI_VERSION in reference.md must match the CLI package version
const version = resolveCliVersion();
if (version) {
  const markerMatch = docContent.match(/AUTO:CLI_VERSION\s*-->\s*([0-9][\w.+-]*)\s*<!--/);
  if (!markerMatch) {
    errors.push(`❌ VERSION: AUTO:CLI_VERSION marker missing in docs/cli/reference.md`);
    exitCode = 1;
  } else if (markerMatch[1].trim() !== String(version).trim()) {
    errors.push(`❌ VERSION: docs/cli/reference.md pins @lanonasis/cli v${markerMatch[1].trim()} but package version is v${version}`);
    exitCode = 1;
  } else {
    console.log(`   Version contract OK: reference.md ↔ @lanonasis/cli v${version}`);
  }
} else {
  console.log('   (no CLI package version resolved — version contract skipped)');
}

if (errors.length > 0) {
  console.error(`\n🔴 CLI Docs Contract Test FAILED (${errors.length} errors):\n`);
  for (const err of errors) console.error(`  ${err}`);
  console.error(`\n   CLI commands: ${[...cliCommands].sort().join(', ')}`);
  console.error(`\n   Doc refs: ${[...docRefs].sort().join(', ')}`);
  process.exit(exitCode);
} else {
  console.log(`\n✅ CLI Docs Contract Test PASSED`);
  console.log(`   CLI commands found: ${[...cliCommands].length}`);
  console.log(`   Doc refs found: ${[...docRefs].length}`);
  console.log(`   Required commands verified: ${REQUIRED_COMMANDS.length}\n`);
}
