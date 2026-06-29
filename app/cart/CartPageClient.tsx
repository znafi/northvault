"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  getBestsellers,
  getCountryFlag,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  TAX_RATE,
  PROMO_DISCOUNT,
} from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

function formatCAD(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);
}

export function CartPageClient() {
  const {
    state,
    removeItem,
    updateQty,
    lineKey,
    applyPromo,
    clearPromo,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "ok" | "invalid">("idle");

  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount));

  function handleApplyPromo() {
    if (state.promoCode) {
      clearPromo();
      setPromoInput("");
      setPromoStatus("idle");
      return;
    }
    const result = applyPromo(promoInput.trim());
    setPromoStatus(result);
  }

  const suggested = getBestsellers().slice(0, 4);

  if (state.lines.length === 0) {
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-muted-fg" />
          </div>
          <h1 className="font-archivo font-black uppercase text-ink text-3xl tracking-tight mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-fg mb-8">
            Find your kit and represent your nation.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brand text-white font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-xl hover:bg-brand/90 transition-colors"
          >
            Shop Jerseys <ArrowRight size={16} />
          </Link>

          {/* Suggestions */}
          <div className="mt-16 text-left">
            <h2 className="font-archivo font-bold uppercase text-ink text-lg tracking-tight mb-4">
              Popular Right Now
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {suggested.map((j) => (
                <ProductCard key={j.id} jersey={j} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-archivo font-black uppercase text-ink text-3xl sm:text-4xl tracking-tight mb-8">
          Your Cart{" "}
          <span className="text-muted-fg font-inter font-normal normal-case text-xl">
            ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Line items */}
          <div className="lg:col-span-2 space-y-3">
            {/* Free shipping bar */}
            {shippingRemaining > 0 ? (
              <div className="bg-white rounded-xl border border-line-light p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ink font-medium">
                    Add {formatCAD(shippingRemaining)} more for free shipping
                  </span>
                  <span className="text-success font-semibold">Free over $150</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((subtotal - discount) / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-success text-sm font-medium flex items-center gap-2">
                <CheckCircle size={16} />
                You qualify for free shipping!
              </div>
            )}

            {/* Cart lines */}
            <div className="bg-white rounded-xl border border-line-light divide-y divide-line-light overflow-hidden">
              {state.lines.map((line) => {
                const key = lineKey(line);
                const lineTotal =
                  (line.unitPrice + (line.printing?.fee ?? 0)) * line.qty;
                return (
                  <div key={key} className="flex gap-4 p-4">
                    <Link
                      href={`/shop/${line.slug}`}
                      className="relative w-20 h-24 sm:w-24 sm:h-28 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden"
                    >
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-fg">
                            {getCountryFlag(line.countryCode)} {line.country}
                          </p>
                          <Link
                            href={`/shop/${line.slug}`}
                            className="font-medium text-ink text-sm hover:text-brand transition-colors line-clamp-2 leading-snug mt-0.5"
                          >
                            {line.name}
                          </Link>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-fg">
                            <span>Size: <strong className="text-ink">{line.size}</strong></span>
                            <span>{formatCAD(line.unitPrice)}</span>
                          </div>
                          {line.printing && (
                            <p className="text-xs text-gold font-medium mt-1">
                              Print: {line.printing.name} #{line.printing.number} (+{formatCAD(line.printing.fee)})
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(key)}
                          className="text-muted-fg hover:text-ink transition-colors p-1 flex-shrink-0"
                          aria-label={`Remove ${line.name}`}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 border border-line-light rounded-lg">
                          <button
                            onClick={() => updateQty(key, line.qty - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors text-ink"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-3 text-sm font-semibold text-ink tabular-nums min-w-[28px] text-center">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => updateQty(key, line.qty + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors text-ink"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <p className="font-bold text-ink tabular-nums text-sm">
                          {formatCAD(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suggestions */}
            <div className="mt-8">
              <h2 className="font-archivo font-bold uppercase text-ink text-base tracking-tight mb-4">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {suggested.map((j) => (
                  <ProductCard key={j.id} jersey={j} />
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-line-light p-5 space-y-4 sticky top-24">
              <h2 className="font-archivo font-bold uppercase text-ink tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-fg">Subtotal</span>
                  <span className="tabular-nums font-medium text-ink">
                    {formatCAD(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span className="font-medium">
                      Promo ({state.promoCode})
                    </span>
                    <span className="tabular-nums font-medium">
                      -{formatCAD(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-fg">Shipping</span>
                  <span className="tabular-nums font-medium text-ink">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatCAD(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-fg">
                    Estimated tax (GST, 5%)
                  </span>
                  <span className="tabular-nums font-medium text-ink">
                    {formatCAD(tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-line-light font-bold text-ink text-base">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCAD(total)}</span>
                </div>
              </div>

              {/* Promo code */}
              <div>
                <p className="text-xs font-semibold text-muted-fg mb-2">
                  Promo code
                </p>
                {state.promoCode ? (
                  <div className="flex items-center justify-between bg-success/10 border border-success/20 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1.5 text-success text-sm font-medium">
                      <CheckCircle size={14} />
                      {state.promoCode} — {Math.round(PROMO_DISCOUNT * 100)}% off
                    </div>
                    <button
                      onClick={() => {
                        clearPromo();
                        setPromoStatus("idle");
                      }}
                      className="text-success/60 hover:text-success transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        setPromoStatus("idle");
                      }}
                      placeholder="e.g. WC2026"
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      className="flex-1 border border-line-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand transition-colors uppercase tracking-wider"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="flex items-center gap-1.5 bg-ink text-white font-semibold text-xs px-3 py-2 rounded-lg hover:bg-ink/90 transition-colors whitespace-nowrap"
                    >
                      <Tag size={12} /> Apply
                    </button>
                  </div>
                )}
                {promoStatus === "invalid" && (
                  <div className="flex items-center gap-1.5 mt-2 text-brand text-xs">
                    <AlertCircle size={12} />
                    Invalid promo code. Try WC2026.
                  </div>
                )}
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-brand hover:bg-brand/90 text-white font-archivo font-bold uppercase tracking-wide text-sm py-4 rounded-xl transition-colors"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-fg">
                <span>🔒 Secure checkout</span>
                <span>🇨🇦 Ships from Canada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
