---
title: Search API
sidebar_label: Vector Search
---

# Vector Search API

## POST /api/v1/memory/search

Perform semantic search across your memories using vector similarity.

### Authentication

```http
X-API-Key: YOUR_API_KEY
```

### Request Body

```json
{
  "query": "string (required)",
  "limit": 10,
  "threshold": 0.7,
  "memory_type": "project",
  "tags": ["security", "requirements"]
}
```

### Response

```json
{
  "data": [
    {
      "id": "mem_abc123",
      "title": "Meeting Notes",
      "content": "Meeting notes from Q4 planning...",
      "similarity_score": 0.95,
      "tags": ["planning", "q4"],
      "metadata": {
        "type": "meeting",
        "date": "2024-01-15"
      }
    }
  ],
  "query": "Q4 planning decisions",
  "results_count": 1
}
```

### Examples

#### Semantic Search

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

#### Filtered Search

```typescript
const results = await client.searchMemories({
  query: "budget discussions",
  tags: ["meeting"],
  limit: 5,
  threshold: 0.75
});
```
