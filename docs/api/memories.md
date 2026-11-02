---
title: Memory Management
sidebar_position: 2
description: "Memory management API reference: create, retrieve, update, delete, and search memories."
---

## Memory Management API

The Memory Management API allows you to create, retrieve, update, and delete memories in your LanOnasis workspace.

## Create Memory

Create a new memory with content, metadata, and tags.

### Request

```http
POST /api/v1/memories
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Memory title (max 255 chars) |
| `content` | string | Yes | Memory content |
| `memory_type` | string | No | Preferred memory type (`context`, `project`, `knowledge`, `reference`, `personal`, `workflow`) |
| `type` | string | No | MCP-compatible alias for `memory_type` |
| `tags` | array | No | Array of tags for categorization |
| `metadata` | object | No | Custom metadata object |
| `topic_id` | string | No | Optional topic UUID |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories \
  -H "X-API-Key: lano_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Requirements",
    "content": "The new feature should include user authentication, data visualization, and real-time updates. Priority is high for Q1 delivery.",
    "memory_type": "project",
    "tags": ["project", "requirements", "high-priority"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com",
      "department": "engineering",
      "deadline": "2024-03-31"
    }
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "title": "Project Requirements",
    "content": "The new feature should include user authentication...",
    "type": "project",
    "memory_type": "project",
    "tags": ["project", "requirements", "high-priority"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com",
      "department": "engineering",
      "deadline": "2024-03-31"
    },
    "topic_id": "3f5d2b3c-9d24-4f92-9b7a-3d2d95b9a1a1",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

## Get Memory

Retrieve a specific memory by full UUID or an unambiguous UUID prefix.

### Request

```http
GET /api/v1/memories/{id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Full UUID or an unambiguous UUID prefix of at least 8 characters |

### Example Request

```bash
curl -X GET https://api.lanonasis.com/api/v1/memories/4a4a675f \
  -H "X-API-Key: lano_your_api_key_here"
```

The same route also accepts a full UUID, for example
`4a4a675f-2e35-4598-ae7a-1c1f35730226`. Too-short prefixes are rejected, and
ambiguous prefixes return an error without leaking records outside the caller's
existing scope.

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "title": "Project Requirements",
    "content": "The new feature should include user authentication...",
    "type": "project",
    "memory_type": "project",
    "tags": ["project", "requirements", "high-priority"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com",
      "department": "engineering",
      "deadline": "2024-03-31"
    },
    "topic_id": "3f5d2b3c-9d24-4f92-9b7a-3d2d95b9a1a1",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "access_count": 5,
    "last_accessed": "2024-01-16T09:15:00Z"
  }
}
```

## Update Memory

Update an existing memory's content, tags, or metadata.

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
| `title` | string | No | Updated memory title |
| `content` | string | No | Updated memory content |
| `tags` | array | No | Updated tags array |
| `metadata` | object | No | Updated metadata object |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories/update \
  -H "X-API-Key: lano_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "tags": ["project", "requirements", "high-priority", "reviewed"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com",
      "department": "engineering",
      "deadline": "2024-03-31",
      "status": "approved"
    }
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
    "title": "Project Requirements",
    "content": "The new feature should include user authentication...",
    "type": "project",
    "memory_type": "project",
    "tags": ["project", "requirements", "high-priority", "reviewed"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com",
      "department": "engineering",
      "deadline": "2024-03-31",
      "status": "approved"
    },
    "topic_id": "3f5d2b3c-9d24-4f92-9b7a-3d2d95b9a1a1",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-16T14:22:00Z"
  }
}
```

## Delete Memory

Soft-delete a memory. The row is kept with `deleted_at` set, drops out of normal lists, search and reads, and can be restored. Deleting an already-deleted memory succeeds again without changing it.

### Request

```http
POST /api/v1/memories/delete?id={id}
```

`DELETE` with the same query string also works, as does `{"id": "..."}` in a POST body.

:::warning Use `/delete`, not `DELETE /memories/{id}`
`DELETE /api/v1/memories/{id}` reaches the read endpoint: it returns the memory and deletes nothing.
:::

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Memory ID to delete (query string or JSON body) |

### Example Request

```bash
curl -X POST "https://api.lanonasis.com/api/v1/memories/delete?id=4a4a675f-2e35-4598-ae7a-1c1f35730226" \
  -H "X-API-Key: lano_your_api_key_here"
```

### Example Response

```json
{
  "success": true,
  "message": "Memory 4a4a675f-2e35-4598-ae7a-1c1f35730226 deleted successfully",
  "deleted_id": "4a4a675f-2e35-4598-ae7a-1c1f35730226"
}
```

### Finding, restoring and purging deleted memories

- **Find**: `GET /api/v1/memories/list?include_deleted=true` returns soft-deleted rows alongside live ones, and `GET /api/v1/memories/{id}?include_deleted=true` reads one. The MCP tool `list_deleted_memories` lists only the deleted ones.
- **Restore**: use the MCP tool `restore_memory`. There is no REST restore route.
- **Remove for good**: the admin-only MCP tool `purge_deleted_memories` physically deletes soft-deleted rows, after a `dry_run` and a confirmation token.

## List Memories

Retrieve a page of memory **summaries** with optional filtering. List rows do not include `content` or `metadata`; fetch one memory with `GET /api/v1/memories/{id}` for the full record, or pass `include_preview=true` to get a short `content_preview` on each row.

### Request

```http
GET /api/v1/memories/list
```

`POST /api/v1/memories/list` with the same fields in a JSON body is also accepted. A bare `GET /api/v1/memories` is the create endpoint and answers `405`.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Results per page (1-100, default: 20) |
| `offset` | integer | No | Results offset (default: 0). Ignored in cursor mode |
| `type` | string | No | Filter by memory type |
| `tags` | string | No | Comma-separated tags to filter by |
| `sortBy` | string | No | Sort field (`created_at`, `updated_at`, `title`) |
| `sortOrder` | string | No | Sort order (`asc`, `desc`) |
| `include_preview` | boolean | No | Add `content_preview` (first 200 characters) to each row |
| `pagination` | string | No | `cursor` to switch to keyset pagination for the first page |
| `cursor` | string | No | The `next_cursor` from the previous page. Must be sent with the same `sortBy`/`sortOrder`, or the request is rejected with 400 |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/api/v1/memories/list?limit=10&tags=project,requirements&sortBy=updated_at&sortOrder=desc&include_preview=true" \
  -H "X-API-Key: lano_your_api_key_here"
```

### Example Response

```json
{
  "data": [
    {
      "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
      "title": "Project Requirements",
      "memory_type": "project",
      "tags": ["project", "requirements", "high-priority"],
      "content_preview": "The new feature should include user authentication, data visualization, and real-time updates…",
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
  },
  "filters": {
    "type": null,
    "tags": ["project", "requirements"],
    "search": null,
    "include_deleted": false,
    "sort_by": "updated_at",
    "sort_order": "desc"
  }
}
```

Rows also carry ownership fields (`user_id`, `organization_id`, `scope`, `owner_type`, `owner_id`, …). They are omitted above for brevity.

### Cursor pagination

For large or frequently changing lists, send `pagination=cursor` on the first request. The response then has no `total` and looks like this:

```json
{ "pagination": { "mode": "cursor", "limit": 10, "has_next": true, "next_cursor": "eyJmIjoidXBkYXRlZF9hdCIs…" } }
```

Pass `cursor=<next_cursor>` to get the next page. Stop when `has_next` is `false`.

### Caching with ETag

Every list response carries an `ETag`. Send it back as `If-None-Match`; if nothing changed you get `304 Not Modified` with an empty body.

```bash
curl -i "https://api.lanonasis.com/api/v1/memories/list?limit=10" \
  -H "X-API-Key: lano_your_api_key_here" \
  -H 'If-None-Match: W/"…etag from the previous response…"'
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MEMORY_NOT_FOUND` | 404 | Memory with specified ID does not exist |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `CONTENT_TOO_LARGE` | 413 | Memory content exceeds size limit |
| `QUOTA_EXCEEDED` | 429 | Storage or rate limit exceeded |
| `UNAUTHORIZED` | 401 | Invalid or missing API key |

## Best Practices

### Content Organization
- Use descriptive titles for easy identification
- Add relevant tags for categorization and filtering
- Include structured metadata for advanced filtering

### Performance Optimization
- Use pagination for large result sets
- Implement local caching for frequently accessed memories
- Use bulk operations when available

### Security
- Never expose API keys in client-side code
- Use environment variables for API key storage
- Implement proper error handling to avoid information leakage

## SDK Examples

### TypeScript
```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const created = await client.createMemory({
  title: 'Important Note',
  content: 'This is crucial information...',
  memory_type: 'knowledge',
  tags: ['important', 'note']
});

// Retrieve a memory
const memoryId = created.data?.id;
const retrieved = memoryId ? await client.getMemory(memoryId) : null;

// Update a memory
if (memoryId) {
  await client.updateMemory(memoryId, {
    tags: [...(retrieved?.data?.tags ?? []), 'updated']
  });
}

// Delete a memory
if (memoryId) {
  await client.deleteMemory(memoryId);
}
```

### Python (Coming Soon)
The Python SDK is not yet published. For now, use the REST API or the TypeScript SDK.
