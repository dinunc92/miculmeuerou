"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  large?: boolean;
  auto?: boolean;
  speed?: number;
  intervalMs?: number;
};

export default function SnapScroller({
  children,
  large = false,
  auto = true,
  speed = 2,
  intervalMs = 16,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timer = useRef<any>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.scrollLeft <= 2;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setAtStart(start);
    setAtEnd(end);
    if (auto && (end || start)) setDir(end ? -1 : 1); // schimbă direcția
  };

  const scrollByPx = (px: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: px, behavior: "smooth" });
  };

  const startAuto = () => {
    if (!auto) return;
    if (timer.current) return;
    timer.current = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      el.scrollBy({ left: speed * dir, behavior: "auto" });
      updateEdges();
    }, intervalMs);
  };

  const stopAuto = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    updateEdges();
    return () => {
      el.removeEventListener("scroll", updateEdges);
      stopAuto();
    };
  }, []);

  return (
    <div className={`relative ${large ? "snap-lg" : ""}`}>
      <button
        type="button"
        className={`snap-arrow left ${atStart ? "disabled" : ""}`}
        onClick={() => scrollByPx(-300)}
        aria-label="Derulează la stânga"
      >
        ‹
      </button>

      <div
        ref={ref}
        className="snap-gallery"
        onMouseEnter={startAuto}
        onMouseLeave={stopAuto}
        onTouchStart={stopAuto}
      >
        {children}
      </div>

      <button
        type="button"
        className={`snap-arrow right ${atEnd ? "disabled" : ""}`}
        onClick={() => scrollByPx(300)}
        aria-label="Derulează la dreapta"
      >
        ›
      </button>
    </div>
  );
}
