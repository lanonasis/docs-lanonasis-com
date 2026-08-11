---
sidebar_position: 2
title: TypeScript SDK
description: Official TypeScript SDKs for LanOnasis Memory-as-a-Service.
---

## TypeScript SDK

Official TypeScript SDKs for LanOnasis Memory-as-a-Service.

## Choose Your SDK

LanOnasis offers three TypeScript/JavaScript SDKs depending on your needs:

### Memory Client (Recommended)

Lightweight SDK focused on memory operations. Best for most applications.

**Installation:**

```bash
npm install @lanonasis/memory-client
# or
yarn add @lanonasis/memory-client
# or
bun add @lanonasis/memory-client
```

**Quick Start:**

```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const created = await client.createMemory({
  title: 'Important Note',
  content: 'This is my memory content',
  tags: ['work', 'project']
});

if (created.data) {
  console.log('Memory ID:', created.data.id);
}
```

**Package Details:**
- ✅ Published to npm
- ✅ Version: 2.2.0 npm / 2.2.1 manifest
- ✅ Size: ~150 KB
- ✅ TypeScript support

For intelligence and behavior APIs, the current source package in this monorepo is `@lanonasis/mem-intel-sdk` (`2.1.0`). See the [Memory Intelligence SDK page](./mem-intel-sdk.md).

---

### Standalone Memory SDK

Drop-in SDK for multi-agent systems with no platform dependencies.

**Installation:**

```bash
npm install @lanonasis/memory-sdk-standalone
# or
yarn add @lanonasis/memory-sdk-standalone
# or
bun add @lanonasis/memory-sdk-standalone
```

**Quick Start:**

```typescript
import { MemoryClient } from '@lanonasis/memory-sdk-standalone';

const sdk = new MemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const memory = await sdk.createMemory({
  title: 'Project Requirements',
  content: 'Build a social media dashboard...',
  memory_type: 'project'
});

// Search memories
const results = await sdk.searchMemories({
  query: 'dashboard requirements',
  limit: 10
});
```

**Package Details:**
- ✅ Published to npm
- ✅ Version: 1.1.0
- ✅ Size: ~140 KB
- ✅ CJS + ESM builds
- ✅ Perfect for orchestration

---

### Enterprise SDK (Coming Soon)

Full-featured SDK with memory, API keys, and MCP support.

**Status:** ⏳ Coming soon

Until the Enterprise SDK is available, use `@lanonasis/memory-client` for production workloads.

**Package Details:**
- ⏳ Coming soon
- 🔄 Not yet published
- Full platform integration

## API Reference

See the [full API reference](./typescript/api-reference) for detailed documentation.

## Examples

Check out our [examples](./typescript/examples) for common use cases.
