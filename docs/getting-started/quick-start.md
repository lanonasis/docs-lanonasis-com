---
title: Quick Start
sidebar_position: 1
---

# Quick Start Guide

Get up and running with LanOnasis in 5 minutes.

## Prerequisites

- Node.js 18+ or Python 3.8+
- An API key (get one from the [Dashboard](https://dashboard.lanonasis.com))

## Installation

Choose your preferred SDK:

### TypeScript/JavaScript

```bash
# Memory Client (Recommended)
npm install @lanonasis/memory-client

# Standalone SDK
npm install @lanonasis/memory-sdk-standalone
```

### Python

```bash
pip install lanonasis  # Coming soon
```

## Your First Memory

### JavaScript Example

```javascript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const created = await client.createMemory({
  title: 'My first memory!',
  content: 'My first memory!',
  tags: ['getting-started'],
  metadata: { importance: 'high' }
});

if (created.data) {
  console.log('Memory created:', created.data.id);
}

// Search memories
const results = await client.searchMemories({
  query: 'first memory',
  limit: 10
});

console.log('Matches:', results.data?.results);
```

### Python Example

```python
from lanonasis import MemoryClient

client = MemoryClient(api_key="your-api-key")

# Create a memory
memory = client.create_memory(
    title="My first memory!",
    content="My first memory!",
    tags=["getting-started"],
    metadata={"importance": "high"}
)

# Search memories
results = client.search_memories(
    query="first memory",
    limit=10
)
```

## Next Steps

- [Explore the API Reference](/api/overview)
- [Learn about Vector Search](/guides/vector-search)
- [Set up Real-time Sync](/guides/realtime-sync)
