// app/carti/page.tsx
import Link from "next/link";
import Image from "next/image";
import { products, byType } from "@/data/products";
import { displayTitleFromPlaceholder } from "@/utils/title";

export const metadata = {
  title: "Cărți personalizate | MiculMeuErou",
};

export default function CartiPage() {
  const items = byType("carte");
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Cărți personalizate</h1>
      <p className="text-gray-700 mb-4">
        Alege o poveste și personalizeaz-o cu numele copilului și cu personajul ales.
      </p>
      <p className="text-gray-700 mb-2">
        Poți primi varianta PDF (instant după plată) sau, opțional, varianta tipărită (5–7 zile).
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((p) => {
          const shown = displayTitleFromPlaceholder(p.title, "Edy");
          return (
            <Link key={p.id} href={`/product/${p.slug}`} className="group block card p-4 hover:shadow-lg transition">
              <Image
                src={p.image}
                alt={shown}
                width={360}
                height={240}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <h3 className="font-semibold text-gray-800 group-hover:text-[var(--brand-turquoise)]">
                {shown}
              </h3>
              <div className="price mt-1 text-lg">{p.priceRON} RON</div>
              {!!p.benefits?.length && (
                <ul className="mt-2 text-xs text-gray-600 list-disc pl-5 space-y-1">
                  {p.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              )}
              <span className="btn-cta mt-3 inline-block">Vezi detalii</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        <Link href="/creeaza-carte" className="btn-cta">Sau… Creează-ți cartea din fotografie</Link>
      </div>
    </div>
  );
}
