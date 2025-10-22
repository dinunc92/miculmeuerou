"use client";
import { useEffect, useState } from "react";

type OrderItemDTO = {
  id: string;
  title: string;
  productId: string;
  type: "carte" | "fise" | "carte-custom";
  childName?: string | null;
};

export default function SuccessPage({ searchParams }: { searchParams: { sid?: string } }) {
  const sid = searchParams?.sid || "";
  const [items, setItems] = useState<OrderItemDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sid) return;
    (async () => {
      try {
        const r = await fetch(`/api/order-files?sid=${encodeURIComponent(sid)}`);
        const data = await r.json();
        setItems(data.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [sid]);

  const download = async (it: OrderItemDTO) => {
    if (it.type === "carte-custom") {
      alert("Cartea din fotografie va fi livrată pe email în maximum 2 zile lucrătoare.");
      return;
    }
    const res = await fetch("/api/personalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: it.productId, // presupunem că productId == slug (ajustează dacă e diferit)
        type: it.type,
        childName: it.childName || "Edy",
        title: it.title,
      }),
    });
    const blob = await res.blob();
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = `${it.title}.pdf`;
    a.click();
    URL.revokeObjectURL(u);
  };

  if (!sid) return <div className="max-w-3xl mx-auto px-4 py-14">Sesiune Stripe lipsă.</div>;
  if (loading) return <div className="max-w-3xl mx-auto px-4 py-14">Se încarcă…</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-2xl font-bold">Comanda ta este în curs de pregătire</h1>
      <p className="text-gray-700 mt-2">
        Poți descărca aici fișierele digitale. Pentru varianta tipărită, livrarea este 5–7 zile lucrătoare.
      </p>

      <div className="mt-6 space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between p-3 rounded-xl border bg-white/70">
            <div>
              <div className="font-semibold">{it.title}</div>
              {it.childName ? <div className="text-sm text-gray-600">Pentru {it.childName}</div> : null}
            </div>
            <button className="btn-cta" onClick={() => download(it)}>
              {it.type === "carte-custom" ? "Va sosi în 2 zile" : "Descarcă PDF"}
            </button>
          </div>
        ))}
      </div>

      <a href="/" className="btn-neutral mt-8 inline-block">Înapoi la pagina principală</a>
    </div>
  );
}
