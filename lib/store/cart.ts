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
export const useCart = create<CartState>((set,get)=>({
  items: [],
  add(i){
    const key = hash(i); i.key = key;
    if(get().items.find(x=>x.key===key)) return false;
    set(s=>({items:[...s.items, i]})); return true;
  },
  remove(key){ set(s=>({items:s.items.filter(x=>x.key!==key)})); },
  clear(){ set({items:[]}); }
}));
