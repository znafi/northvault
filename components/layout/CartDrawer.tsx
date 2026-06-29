"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getCountryFlag, FREE_SHIPPING_THRESHOLD } from "@/lib/data";
import { cn } from "@/lib/utils";

function formatCAD(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);
}

export function CartDrawer() {
  const {
    state,
    isCartOpen,
    closeCart,
    removeItem,
    updateQty,
    lineKey,
    subtotal,
    discount,
    shipping,
    total,
    itemCount,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) closeCart();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line-light">
          <h2 className="font-archivo font-bold uppercase tracking-wide text-sm text-ink">
            Your Cart
            {itemCount > 0 && (
              <span className="ml-2 text-muted-fg font-inter font-normal normal-case">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-ink"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Empty state */}
        {state.lines.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag size={28} className="text-muted-fg" />
            </div>
            <div>
              <p className="font-archivo font-bold text-ink uppercase tracking-wide text-sm">
                Your cart is empty
              </p>
              <p className="text-muted-fg text-sm mt-1">
                Find your kit in the collection.
              </p>
            </div>
            <Link
              href="/shop"
              onClick={closeCart}
              className="inline-flex items-center gap-2 bg-brand text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand/90 transition-colors"
            >
              Shop Jerseys <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Line items */}
        {state.lines.length > 0 && (
          <>
            {/* Free shipping progress */}
            {shippingRemaining > 0 && (
              <div className="px-5 py-3 bg-gray-50 border-b border-line-light">
                <div className="flex items-center justify-between text-xs text-muted-fg mb-1.5">
                  <span>{formatCAD(shippingRemaining)} away from free shipping</span>
                  <span className="text-success font-medium">Free over $150</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {shippingRemaining === 0 && (
              <div className="px-5 py-2.5 bg-success/10 border-b border-success/20 text-success text-xs font-medium text-center">
                ✓ You qualify for free shipping!
              </div>
            )}

            <div className="flex-1 overflow-y-auto divide-y divide-line-light">
              {state.lines.map((line) => {
                const key = lineKey(line);
                return (
                  <div key={key} className="flex gap-3 px-5 py-4">
                    <div className="w-16 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-fg">
                            {getCountryFlag(line.countryCode)} {line.country}
                          </p>
                          <p className="text-sm font-medium text-ink truncate leading-tight mt-0.5">
                            {line.name}
                          </p>
                          <p className="text-xs text-muted-fg mt-0.5">
                            Size: {line.size}
                          </p>
                          {line.printing && (
                            <p className="text-xs text-gold font-medium mt-0.5">
                              Print: {line.printing.name} {line.printing.number}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(key)}
                          className="text-muted-fg hover:text-ink transition-colors flex-shrink-0 p-0.5"
                          aria-label={`Remove ${line.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border border-line-light rounded-lg">
                          <button
                            onClick={() => updateQty(key, line.qty - 1)}
                            className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors text-ink"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-sm font-medium text-ink tabular-nums min-w-[20px] text-center">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => updateQty(key, line.qty + 1)}
                            className="p-1 hover:bg-gray-100 rounded-r-lg transition-colors text-ink"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-ink tabular-nums">
                          {formatCAD(
                            (line.unitPrice + (line.printing?.fee ?? 0)) * line.qty
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-line-light px-5 py-4 space-y-2 bg-white">
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success font-medium">
                    Promo ({state.promoCode})
                  </span>
                  <span className="text-success font-medium tabular-nums">
                    -{formatCAD(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-fg">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {shipping === 0 ? (
                    <span className="text-success font-medium">Free</span>
                  ) : (
                    formatCAD(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-ink pt-1 border-t border-line-light">
                <span>Total</span>
                <span className="tabular-nums">{formatCAD(total)}</span>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-brand hover:bg-brand/90 text-white font-semibold text-sm py-3 rounded-lg transition-colors"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex items-center justify-center w-full border border-line-light hover:bg-gray-50 text-ink font-medium text-sm py-2.5 rounded-lg transition-colors"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
