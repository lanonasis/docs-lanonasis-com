# Your First Memory

Learn how to create, search, and manage your first memory using the LanOnasis API.

## Prerequisites

- LanOnasis API key
- Basic knowledge of HTTP requests
- Your preferred programming language

## Step 1: Create Your First Memory

Let's start by creating a simple memory about a project idea.

### cURL
```bash
curl -X POST https://api.lanonasis.com/api/v1/memory \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Build a personal knowledge management system using AI",
    "metadata": {
      "project": "knowledge-management",
      "priority": "high",
      "status": "planning"
    },
    "tags": ["project", "ai", "knowledge", "planning"]
  }'
```

### JavaScript/TypeScript
```typescript
import { MemoryClient } from '@LanOnasis/memory-sdk';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

async function createFirstMemory() {
  try {
    const memory = await client.createMemory({
      content: "Build a personal knowledge management system using AI",
      metadata: {
        project: "knowledge-management",
        priority: "high",
        status: "planning"
      },
      tags: ["project", "ai", "knowledge", "planning"]
    });

    console.log('Memory created:', memory.id);
    console.log('Content:', memory.content);
    return memory;
  } catch (error) {
    console.error('Error creating memory:', error);
  }
}

createFirstMemory();
```

### Python
```python
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com"
)

def create_first_memory():
    try:
        memory = client.create_memory(
            content="Build a personal knowledge management system using AI",
            metadata={
                "project": "knowledge-management",
                "priority": "high",
                "status": "planning"
            },
            tags=["project", "ai", "knowledge", "planning"]
        )
        
        print(f"Memory created: {memory.id}")
        print(f"Content: {memory.content}")
        return memory
    except Exception as error:
        print(f"Error creating memory: {error}")

create_first_memory()
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "id": "mem_1234567890abcdef",
    "content": "Build a personal knowledge management system using AI",
    "metadata": {
      "project": "knowledge-management",
      "priority": "high",
      "status": "planning"
    },
    "tags": ["project", "ai", "knowledge", "planning"],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

## Step 2: Search Your Memory

Now let's search for your memory using natural language.

### cURL
```bash
curl -X POST https://api.lanonasis.com/api/v1/search \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI knowledge management project",
    "limit": 10
  }'
```

### JavaScript/TypeScript
```typescript
async function searchMemories() {
  try {
    const results = await client.searchMemories({
      query: "AI knowledge management project",
      limit: 10
    });

    console.log(`Found ${results.results.length} memories:`);
    results.results.forEach((memory, index) => {
      console.log(`${index + 1}. ${memory.content} (Score: ${memory.score})`);
    });
  } catch (error) {
    console.error('Error searching memories:', error);
  }
}

searchMemories();
```

### Python
```python
def search_memories():
    try:
        results = client.search_memories(
            query="AI knowledge management project",
            limit=10
        )
        
        print(f"Found {len(results.results)} memories:")
        for i, memory in enumerate(results.results):
            print(f"{i + 1}. {memory.content} (Score: {memory.score})")
    except Exception as error:
        print(f"Error searching memories: {error}")

search_memories()
```

## Step 3: Update Your Memory

Let's add more details to your memory.

### cURL
```bash
curl -X PUT https://api.lanonasis.com/api/v1/memory/mem_1234567890abcdef \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Build a personal knowledge management system using AI with features like semantic search, automatic categorization, and intelligent recommendations",
    "metadata": {
      "project": "knowledge-management",
      "priority": "high",
      "status": "planning",
      "features": ["semantic-search", "auto-categorization", "recommendations"],
      "tech_stack": ["python", "ai", "vector-db"]
    },
    "tags": ["project", "ai", "knowledge", "planning", "features"]
  }'
```

### JavaScript/TypeScript
```typescript
async function updateMemory(memoryId: string) {
  try {
    const updatedMemory = await client.updateMemory(memoryId, {
      content: "Build a personal knowledge management system using AI with features like semantic search, automatic categorization, and intelligent recommendations",
      metadata: {
        project: "knowledge-management",
        priority: "high",
        status: "planning",
        features: ["semantic-search", "auto-categorization", "recommendations"],
        tech_stack: ["python", "ai", "vector-db"]
      },
      tags: ["project", "ai", "knowledge", "planning", "features"]
    });

    console.log('Memory updated:', updatedMemory.id);
    console.log('New content:', updatedMemory.content);
  } catch (error) {
    console.error('Error updating memory:', error);
  }
}

// Use the memory ID from the create response
updateMemory('mem_1234567890abcdef');
```

### Python
```python
def update_memory(memory_id):
    try:
        updated_memory = client.update_memory(
            memory_id,
            content="Build a personal knowledge management system using AI with features like semantic search, automatic categorization, and intelligent recommendations",
            metadata={
                "project": "knowledge-management",
                "priority": "high",
                "status": "planning",
                "features": ["semantic-search", "auto-categorization", "recommendations"],
                "tech_stack": ["python", "ai", "vector-db"]
            },
            tags=["project", "ai", "knowledge", "planning", "features"]
        )
        
        print(f"Memory updated: {updated_memory.id}")
        print(f"New content: {updated_memory.content}")
    except Exception as error:
        print(f"Error updating memory: {error}")

# Use the memory ID from the create response
update_memory('mem_1234567890abcdef')
```

## Step 4: List All Your Memories

Let's see all the memories you've created.

### cURL
```bash
curl -X GET "https://api.lanonasis.com/api/v1/memory?limit=20" \
  -H "Authorization: Bearer your-api-key"
```

### JavaScript/TypeScript
```typescript
async function listMemories() {
  try {
    const memories = await client.listMemories({
      limit: 20,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });

    console.log(`You have ${memories.total} memories:`);
    memories.results.forEach((memory, index) => {
      console.log(`${index + 1}. [${memory.tags.join(', ')}] ${memory.content}`);
    });
  } catch (error) {
    console.error('Error listing memories:', error);
  }
}

listMemories();
```

### Python
```python
def list_memories():
    try:
        memories = client.list_memories(
            limit=20,
            sort_by='created_at',
            sort_order='desc'
        )
        
        print(f"You have {memories.total} memories:")
        for i, memory in enumerate(memories.results):
            print(f"{i + 1}. [{', '.join(memory.tags)}] {memory.content}")
    except Exception as error:
        print(f"Error listing memories: {error}")

list_memories()
```

## Step 5: Complete Example

Here's a complete example that demonstrates the full workflow:

### JavaScript/TypeScript
```typescript
import { MemoryClient } from '@LanOnasis/memory-sdk';

const client = new MemoryClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.lanonasis.com'
});

async function completeExample() {
  try {
    // 1. Create a memory
    console.log('Creating memory...');
    const memory = await client.createMemory({
      content: "Build a personal knowledge management system using AI",
      metadata: {
        project: "knowledge-management",
        priority: "high"
      },
      tags: ["project", "ai", "knowledge"]
    });
    console.log('✅ Memory created:', memory.id);

    // 2. Search for the memory
    console.log('\nSearching memories...');
    const searchResults = await client.searchMemories({
      query: "AI knowledge management",
      limit: 5
    });
    console.log(`✅ Found ${searchResults.results.length} memories`);

    // 3. Update the memory
    console.log('\nUpdating memory...');
    const updatedMemory = await client.updateMemory(memory.id, {
      content: "Build a personal knowledge management system using AI with semantic search and auto-categorization",
      metadata: {
        ...memory.metadata,
        features: ["semantic-search", "auto-categorization"]
      },
      tags: [...memory.tags, "features"]
    });
    console.log('✅ Memory updated');

    // 4. List all memories
    console.log('\nListing all memories...');
    const allMemories = await client.listMemories({ limit: 10 });
    console.log(`✅ You have ${allMemories.total} total memories`);

    console.log('\n🎉 Complete example finished successfully!');
  } catch (error) {
    console.error('❌ Error in complete example:', error);
  }
}

completeExample();
```

### Python
```python
from lanonasis import MemoryClient

client = MemoryClient(
    api_key="your-api-key",
    base_url="https://api.lanonasis.com"
)

def complete_example():
    try:
        # 1. Create a memory
        print("Creating memory...")
        memory = client.create_memory(
            content="Build a personal knowledge management system using AI",
            metadata={
                "project": "knowledge-management",
                "priority": "high"
            },
            tags=["project", "ai", "knowledge"]
        )
        print(f"✅ Memory created: {memory.id}")

        # 2. Search for the memory
        print("\nSearching memories...")
        search_results = client.search_memories(
            query="AI knowledge management",
            limit=5
        )
        print(f"✅ Found {len(search_results.results)} memories")

        # 3. Update the memory
        print("\nUpdating memory...")
        updated_memory = client.update_memory(
            memory.id,
            content="Build a personal knowledge management system using AI with semantic search and auto-categorization",
            metadata={
                **memory.metadata,
                "features": ["semantic-search", "auto-categorization"]
            },
            tags=memory.tags + ["features"]
        )
        print("✅ Memory updated")

        # 4. List all memories
        print("\nListing all memories...")
        all_memories = client.list_memories(limit=10)
        print(f"✅ You have {all_memories.total} total memories")

        print("\n🎉 Complete example finished successfully!")
    except Exception as error:
        print(f"❌ Error in complete example: {error}")

complete_example()
```

## Next Steps

Now that you've created your first memory, explore more advanced features:

- [Basic Search](/examples/quickstart/basic-search) - Learn about search capabilities
- [Authentication](/examples/quickstart/authentication) - Set up proper authentication
- [Advanced Examples](/examples/advanced) - Explore advanced use cases
- [SDK Documentation](/sdks) - Complete SDK reference

## Troubleshooting

### Common Issues

**Authentication Error (401)**
- Verify your API key is correct
- Check that you're using the right base URL

**Memory Not Found (404)**
- Ensure the memory ID is correct
- Check that the memory hasn't been deleted

**Rate Limit Exceeded (429)**
- Wait before making more requests
- Consider upgrading your plan

**Validation Error (400)**
- Check that required fields are provided
- Verify data types match the API specification

### Getting Help

- **Documentation**: Browse our comprehensive guides
- **Community**: Join our Discord community
- **Support**: Contact our support team

[Get Support →](/support)