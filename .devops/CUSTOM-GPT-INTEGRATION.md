# Custom GPT Integration Guide

## Overview

This guide explains how to integrate LanOnasis documentation search into OpenAI Custom GPTs using Custom Actions with OpenAPI 3.1 specification.

## Architecture

```
Custom GPT → Custom Action → REST API (/api/search) → Documentation Search
```

## Prerequisites

1. OpenAI GPT Plus or Enterprise account
2. Access to Custom GPT creation
3. LanOnasis documentation API deployed at `https://docs.lanonasis.com`

## Step-by-Step Integration

### 1. Access OpenAPI Specification

The OpenAPI 3.1 specification is available at:
- **URL**: `https://docs.lanonasis.com/openapi.yaml`
- **Local File**: `/openapi.yaml` in the repository

### 2. Create Custom GPT

1. Go to [OpenAI GPT Builder](https://chat.openai.com/gpts)
2. Click **"Create"** or **"Edit"** on an existing GPT
3. Navigate to **"Actions"** section
4. Click **"Create new action"**

### 3. Configure Custom Action

#### Option A: Import from URL (Recommended)
1. Select **"Import from URL"**
2. Enter: `https://docs.lanonasis.com/openapi.yaml`
3. Click **"Import"**

#### Option B: Manual Configuration
1. Select **"Schema"** tab
2. Paste the OpenAPI specification from `openapi.yaml`
3. Verify the schema is valid

### 4. Action Configuration Details

**Authentication**: None required (public documentation search)

**Base URL**: `https://docs.lanonasis.com`

**Available Operations**:
- `GET /api/search` - Search documentation (query parameters)
- `POST /api/search` - Search documentation (JSON body)

### 5. Test the Integration

In your Custom GPT, try queries like:
- "Search the docs for memory service authentication"
- "Find information about API endpoints"
- "What guides are available for SDKs?"

The GPT will automatically call the search action when relevant.

## API Endpoint Details

### Endpoint: `/api/search`

**Methods**: GET, POST

**Parameters**:
- `query` (required): Search query string
- `section` (optional): Filter by `all`, `api`, `guides`, or `sdks` (default: `all`)
- `limit` (optional): Maximum results 1-50 (default: 10)

**Response Format**:
```json
{
  "success": true,
  "data": {
    "query": "memory service",
    "results": [
      {
        "title": "Documentation Page Title",
        "content": "Excerpt from the page...",
        "url": "https://docs.lanonasis.com/page-url",
        "relevance_score": 19,
        "section": "general",
        "type": "doc"
      }
    ],
    "total": 1,
    "metadata": {
      "section_filter": "all",
      "limit": 10,
      "search_timestamp": "2025-12-02T19:00:00.000Z"
    }
  }
}
```

## Example Custom GPT Instructions

Add these instructions to your Custom GPT for optimal behavior:

```
You are a helpful assistant with access to LanOnasis documentation.

When users ask about:
- API endpoints, features, or technical details
- Documentation, guides, or SDKs
- How to use LanOnasis services

Use the search_lanonasis_docs action to find relevant documentation.

Present results clearly:
1. Show the most relevant documentation pages
2. Include direct links to the full documentation
3. Summarize key information from the search results
4. If multiple results, prioritize by relevance_score

Always cite the source URL when referencing documentation.
```

## Troubleshooting

### Action Not Found
- Verify the OpenAPI spec URL is accessible: `https://docs.lanonasis.com/openapi.yaml`
- Check that the endpoint is deployed: `https://docs.lanonasis.com/api/search`

### Invalid Schema
- Ensure OpenAPI 3.1 format is used
- Validate the schema using [Swagger Editor](https://editor.swagger.io/)

### No Results Returned
- Check that the query parameter is provided
- Verify the documentation files exist in the `/docs` directory
- Review server logs for errors

### CORS Issues
- The endpoint includes CORS headers for cross-origin requests
- If issues persist, check Vercel deployment configuration

## Advanced Configuration

### Adding Authentication (Future)

If you need to add API key authentication:

1. Update `openapi.yaml`:
```yaml
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
security:
  - ApiKeyAuth: []
```

2. Update `/api/search.js` to validate API keys

3. Configure authentication in Custom GPT Actions settings

### Custom Response Formatting

Modify the response structure in `/api/search.js` to match your specific needs:

```javascript
// Custom response format
return res.status(200).json({
  // Your custom structure
});
```

## Monitoring

### Health Checks
- Test endpoint: `curl https://docs.lanonasis.com/api/search?q=test`
- Monitor Vercel deployment logs
- Track API usage in Vercel Analytics

### Performance
- Response time should be < 500ms
- Results are limited to 50 per request
- Search is performed on local file system (fast)

## Best Practices

1. **Query Optimization**: Use specific, descriptive queries
2. **Section Filtering**: Use `section` parameter to narrow results
3. **Result Limits**: Keep `limit` reasonable (10-20 for GPT responses)
4. **Error Handling**: GPT will handle API errors gracefully
5. **Caching**: Consider caching frequent queries if needed

## Support

For issues or questions:
- Check deployment logs in Vercel
- Review OpenAPI specification
- Test endpoint directly with curl
- Verify documentation files exist

---

**Last Updated**: December 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready

