---
title: Memory CLI
sidebar_label: CLI
---

Use the LanOnasis CLI to interact with Memory Suite from terminals and automation.

## Install

```bash
npm i -g @lanonasis/cli
```

## Authenticate

Run the device flow to sign in and cache credentials locally:

```bash
lanonasis auth device
```

## Example commands

```bash
# Create a memory item
lanonasis memory create --namespace default --text "Hello, Memory Suite" --tags example

# Search
lanonasis memory search --namespace default --query "Hello"
```

## Related docs

- Overview: [MaaS Overview](./overview.md)
- REST API: [Memory REST API](./rest-api.md)
- SDK: [Memory SDK](./sdk.md)

