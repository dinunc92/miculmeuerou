import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest){
  const { items } = await req.json();

  // map la prețuri Stripe (aici placeholder – înlocuiești cu price_id din .env)
  const priceMap: Record<string,string> = {
    "fise-3-4": process.env.STRIPE_PRICE_FISE_3_4 || "",
    "fise-4-5": process.env.STRIPE_PRICE_FISE_4_5 || "",
    "fise-5-6": process.env.STRIPE_PRICE_FISE_5_6 || "",
    "carte-ziua-lui-edy": process.env.STRIPE_PRICE_CARTE_ZIUA_LUI_EDY || "",
    "carte-fara-suzi": process.env.STRIPE_PRICE_CARTE_FARA_SUZI || "",
    "carte-vrea-sa-creasca": process.env.STRIPE_PRICE_CARTE_VREA_SA_CREASCA || ""
  };

  const line_items = items.map((i:any)=>({
    price: priceMap[i.productId],
    quantity: 1
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    metadata: {
      items: JSON.stringify(items) // vei folosi în webhook pentru livrare email
    }
  });

  return NextResponse.json({ url: session.url });
}
