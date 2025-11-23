# Documentation vs Codebase Comparison Report

**Generated:** 2024-01-XX  
**Scope:** Published packages (memory-client, CLI, security-sdk) documentation vs actual implementations

---

## Executive Summary

This report compares the published documentation in `apps/docs-lanonasis` with the actual codebase implementations for:
- `@lanonasis/memory-client` SDK
- `@lanonasis/cli` package
- `@onasis/security-sdk` / `@lanonasis/security-sdk`

**Key Findings:**
- ❌ **Version mismatches** between documentation and published packages
- ❌ **API signature discrepancies** in memory-client SDK
- ❌ **Package name inconsistencies** for security-sdk
- ⚠️ **Missing documentation** for several implemented features
- ⚠️ **Outdated examples** in documentation

---

## 1. Memory Client SDK (`@lanonasis/memory-client`)

### Package Information

| Aspect | Documentation | Actual Codebase | Status |
|--------|-------------|----------------|--------|
| Package Name | `@lanonasis/memory-client` | `@lanonasis/memory-client` | ✅ Match |
| Version | 1.0.0 | 1.0.0 | ✅ Match |
| Location | N/A | `apps/lanonasis-maas/packages/memory-client/` | ✅ Found |

### API Signature Discrepancies

#### Constructor

**Documentation** (`docs/sdks/typescript.md`):
```typescript
const client = new MemoryClient({
  apiKey: process.env.LANONASIS_API_KEY
});
```

**Actual Implementation** (`packages/memory-client/src/client.ts`):
```typescript
export interface MemoryClientConfig {
  apiUrl: string;           // Required in actual, not mentioned in docs
  apiKey?: string;           // Optional in actual
  authToken?: string;        // Not documented
  timeout?: number;          // Not documented
  useGateway?: boolean;      // Not documented
  headers?: Record<string, string>; // Not documented
}
```

**Issue:** Documentation shows simplified constructor, but actual requires `apiUrl` and supports more options.

#### Method Names

| Operation | Documentation | Actual Implementation | Status |
|----------|-------------|----------------------|--------|
| Create | `client.memories.create()` | `client.createMemory()` | ❌ Mismatch |
| Get | `client.memories.get()` | `client.getMemory()` | ❌ Mismatch |
| Update | `client.memories.update()` | `client.updateMemory()` | ❌ Mismatch |
| Delete | `client.memories.delete()` | `client.deleteMemory()` | ❌ Mismatch |
| List | `client.memories.list()` | `client.listMemories()` | ❌ Mismatch |
| Search | `client.search.semantic()` | `client.searchMemories()` | ❌ Mismatch |

**Issue:** Documentation shows namespaced API (`client.memories.*`), but actual implementation uses direct methods (`client.*`).

#### Type Definitions

**Documentation** shows:
```typescript
interface Memory {
  id: string;
  title: string;
  content: string;
  tags: string[];
  // ... more fields
}
```

**Actual Implementation** (`packages/memory-client/src/types.ts`):
```typescript
export interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  summary?: string;              // Not in docs
  memory_type: MemoryType;       // Not in docs
  status: MemoryStatus;           // Not in docs
  relevance_score?: number;      // Not in docs
  access_count: number;          // Not in docs
  last_accessed?: string;        // Not in docs
  user_id: string;               // Not in docs
  topic_id?: string;             // Not in docs
  project_ref?: string;          // Not in docs
  tags: string[];
  metadata?: Record<string, unknown>; // Not in docs
  created_at: string;
  updated_at: string;
}
```

**Issue:** Type name is `MemoryEntry` not `Memory`, and includes many fields not documented.

### Missing Features in Documentation

1. **Enhanced Client** (`enhanced-client.ts`):
   - `EnhancedMemoryClient` class not documented
   - CLI integration features not documented
   - Gateway mode not explained

2. **CLI Integration** (`cli-integration.ts`):
   - `CLIIntegration` class not documented
   - MCP channel support not documented
   - Routing strategies not documented

3. **Configuration Utilities** (`config.ts`):
   - `createSmartConfig()` not documented
   - `ConfigPresets` not documented
   - Environment detection not documented

4. **Topic Operations**:
   - `createTopic()`, `getTopics()`, `updateTopic()`, `deleteTopic()` implemented but not fully documented

5. **Bulk Operations**:
   - `bulkDeleteMemories()` implemented but not documented

6. **Statistics**:
   - `getMemoryStats()` implemented but not documented

### Response Format Discrepancies

**Documentation** shows:
```typescript
const memory = await client.memories.create({...}); // Returns Memory directly
```

**Actual Implementation**:
```typescript
async createMemory(memory: CreateMemoryRequest): Promise<ApiResponse<MemoryEntry>>
// Returns ApiResponse wrapper with { data?, error?, message? }
```

**Issue:** Actual returns wrapped response, documentation shows direct return.

---

## 2. CLI Package (`@lanonasis/cli`)

### Package Information

| Aspect | Documentation | Actual Codebase | Status |
|--------|-------------|----------------|--------|
| Package Name | `@lanonasis/cli` | `@lanonasis/cli` | ✅ Match |
| Version | **3.1.13** | **3.6.7** | ❌ **Mismatch** |
| Location | N/A | `apps/lanonasis-maas/cli/` | ✅ Found |

**Critical Issue:** Version mismatch - documentation shows v3.1.13, actual package is v3.6.7.

### Command Structure Discrepancies

#### Documentation Structure (`docs/sdks/cli.md`):
```bash
lanonasis auth login
lanonasis memory create --title "My Note" --content "Important information"
lanonasis memory search "query"
lanonasis memory list --limit 10
```

#### Actual Implementation (`cli/src/index.ts`):
```bash
# Commands are registered differently:
lanonasis init                    # Not in docs
lanonasis auth login              # ✅ Matches
lanonasis memory create           # ✅ Matches (but different options)
lanonasis memory search           # Not found - uses MCP instead
lanonasis memory list             # ✅ Matches
lanonasis mcp                     # Not in docs
lanonasis topic                   # Not in docs
lanonasis org                     # Not in docs
lanonasis api-keys                # Not in docs
lanonasis dashboard               # Not in docs
lanonasis documentation           # Not in docs
lanonasis sdk                     # Not in docs
lanonasis api                     # Not in docs
lanonasis deploy                  # Not in docs
lanonasis service                 # Not in docs
lanonasis health                  # Not in docs
lanonasis status                  # Not in docs
lanonasis repl                    # Not in docs
```

### Command Option Discrepancies

#### Memory Create Command

**Documentation** (`docs/sdks/cli/commands.md`):
```bash
lanonasis memory create [OPTIONS] CONTENT
Options:
  --metadata -m: Metadata as JSON string
  --tags -t: Comma-separated tags
  --file -f: Read content from file
  --stdin: Read content from stdin
```

**Actual Implementation** (`cli/src/commands/memory.ts`):
```typescript
.option('-t, --title <title>', 'memory title')
.option('-c, --content <content>', 'memory content')
.option('--type <type>', 'memory type', 'context')
.option('--tags <tags>', 'comma-separated tags')
.option('--topic-id <id>', 'topic ID')
.option('-i, --interactive', 'interactive mode')
```

**Issues:**
- Documentation shows `CONTENT` as positional argument, actual uses `--content` flag
- Documentation shows `--metadata` and `--file`, actual doesn't have these
- Actual has `--title`, `--type`, `--topic-id`, `--interactive` not in docs

### Missing Commands in Documentation

1. **MCP Commands** (`mcp.ts`):
   - `lanonasis mcp start`
   - `lanonasis mcp test`
   - `lanonasis mcp tools`
   - `lanonasis mcp call`

2. **Topic Commands** (`topics.ts`):
   - `lanonasis topic create`
   - `lanonasis topic list`
   - `lanonasis topic get`
   - `lanonasis topic update`
   - `lanonasis topic delete`

3. **Organization Commands** (`organization.ts`):
   - `lanonasis org *` commands

4. **API Key Commands** (`api-keys.ts`):
   - `lanonasis api-keys *` commands

5. **System Commands**:
   - `lanonasis health`
   - `lanonasis status`
   - `lanonasis init`
   - `lanonasis repl`

### Global Options

**Documentation** shows:
```bash
--api-key -k
--base-url -b
--format -f
--debug -d
--verbose -v
```

**Actual Implementation**:
```typescript
.option('-V, --verbose', 'enable verbose logging')
.option('--api-url <url>', 'override API URL')
.option('--output <format>', 'output format (json, table, yaml)', 'table')
.option('--no-mcp', 'disable MCP and use direct API')
```

**Issues:**
- `--api-key` not found in actual (uses config file instead)
- `--base-url` vs `--api-url` naming mismatch
- `--format` vs `--output` naming mismatch
- `--debug` not found
- `--no-mcp` not documented

---

## 3. Security SDK (`@onasis/security-sdk` / `@lanonasis/security-sdk`)

### Package Information

| Aspect | Documentation | Actual Codebase | Status |
|--------|-------------|----------------|--------|
| Package Name | **`@onasis/security-sdk`** | **`@lanonasis/security-sdk`** | ❌ **Mismatch** |
| Version | Not specified | 1.0.0 | ⚠️ Unknown |
| Location | `docs/v-secure/` | `packages/security-sdk/` | ✅ Found |

**Critical Issue:** Package name mismatch - documentation references `@onasis/security-sdk`, but actual package is `@lanonasis/security-sdk`.

### Documentation Location Mismatch

- **Documentation:** Located in `docs/v-secure/` (references "v-secure" branding)
- **Actual Package:** `packages/security-sdk/` (references "security-sdk")
- **README:** `packages/security-sdk/README.md` shows `@onasis/security-sdk` but package.json shows `@lanonasis/security-sdk`

**Issue:** Inconsistent naming across documentation, package.json, and README.

### API Discrepancies

#### Documentation (`docs/v-secure/api/overview.md`)

Documentation describes a **REST API** for security features:
- `POST /v1/security/secrets` - Create secret
- `GET /v1/security/secrets/:name` - Get secret
- `POST /v1/security/api-keys` - Create API key
- etc.

#### Actual Implementation (`packages/security-sdk/src/index.ts`)

Actual implementation is a **TypeScript SDK class**:
```typescript
export class SecuritySDK {
  encrypt(data: string | object, context: string, options?: EncryptionOptions): EncryptedData
  decrypt(encryptedData: EncryptedData, context: string): string
  decryptJSON<T>(encryptedData: EncryptedData, context: string): T
  rotate(oldEncrypted: EncryptedData, context: string, newData?: string | object): EncryptedData
  hash(data: string, salt?: string): string
  verifyHash(data: string, hashedData: string): boolean
  generateToken(bytes?: number): string
  generateAPIKey(prefix?: string): string
  sanitize(data: string, showChars?: number): string
  isValidEncryptedData(data: any): data is EncryptedData
  static generateMasterKey(): string
}
```

**Issue:** Documentation describes REST API endpoints, but actual implementation is a client-side SDK with encryption methods. These are completely different things!

### Missing SDK Documentation

The actual SDK has comprehensive functionality that's not documented in `docs/v-secure/`:

1. **Encryption Methods:**
   - `encrypt()` - AES-256-GCM encryption
   - `decrypt()` - Decryption
   - `decryptJSON()` - Decrypt and parse JSON
   - `rotate()` - Key rotation

2. **Hashing Methods:**
   - `hash()` - Secure hashing
   - `verifyHash()` - Hash verification

3. **Key Generation:**
   - `generateToken()` - Random token generation
   - `generateAPIKey()` - API key generation
   - `generateMasterKey()` - Master key generation (static)

4. **Utilities:**
   - `sanitize()` - Data sanitization for logging
   - `isValidEncryptedData()` - Validation

5. **Singleton Pattern:**
   - `getSecuritySDK()` - Singleton instance getter

**Issue:** All SDK methods are missing from `docs/v-secure/` documentation.

---

## 4. General Documentation Issues

### Missing Package Documentation

1. **Python SDK:**
   - Documentation exists (`docs/sdks/python/`)
   - No corresponding package found in codebase
   - Status: ⚠️ Unknown if implemented

2. **Enterprise SDK (`@lanonasis/sdk`):**
   - Documentation shows "Coming Soon"
   - No implementation found
   - Status: ⚠️ Not implemented

3. **Standalone Memory SDK (`@lanonasis/memory-sdk-standalone`):**
   - Documentation exists
   - No corresponding package found
   - Status: ⚠️ Unknown if implemented

### API Endpoint Documentation

**Documentation** (`docs/api/overview.md`) shows:
- Base URL: `https://api.lanonasis.com/api/v1`
- Endpoints: `/memory`, `/search`, `/embeddings`, etc.

**Actual Implementation** (`memory-client/src/client.ts`):
- Base URL construction: `${apiUrl}/api/v1${endpoint}`
- Endpoints: `/memory`, `/memory/search`, `/topics`, `/memory/stats`

**Issues:**
- Some endpoints documented don't match actual implementation
- Response format differences not documented

### Version Information

| Package | Docs Version | Actual Version | Status |
|---------|-------------|----------------|--------|
| memory-client | 1.0.0 | 1.0.0 | ✅ Match |
| CLI | **3.1.13** | **3.6.7** | ❌ Mismatch |
| security-sdk | Not specified | 1.0.0 | ⚠️ Unknown |

---

## 5. Recommendations

### High Priority

1. **Fix CLI Version Mismatch:**
   - Update `docs/sdks/cli.md` to reflect v3.6.7
   - Document all new commands added since v3.1.13

2. **Fix Security SDK Documentation:**
   - Decide on package name: `@onasis/security-sdk` or `@lanonasis/security-sdk`
   - Create proper SDK documentation (not REST API docs)
   - Document all encryption/hashing methods

3. **Fix Memory Client API Documentation:**
   - Update to show actual API: `client.createMemory()` not `client.memories.create()`
   - Document `ApiResponse<T>` wrapper
   - Document all configuration options
   - Document enhanced client features

### Medium Priority

4. **Complete CLI Documentation:**
   - Document all MCP commands
   - Document topic commands
   - Document organization commands
   - Document system commands (health, status, init)

5. **Add Missing Features:**
   - Document bulk operations
   - Document statistics API
   - Document topic operations in SDK
   - Document enhanced client features

6. **Fix Type Definitions:**
   - Use `MemoryEntry` instead of `Memory`
   - Document all fields in types
   - Add JSDoc comments to actual code

### Low Priority

7. **Improve Examples:**
   - Update all code examples to match actual API
   - Add error handling examples
   - Add configuration examples

8. **Add Migration Guides:**
   - Guide for users of old API
   - Breaking changes documentation

---

## 6. Documentation Files Requiring Updates

### Critical Updates Needed

1. `docs/sdks/typescript.md` - Complete rewrite to match actual API
2. `docs/sdks/cli.md` - Update version and add missing commands
3. `docs/sdks/cli/commands.md` - Update all command signatures
4. `docs/memory/sdk.md` - Update to match actual implementation
5. `docs/v-secure/api/overview.md` - Replace REST API docs with SDK docs
6. `packages/security-sdk/README.md` - Fix package name inconsistency

### New Documentation Needed

1. `docs/sdks/typescript/enhanced-client.md` - Enhanced client features
2. `docs/sdks/typescript/cli-integration.md` - CLI integration
3. `docs/sdks/cli/mcp.md` - MCP commands
4. `docs/sdks/cli/topics.md` - Topic commands
5. `docs/sdks/security-sdk.md` - Security SDK API reference

---

## 7. Testing Recommendations

1. **Automated Documentation Testing:**
   - Generate API docs from TypeScript types
   - Validate code examples against actual code
   - Check version numbers match package.json

2. **Manual Verification:**
   - Test all documented commands
   - Verify all code examples work
   - Check all links are valid

---

## 8. MCP Documentation Gaps

### Missing MCP Documentation

The MCP (Model Context Protocol) server has **minimal documentation** despite being a core feature:

1. **MCP Overview Missing:**
   - No comprehensive overview of MCP capabilities
   - No documentation of available transport protocols (SSE, WebSocket, HTTP, stdio)
   - No connection guide for different use cases

2. **MCP Tools Not Documented:**
   - Memory tools (`create_memory`, `get_memory`, `update_memory`, `delete_memory`, `list_memories`, `search_memories`, `bulk_delete_memories`)
   - API key tools (`create_api_key`, `list_api_keys`, `get_api_key`, `rotate_api_key`, `revoke_api_key`)
   - System tools (`health_check`, `get_stats`, `list_topics`)
   - Tool parameters and response formats not documented

3. **MCP Endpoints Missing:**
   - SSE endpoint: `GET /mcp/sse` - Not documented
   - WebSocket endpoint: `wss://mcp.lanonasis.com/ws` - Not documented
   - HTTP REST endpoints: `POST /api/v1/mcp/message` - Not documented
   - Health endpoints: `GET /mcp/health` - Not documented

4. **MCP Integration Guide Missing:**
   - How to connect from different clients (SDK, CLI, IDE)
   - Authentication methods for MCP
   - Error handling and retry logic
   - Rate limiting information

**Status**: ⚠️ **Critical Gap** - MCP is a core feature but has minimal documentation

## 9. Security Service Documentation Gaps

### Missing Security Service Documentation

The security service (`apps/onasis-core/services/security`) has comprehensive README but **no public documentation**:

1. **Service API Not Documented:**
   - REST API endpoints not in public docs
   - Service methods and interfaces not documented
   - Integration examples missing

2. **Security SDK vs Service Confusion:**
   - `@lanonasis/security-sdk` (client SDK) - Now documented ✅
   - `apps/onasis-core/services/security` (backend service) - Not in public docs ❌
   - Relationship between SDK and service not explained

3. **MCP Integration for Security:**
   - MCP tools for API key management not documented
   - Access request workflow not documented
   - Proxy token system not documented

**Status**: ⚠️ **Major Gap** - Security service exists but not in public documentation

## Conclusion

The documentation has significant gaps and inconsistencies compared to the actual codebase. The most critical issues are:

1. **CLI version mismatch** (docs show 3.1.13, actual is 3.6.7) - ✅ **FIXED**
2. **Memory client API mismatch** (docs show namespaced API, actual uses direct methods) - ✅ **FIXED**
3. **Security SDK confusion** (docs show REST API, actual is client SDK) - ✅ **FIXED**
4. **Package name inconsistency** for security-sdk - ✅ **FIXED**
5. **MCP documentation missing** - ✅ **FIXED** (comprehensive docs created)
6. **Security service documentation missing** - ✅ **FIXED** (service docs created)

### Documentation Improvements Made

✅ **Fixed CLI Documentation:**
- Updated version to 3.6.7
- Added all missing commands (MCP, topics, org, api-keys, system commands)
- Updated command signatures to match actual implementation

✅ **Fixed Memory Client SDK Documentation:**
- Updated to show actual API (`client.createMemory()` not `client.memories.create()`)
- Documented `ApiResponse<T>` wrapper
- Added all configuration options
- Documented all methods including topics, bulk operations, statistics

✅ **Created Security SDK Documentation:**
- Complete API reference for `@lanonasis/security-sdk`
- All encryption/hashing methods documented
- Usage examples and best practices
- Type definitions

✅ **Created Security Service Documentation:**
- Complete service overview
- API reference
- Integration guide
- Compliance information

✅ **Created Comprehensive MCP Documentation:**
- MCP overview with all transport protocols
- Complete tools reference (all memory, API key, and system tools)
- Connection guides
- Error handling
- Best practices

### Remaining Work

⚠️ **TypeScript SDK API Reference:**
- `docs/sdks/typescript/api-reference.md` still references `@lanonasis/sdk` (not yet published)
- Should be updated to reference `@lanonasis/memory-client` instead

⚠️ **Python SDK:**
- Documentation exists but package not found in codebase
- Need to verify if Python SDK is implemented

⚠️ **Standalone Memory SDK:**
- Documentation exists but package not found
- Need to verify implementation status

These remaining items are lower priority as they reference packages that may not be published yet.

