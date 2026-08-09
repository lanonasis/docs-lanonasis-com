---
title: MCP Tools Reference
sidebar_label: Tools Reference
---

<!-- DO NOT EDIT BY HAND. Generated from apps/mcp-core/src/index.ts by
     scripts/generate-mcp-tools-doc.mjs. Run `node scripts/generate-mcp-tools-doc.mjs`
     to regenerate. CI fails the build if the doc and the registry disagree
     (`bun run validate:mcp-tools`). -->

# MCP Tools Reference

Complete reference for all 37 MCP tools registered in the
LanOnasis MCP server. Tool names, descriptions, and parameter shapes are
extracted directly from the source registry at build time.

## Discovery

- **HTTP transport**: `GET https://mcp.lanonasis.com/api/v1/tools` (auth required)
- **JSON-RPC over HTTP**: `POST https://mcp.lanonasis.com/` with method `tools/list`
- **SSE**: `GET https://mcp.lanonasis.com/sse` (then send `tools/list` over the open stream)

## Memory Tools

### create_memory

Create a new memory with vector embedding.

**Annotations**: `toolAnnotations.create_memory` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `title` | string |
| `content` | string |
| `type` | string |
| `tags` | string |
| `metadata` | object |
| `topic_id` | string |
| `continuity_key` | string |
| `idempotency_key` | string |
| `write_intent` | string |

### create_memory_chunked

Create chunked memories for very large content while preserving ownership and metadata.

**Parameters**:

| Name | Type |
|------|------|
| `title` | string |
| `content` | string |
| `type` | string |
| `tags` | string |
| `metadata` | object |
| `topic_id` | string |
| `chunk_max_chars` | number |
| `chunk_overlap_chars` | number |
| `max_chunks` | number |

### delete_memory

Delete a memory by ID.

**Annotations**: `toolAnnotations.delete_memory` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `id` | string |

### get_memory

Get a specific memory by ID.

**Annotations**: `toolAnnotations.get_memory` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `id` | string |

### list_memories

List memories with pagination and filters.

**Annotations**: `toolAnnotations.list_memories` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `limit` | number |
| `offset` | number |
| `type` | string |
| `tags` | string |
| `search` | string |
| `include_deleted` | boolean |

### memory_ask_profile

Ask a natural-language question about a subject and get an AI-synthesised answer derived from their living memory profile.

**Parameters**:

| Name | Type |
|------|------|
| `subject_id` | string |
| `question` | string |

### memory_bulk_delete

Delete multiple memories in a single operation.

**Parameters**:

| Name | Type |
|------|------|
| `ids` | string |

### memory_get_profile

Retrieve the living memory profile for a subject — includes profile summary, structured fields (preferences, goals, constraints, tendencies, facts), and per-field confidence scores.

**Parameters**:

| Name | Type |
|------|------|
| `subject_id` | string |

### memory_get_profile_history

Retrieve the version history of a subject's living memory profile (most recent first).

**Parameters**:

| Name | Type |
|------|------|
| `subject_id` | string |
| `limit` | number |

### memory_stats

Get memory statistics and activity summary.

**Parameters**: none.

### search_memories

Search memories using semantic vector search.

**Annotations**: `toolAnnotations.search_memories` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `query` | string |
| `type` | string |
| `threshold` | number |
| `limit` | integer |

### update_memory

Update an existing memory.

**Annotations**: `toolAnnotations.update_memory` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `id` | string |
| `title` | string |
| `content` | string |
| `type` | string |
| `tags` | string |
| `metadata` | object |

## Intelligence Tools

### intelligence_analyze_patterns

Analyze memory usage patterns and produce operational recommendations.

**Parameters**:

| Name | Type |
|------|------|
| `time_range_days` | number |
| `include_insights` | boolean |
| `response_format` | string |

### intelligence_detect_duplicates

Detect potentially duplicate memories using embeddings/text similarity.

**Parameters**:

| Name | Type |
|------|------|
| `similarity_threshold` | number |
| `limit` | number |
| `max_scan` | number |

### intelligence_extract_insights

Extract themes, gaps, actions, and summary insights from memories.

**Parameters**:

| Name | Type |
|------|------|
| `memory_ids` | string |
| `topic` | string |
| `time_range_days` | number |
| `insight_types` | string |
| `detail_level` | string |

### intelligence_find_related

Find semantically related memories by memory_id or free-text query.

**Parameters**:

| Name | Type |
|------|------|
| `memory_id` | string |
| `query` | string |
| `limit` | number |
| `similarity_threshold` | number |
| `exclude_ids` | string |

### intelligence_flush_queue

Force-immediate reasoning for a subject (bypass cron threshold).

**Parameters**:

| Name | Type |
|------|------|
| `subject_id` | string |

### intelligence_get_job_status

Get the status of an async reasoning job by ID.

**Parameters**:

| Name | Type |
|------|------|
| `job_id` | string |

### intelligence_health_check

Run a memory intelligence health check (content quality, tags, embeddings, usage).

**Parameters**: none.

### intelligence_list_conclusions

List pre-reasoned inferred conclusions for a subject from the async inference queue.

**Parameters**:

| Name | Type |
|------|------|
| `subject_id` | string |
| `limit` | number |
| `include_superseded` | boolean |

### intelligence_suggest_tags

Suggest tags using user vocabulary and content heuristics.

**Parameters**:

| Name | Type |
|------|------|
| `memory_id` | string |
| `content` | string |
| `title` | string |
| `existing_tags` | string |
| `max_suggestions` | number |

## Behavior Tools

### behavior_recall

Recall similar workflow patterns for the current task context.

**Parameters**:

| Name | Type |
|------|------|
| `context` | string |
| `limit` | number |
| `similarity_threshold` | number |

### behavior_record

Record a successful behavior/workflow pattern for future recall.

**Parameters**:

| Name | Type |
|------|------|
| `trigger` | string |
| `context` | string |
| `actions` | string |
| `final_outcome` | string |
| `confidence` | number |

### behavior_suggest

Suggest next actions based on recalled behavior patterns.

**Parameters**:

| Name | Type |
|------|------|
| `current_state` | string |
| `max_suggestions` | number |

## API Key Tools

### create_api_key

Create a new API key.

**Annotations**: `toolAnnotations.create_api_key` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `name` | string |
| `description` | string |
| `access_level` | string |
| `expires_in_days` | number |
| `project_id` | string |

### delete_api_key

Delete an API key.

**Annotations**: `toolAnnotations.delete_api_key` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `key_id` | string |

### list_api_keys

List API keys.

**Annotations**: `toolAnnotations.list_api_keys` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `active_only` | boolean |
| `project_id` | string |

### revoke_api_key

Revoke (deactivate) an API key without deleting it.

**Annotations**: `toolAnnotations.revoke_api_key` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `key_id` | string |

### rotate_api_key

Rotate an API key.

**Annotations**: `toolAnnotations.rotate_api_key` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `key_id` | string |

## Platform Tools

### create_project

Create a new project.

**Annotations**: `toolAnnotations.create_project` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `name` | string |
| `description` | string |
| `organization_id` | string |

### get_auth_status

Get authentication status.

**Annotations**: `toolAnnotations.get_auth_status` (read/write/destructive hints from the source registry).

**Parameters**: none.

### get_config

Get configuration settings.

**Annotations**: `toolAnnotations.get_config` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `key` | string |

### get_health_status

Get system health status.

**Annotations**: `toolAnnotations.get_health_status` (read/write/destructive hints from the source registry).

**Parameters**: none.

### get_organization_info

Get organization information.

**Annotations**: `toolAnnotations.get_organization_info` (read/write/destructive hints from the source registry).

**Parameters**: none.

### list_projects

List projects.

**Annotations**: `toolAnnotations.list_projects` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `organization_id` | string |

### search_lanonasis_docs

Search LanOnasis documentation for Memory as a Service (MaaS) platform.

**Annotations**: `toolAnnotations.search_lanonasis_docs` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `query` | string |
| `section` | string |
| `limit` | number |

### set_config

Set configuration setting.

**Annotations**: `toolAnnotations.set_config` (read/write/destructive hints from the source registry).

**Parameters**:

| Name | Type |
|------|------|
| `key` | string |
| `value` | string |

## Common Error Codes

| Code | Description |
|------|-------------|
| -32600 | Invalid Request |
| -32601 | Method Not Found |
| -32602 | Invalid Params |
| -32603 | Internal Error |
| -32000 | Server Error |
| -32001 | Authentication Required |
| -32002 | Permission Denied |
| -32003 | Rate Limit Exceeded |
| -32004 | Resource Not Found |
| -32005 | Validation Error |

## Best Practices

1. **Always check for errors**: Inspect the response for `error` field
2. **Use appropriate memory types**: Choose the right type for better organization
3. **Add tags**: Tags improve searchability and organization
4. **Set thresholds**: Use appropriate similarity thresholds for search (0.7-0.9 recommended)
5. **Batch operations**: Use bulk operations when possible
6. **Handle pagination**: Use `page` and `limit` for large result sets
7. **Cache tool definitions**: Cache `tools/list` results to reduce API calls

## Related Documentation

- [MCP Overview](./overview.md) - MCP server overview
- [IDE Integration](./ide-integration.md) - Connect IDEs to MCP
- [Production Server](./production-server.md) - Production deployment

<!-- Generated 2026-08-08 from 37 registered tools. -->
