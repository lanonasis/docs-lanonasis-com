---
title: Support
sidebar_position: 101
---

# Getting Help

## 🎯 Quick Links

- **Status Page**: [status.lanonasis.local](http://status.lanonasis.local)
- **API Status**: Real-time monitoring available
- **Community Discord**: [Join our Discord](https://discord.gg/lanonasis)

## 📚 Documentation Resources

### Getting Started
- [Quick Start Guide](/getting-started/quick-start)
- [Installation](/docs/installation)
- [First Memory](/docs/tutorials/first-memory)

### Troubleshooting
- [Common Issues](/docs/troubleshooting/common-issues)
- [Error Codes](/api/error-codes)
- [Performance Tips](/guides/performance)

## 🐛 Reporting Issues

### Before Reporting
1. Check [Known Issues](/docs/troubleshooting/known-issues)
2. Search [existing GitHub issues](https://github.com/lanonasis/issues)
3. Review [FAQ](/docs/faq)

### How to Report

**GitHub Issues** (Preferred for technical issues):
```markdown
**Environment:**
- SDK Version:
- API Endpoint:
- Node/Python Version:

**Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Code Sample:**
```typescript
// Minimal reproduction
```
```

## 💬 Contact Channels

### Community Support (Free)
- **Discord**: Best for quick questions
- **GitHub Discussions**: Technical discussions
- **Stack Overflow**: Tag with `lanonasis`

### Professional Support (Paid Plans)
- **Email**: support@lanonasis.local
- **Response Time**: 
  - Pro: 24 hours
  - Enterprise: 4 hours
  - Critical Issues: 1 hour

### Enterprise Support
- Dedicated Slack channel
- Technical Account Manager
- Custom SLA agreements
- Phone support available

## 🔧 Self-Service Tools

### API Key Management
```bash
# Rotate API key
lan-onasis keys rotate --confirm

# Check key permissions
lan-onasis keys info

# List all keys
lan-onasis keys list
```

### Diagnostics
```bash
# Run system diagnostic
lan-onasis diagnose

# Test API connectivity
lan-onasis test-connection

# Check rate limits
lan-onasis limits

# Verify workspace configuration
lan-onasis workspace info
```

### Memory Management
```bash
# Export memories
lan-onasis export --format json --output backup.json

# Import memories
lan-onasis import --file backup.json

# Search from CLI
lan-onasis search "your query" --limit 10

# Delete memories
lan-onasis delete --id memory-id --confirm
```

## 📖 Additional Resources

- [Video Tutorials](https://youtube.com/@lanonasis)
- [Blog](https://blog.lanonasis.local)
- [Case Studies](/use-cases)
- [Roadmap](https://github.com/lanonasis/roadmap)

## 🔍 Debugging Tips

### Enable Debug Logging

```typescript
// TypeScript SDK
const client = new MemoryClient({
  apiKey: process.env.LANONASIS_API_KEY,
  debug: true,
  logLevel: 'verbose'
})
```

```python
# Python SDK
client = MemoryClient(
    api_key=os.environ['LANONASIS_API_KEY'],
    debug=True,
    log_level='DEBUG'
)
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `AUTH_001` | Invalid API key | Check your API key in dashboard |
| `RATE_001` | Rate limit exceeded | Wait for retry-after header value |
| `VAL_001` | Invalid request format | Check request body against schema |
| `MEM_001` | Memory not found | Verify memory ID exists |
| `SEARCH_001` | Search query too short | Minimum 3 characters required |

## 🏥 Health Check Endpoints

```bash
# Check API health
curl http://api.lanonasis.local/health

# Check search service
curl http://api.lanonasis.local/health/search

# Check embeddings service
curl http://api.lanonasis.local/health/embeddings
```

## 📊 Service Level Agreement (SLA)

### Uptime Guarantees
- **Free Tier**: Best effort
- **Pro Tier**: 99.9% uptime
- **Enterprise**: 99.99% uptime with custom SLA

### Performance Targets
- **Search Latency**: < 100ms p95
- **Upsert Latency**: < 200ms p95
- **Embedding Generation**: < 500ms p95

## 🔐 Security Concerns

For security-related issues, please email security@lanonasis.local directly. Do not post security vulnerabilities publicly.

### Responsible Disclosure
1. Email details to security team
2. Allow 90 days for patch development
3. Coordinate disclosure timing

---

*Need immediate assistance? Enterprise customers can use the emergency hotline provided in your onboarding materials.*
