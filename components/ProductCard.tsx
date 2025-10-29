"use client";

import Link from "next/link";
import { displayTitleFromPlaceholder } from "@/utils/title";
import Carousel from "@/components/Carousel";

type Product = {
  id: string;
  slug: string;
  type: "fise" | "carte" | "carte-custom";
  title: string;
  image: string;
  priceRON: number;
  pages?: number;
  description?: string;
};

export default function ProductCard({ p }: { p: Product }) {
  // titlu de afișare cu „Edy” by default
  const shownTitle = displayTitleFromPlaceholder(p.title, "Edy");

  // copertă + 4 previews
  const previews = [
    `/previews/${p.slug}/p1.webp`,
    `/previews/${p.slug}/p2.webp`,
    `/previews/${p.slug}/p3.webp`,
    `/previews/${p.slug}/p4.webp`,
  ];
  const images = [p.image, ...previews];

  const href =
    p.type === "carte-custom"
      ? `/creeaza-carte/personalize?cover=${encodeURIComponent(p.id)}`
      : `/product/${p.slug}`;

  return (
    <div className="card p-3">
      <div className="relative">
        <Carousel images={images} height={260} />
      </div>

      <div className="mt-3">
        <div className="font-bold">{shownTitle}</div>
        {p.pages ? <div className="text-xs text-gray-600">{p.pages} pagini</div> : null}
        <div className="price text-lg mt-1">{p.priceRON} RON</div>

        <div className="mt-2">
          <Link href={href} className="btn-outline">
            Personalizează
          </Link>
        </div>
      </div>
    </div>
  );
}
