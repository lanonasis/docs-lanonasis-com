---
sidebar_position: 3
title: Wallets
description: Create and manage digital wallets
---

# Wallets

Wallets are the foundation of the Unified Services API. Each wallet holds a balance in a specific currency and can send/receive funds.

## Create a Wallet

Create a wallet for your customer:

```bash
curl -X POST https://api.lanonasis.com/v1/wallets \
  -H "X-API-Key: sk_live_xxx" \
  -H "Idempotency-Key: create_wallet_cust123" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_abc123",
    "currency": "NGN",
    "type": "personal",
    "metadata": {
      "source": "mobile_app"
    }
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "wal_1a2b3c4d5e",
    "customer_id": "cust_abc123",
    "type": "personal",
    "currency": "NGN",
    "status": "active",
    "account_number": "8012345678",
    "account_name": "LanOnasis/John Doe",
    "bank_name": "Providus Bank",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "request_id": "req_xyz789"
  }
}
```

### Wallet Types

| Type | Description |
|------|-------------|
| `personal` | Individual customer wallet |
| `business` | Business/merchant wallet |
| `savings` | Savings wallet (higher interest) |

## Get Wallet Details

```bash
curl https://api.lanonasis.com/v1/wallets/wal_1a2b3c4d5e \
  -H "X-API-Key: sk_live_xxx"
```

## Get Wallet Balance

```bash
curl https://api.lanonasis.com/v1/wallets/wal_1a2b3c4d5e/balance \
  -H "X-API-Key: sk_live_xxx"
```

### Response

```json
{
  "success": true,
  "data": {
    "available": 1500000,
    "ledger": 1550000,
    "reserved": 50000,
    "currency": "NGN",
    "last_updated": "2024-01-15T14:22:00Z"
  }
}
```

### Balance Types

| Field | Description |
|-------|-------------|
| `available` | Can be spent or transferred immediately |
| `ledger` | Total balance including pending transactions |
| `reserved` | Held for pending operations |

:::info Balance Units
All amounts are in **minor units** (kobo for NGN, cents for USD).

`1500000` kobo = N15,000.00
:::

## List Wallets

```bash
curl "https://api.lanonasis.com/v1/wallets?customer_id=cust_abc123&limit=20" \
  -H "X-API-Key: sk_live_xxx"
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "wal_1a2b3c4d5e",
      "customer_id": "cust_abc123",
      "currency": "NGN",
      "status": "active",
      ...
    },
    {
      "id": "wal_9z8y7x6w5v",
      "customer_id": "cust_abc123",
      "currency": "USD",
      "status": "active",
      ...
    }
  ],
  "meta": {
    "cursor": "eyJsYXN0X2lkIjoid2FsXzl6OHk3eDZ3NXYifQ==",
    "has_more": true
  }
}
```

### Pagination

Use cursor-based pagination for large result sets:

```bash
# First page
curl "https://api.lanonasis.com/v1/wallets?limit=20"

# Next page
curl "https://api.lanonasis.com/v1/wallets?limit=20&cursor=eyJsYXN0X2lkIjoid2FsXzl6OHk3eDZ3NXYifQ=="
```

## Wallet Statuses

| Status | Description |
|--------|-------------|
| `active` | Normal operation |
| `frozen` | Temporarily blocked (can be unfrozen) |
| `suspended` | Under review |
| `closed` | Permanently closed |

## Funding a Wallet

Wallets can be funded in several ways:

### 1. Bank Transfer (Virtual Account)
Each wallet has a dedicated virtual account number. Funds sent to this account are automatically credited.

```json
{
  "account_number": "8012345678",
  "bank_name": "Providus Bank",
  "account_name": "LanOnasis/John Doe"
}
```

### 2. Card Payment
Use the [Payments API](/unified-services/payments) to collect card payments into a wallet.

### 3. Wallet-to-Wallet Transfer
Use the [Transfers API](/unified-services/transfers) to transfer from another wallet.

## SDK Examples

### TypeScript

```typescript
import { LanOnasisClient } from '@lanonasis/sdk';

const client = new LanOnasisClient({ apiKey: 'sk_live_xxx' });

// Create wallet
const wallet = await client.wallets.create({
  customer_id: 'cust_123',
  currency: 'NGN',
  type: 'personal'
});

// Get balance
const balance = await client.wallets.getBalance(wallet.data.id);
console.log(`Available: ${balance.data.available / 100} NGN`);

// List wallets
const wallets = await client.wallets.list({ customer_id: 'cust_123' });
```

### Python

```python
from lanonasis import LanOnasisClient

client = LanOnasisClient(api_key='sk_live_xxx')

# Create wallet
wallet = client.wallets.create(
    customer_id='cust_123',
    currency='NGN',
    type='personal'
)

# Get balance
balance = client.wallets.get_balance(wallet.data.id)
print(f"Available: {balance.data.available / 100} NGN")
```

## Webhooks

Subscribe to wallet events:

- `wallet.created` - New wallet created
- `wallet.credited` - Funds added
- `wallet.debited` - Funds removed
- `wallet.frozen` - Wallet frozen
- `wallet.closed` - Wallet closed

See [Webhooks](/unified-services/webhooks) for details.
