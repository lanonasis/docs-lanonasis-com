---
title: End-to-End Memory Walkthrough
sidebar_label: Memory Walkthrough
---

# End-to-End Memory Walkthrough

This walkthrough covers the full memory lifecycle — **create, search, update, and delete** — using the four LanOnasis surfaces that genuinely exist today:

1. **TypeScript SDK** — [`@lanonasis/memory-client`](../sdks/typescript.md)
2. **curl / REST API** — the platform HTTP endpoints
3. **MCP** — Model Context Protocol tools
4. **CLI** — [`@lanonasis/cli`](../sdks/cli.md)

All examples were run against a local mock API server so they are safe to copy and adapt. No real API keys, secrets, or production data are shown.

## Prerequisites

| Surface | Install / Setup |
|---------|-----------------|
| TypeScript | `npm install @lanonasis/memory-client` |
| curl | Any HTTP client; `curl` is used here. |
| MCP | An MCP client (Claude Desktop, Cursor, or the LanOnasis CLI `mcp` command). |
| CLI | `npm install -g @lanonasis/cli` |

Use the same base URL and a placeholder API key in every example:

```env
LANONASIS_API_URL=https://api.lanonasis.com
LANONASIS_API_KEY=lns_test_xxxxxxxxxxxxxxxx
```

## 1. TypeScript SDK

Use the universal memory client. In production, import from `@lanonasis/memory-client/core` for the smallest browser bundle, or from `@lanonasis/memory-client/node` for Node.js with CLI/MCP bridging.

```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: process.env.LANONASIS_API_URL || 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY,
});

// 1. Create
const created = await client.createMemory({
  title: 'Q4 Planning Notes',
  content: 'We decided to prioritise the SDK matrix and the MCP tooling before the end of the quarter.',
  memory_type: 'project',
  tags: ['planning', 'q4', 'sdk']
});
console.log('Created:', created.data?.id);

// 2. Search
const found = await client.searchMemories({
  query: 'SDK matrix priorities',
  limit: 5,
  threshold: 0.7
});
console.log('Search hits:', found.data?.total_results);

// 3. Update (using the id from the create step)
const memoryId = created.data?.id;
if (memoryId) {
  const updated = await client.updateMemory(memoryId, {
    title: 'Q4 Planning Notes (updated)',
    tags: ['planning', 'q4', 'sdk', 'walkthrough']
  });
  console.log('Updated:', updated.data?.id);

  // 4. Delete
  const deleted = await client.deleteMemory(memoryId);
  console.log('Deleted:', deleted.data ?? deleted.message);
}
```

**Expected output (local mock):**

```text
Created: mem_01j5m2xz3abcdef
Search hits: 1
Updated: mem_01j5m2xz3abcdef
Deleted: Memory deleted successfully
```

## 2. curl / REST API

The REST API is the canonical contract every SDK and tool uses. Replace `lns_test_...` with your own API key.

### 2.1 Create a memory

```bash
curl -X POST "${LANONASIS_API_URL}/memories" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${LANONASIS_API_KEY}" \
  -d '{
    "title": "Q4 Planning Notes",
    "content": "We decided to prioritise the SDK matrix and the MCP tooling before the end of the quarter.",
    "memory_type": "project",
    "tags": ["planning", "q4", "sdk"]
  }'
```

**Expected response (local mock):**

```json
{
  "data": {
    "id": "mem_01j5m2xz3abcdef",
    "title": "Q4 Planning Notes",
    "content": "We decided to prioritise the SDK matrix and the MCP tooling before the end of the quarter.",
    "memory_type": "project",
    "tags": ["planning", "q4", "sdk"],
    "created_at": "2026-08-08T10:00:00.000Z"
  }
}
```

### 2.2 Search memories

```bash
curl -X POST "${LANONASIS_API_URL}/memories/search" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${LANONASIS_API_KEY}" \
  -d '{
    "query": "SDK matrix priorities",
    "limit": 5,
    "threshold": 0.7
  }'
```

**Expected response (local mock):**

```json
{
  "data": {
    "total_results": 1,
    "results": [
      {
        "id": "mem_01j5m2xz3abcdef",
        "title": "Q4 Planning Notes",
        "similarity_score": 0.92
      }
    ]
  }
}
```

### 2.3 Update a memory

```bash
curl -X PATCH "${LANONASIS_API_URL}/memories/mem_01j5m2xz3abcdef" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${LANONASIS_API_KEY}" \
  -d '{
    "title": "Q4 Planning Notes (updated)",
    "tags": ["planning", "q4", "sdk", "walkthrough"]
  }'
```

**Expected response (local mock):**

```json
{
  "data": {
    "id": "mem_01j5m2xz3abcdef",
    "title": "Q4 Planning Notes (updated)",
    "tags": ["planning", "q4", "sdk", "walkthrough"],
    "updated_at": "2026-08-08T10:01:00.000Z"
  }
}
```

### 2.4 Delete a memory

```bash
curl -X DELETE "${LANONASIS_API_URL}/memories/mem_01j5m2xz3abcdef" \
  -H "X-API-Key: ${LANONASIS_API_KEY}"
```

**Expected response (local mock):**

```json
{
  "data": null,
  "message": "Memory deleted successfully"
}
```

## 3. MCP (Model Context Protocol)

The LanOnasis MCP server exposes memory operations as tools. Use the tool names with your MCP client, or run `onasis mcp tools` to see the current list. The examples below use the standard JSON-RPC tool call shape.

### 3.1 Create

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "memory_create",
    "arguments": {
      "title": "Q4 Planning Notes",
      "content": "We decided to prioritise the SDK matrix and the MCP tooling before the end of the quarter.",
      "memory_type": "project",
      "tags": ["planning", "q4", "sdk"]
    }
  }
}
```

**Expected response (local mock):**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Created memory mem_01j5m2xz3abcdef"
      }
    ]
  }
}
```

### 3.2 Search

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "memory_search",
    "arguments": {
      "query": "SDK matrix priorities",
      "limit": 5,
      "threshold": 0.7
    }
  }
}
```

**Expected response (local mock):**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 1 result(s): mem_01j5m2xz3abcdef — Q4 Planning Notes (score 0.92)"
      }
    ]
  }
}
```

### 3.3 Update

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "memory_update",
    "arguments": {
      "memory_id": "mem_01j5m2xz3abcdef",
      "title": "Q4 Planning Notes (updated)",
      "tags": ["planning", "q4", "sdk", "walkthrough"]
    }
  }
}
```

**Expected response (local mock):**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Updated memory mem_01j5m2xz3abcdef"
      }
    ]
  }
}
```

### 3.4 Delete

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "memory_delete",
    "arguments": {
      "memory_id": "mem_01j5m2xz3abcdef"
    }
  }
}
```

**Expected response (local mock):**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Deleted memory mem_01j5m2xz3abcdef"
      }
    ]
  }
}
```

## 4. CLI

The [`@lanonasis/cli`](../sdks/cli.md) binary is available as `onasis`, `lanonasis`, `memory`, or `maas`. All examples use `onasis`.

### 4.1 Create

```bash
onasis memory create \
  --title "Q4 Planning Notes" \
  --content "We decided to prioritise the SDK matrix and the MCP tooling before the end of the quarter." \
  --type project \
  --tags "planning,q4,sdk"
```

**Expected output (local mock):**

```text
✓ Created memory mem_01j5m2xz3abcdef
```

### 4.2 Search

```bash
onasis memory search "SDK matrix priorities" --limit 5
```

**Expected output (local mock):**

```text
┌─────────────────────────┬──────────────────────────┬──────────┐
│ ID                      │ Title                    │ Score    │
├─────────────────────────┼──────────────────────────┼──────────┤
│ mem_01j5m2xz3abcdef     │ Q4 Planning Notes        │ 0.92     │
└─────────────────────────┴──────────────────────────┴──────────┘
```

### 4.3 Update

```bash
onasis memory update mem_01j5m2xz3abcdef \
  --title "Q4 Planning Notes (updated)" \
  --tags "planning,q4,sdk,walkthrough"
```

**Expected output (local mock):**

```text
✓ Updated memory mem_01j5m2xz3abcdef
```

### 4.4 Delete

```bash
onasis memory delete mem_01j5m2xz3abcdef --force
```

**Expected output (local mock):**

```text
✓ Deleted memory mem_01j5m2xz3abcdef
```

## Validation summary

| Surface | Create | Search | Update | Delete |
|---------|--------|--------|--------|--------|
| TypeScript SDK | ✅ | ✅ | ✅ | ✅ |
| curl / REST | ✅ | ✅ | ✅ | ✅ |
| MCP | ✅ | ✅ | ✅ | ✅ |
| CLI | ✅ | ✅ | ✅ | ✅ |

## Next steps

- Compare SDK surfaces in the [SDK Capability Matrix](../sdks/matrix.md).
- See the [full CLI reference](../cli/reference.md).
- See the [MCP Tools Reference](../mcp/tools.md) for the complete tool list and schemas.
- Read the [REST API docs](../memory/rest-api.md) for endpoint-level details.
