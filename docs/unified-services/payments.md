---
sidebar_position: 5
title: Payments
description: Accept payments from customers
---

# Payments

Accept payments from your customers via multiple channels: cards, bank transfers, USSD, and more.

## Payment Flow

```
1. Initialize Payment → Get authorization URL
2. Customer Completes Payment
3. Receive Webhook or Verify Payment
4. Fulfill Order
```

## Initialize Payment

```bash
curl -X POST https://api.lanonasis.com/v1/payments \
  -H "X-API-Key: sk_live_xxx" \
  -H "Idempotency-Key: payment_order_123" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250000,
    "currency": "NGN",
    "email": "customer@example.com",
    "callback_url": "https://yourapp.com/payment/callback",
    "channels": ["card", "bank_transfer"],
    "metadata": {
      "order_id": "ORD-12345",
      "product": "Premium Plan"
    }
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "pay_xyz789",
    "reference": "PAY-20240115-001",
    "authorization_url": "https://checkout.lanonasis.com/pay/abc123",
    "access_code": "abc123def456",
    "expires_at": "2024-01-15T15:30:00Z"
  }
}
```

### Redirect Customer

Redirect your customer to `authorization_url` to complete payment:

```javascript
// React/Next.js
window.location.href = payment.data.authorization_url;

// Or open in new tab
window.open(payment.data.authorization_url, '_blank');
```

## Payment Channels

| Channel | Description | Settlement |
|---------|-------------|------------|
| `card` | Visa, Mastercard, Verve | Instant |
| `bank_transfer` | Pay via bank transfer | 5-10 min |
| `ussd` | USSD code payment | Instant |
| `qr` | Scan QR to pay | Instant |
| `mobile_money` | Mobile money (Ghana, Kenya) | Instant |

### Channel-Specific Options

```json
{
  "amount": 250000,
  "currency": "NGN",
  "email": "customer@example.com",
  "channels": ["bank_transfer"],
  "bank_transfer_options": {
    "account_expires_at": "2024-01-15T16:00:00Z"
  }
}
```

## Verify Payment

After customer completes payment (via callback or webhook), verify the payment status:

```bash
curl -X POST https://api.lanonasis.com/v1/payments/pay_xyz789/verify \
  -H "X-API-Key: sk_live_xxx"
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "pay_xyz789",
    "reference": "PAY-20240115-001",
    "status": "success",
    "amount": 250000,
    "currency": "NGN",
    "channel": "card",
    "customer": {
      "email": "customer@example.com"
    },
    "authorization": {
      "card_type": "visa",
      "last4": "4081",
      "exp_month": "12",
      "exp_year": "2025",
      "bank": "First Bank",
      "reusable": true,
      "authorization_code": "AUTH_xyz123"
    },
    "paid_at": "2024-01-15T14:35:22Z",
    "metadata": {
      "order_id": "ORD-12345",
      "product": "Premium Plan"
    }
  }
}
```

## Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Awaiting customer action |
| `processing` | Payment being processed |
| `success` | Payment successful |
| `failed` | Payment failed |
| `abandoned` | Customer didn't complete |
| `reversed` | Refunded/reversed |

## Recurring Payments

### Save Card for Future

When a payment is successful with `reusable: true`, save the `authorization_code`:

```json
{
  "authorization_code": "AUTH_xyz123",
  "card_type": "visa",
  "last4": "4081",
  "bank": "First Bank"
}
```

### Charge Saved Card

```bash
curl -X POST https://api.lanonasis.com/v1/payments/charge \
  -H "X-API-Key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "authorization_code": "AUTH_xyz123",
    "email": "customer@example.com",
    "amount": 150000,
    "currency": "NGN"
  }'
```

## Inline Checkout (JavaScript)

Embed payment directly in your page:

```html
<script src="https://js.lanonasis.com/v1/inline.js"></script>

<button onclick="payWithLanOnasis()">Pay N2,500</button>

<script>
function payWithLanOnasis() {
  LanOnasisCheckout.pay({
    key: 'pk_live_xxx',
    email: 'customer@example.com',
    amount: 250000,
    currency: 'NGN',
    ref: 'unique_reference_123',
    metadata: {
      order_id: 'ORD-12345'
    },
    onClose: function() {
      console.log('Checkout closed');
    },
    callback: function(response) {
      console.log('Payment successful', response);
      // Verify on your backend
      verifyPayment(response.reference);
    }
  });
}
</script>
```

## Refunds

Refund a successful payment:

```bash
curl -X POST https://api.lanonasis.com/v1/payments/pay_xyz789/refund \
  -H "X-API-Key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250000,
    "reason": "Customer requested refund"
  }'
```

### Partial Refunds

```json
{
  "amount": 100000,
  "reason": "Partial refund for returned item"
}
```

## SDK Examples

### TypeScript

```typescript
import { LanOnasisClient } from '@lanonasis/sdk';

const client = new LanOnasisClient({ apiKey: 'sk_live_xxx' });

// Initialize payment
const payment = await client.payments.initialize({
  amount: 250000,
  currency: 'NGN',
  email: 'customer@example.com',
  callback_url: 'https://yourapp.com/callback',
  metadata: { order_id: 'ORD-123' }
});

// Redirect customer
console.log(`Redirect to: ${payment.data.authorization_url}`);

// Later: verify payment
const verified = await client.payments.verify(payment.data.id);
if (verified.data.status === 'success') {
  // Fulfill order
}
```

### Python

```python
from lanonasis import LanOnasisClient

client = LanOnasisClient(api_key='sk_live_xxx')

# Initialize payment
payment = client.payments.initialize(
    amount=250000,
    currency='NGN',
    email='customer@example.com',
    callback_url='https://yourapp.com/callback'
)

# Verify later
verified = client.payments.verify(payment.data.id)
if verified.data.status == 'success':
    print('Payment successful!')
```

## Webhooks

Subscribe to payment events:

- `payment.initialized` - Payment created
- `payment.successful` - Payment completed
- `payment.failed` - Payment failed
- `payment.refunded` - Payment refunded

See [Webhooks](/unified-services/webhooks) for details.
