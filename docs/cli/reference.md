---
title: CLI Reference
sidebar_label: CLI Reference
---

# LanOnasis CLI Reference

Complete reference for the `@lanonasis/cli` v3.9.8+ - Professional CLI for Memory as a Service (MaaS).

## Installation

```bash
# Global installation (recommended)
npm install -g @lanonasis/cli

# Verify installation
onasis --version
# or
lanonasis --version
```

## Command Aliases

The CLI supports multiple command aliases:

| Command | Purpose |
|---------|---------|
| `onasis` | Primary command (recommended) |
| `lanonasis` | Standard LanOnasis interface |
| `memory` | Memory-focused operations |
| `maas` | Memory as a Service operations |

```bash
# All are equivalent:
onasis memory list
lanonasis memory list
memory list
maas memory list
```

## Global Options

```bash
-v, --version           # Display version number
--verbose               # Enable verbose logging
--api-url <url>         # Override API URL
--output <format>       # Output format (json, table, yaml)
--no-mcp                # Disable MCP, use direct API
--help                  # Show help
```

---

## Authentication Commands

### `onasis auth login`

Authenticate with the LanOnasis platform.

```bash
# Interactive OAuth (recommended)
onasis auth login

# OAuth with specific method
onasis auth login --oauth

# Vendor key authentication (for CI/CD)
onasis auth login --vendor-key <key>
onasis auth login -k <key>

# Username/password credentials
onasis auth login --credentials

# Device flow (headless)
onasis auth login --device

# Force re-authentication
onasis auth login --force
```

**Options:**
- `-k, --vendor-key <key>`: Vendor API key for non-interactive auth
- `--oauth`: Use OAuth PKCE flow
- `--credentials`: Use username/password
- `--device`: Use device flow
- `--force`: Force re-authentication

---

### `onasis auth status`

Check authentication status with **live API verification**.

```bash
onasis auth status
```

**Shows:**
- Authentication method (OAuth/Vendor Key/Credentials)
- Live user profile from `GET /v1/auth/me`
- Real memory API access probe
- Token expiry information
- Manual endpoint override warnings

**Example Output:**
```
✓ Authenticated: Yes
✓ User: john.doe@example.com
✓ Role: Developer
✓ Plan: Pro
✓ Memory API: accessible
✓ Token expires: 2026-03-15T10:30:00Z
```

---

### `onasis whoami` ✨ NEW

Display full authenticated user profile.

```bash
onasis whoami
```

**Shows:**
- Email address
- Full name
- Role
- OAuth provider
- Project scope
- Last login time
- Plan/subscription

**Example Output:**
```
User Profile:
  Email: john.doe@example.com
  Name: John Doe
  Role: Developer
  OAuth Provider: GitHub
  Project: my-project
  Last Login: 2026-02-25T09:15:00Z
  Plan: Pro
```

---

### `onasis auth logout`

Clear authentication credentials.

```bash
onasis auth logout
```

---

## Memory Commands

### `onasis memory create`

Create a new memory.

```bash
# Interactive creation
onasis memory create

# Inline editor (recommended)
onasis memory create --inline

# With JSON payload
onasis memory create --json '{"title":"My Memory","content":"...","type":"knowledge"}'

# From file
onasis memory create --content-file ./memory.md

# With options
onasis memory create \
  --title "My Memory" \
  --content "Memory content" \
  --type "knowledge" \
  --tags "tag1,tag2" \
  --topic "my-topic"
```

**Options:**
- `--inline`: Use inline text editor
- `--json <json>`: JSON payload
- `--content-file <path>`: Read content from file
- `-t, --title <title>`: Memory title
- `-c, --content <content>`: Memory content
- `--type <type>`: Memory type (context, project, knowledge, reference, personal, workflow)
- `--tags <tags>`: Comma-separated tags
- `--topic <topic>`: Topic/namespace

---

### `onasis memory list`

List memories with filters.

```bash
# List all memories
onasis memory list

# With pagination
onasis memory list --limit 20 --offset 0

# Filter by type
onasis memory list --type knowledge

# Filter by tags
onasis memory list --tags "tag1,tag2"

# JSON output
onasis memory list --output json
```

**Options:**
- `-l, --limit <number>`: Number of results (default: 20)
- `-o, --offset <number>`: Offset for pagination
- `-t, --type <type>`: Filter by type
- `--tags <tags>`: Filter by tags
- `--topic <topic>`: Filter by topic

---

### `onasis memory get`

Retrieve a specific memory.

```bash
onasis memory get <memory-id>
```

---

### `onasis memory update`

Update an existing memory.

```bash
# Interactive update
onasis memory update <memory-id>

# Inline editor
onasis memory update <memory-id> --inline

# With options
onasis memory update <memory-id> \
  --title "Updated Title" \
  --content "Updated content" \
  --tags "new,tag1"
```

**Options:**
- `--inline`: Use inline text editor
- `-t, --title <title>`: New title
- `-c, --content <content>`: New content
- `--tags <tags>`: New tags

---

### `onasis memory delete`

Delete a memory.

```bash
# Delete single memory
onasis memory delete <memory-id>

# Delete multiple memories
onasis memory delete <id1> <id2> <id3>

# Bulk delete with confirmation
onasis memory delete --bulk
```

---

### `onasis memory search`

Semantic search across memories.

```bash
# Basic search
onasis memory search "your query"

# With filters
onasis memory search "meeting notes" \
  --type "context" \
  --limit 10 \
  --threshold 0.55

# JSON output
onasis memory search "your query" --output json
```

**Options:**
- `-t, --type <type>`: Filter by type
- `-l, --limit <number>`: Number of results
- `--threshold <number>`: Similarity threshold (0.0-1.0)
- `--tags <tags>`: Filter by tags
- `--topic <topic>`: Filter by topic

---

### `onasis memory save-session` ✨ NEW

Save current session context as memory.

```bash
# Save current git branch, status, and changed files
onasis memory save-session

# With custom title
onasis memory save-session --title "Development Session"

# Include specific metadata
onasis memory save-session --metadata '{"project":"my-app"}'
```

**Saves:**
- Current git branch
- Git status
- Changed files
- Timestamp
- Working directory

---

## Memory Intelligence Commands ✨ NEW

### `onasis memory intelligence health`

Check memory bank health and statistics.

```bash
onasis memory intelligence health
```

---

### `onasis memory intelligence suggest-tags`

Suggest relevant tags for content.

```bash
# From file
onasis memory intelligence suggest-tags --file ./content.md

# From stdin
echo "My content" | onasis memory intelligence suggest-tags

# From memory ID
onasis memory intelligence suggest-tags --memory-id <id>
```

---

### `onasis memory intelligence find-related`

Find memories related to given content.

```bash
# From query
onasis memory intelligence find-related "your query"

# From memory ID
onasis memory intelligence find-related --memory-id <id>

# With limit
onasis memory intelligence find-related "your query" --limit 5
```

---

### `onasis memory intelligence detect-duplicates`

Detect potential duplicate memories.

```bash
# Check all memories
onasis memory intelligence detect-duplicates

# Check specific memory
onasis memory intelligence detect-duplicates --memory-id <id>

# Custom threshold
onasis memory intelligence detect-duplicates --threshold 0.8
```

---

### `onasis memory intelligence extract-insights`

Extract key insights from memories.

```bash
# From memory IDs
onasis memory intelligence extract-insights --memory-ids <id1>,<id2>

# With topic
onasis memory intelligence extract-insights \
  --memory-ids <id1>,<id2> \
  --topic "key decisions"
```

---

### `onasis memory intelligence analyze-patterns`

Analyze usage patterns and trends.

```bash
# Analyze all patterns
onasis memory intelligence analyze-patterns

# Time range
onasis memory intelligence analyze-patterns \
  --time-range "last-30-days"

# By type
onasis memory intelligence analyze-patterns --type "knowledge"
```

---

## Memory Behavior Commands ✨ NEW

### `onasis memory behavior record`

Record behavior/workflow context.

```bash
onasis memory behavior record \
  --action "code-review" \
  --context '{"pr":"#123","files":["src/index.ts"]}' \
  --metadata '{"duration":"30m"}'
```

---

### `onasis memory behavior recall`

Recall relevant behavior patterns.

```bash
onasis memory behavior recall "code review process"

# With context
onasis memory behavior recall "code review" \
  --context '{"file":"src/index.ts"}' \
  --limit 5
```

---

### `onasis memory behavior suggest`

Suggest next actions based on patterns.

```bash
onasis memory behavior suggest \
  --current-context '{"file":"src/index.ts","action":"testing"}'

# With goal
onasis memory behavior suggest \
  --current-context '{"file":"src/index.ts"}' \
  --goal "complete implementation"
```

---

## MCP Commands

### `onasis mcp connect`

Connect to MCP server.

```bash
# Auto-connect (best available mode)
onasis mcp connect

# Force remote mode
onasis mcp connect --remote

# Force WebSocket mode
onasis mcp connect --websocket

# Local development
onasis mcp connect --local

# Check status
onasis mcp status
```

---

### `onasis mcp status`

Check MCP connection status.

```bash
onasis mcp status
```

**Shows:**
- Connection status
- Server mode (local/remote)
- Transport type
- Authentication method
- Available tools count

---

### `onasis mcp list-tools`

List available MCP tools.

```bash
onasis mcp list-tools

# Filter by category
onasis mcp list-tools --category memory

# JSON output
onasis mcp list-tools --output json
```

---

### `onasis mcp call`

Call an MCP tool.

```bash
onasis mcp call create_memory \
  --args '{"title":"My Memory","content":"...","type":"knowledge"}'

# JSON output
onasis mcp call search_memories \
  --args '{"query":"meeting notes","limit":5}' \
  --output json
```

---

## MCP Server Commands

### `onasis mcp-server start`

Start local MCP server.

```bash
# Stdio mode (default)
onasis mcp-server start

# HTTP mode
onasis mcp-server start --http

# Custom port
onasis mcp-server start --http --port 3001

# Verbose logging
onasis mcp-server start --verbose
```

**Options:**
- `--http`: Use HTTP transport
- `--stdio`: Use stdio transport (default)
- `--port <number>`: HTTP port (default: 3001)
- `--verbose`: Enable verbose logging

---

### `onasis mcp-server status`

Check MCP server status.

```bash
onasis mcp-server status
```

**Shows:**
- Server running status
- Process ID
- Port (if HTTP mode)
- Authentication method
- Configuration path

---

### `onasis mcp-server stop`

Stop local MCP server.

```bash
onasis mcp-server stop
```

---

## API Key Commands

### `onasis api-keys list`

List API keys.

```bash
onasis api-keys list

# Filter by project
onasis api-keys list --project <project-id>

# Filter by environment
onasis api-keys list --environment production
```

---

### `onasis api-keys create`

Create a new API key.

```bash
onasis api-keys create \
  --name "Production Key" \
  --type "vendor" \
  --environment "production" \
  --project <project-id>
```

---

### `onasis api-keys rotate`

Rotate an API key.

```bash
onasis api-keys rotate <key-id>
```

---

### `onasis api-keys revoke`

Revoke an API key.

```bash
onasis api-keys revoke <key-id>
```

---

## Topic Commands

### `onasis topics list`

List memory topics.

```bash
onasis topics list

# With pagination
onasis topics list --limit 20
```

---

### `onasis topics create`

Create a new topic.

```bash
onasis topics create --name "My Topic"
```

---

### `onasis topics delete`

Delete a topic.

```bash
onasis topics delete <topic-id>
```

---

## Configuration Commands

### `onasis config get`

Get configuration value.

```bash
onasis config get apiUrl
onasis config get useGateway
```

---

### `onasis config set`

Set configuration value.

```bash
onasis config set apiUrl https://api.lanonasis.com
onasis config set useGateway true
```

---

### `onasis config list`

List all configuration.

```bash
onasis config list

# JSON output
onasis config list --output json
```

---

## Organization Commands

### `onasis org info`

Get organization information.

```bash
onasis org info
```

---

### `onasis org members list`

List organization members.

```bash
onasis org members list
```

---

## Utility Commands

### `onasis health`

Check system health.

```bash
onasis health
```

**Checks:**
- API connectivity
- Authentication status
- MCP server status
- Service registry

---

### `onasis guide`

Run interactive guided setup.

```bash
onasis guide
```

**Covers:**
- API configuration
- Authentication setup
- Connectivity testing
- Input mode preferences
- Troubleshooting

---

### `onasis init`

Initialize configuration.

```bash
onasis init
```

---

### `onasis completion`

Generate shell completion scripts.

```bash
# Bash
onasis completion bash > ~/.bash_completion

# Zsh
onasis completion zsh > ~/.zshrc

# Fish
onasis completion fish > ~/.config/fish/completions/onasis.fish
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MEMORY_API_URL` | Override API URL | `https://api.lanonasis.com` |
| `LANONASIS_VENDOR_KEY` | Vendor API key | - |
| `LANONASIS_TOKEN` | JWT/OAuth token | - |
| `CLI_VERBOSE` | Enable verbose logging | `false` |
| `CLI_OUTPUT_FORMAT` | Output format (json/table/yaml) | `table` |
| `LANONASIS_FORCE_API` | Force direct API (no MCP) | `false` |

---

## Configuration Files

### `~/.maas/config.json`

Main configuration file:

```json
{
  "apiUrl": "https://api.lanonasis.com",
  "gatewayUrl": "https://api.lanonasis.com",
  "useGateway": true,
  "authUrl": "https://auth.lanonasis.com",
  "mcpServerUrl": "http://localhost:3001",
  "authMethod": "oauth",
  "transportPreference": "auto",
  "enableMCP": true,
  "manualEndpointOverrides": {}
}
```

### `~/.maas/onboarding.json`

Onboarding state:

```json
{
  "completed": false,
  "completedSteps": [],
  "preferences": {
    "inputMode": "inline",
    "editor": "vscode"
  }
}
```

---

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Configuration error |
| 3 | Authentication error |
| 4 | Network error |
| 5 | API error |

---

## Troubleshooting

### Authentication Issues

```bash
# Check status with live API probe
onasis auth status

# Force re-authentication
onasis auth login --force

# Clear credentials and start fresh
onasis auth logout
onasis auth login
```

### MCP Connection Issues

```bash
# Check MCP status
onasis mcp status

# Restart MCP server
onasis mcp-server stop
onasis mcp-server start

# Use direct API (bypass MCP)
onasis memory list --no-mcp
```

### Configuration Issues

```bash
# View current config
onasis config list

# Reset to defaults
onasis config reset

# Use environment override
MEMORY_API_URL=https://api.lanonasis.com onasis memory list
```

---

## Related Documentation

- [MCP Overview](../mcp/overview.md)
- [Authentication Guide](../auth/central-auth-gateway.md)
- [Memory Management](../memory/overview.md)
- [API Keys](../keys/vendor-key-management.md)
- [IDE Integration](../mcp/ide-integration.md)
