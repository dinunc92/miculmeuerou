// app/(shop)/cart/page.tsx
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
  const printed = items.some((i)=> i?.customization?.wantPrinted);
  const shipping = printed ? 15 + 50 : 0; // transport 15 + print 50 (o singură dată)
  const subtotal = items.reduce((s, i) => s + i.priceRON, 0);
  const total = subtotal + shipping;

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
      alert(e.message || "Nu s-a putut porni plata.");
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
              <div className="font-semibold">{titleForCart(i)}</div>
              <div className="text-xs text-gray-600">
                {i.productType === "carte" && i.customization?.gender ? (
                  <> • {i.customization.gender} / {i.customization.eyeColor} / {i.customization.hairstyle}</>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-bold">{i.priceRON} RON</div>
              <button onClick={() => remove(i.key!)} className="btn-soft">
                Șterge
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <div>Subtotal</div>
            <div className="font-semibold">{subtotal} RON</div>
          </div>
          {printed && (
            <div className="flex items-center justify-between text-sm mt-1">
              <div>Tipărire + transport</div>
              <div className="font-semibold">{shipping} RON</div>
            </div>
          )}
          <div className="flex items-center justify-between text-lg mt-3">
            <div className="font-bold">Total</div>
            <div className="font-extrabold">{total} RON</div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {/* am scos „Continuă cumpărăturile” cum ai cerut */}
            <button className="btn-cta" onClick={checkout}>
              Plătește
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
