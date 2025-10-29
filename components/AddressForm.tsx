// components/AddressForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useCart, ShippingAddress } from "@/lib/store/cart";
import Toast from "@/components/Toast";

export default function AddressForm() {
  const { address, setAddress } = useCart();
  const [local, setLocal] = useState<ShippingAddress>({
    name: address?.name || "",
    phone: address?.phone || "",
    street: address?.street || "",
    city: address?.city || "",
    zip: address?.zip || "",
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // dacă se schimbă address din store, sincronizează
    if (address) setLocal(address);
  }, [address]);

  function onChange<K extends keyof ShippingAddress>(k: K, v: ShippingAddress[K]) {
    const next = { ...local, [k]: v };
    setLocal(next);
    setAddress(next); // salvează imediat în store + localStorage
  }

  function need(ok: boolean, msg: string) {
    if (!ok) {
      setToast(msg);
      setTimeout(() => setToast(null), 1600);
    }
    return ok;
  }

  // expun o validare pe care o poate apela pagina de coș (prin ref/dispatch dacă vrei).
  // Mai simplu: o lăsăm aici doar pentru UX – pagina de coș face oricum verificarea.
  const validate = () =>
    need(local.name.trim().length >= 3, "Te rugăm să completezi numele") &&
    need(local.phone.trim().length >= 6, "Te rugăm să completezi telefonul") &&
    need(local.street.trim().length >= 5, "Te rugăm să completezi adresa") &&
    need(local.city.trim().length >= 2, "Te rugăm să completezi orașul") &&
    need(local.zip.trim().length >= 4, "Te rugăm să completezi codul poștal");

  return (
    <div className="card p-4 mt-4">
      <div className="font-semibold mb-2">Adresa de livrare (necesară doar pentru varianta tipărită)</div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nume complet *</label>
          <input
            value={local.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Nume Prenume"
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Telefon *</label>
          <input
            value={local.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="07xxxxxxxx"
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Stradă, nr., bloc, ap. *</label>
          <input
            value={local.street}
            onChange={(e) => onChange("street", e.target.value)}
            placeholder="Str. Exemplu nr. 12, bl. A, ap. 3"
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Oraș *</label>
          <input
            value={local.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="București"
            className="mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Cod poștal *</label>
          <input
            value={local.zip}
            onChange={(e) => onChange("zip", e.target.value)}
            placeholder="010101"
            className="mt-1"
          />
        </div>
      </div>

      <button
        type="button"
        className="btn-soft mt-3"
        onClick={() => {
          if (validate()) {
            setToast("Adresă salvată ✅");
            setTimeout(() => setToast(null), 1000);
          }
        }}
      >
        Salvează adresa
      </button>

      {toast && <Toast text={toast} />}
    </div>
  );
}
