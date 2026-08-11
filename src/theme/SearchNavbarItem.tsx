import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * SearchNavbarItem
 *
 * Build-time search UI for the docs site (audit F26).
 *
 * The index is generated at build time by scripts/build-search-index.mjs and
 * served as a static asset at /search-index.json. This component fetches it
 * lazily (once, on first open) and filters client-side — no runtime filesystem
 * traversal, no external search service.
 *
 * Accessibility:
 *  - trigger button has a stable accessible name
 *  - modal uses role="dialog" + aria-modal + aria-label
 *  - focus moves to the input on open and returns to the trigger on close
 *  - Escape closes; ArrowUp/ArrowDown navigate results; Enter opens the result
 *  - results are a semantic list of links with a live status region
 */

interface SearchEntry {
  title: string;
  description: string;
  url: string;
  section: string;
  content: string;
}

const MAX_RESULTS = 10;

function scoreEntry(entry: SearchEntry, queryLower: string, words: string[]): number {
  let score = 0;
  const title = entry.title.toLowerCase();
  const desc = entry.description.toLowerCase();
  const content = entry.content.toLowerCase();

  if (title.includes(queryLower)) score += 100;
  else if (title.split(/\s+/).some((w) => queryLower.includes(w))) score += 50;

  if (desc.includes(queryLower)) score += 30;

  let contentHits = 0;
  for (const word of words) {
    if (title.includes(word)) score += 20;
    if (desc.includes(word)) score += 10;
    if (content.includes(word)) {
      score += 5;
      contentHits += 1;
    }
  }
  if (contentHits > 0) score += Math.min(contentHits, 5) * 2;

  return score;
}

function searchIndex(entries: SearchEntry[], query: string): SearchEntry[] {
  const queryLower = query.trim().toLowerCase();
  if (!queryLower) return [];
  const words = queryLower.split(/\s+/).filter((w) => w.length > 1);

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, queryLower, words) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map((r) => r.entry);
}

export default function SearchNavbarItem(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const loadIndex = useCallback(async () => {
    if (entries) return;
    try {
      const res = await fetch("/search-index.json", { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as SearchEntry[];
      setEntries(data);
    } catch (e) {
      setError("Search index unavailable. Try again later.");
      console.error("Failed to load search index:", e);
    }
  }, [entries]);

  const openModal = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    void loadIndex();
  }, [loadIndex]);

  const closeModal = useCallback(() => {
    setOpen(false);
    setActiveIndex(0);
    // Return focus to the trigger so keyboard users stay in the navbar.
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) closeModal();
        else openModal();
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        closeModal();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openModal, closeModal]);

  // Focus the input once the modal is open.
  useEffect(() => {
    if (open) {
      // Wait a frame so the input is mounted.
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => searchIndex(entries ?? [], query), [entries, query]);

  // Keep the active result in view when navigating.
  useEffect(() => {
    const el = resultsRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onKeyDownInResults = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      const result = results[activeIndex];
      if (result) {
        window.location.href = result.url;
        closeModal();
      }
    }
  };

  if (!open) {
    return (
      <button
        ref={triggerRef}
        type="button"
        className="search-nav-trigger"
        onClick={openModal}
        aria-label="Search documentation (Command+K)"
        title="Search documentation"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="currentColor"
          focusable="false"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <span className="search-nav-trigger-label">Search</span>
        <kbd className="search-nav-kbd">⌘K</kbd>
      </button>
    );
  }

  return (
    <div
      className="search-modal-overlay"
      onClick={closeModal}
      role="presentation"
    >
      <div
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDownInResults}
      >
        <div className="search-modal-header">
          <input
            ref={inputRef}
            type="search"
            className="search-modal-input"
            placeholder="Search documentation…"
            aria-label="Search query"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
          />
          <button type="button" className="search-modal-close" onClick={closeModal} aria-label="Close search">
            Esc
          </button>
        </div>

        <div aria-live="polite" role="status" className="search-modal-status">
          {query && results.length === 0 && !error ? "No results found." : ""}
          {error || ""}
        </div>

        {results.length > 0 && (
          <ul className="search-modal-results" ref={resultsRef}>
            {results.map((result, index) => (
              <li key={result.url} data-index={index} className={index === activeIndex ? "active" : ""}>
                <a href={result.url} onClick={closeModal}>
                  <span className="search-result-title">{result.title}</span>
                  <span className="search-result-section">{result.section}</span>
                  {result.description && (
                    <span className="search-result-description">{result.description}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}

        {entries && query && results.length === 0 && !error && (
          <p className="search-modal-empty">No documentation matches “{query}”.</p>
        )}

        <div className="search-modal-footer">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span className="search-modal-footer-index">build-time index</span>
        </div>
      </div>
    </div>
  );
}
