/**
 * extract-registry-body.test.mjs
 *
 * Synthetic regression fixture for scripts/generate-mcp-tools-doc.mjs.
 *
 * Bug history (PR #29 follow-up):
 *   `extractRegistryBody` used to call `source.indexOf('[', openMatch.index)`
 *   to locate the assignment-array opening bracket. That works for untyped
 *   declarations like `const tools = [`, but for a typed declaration such as
 *   `const tools: McpTool[] = [` the FIRST `[` after `openMatch.index` is the
 *   bracket pair inside the type annotation (`McpTool[]`), not the assigned
 *   array. The scanner returned `null`, causing `validate:mcp-tools` to fail.
 *
 * This fixture covers:
 *   1. Typed registry with a single tool
 *   2. Typed registry with multiple tools, nested arrays, strings containing
 *      `];`, and a block comment containing `];`
 *   3. Untyped registry (regression: must still parse, to keep mcp-core parity)
 *   4. Typed registry with a generic type expression that contains two `[`
 *      brackets (`Array<McpTool[]>`) — assignment bracket is the LAST one
 *
 * Each case asserts the parsed tool count and that the scanner returns the
 * correct tool names in order. Run with `node --test`:
 *
 *   node --test scripts/__tests__/extract-registry-body.test.mjs
 *
 * Exits non-zero on any failed assertion so it can gate CI.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  extractToolRegistry,
} from '../generate-mcp-tools-doc.mjs';

const ANNOT = `const toolAnnotations = {
  foo_tool: { title: 'Foo', readOnlyHint: true },
  bar_tool: { title: 'Bar', readOnlyHint: false },
  baz_tool: { title: 'Baz', readOnlyHint: true },
};`;

function wrap(classBody) {
  // A minimal class shell so the source compiles in spirit and matches the
  // indentation patterns the scanner expects (6-space indent for the `const
  // tools` opening, 6-space indent for each `{`, 8-space for inner fields).
  return `${ANNOT}\n\nexport type McpTool = any;\n\nclass Registry {\n  async registerTools(): Promise<void> {\n${classBody}
  }\n}\n`;
}

test('typed registry with single tool extracts 1 tool by correct name', () => {
  const source = wrap(`    const tools: McpTool[] = [
      {
        name: 'foo_tool',
        description: 'A typed registry tool',
        annotations: toolAnnotations.foo_tool,
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' }
          }
        },
        handler: async () => {
          return null;
        }
      }
    ];`);

  const tools = extractToolRegistry(source);
  assert.equal(tools.length, 1, 'should parse exactly one tool');
  assert.equal(tools[0].name, 'foo_tool');
  assert.equal(tools[0].description, 'A typed registry tool');
});

test('typed registry with nested arrays, strings, and comments', () => {
  const source = wrap(`    const tools: McpTool[] = [
      {
        name: 'foo_tool',
        description: 'Tool with a nested array and a string containing ];',
        annotations: toolAnnotations.foo_tool,
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } }
          },
          required: ['query']
        },
        handler: async () => {
          /* nested ]; inside a block comment should be ignored */
          const inner = ['one', 'two']; // <- contains ];
          return inner;
        }
      },
      {
        name: 'bar_tool',
        description: 'Second tool after a noisy first entry',
        annotations: toolAnnotations.bar_tool,
        inputSchema: { type: 'object', properties: {} },
        handler: async () => null
      }
    ];`);

  const tools = extractToolRegistry(source);
  assert.equal(tools.length, 2, 'should parse both tools');
  assert.deepEqual(
    tools.map((t) => t.name),
    ['foo_tool', 'bar_tool'],
    'tools must appear in declaration order',
  );
  assert.equal(tools[1].description, 'Second tool after a noisy first entry');
});

test('untyped registry (mcp-core parity) still parses correctly', () => {
  // Same shape as the current production source: no type annotation.
  const source = wrap(`    const tools = [
      {
        name: 'foo_tool',
        description: 'Untyped tool',
        annotations: toolAnnotations.foo_tool,
        inputSchema: { type: 'object', properties: {} },
        handler: async () => null
      },
      {
        name: 'bar_tool',
        description: 'Second untyped tool',
        annotations: toolAnnotations.bar_tool,
        inputSchema: { type: 'object', properties: {} },
        handler: async () => null
      }
    ];`);

  const tools = extractToolRegistry(source);
  assert.equal(tools.length, 2);
  assert.deepEqual(tools.map((t) => t.name), ['foo_tool', 'bar_tool']);
});

test('typed registry with deep generic type containing extra `[` brackets', () => {
  // The opening type expression contains TWO `[` characters (`Array<McpTool[]>`);
  // the assignment bracket is the LAST one. The old `source.indexOf('[',
  // openMatch.index)` would land on the first `[` (inside `Array<...>`) and
  // return null. Use a realistic type shape that the scanner's regex
  // (`[\w<>,\s\[\]]*`) can actually parse.
  const source = wrap(`    const tools: Array<McpTool[]> = [
      {
        name: 'foo_tool',
        description: 'Survives deep generic typing',
        annotations: toolAnnotations.foo_tool,
        inputSchema: { type: 'object', properties: {} },
        handler: async () => null
      },
      {
        name: 'baz_tool',
        description: 'Second tool survives too',
        annotations: toolAnnotations.baz_tool,
        inputSchema: { type: 'object', properties: {} },
        handler: async () => null
      }
    ];`);

  const tools = extractToolRegistry(source);
  assert.equal(tools.length, 2);
  assert.deepEqual(tools.map((t) => t.name), ['foo_tool', 'baz_tool']);
});

// ---------------------------------------------------------------------------
// Buggy-vs-fixed cross-check.
//
// Recreate the OLD buggy `extractRegistryBody` inline so we can prove that the
// pre-fix code returns null on typed registries while the FIXED exported
// implementation returns the expected tools. This locks in the defect the
// patch was written to close, independent of whether anyone reverts the fix.
// ---------------------------------------------------------------------------

function buggyExtractRegistryBody(source, openIndex, openIndent) {
  // Exact transcription of the pre-fix logic from
  // scripts/generate-mcp-tools-doc.mjs (commit c72bc85 and earlier).
  const bracketStart = source.indexOf('[', openIndex);
  if (bracketStart === -1) return null;
  let depth = 1;
  let i = bracketStart + 1;
  const len = source.length;
  let lineStart = i;
  let closeLineStart = -1;
  while (i < len && depth > 0) {
    const ch = source[i];
    if (ch === '\n') { lineStart = i + 1; i++; continue; }
    if (ch === '/' && source[i + 1] === '/') { const nl = source.indexOf('\n', i); i = nl === -1 ? len : nl; continue; }
    if (ch === '/' && source[i + 1] === '*') { const end = source.indexOf('*/', i + 2); i = end === -1 ? len : end + 2; continue; }
    if (ch === "'") { i++; while (i < len && source[i] !== "'") { if (source[i] === '\\') i += 2; else if (source[i] === '\n') { lineStart = i + 1; i++; } else i++; } i++; continue; }
    if (ch === '"') { i++; while (i < len && source[i] !== '"') { if (source[i] === '\\') i += 2; else if (source[i] === '\n') { lineStart = i + 1; i++; } else i++; } i++; continue; }
    if (ch === '`') { i++; while (i < len && source[i] !== '`') { if (source[i] === '\\') i += 2; else if (source[i] === '\n') { lineStart = i + 1; i++; } else i++; } i++; continue; }
    if (ch === '[') { depth++; i++; continue; }
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        const prefix = source.slice(lineStart, i);
        if (prefix === openIndent && source[i + 1] === ';') { closeLineStart = lineStart; break; }
      }
      i++; continue;
    }
    i++;
  }
  if (depth !== 0 || closeLineStart === -1) return null;
  return source.slice(bracketStart + 1, closeLineStart);
}

const TYPED_OPENING_RE = /^(\s*)const\s+tools(?:\s*:\s*[A-Za-z_][\w<>,\s\[\]]*)?\s*=\s*\[/m;

test('buggy extract returns null on typed registry (reproduces the defect)', () => {
  const source = wrap(`    const tools: McpTool[] = [
      {
        name: 'foo_tool',
        description: 'A typed registry tool',
        annotations: toolAnnotations.foo_tool,
        inputSchema: { type: 'object', properties: {} },
        handler: async () => null
      }
    ];`);
  const m = source.match(TYPED_OPENING_RE);
  assert.ok(m, 'opening regex should still match the typed declaration');
  const buggyResult = buggyExtractRegistryBody(source, m.index, m[1]);
  assert.equal(
    buggyResult,
    null,
    'pre-fix logic must return null on a typed registry — that is the bug',
  );
});

test('fixed extract returns the expected body on the same typed registry', () => {
  const source = wrap(`    const tools: McpTool[] = [
      {
        name: 'foo_tool',
        description: 'A typed registry tool',
        annotations: toolAnnotations.foo_tool,
        inputSchema: { type: 'object', properties: {} },
        handler: async () => null
      }
    ];`);
  const tools = extractToolRegistry(source);
  assert.equal(tools.length, 1);
  assert.equal(tools[0].name, 'foo_tool');
});
