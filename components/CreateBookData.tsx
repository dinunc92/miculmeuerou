// components/CreateBookData.ts

export type Cover = {
  id: string;            // = Product.id (carte-custom)
  title: string;         // = Product.title
  slug: string;          // = Product.slug (pentru previews)
  src: string;           // /covers-foto/<slug>.webp
  previews: string[];    // /previews/<slug>/p1.webp ... p4.webp
};

/**
 * Helper: construiește cele 4 preview-uri standard pentru un slug.
 */
function previewsFor(slug: string): string[] {
  return [
    `/previews/${slug}/p1.webp`,
    `/previews/${slug}/p2.webp`,
    `/previews/${slug}/p3.webp`,
    `/previews/${slug}/p4.webp`,
  ];
}

/**
 * Lista celor 15 titluri pentru „Cărți cu fotografia copilului” (carte-custom).
 * IDs, titluri, slug-uri și cover path-uri sunt aliniate cu data/products.ts.
 */
export const COVERS: Cover[] = [
  {
    id: "cf-magie-sarbatori",
    title: "Edy și magia sărbătorilor de iarnă",
    slug: "edy-si-magia-sarbatorilor-de-iarna",
    src: "/covers-foto/edy-si-magia-sarbatorilor-de-iarna.webp",
    previews: previewsFor("edy-si-magia-sarbatorilor-de-iarna"),
  },
  {
    id: "cf-mos-a-uitat",
    title: "Moș Crăciun a uitat un cadou!",
    slug: "mos-craciun-a-uitat-un-cadou",
    src: "/covers-foto/mos-craciun-a-uitat-un-cadou.webp",
    previews: previewsFor("mos-craciun-a-uitat-un-cadou"),
  },
  {
    id: "cf-dovleci",
    title: "Noaptea dovlecilor veseli",
    slug: "noaptea-dovlecilor-veseli",
    src: "/covers-foto/noaptea-dovlecilor-veseli.webp",
    previews: previewsFor("noaptea-dovlecilor-veseli"),
  },
  {
    id: "cf-zi-cu-mama",
    title: "O zi cu mama mea minunată",
    slug: "o-zi-cu-mama-mea-minunata",
    src: "/covers-foto/o-zi-cu-mama-mea-minunata.webp",
    previews: previewsFor("o-zi-cu-mama-mea-minunata"),
  },
  {
    id: "cf-zi-cu-tata",
    title: "O zi cu tata – cel mai curajos erou",
    slug: "o-zi-cu-tata-cel-mai-curajos-erou",
    src: "/covers-foto/o-zi-cu-tata-cel-mai-curajos-erou.webp",
    previews: previewsFor("o-zi-cu-tata-cel-mai-curajos-erou"),
  },
  {
    id: "cf-weekend-bunici",
    title: "Weekend la bunici",
    slug: "weekend-la-bunici",
    src: "/covers-foto/weekend-la-bunici.webp",
    previews: previewsFor("weekend-la-bunici"),
  },
  {
    id: "cf-gradinita",
    title: "Edy merge la grădiniță",
    slug: "edy-merge-la-gradinita",
    src: "/covers-foto/edy-merge-la-gradinita.webp",
    previews: previewsFor("edy-merge-la-gradinita"),
  },
  {
    id: "cf-creste-mare",
    title: "Edy vrea să crească mare",
    slug: "edy-vrea-sa-creasca-mare",
    src: "/covers-foto/edy-vrea-sa-creasca-mare.webp",
    previews: previewsFor("edy-vrea-sa-creasca-mare"),
  },
  {
    id: "cf-curtea-blocului",
    title: "Edy și prietenii din curtea blocului",
    slug: "edy-si-prietenii-din-curtea-blocului",
    src: "/covers-foto/edy-si-prietenii-din-curtea-blocului.webp",
    previews: previewsFor("edy-si-prietenii-din-curtea-blocului"),
  },
  {
    id: "cf-multumesc",
    title: "Ziua în care Edy a învățat să spună «Mulțumesc»",
    slug: "ziua-in-care-edy-a-invatat-sa-spuna-multumesc",
    src: "/covers-foto/ziua-in-care-edy-a-invatat-sa-spuna-multumesc.webp",
    previews: previewsFor("ziua-in-care-edy-a-invatat-sa-spuna-multumesc"),
  },
  {
    id: "cf-povestea-numelui",
    title: "Edy și povestea numelui său",
    slug: "edy-si-povestea-numelui-sau",
    src: "/covers-foto/edy-si-povestea-numelui-sau.webp",
    previews: previewsFor("edy-si-povestea-numelui-sau"),
  },
  {
    id: "cf-meserii",
    title: "Edy descoperă lumea meseriilor",
    slug: "edy-descopera-lumea-meseriilor",
    src: "/covers-foto/edy-descopera-lumea-meseriilor.webp",
    previews: previewsFor("edy-descopera-lumea-meseriilor"),
  },
  {
    id: "cf-ziua-lui",
    title: "Ziua lui Edy",
    slug: "ziua-lui-edy",
    src: "/covers-foto/ziua-lui-edy.webp",
    previews: previewsFor("ziua-lui-edy"),
  },
  {
    id: "cf-cutia-sentimente",
    title: "Edy și cutia cu sentimente",
    slug: "edy-si-cutia-cu-sentimente",
    src: "/covers-foto/edy-si-cutia-cu-sentimente.webp",
    previews: previewsFor("edy-si-cutia-cu-sentimente"),
  },
  {
    id: "cf-invata-numere",
    title: "Edy învață să numere",
    slug: "edy-invata-sa-numere",
    src: "/covers-foto/edy-invata-sa-numere.webp",
    previews: previewsFor("edy-invata-sa-numere"),
  },
];

/**
 * Helpers utile în pagini:
 */
export function coverById(id?: string | null): Cover {
  return COVERS.find((c) => c.id === id) || COVERS[0];
}

export function coverBySlug(slug?: string | null): Cover {
  return COVERS.find((c) => c.slug === slug) || COVERS[0];
}
