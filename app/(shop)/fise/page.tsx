// app/(shop)/fise/page.tsx
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata = {
  title: "Fișe educative personalizate • Micul Meu Erou",
};

export default function FisePage() {
  const items = products.filter((p) => p.type === "fise");
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Fișe educative</h1>
      <p className="text-gray-700 mb-6">
        Introdu numele copilului, iar fișele vor fi personalizate în PDF. Livrare <b>instant pe email</b>.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} p={p as any} />
        ))}
      </div>
    </main>
  );
}
