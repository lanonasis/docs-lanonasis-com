---
title: Security & Privacy Implementation
sidebar_label: Security & Privacy
---

This page maps public guarantees to the high‑level mechanisms used in the platform. Details are intentionally abstracted to avoid over‑exposure.

## Access controls

- Central Auth Gateway issues scoped tokens with project/user claims
- Database Row‑Level Security (RLS) enforces per‑row access
- Service policies restrict cross‑project access

## Data protection

- Sensitive tokens and vendor credentials are isolated in a dedicated key manager
- Minimal data retention with explicit TTLs where applicable
- Optional anonymization/pseudonymization for logs and analytics

## Audit & observability

- Gateway and service calls are logged with project, user, and operation context
- MCP tool invocations and REST requests are rate‑limited and monitored
- Alerts on anomalous patterns and policy violations

## Boundary enforcement

- No cross‑project shortcuts; inter‑project calls go through authenticated, logged functions
- Self‑hosted deployments must replicate policy boundaries and logging

## Managed vs self‑hosted notes

- LanOnasis‑managed: centralized logging, managed rotations, and platform‑level protections
- Self‑hosted: follow the same patterns; ensure secrets management, logging, and rate limits are configured

## Related docs

- Auth: [Central Auth Gateway](../auth/central-auth-gateway.md)
- Keys: [Vendor Key Management](../keys/vendor-key-management.md)
- Platform: [Architecture & Domains](../platform/architecture.md)

