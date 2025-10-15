"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");
  const [loading, setLoading] = useState(!!sessionId);
  const [haveAll, setHaveAll] = useState<boolean | null>(null);

  useEffect(()=>{
    const run = async ()=>{
      if(!sessionId) return;
      try{
        const res = await fetch(`/api/checkout-status?session_id=${sessionId}`);
        const data = await res.json();
        if(!res.ok) throw new Error(data?.error || "status error");
        setHaveAll(!!data.haveAll);
      }catch{
        setHaveAll(null); // dacă nu putem verifica, nu afișăm banner
      }finally{
        setLoading(false);
      }
    };
    run();
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold mb-2">Mulțumim! 🎉</h1>
      <p className="text-gray-700">
        Plata a fost procesată. Am început pregătirea personalizărilor.
      </p>

      {/* Banner informativ */}
      {!loading && haveAll === false && (
        <div className="mt-6 rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-900 p-4 text-sm">
          <b>Comanda ta este în curs de pregătire.</b><br/>
          Unele fișiere personalizate nu sunt încă disponibile. Le finalizăm și îți vom trimite pe email cât mai curând.
        </div>
      )}

      {!loading && haveAll === true && (
        <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 p-4 text-sm">
          <b>Gata!</b> Fișierele personalizate au fost generate și trimise pe email.
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/" className="btn-cta btn-neutral">Înapoi la prima pagină</Link>
        <Link href="/fise" className="btn-cta">Comandă alte fișe</Link>
      </div>
    </div>
  );
}
