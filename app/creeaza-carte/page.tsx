"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { useCart } from "@/lib/store/cart";

type Cover = { id: string; src: string; label: string };

const COVERS: Cover[] = [
  { id: "cover1", src: "/covers/cover1.jpg", label: "Coperta 1" },
  { id: "cover2", src: "/covers/cover2.jpg", label: "Coperta 2" },
  { id: "cover3", src: "/covers/cover3.jpg", label: "Coperta 3" },
  { id: "cover4", src: "/covers/cover4.jpg", label: "Coperta 4" },
];

export default function CreeazaCarteaPage() {
  const router = useRouter();
  const { add } = useCart();

  // form state
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [relation, setRelation] = useState<"mama"|"tata"|"bunica"|"bunic">("mama");
  const [relationName, setRelationName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentEmail2, setParentEmail2] = useState("");
  const [wantPrinted, setWantPrinted] = useState(false);
  const [message, setMessage] = useState("");
  const [coverId, setCoverId] = useState<string>("cover1");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ui state
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string|null>(null);

  // validators (toate strict booleene)
  const emailValid =
    !!parentEmail &&
    parentEmail === parentEmail2 &&
    /\S+@\S+\.\S+/.test(parentEmail);

  const nameValid = childName.trim().length > 0 && childName.trim().length <= 10;
  const ageValid = (age === "" || (Number(age) >= 0 && Number(age) <= 99));
  const relationNameValid = relationName.trim().length <= 10;
  const photoValid = !!photo;

  function show(msg: string) {
    setToast(msg);
    // se închide singur din Toast (sau lasă-l 1.8s aici dacă preferi)
    setTimeout(() => setToast(null), 1800);
  }

  function need(ok: boolean, msg: string) {
    if (!ok) { show(msg); return false; }
    return true;
  }

  const onPhoto = (f: File | null) => {
    setPhoto(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  // DOAR adaugă în coș (nu pornim Stripe aici)
  const onAddToCart = async () => {
    if (!need(nameValid, "Te rugăm să introduci numele copilului (max 10).")) return;
    if (!need(emailValid, "Verifică adresa de email (de două ori).")) return;
    if (!need(photoValid, "Încarcă o fotografie clară a copilului.")) return;
    if (!need(ageValid, "Vârsta trebuie să fie între 0 și 99.")) return;
    if (!need(relationNameValid, "Numele persoanei care dedică (max 10).")) return;

    setSubmitting(true);
    try {
      const priceRON = 40 + (wantPrinted ? 50 + 15 : 0); // 40 carte, +50 tipărit, +15 transport
      add({
        productId: "carte-custom",
        productType: "carte-custom",
        title: "Carte personalizată pentru [NumeCopil]",
        priceRON,
        customization: {
          childName,
          age: age === "" ? undefined : age,
          relation,
          relationName: relationName || undefined,
          parentEmail,
          wantPrinted,
          coverId,
          message: message || undefined,
          // NOTĂ: nu păstrăm fișierul foto în localStorage/coș.
          // Îl vei încărca în pasul de după plată (webhook) sau într-un endpoint separat când decizi tu.
        }
      });

      show("Produs adăugat în coș ✅");
      setTimeout(() => router.push("/cart"), 700);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Creează-ți cartea</h1>
      <p className="text-gray-700 mb-2">
        Această carte va folosi <b>fotografia copilului</b> și va genera un <b>personaj stil „cartoon”</b> (stil „cartonat”).
        O primești pe email în <b>maxim 48h</b> în format PDF. Varianta tipărită ajunge în <b>5–7 zile lucrătoare</b>.
      </p>

      {/* Insigne */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">PDF în 48h</span>
        <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">Tipărit 5–7 zile</span>
      </div>

      <div className="card p-4 space-y-4 mt-4">
        {/* Poza */}
        <div>
          <label className="block text-sm font-medium">Fotografia copilului *</label>
          {preview ? (
            <div className="mt-2 flex items-center gap-3">
              <img src={preview} alt="Previzualizare" className="w-32 h-32 object-cover rounded-xl border" />
              <button className="btn-neutral" onClick={() => { setPhoto(null); setPreview(null); }}>
                Șterge
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              className="mt-1"
              onChange={(e) => onPhoto(e.target.files?.[0] || null)}
            />
          )}
          <p className="text-xs text-gray-500 mt-1">
            Alege o fotografie luminoasă, clară, în care copilul se vede bine (fața întreagă).
          </p>
        </div>

        {/* Nume + vârsta */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Nume copil (max 10) *</label>
            <input
              value={childName}
              onChange={(e) => setChildName(e.target.value.slice(0,10))}
              placeholder="Edy"
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Vârsta (0–99)</label>
            <input
              type="number"
              min={0}
              max={99}
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Math.max(0, Math.min(99, Number(e.target.value))))}
              className="mt-1"
              placeholder="4"
            />
          </div>
        </div>

        {/* Dedicat de la */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Dedicat de la</label>
            <select className="mt-1 bg-white" value={relation} onChange={(e)=>setRelation(e.target.value as any)}>
              <option value="mama">mama</option>
              <option value="tata">tata</option>
              <option value="bunica">bunica</option>
              <option value="bunic">bunic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Nume persoană (max 10)</label>
            <input
              value={relationName}
              onChange={(e)=>setRelationName(e.target.value.slice(0,10))}
              className="mt-1"
              placeholder="Ana"
            />
          </div>
        </div>

        {/* Email + confirmare */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Email părinte *</label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e)=>setParentEmail(e.target.value)}
              className="mt-1"
              placeholder="parinte@email.ro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirmă email *</label>
            <input
              type="email"
              value={parentEmail2}
              onChange={(e)=>setParentEmail2(e.target.value)}
              className="mt-1"
              placeholder="repetă emailul"
            />
          </div>
        </div>

        {/* Coperti */}
        <div>
          <label className="block text-sm font-medium mb-2">Alege coperta</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COVERS.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={()=>setCoverId(c.id)}
                className={`rounded-xl overflow-hidden border transition ${coverId===c.id ? "ring-2 ring-[var(--brand-turquoise)]" : ""}`}
                aria-pressed={coverId===c.id}
                title={c.label}
              >
                <img src={c.src} alt={c.label} className="w-full h-28 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Tipărit */}
          <label className="inline-flex items-center gap-2 mt-3">
          <input type="checkbox" checked={wantPrinted} onChange={(e)=>setWantPrinted(e.target.checked)} className="input-chk"/>
          <span>Vreau și varianta tipărită (+50 RON) + transport</span>
        </label>

        {/* Mesaj opțional */}
        <div>
          <label className="block text-sm font-medium">Mesaj pentru noi (opțional)</label>
          <textarea
            className="mt-1"
            rows={4}
            maxLength={500}
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            placeholder="Detalii sau preferințe speciale…"
          />
          <div className="text-xs text-gray-500 text-right">{message.length}/500</div>
        </div>

        {/* submit */}
        <div className="flex items-center gap-3">
          <button className="btn-cta" disabled={submitting} onClick={onAddToCart}>
            {submitting ? "Se adaugă…" : "Adaugă în coș"}
          </button>
          <span className="text-xs text-gray-500">După adăugare, vei fi dus(ă) în coș.</span>
        </div>
      </div>

      {toast && <Toast text={toast} kind="info" onClose={()=>setToast(null)} />}
    </div>
  );
}
