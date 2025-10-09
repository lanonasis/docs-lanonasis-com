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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.'
      },
      id: null
    });
  }

  // Check Accept header
  const acceptHeader = req.headers.accept || '';
  if (!acceptHeader.includes('application/json') || !acceptHeader.includes('text/event-stream')) {
    return res.status(406).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Not Acceptable: Client must accept both application/json and text/event-stream'
      },
      id: null
    });
  }

  try {
    const request = req.body;

    // Handle initialize request
    if (request.method === 'initialize') {
      const initRequest = request;

      const response = {
        jsonrpc: '2.0',
        id: initRequest.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {
              listChanged: true
            }
          },
          serverInfo: {
            name: 'LanOnasis Documentation MCP Server',
            version: '1.0.0'
          }
        }
      };

      // Return as Server-Sent Events format for MCP
      res.setHeader('Content-Type', 'text/event-stream');
      res.write('event: message\n');
      res.write(`data: ${JSON.stringify(response)}\n\n`);
      return res.end();
    }

    // Handle tools/list request
    if (request.method === 'tools/list') {
      const listRequest = request;

      const response = {
        jsonrpc: '2.0',
        id: listRequest.id,
        result: {
          tools: [
            {
              name: 'search_lanonasis_docs',
              description: 'Search LanOnasis documentation for Memory as a Service (MaaS) platform',
              inputSchema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Search query for documentation'
                  },
                  section: {
                    type: 'string',
                    description: 'Filter by section: api, guides, sdks, or all',
                    enum: ['all', 'api', 'guides', 'sdks'],
                    default: 'all'
                  },
                  limit: {
                    type: 'number',
                    description: 'Maximum number of results to return',
                    default: 10
                  }
                },
                required: ['query']
              }
            }
          ]
        }
      };

      res.setHeader('Content-Type', 'text/event-stream');
      res.write('event: message\n');
      res.write(`data: ${JSON.stringify(response)}\n\n`);
      return res.end();
    }

    // Handle tools/call request
    if (request.method === 'tools/call') {
      const callRequest = request;

      if (callRequest.params.name === 'search_lanonasis_docs') {
        const { query, section = 'all', limit = 10 } = callRequest.params.arguments;

        if (!query || typeof query !== 'string') {
          const errorResponse = {
            jsonrpc: '2.0',
            id: callRequest.id,
            error: {
              code: -32602,
              message: 'Invalid params: query is required and must be a string'
            }
          };

          res.setHeader('Content-Type', 'text/event-stream');
          res.write('event: message\n');
          res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);
          return res.end();
        }

        const results = await docsSearch.searchDocumentation(query, section, limit);

        const response = {
          jsonrpc: '2.0',
          id: callRequest.id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  query,
                  total_found: results.length,
                  results,
                  search_metadata: {
                    section_filter: section,
                    limit,
                    search_timestamp: new Date().toISOString()
                  }
                }, null, 2)
              }
            ]
          }
        };

        res.setHeader('Content-Type', 'text/event-stream');
        res.write('event: message\n');
        res.write(`data: ${JSON.stringify(response)}\n\n`);
        return res.end();
      }
    }

    // Unknown method
    const errorResponse = {
      jsonrpc: '2.0',
      id: request.id || null,
      error: {
        code: -32601,
        message: `Method not found: ${request.method}`
      }
    };

    res.setHeader('Content-Type', 'text/event-stream');
    res.write('event: message\n');
    res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);
    return res.end();

  } catch (error) {
    console.error('MCP Handler Error:', error);

    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: 'Internal error'
      }
    };

    res.setHeader('Content-Type', 'text/event-stream');
    res.write('event: message\n');
    res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);
    return res.end();
  }
}