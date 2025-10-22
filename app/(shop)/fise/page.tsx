// app/fise/page.tsx
import Link from "next/link";
import Image from "next/image";
import { byType } from "@/data/products";
import { displayTitleFromPlaceholder } from "@/utils/title";

export const metadata = {
  title: "Fișe educative | MiculMeuErou",
};

export default function FisePage() {
  const items = byType("fise");
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Fișe educative</h1>
      <p className="text-gray-700 mb-6">
        Fișe colorate în format PDF, personalizate cu numele copilului, grupate pe vârste. Primești fișierele pe email imediat după plată.
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
    </div>
  );
}
