# Python SDK API Reference

Complete reference for the LanOnasis Python SDK. This document covers all available methods, parameters, and return types.

## MemoryClient

The main client class for interacting with the LanOnasis API.

### Constructor

```python
MemoryClient(
    api_key: str,
    base_url: str = "https://api.lanonasis.com",
    timeout: int = 30,
    max_retries: int = 3,
    retry_delay: float = 1.0,
    user_agent: str = "lanonasis-python/1.0"
)
```

**Parameters:**
- `api_key` (str): Your LanOnasis API key
- `base_url` (str): API base URL (default: production)
- `timeout` (int): Request timeout in seconds
- `max_retries` (int): Maximum retry attempts
- `retry_delay` (float): Delay between retries in seconds
- `user_agent` (str): Custom user agent string

## Memory Operations

### create_memory

Create a new memory.

```python
def create_memory(
    self,
    content: str,
    metadata: Optional[Dict[str, Any]] = None,
    tags: Optional[List[str]] = None,
    **kwargs
) -> Memory
```

**Parameters:**
- `content` (str): Memory content
- `metadata` (Dict[str, Any], optional): Additional metadata
- `tags` (List[str], optional): Memory tags

**Returns:** `Memory` object

**Example:**
```python
memory = client.create_memory(
    content="Important project notes",
    metadata={"project": "web-app", "priority": "high"},
    tags=["work", "important"]
)
```

### get_memory

Retrieve a specific memory by ID.

```python
def get_memory(self, memory_id: str) -> Memory
```

**Parameters:**
- `memory_id` (str): Memory ID

**Returns:** `Memory` object

**Example:**
```python
memory = client.get_memory("mem_1234567890abcdef")
```

### update_memory

Update an existing memory.

```python
def update_memory(
    self,
    memory_id: str,
    content: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    tags: Optional[List[str]] = None,
    **kwargs
) -> Memory
```

**Parameters:**
- `memory_id` (str): Memory ID
- `content` (str, optional): New content
- `metadata` (Dict[str, Any], optional): Updated metadata
- `tags` (List[str], optional): Updated tags

**Returns:** `Memory` object

**Example:**
```python
updated_memory = client.update_memory(
    memory_id="mem_1234567890abcdef",
    content="Updated content",
    metadata={"updated": True}
)
```

### delete_memory

Delete a memory.

```python
def delete_memory(self, memory_id: str) -> bool
```

**Parameters:**
- `memory_id` (str): Memory ID

**Returns:** `bool` - True if successful

**Example:**
```python
success = client.delete_memory("mem_1234567890abcdef")
```

### list_memories

List memories with optional filtering.

```python
def list_memories(
    self,
    limit: int = 20,
    offset: int = 0,
    filters: Optional[Dict[str, Any]] = None,
    sort_by: Optional[str] = None,
    sort_order: str = "desc"
) -> MemoryList
```

**Parameters:**
- `limit` (int): Number of memories to return
- `offset` (int): Number of memories to skip
- `filters` (Dict[str, Any], optional): Filter criteria
- `sort_by` (str, optional): Field to sort by
- `sort_order` (str): Sort order ("asc" or "desc")

**Returns:** `MemoryList` object

**Example:**
```python
memories = client.list_memories(
    limit=50,
    filters={"category": "work"},
    sort_by="created_at"
)
```

## Search Operations

### search_memories

Search memories using natural language.

```python
def search_memories(
    self,
    query: str,
    limit: int = 10,
    filters: Optional[Dict[str, Any]] = None,
    include_metadata: bool = True,
    **kwargs
) -> SearchResults
```

**Parameters:**
- `query` (str): Search query
- `limit` (int): Maximum number of results
- `filters` (Dict[str, Any], optional): Additional filters
- `include_metadata` (bool): Include metadata in results

**Returns:** `SearchResults` object

**Example:**
```python
results = client.search_memories(
    query="project meeting notes",
    limit=20,
    filters={"category": "work"}
)
```

### generate_embedding

Generate vector embeddings for text.

```python
def generate_embedding(
    self,
    text: str,
    model: str = "text-embedding-3-large",
    dimensions: int = 1536,
    metadata: Optional[Dict[str, Any]] = None
) -> Embedding
```

**Parameters:**
- `text` (str): Text to embed
- `model` (str): Embedding model to use
- `dimensions` (int): Number of dimensions
- `metadata` (Dict[str, Any], optional): Additional metadata

**Returns:** `Embedding` object

**Example:**
```python
embedding = client.generate_embedding(
    text="This is some text to embed",
    model="text-embedding-3-large",
    dimensions=1536
)
```

## Batch Operations

### batch_operations

Perform multiple operations in a single request.

```python
def batch_operations(
    self,
    operations: List[Dict[str, Any]],
    continue_on_error: bool = False,
    max_retries: int = 3,
    timeout: int = 30000
) -> BatchResult
```

**Parameters:**
- `operations` (List[Dict[str, Any]]): List of operations
- `continue_on_error` (bool): Continue if individual operations fail
- `max_retries` (int): Maximum retry attempts
- `timeout` (int): Timeout in milliseconds

**Returns:** `BatchResult` object

**Example:**
```python
operations = [
    {
        "type": "create",
        "data": {
            "content": "Memory 1",
            "metadata": {"type": "note"}
        }
    },
    {
        "type": "create",
        "data": {
            "content": "Memory 2",
            "metadata": {"type": "note"}
        }
    }
]

result = client.batch_operations(operations)
```

## Real-time Features

### create_webhook

Create a webhook for real-time notifications.

```python
def create_webhook(
    self,
    url: str,
    events: List[str],
    secret: Optional[str] = None,
    active: bool = True,
    retry_policy: Optional[Dict[str, Any]] = None,
    filters: Optional[Dict[str, Any]] = None
) -> Webhook
```

**Parameters:**
- `url` (str): Webhook endpoint URL
- `events` (List[str]): Events to subscribe to
- `secret` (str, optional): Webhook secret for verification
- `active` (bool): Whether webhook is active
- `retry_policy` (Dict[str, Any], optional): Retry configuration
- `filters` (Dict[str, Any], optional): Event filters

**Returns:** `Webhook` object

**Example:**
```python
webhook = client.create_webhook(
    url="https://your-app.com/webhooks/lanonasis",
    events=["memory.created", "memory.updated"],
    secret="your-webhook-secret"
)
```

### stream_events

Stream real-time events.

```python
async def stream_events(
    self,
    events: List[str],
    filters: Optional[Dict[str, Any]] = None,
    heartbeat: int = 30
) -> AsyncIterator[Event]
```

**Parameters:**
- `events` (List[str]): Events to subscribe to
- `filters` (Dict[str, Any], optional): Event filters
- `heartbeat` (int): Heartbeat interval in seconds

**Returns:** `AsyncIterator[Event]`

**Example:**
```python
async for event in client.stream_events(
    events=["memory.created", "memory.updated"]
):
    print(f"Event: {event.type}, Data: {event.data}")
```

## Analytics

### get_analytics

Retrieve analytics and metrics.

```python
def get_analytics(
    self,
    timeframe: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    metrics: Optional[List[str]] = None,
    group_by: Optional[str] = None
) -> Analytics
```

**Parameters:**
- `timeframe` (str, optional): Time period ("1h", "24h", "7d", "30d", "90d")
- `start_date` (str, optional): Start date in ISO 8601 format
- `end_date` (str, optional): End date in ISO 8601 format
- `metrics` (List[str], optional): Specific metrics to include
- `group_by` (str, optional): Group results by time period

**Returns:** `Analytics` object

**Example:**
```python
analytics = client.get_analytics(
    timeframe="7d",
    metrics=["memory_operations", "search_queries"]
)
```

## Data Models

### Memory

Represents a memory object.

```python
class Memory:
    id: str
    content: str
    metadata: Dict[str, Any]
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    updated_by: Optional[str]
```

### SearchResults

Represents search results.

```python
class SearchResults:
    results: List[Memory]
    total: int
    query: str
    execution_time: float
    filters: Optional[Dict[str, Any]]
```

### Embedding

Represents a vector embedding.

```python
class Embedding:
    id: str
    vector: List[float]
    model: str
    dimensions: int
    text: str
    metadata: Dict[str, Any]
    created_at: datetime
```

### Webhook

Represents a webhook configuration.

```python
class Webhook:
    id: str
    url: str
    events: List[str]
    secret: str
    active: bool
    retry_policy: Dict[str, Any]
    filters: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
```

### Event

Represents a real-time event.

```python
class Event:
    id: str
    type: str
    data: Dict[str, Any]
    created: datetime
    webhook_id: Optional[str]
    attempt: int
    livemode: bool
```

## Error Handling

### LanonasisError

Base exception for all LanOnasis API errors.

```python
class LanonasisError(Exception):
    code: str
    message: str
    details: Optional[Dict[str, Any]]
    status_code: Optional[int]
```

### Specific Error Types

```python
class AuthenticationError(LanonasisError):
    """Raised when authentication fails"""

class ValidationError(LanonasisError):
    """Raised when request validation fails"""

class RateLimitError(LanonasisError):
    """Raised when rate limit is exceeded"""

class NotFoundError(LanonasisError):
    """Raised when resource is not found"""

class ServerError(LanonasisError):
    """Raised when server error occurs"""
```

## Configuration

### Environment Variables

The SDK respects the following environment variables:

- `LANONASIS_API_KEY`: Your API key
- `LANONASIS_BASE_URL`: API base URL
- `LANONASIS_TIMEOUT`: Request timeout
- `LANONASIS_MAX_RETRIES`: Maximum retry attempts

### Logging

Enable logging for debugging:

```python
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

# Or configure specific logger
logger = logging.getLogger('lanonasis')
logger.setLevel(logging.DEBUG)
```