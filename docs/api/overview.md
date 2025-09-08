---
title: API Overview
sidebar_position: 1
---

# API Reference

Welcome to the Lanonasis API documentation. Our REST API provides complete access to the Memory-as-a-Service platform.

## Base URL
```
http://api.lanonasis.local/v1
```

## Authentication

All API requests require authentication using an API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://api.lanonasis.local/v1/memories
```

## Available Endpoints

### Memory Management
- `GET /memories` - List all memories
- `POST /memories` - Create a new memory
- `GET /memories/:id` - Get a specific memory
- `PUT /memories/:id` - Update a memory
- `DELETE /memories/:id` - Delete a memory

### Vector Search
- `POST /search` - Semantic search across memories
- `POST /embeddings` - Generate embeddings

### Real-time Updates
- `GET /stream` - Server-sent events for real-time updates
