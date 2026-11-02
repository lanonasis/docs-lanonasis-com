/**
 * renderDoc used to append "." to every tool description, so registry
 * descriptions that already end in a period rendered as "caller.." (seen on
 * delete_memory and purge_deleted_memories, docs PR #42 review).
 *
 *   node --test scripts/__tests__/render-doc-punctuation.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderDoc } from '../generate-mcp-tools-doc.mjs';

const tool = (name, description) => ({ name, description, inputProperties: [] });

test('a description that already ends in a period keeps exactly one', () => {
  const doc = renderDoc([tool('delete_memory', 'Soft-delete a memory by ID. Deleted memories can be restored.')]);
  assert.ok(doc.includes('Deleted memories can be restored.\n'));
  assert.ok(!doc.includes('restored..'));
});

test('a description without terminal punctuation gets a period', () => {
  const doc = renderDoc([tool('get_memory', 'Get a memory by ID')]);
  assert.ok(doc.includes('Get a memory by ID.\n'));
});

test('a description ending in ? or ! is left alone', () => {
  const doc = renderDoc([tool('memory_ask_profile', 'Ask the profile a question?')]);
  assert.ok(doc.includes('Ask the profile a question?\n'));
  assert.ok(!doc.includes('question?.'));
});
