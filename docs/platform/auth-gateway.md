---
title: Auth Gateway (Enterprise Identity)
sidebar_position: 2
---

# Auth Gateway Product Documentation

The LanOnasis **Auth Gateway** is a standalone, event-sourced identity and access management (IAM) platform. It provides a unified security layer for the entire ecosystem, supporting over 11 distinct authentication and authorization methods.

## Core Architecture

The gateway is built on a **CQRS (Command Query Responsibility Segregation)** pattern with an **Event Store**, ensuring that every identity change, login attempt, and permission grant is immutable and auditable.

- **Event Store**: PostgreSQL-based event logging (`009_event_store.sql`).
- **Identity Resolution**: Universal Auth Identifier (UAI) for cross-platform session persistence.
- **Deployment**: Multi-environment support (Netlify Functions, VPS/PM2, Docker).

---

## Authentication Methods (The "11 Pillars")

The Gateway provides flexible entry points for every type of client:

### 1. OAuth2 with PKCE
The primary method for public clients (Web/Mobile) to ensure secure token exchange without client secrets.

### 2. OTP (One-Time Password)
Secure, passwordless entry via email or SMS, managed through specialized Supabase Edge functions.

### 3. UAI (Universal Auth Identifier)
A proprietary method for resolving identities across different service domains without re-authenticating.

### 4. API Key Management
Enterprise-grade key rotation, revocation, and scope-limiting for server-to-service communication.

### 5. CLI Authentication
Optimized OAuth flow for the `lanonasis-cli`, supporting headless and interactive environments.

### 6. Device Flow
For limited-input devices (IDEs, IoT) using code-based pairing.

### 7. MCP (Model Context Protocol) Auth
Specialized auth bridge for AI agents to securely access memories.

### 8. Identity Resolution (Resolve)
Endpoint for mapping external vendor IDs to internal LanOnasis UAIs.

### 9. OTP (Legacy/Internal)
Fallback methods for internal system users.

### 10. Service-to-Service (JWT)
Mutual TLS and JWT-based authentication for microservices (`api-gateway` to `key-manager`).

### 11. Custom SSO Integrations
Hook-based system for external identity providers.

---

## Integration Guide

### Public Endpoint Families

Use `https://auth.lanonasis.com` as the canonical public auth host.

- OAuth PKCE: `https://auth.lanonasis.com/oauth/authorize`, `https://auth.lanonasis.com/oauth/token`
- Verification and identity: `https://auth.lanonasis.com/v1/auth/verify`, `https://auth.lanonasis.com/v1/auth/verify-token`, `https://auth.lanonasis.com/v1/auth/resolve`
- Compatibility mirrors may also be exposed through the API edge (for example `https://api.lanonasis.com/api/v1/oauth/*`), but the standalone auth host is the source-of-truth contract for clients.

### Identity Resolution Flow (UAI)
The `uai-router.middleware.ts` handles the mapping of users across the ecosystem:

```typescript
// Example: Requesting a session for a sub-domain
GET /v1/auth/resolve?client_id=dashboard&uai=...
```

---

## Development & Operations

### Migrations & Schema
Identity data is stored across several key tables:
- `api_clients`: Registered applications.
- `event_store`: Immutable log of auth events.
- `api_keys`: Scoped access tokens.

### Common Commands
```bash
# Test the full auth flow
bun run test:e2e:auth

# Check OAuth provider status
node scripts/check-oauth-providers.mjs
```

---

**Product Status**: ✅ Production  
**Owner**: @auth-team  
**Version**: 3.2.0 (Event-Sourced)
