---
title: Memory SDK
sidebar_label: Memory SDK
description: Official TypeScript SDK for Lanonasis Memory as a Service (MaaS)
tags:
  - sdk
  - memory
  - maas
  - typescript
---

# @lanonasis/memory-sdk

Official TypeScript SDK for Lanonasis Memory as a Service (MaaS). Provides typed access to memory CRUD, search, topics, and multi-modal content processing.

## Installation

```bash
bun add @lanonasis/memory-sdk
# or
npm install @lanonasis/memory-sdk
# or
yarn add @lanonasis/memory-sdk
```

**Package**: `@lanonasis/memory-sdk`
**Version**: 1.0.0

## Quick Start

```typescript
import { MemoryClient, createMaaSClient } from "@lanonasis/memory-sdk";

// Initialize the client
const memory = new MemoryClient({
  apiUrl: "https://api.lanonasis.com",
  apiKey: process.env.LANONASIS_API_KEY,
  timeout: 30000
});

// Or use the factory function
const memory = createMaaSClient({
  apiUrl: "https://api.lanonasis.com",
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const result = await memory.createMemory({
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
const searchResult = await memory.searchMemories({
  query: "search query",
  limit: 10,
  threshold: 0.7
});

// List memories
const listResult = await memory.listMemories({
  page: 1,
  limit: 20,
  memory_type: "knowledge"
});
```

## Environment Variables

```bash
LANONASIS_API_URL=https://api.lanonasis.com
LANONASIS_API_KEY=your-api-key
```

## Core Concepts

### Memory Types

```typescript
type MemoryType = 'context' | 'project' | 'knowledge' | 'reference' | 'personal' | 'workflow';
```

### Memory Status

```typescript
type MemoryStatus = 'active' | 'archived' | 'draft' | 'deleted';
```

### Response Format

All methods return `Promise<ApiResponse<T>>` where `ApiResponse` has:

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
```

## API Methods

### Memory Operations

#### `createMemory(memory: CreateMemoryRequest)`

Create a new memory.

```typescript
const result = await memory.createMemory({
  title: "Memory Title",
  content: "Memory content",
  memory_type: "knowledge", // context | project | knowledge | reference | personal | workflow
  tags: ["tag1", "tag2"],
  topic_id: "optional-topic-id",
  project_ref: "optional-project-ref",
  metadata: { custom: "data" }
});
```

#### `createMemoryWithPreprocessing(memory: CreateMemoryRequest & options)`

Create memory with intelligent preprocessing (chunking, content cleaning).

```typescript
const result = await memory.createMemoryWithPreprocessing({
  title: "Long Document",
  content: largeContent,
  memory_type: "knowledge",
  chunkingStrategy: "semantic", // fixed-size | semantic | paragraph | sentence | code-block
  maxChunkSize: 1000,
  chunkOverlap: 200
});
```

#### `getMemory(id: string)`

Get a memory by ID.

```typescript
const result = await memory.getMemory("memory-id");
if (result.data) {
  console.log(result.data.title, result.data.content);
}
```

#### `updateMemory(id: string, updates: UpdateMemoryRequest)`

Update an existing memory.

```typescript
const result = await memory.updateMemory("memory-id", {
  title: "Updated Title",
  content: "Updated content",
  tags: ["updated", "tags"]
});
```

#### `deleteMemory(id: string)`

Delete a memory.

```typescript
const result = await memory.deleteMemory("memory-id");
```

#### `listMemories(options?)`

List memories with pagination and filtering.

```typescript
const result = await memory.listMemories({
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
const result = await memory.searchMemories({
  query: "search query",
  memory_types: ["knowledge", "project"],
  tags: ["tag1"],
  topic_id: "topic-id",
  project_ref: "project-ref",
  status: "active",
  limit: 10,
  threshold: 0.7
});

if (result.data) {
  console.log(`Found ${result.data.total_results} results in ${result.data.search_time_ms}ms`);
  result.data.results.forEach(r => {
    console.log(r.memory_id, r.title, r.relevance_score);
  });
}
```

#### `buildContext(options)`

Build intelligent context from memories for AI interactions.

```typescript
const result = await memory.buildContext({
  query: "What is the project status?",
  memoryIds: ["id1", "id2"],
  strategy: "relevance", // relevance | temporal | conversational | diverse | hierarchical | hybrid
  maxTokens: 4000,
  minRelevanceScore: 0.7
});

if (result.data) {
  console.log(result.data.context); // Assembled context string
  console.log("Quality scores:", result.data.quality);
}
```

#### `searchWithContext(query, options?)`

Convenience method combining search and context building.

```typescript
const result = await memory.searchWithContext(
  "What decisions were made about the architecture?",
  { limit: 10, strategy: "hybrid" }
);

if (result.data) {
  console.log(result.data.context);
  console.log("Search results:", result.data.searchResults);
}
```

#### `bulkDeleteMemories(memoryIds: string[])`

Delete multiple memories.

```typescript
const result = await memory.bulkDeleteMemories(["id1", "id2", "id3"]);
if (result.data) {
  console.log(`Deleted ${result.data.deleted_count} memories`);
  console.log("Failed:", result.data.failed_ids);
}
```

### Topic Operations

#### `createTopic(topic: CreateTopicRequest)`

Create a new topic.

```typescript
const result = await memory.createTopic({
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
const result = await memory.getTopics();
```

#### `getTopic(id: string)`

Get a topic by ID.

```typescript
const result = await memory.getTopic("topic-id");
```

#### `updateTopic(id: string, updates)`

Update a topic.

```typescript
const result = await memory.updateTopic("topic-id", {
  name: "Updated Name",
  description: "Updated description"
});
```

#### `deleteTopic(id: string)`

Delete a topic.

```typescript
const result = await memory.deleteTopic("topic-id");
```

### Statistics

#### `getMemoryStats()`

Get user memory statistics.

```typescript
const result = await memory.getMemoryStats();
if (result.data) {
  console.log("Total memories:", result.data.total_memories);
  console.log("By type:", result.data.memories_by_type);
}
```

### Authentication Methods

#### `setAuthToken(token: string)`

Update authentication token (Bearer).

```typescript
memory.setAuthToken("new-bearer-token");
```

#### `setApiKey(apiKey: string)`

Update API key.

```typescript
memory.setApiKey("new-api-key");
```

#### `clearAuth()`

Clear authentication.

```typescript
memory.clearAuth();
```

### API Key Management

The SDK also provides API key management methods:

```typescript
// Create project
const project = await memory.createProject({
  name: "My Project",
  organizationId: "org-123"
});

// Create API key
const apiKey = await memory.createApiKey({
  name: "Production Key",
  keyType: "standard",
  environment: "production",
  accessLevel: "authenticated",
  projectId: project.data.id
});

// List API keys
const keys = await memory.listApiKeys({ projectId: project.data.id });

// Rotate API key
const rotated = await memory.rotateApiKey(keyId);

// Delete API key
await memory.deleteApiKey(keyId);
```

### MCP Integration

```typescript
// Register MCP tool
await memory.registerMCPTool({
  toolId: "my-tool",
  toolName: "My Tool",
  organizationId: "org-123",
  permissions: {
    keys: ["read"],
    environments: ["development", "production"]
  }
});

// Create MCP access request
const request = await memory.createMCPAccessRequest({
  toolId: "my-tool",
  organizationId: "org-123",
  keyNames: ["read"],
  environment: "development",
  justification: "Need access for testing",
  estimatedDuration: 3600
});

// Create MCP session
const session = await memory.createMCPSession(request.data.requestId);
```

## Configuration

### MaaSClientConfig

```typescript
interface MaaSClientConfig {
  apiUrl: string;              // Required: API base URL
  apiKey?: string;             // Optional: API key (X-API-Key header)
  authToken?: string;          // Optional: Bearer token (alternative to apiKey)
  timeout?: number;            // Optional: Request timeout in ms (default: 30000)
}
```

### Default Configurations

```typescript
import { defaultConfigs } from "@lanonasis/memory-sdk";

// Development
const devClient = new MemoryClient({
  ...defaultConfigs.development,
  apiKey: process.env.LANONASIS_API_KEY
});

// Production
const prodClient = new MemoryClient({
  ...defaultConfigs.production,
  apiKey: process.env.LANONASIS_API_KEY
});
```

## MultiModal Memory Client

For processing images, audio, video, documents, and code:

```typescript
import { MultiModalMemoryClient } from "@lanonasis/memory-sdk";

const multimodal = new MultiModalMemoryClient({
  apiUrl: "https://api.lanonasis.com",
  apiKey: process.env.LANONASIS_API_KEY
});

// Process an image with OCR
const imageMemory = await multimodal.createImageMemory(
  "Document Screenshot",
  imageBuffer,
  { extractText: true, generateDescription: true }
);

// Process audio with transcription
const audioMemory = await multimodal.createAudioMemory(
  "Meeting Recording",
  audioBuffer
);

// Process code with semantic analysis
const codeMemory = await multimodal.createCodeMemory(
  "Algorithm Implementation",
  codeContent,
  "typescript",
  { extractFunctions: true, generateDocs: true }
);

// Process a PDF document
const docMemory = await multimodal.createDocumentMemory(
  "Research Paper",
  documentBuffer,
  "pdf"
);
```

## Error Handling

```typescript
const result = await memory.createMemory({...});

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
  memory_type: MemoryType;
  status: MemoryStatus;
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

### CreateMemoryRequest

```typescript
interface CreateMemoryRequest {
  title: string;
  content: string;
  memory_type: MemoryType;
  tags?: string[];
  topic_id?: string;
  project_ref?: string;
  metadata?: Record<string, unknown>;
}
```

> Always retrieve short‑lived tokens via the [Central Auth Gateway](../auth/central-auth-gateway.md). Do not embed long‑lived secrets.

## Related docs

- Overview: [Memory Overview](../memory/overview.md)
- REST API: [Memory REST API](../memory/rest-api.md)
- CLI: [Memory CLI](../memory/cli.md)
- Security SDK: [Security SDK](./security-sdk.md)
