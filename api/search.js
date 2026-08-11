/**
 * /api/search — documentation search endpoint (audit F26).
 *
 * Replaces the previous runtime filesystem walk. The index is now generated at
 * build time by scripts/build-search-index.mjs into static/search-index.json,
 * which ships as a static asset. This endpoint reads that one file (cached in
 * memory after first load) and filters it — no recursive directory traversal,
 * no dependence on runtime filesystem state.
 *
 * The response shape is unchanged so existing integrations keep working.
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

let indexCache = null;
let indexCacheError = null;

function resolveIndexPath() {
  const candidates = [
    join(__dirname, '..', 'static', 'search-index.json'),
    join(process.cwd(), 'static', 'search-index.json'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) || candidates[0];
}

function loadIndex() {
  if (indexCache) return indexCache;
  if (indexCacheError) throw indexCacheError;

  try {
    const indexPath = resolveIndexPath();
    if (!existsSync(indexPath)) {
      const err = new Error(`Search index not found at ${indexPath}. Run scripts/build-search-index.mjs before building.`);
      indexCacheError = err;
      throw err;
    }
    indexCache = JSON.parse(readFileSync(indexPath, 'utf8'));
    return indexCache;
  } catch (error) {
    indexCacheError = error;
    throw error;
  }
}

function searchIndex(query, section = 'all', limit = 10) {
  const entries = loadIndex();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2);

  const results = [];

  for (const entry of entries) {
    if (section && section !== 'all' && entry.section !== section) {
      continue;
    }

    const title = (entry.title || '').toLowerCase();
    const description = (entry.description || '').toLowerCase();
    const content = (entry.content || '').toLowerCase();

    let relevance = 0;

    if (title.includes(queryLower)) relevance += 10;
    if (description.includes(queryLower)) relevance += 6;

    for (const word of queryWords) {
      if (title.includes(word)) relevance += 3;
      else if (description.includes(word)) relevance += 2;
      else if (content.includes(word)) relevance += 1;
    }

    if (relevance > 0) {
      results.push({
        title: entry.title,
        content: entry.description || excerpt(entry.content, queryLower),
        url: entry.url,
        relevance_score: relevance,
        section: entry.section,
        type: entry.section,
      });
    }
  }

  results.sort((a, b) => b.relevance_score - a.relevance_score);
  return results.slice(0, limit);
}

function excerpt(content, query) {
  const index = content ? content.toLowerCase().indexOf(query) : -1;
  if (index !== -1) {
    const start = Math.max(0, index - 60);
    return (start > 0 ? '…' : '') + content.slice(start, start + 200) + '…';
  }
  return (content || '').slice(0, 200);
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accept both GET and POST requests
  let query, section, limit;

  if (req.method === 'GET') {
    query = req.query.q || req.query.query;
    section = req.query.section || 'all';
    limit = parseInt(req.query.limit || '10', 10);
  } else if (req.method === 'POST') {
    const body = req.body || {};
    query = body.query || body.q;
    section = body.section || 'all';
    limit = parseInt(body.limit || '10', 10);
  } else {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET and POST methods are supported',
      },
    });
  }

  // Validate query parameter
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query parameter is required and must be a non-empty string',
      },
    });
  }

  // Validate section
  const validSections = ['all', 'api', 'auth', 'cli', 'getting-started', 'guides', 'mcp', 'memory', 'platform', 'sdks', 'security', 'support', 'use-cases', 'v-secure', 'general'];
  if (!validSections.includes(section)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: `Section must be one of: ${validSections.join(', ')}`,
      },
    });
  }

  // Validate limit
  if (isNaN(limit) || limit < 1 || limit > 50) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Limit must be a number between 1 and 50',
      },
    });
  }

  try {
    const results = searchIndex(query, section, limit);

    return res.status(200).json({
      success: true,
      data: {
        query,
        results,
        total: results.length,
        metadata: {
          section_filter: section,
          limit,
          search_timestamp: new Date().toISOString(),
          index_source: 'build-time static/search-index.json',
        },
      },
    });
  } catch (error) {
    console.error('Search error:', error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while searching documentation',
      },
    });
  }
};
