# Docs CI & Quality Checks

This document explains the CI/CD setup for the docs site and how to maintain quality checks.

## Overview

The docs site has automated quality checks that run:
- **Before every build** (via `prebuild` hook)
- **In CI/CD pipelines** (GitHub Actions)
- **Via Turbo tasks** (monorepo-wide)

## Available Checks

### P4 deterministic validators and escape hatch

The docs repo now has six deterministic governance validators:

- `bun run validate:cli-docs` — CLI reference command + package-version contract.
- `bun run validate:mcp-tools` — MCP tools doc names match the registry snapshot/live registry.
- `bun run validate:sdk-packages` — every `pip install` / `npm install` / `go get` line resolves to a real package or an explicit planned allowlist entry.
- `bun run validate:claims` — unsupported compliance / SLA / endpoint / transport claims fail against `docs/.validator-allowlists/claims.json` (NORA decision card t_9274c201).
- `bun run validate:external-urls` — external absolute URLs must respond 2xx/3xx (with an allowlist for flaky domains like npmjs bot-blocked package pages).
- `bun run validate:route-reachability` — every sidebar route must resolve in the built site.

Each validator also has positive + negative fixtures and is exercised by:

```bash
bun run test:validators
```

False-positive escape hatch (audit §6.5 rollback):

- Do **not** delete a noisy validator.
- Add the documented exception to its allowlist under `docs/.validator-allowlists/` when the exception is real and durable.
- If a validator is temporarily noisy and blocks a legitimate docs PR, apply the PR label `ignore-docs-validator`.
- The CI workflow keeps running the content validators, but while that label is present it reports their output without failing the PR. Structural validators (`validate:cli-docs`, `validate:mcp-tools`, `validate:sdk-packages`) and the fixture harness are never label-gated.

This label gate is a rollback valve, not the normal path. Remove the label once the doc content or allowlist is fixed.

### 1. Link Checker (`check:links`)

Validates all relative markdown links in the docs directory.

**What it does:**
- Scans all `.md` and `.mdx` files in `docs/`
- Verifies relative links point to existing files
- Ignores external URLs, anchor links, and route links

**Run locally:**
```bash
cd apps/docs-lanonasis
bun run check:links
```

**Fix broken links:**
- Update the link path to match the actual file location
- Or remove the link if the target no longer exists

### 2. Endpoint Smoke Tests (`check:endpoints`)

Verifies that documented platform endpoints are reachable.

**What it does:**
- Tests HEAD requests to documented domains
- Validates expected HTTP status codes
- Times out after 5 seconds per endpoint

**Run locally:**
```bash
cd apps/docs-lanonasis
bun run check:endpoints
```

**Expected status codes:**
- `200` - OK
- `301`, `302`, `304` - Redirects (acceptable)
- `401`, `403` - Auth required (acceptable)
- `404` - Not found (acceptable for some endpoints)

### 3. Combined Check (`check:all`)

Runs both checks in sequence.

**Run locally:**
```bash
cd apps/docs-lanonasis
bun run check:all
```

**Via Turbo (from repo root):**
```bash
bun run turbo run check:all --filter=docs-lanonasis
```

## CI/CD Integration

### GitHub Actions

Two workflows handle docs CI:

1. **`.github/workflows/docs-ci.yml`** - Docs-specific checks
   - Runs on pushes/PRs that touch `apps/docs-lanonasis/**`
   - Checks links, type checks, builds docs
   - Smoke tests endpoints

2. **`.github/workflows/ci.yml`** - Main CI workflow
   - Orchestrates all CI jobs
   - Calls docs workflow as a reusable workflow

### Turbo Tasks

The checks are integrated into Turbo:

```json
{
  "check:links": { "cache": false },
  "check:endpoints": { "cache": false },
  "check:all": { "dependsOn": ["check:links", "check:endpoints"] }
}
```

**Run via Turbo:**
```bash
# From repo root
bun run turbo run check:all --filter=docs-lanonasis
```

### Pre-build Hook

The `prebuild` script automatically runs checks before building:

```json
{
  "prebuild": "bun run check:all",
  "build": "docusaurus build"
}
```

This ensures broken links or unreachable endpoints are caught before deployment.

## Maintenance

### Adding New Checks

1. Create script in `apps/docs-lanonasis/scripts/`
2. Add npm script in `package.json`:
   ```json
   "check:new-check": "node scripts/new-check.js"
   ```
3. Add to Turbo config (`turbo.json`):
   ```json
   "check:new-check": { "outputs": [], "cache": false }
   ```
4. Update `check:all` to include it:
   ```json
   "check:all": "bun run check:links && bun run check:endpoints && bun run check:new-check"
   ```

### Updating Check Scripts

Scripts are intentionally simple Node.js files (no dependencies) for:
- Fast execution
- Easy debugging
- Low maintenance burden

If you need more features, consider:
- Adding error handling
- Better logging
- Config files for customization

### Troubleshooting

**Checks fail in CI but pass locally:**
- Check Node.js/Bun version differences
- Verify file paths are correct (CI uses different working directory)
- Check for missing dependencies

**Endpoint checks fail:**
- Verify endpoints are actually deployed
- Check if status codes changed
- Update allowed status codes in `scripts/smoke-endpoints.js`

**Link checks fail:**
- Run `bun run check:links` locally to see exact broken links
- Fix file paths or remove dead links
- Consider using absolute paths for cross-doc links

## Best Practices

1. **Run checks before committing:**
   ```bash
   cd apps/docs-lanonasis && bun run check:all
   ```

2. **Fix issues immediately** - Don't let broken links accumulate

3. **Update checks when docs structure changes** - If you reorganize docs, update link checker paths

4. **Keep scripts simple** - Complex checks become maintenance burdens

5. **Document new checks** - Update this file when adding checks

## Related Files

- `scripts/check-links.js` - Link validation
- `scripts/smoke-endpoints.js` - Endpoint testing
- `.github/workflows/docs-ci.yml` - CI workflow
- `turbo.json` - Turbo task config
- `package.json` - NPM scripts

