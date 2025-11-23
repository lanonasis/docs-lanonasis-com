---
title: Security SDK
sidebar_label: Security SDK
---

# @lanonasis/security-sdk

Official Security and Encryption SDK for the Lanonasis Ecosystem.

## 🎯 Overview

The Security SDK provides enterprise-grade encryption and secure key management for all Lanonasis services. It implements the three-system security architecture with proper separation between external authentication, internal authentication, and secret storage.

### Key Features

- **AES-256-GCM Encryption** - Industry-standard authenticated encryption for secret storage
- **SHA-256 Hashing** - Fast, secure hashing for external API keys
- **PBKDF2-SHA512** - Slow, secure hashing for internal authentication
- **Key Derivation** - HKDF and PBKDF2 support for secure key generation
- **Key Rotation** - Seamless credential rotation without downtime
- **API Key Generation** - Cryptographically secure random keys
- **Data Sanitization** - Safe logging utilities for sensitive data
- **TypeScript Support** - Full type safety and IntelliSense

## 📦 Installation

```bash
# NPM
npm install @lanonasis/security-sdk

# Yarn
yarn add @lanonasis/security-sdk

# Bun (recommended)
bun add @lanonasis/security-sdk
```

## 🚀 Quick Start

### Basic Encryption

```typescript
import { SecuritySDK } from '@lanonasis/security-sdk';

// Initialize with master key
const security = new SecuritySDK(process.env.ONASIS_MASTER_KEY);

// Encrypt sensitive data
const encrypted = security.encrypt(
  { stripe_key: 'sk_live_abc123' },
  'user_123_stripe' // context for key derivation
);

// Store encrypted data in database
await db.insert({
  encrypted_value: JSON.stringify(encrypted),
  user_id: 'user_123'
});

// Later: Decrypt when needed
const decrypted = security.decryptJSON(encrypted, 'user_123_stripe');
console.log(decrypted.stripe_key); // 'sk_live_abc123'
```

### API Key Hashing

```typescript
import { hashApiKey, verifyApiKey } from '@lanonasis/security-sdk';

// Hash API key for storage (SHA-256)
const apiKey = 'lns_abc123xyz...';
const hash = hashApiKey(apiKey);

// Store hash in database
await db.insert({
  key_hash: hash,  // 64 hex characters
  user_id: 'user_123'
});

// Later: Verify API key
const isValid = verifyApiKey(apiKey, hash);
if (isValid) {
  // Grant access
}
```

### Secure Token Generation

```typescript
import { generateApiKey, generateToken } from '@lanonasis/security-sdk';

// Generate API key with prefix
const apiKey = generateApiKey(); // 'lns_...' (cryptographically secure)

// Generate random token
const token = generateToken(32); // 64 hex characters
```

## 📚 API Reference

### Encryption Methods

#### `encrypt(data, context, options?)`

Encrypts data using AES-256-GCM.

```typescript
const encrypted = security.encrypt(
  'sensitive-data',
  'user_context',
  { keyId: 'optional-key-id' }
);
// Returns: { encrypted, iv, authTag, keyId }
```

#### `decrypt(encryptedData, context)`

Decrypts previously encrypted data.

```typescript
const decrypted = security.decrypt(encrypted, 'user_context');
// Returns: string (original data)
```

#### `decryptJSON<T>(encryptedData, context)`

Decrypts and parses JSON data.

```typescript
const decrypted = security.decryptJSON<{key: string}>(encrypted, 'user_context');
// Returns: typed object
```

### Hashing Methods

#### `hashApiKey(apiKey: string): string`

Fast SHA-256 hashing for external API keys.

```typescript
const hash = hashApiKey('lns_abc123'); // 64 hex characters
```

#### `verifyApiKey(apiKey: string, hash: string): boolean`

Constant-time verification of API keys.

```typescript
const isValid = verifyApiKey('lns_abc123', storedHash);
```

#### `hash(data, salt?)`

Secure PBKDF2 hashing for passwords/tokens.

```typescript
const hashed = security.hash('password');
const isValid = security.verifyHash('password', hashed);
```

### Utility Methods

#### `sanitize(data, showChars?)`

Sanitizes sensitive data for logging.

```typescript
const sanitized = security.sanitize('sk_live_abc123def456'); 
// Returns: 'sk_l...f456'
```

#### `rotate(oldEncrypted, context, newData?)`

Rotates encryption keys without downtime.

```typescript
const newEncrypted = security.rotate(oldEncrypted, 'user_context');
```

#### `generateApiKey(prefix?)`

Generates cryptographically secure API keys.

```typescript
const apiKey = generateApiKey(); // 'lns_...'
```

#### `generateToken(bytes?)`

Generates random tokens.

```typescript
const token = generateToken(32); // 64 hex characters
```

## 🔐 Security Architecture

### Three-System Model

The Security SDK implements three distinct cryptographic systems:

#### System 1: External API Keys (SHA-256)
- **Purpose**: Authenticate public clients (Dashboard, CLI, SDK)
- **Method**: SHA-256 (one-way hashing)
- **Use Case**: Fast authentication, can't reverse

```typescript
import { hashApiKey } from '@lanonasis/security-sdk';

const hash = hashApiKey('lns_user_key');
// Stored in: public.api_keys.key_hash
```

#### System 2: Internal API Keys (PBKDF2-SHA512)
- **Purpose**: Service-to-service authentication
- **Method**: PBKDF2 with SHA-512 (100k iterations)
- **Use Case**: More secure, intentionally slow

```typescript
const hash = security.hash('internal_service_key');
// Stored in: security_service.api_keys.key_hash
```

#### System 3: Stored Secrets (AES-256-GCM)
- **Purpose**: Store third-party API keys/credentials
- **Method**: AES-256-GCM encryption (reversible)
- **Use Case**: Must retrieve original value

```typescript
const encrypted = security.encrypt('sk_live_stripe_key', 'user_stripe');
// Stored in: security_service.stored_api_keys.encrypted_value
```

## 🛠️ Best Practices

### 1. Master Key Management

```bash
# Generate master key (do once)
import { SecuritySDK } from '@lanonasis/security-sdk';
const masterKey = SecuritySDK.generateMasterKey();

# Store in secure environment
ONASIS_MASTER_KEY=your_64_character_hex_key

# Use different keys per environment
ONASIS_MASTER_KEY_PROD=...
ONASIS_MASTER_KEY_STAGING=...
ONASIS_MASTER_KEY_DEV=...
```

### 2. Context Usage

Always use unique contexts for key derivation:

```typescript
// ✅ GOOD: Unique per user + service
const context = `user_${userId}_${serviceName}`;

// ❌ BAD: Reusing same context
const context = 'stripe'; // Don't do this!
```

### 3. Safe Logging

```typescript
import { sanitize } from '@lanonasis/security-sdk';

// ✅ GOOD: Sanitize before logging
logger.info('API key created', { key: sanitize(apiKey) });

// ❌ BAD: Logging raw secrets
logger.info('API key created', { key: apiKey }); // Never do this!
```

### 4. Key Rotation

```typescript
// Rotate credentials regularly
const rotationSchedule = async () => {
  const oldEncrypted = await db.get('user_credentials');
  const newEncrypted = security.rotate(oldEncrypted, context);
  await db.update({ encrypted_value: newEncrypted });
};
```

## 🔧 Integration Examples

### Express API

```typescript
import { verifyApiKey } from '@lanonasis/security-sdk';

app.use(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'Missing API key' });
  
  const { data } = await db.query(
    'SELECT key_hash FROM api_keys WHERE user_id = $1',
    [req.user.id]
  );
  
  if (!verifyApiKey(apiKey, data.key_hash)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
});
```

### React Hook

```typescript
import { useState, useEffect } from 'react';
import { sanitize } from '@lanonasis/security-sdk';

const useSecureStorage = () => {
  const [keys, setKeys] = useState([]);
  
  const storeKey = async (name: string, value: string) => {
    // Send to backend for encryption
    await fetch('/api/keys', {
      method: 'POST',
      body: JSON.stringify({ name, value }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Log sanitized version
    console.log('Stored key:', sanitize(value));
  };
  
  return { keys, storeKey };
};
```

### Nest.js Service

```typescript
import { Injectable } from '@nestjs/common';
import { SecuritySDK, getSecuritySDK } from '@lanonasis/security-sdk';

@Injectable()
export class EncryptionService {
  private security: SecuritySDK;
  
  constructor() {
    this.security = getSecuritySDK();
  }
  
  async encryptUserCredential(userId: string, credential: any) {
    const encrypted = this.security.encrypt(
      credential,
      `user_${userId}_credentials`
    );
    
    await this.db.insert({
      user_id: userId,
      encrypted_value: JSON.stringify(encrypted)
    });
  }
}
```

## 🧪 Testing

```typescript
import { SecuritySDK } from '@lanonasis/security-sdk';

describe('SecuritySDK', () => {
  let security: SecuritySDK;
  
  beforeEach(() => {
    security = new SecuritySDK(SecuritySDK.generateMasterKey());
  });
  
  it('should encrypt and decrypt data', () => {
    const data = { secret: 'test' };
    const encrypted = security.encrypt(data, 'test-context');
    const decrypted = security.decryptJSON(encrypted, 'test-context');
    
    expect(decrypted).toEqual(data);
  });
  
  it('should hash and verify API keys', () => {
    const apiKey = 'lns_test_key';
    const hash = hashApiKey(apiKey);
    
    expect(verifyApiKey(apiKey, hash)).toBe(true);
    expect(verifyApiKey('wrong_key', hash)).toBe(false);
  });
});
```

## 📖 Related Documentation

- [API Authentication](../api/authentication.md)
- [Security Best Practices](../security/privacy-implementation.md)
- [Key Management Guide](../guides/key-management.md)
- [Three-System Architecture](../platform/architecture.md)

## 🆘 Troubleshooting

### "Invalid encrypted data format"

Ensure encrypted data has all required fields:

```typescript
const encrypted = {
  encrypted: '...',  // Required
  iv: '...',         // Required
  authTag: '...',    // Required
  keyId: '...'       // Optional
};
```

### "Master key not set"

Set the `ONASIS_MASTER_KEY` environment variable:

```bash
export ONASIS_MASTER_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

### "Decryption failed"

Ensure you're using the same context for encrypt/decrypt:

```typescript
// ✅ GOOD
const encrypted = security.encrypt(data, 'user_123');
const decrypted = security.decrypt(encrypted, 'user_123'); // Same context

// ❌ BAD
const encrypted = security.encrypt(data, 'user_123');
const decrypted = security.decrypt(encrypted, 'user_456'); // Wrong context!
```

## 📦 Package Details

- **Package**: `@lanonasis/security-sdk`
- **Version**: 1.0.0
- **License**: MIT
- **Repository**: [GitHub](https://github.com/lanonasis/security-sdk)
- **NPM**: [npmjs.com](https://www.npmjs.com/package/@lanonasis/security-sdk)

## 💡 Support

- **Documentation**: [docs.lanonasis.com/sdks/security-sdk](https://docs.lanonasis.com/sdks/security-sdk)
- **Issues**: [GitHub Issues](https://github.com/lanonasis/security-sdk/issues)
- **Email**: security@lanonasis.com
- **Discord**: [Join our community](https://discord.gg/lanonasis)
