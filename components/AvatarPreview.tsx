type Opts = { gender:string; eyeColor:string; hairstyle:string; glasses:boolean; };
export default function AvatarPreview({name, opts}:{name:string; opts:Opts}){
  return (
    <div className="card p-6 text-center">
      <div className="mx-auto w-40 h-40 rounded-full bg-gradient-to-br from-brand-turquoise/30 to-brand-lilac/30 flex items-center justify-center hover:scale-105 transition">
        {/* Simplu placeholder vizual; în producție înlocuiești cu sprite-uri */}
        <span className="text-5xl">🦸</span>
      </div>
      <div className="mt-3 font-semibold">{name || "Nume copil"}</div>
      <div className="text-xs text-gray-500">{opts.gender}, ochi {opts.eyeColor}, păr ({opts.hairstyle}) {opts.glasses?"👓":""}</div>
    </div>
  );
}
