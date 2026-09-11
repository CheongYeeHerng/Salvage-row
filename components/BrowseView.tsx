"use client";

import { FormEvent, useMemo, useState } from "react";
import { Category, Item, categories as allCategories } from "@/data/catalogue";
import ItemCard from "./ItemCard";

interface SearchResultItem {
  item: Item;
  reason: string | null;
}

export default function BrowseView({ initial }: { initial: Item[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
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

  const visible = useMemo(() => {
    if (!activeCategory) return results;
    return results.filter((r) => r.item.category === activeCategory);
  }, [results, activeCategory]);

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

      <div className="flex flex-wrap gap-2 mb-6">
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

      <p className="text-sm text-dust mb-4">
        {searchedFor ? (
          <>
            {visible.length} result{visible.length === 1 ? "" : "s"} for “{searchedFor}”
          </>
        ) : (
          <>Showing all {visible.length} listings</>
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
    </div>
  );
}
