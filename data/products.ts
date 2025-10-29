// data/products.ts
import { PRICE } from "@/config/pricing";

export type Product = {
  id: string;
  slug: string;
  type: "carte" | "fise" | "carte-custom";
  title: string;         // poate conține [NumeCopil]
  description: string;
  image: string;         // coperta
  pages: number;
  priceRON: number;
  benefits?: string[];
};

export const products: Product[] = [
  // ==== CĂRȚI (avatar) — 29 RON ====
  {
    id: "carte-ziua",
    slug: "ziua-lui-nume",
    type: "carte",
    title: "Ziua lui [NumeCopil]",
    description: "O poveste veselă despre ziua de naștere, cu numele copilului în rolul principal.",
    image: "/covers/ziua.webp",
    priceRON: PRICE.BOOK,
    pages: 20,
    benefits: ["Numele copilului în poveste", "Ilustrații prietenoase", "PDF instant + opțional tipărire în 5–7 zile"],
  },
  {
    id: "carte-numere",
    slug: "nume-invata-numere",
    type: "carte",
    title: "[NumeCopil] învață să numere",
    description: "Poveste jucăușă care introduce cifrele de la 1 la 10 în mod natural și distractiv.",
    image: "/covers/numere.webp",
    priceRON: PRICE.BOOK,
    pages: 20,
    benefits: ["Învățare prin joacă", "Ilustrații prietenoase", "PDF instant + opțional tipărire în 5–7 zile"],
  },
  {
    id: "carte-sentimente",
    slug: "nume-si-cutia-cu-sentimente",
    type: "carte",
    title: "[NumeCopil] și cutia cu sentimente",
    description: "Explorăm emoțiile într-o poveste caldă, pe înțelesul celor mici.",
    image: "/covers/sentimente.webp",
    priceRON: PRICE.BOOK,
    pages: 20,
    benefits: ["Conștientizare emoțională", "Text empatic", "PDF instant + opțional tipărire în 5–7 zile"],
  },

  // ==== FIȘE — 25 RON ====
  {
    id: "fise-3-4",
    slug: "fise-3-4-ani",
    type: "fise",
    title: "Fișe educative 3–4 ani pentru [NumeCopil]",
    description: "Fișe PDF colorate pentru motricitate fină, atenție și recunoaștere formă/culoare.",
    image: "/products/fise-34.webp",
    priceRON: PRICE.WORKSHEETS,
    pages: 40,
    benefits: ["Atenție vizuală", "Motricitate fină", "PDF instant"],
  },
  {
    id: "fise-4-5",
    slug: "fise-4-5-ani",
    type: "fise",
    title: "Fișe educative 4–5 ani pentru [NumeCopil]",
    description: "Activități pentru numeratie 1–10, potriviri, trasee și desenare.",
    image: "/products/fise-45.webp",
    priceRON: PRICE.WORKSHEETS,
    pages: 30,
    benefits: ["Numeratie 1–10", "Potriviri și trasee", "PDF instant"],
  },
  {
    id: "fise-5-6",
    slug: "fise-5-6-ani",
    type: "fise",
    title: "Fișe educative 5–6 ani pentru [NumeCopil]",
    description: "Exerciții pentru litere, pregătire scris-citit și logică.",
    image: "/products/fise-56.webp",
    priceRON: PRICE.WORKSHEETS,
    pages: 30,
    benefits: ["Litere și sunete", "Pregătire scris-citit", "PDF instant"],
  },
  {
    id: "fise-cifre",
    slug: "fise-cifre",
    type: "fise",
    title: "Fișe educative – cifrele pentru [NumeCopil]",
    description: "Colecție de fișe pentru exersarea cifrelor, trasee și potriviri.",
    image: "/products/fise-cifre.webp",
    priceRON: PRICE.WORKSHEETS,
    pages: 20,
    benefits: ["Exersare cifre", "Trasare ghidată", "PDF instant"],
  },

  // ==== CĂRȚI CU FOTOGRAFIA COPILULUI — 40 RON, 20 pag ====
  {
    id: "cf-magie-sarbatori",
    slug: "edy-si-magia-sarbatorilor-de-iarna",
    type: "carte-custom",
    title: "Edy și magia sărbătorilor de iarnă",
    description: "Crăciun, tradiții, colinde și miros de cozonaci într-o poveste cu copilul tău în prim-plan.",
    image: "/covers-foto/edy-si-magia-sarbatorilor-de-iarna.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-mos-a-uitat",
    slug: "mos-craciun-a-uitat-un-cadou",
    type: "carte-custom",
    title: "Moș Crăciun a uitat un cadou!",
    description: "O aventură de iarnă în căutarea cadoului pierdut.",
    image: "/covers-foto/mos-craciun-a-uitat-un-cadou.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-dovleci",
    slug: "noaptea-dovlecilor-veseli",
    type: "carte-custom",
    title: "Noaptea dovlecilor veseli",
    description: "O poveste de Halloween în care descoperim curajul și prietenia.",
    image: "/covers-foto/noaptea-dovlecilor-veseli.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-zi-cu-mama",
    slug: "o-zi-cu-mama-mea-minunata",
    type: "carte-custom",
    title: "O zi cu mama mea minunată",
    description: "O zi tandră, plină de joacă, gătit și îmbrățișări.",
    image: "/covers-foto/o-zi-cu-mama-mea-minunata.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-zi-cu-tata",
    slug: "o-zi-cu-tata-cel-mai-curajos-erou",
    type: "carte-custom",
    title: "O zi cu tata – cel mai curajos erou",
    description: "Reparăm, construim și râdem împreună cu tata.",
    image: "/covers-foto/o-zi-cu-tata-cel-mai-curajos-erou.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-weekend-bunici",
    slug: "weekend-la-bunici",
    type: "carte-custom",
    title: "Weekend la bunici",
    description: "Tradiții, miros de plăcinte, animale și lecții de viață.",
    image: "/covers-foto/weekend-la-bunici.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-gradinita",
    slug: "edy-merge-la-gradinita",
    type: "carte-custom",
    title: "Edy merge la grădiniță",
    description: "Primele emoții, prieteni noi și jocuri frumoase.",
    image: "/covers-foto/edy-merge-la-gradinita.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-creste-mare",
    slug: "edy-vrea-sa-creasca-mare",
    type: "carte-custom",
    title: "Edy vrea să crească mare",
    description: "Despre răbdare, visuri și încredere.",
    image: "/covers-foto/edy-vrea-sa-creasca-mare.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-curtea-blocului",
    slug: "edy-si-prietenii-din-curtea-blocului",
    type: "carte-custom",
    title: "Edy și prietenii din curtea blocului",
    description: "Aventuri de vară, joacă și împăcări sincere.",
    image: "/covers-foto/edy-si-prietenii-din-curtea-blocului.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-multumesc",
    slug: "ziua-in-care-edy-a-invatat-sa-spuna-multumesc",
    type: "carte-custom",
    title: "Ziua în care Edy a învățat să spună «Mulțumesc»",
    description: "O poveste educativă despre recunoștință.",
    image: "/covers-foto/ziua-in-care-edy-a-invatat-sa-spuna-multumesc.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-povestea-numelui",
    slug: "edy-si-povestea-numelui-sau",
    type: "carte-custom",
    title: "Edy și povestea numelui său",
    description: "O aventură magică despre semnificația numelui.",
    image: "/covers-foto/edy-si-povestea-numelui-sau.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-meserii",
    slug: "edy-descopera-lumea-meseriilor",
    type: "carte-custom",
    title: "Edy descoperă lumea meseriilor",
    description: "De la pompier la pilot, fiecare meserie schimbă lumea.",
    image: "/covers-foto/edy-descopera-lumea-meseriilor.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-ziua-lui",
    slug: "ziua-lui-edy",
    type: "carte-custom",
    title: "Ziua lui Edy",
    description: "Un aniversar magic cu surprize și prieteni.",
    image: "/covers-foto/ziua-lui-edy.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-cutia-sentimente",
    slug: "edy-si-cutia-cu-sentimente",
    type: "carte-custom",
    title: "Edy și cutia cu sentimente",
    description: "Descoperim și învățăm să exprimăm emoțiile.",
    image: "/covers-foto/edy-si-cutia-cu-sentimente.webp",
    priceRON: 40,
    pages: 20,
  },
  {
    id: "cf-invata-numere",
    slug: "edy-invata-sa-numere",
    type: "carte-custom",
    title: "Edy învață să numere",
    description: "Cifrele devin joacă în povestea cu copilul tău.",
    image: "/covers-foto/edy-invata-sa-numere.webp",
    priceRON: 40,
    pages: 20,
  },
];

export function byType(type: Product["type"]) {
  return products.filter((p) => p.type === type);
}
export function bySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function byId(id: string) {
  return products.find((p) => p.id === id);
}
