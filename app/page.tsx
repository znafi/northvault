import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Truck, RotateCcw, Lock, Star } from "lucide-react";
import {
  jerseys,
  getBestsellers,
  getHostNation,
  getCountryFlag,
} from "@/lib/data";
import { Jersey } from "@/lib/types";

function formatCAD(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(n);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? "fill-gold text-gold" : "fill-white/10 text-white/10"}
        />
      ))}
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

function JerseyCard({ jersey }: { jersey: Jersey }) {
  return (
    <Link
      href={`/shop/${jersey.slug}`}
      className="group block bg-surface rounded-xl border border-line-dark overflow-hidden hover:border-white/20 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative aspect-[3/4] bg-white/5">
        <Image
          src={jersey.images[0]}
          alt={`${jersey.name} — ${jersey.colorway}`}
          fill
          className="object-cover group-hover:opacity-0 transition-opacity duration-200"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <Image
          src={jersey.images[1] ?? jersey.images[0]}
          alt={`${jersey.name} — alternate view`}
          fill
          className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {jersey.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {jersey.badges.map((b) => (
              <BadgePill key={b} badge={b} />
            ))}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-white/40 mb-0.5">
          {getCountryFlag(jersey.countryCode)} {jersey.country} · {jersey.type}
        </p>
        <p className="text-sm font-medium text-white leading-tight line-clamp-2">
          {jersey.name}
        </p>
        <div className="flex items-center justify-between mt-2">
          <StarRating rating={jersey.rating} />
          <p className="text-sm font-bold text-white tabular-nums">
            {formatCAD(jersey.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}


const trustItems = [
  { icon: <Truck size={22} />, title: "Ships from Canada", desc: "No surprise duties or import fees" },
  { icon: <Shield size={22} />, title: "Free shipping over $150", desc: "Canada-wide delivery" },
  { icon: <RotateCcw size={22} />, title: "Easy 30-day returns", desc: "Hassle-free on non-personalized items" },
  { icon: <Lock size={22} />, title: "Secure checkout", desc: "Stripe-powered, encrypted" },
];

export default function HomePage() {
  const bestsellers = getBestsellers();
  const hostNation = getHostNation();

  return (
    <>
      {/* HERO */}
      <section className="bg-ink min-h-[88vh] flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, #E11D2A 0%, transparent 50%), radial-gradient(circle at 75% 50%, #C8A24B 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-gold font-archivo font-bold uppercase tracking-[0.25em] text-xs mb-6">
            World Cup 2026 · Shop Now
          </p>
          <h1 className="font-archivo font-black uppercase text-white text-5xl sm:text-7xl lg:text-8xl leading-none tracking-tight -mt-1">
            WORLD CUP
            <br />
            <span className="text-white">2026.</span>{" "}
            <span className="relative inline-block" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>
              WORN
            </span>{" "}
            <span className="text-white">HERE.</span>
          </h1>
          <p className="text-white/60 font-inter text-lg sm:text-xl mt-6 max-w-lg mx-auto leading-relaxed">
            National-team jerseys, shipped from Canada. Every kit. Every nation. No duties.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-ink font-archivo font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-xl hover:bg-white/90 transition-colors min-h-[44px]">
              Shop All Jerseys <ArrowRight size={16} />
            </Link>
            <Link href="/shop?region=North+America&country=Canada" className="inline-flex items-center gap-2 border border-white/30 text-white font-archivo font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-xl hover:bg-white/10 transition-colors min-h-[44px]">
              🇨🇦 Shop Host Nation
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP — dark */}
      <section className="bg-surface border-y border-line-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-brand flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOST NATION BAND */}
      <section className="bg-surface text-white py-16 px-4 border-b border-line-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-gold font-archivo font-bold uppercase tracking-[0.2em] text-xs mb-2">🇨🇦 Host Nation 2026</p>
              <h2 className="font-archivo font-black uppercase text-white text-3xl sm:text-4xl tracking-tight leading-none">
                THE SHIRT OF<br />THE SUMMER.
              </h2>
            </div>
            <Link href="/shop?region=North+America&country=Canada" className="inline-flex items-center gap-2 border border-white/20 text-white font-archivo font-bold uppercase tracking-wide text-xs px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap">
              View All Canada Kits <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hostNation.map((jersey) => (
              <Link key={jersey.id} href={`/shop/${jersey.slug}`} className="group bg-white/5 border border-line-dark rounded-xl overflow-hidden flex gap-4 p-4 hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="relative w-20 h-24 flex-shrink-0 bg-white/10 rounded-lg overflow-hidden">
                  <Image src={jersey.images[0]} alt={jersey.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex gap-1 mb-1.5 flex-wrap">
                    {jersey.badges.map((b) => <BadgePill key={b} badge={b} />)}
                  </div>
                  <p className="font-medium text-white text-sm leading-tight">{jersey.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{jersey.colorway}</p>
                  <p className="font-bold text-white tabular-nums mt-2">{formatCAD(jersey.price)}</p>
                </div>
                <ArrowRight size={16} className="text-white/30 group-hover:text-white/70 transition-colors mt-1 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-ink py-16 px-4 border-b border-line-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-brand font-archivo font-bold uppercase tracking-[0.2em] text-xs mb-1.5">Top Sellers</p>
              <h2 className="font-archivo font-black uppercase text-white text-3xl sm:text-4xl tracking-tight leading-none">BESTSELLERS</h2>
            </div>
            <Link href="/shop?sort=bestseller" className="text-sm font-semibold text-brand hover:underline flex items-center gap-1 whitespace-nowrap">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {bestsellers.map((j) => <JerseyCard key={j.id} jersey={j} />)}
          </div>
        </div>
      </section>

      {/* FULL CATALOG */}
      <section className="bg-ink py-16 px-4 border-b border-line-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-white/40 font-archivo font-bold uppercase tracking-[0.2em] text-xs mb-1.5">All Kits</p>
              <h2 className="font-archivo font-black uppercase text-white text-3xl sm:text-4xl tracking-tight leading-none">THE COLLECTION</h2>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-brand hover:underline flex items-center gap-1 whitespace-nowrap">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {jerseys.map((j) => <JerseyCard key={j.id} jersey={j} />)}
          </div>
        </div>
      </section>

      {/* NORTHVAULT PROMISE */}
      <section className="bg-surface text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold font-archivo font-bold uppercase tracking-[0.25em] text-xs mb-4">The Northvault Promise</p>
          <h2 className="font-archivo font-black uppercase text-white text-3xl sm:text-4xl tracking-tight leading-tight">
            QUALITY KITS.<br />HONEST LABELS.<br />CANADA&apos;S VAULT.
          </h2>
          <p className="text-white/60 font-inter text-base mt-6 leading-relaxed max-w-xl mx-auto">
            Every jersey is clearly labeled — we tell you exactly who made it, what grade it is, and what you&apos;re getting. No vague descriptions.
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 mt-8 border border-white/20 text-white font-archivo font-bold uppercase tracking-wide text-xs px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
            Our Story <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
