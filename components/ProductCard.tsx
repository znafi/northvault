"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import { Jersey, Size } from "@/lib/types";
import { getCountryFlag } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

function formatCAD(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(n);
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={10} className={s <= Math.round(rating) ? "fill-gold text-gold" : "fill-white/10 text-white/10"} />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-[10px] text-white/30 tabular-nums">({count})</span>
      )}
    </div>
  );
}

function BadgePill({ badge }: { badge: string }) {
  const colors: Record<string, string> = {
    Bestseller: "bg-brand/20 text-brand",
    "Host Nation": "bg-gold/20 text-gold",
    New: "bg-success/20 text-success",
  };
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${colors[badge] ?? "bg-white/10 text-white/60"}`}>
      {badge}
    </span>
  );
}

interface SizeMiniPickerProps {
  jersey: Jersey;
  onAdd: (size: Size) => void;
  onClose: () => void;
}

function SizeMiniPicker({ jersey, onAdd, onClose }: SizeMiniPickerProps) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 bg-surface border-t border-line-dark rounded-b-xl p-3 shadow-xl z-10"
      onClick={(e) => e.preventDefault()}
    >
      <p className="text-xs font-semibold text-white mb-2">Select size:</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {jersey.sizes.map(({ size, inStock }) => (
          <button
            key={size}
            disabled={!inStock}
            onClick={() => { onAdd(size); onClose(); }}
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-md border transition-colors",
              inStock
                ? "border-white/20 text-white hover:border-brand hover:text-brand"
                : "border-white/10 text-white/20 line-through cursor-not-allowed"
            )}
          >
            {size}
          </button>
        ))}
      </div>
      <button onClick={onClose} className="text-xs text-white/30 hover:text-white transition-colors">Cancel</button>
    </div>
  );
}

interface ProductCardProps {
  jersey: Jersey;
  className?: string;
}

export function ProductCard({ jersey, className }: ProductCardProps) {
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [hovering, setHovering] = useState(false);
  const { addItem, openCart } = useCart();

  const handleAdd = (size: Size) => {
    addItem({
      jerseyId: jersey.id,
      slug: jersey.slug,
      name: jersey.name,
      countryCode: jersey.countryCode,
      country: jersey.country,
      size,
      qty: 1,
      unitPrice: jersey.price,
      image: jersey.images[0],
    });
    openCart();
  };

  return (
    <div
      className={cn(
        "group relative bg-surface rounded-xl border border-line-dark overflow-hidden hover:border-white/20 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setShowSizePicker(false); }}
    >
      {/* Image */}
      <Link href={`/shop/${jersey.slug}`} className="block relative aspect-[3/4] bg-white/5">
        <Image
          src={jersey.images[0]}
          alt={`${jersey.name} — ${jersey.colorway}`}
          fill
          className={cn("object-cover transition-opacity duration-200", hovering ? "opacity-0" : "opacity-100")}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <Image
          src={jersey.images[1] ?? jersey.images[0]}
          alt={`${jersey.name} — alternate view`}
          fill
          className={cn("object-cover transition-opacity duration-200", hovering ? "opacity-100" : "opacity-0")}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {jersey.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {jersey.badges.map((b) => <BadgePill key={b} badge={b} />)}
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); setShowSizePicker(true); }}
          className={cn(
            "absolute bottom-2 right-2 bg-brand text-white rounded-lg p-2 shadow-lg transition-all duration-200",
            hovering ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          )}
          aria-label={`Quick add ${jersey.name} to cart`}
        >
          <ShoppingBag size={16} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-white/40 mb-0.5">
          {getCountryFlag(jersey.countryCode)} {jersey.country} ·{" "}
          <span className={cn("font-medium", jersey.type === "Home" ? "text-blue-400" : "text-purple-400")}>
            {jersey.type}
          </span>
        </p>
        <Link href={`/shop/${jersey.slug}`} className="text-sm font-medium text-white leading-tight line-clamp-2 hover:text-brand transition-colors">
          {jersey.name}
        </Link>
        <div className="flex items-center justify-between mt-2">
          <StarRating rating={jersey.rating} count={jersey.reviewCount} />
          <p className="text-sm font-bold text-white tabular-nums">{formatCAD(jersey.price)}</p>
        </div>
      </div>

      {showSizePicker && (
        <SizeMiniPicker jersey={jersey} onAdd={handleAdd} onClose={() => setShowSizePicker(false)} />
      )}
    </div>
  );
}
