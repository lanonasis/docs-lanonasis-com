#!/usr/bin/env node

import { MemoryClient } from '@lanonasis/memory-client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { glob } from 'glob';

const DOCS_DIR = './docs';
const CHUNK_SIZE = 500; // Optimal chunk size for semantic search

const memoryClientConfig = {
  apiUrl: process.env.MAAS_ENDPOINT || 'http://api.lanonasis.local',
  endpoint: process.env.MAAS_ENDPOINT || 'http://api.lanonasis.local',
  apiKey: process.env.MAAS_ADMIN_KEY || ''
};
const memoryClient: MemoryClient = new MemoryClient(memoryClientConfig);
type UpsertableMemoryClient = MemoryClient & {
  upsert?: (payload: {
    id: string;
    text: string;
    metadata: Record<string, unknown>;
  }) => Promise<unknown>;
};
const upsertableMemoryClient = memoryClient as UpsertableMemoryClient;

interface DocumentChunk {
  id: string;
  text: string;
  metadata: {
    title: string;
    section: string;
    url: string;
    filePath: string;
    chunkIndex: number;
    totalChunks: number;
    type: string;
    lastModified: string;
    tags?: string[];
    [key: string]: unknown;
  };
}

async function storeDocumentChunk(document: DocumentChunk) {
  if (typeof upsertableMemoryClient.upsert === 'function') {
    await upsertableMemoryClient.upsert({
      id: document.id,
      text: document.text,
      metadata: document.metadata
    });
    return;
  }

  const result = await memoryClient.createMemory({
    title: document.metadata.title,
    content: document.text,
    memory_type: 'reference',
    tags: document.metadata.tags,
    metadata: {
      ...document.metadata,
      doc_chunk_id: document.id
    }
  });

  if (result.error) {
    throw new Error(
      typeof result.error === 'string' ? result.error : JSON.stringify(result.error)
    );
  }
}

async function indexDocumentation() {
  console.log('🚀 Starting documentation indexing to MaaS...\n');

  try {
    // Find all markdown files
    const files = await glob(`${DOCS_DIR}/**/*.md`);
    console.log(`📂 Found ${files.length} documentation files\n`);

    let totalChunks = 0;
    let successCount = 0;

    for (const file of files) {
      console.log(`📄 Processing: ${file}`);

      const content = fs.readFileSync(file, 'utf-8');
      const { data: frontmatter, content: markdownContent } = matter(content);

      // Convert markdown to plain text for embedding
      const plainText = await markdownToPlainText(markdownContent);

      // Generate chunks for better search results
      const chunks = chunkContent(plainText, CHUNK_SIZE);

      // Determine section from file path
      const section = extractSection(file);

      for (let i = 0; i < chunks.length; i++) {
        const chunkId = `${file.replace(/[\/\\]/g, '-')}-chunk-${i}`;

        const document: DocumentChunk = {
          id: chunkId,
          text: chunks[i],
          metadata: {
            title: frontmatter.title || path.basename(file, '.md'),
            section: frontmatter.sidebar_label || section,
            url: fileToUrl(file),
            filePath: file,
            chunkIndex: i,
            totalChunks: chunks.length,
            type: 'docs',
            lastModified: new Date().toISOString(),
            tags: frontmatter.tags || extractTags(file)
          }
        };

        try {
          await storeDocumentChunk(document);
          successCount++;
        } catch (error) {
          console.error(`   ❌ Failed to index chunk ${i}: ${error.message}`);
        }
      }

      totalChunks += chunks.length;
      console.log(`   ✅ Indexed ${chunks.length} chunks\n`);
    }

    console.log('📊 Indexing Summary:');
    console.log(`   Total files: ${files.length}`);
    console.log(`   Total chunks: ${totalChunks}`);
    console.log(`   Successfully indexed: ${successCount}`);
    console.log(`   Failed: ${totalChunks - successCount}`);

    // Create search index metadata
    await createSearchMetadata(files.length, totalChunks);

    console.log('\n✅ Documentation indexing complete!');
  } catch (error) {
    console.error('❌ Indexing failed:', error);
    process.exit(1);
  }
}

async function markdownToPlainText(markdown: string): Promise<string> {
  const result = await remark()
    .use(strip)
    .process(markdown);

  return result.toString();
}

function chunkContent(text: string, maxChunkSize: number): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const sentenceWithPeriod = sentence.trim() + '.';

    if ((currentChunk + ' ' + sentenceWithPeriod).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentenceWithPeriod;
    } else {
      currentChunk = currentChunk ? `${currentChunk} ${sentenceWithPeriod}` : sentenceWithPeriod;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  // If no chunks were created, just return the original text as a single chunk
  if (chunks.length === 0 && text.trim()) {
    chunks.push(text.trim());
  }

  return chunks;
}

function fileToUrl(filePath: string): string {
  // Convert file path to documentation URL
  const relativePath = filePath.replace(/^\.\/docs\//, '').replace(/\.md$/, '');

  // Handle special cases
  if (relativePath === 'intro') return '/';
  if (relativePath === 'index') return '/';

  return `/${relativePath}`;
}

function extractSection(filePath: string): string {
  const parts = filePath.split(path.sep);

  // Map directory structure to sections
  if (parts.includes('api')) return 'API Reference';
  if (parts.includes('sdks')) return 'SDKs';
  if (parts.includes('getting-started')) return 'Getting Started';
  if (parts.includes('guides')) return 'Guides';
  if (parts.includes('use-cases')) return 'Use Cases';
  if (parts.includes('troubleshooting')) return 'Troubleshooting';

  return 'Documentation';
}

function extractTags(filePath: string): string[] {
  const tags: string[] = [];
  const parts = filePath.toLowerCase().split(path.sep);

  // Add relevant tags based on path
  if (parts.includes('api')) tags.push('api', 'reference');
  if (parts.includes('typescript')) tags.push('typescript', 'sdk', 'javascript');
  if (parts.includes('python')) tags.push('python', 'sdk');
  if (parts.includes('cli')) tags.push('cli', 'command-line');
  if (parts.includes('guides')) tags.push('guide', 'tutorial');

  return tags;
}

async function createSearchMetadata(fileCount: number, chunkCount: number) {
  // Store metadata about the indexed documentation
  await storeDocumentChunk({
    id: 'search-metadata',
    text: 'Documentation search index metadata',
    metadata: {
      title: 'Documentation Search Metadata',
      section: 'System',
      url: '/api/playground',
      filePath: 'system/search-metadata',
      chunkIndex: 0,
      totalChunks: 1,
      type: 'system',
      lastModified: new Date().toISOString(),
      tags: ['system', 'docs-index'],
      totalFiles: fileCount,
      totalChunksIndexed: chunkCount,
      version: '1.0.0',
      chunkSize: CHUNK_SIZE
    }
  });
}

// Support for incremental indexing
async function indexSingleFile(filePath: string) {
  console.log(`📄 Indexing single file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: markdownContent } = matter(content);

  const plainText = await markdownToPlainText(markdownContent);
  const chunks = chunkContent(plainText, CHUNK_SIZE);
  const section = extractSection(filePath);

  let successCount = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunkId = `${filePath.replace(/[\/\\]/g, '-')}-chunk-${i}`;

    try {
      await storeDocumentChunk({
        id: chunkId,
        text: chunks[i],
        metadata: {
          title: frontmatter.title || path.basename(filePath, '.md'),
          section: frontmatter.sidebar_label || section,
          url: fileToUrl(filePath),
          filePath,
          chunkIndex: i,
          totalChunks: chunks.length,
          type: 'docs',
          lastModified: new Date().toISOString(),
          tags: frontmatter.tags || extractTags(filePath)
        }
      });
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to index chunk ${i}: ${error.message}`);
    }
  }

  console.log(`✅ Indexed ${successCount}/${chunks.length} chunks`);
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Full indexing
    indexDocumentation().catch(console.error);
  } else if (args[0] === '--file' && args[1]) {
    // Single file indexing
    indexSingleFile(args[1]).catch(console.error);
  } else {
    console.log('Usage:');
    console.log('  npm run index:maas           # Index all documentation');
    console.log('  npm run index:maas -- --file path/to/file.md  # Index single file');
  }
}

export { indexDocumentation, indexSingleFile };
