#!/usr/bin/env node

/**
 * Sync canonical OpenAPI specs into docs static assets.
 *
 * - Copies MCP Memory spec from apps/onasis-core into docs static
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

const unifiedSpecYaml = path.join(staticDir, 'unified-services.yaml');
const manifestPath = path.join(staticDir, 'specs.json');

const hashContent = (content) =>
  crypto.createHash('sha256').update(content, 'utf8').digest('hex');

const ensureFile = (targetPath, expectedContent, label) => {
  if (checkOnly) {
    if (!fs.existsSync(targetPath)) {
      console.error(`❌ Missing ${label}: ${targetPath}`);
      process.exit(1);
    }
    const currentContent = fs.readFileSync(targetPath, 'utf8');
    if (currentContent !== expectedContent) {
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

  if (!fs.existsSync(memorySpecSource)) {
    throw new Error(`Memory spec not found at ${memorySpecSource}`);
  }

  if (!fs.existsSync(docsSearchSpecSource)) {
    throw new Error(`Docs search spec not found at ${docsSearchSpecSource}`);
  }

  const memorySpec = readYaml(memorySpecSource);
  const docsSearchSpec = readYaml(docsSearchSpecSource);
  const unifiedSpec = fs.existsSync(unifiedSpecYaml)
    ? readYaml(unifiedSpecYaml)
    : { content: '', data: {} };

  const memoryJson = JSON.stringify(memorySpec.data, null, 2);

  ensureFile(memorySpecYaml, memorySpec.content, 'Memory OpenAPI YAML');
  ensureFile(memorySpecJson, memoryJson, 'Memory OpenAPI JSON');
  ensureFile(docsSearchSpecYaml, docsSearchSpec.content, 'Docs Search OpenAPI YAML');

  const manifest = {
    specs: [
      {
        id: 'memory',
        name: 'MCP Memory API',
        icon: '🧠',
        description: 'Complete MCP REST API with 28 tools - Memory, API Keys, Intelligence, System',
        badge: 'MCP v2.0 - 28 Tools',
        version: memorySpec.data?.info?.version || 'unknown',
        hash: hashContent(memorySpec.content),
        paths: ['/memory-api.json', '/memory-api.yaml']
      },
      {
        id: 'unified',
        name: 'Unified Services',
        icon: '🔗',
        description: 'Wallets, Transfers, Payments, KYC',
        badge: 'Unified Services API',
        version: unifiedSpec.data?.info?.version || 'unknown',
        hash: unifiedSpec.content ? hashContent(unifiedSpec.content) : null,
        paths: ['/unified-services.yaml']
      },
      {
        id: 'docs',
        name: 'Documentation Search',
        icon: '📚',
        description: 'Search documentation with semantic queries',
        badge: 'Docs Search API',
        version: docsSearchSpec.data?.info?.version || 'unknown',
        hash: hashContent(docsSearchSpec.content),
        paths: ['/openapi.json', '/openapi.yaml']
      }
    ]
  };

  const manifestJson = JSON.stringify(manifest, null, 2);
  ensureFile(manifestPath, manifestJson, 'Specs manifest');

  console.log('✅ Specs sync complete.');
} catch (error) {
  console.error('❌ Spec sync failed:', error.message);
  process.exit(1);
}
