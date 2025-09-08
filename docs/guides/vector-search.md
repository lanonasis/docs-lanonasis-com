---
title: Vector Search Guide
sidebar_label: Vector Search
---

# Understanding Vector Search in Lanonasis

## What is Vector Search?

Vector search enables semantic understanding of your queries, finding relevant memories based on meaning rather than exact keyword matches.

## How It Works

```mermaid
graph LR
    A[Your Text] --> B[Embedding Model]
    B --> C[Vector<br/>1536 dimensions]
    C --> D[Vector Database]
    D --> E[Similarity Search]
    E --> F[Relevant Memories]
```

## Implementation Example

### Step 1: Store Memories with Semantic Context

```typescript
// These will be semantically related despite different wording
await client.upsert({ 
  text: "The quarterly revenue exceeded projections by 15%" 
})

await client.upsert({ 
  text: "Q4 financial performance surpassed expectations" 
})

await client.upsert({ 
  text: "Sales figures came in higher than anticipated" 
})
```

### Step 2: Search Semantically

```typescript
// This query will find all three memories above
const results = await client.search({
  query: "How did we do financially?",
  topK: 10
})

// Results ranked by semantic similarity
results.forEach(result => {
  console.log(`Score: ${result.score} - ${result.memory.text}`)
})
```

## Advanced Vector Search Techniques

### 1. Hybrid Search (Semantic + Keyword)

```typescript
const hybridResults = await client.hybridSearch({
  query: "Q4 revenue projections",
  semanticWeight: 0.7,  // 70% semantic
  keywordWeight: 0.3,   // 30% keyword matching
  topK: 10
})
```

### 2. Filtered Vector Search

```typescript
const filteredResults = await client.search({
  query: "financial performance",
  filters: {
    type: "financial_report",
    year: 2024,
    department: { $in: ["sales", "marketing"] }
  },
  topK: 5
})
```

### 3. Multi-Vector Search

```typescript
// Search using multiple query vectors
const multiResults = await client.multiVectorSearch({
  queries: [
    "revenue growth",
    "customer acquisition",
    "market expansion"
  ],
  aggregation: "mean", // or "max", "min"
  topK: 10
})
```

## Optimizing Search Quality

### 1. Metadata Enhancement

```typescript
// Rich metadata improves filtering and ranking
await client.upsert({
  text: "Q4 revenue was $2.5M, up 15% YoY",
  metadata: {
    type: "financial",
    quarter: "Q4",
    year: 2024,
    metrics: {
      revenue: 2500000,
      growth_rate: 0.15
    },
    tags: ["revenue", "growth", "financial"],
    department: "finance",
    confidence: 0.95
  }
})
```

### 2. Query Expansion

```typescript
// Automatically expand queries for better recall
const expandedResults = await client.search({
  query: "revenue",
  queryExpansion: {
    enabled: true,
    synonyms: ["income", "earnings", "sales"],
    related_terms: ["profit", "growth", "performance"]
  }
})
```

### 3. Re-ranking

```typescript
// Re-rank results using additional signals
const rerankedResults = await client.searchWithReranking({
  query: "important decisions",
  topK: 20,  // Get more candidates
  rerank: {
    enabled: true,
    model: "cross-encoder",
    topK: 5,  // Return top 5 after reranking
    factors: {
      recency: 0.2,
      user_relevance: 0.3,
      semantic_similarity: 0.5
    }
  }
})
```

## Performance Considerations

### Embedding Cache

```typescript
// Cache frequently used embeddings
const cachedClient = new MemoryClient({
  apiKey: process.env.LANONASIS_API_KEY,
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour
    maxSize: 1000 // Cache up to 1000 embeddings
  }
})
```

### Batch Processing

```typescript
// Process multiple searches efficiently
const batchResults = await client.batchSearch([
  { query: "Q4 planning", topK: 5 },
  { query: "budget decisions", topK: 5 },
  { query: "team updates", topK: 5 }
])
```

## Troubleshooting Common Issues

### Low Relevance Scores

**Problem**: Search results have consistently low scores (< 0.5)

**Solutions**:
1. Ensure sufficient text content (minimum 20 words)
2. Add more context to stored memories
3. Use more specific search queries
4. Consider adjusting similarity threshold

```typescript
// Diagnostic query to check embedding quality
const diagnostic = await client.diagnoseSearch({
  query: "your search query",
  includeEmbedding: true,
  explainScores: true
})

console.log(diagnostic.explanation)
```

### Missing Expected Results

**Problem**: Known memories aren't appearing in search

**Solutions**:
```typescript
// 1. Verify memory exists
const memory = await client.get("memory-id")

// 2. Check if embedding was generated
if (!memory.embedding) {
  await client.refreshEmbedding("memory-id")
}

// 3. Use lower similarity threshold
const results = await client.search({
  query: "your query",
  threshold: 0.3, // Lower threshold
  topK: 20 // Get more results
})
```

## Best Practices

1. **Chunk Long Documents**: Split documents > 1000 words for better search precision
2. **Use Descriptive Text**: Include context and details in stored memories
3. **Leverage Metadata**: Use structured metadata for filtering and organization
4. **Monitor Performance**: Track search latency and relevance metrics
5. **Regular Reindexing**: Refresh embeddings when updating the embedding model

## Example: Building a Knowledge Base

```typescript
class KnowledgeBase {
  private client: MemoryClient
  
  async addDocument(doc: Document) {
    // Chunk document into sections
    const chunks = this.chunkDocument(doc)
    
    // Store each chunk with metadata
    const memories = await this.client.batchUpsert(
      chunks.map((chunk, index) => ({
        text: chunk.text,
        metadata: {
          documentId: doc.id,
          documentTitle: doc.title,
          section: chunk.section,
          chunkIndex: index,
          totalChunks: chunks.length,
          author: doc.author,
          createdAt: doc.createdAt,
          tags: doc.tags
        }
      }))
    )
    
    return memories
  }
  
  async searchKnowledge(query: string, options?: SearchOptions) {
    // Search with smart defaults
    const results = await this.client.search({
      query,
      topK: options?.topK || 10,
      filters: options?.filters,
      includeMetadata: true
    })
    
    // Group results by document
    const grouped = this.groupByDocument(results)
    
    // Return formatted response
    return grouped.map(doc => ({
      documentId: doc.id,
      title: doc.title,
      relevantSections: doc.chunks,
      overallScore: doc.maxScore
    }))
  }
}
```
