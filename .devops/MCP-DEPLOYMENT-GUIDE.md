# MCP Deployment Strategy Guide

## Overview
This guide documents the deployment strategy used to rapidly deploy our LanOnasis MCP (Model Context Protocol) endpoint while maintaining stable documentation service. This "live fast deployment" approach allows us to get new features live ASAP while other deployments are ongoing.

## The Challenge
- Need to deploy MCP functionality quickly
- Avoid breaking existing documentation site
- Handle deployment failures gracefully
- Maintain zero-downtime service

## The Solution: Multi-Branch Deployment Strategy

### 1. Development Branch (`dev`)
- **Purpose**: Safe development and testing environment
- **Features**: Full development protection (auth enabled)
- **Usage**: Test all changes before production

### 2. Production Branch (`main`)
- **Purpose**: Live production deployments
- **Features**: Custom domain, no auth protection
- **Usage**: Only merge tested, working code

## Step-by-Step Deployment Process

### Phase 1: Rapid Development (Dev Branch)
```bash
# 1. Create and switch to dev branch
git checkout -b dev

# 2. Develop MCP functionality
# - Create /api/mcp.js endpoint
# - Implement LanOnasis docs search
# - Add brand assets and fix broken references

# 3. Test locally first
npm run build  # Ensure build works
npx vercel dev --port 3002  # Test Vercel environment

# 4. Deploy to dev for testing
npx vercel --prod
# Result: Protected preview URL with auth
```

### Phase 2: Production Deployment (Main Branch)
```bash
# 1. Switch to main branch
git checkout main

# 2. Merge tested dev branch
git merge dev

# 3. Push to trigger automatic deployment
git push origin main
# Result: Live on custom domain without auth protection
```

## Key Technical Details

### MCP Endpoint Structure
```javascript
// File: /api/mcp.js
// Vercel serverless function that implements MCP protocol

module.exports = async function handler(req, res) {
  // Handle MCP initialization, tool listing, and tool calls
  // Search LanOnasis documentation
  // Return proper MCP protocol responses
}
```

### Critical Files to Protect
1. **`/api/mcp.js`** - Core MCP functionality
2. **`/static/img/logo_single_export/`** - Brand assets
3. **`vercel.json`** - Deployment configuration
4. **`docusaurus.config.ts`** - Site configuration

### Common Pitfalls and Solutions

#### 1. TypeScript vs JavaScript in Vercel Functions
**Problem**: TypeScript files fail in Vercel with missing dependencies
**Solution**: Use JavaScript for API routes, convert TS to JS

```bash
# Fix: Convert TypeScript to JavaScript
mv api/mcp.ts api/mcp.js
# Remove TypeScript syntax
# Use CommonJS exports: module.exports
```

#### 2. Missing Image References
**Problem**: Build fails with "Cannot resolve image" errors
**Solution**: Replace broken references with existing brand assets

```bash
# Find broken references
grep -r "docusaurus.png" docs/

# Replace with LanOnasis assets
# Example: /img/logo_single_export/png_white_bg/logo_256x256.png
```

#### 3. Large File Deployment Issues
**Problem**: Deployment fails due to file size limits
**Solution**: Remove large unnecessary files before deployment

```bash
# Clean up before deployment
rm api/mcp.ts  # Remove redundant files
# Git will skip large files automatically
```

## Deployment Authentication Matrix

| Branch | Environment | Auth Protection | Custom Domain | Use Case |
|--------|------------|----------------|---------------|----------|
| `dev` | Preview | ✅ Enabled | ❌ No | Testing |
| `main` | Production | ❌ Disabled | ✅ Yes | Live Service |

## Emergency Rollback Procedure

If a deployment fails:

1. **Immediate**: Previous deployment remains live (zero downtime)
2. **Quick Fix**: Fix issues in dev branch, test, then merge
3. **Nuclear Option**: Revert main branch to last working commit

```bash
# Revert to last working state
git revert HEAD  # Revert last commit
git push origin main  # Trigger new deployment
```

## MCP Integration for Claude Desktop

Once deployed, add to Claude Desktop configuration:

```json
{
  "LanOnasis Documentation": {
    "url": "https://docs.lanonasis.com/api/mcp",
    "type": "http"
  }
}
```

## Testing the MCP Endpoint

```bash
# Test MCP initialization
curl -X POST https://docs.lanonasis.com/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {"name": "test", "version": "1.0"}
    }
  }'
```

## Future Development Guidelines

### DO's ✅
- Always develop in `dev` branch first
- Test builds locally before pushing
- Use JavaScript for Vercel API routes
- Keep image references relative to brand assets
- Commit frequently with descriptive messages

### DON'Ts ❌
- Never push untested code to `main`
- Don't use TypeScript in `/api/` folder
- Don't reference non-existent images
- Don't commit large files (>1MB) without need
- Don't break existing MCP endpoint structure

## Monitoring and Maintenance

### Health Checks
- Monitor deployment status in Vercel dashboard
- Test MCP endpoint after each deployment
- Verify Claude Desktop integration works

### Performance Optimization
- Keep API responses under 32KB
- Cache documentation search results
- Optimize image sizes in brand assets

## Success Metrics

This deployment strategy achieved:
- **Zero downtime** during MCP feature addition
- **Rapid deployment** (under 5 minutes from dev to live)
- **Safe testing** environment before production
- **Graceful failure handling** with automatic rollback

## Contact and Support

For questions about this deployment strategy:
- Review this guide first
- Check Vercel deployment logs
- Test in dev branch before main
- Document any new patterns discovered

---

**Last Updated**: September 2025
**Strategy Version**: 1.0
**Deployment Status**: ✅ Production Ready