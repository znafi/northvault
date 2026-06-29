"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";


export function Header() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-ink text-white transition-all duration-200",
        scrolled ? "shadow-lg py-2" : "py-3"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" aria-label="Northvault home">
          <Logo variant="light" withIcon size="md" />
        </Link>

        {/* Right Icons */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            className="p-2 text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>
          <Link
            href="/account"
            className="p-2 text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10 hidden sm:flex"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
          <button
            onClick={openCart}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10 relative"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 tabular-nums"
                aria-live="polite"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-white/10 mt-2">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="py-2 px-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="py-2 px-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
