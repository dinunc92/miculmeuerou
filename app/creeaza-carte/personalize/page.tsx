"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Carousel from "@/components/Carousel";
import { COVERS } from "@/components/CreateBookData";
import Toast from "@/components/Toast";
import { useCart } from "@/lib/store/cart";

/** mic util pt progres */
function pct(...vals: boolean[]) {
  const t = vals.length;
  const g = vals.filter(Boolean).length;
  return Math.round((g / t) * 100);
}

export default function CreeazaCarteaPage() {
  const params = useSearchParams();
  const preselect = params.get("cover") || undefined;

  const [coverId, setCoverId] = useState<string>(preselect || COVERS[0].id);
  const cover = useMemo(() => COVERS.find((c) => c.id === coverId)!, [coverId]);

  const [childName, setChildName] = useState("Edy");
  const [age, setAge] = useState<number | "">("");
  const [relation, setRelation] = useState<"mama" | "tata" | "bunica" | "bunic">("mama");
  const [relationName, setRelationName] = useState("");
  const [parentEmail, setParentEmail] = useState(""); // — client form
  const [parentEmail2, setParentEmail2] = useState("");
  const [wantPrinted, setWantPrinted] = useState(false);
  const [message, setMessage] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // store (Zustand) — îl folosim întâi, dar avem și fallback la localStorage
  const store = useCart();

  useEffect(() => {
    if (preselect && COVERS.some((c) => c.id === preselect)) setCoverId(preselect);
  }, [preselect]);

  const onPhoto = (f: File | null) => {
    setPhoto(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  // validări
  const emailValid = !!parentEmail && parentEmail === parentEmail2 && /\S+@\S+\.\S+/.test(parentEmail);
  const nameValid = childName.trim().length > 0 && childName.trim().length <= 10;
  const ageValid = age === "" || (Number(age) >= 0 && Number(age) <= 20);
  const relationNameValid = relationName.trim().length <= 10;
  const photoValid = !!photo;
  const coverValid = !!coverId;

  const progress = pct(nameValid, emailValid, coverValid, photoValid);

  function need(ok: boolean, msg: string) {
    if (!ok) {
      setToast(msg);
      setTimeout(() => setToast(null), 1600);
    }
    return ok;
  }

  async function uploadPhotoGetToken(): Promise<string | null> {
    if (!photo) return null;
    const fd = new FormData();
    fd.append("file", photo);
    const res = await fetch("/api/custom-asset", { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return data?.token || null;
  }

  const addToCart = async () => {
    if (!need(nameValid, "Introdu numele copilului (max 10).")) return;
    if (!need(photoValid, "Încarcă o fotografie clară.")) return;
    if (!need(coverValid, "Alege o copertă.")) return;

    setSubmitting(true);
    try {
      const token = await uploadPhotoGetToken(); // poate fi null la eșec

      const base = 40; // PDF
      const printExtra = wantPrinted ? 50 : 0;

      const item = {
        productId: "creeaza-carte",
        productType: "carte-custom" as const,
        title: cover?.title || "Carte personalizată din fotografie pentru [NumeCopil]",
        priceRON: base + printExtra,
        customization: {
          childName,
          age: age === "" ? undefined : Number(age),
          relation,
          relationName: relationName || undefined,
          wantPrinted,
          coverId,
          selectionTitle: cover?.title || undefined,
          token: token || undefined,
          message,       // <<—
        },
      };

      // 1) încearcă prin store
      let ok = false;
      try {
        const add = (useCart as any)?.getState?.()?.add;
        if (typeof add === "function") {
          add(item);
          ok = true;
        }
      } catch {}

      // 2) fallback localStorage
      if (!ok) {
        const arr = JSON.parse(localStorage.getItem("cart") || "[]");
        arr.push({ ...item, key: `${item.productId}-${Date.now()}` });
        localStorage.setItem("cart", JSON.stringify(arr));
      }

      setToast("Cartea a fost adăugată în coș ✅");
      setTimeout(() => {
        setToast(null);
        (window as any).location = "/cart";
      }, 700);
    } finally {
      setSubmitting(false);
    }
  };

  const images = [cover.src, ...(cover.previews || [])]; // copertă + 4 previews

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Personalizează-ți cartea</h1>
      <p className="text-gray-700">
        Alege o copertă, încarcă fotografia copilului și completează detaliile. Varianta <b>PDF costă 40 RON</b>.
        {` `}Opțional, <b>tipărirea + livrarea</b> sunt în <b>5–7 zile lucrătoare</b> (+50 RON + transport).
      </p>

      {/* progres */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-2 bg-[var(--brand-turquoise)] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs mt-1 text-gray-600">Progres: {progress}%</div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-8">
        {/* stânga: vizual + select cover */}
        <div>
          <Carousel images={images} height={520} />
          <div className="mt-2 text-sm text-gray-700">
            Coperta selectată: <b>{cover?.title}</b>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {COVERS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCoverId(c.id)}
                className={`rounded-xl overflow-hidden border transition ${
                  coverId === c.id ? "ring-2 ring-[var(--brand-lilac)]" : ""
                }`}
                title={c.title}
              >
                <img src={c.src} alt={c.title} className="w-full h-28 object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">PDF 40 RON</span>
            <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              Tipărit 5–7 zile lucrătoare (+50 RON + transport)
            </span>
          </div>
        </div>

        {/* dreapta: formular */}
        <div>
          {/* foto */}
          <div>
            <label className="block text-sm font-medium">Fotografia copilului *</label>
            {preview ? (
              <div className="mt-2 flex items-center gap-3">
                <img src={preview} alt="Previzualizare" className="w-32 h-32 object-cover rounded-xl border" />
                <button className="btn-soft" onClick={() => { setPhoto(null); setPreview(null); }}>
                  Schimbă fotografia
                </button>
              </div>
            ) : (
              <input type="file" accept="image/*" className="mt-1" onChange={(e)=>onPhoto(e.target.files?.[0]||null)} />
            )}
            <p className="text-xs text-gray-500 mt-1">Alege o fotografie clară, luminoasă, cu fața copilului vizibilă.</p>
          </div>

          {/* nume + vârstă */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium">Nume copil*</label>
              <input value={childName} onChange={(e)=>setChildName(e.target.value.slice(0,10))} className="mt-1" placeholder="Edy" />
            </div>
            <div>
              <label className="block text-sm font-medium">Vârsta (0–20)</label>
              <input
                type="number" min={0} max={20}
                value={age}
                onChange={(e)=> setAge(e.target.value==="" ? "" : Math.max(0, Math.min(99, Number(e.target.value)))) }
                className="mt-1" placeholder="4"
              />
            </div>
          </div>

          {/* dedicat */}
          <div className="grid grid-cols-2 gap-4 mt-3">
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
              <label className="block text-sm font-medium">Nume persoană</label>
              <input value={relationName} onChange={(e)=>setRelationName(e.target.value.slice(0,10))} className="mt-1" placeholder="Ana" />
            </div>
          </div>

          {/* tipărit */}
          <label className="inline-flex items-center gap-2 mt-3">
            <input type="checkbox" className="input-chk" checked={wantPrinted} onChange={(e)=>setWantPrinted(e.target.checked)} />
            <span>Vreau și varianta tipărită (+50 RON + transport)</span>
          </label>

          {/* mesaj opțional */}
          <div className="mt-3">
            <label className="block text-sm font-medium">Mesaj pentru noi (opțional)</label>
            <textarea rows={4} maxLength={500} value={message} onChange={(e)=>setMessage(e.target.value)} className="mt-1" placeholder="Detalii sau preferințe speciale…" />
            <div className="text-xs text-gray-500 text-right">{message.length}/500</div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button className="btn-cta" disabled={submitting} onClick={addToCart}>
              {submitting ? "Se adaugă…" : "Adaugă în coș"}
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast text={toast} />}
    </div>
  );
}
