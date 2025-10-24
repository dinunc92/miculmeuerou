// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

type BodyItem = {
  productId: string;
  productType: "carte" | "fise" | "carte-custom";
  title: string;
  priceRON: number;
  quantity?: number;
  customization?: {
    childName?: string;
    gender?: "boy"|"girl";
    eyeColor?: "green"|"brown"|"blue";
    hairstyle?: string;
    wantPrinted?: boolean;
    token?: string;
    selectedTitleId?: string;
    selectedTitle?: string;
    age?: number;
    relation?: string;
    relationName?: string;
    coverId?: string;
    parentEmail?: string;
    message?: string;
  };
};

function displayTitleFromPlaceholder(title: string, name: string){
  if (!title) return title;
  return title.replace(/\[NumeCopil\]/g, name || "Edy");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: BodyItem[] = Array.isArray(body.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json({ error: "Coșul este gol." }, { status: 400 });
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // detectăm dacă trebuie transport (o singură dată per comanda)
    const needsShipping = items.some((it) => it.customization?.wantPrinted === true);

    // mapează produsele în line_items Stripe
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((it) => {
      const qty = it.quantity && it.quantity > 0 ? it.quantity : 1;
      const childName = it.customization?.childName || "Edy";

      // Produs (nume pentru Stripe)
      const stripeTitle = displayTitleFromPlaceholder(it.title || "Produs", childName);

      // Metadata bogat (webhook-ul o să le citească)
      const metadata: Record<string, string> = {
        t: it.productType,      // tip: fise / carte / carte-custom
        p: it.productId,        // id produs din catalog
        n: childName,           // nume copil
      };
      if (it.customization?.gender)        metadata.g = it.customization.gender;
      if (it.customization?.eyeColor)      metadata.e = it.customization.eyeColor;
      if (it.customization?.hairstyle)     metadata.h  = it.customization.h;
      if (it.customization?.wantPrinted)   metadata.wp = "1";
      if (it.customization?.token)         metadata.tk = it.customization.token;
      if (it.customization?.selectedTitle) metadata.st = it.customization.selectedTitle;
      if (it.customization?.selectedTitleId) metadata.sti = it.customization.selectedTitleId;
      if (typeof it.customization?.age === "number") metadata.age = String(it.customization.age);
      if (it.customization?.relation)      metadata.rel = it.customization.relation;
      if (it.customization?.relationName)  metadata.reln = it.customization.relationName;
      if (it.customization?.coverId)       metadata.cv = it.customization.coverId;

      return {
        quantity: qty,
        price_data: {
          currency: "ron",
          unit_amount: Math.round((it.priceRON || 0) * 100),
          product_data: {
            name: stripeTitle,
            metadata,
          },
        },
      };
    });

    // linie transport o singură dată (dacă e cazul)
    if (needsShipping) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "ron",
          unit_amount: 15 * 100,
          product_data: {
            name: "Transport",
            metadata: { t: "shipping" },
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: false,  // <— elimină promo codes
      line_items,
      success_url: `${site}/success?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e:any) {
    console.error("checkout error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Eroare creare sesiune" }, { status: 500 });
  }
}
