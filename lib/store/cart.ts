// lib/store/cart.ts
import { create } from "zustand";

type CartItem = {
  key?: string;
  productId: string;
  productType: "carte"|"fise"|"carte-custom";
  title: string;
  priceRON: number;
  customization?: any;
};
type CartState = {
  items: CartItem[];
  add: (i: CartItem) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  add: (i) => set((s) => {
    const key = crypto.randomUUID();
    return { items: [...s.items, { ...i, key }] };
  }),
  remove: (key) => set((s) => ({ items: s.items.filter(x => x.key !== key) })),
  clear: () => set({ items: [] }),
}));
