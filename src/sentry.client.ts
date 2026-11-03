/**
 * Sentry browser initialization for docs-lanonasis.
 *
 * Loaded via Docusaurus clientModules - runs browser-side only, never during SSG.
 *
 * IMPORTANT: This file must never throw. All Sentry errors are swallowed
 * to prevent monitoring from taking down the docs site.
 *
 * WHY NOT process.env.SENTRY_DSN DIRECTLY:
 * Docusaurus/webpack substitutes only `process.env.NODE_ENV` (via webpack's
 * `mode`) plus `process.env.HYDRATE_CLIENT_ENTRY`. Any other `process.env.X`
 * reference survives into the bundle verbatim - and a computed access such as
 * `process.env[key]` can never be substituted at all. In the browser `process`
 * does not exist, so that lookup yields `undefined`, `if (dsn)` is false, and
 * the SDK silently never initialises. The values are therefore injected at
 * build time by `headTags` in docusaurus.config.ts and read from the DOM here.
 */
import * as Sentry from '@sentry/react';

type SentryBuildConfig = {
  dsn?: string;
  release?: string;
  environment?: string;
};

const CONFIG_ELEMENT_ID = 'sentry-build-config';

function readBuildConfig(): SentryBuildConfig {
  try {
    if (typeof document === 'undefined') return {};
    const el = document.getElementById(CONFIG_ELEMENT_ID);
    if (!el || !el.textContent) return {};
    return JSON.parse(el.textContent) as SentryBuildConfig;
  } catch (_) {
    // Malformed config must never break the docs site.
    return {};
  }
}

const buildConfig = readBuildConfig();
const dsn = (buildConfig.dsn ?? '').trim();
const environment = (buildConfig.environment ?? 'production').trim();

// Do nothing if DSN is not configured (local dev without an env file, CI, etc.)
if (dsn) {
  try {
    Sentry.init({
      dsn,
      environment,
      // Low sample rate for docs - not a transactional app
      tracesSampleRate: 0.1,
      // Capture our own origins only: the production domain plus Vercel
      // preview deployments. Without the preview entry every preview error is
      // dropped before it is sent.
      allowUrls: [/docs\.lanonasis\.com/, /\.vercel\.app/],
      // Do not send from a local development build
      enabled: environment !== 'development',
      // Release tag, injected at build time from SENTRY_RELEASE or the Vercel
      // commit SHA so uploaded source maps resolve.
      release: (buildConfig.release ?? '').trim() || undefined,
      // Reduce noise: ignore benign browser errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
      ],
    });
  } catch (_) {
    // Sentry init must never break the docs site
  }
}

// Export nothing - clientModules are side-effect-only
export {};
