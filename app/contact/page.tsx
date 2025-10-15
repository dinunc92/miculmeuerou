"use client";
import { useRef, useState } from "react";

export default function Contact(){
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setOk(null); setErr(null);
    const form = new FormData(e.target as HTMLFormElement);
    try{
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message")
        }),
        headers: { "Content-Type": "application/json" }
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data?.error || "Eroare la trimitere.");
      setOk("Mesaj trimis! Îți răspundem cât de repede.");
      // goliți formularul după succes
      formRef.current?.reset();
    }catch(e:any){
      setErr(e.message || "Eroare la trimitere.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <div className="card p-6 space-y-3 text-sm">
        <div><span className="font-semibold">Email:</span> hello@miculmeuerou.ro</div>
        <div><span className="font-semibold">Telefon:</span> 07xx xxx xxx</div>
        <div><span className="font-semibold">Program:</span> L–V 10:00–18:00</div>
      </div>

      <form ref={formRef} onSubmit={send} className="card p-6 mt-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nume</label>
            <input name="name" required className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" name="email" required className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Telefon</label>
            <input name="phone" className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Mesaj</label>
          <textarea name="message" rows={5} required className="mt-1 w-full rounded-xl border px-3 py-2"/>
        </div>
        <button disabled={loading} className="btn-cta">
          {loading ? "Se trimite..." : "Trimite mesaj"}
        </button>
        {ok && <div className="text-green-600">{ok}</div>}
        {err && <div className="text-red-600">{err}</div>}
      </form>
    </div>
  );
}
