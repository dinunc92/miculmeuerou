export default function FAQPage() {
  const q = [
    ["Când primesc fișele?", "Instant după plată, pe email."],
    ["Cât durează realizarea unei cărți?", "Varianta digitală se trimite în 48h, iar cea tipărită în 5–7 zile lucrătoare."],
    ["Pot personaliza numele copilului?", "Da, toate produsele pot fi personalizate cu numele introdus de tine."],
    ["Cum primesc cartea tipărită?", "Prin curier, pretul este de 50 RON tipărirea plus taxa de livrare."],
    ["Pot returna produsul?", "Fișierele digitale nu se pot returna, dar dacă e o eroare o corectăm gratuit."]
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Întrebări frecvente</h1>
      <div className="space-y-4">
        {q.map(([t,a],i)=>(
          <div key={i} className="border-b pb-3">
            <h3 className="font-semibold text-[var(--brand-turquoise)]">{t}</h3>
            <p className="text-gray-700 mt-1">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
