// components/Reviews.tsx
import Image from "next/image";
import { IconStar, IconClock, IconGift, IconShield, IconBook, IconSmile } from "./ReviewIcons";

const REVIEWS = [
  {
    id: 1,
    name: "Mădălina P.",
    text:
      "Cartea cu avatar a fost un cadou superb — numele copilului în poveste a fost highlight-ul serii!",
    photo: "/reviews/r1.jpg",
    icons: [<IconStar key="s"/>, <IconGift key="g"/>, <IconSmile key="sm"/>],
  },
  {
    id: 2,
    name: "Andrei C.",
    text:
      "Fișele au venit pe email imediat după plată. Foarte utile, colorate, clare.",
    photo: "/reviews/r2.jpg",
    icons: [<IconClock key="c"/>, <IconBook key="b"/>, <IconStar key="s"/>],
  },
  {
    id: 3,
    name: "Elena D.",
    text:
      "Am bifat varianta tipărită — livrarea a fost în 6 zile. Coperta cartonată arată excelent.",
    photo: "/reviews/r3.jpg",
    icons: [<IconShield key="sh"/>, <IconStar key="s"/>, <IconGift key="g"/>],
  },
];

export default function Reviews(){
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Părinții spun despre noi</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {REVIEWS.map(r=>(
          <div key={r.id} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image src={r.photo} alt={r.name} fill sizes="60px"/>
              </div>
              <div className="font-semibold">{r.name}</div>
            </div>
            <p className="mt-3 text-sm text-gray-700">{r.text}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              {r.icons}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
