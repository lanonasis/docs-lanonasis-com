---
sidebar_position: 2
title: Getting Started
description: Quick start guide for v-secure
---

# Getting Started with v-secure

Get up and running with v-secure in just a few minutes. This guide will walk you through installation, authentication, and your first secret management operations.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - For CLI and SDK installation
- **LanOnasis Account** - [Sign up here](https://dashboard.lanonasis.com/signup)
- **API Key** - Generate from your [dashboard](https://dashboard.lanonasis.com/api-keys)

## Step 1: Installation

### CLI Installation

Install the v-secure CLI globally:

```bash
npm install -g @lanonasis/v-secure-cli
```

Verify the installation:

```bash
vsecure --version
```

### SDK Installation

For programmatic access, install the SDK:

```bash
# For Node.js/TypeScript projects
npm install @lanonasis/v-secure-sdk

# For Python projects
pip install lanonasis-vsecure

# For Go projects
go get github.com/lanonasis/vsecure-go
```

## Step 2: Authentication

### Using the CLI

Authenticate with your API key:

```bash
vsecure login
```

You'll be prompted to enter your API key. Alternatively, set it as an environment variable:

```bash
export VSECURE_API_KEY="your-api-key-here"
```

### Using the SDK

```typescript
import { VSecureClient } from '@lanonasis/v-secure-sdk';

const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,
  endpoint: 'https://api.lanonasis.com/v1/security'
});
```

## Step 3: Store Your First Secret

### Using the CLI

```bash
# Store a secret
vsecure secrets:create DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  "postgresql://<user>:<password>@<host>:<port>/<db>" \
  --tags production,database \
  --expires-in 90d

# Output:
# ✓ Secret 'DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
# ID: sec_abc123xyz
# Version: 1
# Tags: production, database
# Expires: 2024-03-15
```

### Using the SDK

```typescript
const secret = await client.secrets.create({
  name: 'DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  value: 'postgresql://<user>:<password>@<host>:<port>/<db>',
  tags: ['production', 'database'],
  expiresIn: '90d'
});

console.log('Secret created:', secret.id);
```

## Step 4: Retrieve a Secret

### Using the CLI

```bash
# Get the latest version
vsecure secrets:get DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

# Get a specific version
vsecure secrets:get DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

# Get as JSON for scripting
vsecure secrets:get DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

### Using the SDK

```typescript
// Get the latest version
const secret = await client.secrets.get('DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
console.log('Value:', secret.value);

// Get a specific version
const oldSecret = await client.secrets.get('DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

## Step 5: Update a Secret

When you need to rotate a secret, v-secure automatically versions it:

### Using the CLI

```bash
vsecure secrets:update DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  "postgresql://<user>:<password>@<host>:<port>/<db>"

# Output:
# ✓ Secret 'DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
# Version: 2
# Previous versions: 1
```

### Using the SDK

```typescript
await client.secrets.update('DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  value: 'postgresql://<user>:<password>@<host>:<port>/<db>'
});

// Retrieve version history
const versions = await client.secrets.listVersions('DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
console.log('Available versions:', versions.map(v => v.version));
```

## Step 6: List Your Secrets

### Using the CLI

```bash
# List all secrets
vsecure secrets:list

# Filter by tags
vsecure secrets:list --tag production

# Search by name
vsecure secrets:list --search DATABASE
```

### Using the SDK

```typescript
// List all secrets
const secrets = await client.secrets.list();

// Filter by tags
const prodSecrets = await client.secrets.list({
  tags: ['production']
});

// Search
const dbSecrets = await client.secrets.list({
  search: 'DATABASE'
});
```

## Step 7: Delete a Secret

:::warning
Deleting a secret is permanent and cannot be undone. Use with caution.
:::

### Using the CLI

```bash
vsecure secrets:delete DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

# With confirmation skip
vsecure secrets:delete DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

### Using the SDK

```typescript
await client.secrets.delete('DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

## Common Operations

### Working with Tags

Tags help organize secrets by environment, team, or purpose:

```bash
# Create with multiple tags
vsecure secrets:create API_KEY "sk_live_..." \
  --tags production,stripe,payment

# List secrets by tag
vsecure secrets:list --tag production --tag stripe

# Update tags
vsecure secrets:update-tags API_KEY \
  --add-tag deprecated \
  --remove-tag production
```

### Setting Expiration

Secrets can automatically expire:

```bash
# Expire in 90 days
vsecure secrets:create TEMP_TOKEN "xyz123" \
  --expires-in 90d

# Expire at specific date
vsecure secrets:create TEMP_TOKEN "xyz123" \
  --expires-at 2024-12-31

# Check expiring secrets
vsecure secrets:list --expiring-soon
```

### Secret Metadata

Add metadata for better organization:

```typescript
await client.secrets.create({
  name: 'STRIPE_KEY',
  value: 'sk_live_...',
  metadata: {
    owner: 'payments-team',
    environment: 'production',
    service: 'billing-api',
    costCenter: 'CC-1234'
  }
});
```

## Next Steps

Now that you're familiar with the basics, explore more advanced features:

### 🔑 API Key Management
Learn how to create and manage API keys for your applications.

[API Key Guide →](./api/api-keys)

### 🤖 MCP Integration
Integrate v-secure with AI tools using the Model Context Protocol.

[MCP Integration →](./guides/mcp-integration)

### 📝 Audit Logs
Review security events and maintain compliance.

[Audit Logs →](./api/audit-logs)

### ⚙️ Advanced Configuration
Configure encryption, backup, and disaster recovery.

[Configuration →](./configuration)

## Best Practices

### 1. Use Environment-Specific Tags
```bash
vsecure secrets:create API_KEY "..." --tags production,api,v2
vsecure secrets:create API_KEY "..." --tags staging,api,v2
```

### 2. Implement Secret Rotation
```typescript
// Rotate secrets regularly
const rotateSecret = async (name: string) => {
  const newValue = generateSecureToken();
  await client.secrets.update(name, { value: newValue });

  // Notify systems of rotation
  await notifyServices(name);
};
```

### 3. Monitor Secret Access
```typescript
// Set up alerts for unusual access
const auditLogs = await client.audit.list({
  resource: 'secrets',
  action: 'accessed',
  since: '24h'
});

if (auditLogs.length > threshold) {
  await sendAlert('Unusual secret access detected');
}
```

### 4. Use Metadata for Organization
```typescript
await client.secrets.create({
  name: 'DB_PASSWORD',
  value: 'secure_password',
  metadata: {
    service: 'user-api',
    team: 'backend',
    contact: 'backend@example.com',
    documentation: 'https://wiki.company.com/db-setup'
  }
});
```

## Troubleshooting

### Authentication Issues

```bash
# Verify your API key
vsecure auth:whoami

# Re-authenticate
vsecure logout
vsecure login
```

### Connection Issues

```bash
# Check service status
vsecure status

# Test connection
vsecure ping
```

### Permission Issues

If you encounter permission errors, verify your API key has the required scopes:

```bash
vsecure auth:scopes
```

Required scopes for basic operations:
- `secrets:read` - Read secrets
- `secrets:write` - Create/update secrets
- `secrets:delete` - Delete secrets

## Getting Help

- **Documentation** - [v-secure docs](https://docs.lanonasis.com/v-secure)
- **API Reference** - [API documentation](./api/overview)
- **Support** - [support.lanonasis.com](https://support.lanonasis.com)
- **Status** - [status.lanonasis.com](https://status.lanonasis.com)

## What's Next?

- [Installation Guide](./installation) - Detailed installation instructions
- [Configuration](./configuration) - Configure v-secure for your environment
- [API Reference](./api/overview) - Complete API documentation
- [Examples](./examples/basic-usage) - Real-world code examples
