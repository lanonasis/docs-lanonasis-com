---
title: Platform Dashboard (Control Room)
sidebar_label: Dashboard
description: The central command and control hub for the LanOnasis ecosystem, providing analytics, AI orchestration, and service management.
---

**The Platform Dashboard** is the unified administrative and operational interface for the LanOnasis monorepo. It serves as the "Control Room" for developers and operators, bringing together memory analytics, identity management, and AI agent orchestration into a single high-performance interface.

## Overview

The dashboard is designed for deep visibility into the platform's distributed services:

- **Memory Workbench**: Visualize semantic search results, manage vector embeddings, and debug memory patterns.
- **Intelligence Dashboard**: Real-time insights from the behavior intelligence engine.
- **Service Management**: Provision API keys, monitor microservice health, and manage VPS environments.
- **AI Orchestrator**: Configure and schedule AI agent workflows via the MCP (Model Context Protocol).

---

## Core Modules

### 1. Memory & Intelligence Workbench
The workbench provides a "Human-in-the-Loop" interface for the Memory-as-a-Service (MaaS) platform.
- **Visualizer**: See how memories are clustered in vector space.
- **Analytics**: Monitor recall accuracy and pattern detection trends.
- **Workbench**: Manually curate, tag, and refine critical memories.

### 2. AI Orchestrator UI
A specialized interface for managing AI agents:
- **Server Manager**: Connect and disconnect MCP servers in real-time.
- **Tool Tracker**: Monitor which tools are being utilized by agents across the platform.
- **Workflow Scheduler**: Automate agent tasks using the built-in scheduler.

### 3. Unified Financial Services
The dashboard includes pre-built modules for the platform's industry-specific services:
- **Bank Statements**: Analyze and categorize financial data.
- **Fraud Monitoring**: Real-time alerting for suspicious transaction patterns.
- **Verification**: Manage KYC and identity verification workflows.

---

## Architecture & Tech Stack

The dashboard is a modern **Single Page Application (SPA)** built for performance and security:

- **Frontend**: React 19 + Vite 7 + Tailwind CSS.
- **State Management**: TanStack Query (v5) with persistent client caching.
- **Component Library**: Radix UI + Lucide React.
- **Data Layer**: Drizzle ORM for local-first metadata caching.
- **Authentication**: Dual-path support for Supabase Auth and the **[Auth Gateway](./auth-gateway.md)**.

---

## Development & Deployment

### Local Setup
```bash
# Enter dashboard directory
cd apps/dashboard

# Install dependencies
bun install

# Start development server
bun run dev
```

### Build & Preview
```bash
# Production build
bun run build

# Preview build locally
bun run preview
```

---

## Related Documentation

- **[Auth Gateway](./auth-gateway.md)** – Identity and session management.
- **[MCP Core](./mcp-core.md)** – The backend for memory analytics.
- **[Vortex Secure](./v-secure.md)** – Secret management integration.

---

**Product Status**: ✅ Production  
**Owner**: @seyederick  
**Version**: 1.2.0 (Next-Gen Hub)
