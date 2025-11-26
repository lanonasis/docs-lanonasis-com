---
sidebar_position: 1
---

# TypeScript API Reference

Complete API reference for the LanOnasis TypeScript SDK.

## Installation

```bash
npm install @lanonasis/sdk
# or
yarn add @lanonasis/sdk
# or
pnpm add @lanonasis/sdk
```

## Client Configuration

### LanonasisClient

```typescript
import { LanonasisClient } from '@lanonasis/sdk';

const client = new LanonasisClient({
  apiKey: string;                    // Required: Your API key
  baseUrl?: string;                  // Optional: Custom API base URL
  timeout?: number;                  // Optional: Request timeout in ms (default: 30000)
  retries?: number;                  // Optional: Number of retries (default: 3)
  retryDelay?: number;              // Optional: Delay between retries in ms (default: 1000)
  userAgent?: string;               // Optional: Custom user agent
  headers?: Record<string, string>; // Optional: Additional headers
});
```

### Configuration Examples

```typescript
// Basic configuration
const client = new LanonasisClient({
  apiKey: process.env.LANONASIS_API_KEY!
});

// Advanced configuration
const client = new LanonasisClient({
  apiKey: process.env.LANONASIS_API_KEY!,
  baseUrl: 'https://api.lanonasis.com/v1',
  timeout: 60000,
  retries: 5,
  retryDelay: 2000,
  headers: {
    'X-Client-Version': '1.0.0',
    'X-Environment': 'production'
  }
});
```

## Type Definitions

### Core Types

```typescript
interface Memory {
  id: string;
  title: string;
  content: string;
  tags: string[];
  metadata: Record<string, any>;
  embedding_model: string;
  created_at: string;
  updated_at: string;
  size_bytes: number;
  similarity_threshold?: number;
  access_count?: number;
  last_accessed?: string;
}

interface CreateMemoryData {
  title: string;
  content: string;
  tags?: string[];
  metadata?: Record<string, any>;
  embedding_model?: string;
}

interface UpdateMemoryData {
  title?: string;
  content?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface SearchOptions {
  limit?: number;
  similarityThreshold?: number;
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
  includeContent?: boolean;
  highlight?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  content_preview: string;
  similarity_score: number;
  tags: string[];
  metadata: Record<string, any>;
  highlights: string[];
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
    };
  };
  meta: {
    timestamp: string;
    request_id: string;
  };
}
```

## Memories API

### create()

Create a new memory with content and metadata.

```typescript
client.memories.create(data: CreateMemoryData): Promise<Memory>
```

**Example:**
```typescript
const memory = await client.memories.create({
  title: 'Project Requirements',
  content: 'The new feature should include user authentication...',
  tags: ['project', 'requirements', 'high-priority'],
  metadata: {
    project_id: 'proj_123',
    author: 'john.doe@company.com',
    department: 'engineering'
  }
});

console.log('Created memory:', memory.id);
```

### get()

Retrieve a specific memory by ID.

```typescript
client.memories.get(id: string): Promise<Memory>
```

**Example:**
```typescript
const memory = await client.memories.get('mem_456789');
console.log('Memory title:', memory.title);
console.log('Memory content:', memory.content);
```

### update()

Update an existing memory's content, tags, or metadata.

```typescript
client.memories.update(id: string, data: UpdateMemoryData): Promise<Memory>
```

**Example:**
```typescript
const updatedMemory = await client.memories.update('mem_456789', {
  tags: ['project', 'requirements', 'high-priority', 'reviewed'],
  metadata: {
    ...existingMetadata,
    status: 'approved',
    reviewed_by: 'jane.smith@company.com'
  }
});
```

### delete()

Permanently delete a memory.

```typescript
client.memories.delete(id: string): Promise<void>
```

**Example:**
```typescript
await client.memories.delete('mem_456789');
console.log('Memory deleted successfully');
```

### list()

List memories with pagination and filtering.

```typescript
client.memories.list(options?: ListOptions): Promise<PaginatedResponse<Memory>>
```

**Example:**
```typescript
const response = await client.memories.list({
  limit: 20,
  tags: ['project', 'requirements'],
  createdAfter: '2024-01-01T00:00:00Z',
  sort: 'updated_desc'
});

console.log('Total memories:', response.data.pagination.total);
response.data.memories.forEach(memory => {
  console.log(`${memory.title} - ${memory.created_at}`);
});
```

## Search API

### semantic()

Perform semantic search across memories.

```typescript
client.search.semantic(query: string, options?: SearchOptions): Promise<SearchResult[]>
```

**Example:**
```typescript
const results = await client.search.semantic('user authentication requirements', {
  limit: 10,
  similarityThreshold: 0.8,
  tags: ['security', 'requirements'],
  includeContent: true,
  highlight: true
});

results.forEach(result => {
  console.log(`${result.title} (Score: ${result.similarity_score})`);
  console.log('Highlights:', result.highlights);
});
```

### vector()

Perform vector similarity search.

```typescript
client.search.vector(options: VectorSearchOptions): Promise<SearchResult[]>
```

**Example:**
```typescript
const vectorResults = await client.search.vector({
  vector: [0.1, -0.2, 0.3, ...], // 1536-dimensional vector
  limit: 5,
  similarityThreshold: 0.85,
  tags: ['project'],
  metadataFilter: {
    department: 'engineering'
  }
});
```

### suggestions()

Get autocomplete suggestions for search queries.

```typescript
client.search.suggestions(query: string, options?: SuggestionOptions): Promise<Suggestion[]>
```

**Example:**
```typescript
const suggestions = await client.search.suggestions('user auth', {
  limit: 5,
  type: 'query'
});

suggestions.forEach(suggestion => {
  console.log(`${suggestion.text} (Score: ${suggestion.score})`);
});
```

## Authentication API

### createKey()

Create a new API key.

```typescript
client.auth.createKey(data: CreateKeyData): Promise<ApiKey>
```

**Example:**
```typescript
const newKey = await client.auth.createKey({
  name: 'Mobile App Key',
  permissions: ['memories:read', 'search:read'],
  expiresAt: '2024-12-31T23:59:59Z'
});

console.log('New API key:', newKey.key);
// Remember to store this securely - it won't be shown again
```

### listKeys()

List all API keys for your account.

```typescript
client.auth.listKeys(options?: ListOptions): Promise<PaginatedResponse<ApiKey>>
```

**Example:**
```typescript
const keys = await client.auth.listKeys();
keys.data.keys.forEach(key => {
  console.log(`${key.name} - Last used: ${key.last_used}`);
});
```

### revokeKey()

Revoke an API key.

```typescript
client.auth.revokeKey(id: string): Promise<void>
```

**Example:**
```typescript
await client.auth.revokeKey('key_789abc');
console.log('API key revoked successfully');
```

## Embeddings API

### generate()

Generate vector embeddings for text.

```typescript
client.embeddings.generate(text: string, options?: EmbeddingOptions): Promise<Embedding>
```

**Example:**
```typescript
const embedding = await client.embeddings.generate(
  'User authentication and security requirements',
  { model: 'text-embedding-ada-002' }
);

console.log('Embedding dimensions:', embedding.dimensions);
console.log('Token count:', embedding.token_count);
```

## Error Handling

### Error Types

```typescript
import { LanOnasisError, ValidationError, AuthenticationError, RateLimitError } from '@lanonasis/sdk';

try {
  const memory = await client.memories.create({
    title: '',  // Invalid: title cannot be empty
    content: 'Some content'
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation error:', error.details);
  } else if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter);
  } else if (error instanceof LanOnasisError) {
    console.error('LanOnasis API error:', error.code, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Retry Logic

```typescript
import { LanonasisClient, RateLimitError } from '@lanonasis/sdk';

async function createMemoryWithRetry(data: CreateMemoryData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.memories.create(data);
    } catch (error) {
      if (error instanceof RateLimitError && attempt < maxRetries) {
        const delay = error.retryAfter * 1000 || 1000 * attempt;
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

## Advanced Usage

### Batch Operations

```typescript
// Batch create memories
async function batchCreateMemories(memoriesData: CreateMemoryData[]) {
  const results = await Promise.allSettled(
    memoriesData.map(data => client.memories.create(data))
  );

  const succeeded = results
    .filter(result => result.status === 'fulfilled')
    .map(result => (result as PromiseFulfilledResult<Memory>).value);

  const failed = results
    .filter(result => result.status === 'rejected')
    .map(result => (result as PromiseRejectedResult).reason);

  console.log(`Created ${succeeded.length} memories, ${failed.length} failed`);
  return { succeeded, failed };
}
```

### Search with Pagination

```typescript
async function searchAllResults(query: string): Promise<SearchResult[]> {
  const allResults: SearchResult[] = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const results = await client.search.semantic(query, {
      limit,
      offset,
      includeContent: false
    });

    allResults.push(...results);

    if (results.length < limit) {
      break; // No more results
    }

    offset += limit;
  }

  return allResults;
}
```

### Real-time Updates with WebSockets

```typescript
import { LanOnasisWebSocket } from '@lanonasis/sdk';

const ws = new LanOnasisWebSocket({
  apiKey: process.env.LANONASIS_API_KEY!
});

// Subscribe to new memories
ws.subscribe('memories:created', (memory: Memory) => {
  console.log('New memory created:', memory.title);
});

// Subscribe to search updates
ws.subscribe('search:update', (update: SearchUpdate) => {
  console.log('Search index updated for memory:', update.memory_id);
});

// Connect
await ws.connect();
```

## Middleware and Plugins

### Request Middleware

```typescript
import { LanonasisClient, RequestMiddleware } from '@lanonasis/sdk';

const loggingMiddleware: RequestMiddleware = (request, next) => {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  const start = Date.now();

  return next(request).then(response => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] Response: ${response.status} (${duration}ms)`);
    return response;
  });
};

const client = new LanonasisClient({
  apiKey: process.env.LANONASIS_API_KEY!,
  middleware: [loggingMiddleware]
});
```

### Caching Plugin

```typescript
import { CachePlugin } from '@lanonasis/sdk/plugins';

const client = new LanonasisClient({
  apiKey: process.env.LANONASIS_API_KEY!,
  plugins: [
    new CachePlugin({
      ttl: 5 * 60 * 1000, // 5 minutes
      maxSize: 1000
    })
  ]
});
```
