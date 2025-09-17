---
sidebar_position: 4
---

# CLI Tool

Official command-line interface for LanOnasis Memory-as-a-Service.

## Installation

```bash
npm install -g @LanOnasis/cli
```

## Usage

```bash
# Login
LanOnasis auth login

# Create a memory
LanOnasis memory create --title "My Note" --content "Important information"

# Search memories
LanOnasis memory search "query"

# List memories
LanOnasis memory list --limit 10
```

## Commands

- `auth` - Authentication management
- `memory` - Memory operations
- `topic` - Topic management
- `config` - Configuration
