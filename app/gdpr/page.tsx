export default function GDPRPage(){
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Protecția datelor (GDPR)</h1>
      <div className="space-y-4 text-gray-800">
        <p><b>Cine suntem:</b> MiculMeuErou.ro – furnizor de fișe și cărți personalizate pentru copii.</p>
        <p><b>Ce date colectăm:</b> nume copil (pentru personalizare), email, adresă de livrare și telefon (doar pentru colete tipărite), date de plată procesate de Stripe.</p>
        <p><b>De ce:</b> pentru a livra produsele personalizate și a comunica statusul comenzii.</p>
        <p><b>Temei legal:</b> executarea contractului (comanda), interes legitim (comunicări esențiale) și consimțământ (newsletter, dacă optezi).</p>
        <p><b>Stocare:</b> păstrăm datele pe durata necesară livrării și conform obligațiilor fiscale. Poți cere oricând acces/rectificare/ștergere la <a href="mailto:hello@miculmeuerou.ro" className="text-brand-turquoise underline">hello@miculmeuerou.ro</a>.</p>
        <p><b>Împuterniciți:</b> Stripe (plăți), Resend (email), servicii de tipărire/curierat (numai pentru comenzi fizice).</p>
        <p><b>Drepturi:</b> acces, rectificare, ștergere, restricționare, opoziție, portabilitate, plângere la ANSPDCP.</p>
      </div>
    </div>
  );
}
