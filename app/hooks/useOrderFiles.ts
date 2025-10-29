// hooks/useOrderFiles.ts
"use client";
import { useEffect, useState } from "react";

export function useOrderFiles(sid?: string) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!sid) return;
    (async () => {
      const r = await fetch(`/api/order-files?sid=${sid}`);
      const d = await r.json();
      setItems(d.items || []);
    })();
  }, [sid]);
  return items.filter((i) => i.type !== "carte-custom"); // excludem cartea din fotografie
}
