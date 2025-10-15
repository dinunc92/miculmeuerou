"use client";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TITLURI = [
  { id:"ziua", name:"Ziua lui [NumeCopil]", cover:"/covers/ziua.jpg" },
  { id:"fara-suzi", name:"[NumeCopil] nu mai are nevoie de suzi", cover:"/covers/fara-suzi.jpg" },
  { id:"eroi-gradinita", name:"[NumeCopil] la grădinița eroilor", cover:"/covers/gradinita.jpg" },
];

export default function CustomBookPage(){
  const add = useCart(s=>s.add);
  const router = useRouter();

  const [childName, setChildName] = useState("");
  const [age, setAge] = useState<string>("");
  const [relation, setRelation] = useState("mama"); // mama, tata, bunica, bunic, pisica, catel
  const [relationName, setRelationName] = useState("");
  const [titleId, setTitleId] = useState(TITLURI[0].id);
  const [wantPrinted, setWantPrinted] = useState(false);

  const [photoNote, setPhotoNote] = useState(""); // ex. numele fișierului; upload real – ulterior

  const chosen = TITLURI.find(t=>t.id===titleId)!;
  const shownTitle = chosen.name.replace(/\[NumeCopil\]/g, (childName||"Eroul"));

  const submit = ()=>{
    if(!childName.trim()) return alert("Te rog numele copilului (max 10 caractere).");
    const ok = add({
      productId: "carte-custom",
      productType: "carte-custom",
      title: `Cartea eroului tău – [NumeCopil]`,
      priceRON: wantPrinted ? 199 + 79 : 199, // +79 RON varianta fizică (exemplu)
      image: "/thumbs/carte-custom.jpg",
      customization: {
        childName: childName.slice(0,10),
        age,
        relation,
        relationName,
        customTitleId: titleId,
        wantPrinted,
        photoNote
      }
    });
    if(!ok) return alert("Produs deja în coș cu aceeași personalizare.");
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Personalizează cartea eroului</h1>
      <p className="text-gray-700">
        Încarcă detaliile, alege coperta, iar noi îți livrăm <b>digital în 24 de ore</b>. Varianta tipărită este disponibilă contra cost suplimentar.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nume copil</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2"
              value={childName} maxLength={10} placeholder="Edy"
              onChange={e=> setChildName(e.target.value.slice(0,10))}/>
            <div className="text-xs text-gray-500">max. 10 caractere</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Vârstă</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" value={age} onChange={e=>setAge(e.target.value)} placeholder="4" />
            </div>
            <div>
              <label className="block text-sm font-medium">Dedicat de la</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" value={relation} onChange={e=>setRelation(e.target.value)}>
                <option value="mama">mama</option>
                <option value="tata">tata</option>
                <option value="bunica">bunica</option>
                <option value="bunic">bunic</option>
                <option value="pisica">pisica</option>
                <option value="catel">cățel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Nume (persoana care dedică)</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={relationName} onChange={e=>setRelationName(e.target.value)} placeholder="Ana" />
          </div>

          <div>
            <label className="block text-sm font-medium">Poză copil (opțional)</label>
            <input type="file" accept="image/*" className="mt-1 w-full"
                   onChange={(e)=> setPhotoNote(e.target.files?.[0]?.name || "")}/>
            <div className="text-xs text-gray-500 mt-1">Încarcă o poză clară, luminată. (Pentru MVP, răspunde la emailul de confirmare cu fotografia.)</div>
          </div>

          <div className="flex items-center gap-2">
            <input id="wantPrinted" type="checkbox" checked={wantPrinted} onChange={e=>setWantPrinted(e.target.checked)} />
            <label htmlFor="wantPrinted" className="text-sm">Vreau și varianta tipărită (+79 RON) + transport</label>
          </div>

          <button className="btn-cta mt-2" onClick={submit}>Adaugă în coș</button>

          <div className="text-xs text-gray-600 pt-2">
            Cartea va avea <b>20 pagini</b>, copertă cartonată (pentru varianta fizică), print de calitate, prindere cu capsă.
          </div>
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
                  {t.name.replace(/\[NumeCopil\]/g, (childName||"Eroul"))}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-brand-turquoise/10 text-sm">
            După plată primești <b>imediat confirmarea</b>, iar <b>cartea personalizată</b> îți este livrată pe email în <b>maxim 24 de ore</b>.
          </div>
        </div>
      </div>
    </div>
  );
}
