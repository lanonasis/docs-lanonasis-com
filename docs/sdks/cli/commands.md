# CLI Commands Reference

Complete reference for all LanOnasis CLI commands, options, and examples.

## Global Options

All commands support these global options:

| Option | Short | Description |
|--------|-------|-------------|
| `--api-key` | `-k` | API key for authentication |
| `--base-url` | `-b` | Base URL for API requests |
| `--format` | `-f` | Output format (json, yaml, table) |
| `--debug` | `-d` | Enable debug logging |
| `--verbose` | `-v` | Verbose output |
| `--help` | `-h` | Show help information |

## Memory Commands

### Create Memory

Create a new memory.

```bash
lanonasis memory create [OPTIONS] CONTENT
```

**Options:**
- `--metadata` `-m`: Metadata as JSON string
- `--tags` `-t`: Comma-separated tags
- `--file` `-f`: Read content from file
- `--stdin`: Read content from stdin

**Examples:**
```bash
# Create a simple memory
lanonasis memory create "Important meeting notes"

# Create with metadata and tags
lanonasis memory create "Project ideas" \
  --metadata '{"project":"web-app","priority":"high"}' \
  --tags "work,planning,important"

# Create from file
lanonasis memory create --file notes.txt

# Create from stdin
echo "Meeting notes" | lanonasis memory create --stdin
```

### List Memories

List memories with optional filtering.

```bash
lanonasis memory list [OPTIONS]
```

**Options:**
- `--limit` `-l`: Number of memories to return (default: 20)
- `--offset` `-o`: Number of memories to skip (default: 0)
- `--filters` `-f`: Filter criteria as JSON
- `--sort-by`: Field to sort by
- `--sort-order`: Sort order (asc, desc)
- `--format` `-f`: Output format

**Examples:**
```bash
# List all memories
lanonasis memory list

# List with limit and offset
lanonasis memory list --limit 50 --offset 10

# Filter by metadata
lanonasis memory list --filters '{"category":"work"}'

# Sort by creation date
lanonasis memory list --sort-by created_at --sort-order desc
```

### Get Memory

Get a specific memory by ID.

```bash
lanonasis memory get MEMORY_ID [OPTIONS]
```

**Options:**
- `--format` `-f`: Output format

**Examples:**
```bash
# Get memory by ID
lanonasis memory get mem_1234567890abcdef

# Get with custom format
lanonasis memory get mem_1234567890abcdef --format yaml
```

### Update Memory

Update an existing memory.

```bash
lanonasis memory update MEMORY_ID [OPTIONS]
```

**Options:**
- `--content` `-c`: New content
- `--metadata` `-m`: Updated metadata as JSON
- `--tags` `-t`: Updated tags
- `--file` `-f`: Read content from file
- `--stdin`: Read content from stdin

**Examples:**
```bash
# Update content
lanonasis memory update mem_1234567890abcdef --content "Updated content"

# Update metadata
lanonasis memory update mem_1234567890abcdef \
  --metadata '{"updated":true,"version":"2.0"}'

# Update from file
lanonasis memory update mem_1234567890abcdef --file updated_notes.txt
```

### Delete Memory

Delete a memory.

```bash
lanonasis memory delete MEMORY_ID [OPTIONS]
```

**Options:**
- `--force` `-f`: Skip confirmation prompt

**Examples:**
```bash
# Delete memory
lanonasis memory delete mem_1234567890abcdef

# Delete without confirmation
lanonasis memory delete mem_1234567890abcdef --force
```

## Search Commands

### Search Memories

Search memories using natural language.

```bash
lanonasis search QUERY [OPTIONS]
```

**Options:**
- `--limit` `-l`: Number of results (default: 10)
- `--filters` `-f`: Filter criteria as JSON
- `--include-metadata`: Include metadata in results
- `--format` `-f`: Output format

**Examples:**
```bash
# Basic search
lanonasis search "project meeting notes"

# Search with filters
lanonasis search "authentication" --filters '{"category":"documentation"}'

# Search with limit
lanonasis search "important" --limit 20
```

### Generate Embedding

Generate vector embeddings for text.

```bash
lanonasis embedding generate TEXT [OPTIONS]
```

**Options:**
- `--model` `-m`: Embedding model (default: text-embedding-3-large)
- `--dimensions` `-d`: Number of dimensions (default: 1536)
- `--metadata`: Metadata as JSON string
- `--file` `-f`: Read text from file
- `--stdin`: Read text from stdin

**Examples:**
```bash
# Generate embedding
lanonasis embedding generate "This is some text to embed"

# Generate with custom model
lanonasis embedding generate "Text" --model text-embedding-3-small --dimensions 512

# Generate from file
lanonasis embedding generate --file document.txt
```

## Batch Commands

### Batch Operations

Perform multiple operations in a single request.

```bash
lanonasis batch OPERATIONS_FILE [OPTIONS]
```

**Options:**
- `--continue-on-error`: Continue if individual operations fail
- `--max-retries`: Maximum retry attempts
- `--timeout`: Timeout in milliseconds

**Examples:**
```bash
# Run batch operations from file
lanonasis batch operations.json

# Run with error handling
lanonasis batch operations.json --continue-on-error --max-retries 3
```

**Operations file format:**
```json
{
  "operations": [
    {
      "type": "create",
      "data": {
        "content": "Memory 1",
        "metadata": {"type": "note"}
      }
    },
    {
      "type": "create",
      "data": {
        "content": "Memory 2",
        "metadata": {"type": "note"}
      }
    }
  ]
}
```

## Webhook Commands

### Create Webhook

Create a webhook for real-time notifications.

```bash
lanonasis webhook create URL [OPTIONS]
```

**Options:**
- `--events` `-e`: Comma-separated events to subscribe to
- `--secret` `-s`: Webhook secret for verification
- `--active`: Whether webhook is active (default: true)
- `--filters` `-f`: Event filters as JSON

**Examples:**
```bash
# Create webhook
lanonasis webhook create "https://your-app.com/webhooks/lanonasis" \
  --events "memory.created,memory.updated" \
  --secret "your-webhook-secret"

# Create with filters
lanonasis webhook create "https://your-app.com/webhooks/lanonasis" \
  --events "memory.created" \
  --filters '{"user_id":"user123"}'
```

### List Webhooks

List all webhooks.

```bash
lanonasis webhook list [OPTIONS]
```

**Options:**
- `--active`: Filter by active status
- `--event`: Filter by event type
- `--format` `-f`: Output format

**Examples:**
```bash
# List all webhooks
lanonasis webhook list

# List active webhooks
lanonasis webhook list --active

# List webhooks for specific event
lanonasis webhook list --event memory.created
```

### Update Webhook

Update an existing webhook.

```bash
lanonasis webhook update WEBHOOK_ID [OPTIONS]
```

**Options:**
- `--events` `-e`: Updated events
- `--secret` `-s`: Updated secret
- `--active`: Active status
- `--filters` `-f`: Updated filters

**Examples:**
```bash
# Update webhook events
lanonasis webhook update webhook_1234567890abcdef \
  --events "memory.created,memory.updated,memory.deleted"

# Update webhook status
lanonasis webhook update webhook_1234567890abcdef --active false
```

### Delete Webhook

Delete a webhook.

```bash
lanonasis webhook delete WEBHOOK_ID [OPTIONS]
```

**Options:**
- `--force` `-f`: Skip confirmation prompt

**Examples:**
```bash
# Delete webhook
lanonasis webhook delete webhook_1234567890abcdef

# Delete without confirmation
lanonasis webhook delete webhook_1234567890abcdef --force
```

## Analytics Commands

### Get Analytics

Retrieve analytics and metrics.

```bash
lanonasis analytics get [OPTIONS]
```

**Options:**
- `--timeframe` `-t`: Time period (1h, 24h, 7d, 30d, 90d)
- `--start-date`: Start date in ISO 8601 format
- `--end-date`: End date in ISO 8601 format
- `--metrics`: Comma-separated metrics
- `--group-by`: Group results by time period
- `--format` `-f`: Output format

**Examples:**
```bash
# Get analytics for last 7 days
lanonasis analytics get --timeframe 7d

# Get specific metrics
lanonasis analytics get --metrics "memory_operations,search_queries"

# Get analytics for date range
lanonasis analytics get \
  --start-date "2024-01-01T00:00:00Z" \
  --end-date "2024-01-31T23:59:59Z"
```

## Configuration Commands

### Show Configuration

Display current configuration.

```bash
lanonasis config show [OPTIONS]
```

**Options:**
- `--format` `-f`: Output format

**Examples:**
```bash
# Show configuration
lanonasis config show

# Show as YAML
lanonasis config show --format yaml
```

### Set Configuration

Set configuration values.

```bash
lanonasis config set KEY VALUE [OPTIONS]
```

**Examples:**
```bash
# Set API key
lanonasis config set api-key "new-api-key"

# Set base URL
lanonasis config set base-url "https://api.lanonasis.com"

# Set output format
lanonasis config set output-format "yaml"
```

### Reset Configuration

Reset configuration to defaults.

```bash
lanonasis config reset [OPTIONS]
```

**Options:**
- `--force` `-f`: Skip confirmation prompt

**Examples:**
```bash
# Reset configuration
lanonasis config reset

# Reset without confirmation
lanonasis config reset --force
```

## Utility Commands

### Version

Show version information.

```bash
lanonasis version [OPTIONS]
```

**Options:**
- `--format` `-f`: Output format

### Help

Show help information.

```bash
lanonasis help [COMMAND]
```

**Examples:**
```bash
# Show general help
lanonasis help

# Show help for specific command
lanonasis help memory create
```

### Completion

Generate shell completion scripts.

```bash
lanonasis completion SHELL
```

**Supported shells:**
- `bash`
- `zsh`
- `fish`
- `powershell`

**Examples:**
```bash
# Generate bash completion
lanonasis completion bash

# Generate zsh completion
lanonasis completion zsh
```

## Output Formats

### JSON (Default)
```bash
lanonasis memory list --format json
```

### YAML
```bash
lanonasis memory list --format yaml
```

### Table
```bash
lanonasis memory list --format table
```

### Custom Template
```bash
lanonasis memory list --format "{{.ID}}\t{{.Content}}\t{{.CreatedAt}}"
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LANONASIS_API_KEY` | API key for authentication |
| `LANONASIS_BASE_URL` | Base URL for API requests |
| `LANONASIS_OUTPUT_FORMAT` | Default output format |
| `LANONASIS_DEBUG` | Enable debug logging |
| `LANONASIS_TIMEOUT` | Request timeout in seconds |
| `LANONASIS_MAX_RETRIES` | Maximum retry attempts |

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | General error |
| `2` | Authentication error |
| `3` | Validation error |
| `4` | Not found error |
| `5` | Rate limit error |
| `6` | Server error |
| `7` | Network error |