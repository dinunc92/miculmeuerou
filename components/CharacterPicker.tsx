// components/CharacterPicker.tsx
"use client";
import Image from "next/image";

type Props = {
  gender: "boy" | "girl";
  eye: "green" | "brown" | "blue";
  value?: string;                      // hairstyle selectat
  onChange: (hair: string) => void;
};

const HAIR_BOY = ["brown-spike","blonde-spike","redhead-spike","brown-curly","blonde-curly","redhead-curly"];
const HAIR_GIRL = ["brown-short","blonde-short","redhead-short","brown-curly","blonde-curly","redhead-curly","brown-wavy","blonde-wavy","redhead-wavy"];

export default function CharacterPicker({ gender, eye, value, onChange }: Props){
  const hairs = gender === "boy" ? HAIR_BOY : HAIR_GIRL;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {hairs.map(hair => {
        const src = `/characters/${gender}/${hair}/${eye}/p1.png`;
        const selected = value === hair;
        return (
          <button
            type="button"
            key={hair}
            onClick={()=> onChange(hair)}
            className={`relative rounded-xl border p-2 bg-white hover:shadow-md transition ${selected ? "ring-2 ring-brand-turquoise border-brand-turquoise" : "border-gray-200"}`}
            title={hair}
          >
            <div className="relative w-full aspect-square">
              {/* dacă imaginea nu există, next/image aruncă; folosim fallback via onError -> ascundem */}
              <Image src={src} alt={hair} fill sizes="150px" onError={(e:any)=>{ e.currentTarget.closest("button")!.classList.add("opacity-60"); }} />
            </div>
            <div className="mt-1 text-xs text-center capitalize">{hair.replace(/-/g," ")}</div>
          </button>
        );
      })}
    </div>
  );
}
