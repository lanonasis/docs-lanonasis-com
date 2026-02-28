---
sidebar_position: 6
title: KYC Verification
description: Identity verification for customers
---

# KYC Verification

Verify your customers' identities using various verification methods including BVN, NIN, phone, and document verification.

## Verification Types

| Type | Description | Countries |
|------|-------------|-----------|
| `bvn` | Bank Verification Number | Nigeria |
| `nin` | National Identification Number | Nigeria |
| `phone` | Phone number verification | All |
| `passport` | International passport | All |
| `drivers_license` | Driver's license | All |
| `voters_card` | Voter's card | Nigeria |

## Submit Verification

### BVN Verification

```bash
curl -X POST https://api.lanonasis.com/v1/kyc/verify \
  -H "X-API-Key: sk_live_xxx" \
  -H "Idempotency-Key: kyc_cust123_bvn" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "bvn",
    "value": "22222222222",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-05-15"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "ver_abc123",
    "type": "bvn",
    "status": "verified",
    "match": true,
    "confidence": 100,
    "data": {
      "first_name": "JOHN",
      "last_name": "DOE",
      "middle_name": "SMITH",
      "date_of_birth": "1990-05-15",
      "phone_number": "+2348012345678",
      "gender": "male",
      "nationality": "Nigerian",
      "photo_url": "https://storage.lanonasis.com/kyc/photos/abc123.jpg"
    },
    "verified_at": "2024-01-15T14:30:00Z"
  }
}
```

### NIN Verification

```bash
curl -X POST https://api.lanonasis.com/v1/kyc/verify \
  -H "X-API-Key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "nin",
    "value": "12345678901",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Phone Verification

```bash
curl -X POST https://api.lanonasis.com/v1/kyc/verify \
  -H "X-API-Key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "phone",
    "value": "+2348012345678"
  }'
```

Phone verification returns carrier information:

```json
{
  "success": true,
  "data": {
    "id": "ver_xyz789",
    "type": "phone",
    "status": "verified",
    "match": true,
    "data": {
      "phone_number": "+2348012345678",
      "carrier": "MTN Nigeria",
      "line_type": "mobile",
      "is_active": true,
      "is_ported": false
    }
  }
}
```

## Verification Statuses

| Status | Description |
|--------|-------------|
| `verified` | Verification successful, data matches |
| `failed` | Verification failed or data doesn't match |
| `pending` | Verification in progress (async) |
| `expired` | Verification result expired |

## Match vs Verification

- **`status: "verified"`** means we successfully retrieved the data
- **`match: true`** means the provided details match the retrieved data

```json
{
  "status": "verified",
  "match": false,
  "data": {
    "first_name": "JOHN",
    "last_name": "DOE"
  }
}
```

The above means: BVN is valid, but the name provided doesn't match.

## Get Verification Status

```bash
curl https://api.lanonasis.com/v1/kyc/ver_abc123 \
  -H "X-API-Key: sk_live_xxx"
```

## Business Verification

Verify business registration (CAC) and tax identification (TIN):

### CAC Verification

```bash
curl -X POST https://api.lanonasis.com/v1/kyc/verify \
  -H "X-API-Key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cac",
    "value": "RC123456",
    "business_name": "Acme Corporation Ltd"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "ver_biz123",
    "type": "cac",
    "status": "verified",
    "match": true,
    "data": {
      "registration_number": "RC123456",
      "business_name": "ACME CORPORATION LIMITED",
      "registration_date": "2015-03-20",
      "business_status": "active",
      "business_address": "123 Business Avenue, Lagos",
      "directors": [
        {
          "name": "John Doe",
          "designation": "Director"
        }
      ]
    }
  }
}
```

## Sandbox Testing

Use these test values in sandbox:

| Type | Test Value | Result |
|------|------------|--------|
| BVN | `22222222222` | Success, verified |
| BVN | `11111111111` | Failed, not found |
| NIN | `12345678901` | Success, verified |
| Phone | `+2348000000000` | Success, verified |

## Confidence Scores

Verification results include a confidence score (0-100):

| Score | Meaning |
|-------|---------|
| 90-100 | High confidence match |
| 70-89 | Good match with minor discrepancies |
| 50-69 | Partial match, review recommended |
| 0-49 | Poor match, likely different person |

## SDK Examples

### TypeScript

```typescript
import { LanOnasisClient } from '@lanonasis/sdk';

const client = new LanOnasisClient({ apiKey: 'sk_live_xxx' });

// BVN Verification
const bvnResult = await client.kyc.verify({
  type: 'bvn',
  value: '22222222222',
  first_name: 'John',
  last_name: 'Doe',
  date_of_birth: '1990-05-15'
});

if (bvnResult.data.status === 'verified' && bvnResult.data.match) {
  console.log('Customer verified!');
  console.log('Photo URL:', bvnResult.data.data.photo_url);
}

// Phone Verification
const phoneResult = await client.kyc.verify({
  type: 'phone',
  value: '+2348012345678'
});

console.log('Carrier:', phoneResult.data.data.carrier);
```

### Python

```python
from lanonasis import LanOnasisClient

client = LanOnasisClient(api_key='sk_live_xxx')

# BVN Verification
result = client.kyc.verify(
    type='bvn',
    value='22222222222',
    first_name='John',
    last_name='Doe',
    date_of_birth='1990-05-15'
)

if result.data.status == 'verified' and result.data.match:
    print('Customer verified!')
    print(f"Photo: {result.data.data.photo_url}")
```

## Best Practices

1. **Collect consent** - Always get customer consent before verification
2. **Secure storage** - Don't store raw BVN/NIN values
3. **Use idempotency keys** - Prevent duplicate verification charges
4. **Handle failures gracefully** - Allow manual verification as fallback

## Webhooks

Subscribe to KYC events:

- `kyc.submitted` - Verification submitted
- `kyc.verified` - Successfully verified
- `kyc.failed` - Verification failed

See [Webhooks](/unified-services/webhooks) for details.
