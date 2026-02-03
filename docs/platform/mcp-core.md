---
title: MCP Core - Content Preprocessing
sidebar_label: MCP Core
description: Advanced content preprocessing engine for intelligent text cleaning, chunking, and context building
---

**MCP Core** is the content preprocessing engine powering the LanOnasis Memory Platform. It handles intelligent text transformation, chunking, validation, and context building before data is indexed and embedded for semantic search.

## Overview

MCP Core transforms raw content into optimized memory items through a sophisticated pipeline:

```
Raw Content
    ↓
[Text Cleaning] → [Format Parsing] → [Chunking Strategy] → [Metadata Extraction]
    ↓                                                            ↓
[Validation] → [Context Building] → [Token Optimization] → [Ready for Embedding]
```

### Core Responsibilities

1. **Text Cleaning**: Remove noise, normalize formatting, decode entities
2. **Content Recognition**: Detect and handle markdown, code, HTML, JSON, XML
3. **Intelligent Chunking**: Split content using 6 strategies (fixed-size, semantic, paragraph, sentence, code-aware, custom)
4. **Metadata Extraction**: Pull entities, keywords, language, complexity scores
5. **Content Validation**: Security checks, encoding validation, auto-fixing issues
6. **Context Building**: Generate AI-optimized context windows respecting token limits (GPT-4, Claude, etc.)

---

## Architecture

### Service Structure

```
mcp-core/
├── src/
│   ├── modules/
│   │   ├── cleaning/           # Text normalization & noise removal
│   │   ├── chunking/           # Multiple chunking strategies
│   │   ├── parsing/            # Content type detection & parsing
│   │   ├── extraction/         # Entity & keyword extraction
│   │   ├── validation/         # Content validation & security
│   │   └── context-builder/    # AI context window generation
│   ├── types/
│   │   ├── content.types.ts    # Content input/output types
│   │   └── config.types.ts     # Configuration types
│   ├── api/
│   │   ├── preprocessing.ts    # Main preprocessing endpoint
│   │   └── config.ts           # Configuration endpoint
│   └── index.ts                # Service entrypoint
├── tests/
│   ├── unit/                   # Unit tests for each module
│   └── integration/            # End-to-end pipeline tests
└── README.md
```

### Module Responsibilities

| Module              | Purpose                 | Example Input                  | Example Output                             |
| ------------------- | ----------------------- | ------------------------------ | ------------------------------------------ |
| **Cleaning**        | Remove noise, normalize | "Hello\n\nWorld @user"         | "Hello World user"                         |
| **Parsing**         | Detect content type     | Markdown text with code blocks | \{ type: 'markdown', sections: [...] \}    |
| **Chunking**        | Split intelligently     | 5000-word article              | [chunk1, chunk2, chunk3, ...]              |
| **Extraction**      | Pull structured data    | "Contact: user@domain"         | \{ entities: ['email'], keywords: [...] \} |
| **Validation**      | Security & integrity    | User-submitted HTML            | \{ valid: true, fixed: [...] \}            |
| **Context Builder** | Optimize for AI         | Multiple memories + query      | \{ context: [...], tokens: 2048 \}         |

---

## Key Features

### 1. Text Cleaning

Remove formatting noise while preserving content structure:

```bash
# Input
"Hello, World!!!\n\n   Multiple    spaces"

# Output after cleaning
"Hello World Multiple spaces"
```

**Features**:

- Control character removal
- HTML entity decoding (`&nbsp;` → space, `&lt;` → `<`)
- URL extraction (preserves or removes based on config)
- Whitespace normalization
- Custom pattern removal

### 2. Intelligent Chunking Strategies

Choose the right strategy for your content type:

**Fixed-Size Chunking** (Default)

```
Size: 512 tokens, Overlap: 20 tokens
→ Predictable chunks, simple to implement
```

**Semantic Chunking** (Recommended for documents)

```
Splits at natural boundaries:
- Section headers
- Paragraph breaks
- Thematic changes
→ Preserves meaning across chunk boundaries
```

**Paragraph Chunking** (For essays, articles)

```
One chunk per paragraph
→ Maintains narrative flow
```

**Sentence Chunking** (For fine-grained search)

```
One chunk per sentence
→ Enables precise keyword matching
```

**Code-Block Chunking** (For source code)

```
Language-aware splitting:
- Keep functions/classes intact
- Preserve import statements
- Maintain scoping
→ Enables code search by function/class
```

### 3. Content Type Support

Automatically detect and handle multiple formats:

| Format         | Handling                                | Example                       |
| -------------- | --------------------------------------- | ----------------------------- |
| **Markdown**   | Preserve heading structure, code blocks | `# Title\n\n## Section`       |
| **Code**       | Language detection, function extraction | Python, JavaScript, SQL, etc. |
| **HTML**       | Tag stripping, structure preservation   | Convert to semantic markdown  |
| **JSON**       | Flatten structure, extract values       | `{"user": {"name": "Alice"}}` |
| **Plain Text** | Line/paragraph detection                | Standard text files           |

### 4. Metadata Extraction

Automatically pull structured information:

```json
{
  "entities": {
    "emails": ["alice@example.com"],
    "urls": ["https://example.com"],
    "dates": ["2026-01-15"],
    "mentions": ["@alice", "@bob"]
  },
  "keywords": ["machine learning", "AI", "data science"],
  "language": "en",
  "complexity": 7.2,
  "sentiment": 0.6,
  "statistics": {
    "word_count": 1245,
    "sentence_count": 42,
    "avg_word_length": 5.3
  }
}
```

### 5. Context Building for AI

Generate optimized context windows for AI models:

```javascript
// Input: multiple memories + user query
const context = await mcpCore.buildContext({
  query: "What are our Q2 goals?",
  memories: [...],  // 20+ memories to search
  modelLimit: 4096,  // Claude's token limit
  strategy: 'relevance'  // Use relevance scoring
});

// Output: optimized, ranked memories
{
  context: [
    { rank: 1, memory: "Q2 Goals: AI features...", score: 0.95 },
    { rank: 2, memory: "Team roadmap...", score: 0.82 },
    ...
  ],
  tokenCount: 2048,
  coverage: 0.92
}
```

**Context Building Strategies**:

1. **Relevance** – Multi-factor relevance scoring
2. **Temporal** – Recent content prioritized
3. **Conversational** – Build from conversation history
4. **Diverse** – Cover different topics
5. **Hierarchical** – Parent-child relationships
6. **Hybrid** – Combination of multiple factors

---

## Installation & Setup

### Prerequisites

- Node.js 18+ or Bun 1.1+
- PostgreSQL 13+ (for distributed caching, optional)

### Installation

```bash
# Install from npm
npm install @lanonasis/mcp-core

# Or using Bun
bun add @lanonasis/mcp-core
```

### Local Development

```bash
# Clone repository
git clone https://github.com/lanonasis/mcp-core.git
cd mcp-core

# Install dependencies
bun install

# Build
bun run build

# Run tests
bun run test

# Start dev server
bun run dev
```

---

## Configuration

### Environment Variables

```bash
# Preprocessing config
MCP_CORE_CHUNK_SIZE=512              # Default chunk size in tokens
MCP_CORE_CHUNK_OVERLAP=50            # Token overlap between chunks
MCP_CORE_CHUNKING_STRATEGY=semantic  # Strategy: fixed, semantic, paragraph, sentence, code

# Content validation
MCP_CORE_MAX_CONTENT_SIZE=10000000   # Max input size (10 MB)
MCP_CORE_ENABLE_SECURITY_CHECK=true  # Enable XSS/injection checks
MCP_CORE_AUTO_FIX_ENCODING=true      # Auto-fix encoding issues

# Logging
MCP_CORE_LOG_LEVEL=info              # debug, info, warn, error
MCP_CORE_ENABLE_METRICS=true         # Prometheus metrics

# Caching (optional)
MCP_CORE_CACHE_ENABLED=false
MCP_CORE_CACHE_TTL=3600
```

### Configuration File (`mcp-core.config.ts`)

```typescript
import { MCPCoreConfig } from "@lanonasis/mcp-core";

export const config: MCPCoreConfig = {
  chunking: {
    strategy: "semantic",
    size: 512,
    overlap: 50,
    preserveMarkdownHeadings: true,
    preserveCodeBlocks: true,
  },
  cleaning: {
    removeUrls: false,
    decodeHtmlEntities: true,
    normalizeWhitespace: true,
    removeCustomPatterns: [/\[REDACTED\]/g],
  },
  validation: {
    enableSecurityChecks: true,
    maxContentSize: 10_000_000,
    allowedContentTypes: ["text/plain", "text/markdown", "application/json"],
  },
  contextBuilder: {
    strategies: ["relevance", "temporal"],
    modelTokenLimit: 4096,
    deduplicationThreshold: 0.85,
  },
};
```

---

## API Reference

### Preprocess Content

Transform raw content into optimized chunks:

```typescript
import { MCPCore } from "@lanonasis/mcp-core";

const mcp = new MCPCore(config);

const result = await mcp.preprocess({
  content: "Your content here...",
  contentType: "markdown", // auto-detected if omitted
  chunkingStrategy: "semantic",
  extractMetadata: true,
  validateContent: true,
});

console.log(result);
// {
//   chunks: [
//     { id: "chunk_1", content: "...", tokens: 512 },
//     { id: "chunk_2", content: "...", tokens: 498 }
//   ],
//   metadata: { keywords: [...], entities: [...] },
//   statistics: { totalTokens: 1010, validationPassed: true }
// }
```

### Build AI Context

Generate optimized context window:

```typescript
const context = await mcp.buildContext({
  query: "What are our goals?",
  memories: [
    { id: "m1", content: "Q2 goals: AI features..." },
    { id: "m2", content: "Team roadmap..." },
  ],
  strategy: "relevance",
  modelTokenLimit: 4096,
  minRelevanceScore: 0.5,
});

console.log(context);
// {
//   context: [
//     { rank: 1, memoryId: 'm1', score: 0.95, content: '...' },
//     { rank: 2, memoryId: 'm2', score: 0.82, content: '...' }
//   ],
//   totalTokens: 2048,
//   coverage: 0.92
// }
```

### Validate Content

Check content for security and integrity issues:

```typescript
const validation = await mcp.validate({
  content: userInput,
  contentType: "html",
  autoFix: true,
  securityLevel: "strict", // strict, moderate, permissive
});

console.log(validation);
// {
//   valid: true,
//   issues: [
//     { type: 'xss', pattern: 'onclick=', severity: 'high', fixed: true }
//   ],
//   fixedContent: '...'
// }
```

---

## Common Workflows

### Scenario 1: Process Uploaded Document

```typescript
const file = await req.file;
const content = await file.text();

const processed = await mcp.preprocess({
  content,
  contentType: "markdown",
  chunkingStrategy: "semantic", // Smart boundaries for documents
});

// Store chunks in memory service
for (const chunk of processed.chunks) {
  await memory.create({
    text: chunk.content,
    namespace: "documents",
    metadata: { source: file.name, chunkId: chunk.id },
  });
}
```

### Scenario 2: Optimize for AI Response

```typescript
// User asks a question
const query = "What are our Q2 priorities?";

// Fetch relevant memories
const relevant = await memory.search({
  query,
  namespace: "planning",
  limit: 20,
});

// Build optimized context for Claude
const context = await mcp.buildContext({
  query,
  memories: relevant.items,
  strategy: "relevance",
  modelTokenLimit: 4096, // Claude limit
});

// Feed to model
const response = await claude.messages.create({
  model: "claude-3-5-sonnet",
  system: `You have access to organizational context:\n\n${context.context.map((c) => c.content).join("\n\n")}`,
  messages: [{ role: "user", content: query }],
});
```

### Scenario 3: Security-First Content Validation

```typescript
// Validate user-submitted content
const validation = await mcp.validate({
  content: userSubmittedHTML,
  contentType: "html",
  autoFix: true,
  securityLevel: "strict",
});

if (!validation.valid) {
  return {
    error: "Content contains security issues",
    issues: validation.issues,
  };
}

// Use fixed content
const processed = await mcp.preprocess({
  content: validation.fixedContent,
  contentType: "markdown",
});
```

---

## Performance & Optimization

### Latency (Typical Values)

| Operation           | Latency (p50) | Latency (p99) | Notes                               |
| ------------------- | ------------- | ------------- | ----------------------------------- |
| Text Cleaning       | 10ms          | 50ms          | For 10KB text                       |
| Chunking            | 20ms          | 100ms         | Semantic strategy slower than fixed |
| Metadata Extraction | 15ms          | 75ms          | Depends on content complexity       |
| Context Building    | 50ms          | 200ms         | Scales with # of memories           |
| Full Pipeline       | 100ms         | 300ms         | All steps combined                  |

### Throughput

- **Text Cleaning**: 5 MB/second per instance
- **Chunking**: 2 MB/second (semantic), 10 MB/second (fixed-size)
- **Validation**: 3 MB/second per instance

### Optimization Tips

1. **Reuse instances**: Don't create new `MCPCore` for each request
2. **Batch processing**: Process multiple items together
3. **Cache metadata**: Store extracted metadata, don't re-extract
4. **Choose appropriate strategy**: Use `fixed` for speed, `semantic` for quality
5. **Adjust token limits**: Larger chunks = fewer API calls, smaller chunks = finer granularity

---

## Troubleshooting

### Issue: Chunks are too small/large

**Solution**: Adjust chunking strategy and size

```typescript
// Increase size for faster processing
const config = {
  chunking: {
    size: 1024, // Double the size
    overlap: 100,
  },
};
```

### Issue: Encoding errors in non-English content

**Solution**: Enable auto-fix encoding

```bash
MCP_CORE_AUTO_FIX_ENCODING=true
```

### Issue: Context is incomplete (missing relevant memories)

**Solution**: Lower relevance threshold

```typescript
const context = await mcp.buildContext({
  minRelevanceScore: 0.3, // Lower threshold
  strategy: "relevance",
});
```

### Issue: Performance degradation with large files

**Solution**: Use streaming API

```typescript
const stream = await mcp.preprocessStream({
  content: largeContent,
  chunkSize: 512,
});

for await (const chunk of stream) {
  await memory.create({ text: chunk.content });
}
```

---

## Related Services

- **[Memory Overview](../memory/overview.md)** – Where MCP Core output is stored
- **[Memory CLI](../memory/cli.md)** – How to manage preprocessed content
- **[MCP Integration](../mcp/)** – AI agent integration patterns
- **[Data Masking](./onasis-core.md)** – Privacy-preserving content handling

---

## Support & Resources

- **GitHub**: [lanonasis/mcp-core](https://github.com/lanonasis/mcp-core)
- **Issues**: [Report bugs](https://github.com/lanonasis/mcp-core/issues)
- **Discussions**: [Q&A and feature requests](https://github.com/lanonasis/mcp-core/discussions)
- **Email**: [support@lanonasis.com](mailto:support@lanonasis.com)

---

**Last Updated**: February 3, 2026  
**Version**: 1.2.0+
