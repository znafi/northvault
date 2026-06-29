"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-paper min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h1 className="font-archivo font-black uppercase text-ink text-2xl tracking-tight mb-2">
            Message sent!
          </h1>
          <p className="text-muted-fg text-sm">
            We typically reply within 1–2 business days. Check your inbox at{" "}
            <strong>{form.email}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const inputCls = (err?: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
      err ? "border-brand" : "border-line-light focus:border-brand"
    }`;

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-archivo font-black uppercase text-white text-4xl sm:text-5xl tracking-tight">
            Contact Us
          </h1>
          <p className="text-white/50 text-sm mt-2">
            We reply within 1–2 business days.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-[1fr_280px] gap-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls(errors.name)}
                />
                {errors.name && <p className="text-xs text-brand mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputCls(errors.email)}
                />
                {errors.email && <p className="text-xs text-brand mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink block mb-1">
                Order number (optional)
              </label>
              <input
                type="text"
                value={form.orderNumber}
                onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
                placeholder="NV-XXXXXX"
                className={inputCls()}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink block mb-1">
                Message *
              </label>
              <textarea
                rows={6}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className={inputCls(errors.message)}
                placeholder="How can we help?"
              />
              {errors.message && <p className="text-xs text-brand mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-brand text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={16} /> Send Message</>
              )}
            </button>
          </form>

          <aside className="space-y-5">
            <div className="bg-white rounded-xl border border-line-light p-5 text-sm space-y-2">
              <p className="font-semibold text-ink">Support hours</p>
              <p className="text-muted-fg">Mon–Fri, 9am–5pm ET</p>
              <p className="text-muted-fg">We reply within 1–2 business days.</p>
            </div>
            <div className="bg-white rounded-xl border border-line-light p-5 text-sm">
              <p className="font-semibold text-ink mb-2">Before you write</p>
              <ul className="space-y-1.5 text-muted-fg">
                <li>→ <a href="/faq" className="text-brand hover:underline">Check our FAQ</a></li>
                <li>→ <a href="/shipping-returns" className="text-brand hover:underline">Shipping & Returns</a></li>
                <li>→ <a href="/size-guide" className="text-brand hover:underline">Size Guide</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
