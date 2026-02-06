---
title: AI SDK
sidebar_label: AI SDK
description: AI capabilities SDK for building intelligent applications with language models, embeddings, and reasoning
tags:
  - sdk
  - ai
  - language-models
  - embeddings
---

# AI SDK

The AI SDK provides a unified interface to build intelligent applications leveraging language models, embeddings, and advanced reasoning capabilities.

## Installation

```bash
npm install @lanonasis/ai-sdk
# or
yarn add @lanonasis/ai-sdk
```

## Quick Start

```typescript
import { AIClient } from "@lanonasis/ai-sdk";

// Initialize the client
const ai = new AIClient({
  apiKey: process.env.LANONASIS_API_KEY,
  model: "gpt-4-turbo",
});

// Generate text
const response = await ai.generateText({
  prompt: "Explain semantic search in 3 sentences",
  maxTokens: 150,
  temperature: 0.7,
});

console.log(response.text);

// Create embeddings
const embedding = await ai.embed("What is artificial intelligence?");
console.log(embedding.vector.length); // 1536 dimensions (typically)
```

## Core Capabilities

### Text Generation

Generate text completions using language models.

```typescript
const result = await ai.generateText({
  prompt: "Write a haiku about programming",
  maxTokens: 100,
  temperature: 0.8,
  topP: 0.9,
  frequencyPenalty: 0.5,
});

console.log(result.text);
console.log(result.tokensUsed);
console.log(result.stopReason);
```

### Chat Completions

Build conversational applications.

```typescript
const messages = [
  { role: "system", content: "You are a helpful assistant" },
  { role: "user", content: "What is semantic search?" },
];

const response = await ai.chat({
  messages,
  model: "gpt-4-turbo",
  temperature: 0.7,
});

console.log(response.message.content);
```

### Embeddings

Convert text to dense vector representations.

```typescript
// Single text
const embedding = await ai.embed("Hello world");

// Multiple texts
const embeddings = await ai.embedMany([
  "Semantic search",
  "Vector databases",
  "Language models",
]);

console.log(embeddings[0].vector);
```

### Reasoning & Analysis

Advanced reasoning for complex tasks.

```typescript
const analysis = await ai.reason({
  task: "Analyze the sentiment and extract key topics",
  input: "This product is amazing! Best purchase I made this year.",
  format: "json",
});

console.log(JSON.parse(analysis.result));
// { sentiment: 'positive', topics: ['product quality', 'satisfaction'] }
```

## Configuration

### Initialize with Options

```typescript
const ai = new AIClient({
  apiKey: "sk-xxxxx", // API key
  model: "gpt-4-turbo", // Default model
  baseURL: "https://api.lanonasis.com", // API endpoint
  timeout: 30000, // Request timeout (ms)
  retries: 3, // Auto-retry count
  embeddingModel: "text-embedding-3-large", // For embeddings
});
```

### Environment Variables

```bash
LANONASIS_API_KEY=sk-xxxxx
LANONASIS_MODEL=gpt-4-turbo
LANONASIS_BASE_URL=https://api.lanonasis.com
```

## Methods

### generateText(options)

Generate text completions.

```typescript
const result = await ai.generateText({
  prompt: "Your prompt here",
  model: "gpt-4-turbo", // Optional, uses default
  maxTokens: 500,
  temperature: 0.7, // 0 = deterministic, 1 = creative
  topP: 0.9, // Nucleus sampling
  frequencyPenalty: 0, // Reduce repetition
  presencePenalty: 0, // Encourage new topics
});
```

### chat(options)

Chat/conversation interface.

```typescript
const response = await ai.chat({
  messages: [
    { role: "system", content: "You are..." },
    { role: "user", content: "Question?" },
    { role: "assistant", content: "Answer..." },
  ],
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.9,
});
```

### embed(text) / embedMany(texts)

Create embeddings for semantic similarity.

```typescript
// Single text
const emb = await ai.embed("Some text");
console.log(emb.vector); // Float32Array or number[]

// Batch
const batch = await ai.embedMany(["Text 1", "Text 2"]);
```

### reason(options)

Advanced reasoning and analysis.

```typescript
const result = await ai.reason({
  task: "Summarize the main points",
  input: "Long text here...",
  context: { format: "bullet-points" },
  format: "json",
});
```

## Examples

### Building a Q&A Bot

```typescript
import { AIClient } from "@lanonasis/ai-sdk";
import { MemoryClient } from "@lanonasis/memory-client";

const ai = new AIClient();
const memory = new MemoryClient();

async function answerQuestion(question: string): Promise<string> {
  // Retrieve relevant context
  const context = await memory.search(question, { topK: 3 });

  const contextText = context.hits.map((hit) => hit.payload?.text).join("\n\n");

  // Generate answer with context
  const response = await ai.chat({
    messages: [
      {
        role: "system",
        content:
          "Answer questions based on the provided context. If unsure, say so.",
      },
      {
        role: "user",
        content: `Context:\n${contextText}\n\nQuestion: ${question}`,
      },
    ],
  });

  return response.message.content;
}
```

### Semantic Search with Ranking

```typescript
async function searchWithAI(query: string) {
  // Get embeddings
  const queryEmbedding = await ai.embed(query);

  // Search memory/vector database
  const results = await memory.search(query, { topK: 10 });

  // Use AI to re-rank results
  const ranked = await ai.reason({
    task: "Rank these search results by relevance to the query",
    input: JSON.stringify({
      query,
      results: results.hits.map((h) => ({
        id: h.id,
        text: h.payload?.text,
      })),
    }),
    format: "json",
  });

  return JSON.parse(ranked.result);
}
```

### Content Classification

```typescript
async function classifyContent(text: string) {
  const result = await ai.reason({
    task: "Classify this content",
    input: text,
    context: {
      categories: ["Technical", "Business", "Creative", "Other"],
      confidence: true,
    },
    format: "json",
  });

  return JSON.parse(result.result);
  // { category: 'Technical', confidence: 0.95 }
}
```

### Stream Responses

For long-form generation, stream responses:

```typescript
const stream = ai.generateText({
  prompt: "Write a long article about...",
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

## Error Handling

```typescript
try {
  const response = await ai.generateText({ prompt: "test" });
} catch (error) {
  if (error.code === "RATE_LIMIT") {
    console.error("Too many requests, please retry");
  } else if (error.code === "INVALID_API_KEY") {
    console.error("Authentication failed");
  } else if (error.code === "MODEL_OVERLOADED") {
    console.error("Model is busy, retry in a moment");
  } else {
    console.error("Error:", error.message);
  }
}
```

## Best Practices

1. **Use Appropriate Models**: Choose models based on your needs

   ```typescript
   // Fast, cost-effective
   ai.generateText({ model: "gpt-3.5-turbo" });

   // More capable, slower
   ai.generateText({ model: "gpt-4-turbo" });
   ```

2. **Control Temperature**: Balance creativity vs consistency

   ```typescript
   // Deterministic (facts, code)
   {
     temperature: 0.2;
   }

   // Creative (stories, brainstorm)
   {
     temperature: 0.9;
   }
   ```

3. **Use System Prompts**: Guide the AI behavior

   ```typescript
   messages: [
     { role: "system", content: "You are a JavaScript expert..." },
     { role: "user", content: "How do I..." },
   ];
   ```

4. **Handle Streaming**: For better UX with long responses

   ```typescript
   const stream = ai.generateText({ prompt, stream: true });
   for await (const chunk of stream) {
     updateUI(chunk.text);
   }
   ```

5. **Token Management**: Monitor token usage for costs
   ```typescript
   const result = await ai.generateText({ prompt });
   console.log(`Tokens used: ${result.tokensUsed}`);
   ```

## Models Available

| Model                  | Speed     | Quality   | Cost     | Best For          |
| ---------------------- | --------- | --------- | -------- | ----------------- |
| gpt-3.5-turbo          | Very Fast | Good      | Low      | General tasks     |
| gpt-4-turbo            | Fast      | Excellent | Medium   | Complex reasoning |
| gpt-4                  | Slower    | Best      | High     | Advanced tasks    |
| text-embedding-3-small | Very Fast | Good      | Very Low | Embeddings        |
| text-embedding-3-large | Fast      | Excellent | Low      | Embeddings        |

## API Reference

For detailed API reference, see [AI SDK API](/api/ai-sdk)

## Support

For issues and questions:

- GitHub: [lanonasis/ai-sdk](https://github.com/lanonasis/ai-sdk)
- Discord: [Join our community](https://discord.gg/lanonasis)
- Email: support@lanonasis.com
