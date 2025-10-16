"use client";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/store/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TITLURI = [
  { id:"ziua",            name:"Ziua lui [NumeCopil]",                 cover:"/covers/ziua.jpg" },
  { id:"fara-suzi",       name:"[NumeCopil] nu mai are nevoie de suzi", cover:"/covers/fara-suzi.jpg" },
  { id:"eroi-gradinita",  name:"[NumeCopil] la grădinița eroilor",      cover:"/covers/gradinita.jpg" },
  { id:"in-parc",         name:"[NumeCopil] în parc",                   cover:"/covers/parc.jpg" },
  { id:"la-mare",         name:"[NumeCopil] la mare",                   cover:"/covers/mare.jpg" },
  { id:"la-munte",        name:"[NumeCopil] la munte",                  cover:"/covers/munte.jpg" },
  { id:"aventura",        name:"Aventura lui [NumeCopil]",              cover:"/covers/aventura.jpg" },
  { id:"robotel",         name:"[NumeCopil] și roboțelul curios",       cover:"/covers/robotel.jpg" },
  { id:"numere",          name:"[NumeCopil] învață să numere",          cover:"/covers/numere.jpg" },
  { id:"sentimente",      name:"[NumeCopil] și cutia cu sentimente",    cover:"/covers/sentimente.jpg" },
];

export default function CustomBookPage(){
  const add = useCart(s=>s.add);
  const router = useRouter();

  const [childName, setChildName] = useState("");
  const [age, setAge] = useState<string>("");
  const [relation, setRelation] = useState("mama"); // mama, tata, bunica, bunic
  const [relationName, setRelationName] = useState("");
  const [titleId, setTitleId] = useState(TITLURI[0].id);
  const [wantPrinted, setWantPrinted] = useState(false);

  // Foto: preview + păstrăm un "url" local (nu îl încărcăm în cloud în MVP)
  const [photoFile, setPhotoFile] = useState<File|null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const inputRef = useRef<HTMLInputElement|null>(null);

  useEffect(()=>{
    if(!photoFile) { setPhotoPreview(""); return; }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const chosen = TITLURI.find(t=>t.id===titleId)!;
  const shownTitle = chosen.name.replace(/\[NumeCopil\]/g, (childName||"Edy"));

  const validate = ()=>{
    if(!childName.trim()) return "Te rog numele copilului (max 10 caractere).";
    if(childName.trim().length > 10) return "Numele copilului are max. 10 caractere.";
    if(age && (!/^\d{1,2}$/.test(age) || Number(age) > 99)) return "Vârsta trebuie să fie un număr între 0 și 99.";
    if(!relation) return "Alege persoana care dedică (mama/tata/bunica/bunic).";
    if(relationName && relationName.trim().length > 10) return "Numele persoanei care dedică are max. 10 caractere.";
    // foto este opțională, dar dacă există, o preview-uim deja (nu trecem prin validare)
    return "";
  };

  const submit = ()=>{
    const err = validate();
    if(err) return alert(err);

    const ok = add({
      productId: "carte-custom",
      productType: "carte-custom",
      title: "Cartea eroului tău – [NumeCopil]",
      priceRON: wantPrinted ? (199 + 79) : 199,
      image: chosen.cover,
      customization: {
        childName: childName.slice(0,10),
        age,
        relation,
        relationName: relationName.slice(0,10),
        customTitleId: titleId,
        wantPrinted,
        // MVP: nu încărcăm imaginea în cloud; includem doar numele fișierului pentru admin
        photoNote: photoFile?.name || "",
      }
    });
    if(!ok) return alert("Produs deja în coș cu aceeași personalizare.");
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Personalizează cartea eroului</h1>
      <p className="text-gray-700">
        Alege coperta (mai jos), încarcă o poză clară și completează detaliile. Primești varianta digitală pe email în <b>maxim 24 de ore</b>. Dacă alegi varianta tipărită (+79 RON, transport inclus), livrarea se face în <b>5–7 zile lucrătoare</b>.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nume copil</label>
            <input className="mt-1" value={childName} maxLength={10} placeholder="Edy" onChange={e=>setChildName(e.target.value.slice(0,10))}/>
            <div className="text-xs text-gray-500">max. 10 caractere</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Vârstă</label>
              <input className="mt-1" value={age} placeholder="4" inputMode="numeric" onChange={e=>setAge(e.target.value.replace(/[^\d]/g,"").slice(0,2))}/>
              <div className="text-xs text-gray-500">0–99</div>
            </div>
            <div>
              <label className="block text-sm font-medium">Dedicat de la</label>
              <select className="mt-1 bg-white" value={relation} onChange={e=>setRelation(e.target.value)}>
                <option value="mama">mama</option>
                <option value="tata">tata</option>
                <option value="bunica">bunica</option>
                <option value="bunic">bunic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Nume (persoana care dedică)</label>
            <input className="mt-1" value={relationName} onChange={e=>setRelationName(e.target.value.slice(0,10))} placeholder="Ana" maxLength={10}/>
            <div className="text-xs text-gray-500">max. 10 caractere</div>
          </div>

          <div>
            <label className="block text-sm font-medium">Poză copil (opțional)</label>
            <input ref={inputRef} type="file" accept="image/*" className="mt-1"
                   onChange={(e)=> setPhotoFile(e.target.files?.[0] || null)}/>
            {photoPreview ? (
              <div className="mt-3 relative w-full max-w-xs aspect-[3/4] overflow-hidden rounded-xl border">
                <Image src={photoPreview} alt="preview" fill sizes="200px" />
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">Încarcă o poză clară, luminată (vom folosi această imagine pentru copertă/ilustrații).</div>
            )}
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={wantPrinted} onChange={e=>setWantPrinted(e.target.checked)} />
            <span>Vreau și varianta tipărită (+79 RON) + transport</span>
          </label>

          <button className="btn-cta mt-2" onClick={submit}>
            Adaugă în coș – {shownTitle}
          </button>
        </div>

        <div className="card p-6">
          <div className="grid grid-cols-2 gap-4">
            {TITLURI.map(t=>(
              <button key={t.id} onClick={()=> setTitleId(t.id)}
                className={`rounded-xl border p-2 text-left hover:shadow transition ${t.id===titleId ? "ring-2 ring-brand-turquoise border-brand-turquoise" : "border-gray-200"}`}>
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
                  <Image src={t.cover} alt={t.name} fill sizes="200px"/>
                </div>
                <div className="mt-2 text-sm font-medium">
                  {t.name.replace(/\[NumeCopil\]/g, (childName||"Edy"))}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-brand-turquoise/10 text-sm">
            * Imaginile din această secțiune reprezintă <b>coperțile</b> disponibile.
          </div>
        </div>
      </div>
    </div>
  );
}
