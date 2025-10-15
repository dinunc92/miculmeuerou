import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { products } from "@/data/products";
import { displayTitleFromPlaceholder } from "@/utils/title";

export async function POST(req: NextRequest){
  try{
    const txt = await req.text();
    const { items } = txt ? JSON.parse(txt) : { items: [] };
    if(!items?.length) return NextResponse.json({ error:"Coșul este gol." }, { status:400 });

    const map = new Map(products.map(p=>[p.id, p]));
    const anyBook = items.some((i:any)=> i.productType === "carte" || i.productType === "carte-custom");

    const line_items = items.map((i:any)=>{
      const p = map.get(i.productId);
      if(!p) throw new Error(`Produs necunoscut: ${i.productId}`);
      const name = displayTitleFromPlaceholder(p.title, i.productType, i.customization?.childName || "");
      const unitAmount = Math.round((p.priceRON || 0) * 100);
      return { price_data: { currency: "ron", unit_amount: unitAmount, product_data: { name } }, quantity: 1 };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      shipping_address_collection: anyBook ? { allowed_countries: ["RO"] } : undefined,
      phone_number_collection: { enabled: true },
      metadata: {
        cart: JSON.stringify(items.map((i:any)=>({
          productId: i.productId,
          productType: i.productType,
          childName: i.customization?.childName || "",
          gender: i.customization?.gender || "boy",
          eye: i.customization?.eye || "green",
          hairstyle: i.customization?.hairstyle || "",
          // pentru carte-custom:
          age: i.customization?.age || "",
          relation: i.customization?.relation || "",
          relationName: i.customization?.relationName || "",
          customTitleId: i.customization?.customTitleId || "",
          wantPrinted: i.customization?.wantPrinted ? "yes" : "no"
        })))
      }
    });

    return NextResponse.json({ url: session.url });
  }catch(e:any){
    return NextResponse.json({ error: e.message || "Eroare la inițierea plății." }, { status: 400 });
  }
}
