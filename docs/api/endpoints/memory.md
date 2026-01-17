---
title: Memory API
sidebar_label: Memory Management
---

# Memory Management API

## POST /api/v1/memory

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
  "data": {
    "id": "mem_abc123",
    "title": "Meeting notes from Q4 planning",
    "content": "Meeting notes from Q4 planning...",
    "memory_type": "meeting",
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
  "error": "INVALID_REQUEST",
  "message": "Text field is required",
  "details": {
    "missing_fields": ["text"]
  }
}
```

##### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired API key"
}
```

##### 429 Rate Limited
```json
{
  "error": "RATE_LIMITED",
  "message": "Too many requests",
  "retry_after": 60
}
```

### Examples

#### cURL

```bash
curl -X POST https://api.lanonasis.com/api/v1/memory \
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

## GET /api/v1/memory/:id

Retrieve a specific memory by ID.

### Authentication

```http
X-API-Key: YOUR_API_KEY
```

### Response

```json
{
  "data": {
    "id": "mem_abc123",
    "title": "Meeting Notes",
    "content": "Meeting notes from Q4 planning",
    "memory_type": "meeting",
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

## DELETE /api/v1/memory/:id

Delete a memory entry.

### Authentication

```http
X-API-Key: YOUR_API_KEY
```

### Response

```http
204 No Content
```

---

## PUT /api/v1/memory/:id

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
  "data": {
    "id": "mem_abc123",
    "title": "Updated Meeting Notes",
    "content": "Updated meeting notes",
    "memory_type": "meeting",
    "tags": ["planning", "q4", "revised"],
    "metadata": {
      "source": "notebook"
    },
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```
