---
title: Lanonasis Index - Service Discovery & Marketplace
sidebar_label: Lanonasis Index
description: Central discovery platform and marketplace for LanOnasis services with API documentation, onboarding, and integration marketplace
---

**Lanonasis Index** is the central service discovery and integration marketplace for the LanOnasis ecosystem. It provides unified API documentation, service listings, marketplace features, and onboarding guides for developers discovering and integrating LanOnasis services.

## Overview

Lanonasis Index serves as the public-facing hub for discovering, exploring, and integrating LanOnasis services:

```
Developer/Partner
  ↓
Lanonasis Index (Discovery)
  ├─ Service Marketplace
  ├─ API Documentation
  ├─ Integration Guides
  ├─ Code Examples
  ├─ Sandbox Environment
  └─ Status & Support
  ↓
Available Services (Memory, Privacy, Security, AI)
```

### Primary Functions

1. **Service Discovery**: Browse available services with details
2. **API Documentation**: Interactive API reference with examples
3. **Integration Marketplace**: Pre-built integrations and SDKs
4. **Sandbox Environment**: Test services before production
5. **Onboarding Guides**: Step-by-step setup for common use cases
6. **Community**: Forums, Q&A, and support channels

---

## Architecture

### Service Structure

```
lanonasis-index/
├── src/
│   ├── pages/
│   │   ├── services/           # Service listing pages
│   │   ├── api-reference/      # Interactive API docs
│   │   ├── integrations/       # Integration marketplace
│   │   ├── guides/             # Onboarding guides
│   │   └── status/             # Service status page
│   ├── components/
│   │   ├── service-card/       # Service listing component
│   │   ├── api-explorer/       # Interactive API browser
│   │   ├── code-examples/      # Syntax-highlighted examples
│   │   └── integration-list/   # Integration marketplace
│   ├── data/
│   │   ├── services.json       # Service catalog
│   │   ├── integrations.json   # Available integrations
│   │   └── api-specs/          # OpenAPI specifications
│   ├── utils/
│   │   ├── api-client.ts       # SDK examples generator
│   │   └── status-checker.ts   # Real-time status updates
│   └── index.tsx
├── public/
│   └── api-specs/              # OpenAPI/Swagger files
├── README.md
└── package.json
```

### Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS + brand-kit integration
- **API Docs**: Docusaurus integration
- **Status Page**: Real-time health checks
- **Example Code**: Multi-language SDKs (TypeScript, Python, etc.)

---

## Key Features

### 1. Service Marketplace

Browse all LanOnasis services with rich metadata:

```
┌─ Memory Suite ────────────────────────┐
│ Unified memory layer for apps & agents│
│ ├─ Semantic Search                    │
│ ├─ Multi-Interface (REST/CLI/SDK/MCP) │
│ └─ Enterprise Compliance (PCI/GDPR)   │
│                                        │
│ Status: ✅ Operational                │
│ Latency: 50-200ms p50/p99            │
│ Uptime: 99.95%                        │
│ Try it: [Sandbox] [Docs] [Code]       │
└────────────────────────────────────────┘

┌─ Onasis-CORE ────────────────────────┐
│ Privacy-first vendor integration      │
│ ├─ Data Masking                       │
│ ├─ Vendor Anonymization               │
│ └─ Compliance Auditing                │
│                                        │
│ Status: ✅ Operational                │
│ Latency: 50-200ms p50/p99            │
│ Uptime: 99.90%                        │
│ Try it: [Sandbox] [Docs] [Code]       │
└────────────────────────────────────────┘

[... 8+ more services ...]
```

### 2. Interactive API Documentation

Explore APIs with live examples:

```typescript
// API Explorer shows:
GET /api/v1/memories/search
├─ Description
├─ Authentication (OAuth 2.0, API Key)
├─ Parameters (query, body, headers)
├─ Response schema (with examples)
├─ Error codes with explanations
└─ [Try It Out] button for live testing

// Developer can:
1. Read parameter descriptions
2. Fill in example values
3. Execute request in browser
4. See live response
5. Copy generated code
```

### 3. Integration Marketplace

Pre-built integrations and SDKs:

| Integration                   | Type      | Language   | Status        |
| ----------------------------- | --------- | ---------- | ------------- |
| **Stripe Payment Processing** | Official  | TypeScript | ✅ Stable     |
| **Zapier**                    | 3rd-party | N/A        | ✅ Maintained |
| **Slack Notifications**       | Official  | TypeScript | ✅ Stable     |
| **PostgreSQL Driver**         | Official  | SQL        | ✅ Stable     |
| **Next.js Middleware**        | Official  | TypeScript | ✅ Beta       |
| **FastAPI Integration**       | 3rd-party | Python     | ✅ Maintained |

### 4. Onboarding Guides

Step-by-step setup for common scenarios:

```
Getting Started Guides:
├─ "Store Your First Memory" (5 min)
├─ "Build a Privacy-Protected API" (15 min)
├─ "Set Up Compliance Auditing" (20 min)
├─ "Integrate with Stripe" (30 min)
└─ "Deploy to Production" (45 min)

Each guide includes:
- Prerequisites checklist
- Step-by-step instructions
- Copy-paste code snippets
- Screenshots/diagrams
- Troubleshooting section
- Next steps
```

### 5. Sandbox Environment

Test services without committing to production:

```bash
# Sandbox API endpoint
https://sandbox.lanonasis.com/api/v1

# Pre-populated test data
- Test memories
- Test users and API keys
- Test compliance records
- Reset available anytime

# Includes:
✅ All production features
✅ Rate limits (1000/min)
✅ 99% uptime SLA
❌ No real data persistence
❌ Data purged after 30 days
```

### 6. Service Status Page

Real-time status and incident history:

```
LanOnasis Services Status
═════════════════════════════════════════════════

✅ Memory Suite
   Operational · Last incident: Dec 15 (2 hours)
   Latency: 45ms (p50) · Uptime: 99.97%

✅ Onasis-CORE
   Operational · Last incident: Jan 10 (30 min)
   Latency: 75ms (p50) · Uptime: 99.90%

✅ v-secure
   Operational · Last incident: Jan 5 (15 min)
   Latency: 22ms (p50) · Uptime: 99.98%

⚠️ MCP Core (Degraded Performance)
   Investigating latency increase
   Latency: 450ms (p50) · Last update: 5 min ago

[View incident history] [Subscribe to updates]
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ or Bun 1.1+
- Next.js 15+ development setup

### Local Development

```bash
# Clone repository
git clone https://github.com/lanonasis/lanonasis-index.git
cd lanonasis-index

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Start development server
bun run dev

# Open browser
open http://localhost:3000
```

### Build for Production

```bash
# Build static site
bun run build

# Start production server
bun run start

# Or deploy to Vercel (recommended)
vercel deploy
```

---

## Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL="https://api.lanonasis.com"
NEXT_PUBLIC_SANDBOX_API_URL="https://sandbox.lanonasis.com"

# Service Status
NEXT_PUBLIC_STATUS_PAGE_URL="https://status.lanonasis.com"
NEXT_PUBLIC_STATUS_CHECK_INTERVAL=60000  # Check every 60 seconds

# Analytics
NEXT_PUBLIC_ANALYTICS_ID="your-id"

# Documentation
DOCS_REPO_URL="https://github.com/lanonasis/docs-lanonasis"
DOCS_REPO_BRANCH="main"

# Marketplace
MARKETPLACE_API_URL="https://marketplace.lanonasis.com/api"
MARKETPLACE_CACHE_TTL=3600
```

### Service Catalog (`services.json`)

```json
{
  "services": [
    {
      "id": "memory-suite",
      "name": "Memory Suite",
      "description": "Unified memory layer for apps & agents",
      "status": "GA",
      "category": "data",
      "icon": "memory.svg",
      "features": [
        "Semantic Search",
        "Multi-Interface",
        "Enterprise Compliance"
      ],
      "pricing": "Free + paid tiers",
      "documentation": "/docs/memory",
      "sandbox": "https://sandbox.lanonasis.com",
      "relatedServices": ["mcp-core", "onasis-core"]
    },
    {
      "id": "v-secure",
      "name": "v-secure",
      "description": "Enterprise secret management",
      "status": "GA",
      "category": "security",
      "icon": "vault.svg",
      "features": ["Encrypted Storage", "Key Rotation", "Compliance Auditing"],
      "pricing": "Free + paid tiers",
      "documentation": "/docs/v-secure",
      "sandbox": "https://sandbox.lanonasis.com"
    }
  ]
}
```

---

## Key Pages

### Service Detail Page

```
Lanonasis Index → Memory Suite
═════════════════════════════════════════════

[Header Image]

Memory Suite
Unified memory layer for applications and AI agents

⭐⭐⭐⭐⭐ (847 reviews)
📊 Trusted by 500+ organizations
🚀 150,000+ requests/day

[Get Started] [View Docs] [Try in Sandbox] [Pricing]

═ Overview ═════════════════════════════════════
[Feature highlights, use cases, architecture]

═ Features ═════════════════════════════════════
✓ Semantic Search
✓ Multi-Interface
✓ Enterprise Compliance

═ Pricing ════════════════════════════════════
[Pricing tiers with feature comparison]

═ Quick Start ═════════════════════════════════
[Copy-paste code example]

═ Documentation ═══════════════════════════════
[Link to full docs]

═ Integrations ═══════════════════════════════
[List of related integrations]
```

### Integration Listing Page

```
Integrations Marketplace
═════════════════════════════════════════════

[Search] [Filter by category]

┌─ Stripe Payment ────────────────┐
│ Official Integration            │
│ ✓ PCI-DSS Compliant            │
│ Rating: ⭐⭐⭐⭐⭐ (312 reviews)   │
│ [View] [Install] [Docs]        │
└─────────────────────────────────┘

┌─ Slack Notifications ──────────┐
│ Official Integration            │
│ ✓ Real-time Alerts             │
│ Rating: ⭐⭐⭐⭐⭐ (189 reviews)   │
│ [View] [Install] [Docs]        │
└─────────────────────────────────┘

[... 20+ integrations ...]
```

---

## Common Workflows

### Scenario 1: Discover Memory Service

```
1. Developer visits lanonasis-index.com
2. Browses "Services" page
3. Clicks "Memory Suite" card
4. Reads overview, features, pricing
5. Clicks "Try in Sandbox"
6. Lands in interactive API explorer
7. Creates first memory via UI
8. Clicks "Copy Code"
9. Pastes into their project
10. Next: View full documentation
```

### Scenario 2: Find Integration

```
1. Developer needs Stripe integration
2. Visits "Integrations" marketplace
3. Searches for "Stripe"
4. Finds "Stripe Payment Processing" (Official)
5. Reads integration description
6. Clicks "View Integration"
7. Follows setup guide
8. Installs via npm
9. Configures with API key
10. Next: View integration docs
```

### Scenario 3: Onboarding

```
1. New partner signs up
2. Follows "Getting Started" guide
3. Completes prerequisites checklist
4. Steps through 5-minute setup
5. Creates first memory item
6. Runs code example
7. Receives success confirmation
8. Next: Explore advanced features
```

---

## API Reference

### Get Service Details

```bash
GET https://lanonasis-index.com/api/services/:serviceId

Response:
{
  "id": "memory-suite",
  "name": "Memory Suite",
  "status": "GA",
  "latency": {
    "p50": 50,
    "p99": 200
  },
  "uptime": 0.9997,
  "features": [...]
}
```

### List Integrations

```bash
GET https://lanonasis-index.com/api/integrations?category=payment

Response:
{
  "integrations": [
    {
      "id": "stripe-payment",
      "name": "Stripe Payment Processing",
      "rating": 4.9,
      "reviews": 312,
      "status": "stable"
    }
  ]
}
```

### Get Real-Time Status

```bash
GET https://status.lanonasis.com/api/status

Response:
{
  "services": [
    {
      "id": "memory-suite",
      "status": "operational",
      "latency": 45,
      "lastIncident": "2025-12-15T14:30:00Z"
    }
  ]
}
```

---

## Performance & SEO

### Latency

| Page           | Load Time (p50) | Load Time (p99) | Notes                      |
| -------------- | --------------- | --------------- | -------------------------- |
| Homepage       | 100ms           | 300ms           | CDN cached                 |
| Service Detail | 150ms           | 400ms           | Includes integrations list |
| API Docs       | 200ms           | 500ms           | Dynamically generated      |
| Status Page    | 50ms            | 150ms           | Real-time data             |

### SEO Optimization

- ✅ Server-side rendering (Next.js)
- ✅ Structured data (JSON-LD schema)
- ✅ Open Graph meta tags
- ✅ Sitemap and robots.txt
- ✅ Fast Core Web Vitals

---

## Troubleshooting

### Issue: Sandbox data not resetting

**Solution**: Manually reset sandbox or wait for scheduled cleanup

```bash
# Manual reset (admin only)
curl -X POST https://sandbox.lanonasis.com/api/admin/reset \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Issue: Slow API documentation page

**Solution**: Clear cache and rebuild

```bash
bun run clean
bun run build
```

---

## Related Services

- **[Memory Suite Documentation](../memory/overview.md)**
- **[Onasis-CORE Platform](./onasis-core.md)**
- **[v-secure Security](./v-secure.md)**
- **[Public Status Page](https://status.lanonasis.com)**

---

## Support & Resources

- **GitHub**: [lanonasis/lanonasis-index](https://github.com/lanonasis/lanonasis-index)
- **Website**: [lanonasis.com](https://lanonasis.com)
- **Issues**: [Report bugs](https://github.com/lanonasis/lanonasis-index/issues)
- **Email**: [support@lanonasis.com](mailto:support@lanonasis.com)

---

**Last Updated**: February 3, 2026  
**Version**: 2.0.0+
