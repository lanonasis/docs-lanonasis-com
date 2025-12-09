# Quick Start Guide

## API Access Points

### 🎮 Interactive Testing
**API Playground**: https://docs.lanonasis.com/api/playground
- Test endpoints directly in your browser
- No code required
- API key persistence
- cURL generation

### 🤖 Claude Desktop (MCP)
**Endpoint**: https://docs.lanonasis.com/api/mcp
- Format: Server-Sent Events (SSE)
- Protocol: MCP (Model Context Protocol)
- Tool: `search_lanonasis_docs`

**Configuration**:
```json
{
  "LanOnasis Documentation": {
    "url": "https://docs.lanonasis.com/api/mcp",
    "type": "http"
  }
}
```

### 🎯 Custom GPT Actions
**Endpoint**: https://docs.lanonasis.com/api/search
- Format: JSON
- Protocol: REST (OpenAPI 3.1)
- Spec: https://docs.lanonasis.com/openapi.yaml

**Quick Test**:
```bash
curl "https://docs.lanonasis.com/api/search?query=memory+service&limit=5"
```

### 📚 REST API
**Base URL**: https://docs.lanonasis.com

**Endpoints**:
- `GET /api/search` - Search documentation
- `POST /api/search` - Search with body parameters

**Parameters**:
- `query` (required) - Search term
- `section` (optional) - Filter by `api`, `guides`, `sdks`, or `all`
- `limit` (optional) - Max results (default: 10)

## Quick Tests

### Test Search API
```bash
# Basic search
curl "https://docs.lanonasis.com/api/search?query=authentication"

# Filter by section
curl "https://docs.lanonasis.com/api/search?query=sdk&section=sdks&limit=3"

# POST request
curl -X POST "https://docs.lanonasis.com/api/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "memory service", "section": "all", "limit": 5}'
```

### Test MCP Endpoint
```bash
# Initialize
curl -X POST https://docs.lanonasis.com/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'

# List tools
curl -X POST https://docs.lanonasis.com/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'

# Search docs
curl -X POST https://docs.lanonasis.com/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"search_lanonasis_docs","arguments":{"query":"api","limit":3}}}'
```

### Test Playground
1. Navigate to https://docs.lanonasis.com/api/playground
2. Select endpoint from dropdown
3. Fill in parameters
4. Click "Run Request"
5. View response and cURL command

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "title": "API Overview",
        "url": "https://docs.lanonasis.com/api/overview",
        "excerpt": "Complete API documentation...",
        "section": "api",
        "relevance": 0.95
      }
    ],
    "total": 1,
    "query": "api",
    "section": "all"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Invalid query parameter",
    "code": "INVALID_PARAMETER"
  }
}
```

## Common Use Cases

### 1. Search All Documentation
```bash
curl "https://docs.lanonasis.com/api/search?query=getting+started"
```

### 2. Find API Endpoints
```bash
curl "https://docs.lanonasis.com/api/search?query=authentication&section=api"
```

### 3. Search SDK Documentation
```bash
curl "https://docs.lanonasis.com/api/search?query=typescript&section=sdks"
```

### 4. Get Specific Number of Results
```bash
curl "https://docs.lanonasis.com/api/search?query=memory&limit=3"
```

### 5. Test with API Playground
- Go to https://docs.lanonasis.com/api/playground
- Select `GET /api/search`
- Enter query: "memory service"
- Set limit: 5
- Click "Run Request"

## Integration Examples

### JavaScript/TypeScript
```typescript
async function searchDocs(query: string, section = 'all', limit = 10) {
  const params = new URLSearchParams({ query, section, limit: limit.toString() });
  const response = await fetch(`https://docs.lanonasis.com/api/search?${params}`);
  return response.json();
}

// Usage
const results = await searchDocs('authentication', 'api', 5);
console.log(results.data.results);
```

### Python
```python
import requests

def search_docs(query, section='all', limit=10):
    params = {'query': query, 'section': section, 'limit': limit}
    response = requests.get('https://docs.lanonasis.com/api/search', params=params)
    return response.json()

# Usage
results = search_docs('authentication', 'api', 5)
print(results['data']['results'])
```

### cURL
```bash
#!/bin/bash
QUERY="authentication"
SECTION="api"
LIMIT=5

curl -s "https://docs.lanonasis.com/api/search?query=${QUERY}&section=${SECTION}&limit=${LIMIT}" | jq '.data.results'
```

## Rate Limits

Currently, there are **no rate limits** on the documentation API. However, please be respectful:

- Recommended: Max 10 requests per second
- For bulk operations, consider caching results
- Use appropriate `limit` parameter to reduce response size

## Support

### Documentation
- [API Playground Guide](.devops/API-PLAYGROUND-GUIDE.md)
- [MCP Deployment Guide](.devops/MCP-DEPLOYMENT-GUIDE.md)
- [Custom GPT Integration](.devops/CUSTOM-GPT-INTEGRATION.md)
- [FAQ](.devops/FAQ.md)

### Testing Tools
- **Interactive**: https://docs.lanonasis.com/api/playground
- **OpenAPI Spec**: https://docs.lanonasis.com/openapi.yaml
- **Postman**: Import OpenAPI spec into Postman

### Issues
- Check browser console for errors
- Verify URL and parameters
- Test with cURL first
- Review OpenAPI spec for endpoint details

## Next Steps

1. **Try the Playground**: https://docs.lanonasis.com/api/playground
2. **Read Full Docs**: https://docs.lanonasis.com
3. **Integrate with Claude**: Add MCP endpoint to Claude Desktop
4. **Create Custom GPT**: Use OpenAPI spec for Custom Actions
5. **Build Integration**: Use REST API in your application

---

**Quick Links**:
- 🎮 [API Playground](https://docs.lanonasis.com/api/playground)
- 📖 [Full Documentation](https://docs.lanonasis.com)
- 🔧 [OpenAPI Spec](https://docs.lanonasis.com/openapi.yaml)
- 💬 [Support](https://docs.lanonasis.com)

