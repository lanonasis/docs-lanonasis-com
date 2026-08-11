---
title: "Source-Contract Decision — Onasis-CORE #54 (prefer_cache gap)"
sidebar_label: "Decision: Onasis-CORE #54 prefer_cache"
---

# Source-Contract Decision Record

**ID:** `SCD-2026-08-08-onasis-core-54-prefer-cache`
**Status:** Open (source-contract gap, not patched from docs)
**Owner:** Onasis-CORE maintainers (Edge Function + OpenAPI contract)

## Summary

`prefer_cache` is implemented and used by the `intelligence-analyze-patterns` Edge Function but is **absent from the `AnalyzePatternsRequest` schema** in the Onasis-CORE OpenAPI contract. This mismatch was raised during the review of [Onasis-CORE #54](https://github.com/thefixer3x/Onasis-CORE/pull/54) and remains a known source-contract gap.

## Evidence

- Review comment on Onasis-CORE #54 (path `docs/supabase-api/SUPABASE_REST_API_OPENAPI.yaml`, line 1997):

  > The `AnalyzePatternsRequest` schema is missing the `prefer_cache` property, which is implemented and used in the `intelligence-analyze-patterns` Edge Function (see `supabase/functions/intelligence-analyze-patterns/index.ts`). Adding this property to the OpenAPI contract ensures that clients are aware of this parameter and can utilize the pre-reasoned conclusions layer.

- Implementation exists in the Edge Function:
  - `supabase/functions/intelligence-analyze-patterns/index.ts:36` — `prefer_cache?: boolean`
  - `supabase/functions/intelligence-analyze-patterns/index.ts:84-104` — prefer_cache layer reads pre-reasoned conclusions before calling the LLM

- OpenAPI contract gap (verified 2026-08-08 against `apps/onasis-core`):
  - `docs/supabase-api/SUPABASE_REST_API_OPENAPI.yaml:1997-2034` — `AnalyzePatternsRequest` includes `time_range_days`, `include_insights`, `response_format`, `organization_id`, `topic_id`, `memory_type`, `memory_types`, `query_scope` — **no `prefer_cache`**.

## Decision

This docs repository does **not** patch Onasis-CORE. The fix belongs in the Onasis-CORE repository (OpenAPI source of truth), and the docs card that depends on it should be updated after the contract is corrected.

Recommended Onasis-CORE change (from the review comment, to be applied by Onasis-CORE maintainers):

```yaml
        query_scope:
          $ref: '#/components/schemas/MemoryQueryScope'
          description: Scope hint for personal vs organization memory analysis
        prefer_cache:
          type: boolean
          default: false
          description: If true, return pre-reasoned conclusions before calling LLM
```

## Impact on docs

- REST/OpenAPI-derived docs will reflect `prefer_cache` only after Onasis-CORE #54 follow-up lands and the docs source sync is re-run.
- The MCP surface (MCP tool docs) is unaffected by this gap; it is scoped to the REST OpenAPI contract.
- No docs example in this repository currently claims `prefer_cache` on `AnalyzePatternsRequest` via REST.

## Acceptance for closing

1. Onasis-CORE PR adds `prefer_cache` to `AnalyzePatternsRequest` in `SUPABASE_REST_API_OPENAPI.yaml`.
2. Docs source sync (`scripts/sync-docs-specs.js`) regenerates without drift (`bun run check:docs-sync`).
3. This decision record is updated to `Closed` with the Onasis-CORE commit SHA.
