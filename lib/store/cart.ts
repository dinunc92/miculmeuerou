// lib/store/cart.ts
"use client";

import { create } from "zustand";

export type ShippingAddress = {
  name: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
};

export type CartCustomization = {
  childName?: string;
  gender?: "boy" | "girl";
  eyeColor?: "green" | "brown" | "blue";
  hairstyle?: string;
  wantPrinted?: boolean;   // +50 RON / item
  token?: string;          // carte-custom (poza)
  age?: number;
  relation?: "mama" | "tata" | "bunica" | "bunic";
  relationName?: string;
  coverId?: string;
  selectionTitle?: string; // numele titlului ales (creează carte)
  parentEmail?: string;
  message?: string;
  selectedTitleId?: number;
  selectedTitle?: string;
};

export type CartItem = {
  key?: string;            // generat local
  productId: string;       // id din catalog (sau "creeaza-carte")
  productType: "carte" | "fise" | "carte-custom";
  title: string;
  priceRON: number;        // PDF: 29/25/40 etc. (fără tipărire)
  quantity?: number;       // default 1
  customization?: CartCustomization;
};

type Totals = {
  subtotalRON: number;     // SUMA (PDF + tipărire per produs)
  shippingRON: number;     // 15 RON O SINGURĂ DATĂ dacă există vreo tipărire
  totalRON: number;        // subtotal + shipping
};

type CartState = {
  items: CartItem[];
  address: ShippingAddress | null;

  // hidratare
  _hydrated: boolean;
  hydrateOnce(): void;

  // derivări
  count(): number;
  printedCount(): number;
  hasPrinted(): boolean;

  totals(): Totals;

  // acțiuni
  add(item: CartItem): void;
  remove(key: string): void;
  clear(): void;

  setAddress(addr: ShippingAddress | null): void;
};

const LS_CART = "cart";
const LS_ADDR = "cart_address";

function saveToLS(items: CartItem[], address: ShippingAddress | null) {
  try {
    localStorage.setItem(LS_CART, JSON.stringify(items));
    if (address) localStorage.setItem(LS_ADDR, JSON.stringify(address));
    else localStorage.removeItem(LS_ADDR);
  } catch {}
}
function loadFromLS(): { items: CartItem[]; address: ShippingAddress | null } {
  try {
    const i = JSON.parse(localStorage.getItem(LS_CART) || "[]");
    const a = JSON.parse(localStorage.getItem(LS_ADDR) || "null");
    return { items: i, address: a };
  } catch {
    return { items: [], address: null };
  }
}

const PRINT_FEE = 50;
const SHIPPING_FEE = 15;

export const useCart = create<CartState>((set, get) => ({
  items: [],
  address: null,
  _hydrated: false,

  hydrateOnce() {
    if (typeof window === "undefined") return;
    if (get()._hydrated) return;
    const { items, address } = loadFromLS();
    set({ items, address, _hydrated: true });
  },

  count() {
    return get().items.reduce((acc, it) => acc + (it.quantity ?? 1), 0);
  },

  printedCount() {
    return get().items.reduce((acc, it) => {
      const q = it.quantity ?? 1;
      return acc + (it.customization?.wantPrinted ? q : 0);
    }, 0);
  },

  hasPrinted() {
    return get().printedCount() > 0;
  },

  // IMPORTANT: tipărirea este inclusă în PREȚUL PE ARTICOL la subtotal!
  // shipping se adaugă O SINGURĂ DATĂ dacă există vreo tipărire.
  totals(): Totals {
    const items = get().items;
    const subtotal = items.reduce((s, i) => {
      const qty = i.quantity ?? 1;
      const base = i.priceRON * qty;
      const print = i.customization?.wantPrinted ? PRINT_FEE * qty : 0;
      return s + base + print;
    }, 0);

    const shipping = get().hasPrinted() ? SHIPPING_FEE : 0;
    return {
      subtotalRON: subtotal,
      shippingRON: shipping,
      totalRON: subtotal + shipping,
    };
  },

  add(item) {
    const key = `${item.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const qty = Math.max(1, item.quantity ?? 1);
    const newItem = { ...item, key, quantity: qty };
    const items = [...get().items, newItem];
    const addr = get().address;
    set({ items });
    saveToLS(items, addr);
  },

  remove(key) {
    const items = get().items.filter(i => i.key !== key);
    const addr = get().address;
    set({ items });
    saveToLS(items, addr);
  },

  clear() {
    set({ items: [], address: null });
    saveToLS([], null);
  },

  setAddress(addr) {
    const items = get().items;
    set({ address: addr });
    saveToLS(items, addr);
  },
}));
