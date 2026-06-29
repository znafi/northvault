import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-ink min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Logo variant="light" withIcon size="md" />

      <h1 className="font-archivo font-black uppercase text-white text-7xl sm:text-9xl tracking-tighter mt-10 leading-none">
        404
      </h1>
      <p className="font-archivo font-bold uppercase text-white/40 tracking-widest text-sm mt-2">
        Page not found
      </p>
      <p className="text-white/50 text-base mt-4 max-w-sm leading-relaxed">
        That page doesn&apos;t exist — but all 13 World Cup 2026 jerseys do.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-brand text-white font-archivo font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-xl hover:bg-brand/90 transition-colors"
        >
          Back to Shop <ArrowRight size={16} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-white/20 text-white font-archivo font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
