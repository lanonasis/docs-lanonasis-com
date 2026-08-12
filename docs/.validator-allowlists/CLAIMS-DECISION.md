# CLAIMS-DECISION — `validate:claims` allowlist policy (P4-PROD)

- **Owner:** NORA (product decision), card t_9274c201
- **Date:** 2026-08-12
- **Status:** FINAL — implementation card t_72fc6d3c consumes this file + `claims.json`
- **Scope:** what the docs `validate:claims` validator FAILS on, what it ALLOWS, and where
- **Ground truth verified live on 2026-08-12:** DNS (Google DoH `dns.google/resolve`), live HTTP probes, and current `apps/docs-lanonasis` tree at `/Users/seyederick/DevOps/projects/active/lan-onasis-monorepo`

---

## Policy summary

| Category | Verdict | Where allowed |
|---|---|---|
| Compliance certifications (SOC 2, ISO 27001, PCI DSS, GDPR, HIPAA, FERPA, SOX, FISMA, APPI, PDPA, PIPA) | **FAIL-until-evidenced** (deny) | Nowhere until a real evidence pack exists |
| Uptime / latency / scale numbers (99.9%, 99.99%, 10M+, 50+, <50ms, <100ms, <200ms, <500ms) | **Documented-goal only** | Only `roadmap/` pages or pages carrying the roadmap marker; never as live claims |
| `sandbox-api.lanonasis.com`, `status.lanonasis.com`, `support.lanonasis.com`, `trust.lanonasis.com` | **FAIL-until-evidenced** (deny) | Nowhere until DNS + live probe pass |
| KYC / wallets / payments / transfers / unified-services | **Must-remove from published pages** | Only `unified-services/` (currently `draft: true` quarantine) and future `roadmap/` pages |
| WebSocket (`wss://mcp.lanonasis.com/ws`) | **FAIL-until-evidenced** (deny) | Nowhere until a live `ws` endpoint probe succeeds |
| SSE (`mcp.lanonasis.com/sse`) | **ALLOW** | Global — real implementation verified |
| Core service hostnames (`api`, `mcp`, `auth`, `dashboard`, `docs`) | **ALLOW** | Global — DNS + live health verified |

No term is left undecided. Every ALLOW carries evidence below. Every FAIL is fail-until-evidenced: the allowlist is reopened the moment real evidence exists (certification report, published SLA, live endpoint).

---

## Decision 1 — SOC 2: FAIL-until-evidenced (deny)

- **Evidence of claim:** `docs/v-secure/compliance/overview.md` §Certifications (live: "v-secure maintains SOC 2 Type II certification… Annual SOC 2 Type II audit"); `docs/v-secure/intro.md:41` ("SOC 2 Type II — Enterprise security controls"); `docs/v-secure/security-service.md:216` ("SOC 2 Type II"); `docs/v-secure/api/audit-logs.md:330` ("`soc2` - SOC 2 Type II compliance report").
- **Evidence of absence:** `docs/v-secure/compliance/soc2.md` is a 10-line stub — no audit report URL, no certification body, no date, no report id. No compliance evidence pack exists anywhere in the repo (MIRA audit F13, 2026-07-18).
- **Verdict:** deny. Claiming certification with no report is a legal exposure in vendor reviews (audit §1 bottom line).
- **Reopen condition:** a real evidence pack (report URL, certifying body, issue/expiry date) added to the repo, then `SOC 2` may be allowed **only** on the page(s) that carry that evidence (`where: "v-secure/compliance/.*"`), never global.

## Decision 2 — ISO 27001 / PCI DSS / GDPR: FAIL-until-evidenced (deny), per standard

- **ISO 27001:** claimed as "ISO 27001 certified" in `v-secure/compliance/overview.md`; `iso27001.md` is a 10-line stub. Deny until evidence pack.
- **PCI DSS:** claimed as "PCI DSS Ready" in `v-secure/compliance/overview.md`; `pci-dss.md` is a 10-line stub. "Ready" is still an unsupported trust signal with zero source evidence (no card data flows anywhere in the codebase — see Decision 5). Deny until evidence pack.
- **GDPR:** claimed as "GDPR Compliant" in `v-secure/compliance/overview.md` and "GDPR compliant data handling" in `changelog.md:406`. `gdpr.md` is a 10-line stub; `docs/security/privacy-implementation.md` has no GDPR section. Deny until evidence pack.
- **Adjacent standards claimed with no evidence** (same page): HIPAA, FERPA, SOX, FISMA, NIS Directive, eIDAS, APPI, PDPA, PIPA — deny all as unsupported compliance claims.
- **Reopen condition:** per standard, same as Decision 1 (evidence pack + page-scoped allow).

## Decision 3 — Numeric claims (99.9%, 99.99%, 10M+, 50+, <50ms, <100ms, <200ms, <500ms): documented-goal only

- **Live-claim verdict: FAIL.** Examples currently published: `docs/support.md:181-182` ("Pro Tier: 99.9% uptime", "Enterprise: 99.99% uptime with custom SLA") and support.md performance targets ("Search Latency < 100ms p95", "Upsert Latency < 200ms p95", "Embedding Generation < 500ms p95"); `docs/changelog.md:404-405` ("Sub-100ms search latency", "99.9% uptime SLA"). No SLA document exists in the tree (audit F17). `platform/control-room.md:101` and `platform/lanonasis-index.md` show uptime figures inside dashboard-mock ASCII — these are UI samples, not product claims; treat as code blocks, not prose (validator should ignore fenced code blocks).
- **Documented-goal verdict:** a numeric claim is allowed **only** when the page carries the roadmap marker (frontmatter `roadmap: true` or path under `docs/roadmap/`) and the sentence labels the number a goal/target (e.g. "target: 99.9% uptime") — never a guarantee. Currently **no** page qualifies; all existing numeric claims must be removed or rewritten as roadmap goals.
- **Reopen condition:** publish a real SLA (`docs/legal/sla.md`) or move claims to `roadmap/` pages with goal wording.

## Decision 4 — sandbox-api / status / support / trust URLs: FAIL-until-evidenced (deny)

- **Verified 2026-08-12 via Google DoH (`dns.google/resolve?name=…&type=A`):** `sandbox-api.lanonasis.com` → Status 3 (NXDOMAIN), `status.lanonasis.com` → Status 3 (NXDOMAIN), `support.lanonasis.com` → Status 3 (NXDOMAIN), `trust.lanonasis.com` → Status 3 (NXDOMAIN). No A records. `docs.lanonasis.com` → 216.198.79.65 / 64.29.17.65 (Vercel), `api.lanonasis.com` → 63.176.8.218/35.157.26.135 (per audit §2.4), `mcp.lanonasis.com` → 168.231.74.29, `auth.lanonasis.com` → 168.231.74.29, `dashboard.lanonasis.com` → 18.208.88.157/98.84.224.111.
- **Live HTTP probes:** `https://api.lanonasis.com/health` → 200 `{"status":"ok","service":"Onasis-CORE API Gateway","version":"1.0.0",…}`; `https://mcp.lanonasis.com/health` → 200 `{"status":"healthy",…,"version":"1.0.0"}` (uptime 6d 11h).
- **Current violations to fix (published):** `docs/api/authentication.md:57,373,377,383` (sandbox env + test curl); `docs/v-secure/getting-started.md:381` (status); `docs/v-secure/api/overview.md:270` (status); `docs/v-secure/intro.md:169` (status + support); `docs/platform/lanonasis-index.md:273,485,551` (status); `docs/support.md:183` ("status.LanOnasis.local" — also invalid, a `.local` hostname); `docs/v-secure/compliance/overview.md` (trust.lanonasis.com link).
- **Verdict:** deny all four hostnames everywhere until DNS resolves **and** a live probe returns 2xx. Do not guess allow.

## Decision 5 — KYC / payments / wallets / transfers / WebSocket / SSE

- **KYC / wallets / payments / transfers / unified-services: FAIL (must-remove from published pages).**
  - Evidence of absence: grep of the whole monorepo for `v1/wallets|v1/payments|v1/kyc|v1/transfers` finds only docs pages, dashboard UI placeholder components (`apps/dashboard/src/components/dashboard/api-services/PaymentGateways.tsx`, `WalletServices.tsx`), and the docs `unified-services/` tree. No route in `apps/onasis-core/services/auth-gateway/src/routes/`, none in `apps/mcp-core/src/index.ts`.
  - `apps/onasis-core/docs/supabase-api/DIRECT_API_ROUTES.md` documents payment functions (`stripe`, `paystack`, `flutterwave`, `paypal-payment`, `sayswitch-transfer`, `payments-gateway`, …) — **none of these directories exist** under `apps/onasis-core/supabase/functions/` (verified by directory listing). The doc is phantom surface; the functions are not deployed in this tree.
  - `docs/unified-services/*` is already quarantined with `draft: true` frontmatter — that quarantine is correct and is the **only** place these terms may live until a real backend exists. Implementation must keep it draft / move under `docs/roadmap/`; never surface in published nav.
- **WebSocket: FAIL-until-evidenced (deny).** `apps/mcp-core/src/index.ts:113,189,266,283-286,3153-3156` implements a `ws` server but it is **opt-in** (`ENABLE_WEBSOCKET === 'true'` / `--websocket` / `--all`); `index.ts:1467` advertises `wss://mcp.lanonasis.com/ws` in the server-info capability list, but no live `wss` probe was possible today and the current docs correctly say "Protocols: SSE and HTTP" (`docs/mcp/production-server.md:12`). Deny `wss://mcp.lanonasis.com` and any "WebSocket transport" claim until infra confirms the endpoint is enabled in production.
- **SSE: ALLOW (global).** `apps/mcp-core/src/index.ts:2876-2975` implements the standard MCP SSE transport (`GET /sse`, `POST /message?sessionId=`); `mcp.lanonasis.com` is live and healthy; `docs/mcp/tools.md:22` and `docs/mcp/production-server.md:12` document SSE. Evidence: `apps/mcp-core/src/index.ts:2876` + live `https://mcp.lanonasis.com/health` 200.

## Decision 6 — Roadmap marker policy

- A page **carries the roadmap marker** when either (a) its path is under `docs/roadmap/`, or (b) its frontmatter contains `roadmap: true` **and** the body has an explicit "not yet shipped" banner.
- Within roadmap-marked pages, **aspirational-but-product-backed** content is allowed (unified-services surfaces, numeric goals with "target" wording, planned transports).
- **Never allowed even in roadmap pages:** compliance certifications (Decision 1/2 — facts, not aspirations) and dead endpoint hostnames (Decision 4 — DNS state is a fact). Roadmap labels don't resurrect a claim that is factually false.
- Implementation note: `docs/changelog.md:499` already has an "Upcoming Features (Roadmap)" section — that section (and only that section) may carry roadmap-allowed terms; `changelog.md:404-406` historical claims are **not** roadmap and must be corrected.
- Non-roadmap pages that mention roadmap-worthy features must fail, forcing them to link to the roadmap page instead.

---

## Files that must change for CI to go green (implementation card scope, docs only)

1. `docs/v-secure/compliance/overview.md` — remove/qualify all certification + regional-standard claims; replace with "designed toward / evidence pack coming soon" language or cut the page to a stub linking `compliance@lanonasis.com`. Remove `trust.lanonasis.com` link.
2. `docs/v-secure/compliance/{soc2,iso27001,pci-dss,gdpr}.md` — keep only as stubs with no certification assertions (already near-stubs; strip the remaining claims).
3. `docs/v-secure/intro.md` — drop SOC 2/ISO 27001/GDPR/PCI DSS/HIPAA bullet list; drop status.lanonasis.com + support.lanonasis.com links.
4. `docs/v-secure/security-service.md` — drop "Compliance: SOC 2, ISO 27001, GDPR" and the "SOC 2 Type II" section (lines ~21, ~216).
5. `docs/v-secure/api/audit-logs.md` — remove the `soc2` report-type entry (line ~330) or relabel as "compliance report (available on request)".
6. `docs/support.md` — remove 99.9%/99.99% uptime guarantees and <100/200/500ms targets (lines ~181-196) or rewrite as roadmap goals; fix `status.LanOnasis.local`/`blog.lanonasis.local`/`api.LanOnasis.local` placeholders to real or no links.
7. `docs/api/authentication.md` — remove the Sandbox environment section and sandbox curl examples (lines ~57, ~373-383) until `sandbox-api.lanonasis.com` exists.
8. `docs/v-secure/getting-started.md` (line ~381) and `docs/v-secure/api/overview.md` (line ~270) — remove status.lanonasis.com references.
9. `docs/platform/lanonasis-index.md` — remove `status.lanonasis.com` references (lines ~273, ~485, ~551) or relabel as planned.
10. `docs/changelog.md` — correct lines ~404-406 (Sub-100ms latency, 99.9% SLA, GDPR compliant) to remove unsupported claims; keep the Roadmap section allowed.
11. `docs/unified-services/*` — keep `draft: true`; optionally move under `docs/roadmap/`; never in published nav.
12. `docs/mcp/production-server.md` — keep current "SSE and HTTP" wording; do not add WebSocket until endpoint is live.

## Validator implementation notes (for t_72fc6d3c)

- Term matching should be case-insensitive and substring-based on prose text, **skipping fenced code blocks** (```…```) so dashboard-mock ASCII and sample payloads don't false-positive.
- `where: "global"` = allowed anywhere; `where: "<regex>"` = allowed only on pages whose path matches.
- Failures must report file:line + matched term + the allowlist rule that would be needed, so engineers can open an allowlist PR instead of deleting evidence.
- The allowlist file lives at `docs/.validator-allowlists/claims.json` (content in completion metadata `claims_allowlist` of this card).

## Evidence index

| Claim | Verdict | Evidence |
|---|---|---|
| SOC 2 | deny | MIRA audit F13; `v-secure/compliance/soc2.md` stub; no report/body/date |
| ISO 27001 | deny | MIRA audit F13; `iso27001.md` stub |
| PCI DSS | deny | MIRA audit F13; `pci-dss.md` stub; no card data in code |
| GDPR | deny | MIRA audit F13; `gdpr.md` stub; privacy-implementation.md has no GDPR |
| 99.9% / 99.99% uptime | documented-goal only | audit F17; no SLA doc; `support.md:181-182` |
| <100/200/500ms latency | documented-goal only | `support.md:190-196`; no benchmark evidence |
| 10M+ / 50+ / <50ms | deny (not currently in tree) | validator default-fail terms; re-allow only with evidence |
| sandbox-api.lanonasis.com | deny | DoH NXDOMAIN 2026-08-12; audit F11 |
| status.lanonasis.com | deny | DoH NXDOMAIN 2026-08-12; audit F11 |
| support.lanonasis.com | deny | DoH NXDOMAIN 2026-08-12 |
| trust.lanonasis.com | deny | DoH NXDOMAIN 2026-08-12 |
| wallets/payments/kyc/transfers | must-remove (published) | no routes in auth-gateway or mcp-core; phantom DIRECT_API_ROUTES.md; draft:true quarantine |
| WebSocket transport | deny | mcp-core ws is opt-in (`ENABLE_WEBSOCKET`), no live wss probe; docs say SSE+HTTP |
| SSE | allow | `apps/mcp-core/src/index.ts:2876`; live mcp health 200 |
| api/mcp/auth/dashboard/docs.lanonasis.com | allow | DNS resolves; live health 200 (api, mcp) |
