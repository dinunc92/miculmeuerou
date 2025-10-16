"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) => (
  <Link href={href} className={`nav-link ${active ? "nav-link-active" : ""} link-strong`}>
    {children}
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ❗ FIX: hook-ul se apelează necondiționat într-un component
  const count = useCart((s: any) => s.count());

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        {/* LOGO stânga */}
        <Link href="/" className="flex items-center gap-2 brand-pill" aria-label="Micul Meu Erou - acasă">
          <img src="/logo-icon.svg" alt="" className="w-5 h-5" />
          <img src="/logo.svg" alt="Micul Meu Erou" className="h-5 w-auto" />
        </Link>

        {/* Meniu principal mutat la STÂNGA (imediat după logo) */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/fise" active={isActive(pathname, "/fise")}>
            <span className="icon-sm" aria-hidden>📄</span> Fișe
          </NavLink>
          <NavLink href="/carti" active={isActive(pathname, "/carti")}>
            <span className="icon-sm" aria-hidden>📚</span> Cărți
          </NavLink>
          <Link
            href="/creeaza-carte"
            className={`nav-link link-strong font-extrabold ${isActive(pathname, "/creeaza-carte") ? "nav-link-active" : ""}`}
            title="Creează-ți cartea"
          >
            ✨ Creează-ți cartea
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Dreapta: alte linkuri + coș */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/intrebari-raspunsuri" active={isActive(pathname, "/intrebari-raspunsuri")}>Întrebări</NavLink>
          <NavLink href="/contact" active={isActive(pathname, "/contact")}>Contact</NavLink>
          <Link href="/cart" aria-label="Coș" className="relative nav-link link-strong">
            🛒
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-black/5"
          aria-label="Deschide meniul"
        >
          <span className="sr-only">Meniu</span>
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-black transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-black transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-black transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-1">
            <NavLink href="/fise" active={isActive(pathname, "/fise")}>📄 Fișe</NavLink>
            <NavLink href="/carti" active={isActive(pathname, "/carti")}>📚 Cărți</NavLink>
            <Link
              href="/creeaza-carte"
              className={`nav-link link-strong font-extrabold ${isActive(pathname, "/creeaza-carte") ? "nav-link-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              ✨ Creează-ți cartea
            </Link>
            <NavLink href="/intrebari-raspunsuri" active={isActive(pathname, "/intrebari-raspunsuri")}>Întrebări</NavLink>
            <NavLink href="/contact" active={isActive(pathname, "/contact")}>Contact</NavLink>
            <NavLink href="/cart" active={isActive(pathname, "/cart")}>Coș 🛒</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
