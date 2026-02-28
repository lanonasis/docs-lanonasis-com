---
title: VortexAI-L0 (Agent Orchestration)
sidebar_label: VortexAI-L0
description: The intelligent agent orchestration layer that coordinates multi-agent workflows and connects AI to the memory ecosystem.
---

**VortexAI-L0** is the orchestration and execution layer for AI agents within the LanOnasis ecosystem. It provides the "brain" that coordinates complex multi-agent workflows, manages tool access, and ensures agents have high-fidelity access to the platform's memory.

## Overview

VortexAI-L0 solves the "Isolated Agent" problem by providing a unified environment where agents can:

- **Collaborate**: Orchestrate hand-offs between specialized agents (e.g., a "Security Agent" handing off to a "DevOps Agent").
- **Recall**: Access deep contextual memory via integrated plugins.
- **Execute**: Run validated tools across the monorepo's services (Auth, MCP, Storage).

---

## Core Architecture

### 1. Agent Orchestrator
The core logic (`orchestrator.ts`) manages the lifecycle of AI agents, from initialization to task completion. It handles:
- **Task Routing**: Directing user queries to the most appropriate agent.
- **Context Management**: Passing shared state and memory between agents.
- **Constraint Enforcement**: Ensuring agents stay within their defined tool scopes.

### 2. Memory Plugin System
VortexAI-L0 utilizes an extensible plugin architecture to connect agents to the rest of the monorepo:
- **Memory Plugin**: Direct bridge to the MaaS platform for semantic recall.
- **Security Plugin**: Integrates with **[Vortex Secure](./v-secure.md)** for safe credential usage.
- **Custom Plugins**: Developers can build domain-specific plugins for their own services.

### 3. L0 Command Line Interface (CLI)
A professional CLI tool for managing and debugging agent workflows:
```bash
# Initialize an L0 agent session
l0 agent start --name "researcher"

# Debug an orchestration workflow
l0 orchestrator trace --session-id "sess_123"
```

---

## Enterprise Features

### Multi-Agent Hand-offs
L0 supports structured hand-offs, allowing one agent to delegate a sub-task to another while maintaining a shared context.

### Semantic Grounding
Every agent response is "grounded" in the platform's memory, reducing hallucinations by providing factual, retrieved context for every prompt.

---

## Development & Setup

### Requirements
- Node.js 20+ / Bun 1.1+
- Access to **[Auth Gateway](./auth-gateway.md)** for agent identity.

### Quick Start
```bash
# Enter L0 directory
cd apps/vortexai-l0

# Start the orchestrator in dev mode
bun run dev
```

---

## Related Documentation

- **[Auth Gateway](./auth-gateway.md)** – Identity for AI agents.
- **[MCP Core](./mcp-core.md)** – Content processing for agent grounding.
- **[Dashboard](./dashboard.md)** – Visual monitoring of agent workflows.

---

**Product Status**: ✅ Production (Agent Orchestration)  
**Owner**: @ai-team  
**Version**: 1.2.0 (L0 Core)
