import Link from "next/link";
import { Package, MapPin, User, ArrowRight } from "lucide-react";

export const metadata = {
  title: "My Account",
};

export default function AccountPage() {
  return (
    <div className="bg-ink min-h-screen">
      <div className="bg-surface border-b border-line-dark py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-archivo font-black uppercase text-white text-4xl tracking-tight">My Account</h1>
          <p className="text-white/40 text-sm mt-1">Guest checkout was used — create an account to track orders.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Sign in prompt */}
        <div className="bg-surface rounded-2xl border border-line-dark p-8 text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <User size={24} className="text-white/40" />
          </div>
          <h2 className="font-archivo font-bold uppercase text-white text-xl tracking-tight mb-2">Sign in to your account</h2>
          <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">Create an account to track your orders, save addresses, and get early access to new drops.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-brand text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-brand/90 transition-colors">Sign In</button>
            <button className="border border-line-dark text-white font-medium text-sm px-6 py-2.5 rounded-xl hover:border-white/30 transition-colors">Create Account</button>
          </div>
          <p className="text-xs text-white/20 mt-4">The store is fully usable as a guest — you never need an account.</p>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: <Package size={20} />, title: "Orders", desc: "Track your current and past orders" },
            { icon: <MapPin size={20} />, title: "Addresses", desc: "Save and manage delivery addresses" },
            { icon: <User size={20} />, title: "Profile", desc: "Update your name, email, and preferences" },
          ].map((card) => (
            <div key={card.title} className="bg-surface rounded-xl border border-line-dark p-5 flex flex-col gap-3 opacity-50">
              <span className="text-white/40">{card.icon}</span>
              <div>
                <p className="font-semibold text-sm text-white">{card.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:underline">
            Continue browsing <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
