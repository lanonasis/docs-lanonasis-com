import { useCallback, useState } from 'react';
import MeiliSearch from 'meilisearch';
import { MemoryClient } from '@lanonasis/memory-client';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  url: string;
  source: 'semantic' | 'keyword' | 'hybrid';
}

const meiliClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_KEY || ''
});

const memoryClient = new MemoryClient({
  endpoint: process.env.NEXT_PUBLIC_MAAS_ENDPOINT || 'http://api.lanonasis.local',
  apiKey: process.env.NEXT_PUBLIC_MAAS_DOCS_KEY || ''
});

export function useHybridSearch() {
  const [isSearching, setIsSearching] = useState(false);
  
  const searchDocumentation = useCallback(async (
    query: string,
    options?: {
      semanticWeight?: number;
      keywordWeight?: number;
      topK?: number;
    }
  ) => {
    const semanticWeight = options?.semanticWeight ?? 0.7;
    const keywordWeight = options?.keywordWeight ?? 0.3;
    const topK = options?.topK ?? 10;
    
    setIsSearching(true);
    
    try {
      // Parallel search for best performance
      const [semanticResults, keywordResults] = await Promise.all([
        // MaaS semantic search
        memoryClient.search({
          query,
          namespace: 'documentation',
          topK: Math.ceil(topK * 1.5) // Get more candidates for merging
        }).catch(err => {
          console.error('Semantic search failed:', err);
          return { matches: [] };
        }),
        
        // MeiliSearch keyword search
        meiliClient.index('docs').search(query, {
          limit: Math.ceil(topK * 1.5),
          attributesToHighlight: ['title', 'content']
        }).catch(err => {
          console.error('Keyword search failed:', err);
          return { hits: [] };
        })
      ]);
      
      // Transform and merge results
      const mergedResults = mergeSearchResults(
        semanticResults.matches || [],
        keywordResults.hits || [],
        semanticWeight,
        keywordWeight
      );
      
      // Re-rank using MaaS if available
      if (mergedResults.length > 0 && memoryClient.rerank) {
        try {
          const rerankedResults = await memoryClient.rerank({
            query,
            documents: mergedResults.map(r => ({
              id: r.id,
              text: r.content
            })),
            topK
          });
          
          return rerankedResults.map(r => ({
            ...mergedResults.find(m => m.id === r.id),
            score: r.score
          }));
        } catch (error) {
          console.error('Reranking failed:', error);
        }
      }
      
      // Return top K results
      return mergedResults.slice(0, topK);
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  const mergeSearchResults = (
    semanticResults: any[],
    keywordResults: any[],
    semanticWeight: number,
    keywordWeight: number
  ): SearchResult[] => {
    const resultMap = new Map<string, SearchResult>();
    
    // Process semantic results
    semanticResults.forEach(result => {
      const id = result.id || result.metadata?.url || Math.random().toString();
      resultMap.set(id, {
        id,
        title: result.metadata?.title || 'Untitled',
        content: result.text || '',
        score: result.score * semanticWeight,
        url: result.metadata?.url || '#',
        source: 'semantic'
      });
    });
    
    // Process and merge keyword results
    keywordResults.forEach(result => {
      const id = result.id || result.url || Math.random().toString();
      const existing = resultMap.get(id);
      
      if (existing) {
        // Combine scores for results found by both methods
        existing.score += (result._rankingScore || 0.5) * keywordWeight;
        existing.source = 'hybrid';
      } else {
        resultMap.set(id, {
          id,
          title: result.title || 'Untitled',
          content: result.content || result._formatted?.content || '',
          score: (result._rankingScore || 0.5) * keywordWeight,
          url: result.url || '#',
          source: 'keyword'
        });
      }
    });
    
    // Sort by combined score
    return Array.from(resultMap.values())
      .sort((a, b) => b.score - a.score);
  };
  
  return { searchDocumentation, isSearching };
}
