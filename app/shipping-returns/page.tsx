import Link from "next/link";
import { Truck, RotateCcw, Shield, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns",
  description: "Everything you need to know about shipping and returns at Northvault.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="bg-ink min-h-screen">
      <div className="bg-surface border-b border-line-dark py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-archivo font-black uppercase text-white text-4xl sm:text-5xl tracking-tight">
            Shipping & Returns
          </h1>
          <p className="text-white/40 text-sm mt-2">Ships from Canada. No surprise duties.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Shipping */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Truck size={20} className="text-brand" />
            <h2 className="font-archivo font-bold uppercase text-white text-xl tracking-tight">Shipping</h2>
          </div>
          <div className="bg-surface rounded-xl border border-line-dark overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-line-dark">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-white">Method</th>
                  <th className="text-left px-5 py-3 font-semibold text-white">Delivery time</th>
                  <th className="text-left px-5 py-3 font-semibold text-white">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-dark">
                <tr>
                  <td className="px-5 py-4 font-medium text-white">Standard</td>
                  <td className="px-5 py-4 text-white/40">5–8 business days</td>
                  <td className="px-5 py-4">
                    <span className="text-success font-semibold">Free</span>{" "}
                    <span className="text-white/40">on orders over $150</span>
                    <br />
                    <span className="tabular-nums text-white">$14.99</span>{" "}
                    <span className="text-white/40">otherwise</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-medium text-white">Express</td>
                  <td className="px-5 py-4 text-white/40">2–3 business days</td>
                  <td className="px-5 py-4 tabular-nums text-white">$24.99</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-2 text-sm text-white/40">
            <p>🇨🇦 All orders ship from within Canada. Canadian customers pay no import duties or surprise customs fees.</p>
            <p>Orders placed before 12pm ET on business days typically ship the same day. Delivery times are estimates and may vary.</p>
          </div>
        </section>

        {/* Returns */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RotateCcw size={20} className="text-brand" />
            <h2 className="font-archivo font-bold uppercase text-white text-xl tracking-tight">Returns</h2>
          </div>
          <div className="bg-surface rounded-xl border border-line-dark p-5 space-y-4 text-sm text-white/50 leading-relaxed">
            <p>We accept returns within <strong className="text-white">30 days</strong> of delivery on unworn, unaltered jerseys with original tags attached.</p>
            <p>
              To start a return, contact us via our{" "}
              <Link href="/contact" className="text-brand hover:underline">support page</Link>{" "}
              with your order number. We&apos;ll provide a prepaid Canada Post return label.
            </p>
            <p>Refunds are issued to your original payment method within 3–5 business days of receiving the return.</p>
          </div>
        </section>

        {/* Personalized final sale */}
        <section>
          <div className="flex items-start gap-3 bg-brand/5 border border-brand/20 rounded-xl p-5">
            <AlertCircle size={18} className="text-brand mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-white mb-1">Personalized jerseys are final sale</p>
              <p className="text-white/50">Jerseys with custom name and number printing cannot be returned or exchanged, as they are made to order. Please double-check your name/number before placing your order.</p>
            </div>
          </div>
        </section>

        {/* Authenticity */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-brand" />
            <h2 className="font-archivo font-bold uppercase text-white text-xl tracking-tight">Authenticity & labeling</h2>
          </div>
          <div className="bg-surface rounded-xl border border-line-dark p-5 text-sm text-white/50 leading-relaxed">
            <p>Every jersey in our collection is clearly labeled. We tell you exactly the grade, maker, and origin of every product. We never misrepresent product quality. If you have a question about a specific item, reach out before ordering.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
