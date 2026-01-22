---
title: Memory Management
sidebar_position: 2
---

# Memory Management API

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
    "id": "mem_456789",
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

Retrieve a specific memory by ID.

### Request

```http
GET /api/v1/memories/{id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Memory ID (e.g., mem_456789) |

### Example Request

```bash
curl -X GET https://api.lanonasis.com/api/v1/memories/mem_456789 \
  -H "X-API-Key: lano_your_api_key_here"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "mem_456789",
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
PUT /api/v1/memories/{id}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | No | Updated memory title |
| `content` | string | No | Updated memory content |
| `tags` | array | No | Updated tags array |
| `metadata` | object | No | Updated metadata object |

### Example Request

```bash
curl -X PUT https://api.lanonasis.com/api/v1/memories/mem_456789 \
  -H "X-API-Key: lano_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
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
    "id": "mem_456789",
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

Permanently delete a memory. This action cannot be undone.

### Request

```http
DELETE /api/v1/memories/{id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Memory ID to delete |

### Example Request

```bash
curl -X DELETE https://api.lanonasis.com/api/v1/memories/mem_456789 \
  -H "X-API-Key: lano_your_api_key_here"
```

### Example Response

```json
{
  "success": true,
  "message": "Memory deleted successfully",
  "data": {
    "id": "mem_456789",
    "deleted_at": "2024-01-16T15:30:00Z"
  }
}
```

## List Memories

Retrieve a paginated list of memories with optional filtering.

### Request

```http
GET /api/v1/memories
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Results per page (1-100, default: 20) |
| `offset` | integer | No | Results offset (default: 0) |
| `type` | string | No | Filter by memory type |
| `tags` | string | No | Comma-separated tags to filter by |
| `sortBy` | string | No | Sort field (`created_at`, `updated_at`, `title`) |
| `sortOrder` | string | No | Sort order (`asc`, `desc`) |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/api/v1/memories?limit=10&offset=0&tags=project,requirements&sortBy=updated_at&sortOrder=desc" \
  -H "X-API-Key: lano_your_api_key_here"
```

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "mem_456789",
      "title": "Project Requirements",
      "content": "The new feature should include user authentication...",
      "memory_type": "project",
      "tags": ["project", "requirements", "high-priority"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T14:22:00Z"
    },
    {
      "id": "mem_789012",
      "title": "Technical Specifications",
      "content": "Database schema and API design for the new feature...",
      "memory_type": "project",
      "tags": ["project", "technical", "specifications"],
      "created_at": "2024-01-14T16:45:00Z",
      "updated_at": "2024-01-15T11:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
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