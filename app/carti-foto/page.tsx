// app/carti-foto/page.tsx
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata = {
  title: "Cărți cu fotografia copilului | MiculMeuErou",
  description:
    "Alege unul dintre cele 15 titluri și personalizează-l cu fotografia și numele copilului. PDF în 48h, opțional tipărire 5–7 zile.",
};

export default function CartiFotoPage() {
  const items = products.filter((p) => p.type === "carte-custom");

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Cărți cu fotografia copilului</h1>
        <p className="text-gray-700 mt-2">
          Alege titlul preferat, apoi personalizează cu fotografia și numele copilului.
          <br className="hidden sm:block" />
          <span className="text-sm text-gray-600">
            PDF livrat în <b>maximum 48h</b>. Opțional, tipărire și livrare în <b>5–7 zile</b>.
          </span>
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-gray-600">Momentan nu avem titluri în această categorie.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </main>
  );
}
