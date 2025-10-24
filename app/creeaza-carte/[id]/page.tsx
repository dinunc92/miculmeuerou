// app/creeaza-carte/[id]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import Toast from "@/components/Toast";

const MAP_TITLURI: Record<string, string> = {
  "colinde":"Edy și magia colindelor românești",
  "cadou":"Moș Crăciun a uitat un cadou!",
  "dovleci":"Noaptea dovlecilor veseli",
  "cu-mama":"O zi cu mama mea minunată",
  "cu-tata":"O zi cu tata – cel mai curajos erou",
  "bunici":"Weekend la bunici",
  "gradinita":"Edy merge la grădiniță",
  "creste":"Edy vrea să crească mare",
  "curtea":"Edy și prietenii din curtea blocului",
  "multumesc":"Ziua în care Edy a învățat să spună «Mulțumesc»",
};

export default function CreeazaCarteaPersonalizare() {
  const { id } = useParams<{id:string}>();
  const titleId = Array.isArray(id) ? id[0] : id;
  const selectedTitle = MAP_TITLURI[titleId] || "Carte personalizată pentru [NumeCopil]";

  const router = useRouter();
  const { add } = useCart();

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
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string|null>(null);

  function show(msg:string){ setToast(msg); setTimeout(()=>setToast(null), 1800); }
  function need(ok:boolean, msg:string){ if(!ok){show(msg); return false} return true; }

  const emailValid = !!parentEmail && parentEmail===parentEmail2 && /\S+@\S+\.\S+/.test(parentEmail);
  const nameValid = childName.trim().length > 0 && childName.trim().length <= 10;
  const ageValid = (age === "" || (Number(age) >= 0 && Number(age) <= 99));
  const relationNameValid = relationName.trim().length <= 10;
  const photoValid = !!photo;

  const onPhoto = (f: File | null) => {
    setPhoto(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onAddToCart = async () => {
    if (!need(nameValid, "Introdu numele copilului (max 10).")) return;
    if (!need(emailValid, "Verifică adresa de email (de două ori).")) return;
    if (!need(photoValid, "Încarcă fotografia copilului.")) return;
    if (!need(ageValid, "Vârsta trebuie să fie între 0 și 99.")) return;
    if (!need(relationNameValid, "Numele persoanei care dedică (max 10).")) return;

    setSubmitting(true);
    try {
      // upload foto → token
      let token: string | undefined = undefined;
      if (photo) {
        const fd = new FormData();
        fd.append("file", photo);
        const up = await fetch("/api/custom-asset", { method:"POST", body: fd });
        const data = await up.json();
        if (!up.ok) throw new Error(data?.error || "Eroare upload foto.");
        token = data.token;
      }

      const priceRON = 40 + (wantPrinted ? 50 : 0);

      add({
        productId: "carte-custom",
        productType: "carte-custom",
        title: selectedTitle,
        priceRON,
        customization: {
          childName, age: age===""?undefined:age,
          relation, relationName: relationName || undefined,
          parentEmail, wantPrinted, coverId,
          message: message || undefined,
          token,
          selectedTitleId: titleId, selectedTitle
        }
      });

      show("Produs adăugat în coș ✅");
      setTimeout(()=> router.push("/cart"), 700);
    } catch (e:any) {
      show(e?.message || "Eroare la adăugare în coș.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Personalizează-ți cartea</h1>
      <p className="text-gray-700 mb-4">
        Poveste: <b>{selectedTitle}</b>. Încarcă fotografia și completează detaliile. PDF în 48h, tipărit în 5–7 zile.
      </p>

      <div className="card p-4 space-y-4">
        {/* Foto */}
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
            <input type="file" accept="image/*" className="mt-1" onChange={(e)=>onPhoto(e.target.files?.[0] || null)} />
          )}
          <p className="text-xs text-gray-500 mt-1">
            Alege o fotografie luminoasă, clară (fața întreagă să fie vizibilă).
          </p>
        </div>

        {/* Nume + vârstă */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Nume copil (max 10) *</label>
            <input value={childName} onChange={(e)=>setChildName(e.target.value.slice(0,10))} placeholder="Edy" className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Vârsta (0–99)</label>
            <input
              type="number"
              min={0} max={99}
              value={age}
              onChange={(e)=>setAge(e.target.value===""?"":Math.max(0,Math.min(99,Number(e.target.value))))}
              className="mt-1" placeholder="4"
            />
          </div>
        </div>

        {/* Dedicat */}
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
            <input value={relationName} onChange={(e)=>setRelationName(e.target.value.slice(0,10))} className="mt-1" placeholder="Ana" />
          </div>
        </div>

        {/* Email + confirmare */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Email părinte *</label>
            <input type="email" value={parentEmail} onChange={(e)=>setParentEmail(e.target.value)} className="mt-1" placeholder="parinte@email.ro" />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirmă email *</label>
            <input type="email" value={parentEmail2} onChange={(e)=>setParentEmail2(e.target.value)} className="mt-1" placeholder="repetă emailul" />
          </div>
        </div>

        {/* Coperți simple (opțional, lasă-le dacă vrei și aici) */}
        <div>
          <label className="block text-sm font-medium mb-2">Alege coperta</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["cover1","cover2","cover3","cover4"].map(c => (
              <button
                type="button" key={c}
                onClick={()=>setCoverId(c)}
                className={`rounded-xl overflow-hidden border transition ${coverId===c ? "ring-2 ring-[var(--brand-turquoise)]" : ""}`}
              >
                <img src={`/covers/${c}.jpg`} alt={c} className="w-full img-tall" />
              </button>
            ))}
          </div>
        </div>

        {/* Tipărit */}
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={wantPrinted} onChange={(e)=>setWantPrinted(e.target.checked)} className="input-chk"/>
          <span>Vreau și varianta tipărită (+50 RON) + transport (+15 RON)</span>
        </label>

        {/* Mesaj opțional */}
        <div>
          <label className="block text-sm font-medium">Mesaj pentru noi (opțional)</label>
          <textarea className="mt-1" rows={4} maxLength={500} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Detalii sau preferințe speciale…" />
          <div className="text-xs text-gray-500 text-right">{message.length}/500</div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-cta" disabled={submitting} onClick={onAddToCart}>
            {submitting ? "Se adaugă…" : "Adaugă în coș"}
          </button>
        </div>
      </div>

      {toast && <Toast text={toast} kind="info" onClose={()=>setToast(null)} />}
    </div>
  );
}
