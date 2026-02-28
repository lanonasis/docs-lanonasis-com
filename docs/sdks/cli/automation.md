---
title: CLI Automation
sidebar_label: Automation
---

# CLI Automation

Automate LanOnasis workflows by scripting the CLI in CI jobs, shell scripts, and local task runners.

## Common Patterns

- Use `lanonasis auth login` once, then rely on the stored session for repeated commands.
- Prefer machine-readable output (`--json` where available) when piping into other tools.
- Use the [Commands Reference](/sdks/cli/commands) for the full command surface.

## Related Docs

- [CLI Installation](/sdks/cli/installation)
- [CLI Commands](/sdks/cli/commands)
- [API Overview](/api/overview)
