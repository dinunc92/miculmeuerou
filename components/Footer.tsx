import Link from "next/link";

export default function Footer(){
  return (
<footer className="border-t mt-12 footer-strong">
      <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        {/* Col 1: Brand + scurtă descriere */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo-icon.svg" alt="" className="w-6 h-6" />
            <div className="font-semibold">Micul Meu Erou</div>
          </div>
          <p className="text-gray-600">
            Fișe și cărți personalizate pentru copii. Numele și avatarul devin parte din poveste.
          </p>
          <div className="mt-4 flex items-center gap-3">
            {/* Facebook */}
            <a className="link-strong rounded-full p-2" href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.675 0h-21.35C.594 0 0 .593 0 1.326v21.348C0 23.407.594 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.79 4.659-4.79 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.407 24 22.674V1.326C24 .593 23.406 0 22.675 0z"/></svg>
            </a>
            {/* WhatsApp */}
            <a className="link-strong rounded-full p-2" href="https://wa.me/4073XXXXXXX" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 32 32" aria-hidden="true"><path d="M19.11 17.27c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01s-.48.07-.73.34c-.25.27-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.14.18 1.92 2.93 4.65 4.11.65.28 1.15.45 1.54.58.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.82-1.28.23-.63.23-1.18.16-1.28-.07-.09-.25-.16-.52-.29z"/><path d="M27.002 4.998A13.946 13.946 0 0 0 16 .002C7.178.002.002 7.178.002 16a15.89 15.89 0 0 0 2.018 7.769L.002 32l8.46-2.192A15.953 15.953 0 0 0 16 31.998C24.822 31.998 32 24.822 32 16a15.956 15.956 0 0 0-4.998-11.002zM16 29.336a13.303 13.303 0 0 1-6.771-1.845l-.486-.289-5.02 1.301 1.34-4.894-.315-.502A13.27 13.27 0 1 1 16 29.336z"/></svg>
            </a>
          </div>
        </div>

        {/* Col 2: Linkuri utile (restaurate) */}
        <div>
          <div className="font-semibold mb-2">Linkuri utile</div>
          <ul className="space-y-1">
            <li><Link className="link-strong" href="/fise">Fișe</Link></li>
            <li><Link className="link-strong" href="/carti">Cărți</Link></li>
            <li><Link className="link-strong" href="/creeaza-carte">Creează-ți cartea</Link></li>
            <li><Link className="link-strong" href="/intrebari-raspunsuri">Întrebări frecvente</Link></li>
            <li><Link className="link-strong" href="/contact">Contact</Link></li>
            <li><Link className="link-strong" href="/gdpr">GDPR</Link></li>
            <li><Link className="link-strong" href="/politici/termeni">Termeni și condiții</Link></li>
            <li><Link className="link-strong" href="/politici/retur">Politica de retur</Link></li>
            <li><Link className="link-strong" href="/politici/confidentialitate">Politica de confidențialitate</Link></li>

          </ul>
        </div>

      <div>
  <div className="font-semibold mb-2">Protecția consumatorului</div>
  <div className="space-y-3">
    <a className="link-strong inline-flex items-center gap-2 rounded-xl p-2"
       href="https://anpc.ro/" target="_blank" rel="noreferrer" aria-label="ANPC">
      <img src="/brands/anpc.png" alt="ANPC" className="h-8 w-auto" />
    </a>
    <a className="link-strong inline-flex items-center gap-2 rounded-xl p-2"
       href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" aria-label="ODR">
      <img src="/brands/odr.png" alt="ODR" className="h-8 w-auto" />
    </a>
  </div>
</div>


        {/* Col 4: Contact rapid */}
        <div>
          <div className="font-semibold mb-2">Contact rapid</div>
          <ul className="space-y-1">
            <li><a className="link-strong" href="mailto:hello@miculmeuerou.ro">hello@miculmeuerou.ro</a></li>
            <li><a className="link-strong" href="tel:+4073XXXXXXX">+40 73X XXX XXX</a></li>
            <li><a className="link-strong" href="https://wa.me/4073XXXXXXX" target="_blank" rel="noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>

     <div className="border-t">
  <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-500 flex items-center justify-center gap-2">
    <span>© 2025 MiculMeuErou.ro</span>
    <span>•</span>
    <span>Creat cu drag pentru părinți și copii 💙</span>
  </div>
</div>

    </footer>
  );
}
