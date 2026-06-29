"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "Sizing",
    items: [
      { q: "How do I find my size?", a: "Check our Size Guide page for chest and length measurements in both CM and IN. For a relaxed fit, size up one size from your usual match-fit." },
      { q: "Do jerseys run true to size?", a: "Match-fit jerseys are designed to sit close to the body, similar to the fit worn on the pitch. Most customers go up a size for casual wear." },
    ],
  },
  {
    category: "Authenticity",
    items: [
      { q: "Are these jerseys authentic?", a: "Every product on Northvault is clearly labeled with its grade, maker, and origin. We're committed to honest labeling — we never misrepresent what you're buying." },
      { q: "Which brands are carried?", a: "We carry Nike, adidas, and Puma national-team jerseys for World Cup 2026." },
    ],
  },
  {
    category: "Shipping",
    items: [
      { q: "Where do you ship from?", a: "All orders ship from Canada. Canadian customers pay no import duties or surprise customs fees." },
      { q: "How long does shipping take?", a: "Standard shipping: 5–8 business days. Express: 2–3 business days. Free standard shipping on orders over $150 CAD." },
      { q: "Do you ship outside of Canada?", a: "At this time, we ship within Canada only." },
    ],
  },
  {
    category: "Returns",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 30 days of delivery on unworn, unaltered items with original tags. Contact us via the support page to start a return." },
      { q: "Can I return a personalized jersey?", a: "No — jerseys with custom name and number printing are made to order and are final sale. Please check your printing details before placing your order." },
    ],
  },
  {
    category: "Printing",
    items: [
      { q: "How does name and number printing work?", a: "Add it on the product page before adding to cart. Enter your name (up to 12 characters) and number (0–99). The printing fee is $19.99 CAD per item." },
      { q: "Can I change or cancel a printing order?", a: "Printed orders go into production immediately and cannot be changed or cancelled. Please review your details carefully." },
    ],
  },
  {
    category: "Payment",
    items: [
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay, all processed securely via Stripe." },
      { q: "Is checkout secure?", a: "Yes. All payments are encrypted and processed by Stripe. We never store your card details on our servers." },
      { q: "Do you have promo codes?", a: "Yes! Try WC2026 for 10% off your order. Follow us on social or sign up for our newsletter to get early access to new drops and promotions." },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line-dark last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-4 text-left gap-4">
        <span className="font-medium text-sm text-white">{q}</span>
        <ChevronDown size={16} className={cn("text-white/40 flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-4 text-sm text-white/50 leading-relaxed">{a}</div>}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="bg-ink min-h-screen">
      <div className="bg-surface border-b border-line-dark py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-archivo font-black uppercase text-white text-4xl sm:text-5xl tracking-tight">FAQ</h1>
          <p className="text-white/40 text-sm mt-2">Frequently asked questions.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {faqs.map((section) => (
          <section key={section.category}>
            <h2 className="font-archivo font-bold uppercase text-white/30 text-sm tracking-widest mb-3">{section.category}</h2>
            <div className="bg-surface rounded-xl border border-line-dark px-5">
              {section.items.map((item) => <FaqItem key={item.q} {...item} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
