# API Playground Integration Guide

## Overview

The API Playground is an interactive tool that allows users to test LanOnasis API endpoints directly from the documentation site. It automatically loads your OpenAPI specification and generates a dynamic form for testing endpoints.

## Features

✅ **Auto-loads OpenAPI Spec** - Reads from `/openapi.yaml` or `/openapi.json`  
✅ **Dynamic Parameter Inputs** - Generates forms for path, query, and body parameters  
✅ **API Key Persistence** - Stores API key in localStorage for convenience  
✅ **Live Request Testing** - Execute requests directly from the docs  
✅ **Response Highlighting** - JSON syntax highlighting for responses  
✅ **cURL Generation** - Shows equivalent cURL command for each request  
✅ **Theme Integration** - Uses Docusaurus theme variables for consistent styling

## File Structure

```
apps/docs-lanonasis/
├── src/pages/api/
│   ├── playground.tsx              # Main playground component
│   └── ApiPlayground.module.css    # Styles using Docusaurus theme variables
├── static/
│   └── openapi.yaml                # OpenAPI 3.1 specification (auto-copied to build)
└── docusaurus.config.ts            # Navigation link added
```

## How It Works

### 1. OpenAPI Spec Loading

The playground attempts to load the OpenAPI specification from multiple locations:

```typescript
const candidateUrls = ['/openapi.json', '/openapi.yaml', '/openapi.yml'];
```

It automatically detects the format (JSON or YAML) and parses accordingly.

### 2. Endpoint Extraction

The component extracts all endpoints from the OpenAPI spec:

- **Path parameters** - Extracted from `{param}` in URL paths
- **Query parameters** - From `parameters` array with `in: 'query'`
- **Request body** - From `requestBody.content['application/json']`
- **Examples** - Uses `example` or `examples` from the spec for default values

### 3. Request Execution

When you click "Run Request":

1. Substitutes path parameters into the URL
2. Builds query string from query parameters
3. Adds `Authorization: Bearer <api-key>` header if API key is provided
4. Parses and sends JSON request body
5. Displays formatted response with syntax highlighting
6. Generates equivalent cURL command

### 4. API Key Persistence

API keys are stored in `localStorage` under the key `apiKey`:

```typescript
localStorage.setItem('apiKey', key);
```

This persists across page reloads but is scoped to the domain.

## Usage

### Accessing the Playground

Navigate to:
- **Local**: `http://localhost:3000/api/playground`
- **Production**: `https://docs.lanonasis.com/api/playground`

### Testing an Endpoint

1. **Select Endpoint** - Choose from the dropdown (e.g., `GET /api/search`)
2. **Fill Parameters** - Enter required path/query parameters
3. **Add Request Body** - For POST/PUT requests, edit the JSON body
4. **Set API Key** - Enter your Bearer token (optional, depending on endpoint)
5. **Run Request** - Click "Run Request" button
6. **View Response** - See formatted JSON response and cURL command

### Example: Testing the Search Endpoint

```
1. Select: GET /api/search
2. Parameters:
   - query: "memory service"
   - section: "all"
   - limit: 10
3. Click "Run Request"
4. Response shows matching documentation pages
5. cURL command shows equivalent terminal command
```

## Integration with Custom GPT

The playground uses the same OpenAPI spec as Custom GPT Actions:

- **OpenAPI Spec**: `/openapi.yaml`
- **REST Endpoint**: `/api/search`
- **Format**: JSON (not SSE)

This ensures consistency between:
- Interactive playground testing
- Custom GPT Actions
- REST API clients

## Development

### Local Testing

```bash
cd apps/docs-lanonasis
bun run start
# Navigate to http://localhost:3000/api/playground
```

### Building

```bash
bun run build
# Playground is built to build/api/playground/index.html
# OpenAPI spec is copied to build/openapi.yaml
```

### Deployment

The playground is automatically deployed with the docs site:

1. Build process copies `openapi.yaml` to `static/` directory
2. Vercel serves static files from `build/` directory
3. Playground loads spec from `/openapi.yaml`
4. No additional configuration needed

## Customization

### Styling

Edit `src/pages/api/ApiPlayground.module.css` to customize:

```css
.formGroup {
  margin-bottom: var(--ifm-spacing-vertical);
}

.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--ifm-color-emphasis-300);
  /* Uses Docusaurus theme variables */
}
```

### Adding New Endpoints

Simply update `openapi.yaml`:

```yaml
paths:
  /api/new-endpoint:
    get:
      summary: New endpoint
      parameters:
        - name: param1
          in: query
          required: true
          schema:
            type: string
```

The playground automatically picks up new endpoints on next page load.

### Custom Base URL

The playground reads the base URL from the OpenAPI spec:

```yaml
servers:
  - url: https://docs.lanonasis.com
    description: Production server
```

For local testing, you can add a development server:

```yaml
servers:
  - url: http://localhost:3000
    description: Local development
  - url: https://docs.lanonasis.com
    description: Production server
```

The playground uses the first server in the list.

## Troubleshooting

### OpenAPI spec not loading

**Symptom**: "Loading API specification..." never completes

**Solutions**:
1. Verify `openapi.yaml` exists in `static/` directory
2. Check browser console for fetch errors
3. Ensure file is valid YAML/JSON (use online validator)
4. Check file permissions (should be readable)

### Parameters not showing

**Symptom**: Endpoint selected but no parameter inputs appear

**Solutions**:
1. Verify `parameters` array in OpenAPI spec
2. Check parameter `in` field is `path`, `query`, or `header`
3. Ensure `schema` is defined for each parameter

### Request fails with CORS error

**Symptom**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions**:
1. For local testing, use same origin (localhost:3000)
2. For production, ensure API server allows docs.lanonasis.com origin
3. Check API server CORS configuration

### API key not persisting

**Symptom**: API key disappears on page reload

**Solutions**:
1. Check browser localStorage is enabled
2. Verify not in private/incognito mode
3. Check browser console for localStorage errors

## Security Considerations

### API Key Storage

⚠️ **Warning**: API keys are stored in browser localStorage, which is:
- Accessible to JavaScript on the same domain
- Not encrypted
- Persists until manually cleared

**Best Practices**:
1. Use test/development API keys only
2. Never use production keys in the playground
3. Implement API key rotation
4. Consider using short-lived tokens

### Request Logging

All requests are logged in browser DevTools:
- Network tab shows all requests
- Console may show errors
- Response data is visible in browser

**Recommendation**: Don't use the playground with sensitive data.

## Future Enhancements

Potential improvements:

- [ ] Add response schema validation
- [ ] Support for file uploads
- [ ] Request history (last 10 requests)
- [ ] Save/load request templates
- [ ] Export as Postman collection
- [ ] WebSocket endpoint testing
- [ ] Authentication flow testing (OAuth, etc.)
- [ ] Rate limiting indicators
- [ ] Response time metrics

## Related Documentation

- [MCP Deployment Guide](.devops/MCP-DEPLOYMENT-GUIDE.md)
- [Custom GPT Integration](.devops/CUSTOM-GPT-INTEGRATION.md)
- [API Endpoints Summary](.devops/API-ENDPOINTS-SUMMARY.md)
- [FAQ](.devops/FAQ.md)

## Support

For issues or questions:
- Check the [FAQ](.devops/FAQ.md)
- Review browser console for errors
- Verify OpenAPI spec is valid
- Test endpoint directly with cURL

## Changelog

### v1.0.0 (2024-12-09)
- Initial release
- OpenAPI 3.1 support
- Dynamic parameter generation
- API key persistence
- cURL generation
- Theme integration

