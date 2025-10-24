// app/success/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type ItemDTO = {
  id: string;
  title: string;
  productId: string;
  type: "fise" | "carte" | "carte-custom";
  childName: string | null;
};

export default function SuccessPage({ searchParams }: { searchParams: { sid?: string } }) {
  const sid = searchParams.sid || "";
  const [items, setItems] = useState<ItemDTO[]>([]);

  useEffect(() => {
    if (!sid) return;
    (async () => {
      const res = await fetch(`/api/order-files?sid=${encodeURIComponent(sid)}`);
      const data = await res.json();
      setItems(data.items || []);
    })();
  }, [sid]);

  const downloadable = items.filter(i => i.type === "fise" || i.type === "carte");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">Comanda ta este în curs de pregătire</h1>
      <p className="mt-2 text-gray-700">
        Poți descărca aici fișierele digitale disponibile imediat. Pentru varianta tipărită, livrarea este 5–7 zile lucrătoare.
      </p>

      {downloadable.length > 0 ? (
        <div className="mt-6 space-y-3">
          {downloadable.map(i => (
            <div key={i.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{i.title}</div>
                <div className="text-sm text-gray-600">{i.type === "fise" ? "Fișe (PDF instant)" : "Carte (PDF instant)"}</div>
              </div>
              <a
                className="btn-cta"
                href={`/api/order-files/download?item=${encodeURIComponent(i.id)}`}
              >
                Descarcă PDF
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-4 mt-6">Nu există fișiere de descărcat pentru această comandă.</div>
      )}

      <div className="mt-8">
        <Link href="/" className="btn-neutral">Înapoi la prima pagină</Link>
      </div>
    </div>
  );
}
