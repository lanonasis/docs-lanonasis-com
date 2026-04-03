# Embeddings API

Generate OpenAI-compatible vector embeddings for your content using the
LanOnasis embeddings endpoint backed by Voyage AI.

## Endpoint

```
POST /api/v1/embeddings
```

## Description

The Embeddings API allows you to convert text into high-dimensional vector representations that can be used for semantic search, similarity matching, and other AI-powered applications.

## Authentication

```http
Authorization: Bearer lano_your_api_key_here
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
| `input` | string or string[] | Yes | Text content or list of texts to embed |
| `model` | string | No | Embedding model to use (default: `voyage-4`) |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/embeddings \
  -H "Authorization: Bearer lano_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "LanOnasis provides intelligent memory management for AI applications",
    "model": "voyage-4"
  }'
```

```typescript
import { MemoryClient } from '@lanonasis/memory-client';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

const embedding = await client.generateEmbedding({
  input: "LanOnasis provides intelligent memory management for AI applications",
  model: "voyage-4"
});

console.log(embedding.data[0].embedding); // [0.1, -0.2, 0.3, ...]
```

```python
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com"
)

embedding = client.generate_embedding(
    input="LanOnasis provides intelligent memory management for AI applications",
    model="voyage-4",
)

print(embedding["data"][0]["embedding"])  # [0.1, -0.2, 0.3, ...]
```

## Response

### Success Response (200 OK)

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [0.1, -0.2, 0.3, 0.4, -0.5],
      "index": 0
    }
  ],
  "model": "voyage-4",
  "usage": {
    "prompt_tokens": 12,
    "total_tokens": 12
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
      "message": "Input is required",
      "details": {
      "field": "input",
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
| `voyage-4` | 1024 | Provider managed | Default production model |

## Rate Limits

- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

## Best Practices

1. **Batch Processing**: Use `input: string[]` to embed multiple texts in one request
2. **Model Selection**: Omit `model` unless you have an explicit provider override requirement
3. **Caching**: Cache embeddings for repeated text
4. **Error Handling**: Implement retry logic for rate limits and upstream provider failures

## Use Cases

- **Semantic Search**: Find similar content based on meaning
- **Recommendation Systems**: Suggest related items
- **Content Classification**: Categorize text automatically
- **Similarity Matching**: Find duplicate or similar content
