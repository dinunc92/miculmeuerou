import Link from "next/link";
import { Product } from "@/data/products";

export default function ProductCard({p}:{p:Product}) {
  return (
    <div className="card hover-pop p-4 flex flex-col">
      <img src={p.image || "/avatar-base.svg"} alt={p.title} className="rounded-xl aspect-[4/3] object-contain"/>
      <h3 className="mt-3 font-semibold">{p.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="font-bold">{p.priceRON} RON</span>
        <Link href={`/(shop)/${p.type}/${p.slug}`} className="btn-cta bg-brand-turquoise text-white">Detalii</Link>
      </div>
    </div>
  );
}
