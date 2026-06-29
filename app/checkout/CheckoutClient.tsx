"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, Shield, ChevronDown, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getCountryFlag, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, EXPRESS_SHIPPING, TAX_RATE } from "@/lib/data";

function formatCAD(n: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);
}

const provinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon",
];

function validatePostal(code: string) {
  return /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(code.trim());
}
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface FormState {
  email: string; smsOptIn: boolean; fullName: string; address1: string;
  address2: string; city: string; province: string; postalCode: string;
  phone: string; shippingMethod: "standard" | "express";
  cardNumber: string; cardExpiry: string; cardCvc: string; cardName: string;
}

const initialForm: FormState = {
  email: "", smsOptIn: false, fullName: "", address1: "", address2: "",
  city: "", province: "", postalCode: "", phone: "", shippingMethod: "standard",
  cardNumber: "", cardExpiry: "", cardCvc: "", cardName: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

export function CheckoutClient() {
  const { state, subtotal, discount, total, clear } = useCart();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const hasStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const shippingCost =
    subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0
    : form.shippingMethod === "express" ? EXPRESS_SHIPPING : STANDARD_SHIPPING;
  const tax2 = (subtotal - discount) * TAX_RATE;
  const total2 = subtotal - discount + shippingCost + tax2;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!validateEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.address1.trim()) e.address1 = "Address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.province) e.province = "Select a province.";
    if (!validatePostal(form.postalCode)) e.postalCode = "Enter a valid Canadian postal code (e.g. A1A 1A1).";
    if (!hasStripe) {
      if (!form.cardNumber.replace(/\s/g, "")) e.cardNumber = "Card number is required.";
      if (!form.cardExpiry) e.cardExpiry = "Expiry is required.";
      if (!form.cardCvc) e.cardCvc = "CVC is required.";
      if (!form.cardName.trim()) e.cardName = "Name on card is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: state.lines, promoCode: state.promoCode, shippingMethod: form.shippingMethod, email: form.email }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        clear();
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("No redirect URL returned");
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (state.lines.length === 0) {
    return (
      <div className="bg-ink min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-archivo font-bold text-white uppercase text-xl mb-3">Your cart is empty</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand/90 transition-colors">Shop Jerseys</Link>
        </div>
      </div>
    );
  }

  function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
    return (
      <div>
        <label htmlFor={id} className="block text-xs font-semibold text-white/70 mb-1">{label}</label>
        {children}
        {error && <p className="text-xs text-brand mt-1 flex items-center gap-1"><AlertCircle size={11} /> {error}</p>}
      </div>
    );
  }

  const inputCls = (error?: string) =>
    `w-full bg-white/5 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors border ${
      error ? "border-brand focus:border-brand" : "border-white/10 focus:border-brand"
    }`;

  return (
    <div className="bg-ink min-h-screen">
      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/cart" className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-sm">
              <ArrowLeft size={15} /> Cart
            </Link>
            <span className="text-white/20">/</span>
            <span className="font-semibold text-white text-sm">Checkout</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            {/* Form */}
            <div className="space-y-8">
              {/* 1. Contact */}
              <section>
                <h2 className="font-archivo font-black uppercase text-white text-lg tracking-tight mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">1</span>
                  Contact
                </h2>
                <div className="bg-surface rounded-xl border border-line-dark p-5 space-y-4">
                  <Field label="Email address *" id="email" error={errors.email}>
                    <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls(errors.email)} placeholder="you@example.com" />
                  </Field>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.smsOptIn} onChange={(e) => set("smsOptIn", e.target.checked)} className="accent-brand" />
                    <span className="text-sm text-white/40">Text me shipping updates (optional)</span>
                  </label>
                </div>
              </section>

              {/* 2. Shipping address */}
              <section>
                <h2 className="font-archivo font-black uppercase text-white text-lg tracking-tight mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">2</span>
                  Shipping Address
                </h2>
                <div className="bg-surface rounded-xl border border-line-dark p-5 space-y-4">
                  <p className="text-xs text-white/40">🇨🇦 Ships within Canada only.</p>
                  <Field label="Full name *" id="fullName" error={errors.fullName}>
                    <input id="fullName" type="text" autoComplete="name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls(errors.fullName)} />
                  </Field>
                  <Field label="Address line 1 *" id="address1" error={errors.address1}>
                    <input id="address1" type="text" autoComplete="address-line1" value={form.address1} onChange={(e) => set("address1", e.target.value)} className={inputCls(errors.address1)} placeholder="123 Main St" />
                  </Field>
                  <Field label="Address line 2" id="address2">
                    <input id="address2" type="text" autoComplete="address-line2" value={form.address2} onChange={(e) => set("address2", e.target.value)} className={inputCls()} placeholder="Apt, suite, etc. (optional)" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City *" id="city" error={errors.city}>
                      <input id="city" type="text" autoComplete="address-level2" value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls(errors.city)} />
                    </Field>
                    <Field label="Province *" id="province" error={errors.province}>
                      <div className="relative">
                        <select id="province" value={form.province} onChange={(e) => set("province", e.target.value)} className={`appearance-none pr-8 ${inputCls(errors.province)}`}>
                          <option value="">Select...</option>
                          {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                      </div>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Postal code *" id="postalCode" error={errors.postalCode}>
                      <input id="postalCode" type="text" autoComplete="postal-code" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value.toUpperCase())} placeholder="A1A 1A1" className={inputCls(errors.postalCode)} />
                    </Field>
                    <Field label="Phone" id="phone">
                      <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls()} placeholder="(optional)" />
                    </Field>
                  </div>
                </div>
              </section>

              {/* 3. Shipping method */}
              <section>
                <h2 className="font-archivo font-black uppercase text-white text-lg tracking-tight mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">3</span>
                  Shipping Method
                </h2>
                <div className="space-y-2">
                  {[
                    { id: "standard", label: "Standard", desc: "5–8 business days", price: subtotal - discount >= FREE_SHIPPING_THRESHOLD ? "Free" : formatCAD(STANDARD_SHIPPING) },
                    { id: "express", label: "Express", desc: "2–3 business days", price: formatCAD(EXPRESS_SHIPPING) },
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center justify-between gap-4 bg-surface border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      form.shippingMethod === opt.id ? "border-brand bg-brand/5" : "border-line-dark hover:border-white/20"
                    }`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value={opt.id} checked={form.shippingMethod === opt.id} onChange={() => set("shippingMethod", opt.id as "standard" | "express")} className="accent-brand" />
                        <div>
                          <p className="font-semibold text-sm text-white">{opt.label}</p>
                          <p className="text-xs text-white/40">{opt.desc}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-white tabular-nums">{opt.price}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* 4. Payment */}
              <section>
                <h2 className="font-archivo font-black uppercase text-white text-lg tracking-tight mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">4</span>
                  Payment
                </h2>

                {!hasStripe && (
                  <div className="mb-3 bg-gold/10 border border-gold/30 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle size={15} className="text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gold/90"><strong>Demo mode</strong> — no real payment processed. Add your Stripe keys to enable real payments. Enter any card details to proceed.</p>
                  </div>
                )}

                <div className="bg-surface rounded-xl border border-line-dark p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Lock size={12} /> <span>Encrypted and secure</span>
                  </div>
                  <Field label="Card number *" id="cardNumber" error={errors.cardNumber}>
                    <input id="cardNumber" type="text" inputMode="numeric" value={form.cardNumber} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 16); set("cardNumber", v.replace(/(\d{4})/g, "$1 ").trim()); }} placeholder="1234 5678 9012 3456" className={inputCls(errors.cardNumber)} />
                  </Field>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Expiry *" id="cardExpiry" error={errors.cardExpiry}>
                      <input id="cardExpiry" type="text" value={form.cardExpiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); set("cardExpiry", v); }} placeholder="MM/YY" className={inputCls(errors.cardExpiry)} />
                    </Field>
                    <Field label="CVC *" id="cardCvc" error={errors.cardCvc}>
                      <input id="cardCvc" type="text" inputMode="numeric" value={form.cardCvc} onChange={(e) => set("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" className={inputCls(errors.cardCvc)} />
                    </Field>
                    <Field label="Name on card *" id="cardName" error={errors.cardName}>
                      <input id="cardName" type="text" value={form.cardName} onChange={(e) => set("cardName", e.target.value)} className={inputCls(errors.cardName)} />
                    </Field>
                  </div>
                  <div className="flex gap-2 text-xs text-white/30">
                    <Shield size={12} className="mt-0.5 flex-shrink-0" />
                    <span>Your payment info is never stored on our servers. Processed securely via Stripe.</span>
                  </div>
                </div>
              </section>

              {submitError && (
                <div className="flex items-center gap-2 text-brand text-sm bg-brand/10 border border-brand/20 rounded-xl px-4 py-3">
                  <AlertCircle size={16} /> {submitError}
                </div>
              )}

              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-brand text-white font-archivo font-black uppercase tracking-wide text-sm py-4 rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px]">
                {submitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <><Lock size={16} /> Place Order — {formatCAD(total2)}</>}
              </button>
            </div>

            {/* Order summary sidebar */}
            <aside>
              <div className="bg-surface rounded-xl border border-line-dark p-5 sticky top-24 space-y-4">
                <h3 className="font-archivo font-bold uppercase text-white tracking-tight text-sm">Order Summary</h3>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {state.lines.map((line) => (
                    <div key={`${line.jerseyId}:${line.size}:${JSON.stringify(line.printing ?? null)}`} className="flex gap-3">
                      <div className="relative w-14 h-16 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden border border-line-dark">
                        <Image src={line.image} alt={line.name} fill className="object-cover" sizes="56px" />
                        <span className="absolute -top-1 -right-1 bg-brand text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">{line.qty}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-white/40">{getCountryFlag(line.countryCode)} {line.size}</p>
                        <p className="text-xs font-medium text-white leading-tight line-clamp-2">{line.name}</p>
                        {line.printing && <p className="text-[10px] text-gold mt-0.5">Print: {line.printing.name} #{line.printing.number}</p>}
                      </div>
                      <p className="text-xs font-semibold text-white tabular-nums flex-shrink-0">{formatCAD((line.unitPrice + (line.printing?.fee ?? 0)) * line.qty)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line-dark pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Subtotal</span><span className="tabular-nums text-white">{formatCAD(subtotal)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Promo ({state.promoCode})</span><span className="tabular-nums">-{formatCAD(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span className="text-white/40">Shipping</span><span className="tabular-nums text-white">{shippingCost === 0 ? <span className="text-success">Free</span> : formatCAD(shippingCost)}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Tax (GST 5%)</span><span className="tabular-nums text-white">{formatCAD(tax2)}</span></div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-line-dark text-base">
                    <span>Total</span><span className="tabular-nums">{formatCAD(total2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs text-white/30">
                  <div className="flex items-center gap-1.5"><CheckCircle size={11} className="text-success" /> Free shipping on orders over $150</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={11} className="text-success" /> Ships from Canada — no duties</div>
                  <div className="flex items-center gap-1.5"><CheckCircle size={11} className="text-success" /> 30-day returns on non-personalized items</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </form>
    </div>
  );
}
