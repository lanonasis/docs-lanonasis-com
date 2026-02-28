---
title: CLI SDK
sidebar_label: CLI SDK
description: Command-line interface SDK for building powerful CLI tools and automation scripts
tags:
  - sdk
  - cli
  - command-line
  - automation
---

# CLI SDK

The CLI SDK provides utilities and abstractions for building powerful, user-friendly command-line interfaces and automation scripts.

## Installation

```bash
npm install @lanonasis/cli-sdk
# or
yarn add @lanonasis/cli-sdk
```

## Quick Start

```typescript
import { CLI } from "@lanonasis/cli-sdk";

const cli = new CLI({
  name: "myapp",
  version: "1.0.0",
  description: "My awesome CLI application",
});

// Add a command
cli
  .command("greet <name>", "Greet someone")
  .option("-l, --loud", "Greet loudly")
  .action((name, options) => {
    const greeting = `Hello, ${name}!`;
    console.log(options.loud ? greeting.toUpperCase() : greeting);
  });

cli.run(process.argv);
```

## Core Concepts

### Commands

Define commands and subcommands.

```typescript
// Simple command
cli.command("deploy", "Deploy the application").action(() => {
  console.log("Deploying...");
});

// Command with arguments
cli
  .command("create <type> <name>", "Create a new resource")
  .action((type, name) => {
    console.log(`Creating ${type}: ${name}`);
  });

// Command with options
cli
  .command("build")
  .option("-p, --production", "Production build")
  .option("-m, --minify", "Minify output")
  .action((options) => {
    console.log("Building...", options);
  });
```

### Subcommands

Organize commands hierarchically.

```typescript
const userCmd = cli.command("user", "User management");

userCmd.command("create <email>", "Create a user").action((email) => {
  console.log(`Creating user: ${email}`);
});

userCmd.command("delete <id>", "Delete a user").action((id) => {
  console.log(`Deleting user: ${id}`);
});

userCmd.command("list", "List all users").action(() => {
  console.log("Users: ...");
});
```

## Commands & Options

### Adding Options

```typescript
cli
  .command("publish")
  .option("-t, --tag <tag>", "Version tag")
  .option("-d, --dry-run", "Dry run mode")
  .option("-v, --verbose", "Verbose output")
  .option("--skip-tests", "Skip running tests")
  .action((options) => {
    if (options.verbose) {
      console.log("Verbose mode enabled");
    }
    if (options.dryRun) {
      console.log("Dry run - no changes made");
    }
  });
```

### Option Types

```typescript
cli
  .command("config")
  .option("-c, --count <n>", "Number", parseInt) // Number
  .option("-s, --strings <items...>", "Multiple strings") // Array
  .option("-f, --file <path>", "File path") // String
  .option("-j, --json <data>", "JSON data", JSON.parse) // JSON
  .action((options) => {
    console.log(options);
  });
```

## Interactive Features

### Prompts

```typescript
import { prompt } from "@lanonasis/cli-sdk";

const answer = await prompt({
  type: "text",
  name: "username",
  message: "Enter your username",
});

const confirmed = await prompt({
  type: "confirm",
  name: "proceed",
  message: "Are you sure?",
  default: false,
});

const choice = await prompt({
  type: "select",
  name: "action",
  message: "Choose an action",
  choices: ["Create", "Update", "Delete"],
});
```

### Progress Bars

```typescript
import { progress } from "@lanonasis/cli-sdk";

const bar = progress({
  total: 100,
  width: 30,
});

for (let i = 0; i <= 100; i++) {
  bar.update(i);
  await sleep(100);
}
```

### Spinners

```typescript
import { spinner } from "@lanonasis/cli-sdk";

const spin = spinner("Loading...");

try {
  await longRunningTask();
  spin.succeed("Completed!");
} catch (error) {
  spin.fail("Failed!");
}
```

## Examples

### Build CLI

```typescript
import { CLI, spinner, progress } from "@lanonasis/cli-sdk";

const cli = new CLI({
  name: "mybuild",
  version: "1.0.0",
});

cli
  .command("build")
  .option("-p, --production", "Production build")
  .option("-w, --watch", "Watch mode")
  .action(async (options) => {
    const spin = spinner("Building...");

    try {
      // Compile assets
      const bar = progress({ total: 100, width: 40 });

      for (let i = 0; i <= 100; i++) {
        bar.update(i);
        await sleep(50);
      }

      if (options.production) {
        spin.text = "Optimizing...";
        await optimizeAssets();
      }

      spin.succeed("Build complete!");
    } catch (error) {
      spin.fail(error.message);
      process.exit(1);
    }
  });

cli.run(process.argv);
```

### Database CLI

```typescript
import { CLI, prompt, confirm } from "@lanonasis/cli-sdk";

const cli = new CLI({
  name: "dbcli",
  version: "1.0.0",
});

const db = cli.command("db", "Database management");

db.command("migrate", "Run migrations").action(async () => {
  const confirmed = await confirm("Run pending migrations?");
  if (!confirmed) return;

  // Run migrations
  console.log("Migrations complete");
});

db.command("seed <file>", "Seed database").action(async (file) => {
  const confirmed = await confirm(`Seed from ${file}?`);
  if (!confirmed) return;

  // Seed database
  console.log("Database seeded");
});

db.command("backup", "Backup database")
  .option("-o, --output <path>", "Output file")
  .action(async (options) => {
    const spin = spinner("Backing up...");
    try {
      // Create backup
      spin.succeed(`Backup saved to ${options.output || "backup.sql"}`);
    } catch (error) {
      spin.fail(error.message);
    }
  });

cli.run(process.argv);
```

### Deploy CLI

```typescript
import { CLI, select, confirm, progress } from "@lanonasis/cli-sdk";

const cli = new CLI({ name: "deploy" });

cli
  .command("deploy")
  .option("-e, --env <env>", "Environment")
  .action(async (options) => {
    let env = options.env;

    if (!env) {
      env = await select("Choose environment:", ["staging", "production"]);
    }

    const confirmed = await confirm(
      `Deploy to ${env}?`,
      env === "production" ? false : true,
    );

    if (!confirmed) {
      console.log("Deployment cancelled");
      return;
    }

    const steps = ["Build", "Test", "Deploy", "Verify"];
    const bar = progress({ total: steps.length });

    for (let i = 0; i < steps.length; i++) {
      bar.update(i + 1, `${steps[i]}...`);
      await runStep(steps[i], env);
    }

    console.log(`✓ Successfully deployed to ${env}`);
  });

cli.run(process.argv);
```

### Git Helper CLI

```typescript
import { CLI, spinner } from "@lanonasis/cli-sdk";
import { execSync } from "child_process";

const cli = new CLI({ name: "githelper" });

cli
  .command("commit-all <message>", "Stage and commit all changes")
  .action((message) => {
    const spin = spinner("Creating commit...");
    try {
      execSync("git add .");
      execSync(`git commit -m "${message}"`);
      spin.succeed("Commit created");
    } catch (error) {
      spin.fail(error.message);
    }
  });

cli.command("sync", "Pull, resolve conflicts, and push").action(async () => {
  const spin = spinner("Syncing...");
  try {
    spin.text = "Pulling changes...";
    execSync("git pull");

    spin.text = "Pushing changes...";
    execSync("git push");

    spin.succeed("Repository synced");
  } catch (error) {
    spin.fail(error.message);
  }
});

cli.run(process.argv);
```

## Configuration

### CLI Options

```typescript
const cli = new CLI({
  name: "myapp",
  version: "1.0.0",
  description: "My awesome CLI",
  author: "John Doe",
  license: "MIT",

  // Optional
  helpIndent: 2, // Help text indentation
  showHelpOnEmpty: true, // Show help if no command
  showVersionWithHelp: true, // Include version in help
  unknownCommandMessage: true, // Show error for unknown commands
});
```

## Output Formatting

### Tables

```typescript
import { table } from "@lanonasis/cli-sdk";

const data = [
  { name: "Alice", role: "Engineer", status: "Active" },
  { name: "Bob", role: "Designer", status: "Active" },
  { name: "Charlie", role: "Manager", status: "Inactive" },
];

table(data);
// ┌─────────┬──────────┬────────┐
// │ name    │ role     │ status │
// ├─────────┼──────────┼────────┤
// │ Alice   │ Engineer │ Active │
// │ Bob     │ Designer │ Active │
// │ Charlie │ Manager  │ Inactive
// └─────────┴──────────┴────────┘
```

### Colors

```typescript
import { colors } from "@lanonasis/cli-sdk";

console.log(colors.green("✓ Success"));
console.log(colors.red("✗ Error"));
console.log(colors.blue("ℹ Information"));
console.log(colors.yellow("⚠ Warning"));

// Usage
console.log(`Status: ${colors.bold(colors.green("Active"))}`);
```

## Error Handling

```typescript
cli.command("process <file>").action((file) => {
  try {
    // Process file
  } catch (error) {
    console.error(colors.red(`Error: ${error.message}`));
    process.exit(1);
  }
});

// Global error handler
cli.on("error", (error) => {
  console.error(colors.red("Fatal error:", error.message));
  process.exit(1);
});
```

## Best Practices

1. **Clear Command Names**: Use descriptive, lowercase command names
2. **Provide Defaults**: Use sensible defaults for options
3. **Confirm Destructive Actions**: Prompt before deleting/deploying
4. **Progress Feedback**: Show progress for long operations
5. **Clear Error Messages**: Help users understand what went wrong
6. **Version Management**: Include version info and help
7. **Colors Wisely**: Use colors for emphasis, not clutter

## API Reference

For detailed platform API coverage, see [API Overview](/api/overview)

## Support

For issues and questions:

- GitHub: [lanonasis/cli-sdk](https://github.com/lanonasis/cli-sdk)
- Discord: [Join our community](https://discord.gg/lanonasis)
- Email: support@lanonasis.com
