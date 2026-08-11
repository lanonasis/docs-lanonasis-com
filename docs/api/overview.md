---
title: API Overview
sidebar_position: 1
description: Production endpoints, authentication, memory operations, and supported LanOnasis clients.
---

## LanOnasis API Reference

The LanOnasis API provides authenticated memory storage and semantic retrieval for applications and AI agents.

## Base URL

```text
https://api.lanonasis.com
```

The TypeScript client accepts this origin as `apiUrl`. Endpoint-specific examples below include the public API route prefix where required.

## Authentication

Use one of the supported authentication methods:

```http
X-API-Key: lano_your_api_key
```

```http
Authorization: Bearer your_oauth_access_token
```

API keys may carry personal, team, or enterprise memory context. The service enforces the corresponding read boundary on context-aware memory query paths. See [Authentication](./authentication.md) and [Vendor Key Management](../keys/vendor-key-management.md).

## Quick start

### TypeScript

```bash
npm install @lanonasis/memory-client
```

```typescript
import { createMemoryClient } from '@lanonasis/memory-client';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY,
});

const created = await client.createMemory({
  title: 'Release decision',
  content: 'Deploy only after the production smoke test passes.',
  memory_type: 'context',
  tags: ['release'],
});

const matches = await client.searchMemories({
  query: 'production smoke test',
  limit: 5,
});
```

### cURL

```bash
curl -X POST 'https://api.lanonasis.com/api/v1/memories/search' \
  -H 'Content-Type: application/json' \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -d '{"query":"production smoke test","limit":5}'
```

## Memory operations

| Operation | Method and route | Guide |
| --- | --- | --- |
| Create memory | `POST /api/v1/memories` | [Memory endpoints](./endpoints/memory.md) |
| List memories | `GET /api/v1/memories` | [Memory endpoints](./endpoints/memory.md) |
| Get memory | `GET /api/v1/memories/{id}` | [Memory endpoints](./endpoints/memory.md) |
| Update memory | `PUT /api/v1/memories/{id}` | [Memory endpoints](./endpoints/memory.md) |
| Delete memory | `DELETE /api/v1/memories/{id}` | [Memory endpoints](./endpoints/memory.md) |
| Search memories | `POST /api/v1/memories/search` | [Search](./endpoints/search.md) |

The canonical OpenAPI assets used by the [API playground](/api/playground) are generated from the repository's memory API specification.

## Errors and limits

Failed requests return an HTTP status and a structured error response. Handle the status code first, then use the response code and message for application behavior. See [Error Codes](./error-codes.md).

Request limits depend on the account policy in effect. Applications should honor rate-limit response headers and retry only after the indicated interval; contact support for current plan limits rather than relying on hardcoded documentation values.

## Supported clients

- **TypeScript/JavaScript:** `@lanonasis/memory-client`
- **Command line:** `@lanonasis/cli`, invoked as `onasis`
- **Protocol:** REST and MCP

See [SDKs and Libraries](../sdks/overview.md) for the maintained client documentation. Language pages that describe planned or experimental clients are not a production availability guarantee.

## Support

- Browse the [Memory Service](../memory/overview.md) and [MCP](../mcp/overview.md) guides.
- Use the [API playground](/api/playground) with a non-production test key.
- Report documentation issues on [GitHub](https://github.com/lanonasis/docs-lanonasis-com/issues).
- Contact [support@lanonasis.com](mailto:support@lanonasis.com).

**Last verified:** July 18, 2026
