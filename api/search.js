const { readdirSync, readFileSync, statSync } = require('fs');
const { join, extname } = require('path');

class LanOnasisDocsSearch {
  constructor() {
    this.docsPath = join(process.cwd(), 'docs');
    this.baseUrl = 'https://docs.lanonasis.com';
  }

  async searchDocumentation(query, section = 'all', limit = 10) {
    const results = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

    try {
      // Search through markdown files in the docs directory
      const files = this.getMarkdownFiles(this.docsPath);

      for (const file of files) {
        try {
          const content = readFileSync(file.path, 'utf-8');
          const relevance = this.calculateRelevance(queryLower, queryWords, content.toLowerCase());

          if (relevance > 0) {
            const docSection = this.getDocSection(file.relativePath);

            // Filter by section if specified
            if (section && section !== 'all' && docSection !== section) {
              continue;
            }

            const title = this.extractTitle(content) || file.name;
            const excerpt = this.extractExcerpt(content, queryLower);
            const url = this.getDocUrl(file.relativePath);

            results.push({
              title,
              content: excerpt,
              url,
              relevance_score: relevance,
              section: docSection,
              type: this.getDocType(file.relativePath)
            });
          }
        } catch (error) {
          console.warn(`Error processing file ${file.path}:`, error);
        }
      }

      // Sort by relevance and limit results
      results.sort((a, b) => b.relevance_score - a.relevance_score);
      return results.slice(0, limit);

    } catch (error) {
      console.error('Error searching documentation:', error);
      return [];
    }
  }

  getMarkdownFiles(dir, baseDir = dir) {
    const files = [];

    try {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...this.getMarkdownFiles(fullPath, baseDir));
        } else if (extname(item) === '.md' || extname(item) === '.mdx') {
          const relativePath = fullPath.replace(baseDir, '').replace(/^\//, '');
          files.push({
            path: fullPath,
            name: item,
            relativePath
          });
        }
      }
    } catch (error) {
      console.warn(`Error reading directory ${dir}:`, error);
    }

    return files;
  }

  calculateRelevance(query, queryWords, text) {
    let score = 0;

    // Exact phrase match (highest score)
    if (text.includes(query)) {
      score += 10;
    }

    // Individual word matches
    queryWords.forEach(word => {
      if (text.includes(word)) {
        score += 2;
      }
    });

    // Position-based scoring (earlier in text = higher score)
    const firstMatch = text.indexOf(query);
    if (firstMatch !== -1) {
      score += Math.max(0, 5 - Math.floor(firstMatch / 100));
    }

    return score;
  }

  extractTitle(content) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  extractExcerpt(content, query) {
    const sentences = content.split(/[.!?]+/);
    const queryIndex = content.toLowerCase().indexOf(query);

    if (queryIndex !== -1) {
      // Find the sentence containing the query
      let charCount = 0;
      for (const sentence of sentences) {
        if (charCount <= queryIndex && charCount + sentence.length >= queryIndex) {
          return sentence.trim().substring(0, 200) + (sentence.length > 200 ? '...' : '');
        }
        charCount += sentence.length + 1;
      }
    }

    // Fallback to first non-empty sentence
    const firstSentence = sentences.find(s => s.trim().length > 20);
    return firstSentence ? firstSentence.trim().substring(0, 200) + '...' : '';
  }

  getDocSection(relativePath) {
    const pathParts = relativePath.split('/');
    if (pathParts.length > 1) {
      return pathParts[0];
    }
    return 'general';
  }

  getDocType(relativePath) {
    if (relativePath.includes('api/')) return 'api';
    if (relativePath.includes('sdk/')) return 'sdk';
    if (relativePath.includes('guide/')) return 'guide';
    return 'doc';
  }

  getDocUrl(relativePath) {
    const urlPath = relativePath.replace(/\.mdx?$/, '').replace(/\/index$/, '');
    return `${this.baseUrl}/${urlPath}`;
  }
}

const docsSearch = new LanOnasisDocsSearch();

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
        message: 'Only GET and POST methods are supported'
      }
    });
  }

  // Validate query parameter
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query parameter is required and must be a non-empty string'
      }
    });
  }

  // Validate section
  const validSections = ['all', 'api', 'guides', 'sdks'];
  if (!validSections.includes(section)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: `Section must be one of: ${validSections.join(', ')}`
      }
    });
  }

  // Validate limit
  if (isNaN(limit) || limit < 1 || limit > 50) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Limit must be a number between 1 and 50'
      }
    });
  }

  try {
    const results = await docsSearch.searchDocumentation(query, section, limit);

    return res.status(200).json({
      success: true,
      data: {
        query,
        results,
        total: results.length,
        metadata: {
          section_filter: section,
          limit,
          search_timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while searching documentation'
      }
    });
  }
};

