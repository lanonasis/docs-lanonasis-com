---
sidebar_position: 2
---

# TypeScript SDK

Official TypeScript SDK for LanOnasis Memory-as-a-Service.

## Installation

```bash
npm install @lanonasis/sdk
# or
yarn add @lanonasis/sdk
# or
bun add @lanonasis/sdk
```

## Quick Start

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

## API Reference

See the [full API reference](./typescript/api-reference) for detailed documentation.

## Examples

Check out our [examples](./typescript/examples) for common use cases.
