import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRICE = {
  SHIPPING_FEE: 15,
};

type CartCustomization = {
  childName?: string;
  gender?: "boy" | "girl";
  eyeColor?: "green" | "brown" | "blue";
  hairstyle?: string;
  wantPrinted?: boolean;

  // creeaza-carte (foto)
  age?: number;
  relation?: "mama" | "tata" | "bunica" | "bunic";
  relationName?: string;
  coverId?: string;
  selectionTitle?: string;
  token?: string;
  // scoatem parentEmail/parentMessage din produs — email vine din checkout
  parentMessage?: string; // dacă o mai trimiți din personalizare, îl poți păstra aici
};

type CartItem = {
  productId: string;
  productType: "fise" | "carte" | "carte-custom";
  title: string;
  priceRON: number;
  quantity?: number;
  customization?: CartCustomization;
};

type ShippingAddress = {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  zip?: string;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

function stripeNameFromTitle(title: string, childName?: string) {
  return (title || "").replace(/\[NumeCopil\]/g, childName || "Edy");
}

export async function POST(req: NextRequest) {
  try {
    const { items = [], email = "", shipping = {} } = (await req.json()) as {
      items: CartItem[];
      email?: string;
      shipping?: ShippingAddress;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Coșul este gol." }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let anyPrinted = false;
    let computedTotal = 0;

    for (const item of items) {
      const qty = Math.max(1, item.quantity || 1);
      const unitRON = Math.round(item.priceRON);

      const md: Record<string, string> = {
        t: item.productType,
        p: item.productId,
        n: item.customization?.childName || "",
        g: item.customization?.gender || "",
        e: item.customization?.eyeColor || "",
        h: item.customization?.hairstyle || "",
        wp: item.customization?.wantPrinted ? "1" : "0",
        tk: item.customization?.token || "",
        st: item.customization?.selectionTitle || "",
        cv: item.customization?.coverId || "",
        age: item.customization?.age ? String(item.customization.age) : "",
        rel: item.customization?.relation || "",
        reln: item.customization?.relationName || "",
        pm: item.customization?.parentMessage || "",
      };

      const nameForStripe = stripeNameFromTitle(item.title, item.customization?.childName);

      line_items.push({
        quantity: qty,
        price_data: {
          currency: "ron",
          unit_amount: unitRON * 100,
          product_data: {
            name: nameForStripe,
            metadata: md,
          },
        },
      });

      computedTotal += unitRON * qty;
      if (item.customization?.wantPrinted) anyPrinted = true;
    }

    if (anyPrinted) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "ron",
          unit_amount: PRICE.SHIPPING_FEE * 100,
          product_data: { name: "Transport", metadata: { t: "shipping" } },
        },
      });
      computedTotal += PRICE.SHIPPING_FEE;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const mdShipping: Record<string, string> = anyPrinted
      ? {
          s_name: (shipping.name || "").slice(0, 70),
          s_phone: (shipping.phone || "").slice(0, 30),
          s_street: (shipping.street || "").slice(0, 120),
          s_city: (shipping.city || "").slice(0, 60),
          s_zip: (shipping.zip || "").slice(0, 20),
        }
      : {};

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: false,
      line_items,
      success_url: `${siteUrl}/success?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      // trimitem email la Stripe (va primi și receipt de la Stripe dacă e activ)
      customer_email: email || undefined,
      shipping_address_collection: undefined,
      metadata: {
        ...mdShipping,
        has_print: anyPrinted ? "1" : "0",
        total_ron: String(computedTotal),
        pe: (email || "").slice(0, 80), // email client la nivel de sesiune
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("checkout error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Checkout error" }, { status: 500 });
  }
}
