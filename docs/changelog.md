---
title: Changelog
sidebar_position: 100
---

# Changelog

All notable changes to the LanOnasis platform will be documented here.

## [1.2.0] - 2024-01-15

### 🚀 Added
- **Streaming API**: Real-time memory retrieval with WebSocket support
- **Hybrid Search**: Combined semantic and keyword search for improved accuracy
- **Analytics Dashboard**: Usage metrics and insights for monitoring
- **OAuth 2.0 Support**: Enterprise SSO integration for secure authentication
- **MCP Integration**: Full Model Context Protocol support for AI applications
- **Batch Operations**: Process multiple memories efficiently in single requests

### 🔄 Changed
- Improved embedding model to 1536 dimensions for better semantic understanding
- Reduced search latency by 40% through optimized vector indexing
- Updated TypeScript SDK to v2.0 with full type safety
- Enhanced metadata filtering with nested object support
- Upgraded infrastructure for 10x scale improvements

### 🐛 Fixed
- Memory duplication issue in batch operations
- Rate limiting edge cases for concurrent requests
- Metadata filtering with complex nested objects
- WebSocket connection stability in streaming API
- Token counting accuracy for large documents

### 🔒 Security
- Added workspace-level encryption for sensitive data
- Implemented API key rotation mechanism
- Enhanced audit logging for compliance
- Added IP allowlisting for enterprise accounts
- Improved rate limiting algorithms

---

## [1.1.0] - 2023-12-01

### 🚀 Added
- **Python SDK**: Official Python client library with full feature parity
- **CLI Tool**: Command-line interface for memory management
- **Export/Import**: Backup and restore functionality for memories
- **Webhooks**: Event notifications for memory operations
- **Custom Embeddings**: Support for custom embedding models

### 🔄 Changed
- Increased rate limits for Pro tier users
- Optimized memory storage for cost efficiency
- Improved error messages and debugging information
- Enhanced documentation with more examples

### 🐛 Fixed
- Search relevance scoring inconsistencies
- Memory update race conditions
- CLI authentication on Windows systems
- Pagination issues in large result sets

---

## [1.0.0] - 2023-10-15

### 🎉 Initial Release
- **Core Memory API**: Store, retrieve, update, and delete memories
- **Vector Search**: Semantic search with state-of-the-art embeddings
- **TypeScript SDK**: Full-featured client library for JavaScript/TypeScript
- **REST API**: Complete RESTful API with OpenAPI specification
- **Authentication**: API key-based authentication with workspace support
- **Rate Limiting**: Fair usage policies with tiered limits
- **Documentation**: Comprehensive guides and API reference

### Key Features
- 768-dimension embeddings for semantic search
- Sub-100ms search latency
- 99.9% uptime SLA for Pro and Enterprise
- GDPR compliant data handling
- Multi-region deployment

---

## Migration Guides

### Upgrading to v1.2.0

#### Breaking Changes
- `search()` method now requires explicit namespace parameter
- Embedding dimensions changed from 768 to 1536
- Rate limit headers format updated

#### Migration Steps

```typescript
// Old (v1.1.x)
const results = await client.search({
  query: "meeting notes"
})

// New (v1.2.0)
const results = await client.search({
  query: "meeting notes",
  namespace: "default" // Now required
})
```

#### Re-indexing for New Embeddings

```bash
# Re-generate embeddings for existing memories
npm run reindex:embeddings -- --model=v2
```

### Upgrading to v1.1.0

No breaking changes. New features are backward compatible.

---

## Deprecation Notices

### Scheduled for Removal in v2.0.0
- Legacy `/api/v1/store` endpoint (use `/api/v1/memories` instead)
- 768-dimension embedding support
- API key format v1 (migrate to v2 format)

### Already Deprecated
- ~~`client.store()`~~ - Use `client.upsert()` instead
- ~~`includeVector` parameter~~ - Use `includeEmbedding` instead

---

## Upcoming Features (Roadmap)

### Q1 2024
- GraphQL API support
- Real-time collaboration features
- Advanced analytics dashboard
- Mobile SDKs (iOS/Android)

### Q2 2024
- Multi-modal memory support (images, audio)
- Federated search across workspaces
- Custom embedding fine-tuning
- Enterprise data residency options

---

*For questions about migrations or breaking changes, please refer to our [Support page](/support) or contact your technical account manager.*
