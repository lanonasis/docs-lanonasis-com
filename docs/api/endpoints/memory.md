---
title: Memory API
sidebar_label: Memory Management
description: Create, read, update, delete, and search memories through the LanOnasis Memory API.
---

## Memory Management API

:::info Canonical page
[docs/api/memories.md](../memories.md) is the canonical reference for the Memory API. This page is the route-by-route companion for the API reference and must be kept in sync with it. When the two disagree, `memories.md` wins; fix this page rather than the other one.
:::

All routes below require authentication:

```http
X-API-Key: $LANONASIS_API_KEY
```

or

```http
Authorization: Bearer $LANONASIS_ACCESS_TOKEN
```

### Route index

| # | Operation | Method and route | Notes |
|---|-----------|------------------|-------|
| 1 | Create memory | `POST /api/v1/memories` | |
| 2 | List memories | `GET /api/v1/memories/list` | Summary rows only |
| 3 | Get memory | `GET /api/v1/memories/{id}` | Full record |
| 4 | Update memory | `POST /api/v1/memories/update` | `id` in the body |
| 5 | Delete memory | `POST /api/v1/memories/delete?id={id}` | Soft delete |
| 6 | Search memories | `GET /api/v1/memories/search` | Query parameters |
| 7 | Search memories | `POST /api/v1/memories/search` | JSON body |
| 8 | Memory statistics | `GET /api/v1/memories/stats` | |
| 9 | Bulk delete | `POST /api/v1/memories/bulk-delete` | Up to 100 ids |
| — | `PUT /api/v1/memories/{id}` | Not a working write | Routed to the read endpoint |
| — | `DELETE /api/v1/memories/{id}` | Not a working write | Routed to the read endpoint |

The last two rows are documented at the end of this page because clients still
reach for them. They answer `200` and change nothing.

---

## POST /api/v1/memories

Create a memory entry with optional metadata, tags, and a generated vector
embedding (MCP tool `create_memory`).

### Request

#### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| X-API-Key | string | Yes | API key (or `Authorization: Bearer`) |
| Content-Type | string | Yes | `application/json` |

#### Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Memory title (max 255 chars) |
| `content` | string | Yes | Memory content |
| `memory_type` | string | No | `context`, `project`, `knowledge`, `reference`, `personal`, `workflow` |
| `type` | string | No | MCP-compatible alias for `memory_type` |
| `tags` | array | No | Tags for categorization and filtering |
| `metadata` | object | No | Custom metadata object |
| `topic_id` | string | No | Optional topic UUID |

```json
{
  "title": "Meeting Notes",
  "content": "Meeting notes from Q4 planning",
  "memory_type": "meeting",
  "tags": ["planning", "q4"],
  "metadata": {
    "source": "notebook"
  }
}
```

### Response

#### 201 Created

```json
{
  "success": true,
  "data": {
    "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "title": "Meeting Notes",
    "content": "Meeting notes from Q4 planning",
    "memory_type": "meeting",
    "type": "meeting",
    "tags": ["planning", "q4"],
    "metadata": {
      "source": "notebook"
    },
    "created_at": "2026-10-15T10:30:00Z",
    "updated_at": "2026-10-15T10:30:00Z"
  }
}
```

#### Errors

| Status | Code | Meaning |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Missing or invalid field, e.g. empty `content` |
| 401 | `UNAUTHORIZED` | Invalid or missing credentials |
| 429 | `RATE_LIMITED` | Account or plan limit reached |

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Text field is required",
    "details": [
      { "field": "content", "message": "Required" }
    ],
    "request_id": "req_123",
    "timestamp": "2026-10-15T10:30:00Z"
  }
}
```

### Example

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Notes",
    "content": "Meeting notes from Q4 planning",
    "memory_type": "meeting",
    "tags": ["planning", "q4"],
    "metadata": { "source": "notebook" }
  }'
```

```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY!,
});

const created = await client.createMemory({
  title: 'Meeting Notes',
  content: 'Meeting notes from Q4 planning',
  memory_type: 'meeting',
  tags: ['planning', 'q4'],
  metadata: { source: 'notebook' },
});

console.log(created.data?.id);
```

### Webhooks

This endpoint triggers `memory.created` and `embedding.generated`.

---

## GET /api/v1/memories/list

List memory **summaries** with filtering and pagination (MCP tool
`list_memories`). `content` and `metadata` are omitted from list rows; call
`GET /api/v1/memories/{id}` for the full record, or pass `include_preview=true`
for a bounded `content_preview` (max 200 chars).

### Request

```http
GET /api/v1/memories/list
```

`POST /api/v1/memories/list` with the same fields in a JSON body is also
accepted. A bare `GET /api/v1/memories` is not the list route — it is the
create endpoint — so use `/list` explicitly.

### Query parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Rows per page (1–50, default 20). Larger values are clamped to 50 |
| `offset` | integer | No | Offset (default 0). Ignored in cursor mode |
| `type` | string | No | Filter by memory type |
| `tags` | string | No | Comma-separated tags |
| `sortBy` | string | No | `created_at`, `updated_at`, or `title` (default `updated_at`) |
| `sortOrder` | string | No | `asc` or `desc` (default `desc`) |
| `include_preview` | boolean | No | Attach `content_preview` to each row |
| `pagination` | string | No | `cursor` to opt into keyset pagination |
| `cursor` | string | No | `next_cursor` from the previous page; must reuse the same `sortBy`/`sortOrder` or the request is rejected with 400 |

### Response

```json
{
  "data": [
    {
      "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
      "title": "Project Requirements",
      "memory_type": "project",
      "tags": ["project", "requirements"],
      "content_preview": "The new feature should include user authentication…",
      "created_at": "2026-10-15T10:30:00Z",
      "updated_at": "2026-10-16T14:22:00Z",
      "access_count": 3
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "page": 1,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

Every response carries an `ETag`. Send it back as `If-None-Match`; unchanged
results return `304 Not Modified` with an empty body. In cursor mode the
`pagination` object returns `mode: "cursor"`, `next_cursor`, and no `total`.

### Example

```bash
curl -G https://api.lanonasis.com/api/v1/memories/list \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  --data-urlencode "limit=10" \
  --data-urlencode "type=project" \
  --data-urlencode "sortBy=updated_at" \
  --data-urlencode "sortOrder=desc" \
  --data-urlencode "include_preview=true"
```

To include soft-deleted rows, add `include_deleted=true`.

---

## GET /api/v1/memories/&#123;id&#125;

Retrieve one memory by full UUID or an unambiguous UUID prefix of at least 8
characters (MCP tool `get_memory`).

### Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Full UUID or an unambiguous prefix of 8+ characters |

Too-short prefixes are rejected; ambiguous prefixes return an error without
leaking records outside the caller's scope. Query parameter
`include_deleted=true` also returns a soft-deleted row.

### Response

```json
{
  "success": true,
  "data": {
    "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "title": "Project Requirements",
    "content": "The new feature should include user authentication...",
    "memory_type": "project",
    "type": "project",
    "tags": ["project", "requirements", "high-priority"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com"
    },
    "topic_id": "3f5d2b3c-9d24-4f92-9b7a-3d2d95b9a1a1",
    "created_at": "2026-10-15T10:30:00Z",
    "updated_at": "2026-10-16T14:22:00Z",
    "access_count": 5,
    "last_accessed": "2026-10-16T09:15:00Z"
  }
}
```

### Example

```bash
curl https://api.lanonasis.com/api/v1/memories/4a4a675f \
  -H "X-API-Key: $LANONASIS_API_KEY"
```

Errors: `404 MEMORY_NOT_FOUND`, `401 UNAUTHORIZED`.

---

## POST /api/v1/memories/update

Update an existing memory's title, content, tags, or metadata (MCP tool
`update_memory`). The id goes in the body.

### Request

```http
POST /api/v1/memories/update
```

:::warning Use `/update`, not `PUT /memories/{id}`
Every method on `/api/v1/memories/{id}` is routed to the read endpoint, so `PUT /api/v1/memories/{id}` returns the memory **unchanged** and still answers 200. Send updates to `/api/v1/memories/update` with the id in the body.
:::

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | ID of the memory to update |
| `title` | string | No | Updated title |
| `content` | string | No | Updated content |
| `tags` | array | No | Replacement tags array |
| `metadata` | object | No | Replacement metadata object |

### Example request

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories/update \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "tags": ["project", "requirements", "reviewed"],
    "metadata": { "status": "approved" }
  }'
```

### Example response

```json
{
  "success": true,
  "data": {
    "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "title": "Project Requirements",
    "tags": ["project", "requirements", "reviewed"],
    "metadata": { "status": "approved" },
    "updated_at": "2026-10-16T14:22:00Z"
  }
}
```

Errors: `404 MEMORY_NOT_FOUND`, `401 UNAUTHORIZED`.

---

## POST /api/v1/memories/delete?id=&#123;id&#125;

Soft-delete a memory (MCP tool `delete_memory`). The row is kept with
`deleted_at` set, drops out of lists, search, and reads, and can be restored.
Deleting an already-deleted memory succeeds again without changing it.

### Request

```http
POST /api/v1/memories/delete?id={id}
```

`DELETE` with the same query string also works, as does `{"id": "..."}` in a
POST body.

:::warning Use `/delete`, not `DELETE /memories/{id}`
`DELETE /api/v1/memories/{id}` reaches the read endpoint: it returns the memory and deletes nothing.
:::

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Memory ID to delete (query string or JSON body) |

### Example request

```bash
curl -X POST "https://api.lanonasis.com/api/v1/memories/delete?id=4a4a675f-2e35-4598-ae7a-1c1f35730226" \
  -H "X-API-Key: $LANONASIS_API_KEY"
```

### Example response

```json
{
  "success": true,
  "message": "Memory 4a4a675f-2e35-4598-ae7a-1c1f35730226 deleted successfully",
  "deleted_id": "4a4a675f-2e35-4598-ae7a-1c1f35730226"
}
```

### Finding, restoring and purging deleted memories

- **Find**: `GET /api/v1/memories/list?include_deleted=true` returns deleted
  rows alongside live ones, and `GET /api/v1/memories/{id}?include_deleted=true`
  reads one. The MCP tool `list_deleted_memories` lists only deleted ones.
- **Restore**: use the MCP tool `restore_memory`. There is no REST restore route.
- **Remove for good**: the admin-only MCP tool `purge_deleted_memories`
  physically deletes soft-deleted rows, after a `dry_run` and a confirmation
  token.

---

## GET /api/v1/memories/search

Semantic vector search via query parameters (MCP tool `search_memories`).

### Query parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search text (alias: `q`) |
| `type` | string | No | Filter by memory type (alias: `memory_type`) |
| `threshold` | number | No | Similarity threshold, 0–1 (default 0.55) |
| `limit` | integer | No | Max results, 1–100 (default 10) |
| `tags` | string | No | Comma-separated tags to filter by |

### Example

```bash
curl -G https://api.lanonasis.com/api/v1/memories/search \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  --data-urlencode "query=deployment checklist" \
  --data-urlencode "limit=5" \
  --data-urlencode "threshold=0.6"
```

### Response

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
        "title": "Release decision",
        "content": "Deploy only after the production smoke test passes.",
        "memory_type": "context",
        "similarity_score": 0.82
      }
    ],
    "total": 1,
    "query": "deployment checklist",
    "threshold": 0.6
  }
}
```

---

## POST /api/v1/memories/search

The same semantic search with a JSON body. Prefer this form when the query
contains characters that need escaping in a URL.

### Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search text |
| `type` | string | No | Filter by memory type |
| `threshold` | number | No | Similarity threshold, 0–1 (default 0.55) |
| `limit` | integer | No | Max results, 1–100 (default 10) |

### Example

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories/search \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "production smoke test", "limit": 5}'
```

The response shape is identical to the `GET` form. Errors: `400
VALIDATION_ERROR`, `401 UNAUTHORIZED`.

---

## GET /api/v1/memories/stats

Aggregate counts and usage statistics for the caller's memory scope (MCP tool
`memory_stats`).

### Response

```json
{
  "data": {
    "total_memories": 128,
    "by_type": {
      "context": 54,
      "project": 41,
      "knowledge": 33
    },
    "with_embeddings": 128,
    "without_embeddings": 0,
    "recent_activity": {
      "created_last_24h": 3,
      "updated_last_24h": 1,
      "accessed_last_24h": 22
    },
    "top_tags": [
      { "tag": "project", "count": 41 },
      { "tag": "release", "count": 9 }
    ],
    "storage": {
      "embedding_dimension": 1536,
      "model": "text-embedding-ada-002"
    }
  },
  "organization_id": "6f1f3f56-6f0e-4f3a-9a4b-4f5d2b3c9d24",
  "generated_at": "2026-10-16T14:30:00Z"
}
```

### Example

```bash
curl https://api.lanonasis.com/api/v1/memories/stats \
  -H "X-API-Key: $LANONASIS_API_KEY"
```

Errors: `401 UNAUTHORIZED`.

---

## POST /api/v1/memories/bulk-delete

Delete up to 100 memories in one request (MCP tool `memory_bulk_delete`). The
nginx layer also accepts `/memory/bulk/delete` and the singular `/memory/`
prefix.

### Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array | Yes | 1–100 memory UUIDs |

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories/bulk-delete \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"ids": ["4a4a675f-2e35-4598-ae7a-1c1f35730226", "9b2c1d4e-7f80-4a11-b2c3-d4e5f6071829"]}'
```

### Response

```json
{
  "success": true,
  "message": "Deleted 2 memories",
  "deleted_count": 2,
  "deleted_ids": [
    "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "9b2c1d4e-7f80-4a11-b2c3-d4e5f6071829"
  ],
  "not_found": [],
  "not_authorized": []
}
```

`not_found` and `not_authorized` list ids that were skipped, so a partially
successful request is still a `200`. Errors: `400 VALIDATION_ERROR`, `401
UNAUTHORIZED`.

---

## PUT /api/v1/memories/&#123;id&#125; — not a write

:::warning Use `/update`, not `PUT /memories/{id}`
Every method on `/api/v1/memories/{id}` is routed to the read endpoint, so `PUT /api/v1/memories/{id}` returns the memory **unchanged** and still answers 200. Send updates to `/api/v1/memories/update` with the id in the body.
:::

`PUT` on this path reaches the read function, not an update function. The
response body is the current memory, `updated_at` does not move, and no write
occurs. Any request body you send is ignored.

Use `POST /api/v1/memories/update` with `id` in the body instead:

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories/update \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id": "4a4a675f-2e35-4598-ae7a-1c1f35730226", "title": "Updated title"}'
```

The singular legacy alias `/api/v1/memory/{id}` behaves the same way.

---

## DELETE /api/v1/memories/&#123;id&#125; — not a delete

:::warning Use `/delete`, not `DELETE /memories/{id}`
`DELETE /api/v1/memories/{id}` reaches the read endpoint: it returns the memory and deletes nothing.
:::

`DELETE` on this path also reaches the read function. It answers `200` with the
memory body, `deleted_at` is never set, and the record stays visible in lists
and search. This is the failure mode worth knowing about: the call looks
successful, so a client that trusts the status code will report a delete that
never happened.

Use `POST /api/v1/memories/delete?id={id}` instead:

```bash
curl -X POST "https://api.lanonasis.com/api/v1/memories/delete?id=4a4a675f-2e35-4598-ae7a-1c1f35730226" \
  -H "X-API-Key: $LANONASIS_API_KEY"
```

Verify a delete by re-reading with `GET /api/v1/memories/{id}` and expecting a
`404`, or by checking `deleted_at` with `include_deleted=true`.

---

## Error codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MEMORY_NOT_FOUND` | 404 | Memory with the specified ID does not exist |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `CONTENT_TOO_LARGE` | 413 | Memory content exceeds the size limit |
| `QUOTA_EXCEEDED` | 429 | Storage or rate limit exceeded |
| `UNAUTHORIZED` | 401 | Invalid or missing credentials |

Request limits follow the account policy in effect; honor rate-limit response
headers and retry only after the indicated interval rather than relying on
hardcoded documentation values.

---

## See also

- [Memory Management](../memories.md) — canonical reference, including list
  pagination, ETag caching, and soft-delete lifecycle
- [Search](./search.md) — search-specific guidance
- [Error Codes](../error-codes.md)
