"use client";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import AvatarPreview from "./AvatarPreview";
import Stepper from "./Stepper";
import { useRouter } from "next/navigation";

const GENDERS=["băiat","fată"];
const EYES=["căprui","albaștri","verzi","negri"];
const HAIR=["șaten","blond","brunet","roșcat"];
const HAIRSTYLES=["scurt","mediu","lung","bucle"];
export type PersonalData = {
  childName:string; age:string; gender:string; eyeColor:string; hairColor:string; hairstyle:string; glasses:boolean;
};

export default function PersonalizationForm({product}:{product:{id:string; slug:string; title:string; type:"fise"|"carte"; priceRON:number}}){
  const [step,setStep]=useState(1);
  const total=3;
  const router=useRouter();
  const add = useCart(s=>s.add);

  const [form,setForm]=useState<PersonalData>({childName:"", age:"", gender:"băiat", eyeColor:"căprui", hairColor:"șaten", hairstyle:"scurt", glasses:false});
  const next=()=> setStep(s=> Math.min(total, s+1));
  const prev=()=> setStep(s=> Math.max(1, s-1));

  const handleAdd=()=>{
    const ok = add({
      productId: product.id, productType: product.type, title: product.title, priceRON: product.priceRON,
      customization: form
    });
    if(!ok){ alert("Acest produs cu aceeași personalizare este deja în coș."); return; }
    router.push("/cart");
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <Stepper step={step} total={total}/>
        {step===1 && (
          <div className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Numele copilului</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.childName}
                onChange={e=>setForm({...form, childName:e.target.value})} placeholder="Edy"/>
            </div>
            <div>
              <label className="block text-sm font-medium">Vârsta</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.age}
                onChange={e=>setForm({...form, age:e.target.value})} placeholder="4"/>
            </div>
            <div className="flex gap-3">
              <button className="btn-cta bg-gray-100" onClick={prev} disabled>Înapoi</button>
              <button className="btn-cta bg-brand-turquoise text-white" onClick={next}>Continuă</button>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="card p-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Gen</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2" value={form.gender}
                onChange={e=>setForm({...form, gender:e.target.value})}>{GENDERS.map(g=><option key={g}>{g}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm font-medium">Culoarea ochilor</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2" value={form.eyeColor}
                onChange={e=>setForm({...form, eyeColor:e.target.value})}>{EYES.map(g=><option key={g}>{g}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm font-medium">Culoarea părului</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2" value={form.hairColor}
                onChange={e=>setForm({...form, hairColor:e.target.value})}>{HAIR.map(g=><option key={g}>{g}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm font-medium">Freză</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2" value={form.hairstyle}
                onChange={e=>setForm({...form, hairstyle:e.target.value})}>{HAIRSTYLES.map(g=><option key={g}>{g}</option>)}</select>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input id="gl" type="checkbox" checked={form.glasses} onChange={e=>setForm({...form, glasses:e.target.checked})}/>
              <label htmlFor="gl">Cu ochelari</label>
            </div>

            <div className="col-span-2 flex gap-3">
              <button className="btn-cta bg-gray-100" onClick={prev}>Înapoi</button>
              <button className="btn-cta bg-brand-turquoise text-white" onClick={next}>Continuă</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Previzualizare</h3>
            <p className="text-gray-600 text-sm">Dacă îți place, adaugă în coș. Poți comanda mai departe sau finaliza plata.</p>
            <div className="mt-4 flex gap-3">
              <button className="btn-cta bg-gray-100" onClick={prev}>Înapoi</button>
              <button className="btn-cta bg-brand-lilac text-white" onClick={handleAdd}>Adaugă în coș</button>
            </div>
          </div>
        )}
      </div>

      <AvatarPreview name={form.childName} opts={form}/>
    </div>
  );
}
