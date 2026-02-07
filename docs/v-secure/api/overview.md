---
sidebar_position: 1
title: API Overview
description: Complete API reference for v-secure
---

# API Overview

The v-secure API provides programmatic access to all security features including secret management, API key lifecycle, MCP integration, and audit logs.

## Base URL

```text
https://api.lanonasis.com/v1/security
```

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.lanonasis.com/v1/security/secrets
```

### API Key Scopes

API keys can have different scopes to limit access:

- `secrets:read` - Read secrets
- `secrets:write` - Create and update secrets
- `secrets:delete` - Delete secrets
- `apikeys:manage` - Manage API keys
- `mcp:access` - Access MCP resources
- `audit:read` - Read audit logs

## Rate Limiting

API requests are rate-limited to protect service availability:

- **Standard tier**: 1,000 requests/hour
- **Pro tier**: 10,000 requests/hour
- **Enterprise tier**: Custom limits

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination using cursor-based pagination:

```bash
GET /secrets?limit=50&cursor=eyJpZCI6IjEyMyJ9
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6IjEyMyJ9",
    "hasMore": true,
    "totalCount": 500
  }
}
```

## Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Secret 'DATABASE_URL' not found",
    "details": {
      "secretName": "DATABASE_URL"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_REQUIRED` | 401 | API key missing or invalid |
| `PERMISSION_DENIED` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Resource does not exist |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Request Format

### Content Type

All POST/PUT/PATCH requests must include `Content-Type: application/json` header.

### Request Example

```bash
curl -X POST https://api.lanonasis.com/v1/security/secrets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DATABASE_URL",
    "value": "postgresql://<user>:<password>@<host>:<port>/<db>",
    "tags": ["production", "database"]
  }'
```

## Response Format

All successful responses return data in JSON format:

```json
{
  "id": "sec_abc123",
  "name": "DATABASE_URL",
  "value": "postgresql://<user>:<password>@<host>:<port>/<db>",
  "version": 1,
  "tags": ["production", "database"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Versioning

The API is versioned via the URL path (`/v1/`). We maintain backwards compatibility within major versions.

## Regions

Specify the region for data residency:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Region: eu-west-1" \
  https://api.lanonasis.com/v1/security/secrets
```

## Idempotency

POST and PUT requests support idempotency using the `Idempotency-Key` header:

```bash
curl -X POST https://api.lanonasis.com/v1/security/secrets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Idempotency-Key: unique-key-123" \
  -H "Content-Type: application/json" \
  -d '{"name": "API_KEY", "value": "..."}'
```

## API Endpoints

### Secrets Management

- [Secrets API](./secrets) - Secret storage and retrieval
  - `POST /secrets` - Create secret
  - `GET /secrets/:name` - Get secret
  - `PUT /secrets/:name` - Update secret
  - `DELETE /secrets/:name` - Delete secret
  - `GET /secrets` - List secrets

### API Keys

- [API Keys API](./api-keys) - API key lifecycle
  - `POST /api-keys` - Create API key
  - `GET /api-keys/:id` - Get API key
  - `PUT /api-keys/:id` - Update API key
  - `DELETE /api-keys/:id` - Revoke API key
  - `POST /api-keys/:id/rotate` - Rotate API key

### MCP Integration

- [MCP API](./mcp) - Model Context Protocol integration
  - `GET /mcp/resources` - List MCP resources
  - `POST /mcp/approve` - Approve MCP request
  - `GET /mcp/audit` - MCP audit logs

### Audit Logs

- [Audit Logs API](./audit-logs) - Security audit trails
  - `GET /audit-logs` - List audit logs
  - `GET /audit-logs/:id` - Get audit log
  - `POST /audit-logs/export` - Export logs

## SDKs

Official SDKs are coming soon for:
- TypeScript/Node.js
- Python
- Go
- Java
- Ruby

For now, use the CLI or make direct API calls as shown in the [Examples](../examples/basic-usage) section.

## Webhooks

Configure webhooks to receive real-time notifications:

```bash
POST /webhooks
{
  "url": "https://your-app.com/webhooks/vsecure",
  "events": ["secret.created", "secret.accessed", "apikey.rotated"],
  "secret": "whsec_..."
}
```

## Testing

### Sandbox Environment

Test API integration using the sandbox:

```
https://api-sandbox.lanonasis.com/v1/security
```

### Test API Keys

Sandbox API keys start with `vsec_test_`:

```bash
export VSECURE_API_KEY=vsec_test_abc123
```

## Examples

### Create a Secret

```bash
curl -X POST https://api.lanonasis.com/v1/security/secrets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "STRIPE_SECRET_KEY",
    "value": "sk_live_...",
    "tags": ["production", "payment"],
    "expiresIn": "90d"
  }'
```

### Retrieve a Secret

```bash
curl https://api.lanonasis.com/v1/security/secrets/STRIPE_SECRET_KEY \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### List Secrets

```bash
curl https://api.lanonasis.com/v1/security/secrets?tags=production \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Support

- **API Status**: [status.lanonasis.com](https://status.lanonasis.com)
- **Documentation**: [docs.lanonasis.com/v-secure](https://docs.lanonasis.com/v-secure)
- **Support**: [support.lanonasis.com](https://support.lanonasis.com)

## Next Steps

- [Secrets API](./secrets) - Secret management endpoints
- [API Keys API](./api-keys) - API key management
- [MCP API](./mcp) - MCP integration
- See the [Examples](../examples/basic-usage) for usage patterns and best practices.
