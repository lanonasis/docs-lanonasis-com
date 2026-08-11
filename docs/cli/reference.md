---
title: CLI Reference
sidebar_label: CLI Reference
description: "Complete reference for the LanOnasis CLI: commands, options, and examples."
---

<!-- DO NOT EDIT BY HAND. Generated from the built LanOnasis CLI by
     scripts/generate-cli-reference.mjs. Run `node scripts/generate-cli-reference.mjs`
     to regenerate. CI fails the build if the doc and the CLI disagree
     (`bun run validate:cli-reference`). -->

## LanOnasis CLI Reference

Complete reference for the `@lanonasis/cli` v<!-- AUTO:CLI_VERSION -->3.11.2<!-- /AUTO --> — Professional CLI for Memory as a Service (MaaS).

## Installation

```bash
# Global installation (recommended)
npm install -g @lanonasis/cli

# Verify installation
onasis --version
```

## Command Aliases

The primary command is `onasis`. The same binary is also exposed as:

- `lanonasis`
- `memory` (memory-focused operations)
- `maas` (Memory as a Service operations)

All examples below use `onasis`, but any alias works.

## Global Options

| Option | Description |
|--------|-------------|
| `-v, --version` | display version number |
| `-V, --verbose` | enable verbose logging |
| `--api-url <url>` | override API URL |
| `--output <format>` | output format (json, table, yaml) |
| `--no-mcp` | disable MCP and use direct API |
| `-h, --help` | display help for command |

## Command Index

| Command | Aliases | Description |
|---------|---------|-------------|
| `onasis init` | — | Initialize CLI configuration |
| `onasis auth` | — | Authentication commands |
| `onasis mcp` | — | MCP (Model Context Protocol) server operations |
| `onasis mcp-server` | — | MCP server initialization and management |
| `onasis memory` | — | Memory management commands |
| `onasis repl` | — | Start lightweight REPL session for memory operations |
| `onasis topic` | — | Topic management commands |
| `onasis config` | — | Configuration management |
| `onasis org` | — | Organization management |
| `onasis api-keys` | — | 🔐 Manage API keys securely with enterprise-grade encryption |
| `onasis prescan` | — | 🔍 Local filesystem prescan for secrets/PII before MIRA extraction. Reports are value-stripped — never exposes raw secrets. |
| `onasis completion` | — | Generate shell completion scripts |
| `onasis dashboard` | — | 🎛️  Manage React dashboard deployment and configuration |
| `onasis documentation` | — | 📚 Manage VitePress documentation deployment |
| `onasis sdk` | — | 🔧 Manage SDK packages and distribution |
| `onasis api` | — | 🌐 Manage REST API endpoints and services |
| `onasis deploy` | — | 🚀 Manage deployments and infrastructure |
| `onasis service` | — | ⚙️  Manage individual services and components |
| `onasis status` | — | Show overall system status |
| `onasis whoami` | — | Show the currently authenticated user profile |
| `onasis health` | — | Comprehensive system health check |
| `onasis docs` | — | Open documentation in browser |

## Setup Commands

### `onasis init`

Initialize CLI configuration

**Options:**

| Option | Description |
|--------|-------------|
| `-f, --force` | overwrite existing configuration |
| `-h, --help` | display help for command |

## Authentication Commands

### `onasis auth`

Authentication commands

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis auth login` | — | Login to your MaaS account |
| `onasis auth logout` | — | Logout from your account |
| `onasis auth status` | — | Show authentication status |
| `onasis auth diagnose` | — | Diagnose authentication issues |

#### `onasis auth login`

| Option | Description |
|--------|-------------|
| `-e, --email <email>` | email address |
| `-p, --password <password>` | password |
| `-k, --vendor-key <key>` | vendor key for API access |
| `-h, --help` | display help for command |

#### `onasis auth logout`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis auth status`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis auth diagnose`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## Memory Commands

### `onasis memory`

Memory management commands

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis memory create` | `add` | Create a new memory entry |
| `onasis memory save-session` | — | Save current session context (git branch/status + optional test summary) as a memory |
| `onasis memory list-sessions` | — | List saved CLI sessions (memories tagged session,cli by default) |
| `onasis memory load-session` | — | Load a saved session by memory ID (prints the saved session context) |
| `onasis memory delete-session` | — | Delete a saved session by memory ID |
| `onasis memory list` | `ls` | List memory entries |
| `onasis memory search` | — | Search memories using semantic search |
| `onasis memory get` | `show` | Get detailed information about a memory |
| `onasis memory update` | — | Update a memory entry |
| `onasis memory delete` | `rm` | Delete a memory entry |
| `onasis memory stats` | — | Show memory statistics (admin only) |
| `onasis memory intelligence` | — | Memory intelligence operations |
| `onasis memory behavior` | — | Behavior pattern intelligence operations |

#### `onasis memory create`

| Option | Description |
|--------|-------------|
| `-t, --title <title>` | memory title |
| `-c, --content <content>` | memory content |
| `--type <type>` | memory type (context, project, knowledge, reference, personal, workflow) |
| `--tags <tags>` | comma-separated tags |
| `--topic-id <id>` | topic ID |
| `-i, --interactive` | interactive mode |
| `--json <json>` | JSON payload (title, content, type/memory_type, tags[], topic_id) |
| `--content-file <path>` | Read memory content from a file (overrides --content) |
| `-h, --help` | display help for command |

#### `onasis memory save-session`

| Option | Description |
|--------|-------------|
| `-t, --title <title>` | memory title (default: "Session summary") |
| `--type <type>` | memory type (context, project, knowledge, reference, personal, workflow) (default: "project") |
| `--tags <tags>` | comma-separated tags (default: "session,cli") |
| `--test-summary <text>` | Optional test summary to include |
| `-h, --help` | display help for command |

#### `onasis memory list-sessions`

| Option | Description |
|--------|-------------|
| `-p, --page <page>` | page number (default: "1") |
| `-l, --limit <limit>` | number of entries per page (default: "20") |
| `--type <type>` | filter by memory type (default: "project") |
| `--tags <tags>` | filter by tags (comma-separated) (default: "session,cli") |
| `--sort <field>` | sort by field (created_at, updated_at, title, last_accessed) (default: "created_at") |
| `--order <order>` | sort order (asc, desc) (default: "desc") |
| `-h, --help` | display help for command |

#### `onasis memory load-session`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis memory delete-session`

| Option | Description |
|--------|-------------|
| `-f, --force` | skip confirmation |
| `-h, --help` | display help for command |

#### `onasis memory list`

| Option | Description |
|--------|-------------|
| `-p, --page <page>` | page number (default: "1") |
| `-l, --limit <limit>` | number of entries per page (default: "20") |
| `--type <type>` | filter by memory type |
| `--tags <tags>` | filter by tags (comma-separated) |
| `--user-id <id>` | filter by user ID (admin only) |
| `--sort <field>` | sort by field (created_at, updated_at, title, last_accessed) (default: "created_at") |
| `--order <order>` | sort order (asc, desc) (default: "desc") |
| `-h, --help` | display help for command |

#### `onasis memory search`

| Option | Description |
|--------|-------------|
| `-l, --limit <limit>` | number of results (default: "20") |
| `--threshold <threshold>` | similarity threshold (0-1) (default: "0.55") |
| `--type <types>` | filter by memory types (comma-separated) |
| `--tags <tags>` | filter by tags (comma-separated) |
| `--fallback-mode <mode>` | fallback mode when semantic search returns no results or fails (auto, lexical, never) (default: "auto") |
| `--no-fallback` | disable CLI lexical fallback when semantic search fails or returns no results |
| `--fail-on-fallback` | exit non-zero if CLI lexical fallback is used |
| `--ci` | CI mode: disable fallback, emit JSON, and fail on backend search errors |
| `--json` | emit machine-readable JSON output |
| `-h, --help` | display help for command |

#### `onasis memory get`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis memory update`

| Option | Description |
|--------|-------------|
| `-t, --title <title>` | new title |
| `-c, --content <content>` | new content |
| `--type <type>` | new memory type (context, project, knowledge, reference, personal, workflow) |
| `--tags <tags>` | new tags (comma-separated) |
| `-i, --interactive` | interactive mode |
| `-h, --help` | display help for command |

#### `onasis memory delete`

| Option | Description |
|--------|-------------|
| `-f, --force` | skip confirmation |
| `-h, --help` | display help for command |

#### `onasis memory stats`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis memory intelligence`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis memory behavior`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## Topics Commands

### `onasis topic`

Topic management commands

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis topic create` | `add` | Create a new topic |
| `onasis topic list` | `ls` | List topics |
| `onasis topic get` | `show` | Get detailed information about a topic |
| `onasis topic update` | — | Update a topic |
| `onasis topic delete` | `rm` | Delete a topic |

#### `onasis topic create`

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | topic name |
| `-d, --description <description>` | topic description |
| `-c, --color <color>` | topic color (hex format) |
| `--icon <icon>` | topic icon |
| `--parent <parentId>` | parent topic ID |
| `-i, --interactive` | interactive mode |
| `-h, --help` | display help for command |

#### `onasis topic list`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis topic get`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis topic update`

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | new name |
| `-d, --description <description>` | new description |
| `-c, --color <color>` | new color (hex format) |
| `--icon <icon>` | new icon |
| `-i, --interactive` | interactive mode |
| `-h, --help` | display help for command |

#### `onasis topic delete`

| Option | Description |
|--------|-------------|
| `-f, --force` | skip confirmation |
| `-h, --help` | display help for command |

## Configuration Commands

### `onasis config`

Configuration management

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis config set` | — | Set configuration value |
| `onasis config get` | — | Get configuration value |
| `onasis config show` | — | Show current configuration |
| `onasis config list` | — | List all configuration options |
| `onasis config set-url` | — | Set API URL |
| `onasis config test` | — | Test connection to API |
| `onasis config discover` | — | Discover service endpoints |
| `onasis config endpoints` | — | Show current service endpoints |
| `onasis config set-endpoint` | — | Set manual endpoint override (auth\|memory\|mcp-http\|mcp-ws\|mcp-sse) |
| `onasis config clear-overrides` | — | Clear manual endpoint overrides and rediscover services |
| `onasis config validate` | — | Validate configuration and check for issues |
| `onasis config backup` | — | Create a backup of current configuration |
| `onasis config restore` | — | Restore configuration from backup |
| `onasis config reset` | — | Reset all configuration |

#### `onasis config set`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config get`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config show`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config list`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config set-url`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config test`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config discover`

| Option | Description |
|--------|-------------|
| `-v, --verbose` | show detailed discovery information |
| `-h, --help` | display help for command |

#### `onasis config endpoints`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config set-endpoint`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config clear-overrides`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config validate`

| Option | Description |
|--------|-------------|
| `-v, --verbose` | show detailed validation information |
| `--repair` | automatically repair common issues |
| `-h, --help` | display help for command |

#### `onasis config backup`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config restore`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis config reset`

| Option | Description |
|--------|-------------|
| `-f, --force` | skip confirmation |
| `-h, --help` | display help for command |

## Organization Commands

### `onasis org`

Organization management

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis org info` | — | Show organization information |
| `onasis org members` | — | List organization members (admin only) |
| `onasis org usage` | — | Show organization usage statistics |

#### `onasis org info`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis org members`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis org usage`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## API Keys Commands

### `onasis api-keys`

🔐 Manage API keys securely with enterprise-grade encryption

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis api-keys create` | — | Create a new API key |
| `onasis api-keys list` | `ls` | List API keys |
| `onasis api-keys get` | — | Get details of a specific API key |
| `onasis api-keys update` | — | Update an API key |
| `onasis api-keys delete` | `rm` | Delete an API key |
| `onasis api-keys projects` | — | 📁 Manage API key projects and organization |
| `onasis api-keys mcp` | — | 🤖 Model Context Protocol (MCP) - Secure AI agent access |
| `onasis api-keys analytics` | — | View API key usage analytics and security events |

#### `onasis api-keys create`

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | API key name |
| `-d, --description <description>` | API key description (optional) |
| `--access-level <level>` | Access level (public, authenticated, team, admin, enterprise) (default: "team") |
| `--key-context <context>` | Optional memory context (personal, team, enterprise) |
| `--expires-in-days <days>` | Expiration in days (default: 365) (default: "365") |
| `--scopes <scopes>` | Comma-separated scopes (optional) |
| `--interactive` | Interactive mode |
| `-h, --help` | display help for command |

#### `onasis api-keys list`

| Option | Description |
|--------|-------------|
| `--all` | Include inactive keys |
| `--json` | Output as JSON |
| `-h, --help` | display help for command |

#### `onasis api-keys get`

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |
| `-h, --help` | display help for command |

#### `onasis api-keys update`

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | New name |
| `-d, --description <description>` | New description |
| `--access-level <level>` | New access level |
| `--expires-in-days <days>` | Set a new expiry in days |
| `--clear-expiry` | Remove the current expiry |
| `--scopes <scopes>` | Replace scopes with a comma-separated list |
| `--interactive` | Interactive mode |
| `-h, --help` | display help for command |

#### `onasis api-keys delete`

| Option | Description |
|--------|-------------|
| `-f, --force` | Skip confirmation |
| `-h, --help` | display help for command |

#### `onasis api-keys projects`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis api-keys mcp`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis api-keys analytics`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## Prescan Commands

### `onasis prescan`

🔍 Local filesystem prescan for secrets/PII before MIRA extraction. Reports are value-stripped — never exposes raw secrets.

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis prescan run` | — | Run prescan on a directory |
| `onasis prescan status` | — | Show last prescan state and statistics |

#### `onasis prescan run`

| Option | Description |
|--------|-------------|
| `--exclude <patterns...>` | Glob patterns to exclude (e.g. --exclude node_modules --exclude .git) |
| `--json` | Output machine-parseable JSON summary |
| `--save` | Write report to ~/.lanonasis/security/prescan/ |
| `--fail-on <threshold>` | Exit non-zero if classification meets threshold: none, quarantined, or flagged |
| `--ci` | CI mode: equivalent to --fail-on quarantined --json |
| `-h, --help` | display help for command |

#### `onasis prescan status`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## MCP Commands

### `onasis mcp`

MCP (Model Context Protocol) server operations

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis mcp connect` | — | Connect to MCP server (local, remote, or WebSocket) |
| `onasis mcp disconnect` | — | Disconnect from MCP server |
| `onasis mcp status` | — | Show MCP connection status |
| `onasis mcp tools` | — | List available MCP tools |
| `onasis mcp call` | — | Call an MCP tool directly |
| `onasis mcp memory` | — | Memory operations via MCP |
| `onasis mcp config` | — | Configure MCP preferences |
| `onasis mcp start` | — | Start MCP server for external clients (Claude Desktop, Cursor, etc.) |
| `onasis mcp diagnose` | — | Diagnose MCP connection issues |

#### `onasis mcp connect`

| Option | Description |
|--------|-------------|
| `-l, --local` | Connect to local MCP server |
| `-r, --remote` | Connect to remote MCP server (mcp.lanonasis.com) |
| `-w, --websocket` | Connect using WebSocket mode for enterprise users |
| `-s, --server <path>` | Local MCP server path |
| `-u, --url <url>` | Remote/WebSocket server URL |
| `--local-args <args>` | Extra args for local server (e.g., "--stdio --port 3001") |
| `-h, --help` | display help for command |

#### `onasis mcp disconnect`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis mcp status`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis mcp tools`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis mcp call`

| Option | Description |
|--------|-------------|
| `-a, --args <json>` | Tool arguments as JSON |
| `-h, --help` | display help for command |

#### `onasis mcp memory`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis mcp config`

| Option | Description |
|--------|-------------|
| `--prefer-websocket` | Prefer WebSocket MCP connection (recommended for production) |
| `--prefer-remote` | Prefer remote MCP server (REST/SSE mode) |
| `--prefer-local` | Prefer local MCP server (development only) |
| `--auto` | Auto-detect best connection mode |
| `-h, --help` | display help for command |

#### `onasis mcp start`

| Option | Description |
|--------|-------------|
| `--transport <type>` | Transport: stdio (default), ws, http, sse (default: "stdio") |
| `--port <number>` | Port for ws/http/sse (default: "3009") |
| `--host <address>` | Host address (default: "127.0.0.1") |
| `-h, --help` | display help for command |

#### `onasis mcp diagnose`

| Option | Description |
|--------|-------------|
| `-v, --verbose` | show detailed diagnostic information |
| `-h, --help` | display help for command |

### `onasis mcp-server`

MCP server initialization and management

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis mcp-server init` | — | Initialize MCP server configuration |

#### `onasis mcp-server init`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## Completion Commands

### `onasis completion`

Generate shell completion scripts

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## System Commands

### `onasis repl`

Start lightweight REPL session for memory operations

**Options:**

| Option | Description |
|--------|-------------|
| `--mcp` | Use MCP mode |
| `--api <url>` | Override API URL |
| `--ai-router <url>` | Override AI router URL |
| `--token <token>` | Authentication token |
| `--model <model>` | Model label/override for concierge responses |
| `--config <path>` | Path to a custom repl-config.json |
| `-h, --help` | display help for command |

### `onasis status`

Show overall system status

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

### `onasis whoami`

Show the currently authenticated user profile

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

### `onasis health`

Comprehensive system health check

**Options:**

| Option | Description |
|--------|-------------|
| `--verbose` | show detailed health information |
| `-h, --help` | display help for command |

### `onasis docs`

Open documentation in browser

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## Platform Management Commands

### `onasis dashboard`

🎛️  Manage React dashboard deployment and configuration

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis dashboard status` | — | Check dashboard deployment status |
| `onasis dashboard logs` | — | View dashboard deployment logs |

#### `onasis dashboard status`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis dashboard logs`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

### `onasis documentation`

📚 Manage VitePress documentation deployment

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis documentation status` | — | Check documentation deployment status |
| `onasis documentation build` | — | Trigger documentation rebuild |

#### `onasis documentation status`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis documentation build`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

### `onasis sdk`

🔧 Manage SDK packages and distribution

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis sdk status` | — | Check SDK deployment status |
| `onasis sdk versions` | — | List all available SDK versions |

#### `onasis sdk status`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis sdk versions`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

### `onasis api`

🌐 Manage REST API endpoints and services

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis api status` | — | Check REST API health and endpoints |
| `onasis api endpoints` | — | List all available API endpoints |

#### `onasis api status`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis api endpoints`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

### `onasis deploy`

🚀 Manage deployments and infrastructure

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis deploy status` | — | Check overall deployment status |
| `onasis deploy health` | — | Comprehensive health check of all services |

#### `onasis deploy status`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis deploy health`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

### `onasis service`

⚙️  Manage individual services and components

**Options:**

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

**Subcommands:**

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| `onasis service list` | — | List all available services |
| `onasis service restart` | — | Restart a specific service |

#### `onasis service list`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

#### `onasis service restart`

| Option | Description |
|--------|-------------|
| `-h, --help` | display help for command |

## Common Examples

```bash
# Initialize the CLI
onasis init

# Authenticate
onasis auth login

# Check system health
onasis health

# Create a memory
onasis memory create --title "Note" --content "..." --type knowledge

# Search memories
onasis memory search "query text" --limit 10

# List API keys
onasis api-keys list

# List MCP tools
onasis mcp tools
```

## Related Documentation

- [SDKs & Libraries](../sdks/overview.md) — language clients and packages
- [MCP Tools Reference](../mcp/tools.md) — MCP server tools
- [Auth Overview](../auth/central-auth-gateway.md) — authentication flows
- [REST API Reference](../memory/rest-api.md) — API endpoints

<!-- Generated 2026-08-11 from @lanonasis/cli v3.11.2. -->
