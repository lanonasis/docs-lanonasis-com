/* eslint-disable no-console */
/**
 * docs-a11y-audit.mjs
 *
 * Runs axe-core WCAG 2.1 AA scans + viewport screenshots + search smoke test
 * against a locally-served production build.
 *
 * Usage:
 *   node scripts/audit-a11y.mjs <baseUrl> <outDir>
 *   node scripts/audit-a11y.mjs http://localhost:4321 /tmp/docs-a11y
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const [baseUrl, outDir] = process.argv.slice(2);
if (!baseUrl || !outDir) {
  console.error('usage: node scripts/audit-a11y.mjs <baseUrl> <outDir>');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

// axe-core from node_modules if present, else fetch from CDN is avoided:
// we use the local copy shipped by @axe-core/playwright if available.
let axeSource = null;
try {
  axeSource = readFileSync(
    join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'),
    'utf8',
  );
} catch {
  // Fall back to the CDN-hosted axe bundle (requires network at audit time).
  axeSource = null;
}
if (!axeSource) {
  console.warn('axe-core not found locally; downloading from CDN…');
  const res = await fetch('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js');
  axeSource = await res.text();
}

const routes = [
  { name: 'home', path: '/' },
  { name: 'quick-start', path: '/getting-started/quick-start' },
  { name: 'api-overview', path: '/api/overview' },
  { name: 'cli-reference', path: '/cli/reference' },
  { name: 'mcp-tools', path: '/mcp/tools' },
];

const viewports = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1920', width: 1920, height: 1080 },
];

const browser = await chromium.launch();
const results = [];
const violationsByRoute = {};

for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(baseUrl + route.path, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axeSource });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    });
    return r;
  });
  violationsByRoute[route.name] = axe.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.length,
    targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
  }));
  results.push({
    route: route.name,
    path: route.path,
    violations: axe.violations.length,
    serious: axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').length,
  });
  console.log(`${route.name}: ${axe.violations.length} violations (${results.at(-1).serious} serious/critical)`);

  // Screenshots at all four widths.
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(250);
    const file = join(outDir, `${route.name}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    // Overflow check at this width.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    console.log(`  ${vp.name}px screenshot -> ${file}${overflow ? ' [OVERFLOW]' : ''}`);
  }
  await page.close();
}

// Search smoke test: open the navbar search, type a query, verify results.
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
const searchButton = page.locator('.search-nav-trigger');
console.log('search trigger visible:', await searchButton.isVisible());
await searchButton.click();
await page.fill('.search-modal-input', 'memory');
await page.waitForTimeout(600);
const resultCount = await page.locator('.search-modal-results li').count();
console.log('search results for "memory":', resultCount);
await page.screenshot({ path: join(outDir, 'search-modal.png') });
await page.keyboard.press('Escape');
await page.close();

await browser.close();

writeFileSync(join(outDir, 'axe-report.json'), JSON.stringify(violationsByRoute, null, 2));
console.log('\nSummary:', JSON.stringify(results, null, 2));
console.log('axe report ->', join(outDir, 'axe-report.json'));
