"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { jerseys } from "@/lib/data";
import { Jersey } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "bestseller";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "bestseller", label: "Bestsellers first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function sortJerseys(list: Jersey[], sort: SortKey): Jersey[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "bestseller":
      return copy.sort((a, b) => {
        const aB = a.badges.includes("Bestseller") ? 0 : 1;
        const bB = b.badges.includes("Bestseller") ? 0 : 1;
        return aB - bB;
      });
    default:
      return copy;
  }
}

const allCountries = [...new Set(jerseys.map((j) => j.country))].sort();
const allRegions = [...new Set(jerseys.map((j) => j.region))].sort();
const allMakers = [...new Set(jerseys.map((j) => j.maker))].sort();

interface ActiveFilter {
  label: string;
  key: string;
  value: string;
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      {/* Hidden real checkbox — this is what makes it actually toggle */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {/* Custom visual */}
      <div
        className={cn(
          "w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0",
          checked
            ? "bg-brand border-brand"
            : "border-white/20 group-hover:border-brand/60"
        )}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-white/70 group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}

export function ShopCatalog() {
  const searchParams = useSearchParams();

  const initialType = searchParams.get("type") ?? "";
  const initialRegion = searchParams.get("region") ?? "";
  const initialSort = (searchParams.get("sort") as SortKey) ?? "featured";
  const initialCountry = searchParams.get("country") ?? "";

  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    initialCountry ? [initialCountry] : []
  );
  const [selectedType, setSelectedType] = useState<"" | "Home" | "Away">(
    initialType === "Home" || initialType === "Away" ? initialType : ""
  );
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    initialRegion ? [decodeURIComponent(initialRegion)] : []
  );
  const [selectedMakers, setSelectedMakers] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = jerseys;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.name.toLowerCase().includes(q) ||
          j.country.toLowerCase().includes(q) ||
          j.colorway.toLowerCase().includes(q) ||
          j.maker.toLowerCase().includes(q)
      );
    }
    if (selectedCountries.length) list = list.filter((j) => selectedCountries.includes(j.country));
    if (selectedType) list = list.filter((j) => j.type === selectedType);
    if (selectedRegions.length) list = list.filter((j) => selectedRegions.includes(j.region));
    if (selectedMakers.length) list = list.filter((j) => selectedMakers.includes(j.maker));
    if (inStockOnly) list = list.filter((j) => j.sizes.some((s) => s.inStock));
    return sortJerseys(list, sort);
  }, [search, selectedCountries, selectedType, selectedRegions, selectedMakers, inStockOnly, sort]);

  const activeFilters: ActiveFilter[] = [
    ...selectedCountries.map((c) => ({ label: c, key: "country", value: c })),
    ...(selectedType ? [{ label: selectedType, key: "type", value: selectedType }] : []),
    ...selectedRegions.map((r) => ({ label: r, key: "region", value: r })),
    ...selectedMakers.map((m) => ({ label: m, key: "maker", value: m })),
    ...(inStockOnly ? [{ label: "In stock only", key: "stock", value: "1" }] : []),
  ];

  function removeFilter(f: ActiveFilter) {
    switch (f.key) {
      case "country": setSelectedCountries((p) => p.filter((v) => v !== f.value)); break;
      case "type": setSelectedType(""); break;
      case "region": setSelectedRegions((p) => p.filter((v) => v !== f.value)); break;
      case "maker": setSelectedMakers((p) => p.filter((v) => v !== f.value)); break;
      case "stock": setInStockOnly(false); break;
    }
  }

  function clearAll() {
    setSelectedCountries([]);
    setSelectedType("");
    setSelectedRegions([]);
    setSelectedMakers([]);
    setInStockOnly(false);
    setSearch("");
  }

  const filterSection = (title: string) => (
    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">{title}</p>
  );

  const Filters = (
    <aside className="space-y-6">
      <div>
        {filterSection("Search")}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Country, colorway..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <div>
        {filterSection("Kit Type")}
        <div className="space-y-2">
          {(["", "Home", "Away"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="type"
                checked={selectedType === t}
                onChange={() => setSelectedType(t)}
                className="sr-only"
              />
              <div className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center transition-colors flex-shrink-0",
                selectedType === t ? "border-brand bg-brand" : "border-white/20 group-hover:border-brand/60"
              )}>
                {selectedType === t && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">{t || "All"}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        {filterSection("Region")}
        <div className="space-y-2">
          {allRegions.map((r) => (
            <FilterCheckbox
              key={r}
              label={r}
              checked={selectedRegions.includes(r)}
              onChange={(v) => setSelectedRegions((p) => v ? [...p, r] : p.filter((x) => x !== r))}
            />
          ))}
        </div>
      </div>

      <div>
        {filterSection("Country")}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {allCountries.map((c) => (
            <FilterCheckbox
              key={c}
              label={c}
              checked={selectedCountries.includes(c)}
              onChange={(v) => setSelectedCountries((p) => v ? [...p, c] : p.filter((x) => x !== c))}
            />
          ))}
        </div>
      </div>

      <div>
        {filterSection("Brand")}
        <div className="space-y-2">
          {allMakers.map((m) => (
            <FilterCheckbox
              key={m}
              label={m}
              checked={selectedMakers.includes(m)}
              onChange={(v) => setSelectedMakers((p) => v ? [...p, m] : p.filter((x) => x !== m))}
            />
          ))}
        </div>
      </div>

      <div className="pt-1">
        <FilterCheckbox label="In stock only" checked={inStockOnly} onChange={setInStockOnly} />
      </div>
    </aside>
  );

  return (
    <div className="bg-ink min-h-screen">
      {/* Page header */}
      <div className="bg-surface border-b border-line-dark py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold font-archivo font-bold uppercase tracking-[0.2em] text-xs mb-2">World Cup 2026</p>
          <h1 className="font-archivo font-black uppercase text-white text-4xl sm:text-5xl tracking-tight leading-none">
            ALL JERSEYS
          </h1>
          <p className="text-white/40 text-sm mt-2 tabular-nums">
            {filtered.length} of {jerseys.length} kits
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:border-brand hover:text-white transition-colors"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilters.length > 0 && (
              <span className="bg-brand text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {activeFilters.length}
              </span>
            )}
          </button>

          {activeFilters.map((f) => (
            <button
              key={`${f.key}:${f.value}`}
              onClick={() => removeFilter(f)}
              className="flex items-center gap-1.5 bg-brand/10 text-brand border border-brand/30 rounded-full px-3 py-1 text-xs font-medium hover:bg-brand/20 transition-colors"
            >
              {f.label} <X size={12} />
            </button>
          ))}
          {activeFilters.length > 1 && (
            <button onClick={clearAll} className="text-xs text-white/30 hover:text-white transition-colors underline">
              Clear all
            </button>
          )}

          <div className="ml-auto relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none bg-surface border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:border-brand transition-colors cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-52 flex-shrink-0">{Filters}</div>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-archivo font-bold uppercase text-white text-lg mb-2">No jerseys found</p>
                <p className="text-white/40 text-sm mb-6">Try adjusting your filters.</p>
                <button onClick={clearAll} className="bg-brand text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand/90 transition-colors">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((j) => <ProductCard key={j.id} jersey={j} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)} aria-hidden="true" />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-surface z-50 shadow-2xl flex flex-col lg:hidden border-r border-line-dark">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line-dark">
              <p className="font-archivo font-bold uppercase tracking-wide text-sm text-white">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white" aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{Filters}</div>
            <div className="p-5 border-t border-line-dark">
              <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-brand text-white font-semibold py-3 rounded-lg text-sm hover:bg-brand/90 transition-colors">
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
