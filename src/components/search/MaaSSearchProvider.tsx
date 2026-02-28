import React, { useState, useCallback, createContext, useContext } from "react";
import { MemoryClient } from "@lanonasis/memory-client";

interface SearchResult {
  title: string;
  section: string;
  content: string;
  score: number;
  url: string;
  highlights?: string[];
}

interface SearchContextType {
  searchResults: SearchResult[];
  isSearching: boolean;
  performSemanticSearch: (query: string) => Promise<SearchResult[]>;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);
type SearchCapableMemoryClient = MemoryClient & {
  search?: (
    query: string,
    options?: { namespace?: string; topK?: number; includeMetadata?: boolean },
  ) => Promise<{
    matches?: Array<{
      text?: string;
      score?: number;
      highlights?: string[];
      metadata?: {
        title?: string;
        section?: string;
        url?: string;
      };
    }>;
  }>;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within MaaSSearchProvider");
  }
  return context;
};

export function MaaSSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const memoryClientConfig = {
    apiUrl:
      process.env.NEXT_PUBLIC_MAAS_ENDPOINT || "http://api.lanonasis.local",
    endpoint:
      process.env.NEXT_PUBLIC_MAAS_ENDPOINT || "http://api.lanonasis.local",
    apiKey: process.env.NEXT_PUBLIC_MAAS_DOCS_KEY || "",
  };
  const memoryClient: MemoryClient = new MemoryClient(memoryClientConfig);
  const searchCapableMemoryClient = memoryClient as SearchCapableMemoryClient;

  const performSemanticSearch = useCallback(
    async (query: string): Promise<SearchResult[]> => {
      if (!query.trim()) {
        setSearchResults([]);
        return [];
      }

      setIsSearching(true);

      try {
        const results =
          typeof searchCapableMemoryClient.search === "function"
            ? await searchCapableMemoryClient.search(query, {
                namespace: "documentation",
                topK: 10,
                includeMetadata: true,
              })
            : {
                matches:
                  (
                    await memoryClient.searchMemories({
                      query,
                      limit: 10,
                      status: "active",
                      threshold: 0.55,
                    })
                  ).data?.results?.map((item) => ({
                    text: item.content,
                    score: item.similarity_score,
                    metadata: {
                      title: item.title,
                      section: "General",
                      url: "#",
                    },
                  })) ?? [],
              };

        // Transform results for documentation display
        const docResults = (results.matches ?? []).map((match) => ({
          title: match.metadata?.title || "Untitled",
          section: match.metadata?.section || "General",
          content: match.text || "",
          score: match.score || 0,
          url: match.metadata?.url || "#",
          highlights: match.highlights,
        }));

        setSearchResults(docResults);
        return docResults;
      } catch (error) {
        console.error("MaaS search error:", error);
        // Fallback to basic search if MaaS is unavailable
        return fallbackToLocalSearch(query);
      } finally {
        setIsSearching(false);
      }
    },
    [memoryClient],
  );

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  const fallbackToLocalSearch = async (
    query: string,
  ): Promise<SearchResult[]> => {
    // Simple fallback for when MaaS is unavailable
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
      );
      if (response.ok) {
        const data = await response.json();
        return data.results;
      }
    } catch (error) {
      console.error("Fallback search failed:", error);
    }
    return [];
  };

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        isSearching,
        performSemanticSearch,
        clearResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
