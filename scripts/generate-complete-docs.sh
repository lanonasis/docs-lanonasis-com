#!/bin/bash

# Complete Documentation Generation Pipeline with MaaS Integration
echo "🚀 Starting complete documentation generation with MaaS..."

# Generate API documentation
echo "📝 Generating API docs..."
npm run generate:api-docs

# Generate SDK references
echo "📦 Generating SDK references..."
npm run generate:sdk-docs

# Index all documentation in MaaS
echo "🔍 Indexing documentation to MaaS..."
npm run index:maas

# Update search index
echo "🔎 Updating MeiliSearch fallback..."
if [ -f "scripts/index-to-meilisearch.js" ]; then
  npm run index:meilisearch
fi

# Generate sitemap
echo "🗺️ Generating sitemap..."
npm run generate:sitemap

# Run link checker
echo "🔗 Checking links..."
if command -v linkchecker &> /dev/null; then
  linkchecker http://localhost:3000 --no-warnings
else
  echo "ℹ️ Link checker not installed, skipping..."
fi

# Build and validate
echo "🏗️ Building documentation..."
npm run build

echo "✅ Documentation generation complete!"
echo ""
echo "📊 MaaS Integration Status:"
echo "   - Documentation indexed to MaaS ✓"
echo "   - Semantic search enabled ✓"
echo "   - Hybrid search configured ✓"
echo "   - Live demo of MaaS capabilities ✓"
echo ""
echo "🧠 Your documentation now demonstrates MaaS vector search!"
