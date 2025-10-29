// components/Carousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  height?: number;          // px
  slideWidth?: number;      // px (doar pentru carusel mic, dacă vrei)
  fit?: "cover" | "contain"; // cum încape imaginea (default: cover)
};

export default function Carousel({
  images,
  height = 260,
  slideWidth,
  fit = "contain",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(images.length - 1, i + 1));

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const w = slideWidth || el.clientWidth;
    el.scrollTo({ left: index * w, behavior: "smooth" });
  }, [index, slideWidth]);

  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  return (
    <div className="relative">
      {/* track */}
      <div
        ref={trackRef}
        className="overflow-hidden w-full"
        style={{
          height,
          scrollSnapType: "x mandatory",
          display: "flex",
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{
              width: slideWidth ? `${slideWidth}px` : "100%",
              height,
              scrollSnapAlign: "start",
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              background: "#fff",
              border: "1px solid rgba(0,0,0,.06)",
              marginRight: 10,
            }}
          >
            <img
              src={src}
              alt={`img-${i}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: fit,
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        aria-label="Prev"
        className={`snap-arrow left ${!canPrev ? "disabled" : ""}`}
        onClick={prev}
        type="button"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        className={`snap-arrow right ${!canNext ? "disabled" : ""}`}
        onClick={next}
        type="button"
      >
        ›
      </button>
    </div>
  );
}
