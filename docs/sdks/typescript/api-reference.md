---
sidebar_position: 1
---

# TypeScript API Reference

Complete API reference for the LanOnasis TypeScript SDK.

## Client

### Constructor
```typescript
new LanOnasisClient(config: ClientConfig)
```

## Memories API

### create()
```typescript
client.memories.create(data: CreateMemoryData): Promise<Memory>
```

### get()
```typescript
client.memories.get(id: string): Promise<Memory>
```

### update()
```typescript
client.memories.update(id: string, data: UpdateMemoryData): Promise<Memory>
```

### delete()
```typescript
client.memories.delete(id: string): Promise<void>
```

### search()
```typescript
client.memories.search(query: string, options?: SearchOptions): Promise<Memory[]>
```
