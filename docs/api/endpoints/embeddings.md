# Embeddings API

Generate and manage vector embeddings for your content using LanOnasis's advanced embedding models.

## Endpoint

```
POST /api/v1/embeddings
```

## Description

The Embeddings API allows you to convert text into high-dimensional vector representations that can be used for semantic search, similarity matching, and other AI-powered applications.

## Authentication

```http
Authorization: Bearer <your-api-key>
```

## Request

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token for API authentication |
| `Content-Type` | string | Yes | Must be `application/json` |
| `X-Client-Version` | string | No | Client SDK version for analytics |

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text content to generate embeddings for |
| `model` | string | No | Embedding model to use (default: `text-embedding-3-large`) |
| `dimensions` | number | No | Number of dimensions for the embedding (default: 1536) |
| `metadata` | object | No | Additional metadata to store with the embedding |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/embeddings \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "LanOnasis provides intelligent memory management for AI applications",
    "model": "text-embedding-3-large",
    "dimensions": 1536,
    "metadata": {
      "source": "documentation",
      "category": "introduction"
    }
  }'
```

```typescript
import { MemoryClient } from '@LanOnasis/memory-sdk';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

const embedding = await client.generateEmbedding({
  text: "LanOnasis provides intelligent memory management for AI applications",
  model: "text-embedding-3-large",
  dimensions: 1536,
  metadata: {
    source: "documentation",
    category: "introduction"
  }
});

console.log(embedding.vector); // [0.1, -0.2, 0.3, ...]
```

```python
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com"
)

embedding = client.generate_embedding(
    text="LanOnasis provides intelligent memory management for AI applications",
    model="text-embedding-3-large",
    dimensions=1536,
    metadata={
        "source": "documentation",
        "category": "introduction"
    }
)

print(embedding.vector)  # [0.1, -0.2, 0.3, ...]
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "emb_1234567890abcdef",
    "vector": [0.1, -0.2, 0.3, 0.4, -0.5, ...],
    "model": "text-embedding-3-large",
    "dimensions": 1536,
    "text": "LanOnasis provides intelligent memory management for AI applications",
    "metadata": {
      "source": "documentation",
      "category": "introduction"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "usage": {
      "tokens": 12,
      "cost": 0.0001
    }
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Text content is required",
    "details": {
      "field": "text",
      "reason": "missing_required_field"
    }
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key",
    "details": {
      "reason": "invalid_api_key"
    }
  }
}
```

#### 429 Rate Limited
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "reset_at": "2024-01-15T11:00:00Z"
    }
  }
}
```

## Supported Models

| Model | Dimensions | Max Tokens | Use Case |
|-------|------------|------------|----------|
| `text-embedding-3-small` | 512, 1024, 1536 | 8191 | Fast, cost-effective |
| `text-embedding-3-large` | 1024, 1536, 3072 | 8191 | High quality, balanced |
| `text-embedding-ada-002` | 1536 | 8191 | Legacy, stable |

## Rate Limits

- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

## Best Practices

1. **Batch Processing**: Use the batch endpoint for multiple texts
2. **Model Selection**: Choose appropriate model based on use case
3. **Caching**: Cache embeddings for repeated text
4. **Error Handling**: Implement retry logic for rate limits

## Use Cases

- **Semantic Search**: Find similar content based on meaning
- **Recommendation Systems**: Suggest related items
- **Content Classification**: Categorize text automatically
- **Similarity Matching**: Find duplicate or similar content