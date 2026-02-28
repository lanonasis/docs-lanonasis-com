---
title: Memory as a Service (MaaS)
sidebar_label: Overview
description: Enterprise memory layer for applications and AI agents with semantic search, namespaces, and compliance
---

**LanOnasis Memory Suite** provides a unified, enterprise-grade memory layer for applications and AI agents. It enables semantic search, persistent storage, topic organization, and full audit trails with compliance built-in (PCI-DSS, GDPR, SOX, HIPAA).

## Platform Overview

Memory Suite acts as a central repository for structured information—project notes, user preferences, decision logs, AI context windows, session data, and compliance records. Unlike traditional databases, Memory Suite emphasizes:

- **Semantic Search**: Find information by meaning, not just keywords
- **Multi-Interface Access**: REST API, SDKs, CLI, MCP tools, or webhooks
- **Enterprise Compliance**: Encryption, audit logging, retention policies, consent tracking
- **Real-Time Sync**: Live updates across all connected clients and applications

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LanOnasis Memory Suite                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   REST API   │  │  Memory CLI  │  │ TypeScript   │       │
│  │ (HTTP/REST)  │  │  (Terminal)  │  │    SDK       │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │                │
│         └──────────────────┼──────────────────┘               │
│                            │                                  │
│                    ┌───────▼────────┐                         │
│                    │  MCP Tools     │                         │
│                    │  (AI Agents)   │                         │
│                    └───────┬────────┘                         │
│                            │                                  │
│         ┌──────────────────▼──────────────────┐               │
│         │    Memory Service (Core Engine)     │               │
│         │  - Semantic Indexing (Embeddings)   │               │
│         │  - Vector Search                    │               │
│         │  - Access Control (RBAC)            │               │
│         │  - Audit Logging                    │               │
│         └──────────────────┬──────────────────┘               │
│                            │                                  │
│    ┌───────────────────────┼───────────────────────┐         │
│    │                       │                       │         │
│ ┌──▼──────┐         ┌──────▼────────┐      ┌──────▼───┐     │
│ │ Storage │         │ Vector Index  │      │ Audit    │     │
│ │(Supabase)         │  (pgvector)   │      │ Log      │     │
│ └─────────┘         └───────────────┘      └──────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Capabilities

### 1. Structured Memory Storage

Store any structured data with automatic indexing:

```json
{
  "id": "mem_abc123",
  "namespace": "projects/acme",
  "text": "Q2 2026 product roadmap: AI features (priority), Performance optimization, Mobile app",
  "tags": ["roadmap", "product-planning", "Q2-2026"],
  "metadata": {
    "owner": "alice@example.com",
    "department": "Product",
    "status": "approved"
  },
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z"
}
```

### 2. Semantic Search

Search by meaning, not keywords. Find relevant memories even with different phrasing:

```bash
# Search for Q2 planning—will match all planning-related memories
lanonasis memory search --query "Q2 planning goals" --namespace projects/acme
```

Results include:

- Exact keyword matches
- Semantic matches (embeddings-based)
- Tag-based filtering
- Custom metadata filtering

### 3. Topic-Based Organization

Group related memories into topics for collaborative workflows:

```bash
# Create a topic for Q2 planning
lanonasis topic create \
  --name "Q2 2026 Execution" \
  --description "All planning, execution, and review for Q2"
```

Topics enable:

- Collaborative organization (multiple team members)
- Export as Markdown/PDF for reports
- Comments and real-time updates
- Version control of topic snapshots

### 4. Multi-Interface Access

Access memories through your preferred interface:

| Interface          | Use Case                                       | Example                                 |
| ------------------ | ---------------------------------------------- | --------------------------------------- |
| **REST API**       | Backend services, webhooks, integrations       | `POST /api/v1/memories`                 |
| **CLI**            | Terminal workflows, CI/CD pipelines, scripting | `lanonasis memory search --query "..."` |
| **TypeScript SDK** | Node.js/Bun applications, type safety          | `memory.create({...})`                  |
| **MCP Tools**      | AI agent context, automated reasoning          | `memory.search(query)` via Claude/GPT   |
| **Webhooks**       | Real-time event streaming                      | Receive updates on create/update/delete |

### 5. Enterprise Compliance

Built-in compliance features for regulated industries:

- **Encryption**: AES-256-GCM for data at rest and in transit
- **Access Control**: Role-based access control (RBAC) per namespace
- **Audit Logging**: Immutable logs of all operations (PCI-DSS, SOX, HIPAA)
- **Data Retention**: Automatic TTL and retention policy enforcement
- **GDPR**: Right to deletion, consent tracking, data export
- **Consent Management**: Mark sensitive memories as requiring explicit consent

---

## Feature Comparison vs. Traditional Solutions

| Feature                                   | Memory Suite | Traditional DB  | Vector DB        | Note-Taking App |
| ----------------------------------------- | ------------ | --------------- | ---------------- | --------------- |
| **Semantic Search**                       | ✅ Native    | ❌ No           | ✅ Yes           | ⚠️ Limited      |
| **Compliance** (Audit, Encryption)        | ✅ Built-in  | ❌ Manual setup | ⚠️ Limited       | ❌ None         |
| **Multi-Interface** (REST, CLI, SDK, MCP) | ✅ All       | ⚠️ REST only    | ⚠️ Python mostly | ❌ Web UI only  |
| **Real-Time Sync**                        | ✅ Yes       | ⚠️ Polling      | ⚠️ Limited       | ❌ No           |
| **Namespace Isolation**                   | ✅ Yes       | ✅ Yes          | ❌ No            | ❌ No           |
| **TTL/Retention Policies**                | ✅ Yes       | ⚠️ Manual       | ❌ No            | ❌ No           |
| **Golden Contract Compliance**            | ✅ Yes       | ❌ No           | ❌ No            | ❌ No           |

---

## Integration Patterns

### Pattern 1: Application Context Storage

Store application state, user preferences, and session data:

```javascript
// Node.js example
import { Memory } from "@lanonasis/memory-sdk";

const memory = new Memory({
  apiKey: process.env.LANONASIS_API_KEY,
  namespace: "app-context",
});

// Store user session
await memory.create({
  text: "User session: alice@example.com, logged in from 10.0.0.5",
  tags: ["session", "login"],
  metadata: { userId: "u_123", timestamp: Date.now() },
});
```

### Pattern 2: AI Agent Context Window

Provide persistent memory for AI agents to reason over:

```javascript
// Claude or other AI model with Memory Suite integration
const relevantMemories = await memory.search({
  query: "Q2 2026 goals and constraints",
  namespace: "ai-context",
  limit: 10,
});

// Feed to Claude
const response = await claude.messages.create({
  model: "claude-3-5-sonnet",
  system: `You are an AI assistant with access to organizational memory.\n\n${relevantMemories.map((m) => m.text).join("\n")}`,
  messages: [{ role: "user", content: userQuery }],
});
```

### Pattern 3: Compliance Audit Trail

Maintain immutable records of decisions and approvals:

```bash
lanonasis memory create \
  --namespace compliance-audit \
  --text "Security review: All PII encryption validated. Status: APPROVED" \
  --metadata '{
    "reviewer": "security@example.com",
    "timestamp": "2026-01-15T14:30:00Z",
    "reviewType": "security-audit",
    "evidence": "security-report-2026-01-15.pdf"
  }' \
  --tags compliance,audited,pii-review
```

### Pattern 4: Real-Time Team Collaboration

Team members synchronize context in real-time:

```bash
# Team lead creates a planning topic
lanonasis topic create --name "Sprint 42 Planning"

# Team members add memories and see updates in real-time
lanonasis topic add-memory \
  --topic-id topic_xyz \
  --memory-id mem_abc

# All team members subscribed to topic receive updates
# (via webhooks or real-time SDK)
```

---

## Deployment Options

### Option 1: SaaS (Recommended for Most Users)

Pre-hosted at **`https://api.lanonasis.com`**

- ✅ Fully managed infrastructure
- ✅ Automatic scaling and high availability
- ✅ Built-in compliance and security
- ✅ No ops overhead

### Option 2: Self-Hosted (Enterprise)

Deploy Memory Suite in your own infrastructure:

```bash
# Docker Compose setup
docker-compose up -d

# Configure with your database
export DATABASE_URL="postgresql://..."
export VECTOR_DB_URL="postgresql://..." # for pgvector

npm run migrate
npm run start
```

**Requirements**:

- PostgreSQL 13+ with pgvector extension
- Node.js 18+ runtime
- Kubernetes recommended for production

### Option 3: Hybrid (On-Prem with SaaS)

Critical data on-premise, non-sensitive data in SaaS:

```javascript
// Route sensitive data to on-prem
if (isSensitive(memory)) {
  await onPremMemory.create(memory);
} else {
  await saasMemory.create(memory);
}

// Search across both
const results = await Promise.all([
  onPremMemory.search(query),
  saasMemory.search(query),
]);
```

---

## Performance Characteristics

### Latency

| Operation  | Latency (p50) | Latency (p99) | Notes                           |
| ---------- | ------------- | ------------- | ------------------------------- |
| **Create** | 50ms          | 200ms         | Includes embedding generation   |
| **Search** | 100ms         | 500ms         | Semantic search with 10 results |
| **Get**    | 20ms          | 100ms         | By ID (fastest)                 |
| **Update** | 75ms          | 250ms         | Re-indexes on metadata/tags     |
| **Delete** | 30ms          | 150ms         | Soft delete by default          |

### Throughput

- **Create**: 1,000 memories/second per namespace
- **Search**: 500 queries/second per namespace
- **Concurrent users**: 10,000+ per deployment

### Storage

- **Memory item**: ~2-5 KB (raw) + 1 KB (embeddings)
- **Namespace quota**: 10 GB default (configurable)
- **Retention**: Unlimited (with optional TTL)

---

## Security & Compliance

### Encryption

- **In Transit**: TLS 1.3
- **At Rest**: AES-256-GCM with customer-managed keys (enterprise only)
- **Credential Storage**: Bcrypt for passwords, AES-256-GCM for tokens

### Access Control

- **Authentication**: OAuth 2.0 (device flow, code flow, refresh tokens)
- **Authorization**: RBAC per namespace; can delegate to external identity provider
- **Scope Management**: Granular API key scopes (memory:read, memory:write, etc.)

### Compliance Certifications

- ✅ **PCI-DSS 3.2.1**: For payment card data
- ✅ **GDPR**: With DPA and data processing agreements
- ✅ **SOX**: Audit logging for financial controls
- ✅ **HIPAA**: For health information (PHI)

**Golden Contract v0.1**: All operations follow [Golden Contract v0.1](https://docs.lanonasis.com/security/golden-contract) standards for credential rotation, token freshness, and audit compliance.

---

## Getting Started

### Quick Start (5 minutes)

```bash
# 1. Install CLI
npm install -g @lanonasis/cli

# 2. Authenticate
lanonasis auth device

# 3. Create a memory
lanonasis memory create \
  --namespace default \
  --text "My first memory!" \
  --tags example

# 4. Search
lanonasis memory search --query "first" --namespace default
```

### Next Steps

1. **[CLI Documentation](./cli.md)** – Terminal commands and workflows
2. **[REST API Reference](./rest-api.md)** – HTTP endpoints
3. **[TypeScript SDK Guide](./sdk.md)** – Programmatic access
4. **[Authentication Guide](../auth/central-auth-gateway.md)** – OAuth 2.0 flows
5. **[Advanced Topics](../guides/index.md)** – Retention policies, webhooks, MCP integration

---

## Use Cases

### Project Management

Store project goals, decisions, constraints, and progress updates—searchable across your organization:

```
Project: Acme Q2 2026
├─ Goals: AI features, Performance
├─ Constraints: 3 engineers, $50K budget
├─ Decisions: Use Next.js 15, Prisma ORM
└─ Progress: Week 1–2 complete, Week 3 in progress
```

### AI Agent Memory

Provide AI agents with persistent context to make better decisions:

```
Agent Context: Email Assistant
├─ User preferences: Concise responses, casual tone
├─ Company policies: Response SLA < 2 hours, escalate issues
├─ Recent interactions: Last 20 emails with summaries
└─ Decision log: Why certain emails were delegated
```

### Compliance Auditing

Maintain immutable audit trails of decisions, reviews, and approvals:

```
Audit Trail: PII Processing
├─ 2026-01-10: Data inventory completed → APPROVED
├─ 2026-01-12: Encryption audit completed → APPROVED
├─ 2026-01-15: Access control review completed → APPROVED
└─ 2026-02-01: Quarterly compliance review scheduled
```

### Team Collaboration

Team members share notes, decisions, and context in real-time:

```
Team: Product Design
├─ Sprint 42 Planning: Goals, design decisions
├─ Customer feedback: Latest requests and trends
├─ Competitive analysis: Market research notes
└─ Design system updates: Latest component changes
```

---

## Related Documentation

- **[Memory CLI](./cli.md)** – Terminal commands (device flow, browser flow, topic management, API keys)
- **[Memory REST API](./rest-api.md)** – HTTP endpoints for integration
- **[Memory SDK](./sdk.md)** – TypeScript/Node.js programmatic access
- **[Authentication Guide](../auth/central-auth-gateway.md)** – OAuth 2.0 flows and credential management
- **[MCP Integration](../mcp/overview.md)** – AI agent integration with Model Context Protocol
- **[Operations Guide](../ops/operating-platform.md)** – Self-hosted setup and operations
- **[Security & Compliance](../security/privacy-implementation.md)** – Encryption, RBAC, audit logging, certifications

---

## Support

- **GitHub Issues**: [Report bugs](https://github.com/lanonasis/memory-suite/issues)
- **Discussions**: [Community Q&A](https://github.com/lanonasis/memory-suite/discussions)
- **Email**: [support@lanonasis.com](mailto:support@lanonasis.com)
- **Slack Community**: [Join the community](https://community.lanonasis.com/slack)
