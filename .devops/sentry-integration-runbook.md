# Sentry Integration Runbook — docs-lanonasis (Pilot)

**Orchestrators**: exMGT + Claude
**Status**: DRAFT — Awaiting exMGT sign-off before any agent executes
**Date**: 2026-03-30
**Applies to**: `apps/docs-lanonasis` (pilot)
**Replicate to**: onasis-core, dashboard, v-secure/web, lanonasis-index (after pilot validated)

---

## ⚠️ Corrections — 2026-11-03 (read this first)

The integration below was written but **never worked**. The Sentry project
received zero events until 2026-11-03. Four defects, all now fixed and verified:

| # | Defect | Why it was silent |
|---|--------|-------------------|
| 1 | `src/sentry.client.ts` read `process.env['SENTRY_DSN']` through a **computed** accessor | Docusaurus/webpack substitutes only `process.env.NODE_ENV`. A computed `process.env[key]` can never be substituted, so it survived into the browser as `undefined`; `if (dsn)` was false and `Sentry.init()` never ran. The SDK was bundled, so it *looked* wired up. |
| 2 | `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_DSN` were stored with a **trailing newline** | `echo "x" \| vercel env add …` stores the `\n`. Dashboards render it as correct; org/project become unresolvable and a DSN is rejected at runtime. |
| 3 | The three value vars were **Production-only** | Every preview build logged `SENTRY_DSN not set`. |
| 4 | The build emitted **no `.map` files** | The upload attached bare JS, so stacks stayed minified. |

**The corrected pattern is Phase 2A below — not the original Phase 2.** The
original Phase 2/3 snippets are kept for history but are marked superseded.

### The substitution rule

Bundlers replace only *statically analysable* member expressions on a known env
object, for keys they were configured to define. Docusaurus defines only
`process.env.NODE_ENV` (via webpack `mode`) and
`process.env.HYDRATE_CLIENT_ENTRY`. Therefore:

- `process.env.SENTRY_DSN` → survives verbatim, `undefined` in the browser
- `const env = k => process.env[k]` → **never** substituted

**The defensive guard helper was the bug.** It converted a replaceable static
reference into an unreplaceable dynamic one. With correct injection there is no
runtime env access left to guard.

### Verification rule

Never infer "the browser has the value" from "I set the env var". Assert on the
**shipped artifact**:

```bash
grep -rl '<the literal value>' build/ | wc -l      # must be non-zero
grep -rl 'process\.env\.SENTRY' build/ | wc -l     # must be 0
```

Compare **counts** — a `grep … | head` pipeline reports `head`'s status, so a
missing match reads as success.

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
- [x] Env vars set in Vercel for **production, preview and development** (2026-11-03)
      — set with `printf '%s'`, never `echo`, or a trailing newline is stored
- [x] `SENTRY_AUTH_TOKEN` set (verified working: uploads report targets)
- [x] Source maps emitted + uploaded + deleted post-upload
- [ ] **Confirm alert routing** (Slack channel or email) — still open

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
 * Loaded via Docusaurus clientModules — browser-side only, never during SSG.
 *
 * Values are injected at build time by headTags in docusaurus.config.ts and
 * read from the DOM. They are NOT read from process.env — see Phase 2A.
 */
import * as Sentry from '@sentry/react';

type SentryBuildConfig = { dsn?: string; release?: string; environment?: string };

function readBuildConfig(): SentryBuildConfig {
  try {
    if (typeof document === 'undefined') return {};
    const el = document.getElementById('sentry-build-config');
    if (!el || !el.textContent) return {};
    return JSON.parse(el.textContent) as SentryBuildConfig;
  } catch {
    return {}; // malformed config must never break the site
  }
}

const buildConfig = readBuildConfig();
const dsn = (buildConfig.dsn ?? '').trim();
const environment = (buildConfig.environment ?? 'production').trim();

if (dsn) {
  try {
    Sentry.init({
      dsn,
      environment,
      tracesSampleRate: 0.1,
      allowUrls: [/docs\.lanonasis\.com/, /\.vercel\.app/],
      enabled: environment !== 'development',
      release: (buildConfig.release ?? '').trim() || undefined,
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
      ],
    });
  } catch {
    // Sentry init must never break the docs site
  }
}

export {};
```

### 2A — the injection half (in `docusaurus.config.ts`)

`docusaurus.config.ts` runs in **Node at build time**, so `process.env` is real
there. Serialise into the HTML and read it back client-side:

```ts
headTags: [
  {
    tagName: 'script',
    attributes: { type: 'application/json', id: 'sentry-build-config' },
    innerHTML: JSON.stringify({
      dsn: (process.env.SENTRY_DSN ?? '').trim(),
      release: (process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA ?? '').trim(),
      environment: (process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'production').trim(),
    }),
  },
],
```

Use a `<script type="application/json">` **body**, not an HTML attribute —
attribute escaping is where this normally breaks. `headTags` renders on every
page; confirm with `grep -rl sentry-build-config build/ --include='*.html' | wc -l`.

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
# Sentry source map upload - runs after the docusaurus build.
# Only runs where SENTRY_AUTH_TOKEN is set (Vercel/CI). Safe to skip locally.

set -e

# Values are pasted/echoed into env stores by hand, so strip surrounding
# whitespace and any stray CR/LF. A trailing newline in SENTRY_ORG,
# SENTRY_PROJECT or SENTRY_DSN makes sentry-cli fail confusingly and silently
# breaks the release.
trim() {
  printf '%s' "${1:-}" | tr -d '
' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'
}

AUTH_TOKEN="$(trim "${SENTRY_AUTH_TOKEN:-}")"
DSN_VALUE="$(trim "${SENTRY_DSN:-}")"
ORG="$(trim "${SENTRY_ORG:-lan-onasis}")"
PROJECT="$(trim "${SENTRY_PROJECT:-docs-lanonasis}")"

# Maps must never reach the deployed bundle: the build emits them so
# sentry-cli can read them, and this removes them on EVERY exit path
# (including the skips below and a failed upload).
cleanup_maps() {
  local n
  n=$(find build -name '*.map' 2>/dev/null | wc -l | tr -d ' ')
  find build -name '*.map' -delete 2>/dev/null || true
  echo "Removed $n source map file(s) from build/ (never deployed)."
}
trap cleanup_maps EXIT

[ -n "$AUTH_TOKEN" ] || { echo "SENTRY_AUTH_TOKEN not set - skipping source map upload"; exit 0; }
[ -n "$DSN_VALUE" ]  || { echo "SENTRY_DSN not set - skipping source map upload"; exit 0; }

# Same fallback chain as docusaurus.config.ts headTags, so the release the
# browser reports matches the release the maps are uploaded to.
RELEASE="$(trim "${SENTRY_RELEASE:-${VERCEL_GIT_COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null || echo 'unknown')}}")"

if [ -z "$PROJECT" ] || [ "$PROJECT" = "invalid" ] || [ -z "$ORG" ] || [ "$ORG" = "invalid" ]; then
  echo "SENTRY_PROJECT/SENTRY_ORG resolve to an invalid value; source-map upload skipped." >&2
  exit 0
fi
[ "$RELEASE" != "unknown" ] || { echo "Release undetermined; skipping." >&2; exit 0; }

export SENTRY_AUTH_TOKEN="$AUTH_TOKEN" SENTRY_ORG="$ORG" SENTRY_PROJECT="$PROJECT"

echo "Uploading source maps for release: $RELEASE"
sentry-cli releases new "$RELEASE"
sentry-cli sourcemaps upload --release "$RELEASE" build/
sentry-cli releases finalize "$RELEASE"
echo "Source maps uploaded for $RELEASE"
```

### 3.1b — emitting the maps (mandatory; without this the upload attaches bare JS)

Docusaurus leaves `devtool` **undefined** for production builds
(`webpack/base.js`), so **no `.map` files are produced at all**. Confirm first:

```bash
find build -name '*.map' | wc -l    # 0 = nothing to upload
```

Set it from the existing `configureWebpack` lifecycle in `docusaurus.config.ts`:

```ts
configureWebpack() {
  // Compute `devtool` BEFORE requiring webpack - see the trap below.
  const devtool =
    process.env.NODE_ENV === 'production' ? 'hidden-source-map' : false;
  try {
    const webpack = require('webpack');
    return { devtool, resolve: { /* … */ }, plugins: [ /* … */ ] };
  } catch (e) {
    // webpack is NOT resolvable from this config file in this repo, so the
    // alias/ProvidePlugin above are inert. Still return devtool.
    return { devtool };
  }
},
```

> **Trap that hid this for months:** `require('webpack')` **throws** from
> `docusaurus.config.ts` (`Cannot find module 'webpack'` — it is not resolvable
> from the config's location). The original `catch { return {} }` therefore
> discarded the `devtool`, the `path-to-regexp` alias **and** the Buffer
> `ProvidePlugin` on every build, silently. Anything that must survive belongs
> outside that `try`, or in the `catch` return.
>
> **A Docusaurus plugin must be a string, array or *function*.** Pushing a
> plain object is rejected outright: `Bad Docusaurus plugin value plugins[1]`.
> Use the factory form — `plugins.push(() => ({ name, configureWebpack() {} }))`.
>
> **`configureWebpack`'s return value is deep-merged into the final config,
> and webpack-merge CONCATENATES arrays.** Returning `{ ...config, devtool }`
> therefore duplicates `config.plugins` and breaks the build. Return a
> **partial** — `{ devtool: 'hidden-source-map' }` — and let the merge apply it.
>
> **Do not gate a webpack plugin on an env heuristic.** The original plugin was
> pushed only when `!isNxBuild` (`NX_BUILD === 'true' || NX_WORKSPACE_ROOT !==
> undefined`). Vercel's build image injects `NX_*`/`TURBO_*` variables, so a
> gate like that can be true during an ordinary `docusaurus build`. Push it
> unconditionally.
>
> **Read upload reports in full, and count.** `sentry-cli` prints
> `(no sourcemap found)` for every JS chunk that legitimately has no map — with
> `hidden-source-map` that is *expected*, because the JS deliberately carries no
> `sourceMappingURL`. Grepping the first few lines makes a working upload look
> broken. Count instead:
> `vercel inspect <url> --logs | grep -c '\.js\.map'` — the pre-fix build
> scored `0`, the fixed build `126`.
>
> **Probe a lifecycle before debugging it.** Put a side effect *outside* any
> `try` (and write it with an ESM import, not `require`) — a hook that never
> fires looks identical to one that fired and did nothing:

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
