---
sidebar_position: 1
title: Introduction to v-secure
description: Enterprise-grade security infrastructure for managing secrets, API keys, and credentials
---

## v-secure

Enterprise-grade security infrastructure for managing secrets, API keys, and credentials within the LanOnasis VortexCore ecosystem.

## What is v-secure?

v-secure is a comprehensive security service that provides enterprise-grade secret management, API key lifecycle management, and secure access controls for cross-border operations. Built as part of the LanOnasis platform, it ensures your sensitive data remains protected with military-grade encryption and compliance-ready audit trails.

## Key Features

### 🔐 Secret Management
- **AES-256-GCM Encryption** - Military-grade encryption at rest
- **Version Control** - Track secret changes over time
- **Expiration Management** - Automatic secret rotation and expiry
- **Tag-Based Organization** - Organize secrets by environment, team, or purpose

### 🔑 API Key Lifecycle Management
- **Complete Key Management** - Creation, rotation, and revocation
- **Access Control** - Fine-grained permissions per key
- **Usage Tracking** - Monitor API key usage patterns
- **Automatic Rotation** - Scheduled key rotation for enhanced security

### 🤖 MCP Integration
- **Secure AI Tool Access** - Control AI agent permissions
- **Approval Workflows** - Human-in-the-loop for sensitive operations
- **Audit Trails** - Complete visibility into AI tool usage

### 📝 Immutable Audit Logs
- **HMAC-Signed Logs** - Tamper-proof audit trails
- **Compliance Ready** - Meet regulatory requirements
- **Real-time Monitoring** - Track all security events
- **Export Capabilities** - Download audit logs for compliance reviews

### ✅ Compliance & Standards
- **SOC 2 Type II** - Enterprise security controls
- **ISO 27001** - Information security management
- **GDPR Compliant** - EU data protection standards
- **PCI DSS** - Payment card industry standards
- **HIPAA Ready** - Healthcare data protection

## Why v-secure?

### Built for Cross-Border Operations
v-secure is designed specifically for businesses operating across multiple jurisdictions, providing:
- **Multi-Region Deployment** - Deploy secrets close to your users
- **Compliance Automation** - Automatically meet regional requirements
- **Centralized Management** - Control security from a single dashboard
- **Border-Safe Encryption** - End-to-end encryption across regions

### Integration with LanOnasis Ecosystem
v-secure seamlessly integrates with other LanOnasis services:
- **Memory-as-a-Service** - Secure storage for AI memory and context
- **MCP Bridge** - Secure AI tool access and approval workflows
- **Central Auth Gateway** - Unified authentication and authorization
- **Audit Service** - Comprehensive activity logging

## Quick Start

Get started with v-secure in minutes:

The v-secure CLI package below is planned and not yet published.

```bash
# Install the v-secure CLI once published
npm install -g @lanonasis/v-secure-cli # Coming Soon

# Authenticate
vsecure login

# Store your first secret
vsecure secrets:create DATABASE_URL "postgresql://<user>:<password>@<host>:<port>/<db>" \
  --tags production,database

# Retrieve a secret
vsecure secrets:get DATABASE_URL
```

[Get Started →](./getting-started)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    v-secure Platform                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Secrets    │  │   API Keys   │  │     MCP      │ │
│  │  Management  │  │  Lifecycle   │  │ Integration  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │        AES-256-GCM Encryption Layer              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │        HMAC-Signed Audit Logs                    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Use Cases

### Secret Management for Microservices
Store and manage database credentials, API keys, and service tokens across your microservices architecture.

### API Key Rotation for SaaS
Automatically rotate customer API keys without service interruption, maintaining security while ensuring uptime.

### Secure AI Agent Access
Control which AI tools can access sensitive data through the MCP integration with approval workflows.

### Compliance Automation
Meet SOC 2, ISO 27001, and other compliance requirements with automated audit trails and access controls.

## Security Model

v-secure implements a defense-in-depth security model:

1. **Encryption at Rest** - All secrets encrypted with AES-256-GCM
2. **Encryption in Transit** - TLS 1.3 for all API communications
3. **Access Control** - Role-based access control (RBAC)
4. **Audit Logging** - Immutable, HMAC-signed audit trails
5. **Secret Rotation** - Automated rotation policies
6. **Zero-Knowledge Architecture** - Your keys, your control

## Next Steps

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🚀 Getting Started</h3>
      </div>
      <div className="card__body">
        <p>Install v-secure and create your first secret</p>
      </div>
      <div className="card__footer">
        <a href="./getting-started" className="button button--primary button--block">Start Tutorial</a>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📚 API Reference</h3>
      </div>
      <div className="card__body">
        <p>Explore the complete v-secure API documentation</p>
      </div>
      <div className="card__footer">
        <a href="./api/overview" className="button button--primary button--block">View API Docs</a>
      </div>
    </div>
  </div>
</div>

## Support

Need help? We're here for you:

- **Documentation** - Comprehensive guides and API reference
- **Support Portal** - [support.lanonasis.com](https://support.lanonasis.com)
- **Status Page** - [status.lanonasis.com](https://status.lanonasis.com)
- **Community** - Join our developer community

---

**Ready to secure your infrastructure?** [Get started with v-secure →](./getting-started)
