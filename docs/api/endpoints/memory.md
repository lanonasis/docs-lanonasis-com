---
title: Memory API
sidebar_label: Memory Management
---

# Memory Management API

## POST /api/v1/memory

Store a new memory entry with optional metadata and vector embeddings.

### Authentication

```http
Authorization: Bearer YOUR_API_KEY
X-Workspace-ID: workspace_123 (optional)
```

### Request

#### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| Authorization | string | Yes | Bearer token |
| Content-Type | string | Yes | application/json |
| X-Workspace-ID | string | No | Target workspace |

#### Body

```json
{
  "id": "string (optional)",
  "text": "string (required)",
  "metadata": {
    "type": "string",
    "tags": ["string"],
    "source": "string",
    "timestamp": "ISO 8601"
  },
  "embedding": [0.1, 0.2, ...] // optional
}
```

### Response

#### Success (201 Created)

```json
{
  "id": "mem_abc123",
  "status": "stored",
  "embedding_generated": true,
  "vector_dimensions": 1536,
  "tokens_used": 245
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
curl -X POST http://api.LanOnasis.local/api/v1/memory \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Meeting notes from Q4 planning",
    "metadata": {
      "type": "meeting",
      "tags": ["planning", "q4"]
    }
  }'
```

#### TypeScript SDK

```typescript
const result = await client.upsert({
  text: "Meeting notes from Q4 planning",
  metadata: {
    type: "meeting",
    tags: ["planning", "q4"]
  }
})
```

#### Python SDK

```python
result = client.upsert(
    text="Meeting notes from Q4 planning",
    metadata={
        "type": "meeting",
        "tags": ["planning", "q4"]
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
Authorization: Bearer YOUR_API_KEY
```

### Response

```json
{
  "id": "mem_abc123",
  "text": "Meeting notes from Q4 planning",
  "metadata": {
    "type": "meeting",
    "tags": ["planning", "q4"]
  },
  "embedding": [...],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## DELETE /api/v1/memory/:id

Delete a memory entry.

### Authentication

```http
Authorization: Bearer YOUR_API_KEY
```

### Response

```json
{
  "success": true,
  "deleted_id": "mem_abc123"
}
```

---

## PUT /api/v1/memory/:id

Update an existing memory.

### Request Body

```json
{
  "text": "Updated meeting notes",
  "metadata": {
    "type": "meeting",
    "tags": ["planning", "q4", "revised"]
  }
}
```

### Response

```json
{
  "id": "mem_abc123",
  "status": "updated",
  "embedding_regenerated": true
}
```
