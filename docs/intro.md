---
title: Welcome to LanOnasis
sidebar_position: 1
description: LanOnasis memory API, MCP, CLI, TypeScript client, and authentication documentation.
---

# LanOnasis Memory Service

LanOnasis gives applications and AI agents durable, searchable context. The supported developer surface combines a REST memory API, Model Context Protocol tools, the Onasis CLI, and a TypeScript memory client.

## Supported interfaces

- **Memory API** - create, retrieve, update, delete, list, and semantically search memories.
- **MCP server** - expose supported memory and context tools to compatible AI clients.
- **Onasis CLI** - authenticate and work with memories from a terminal or automation.
- **TypeScript client** - integrate memory operations into JavaScript and TypeScript applications.
- **Authentication** - use OAuth 2.0 for interactive sessions or scoped API keys for automation.

Context-aware API keys can apply personal, team, or enterprise memory boundaries. Keys without a context retain the documented legacy behavior.

## Quick start

### 1. Install the CLI

```bash
npm install -g @lanonasis/cli
onasis --version
```

The current documented CLI is <!-- AUTO:CLI_VERSION -->3.11.1<!-- /AUTO -->.

### 2. Authenticate

```bash
# Interactive OAuth
onasis auth login

# Or use a vendor key for automation
onasis auth login --vendor-key <your-key>

# Verify the active identity and connection
onasis auth status
onasis whoami
```

Never commit API keys or tokens to source control. Use your platform's secret store for automation.

### 3. Create and search memory

```bash
onasis memory create --inline
onasis memory search "project decisions" --type context --limit 10
```

For the complete command surface, see the [CLI reference](./cli/reference.md).

## TypeScript example

```typescript
import { createMemoryClient } from '@lanonasis/memory-client';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY,
});

await client.createMemory({
  title: 'Project context',
  content: 'The deployment uses the production memory API.',
  memory_type: 'context',
  tags: ['project'],
});

const results = await client.searchMemories({
  query: 'production deployment',
  limit: 5,
});
```

See the [TypeScript SDK guide](./sdks/typescript.md) for configuration and response handling.

## Production endpoints

| Service | URL |
| --- | --- |
| API gateway | `https://api.lanonasis.com` |
| MCP server | `https://mcp.lanonasis.com` |
| Authentication | `https://auth.lanonasis.com` |
| Dashboard | `https://dashboard.lanonasis.com` |
| Documentation | `https://docs.lanonasis.com` |

Transport-specific MCP paths are documented in the [production MCP server guide](./mcp/production-server.md).

## Explore

- [Memory service overview](./memory/overview.md)
- [REST API reference](./api/overview.md)
- [MCP overview](./mcp/overview.md)
- [Authentication gateway](./auth/central-auth-gateway.md)
- [SDKs and clients](./sdks/overview.md)
- [Support](./support.md)

## Need help?

- Report documentation issues on [GitHub](https://github.com/lanonasis/docs-lanonasis-com/issues).
- Contact [support@lanonasis.com](mailto:support@lanonasis.com).

**Last verified:** July 18, 2026
