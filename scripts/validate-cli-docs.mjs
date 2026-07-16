/**
 * validate-cli-docs.mjs
 *
 * Docs contract test v2: validates CLI reference doc against actual CLI command registry.
 *
 * Scans both index.ts and all command files in apps/lanonasis-maas/cli/src/commands/
 * to build a complete command registry. Then validates the CLI reference doc at
 * apps/docs-lanonasis/docs/cli/reference.md.
 *
 * Fails CI when:
 *   - A documented command name doesn't exist in the CLI (unless in ALLOW_LIST)
 *   - A required command is missing from the docs
 *
 * Usage: node scripts/validate-cli-docs.mjs
 * From: apps/docs-lanonasis/
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');
const CLI_SRC = join(REPO_ROOT, 'apps/lanonasis-maas/cli/src');
const COMMANDS_DIR = join(CLI_SRC, 'commands');
const CLI_REFERENCE = join(__dirname, '..', 'docs/cli/reference.md');

// Commands that MUST appear in docs (as primary doc name)
const REQUIRED_COMMANDS = ['init', 'auth', 'repl', 'topic', 'config',
  'org', 'api-keys', 'prescan', 'completion', 'status',
  'whoami', 'health', 'mcp', 'mcp-server'];

// Commands documented in the reference but registered differently or
// in a secondary entry point (guide is in index-simple.ts, not index.ts)
const ALLOW_LIST = new Set(['guide']);

/**
 * Extract CLI command names from the full source tree (index.ts + all command files).
 */
function buildCLICommandRegistry() {
  const commands = new Set();
  const commandRef = /\.command\(['"]([a-z][\w-]*)['"]\)/g;
  const addCmdRef = /addCommand\((\w+)/g;

  // Scan index.ts
  const indexPath = join(CLI_SRC, 'index.ts');
  if (existsSync(indexPath)) {
    scanFile(indexPath, commandRef, addCmdRef, commands);
  }

  // Scan all .ts files in commands/ dir (catches mcp.ts, prescan.ts, api-keys.ts, etc.)
  if (existsSync(COMMANDS_DIR)) {
    const files = readdirSync(COMMANDS_DIR);
    for (const file of files) {
      if (file.endsWith('.ts')) {
        scanFile(join(COMMANDS_DIR, file), commandRef, addCmdRef, commands);
      }
    }
  }

  return commands;
}

function scanFile(filePath, commandRef, addCmdRef, commands) {
  const content = readFileSync(filePath, 'utf8');
  let match;

  // .command('name')
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
 * Looks for: `onasis <command>`, `lanonasis <command>`, `memory <command>`,
 * and also checks bash code blocks for `onasis <command>` patterns.
 */
function extractDocCommandRefs(docContent) {
  const refs = new Set();

  // Match: `onasis <command>` or `lanonasis <command>` (inline code)
  const inlineRef = /`(?:onasis|lanonasis|memory|maas)\s+([a-z][\w-]*)`/g;
  let match;
  while ((match = inlineRef.exec(docContent)) !== null) {
    refs.add(match[1]);
  }

  // Also extract from fenced bash code blocks
  // Match lines like "onasis <command>" inside ```bash blocks
  const bashBlockRef = /(?:^|\n)(?:onasis|lanonasis|memory|maas)\s+([a-z][\w-]*)/gm;
  while ((match = bashBlockRef.exec(docContent)) !== null) {
    refs.add(match[1]);
  }

  return refs;
}

// ── Main ──

if (!existsSync(CLI_REFERENCE)) {
  console.error(`❌ CLI reference doc not found: ${CLI_REFERENCE}`);
  process.exit(1);
}

const cliCommands = buildCLICommandRegistry();
const docContent = readFileSync(CLI_REFERENCE, 'utf8');
const docRefs = extractDocCommandRefs(docContent);

let exitCode = 0;
const errors = [];

// Check 1: Required commands must be documented
for (const cmd of REQUIRED_COMMANDS) {
  if (!docRefs.has(cmd)) {
    errors.push(`❌ MISSING: "${cmd}" — command exists in CLI (${cliCommands.has(cmd) ? '✓' : '?'}) but is not documented in docs/cli/reference.md`);
    exitCode = 1;
  }
}

// Check 2: Documented commands should exist in CLI (or be in ALLOW_LIST)
for (const docCmd of docRefs) {
  // Skip memory subcommands — too granular
  if (['memory', 'mem', 'create', 'list', 'get', 'update', 'delete', 'search',
       'save-session', 'list-sessions', 'load-session', 'delete-session',
       'stats', 'intelligence', 'behavior', 'ls'].includes(docCmd)) {
    continue;
  }

  // Skip options/flags captured by the regex
  if (docCmd.startsWith('--') || docCmd.startsWith('-')) continue;

  if (!cliCommands.has(docCmd) && !ALLOW_LIST.has(docCmd)) {
    errors.push(`❌ STALE: "${docCmd}" — documented but not found in CLI source (may need removal or ALLOW_LIST entry)`);
    exitCode = 1;
  }
}

// Output
if (errors.length > 0) {
  console.error(`\n🔴 CLI Docs Contract Test FAILED (${errors.length} errors):\n`);
  for (const err of errors) {
    console.error(`  ${err}`);
  }
  console.error(`\n   CLI commands: ${[...cliCommands].sort().join(', ')}`);
  console.error(`\n   Doc refs: ${[...docRefs].sort().join(', ')}`);
  process.exit(exitCode);
} else {
  console.log(`\n✅ CLI Docs Contract Test PASSED`);
  console.log(`   CLI commands found: ${[...cliCommands].length}`);
  console.log(`   Doc refs found: ${[...docRefs].length}`);
  console.log(`   Required commands verified: ${REQUIRED_COMMANDS.length}\n`);
}
