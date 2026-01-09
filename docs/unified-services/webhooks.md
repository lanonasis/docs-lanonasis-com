---
sidebar_position: 7
title: Webhooks
description: Receive real-time event notifications
---

# Webhooks

Webhooks allow you to receive real-time notifications when events occur in your account. Instead of polling the API, you receive HTTP POST requests at your specified endpoint.

## Register a Webhook

```bash
curl -X POST https://api.lanonasis.com/v1/webhooks \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourapp.com/webhooks/lanonasis",
    "events": ["transfer.completed", "transfer.failed", "payment.successful"],
    "description": "Production webhook"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "whk_abc123",
    "url": "https://yourapp.com/webhooks/lanonasis",
    "events": ["transfer.completed", "transfer.failed", "payment.successful"],
    "secret": "whsec_EXAMPLE_SECRET_DO_NOT_USE",
    "status": "active",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

:::caution Save Your Secret
The `secret` is only shown once. Save it securely to verify webhook signatures.
:::

## Event Types

### Transfer Events

| Event | Description |
|-------|-------------|
| `transfer.initiated` | Transfer created |
| `transfer.processing` | Transfer is being processed |
| `transfer.completed` | Transfer successful |
| `transfer.failed` | Transfer failed |
| `transfer.reversed` | Transfer was reversed |

### Payment Events

| Event | Description |
|-------|-------------|
| `payment.initialized` | Payment created |
| `payment.successful` | Payment completed |
| `payment.failed` | Payment failed |
| `payment.refunded` | Payment refunded |

### Wallet Events

| Event | Description |
|-------|-------------|
| `wallet.created` | New wallet created |
| `wallet.credited` | Funds added to wallet |
| `wallet.debited` | Funds removed from wallet |
| `wallet.frozen` | Wallet frozen |

### KYC Events

| Event | Description |
|-------|-------------|
| `kyc.submitted` | Verification submitted |
| `kyc.verified` | Verification successful |
| `kyc.failed` | Verification failed |

## Webhook Payload

```json
{
  "id": "evt_123abc",
  "type": "transfer.completed",
  "created_at": "2024-01-15T14:30:05Z",
  "data": {
    "id": "txn_abc123xyz",
    "reference": "TRF-20240115-001",
    "amount": 100000,
    "fee": 1000,
    "currency": "NGN",
    "status": "success",
    "source_wallet_id": "wal_sender123",
    "destination": {
      "type": "bank",
      "account_number": "0123456789",
      "bank_code": "058",
      "account_name": "John Doe"
    },
    "completed_at": "2024-01-15T14:30:05Z"
  }
}
```

## Verify Webhook Signature

Always verify webhook signatures to ensure requests are from LanOnasis.

### Signature Header

Webhooks include a `X-LanOnasis-Signature` header:

```
X-LanOnasis-Signature: t=1704299405,v1=EXAMPLE_HASH_VALUE_DO_NOT_USE
```

### Verification Code

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
  const hash = parts.find(p => p.startsWith('v1='))?.slice(3);

  if (!timestamp || !hash) return false;

  // Check timestamp is recent (within 5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    return false;
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(expectedHash)
  );
}

// Express.js example
app.post('/webhooks/lanonasis', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-lanonasis-signature'];
  const payload = req.body.toString();

  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET=REDACTED_WEBHOOK_SECRET
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(payload);

  switch (event.type) {
    case 'transfer.completed':
      handleTransferCompleted(event.data);
      break;
    case 'payment.successful':
      handlePaymentSuccessful(event.data);
      break;
    // ... handle other events
  }

  res.status(200).send('OK');
});
```

### Python Verification

```python
import hmac
import hashlib
import time

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    parts = dict(p.split('=') for p in signature.split(','))
    timestamp = parts.get('t')
    hash_value = parts.get('v1')

    if not timestamp or not hash_value:
        return False

    # Check timestamp is recent
    if abs(time.time() - int(timestamp)) > 300:
        return False

    # Compute expected signature
    signed_payload = f"{timestamp}.{payload.decode()}"
    expected_hash = hmac.new(
        secret.encode(),
        signed_payload.encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(hash_value, expected_hash)
```

## Retry Policy

If your endpoint doesn't respond with `2xx`, we retry with exponential backoff:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |
| 6 | 8 hours |
| 7 | 24 hours |

After 7 failed attempts, the webhook is marked as failed and the endpoint may be disabled.

## List Webhooks

```bash
curl https://api.lanonasis.com/v1/webhooks \
  -H "X-API-Key: YOUR_API_KEY"
```

## Update Webhook

```bash
curl -X PATCH https://api.lanonasis.com/v1/webhooks/whk_abc123 \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["transfer.completed", "payment.successful"],
    "status": "active"
  }'
```

## Delete Webhook

```bash
curl -X DELETE https://api.lanonasis.com/v1/webhooks/whk_abc123 \
  -H "X-API-Key: YOUR_API_KEY"
```

## Best Practices

### 1. Respond Quickly

Return `200 OK` immediately, then process async:

```typescript
app.post('/webhooks/lanonasis', async (req, res) => {
  // Verify signature first

  // Acknowledge immediately
  res.status(200).send('OK');

  // Process async
  queueWebhookProcessing(req.body);
});
```

### 2. Handle Duplicates

Events may be delivered more than once. Use `event.id` for deduplication:

```typescript
const processedEvents = new Set();

function handleWebhook(event) {
  if (processedEvents.has(event.id)) {
    return; // Already processed
  }

  processedEvents.add(event.id);
  // Process event...
}
```

### 3. Secure Your Endpoint

- Use HTTPS only
- Verify signatures
- Use a random URL path

### 4. Log Everything

Keep logs of all webhook events for debugging:

```typescript
console.log({
  event_id: event.id,
  event_type: event.type,
  received_at: new Date().toISOString(),
  data: event.data
});
```

## Testing Webhooks

### Sandbox Events

In sandbox mode, trigger test events via the dashboard or API.

### Local Development

Use a tunneling service like ngrok:

```bash
ngrok http 3000

# Register webhook with ngrok URL
curl -X POST https://sandbox.lanonasis.com/v1/webhooks \
  -H "X-API-Key: YOUR_TEST_API_KEY" \
  -d '{"url": "https://abc123.ngrok.io/webhooks/lanonasis"}'
```
