import { bySlug } from "@/data/products";
import Link from "next/link";

export default function Page({ params }:{params:{slug:string}}){
  const product = bySlug(params.slug);
  if(!product) return <div className="p-10">Produs indisponibil.</div>;
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 grid md:grid-cols-2 gap-8">
      <img src={product.image||"/avatar-base.svg"} className="rounded-2xl shadow-soft"/>
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="mt-2 text-gray-700">{product.description}</p>
        <div className="mt-6 flex items-center gap-4">
          <span className="text-2xl font-bold">{product.priceRON} RON</span>
          <Link href={`/personalize/${product.type}/${product.slug}`} className="btn-cta bg-brand-lilac text-white">Personalizează</Link>
        </div>
      </div>
    </div>
  );
}
