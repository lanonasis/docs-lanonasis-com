---
title: Device Authorization Flow
sidebar_label: Device Flow
sidebar_position: 3
description: How the OAuth 2.0 Device Authorization Grant (RFC 8628) is implemented on auth.lanonasis.com for CLI and headless clients.
---

# Device Authorization Flow

> **Source of truth:** `apps/onasis-core/services/auth-gateway/src/routes/device.routes.ts`
> (1,014 lines), mounted at `app.use('/oauth', deviceRoutes)` in
> `apps/onasis-core/services/auth-gateway/src/index.ts`. The token endpoint
> that handles the `urn:ietf:params:oauth:grant-type:device_code` grant lives
> in `apps/onasis-core/services/auth-gateway/src/controllers/oauth.controller.ts:307`.

LanOnasis implements the OAuth 2.0 Device Authorization Grant (RFC 8628) on
`auth.lanonasis.com/oauth/device/*`. This is the recommended flow for CLI
tools, MCP-integrated agents, and IDE extensions — anywhere a browser
redirect or localhost callback is awkward (SSH, containers, remote servers).

## Endpoint surface

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/oauth/device` | Request a new `device_code` + `user_code` pair. |
| `GET`  | `/oauth/device` | Verification page rendered in the user's browser. |
| `GET`  | `/oauth/device/check` | Validate that a `user_code` exists and is not expired. |
| `POST` | `/oauth/device/verify` | Submit the user's email OTP. |
| `POST` | `/oauth/device/authorize` | Approve the device and bind it to the user's session. |
| `POST` | `/oauth/device/deny` | Reject the pending device authorization. |
| `POST` | `/oauth/token` | CLI polls here with `grant_type=urn:ietf:params:oauth:grant-type:device_code`. |

The OAuth `/.well-known/oauth-authorization-server` discovery response on
`auth.lanonasis.com` lists `urn:ietf:params:oauth:grant-type:device_code`
among the supported grant types.

## End-to-end sequence

```
+--------+                                +----------------+         +-----------+
|  CLI   |                                |  auth.lanonasis|         |  Browser  |
+--------+                                +----------------+         +-----------+
    |                                            |                         |
    | 1. POST /oauth/device {client_id, scope}    |                         |
    |-------------------------------------------->                         |
    | 200 {device_code, user_code,                |                         |
    |       verification_uri,                     |                         |
    |       verification_uri_complete,            |                         |
    |       expires_in: 900, interval: 5}        |                         |
    |<--------------------------------------------                         |
    |                                            |                         |
    | Print user_code. Tell user:                |                         |
    |   "Visit https://auth.lanonasis.com/oauth/device|                    |
    |    and enter CODE ABCD-1234"               |                         |
    |                                            |                         |
    | 2. Poll POST /oauth/token                  |                         |
    |    grant_type=urn:ietf:params:oauth:       |                         |
    |    grant-type:device_code                  |                         |
    |    &device_code=...&client_id=...          |                         |
    |-------------------------------------------->                         |
    |                                            |                         |
    |                          (user opens URL)  |                         |
    |                                            |    GET /oauth/device    |
    |                                            |<------------------------|
    |                                            |    HTML form (CSP set)  |
    |                                            |------------------------>|
    |                                            |                         |
    |                            POST /oauth/device/verify (email + OTP)   |
    |                                            |<------------------------|
    |                                            |------------------------>|
    |                                            |                         |
    |                            POST /oauth/device/authorize              |
    |                                            |<------------------------|
    |                                            |------------------------>|
    |                                            |                         |
    | 3. Poll response:                          |                         |
    |    200 {access_token, refresh_token,       |                         |
    |         token_type, expires_in}            |                         |
    |<--------------------------------------------                         |
    |                                            |                         |
```

## Step 1 — request a device code

```bash
curl -X POST https://auth.lanonasis.com/oauth/device \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "lanonasis-cli",
    "scope": "lanonasis-maas"
  }'
```

```json
{
  "device_code": "f3e1...c8b9",
  "user_code": "ABCD-1234",
  "verification_uri": "https://auth.lanonasis.com/oauth/device",
  "verification_uri_complete": "https://auth.lanonasis.com/oauth/device?code=ABCD-1234",
  "expires_in": 900,
  "interval": 5
}
```

- `device_code` — secret, 32-byte base64url. Send only to `/oauth/token`.
- `user_code` — display this to the user. Format `XXXX-NNNN` (8 chars).
  Confusable chars (`I`, `O`, `0`, `1`) are excluded.
- `verification_uri_complete` — safe to print as-is; pre-fills the code in the
  verification page.

The code is good for **15 minutes** (`DEVICE_CODE_EXPIRY = 900` in
`device.routes.ts:39`).

## Step 2 — user authorizes in browser

Open `verification_uri_complete` in any browser. The page renders a
Content-Security-Policy-locked form:

```
default-src 'self';
script-src 'self' 'nonce-…';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
connect-src 'self';
form-action 'self'
```

The user submits their email, receives a one-time passcode, and confirms the
device authorization. `POST /oauth/device/authorize` binds the `device_code`
to the authenticated user. The status transitions from `pending` to
`authorized` in the device code cache.

If the user changes their mind, `POST /oauth/device/deny` flips the status to
`denied` and the next poll returns an `access_denied` error.

## Step 3 — CLI polls for the token

```bash
curl -X POST https://auth.lanonasis.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'grant_type=urn:ietf:params:oauth:grant-type:device_code' \
  -d "device_code=$DEVICE_CODE" \
  -d "client_id=lanonasis-cli"
```

While pending, the response is `400` with
`{"error": "authorization_pending"}`. The CLI should respect `interval` (5
seconds by default) and back off on `slow_down`. Codes that have not been
authorized by `expires_in` return `expired_token`.

On success:

```json
{
  "access_token": "eyJhbGciOi…",
  "refresh_token": "rt_…",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "lanonasis-maas",
  "key_context": "personal"
}
```

The auth gateway issues an access token bound to the user's primary
organization and, if the user has a context-bound API key, surfaces that
`key_context` on the response. Use the access token in subsequent API calls:

```
Authorization: Bearer eyJhbGciOi…
```

The auth gateway applies a **lenient rate limit** to `/oauth/token` for the
device-code grant (see `apps/onasis-core/services/auth-gateway/src/index.ts`)
so polling is not throttled the way repeated `/oauth/token` calls for other
grants are.

## Caching and code storage

`DeviceCodeCache` (in `apps/onasis-core/services/auth-gateway/src/services/cache.service.js`)
stores both:

- `device_code:<code>` → full `DeviceCodeData` (client_id, scope, status,
  user_id once authorized, expires_at).
- `user_code:<code>` → `{ device_code }` (reverse index for the verification
  page).

Storage prefers Redis; it falls back to PostgreSQL if Redis is unavailable.
Codes expire after 15 minutes regardless of storage backend.

## Audit events

`logAuthEvent()` writes one row per state transition:

| `event_type` | When |
|--------------|------|
| `device_code_requested` | POST `/oauth/device` succeeds |
| `device_code_authorized` | POST `/oauth/device/authorize` succeeds |
| `device_code_denied` | POST `/oauth/device/deny` succeeds |
| `device_token_issued` | `/oauth/token` returns a token pair |

All events carry `auditCorrelation(req)` so they join cleanly to the same
request log line.

## Security properties

- **No JWT in `~/.config`** — tokens live in the OS keychain or whatever the
  caller chooses.
- **No localhost redirect** — works over SSH, in containers, and on remote
  servers where `http://localhost:port` is meaningless.
- **Short-lived device codes** — 15 minutes, single-use, bound to one
  `client_id` and scope.
- **User-visible approval** — the user must explicitly authorize in the
  browser before the CLI gets a token.
- **CSP-locked verification page** — only same-origin scripts and styles.
- **Audit trail** — every state transition is logged with the user's IP and
  user-agent.

## CLI behavior

The Onasis CLI (`@lanonasis/cli`) calls this flow automatically on first run:

```bash
onasis auth login
# → prints: "Visit https://auth.lanonasis.com/oauth/device and enter ABCD-1234"
# → polls /oauth/token until the user approves
```

The CLI persists the resulting access + refresh tokens in the OS keychain
(macOS Keychain, Linux secret-service, Windows Credential Manager). It uses
the refresh token silently for subsequent runs.

## See also

- [Central Auth Gateway](./central-auth-gateway.md) — overview of the
  authentication surface.
- [Key Contexts](./key-contexts.md) — how the access token's bound `key_context`
  scopes memory reads.
- RFC 8628 — OAuth 2.0 Device Authorization Grant.
