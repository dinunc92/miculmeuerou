"use client";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import { COVERS } from "@/components/CreateBookData";

export default function CreateBookGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
      {COVERS.map((c) => (
        <div key={c.id} className="card p-3">
          <Link href={`/creeaza-carte?cover=${encodeURIComponent(c.id)}`} className="block">
            <Carousel
              images={[c.src, ...(c.previews || [])]}
              aspect="tall"
              height={360}
              rounded="rounded-xl"
            />
          </Link>
          <div className="mt-3 font-bold">{c.title}</div>
          <div className="text-xs text-gray-600">PDF 40 RON • Tipărit 5–7 zile (+65 RON)</div>
          <div className="mt-3 flex gap-2">
            <Link href={`/creeaza-carte?cover=${encodeURIComponent(c.id)}`} className="btn-cta">
              Personalizează
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
