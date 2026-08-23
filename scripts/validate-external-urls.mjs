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
import { lookup } from 'dns/promises';
import { join, dirname, resolve } from 'path';
import { isIP } from 'net';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const DEFAULT_DIR = join(REPO_ROOT, 'docs');
const ALLOWLIST = join(REPO_ROOT, 'docs/.validator-allowlists/external-urls.json');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

function integerArg(name, fallback) {
  const raw = arg(name);
  if (raw === null) return fallback;
  if (!/^\d+$/.test(raw)) {
    console.error(`❌ validate:external-urls — invalid ${name} value: ${raw}`);
    process.exit(2);
  }
  return Number(raw);
}

const TARGET = resolve(arg('--dir') || DEFAULT_DIR);
const FIXTURE_MAP_PATH = arg('--fixture-map');
const CONCURRENCY = Math.max(1, integerArg('--concurrency', 4));
const DELAY_MS = integerArg('--delay', 150);

// Placeholder / non-public hosts that must never be HEAD-checked.
const PLACEHOLDER_RE =
  /(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|\.local|\.example\.(com|net|org)|example\.com|\.internal|\.lan$|ngrok\.io|\.invalid)/i;

const fixtureMap = new Map();
if (FIXTURE_MAP_PATH) {
  const fixtureData = JSON.parse(readFileSync(resolve(FIXTURE_MAP_PATH), 'utf8'));
  for (const [url, value] of Object.entries(fixtureData)) {
    // Accept either a bare status number or { status, location } so fixtures
    // can model redirects through the same traversal the network path uses.
    fixtureMap.set(url, typeof value === 'object' && value !== null ? value : { status: Number(value) });
  }
}

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

function normalizeHostname(hostname) {
  return hostname.replace(/\.$/, '').toLowerCase();
}

function isNonPublicIp(address) {
  const family = isIP(address);
  if (family === 4) {
    const parts = address.split('.').map(Number);
    const [a, b] = parts;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && (b === 0 || b === 168)) return true;
    if (a === 198 && (b === 18 || b === 19)) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true;
    return false;
  }
  if (family === 6) {
    const lower = address.toLowerCase();
    if (lower === '::' || lower === '::1') return true;
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
    if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return true;
    if (lower.startsWith('::ffff:')) {
      return isNonPublicIp(lower.slice('::ffff:'.length));
    }
    return false;
  }
  return false;
}

async function assertPublicHostname(hostname) {
  const normalized = normalizeHostname(hostname);
  if (PLACEHOLDER_RE.test(normalized)) {
    throw new Error(`non-public hostname: ${normalized}`);
  }
  if (isIP(normalized)) {
    if (isNonPublicIp(normalized)) throw new Error(`non-public IP: ${normalized}`);
    return;
  }
  const resolved = await lookup(normalized, { all: true, verbatim: true });
  if (resolved.length === 0) throw new Error(`unresolved hostname: ${normalized}`);
  for (const { address } of resolved) {
    if (isNonPublicIp(address)) throw new Error(`hostname resolves to non-public IP: ${normalized} -> ${address}`);
  }
}

async function assertPublicUrl(url) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`unsupported protocol: ${parsed.protocol}`);
  }
  await assertPublicHostname(parsed.hostname);
}

async function fetchValidated(url, method, signal, redirectDepth = 0) {
  const fixture = fixtureMap.get(url);
  if (fixture !== undefined) {
    // Fixture responses model the network path: redirects traverse through
    // the same bounded recursion, and every hop is still subject to the
    // public-host policy. Fixture hosts live on the reserved .test TLD and
    // are not DNS-resolvable, so the non-DNS checks (placeholder + private-IP)
    // apply here.
    const host = normalizeHostname(new URL(url).hostname);
    if (PLACEHOLDER_RE.test(host) || (isIP(host) && isNonPublicIp(host))) {
      throw new Error(`non-public fixture host: ${host}`);
    }
    const status = typeof fixture === 'object' ? fixture.status : fixture;
    const location = typeof fixture === 'object' ? fixture.location : undefined;
    if (status >= 300 && status < 400 && location) {
      if (redirectDepth >= 5) return 0;
      return fetchValidated(new URL(location, url).toString(), method, signal, redirectDepth + 1);
    }
    return status;
  }
  await assertPublicUrl(url);
  const res = await fetch(url, { method, redirect: 'manual', signal });
  if (res.status >= 300 && res.status < 400) {
    if (redirectDepth >= 5) return 0;
    const location = res.headers.get('location');
    if (!location) return res.status;
    const nextUrl = new URL(location, url).toString();
    return fetchValidated(nextUrl, method, signal, redirectDepth + 1);
  }
  return res.status;
}

async function check(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let status = await fetchValidated(url, 'HEAD', controller.signal);
    if (status >= 400) {
      // Some servers reject HEAD; fall back to GET.
      status = await fetchValidated(url, 'GET', controller.signal);
    }
    return status;
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
