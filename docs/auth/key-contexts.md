---
title: Key Contexts
sidebar_label: Key Contexts
sidebar_position: 2
description: How LanOnasis API keys carry a key_context discriminator that scopes memory reads and writes to personal, team, enterprise, or legacy boundaries.
---

# Key Contexts

> **Source of truth:** `apps/onasis-core/services/auth-gateway/src/services/api-key.service.ts`
> (function `getContextDefaultScope`, lines 550–559; type `ApiKeyContext`, line 20;
> default-scope resolution, lines 561–572).
> **Canonical spec:** `docs/plans/memory-context-separation.md` (decisions D4, D6).
> This page documents the shipped behavior of the auth gateway. If the spec and
> the source disagree, **follow the source** and open an issue against the spec.

Every LanOnasis API key carries an optional `key_context` discriminator. The
context tells the auth gateway which memory boundary to enforce at validation
time. Keys without a context are treated as **legacy** and operate without any
boundary filter — backward-compatible with all pre-context integrations.

## Values

| Context | Default scope | Boundary behavior |
|---------|--------------|-------------------|
| `personal` | `memories:personal:*` | Restricts reads and writes to the authenticated user's own memory records. |
| `team` | `memories:team:*` | Restricts reads and writes to the authenticated user's organization; removes the personal user fence. |
| `enterprise` | `memories:*` | No additional personal or team boundary. Multi-tenant tenant fence only. |
| *(unset)* → `legacy` | `memories:*` (or the explicit `permissions` you set) | No boundary enforcement. Backward-compatible. |

These are the only values the auth gateway accepts. The validator returns
`400` with the message `Invalid key_context. Allowed: personal, team, enterprise`
for any other value (see `normalizeApiKeyContext` in `api-key.service.ts:529`).

## How the discriminator is stored

- **Table:** `security_service.api_keys` (the canonical table the auth gateway
  reads from; the deprecated `security_service.stored_api_keys` and
  `vsecure.lanonasis_api_keys` tables are no longer consulted).
- **Column:** `key_context TEXT NULL`
- **Constraint:** `CHECK (key_context IN ('personal', 'team', 'enterprise'))`
  — `NULL` is valid and means "legacy".
- **Default:** `NULL` (legacy). New keys without an explicit `key_context`
  parameter are created as legacy keys.

## Key prefixes

The `lano_` prefix is used for **all** API keys regardless of context. The
discriminator lives in the database column, not in the prefix. The visual-only
prefixes `lms_p_` / `lms_t_` are deferred — see spec decision **D4** in
`memory-context-separation.md`.

Legacy `vx_*` and `lns_*` keys continue to validate during the migration
window. New keys created via `POST /v1/api-keys` are minted with the `lano_`
prefix.

## Creating a key with a context

```bash
curl -X POST https://auth.lanonasis.com/v1/api-keys \
  -H "Authorization: Bearer <oauth_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal automation key",
    "key_context": "personal",
    "expires_in_days": 90
  }'
```

When `key_context` is set, the auth gateway auto-injects the matching default
scope into the key's `permissions` (see `resolveApiKeyPermissions` at
`api-key.service.ts:561`). You can pass additional scopes alongside the
default — the default is added if not already present.

The CLI accepts the same parameter:

```bash
onasis api-keys create \
  --name "Team CI key" \
  --key-context team \
  --expires-in-days 30
```

The `--key-context` flag was added to the CLI per spec decision P5; see
`apps/lanonasis-maas/cli/src/commands/api-keys.ts`.

## How the context reaches the request handler

At validation time, `validateAPIKey()` reads the row's `key_context` and
returns it on the result. `buildUnifiedUserFromApiKey()` in
`apps/onasis-core/services/auth-gateway/src/middleware/auth.ts` maps the
context onto `UnifiedUser.keyContext` (type `'personal' | 'team' | 'enterprise' | 'legacy'`).
Request handlers see `req.user.keyContext` and `req.scopes`.

Read enforcement (memory `get`, `list`, and `search` paths) uses
`resolveMemoryContext(keyContext, scopes)` from
`apps/onasis-core/supabase/functions/_shared/memory-context.ts` to decide which
boundary filter to inject into the Supabase query:

```ts
// Resolves context from key_context + scopes.
// Order: explicit key_context wins, then scope prefix, then 'legacy'.
function resolveMemoryContext(keyContext, scopes) {
  if (keyContext === 'personal') return 'personal';
  if (keyContext === 'team') return 'team';
  if (keyContext === 'enterprise') return 'enterprise';
  if (scopes.includes('memories:*')) return 'enterprise';
  if (scopes.some(s => s.startsWith('memories:personal:'))) return 'personal';
  if (scopes.some(s => s.startsWith('memories:team:'))) return 'team';
  return 'legacy'; // no boundary
}
```

Boundary filters are applied through feature flags
(`FEATURE_MEMORY_CONTEXT_SHADOW` and `FEATURE_MEMORY_CONTEXT_ENFORCE`) — see
the canonical spec §2.4 for the rollout state and §P4 for the policy.

## Introspecting a key

`GET /v1/api-keys` returns the key's `key_context` field on each row. The
dashboard key list view surfaces this as a `Personal` / `Team` / `Enterprise`
/ `Legacy` badge per key.

```bash
curl https://auth.lanonasis.com/v1/api-keys \
  -H "Authorization: Bearer <oauth_token>"
```

```json
[
  {
    "id": "key_01H...",
    "name": "Personal automation key",
    "key_context": "personal",
    "permissions": ["memories:personal:*"],
    "is_active": true,
    "created_at": "2026-07-18T03:00:00Z"
  }
]
```

## Migration path

1. New keys default to **legacy** (no `key_context` column value, no boundary
   filter). Existing integrations are unaffected.
2. To opt in: re-create the key with an explicit `key_context`. The previous
   legacy key can be revoked once the new one is verified.
3. To introspect behavior before turning on enforcement, enable
   `FEATURE_MEMORY_CONTEXT_SHADOW=true` in the gateway env. The gateway logs
   the boundary filter it would apply for each request without actually
   filtering reads. Compare shadow logs against production to confirm the
   boundary matches your data layout before flipping to
   `FEATURE_MEMORY_CONTEXT_ENFORCE=true`.

## What's NOT in scope

- **No new key prefixes.** The `lms_p_` / `lms_t_` prefixes remain deferred
  (spec D4). Adding a visual-only prefix is a future UX enhancement, not a
  validation dependency.
- **No write-path enforcement yet.** As of spec §2.4 closeout (2026-05-07),
  boundary enforcement is implemented for memory reads (`get`, `list`,
  `search`). Write-path context ownership is part of the later
  product/governance phase and is not enforced on `create` / `update`.
- **No database-level RLS changes.** Boundary enforcement is
  application-level. A future migration may layer RLS on top; this page will
  be updated when that ships.
