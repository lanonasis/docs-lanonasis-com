---
title: Memory REST API
sidebar_label: REST API
---

Use the REST API to integrate Memory Suite with any HTTP-capable client.

## Base URL

`https://api.lanonasis.com/api/v1/memories/`

## Typical operations

- Create/read/update/delete memory items
- Search with semantic and metadata filters
- Manage namespaces and access scopes

> Authenticate via the [Central Auth Gateway](../auth/central-auth-gateway.md). Avoid long‑lived static keys.

## Example outline

1. Acquire a token with Device Flow or PKCE.
2. Send authenticated requests to `/api/v1/memories/...`.
3. Handle 429/401/403 according to gateway semantics.

## Related docs

- Overview: [MaaS Overview](./overview.md)
- SDK: [Memory SDK](./sdk.md)
- CLI: [Memory CLI](./cli.md)

