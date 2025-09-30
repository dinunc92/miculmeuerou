"use client";
import { useEffect, useState } from "react";

export default function CookieBanner(){
  const [show,setShow]=useState(false);
  useEffect(()=>{
    const ok = localStorage.getItem("mme_cookie_ok");
    if(!ok) setShow(true);
  },[]);
  if(!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 card p-4 max-w-xl">
      <div className="text-sm">
        Folosim cookie-uri pentru a îmbunătăți experiența. Continuând, ești de acord cu <a className="underline" href="/politici/confidentialitate">Politica de confidențialitate</a>.
      </div>
      <div className="mt-3 flex gap-2">
        <button className="btn-cta bg-brand-turquoise text-white" onClick={()=>{localStorage.setItem("mme_cookie_ok","1"); setShow(false);}}>Accept</button>
        <button className="btn-cta bg-gray-100" onClick={()=>setShow(false)}>Refuz</button>
      </div>
    </div>
  );
}
