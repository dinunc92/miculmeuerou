// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

const NavLink = ({
  href,
  children,
  active,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`nav-link ${active ? "nav-link-active" : ""} link-strong`}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ✅ folosim items.length din store, nu s.count()
  const count = useCart((s: any) => (Array.isArray(s.items) ? s.items.length : 0));

  return (
    <header className="bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3" aria-label="Acasă">
          <img src="/logo-flat.svg" alt="Micul meu erou" className="h-10 md:h-12 w-auto" />
        </a>

        {/* Meniu principal (stânga, lângă logo) */}
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

        {/* Dreapta: linkuri + coș */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/intrebari-raspunsuri" active={isActive(pathname, "/intrebari-raspunsuri")}>
            Întrebări
          </NavLink>
          <NavLink href="/contact" active={isActive(pathname, "/contact")}>
            Contact
          </NavLink>
          <Link href="/cart" aria-label="Coș" className="relative nav-link link-strong">
            🛒
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full"
                aria-label={`${count} produse în coș`}
              >
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Burger (mobile) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-black/5"
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={open}
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
            <NavLink href="/fise" active={isActive(pathname, "/fise")} onClick={() => setOpen(false)}>
              📄 Fișe
            </NavLink>
            <NavLink href="/carti" active={isActive(pathname, "/carti")} onClick={() => setOpen(false)}>
              📚 Cărți
            </NavLink>
            <Link
              href="/creeaza-carte"
              className={`nav-link link-strong font-extrabold ${isActive(pathname, "/creeaza-carte") ? "nav-link-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              ✨ Creează-ți cartea
            </Link>
            <NavLink href="/intrebari-raspunsuri" active={isActive(pathname, "/intrebari-raspunsuri")} onClick={() => setOpen(false)}>
              Întrebări
            </NavLink>
            <NavLink href="/contact" active={isActive(pathname, "/contact")} onClick={() => setOpen(false)}>
              Contact
            </NavLink>
            <NavLink href="/cart" active={isActive(pathname, "/cart")} onClick={() => setOpen(false)}>
              Coș 🛒 {count > 0 ? `(${count})` : ""}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
