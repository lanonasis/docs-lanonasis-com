# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Lanonasis Documentation - 100% Self-Hosted Solution

## Overview

A beautiful, searchable, and interactive documentation site for Lanonasis Memory Service - completely self-hosted with **ZERO external dependencies**.

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
