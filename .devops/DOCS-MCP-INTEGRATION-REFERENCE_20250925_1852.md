# Documentation MCP Server - Integration Reference

**Timestamp**: 2025-09-25 18:52:45 UTC
**Component**: Documentation MCP Server (docs.lanonasis.com/api/mcp)
**Status**: Active and Integrated
**Author**: Lanonasis Team

## Integration Summary

This document describes the Documentation MCP Server that serves as the backend for documentation search functionality used by the unified MCP Core server.

## Architecture Context

### Standalone Documentation Server
- **Purpose**: Provides MCP-based access to Lanonasis documentation
- **Location**: docs.lanonasis.com/api/mcp
- **Technology**: Vercel serverless function (api/mcp.js)
- **File Access**: Direct access to .md/.mdx files in docs/ directory

### Integration with MCP Core Server
- **Client**: MCP Core unified server (mcp-core package)
- **Access Method**: HTTP POST requests to docs.lanonasis.com/api/mcp
- **Protocol**: MCP 2024-11-05 via Server-Sent Events
- **Tool**: `search_lanonasis_docs` tool in unified server

## MCP Tool Details

### search_lanonasis_docs
- **Name**: `search_lanonasis_docs`
- **Description**: Search LanOnasis documentation for Memory as a Service platform
- **Input Schema**:
  - `query`: Search query for documentation (required)
  - `section`: Filter by section ('all', 'api', 'guides', 'sdks') - optional, default 'all'
  - `limit`: Maximum number of results - optional, default 10
- **Output**: Documentation results with titles, content, URLs, relevance scores

## File System Access
- **Source**: Direct access to files in `/docs` directory
- **Supported Formats**: .md and .mdx files
- **Search Method**: Full-text search through file content and metadata
- **Indexing**: Real-time search (no pre-built index)

## Security Model
- **Authentication**: None required (public documentation only)
- **Rate Limiting**: Handled by Vercel platform
- **CORS**: Configured for broad acceptance
- **Access Control**: No restrictions (public endpoint)

## Response Format
- **Protocol**: Server-Sent Events (SSE) format
- **Content Type**: application/json embedded in SSE
- **Structure**: MCP-compliant response with documentation results
- **Metadata**: Search timestamps, source attribution, relevance scores

## Health & Monitoring
- **Endpoint**: https://docs.lanonasis.com/api/mcp
- **Health Check**: MCP initialization request
- **Error Handling**: Graceful failures with MCP-compliant error responses
- **Performance**: Serverless scalability via Vercel

## Dependencies
- **MCP Core Server**: Relies on this server for documentation functionality
- **File System**: Direct dependency on docs/ directory content
- **Vercel Platform**: Serverless function hosting

## Deployment Configuration
- **Platform**: Vercel (serverless functions)
- **Route**: /api/mcp
- **Build**: Automated via Vercel deployment pipeline
- **Domains**: docs.lanonasis.com

## Integration Testing
- **MCP Core**: Tests documentation access via HTTP proxy
- **Response Parsing**: Validates SSE format and MCP compliance
- **Error Handling**: Tests graceful degradation when unavailable

## Failover Considerations
- **Unavailable**: MCP Core server returns appropriate errors
- **Timeout**: 10-second timeout prevents hanging requests
- **Degradation**: Other tools in MCP Core remain functional

## Performance Metrics
- **Response Time**: Typically <500ms for documentation queries
- **Availability**: Vercel serverless uptime SLA
- **Throughput**: Auto-scales with demand

## Monitoring Requirements
- Vercel function performance metrics
- Documentation search query volume
- Error rate monitoring
- Dependency monitoring by MCP Core server

## Maintenance
- **Content Updates**: Automatically reflected (direct file access)
- **Schema Changes**: MCP protocol version updates
- **Performance**: Monitor response times and error rates

---
**Document Version**: 1.0
**Integration Status**: Active
**Last Updated**: 2025-09-25 18:52:45 UTC
**Related Components**: MCP Core Server (unified)