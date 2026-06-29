"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: string[];
  alt: string;
}

export function Gallery({ images, alt }: GalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "flex-shrink-0 w-16 h-20 sm:w-14 sm:h-[72px] rounded-lg overflow-hidden border-2 transition-all",
              active === i ? "border-brand" : "border-line-dark hover:border-white/30"
            )}
            aria-label={`View image ${i + 1}`}
          >
            <div className="relative w-full h-full bg-white/5">
              <Image src={src} alt={`${alt} — view ${i + 1}`} fill className="object-cover" sizes="64px" />
            </div>
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-[3/4] bg-white/5 rounded-xl overflow-hidden group cursor-zoom-in border border-line-dark">
        <Image
          src={images[active]}
          alt={`${alt} — main view`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
