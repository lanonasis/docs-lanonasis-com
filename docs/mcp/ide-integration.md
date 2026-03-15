---
title: MCP IDE Integration
sidebar_label: IDE Integration
---

# MCP IDE Integration

This guide shows how to connect IDEs and agents to the LanOnasis MCP server.

## 🌐 Web IDE Support (NEW!)

The LanOnasis Memory Assistant now works in **web-based IDEs**:

- ✅ **VSCode for Web** (vscode.dev)
- ✅ **GitHub.dev** (git.dev) 
- ✅ **Cursor Web** (coming soon)

This enables seamless memory management and context synchronization directly in your browser-based development environment.

## Connection Options

### Remote (Recommended)

**Production Endpoint**: `https://mcp.lanonasis.com`

Best for:
- Stable workflows
- Team sharing
- Production reliability
- Web IDEs (vscode.dev, github.dev)

### Local (Development)

**Local Endpoint**: Started via CLI

Best for:
- Development and testing
- New feature experimentation
- Offline work
- Custom configurations

```bash
# Start local MCP server
lanonasis mcp-server start --http --port 3001

# Or use auto-connect
lanonasis mcp connect --local
```

## Authentication

### OAuth 2.0 with PKCE (Recommended)

Secure browser-based authentication with automatic token management:

```bash
# Initiate OAuth flow
lanonasis auth login

# Check status with live profile
lanonasis auth status

# View your profile
lanonasis whoami
```

**Benefits:**
- ✅ No manual token management
- ✅ Automatic refresh before expiry
- ✅ Secure PKCE flow
- ✅ OS-level credential storage

### Device Flow (Headless)

For environments without browser access:

```bash
lanonasis auth login --device
```

### API Key (Alternative)

For automation and CI/CD:

```bash
lanonasis auth login --vendor-key <your-key>
```

## IDE-Specific Setup

### VSCode Desktop

**Extension**: LanOnasis Memory Assistant v2.1.1+

**Installation:**
```bash
# From VSCode Extensions Marketplace
# Search: "LanOnasis"

# Or via CLI
code --install-extension LanOnasis.lanonasis-memory
```

**Configuration:**
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
  "lanonasis.useEnhancedUI": true,
  "lanonasis.preferCLI": true,
  "lanonasis.verboseLogging": false
}
```

**Authentication:**
1. Press `Cmd+Shift+P` (or `Ctrl+Shift+P`)
2. Run: `Lanonasis: Authenticate`
3. Select "OAuth (Browser)" or "API Key"
4. Follow the prompts

**Keyboard Shortcuts:**
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+M` | Search memories |
| `Ctrl+Shift+Alt+M` | Create memory from selection |
| `Ctrl+Shift+K` | Manage API keys |
| `F1` → "Lanonasis" | Access all commands |

---

### VSCode Web (vscode.dev & github.dev) ✨ NEW

**Extension**: LanOnasis Memory Assistant v2.1.1+

**Installation:**
1. Open VSCode for Web (vscode.dev) or GitHub.dev
2. Go to Extensions (Ctrl+Shift+X)
3. Search: "LanOnasis Memory Assistant"
4. Click "Install"

**Features Available:**
- ✅ Memory search and retrieval
- ✅ Memory creation from selection
- ✅ Real-time sync
- ✅ API key management
- ✅ Chat participant integration
- ✅ Enhanced React UI (experimental)

**Limited Features:**
- ⚠️ Some features may require workspace trust
- ⚠️ Local file system access limited in web context

**Configuration:**
Same as VSCode Desktop, accessible via:
1. Settings (Ctrl+,)
2. Search: "LanOnasis"
3. Configure endpoints and authentication

**Authentication in Web:**
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: `Lanonasis: Authenticate`
3. Select "OAuth (Browser)" - recommended for web
4. Browser window opens for authentication
5. Return to VSCode Web - authenticated!

**Web-Specific Notes:**
- Uses browser's secure storage
- Credentials persist across sessions
- Works in private/incognito mode (credentials cleared on close)
- Requires internet connection for API access

---

### Cursor

**Extension**: Built-in MCP support

**Configuration:**
1. Open Cursor Settings
2. Navigate to MCP
3. Add new MCP server:
   - Name: `LanOnasis Memory`
   - Type: `HTTP` or `WebSocket`
   - URL: `https://mcp.lanonasis.com`
   - Auth: Bearer token (from OAuth or API key)

**Alternative - CLI Integration:**
```bash
# Start local MCP server
lanonasis mcp-server start --http --port 3001

# Configure Cursor to use localhost:3001
```

---

### Windsurf

**Extension**: Built-in MCP support

**Configuration:**
1. Open Windsurf Settings
2. Navigate to MCP Servers
3. Add configuration:

```json
{
  "mcpServers": {
    "lanonasis": {
      "url": "https://mcp.lanonasis.com",
      "transport": "websocket",
      "auth": {
        "type": "bearer",
        "token": "<your-token>"
      }
    }
  }
}
```

**Local Development:**
```bash
# Start local server
lanonasis mcp-server start --http --port 3001

# Configure Windsurf to use local endpoint
```

---

## Choosing Local vs Remote

### Use Remote When:
- ✅ Production workflows
- ✅ Team collaboration
- ✅ Consistent experience across devices
- ✅ Web IDE usage (vscode.dev, github.dev)
- ✅ Maximum reliability and uptime

### Use Local When:
- ✅ Development and testing
- ✅ Experimenting with new features
- ✅ Custom configurations
- ✅ Offline work
- ✅ Debugging and troubleshooting

---

## Troubleshooting

### Web IDE Issues

**Extension not loading:**
- Check browser console for errors
- Ensure workspace is trusted
- Try reloading the window (Ctrl+R)

**Authentication failing in web:**
- Clear browser cache and cookies
- Ensure pop-ups are allowed
- Try OAuth (Browser) method instead of API key

### Connection Issues

**Cannot connect to MCP:**
```bash
# Check CLI status
lanonasis auth status
lanonasis mcp status

# Test connectivity
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://mcp.lanonasis.com/health
```

**Manual endpoint configuration:**
```json
{
  "lanonasis.useGateway": false,
  "lanonasis.apiUrl": "https://api.lanonasis.com",
  "lanonasis.websocketUrl": "wss://mcp.lanonasis.com/ws"
}
```

### Authentication Issues

**OAuth token expired:**
```bash
# Force re-authentication
lanonasis auth login --force
```

**API key not working:**
```bash
# Verify key is valid
lanonasis auth login --vendor-key <your-key>

# Check status
lanonasis auth status
```

---

## Best Practices

1. **Use OAuth for Interactive Apps**: Automatic token management is more secure
2. **Enable MCP Auto-Discover**: Let the extension find your local server
3. **Use Gateway Mode**: Enhanced performance and routing
4. **Regular Authentication Checks**: Use `lanonasis auth status` to verify access
5. **Keep Extensions Updated**: Latest versions have bug fixes and new features
6. **Web IDE Security**: Use OAuth, avoid storing API keys in browser

---

## Related Documentation

- [MCP Overview](./overview.md) - Understanding MCP protocol
- [Production Server](./production-server.md) - Production deployment
- [Authentication Guide](../auth/central-auth-gateway.md) - OAuth and API keys
- [CLI Reference](../cli/reference.md) - CLI commands
- [VSCode Extension](../extensions/vscode.md) - VSCode-specific features

---

## Quick Reference

### Endpoints

| Service | URL |
|---------|-----|
| MCP Production | `https://mcp.lanonasis.com` |
| MCP SSE | `https://mcp.lanonasis.com/sse` |
| MCP WebSocket | `wss://mcp.lanonasis.com/ws` |
| API Gateway | `https://api.lanonasis.com` |
| Auth Gateway | `https://auth.lanonasis.com` |

### Commands

| Command | Description |
|---------|-------------|
| `lanonasis auth login` | Authenticate with OAuth or API key |
| `lanonasis auth status` | Check auth status with live API probe |
| `lanonasis whoami` | View user profile |
| `lanonasis mcp connect` | Connect to MCP server |
| `lanonasis mcp status` | Check MCP connection |
| `lanonasis mcp-server start` | Start local MCP server |

### IDE Extensions

| IDE | Extension | Web Support |
|-----|-----------|-------------|
| VSCode Desktop | LanOnasis Memory Assistant | N/A |
| VSCode Web | LanOnasis Memory Assistant | ✅ Yes |
| GitHub.dev | LanOnasis Memory Assistant | ✅ Yes |
| Cursor | Built-in MCP | ❌ No |
| Windsurf | Built-in MCP | ❌ No |
