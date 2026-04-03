/* Minimal endpoint smoke tests focused on public/non-sensitive paths */
const targets = [
  { url: 'https://api.lanonasis.com/api/v1/health', allow: [200, 401, 403, 404] },
  { url: 'https://auth.lanonasis.com/health', allow: [200, 401, 403, 404] },
  { url: 'https://mcp.lanonasis.com/health', allow: [200, 401, 403, 404] },
  { url: 'https://docs.lanonasis.com', allow: [200, 301, 302, 304] },
  { url: 'https://dashboard.lanonasis.com', allow: [200, 301, 302, 304, 401, 403] },
  { url: 'https://docs.lanonasis.com/api/search?q=memory', method: 'GET', allow: [200] },
  {
    url: 'https://docs.lanonasis.com/api/mcp',
    method: 'POST',
    headers: {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'docs-smoke',
          version: '1.0.0',
        },
      },
    }),
    allow: [200],
  },
];

async function requestTarget(target) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(target.url, {
      method: target.method || 'HEAD',
      headers: target.headers,
      body: target.body,
      redirect: 'manual',
      signal: controller.signal,
    });
    return res.status;
  } catch (e) {
    if ((target.method || 'HEAD') === 'HEAD') {
      try {
        const res = await fetch(target.url, {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
        });
        return res.status;
      } catch (e2) {
        return 0;
      }
    }
    return 0;
  } finally {
    clearTimeout(timeout);
  }
}

(async () => {
  const results = [];
  for (const t of targets) {
    const status = await requestTarget(t);
    const ok = t.allow.includes(status);
    results.push({ url: t.url, method: t.method || 'HEAD', status, ok });
  }
  const failed = results.filter(r => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? 'OK ' : 'ERR'} ${r.status} ${r.method} ${r.url}`);
  }
  if (failed.length > 0) process.exit(1);
})();

