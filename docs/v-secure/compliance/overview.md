---
sidebar_position: 1
title: Compliance Overview
description: v-secure compliance and certifications
---

# Compliance Overview

v-secure is built to meet enterprise compliance requirements for security, privacy, and data protection.

## Certifications

### SOC 2 Type II

v-secure maintains SOC 2 Type II certification with controls for:

- **Security** - Protection against unauthorized access
- **Availability** - System uptime and reliability
- **Confidentiality** - Protection of sensitive information
- **Processing Integrity** - Complete and accurate processing
- **Privacy** - Collection and handling of personal information

[Learn more →](./soc2)

### ISO 27001

ISO 27001 certified information security management system (ISMS) covering:

- Risk assessment and management
- Asset management
- Access control
- Cryptography
- Physical and environmental security
- Incident management

[Learn more →](./iso27001)

### GDPR Compliant

Full compliance with EU General Data Protection Regulation:

- Data protection by design and default
- Right to access and portability
- Right to erasure ("right to be forgotten")
- Data breach notification
- Data processing agreements

[Learn more →](./gdpr)

### PCI DSS Ready

Payment Card Industry Data Security Standard compliance for:

- Cardholder data protection
- Strong access control
- Network security
- Regular monitoring and testing
- Security policy maintenance

[Learn more →](./pci-dss)

## Security Standards

### Encryption

- **At Rest**: AES-256-GCM encryption for all data
- **In Transit**: TLS 1.3 for all communications
- **Key Management**: Hardware Security Module (HSM) backed

### Access Control

- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Principle of least privilege
- Regular access reviews

### Audit Logging

- Immutable audit trails
- HMAC-signed logs
- Tamper-proof storage
- Retention policies

## Regional Compliance

### United States

- **HIPAA** - Healthcare data protection
- **FERPA** - Education records privacy
- **SOX** - Financial reporting controls
- **FISMA** - Federal security standards

### European Union

- **GDPR** - Data protection regulation
- **NIS Directive** - Network and information security
- **eIDAS** - Electronic identification

### Asia Pacific

- **APPI** (Japan) - Act on Protection of Personal Information
- **PDPA** (Singapore) - Personal Data Protection Act
- **PIPA** (South Korea) - Personal Information Protection Act

## Compliance Features

### Data Residency

Choose where your data is stored:

```typescript
const client = new VSecureClient({
  region: 'eu-west-1',
  dataResidency: {
    allowedRegions: ['eu-west-1', 'eu-central-1'],
    disableCrossRegion: true
  }
});
```

### Audit Trails

Complete visibility into all operations:

```bash
# Export audit logs for compliance review
vsecure audit:export \
  --format syslog \
  --since 90d \
  --output ./compliance-audit.log
```

### Access Reports

Generate access reports for compliance teams:

```bash
vsecure compliance:report \
  --type access-control \
  --period Q1-2024
```

### Data Processing Agreements

Standard DPA templates available for:
- GDPR compliance
- CCPA compliance
- Custom agreements

## Compliance Automation

### Automated Reports

Schedule automatic compliance reports:

```typescript
await client.compliance.configureReporting({
  schedule: 'monthly',
  reports: ['soc2', 'gdpr-access'],
  recipients: ['compliance@example.com']
});
```

### Policy Enforcement

Enforce security policies automatically:

```typescript
await client.compliance.enforcePolicy({
  secretExpiration: '90d',
  keyRotation: '30d',
  mfaRequired: true,
  minPasswordLength: 16
});
```

### Continuous Monitoring

Monitor compliance status:

```bash
vsecure compliance:status
```

## Attestations

Request compliance attestations:

- SOC 2 Type II report
- Penetration test results
- Security audit reports
- Data processing agreements

Contact: compliance@lanonasis.com

## Third-Party Audits

v-secure undergoes regular third-party audits:

- **Annual** - SOC 2 Type II audit
- **Quarterly** - Penetration testing
- **Monthly** - Vulnerability scans
- **Continuous** - Automated security testing

## Documentation

Comprehensive compliance documentation available:

- Security policies
- Incident response procedures
- Business continuity plans
- Disaster recovery plans
- Privacy policies

## Support

For compliance questions:

- **Email**: compliance@lanonasis.com
- **Documentation**: docs.lanonasis.com/v-secure/compliance
- **Trust Center**: trust.lanonasis.com

## Next Steps

- [SOC 2 Compliance](./soc2)
- [ISO 27001 Compliance](./iso27001)
- [GDPR Compliance](./gdpr)
- [PCI DSS Compliance](./pci-dss)
