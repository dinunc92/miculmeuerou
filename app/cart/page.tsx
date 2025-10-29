"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { displayTitleFromPlaceholder } from "@/utils/title";
import Toast from "@/components/Toast";

type CartItem = {
  key?: string;
  productId: string;
  productType: "fise" | "carte" | "carte-custom";
  title: string;
  priceRON: number;
  customization?: {
    childName?: string;
    gender?: string;
    eyeColor?: string;
    hairstyle?: string;
    wantPrinted?: boolean;
    token?: string;
    coverId?: string;
    selectionTitle?: string;
    age?: number;
    relation?: string;
    relationName?: string;
  };
};

type Shipping = {
  name: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
};

function titleForCart(i: CartItem) {
  const name = i.customization?.childName || "";
  return displayTitleFromPlaceholder(i.title, name);
}

const EMAIL_MAX = 80;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CartPage() {
  const store = useCart();

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  // Items (persistență)
  const [items, setItems] = useState<CartItem[]>(store.items || []);
  useEffect(() => {
    if (store.items?.length) {
      setItems(store.items);
      localStorage.setItem("cart", JSON.stringify(store.items));
      return;
    }
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
  }, [store.items]);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const remove = (key?: string, idx?: number) => {
    if (store.remove && key) store.remove(key);
    setItems((prev) => {
      const arr = [...prev];
      if (typeof idx === "number") arr.splice(idx, 1);
      else if (key) return arr.filter((x) => x.key !== key);
      return arr;
    });
    showToast("Produsul a fost eliminat din coș.");
  };

  // Totaluri
  const printedCount = useMemo(
    () => items.filter((i) => i.customization?.wantPrinted).length,
    [items]
  );
  const hasPrinted = printedCount > 0;
  const shippingFee = hasPrinted ? 15 : 0; // o singură dată
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (i.priceRON || 0), 0),
    [items]
  );
  const total = subtotal + shippingFee;

  // Email × 2 (mereu cerute în checkout)
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const e1 = localStorage.getItem("checkout_email") || "";
      const e2 = localStorage.getItem("checkout_email2") || "";
      if (e1) setEmail1(e1);
      if (e2) setEmail2(e2);
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("checkout_email", email1);
  }, [email1]);
  useEffect(() => {
    localStorage.setItem("checkout_email2", email2);
  }, [email2]);

  function validateEmails() {
    const e: Record<string, string> = {};
    const v1 = email1.trim();
    const v2 = email2.trim();
    if (!v1 || v1.length > EMAIL_MAX || !EMAIL_RE.test(v1)) {
      e.email1 = "Introduceți un email valid (max 80 caractere).";
    }
    if (!v2 || v2.length > EMAIL_MAX || !EMAIL_RE.test(v2)) {
      e.email2 = "Confirmați un email valid (max 80 caractere).";
    }
    if (!e.email1 && !e.email2 && v1 !== v2) {
      e.email2 = "Emailurile nu coincid.";
    }
    setEmailErrors(e);
    return Object.keys(e).length === 0;
  }

  // Adresă (doar dacă e tipărit) + validări
  const [shipping, setShipping] = useState<Shipping>({
    name: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("shipping");
      if (raw) {
        const s = JSON.parse(raw);
        if (s && typeof s === "object") setShipping(s);
      }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("shipping", JSON.stringify(shipping));
  }, [shipping]);

  function validateAddress() {
    const e: Record<string, string> = {};
    if (!shipping.name.trim()) e.name = "Numele este obligatoriu.";
    if (!/^\d{10}$/.test(shipping.phone))
      e.phone = "Telefonul trebuie să conțină exact 10 cifre.";
    if (shipping.street.trim().length < 5 || shipping.street.trim().length > 80)
      e.street = "Strada trebuie să aibă între 5 și 80 caractere.";
    if (shipping.city.trim().length < 2 || shipping.city.trim().length > 50)
      e.city = "Orașul trebuie să aibă între 2 și 50 caractere.";
    if (!/^\d{6}$/.test(shipping.zip))
      e.zip = "Codul poștal trebuie să conțină exact 6 cifre.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // helpers input numeric pt. telefon/zip (restricționăm la tastare)
  const onPhoneChange = (v: string) => {
    const digits = v.replace(/\D+/g, "").slice(0, 10);
    setShipping({ ...shipping, phone: digits });
  };
  const onZipChange = (v: string) => {
    const digits = v.replace(/\D+/g, "").slice(0, 6);
    setShipping({ ...shipping, zip: digits });
  };

  // Checkout
  const checkout = async () => {
    if (!items.length) {
      showToast("Coșul este gol.");
      return;
    }
    if (!validateEmails()) {
      showToast("Verifică adresele de email.");
      return;
    }
    if (hasPrinted && !validateAddress()) {
      showToast("Completează corect adresa pentru livrarea tipărită.");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          email: email1.trim(),
          shipping: hasPrinted ? shipping : undefined,
        }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data?.error || "Eroare la pornirea plății.");
      if (data.url) {
        showToast("Te redirecționăm către plată…");
        window.location.href = data.url;
      }
    } catch (e: any) {
      showToast(e?.message || "Nu s-a putut porni plata. Încearcă din nou.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Coșul tău</h1>

      {/* 1) PRODUSE (prima secțiune) */}
      {items.length === 0 && <p>Coșul este gol.</p>}

      <div className="space-y-4">
        {items.map((i, idx) => (
          <div key={i.key || idx} className="card p-4">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="font-semibold truncate">{titleForCart(i)}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {i.productType === "carte-custom"
                    ? "Carte cu fotografia copilului"
                    : i.productType === "carte"
                    ? "Carte cu avatarul copilului"
                    : "Fișe educative"}
                </div>
                {i.customization?.wantPrinted && (
                  <div className="text-xs mt-1 text-violet-700">
                    Varianta tipărită selectată
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="font-bold">{i.priceRON} RON</div>
                <button
                  onClick={() => remove(i.key, idx)}
                  className="btn-neutral"
                  title="Șterge produsul"
                >
                  Șterge
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2) TOTAL + EMAIL + ADRESĂ (dedesubt) */}
      {items.length > 0 && (
        <div className="mt-6 space-y-6">
          {/* Total */}
          <div className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>Produse</div>
              <div className="font-semibold">{subtotal} RON</div>
            </div>

            {hasPrinted && (
              <div className="flex items-center justify-between text-sky-700">
                <div>Transport (o singură dată)</div>
                <div className="font-semibold">+ {shippingFee} RON</div>
              </div>
            )}

            <hr className="my-2" />

            <div className="flex items-center justify-between text-lg">
              <div className="font-bold">Total</div>
              <div className="font-extrabold">{total} RON</div>
            </div>
          </div>

          {/* Email × 2 (mereu) */}
          <div className="card p-4">
            <div className="font-semibold mb-3">Email client</div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value.slice(0, EMAIL_MAX))}
                  type="email"
                  className="mt-1"
                  placeholder="parinte@email.ro"
                />
                {emailErrors.email1 && (
                  <div className="text-red-600 text-xs mt-1">{emailErrors.email1}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Confirmă email</label>
                <input
                  value={email2}
                  onChange={(e) => setEmail2(e.target.value.slice(0, EMAIL_MAX))}
                  type="email"
                  className="mt-1"
                  placeholder="repetă emailul"
                />
                {emailErrors.email2 && (
                  <div className="text-red-600 text-xs mt-1">{emailErrors.email2}</div>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-3">
              Vom trimite materialele digitale și confirmarea comenzii la această adresă.
            </p>
          </div>

          {/* Adresă de livrare (doar dacă există tipărit) */}
          {hasPrinted && (
            <div className="card p-4">
              <div className="font-semibold mb-3">Adresă livrare (pentru varianta tipărită)</div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium">Nume destinatar</label>
                  <input
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    className="mt-1"
                    placeholder="Ex: Popescu Ana"
                  />
                  {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium">Telefon</label>
                  <input
                    value={shipping.phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    inputMode="numeric"
                    className="mt-1"
                    placeholder="07xx xxx xxx"
                  />
                  {errors.phone && <div className="text-red-600 text-xs mt-1">{errors.phone}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium">Stradă & nr.</label>
                  <input
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    className="mt-1"
                    placeholder="Str. Exemplu 1"
                    maxLength={80}
                  />
                  {errors.street && (
                    <div className="text-red-600 text-xs mt-1">{errors.street}</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium">Oraș</label>
                    <input
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="mt-1"
                      placeholder="București"
                      maxLength={50}
                    />
                    {errors.city && <div className="text-red-600 text-xs mt-1">{errors.city}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Cod poștal</label>
                    <input
                      value={shipping.zip}
                      onChange={(e) => onZipChange(e.target.value)}
                      inputMode="numeric"
                      className="mt-1"
                      placeholder="010101"
                    />
                    {errors.zip && <div className="text-red-600 text-xs mt-1">{errors.zip}</div>}
                  </div>
                </div>

                <p className="text-xs text-gray-600">
                  Adresa va fi inclusă în emailul de confirmare și în cel trimis către administrator.
                </p>
              </div>
            </div>
          )}

          {/* Buton Plătește */}
          <div className="flex justify-end">
            <button
              className="btn-cta px-8"
              onClick={checkout}
              disabled={!items.length}
              title="Plătește"
            >
              Mergi la plată
            </button>
          </div>
        </div>
      )}

      {toast && <Toast text={toast} />}
    </div>
  );
}
