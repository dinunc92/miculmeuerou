import Link from "next/link";

type P = {
  id: string; slug: string; title: string; image: string; priceRON: number; benefits?: string[];
};

export default function ProductCard({ p }: { p: P }) {
  return (
    <Link href={`/product/${p.slug}`} className="group block card p-4 hover:shadow-lg transition text-center">
      <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded-xl mb-3" />
      <h3 className="font-semibold text-gray-800 group-hover:text-[var(--brand-turquoise,#1fb8b7)]">{p.title}</h3>
      <div className="price mt-1 text-lg font-bold">{p.priceRON} RON</div>
      {!!p.benefits?.length && (
        <ul className="mt-2 text-xs text-gray-600 list-disc pl-5 space-y-1 text-left">
          {p.benefits.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
      <span className="btn-cta mt-3 inline-block">Vezi detalii</span>
    </Link>
  );
}
