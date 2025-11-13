---
sidebar_position: 5
title: Audit Logs API
description: Security audit trail endpoints
---

# Audit Logs API

Immutable, HMAC-signed audit logs for compliance and security monitoring.

## Overview

v-secure provides comprehensive audit logging for:

- **Secret Access** - Track all secret reads, writes, and deletions
- **API Key Operations** - Monitor API key creation, rotation, and usage
- **MCP Operations** - Log all AI tool access and approvals
- **Authentication Events** - Track login attempts and API key usage
- **Configuration Changes** - Record security configuration modifications

All audit logs are:
- **Immutable** - Cannot be modified after creation
- **HMAC-Signed** - Cryptographically verified for tampering
- **Timestamped** - Precise event timing
- **Retention Compliant** - Configurable retention periods

## List Audit Logs

Retrieve audit logs with filtering and pagination.

### Endpoint

```http
GET /v1/security/audit-logs
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | string | Filter by resource type (secrets, apikeys, mcp) |
| `action` | string | Filter by action (created, accessed, updated, deleted) |
| `actor` | string | Filter by actor (user or API key) |
| `since` | string | Start timestamp (ISO 8601 or relative like "24h") |
| `until` | string | End timestamp (ISO 8601) |
| `limit` | number | Page size (default: 50, max: 1000) |
| `cursor` | string | Pagination cursor |

### Response

```json
{
  "data": [
    {
      "id": "log_abc123xyz",
      "timestamp": "2024-03-15T10:30:00.123Z",
      "resource": {
        "type": "secret",
        "id": "sec_abc123",
        "name": "DATABASE_URL"
      },
      "action": "accessed",
      "actor": {
        "type": "api_key",
        "id": "key_xyz789",
        "name": "Production API Key"
      },
      "result": "success",
      "metadata": {
        "ipAddress": "203.0.113.50",
        "userAgent": "vsecure-cli/1.0.0",
        "location": "US",
        "version": 3
      },
      "signature": "sha256:abc123..."
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6ImxvZ19hYmMxMjMifQ",
    "hasMore": true,
    "totalCount": 15847
  }
}
```

### Examples

```bash
# Get all logs from last 24 hours
curl "https://api.lanonasis.com/v1/security/audit-logs?since=24h" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get secret access logs
curl "https://api.lanonasis.com/v1/security/audit-logs?resource=secrets&action=accessed" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get logs for specific secret
curl "https://api.lanonasis.com/v1/security/audit-logs?resource=secrets&name=DATABASE_URL" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get failed operations
curl "https://api.lanonasis.com/v1/security/audit-logs?result=failure" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Get Audit Log

Retrieve a specific audit log entry.

### Endpoint

```http
GET /v1/security/audit-logs/:id
```

### Response

```json
{
  "id": "log_abc123xyz",
  "timestamp": "2024-03-15T10:30:00.123Z",
  "resource": {
    "type": "secret",
    "id": "sec_abc123",
    "name": "DATABASE_URL"
  },
  "action": "updated",
  "actor": {
    "type": "user",
    "id": "user_xyz789",
    "email": "admin@example.com"
  },
  "changes": {
    "version": {
      "from": 2,
      "to": 3
    },
    "tags": {
      "added": ["updated"],
      "removed": []
    }
  },
  "result": "success",
  "metadata": {
    "ipAddress": "203.0.113.50",
    "userAgent": "Mozilla/5.0...",
    "location": "San Francisco, US",
    "requestId": "req_abc123"
  },
  "signature": "sha256:abc123...",
  "verified": true
}
```

## Verify Audit Log

Verify the HMAC signature of an audit log.

### Endpoint

```http
POST /v1/security/audit-logs/:id/verify
```

### Response

```json
{
  "id": "log_abc123xyz",
  "verified": true,
  "signature": "sha256:abc123...",
  "algorithm": "HMAC-SHA256",
  "verifiedAt": "2024-03-15T10:35:00Z"
}
```

## Export Audit Logs

Export audit logs for compliance or backup.

### Endpoint

```http
POST /v1/security/audit-logs/export
```

### Request Body

```json
{
  "format": "json",
  "since": "2024-01-01T00:00:00Z",
  "until": "2024-03-31T23:59:59Z",
  "filters": {
    "resource": "secrets",
    "action": "accessed"
  },
  "includeSignatures": true,
  "compress": true
}
```

### Supported Formats

- `json` - JSON Lines format
- `csv` - Comma-separated values
- `parquet` - Apache Parquet (for data analysis)
- `syslog` - RFC 5424 Syslog format

### Response

```json
{
  "exportId": "exp_abc123xyz",
  "status": "processing",
  "format": "json",
  "estimatedSize": "125 MB",
  "estimatedTime": "2 minutes",
  "downloadUrl": null
}
```

Check export status:

```http
GET /v1/security/audit-logs/exports/:exportId
```

## Stream Audit Logs

Real-time audit log streaming via Server-Sent Events (SSE).

### Endpoint

```http
GET /v1/security/audit-logs/stream
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource` | string | Filter by resource type |
| `action` | string | Filter by action |

### Example

```typescript
const eventSource = new EventSource(
  'https://api.lanonasis.com/v1/security/audit-logs/stream',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  }
);

eventSource.onmessage = (event) => {
  const log = JSON.parse(event.data);
  console.log('New audit log:', log);
};
```

## Audit Log Actions

### Secrets

- `secret.created` - Secret created
- `secret.accessed` - Secret read
- `secret.updated` - Secret updated
- `secret.deleted` - Secret deleted
- `secret.expired` - Secret expired
- `secret.rotated` - Secret rotated

### API Keys

- `apikey.created` - API key created
- `apikey.accessed` - API key used
- `apikey.updated` - API key updated
- `apikey.rotated` - API key rotated
- `apikey.revoked` - API key revoked
- `apikey.expired` - API key expired

### MCP

- `mcp.approval_requested` - Approval requested
- `mcp.approval_granted` - Approval granted
- `mcp.approval_denied` - Approval denied
- `mcp.resource_accessed` - Resource accessed via MCP
- `mcp.operation_failed` - Operation failed

### Authentication

- `auth.login_success` - Successful login
- `auth.login_failed` - Failed login attempt
- `auth.logout` - User logout
- `auth.token_refreshed` - Token refreshed

### Configuration

- `config.updated` - Configuration changed
- `config.encryption_key_rotated` - Encryption key rotated
- `config.backup_created` - Backup created

## Compliance Reports

Generate compliance reports from audit logs.

### Endpoint

```http
POST /v1/security/audit-logs/reports
```

### Request Body

```json
{
  "type": "soc2",
  "period": {
    "start": "2024-01-01",
    "end": "2024-03-31"
  },
  "includeMetrics": true
}
```

### Report Types

- `soc2` - SOC 2 Type II compliance report
- `iso27001` - ISO 27001 compliance report
- `gdpr` - GDPR access log report
- `pci-dss` - PCI DSS access control report
- `custom` - Custom report with filters

### Response

```json
{
  "reportId": "rep_abc123xyz",
  "type": "soc2",
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-03-31T23:59:59Z"
  },
  "metrics": {
    "totalEvents": 125847,
    "successfulAccess": 125824,
    "failedAccess": 23,
    "uniqueActors": 47,
    "secretsAccessed": 234
  },
  "downloadUrl": "https://...",
  "expiresAt": "2024-04-15T00:00:00Z"
}
```

## Retention Policies

Configure audit log retention.

### Endpoint

```http
PUT /v1/security/audit-logs/retention
```

### Request Body

```json
{
  "defaultRetention": "2y",
  "policies": [
    {
      "resource": "secrets",
      "action": "accessed",
      "retention": "7y"
    },
    {
      "resource": "apikeys",
      "action": "created",
      "retention": "10y"
    }
  ]
}
```

## SIEM Integration

Forward logs to SIEM systems.

### Supported Integrations

- Splunk
- Datadog
- AWS CloudWatch
- Azure Sentinel
- Google Cloud Logging

### Configure SIEM

```http
POST /v1/security/audit-logs/integrations
```

```json
{
  "type": "splunk",
  "config": {
    "endpoint": "https://splunk.example.com:8088",
    "token": "your-hec-token"
  },
  "filters": {
    "minLevel": "warning"
  }
}
```

## Webhook Notifications

Receive audit log notifications via webhook.

### Endpoint

```http
POST /v1/security/webhooks
```

### Request Body

```json
{
  "url": "https://your-app.com/webhooks/audit",
  "events": [
    "secret.accessed",
    "apikey.revoked",
    "auth.login_failed"
  ],
  "filters": {
    "resource": "secrets",
    "action": "deleted"
  },
  "secret": "whsec_..."
}
```

## Best Practices

### 1. Regular Review

Review audit logs regularly:

```bash
# Daily review of failed operations
vsecure audit:logs --result failure --since 24h

# Weekly review of access patterns
vsecure audit:logs --resource secrets --since 7d
```

### 2. Alert on Anomalies

Set up alerts for unusual activity:

```typescript
// Monitor for unusual access patterns
const logs = await client.audit.list({
  resource: 'secrets',
  action: 'accessed',
  since: '1h'
});

if (logs.data.length > threshold) {
  await sendAlert('Unusual secret access detected');
}
```

### 3. Export for Long-Term Storage

```bash
# Monthly export
vsecure audit:export \
  --format parquet \
  --since 30d \
  --output ./audit-exports/
```

### 4. Verify Signatures

Verify log integrity:

```bash
vsecure audit:verify log_abc123
```

## Next Steps

- [Compliance Documentation](../compliance/overview)
- [Security Best Practices](../guides/security-best-practices)
- [SIEM Integration Guide](../guides/siem-integration)
