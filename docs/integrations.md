---
title: Integrations
sidebar_position: 5
description: Available MCP integrations, connection guides, and supported developer surfaces for LanOnasis.
---

# Integrations

LanOnasis exposes a Model Context Protocol (MCP) server plus REST, CLI, and SDK surfaces so AI agents, IDEs, and applications can connect to the memory and context platform.

This page covers the available integrations and how to connect each one.

## Available integrations

| Integration | Surface | Best for |
|---|---|---|
| [MCP server](./mcp/overview.md) | SSE, WebSocket, HTTP REST, stdio | AI agents, IDEs, and any MCP-compatible client |
| [IDE integration](./mcp/ide-integration.md) | VSCode (desktop + web), Cursor, Windsurf | Editors and AI coding assistants |
| [Memory REST API](./memory/rest-api.md) | HTTP REST | Server-side applications and webhooks |
| [Memory SDK](./memory/sdk.md) | TypeScript / Python | Application code in your stack |
| [CLI](./cli/reference.md) | Terminal / automation | Scripts, cron jobs, and local workflows |
| [v-secure MCP](./v-secure/guides/mcp-integration.md) | MCP server | Secure secrets and resource access for AI tools |

## MCP integration

The [MCP server](./mcp/overview.md) is the primary integration surface. It provides memory operations, API key management, memory intelligence, and behavior operations to any MCP-compatible client.

**Production endpoint:** `https://mcp.lanonasis.com`

**Transports available:**

- **SSE** — `https://mcp.lanonasis.com/sse`
- **WebSocket** — `wss://mcp.lanonasis.com/ws`
- **HTTP REST** — `https://mcp.lanonasis.com/api/v1/mcp/*`
- **Stdio** — local development and CLI integration

See the [MCP Overview](./mcp/overview.md) for the full tool reference, and the [Production Server](./mcp/production-server.md) guide for deployment details.

## Connection guides

### AI agents (Claude, Copilot, etc.)

Connect an agent to the MCP server using your preferred MCP client configuration. Authenticate first via the [Central Auth Gateway](./auth/central-auth-gateway.md):

```bash
lanonasis auth login
lanonasis mcp connect
lanonasis mcp status
```

### IDEs

VSCode (desktop and web), Cursor, and Windsurf are supported. See the [IDE Integration guide](./mcp/ide-integration.md) for per-editor configuration, including:

- VSCode Memory Assistant extension configuration
- Cursor MCP server setup
- Windsurf `mcpServers` JSON configuration

### Applications (REST API)

Use the [Memory REST API](./memory/rest-api.md) directly from any HTTP client:

```bash
curl -X POST https://api.lanonasis.com/v1/memories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Example", "content": "Memory content", "memory_type": "context"}'
```

### Your own codebase (SDKs)

Pick the SDK for your language:

- [TypeScript SDK](./sdks/typescript.md)
- [Python SDK](./sdks/python.md)
- [SDK overview](./sdks/overview.md)

### Scripts and automation (CLI)

Use the [CLI reference](./cli/reference.md) for terminal and automation workflows:

```bash
lanonasis memory create --inline
lanonasis memory search "project decisions" --type context --limit 10
```

## Authentication

All integrations require authentication. Two methods are supported:

- **OAuth 2.0 with PKCE** — recommended for interactive applications and IDEs
- **Scoped API keys** — recommended for automation and CI/CD

See the [Central Auth Gateway](./auth/central-auth-gateway.md) guide and the [Vendor Key Management](./keys/vendor-key-management.md) page for key lifecycle details.

## Related documentation

- [MCP Overview](./mcp/overview.md) — protocol, tools, and transports
- [MCP Tools Reference](./mcp/tools.md) — complete tool catalog
- [IDE Integration](./mcp/ide-integration.md) — editor setup
- [Memory REST API](./memory/rest-api.md) — HTTP API reference
- [SDKs & Libraries](./sdks/overview.md) — language SDKs
- [v-secure MCP Integration](./v-secure/guides/mcp-integration.md) — secure AI tool access
