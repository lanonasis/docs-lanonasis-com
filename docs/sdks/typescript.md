---
sidebar_position: 2
---

# TypeScript SDK

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
import { MemoryClient } from '@lanonasis/memory-client';

const client = new MemoryClient({
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const memory = await client.memories.create({
  title: 'Important Note',
  content: 'This is my memory content',
  tags: ['work', 'project']
});
```

**Package Details:**
- ✅ Published to npm
- ✅ Version: 1.0.0
- ✅ Size: ~150 KB
- ✅ TypeScript support

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
import { MemorySDK } from '@lanonasis/memory-sdk-standalone';

const sdk = new MemorySDK({
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const memory = await sdk.createMemory({
  title: 'Project Requirements',
  content: 'Build a social media dashboard...',
  type: 'project'
});

// Search memories
const results = await sdk.searchMemories({
  query: 'dashboard requirements',
  limit: 10
});
```

**Package Details:**
- ✅ Published to npm
- ✅ Version: 1.0.0
- ✅ Size: ~140 KB
- ✅ CJS + ESM builds
- ✅ Perfect for orchestration

---

### Enterprise SDK (Coming Soon)

Full-featured SDK with memory, API keys, and MCP support.

**Installation:**

```bash
npm install @lanonasis/sdk
# or
yarn add @lanonasis/sdk
# or
bun add @lanonasis/sdk
```

**Quick Start:**

```typescript
import { LanOnasisClient } from '@lanonasis/sdk';

const client = new LanOnasisClient({
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const memory = await client.memories.create({
  title: 'Important Note',
  content: 'This is my memory content',
  tags: ['work', 'project']
});
```

**Package Details:**
- ⏳ Coming soon
- 🔄 Not yet published
- Full platform integration

## API Reference

See the [full API reference](./typescript/api-reference) for detailed documentation.

## Examples

Check out our [examples](./typescript/examples) for common use cases.
