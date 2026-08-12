#!/usr/bin/env node
/**
 * validate-mcp-tools.mjs — deterministic MCP tools validator (P4).
 *
 * Diffs the tool names enumerated in docs/mcp/tools.md against the MCP tool
 * registry. The docs repo is standalone, so it resolves the registry this way:
 *
 *   1. MCP_REGISTRY_PATH env — absolute path to apps/mcp-core/src/index.ts
 *      (used when the docs repo is CI'd inside the monorepo context).
 *   2. Default monorepo path (REPO_ROOT/apps/mcp-core/src/index.ts) if present.
 *   3. Committed snapshot docs/.validator-allowlists/mcp-tools-registry.json
 *      (standalone docs CI — the snapshot is updated when the registry changes).
 *
 * A tool name documented in docs/mcp/tools.md is valid if it is:
 *   - in the live registry (when the monorepo is mounted), OR
 *   - in the committed snapshot (standalone), OR
 *   - in the documented allowlist docs/.validator-allowlists/mcp-tools.json
 *     (for tools the registry doesn't export but which are intentionally
 *     documented, e.g. transitional / MCP-only surfaces).
 *
 * USAGE:
 *   node scripts/validate-mcp-tools.mjs                 # default scan
 *   node scripts/validate-mcp-tools.mjs --doc <path>    # alternate tools.md
 *   MCP_REGISTRY_PATH=<abs path> node scripts/validate-mcp-tools.mjs
 *
 * EXIT: 0 if every documented tool is accounted for; 1 otherwise.
 *
 * ESCAPE HATCH (audit §6.5): do NOT delete this validator. If a tool is
 * intentionally documented but not in the registry, add it to
 * docs/.validator-allowlists/mcp-tools.json (not this script). As a last
 * resort the docs CI gates it behind `ignore-docs-validator`.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const DEFAULT_DOC = join(REPO_ROOT, 'docs/mcp/tools.md');
const SNAPSHOT = join(REPO_ROOT, 'docs/.validator-allowlists/mcp-tools-registry.json');
const ALLOWLIST = join(REPO_ROOT, 'docs/.validator-allowlists/mcp-tools.json');
const DEFAULT_MONOREPO_SRC = join(REPO_ROOT, 'apps/mcp-core/src/index.ts');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}
const DOC = resolve(arg('--doc') || DEFAULT_DOC);

/** Extract tool names from the live mcp-core registry (source-derived). */
function extractRegistryTools(sourcePath) {
  // Reuse the balanced-extraction approach: find `const tools = [` and walk to
  // the matching `];`, then pull `name: '...'` entries at the entry indent.
  const src = readFileSync(sourcePath, 'utf8');
  const openMatch = src.match(/^(\s*)const\s+tools(?:[^=]*)?=\s*\[/m);
  if (!openMatch) throw new Error(`Could not locate MCP tool registry in ${sourcePath}`);
  const openIndent = openMatch[1];
  const bracketStart = openMatch.index + openMatch[0].lastIndexOf('[');
  let depth = 1, i = bracketStart + 1, lineStart = i, closeLineStart = -1;
  const len = src.length;
  while (i < len && depth > 0) {
    const ch = src[i];
    if (ch === '\n') { lineStart = i + 1; i++; continue; }
    if (ch === '/' && src[i + 1] === '/') { const nl = src.indexOf('\n', i); i = nl === -1 ? len : nl; continue; }
    if (ch === '/' && src[i + 1] === '*') { const end = src.indexOf('*/', i + 2); i = end === -1 ? len : end + 2; continue; }
    if (ch === "'" || ch === '"' || ch === '`') {
      const q = ch; i++;
      while (i < len && src[i] !== q) { if (src[i] === '\\') i += 2; else if (src[i] === '\n') { lineStart = i + 1; i++; } else i++; }
      i++; continue;
    }
    if (ch === '[') { depth++; i++; continue; }
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        if (src.slice(lineStart, i) === openIndent && src[i + 1] === ';') { closeLineStart = lineStart; break; }
      }
      i++; continue;
    }
    i++;
  }
  if (depth !== 0 || closeLineStart === -1) throw new Error(`Could not locate MCP tool registry close in ${sourcePath}`);
  const body = src.slice(bracketStart + 1, closeLineStart);
  const names = new Set();
  const entryRegex = /^      \{([\s\S]*?)^      \}(?:,|$)/gm;
  let m;
  while ((m = entryRegex.exec(body)) !== null) {
    const nm = m[1].match(/^\s*name:\s*'([a-z_]+)'/m);
    if (nm) names.add(nm[1]);
  }
  return names;
}

/** Extract `### <tool_name>` headings from the tools doc. */
function extractDocToolNames(docPath) {
  const content = readFileSync(docPath, 'utf8');
  const names = new Set();
  for (const m of content.matchAll(/^###\s+([a-z][a-z0-9_]*)\s*$/gm)) {
    names.add(m[1]);
  }
  return names;
}

let registryNames;
let registrySource = 'snapshot';
const envRegistry = process.env.MCP_REGISTRY_PATH;
if (envRegistry && existsSync(envRegistry)) {
  registryNames = extractRegistryTools(envRegistry);
  registrySource = envRegistry;
} else if (existsSync(DEFAULT_MONOREPO_SRC)) {
  registryNames = extractRegistryTools(DEFAULT_MONOREPO_SRC);
  registrySource = DEFAULT_MONOREPO_SRC;
} else if (existsSync(SNAPSHOT)) {
  registryNames = new Set(JSON.parse(readFileSync(SNAPSHOT, 'utf8')).tools);
  registrySource = SNAPSHOT;
} else {
  console.error('❌ validate:mcp-tools — no registry source found. Set MCP_REGISTRY_PATH or commit mcp-tools-registry.json');
  process.exit(1);
}

// Allowlist: tools intentionally documented but not in the registry.
let allowlistNames = new Set();
if (existsSync(ALLOWLIST)) {
  const al = JSON.parse(readFileSync(ALLOWLIST, 'utf8'));
  allowlistNames = new Set((al.tools || []).map((t) => (typeof t === 'string' ? t : t.name)));
}

const docNames = extractDocToolNames(DOC);
const valid = new Set([...registryNames, ...allowlistNames]);

const missing = [...docNames].filter((n) => !valid.has(n));
const unknownInRegistry = [...registryNames].filter((n) => !docNames.has(n) && !allowlistNames.has(n));

let failures = 0;
if (missing.length > 0) {
  failures += missing.length;
  console.error(`  ✗ documented but not in registry/allowlist: ${missing.join(', ')}`);
}
if (unknownInRegistry.length > 0) {
  failures += unknownInRegistry.length;
  console.error(`  ✗ in registry but not documented (add to doc or allowlist): ${unknownInRegistry.join(', ')}`);
}

if (failures > 0) {
  console.error(`\n🔴 validate:mcp-tools FAILED (${failures} tool(s)). Registry source: ${registrySource}`);
  console.error('   Regenerate docs/mcp/tools.md or update the snapshot/allowlist.');
  process.exit(1);
} else {
  console.log(`✅ validate:mcp-tools PASSED — ${docNames.size} documented tool(s) match registry (source: ${registrySource}).`);
}
