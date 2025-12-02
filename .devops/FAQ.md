# Frequently Asked Questions

## OpenAPI Schema Validation Error

**Q: IDE shows error "Unable to load schema from 'https://spec.openapis.org/oas/3.1/schema/2022-10-07'"**

**A:** This is a harmless IDE validation warning. The IDE is trying to fetch the OpenAPI schema for validation, but it's not required for functionality.

**Solutions:**
1. **Ignore it** - The OpenAPI spec will work fine without schema validation
2. **Disable schema validation** in your IDE settings (if it's causing issues)
3. **Use offline validation** - The spec is valid OpenAPI 3.1 without external schema references

The error does NOT affect:
- API functionality
- Custom GPT integration
- Deployment
- Endpoint accessibility

## Automatic Updates

**Q: Will the OpenAPI automatically pick up updates and future inclusions in the docs platform automatically, just like the MCP setup?**

**A:** **Partially automatic** - Here's how it works:

### ✅ **Automatic (No Updates Needed)**
- **New documentation pages**: When you add new `.md` or `.mdx` files to the `/docs` directory, they are **automatically searchable** through both endpoints without any code changes
- **Content updates**: When you update existing documentation files, the search results automatically reflect the new content
- **File system changes**: The search function reads directly from the `/docs` directory at runtime, so all changes are immediately available

### ⚠️ **Manual Updates Required**
- **API structure changes**: If you add new parameters, change response structure, or modify the API contract, you'll need to update:
  - `/api/search.js` - The endpoint implementation
  - `/openapi.yaml` - The OpenAPI specification
- **New response fields**: If you add new fields to search results, update the OpenAPI schema
- **New endpoints**: If you create new API endpoints, add them to the OpenAPI spec

### Example Scenarios

**Scenario 1: Adding New Documentation** ✅ Automatic
```bash
# Add new file
echo "# New Feature" > docs/features/new-feature.md

# Immediately searchable via:
# - MCP endpoint: /api/mcp
# - REST endpoint: /api/search
# No code changes needed!
```

**Scenario 2: Adding New Search Parameter** ⚠️ Manual Update Required
```javascript
// Need to update:
// 1. /api/search.js - Add parameter handling
// 2. /openapi.yaml - Add parameter to schema
```

**Scenario 3: Changing Response Structure** ⚠️ Manual Update Required
```javascript
// Need to update:
// 1. /api/search.js - Modify response format
// 2. /openapi.yaml - Update response schema
```

## Vercel Configuration

**Q: Do I need to update any Vercel config to make the endpoint accessible?**

**A:** **No additional configuration needed!** Vercel automatically handles API routes.

### How Vercel Works
- **Automatic routing**: Any file in the `/api` directory is automatically exposed as a serverless function
- **File mapping**: `/api/search.js` → accessible at `/api/search` (without `.js` extension)
- **No config needed**: The current `vercel.json` is sufficient

### Current Setup ✅
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "build",
  "framework": "docusaurus",
  "installCommand": "bun install",
  "devCommand": "bun run start",
  "public": false
}
```

This configuration is correct. Vercel will:
1. Build the Docusaurus site
2. Automatically detect `/api/*.js` files as serverless functions
3. Make them accessible at `/api/*` routes

### Verification
After deployment, test:
```bash
# Should work automatically
curl https://docs.lanonasis.com/api/search?q=test
curl https://docs.lanonasis.com/api/mcp
```

### If Endpoints Don't Work
1. **Check file location**: Ensure files are in `/api/` directory
2. **Check file extension**: Must be `.js` (not `.ts`)
3. **Check exports**: Must use `module.exports = async function handler(req, res)`
4. **Check deployment logs**: Look for errors in Vercel dashboard

## Path Correction

**Important**: The OpenAPI spec path should be `/api/search` (not `/api/search.js`)

- **File location**: `/api/search.js` (with `.js`)
- **URL endpoint**: `/api/search` (without `.js`)
- **OpenAPI path**: `/api/search` (matches URL, not file)

Vercel automatically strips the `.js` extension from routes.

---

**Last Updated**: December 2025

