"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  images: string[];             // sursele imaginilor
  height?: number;              // înălțime slide (default 210)
  slideWidth?: number;          // lățime slide (default 150)
  rounded?: boolean;            // colțuri rotunjite
  className?: string;           // extra clase container
  ariaLabel?: string;           // accesibilitate
  /** cum încape imaginea în slide: "cover" sau "contain" */
  aspect?: "cover" | "contain"; // default "cover"
};

export default function Carousel({
  images,
  height = 210,
  slideWidth = 150,
  rounded = true,
  className,
  ariaLabel = "Galerie imagini",
  aspect = "cover",
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const slides = useMemo(() => images.filter(Boolean), [images]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setAtStart(scrollLeft <= 2);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [slides.length]);

  const scrollBy = (dir: "left" | "right") => {
    const el = wrapRef.current;
    if (!el) return;
    const delta = dir === "left" ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") scrollBy("left");
    if (e.key === "ArrowRight") scrollBy("right");
  };

  return (
    <div className={clsx("relative", className)} onKeyDown={onKey} aria-label={ariaLabel}>
      <div ref={wrapRef} className="snap-gallery" style={{ scrollSnapType: "x mandatory" }}>
        {slides.map((src, i) => (
          <div
            key={i}
            className="snap-slide"
            style={{
              width: `${slideWidth}px`,
              borderRadius: rounded ? "0.75rem" : 0,
            }}
          >
            <img
              src={src}
              alt={`prev ${i + 1}`}
              className="snap-img"
              style={{
                height: `${height}px`,
                objectFit: aspect,
                background: aspect === "contain" ? "#fff" : undefined,
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className={clsx("snap-arrow left", atStart && "disabled")}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollBy("left"); }}
        aria-label="precedent"
      >
        ‹
      </button>
      <button
        type="button"
        className={clsx("snap-arrow right", atEnd && "disabled")}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollBy("right"); }}
        aria-label="următor"
      >
        ›
      </button>
    </div>
  );
}
