# Documentation Audit & Remediation Plan

**Date**: February 26, 2026  
**Status**: 🟡 BUILD PASSES WITH WARNINGS (Broken links temporarily downgraded to `warn`)  
**Coverage**: 🟡 45% (Estimated Professional Coverage)

---

## 1. Executive Summary

Enabling strict link checking (`onBrokenLinks: 'throw'`) identified significant "link rot" across the documentation platform. This branch now uses `warn` temporarily so builds can complete while the link cleanup is in progress. Additionally, an audit of the 32 projects in the monorepo shows that while core platform services are well-documented, the majority of SDKs and shared packages lack professional-grade documentation.

---

## 2. Link Rot Audit (High Severity)

The build identified **50+ broken links** across **22 source pages**.

### Critical: Landing Page (`/`)
The entry point of the documentation contains 11 broken links to core sections:
- `docs/intro` -> **Broken** (File is `intro.md` but link might be missing `/docs/` prefix or routing issues)
- `docs/memory/overview` -> **Broken**
- `docs/unified-services/*` (Payments, Wallets, KYC) -> **Broken**
- `docs/sdks/*` (TypeScript, Python, Go) -> **Broken**

### High: Core Service Pages
- `/platform/mcp-core` -> links to `../mcp/` (**Broken**)
- `/platform/onasis-core` -> links to `../security/` (**Broken**)
- `/v-secure/compliance/overview` -> links to missing files (`soc2.md`, `iso27001.md`, etc.)

---

## 3. Project Coverage Matrix (32 Projects)

| Project Category | Project Name | Docs Status | Quality |
|------------------|--------------|-------------|---------|
| **Apps (11)** | dashboard | 🔴 Missing | N/A |
| | docs-lanonasis | ✅ Complete | Professional |
| | lanonasis-index | ✅ Complete | Professional |
| | lanonasis-maas | ✅ Complete | Professional |
| | mcp-core | ✅ Complete | Professional |
| | mcp-lanonasis | ✅ Complete | Professional |
| | onasis-core | ✅ Complete | Professional |
| | v-secure | ✅ Complete | Professional |
| | vortexai-l0 | ✅ Complete | Professional |
| | control-room | 🟡 Partial | Placeholder |
| | auth-gateway | 🔴 Missing | N/A |
| **Packages (18+)**| memory-intelligence-engine| ✅ Complete | Professional |
| | ai-sdk | 🟡 Partial | No Examples |
| | memory-sdk | 🟡 Partial | No Examples |
| | oauth-client | 🟡 Partial | Placeholder |
| | brand-kit | 🔴 Missing | N/A |
| | ui-kit | 🔴 Missing | N/A |
| | shared-auth | 🔴 Missing | N/A |
| | shared-i18n | 🔴 Missing | N/A |
| | shared-db | 🔴 Missing | N/A |
| | ... (Other 10+) | 🔴 Missing | N/A |
| **Services (3)** | api-gateway | 🟡 Partial | No Specs |
| | key-manager | 🟡 Partial | No Specs |
| | mcp-router | 🟡 Partial | No Specs |

---

## 4. Professionalism Gaps

To reach "Enterprise Professional" standards, the following must be added to 70% of the pages:
1. **Runnable Examples**: TypeScript, Python, and cURL snippets for every endpoint/SDK method.
2. **Error Handling Guides**: Clear tables of error codes and resolution steps.
3. **Architecture Diagrams**: Mermaid/ASCII diagrams for data flow.
4. **Environment Requirements**: Explicit lists of required ENV variables.

---

## 5. Remediation Roadmap

### Immediate (Next 24 Hours)
1. **Fix Landing Page Links**: Restore navigation to core services.
2. **Standardize Routing**: Ensure all internal links use the correct Docusaurus relative pathing (e.g., `./` vs `../`).
3. **Move to `warn` (Temporary)**: Switch `onBrokenLinks` to `warn` ONLY in the dev branch to allow progress while fixing links.

### Short Term (Phase 2D - SDKs)
1. **Generate SDK Docs**: Use automated tools or manual extraction to document all 18+ packages.
2. **Add Code Examples**: Ensure every SDK has a `Quickstart` and `API Reference`.

### Long Term (Phase 4 - Governance)
1. **CI Integration**: Restore `onBrokenLinks: 'throw'` once links are fixed.
2. **PR Templates**: Enforce documentation updates for every code change.

---

## 6. Next Steps for Sub-Agents

1. **Sub-Agent: SDK Auditor** -> Extract READMEs and public APIs from the 18+ packages to bootstrap documentation.
2. **Sub-Agent: Link Fixer** -> Systematically iterate through the `build_output.log` and apply fixes to the Markdown files.
