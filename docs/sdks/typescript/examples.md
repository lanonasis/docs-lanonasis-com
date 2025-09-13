---
sidebar_position: 2
---

# TypeScript Examples

Common usage examples for the LanOnasis TypeScript SDK.

## Basic Operations

### Creating Memories
```typescript
const memory = await client.memories.create({
  title: 'Meeting Notes',
  content: 'Discussion about Q4 planning...',
  tags: ['meeting', 'planning', 'q4']
});
```

### Searching Memories
```typescript
const results = await client.memories.search('planning', {
  limit: 10,
  tags: ['meeting']
});
```

### Batch Operations
```typescript
const memories = await client.memories.createBatch([
  { title: 'Note 1', content: 'Content 1' },
  { title: 'Note 2', content: 'Content 2' }
]);
```
