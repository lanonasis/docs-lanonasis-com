---
title: Operations Runbook
sidebar_label: Operations Runbook
---

# Operations Runbook — First-Incident Playbooks

This runbook is the first-response reference for operators of the LanOnasis platform. It covers the three most common incident classes:

1. [API key rotation](#1-api-key-rotation)
2. [MCP health degradation](#2-mcp-health-degradation)
3. [Quota / rate-limit handling](#3-quota--rate-limit-handling)

Every playbook includes the observable checks to run first, the actions to take, and the escalation boundary where a human owner must take over. Keep this page source-derived: when the underlying contract changes (health payload shape, rate-limit defaults, key endpoints), update this page in the same change.

> Platform entry points (from [Operating the Platform](./operating-platform.md)):
> - API Gateway: `api.lanonasis.com`
> - MCP Core: `mcp.lanonasis.com` (SSE/HTTP, `/health` and `/api/v1/health`)
> - Auth Gateway: `auth.lanonasis.com`

## Severity definitions

| Severity | Meaning | Response target |
|----------|---------|-----------------|
| SEV3 | Single user / key affected, service otherwise healthy | Same business day |
| SEV2 | Partial service degradation (one surface: MCP, REST, or auth) | < 1 hour |
| SEV1 | Platform-wide outage or suspected credential exposure | Immediate, page on-call |

---

## 1. API key rotation

**Trigger:** suspected key leak, scheduled rotation policy, offboarding, or a vendor key compromised in an upstream `.env`.

### Observable checks (run first)

```bash
# List API keys / projects (CLI surface)
onasis api-keys list

# Inspect MCP tool availability for the key manager
onasis mcp tools | grep -i key

# Confirm which keys are active and their creation dates
onasis api-keys get <key-id>
```

- If you see `RateLimit` or `401 Unauthorized` on a previously working key, treat it as a possible compromised or expired key before assuming platform failure.
- Check the audit log surface for unusual access patterns (`onasis api-keys security-events`).

### Actions

1. **Create a new key** before revoking the old one (never leave the service without a valid credential):
   ```bash
   EXISTING_SCOPES=$(onasis api-keys get <old-key-id> | jq -r '.data.scopes | join(",")')
   onasis api-keys create --name "rotation-<timestamp>" --scopes "$EXISTING_SCOPES"
   ```
   If the current scopes are not discoverable automatically, stop and require the operator to provide the intended replacement scope set explicitly before creating the new key.
2. **Migrate consumers** to the new key. Clients should reference the key by handle/alias (see [Vendor Key Management](../keys/vendor-key-management.md)) so consumers pick up the new version automatically.
3. **Retire the old key** based on incident type:
   - **Scheduled rotation:** keep the old key only for the agreed verification window, confirm consumers have switched, then revoke it.
   - **Suspected compromise:** once containment is ready and consumers have an emergency replacement path, disable or revoke the old key immediately — do not wait out a routine verification window.
   ```bash
   onasis api-keys delete <old-key-id>
   ```
4. For **upstream vendor keys**, rotate inside the centralized key manager, not by editing `.env` files. Remove any provider keys from app configs after rotation (see [Vendor Key Management](../keys/vendor-key-management.md)).
5. Record the rotation in the audit trail and close out the ticket with the new key ID and the revoke time.

### Escalation boundary

- **Operator:** anyone with key-manager access can perform the rotation.
- **Escalate to SEV1 / security owner** if: the leaked key was a `service_role`-equivalent or `master_*` key, if you cannot confirm which consumers used the old key, or if the leak appears to include production database or vendor credentials. Do not silently rotate in that case — coordinate revocation windows with all consumers first.

---

## 2. MCP health degradation

**Trigger:** MCP tool calls start failing or timing out; clients report degraded tool responses; `/health` returns `503`.

### Observable checks (run first)

```bash
# The health endpoint is NOT rate-limited by design — use it as the ground truth
curl -sS --connect-timeout 5 --max-time 15 https://mcp.lanonasis.com/health
curl -sS --connect-timeout 5 --max-time 15 https://mcp.lanonasis.com/api/v1/health
```

The health handler returns `200` with status `healthy`, or `503` with status `degraded`/`unhealthy`, and a `services` block:

```json
{
  "status": "degraded",
  "services": {
    "database": "connected",
    "cache": "error",
    "mcp": "running"
  },
  "uptime": 12345,
  "version": "1.0.0",
  "timestamp": "2026-08-08T00:00:00.000Z",
  "response_time_ms": 42,
  "memory_usage": { "used": 123, "total": 256, "percentage": 48 }
}
```

`services.database` and `services.cache` may each report `connected`, `error`, or `disconnected` depending on the failing dependency.

Read the `services` block to localize the failure:

- `database: error|disconnected` → database connectivity problem (health check runs a fast DB probe with a 2 s timeout).
- `cache: error|disconnected` → Redis/cache problem (degraded but may still serve requests).
- `status: unhealthy` (whole payload failed) → process-level failure; check process liveness and logs.

### Actions

1. Confirm scope: is it MCP only, or REST too? A database outage affects both; a MCP-process issue affects only MCP.
2. For **database** issues: check database connection pool, credentials, and network path. Verify the DB handler reports `healthy` again after remediation.
3. For **cache** issues: verify Redis connectivity and restart the cache service; MCP should recover without full restart.
4. For **process** issues: inspect MCP Core logs, restart the service, and re-check `/health` until `status: healthy` with `services.database: connected`.
5. Re-run a real tool call (`onasis mcp tools`, then a read-only tool) to confirm functional recovery — presence of a 200 on `/health` is not the same as a working tool round-trip.

### Escalation boundary

- **SEV3 / operator:** cache degraded or a single tool failing with healthy DB.
- **SEV2:** database `error`/`disconnected`, or `/health` returning 503 for more than a few minutes. Alert the platform on-call.
- **SEV1:** full `unhealthy` across both REST and MCP with no local remediation path within 30 minutes — escalate to the infra owner; consider failover if the environment has one.

---

## 3. Quota / rate-limit handling

**Trigger:** a client receives `429 Too Many Requests`, or a tenant hits quota limits.

### Observable checks (run first)

The MCP server rate limiter responds with:

```json
{
  "error": "Too many requests",
  "retryAfter": 900
}
```

- `retryAfter` is in seconds and equals the configured window (`RATE_LIMIT_WINDOW_MS / 1000`).
- With `standardHeaders: true`, the response includes `RateLimit-*` headers (limit, remaining, reset) — inspect those to see the actual budget.
- `/health` is explicitly **excluded** from rate limiting — a 429 on health indicates a different problem (e.g. a proxy or WAF layer).

Default budget (from `apps/lanonasis-maas/src/config/environment.ts` unless overridden):

| Setting | Default | Meaning |
|---------|---------|---------|
| `RATE_LIMIT_WINDOW_MS` | `900000` (15 min) | Rolling window length |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |
| `AUTO_SUSPEND_RATE_LIMIT_VIOLATIONS` | `50` | Violations after which auto-suspend engages |

### Actions

1. **Identify the caller** — rate limits are per-IP / per-key depending on the layer. Ask the client for the exact 429 payload and `RateLimit-*` headers, not just "it failed".
2. **Distinguish quota vs rate limit**:
   - Rate limit (429, short `retryAfter`) → burst traffic. Retry after `retryAfter` with backoff, or batch requests.
   - Quota (4xx quota error, or `usage` reporting) → monthly/plan budget exhausted. Check `onasis api-keys usage` and the plan tier.
3. **Legitimate bursts**: obtain platform-owner approval before changing shared `RATE_LIMIT_MAX_REQUESTS` or `RATE_LIMIT_WINDOW_MS` defaults. Prefer a tenant-scoped override when available, then redeploy the service and confirm the new headers.
4. **Abuse / runaway client**: keep the limit, block the offending key, and contact the client. Auto-suspend at 50 violations should have engaged — verify the suspension state.
5. **Checklist before closing**: new limit is deployed, client confirms a 200 on a real request, and the `RateLimit-*` headers show headroom.

### Escalation boundary

- **Operator:** adjusting limits or unblocking a legitimate tenant key.
- **SEV2:** a single large tenant is blocked and the fix requires changing shared rate-limit defaults (affects all tenants) — escalate to the platform owner before changing global limits.
- **SEV1:** a distributed attack is exhausting the shared rate-limit budget (all tenants affected) — escalate to security/infra, do not keep raising limits to absorb it.

---

## Related

- [Operating the Platform](./operating-platform.md) — non-obvious operational facts
- [Vendor Key Management](../keys/vendor-key-management.md) — key manager flows
- [MCP Production Server](../mcp/production-server.md) — MCP deployment
- [Central Auth Gateway](../auth/central-auth-gateway.md) — authentication flows
