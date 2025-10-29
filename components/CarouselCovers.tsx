// components/CarouselCovers.tsx
"use client";
import { useRef, useState, useEffect } from "react";

export type CoverItem = {
  id: string;
  title: string;
  cover: string;
  previews?: string[];
};

type Props = {
  items: CoverItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  height?: number;
  cardWidth?: number;
};

export default function CarouselCovers({
  items,
  selectedId,
  onSelect,
  height = 240,
  cardWidth = 160,
}: Props) {
  const rail = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);

  const check = () => {
    const el = rail.current;
    if (!el) return;
    setCanL(el.scrollLeft > 0);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollBy = (dx: number) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  useEffect(() => {
    check();
    const el = rail.current;
    if (!el) return;
    el.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div className="relative">
      {canL && (
        <button
          className="snap-arrow left"
          onClick={() => scrollBy(-cardWidth * 2)}
          aria-label="Stânga"
        >
          ‹
        </button>
      )}
      {canR && (
        <button
          className="snap-arrow right"
          onClick={() => scrollBy(cardWidth * 2)}
          aria-label="Dreapta"
        >
          ›
        </button>
      )}

      <div
        ref={rail}
        className="flex gap-3 overflow-x-auto scroll-smooth py-2 px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect?.(c.id)}
            className={`flex-none border rounded-xl overflow-hidden shadow-sm transition relative ${
              c.id === selectedId
                ? "ring-4 ring-[var(--brand-lilac)] scale-[1.03]"
                : "hover:ring-2 hover:ring-[var(--brand-turquoise)]"
            }`}
            style={{
              width: cardWidth,
              height,
              scrollSnapAlign: "start",
            }}
            type="button"
          >
            <img
              src={c.cover}
              alt={c.title}
              className="w-full h-full object-contain rounded-20xl"
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-1 px-2 line-clamp-2">
              {c.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
