#!/usr/bin/env node
/**
 * detail-a11y.mjs — full axe violation dump for P3 remediation.
 * Usage: node scripts/detail-a11y.mjs <baseUrl> <outDir>
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const [baseUrl, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

let axeSource = null;
try {
  axeSource = readFileSync(join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
} catch {
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

const browser = await chromium.launch();
const out = {};
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
  out[route.name] = axe.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      html: n.html.slice(0, 300),
      failureSummary: (n.failureSummary || '').slice(0, 500),
      // color-contrast data
      data: n.any && n.any[0] && n.any[0].data ? n.any[0].data : null,
    })),
  }));
  await page.close();
}
await browser.close();
writeFileSync(join(outDir, 'axe-detail.json'), JSON.stringify(out, null, 2));
console.log('wrote', join(outDir, 'axe-detail.json'));
