---
title: Security Service
sidebar_label: Service Overview
---

# LanOnasis Security Service

Enterprise-grade security service for managing secrets, API keys, credentials, and access control with comprehensive compliance features.

## Overview

The Security Service (`apps/onasis-core/services/security`) provides:

- **Secret Management**: Secure storage and retrieval of sensitive credentials
- **API Key Management**: Enterprise-grade API key lifecycle management
- **MCP Integration**: Model Context Protocol integration for AI tool access control
- **Audit Logging**: Comprehensive, tamper-proof audit trails
- **Access Control**: Role-based access control (RBAC) and fine-grained permissions
- **Encryption**: AES-256-GCM encryption with key rotation support
- **Compliance**: Built-in compliance features for SOC 2, ISO 27001, GDPR

## Architecture

```
security-service/
├── services/
│   ├── secretService.ts       # Core secret management
│   └── apiKeyService.ts       # API key lifecycle management
├── middleware/
│   └── auth.ts                # Authentication middleware
├── database/
│   └── schema.sql             # Database schema
├── types/
│   └── auth.ts                # Type definitions
└── examples/
    └── basic-usage.ts         # Usage examples
```

## Installation

### As a Standalone Service

```bash
cd apps/onasis-core/services/security

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
bun run migrate

# Start the service
bun run start
```

### As a Module

```typescript
import { SecretService, ApiKeyService } from '@lanonasis/onasis-core/services/security';

const secretService = new SecretService();
const apiKeyService = new ApiKeyService();
```

## Features

### 1. Secret Management

- **Secure Storage**: AES-256-GCM encryption with PBKDF2 key derivation
- **Version Control**: Complete version history with rollback capability
- **Expiration**: Automatic expiration and notification
- **Sharing**: Secure secret sharing with time-limited access
- **Tagging**: Organize secrets with tags and metadata
- **Multi-Environment**: Separate secrets for dev, staging, production

### 2. API Key Management

- **Lifecycle Management**: Create, rotate, revoke, and monitor API keys
- **Access Levels**: Public, authenticated, team, admin, enterprise
- **Key Types**: Support for various key types (API keys, OAuth tokens, certificates, SSH keys)
- **Usage Analytics**: Track usage patterns and detect anomalies
- **Rotation Policies**: Automatic key rotation with configurable intervals
- **Project Organization**: Organize keys by projects and teams

### 3. MCP Integration

- **Tool Registration**: Register AI tools with specific permissions
- **Access Requests**: Request-approval workflow for sensitive operations
- **Session Management**: Time-limited sessions with automatic expiration
- **Proxy Tokens**: Temporary tokens that map to actual secrets
- **Risk Assessment**: Automatic risk level assessment for tool access

### 4. Security Features

- **Encryption**: AES-256-GCM with authenticated encryption (via `@lanonasis/security-sdk`)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Audit Logging**: Immutable, tamper-proof audit trails with HMAC signatures
- **Row-Level Security**: PostgreSQL RLS policies for data isolation
- **MFA Support**: Multi-factor authentication for sensitive operations
- **Rate Limiting**: Configurable rate limits per user/service account
- **IP Whitelisting**: Restrict access by IP address

## API Reference

### Secret Management

#### Store Secret

```typescript
await secretService.storeSecret(
  'DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  'postgresql://<user>:<password>@<host>:<port>/<db>',
  {
    metadata: { description: 'Production database' },
    tags: ['database', 'production'],
    expiresAt: '2024-12-31T23:59:59Z'
  },
  userId
);
```

#### Retrieve Secret

```typescript
const secret = await secretService.getSecret('DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
console.log(secret.value); // Decrypted value
```

#### List Secrets

```typescript
const secrets = await secretService.listSecrets(userId, {
  tags: ['production'],
  environment: 'production'
});
```

### API Key Management

#### Create API Key

```typescript
const apiKey = await apiKeyService.createApiKey({
  name: 'Production API Key',
  value: 'sk_live_...',
  keyType: 'api_key',
  environment: 'production',
  projectId: 'project-uuid',
  rotationFrequency: 90
}, userId);
```

#### List API Keys

```typescript
const keys = await apiKeyService.getApiKeys(organizationId, projectId);
```

#### Rotate API Key

```typescript
await apiKeyService.rotateApiKey(keyId, userId);
```

### MCP Integration

#### Register MCP Tool

```typescript
const tool = await apiKeyService.registerMCPTool({
  toolId: 'claude-code-assistant',
  toolName: 'Claude Code Assistant',
  organizationId: 'org-uuid',
  permissions: {
    keys: ['GITHUB_TOKEN', 'AWS_ACCESS_KEY'],
    environments: ['development', 'staging'],
    maxConcurrentSessions: 3,
    maxSessionDuration: 900
  },
  autoApprove: false,
  riskLevel: 'medium'
}, userId);
```

#### Create Access Request

```typescript
const requestId = await apiKeyService.createMCPAccessRequest({
  toolId: 'claude-code-assistant',
  organizationId: 'org-uuid',
  keyNames: ['GITHUB_TOKEN'],
  environment: 'development',
  justification: 'Need to access GitHub API for code review',
  estimatedDuration: 600
});
```

## Security Standards Compliance

### OWASP Top 10 (2023)
- ✅ A01:2021 – Broken Access Control
- ✅ A02:2021 – Cryptographic Failures
- ✅ A03:2021 – Injection
- ✅ A04:2021 – Insecure Design
- ✅ A07:2021 – Identification and Authentication Failures
- ✅ A09:2021 – Security Logging and Monitoring Failures

### NIST Cybersecurity Framework
- ✅ Identify, Protect, Detect, Respond, Recover

### SOC 2 Type II
- ✅ Security, Availability, Processing Integrity, Confidentiality, Privacy

### ISO 27001:2022
- ✅ Access control, Cryptographic controls, Audit logging, Data encryption

### GDPR Compliance
- ✅ Security of processing, Records of processing, Right to erasure

## Best Practices

1. **Secret Management**
   - Never commit secrets to version control
   - Use environment-specific secrets
   - Rotate secrets regularly (90 days)
   - Enable expiration for temporary secrets

2. **API Key Management**
   - Use least privilege principle
   - Enable automatic rotation
   - Monitor usage patterns
   - Revoke unused keys immediately

3. **Access Control**
   - Implement MFA for sensitive operations
   - Use RBAC to manage permissions
   - Review access logs regularly
   - Implement IP whitelisting for production

4. **Encryption**
   - Use strong encryption keys (256-bit minimum)
   - Rotate encryption keys periodically
   - Store keys securely (use KMS or HSM)
   - Never log decrypted values

## Related Documentation

- [Security SDK](./sdk.md) - Encryption SDK reference
- [API Overview](./api/overview.md) - REST API endpoints
- [Installation](./installation.md) - Installation guide
- [Configuration](./configuration.md) - Configuration options

