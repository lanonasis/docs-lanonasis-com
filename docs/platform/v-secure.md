---
title: Vortex Secure (Enterprise Security SaaS)
sidebar_label: Vortex Secure
description: Full-stack security platform with Next.js console, secret rotation, and a comprehensive security SDK ecosystem.
---

**Vortex Secure** (formerly v-secure) is the enterprise-grade security and compliance backbone of the LanOnasis ecosystem. It has evolved from a simple secret vault into a comprehensive SaaS platform featuring a professional web console and a suite of specialized security SDKs.

## Overview

Vortex Secure provides a zero-trust security layer for modern AI-driven applications:

- **Vortex Web Console**: A Next.js-powered management dashboard for secrets, API keys, and compliance monitoring.
- **Secret Mesh**: Automated rotation and secure delivery of credentials across Vercel, Netlify, and VPS environments.
- **SDK Ecosystem**: specialized libraries for hashing, privacy, and AI agent security.

---

## The Security SDK Ecosystem

Vortex Secure provides five specialized SDKs to enforce security at every layer of the stack:

### 1. Security SDK (`@lanonasis/security-sdk`)
Low-level primitives for high-performance hashing (argon2/scrypt), encryption (AES-256-GCM), and cryptographic validation.

### 2. Privacy SDK (`@lanonasis/privacy-sdk`)
Utilities for GDPR/CCPA compliance, including PII detection, automated data masking, and "Right to Erasure" workflows.

### 3. Security Shield (`@lanonasis/security-shield`)
A specialized library for Edge Functions (Vercel/Netlify) that provides WAF-like protection and request signing.

### 4. Vortex MCP SDK (`@vortex-secure/mcp-sdk`)
Security bridge for AI agents using the Model Context Protocol, ensuring agents only access authorized memory segments.

### 5. OAuth Client (`@lanonasis/oauth-client`)
A unified authentication client supporting the 11+ methods provided by the **Auth Gateway**.

---

## Vortex Web Console (`/web`)

The **Vortex Console** is the administrative heart of the platform, built with **Next.js 15** and **Tailwind CSS**.

**Key Features**:
- **Real-time Access Monitor**: Visualize every secret access attempt across the monorepo.
- **Key Rotation Orchestrator**: Schedule and monitor rotation workflows for Stripe, AWS, and Supabase keys.
- **Compliance Dashboard**: One-click generation of PCI-DSS and SOC2-ready audit reports.

---

## Core Architecture

```
v-secure/
├── web/                # Next.js Web Console
├── vortex-secure/      # Core Business Logic & Dashboard Components
├── security-sdk/       # Cryptographic primitives
├── privacy-sdk/        # Compliance utilities
├── security-shield/    # Edge security templates
├── oauth-client/       # Unified IAM client
└── database/           # Enterprise secrets schema
```

---

## Integration Guide

### Secret Retrieval (via SDK)
```typescript
import { SecuritySDK } from "@lanonasis/security-sdk";

const sdk = new SecuritySDK(process.env.VORTEX_API_KEY);
const dbPassword = await sdk.secrets.get("PROD_DB_PASSWORD");
```

---

## Related Services

- **[Auth Gateway](./auth-gateway.md)** – Identity and session management.
- **[Onasis-CORE](./onasis-core.md)** – Platform mesh and API routing.
- **[Dashboard](./dashboard.md)** – Global platform analytics.

---

**Product Status**: ✅ Production  
**Owner**: @security-team  
**Version**: 4.0.0 (Vortex Evolution)
