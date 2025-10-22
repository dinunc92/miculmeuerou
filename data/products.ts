import { PRICE } from "@/config/pricing";

export type Product = {
  id: string;
  slug: string;
  type: "carte" | "fise" | "carte-custom";
  title: string;
  description: string;
  image: string;
  pages: number;   
  priceRON: number;
  benefits?: string[];
};

export const products: Product[] = [
  // CĂRȚI (avatar) — 29 RON
  {
    id: "carte-ziua",
    slug: "ziua-lui-nume",
    type: "carte",
    title: "Ziua lui [NumeCopil]",
    description: "O poveste veselă despre ziua de naștere, cu numele copilului în rolul principal.",
    image: "/covers/ziua.jpg",
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
    image: "/covers/numere.jpg",
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
    image: "/covers/sentimente.jpg",
    priceRON: PRICE.BOOK,
    pages: 20,   
    benefits: ["Conștientizare emoțională", "Text empatic", "PDF instant + opțional tipărire în 5–7 zile"],
  },

  // FIȘE — 25 RON
  {
    id: "fise-3-4",
    slug: "fise-3-4-ani",
    type: "fise",
    title: "Fișe educative 3–4 ani pentru [NumeCopil]",
    description: "Fișe PDF colorate pentru motricitate fină, atenție și recunoaștere formă/culoare.",
    image: "/products/fise-34.jpg",
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
    image: "/products/fise-45.jpg",
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
    image: "/products/fise-56.jpg",
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
    image: "/products/fise-cifre.jpg",
    priceRON: PRICE.WORKSHEETS,
    pages: 20,   
    benefits: ["Exersare cifre", "Trasare ghidată", "PDF instant"],
  },

  {
    id: "carte-custom",
    slug: "creeaza-carte",
    type: "carte-custom",
    title: "Carte personalizată din fotografie pentru [NumeCopil]",
    description: "Trimite fotografia copilului și primești cartea digitală în 48h (opțional tipărită).",
    image: "/home/creeaza.jpg",
    priceRON: PRICE.CUSTOM_BOOK,
    pages: 20,
    benefits: ["Imagini din carte cu copilul din fotografie", "PDF în 48h", "Opțional tipărit 5–7 zile"],
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
