---
title: Onasis-CORE - Privacy Infrastructure Platform
sidebar_label: Onasis-CORE
description: Privacy-first infrastructure services platform with vendor identity masking and client anonymization
---

**Onasis-CORE** is a privacy-protecting infrastructure platform that provides secure, anonymous bridges between vendors and clients. Built for sub-selling services while maintaining complete privacy and anonymity for all parties.

## Overview

Onasis-CORE enables businesses to integrate third-party vendor services while maintaining:

- **Vendor Privacy**: Hide vendor identity from clients
- **Client Anonymity**: Obscure client details from vendors
- **Transparent Billing**: Track usage while protecting financial identities
- **Compliance**: GDPR, HIPAA, SOX-ready data masking

### Architecture Pattern

```
Client (Brand: VortexAI)
  ↓ (Anonymous Request)
Onasis-CORE (Anonymization Layer)
  ↓ (Masked Request)
Vendor APIs
  ↓ (Vendor Response)
Onasis-CORE (Re-anonymization)
  ↓ (Branded Response)
Client
```

---

## Core Services

### 1. API Gateway (`/api-gateway`)

Privacy-protecting API proxy for vendor service integration:

**Features**:

- Request anonymization (strip PII, add request IDs)
- Response re-identification (restore context)
- Vendor identity masking (hide backend URLs)
- Client anonymization (generate unique IDs per vendor)
- Rate limiting and quota enforcement
- Request/response logging (encrypted)

**Example Flow**:

```
Client Request:
POST /api/users/profile (with user_id=u_12345, auth_token=xxx)
  ↓
Anonymized by API Gateway:
POST /vendor-api/users/profile (with anonymous_id=a_xyz789, vendor_token=yyy)
  ↓
Vendor Response:
{ "user_id": "a_xyz789", "email": "user@...", "status": "active" }
  ↓
Re-identified by API Gateway:
{ "user_id": "u_12345", "email": "[MASKED]", "status": "active" }
  ↓
Client Response Returned
```

### 2. Data Masking (`/data-masking`)

Personal data anonymization and protection services:

**Masking Strategies**:

- **Hashing**: Deterministic masking (salt-based)
- **Tokenization**: Replace with tokens, store mapping securely
- **Encryption**: Reversible encryption with key rotation
- **Redaction**: Complete removal (`[MASKED]`)
- **Pseudo-anonymization**: Replace with synthetic data

**Maskable Data Types**:

- Email addresses → `[email_masked]` or tokenized
- Phone numbers → `+1 (***) ***-9876`
- Names → `[NAME_MASKED]`
- Credit card numbers → `****-****-****-9876`
- Social Security Numbers → `***-**-9876`
- IP addresses → `192.168.0.0/24` (subnet)
- Account numbers → `acc_[tokenized]`

**Configuration Example**:

```json
{
  "masking_rules": {
    "email": { "strategy": "tokenize", "preserve_domain": false },
    "phone": { "strategy": "redact", "preserve_country": true },
    "credit_card": { "strategy": "partial_hash", "preserve_last_4": true },
    "name": { "strategy": "redact" },
    "address": { "strategy": "pseudo_anonymize", "precision": "city" }
  }
}
```

### 3. Billing Bridge (`/billing-bridge`)

Anonymous billing tracking without exposing client/vendor identities:

**Capabilities**:

- Track usage by anonymous IDs
- Generate anonymous invoices
- Reconcile cross-vendor billing
- Handle refunds and adjustments
- Support multiple billing models (per-request, per-byte, subscription)

**Example**:

```
Vendor A calls tracked as:
- Anonymous ID: anon_abc123
- Timestamp: 2026-01-15T10:30:00Z
- Operation: "query"
- Cost: $0.05
  ↓
Never reveals client identity or vendor relationship to either party
```

### 4. Compliance Manager (`/compliance`)

Ensure all operations meet regulatory requirements:

**Compliance Features**:

- **GDPR Compliance**: Right to erasure, data portability, consent tracking
- **HIPAA Compliance**: PHI protection, audit logging, access controls
- **SOX Compliance**: Financial data masking, retention policies
- **PCI-DSS Compliance**: Payment card data protection
- **Data Retention**: Automatic deletion based on policies

**Audit Trail**:

```
Every masked/anonymized operation logged immutably:
{
  "timestamp": "2026-01-15T10:30:00Z",
  "operation": "mask_email",
  "data_type": "email",
  "masking_strategy": "tokenize",
  "user_id": "admin_123",
  "reason": "vendor_integration",
  "compliance_standard": "GDPR"
}
```

---

## Architecture

### Service Structure

```
onasis-core/
├── services/
│   ├── api-gateway/
│   │   ├── middleware/         # Anonymization middleware
│   │   ├── routes/             # Vendor-specific routes
│   │   ├── cache.ts            # Request/response caching
│   │   └── vendor-config.ts    # Vendor integration config
│   ├── data-masking/
│   │   ├── strategies/         # Masking algorithms
│   │   ├── rules-engine.ts     # Apply masking rules
│   │   └── key-manager.ts      # Token key management
│   ├── billing-bridge/
│   │   ├── usage-tracker.ts    # Track anonymous usage
│   │   ├── invoice-generator.ts # Generate bills
│   │   └── reconciliation.ts   # Cross-vendor reconciliation
│   └── compliance/
│       ├── validators/         # GDPR, HIPAA, SOX checks
│       ├── audit-logger.ts     # Immutable audit trail
│       └── retention-policy.ts # Automatic data cleanup
├── types/
│   ├── vendor.types.ts         # Vendor configuration
│   ├── masking.types.ts        # Masking rule definitions
│   └── compliance.types.ts     # Compliance standards
├── api/
│   ├── gateway.ts              # API Gateway endpoints
│   ├── masking.ts              # Masking endpoints
│   └── compliance.ts           # Compliance endpoints
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ or Bun 1.1+
- PostgreSQL 13+ (for audit logging)
- Redis (for caching)
- Encryption keys stored in secure vault

### Installation

```bash
# Install from npm
npm install @lanonasis/onasis-core

# Or using Bun
bun add @lanonasis/onasis-core
```

### Local Development

```bash
# Clone repository
git clone https://github.com/lanonasis/onasis-core.git
cd onasis-core

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your settings

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
# API Gateway
ONASIS_GATEWAY_PORT=3000
ONASIS_GATEWAY_TIMEOUT=30000
ONASIS_ENABLE_CACHING=true
ONASIS_CACHE_TTL=300

# Data Masking
ONASIS_MASKING_STRATEGY=tokenize  # tokenize, hash, encrypt, redact
ONASIS_ENCRYPTION_KEY_ROTATION=86400  # Rotate keys daily
ONASIS_PRESERVE_METADATA=true

# Billing
ONASIS_BILLING_ENABLED=true
ONASIS_INVOICE_FREQUENCY=monthly
ONASIS_RECONCILIATION_WINDOW=7

# Compliance
ONASIS_COMPLIANCE_STANDARDS=GDPR,HIPAA,SOX,PCI-DSS
ONASIS_AUDIT_LOG_ENCRYPTED=true
ONASIS_RETENTION_POLICY=GDPR  # Delete after 1 year

# Logging
ONASIS_LOG_LEVEL=info
ONASIS_AUDIT_LOG_DB=postgresql://...
```

### Vendor Configuration

```typescript
import { VendorConfig } from "@lanonasis/onasis-core";

export const vendors: VendorConfig[] = [
  {
    name: "stripe",
    apiUrl: "https://api.stripe.com",
    authMethod: "api_key",
    masking: {
      requestFields: ["customer_id", "email"],
      responseFields: ["card_number", "customer_id"],
      strategy: "tokenize",
    },
    rateLimit: {
      requestsPerSecond: 100,
      burst: 1000,
    },
    compliance: ["PCI-DSS"],
  },
  {
    name: "twilio",
    apiUrl: "https://api.twilio.com",
    authMethod: "basic_auth",
    masking: {
      requestFields: ["to_number", "from_number"],
      responseFields: ["phone_number"],
      strategy: "redact",
    },
    compliance: ["GDPR", "HIPAA"],
  },
];
```

---

## API Reference

### Mask Data

Anonymize sensitive data:

```typescript
import { Onasis } from "@lanonasis/onasis-core";

const onasis = new Onasis(config);

const masked = await onasis.mask({
  data: {
    email: "alice@example.com",
    phone: "+1-555-123-4567",
    name: "Alice Smith",
  },
  rules: {
    email: { strategy: "tokenize" },
    phone: { strategy: "redact", preserveCountry: true },
    name: { strategy: "redact" },
  },
  compliance: "GDPR",
});

console.log(masked);
// {
//   email: 'token_abc123def456',
//   phone: '+1 (***) ***-4567',
//   name: '[MASKED]',
//   audit_id: 'audit_xyz789'
// }
```

### Unmask Data (Internal Only)

Retrieve original data using audit ID (admin-only):

```typescript
const unmasked = await onasis.unmask({
  auditId: "audit_xyz789",
  adminToken: process.env.ADMIN_TOKEN,
  reason: "customer_support",
});

console.log(unmasked);
// {
//   email: 'alice@example.com',
//   phone: '+1-555-123-4567',
//   name: 'Alice Smith',
//   unmask_audit: 'audit_unm_123'
// }
```

### Route Request Through Gateway

Anonymize and route request to vendor:

```typescript
const response = await onasis.gateway.route({
  vendor: "stripe",
  method: "POST",
  path: "/v1/customers",
  body: {
    email: "alice@example.com",
    name: "Alice Smith",
  },
  clientId: "client_123",
});

console.log(response);
// {
//   statusCode: 200,
//   body: {
//     id: 'token_cust_xyz789',  // Tokenized customer ID
//     email: '[MASKED]',
//     name: '[MASKED]'
//   }
// }
```

### Track Usage Anonymously

Log usage without exposing identities:

```typescript
await onasis.billing.trackUsage({
  vendorName: "stripe",
  operation: "create_customer",
  clientAnonId: "anon_abc123",
  vendorAnonId: "vendor_xyz789",
  cost: 0.05,
  timestamp: new Date(),
});
```

---

## Common Workflows

### Scenario 1: Integrate Stripe While Hiding Payment Details

```typescript
// Client calls Stripe through Onasis-CORE
const payment = await onasis.gateway.route({
  vendor: "stripe",
  method: "POST",
  path: "/v1/charges",
  body: {
    amount: 9999, // $99.99
    currency: "usd",
    customer_id: "cus_alice_123", // Client's customer ID
    metadata: { order_id: "ord_456" },
  },
  clientId: "client_main",
});

// Onasis-CORE masks and routes:
// - Replaces customer_id with tokenized version
// - Logs transaction with anonymous IDs
// - Returns sanitized response
// - Stripe never sees client's real customer ID
// - Client never sees Stripe's actual customer ID
```

### Scenario 2: GDPR Compliance – Right to Erasure

```typescript
// User requests data deletion
await onasis.compliance.deleteUserData({
  userId: "user_alice_123",
  reason: "user_request",
  requireReason: true,
  deleteAcrossVendors: true, // Remove from all vendors
});

// Onasis-CORE will:
// 1. Find all anonymous references for this user
// 2. Delete masked data from all vendors
// 3. Invalidate all tokens
// 4. Log deletion in audit trail
// 5. Confirm deletion to user
```

### Scenario 3: Audit Trail for Compliance Review

```typescript
// Security team reviews usage
const auditTrail = await onasis.compliance.getAuditTrail({
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  compliance: "SOX",
  includeUnmasked: false, // Keep data masked in audit
});

// Returns:
// {
//   operations: [
//     {
//       timestamp: '2026-01-15T10:30:00Z',
//       operation: 'mask_email',
//       vendor: 'stripe',
//       result: 'success',
//       compliance_checks: ['PCI-DSS': ✓, 'SOX': ✓]
//     },
//     ...
//   ]
// }
```

---

## Performance & Scalability

### Latency

| Operation         | Latency (p50) | Latency (p99) | Notes                       |
| ----------------- | ------------- | ------------- | --------------------------- |
| Anonymize Request | 5ms           | 20ms          | Cached masks speed this up  |
| Route to Vendor   | 50ms          | 200ms         | Includes vendor API latency |
| Track Usage       | 10ms          | 50ms          | Async logging               |
| Mask Response     | 15ms          | 75ms          | Before returning to client  |

### Throughput

- **Requests/second per instance**: 10,000+
- **Masked operations/second**: 5,000+
- **Audit log entries/second**: 50,000+

---

## Troubleshooting

### Issue: Masked data inconsistent across requests

**Solution**: Enable caching and ensure token persistence

```bash
ONASIS_ENABLE_CACHING=true
ONASIS_CACHE_TTL=3600
```

### Issue: Vendor API rejecting anonymized requests

**Solution**: Check vendor configuration and masking rules

```typescript
// Verify masking rules for vendor
const config = vendors.find((v) => v.name === "stripe");
console.log(config.masking);

// Adjust if needed
config.masking.responseFields.push("card_number");
```

### Issue: Compliance audit reports incomplete

**Solution**: Verify audit logging is enabled and encrypted

```bash
ONASIS_AUDIT_LOG_ENCRYPTED=true
ONASIS_AUDIT_LOG_DB="postgresql://..."
```

---

## Related Services

- **[Onasis Index](./lanonasis-index.md)** – Platform discovery and service marketplace
- **[v-secure](./v-secure.md)** – Secret management and encryption keys
- **[MCP Core](./mcp-core.md)** – Content preprocessing for privacy-sensitive data
- **[Security & Compliance](../security/)** – Detailed compliance standards

---

## Support & Resources

- **GitHub**: [lanonasis/onasis-core](https://github.com/lanonasis/onasis-core)
- **Issues**: [Report bugs](https://github.com/lanonasis/onasis-core/issues)
- **Email**: [privacy@lanonasis.com](mailto:privacy@lanonasis.com)

---

**Last Updated**: February 3, 2026  
**Version**: 2.1.0+
