---
title: API Overview
sidebar_position: 1
---

# API Reference

Welcome to the LanOnasis API documentation. Our REST API provides complete access to the Memory-as-a-Service platform with comprehensive endpoints for memory management, search, analytics, and real-time features.

## Base URL
```
https://api.lanonasis.com/api/v1
```

## Authentication

All API requests require authentication using an API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.lanonasis.com/api/v1/memory
```

## Quick Start

Get started with our API in minutes:

```typescript
import { MemoryClient } from '@LanOnasis/memory-sdk';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

// Create a memory
const memory = await client.createMemory({
  content: 'Important project notes',
  metadata: { project: 'web-app' },
  tags: ['work', 'important']
});

// Search memories
const results = await client.searchMemories('project notes');
```

## Available Endpoints

### Core Memory Operations
- [`POST /memory`](/api/endpoints/memory#create-memory) - Create a new memory
- [`GET /memory/:id`](/api/endpoints/memory#get-memory) - Get a specific memory
- [`PUT /memory/:id`](/api/endpoints/memory#update-memory) - Update a memory
- [`DELETE /memory/:id`](/api/endpoints/memory#delete-memory) - Delete a memory

### Search & Discovery
- [`POST /search`](/api/endpoints/search) - Semantic search across memories
- [`POST /embeddings`](/api/endpoints/embeddings) - Generate vector embeddings

### Batch Operations
- [`POST /batch`](/api/endpoints/batch) - Perform multiple operations in a single request

### Real-time Features
- [`GET /stream`](/api/endpoints/stream) - Server-sent events for real-time updates
- [`POST /webhooks`](/api/endpoints/webhooks) - Configure webhook notifications

### Analytics & Monitoring
- [`GET /analytics`](/api/endpoints/analytics) - Retrieve usage analytics and metrics

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "metadata": {
    "request_id": "req_1234567890",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

## Rate Limits

| Tier | Requests/Minute | Requests/Hour | Burst Limit |
|------|----------------|---------------|-------------|
| Free | 60 | 1,000 | 100 |
| Pro | 300 | 10,000 | 500 |
| Enterprise | Custom | Custom | Custom |

## SDKs & Libraries

We provide official SDKs for popular languages:

- **TypeScript/JavaScript**: `@LanOnasis/memory-sdk`
- **Python**: `lanonasis-python`
- **CLI**: `lanonasis-cli`

[View all SDKs →](/sdks/overview)

## Interactive API Explorer

Try our API directly in your browser with our interactive explorer:

[Open API Explorer →](https://api.lanonasis.com/explorer)

## Support

Need help? We're here to assist:

- **Documentation**: Browse our comprehensive guides
- **Community**: Join our Discord community
- **Support**: Contact our support team
- **Status**: Check our system status

[Get Support →](/support)
