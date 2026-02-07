---
sidebar_position: 4
title: MCP API
description: Model Context Protocol integration endpoints
---

# MCP API

Secure AI tool access through the Model Context Protocol (MCP) with approval workflows and fine-grained permissions.

## Overview

The MCP API enables secure access control for AI tools and agents, providing:

- **Resource Access Control** - Define which resources AI tools can access
- **Approval Workflows** - Require human approval for sensitive operations
- **Audit Trails** - Complete visibility into AI tool usage
- **Permission Management** - Fine-grained control over tool capabilities

## List MCP Resources

Get all resources accessible through MCP.

### Endpoint

```http
GET /v1/security/mcp/resources
```

### Response

```json
{
  "resources": [
    {
      "uri": "vsecure://secrets/production/*",
      "name": "Production Secrets",
      "description": "All production environment secrets",
      "type": "secret",
      "permissions": ["read"],
      "requiresApproval": true
    },
    {
      "uri": "vsecure://secrets/staging/*",
      "name": "Staging Secrets",
      "description": "All staging environment secrets",
      "type": "secret",
      "permissions": ["read", "write"],
      "requiresApproval": false
    }
  ]
}
```

## Get MCP Resource

Retrieve a specific MCP resource.

### Endpoint

```http
GET /v1/security/mcp/resources/:uri
```

### Response

```json
{
  "uri": "vsecure://secrets/production/DATABASE_URL",
  "name": "Production Database URL",
  "type": "secret",
  "value": "postgresql://<user>:<password>@<host>:<port>/<db>",
  "metadata": {
    "environment": "production",
    "service": "database"
  },
  "accessedAt": "2024-03-15T10:30:00Z",
  "accessCount": 47
}
```

## Request MCP Approval

Request approval for a sensitive operation.

### Endpoint

```http
POST /v1/security/mcp/approve
```

### Request Body

```json
{
  "resource": "vsecure://secrets/production/DATABASE_URL",
  "operation": "read",
  "reason": "Debugging production database connection issue",
  "requestedBy": "ai-agent-123",
  "ttl": 3600
}
```

### Response

```json
{
  "approvalId": "appr_abc123xyz",
  "status": "pending",
  "resource": "vsecure://secrets/production/DATABASE_URL",
  "operation": "read",
  "requestedBy": "ai-agent-123",
  "requestedAt": "2024-03-15T10:30:00Z",
  "expiresAt": "2024-03-15T11:30:00Z",
  "approvalUrl": "https://dashboard.lanonasis.com/approvals/appr_abc123xyz"
}
```

## Approve/Deny Request

Approve or deny an MCP access request.

### Endpoint

```http
POST /v1/security/mcp/approvals/:id/respond
```

### Request Body

```json
{
  "action": "approve",
  "reason": "Legitimate debugging need",
  "approvedBy": "user_xyz789"
}
```

### Response

```json
{
  "approvalId": "appr_abc123xyz",
  "status": "approved",
  "approvedBy": "user_xyz789",
  "approvedAt": "2024-03-15T10:32:00Z",
  "accessToken": "mcp_access_token_...",
  "expiresAt": "2024-03-15T11:30:00Z"
}
```

## List MCP Approvals

Get all approval requests.

### Endpoint

```http
GET /v1/security/mcp/approvals
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (pending, approved, denied) |
| `resource` | string | Filter by resource URI |
| `limit` | number | Page size |

### Response

```json
{
  "data": [
    {
      "approvalId": "appr_abc123",
      "resource": "vsecure://secrets/production/DATABASE_URL",
      "operation": "read",
      "status": "approved",
      "requestedBy": "ai-agent-123",
      "requestedAt": "2024-03-15T10:30:00Z",
      "approvedBy": "user_xyz789",
      "approvedAt": "2024-03-15T10:32:00Z"
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6ImFwcHJfYWJjMTIzIn0",
    "hasMore": false
  }
}
```

## MCP Audit Logs

Track all MCP operations.

### Endpoint

```http
GET /v1/security/mcp/audit
```

### Response

```json
{
  "logs": [
    {
      "id": "log_abc123",
      "timestamp": "2024-03-15T10:32:15Z",
      "resource": "vsecure://secrets/production/DATABASE_URL",
      "operation": "read",
      "actor": "ai-agent-123",
      "approvalId": "appr_abc123",
      "success": true,
      "metadata": {
        "ipAddress": "203.0.113.50",
        "userAgent": "MCPClient/1.0"
      }
    }
  ]
}
```

## Configure MCP Resources

Define which resources are accessible through MCP.

### Endpoint

```http
POST /v1/security/mcp/resources
```

### Request Body

```json
{
  "uri": "vsecure://secrets/production/*",
  "name": "Production Secrets",
  "description": "All production environment secrets",
  "permissions": ["read"],
  "requiresApproval": true,
  "approvers": ["user_xyz789", "user_abc456"],
  "autoApprove": {
    "enabled": true,
    "conditions": {
      "timeWindow": "09:00-17:00 PST",
      "requester": ["trusted-agent-1"]
    }
  }
}
```

## MCP Tools Integration

### Claude Desktop Integration

Configure MCP server in Claude Desktop:

```json
{
  "mcpServers": {
    "vsecure": {
      "command": "npx",
      "args": ["@lanonasis/mcp-server-vsecure"],
      "env": {
        "VSECURE_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Custom MCP Server

Create a custom MCP server:

```typescript
import { MCPServer } from '@lanonasis/mcp-sdk';
import { VSecureClient } from '@lanonasis/v-secure-sdk';

const vsecure = new VSecureClient({
  apiKey: process.env.VSECURE_API_KEY
});

const server = new MCPServer({
  name: 'vsecure',
  version: '1.0.0'
});

server.tool('read-secret', async ({ name }) => {
  const approval = await vsecure.mcp.requestApproval({
    resource: `vsecure://secrets/${name}`,
    operation: 'read'
  });

  if (approval.status === 'approved') {
    return await vsecure.secrets.get(name);
  }

  throw new Error('Approval required');
});

server.listen();
```

## Resource URI Patterns

### Secrets

```
vsecure://secrets/{environment}/{name}
vsecure://secrets/{environment}/*
vsecure://secrets/*
```

### API Keys

```
vsecure://api-keys/{id}
vsecure://api-keys/*
```

### Custom Resources

```
vsecure://custom/{type}/{id}
```

## Best Practices

### 1. Require Approval for Production

```json
{
  "uri": "vsecure://secrets/production/*",
  "requiresApproval": true,
  "approvers": ["oncall-engineer"]
}
```

### 2. Auto-Approve Safe Operations

```json
{
  "uri": "vsecure://secrets/development/*",
  "requiresApproval": false
}
```

### 3. Time-Limited Access

```json
{
  "ttl": 3600,
  "reason": "Required for debugging"
}
```

### 4. Audit Everything

Monitor all MCP access:

```bash
vsecure mcp:audit --resource production/*
```

## Next Steps

- [MCP Integration Guide](../guides/mcp-integration)
- [Audit Logs API](./audit-logs)
- [Compliance Overview](../compliance/overview)
