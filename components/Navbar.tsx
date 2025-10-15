"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) => (
  <Link
    href={href}
    className={`px-3 py-2 rounded-xl transition ${
      active ? "bg-brand-turquoise/15 text-brand-turquoise font-semibold" : "hover:bg-black/5"
    }`}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Buton „acasă” vizibil */}
        <Link
          href="/"
          className="rounded-2xl px-4 py-2 font-extrabold text-white bg-gradient-to-r from-brand-turquoise to-brand-lilac shadow hover:shadow-md active:scale-[0.98] transition"
          aria-label="Micul Meu Erou - acasă"
        >
          micul meu erou
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/fise" active={isActive(pathname, "/fise")}>Fișe</NavLink>
          <NavLink href="/carti" active={isActive(pathname, "/carti")}>Cărți</NavLink>
          <Link
            href="/personalizeaza-cartea"
            className={`px-3 py-2 rounded-xl transition font-extrabold ${
              isActive(pathname, "/personalizeaza-cartea")
                ? "bg-brand-turquoise/15 text-brand-turquoise"
                : "hover:bg-black/5"
            }`}
          >
            Personalizează cartea eroului
          </Link>
          <NavLink href="/intrebari-raspunsuri" active={isActive(pathname, "/intrebari-raspunsuri")}>Întrebări</NavLink>
          <NavLink href="/contact" active={isActive(pathname, "/contact")}>Contact</NavLink>
          <Link href="/cart" aria-label="Coș" className="px-3 py-2 rounded-xl hover:bg-black/5">🛒</Link>
        </nav>

        {/* Mobile burger */}
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

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-1">
            <NavLink href="/fise" active={isActive(pathname, "/fise")}>Fișe</NavLink>
            <NavLink href="/carti" active={isActive(pathname, "/carti")}>Cărți</NavLink>
            <Link
              href="/personalizeaza-cartea"
              className={`px-3 py-2 rounded-xl transition font-extrabold ${
                isActive(pathname, "/personalizeaza-cartea")
                  ? "bg-brand-turquoise/15 text-brand-turquoise"
                  : "hover:bg-black/5"
              }`}
              onClick={() => setOpen(false)}
            >
              Personalizează cartea eroului
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
