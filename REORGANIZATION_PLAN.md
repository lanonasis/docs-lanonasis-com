# docs-lanonasis Reorganization Plan

**Date**: December 28, 2025  
**Status**: Ready to Execute  
**Based on**: `MONOREPO_REORGANIZATION_PLAN.md`

---

## Overview

This plan provides a systematic approach to reorganizing the `apps/docs-lanonasis` codebase. The reorganization will:

1. ✅ Clean up the root directory (currently 22 files)
2. ✅ Group documentation by domain
3. ✅ Archive historical fix summaries
4. ✅ Organize scripts by purpose
5. ✅ Maintain canonical references for active development
6. ✅ Improve discoverability and maintainability
7. ✅ Preserve 100% functionality with easy referencing

---

## Current State Analysis

### Root Directory Issues

- **22 files** in the root directory
- Mix of active docs, historical fixes, and scripts
- Difficult to find relevant documentation
- No clear organization

### File Inventory

**Documentation** (16 MD files):
- REORGANIZATION_PLAN.md
- DEPLOYMENT-CHECKLIST.md
- MAAS-IMPLEMENTATION-GUIDE.md
- DOCUMENTATION_VS_CODEBASE_COMPARISON.md
- TYPESCRIPT-FIXES.md
- docs-gap-remediation-plan.md
- DOCS_README.md
- README.md
- index.md
- PROJECT-ROADMAP.md
- MCP-REMOTE-CONNECTION.md
- FINAL-SUMMARY.md
- README-PLAYGROUND.md
- README-SELFHOSTED.md
- CI.md
- INTEGRATION-SUMMARY.md
- PLAYGROUND-FIX.md

**Scripts** (6 files):
- test-mcp-bridge.js
- test-playground.sh
- monitor.sh
- deploy.sh
- debug-mcp-files.js
- mcp-bridge.js

---

## Reorganization Plan

### Phase 0: Canonical References (DO NOT MOVE)

These locations are the **source of truth** and must remain in root:

| Area | Location | Contents |
|------|----------|----------|
| App Config | Root | `package.json`, `tsconfig.json`, etc. |
| Build Config | Root | `vite.config.ts`, `netlify.toml`, etc. |
| Main Docs | Root | `README.md` |

### Phase 1: New Folder Structure

```
apps/docs-lanonasis/
├── docs/                          # All documentation organized by domain
│   ├── architecture/              # Architecture documentation
│   ├── deployment/                # Deployment guides
│   ├── fixes/                     # Historical fixes
│   ├── guides/                    # User/developer guides
│   └── [domain-specific]/         # App-specific domains
│
├── scripts/                       # All scripts organized by purpose
│   ├── test/                      # Test scripts
│   ├── setup/                     # Setup scripts
│   ├── migration/                 # Migration scripts
│   ├── deployment/                # Deployment scripts
│   └── fix/                       # Fix scripts
│
├── config/                        # Non-essential configuration files
│   └── [config-type]/             # Config categories
│
├── .archive/                      # Historical archives
│   ├── fixes/                     # Completed fixes
│   └── status/                    # Status reports
│
└── [Root files]                   # Only essential files remain
    ├── README.md
    ├── package.json
    └── [essential-configs]
```

---

## File Movement Mapping

### Documentation

**Move to `docs/architecture/`**:


**Move to `docs/deployment/`**:
- DEPLOYMENT-CHECKLIST.md

**Move to `docs/fixes/`**:
- TYPESCRIPT-FIXES.md
- PLAYGROUND-FIX.md

**Move to `docs/guides/`**:
- MAAS-IMPLEMENTATION-GUIDE.md
- DOCS_README.md
- README.md
- README-PLAYGROUND.md
- README-SELFHOSTED.md

**Move to `docs/`** (other documentation):
- REORGANIZATION_PLAN.md
- DOCUMENTATION_VS_CODEBASE_COMPARISON.md
- docs-gap-remediation-plan.md
- index.md
- PROJECT-ROADMAP.md
- MCP-REMOTE-CONNECTION.md
- FINAL-SUMMARY.md
- CI.md
- INTEGRATION-SUMMARY.md

### Scripts

**Move to `scripts/test/`**:
- test-mcp-bridge.js
- test-playground.sh

**Move to `scripts/setup/`**:


**Move to `scripts/migration/`**:


**Move to `scripts/deployment/`**:
- deploy.sh

**Move to `scripts/fix/`**:


**Move to `scripts/`** (other scripts):
- monitor.sh
- debug-mcp-files.js
- mcp-bridge.js

---

## Execution Strategy

### Option 1: Automated Script (Recommended)

Create `apps/docs-lanonasis/REORGANIZE_docs-lanonasis.sh` based on this plan.

### Option 2: Manual Execution

Execute in phases following the same pattern as monorepo root.

---

## Post-Reorganization Tasks

1. Update cross-references in documentation
2. Update external references (CI/CD, READMEs)
3. Create README files in each new folder
4. Test all links
5. Verify all tests pass

---

## Success Criteria

The reorganization is successful when:

1. ✅ Root directory has ≤10 essential files
2. ✅ All documentation is in appropriate folders
3. ✅ All scripts are organized by purpose
4. ✅ README files exist in each new folder
5. ✅ No broken links in documentation
6. ✅ Git history is preserved (using `git mv`)
7. ✅ All tests pass
8. ✅ Functionality remains at 100%

---

## Timeline

**Estimated Time**: 30-45 minutes

---

## Related Documents

- `MONOREPO_REORGANIZATION_PLAN.md` - Monorepo root reorganization
- `apps/onasis-core/REORGANIZATION_GUIDE.md` - Onasis-core specific guide

---

**Ready to reorganize?** Review this plan and execute when ready! 🚀
