import Image from "next/image";
import { reviews } from "@/data/reviews";

export default function Reviews(){
  return (
    <section className="bg-gradient-to-br from-brand-turquoise/10 to-brand-lilac/10">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center">Ce spun părinții</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {reviews.map(r=>(
            <div key={r.id} className="card p-5 flex gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image src={r.photo} alt={r.name} fill sizes="64px"/>
              </div>
              <div>
                <div className="font-semibold">{r.name}</div>
                <p className="text-sm text-gray-700">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          Ai cumpărat? Spune-ne părerea ta răspunzând la emailul de confirmare. 💌
        </p>
      </div>
    </section>
  );
}
