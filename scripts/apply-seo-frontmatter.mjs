#!/usr/bin/env node

/**
 * apply-seo-frontmatter.mjs
 *
 * One-shot authoring helper for P3 SEO metadata. Adds `description` (and,
 * where missing, `title`) to docs frontmatter using the curated map below.
 *
 * Descriptions were written from the actual page content (verified against
 * each file's first heading + intro paragraph on 2026-08-08). They are
 * single-line, ≤200 chars, and describe what the page actually documents.
 *
 * Usage: node scripts/apply-seo-frontmatter.mjs
 * Verify: node scripts/validate-seo.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DOCS_ROOT = new URL('../docs/', import.meta.url).pathname;
const file = (p) => join(DOCS_ROOT, p);

// Curated per-page SEO descriptions (title, description).
const SEO = {
  'api/authentication.md': {
    description: 'How to authenticate with LanOnasis API keys, request headers, and key scopes.',
  },
  'api/endpoints/analytics.md': {
    description: 'Retrieve analytics and insights about memory usage, performance metrics, and system health.',
  },
  'api/endpoints/batch.md': {
    title: 'Batch Operations API',
    description: 'Perform multiple memory operations in a single request for improved efficiency and reduced latency.',
  },
  'api/endpoints/embeddings.md': {
    title: 'Embeddings API',
    description: 'Generate OpenAI-compatible vector embeddings for your content with the LanOnasis embeddings endpoint.',
  },
  'api/endpoints/memory.md': {
    description: 'Create, read, update, delete, and search memories through the LanOnasis Memory API.',
  },
  'api/endpoints/search.md': {
    description: 'Semantic vector search across memories with query, limit, threshold, and type filters.',
  },
  'api/endpoints/stream.md': {
    title: 'Real-time Stream API',
    description: 'Subscribe to real-time memory operations and system notifications over Server-Sent Events (SSE).',
  },
  'api/endpoints/webhooks.md': {
    title: 'Webhooks API',
    description: 'Configure and manage webhooks to receive real-time notifications about memory operations and system events.',
  },
  'api/error-codes.md': {
    title: 'Error Codes',
    description: 'Complete reference for LanOnasis API error codes, common errors, and how to resolve them.',
  },
  'api/mcp-integration.md': {
    description: 'Connect remote MCP clients to LanOnasis for agent and IDE tool integration.',
  },
  'api/memories.md': {
    description: 'Memory management API reference: create, retrieve, update, delete, and search memories.',
  },
  'api/memory-client.md': {
    description: 'Reference for the LanOnasis memory client SDK and its programmatic API.',
  },
  'api/search.md': {
    description: 'Semantic search and discovery API powered by vector embeddings and machine learning.',
  },
  'auth/central-auth-gateway.md': {
    description: 'Central auth gateway reference: OAuth flows, API key contexts, and service-to-service authentication.',
  },
  'changelog.md': {
    description: 'LanOnasis platform changelog: recent feature, API, and documentation updates.',
  },
  'changes/index.md': {
    description: 'Key platform updates relevant to integrators and operators.',
  },
  'changes/migrations.md': {
    description: 'Notable deprecations and recommended upgrade paths for LanOnasis integrations.',
  },
  'cli/reference.md': {
    description: 'Complete reference for the LanOnasis CLI: commands, options, and examples.',
  },
  'examples/quickstart/first-memory.md': {
    title: 'Your First Memory',
    description: 'Learn how to create, search, and manage your first memory using the LanOnasis API.',
  },
  'features.md': {
    description: 'Overview of the core LanOnasis platform features for memory, MCP, authentication, and SDKs.',
  },
  'getting-started/installation.md': {
    title: 'Installation',
    description: 'Install and configure LanOnasis SDKs and CLI, and get your API key.',
  },
  'getting-started/quick-start.md': {
    description: 'Get up and running with LanOnasis in five minutes: install, authenticate, and create your first memory.',
  },
  'getting-started/whats-new-2026-q1.md': {
    description: "What's new in LanOnasis for 2026 Q1: platform, API, and documentation updates.",
  },
  'guides/index.md': {
    title: 'Guides',
    description: 'Comprehensive LanOnasis tutorials and best practices for real-time sync, performance, and migration.',
  },
  'guides/migration.md': {
    title: 'Migration Guide',
    description: 'Migrate your existing data to LanOnasis with step-by-step export, transform, and import guidance.',
  },
  'guides/performance.md': {
    title: 'Performance Optimization',
    description: 'Optimize your LanOnasis implementation for maximum performance with indexing and query strategies.',
  },
  'guides/realtime-sync.md': {
    title: 'Real-time Synchronization',
    description: 'Implement real-time synchronization to keep memories in sync across platforms and devices.',
  },
  'guides/vector-search.md': {
    description: 'Understand vector search in LanOnasis: embeddings, similarity thresholds, and query options.',
  },
  'keys/vendor-key-management.md': {
    description: 'Manage upstream vendor API credentials centrally with the LanOnasis Foreign API Key Manager.',
  },
  'mcp/ide-integration.md': {
    description: 'Connect the LanOnasis MCP server to your IDE for AI-assisted development.',
  },
  'mcp/overview.md': {
    description: 'Model Context Protocol overview: how LanOnasis exposes memory tools to agents and IDEs.',
  },
  'mcp/production-server.md': {
    description: 'Run or connect to the LanOnasis production MCP server for agent and IDE integrations.',
  },
  'mcp/tools.md': {
    description: 'Complete reference for all LanOnasis MCP tools: names, descriptions, and parameter shapes.',
  },
  'memory/rest-api.md': {
    description: 'REST API reference for memory operations: endpoints, authentication, and request examples.',
  },
  'memory/sdk.md': {
    description: 'Use the LanOnasis SDKs to build memory-powered applications.',
  },
  'ops/operating-platform.md': {
    description: 'Operate the LanOnasis platform: monitoring, health checks, and production considerations.',
  },
  'overview.md': {
    description: 'LanOnasis platform overview: Memory as a Service for applications and AI agents.',
  },
  'platform/architecture.md': {
    description: 'LanOnasis platform architecture: memory service, MCP core, auth gateway, and supporting services.',
  },
  'platform/auth-gateway.md': {
    description: 'How the LanOnasis auth gateway handles authentication, authorization, and API key contexts.',
  },
  'sdks/cli.md': {
    title: 'CLI Tool',
    description: 'Official LanOnasis command-line interface for Memory-as-a-Service management and automation.',
  },
  'sdks/cli/automation.md': {
    description: 'Automate memory workflows with the LanOnasis CLI for CI/CD and scripting.',
  },
  'sdks/cli/commands.md': {
    title: 'CLI Commands Reference',
    description: 'Complete reference for all LanOnasis CLI commands, options, and examples.',
  },
  'sdks/cli/examples.md': {
    description: 'Practical LanOnasis CLI examples for common memory operations.',
  },
  'sdks/cli/installation.md': {
    title: 'CLI Installation',
    description: 'Install and configure the LanOnasis CLI tool for command-line memory management.',
  },
  'sdks/overview.md': {
    description: 'Overview of LanOnasis SDKs: TypeScript, Python, CLI, and REST API clients.',
  },
  'sdks/python.md': {
    title: 'Python SDK',
    description: 'Official Python SDK for LanOnasis Memory-as-a-Service.',
  },
  'sdks/python/api-reference.md': {
    title: 'Python SDK API Reference',
    description: 'Complete reference for the LanOnasis Python SDK: methods, parameters, and return types.',
  },
  'sdks/python/best-practices.md': {
    description: 'Best practices for building reliable, performant LanOnasis Python SDK applications.',
  },
  'sdks/python/examples.md': {
    description: 'Common usage examples for the LanOnasis Python SDK.',
  },
  'sdks/python/quickstart.md': {
    title: 'Python SDK Quickstart',
    description: 'Get started with the LanOnasis Python SDK: installation, authentication, and first memory operations.',
  },
  'sdks/python/troubleshooting.md': {
    description: 'Troubleshoot common LanOnasis Python SDK issues: auth, connectivity, and errors.',
  },
  'sdks/security-sdk.md': {
    description: 'Security SDK reference for the LanOnasis security service.',
  },
  'sdks/typescript.md': {
    title: 'TypeScript SDK',
    description: 'Official TypeScript SDKs for LanOnasis Memory-as-a-Service.',
  },
  'sdks/typescript/api-reference.md': {
    title: 'TypeScript API Reference',
    description: 'Complete API reference for the LanOnasis TypeScript SDK.',
  },
  'sdks/typescript/examples.md': {
    title: 'TypeScript Examples',
    description: 'Common usage examples for the LanOnasis TypeScript SDK.',
  },
  'sdks/typescript/quickstart.md': {
    description: 'Quickstart for the LanOnasis TypeScript SDK: install, authenticate, and create memories.',
  },
  'security/privacy-implementation.md': {
    description: 'How LanOnasis implements data privacy: encryption, retention, and tenant isolation.',
  },
  'support.md': {
    description: 'LanOnasis support channels, status resources, and how to get help.',
  },
  'use-cases/customer-support.md': {
    title: 'Customer Support',
    description: 'Leverage LanOnasis for customer support operations with knowledge base and ticket context.',
  },
  'use-cases/personal-knowledge.md': {
    description: 'Use LanOnasis for personal knowledge management and durable AI context.',
  },
  'use-cases/team-collaboration.md': {
    title: 'Team Collaboration',
    description: 'Use LanOnasis to enhance team collaboration and knowledge sharing.',
  },
  'v-secure/compliance/gdpr.md': {
    description: 'How the LanOnasis v-secure platform supports GDPR compliance requirements.',
  },
  'v-secure/compliance/iso27001.md': {
    description: 'How the LanOnasis v-secure platform supports ISO 27001 compliance requirements.',
  },
  'v-secure/compliance/pci-dss.md': {
    description: 'How the LanOnasis v-secure platform supports PCI DSS compliance requirements.',
  },
  'v-secure/compliance/soc2.md': {
    description: 'How the LanOnasis v-secure platform supports SOC 2 compliance requirements.',
  },
  'v-secure/sdk.md': {
    description: 'Use the v-secure SDK to integrate security tooling into your application.',
  },
  'v-secure/security-service.md': {
    description: 'Reference for the LanOnasis security service and its API surface.',
  },
};

function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { fm: {}, body: content, raw: null };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return { fm, body: content.slice(m[0].length), raw: m[0] };
}

let applied = 0;
for (const [rel, meta] of Object.entries(SEO)) {
  const path = file(rel);
  const content = readFileSync(path, 'utf8');
  const { fm, body, raw } = parseFrontmatter(content);

  const lines = raw ? raw.split('\n') : ['---', '---'];
  const setTitle = meta.title && !fm.title;
  const setDesc = meta.description && !fm.description;

  if (setTitle) {
    const insertAt = lines.length - 1; // before closing ---
    lines.splice(insertAt, 0, `title: ${meta.title}`);
    fm.title = meta.title;
  }
  if (setDesc) {
    const insertAt = lines.length - 1;
    lines.splice(insertAt, 0, `description: ${meta.description}`);
    fm.description = meta.description;
  }

  if (setTitle || setDesc) {
    const sep = raw ? '' : '\n';
    writeFileSync(path, lines.join('\n') + sep + body);
    applied += 1;
  }
}

console.log(`Applied frontmatter to ${applied} files.`);
