import Link from "next/link";
import { ArrowRight, Shield, MapPin, Star } from "lucide-react";

export const metadata = {
  title: "About Northvault",
  description: "Canada's home for World Cup 2026 national-team jerseys.",
};

export default function AboutPage() {
  return (
    <div className="bg-ink min-h-screen">
      {/* Hero */}
      <div className="bg-surface border-b border-line-dark py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold font-archivo font-bold uppercase tracking-[0.25em] text-xs mb-4">Our Story</p>
          <h1 className="font-archivo font-black uppercase text-white text-5xl sm:text-6xl tracking-tight leading-none">THE VAULT.</h1>
          <p className="text-white/60 text-lg mt-6 leading-relaxed max-w-xl">
            Northvault is a Canadian shop built for one purpose: putting the world&apos;s best national-team jerseys in the hands of Canadian fans — shipped from here, no duties, no surprises.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* Story */}
        <section>
          <h2 className="font-archivo font-black uppercase text-white text-2xl tracking-tight mb-6">Why Northvault</h2>
          <div className="space-y-4 text-white/50 leading-relaxed">
            <p>Canada is hosting the World Cup for the first time in 2026 — and the country is alive with football energy like never before. But Canadian fans kept running into the same problem: great jerseys from other countries shipped internationally, came with surprise duties, took weeks to arrive, and were a headache to return.</p>
            <p>Northvault was built to fix that. We curate the best national-team kits from every confederation, warehouse them in Canada, and ship them fast — with no import surprises, and with a real return policy.</p>
            <p>The name is simple: we&apos;re a vault of the North&apos;s best football kits. Every product in our collection has been hand-selected. Nothing gets in unless it meets our standard.</p>
          </div>
        </section>

        {/* Promises */}
        <section id="authenticity">
          <h2 className="font-archivo font-black uppercase text-white text-2xl tracking-tight mb-6">The Northvault Promise</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <MapPin size={20} />, title: "Ships from Canada", desc: "Every order ships domestically. No import duties. No customs headaches." },
              { icon: <Shield size={20} />, title: "Honest labeling", desc: "We tell you exactly what you're buying — grade, maker, and origin. Always." },
              { icon: <Star size={20} />, title: "Curated collection", desc: "We only carry kits we'd wear ourselves. Quality over quantity, every time." },
            ].map((item) => (
              <div key={item.title} className="bg-surface rounded-xl border border-line-dark p-5 space-y-2">
                <span className="text-brand">{item.icon}</span>
                <p className="font-semibold text-sm text-white">{item.title}</p>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface border border-line-dark rounded-2xl p-8 text-center">
          <p className="font-archivo font-black uppercase text-white text-2xl tracking-tight mb-3">Ready to find your kit?</p>
          <p className="text-white/40 text-sm mb-6">All 13 World Cup 2026 national-team jerseys. In stock. Ships from Canada.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-brand text-white font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-xl hover:bg-brand/90 transition-colors">
            Shop All Jerseys <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
