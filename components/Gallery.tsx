"use client";
import { useRef, useState } from "react";

const IMAGES = Array.from({ length: 12 }, (_, i) => `/gallery/g${i + 1}.webp`);

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const visible = IMAGES.slice(index, index + 4);

  const next = () => {
    if (index + 4 < IMAGES.length) setIndex(index + 4);
  };
  const prev = () => {
    if (index - 4 >= 0) setIndex(index - 4);
  };

  return (
    <section className="py-12 bg-[rgba(183,132,247,0.1)]">
      <div className="max-w-6xl mx-auto px-4 text-center relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Copiii fericiți cu cărțile lor 💜
        </h2>

        <div className="relative flex justify-center">
          <button
            onClick={prev}
            disabled={index === 0}
            className="snap-arrow left"
          >
            ‹
          </button>

          <div
            ref={ref}
            className="flex gap-4 overflow-hidden justify-center"
            style={{ scrollBehavior: "smooth" }}
          >
            {visible.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Copil cu cartea ${i + 1}`}
                className="h-64 w-48 object-cover rounded-2xl border border-gray-200 shadow-sm"
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={index + 4 >= IMAGES.length}
            className="snap-arrow right"
          >
            ›
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Pagina {Math.floor(index / 4) + 1} din {Math.ceil(IMAGES.length / 4)}
        </div>
      </div>
    </section>
  );
}
