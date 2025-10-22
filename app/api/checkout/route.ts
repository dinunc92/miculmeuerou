// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { byId } from "@/data/products";
import { PRICE } from "@/config/pricing";
import { displayTitleSafe } from "@/utils/title";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-04-10" });

type CheckoutItem = {
  productId: string;
  productType: "carte" | "fise" | "carte-custom";
  quantity?: number;
  stripeName?: string;
  customization?: {
    childName?: string;
    gender?: string;
    eyeColor?: string;
    hairColor?: string;
    hairstyle?: string;
    wantPrinted?: boolean;
    token?: string;            // <— pentru carte-custom (fotografie)
    // age?: number | string;
    // relation?: string;
    // relationName?: string;
    // coverId?: string;
    // message?: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const items = (body?.items || []) as CheckoutItem[];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Lipsesc items." }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let needShipping = false;

    for (const it of items) {
      const p = byId(it.productId);
      if (!p) {
        return NextResponse.json({ error: `Produs necunoscut: ${it.productId}` }, { status: 400 });
      }

      const q = Math.max(1, Math.min(10, Number(it.quantity || 1)));
      const childName = it.customization?.childName || "";
      const wantPrinted = !!it.customization?.wantPrinted;

      if ((it.productType === "carte" || it.productType === "carte-custom") && wantPrinted) {
        needShipping = true;
      }

      const extra =
        (it.productType === "carte" || it.productType === "carte-custom") && wantPrinted
          ? PRICE.PRINTED_EXTRA
          : 0;

      const unitRON = p.priceRON + extra;
      const stripeName = it.stripeName || displayTitleSafe(p.title, childName);

      const md: Record<string, string> = {
        p: it.productId,
        t: it.productType,
      };
      if (childName) md.n = childName;
      if (it.customization?.gender) md.g = it.customization.gender!;
      if (it.customization?.eyeColor) md.e = it.customization.eyeColor!;
      if (it.customization?.hairColor) md.hc = it.customization.hairColor!;
      if (it.customization?.hairstyle) md.h = it.customization.hairstyle!;
      if (wantPrinted) md.wp = "1";
      if (it.productType === "carte-custom" && it.customization?.token) md.tk = it.customization.token;

      line_items.push({
        quantity: q,
        price_data: {
          currency: "ron",
          product_data: {
            name: stripeName,
            metadata: md,
          },
          unit_amount: Math.round(unitRON * 100),
        },
      });
    }

    // transport 15 RON o singură dată
    if (needShipping) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "ron",
          product_data: {
            name: "Transport",
            metadata: { t: "shipping" },
          },
          unit_amount: Math.round(PRICE.SHIPPING_FEE * 100),
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items,
      success_url: `${siteUrl}/success?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      phone_number_collection: { enabled: needShipping },
      shipping_address_collection: needShipping
        ? { allowed_countries: ["RO"] }
        : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("checkout error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Eroare creare sesiune Stripe" }, { status: 500 });
  }
}
