/**
 * generate-mcp-tools-doc.mjs
 *
 * Source-derived generator/validator for docs/mcp/tools.md.
 *
 * Reads the registered tool registry in apps/mcp-core/src/index.ts (the only
 * authoritative source for the MCP tool surface), then either:
 *   - writes a fresh docs/mcp/tools.md (no --check flag), or
 *   - diffs the existing docs/mcp/tools.md against the registry (--check).
 *
 * The generator is the source of truth: the doc is a build artifact. If the
 * registry changes, regenerate via `node scripts/generate-mcp-tools-doc.mjs`.
 *
 * Tool grouping:
 *   - Memory tools           (memory_*)
 *   - Intelligence tools     (intelligence_*)
 *   - Behavior tools         (behavior_*)
 *   - API key tools          (create_api_key, list_api_keys, ...)
 *   - Platform tools         (everything else: search_lanonasis_docs,
 *                             get_health_status, get_auth_status,
 *                             get_organization_info, create_project,
 *                             list_projects, get_config, set_config)
 *
 * Usage:
 *   node scripts/generate-mcp-tools-doc.mjs          # write
 *   node scripts/generate-mcp-tools-doc.mjs --check  # verify parity
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');
const MCP_SRC = join(REPO_ROOT, 'apps/mcp-core/src/index.ts');
const TOOLS_DOC = join(__dirname, '..', 'docs/mcp/tools.md');
const CHECK_MODE = process.argv.includes('--check');

/**
 * Parse the MCP tool registry from mcp-core/src/index.ts.
 *
 * The registry is an array of objects each shaped like:
 *   {
 *     name: '<tool_name>',
 *     description: '<human-readable>',
 *     annotations: toolAnnotations.<tool_name> | { title, readOnlyHint, ... },
 *     inputSchema: { type: 'object', properties: {...}, required: [...] },
 *     handler: async (...) => {...}
 *   }
 *
 * Source-of-truth grep patterns:
 *   - name: '...' inside the `tools` array (we filter by indentation: 6 spaces)
 *   - description: '...' on the line directly after
 */
/**
 * Extract the body of the `tools` registry array between its opening `[` and
 * the matching `];` token at the same indentation as the opening `const tools`.
 *
 * We track string-literal and template-literal boundaries so `];` inside a
 * string body (e.g. `description: 'something'];`) does not terminate the
 * match. We also skip bracket pairs inside comments and strings.
 *
 * Returns the substring strictly between the opening `[` and the line
 * containing the matching `];` (so the body keeps its interior indentation),
 * or `null` if no matching close is found.
 */
function extractRegistryBody(source, openIndex, openIndent) {
  const bracketStart = source.indexOf('[', openIndex);
  if (bracketStart === -1) return null;

  let depth = 1;
  let i = bracketStart + 1;
  const len = source.length;
  let lineStart = i;
  let closeLineStart = -1;

  while (i < len && depth > 0) {
    const ch = source[i];
    if (ch === '\n') {
      lineStart = i + 1;
      i++;
      continue;
    }
    // Skip line comments.
    if (ch === '/' && source[i + 1] === '/') {
      const nl = source.indexOf('\n', i);
      i = nl === -1 ? len : nl;
      continue;
    }
    // Skip block comments.
    if (ch === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      i = end === -1 ? len : end + 2;
      continue;
    }
    // Skip single-quoted strings (with `\'` and `\\` escapes).
    if (ch === "'") {
      i++;
      while (i < len && source[i] !== "'") {
        if (source[i] === '\\') i += 2;
        else if (source[i] === '\n') { lineStart = i + 1; i++; }
        else i++;
      }
      i++;
      continue;
    }
    // Skip double-quoted strings.
    if (ch === '"') {
      i++;
      while (i < len && source[i] !== '"') {
        if (source[i] === '\\') i += 2;
        else if (source[i] === '\n') { lineStart = i + 1; i++; }
        else i++;
      }
      i++;
      continue;
    }
    // Skip template literals.
    if (ch === '`') {
      i++;
      while (i < len && source[i] !== '`') {
        if (source[i] === '\\') i += 2;
        else if (source[i] === '\n') { lineStart = i + 1; i++; }
        else i++;
      }
      i++;
      continue;
    }
    if (ch === '[') {
      depth++;
      i++;
      continue;
    }
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        // Only accept the registry close when `]` sits at the exact
        // indentation of the opening `const tools` line and is followed by
        // `;`. Nested array closes at different indents (e.g. inside a
        // handler body) are ignored.
        const prefix = source.slice(lineStart, i);
        if (prefix === openIndent && source[i + 1] === ';') {
          closeLineStart = lineStart;
          break;
        }
      }
      i++;
      continue;
    }
    i++;
  }

  if (depth !== 0 || closeLineStart === -1) return null;
  return source.slice(bracketStart + 1, closeLineStart);
}

function extractToolRegistry(source) {
  const tools = [];
  // Locate the registry by balanced extraction: find the opening
  // `const tools = [` (or `const tools: T[] = [`) at any indent, capture that
  // indent, then scan forward until we find a `];` at the SAME indent. This
  // tolerates nested `];` sequences in handler bodies (e.g. an inline array
  // literal) and any reasonable indentation of the close marker.
  const openMatch = source.match(/^(\s*)const\s+tools(?:\s*:\s*[A-Za-z_][\w<>,\s\[\]]*)?\s*=\s*\[/m);
  if (!openMatch) {
    throw new Error('Could not locate MCP tool registry array in ' + MCP_SRC);
  }
  const openIndent = openMatch[1];
  const body = extractRegistryBody(source, openMatch.index, openIndent);
  if (body === null) {
    throw new Error('Could not locate MCP tool registry array in ' + MCP_SRC);
  }

  // Walk the body. Each tool object starts with `{` at column 4 and ends at the
  // matching `}`. We split on `}\n    ]` to capture the closing of each entry.
  // Simpler: tokenize by `    {` at column 4 and find the next `    }` at column 4.
  // Each tool entry is delimited by a `{` and a matching `}` at the same indent
  // level (6 spaces). The closing `}` may be followed by a comma.
  const entryRegex = /^      \{([\s\S]*?)^      \}(?:,|$)/gm;
  let match;
  while ((match = entryRegex.exec(body)) !== null) {
    const entry = match[1];
    const nameMatch = entry.match(/^\s*name:\s*'([a-z_]+)'/m);
    const descMatch = entry.match(/^\s*description:\s*'((?:[^'\\]|\\.)*)'/m);
    if (!nameMatch) continue;
    tools.push({
      name: nameMatch[1],
      description: descMatch ? descMatch[1].replace(/\\'/g, "'") : '',
      annotations: extractAnnotations(entry),
      inputProperties: extractInputProperties(entry),
    });
  }
  return tools;
}

function extractAnnotations(entry) {
  const m = entry.match(/annotations:\s*toolAnnotations\.([a-z_]+)/);
  if (!m) return null;
  return m[1];
}

function extractInputProperties(entry) {
  // Find inputSchema.properties block: `{ type: 'object', properties: { ... }, required: [...] }`
  // Within each tool entry, the inputSchema opens at 8 spaces and properties at 10 spaces;
  // individual property fields live at 12 spaces.
  const schemaMatch = entry.match(/inputSchema:\s*\{([\s\S]*?)\n\s{8}\}/);
  if (!schemaMatch) return [];
  const propsBlock = schemaMatch[1];
  const propsMatch = propsBlock.match(/properties:\s*\{([\s\S]*?)\n\s{10}\}/);
  if (!propsMatch) return [];
  const inner = propsMatch[1];
  const result = [];
  // Each property entry is `<name>: { ... type: '<type>' ... }` at 12-space indent.
  // Field names can be quoted or unquoted, and types can include unions like `'string' | 'null'`.
  const fieldRegex = /^\s{12}([a-z_]+):\s*\{[^}]*type:\s*'([^']+)'/gm;
  let m;
  while ((m = fieldRegex.exec(inner)) !== null) {
    result.push({ name: m[1], type: m[2] });
  }
  return result;
}

const GROUP_ORDER = [
  {
    label: 'Memory Tools',
    predicate: (t) => /^memory_/.test(t.name) || MEMORY_VERBS.has(t.name),
  },
  {
    label: 'Intelligence Tools',
    predicate: (t) => /^intelligence_/.test(t.name),
  },
  {
    label: 'Behavior Tools',
    predicate: (t) => /^behavior_/.test(t.name),
  },
  {
    label: 'API Key Tools',
    predicate: (t) => /api_key/.test(t.name),
  },
  {
    label: 'Platform Tools',
    predicate: (t) => true, // catch-all
  },
];

const MEMORY_VERBS = new Set([
  'create_memory',
  'get_memory',
  'update_memory',
  'delete_memory',
  'list_memories',
  'search_memories',
  'create_memory_chunked',
]);

function groupTools(tools) {
  const groups = GROUP_ORDER.map((g) => ({ ...g, items: [] }));
  for (const t of tools) {
    const target = groups.find((g) => g.predicate(t));
    if (target) target.items.push(t);
  }
  // Drop empty groups except the catch-all "Platform Tools"
  return groups.filter((g) => g.items.length > 0 || g.label === 'Platform Tools');
}

function escapePipe(s) {
  return String(s).replace(/\|/g, '\\|');
}

function renderDoc(tools) {
  const groups = groupTools(tools);
  const stamp = new Date().toISOString().slice(0, 10);
  let out = '';
  out += '---\n';
  out += 'title: MCP Tools Reference\n';
  out += 'sidebar_label: Tools Reference\n';
  out += '---\n\n';
  out += '<!-- DO NOT EDIT BY HAND. Generated from apps/mcp-core/src/index.ts by\n';
  out += '     scripts/generate-mcp-tools-doc.mjs. Run `node scripts/generate-mcp-tools-doc.mjs`\n';
  out += '     to regenerate. CI fails the build if the doc and the registry disagree\n';
  out += '     (`bun run validate:mcp-tools`). -->\n\n';
  out += '# MCP Tools Reference\n\n';
  out += `Complete reference for all ${tools.length} MCP tools registered in the\n`;
  out += 'LanOnasis MCP server. Tool names, descriptions, and parameter shapes are\n';
  out += 'extracted directly from the source registry at build time.\n\n';
  out += '## Discovery\n\n';
  out += '- **HTTP transport**: `GET https://mcp.lanonasis.com/api/v1/tools` (auth required)\n';
  out += '- **JSON-RPC over HTTP**: `POST https://mcp.lanonasis.com/` with method `tools/list`\n';
  out += '- **SSE**: `GET https://mcp.lanonasis.com/sse` (then send `tools/list` over the open stream)\n\n';

  for (const group of groups) {
    out += `## ${group.label}\n\n`;
    for (const t of group.items) {
      out += `### ${t.name}\n\n`;
      if (t.description) out += `${t.description}.\n\n`;
      if (t.annotations) {
        out += `**Annotations**: \`toolAnnotations.${t.annotations}\` (read/write/destructive hints from the source registry).\n\n`;
      }
      if (t.inputProperties.length > 0) {
        out += '**Parameters**:\n\n';
        out += '| Name | Type |\n';
        out += '|------|------|\n';
        for (const p of t.inputProperties) {
          out += `| \`${p.name}\` | ${p.type} |\n`;
        }
        out += '\n';
      } else {
        out += '**Parameters**: none.\n\n';
      }
    }
  }

  out += '## Common Error Codes\n\n';
  out += '| Code | Description |\n';
  out += '|------|-------------|\n';
  out += '| -32600 | Invalid Request |\n';
  out += '| -32601 | Method Not Found |\n';
  out += '| -32602 | Invalid Params |\n';
  out += '| -32603 | Internal Error |\n';
  out += '| -32000 | Server Error |\n';
  out += '| -32001 | Authentication Required |\n';
  out += '| -32002 | Permission Denied |\n';
  out += '| -32003 | Rate Limit Exceeded |\n';
  out += '| -32004 | Resource Not Found |\n';
  out += '| -32005 | Validation Error |\n\n';

  out += '## Best Practices\n\n';
  out += '1. **Always check for errors**: Inspect the response for `error` field\n';
  out += '2. **Use appropriate memory types**: Choose the right type for better organization\n';
  out += '3. **Add tags**: Tags improve searchability and organization\n';
  out += '4. **Set thresholds**: Use appropriate similarity thresholds for search (0.7-0.9 recommended)\n';
  out += '5. **Batch operations**: Use bulk operations when possible\n';
  out += '6. **Handle pagination**: Use `page` and `limit` for large result sets\n';
  out += '7. **Cache tool definitions**: Cache `tools/list` results to reduce API calls\n\n';

  out += '## Related Documentation\n\n';
  out += '- [MCP Overview](./overview.md) - MCP server overview\n';
  out += '- [IDE Integration](./ide-integration.md) - Connect IDEs to MCP\n';
  out += '- [Production Server](./production-server.md) - Production deployment\n';

  out += `\n<!-- Generated ${stamp} from ${tools.length} registered tools. -->\n`;
  return out;
}

function main() {
  if (!existsSync(MCP_SRC)) {
    console.error(`❌ MCP source not found at ${MCP_SRC}`);
    process.exit(1);
  }
  const source = readFileSync(MCP_SRC, 'utf8');
  const tools = extractToolRegistry(source);
  if (tools.length === 0) {
    console.error('❌ Parsed 0 tools from MCP source — check regex');
    process.exit(1);
  }
  tools.sort((a, b) => a.name.localeCompare(b.name));
  const doc = renderDoc(tools);

  if (CHECK_MODE) {
    if (!existsSync(TOOLS_DOC)) {
      console.error(`❌ ${TOOLS_DOC} missing — run without --check to generate.`);
      process.exit(1);
    }
    const existing = readFileSync(TOOLS_DOC, 'utf8');
    // Strip the date-bearing generation footer before comparing — otherwise
    // the check fails on any day after the file was last generated, even when
    // the source registry hasn't changed.
    const normalize = (s) => s.replace(/<!-- Generated \d{4}-\d{2}-\d{2} from \d+ registered tools\. -->\n/, '');
    if (normalize(existing) !== normalize(doc)) {
      console.error(`❌ MCP tools doc is out of sync with source registry (${tools.length} tools).`);
      console.error(`   Run: node scripts/generate-mcp-tools-doc.mjs`);
      process.exit(1);
    }
    console.log(`✅ MCP tools doc parity verified (${tools.length} tools).`);
    return;
  }

  writeFileSync(TOOLS_DOC, doc, 'utf8');
  console.log(`✅ Generated ${TOOLS_DOC} (${tools.length} tools).`);
}

main();
