---
title: Memory SDK
sidebar_label: SDK
---

The official TypeScript SDK `@lanonasis/memory-client` offers a typed interface to the Memory Suite.

## Install

Use your workspace's package manager (Bun recommended).

```bash
bun add @lanonasis/memory-client
# or
npm install @lanonasis/memory-client
# or
yarn add @lanonasis/memory-client
```

**Package**: `@lanonasis/memory-client`  
**Version**: <!-- AUTO:MEMORY_CLIENT_VERSION -->2.2.0<!-- /AUTO -->

## Basic usage

```typescript
import { MemoryClient, createMemoryClient } from "@lanonasis/memory-client";

// Create client with required apiUrl
const client = new MemoryClient({
  apiUrl: "https://api.lanonasis.com",
  apiKey: process.env.LANONASIS_API_KEY,
  // Optional: use bearer token instead
  // authToken: process.env.LANONASIS_TOKEN,
  timeout: 30000
});

// Or use factory function
const client = createMemoryClient({
  apiUrl: "https://api.lanonasis.com",
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const result = await client.createMemory({
  title: "My Memory",
  content: "Memory content here",
  memory_type: "knowledge",
  tags: ["example"]
});

if (result.data) {
  console.log("Memory created:", result.data.id);
} else {
  console.error("Error:", result.error);
}

// Search memories
const searchResult = await client.searchMemories({
  query: "search query",
  limit: 10,
  threshold: 0.7
});

// List memories
const listResult = await client.listMemories({
  page: 1,
  limit: 20,
  memory_type: "knowledge"
});
```

## API Methods

### Memory Operations

All methods return `Promise<ApiResponse<T>>` where `ApiResponse` has:
- `data?: T` - Success data
- `error?: string` - Error message
- `message?: string` - Optional message

#### `createMemory(memory: CreateMemoryRequest)`

Create a new memory.

```typescript
const result = await client.createMemory({
  title: "Memory Title",
  content: "Memory content",
  memory_type: "knowledge", // context | project | knowledge | reference | personal | workflow
  tags: ["tag1", "tag2"],
  topic_id: "optional-topic-id",
  project_ref: "optional-project-ref",
  metadata: { custom: "data" }
});
```

#### `getMemory(id: string)`

Get a memory by ID.

```typescript
const result = await client.getMemory("memory-id");
```

#### `updateMemory(id: string, updates: UpdateMemoryRequest)`

Update an existing memory.

```typescript
const result = await client.updateMemory("memory-id", {
  title: "Updated Title",
  content: "Updated content",
  tags: ["updated", "tags"]
});
```

#### `deleteMemory(id: string)`

Delete a memory.

```typescript
const result = await client.deleteMemory("memory-id");
```

#### `listMemories(options?)`

List memories with pagination and filtering.

```typescript
const result = await client.listMemories({
  page: 1,
  limit: 20,
  memory_type: "knowledge",
  topic_id: "topic-id",
  project_ref: "project-ref",
  status: "active",
  tags: ["tag1"],
  sort: "created_at",
  order: "desc"
});
```

#### `searchMemories(request: SearchMemoryRequest)`

Semantic search across memories.

```typescript
const result = await client.searchMemories({
  query: "search query",
  memory_types: ["knowledge", "project"],
  tags: ["tag1"],
  topic_id: "topic-id",
  project_ref: "project-ref",
  status: "active",
  limit: 10,
  threshold: 0.7
});
```

#### `bulkDeleteMemories(memoryIds: string[])`

Delete multiple memories.

```typescript
const result = await client.bulkDeleteMemories(["id1", "id2", "id3"]);
```

### Topic Operations

#### `createTopic(topic: CreateTopicRequest)`

Create a new topic.

```typescript
const result = await client.createTopic({
  name: "Topic Name",
  description: "Topic description",
  color: "#FF5733",
  icon: "folder",
  parent_topic_id: "optional-parent-id"
});
```

#### `getTopics()`

Get all topics.

```typescript
const result = await client.getTopics();
```

#### `getTopic(id: string)`

Get a topic by ID.

```typescript
const result = await client.getTopic("topic-id");
```

#### `updateTopic(id: string, updates: Partial<CreateTopicRequest>)`

Update a topic.

```typescript
const result = await client.updateTopic("topic-id", {
  name: "Updated Name",
  description: "Updated description"
});
```

#### `deleteTopic(id: string)`

Delete a topic.

```typescript
const result = await client.deleteTopic("topic-id");
```

### Statistics

#### `getMemoryStats()`

Get user memory statistics.

```typescript
const result = await client.getMemoryStats();
// Returns: { total_memories, memories_by_type, total_topics, ... }
```

### Authentication

#### `setAuthToken(token: string)`

Update authentication token.

```typescript
client.setAuthToken("new-token");
```

#### `setApiKey(apiKey: string)`

Update API key.

```typescript
client.setApiKey("new-api-key");
```

#### `clearAuth()`

Clear authentication.

```typescript
client.clearAuth();
```

## Configuration

### MemoryClientConfig

```typescript
interface MemoryClientConfig {
  apiUrl: string;              // Required: API base URL
  apiKey?: string;             // Optional: API key
  authToken?: string;          // Optional: Bearer token (alternative to apiKey)
  timeout?: number;            // Optional: Request timeout in ms (default: 30000)
  useGateway?: boolean;        // Optional: Enable gateway mode (default: true)
  headers?: Record<string, string>; // Optional: Custom headers
}
```

### Default Configurations

```typescript
import { defaultConfigs } from "@lanonasis/memory-client";

// Development
const devClient = new MemoryClient({
  ...defaultConfigs.development,
  apiKey: process.env.API_KEY
});

// Production
const prodClient = new MemoryClient({
  ...defaultConfigs.production,
  apiKey: process.env.API_KEY
});
```

## Enhanced Client

For advanced features including CLI integration:

```typescript
import { EnhancedMemoryClient } from "@lanonasis/memory-client";

const enhancedClient = new EnhancedMemoryClient({
  apiUrl: "https://api.lanonasis.com",
  apiKey: process.env.API_KEY,
  enableCLI: true,
  enableMCP: true
});
```

## Error Handling

```typescript
const result = await client.createMemory({...});

if (result.error) {
  console.error("Error:", result.error);
  // Handle error
} else if (result.data) {
  console.log("Success:", result.data);
  // Use data
}
```

## Type Definitions

### MemoryEntry

```typescript
interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  summary?: string;
  memory_type: MemoryType; // 'context' | 'project' | 'knowledge' | 'reference' | 'personal' | 'workflow'
  status: MemoryStatus;    // 'active' | 'archived' | 'draft' | 'deleted'
  relevance_score?: number;
  access_count: number;
  last_accessed?: string;
  user_id: string;
  topic_id?: string;
  project_ref?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
```

> Always retrieve short‑lived tokens via the [Central Auth Gateway](../auth/central-auth-gateway.md). Do not embed long‑lived secrets.

## Related docs

- Overview: [MaaS Overview](./overview.md)
- REST API: [Memory REST API](./rest-api.md)
- CLI: [Memory CLI](./cli.md)
- TypeScript SDK: [TypeScript SDK Reference](../sdks/typescript/api-reference.md)

