import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const shopLinks = [
  { href: "/shop?region=South+America", label: "South America" },
  { href: "/shop?region=Europe", label: "Europe" },
  { href: "/shop?region=Africa", label: "Africa" },
  { href: "/shop?region=North+America", label: "North America" },
  { href: "/shop?type=Home", label: "Home Kits" },
  { href: "/shop?type=Away", label: "Away Kits" },
];

const helpLinks = [
  { href: "/size-guide", label: "Size Guide" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const companyLinks = [
  { href: "/about", label: "About Northvault" },
  { href: "/about#authenticity", label: "Authenticity Promise" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-archivo font-bold uppercase tracking-wide text-sm">
              Get World Cup drops first
            </p>
            <p className="text-white/50 text-sm mt-0.5">
              No spam. Just jerseys.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Logo variant="light" withIcon size="sm" />
          <p className="text-white/40 text-xs mt-3 font-inter leading-relaxed">
            FOOTBALL KITS · CANADA
          </p>
          <p className="text-white/50 text-xs mt-4 leading-relaxed">
            Curating the world's best national-team jerseys, shipped from Canada
            with no surprise duties.
          </p>
        </div>

        <div>
          <p className="font-archivo font-bold uppercase tracking-widest text-xs text-white/40 mb-4">
            Shop
          </p>
          <ul className="space-y-2">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-archivo font-bold uppercase tracking-widest text-xs text-white/40 mb-4">
            Help
          </p>
          <ul className="space-y-2">
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-archivo font-bold uppercase tracking-widest text-xs text-white/40 mb-4">
            Company
          </p>
          <ul className="space-y-2">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Northvault. 🇨🇦 Shipped from Canada.</p>
          <div className="flex items-center gap-3">
            <span className="bg-white/10 rounded px-2 py-0.5 text-white/60 text-[10px] font-medium">
              VISA
            </span>
            <span className="bg-white/10 rounded px-2 py-0.5 text-white/60 text-[10px] font-medium">
              MC
            </span>
            <span className="bg-white/10 rounded px-2 py-0.5 text-white/60 text-[10px] font-medium">
              AMEX
            </span>
            <span className="bg-white/10 rounded px-2 py-0.5 text-white/60 text-[10px] font-medium">
              APPLE PAY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
