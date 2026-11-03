#!/bin/bash
# Sentry source map upload - runs after the docusaurus build.
# Only runs where SENTRY_AUTH_TOKEN is set (Vercel/CI). Safe to skip locally.

set -e

# Values are pasted/echoed into env stores by hand, so strip surrounding
# whitespace and any stray CR/LF. A trailing newline in SENTRY_ORG,
# SENTRY_PROJECT or SENTRY_DSN makes sentry-cli fail with a confusing error
# ("Invalid token" / "project not found") and silently breaks the release.
trim() {
  printf '%s' "${1:-}" | tr -d '\r\n' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'
}

AUTH_TOKEN="$(trim "${SENTRY_AUTH_TOKEN:-}")"
DSN_VALUE="$(trim "${SENTRY_DSN:-}")"
ORG="$(trim "${SENTRY_ORG:-lan-onasis}")"
PROJECT="$(trim "${SENTRY_PROJECT:-docs-lanonasis}")"

# Source maps must never reach the deployed bundle: the build emits them so
# sentry-cli can read them, and this removes them from build/ on every exit
# path (including the skips below and a failed upload).
cleanup_maps() {
  local n
  n=$(find build -name '*.map' 2>/dev/null | wc -l | tr -d ' ')
  find build -name '*.map' -delete 2>/dev/null || true
  echo "Removed $n source map file(s) from build/ (never deployed)."
}
trap cleanup_maps EXIT

if [ -z "$AUTH_TOKEN" ]; then
  echo "SENTRY_AUTH_TOKEN not set - skipping source map upload"
  exit 0
fi

if [ -z "$DSN_VALUE" ]; then
  echo "SENTRY_DSN not set - skipping source map upload"
  exit 0
fi

# Same fallback chain as docusaurus.config.ts headTags, so the release tag the
# browser reports matches the release the source maps are uploaded to.
RELEASE="$(trim "${SENTRY_RELEASE:-${VERCEL_GIT_COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null || echo 'unknown')}}")"

# Guard: an invalid/missing project or org makes the upload fail with a
# confusing sentry-cli error and burns build time. Surface an operator action
# instead. Never print the values themselves.
if [ -z "$PROJECT" ] || [ "$PROJECT" = "invalid" ] || [ -z "$ORG" ] || [ "$ORG" = "invalid" ]; then
  echo "SENTRY_PROJECT/SENTRY_ORG resolve to an invalid value; source-map upload skipped." >&2
  echo "Operator action: set SENTRY_ORG and SENTRY_PROJECT in the Vercel project's" >&2
  echo "environment (no trailing newline) so the upload targets a real project." >&2
  exit 0
fi

if [ -z "$RELEASE" ] || [ "$RELEASE" = "unknown" ]; then
  echo "Release could not be determined; source-map upload skipped." >&2
  exit 0
fi

export SENTRY_AUTH_TOKEN="$AUTH_TOKEN"
export SENTRY_ORG="$ORG"
export SENTRY_PROJECT="$PROJECT"

echo "Uploading source maps for release: $RELEASE"

sentry-cli releases new "$RELEASE"
sentry-cli sourcemaps upload --release "$RELEASE" build/
sentry-cli releases finalize "$RELEASE"

echo "Source maps uploaded for $RELEASE"
