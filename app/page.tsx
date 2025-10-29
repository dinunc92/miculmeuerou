// app/page.tsx
import Image from "next/image";
import Reviews from "@/components/Reviews";
import Gallery  from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const fise       = products.filter((p) => p.type === "fise");
const cartiAvatar= products.filter((p) => p.type === "carte");
const cartiFoto  = products.filter((p) => p.type === "carte-custom");

export default function HomePage() {
  const fise3       = fise.slice(0, 3);
  const carti3      = cartiAvatar.slice(0, 3);
  const cartiFoto3  = cartiFoto.slice(0, 3);

  return (
    <main>
      {/* HERO */}
      <section
        className="relative text-white py-20 md:py-28 overflow-hidden"
        style={{
          backgroundImage: "url('/hero-cover.png')", // imaginea ta full-width
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/0"></div> {/* overlay subtil */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold mb-2">
              Copilul tău devine eroul propriei povești!
            </h1>
            <p className="text-lg font-light mb-8">
              Creează fișe educative și cărți personalizate cu avatarul sau fotografia copilului tău.
            </p>
            <div className="grid sm:grid-cols-6 gap-4">
              <a className="home-cta bg-teal-500 text-gray-900" href="/fise">📄 Fișe educative</a>
              <a className="home-cta bg-teal-500 text-gray-900" href="/carti">📚 Cărți cu avatarul copilului</a>
              <a className="home-cta bg-teal-500 text-gray-900" href="/creeaza-carte">📸 Cărți cu fotografia copilului</a>
            </div>
          </div>
        </div>
      </section>

      {/* Cărți cu avatar */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📚 Cărți cu avatarul copilului</h2>
          <a href="/carti" className="btn-soft">Vezi mai multe →</a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carti3.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Fișe */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📄 Fișe educative</h2>
          <a href="/fise" className="btn-soft">Vezi mai multe →</a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fise3.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Cărți cu fotografia copilului (cele 15 din catalog; aici doar 3) */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📸 Cărți cu fotografia copilului</h2>
          <a href="/carti-foto" className="btn-soft">Vezi mai multe →</a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartiFoto3.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Cum arată procesul */}
      <section className="bg-[rgba(183,132,247,0.1)] py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Cum arată procesul</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "📷", text: "Încarci fotografia sau alegi avatarul" },
              { icon: "✏️", text: "Personalizezi cu nume și detalii" },
              { icon: "💌", text: "Primești PDF-ul (instant / 48h)" },
              { icon: "📦", text: "Opțional, tipărim în 5–7 zile" }
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-2">{s.icon}</div>
                <p className="text-gray-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recenzii + galerie impresii */}
      <Reviews />
      <Gallery />
    </main>
  );
}
