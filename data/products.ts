// data/products.ts
export type ProductType = "fise" | "carte" | "carte-custom";

export type Product = {
  id: string;
  slug: string;
  type: ProductType;
  title: string;          // cu [NumeCopil]
  titleWeb: string;       // cum apare pe site (default cu „Edy”)
  description: string;
  priceRON: number;
  image: string;
};

export const products: Product[] = [
  // --- FIȘE ---
  {
    id: "fise-3-4",
    slug: "fise-educative-3-4-ani",
    type: "fise",
    title: "Fișe educative 3–4 ani pentru [NumeCopil]",
    titleWeb: "Fișe educative 3–4 ani pentru Edy",
    description: "Set PDF (20 pagini). Personalizate cu numele copilului.",
    priceRON: 39,
    image: "/thumbs/fise-3-4.jpg",
  },
  {
    id: "fise-4-5",
    slug: "fise-educative-4-5-ani",
    type: "fise",
    title: "Fișe educative 4–5 ani pentru [NumeCopil]",
    titleWeb: "Fișe educative 4–5 ani pentru Edy",
    description: "Exerciții jucăușe pentru 4–5 ani.",
    priceRON: 39,
    image: "/thumbs/fise-4-5.jpg",
  },
  {
    id: "fise-5-6",
    slug: "fise-educative-5-6-ani",
    type: "fise",
    title: "Fișe educative 5–6 ani pentru [NumeCopil]",
    titleWeb: "Fișe educative 5–6 ani pentru Edy",
    description: "Litere, numere, logică.",
    priceRON: 39,
    image: "/thumbs/fise-5-6.jpg",
  },
  {
    id: "fise-cifre",
    slug: "fise-educative-cifre",
    type: "fise",
    title: "Fișe educative – cifrele pentru [NumeCopil]",
    titleWeb: "Fișe educative – cifrele pentru Edy",
    description: "Învață cifrele cu exerciții ilustrate și distractive.",
    priceRON: 39,
    image: "/thumbs/fise-cifre.jpg",
  },

  // --- CĂRȚI (3 titluri) ---
  {
    id: "carte-ziua",
    slug: "carte-ziua-lui",
    type: "carte",
    title: "Ziua lui [NumeCopil]",
    titleWeb: "Ziua lui Edy",
    description: "Poveste (16 pagini) personalizată cu numele copilului.",
    priceRON: 159,
    image: "/thumbs/carte-ziua.jpg",
  },
  {
    id: "carte-numere",
    slug: "carte-invata-sa-numere",
    type: "carte",
    title: "[NumeCopil] învață să numere",
    titleWeb: "Edy învață să numere",
    description: "O aventură jucăușă în lumea numerelor.",
    priceRON: 159,
    image: "/thumbs/carte-numere.jpg",
  },
  {
    id: "carte-sentimente",
    slug: "carte-cutia-cu-sentimente",
    type: "carte",
    title: "[NumeCopil] și cutia cu sentimente",
    titleWeb: "Edy și cutia cu sentimente",
    description: "O poveste caldă despre emoții și prietenie.",
    priceRON: 159,
    image: "/thumbs/carte-sentimente.jpg",
  },

  // --- CARTE PERSONALIZABILĂ AVANSAT (10 titluri default) ---
  {
    id: "carte-custom",
    slug: "personalizeaza-cartea",
    type: "carte-custom",
    title: "Cartea eroului tău – [NumeCopil]",
    titleWeb: "Cartea eroului tău – Edy",
    description: "Îți personalizezi coperta/poza, dedicația și detalii unice. Livrare digitală în 24h.",
    priceRON: 199,
    image: "/thumbs/carte-custom.jpg",
  },
];

export function byType(type: ProductType) { return products.filter(p=>p.type===type); }
export function findBySlug(slug: string) { return products.find(p=>p.slug===slug); }
export function findById(id: string) { return products.find(p=>p.id===id); }
export const bySlug = findBySlug; // alias compat
export const byId = findById;     // alias compat
