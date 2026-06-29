"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { jerseys } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return jerseys.filter(
      (j) =>
        j.name.toLowerCase().includes(q) ||
        j.country.toLowerCase().includes(q) ||
        j.colorway.toLowerCase().includes(q) ||
        j.maker.toLowerCase().includes(q) ||
        j.region.toLowerCase().includes(q) ||
        j.type.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jerseys, countries, brands..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white text-lg placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>
          {query && (
            <p className="text-white/40 text-sm mt-3 tabular-nums">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;
              {query}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!query && (
          <div className="text-center py-20">
            <Search size={40} className="text-muted-fg mx-auto mb-4 opacity-40" />
            <p className="font-archivo font-bold uppercase text-ink text-lg tracking-tight mb-1">
              Search the collection
            </p>
            <p className="text-muted-fg text-sm">
              Try &ldquo;Brazil&rdquo;, &ldquo;Nike&rdquo;, &ldquo;Home&rdquo;, or &ldquo;Canada&rdquo;
            </p>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="text-center py-20">
            <p className="font-archivo font-bold uppercase text-ink text-lg tracking-tight mb-2">
              No results found
            </p>
            <p className="text-muted-fg text-sm mb-6">
              We couldn&apos;t find anything for &ldquo;{query}&rdquo;. Try a different term.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand/90 transition-colors"
            >
              Browse all jerseys <ArrowRight size={16} />
            </a>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {results.map((j) => (
              <ProductCard key={j.id} jersey={j} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
