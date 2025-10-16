"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CreeazaCartePage(){
  const [childName, setChildName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState("");

  useEffect(()=>{
    if(!file){ setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return ()=> URL.revokeObjectURL(url);
  }, [file]);

  const submit = async ()=>{
    if(!file) { alert("Te rog încarcă o poză."); return; }
    if(!/^image\//.test(file.type)){ alert("Te rog încarcă un fișier imagine (jpg, png, webp)."); return; }
    const fd = new FormData();
    fd.append("photo", file);
    fd.append("childName", childName.slice(0,10));
    fd.append("parentEmail", parentEmail);
    fd.append("message", message);

    const res = await fetch("/api/creeaza-carte", { method: "POST", body: fd });
    const j = await res.json();
    if(!res.ok){ alert(j.error || "Eroare la trimitere."); return; }
    alert("Mulțumim! Fotografia a fost trimisă. Îți vom scrie pe email pentru confirmare.");
    setChildName(""); setParentEmail(""); setMessage(""); setFile(null); setPreview("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Creează-ți cartea</h1>
      <p className="text-gray-700 mb-6">
        Încarcă o <b>fotografie clară</b> a copilului (ideal <b>întreg corpul</b> și <b>fața complet vizibilă</b>, lumină bună, fără filtre). O vom folosi pentru a realiza <b>coperta</b> și <b>ilustrațiile</b> cărții personalizate.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Poză copil</label>
            <input type="file" accept="image/*" className="mt-1" onChange={(e)=> setFile(e.target.files?.[0] || null)}/>
            {preview ? (
              <div className="mt-3 relative w-full max-w-xs aspect-[3/4] overflow-hidden rounded-xl border">
                <Image src={preview} alt="Preview" fill sizes="200px" />
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">
                Acceptăm .jpg, .png, .webp. Dimensiuni recomandate &gt; 1200px lățime.
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Nume copil (opțional)</label>
            <input className="mt-1" value={childName} maxLength={10} onChange={e=>setChildName(e.target.value.slice(0,10))} placeholder="Edy" />
            <div className="text-xs text-gray-500">max. 10 caractere</div>
          </div>

          <div>
            <label className="block text-sm font-medium">Email părinte</label>
            <input className="mt-1" value={parentEmail} onChange={e=>setParentEmail(e.target.value)} placeholder="nume@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium">Mesaj (opțional)</label>
            <textarea className="mt-1" rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Detalii, preferințe sau întrebări..." />
          </div>

          <button className="btn-cta" onClick={submit}>Trimite fotografia</button>
          <div className="text-xs text-gray-500">
            * Prin trimiterea fotografiei confirmi că ești titularul drepturilor de utilizare și ești de acord să o folosim doar pentru realizarea cărții comandate.
          </div>
        </div>

        <div className="card p-6 space-y-3">
          <h3 className="font-semibold">Cum arată procesul</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
            <li>Încarci fotografia și ne scrii eventuale detalii.</li>
            <li>Îți confirmăm pe email primirea și detaliile.</li>
            <li>Realizăm coperta și cartea digitală (până la 24h).</li>
            <li>Poți opta și pentru <b>varianta tipărită</b> (livrare 5–7 zile).</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
