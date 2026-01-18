---
title: Search & Discovery
sidebar_position: 4
---

# Search & Discovery API

LanOnasis provides powerful semantic search capabilities powered by advanced vector embeddings and machine learning algorithms.

## Semantic Search

Search across all your memories using natural language queries.

### Request

```http
POST /api/v1/memories/search
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
  -H "X-API-Key: YOUR_API_KEY" \
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
        "id": "mem_456789",
        "title": "Project Requirements",
        "content": "The new feature should include user authentication, data visualization, and real-time updates...",
        "memory_type": "project",
        "type": "project",
        "similarity_score": 0.92,
        "tags": ["project", "requirements", "high-priority"],
        "metadata": {
          "project_id": "proj_123",
          "author": "john.doe@company.com",
          "department": "engineering"
        },
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-16T14:22:00Z"
      },
      {
        "id": "mem_789012",
        "title": "Security Guidelines",
        "content": "All applications must implement secure authentication mechanisms including...",
        "memory_type": "project",
        "type": "project",
        "similarity_score": 0.87,
        "tags": ["security", "guidelines", "authentication"],
        "metadata": {
          "document_type": "policy",
          "department": "security"
        },
        "created_at": "2024-01-10T16:45:00Z",
        "updated_at": "2024-01-12T09:30:00Z"
      }
    ],
    "total": 2,
    "query": "user authentication requirements",
    "threshold": 0.8
  }
}
```

## Vector-Boosted Search

Vector similarity search is available through the same memory search endpoint. Adjust `threshold` and filters to control precision.

### Request

```http
POST /api/v1/memories/search
```

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/memories/search \
  -H "X-API-Key: YOUR_API_KEY" \
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
        "id": "mem_456789",
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

## Search Suggestions

Autocomplete endpoints are not currently available in the REST API. Use client-side suggestions or cached queries for now.

## Generate Embeddings

Generate vector embeddings for custom text.

### Request

```http
POST /api/v1/embeddings
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to generate embeddings for |
| `model` | string | No | Embedding model (default: text-embedding-ada-002) |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/embeddings \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "User authentication and security requirements",
    "model": "text-embedding-ada-002"
  }'
```

### Example Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [0.1234, -0.5678, 0.9012, ...],
      "index": 0
    }
  ],
  "model": "text-embedding-ada-002",
  "usage": {
    "prompt_tokens": 6,
    "total_tokens": 6
  }
}
```

## Advanced Search Filters

### Metadata Filtering

Filter search results by metadata fields:

```bash
curl -X POST "https://api.lanonasis.com/api/v1/memories/search" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "project requirements",
    "type": "project"
  }'
```

### Date Range Filtering

Use the `type` filter in the search body to narrow results.

### Combined Filtering

```bash
curl -X POST "https://api.lanonasis.com/api/v1/memories/search" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "security requirements",
    "threshold": 0.9,
    "limit": 20
  }'
```

## Search Analytics

Track search performance and user behavior.

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

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/api/v1/analytics/search?from=2024-01-01&to=2024-01-31&group_by=day" \
  -H "X-API-Key: YOUR_API_KEY"
```

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
      },
      {
        "query": "project requirements",
        "count": 38,
        "avg_similarity_score": 0.92
      }
    ],
    "search_trends": [
      {
        "date": "2024-01-01",
        "searches": 35,
        "avg_query_time_ms": 38
      },
      {
        "date": "2024-01-02",
        "searches": 42,
        "avg_query_time_ms": 41
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-16T16:20:00Z",
    "request_id": "req_analytics_456"
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

## SDK Examples

### TypeScript
```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

// Semantic search
const searchResults = await client.searchMemories({
  query: 'user authentication',
  limit: 10,
  threshold: 0.8,
  tags: ['security', 'requirements']
});

console.log('Search results:', searchResults.data);
```

### Python
```python
from lanonasis import MemoryClient

client = MemoryClient(api_key=os.environ['LANONASIS_API_KEY'])

# Semantic search
search_results = client.search_memories(
    query='user authentication',
    limit=10,
    threshold=0.8,
    tags=['security', 'requirements']
)

print(f'Search results: {search_results.results}')
```

## Real-time Search

Real-time search streaming endpoints are not currently available in the REST API. Use polling with `searchMemories` if you need live updates.

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