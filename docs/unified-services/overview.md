---
sidebar_position: 1
title: Overview
description: Introduction to LanOnasis Unified Services API
---

# Unified Services API

The LanOnasis Unified Services API provides a single, consistent interface for financial operations across multiple providers. Instead of integrating with each payment provider separately, you integrate once with our API and we handle the complexity.

## What You Can Build

- **Digital Wallets** - Create and manage wallets for your customers
- **Money Transfers** - Send money to wallets or bank accounts instantly
- **Payment Collection** - Accept payments via cards, bank transfers, USSD
- **Identity Verification** - KYC verification with BVN, NIN, phone, and more
- **Virtual Cards** - Issue virtual cards for your customers (coming soon)

## Architecture

```
Your Application
       │
       ▼
┌──────────────────┐
│  Unified API     │  ← Single integration point
│  (LanOnasis)     │
└──────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│         Provider Adapters            │
├──────────┬───────────┬───────────────┤
│ Providus │ Paystack  │ Flutterwave   │
│ (NIP)    │ (Cards)   │ (Multi)       │
└──────────┴───────────┴───────────────┘
```

## Key Features

### Provider Abstraction
Switch between providers without changing your code. We automatically route to the best provider based on:
- Transaction type and amount
- Provider availability and latency
- Cost optimization

### Idempotency
All POST operations support idempotency keys. If a request fails mid-flight, simply retry with the same key - we guarantee at-most-once execution.

```bash
curl -X POST https://api.lanonasis.com/v1/transfers \
  -H "X-API-Key: your_api_key" \
  -H "Idempotency-Key: unique_request_id_123" \
  -d '{"amount": 50000, ...}'
```

### Real-time Webhooks
Get instant notifications for all events:
- `transfer.completed` / `transfer.failed`
- `payment.successful` / `payment.failed`
- `wallet.credited` / `wallet.debited`
- `kyc.verified` / `kyc.failed`

### Sandbox Environment
Test your integration without real money:
- **Production**: `https://api.lanonasis.com/v1`
- **Sandbox**: `https://sandbox.lanonasis.com/v1`

## Quick Example

```typescript
import { LanOnasisClient } from '@lanonasis/sdk';

const client = new LanOnasisClient({
  apiKey: process.env.LANONASIS_API_KEY,
  environment: 'sandbox'
});

// Create a wallet
const wallet = await client.wallets.create({
  customer_id: 'cust_123',
  currency: 'NGN'
});

// Initiate a bank transfer
const transfer = await client.transfers.create({
  source_wallet_id: wallet.data.id,
  amount: 100000, // N1,000.00 in kobo
  currency: 'NGN',
  destination: {
    type: 'bank',
    account_number: '0123456789',
    bank_code: '058',
    account_name: 'John Doe'
  },
  narration: 'Payment for services'
});

console.log(transfer.data.status); // 'pending'
```

## Next Steps

1. [Authentication](/unified-services/authentication) - Get your API keys
2. [Wallets](/unified-services/wallets) - Create and manage wallets
3. [Transfers](/unified-services/transfers) - Send money
4. [Payments](/unified-services/payments) - Accept payments
5. [KYC](/unified-services/kyc) - Verify identities
6. [Webhooks](/unified-services/webhooks) - Handle events
