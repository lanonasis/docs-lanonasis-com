---
title: Memory SDK
sidebar_label: Memory SDK
description: Semantic search and memory indexing SDK for storing and retrieving contextual information
tags:
  - sdk
  - memory
  - search
  - semantic
---

# Memory SDK

The Memory SDK provides semantic search and intelligent memory management capabilities for storing, indexing, and retrieving contextual information in your applications.

## Installation

```bash
npm install @lanonasis/memory-client
# or
yarn add @lanonasis/memory-client
```

## Quick Start

```typescript
import { MemoryClient } from "@lanonasis/memory-client";

// Initialize the client
const memoryClient = new MemoryClient({
  apiUrl: process.env.MAAS_ENDPOINT || "http://localhost:8000",
  apiKey: process.env.MAAS_API_KEY,
});

// Index documents
await memoryClient.upsert([
  {
    id: "doc-1",
    text: "Semantic search allows finding similar documents by meaning",
    metadata: {
      title: "Semantic Search",
      category: "nlp",
      source: "documentation",
    },
  },
]);

// Search for documents
const results = await memoryClient.search("How does semantic search work?", {
  topK: 5,
});

console.log(
  results.hits.map((hit) => ({
    id: hit.id,
    score: hit.score,
    text: hit.payload?.text,
  })),
);
```

## Core Concepts

### Documents

Documents in the Memory SDK consist of:

- **id**: Unique identifier for the document
- **text**: The content to be embedded and searched
- **metadata**: Arbitrary metadata attached to the document

```typescript
interface Document {
  id: string;
  text: string;
  metadata?: Record<string, any>;
}
```

### Search Results

Search results include relevance scores and metadata:

```typescript
interface SearchResult {
  hits: Array<{
    id: string;
    score: number;
    payload?: any;
    metadata?: Record<string, any>;
  }>;
  took?: number;
}
```

## Methods

### upsert(documents, options)

Insert or update documents in the memory store.

```typescript
// Single document
await memoryClient.upsert({
  id: "doc-1",
  text: "Content here",
  metadata: { title: "Title" },
});

// Multiple documents
await memoryClient.upsert([
  { id: "doc-1", text: "Content 1", metadata: { type: "article" } },
  { id: "doc-2", text: "Content 2", metadata: { type: "guide" } },
]);
```

### search(query, options)

Perform semantic search across indexed documents.

```typescript
const results = await memoryClient.search("How to use the API?", {
  topK: 10,
  includeMetadata: true,
  filters: {
    type: "documentation",
  },
});

results.hits.forEach((hit) => {
  console.log(`Score: ${hit.score}, Document: ${hit.id}`);
});
```

**Options:**

- `topK` (number): Maximum number of results to return (default: 10)
- `includeMetadata` (boolean): Include metadata in results
- `filters` (object): Filter results by metadata fields
- `threshold` (number): Minimum similarity score (0-1)

### rerank(query, documents, options)

Re-rank documents using a semantic similarity model.

```typescript
const reranked = await memoryClient.rerank(
  "What is semantic search?",
  [
    { id: "doc-1", text: "Semantic search uses embeddings" },
    { id: "doc-2", text: "Full-text search uses keywords" },
    { id: "doc-3", text: "Hybrid search combines both approaches" },
  ],
  { topK: 2 },
);

console.log(reranked); // Top 2 most relevant documents
```

## Configuration

### Initialization Options

```typescript
const client = new MemoryClient({
  apiUrl: "https://api.example.com", // API endpoint
  apiKey: "sk-xxxxx", // Authentication key
  project: "my-project", // Project/namespace
  timeout: 30000, // Request timeout in ms
  retries: 3, // Number of retries
});
```

### Environment Variables

For easier configuration, set these environment variables:

```bash
MAAS_ENDPOINT=https://api.example.com
MAAS_API_KEY=sk-xxxxx
MAAS_PROJECT=my-project
```

Then initialize without parameters:

```typescript
const client = new MemoryClient();
```

## Examples

### Indexing Documentation

```typescript
import { MemoryClient } from "@lanonasis/memory-client";
import fs from "fs";
import matter from "gray-matter";

const client = new MemoryClient();

async function indexMarkdownDocs(directory: string) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = fs.readFileSync(`${directory}/${file}`, "utf-8");
    const { data, content: text } = matter(content);

    await client.upsert({
      id: file.replace(".md", ""),
      text: text.slice(0, 2000), // Store first 2000 chars
      metadata: {
        title: data.title,
        fileName: file,
        category: data.category,
      },
    });
  }
}
```

### RAG (Retrieval Augmented Generation) Pipeline

```typescript
import { MemoryClient } from "@lanonasis/memory-client";

const memory = new MemoryClient();

async function augmentPrompt(userQuestion: string): Promise<string> {
  // Retrieve relevant context
  const results = await memory.search(userQuestion, { topK: 3 });

  // Build context from results
  const context = results.hits
    .map((hit) => hit.payload?.text || "")
    .join("\n\n");

  // Return augmented prompt
  return `Context:\n${context}\n\nQuestion: ${userQuestion}`;
}
```

### Semantic Similarity Search

```typescript
const products = [
  {
    id: "p1",
    text: "Red wireless Bluetooth headphones with noise cancellation",
  },
  { id: "p2", text: "Blue corded USB headphones" },
  { id: "p3", text: "Black sports smartwatch" },
];

// Index products
await client.upsert(products);

// Search for similar products
const results = await client.search("wireless headphones", { topK: 2 });
// Returns: p1, p2 (headphone related items)
```

## Error Handling

```typescript
try {
  const results = await client.search("query");
} catch (error) {
  if (error.code === "NETWORK_ERROR") {
    console.error("Network connectivity issue");
  } else if (error.code === "AUTH_ERROR") {
    console.error("Invalid API key");
  } else if (error.code === "RATE_LIMIT") {
    console.error("Rate limit exceeded, retry later");
  } else {
    console.error("Unknown error:", error.message);
  }
}
```

## Best Practices

1. **Batch Upserts**: Insert multiple documents at once for better performance

   ```typescript
   // Good
   await client.upsert(documents); // 100+ docs at once

   // Avoid
   for (const doc of documents) {
     await client.upsert(doc); // One at a time
   }
   ```

2. **Metadata Structure**: Use consistent, queryable metadata

   ```typescript
   // Good
   { metadata: { category: 'guides', level: 'beginner', published: true } }

   // Avoid
   { metadata: { info: 'some guide for beginners' } }
   ```

3. **Document Size**: Keep individual documents focused (500-2000 chars)

   ```typescript
   // Good - focused chunk
   text: "How to authenticate: First create an API key in the dashboard...";

   // Avoid - too long
   text: "[entire 10000 word tutorial]";
   ```

4. **Filtering**: Use metadata filters to narrow search scope
   ```typescript
   await client.search(query, {
     topK: 10,
     filters: { type: "api-docs", language: "typescript" },
   });
   ```

## API Reference

For detailed API reference, see [Memory SDK API](/api/memory-client)

## Support

For issues and questions:

- GitHub: [lanonasis/memory-sdk](https://github.com/lanonasis/memory-sdk)
- Discord: [Join our community](https://discord.gg/lanonasis)
- Email: support@lanonasis.com
