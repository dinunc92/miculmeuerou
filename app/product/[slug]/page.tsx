"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { products, bySlug } from "@/data/products";
import { displayTitleFromPlaceholder } from "@/utils/title";
import Lightbox from "@/components/Lightbox";
import PersonalizationForm from "@/components/PersonalizationForm";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = bySlug(params.slug);
  const router = useRouter();

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        Produs indisponibil.
      </div>
    );
  }

  // numele copilului doar pentru afișare din formularul de personalizare (fallback Edy)
  const [namePreview, setNamePreview] = useState("Edy");

  const shownTitle = useMemo(
    () => displayTitleFromPlaceholder(product.title, namePreview || "Edy"),
    [product.title, namePreview]
  );

  const [open, setOpen] = useState(false);
  const previews = [
    `/previews/${product.slug}/p1.jpg`,
    `/previews/${product.slug}/p2.jpg`,
    `/previews/${product.slug}/p3.jpg`,
    `/previews/${product.slug}/p4.jpg`,
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* STÂNGA: imagine + info scurtă */}
        <div>
          <Image
            src={product.image}
            alt={product.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover rounded-2xl border"
          />
          <div className="mt-3 price text-xl font-bold">
            {product.priceRON} RON
          </div>

          {/* meta scurtă despre pagini */}
          {typeof product.pages === "number" && (
            <div className="mt-1 text-sm text-gray-600">
              {product.type === "carte" ? (
                <>Cartea are <b>{product.pages}</b> pagini.</>
              ) : product.type === "fise" ? (
                <>Setul include <b>{product.pages}</b> fișe PDF.</>
              ) : (
                <>Cartea personalizată are <b>20</b> pagini și se creează după fotografia trimisă.</>
              )}
            </div>
          )}

          {/* insigne ajutătoare */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {product.type === "fise" && (
              <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                PDF instant
              </span>
            )}

            {product.type === "carte" && (
              <>
                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PDF instant
                </span>
                <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Tipărit 5–7 zile
                </span>
              </>
            )}

            {(product.type === "carte-custom" ||
              product.slug === "creeaza-carte") && (
              <>
                <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  PDF în 48h
                </span>
                <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Tipărit 5–7 zile
                </span>
              </>
            )}
          </div>

          {/* previzualizare 4 pagini */}
          <button className="btn-neutral mt-4" onClick={() => setOpen(true)}>
            Vezi în interior
          </button>
          <Lightbox open={open} onClose={() => setOpen(false)} images={previews} />
        </div>

        {/* DREAPTA: titlu + personalizare */}
        <div>
          <h1 className="text-2xl font-bold">{shownTitle}</h1>
          <p className="text-gray-700 mt-2">{product.description}</p>

          <div className="mt-6">
            {product.type === "fise" ? (
              <PersonalizationForm
                product={product as any}
                mode="fise"
                onNamePreview={setNamePreview}
              />
            ) : (
              <PersonalizationForm
                product={product as any}
                mode="carte"
                onNamePreview={setNamePreview}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
