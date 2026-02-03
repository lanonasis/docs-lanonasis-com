# LanOnasis Documentation Site

This documentation site is built using [Docusaurus 3.8](https://docusaurus.io/) with full [Nx](https://nx.dev/) integration and [Bun](https://bun.sh/) package management for the monorepo.

## 📋 Overview

A beautiful, searchable, and interactive documentation site for LanOnasis Memory Service platform - completely self-hosted with **ZERO external CDN dependencies** and full integration with the monorepo development workflow.

**Built with**: Docusaurus 3.8 + React 19 + TypeScript 5.9  
**Package Manager**: Bun 1.1+  
**Build System**: Nx 19+ (monorepo orchestration)  
**Deployment**: Self-hosted (no GitHub Pages required)

---

## 🚀 Quick Start

### Using Bun (Recommended)

```bash
# Install dependencies using Bun
bun install

# Start development server
bun run dev  # or: bun start

# Build for production
bun run build

# Validate documentation (links, endpoints, formats)
bun run validate  # or: bun run check:all
```

### Using Nx (Monorepo Integration)

```bash
# From workspace root
nx serve docs-lanonasis    # Start dev server
nx build docs-lanonasis    # Production build
nx lint docs-lanonasis     # Check links and formatting
```

### Using Traditional npm/yarn (Fallback)

```bash
# Install with npm
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 📖 Development Workflow

### Local Development

1. **Start the development server**:
   ```bash
   bun run dev
   ```
   - Hot reload enabled automatically
   - Server runs at `http://localhost:3000`
   - Changes reflected in real-time

2. **Edit documentation**:
   - Add/modify files in `docs/` directory
   - Markdown files with `.md` extension
   - Follow [Docusaurus documentation format](https://docusaurus.io/docs/markdown-features)
   - Use frontmatter for metadata (title, sidebar_label, description)

3. **View changes**:
   - Browser auto-refreshes
   - No restart needed for most changes
   - Cache clear if issues: `bun run clear`

### Adding New Documentation

**Structure**:
```
docs/
├── getting-started/          # Getting Started section
│   ├── installation.md
│   ├── quick-start.md
│   └── faq.md
├── memory/                   # Memory Service documentation
│   ├── overview.md
│   ├── cli.md
│   ├── sdk.md
│   └── rest-api.md
├── platform/                 # Platform services
│   ├── mcp-core.md
│   ├── onasis-core.md
│   ├── v-secure.md
│   ├── lanonasis-index.md
│   ├── control-room.md
│   └── mcp-lanonasis.md
└── sdks/                     # SDK documentation
    ├── overview.md
    ├── memory-sdk.md
    ├── ai-sdk.md
    └── [other SDKs]
```

**Template for new page**:
```markdown
---
title: Page Title
sidebar_label: Short Label
description: Brief description for SEO
---

# Page Title

[Content here]
```

---

## 🔗 Link Validation

Documentation must have valid links to maintain quality.

### Running Link Checks

```bash
# Check all links (internal and reachable external)
bun run check:links

# Validate all documentation (links + endpoints + formats)
bun run check:all

# Check documentation synchronization
bun run check:docs-sync

# Verify API endpoints are accessible
bun run check:endpoints
```

### Link Validation in CI/CD

- Automatic validation runs on every PR
- Checks internal links for correctness
- Verifies external links are reachable
- Fails build if broken links found
- GitHub Actions reports issues

### Fixing Broken Links

1. **Identify broken link**: Check CI/CD build output
2. **Fix in markdown**:
   ```markdown
   # Wrong
   [Click here](docs/sdks/overview)

   # Right
   [Click here](/sdks/overview)
   ```
3. **Test locally**: `bun run check:links`
4. **Push and verify in CI**: GitHub Actions validates

---

## 🏗️ Building for Production

### Development Build (Testing)

```bash
# Build without optimizations (for testing)
bun run build
```

### Production Build (Deployment)

```bash
# Build with optimizations
NODE_ENV=production bun run build

# Serve locally to test
bun run serve
```

### Build Output

- **Location**: `build/` directory
- **Format**: Static HTML + CSS + JavaScript
- **Size**: Optimized for production
- **Ready for**: Any static hosting service

---

## 🚢 Deployment

### Prerequisites

- Build succeeds locally: `bun run build`
- All link checks pass: `bun run check:links`
- Endpoints reachable: `bun run check:endpoints`

### Self-Hosted Deployment

#### Option 1: Docker

```bash
# Build Docker image
docker build -t lanonasis-docs:latest .

# Run container
docker run -p 80:3000 lanonasis-docs:latest

# Visit http://localhost
```

#### Option 2: Node.js/Bun Server

```bash
# Build production bundle
bun run build

# Start server
bun run serve

# Or use PM2 for production
pm2 start "bun run serve" --name docs-lanonasis
```

#### Option 3: Static Hosting

```bash
# Build static files
bun run build

# Copy to web server
cp -r build/* /var/www/docs.lanonasis.com/

# Configure nginx/apache to serve from this directory
```

### GitHub Actions CI/CD

Automated workflow on every push:
1. Install dependencies
2. Run link validation
3. Build documentation
4. Run endpoint checks
5. Deploy to production (if all checks pass)

---

## 🔧 Configuration

### Environment Variables

```bash
# Node.js environment
NODE_ENV=production          # production|development

# Documentation site
DOCUSAURUS_URL=https://docs.lanonasis.com
DOCUSAURUS_BASE_URL=/
DOCUSAURUS_LOGO_URL=/img/logo.svg

# Meilisearch (search functionality)
MEILISEARCH_HOST=https://search.lanonasis.com
MEILISEARCH_API_KEY=***

# API documentation
API_GATEWAY_URL=https://api.lanonasis.com
MCP_SERVER_URL=https://mcp.lanonasis.com
```

### Docusaurus Configuration

File: `docusaurus.config.ts`

**Key settings**:
- `url`: Production domain (https://docs.lanonasis.com)
- `baseUrl`: Path prefix (/ for root)
- `i18n`: Internationalization (currently English only)
- `onBrokenLinks`: Error handling (currently 'ignore')
- `editUrl`: GitHub edit link for pages

**Update Webpack config** (if using custom webpack):
```typescript
// Guard webpack config for Nx compatibility
const isNxBuild = process.env.NX_BUILD === 'true';

module.exports = {
  // ... other config
  webpack: isNxBuild ? undefined : {
    configure: (config) => {
      // Custom webpack only in non-Nx builds
      return config;
    }
  },
  // ... rest of config
}
```

---

## 🧪 Testing & Validation

### Run All Checks

```bash
# Complete validation suite
bun run check:all
```

This runs:
1. **Link validation** (`check:links`) - Verify all links are valid
2. **Endpoint checks** (`check:endpoints`) - Verify API endpoints are reachable
3. **Documentation sync** (`check:docs-sync`) - Verify OpenAPI specs are synchronized

### Individual Checks

```bash
# Check links only
bun run check:links

# Check API endpoints only
bun run check:endpoints

# Check documentation sync only
bun run check:docs-sync

# Generate OpenAPI documentation
bun run generate:openapi-json

# Generate API documentation from specs
bun run generate:api-docs

# Generate complete documentation
bun run generate:complete-docs
```

### Pre-commit Validation

Recommended pre-commit hook:
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run link validation before commit
bun run check:links || exit 1

# Run endpoint checks
bun run check:endpoints || exit 1
```

---

## 📚 Monorepo Integration (Nx)

### Commands

```bash
# Serve documentation (dev server)
nx serve docs-lanonasis

# Build documentation
nx build docs-lanonasis

# Lint and check
nx lint docs-lanonasis

# Run custom targets (if defined)
nx run docs-lanonasis:validate   # Link validation
nx run docs-lanonasis:smoke      # Smoke tests (Phase 4)
```

### Watch Mode

```bash
# Watch for changes and rebuild
nx build docs-lanonasis --watch

# Watch and serve
nx serve docs-lanonasis --watch
```

### Nx Configuration

File: `nx.json` (in monorepo root)

```json
{
  "projects": {
    "docs-lanonasis": {
      "targets": {
        "serve": { "command": "bun run start" },
        "build": { "command": "bun run build" },
        "lint": { "command": "bun run check:all" }
      }
    }
  }
}
```

---

## 🔍 Troubleshooting

### Build Issues

**Error: "Cannot find module 'js-yaml'"**
- Solution: Run `bun install` to ensure all dependencies installed
- Verify: `node_modules/js-yaml` exists

**Error: "Webpack configuration error"**
- Cause: Custom webpack config conflicts with Nx
- Solution: Ensure webpack config is guarded (see Configuration section)
- Fallback: Use Docusaurus default webpack

**Error: "Port 3000 already in use"**
```bash
# Start on different port
bun run dev -- --port 3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Documentation Issues

**Links not working**
- Run `bun run check:links` to identify broken links
- Check link format: `/path/to/page` not `docs/path/to/page`
- Verify page exists in `docs/` directory

**Hot reload not working**
- Clear cache: `bun run clear`
- Restart dev server: Stop and run `bun run dev` again
- Check file was saved properly

**Search not working**
- Verify Meilisearch is running: `curl $MEILISEARCH_HOST/health`
- Rebuild search index: `bun run build`
- Check API key in `.env` file

### Locale/Translation Issues

**Non-English locales showing empty content**
- Translations not available - remove locale
- Edit `docusaurus.config.ts`:
  ```typescript
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],  // Remove other locales
  }
  ```
- Delete translation files: `locales/es.json`, `locales/fr.json`, etc.

---

## 📖 Documentation Standards

### Code Examples

All code examples should be:
- ✅ Runnable (copy-paste ready)
- ✅ Tested in CI/CD
- ✅ Up-to-date with latest API versions
- ✅ Include error handling
- ✅ Have explanatory comments

Example:
```typescript
// ✅ Good: Complete, working example
import { MemorySDK } from '@lanonasis/memory-sdk';

const sdk = new MemorySDK({
  apiKey: process.env.LANONASIS_API_KEY,
});

try {
  const memories = await sdk.memory.search({
    query: 'important decision',
    limit: 10,
  });
  console.log(`Found ${memories.length} memories`);
} catch (error) {
  console.error('Search failed:', error);
}
```

### Internal Links

Format: Always use absolute paths starting with `/`

```markdown
# ✅ Good
See [Memory SDK documentation](/sdks/memory-sdk)
Learn about [v-secure](/platform/v-secure)

# ❌ Bad
See [Memory SDK documentation](../../sdks/memory-sdk)
Learn about [v-secure](./v-secure)
```

### External Links

Include `https://` and test reachability:

```markdown
# ✅ Good
Visit [GitHub repository](https://github.com/lanonasis/memory-sdk)

# ❌ Bad
Visit our [repo](github.com/lanonasis/memory-sdk)
```

---

## 📊 Site Statistics

- **Documentation Pages**: 32+ comprehensive pages
- **Code Examples**: 160+ runnable examples
- **Supported Languages**: TypeScript, Python, JavaScript, SQL, Bash
- **Build Time**: ~2-3 seconds
- **Typical Deploy Time**: <5 seconds
- **Search Indexing**: Automated on build

---

## 🤝 Contributing

### Before Submitting PR

1. Run all validations: `bun run check:all`
2. Test locally: `bun run dev`
3. Build production: `bun run build`
4. Validate links: `bun run check:links`
5. Check endpoints: `bun run check:endpoints`

### PR Checklist

- [ ] Documentation builds without errors
- [ ] All links are valid (internal and external)
- [ ] Code examples are tested and working
- [ ] No broken images or assets
- [ ] Spelling and grammar checked
- [ ] Follows documentation standards (section above)

---

## 📞 Support & Resources

**Repository**: [lanonasis/docs-lanonasis-com](https://github.com/lanonasis/docs-lanonasis-com)  
**Issues**: [GitHub Issues](https://github.com/lanonasis/docs-lanonasis-com/issues)  
**Documentation**: [docs.lanonasis.com](https://docs.lanonasis.com)  
**API Reference**: [api.lanonasis.com](https://api.lanonasis.com)  
**Status Page**: [status.lanonasis.com](https://status.lanonasis.com)

---

## 📄 License

LanOnasis Documentation is licensed under MIT. See LICENSE file for details.

---

**Last Updated**: February 3, 2026  
**Docusaurus Version**: 3.8+  
**Node Version**: 18+  
**Bun Version**: 1.1+  
**Nx Version**: 19+
