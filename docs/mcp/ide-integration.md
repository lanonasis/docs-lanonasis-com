---
title: MCP IDE Integration
sidebar_label: IDE Integration
---

This guide shows how to connect IDEs and agents to the LanOnasis MCP server.

## Options

- Remote: `https://mcp.lanonasis.com` (recommended for most)
- Local (development): `@lanonasis/cli mcp start` then point your IDE to the local endpoint

## Authentication

- Obtain a token using [Central Auth Gateway](../auth/central-auth-gateway.md) via Device Flow for headless or PKCE in browser.
- Configure the IDE/agent to send the bearer token with all requests.

## Example configurations

### VSCode/Cursor

Add an MCP provider entry pointing to `mcp.lanonasis.com` and supply your token via the IDE’s secrets mechanism or environment.

### Windsurf

Use the remote URL and a bearer token acquired via Device Flow. For local testing, start the CLI server and point Windsurf to the local URL.

## Choosing local vs remote

- Use remote for stable workflows, team sharing, and production reliability.
- Use local for development or when testing new tools/features without affecting shared environments.

## Related docs

- Production server details: [MCP → Production Server](./production-server.md)
- Memory tools: [Memory → Overview](../memory/overview.md)
- Vendor keys: [Vendor Key Management](../keys/vendor-key-management.md)

