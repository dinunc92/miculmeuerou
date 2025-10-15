// app/cancel/page.tsx
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold mb-2">Plata a fost anulată</h1>
      <p className="text-gray-700">Nu s-a debitat nimic. Poți încerca din nou oricând.</p>
      <div className="mt-8">
        <Link href="/cart" className="btn-cta">Înapoi la coș</Link>
      </div>
    </div>
  );
}
