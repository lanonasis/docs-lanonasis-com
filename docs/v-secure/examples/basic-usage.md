---
sidebar_position: 1
title: Basic Usage
description: Basic v-secure usage examples
---

# Basic Usage Examples

Common patterns and examples for using v-secure in your applications.

## Installation

```bash
npm install @lanonasis/v-secure-sdk
```

## Initialization

```typescript
import { VSecureClient } from '@lanonasis/v-secure-sdk';

const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY
});
```

## Creating Secrets

### Simple Secret

```typescript
await client.secrets.create({
  name: 'API_KEY',
  value: 'sk_live_abc123xyz'
});
```

### With Tags and Metadata

```typescript
await client.secrets.create({
  name: 'DATABASE_URL',
  value: 'postgresql://user:pass@host:5432/db',
  tags: ['production', 'database'],
  metadata: {
    owner: 'backend-team',
    service: 'user-api',
    environment: 'production'
  }
});
```

### With Expiration

```typescript
await client.secrets.create({
  name: 'TEMP_TOKEN',
  value: 'xyz123',
  expiresIn: '7d' // Expires in 7 days
});
```

## Reading Secrets

### Single Secret

```typescript
const secret = await client.secrets.get('API_KEY');
console.log(secret.value);
```

### Multiple Secrets

```typescript
const secrets = await client.secrets.batchGet([
  'DATABASE_URL',
  'REDIS_URL',
  'API_KEY'
]);

console.log(secrets.DATABASE_URL);
console.log(secrets.REDIS_URL);
console.log(secrets.API_KEY);
```

### With Error Handling

```typescript
try {
  const secret = await client.secrets.get('API_KEY');
  console.log(secret.value);
} catch (error) {
  if (error.code === 'RESOURCE_NOT_FOUND') {
    console.error('Secret not found');
  } else if (error.code === 'PERMISSION_DENIED') {
    console.error('Access denied');
  } else {
    console.error('Error:', error.message);
  }
}
```

## Updating Secrets

### Update Value

```typescript
await client.secrets.update('API_KEY', {
  value: 'new_api_key_value'
});
```

### Update Tags

```typescript
await client.secrets.update('API_KEY', {
  tags: ['production', 'updated']
});
```

### Update Metadata

```typescript
await client.secrets.update('API_KEY', {
  metadata: {
    lastRotated: new Date().toISOString()
  }
});
```

## Deleting Secrets

```typescript
await client.secrets.delete('TEMP_TOKEN');
```

## Listing Secrets

### All Secrets

```typescript
const secrets = await client.secrets.list();

secrets.data.forEach(secret => {
  console.log(`${secret.name} (v${secret.version})`);
});
```

### Filter by Tags

```typescript
const prodSecrets = await client.secrets.list({
  tags: ['production']
});
```

### Search

```typescript
const dbSecrets = await client.secrets.list({
  search: 'DATABASE'
});
```

## Environment Configuration

### Load Secrets at Startup

```typescript
async function loadEnvironment() {
  const client = new VSecureClient({
    apiKey: process.env.VSECURE_API_KEY
  });

  const secrets = await client.secrets.batchGet([
    'DATABASE_URL',
    'REDIS_URL',
    'STRIPE_KEY',
    'JWT_SECRET'
  ]);

  // Load into environment
  Object.entries(secrets).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Call before app starts
await loadEnvironment();
```

### With Caching

```typescript
class SecretCache {
  private cache = new Map();
  private ttl = 5 * 60 * 1000; // 5 minutes

  constructor(private client: VSecureClient) {}

  async get(name: string): Promise<string> {
    const cached = this.cache.get(name);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.value;
    }

    const secret = await this.client.secrets.get(name);
    this.cache.set(name, {
      value: secret.value,
      timestamp: Date.now()
    });

    return secret.value;
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new SecretCache(client);
const apiKey = await cache.get('API_KEY');
```

## Error Handling

### Graceful Degradation

```typescript
async function getSecret(name: string, fallback?: string) {
  try {
    const secret = await client.secrets.get(name);
    return secret.value;
  } catch (error) {
    if (fallback) {
      console.warn(`Using fallback for ${name}`);
      return fallback;
    }
    throw error;
  }
}

const apiKey = await getSecret('API_KEY', process.env.FALLBACK_API_KEY);
```

### Retry Logic

```typescript
async function getSecretWithRetry(
  name: string,
  maxRetries = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const secret = await client.secrets.get(name);
      return secret.value;
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}
```

## API Key Management

### Create API Key

```typescript
const apiKey = await client.apiKeys.create({
  name: 'Production Key',
  scopes: ['secrets:read', 'secrets:write'],
  expiresIn: '365d'
});

// Store the key securely - it's only shown once
console.log('API Key:', apiKey.apiKey);
```

### List API Keys

```typescript
const keys = await client.apiKeys.list();

keys.data.forEach(key => {
  console.log(`${key.name} - Last used: ${key.lastUsedAt}`);
});
```

### Rotate API Key

```typescript
const rotated = await client.apiKeys.rotate('key_abc123', {
  transitionPeriod: '7d'
});

console.log('New key:', rotated.newKey.apiKey);
console.log('Old key expires:', rotated.oldKey.expiresAt);
```

## Audit Logs

### View Recent Activity

```typescript
const logs = await client.audit.list({
  since: '24h',
  resource: 'secrets'
});

logs.data.forEach(log => {
  console.log(`${log.timestamp}: ${log.action} on ${log.resource.name}`);
});
```

### Export Logs

```typescript
const exportJob = await client.audit.export({
  format: 'json',
  since: '30d',
  filters: {
    resource: 'secrets',
    action: 'accessed'
  }
});

console.log('Export URL:', exportJob.downloadUrl);
```

## TypeScript Types

```typescript
import type { Secret, APIKey, AuditLog } from '@lanonasis/v-secure-sdk';

interface AppConfig {
  database: string;
  redis: string;
  stripe: string;
}

async function loadConfig(): Promise<AppConfig> {
  const secrets = await client.secrets.batchGet([
    'DATABASE_URL',
    'REDIS_URL',
    'STRIPE_KEY'
  ]);

  return {
    database: secrets.DATABASE_URL,
    redis: secrets.REDIS_URL,
    stripe: secrets.STRIPE_KEY
  };
}
```

## Next Steps

- [Express Integration](./express-integration)
- [Next.js Integration](./nextjs-integration)
- [Docker Integration](./docker-integration)
- [API Reference](../api/overview)
