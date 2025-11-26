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
POST /v1/memories
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Memory title (max 200 chars) |
| `content` | string | Yes | Memory content (max 50MB) |
| `tags` | array | No | Array of tags for categorization |
| `metadata` | object | No | Custom metadata object |
| `embedding_model` | string | No | Override default embedding model |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/v1/memories \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Requirements",
    "content": "The new feature should include user authentication, data visualization, and real-time updates. Priority is high for Q1 delivery.",
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
    "tags": ["project", "requirements", "high-priority"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com",
      "department": "engineering",
      "deadline": "2024-03-31"
    },
    "embedding_model": "text-embedding-ada-002",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "size_bytes": 1024,
    "similarity_threshold": 0.8
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_create_789"
  }
}
```

## Get Memory

Retrieve a specific memory by ID.

### Request

```http
GET /v1/memories/{id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Memory ID (e.g., mem_456789) |

### Example Request

```bash
curl -X GET https://api.lanonasis.com/v1/memories/mem_456789 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "mem_456789",
    "title": "Project Requirements",
    "content": "The new feature should include user authentication...",
    "tags": ["project", "requirements", "high-priority"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com",
      "department": "engineering",
      "deadline": "2024-03-31"
    },
    "embedding_model": "text-embedding-ada-002",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "size_bytes": 1024,
    "access_count": 5,
    "last_accessed": "2024-01-16T09:15:00Z"
  },
  "meta": {
    "timestamp": "2024-01-16T09:15:00Z",
    "request_id": "req_get_123"
  }
}
```

## Update Memory

Update an existing memory's content, tags, or metadata.

### Request

```http
PUT /v1/memories/{id}
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
curl -X PUT https://api.lanonasis.com/v1/memories/mem_456789 \
  -H "Authorization: Bearer YOUR_API_KEY" \
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
    "tags": ["project", "requirements", "high-priority", "reviewed"],
    "metadata": {
      "project_id": "proj_123",
      "author": "john.doe@company.com",
      "department": "engineering",
      "deadline": "2024-03-31",
      "status": "approved"
    },
    "embedding_model": "text-embedding-ada-002",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-16T14:22:00Z",
    "size_bytes": 1024
  },
  "meta": {
    "timestamp": "2024-01-16T14:22:00Z",
    "request_id": "req_update_456"
  }
}
```

## Delete Memory

Permanently delete a memory. This action cannot be undone.

### Request

```http
DELETE /v1/memories/{id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Memory ID to delete |

### Example Request

```bash
curl -X DELETE https://api.lanonasis.com/v1/memories/mem_456789 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "mem_456789",
    "deleted": true,
    "deleted_at": "2024-01-16T15:30:00Z"
  },
  "meta": {
    "timestamp": "2024-01-16T15:30:00Z",
    "request_id": "req_delete_789"
  }
}
```

## List Memories

Retrieve a paginated list of memories with optional filtering.

### Request

```http
GET /v1/memories
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Number of results per page (1-100, default: 20) |
| `offset` | integer | No | Number of results to skip (default: 0) |
| `tags` | string | No | Comma-separated tags to filter by |
| `created_after` | string | No | ISO 8601 timestamp filter |
| `created_before` | string | No | ISO 8601 timestamp filter |
| `search` | string | No | Full-text search within titles and content |
| `sort` | string | No | Sort order: `created_asc`, `created_desc`, `updated_asc`, `updated_desc` |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/v1/memories?limit=10&tags=project,requirements&sort=updated_desc" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "memories": [
      {
        "id": "mem_456789",
        "title": "Project Requirements",
        "content": "The new feature should include user authentication...",
        "tags": ["project", "requirements", "high-priority"],
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-16T14:22:00Z",
        "size_bytes": 1024
      },
      {
        "id": "mem_789012",
        "title": "Technical Specifications",
        "content": "Database schema and API design for the new feature...",
        "tags": ["project", "technical", "specifications"],
        "created_at": "2024-01-14T16:45:00Z",
        "updated_at": "2024-01-15T11:30:00Z",
        "size_bytes": 2048
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  },
  "meta": {
    "timestamp": "2024-01-16T16:00:00Z",
    "request_id": "req_list_234"
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
import { LanonasisClient } from '@lanonasis/sdk';

const client = new LanonasisClient({
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const memory = await client.memories.create({
  title: 'Important Note',
  content: 'This is crucial information...',
  tags: ['important', 'note']
});

// Retrieve a memory
const retrieved = await client.memories.get(memory.id);

// Update a memory
const updated = await client.memories.update(memory.id, {
  tags: [...retrieved.tags, 'updated']
});

// Delete a memory
await client.memories.delete(memory.id);
```

### Python
```python
from lanonasis import LanOnasisClient

client = LanOnasisClient(api_key=os.environ['LANONASIS_API_KEY'])

# Create a memory
memory = client.memories.create(
    title='Important Note',
    content='This is crucial information...',
    tags=['important', 'note']
)

# Retrieve a memory
retrieved = client.memories.get(memory.id)

# Update a memory
updated = client.memories.update(
    memory.id,
    tags=retrieved.tags + ['updated']
)

# Delete a memory
client.memories.delete(memory.id)
```