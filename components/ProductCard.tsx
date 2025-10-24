// components/ProductCard.tsx
"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { displayTitleFromPlaceholder } from "@/utils/title";
import CarouselCover from "./CarouselCover";

type P = {
  id: string;
  slug: string;
  type: "fise" | "carte" | "carte-custom";
  title: string;
  image: string;          // cover principal
  priceRON: number;
};

export default function ProductCard({ p }: { p: P }) {
  const shown = useMemo(() => displayTitleFromPlaceholder(p.title, "Edy"), [p.title]);
  const previews = [
    `/previews/${p.slug}/p1.jpg`,
    `/previews/${p.slug}/p2.jpg`,
    `/previews/${p.slug}/p3.jpg`,
    `/previews/${p.slug}/p4.jpg`,
  ];

  return (
    <div className="card p-3">
      {/* Carusel pe cover (nu schimbă pagina la click pe săgeți) */}
      <Link href={`/product/${p.slug}`} className="block no-underline">
        <CarouselCover images={[p.image, ...previews]} height={300} />
      </Link>

      <div className="pt-3">
        <div className="font-bold">{shown}</div>
        <div className="price mt-1">{p.priceRON} RON</div>

        <div className="mt-3 flex items-center gap-2">
          <Link href={`/product/${p.slug}`} className="btn-outline">
            Vezi detalii
          </Link>
        </div>
      </div>
    </div>
  );
}
