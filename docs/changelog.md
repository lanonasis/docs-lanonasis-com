---
title: Changelog
sidebar_position: 100
---

# Changelog

All notable changes to the LanOnasis platform will be documented here.

## [2026-Q1] - 2026-02-25

### 🚀 Major Platform Updates

#### CLI v3.9.8 - Enhanced Memory Intelligence & Behavior Operations

**New Features:**
- **JSON Memory Creation**: `onasis memory create --json <json>` for direct JSON payload creation
- **File-based Content**: `onasis memory create --content-file <path>` for ingesting content from files
- **Session Persistence**: `onasis memory save-session` to persist branch/status/changed-files as memory context
- **Intelligence Commands**: New `onasis memory intelligence` subcommands for:
  - Health checks
  - Tag suggestions
  - Related memory lookup
  - Duplicate detection
  - Insight extraction
  - Pattern analysis
- **Behavior Workflow**: New `onasis memory behavior` subcommands for `record`, `recall`, and `suggest` operations

**Improvements:**
- Normalized memory response handling for consistent CLI output
- Proactive token refresh before memory commands
- Aligned semantic search thresholds (0.55) across all search operations

---

#### CLI v3.9.7 - OAuth PKCE & Live Auth Verification

**New Commands:**
- **`onasis whoami`**: Display full authenticated user profile (email, name, role, OAuth provider, project scope, last login)
- **Enhanced `auth status`**: Now fetches live user profile and probes real memory API access

**Critical Security Fixes:**
- Fixed OAuth sessions incorrectly showing "Not Authenticated"
- Added `noExit` flag to prevent `process.exit(1)` from killing status probes
- Stale auth cache cleared on 401 responses
- Removed 24-hour `lastValidated` security bypass
- Restricted 7-day offline grace to network errors only
- Fixed bogus vendor key auth check - now uses real protected endpoint
- Fixed `discoverServices()` overwriting manual endpoint overrides
- Stale JWT cleared on vendor key switch
- Zod v4 and Inquirer v9 compatibility fixes

**Auth Gateway Integration:**
- OAuth PKCE token introspection for `GET /v1/auth/me`
- Central API Gateway fallback for OAuth token passthrough
- New `get-me` tool in auth-gateway MCP adapter

---

#### CLI v3.9.6 - Reliable Auth Routing

**Fixes:**
- Memory CRUD/search consistently route through API gateway (`https://api.lanonasis.com`)
- Legacy endpoint compatibility for RPC-style routes
- OAuth session stability with proactive refresh
- Response normalization for wrapped gateway responses

---

#### CLI v3.9.3 - Non-Interactive Auth & JWT Fixes

**Features:**
- Non-interactive vendor key auth: `onasis auth login -k, --vendor-key <key>`
- CI/CD pipeline support for automation

**Fixes:**
- JWT authentication routing to MCP server
- Fixed frozen terminal during inline text input (SSE/WebSocket event handler conflicts)
- Vendor key option properly registered in CLI

**Known Limitations:**
- `memory stats` not available with JWT authentication (MCP server limitation)

---

#### CLI v3.9.0 - UX Revolution

**Seamless Inline Text Editing:**
- Multi-line editing with visual feedback
- Line numbers and cursor indicators
- Full keyboard navigation
- Auto-preserves existing content
- No external editor dependencies

**Intelligent MCP Connection:**
- Auto-detects embedded MCP server
- Automatic configuration persistence
- Health monitoring and auto-reconnection
- Connection verification before operations
- Clear error messages with troubleshooting

**First-Run Onboarding:**
- Interactive guided setup
- Automatic connectivity testing
- Smart default configuration
- Context-aware troubleshooting

**Authentication Methods Clarified:**
- **OAuth**: MCP integration and real-time features
- **Vendor Key**: Direct API access from dashboard
- **Credentials**: Username/password for direct API

---

### 🔐 Security Enhancements

#### OAuth 2.0 with PKCE
- Browser-based secure authentication flow
- Automatic token refresh before expiry
- Device Flow for headless environments
- Console redaction prevents credential leaks

#### SecretStorage Integration
- OS-level keychain storage (macOS Keychain, Windows Credential Manager, Linux Secret Service)
- Deprecated plaintext `lanonasis.apiKey` setting
- Encrypted storage fallback when keytar unavailable

#### Auth Hardening
- Live API access verification
- Stale cache invalidation on 401
- Removed 24-hour validation skip
- Restricted offline grace period to network failures only

---

### 🤖 MCP Upgrades

#### Production Endpoint
**Base URL**: `https://mcp.lanonasis.com`

**Available Transports:**
- **SSE**: `https://mcp.lanonasis.com/sse` - Server-Sent Events
- **WebSocket**: `wss://mcp.lanonasis.com/ws` - Bidirectional communication
- **HTTP REST**: `https://mcp.lanonasis.com/api/v1/mcp/*` - REST API
- **Stdio**: Local development and CLI integration

#### New MCP Tools
- **Memory Intelligence**: Health check, tag suggestions, related lookup, duplicate detection, insights, patterns
- **Behavior Operations**: Record, recall, suggest workflow operations
- **Session Management**: Save session context (branch, status, changed files)
- **Auth Gateway**: `get-me` tool for user profile retrieval

#### CLI-Embedded MCP Server
- Uses CLI configuration and authentication
- Runs standalone or invoked by CLI commands
- Auto-discovery and configuration
- Supports stdio and HTTP modes

---

### 💻 IDE Extensions - Web Support

#### VSCode Extension v2.1.1

**New Features:**
- **🌐 Web Extension Support**: Works in VS Code for Web (vscode.dev, github.dev)
- **Virtual Workspaces**: Full support with limited features
- **Untrusted Workspaces**: API key management requires workspace trust

**Enhanced Integration:**
- CLI v3.0.6+ compatibility
- Prefer CLI integration when available
- MCP protocol support with auto-discovery
- Enhanced React-based UI (experimental)

**Configuration Settings:**
```json
{
  "lanonasis.apiUrl": "https://api.lanonasis.com",
  "lanonasis.gatewayUrl": "https://api.lanonasis.com",
  "lanonasis.useGateway": true,
  "lanonasis.authUrl": "https://auth.lanonasis.com",
  "lanonasis.enableMCP": true,
  "lanonasis.mcpAutoDiscover": true,
  "lanonasis.websocketUrl": "wss://mcp.lanonasis.com/ws",
  "lanonasis.transportPreference": "auto",
  "lanonasis.useEnhancedUI": true
}
```

**Available on:**
- VSCode Desktop
- **VSCode Web (vscode.dev)** ✨ NEW
- **GitHub.dev (git.dev)** ✨ NEW
- Cursor
- Windsurf

---

### 🛠️ Service Enhancements

#### API Gateway
- OAuth token passthrough for all proxied services
- Centralized rate limiting and routing
- Enhanced request tracing with request IDs
- Plan-based rate limiting

#### Memory Service
- Consistent response normalization
- Legacy endpoint compatibility layer
- Proactive session refresh
- Improved error handling

#### Auth Gateway
- Opaque OAuth PKCE token introspection
- Live profile endpoint (`GET /v1/auth/me`)
- Token verification fallback
- Enhanced audit logging

---

### 📚 Documentation Updates

#### New Documentation Sections
- **CLI Intelligence Commands**: Memory behavior and intelligence operations
- **OAuth PKCE Flow**: Complete device flow and browser-based auth guides
- **IDE Web Extensions**: VSCode web and GitHub.dev setup
- **MCP Production Deployment**: Production server configuration and best practices
- **Security Runbooks**: Auth hardening and audit procedures

#### Improved Guides
- Authentication troubleshooting with live verification
- MCP transport selection guide
- API key management best practices
- Migration guides for OAuth adoption

---

### 🔄 Breaking Changes

#### Deprecated (v1.4.1+ IDE Extensions)
- Plaintext `lanonasis.apiKey` setting - migrate to SecretStorage
- Migration: Run `Lanonasis: Authenticate` command

#### Behavior Changes
- `auth status` now performs live API probe (may reveal auth issues previously hidden)
- Offline grace period restricted to network failures (not auth rejections)
- Manual endpoint overrides preserved during service discovery

---

### 🐛 Bug Fixes Summary

**Critical (P0):**
- OAuth sessions showing "Not Authenticated" incorrectly
- Process termination during status checks
- 24-hour validation bypass security hole
- Bogus vendor key always passing auth

**High (P1):**
- Memory auth routing inconsistencies
- Frozen terminal during inline editing
- Service discovery overwriting manual overrides
- Stale JWT causing auth method confusion

**Medium (P2):**
- Configuration not loaded before use
- Empty content overwrites in updates
- Zod v4 and Inquirer v9 compatibility

---

### 📊 Metrics & Monitoring

**New Endpoints:**
- `GET /v1/auth/me` - User profile with OAuth info
- `POST /api/v1/memories/search` - Auth verification probe
- `GET /health` - Enhanced health checks with service status

**Rate Limits:**
- Free Tier: 60 requests/minute
- Pro Tier: 300 requests/minute
- Enterprise: Custom limits

---

## [1.2.0] - 2024-01-15

### 🚀 Added
- **Streaming API**: Real-time memory retrieval with WebSocket support
- **Hybrid Search**: Combined semantic and keyword search for improved accuracy
- **Analytics Dashboard**: Usage metrics and insights for monitoring
- **OAuth 2.0 Support**: Enterprise SSO integration for secure authentication
- **MCP Integration**: Full Model Context Protocol support for AI applications
- **Batch Operations**: Process multiple memories efficiently in single requests

### 🔄 Changed
- Improved embedding model to 1536 dimensions for better semantic understanding
- Reduced search latency by 40% through optimized vector indexing
- Updated TypeScript SDK to v2.0 with full type safety
- Enhanced metadata filtering with nested object support
- Upgraded infrastructure for 10x scale improvements

### 🐛 Fixed
- Memory duplication issue in batch operations
- Rate limiting edge cases for concurrent requests
- Metadata filtering with complex nested objects
- WebSocket connection stability in streaming API
- Token counting accuracy for large documents

### 🔒 Security
- Added workspace-level encryption for sensitive data
- Implemented API key rotation mechanism
- Enhanced audit logging for compliance
- Added IP allowlisting for enterprise accounts
- Improved rate limiting algorithms

---

## [1.1.0] - 2023-12-01

### 🚀 Added
- **Python SDK**: Official Python client library with full feature parity
- **CLI Tool**: Command-line interface for memory management
- **Export/Import**: Backup and restore functionality for memories
- **Webhooks**: Event notifications for memory operations
- **Custom Embeddings**: Support for custom embedding models

### 🔄 Changed
- Increased rate limits for Pro tier users
- Optimized memory storage for cost efficiency
- Improved error messages and debugging information
- Enhanced documentation with more examples

### 🐛 Fixed
- Search relevance scoring inconsistencies
- Memory update race conditions
- CLI authentication on Windows systems
- Pagination issues in large result sets

---

## [1.0.0] - 2023-10-15

### 🎉 Initial Release
- **Core Memory API**: Store, retrieve, update, and delete memories
- **Vector Search**: Semantic search with state-of-the-art embeddings
- **TypeScript SDK**: Full-featured client library for JavaScript/TypeScript
- **REST API**: Complete RESTful API with OpenAPI specification
- **Authentication**: API key-based authentication with workspace support
- **Rate Limiting**: Fair usage policies with tiered limits
- **Documentation**: Comprehensive guides and API reference

### Key Features
- 768-dimension embeddings for semantic search
- Sub-100ms search latency
- 99.9% uptime SLA for Pro and Enterprise
- GDPR compliant data handling
- Multi-region deployment

---

## Migration Guides

### Upgrading to v3.9.x (2026-Q1)

#### OAuth Migration
If you're using OAuth sessions, ensure you're running v3.9.7+ for proper authentication:

```bash
# Check your CLI version
onasis --version

# Update if needed
npm install -g @lanonasis/cli@latest

# Re-authenticate with OAuth
onasis auth login
```

#### IDE Extension Migration
Migrate from plaintext API key storage to SecretStorage:

```bash
# In VSCode
# 1. Run: Lanonasis: Authenticate
# 2. Select "OAuth (Browser)" or "API Key"
# 3. Credentials now stored securely in OS keychain
```

#### Endpoint Configuration
If using manual endpoint overrides, they're now preserved during service discovery:

```json
{
  "manualEndpointOverrides": {
    "memory": "https://custom-endpoint.com/api/v1/memory"
  }
}
```

### Upgrading to v1.2.0

#### Breaking Changes
- `search()` method now requires explicit namespace parameter
- Embedding dimensions changed from 768 to 1536
- Rate limit headers format updated

#### Migration Steps

```typescript
// Old (v1.1.x)
const results = await client.search({
  query: "meeting notes"
})

// New (v1.2.0)
const results = await client.search({
  query: "meeting notes",
  namespace: "default" // Now required
})
```

#### Re-indexing for New Embeddings

```bash
# Re-generate embeddings for existing memories
npm run reindex:embeddings -- --model=v2
```

### Upgrading to v1.1.0

No breaking changes. New features are backward compatible.

---

## Deprecation Notices

### Scheduled for Removal in v2.0.0
- Legacy `/api/v1/store` endpoint (use `/api/v1/memories` instead)
- 768-dimension embedding support
- API key format v1 (migrate to v2 format)
- Plaintext `lanonasis.apiKey` setting (use SecretStorage)

### Already Deprecated
- ~~`client.store()`~~ - Use `client.upsert()` instead
- ~~`includeVector` parameter~~ - Use `includeEmbedding` instead

---

## Upcoming Features (Roadmap)

### Q2 2026
- Workspace memory sharing in IDE extensions
- AI-powered memory suggestions
- Memory analytics dashboard
- Team collaboration features

### Q3 2026
- Multi-modal memory support (images, audio)
- Federated search across workspaces
- Custom embedding fine-tuning
- Enterprise data residency options

---

*For questions about migrations or breaking changes, please refer to our [Support page](/support) or contact your technical account manager.*
