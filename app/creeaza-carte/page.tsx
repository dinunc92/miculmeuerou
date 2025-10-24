"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Carousel from "@/components/Carousel";
import { COVERS } from "@/components/CreateBookData";
import Toast from "@/components/Toast";
import { useCart } from "@/lib/store/cart";

/** helper validări + progres */
function pct(...vals: boolean[]) {
  const total = vals.length;
  const good = vals.filter(Boolean).length;
  return Math.round((good / total) * 100);
}

export default function CreeazaCarteaPage() {
  const params = useSearchParams();
  const router = useRouter();
  const preselect = params.get("cover") || undefined;

  const [coverId, setCoverId] = useState<string>(preselect || COVERS[0].id);
  const cover = useMemo(() => COVERS.find(c => c.id === coverId)!, [coverId]);

  const [childName, setChildName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [relation, setRelation] = useState<"mama"|"tata"|"bunica"|"bunic">("mama");
  const [relationName, setRelationName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentEmail2, setParentEmail2] = useState("");
  const [wantPrinted, setWantPrinted] = useState(false);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // preselectare din query
  useEffect(() => {
    if (preselect && COVERS.some(c => c.id === preselect)) setCoverId(preselect);
  }, [preselect]);

  // pre-preview foto
  const onPhoto = (f: File | null) => {
    setPhoto(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  // validări
  const emailValid = !!parentEmail && parentEmail === parentEmail2 && /\S+@\S+\.\S+/.test(parentEmail);
  const nameValid = childName.trim().length > 0 && childName.trim().length <= 10;
  const ageValid = (age === "" || (Number(age) >= 0 && Number(age) <= 99));
  const relationNameValid = relationName.trim().length <= 10;
  const photoValid = !!photo;
  const coverValid = !!coverId;

  const progress = pct(nameValid, emailValid, coverValid, photoValid);

  // toast helper
  function need(ok: boolean, msg: string) {
    if (!ok) { setToast(msg); setTimeout(() => setToast(null), 1800); }
    return ok;
  }

  // upload poza -> token (pentru email admin & urmărire)
  async function uploadPhotoGetToken(): Promise<string | null> {
    if (!photo) return null;
    const fd = new FormData();
    fd.append("photo", photo);
    const res = await fetch("/api/custom-asset", { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return data?.token || null;
  }

  // adaugă în coș (NU direct la plată)
  const addToCart = async () => {
    if (!need(nameValid, "Te rugăm să introduci numele copilului (max 10).")) return;
    if (!need(emailValid, "Verifică adresa de email (introdu de 2 ori corect).")) return;
    if (!need(photoValid, "Încarcă o fotografie clară a copilului.")) return;
    if (!need(coverValid, "Alege o copertă.")) return;

    setSubmitting(true);
    try {
      const token = await uploadPhotoGetToken(); // poate fi null dacă nu reușește

      // prețuri: PDF 40 RON, tipărirea + transportul sunt adăugate separat în coș (o singură dată/ comandă)
      const item = {
        productId: "creeaza-carte",
        productType: "carte-custom",
        title: cover?.title || "Carte personalizată",
        priceRON: 40,
        customization: {
          childName,
          age: age === "" ? undefined : Number(age),
          relation,
          relationName: relationName || undefined,
          parentEmail,
          wantPrinted,
          coverId,
          token: token || undefined,
          selectionTitle: cover?.title || undefined,
        }
      };

      // încearcă să folosești store-ul global (dacă există)
      let ok = false;
      try {
        const add = (useCart as any)?.getState?.()?.add;
        if (typeof add === "function") { add(item); ok = true; }
      } catch {}
      // fallback localStorage
      if (!ok) {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      setToast("Cartea a fost adăugată în coș ✅");
      setTimeout(() => {
        setToast(null);
        // direct în coș
        (window as any).location = "/cart";
      }, 700);
    } finally {
      setSubmitting(false);
    }
  };

  // imagini pentru cover selectat (cover + previews)
  const images = [cover.src, ...(cover.previews || [])];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Personalizează-ți cartea</h1>
      <p className="text-gray-700">
        Alege o copertă, încarcă fotografia copilului și completează detaliile. Varianta <b>PDF costă 40 RON</b>.
        Opțional, <b>tipărirea + livrarea</b> se fac în <b>5–7 zile</b> (+65 RON total).
      </p>

      {/* progres */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-[var(--brand-turquoise)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs mt-1 text-gray-600">Progres: {progress}%</div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-8">
        {/* STÂNGA: cover selectat + evidențiere + carusel */}
        <div>
          <Carousel images={images} height={520} />
          <div className="mt-2 text-sm text-gray-700">
            Coperta selectată: <b>{cover?.title}</b>
          </div>

          {/* select copertă – grid cu evidențiere */}
          <div className="mt-3">
            <div className="grid grid-cols-3 gap-3">
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
          </div>

          {/* insigne informative */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">PDF 40 RON</span>
            <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">Tipărit 5–7 zile (+65 RON)</span>
          </div>
        </div>

        {/* DREAPTA: formular */}
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
            <p className="text-xs text-gray-500 mt-1">
              Alege o fotografie clară, luminoasă, în care se vede bine fața copilului.
            </p>
          </div>

          {/* nume + varsta */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium">Nume copil (max 10) *</label>
              <input value={childName} onChange={(e)=>setChildName(e.target.value.slice(0,10))} className="mt-1" placeholder="Edy" />
            </div>
            <div>
              <label className="block text-sm font-medium">Vârsta (0–99)</label>
              <input
                type="number" min={0} max={99}
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
              <label className="block text-sm font-medium">Nume persoană (max 10)</label>
              <input value={relationName} onChange={(e)=>setRelationName(e.target.value.slice(0,10))} className="mt-1" placeholder="Ana" />
            </div>
          </div>

          {/* email + confirm */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium">Email părinte *</label>
              <input type="email" value={parentEmail} onChange={(e)=>setParentEmail(e.target.value)} className="mt-1" placeholder="parinte@email.ro" />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirmă email *</label>
              <input type="email" value={parentEmail2} onChange={(e)=>setParentEmail2(e.target.value)} className="mt-1" placeholder="repetă emailul" />
            </div>
          </div>

          {/* tiparit */}
          <label className="inline-flex items-center gap-2 mt-3">
            <input type="checkbox" className="input-chk" checked={wantPrinted} onChange={(e)=>setWantPrinted(e.target.checked)} />
            <span>Vreau și varianta tipărită (+65 RON • 5–7 zile)</span>
          </label>

          {/* mesaj optional */}
          <div className="mt-3">
            <label className="block text-sm font-medium">Mesaj pentru noi (opțional)</label>
            <textarea rows={4} maxLength={500} value={message} onChange={(e)=>setMessage(e.target.value)} className="mt-1" placeholder="Detalii sau preferințe speciale…" />
            <div className="text-xs text-gray-500 text-right">{message.length}/500</div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button className="btn-cta" disabled={submitting} onClick={addToCart}>
              {submitting ? "Se adaugă…" : "Adaugă în coș"}
            </button>
            <span className="text-sm text-gray-600">PDF 40 RON • Tipărire & livrare (+65 RON) opțional</span>
          </div>
        </div>
      </div>

      {toast && <Toast text={toast} />}
    </div>
  );
}
