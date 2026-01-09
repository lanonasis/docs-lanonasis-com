---
sidebar_position: 4
title: Transfers
description: Send money to wallets and bank accounts
---

# Transfers

Transfer funds from a wallet to another wallet or directly to a bank account via NIP (NIBSS Instant Payment).

## Initiate a Transfer

### Wallet-to-Wallet Transfer

```bash
curl -X POST https://api.lanonasis.com/v1/transfers \
  -H "X-API-Key: sk_live_xxx" \
  -H "Idempotency-Key: transfer_001" \
  -H "Content-Type: application/json" \
  -d '{
    "source_wallet_id": "wal_sender123",
    "amount": 50000,
    "currency": "NGN",
    "destination": {
      "type": "wallet",
      "wallet_id": "wal_receiver456"
    },
    "narration": "Payment for services"
  }'
```

### Wallet-to-Bank Transfer

```bash
curl -X POST https://api.lanonasis.com/v1/transfers \
  -H "X-API-Key: sk_live_xxx" \
  -H "Idempotency-Key: transfer_002" \
  -H "Content-Type: application/json" \
  -d '{
    "source_wallet_id": "wal_sender123",
    "amount": 100000,
    "currency": "NGN",
    "destination": {
      "type": "bank",
      "account_number": "0123456789",
      "bank_code": "058",
      "account_name": "John Doe"
    },
    "narration": "Withdrawal to GTBank"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "txn_abc123xyz",
    "reference": "TRF-20240115-001",
    "amount": 100000,
    "fee": 1000,
    "currency": "NGN",
    "status": "pending",
    "source_wallet_id": "wal_sender123",
    "destination": {
      "type": "bank",
      "account_number": "0123456789",
      "bank_code": "058",
      "account_name": "John Doe"
    },
    "narration": "Withdrawal to GTBank",
    "created_at": "2024-01-15T14:30:00Z"
  }
}
```

## Transfer Status Flow

```
pending → processing → success
                    ↘ failed
                    ↘ reversed
```

| Status | Description |
|--------|-------------|
| `pending` | Transfer created, awaiting processing |
| `processing` | Being processed by the payment network |
| `success` | Completed successfully |
| `failed` | Failed (see error details) |
| `reversed` | Was successful but later reversed |

## Get Transfer Status

```bash
curl https://api.lanonasis.com/v1/transfers/txn_abc123xyz \
  -H "X-API-Key: sk_live_xxx"
```

### Response

```json
{
  "success": true,
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
    "narration": "Withdrawal to GTBank",
    "created_at": "2024-01-15T14:30:00Z",
    "completed_at": "2024-01-15T14:30:05Z"
  }
}
```

## List Transfers

```bash
curl "https://api.lanonasis.com/v1/transfers?wallet_id=wal_sender123&status=success&limit=20" \
  -H "X-API-Key: sk_live_xxx"
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `wallet_id` | Filter by source wallet |
| `status` | Filter by status |
| `limit` | Results per page (1-100, default 20) |
| `cursor` | Pagination cursor |

## Bank Codes

Common Nigerian bank codes:

| Bank | Code |
|------|------|
| Access Bank | 044 |
| First Bank | 011 |
| GTBank | 058 |
| UBA | 033 |
| Zenith Bank | 057 |
| Kuda Bank | 090267 |
| OPay | 100004 |
| Palmpay | 100033 |

:::tip
Use the `/banks` endpoint to get the full list of supported banks.
:::

## Name Enquiry

Before initiating a bank transfer, validate the account:

```bash
curl -X POST https://api.lanonasis.com/v1/transfers/validate-account \
  -H "X-API-Key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "account_number": "0123456789",
    "bank_code": "058"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "account_number": "0123456789",
    "account_name": "JOHN DOE",
    "bank_code": "058",
    "bank_name": "Guaranty Trust Bank"
  }
}
```

## Fees

Transfer fees depend on your tier and destination:

| Destination | Starter | Growth | Business |
|-------------|---------|--------|----------|
| Wallet-to-Wallet | Free | Free | Free |
| Bank (under N50k) | N25 | N20 | N15 |
| Bank (N50k-N500k) | N50 | N40 | N30 |
| Bank (over N500k) | N75 | N60 | N50 |

## Error Handling

### Insufficient Funds

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Wallet balance is insufficient for this transfer",
    "details": {
      "available": 50000,
      "required": 101000
    }
  }
}
```

### Invalid Account

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ACCOUNT",
    "message": "The destination account could not be verified",
    "details": {
      "account_number": "0123456789",
      "bank_code": "058"
    }
  }
}
```

## SDK Examples

### TypeScript

```typescript
import { LanOnasisClient } from '@lanonasis/sdk';

const client = new LanOnasisClient({ apiKey: 'sk_live_xxx' });

// Validate account first
const validation = await client.transfers.validateAccount({
  account_number: '0123456789',
  bank_code: '058'
});

if (validation.success) {
  // Initiate transfer
  const transfer = await client.transfers.create({
    source_wallet_id: 'wal_sender123',
    amount: 100000, // N1,000.00
    currency: 'NGN',
    destination: {
      type: 'bank',
      account_number: '0123456789',
      bank_code: '058',
      account_name: validation.data.account_name
    },
    narration: 'Withdrawal'
  });

  console.log(`Transfer ${transfer.data.id}: ${transfer.data.status}`);
}
```

### Python

```python
from lanonasis import LanOnasisClient

client = LanOnasisClient(api_key='sk_live_xxx')

# Validate account
validation = client.transfers.validate_account(
    account_number='0123456789',
    bank_code='058'
)

# Initiate transfer
transfer = client.transfers.create(
    source_wallet_id='wal_sender123',
    amount=100000,
    currency='NGN',
    destination={
        'type': 'bank',
        'account_number': '0123456789',
        'bank_code': '058',
        'account_name': validation.data.account_name
    },
    narration='Withdrawal'
)
```

## Webhooks

Subscribe to transfer events:

- `transfer.initiated` - Transfer created
- `transfer.processing` - Being processed
- `transfer.completed` - Successfully completed
- `transfer.failed` - Transfer failed
- `transfer.reversed` - Transfer reversed

See [Webhooks](/docs/unified-services/webhooks) for details.
