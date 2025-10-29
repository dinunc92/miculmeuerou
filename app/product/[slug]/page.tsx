// app/product/[slug]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { bySlug } from "@/data/products";
import { displayTitleFromPlaceholder } from "@/utils/title";
import PersonalizationForm from "@/components/PersonalizationForm";
import Carousel from "@/components/Carousel";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = bySlug(params.slug);
  const router = useRouter();
  if (!product) return <div className="max-w-4xl mx-auto px-4 py-10">Produs indisponibil.</div>;

  const [namePreview, setNamePreview] = useState("Edy");
  const shownTitle = useMemo(
    () => displayTitleFromPlaceholder(product.title, namePreview || "Edy"),
    [product.title, namePreview]
  );

  const previews = [
    `/previews/${product.slug}/p1.webp`,
    `/previews/${product.slug}/p2.webp`,
    `/previews/${product.slug}/p3.webp`,
    `/previews/${product.slug}/p4.webp`,
  ];
  const images = [product.image, ...previews];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* STÂNGA: Carousel (contain pentru copertă A4) */}
        <div>
          <Carousel images={images} height={520} fit="contain" />
          <div className="mt-3 price text-xl">{product.priceRON} RON</div>

          {/* Insigne ajutătoare */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {product.type === "fise" ? (
              <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                PDF instant
              </span>
            ) : product.type === "carte" ? (
              <>
                <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  PDF instant
                </span>
                <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Tipărit 5–7 zile
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  PDF în 48h
                </span>
                <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Tipărit 5–7 zile
                </span>
              </>
            )}
            {product.pages ? (
              <span className="px-2 py-1 rounded-full bg-white text-gray-700 border border-gray-200">
                {product.pages} pagini
              </span>
            ) : null}
          </div>
        </div>

        {/* DREAPTA: titlu + personalizare */}
        <div>
          <h1 className="text-2xl font-bold">{shownTitle}</h1>
          <p className="text-gray-700 mt-2">{product.description}</p>

          <div className="mt-6">
            {product.type === "fise" ? (
              <PersonalizationForm product={product} mode="fise" onNamePreview={setNamePreview} />
            ) : product.type === "carte" ? (
              <PersonalizationForm product={product} mode="carte" onNamePreview={setNamePreview} />
            ) : (
              <div className="text-sm text-gray-600">
                Pentru „Cărți cu fotografia copilului”, alege titlul și personalizează în pagina dedicată.
              </div>
            )}
          </div>

          <div className="mt-8">
            <button className="btn-cta" onClick={() => router.push("/cart")}>Vezi coșul</button>
          </div>
        </div>
      </div>
    </div>
  );
}
