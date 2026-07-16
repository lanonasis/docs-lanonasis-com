# LanOnasis Docs Drift Audit — 2026-07-16

## Summary

Audit of live docs at https://docs.lanonasis.com against CLI source at `apps/lanonasis-maas/cli/` (v3.11.0).

Local source anchors:
- CLI version: `apps/lanonasis-maas/cli/package.json` → **v3.11.0**
- Command registry: `apps/lanonasis-maas/cli/src/index.ts`
- MCP commands: `apps/lanonasis-maas/cli/src/commands/mcp.ts`
- Prescan command: `apps/lanonasis-maas/cli/src/commands/prescan.ts`
- Topic commands: `apps/lanonasis-maas/cli/src/commands/topics.ts`

Docs source to patch:
- `apps/docs-lanonasis/docs/cli/reference.md` — primary CLI reference
- `apps/docs-lanonasis/docs/changelog.md` — changelog (stale since v3.9.8)
- `apps/lanonasis-maas/cli/README.md` — CLI README (says v3.10.1, should be v3.11.0)

---

## Drift Item 1: CLI Version

| Aspect | Live Docs | Source Truth |
|--------|-----------|--------------|
| Version stated | `v3.9.8+` | `v3.11.0` |

**File:** `apps/docs-lanonasis/docs/cli/reference.md`, line 8
**Fix:** Change `@lanonasis/cli` v3.9.8+ → v3.11.0

---

## Drift Item 2: MCP Command Naming — `mcp list-tools` → `mcp tools`

| Aspect | Live Docs | Source Truth |
|--------|-----------|--------------|
| List MCP tools | `onasis mcp list-tools` | `onasis mcp tools` (line 404 of mcp.ts) |

**File:** `apps/docs-lanonasis/docs/cli/reference.md`, lines 517-529
**Live page:** https://docs.lanonasis.com/cli/reference#onasis-mcp-list-tools
**Fix:** Replace section titled "`onasis mcp list-tools`" with "`onasis mcp tools`", update all command examples, remove `--category` filter option (not present in source).

Note: `list-tools` was never a registered CLI command — the source registers `mcp tools` as its sole name.

---

## Drift Item 3: Topic Command Naming — `topics` → `topic`

| Aspect | Live Docs | Source Truth |
|--------|-----------|--------------|
| Primary command | `onasis topics list/create/delete` | `onasis topic` with `topics` as alias (line 521-522 of index.ts) |

**File:** `apps/docs-lanonasis/docs/cli/reference.md`, lines 656-687
**Fix:** Change section to use `onasis topic` as primary command, note `topics` as alias. Update all examples.

Note: The CLI README (`apps/lanonasis-maas/cli/README.md` lines 353-358) already correctly uses `onasis topic` — README was already patched.

---

## Drift Item 4: Missing REPL Command

| Aspect | Live Docs | Source Truth |
|--------|-----------|--------------|
| `repl` command | Not documented | Full command at line 414-517 of index.ts |

**File:** `apps/docs-lanonasis/docs/cli/reference.md`
**Source:** `program.command('repl')` at line 415
**Fix:** Add new section documenting `onasis repl` with `--mcp`, `--api`, `--token` options.

---

## Drift Item 5: Missing Prescan Command

| Aspect | Live Docs | Source Truth |
|--------|-----------|--------------|
| `prescan` command | Not documented | Full command in `prescan.ts` with `run` and `status` subcommands |

**File:** `apps/docs-lanonasis/docs/cli/reference.md`
**Source:** `apps/lanonasis-maas/cli/src/commands/prescan.ts`
**Fix:** Add new section documenting `onasis prescan run <path>` and `onasis prescan status` with `--save`, `--ci`, `--fail-on`, `--json` options.

Note: CLI README already documents prescan (v3.10.1+) at lines 37-68.

---

## Drift Item 6: Changelog Stale

| Aspect | Live Docs | Source Truth |
|--------|-----------|--------------|
| Latest entry | CLI v3.9.8 (2026-Q1) | CLI v3.11.0 in package.json |

**File:** `apps/docs-lanonasis/docs/changelog.md`
**Fix:** Add entries for:
- CLI v3.10.0 — REPL command (`onasis repl`)
- CLI v3.10.1 — Secret Prescan commands (`onasis prescan run`, `onasis prescan status`)
- CLI v3.11.0 — any changes since prescan release

---

## Drift Item 7: CLI README Version

| Aspect | Current Value | Source Truth |
|--------|---------------|--------------|
| Version stated | `v3.10.1` | `v3.11.0` |

**File:** `apps/lanonasis-maas/cli/README.md`, line 1
**Fix:** Change `v3.10.1` → `v3.11.0` in title and "NEW IN" banner.

---

## Non-Drift Items (already correct)

- **Command aliases** (`onasis`, `lanonasis`, `memory`, `maas`) — docs match source
- **Global options** (`-v`, `--verbose`, `--api-url`, `--output`, `--no-mcp`) — docs match source
- **Auth commands** (`auth login`, `auth status`, `auth logout`) — docs match source
- **`whoami`**, **`health`**, **`init`**, **`completion`** — docs match source
- **Memory commands** — docs match source
- **MCP overview** (`docs/mcp/overview.md`) — docs are SDK-centric and don't directly reference CLI commands; link to CLI reference is sufficient
- **MCP tools doc** (`docs/mcp/tools.md`) — tool reference, not CLI command surface; no drift

---

## Guardrail Proposal

Create a checked-in docs contract test that:

1. **Extracts CLI command registry** from `apps/lanonasis-maas/cli/src/index.ts` by parsing `.command()`, `.alias()`, and `.addCommand()` calls
2. **Scans docs markdown** (`apps/docs-lanonasis/docs/cli/reference.md`) for command references matching patterns like `` onasis <command> ``
3. **Fails CI** when:
   - A doc references a command name that isn't registered in the CLI source (e.g. `mcp list-tools`)
   - A required command (`repl`, `prescan`, `topic`, `mcp tools`) is missing from the docs

**Implementation touchpoints:**
- **New file:** `apps/docs-lanonasis/scripts/validate-cli-docs.ts` (or `.mjs`)
- **CI trigger:** Add to `apps/docs-lanonasis/package.json` as `"validate:cli-docs"` script
- **Verification command:** `node scripts/validate-cli-docs.mjs`

**Failure examples:**
```
❌ Docs reference "mcp list-tools" but CLI registers "mcp tools"
❌ Docs missing required command: "repl"
❌ Docs missing required command: "prescan"
```

**Better guardrail (future):**
- Extract all `.command()` registrations from compiled CLI help output (`onasis --help`)
- Generate a JSON manifest: `{commands: [{name: "topic", aliases: ["topics"], subcommands: ["list","create","delete"]}]}`
- Validate docs against this manifest during release prep CI

---

## Pending Items

- Determine actual CLI v3.11.0 new features to add to changelog beyond v3.10.1 prescan
  - Likely: REPL improvements, additional subcommands, bug fixes
  - Need: CHANGELOG.md from the repo or git log between releases
