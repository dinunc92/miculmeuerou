// app/creeaza-carte/page.tsx
"use client";

import Link from "next/link";
import Carousel from "@/components/Carousel";
import { COVERS } from "@/components/CreateBookData";

export default function CreeazaCarteListPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Cărți cu fotografia copilului</h1>
        <p className="text-gray-700 mt-2">
          Alege una dintre poveștile noastre și personalizeaz-o cu fotografia și numele copilului.
          <br />
          PDF livrat în maximum <b>48h</b>. Opțional, varianta tipărită se livrează în <b>5–7 zile</b>.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COVERS.map((c) => (
          <div key={c.id} className="card p-3">
            {/* Coperta + preview pagini în același carousel */}
            <Carousel images={[c.src, ...(c.previews || [])]} height={260} />

            <div className="mt-3">
              <h3 className="font-bold text-lg">{c.title}</h3>
              <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  PDF în 48h
                </span>
                <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Tipărit 5–7 zile
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  20 pagini
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="price text-xl">40 RON</div>
                <Link
                  href={`/creeaza-carte/personalize?cover=${encodeURIComponent(c.id)}`}
                  className="btn-cta">
                  Personalizează
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
