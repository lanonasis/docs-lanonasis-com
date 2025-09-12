---
sidebar_position: 4
---

# CLI Tool

Official command-line interface for LanOnasis Memory-as-a-Service.

## Installation

```bash
npm install -g @lanonasis/cli
```

## Usage

```bash
# Login
lanonasis auth login

# Create a memory
lanonasis memory create --title "My Note" --content "Important information"

# Search memories
lanonasis memory search "query"

# List memories
lanonasis memory list --limit 10
```

## Commands

- `auth` - Authentication management
- `memory` - Memory operations
- `topic` - Topic management
- `config` - Configuration
