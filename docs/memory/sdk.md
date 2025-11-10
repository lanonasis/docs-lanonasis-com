---
title: Memory SDK
sidebar_label: SDK
---

The official TypeScript SDK `@lanonasis/memory-client` offers a typed interface to the Memory Suite.

## Install

Use your workspace’s package manager (Bun recommended).

```bash
bun add @lanonasis/memory-client
```

## Basic usage

```ts
import { MemoryClient } from "@lanonasis/memory-client";

const client = new MemoryClient({
  baseUrl: "https://api.lanonasis.com/api/v1/memory",
  getToken: async () => {
    // Acquire a bearer token via Central Auth (Device Flow or PKCE)
    return process.env.LANONASIS_TOKEN!;
  },
});

// Example: create a memory item
await client.memories.create({
  namespace: "default",
  content: { type: "text", text: "Hello, Memory Suite" },
  tags: ["example"],
});
```

> Always retrieve short‑lived tokens via the [Central Auth Gateway](../auth/central-auth-gateway.md). Do not embed long‑lived secrets.

## Related docs

- Overview: [MaaS Overview](./overview.md)
- REST API: [Memory REST API](./rest-api.md)
- CLI: [Memory CLI](./cli.md)

