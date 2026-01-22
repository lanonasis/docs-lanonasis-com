---
title: Memory API
sidebar_label: Memory Management
---

# Memory Management API

## POST /api/v1/memories

Store a new memory entry with optional metadata and vector embeddings.

### Authentication

```http
X-API-Key: YOUR_API_KEY
```

### Request

#### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| X-API-Key | string | Yes | API key |
| Content-Type | string | Yes | application/json |

#### Body

```json
{
  "title": "string (required)",
  "content": "string (required)",
  "memory_type": "context",
  "type": "context",
  "tags": ["string"],
  "metadata": {
    "source": "string",
    "timestamp": "ISO 8601"
  }
}
```

### Response

#### Success (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "mem_abc123",
    "title": "Meeting notes from Q4 planning",
    "content": "Meeting notes from Q4 planning...",
    "memory_type": "meeting",
    "type": "meeting",
    "tags": ["planning", "q4"],
    "metadata": {
      "source": "notebook"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Text field is required",
    "details": [
      {
        "field": "content",
        "message": "Required"
      }
    ],
    "request_id": "req_123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

##### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired API key",
    "request_id": "req_124",
    "timestamp": "2024-01-15T10:31:00Z"
  }
}
```

##### 429 Rate Limited
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "details": [],
    "request_id": "req_125",
    "timestamp": "2024-01-15T10:32:00Z"
  }
}
```

### Examples

#### cURL

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Notes",
    "content": "Meeting notes from Q4 planning",
    "memory_type": "meeting",
    "tags": ["planning", "q4"],
    "metadata": {
      "source": "notebook"
    }
  }'
```

#### TypeScript SDK

```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

const created = await client.createMemory({
  title: "Meeting Notes",
  content: "Meeting notes from Q4 planning",
  memory_type: "meeting",
  tags: ["planning", "q4"],
  metadata: {
    source: "notebook"
  }
});

if (created.data) {
  console.log(created.data.id);
}
```

#### Python SDK

```python
result = client.create_memory(
    title="Meeting Notes",
    content="Meeting notes from Q4 planning",
    memory_type="meeting",
    tags=["planning", "q4"],
    metadata={
        "source": "notebook"
    }
)
```

### Rate Limits

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1000 requests/hour
- **Enterprise**: Unlimited

### Webhooks

This endpoint triggers the following webhooks:
- `memory.created`
- `embedding.generated`

---

## GET /api/v1/memories/:id

Retrieve a specific memory by ID.

### Authentication

```http
X-API-Key: YOUR_API_KEY
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "mem_abc123",
    "title": "Meeting Notes",
    "content": "Meeting notes from Q4 planning",
    "memory_type": "meeting",
    "type": "meeting",
    "tags": ["planning", "q4"],
    "metadata": {
      "source": "notebook"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## DELETE /api/v1/memories/:id

Delete a memory entry.

### Authentication

```http
X-API-Key: YOUR_API_KEY
```

### Response

```http
200 OK
```

```json
{
  "success": true,
  "message": "Memory deleted successfully",
  "data": {
    "id": "mem_abc123",
    "deleted_at": "2024-01-15T10:35:00Z"
  }
}
```

---

## PUT /api/v1/memories/:id

Update an existing memory.

### Request Body

```json
{
  "title": "Updated Meeting Notes",
  "content": "Updated meeting notes",
  "memory_type": "meeting",
  "tags": ["planning", "q4", "revised"],
  "metadata": {
    "source": "notebook"
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "mem_abc123",
    "title": "Updated Meeting Notes",
    "content": "Updated meeting notes",
    "memory_type": "meeting",
    "type": "meeting",
    "tags": ["planning", "q4", "revised"],
    "metadata": {
      "source": "notebook"
    },
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```
