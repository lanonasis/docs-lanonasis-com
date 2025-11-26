---
title: Memory Client SDK
sidebar_label: Memory Client
---

# Memory Client SDK

Official TypeScript/JavaScript SDK for Lanonasis Memory as a Service (MaaS).

## 🎯 Overview

The Memory Client SDK provides a simple, typed interface to the Lanonasis Memory Service. Unlike traditional LLMs with limited context windows, it enables unlimited, persistent, multi-modal memory storage with semantic search capabilities.

### Why Memory Client?

| Feature | Traditional LLMs | Memory Client |
|---------|-----------------|---------------|
| **Context Window** | Limited (4K-128K tokens) | ♾️ **Unlimited** |
| **Memory Persistence** | ❌ Ephemeral | ✅ **Permanent** |
| **Multi-Modal** | ⚠️ Limited | ✅ **Images, Audio, Documents, Code** |
| **Search** | ❌ None | ✅ **Vector Similarity + Metadata** |
| **Cross-Session** | ❌ Resets | ✅ **Full History** |

## 📦 Installation

```bash
# NPM
npm install @lanonasis/memory-client

# Yarn
yarn add @lanonasis/memory-client

# Bun (recommended)
bun add @lanonasis/memory-client
```

## 🚀 Quick Start

### Basic Setup

```typescript
import MemoryClient from '@lanonasis/memory-client';

// Initialize with API key
const memory = new MemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

// Create a memory
const newMemory = await memory.createMemory({
  title: 'Important Meeting Notes',
  content: 'Discussed Q4 strategy and budget allocation...',
  type: 'context',
  tags: ['meeting', 'strategy', 'q4']
});

// Search memories
const results = await memory.searchMemories({
  query: 'Q4 strategy',
  limit: 10,
  type: 'context'
});

console.log(results);
```

### Authentication Options

#### API Key (Recommended)

```typescript
const memory = new MemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: 'lns_your_api_key_here'
});
```

#### JWT Token

```typescript
const memory = new MemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  authToken: 'your_jwt_token'
});
```

#### OAuth via Central Auth

```typescript
const memory = new MemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  getToken: async () => {
    // Acquire short-lived token via OAuth
    return await getCentralAuthToken();
  }
});
```

## 📚 Core Operations

### Memory CRUD

#### Create Memory

```typescript
const memory = await client.createMemory({
  title: 'Project Requirements',
  content: 'User authentication must support OAuth 2.0...',
  type: 'project',              // context | project | knowledge | reference | personal | workflow
  tags: ['auth', 'security'],
  topic_id: 'project-alpha',
  metadata: {
    priority: 'high',
    assignee: 'john@company.com'
  }
});

console.log(memory.id); // UUID of created memory
```

#### Search Memories

```typescript
// Semantic search
const results = await client.searchMemories({
  query: 'authentication implementation',
  limit: 10,
  type: 'project',
  tags: ['auth'],
  similarity_threshold: 0.7
});

// Results include similarity scores
results.forEach(result => {
  console.log(`${result.title}: ${result.similarity_score}`);
});
```

#### Get Memory by ID

```typescript
const memory = await client.getMemory('memory-uuid');

console.log(memory.title);
console.log(memory.content);
console.log(memory.created_at);
```

#### Update Memory

```typescript
await client.updateMemory('memory-uuid', {
  title: 'Updated Title',
  content: 'Updated content...',
  tags: ['new', 'tags']
});
```

#### Delete Memory

```typescript
await client.deleteMemory('memory-uuid');
```

#### List All Memories

```typescript
const memories = await client.getAllMemories({
  page: 1,
  limit: 20,
  type: 'context',
  sort: 'created_at',
  order: 'desc'
});

console.log(`Total: ${memories.total}`);
console.log(`Page: ${memories.page} of ${memories.pages}`);
```

### Topic Management

Topics help organize related memories.

#### Create Topic

```typescript
const topic = await client.createTopic({
  name: 'Project Alpha',
  description: 'All memories related to Project Alpha development',
  color: '#3B82F6',
  metadata: { client: 'Acme Corp' }
});
```

#### List Topics

```typescript
const topics = await client.getTopics();

topics.forEach(topic => {
  console.log(`${topic.name} (${topic.memory_count} memories)`);
});
```

#### Get Topic with Memories

```typescript
const topic = await client.getTopic('topic-uuid', {
  includeMemories: true,
  limit: 50
});

console.log(topic.memories); // Array of memories in this topic
```

### Analytics & Stats

#### User Statistics

```typescript
const stats = await client.getUserStats();

console.log(`Total memories: ${stats.total_memories}`);
console.log(`Memories by type:`, stats.memories_by_type);
console.log(`Recent activity:`, stats.recent_activity);
console.log(`Storage used: ${stats.storage_used_mb}MB`);
```

#### Memory Insights

```typescript
const insights = await client.getMemoryInsights('memory-uuid');

console.log(`Related memories: ${insights.related_count}`);
console.log(`Access count: ${insights.access_count}`);
console.log(`Last accessed: ${insights.last_accessed}`);
```

## 🎨 Multi-Modal Memory

### Images with OCR

```typescript
import { MultiModalMemoryClient } from '@lanonasis/memory-client';

const memory = new MultiModalMemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY
});

// Upload image with automatic text extraction
const imageMemory = await memory.createImageMemory(
  'Product Screenshot',
  imageFile,  // File or Buffer
  { 
    extractText: true,           // OCR
    generateDescription: true,   // AI description
    detectObjects: true          // Object detection
  }
);

console.log(imageMemory.extracted_text);
console.log(imageMemory.ai_description);
console.log(imageMemory.detected_objects);
```

### Audio Transcription

```typescript
// Upload audio with automatic transcription
const audioMemory = await memory.createAudioMemory(
  'Team Meeting Recording',
  audioFile,
  {
    language: 'en',
    generateSummary: true,
    extractSpeakers: true
  }
);

console.log(audioMemory.transcription);
console.log(audioMemory.summary);
console.log(audioMemory.speakers);
```

### Document Processing

```typescript
// Upload PDF/DOCX with text extraction
const docMemory = await memory.createDocumentMemory(
  'Project Proposal',
  pdfFile,
  'pdf',
  {
    extractTables: true,
    generateOutline: true
  }
);

console.log(docMemory.extracted_text);
console.log(docMemory.tables);
console.log(docMemory.outline);
```

### Code Analysis

```typescript
// Store code with semantic analysis
const codeMemory = await memory.createCodeMemory(
  'Authentication Helper',
  codeString,
  'typescript',
  {
    extractFunctions: true,
    generateDocs: true,
    analyzeDependencies: true
  }
);

console.log(codeMemory.functions);
console.log(codeMemory.documentation);
console.log(codeMemory.dependencies);
```

### Multi-Modal Search

```typescript
// Search across all content types
const results = await memory.getMultiModalContext('user authentication', {
  includeImages: true,
  includeAudio: true,
  includeDocuments: true,
  includeCode: true,
  limit: 20
});

// Results organized by type
console.log('Text memories:', results.text);
console.log('Images:', results.images);
console.log('Audio:', results.audio);
console.log('Documents:', results.documents);
console.log('Code:', results.code);
```

## 🔄 Real-Time Updates

### Server-Sent Events (SSE)

```typescript
// Subscribe to memory updates
const unsubscribe = memory.onMemoryUpdate((update) => {
  console.log('Event:', update.event); // created | updated | deleted
  console.log('Memory:', update.memory);
  console.log('User:', update.user_id);
  console.log('Timestamp:', update.timestamp);
});

// Unsubscribe when done
unsubscribe();
```

### WebSocket Support

```typescript
// Real-time collaboration
const ws = memory.connectWebSocket({
  namespace: 'project-alpha',
  onMessage: (message) => {
    console.log('Real-time update:', message);
  },
  onError: (error) => {
    console.error('WebSocket error:', error);
  }
});

// Send message
ws.send({ type: 'sync', data: { memoryId: 'uuid' } });

// Close connection
ws.close();
```

## 🎯 Memory Types

### Context Memories

General contextual information and notes.

```typescript
await memory.createMemory({
  type: 'context',
  title: 'Customer Feedback',
  content: 'Users want dark mode support...'
});
```

### Project Memories

Project-specific knowledge and documentation.

```typescript
await memory.createMemory({
  type: 'project',
  title: 'API Design',
  content: 'RESTful endpoints using Express...',
  topic_id: 'project-alpha'
});
```

### Knowledge Memories

Educational content and reference materials.

```typescript
await memory.createMemory({
  type: 'knowledge',
  title: 'OAuth 2.0 Flow',
  content: 'Authorization code flow with PKCE...'
});
```

### Reference Memories

Quick reference and code snippets.

```typescript
await memory.createMemory({
  type: 'reference',
  title: 'JWT Validation',
  content: 'const decoded = jwt.verify(token, secret);'
});
```

### Personal Memories

User-specific private notes.

```typescript
await memory.createMemory({
  type: 'personal',
  title: 'Meeting with CEO',
  content: 'Discussed promotion opportunities...'
});
```

### Workflow Memories

Process and procedure documentation.

```typescript
await memory.createMemory({
  type: 'workflow',
  title: 'Deployment Process',
  content: '1. Run tests\n2. Build\n3. Deploy to staging...'
});
```

## 🔧 Advanced Features

### Batch Operations

```typescript
// Create multiple memories at once
const memories = await memory.batchCreate([
  { title: 'Memory 1', content: '...', type: 'context' },
  { title: 'Memory 2', content: '...', type: 'project' },
  { title: 'Memory 3', content: '...', type: 'knowledge' }
]);

// Update multiple memories
await memory.batchUpdate([
  { id: 'uuid1', tags: ['updated'] },
  { id: 'uuid2', tags: ['updated'] }
]);

// Delete multiple memories
await memory.batchDelete(['uuid1', 'uuid2', 'uuid3']);
```

### Semantic Similarity

```typescript
// Find similar memories
const similar = await memory.findSimilar('memory-uuid', {
  limit: 10,
  threshold: 0.8,
  excludeSelf: true
});

similar.forEach(mem => {
  console.log(`${mem.title}: ${mem.similarity_score}`);
});
```

### Memory Clustering

```typescript
// Group related memories
const clusters = await memory.clusterMemories({
  namespace: 'default',
  minClusterSize: 3,
  algorithm: 'kmeans'
});

clusters.forEach(cluster => {
  console.log(`Cluster: ${cluster.label}`);
  console.log(`Memories: ${cluster.memory_ids.length}`);
});
```

### Export & Backup

```typescript
// Export all memories to JSON
const backup = await memory.exportMemories({
  format: 'json',
  includeMetadata: true,
  includeEmbeddings: false
});

// Save to file
await fs.writeFile('backup.json', JSON.stringify(backup));

// Import from backup
await memory.importMemories(backup, {
  mergeStrategy: 'skip-existing'
});
```

## 🛠️ Error Handling

```typescript
import { MemoryClient, MemoryError } from '@lanonasis/memory-client';

try {
  const result = await memory.createMemory({...});
} catch (error) {
  if (error instanceof MemoryError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.statusCode);
    console.error('Code:', error.code);
    
    // Handle specific errors
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Refresh token or re-authenticate
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Wait and retry
        break;
      case 'VALIDATION_ERROR':
        // Check input data
        break;
    }
  }
}
```

## 🎨 Integration Examples

### React Hook

```typescript
import { useState, useEffect } from 'react';
import MemoryClient from '@lanonasis/memory-client';

const useMemoryClient = () => {
  const [client] = useState(() => new MemoryClient({
    apiUrl: process.env.REACT_APP_API_URL,
    apiKey: process.env.REACT_APP_API_KEY
  }));
  
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const search = async (query: string) => {
    setLoading(true);
    try {
      const results = await client.searchMemories({ query, limit: 10 });
      setMemories(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return { client, memories, loading, search };
};

// Usage in component
function MemorySearch() {
  const { search, memories, loading } = useMemoryClient();
  
  return (
    <div>
      <input onChange={(e) => search(e.target.value)} />
      {loading ? 'Loading...' : memories.map(m => <div key={m.id}>{m.title}</div>)}
    </div>
  );
}
```

### Next.js API Route

```typescript
// pages/api/memories/search.ts
import MemoryClient from '@lanonasis/memory-client';
import type { NextApiRequest, NextApiResponse } from 'next';

const memory = new MemoryClient({
  apiUrl: process.env.LANONASIS_API_URL!,
  apiKey: process.env.LANONASIS_API_KEY!
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { query } = req.body;
    const results = await memory.searchMemories({ query, limit: 10 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Express Server

```typescript
import express from 'express';
import MemoryClient from '@lanonasis/memory-client';

const app = express();
const memory = new MemoryClient({
  apiUrl: process.env.LANONASIS_API_URL,
  apiKey: process.env.LANONASIS_API_KEY
});

app.post('/api/memories', async (req, res) => {
  try {
    const result = await memory.createMemory(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/memories/search', async (req, res) => {
  try {
    const results = await memory.searchMemories({
      query: req.query.q as string,
      limit: 20
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## 🧪 Testing

```typescript
import MemoryClient from '@lanonasis/memory-client';

describe('MemoryClient', () => {
  let client: MemoryClient;
  
  beforeAll(() => {
    client = new MemoryClient({
      apiUrl: 'http://localhost:3000',
      apiKey: 'test_key'
    });
  });
  
  it('should create a memory', async () => {
    const memory = await client.createMemory({
      title: 'Test Memory',
      content: 'Test content',
      type: 'context'
    });
    
    expect(memory.id).toBeDefined();
    expect(memory.title).toBe('Test Memory');
  });
  
  it('should search memories', async () => {
    const results = await client.searchMemories({
      query: 'test',
      limit: 10
    });
    
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });
});
```

## 📖 Related Documentation

- [Memory REST API](./memories.md)
- [Authentication](./authentication.md)
- [MCP Integration](./mcp-integration.md)
- [Search API](./search.md)
- [Memory SDK Overview](../memory/sdk.md)

## 🆘 Troubleshooting

### "Unauthorized" Error

Check your API key:

```typescript
// Verify API key is set
console.log(process.env.LANONASIS_API_KEY);

// Test with curl
curl -H "X-API-Key: your_key" https://api.lanonasis.com/api/v1/health
```

### "Rate limit exceeded"

Implement exponential backoff:

```typescript
const retryWithBackoff = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED' && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
};
```

### Connection Issues

Enable debug logging:

```typescript
const memory = new MemoryClient({
  apiUrl: 'https://api.lanonasis.com',
  apiKey: process.env.LANONASIS_API_KEY,
  debug: true  // Enable debug logs
});
```

## 📦 Package Details

- **Package**: `@lanonasis/memory-client`
- **Version**: Latest
- **License**: MIT
- **Repository**: [GitHub](https://github.com/lanonasis/memory-sdk)
- **NPM**: [npmjs.com](https://www.npmjs.com/package/@lanonasis/memory-client)

## 💡 Support

- **Documentation**: [docs.lanonasis.com](https://docs.lanonasis.com)
- **API Reference**: [api.lanonasis.com/docs](https://api.lanonasis.com/docs)
- **GitHub Issues**: [github.com/lanonasis/memory-sdk/issues](https://github.com/lanonasis/memory-sdk/issues)
- **Email**: support@lanonasis.com
- **Discord**: [Join Community](https://discord.gg/lanonasis)
