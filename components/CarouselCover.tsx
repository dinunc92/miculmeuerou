// components/CarouselCover.tsx
"use client";
import { useRef, useState, useEffect } from "react";

type Props = {
  images: string[];
  height?: number; // px
  className?: string;
};

export default function CarouselCover({ images, height = 260, className = "" }: Props) {
  const [idx, setIdx] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  const go = (dir: number) => {
    setIdx((p) => {
      const n = (p + dir + images.length) % images.length;
      return n;
    });
  };

  useEffect(() => {
    // pre-load current
    const img = new Image();
    img.src = images[idx];
  }, [idx]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-black/10 bg-white ${className}`} style={{ height }}>
      <img
        src={images[idx]}
        alt={`preview ${idx + 1}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
      <button
        type="button"
        aria-label="Prev"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(-1); }}
        className="snap-arrow left"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(1); }}
        className="snap-arrow right"
      >
        ›
      </button>

      {/* dots mici */}
      <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-[var(--brand-lilac)]" : "bg-black/20"}`}
          />
        ))}
      </div>
    </div>
  );
}
