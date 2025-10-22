import Link from "next/link";
import Image from "next/image";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";

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
              Creează fișe educative și cărți personalizate cu numele, imaginea
              și aventurile copilului tău.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
  <a className="home-cta" href="/fise">Fișe educative</a>
  <a className="home-cta" href="/carti">Cărți personalizate</a>
  <a className="home-cta" href="/creeaza-carte">Creează-ți cartea</a>
</div>
          </div>

          <div className="flex-1 flex justify-center">
            <Image
              src="/hero-cover.png"
              alt="Copil citind cartea personalizată"
              width={300}
              height={300}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* SECTIUNEA 3 PRODUSE */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Ce poți comanda
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { href: "/fise", img: "/home/fise.jpg", title: "Fișe educative", desc: "Descoperă fișe colorate pentru vârsta 3–6 ani." },
            { href: "/carti", img: "/home/carti.jpg", title: "Cărți personalizate", desc: "Povești unice cu numele copilului tău." },
            { href: "/creeaza-carte", img: "/home/creeaza.jpg", title: "Creează-ți cartea", desc: "Trimite poza copilului și primești cartea ta unică." }
          ].map((c, i) => (
            <Link key={i} href={c.href} className="group block card p-3 hover:shadow-lg transition">
              <Image
                src={c.img}
                alt={c.title}
                width={400}
                height={260}
                className="rounded-xl object-cover w-full h-48"
              />
              <h3 className="mt-3 font-bold text-lg text-gray-800 group-hover:text-[var(--brand-turquoise)]">
                {c.title}
              </h3>
              <p className="text-gray-600 text-sm">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTIUNEA CUM FUNCTIONEAZA */}
      <section className="bg-[rgba(183,132,247,0.1)] py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Cum arată procesul</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "📷", text: "Încarci fotografia copilului" },
              { icon: "✏️", text: "Alegi coperta și personalizezi" },
              { icon: "💌", text: "Primești PDF-ul în 48h" },
              { icon: "📦", text: "Opțional, o primești tipărită acasă" }
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-2">{s.icon}</div>
                <p className="text-gray-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENZII + GALERIE */}
      <Reviews />
      <Gallery />
    </main>
  );
}
