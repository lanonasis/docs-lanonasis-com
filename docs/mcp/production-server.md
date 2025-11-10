---
title: Production MCP Server
sidebar_label: Production Server
---

LanOnasis operates a production MCP server for agent and IDE integrations.

## Endpoint

- Base: `https://mcp.lanonasis.com`
- Protocols: SSE and HTTP; long‑lived connections supported
- Health and readiness endpoints are provided for monitoring

## Authentication

- Use tokens issued via the [Central Auth Gateway](../auth/central-auth-gateway.md)
- Requests are scoped to project boundaries and rate‑limited
- Audit logs capture project, user, and tool calls

## Tooling (stable set)

Stable tools include (representative categories):

- Memory tooling (read/search/write via Memory Suite)
- Vendor API Key management (store/rotate/audit)
- Observability and diagnostics for integrations

> Tool names and arguments are versioned. Prefer the latest documented contracts and avoid experimental variants.

## Usage outline

1. Acquire a token via Device Flow or PKCE using Central Auth.
2. Connect to `mcp.lanonasis.com` with the issued token.
3. Invoke tools as documented (see Memory and Keys sections).

## Deprecations

Archived or experimental MCP servers are not supported. Use only `mcp.lanonasis.com` for production integrations.

## Related docs

- IDE integration: [MCP → IDE Integration](./ide-integration.md)
- Memory Suite: [Memory → Overview](../memory/overview.md)
- Keys: [Vendor Key Management](../keys/vendor-key-management.md)

