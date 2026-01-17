---
sidebar_position: 2
---

# TypeScript Examples

Common usage examples for the LanOnasis TypeScript SDK.

## Basic Operations

### Creating Memories
```typescript
const created = await client.createMemory({
  title: 'Meeting Notes',
  content: 'Discussion about Q4 planning...',
  memory_type: 'project',
  tags: ['meeting', 'planning', 'q4']
});

if (created.data) {
  console.log('Memory ID:', created.data.id);
}
```

### Searching Memories
```typescript
const results = await client.searchMemories({
  query: 'planning',
  limit: 10,
  tags: ['meeting']
});

console.log('Matches:', results.data?.results);
```

### Batch Operations
```typescript
const deleted = await client.bulkDeleteMemories([
  'mem_id_1',
  'mem_id_2'
]);

if (deleted.data) {
  console.log('Deleted:', deleted.data.deleted_count);
}
```
