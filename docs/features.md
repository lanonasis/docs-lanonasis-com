---
title: Core Features
sidebar_position: 1
---

---
layout: home

hero:
  name: "LanOnasis Memory Service"
  text: "Memory as a Service (MaaS)"
  tagline: Enterprise-grade memory management for AI applications
  image:
    src: /logo.svg
    alt: LanOnasis
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: View Dashboard
      link: https://api.LanOnasis.com/dashboard

features:
  - icon: 🧠
    title: Intelligent Memory Management
    details: Store, search, and retrieve memories with advanced AI-powered embeddings and semantic search capabilities.
  
  - icon: 🔐
    title: Enterprise Security
    details: JWT authentication, API key management, and row-level security with comprehensive audit logging.
  
  - icon: ⚡
    title: Real-time Updates
    details: Server-sent events (SSE) for live memory updates, notifications, and system status monitoring.
  
  - icon: 🛠️
    title: Developer-First
    details: RESTful API, CLI tools, SDKs, and comprehensive documentation for seamless integration.
  
  - icon: 📊
    title: Analytics & Insights
    details: Usage analytics, performance metrics, and visual relationship graphs for your memory data.
  
  - icon: 🚀
    title: Production Ready
    details: Scalable architecture with Redis caching, rate limiting, and comprehensive monitoring.
---

## Quick Start

Get started with LanOnasis Memory Service in minutes:

### 1. Get Your API Key

Visit the [Dashboard](https://api.LanOnasis.com/dashboard) to create your account and generate API keys.

### 2. Install the CLI

```bash
npm install -g @LanOnasis/memory-cli
```

### 3. Configure Authentication

```bash
LanOnasis config set api-key YOUR_API_KEY
LanOnasis config set endpoint https://api.LanOnasis.com
```

### 4. Create Your First Memory

```bash
LanOnasis memory create \
  --content "Important project meeting notes" \
  --type "meeting" \
  --tags "project,meeting,notes"
```

### 5. Search Memories

```bash
LanOnasis memory search "project meeting"
```

## API Example

```javascript
import { LanOnasisClient } from '@LanOnasis/memory-sdk';

const client = new LanOnasisClient({
  apiKey: 'your-api-key',
  endpoint: 'https://api.LanOnasis.com'
});

// Create a memory
const memory = await client.memories.create({
  content: 'Important project meeting notes',
  type: 'meeting',
  tags: ['project', 'meeting', 'notes']
});

// Search memories
const results = await client.memories.search('project meeting');
```

## Architecture

LanOnasis Memory Service provides a complete memory management solution:

- **API Server**: RESTful API with JWT authentication at `api.LanOnasis.com`
- **Dashboard**: Self-service portal for API key management and analytics
- **CLI Tools**: Command-line interface for developers and automation
- **SDKs**: Official libraries for JavaScript/TypeScript and Python
- **Real-time**: Server-sent events for live updates and notifications

## Enterprise Features

- 🔒 **Security**: JWT + API key authentication, RLS, audit logging
- 📈 **Analytics**: Usage metrics, performance insights, relationship graphs  
- 🔄 **Real-time**: SSE for live updates and system notifications
- 🛡️ **Reliability**: Rate limiting, caching, comprehensive error handling
- 📚 **Documentation**: Complete API docs, guides, and examples

Ready to get started? [Create your account](https://api.LanOnasis.com/dashboard) and begin building with LanOnasis Memory Service today!
