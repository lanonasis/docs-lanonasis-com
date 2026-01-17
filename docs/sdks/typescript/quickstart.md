---
title: TypeScript SDK Quick Start
sidebar_position: 2
---

# TypeScript SDK Quick Start

## Installation

```bash
npm install @lanonasis/memory-client
# or
yarn add @lanonasis/memory-client
# or
bun add @lanonasis/memory-client
```

## Configuration

### Environment Variables

```env
LANONASIS_API_KEY=your_api_key_here
LANONASIS_API_URL=https://api.lanonasis.com
LANONASIS_ORGANIZATION_ID=org_123 # Optional
```

### Client Initialization

```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core'

const client = createMemoryClient({
  apiUrl: process.env.LANONASIS_API_URL || 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY,
  organizationId: process.env.LANONASIS_ORGANIZATION_ID,
  timeout: 30000,
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    backoff: 'exponential'
  }
})
```

## Core Operations

### Storing Memories

```typescript
// Simple text storage
const created = await client.createMemory({
  title: "Quick Note",
  content: "Important information to remember",
  memory_type: "context"
})

// With metadata
const meeting = await client.createMemory({
  title: "Q4 Planning",
  content: "Meeting with John about Q4 planning",
  memory_type: "project",
  tags: ["meeting", "planning"],
  metadata: {
    participants: ["John", "Sarah"],
    date: "2024-01-15",
    importance: "high"
  }
})
```

### Searching Memories

```typescript
// Semantic search
const results = await client.searchMemories({
  query: "Q4 planning decisions",
  limit: 10,
  memory_types: ["project"],
  tags: ["planning"],
  threshold: 0.7
})

// Filtered search
const filtered = await client.searchMemories({
  query: "budget discussions",
  limit: 5,
  memory_types: ["project"],
  tags: ["budget"]
})

// Hybrid search (semantic + keyword)
const hybrid = await client.enhancedSearch({
  query: "Q4 budget",
  search_mode: "hybrid",
  threshold: 0.7,
  limit: 10,
  filters: { tags: ["budget"] }
})
```

### Content Preprocessing

```typescript
const processed = await client.createMemoryWithPreprocessing({
  title: "Architecture Notes",
  content: "Long-form technical notes...",
  memory_type: "knowledge",
  preprocessing: {
    chunking: { strategy: "semantic", maxChunkSize: 1000 },
    extractMetadata: true
  }
})
```

### Batch Operations

```typescript
// Bulk delete
const deleted = await client.bulkDeleteMemories([
  "memory-id-1",
  "memory-id-2",
  "memory-id-3"
])

if (deleted.data) {
  console.log(`Deleted ${deleted.data.deleted_count} memories`)
}
```

## Advanced Features

### Analytics

```typescript
const stats = await client.getMemoryStats()
const analytics = await client.getSearchAnalytics({
  from: "2024-01-01",
  to: "2024-01-31",
  group_by: "day"
})
const access = await client.getAccessPatterns({
  from: "2024-01-01",
  to: "2024-01-31"
})
const extended = await client.getExtendedStats()
```

## Error Handling

```typescript
import { ApiError, RateLimitError, ValidationError } from '@lanonasis/memory-client'
import { createMemoryClient } from '@lanonasis/memory-client/core'

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
})

try {
  const result = await client.createMemory({
    title: 'Example',
    content: '...',
    memory_type: 'context'
  })
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`)
  } else if (error instanceof ValidationError) {
    console.log(`Invalid request: ${error.message}`)
  } else if (error instanceof ApiError) {
    console.log(`API error: ${error.statusCode} - ${error.message}`)
  }
}
```

## TypeScript Types

```typescript
import type { MemoryEntry, MemorySearchResult, PaginatedResponse } from '@lanonasis/memory-client/core'

type Memory = MemoryEntry

interface SearchResponse {
  results: MemorySearchResult[]
  total_results: number
  search_time_ms: number
}

type MemoryListResponse = PaginatedResponse<MemoryEntry>
```

## Next Steps

- [API Reference →](/sdks/typescript/api-reference)
- [Advanced Examples →](/sdks/typescript/examples)
- [Migration Guide →](/guides/migration)
