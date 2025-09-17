# MaaS-Powered Documentation Implementation Guide

## 🎯 What We've Built

Your documentation now uses **your own MaaS platform** for semantic search, demonstrating the power of your Memory-as-a-Service while being 100% self-hosted.

## ✅ Implementation Summary

### 1. MaaS Search Integration
- **Location**: `src/components/search/MaaSSearchProvider.tsx`
- **Feature**: Semantic search using your own vector database
- **Benefit**: Live demonstration of MaaS capabilities

### 2. Hybrid Search System
- **Location**: `src/components/search/HybridSearch.tsx`
- **Feature**: Combines MaaS semantic + MeiliSearch keyword search
- **Benefit**: Best of both worlds - meaning and exact matches

### 3. Documentation Indexing Pipeline
- **Location**: `scripts/index-docs-to-maas.ts`
- **Feature**: Automatically chunks and indexes docs to MaaS
- **Benefit**: All documentation searchable via vector similarity

### 4. Complete API Documentation
- **Location**: `docs/api/endpoints/`
- **Coverage**: Memory API, Search API, Streaming, Embeddings
- **Format**: OpenAPI-compatible with examples

### 5. SDK Documentation
- **Location**: `docs/sdks/`
- **Coverage**: TypeScript, Python, CLI
- **Features**: Quick start, API reference, code examples

## 🚀 Quick Start

### Step 1: Configure Environment

Create `.env.local`:
```env
# MaaS Configuration (your own platform!)
NEXT_PUBLIC_MAAS_ENDPOINT=http://api.LanOnasis.local
NEXT_PUBLIC_MAAS_DOCS_KEY=your_docs_api_key
MAAS_ADMIN_KEY=your_admin_key

# Fallback search (self-hosted)
NEXT_PUBLIC_MEILISEARCH_HOST=http://localhost:7700
NEXT_PUBLIC_MEILISEARCH_KEY=your_meili_key
```

### Step 2: Install Dependencies

```bash
# Install all packages including MaaS SDK
bun install

# Install additional search dependencies
bun add @LanOnasis/memory-sdk meilisearch gray-matter remark strip-markdown
```

### Step 3: Index Documentation to MaaS

```bash
# Index all documentation
npm run index:maas

# Or index a single file
npm run index:single -- docs/intro.md
```

### Step 4: Start Development Server

```bash
# Start with MaaS search enabled
bun run start

# Documentation available at http://localhost:3000
# Search powered by YOUR MaaS platform!
```

## 📦 Docker Deployment

### Complete Stack with MaaS

```yaml
# docker-compose.yml already configured with:
services:
  docs:           # Your documentation site
  meilisearch:    # Fallback keyword search
  plausible:      # Self-hosted analytics
  gitea:          # Self-hosted Git
  
  # Add your MaaS service if not already running
  maas:
    image: LanOnasis/memory-service:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://...
      - VECTOR_DB_URL=...
```

### Deploy Everything

```bash
# Build and deploy
./deploy.sh

# Monitor health
./monitor.sh
```

## 🔍 How MaaS Search Works

### 1. Document Processing
```typescript
// Documents are chunked for optimal search
const chunks = chunkContent(plainText, 500);

// Each chunk becomes a vector
await memoryClient.upsert({
  text: chunk,
  metadata: { title, section, url },
  namespace: 'documentation'
});
```

### 2. Semantic Search
```typescript
// User query → Vector → Similarity search
const results = await memoryClient.search({
  query: "How do I integrate MCP?",
  namespace: 'documentation',
  topK: 10
});
```

### 3. Hybrid Mode
```typescript
// Combines semantic (MaaS) + keyword (MeiliSearch)
const hybrid = await searchDocumentation(query, {
  semanticWeight: 0.7,  // 70% MaaS
  keywordWeight: 0.3    // 30% keyword
});
```

## 📊 Analytics & Monitoring

### Search Analytics
```typescript
// Every search is tracked in MaaS
await memoryClient.track({
  event: 'documentation_search',
  properties: {
    query,
    resultsCount,
    searchMode: 'hybrid'
  }
});
```

### View Analytics Dashboard
```bash
# MaaS analytics
curl http://api.LanOnasis.local/analytics/searches

# Plausible analytics  
open http://localhost:8000
```

## 🎨 Customization

### Adjust Search Weights
```typescript
// In HybridSearch.tsx
const semanticWeight = 0.8;  // More semantic
const keywordWeight = 0.2;   // Less keyword
```

### Change Chunk Size
```typescript
// In index-docs-to-maas.ts
const CHUNK_SIZE = 300;  // Smaller chunks for precision
```

### Add Custom Metadata
```typescript
// Enhance search with metadata
await memoryClient.upsert({
  text: content,
  metadata: {
    importance: 'high',
    author: 'system',
    version: '1.2.0',
    tags: ['api', 'critical']
  }
});
```

## 🧪 Testing

### Test MaaS Search
```bash
# Direct MaaS query
curl -X POST http://api.LanOnasis.local/api/v1/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "vector search",
    "namespace": "documentation",
    "topK": 5
  }'
```

### Test Hybrid Search
```typescript
// In browser console
const response = await fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'MCP integration',
    mode: 'hybrid'
  })
});
const results = await response.json();
console.log(results);
```

## 🚨 Troubleshooting

### MaaS Connection Issues
```bash
# Check MaaS health
curl http://api.LanOnasis.local/health

# Verify API key
curl -H "Authorization: Bearer YOUR_KEY" \
  http://api.LanOnasis.local/api/v1/memories
```

### Indexing Problems
```bash
# Re-index with verbose logging
DEBUG=* npm run index:maas

# Check indexed documents
curl http://api.LanOnasis.local/api/v1/memories?namespace=documentation
```

### Search Not Working
```javascript
// Enable debug mode in MaaSSearchProvider.tsx
const memoryClient = new MemoryClient({
  endpoint: process.env.NEXT_PUBLIC_MAAS_ENDPOINT,
  apiKey: process.env.NEXT_PUBLIC_MAAS_DOCS_KEY,
  debug: true  // Add this
});
```

## 📈 Performance Optimization

### 1. Cache Embeddings
```typescript
const cachedClient = new MemoryClient({
  cache: {
    enabled: true,
    ttl: 3600,
    maxSize: 1000
  }
});
```

### 2. Batch Processing
```typescript
// Index multiple documents at once
await memoryClient.batchUpsert(chunks);
```

### 3. Pre-warm Search
```typescript
// On page load, pre-fetch common searches
const preWarm = ['getting started', 'api', 'sdk'];
preWarm.forEach(q => performSemanticSearch(q));
```

## 🎯 Key Advantages

### Why This Approach Wins

1. **Live Product Demo**: Your docs demonstrate MaaS capabilities
2. **Zero External Costs**: No Algolia, Vercel, or cloud fees
3. **Complete Privacy**: All data stays in your infrastructure
4. **Better Context**: Your embeddings understand your domain
5. **Unified Platform**: Documentation search feeds back into MaaS

### Metrics to Track

```typescript
// Success metrics in MaaS
const metrics = await memoryClient.getMetrics({
  namespace: 'documentation',
  metrics: [
    'search_count',
    'avg_relevance_score',
    'unique_queries',
    'click_through_rate'
  ]
});
```

## 🔄 Continuous Improvement

### Weekly Tasks
1. Review search analytics for gaps
2. Add new documentation as memories
3. Refine chunk sizes based on performance
4. Update embeddings for better relevance

### Monthly Tasks
1. Regenerate all embeddings with latest model
2. Analyze search patterns for content gaps
3. A/B test semantic vs hybrid weights
4. Review and merge duplicate memories

## 📝 Next Steps

1. **Deploy to Production**
   ```bash
   ./deploy.sh
   ```

2. **Monitor Search Quality**
   - Track relevance scores
   - Collect user feedback
   - Iterate on content

3. **Expand MaaS Features**
   - Add RAG for Q&A
   - Implement chat interface
   - Create API playground

4. **Share Success**
   - Blog about MaaS-powered docs
   - Open source components
   - Build community

---

## 🎉 Congratulations!

Your documentation is now:
- ✅ 100% self-hosted
- ✅ Powered by your own MaaS platform
- ✅ Demonstrating vector search capabilities
- ✅ Privacy-first with no external dependencies
- ✅ A live demo of your product

**Your documentation has become a powerful showcase of LanOnasis MaaS capabilities!**
