import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.miculmeuerou.ro";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/carti` },
    { url: `${base}/fise` },
    { url: `${base}/creeaza-carte` },
    { url: `${base}/contact` },
  ];
}
