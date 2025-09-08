---
title: Quick Start
sidebar_position: 1
---

# Quick Start Guide

Get up and running with Lanonasis in 5 minutes.

## Prerequisites

- Node.js 18+ or Python 3.8+
- An API key (get one from the [Dashboard](http://dashboard.lanonasis.local))

## Installation

Choose your preferred SDK:

### TypeScript/JavaScript

```bash
npm install @lanonasis/memory-sdk
```

### Python

```bash
pip install lanonasis
```

## Your First Memory

### JavaScript Example

```javascript
import { MemoryClient } from '@lanonasis/memory-sdk';

const client = new MemoryClient({
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const memory = await client.memories.create({
  content: 'My first memory!',
  metadata: { importance: 'high' }
});

// Search memories
const results = await client.search({
  query: 'first memory',
  limit: 10
});
```

### Python Example

```python
from lanonasis import MemoryClient

client = MemoryClient(api_key="your-api-key")

# Create a memory
memory = client.memories.create(
    content="My first memory!",
    metadata={"importance": "high"}
)

# Search memories
results = client.search(
    query="first memory",
    limit=10
)
```

## Next Steps

- [Explore the API Reference](/api/overview)
- [Learn about Vector Search](/guides/vector-search)
- [Set up Real-time Sync](/guides/realtime-sync)
