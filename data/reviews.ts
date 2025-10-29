export type Review = {
  id: string;
  name: string;
  text: string;
  photo: string;   // /reviews/r1.webp etc.
};

export const reviews: Review[] = [
  { id:"r1", name:"Ana & Mihai", text:"Cartea a fost minunată, iar personalizarea cu numele a încântat toată familia!", photo:"/reviews/r1.webp" },
  { id:"r2", name:"Ioana", text:"Fișele au ajuns pe email imediat. Foarte faine și colorate, copilul a stat atent peste 30 de minute.", photo:"/reviews/r2.webp" },
  { id:"r3", name:"Cristina", text:"Ne-a plăcut mult cum seamănă personajul cu fetița noastră. Recomand!", photo:"/reviews/r3.webp" },
  { id:"r4", name:"Andreea", text:"Procesul de comandă a fost foarte simplu, iar livrarea cărții rapidă.", photo:"/reviews/r4.webp" },
  { id:"r5", name:"Radu", text:"Excelent pentru cadouri! Personalizarea face toți banii.", photo:"/reviews/r5.webp" },
];
