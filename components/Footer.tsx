export default function Footer(){
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-4 gap-6">
        <div>
          <div className="font-bold text-lg">Micul Meu Erou</div>
          <p className="text-sm text-gray-700 mt-2">Micul tău erou, în fișe, cărți și povești animate.</p>
        </div>

        <div className="text-sm">
          <div className="font-semibold">Pagini</div>
          <ul className="mt-2 space-y-1">
            <li><a href="/fise">Fișe</a></li>
            <li><a href="/carti">Cărți</a></li>
            <li><a href="/intrebari-raspunsuri">Întrebări</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="font-semibold">Legal</div>
          <ul className="mt-2 space-y-1">
            <li><a href="/politici/termeni">Termeni și condiții</a></li>
            <li><a href="/politici/confidentialitate">Politica de confidențialitate (GDPR)</a></li>
            <li><a href="/politici/retur">Politica de retur & livrare</a></li>
            <li><a href="/gdpr">GDPR</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          {/* Social */}
       <div className="flex items-center gap-4">
        <a className="text-blue-600 hover:underline" href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
        <a className="text-green-600 hover:underline" href="https://wa.me/40784052345" target="_blank" rel="noreferrer">WhatsApp</a>
      </div>

<div className="flex flex-col gap-2 text-sm">
  <a className="rounded-xl px-3 py-2 text-xs bg-black text-white inline-flex items-center gap-2 w-fit hover:opacity-90"
     href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noreferrer">
    Sesizări ANPC
  </a>
  <a className="rounded-xl px-3 py-2 text-xs bg-gray-700 text-white inline-flex items-center gap-2 w-fit hover:opacity-90"
     href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
    SOL (ODR) – Reclamații UE
  </a>
</div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 pb-6">© {new Date().getFullYear()} MiculMeuErou.ro</div>
    </footer>
  );
}
