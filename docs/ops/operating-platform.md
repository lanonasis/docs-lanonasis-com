---
title: Operating the LanOnasis Platform
sidebar_label: Operating the Platform
---

This page covers only the non‑obvious bits operators need to run and maintain the platform.

## Monorepo structure (high‑level)

- `apps/docs-lanonasis` – documentation site (this app)
- `apps/dashboard` – operator dashboard
- `apps/lanonasis-maas` – Memory Suite (service + UI where applicable)
- `apps/mcp-core` / `apps/mcp-lanonasis` – MCP server deployments
- `onasis-core` – Gateway and shared server components

## Common commands (Bun + Turbo)

Run from monorepo root unless stated:

```bash
# Development (all)
bun run dev

# Build (all)
bun run build

# Lint / Test
bun run lint
bun run test
```

Per‑app:

```bash
cd apps/docs-lanonasis && bun run build
cd apps/dashboard && bun run dev
```

## Deployment entry points

- Auth Gateway: `auth.lanonasis.com` behind the central gateway
- API Gateway: `api.lanonasis.com` (REST + proxies)
- MCP Core: `mcp.lanonasis.com` (SSE/HTTP)
- Memory Suite: REST via `api.lanonasis.com/api/v1/memories`

> Exact infrastructure (proxy/CDN/container) is environment‑specific and documented in operator runbooks.

## Environment & secrets

- Keep per‑project `.env` isolated; never share service_role keys with frontends
- Use Central Auth and scoped tokens for clients
- For vendor keys, use the centralized key manager

## Observability

- Audit logs include project/user/tool context where applicable
- Apply rate limits and alerts on entry points

## Related docs

- Architecture map: [Platform](../platform/architecture.md)
- Auth: [Central Auth Gateway](../auth/central-auth-gateway.md)
- MCP: [Production Server](../mcp/production-server.md)
- Memory: [Overview](../memory/overview.md)

