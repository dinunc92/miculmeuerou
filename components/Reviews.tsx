// components/Reviews.tsx
import Image from "next/image";
import { IconStar, IconClock, IconGift, IconShield, IconBook, IconSmile } from "./ReviewIcons";

type Review = {
  id: number;
  name: string;
  text: string;
  photo: string;
  icons: JSX.Element[];
};

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Mădălina P.",
    text:
      "Cartea personalizată a fost surpriza serii. Copilul a fost foarte încântat când și-a văzut numele în poveste.",
    photo: "/reviews/r1.webp",
    icons: [<IconStar key="s" />, <IconGift key="g" />, <IconSmile key="sm" />],
  },
  {
    id: 2,
    name: "Andrei C.",
    text:
      "Fișele au venit imediat pe email după plată. Sunt clare și colorate, perfecte pentru vârsta lui.",
    photo: "/reviews/r2.webp",
    icons: [<IconClock key="c" />, <IconBook key="b" />, <IconStar key="s" />],
  },
  {
    id: 3,
    name: "Elena D.",
    text:
      "Am ales și varianta tipărită. A ajuns în 6 zile și arată foarte bine. Paginile din carte sunt cartonate, coperta lucioasa, exact cum ne-ați spus.",
    photo: "/reviews/r3.webp",
    icons: [<IconShield key="sh" />, <IconStar key="s" />, <IconGift key="g" />],
  },
  // noi (natural, fără neologisme)
  {
    id: 4,
    name: "Daniela R.",
    text:
      "Ne-a plăcut că am putut personaliza numele și detaliile din poveste. E o amintire frumoasă pentru noi.",
    photo: "/reviews/r4.webp",
    icons: [<IconStar key="s" />, <IconSmile key="sm" />],
  },
  {
    id: 5,
    name: "Marius L.",
    text:
      "Proces simplu și rapid. Fișele sunt bine gândite, îl țin ocupat și învață prin joacă.",
    photo: "/reviews/r5.webp",
    icons: [<IconBook key="b" />, <IconClock key="c" />],
  },
  {
    id: 6,
    name: "Georgiana S.",
    text:
      "Recomand! Am primit PDF-ul pe email și totul a fost clar. O să revenim și pentru alte povești.",
    photo: "/reviews/r6.webp",
    icons: [<IconStar key="s" />, <IconGift key="g" />],
  },
];

export default function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Părinții spun despre noi</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {REVIEWS.map((r) => (
          <article key={r.id} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                <Image src={r.photo} alt={r.name} fill sizes="60px" />
              </div>
              <div className="font-semibold">{r.name}</div>
            </div>
            <p className="mt-3 text-sm text-gray-700">{r.text}</p>
            <div className="mt-3 flex items-center gap-2 text-[12px] text-[var(--brand-lilac-dark,#6b3fa0)]">
              {r.icons}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
