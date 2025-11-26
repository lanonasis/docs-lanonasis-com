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
GET /v1/search
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (natural language) |
| `limit` | integer | No | Number of results (1-50, default: 10) |
| `similarity_threshold` | float | No | Minimum similarity score (0.0-1.0, default: 0.7) |
| `tags` | string | No | Comma-separated tags to filter by |
| `created_after` | string | No | ISO 8601 timestamp filter |
| `created_before` | string | No | ISO 8601 timestamp filter |
| `include_content` | boolean | No | Include full content in results (default: false) |
| `highlight` | boolean | No | Highlight matching text (default: true) |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/v1/search?q=user authentication requirements&limit=5&similarity_threshold=0.8" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "query": "user authentication requirements",
    "results": [
      {
        "id": "mem_456789",
        "title": "Project Requirements",
        "content_preview": "The new feature should include **user authentication**, data visualization, and real-time updates...",
        "similarity_score": 0.92,
        "tags": ["project", "requirements", "high-priority"],
        "metadata": {
          "project_id": "proj_123",
          "author": "john.doe@company.com",
          "department": "engineering"
        },
        "highlights": [
          "**user authentication**",
          "security **requirements**",
          "login system"
        ],
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-16T14:22:00Z"
      },
      {
        "id": "mem_789012",
        "title": "Security Guidelines",
        "content_preview": "All applications must implement secure **authentication** mechanisms including...",
        "similarity_score": 0.87,
        "tags": ["security", "guidelines", "authentication"],
        "metadata": {
          "document_type": "policy",
          "department": "security"
        },
        "highlights": [
          "secure **authentication**",
          "OAuth 2.0 **requirements**"
        ],
        "created_at": "2024-01-10T16:45:00Z",
        "updated_at": "2024-01-12T09:30:00Z"
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 5,
      "offset": 0,
      "has_more": true
    },
    "search_metadata": {
      "query_time_ms": 45,
      "embedding_model": "text-embedding-ada-002",
      "similarity_threshold": 0.8
    }
  },
  "meta": {
    "timestamp": "2024-01-16T16:00:00Z",
    "request_id": "req_search_234"
  }
}
```

## Vector Search

Perform similarity search using custom vectors or embeddings.

### Request

```http
POST /v1/search/vector
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vector` | array | Yes | Vector embedding (1536 dimensions) |
| `limit` | integer | No | Number of results (1-50, default: 10) |
| `similarity_threshold` | float | No | Minimum similarity score (0.0-1.0, default: 0.7) |
| `tags` | array | No | Array of tags to filter by |
| `metadata_filter` | object | No | Filter by metadata fields |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/v1/search/vector \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "vector": [0.1, -0.2, 0.3, ...], // 1536-dimensional vector
    "limit": 5,
    "similarity_threshold": 0.85,
    "tags": ["project"],
    "metadata_filter": {
      "department": "engineering",
      "project_id": "proj_123"
    }
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
        "content_preview": "The new feature should include user authentication...",
        "similarity_score": 0.94,
        "vector_distance": 0.06,
        "tags": ["project", "requirements"],
        "metadata": {
          "department": "engineering",
          "project_id": "proj_123"
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 3,
      "limit": 5,
      "offset": 0,
      "has_more": false
    },
    "search_metadata": {
      "query_time_ms": 23,
      "similarity_threshold": 0.85,
      "distance_metric": "cosine"
    }
  },
  "meta": {
    "timestamp": "2024-01-16T16:05:00Z",
    "request_id": "req_vector_search_567"
  }
}
```

## Search Suggestions

Get autocomplete suggestions for search queries.

### Request

```http
GET /v1/search/suggestions
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Partial search query |
| `limit` | integer | No | Number of suggestions (1-20, default: 5) |
| `type` | string | No | Suggestion type: `query`, `tag`, `title` (default: `query`) |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/v1/search/suggestions?q=user auth&limit=5" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "query": "user auth",
    "suggestions": [
      {
        "text": "user authentication",
        "type": "query",
        "frequency": 15,
        "score": 0.95
      },
      {
        "text": "user authorization",
        "type": "query",
        "frequency": 8,
        "score": 0.87
      },
      {
        "text": "user authentication requirements",
        "type": "query",
        "frequency": 12,
        "score": 0.82
      },
      {
        "text": "authentication",
        "type": "tag",
        "frequency": 23,
        "score": 0.78
      },
      {
        "text": "User Authentication Guide",
        "type": "title",
        "frequency": 1,
        "score": 0.75
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-16T16:10:00Z",
    "request_id": "req_suggestions_890"
  }
}
```

## Generate Embeddings

Generate vector embeddings for custom text.

### Request

```http
POST /v1/embeddings
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to generate embeddings for |
| `model` | string | No | Embedding model (default: text-embedding-ada-002) |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/v1/embeddings \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "User authentication and security requirements",
    "model": "text-embedding-ada-002"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "text": "User authentication and security requirements",
    "embedding": [0.1234, -0.5678, 0.9012, ...], // 1536-dimensional vector
    "model": "text-embedding-ada-002",
    "token_count": 6,
    "dimensions": 1536
  },
  "meta": {
    "timestamp": "2024-01-16T16:15:00Z",
    "request_id": "req_embeddings_123"
  }
}
```

## Advanced Search Filters

### Metadata Filtering

Filter search results by metadata fields:

```bash
curl -X GET "https://api.lanonasis.com/v1/search?q=project requirements" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata_filter": {
      "department": "engineering",
      "project_id": "proj_123",
      "status": ["active", "pending"]
    }
  }'
```

### Date Range Filtering

```bash
curl -X GET "https://api.lanonasis.com/v1/search?q=meeting notes&created_after=2024-01-01T00:00:00Z&created_before=2024-01-31T23:59:59Z" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Combined Filtering

```bash
curl -X GET "https://api.lanonasis.com/v1/search?q=security requirements&tags=security,compliance&similarity_threshold=0.9&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Search Analytics

Track search performance and user behavior.

### Request

```http
GET /v1/analytics/search
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_date` | string | No | Start date (ISO 8601) |
| `end_date` | string | No | End date (ISO 8601) |
| `granularity` | string | No | `hour`, `day`, `week`, `month` (default: `day`) |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/v1/analytics/search?start_date=2024-01-01&end_date=2024-01-31&granularity=day" \
  -H "Authorization: Bearer YOUR_API_KEY"
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

  const results = await client.search.semantic(query, options);
  searchCache.set(cacheKey, results);

  // Cache for 5 minutes
  setTimeout(() => searchCache.delete(cacheKey), 5 * 60 * 1000);

  return results;
}
```

## SDK Examples

### TypeScript
```typescript
import { LanonasisClient } from '@lanonasis/sdk';

const client = new LanonasisClient({
  apiKey: process.env.LANONASIS_API_KEY
});

// Semantic search
const searchResults = await client.search.semantic('user authentication', {
  limit: 10,
  similarityThreshold: 0.8,
  tags: ['security', 'requirements'],
  includeContent: true
});

// Vector search
const vectorResults = await client.search.vector({
  vector: [0.1, -0.2, 0.3, ...], // Your vector
  limit: 5,
  similarityThreshold: 0.85
});

// Get suggestions
const suggestions = await client.search.suggestions('user auth', {
  limit: 5,
  type: 'query'
});

// Generate embeddings
const embedding = await client.embeddings.generate(
  'Text to generate embeddings for'
);

console.log('Search results:', searchResults.data.results);
console.log('Vector results:', vectorResults.data.results);
console.log('Suggestions:', suggestions.data.suggestions);
console.log('Embedding:', embedding.data.embedding);
```

### Python
```python
from lanonasis import LanOnasisClient

client = LanOnasisClient(api_key=os.environ['LANONASIS_API_KEY'])

# Semantic search
search_results = client.search.semantic(
    query='user authentication',
    limit=10,
    similarity_threshold=0.8,
    tags=['security', 'requirements'],
    include_content=True
)

# Vector search
vector_results = client.search.vector(
    vector=[0.1, -0.2, 0.3, ...],  # Your vector
    limit=5,
    similarity_threshold=0.85
)

# Get suggestions
suggestions = client.search.suggestions(
    query='user auth',
    limit=5,
    type='query'
)

# Generate embeddings
embedding = client.embeddings.generate(
    text='Text to generate embeddings for'
)

print(f'Search results: {search_results.data.results}')
print(f'Vector results: {vector_results.data.results}')
print(f'Suggestions: {suggestions.data.suggestions}')
print(f'Embedding: {embedding.data.embedding}')
```

## Real-time Search

### WebSocket Search
For real-time search updates, connect to our WebSocket endpoint:

```javascript
const ws = new WebSocket('wss://api.lanonasis.com/v1/search/live');

ws.onopen = () => {
  // Subscribe to search updates
  ws.send(JSON.stringify({
    type: 'subscribe',
    query: 'user authentication',
    filters: {
      tags: ['security']
    }
  }));
};

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  if (update.type === 'new_result') {
    console.log('New matching memory:', update.memory);
  }
};
```

### Search with Streaming
```bash
# Stream search results as they become available
curl -X GET "https://api.lanonasis.com/v1/search/stream?q=project requirements" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Accept: text/event-stream"
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