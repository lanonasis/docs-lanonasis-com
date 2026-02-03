---
title: Control Room - Operations & Analytics Dashboard
sidebar_label: Control Room
description: Real-time operations dashboard with analytics, monitoring, incident management, and team collaboration for LanOnasis platform
---

**Control Room** is the operations and analytics dashboard for managing LanOnasis services. It provides real-time monitoring, performance analytics, incident management, team collaboration, and administrative controls for platform operations and compliance.

## Overview

Control Room acts as the nerve center for platform operations:

```
LanOnasis Services (All Instances)
  ↓
Real-Time Metrics Collection
  ↓
Control Room Dashboard
  ├─ Real-Time Metrics
  ├─ Performance Analytics
  ├─ Incident Management
  ├─ Team Collaboration
  ├─ Compliance Monitoring
  └─ Administrative Controls
  ↓
Alerts & Notifications
```

### Primary Functions

1. **Real-Time Monitoring**: Service health, latency, error rates
2. **Analytics & Reporting**: Performance trends, usage patterns
3. **Incident Management**: Create, track, and resolve incidents
4. **Team Collaboration**: Shared dashboards, alerts, communication
5. **Compliance Monitoring**: Audit trail, compliance reports
6. **Administrative Controls**: Service configuration, user management

---

## Architecture

### Service Structure

```
control-room/
├── src/
│   ├── pages/
│   │   ├── dashboard/          # Main analytics dashboard
│   │   ├── incidents/          # Incident management
│   │   ├── services/           # Service monitoring
│   │   ├── metrics/            # Metrics explorer
│   │   ├── team/               # Team collaboration
│   │   ├── compliance/         # Compliance reports
│   │   └── admin/              # Administrative settings
│   ├── components/
│   │   ├── metric-card/        # KPI display
│   │   ├── time-series-chart/  # Performance graphs
│   │   ├── incident-timeline/  # Incident history
│   │   ├── alert-feed/         # Real-time alerts
│   │   └── team-chat/          # Team messaging
│   ├── hooks/
│   │   ├── useMetrics/         # Fetch metrics
│   │   ├── useIncidents/       # Fetch incidents
│   │   └── useWebSocket/       # Real-time updates
│   ├── api/
│   │   ├── metrics.ts          # Metrics API
│   │   ├── incidents.ts        # Incident API
│   │   └── admin.ts            # Admin API
│   └── index.tsx
├── public/
├── README.md
└── package.json
```

### Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Real-Time**: WebSocket for live updates
- **Charts**: Recharts or Chart.js for visualizations
- **UI Components**: brand-kit integration
- **Authentication**: OAuth 2.0 with role-based access

---

## Key Dashboards

### 1. Main Analytics Dashboard

Overview of all platform metrics:

```
Control Room Dashboard
═════════════════════════════════════════════════════════

[Time Range Selector: Last 24 hours ▼] [Refresh: Real-time]

┌─ Key Metrics ────────────────────────────────────────┐
│ Requests/sec: 125 (↑ 12% from avg)                   │
│ Avg Latency: 85ms (✓ Within SLA)                     │
│ Error Rate: 0.02% (✓ Under 0.5% threshold)           │
│ Uptime: 99.98% (✓ Above 99.95% target)               │
└──────────────────────────────────────────────────────┘

┌─ Request Volume (Last 24h) ──────────────────────────┐
│                                                       │
│     125 req/s │                    ╱╲                │
│     100 req/s │           ╱╲      ╱  ╲               │
│      75 req/s │╱╲    ╱╲  ╱  ╲    ╱    ╲              │
│      50 req/s │  ╲  ╱  ╲╱    ╲  ╱      ╲            │
│               └────────────────────────────          │
│               0h      6h     12h    18h    24h       │
└──────────────────────────────────────────────────────┘

┌─ Service Health ─────────────────────────────────────┐
│ ✅ Memory Suite        │ ✅ v-secure                 │
│    Latency: 45ms       │    Latency: 22ms            │
│    Error Rate: 0.01%   │    Error Rate: 0.00%        │
│                        │                              │
│ ✅ Onasis-CORE         │ ⚠️  MCP Core (Degraded)     │
│    Latency: 75ms       │    Latency: 450ms           │
│    Error Rate: 0.05%   │    Error Rate: 0.10%        │
└──────────────────────────────────────────────────────┘

┌─ Recent Incidents ───────────────────────────────────┐
│ [Jan 15 10:30] MCP Core latency spike (30 min)       │
│ [Jan 14 14:22] Memory memcache hit (resolved)        │
│ [Jan 12 09:15] v-secure certificate renewal (1 sec) │
└──────────────────────────────────────────────────────┘

┌─ Alerts ─────────────────────────────────────────────┐
│ 🔔 Error rate exceeding 0.1% for Onasis-CORE         │
│ 🔔 Memory Suite P99 latency above 500ms              │
│ ℹ️  Scheduled maintenance: Jan 20 02:00 UTC          │
└──────────────────────────────────────────────────────┘
```

### 2. Service Monitoring

Deep dive into individual service performance:

```
Service: Memory Suite (v1.3.2)
═════════════════════════════════════════════════════════

Status: ✅ Operational
Last Updated: 2 seconds ago

┌─ Performance Metrics ──────────────────────────────┐
│ Requests/sec:     85 (Normal)                      │
│ Avg Latency:      50ms (Good)                      │
│ P95 Latency:      120ms (Good)                     │
│ P99 Latency:      250ms (Good)                     │
│ Error Rate:       0.01% (Excellent)                │
│ Cache Hit Rate:   92% (Excellent)                  │
│ Connection Pool:  245/250 active                   │
└────────────────────────────────────────────────────┘

┌─ Instances ───────────────────────────────────────┐
│ prod-mem-1 (us-east-1)      ✅ Healthy            │
│ prod-mem-2 (us-west-2)      ✅ Healthy            │
│ prod-mem-3 (eu-central-1)   ✅ Healthy            │
│ prod-mem-4 (ap-northeast-1) ✅ Healthy            │
└────────────────────────────────────────────────────┘

[View Logs] [View Metrics] [Scale] [Restart]
```

### 3. Incident Management

Create and track incidents:

```
Incident: [INC-2026-0015] MCP Core Latency Spike
═════════════════════════════════════════════════════════

Status: 🟡 Investigating (Started 30 min ago)
Severity: 🔴 High
Service: MCP Core
Owner: @ops-team

Timeline:
├─ 10:30 UTC - Latency spike detected (450ms avg)
├─ 10:31 UTC - Alert sent to on-call engineer
├─ 10:32 UTC - Investigation started
│  ├─ Database query performance normal
│  ├─ Memory usage 78% (within limits)
│  └─ Network latency normal
├─ 10:35 UTC - Scaled up instances from 3 to 5
├─ 10:45 UTC - Latency returning to normal (85ms avg)
└─ [Still investigating root cause...]

Actions Taken:
- Scaled instances 3 → 5
- Cleared stale cache entries
- Enabled debug logging

Impact:
- Affected users: ~1,200 requests with >500ms latency
- Error rate: 0.05% (elevated from 0.01%)
- Estimated impact: $45 in SLA credits owed

[Update] [Resolve] [Escalate] [Share]
```

### 4. Team Collaboration

Shared dashboards and real-time communication:

```
Team Channel: #operations
═════════════════════════════════════════════════════════

@alice: Just detected latency spike on MCP Core
        Scaled from 3 to 5 instances

@bob: Good catch! Checking database logs now

@alice: P99 latency still at 200ms, not dropping
        Let me check the cache

@bob: Found it! Stale cache entries preventing optimization
      I'm clearing the cache now

@alice: ✓ Latency back to normal (50ms avg)
        Incident created: [INC-2026-0015]

@charlie: Great teamwork! Let's do a postmortem
          tomorrow at 10am UTC.

[Attach metric snapshot] [Create incident] [Start call]
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ or Bun 1.1+
- Access to LanOnasis metrics backend
- OAuth 2.0 configured

### Local Development

```bash
# Clone repository
git clone https://github.com/lanonasis/control-room.git
cd control-room

# Install dependencies
bun install

# Configure environment
cp .env.example .env.local

# Start development server
bun run dev

# Open dashboard
open http://localhost:3001
```

---

## Configuration

### Environment Variables

```bash
# Backend API
NEXT_PUBLIC_API_BASE_URL="https://api.lanonasis.com"
NEXT_PUBLIC_METRICS_API="https://metrics.lanonasis.com"

# WebSocket
NEXT_PUBLIC_WS_URL="wss://ws.lanonasis.com"

# Authentication
NEXT_AUTH_URL="http://localhost:3001"
NEXT_AUTH_SECRET="your-secret-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"

# Feature Flags
NEXT_PUBLIC_INCIDENT_MANAGEMENT=true
NEXT_PUBLIC_TEAM_COLLABORATION=true
NEXT_PUBLIC_COMPLIANCE_REPORTS=true
```

---

## API Reference

### Get Real-Time Metrics

```bash
GET /api/metrics?service=memory-suite&timeRange=24h

Response:
{
  "service": "memory-suite",
  "metrics": {
    "requestsPerSecond": 85,
    "avgLatency": 50,
    "p95Latency": 120,
    "p99Latency": 250,
    "errorRate": 0.0001,
    "uptime": 0.9998
  },
  "timestamp": "2026-01-15T10:45:00Z"
}
```

### Create Incident

```bash
POST /api/incidents

Body:
{
  "title": "Memory Suite Latency Spike",
  "service": "memory-suite",
  "severity": "high",
  "description": "P99 latency exceeded 500ms",
  "assignee": "alice@lanonasis.com"
}

Response:
{
  "id": "INC-2026-0015",
  "status": "investigating",
  "createdAt": "2026-01-15T10:30:00Z"
}
```

### Update Incident

```bash
PATCH /api/incidents/:id

Body:
{
  "status": "resolved",
  "rootCause": "Stale cache entries",
  "resolution": "Cleared cache and scaled instances",
  "postmortemUrl": "https://..."
}
```

---

## Common Workflows

### Scenario 1: Detect and Respond to Incident

```
1. Real-time alert triggers (latency > threshold)
2. Dashboard highlights affected service
3. On-call engineer receives notification
4. Opens Control Room dashboard
5. Views incident details and timeline
6. Identifies root cause (stale cache)
7. Executes remediation (clear cache)
8. Monitors metrics for recovery
9. Creates incident record
10. Schedules postmortem
```

### Scenario 2: Generate Compliance Report

```
1. Operations manager opens Control Room
2. Navigates to Compliance section
3. Selects compliance standard (PCI-DSS, HIPAA)
4. Chooses date range (monthly)
5. Clicks "Generate Report"
6. Report shows:
   - All access logs
   - Security incidents
   - Audit trail
   - Uptime metrics
7. Exports as PDF for auditor
```

---

## Troubleshooting

### Issue: Real-time metrics not updating

**Solution**: Check WebSocket connection

```bash
# Check WebSocket connectivity
curl -i -N -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  wss://ws.lanonasis.com/metrics
```

### Issue: Slow dashboard loading

**Solution**: Reduce time range or cache results

```bash
NEXT_PUBLIC_CACHE_RESULTS=true
NEXT_PUBLIC_CACHE_TTL=300  # 5 minutes
```

---

## Related Services

- **[Memory Suite](../memory/overview.md)** – Service being monitored
- **[Lanonasis Index](./lanonasis-index.md)** – Service discovery
- **[v-secure](./v-secure.md)** – Credentials for accessing metrics

---

## Support & Resources

- **GitHub**: [lanonasis/control-room](https://github.com/lanonasis/control-room)
- **Issues**: [Report bugs](https://github.com/lanonasis/control-room/issues)
- **Email**: [ops@lanonasis.com](mailto:ops@lanonasis.com)

---

**Last Updated**: February 3, 2026  
**Version**: 1.2.0+
