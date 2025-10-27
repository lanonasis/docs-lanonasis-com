# Batch Operations API

Perform multiple memory operations in a single request for improved efficiency and reduced latency.

## Endpoint

```
POST /api/v1/batch
```

## Description

The Batch Operations API allows you to perform multiple memory operations (create, read, update, delete) in a single request. This is ideal for bulk operations, data migration, and reducing API call overhead.

## Authentication

```http
Authorization: Bearer <your-api-key>
```

## Request

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token for API authentication |
| `Content-Type` | string | Yes | Must be `application/json` |
| `X-Batch-Id` | string | No | Custom batch identifier for tracking |

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `operations` | array | Yes | Array of operations to perform |
| `options` | object | No | Batch processing options |

### Operation Types

#### Create Operation
```json
{
  "type": "create",
  "data": {
    "content": "Memory content",
    "metadata": {},
    "tags": ["tag1", "tag2"]
  }
}
```

#### Read Operation
```json
{
  "type": "read",
  "id": "memory_id"
}
```

#### Update Operation
```json
{
  "type": "update",
  "id": "memory_id",
  "data": {
    "content": "Updated content",
    "metadata": {"updated": true}
  }
}
```

#### Delete Operation
```json
{
  "type": "delete",
  "id": "memory_id"
}
```

#### Search Operation
```json
{
  "type": "search",
  "query": "search terms",
  "options": {
    "limit": 10,
    "filters": {"category": "important"}
  }
}
```

### Example Request

```bash
curl -X POST https://api.lanonasis.com/api/v1/batch \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -H "X-Batch-Id: migration-2024-01-15" \
  -d '{
    "operations": [
      {
        "type": "create",
        "data": {
          "content": "User profile data",
          "metadata": {"type": "profile", "user_id": "123"},
          "tags": ["user", "profile"]
        }
      },
      {
        "type": "create",
        "data": {
          "content": "Product catalog entry",
          "metadata": {"type": "product", "category": "electronics"},
          "tags": ["product", "catalog"]
        }
      },
      {
        "type": "search",
        "query": "user authentication",
        "options": {"limit": 5}
      }
    ],
    "options": {
      "continue_on_error": true,
      "max_retries": 3,
      "timeout": 30000
    }
  }'
```

```typescript
import { MemoryClient } from '@lanonasis/memory-client';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

const batchResult = await client.batchOperations([
  {
    type: 'create',
    data: {
      content: 'User profile data',
      metadata: { type: 'profile', user_id: '123' },
      tags: ['user', 'profile']
    }
  },
  {
    type: 'create',
    data: {
      content: 'Product catalog entry',
      metadata: { type: 'product', category: 'electronics' },
      tags: ['product', 'catalog']
    }
  },
  {
    type: 'search',
    query: 'user authentication',
    options: { limit: 5 }
  }
], {
  continueOnError: true,
  maxRetries: 3,
  timeout: 30000
});

console.log(`Processed ${batchResult.processed} operations`);
```

```python
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com"
)

operations = [
    {
        "type": "create",
        "data": {
            "content": "User profile data",
            "metadata": {"type": "profile", "user_id": "123"},
            "tags": ["user", "profile"]
        }
    },
    {
        "type": "create",
        "data": {
            "content": "Product catalog entry",
            "metadata": {"type": "product", "category": "electronics"},
            "tags": ["product", "catalog"]
        }
    },
    {
        "type": "search",
        "query": "user authentication",
        "options": {"limit": 5}
    }
]

batch_result = client.batch_operations(
    operations,
    continue_on_error=True,
    max_retries=3,
    timeout=30000
)

print(f"Processed {batch_result.processed} operations")
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "batch_id": "batch_1234567890abcdef",
    "processed": 3,
    "failed": 0,
    "total": 3,
    "execution_time": 1250,
    "operations": [
      {
        "index": 0,
        "type": "create",
        "status": "success",
        "result": {
          "id": "mem_1234567890abcdef",
          "created_at": "2024-01-15T10:30:00Z"
        }
      },
      {
        "index": 1,
        "type": "create",
        "status": "success",
        "result": {
          "id": "mem_0987654321fedcba",
          "created_at": "2024-01-15T10:30:01Z"
        }
      },
      {
        "index": 2,
        "type": "search",
        "status": "success",
        "result": {
          "results": [
            {
              "id": "mem_1111111111111111",
              "content": "Authentication system documentation",
              "score": 0.95
            }
          ],
          "total": 1
        }
      }
    ],
    "summary": {
      "creates": 2,
      "reads": 0,
      "updates": 0,
      "deletes": 0,
      "searches": 1
    }
  }
}
```

### Partial Success Response (207 Multi-Status)

```json
{
  "success": true,
  "data": {
    "batch_id": "batch_1234567890abcdef",
    "processed": 2,
    "failed": 1,
    "total": 3,
    "execution_time": 1250,
    "operations": [
      {
        "index": 0,
        "type": "create",
        "status": "success",
        "result": {
          "id": "mem_1234567890abcdef",
          "created_at": "2024-01-15T10:30:00Z"
        }
      },
      {
        "index": 1,
        "type": "create",
        "status": "failed",
        "error": {
          "code": "VALIDATION_ERROR",
          "message": "Content is required",
          "details": {
            "field": "content"
          }
        }
      },
      {
        "index": 2,
        "type": "search",
        "status": "success",
        "result": {
          "results": [],
          "total": 0
        }
      }
    ]
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_BATCH_REQUEST",
    "message": "Invalid batch request",
    "details": {
      "field": "operations",
      "reason": "operations_array_required"
    }
  }
}
```

#### 413 Payload Too Large
```json
{
  "success": false,
  "error": {
    "code": "BATCH_TOO_LARGE",
    "message": "Batch size exceeds maximum limit",
    "details": {
      "max_operations": 100,
      "provided_operations": 150
    }
  }
}
```

## Batch Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `continue_on_error` | boolean | `false` | Continue processing if individual operations fail |
| `max_retries` | number | `0` | Maximum retry attempts for failed operations |
| `timeout` | number | `30000` | Timeout in milliseconds for the entire batch |
| `parallel` | boolean | `true` | Process operations in parallel when possible |
| `validate_only` | boolean | `false` | Validate operations without executing them |

## Limits

- **Maximum Operations**: 100 per batch request
- **Maximum Payload**: 10MB per request
- **Timeout**: 60 seconds maximum
- **Rate Limit**: 10 batch requests per minute

## Best Practices

1. **Batch Size**: Use 10-50 operations per batch for optimal performance
2. **Error Handling**: Always check individual operation results
3. **Retry Logic**: Implement retry for failed operations
4. **Monitoring**: Track batch success rates and performance
5. **Validation**: Validate data before sending large batches

## Use Cases

- **Data Migration**: Bulk import/export of memories
- **Bulk Updates**: Update multiple memories at once
- **Search Operations**: Perform multiple searches efficiently
- **Data Synchronization**: Sync data between systems
- **Analytics**: Bulk operations for reporting

## Performance Tips

1. **Parallel Processing**: Enable parallel processing for better performance
2. **Chunking**: Split large datasets into smaller batches
3. **Error Recovery**: Use `continue_on_error` for resilient processing
4. **Monitoring**: Track execution times and optimize accordingly