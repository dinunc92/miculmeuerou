export default function FAQPage(){
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Întrebări frecvente</h1>

      <div className="space-y-5">
        <div className="card p-5">
          <h3 className="font-semibold">Ce primește copilul după plată?</h3>
          <p>Fișele personalizate sunt livrate pe email ca PDF. Cărțile digitale personalizate sunt trimise pe email; dacă ai ales „carte tipărită”, tipărim și livrăm separat.</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold">Cum se personalizează?</h3>
          <p>Introduci numele (max 10 caractere). Pentru cărți poți alege genul, culoarea ochilor și un personaj din grilă. Numele apare în titlu și în conținutul PDF (prin completarea câmpului NAME din șablon).</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold">În cât timp primesc cartea?</h3>
          <p>Cartea digitală se livrează în maxim 24h pe email. Cartea tipărită se livrează în 5–9 zile lucrătoare (include producție + transport).</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold">Ce se întâmplă dacă nu există șablonul PDF?</h3>
          <p>Dacă lipsesc fișierele sursă, emailul către client nu se trimite. Primim noi alertă și te contactăm; completăm și retrimitem în cel mai scurt timp.</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold">Pot cere varianta tipărită?</h3>
          <p>Da. Bifezi opțiunea la personalizare (cost suplimentar + transport). Coperta este cartonată, interiorul tipărit color, prindere cu capsă.</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold">Cum pot lăsa o recenzie?</h3>
          <p>Răspunde la emailul de confirmare al comenzii cu feedback-ul tău și, opțional, o poză. Îți mulțumim!</p>
        </div>
      </div>
    </div>
  );
}
