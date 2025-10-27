# Real-time Stream API

Subscribe to real-time updates and events using Server-Sent Events (SSE) for live memory operations and system notifications.

## Endpoint

```
GET /api/v1/stream
```

## Description

The Real-time Stream API provides live updates about memory operations, system events, and notifications using Server-Sent Events (SSE). This is perfect for building real-time dashboards, live notifications, and collaborative features.

## Authentication

```http
Authorization: Bearer <your-api-key>
```

## Request

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Authorization` | string | Yes | Bearer token for API authentication |
| `Accept` | string | Yes | Must be `text/event-stream` |
| `Cache-Control` | string | No | Must be `no-cache` |
| `Connection` | string | No | Must be `keep-alive` |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `events` | string[] | No | Specific event types to subscribe to |
| `filters` | object | No | Filter events by metadata |
| `heartbeat` | number | No | Heartbeat interval in seconds (default: 30) |

### Event Types

| Event Type | Description |
|------------|-------------|
| `memory.created` | New memory created |
| `memory.updated` | Memory updated |
| `memory.deleted` | Memory deleted |
| `search.performed` | Search query executed |
| `user.activity` | User activity events |
| `system.health` | System health updates |
| `analytics.update` | Analytics data updates |

### Example Request

```bash
curl -X GET "https://api.lanonasis.com/api/v1/stream?events=memory.created,memory.updated,search.performed" \
  -H "Authorization: Bearer your-api-key" \
  -H "Accept: text/event-stream" \
  -H "Cache-Control: no-cache" \
  -H "Connection: keep-alive"
```

```typescript
import { MemoryClient } from '@lanonasis/memory-client';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

const stream = client.createStream({
  events: ['memory.created', 'memory.updated', 'search.performed'],
  filters: { user_id: 'user123' },
  heartbeat: 30
});

stream.on('memory.created', (event) => {
  console.log('New memory created:', event.data);
});

stream.on('memory.updated', (event) => {
  console.log('Memory updated:', event.data);
});

stream.on('search.performed', (event) => {
  console.log('Search performed:', event.data);
});

stream.on('error', (error) => {
  console.error('Stream error:', error);
});

// Close the stream when done
stream.close();
```

```python
import asyncio
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com"
)

async def handle_stream():
    stream = client.create_stream(
        events=["memory.created", "memory.updated", "search.performed"],
        filters={"user_id": "user123"},
        heartbeat=30
    )
    
    async for event in stream:
        if event.type == "memory.created":
            print(f"New memory created: {event.data}")
        elif event.type == "memory.updated":
            print(f"Memory updated: {event.data}")
        elif event.type == "search.performed":
            print(f"Search performed: {event.data}")

# Run the async stream handler
asyncio.run(handle_stream())
```

## Response Format

The stream returns Server-Sent Events in the following format:

```
event: memory.created
id: event_1234567890
data: {"id": "mem_1234567890abcdef", "content": "New memory", "created_at": "2024-01-15T10:30:00Z"}

event: memory.updated
id: event_1234567891
data: {"id": "mem_1234567890abcdef", "content": "Updated memory", "updated_at": "2024-01-15T10:31:00Z"}

event: heartbeat
id: heartbeat_1234567892
data: {"timestamp": "2024-01-15T10:30:30Z", "status": "healthy"}

```

## Event Data Structures

### Memory Created Event
```json
{
  "event": "memory.created",
  "id": "event_1234567890",
  "data": {
    "id": "mem_1234567890abcdef",
    "content": "New memory content",
    "metadata": {
      "user_id": "user123",
      "category": "note"
    },
    "tags": ["important", "work"],
    "created_at": "2024-01-15T10:30:00Z",
    "created_by": "user123"
  }
}
```

### Memory Updated Event
```json
{
  "event": "memory.updated",
  "id": "event_1234567891",
  "data": {
    "id": "mem_1234567890abcdef",
    "content": "Updated memory content",
    "metadata": {
      "user_id": "user123",
      "category": "note",
      "updated": true
    },
    "tags": ["important", "work", "updated"],
    "updated_at": "2024-01-15T10:31:00Z",
    "updated_by": "user123",
    "changes": {
      "content": true,
      "metadata": true,
      "tags": true
    }
  }
}
```

### Memory Deleted Event
```json
{
  "event": "memory.deleted",
  "id": "event_1234567892",
  "data": {
    "id": "mem_1234567890abcdef",
    "deleted_at": "2024-01-15T10:32:00Z",
    "deleted_by": "user123",
    "reason": "user_request"
  }
}
```

### Search Performed Event
```json
{
  "event": "search.performed",
  "id": "event_1234567893",
  "data": {
    "query": "user authentication",
    "results_count": 15,
    "execution_time": 145.2,
    "user_id": "user123",
    "timestamp": "2024-01-15T10:30:15Z",
    "filters": {
      "category": "documentation"
    }
  }
}
```

### System Health Event
```json
{
  "event": "system.health",
  "id": "event_1234567894",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "metrics": {
      "cpu_usage": 45.2,
      "memory_usage": 67.8,
      "response_time": 142.1,
      "error_rate": 0.1
    },
    "services": {
      "api": "healthy",
      "database": "healthy",
      "search": "healthy"
    }
  }
}
```

### Heartbeat Event
```json
{
  "event": "heartbeat",
  "id": "heartbeat_1234567895",
  "data": {
    "timestamp": "2024-01-15T10:30:30Z",
    "status": "healthy",
    "connection_id": "conn_1234567890abcdef"
  }
}
```

## Error Events

### Connection Error
```
event: error
id: error_1234567890
data: {"code": "CONNECTION_ERROR", "message": "Connection lost", "retry_after": 5000}
```

### Authentication Error
```
event: error
id: error_1234567891
data: {"code": "AUTH_ERROR", "message": "Invalid API key", "retry_after": 0}
```

### Rate Limit Error
```
event: error
id: error_1234567892
data: {"code": "RATE_LIMITED", "message": "Too many connections", "retry_after": 60000}
```

## JavaScript Client Example

```javascript
class LanOnasisStream {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.lanonasis.com';
    this.eventSource = null;
    this.listeners = new Map();
  }

  connect(events = [], filters = {}) {
    const params = new URLSearchParams();
    events.forEach(event => params.append('events', event));
    Object.entries(filters).forEach(([key, value]) => {
      params.append(`filters[${key}]`, value);
    });

    const url = `${this.baseUrl}/api/v1/stream?${params.toString()}`;
    
    this.eventSource = new EventSource(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    this.eventSource.onopen = () => {
      console.log('Stream connected');
    };

    this.eventSource.onmessage = (event) => {
      this.handleEvent(event);
    };

    this.eventSource.onerror = (error) => {
      console.error('Stream error:', error);
      this.reconnect();
    };
  }

  handleEvent(event) {
    const data = JSON.parse(event.data);
    const eventType = event.type || 'message';
    
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        callback(data);
      });
    }
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  reconnect() {
    setTimeout(() => {
      if (this.eventSource) {
        this.eventSource.close();
        this.connect();
      }
    }, 5000);
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// Usage
const stream = new LanOnasisStream('your-api-key');
stream.connect(['memory.created', 'memory.updated']);

stream.on('memory.created', (data) => {
  console.log('New memory:', data);
});

stream.on('memory.updated', (data) => {
  console.log('Updated memory:', data);
});
```

## Best Practices

1. **Reconnection**: Implement automatic reconnection logic
2. **Error Handling**: Handle connection errors gracefully
3. **Event Filtering**: Subscribe only to needed events
4. **Resource Management**: Close connections when not needed
5. **Heartbeat Monitoring**: Monitor heartbeat events for connection health

## Use Cases

- **Real-time Dashboards**: Live updates for monitoring
- **Collaborative Features**: Real-time collaboration on memories
- **Notifications**: Push notifications for important events
- **Live Analytics**: Real-time analytics updates
- **System Monitoring**: Live system health monitoring

## Rate Limits

- **Concurrent Connections**: 5 per API key
- **Event Rate**: 1000 events per minute per connection
- **Heartbeat Interval**: 30 seconds minimum