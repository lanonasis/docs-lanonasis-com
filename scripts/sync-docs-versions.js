#!/usr/bin/env node

/**
 * Sync package versions into docs markdown using AUTO markers.
 *
 * Markers use this format:
 *   <!-- AUTO:CLI_VERSION -->3.8.0<!-- /AUTO -->
 *
 * Usage:
 *   node scripts/sync-docs-versions.js
 *   node scripts/sync-docs-versions.js --check
 */

const fs = require('fs');
const path = require('path');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const docsRoot = path.resolve(__dirname, '..');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const versions = {
  MEMORY_CLIENT_VERSION: readJson(
    path.join(repoRoot, 'apps', 'lanonasis-maas', 'packages', 'memory-client', 'package.json')
  ).version,
  CLI_VERSION: readJson(
    path.join(repoRoot, 'apps', 'lanonasis-maas', 'cli', 'package.json')
  ).version,
  LANONASIS_SDK_VERSION: readJson(
    path.join(repoRoot, 'apps', 'lanonasis-maas', 'packages', 'lanonasis-sdk', 'package.json')
  ).version,
};

const docsTargets = [
  path.join(docsRoot, 'docs', 'memory', 'sdk.md'),
  path.join(docsRoot, 'docs', 'sdks', 'cli.md'),
  path.join(docsRoot, 'docs', 'sdks', 'typescript.md'),
];

const markerRegex = (id) => new RegExp(`<!--\\s*AUTO:${id}\\s*-->[\\s\\S]*?<!--\\s*\\/AUTO\\s*-->`, 'g');
const markerValue = (id, value) => `<!-- AUTO:${id} -->${value}<!-- /AUTO -->`;

const updateFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    if (checkOnly) {
      throw new Error(`Missing docs file: ${filePath}`);
    }
    console.warn(`⚠️  Docs file not found, skipping: ${filePath}`);
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;
  let foundAny = false;

  for (const [markerId, value] of Object.entries(versions)) {
    const regex = markerRegex(markerId);
    if (regex.test(updated)) {
      foundAny = true;
      updated = updated.replace(regex, markerValue(markerId, value));
    }
  }

  if (checkOnly) {
    if (!foundAny) {
      return;
    }
    if (updated !== original) {
      throw new Error(`Out-of-sync versions in ${filePath}`);
    }
    return;
  }

  if (!foundAny) {
    console.warn(`⚠️  No version markers found in ${filePath}`);
    return;
  }

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
  }
};

try {
  console.log('🔄 Syncing docs versions...');
  docsTargets.forEach(updateFile);
  console.log('✅ Docs version sync complete.');
} catch (error) {
  console.error('❌ Docs version sync failed:', error.message);
  process.exit(1);
}
