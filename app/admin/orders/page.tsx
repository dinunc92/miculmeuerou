// app/admin/orders/page.tsx
"use client";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  stripeSessionId: string;
  email: string;
  totalRON: number;
  wantPrinted: boolean;
  shippingFeeRON: number;
  status: string;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      const r = await fetch("/api/admin/orders");
      const d = await r.json();
      setItems(d.orders || []);
      setLoading(false);
    })();
  },[]);

  const retry = async (id: string) => {
    const r = await fetch("/api/admin/retry", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ orderId: id }) });
    const d = await r.json();
    alert(d.ok ? "Retrimitere pornită." : d.error || "Eroare");
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10">Se încarcă…</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Comenzi</h1>
      <div className="space-y-3">
        {items.map(o=>(
          <div key={o.id} className="p-3 rounded-xl border bg-white/70">
            <div className="font-semibold">{o.email} — {o.totalRON} RON</div>
            <div className="text-sm text-gray-600">
              Status: {o.status} • Tipărit: {o.wantPrinted ? "DA" : "NU"} • Transport: {o.shippingFeeRON} RON • {new Date(o.createdAt).toLocaleString()}
            </div>
            {o.status === "email_failed" && (
              <button className="btn-neutral mt-2" onClick={()=>retry(o.id)}>Reîncearcă trimiterea emailurilor</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
