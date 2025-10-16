"use client";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { displayTitleFromPlaceholder } from "@/utils/title";
import CharacterPicker from "./CharacterPicker";

type Gender = "boy" | "girl";
type Eye = "green" | "brown" | "blue";

export default function PersonalizationForm({
  product,
}: {
  product: { id: string; slug: string; title: string; type: "fise" | "carte"; priceRON: number; image?: string };
}) {
  const router = useRouter();
  const add = useCart((s) => s.add);

  const [childName, setChildName] = useState("");
  const [gender, setGender] = useState<Gender>("boy");
  const [eye, setEye] = useState<Eye>("green");
  const [hairstyle, setHairstyle] = useState("");

  const isFise = product.type === "fise";
  const shownTitle = displayTitleFromPlaceholder(product.title, childName);
  const [wantPrinted, setWantPrinted] = useState(false);

  const handleAdd = () => {
    if (!childName.trim()) return alert("Te rog introdu numele copilului.");
    if (!isFise && !hairstyle) return alert("Alege un caracter din grilă.");
   
// ... în handleAdd includem wantPrinted în customization
const ok = add({
  productId: product.id,
  productType: product.type,
  title: product.title,
  priceRON: product.priceRON + (wantPrinted ? 79 : 0),
  image: product.image,
  customization: {
    childName: childName.slice(0,10),
    gender, eye, hairstyle,
    wantPrinted,
  },
});
    if (!ok) return alert("Acest produs cu aceeași personalizare este deja în coș.");
    router.push("/cart");
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-3">{shownTitle}</h2>

        {/* nume copil (doar 10 caractere) */}
        <div className="card p-6 space-y-3 mb-4">
          <label className="block text-sm font-medium">Nume copil</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={childName}
            onChange={(e)=> setChildName(e.target.value.slice(0,10))}
            maxLength={10}
            placeholder="Edy"
          />
          <div className="text-xs text-gray-500">max. 10 caractere</div>
        </div>

        {/* doar pentru CĂRȚI: select gen/ochi + grilă personaje în același card */}
        {!isFise && (
          <div className="card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Gen</label>
                <select className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" value={gender} onChange={(e)=>{ setGender(e.target.value as Gender); setHairstyle(""); }}>
                  <option value="boy">băiat</option>
                  <option value="girl">fată</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Culoarea ochilor</label>
                <select className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" value={eye} onChange={(e)=>{ setEye(e.target.value as Eye); }}>
                  <option value="green">verzi</option>
                  <option value="brown">căprui</option>
                  <option value="blue">albaștri</option>
                </select>
              </div>
            </div>

            <label className="block text-sm font-medium">Alege caracterul</label>
            <CharacterPicker gender={gender} eye={eye} value={hairstyle} onChange={setHairstyle} />
            <label className="flex items-center gap-2">
  <input type="checkbox" checked={wantPrinted} onChange={e=>setWantPrinted(e.target.checked)} />
  <span>Vreau și varianta tipărită (+79 RON) + transport</span>
</label>
<div className="text-xs text-gray-500">Livrare (varianta tipărită): 5–7 zile lucrătoare.</div>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button className="btn-cta" onClick={handleAdd}>Adaugă în coș</button>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="space-y-4">
        {product.image && <img src={product.image} alt="" className="w-full rounded-xl shadow-sm" />}
        {!isFise && hairstyle && (
          <img
            src={`/characters/${gender}/${hairstyle}/${eye}/p1.png`}
            alt="preview"
            className="max-w-[380px] w-full h-auto rounded-xl"
          />
        )}
      </div>
    </div>
  );
}
