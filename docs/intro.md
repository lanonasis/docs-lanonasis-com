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
# TypeScript/JavaScript (Memory Client - Recommended)
npm install @lanonasis/memory-client

# TypeScript/JavaScript (Standalone SDK)
npm install @lanonasis/memory-sdk-standalone

# Python (Coming Soon)
pip install lanonasis

# CLI Tool
npm install -g @lanonasis/cli
```

### 2. Initialize the Client

```typescript
import { createMemoryClient } from '@lanonasis/memory-client/core';

const client = createMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: 'your-api-key'
});
```

### 3. Create Your First Memory

```typescript
const created = await client.createMemory({
  title: 'Meeting Notes',
  content: 'Important meeting notes from today',
  tags: ['meeting', 'project-x'],
  metadata: {
    priority: 'high'
  }
});

if (created.data) {
  console.log('Memory created:', created.data.id);
}
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
- 📧 Contact support at support@lanonasis.com

---

*Built with ❤️ by the LanOnasis team. Self-hosted and secure.*
