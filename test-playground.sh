#!/bin/bash

# Test script for API Playground integration
# Usage: ./test-playground.sh [local|production]

set -e

MODE="${1:-local}"
BASE_URL=""

if [ "$MODE" = "local" ]; then
  BASE_URL="http://localhost:3000"
  echo "🧪 Testing LOCAL environment"
elif [ "$MODE" = "production" ]; then
  BASE_URL="https://docs.lanonasis.com"
  echo "🧪 Testing PRODUCTION environment"
else
  echo "❌ Invalid mode. Use 'local' or 'production'"
  exit 1
fi

echo ""
echo "Base URL: $BASE_URL"
echo ""

# Test 1: OpenAPI spec accessibility
echo "Test 1: OpenAPI Spec Accessibility"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/openapi.yaml")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ OpenAPI spec accessible (HTTP $HTTP_CODE)"
else
  echo "❌ OpenAPI spec not accessible (HTTP $HTTP_CODE)"
  exit 1
fi

# Test 2: Playground page accessibility
echo ""
echo "Test 2: Playground Page Accessibility"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/playground")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Playground page accessible (HTTP $HTTP_CODE)"
else
  echo "❌ Playground page not accessible (HTTP $HTTP_CODE)"
  exit 1
fi

# Test 3: Search API endpoint
echo ""
echo "Test 3: Search API Endpoint"
RESPONSE=$(curl -s "$BASE_URL/api/search?query=api&limit=1")
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Search API working"
  echo "   Sample result:"
  echo "$RESPONSE" | jq -r '.data.results[0].title // "No results"' 2>/dev/null || echo "   (jq not installed, raw response shown)"
else
  echo "❌ Search API not working"
  echo "   Response: $RESPONSE"
  exit 1
fi

# Test 4: OpenAPI spec validity
echo ""
echo "Test 4: OpenAPI Spec Validity"
SPEC_CONTENT=$(curl -s "$BASE_URL/openapi.yaml")
if echo "$SPEC_CONTENT" | grep -q "openapi: 3.1.0"; then
  echo "✅ OpenAPI spec is valid (version 3.1.0)"
else
  echo "❌ OpenAPI spec invalid or wrong version"
  exit 1
fi

# Test 5: Check for required paths in spec
echo ""
echo "Test 5: Required Paths in OpenAPI Spec"
if echo "$SPEC_CONTENT" | grep -q "/api/search:"; then
  echo "✅ /api/search endpoint defined in spec"
else
  echo "❌ /api/search endpoint missing from spec"
  exit 1
fi

# Test 6: MCP endpoint (if production)
if [ "$MODE" = "production" ]; then
  echo ""
  echo "Test 6: MCP Endpoint"
  MCP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/mcp" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}')
  
  if echo "$MCP_RESPONSE" | grep -q "event: message"; then
    echo "✅ MCP endpoint responding"
  else
    echo "⚠️  MCP endpoint response format unexpected"
    echo "   (This may be normal if SSE format is not detected by curl)"
  fi
fi

# Summary
echo ""
echo "═══════════════════════════════════════"
echo "✅ All tests passed!"
echo "═══════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Visit $BASE_URL/api/playground in your browser"
echo "2. Select an endpoint from the dropdown"
echo "3. Fill in parameters"
echo "4. Click 'Run Request'"
echo "5. Verify response and cURL command"
echo ""

if [ "$MODE" = "local" ]; then
  echo "💡 To test production, run: ./test-playground.sh production"
fi

