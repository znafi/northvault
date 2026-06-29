"use client";

import { useState } from "react";
import { SizeStock, Size } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: SizeStock[];
  selected: Size | null;
  onSelect: (size: Size) => void;
  error?: boolean;
}

export function SizeSelector({ sizes, selected, onSelect, error }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className={cn("text-sm font-semibold text-ink", error && "text-brand")}>
          Size {error && <span className="text-brand">— please select a size</span>}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map(({ size, inStock }) => (
          <button
            key={size}
            disabled={!inStock}
            onClick={() => inStock && onSelect(size)}
            aria-label={inStock ? `Select size ${size}` : `Size ${size} — out of stock`}
            className={cn(
              "relative min-w-[52px] h-11 px-3 rounded-lg border text-sm font-medium transition-all",
              !inStock &&
                "border-line-light text-muted-fg/40 cursor-not-allowed line-through bg-gray-50",
              inStock && selected === size &&
                "border-ink bg-ink text-white",
              inStock && selected !== size &&
                "border-line-light text-ink hover:border-brand hover:text-brand",
              error && inStock && selected !== size &&
                "border-brand/30"
            )}
          >
            {size}
            {!inStock && (
              <span className="sr-only"> (out of stock)</span>
            )}
          </button>
        ))}
      </div>
      {sizes.some((s) => !s.inStock) && (
        <p className="text-xs text-muted-fg mt-2">
          Crossed-out sizes are out of stock.{" "}
          <button className="text-brand underline hover:no-underline">
            Notify me
          </button>
        </p>
      )}
    </div>
  );
}
