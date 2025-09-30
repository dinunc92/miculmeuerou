export default function Footer(){
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-bold">Micul Meu Erou</div>
          <p className="text-sm text-gray-600 mt-2">Micul tău erou, în fișe, carte și povești animate.</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold">Legal</div>
          <ul className="mt-2 space-y-1">
            <li><a href="/politici/termeni">Termeni și condiții</a></li>
            <li><a href="/politici/confidentialitate">Politica de confidențialitate (GDPR)</a></li>
            <li><a href="/politici/retur">Politica de retur & livrare</a></li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          {/* Înlocuiește href cu linkurile oficiale: ANPC și SOL (ODR) */}
          <a href="https://anpc.ro" target="_blank" rel="noreferrer">
            <img src="/anpc-placeholder.svg" alt="ANPC" className="h-10 hover:scale-105 transition"/>
          </a>
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
            <img src="/odr-placeholder.svg" alt="SOL ODR" className="h-10 hover:scale-105 transition"/>
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 pb-6">© {new Date().getFullYear()} MiculMeuErou.ro</div>
    </footer>
  );
}
