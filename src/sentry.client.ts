/**
 * Sentry browser initialization for docs-lanonasis.
 * Loaded via Docusaurus clientModules — runs browser-side only, never during SSG.
 *
 * IMPORTANT: This file must never throw. All Sentry errors are swallowed
 * to prevent monitoring from taking down the docs site.
 */
import * as Sentry from '@sentry/react';

const dsn = process.env.SENTRY_DSN || '';

// Do nothing if DSN is not configured (local dev without .env.local, CI, etc.)
if (dsn) {
  try {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'production',
      // Low sample rate for docs — not a transactional app
      tracesSampleRate: 0.1,
      // Only capture errors from our domain, not third-party scripts
      allowUrls: [/docs\.lanonasis\.com/],
      // Do not send in development unless explicitly requested
      enabled: process.env.NODE_ENV === 'production',
      // Release tag — set by CI via SENTRY_RELEASE env var
      release: process.env.SENTRY_RELEASE,
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

// Export nothing — clientModules are side-effect-only
export {};
