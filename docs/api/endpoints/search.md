---
title: Search & Discovery
description: Semantic search and discovery API powered by vector embeddings and machine learning.
---

## Search & Discovery API

LanOnasis provides powerful semantic search capabilities powered by advanced vector
embeddings and machine learning algorithms.

:::info Canonical search docs
This is the canonical docs page for search. The URL `/api/search` is owned by the
documentation-search serverless function (`GET /api/search?q=...`), so the search
documentation lives here at `/api/endpoints/search`.
:::

## Semantic Search

Search across all your memories using natural language queries.

### Request

```http
POST /api/v1/memories/search
```

### Authentication

```http
X-API-Key: ***
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query (natural language) |
| `limit` | integer | No | Number of results (1-100, default: 20) |
| `threshold` | float | No | Minimum similarity score (0.0-1.0, default: 0.7) |
| `type` | string | No | Filter by memory type |

### Example Request

```bash
curl -X POST "https://api.lanonasis.com/api/v1/memories/search" \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "user authentication requirements",
    "limit": 5,
    "threshold": 0.8,
    "type": "project"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "mem_abc123",
        "title": "Meeting Notes",
        "content": "Meeting notes from Q4 planning...",
        "memory_type": "meeting",
        "type": "meeting",
        "similarity_score": 0.95,
        "tags": ["planning", "q4"],
        "metadata": {
          "type": "meeting",
          "date": "2024-01-15"
        }
      }
    ],
    "total": 1,
    "query": "Q4 planning decisions",
    "threshold": 0.7
  }
}
```

## Vector-Boosted Search

Vector similarity search is available through the same memory search endpoint.
Adjust `threshold` and filters to control precision: `0.7` returns broad matches,
`0.85` or higher returns only strong semantic matches.

### Request

```http
POST /api/v1/memories/search
```

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories/search \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "project requirements",
    "limit": 5,
    "threshold": 0.85,
    "type": "project"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "4a4a675f-2e35-4598-ae7a-1c1f35730226",
        "title": "Project Requirements",
        "content": "The new feature should include user authentication...",
        "memory_type": "project",
        "type": "project",
        "similarity_score": 0.94,
        "tags": ["project", "requirements"],
        "metadata": {
          "department": "engineering",
          "project_id": "proj_123"
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 1,
    "query": "project requirements",
    "threshold": 0.85
  }
}
```

## Advanced Search Filters

### Metadata Filtering

Filter search results by memory type:

```bash
curl -X POST "https://api.lanonasis.com/api/v1/memories/search" \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "project requirements",
    "type": "project"
  }'
```

### Date Range Filtering

Use the `type` filter in the search body to narrow results. The search endpoint does
not expose a dedicated date-range filter today.

### Combined Filtering

```bash
curl -X POST "https://api.lanonasis.com/api/v1/memories/search" \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "security requirements",
    "threshold": 0.9,
    "limit": 20
  }'
```

## Examples

### Semantic Search

```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

const results = await client.searchMemories({
  query: "Q4 planning decisions",
  limit: 10,
  threshold: 0.8
});
```

### Filtered Search

```typescript
const results = await client.searchMemories({
  query: "budget discussions",
  tags: ["meeting"],
  limit: 5,
  threshold: 0.75
});
```

### Python

```python
import os
from lanonasis import MemoryClient

client = MemoryClient(api_key=os.environ['LANONASIS_API_KEY'])

search_results = client.search_memories(
    query='user authentication',
    limit=10,
    threshold=0.8,
    tags=['security', 'requirements']
)

print(f'Search results: {search_results.results}')
```

## Search Suggestions

Autocomplete endpoints are not currently available in the REST API. Use client-side
suggestions or cached queries for now.

## Real-time Search

Real-time search streaming endpoints are not currently available in the REST API.
Use polling with `searchMemories` if you need live updates.

## Generate Embeddings

Generate vector embeddings for custom text.

### Request

```http
POST /api/v1/embeddings
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `input` | string or string[] | Yes | Text or list of texts to generate embeddings for (up to 128) |
| `model` | string | No | Embedding model (default: `voyage-4-large`; unknown models fall back to it) |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/embeddings \
  -H "X-API-Key: $LANONASIS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "User authentication and security requirements",
    "model": "voyage-4"
  }'
```

### Example Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [0.1234, -0.5678, 0.9012, "..."],
      "index": 0
    }
  ],
  "model": "voyage-4",
  "usage": {
    "prompt_tokens": 6,
    "total_tokens": 6
  }
}
```

See [Embeddings API](./embeddings.md) for the full embeddings reference.

## Search Analytics

Track search performance and user behavior.

:::danger Not available
`GET /api/v1/analytics/search` is **not served** by `api.lanonasis.com` today: no route
exists, and requests fail. This section describes a planned API and is kept for
reference only. Do not build against it.
:::

### Request

```http
GET /api/v1/analytics/search
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | string | No | Start date (ISO 8601) |
| `to` | string | No | End date (ISO 8601) |
| `group_by` | string | No | `hour`, `day`, `week`, `month` (default: `day`) |

### Example Response

```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z",
      "granularity": "day"
    },
    "metrics": {
      "total_searches": 1250,
      "unique_queries": 890,
      "avg_results_per_search": 8.3,
      "avg_query_time_ms": 42,
      "zero_result_searches": 15
    },
    "top_queries": [
      {
        "query": "user authentication",
        "count": 45,
        "avg_similarity_score": 0.87
      }
    ]
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_QUERY` | 400 | Search query is invalid or empty |
| `INVALID_VECTOR` | 400 | Vector dimension mismatch or invalid format |
| `SIMILARITY_THRESHOLD_INVALID` | 400 | Threshold must be between 0.0 and 1.0 |
| `SEARCH_TIMEOUT` | 408 | Search operation timed out |
| `RATE_LIMIT_EXCEEDED` | 429 | Search rate limit exceeded |

See [Error Codes](../error-codes.md) for the platform-wide error reference.

## Performance Optimization

### Query Optimization

- Use specific queries instead of broad terms
- Leverage tag filtering to narrow results
- Set appropriate similarity thresholds
- Use pagination for large result sets

### Caching Strategy

```javascript
// Implement client-side caching for frequently used queries
const searchCache = new Map();

async function cachedSearch(query, options = {}) {
  const cacheKey = JSON.stringify({ query, ...options });

  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const results = await client.searchMemories({ query, ...options });
  searchCache.set(cacheKey, results);

  // Cache for 5 minutes
  setTimeout(() => searchCache.delete(cacheKey), 5 * 60 * 1000);

  return results;
}
```

## Search Best Practices

1. **Query Construction**
   - Use natural language queries
   - Include context and specific terms
   - Avoid overly broad or generic queries

2. **Performance**
   - Set appropriate similarity thresholds
   - Use metadata filters to narrow results
   - Implement client-side caching

3. **User Experience**
   - Provide search suggestions
   - Highlight matching terms
   - Show search progress indicators

4. **Analytics**
   - Track search metrics
   - Monitor query performance
   - Analyze user search patterns
