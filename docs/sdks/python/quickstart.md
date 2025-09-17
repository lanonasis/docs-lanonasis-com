# Python SDK Quickstart

Get started with the LanOnasis Python SDK in minutes. This guide will walk you through installation, authentication, and your first memory operations.

## Installation

Install the LanOnasis Python SDK using pip:

```bash
pip install lanonasis-python
```

For development or if you need the latest features:

```bash
pip install git+https://github.com/lanonasis/lanonasis-python.git
```

## Authentication

Create a client instance with your API key:

```python
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key-here",
    base_url="https://api.lanonasis.com"  # Optional, defaults to production
)
```

### Environment Variables

You can also set your API key as an environment variable:

```bash
export LANONASIS_API_KEY="your-api-key-here"
```

```python
from lanonasis import MemoryClient

# Will automatically use LANONASIS_API_KEY environment variable
client = MemoryClient()
```

## Your First Memory

Let's create your first memory:

```python
from lanonasis import MemoryClient

client = MemoryClient(api_key="your-api-key")

# Create a memory
memory = client.create_memory(
    content="This is my first memory using LanOnasis!",
    metadata={
        "category": "personal",
        "importance": "high"
    },
    tags=["first", "tutorial", "python"]
)

print(f"Created memory with ID: {memory.id}")
print(f"Content: {memory.content}")
```

## Search Your Memories

Search through your memories using natural language:

```python
# Search for memories
results = client.search_memories(
    query="first memory tutorial",
    limit=10
)

print(f"Found {len(results.results)} memories:")
for memory in results.results:
    print(f"- {memory.content} (Score: {memory.score:.2f})")
```

## Update and Delete

Update or delete memories as needed:

```python
# Update a memory
updated_memory = client.update_memory(
    memory_id=memory.id,
    content="This is my updated first memory!",
    metadata={
        "category": "personal",
        "importance": "high",
        "updated": True
    }
)

# Delete a memory
client.delete_memory(memory_id=memory.id)
print("Memory deleted successfully")
```

## Batch Operations

Perform multiple operations efficiently:

```python
# Create multiple memories at once
memories_data = [
    {
        "content": "Meeting notes from today",
        "metadata": {"type": "meeting", "date": "2024-01-15"},
        "tags": ["work", "meeting"]
    },
    {
        "content": "Project ideas for next quarter",
        "metadata": {"type": "planning", "priority": "medium"},
        "tags": ["work", "planning"]
    }
]

batch_result = client.batch_operations([
    {"type": "create", "data": data} for data in memories_data
])

print(f"Created {batch_result.processed} memories")
```

## Real-time Updates

Subscribe to real-time updates using webhooks:

```python
import asyncio
from lanonasis import MemoryClient

client = MemoryClient(api_key="your-api-key")

async def handle_updates():
    # Create a webhook for real-time updates
    webhook = client.create_webhook(
        url="https://your-app.com/webhooks/lanonasis",
        events=["memory.created", "memory.updated"],
        secret="your-webhook-secret"
    )
    
    print(f"Webhook created: {webhook.id}")

# Run the async function
asyncio.run(handle_updates())
```

## Error Handling

Handle errors gracefully:

```python
from lanonasis import MemoryClient, LanonasisError

client = MemoryClient(api_key="your-api-key")

try:
    memory = client.create_memory(content="Test memory")
except LanonasisError as e:
    print(f"Error: {e.message}")
    print(f"Code: {e.code}")
    if e.details:
        print(f"Details: {e.details}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Configuration Options

Customize the client behavior:

```python
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com",
    timeout=30,  # Request timeout in seconds
    max_retries=3,  # Maximum retry attempts
    retry_delay=1,  # Delay between retries in seconds
    user_agent="MyApp/1.0"  # Custom user agent
)
```

## Advanced Features

### Custom Embeddings

Generate embeddings for your content:

```python
# Generate embeddings
embedding = client.generate_embedding(
    text="This is some text to embed",
    model="text-embedding-3-large",
    dimensions=1536
)

print(f"Generated embedding with {len(embedding.vector)} dimensions")
```

### Analytics

Get insights about your memory usage:

```python
# Get analytics
analytics = client.get_analytics(
    timeframe="7d",
    metrics=["memory_operations", "search_queries"]
)

print(f"Total memories: {analytics.summary.total_memories}")
print(f"Total searches: {analytics.summary.total_searches}")
```

### Streaming Updates

Listen to real-time events:

```python
import asyncio

async def listen_to_events():
    async for event in client.stream_events(
        events=["memory.created", "memory.updated"]
    ):
        print(f"Event: {event.type}")
        print(f"Data: {event.data}")

# Run the event listener
asyncio.run(listen_to_events())
```

## Next Steps

Now that you have the basics, explore more advanced features:

- [API Reference](/sdks/python/api-reference) - Complete API documentation
- [Examples](/sdks/python/examples) - Real-world usage examples
- [Best Practices](/sdks/python/best-practices) - Production-ready patterns
- [Troubleshooting](/sdks/python/troubleshooting) - Common issues and solutions

## Need Help?

- **Documentation**: Browse our comprehensive guides
- **Community**: Join our Discord community
- **Support**: Contact our support team
- **GitHub**: View source code and report issues

[Get Support →](/support)