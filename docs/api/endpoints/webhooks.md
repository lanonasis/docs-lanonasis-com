# Webhooks API

Configure and manage webhooks to receive real-time notifications about memory operations and system events.

## Endpoint

```
POST /api/v1/webhooks
GET /api/v1/webhooks
PUT /api/v1/webhooks/{webhook_id}
DELETE /api/v1/webhooks/{webhook_id}
```

## Description

The Webhooks API allows you to configure HTTP endpoints that will receive real-time notifications about memory operations, system events, and other activities. This enables you to integrate LanOnasis with external systems and build event-driven architectures.

## Authentication

```http
Authorization: Bearer <your-api-key>
```

## Create Webhook

### Endpoint
```
POST /api/v1/webhooks
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | Webhook endpoint URL |
| `events` | string[] | Yes | Array of events to subscribe to |
| `secret` | string | No | Secret for webhook signature verification |
| `active` | boolean | No | Whether webhook is active (default: true) |
| `retry_policy` | object | No | Retry configuration |
| `filters` | object | No | Event filtering criteria |

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/webhooks \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/lanonasis",
    "events": ["memory.created", "memory.updated", "memory.deleted"],
    "secret": "your-webhook-secret",
    "active": true,
    "retry_policy": {
      "max_attempts": 3,
      "backoff_multiplier": 2,
      "max_delay": 300
    },
    "filters": {
      "user_id": "user123",
      "category": "important"
    }
  }'
```

```typescript
import { MemoryClient } from '@LanOnasis/memory-sdk';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

const webhook = await client.createWebhook({
  url: 'https://your-app.com/webhooks/lanonasis',
  events: ['memory.created', 'memory.updated', 'memory.deleted'],
  secret: 'your-webhook-secret',
  active: true,
  retryPolicy: {
    maxAttempts: 3,
    backoffMultiplier: 2,
    maxDelay: 300
  },
  filters: {
    user_id: 'user123',
    category: 'important'
  }
});

console.log('Webhook created:', webhook.id);
```

```python
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com"
)

webhook = client.create_webhook(
    url="https://your-app.com/webhooks/lanonasis",
    events=["memory.created", "memory.updated", "memory.deleted"],
    secret="your-webhook-secret",
    active=True,
    retry_policy={
        "max_attempts": 3,
        "backoff_multiplier": 2,
        "max_delay": 300
    },
    filters={
        "user_id": "user123",
        "category": "important"
    }
)

print(f"Webhook created: {webhook.id}")
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "webhook_1234567890abcdef",
    "url": "https://your-app.com/webhooks/lanonasis",
    "events": ["memory.created", "memory.updated", "memory.deleted"],
    "secret": "whsec_1234567890abcdef",
    "active": true,
    "retry_policy": {
      "max_attempts": 3,
      "backoff_multiplier": 2,
      "max_delay": 300
    },
    "filters": {
      "user_id": "user123",
      "category": "important"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "last_delivery": null,
    "delivery_stats": {
      "total_attempts": 0,
      "successful_deliveries": 0,
      "failed_deliveries": 0
    }
  }
}
```

## List Webhooks

### Endpoint
```
GET /api/v1/webhooks
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `active` | boolean | No | Filter by active status |
| `event` | string | No | Filter by event type |
| `limit` | number | No | Number of webhooks to return (default: 20) |
| `offset` | number | No | Number of webhooks to skip (default: 0) |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/api/v1/webhooks?active=true&limit=10" \
  -H "Authorization: Bearer your-api-key"
```

### Response

```json
{
  "success": true,
  "data": {
    "webhooks": [
      {
        "id": "webhook_1234567890abcdef",
        "url": "https://your-app.com/webhooks/lanonasis",
        "events": ["memory.created", "memory.updated"],
        "active": true,
        "created_at": "2024-01-15T10:30:00Z",
        "last_delivery": "2024-01-15T10:35:00Z",
        "delivery_stats": {
          "total_attempts": 15,
          "successful_deliveries": 14,
          "failed_deliveries": 1
        }
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 10,
      "offset": 0,
      "has_more": false
    }
  }
}
```

## Update Webhook

### Endpoint
```
PUT /api/v1/webhooks/{webhook_id}
```

### Example Request

```bash
curl -X PUT https://api.lanonasis.com/api/v1/webhooks/webhook_1234567890abcdef \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["memory.created", "memory.updated", "memory.deleted", "search.performed"],
    "active": true,
    "retry_policy": {
      "max_attempts": 5,
      "backoff_multiplier": 2,
      "max_delay": 600
    }
  }'
```

## Delete Webhook

### Endpoint
```
DELETE /api/v1/webhooks/{webhook_id}
```

### Example Request

```bash
curl -X DELETE https://api.lanonasis.com/api/v1/webhooks/webhook_1234567890abcdef \
  -H "Authorization: Bearer your-api-key"
```

## Webhook Events

### Available Events

| Event | Description | Payload |
|-------|-------------|---------|
| `memory.created` | Memory created | Memory object |
| `memory.updated` | Memory updated | Memory object with changes |
| `memory.deleted` | Memory deleted | Memory ID and metadata |
| `search.performed` | Search executed | Query and results summary |
| `user.activity` | User activity | User and activity details |
| `system.health` | System health update | Health metrics |
| `analytics.update` | Analytics update | Analytics data |

### Event Payload Structure

```json
{
  "id": "event_1234567890abcdef",
  "type": "memory.created",
  "created": "2024-01-15T10:30:00Z",
  "data": {
    "object": "memory",
    "id": "mem_1234567890abcdef",
    "content": "Memory content",
    "metadata": {
      "user_id": "user123",
      "category": "note"
    },
    "tags": ["important", "work"],
    "created_at": "2024-01-15T10:30:00Z"
  },
  "webhook_id": "webhook_1234567890abcdef",
  "attempt": 1,
  "livemode": true
}
```

## Webhook Security

### Signature Verification

LanOnasis signs webhook payloads using HMAC-SHA256. Verify the signature to ensure the webhook is authentic:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Express.js example
app.post('/webhooks/lanonasis', (req, res) => {
  const signature = req.headers['x-lanonasis-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET=REDACTED_WEBHOOK_SECRET
    return res.status(400).send('Invalid signature');
  }
  
  // Process webhook
  console.log('Webhook received:', req.body);
  res.status(200).send('OK');
});
```

```python
import hmac
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhooks/lanonasis', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Lanonasis-Signature')
    payload = request.get_data(as_text=True)
    
    if not verify_webhook_signature(payload, signature, os.environ['WEBHOOK_SECRET=REDACTED_WEBHOOK_SECRET
        return jsonify({'error': 'Invalid signature'}), 400
    
    # Process webhook
    print(f'Webhook received: {request.json}')
    return jsonify({'status': 'OK'}), 200
```

### Headers

| Header | Description |
|--------|-------------|
| `X-Lanonasis-Signature` | HMAC-SHA256 signature |
| `X-Lanonasis-Event` | Event type |
| `X-Lanonasis-Delivery` | Unique delivery ID |
| `User-Agent` | `Lanonasis-Webhooks/1.0` |

## Retry Policy

### Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `max_attempts` | number | 3 | Maximum retry attempts |
| `backoff_multiplier` | number | 2 | Exponential backoff multiplier |
| `max_delay` | number | 300 | Maximum delay between retries (seconds) |

### Retry Schedule

| Attempt | Delay | Total Time |
|---------|-------|------------|
| 1 | Immediate | 0s |
| 2 | 1s | 1s |
| 3 | 2s | 3s |
| 4 | 4s | 7s |
| 5 | 8s | 15s |

## Best Practices

1. **Idempotency**: Make webhook handlers idempotent
2. **Quick Response**: Respond within 5 seconds
3. **Error Handling**: Return appropriate HTTP status codes
4. **Security**: Always verify webhook signatures
5. **Logging**: Log all webhook deliveries for debugging

## Use Cases

- **Data Synchronization**: Sync data with external systems
- **Notifications**: Send real-time notifications to users
- **Analytics**: Track events in external analytics systems
- **Automation**: Trigger automated workflows
- **Auditing**: Log all memory operations for compliance

## Rate Limits

- **Webhook Creation**: 10 per hour
- **Delivery Rate**: 1000 events per minute per webhook
- **Concurrent Deliveries**: 5 per webhook