---
title: SDKs & Libraries
sidebar_position: 1
description: "Overview of LanOnasis SDKs: TypeScript, Python, CLI, and REST API clients."
---

## Official SDKs

LanOnasis provides official TypeScript/JavaScript SDKs, a professional CLI, and platform protocols (REST, MCP). Other language SDKs are on the roadmap. See the [SDK Capability Matrix](./matrix.md) for a per-surface, source-verified status of every capability.

## TypeScript / JavaScript

### Memory Client (Recommended)

Universal memory client with multi-runtime support.

```bash
npm install @lanonasis/memory-client
```

- ✅ Published: [`@lanonasis/memory-client`](https://www.npmjs.com/package/@lanonasis/memory-client)
- [TypeScript SDK docs](./typescript)
- [Capability matrix](./matrix.md)

### Memory SDK (Standalone)

Drop-in SDK for multi-agent systems with no platform dependencies.

```bash
npm install @lanonasis/memory-sdk-standalone
```

- ✅ Published: [`@lanonasis/memory-sdk-standalone`](https://www.npmjs.com/package/@lanonasis/memory-sdk-standalone)
- [Capability matrix](./matrix.md)

### AI SDK

LLM completions, embeddings, and reasoning helpers.

```bash
npm install @lanonasis/ai-sdk
```

- ✅ Published: [`@lanonasis/ai-sdk`](https://www.npmjs.com/package/@lanonasis/ai-sdk)
- [AI SDK docs](./ai-sdk.md)
- [Capability matrix](./matrix.md)

### Memory Intelligence SDK

Behavior analytics, related-memory discovery, and intelligence workflows.

```bash
npm install @lanonasis/mem-intel-sdk
```

- ✅ Published: [`@lanonasis/mem-intel-sdk`](https://www.npmjs.com/package/@lanonasis/mem-intel-sdk)
- [Memory Intelligence SDK docs](./mem-intel-sdk.md)
- [Capability matrix](./matrix.md)

### Security SDK

Encryption, hashing, and key management.

```bash
npm install @lanonasis/security-sdk
```

- ✅ Published: [`@lanonasis/security-sdk`](https://www.npmjs.com/package/@lanonasis/security-sdk)
- [Security SDK docs](./security-sdk.md)
- [Capability matrix](./matrix.md)

### OAuth Client

Authentication and API-key flows for browser, server, and React.

```bash
npm install @lanonasis/oauth-client
```

- ✅ Published: [`@lanonasis/oauth-client`](https://www.npmjs.com/package/@lanonasis/oauth-client)
- [OAuth Client docs](./oauth-client.md)
- [Capability matrix](./matrix.md)

### CLI

Professional CLI for Memory as a Service.

```bash
npm install -g @lanonasis/cli
```

- ✅ Published: [`@lanonasis/cli`](https://www.npmjs.com/package/@lanonasis/cli)
- [CLI docs](./cli)
- [CLI Reference](../cli/reference.md)
- [Capability matrix](./matrix.md)

## Platform protocols

- **REST API** — HTTP/JSON endpoints for every memory operation. See [REST API docs](../memory/rest-api.md) and [API Overview](../api/overview.md).
- **MCP** — Model Context Protocol server with 37+ tools. See [MCP Tools Reference](../mcp/tools.md).

## Planned surfaces

The following packages and languages are documented as in-progress or coming soon; they are **not yet published** and should not be used for production work today.

| Surface | Status | Notes |
|---------|--------|-------|
| `@lanonasis/memory-sdk` (top-level) | ⏳ Planned | Manifest exists at `1.0.0` but not published to npm. Use `@lanonasis/memory-sdk-standalone` or `@lanonasis/memory-client` instead. |
| `@lanonasis/api-client` | ⏳ Planned | Docs page exists; no source package yet. |
| `@lanonasis/cli-sdk` | ⏳ Planned | Docs page exists; no source package yet. |
| Python SDK (`lanonasis`) | ⏳ Planned | Not on PyPI. See [Python SDK docs](./python.md). |
| Go SDK | ⏳ Planned | Not published. See [Go SDK docs](./go.md). |
| Rust / Ruby / community | ❌ Not available | No official packages or source exports. |

## Related

- [SDK Capability Matrix](./matrix.md) — source-verified capability grid
- [TypeScript SDK Quick Start](./typescript/quickstart.md)
- [CLI Reference](../cli/reference.md)
- [MCP Tools Reference](../mcp/tools.md)
