---
sidebar_position: 1
---

# Installation

Get started with LanOnasis in minutes.

## Prerequisites

- Node.js 18+ or Bun
- API key from [dashboard.lanonasis.com](https://dashboard.lanonasis.com)

## Choose Your SDK

### Memory Client (Recommended)
Lightweight SDK for most applications.

```bash
# npm
npm install @lanonasis/memory-client

# yarn
yarn add @lanonasis/memory-client

# bun
bun add @lanonasis/memory-client
```

### Standalone Memory SDK
For multi-agent systems and standalone projects.

```bash
# npm
npm install @lanonasis/memory-sdk-standalone

# yarn
yarn add @lanonasis/memory-sdk-standalone

# bun
bun add @lanonasis/memory-sdk-standalone
```

### Enterprise SDK (Coming Soon)
Full-featured SDK with memory, API keys, and MCP.

```bash
# npm
npm install @lanonasis/sdk

# yarn
yarn add @lanonasis/sdk

# bun
bun add @lanonasis/sdk
```

## Configuration

Create a `.env` file:
```env
LANONASIS_API_KEY=your_api_key_here
LANONASIS_API_URL=https://api.lanonasis.com
```

## Next Steps

- [Quick Start Guide](./quick-start)
- [API Overview](/api/overview)
- [SDK Documentation](/sdks/overview)
