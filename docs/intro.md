---
title: Welcome to LanOnasis
sidebar_position: 1
---

# LanOnasis Memory Service Documentation

Welcome to the official documentation for **LanOnasis Memory-as-a-Service** platform - your intelligent memory management solution.

## 🚀 What is LanOnasis?

LanOnasis is a cutting-edge Memory-as-a-Service (MaaS) platform that provides:

- 🧠 **Intelligent Memory Management** - Advanced vector storage and retrieval
- 🔒 **Enterprise Security** - SOC 2 compliant with end-to-end encryption  
- ⚡ **Real-time Updates** - Live memory synchronization via SSE
- 🛠️ **Developer Friendly** - SDKs for TypeScript, Python, and more
- 📊 **Analytics & Insights** - Track memory usage and performance
- 🚀 **Production Ready** - Scale from prototype to enterprise

## Quick Start

Get started with LanOnasis in minutes:

### 1. Install the SDK

```bash
# TypeScript/JavaScript
npm install @LanOnasis/memory-sdk

# Python
pip install LanOnasis

# CLI Tool
npm install -g @LanOnasis/cli
```

### 2. Initialize the Client

```typescript
import { MemoryClient } from '@LanOnasis/memory-sdk';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  endpoint: 'http://api.LanOnasis.local' // Self-hosted endpoint
});
```

### 3. Create Your First Memory

```typescript
const memory = await client.memories.create({
  content: 'Important meeting notes from today',
  metadata: {
    tags: ['meeting', 'project-x'],
    priority: 'high'
  }
});

console.log('Memory created:', memory.id);
```

## Core Features

### Vector Search
Powerful semantic search across all your memories using state-of-the-art embedding models.

### Real-time Sync
Instant updates across all connected clients using Server-Sent Events (SSE).

### MCP Integration
Seamless integration with Model Context Protocol for AI applications.

### Enterprise Ready
- Multi-tenant architecture
- Role-based access control
- Audit logging
- 99.9% uptime SLA

## Explore the Documentation

<div className="card">
  <h3>📚 Getting Started</h3>
  <p>Learn the basics and set up your first project</p>
  - [📚 Getting Started](/getting-started/installation)
</div>

<div className="card">
  <h3>🔧 API Reference</h3>
  <p>Complete API documentation with examples</p>
  <a href="/api/overview">View API Docs →</a>
</div>

<div className="card">
  <h3>📦 SDKs & Libraries</h3>
  <p>Official SDKs for multiple languages</p>
  <a href="/sdks/overview">Browse SDKs →</a>
</div>

<div className="card">
  <h3>💡 Use Cases</h3>
  <p>Real-world examples and tutorials</p>
  - [💡 Use Cases](/use-cases/personal-knowledge)
</div>

## Need Help?

- 📖 Browse our [comprehensive guides](/guides/index)
- 🐛 Report issues in our [feedback system](/support)
- 💬 Join our community discussions
- 📧 Contact support at support@LanOnasis.local

---

*Built with ❤️ by the LanOnasis team. Self-hosted and secure.*
