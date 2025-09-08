#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import existing documentation files
const importDocs = () => {
  console.log('📚 Importing existing documentation...\n');
  
  // Files to import from backup
  const filesToImport = [
    { source: 'backup/DOCS_README.md', target: 'docs/overview.md', title: 'Platform Overview' },
    { source: 'backup/index.md', target: 'docs/features.md', title: 'Core Features' },
    { source: 'backup/MCP-REMOTE-CONNECTION.md', target: 'docs/api/mcp-integration.md', title: 'MCP Remote Connection' }
  ];
  
  // Create necessary directories
  const dirs = ['docs/api', 'docs/sdks', 'docs/getting-started', 'docs/use-cases'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
  
  // Import files with Docusaurus front matter
  filesToImport.forEach(({ source, target, title }) => {
    if (fs.existsSync(source)) {
      const content = fs.readFileSync(source, 'utf8');
      
      // Add Docusaurus front matter
      const enhancedContent = `---
title: ${title}
sidebar_position: ${target.includes('api') ? 2 : 1}
---

${content}`;
      
      fs.writeFileSync(target, enhancedContent);
      console.log(`✅ Imported: ${source} → ${target}`);
    } else {
      console.log(`⚠️  Source file not found: ${source}`);
    }
  });
  
  // Create additional structure files
  createStructureFiles();
  
  console.log('\n🎉 Documentation import complete!');
};

const createStructureFiles = () => {
  // API Overview
  const apiOverview = `---
title: API Overview
sidebar_position: 1
---

# API Reference

Welcome to the Lanonasis API documentation. Our REST API provides complete access to the Memory-as-a-Service platform.

## Base URL
\`\`\`
http://api.lanonasis.local/v1
\`\`\`

## Authentication

All API requests require authentication using an API key:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  http://api.lanonasis.local/v1/memories
\`\`\`

## Available Endpoints

### Memory Management
- \`GET /memories\` - List all memories
- \`POST /memories\` - Create a new memory
- \`GET /memories/:id\` - Get a specific memory
- \`PUT /memories/:id\` - Update a memory
- \`DELETE /memories/:id\` - Delete a memory

### Vector Search
- \`POST /search\` - Semantic search across memories
- \`POST /embeddings\` - Generate embeddings

### Real-time Updates
- \`GET /stream\` - Server-sent events for real-time updates
`;
  
  fs.writeFileSync('docs/api/overview.md', apiOverview);
  console.log('✅ Created: docs/api/overview.md');
  
  // SDKs Overview
  const sdksOverview = `---
title: SDKs & Libraries
sidebar_position: 1
---

# Official SDKs

Lanonasis provides official SDKs for multiple programming languages:

## TypeScript/JavaScript

\`\`\`bash
npm install @lanonasis/memory-sdk
\`\`\`

[View TypeScript SDK Documentation →](/sdks/typescript)

## Python

\`\`\`bash
pip install lanonasis
\`\`\`

[View Python SDK Documentation →](/sdks/python)

## CLI Tool

\`\`\`bash
npm install -g @lanonasis/cli
\`\`\`

[View CLI Documentation →](/sdks/cli)

## Community SDKs

- **Go**: [lanonasis-go](https://github.com/community/lanonasis-go)
- **Rust**: [lanonasis-rs](https://github.com/community/lanonasis-rs)
- **Ruby**: [lanonasis-ruby](https://github.com/community/lanonasis-ruby)
`;
  
  fs.writeFileSync('docs/sdks/overview.md', sdksOverview);
  console.log('✅ Created: docs/sdks/overview.md');
  
  // Getting Started
  const gettingStarted = `---
title: Quick Start
sidebar_position: 1
---

# Quick Start Guide

Get up and running with Lanonasis in 5 minutes.

## Prerequisites

- Node.js 18+ or Python 3.8+
- An API key (get one from the [Dashboard](http://dashboard.lanonasis.local))

## Installation

Choose your preferred SDK:

### TypeScript/JavaScript

\`\`\`bash
npm install @lanonasis/memory-sdk
\`\`\`

### Python

\`\`\`bash
pip install lanonasis
\`\`\`

## Your First Memory

### JavaScript Example

\`\`\`javascript
import { MemoryClient } from '@lanonasis/memory-sdk';

const client = new MemoryClient({
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const memory = await client.memories.create({
  content: 'My first memory!',
  metadata: { importance: 'high' }
});

// Search memories
const results = await client.search({
  query: 'first memory',
  limit: 10
});
\`\`\`

### Python Example

\`\`\`python
from lanonasis import MemoryClient

client = MemoryClient(api_key="your-api-key")

# Create a memory
memory = client.memories.create(
    content="My first memory!",
    metadata={"importance": "high"}
)

# Search memories
results = client.search(
    query="first memory",
    limit=10
)
\`\`\`

## Next Steps

- [Explore the API Reference](/api/overview)
- [Learn about Vector Search](/guides/vector-search)
- [Set up Real-time Sync](/guides/realtime-sync)
`;
  
  fs.writeFileSync('docs/getting-started/quick-start.md', gettingStarted);
  console.log('✅ Created: docs/getting-started/quick-start.md');
};

// Run the import
importDocs();
