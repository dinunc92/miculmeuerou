export type ProductType = "fise" | "carte" | "desene";
export type Product = {
  id: string; slug: string; type: ProductType;
  title: string; description: string; priceRON: number; image?: string;
  options?: Record<string, any>;
};

export const products: Product[] = [
  { id:"fise-3-4", slug:"fise-educative-3-4-ani", type:"fise", title:"Fișe educative 3–4 ani",
    description:"Set PDF (20 pagini). Personalizate cu numele și avatarul copilului.", priceRON:39, image:"/avatar-base.svg" },
  { id:"fise-4-5", slug:"fise-educative-4-5-ani", type:"fise", title:"Fișe educative 4–5 ani",
    description:"Set PDF (20 pagini). Exerciții jucăușe pentru 4–5 ani.", priceRON:39, image:"/avatar-base.svg" },
  { id:"fise-5-6", slug:"fise-educative-5-6-ani", type:"fise", title:"Fișe educative 5–6 ani",
    description:"Set PDF (20 pagini). Litere, numere, logică.", priceRON:39, image:"/avatar-base.svg" },
  { id:"carte-ziua-lui-edy", slug:"carte-personalizata-ziua-lui-edy", type:"carte", title:"Carte personalizată – Ziua lui Edy",
    description:"Poveste (16 pagini) cu numele și avatarul copilului. Copertă cartonată.", priceRON:159, image:"/avatar-base.svg" },
  { id:"carte-fara-suzi", slug:"carte-personalizata-edy-fara-suzi", type:"carte", title:"Carte personalizată – Edy nu mai are nevoie de suzi",
    description:"Tranziție fără suzetă, personalizată cu numele copilului.", priceRON:159, image:"/avatar-base.svg" },
  { id:"carte-vrea-sa-creasca", slug:"carte-personalizata-edy-vrea-sa-creasca", type:"carte", title:"Carte personalizată – Edy vrea să crească",
    description:"Rutine și autonomie, personalizată cu numele copilului.", priceRON:159, image:"/avatar-base.svg" },
];

export function byType(type: ProductType) { return products.filter(p=>p.type===type); }
export function bySlug(slug: string) { return products.find(p=>p.slug===slug); }
