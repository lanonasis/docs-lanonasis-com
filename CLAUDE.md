# docs-lanonasis

Docusaurus documentation site.

## Commands (run from this directory)

- `bun run start` — local dev server
- `bun run build` — includes `prebuild`/`postbuild` doc generation and sync steps
- `bun run typecheck`
- `bun run check:docs-sync` / `check:links` / `check:endpoints` / `check:all` — doc/API consistency checks
- `bun run generate:api-docs` / `generate:complete-docs` — regenerate API reference from source

## Notes

- Keep generated docs in sync with source via `sync:docs` before publishing changes.
