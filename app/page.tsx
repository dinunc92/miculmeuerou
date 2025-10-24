import Image from "next/image";
import Reviews from "@/components/Reviews";
import ImpressionsCarousel  from "@/components/ImpressionsCarousel";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const fise = products.filter((p) => p.type === "fise");
const cartiAvatar = products.filter((p) => p.type === "carte");
const cartiFoto = products.filter((p) => p.type === "carte-custom");

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-r from-[var(--brand-turquoise)] to-[var(--brand-lilac)] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Copilul tău devine <br /> eroul propriei povești!
            </h1>
            <p className="text-lg font-light mb-6">
              Creează fișe educative și cărți personalizate cu avatarul sau fotografia copilului tău.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <a className="home-cta" href="/fise">Fișe educative</a>
              <a className="home-cta" href="/carti">Cărți cu avatarul copilului</a>
              <a className="home-cta" href="/creeaza-carte">Cărți cu fotografia copilului</a>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <Image
              src="/hero-cover.png"
              alt="Copil citind cartea personalizată"
              width={300}
              height={300}
              className="rounded-2xl shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Cărți cu avatar */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Cărți cu avatarul copilului</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartiAvatar.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Fișe */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Fișe educative</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fise.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Cărți cu fotografia copilului */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Cărți cu fotografia copilului</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartiFoto.map((p) => <ProductCard key={p.id} p={p} />)}
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
      <ImpressionsCarousel />
    </main>
  );
}
