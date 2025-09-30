"use client";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { usePathname } from "next/navigation";

export default function Navbar(){
  const count = useCart(s=>s.items.length);
  const path = usePathname();
  const isActive = (p:string)=> path?.startsWith(p);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="h-10"/>
          <div className="font-bold">Micul Meu Erou</div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link className={`hover:underline ${isActive("/(shop)/fise")?"text-brand-turquoise":""}`} href="/(shop)/fise">Fișe</Link>
          <Link className={`hover:underline ${isActive("/(shop)/carti")?"text-brand-turquoise":""}`} href="/(shop)/carti">Cărți</Link>
          <Link className={`hover:underline ${isActive("/(shop)/desene")?"text-brand-turquoise":""}`} href="/(shop)/desene">Desene</Link>
          <Link className={`hover:underline ${isActive("/intrebari-raspunsuri")?"text-brand-turquoise":""}`} href="/intrebari-raspunsuri">Întrebări</Link>
          <Link className={`hover:underline ${isActive("/contact")?"text-brand-turquoise":""}`} href="/contact">Contact</Link>
          <Link href="/cart" className="relative">
            <span className="inline-flex items-center gap-2 btn-cta bg-brand-lilac text-white">
              <span>🛒</span> Coș
            </span>
            {count>0 && <span className="absolute -top-2 -right-2 text-xs bg-brand-turquoise text-white rounded-full px-2 py-0.5">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
