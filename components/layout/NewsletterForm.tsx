"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-success font-medium text-sm">
        <Check size={16} />
        You&apos;re on the list!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
      <div className="relative flex-1 sm:w-64">
        <Mail
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors"
        />
      </div>
      <button
        type="submit"
        className="bg-brand hover:bg-brand/90 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
