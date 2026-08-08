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

# Guard: an invalid/missing project value makes the upload fail with a
# confusing sentry-cli error and burns CI time. Detect the known-bad value
# here and surface an operator action instead. Never print the value itself.
if [ "$PROJECT" = "invalid" ] || [ -z "$PROJECT" ]; then
  echo "SENTRY_PROJECT resolves to an invalid value; source-map upload skipped." >&2
  echo "Operator action: set SENTRY_PROJECT (or SENTRY_ORG) in the Vercel project's" >&2
  echo "environment so Sentry release/upload targets a real project." >&2
  exit 0
fi

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
