---
sidebar_position: 3
title: MCP Integration
description: Integrate v-secure with AI tools using Model Context Protocol
---

# MCP Integration Guide

Secure AI tool access using the Model Context Protocol (MCP) with v-secure.

## Overview

The Model Context Protocol (MCP) enables AI tools like Claude to securely access your secrets and resources with:

- **Approval Workflows** - Require human approval for sensitive operations
- **Fine-Grained Permissions** - Control exactly what AI tools can access
- **Audit Trails** - Complete visibility into AI tool usage
- **Time-Limited Access** - Grant temporary access for specific tasks

## Setup

### Install MCP Server

```bash
npm install -g @lanonasis/mcp-server-vsecure
```

### Configure Claude Desktop

Add to your Claude Desktop MCP configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "vsecure": {
      "command": "npx",
      "args": ["@lanonasis/mcp-server-vsecure"],
      "env": {
        "VSECURE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Restart Claude Desktop

Restart Claude Desktop to load the MCP server.

## Basic Usage

### Requesting Secret Access

In Claude, you can now request access to secrets:

```
Claude, I need to debug the database connection.
Can you read the DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

Claude will use the MCP protocol to request approval:

```
I need approval to access: vsecure://secrets/production/DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

Reason: Debugging database connection issue
Duration: 1 hour

Would you like to approve this request?
```

### Approval Flow

1. **Request** - AI tool requests access
2. **Notify** - You receive notification (email, Slack, dashboard)
3. **Approve/Deny** - You approve or deny the request
4. **Access** - If approved, AI tool accesses the resource
5. **Audit** - All actions are logged

## Configuration

### Define MCP Resources

Configure which resources AI tools can access:

```typescript
import { VSecureClient } from '@lanonasis/v-secure-sdk';

const client = new VSecureClient();

await client.mcp.configureResource({
  uri: 'vsecure://secrets/production/*',
  name: 'Production Secrets',
  permissions: ['read'],
  requiresApproval: true,
  approvers: ['john@example.com', 'jane@example.com']
});
```

### Auto-Approval Rules

Configure automatic approval for safe operations:

```typescript
await client.mcp.configureResource({
  uri: 'vsecure://secrets/development/*',
  name: 'Development Secrets',
  permissions: ['read', 'write'],
  requiresApproval: false
});
```

### Conditional Approval

Approve based on conditions:

```typescript
await client.mcp.configureResource({
  uri: 'vsecure://secrets/production/*',
  name: 'Production Secrets',
  permissions: ['read'],
  requiresApproval: true,
  autoApprove: {
    enabled: true,
    conditions: {
      // Only during business hours
      timeWindow: '09:00-17:00 PST',
      // Only from trusted tools
      requester: ['claude-desktop'],
      // Only for specific operations
      operations: ['read']
    }
  }
});
```

## Use Cases

### 1. Debugging Production Issues

```
User: Claude, help me debug why users can't log in to production.

Claude: I'll need to check the authentication service configuration.
I'm requesting access to:
- AUTH_SERVICE_DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
- AUTH_SERVICE_JWT_SECRET=REDACTED_JWT_SECRET
- AUTH_SERVICE_REDIS_URL

[Waits for approval]

[After approval]
Claude: I can see the issue - the JWT secret has expired...
```

### 2. Infrastructure Setup

```
User: Set up a new staging environment

Claude: I'll help you set up staging. I need access to:
- Create new secrets in vsecure://secrets/staging/*
- Read configuration templates

[Requests approval]

[After approval]
Claude: I've created the following staging secrets:
- STAGING_DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
- STAGING_API_KEY
- STAGING_REDIS_URL
```

### 3. Security Audit

```
User: Review our security configuration

Claude: I'll audit your security setup. I need read access to:
- All secret metadata (not values)
- API key configurations
- Audit logs for the past 30 days

[Requests approval]
```

## Approval Management

### Dashboard Approval

1. Navigate to [dashboard.lanonasis.com/mcp/approvals](https://dashboard.lanonasis.com/mcp/approvals)
2. Review pending requests
3. Approve or deny with reason

### CLI Approval

```bash
# List pending approvals
vsecure mcp:approvals --status pending

# Approve a request
vsecure mcp:approve appr_abc123 \
  --reason "Legitimate debugging need"

# Deny a request
vsecure mcp:deny appr_abc123 \
  --reason "Use development environment instead"
```

### API Approval

```typescript
// List pending approvals
const approvals = await client.mcp.listApprovals({
  status: 'pending'
});

// Approve
await client.mcp.respond('appr_abc123', {
  action: 'approve',
  reason: 'Legitimate debugging need',
  duration: '1h'
});
```

## Notifications

### Email Notifications

Configure email alerts:

```typescript
await client.mcp.configureNotifications({
  email: {
    enabled: true,
    recipients: ['oncall@example.com'],
    events: ['approval_requested', 'access_granted']
  }
});
```

### Slack Notifications

```typescript
await client.mcp.configureNotifications({
  slack: {
    enabled: true,
    webhookUrl: 'https://hooks.slack.com/...',
    channel: '#security-approvals'
  }
});
```

### Webhook Notifications

```typescript
await client.mcp.configureNotifications({
  webhook: {
    enabled: true,
    url: 'https://your-app.com/webhooks/mcp',
    events: ['*']
  }
});
```

## Audit and Monitoring

### View MCP Audit Logs

```bash
# All MCP operations
vsecure mcp:audit

# Filter by resource
vsecure mcp:audit --resource "production/*"

# Filter by time
vsecure mcp:audit --since 24h
```

### Monitor Access Patterns

```typescript
const logs = await client.mcp.auditLogs({
  since: '7d',
  groupBy: 'resource'
});

// Analyze which resources are accessed most
logs.forEach(log => {
  console.log(`${log.resource}: ${log.count} accesses`);
});
```

## Security Best Practices

### 1. Principle of Least Privilege

Only grant necessary permissions:

```typescript
await client.mcp.configureResource({
  uri: 'vsecure://secrets/production/DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
  permissions: ['read'], // Read only, not write
  requiresApproval: true
});
```

### 2. Time-Limited Access

Always set expiration:

```typescript
await client.mcp.approve('appr_abc123', {
  duration: '1h', // Access expires after 1 hour
  reason: 'Debugging session'
});
```

### 3. Require Justification

Always ask for reason:

```typescript
await client.mcp.configureResource({
  uri: 'vsecure://secrets/production/*',
  requireReason: true, // Require reason for access
  minReasonLength: 20 // Minimum 20 characters
});
```

### 4. Monitor Regularly

Set up alerts:

```typescript
// Alert on unusual access
const hourlyAccess = await client.mcp.metrics({
  metric: 'access_count',
  period: '1h'
});

if (hourlyAccess.count > threshold) {
  await sendAlert('Unusual MCP access detected');
}
```

## Advanced Configuration

### Custom MCP Server

Create a custom MCP server with additional tools:

```typescript
import { MCPServer } from '@lanonasis/mcp-sdk';
import { VSecureClient } from '@lanonasis/v-secure-sdk';

const vsecure = new VSecureClient();
const server = new MCPServer({ name: 'custom-vsecure' });

server.tool('read-secret', async ({ name }) => {
  const approval = await vsecure.mcp.requestApproval({
    resource: `vsecure://secrets/${name}`,
    operation: 'read',
    reason: 'Requested by AI tool'
  });

  if (approval.status !== 'approved') {
    throw new Error('Approval required');
  }

  return await vsecure.secrets.get(name);
});

server.tool('rotate-secret', async ({ name }) => {
  const approval = await vsecure.mcp.requestApproval({
    resource: `vsecure://secrets/${name}`,
    operation: 'write',
    reason: 'Secret rotation'
  });

  if (approval.status !== 'approved') {
    throw new Error('Approval required');
  }

  const newValue = generateSecureToken();
  await vsecure.secrets.update(name, { value: newValue });

  return { success: true, newVersion: await vsecure.secrets.get(name) };
});

server.listen();
```

## Troubleshooting

### MCP Server Not Connecting

```bash
# Check MCP server status
npx @lanonasis/mcp-server-vsecure --check

# Verify API key
vsecure auth:whoami

# Check logs
tail -f ~/Library/Logs/Claude/mcp-server-vsecure.log
```

### Approval Not Received

1. Check notification settings
2. Verify email/webhook configuration
3. Check spam folder
4. Review firewall rules

### Permission Denied

```bash
# Check resource configuration
vsecure mcp:resources

# Verify API key scopes
vsecure auth:scopes

# Check approval status
vsecure mcp:approvals
```

## Next Steps

- [Security Best Practices](./security-best-practices)
- [Audit Logs](../api/audit-logs)
- [API Reference](../api/mcp)
