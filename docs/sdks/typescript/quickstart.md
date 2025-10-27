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
LANONASIS_WORKSPACE_ID=workspace_123
LANONASIS_API_URL=http://api.LanOnasis.local # Optional
```

### Client Initialization

```typescript
import { MemoryClient } from '@lanonasis/memory-client'

// Option 1: Auto-config from environment
const client = new MemoryClient()

// Option 2: Manual configuration
const client = new MemoryClient({
  apiKey: 'your_api_key',
  workspaceId: 'workspace_123',
  baseUrl: 'http://api.LanOnasis.local', // Optional
  timeout: 30000, // Optional: 30 seconds
  maxRetries: 3 // Optional
})
```

## Core Operations

### Storing Memories

```typescript
// Simple text storage
const memory = await client.upsert({
  text: "Important information to remember"
})

// With metadata
const memory = await client.upsert({
  text: "Meeting with John about Q4 planning",
  metadata: {
    type: "meeting",
    participants: ["John", "Sarah"],
    date: "2024-01-15",
    importance: "high"
  }
})

// With custom ID
const memory = await client.upsert({
  id: "meeting-2024-01-15",
  text: "Q4 planning decisions...",
  metadata: { type: "meeting" }
})
```

### Searching Memories

```typescript
// Semantic search
const results = await client.search({
  query: "Q4 planning decisions",
  topK: 10,
  includeMetadata: true
})

// Filtered search
const results = await client.search({
  query: "budget discussions",
  filters: {
    type: "meeting",
    date: { $gte: "2024-01-01" },
    importance: "high"
  },
  topK: 5
})

// Hybrid search (semantic + keyword)
const results = await client.hybridSearch({
  query: "Q4 budget",
  semanticWeight: 0.7,
  keywordWeight: 0.3
})
```

### Streaming Responses

```typescript
const stream = await client.stream({
  query: "Summarize our Q4 planning decisions",
  enableRAG: true,
  temperature: 0.7
})

for await (const chunk of stream) {
  process.stdout.write(chunk.text)
}
```

### Batch Operations

```typescript
// Batch upsert
const memories = await client.batchUpsert([
  { text: "Memory 1", metadata: { type: "note" } },
  { text: "Memory 2", metadata: { type: "task" } },
  { text: "Memory 3", metadata: { type: "idea" } }
])

// Batch delete
await client.batchDelete([
  "memory-id-1",
  "memory-id-2",
  "memory-id-3"
])
```

## Advanced Features

### Vector Operations

```typescript
// Get embeddings
const embedding = await client.getEmbedding("Text to embed")

// Search by vector
const results = await client.searchByVector({
  vector: embedding,
  topK: 10,
  threshold: 0.8
})
```

### Analytics

```typescript
// Get usage statistics
const stats = await client.getStats({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  groupBy: "day"
})

// Query patterns
const patterns = await client.getQueryPatterns({
  limit: 100,
  minFrequency: 5
})
```

## Error Handling

```typescript
import { 
  MemoryClient, 
  APIError, 
  RateLimitError, 
  ValidationError 
} from '@lanonasis/memory-client'

try {
  const result = await client.upsert({ text: "..." })
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`)
  } else if (error instanceof ValidationError) {
    console.log(`Invalid request: ${error.message}`)
  } else if (error instanceof APIError) {
    console.log(`API error: ${error.statusCode} - ${error.message}`)
  }
}
```

## TypeScript Types

```typescript
interface Memory {
  id: string
  text: string
  metadata?: Record<string, any>
  embedding?: number[]
  createdAt: Date
  updatedAt: Date
}

interface SearchResult {
  memory: Memory
  score: number
  highlights?: string[]
}

interface SearchOptions {
  query: string
  topK?: number
  filters?: Record<string, any>
  includeMetadata?: boolean
  includeEmbedding?: boolean
}
```

## Next Steps

- [API Reference →](/sdks/typescript/api-reference)
- [Advanced Examples →](/sdks/typescript/examples)
- [Migration Guide →](/guides/migration)
