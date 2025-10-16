import Link from "next/link";
import { displayTitleFromPlaceholder } from "@/utils/title";

export default function ProductCard({ p }:{ p: any }){
  const shown = p.titleWeb || displayTitleFromPlaceholder(p.title, "Edy");
  return (
    <Link href={`/${p.type === "fise" ? "fise" : "carti"}/${p.slug}`} className="card p-4 link-strong block">
      <img src={p.image} alt="" className="w-full rounded-xl mb-3" />
      <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
        <span className="icon-sm">{p.type === "fise" ? "📄" : "📚"}</span>
        <span>{p.type === "fise" ? "Fișe" : "Carte"}</span>
      </div>
      <div className="font-semibold">{shown}</div>
      <div className="text-brand mt-1">{p.priceRON} RON</div>
    </Link>
  );
}
