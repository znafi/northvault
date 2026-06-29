"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Minus, Plus, ShoppingBag, Zap, ChevronDown } from "lucide-react";
import { Jersey, Size, PrintingOptions } from "@/lib/types";
import { getCountryFlag, PRINTING_FEE } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { Gallery } from "./Gallery";
import { SizeSelector } from "./SizeSelector";
import { PrintingAddon } from "./PrintingAddon";
import { SizeGuideModal } from "./SizeGuideModal";
import { ProductCard } from "@/components/ProductCard";

function formatCAD(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            className={
              s <= Math.round(rating)
                ? "fill-gold text-gold"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-sm text-muted-fg tabular-nums">
        {rating.toFixed(1)} ({count} reviews)
      </span>
    </div>
  );
}

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line-light">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="font-semibold text-sm text-ink">{title}</span>
        <ChevronDown
          size={16}
          className={`text-muted-fg transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm text-muted-fg leading-relaxed">{children}</div>
      )}
    </div>
  );
}

const sampleReviews = [
  {
    name: "Alex M.",
    rating: 5,
    date: "June 2026",
    body: "Arrived fast, fits true to size. Quality is excellent — looks great on match day.",
  },
  {
    name: "Priya S.",
    rating: 5,
    date: "May 2026",
    body: "Ordered the Canada home kit. No duties, shipped from within Canada. Super happy.",
  },
  {
    name: "Jordan L.",
    rating: 4,
    date: "May 2026",
    body: "Great quality, runs slightly slim — I'd recommend sizing up if you wear it casually.",
  },
];

interface ProductDetailProps {
  jersey: Jersey;
  related: Jersey[];
}

export function ProductDetail({ jersey, related }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [printing, setPrinting] = useState<PrintingOptions | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const { addItem, openCart } = useCart();

  const totalPrice =
    jersey.price * qty + (printing ? printing.fee * qty : 0);

  function handleAdd() {
    if (!selectedSize) {
      setSizeError(true);
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addItem({
      jerseyId: jersey.id,
      slug: jersey.slug,
      name: jersey.name,
      countryCode: jersey.countryCode,
      country: jersey.country,
      size: selectedSize,
      qty,
      unitPrice: jersey.price,
      image: jersey.images[0],
      printing: printing ?? undefined,
    });
    openCart();
  }

  function handleBuyNow() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem({
      jerseyId: jersey.id,
      slug: jersey.slug,
      name: jersey.name,
      countryCode: jersey.countryCode,
      country: jersey.country,
      size: selectedSize,
      qty,
      unitPrice: jersey.price,
      image: jersey.images[0],
      printing: printing ?? undefined,
    });
    window.location.href = "/checkout";
  }

  const ratingDist = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted-fg flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-ink font-medium truncate">{jersey.name}</span>
      </nav>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Gallery */}
          <Gallery images={jersey.images} alt={jersey.name} />

          {/* Info column */}
          <div className="space-y-6">
            {/* Badges */}
            {jersey.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {jersey.badges.map((b) => {
                  const colors: Record<string, string> = {
                    Bestseller: "bg-brand/10 text-brand",
                    "Host Nation": "bg-gold/10 text-gold",
                    New: "bg-success/10 text-success",
                  };
                  return (
                    <span
                      key={b}
                      className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-md ${colors[b] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {b}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Name */}
            <div>
              <p className="text-sm text-muted-fg mb-1">
                {getCountryFlag(jersey.countryCode)} {jersey.country} ·{" "}
                {jersey.maker} · {jersey.type}
              </p>
              <h1 className="font-archivo font-black uppercase text-ink text-2xl sm:text-3xl tracking-tight leading-tight">
                {jersey.name}
              </h1>
              <p className="text-sm text-muted-fg mt-1">{jersey.colorway}</p>
            </div>

            {/* Price + rating */}
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-ink tabular-nums">
                {formatCAD(jersey.price)}
                <span className="text-sm text-muted-fg font-normal ml-1">CAD</span>
              </p>
              <StarRating rating={jersey.rating} count={jersey.reviewCount} />
            </div>

            {/* Description */}
            <p className="text-sm text-muted-fg leading-relaxed">
              {jersey.description}
            </p>

            {/* Size selector */}
            <div id="size-selector">
              <div className="flex items-center justify-between mb-2">
                <SizeSelector
                  sizes={jersey.sizes}
                  selected={selectedSize}
                  onSelect={(s) => {
                    setSelectedSize(s);
                    setSizeError(false);
                  }}
                  error={sizeError}
                />
              </div>
              <div className="mt-2">
                <SizeGuideModal />
              </div>
            </div>

            {/* Printing add-on */}
            <PrintingAddon value={printing} onChange={setPrinting} />

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-ink mb-2">Quantity</p>
              <div className="flex items-center gap-2 border border-line-light rounded-lg w-fit">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2.5 hover:bg-gray-100 rounded-l-lg transition-colors text-ink"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 text-sm font-semibold text-ink tabular-nums min-w-[32px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-2.5 hover:bg-gray-100 rounded-r-lg transition-colors text-ink"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Total + CTAs */}
            {(qty > 1 || printing) && (
              <p className="text-sm text-muted-fg">
                Total:{" "}
                <span className="font-bold text-ink tabular-nums">
                  {formatCAD(totalPrice)}
                </span>
                {printing && (
                  <span className="ml-1 text-xs">
                    (incl. +{formatCAD(printing.fee * qty)} printing)
                  </span>
                )}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-brand text-white font-archivo font-bold uppercase tracking-wide text-sm py-3.5 rounded-xl hover:bg-brand/90 transition-colors min-h-[44px]"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-ink text-ink font-archivo font-bold uppercase tracking-wide text-sm py-3.5 rounded-xl hover:bg-ink hover:text-white transition-colors min-h-[44px]"
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>

            {/* Highlights */}
            <ul className="space-y-1.5">
              {jersey.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-muted-fg">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* Accordions */}
            <div className="border-t border-line-light pt-2">
              <Accordion title="Details & Materials">
                <p>
                  Engineered for match performance. Lightweight, breathable knit
                  fabric with moisture-wicking technology. Embroidered national
                  crest. Tagless neck for all-day comfort. Machine washable
                  (cold, gentle cycle). Hang dry recommended.
                </p>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <div className="space-y-2">
                  <p>
                    Ships from Canada — no surprise duties or import fees for
                    Canadian orders.
                  </p>
                  <p>
                    <strong>Standard:</strong> 5–8 business days · Free on
                    orders over $150, otherwise $14.99.
                  </p>
                  <p>
                    <strong>Express:</strong> 2–3 business days · $24.99.
                  </p>
                  <p>
                    30-day returns on unworn, unaltered jerseys. Personalized
                    (printed) jerseys are{" "}
                    <strong>final sale</strong> and cannot be returned.
                  </p>
                </div>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16 pt-10 border-t border-line-light" id="reviews">
          <h2 className="font-archivo font-black uppercase text-ink text-2xl tracking-tight mb-8">
            Customer Reviews
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Summary */}
            <div className="text-center md:text-left">
              <p className="text-6xl font-black text-ink tabular-nums">
                {jersey.rating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    className={
                      s <= Math.round(jersey.rating)
                        ? "fill-gold text-gold"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-muted-fg">
                Based on {jersey.reviewCount} reviews
              </p>
              <div className="mt-4 space-y-1.5">
                {ratingDist.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-fg w-8 text-right tabular-nums">
                      {r.stars}★
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="text-muted-fg w-7 tabular-nums">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review list */}
            <div className="md:col-span-2 space-y-6">
              {sampleReviews.map((r, i) => (
                <div key={i} className="border-b border-line-light pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-ink">{r.name}</p>
                      <p className="text-xs text-muted-fg">{r.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={
                            s <= r.rating
                              ? "fill-gold text-gold"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-fg leading-relaxed">{r.body}</p>
                </div>
              ))}
              <button className="text-sm font-semibold text-brand hover:underline">
                Write a review
              </button>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-line-light">
            <h2 className="font-archivo font-black uppercase text-ink text-2xl tracking-tight mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((j) => (
                <ProductCard key={j.id} jersey={j} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-line-light p-4 flex gap-3 z-40 shadow-lg">
        <div className="flex-1">
          <p className="text-xs text-muted-fg">{jersey.name}</p>
          <p className="font-bold text-ink tabular-nums">{formatCAD(jersey.price)}</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-brand text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand/90 transition-colors min-h-[44px]"
        >
          <ShoppingBag size={16} />
          Add to Cart
        </button>
      </div>
    </>
  );
}
