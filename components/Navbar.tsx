// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

const NavLink = ({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) => (
  <Link
    href={href}
    className={`nav-link ${active ? "nav-link-active" : ""} link-strong`}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // === COȘ: hydrate + badge ===
  const hydrateOnce = useCart(s => s.hydrateOnce);
  const count = useCart(s => s.count());

  useEffect(() => {
    hydrateOnce();
  }, [hydrateOnce]);

  return (
    <header className="bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 brand-hover">
          <img src="/logo-flat.svg" alt="Micul meu erou" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* MENIU STÂNGA */}
        <nav className="hidden md:flex items-center">
          <NavLink href="/fise" active={isActive(pathname, "/fise")}>
            <span className="icon-sm" aria-hidden>📄</span> Fișe educative
          </NavLink>
          <NavLink href="/carti" active={isActive(pathname, "/carti")}>
            <span className="icon-sm" aria-hidden>📚</span> Cărți cu avatarul copilului
          </NavLink>
          <Link
            href="/creeaza-carte"
            className={`nav-link link-strong font-extrabold ${isActive(pathname, "/creeaza-carte") ? "nav-link-active" : ""}`}
            title="Cărți cu fotografia copilului"
          >
            📸 Cărți cu fotografia copilului
          </Link>
        </nav>

        {/* SPACER */}
        <div className="flex-1" />

        {/* DREAPTA: alte linkuri + COȘ */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/cart" aria-label="Coș" className="relative nav-link link-strong">
            Coș 🛒
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* BURGER mobile */}
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

      {/* DRAWER mobile */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-1">
            <NavLink href="/fise" active={isActive(pathname, "/fise")}>📄 Fișe educative</NavLink>
            <NavLink href="/carti" active={isActive(pathname, "/carti")}>📚 Cărți cu avatarul copilului</NavLink>
            <Link
              href="/creeaza-carte"
              className={`nav-link link-strong font-extrabold ${isActive(pathname, "/creeaza-carte") ? "nav-link-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              📸 Cărți cu fotografia copilului
            </Link>
            <NavLink href="/cart" active={isActive(pathname, "/cart")}>Coș 🛒</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
