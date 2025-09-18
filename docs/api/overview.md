---
title: API Overview
sidebar_position: 1
---

# LanOnasis API Reference

Welcome to the LanOnasis Memory-as-a-Service API documentation. Our REST API allows you to integrate powerful memory management and semantic search capabilities into your applications.

## Base URL

```
Production: https://api.lanonasis.com/v1
Sandbox:    https://sandbox-api.lanonasis.com/v1
```

## Authentication

All API requests require authentication using API keys. Include your API key in the request headers:

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Quick Start

```bash
# Create a memory
curl -X POST https://api.lanonasis.com/v1/memories \
  -H "Authorization: Bearer YOUR_API_KEY" \
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
- [`POST /memories`](./memories#create-memory) - Create a new memory
- [`GET /memories/{id}`](./memories#get-memory) - Retrieve a memory
- [`PUT /memories/{id}`](./memories#update-memory) - Update a memory
- [`DELETE /memories/{id}`](./memories#delete-memory) - Delete a memory
- [`GET /memories`](./memories#list-memories) - List memories with pagination

### 🔍 Search & Discovery
- [`GET /search`](./search#semantic-search) - Semantic search across memories
- [`POST /search/vector`](./search#vector-search) - Vector similarity search
- [`GET /search/suggestions`](./search#autocomplete) - Search autocomplete

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

- 📚 [Guides & Tutorials](../tutorial-basics/create-a-document)
- 💬 [Community Support](../support)
- 🐛 [Report Issues](https://github.com/lanonasis/docs-lanonasis-com/issues)
- 📧 [Contact Support](mailto:support@lanonasis.com)

## Next Steps

1. [Get your API key](./authentication#create-api-key)
2. [Create your first memory](./memories#create-memory)
3. [Try semantic search](./search#semantic-search)
4. [Explore our SDKs](../sdks/overview)
