---
sidebar_position: 2
title: Secrets API
description: Secret management API endpoints
---

# Secrets API

Manage encrypted secrets with version control, expiration, and tag-based organization.

## Create Secret

Create a new secret or update an existing one.

### Endpoint

```http
POST /v1/security/secrets
```

### Request Body

```json
{
  "name": "DATABASE_URL",
  "value": "postgresql://user:pass@host:5432/db",
  "tags": ["production", "database"],
  "metadata": {
    "owner": "backend-team",
    "environment": "production"
  },
  "expiresIn": "90d",
  "rotationPolicy": {
    "enabled": true,
    "period": "30d"
  }
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Secret name (unique identifier) |
| `value` | string | Yes | Secret value (will be encrypted) |
| `tags` | string[] | No | Tags for organization |
| `metadata` | object | No | Custom metadata |
| `expiresIn` | string | No | Expiration duration (e.g., "90d", "24h") |
| `expiresAt` | string | No | Expiration timestamp (ISO 8601) |
| `rotationPolicy` | object | No | Automatic rotation configuration |

### Response

```json
{
  "id": "sec_abc123xyz",
  "name": "DATABASE_URL",
  "version": 1,
  "tags": ["production", "database"],
  "metadata": {
    "owner": "backend-team",
    "environment": "production"
  },
  "expiresAt": "2024-04-15T00:00:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Example

```bash
curl -X POST https://api.lanonasis.com/v1/security/secrets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DATABASE_URL",
    "value": "postgresql://user:pass@host:5432/db",
    "tags": ["production", "database"],
    "expiresIn": "90d"
  }'
```

## Get Secret

Retrieve a secret by name.

### Endpoint

```http
GET /v1/security/secrets/:name
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Secret name (path parameter) |
| `version` | number | No | Specific version (query parameter) |
| `includeMetadata` | boolean | No | Include metadata in response |

### Response

```json
{
  "id": "sec_abc123xyz",
  "name": "DATABASE_URL",
  "value": "postgresql://user:pass@host:5432/db",
  "version": 3,
  "tags": ["production", "database"],
  "metadata": {
    "owner": "backend-team",
    "environment": "production"
  },
  "expiresAt": "2024-04-15T00:00:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-10T14:20:00Z",
  "accessedAt": "2024-03-15T10:30:00Z"
}
```

### Example

```bash
# Get latest version
curl https://api.lanonasis.com/v1/security/secrets/DATABASE_URL \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get specific version
curl https://api.lanonasis.com/v1/security/secrets/DATABASE_URL?version=2 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Update Secret

Update an existing secret (creates a new version).

### Endpoint

```http
PUT /v1/security/secrets/:name
```

### Request Body

```json
{
  "value": "postgresql://user:newpass@host:5432/db",
  "tags": ["production", "database", "updated"],
  "expiresIn": "90d"
}
```

### Response

```json
{
  "id": "sec_abc123xyz",
  "name": "DATABASE_URL",
  "version": 4,
  "previousVersion": 3,
  "tags": ["production", "database", "updated"],
  "updatedAt": "2024-03-15T10:30:00Z"
}
```

### Example

```bash
curl -X PUT https://api.lanonasis.com/v1/security/secrets/DATABASE_URL \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "postgresql://user:newpass@host:5432/db"
  }'
```

## Delete Secret

Delete a secret and all its versions.

### Endpoint

```http
DELETE /v1/security/secrets/:name
```

### Response

```json
{
  "deleted": true,
  "name": "DATABASE_URL",
  "deletedVersions": 4,
  "deletedAt": "2024-03-15T10:30:00Z"
}
```

### Example

```bash
curl -X DELETE https://api.lanonasis.com/v1/security/secrets/DATABASE_URL \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## List Secrets

List all secrets with optional filtering.

### Endpoint

```http
GET /v1/security/secrets
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `tags` | string | Filter by tags (comma-separated) |
| `search` | string | Search in secret names |
| `limit` | number | Page size (default: 50, max: 100) |
| `cursor` | string | Pagination cursor |
| `includeExpired` | boolean | Include expired secrets |

### Response

```json
{
  "data": [
    {
      "id": "sec_abc123",
      "name": "DATABASE_URL",
      "version": 3,
      "tags": ["production", "database"],
      "expiresAt": "2024-04-15T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-03-10T14:20:00Z"
    },
    {
      "id": "sec_def456",
      "name": "API_KEY",
      "version": 1,
      "tags": ["production", "api"],
      "expiresAt": null,
      "createdAt": "2024-02-01T09:15:00Z",
      "updatedAt": "2024-02-01T09:15:00Z"
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6InNlY19kZWY0NTYifQ",
    "hasMore": true,
    "totalCount": 127
  }
}
```

### Example

```bash
# List all secrets
curl https://api.lanonasis.com/v1/security/secrets \
  -H "Authorization: Bearer YOUR_API_KEY"

# Filter by tags
curl https://api.lanonasis.com/v1/security/secrets?tags=production,database \
  -H "Authorization: Bearer YOUR_API_KEY"

# Search
curl https://api.lanonasis.com/v1/security/secrets?search=DATABASE \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## List Secret Versions

Get all versions of a specific secret.

### Endpoint

```http
GET /v1/security/secrets/:name/versions
```

### Response

```json
{
  "name": "DATABASE_URL",
  "versions": [
    {
      "version": 3,
      "createdAt": "2024-03-10T14:20:00Z",
      "createdBy": "user_abc123"
    },
    {
      "version": 2,
      "createdAt": "2024-02-15T11:10:00Z",
      "createdBy": "user_abc123"
    },
    {
      "version": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "createdBy": "user_xyz789"
    }
  ]
}
```

## Batch Operations

Perform operations on multiple secrets at once.

### Batch Get

```http
POST /v1/security/secrets/batch/get
```

```json
{
  "names": ["DATABASE_URL", "API_KEY", "STRIPE_KEY"]
}
```

### Batch Create/Update

```http
POST /v1/security/secrets/batch/upsert
```

```json
{
  "secrets": [
    {
      "name": "SECRET_1",
      "value": "value1",
      "tags": ["production"]
    },
    {
      "name": "SECRET_2",
      "value": "value2",
      "tags": ["staging"]
    }
  ]
}
```

## Export Secrets

Export secrets for backup or migration.

### Endpoint

```http
POST /v1/security/secrets/export
```

### Request Body

```json
{
  "format": "json",
  "encrypt": true,
  "password": "your-encryption-password",
  "tags": ["production"]
}
```

### Response

Returns encrypted backup file.

## Import Secrets

Import secrets from a backup.

### Endpoint

```http
POST /v1/security/secrets/import
```

### Request Body

```json
{
  "format": "json",
  "data": "encrypted-backup-data",
  "password": "your-encryption-password",
  "overwrite": false
}
```

## Webhooks

Subscribe to secret events:

- `secret.created` - Secret created
- `secret.accessed` - Secret accessed
- `secret.updated` - Secret updated
- `secret.deleted` - Secret deleted
- `secret.expired` - Secret expired

## Best Practices

1. **Use Tags** - Organize secrets by environment, service, or team
2. **Set Expiration** - Automatically rotate sensitive secrets
3. **Version Control** - Keep track of secret changes
4. **Metadata** - Add context for better organization
5. **Regular Rotation** - Implement automatic rotation policies

## Next Steps

- [API Keys API](./api-keys) - Manage API keys
- [Audit Logs API](./audit-logs) - Track secret access
- [SDK Documentation](../sdks/overview) - Use official SDKs
