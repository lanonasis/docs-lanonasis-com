#!/usr/bin/env node
/**
 * validate-external-urls.mjs — deterministic external URL validator (P4).
 *
 * Extracts every absolute http(s) URL from the docs prose and HEADs each with
 * a small concurrency + delay to be polite and deterministic. Fails on 4xx/5xx
 * responses (or connection errors). Skips:
 *   - localhost / 127.0.0.1 / 0.0.0.0 / *.local / *.example.com / ngrok.io and
 *     other obvious placeholders (documented in the skip list below).
 *   - URLs inside fenced code blocks (sample payloads).
 *   - URLs listed in docs/.validator-allowlists/external-urls.json
 *     (known-flaky or temporarily-down, documented).
 *
 * USAGE:
 *   node scripts/validate-external-urls.mjs                  # scan docs/ (default)
 *   node scripts/validate-external-urls.mjs --dir <path>     # fixture dir
 *   node scripts/validate-external-urls.mjs --concurrency 4 --delay 150
 *
 * EXIT: 0 if every checked URL responds 2xx/3xx; 1 otherwise.
 *
 * ESCAPE HATCH (audit §6.5): do NOT delete this validator. Add a flaky or
 * temporarily-down URL to docs/.validator-allowlists/external-urls.json with a
 * reason, not to this script. As a last resort the docs CI gates it behind
 * `ignore-docs-validator`.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const DEFAULT_DIR = join(REPO_ROOT, 'docs');
const ALLOWLIST = join(REPO_ROOT, 'docs/.validator-allowlists/external-urls.json');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}
const TARGET = resolve(arg('--dir') || DEFAULT_DIR);
const CONCURRENCY = Math.max(1, parseInt(arg('--concurrency') || '4', 10));
const DELAY_MS = Math.max(0, parseInt(arg('--delay') || '150', 10));

// Placeholder / non-public hosts that must never be HEAD-checked.
const PLACEHOLDER_RE =
  /(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|\.local|\.example\.(com|net|org)|example\.com|\.internal|\.lan$|ngrok\.io|\.invalid)/i;

let allowlist = { urls: [], reason: '' };
if (existsSync(ALLOWLIST)) {
  allowlist = JSON.parse(readFileSync(ALLOWLIST, 'utf8'));
}
const allowedUrls = new Set((allowlist.urls || []).map((u) => u.url || u));

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (entry === '.validator-allowlists') continue;
      walk(p, acc);
    } else if (p.endsWith('.md') || p.endsWith('.mdx')) {
      acc.push(p);
    }
  }
  return acc;
}

function extractUrls(content) {
  const urls = new Set();
  // mask fenced code blocks
  const masked = content.replace(/```[\s\S]*?```/g, '');
  for (const m of masked.matchAll(/https?:\/\/[^\s"'<>`)\]]+/g)) {
    let u = m[0].replace(/[.,;:!?]+$/, '');
    if (u.includes('{') || u.includes('}') || u.includes('<') || u.includes('>')) continue; // templates
    if (PLACEHOLDER_RE.test(u)) continue;
    urls.add(u);
  }
  return [...urls];
}

async function check(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    if (res.status >= 400) {
      // Some servers reject HEAD; fall back to GET.
      const g = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
      return g.status;
    }
    return res.status;
  } catch {
    return 0;
  } finally {
    clearTimeout(t);
  }
}

async function run() {
  const files = walk(TARGET);
  const urlSet = new Set();
  for (const f of files) {
    for (const u of extractUrls(readFileSync(f, 'utf8'))) urlSet.add(u);
  }
  const urls = [...urlSet].filter((u) => !allowedUrls.has(u) && !allowedUrls.has(new URL(u).host));
  const results = [];
  let idx = 0;
  const failures = [];

  async function worker() {
    while (idx < urls.length) {
      const u = urls[idx++];
      const status = await check(u);
      results.push({ url: u, status });
      if (status === 0 || status >= 400) {
        failures.push({ url: u, status });
      }
      if (DELAY_MS > 0) await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }
  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker());
  await Promise.all(workers);

  for (const { url, status } of results) {
    const ok = status !== 0 && status < 400;
    console.log(`${ok ? 'OK ' : 'ERR'} ${String(status).padStart(3)} ${url}`);
  }

  if (failures.length > 0) {
    console.error(`\n🔴 validate:external-urls FAILED — ${failures.length} URL(s) unreachable or 4xx/5xx.`);
    for (const f of failures) {
      console.error(`  ✗ ${f.url} (${f.status === 0 ? 'connection error' : f.status})`);
    }
    console.error('   Add flaky/down URLs to docs/.validator-allowlists/external-urls.json with a reason.');
    process.exit(1);
  } else {
    console.log(`✅ validate:external-urls PASSED — ${results.length} external URL(s) reachable (${files.length} file(s)).`);
  }
}

run();
