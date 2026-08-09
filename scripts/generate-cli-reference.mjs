/**
 * generate-cli-reference.mjs
 *
 * Source-derived generator/validator for docs/cli/reference.md.
 *
 * Reads the built LanOnasis CLI at apps/lanonasis-maas/cli/dist/index.js and
 * renders a markdown command reference from its built-in --help output. This is
 * the most accurate source of available commands, aliases, options, and
 * descriptions without re-implementing Commander's parsing logic.
 *
 * Usage:
 *   node scripts/generate-cli-reference.mjs          # write docs/cli/reference.md
 *   node scripts/generate-cli-reference.mjs --check  # verify parity (CI)
 *
 * Environment overrides:
 *   LANONASIS_CLI_DIST - path to the built CLI entry point (defaults to
 *                        REPO_ROOT/apps/lanonasis-maas/cli/dist/index.js)
 */

import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, realpathSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');
const CLI_DIST_DEFAULT = join(REPO_ROOT, 'apps/lanonasis-maas/cli/dist/index.js');
const CLI_DIST = process.env.LANONASIS_CLI_DIST || CLI_DIST_DEFAULT;
const REFERENCE_DOC = join(__dirname, '..', 'docs/cli/reference.md');
const CHECK_MODE = process.argv.includes('--check');

const GROUP_ORDER = [
  { id: 'setup', label: 'Setup' },
  { id: 'auth', label: 'Authentication' },
  { id: 'memory', label: 'Memory' },
  { id: 'topic', label: 'Topics' },
  { id: 'config', label: 'Configuration' },
  { id: 'org', label: 'Organization' },
  { id: 'keys', label: 'API Keys' },
  { id: 'prescan', label: 'Prescan' },
  { id: 'mcp', label: 'MCP' },
  { id: 'completion', label: 'Completion' },
  { id: 'system', label: 'System' },
  { id: 'platform', label: 'Platform Management' },
];

const COMMAND_GROUPS = {
  init: 'setup',
  auth: 'auth',
  memory: 'memory',
  topic: 'topic',
  config: 'config',
  org: 'org',
  'api-keys': 'keys',
  prescan: 'prescan',
  mcp: 'mcp',
  'mcp-server': 'mcp',
  completion: 'completion',
  status: 'system',
  whoami: 'system',
  health: 'system',
  docs: 'system',
  repl: 'system',
  dashboard: 'platform',
  documentation: 'platform',
  sdk: 'platform',
  api: 'platform',
  deploy: 'platform',
  service: 'platform',
};

/**
 * Run the CLI with --help and return cleaned stdout. The CLI prints a dotenv
 * tip on the first line; we strip it so the output is deterministic.
 */
function runHelp(commandPath) {
  if (!existsSync(CLI_DIST)) {
    throw new Error(`CLI distribution not found at ${CLI_DIST}. Build apps/lanonasis-maas/cli first or set LANONASIS_CLI_DIST.`);
  }
  const args = commandPath ? commandPath.split(' ') : [];
  const env = { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1', COLUMNS: '200' };
  const out = execFileSync('node', [CLI_DIST, ...args, '--help'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, env });
  return out
    .split('\n')
    .filter((line) => !line.startsWith('[dotenv@') && !line.startsWith('injecting env'))
    .join('\n');
}

function parseHelp(text) {
  const lines = text.split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => l.trim().length > 0);
  const usageLineIndex = lines.findIndex((l) => l.startsWith('Usage:'));
  const usageLine = usageLineIndex >= 0 ? lines[usageLineIndex] : '';
  const usageMatch = usageLine.match(/Usage:\s+\S+\s+(.+?)(?:\s+\[options\])?(?:\s+\[command\])?\s*$/);
  const usage = usageMatch ? usageMatch[1].trim() : '';

  // Collect description lines until Options:/Commands:/Usage:/(empty)
  const descriptionLines = [];
  for (let i = usageLineIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^(Options|Commands):/.test(line.trim())) break;
    descriptionLines.push(line.trim());
  }
  const description = descriptionLines.join(' ').trim();

  const options = [];
  const commands = [];
  let section = null;

  const cmdLineRegex = /^\s+([a-zA-Z0-9_-]+(?:\|[a-zA-Z0-9_-]+)*)((?:\s+(?:<[^>]+>|\[[^\]]+\]|\.\.\.))*)(?:\s+\[options\])?\s{2,}(.+)$/;
  const optLineRegex = /^\s+((?:-[a-zA-Z-],?\s+)?--[a-zA-Z0-9-]+(?:\s+<[^>]+>)?(?:\s+\[[^\]]+\])?)\s+(.+)$/;
  const isContinuation = (line) => /^\s{8,}/.test(line) && !cmdLineRegex.test(line) && !optLineRegex.test(line);

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'Options:') {
      section = 'options';
      continue;
    }
    if (trimmed === 'Commands:') {
      section = 'commands';
      continue;
    }
    if (section === 'options') {
      const m = line.match(optLineRegex);
      if (m) {
        options.push({ flags: m[1].trim(), description: m[2].trim() });
      } else if (isContinuation(line)) {
        const last = options[options.length - 1];
        if (last) last.description += ' ' + trimmed;
      }
    } else if (section === 'commands') {
      const m = line.match(cmdLineRegex);
      if (m) {
        const primary = m[1].split('|')[0];
        if (primary === 'help') continue;
        commands.push({ names: m[1], description: m[3].trim() });
      } else if (isContinuation(line)) {
        const last = commands[commands.length - 1];
        if (last) last.description += ' ' + trimmed;
      }
    }
  }

  return { usage, description, options, commands };
}

function collectCommands() {
  const root = parseHelp(runHelp(''));
  const topLevel = root.commands.map((c) => {
    const primary = c.names.split('|')[0];
    return {
      primary,
      aliases: c.names.split('|').slice(1),
      names: c.names,
      description: c.description,
      group: COMMAND_GROUPS[primary] || 'platform',
    };
  });

  const all = [];
  for (const cmd of topLevel) {
    const help = parseHelp(runHelp(cmd.primary));
    const entry = { ...cmd, options: help.options, subcommands: [] };
    for (const sub of help.commands) {
      const subPrimary = sub.names.split('|')[0];
      if (subPrimary === 'help') continue;
      const subHelp = parseHelp(runHelp(`${cmd.primary} ${subPrimary}`));
      entry.subcommands.push({
        primary: subPrimary,
        aliases: sub.names.split('|').slice(1),
        names: sub.names,
        description: sub.description,
        options: subHelp.options,
      });
    }
    all.push(entry);
  }
  return { globalOptions: root.options, topLevel: all };
}

function escapeCell(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function codeExample(commandPath, args = '') {
  return `\`onasis ${commandPath}${args ? ' ' + args : ''}\``;
}

function renderDoc({ globalOptions, topLevel }) {
  const stamp = new Date().toISOString().slice(0, 10);
  const version = (() => {
    try {
      const pkgPath = join(dirname(CLI_DIST), '..', 'package.json');
      if (existsSync(pkgPath)) {
        return JSON.parse(readFileSync(pkgPath, 'utf8')).version;
      }
      const realPkgPath = realpathSync(pkgPath);
      if (existsSync(realPkgPath)) {
        return JSON.parse(readFileSync(realPkgPath, 'utf8')).version;
      }
    } catch {
      // fall through
    }
    return 'unknown';
  })();

  let out = '';
  out += '---\n';
  out += 'title: CLI Reference\n';
  out += 'sidebar_label: CLI Reference\n';
  out += '---\n\n';
  out += '<!-- DO NOT EDIT BY HAND. Generated from the built LanOnasis CLI by\n';
  out += '     scripts/generate-cli-reference.mjs. Run `node scripts/generate-cli-reference.mjs`\n';
  out += '     to regenerate. CI fails the build if the doc and the CLI disagree\n';
  out += '     (`bun run validate:cli-docs`). -->\n\n';
  out += '# LanOnasis CLI Reference\n\n';
  out += `Complete reference for the \`@lanonasis/cli\` v<!-- AUTO:CLI_VERSION -->${version}<!-- /AUTO --> — Professional CLI for Memory as a Service (MaaS).\n\n`;

  out += '## Installation\n\n';
  out += '```bash\n';
  out += '# Global installation (recommended)\n';
  out += 'npm install -g @lanonasis/cli\n\n';
  out += '# Verify installation\n';
  out += 'onasis --version\n';
  out += '```\n\n';

  out += '## Command Aliases\n\n';
  out += 'The primary command is `onasis`. The same binary is also exposed as:\n\n';
  out += '- `lanonasis`\n';
  out += '- `memory` (memory-focused operations)\n';
  out += '- `maas` (Memory as a Service operations)\n\n';
  out += 'All examples below use `onasis`, but any alias works.\n\n';

  out += '## Global Options\n\n';
  out += '| Option | Description |\n';
  out += '|--------|-------------|\n';
  for (const opt of globalOptions) {
    out += `| \`${escapeCell(opt.flags)}\` | ${escapeCell(opt.description)} |\n`;
  }
  out += '\n';

  // Command index
  out += '## Command Index\n\n';
  out += '| Command | Aliases | Description |\n';
  out += '|---------|---------|-------------|\n';
  for (const cmd of topLevel) {
    const aliases = cmd.aliases.length ? cmd.aliases.map((a) => `\`${a}\``).join(', ') : '—';
    out += `| ${codeExample(cmd.primary)} | ${aliases} | ${escapeCell(cmd.description)} |\n`;
  }
  out += '\n';

  // Grouped detailed sections
  const groups = new Map(GROUP_ORDER.map((g) => [g.id, { ...g, commands: [] }]));
  for (const cmd of topLevel) {
    groups.get(cmd.group).commands.push(cmd);
  }

  for (const group of GROUP_ORDER) {
    const { commands } = groups.get(group.id);
    if (commands.length === 0) continue;
    out += `## ${group.label} Commands\n\n`;
    for (const cmd of commands) {
      out += `### \`onasis ${cmd.primary}\`\n\n`;
      if (cmd.aliases.length) {
        out += `**Aliases:** ${cmd.aliases.map((a) => `\`${a}\``).join(', ')}\n\n`;
      }
      out += `${escapeCell(cmd.description)}\n\n`;

      if (cmd.options.length > 0) {
        out += '**Options:**\n\n';
        out += '| Option | Description |\n';
        out += '|--------|-------------|\n';
        for (const opt of cmd.options) {
          out += `| \`${escapeCell(opt.flags)}\` | ${escapeCell(opt.description)} |\n`;
        }
        out += '\n';
      }

      if (cmd.subcommands.length > 0) {
        out += '**Subcommands:**\n\n';
        out += '| Subcommand | Aliases | Description |\n';
        out += '|------------|---------|-------------|\n';
        for (const sub of cmd.subcommands) {
          const aliases = sub.aliases.length ? sub.aliases.map((a) => `\`${a}\``).join(', ') : '—';
          out += `| ${codeExample(`${cmd.primary} ${sub.primary}`)} | ${aliases} | ${escapeCell(sub.description)} |\n`;
        }
        out += '\n';

        // Options for subcommands that have options
        for (const sub of cmd.subcommands) {
          if (sub.options.length === 0) continue;
          out += `#### ${codeExample(`${cmd.primary} ${sub.primary}`)}\n\n`;
          out += '| Option | Description |\n';
          out += '|--------|-------------|\n';
          for (const opt of sub.options) {
            out += `| \`${escapeCell(opt.flags)}\` | ${escapeCell(opt.description)} |\n`;
          }
          out += '\n';
        }
      }
    }
  }

  out += '## Common Examples\n\n';
  out += '```bash\n';
  out += '# Initialize the CLI\n';
  out += 'onasis init\n\n';
  out += '# Authenticate\n';
  out += 'onasis auth login\n\n';
  out += '# Check system health\n';
  out += 'onasis health\n\n';
  out += '# Create a memory\n';
  out += 'onasis memory create --title "Note" --content "..." --type knowledge\n\n';
  out += '# Search memories\n';
  out += 'onasis memory search "query text" --limit 10\n\n';
  out += '# List API keys\n';
  out += 'onasis api-keys list\n\n';
  out += '# List MCP tools\n';
  out += 'onasis mcp tools\n';
  out += '```\n\n';

  out += '## Related Documentation\n\n';
  out += '- [SDKs & Libraries](../sdks/overview.md) — language clients and packages\n';
  out += '- [MCP Tools Reference](../mcp/tools.md) — MCP server tools\n';
  out += '- [Auth Overview](../auth/central-auth-gateway.md) — authentication flows\n';
  out += '- [REST API Reference](../memory/rest-api.md) — API endpoints\n';

  out += `\n<!-- Generated ${stamp} from @lanonasis/cli v${version}. -->\n`;
  return out;
}

function main() {
  const data = collectCommands();
  const doc = renderDoc(data);

  if (CHECK_MODE) {
    if (!existsSync(REFERENCE_DOC)) {
      console.error(`❌ ${REFERENCE_DOC} missing — run without --check to generate.`);
      process.exit(1);
    }
    const existing = readFileSync(REFERENCE_DOC, 'utf8');
    // Strip the date-bearing generation footer before comparing.
    const normalize = (s) => s.replace(/<!-- Generated \d{4}-\d{2}-\d{2} from @lanonasis\/cli v[^.]+\. -->\n/, '');
    if (normalize(existing) !== normalize(doc)) {
      console.error(`❌ CLI reference doc is out of sync with the built CLI.`);
      console.error(`   Run: node scripts/generate-cli-reference.mjs`);
      process.exit(1);
    }
    console.log(`✅ CLI reference parity verified (${data.topLevel.length} top-level commands, ${data.topLevel.reduce((a, c) => a + c.subcommands.length, 0)} subcommands).`);
    return;
  }

  writeFileSync(REFERENCE_DOC, doc, 'utf8');
  console.log(`✅ Generated ${REFERENCE_DOC} (${data.topLevel.length} top-level commands, ${data.topLevel.reduce((a, c) => a + c.subcommands.length, 0)} subcommands).`);
}

main();
