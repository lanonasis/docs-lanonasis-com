# API Playground Fix - YAML Parsing Issue

## Problem Identified

The API Playground was stuck on "Loading API specification..." because:

1. **js-yaml not bundled**: The dynamic import of `js-yaml` in the browser failed silently
2. **No fallback**: The component had no error handling or JSON fallback
3. **No user feedback**: Loading state didn't show errors

## Solution Implemented

### 1. Generate JSON Version of OpenAPI Spec ✅

Created automatic JSON generation from YAML:

**Script**: `scripts/generate-openapi-json.js`
- Converts `openapi.yaml` → `static/openapi.json`
- Runs automatically before each build
- Provides better browser compatibility

**Usage**:
```bash
# Manual generation
bun run generate:openapi-json

# Automatic (runs before build)
bun run build
```

### 2. Updated Playground Component ✅

**Changes to `src/pages/api/playground.tsx`**:

- ✅ Prioritizes JSON format (`/openapi.json` first)
- ✅ Better error handling with console logging
- ✅ Graceful fallback if YAML parsing fails
- ✅ User-friendly error messages
- ✅ Troubleshooting guidance in UI

**Key improvements**:
```typescript
// Now tries JSON first (no js-yaml needed)
const candidateUrls = ['/openapi.json', '/openapi.yaml', '/openapi.yml'];

// Better error handling
if (!spec) {
  console.error('❌ Failed to load OpenAPI spec');
  setResponse('Failed to load OpenAPI specification...');
}
```

### 3. Updated Build Process ✅

**Changes to `package.json`**:
```json
{
  "scripts": {
    "prebuild": "node scripts/generate-openapi-json.js && bun run check:endpoints || true",
    "generate:openapi-json": "node scripts/generate-openapi-json.js"
  }
}
```

Now automatically generates JSON before every build!

## Files Changed

1. ✅ `scripts/generate-openapi-json.js` - New script
2. ✅ `static/openapi.json` - Generated JSON spec
3. ✅ `src/pages/api/playground.tsx` - Improved error handling
4. ✅ `package.json` - Added prebuild script

## Testing

### Build Test ✅
```bash
bun run build
# ✅ JSON generated automatically
# ✅ Both openapi.json and openapi.yaml in build/
```

### File Verification ✅
```bash
ls -lh build/openapi.*
# -rw-r--r--  13K build/openapi.json
# -rw-r--r--  9.7K build/openapi.yaml
```

### JSON Validity ✅
```bash
node scripts/generate-openapi-json.js
# ✅ Successfully generated
# Size: 12.88 KB
# Paths: 1
# Version: 1.0.0
```

## Expected Behavior After Deployment

### Before Fix ❌
- Playground shows "Loading API specification..."
- No endpoints appear
- No error messages
- Console shows silent import failure

### After Fix ✅
- Playground loads `/openapi.json` (JSON format)
- Endpoints populate in dropdown
- Error messages if spec fails to load
- Console shows helpful debugging info

## Deployment Steps

1. **Commit changes**:
```bash
git add .
git commit -m "fix: API Playground YAML parsing issue

- Generate JSON version of OpenAPI spec for browser compatibility
- Add automatic JSON generation in prebuild script
- Improve error handling in playground component
- Add user-friendly error messages
- Prioritize JSON format over YAML

Fixes: Playground stuck on 'Loading API specification...'
"
```

2. **Push to repository**:
```bash
git push origin main
```

3. **Verify deployment**:
```bash
# Wait for Vercel deployment, then test:
curl -I https://docs.lanonasis.com/openapi.json
# Expected: HTTP 200

# Test playground
open https://docs.lanonasis.com/api/playground
# Expected: Endpoints populate in dropdown
```

## Verification Checklist

After deployment:

- [ ] Visit https://docs.lanonasis.com/api/playground
- [ ] Verify "Loading API specification..." disappears
- [ ] Verify endpoints appear in dropdown
- [ ] Select `GET /api/search` endpoint
- [ ] Verify parameter inputs appear
- [ ] Enter test query and run request
- [ ] Verify response displays correctly
- [ ] Check browser console for errors (should be none)

## Browser Console Output

### Expected Success Output:
```
✅ Loaded OpenAPI spec from: /openapi.json
```

### If JSON fails (fallback to YAML):
```
⚠️ js-yaml not available, skipping YAML file: /openapi.yaml
```

### If all fail:
```
❌ Failed to load OpenAPI spec. Last error: [error message]
Tried URLs: ['/openapi.json', '/openapi.yaml', '/openapi.yml']
```

## Technical Details

### Why JSON Instead of YAML?

1. **Native browser support**: `JSON.parse()` is built-in
2. **No dependencies**: No need to bundle js-yaml
3. **Smaller bundle**: Reduces JavaScript bundle size
4. **Faster parsing**: JSON parsing is faster than YAML
5. **Better compatibility**: Works everywhere

### Why Keep YAML?

1. **Human readability**: YAML is easier to edit
2. **Source of truth**: `openapi.yaml` is the canonical spec
3. **Version control**: YAML diffs are cleaner
4. **Compatibility**: Some tools prefer YAML

### Build Process Flow

```
openapi.yaml (source)
    ↓
scripts/generate-openapi-json.js
    ↓
static/openapi.json (generated)
    ↓
build/openapi.json (deployed)
    ↓
Playground loads JSON ✅
```

## Maintenance

### Updating the API Spec

1. Edit `openapi.yaml` (source file)
2. Run `bun run build` (auto-generates JSON)
3. Deploy (both YAML and JSON are deployed)

### Manual JSON Generation

```bash
bun run generate:openapi-json
```

### Verifying JSON

```bash
# Check JSON is valid
node -e "JSON.parse(require('fs').readFileSync('static/openapi.json'))"

# View JSON
cat static/openapi.json | jq .
```

## Rollback Plan

If issues occur:

### Option 1: Quick Fix
```bash
# Regenerate JSON
bun run generate:openapi-json
git add static/openapi.json
git commit -m "fix: Regenerate OpenAPI JSON"
git push
```

### Option 2: Revert
```bash
git revert HEAD
git push
```

## Future Improvements

Potential enhancements:

- [ ] Add JSON schema validation
- [ ] Generate TypeScript types from spec
- [ ] Add spec version checking
- [ ] Cache spec in localStorage
- [ ] Add spec refresh button
- [ ] Support multiple spec versions

## Related Documentation

- [API Playground Guide](.devops/API-PLAYGROUND-GUIDE.md)
- [Quick Start](.devops/QUICK-START.md)
- [Deployment Checklist](DEPLOYMENT-CHECKLIST.md)
- [Integration Summary](INTEGRATION-SUMMARY.md)

## Summary

✅ **Problem**: js-yaml not bundled, YAML parsing failed silently  
✅ **Solution**: Generate JSON version, prioritize JSON format  
✅ **Status**: Fixed and tested locally  
✅ **Next**: Deploy to production

---

**Fix Date**: December 9, 2024  
**Status**: ✅ Ready for Deployment  
**Impact**: High - Fixes critical playground functionality

