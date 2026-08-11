---
title: SDK Capability Matrix
sidebar_label: Capability Matrix
---

# SDK & Surface Capability Matrix

This matrix is derived from the current publishable package manifests and source exports in the monorepo. It labels every capability cell as **verified** (published and exported), **partial** (published with limitations), **planned** (manifest or roadmap only), or **absent** (no source package yet).

> **Rule of thumb:** if a package is not published to npm and has no source exports, we do not present it as available. Use the published surfaces (green) for production work today.

## Legend

| Label | Meaning |
|-------|---------|
| ✅ verified | Published to a public registry and the source exports confirm the capability. |
| ⚠️ partial | Published, but the capability is limited, split across packages, or only available in specific runtimes. |
| ⏳ planned | Source manifest or roadmap exists, but the package is not published yet. |
| ❌ absent | No published package or source export for this capability. |
| n/a | Not applicable for that surface (e.g., a protocol does not have a "version"). |

## Verified TypeScript / JavaScript surfaces

| Capability | [memory-client](https://www.npmjs.com/package/@lanonasis/memory-client) · [manifest](https://github.com/thefixer3x/lan-onasis-monorepo/tree/main/apps/lanonasis-maas/packages/memory-client/package.json) | [memory-sdk-standalone](https://www.npmjs.com/package/@lanonasis/memory-sdk-standalone) · [manifest](https://github.com/thefixer3x/lan-onasis-monorepo/tree/main/apps/lanonasis-maas/packages/memory-sdk/package.json) | [ai-sdk](https://www.npmjs.com/package/@lanonasis/ai-sdk) · [manifest](https://github.com/thefixer3x/lan-onasis-monorepo/tree/main/packages/ai-sdk/package.json) | [security-sdk](https://www.npmjs.com/package/@lanonasis/security-sdk) · [manifest](https://github.com/thefixer3x/lan-onasis-monorepo/tree/main/packages/security-sdk/package.json) | [oauth-client](https://www.npmjs.com/package/@lanonasis/oauth-client) · [manifest](https://github.com/thefixer3x/lan-onasis-monorepo/tree/main/packages/oauth-client/package.json) | [cli](https://www.npmjs.com/package/@lanonasis/cli) · [manifest](https://github.com/thefixer3x/lan-onasis-monorepo/tree/main/apps/lanonasis-maas/cli/package.json) | [mem-intel-sdk](https://www.npmjs.com/package/@lanonasis/mem-intel-sdk) · [manifest](https://github.com/thefixer3x/lan-onasis-monorepo/tree/main/packages/memory-intelligence-engine/mem-intelligence-sdk/package.json) |
|---|---|---|---|---|---|---|---|
| Memory CRUD | ✅ verified | ✅ verified | ❌ absent | ❌ absent | ❌ absent | ✅ verified | ❌ absent |
| Semantic search | ✅ verified | ✅ verified | ⚠️ embed-only | ❌ absent | ❌ absent | ✅ verified | ❌ absent |
| Topics | ✅ verified | ✅ verified | ❌ absent | ❌ absent | ❌ absent | ✅ verified | ❌ absent |
| API key management | ❌ absent | ❌ absent | ❌ absent | ⚠️ hash/verify only | ❌ absent | ✅ verified | ❌ absent |
| Auth / OAuth | ❌ absent | ❌ absent | ❌ absent | ❌ absent | ✅ verified | ✅ verified | ❌ absent |
| Intelligence & behavior | ⚠️ types only | ❌ absent | ✅ verified | ❌ absent | ❌ absent | ✅ verified | ✅ verified |
| Runtime targets | ✅ browser / node / edge / react / vue | ✅ node | ✅ browser / node / react | ✅ node | ✅ browser / server / react | ✅ node | ✅ node |
| Published version | ✅ 2.2.0 npm / 2.2.1 manifest | ✅ 1.1.0 | ✅ 0.3.0 | ✅ 1.0.5 | ✅ 2.0.4 | ✅ 3.11.2 | ✅ 2.1.0 |

## Platform & planned surfaces

| Capability | curl / REST · [REST docs](../memory/rest-api.md) | MCP · [tools](../mcp/tools.md) | memory-sdk · [manifest](https://github.com/thefixer3x/lan-onasis-monorepo/tree/main/packages/memory-sdk/package.json) | api-client · [docs page](./api-client.md) | cli-sdk · [docs page](./cli-sdk.md) | Python SDK · [docs page](./python.md) | Go SDK · [docs page](./go.md) |
|---|---|---|---|---|---|---|---|
| Memory CRUD | ✅ verified | ✅ verified | ⏳ planned | ❌ absent | ❌ absent | ⏳ planned | ⏳ planned |
| Semantic search | ✅ verified | ✅ verified | ⏳ planned | ❌ absent | ❌ absent | ⏳ planned | ⏳ planned |
| Auth | ✅ verified | ❌ absent | ⏳ planned | ❌ absent | ❌ absent | ⏳ planned | ⏳ planned |
| Intelligence & behavior | ⚠️ partial | ✅ verified | ⏳ planned | ❌ absent | ❌ absent | ⏳ planned | ⏳ planned |
| Runtime targets | ✅ any HTTP client | ✅ any MCP client | ⏳ node | ❌ absent | ❌ absent | ⏳ planned | ⏳ planned |
| CLI / wrapper | ❌ absent | ❌ absent | ❌ absent | ❌ absent | ❌ absent | ❌ absent | ❌ absent |
| Published status | n/a (platform API) | n/a (protocol server) | ⏳ 1.0.0 manifest, not published | ❌ no package | ❌ no package | ⏳ not on PyPI | ⏳ not published |

## How to choose a surface

- **Web / React / Vue app:** use [`@lanonasis/memory-client`](./typescript.md) with the `/core`, `/react`, or `/vue` entry points.
- **Node.js script or service:** use [`@lanonasis/memory-sdk-standalone`](./typescript.md) or [`@lanonasis/memory-client`](./typescript.md)`/node`.
- **AI agent or LLM integration:** use [`@lanonasis/ai-sdk`](./ai-sdk.md) for generation/embeddings and [`@lanonasis/mem-intel-sdk`](./mem-intel-sdk.md) for memory intelligence.
- **Authentication flows:** use [`@lanonasis/oauth-client`](./oauth-client.md).
- **Encryption / key management:** use [`@lanonasis/security-sdk`](./security-sdk.md).
- **Terminal automation:** use [`@lanonasis/cli`](./cli.md) (global install `npm i -g @lanonasis/cli`).
- **Cross-language or non-TS:** use the **REST API** directly or **MCP**; the Python and Go SDKs are on the roadmap but not available yet.

## Notes on split packages

- `@lanonasis/memory-client` (v2.2.x) is the **recommended** universal memory client. Its published npm version is `2.2.0`; the monorepo manifest is `2.2.1` and awaits the next publish.
- `@lanonasis/memory-sdk` (top-level `packages/memory-sdk`) has a source manifest at `1.0.0` but is **not published**; do not install it from npm. Use `@lanonasis/memory-sdk-standalone` for the same surface.
- `@lanonasis/api-client` and `@lanonasis/cli-sdk` appear only as docs pages; no source package exists yet. They are **not available**.
- The Python SDK (`pip install lanonasis`) and Go SDK are documented as **Coming Soon** and are not published.

## Related

- [SDKs & Libraries overview](./overview.md)
- [TypeScript SDK](./typescript.md)
- [CLI Reference](../cli/reference.md)
- [MCP Tools Reference](../mcp/tools.md)
- [REST API Overview](../memory/rest-api.md)
