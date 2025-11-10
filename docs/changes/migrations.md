---
title: Migration Guides
sidebar_label: Migration Guides
---

This page consolidates notable deprecations and the recommended upgrade paths.

## Auth: API keys → OAuth

- Status: API‑key‑only flows are legacy/limited.
- Action: Use the [Central Auth Gateway](../auth/central-auth-gateway.md) with Device Flow (CLI/IDE/MCP) or PKCE (web).

## MCP: Server consolidation

- Status: Deprecated experimental/archived MCP servers.
- Action: Use only `https://mcp.lanonasis.com`. Update IDE/agent configs accordingly.

## REST: Endpoint normalization

- Status: Mix of `/v1/*` and `/api/v1/*` existed.
- Action: Standardize on `https://api.lanonasis.com/api/v1/...` in all integrations.

## Memory Suite: Official clients

- Status: Ad‑hoc HTTP clients in examples.
- Action: Prefer `@lanonasis/memory-client` and `@lanonasis/cli` for stability and typed APIs.

## Vendor keys: Embedded → Manager

- Status: Provider keys embedded in app configs.
- Action: Move to [Vendor Key Management](../keys/vendor-key-management.md); reference keys by handle/alias.

## Observability & security

- Action: Ensure requests include project/user context; verify rate limiting and audit logging; follow RLS guidelines.

If unsure where to start, review the [Architecture & Domains](../platform/architecture.md) map, then update auth and endpoints first before adopting Memory clients and the key manager.

