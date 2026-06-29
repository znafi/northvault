"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";

function formatCAD(n: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);
}

export function OrderSuccessClient() {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? `NV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const demo = params.get("demo") === "1";
  const email = params.get("email") ?? "your email";
  const total = parseFloat(params.get("total") ?? "0");

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-success" />
        </div>

        <p className="text-gold font-archivo font-bold uppercase tracking-[0.2em] text-xs mb-3">
          {demo ? "Demo Order" : "Order Confirmed"}
        </p>
        <h1 className="font-archivo font-black uppercase text-ink text-3xl sm:text-4xl tracking-tight leading-tight mb-3">
          YOU&apos;RE ALL SET!
        </h1>
        <p className="text-muted-fg text-base leading-relaxed mb-2">
          {demo
            ? "This was a demo order — no real payment was processed."
            : "Your order is confirmed and being prepared."}
        </p>
        <p className="text-muted-fg text-sm">
          A confirmation email has been sent to{" "}
          <strong className="text-ink">{email}</strong>.
        </p>

        {/* Order details card */}
        <div className="mt-8 bg-white rounded-2xl border border-line-light p-6 text-left space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-fg">Order number</p>
              <p className="font-archivo font-black text-ink text-xl tracking-wide">
                {orderId}
              </p>
            </div>
            {total > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-fg">Total charged</p>
                <p className="font-bold text-ink text-xl tabular-nums">
                  {formatCAD(total)}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-line-light pt-4 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-success" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">Processing</p>
                <p className="text-xs text-muted-fg">Your order is being prepared</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Truck size={16} className="text-muted-fg" />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">Shipping ETA</p>
                <p className="text-xs text-muted-fg">5–8 business days</p>
              </div>
            </div>
          </div>

          <div className="border-t border-line-light pt-4">
            <p className="text-xs text-muted-fg">
              Track your order via the email we sent, or contact us at{" "}
              <Link href="/contact" className="text-brand hover:underline">
                our support page
              </Link>
              .
            </p>
          </div>
        </div>

        {/* What's next */}
        <div className="mt-8 bg-ink rounded-2xl p-6 text-left">
          <p className="font-archivo font-bold uppercase text-white tracking-wide text-xs mb-3">
            What&apos;s next?
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              Order confirmation sent to your email
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              Ships from Canada — no duties for Canadian addresses
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              Tracking link emailed when dispatched
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brand text-white font-archivo font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-xl hover:bg-brand/90 transition-colors"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 border border-line-light text-ink font-archivo font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-xl hover:border-brand hover:text-brand transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
