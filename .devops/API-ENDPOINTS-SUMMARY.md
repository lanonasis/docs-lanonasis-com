# API Endpoints Summary

## Overview

The LanOnasis documentation site provides two API endpoints for different use cases:

1. **MCP Endpoint** (`/api/mcp`) - For Claude Desktop and MCP-compatible clients
2. **REST API Endpoint** (`/api/search`) - For Custom GPT Actions and general REST integrations

## Endpoint Comparison

| Feature | MCP Endpoint | REST API Endpoint |
|---------|--------------|-------------------|
| **URL** | `/api/mcp` | `/api/search` |
| **Format** | Server-Sent Events (SSE) | JSON |
| **Protocol** | MCP (Model Context Protocol) | REST (OpenAPI 3.1) |
| **Methods** | POST only | GET, POST |
| **Use Case** | Claude Desktop | Custom GPT Actions, REST clients |
| **Response Type** | `text/event-stream` | `application/json` |
| **Authentication** | None | None (public) |

## MCP Endpoint (`/api/mcp`)

### Purpose
Designed for Claude Desktop and other MCP-compatible clients using the Model Context Protocol.

### Request Format
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_lanonasis_docs",
    "arguments": {
      "query": "memory service",
      "section": "all",
      "limit": 10
    }
  }
}
```

### Response Format
```
event: message
data: {"jsonrpc":"2.0","id":1,"result":{...}}
```

### Configuration
Add to Claude Desktop `claude_desktop_config.json`:
```json
{
  "LanOnasis Documentation": {
    "url": "https://docs.lanonasis.com/api/mcp",
    "type": "http"
  }
}
```

## REST API Endpoint (`/api/search`)

### Purpose
Designed for Custom GPT Actions, OpenAI GPTs, and general REST API integrations.

### GET Request
```bash
GET /api/search?q=memory%20service&section=all&limit=10
```

### POST Request
```bash
POST /api/search
Content-Type: application/json

{
  "query": "memory service",
  "section": "all",
  "limit": 10
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "query": "memory service",
    "results": [
      {
        "title": "Documentation Page Title",
        "content": "Excerpt from the page...",
        "url": "https://docs.lanonasis.com/page-url",
        "relevance_score": 19,
        "section": "general",
        "type": "doc"
      }
    ],
    "total": 1,
    "metadata": {
      "section_filter": "all",
      "limit": 10,
      "search_timestamp": "2025-12-02T19:00:00.000Z"
    }
  }
}
```

### OpenAPI Specification
Available at: `https://docs.lanonasis.com/openapi.yaml`

### Custom GPT Configuration
1. Import OpenAPI spec from URL: `https://docs.lanonasis.com/openapi.yaml`
2. Or manually configure using the schema from `openapi.yaml`

## Parameters

### Common Parameters (Both Endpoints)

| Parameter | Type | Required | Description | Values |
|-----------|------|----------|-------------|--------|
| `query` | string | Yes | Search query | Any text |
| `section` | string | No | Filter by section | `all`, `api`, `guides`, `sdks` |
| `limit` | integer | No | Max results | 1-50 (default: 10) |

## Response Structure

### Search Result Object
```json
{
  "title": "string",           // Page title
  "content": "string",           // Excerpt containing query
  "url": "string",               // Full URL to page
  "relevance_score": "number",   // Relevance score (higher = more relevant)
  "section": "string",           // Section: general, api, guides, sdks
  "type": "string"               // Type: doc, api, sdk, guide
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Query parameter is required and must be a non-empty string"
  }
}
```

### Method Not Allowed (405)
```json
{
  "success": false,
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "Only GET and POST methods are supported"
  }
}
```

### Internal Error (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while searching documentation"
  }
}
```

## Testing

### Test MCP Endpoint
```bash
curl -X POST https://docs.lanonasis.com/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_lanonasis_docs",
      "arguments": {
        "query": "memory service",
        "limit": 5
      }
    }
  }'
```

### Test REST API Endpoint
```bash
# GET request
curl "https://docs.lanonasis.com/api/search?q=memory%20service&limit=5"

# POST request
curl -X POST https://docs.lanonasis.com/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "memory service",
    "section": "api",
    "limit": 5
  }'
```

## Deployment

Both endpoints are deployed automatically via Vercel when changes are pushed to the `main` branch.

### Files
- `/api/mcp.js` - MCP endpoint implementation
- `/api/search.js` - REST API endpoint implementation
- `/openapi.yaml` - OpenAPI 3.1 specification

### Verification
After deployment, verify both endpoints:
1. MCP: Test with Claude Desktop or curl
2. REST: Test with curl or Postman
3. OpenAPI: Verify spec is accessible at `/openapi.yaml`

## Status

✅ **MCP Endpoint**: Production Ready  
✅ **REST API Endpoint**: Production Ready  
✅ **OpenAPI Specification**: Production Ready

---

**Last Updated**: December 2025  
**Version**: 1.0

