"use client";

import { useMemo, useState } from "react";
import Toast from "@/components/Toast";
import { useCart } from "@/lib/store/cart";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  slug: string;
  type: "carte" | "fise" | "carte-custom"; // <— extins
  title: string;
  priceRON: number;
};

const BOY_STYLES = ["brown-spike","blonde-spike","redhead-spike","blonde-curly","brown-curly","redhead-curly"] as const;
const GIRL_STYLES = ["blonde-curly","brown-curly","redhead-curly","blonde-short","brown-short","redhead-short","blonde-wavy","brown-wavy","redhead-wavy"] as const;

export default function PersonalizationForm({
  product,
  mode,
  onNamePreview,
}: {
  product: Product;
  mode: "carte" | "fise";
  onNamePreview?: (name: string) => void;
}) {
  const router = useRouter();
  const { add } = useCart();

  const [childName, setChildName] = useState("");
  const [gender, setGender] = useState<"boy"|"girl">("boy");
  const [eyeColor, setEyeColor] = useState<"green"|"brown"|"blue">("brown");
  const [hairstyle, setHairstyle] = useState<string>("");
  const [wantPrinted, setWantPrinted] = useState(false);

  const [toast, setToast] = useState<string|null>(null);

  const styles = gender === "boy" ? BOY_STYLES : GIRL_STYLES;

  // actualizăm previzualizarea titlului din pagina produsului
  useMemo(()=> onNamePreview?.(childName || "Edy"), [childName, onNamePreview]);

  // generăm imaginile de caracter (înălțime mai mare, încadrate complet)
  const characterImages = useMemo(()=> {
    return styles.map(st => ({
      key: st,
      src: `/characters/${gender}/${st}/${eyeColor}/p1.png`
    }));
  }, [gender, eyeColor, styles]);

  function need(value: string, msg: string){
    if(!value.trim()){
      setToast(msg);
      setTimeout(()=> setToast(null), 1800);
      return false;
    }
    return true;
  }

  const addToCart = () => {
    if (!need(childName, "Te rugăm să introduci numele copilului.")) return;
    if (mode === "carte" && !hairstyle) {
      setToast("Alege o coafură din listă.");
      setTimeout(()=> setToast(null), 1500);
      return;
    }

    const price = product.priceRON + ((mode==="carte" || product.type==="carte") && wantPrinted ? 50 : 0);

    add({
      productId: product.id,
      productType: product.type,
      title: product.title, // rămâne cu [NumeCopil] în catalog; afișarea o facem cu displayTitleFromPlaceholder
      priceRON: price,
      customization: {
        childName,
        gender: mode==="carte" ? gender : undefined,
        eyeColor: mode==="carte" ? eyeColor : undefined,
        hairstyle: mode==="carte" ? hairstyle : undefined,
        wantPrinted: mode==="carte" ? wantPrinted : undefined,
      }
    });

    setToast("Produs adăugat în coș ✅");
    setTimeout(()=> { setToast(null); router.push("/cart"); }, 700);
  };

  return (
    <div>
      {/* 1) NUME – primul câmp */}
      <div className="mt-3">
        <label className="block text-sm font-medium" htmlFor="nume">Nume copil (max 10)</label>
        <input id="nume" value={childName} onChange={(e)=>setChildName(e.target.value.slice(0,10))} className="mt-1" placeholder="Edy" />
      </div>

      {mode === "carte" ? (
        <>
          {/* Gen & Ochii */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium" htmlFor="gen">Gen</label>
              <select id="gen" className="mt-1 bg-white" value={gender} onChange={(e)=>setGender(e.target.value as any)}>
                <option value="boy">Băiat</option>
                <option value="girl">Fată</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="ochi">Culoarea ochilor</label>
              <select id="ochi" className="mt-1 bg-white" value={eyeColor} onChange={(e)=>setEyeColor(e.target.value as any)}>
                <option value="brown">Căprui</option>
                <option value="blue">Albaștri</option>
                <option value="green">Verzi</option>
              </select>
            </div>
          </div>

          {/* Galerie coafuri */}
          <div className="mt-3">
            <label className="block text-sm font-medium mb-2">Alege coafura</label>
            <div className="grid grid-cols-3 gap-3">
              {characterImages.map(img => (
                <button
                  key={img.key}
                  type="button"
                  onClick={()=>setHairstyle(img.key)}
                  className={`rounded-xl overflow-hidden border ${hairstyle===img.key ? "ring-2 ring-violet-500" : ""}`}
                  title={img.key}
                >
                  <img src={img.src} alt={img.key} className="w-full h-40 object-contain bg-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Tipărit */}
          <label className="inline-flex items-center gap-2 mt-3">
            <input className="input-chk" type="checkbox" checked={wantPrinted} onChange={(e)=>setWantPrinted(e.target.checked)} />
            <span>Vreau și varianta tipărită (+50 RON) + transport</span>
          </label>
        </>
      ) : null}

      <div className="mt-4 flex items-center gap-3">
        <button className="btn-add" onClick={addToCart}>
          <span aria-hidden>➕</span> Adaugă în coș
        </button>
      </div>

      {toast && <Toast text={toast} kind="info" />}
    </div>
  );
}
