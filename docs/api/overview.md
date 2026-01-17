---
title: API Overview
sidebar_position: 1
---

# LanOnasis API Reference

Welcome to the LanOnasis API documentation. Our REST API provides complete access to the Memory-as-a-Service platform with comprehensive endpoints for memory management, search, analytics, and real-time features.
Welcome to the LanOnasis Memory-as-a-Service API documentation. Our REST API allows you to integrate powerful memory management and semantic search capabilities into your applications.

## Base URL

```
https://api.lanonasis.com/api/v1
Production: https://api.lanonasis.com/api/v1
Sandbox:    https://sandbox-api.lanonasis.com/api/v1
```

## Authentication

All API requests require authentication. Use an API key header for key-based auth or a bearer token for OAuth/JWT:

```http
X-API-Key: lms_live_your_key_here
Authorization: Bearer YOUR_TOKEN (OAuth/JWT)
Content-Type: application/json
```

## Quick Start

```bash
curl -H "X-API-Key: lms_live_your_key_here" \
  https://api.lanonasis.com/api/v1/memory
```

## Quick Start

Get started with our API in minutes:

```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: 'your-api-key'
});

// Create a memory
const created = await client.createMemory({
  title: 'Project Notes',
  content: 'Important project notes',
  metadata: { project: 'web-app' },
  tags: ['work', 'important']
});

if (created.data) {
  console.log('Memory ID:', created.data.id);
}

// Search memories
const results = await client.searchMemories({
  query: 'project notes',
  limit: 10
});

console.log('Matches:', results.data?.results);
```

```bash
# Create a memory
curl -X POST https://api.lanonasis.com/api/v1/memory \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Notes",
    "content": "Discussed project timeline and deliverables",
    "tags": ["meeting", "project"],
    "metadata": {
      "date": "2024-01-15",
      "participants": ["john", "jane"]
    }
  }'
```

## API Endpoints

### 🧠 Memory Management
- [`POST /memory`](./memories#create-memory) - Create a new memory
- [`GET /memory/{id}`](./memories#get-memory) - Retrieve a memory
- [`PUT /memory/{id}`](./memories#update-memory) - Update a memory
- [`DELETE /memory/{id}`](./memories#delete-memory) - Delete a memory
- [`GET /memory`](./memories#list-memories) - List memories with pagination

### 🔍 Search & Discovery
- [`POST /memory/search`](./endpoints/search#memory-search) - Semantic search across memories

### 🔐 Authentication
- [`POST /auth/keys`](./authentication#create-api-key) - Create API key
- [`GET /auth/keys`](./authentication#list-api-keys) - List API keys
- [`DELETE /auth/keys/{id}`](./authentication#revoke-api-key) - Revoke API key

### 📊 Analytics
- [`GET /analytics/usage`](./analytics#usage-stats) - Usage statistics
- [`GET /analytics/search`](./analytics#search-analytics) - Search analytics

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

## Error Handling

Error responses include detailed information:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "title",
      "issue": "Title is required"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

## Rate Limits

| Plan | Requests/minute | Requests/hour | Storage |
|------|----------------|---------------|----------|
| Free | 100 | 1,000 | 10MB |
| Pro | 1,000 | 10,000 | 1GB |
| Enterprise | 10,000 | 100,000 | Unlimited |

## SDKs & Libraries

We provide official SDKs for popular programming languages:

- [TypeScript/JavaScript SDK](../sdks/typescript)
- [Python SDK](../sdks/python)
- [CLI Tool](../sdks/cli)

## Getting Help

### Core Memory Operations
- [`/api/v1/memory`](/api/endpoints/memory) - Create and list memories
- [`/api/v1/memory/:id`](/api/endpoints/memory) - Get, update, or delete a memory

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

- **TypeScript/JavaScript**: `@lanonasis/memory-client`
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
- 📚 [Guides & Tutorials](../tutorial-basics/create-a-document)
- 💬 [Community Support](../support)
- 🐛 [Report Issues](https://github.com/lanonasis/docs-lanonasis-com/issues)
- 📧 [Contact Support](mailto:support@lanonasis.com)

## Next Steps

1. [Get your API key](./authentication#create-api-key)
2. [Create your first memory](./memories#create-memory)
3. [Try semantic search](./search#semantic-search)
4. [Explore our SDKs](../sdks/overview)
