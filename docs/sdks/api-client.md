---
title: API Client SDK
sidebar_label: API Client
description: Universal REST/GraphQL API client SDK with automatic retry, caching, and middleware support
tags:
  - sdk
  - api
  - rest
  - graphql
  - http-client
---

# API Client SDK

The API Client SDK provides a universal, production-ready HTTP client for REST and GraphQL APIs with built-in features like retries, caching, middleware, and error handling.

## Installation

```bash
npm install @lanonasis/api-client
# or
yarn add @lanonasis/api-client
```

## Quick Start

```typescript
import { APIClient } from "@lanonasis/api-client";

// Create a client
const client = new APIClient({
  baseURL: "https://api.lanonasis.com/v1",
  apiKey: process.env.API_KEY,
  timeout: 30000,
});

// Make requests
const response = await client.get("/users");
console.log(response.data);

// POST request
const user = await client.post("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// GraphQL
const result = await client.graphql(`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`);
```

## HTTP Methods

### GET

```typescript
const users = await client.get("/users");

// With query parameters
const filtered = await client.get("/users", {
  params: {
    page: 1,
    limit: 10,
    sort: "created_at",
    filter: "active",
  },
});

// With options
const response = await client.get("/users/123", {
  headers: { "X-Custom-Header": "value" },
  timeout: 5000,
  cache: true, // Use cached response if available
});
```

### POST

```typescript
const created = await client.post("/users", {
  name: "Jane Doe",
  email: "jane@example.com",
});

// With options
const response = await client.post("/data", payload, {
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  retry: 3,
});
```

### PUT / PATCH

```typescript
// Update entire resource
const updated = await client.put("/users/123", {
  name: "Updated Name",
});

// Partial update
const patched = await client.patch("/users/123", {
  email: "newemail@example.com",
});
```

### DELETE

```typescript
const deleted = await client.delete("/users/123");

// With options
const response = await client.delete("/users/123", {
  headers: { Authorization: "Bearer token" },
});
```

## GraphQL Support

```typescript
// Query
const result = await client.graphql(
  `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      posts {
        id
        title
      }
    }
  }
`,
  {
    variables: { id: "123" },
  },
);

// Mutation
const mutated = await client.graphql(
  `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`,
  {
    variables: {
      input: { name: "John", email: "john@example.com" },
    },
  },
);
```

## Configuration

### Initialize Options

```typescript
const client = new APIClient({
  baseURL: "https://api.example.com",
  apiKey: "sk-xxxxx", // Optional, for auth
  timeout: 30000,
  retries: 3, // Automatic retries
  retryDelay: 1000, // ms between retries

  // Cache settings
  cache: true, // Enable caching
  cacheTime: 5 * 60 * 1000, // 5 min default

  // Request/Response
  headers: { "User-Agent": "MyApp/1.0" },

  // GraphQL
  graphqlEndpoint: "/graphql",

  // Middleware
  middleware: [authMiddleware, loggingMiddleware],

  // Error handling
  circuitBreaker: true,
  circuitBreakerThreshold: 5,
});
```

### Environment Variables

```bash
API_BASE_URL=https://api.lanonasis.com/v1
API_KEY=sk-xxxxx
API_TIMEOUT=30000
API_RETRIES=3
```

## Advanced Features

### Request/Response Interceptors

```typescript
// Add request interceptor
client.interceptors.request.use((config) => {
  config.headers["X-Request-ID"] = generateRequestId();
  return config;
});

// Add response interceptor
client.interceptors.response.use(
  (response) => {
    console.log(`✓ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`✗ ${error.status} ${error.config.url}`);
    return Promise.reject(error);
  },
);
```

### Middleware

```typescript
// Logging middleware
const loggingMiddleware = (config) => {
  console.log(`${config.method.toUpperCase()} ${config.url}`);
  return config;
};

// Auth middleware
const authMiddleware = (config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const client = new APIClient({
  middleware: [loggingMiddleware, authMiddleware],
});
```

### Automatic Retries

```typescript
const client = new APIClient({
  retries: 3,
  retryDelay: 1000,
  retryStrategy: (error, attempt) => {
    // Retry on network errors and 5xx
    if (error.code === "ECONNRESET") return true;
    if (error.status >= 500) return true;
    // Don't retry 4xx errors
    if (error.status >= 400 && error.status < 500) return false;
    return attempt < 3;
  },
});

const response = await client.get("/data");
// Automatically retries on failure
```

### Caching

```typescript
const client = new APIClient({
  cache: true,
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// First request - hits API
const users1 = await client.get("/users");

// Second request - returns cached
const users2 = await client.get("/users");

// Force fresh request
const users3 = await client.get("/users", {
  cache: false, // Skip cache
});

// Clear cache
client.cache.clear();
client.cache.remove("/users");
```

### Rate Limiting

```typescript
const client = new APIClient({
  rateLimit: {
    maxRequests: 100,
    windowMs: 60 * 1000, // Per minute
  },
});

// Requests are automatically queued if rate limit is exceeded
for (let i = 0; i < 150; i++) {
  client.get("/data").catch((err) => {
    if (err.code === "RATE_LIMITED") {
      console.log("Rate limited, request queued");
    }
  });
}
```

### Circuit Breaker

```typescript
const client = new APIClient({
  circuitBreaker: true,
  circuitBreakerThreshold: 5, // Fail after 5 errors
  circuitBreakerResetTime: 30000, // Reset after 30s
});

// Circuit breaker automatically opens after threshold
// and rejects requests until reset time passes
```

## Examples

### API Pagination

```typescript
async function getAllUsers() {
  let page = 1;
  const allUsers = [];

  while (true) {
    const response = await client.get("/users", {
      params: { page, limit: 100 },
    });

    allUsers.push(...response.data.items);

    if (!response.data.hasNextPage) break;
    page++;
  }

  return allUsers;
}
```

### Error Handling

```typescript
try {
  const user = await client.get("/users/invalid-id");
} catch (error) {
  if (error.status === 404) {
    console.log("User not found");
  } else if (error.status === 401) {
    console.log("Unauthorized - refresh token");
  } else if (error.status >= 500) {
    console.log("Server error - retry later");
  } else if (error.code === "ECONNREFUSED") {
    console.log("Connection refused - server down?");
  } else if (error.code === "ENOTFOUND") {
    console.log("DNS resolution failed");
  }
}
```

### Batch Requests

```typescript
// Sequential requests
const users = await client.get("/users");
const posts = await client.get("/posts");

// Parallel requests
const [usersRes, postsRes] = await Promise.all([
  client.get("/users"),
  client.get("/posts"),
]);

const { data: users } = usersRes;
const { data: posts } = postsRes;
```

### File Upload

```typescript
const formData = new FormData();
formData.append("file", fileBuffer, "document.pdf");
formData.append("title", "My Document");

const response = await client.post("/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

### GraphQL with Caching

```typescript
const client = new APIClient({
  graphqlEndpoint: "/graphql",
  cache: true,
  cacheTime: 30 * 60 * 1000, // 30 minutes for queries
});

// Queries are cached by default
const users1 = await client.graphql(GET_USERS_QUERY);
const users2 = await client.graphql(GET_USERS_QUERY); // From cache

// Mutations skip cache
const newUser = await client.graphql(CREATE_USER_MUTATION, {
  variables: { input },
});
```

## Streaming Responses

```typescript
// Stream large file downloads
const stream = await client.getStream("/large-file.zip");

stream.pipe(fs.createWriteStream("./download.zip"));
stream.on("progress", (e) => {
  console.log(`Downloaded: ${e.loaded}/${e.total} bytes`);
});

// Stream JSON array responses
const stream = await client.getStream("/large-dataset.json");
const lines = stream.pipe(JSONLStream.parse("*"));

lines.on("data", (item) => {
  console.log("Item:", item);
});
```

## TypeScript Support

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Typed responses
const users = await client.get<User[]>("/users");
// users has type User[]

const user = await client.post<User>("/users", {
  name: "John",
  email: "john@example.com",
});
// user has type User
```

## Testing

```typescript
import { APIClient, MockAdapter } from "@lanonasis/api-client";

const mockAdapter = new MockAdapter();
const client = new APIClient({
  adapter: mockAdapter,
});

// Mock responses
mockAdapter.onGet("/users").reply(200, [{ id: 1, name: "John" }]);

mockAdapter.onPost("/users").reply(201, { id: 2, name: "Jane" });

const users = await client.get("/users");
expect(users.data).toEqual([{ id: 1, name: "John" }]);
```

## Best Practices

1. **Reuse Clients**: Create one client per API service
2. **Handle Errors**: Always wrap in try/catch or .catch()
3. **Use Timeouts**: Prevent hanging requests
4. **Cache Strategically**: Cache read-heavy endpoints
5. **Validate Responses**: Don't assume API response shape
6. **Log Requests**: Help debug issues in production
7. **Use TypeScript**: Get better IDE support and type safety

## API Reference

For detailed platform API coverage, see [API Overview](/api/overview)

## Support

For issues and questions:

- GitHub: [lanonasis/api-client](https://github.com/lanonasis/api-client)
- Discord: [Join our community](https://discord.gg/lanonasis)
- Email: support@lanonasis.com
