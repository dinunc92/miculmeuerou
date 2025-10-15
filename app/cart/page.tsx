"use client";
import { useCart } from "@/lib/store/cart";
import { useRouter } from "next/navigation";

import { displayTitleFromPlaceholder } from "@/utils/title";

function titleForCart(i: any){
  const name = i.customization?.childName || "";
  return displayTitleFromPlaceholder(i.title, name);
}


export default function CartPage() {
  const { items, remove } = useCart();
  const router = useRouter();
  const total = items.reduce((s, i) => s + i.priceRON, 0);

  const checkout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data?.error || "Nu s-a putut porni plata.");
      if (data.url) window.location.href = data.url;
    } catch (e: any) {
      alert(
        e.message ||
          "Nu s-a putut porni plata. Verifică prețurile Stripe în .env.local."
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Coșul tău</h1>
      {items.length === 0 && <p>Coșul este gol.</p>}
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.key} className="card p-4 flex items-center justify-between">
            <div>
              {/* AICI folosim titlul afișat corect */}
              <div className="font-semibold">{titleForCart(i)}</div>
              <div className="text-sm text-gray-600">
                {/* poți adăuga detalii dacă vrei */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-bold">{i.priceRON} RON</div>
              <button onClick={() => remove(i.key!)} className="btn-cta btn-neutral">
                Șterge
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xl font-bold">Total: {total} RON</div>
          <div className="flex gap-3">
            <button className="btn-cta btn-neutral" onClick={() => router.push("/")}>
              Continuă cumpărăturile
            </button>
            <button className="btn-cta" onClick={checkout}>
              Plătește
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
