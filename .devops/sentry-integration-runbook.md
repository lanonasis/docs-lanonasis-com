# Sentry Integration Runbook — docs-lanonasis (Pilot)

**Orchestrators**: exMGT + Claude
**Status**: DRAFT — Awaiting exMGT sign-off before any agent executes
**Date**: 2026-03-30
**Applies to**: `apps/docs-lanonasis` (pilot)
**Replicate to**: onasis-core, dashboard, v-secure/web, lanonasis-index (after pilot validated)

---

## Context & Lessons Learned

A previous Sentry integration attempt on `lanonasis-index` caused a build collapse. Root cause was almost certainly `@sentry/vite-plugin` interfering with the Vite pipeline. This is **not** a Docusaurus/webpack concern — but we are taking a minimal-footprint approach regardless.

**Principle: Sentry must be additive and strictly contained. If it can't initialize, it must fail silently — never block the app.**

---

## App Profile (docs-lanonasis)

| Property | Value |
|----------|-------|
| Framework | Docusaurus v3.9.0 |
| Bundler | **Webpack** (NOT Vite) |
| Deployment | Vercel |
| Build command | `bun run build` (with prebuild pipeline) |
| Locales | en, de, es, fr (4 separate webpack compilations) |
| `onBrokenLinks` | `throw` — strict, build fails hard |
| Existing custom webpack plugin | Yes (`path-to-regexp-default-export` with `isNxBuild` guard) |
| Sentry project | **Does not exist yet — must be created** |
| Previous Sentry | None — clean slate |

---

## What We Are NOT Doing

These are hard constraints. Any agent that deviates must be sent back.

| ❌ DO NOT | Reason |
|-----------|--------|
| Install `@sentry/vite-plugin` | Not applicable (webpack), and this is what broke lanonasis-index |
| Install `@sentry/webpack-plugin` in Phase 1 | Adds webpack compile-time risk. Source maps via CLI post-build is safer |
| Use `Sentry.init()` inside any `.tsx` component or layout | SSG renders server-side — init will run during static generation and error |
| Swizzle any Docusaurus theme component for Sentry | Fragile — breaks on Docusaurus upgrades |
| Add Sentry to `docusaurus.config.ts` `plugins[]` as an SDK init | Plugin hooks are build-time, not runtime |
| Use `import.meta.env` for DSN | Docusaurus uses `process.env` (webpack), not Vite env vars |
| Set `dsn` to a hardcoded string | Always read from `process.env.SENTRY_DSN` with an empty-string fallback |
| Wrap the Sentry init in a try/catch that re-throws | Must swallow errors silently — docs going down > no error tracking |

---

## Phase 0 — Prerequisites ✅ COMPLETE

### Confirmed values

| Field | Value |
|-------|-------|
| Sentry org slug | `lan-onasis` |
| Sentry org ID | `4509338886209536` |
| Sentry project slug | `docs-lanonasis` |
| Sentry project ID | `4511133431431168` |
| DSN | `https://7c1b930cf10d7e92e9b9c7b79146a604@o4509338886209536.ingest.us.sentry.io/4511133431431168` |
| Created | 2026-03-30 |

### 0.3 Add env vars to Vercel — PENDING exMGT action

In Vercel dashboard → `docs-lanonasis` project → Settings → Environment Variables:

```
SENTRY_DSN=https://7c1b930cf10d7e92e9b9c7b79146a604@o4509338886209536.ingest.us.sentry.io/4511133431431168
SENTRY_ORG=lan-onasis
SENTRY_PROJECT=docs-lanonasis
SENTRY_RELEASE=$VERCEL_GIT_COMMIT_SHA
SENTRY_AUTH_TOKEN=<create at: https://lan-onasis.sentry.io/settings/auth-tokens/ with scopes: project:releases, org:read, project:write>
```

Also create `apps/docs-lanonasis/.env.local` (gitignored) for local dev:
```
SENTRY_DSN=https://7c1b930cf10d7e92e9b9c7b79146a604@o4509338886209536.ingest.us.sentry.io/4511133431431168
```

### 0.4 Sign off checklist

- [x] Sentry project created: `docs-lanonasis` under `lan-onasis` org
- [x] DSN retrieved
- [ ] **exMGT: Add env vars to Vercel dashboard**
- [ ] **exMGT: Create `SENTRY_AUTH_TOKEN` with correct scopes**
- [ ] **exMGT: Confirm alert routing** (Slack channel or email?)

---

## Phase 1 — SDK Installation

Agent instruction: **Install one package only.**

```bash
cd apps/docs-lanonasis
bun add @sentry/react
```

**Why `@sentry/react` and not `@sentry/browser`?**
Docusaurus is a React application. `@sentry/react` provides React error boundaries on top of the browser SDK. We will use ErrorBoundary in Phase 3 if the pilot is stable.

**Verify:**
```bash
grep "@sentry/react" apps/docs-lanonasis/package.json
# Expected: "@sentry/react": "^x.x.x"
```

**No other packages. Do not install:**
- `@sentry/webpack-plugin` (Phase 2 handles source maps via CLI)
- `@sentry/node` (not needed for the browser docs app)
- `@sentry/nextjs` (this is not Next.js)

---

## Phase 2 — Client Initialization (The Docusaurus-safe pattern)

**Pattern: `clientModules`** — Docusaurus's built-in mechanism for injecting browser-only code. Runs after hydration, never during SSG.

### 2.1 Create the Sentry client module

**File**: `apps/docs-lanonasis/src/sentry.client.ts`

```typescript
/**
 * Sentry browser initialization for docs-lanonasis.
 * Loaded via Docusaurus clientModules — runs browser-side only, never during SSG.
 *
 * IMPORTANT: This file must never throw. All Sentry errors are swallowed
 * to prevent monitoring from taking down the docs site.
 */
import * as Sentry from '@sentry/react';

const dsn = process.env.SENTRY_DSN || '';

// Do nothing if DSN is not configured (local dev without .env.local, CI, etc.)
if (dsn) {
  try {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'production',
      // Low sample rate for docs — not a transactional app
      tracesSampleRate: 0.1,
      // Only capture errors from our domain, not third-party scripts
      allowUrls: [/docs\.lanonasis\.com/],
      // Do not send in development unless explicitly requested
      enabled: process.env.NODE_ENV === 'production',
      // Release tag — set by CI via SENTRY_RELEASE env var
      release: process.env.SENTRY_RELEASE,
      // Reduce noise: ignore benign browser errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
      ],
    });
  } catch (_) {
    // Sentry init must never break the docs site
  }
}

// Export nothing — clientModules are side-effect-only
export {};
```

### 2.2 Register in docusaurus.config.ts

Add `clientModules` at the top level of the config object (same level as `plugins`, `presets`):

```typescript
// In docusaurus.config.ts, inside `const config: Config = { ... }`:
clientModules: [
  require.resolve('./src/sentry.client.ts'),
],
```

**Agent instruction**: Add this field to `docusaurus.config.ts` — do NOT touch `plugins[]`, `presets[]`, or `themeConfig`. Only add `clientModules`.

---

## Phase 3 — Source Maps (Post-build, CLI approach)

We upload source maps AFTER the build, not during. This keeps webpack untouched.

### 3.1 Add postbuild script

**File**: `apps/docs-lanonasis/scripts/sentry-sourcemaps.sh`

```bash
#!/bin/bash
# Sentry source map upload — runs after docusaurus build
# Only runs in CI/Vercel (SENTRY_AUTH_TOKEN must be set)
# Safe to skip locally.

set -e

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "SENTRY_AUTH_TOKEN not set — skipping source map upload"
  exit 0
fi

if [ -z "$SENTRY_DSN" ]; then
  echo "SENTRY_DSN not set — skipping source map upload"
  exit 0
fi

RELEASE="${SENTRY_RELEASE:-$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')}"
ORG="${SENTRY_ORG:-lanonasis}"
PROJECT="${SENTRY_PROJECT:-docs-lanonasis}"

echo "Uploading source maps for release: $RELEASE"

# Create the release
sentry-cli releases new --org "$ORG" --project "$PROJECT" "$RELEASE"

# Upload source maps for all locale builds
# Docusaurus outputs to build/ with locale subdirs for non-default locales
sentry-cli sourcemaps upload \
  --org "$ORG" \
  --project "$PROJECT" \
  --release "$RELEASE" \
  build/

# Finalize the release
sentry-cli releases finalize --org "$ORG" --project "$PROJECT" "$RELEASE"

echo "Source maps uploaded for $RELEASE"
```

Make executable: `chmod +x apps/docs-lanonasis/scripts/sentry-sourcemaps.sh`

### 3.2 Wire into package.json

Modify the `build` script to add a postbuild:

```json
{
  "scripts": {
    "build": "NODE_OPTIONS=\"--require ./scripts/patch-js-yaml.cjs\" docusaurus build",
    "postbuild": "bash scripts/sentry-sourcemaps.sh || true"
  }
}
```

**Critical**: `|| true` ensures the postbuild never fails the overall build. Source map upload failure must never block deployment.

---

## Phase 4 — Vercel CI/CD Wiring

Vercel automatically runs `bun run build` which will now include `postbuild`. No Vercel config changes needed beyond the env vars set in Phase 0.

Set `SENTRY_RELEASE` in Vercel to `$VERCEL_GIT_COMMIT_SHA` (Vercel env var, automatically available).

In Vercel project settings → Environment Variables:
```
SENTRY_RELEASE=$VERCEL_GIT_COMMIT_SHA
```

---

## Validation Checklist (Orchestrator reviews before merge)

### Build validation
- [ ] `bun run build` completes without errors
- [ ] Build output size not significantly larger (source maps excluded from bundle)
- [ ] All 4 locale builds succeed (en, de, es, fr)
- [ ] `postbuild` runs but `|| true` catches any upload failure gracefully

### Sentry validation
- [ ] In Sentry dashboard: release appears with correct SHA
- [ ] Source maps uploaded (Sentry shows "resolved" for a test error, not minified stacktrace)
- [ ] No errors in Sentry from the build process itself
- [ ] `SENTRY_DSN` not exposed in `window.__SENTRY_DSN__` or any public JS

### Regression checklist
- [ ] `bun run start` (local dev) still works
- [ ] `onBrokenLinks: throw` hasn't fired on any new import
- [ ] `js-yaml.safeLoad` patch still applies (NODE_OPTIONS require)
- [ ] `path-to-regexp-default-export` webpack plugin still loads
- [ ] i18n locale switcher still works
- [ ] MCP bridge (`mcp-bridge.js`) unaffected

---

## Replication Pattern for Other Apps

Once docs-lanonasis is validated, each subsequent app gets the same treatment with these variations:

| App | Bundler | clientModules equiv | Source maps | Notes |
|-----|---------|---------------------|-------------|-------|
| `onasis-core` | Vite | `src/main.tsx` top-of-file init | `@sentry/vite-plugin` (after Vite-safety confirmed) | Use `import.meta.env.VITE_SENTRY_DSN` |
| `dashboard` | Vite | `src/main.tsx` | `@sentry/vite-plugin` | Same pattern as onasis-core |
| `v-secure/web` | Next.js | `sentry.client.config.ts` + `sentry.server.config.ts` | `@sentry/nextjs` handles automatically | Next.js has first-class Sentry support |
| `lanonasis-index` | Vite + Next.js | TBD — needs fresh audit | TBD | This is the one that broke before — do last |

**The Vite pattern (onasis-core, dashboard) must NOT use `clientModules` — that's Docusaurus-only.**

---

## Agent Dispatch Template

When handing off to a worker agent (OpenClaw or Codex), provide:

```
TASK: Implement Sentry integration for docs-lanonasis per runbook at:
apps/docs-lanonasis/.devops/sentry-integration-runbook.md

SCOPE:
- Phase 1: Install @sentry/react only
- Phase 2: Create src/sentry.client.ts and add clientModules to docusaurus.config.ts
- Phase 3: Create scripts/sentry-sourcemaps.sh and add postbuild to package.json

DO NOT:
- Touch webpack config
- Modify any existing plugin or preset
- Add any package other than @sentry/react
- Throw errors from sentry.client.ts

VALIDATION BEFORE SUBMITTING:
- Run: bun run build
- Confirm no new build errors
- Confirm sentry.client.ts has the || true safety patterns
- Diff must only touch: package.json, src/sentry.client.ts,
  docusaurus.config.ts (clientModules only),
  scripts/sentry-sourcemaps.sh, package.json (postbuild only)

DO NOT PUSH. Submit diff for Orchestrator review.
```

---

## Open Questions for Orchestrator Sign-off

1. **Sentry org**: Should `docs-lanonasis` project go under `lanonasis` org or `lan-onasis` org?
2. **Error alerts**: Where should Sentry alerts route — Slack channel or email?
   (We already have the Stripe → Slack webhook infrastructure)
3. **Performance monitoring**: `tracesSampleRate: 0.1` — acceptable for docs traffic?
4. **Source maps in git**: Confirm `build/` directory is gitignored (it is — Docusaurus default)
