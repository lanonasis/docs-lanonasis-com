---
sidebar_position: 1
title: Secret Management
description: Best practices for managing secrets with v-secure
---

# Secret Management Guide

Learn how to effectively manage secrets using v-secure's enterprise-grade features.

## Overview

Proper secret management is critical for security. This guide covers best practices for storing, accessing, and rotating secrets.

## Creating Secrets

### Basic Secret Creation

```bash
vsecure secrets:create API_KEY "sk_live_..." \
  --tags production,api
```

### With Metadata

```bash
vsecure secrets:create DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  --tags production,database \
  --metadata owner=backend-team \
  --metadata service=user-api
```

### With Expiration

```bash
vsecure secrets:create TEMP_TOKEN "xyz123" \
  --expires-in 30d
```

## Organizing Secrets

### Use Tags Effectively

Tag secrets by:

- **Environment**: `production`, `staging`, `development`
- **Service**: `api`, `database`, `cache`
- **Team**: `backend`, `frontend`, `devops`
- **Type**: `password`, `apikey`, `certificate`

```bash
vsecure secrets:create DB_PASSWORD "secure123" \
  --tags production,database,backend,password
```

### Naming Conventions

Follow a consistent naming pattern:

```text
{SERVICE}_{ENVIRONMENT}_{TYPE}
```

Examples:

- `USER_API_PRODUCTION_DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[db]`
- `PAYMENT_SERVICE_STAGING_STRIPE_KEY`
- `AUTH_SERVICE_PRODUCTION_JWT_SECRET=REDACTED_JWT_SECRET`

## Secret Rotation

### Manual Rotation

```bash
# Update secret (creates new version)
vsecure secrets:update API_KEY "new_key_value"

# List versions
vsecure secrets:versions API_KEY

# Rollback if needed
vsecure secrets:rollback API_KEY --version 2
```

### Automatic Rotation

Configure rotation policy:

```typescript
await client.secrets.create({
  name: "API_KEY",
  value: "initial_value",
  rotationPolicy: {
    enabled: true,
    period: "30d",
    notifyBefore: "7d",
  },
});
```

## Access Control

### Role-Based Access

Define who can access secrets:

```json
{
  "secrets": {
    "production/*": {
      "read": ["engineers", "devops"],
      "write": ["devops"],
      "delete": ["admins"]
    }
  }
}
```

### Time-Limited Access

Grant temporary access:

```bash
vsecure secrets:grant-access DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  --user john@example.com \
  --duration 1h
```

## Version Control

### Viewing History

```bash
# List all versions
vsecure secrets:versions DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

# Get specific version
vsecure secrets:get DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

# Compare versions
vsecure secrets:diff DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

### Rollback

```bash
# Rollback to previous version
vsecure secrets:rollback DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

# Rollback to specific version
vsecure secrets:rollback DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

## Best Practices

### 1. Never Hardcode Secrets

❌ **Bad**:

```typescript
const apiKey = process.env.STRIPE_API_KEY; // ❌ Never hardcode
```

✅ **Good**:

```typescript
import { VSecureClient } from "@lanonasis/v-secure-sdk";

const client = new VSecureClient();
const apiKey = await client.secrets.get("API_KEY");
```

### 2. Use Environment-Specific Secrets

```bash
# Development
vsecure secrets:create API_KEY "dev_key" --tags development

# Production
vsecure secrets:create API_KEY "prod_key" --tags production
```

### 3. Implement Rotation

```bash
# Set expiration on all sensitive secrets
vsecure secrets:update STRIPE_KEY --expires-in 90d
```

### 4. Monitor Access

```bash
# Review who accessed secrets
vsecure audit:logs --resource secrets --action accessed
```

### 5. Use Metadata

```bash
vsecure secrets:create API_KEY "..." \
  --metadata owner=john@example.com \
  --metadata purpose="Payment processing" \
  --metadata documentation=https://wiki.company.com/api
```

## Integration Patterns

### Application Startup

```typescript
import { VSecureClient } from '@lanonasis/v-secure-sdk';

async function loadSecrets() {
  const client = new VSecureClient();

  const secrets = await client.secrets.batchGet([
    'DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
    'REDIS_URL',
    'API_KEY'
  ]);

  process.env.DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  process.env.REDIS_URL = secrets.REDIS_URL;
  process.env.API_KEY = secrets.API_KEY;
}

await loadSecrets();
```

### Dynamic Secret Loading

```typescript
class SecretManager {
  private cache = new Map();
  private ttl = 300000; // 5 minutes

  async getSecret(name: string): Promise<string> {
    const cached = this.cache.get(name);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.value;
    }

    const secret = await client.secrets.get(name);
    this.cache.set(name, {
      value: secret.value,
      timestamp: Date.now(),
    });

    return secret.value;
  }
}
```

## Next Steps

- [API Key Management](../api/api-keys)
- [MCP Integration](./mcp-integration)
- [Compliance Overview](../compliance/overview)
