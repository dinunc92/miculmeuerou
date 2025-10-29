// app/(shop)/carti/page.tsx
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata = {
  title: "Cărți cu avatarul copilului • Micul Meu Erou",
};

export default function CartiAvatarPage() {
  const items = products.filter((p) => p.type === "carte");
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Cărți cu avatarul copilului</h1>
      <p className="text-gray-700 mb-6">
        Alege un titlu, selectează trăsăturile avatarului (gen, ochi, coafură) și personalizează cu numele copilului.
        PDF-ul se livrează <b>instant</b>. Varianta tipărită ajunge în <b>5–7 zile</b>.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} p={p as any} />
        ))}
      </div>
    </main>
  );
}
