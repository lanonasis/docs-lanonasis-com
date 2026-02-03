---
title: v-secure - Enterprise Secret Management
sidebar_label: v-secure
description: Production-ready secret management service with encryption, key rotation, compliance auditing, and access controls
---

**v-secure** is an enterprise-grade secret management platform providing secure storage, automatic key rotation, compliance-ready auditing, and fine-grained access controls for API keys, database credentials, certificates, and sensitive configuration.

## Overview

v-secure replaces manual secret management and environment files with a centralized, encrypted, auditable secret vault:

```
Applications/Services
  ↓
Encrypted Connections (mTLS)
  ↓
v-secure Vault
  ├─ Encryption Engine (AES-256-GCM)
  ├─ Key Rotation Manager
  ├─ Audit Logger (Immutable)
  └─ Access Control (RBAC)
  ↓
Secure Secret Delivery
```

### Core Capabilities

1. **Secret Storage**: Encrypted storage for API keys, credentials, certificates
2. **Key Rotation**: Automatic rotation with zero downtime
3. **Access Control**: RBAC with per-secret permissions
4. **Audit Logging**: Immutable logs for compliance (PCI-DSS, HIPAA, SOX, GDPR)
5. **Compliance**: Built-in compliance checks and reporting
6. **Versioning**: Track secret history with rollback capability

---

## Architecture

### Service Structure

```
v-secure/
├── src/
│   ├── vault/
│   │   ├── encryption.ts       # AES-256-GCM encryption
│   │   ├── storage.ts          # Secure database storage
│   │   └── retrieval.ts        # Decryption on-demand
│   ├── rotation/
│   │   ├── scheduler.ts        # Schedule rotations
│   │   ├── strategies/         # Rotation logic per type
│   │   └── rollback.ts         # Emergency rollback
│   ├── access-control/
│   │   ├── rbac.ts             # Role-based access
│   │   ├── policies.ts         # Permission policies
│   │   └── audit.ts            # Access audit trail
│   ├── compliance/
│   │   ├── validators/         # PCI-DSS, HIPAA, SOX checks
│   │   ├── reporters/          # Compliance reports
│   │   └── encryption-check.ts # Verify encryption standards
│   ├── api/
│   │   ├── secrets.ts          # CRUD endpoints
│   │   ├── admin.ts            # Administration
│   │   └── audit.ts            # Audit log access
│   └── index.ts
├── tests/
├── README.md
└── Dockerfile
```

### Secret Types Supported

| Secret Type              | Rotation   | Validation           | Example          |
| ------------------------ | ---------- | -------------------- | ---------------- |
| **API Key**              | ✅ Yes     | HTTP check           | `sk_live_...`    |
| **Database Credentials** | ✅ Yes     | Connection test      | PostgreSQL creds |
| **JWT Token**            | ✅ Yes     | Signature validation | Auth tokens      |
| **TLS Certificate**      | ✅ Yes     | Expiry check         | `.pem` files     |
| **SSH Key**              | ✅ Yes     | Format validation    | `id_rsa`         |
| **OAuth Token**          | ✅ Yes     | Scope verification   | Bearer tokens    |
| **Configuration**        | ✅ Limited | Type check           | JSON config      |

---

## Key Features

### 1. Encrypted Storage

All secrets encrypted with industry-standard encryption:

```
Secret: "db_password_super_secret"
  ↓
[Encrypt with AES-256-GCM + random IV]
  ↓
Stored as: "{nonce: ..., ciphertext: ..., tag: ...}"
  ↓
[Decrypt only with authorized access + audit log]
```

**Encryption Details**:

- Algorithm: AES-256-GCM (authenticated encryption)
- Key derivation: PBKDF2 with 100,000 iterations
- Random IV: Unique per encryption
- Authentication tag: Prevent tampering
- Key storage: HSM or encrypted vault

### 2. Automatic Key Rotation

Rotate secrets on schedule without downtime:

```bash
# Schedule rotation
v-secure secret rotate \
  --secret-id db_password \
  --rotation-interval 30d \
  --strategy rolling

# What happens:
# 1. Generate new secret
# 2. Test new secret works
# 3. Gradually roll out to services
# 4. Retire old secret after TTL
# 5. Log entire operation
```

**Rotation Strategies**:

- **Rolling**: Gradual rollout (0-100% over N hours)
- **Immediate**: All services cut over at once
- **Canary**: Test with 5%, then 50%, then 100%
- **Blue-Green**: Maintain both versions, switch atomically

### 3. Fine-Grained Access Control

Control who can read, write, rotate each secret:

```json
{
  "secret_id": "db_password",
  "permissions": {
    "backend-team": ["read", "rotate"],
    "devops-team": ["read", "write", "rotate", "delete"],
    "app-instance": ["read"],
    "external-service": ["read", "rotate"]
  },
  "constraints": {
    "ip_whitelist": ["10.0.0.0/8"],
    "require_mfa": true,
    "rate_limit": "100/min"
  }
}
```

### 4. Compliance Auditing

Meet regulatory requirements with comprehensive audit trails:

**Audit Fields**:

```json
{
  "timestamp": "2026-01-15T10:30:00Z",
  "action": "secret_read",
  "secret_id": "db_password",
  "actor": "app_backend_prod",
  "actor_type": "service_account",
  "source_ip": "10.0.0.5",
  "reason": "database_connection",
  "status": "success",
  "compliance_standards": ["PCI-DSS", "SOX"]
}
```

**Compliance Certifications**:

- ✅ PCI-DSS 3.2.1 – Payment card data protection
- ✅ HIPAA – Health information security
- ✅ SOX – Financial data control
- ✅ GDPR – Data privacy requirements

### 5. Secret Versioning

Track history and rollback if needed:

```bash
# List versions
v-secure secret versions --secret-id db_password

# Returns:
# Version 1: 2026-01-01, Status: retired
# Version 2: 2026-01-08, Status: retired
# Version 3: 2026-01-15, Status: active (current)

# Rollback to previous version
v-secure secret rollback --secret-id db_password --version 2
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ or Bun 1.1+
- PostgreSQL 13+ (encrypted storage)
- HSM (recommended for production key storage)

### Installation

```bash
# Install from npm
npm install @lanonasis/v-secure

# Or using Bun
bun add @lanonasis/v-secure
```

### Local Development

```bash
# Clone repository
git clone https://github.com/lanonasis/v-secure.git
cd v-secure

# Install dependencies
bun install

# Configure environment
cp .env.example .env

# Build
bun run build

# Run tests
bun run test

# Start dev server
bun run dev
```

---

## Configuration

### Environment Variables

```bash
# Vault Configuration
V_SECURE_ENCRYPTION_KEY="your-256-bit-key-here"
V_SECURE_ENCRYPTION_ALGORITHM="aes-256-gcm"
V_SECURE_KEY_DERIVATION_ITERATIONS=100000

# Database
V_SECURE_DB_URL="postgresql://user:pass@localhost/v_secure"
V_SECURE_DB_ENCRYPTED=true

# Key Rotation
V_SECURE_ROTATION_ENABLED=true
V_SECURE_ROTATION_CHECK_INTERVAL="1h"
V_SECURE_ROTATION_STRATEGY="rolling"  # rolling, immediate, canary

# Access Control
V_SECURE_REQUIRE_MFA=true
V_SECURE_IP_WHITELIST="10.0.0.0/8,172.16.0.0/12"
V_SECURE_RATE_LIMIT="100:60"  # 100 requests per 60 seconds

# Compliance
V_SECURE_COMPLIANCE_STANDARDS="PCI-DSS,HIPAA,SOX,GDPR"
V_SECURE_AUDIT_LOG_ENCRYPTED=true
V_SECURE_RETENTION_DAYS=2555  # 7 years for compliance

# Logging
V_SECURE_LOG_LEVEL="info"
V_SECURE_LOG_FORMAT="json"
```

### Secret Configuration

```typescript
import { VSecurity } from "@lanonasis/v-secure";

const vault = new VSecurity(config);

// Configure a secret
await vault.configure({
  secretId: "stripe_api_key",
  type: "api_key",
  source: "stripe",
  rotation: {
    enabled: true,
    interval: "30d",
    strategy: "rolling",
  },
  access: {
    "payment-service": ["read"],
    "billing-service": ["read"],
    "admin-team": ["read", "write", "rotate"],
  },
  compliance: ["PCI-DSS"],
});
```

---

## API Reference

### Store a Secret

Securely store a new secret:

```typescript
import { VSecurity } from "@lanonasis/v-secure";

const vault = new VSecurity(config);

const result = await vault.store({
  secretId: "db_password",
  value: "super_secret_password_123",
  type: "database_credential",
  metadata: {
    database: "production_db",
    username: "app_user",
  },
  tags: ["production", "critical"],
});

console.log(result);
// {
//   secretId: 'db_password',
//   version: 1,
//   stored: true,
//   encrypted: true,
//   createdAt: '2026-01-15T10:30:00Z'
// }
```

### Retrieve a Secret

Fetch a secret with authorization check:

```typescript
const secret = await vault.retrieve({
  secretId: "db_password",
  requester: "backend_service",
  reason: "database_connection",
});

console.log(secret);
// {
//   secretId: 'db_password',
//   value: 'super_secret_password_123',
//   version: 1,
//   rotatedAt: '2026-01-15T10:30:00Z',
//   expiresAt: '2026-02-15T10:30:00Z',
//   audit: 'audit_log_entry_123'
// }
```

### Rotate a Secret

Manually trigger rotation:

```typescript
const rotation = await vault.rotate({
  secretId: "api_key",
  strategy: "rolling",
  rolloutDurationHours: 4,
  notifyServices: ["auth-service", "gateway"],
});

console.log(rotation);
// {
//   rotationId: 'rot_123',
//   secretId: 'api_key',
//   oldVersion: 2,
//   newVersion: 3,
//   status: 'in_progress',
//   progress: { rolled_out: 30, total: 100 }
// }
```

### List Audit Trail

View secret access history:

```typescript
const auditTrail = await vault.auditTrail({
  secretId: "db_password",
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  action: "retrieve", // Optional filter
});

console.log(auditTrail);
// {
//   secretId: 'db_password',
//   entries: [
//     {
//       timestamp: '2026-01-15T10:30:00Z',
//       action: 'retrieve',
//       actor: 'backend_service',
//       status: 'success'
//     },
//     ...
//   ]
// }
```

### Export Compliance Report

Generate audit report for compliance review:

```typescript
const report = await vault.complianceReport({
  standard: "PCI-DSS",
  period: "monthly",
  includeSecrets: false, // Keep secrets masked
});

console.log(report);
// {
//   standard: 'PCI-DSS',
//   period: '2026-01-01 to 2026-01-31',
//   totalSecrets: 50,
//   encrypted: 50,
//   rotatedSecrets: 12,
//   accessViolations: 0,
//   status: 'compliant'
// }
```

---

## Common Workflows

### Scenario 1: Secure Database Credentials

```typescript
// Store database password
const dbSecret = await vault.store({
  secretId: "prod_db_password",
  value: process.env.DB_PASSWORD,
  type: "database_credential",
  rotation: { enabled: true, interval: "30d" },
});

// Retrieve in application
const dbPassword = await vault.retrieve({
  secretId: "prod_db_password",
  requester: "backend_app",
});

const db = await connectDB({
  host: "db.prod.internal",
  password: dbPassword.value,
});
```

### Scenario 2: API Key Rotation

```typescript
// Schedule automatic rotation
await vault.configure({
  secretId: "stripe_api_key",
  rotation: {
    enabled: true,
    interval: "90d",
    strategy: "rolling",
    testNewKey: true, // Test before rollout
  },
});

// v-secure will automatically:
// 1. Generate new key from Stripe
// 2. Test the new key
// 3. Gradually roll out (0-100% over 4 hours)
// 4. Archive old key
// 5. Log everything
```

### Scenario 3: Compliance Audit

```typescript
// Generate PCI-DSS compliance report
const auditReport = await vault.complianceReport({
  standard: "PCI-DSS",
  period: "quarterly",
});

// Check results
if (auditReport.status !== "compliant") {
  console.error("Compliance issues found:", auditReport.violations);
  // Alert security team
}

// Download for compliance officer review
await auditReport.export({ format: "pdf" });
```

---

## Performance & Security

### Latency

| Operation       | Latency (p50) | Latency (p99) | Notes                 |
| --------------- | ------------- | ------------- | --------------------- |
| Store Secret    | 20ms          | 100ms         | Includes encryption   |
| Retrieve Secret | 10ms          | 50ms          | Cached results faster |
| Rotate Secret   | 100ms         | 500ms         | Full rotation cycle   |
| Audit Query     | 50ms          | 200ms         | Database lookup       |

### Security Features

- **Encryption**: AES-256-GCM with authenticated encryption
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Access Control**: RBAC with IP whitelisting
- **Audit Logging**: Immutable, encrypted audit trail
- **Rate Limiting**: Prevent brute force attacks
- **MFA**: Optional multi-factor authentication

---

## Troubleshooting

### Issue: "Unauthorized" when retrieving secret

**Solution**: Check access permissions and MFA

```bash
# Verify permissions
v-secure access list --secret-id db_password

# If MFA required, ensure it's set up
v-secure auth mfa setup
```

### Issue: Rotation failing

**Solution**: Verify new secret is valid

```bash
# Check rotation status
v-secure secret rotation-status --secret-id api_key

# If failed, check logs
v-secure logs tail --filter "rotation"

# Rollback if needed
v-secure secret rollback --secret-id api_key --version 2
```

### Issue: Slow secret retrieval

**Solution**: Enable caching

```bash
V_SECURE_CACHE_ENABLED=true
V_SECURE_CACHE_TTL=300
```

---

## Related Services

- **[Onasis-CORE](./onasis-core.md)** – Uses v-secure for credential masking
- **[MCP Core](./mcp-core.md)** – Sensitive content handling
- **[Security & Compliance](../security/)** – Detailed compliance standards

---

## Support & Resources

- **GitHub**: [lanonasis/v-secure](https://github.com/lanonasis/v-secure)
- **Documentation**: [docs.lanonasis.com/v-secure](https://docs.lanonasis.com/v-secure)
- **Issues**: [Report bugs](https://github.com/lanonasis/v-secure/issues)
- **Security**: [security@lanonasis.com](mailto:security@lanonasis.com)

---

**Last Updated**: February 3, 2026  
**Version**: 1.5.0+
