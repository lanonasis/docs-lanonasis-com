#!/usr/bin/env node

/**
 * Sync canonical OpenAPI specs into docs static assets.
 *
 * - Copies MCP Memory spec from apps/onasis-core when running in the monorepo
 * - Uses the committed static spec when the standalone docs repository builds
 * - Generates memory-api.json for playground compatibility
 * - Syncs docs search openapi.yaml into static
 * - Generates specs.json manifest for the playground UI
 *
 * Usage:
 *   node scripts/sync-docs-specs.js
 *   node scripts/sync-docs-specs.js --check
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const crypto = require('crypto');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const docsRoot = path.resolve(__dirname, '..');
const staticDir = path.join(docsRoot, 'static');

const memorySpecSource = path.join(
  repoRoot,
  'apps',
  'onasis-core',
  'docs',
  'supabase-api',
  'SUPABASE_REST_API_OPENAPI.yaml'
);
const memorySpecYaml = path.join(staticDir, 'memory-api.yaml');
const memorySpecJson = path.join(staticDir, 'memory-api.json');

const docsSearchSpecSource = path.join(docsRoot, 'openapi.yaml');
const docsSearchSpecYaml = path.join(staticDir, 'openapi.yaml');

const manifestPath = path.join(staticDir, 'specs.json');

const hashContent = (content) =>
  crypto.createHash('sha256').update(content, 'utf8').digest('hex');

const ensureFile = (targetPath, expectedContent, label, compareFn) => {
  if (checkOnly) {
    if (!fs.existsSync(targetPath)) {
      console.error(`❌ Missing ${label}: ${targetPath}`);
      process.exit(1);
    }
    const currentContent = fs.readFileSync(targetPath, 'utf8');
    const a = compareFn ? compareFn(currentContent) : currentContent;
    const b = compareFn ? compareFn(expectedContent) : expectedContent;
    if (a !== b) {
      console.error(`❌ ${label} is out of sync: ${targetPath}`);
      process.exit(1);
    }
    return;
  }

  const existing = fs.existsSync(targetPath)
    ? fs.readFileSync(targetPath, 'utf8')
    : null;

  if (existing !== expectedContent) {
    fs.writeFileSync(targetPath, expectedContent);
  }
};

const readYaml = (sourcePath) => {
  const content = fs.readFileSync(sourcePath, 'utf8');
  return {
    content,
    data: yaml.load(content)
  };
};

try {
  console.log('📦 Syncing OpenAPI specs into docs static assets...');

  if (!fs.existsSync(docsSearchSpecSource)) {
    throw new Error(`Docs search spec not found at ${docsSearchSpecSource}`);
  }

  const memorySpec = fs.existsSync(memorySpecSource)
    ? readYaml(memorySpecSource)
    : readYaml(memorySpecYaml);

  if (!fs.existsSync(memorySpecSource)) {
    console.log('ℹ️  Monorepo memory spec unavailable; using committed static/memory-api.yaml.');
  }
  const docsSearchSpec = readYaml(docsSearchSpecSource);
  const memoryJson = JSON.stringify(memorySpec.data, null, 2);

  ensureFile(memorySpecYaml, memorySpec.content, 'Memory OpenAPI YAML');
  ensureFile(memorySpecJson, memoryJson, 'Memory OpenAPI JSON');
  ensureFile(docsSearchSpecYaml, docsSearchSpec.content, 'Docs Search OpenAPI YAML');

  const lastVerified = new Date().toISOString();
  // Keep the manifest deterministic whether docs runs standalone or inside the
  // monorepo. The artifact hash, not the checkout layout, is the drift signal.
  const memorySourceLabel =
    'canonical:apps/onasis-core/docs/supabase-api/SUPABASE_REST_API_OPENAPI.yaml';
  const docsSourceLabel = 'repo:apps/docs-lanonasis/openapi.yaml';

  // Drift-visibility envelope: `last_verified` + `synced_from` make
  // static==canonical drift visible without running check:docs-sync —
  // a stale manifest is the one whose `last_verified` is older than the
  // canonical source's mtime, or whose per-spec `hash` no longer matches
  // the on-disk artifact.
  const manifest = {
    last_verified: lastVerified,
    synced_from: {
      generator: 'scripts/sync-docs-specs.js',
      memory: memorySourceLabel,
      docs: docsSourceLabel
    },
    specs: [
      {
        id: 'memory',
        name: 'MCP Memory API',
        icon: '🧠',
        description: 'Complete MCP REST API with 31 tools - Memory, API Keys, Intelligence, Behavior, System',
        badge: 'MCP v2.0 - 31 Tools',
        version: memorySpec.data?.info?.version || 'unknown',
        hash: hashContent(memorySpec.content),
        last_verified: lastVerified,
        synced_from: memorySourceLabel,
        paths: ['/memory-api.json', '/memory-api.yaml']
      },
      {
        id: 'docs',
        name: 'Documentation Search',
        icon: '📚',
        description: 'Search documentation with semantic queries',
        badge: 'Docs Search API',
        version: docsSearchSpec.data?.info?.version || 'unknown',
        hash: hashContent(docsSearchSpec.content),
        last_verified: lastVerified,
        synced_from: docsSourceLabel,
        paths: ['/openapi.json', '/openapi.yaml']
      }
    ]
  };

  const manifestJson = JSON.stringify(manifest, null, 2);

  // `last_verified` is a drift-visibility timestamp that changes on every run;
  // compare the manifest with timestamps normalized so `--check` is
  // deterministic (the hash + synced_from fields still catch real drift).
  const normalizeManifest = (s) =>
    s.replace(/"last_verified": "[^"]*"/g, '"last_verified": "<ts>"');

  if (checkOnly) {
    const currentManifest = fs.existsSync(manifestPath)
      ? fs.readFileSync(manifestPath, 'utf8')
      : null;
    if (
      !currentManifest ||
      normalizeManifest(currentManifest) !== normalizeManifest(manifestJson)
    ) {
      console.error(`❌ Specs manifest is out of sync: ${manifestPath}`);
      process.exit(1);
    }
  } else {
    ensureFile(manifestPath, manifestJson, 'Specs manifest');
  }

  console.log('✅ Specs sync complete.');
} catch (error) {
  console.error('❌ Spec sync failed:', error.message);
  process.exit(1);
}
