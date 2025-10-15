// carti/page.tsx
import { byType } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Page(){ const list=byType("carte");
  return (<div className="mx-auto max-w-6xl px-4 py-10">
    <h1 className="text-3xl font-bold mb-6">Cărți personalizate</h1>
    <div className="grid md:grid-cols-3 gap-6">{list.map(p=> <ProductCard key={p.id} p={p}/>)}</div>
  </div>);
}
