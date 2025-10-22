import { bySlug } from "@/data/products";
import PersonalizationForm from "@/components/PersonalizationForm";
import { displayTitleFromPlaceholder } from "@/utils/title";

export default function Page({ params }:{params:{type:"fise"|"carte"; slug:string}}){
  const product = bySlug(params.slug);
  const shown = displayTitleFromPlaceholder(product?.title, "Edy");

  if(!product) return <div className="p-10">Produs indisponibil.</div>;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Personalizează: {shown}</h1>
      <p className="text-gray-600 mb-6">Completează pașii de mai jos. Apoi vezi preview-ul și adaugă în coș.</p>
      {/* @ts-expect-error server-to-client props simplified */}
      <PersonalizationForm product={product}/>
    </div>
  );
}
