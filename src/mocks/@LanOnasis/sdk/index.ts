// Mock implementation of @lanonasis/sdk for documentation build
// This allows the documentation to build without the actual SDK being available

// Type definitions for mock implementation
export interface Memory {
  id: string;
  [key: string]: any;
}

export interface SearchQuery {
  query: string;
  [key: string]: any;
}

export interface SearchResult {
  results?: Memory[];
  matches?: any[];
  query: string;
}

export interface RerankRequest {
  query: string;
  documents: Array<{ id: string; text: string }>;
  topK?: number;
  results?: Memory[];
  [key: string]: any;
}

export type RerankResult = Memory[];

export interface MemoryClientConfig {
  [key: string]: any;
}

export interface MemoryClient {
  createMemory(data: Memory): Promise<Memory>;
  searchMemories(query: string): Promise<SearchResult>;
  updateMemory(id: string, data: Partial<Memory>): Promise<Memory>;
  deleteMemory(id: string): Promise<{ id: string; deleted: boolean }>;
  upsert(data: Memory): Promise<Memory>;
  search(query: SearchQuery): Promise<SearchResult>;
  rerank(data: RerankRequest): Promise<RerankResult>;
}

export class MemoryClient {
  constructor(config: MemoryClientConfig) {
    // Mock constructor
  }

  async createMemory(data: Memory): Promise<Memory> {
    return { id: 'mock-id', ...data };
  }

  async searchMemories(query: string): Promise<SearchResult> {
    return { results: [], query };
  }

  async updateMemory(id: string, data: Partial<Memory>): Promise<Memory> {
    return { id, ...data };
  }

  async deleteMemory(id: string): Promise<{ id: string; deleted: boolean }> {
    return { id, deleted: true };
  }

  async upsert(data: Memory): Promise<Memory> {
    return { id: 'mock-upsert-id', ...data };
  }

  async search(query: SearchQuery): Promise<SearchResult> {
    return { results: [], query: query.query };
  }

  async rerank(data: RerankRequest): Promise<RerankResult> {
    // Mock rerank - just return documents as Memory objects
    if (data.documents) {
      return data.documents.map(doc => ({ id: doc.id, text: doc.text }));
    }
    return data.results || [];
  }
}

export class LanonasisClient extends MemoryClient {
  // Alias for backward compatibility
}