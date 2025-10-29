// app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";

/**
 * Pagina de succes:
 * - ascunde total „Vezi coșul”
 * - citește sid din URL
 * - cere /api/order-files?sid=... pentru linkuri de descărcare
 * - pentru carte-custom NU afișează linkuri (se livrează în 48h)
 * - golește coșul doar o singură dată (după ce încărcăm fișierele)
 */

type OrderFileItem = {
  id: string;
  title: string;
  productId: string;
  type: "fise" | "carte" | "carte-custom";
  childName?: string | null;
};

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const clear = useCart((s) => s.clear);

  const sid = params.get("sid") || "";

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<OrderFileItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // la mount: cere fișierele; după ce primim răspuns OK, golește coșul
  useEffect(() => {
    let ignore = false;
    async function run() {
      try {
        if (!sid) {
          setItems([]);
          setLoading(false);
          return;
        }
        const res = await fetch(`/api/order-files?sid=${encodeURIComponent(sid)}`);
        const data = await res.json().catch(() => ({ items: [] }));
        if (ignore) return;

        setItems(Array.isArray(data?.items) ? data.items : []);
        setLoading(false);

        // curățăm coșul după confirmare reușită
        clear();
      } catch (e: any) {
        if (!ignore) {
          setError(e?.message || "Eroare la încărcarea fișierelor.");
          setLoading(false);
        }
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [sid, clear]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Comanda ta este în curs de pregătire</h1>
      <p className="text-gray-700">
        Mulțumim! Dacă ai ales fișe sau cărți cu avatar, găsești linkurile de descărcare mai jos.
        Pentru <b>cărțile cu fotografia copilului</b>, vei primi cartea pe email în
        <b> maximum 48h</b>. Dacă ai optat pentru tipărire, livrarea se face în
        <b> 5–7 zile lucrătoare</b>.
      </p>

      <div className="my-6 h-px bg-gray-200" />

      {loading && <div>Se încarcă fișierele…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          {items.length === 0 ? (
            <div className="text-gray-600">Nu există fișiere de descărcat pentru această comandă.</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => {
                // pentru carte-custom nu afișăm linkul — se livrează email în 48h
                const downloadable = it.type !== "carte-custom";
                return (
                  <div
                    key={it.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-white"
                  >
                    <div>
                      <div className="font-semibold">{it.title}</div>
                      {it.childName ? (
                        <div className="text-sm text-gray-600">Nume copil: {it.childName}</div>
                      ) : null}
                    </div>
                    <div>
                      {downloadable ? (
                        <a
                          className="btn-cta"
                          href={`/api/download?sid=${encodeURIComponent(sid)}&item=${encodeURIComponent(
                            it.id
                          )}`}
                        >
                          Descarcă PDF
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">
                          (Se livrează pe email în 48h)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8">
            {/* FĂRĂ „Vezi coșul” aici, doar link către produse */}
            <Link href="/" className="btn-neutral">
              Înapoi la produse
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
