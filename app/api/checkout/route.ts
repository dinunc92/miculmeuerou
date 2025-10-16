import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { products } from "@/data/products";
import { displayTitleFromPlaceholder } from "@/utils/title";

/**
 * REGULĂ: pentru orice carte (avatar sau custom) dacă userul bifează "varianta tipărită",
 * adăugăm +79 RON și cerem adresa + telefon în Stripe Checkout.
 */

export async function POST(req: NextRequest) {
  try {
    const txt = await req.text();
    const { items } = txt ? JSON.parse(txt) : { items: [] };
    if (!items?.length) return NextResponse.json({ error: "Coșul este gol." }, { status: 400 });

    const map = new Map(products.map((p) => [p.id, p]));

    // trebuie adresă + telefon dacă există cel puțin o carte tipărită
    const needShipping = items.some(
      (i: any) => (i.productType === "carte" || i.productType === "carte-custom") && i.customization?.wantPrinted
    );

    const line_items = items.map((i: any) => {
      const p = map.get(i.productId);
      if (!p) throw new Error(`Produs necunoscut: ${i.productId}`);

      const base = displayTitleFromPlaceholder(p.title, i.customization?.childName || "Edy");
      // +79 RON dacă a ales varianta tipărită (pentru cărți)
      const extra = (i.productType === "carte" || i.productType === "carte-custom") && i.customization?.wantPrinted ? 79 : 0;
      const unitAmount = Math.round((p.priceRON + extra) * 100);

      return {
        price_data: {
          currency: "ron",
          unit_amount: unitAmount,
          product_data: {
            name: base,
            description:
              (i.productType === "fise")
                ? "Primești fișierele PDF imediat după plată, pe email."
                : (i.customization?.wantPrinted
                    ? "Primești PDF pe email; varianta tipărită cu livrare în 5–7 zile lucrătoare."
                    : "Primești PDF pe email după plată."),
          },
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      // cer adresa + telefon DOAR dacă e bifată varianta tipărită la cel puțin o carte
      shipping_address_collection: needShipping ? { allowed_countries: ["RO"] } : undefined,
      phone_number_collection: needShipping ? { enabled: true } : undefined,
      // Texte ajutătoare pe checkout (display items + descriere per line item deja setată)
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        cart: JSON.stringify(
          items.map((i: any) => ({
            productId: i.productId,
            productType: i.productType,
            childName: i.customization?.childName || "",
            gender: i.customization?.gender || "",
            eye: i.customization?.eye || "",
            hairstyle: i.customization?.hairstyle || "",
            // pentru carte custom:
            age: i.customization?.age || "",
            relation: i.customization?.relation || "",
            relationName: i.customization?.relationName || "",
            customTitleId: i.customization?.customTitleId || "",
            wantPrinted: i.customization?.wantPrinted ? "yes" : "no",
            // dacă ai implementat upload foto → trimite aici un token/URL scurt
            photoUrl: i.customization?.photoUrl || "",
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Eroare la inițierea plății." }, { status: 400 });
  }
}
