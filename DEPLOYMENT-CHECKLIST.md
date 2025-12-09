# API Playground Deployment Checklist

## Pre-Deployment Verification

### ✅ Files Created/Modified
- [x] `src/pages/api/playground.tsx` - Main component
- [x] `src/pages/api/ApiPlayground.module.css` - Styles
- [x] `static/openapi.yaml` - OpenAPI spec (copied from root)
- [x] `docusaurus.config.ts` - Navigation link added
- [x] `package.json` - js-yaml dependency added
- [x] `.devops/API-PLAYGROUND-GUIDE.md` - Documentation
- [x] `.devops/QUICK-START.md` - Quick reference
- [x] `.devops/MCP-DEPLOYMENT-GUIDE.md` - Updated
- [x] `INTEGRATION-SUMMARY.md` - Summary
- [x] `test-playground.sh` - Test script

### ✅ Build Verification
- [x] Local build succeeds: `bun run build`
- [x] No TypeScript errors
- [x] No linter errors
- [x] Playground page generated: `build/api/playground/index.html`
- [x] OpenAPI spec copied: `build/openapi.yaml`
- [x] All locales build (en, es, fr, de)

### ✅ Dependencies
- [x] `js-yaml@3.14.2` installed
- [x] `clsx` available (already installed)
- [x] Docusaurus components available

## Deployment Steps

### 1. Commit Changes
```bash
cd apps/docs-lanonasis

git add .
git commit -m "feat: Add interactive API Playground

- Add playground component at /api/playground
- Copy OpenAPI spec to static/ for accessibility
- Add navigation link to navbar
- Install js-yaml for YAML parsing
- Add comprehensive documentation
- Add test script for verification

Features:
- Auto-loads OpenAPI spec
- Dynamic parameter inputs
- API key persistence
- Live request testing
- Response highlighting
- cURL generation
"
```

### 2. Push to Repository
```bash
git push origin main
```

### 3. Verify Vercel Deployment
- [ ] Check Vercel dashboard for deployment status
- [ ] Wait for build to complete
- [ ] Check for any build errors

### 4. Post-Deployment Testing

#### Test OpenAPI Spec
```bash
curl -I https://docs.lanonasis.com/openapi.yaml
# Expected: HTTP 200
```

#### Test Playground Page
```bash
curl -I https://docs.lanonasis.com/api/playground
# Expected: HTTP 200
```

#### Test Search API
```bash
curl "https://docs.lanonasis.com/api/search?query=api&limit=3"
# Expected: JSON response with results
```

#### Run Test Script
```bash
./test-playground.sh production
# Expected: All tests pass
```

### 5. Manual Browser Testing
- [ ] Navigate to https://docs.lanonasis.com/api/playground
- [ ] Verify OpenAPI spec loads (check browser console)
- [ ] Verify endpoints populate in dropdown
- [ ] Select `GET /api/search` endpoint
- [ ] Enter query: "memory service"
- [ ] Set limit: 5
- [ ] Click "Run Request"
- [ ] Verify response shows results
- [ ] Verify cURL command is generated
- [ ] Test API key persistence (enter key, reload page, verify it persists)

### 6. Cross-Browser Testing
- [ ] Chrome/Edge - Test playground functionality
- [ ] Firefox - Test playground functionality
- [ ] Safari - Test playground functionality

### 7. Integration Testing
- [ ] Test MCP endpoint still works
- [ ] Test REST API endpoint still works
- [ ] Test Custom GPT can access OpenAPI spec
- [ ] Test Claude Desktop MCP integration

## Post-Deployment Verification

### Health Checks
```bash
# Check all endpoints
curl -I https://docs.lanonasis.com
curl -I https://docs.lanonasis.com/api/playground
curl -I https://docs.lanonasis.com/openapi.yaml
curl -I https://docs.lanonasis.com/api/search
curl -I https://docs.lanonasis.com/api/mcp
```

### Functionality Checks
- [ ] Playground loads without errors
- [ ] OpenAPI spec is accessible
- [ ] Search API returns results
- [ ] MCP endpoint responds
- [ ] Navigation link works
- [ ] Theme styling is correct
- [ ] API key persistence works
- [ ] Response highlighting works
- [ ] cURL generation works

## Rollback Plan

If issues occur:

### Option 1: Quick Fix
```bash
# Fix the issue locally
git add .
git commit -m "fix: [description]"
git push origin main
```

### Option 2: Revert
```bash
# Revert the commit
git revert HEAD
git push origin main
```

### Option 3: Manual Rollback in Vercel
1. Go to Vercel dashboard
2. Find previous deployment
3. Click "Promote to Production"

## Success Criteria

All must pass:
- [ ] Playground accessible at `/api/playground`
- [ ] OpenAPI spec accessible at `/openapi.yaml`
- [ ] Search API returns valid results
- [ ] No console errors in browser
- [ ] Navigation link visible and working
- [ ] All endpoints populate in dropdown
- [ ] Parameters generate dynamically
- [ ] Requests execute successfully
- [ ] Responses display with syntax highlighting
- [ ] cURL commands generate correctly
- [ ] API key persists across page reloads
- [ ] Theme integration looks correct
- [ ] Mobile responsive (test on mobile device)

## Known Issues

### OpenAPI Schema Validation Warning (IDE)
- **Issue**: IDE shows "Unable to load schema from spec.openapis.org"
- **Impact**: None - this is a validation warning, not a functional error
- **Solution**: Ignore or disable schema validation in IDE settings

### Git Repository Warning (Vercel Build)
- **Issue**: "fatal: not a git repository" during Docusaurus build
- **Impact**: None - last update dates disabled in config
- **Solution**: Already handled by disabling `showLastUpdateTime` and `showLastUpdateAuthor`

## Documentation Updates

After successful deployment:
- [ ] Update README.md with playground link
- [ ] Update main documentation with playground reference
- [ ] Notify team about new feature
- [ ] Update API documentation with playground examples

## Monitoring

### First 24 Hours
- [ ] Monitor Vercel logs for errors
- [ ] Check analytics for playground usage
- [ ] Monitor API request patterns
- [ ] Check for any user-reported issues

### First Week
- [ ] Review playground usage metrics
- [ ] Collect user feedback
- [ ] Identify any missing features
- [ ] Plan improvements based on usage

## Next Steps After Deployment

### Immediate
1. Test all functionality in production
2. Update team documentation
3. Announce new feature to users
4. Monitor for issues

### Short Term (1-2 weeks)
1. Collect user feedback
2. Fix any reported issues
3. Add missing features if needed
4. Improve documentation based on feedback

### Long Term (1-3 months)
1. Add request history feature
2. Add response schema validation
3. Add save/load templates
4. Add export to Postman
5. Add WebSocket testing
6. Add authentication flows

## Support Resources

### Documentation
- [API Playground Guide](.devops/API-PLAYGROUND-GUIDE.md)
- [Quick Start](.devops/QUICK-START.md)
- [MCP Deployment Guide](.devops/MCP-DEPLOYMENT-GUIDE.md)
- [FAQ](.devops/FAQ.md)

### Testing
- Test script: `./test-playground.sh production`
- Manual testing: https://docs.lanonasis.com/api/playground
- OpenAPI spec: https://docs.lanonasis.com/openapi.yaml

### Troubleshooting
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify OpenAPI spec is valid
4. Test endpoints with cURL
5. Review documentation

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Status**: ⬜ Pending / ⬜ In Progress / ⬜ Complete / ⬜ Failed  
**Notes**: _____________

