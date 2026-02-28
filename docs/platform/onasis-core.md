---
title: Onasis-CORE - Platform Mesh & API Routing
sidebar_label: Onasis-CORE
description: Enterprise-grade privacy mesh, API routing, and vendor anonymization platform.
---

**Onasis-CORE** is the central privacy-protecting mesh of the LanOnasis ecosystem. It provides secure, anonymous bridges between vendors and clients, handling complex API routing, data masking, and billing reconciliation.

:::tip Dedicated Auth Documentation
The authentication and identity management capabilities of the platform have been moved to the standalone **[Auth Gateway](./auth-gateway.md)** documentation.
:::

## Overview

Onasis-CORE enables the "Three-System Architecture" by acting as the secure proxy that ensures:

- **Vendor Privacy**: Hide vendor identity from clients.
- **Client Anonymity**: Obscure client details from vendors.
- **Service Orchestration**: Unified routing across 30+ monorepo services.
- **Compliance**: Automated GDPR, HIPAA, and SOX data masking.

### The Privacy Mesh Pattern

```
Client (Brand: VortexAI)
  ↓ (Authenticated via Auth Gateway)
Onasis-CORE (Routing & Anonymization Layer)
  ↓ (Masked & Scoped Request)
Vendor APIs / Microservices
  ↓ (Vendor Response)
Onasis-CORE (Re-identification & Sanitization)
  ↓ (Branded Response)
Client
```

---

## Core Services

### 1. API Routing Mesh (`/api-gateway`)

The backbone of the monorepo's service-to-service communication:

**Features**:
- **Intelligent Routing**: Dynamic path-based routing to microservices.
- **Request Anonymization**: Strip PII and inject anonymous identifiers.
- **Response Sanitization**: Ensure sensitive vendor data never reaches the client.
- **Rate Limiting**: Tier-based quota enforcement.

### 2. Data Masking Engine (`/data-masking`)

Enterprise-grade anonymization for regulatory compliance:

**Strategies**:
- **Deterministic Hashing**: For consistent IDs without exposing PII.
- **Dynamic Tokenization**: Reversible masking with secure vaulting.
- **Redaction**: Automated removal of sensitive fields (`[MASKED]`).

### 3. Billing & Usage Bridge (`/billing-bridge`)

Audit-ready usage tracking that preserves anonymity:
- Track usage by anonymous IDs.
- Reconcile cross-vendor costs without exposing relationships.
- Generate unified billing events for the `dashboard`.

---

## Infrastructure (2026 Evolution)

### Service Orchestration
The platform now utilizes a **Unified Router** (`unified-router.cjs`) to manage traffic across:
- **Auth Gateway**: Identity & Session management.
- **MCP Router**: Intelligent AI agent routing.
- **Key Manager**: Foreign API key rotation.

### Deployment Architecture
- **Serverless**: Netlify Functions for low-latency edge routing.
- **Edge**: Regional deployments for GDPR compliance.
- **Audit**: Immutable event logs stored in the `control_room` schema.

---

## Configuration & Integration

### Mesh Configuration
Routing rules are defined in the `platform-ecosystem.json` and enforced via middleware:

```typescript
// Example: Adding a new microservice to the mesh
{
  "service": "vortexai-l0",
  "route": "/api/ai/v1",
  "masking": true,
  "auth_required": true
}
```

---

## Related Documentation

- **[Auth Gateway](./auth-gateway.md)** – Detailed IAM and 11+ Auth methods.
- **[MCP Core](./mcp-core.md)** – Content preprocessing for the mesh.
- **[v-secure](./v-secure.md)** – Secret rotation and compliance engine.

---

**Status**: ✅ Production (Platform Mesh)  
**Version**: 3.0.0 (Unified Orchestrator)
