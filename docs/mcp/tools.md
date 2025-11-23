---
title: MCP Tools Reference
sidebar_label: Tools Reference
---

# MCP Tools Reference

Complete reference for all available MCP tools in the LanOnasis MCP server.

## Memory Tools

### create_memory

Create a new memory with automatic vector embedding.

**Tool Name**: `create_memory`

**Parameters:**
```typescript
{
  title: string;              // Required: Memory title
  content: string;           // Required: Memory content
  memory_type?: MemoryType;  // Optional: Type (default: 'context')
  tags?: string[];           // Optional: Tags array
  topic_id?: string;         // Optional: Topic UUID
  project_ref?: string;      // Optional: Project reference
  metadata?: Record<string, unknown>; // Optional: Custom metadata
  summary?: string;          // Optional: Summary text
}
```

**Memory Types:**
- `context` - General contextual information
- `project` - Project-specific knowledge
- `knowledge` - Educational or reference material
- `reference` - Quick reference information
- `personal` - User-specific private memories
- `workflow` - Process and procedure documentation

**Example:**
```typescript
const result = await client.callTool('create_memory', {
  title: 'API Integration Guide',
  content: 'Complete guide for integrating with our API...',
  memory_type: 'knowledge',
  tags: ['api', 'integration', 'documentation'],
  metadata: {
    author: 'John Doe',
    version: '1.0'
  }
});
```

**Response:**
```typescript
{
  id: string;
  title: string;
  content: string;
  memory_type: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  // ... other fields
}
```

### get_memory

Retrieve a specific memory by ID.

**Tool Name**: `get_memory`

**Parameters:**
```typescript
{
  memory_id: string;  // Required: Memory UUID
}
```

**Example:**
```typescript
const result = await client.callTool('get_memory', {
  memory_id: 'mem_1234567890abcdef'
});
```

### update_memory

Update an existing memory.

**Tool Name**: `update_memory`

**Parameters:**
```typescript
{
  memory_id: string;         // Required: Memory UUID
  title?: string;            // Optional: New title
  content?: string;          // Optional: New content
  memory_type?: MemoryType;  // Optional: New type
  tags?: string[];           // Optional: New tags
  topic_id?: string | null;  // Optional: Topic UUID or null
  project_ref?: string | null; // Optional: Project reference or null
  status?: MemoryStatus;     // Optional: Status
  metadata?: Record<string, unknown>; // Optional: Updated metadata
  summary?: string;          // Optional: Summary
}
```

**Example:**
```typescript
const result = await client.callTool('update_memory', {
  memory_id: 'mem_1234567890abcdef',
  title: 'Updated Title',
  tags: ['updated', 'tags']
});
```

### delete_memory

Delete a memory permanently.

**Tool Name**: `delete_memory`

**Parameters:**
```typescript
{
  memory_id: string;  // Required: Memory UUID
}
```

**Example:**
```typescript
const result = await client.callTool('delete_memory', {
  memory_id: 'mem_1234567890abcdef'
});
```

### list_memories

List memories with filtering and pagination.

**Tool Name**: `list_memories`

**Parameters:**
```typescript
{
  page?: number;           // Optional: Page number (default: 1)
  limit?: number;          // Optional: Items per page (default: 20)
  memory_type?: MemoryType; // Optional: Filter by type
  topic_id?: string;       // Optional: Filter by topic
  project_ref?: string;    // Optional: Filter by project
  status?: MemoryStatus;    // Optional: Filter by status
  tags?: string[];         // Optional: Filter by tags
  sort?: string;           // Optional: Sort field (default: 'created_at')
  order?: 'asc' | 'desc'; // Optional: Sort order (default: 'desc')
}
```

**Example:**
```typescript
const result = await client.callTool('list_memories', {
  page: 1,
  limit: 20,
  memory_type: 'knowledge',
  tags: ['api', 'documentation']
});
```

**Response:**
```typescript
{
  data: MemoryEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### search_memories

Semantic search across memories using vector similarity.

**Tool Name**: `search_memories`

**Parameters:**
```typescript
{
  query: string;            // Required: Search query
  memory_types?: MemoryType[]; // Optional: Filter by types
  tags?: string[];         // Optional: Filter by tags
  topic_id?: string;       // Optional: Filter by topic
  project_ref?: string;    // Optional: Filter by project
  status?: MemoryStatus;    // Optional: Filter by status (default: 'active')
  limit?: number;          // Optional: Max results (default: 20, max: 100)
  threshold?: number;      // Optional: Similarity threshold (default: 0.7, range: 0-1)
}
```

**Example:**
```typescript
const result = await client.callTool('search_memories', {
  query: 'API integration best practices',
  memory_types: ['knowledge', 'reference'],
  limit: 10,
  threshold: 0.8
});
```

**Response:**
```typescript
{
  results: Array<{
    ...MemoryEntry,
    similarity_score: number;
  }>;
  total_results: number;
  search_time_ms: number;
}
```

### bulk_delete_memories

Delete multiple memories in a single operation.

**Tool Name**: `bulk_delete_memories`

**Parameters:**
```typescript
{
  memory_ids: string[];  // Required: Array of memory UUIDs
}
```

**Example:**
```typescript
const result = await client.callTool('bulk_delete_memories', {
  memory_ids: ['mem_1', 'mem_2', 'mem_3']
});
```

**Response:**
```typescript
{
  deleted_count: number;
  failed_ids: string[];
}
```

## API Key Tools

### create_api_key

Create a new API key for vendor services.

**Tool Name**: `create_api_key`

**Parameters:**
```typescript
{
  name: string;              // Required: Key name/description
  type: string;              // Required: Key type ('api_key', 'oauth_token', 'certificate', 'ssh_key')
  value: string;             // Required: Key value (will be encrypted)
  environment: string;       // Required: Environment ('development', 'staging', 'production')
  project_id: string;        // Required: Project UUID
  rotation_frequency?: number; // Optional: Days until rotation (default: 90)
  metadata?: Record<string, unknown>; // Optional: Custom metadata
}
```

**Example:**
```typescript
const result = await client.callTool('create_api_key', {
  name: 'OpenAI API Key',
  type: 'api_key',
  value: 'sk-...',
  environment: 'production',
  project_id: 'project-uuid',
  rotation_frequency: 90
});
```

### list_api_keys

List API keys for an organization or project.

**Tool Name**: `list_api_keys`

**Parameters:**
```typescript
{
  project_id?: string;       // Optional: Filter by project
  environment?: string;      // Optional: Filter by environment
  type?: string;             // Optional: Filter by type
}
```

**Example:**
```typescript
const result = await client.callTool('list_api_keys', {
  project_id: 'project-uuid',
  environment: 'production'
});
```

**Response:**
```typescript
{
  keys: Array<{
    id: string;
    name: string;
    type: string;
    environment: string;
    project_id: string;
    created_at: string;
    last_rotated?: string;
    expires_at?: string;
    // Note: value is never returned for security
  }>;
}
```

### get_api_key

Get details about a specific API key (value is never returned).

**Tool Name**: `get_api_key`

**Parameters:**
```typescript
{
  key_id: string;  // Required: API key UUID
}
```

**Example:**
```typescript
const result = await client.callTool('get_api_key', {
  key_id: 'key_1234567890abcdef'
});
```

### rotate_api_key

Rotate an API key (generates new value, keeps same ID).

**Tool Name**: `rotate_api_key`

**Parameters:**
```typescript
{
  key_id: string;  // Required: API key UUID
}
```

**Example:**
```typescript
const result = await client.callTool('rotate_api_key', {
  key_id: 'key_1234567890abcdef'
});
```

**Response:**
```typescript
{
  key_id: string;
  rotated_at: string;
  new_value?: string;  // Only returned once, store securely
}
```

### revoke_api_key

Revoke (deactivate) an API key.

**Tool Name**: `revoke_api_key`

**Parameters:**
```typescript
{
  key_id: string;  // Required: API key UUID
}
```

**Example:**
```typescript
const result = await client.callTool('revoke_api_key', {
  key_id: 'key_1234567890abcdef'
});
```

## System Tools

### health_check

Check MCP server health and status.

**Tool Name**: `health_check`

**Parameters:** None

**Example:**
```typescript
const result = await client.callTool('health_check', {});
```

**Response:**
```typescript
{
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: 'healthy' | 'unhealthy';
    cache: 'healthy' | 'unhealthy';
    embeddings: 'healthy' | 'unhealthy';
  };
}
```

### get_stats

Get memory statistics for a user or organization.

**Tool Name**: `get_stats`

**Parameters:**
```typescript
{
  user_id?: string;  // Optional: User UUID (default: current user)
}
```

**Example:**
```typescript
const result = await client.callTool('get_stats', {});
```

**Response:**
```typescript
{
  total_memories: number;
  memories_by_type: {
    context: number;
    project: number;
    knowledge: number;
    reference: number;
    personal: number;
    workflow: number;
  };
  total_topics: number;
  most_accessed_memory?: string;
  recent_memories: string[];
}
```

### list_topics

List memory topics for a user or organization.

**Tool Name**: `list_topics`

**Parameters:**
```typescript
{
  user_id?: string;  // Optional: User UUID (default: current user)
}
```

**Example:**
```typescript
const result = await client.callTool('list_topics', {});
```

**Response:**
```typescript
{
  topics: Array<{
    id: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    parent_topic_id?: string;
    created_at: string;
    updated_at: string;
  }>;
}
```

## Error Responses

All tools return errors in JSON-RPC 2.0 format:

```typescript
{
  jsonrpc: "2.0",
  id: "request-id",
  error: {
    code: number,
    message: string,
    data?: {
      details: string;
      field?: string;
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| -32600 | Invalid Request |
| -32601 | Method Not Found |
| -32602 | Invalid Params |
| -32603 | Internal Error |
| -32000 | Server Error |
| -32001 | Authentication Required |
| -32002 | Permission Denied |
| -32003 | Rate Limit Exceeded |
| -32004 | Resource Not Found |
| -32005 | Validation Error |

## Best Practices

1. **Always check for errors**: Inspect the response for `error` field
2. **Use appropriate memory types**: Choose the right type for better organization
3. **Add tags**: Tags improve searchability and organization
4. **Set thresholds**: Use appropriate similarity thresholds for search (0.7-0.9 recommended)
5. **Batch operations**: Use bulk operations when possible
6. **Handle pagination**: Use `page` and `limit` for large result sets
7. **Cache tool definitions**: Cache `tools/list` results to reduce API calls

## Related Documentation

- [MCP Overview](./overview.md) - MCP server overview
- [IDE Integration](./ide-integration.md) - Connect IDEs to MCP
- [Production Server](./production-server.md) - Production deployment

