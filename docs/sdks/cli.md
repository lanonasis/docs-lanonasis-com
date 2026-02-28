---
sidebar_position: 4
---

# CLI Tool

Official command-line interface for LanOnasis Memory-as-a-Service.

## Installation

```bash
npm install -g @lanonasis/cli
```

**Current Version:** <!-- AUTO:CLI_VERSION -->3.9.8<!-- /AUTO -->

:::info Auth and memory routing
`lanonasis auth login` currently supports OAuth PKCE, device flow, and API key login. Memory commands target the REST API first and can fall back to direct `/functions/v1/memory-*` routes for compatible bearer-token sessions.
:::

## Usage

```bash
# Initialize CLI
lanonasis init

# Login
lanonasis auth login

# Create a memory
lanonasis memory create --title "My Note" --content "Important information"

# Search memories
lanonasis memory search "query"

# List memories
lanonasis memory list --limit 10

# Connect to MCP server
lanonasis mcp connect

# Check system health
lanonasis health
```

## Commands

### Core Commands
- `init` - Initialize CLI configuration
- `auth` - Authentication management
- `health` - System health check
- `status` - Show overall system status

### Memory Commands
- `memory` - Memory operations (create, list, get, update, delete, search)
- `topic` - Topic management (create, list, get, update, delete)

### MCP Commands
- `mcp` - MCP server operations (connect, status, tools, call)
- `mcp-server` - MCP server initialization and management

### Configuration Commands
- `config` - Configuration management

### Organization Commands
- `org` - Organization management

### API Key Management
- `api-keys` - API key lifecycle management

### System Commands
- `dashboard` - Dashboard deployment status
- `documentation` - Documentation deployment status
- `sdk` - SDK package status
- `api` - REST API status
- `deploy` - Deployment status
- `service` - Service management
- `repl` - Start REPL session

See [CLI Commands Reference](./cli/commands.md) for complete documentation.
