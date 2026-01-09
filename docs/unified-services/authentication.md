---
sidebar_position: 2
title: Authentication
description: API authentication and security
---

# Authentication

All API requests require authentication using an API key. Your API key identifies your project and determines what capabilities are available.

## Getting Your API Key

1. Sign up at [dashboard.lanonasis.com](https://dashboard.lanonasis.com)
2. Create a new project
3. Navigate to **Settings** → **API Keys**
4. Copy your API key

:::caution Keep Your Keys Secure
- Never expose API keys in client-side code
- Use environment variables for key storage
- Rotate keys periodically
- Use separate keys for sandbox and production
:::

## Using Your API Key

Include your API key in the `X-API-Key` header:

```bash
curl https://api.lanonasis.com/v1/capabilities \
  -H "X-API-Key: sk_live_your_api_key_here"
```

### Key Prefixes

| Prefix | Environment | Description |
|--------|-------------|-------------|
| `sk_live_` | Production | Real transactions |
| `sk_test_` | Sandbox | Test transactions |

## Idempotency Keys

For POST requests that create resources or initiate transactions, include an `Idempotency-Key` header to prevent duplicate operations:

```bash
curl -X POST https://api.lanonasis.com/v1/transfers \
  -H "X-API-Key: sk_live_xxx" \
  -H "Idempotency-Key: transfer_req_abc123" \
  -H "Content-Type: application/json" \
  -d '{"source_wallet_id": "wal_123", "amount": 50000, ...}'
```

### How Idempotency Works

1. **First request**: Processed normally, result cached for 24 hours
2. **Retry with same key**: Returns cached result immediately
3. **Different key**: Treated as new request

### Best Practices

```typescript
// Generate a unique key per logical operation
const idempotencyKey = `${userId}_${operation}_${Date.now()}`;

// Or use UUIDs
import { v4 as uuidv4 } from 'uuid';
const idempotencyKey = uuidv4();
```

## Rate Limits

Rate limits depend on your tier:

| Tier | Requests/Min | Requests/Hour |
|------|-------------|---------------|
| Starter | 60 | 500 |
| Growth | 120 | 2,000 |
| Business | 300 | 10,000 |
| Enterprise | Custom | Custom |

### Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
X-RateLimit-Reset: 1704067200
```

### Handling Rate Limits

When rate limited, you'll receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please retry after 30 seconds.",
    "details": {
      "retry_after": 30
    }
  }
}
```

Implement exponential backoff:

```typescript
async function requestWithRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries - 1) {
        const retryAfter = error.details?.retry_after || Math.pow(2, attempt);
        await sleep(retryAfter * 1000);
        continue;
      }
      throw error;
    }
  }
}
```

## Request Signing (Optional)

For additional security, you can enable request signing. Contact support to enable this feature.

```bash
# HMAC-SHA256 signature
timestamp=$(date +%s)
signature=$(echo -n "${timestamp}.${request_body}" | openssl dgst -sha256 -hmac "${signing_secret}")

curl -X POST https://api.lanonasis.com/v1/transfers \
  -H "X-API-Key: sk_live_xxx" \
  -H "X-Timestamp: ${timestamp}" \
  -H "X-Signature: ${signature}" \
  -d '...'
```

## Error Responses

Authentication errors return `401 Unauthorized`:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

| Error Code | Description |
|------------|-------------|
| `UNAUTHORIZED` | Missing or invalid API key |
| `KEY_EXPIRED` | API key has expired |
| `KEY_REVOKED` | API key was revoked |
| `PERMISSION_DENIED` | Key lacks required permission |
