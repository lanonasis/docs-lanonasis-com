---
title: Welcome to LanOnasis
sidebar_position: 1
---

# LanOnasis Memory Service Documentation

Welcome to the official documentation for **LanOnasis Memory-as-a-Service (MaaS)** platform - your intelligent memory management solution with AI-powered insights and seamless IDE integration.

## 🚀 What is LanOnasis?

LanOnasis is an enterprise-grade Memory-as-a-Service (MaaS) platform that provides:

- 🧠 **Intelligent Memory Management** - Advanced vector storage, retrieval, and AI-powered insights
- 🔒 **Enterprise Security** - SOC 2 compliant with OAuth 2.0, end-to-end encryption, and OS-level credential storage
- ⚡ **Real-time Sync** - Live memory synchronization via SSE and WebSocket
- 🤖 **MCP Integration** - Full Model Context Protocol support for AI assistants and IDEs
- 💻 **Web IDE Support** - Native extensions for VSCode Desktop, VSCode Web (vscode.dev), and GitHub.dev
- 📊 **Analytics & Insights** - Pattern analysis, duplicate detection, and usage metrics
- 🛠️ **Developer Friendly** - SDKs for TypeScript/JavaScript, CLI tools, and REST API
- 🚀 **Production Ready** - Scale from prototype to enterprise with 99.9% uptime SLA

## What's New in 2026 Q1

✨ **Major Updates:**

- **Web IDE Extensions**: Now available on [vscode.dev](https://vscode.dev) and [github.dev](https://github.dev)
- **Memory Intelligence**: AI-powered tag suggestions, duplicate detection, and insight extraction
- **Behavior Operations**: Record, recall, and suggest workflow patterns
- **OAuth 2.0 with PKCE**: Enhanced security with browser-based authentication
- **CLI v3.9.8**: Revolutionary UX with inline editing and intelligent MCP connection
- **Enhanced MCP**: New production endpoint at `https://mcp.lanonasis.com`

[See what's new →](./getting-started/whats-new-2026-q1.md)

## Quick Start

Get started with LanOnasis in minutes:

### 1. Install the CLI (Recommended)

```bash
# Global installation
npm install -g @lanonasis/cli

# Verify installation
onasis --version
```

### 2. Authenticate

```bash
# Interactive OAuth (recommended)
onasis auth login

# Or use vendor key for automation
onasis auth login --vendor-key <your-key>

# Check status with live API verification
onasis auth status

# View your profile
onasis whoami
```

### 3. Create Your First Memory

```bash
# Interactive creation with inline editor
onasis memory create --inline

# Or create with JSON
onasis memory create --json '{"title":"My Memory","content":"Hello World!","type":"knowledge"}'

# Or create from file
onasis memory create --content-file ./notes.md
```

### 4. Search Memories

```bash
# Semantic search
onasis memory search "meeting notes"

# With filters
onasis memory search "project decisions" --type "context" --limit 10
```

### 5. Connect Your IDE

**VSCode Desktop:**
1. Install "LanOnasis Memory Assistant" from Extensions Marketplace
2. Run `Lanonasis: Authenticate`
3. Start using with `Ctrl+Shift+M` to search memories

**VSCode Web (vscode.dev / github.dev):** ✨ NEW
1. Open your workspace in vscode.dev or github.dev
2. Install "LanOnasis Memory Assistant" extension
3. Authenticate with OAuth
4. Enjoy synchronized context across all devices!

## Core Features

### 🧠 Memory Intelligence

AI-powered operations to enhance your memory management:

```bash
# Suggest tags for content
onasis memory intelligence suggest-tags --file ./notes.md

# Find related memories
onasis memory intelligence find-related "deployment process"

# Detect duplicates
onasis memory intelligence detect-duplicates

# Extract insights
onasis memory intelligence extract-insights --memory-ids mem_123,mem_456

# Analyze patterns
onasis memory intelligence analyze-patterns --time-range "last-30-days"
```

### 🔄 Behavior Operations

Record and recall workflow patterns:

```bash
# Record workflow context
onasis memory behavior record --action "code-review" --context '{"pr":"#123"}'

# Recall similar patterns
onasis memory behavior recall "code review"

# Get action suggestions
onasis memory behavior suggest --current-context '{"file":"src/index.ts"}'
```

### 💻 IDE Integration

**Available on:**
- ✅ VSCode Desktop
- ✅ VSCode Web (vscode.dev)
- ✅ GitHub.dev (git.dev)
- ✅ Cursor
- ✅ Windsurf

**Features:**
- Semantic search with `Ctrl+Shift+M`
- Create from selection with `Ctrl+Shift+Alt+M`
- API key management with `Ctrl+Shift+K`
- Chat participant integration
- Real-time sync across devices

[IDE Integration Guide →](./mcp/ide-integration.md)

### 🤖 MCP Integration

Full Model Context Protocol support:

**Production Endpoint:**
- Base URL: `https://mcp.lanonasis.com`
- SSE: `https://mcp.lanonasis.com/sse`
- WebSocket: `wss://mcp.lanonasis.com/ws`

**Available Tools:**
- Memory operations (create, search, update, delete)
- Memory intelligence (health, tags, related, duplicates, insights, patterns)
- Behavior operations (record, recall, suggest)
- API key management (create, list, rotate, revoke)
- Session management (save, get)
- System tools (health, stats, topics, get-me)

[MCP Overview →](./mcp/overview.md)

### 🔐 Enhanced Security

**OAuth 2.0 with PKCE:**
- Browser-based secure authentication
- Automatic token refresh
- OS-level credential storage (Keychain, Credential Manager)

**Live Verification:**
```bash
# Check auth status with real API probe
onasis auth status

# View full user profile
onasis whoami
```

[Authentication Guide →](./auth/central-auth-gateway.md)

## Explore the Documentation

<div className="card">
  <h3>📚 Getting Started</h3>
  <p>Learn the basics and set up your first project</p>
  <ul>
    <li><a href="./getting-started/whats-new-2026-q1.md">What's New in 2026 Q1</a></li>
    <li><a href="./getting-started/installation.md">Installation Guide</a></li>
    <li><a href="./getting-started/quick-start.md">Quick Start</a></li>
  </ul>
</div>

<div className="card">
  <h3>🔧 CLI Reference</h3>
  <p>Complete command reference with examples</p>
  <a href="./cli/reference.md">View CLI Commands →</a>
</div>

<div className="card">
  <h3>🤖 MCP Integration</h3>
  <p>Model Context Protocol for AI applications</p>
  <a href="./mcp/overview.md">MCP Overview →</a>
</div>

<div className="card">
  <h3>💻 IDE Extensions</h3>
  <p>Connect your IDE for seamless workflow</p>
  <a href="./mcp/ide-integration.md">IDE Integration →</a>
</div>

<div className="card">
  <h3>📦 API Reference</h3>
  <p>Complete REST API documentation</p>
  <a href="./api/overview.md">View API Docs →</a>
</div>

<div className="card">
  <h3>🧠 Memory Intelligence</h3>
  <p>AI-powered insights and pattern analysis</p>
  <a href="./memory/intelligence.md">Learn about Intelligence →</a>
</div>

<div className="card">
  <h3>🔐 Security</h3>
  <p>Enterprise-grade authentication and authorization</p>
  <a href="./auth/central-auth-gateway.md">Authentication Guide →</a>
</div>

<div className="card">
  <h3>💡 Use Cases</h3>
  <p>Real-world examples and tutorials</p>
  <a href="./use-cases/personal-knowledge.md">Browse Use Cases →</a>
</div>

## Production Endpoints

| Service | URL |
|---------|-----|
| **API Gateway** | `https://api.lanonasis.com` |
| **MCP Server** | `https://mcp.lanonasis.com` |
| **MCP SSE** | `https://mcp.lanonasis.com/sse` |
| **MCP WebSocket** | `wss://mcp.lanonasis.com/ws` |
| **Auth Gateway** | `https://auth.lanonasis.com` |
| **Dashboard** | `https://dashboard.lanonasis.com` |
| **Documentation** | `https://docs.lanonasis.com` |

## Need Help?

- 📖 Browse our [comprehensive guides](./guides)
- 🐛 Report issues on [GitHub](https://github.com/lanonasis/lanonasis-maas/issues)
- 💬 Join community discussions
- 📧 Contact support at support@lanonasis.com
- 🏢 Enterprise inquiries: enterprise@lanonasis.com

## Quick Reference

### CLI Commands

```bash
# Authentication
onasis auth login          # Authenticate with OAuth
onasis auth status         # Check status with live API probe
onasis whoami              # View user profile

# Memory operations
onasis memory create --inline    # Create with inline editor
onasis memory search "query"     # Semantic search
onasis memory save-session       # Save development context

# Intelligence
onasis memory intelligence suggest-tags --file ./notes.md
onasis memory intelligence find-related "query"

# MCP
onasis mcp connect         # Connect to MCP server
onasis mcp-server start    # Start local MCP server
```

### SDK Installation

```bash
# Memory Client (Recommended)
npm install @lanonasis/memory-client

# CLI Tool
npm install -g @lanonasis/cli
```

---

*Built with ❤️ by the LanOnasis team. Self-hosted and secure.*

**Last updated:** February 25, 2026
