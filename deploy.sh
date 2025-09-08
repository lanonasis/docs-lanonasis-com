#!/bin/bash

# Self-Hosted Documentation Deployment Script
# No external dependencies - everything runs on your infrastructure

set -e

echo "🚀 Deploying Lanonasis Documentation (Self-Hosted)"
echo "================================================"

# Build the documentation
echo "📦 Building documentation..."
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t docs-lanonasis:latest .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Start all services
echo "✨ Starting self-hosted stack..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
./monitor.sh

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📚 Documentation: http://localhost:3000"
echo "🔍 Search Engine: http://localhost:7700"
echo "📊 Analytics: http://localhost:8000"
echo "🔧 Git Server: http://localhost:3001"
echo ""
echo "All services are self-hosted - no external dependencies! 🎉"
