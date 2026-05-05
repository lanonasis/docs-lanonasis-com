---
title: Central Auth Gateway
sidebar_label: Central Auth Gateway
---

> **Deprecation notice (task #128/#129):** The Central Auth Gateway is the underlying
> platform auth infrastructure. For **dashboard web apps**, the supported owner model is
> `direct-auth` (direct Supabase sessions). The gateway is used by the dashboard only for
> token-exchange bridging and SSO cookie sync — not as the primary interactive auth path.
> See [direct-auth](#) and the [migration guide](../changes/migrations.md) for details.

The Central Auth Gateway is the canonical authentication entry for all LanOnasis clients and services. It standardizes OAuth (Device Flow and PKCE) and enforces project-scoped access across the platform.

## Endpoints

Primary entry points (use either based on client environment and routing proximity):

- `https://auth.lanonasis.com/v1/...`
- `https://api.lanonasis.com/v1/auth/...`

Typical OAuth routes (representative):

- Device Flow initiation and polling
- PKCE authorization and token exchange
- Session and token lifecycle routes

> Exact route shapes and headers are guaranteed by the gateway. Prefer the OAuth flows over direct API keys wherever possible.

## Which clients use which flow

- CLI / IDE extensions / MCP-integrated agents: Device Flow via the gateway (user-friendly, headless-safe), backed by PKCE.
- **Web dashboards and first‑party apps (task #128/#129): direct-auth is the supported owner model.**
  The dashboard uses Supabase direct sessions (`direct-auth`) as the primary interactive auth path.
  The gateway is still used for token-exchange bridging (Supabase session → platform SSO cookies) and
  for platform-wide API key / service token management, but it is no longer the dashboard's primary
  interactive auth entrypoint.
- Service-to-service: short‑lived, scoped tokens via the gateway; avoid long‑lived static keys.
- Raw API keys: legacy/limited; only where explicitly documented and scoped. Plan upgrades to OAuth.

## Environment and configuration

- Use the documented base URLs above.
- Configure per‑project environment variables as described in the operator guide (see [Operating the Platform](../ops/operating-platform.md)).
- Never expose service_role credentials to frontends.

## Security posture

- Requests are verified with project‑scoped JWT claims and audited centrally.
- Row‑Level Security remains enforced at the database layer.
- Rate limiting and abuse protections are applied at the gateway.

## Migration guidance

If you are using raw API keys in older integrations:

- Prefer Device Flow for CLI/IDE/MCP clients and PKCE for web apps.
- Review deprecations and upgrade steps in [Changelog & Migration](../changes/migrations.md).

## Related docs

- Platform map: [Architecture & Domains](../platform/architecture.md)
- MCP integration: [Production MCP Server](../mcp/production-server.md)
- Security & privacy: [Implementation Overview](../security/privacy-implementation.md)

