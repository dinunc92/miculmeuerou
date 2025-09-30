export const currency = (v:number)=> new Intl.NumberFormat("ro-RO",{style:"currency",currency:"RON"}).format(v);
