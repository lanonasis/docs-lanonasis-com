---
sidebar_position: 3
title: API Keys API
description: API key lifecycle management endpoints
---

# API Keys API

Manage API key lifecycle including creation, rotation, and revocation with fine-grained permissions.

## Create API Key

Create a new API key with specific scopes and permissions.

### Endpoint

```http
POST /v1/security/api-keys
```

### Request Body

```json
{
  "name": "Production API Key",
  "description": "API key for production services",
  "scopes": [
    "secrets:read",
    "secrets:write",
    "audit:read"
  ],
  "expiresIn": "365d",
  "rateLimit": {
    "requests": 10000,
    "period": "1h"
  },
  "ipWhitelist": ["203.0.113.0/24"],
  "metadata": {
    "service": "billing-api",
    "environment": "production"
  }
}
```

### Response

```json
{
  "id": "key_abc123xyz",
  "name": "Production API Key",
  "apiKey": "vsec_live_AbCdEfGhIjKlMnOpQrStUvWxYz123456",
  "scopes": [
    "secrets:read",
    "secrets:write",
    "audit:read"
  ],
  "expiresAt": "2025-03-15T00:00:00Z",
  "createdAt": "2024-03-15T10:30:00Z",
  "lastUsedAt": null
}
```

:::warning
The `apiKey` value is only returned once during creation. Store it securely.
:::

## Get API Key

Retrieve API key details (without revealing the key value).

### Endpoint

```http
GET /v1/security/api-keys/:id
```

### Response

```json
{
  "id": "key_abc123xyz",
  "name": "Production API Key",
  "description": "API key for production services",
  "scopes": [
    "secrets:read",
    "secrets:write"
  ],
  "expiresAt": "2025-03-15T00:00:00Z",
  "createdAt": "2024-03-15T10:30:00Z",
  "lastUsedAt": "2024-03-20T14:22:00Z",
  "usageCount": 15847,
  "status": "active"
}
```

## Update API Key

Update API key properties (scopes, rate limits, etc.).

### Endpoint

```http
PUT /v1/security/api-keys/:id
```

### Request Body

```json
{
  "name": "Updated Production Key",
  "scopes": ["secrets:read"],
  "rateLimit": {
    "requests": 5000,
    "period": "1h"
  }
}
```

## Rotate API Key

Generate a new API key while keeping the old one active for a transition period.

### Endpoint

```http
POST /v1/security/api-keys/:id/rotate
```

### Request Body

```json
{
  "transitionPeriod": "7d"
}
```

### Response

```json
{
  "oldKey": {
    "id": "key_abc123xyz",
    "expiresAt": "2024-03-22T10:30:00Z",
    "status": "rotating"
  },
  "newKey": {
    "id": "key_new789xyz",
    "apiKey": "vsec_live_NewKeyValue123456",
    "expiresAt": "2025-03-15T00:00:00Z",
    "status": "active"
  }
}
```

## Revoke API Key

Immediately revoke an API key.

### Endpoint

```http
DELETE /v1/security/api-keys/:id
```

### Response

```json
{
  "revoked": true,
  "id": "key_abc123xyz",
  "revokedAt": "2024-03-15T10:30:00Z"
}
```

## List API Keys

List all API keys for your account.

### Endpoint

```http
GET /v1/security/api-keys
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (active, expired, revoked) |
| `limit` | number | Page size (default: 50) |
| `cursor` | string | Pagination cursor |

### Response

```json
{
  "data": [
    {
      "id": "key_abc123",
      "name": "Production API Key",
      "scopes": ["secrets:read", "secrets:write"],
      "expiresAt": "2025-03-15T00:00:00Z",
      "lastUsedAt": "2024-03-20T14:22:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6ImtleV9hYmMxMjMifQ",
    "hasMore": false,
    "totalCount": 3
  }
}
```

## Get API Key Usage

View usage statistics for an API key.

### Endpoint

```http
GET /v1/security/api-keys/:id/usage
```

### Response

```json
{
  "id": "key_abc123xyz",
  "period": {
    "start": "2024-03-01T00:00:00Z",
    "end": "2024-03-31T23:59:59Z"
  },
  "totalRequests": 125847,
  "requestsByDay": [
    {
      "date": "2024-03-15",
      "requests": 4521
    }
  ],
  "requestsByEndpoint": {
    "/secrets": 98234,
    "/api-keys": 15423,
    "/audit-logs": 12190
  },
  "errors": 23,
  "rateLimitHits": 5
}
```

## Available Scopes

### Secrets

- `secrets:read` - Read secrets
- `secrets:write` - Create/update secrets
- `secrets:delete` - Delete secrets
- `secrets:*` - All secret permissions

### API Keys

- `apikeys:read` - Read API keys
- `apikeys:write` - Create/update API keys
- `apikeys:delete` - Revoke API keys
- `apikeys:*` - All API key permissions

### MCP

- `mcp:read` - Read MCP resources
- `mcp:approve` - Approve MCP requests
- `mcp:*` - All MCP permissions

### Audit

- `audit:read` - Read audit logs
- `audit:export` - Export audit logs
- `audit:*` - All audit permissions

### Admin

- `admin:*` - Full administrative access

## Best Practices

### 1. Principle of Least Privilege

Grant only necessary scopes:

```json
{
  "scopes": ["secrets:read"]
}
```

### 2. Regular Rotation

Rotate keys every 90 days:

```bash
# Automate rotation
vsecure api-keys:rotate key_abc123 --transition-period 7d
```

### 3. IP Whitelisting

Restrict access by IP:

```json
{
  "ipWhitelist": ["203.0.113.0/24", "198.51.100.50"]
}
```

### 4. Rate Limiting

Set appropriate limits:

```json
{
  "rateLimit": {
    "requests": 1000,
    "period": "1h"
  }
}
```

### 5. Monitor Usage

Track API key usage:

```bash
vsecure api-keys:usage key_abc123
```

## Next Steps

- [Secrets API](./secrets) - Manage secrets
- [Audit Logs API](./audit-logs) - Track API key usage
- [Security Best Practices](../guides/security-best-practices)
