#!/bin/bash
# Sentry source map upload — runs after docusaurus build
# Only runs in CI/Vercel (SENTRY_AUTH_TOKEN must be set)
# Safe to skip locally.

set -e

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "SENTRY_AUTH_TOKEN not set — skipping source map upload"
  exit 0
fi

if [ -z "$SENTRY_DSN" ]; then
  echo "SENTRY_DSN not set — skipping source map upload"
  exit 0
fi

RELEASE="${SENTRY_RELEASE:-$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')}"
ORG="${SENTRY_ORG:-lan-onasis}"
PROJECT="${SENTRY_PROJECT:-docs-lanonasis}"

echo "Uploading source maps for release: $RELEASE"

# Create the release
sentry-cli releases new --org "$ORG" --project "$PROJECT" "$RELEASE"

# Upload source maps for all locale builds
# Docusaurus outputs to build/ with locale subdirs for non-default locales
sentry-cli sourcemaps upload \
  --org "$ORG" \
  --project "$PROJECT" \
  --release "$RELEASE" \
  build/

# Finalize the release
sentry-cli releases finalize --org "$ORG" --project "$PROJECT" "$RELEASE"

echo "Source maps uploaded for $RELEASE"
