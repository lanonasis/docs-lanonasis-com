#!/bin/bash

# MCP Deployment Quick Commands
# Usage: chmod +x .devops/mcp-deploy.sh && .devops/mcp-deploy.sh [command]

set -e

case "$1" in
  "dev-test")
    echo "🧪 Testing MCP in dev environment..."
    npm run build
    npx vercel dev --port 3002 &
    echo "✅ Dev server started on http://localhost:3002"
    echo "Test MCP at: http://localhost:3002/api/mcp"
    ;;

  "dev-deploy")
    echo "🚀 Deploying to dev branch..."
    git checkout dev 2>/dev/null || git checkout -b dev
    git add .
    git commit -m "MCP updates - $(date)"
    npx vercel --prod
    echo "✅ Dev deployment complete with auth protection"
    ;;

  "prod-deploy")
    echo "🏗️ Deploying to production..."
    echo "Switching to main branch..."
    git checkout main
    echo "Merging dev branch..."
    git merge dev
    echo "Pushing to main..."
    git push origin main
    echo "✅ Production deployment triggered"
    echo "Monitor at: https://vercel.com/dashboard"
    ;;

  "test-mcp")
    if [ -z "$2" ]; then
      URL="https://docs.lanonasis.com/api/mcp"
    else
      URL="$2"
    fi
    echo "🔍 Testing MCP endpoint at: $URL"
    curl -X POST "$URL" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json, text/event-stream" \
      -d '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
          "protocolVersion": "2024-11-05",
          "capabilities": {},
          "clientInfo": {"name": "test-script", "version": "1.0"}
        }
      }'
    ;;

  "rollback")
    echo "🔄 Rolling back main branch..."
    git checkout main
    git revert HEAD --no-edit
    git push origin main
    echo "✅ Rollback deployed"
    ;;

  "status")
    echo "📊 Deployment Status:"
    echo "Current branch: $(git branch --show-current)"
    echo "Last commit: $(git log -1 --oneline)"
    echo "Vercel deployments:"
    npx vercel list
    ;;

  "clean")
    echo "🧹 Cleaning up large files..."
    find static/img -name "*.svg" -size +1M -delete
    find . -name "*.ts" -path "./api/*" -delete
    echo "✅ Cleanup complete"
    ;;

  *)
    echo "🔧 MCP Deployment Tools"
    echo ""
    echo "Usage: .devops/mcp-deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev-test      - Test MCP locally with vercel dev"
    echo "  dev-deploy    - Deploy to dev branch (with auth)"
    echo "  prod-deploy   - Deploy dev to production (main)"
    echo "  test-mcp      - Test MCP endpoint [url]"
    echo "  rollback      - Rollback last production deploy"
    echo "  status        - Check deployment status"
    echo "  clean         - Clean up large files"
    echo ""
    echo "Example workflow:"
    echo "  .devops/mcp-deploy.sh dev-test"
    echo "  .devops/mcp-deploy.sh dev-deploy"
    echo "  .devops/mcp-deploy.sh test-mcp"
    echo "  .devops/mcp-deploy.sh prod-deploy"
    ;;
esac