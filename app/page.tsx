import Link from "next/link";
import DecorBlobs from "@/components/DecorBlobs";
import { byType } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Reviews from "@/components/Reviews";


export default function Home() {
  const carti = byType("carte");
  const fise = byType("fise");

  return (
    <div className="relative overflow-hidden">
      <DecorBlobs />
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-brand-turquoise to-brand-lilac bg-clip-text text-transparent">
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Micul tău erou, în fișe, <strong>cărți</strong> și povești animate.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/fise" className="btn-cta">📄 Fișe</Link>
          <Link href="/carti" className="btn-cta">📚 Cărți</Link>
          <Link href="/creeaza-carte" className="btn-cta">✨ Creează-ți cartea</Link>
        </div>
        </div>
      </section>

      {/* Cărți */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="text-2xl font-bold mb-4">Cărți personalizate</h2>
        <div className="grid md:grid-cols-3 gap-6">{carti.map(p=> <ProductCard key={p.id} p={p}/>)}</div>
        <div className="text-right mt-4">
          <Link href="/carti" className="underline">Vezi toate cărțile →</Link>
        </div>
      </section>

      {/* Fișe */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4">Fișe personalizate (PDF)</h2>
        <div className="grid md:grid-cols-3 gap-6">{fise.map(p=> <ProductCard key={p.id} p={p}/>)}</div>
        <div className="text-right mt-4">
          <Link href="/fise" className="underline">Vezi toate fișele →</Link>
        </div>
      </section>

      {/* Cum funcționează (mai interesant) */}
      <section className="bg-gradient-to-br from-brand-turquoise/10 to-brand-lilac/10">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Cum funcționează?</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              { icon:"🛍️", t:"Alegi produsul", d:"Fișe sau carte" },
              { icon:"🎨", t:"Personalizezi", d:"Nume, avatar" },
              { icon:"💳", t:"Plătești în siguranță", d:"Stripe" },
              { icon:"📦", t:"Primești", d:"PDF pe email / carte acasă" }
            ].map((i,idx)=>(
              <div key={idx} className="card p-6 hover-pop">
                <div className="text-4xl mb-2 animate-bounce">{i.icon}</div>
                <h3 className="text-lg font-semibold">{i.t}</h3>
                <p className="text-gray-600">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews />
      
    </div>
  );
}
