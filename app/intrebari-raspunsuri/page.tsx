export default function FAQ(){
  const faqs = [
    {q:"Cum personalizez?", a:"Alegi produsul, introduci numele și vârsta, apoi setezi avatarul pas-cu-pas."},
    {q:"Cum primesc fișele?", a:"După plată, primești un email cu PDF-ul."},
    {q:"În cât timp ajunge cartea?", a:"Tipărim la comandă. Livrarea 5–7 zile lucrătoare."}
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Întrebări și răspunsuri</h1>
      <div className="space-y-4">
        {faqs.map((f,i)=>(
          <details key={i} className="card p-4">
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-gray-700">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
