---
title: Vendor API Key Management
sidebar_label: Vendor Key Management
---

LanOnasis provides a centralized Foreign API Key Manager to securely manage upstream vendor credentials across the platform.

## Why a key manager?

- Prevent leaked or hard‑coded vendor keys
- Enable rotation without redeploys
- Enforce auditability and access boundaries

## Capabilities

- Secure storage and retrieval
- Rotation policies and scheduling
- Audit logs for access and changes
- Scoped access by project and role

## Access patterns

- REST endpoints via `https://api.lanonasis.com`
- MCP tools via `https://mcp.lanonasis.com`

> Clients should never embed upstream provider keys in application `.env` files. Use the manager APIs or tools instead.

## Typical flows

1. Create or import a vendor key into the manager (scoped to a project).
2. Reference the key by handle/alias from services or tools.
3. Rotate per policy; consumers automatically pick up the new version.
4. Review audits and alerts for unusual access patterns.

## Migration from embedded keys

- Remove provider keys from app configs and `.env` files.
- Store them in the manager and reference by handle.
- See [Changelog & Migration](../changes/migrations.md) for phased steps.

## Related docs

- Security & Privacy: [Implementation Overview](../security/privacy-implementation.md)
- MCP: [Production Server](../mcp/production-server.md)

