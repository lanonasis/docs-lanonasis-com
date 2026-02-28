---
title: MCP Lanonasis - Model Context Protocol Server
sidebar_label: MCP Lanonasis
description: Model Context Protocol (MCP) server implementation enabling AI agents to access LanOnasis services with tools and resources
---

**MCP Lanonasis** is a Model Context Protocol (MCP) server that bridges AI agents (Claude, GPT, etc.) with LanOnasis services. It exposes all platform capabilities as MCP tools and resources, enabling AI agents to search memories, manage topics, check security, access compliance data, and more—all within a conversation.

## Overview

MCP Lanonasis enables conversational AI to interact with LanOnasis services:

```
AI Agent (Claude, GPT, etc.)
  ↓
MCP Protocol (stdio/SSE)
  ↓
MCP Lanonasis Server
  ├─ Memory Tools
  ├─ Topic Tools
  ├─ Security Tools
  ├─ Compliance Tools
  └─ Analytics Tools
  ↓
LanOnasis Services
```

### Key Capabilities

- **Memory Operations**: Create, search, update, delete memories
- **Topic Management**: Manage topics and organize memories
- **Compliance**: Query compliance status and audit trails
- **Security**: Check encryption status, key rotation
- **Analytics**: Query usage patterns and performance

---

## Architecture

### Service Structure

```
mcp-lanonasis/
├── src/
│   ├── tools/
│   │   ├── memory.tools.ts      # Memory CRUD operations
│   │   ├── topic.tools.ts       # Topic management
│   │   ├── search.tools.ts      # Semantic search
│   │   ├── compliance.tools.ts  # Compliance checks
│   │   └── analytics.tools.ts   # Usage analytics
│   ├── resources/
│   │   ├── memory.resources.ts  # Memory URIs
│   │   ├── topic.resources.ts   # Topic URIs
│   │   └── analytics.resources.ts
│   ├── server.ts                # MCP server implementation
│   ├── types/
│   │   └── tools.types.ts       # Tool definitions
│   └── index.ts
├── tests/
├── README.md
└── package.json
```

### Technology Stack

- **Protocol**: Model Context Protocol (MCP)
- **Transport**: stdio (for local), SSE (for remote)
- **Runtime**: Node.js 18+ or Bun 1.1+
- **Type Safety**: TypeScript 5.9+

---

## MCP Tools

### Memory Tools

**memory.create** – Create a new memory item

```json
{
  "name": "memory.create",
  "description": "Create a new memory item in LanOnasis Memory Suite",
  "inputSchema": {
    "type": "object",
    "properties": {
      "namespace": { "type": "string", "description": "Memory namespace" },
      "text": { "type": "string", "description": "Memory content" },
      "tags": { "type": "array", "items": { "type": "string" } },
      "metadata": { "type": "object", "description": "Custom metadata" }
    },
    "required": ["namespace", "text"]
  }
}
```

**Example Agent Usage**:

```
User: "Remember that Alice is the project lead for Q2 2026"

Claude: I'll create a memory for this important context.

[Calls memory.create with:
  namespace: "team-context"
  text: "Alice is the project lead for Q2 2026"
  tags: ["team", "project-lead", "Q2-2026"]
  metadata: { context: "user-provided" }
]

Response: Memory created with ID mem_abc123def456

Claude: Done! I've stored that Alice is the project lead for Q2 2026.
```

**memory.search** – Search memories by semantic query

```json
{
  "name": "memory.search",
  "description": "Search memories using semantic search",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "Search query" },
      "namespace": {
        "type": "string",
        "description": "Optional namespace filter"
      },
      "limit": { "type": "integer", "minimum": 1, "maximum": 100 },
      "tags": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["query"]
  }
}
```

**Example Agent Usage**:

```
User: "What are our Q2 priorities?"

Claude: Let me search your memory for Q2 priorities.

[Calls memory.search with:
  query: "Q2 priorities goals objectives"
  limit: 5
]

Response: [
  { id: "mem_1", text: "Q2 Goals: AI features, performance...", score: 0.95 },
  { id: "mem_2", text: "Team roadmap: Q2 initiatives...", score: 0.82 }
]

Claude: Based on your stored memories, here are your Q2 priorities:
1. AI features development
2. Performance optimization
3. Mobile app launch
[... based on search results]
```

**memory.get** – Retrieve specific memory

```json
{
  "name": "memory.get",
  "description": "Retrieve a specific memory by ID",
  "inputSchema": {
    "type": "object",
    "properties": {
      "memory_id": { "type": "string", "description": "Memory ID" },
      "namespace": { "type": "string", "description": "Optional namespace" }
    },
    "required": ["memory_id"]
  }
}
```

**memory.update** – Modify existing memory

```json
{
  "name": "memory.update",
  "description": "Update an existing memory",
  "inputSchema": {
    "type": "object",
    "properties": {
      "memory_id": { "type": "string" },
      "text": { "type": "string" },
      "tags": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["memory_id"]
  }
}
```

**memory.delete** – Remove memory

```json
{
  "name": "memory.delete",
  "description": "Delete a memory",
  "inputSchema": {
    "type": "object",
    "properties": {
      "memory_id": { "type": "string" },
      "reason": { "type": "string" }
    },
    "required": ["memory_id"]
  }
}
```

### Topic Tools

**topic.create** – Organize memories into topics

```json
{
  "name": "topic.create",
  "description": "Create a new topic to organize memories",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "description": { "type": "string" },
      "namespace": { "type": "string" }
    },
    "required": ["name"]
  }
}
```

**topic.add_memory** – Add memory to topic

```json
{
  "name": "topic.add_memory",
  "description": "Add a memory to a topic",
  "inputSchema": {
    "type": "object",
    "properties": {
      "topic_id": { "type": "string" },
      "memory_id": { "type": "string" }
    },
    "required": ["topic_id", "memory_id"]
  }
}
```

**topic.list** – List all topics

```json
{
  "name": "topic.list",
  "description": "List all topics in a namespace",
  "inputSchema": {
    "type": "object",
    "properties": {
      "namespace": { "type": "string" },
      "limit": { "type": "integer", "default": 50 }
    }
  }
}
```

### Compliance Tools

**compliance.check** – Check compliance status

```json
{
  "name": "compliance.check",
  "description": "Check compliance status for standards",
  "inputSchema": {
    "type": "object",
    "properties": {
      "standard": {
        "type": "string",
        "enum": ["PCI-DSS", "HIPAA", "SOX", "GDPR"]
      },
      "period": { "type": "string", "example": "monthly" }
    },
    "required": ["standard"]
  }
}
```

**compliance.audit_trail** – Query audit logs

```json
{
  "name": "compliance.audit_trail",
  "description": "Retrieve audit trail for compliance review",
  "inputSchema": {
    "type": "object",
    "properties": {
      "action": { "type": "string" },
      "start_date": { "type": "string", "format": "date-time" },
      "end_date": { "type": "string", "format": "date-time" },
      "limit": { "type": "integer" }
    }
  }
}
```

### Analytics Tools

**analytics.usage** – Query usage statistics

```json
{
  "name": "analytics.usage",
  "description": "Get usage analytics for services",
  "inputSchema": {
    "type": "object",
    "properties": {
      "service": { "type": "string" },
      "metric": { "type": "string", "enum": ["requests", "latency", "errors"] },
      "period": { "type": "string", "example": "24h" }
    },
    "required": ["metric"]
  }
}
```

---

## MCP Resources

### Memory Resources

Access specific memories via URI:

```
memory://namespace/memory_id

Examples:
- memory://default/mem_abc123
- memory://team-context/mem_xyz789
- memory://compliance-audit/mem_def456
```

### Topic Resources

Access topics via URI:

```
topic://namespace/topic_id

Examples:
- topic://default/topic_q2_planning
- topic://projects/topic_acme_2026
```

---

## Installation & Setup

### For Claude (via Cline or Direct Integration)

```bash
# Install MCP Lanonasis
npm install @lanonasis/mcp-lanonasis

# Configure Claude settings
# In .cline/config.json or similar:
{
  "mcpServers": {
    "lanonasis": {
      "command": "node",
      "args": ["node_modules/@lanonasis/mcp-lanonasis/server.js"],
      "env": {
        "LANONASIS_API_KEY": "your-api-key",
        "LANONASIS_NAMESPACE": "default"
      }
    }
  }
}
```

### For GPT (via Custom GPT)

```json
{
  "name": "LanOnasis Memory",
  "description": "Access LanOnasis Memory Suite through MCP",
  "actions": [
    {
      "type": "openapi",
      "auth": { "type": "bearer_token" },
      "schema": {
        "url": "https://mcp.lanonasis.com/openapi.json"
      }
    }
  ]
}
```

### Local Development

```bash
# Clone repository
git clone https://github.com/lanonasis/mcp-lanonasis.git
cd mcp-lanonasis

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with API credentials

# Start MCP server
bun run server

# Test with mcp-cli
npx mcp-cli --url http://localhost:3000
```

---

## Configuration

### Environment Variables

```bash
# API Configuration
LANONASIS_API_URL="https://api.lanonasis.com"
LANONASIS_API_KEY="sk_live_..."
LANONASIS_NAMESPACE="default"

# MCP Server
MCP_TRANSPORT="stdio"  # stdio or sse
MCP_STDIN_PORT=3000
MCP_REQUEST_TIMEOUT=30000

# Features
MCP_ENABLE_MEMORY_TOOLS=true
MCP_ENABLE_TOPIC_TOOLS=true
MCP_ENABLE_COMPLIANCE_TOOLS=true
MCP_ENABLE_ANALYTICS_TOOLS=true

# Logging
MCP_LOG_LEVEL="info"
MCP_LOG_FORMAT="json"
```

---

## Example Conversations

### Scenario 1: AI Assistant Researching Q2 Strategy

```
User: "Claude, what are we prioritizing in Q2 based on past decisions?"

Claude: Let me search your stored memories for Q2 priorities.

[Uses memory.search tool]

Response found: 5 relevant memories about Q2 goals, constraints, and decisions

Claude: Based on your organizational memory, Q2 2026 priorities are:
1. **AI Features Development** (mentioned in 3 memories)
   - Build new ML models
   - Integrate with existing APIs
   - Customer-facing dashboard

2. **Performance Optimization** (mentioned in 2 memories)
   - Database query optimization
   - Caching improvements
   - Infrastructure scaling

3. **Mobile App Launch** (mentioned in 2 memories)
   - iOS/Android support
   - Offline capabilities
   - Push notifications

These align with both team capabilities (3 engineers available) and budget ($50K allocated).

Would you like me to create a detailed Q2 execution plan based on this?
```

### Scenario 2: Compliance Review

```
User: "Generate a SOX compliance report for this month"

Claude: I'll pull the compliance audit trail for SOX.

[Uses compliance.check and compliance.audit_trail tools]

Response: 127 audit entries for SOX-relevant operations

Claude: **SOX Compliance Report – January 2026**

✅ **Status: Compliant**

Key Findings:
- 127 financial data operations logged
- 0 unauthorized access attempts
- All operations encrypted (AES-256-GCM)
- Audit trail: Complete and immutable

Encrypted Operations:
- API key rotations: 3
- Access permission changes: 8
- Data exports: 2
- All with timestamps and actor information

No compliance violations detected.

Would you like me to export this as a PDF for your auditor?
```

### Scenario 3: Decision Tracking

```
User: "Record our decision to use PostgreSQL for the new service"

Claude: I'll create a memory with this important decision.

[Uses memory.create tool with:
  text: "Decision: PostgreSQL selected for new microservice"
  tags: ["decision", "architecture", "database"]
  metadata: { date: "2026-01-15", context: "team-meeting" }
]

Response: Memory created with ID mem_decision_001

Claude: Done! I've recorded the PostgreSQL decision.

I've tagged it as a key decision point. If anyone asks later why we chose PostgreSQL, I can reference this memory and remind them of the context of this decision.
```

---

## Performance

### Latency

| Operation        | Latency (p50) | Latency (p99) | Notes                      |
| ---------------- | ------------- | ------------- | -------------------------- |
| memory.search    | 100ms         | 400ms         | Includes semantic search   |
| memory.create    | 50ms          | 150ms         | Fast write                 |
| memory.get       | 20ms          | 100ms         | Direct retrieval           |
| topic.create     | 30ms          | 120ms         | Simple metadata            |
| compliance.check | 200ms         | 1000ms        | May query external systems |

### Token Usage

MCP Lanonasis is optimized for token efficiency:

- Average tool response: 500-2000 tokens
- Search results: 100-500 tokens per result
- Compliance reports: 1000-5000 tokens

---

## Troubleshooting

### Issue: "Connection refused" to Lanonasis API

**Solution**: Verify API key and network access

```bash
# Test connectivity
curl -H "Authorization: Bearer $LANONASIS_API_KEY" \
  https://api.lanonasis.com/health
```

### Issue: Tool not responding

**Solution**: Check MCP server logs

```bash
# Enable debug logging
MCP_LOG_LEVEL=debug bun run server

# Check stdio communication
npx mcp-cli --url http://localhost:3000 --debug
```

### Issue: Slow memory search

**Solution**: Reduce limit or add filters

```
Claude: Let me search for recent Q2 memories with fewer results.

[Calls memory.search with:
  query: "Q2 priorities"
  limit: 5  # Reduced from 10
  tags: ["recent"]
]
```

---

## Related Documentation

- **[Memory Suite Overview](../memory/overview.md)** – Full Memory API
- **[Memory CLI](../memory/cli.md)** – Terminal-based access
- **[Model Context Protocol Spec](https://modelcontextprotocol.io/)** – MCP standard
- **[MCP Integration Guide](../mcp/overview.md)** – Implementation patterns

---

## Support & Resources

- **GitHub**: [lanonasis/mcp-lanonasis](https://github.com/lanonasis/mcp-lanonasis)
- **MCP Spec**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **Issues**: [Report bugs](https://github.com/lanonasis/mcp-lanonasis/issues)
- **Email**: [mcp@lanonasis.com](mailto:mcp@lanonasis.com)

---

**Last Updated**: February 3, 2026  
**Version**: 1.1.0+  
**MCP Spec Version**: 1.0.0+
