export default function Page(){
  return (<div className="mx-auto max-w-3xl px-4 py-10">
    <h1 className="text-3xl font-bold mb-4">Politica de confidențialitate (GDPR)</h1>
    <p className="text-gray-700">Prelucrăm date pentru a personaliza produsele (numele și vârsta copilului) și pentru a livra comanda (email, adresă de livrare pentru cărți).</p>
    <h2 className="text-xl font-semibold mt-6">Date colectate</h2>
    <ul className="list-disc list-inside text-gray-700">
      <li>Nume copil, vârstă, opțiuni avatar (doar pentru personalizare)</li>
      <li>Nume părinte, email, telefon, adresă (livrare carte)</li>
      <li>Date tranzacție (Stripe) – nu stocăm datele cardului</li>
    </ul>
    <h2 className="text-xl font-semibold mt-6">Drepturile tale</h2>
    <p className="text-gray-700">Ai drept de acces, rectificare, ștergere. Ne poți contacta la hello@miculmeuerou.ro.</p>
  </div>);
}
