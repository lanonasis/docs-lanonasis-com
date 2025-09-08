#!/bin/bash

# Self-Hosted Documentation Stack Health Monitor

echo "🔍 Checking Documentation Stack Health..."
echo "=========================================="
echo ""

# Check Docusaurus
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Documentation Site: Running"
else
  echo "❌ Documentation Site: Down"
fi

# Check MeiliSearch
if curl -s http://localhost:7700/health 2>/dev/null | grep -q '"status":"available"'; then
  echo "✅ Search Engine: Healthy"
else
  echo "❌ Search Engine: Issues or Not Running"
fi

# Check Plausible Analytics
if curl -s http://localhost:8000 > /dev/null 2>&1; then
  echo "✅ Analytics: Active"
else
  echo "❌ Analytics: Inactive or Not Running"
fi

# Check Gitea
if curl -s http://localhost:3001 > /dev/null 2>&1; then
  echo "✅ Git Server: Running"
else
  echo "❌ Git Server: Down or Not Running"
fi

# Check Docker containers
echo ""
echo "📦 Container Status:"
echo "-------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | grep -E "(docs-|plausible)" || echo "No containers running"

echo ""
echo "✨ Health check complete!"
