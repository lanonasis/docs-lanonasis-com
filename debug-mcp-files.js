#!/usr/bin/env node

const { readdirSync, readFileSync, statSync } = require('fs');
const { join, extname } = require('path');

class DebugDocsSearch {
  constructor() {
    this.docsPath = join(process.cwd(), 'docs');
    console.log('📁 Docs path:', this.docsPath);
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
            relativePath,
            size: stat.size,
            modified: stat.mtime
          });
        }
      }
    } catch (error) {
      console.warn(`❌ Error reading directory ${dir}:`, error);
    }

    return files;
  }

  debugFileDiscovery() {
    console.log('🔍 Starting file discovery...\n');

    const files = this.getMarkdownFiles(this.docsPath);

    console.log(`📊 Found ${files.length} markdown files:\n`);

    // Group by section
    const sections = {};
    files.forEach(file => {
      const section = this.getDocSection(file.relativePath);
      if (!sections[section]) sections[section] = [];
      sections[section].push(file);
    });

    // Display by section
    Object.keys(sections).sort().forEach(section => {
      console.log(`📂 Section: ${section} (${sections[section].length} files)`);
      sections[section].forEach(file => {
        console.log(`   - ${file.relativePath} (${file.size} bytes)`);
      });
      console.log('');
    });

    return files;
  }

  getDocSection(relativePath) {
    const pathParts = relativePath.split('/');
    if (pathParts.length > 1) {
      return pathParts[0];
    }
    return 'general';
  }

  async testSearchFunctionality() {
    console.log('🧪 Testing search functionality...\n');

    const testQueries = [
      'API authentication',
      'Python SDK',
      'memory management',
      'getting started'
    ];

    for (const query of testQueries) {
      console.log(`🔎 Testing query: "${query}"`);
      const results = await this.searchDocumentation(query, 'all', 3);
      console.log(`   Found ${results.length} results`);
      results.forEach((result, i) => {
        console.log(`   ${i+1}. ${result.title} (score: ${result.relevance_score})`);
        console.log(`      Section: ${result.section}, Type: ${result.type}`);
        console.log(`      URL: ${result.url}`);
      });
      console.log('');
    }
  }

  async searchDocumentation(query, section = 'all', limit = 10) {
    const results = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

    try {
      const files = this.getMarkdownFiles(this.docsPath);

      for (const file of files) {
        try {
          const content = readFileSync(file.path, 'utf-8');
          const relevance = this.calculateRelevance(queryLower, queryWords, content.toLowerCase());

          if (relevance > 0) {
            const docSection = this.getDocSection(file.relativePath);

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
              type: this.getDocType(file.relativePath),
              file_path: file.relativePath,
              file_size: file.size
            });
          }
        } catch (error) {
          console.warn(`❌ Error processing file ${file.path}:`, error);
        }
      }

      results.sort((a, b) => b.relevance_score - a.relevance_score);
      return results.slice(0, limit);

    } catch (error) {
      console.error('❌ Error searching documentation:', error);
      return [];
    }
  }

  calculateRelevance(query, queryWords, text) {
    let score = 0;

    if (text.includes(query)) {
      score += 10;
    }

    queryWords.forEach(word => {
      if (text.includes(word)) {
        score += 2;
      }
    });

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
      let charCount = 0;
      for (const sentence of sentences) {
        if (charCount <= queryIndex && charCount + sentence.length >= queryIndex) {
          return sentence.trim().substring(0, 200) + (sentence.length > 200 ? '...' : '');
        }
        charCount += sentence.length + 1;
      }
    }

    const firstSentence = sentences.find(s => s.trim().length > 20);
    return firstSentence ? firstSentence.trim().substring(0, 200) + '...' : '';
  }

  getDocType(relativePath) {
    if (relativePath.includes('api/')) return 'api';
    if (relativePath.includes('sdk/')) return 'sdk';
    if (relativePath.includes('guide/')) return 'guide';
    return 'doc';
  }

  getDocUrl(relativePath) {
    const urlPath = relativePath.replace(/\.mdx?$/, '').replace(/\/index$/, '');
    return `https://docs.lanonasis.com/${urlPath}`;
  }
}

// Run debug
async function main() {
  const debug = new DebugDocsSearch();

  console.log('🚀 LanOnasis MCP Docs Debug Tool\n');
  console.log('=====================================\n');

  const files = debug.debugFileDiscovery();
  await debug.testSearchFunctionality();

  console.log('📋 Summary:');
  console.log(`   Total files discovered: ${files.length}`);
  console.log(`   Total file size: ${files.reduce((sum, f) => sum + f.size, 0)} bytes`);
  console.log(`   Docs path: ${debug.docsPath}`);
  console.log('\n✅ Debug complete!');
}

main().catch(console.error);