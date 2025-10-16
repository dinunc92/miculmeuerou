"use client";
import { create } from "zustand";

type Item = {
  productId:string; productType:"fise"|"carte";
  title:string; priceRON:number;
  customization:any;
  key?: string; // hash to prevent duplicates
};
type CartState = {
  items: Item[];
  add: (i: Item) => boolean;
  remove: (key: string) => void;
  clear: ()=>void;
};
function hash(i:Item){
  return `${i.productId}-${JSON.stringify(i.customization)}`;
}

export const useCart = create<any>((set, get)=>({
  items: [],
  add: (i:any)=>{
    const items = get().items;
    const exists = items.some((x:any)=> JSON.stringify(x) === JSON.stringify(i));
    if (exists) return false;
    set({ items: [...items, i] });
    return true;
  },
  remove: (idx:number)=>{
    const items = get().items.slice();
    items.splice(idx,1);
    set({ items });
  },
  clear: ()=> set({ items: [] }),
  count: ()=> get().items.length,
}));
