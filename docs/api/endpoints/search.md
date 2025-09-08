---
title: Search API
sidebar_label: Vector Search
---

# Vector Search API

## POST /api/v1/search

Perform semantic search across your memories using vector similarity.

### Authentication

```http
Authorization: Bearer YOUR_API_KEY
X-Workspace-ID: workspace_123 (optional)
```

### Request Body

```json
{
  "query": "string (required)",
  "topK": 10,
  "filters": {
    "type": "string",
    "tags": ["string"],
    "date": {
      "$gte": "2024-01-01",
      "$lte": "2024-12-31"
    }
  },
  "includeMetadata": true,
  "includeEmbedding": false,
  "threshold": 0.7,
  "namespace": "default"
}
```

### Response

```json
{
  "matches": [
    {
      "id": "mem_abc123",
      "score": 0.95,
      "text": "Meeting notes from Q4 planning...",
      "metadata": {
        "type": "meeting",
        "tags": ["planning", "q4"],
        "date": "2024-01-15"
      },
      "highlights": [
        "Q4 planning decisions",
        "budget allocation"
      ]
    }
  ],
  "total": 10,
  "query_embedding_time": 45,
  "search_time": 120
}
```

### Examples

#### Semantic Search

```typescript
const results = await client.search({
  query: "Q4 planning decisions",
  topK: 10,
  includeMetadata: true
})
```

#### Filtered Search

```typescript
const results = await client.search({
  query: "budget discussions",
  filters: {
    type: "meeting",
    date: { $gte: "2024-01-01" },
    importance: "high"
  },
  topK: 5
})
```

#### Hybrid Search

```typescript
const results = await client.hybridSearch({
  query: "Q4 budget",
  semanticWeight: 0.7,
  keywordWeight: 0.3
})
```

---

## POST /api/v1/search/hybrid

Combine semantic and keyword search for improved results.

### Request Body

```json
{
  "query": "string",
  "semanticWeight": 0.7,
  "keywordWeight": 0.3,
  "topK": 10,
  "rerank": true
}
```

### Response

```json
{
  "matches": [...],
  "semantic_results": 5,
  "keyword_results": 5,
  "combined_score_method": "weighted_average"
}
```

---

## POST /api/v1/search/batch

Perform multiple searches in a single request.

### Request Body

```json
{
  "searches": [
    {
      "query": "Q4 planning",
      "topK": 5
    },
    {
      "query": "budget decisions",
      "topK": 5,
      "filters": { "type": "financial" }
    }
  ]
}
```

### Response

```json
{
  "results": [
    {
      "query": "Q4 planning",
      "matches": [...]
    },
    {
      "query": "budget decisions",
      "matches": [...]
    }
  ],
  "total_time": 250
}
```
