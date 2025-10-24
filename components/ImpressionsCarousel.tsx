"use client";
import { useState, useRef } from "react";

const IMAGES = [
  "/impressions/i1.jpg",
  "/impressions/i2.jpg",
  "/impressions/i3.jpg",
  "/impressions/i4.jpg",
  "/impressions/i5.jpg",
];

export default function ImpressionsCarousel() {
  const [idx, setIdx] = useState(0);
  const wrap = (n: number) => (n + IMAGES.length) % IMAGES.length;
  const next = () => setIdx((i) => wrap(i + 1));
  const prev = () => setIdx((i) => wrap(i - 1));

  // swipe
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    startX.current = null;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Impresii din comunitate</h2>
      <div className="relative select-none" style={{ height: 420 }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm h-full">
          <div
            className="h-full w-full flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${-idx * 100}%)` }}
          >
            {IMAGES.map((src, i) => (
              <div key={i} className="min-w-full h-full grid place-items-center p-3">
                <img
                  src={src}
                  alt={`impresie-${i + 1}`}
                  className="block object-contain h-full w-auto"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="prev"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[var(--brand-dark)] border border-gray-200 shadow"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="next"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[var(--brand-dark)] border border-gray-200 shadow"
        >
          ›
        </button>

        <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5">
          {IMAGES.map((_, i) => (
            <span
              key={i}
              onClick={() => setIdx(i)}
              className={`inline-block h-1.5 rounded-full cursor-pointer transition-all ${
                i === idx ? "w-5 bg-[var(--brand-lilac)]" : "w-2 bg-black/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
