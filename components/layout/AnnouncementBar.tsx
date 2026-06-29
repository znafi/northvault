"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const TARGET_DATE = new Date("2026-06-11T00:00:00");

function getCountdown(): string {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();
  if (diff <= 0) return "World Cup 2026 is here!";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} days until World Cup 2026 kicks off — shop the kits now`;
}

const messages = [
  "Free shipping across Canada on orders over $150",
  "Ships from Canada — no surprise duties or import fees",
  getCountdown(),
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const [countdown, setCountdown] = useState(getCountdown());

  useEffect(() => {
    const dismissed = sessionStorage.getItem("nv-announcement-dismissed");
    if (dismissed) setDismissed(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
      setCountdown(getCountdown());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const currentMessages = [
    "Free shipping across Canada on orders over $150",
    "Ships from Canada — no surprise duties or import fees",
    countdown,
  ];

  return (
    <div className="bg-ink text-white text-xs font-medium py-2 px-4 flex items-center justify-center gap-4 relative">
      <span className="text-center transition-all duration-300">
        {currentMessages[index % currentMessages.length]}
      </span>
      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem("nv-announcement-dismissed", "1");
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
