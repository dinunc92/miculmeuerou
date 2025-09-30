"use client";
import { useCart } from "@/lib/store/cart";
import { useRouter } from "next/navigation";

export default function CartPage(){
  const { items, remove } = useCart();
  const router = useRouter();
  const total = items.reduce((s,i)=> s+i.priceRON, 0);

  const checkout = async ()=>{
    const res = await fetch("/api/checkout", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    if(data.url) window.location.href = data.url;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Coșul tău</h1>
      {items.length===0 && <p>Coșul este gol.</p>}
      <div className="space-y-4">
        {items.map(i=>(
          <div key={i.key} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{i.title}</div>
              <div className="text-sm text-gray-600">
                {i.customization?.childName} ({i.customization?.age} ani) – {i.customization?.gender}, ochi {i.customization?.eyeColor}, păr {i.customization?.hairColor} ({i.customization?.hairstyle}) {i.customization?.glasses?"👓":""}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-bold">{i.priceRON} RON</div>
              <button onClick={()=>remove(i.key!)} className="btn-cta bg-gray-100">Șterge</button>
            </div>
          </div>
        ))}
      </div>
      {items.length>0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xl font-bold">Total: {total} RON</div>
          <div className="flex gap-3">
            <button className="btn-cta bg-gray-100" onClick={()=>router.push("/")} >Continuă cumpărăturile</button>
            <button className="btn-cta bg-brand-turquoise text-white" onClick={checkout}>Plătește (Stripe)</button>
          </div>
        </div>
      )}
    </div>
  );
}
