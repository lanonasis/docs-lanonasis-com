---
title: What's New in 2026 Q1
sidebar_label: What's New 2026 Q1
sidebar_position: 0
---

# What's New in 2026 Q1

Discover the latest enhancements to the LanOnasis platform, including revolutionary CLI features, web IDE support, advanced memory intelligence, and enhanced security.

## 🎉 Major Announcements

### ✨ Web IDE Support - Now on vscode.dev and github.dev

The LanOnasis Memory Assistant is now available in **web-based IDEs**, bringing intelligent memory management to your browser-based development workflow.

**What this means:**
- ✅ Full memory management in vscode.dev
- ✅ GitHub.dev integration
- ✅ Synchronized context across all devices
- ✅ No installation required - just add the extension

**Get Started:**
1. Open [vscode.dev](https://vscode.dev) or [github.dev](https://github.dev)
2. Install "LanOnasis Memory Assistant" extension
3. Authenticate with OAuth
4. Start managing memories instantly!

[Learn more →](../mcp/ide-integration.md#vscode-web-vscode-dev--githubdev-)

---

### 🚀 CLI v3.9.8 - Memory Intelligence & Behavior Operations

The latest CLI release introduces powerful new capabilities for understanding and leveraging your memory patterns.

#### Memory Intelligence Commands

**Automated Insights:**
```bash
# Get tag suggestions for content
onasis memory intelligence suggest-tags --file ./notes.md

# Find related memories
onasis memory intelligence find-related "deployment process"

# Detect duplicate memories
onasis memory intelligence detect-duplicates --threshold 0.8

# Extract key insights
onasis memory intelligence extract-insights \
  --memory-ids mem_123,mem_456 \
  --topic "key decisions"

# Analyze usage patterns
onasis memory intelligence analyze-patterns --time-range "last-30-days"
```

#### Behavior Operations

**Workflow Intelligence:**
```bash
# Record workflow context
onasis memory behavior record \
  --action "code-review" \
  --context '{"pr":"#123","files":["src/index.ts"]}'

# Recall similar patterns
onasis memory behavior recall "code review process"

# Get action suggestions
onasis memory behavior suggest \
  --current-context '{"file":"src/index.ts","action":"testing"}'
```

#### Session Persistence

**Save Development Context:**
```bash
# Save current session (branch, status, changed files)
onasis memory save-session --title "Feature Development"
```

[CLI Reference →](../cli/reference.md)

---

### 🔐 Enhanced Security - OAuth 2.0 with PKCE

Complete authentication overhaul with enterprise-grade security.

**New Features:**
- **OAuth 2.0 with PKCE**: Browser-based secure authentication
- **Live API Verification**: Real-time auth status checking
- **OS-Level Credential Storage**: Keychain integration (macOS, Windows, Linux)
- **Automatic Token Refresh**: No manual re-authentication needed
- **Console Redaction**: Prevents credential leaks in logs

**New Commands:**
```bash
# OAuth authentication (recommended)
onasis auth login

# Check status with live API probe
onasis auth status

# View your full profile
onasis whoami
```

**Security Fixes:**
- ✅ Fixed OAuth sessions showing "Not Authenticated" incorrectly
- ✅ Removed 24-hour validation bypass
- ✅ Stale cache invalidation on 401
- ✅ Restricted offline grace to network failures only

[Authentication Guide →](../auth/central-auth-gateway.md)

---

### 🤖 MCP Production Upgrades

Enhanced Model Context Protocol with new tools and improved reliability.

**Production Endpoint:**
- **Base URL**: `https://mcp.lanonasis.com`
- **SSE**: `https://mcp.lanonasis.com/sse`
- **WebSocket**: `wss://mcp.lanonasis.com/ws`

**New MCP Tools:**
- `memory_health` - Check memory bank health
- `suggest_tags` - AI-powered tag suggestions
- `find_related` - Semantic related memory lookup
- `detect_duplicates` - Duplicate detection
- `extract_insights` - Key insight extraction
- `analyze_patterns` - Pattern analysis
- `behavior_record` - Record workflow context
- `behavior_recall` - Recall behavior patterns
- `behavior_suggest` - Suggest next actions
- `save_session` - Save session context
- `get_me` - User profile retrieval

**CLI-Embedded MCP Server:**
```bash
# Start local MCP server
onasis mcp-server start --http --port 3001

# Check status
onasis mcp-server status
```

[MCP Overview →](../mcp/overview.md)

---

## 🛠️ Feature Highlights

### Seamless Inline Text Editing

No more external editor dependencies! Professional multi-line editing directly in your terminal.

```bash
# Create with inline editor
onasis memory create --inline

# Update existing memory
onasis memory update mem_123 --inline
```

**Features:**
- ✨ Multi-line editing with visual feedback
- 🎯 Line numbers and cursor indicators
- ⌨️ Full keyboard navigation
- 💾 Auto-preserves existing content
- 🚫 No external editor needed

---

### Intelligent MCP Connection

Automatic MCP server discovery and configuration.

```bash
# Auto-connect with best available mode
onasis mcp connect

# Check connection status
onasis mcp status
```

**Features:**
- 🔍 Auto-detects embedded MCP server
- 💾 Automatic configuration persistence
- 🔄 Health monitoring and auto-reconnection
- ✅ Connection verification before operations
- 🛠️ Clear error messages with troubleshooting

---

### First-Run Onboarding

Interactive setup for new users.

```bash
onasis init
# or
onasis guide
```

**Experience:**
- 📋 Step-by-step guided setup
- 🧪 Automatic connectivity tests
- ⚙️ Smart default configuration
- 💡 Context-aware troubleshooting
- 📖 Interactive help and tips

---

### JSON & File-Based Memory Creation

Flexible memory creation options for automation.

```bash
# JSON payload
onasis memory create --json '{"title":"My Memory","content":"...","type":"knowledge"}'

# From file
onasis memory create --content-file ./memory.md
```

---

## 📊 Service Enhancements

### API Gateway

**Improvements:**
- OAuth token passthrough for all proxied services
- Centralized rate limiting and routing
- Enhanced request tracing with request IDs
- Plan-based rate limiting
- New `get-me` endpoint for user profiles

**Endpoint:** `https://api.lanonasis.com`

---

### Auth Gateway

**New Features:**
- Opaque OAuth PKCE token introspection
- Live profile endpoint (`GET /v1/auth/me`)
- Token verification fallback
- Enhanced audit logging

**Endpoint:** `https://auth.lanonasis.com`

---

### Memory Service

**Enhancements:**
- Consistent response normalization
- Legacy endpoint compatibility layer
- Proactive session refresh
- Improved error handling
- Intelligence and behavior operations

**Endpoint:** `https://api.lanonasis.com/api/v1/memory`

---

## 💻 IDE Extensions

### VSCode Extension v2.1.1

**New Features:**
- 🌐 Web extension support (vscode.dev, github.dev)
- 📦 Virtual workspace support
- 🔒 Untrusted workspace support
- 🎨 Enhanced React-based UI (experimental)
- 🔗 CLI v3.0.6+ integration

**Configuration:**
```json
{
  "lanonasis.enableMCP": true,
  "lanonasis.mcpAutoDiscover": true,
  "lanonasis.transportPreference": "auto",
  "lanonasis.useEnhancedUI": true,
  "lanonasis.preferCLI": true
}
```

**Keyboard Shortcuts:**
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+M` | Search memories |
| `Ctrl+Shift+Alt+M` | Create from selection |
| `Ctrl+Shift+K` | Manage API keys |

[IDE Integration →](../mcp/ide-integration.md)

---

## 📚 New Documentation

### Added Sections

- **CLI Reference**: Complete command reference with examples
- **Memory Intelligence**: Guide to AI-powered features
- **Behavior Operations**: Workflow intelligence documentation
- **Web IDE Setup**: vscode.dev and github.dev guides
- **OAuth PKCE Flow**: Complete authentication guide
- **MCP Production Deployment**: Production server configuration
- **Security Runbooks**: Auth hardening procedures

### Improved Guides

- Authentication troubleshooting with live verification
- MCP transport selection guide
- API key management best practices
- Migration guides for OAuth adoption

---

## 🔄 Migration Guide

### For Existing Users

#### 1. Update CLI

```bash
npm install -g @lanonasis/cli@latest
```

#### 2. Migrate to OAuth (Recommended)

```bash
# Old way (still works)
onasis auth login --vendor-key <key>

# New recommended way
onasis auth login
# Opens browser for secure OAuth
```

#### 3. Update IDE Extensions

Install "LanOnasis Memory Assistant" v2.1.1+ from your IDE's extension marketplace.

#### 4. Migrate IDE Credentials

```bash
# In VSCode (Desktop or Web)
# 1. Press Ctrl+Shift+P
# 2. Run: Lanonasis: Authenticate
# 3. Select "OAuth (Browser)"
# 4. Done! Credentials now stored securely
```

---

## ⚠️ Breaking Changes

### Deprecated

- **Plaintext API Key Setting** (IDE): Migrate to SecretStorage
  - Old: `lanonasis.apiKey` in settings.json
  - New: Use `Lanonasis: Authenticate` command

### Behavior Changes

- **`auth status` now performs live API probe**: May reveal auth issues previously hidden
- **Offline grace restricted**: Now applies only to network failures, not auth rejections
- **Manual endpoint overrides preserved**: No longer overwritten by service discovery

---

## 🐛 Critical Bug Fixes

**Security:**
- ✅ Fixed OAuth sessions showing "Not Authenticated" incorrectly
- ✅ Removed 24-hour validation bypass security hole
- ✅ Fixed bogus vendor key always passing auth
- ✅ Stale JWT cleared on vendor key switch

**Stability:**
- ✅ Fixed frozen terminal during inline editing
- ✅ Fixed service discovery overwriting manual overrides
- ✅ Fixed memory auth routing inconsistencies

**Compatibility:**
- ✅ Zod v4 compatibility fixes
- ✅ Inquirer v9 compatibility fixes

---

## 📈 Performance Improvements

- **40% faster search latency** through optimized vector indexing
- **Proactive token refresh** reduces intermittent auth errors
- **Response normalization** improves consistency across environments
- **Auto-reconnection** reduces manual intervention

---

## 🎯 Use Cases

### For Individual Developers

1. **Quick Setup**: `onasis guide` for interactive onboarding
2. **Daily Workflow**: Use inline editor for fast memory creation
3. **Context Sync**: `onasis memory save-session` to persist work context
4. **Smart Search**: Semantic search with `onasis memory search`

### For Teams

1. **OAuth Authentication**: Secure SSO integration
2. **Shared Context**: Team memory banks with role-based access
3. **API Key Management**: Project-based key organization
4. **Audit Logging**: Track all memory operations

### For AI Assistants

1. **MCP Integration**: Connect Claude, Cursor, Windsurf via MCP
2. **Real-time Context**: WebSocket for live updates
3. **Tool Discovery**: Automatic tool listing and calling
4. **Secure Access**: Token-based authentication with scopes

---

## 🚀 What's Next

### Q2 2026 Roadmap

- **Workspace Memory Sharing**: Team collaboration in IDEs
- **AI-Powered Suggestions**: Context-aware memory recommendations
- **Analytics Dashboard**: Usage metrics and insights
- **Multi-Modal Memories**: Support for images and audio
- **Custom Embeddings**: Fine-tune embedding models

---

## 📞 Need Help?

- **Documentation**: [docs.lanonasis.com](https://docs.lanonasis.com)
- **CLI Reference**: [CLI Commands](../cli/reference.md)
- **API Reference**: [API Docs](../api/overview.md)
- **Issues**: [GitHub Issues](https://github.com/lanonasis/lanonasis-maas/issues)
- **Enterprise**: enterprise@lanonasis.com

---

*Last updated: February 25, 2026*
