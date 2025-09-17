import React, { useState, useEffect, useCallback } from 'react';
import { useSearch } from './MaaSSearchProvider';
import { useHybridSearch } from './HybridSearch';

export function MaaSSearchUI() {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'semantic' | 'hybrid'>('hybrid');
  const [isOpen, setIsOpen] = useState(false);
  const { searchResults, performSemanticSearch, clearResults } = useSearch();
  const { searchDocumentation, isSearching } = useHybridSearch();
  const [results, setResults] = useState<any[]>([]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        clearResults();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearResults]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    if (searchMode === 'semantic') {
      const semanticResults = await performSemanticSearch(searchQuery);
      setResults(semanticResults);
    } else {
      const hybridResults = await searchDocumentation(searchQuery, {
        semanticWeight: 0.7,
        keywordWeight: 0.3,
        topK: 10
      });
      setResults(hybridResults);
    }
  }, [searchMode, performSemanticSearch, searchDocumentation]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="search-trigger"
        aria-label="Search documentation"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="maas-search-overlay" onClick={() => setIsOpen(false)}>
      <div className="maas-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="search-input"
            autoFocus
          />
          <div className="search-mode-toggle">
            <button
              className={searchMode === 'semantic' ? 'active' : ''}
              onClick={() => setSearchMode('semantic')}
            >
              Semantic
            </button>
            <button
              className={searchMode === 'hybrid' ? 'active' : ''}
              onClick={() => setSearchMode('hybrid')}
            >
              Hybrid
            </button>
          </div>
        </div>

        <div className="search-results">
          {isSearching && (
            <div className="search-loading">
              <div className="spinner"></div>
              <span>Searching with MaaS...</span>
            </div>
          )}

          {!isSearching && results.length === 0 && query && (
            <div className="no-results">
              <p>No results found for "{query}"</p>
              <p className="hint">Try different keywords or use semantic search</p>
            </div>
          )}

          {!isSearching && results.map((result, index) => (
            <a
              key={result.id || index}
              href={result.url}
              className="search-result"
              onClick={() => {
                setIsOpen(false);
                clearResults();
              }}
            >
              <div className="result-title">
                {result.title}
                <span className="result-score">{(result.score * 100).toFixed(0)}%</span>
              </div>
              <div className="result-section">{result.section}</div>
              <div className="result-content">{result.content.substring(0, 150)}...</div>
              {result.source && (
                <span className={`result-source ${result.source}`}>
                  {result.source}
                </span>
              )}
            </a>
          ))}
        </div>

        <div className="search-footer">
          <div className="search-powered-by">
            <span>🧠 Powered by LanOnasis MaaS</span>
            <span className="demo-badge">Live Demo</span>
          </div>
          <div className="search-tips">
            <span><kbd>↑↓</kbd> Navigate</span>
            <span><kbd>Enter</kbd> Select</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add to custom.css for styling
const searchStyles = `
.search-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-toc-border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.search-trigger:hover {
  background: var(--ifm-color-emphasis-100);
}

.search-trigger kbd {
  padding: 0.125rem 0.375rem;
  background: var(--ifm-background-color);
  border: 1px solid var(--ifm-toc-border-color);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.maas-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}

.maas-search-modal {
  width: 90%;
  max-width: 600px;
  background: var(--ifm-background-color);
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-header {
  padding: 1rem;
  border-bottom: 1px solid var(--ifm-toc-border-color);
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.125rem;
  background: transparent;
  border: none;
  outline: none;
}

.search-mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.search-mode-toggle button {
  padding: 0.25rem 0.75rem;
  background: transparent;
  border: 1px solid var(--ifm-toc-border-color);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.search-mode-toggle button.active {
  background: var(--ifm-color-primary);
  color: white;
  border-color: var(--ifm-color-primary);
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

.search-result {
  display: block;
  padding: 0.75rem;
  margin-bottom: 0.25rem;
  background: var(--ifm-background-surface-color);
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.search-result:hover {
  background: var(--ifm-color-emphasis-100);
  transform: translateX(4px);
}

.result-title {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.result-score {
  font-size: 0.75rem;
  color: var(--ifm-color-primary);
}

.result-section {
  font-size: 0.875rem;
  color: var(--ifm-color-emphasis-600);
  margin-bottom: 0.25rem;
}

.result-content {
  font-size: 0.875rem;
  color: var(--ifm-color-emphasis-700);
}

.result-source {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  background: var(--ifm-background-color);
  border: 1px solid var(--ifm-toc-border-color);
}

.result-source.semantic {
  border-color: var(--ifm-color-primary);
  color: var(--ifm-color-primary);
}

.result-source.hybrid {
  border-color: var(--ifm-color-success);
  color: var(--ifm-color-success);
}

.search-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--ifm-toc-border-color);
  font-size: 0.75rem;
}

.search-powered-by {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-badge {
  padding: 0.125rem 0.375rem;
  background: var(--ifm-color-primary);
  color: white;
  border-radius: 0.25rem;
  font-weight: 600;
}

.search-tips {
  display: flex;
  gap: 1rem;
  color: var(--ifm-color-emphasis-600);
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--ifm-color-emphasis-300);
  border-top-color: var(--ifm-color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: var(--ifm-color-emphasis-600);
}

.no-results .hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
`;
