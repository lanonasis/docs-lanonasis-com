---
title: MCP Overview
sidebar_label: Overview
---

# Model Context Protocol (MCP) Overview

LanOnasis provides a comprehensive Model Context Protocol (MCP) server for AI agent and IDE integrations, enabling real-time memory operations, API key management, and secure access control.

## What is MCP?

The Model Context Protocol is a standardized protocol for AI assistants to interact with external tools and services. LanOnasis MCP server provides:

- **Memory Operations**: Create, search, update, and manage memories via MCP tools
- **API Key Management**: Secure vendor API key storage and rotation
- **Real-time Communication**: SSE (Server-Sent Events) and WebSocket support
- **Multi-Protocol Support**: HTTP REST, WebSocket, SSE, and stdio transports
- **Enterprise Security**: Authentication, authorization, and audit logging

## Production Endpoint

**Base URL**: `https://mcp.lanonasis.com`

**Protocols Available:**
- **SSE**: `https://mcp.lanonasis.com/sse` - Server-Sent Events for real-time streaming
- **WebSocket**: `wss://mcp.lanonasis.com/ws` - WebSocket for bidirectional communication
- **HTTP REST**: `https://mcp.lanonasis.com/api/v1/mcp/*` - REST API endpoints
- **Stdio**: For local development and CLI integration

## Quick Start

### 1. Authentication

Obtain a token via the [Central Auth Gateway](../auth/central-auth-gateway.md):

```bash
# Using Device Flow (headless)
lanonasis auth login

# Or via PKCE in browser
# Visit: https://api.lanonasis.com/auth/pkce
```

### 2. Connect to MCP Server

**Using CLI:**
```bash
# Auto-connect (uses best available mode)
lanonasis mcp connect

# Force remote mode
lanonasis mcp connect --remote

# Force WebSocket mode
lanonasis mcp connect --websocket

# Local development
lanonasis mcp connect --local
```

**Using SDK:**
```typescript
import { MCPClient } from '@lanonasis/mcp-client';

const client = new MCPClient({
  endpoint: 'https://mcp.lanonasis.com',
  apiKey: 'your-api-key',
  transport: 'sse' // or 'websocket', 'http'
});

await client.connect();
```

### 3. Use MCP Tools

```typescript
// List available tools
const tools = await client.listTools();

// Call a tool
const result = await client.callTool('create_memory', {
  title: 'My Memory',
  content: 'Memory content here',
  type: 'knowledge'
});
```

## Available Tools

### Memory Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `create_memory` | Create a new memory with vector embedding | `title`, `content`, `type`, `tags`, `metadata` |
| `get_memory` | Retrieve a memory by ID | `memory_id` |
| `update_memory` | Update an existing memory | `memory_id`, `title?`, `content?`, `tags?` |
| `delete_memory` | Delete a memory | `memory_id` |
| `list_memories` | List memories with filters | `limit?`, `offset?`, `type?`, `tags?` |
| `search_memories` | Semantic search across memories | `query`, `limit?`, `threshold?`, `type?` |
| `bulk_delete_memories` | Delete multiple memories | `memory_ids[]` |

### API Key Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `create_api_key` | Create a new API key | `name`, `type`, `environment`, `project_id` |
| `list_api_keys` | List API keys for organization | `project_id?`, `environment?` |
| `get_api_key` | Get API key details | `key_id` |
| `rotate_api_key` | Rotate an API key | `key_id` |
| `revoke_api_key` | Revoke an API key | `key_id` |

### System Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `health_check` | Check MCP server health | - |
| `get_stats` | Get memory statistics | `user_id?` |
| `list_topics` | List memory topics | `user_id?` |

## Transport Protocols

### Server-Sent Events (SSE)

Best for: Real-time streaming, one-way communication

```typescript
const client = new MCPClient({
  endpoint: 'https://mcp.lanonasis.com',
  transport: 'sse'
});
```

**Features:**
- Automatic reconnection
- Heartbeat/ping-pong
- Event streaming
- Low latency

### WebSocket

Best for: Bidirectional communication, interactive applications

```typescript
const client = new MCPClient({
  endpoint: 'wss://mcp.lanonasis.com/ws',
  transport: 'websocket'
});
```

**Features:**
- Full duplex communication
- Lower overhead than HTTP
- Real-time updates
- Connection pooling

### HTTP REST

Best for: Simple integrations, webhooks, serverless functions

```bash
curl -X POST https://mcp.lanonasis.com/api/v1/mcp/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "create_memory",
      "arguments": {
        "title": "My Memory",
        "content": "Content here"
      }
    }
  }'
```

### Stdio

Best for: Local development, CLI tools, desktop applications

```bash
# Start local MCP server
lanonasis mcp-server start --stdio

# Connect via stdio
# (automatically handled by CLI)
```

## Authentication

All MCP requests require authentication:

### API Key Authentication

```bash
# Header
X-API-Key: your-api-key

# Or Bearer token
Authorization: Bearer your-token
```

### Token Scopes

Tokens can have different scopes:
- `memory:read` - Read memories
- `memory:write` - Create/update memories
- `memory:delete` - Delete memories
- `apikeys:read` - Read API keys
- `apikeys:write` - Manage API keys
- `mcp:access` - Access MCP resources

## Error Handling

MCP follows JSON-RPC 2.0 error format:

```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "error": {
    "code": -32603,
    "message": "Internal error",
    "data": {
      "details": "Additional error information"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| -32600 | Invalid Request |
| -32601 | Method Not Found |
| -32602 | Invalid Params |
| -32603 | Internal Error |
| -32000 | Server Error |
| -32001 | Authentication Required |
| -32002 | Permission Denied |
| -32003 | Rate Limit Exceeded |

## Rate Limiting

MCP endpoints are rate-limited:

- **Free Tier**: 60 requests/minute
- **Pro Tier**: 300 requests/minute
- **Enterprise**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1640995200
```

## Best Practices

1. **Use Connection Pooling**: Reuse connections when possible
2. **Handle Reconnections**: Implement automatic reconnection logic
3. **Monitor Rate Limits**: Check rate limit headers and back off when needed
4. **Use Appropriate Transport**: Choose transport based on your use case
5. **Cache Tool Definitions**: Cache `tools/list` results to reduce API calls
6. **Batch Operations**: Use bulk operations when possible
7. **Error Handling**: Always handle errors gracefully with retries

## Related Documentation

- [IDE Integration](./ide-integration.md) - Connect IDEs to MCP
- [Production Server](./production-server.md) - Production deployment details
- [Memory Tools](../memory/overview.md) - Memory operations via MCP
- [API Keys](../keys/vendor-key-management.md) - API key management
- [Authentication](../auth/central-auth-gateway.md) - Authentication guide

