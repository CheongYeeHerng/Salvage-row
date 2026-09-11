"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Category, Item, categories as allCategories } from "@/data/catalogue";
import ItemCard from "./ItemCard";

interface SearchResultItem {
  item: Item;
  reason: string | null;
}

type SortOption = "recent-desc" | "recent-asc" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  "recent-desc": "Newest first",
  "recent-asc": "Oldest first",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

const PAGE_SIZE = 24;

export default function BrowseView({ initial }: { initial: Item[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [sort, setSort] = useState<SortOption>("recent-desc");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<SearchResultItem[]>(
    initial.map((item) => ({ item, reason: null }))
  );
  const [searchedFor, setSearchedFor] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(initial.map((item) => ({ item, reason: null })));
      setSearchedFor(null);
      setNote(null);
      return;
    }
    setLoading(true);
    setNote(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
      setSearchedFor(trimmed);
      if (data.mode === "fallback") {
        setNote(
          `Showing keyword matches — ${data.note ?? "the natural-language model didn't return a usable result for this query."}`
        );
      }
    } catch {
      setNote("Search request failed. Showing the full catalogue instead.");
      setResults(initial.map((item) => ({ item, reason: null })));
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setSearchedFor(null);
    setNote(null);
    setResults(initial.map((item) => ({ item, reason: null })));
  }

  const filtered = useMemo(() => {
    if (!activeCategory) return results;
    return results.filter((r) => r.item.category === activeCategory);
  }, [results, activeCategory]);

  // A relevance-ranked AI search result keeps its own order (that ranking is
  // the point). Otherwise, apply the chosen sort.
  const sorted = useMemo(() => {
    if (searchedFor) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      switch (sort) {
        case "recent-desc":
          return b.item.listedAt.localeCompare(a.item.listedAt);
        case "recent-asc":
          return a.item.listedAt.localeCompare(b.item.listedAt);
        case "price-asc":
          return a.item.price - b.item.price;
        case "price-desc":
          return b.item.price - a.item.price;
      }
    });
    return copy;
  }, [filtered, sort, searchedFor]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 whenever the underlying set changes shape.
  useEffect(() => {
    setPage(1);
  }, [searchedFor, activeCategory, sort, results]);

  return (
    <div>
      <form onSubmit={runSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder='Try "something for a first apartment under $50" or "untested electronics"'
          className="flex-1 border border-dust-line bg-paper px-3 py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-rust"
          aria-label="Search the catalogue in your own words"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-denim text-paper hover:bg-denim-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Searching…" : "Search"}
          </button>
          {searchedFor && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2 border border-dust-line hover:bg-paper-dim transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {allCategories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(activeCategory === c ? null : c)}
              className={`text-xs px-3 py-1 border transition-colors ${
                activeCategory === c
                  ? "bg-rust text-paper border-rust"
                  : "border-dust-line hover:bg-paper-dim"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs">
          <span className="text-dust">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            disabled={!!searchedFor}
            className="border border-dust-line bg-paper px-2 py-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-rust disabled:opacity-50"
            title={searchedFor ? "Sorting is disabled while showing search results, which are ranked by relevance" : undefined}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
              <option key={opt} value={opt}>
                {SORT_LABELS[opt]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-dust mb-4">
        {searchedFor ? (
          <>
            {sorted.length} result{sorted.length === 1 ? "" : "s"} for “{searchedFor}”, ranked by relevance
          </>
        ) : (
          <>
            Showing {sorted.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length} listings
          </>
        )}
        {activeCategory && <> in {activeCategory}</>}
      </p>

      {note && (
        <p className="text-xs text-rust-dark mb-4 border border-dust-line bg-paper-dim/60 px-3 py-2">
          {note}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="text-dust italic">
          Nothing matched. Try a broader description, or clear the search to browse everything.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map(({ item, reason }) => (
            <ItemCard key={item.id} item={item} reason={reason} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-dust-line hover:bg-paper-dim transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-current={page === n ? "page" : undefined}
                className={`w-8 h-8 text-sm border transition-colors ${
                  page === n ? "bg-rust text-paper border-rust" : "border-dust-line hover:bg-paper-dim"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-dust-line hover:bg-paper-dim transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
