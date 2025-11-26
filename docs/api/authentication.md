---
title: Authentication
sidebar_position: 3
---

# Authentication

LanOnasis uses API keys for authentication. All API requests must include a valid API key in the request headers.

## API Key Format

```http
Authorization: Bearer YOUR_API_KEY
```

## Getting Your API Key

### 1. Sign Up for LanOnasis

Create your account at [dashboard.lanonasis.com](https://dashboard.lanonasis.com/signup)

### 2. Generate API Key

1. Navigate to **Settings > API Keys**
2. Click **"Generate New Key"**
3. Enter a description for your key
4. Select appropriate permissions
5. Copy and securely store your key

:::warning
API keys are only shown once. Store them securely and never share them publicly.
:::

## API Key Permissions

| Permission | Description |
|------------|-------------|
| `memories:read` | Read access to memories |
| `memories:write` | Create and update memories |
| `memories:delete` | Delete memories |
| `search:read` | Search and discovery access |
| `analytics:read` | Usage analytics access |
| `admin:*` | Full administrative access |

## Environment Setup

### Production
```bash
export LANONASIS_API_KEY="lk_prod_your_key_here"
export LANONASIS_BASE_URL="https://api.lanonasis.com/v1"
```

### Sandbox
```bash
export LANONASIS_API_KEY="lk_test_your_key_here"
export LANONASIS_BASE_URL="https://sandbox-api.lanonasis.com/v1"
```

## Create API Key

Generate a new API key programmatically.

### Request

```http
POST /v1/auth/keys
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Descriptive name for the key |
| `permissions` | array | Yes | Array of permission strings |
| `expires_at` | string | No | ISO 8601 expiration date |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/v1/auth/keys \
  -H "Authorization: Bearer YOUR_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "permissions": ["memories:read", "memories:write", "search:read"],
    "expires_at": "2024-12-31T23:59:59Z"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "key_789abc",
    "name": "Production API Key",
    "key": "lk_prod_1234567890abcdef",
    "permissions": ["memories:read", "memories:write", "search:read"],
    "created_at": "2024-01-15T10:30:00Z",
    "expires_at": "2024-12-31T23:59:59Z",
    "last_used": null
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_key_create_123"
  }
}
```

## List API Keys

Retrieve all API keys for your account.

### Request

```http
GET /v1/auth/keys
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Number of keys to return (default: 20) |
| `offset` | integer | No | Number of keys to skip (default: 0) |

### Example Request

```bash
curl -X GET https://api.lanonasis.com/v1/auth/keys \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "keys": [
      {
        "id": "key_789abc",
        "name": "Production API Key",
        "key_preview": "lk_prod_1234...cdef",
        "permissions": ["memories:read", "memories:write", "search:read"],
        "created_at": "2024-01-15T10:30:00Z",
        "expires_at": "2024-12-31T23:59:59Z",
        "last_used": "2024-01-16T09:15:00Z"
      },
      {
        "id": "key_456def",
        "name": "Development Key",
        "key_preview": "lk_test_5678...9abc",
        "permissions": ["memories:read", "search:read"],
        "created_at": "2024-01-10T14:20:00Z",
        "expires_at": null,
        "last_used": "2024-01-15T16:30:00Z"
      }
    ],
    "pagination": {
      "total": 2,
      "limit": 20,
      "offset": 0,
      "has_more": false
    }
  },
  "meta": {
    "timestamp": "2024-01-16T10:00:00Z",
    "request_id": "req_keys_list_456"
  }
}
```

## Revoke API Key

Permanently revoke an API key. This action cannot be undone.

### Request

```http
DELETE /v1/auth/keys/{id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | API key ID to revoke |

### Example Request

```bash
curl -X DELETE https://api.lanonasis.com/v1/auth/keys/key_789abc \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "key_789abc",
    "revoked": true,
    "revoked_at": "2024-01-16T11:30:00Z"
  },
  "meta": {
    "timestamp": "2024-01-16T11:30:00Z",
    "request_id": "req_key_revoke_789"
  }
}
```

## Security Best Practices

### API Key Storage
- **Never** commit API keys to version control
- Use environment variables or secure key management systems
- Rotate keys regularly (recommended: every 90 days)
- Use different keys for different environments

### Key Management
- Create keys with minimal required permissions
- Set expiration dates for temporary access
- Monitor key usage in the dashboard
- Revoke unused or compromised keys immediately

### Network Security
- Always use HTTPS for API requests
- Implement proper request signing for sensitive operations
- Use IP whitelisting when possible
- Monitor for unusual API usage patterns

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_API_KEY` | 401 | API key is invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | API key lacks required permissions |
| `KEY_NOT_FOUND` | 404 | API key ID does not exist |
| `KEY_LIMIT_EXCEEDED` | 429 | Maximum number of keys reached |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |

## SDK Examples

### TypeScript
```typescript
import { LanonasisClient } from '@lanonasis/sdk';

// Initialize client
const client = new LanonasisClient({
  apiKey: process.env.LANONASIS_API_KEY,
  baseUrl: process.env.LANONASIS_BASE_URL
});

// Create a new API key
const newKey = await client.auth.createKey({
  name: 'Mobile App Key',
  permissions: ['memories:read', 'search:read'],
  expiresAt: '2024-12-31T23:59:59Z'
});

console.log('New API key:', newKey.key);

// List all keys
const keys = await client.auth.listKeys();
console.log('All keys:', keys.data.keys);

// Revoke a key
await client.auth.revokeKey('key_789abc');
```

### Python
```python
import os
from lanonasis import LanOnasisClient

# Initialize client
client = LanOnasisClient(
    api_key=os.environ['LANONASIS_API_KEY'],
    base_url=os.environ.get('LANONASIS_BASE_URL', 'https://api.lanonasis.com/v1')
)

# Create a new API key
new_key = client.auth.create_key(
    name='Mobile App Key',
    permissions=['memories:read', 'search:read'],
    expires_at='2024-12-31T23:59:59Z'
)

print(f'New API key: {new_key.key}')

# List all keys
keys = client.auth.list_keys()
print(f'All keys: {keys.data.keys}')

# Revoke a key
client.auth.revoke_key('key_789abc')
```

### cURL Examples

#### Basic Authentication Test
```bash
# Test your API key
curl -X GET https://api.lanonasis.com/v1/auth/test \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Create Key with Specific Permissions
```bash
# Create read-only key
curl -X POST https://api.lanonasis.com/v1/auth/keys \
  -H "Authorization: Bearer YOUR_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Read-Only Analytics Key",
    "permissions": ["memories:read", "analytics:read"]
  }'
```

#### Batch Key Management
```bash
# List all keys and their usage
curl -X GET "https://api.lanonasis.com/v1/auth/keys?limit=100" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  | jq '.data.keys[] | {name: .name, last_used: .last_used, permissions: .permissions}'
```

## Webhook Authentication

For webhook endpoints, LanOnasis includes a signature header for verification:

```http
X-LanOnasis-Signature: sha256=5d41402abc4b2a76b9719d911017c592
```

### Verify Webhook Signature

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `sha256=${expectedSignature}` === signature;
}

// Usage
const isValid = verifyWebhookSignature(
  req.body,
  req.headers['x-lanonasis-signature'],
  process.env.WEBHOOK_SECRET=REDACTED_WEBHOOK_SECRET
);
```

## Testing Authentication

### Sandbox Environment
- Use test API keys (prefix: `lk_test_`)
- No charges apply to sandbox usage
- Data is reset weekly
- Rate limits are more relaxed

### Authentication Flow Testing
```bash
# 1. Test basic authentication
curl -X GET https://sandbox-api.lanonasis.com/v1/auth/test \
  -H "Authorization: Bearer lk_test_your_key_here"

# 2. Test permissions
curl -X POST https://sandbox-api.lanonasis.com/v1/memories \
  -H "Authorization: Bearer lk_test_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "content": "Testing authentication"}'

# 3. Test invalid key handling
curl -X GET https://sandbox-api.lanonasis.com/v1/memories \
  -H "Authorization: Bearer invalid_key_123"
```