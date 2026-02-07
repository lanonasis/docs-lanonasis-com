---
title: Security SDK
sidebar_label: SDK Reference
---

# @lanonasis/security-sdk

Centralized Security and Encryption SDK for the LanOnasis ecosystem. Provides AES-256-GCM encryption, key derivation, secure hashing, and API key generation.

## Installation

```bash
npm install @lanonasis/security-sdk
# or
yarn add @lanonasis/security-sdk
# or
bun add @lanonasis/security-sdk
```

**Package Name**: `@lanonasis/security-sdk`  
**Version**: 1.0.0  
**License**: MIT

## Quick Start

```typescript
import { SecuritySDK, getSecuritySDK } from '@lanonasis/security-sdk';

// Initialize with master key
const security = new SecuritySDK(process.env.ONASIS_MASTER_KEY);

// Or use singleton
const security = getSecuritySDK();

// Encrypt data
const encrypted = security.encrypt(
  { api_key: 'sk_live_abc123' },
  'user_123_stripe'
);

// Decrypt data
const decrypted = security.decryptJSON(encrypted, 'user_123_stripe');
console.log(decrypted.api_key); // 'sk_live_abc123'
```

## Configuration

### Environment Variables

```env
# Required: 32-byte (64 hex characters) master key
ONASIS_MASTER_KEY=your_64_character_hex_key

# Alternative name (for backward compatibility)
VSECURE_MASTER_KEY=your_64_character_hex_key
```

### Generate Master Key

```typescript
import { SecuritySDK } from '@lanonasis/security-sdk';

// Generate a new master key (do this once, store securely)
const masterKey = SecuritySDK.generateMasterKey();
console.log(masterKey); // 64 hex characters
```

## API Reference

### SecuritySDK Class

#### Constructor

```typescript
new SecuritySDK(masterKeyHex?: string)
```

**Parameters:**
- `masterKeyHex` (optional): 64-character hex string. If not provided, reads from `ONASIS_MASTER_KEY` or `VSECURE_MASTER_KEY` environment variable.

**Throws:**
- `Error`: If master key is missing or invalid length

### Encryption Methods

#### `encrypt(data, context, options?)`

Encrypt data with AES-256-GCM.

```typescript
encrypt(
  data: string | object,
  context: string,
  options?: EncryptionOptions
): EncryptedData
```

**Parameters:**
- `data`: Data to encrypt (string or object)
- `context`: Context for key derivation (e.g., "user_123_stripe")
- `options` (optional):
  - `algorithm`: "aes-256-gcm" | "aes-256-cbc" (default: "aes-256-gcm")
  - `keyDerivation`: "hkdf" | "pbkdf2" (default: "hkdf")
  - `iterations`: Number of PBKDF2 iterations (default: 100000)

**Returns:** `EncryptedData` object with:
- `encrypted`: Hex-encoded encrypted data
- `iv`: Initialization vector (hex)
- `authTag`: Authentication tag (hex, for GCM)
- `keyId`: Unique key identifier
- `algorithm`: Encryption algorithm used
- `version`: SDK version

**Example:**
```typescript
const encrypted = security.encrypt(
  { stripe_key: 'sk_live_abc123' },
  'user_123_stripe'
);

// Store encrypted.encrypted, encrypted.iv, encrypted.authTag, encrypted.keyId in database
```

#### `decrypt(encryptedData, context)`

Decrypt encrypted data.

```typescript
decrypt(encryptedData: EncryptedData, context: string): string
```

**Parameters:**
- `encryptedData`: Encrypted data object
- `context`: Context for key derivation (must match encryption context)

**Returns:** Decrypted string

**Throws:**
- `Error`: If decryption fails (invalid key, corrupted data, etc.)

**Example:**
```typescript
const decrypted = security.decrypt(encrypted, 'user_123_stripe');
```

#### `decryptJSON<T>(encryptedData, context)`

Decrypt and parse as JSON.

```typescript
decryptJSON<T = any>(encryptedData: EncryptedData, context: string): T
```

**Example:**
```typescript
const decrypted = security.decryptJSON<{ stripe_key: string }>(
  encrypted,
  'user_123_stripe'
);
console.log(decrypted.stripe_key); // 'sk_live_abc123'
```

#### `rotate(oldEncrypted, context, newData?)`

Rotate encryption (decrypt with old key, encrypt with new key).

```typescript
rotate(
  oldEncrypted: EncryptedData,
  context: string,
  newData?: string | object
): EncryptedData
```

**Parameters:**
- `oldEncrypted`: Previously encrypted data
- `context`: Context for key derivation
- `newData` (optional): New data to encrypt. If not provided, decrypts old data and re-encrypts.

**Returns:** New `EncryptedData` object

**Example:**
```typescript
// Rotate with same data
const newEncrypted = security.rotate(oldEncrypted, 'user_123_stripe');

// Rotate with new data
const newEncrypted = security.rotate(
  oldEncrypted,
  'user_123_stripe',
  { stripe_key: 'sk_live_new_key' }
);
```

### Hashing Methods

#### `hash(data, salt?)`

Create secure hash (for passwords, tokens, etc.).

```typescript
hash(data: string, salt?: string): string
```

**Parameters:**
- `data`: Data to hash
- `salt` (optional): Salt string. If not provided, generates random salt.

**Returns:** Hash string in format `salt:hash` (hex-encoded)

**Example:**
```typescript
const hashed = security.hash('user-password');
// Returns: "random_salt:hash_value"
```

#### `verifyHash(data, hashedData)`

Verify hash.

```typescript
verifyHash(data: string, hashedData: string): boolean
```

**Example:**
```typescript
const isValid = security.verifyHash('user-password', hashed);
// Returns: true if password matches hash
```

### Key Generation

#### `generateToken(bytes?)`

Generate secure random token.

```typescript
generateToken(bytes: number = 32): string
```

**Parameters:**
- `bytes`: Number of random bytes (default: 32)

**Returns:** Hex-encoded token (2x bytes length)

**Example:**
```typescript
const token = security.generateToken(32); // 64 hex characters
const shortToken = security.generateToken(16); // 32 hex characters
```

#### `generateAPIKey(prefix?)`

Generate API key with prefix.

```typescript
generateAPIKey(prefix: string = "onasis"): string
```

**Example:**
```typescript
const apiKey = security.generateAPIKey('lanonasis');
// Returns: "lanonasis_abc123def456..."
```

### Utility Methods

#### `sanitize(data, showChars?)`

Sanitize sensitive data for logging.

```typescript
sanitize(data: string, showChars: number = 4): string
```

**Example:**
```typescript
const sanitized = security.sanitize('sk_live_abc123def456');
// Returns: "sk_l...f456"
```

#### `isValidEncryptedData(data)`

Validate encrypted data structure.

```typescript
isValidEncryptedData(data: any): data is EncryptedData
```

**Example:**
```typescript
if (security.isValidEncryptedData(data)) {
  const decrypted = security.decrypt(data, context);
}
```

### Static Methods

#### `SecuritySDK.generateMasterKey()`

Generate a new master key for initial setup.

```typescript
static generateMasterKey(): string
```

**Returns:** 64-character hex string

**Example:**
```typescript
const masterKey = SecuritySDK.generateMasterKey();
// Store this securely - it won't be shown again!
```

### Singleton Pattern

#### `getSecuritySDK(masterKey?)`

Get singleton instance of SecuritySDK.

```typescript
getSecuritySDK(masterKey?: string): SecuritySDK
```

**Example:**
```typescript
// First call creates instance
const security1 = getSecuritySDK();

// Subsequent calls return same instance
const security2 = getSecuritySDK();
// security1 === security2
```

## Type Definitions

### EncryptedData

```typescript
interface EncryptedData {
  encrypted: string;    // Hex-encoded encrypted data
  iv: string;           // Hex-encoded initialization vector
  authTag: string;      // Hex-encoded authentication tag (GCM)
  keyId: string;        // Unique key identifier
  algorithm: string;    // Encryption algorithm
  version: string;      // SDK version
}
```

### EncryptionOptions

```typescript
interface EncryptionOptions {
  algorithm?: "aes-256-gcm" | "aes-256-cbc";
  keyDerivation?: "hkdf" | "pbkdf2";
  iterations?: number;
}
```

## Usage Examples

### Basic Encryption/Decryption

```typescript
import { SecuritySDK } from '@lanonasis/security-sdk';

const security = new SecuritySDK(process.env.ONASIS_MASTER_KEY);

// Encrypt user credentials
const encrypted = security.encrypt(
  { stripe_key: "sk_live_abc123" },
  "user_123_stripe"
);

// Store in database
await db.insert('encrypted_secrets', {
  user_id: 'user_123',
  service: 'stripe',
  encrypted_data: encrypted.encrypted,
  iv: encrypted.iv,
  auth_tag: encrypted.authTag,
  key_id: encrypted.keyId,
  algorithm: encrypted.algorithm
});

// Later, decrypt
const row = await db.select('encrypted_secrets', { user_id: 'user_123' });
const encryptedData = {
  encrypted: row.encrypted_data,
  iv: row.iv,
  authTag: row.auth_tag,
  keyId: row.key_id,
  algorithm: row.algorithm,
  version: '1.0'
};

const decrypted = security.decryptJSON(encryptedData, 'user_123_stripe');
console.log(decrypted.stripe_key); // 'sk_live_abc123'
```

### Key Rotation

```typescript
// Rotate credentials (generates new key)
const oldEncrypted = await getEncryptedFromDB();
const newEncrypted = security.rotate(oldEncrypted, 'user_123_stripe');

// Update database
await db.update('encrypted_secrets', {
  encrypted_data: newEncrypted.encrypted,
  iv: newEncrypted.iv,
  auth_tag: newEncrypted.authTag,
  key_id: newEncrypted.keyId
});
```

### Password Hashing

```typescript
// Hash password
const hashed = security.hash('user-password');

// Store in database
await db.insert('users', {
  email: 'user@example.com',
  password_hash: hashed
});

// Verify password
const user = await db.select('users', { email: 'user@example.com' });
const isValid = security.verifyHash('user-password', user.password_hash);
```

### API Key Generation

```typescript
// Generate API key
const apiKey = security.generateAPIKey('lanonasis');
// Returns: "lanonasis_abc123def456..."

// Generate random token
const token = security.generateToken(32);
// Returns: 64 hex characters
```

### Data Sanitization

```typescript
// Sanitize for logging
const apiKey = 'sk_live_abc123def456';
const sanitized = security.sanitize(apiKey);
console.log(sanitized); // "sk_l...f456"

// Use in logs
logger.info('API call', {
  api_key: security.sanitize(apiKey),
  endpoint: '/api/v1/memories'
});
```

## Security Best Practices

1. **Master Key Storage**
   - Store master key in environment variables or secure key management service
   - Never commit master key to version control
   - Rotate master key periodically (requires re-encryption of all data)

2. **Context Usage**
   - Use unique, descriptive contexts for key derivation
   - Format: `{user_id}_{service}` or `{project_id}_{resource}`
   - Never reuse contexts across different data types

3. **Key Rotation**
   - Rotate encryption keys regularly (90 days recommended)
   - Use `rotate()` method for seamless key rotation
   - Update all encrypted data when rotating master key

4. **Error Handling**
   - Always handle decryption errors gracefully
   - Log errors without exposing sensitive data
   - Use `isValidEncryptedData()` before decryption

5. **Performance**
   - Cache SecuritySDK instance (use singleton)
   - Use HKDF for better performance (default)
   - Consider async operations for large data

## Integration with Security Service

This SDK is used by the [Security Service](../security-service/README.md) for:

- Encrypting vendor API keys
- Storing secrets securely
- Key rotation workflows
- Audit logging (sanitized data)

See [Security Service Documentation](../security-service/README.md) for complete integration guide.

## Related Documentation

- [Security Service](../security-service/README.md) - Complete security service documentation
- [API Overview](./api/overview.md) - REST API reference
- [Installation](./installation.md) - Installation guide
- [Configuration](./configuration.md) - Configuration options

