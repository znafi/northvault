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
    <label className="flex items-center gap-2 cursor-pointer group">
      <div
        className={cn(
          "w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0",
          checked
            ? "bg-brand border-brand"
            : "border-line-light group-hover:border-brand/50"
        )}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path
              d="M1 3L3 5L7 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-ink">{label}</span>
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
    if (selectedCountries.length)
      list = list.filter((j) => selectedCountries.includes(j.country));
    if (selectedType) list = list.filter((j) => j.type === selectedType);
    if (selectedRegions.length)
      list = list.filter((j) => selectedRegions.includes(j.region));
    if (selectedMakers.length)
      list = list.filter((j) => selectedMakers.includes(j.maker));
    if (inStockOnly)
      list = list.filter((j) => j.sizes.some((s) => s.inStock));

    return sortJerseys(list, sort);
  }, [
    search,
    selectedCountries,
    selectedType,
    selectedRegions,
    selectedMakers,
    inStockOnly,
    sort,
  ]);

  const activeFilters: ActiveFilter[] = [
    ...selectedCountries.map((c) => ({ label: c, key: "country", value: c })),
    ...(selectedType ? [{ label: selectedType, key: "type", value: selectedType }] : []),
    ...selectedRegions.map((r) => ({ label: r, key: "region", value: r })),
    ...selectedMakers.map((m) => ({ label: m, key: "maker", value: m })),
    ...(inStockOnly ? [{ label: "In stock only", key: "stock", value: "1" }] : []),
  ];

  function removeFilter(f: ActiveFilter) {
    switch (f.key) {
      case "country":
        setSelectedCountries((p) => p.filter((v) => v !== f.value));
        break;
      case "type":
        setSelectedType("");
        break;
      case "region":
        setSelectedRegions((p) => p.filter((v) => v !== f.value));
        break;
      case "maker":
        setSelectedMakers((p) => p.filter((v) => v !== f.value));
        break;
      case "stock":
        setInStockOnly(false);
        break;
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

  const Filters = (
    <aside className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-2">
          Search
        </p>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Country, colorway..."
          className="w-full border border-line-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-3">
          Kit Type
        </p>
        <div className="space-y-2">
          {(["", "Home", "Away"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={selectedType === t}
                onChange={() => setSelectedType(t)}
                className="accent-brand"
              />
              <span className="text-sm text-ink">{t || "All"}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-3">
          Region
        </p>
        <div className="space-y-2">
          {allRegions.map((r) => (
            <FilterCheckbox
              key={r}
              label={r}
              checked={selectedRegions.includes(r)}
              onChange={(v) =>
                setSelectedRegions((p) =>
                  v ? [...p, r] : p.filter((x) => x !== r)
                )
              }
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-3">
          Country
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {allCountries.map((c) => (
            <FilterCheckbox
              key={c}
              label={c}
              checked={selectedCountries.includes(c)}
              onChange={(v) =>
                setSelectedCountries((p) =>
                  v ? [...p, c] : p.filter((x) => x !== c)
                )
              }
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-fg mb-3">
          Brand
        </p>
        <div className="space-y-2">
          {allMakers.map((m) => (
            <FilterCheckbox
              key={m}
              label={m}
              checked={selectedMakers.includes(m)}
              onChange={(v) =>
                setSelectedMakers((p) =>
                  v ? [...p, m] : p.filter((x) => x !== m)
                )
              }
            />
          ))}
        </div>
      </div>

      <div>
        <FilterCheckbox
          label="In stock only"
          checked={inStockOnly}
          onChange={setInStockOnly}
        />
      </div>
    </aside>
  );

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold font-archivo font-bold uppercase tracking-[0.2em] text-xs mb-2">
            World Cup 2026
          </p>
          <h1 className="font-archivo font-black uppercase text-white text-4xl sm:text-5xl tracking-tight leading-none">
            ALL JERSEYS
          </h1>
          <p className="text-white/50 text-sm mt-2 tabular-nums">
            {filtered.length} of {jerseys.length} kits
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-line-light rounded-lg px-3 py-2 text-sm font-medium text-ink hover:border-brand transition-colors"
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
              className="flex items-center gap-1.5 bg-brand/10 text-brand border border-brand/20 rounded-full px-3 py-1 text-xs font-medium hover:bg-brand/20 transition-colors"
            >
              {f.label} <X size={12} />
            </button>
          ))}
          {activeFilters.length > 1 && (
            <button
              onClick={clearAll}
              className="text-xs text-muted-fg hover:text-ink transition-colors underline"
            >
              Clear all
            </button>
          )}

          <div className="ml-auto relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none border border-line-light rounded-lg pl-3 pr-8 py-2 text-sm text-ink bg-white focus:outline-none focus:border-brand transition-colors cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-fg pointer-events-none"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-52 flex-shrink-0">{Filters}</div>

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-archivo font-bold uppercase text-ink text-lg mb-2">
                  No jerseys found
                </p>
                <p className="text-muted-fg text-sm mb-6">
                  Try adjusting your filters.
                </p>
                <button
                  onClick={clearAll}
                  className="bg-brand text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand/90 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((j) => (
                  <ProductCard key={j.id} jersey={j} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 shadow-2xl flex flex-col lg:hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line-light">
              <p className="font-archivo font-bold uppercase tracking-wide text-sm text-ink">
                Filters
              </p>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{Filters}</div>
            <div className="p-5 border-t border-line-light">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-brand text-white font-semibold py-3 rounded-lg text-sm hover:bg-brand/90 transition-colors"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
