// components/CreateBookData.ts
export type CoverItem = {
  id: string;         // == slug
  title: string;      // pentru UI
  src: string;        // coperta
  previews: string[]; // p1..p4
};

function previewsFor(slug: string) {
  return [
    `/previews/${slug}/p1.webp`,
    `/previews/${slug}/p2.webp`,
    `/previews/${slug}/p3.webp`,
    `/previews/${slug}/p4.webp`,
  ];
}

export const COVERS: CoverItem[] = [
  {
    id: "edy-si-magia-sarbatorilor-de-iarna",
    title: "Edy și magia sărbătorilor de iarnă",
    src: "/covers-foto/edy-si-magia-sarbatorilor-de-iarna.webp",
    previews: previewsFor("edy-si-magia-sarbatorilor-de-iarna"),
  },
  {
    id: "mos-craciun-a-uitat-un-cadou",
    title: "Moș Crăciun a uitat un cadou!",
    src: "/covers-foto/mos-craciun-a-uitat-un-cadou.webp",
    previews: previewsFor("mos-craciun-a-uitat-un-cadou"),
  },
  {
    id: "noaptea-dovlecilor-veseli",
    title: "Noaptea dovlecilor veseli",
    src: "/covers-foto/noaptea-dovlecilor-veseli.webp",
    previews: previewsFor("noaptea-dovlecilor-veseli"),
  },
  {
    id: "o-zi-cu-mama-mea-minunata",
    title: "O zi cu mama mea minunată",
    src: "/covers-foto/o-zi-cu-mama-mea-minunata.webp",
    previews: previewsFor("o-zi-cu-mama-mea-minunata"),
  },
  {
    id: "o-zi-cu-tata-cel-mai-curajos-erou",
    title: "O zi cu tata – cel mai curajos erou",
    src: "/covers-foto/o-zi-cu-tata-cel-mai-curajos-erou.webp",
    previews: previewsFor("o-zi-cu-tata-cel-mai-curajos-erou"),
  },
  {
    id: "weekend-la-bunici",
    title: "Weekend la bunici",
    src: "/covers-foto/weekend-la-bunici.webp",
    previews: previewsFor("weekend-la-bunici"),
  },
  {
    id: "edy-merge-la-gradinita",
    title: "Edy merge la grădiniță",
    src: "/covers-foto/edy-merge-la-gradinita.webp",
    previews: previewsFor("edy-merge-la-gradinita"),
  },
  {
    id: "edy-vrea-sa-creasca-mare",
    title: "Edy vrea să crească mare",
    src: "/covers-foto/edy-vrea-sa-creasca-mare.webp",
    previews: previewsFor("edy-vrea-sa-creasca-mare"),
  },
  {
    id: "edy-si-prietenii-din-curtea-blocului",
    title: "Edy și prietenii din curtea blocului",
    src: "/covers-foto/edy-si-prietenii-din-curtea-blocului.webp",
    previews: previewsFor("edy-si-prietenii-din-curtea-blocului"),
  },
  {
    id: "ziua-in-care-edy-a-invatat-sa-spuna-multumesc",
    title: "Ziua în care Edy a învățat să spună «Mulțumesc»",
    src: "/covers-foto/ziua-in-care-edy-a-invatat-sa-spuna-multumesc.webp",
    previews: previewsFor("ziua-in-care-edy-a-invatat-sa-spuna-multumesc"),
  },
  {
    id: "edy-si-povestea-numelui-sau",
    title: "Edy și povestea numelui său",
    src: "/covers-foto/edy-si-povestea-numelui-sau.webp",
    previews: previewsFor("edy-si-povestea-numelui-sau"),
  },
  {
    id: "edy-descopera-lumea-meseriilor",
    title: "Edy descoperă lumea meseriilor",
    src: "/covers-foto/edy-descopera-lumea-meseriilor.webp",
    previews: previewsFor("edy-descopera-lumea-meseriilor"),
  },
  {
    id: "ziua-lui-edy",
    title: "Ziua lui Edy",
    src: "/covers-foto/ziua-lui-edy.webp",
    previews: previewsFor("ziua-lui-edy"),
  },
  {
    id: "edy-si-cutia-de-sentimente",
    title: "Edy și cutia de sentimente",
    src: "/covers-foto/edy-si-cutia-de-sentimente.webp",
    previews: previewsFor("edy-si-cutia-de-sentimente"),
  },
  {
    id: "edy-invata-sa-numere",
    title: "Edy învață să numere",
    src: "/covers-foto/edy-invata-sa-numere.webp",
    previews: previewsFor("edy-invata-sa-numere"),
  },
];
