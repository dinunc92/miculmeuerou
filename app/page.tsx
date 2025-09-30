import Link from "next/link";
import DecorBlobs from "@/components/DecorBlobs";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <DecorBlobs />
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-brand-turquoise to-brand-lilac bg-clip-text text-transparent">
          Micul Meu Erou
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Micul tău erou, în fișe, carte și povești animate.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/(shop)/fise" className="btn-cta bg-brand-turquoise text-white">Fișe personalizate</Link>
          <Link href="/(shop)/carti" className="btn-cta bg-brand-lilac text-white">Cărți personalizate</Link>
          <Link href="/(shop)/desene" className="btn-cta bg-brand-accent">Desene (în curând)</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 grid md:grid-cols-3 gap-6">
        {[
          { t:"Personalizare ușoară", d:"Alegi avatarul, scrii numele și vârsta – gata!" },
          { t:"Livrare rapidă", d:"Fișele vin imediat pe email, cartea ajunge la ușa ta." },
          { t:"Calitate premium", d:"Design prietenos, culori vii și atenție la detalii." }
        ].map((i,idx)=>(
          <div key={idx} className="card p-6 hover-pop">
            <h3 className="text-xl font-bold">{i.t}</h3>
            <p className="mt-2 text-gray-600">{i.d}</p>
          </div>
        ))}
      </section>

      <section className="bg-gradient-to-br from-brand-turquoise/10 to-brand-lilac/10">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Cum funcționează?</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              ["Alege produsul","Fișe sau carte"],
              ["Personalizează","Nume, vârstă, avatar"],
              ["Plătește în siguranță","Stripe"],
              ["Primești","PDF pe email / carte acasă"]
            ].map(([t,s],i)=>(
              <div key={i} className="card p-6">
                <div className="text-3xl">#{i+1}</div>
                <h3 className="mt-2 font-semibold">{t}</h3>
                <p className="text-gray-600">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
