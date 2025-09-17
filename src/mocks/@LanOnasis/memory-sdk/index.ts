// Mock implementation of @LanOnasis/memory-sdk for documentation build
// This allows the documentation to build without the actual SDK being available

export interface MemoryClient {
  createMemory(data: any): Promise<any>;
  searchMemories(query: string): Promise<any>;
  updateMemory(id: string, data: any): Promise<any>;
  deleteMemory(id: string): Promise<any>;
  upsert(data: any): Promise<any>;
  search(query: any): Promise<any>;
  rerank?(data: any): Promise<any>;
}

export class MemoryClient {
  constructor(config: any) {
    // Mock constructor
  }

  async createMemory(data: any): Promise<any> {
    return { id: 'mock-id', ...data };
  }

  async searchMemories(query: string): Promise<any> {
    return { results: [], query };
  }

  async updateMemory(id: string, data: any): Promise<any> {
    return { id, ...data };
  }

  async deleteMemory(id: string): Promise<any> {
    return { id, deleted: true };
  }

  async upsert(data: any): Promise<any> {
    return { id: 'mock-upsert-id', ...data };
  }

  async search(query: any): Promise<any> {
    return { results: [], query };
  }

  rerank?: (data: any) => Promise<any> = async (data: any) => {
    return data.results || [];
  }
}

export class LanOnasisClient extends MemoryClient {
  // Alias for backward compatibility
}