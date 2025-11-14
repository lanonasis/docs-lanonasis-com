---
sidebar_position: 4
title: Configuration
description: Configure v-secure for your environment
---

# Configuration

Configure v-secure to work optimally in your environment. This guide covers CLI configuration, SDK options, environment variables, and advanced settings.

## CLI Configuration

### Interactive Setup

Run the interactive configuration wizard:

```bash
vsecure config:init
```

This will guide you through:
- API endpoint selection
- Authentication method
- Default region
- Output preferences
- Logging options

### Manual Configuration

Set configuration values directly:

```bash
# Set API endpoint
vsecure config:set endpoint https://api.lanonasis.com/v1/security

# Set default region
vsecure config:set region us-east-1

# Set output format
vsecure config:set output json

# Enable debug logging
vsecure config:set debug true
```

### View Configuration

```bash
# View all settings
vsecure config:show

# View specific setting
vsecure config:get endpoint

# View configuration file location
vsecure config:path
```

### Configuration File

The CLI stores configuration in `~/.vsecure/config.json`:

```json
{
  "endpoint": "https://api.lanonasis.com/v1/security",
  "region": "us-east-1",
  "output": "json",
  "debug": false,
  "timeout": 30000,
  "retries": 3,
  "verify_ssl": true
}
```

## Environment Variables

### Authentication

```bash
# API Key (required)
export VSECURE_API_KEY="your-api-key-here"

# Alternative: use service account
export VSECURE_SERVICE_ACCOUNT="path/to/service-account.json"
```

### Endpoint Configuration

```bash
# Custom API endpoint
export VSECURE_ENDPOINT="https://api.lanonasis.com/v1/security"

# Region
export VSECURE_REGION="us-east-1"
```

### Behavior Options

```bash
# Enable debug logging
export VSECURE_DEBUG=true

# Set timeout (milliseconds)
export VSECURE_TIMEOUT=30000

# Disable SSL verification (not recommended)
export VSECURE_VERIFY_SSL=false

# Set log level
export VSECURE_LOG_LEVEL=info
```

### Complete Example

Create a `.env` file for your project:

```bash
# .env
VSECURE_API_KEY=vsec_key_abc123xyz
VSECURE_ENDPOINT=https://api.lanonasis.com/v1/security
VSECURE_REGION=us-east-1
VSECURE_TIMEOUT=30000
VSECURE_LOG_LEVEL=info
```

## SDK Configuration

### TypeScript/Node.js

```typescript
import { VSecureClient } from '@lanonasis/v-secure-sdk';

const client = new VSecureClient({
  // Authentication
  apiKey: process.env.VSECURE_API_KEY,

  // Endpoint
  endpoint: 'https://api.lanonasis.com/v1/security',
  region: 'us-east-1',

  // Timeouts
  timeout: 30000,
  connectTimeout: 10000,

  // Retry configuration
  retries: 3,
  retryDelay: 1000,
  retryBackoff: 2,

  // SSL/TLS
  verifySsl: true,
  caCert: '/path/to/ca-cert.pem',

  // Logging
  logger: console,
  logLevel: 'info',

  // Custom headers
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

### Python

```python
from lanonasis_vsecure import VSecureClient

client = VSecureClient(
    # Authentication
    api_key=os.environ['VSECURE_API_KEY'],

    # Endpoint
    endpoint='https://api.lanonasis.com/v1/security',
    region='us-east-1',

    # Timeouts
    timeout=30,
    connect_timeout=10,

    # Retry configuration
    max_retries=3,
    retry_delay=1,

    # SSL/TLS
    verify_ssl=True,
    ca_cert='/path/to/ca-cert.pem',

    # Logging
    log_level='INFO'
)
```

### Go

```go
import "github.com/lanonasis/vsecure-go"

client := vsecure.NewClient(
    // Authentication
    vsecure.WithAPIKey(os.Getenv("VSECURE_API_KEY")),

    // Endpoint
    vsecure.WithEndpoint("https://api.lanonasis.com/v1/security"),
    vsecure.WithRegion("us-east-1"),

    // Timeouts
    vsecure.WithTimeout(30 * time.Second),

    // Retry configuration
    vsecure.WithMaxRetries(3),

    // Logging
    vsecure.WithLogger(logger),
)
```

## Regional Configuration

v-secure is available in multiple regions for optimal performance and compliance.

### Available Regions

```bash
# North America
us-east-1     # US East (Virginia)
us-west-2     # US West (Oregon)
ca-central-1  # Canada (Central)

# Europe
eu-west-1     # Europe (Ireland)
eu-central-1  # Europe (Frankfurt)

# Asia Pacific
ap-southeast-1  # Asia Pacific (Singapore)
ap-northeast-1  # Asia Pacific (Tokyo)
```

### Set Default Region

```bash
vsecure config:set region eu-west-1
```

### Per-Request Region

```typescript
// Override region for specific request
const secret = await client.secrets.get('DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  region: 'eu-west-1'
});
```

## Encryption Configuration

### Key Management

v-secure uses AES-256-GCM encryption by default. Configure encryption options:

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  // Client-side encryption
  encryption: {
    enabled: true,
    algorithm: 'aes-256-gcm',

    // Bring your own key (BYOK)
    masterKey: process.env.ENCRYPTION_KEY,

    // Key rotation
    keyRotationPeriod: 90 // days
  }
});
```

### Envelope Encryption

Enable envelope encryption for enhanced security:

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,
  encryption: {
    envelope: {
      enabled: true,
      kmsProvider: 'aws-kms',
      kmsKeyId: 'arn:aws:kms:us-east-1:123456789:key/abc-123'
    }
  }
});
```

## Caching Configuration

### Enable Local Caching

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  cache: {
    enabled: true,
    ttl: 300, // seconds
    maxSize: 100, // MB
    storage: 'memory' // or 'disk'
  }
});
```

### Redis Caching

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  cache: {
    enabled: true,
    ttl: 300,
    storage: 'redis',
    redis: redis
  }
});
```

## Proxy Configuration

### HTTP/HTTPS Proxy

```bash
# Set proxy via environment variables
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=https://proxy.example.com:8443
export NO_PROXY=localhost,127.0.0.1
```

### SDK Proxy Configuration

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  proxy: {
    host: 'proxy.example.com',
    port: 8080,
    auth: {
      username: 'proxyuser',
      password: 'proxypass'
    }
  }
});
```

## Logging Configuration

### CLI Logging

```bash
# Set log level
vsecure config:set log-level debug

# Enable file logging
vsecure config:set log-file ~/.vsecure/logs/vsecure.log

# Set log format
vsecure config:set log-format json
```

### SDK Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'vsecure.log' })
  ]
});

const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,
  logger: logger,
  logLevel: 'debug'
});
```

## Rate Limiting

Configure rate limiting behavior:

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  rateLimit: {
    enabled: true,
    maxRequests: 100,
    perMilliseconds: 60000, // per minute

    // Behavior when rate limit hit
    strategy: 'wait', // 'wait', 'error', or 'ignore'
    maxWaitTime: 30000 // max wait time in ms
  }
});
```

## High Availability

### Automatic Failover

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  highAvailability: {
    enabled: true,

    // Fallback endpoints
    endpoints: [
      'https://api.lanonasis.com/v1/security',
      'https://api-backup.lanonasis.com/v1/security'
    ],

    // Health check interval
    healthCheckInterval: 30000,

    // Failover strategy
    strategy: 'priority' // or 'round-robin'
  }
});
```

### Circuit Breaker

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  circuitBreaker: {
    enabled: true,
    threshold: 5, // failures before opening circuit
    timeout: 60000, // time before attempting to close
    halfOpenRequests: 3 // requests to test in half-open state
  }
});
```

## Performance Tuning

### Connection Pooling

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  connectionPool: {
    maxConnections: 50,
    maxIdleTime: 30000,
    keepAlive: true
  }
});
```

### Batch Operations

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  batch: {
    enabled: true,
    maxBatchSize: 100,
    maxWaitTime: 1000 // ms
  }
});

// Automatically batched
await Promise.all([
  client.secrets.get('SECRET_1'),
  client.secrets.get('SECRET_2'),
  client.secrets.get('SECRET_3')
]);
```

## Security Hardening

### TLS Configuration

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  tls: {
    minVersion: 'TLSv1.3',
    ciphers: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256'
    ],
    rejectUnauthorized: true,
    checkServerIdentity: true
  }
});
```

### Certificate Pinning

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  certificatePinning: {
    enabled: true,
    pins: [
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB='
    ]
  }
});
```

## Compliance Configuration

### Audit Logging

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  audit: {
    enabled: true,
    logLevel: 'detailed', // 'basic', 'detailed', or 'verbose'

    // Custom audit log handler
    handler: async (event) => {
      await sendToSIEM(event);
    }
  }
});
```

### Data Residency

```typescript
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,

  dataResidency: {
    // Enforce data stays in specific regions
    allowedRegions: ['eu-west-1', 'eu-central-1'],

    // Prevent cross-region replication
    disableCrossRegion: true
  }
});
```

## Development vs Production

### Development Configuration

```typescript
// .env.development
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,
  endpoint: 'http://localhost:3000/api/v1/security',
  logLevel: 'debug',
  verifySsl: false,
  cache: { enabled: false }
});
```

### Production Configuration

```typescript
// .env.production
const client = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY,
  endpoint: 'https://api.lanonasis.com/v1/security',
  region: 'us-east-1',
  logLevel: 'error',
  verifySsl: true,
  tls: { minVersion: 'TLSv1.3' },
  cache: { enabled: true, ttl: 300 },
  highAvailability: { enabled: true },
  circuitBreaker: { enabled: true }
});
```

## Configuration Validation

Validate your configuration:

```bash
# CLI validation
vsecure config:validate

# Test connection
vsecure config:test

# Run diagnostics
vsecure doctor
```

## Next Steps

- [Getting Started](./getting-started) - Quick start guide
- [API Reference](./api/overview) - API documentation
- [Compliance Overview](./compliance/overview) - Security standards
