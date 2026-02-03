---
title: Memory CLI
sidebar_label: CLI
description: Command-line interface for LanOnasis Memory Suite (v1.5.2+)
---

The **LanOnasis CLI** provides professional-grade command-line access to Memory Suite from terminals, scripts, and CI/CD pipelines. Supports shell completions, OAuth device flows, MCP integration, and enterprise workflows.

## Installation

### Latest Version (v1.5.2+)

Install globally via npm or Bun:

```bash
# Using npm
npm install -g @lanonasis/cli

# Using Bun (recommended for faster setup)
bun install -g @lanonasis/cli

# Verify installation
lanonasis --version
```

### Local Development (from source)

For development or testing the latest main branch:

```bash
git clone https://github.com/lanonasis/cli.git
cd cli
bun install
bun run build
bun link  # Makes 'lanonasis' available globally
```

---

## Authentication

### Device Flow (Interactive, Recommended)

The device flow is ideal for terminal users who need to authenticate interactively:

```bash
lanonasis auth device
```

This command:

1. Generates a device code and user code
2. Displays a URL to visit in your browser
3. Enters polling loop (up to 5 minutes)
4. Caches credentials in `~/.lanonasis/credentials.json` on success

**Example output**:

```
Device authentication initiated.
Visit: https://auth.lanonasis.com/device?code=ABC123XYZ
Enter code on device or paste here: ABC123XYZ
Waiting for browser confirmation... ✓ Authenticated!
Credentials cached: ~/.lanonasis/credentials.json
```

**What happens next**:

- Credentials stored securely (AES-256-GCM encryption)
- Access token refreshed automatically before expiry
- Refresh token rotated per [Golden Contract v0.1](https://docs.lanonasis.com/security/golden-contract) standards

### Browser Flow (Programmatic / CI Systems)

For automation and CI/CD systems, use the browser-based OAuth 2.0 code flow:

```bash
lanonasis auth browser --port 3000 --timeout 60000
```

**Parameters**:

- `--port`: Local callback server port (default: 3000)
- `--timeout`: Max wait time in milliseconds (default: 120000)
- `--headless`: Launch browser automatically (default: true)

**Returns**:

```json
{
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refreshToken": "ref_....",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Token-Based Authentication (Scripts/CI)

For fully non-interactive environments:

```bash
export LANONASIS_ACCESS_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."
export LANONASIS_REFRESH_TOKEN="ref_...."

# All subsequent commands use these tokens
lanonasis memory search --query "test"
```

---

## Shell Completions

### Bash Completion

Enable bash completions for faster command discovery:

```bash
# Generate completion script
lanonasis --completion bash > ~/.bash_lanonasis_completion.sh

# Load it in your shell
echo 'source ~/.bash_lanonasis_completion.sh' >> ~/.bashrc
source ~/.bashrc
```

**Usage**:

```bash
lanonasis memory <TAB><TAB>
# Suggests: create, search, get, update, delete, export, import

lanonasis memory create --<TAB><TAB>
# Suggests: --namespace, --text, --tags, --metadata, --ttl
```

### Zsh Completion

```bash
# Generate and install zsh completion
lanonasis --completion zsh > ~/.zsh_lanonasis_completion.sh

echo 'source ~/.zsh_lanonasis_completion.sh' >> ~/.zshrc
source ~/.zshrc
```

### Fish Completion

```bash
# Install completion directly to Fish config
lanonasis --completion fish | source

# Persist across sessions
lanonasis --completion fish > ~/.config/fish/completions/lanonasis.fish
```

---

## Memory Operations

### Create a Memory Item

Store a new memory item with optional metadata and tags:

```bash
lanonasis memory create \
  --namespace default \
  --text "Project deadline: Q2 2026" \
  --tags important,project-planning \
  --metadata '{"project_id":"proj_123","owner":"alice@example.com"}'
```

**Parameters**:

- `--namespace`: Workspace/project namespace (required, default: `default`)
- `--text`: Memory content as plain text or JSON (required)
- `--tags`: Comma-separated tags for organization
- `--metadata`: JSON object with custom fields
- `--ttl`: Time-to-live in seconds (optional)
- `--silent`: Output only ID, no status message

**Example with TTL (temporary memory)**:

```bash
lanonasis memory create \
  --namespace sessions \
  --text '{"user_id":"u_456","session_id":"sess_789"}' \
  --ttl 86400 \
  --metadata '{"type":"session_cache"}'
```

### Search Memories

Semantic search across your memory namespace:

```bash
lanonasis memory search \
  --namespace default \
  --query "project deadlines" \
  --limit 10 \
  --offset 0
```

**Parameters**:

- `--query`: Search string (semantic, not keyword-based)
- `--namespace`: Workspace to search (default: `default`)
- `--limit`: Max results (default: 10, max: 100)
- `--offset`: Pagination offset (default: 0)
- `--filter`: JSON filter expression (advanced)
- `--format`: Output format: `json`, `csv`, `table` (default: `table`)

**Example with advanced filtering**:

```bash
lanonasis memory search \
  --namespace default \
  --query "Q2 planning" \
  --filter '{"tags":["project-planning"],"createdAfter":"2026-01-01"}' \
  --format json
```

**Output** (default table format):

```
ID                   Text                          Tags              Created
mem_12345678         Project deadline: Q2 2026     important         2026-01-15
mem_87654321         Q2 OKRs review session        project-planning  2026-01-16
```

### Retrieve a Specific Memory

Get full details of a memory item by ID:

```bash
lanonasis memory get --id mem_12345678 --namespace default
```

**Output**:

```json
{
  "id": "mem_12345678",
  "namespace": "default",
  "text": "Project deadline: Q2 2026",
  "tags": ["important", "project-planning"],
  "metadata": {
    "project_id": "proj_123",
    "owner": "alice@example.com"
  },
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z",
  "ttl": null
}
```

### Update a Memory Item

Modify text, tags, or metadata of existing memory:

```bash
lanonasis memory update \
  --id mem_12345678 \
  --text "Updated deadline: Q2 2026 → Q3 2026" \
  --tags urgent,project-planning
```

### Delete a Memory Item

Permanently remove a memory:

```bash
lanonasis memory delete --id mem_12345678 --force
```

**Parameters**:

- `--id`: Memory ID (required)
- `--force`: Skip confirmation prompt (optional)
- `--namespace`: Workspace (optional, auto-detected from ID)

---

## Topic Management

Topics organize and categorize memories into logical groups. Perfect for multi-user projects:

### Create a Topic

```bash
lanonasis topic create \
  --namespace default \
  --name "Q2 2026 Planning" \
  --description "All planning activities for Q2" \
  --owner "alice@example.com"
```

### Add Memories to a Topic

```bash
lanonasis topic add-memory \
  --topic-id topic_abc123 \
  --memory-id mem_12345678
```

### List Topic Memories

```bash
lanonasis topic list-memories \
  --topic-id topic_abc123 \
  --format table
```

### Export Topic as Markdown

Useful for reports and documentation:

```bash
lanonasis topic export \
  --topic-id topic_abc123 \
  --format markdown \
  --output planning-q2-2026.md
```

---

## API Key Management

Create and manage API keys for programmatic access without interactive auth:

### Generate an API Key

```bash
lanonasis keys create \
  --name "My CI/CD Pipeline" \
  --namespace default \
  --scopes "memory:read,memory:write,topic:read"
```

**Output**:

```json
{
  "keyId": "key_xyz123abc",
  "secret": "sk_live_[REDACTED]",
  "name": "My CI/CD Pipeline",
  "createdAt": "2026-01-15T12:00:00Z",
  "expiresAt": "2027-01-15T12:00:00Z"
}
```

**⚠️ Important**: Save the secret immediately; it cannot be retrieved later.

### List Active Keys

```bash
lanonasis keys list --format table
```

### Revoke a Key

```bash
lanonasis keys revoke --key-id key_xyz123abc
```

### Use Key in Requests

```bash
export LANONASIS_API_KEY="sk_live_[YOUR_KEY_HERE]"

# All commands now use this key
lanonasis memory search --query "test" --namespace default
```

---

## MCP Integration

The CLI integrates with [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) for AI agent workflows:

### Check MCP Status

```bash
lanonasis mcp status
```

**Output**:

```
MCP Server Status: Running
  Address: 127.0.0.1:9000
  Protocol: stdio/sse
  Connected Clients: 2
  Available Tools: 12
```

### Connect to MCP Server

```bash
lanonasis mcp connect --host localhost --port 9000
```

### List Available MCP Tools

```bash
lanonasis mcp tools list
```

**Output**:

```
Available MCP Tools:
  memory.create – Create a new memory item
  memory.search – Semantic search across memories
  memory.get – Retrieve a specific memory
  memory.update – Modify a memory item
  memory.delete – Remove a memory item
  topic.create – Create a new topic
  topic.list – List all topics
```

### Execute MCP Tool

```bash
lanonasis mcp tool execute memory.search \
  --args '{"query":"Q2 planning","limit":5}'
```

---

## Common Workflows

### Scenario 1: Daily Standup Preparation

Quickly recall today's context from yesterday's notes:

```bash
# Search for yesterday's notes
lanonasis memory search \
  --query "completed tasks yesterday" \
  --namespace team-sync \
  --format table

# Add today's plan
lanonasis memory create \
  --namespace team-sync \
  --text "Today: Code review PRs, fix issues #234, #567" \
  --tags daily,standup
```

### Scenario 2: CI/CD Pipeline Memory

Persist build artifacts metadata or deployment contexts:

```bash
#!/bin/bash
BUILD_ID="build_20260115_123456"
COMMIT_SHA=$(git rev-parse --short HEAD)

# Store build info as memory
lanonasis memory create \
  --namespace ci-builds \
  --text "Build $BUILD_ID succeeded" \
  --metadata "{\"commit\":\"$COMMIT_SHA\",\"branch\":\"main\",\"status\":\"success\"}" \
  --tags automated,ci-pipeline
```

### Scenario 3: Compliance Auditing

Maintain audit trails of important decisions (fulfills SOX/GDPR requirements):

```bash
lanonasis memory create \
  --namespace compliance-audit \
  --text "Data retention review completed for customer IDs in range: 100000-200000" \
  --metadata '{"reviewer":"security@example.com","timestamp":"2026-01-15T14:30:00Z","status":"approved"}' \
  --tags compliance,gdpr,audit-trail
```

---

## Error Handling

### Common Errors and Solutions

**Error: `401 Unauthorized`**

- **Cause**: Invalid or expired credentials
- **Fix**: Re-authenticate with `lanonasis auth device`

```bash
lanonasis auth device
```

**Error: `403 Forbidden`**

- **Cause**: Insufficient permissions for this namespace or resource
- **Fix**: Verify API key scopes or contact workspace admin

```bash
lanonasis keys list  # Check your keys
```

**Error: `404 Not Found`**

- **Cause**: Memory ID or namespace does not exist
- **Fix**: Verify ID spelling and namespace

```bash
lanonasis memory search --namespace default --query "test"
```

**Error: `429 Too Many Requests`**

- **Cause**: Rate limit exceeded (100 req/min default)
- **Fix**: Implement exponential backoff; contact support for higher limits

```bash
# Retry with delay
sleep 60
lanonasis memory search --query "test"
```

---

## Golden Contract v0.1 Compliance

All CLI operations comply with [Golden Contract v0.1](https://docs.lanonasis.com/security/golden-contract) standards:

- **Encryption**: Credentials encrypted with AES-256-GCM before storage
- **Token Rotation**: Refresh tokens rotated automatically
- **Audit Logging**: All operations logged and traceable
- **Scope Enforcement**: API key scopes strictly enforced
- **Rate Limiting**: Per-user rate limits prevent abuse

---

## Advanced Configuration

### Custom Config File

Create `~/.lanonasis/config.json`:

```json
{
  "namespace": "myapp",
  "apiUrl": "https://api.lanonasis.com",
  "timeout": 30000,
  "retries": 3,
  "logLevel": "info"
}
```

### Environment Variables

```bash
export LANONASIS_NAMESPACE="myapp"
export LANONASIS_API_URL="https://api.lanonasis.com"
export LANONASIS_TIMEOUT="30000"
export LANONASIS_LOG_LEVEL="debug"
```

### Debugging

Enable verbose output for troubleshooting:

```bash
lanonasis memory search --query "test" --log-level debug --verbose
```

---

## Related Documentation

- **[Memory Overview](./overview.md)** – Architecture and capabilities
- **[Memory REST API](./rest-api.md)** – HTTP endpoints and webhooks
- **[Memory SDK](./sdk.md)** – TypeScript/Node.js programmatic access
- **[Authentication Guide](../auth/)** – OAuth 2.0 flows and security
- **[MCP Documentation](https://modelcontextprotocol.io/)** – Model Context Protocol specification

---

## Support & Feedback

- **Bug Reports**: [GitHub Issues](https://github.com/lanonasis/cli/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/lanonasis/cli/discussions)
- **Security Concerns**: [security@lanonasis.com](mailto:security@lanonasis.com)
- **Community Chat**: [Discord](https://discord.gg/lanonasis)
